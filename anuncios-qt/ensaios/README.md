# Ensaios

O ensaio dos vídeos da campanha antes da diária, para a equipe filmar sem filmmaker no set. São três camadas: a animática de storyboard, a previz com IA e o ensaio com celular. O método, as `16` fichas com os prompts e os custos estão no caderno.

| Arquivo | O que é |
|---|---|
| [`caderno-de-ensaio.md`](caderno-de-ensaio.md) | o caderno: método, ferramenta, custos, tempo de leitura, as `16` fichas plano a plano com foto de posição e prompts, o ensaio com celular e o que comparar |
| [`caderno-de-ensaio.pdf`](caderno-de-ensaio.pdf) | o mesmo caderno em PDF, `22` páginas, uma ficha por página para imprimir e levar na sessão de fotos |
| [`animaticas/`](animaticas/) | uma animática por vídeo, em `1080 × 1920`: os planos no tempo exato, o texto na posição final e as faixas do Reels marcadas |

**Nada gerado por IA entra no anúncio.** A previz é referência de enquadramento, ritmo e luz.

## O material

Fotos e vídeos do ensaio ficam em `material/`, fora do Git, numa pasta por fonte e sempre com o nome do plano da [lista de filmagem](../roteiros/00-plano-de-filmagem.md):

| Pasta | O que vai | Exemplo |
|---|---|---|
| `material/posicao/` | as fotos de posição, uma por plano | `F1.jpg`, `M3.jpg`, `M3-fim.jpg` |
| `material/ia/` | os quadros-chave e os clipes da previz | `F1.jpg`, `F1.mp4` |
| `material/celular/` | as tomadas do ensaio com celular, já cortadas no trecho bom | `F1.mov`, `C2.mov` |

O `M1` e o `M2` usam a mesma foto de posição: salve a foto com os dois nomes.

## Como gerar

```bash
npm install
npm run animatica                       # as cinco animáticas, com o storyboard
npm run animatica -- a1                 # só o A1
npm run animatica -- --com posicao      # com as fotos de posição
npm run animatica -- --com ia           # com a previz
npm run animatica -- a2 --com celular   # com as tomadas do ensaio
npm run ensaios                         # o caderno em PDF
```

A animática precisa do `ffmpeg` instalado. Cada plano usa o melhor material que houver para ele: vídeo, depois imagem, depois o desenho do storyboard, e o canto de baixo do quadro diz de onde veio a imagem. O plano acelerado no roteiro sai acelerado também na animática, e a tomada em câmera lenta de `120` qps toca no ritmo do vídeo final. As animáticas com material levam o nome da fonte no fim: `a1-o-forno-ia.mp4`, `a1-o-forno-celular.mp4`.

O caderno em PDF traz, em cada ficha, a foto de posição que estiver em `material/posicao/`. Sem foto, fica o quadro tracejado para colar a impressão.

## O que é calculado

O `npm run ensaios` refaz duas tabelas do caderno antes de gerar o PDF: o custo, a partir das fichas, e o tempo de leitura, a partir dos textos dos roteiros. Elas ficam entre os marcadores `<!-- custos -->` e `<!-- leitura -->` do markdown e não se editam à mão. Os preços em crédito estão no começo do [`../ensaios-pdf.mjs`](../ensaios-pdf.mjs), conferidos em `06/10/2026`.

## Cada ficha

Cada ficha é um bloco `ensaio` no markdown:

```
id: F1
nome: A borda
foto: onde fica o celular para a foto de posição e o que entra no quadro
quadro-chave: o prompt da imagem, em inglês, ou "foto" para usar a própria foto
quadro-final: o prompt da imagem final, quando o clipe tem começo e fim
video: veo3_1_lite, ou nenhum
segundos: 6
movimento: o prompt do clipe, em inglês
observar: um item / outro item
erra: onde a IA costuma errar nesse plano
```

O quadro do storyboard, a câmera e o texto na tela vêm do roteiro, pela linha `capta` dos quadros. Uma ficha que nenhum roteiro usa precisa das linhas `serve` e `camera`, como a do `F4`.
