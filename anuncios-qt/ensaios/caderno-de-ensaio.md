# Caderno de ensaio

Previz com IA e ensaio com celular, plano a plano, para a equipe chegar à diária sabendo o que cada câmera vê.

## Para que serve

Sem filmmaker no set o tempo todo, as decisões que ele tomaria na hora precisam chegar prontas: onde fica o tripé, que lente, o que entra no quadro, quanto acontece em cada plano e onde o texto cai. O ensaio resolve isso antes da diária, em três camadas, da mais barata para a mais próxima do real.

| Camada | O que é | Custo |
|---|---|---|
| Animática de storyboard | os desenhos dos roteiros montados no tempo exato, com o texto e as faixas do Reels | nenhum: está pronta em `animaticas/` |
| Previz com IA | a cena gerada a partir da foto real da posição da câmera, em clipes de `4` a `6` segundos | créditos do Higgsfield, na seção Quanto custa |
| Ensaio com celular | uma tomada curta de cada plano, gravada pela equipe e montada no tempo do roteiro | `4` pizzas da refeição da equipe e `90` minutos |

A previz mostra o alvo. O ensaio com celular mostra o que a equipe consegue com o equipamento da casa. O que muda de um para o outro é o que se ajusta antes da diária, quando ajustar ainda é barato.

**Nada gerado por IA entra no anúncio.** A campanha vende prova: `400°C`, `48` horas, 50 Top Pizza. Pizza ou salão gerado, mostrado como se fosse da QT, pode ser publicidade enganosa pelo Código de Defesa do Consumidor (art. `37`), e o público do ângulo destino reconhece borda feita por IA. A previz é régua de enquadramento, não material de edição.

## O método

1. **Assistir às animáticas.** Uma por vídeo, em `animaticas/`. Cada plano aparece no tempo exato do roteiro, com o texto na posição final e as faixas que a interface do Reels cobre. A pergunta é uma só: dá para ler cada texto no tempo dele? A seção Tempo de leitura faz a conta.
2. **Tirar as fotos de posição.** Antes de um serviço, a equipe monta cada posição de câmera das fichas com o celular da diária, em pé, na lente indicada, e tira uma foto. Marca o lugar do tripé no chão com fita crepe e anota a altura. São `16` fotos em uns `40` minutos. Essa etapa sozinha já é metade do ensaio: é nela que aparecem o exaustor no quadro, a mesa que não cabe e a lente que não alcança.
3. **Gerar a previz.** Cada foto vira um quadro-chave, que é a cena pronta dentro do espaço real da QT. O quadro-chave aprovado vira um clipe curto com o movimento do plano. As animáticas são montadas de novo com os clipes.
4. **Ensaiar com o celular.** De `2` a `5` dias antes da diária, a equipe grava uma tomada curta de cada plano. As animáticas são montadas com as tomadas e assistidas lado a lado com as da previz. O que não bate vira ajuste na posição, na luz ou no roteiro.

Sem as fotos de posição, dá para fazer um rascunho antes, com fotos da casa que já existem: o site da QT, matérias e guias. O espaço sai parecido com o real; o enquadramento, não. O forno é o que mais sofre, porque a IA inventa um se não tiver foto dele.

## A ferramenta

O Higgsfield não é um gerador de vídeo: é uma plataforma que reúne vários, com uma conta e um saldo só. Para ensaio isso pesa, porque cada etapa pede um modelo diferente e a maior parte das tentativas vai para o lixo.

| Etapa | Modelo | Por quê | Créditos |
|---|---|---|---|
| Quadro-chave | Nano Banana, do Google | edita a foto de posição sem trocar o espaço: põe pizza, mãos e pessoas e mantém o forno, o tijolo e a mesa | `1` por imagem |
| Movimento | Veo 3.1 Lite, do Google | o Veo 3.1 é a referência atual em realismo, e a versão Lite custa pouco por tentativa | `6` por `4` s, `9` por `6` s |
| Movimento, se o plano não liberar o Veo | Seedance 2.0 Mini | o mais barato que aceita imagem inicial | `5` por `5` s |
| Planos que andam, se o Veo errar | Kling 3.0 Turbo | bom em movimento de câmera | `7,5` por `5` s |
| Plano-gancho, opcional | Veo 3.1 completo | só no `F1` e no `M2`, que abrem os vídeos | `16` por `4` s |

Os clipes saem sem áudio: o som do ensaio não serve para nada, e o som de verdade se grava na diária. O Sora 2 não aparece porque saiu do ar: o aplicativo fechou em abril e a API em setembro de `2026`.

Dois limites que o primeiro rascunho mostrou. Clipe com imagem inicial e imagem final, como o `M3` e o `T1`, o Veo 3.1 Lite só gera com `8` segundos, a `12` créditos; a animática encaixa o clipe no tempo do plano. E o Starter aceita uns três vídeos gerando ao mesmo tempo: os outros voltam com aviso de limite, às vezes com um aviso enganoso de falta de crédito. A saída é mandar em levas de três.

## Quanto custa

<!-- custos: tabela gerada por ensaios-pdf.mjs a partir das fichas -->
| Bloco | Planos | Quadros-chave | Clipes | Créditos |
|---|---|---|---|---|
| Forno | `F1` `F2` `F3` `F4` | `4` | `3` | `25` |
| Bancada | `C1` `C2` | `2` | `2` | `14` |
| Mesa encenada | `M1` `M2` `M3` `M4` `M5` `M6` | `7` | `6` | `55` |
| Time-lapse | `T1` | `1` | `1` | `13` |
| Mesa comprida | `L1` `L2` `L3` | `3` | `3` | `27` |
| **Soma** | `16` planos | `17` | `15` | `134` |
| Margem para refazer, `40%` | | | | `54` |
| **Ensaio completo** | | | | **`188`** |
| Sem a mesa comprida, com a mesma margem | | | | `150` |
| Opcional: `F1` e `M2` também no Veo 3.1 completo, `4` s | | | | `32` |
<!-- /custos -->

Os preços em crédito foram conferidos no Higgsfield em `06/10/2026`. A margem de `40%` é para refazer: em ensaio, a primeira tentativa raramente é a que fica.

Crédito de assinatura não passa para o mês seguinte. Por isso a ordem é fotos prontas, depois a assinatura, e o ensaio inteiro no mesmo mês. O plano Starter que a QT assinou trouxe `600` créditos e libera o Nano Banana e o Veo 3.1 Lite, o que cobre o ensaio com folga. Se um dia o Veo 3.1 Lite sair do plano, o Seedance 2.0 Mini faz o mesmo papel e o ensaio fica mais barato.

## Tempo de leitura

No Reels, o texto disputa a atenção com a imagem e com o dedo de quem rola a tela. A conta junta os planos seguidos que repetem o mesmo texto e divide os caracteres pelos segundos. Legenda profissional em português trabalha com teto de `17` caracteres por segundo; em anúncio, o teto prático é `15`.

Nas cartelas, a leitura é em degraus: o olho pega a chamada, depois o nome da casa, e a linha de apoio fica para quem parou. Por isso, nelas, a conta usa só o que precisa ser lido: a chamada e, quando há bebida em cena, a advertência.

<!-- leitura: tabela gerada por ensaios-pdf.mjs a partir dos roteiros -->
| Vídeo | Texto na tela | Segundos | Caracteres | Por segundo | Leitura |
|---|---|---|---|---|---|
| `A1` | 400°C | `2,5` | `5` | `2,0` | folgada |
| `A1` | 48 horas de fermentação | `5,5` | `23` | `4,2` | folgada |
| `A1` | Entre as 100 melhores pizzarias do mundo · 50 TOP PIZZA · DESDE 2022 | `8,0` | `66` | `8,3` | folgada |
| `A1` | Fica nos Jardins | `3,5` | `16` | `4,6` | folgada |
| `A1` | cartela: Reserve sua mesa pelo WhatsApp | `2,5` | `30` | `12,0` | folgada |
| `A2` | Terça à noite | `2,5` | `13` | `5,2` | folgada |
| `A2` | nos Jardins | `3,5` | `11` | `3,1` | folgada |
| `A2` | Pizza napolitana e um drink bem feito | `4,0` | `37` | `9,3` | folgada |
| `A2` | Aquele lugar para ficar mais um pouquinho | `4,5` | `41` | `9,1` | folgada |
| `A2` | cartela: Reserve pelo WhatsApp · Evite o consumo excessivo de álcool. | `3,5` | `58` | `16,6` | apertada |
| `B1` | 400°C | `6,0` | `5` | `0,8` | folgada |
| `B1` | cartela: Pizza napolitana nos Jardins | `3,0` | `28` | `9,3` | folgada |
| `B2` | Aquele lugar onde você quer ficar mais um pouquinho | `5,0` | `51` | `10,2` | folgada |
| `B2` | cartela: Jardins · Evite o consumo excessivo de álcool. | `3,5` | `44` | `12,6` | justa |
| `G1` | Confraternização de fim de ano | `3,0` | `30` | `10,0` | folgada |
| `G1` | Pizza napolitana para a mesa toda | `4,0` | `33` | `8,3` | folgada |
| `G1` | [grupos de N a N pessoas] · [formato e valor por pessoa] | `4,5` | `54` | `12,0` | folgada |
| `G1` | cartela: Orce pelo WhatsApp | `4,5` | `18` | `4,0` | folgada |
<!-- /leitura -->

**O que a conta mostra.** Os textos de prova e de convite estão folgados. A única apertada é a cartela do `A2`, que junta a chamada e a advertência em `3,5` segundos, e a advertência precisa ser lida, não só aparecer. A correção mais simples é passar meio segundo do plano `4` para a cartela: o plano `4` fica com `4` segundos, a cartela com `4`, e a leitura cai para `14,5` caracteres por segundo. Vale confirmar na animática antes de mexer no roteiro.

## Como escrever um prompt

Os prompts estão em inglês, a língua em que os geradores mais aprenderam. Todos seguem a mesma ordem, e é ela que se mantém quando um prompt for ajustado:

1. **Referência.** O que a foto de posição garante: o lugar da câmera, a lente e o espaço.
2. **Enquadramento.** Vertical, de onde, a que distância e com que lente.
3. **Assunto e ação.** O que está no quadro e o que acontece, na ordem em que acontece.
4. **Luz.** De onde vem e de que cor.
5. **Aparência.** Foto ou vídeo de celular, cor natural.
6. **Proibições.** Sem texto, sem logo, sem rosto reconhecível, sem ninguém bebendo, sem corte.

O vocabulário que mais aparece:

| Na cozinha e no set | No prompt |
|---|---|
| borda, cornicione | rim, cornicione |
| manchas de leopardo | leopard spotting |
| alveolatura aberta | open crumb, large irregular alveoli |
| pá giratória | turning peel |
| câmera travada | locked-off static camera |
| lente `3×` | 3x telephoto lens |
| câmera lenta a `120` qps | slow motion, as if shot at 120 fps and played at 30 fps |
| de cima | top-down overhead shot |
| aproximação lenta | slow push-in |
| luz rasante | raking light, grazing light |
| estabilizador | smooth, steady camera move |
| quadro inicial e quadro final | start frame, end frame |

Em nenhum prompt escreva tripé, celular ou gimbal: a IA desenha o equipamento dentro do quadro, como aconteceu com o tripé no `M1` e com o estabilizador no `M6` do primeiro rascunho. Diga a altura e o ângulo, como "70 cm acima da mesa, olhando para baixo", e feche com no camera equipment in frame.

Ajuste uma coisa por vez. Se a borda saiu derretendo, mude só a frase da ação e gere de novo: mudar tudo junto não ensina o que funcionou.

## As fichas

Uma ficha por plano da lista de filmagem, uma por página, para imprimir e levar na sessão de fotos. O quadro do storyboard, a câmera e o texto na tela vêm do roteiro; a foto de posição, os prompts e o que observar são do ensaio. O quadro tracejado ao lado do storyboard é o lugar da foto de posição: impressa e colada, ou desenhada à mão. Quando as fotos chegarem em `material/posicao/`, o caderno é gerado de novo com elas no lugar. As três fichas da mesa comprida esperam a proposta de grupo.

### Forno

```ensaio
id: F1
nome: A borda
foto: tripé a 1,2 m da boca, com a câmera na altura do piso do forno, lente 3×. No quadro: o piso e a chama ao fundo; a metade de baixo é onde a borda vai entrar.
quadro-chave: Use the reference photo for the exact camera position, lens and the real oven, and keep the oven exactly as it is. Vertical 9:16 frame seen from 1.2 m in front of the oven mouth, 3x telephoto lens, level with the oven floor. A Neapolitan Margherita has just been launched onto the oven floor: its rim fills the lower half of the frame, seen edge-on, still pale and only slightly puffed, with tomato and fior di latte just behind it. The live flame and the glowing dome fill the upper half, darker and out of focus. The fire is the only light. Photorealistic smartphone photo, natural color. No text, no logos, no people, no hands, no peel, no camera equipment in frame.
video: veo3_1_lite
segundos: 6
movimento: Locked-off static camera: no movement, no zoom. In real time, the pizza rim rises and puffs up, air bubbles inflate along it and dark leopard spotting appears; the cheese starts to bubble. Flames flicker in the background with heat shimmer. Nothing enters the frame: no peel, no hands. One continuous take, no cuts. Realistic physics, smartphone footage, natural color, no camera equipment in frame, no text.
observar: A borda ocupa a metade de baixo e o alto fica escuro, que é onde o 400°C entra, em branco e sem tarja. / A lente 3× aproxima a borda sem aproximar o celular do calor; por isso o tripé fica a 1,2 m. / No A1 o plano dura 2,5 s acelerado 2×, ou seja, 5 s de borda; no B1 são 6 s em tempo real, e o clipe de 6 s serve aos dois.
erra: A borda cresce rápido e regular demais, e as manchas saem todas iguais. No forno, o tempo é o do fogo: a previz mostra o enquadramento, e a tomada longa da diária garante o trecho bom.
```

```ensaio
id: F2
nome: A pá girando
foto: mesmo ponto do F1, lente 1×. No quadro: a boca do forno inteira, o piso e a chama.
quadro-chave: Use the reference photo for the exact camera position, lens and the real oven, and keep the oven exactly as it is. Vertical 9:16 frame seen from 1.2 m in front of the oven, 1x lens, the whole oven mouth in frame. A Neapolitan Margherita bakes on the oven floor near the live flame; the round blade of a turning peel slides under it from the right, its long metal handle leaving the frame at the lower right. Firelight only. Photorealistic smartphone photo, natural color. No text, no logos, no faces, no camera equipment in frame.
video: veo3_1_lite
segundos: 4
movimento: Static camera, no movement. The turning peel lifts the pizza slightly, rotates it a quarter turn toward the flame, then draws it out to the oven mouth and stops: the whole pizza rests on the peel facing the camera for the last second. Only the peel and the pizza move; the pizzaiolo stays out of frame except for the handle. Real speed, one take, no cuts. Realistic physics, smartphone footage, no camera equipment in frame, no text.
observar: A pá entra sempre pelo mesmo lado, o da direita no storyboard. / O último segundo, com a pizza parada na pá e de frente, é o quadro que congela e escurece na cartela do B1. / No A1, o texto 48 horas de fermentação ocupa o alto do quadro, então a pizza trabalha do meio para baixo.
erra: A pá atravessa a pizza ou a pizza gira sozinha. Se acontecer duas vezes, simplifique a ação para só tirar a pizza, sem girar.
```

```ensaio
id: F3
nome: A saída
foto: tripé ao lado da boca, a 1 m, na altura da pá, lente 1×, apontado para o caminho por onde a pá sai. No quadro: a boca ao fundo e o espaço livre na frente.
quadro-chave: Use the reference photo for the exact camera position, lens and the real oven. Vertical 9:16 frame seen from beside the oven mouth, 1x lens, at peel height. A just-baked Neapolitan Margherita on the peel is coming out of the oven toward the camera: puffed rim with leopard spotting, bubbling fior di latte, tomato, a few basil leaves, a little steam. The dark oven mouth with the glowing fire behind it. Warm firelight. Photorealistic smartphone photo, natural color. No text, no logos, no faces, no camera equipment in frame.
video: veo3_1_lite
segundos: 4
movimento: Slow motion, as if shot at 120 fps and played at 30 fps. The peel carries the pizza steadily out of the oven toward the camera and stops before it reaches the lens; steam and heat rise from the pizza. Static camera. Only the peel and the pizza move. One take, no cuts. Realistic physics, smartphone footage, no camera equipment in frame, no text.
observar: A pizza cresce no quadro e para antes de cobrir a faixa de baixo, que é do botão do anúncio. / O texto do plano anterior continua no alto, e a pizza não sobe até ele. / A câmera lenta é o que mostra o vapor: sem 120 qps na diária, o plano perde o motivo.
erra: A velocidade muda no meio do movimento e a pizza deforma na pá. O ensaio serve para o caminho da pá e o ponto de parada.
```

```ensaio
id: F4
nome: O termômetro
serve: A1 · variação v3, que abre no termômetro
camera: na mão, perto, foco no visor
foto: na mão, atrás do termômetro, com o celular a pelo menos 1 m da boca. No quadro: o visor do termômetro e o piso do forno ao fundo.
quadro-chave: Use the reference photo for the exact camera position and the real oven. Vertical 9:16 close-up from a handheld smartphone: a hand holds an infrared thermometer pointed at the floor of the pizza oven; the thermometer is sharp in the foreground, the glowing oven floor and the flame blurred behind. The thermometer display is blank and dark, with no numbers. Firelight. Photorealistic smartphone photo, natural color. No text, no logos, no faces, no camera equipment in frame.
video: nenhum
observar: O visor é o assunto: foco travado nele, porque na diária o número de verdade precisa ser legível. / É variação de teste, então o quadro-chave basta, sem clipe.
erra: Escreve números no visor, sempre errados. Por isso o prompt pede o visor apagado.
```

### Bancada

```ensaio
id: C1
nome: O corte
foto: tripé na altura da bancada, de lado e paralelo ao tampo, a uns 20 cm da borda, no modo macro do celular. No quadro: a tábua com uma pizza e o fundo escuro. O LED fica à esquerda, rente ao tampo.
quadro-chave: Use the reference photo for the exact camera position, lens and the real counter. Vertical 9:16 macro close-up at counter height, from the side, about 20 cm from the rim: a baked Neapolitan Margherita on a wooden board; a straight blade rests on the rim, about to cut straight down through it. A small LED panel from the left at a grazing angle rakes across the crust, and the background falls to dark. Photorealistic smartphone photo, natural color. No text, no logos, no faces, no camera equipment in frame.
video: veo3_1_lite
segundos: 4
movimento: Locked-off macro close-up. The blade presses straight down slowly, in one continuous motion, and cuts through the rim; the crust cracks and the cross-section opens to show an open, airy crumb with large irregular alveoli. A few crumbs fall. The grazing light from the left reveals the texture. One take, no cuts. Realistic physics, smartphone footage, no camera equipment in frame, no text.
observar: A luz rasante da esquerda é o que desenha os alvéolos; de frente, eles somem. / O alto do quadro, até uns 650 px, é da tarja de três linhas e do rótulo 50 TOP PIZZA, então o corte acontece abaixo disso. / O corte é um movimento só, devagar.
erra: A lâmina entra como se a massa fosse bolo, e a alveolatura sai regular demais. Troque straight blade pela ferramenta da QT: pizza wheel, rocker knife ou serrated knife.
```

```ensaio
id: C2
nome: A fatia
foto: tripé alto, de cima em diagonal, a cerca de 45°, lente 1×. No quadro: a tábua inteira, com folga.
quadro-chave: Use the reference photo for the exact camera position, lens and the real counter. Vertical 9:16 frame, high angle at about 45 degrees: a whole baked Neapolitan Margherita on a wooden board, already cut into slices; fingers hold the first slice by its rim, ready to lift it. Soft warm side light. Photorealistic smartphone photo, natural color. No text, no logos, no faces, no camera equipment in frame.
video: veo3_1_lite
segundos: 4
movimento: Slow motion, as if shot at 120 fps and played at 30 fps. The hand lifts the first slice up and away from the pizza; the melted fior di latte stretches into a few short strings and breaks naturally; steam rises. Camera locked. One take, no cuts. Realistic physics, smartphone footage, no camera equipment in frame, no text.
observar: A fatia sobe em direção ao meio do quadro, abaixo da tarja. / O foco fica na ponta da fatia, que é onde o queijo estica.
erra: Estica o queijo em fios longos, como muçarela de rede de fast-food. O fior di latte da QT estica menos: o ensaio mostra o enquadramento, não a quantidade de queijo, e o prompt já pede fios curtos.
```

### Mesa encenada

```ensaio
id: M1
nome: A pizza na mesa
foto: tripé com braço, a 70 cm do tampo, de cima, lente 1×. No quadro: a mesa escolhida, com pratos e copos de água no lugar. A mesma foto serve ao M2: salve com os dois nomes.
quadro-chave: Use the reference photo for the exact camera position, lens and the real table. Vertical 9:16 overhead shot looking straight down from 70 cm above the table: a waiter's hands are setting a whole Neapolitan Margherita down at the center of the table; two glasses of water at opposite corners, cutlery and napkins. Warm restaurant light with a soft fill. Photorealistic smartphone photo, natural color. No alcohol, no text, no logos, no faces, no camera equipment in frame.
video: veo3_1_lite
segundos: 4
movimento: Locked overhead shot. The waiter's hands set the pizza down at the center and leave the frame; a wisp of steam rises; two diners' hands reach in from the bottom edge toward the pizza. No faces, no alcohol. Natural speed, one take, no cuts. Smartphone footage, no camera equipment in frame, no text.
observar: A pizza no centro, abaixo da tarja Fica nos Jardins. / As mãos entram por baixo, nunca por cima, que é onde está o texto. / A 70 cm, a pizza ocupa mais da metade da largura do quadro.
erra: Dedos a mais e pizza que muda de tamanho quando pousa.
```

```ensaio
id: M2
nome: A Margherita pousa
foto: a mesma do M1.
quadro-chave: Use the reference photo for the exact camera position, lens and the real table. Vertical 9:16 overhead shot looking straight down from 70 cm above the table: a waiter's hands are setting a whole Neapolitan Margherita down at the center of the table; a cocktail glass in the top-left corner and another at the lower right, both untouched; cutlery and napkins. Warm restaurant light with a soft side light from a small LED. Photorealistic smartphone photo, natural color. No text, no logos, no faces, no camera equipment in frame.
video: veo3_1_lite
segundos: 4
movimento: Locked overhead shot. The pizza is set down at the center and steam rises from it against the darker tabletop; the waiter's hands leave the frame; the cocktail glasses stay still. Nobody drinks, no toast. Natural speed, one take, no cuts. Smartphone footage, no camera equipment in frame, no text.
observar: O vapor é o gancho do A2: o LED de lado, a 45°, faz o vapor aparecer contra o tampo. / O drink fica parado do começo ao fim, que é regra do CONAR.
erra: Vapor de panela, exagerado, e mão que pega o copo. Se a IA puser alguém bebendo, o clipe não serve nem de referência.
```

```ensaio
id: M3
nome: A travessia
foto: duas fotos na altura do peito, lente 1×: uma do ponto de partida da travessia, com o nome M3, e outra a 1 m da mesa de chegada, com o nome M3-fim.
quadro-chave: Use the reference photo for the exact camera position, lens and the real dining room, and keep the architecture, brick, benches and lamps exactly as they are. Vertical 9:16 frame at chest height, 1x lens. Evening service: warm pendant lights on, guests at the background tables seen from behind or far away, with no recognizable faces, and at the end of the path a table in the middle with a Margherita and two cocktails. Photorealistic smartphone photo, natural color. No text, no logos, no camera equipment in frame.
quadro-final: Use the reference photo for the exact camera position, lens and the real dining room. Vertical 9:16 frame at chest height, 1x lens, about 1 m from a table in the middle of the room: a Margherita and two untouched cocktails on the table, the hands of two guests, warm pendant light, background tables softly blurred, no recognizable faces. Photorealistic smartphone photo, natural color. No text, no logos, no camera equipment in frame.
video: veo3_1_lite
segundos: 8
movimento: Smooth, stabilized shot at chest height. The camera walks slowly forward through the dining room and arrives at the table in the middle, ending on the Margherita and the two cocktails. Constant slow speed, no shake, no turns. Guests in the background stay soft; nobody drinks. One take, no cuts. Smartphone footage, natural color, no camera equipment in frame, no text.
observar: É o único movimento do A2: 3,5 s de passos, ou uns 2 a 3 m de caminho, não mais. / Altura constante do começo ao fim; o joelho levemente dobrado amortece o passo. / A mesa de chegada termina no centro do quadro, abaixo da tarja nos Jardins.
erra: Vira a câmera no meio do caminho ou acelera no fim, e gente aparece do nada. Se errar duas vezes, troque para o Kling 3.0 Turbo.
```

```ensaio
id: M4
nome: A fatia passa
foto: tripé na altura da mesa, de lado, lente 2×. No quadro: o tampo na parte de baixo do terço do meio e o salão ao fundo.
quadro-chave: Use the reference photo for the exact camera position, lens and the real table. Vertical 9:16 side view at table height, 2x lens, focus on the hands: a hand on the left holds out a slice of Margherita across the table toward an open hand on the right; a cocktail glass rests beside a plate; the dining room behind is softly blurred. Warm light. Photorealistic smartphone photo, natural color. No text, no logos, no faces, no camera equipment in frame.
video: veo3_1_lite
segundos: 4
movimento: Locked shot at table height, focus on the hands. The slice passes from the left hand to the right hand across the table; then a hand sets a cocktail glass down beside the plate and lets go. Nobody drinks, no toast. Natural speed, one take, no cuts. Smartphone footage, no camera equipment in frame, no text.
observar: A lente 2× desfoca o fundo e isola as mãos. / A passagem acontece no meio do quadro, abaixo das duas linhas da tarja. / O copo pousa e fica.
erra: A fatia dobra, some ou se duplica no meio da passagem.
```

```ensaio
id: M5
nome: A mesa aberta
foto: tripé com braço mais alto que o do M2, uns 1,2 m acima do tampo. No quadro: a mesa inteira, com folga nas bordas.
quadro-chave: Use the reference photo for the exact camera position, lens and the real table. Vertical 9:16 top-down shot from about 1.2 m above the tabletop: the whole table, the Margherita half eaten, two untouched cocktails, plates and napkins, the hands and forearms of two people in conversation. Warm restaurant light. Photorealistic smartphone photo, natural color. No text, no logos, no faces, no camera equipment in frame.
video: veo3_1_lite
segundos: 6
movimento: Locked overhead shot. Hands gesture as the two people talk and laugh; one hand takes a slice; the glasses stay on the table, untouched. Nobody drinks. Natural speed, one take, no cuts. Smartphone footage, no camera equipment in frame, no text.
observar: Mais alto que o M2: a mesa cabe inteira e sobra tampo nas bordas. / A tarja de três linhas ocupa o alto, e lá fica tampo ou prato, nunca as mãos. / As taças ficam paradas o plano inteiro.
erra: Mãos demais na mesa e copos que se mexem sozinhos.
```

```ensaio
id: M6
nome: A aproximação
foto: na altura da mesa, lente 1×, a 3 m da mesa do meio. No quadro: a mesa, as mesas de fundo, o tijolo, o preto e branco e os bancos azul-escuro.
quadro-chave: Use the reference photo for the exact camera position, lens and the real dining room, and keep the architecture exactly as it is. Vertical 9:16 frame at table height, 1x lens, about 3 m from a table in the middle of the room: a Margherita in the center, two glasses, the hands of two guests; the background tables occupied and out of focus; aged brick, black-and-white details, dark navy benches and warm pendant lights visible. Photorealistic smartphone photo, natural color. No text, no logos, no recognizable faces, no camera equipment in frame.
video: veo3_1_lite
segundos: 6
movimento: The camera glides slowly forward at table height toward the table, a smooth and steady push-in that ends about 1 m from the pizza. Constant speed, no shake, no turns. The guests' hands move naturally; nobody drinks. The background stays soft. One take, no cuts. Smartphone footage, natural color, no camera equipment in frame, no text.
observar: O tijolo, o preto e branco e os bancos azul-escuro precisam estar no quadro: são a assinatura da casa. / O último quadro congela na cartela do B2, então a aproximação termina numa imagem parada e bonita.
erra: Troca a arquitetura: inventa janela, muda o tijolo, acende luz que a casa não tem. É para isso que serve a foto de referência.
```

### Time-lapse

```ensaio
id: T1
nome: O salão enchendo
foto: celular 2 no canto mais alto do salão, lente 0,5×, na hora da abertura, com a luz do dia. No quadro: o salão inteiro e, se der, a janela.
quadro-chave: foto
quadro-final: Use the reference photo for the exact camera position, lens and the real dining room, and keep everything identical. The same view at night with the house full: every table occupied, people small in the frame and not recognizable, the pendant lights glowing warm, the window dark. Photorealistic smartphone photo, ultra-wide lens, natural color. No text, no logos, no camera equipment in frame.
video: veo3_1_lite
segundos: 8
movimento: Time-lapse from a fixed high corner, ultra-wide lens: the dining room fills up, from empty to full, while the daylight in the window fades to night and the pendant lights take over. People appear as quick blurred motion, with no recognizable faces. Locked camera. Smartphone footage, natural color, no camera equipment in frame, no text.
observar: O canto alto deixa as pessoas pequenas, e é isso que garante que nenhum cliente fique reconhecível. / A janela no quadro é o relógio do vídeo. / A tarja de três linhas cobre o alto: o teto e os pendentes ficam atrás do texto, e o salão abaixo dele.
erra: O salão muda de forma ao longo do clipe e aparece rosto nítido. Se acontecer, fique com o quadro final como referência e descarte o clipe.
```

### Mesa comprida

```ensaio
id: L1
nome: A mesa de cima
foto: câmera alta, de cima, sobre as mesas juntas no lugar da mesa comprida. No quadro: a mesa inteira, de cima a baixo.
quadro-chave: Use the reference photo for the exact camera position, lens and the real room. Vertical 9:16 top-down shot from high above a long table made of the house tables joined end to end, running from the top to the bottom of the frame, set for ten people: plates, glasses of water, napkins, cutlery; the guests' hands and shoulders along both sides. Warm restaurant light. Photorealistic smartphone photo, natural color. No text, no logos, no faces, no camera equipment in frame.
video: veo3_1_lite
segundos: 6
movimento: Locked overhead shot. Pizzas arrive one after another and are set down along the center of the table by a waiter who always enters from the same side; the guests' hands reach in. Natural speed, one take, no cuts. Smartphone footage, no camera equipment in frame, no text.
observar: A mesa inteira no quadro, de cima a baixo. / O garçom entra sempre pelo mesmo lado. / No vídeo o plano vai acelerado 2×, e os 6 s do clipe viram 3.
erra: O número de pessoas muda e aparece pizza do nada na mesa.
```

```ensaio
id: L2
nome: De mão em mão
foto: tripé na altura da mesa, de lado, lente 2×, olhando ao longo da mesa comprida.
quadro-chave: Use the reference photo for the exact camera position, lens and the real room. Vertical 9:16 side view at table height, 2x lens, along the long table: hands pass a pizza and slices from one guest to the next; plates and glasses of water on the table; faces out of frame or out of focus. Warm light. Photorealistic smartphone photo, natural color. No text, no logos, no camera equipment in frame.
video: veo3_1_lite
segundos: 4
movimento: Locked shot at table height. A pizza and slices pass from hand to hand along the table while people laugh off frame. Natural speed, one take, no cuts. Smartphone footage, no camera equipment in frame, no text.
observar: As mãos no meio do quadro, abaixo das duas linhas da tarja. / A passagem vai sempre no mesmo sentido, em todas as tomadas.
erra: Mão que sai do nada e pizza que se divide sozinha.
```

```ensaio
id: L3
nome: O grupo da cabeceira
foto: na cabeceira, na altura do peito, lente 1×. No quadro: a mesa em fuga até o fundo e os pendentes.
quadro-chave: Use the reference photo for the exact camera position, lens and the real room. Vertical 9:16 frame from the head of a long table at chest height, 1x lens: a group of ten seated along both sides, pizzas down the middle of the table, warm pendant lights above, everyone talking. Faces soft and not the subject. Photorealistic smartphone photo, natural color. No text, no logos, no camera equipment in frame.
video: veo3_1_lite
segundos: 6
movimento: The camera glides slowly forward from the head of the table along its length, a smooth and steady push-in. Constant speed, no shake, no turns. People talk and pass slices. One take, no cuts. Smartphone footage, natural color, no camera equipment in frame, no text.
observar: A mesa em fuga para o centro do quadro, com as pessoas dos dois lados. / As duas tarjas da proposta ficam no alto, e a mesa começa abaixo delas.
erra: O grupo muda de tamanho durante a aproximação e as pizzas se multiplicam.
```

## O ensaio com celular

| | |
|---|---|
| Quando | de `2` a `5` dias antes da diária, antes do serviço, em `90` minutos |
| Quem | quem vai filmar na diária e o pizzaiolo que vai assar |
| Pizzas | `4` Margheritas da refeição da equipe: `2` no forno, uma delas segue para a bancada, e `2` na mesa |
| Material | o celular e os tripés da diária, o LED, fita crepe, o termômetro, este caderno e as animáticas no celular |

### Os 90 minutos

1. **Forno, `30` minutos.** `F1`, `F2` e `F3` numa tomada longa por pizza, da entrada à saída, como no plano de filmagem. Antes, medir o piso com o termômetro e anotar na ficha.
2. **Bancada, `20` minutos.** `C1` e `C2` com uma das pizzas do forno: o corte com o LED rasante e a primeira fatia em câmera lenta.
3. **Mesa, `30` minutos.** `M1` a `M6` com duas pessoas da equipe. Nos planos que andam, três passagens; fica a melhor.
4. **Conferência, `10` minutos.** Assistir no celular de quem filmou, sem som, plano por plano, com a animática da previz aberta ao lado.

### Antes de cada tomada

- [ ] Celular em pé, grade ligada, lente certa e nenhum zoom digital.
- [ ] Foco e exposição travados com toque longo.
- [ ] A ação dentro da faixa do meio, abaixo da linha do texto.
- [ ] Nada importante no alto do quadro, que é do texto.
- [ ] Tripé no lugar marcado no chão.

### Depois

As tomadas vão para `material/celular/`, cada uma com o nome do plano da lista: `F1.mov`, `C1.mov`, `M3.mov`. Corte cada tomada no trecho bom antes, no próprio celular, porque a animática usa o arquivo desde o primeiro quadro. A câmera lenta pode ir como saiu do celular: a animática reconhece os `120` qps e toca no ritmo certo.

<!-- nova-pagina -->
## Como ler a previz

A previz responde como a câmera vê, não como a pizza é.

| Copie da previz | Não copie da previz |
|---|---|
| a posição e a altura da câmera | a física da comida: borda, queijo e vapor |
| a lente: quanto o fundo aproxima e desfoca | mãos e dedos, que a IA ainda erra |
| o que entra e o que sai do quadro | a cor: a da QT é a da luz da casa |
| onde a ação acontece em relação ao texto | a velocidade da borda, que no forno é a do fogo |
| de onde vem a luz | qualquer coisa que o forno, a mesa ou a pizza da QT não têm |
| quanto acontece em cada segundo | |

## O que comparar

Com as duas animáticas lado a lado, a da previz e a do ensaio, plano a plano:

| Pergunta | Se a resposta for não |
|---|---|
| A câmera está na posição e na altura da previz? | remarque o tripé e corrija a altura na ficha |
| A ação acontece abaixo do texto? | suba a câmera ou abra a lente; o texto não desce para a faixa de baixo |
| Cabe no tempo do plano? | escolha outro trecho da tomada ou mude a duração no roteiro |
| A luz desenha o que precisa: alvéolo, vapor, borda? | mude o LED de lugar antes de mudar a câmera |
| A pizza da QT faz o que a previz mostrou? | o roteiro se ajusta à pizza, nunca o contrário |

Com as fichas anotadas, o roteiro e o plano de filmagem são atualizados antes da diária. O que mudar na tela muda no `.md` do roteiro, e o PDF e a animática saem de novo.

## Fontes

- Comparativos de geradores de vídeo em `2026`: [Tech Insider](https://tech-insider.org/best-ai-video-generator-2026/) e [Pixverse](https://pixverse.ai/en/blog/best-ai-video-generators).
- O Higgsfield por dentro: [Luma Labs](https://lumalabs.ai/news/higgsfield-review) e [Pasquale Pillitteri](https://pasqualepillitteri.it/en/news/677/higgsfield-ai-video-guide).
- Planos e créditos do Higgsfield: [Creatify](https://creatify.ai/blog/higgsfield-pricing-(2026)-plans-and-what-you-ll-actually-pay) e [Krea](https://www.krea.ai/blog/higgsfield-pricing-explained-2026-unlimited-credits-and-real-monthly-costs).
- Ferramenta de pré-produção comparada: [LTX Studio](https://ltx.studio/alternatives/higgsfield).
- Tempo de leitura de legenda: [guia de legendas da Netflix em português do Brasil](https://backlothelp.netflix.com/hc/en-us/articles/215600497-Portuguese-Brazil-Timed-Text-Style-Guide).
- Custo de cada modelo em créditos: consultado no próprio Higgsfield em `06/10/2026`.
