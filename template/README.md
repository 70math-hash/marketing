# Template de carrossel

Gera os PNG da série O Porquê do Número em `1080x1350`, prontos pra postar. O layout é fixo e o conteúdo vem de um JSON, então cada carrossel novo é só um arquivo de texto e um comando.

## Como fazer um carrossel novo

**1.** Copia um JSON existente em `dados/` e troca o conteúdo:

```json
{
  "serie": "O porquê do número",
  "numero": "48h",
  "pergunta": "o que acontece dentro da massa nesse tempo",
  "telas": [
    { "titulo": "Maturação não é fermentação", "texto": "Primeiro parágrafo.\n\nSegundo parágrafo." }
  ],
  "sintese": "A frase de fecho.",
  "proximo": "W300"
}
```

**2.** Roda:

```bash
npm install          # só na primeira vez
npm run render       # todos
npm run render -- s02-ter    # só um
```

**3.** Os PNG saem em `saida/<nome-do-json>/`, numerados `01.png` em diante, que é a ordem de publicação no carrossel.

## O que o template resolve sozinho

**Número em mono.** Qualquer coisa entre crase vira IBM Plex Mono em Verde-EVO, tanto no título quanto no corpo. Escrevendo `` `65%` `` no JSON, sai formatado. É a regra `2` da marca aplicada automaticamente, sem depender de lembrar.

**Tamanho do número da capa.** Ele encolhe conforme cresce, de `300px` com dois caracteres até `104px` com sete, então `65%` e `450°C` ocupam bem o campo sem nenhum ajuste manual.

**Contagem de telas.** A capa e o fecho são gerados sozinhos, e a barra de progresso com `3/6` se calcula pela quantidade de telas do JSON. Essa barra não é decoração, ela mostra quanto falta e por isso segura o deslize até o fim.

**Geometria do disco.** Cornicione `0.16R` e campo `0.84R`, como manda o manual, com a mira nas telas internas e o selo MR no fecho.

## Estrutura

| Arquivo | O que é |
|---|---|
| `carrossel.html` | O layout. Mexa aqui pra mudar o design de todos de uma vez |
| `render.mjs` | Abre o Chromium, injeta o JSON e tira o print de cada tela |
| `dados/*.json` | O conteúdo de cada carrossel |
| `assets/fonts/` | Literata, IBM Plex Mono e Source Sans 3, em woff2 |
| `assets/logo/` | Wordmark, monograma e selo, em PNG |

## Preview no navegador

Abrindo `carrossel.html` direto no navegador aparece o template com o JSON vazio, porque o conteúdo é injetado na hora de renderizar. Pra ver uma peça montada, olhe os PNG em `saida/`.

## Detalhes que valem saber

As fontes vêm em `woff2` por caminho relativo, então mover a pasta `assets` quebra a renderização.

A Gardiant não está aqui, porque é fonte licenciada e não vem embutida na skill da marca. Por isso o wordmark e o selo entram como PNG já rasterizado, que é o que o manual recomenda pra HTML e PDF.

O `deviceScaleFactor` está em `2`, então os PNG saem em `2160x2700`. O Instagram comprime na subida de qualquer jeito, e sair grande demais não ajuda, mas essa folga evita textura ruim em tela de celular bom.

## Capas de destaque

`destaques.html` gera as capas dos Destaques do Instagram em `1080x1920`, e o comando é `node template/render-destaques.mjs`. Saem em `saida/destaques/`.

As cinco usam a mesma geometria do selo oficial, com cornicione de tinta em `r=140` e campo verde em `r=118`, que é o `0.84R` do manual. Cada uma tem um símbolo diferente no centro: alveolatura em Massa, arco de boca de forno em Forno, a mira em Erros, o hexágono dos glifos de processo em Prêmios, e o selo MR em Cursos.

Foram testadas no tamanho real de exibição, que é um círculo de `62px` no celular. Símbolo mais detalhado que isso vira borrão nesse tamanho, então mantenha a mesma simplicidade ao criar uma nova.

## Cards de Opinião Impopular

`card.html` gera os cards de frase única em `1080x1350`, e o comando é `node template/render-cards.mjs`. O conteúdo fica em `dados/cards.json` e a saída em `saida/cards/`.

A frase encolhe conforme cresce, de `104px` até `58px`, então frase curta ocupa a tela e frase longa continua cabendo sem ajuste manual.

Uma nota de implementação que vale para os três templates: o script de render faz `goto` e depois `setContent`, o que executa o script da página duas vezes no mesmo escopo global. Sem envolver o código em uma IIFE, o segundo passe estoura com `Identifier already declared` e a página sai vazia. Os três já estão envolvidos.

### Cards com foto

`dados/cards.json` aceita `layout` e `foto`:

| layout | Como fica | Quando usar |
|---|---|---|
| `so-texto` | Só a frase, com filete Verde-EVO | Quando não existe foto que prove o argumento |
| `recorte` | Foto sangrando pelo canto de baixo à esquerda, MR à direita | Corte transversal, que mostra estrutura |
| `disco-var` | Foto dentro do disco, canto de baixo à direita | Foto cenital, que mostra o topo |

Para `recorte` a foto precisa ser **PNG com fundo transparente**, senão o retângulo branco aparece sobre o papel. Para `disco-var` pode ser foto comum, porque o círculo recorta.

Duas decisões que valem saber. O MR muda de lado no `recorte`, indo para a direita, porque a foto entra pela esquerda e os dois colidiam. E o filete Verde-EVO some quando existe foto, porque a foto já é o ponto de cor e o manual não admite dois acentos competindo.

A escolha entre `recorte` e `disco-var` não é estética, é argumentativa. Corte transversal mostra alveolatura e miolo, então prova afirmação sobre estrutura, força de farinha e fermentação. Cenital mostra o disco e a leopardatura, então prova afirmação sobre forno e assamento.
