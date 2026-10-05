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

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  cssPagina, cssBase, novoMarked, marcarTabelas, documento as doc,
  abrirNavegador, criarImpressora, contarPaginas,
} from './pdf-qt.mjs';

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
const marked = novoMarked();

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
// a base vem de pdf-qt.mjs; aqui fica só o que é da apostila
const css = cssPagina({ direita: 'Meta Ads · apostila técnica', rodape: `Regras conferidas em ${conferido}` }) + `
@page capa {
  margin: 0;
  @top-left { content: none; } @top-right { content: none; }
  @bottom-left { content: none; } @bottom-right { content: none; }
}
` + cssBase + `
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

/* cada seção em página nova */
.secao, .sumario { break-before: page; }
.isolada { break-before: auto; }

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

const documento = corpo => doc({ titulo, css, corpo });

// ---------- impressão ----------
const navegador = await abrirNavegador();
const imprimir = await criarImpressora(navegador);

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
