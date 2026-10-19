// Põe o texto na pegada da camiseta sobre um vídeo que já chegou editado. Cada bloco quadro
// do roteiro de edição vale para um trecho do vídeo: o gancho, a prova, a chamada, a
// advertência, ou uma foto que entra no lugar de um plano. Um bloco montagem, se houver,
// muda a ordem dos planos antes.
//
// Uso:  node anuncios-qt/edicao.mjs <roteiro-de-edicao.md> <video> [saida.mp4]
//       --audio trilha.wav   troca a trilha; sem ele, vale o bloco som do roteiro, se houver,
//                            ou fica o som do próprio vídeo
//       --mudo               sem som: uma faixa de áudio em silêncio, para pôr a música depois
//       --limpo              sem nenhum texto: só as fotos que trocam planos
//       --blocos placa,advertência   só os blocos com esses nomes na linha plano
//       --faixas [reels|stories]  marca as faixas que a interface cobre, para revisão;
//                                 sem o nome, as do Reels
//
// O roteiro de edição usa as linhas tempo, texto e cartao dos roteiros, e o tempo vem em
// segundos do vídeo, com vírgula: o bloco vale do primeiro quadro em que o tempo já chegou
// ao início até o último quadro antes do fim. Para trocar um plano por uma foto:
//   foto: placa.jpg            na mesma pasta do vídeo
//   giro: 1,4                  graus no sentido horário, para endireitar
//   recorte: 540, 960, 465, 741   largura, altura, x e y, em pixels da foto já girada
//   zoom: 1 a 1,06             o avanço lento de câmera, do começo ao fim do trecho
//   tom: quente                a cor do resto do vídeo
//
// Para mudar a ordem, o bloco montagem lista os trechos do vídeo original, em segundos e
// na ordem nova, e as fotos que entram entre eles, pelo nome do bloco e com a duração:
//   0,00 a 0,83
//   foto placa por 1,50 s
//   0,83 a 8,09
// Com montagem, os tempos dos outros blocos valem para o vídeo já remontado.
//
// O bloco som vira a trilha: um ASMR feito por síntese no asmr.py, com um som por gesto, no
// tempo do vídeo já remontado. O som sai em -14 LUFS, o padrão para rede social, com um ganho
// só, medido antes, para a trilha guardar a dinâmica. Precisa do ffmpeg, e o bloco som, do
// Python com numpy e scipy.

import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join, dirname, basename, extname, isAbsolute } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
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
const [roteiro, original, saidaPedida] = posicionais;
if (!roteiro || !original) {
  console.error('uso: node anuncios-qt/edicao.mjs <roteiro-de-edicao.md> <video> [saida.mp4] [--audio trilha | --mudo] [--limpo | --blocos a,b] [--faixas reels|stories]');
  process.exit(1);
}
const saida = saidaPedida || join(dirname(original), `${basename(original, extname(original))}-qt${limpo ? '-limpo' : ''}${mudo ? '-mudo' : ''}${faixas ? `-faixas-${faixas}` : ''}.mp4`);

const segundos = v => v.toFixed(2).replace('.', ',');
const num = s => Number(String(s).trim().replace(',', '.'));
const ffmpeg = a => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...a], { stdio: ['ignore', 'ignore', 'inherit'] });

function sondar(arquivo) {
  const s = (...a) => execFileSync('ffprobe', ['-v', 'error', ...a, '-of', 'csv=p=0', arquivo]).toString().trim();
  const qps = s('-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate');
  return {
    duracao: Number(s('-show_entries', 'format=duration')),
    qps,
    fps: qps.split('/').map(Number).reduce((a, b) => a / b),
    totalQuadros: Number(s('-count_packets', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_packets')),
    temSom: s('-select_streams', 'a', '-show_entries', 'stream=index') !== '',
  };
}
const duracaoDe = arquivo => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', arquivo]).toString().trim());

// mede a sonoridade antes e devolve o loudnorm que só aplica um ganho, sem comprimir
function nivel(entrada, cadeia) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', entrada, '-map', '0:a:0', '-af',
    `${cadeia}loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json`, '-f', 'null', '-'], { encoding: 'utf8' });
  const m = JSON.parse(r.stderr.slice(r.stderr.lastIndexOf('{'), r.stderr.lastIndexOf('}') + 1));
  return `loudnorm=I=-14:TP=-1.5:LRA=${Math.max(11, Math.ceil(Number(m.input_lra)) + 1)}:measured_I=${m.input_i}:` +
    `measured_LRA=${m.input_lra}:measured_TP=${m.input_tp}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
}

// o primeiro quadro que já chegou ao tempo t, e o quadro logo depois do último antes de t
const quadroDe = (t, fps) => Math.ceil(t * fps - 1e-6);
const quadroAte = (t, fps, total) => Math.min(total, Math.floor(t * fps + 1e-6) + 1);

// nos Stories, o topo tem a barra de progresso e o nome da conta, e o pé tem o botão do anúncio
const FAIXAS_STORIES = '<rect x="0" y="0" width="1080" height="250" fill="#EFECEC" opacity=".18"/>' +
  '<rect x="0" y="1580" width="1080" height="340" fill="#EFECEC" opacity=".18"/>';

// a foto de celular sai neutra e clara; o vídeo de cinema, quente e com as bordas mais escuras
const TONS = { quente: 'colorchannelmixer=rr=1.12:gg=1.03:bb=0.95,vignette=angle=PI/6' };

const caminhoFoto = q => isAbsolute(q.foto) ? q.foto : join(dirname(original), q.foto);

// a foto vira um clipe com o número exato de quadros, com o avanço lento de câmera
function cadeiaFoto(q, entrada, n, qps, saidas) {
  const [z0, z1] = (q.zoom || '1 a 1,06').match(/[\d,.]+/g).map(num);
  const giro = q.giro ? `rotate=a=${num(q.giro)}*PI/180:ow=iw:oh=ih,` : '';
  const recorte = q.recorte ? `crop=${q.recorte.split(',').map(v => Math.round(num(v))).join(':')},` : '';
  return `[${entrada}:v]${giro}${recorte}scale=2160:3840:force_original_aspect_ratio=increase:flags=lanczos,crop=2160:3840,` +
    `zoompan=z='${z0}+${(z1 - z0).toFixed(4)}*on/${Math.max(1, n - 1)}':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=${qps},` +
    `trim=end_frame=${n},setsar=1${q.tom ? `,${TONS[q.tom]}` : ''},format=yuv420p${saidas}`;
}

const md = readFileSync(roteiro, 'utf8');
const todos = [...md.matchAll(/```quadro\n([\s\S]*?)```/g)].map(m => lerQuadro(m[1]));
for (const q of todos) {
  if (q.tom && !TONS[q.tom]) throw new Error(`bloco "${q.plano}": tom "${q.tom}" não existe; use ${Object.keys(TONS).join(', ')}`);
}
const textoMontagem = (md.match(/```montagem\n([\s\S]*?)```/) || [])[1];
const temBlocoSom = /```som\n/.test(md);

// ---------- a montagem: os planos na ordem nova, com as fotos entre eles ----------
// cada trecho do original é uma entrada própria, aberta já no ponto certo, para nada ficar
// guardado na memória quando a ordem muda
function remontar(info, pasta) {
  const fmtA = 'aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo';
  const silencio = (n, rotulo) => `anullsrc=channel_layout=stereo:sample_rate=48000,atrim=0:${(n / info.fps).toFixed(6)},${fmtA}[${rotulo}]`;
  const itens = textoMontagem.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    let m = l.match(/^foto\s+(.+?)\s+por\s+([\d,.]+)\s*s?$/);
    if (m) {
      const q = todos.find(b => b.plano === m[1] && b.foto);
      if (!q) throw new Error(`montagem: não há bloco com foto chamado "${m[1]}"`);
      q.naMontagem = true;
      return { foto: q, n: Math.round(num(m[2]) * info.fps) };
    }
    m = l.match(/^([\d,.]+)\s*a\s*([\d,.]+)/);
    if (!m) throw new Error(`montagem: linha não entendida, "${l}"`);
    const de = quadroDe(num(m[1]), info.fps);
    return { de, n: quadroAte(num(m[2]), info.fps, info.totalQuadros) - de };
  });

  const entradas = [];
  const filtros = [];
  const pares = itens.map((it, i) => {
    if (it.foto) {
      entradas.push('-loop', '1', '-framerate', info.qps, '-i', caminhoFoto(it.foto));
      filtros.push(cadeiaFoto(it.foto, i, it.n, info.qps, `,settb=AVTB[v${i}]`), silencio(it.n, `a${i}`));
    } else {
      // abre meio quadro antes, para o primeiro quadro que sai ser exatamente o pedido
      entradas.push('-ss', Math.max(0, (it.de - 0.5) / info.fps).toFixed(6), '-i', original);
      filtros.push(`[${i}:v]trim=end_frame=${it.n},setpts=PTS-STARTPTS,setsar=1,format=yuv420p,settb=AVTB[v${i}]`);
      filtros.push(info.temSom
        ? `[${i}:a]atrim=start=${it.de > 0 ? (0.5 / info.fps).toFixed(6) : 0}:duration=${(it.n / info.fps).toFixed(6)},asetpts=PTS-STARTPTS,${fmtA}[a${i}]`
        : silencio(it.n, `a${i}`));
    }
    return `[v${i}][a${i}]`;
  });
  filtros.push(pares.join('') + `concat=n=${itens.length}:v=1:a=1[v][a]`);
  const base = join(pasta, 'montagem.mkv');
  ffmpeg([...entradas, '-filter_complex', filtros.join(';'), '-map', '[v]', '-map', '[a]', '-r', info.qps,
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '12', '-pix_fmt', 'yuv420p', '-c:a', 'pcm_s16le', base]);
  return base;
}

const tmp = mkdtempSync(join(tmpdir(), 'edicao-'));
let video = original;
let info = sondar(original);
if (textoMontagem) {
  video = remontar(info, tmp);
  info = sondar(video);
}
const { duracao, qps, fps, totalQuadros } = info;

// o bloco som vira a trilha, na duração exata do vídeo pronto
if (temBlocoSom && !trilha && !mudo) {
  trilha = join(tmp, 'asmr.wav');
  execFileSync('python3', [fileURLToPath(new URL('./asmr.py', import.meta.url)), roteiro, '--duracao', String(duracao), '--saida', trilha],
    { stdio: ['ignore', 'inherit', 'inherit'] });
}

const blocos = todos.filter(q => !q.naMontagem)
  .filter(q => !limpo || q.foto)
  .filter(q => !escolhidos || escolhidos.includes(q.plano));
for (const q of blocos) {
  if (!(q.fim > q.inicio)) throw new Error(`bloco "${q.plano}" sem tempo válido: ${q.tempo}`);
  if (q.fim > duracao + 0.05) throw new Error(`bloco "${q.plano}" termina em ${segundos(q.fim)} s, depois do fim do vídeo (${segundos(duracao)} s)`);
  q.de = quadroDe(q.inicio, fps);
  q.ate = quadroAte(q.fim, fps, totalQuadros);
}

// ---------- o texto de cada bloco vira um png transparente no tamanho do vídeo ----------
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

  const fotos = blocos.filter(q => q.foto);
  for (const q of fotos) {
    const usos = trechos.filter(t => ativos(t).includes(q)).length;
    const e = novaEntrada('-loop', '1', '-framerate', qps, '-i', caminhoFoto(q));
    filtros.push(cadeiaFoto(q, e, q.ate - q.de, qps, `,split=${usos}` +
      Array.from({ length: usos }, (_, u) => `[foto${fotos.indexOf(q)}_${u}]`).join('')));
    q.usos = 0;
  }

  filtros.push(`[0:v]split=${trechos.length}` + trechos.map((_, i) => `[m${i}]`).join(''));
  trechos.forEach((t, i) => {
    const doTrecho = ativos(t);
    const foto = doTrecho.find(q => q.foto);
    if (foto) {
      filtros.push(`[m${i}]nullsink`);
      filtros.push(`[foto${fotos.indexOf(foto)}_${foto.usos++}]trim=start_frame=${t.de - foto.de}:end_frame=${t.ate - foto.de},setpts=PTS-STARTPTS[b${i}]`);
    } else {
      filtros.push(`[m${i}]trim=start_frame=${t.de}:end_frame=${t.ate},setpts=PTS-STARTPTS,setsar=1,format=yuv420p[b${i}]`);
    }
    let atual = `b${i}`;
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
  if (mudo) {
    filtros.push(`anullsrc=channel_layout=stereo:sample_rate=48000,atrim=0:${duracao}[a]`);
  } else if (trilha) {
    const e = novaEntrada('-i', trilha);
    // a música mais longa que o vídeo é cortada e some devagar; a trilha feita na medida já tem o seu fim
    const fade = Math.min(1.2, duracao / 4);
    const corte = `atrim=0:${duracao},asetpts=PTS-STARTPTS,` +
      (duracaoDe(trilha) > duracao + 0.05 ? `afade=t=out:st=${(duracao - fade).toFixed(3)}:d=${fade},` : '');
    filtros.push(`[${e}:a]${corte}${nivel(trilha, corte)}[a]`);
  } else {
    filtros.push(`[0:a]${nivel(video, '')}[a]`);
  }

  ffmpeg([...entradas, '-filter_complex', filtros.join(';'),
    '-map', '[v]', '-map', '[a]', '-r', qps,
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-t', String(duracao), '-movflags', '+faststart', saida]);

  console.log(`salvo: ${saida} · ${segundos(duracao)} s · ${blocos.filter(q => q.png).length} blocos de texto · ` +
    `${fotos.length + todos.filter(q => q.naMontagem).length} foto(s)${textoMontagem ? ' · remontado' : ''}` +
    (mudo ? ' · sem som' : trilha ? ` · trilha ${basename(trilha)}` : ' · som do vídeo'));
} finally {
  await navegador.close();
  rmSync(tmp, { recursive: true, force: true });
}
