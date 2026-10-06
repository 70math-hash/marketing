# B1 · A borda

`VIT_REELS_BORDA_v1` · Reels `9:16` · `12` segundos · campanha vitrine

## Ficha

| | |
|---|---|
| Anúncio | `VIT_REELS_BORDA_v1`, no conjunto `R4km_18+_ADV` da campanha `QT_VIT_ALC` |
| Ângulo | vitrine: fazer o bairro guardar a imagem e o nome |
| Para quem | quem mora ou trabalha num raio de `4` km, visto no máximo `2` vezes por semana |
| Duração | `12` segundos, em `3` planos |
| Entrega | `1080 × 1920` para Reels e Stories, `1080 × 1350` para o Feed |
| Som | o forno como ele é: fogo, chiado, pá. Sem música |
| Pizza em cena | Margherita |
| Bebida em cena | não |
| Texto do anúncio | o do plano de largada, com o botão Saiba mais e o link `wa.me` da vitrine |
| Gravação | bloco `1` da diária: planos `F1` e `F2`, as mesmas tomadas do `A1` |

## A ideia

Doze segundos de forno que ficam na cabeça. É a vinheta da QT no bairro.

A vitrine não pede reserva, pede lembrança. Ela vai aparecer duas vezes por semana para a mesma pessoa, então precisa ser o tipo de imagem que dá vontade de ver de novo, e não um anúncio que cansa. Por isso o vídeo é quase só imagem e som: a borda crescendo em tempo real, sem corte, e o nome da casa no fim.

Tempo real é escolha, não falta de edição. Acelerar deixa a borda bonita; tempo real deixa ela verdadeira, e quem vê sabe a diferença.

## Plano a plano

```quadro
plano: 1
capta: F1
tempo: 0,0 a 6,0 s
desenho: borda
fundo: forno
imagem: a borda estufando em tempo real, sem corte, as manchas aparecendo
camera: tripé a 1,2 m da boca, lente 3×, travado; tempo real
som: fogo e chiado, como estiver
texto: 400°C | 300 | 190 | numero
```

```quadro
plano: 2
capta: F2
tempo: 6,0 a 9,0 s
desenho: forno
fundo: forno
imagem: a pá tira a pizza e gira uma vez na frente da boca do forno
camera: mesmo tripé, lente 1×
som: a pá raspando o piso
```

```quadro
plano: 3
capta: F2
tempo: 9,0 a 12,0 s
desenho: saida
fundo: forno
escurecer: 60
cartao: sim
imagem: a pizza inteira na pá, parada; a imagem escurece e o cartão creme entra por cima
camera: último quadro do plano 2 congelado e escurecido na edição
som: o fogo baixando
texto: Aqui cortamos carboidratos | 740 | 58 | lema
texto: QT PIZZA BAR | 680 | 44 | marca
texto: Napolitana de / verdade, nos Jardins | 840 | 70 | chamada
texto: terça a domingo, no jantar | 1030 | 38 | nota
```

## Como filmar

- **Nada novo para gravar.** O `B1` sai das tomadas longas do bloco `1`, as mesmas do `A1`. Por isso a regra da tomada longa: da entrada da pizza até a saída, sem parar.
- **O plano `1` pede a tomada mais limpa.** Seis segundos sem a pá cruzar o quadro e sem mão na frente. Escolha, entre as três pizzas, a que estufou de forma mais bonita.
- **O número da tela** é o mesmo do `A1`: o que o termômetro mediu no piso.
- **O plano `2`** precisa terminar com a pizza parada na pá, de frente para a câmera, por pelo menos um segundo. É desse quadro que sai a cartela.

## Como montar

- **Plano `1` em tempo real,** sem acelerar. O `400°C` entra meio segundo depois do começo e fica até o corte.
- **Corte seco** para o plano `2`, na hora em que a pá entra no quadro.
- **Cartela sobre a imagem.** O último quadro do plano `2` congela e escurece `60%` em meio segundo, e o cartão creme com o lema da camiseta entra por cima, em corte seco.
- **Som.** O fogo sobe um pouco no plano `1`, é o que segura quem está com som ligado. Termina com o fogo baixando junto com a imagem.

## Variações para teste

| Versão | O que muda | Duração |
|---|---|---|
| `VIT_REELS_BORDA_v2` | abre no corte do `A1`, plano `C1`, antes da borda | `14` s |
| `VIT_REELS_BORDA_v3` | só o plano `1` e a cartela, para Stories | `8` s |

## Antes de subir

- [ ] O número de temperatura é o que o termômetro mediu.
- [ ] O plano `1` não tem corte, nem pá, nem mão cruzando.
- [ ] O primeiro quadro já é a borda no fogo.
- [ ] Todo texto dentro da zona segura, na versão `9:16` e na `4:5`.
- [ ] Nenhuma bebida em cena e nenhuma música.
- [ ] Duração entre `11` e `14` segundos.
- [ ] Os dois arquivos com o nome certo.
