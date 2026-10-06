// Gera o PDF do caderno de ensaio a partir de anuncios-qt/ensaios/caderno-de-ensaio.md.
// Cada bloco ```ensaio vira uma ficha de uma página: o quadro do storyboard, a câmera e o
// texto na tela que vêm do roteiro, a foto de posição, os prompts e as anotações.
// As tabelas de custo e de tempo de leitura são calculadas aqui, a partir das fichas e dos
// roteiros, e reescritas no markdown entre os marcadores <!-- custos --> e <!-- leitura -->.
//
// Uso:  npm run ensaios
//
// Com as fotos de posição em ensaios/material/posicao/ (F1.jpg, C1.jpg...), cada uma
// entra na sua ficha, ao lado do storyboard.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  cssPagina, cssBase, novoMarked, marcarTabelas, documento,
  abrirNavegador, criarImpressora, contarPaginas,
} from './pdf-qt.mjs';
import { lerQuadro, quadroHtml, cssStoryboard } from './storyboard.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const PASTA = join(AQUI, 'ensaios');
const FONTE = join(PASTA, 'caderno-de-ensaio.md');
const FOTOS = join(PASTA, 'material', 'posicao');

// preços em crédito, conferidos no Higgsfield em 06/10/2026
const QUADRO_CHAVE = { nome: 'Nano Banana', creditos: 1 };
const VIDEOS = { veo3_1_lite: { nome: 'Veo 3.1 Lite', creditos: { 4: 6, 6: 9, 8: 12 } } };
const VEO_COMPLETO_4S = 16;
const MARGEM = 0.4;
// leitura: até 12 caracteres por segundo é folgada, até 15 é justa, acima disso apertada
const LEITURA = [[12, 'folgada'], [15, 'justa'], [Infinity, 'apertada']];

const num = (v, casas = 1) => v.toFixed(casas).replace('.', ',');
const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const soma = xs => xs.reduce((a, b) => a + b, 0);

// ---------- os roteiros: onde cada plano da lista de filmagem é usado ----------
const roteiros = readdirSync(join(AQUI, 'roteiros')).filter(f => /^0[1-9].*\.md$/.test(f)).sort().map(f => {
  const md = readFileSync(join(AQUI, 'roteiros', f), 'utf8');
  return {
    codigo: md.match(/^# ([A-Z]\d) · /m)[1],
    quadros: [...md.matchAll(/```quadro\n([\s\S]*?)```/g)].map(m => lerQuadro(m[1])),
  };
});
const usos = {};
for (const { codigo, quadros } of roteiros) {
  for (const q of quadros) if (q.capta) (usos[q.capta] ||= []).push({ codigo, q });
}

// ---------- as fichas ----------
function lerFicha(bloco) {
  const f = {};
  for (const linha of bloco.split('\n')) {
    const m = linha.match(/^([a-z-]+):\s*(.*)$/);
    if (m) f[m[1]] = m[2].trim();
  }
  f.segundos = Number(f.segundos || 0);
  f.observar = (f.observar || '').split(' / ').filter(Boolean);
  return f;
}

function custo(f) {
  const quadros = (f['quadro-chave'] && f['quadro-chave'] !== 'foto' ? 1 : 0) + (f['quadro-final'] ? 1 : 0);
  let clipe = 0;
  if (f.video && f.video !== 'nenhum') {
    if (!VIDEOS[f.video]) throw new Error(`${f.id}: o modelo ${f.video} não está na tabela de preços`);
    clipe = VIDEOS[f.video].creditos[f.segundos];
    if (clipe === undefined) throw new Error(`${f.id}: ${f.video} não tem preço para ${f.segundos} s`);
  }
  return { quadros, clipe, total: quadros * QUADRO_CHAVE.creditos + clipe };
}

let md = readFileSync(FONTE, 'utf8');
const fichas = [];
let grupo = '';
for (const m of md.matchAll(/^### (.+)$|```ensaio\n([\s\S]*?)```/gm)) {
  if (m[1]) grupo = m[1].trim();
  else fichas.push({ ...lerFicha(m[2]), grupo });
}
for (const f of fichas) {
  if (!f.serve && !usos[f.id]) throw new Error(`${f.id}: nenhum roteiro tem capta: ${f.id}, e a ficha não diz a quem serve`);
}

// ---------- as tabelas calculadas ----------
function tabelaCustos() {
  const linhas = ['| Bloco | Planos | Quadros-chave | Clipes | Créditos |', '|---|---|---|---|---|'];
  const total = { planos: 0, quadros: 0, clipes: 0, creditos: 0 };
  let semMesaComprida = 0;
  for (const g of [...new Set(fichas.map(f => f.grupo))]) {
    const doGrupo = fichas.filter(f => f.grupo === g);
    const c = doGrupo.map(custo);
    const t = {
      planos: doGrupo.length,
      quadros: soma(c.map(x => x.quadros)),
      clipes: c.filter(x => x.clipe).length,
      creditos: soma(c.map(x => x.total)),
    };
    linhas.push(`| ${g} | ${doGrupo.map(f => `\`${f.id}\``).join(' ')} | \`${t.quadros}\` | \`${t.clipes}\` | \`${t.creditos}\` |`);
    for (const k of Object.keys(total)) total[k] += t[k];
    if (g !== 'Mesa comprida') semMesaComprida += t.creditos;
  }
  const comMargem = v => v + Math.round(v * MARGEM);
  linhas.push(`| **Soma** | \`${total.planos}\` planos | \`${total.quadros}\` | \`${total.clipes}\` | \`${total.creditos}\` |`);
  linhas.push(`| Margem para refazer, \`${Math.round(MARGEM * 100)}%\` | | | | \`${Math.round(total.creditos * MARGEM)}\` |`);
  linhas.push(`| **Ensaio completo** | | | | **\`${comMargem(total.creditos)}\`** |`);
  linhas.push(`| Sem a mesa comprida, com a mesma margem | | | | \`${comMargem(semMesaComprida)}\` |`);
  linhas.push(`| Opcional: \`F1\` e \`M2\` também no Veo 3.1 completo, \`4\` s | | | | \`${2 * VEO_COMPLETO_4S}\` |`);
  return linhas.join('\n');
}

// planos seguidos com o mesmo texto viram um trecho só; na cartela, conta só o que
// precisa ser lido: a chamada e a advertência
function tabelaLeitura() {
  const linhas = ['| Vídeo | Texto na tela | Segundos | Caracteres | Por segundo | Leitura |', '|---|---|---|---|---|---|'];
  for (const { codigo, quadros } of roteiros) {
    const trechos = [];
    let ultimo = null;
    for (const q of quadros) {
      const chave = q.textos.map(t => t.linhas.join(' ')).join(' | ');
      if (ultimo && chave && ultimo.chave === chave) { ultimo.fim = q.fim; continue; }
      ultimo = chave ? { chave, q, inicio: q.inicio, fim: q.fim } : null;
      if (ultimo) trechos.push(ultimo);
    }
    for (const { q, inicio, fim } of trechos) {
      const cartela = q.textos.some(t => t.linhas.join(' ') === 'QT PIZZA BAR');
      const lidos = q.textos.map(t => t.linhas.join(' ')).filter((t, i) => !cartela || ['limpo', 'chamada'].includes(q.textos[i].estilo) || /álcool/.test(t));
      const caracteres = lidos.join(' ').length;
      const ritmo = caracteres / (fim - inicio);
      const leitura = LEITURA.find(([teto]) => ritmo <= teto)[1];
      linhas.push(`| \`${codigo}\` | ${cartela ? 'cartela: ' : ''}${lidos.join(' · ')} | \`${num(fim - inicio)}\` | \`${caracteres}\` | \`${num(ritmo)}\` | ${leitura} |`);
    }
  }
  return linhas.join('\n');
}

function trocar(texto, nome, conteudo) {
  const re = new RegExp(`(<!-- ${nome}:[^\\n]*-->\\n)[\\s\\S]*?(<!-- /${nome} -->)`);
  if (!re.test(texto)) throw new Error(`o marcador <!-- ${nome}: --> não está no caderno`);
  return texto.replace(re, (_, abre, fecha) => `${abre}${conteudo}\n${fecha}`);
}

const atualizado = trocar(trocar(md, 'custos', tabelaCustos()), 'leitura', tabelaLeitura());
if (atualizado !== md) {
  writeFileSync(FONTE, atualizado);
  console.log('tabelas de custo e de leitura atualizadas no caderno-de-ensaio.md');
  md = atualizado;
}

// ---------- o PDF ----------
const marked = novoMarked();
const navegador = await abrirNavegador();
const imprimir = await criarImpressora(navegador);
const auxiliar = await navegador.newPage();

// foto do celular reduzida para 540 px de largura, na orientação certa
async function reduzir(arquivo) {
  const tipo = /png$/i.test(arquivo) ? 'image/png' : 'image/jpeg';
  return auxiliar.evaluate(async src => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = 540;
    c.height = Math.round((img.naturalHeight * 540) / img.naturalWidth);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.82);
  }, `data:${tipo};base64,${readFileSync(arquivo).toString('base64')}`);
}

const fotos = existsSync(FOTOS) ? readdirSync(FOTOS) : [];
async function fotoDePosicao(id) {
  const arquivo = fotos.find(f => new RegExp(`^${id}\\.(jpe?g|png)$`, 'i').test(f));
  if (!arquivo) return '<div class="fe-vazio"><span>foto de posição</span></div>';
  return `<div class="fe-foto"><img src="${await reduzir(join(FOTOS, arquivo))}" alt=""></div>`;
}

const campo = (rotulo, unidade = '') => `<div class="campo"><span>${rotulo}</span><span>${unidade}</span></div>`;

let indiceQuadro = 100;
async function fichaHtml(f, primeira) {
  const lista = usos[f.id] || [];
  const uso = lista[0];
  const c = custo(f);
  const serve = f.serve || lista.map(u => `${u.codigo} · plano ${u.q.plano}`).join(', ');
  const camera = f.camera || uso.q.camera;
  const naTela = uso ? (uso.q.textos.map(t => t.linhas.join(' ')).join(' · ') || 'sem texto') : 'o número do termômetro, legível';
  const storyboard = uso
    ? quadroHtml(uso.q, indiceQuadro++, { legenda: false })
    : '<div class="fe-vazio"><span>sem quadro no storyboard</span></div>';
  const daFoto = f['quadro-chave'] === 'foto';

  const geracao = [
    daFoto ? 'Quadro inicial: a própria foto de posição, sem gerar.'
      : `Quadro-chave: ${QUADRO_CHAVE.nome}, com a foto de posição como referência, \`${QUADRO_CHAVE.creditos}\` crédito.`,
    f['quadro-final'] ? `Quadro final: ${QUADRO_CHAVE.nome}, \`${QUADRO_CHAVE.creditos}\` crédito.` : '',
    c.clipe
      ? `Clipe: ${VIDEOS[f.video].nome}, \`${f.segundos}\` s, sem áudio, com ${daFoto ? 'a foto' : 'o quadro-chave'} como imagem inicial` +
        `${f['quadro-final'] ? ' e o quadro final como imagem final' : ''}, \`${c.clipe}\` créditos.`
      : 'Sem clipe: o quadro-chave basta.',
  ].filter(Boolean);

  const prompt = (rotulo, texto) => `<div class="fe-prompt"><span class="fe-k">${rotulo}</span><pre>${esc(texto)}</pre></div>`;
  const prompts = [
    daFoto ? '' : prompt(`Prompt do quadro-chave · ${QUADRO_CHAVE.nome}`, f['quadro-chave']),
    f['quadro-final'] ? prompt(`Prompt do quadro final · ${QUADRO_CHAVE.nome}`, f['quadro-final']) : '',
    c.clipe ? prompt(`Prompt do movimento · ${VIDEOS[f.video].nome} · ${f.segundos} s`, f.movimento) : '',
  ].join('');

  const dado = (rotulo, valor) => `<div class="fe-linha"><span class="fe-k">${rotulo}</span><div class="fe-v">${valor}</div></div>`;
  const creditos = c.total === 1 ? '1 crédito' : `${c.total} créditos`;

  return `<section class="fe${primeira ? ' fe-primeira' : ''}">` +
    `<header class="fe-topo"><span class="fe-id">${f.id}</span>` +
    `<div class="fe-tit"><span class="fe-nome">${esc(f.nome)}</span><span class="fe-serve">${marked.parseInline(serve)}</span></div>` +
    `<div class="fe-custo">${creditos}</div></header>` +
    `<div class="fe-corpo">` +
    `<figure class="fe-quadro">${storyboard}<figcaption>${uso ? `storyboard · ${uso.codigo} · plano ${uso.q.plano}<br>${esc(uso.q.tempo)}` : 'variação de teste'}</figcaption></figure>` +
    `<figure class="fe-quadro">${await fotoDePosicao(f.id)}<figcaption>foto de posição<br>${f.id}</figcaption></figure>` +
    `<div class="fe-dados">` +
    dado('Câmera no roteiro', esc(camera)) +
    dado('Foto de posição', marked.parseInline(f.foto)) +
    dado('Na tela', esc(naTela)) +
    dado('Geração', geracao.map(g => `<p>${marked.parseInline(g)}</p>`).join('')) +
    `</div></div>` +
    `<div class="fe-duas">` +
    `<div><span class="fe-k">O que observar</span><ul>${f.observar.map(o => `<li>${marked.parseInline(o)}</li>`).join('')}</ul></div>` +
    `<div><span class="fe-k">Onde a IA erra</span><p>${marked.parseInline(f.erra || '')}</p></div>` +
    `</div>` +
    prompts +
    `<div class="fe-anot"><span class="fe-k">Anotações do ensaio</span>` +
    `<div class="fe-campos">${campo('Altura da câmera', 'cm')}${campo('Lente', '×')}${campo('Distância', 'm')}` +
    `${f.id.startsWith('F') ? campo('Piso do forno', '°C') : campo('Tomada escolhida')}</div>` +
    `<div class="fe-checks"><span>Posição marcada no chão</span><span>Foto tirada</span><span>Quadro-chave aprovado</span><span>Clipe aprovado</span></div>` +
    `<div class="fe-linha-livre"><span>O que muda na posição, na luz ou no roteiro</span></div>` +
    '<div class="fe-linha-livre"></div>'.repeat(2) +
    `</div></section>`;
}

const cssCaderno = `
.titulo-doc { border-bottom: 2pt solid #1A1E1E; padding-bottom: 8pt; margin: 0 0 9pt; }
.titulo-doc h1 { font-size: 27pt; line-height: 1.05; margin: 0 0 6pt; font-weight: 700; letter-spacing: 0.5px; }
.titulo-doc .sub { margin: 0; font-size: 9pt; }
.corpo h2 { font-size: 13pt; letter-spacing: 0.4px; margin: 14pt 0 6pt; padding-bottom: 3pt; border-bottom: 0.8pt solid #1A1E1E; break-after: avoid; }
.corpo h3 { font-size: 10.5pt; margin: 10pt 0 4pt; }
.corpo table:not(:has(thead th:not(:empty))) thead { display: none; }
.corpo table:not(:has(thead th:not(:empty))) td:first-child { width: 22%; }
ul:has(> li > input[type=checkbox]) { list-style: none; padding-left: 0; }
li > input[type=checkbox] { -webkit-appearance: none; appearance: none; width: 8pt; height: 8pt; border: 0.9pt solid #1A1E1E; margin: 0 6pt 0 0; vertical-align: -0.5pt; }

/* fichas: uma por página */
.corpo h3.grupo { break-before: page; margin: 0 0 6pt; font-size: 7pt; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: #A0A5A5; }
.fe { break-before: page; break-inside: avoid; }
.fe.fe-primeira { break-before: avoid; }
.corpo h2.nova-pagina { break-before: page; margin-top: 0; }
.fe + h2 { break-before: page; margin-top: 0; }
.fe-topo { display: flex; align-items: center; gap: 10pt; border-top: 2pt solid #1A1E1E; padding-top: 6pt; margin-bottom: 8pt; }
.fe-id { font-size: 30pt; font-weight: 700; line-height: 1; letter-spacing: -0.01em; }
.fe-tit { flex: 1; display: flex; flex-direction: column; gap: 2pt; }
.fe-nome { font-size: 14pt; font-weight: 700; line-height: 1.1; }
.fe-serve { font-size: 8pt; color: #5F6464; }
.fe-custo { font-size: 7pt; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #1A1E1E; border: 0.8pt solid #1A1E1E; padding: 3pt 6pt; white-space: nowrap; }
.fe-corpo { display: grid; grid-template-columns: 38mm 38mm 1fr; column-gap: 5mm; margin-bottom: 7pt; }
.fe-quadro { margin: 0; }
.fe-quadro .q-bloco { margin: 0; }
.fe-quadro figcaption { font-size: 6.2pt; color: #5F6464; margin-top: 3pt; line-height: 1.3; }
.fe-vazio, .fe-foto { aspect-ratio: 9 / 16; border: 0.9pt dashed #A0A5A5; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.fe-vazio span { font-size: 6.2pt; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #A0A5A5; text-align: center; padding: 0 6pt; }
.fe-foto { border-style: solid; border-color: #A0A5A5; }
.fe-foto img { width: 100%; height: 100%; object-fit: cover; display: block; }
.fe-dados { font-size: 8pt; line-height: 1.36; }
.fe-linha { padding: 3pt 0 3.4pt; border-bottom: 0.6pt solid #D4D2CF; }
.fe-linha:first-child { padding-top: 0; }
.fe-k { display: block; font-size: 6.2pt; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #A0A5A5; margin-bottom: 1.5pt; }
.fe-v p { margin: 0 0 1.5pt; }
.fe-duas { display: grid; grid-template-columns: 1fr 1fr; column-gap: 6mm; font-size: 8pt; line-height: 1.36; margin-bottom: 6pt; }
.fe-duas ul { margin: 0; padding-left: 10pt; }
.fe-duas li { margin: 0 0 2pt; }
.fe-duas p { margin: 0; }
.fe-prompt { margin-bottom: 5pt; }
.fe-prompt pre { font-size: 7pt; line-height: 1.45; margin: 0; padding: 5pt 8pt; }
.fe-anot { margin-top: 8pt; }
.fe-campos { display: grid; grid-template-columns: repeat(4, 1fr); column-gap: 5mm; }
.campo, .fe-linha-livre { display: flex; justify-content: space-between; align-items: flex-end; height: 19pt; border-bottom: 0.6pt solid #A0A5A5; padding-bottom: 2pt; font-size: 6.4pt; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #A0A5A5; }
.fe-checks { display: flex; gap: 12pt; margin: 9pt 0 2pt; font-size: 7.2pt; }
.fe-checks span::before { content: ''; display: inline-block; width: 7pt; height: 7pt; border: 0.9pt solid #1A1E1E; margin-right: 4pt; vertical-align: -1pt; }
` + cssStoryboard;

const semTitulo = md.replace(/^# .+\n+/, '');
const sub = semTitulo.match(/^(.+)\n/)[1];
let n = 0;
const texto = semTitulo.replace(/^.+\n+/, '').replace(/```ensaio\n[\s\S]*?```\n?/g, () => `\nFICHA_${n++}\n`);
let corpo = marcarTabelas(marked.parse(texto));
const fichasHtml = [];
for (const [i, f] of fichas.entries()) {
  const primeira = new RegExp(`<h3>[^<]+</h3>\\s*<p>FICHA_${i}</p>`).test(corpo);
  fichasHtml.push(await fichaHtml(f, primeira));
}
corpo = corpo
  .replace(/<h3>([^<]+)<\/h3>(\s*<p>FICHA_)/g, '<h3 class="grupo">$1</h3>$2')
  .replace(/<p>FICHA_(\d+)<\/p>/g, (_, i) => fichasHtml[i]);
// <!-- nova-pagina --> antes de um título do markdown abre página nova
corpo = corpo.replace(/<!-- nova-pagina -->\s*<h2>/g, '<h2 class="nova-pagina">');

const html = documento({
  titulo: 'Caderno de ensaio',
  css: cssPagina({
    direita: 'Caderno de ensaio',
    rodape: 'Direção de vídeo · campanha Meta Ads da QT',
    numero: 'counter(page) " de " counter(pages)',
  }) + cssBase + cssCaderno,
  corpo: `<header class="titulo-doc"><p class="olho">Direção de vídeo · ensaio</p><h1>Caderno de ensaio</h1>` +
    `<p class="sub">${marked.parseInline(sub)}</p></header><div class="corpo">${corpo}</div>`,
});

const pdf = await imprimir(html, true);
const saida = join(PASTA, 'caderno-de-ensaio.pdf');
writeFileSync(saida, pdf);
console.log(`salvo: ${saida} · ${contarPaginas(pdf)} páginas · ${fichas.length} fichas`);
await navegador.close();
