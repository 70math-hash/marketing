// Gera as capas de destaque em 1080x1920. Uso: node template/render-destaques.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI  = dirname(fileURLToPath(import.meta.url));
const SAIDA = join(resolve(AQUI, '..'), 'saida', 'destaques');
mkdirSync(SAIDA, { recursive: true });

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport:{width:1080,height:1920}, deviceScaleFactor:1 });
await pagina.goto(pathToFileURL(join(AQUI, 'destaques.html')).href);
await pagina.waitForFunction(() => document.images.length === 0 ||
  [...document.images].every(i => i.complete && i.naturalWidth > 0));

for (const capa of await pagina.locator('.capa').all()) {
  const nome = await capa.getAttribute('data-nome');
  await capa.screenshot({ path: join(SAIDA, `${nome}.png`) });
  console.log(`destaque: ${nome}`);
}
await navegador.close();
