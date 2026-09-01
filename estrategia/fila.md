# A fila

Substitui o calendário de 30 dias, que era ancorado em data e quebrava na primeira falha. Aqui não existe atraso, existe posição na fila.

**A regra:** cada slot puxa a próxima peça da fila dele. Pulou? A fila não anda. Nada fica para trás, nada vira dívida.

**Programação em bloco.** Toda segunda, a semana inteira é agendada de uma vez. Foi a correção que destravou a cadência de `4` por semana: o custo não estava em postar, estava em decidir quatro vezes por semana.

| Slot | Fila | Produção |
|---|---|---|
| Terça `14h30` | Carrossel O Porquê do Número | nenhuma |
| Quinta `23h30` | Card Opinião Impopular | nenhuma |
| Sábado `9h` | Foto Autoral com legenda curta | escolher a foto |
| Domingo `10h30` | Card Forno de Casa, ou Reels se houver | quase nenhuma |

O sábado existe por dois motivos. Ele resolve o terceiro slot sem exigir produção, porque você já tem arquivo de foto e só falta a legenda, e quebra a monotonia visual de um feed que senão seria só tipografia bege quatro vezes por semana.

## Fila de carrossel · terça `14h30`

| # | Peça | Estado |
|---|---|---|
| ~~`1`~~ | ~~`75%` de hidratação~~ | **publicado `01/09`** |
| `2` | [`48h` de maturação](../posts/fila/carrossel-1-maturacao-48h.md) | pronto |
| `3` | [`W300`, força da farinha](../posts/fila/carrossel-2-forca-w300.md) | pronto |
| `4` | [`450°C` no forno](../posts/fila/carrossel-3-temperatura-450.md) | pronto |

A ordem não é arbitrária. `65%` abre porque hidratação é o número que a audiência já persegue, e o carrossel revela que ele depende de duas coisas que ela ignora. Abrir por `W300`, que seria a ordem pedagogicamente correta, começaria por um número que ninguém procura. Encontrar a pessoa onde ela está vale mais que a sequência lógica.

Cada peça anuncia a próxima na última tela, então a ordem está travada na arte. Mudar exige re-renderizar, o que é um comando.

## Fila de card · quinta `23h30`

| # | Peça | Estado |
|---|---|---|
| `1` | [Forno caro não conserta massa mal fermentada](../posts/fila/card-1-forno-caro.md) | arte e legenda prontas |
| `2` | [A maioria erra a temperatura da água e culpa a farinha](../posts/fila/card-2-temperatura-agua.md) | arte e legenda prontas |
| `3` | [Fermentação longa não é sinônimo de qualidade](../posts/fila/card-3-fermentacao-longa.md) | arte e legenda prontas |
| `4` | [Muita napoletana no Brasil copia o gesto e ignora o parâmetro](../posts/fila/card-4-napoletana.md) | pronto, decidir se entra |

**Todo card termina com CTA de comentário.** Essa é a regra que saiu do post de `20/08`, que fez `3` comentários e fechava com "pede a ficha técnica da que você já usa", uma ação para executar fora do Instagram. O Pala e Pinsa fechava com "Comenta aqui se você usa o mesmo impasto" e é a comparação que vai dizer o tamanho do efeito.

Critério para os próximos: não basta estar tecnicamente correto, alguém precisa discordar em voz alta.

## Fila de foto · sábado `9h`

| # | Peça | Estado |
|---|---|---|
| `1` | [Tacacá Sbagliato, pizza in teglia](../posts/fila/foto-1-tacaca-sbagliato.md) | fotos e legenda prontas |

O slot era "escolher a foto" e agora tem fila de verdade. A regra aqui é diferente das outras duas: a peça só entra quando existe foto de arquivo boa. No momento que exigir produção, ela sai do sábado, porque o sábado existe justamente para resolver o terceiro slot sem custo.

Legenda curta neste slot. As outras duas faixas carregam texto longo e a foto já faz sozinha o trabalho que a tipografia de um card precisa fazer com palavra.

## Fila de domingo · `10h30` · Forno de Casa

| # | Peça | Estado |
|---|---|---|
| `1` | [A mesma massa nos dois, e o que muda é o tempo lá dentro](../posts/fila/domingo-1-forno-de-casa-palida.md) | arte e legenda prontas |
| `2` | Hidratação alta no forno de casa é armadilha | pauta |
| `3` | Pedra ou aço muda mais que trocar de farinha | pauta |
| `4` | Muçarela de supermercado solta água | pauta |
| `5` | Quanto tempo a sua farinha aguenta | pauta |

Domingo deixa de ser definido por formato e passa a ser definido por público. Era "Reels educativo", e o Reels de `26/08` converteu `4,9x` pior que o card sobre gente fria, além de ser o formato mais caro de produzir, o que fazia o slot falhar toda semana apertada. Agora é card por padrão e Reels quando houver produção rolando.

O público aqui é o B, o caseiro, que é quem compra curso online. Os outros três slots todos falam com o profissional. Sem domingo, a audiência inteira vira profissional e o curso online do ano que vem nasce sem comprador.

A constante da série é o forno doméstico a `250°C`. Cada peça traduz um parâmetro profissional pra esse forno.

## Faixa oportunista

Não entra na fila porque não se agenda. A regra é: **quando houver produção acontecendo, filma.** O Reels do Pala e Pinsa nasceu assim e foi o post de maior esforço que efetivamente saiu.

O que procurar quando estiver produzindo:

- Duas coisas sendo comparadas sem querer, como dois formatos do mesmo impasto, duas farinhas, dois fornos
- Um parâmetro sendo medido, como termômetro na massa, balança, ficha técnica na mão
- Um erro acontecendo e sendo corrigido na hora
- Um produto novo entrando na casa, com a ficha técnica dele

## Story

Todo post do feed é repostado no story no mesmo dia. Fora isso, story quando houver produção. Sem meta diária.

## Fora da fila, esperando tempo de produção

Continuam roteirizadas em `posts/`, sem data e sem cobrança: cronograma de produção, o erro que me custou caro, os dois testes de Uma Variável e o post de formação.

Uma Variável em particular não volta como slot. Ela é uma lente para a faixa oportunista.

## Revisão

Uma vez por mês, olhando a aba Por série da planilha. A fila muda com base no que reteve, não com base em palpite.

## O lote em curso, até `14/09`

| Dia | Hora | Peça | Arte |
|---|---|---|---|
| Ter `01/09` | `14h30` | Carrossel `75%` de hidratação | `saida/s01-ter-hidratacao-75/` |
| Qui `03/09` | `23h30` | Card forno caro | `saida/cards/s03-qui-forno-caro.png` |
| Sáb `05/09` | `9h` | Foto Tacacá Sbagliato | arquivo do Matheus, `2` fotos |
| Dom `06/09` | `10h30` | Card forno de casa, pizza pálida | `saida/cards/s08-dom-forno-de-casa-palida.png` |
| Ter `08/09` | `14h30` | Carrossel `48h` de maturação | `saida/s02-ter-maturacao-48h/` |
| Qui `10/09` | `23h30` | Card temperatura da água | `saida/cards/s06-qui-temperatura-agua.png` |
| Sáb `12/09` | `9h` | Foto de arquivo | escolher a foto |
| Dom `13/09` | `10h30` | Card forno de casa, hidratação em casa | a escrever |

São `8` slots consumindo `7` das `10` peças prontas, com folga. Sobram o carrossel `W300`, o `450°C` e o card da napoletana.

Segunda `14/09` é o marco: repensar tudo com os dados das duas semanas na mão e programar o lote seguinte.

## Onde estamos

| | |
|---|---|
| Publicados | `2` · card de farinha em `20/08`, Reels Pala e Pinsa em `26/08` |
| Próximo carrossel | `75%` de hidratação |
| Próximo card | Forno caro |
| Estoque | `10` peças, ou `2` semanas a `4` posts por semana |
| Teste em curso | `4` por semana até `14/09`, programando em bloco toda segunda |
| Exceção | a semana de `01/09` foi programada na terça, porque a segunda não teve tempo |
