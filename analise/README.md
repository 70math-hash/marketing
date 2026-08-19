# Análise

## `acompanhamento.xlsx`

Onde os números de cada post entram, pra no fim das quatro semanas dar pra responder qual formato realmente retém.

**Três abas:**

| Aba | O que faz |
|---|---|
| Acompanhamento | As `16` peças já listadas, com data, série e formato. Você preenche só o amarelo |
| Por série | Compara as `8` séries entre si. Calcula sozinha |
| Como ler | O que cada número significa e a partir de que valor ele é bom |

**Como usar.** Troca a data em `C4` pela tua primeira terça e as `16` datas se ajustam. Depois de cada post, abre o Insights no Instagram e anota seis números: alcance, salvamentos, compartilhamentos, comentários, visitas ao perfil e seguidores. As três colunas de taxa se calculam sozinhas.

Tem uma linha de `EXEMPLO` logo abaixo do cabeçalho, em cinza, só pra mostrar o formato esperado. Apague ela quando começar.

**O indicador que importa mais** é salvamento sobre alcance. Conteúdo educativo bom é guardado pra consultar depois, e salvamento é o sinal mais forte que existe pro algoritmo reentregar. Abaixo de `1%` o post informou mas não foi útil o suficiente. Entre `1%` e `3%` está bom. Acima de `3%`, repete o formato.

**O ponto de partida está na planilha**, na linha logo abaixo da média: `14` seguidores por post e conversão abaixo de `0,3%`. É contra esses dois números que os `30` dias vão ser medidos.

**Quando analisar.** Espere `72` horas depois de publicar antes de anotar, porque o post continua rodando. E só compare séries depois de `8` posts, que é quando o padrão começa a aparecer. Antes disso é ruído.

## Verificação das fórmulas

O LibreOffice não sobe neste ambiente, então o `recalc.py` do fluxo padrão não roda aqui. As fórmulas foram verificadas de outro jeito: a planilha foi preenchida com dados de teste e executada com a biblioteca `formulas`, comparando cada resultado com o valor calculado por fora.

Conferiram as três taxas por linha, as médias do mês, a contagem e as taxas por série, e a aritmética das datas. Vale repetir essa verificação se alguém mexer nas fórmulas.
