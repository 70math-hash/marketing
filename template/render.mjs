// Renderiza cada carrossel de template/dados/*.json em PNG 1080x1350.
// Uso:  node template/render.mjs            (todos)
//       node template/render.mjs s01-ter    (só os que casam com o filtro)

import { chromium } from 'playwright';
import { readFileSync, readdirSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname, resolve, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI  = dirname(fileURLToPath(import.meta.url));
const RAIZ  = resolve(AQUI, '..');
const DADOS = join(AQUI, 'dados');
const SAIDA = join(RAIZ, 'saida');
const filtro = process.argv[2] || '';

const arquivos = readdirSync(DADOS)
  .filter(f => f.endsWith('.json'))
  .filter(f => !filtro || f.includes(filtro))
  .sort();

if (!arquivos.length) {
  console.error(`nenhum json em template/dados${filtro ? ` casando com "${filtro}"` : ''}`);
  process.exit(1);
}

const navegador = await chromium.launch();
const pagina = await navegador.newPage({
  viewport: { width: 1080, height: 1350 },
  deviceScaleFactor: 2,           // 2160x2700, com folga pro Instagram
});

const modelo = readFileSync(join(AQUI, 'carrossel.html'), 'utf8');
let totalPng = 0;

for (const arquivo of arquivos) {
  const nome = basename(arquivo, '.json');
  const dados = JSON.parse(readFileSync(join(DADOS, arquivo), 'utf8'));

  const html = modelo.replace(
    /(<script id="dados" type="application\/json">)[\s\S]*?(<\/script>)/,
    (_, a, b) => a + JSON.stringify(dados).replace(/<\//g, '<\\/') + b
  );

  // baseURL de arquivo para as fontes e o logo resolverem por caminho relativo
  await pagina.goto(pathToFileURL(join(AQUI, 'carrossel.html')).href);
  await pagina.setContent(html, { waitUntil: 'load' });
  await pagina.evaluate(() => document.fonts.ready);

  const destino = join(SAIDA, nome);
  if (existsSync(destino)) rmSync(destino, { recursive: true });
  mkdirSync(destino, { recursive: true });

  const telas = await pagina.locator('.tela').all();
  for (const [i, tela] of telas.entries()) {
    const n = String(i + 1).padStart(2, '0');
    await tela.screenshot({ path: join(destino, `${n}.png`) });
    totalPng++;
  }
  console.log(`${nome}: ${telas.length} telas`);
}

await navegador.close();
console.log(`\n${totalPng} PNG em saida/`);
