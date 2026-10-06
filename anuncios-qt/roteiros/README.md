# Roteiros de vídeo

Os vídeos da campanha de Meta Ads da QT, com direção, storyboard e tudo que a gravação e a edição precisam. Cada vídeo tem um roteiro, e o plano de filmagem junta todos numa diária.

| Arquivo | Vídeo | Duração | Páginas |
|---|---|---|---|
| [`00-plano-de-filmagem`](00-plano-de-filmagem.md) | a direção, a diária, a lista de planos, equipamento, ajustes, som, segurança, direito de imagem e entrega | | `6` |
| [`01-a1-o-forno`](01-a1-o-forno.md) | `A1` · reserva · a borda a `400°C` e as três provas na tela | `22` s | `3` |
| [`02-a2-terca-a-noite`](02-a2-terca-a-noite.md) | `A2` · reserva · a Margherita chegando à mesa numa terça | `18` s | `3` |
| [`03-b1-a-borda`](03-b1-a-borda.md) | `B1` · vitrine · a borda em tempo real e o nome da casa | `12` s | `3` |
| [`04-b2-o-salao`](04-b2-o-salao.md) | `B2` · vitrine · o salão enchendo em time-lapse | `13` s | `3` |
| [`05-g1-a-mesa-comprida`](05-g1-a-mesa-comprida.md) | `G1` · confraternização · a mesa comprida, quando a proposta de grupo existir | `16` s | `3` |

Cada `.md` tem o `.pdf` correspondente ao lado, que é o que vai impresso para a gravação.

## Como cada roteiro se organiza

Três páginas, sempre na mesma ordem:

1. **Ficha, ideia e storyboard.** O que o vídeo precisa fazer, para quem, e cada plano desenhado em escala `9:16`, com a zona segura do Reels marcada e o texto na tela na posição e no tamanho em que entra no vídeo.
2. **Linha do tempo, decupagem, como filmar e como montar.** O ritmo de cada plano e de cada texto, a câmera, o som e as regras de edição.
3. **Variações, checklist e anotações da diária.** As versões de gancho para testar depois, o que conferir antes de subir, e um campo para preencher à mão no set: temperatura medida, tomada escolhida, o que refazer e quem aprovou.

## Como mexer

O texto mora no `.md`. Cada plano é um bloco `quadro`:

```
plano: 1
capta: F1
tempo: 0,0 a 2,5 s
desenho: borda
fundo: forno
imagem: a borda já dentro do forno, estufando e pintando de leopardo
camera: tripé a 1,2 m da boca, lente 3×, travado
som: fogo e chiado
texto: 400°C | 300 | 190 | numero
```

A linha `capta` diz de qual plano da lista de filmagem sai a imagem: `F1`, `C1`, `M2`. É por ela que a animática e o [caderno de ensaio](../ensaios/caderno-de-ensaio.md) acham o material de cada plano. A cartela, que é gráfico da edição, não tem `capta`.

A linha `texto` é `conteúdo | altura em px | tamanho em px | estilo`, em pixel do vídeo final, `1080 × 1920`. O texto quebra linha em ` / `.

O texto na tela segue a camiseta da casa: azul royal `#1F45B5` sobre creme `#F1E9DA`, na Oswald, que vai embutida no PDF e no vídeo. Nos planos, `numero` é o número grande em creme com sombra azul, `etiqueta` é a frase principal em etiqueta creme levemente torta e `fala` é a frase de apoio em creme sobre azul. Na cartela, `lema` põe a frase em arco, como nas costas da camiseta, e `marca`, `chamada`, `nota` e `aviso` vêm centralizados embaixo. A linha `cartao: sim` põe um cartão creme por trás da cartela que entra sobre a imagem, e `fundo: creme` faz a cartela de fundo inteiro. Os estilos antigos, `limpo`, `tarja`, `rotulo` e `apoio`, continuam funcionando.

Os desenhos disponíveis estão em [`../storyboard.mjs`](../storyboard.mjs): `borda`, `forno`, `saida`, `corte`, `fatia`, `mesa`, `mesa-drink`, `dividir`, `salao`, `timelapse`, `mesa-longa`, `mesa-cabeceira` e `cartela`.

Depois de mexer, gere de novo:

```bash
npm install
npm run roteiros          # todos
npm run roteiros -- a1    # só um
```

O desenho de cada quadro é esquema de enquadramento, não ilustração: mostra onde a pizza, o forno e as mãos ficam no quadro, e onde o texto pode entrar.

Cada roteiro tem também uma animática, os mesmos quadros montados no tempo exato do vídeo, em [`../ensaios/animaticas/`](../ensaios/animaticas/). Mexeu num roteiro, rode `npm run animatica` junto com o `npm run roteiros`.
