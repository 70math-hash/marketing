// Gera o PDF de um documento avulso da campanha, como o passo a passo de um anúncio,
// com a identidade da QT. O PDF sai ao lado do markdown, com o mesmo nome.
//
// Uso:  npm run doc -- anuncios-qt/anuncio-stories-video-1-1.md
//
// O markdown abre com o título em # e uma frase de apresentação. Uma tabela sem
// cabeçalho logo depois vira a ficha em duas colunas, como nos roteiros.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, basename, join } from 'node:path';
import {
  cssPagina, cssBase, novoMarked, marcarTabelas, documento,
  abrirNavegador, criarImpressora, contarPaginas,
} from './pdf-qt.mjs';

const arquivos = process.argv.slice(2);
if (!arquivos.length) {
  console.error('uso: npm run doc -- <arquivo.md> [outro.md]');
  process.exit(1);
}

const marked = novoMarked();

const cssDoc = `
.titulo-doc { border-bottom: 2pt solid #1A1E1E; padding-bottom: 8pt; margin: 0 0 9pt; }
.titulo-doc h1 { font-size: 27pt; line-height: 1.05; margin: 0 0 6pt; font-weight: 700; letter-spacing: 0.5px; }
.titulo-doc .sub { margin: 0; font-size: 9pt; }
.corpo h2 { font-size: 13pt; letter-spacing: 0.4px; margin: 14pt 0 6pt; padding-bottom: 3pt; border-bottom: 0.8pt solid #1A1E1E; break-after: avoid; }
.corpo ol > li { padding-left: 2pt; }
.corpo ol > li::marker { color: #1A1E1E; }
.corpo li > ul { margin: 3pt 0 0; }
.corpo p:has(+ blockquote), .corpo p:has(+ pre) { margin-bottom: 2pt; }
.ficha { display: grid; grid-template-columns: 1fr 1fr; grid-auto-flow: row dense; column-gap: 8mm; margin: 2pt 0 8pt; }
.f-item { padding: 2.8pt 0 3.2pt; border-bottom: 0.6pt solid #D4D2CF; break-inside: avoid; }
.f-item.largo { grid-column: span 2; }
.f-k { display: block; font-size: 6.2pt; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #A0A5A5; margin-bottom: 1pt; }
.f-v { display: block; font-size: 8.2pt; line-height: 1.32; }
`;

// a tabela sem cabeçalho vira uma grade de duas colunas
function fichaEmGrade(html) {
  return html.replace(
    /<table>\s*<thead>\s*<tr>\s*<th><\/th>\s*<th><\/th>\s*<\/tr>\s*<\/thead>\s*<tbody>([\s\S]*?)<\/tbody>\s*<\/table>/,
    (_, corpo) => '<div class="ficha">' + [...corpo.matchAll(/<tr>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/g)]
      .map(([, k, v]) => {
        const largo = v.replace(/<[^>]+>/g, '').length > 70 ? ' largo' : '';
        return `<div class="f-item${largo}"><span class="f-k">${k}</span><span class="f-v">${v}</span></div>`;
      }).join('') + '</div>');
}

const navegador = await abrirNavegador();
const imprimir = await criarImpressora(navegador);

try {
  for (const arquivo of arquivos) {
    const md = readFileSync(arquivo, 'utf8');
    const titulo = md.match(/^# (.+)$/m)[1];
    const semTitulo = md.replace(/^# .+\n+/, '');
    const sub = semTitulo.match(/^(.+)\n/)[1];
    const corpo = marcarTabelas(fichaEmGrade(marked.parse(semTitulo.replace(/^.+\n+/, ''))));

    const html = documento({
      titulo,
      css: cssPagina({ direita: titulo, rodape: 'Campanha Meta Ads da QT', numero: 'counter(page) " de " counter(pages)' }) + cssBase + cssDoc,
      corpo: `<header class="titulo-doc"><p class="olho">Passo a passo</p><h1>${titulo}</h1>` +
        `<p class="sub">${marked.parseInline(sub)}</p></header><div class="corpo">${corpo}</div>`,
    });

    const pdf = await imprimir(html, true);
    const saida = join(dirname(arquivo), basename(arquivo, '.md') + '.pdf');
    writeFileSync(saida, pdf);
    console.log(`salvo: ${saida} · ${contarPaginas(pdf)} páginas`);
  }
} finally {
  await navegador.close();
}
