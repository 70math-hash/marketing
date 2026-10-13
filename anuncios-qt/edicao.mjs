// Põe o texto na pegada da camiseta sobre um vídeo que já chegou editado, sem mexer nos
// cortes. Cada bloco quadro do roteiro de edição é um texto num trecho do vídeo: o gancho,
// a prova, a chamada, a advertência.
//
// Uso:  node anuncios-qt/edicao.mjs <roteiro-de-edicao.md> <video> [saida.mp4]
//       --audio trilha.mp3   troca a trilha; sem ele, fica o som do próprio vídeo
//       --faixas [reels|stories]  marca as faixas que a interface cobre, para revisão;
//                                 sem o nome, as do Reels
//
// O roteiro de edição usa as linhas tempo, texto e cartao dos roteiros, e o tempo vem em
// segundos do vídeo, com vírgula. O som sai em -14 LUFS, o padrão para rede social.
// Precisa do ffmpeg.

import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join, dirname, basename, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { SANS, abrirNavegador } from './pdf-qt.mjs';
import { lerQuadro, camadas, cssStoryboard } from './storyboard.mjs';

const posicionais = [];
let trilha = null;
let faixas = null;
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--audio') trilha = args[++i];
  else if (args[i] === '--faixas') faixas = ['reels', 'stories'].includes(args[i + 1]) ? args[++i] : 'reels';
  else posicionais.push(args[i]);
}
const [roteiro, video, saidaPedida] = posicionais;
if (!roteiro || !video) {
  console.error('uso: node anuncios-qt/edicao.mjs <roteiro-de-edicao.md> <video> [saida.mp4] [--audio trilha] [--faixas reels|stories]');
  process.exit(1);
}
const saida = saidaPedida || join(dirname(video), `${basename(video, extname(video))}-qt${faixas ? `-faixas-${faixas}` : ''}.mp4`);

const duracao = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video]).toString().trim());
const segundos = v => v.toFixed(2).replace('.', ',');

// nos Stories, o topo tem a barra de progresso e o nome da conta, e o pé tem o botão do anúncio
const FAIXAS_STORIES = '<rect x="0" y="0" width="1080" height="250" fill="#EFECEC" opacity=".18"/>' +
  '<rect x="0" y="1580" width="1080" height="340" fill="#EFECEC" opacity=".18"/>';

const blocos = [...readFileSync(roteiro, 'utf8').matchAll(/```quadro\n([\s\S]*?)```/g)].map(m => lerQuadro(m[1]));
for (const q of blocos) {
  if (!(q.fim > q.inicio)) throw new Error(`bloco "${q.plano}" sem tempo válido: ${q.tempo}`);
  if (q.fim > duracao + 0.05) throw new Error(`bloco "${q.plano}" termina em ${segundos(q.fim)} s, depois do fim do vídeo (${segundos(duracao)} s)`);
}

// ---------- o texto de cada bloco vira um png transparente no tamanho do vídeo ----------
const tmp = mkdtempSync(join(tmpdir(), 'edicao-'));
const navegador = await abrirNavegador();
const pagina = await navegador.newPage({ viewport: { width: 1080, height: 1920 } });
const css = `html, body { margin: 0; background: transparent; font-family: ${SANS}; }
${cssStoryboard}
.q-quadro { width: 1080px; height: 1920px; aspect-ratio: auto; border: 0; background: transparent; }`;

async function camada(html, arquivo) {
  await pagina.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head>` +
    `<body><div class="q-quadro">${html}</div></body></html>`);
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.screenshot({ path: arquivo, omitBackground: true });
}

try {
  const sobreposicoes = [];
  for (const [k, q] of blocos.entries()) {
    const arquivo = join(tmp, `bloco-${k + 1}.png`);
    await camada(camadas(q, k).textos, arquivo);
    sobreposicoes.push({ arquivo, inicio: q.inicio, fim: q.fim });
  }
  if (faixas) {
    const arquivo = join(tmp, 'faixas.png');
    const desenho = faixas === 'stories' ? FAIXAS_STORIES : camadas({ textos: [] }, 0).faixas;
    await camada(`<svg viewBox="0 0 1080 1920" width="1080" height="1920">${desenho}</svg>`, arquivo);
    sobreposicoes.push({ arquivo, inicio: 0, fim: duracao });
  }

  // ---------- cada png entra só no seu trecho, em corte seco ----------
  const entradas = ['-i', video];
  const filtros = [];
  let atual = '0:v';
  sobreposicoes.forEach(({ arquivo, inicio, fim }, k) => {
    entradas.push('-i', arquivo);
    filtros.push(`[${atual}][${k + 1}:v]overlay=0:0:enable='between(t,${inicio},${fim})'[v${k}]`);
    atual = `v${k}`;
  });

  // ---------- o som: a trilha nova ou a do vídeo, em -14 LUFS ----------
  const nivel = 'loudnorm=I=-14:TP=-1.5:LRA=11';
  let somMapa;
  if (trilha) {
    entradas.push('-i', trilha);
    const fade = Math.min(1.2, duracao / 4);
    filtros.push(`[${sobreposicoes.length + 1}:a]atrim=0:${duracao},asetpts=PTS-STARTPTS,afade=t=out:st=${(duracao - fade).toFixed(3)}:d=${fade},${nivel}[a]`);
    somMapa = '[a]';
  } else {
    filtros.push(`[0:a]${nivel}[a]`);
    somMapa = '[a]';
  }

  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...entradas,
    '-filter_complex', filtros.join(';'),
    '-map', atual === '0:v' ? '0:v' : `[${atual}]`, '-map', somMapa,
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-t', String(duracao), '-movflags', '+faststart', saida],
  { stdio: ['ignore', 'ignore', 'inherit'] });

  console.log(`salvo: ${saida} · ${segundos(duracao)} s · ${blocos.length} blocos de texto` + (trilha ? ` · trilha ${basename(trilha)}` : ' · som do vídeo'));
} finally {
  await navegador.close();
  rmSync(tmp, { recursive: true, force: true });
}
