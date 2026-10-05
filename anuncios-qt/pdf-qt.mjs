// Base comum dos PDFs da QT: fontes, página, estilo do texto e impressão pelo Chromium.
// Usada pela apostila (apostila-pdf.mjs) e pelos roteiros de vídeo (roteiros-pdf.mjs).

import { chromium } from 'playwright';
import { Marked } from 'marked';
import { existsSync } from 'node:fs';

// FreeSans e Nimbus Sans são clones da Helvetica. Vêm antes porque, no Linux, o nome
// Helvetica é desviado para a Liberation Sans, que é clone da Arial.
export const SANS = 'FreeSans, "Nimbus Sans", Helvetica, "Helvetica Neue", Arial, sans-serif';
export const MONO = '"DejaVu Sans Mono", "Liberation Mono", Menlo, monospace';

// margem, cabeçalho e rodapé de toda página
export const cssPagina = ({ direita, rodape, numero = 'counter(page)' }) => `
@page {
  size: A4;
  margin: 22mm 18mm 20mm 18mm;
  @top-left     { content: "QT PIZZA BAR"; font-family: ${SANS}; font-size: 7pt; font-weight: 700; letter-spacing: 0.22em; color: #1A1E1E; vertical-align: bottom; padding-bottom: 7mm; }
  @top-right    { content: "${direita}"; font-family: ${SANS}; font-size: 7pt; color: #A0A5A5; vertical-align: bottom; padding-bottom: 7mm; }
  @bottom-left  { content: "${rodape}"; font-family: ${SANS}; font-size: 7pt; color: #A0A5A5; vertical-align: top; padding-top: 7mm; }
  @bottom-right { content: ${numero}; font-family: ${SANS}; font-size: 8pt; font-weight: 700; color: #1A1E1E; vertical-align: top; padding-top: 7mm; }
}`;

// texto, títulos, listas, tabelas, blocos de conta e citações
export const cssBase = `
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

/* abertura de seção */
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

/* citações: textos de anúncio e modelos */
blockquote { margin: 6pt 0 10pt; padding: 8pt 12pt; background: #EFECEC; border-left: 3pt solid #1A1E1E; break-inside: avoid; }
blockquote p { margin: 0; }
`;

// título com número de seção em cinza, e link de arquivo do repositório vira texto
export function novoMarked() {
  return new Marked({
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
}

// tabela curta não quebra entre páginas, tabela longa quebra repetindo o cabeçalho
export function marcarTabelas(html) {
  return html.replace(/<table>([\s\S]*?)<\/table>/g, (tabela, miolo) => {
    const linhas = (miolo.match(/<tr>/g) || []).length - 1;
    return linhas > 8 ? `<table class="longa">${miolo}</table>` : tabela;
  });
}

export const documento = ({ titulo, css, corpo }) => `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>${titulo}</title><style>${css}</style></head>
<body>${corpo}</body></html>`;

export async function abrirNavegador() {
  try {
    return await chromium.launch();
  } catch (erro) {
    // a versão instalada do playwright pode não bater com o navegador da máquina
    const alternativo = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';
    if (existsSync(alternativo)) return chromium.launch({ executablePath: alternativo });
    throw erro;
  }
}

// devolve a função que imprime um html em PDF; final liga marcadores e PDF acessível
export async function criarImpressora(navegador) {
  const pagina = await navegador.newPage();
  return async (html, final = false) => {
    await pagina.setContent(html, { waitUntil: 'load' });
    await pagina.evaluate(() => document.fonts.ready);
    return pagina.pdf({ preferCSSPageSize: true, printBackground: true, outline: final, tagged: final });
  };
}

export const contarPaginas = buf => (buf.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length;
