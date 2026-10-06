// Monta a animática de cada vídeo da campanha: os planos do roteiro na duração exata,
// com o texto na tela na posição e no tamanho do vídeo final e as faixas do Reels marcadas.
// Serve para ensaiar o ritmo antes da diária e, depois, para assistir à previz com IA e ao
// ensaio com celular no tempo de verdade.
//
// Uso:  npm run animatica                        (todos, com os desenhos do storyboard)
//       npm run animatica -- a1                  (só o A1)
//       npm run animatica -- --com posicao       (com as fotos de posição)
//       npm run animatica -- --com ia            (com a previz gerada por IA)
//       npm run animatica -- b1 --com celular    (com as tomadas do ensaio com celular)
//
// A linha capta de cada quadro diz de qual plano da lista de filmagem sai a imagem
// (F1, C1, M2...). Com --com, o material desse plano é procurado em
// ensaios/material/<fonte>/: primeiro o vídeo (F1.mp4 ou F1.mov), depois a imagem
// (F1.jpg ou F1.png). O plano que não tiver material fica com o desenho do storyboard.
// Precisa do ffmpeg instalado.

import { readFileSync, readdirSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { SANS, abrirNavegador } from './pdf-qt.mjs';
import { lerQuadro, camadas, cssStoryboard } from './storyboard.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const ROTEIROS = join(AQUI, 'roteiros');
const ENSAIOS = join(AQUI, 'ensaios');
const QPS = 30;
const FONTES = { posicao: 'foto de posição', ia: 'previz com IA', celular: 'ensaio com celular' };

const args = process.argv.slice(2);
const iCom = args.indexOf('--com');
const fonte = iCom >= 0 ? args[iCom + 1] : '';
if (iCom >= 0 && !FONTES[fonte]) {
  console.error(`use --com ${Object.keys(FONTES).join(', --com ')}`);
  process.exit(1);
}
const filtro = (args.find((a, i) => !a.startsWith('--') && (iCom < 0 || i !== iCom + 1)) || '').toLowerCase();

const arquivos = readdirSync(ROTEIROS)
  .filter(f => /^0[1-9].*\.md$/.test(f))
  .filter(f => !filtro || f.toLowerCase().includes(filtro))
  .sort();
if (!arquivos.length) {
  console.error(`nenhum roteiro em anuncios-qt/roteiros${filtro ? ` casando com "${filtro}"` : ''}`);
  process.exit(1);
}

const pastaMaterial = fonte ? join(ENSAIOS, 'material', fonte) : '';
const disponiveis = pastaMaterial && existsSync(pastaMaterial) ? readdirSync(pastaMaterial) : [];
if (fonte && !disponiveis.length) console.warn(`aviso: ${pastaMaterial} está vazia, a animática sai só com o storyboard`);

// o material de um plano da lista de filmagem: vídeo antes de imagem
function material(capta) {
  if (!capta) return null;
  const achar = extensoes => disponiveis.find(f => new RegExp(`^${capta}\\.(${extensoes})$`, 'i').test(f));
  const video = achar('mp4|mov|m4v');
  if (video) return { tipo: 'video', arquivo: join(pastaMaterial, video) };
  const imagem = achar('jpe?g|png');
  if (imagem) return { tipo: 'imagem', arquivo: join(pastaMaterial, imagem) };
  return null;
}

// ---------- ffmpeg ----------
const ff = (...a) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...a.map(String)], { stdio: ['ignore', 'ignore', 'inherit'] });
const H264 = ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', 20, '-pix_fmt', 'yuv420p', '-r', QPS];
const CHEIO = 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1';

function qpsDe(arquivo) {
  const r = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=avg_frame_rate', '-of', 'csv=p=0', arquivo]).toString().trim();
  const [a, b] = r.split('/').map(Number);
  return b ? a / b : a;
}

const duracaoDe = arquivo =>
  Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', arquivo]).toString().trim());

const segundos = v => v.toFixed(1).replace('.', ',');

// ---------- camadas em png, no tamanho do vídeo ----------
const navegador = await abrirNavegador();
const pagina = await navegador.newPage({ viewport: { width: 1080, height: 1920 } });

const cssCamada = `
html, body { margin: 0; background: transparent; font-family: ${SANS}; }
${cssStoryboard}
.q-quadro { width: 1080px; height: 1920px; aspect-ratio: auto; border: 0; background: transparent; }
.rot { position: absolute; font-size: 28px; line-height: 1; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #EFECEC; background: rgba(26, 30, 30, 0.85); padding: 12px 18px; white-space: nowrap; }
.rot-fraco { color: #A0A5A5; }
`;

async function camada(html, arquivo, transparente = true) {
  await pagina.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${cssCamada}</style></head>` +
    `<body><div class="q-quadro">${html}</div></body></html>`);
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.screenshot({ path: arquivo, omitBackground: transparente });
}

const svg = corpo => `<svg viewBox="0 0 1080 1920" width="1080" height="1920">${corpo}</svg>`;

// a identificação do plano fica nas faixas que a interface do Reels cobre
const rotuloHtml = (codigo, q, origem) =>
  `<div class="rot" style="left:65px; top:118px">${codigo} · plano ${q.plano}${q.capta ? ` · ${q.capta}` : ''}</div>` +
  `<div class="rot rot-fraco" style="right:65px; top:118px">${segundos(q.inicio)} a ${segundos(q.fim)} s</div>` +
  `<div class="rot rot-fraco" style="left:65px; top:1772px">animática · ${origem}</div>`;

// ---------- montagem ----------
const tmp = mkdtempSync(join(tmpdir(), 'animatica-'));
const pastaSaida = join(ENSAIOS, 'animaticas');
mkdirSync(pastaSaida, { recursive: true });

try {
  const faixas = join(tmp, 'faixas.png');
  await camada(svg(camadas({ textos: [] }, 0).faixas), faixas);

  for (const arquivo of arquivos) {
    const md = readFileSync(join(ROTEIROS, arquivo), 'utf8');
    const codigo = md.match(/^# ([A-Z]\d) · /m)[1];
    const quadros = [...md.matchAll(/```quadro\n([\s\S]*?)```/g)].map(m => lerQuadro(m[1]));
    const segmentos = [];
    let anterior = null;
    let comMaterial = 0;

    for (const [k, q] of quadros.entries()) {
      const duracao = Number((q.fim - q.inicio).toFixed(3));
      const prefixo = join(tmp, `${codigo}-${k + 1}`);
      const base = `${prefixo}-base.mp4`;
      const { cena, textos } = camadas(q, k);
      const mat = fonte ? material(q.capta) : null;
      let origem = q.capta ? 'storyboard' : 'gráfico da edição';

      if (q.escurecer && anterior?.material && anterior.capta === q.capta) {
        // o último quadro do plano anterior congela e escurece em meio segundo
        ff('-sseof', '-0.1', '-i', anterior.base, '-frames:v', 1, '-update', 1, `${prefixo}-ultimo.png`);
        ff('-loop', 1, '-framerate', QPS, '-t', duracao, '-i', `${prefixo}-ultimo.png`,
          '-f', 'lavfi', '-t', duracao, '-i', `color=c=black:s=1080x1920:r=${QPS}`,
          '-filter_complex', `[1:v]format=rgba,colorchannelmixer=aa=${Number(q.escurecer) / 100},fade=t=in:st=0:d=0.5:alpha=1[e];[0:v][e]overlay=shortest=1`,
          ...H264, '-t', duracao, base);
        origem = FONTES[fonte];
      } else if (mat?.tipo === 'video') {
        // acelerado, câmera lenta e time-lapse como manda a linha camera do roteiro
        const ritmo = [];
        const acelerado = (q.camera || '').match(/acelerad[oa] (\d+(?:,\d+)?)×/);
        if (acelerado) ritmo.push(`setpts=PTS/${acelerado[1].replace(',', '.')}`);
        const qps = qpsDe(mat.arquivo);
        if (/câmera lenta/.test(q.camera || '') && qps >= 90) ritmo.push(`setpts=PTS*${(qps / QPS).toFixed(4)}`);
        // o time-lapse cabe inteiro no plano, do salão vazio ao cheio, como na edição
        const total = duracaoDe(mat.arquivo);
        if (/time-lapse/.test(q.camera || '') && total > duracao) ritmo.push(`setpts=PTS*${(duracao / total).toFixed(4)}`);
        ff('-i', mat.arquivo, '-an', '-vf',
          [...ritmo, `fps=${QPS}`, CHEIO, `tpad=stop_mode=clone:stop_duration=${duracao}`, 'setpts=PTS-STARTPTS'].join(','),
          ...H264, '-t', duracao, base);
        origem = FONTES[fonte];
      } else {
        let imagem = mat?.arquivo;
        if (imagem) {
          origem = FONTES[fonte];
        } else {
          imagem = `${prefixo}-cena.png`;
          await camada(svg(cena), imagem, false);
        }
        ff('-loop', 1, '-framerate', QPS, '-t', duracao, '-i', imagem, '-vf', CHEIO, ...H264, '-t', duracao, base);
      }
      if (fonte && origem === FONTES[fonte]) comMaterial++;

      // faixas do Reels, texto na tela e identificação por cima
      const texto = `${prefixo}-texto.png`;
      const rotulo = `${prefixo}-rotulo.png`;
      await camada(textos, texto);
      await camada(rotuloHtml(codigo, q, origem), rotulo);
      const segmento = `${prefixo}.mp4`;
      ff('-i', base, '-i', faixas, '-i', texto, '-i', rotulo,
        '-filter_complex', '[0:v][1:v]overlay[a];[a][2:v]overlay[b];[b][3:v]overlay',
        ...H264, '-t', duracao, segmento);
      segmentos.push(segmento);
      anterior = { capta: q.capta, base, material: Boolean(mat) };
    }

    // os planos em sequência, com uma faixa de áudio muda para tocar em qualquer celular
    const lista = join(tmp, `${codigo}.txt`);
    writeFileSync(lista, segmentos.map(s => `file '${s}'`).join('\n') + '\n');
    const nome = basename(arquivo, '.md').replace(/^\d+-/, '') + (fonte ? `-${fonte}` : '');
    const destino = join(pastaSaida, `${nome}.mp4`);
    ff('-f', 'concat', '-safe', 0, '-i', lista, '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo',
      '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '96k', '-shortest', '-movflags', '+faststart', destino);
    console.log(`salvo: ${destino} · ${segundos(quadros.at(-1).fim)} s · ${quadros.length} planos` +
      (fonte ? ` · ${comMaterial} com ${FONTES[fonte]}` : ''));
  }
} finally {
  await navegador.close();
  rmSync(tmp, { recursive: true, force: true });
}
