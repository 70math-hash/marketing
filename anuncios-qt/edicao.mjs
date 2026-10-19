// Põe o texto na pegada da camiseta sobre um vídeo que já chegou editado, sem mexer nos
// cortes. Cada bloco quadro do roteiro de edição vale para um trecho do vídeo: o gancho,
// a prova, a chamada, a advertência, ou uma foto que entra no lugar de um plano.
//
// Uso:  node anuncios-qt/edicao.mjs <roteiro-de-edicao.md> <video> [saida.mp4]
//       --audio trilha.mp3   troca a trilha; sem ele, fica o som do próprio vídeo
//       --faixas [reels|stories]  marca as faixas que a interface cobre, para revisão;
//                                 sem o nome, as do Reels
//       --limpo              sem nenhum texto: só as fotos que trocam planos
//       --blocos placa,advertência   só os blocos com esses nomes na linha plano
//       --mudo               sem som: uma faixa de áudio em silêncio, para pôr a música depois
//
// O roteiro de edição usa as linhas tempo, texto e cartao dos roteiros, e o tempo vem em
// segundos do vídeo, com vírgula: o bloco vale do primeiro quadro em que o tempo já chegou
// ao início até o último quadro antes do fim. Para trocar um plano por uma foto:
//   foto: placa.jpg            na mesma pasta do vídeo
//   giro: 1,4                  graus no sentido horário, para endireitar
//   recorte: 540, 960, 465, 741   largura, altura, x e y, em pixels da foto já girada
//   zoom: 1 a 1,06             o avanço lento de câmera, do começo ao fim do trecho
//   tom: quente                a cor do resto do vídeo
// O som sai em -14 LUFS, o padrão para rede social. Precisa do ffmpeg.

import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join, dirname, basename, extname, isAbsolute } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { SANS, abrirNavegador } from './pdf-qt.mjs';
import { lerQuadro, camadas, cssStoryboard } from './storyboard.mjs';

const posicionais = [];
let trilha = null;
let faixas = null;
let limpo = false;
let escolhidos = null;
let mudo = false;
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--audio') trilha = args[++i];
  else if (args[i] === '--faixas') faixas = ['reels', 'stories'].includes(args[i + 1]) ? args[++i] : 'reels';
  else if (args[i] === '--limpo') limpo = true;
  else if (args[i] === '--blocos') escolhidos = args[++i].split(',').map(s => s.trim());
  else if (args[i] === '--mudo') mudo = true;
  else posicionais.push(args[i]);
}
const [roteiro, video, saidaPedida] = posicionais;
if (!roteiro || !video) {
  console.error('uso: node anuncios-qt/edicao.mjs <roteiro-de-edicao.md> <video> [saida.mp4] [--audio trilha | --mudo] [--limpo | --blocos a,b] [--faixas reels|stories]');
  process.exit(1);
}
const saida = saidaPedida || join(dirname(video), `${basename(video, extname(video))}-qt${limpo ? '-limpo' : ''}${mudo ? '-mudo' : ''}${faixas ? `-faixas-${faixas}` : ''}.mp4`);

const sonda = (...a) => execFileSync('ffprobe', ['-v', 'error', ...a, '-of', 'csv=p=0', video]).toString().trim();
const duracao = Number(sonda('-show_entries', 'format=duration'));
const qps = sonda('-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate');
const fps = qps.split('/').map(Number).reduce((a, b) => a / b);
const totalQuadros = Number(sonda('-count_packets', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_packets'));
const segundos = v => v.toFixed(2).replace('.', ',');
const num = s => Number(String(s).trim().replace(',', '.'));

// nos Stories, o topo tem a barra de progresso e o nome da conta, e o pé tem o botão do anúncio
const FAIXAS_STORIES = '<rect x="0" y="0" width="1080" height="250" fill="#EFECEC" opacity=".18"/>' +
  '<rect x="0" y="1580" width="1080" height="340" fill="#EFECEC" opacity=".18"/>';

// a foto de celular sai neutra e clara; o vídeo de cinema, quente e com as bordas mais escuras
const TONS = { quente: 'colorchannelmixer=rr=1.12:gg=1.03:bb=0.95,vignette=angle=PI/6' };

const blocos = [...readFileSync(roteiro, 'utf8').matchAll(/```quadro\n([\s\S]*?)```/g)].map(m => lerQuadro(m[1]))
  .filter(q => !limpo || q.foto)
  .filter(q => !escolhidos || escolhidos.includes(q.plano));
for (const q of blocos) {
  if (!(q.fim > q.inicio)) throw new Error(`bloco "${q.plano}" sem tempo válido: ${q.tempo}`);
  if (q.fim > duracao + 0.05) throw new Error(`bloco "${q.plano}" termina em ${segundos(q.fim)} s, depois do fim do vídeo (${segundos(duracao)} s)`);
  if (q.tom && !TONS[q.tom]) throw new Error(`bloco "${q.plano}": tom "${q.tom}" não existe; use ${Object.keys(TONS).join(', ')}`);
  // o trecho em quadros: do primeiro quadro que já chegou ao início ao último antes do fim
  q.de = Math.ceil(q.inicio * fps - 1e-6);
  q.ate = Math.min(totalQuadros, Math.floor(q.fim * fps + 1e-6) + 1);
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
  for (const [k, q] of blocos.entries()) {
    if (!q.textos.length && !q.cartao) continue;
    q.png = join(tmp, `bloco-${k + 1}.png`);
    await camada(camadas(q, k).textos, q.png);
  }
  let pngFaixas = null;
  if (faixas) {
    pngFaixas = join(tmp, 'faixas.png');
    const desenho = faixas === 'stories' ? FAIXAS_STORIES : camadas({ textos: [] }, 0).faixas;
    await camada(`<svg viewBox="0 0 1080 1920" width="1080" height="1920">${desenho}</svg>`, pngFaixas);
  }

  // ---------- o vídeo em trechos, um por combinação de blocos, emendados no fim ----------
  // cortar por número de quadro, e não por tempo, deixa cada texto e cada foto no quadro exato
  const marcos = [...new Set([0, totalQuadros, ...blocos.flatMap(q => [q.de, q.ate])])]
    .filter(m => m >= 0 && m <= totalQuadros).sort((a, b) => a - b);
  const trechos = marcos.slice(0, -1).map((de, i) => ({ de, ate: marcos[i + 1] }));
  const ativos = t => blocos.filter(q => q.de <= t.de && t.ate <= q.ate);

  const entradas = ['-i', video];
  const filtros = [];
  const novaEntrada = (...a) => { entradas.push(...a); return entradas.filter(x => x === '-i').length - 1; };

  // a foto vira um clipe com o número exato de quadros do trecho, com o avanço de câmera
  const fotos = blocos.filter(q => q.foto);
  for (const q of fotos) {
    const n = q.ate - q.de;
    const [z0, z1] = (q.zoom || '1 a 1,06').match(/[\d,.]+/g).map(num);
    const giro = q.giro ? `rotate=a=${num(q.giro)}*PI/180:ow=iw:oh=ih,` : '';
    const recorte = q.recorte ? `crop=${q.recorte.split(',').map(v => Math.round(num(v))).join(':')},` : '';
    const usos = trechos.filter(t => ativos(t).includes(q)).length;
    const e = novaEntrada('-loop', '1', '-framerate', qps, '-i', isAbsolute(q.foto) ? q.foto : join(dirname(video), q.foto));
    filtros.push(`[${e}:v]${giro}${recorte}scale=2160:3840:force_original_aspect_ratio=increase:flags=lanczos,crop=2160:3840,` +
      `zoompan=z='${z0}+${(z1 - z0).toFixed(4)}*on/${Math.max(1, n - 1)}':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=${qps},` +
      `trim=end_frame=${n},setsar=1${q.tom ? `,${TONS[q.tom]}` : ''},format=yuv420p,split=${usos}` +
      Array.from({ length: usos }, (_, u) => `[foto${fotos.indexOf(q)}_${u}]`).join(''));
    q.usos = 0;
  }

  filtros.push(`[0:v]split=${trechos.length}` + trechos.map((_, i) => `[m${i}]`).join(''));
  trechos.forEach((t, i) => {
    const doTrecho = ativos(t);
    const foto = doTrecho.find(q => q.foto);
    let atual;
    if (foto) {
      filtros.push(`[m${i}]nullsink`);
      filtros.push(`[foto${fotos.indexOf(foto)}_${foto.usos++}]trim=start_frame=${t.de - foto.de}:end_frame=${t.ate - foto.de},setpts=PTS-STARTPTS[b${i}]`);
    } else {
      filtros.push(`[m${i}]trim=start_frame=${t.de}:end_frame=${t.ate},setpts=PTS-STARTPTS,setsar=1,format=yuv420p[b${i}]`);
    }
    atual = `b${i}`;
    const pngs = [...doTrecho.filter(q => q.png).map(q => q.png), ...(pngFaixas ? [pngFaixas] : [])];
    pngs.forEach((png, k) => {
      const e = novaEntrada('-i', png);
      filtros.push(`[${atual}][${e}:v]overlay=0:0[t${i}_${k}]`);
      atual = `t${i}_${k}`;
    });
    filtros.push(`[${atual}]settb=AVTB,format=yuv420p[s${i}]`);
  });
  filtros.push(trechos.map((_, i) => `[s${i}]`).join('') + `concat=n=${trechos.length}:v=1:a=0[v]`);

  // ---------- o som: a trilha nova ou a do vídeo, em -14 LUFS ----------
  const nivel = 'loudnorm=I=-14:TP=-1.5:LRA=11';
  if (mudo) {
    filtros.push(`anullsrc=channel_layout=stereo:sample_rate=48000,atrim=0:${duracao}[a]`);
  } else if (trilha) {
    const e = novaEntrada('-i', trilha);
    const fade = Math.min(1.2, duracao / 4);
    filtros.push(`[${e}:a]atrim=0:${duracao},asetpts=PTS-STARTPTS,afade=t=out:st=${(duracao - fade).toFixed(3)}:d=${fade},${nivel}[a]`);
  } else {
    filtros.push(`[0:a]${nivel}[a]`);
  }

  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...entradas,
    '-filter_complex', filtros.join(';'),
    '-map', '[v]', '-map', '[a]', '-r', qps,
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-t', String(duracao), '-movflags', '+faststart', saida],
  { stdio: ['ignore', 'ignore', 'inherit'] });

  console.log(`salvo: ${saida} · ${segundos(duracao)} s · ${blocos.filter(q => q.png).length} blocos de texto · ${fotos.length} foto(s)` +
    (mudo ? ' · sem som' : trilha ? ` · trilha ${basename(trilha)}` : ' · som do vídeo'));
} finally {
  await navegador.close();
  rmSync(tmp, { recursive: true, force: true });
}
