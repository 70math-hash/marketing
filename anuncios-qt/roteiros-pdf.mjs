// Gera um PDF para cada roteiro de vídeo em anuncios-qt/roteiros/*.md, com a
// identidade da QT e o storyboard desenhado a partir dos blocos ```quadro.
//
// Uso:  npm run roteiros            (todos)
//       npm run roteiros -- a1      (só os que casam com o filtro)
//
// O markdown é a fonte. Cada bloco ```quadro é um plano do vídeo; o primeiro bloco
// do arquivo vira, no PDF, o storyboard, a linha do tempo e a tabela de decupagem.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  cssPagina, cssBase, novoMarked, marcarTabelas, documento,
  abrirNavegador, criarImpressora, contarPaginas,
} from './pdf-qt.mjs';
import { lerQuadro, quadroHtml, tabelaDecupagem, linhaDoTempo, cssStoryboard } from './storyboard.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const PASTA = join(AQUI, 'roteiros');
const filtro = (process.argv[2] || '').toLowerCase();

const arquivos = readdirSync(PASTA)
  .filter(f => f.endsWith('.md') && f !== 'README.md')
  .filter(f => !filtro || f.toLowerCase().includes(filtro))
  .sort();

if (!arquivos.length) {
  console.error(`nenhum roteiro em anuncios-qt/roteiros${filtro ? ` casando com "${filtro}"` : ''}`);
  process.exit(1);
}

const marked = novoMarked();

const cssRoteiro = `
.titulo-doc { border-bottom: 2pt solid #1A1E1E; padding-bottom: 8pt; margin: 0 0 9pt; }
.titulo-doc h1 { font-size: 27pt; line-height: 1.05; margin: 0 0 6pt; font-weight: 700; letter-spacing: 0.5px; }
.titulo-doc .sub { margin: 0; font-size: 9pt; }
.corpo h2 { font-size: 13pt; letter-spacing: 0.4px; margin: 14pt 0 6pt; padding-bottom: 3pt; border-bottom: 0.8pt solid #1A1E1E; break-after: avoid; }
.corpo h3 { font-size: 10.5pt; margin: 10pt 0 4pt; }
.corpo table:not(:has(thead th:not(:empty))) thead { display: none; }
.corpo table:not(:has(thead th:not(:empty))) td:first-child { width: 27%; }
ul:has(> li > input[type=checkbox]) { list-style: none; padding-left: 0; }
li > input[type=checkbox] { -webkit-appearance: none; appearance: none; width: 8pt; height: 8pt; border: 0.9pt solid #1A1E1E; margin: 0 6pt 0 0; vertical-align: -0.5pt; }
.corpo blockquote + blockquote { margin-top: -6pt; }
.nova-pagina { break-before: page; }
.corpo h2.nova-pagina { margin-top: 0; }
.anotacoes { margin-top: 4pt; }
.an-linha { display: flex; justify-content: space-between; align-items: flex-end; height: 21pt; border-bottom: 0.6pt solid #A0A5A5; font-size: 6.6pt; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #A0A5A5; padding-bottom: 2pt; }
.an-fim { min-width: 32mm; text-align: left; }
.ficha { display: grid; grid-template-columns: 1fr 1fr; grid-auto-flow: row dense; column-gap: 8mm; margin: 2pt 0 8pt; }
.f-item { padding: 2.8pt 0 3.2pt; border-bottom: 0.6pt solid #D4D2CF; break-inside: avoid; }
.f-item.largo { grid-column: span 2; }
.f-k { display: block; font-size: 6.2pt; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #A0A5A5; margin-bottom: 1pt; }
.f-v { display: block; font-size: 8.2pt; line-height: 1.32; }
` + cssStoryboard;

// o primeiro bloco ```quadro guarda o lugar de todos; os outros saem do texto
function separarQuadros(md) {
  const quadros = [];
  const texto = md.replace(/```quadro\n([\s\S]*?)```\n?/g, (_, bloco) => {
    quadros.push(lerQuadro(bloco));
    return quadros.length === 1 ? '\nQUADROS_AQUI\n' : '';
  });
  return { texto, quadros };
}

// a tabela da ficha, que não tem cabeçalho, vira uma grade de duas colunas
function fichaEmGrade(html) {
  return html.replace(
    /<table>\s*<thead>\s*<tr>\s*<th><\/th>\s*<th><\/th>\s*<\/tr>\s*<\/thead>\s*<tbody>([\s\S]*?)<\/tbody>\s*<\/table>/,
    (_, corpo) => '<div class="ficha">' + [...corpo.matchAll(/<tr>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/g)]
      .map(([, k, v]) => {
        const largo = v.replace(/<[^>]+>/g, '').length > 70 ? ' largo' : '';
        return `<div class="f-item${largo}"><span class="f-k">${k}</span><span class="f-v">${v}</span></div>`;
      }).join('') + '</div>');
}

function blocoDosQuadros(quadros) {
  if (quadros.length === 1 && quadros[0].desenho === 'guia') {
    return quadroHtml(quadros[0], 0, { legenda: false });
  }
  return '<h3>Storyboard</h3><div class="storyboard">' +
    quadros.map((q, i) => quadroHtml(q, i)).join('') + '</div>' +
    '<p class="legenda-sb">As faixas claras nas bordas de cada quadro são cobertas pela interface do Reels. O texto aparece na posição e no tamanho em que entra no vídeo; o desenho é só o esquema do enquadramento.</p>' +
    '<h3>Linha do tempo</h3>' + linhaDoTempo(quadros) +
    '<h3>Decupagem</h3>' + tabelaDecupagem(quadros);
}

// a última página de cada roteiro é a de aprovação: variações, checklist e as
// anotações que se preenchem à mão no dia da gravação
function anotacoes(quadros) {
  const forno = quadros.some(q => ['borda', 'forno', 'saida'].includes(q.desenho));
  const linha = (rotulo = '', fim = '') =>
    `<div class="an-linha"><span>${rotulo}</span>${fim ? `<span class="an-fim">${fim}</span>` : ''}</div>`;
  return '<h2>Anotações da diária</h2><div class="anotacoes">' +
    linha('Data da gravação') +
    (forno ? linha('Temperatura medida no piso do forno', '°C') : '') +
    linha('Tomada escolhida em cada plano') + linha() +
    linha('O que refazer') + linha() +
    linha('Aprovado por', 'Data') + '</div>';
}

const navegador = await abrirNavegador();
const imprimir = await criarImpressora(navegador);

for (const arquivo of arquivos) {
  const md = readFileSync(join(PASTA, arquivo), 'utf8');
  const h1 = md.match(/^# (.+)$/m)[1];
  const [, codigo, nome] = h1.match(/^([A-Z]\d) · (.+)$/) || [null, '', h1];
  const semTitulo = md.replace(/^# .+\n+/, '');
  const sub = semTitulo.match(/^(.+)\n/)[1];
  const { texto, quadros } = separarQuadros(semTitulo.replace(/^.+\n+/, ''));

  let corpo = marcarTabelas(fichaEmGrade(marked.parse(texto))).replace('<p>QUADROS_AQUI</p>', blocoDosQuadros(quadros));
  if (quadros.length > 1) {
    corpo = corpo.replace('<h2>Variações para teste</h2>', '<h2 class="nova-pagina">Variações para teste</h2>') + anotacoes(quadros);
  }
  const titulo = codigo ? `Roteiro ${codigo} · ${nome}` : nome;
  const css = cssPagina({
    direita: titulo,
    rodape: 'Direção de vídeo · campanha Meta Ads da QT',
    numero: 'counter(page) " de " counter(pages)',
  }) + cssBase + cssRoteiro;

  const html = documento({
    titulo,
    css,
    corpo: `<header class="titulo-doc"><p class="olho">${codigo ? `Roteiro de filmagem · ${codigo}` : 'Direção de vídeo'}</p>` +
      `<h1>${nome}</h1><p class="sub">${marked.parseInline(sub)}</p></header><div class="corpo">${corpo}</div>`,
  });

  const pdf = await imprimir(html, true);
  const saida = join(PASTA, basename(arquivo, '.md') + '.pdf');
  writeFileSync(saida, pdf);
  console.log(`salvo: ${saida} · ${contarPaginas(pdf)} páginas · ${quadros.length} quadros`);
}

await navegador.close();
