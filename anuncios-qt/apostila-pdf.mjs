// Gera anuncios-qt/apostila-meta-ads.pdf a partir de apostila-meta-ads.md, com a
// identidade da QT: preto #1A1E1E, cinza #A0A5A5, branco #EFECEC e Helvetica.
//
// Capa, sumário com número de página, cada seção abrindo página nova, gabarito dos
// exercícios separado e marcadores de navegação no PDF.
//
// Uso:  npm run apostila
//
// O número de página do sumário sai de uma passada prévia: cada seção é impressa
// sozinha e as páginas são somadas. Funciona porque toda seção começa em página nova.
// Na mesma passada, a seção que termina com uma sobra pequena na última página é
// testada numa versão um pouco mais compacta, e fica com ela se a sobra sumir.

import { chromium } from 'playwright';
import { marked } from 'marked';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI  = dirname(fileURLToPath(import.meta.url));
const FONTE = join(AQUI, 'apostila-meta-ads.md');
const SAIDA = join(AQUI, 'apostila-meta-ads.pdf');

// ---------- leitura do markdown ----------
const md = readFileSync(FONTE, 'utf8');
const titulo = md.match(/^# (.+)$/m)[1];
const conferido = md.match(/Escrita em `([^`]+)`/)[1];

const partes = md.replace(/^# .+\n+/, '').split(/^## /m);
partes.shift();   // a linha de abertura vira a capa
const secoes = partes.map((p, i) => {
  const [cab, ...resto] = p.split('\n');
  return { id: `s${i}`, cab: cab.trim(), md: resto.join('\n').replace(/^---\s*$/gm, '').trim() };
});

const OLHOS = {
  'Como usar esta apostila': 'Antes de começar',
  'Exercícios': 'Prática',
  'Glossário': 'Consulta',
};
for (const s of secoes) {
  const m = s.cab.match(/^Módulo (\d+) · (.+)$/);
  if (m) {
    s.numero = m[1].padStart(2, '0');
    s.olho = 'Módulo';
    s.titulo = m[2];
  } else {
    s.numero = '';
    s.olho = s.cab.startsWith('Fontes') ? 'Referências' : (OLHOS[s.cab] || '');
    s.titulo = s.cab;
  }
}

// ---------- markdown para html ----------
marked.use({
  gfm: true,
  renderer: {
    heading({ tokens, depth }) {
      const texto = this.parser.parseInline(tokens);
      const m = depth === 3 && texto.match(/^(\d+\.\d+)\s+(.*)$/);
      if (m) return `<h3><span class="num">${m[1]}</span> ${m[2]}</h3>\n`;
      return `<h${depth}>${texto}</h${depth}>\n`;
    },
    link({ href, tokens }) {
      const texto = this.parser.parseInline(tokens);
      if (!/^https?:/.test(href)) return `<span class="arquivo">${texto}</span>`;
      const host = new URL(href).hostname.replace(/^www\./, '');
      return `<a href="${href}">${texto}</a> <span class="host">${host}</span>`;
    },
  },
});

// tabela curta não quebra entre páginas, tabela longa quebra repetindo o cabeçalho
function marcarTabelas(html) {
  return html.replace(/<table>([\s\S]*?)<\/table>/g, (tabela, miolo) => {
    const linhas = (miolo.match(/<tr>/g) || []).length - 1;
    return linhas > 8 ? `<table class="longa">${miolo}</table>` : tabela;
  });
}

function corpoDaSecao(s) {
  let html = marcarTabelas(marked.parse(s.md));
  if (s.cab === 'Exercícios') {
    const respostas = [];
    html = html.replace(/<details>\s*<summary>Resposta<\/summary>([\s\S]*?)<\/details>/g, (_, r) => {
      respostas.push(r.trim());
      return '';
    });
    if (respostas.length) {
      html += '<p class="aviso">Responda antes de virar a página. O gabarito está na seguinte.</p>';
      html += '<div class="gabarito"><h3>Gabarito</h3>'
        + respostas.map((r, i) => `<div class="resposta"><p class="rotulo">Exercício ${i + 1}</p>${r}</div>`).join('')
        + '</div>';
    }
  }
  return html;
}

// o &nbsp; depois do número é o que separa número e título nos marcadores do PDF:
// o Chromium junta os textos de blocos vizinhos sem espaço
function abertura(s) {
  const olho = s.olho ? `<p class="olho">${s.olho}</p>` : '';
  const h2 = s.numero
    ? `<h2><span class="h2-num">${s.numero}&nbsp;</span><span class="h2-tit">${s.titulo}</span></h2>`
    : `<h2><span class="h2-tit">${s.titulo}</span></h2>`;
  return `<header class="abertura">${olho}${h2}</header>`;
}

function secaoHtml(s, ultima, extras = s.classes || []) {
  const fecho = ultima ? '<p class="assinatura">QT Pizza Bar · mangia che te fa bene!</p>' : '';
  const classes = ['secao', ...extras].join(' ');
  return `<section class="${classes}" id="${s.id}">${abertura(s)}${corpoDaSecao(s)}${fecho}</section>`;
}

const [linha1, linha2] = titulo.split(/ (?=para )/);
const capa = `
<section class="capa">
  <p class="capa-marca">QT PIZZA BAR</p>
  <div class="capa-miolo">
    <p class="capa-olho">Apostila técnica</p>
    <h1><span class="l1">${linha1}&nbsp;</span><span class="l2">${linha2 || ''}</span></h1>
    <div class="capa-regua"></div>
    <p class="capa-desc">Do zero à primeira campanha medida: o leilão, a conta de quanto a casa pode pagar por cliente, o anúncio, o atendimento e a rotina de toda segunda.</p>
  </div>
  <div class="capa-rodape">
    <div><span>Conteúdo</span>Módulos 0 a 11, exercícios com gabarito e glossário</div>
    <div><span>Acompanha</span>O plano de largada e a planilha <span class="inteiro">meta-ads-qt.xlsx</span></div>
    <div><span>Edição</span>Regras da plataforma conferidas em ${conferido}</div>
  </div>
</section>`;

function sumario(paginas) {
  const itens = secoes.map((s, i) => `
    <li><a href="#${s.id}">
      <span class="toc-num">${s.numero}</span>
      <span class="toc-tit">${s.titulo}</span>
      <span class="toc-pag">${paginas ? paginas[i] : '00'}</span>
    </a></li>`).join('');
  return `<section class="sumario"><header class="abertura"><p class="olho">Apostila</p><h2><span class="h2-tit">Sumário</span></h2></header><ol class="toc">${itens}</ol></section>`;
}

// ---------- estilo ----------
// FreeSans e Nimbus Sans são clones da Helvetica. Vêm antes porque, no Linux, o nome
// Helvetica é desviado para a Liberation Sans, que é clone da Arial.
const SANS = 'FreeSans, "Nimbus Sans", Helvetica, "Helvetica Neue", Arial, sans-serif';
const MONO = '"DejaVu Sans Mono", "Liberation Mono", Menlo, monospace';
const css = `
@page {
  size: A4;
  margin: 22mm 18mm 20mm 18mm;
  @top-left     { content: "QT PIZZA BAR"; font-family: ${SANS}; font-size: 7pt; font-weight: 700; letter-spacing: 0.22em; color: #1A1E1E; vertical-align: bottom; padding-bottom: 7mm; }
  @top-right    { content: "Meta Ads · apostila técnica"; font-family: ${SANS}; font-size: 7pt; color: #A0A5A5; vertical-align: bottom; padding-bottom: 7mm; }
  @bottom-left  { content: "Regras conferidas em ${conferido}"; font-family: ${SANS}; font-size: 7pt; color: #A0A5A5; vertical-align: top; padding-top: 7mm; }
  @bottom-right { content: counter(page); font-family: ${SANS}; font-size: 8pt; font-weight: 700; color: #1A1E1E; vertical-align: top; padding-top: 7mm; }
}
@page capa {
  margin: 0;
  @top-left { content: none; } @top-right { content: none; }
  @bottom-left { content: none; } @bottom-right { content: none; }
}

* { box-sizing: border-box; }
html { font-family: ${SANS}; font-size: 9.4pt; color: #1A1E1E; line-height: 1.47; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; }
p { margin: 0 0 6.5pt; orphans: 3; widows: 3; }
strong { font-weight: 700; }
code { font-family: inherit; font-size: inherit; font-weight: 700; }
td code, th code { font-weight: inherit; }
a { color: inherit; text-decoration: underline; text-decoration-thickness: 0.5pt; text-decoration-color: #A0A5A5; text-underline-offset: 2pt; }
.host { color: #A0A5A5; font-size: 7.5pt; }
.arquivo code { font-weight: 700; }

/* capa */
.capa { page: capa; height: 297mm; overflow: hidden; background: #1A1E1E; color: #EFECEC;
        padding: 22mm 20mm 20mm; display: flex; flex-direction: column; }
.capa-marca { font-size: 8pt; font-weight: 700; letter-spacing: 0.32em; margin: 0; }
.capa-miolo { margin-top: auto; margin-bottom: auto; }
.capa-olho { font-size: 8pt; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: #A0A5A5; margin: 0 0 14pt; }
.capa h1 { margin: 0; font-weight: 700; letter-spacing: 0.5px; }
.capa h1 .l1 { display: block; font-size: 62pt; line-height: 1; letter-spacing: -0.01em; }
.capa h1 .l2 { display: block; font-size: 26pt; line-height: 1.2; font-weight: 400; margin-top: 8pt; }
.capa-regua { width: 46mm; height: 2pt; background: #EFECEC; margin: 22pt 0 16pt; }
.capa-desc { font-size: 11pt; line-height: 1.5; color: #A0A5A5; max-width: 118mm; margin: 0; }
.capa-rodape { display: flex; gap: 8mm; border-top: 0.6pt solid #A0A5A5; padding-top: 9pt; font-size: 7.6pt; line-height: 1.45; color: #EFECEC; }
.capa-rodape div { flex: 1; }
.inteiro { white-space: nowrap; }
.capa-rodape div > span:first-child { display: block; font-size: 6.6pt; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #A0A5A5; margin-bottom: 3pt; }

/* abertura de seção */
.secao, .sumario { break-before: page; }
.isolada { break-before: auto; }
.abertura { margin: 0 0 16pt; padding-bottom: 11pt; border-bottom: 2pt solid #1A1E1E; break-after: avoid; }
.olho { font-size: 7pt; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: #A0A5A5; margin: 0 0 4pt; }
h2 { margin: 0; font-weight: 700; letter-spacing: 0.5px; }
.h2-num { display: block; font-size: 50pt; line-height: 1; letter-spacing: -0.02em; margin-bottom: 6pt; }
.h2-tit { display: block; font-size: 20pt; line-height: 1.15; }
h3 { font-size: 12pt; line-height: 1.25; margin: 15pt 0 5.5pt; font-weight: 700; letter-spacing: 0.3px; break-after: avoid; }
h3 .num { color: #A0A5A5; margin-right: 4pt; }
h3 + p, h3 + table, h3 + pre { break-before: avoid; }
p:has(+ table), p:has(+ pre), p:has(+ ul), p:has(+ ol), p:has(+ blockquote) { break-after: avoid; }

/* listas */
ul, ol { margin: 0 0 9pt; padding-left: 15pt; }
li { margin: 0 0 3.5pt; orphans: 2; widows: 2; break-inside: avoid; }
li::marker { color: #A0A5A5; font-weight: 700; }
li p { margin: 0; }

/* tabelas */
table { width: 100%; border-collapse: collapse; margin: 6pt 0 12pt; font-size: 8.2pt; line-height: 1.36; break-inside: avoid; }
thead { display: table-header-group; }
th { background: #1A1E1E; color: #EFECEC; text-align: left; font-weight: 700; padding: 5pt 6pt; vertical-align: bottom; }
td { padding: 4.2pt 6pt; border-bottom: 0.6pt solid #D4D2CF; vertical-align: top; }
tr { break-inside: avoid; }
table.longa { break-inside: auto; }
table.longa tbody tr:nth-child(-n+2) { break-after: avoid; }
table.longa tbody tr:nth-last-child(-n+2) { break-before: avoid; }
td:first-child { font-weight: 700; }

/* blocos de conta e de diagrama */
pre { background: #EFECEC; border-left: 3pt solid #1A1E1E; padding: 8pt 11pt; margin: 6pt 0 12pt;
      font-family: ${MONO}; font-size: 7.7pt; line-height: 1.5; white-space: pre-wrap; overflow-wrap: anywhere; break-inside: avoid; }
pre code { font-family: inherit; font-weight: 400; }

/* textos de anúncio */
blockquote { margin: 6pt 0 10pt; padding: 8pt 12pt; background: #EFECEC; border-left: 3pt solid #1A1E1E; break-inside: avoid; }
blockquote p { margin: 0; }

/* sumário */
.toc { list-style: none; margin: 4pt 0 0; padding: 0; }
.toc li { margin: 0; }
.toc a { display: flex; align-items: baseline; text-decoration: none; padding: 6.4pt 0; border-bottom: 0.6pt solid #D4D2CF; }
.toc-num { width: 26pt; flex: none; font-weight: 700; color: #A0A5A5; }
.toc-tit { flex: 1; font-size: 10pt; }
.toc-pag { flex: none; font-weight: 700; padding-left: 12pt; }

/* exercícios */
.aviso { margin-top: 12pt; color: #A0A5A5; font-size: 8.4pt; }
.gabarito { break-before: page; }
.gabarito h3 { margin-top: 0; }
.resposta { border: 0.8pt solid #A0A5A5; padding: 8pt 12pt; margin: 0 0 10pt; break-inside: avoid; }
.resposta p { margin: 0 0 4pt; }
.rotulo { font-size: 6.8pt; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #A0A5A5; }

/* versão compacta, usada só quando elimina uma última página quase vazia */
.compacta { font-size: 8.9pt; line-height: 1.42; }
.compacta p { margin-bottom: 5pt; }
.compacta h3 { margin: 12pt 0 4.5pt; }
.compacta table { font-size: 7.8pt; margin-bottom: 10pt; }
.compacta td { padding: 3.6pt 5pt; }
.compacta pre { font-size: 7.3pt; padding: 7pt 10pt; }
.compacta li { margin-bottom: 2.5pt; }

.assinatura { margin-top: 26pt; padding-top: 8pt; border-top: 0.6pt solid #A0A5A5; font-size: 7.4pt; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; }
`;

const documento = corpo => `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>${titulo}</title><style>${css}</style></head>
<body>${corpo}</body></html>`;

// ---------- impressão ----------
async function abrirNavegador() {
  try {
    return await chromium.launch();
  } catch (erro) {
    // a versão instalada do playwright pode não bater com o navegador da máquina
    const alternativo = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';
    if (existsSync(alternativo)) return chromium.launch({ executablePath: alternativo });
    throw erro;
  }
}

const navegador = await abrirNavegador();
const pagina = await navegador.newPage();

async function imprimir(html, final = false) {
  await pagina.setContent(html, { waitUntil: 'load' });
  await pagina.evaluate(() => document.fonts.ready);
  return pagina.pdf({ preferCSSPageSize: true, printBackground: true, outline: final, tagged: final });
}
const contarPaginas = buf => (buf.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length;

const paginasCapa = contarPaginas(await imprimir(documento(capa)));
const paginasSumario = contarPaginas(await imprimir(documento(sumario(null).replace('class="sumario"', 'class="sumario isolada"'))));
const inicio = [];
let proxima = paginasCapa + paginasSumario + 1;
for (const [i, s] of secoes.entries()) {
  const ultima = i === secoes.length - 1;
  const paginasDe = async extras => contarPaginas(await imprimir(documento(secaoHtml(s, ultima, ['isolada', ...extras]))));
  let paginas = await paginasDe([]);
  s.classes = [];
  if (paginas > 1) {
    const compacta = await paginasDe(['compacta']);
    if (compacta < paginas) { s.classes = ['compacta']; paginas = compacta; }
  }
  inicio.push(proxima);
  proxima += paginas;
}
const compactadas = secoes.filter(s => s.classes.length).map(s => s.numero || s.titulo);

const pdf = await imprimir(
  documento(capa + sumario(inicio) + secoes.map((s, i) => secaoHtml(s, i === secoes.length - 1)).join('')),
  true,
);
await navegador.close();

const total = contarPaginas(pdf);
if (total !== proxima - 1) {
  console.error(`aviso: o PDF final tem ${total} páginas e a soma das seções deu ${proxima - 1}. Confira o sumário.`);
}
writeFileSync(SAIDA, pdf);
console.log(`salvo: ${SAIDA} · ${total} páginas` + (compactadas.length ? ` · compactadas: ${compactadas.join(', ')}` : ''));
