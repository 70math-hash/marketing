// Gera os cards de Opinião Impopular. Uso: node template/render-cards.mjs
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI=dirname(fileURLToPath(import.meta.url));
const SAIDA=join(resolve(AQUI,'..'),'saida','cards');
mkdirSync(SAIDA,{recursive:true});

const dados=JSON.parse(readFileSync(join(AQUI,'dados','cards.json'),'utf8'));
const modelo=readFileSync(join(AQUI,'card.html'),'utf8');
const html=modelo.replace(/(<script id="dados" type="application\/json">)[\s\S]*?(<\/script>)/,
  (_,a,b)=>a+JSON.stringify(dados).replace(/<\//g,'<\\/')+b);

const nav=await chromium.launch();
const pag=await nav.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:2});
await pag.goto(pathToFileURL(join(AQUI,'card.html')).href);
await pag.setContent(html,{waitUntil:'load'});
await pag.evaluate(()=>document.fonts.ready);
await pag.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
for(const t of await pag.locator('.tela').all()){
  const nome=await t.getAttribute('data-nome');
  await t.screenshot({path:join(SAIDA,`${nome}.png`)});
  console.log(`card: ${nome}`);
}
await nav.close();
