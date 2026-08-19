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

## Coleta automática

Em vez de digitar os números do Insights, um script puxa da Graph API do Instagram e a planilha se regenera a partir disso.

### As duas peças

`coletar.py` fala com a API e grava em `dados/historico.json`. O arquivo é acumulativo: cada dia acrescenta uma leitura nova em vez de sobrescrever a anterior.

`planilha.py` lê esse histórico e regenera `acompanhamento.xlsx`, acrescentando duas abas que a versão manual não tem.

### Por que guardar histórico e não só o número atual

A API devolve o total acumulado no momento da consulta, nunca a série. Então a curva de cada post só existe se alguém estiver medindo desde o começo, e depois não tem como recuperar.

E a curva responde melhor que o total. Dois posts terminando o mês com `130` salvamentos podem ter chegado lá de formas opostas, um crescendo devagar por duas semanas e outro estourando no primeiro dia e morrendo. O primeiro é conteúdo perene e vale repetir, o segundo foi um pico. O total não separa os dois, a curva separa.

### Uso

```bash
export IG_TOKEN=...        # token de longa duração da Meta
export IG_USER_ID=...      # id da conta Instagram Business

python3 analise/coletar.py --probe    # testa e diz quais métricas a API entrega
python3 analise/coletar.py            # coleta e grava
python3 analise/planilha.py           # regenera a planilha
```

O `--probe` existe por um motivo. Alcance, salvamentos, compartilhamentos e comentários são estáveis na API, mas **seguidores ganhos por post** e **visitas ao perfil por post** variam conforme a versão e o tipo de mídia. O script pede tudo e vai removendo o que a Meta recusar, em vez de quebrar, e registra o que faltou em `metricas_indisponiveis`, que aparece em vermelho no topo da aba Coletado.

Se essas duas não vierem, o plano B é a contagem diária de seguidores no nível da conta, que o script já coleta em `conta`. Com `4` posts por semana dá pra atribuir com boa aproximação.

### Estrutura do histórico

`dados/exemplo-historico.json` tem `3` leituras fictícias mostrando o formato. Serve de referência e para testar `planilha.py` sem credencial. O arquivo real é `dados/historico.json`.

### O token expira

Token de longa duração da Meta dura cerca de `60` dias. Vencendo, a coleta para em silêncio, que é o pior jeito de parar. Vale a rotina avisar quando faltar uma semana.
