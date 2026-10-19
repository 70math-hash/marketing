#!/usr/bin/env python3
"""
Gera a trilha ASMR de um vídeo a partir do bloco som do roteiro de edição: o forno a lenha
baixo o tempo todo e o som de cada gesto no quadro em que ele acontece. Tudo por síntese,
sem nenhuma gravação: ruído filtrado, estalos, bolhas e ressonâncias, com uma cozinha
pequena por cima para os sons morarem no mesmo lugar.

Uso: python3 anuncios-qt/asmr.py <roteiro-de-edicao.md> [--duracao 19,19] [--saida trilha.wav]

O bloco som tem uma linha por som, com o tempo em segundos do vídeo já montado:
  2,34 a 3,54 | espalhar | 0,8 | a colher espalhando o molho   trecho: o som dura o trecho
  3,84 | gelo | 0,75 | a laranja pousando no gelo              batida: o contato cai no tempo
A força vai de 0 a 1: 1 é o som mais forte da trilha, 0,5 fica 6 dB abaixo. A quarta
coluna é só uma nota para quem lê.

Sons de trecho: ambiente, fogo, labareda, pá, espalhar, folha, chiado, servir, casca,
molho, papel, dosador, deslizar, crosta.
Sons de batida: gelo, bisnaga, crocante, massa, colherada, faca, tapa.

Sem --duracao, a trilha acaba no fim do último som. Sai um WAV de 48 kHz, estéreo, em
-14 LUFS e com pico real abaixo de -1,5 dBTP, o mesmo padrão do edicao.mjs, que chama este
script sozinho quando o roteiro tem o bloco som. Precisa de numpy e scipy.
"""
import re, sys, zlib
from pathlib import Path
import numpy as np
from scipy import signal, ndimage
from scipy.io import wavfile

SR = 48000
REF = -20.0               # sonoridade de um som com força 1, em janelas de 100 ms, antes da master
CRISTA = {'trecho': 11.0, 'batida': 10.0}  # o pico de cada som, no máximo, acima da sonoridade dele
ALVO, TETO = -14.0, -1.5  # LUFS integrado e pico real da trilha pronta


# ---------- peças ----------
def tempo(n):
    return np.arange(n) / SR


def filtro(x, tipo, f, ordem=2):
    return signal.sosfilt(signal.butter(ordem, f, tipo, fs=SR, output='sos'), x)


def rms(x):
    return np.sqrt(np.mean(np.square(x))) + 1e-12


def norm(x):
    return x / rms(x)


def pico(x):
    return x / (np.abs(x).max() + 1e-12)


def ruido(rng, n):
    return rng.standard_normal(n)


def rosa(rng, n):
    espectro = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    f[0] = f[1]
    return np.fft.irfft(espectro / np.sqrt(f), n)


def marrom(rng, n):
    return signal.lfilter([1], [1, -0.995], rng.standard_normal(n))


def somar(y, x, i):
    """soma x em y a partir da amostra i, cortando o que passar das bordas"""
    a, b = max(0, i), min(len(y), i + len(x))
    if b > a:
        y[a:b] += x[a - i:b - i]


def controle(rng, n, hz):
    """um sinal lento e aleatório, de média 0 e desvio 1: o som respira em vez de ficar parado"""
    pad = int(3000 / hz)
    m = max(int(n / SR * 1000) + 2, int(10000 / hz))
    c = signal.sosfilt(signal.butter(2, hz, 'lowpass', fs=1000, output='sos'), rng.standard_normal(m + pad))[pad:]
    c = (c - c.mean()) / (c.std() + 1e-12)
    return np.interp(np.arange(n) / SR * 1000, np.arange(len(c)), c)


def entre(c, base, mexe, chao=0.0):
    """um controle virando um ganho: base mais ou menos mexe, sem passar do chão"""
    return np.clip(base + mexe * c, chao, None)


def ataque_decai(n, ataque, tau):
    t = tempo(n)
    return np.minimum(1, t / max(ataque, 1e-6)) * np.exp(-t / tau)


def ressoar(x, freqs, q, ganhos):
    y = np.zeros_like(x)
    for f, g in zip(freqs, ganhos):
        b, a = signal.iirpeak(f, q, fs=SR)
        y += g * signal.lfilter(b, a, x)
    return y


def modos(rng, freqs, taus, amps, desvio=0.03):
    """uma batida ressonante: senos que morrem cada um no seu tempo, os agudos primeiro"""
    n = int(max(taus) * 7 * SR)
    t = tempo(n)
    y = np.zeros(n)
    for f, tau, a in zip(freqs, taus, amps):
        f *= 1 + desvio * rng.standard_normal()
        y += a * np.sin(2 * np.pi * f * t + rng.random() * 2 * np.pi) * np.exp(-t / tau)
    y[:16] *= np.linspace(0, 1, 16)
    return pico(y)


def rajada(rng, n, banda, ataque, tau):
    """um sopro curto de ruído numa faixa, para cliques, sopros e baques"""
    return norm(filtro(ruido(rng, n), 'bandpass', banda)) * ataque_decai(n, ataque, tau)


def estalos(rng, n, taxa, banda, dur, alfa=1.8, teto=12, tipos=8):
    """estalos curtíssimos em tempos ao acaso: muitos pequenos e poucos grandes, como madeira,
    farinha ou gordura. A taxa é por segundo, um número só ou um valor por amostra"""
    taxa = np.broadcast_to(np.asarray(taxa, float), (n,))
    onde = np.nonzero(rng.random(n) < taxa / SR)[0]
    y = np.zeros(n)
    if not len(onde):
        return y
    forca = np.minimum((1 - rng.random(len(onde))) ** (-1 / alfa), teto) * rng.choice([-1, 1], len(onde))
    qual = rng.integers(tipos, size=len(onde))
    for k in range(tipos):
        tau = rng.uniform(*dur)
        m = int(tau * 7 * SR) + 16
        centro = np.exp(rng.uniform(np.log(banda[0] * 1.2), np.log(banda[1] / 1.2)))
        nucleo = pico(filtro(ruido(rng, m), 'bandpass', [centro / 1.6, min(centro * 1.6, SR / 2.1)]) * np.exp(-tempo(m) / tau))
        trem = np.zeros(n)
        trem[onde[qual == k]] = forca[qual == k]
        y += signal.fftconvolve(trem, nucleo)[:n]
    return y


def bolhas(rng, n, taxa, fmin, fmax, xi=0.1, subida=0.0, beta=1.5):
    """bolhas de líquido, no modelo de van den Doel: um seno que sobe de tom e some em
    milissegundos. Bolha pequena é aguda (Minnaert: 3,26 kHz dividido pelo raio em mm); com
    subida, o tom de todas sobe ao longo do trecho, como num copo enchendo"""
    taxa = np.broadcast_to(np.asarray(taxa, float), (n,))
    onde = np.nonzero(rng.random(n) < taxa / SR)[0]
    y = np.zeros(n + SR // 5)
    rmin, rmax = 3260 / fmax, 3260 / fmin
    raio = rmin * (rmax / rmin) ** (rng.random(len(onde)) ** beta)
    f0 = 3260 / raio * (1 + subida * onde / n)
    amortece = 0.13 * f0 + 0.0072 * f0 ** 1.5
    amp = (raio / rmax) ** 0.8 * rng.uniform(0.4, 1.0, len(onde))
    for i, f, d, a in zip(onde, f0, amortece, amp):
        t = tempo(int(min(0.1, 7 / d) * SR))
        y[i:i + len(t)] += a * np.sin(2 * np.pi * f * (t + 0.5 * xi * f * t * t)) * np.exp(-d * t)
    return y[:n]


# ---------- os sons de trecho: recebem o número de amostras ----------
def s_ambiente(rng, n):
    # o ar da casa: ruído rosa macio, quase no limite do que se ouve
    return np.array([filtro(rosa(rng, n), 'bandpass', [120, 4000]) for _ in range(2)])


def s_fogo(rng, n):
    # o forno a lenha: o ronco que respira, a chama lambendo, a seiva chiando e os estalos da
    # madeira, cada lado com os seus. O grave fica contido: no alto-falante do celular ele some,
    # e o que diz fogo é o estalo
    sopro = controle(rng, n, 0.7)
    canais = []
    for _ in range(2):
        ronco = norm(filtro(marrom(rng, n), 'bandpass', [90, 450])) * entre(sopro + 0.4 * controle(rng, n, 3), 1, 0.3, 0.2)
        lambida = norm(filtro(ruido(rng, n), 'bandpass', [400, 1800])) * entre(controle(rng, n, 6), 0.5, 0.4, 0.05)
        miudos = estalos(rng, n, 9 * entre(controle(rng, n, 1.2), 1, 0.7, 0.1), (2000, 11000), (0.00012, 0.0006), teto=5)
        graudos = estalos(rng, n, 0.9, (700, 3500), (0.0015, 0.005), alfa=2.2, teto=4)
        seiva = norm(filtro(ruido(rng, n), 'bandpass', [3000, 8000])) * entre(controle(rng, n, 2), 0.5, 0.4, 0.05)
        canais.append(0.35 * ronco + 0.45 * lambida + 0.08 * seiva + 1.4 * miudos + 1.8 * graudos)
    return np.array(canais)


def s_labareda(rng, n):
    # a chama subindo: um sopro que cresce em um décimo de segundo e assenta, com estalos junto
    t = tempo(n)
    env = (1 - np.exp(-t / 0.09)) * np.exp(-t / max(0.4, n / SR * 0.7))
    env /= env.max()
    canais = []
    for _ in range(2):
        grave = norm(filtro(marrom(rng, n), 'bandpass', [80, 400]))
        medio = norm(filtro(ruido(rng, n), 'bandpass', [300, 1500]))
        agudo = norm(filtro(ruido(rng, n), 'bandpass', [1500, 5000]))
        mexe = entre(controle(rng, n, 7), 1, 0.3, 0.2)
        ch = (grave * (0.35 + 0.35 * env) + 0.8 * medio * env ** 1.3 + 0.25 * agudo * env ** 2) * mexe
        canais.append(ch + 1.2 * estalos(rng, n, 6 + 40 * env, (1500, 9000), (0.0002, 0.001), teto=5))
    return np.array(canais)


def s_pa(rng, n):
    # a pá de metal raspando no lastro: atrito granulado, um corpo médio e o metal soando
    t = tempo(n)
    env = np.minimum(1, t / 0.015) * np.exp(-t / max(0.08, n / SR * 0.4))
    grao = np.abs(filtro(ruido(rng, n), 'bandpass', [120, 500]))
    grao = 0.4 + 0.4 * grao / grao.std()
    atrito = norm(filtro(ruido(rng, n), 'bandpass', [1500, 7500])) * grao
    corpo = norm(filtro(ruido(rng, n), 'bandpass', [300, 1000])) * grao
    metal = norm(ressoar(atrito, [1150, 2650, 4300], 40, [1, 0.7, 0.5]))
    return (atrito + 0.5 * corpo + 0.2 * metal) * env


def s_espalhar(rng, n):
    # a colher espalhando o molho em círculos: um chiado molhado que segue a pressão da mão,
    # com o molho grudando e soltando em bolhinhas
    t = tempo(n)
    pressao = entre(0.2 * np.sin(2 * np.pi * 1.1 * t + rng.random() * 6.3) + 0.12 * controle(rng, n, 3), 0.75, 1, 0.2)
    base = norm(filtro(ruido(rng, n), 'bandpass', [300, 2400])) * pressao
    corpo = norm(filtro(ruido(rng, n), 'bandpass', [120, 450])) * pressao
    molhado = norm(bolhas(rng, n, 90 * pressao, 900, 3600, xi=0.08))
    return 0.55 * base + 0.3 * corpo + 0.6 * molhado


def s_folha(rng, n):
    # o manjericão sendo ajeitado: um farfalhar leve e agudo, que sobe e desce com a mão
    gesto = np.sin(np.pi * np.linspace(0, 1, n)) ** 0.8
    roca = norm(filtro(ruido(rng, n), 'bandpass', [2500, 11000])) * gesto * entre(controle(rng, n, 40), 0.5, 0.5)
    return roca + 2.5 * pico(estalos(rng, n, 40 * gesto, (3000, 11000), (0.0001, 0.0004), alfa=2))


def s_chiado(rng, n):
    # a pizza recém-saída do forno: o chiado fino do queijo e do azeite borbulhando
    vida = entre(controle(rng, n, 2), 1, 0.3, 0.3)
    fino = norm(estalos(rng, n, 1100 * vida, (3500, 13000), (0.00005, 0.00025), alfa=2.5, teto=5))
    gotas = pico(estalos(rng, n, 14 * vida, (1800, 6000), (0.0006, 0.002), alfa=2, teto=5))
    chia = norm(filtro(ruido(rng, n), 'highpass', 5000)) * vida
    return fino + 3 * gotas + 0.25 * chia


def s_servir(rng, n):
    # o drink caindo sobre o gelo: o filete, as bolhas subindo de tom com o copo enchendo e o
    # gelo trincando
    fluxo = entre(controle(rng, n, 3), 1, 0.12, 0.4)
    agua = norm(bolhas(rng, n, 280 * fluxo, 650, 3600, xi=0.1, subida=0.18))
    filete = norm(filtro(ruido(rng, n), 'bandpass', [1500, 8000])) * fluxo
    trinca = pico(estalos(rng, n, 5, (2500, 7500), (0.0004, 0.0015), alfa=1.8, teto=6))
    return agua + 0.25 * filete + 1.5 * trinca


def s_casca(rng, n):
    # a casca de limão esfregada na borda do copo: um atrito úmido e o cristal cantando baixinho
    t = tempo(n)
    vai_vem = 0.35 + 0.65 * np.abs(np.sin(2 * np.pi * 0.9 * t + rng.random() * 6.3))
    atrito = norm(filtro(ruido(rng, n), 'bandpass', [1500, 7000])) * vai_vem * entre(controle(rng, n, 120), 1, 0.5)
    canto = norm(ressoar(atrito, [1180, 2730, 4650], 150, [1, 0.6, 0.4]))
    y = atrito + 0.18 * canto * vai_vem
    m = int(0.05 * SR)
    somar(y, 0.6 * norm(filtro(ruido(rng, m), 'highpass', 5000)) * ataque_decai(m, 0.003, 0.012), 0)
    return y


def s_molho(rng, n):
    # o molho cru de perto: um movimento grosso e lento, com uma ou outra bolha pesada
    grosso = norm(filtro(ruido(rng, n), 'bandpass', [150, 900])) * entre(controle(rng, n, 1.2), 0.6, 0.35, 0.1)
    return 0.5 * grosso + 2.5 * pico(bolhas(rng, n, 3, 200, 520, xi=0.04))


def s_papel(rng, n):
    # a carta de vinhos na mão: o papel grosso roçando e estalando
    gesto = (0.5 + 0.5 * np.tanh(controle(rng, n, 2.5))) ** 1.5
    roca = norm(filtro(ruido(rng, n), 'bandpass', [700, 7000])) * gesto
    return 0.5 * roca + 3 * pico(estalos(rng, n, 160 * gesto, (1500, 9000), (0.0001, 0.0007), alfa=1.7, teto=5))


def s_dosador(rng, n):
    # o dosador enchendo a coqueteleira de metal: filete fino, bolhas agudas e a lata ressoando
    t = tempo(n)
    fluxo = np.minimum(1, t / 0.06) * (0.75 + 0.25 * t / t[-1]) * entre(controle(rng, n, 5), 1, 0.1)
    agua = norm(bolhas(rng, n, 330 * fluxo, 1200, 5200, xi=0.12, subida=0.15))
    filete = norm(filtro(ruido(rng, n), 'bandpass', [1800, 9000])) * fluxo
    lata = norm(ressoar(agua + 0.2 * filete, [980, 2310, 3870, 5640], 25, [1, 0.8, 0.6, 0.4]))
    y = agua + 0.22 * filete + 0.25 * lata
    somar(y, 0.6 * modos(rng, [2620, 4130, 6870], [0.16, 0.1, 0.06], [1, 0.6, 0.4]), 0)
    return y


def s_deslizar(rng, n):
    # o copo deslizando no balcão de pedra até parar, com o gelo tilintando
    t = tempo(n)
    vel = np.clip(1 - t / t[-1], 0, 1) ** 0.7
    grao = np.abs(filtro(ruido(rng, n), 'bandpass', [90, 400]))
    atrito = norm(filtro(ruido(rng, n), 'bandpass', [250, 2600])) * vel * (0.5 + 0.5 * grao / grao.std())
    y = atrito + 0.2 * norm(ressoar(atrito, [1640, 3330], 90, [1, 0.6])) * vel
    for onde in sorted(rng.uniform(0.15, 0.8, 2)):
        tilinta = modos(rng, np.array([2300, 3850, 5500]) * rng.uniform(0.9, 1.1), [0.025, 0.018, 0.012], [1, 0.6, 0.4])
        somar(y, 1.5 * tilinta, int(onde * n))
    return y


def s_crosta(rng, n):
    # a crosta esfriando: estalos secos esparsos sobre um chiado bem fino
    vida = entre(controle(rng, n, 1.5), 1, 0.5, 0.1)
    secos = pico(estalos(rng, n, 30 * vida, (1500, 8000), (0.0002, 0.0012), alfa=1.7, teto=5))
    fino = norm(estalos(rng, n, 250 * vida, (4000, 12000), (0.00005, 0.0002), alfa=2.5, teto=4))
    return 4 * secos + 0.3 * fino


# ---------- os sons de batida: devolvem o som e a amostra do contato ----------
def s_gelo(rng):
    # algo pousando no gelo: um toque seco e o gelo se acomodando contra o copo
    pre = int(0.002 * SR)
    y = np.zeros(int(0.8 * SR))
    somar(y, 0.6 * pico(filtro(ruido(rng, 400), 'bandpass', [2500, 9000]) * np.exp(-tempo(400) / 0.001)), pre)
    for atraso, forca in [(0, 1), (rng.uniform(0.03, 0.05), 0.5), (rng.uniform(0.1, 0.16), 0.3)]:
        gelo = modos(rng, np.array([2300, 3850, 5500, 7400]) * rng.uniform(0.9, 1.12), [0.03, 0.022, 0.015, 0.01], [1, 0.7, 0.5, 0.3])
        copo = modos(rng, np.array([1580, 3240, 5150]) * rng.uniform(0.97, 1.03), [0.2, 0.13, 0.08], [1, 0.7, 0.5])
        somar(y, forca * gelo, pre + int(atraso * SR))
        somar(y, 0.22 * forca * copo, pre + int(atraso * SR))
    return y, pre


def s_bisnaga(rng):
    # a bisnaga pingando uma gota de creme: um psst curto e molhado, e a ponta soltando
    pre = int(0.008 * SR)
    y = np.zeros(int(0.32 * SR))
    m = int(0.12 * SR)
    env = ataque_decai(m, 0.012, 0.045)
    psst = norm(filtro(ruido(rng, m), 'bandpass', [1200, 6000])) * env * entre(controle(rng, m, 80), 0.7, 0.3, 0.2)
    somar(y, 0.6 * psst + 2 * pico(bolhas(rng, m, 120 * env, 700, 2500, xi=0.06)), 0)
    somar(y, 0.8 * rajada(rng, 600, [1500, 5000], 0.0005, 0.002), int(0.13 * SR))
    return y, pre


def s_crocante(rng):
    # a crosta da focaccia cedendo sob a pinça: duas ou três quebras de estalos secos e um corpo curto
    pre = int(0.003 * SR)
    n = int(0.4 * SR)
    t = tempo(n)
    taxa = np.zeros(n)
    for k in range(rng.integers(2, 4)):
        i = pre + (int(rng.uniform(0.04, 0.16) * SR) if k else 0)
        taxa[i:] += (1500 if k == 0 else 900) * np.exp(-t[:n - i] / rng.uniform(0.015, 0.04))
    quebra = pico(estalos(rng, n, taxa, (1200, 9000), (0.0001, 0.0006), alfa=2.2, teto=5))
    corpo = np.zeros(n)
    somar(corpo, pico(rajada(rng, n - pre, [200, 900], 0.002, 0.03)), pre)
    return quebra + 0.35 * corpo, pre


def s_massa(rng):
    # o bloco de massa pousando na farinha: a mão chegando, um baque macio, o sopro de farinha
    # e a mão soltando a massa
    pre = int(0.2 * SR)
    y = np.zeros(pre + int(0.6 * SR))
    y[:pre] += 0.12 * norm(filtro(ruido(rng, pre), 'bandpass', [250, 1500])) * np.linspace(0, 1, pre) ** 2
    m = len(y) - pre
    baque = norm(filtro(ruido(rng, m), 'lowpass', 300)) * ataque_decai(m, 0.003, 0.05)
    tapa = rajada(rng, m, [350, 1600], 0.002, 0.022)
    sopro = rajada(rng, m, [900, 6000], 0.01, 0.12)
    farinha = pico(estalos(rng, m, 250 * np.exp(-tempo(m) / 0.07), (3000, 10000), (0.0001, 0.0004)))
    y[pre:] += baque + 0.6 * tapa + 0.25 * sopro + 0.8 * farinha
    somar(y, 0.3 * rajada(rng, 1200, [800, 4000], 0.003, 0.006), pre + int(0.2 * SR))
    return y, pre


def s_colherada(rng):
    # a colher pousando o tartare: um amasso molhado, a colher raspando e soltando
    pre = int(0.01 * SR)
    y = np.zeros(pre + int(0.7 * SR))
    m = len(y) - pre
    amasso = rajada(rng, m, [300, 2600], 0.004, 0.06)
    corpo = norm(filtro(ruido(rng, m), 'lowpass', 350)) * ataque_decai(m, 0.003, 0.03)
    estalo = pico(bolhas(rng, m, 500 * np.exp(-tempo(m) / 0.03), 1000, 3600, xi=0.08))
    y[pre:] += amasso + 0.5 * corpo + 1.5 * estalo
    k = int(0.18 * SR)
    raspa = norm(filtro(ruido(rng, k), 'bandpass', [2000, 7000])) * np.sin(np.pi * np.linspace(0, 1, k)) ** 1.5
    somar(y, 0.35 * raspa * entre(controle(rng, k, 90), 0.6, 0.4), pre + int(0.22 * SR))
    somar(y, 0.4 * rajada(rng, 720, [1000, 4000], 0.002, 0.004), pre + int(0.44 * SR))
    return y, pre


def s_faca(rng):
    # a faca no tomate: a pele cedendo, a polpa e a lâmina batendo na tábua
    pre = int(0.07 * SR)
    y = np.zeros(pre + int(0.3 * SR))
    somar(y, 0.4 * pico(filtro(ruido(rng, 600), 'highpass', 3500) * np.exp(-tempo(600) / 0.0025)), 0)
    k = pre - int(0.015 * SR)
    polpa = norm(filtro(ruido(rng, k), 'bandpass', [500, 3000])) * np.linspace(0.3, 1, k) + 2 * pico(bolhas(rng, k, 300, 900, 3200))
    somar(y, 0.35 * polpa, int(0.015 * SR))
    somar(y, modos(rng, [230, 590, 1270, 2400], [0.022, 0.015, 0.01, 0.006], [1, 0.8, 0.5, 0.3]), pre)
    somar(y, 0.7 * pico(rajada(rng, 96, [1000, 8000], 0.0001, 0.0005)), pre)
    somar(y, 0.12 * modos(rng, [3450, 5750], [0.03, 0.02], [1, 0.7]), pre)
    return y, pre


def s_tapa(rng):
    # a massa batendo na bancada: o ar da queda, o tapa, o molhado e a massa arrastando
    pre = int(0.12 * SR)
    y = np.zeros(pre + int(0.45 * SR))
    y[:pre] += 0.12 * norm(filtro(ruido(rng, pre), 'bandpass', [200, 1200])) * np.linspace(0, 1, pre) ** 2
    m = len(y) - pre
    corpo = norm(filtro(ruido(rng, m), 'lowpass', 350)) * ataque_decai(m, 0.0015, 0.05)
    estalo = rajada(rng, m, [700, 3200], 0.0008, 0.016)
    molhado = pico(bolhas(rng, m, 600 * np.exp(-tempo(m) / 0.03), 900, 3200, xi=0.07))
    y[pre:] += corpo + 0.9 * estalo + 1.2 * molhado
    somar(y, 1.2 * pico(rajada(rng, 48, [500, 9000], 0.0001, 0.0004)), pre)
    k = int(0.22 * SR)
    arrasto = norm(filtro(ruido(rng, k), 'bandpass', [400, 2600])) * np.sin(np.pi * np.linspace(0, 1, k))
    somar(y, 0.2 * arrasto, pre + int(0.03 * SR))
    return y, pre


# nome: (som, trecho ou batida, posição no estéreo de -1 a 1, quanto vai para a sala)
SONS = {
    'ambiente': (s_ambiente, 'trecho', 0, 0), 'fogo': (s_fogo, 'trecho', 0, 0),
    'labareda': (s_labareda, 'trecho', 0, 0), 'pá': (s_pa, 'trecho', 0, 0.1),
    'espalhar': (s_espalhar, 'trecho', 0, 0.05), 'folha': (s_folha, 'trecho', 0.2, 0.04),
    'chiado': (s_chiado, 'trecho', 0, 0.03), 'servir': (s_servir, 'trecho', 0, 0.08),
    'casca': (s_casca, 'trecho', 0.15, 0.1), 'molho': (s_molho, 'trecho', 0, 0.05),
    'papel': (s_papel, 'trecho', 0.1, 0.06), 'dosador': (s_dosador, 'trecho', -0.15, 0.1),
    'deslizar': (s_deslizar, 'trecho', 0, 0.1), 'crosta': (s_crosta, 'trecho', 0, 0.04),
    'gelo': (s_gelo, 'batida', 0.1, 0.12), 'bisnaga': (s_bisnaga, 'batida', -0.1, 0.06),
    'crocante': (s_crocante, 'batida', 0, 0.08), 'massa': (s_massa, 'batida', 0, 0.1),
    'colherada': (s_colherada, 'batida', 0, 0.08), 'faca': (s_faca, 'batida', -0.1, 0.12),
    'tapa': (s_tapa, 'batida', 0, 0.12),
}
LEITOS = {'ambiente', 'fogo'}


# ---------- sonoridade, como no BS.1770 ----------
def k_ponderado(x):
    x = signal.lfilter([1.53512485958697, -2.69169618940638, 1.19839281085285], [1.0, -1.69065929318241, 0.73248077421585], x, axis=-1)
    return signal.lfilter([1.0, -2.0, 1.0], [1.0, -1.99004745483398, 0.99007225036621], x, axis=-1)


def blocos(x, janela=0.4, passo=0.1):
    """a potência ponderada em janelas de 400 ms, de 100 em 100 ms"""
    p = np.square(k_ponderado(np.atleast_2d(x))).sum(axis=0)
    w, h = int(janela * SR), int(passo * SR)
    if len(p) < w:
        p = np.pad(p, (0, w - len(p)))
    c = np.concatenate([[0], np.cumsum(p)])
    i = np.arange(0, len(p) - w + 1, h)
    return (c[i + w] - c[i]) / w


def lufs(potencia):
    return -0.691 + 10 * np.log10(potencia + 1e-20)


def curta(x):
    """a sonoridade mais alta em janelas de 100 ms: para som curto, é o que o ouvido sente"""
    return lufs(blocos(x, 0.1, 0.01).max())


def integrada(x):
    b = blocos(x)
    b = b[lufs(b) > -70]
    return lufs(b[lufs(b) > lufs(b.mean()) - 10].mean())


def pico_real(x):
    return 20 * np.log10(np.abs(signal.resample_poly(x, 4, 1, axis=-1)).max() + 1e-12)


# ---------- a sala, a mixagem e a master ----------
def sala():
    """uma cozinha pequena de azulejo: as primeiras reflexões e uma cauda de meio segundo, com
    os agudos morrendo antes dos graves"""
    rng = np.random.default_rng(7)
    n = int(0.6 * SR)
    t = tempo(n)
    canais = []
    for c in range(2):
        r = ruido(rng, n)
        x = (filtro(r, 'lowpass', 700) * np.exp(-t * 6.91 / 0.5) + filtro(r, 'bandpass', [700, 4000]) * np.exp(-t * 6.91 / 0.4) +
             filtro(r, 'highpass', 4000) * np.exp(-t * 6.91 / 0.2))
        x[:int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
        for atraso, g in [(0.0045, 0.9), (0.0071, 0.6), (0.0113, 0.5), (0.0167, 0.35), (0.0231, 0.25)]:
            x[int((atraso + 0.0009 * c) * SR)] += 2.5 * g * rng.choice([-1, 1])
        canais.append(x / np.sqrt(np.sum(x * x)))
    return np.array(canais)


def mixar(deixas, dur):
    n = int(round(dur * SR))
    mix = np.zeros((2, n))
    envio = np.zeros(n)
    for k, d in enumerate(deixas):
        som, modo, pan, quanto_sala = SONS[d['tipo']]
        rng = np.random.default_rng(zlib.crc32(f"{k}|{d['tipo']}|{d['inicio']}".encode()))
        if modo == 'trecho':
            y, pre = som(rng, int(round((d['fim'] - d['inicio']) * SR))), 0
        else:
            y, pre = som(rng)
        y = np.atleast_2d(np.asarray(y, float))
        # os picos que passam da crista são segurados, como faz o técnico de som em cada efeito,
        # e a força leva o som até a sonoridade de referência, menos o que ela pede
        y = limitar(y, curta(y) + CRISTA[modo], 0.03 if modo == 'batida' else 0.05)[0]
        y = y * 10 ** ((REF + 20 * np.log10(d['forca']) - curta(y)) / 20)
        # bordas: o trecho entra e sai no corte, sem estalo; a batida morre sozinha
        m = y.shape[1]
        entra, sai = (0.04, 0.04) if d['tipo'] in LEITOS else (0.004, 0.015) if modo == 'trecho' else (0.0005, 0.01)
        a, b = int(entra * SR), int(sai * SR)
        y[:, :a] *= np.linspace(0, 1, a)
        y[:, m - b:] *= np.linspace(1, 0, b)
        if y.shape[0] == 1:
            angulo = (np.clip(pan + rng.uniform(-0.1, 0.1), -1, 1) + 1) * np.pi / 4
            y = np.vstack([y[0] * np.cos(angulo), y[0] * np.sin(angulo)])
        i = int(round(d['inicio'] * SR)) - pre
        for c in range(2):
            somar(mix[c], y[c], i)
        somar(envio, quanto_sala * y.mean(axis=0), i)
    ir = sala()
    mix += np.array([signal.fftconvolve(envio, ir[c])[:n] for c in range(2)])
    # a trilha entra sem estalo e some nos últimos 0,35 s
    a, f = int(0.003 * SR), int(0.35 * SR)
    mix[:, :a] *= np.linspace(0, 1, a)
    mix[:, -f:] *= np.cos(np.linspace(0, np.pi / 2, f)) ** 2
    return mix


def limitar(x, teto_db, solta=0.06):
    """limitador de pico real: mede com 4 vezes mais amostras, olha 2 ms adiante, segura o
    ganho e devolve devagar"""
    n = x.shape[1]
    picos = np.abs(signal.resample_poly(x, 4, 1, axis=-1)).max(axis=0)[:4 * n].reshape(n, 4).max(axis=1)
    pede = np.minimum(1, 10 ** (teto_db / 20) / np.maximum(picos, 1e-12))
    a = int(0.002 * SR)
    pede = ndimage.uniform_filter1d(ndimage.minimum_filter1d(pede, 2 * a + 1), a + 1).tolist()
    volta = np.exp(-1 / (solta * SR))
    g, atual = [], 1.0
    for p in pede:
        atual = min(p, 1 - (1 - atual) * volta)
        g.append(atual)
    g = np.array(g)
    return x * g, -20 * np.log10(g.min())


def masterizar(mix):
    mix = filtro(mix, 'highpass', 30)
    ganho = ALVO - integrada(mix)
    for _ in range(5):
        y, reducao = limitar(mix * 10 ** (ganho / 20), TETO - 0.3)
        erro = ALVO - integrada(y)
        if abs(erro) < 0.05:
            break
        ganho += erro
    return y, reducao


# ---------- o roteiro ----------
def numero(s):
    return float(s.strip().replace(',', '.'))


def ler(md):
    bloco = re.search(r'```som\n(.*?)```', md, re.S)
    if not bloco:
        sys.exit('o roteiro não tem bloco som')
    deixas = []
    for linha in bloco.group(1).splitlines():
        if not linha.strip() or linha.strip().startswith('#'):
            continue
        partes = [p.strip() for p in linha.split('|')]
        t = re.match(r'^([\d,.]+)(?:\s*a\s*([\d,.]+))?\s*s?$', partes[0])
        tipo = partes[1] if len(partes) > 1 else ''
        if not t or tipo not in SONS:
            sys.exit(f'som: linha não entendida, "{linha.strip()}"; os sons são {", ".join(SONS)}')
        d = {'tipo': tipo, 'inicio': numero(t.group(1)), 'forca': numero(partes[2]) if len(partes) > 2 else 1.0}
        if SONS[tipo][1] == 'trecho':
            if not t.group(2) or numero(t.group(2)) <= d['inicio']:
                sys.exit(f'som: "{tipo}" é de trecho e pede início a fim, "{linha.strip()}"')
            d['fim'] = numero(t.group(2))
        elif t.group(2):
            sys.exit(f'som: "{tipo}" é de batida e pede um tempo só, o do contato, "{linha.strip()}"')
        if not 0 < d['forca'] <= 1:
            sys.exit(f'som: a força vai de 0 a 1, "{linha.strip()}"')
        deixas.append(d)
    return deixas


def principal():
    args, opcoes = [], {}
    argv = sys.argv[1:]
    while argv:
        a = argv.pop(0)
        if a in ('--duracao', '--saida'):
            opcoes[a[2:]] = argv.pop(0)
        else:
            args.append(a)
    if not args:
        sys.exit('uso: python3 anuncios-qt/asmr.py <roteiro-de-edicao.md> [--duracao 19,19] [--saida trilha.wav]')
    roteiro = Path(args[0])
    deixas = ler(roteiro.read_text(encoding='utf-8'))
    dur = numero(opcoes['duracao']) if 'duracao' in opcoes else max(d.get('fim', d['inicio'] + 0.5) for d in deixas)
    saida = Path(opcoes.get('saida', roteiro.with_name(roteiro.stem + '-asmr.wav')))
    y, reducao = masterizar(mixar(deixas, dur))
    rng = np.random.default_rng(1)
    pcm = np.round(y.T * 32767 + rng.random(y.T.shape) - rng.random(y.T.shape))
    wavfile.write(saida, SR, np.clip(pcm, -32768, 32767).astype(np.int16))
    virgula = lambda v: f'{v:.1f}'.replace('.', ',')
    print(f'salvo: {saida} · {virgula(dur)} s · {len(deixas)} sons · {virgula(integrada(y))} LUFS · '
          f'pico real {virgula(pico_real(y))} dBTP · limitador até {virgula(reducao)} dB')


if __name__ == '__main__':
    principal()
