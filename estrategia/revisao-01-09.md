# Revisão de `01/09`, depois de 12 dias

## O que aconteceu

| | |
|---|---|
| Janela | `12` dias, de `20/08` a `01/09` |
| Posts que o plano pedia | `7` |
| Posts publicados | `2` |
| Ritmo real | `1` a cada `6` dias |

`20/08`, card de opinião sobre farinha, às `23h30`. `26/08`, Reels do Pala e Pinsa, às `17h`.

## O diagnóstico

O conteúdo não é o problema. O card fez `2.769` contas alcançadas, com `59,2%` de não seguidores e curva ainda subindo no sexto dia. É post saudável.

O problema é a cadência, e o erro foi de dimensionamento na hora de escrever o calendário. Quatro posts por semana pressupõem tempo de produção que quem toca um restaurante não tem.

E os dois posts que sobreviveram têm uma coisa em comum que explica tudo. O card era render de texto, com custo de produção zero. O Reels foi filmado num dia de produção que já ia acontecer de qualquer jeito, com custo marginal quase zero.

Os que não saíram são os que exigem bloco de tempo dedicado, como foto autoral montada, teste comparativo assado só pra virar post, gravação falando pra câmera e cronograma fotografado.

Das `16` peças roteirizadas, `10` dependem de produção e `6` estão prontas. Um plano com `62%` de dependência de tempo indisponível não se executa.

## A grade revisada

Dois posts por semana, ambos de custo de produção zero.

| Dia | Formato | Produção |
|---|---|---|
| Terça `14h30` | Carrossel O Porquê do Número | nenhuma, renderizado do template |
| Quinta `23h30` | Card Opinião Impopular | nenhuma, renderizado do template |

Reels sai da grade e vira oportunista, entrando só quando já houver produção acontecendo, como foi o caso do Pala e Pinsa.

## O estoque pronto

| Slot | Peças | Cobertura |
|---|---|---|
| Terça, carrossel | `65%`, `48h`, `W300`, `450°C` | `4` semanas |
| Quinta, card | forno caro, fermentação longa, temperatura da água, napoletana | `4` semanas |

A primeira versão desta revisão dizia "duas semanas e meia", o que era média e escondia um furo: terça tinha `4` peças e quinta tinha `1`. Os três cards a mais foram renderizados em `01/09` para igualar a cobertura.

## O story volta

A revisão inicial cortou o story junto com a redução de cadência, e isso foi descuido. Story é a camada de retenção mais barata que existe aqui, porque é telefone na hora, sem montagem. E os dados do card de `20/08` mostram que ele puxa audiência de verdade, com `14,8%` das visualizações vindo de stories.

Não vira obrigação diária. A regra passa a ser: sempre que houver produção acontecendo, sai story. E todo post do feed é repostado no story no mesmo dia.

## Uma Variável não é um slot, é uma lente

Essa série ficou na pilha de adiados por exigir teste controlado assado só para virar post. Só que o Reels do Pala e Pinsa já era, na prática, um Uma Variável: mesma massa, dois formatos, duas temperaturas, mesmo forno.

A conclusão é que ela não deve ser agendada. Ela deve ser aplicada quando a produção já estiver acontecendo e por acaso comparar duas coisas. O custo cai a zero e a peça sai melhor, porque é produção real e não encenação.

## O que fica adiado

Autoral, cronograma de produção, o erro que me custou caro, os dois testes de Uma Variável e o post de formação. Continuam roteirizados em `posts/`, fora da grade, e entram quando houver tempo de montagem.

## Leitura de formato, com os dois posts na mão

Feita em `01/09`, depois que os números do Reels de `26/08` entraram.

### O Reels não alcançou mais gente fria, e converteu muito pior

A hipótese era que Reels compensaria a conversão baixa alcançando quem não segue, já que metade da entrega dele veio de Aba Reels e Explorar. O dado derruba isso.

| | Não seguidores alcançados | Novos seguidores | Conversão |
|---|---|---|---|
| Card farinha `20/08` | `1.639` | `9` | `0,549%` |
| Reels Pala e Pinsa `26/08` | `1.791` | `2` | `0,112%` |

O Reels alcançou mais gente fria que o card e converteu `4,9x` pior. Com `13s` assistidos de `53s` e `41,6%` de pulo, o motivo está no vídeo, e não na audiência que ele encontrou.

### Três em cada quatro seguidores não viram nenhum dos dois

| | Seguidores alcançados | Da base de `4.169` |
|---|---|---|
| Card farinha | `1.130` | `27,1%` |
| Reels Pala | `914` | `21,9%` |

Vale igual pros dois formatos, então não é característica de card nem de Reels. É consequência de `2` posts em `12` dias. Conta parada perde prioridade na entrega pra própria base, e a correção é a cadência, não o formato.

**São dois problemas separados e não devem ser confundidos.** Alcançar quem não segue é problema de formato visual, porque superfície de descoberta é ranqueada por imagem e tipografia bege não entra nela. Alcançar quem já segue é problema de frequência. Foto resolve o primeiro, tempo com a grade rodando resolve o segundo.

### O card não viaja

`98,4%` do alcance do card veio de Feed, Stories e Perfil, e quase nada de Explorar. O Reels teve `50,1%` vindo de Aba Reels e Explorar. O formato decidiu a superfície. Daí a decisão de trazer foto pras peças, com o `card.html` já tendo os layouts `recorte` e `disco-var` prontos pra isso.

O que trava hoje é biblioteca, não template: falta recorte de pizza em alta resolução.

## O que ainda está em aberto

A direção visual dos cards. O Matheus vai propor uma arte e a ideia é transformar a lógica dela em layout no template, pra virar peça repetível em vez de arte refeita na mão toda semana.
