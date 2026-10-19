# QT Video 1.1 · Stories com ASMR

A versão do vídeo 1.1 que roda no anúncio de reserva nos Stories do Instagram. A placa de `2026` entra logo depois do forno, como segunda cena, e a trilha é um ASMR da cozinha, feito por síntese, sem música. Nenhum texto na imagem: a advertência de álcool vai no texto principal do anúncio.

| | |
|---|---|
| Campanha | reserva pelo site, só nos Stories do Instagram, com o botão do anúncio levando ao site de reservas |
| Gancho | o forno aceso e, logo em seguida, a placa do `17º` lugar no 50 Top Pizza World `2026` |
| Placa | a foto da de `2026`, endireitada, com a cor do vídeo e um avanço lento de câmera, por `1,5` s; a de `2025` sai |
| Duração | `19,19` s, com `22` planos |
| Som | ASMR: fogo de lenha baixo o tempo todo e o som de cada gesto no quadro em que ele acontece |
| Texto | nenhum na imagem; a advertência de álcool fica no texto principal do anúncio |

Para gerar, com a foto `placa-2026.jpg` na mesma pasta do vídeo, fora do Git:

```bash
node anuncios-qt/edicao.mjs anuncios-qt/edicoes/qt-video-1-1-stories.md "QT - VIDEO 1.1V31.mov" "QT video 1.1 stories asmr.mp4"
```

A montagem tira a placa de `2025`, que ia de `8,09` a `8,92` s no original, e põe a de `2026` logo depois do primeiro plano.

```montagem
0,00 a 0,83
foto placa por 1,50 s
0,83 a 8,09
8,92 a 18,52
```

```quadro
plano: placa
foto: placa-2026.jpg
giro: 1,4
recorte: 540, 960, 465, 741
zoom: 1,04 a 1,12
tom: quente
```

O som é feito por síntese pelo [`asmr.py`](../asmr.py), em sincronia com os quadros do vídeo já montado: cada trecho termina no corte, e cada batida cai no quadro do contato. A força vai de `0` a `1`, e `0,5` fica `6` dB abaixo de `1`. A placa e a parede de prêmios ficam só com o forno ao fundo, para respirar.

```som
0,00 a 19,19 | ambiente | 0,06 | o ar da casa, quase inaudível
0,00 a 19,19 | fogo | 0,2 | o forno a lenha, baixo, do começo ao fim
0,00 a 0,83 | fogo | 0,75 | o forno de perto
0,00 a 0,40 | pá | 0,5 | a pá raspando no lastro
0,83 a 2,34 | fogo | 0,25 | o forno ainda ao fundo, na placa
2,34 a 3,54 | espalhar | 0,8 | a colher espalhando o molho em círculos
3,84 | gelo | 0,75 | a laranja seca pousando no gelo
4,15 | bisnaga | 0,55 | a bisnaga pingando o creme
4,45 | bisnaga | 0,45
4,80 | bisnaga | 0,4
5,28 | crocante | 0,8 | a pinça apertando a focaccia
5,62 | crocante | 0,45
6,13 a 7,09 | chiado | 0,3 | a margherita recém-saída do forno
6,15 a 6,55 | folha | 0,45 | o dedo ajeitando o manjericão
6,82 a 7,07 | folha | 0,7 | a mão pousando a última folha
7,09 a 8,17 | servir | 0,9 | o drink caindo sobre o gelo
8,18 a 9,01 | fogo | 0,7 | de volta ao forno
8,18 a 8,90 | labareda | 0,45
9,01 a 9,59 | fogo | 0,25 | o forno ao fundo, na parede de prêmios
9,59 a 10,51 | chiado | 0,6 | a pizza de perto
10,78 | massa | 0,8 | o bloco de massa pousando na farinha
11,35 a 12,01 | casca | 0,55 | a casca de limão na borda do copo
12,01 a 12,85 | molho | 0,45 | o molho de perto
13,10 | colherada | 0,8 | a colher pousando o tartare
13,88 | faca | 0,8 | a faca no tomate, batendo na tábua
14,25 | faca | 0,7
14,53 | tapa | 0,95 | a massa batendo na bancada
15,10 a 15,72 | papel | 0,6 | a carta de vinhos
15,78 a 16,43 | dosador | 0,8 | o dosador enchendo a coqueteleira
16,43 a 16,93 | deslizar | 0,55 | o copo deslizando no balcão até parar
16,93 | gelo | 0,35 | o gelo se acomodando
17,14 a 18,18 | crosta | 0,45 | a pizza vista de cima
18,19 a 19,19 | fogo | 0,6 | o forno no fim, com a marca
18,19 a 19,19 | labareda | 1 | a chama subindo
```
