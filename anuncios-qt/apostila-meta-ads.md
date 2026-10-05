# Meta Ads para a QT Pizza Bar

Apostila técnica, do zero à primeira campanha medida. Escrita em `05/10/2026`, com as regras da plataforma conferidas nessa data. As fontes estão no fim.

## Como usar esta apostila

São três peças que trabalham juntas.

| Peça | Para quê | Quando |
|---|---|---|
| Esta apostila | entender a mecânica e o porquê de cada ajuste | antes de abrir o Gerenciador |
| [`plano-de-largada.md`](plano-de-largada.md) | as duas campanhas da QT prontas para montar, com texto, roteiro e atendimento | na semana da montagem |
| [`meta-ads-qt.xlsx`](meta-ads-qt.xlsx) | a ficha técnica da campanha: quanto pode custar um cliente, e o controle semanal | antes de definir verba, e toda segunda |

Os módulos seguem a ordem em que as decisões acontecem. Do `1` ao `3` é conceito, do `4` ao `8` é execução, do `9` ao `11` é leitura e rotina. No fim tem exercício com resposta.

Todo número de exemplo desta apostila é o mesmo que vem preenchido na planilha. Quando você trocar pelos números reais da QT, a conta inteira se refaz sozinha lá.

---

## Módulo 0 · A aula inteira em uma página

1. **O anúncio não compra cliente, compra atenção num leilão.** Quem transforma atenção em mesa ocupada é o criativo, a oferta e o atendimento no WhatsApp. Anúncio bom com WhatsApp que demora a responder é verba queimada.
2. **A QT anuncia para uma pergunta só: quer reservar?** O objetivo é Engajamento com destino no WhatsApp, e o resultado medido é conversa iniciada.
3. **O público é o endereço, não o interesse.** Raio em volta da QT, idade mínima de `18` anos, e o resto o algoritmo decide. Em `2026` quem segmenta de verdade é o criativo.
4. **O criativo é a farinha.** Vídeo vertical `9:16`, os primeiros `3` segundos decidem quase tudo, e a prova do 50 Top Pizza trabalha melhor como contexto do que como grito.
5. **A conta que manda é custo por pessoa atendida contra contribuição por pessoa.** Com os números de exemplo, a QT empata pagando até `R$ 88,50` por pessoa sentada à mesa, e a meta é pagar no máximo a metade disso.
6. **Desde `01/01/2026` a Meta repassa `12,15%` de tributos, e eles não aparecem no Gerenciador.** A tela mostra `R$ 100`, a fatura vem `R$ 113,83`.
7. **Aprendizado é fermentação.** Abriu a câmara toda hora, nunca estabiliza. Uma mudança por vez, no máximo `20%` de verba por vez, a cada `3` ou `4` dias.
8. **Toda segunda, `30` minutos.** Números do Gerenciador, etiquetas do WhatsApp e livro de reservas entram na planilha, e uma regra decide o que muda.

---

## Módulo 1 · Como o Meta decide quem vê o seu anúncio

### 1.1 Cada tela aberta é um leilão

Toda vez que alguém abre o Instagram ou o Facebook, existe um espaço de anúncio para preencher entre um post e outro. Para esse espaço acontece um leilão, em milissegundos, entre todos os anunciantes que querem falar com aquela pessoa. A QT não disputa só com outras pizzarias. Disputa com loja de roupa, banco, curso de inglês, qualquer um que tenha aquela pessoa no público.

Ganha quem tiver o maior valor total, e a fórmula é pública:

```
valor total = lance × taxa de ação estimada + qualidade do anúncio
```

| Fator | O que é | Quem controla |
|---|---|---|
| Lance | quanto você aceita pagar pelo resultado | você, pela verba e pela estratégia de lance |
| Taxa de ação estimada | a probabilidade, prevista pelo Meta, de aquela pessoa fazer o que você pediu, por exemplo abrir uma conversa | o criativo e o histórico do anúncio |
| Qualidade | sinais de que as pessoas gostam ou rejeitam o anúncio: ocultar, denunciar, isca de engajamento, texto enganoso | o criativo |

A consequência prática é a mais importante da apostila: **dois dos três fatores são o criativo**. Um anúncio que faz a pessoa parar e responder paga menos pela mesma impressão do que um anúncio fraco com mais verba. Lenha a mais não salva massa mal fermentada.

### 1.2 Você paga por impressão, mesmo pedindo conversa

Na maior parte das campanhas a cobrança é por impressão, medida em CPM, o custo de mil impressões. Quando você escolhe "maximizar conversas", o Meta usa isso para decidir **para quem** mostrar, mas a conta continua sendo de exibição. O custo por conversa é consequência de uma cadeia:

```
1.000 impressões a CPM de R$ 15          custam R$ 15,00
0,8% clicam no botão (CTR)               8 cliques
50% dos cliques abrem a conversa         4 conversas
custo por conversa                       R$ 15,00 ÷ 4 = R$ 3,75
```

Repare no que acontece se o criativo dobra o CTR para `1,6%`: são `8` conversas pelos mesmos `R$ 15`, e o custo cai para `R$ 1,88`. Você não negociou preço com ninguém. Melhorou a massa.

### 1.3 O algoritmo aprende, e aprender tem custo

Todo conjunto de anúncios nasce na fase de **Aprendizado**. O Meta precisa de cerca de `50` eventos de otimização em `7` dias, por conjunto, para estabilizar a entrega. Enquanto aprende, o custo oscila e o resultado é pior que o de regime.

É fermentação. Se você abre a câmara a cada hora para conferir, a temperatura nunca estabiliza. O que reinicia o aprendizado, e portanto joga fora o que já foi aprendido:

- mudar o público
- acrescentar ou tirar anúncio
- trocar o evento de otimização ou a estratégia de lance
- mexer na verba de forma brusca, e a regra prática é não passar de `20%` de uma vez
- pausar o conjunto por mais de `7` dias

**Aprendizado limitado não é fracasso.** Com `R$ 50` por dia e conversa a `R$ 12`, a campanha de reserva gera perto de `29` conversas por semana, abaixo das `50`. O Gerenciador vai mostrar "Aprendizado limitado", e para um restaurante de uma casa só isso é normal. Para chegar em `50` por semana com esse custo seriam uns `R$ 86` por dia. O que decide se está bom é o custo por pessoa atendida na planilha, não a etiqueta do Gerenciador. O erro clássico é ver o aviso e picar a verba em mais conjuntos, o que faz exatamente o contrário do que o aviso pede.

### 1.4 Advantage+: o piloto automático que agora vem ligado

Desde `2025` o Meta liga por padrão quase tudo que é automático, com o nome Advantage+: público, posicionamentos, orçamento da campanha, melhorias de criativo. No começo de `2026` as criações manual e Advantage+ viraram um fluxo só.

Pense num forno com controle automático de chama. Você define a temperatura-alvo, que é a meta de desempenho, e ele modula o fogo. A massa e a receita continuam sendo suas, que aqui são o criativo e o objetivo. A regra da QT: **deixe ligado o automático que distribui** (público, posicionamentos) e **revise com lupa o automático que altera a sua imagem** (melhorias de criativo, Módulo `6.7`).

---

## Módulo 2 · A anatomia de uma campanha

### 2.1 Três níveis

| Nível | O que se decide aqui | Na cozinha |
|---|---|---|
| Campanha | o objetivo, ou seja, o que o Meta deve buscar | o tipo de serviço: jantar à la carte ou evento fechado |
| Conjunto de anúncios | para quem, onde aparece, quanto gasta, quando roda, onde a pessoa cai | a praça: mise en place, porcionamento, temperatura |
| Anúncio | o que a pessoa vê: vídeo, texto, botão | o prato que sai para a mesa |

A estrutura recomendada para a QT é enxuta: **uma campanha por objetivo, um conjunto por campanha no primeiro mês, e de `3` a `5` anúncios por conjunto**. Menos conjuntos, mais verba em cada um. O algoritmo aprende com volume, e volume dividido em cinco é cinco fermentações fracas.

### 2.2 Nomenclatura: o rótulo do pote de massa

Daqui a três meses você vai querer saber qual gancho funcionou em qual público. Sem nome padronizado, o Gerenciador vira um freezer sem etiqueta.

| Nível | Molde | Exemplo | Lê-se |
|---|---|---|---|
| Campanha | `QT_[objetivo]_[destino]` | `QT_RES_WPP` | reserva pelo WhatsApp |
| Conjunto | `[local]_[idade]_[público]` | `R6km_18+_ADV` | raio de `6` km, `18+`, Advantage+ |
| Anúncio | `[ângulo]_[formato]_[gancho]_[versão]` | `DEST_REELS_FORNO_v1` | ângulo destino, Reels, abre no forno, versão `1` |

Os códigos de ângulo usados nesta apostila são `DEST` para destino, `OCAS` para ocasião, `PROC` para processo e `PROD` para produto. O Módulo `6.4` explica cada um.

---

## Módulo 3 · Os seis objetivos, e qual serve à QT

O Gerenciador tem seis objetivos. Cada um muda o que o algoritmo procura dentro do mesmo público.

| Objetivo | O que o Meta procura | Uso na QT | Veredito |
|---|---|---|---|
| Reconhecimento | gente que vai lembrar do anúncio, ao menor custo por pessoa alcançada | apresentar a casa ao bairro, com controle de frequência | apoio, verba pequena |
| Tráfego | gente que clica num link | levar para a página de reserva, se a reserva for por plataforma | alternativa |
| **Engajamento** | gente que conversa, comenta ou assiste | **abrir conversa de reserva no WhatsApp** | **principal** |
| Cadastros | gente que deixa contato num formulário | orçamento de confraternização de grupo | sazonal |
| Promoção do app | instalação de aplicativo | não se aplica | fora |
| Vendas | gente que compra, medido por pixel ou API de Conversões | só quando a reserva online devolver o evento "reserva feita" ao Meta | futuro |

### 3.1 Por que Engajamento com destino no WhatsApp

Três razões. No Brasil é pelo WhatsApp que as pessoas reservam, então o anúncio cai onde a decisão já acontece. Conversa iniciada é um evento de intenção alta que acontece com frequência suficiente para o algoritmo aprender. E dá para rastrear até a mesa, porque a mensagem pré-preenchida marca a origem (Módulo `9.2`).

Se a QT recebe reserva por plataforma com link, a campanha principal muda para **Tráfego**, com a meta "visualizações da página de destino" e o link da reserva com UTM. O resto da apostila vale igual.

### 3.2 Por que não tráfego para o perfil do Instagram

É o clique mais barato que existe, e por isso mesmo é armadilha. O algoritmo vai buscar quem clica muito, que é quem navega por esporte, não quem sai para jantar. O número de visitas sobe e o salão continua igual.

### 3.3 Por que não o botão Turbinar

Turbinar é a massa pronta de mercado: funciona, mas você não controla nenhum parâmetro. Não tem controle de frequência, não tem nomenclatura, não tem posicionamento escolhido nem teste. Use só para dar um empurrão rápido num post orgânico que já está performando, como o anúncio de um evento, com verba pequena e prazo curto. Campanha de reserva se monta no Gerenciador.

---

## Módulo 4 · Preparar a conta antes de gastar um real

### 4.1 O mapa das contas

```
Portfólio empresarial QT Pizza Bar           business.facebook.com
├── Página do Facebook da QT
├── Instagram @qtpizzabar                    conta profissional
├── WhatsApp Business da QT                  o número que faz reserva
├── Conta de anúncios QT                     Real (BRL), fuso de São Paulo
│   └── forma de pagamento e CNPJ para a nota
└── Pessoas
    ├── Matheus                              controle total
    ├── um segundo administrador             controle total, de reserva
    └── quem opera o dia a dia               acesso parcial
```

### 4.2 O setup, em ordem

1. **Portfólio empresarial.** Criar no Meta Business Suite com a razão social da QT e um e-mail da empresa, não um pessoal.
2. **Ativos.** Conectar a Página e o Instagram profissional.
3. **WhatsApp.** Conectar o número do WhatsApp Business que recebe reserva. Tem que ser o mesmo número que a equipe atende, senão a conversa do anúncio cai num telefone que ninguém olha.
4. **Conta de anúncios.** Moeda Real e fuso de São Paulo. **Moeda e fuso não mudam depois.** Errou, só criando outra conta.
5. **Pagamento.** Cartão no pós-pago, cobrado por limite, ou Pix e boleto no pré-pago. Cadastrar o CNPJ para a nota fiscal sair certa.
6. **Segurança.** Autenticação em dois fatores para todo mundo. Dois administradores, nunca um só: se a conta pessoal de um cai, a QT perde o acesso aos próprios anúncios. Quem opera entra com acesso parcial. Agência entra como parceira do portfólio, nunca com o login de alguém.
7. **Conjunto de dados, o antigo pixel.** Instalar no site e na página de reserva, se existirem. Não é obrigatório para começar pelo WhatsApp, mas sem ele não existe o público "visitou o site" para o mês `2`.

### 4.3 O imposto que não aparece no Gerenciador

Desde `01/01/2026` a Meta repassa ao anunciante brasileiro os tributos que antes absorvia: PIS e Cofins a `9,25%` e ISS a `2,9%`, somando `12,15%`. O cálculo é por dentro, então o acréscimo sobre o valor do Gerenciador é maior que `12,15%`:

```
fatura = valor do Gerenciador ÷ (1 − 0,1215)
       = valor do Gerenciador × 1,1383

R$ 100,00   no Gerenciador   →   R$ 113,83   na fatura
R$ 1.950,00 no Gerenciador   →   R$ 2.219,69 na fatura
```

No pré-pago a conta anda ao contrário: o depósito já inclui o tributo, e sobra menos para veicular. Um Pix de `R$ 1.000` vira `R$ 878,50` de mídia.

Três consequências. Toda conta de custo desta apostila e da planilha usa o **gasto real**, com tributo. O Gerenciador continua mostrando o valor sem tributo, então o custo por conversa que aparece lá é `12%` menor do que o que a QT de fato paga. E se a QT apurar pelo Lucro Real, parte do PIS e Cofins pode virar crédito, o que vale perguntar ao contador. A CBS e o IBS da reforma tributária aparecem na nota em `2026` só como teste, sem mudar o total.

### 4.4 O WhatsApp é a outra metade do anúncio

O anúncio termina numa conversa. Se ninguém responde por quarenta minutos numa sexta às `20h`, a pessoa reserva em outro lugar e o anúncio leva a culpa.

| Ferramenta do WhatsApp Business | Para quê |
|---|---|
| Mensagem de saudação | responde na hora, com o que a pessoa precisa para reservar |
| Mensagem de ausência | fora do horário, diz quando alguém responde |
| Respostas rápidas | atalhos como `/reserva` e `/endereco`, iguais para toda a equipe |
| Etiquetas | `Anúncio`, `Reservou`, `Veio`, que viram a medição da segunda-feira |

Defina **um responsável por turno** e um tempo de resposta, por exemplo até `10` minutos durante o expediente. Os textos prontos estão no plano de largada.

---

## Módulo 5 · Público: onde a QT encontra cliente

### 5.1 Localização: o alfinete e o raio

No conjunto de anúncios, em Público, depois Localizações: digite o endereço da QT, solte o alfinete e defina o raio. O mínimo documentado é de `1` milha, cerca de `1,6` km.

Hoje existe uma opção só de comportamento de local: **pessoas que moram ou estiveram recentemente neste local**. As antigas opções "moram aqui", "estiveram recentemente" e "viajando neste local" separadas saíram. Na prática, não dá mais para mirar turista diretamente. Ele entra se estiver dentro do raio.

A geometria do raio engana. A área cresce com o quadrado:

```
área = π × raio²
```

| Raio | Área |
|---|---|
| `2` km | `12,6` km² |
| `4` km | `50,3` km² |
| `6` km | `113,1` km² |
| `8` km | `201,1` km² |

Dobrar o raio quadruplica a área. No centro expandido de São Paulo, um raio de `4` km já cobre algumas centenas de milhares de pessoas. Em São Paulo, raio pequeno não é público pequeno, e o medo de "pouca gente" é o que leva ao raio de `20` km que paga para aparecer para quem nunca vai atravessar a cidade numa terça.

O ponto de partida da QT:

- **`6` km** para a campanha de reserva. Cobre os bairros de onde se vem jantar num dia de semana sem planejar muito. Confira no mapa, o Gerenciador desenha o círculo.
- **`4` km** para a vitrine do bairro, que é a campanha de alcance.

**Confira se o anúncio fica dentro do raio.** Em algumas configurações de cidade e região o Meta oferece alcançar gente de fora do local que demonstra interesse por ele. Três dias depois de publicar, abra Detalhamento, Por entrega, Região. Se uma parte relevante do gasto estiver longe, procure a opção de expansão de local no conjunto e desligue.

### 5.2 Idade: um controle e uma sugestão

| | O quê | Por quê |
|---|---|---|
| Controle | idade mínima de `18` anos | obrigatória se aparecer bebida alcoólica, e a QT é um pizza bar |
| Sugestão | de `25` a `45` anos | o núcleo do público da QT pelo manual da marca é de `25` a `40` |

Com o público Advantage+ ligado, a idade mínima é regra e a máxima é só sugestão. O Meta pode passar dos `45` se achar resposta melhor, e tudo bem.

### 5.3 Público Advantage+: o que é regra e o que é palpite

| O Meta obedece, é regra | O Meta usa como ponto de partida, é sugestão |
|---|---|
| localização | faixa de idade |
| idade mínima, até `25` | gênero |
| idioma | interesses |
| exclusão de públicos personalizados | públicos personalizados usados como sugestão |

Duas mudanças que pegam quem aprendeu Meta Ads anos atrás. Desde março de `2025` não existe mais exclusão por interesse. E interesse virou palpite: o algoritmo começa por ele e sai dele quando prevê resultado melhor.

A recomendação é deixar o público Advantage+ **ligado**, com a sugestão de `25` a `45` anos e interesses como gastronomia, culinária italiana e pizza. Dentro de um raio denso, o algoritmo acha quem responde anúncio com conversa melhor do que qualquer lista de interesses que a gente monte. E o criativo faz o filtro fino: um Reels da borda estufando a `400°C` se seleciona sozinho para quem gosta de comida.

### 5.4 Públicos personalizados: quem já conhece a QT

| Público | Como montar | Uso |
|---|---|---|
| Engajou com o Instagram | quem interagiu com @qtpizzabar nos últimos `365` dias | remarketing no mês `2` |
| Assistiu aos vídeos | quem viu `50%` ou mais dos vídeos da vitrine, nos últimos `30` dias | remarketing de quem a vitrine aqueceu |
| Visitou o site | conjunto de dados instalado no site | remarketing, quando houver site com reserva |
| Lista de clientes | arquivo com telefone ou e-mail | **só com consentimento**, pela LGPD |

Público personalizado precisa de alguns milhares de pessoas para rodar bem. Ele entra no mês `2`, quando a vitrine já tiver formado plateia.

### 5.5 Dois trabalhos diferentes: vizinhança e destino

A QT tem dois tipos de cliente, e o anúncio precisa tratar cada um de um jeito.

| | Vizinhança | Destino |
|---|---|---|
| Quem é | mora ou trabalha perto | atravessa a cidade por uma casa do 50 Top Pizza |
| Ocasião | terça, quarta, jantar sem cerimônia | aniversário, encontro, programa de sábado |
| Distância | raio de `4` a `6` km | cidade inteira |
| O que convence | conveniência, ambiente, o drink, a mesa | a prova: ranking, método, a pizza |
| Quando você quer essa pessoa | terça a quinta, que é onde sobra mesa | quando houver mesa, com antecedência |

No mês `1` uma campanha só carrega os dois ângulos nos criativos, com raio de `6` km. No mês `2` o teste mais valioso é separar: destino na cidade inteira com criativo de prova, contra vizinhança no raio com criativo de ocasião. É o teste que diz se a QT é, no Instagram, uma pizzaria de bairro ou um restaurante de destino.

---

## Módulo 6 · O criativo, a farinha do resultado

### 6.1 Por que o criativo virou a segmentação

Com público automático, o Meta lê o anúncio para decidir a quem mostrá-lo. Um Reels com massa, forno e o ranking chega em quem responde a isso. Uma arte genérica de "promoção" chega em caçador de desconto. Você escolhe o cliente pelo que mostra.

### 6.2 Formatos e medidas

| Formato | Medida | Onde roda | Observação |
|---|---|---|---|
| Vídeo vertical | `1080 × 1920`, proporção `9:16` | Reels e Stories | formato principal |
| Vídeo ou foto | `1080 × 1350`, proporção `4:5` | Feed | a mesma medida do carrossel orgânico |
| Carrossel | `1080 × 1350` ou `1080 × 1080` | Feed | bom para mostrar cardápio, de `3` a `5` cards |

**Zona segura do `9:16`.** Desde março de `2026` o Meta usa uma zona segura única para os quatro posicionamentos verticais, desenhada pelo mais apertado, que é o Reels. Deixe livre de texto, logo e preço:

| Faixa | Percentual | Em `1080 × 1920` |
|---|---|---|
| Topo | `14%` | cerca de `270` px |
| Base | `35%` | cerca de `670` px, onde ficam legenda, botões e o CTA |
| Laterais | `6%` cada | cerca de `65` px |

Tudo que importa vai no miolo. Duração boa para anúncio: de `15` a `30` segundos. Texto na tela sempre, porque parte grande do público assiste sem som, e a legenda garante que a mensagem chega nos dois casos.

### 6.3 Os três primeiros segundos

A métrica é a **taxa de gancho**: reproduções de `3` segundos divididas por impressões. Abaixo de `20%`, o começo não segura. De `25%` a `30%` para cima, o gancho funciona.

Ganchos que a QT tem e quase ninguém tem:

1. A borda estufando no forno, em tempo real ou acelerada, com `400°C` na tela.
2. O corte mostrando a alveolatura do cornicione, em close, com o som da crosta.
3. A pá entrando e a pizza saindo, num plano só.
4. O fio do fior di latte na primeira fatia.
5. A mesa vista de cima, duas pizzas, mãos entrando no quadro.
6. O disco sendo aberto na bancada, com a farinha no ar.
7. A prova escrita sobre imagem de forno: "Entre as `100` melhores pizzarias do mundo. Fica nos Jardins."
8. O salão às `20h`, cheio, a câmera atravessando até a mesa.

### 6.4 Os quatro ângulos

| Código | Ângulo | Para quem | O que diz |
|---|---|---|---|
| `DEST` | Destino, a prova | quem atravessa a cidade | a casa está entre as melhores do mundo, e por quê |
| `OCAS` | Ocasião, a vizinhança | quem mora ou trabalha perto | o lugar gostoso para estender mais um pouquinho |
| `PROC` | Processo, a técnica | quem gosta de comida e quer entender | o método visível: `48h` de fermentação, `400°C` |
| `PROD` | Produto, o lançamento | quem já conhece | a pizza nova, a da estação |

Exemplo de texto principal para cada um. Os completos, com roteiro, estão no plano de largada.

> **`DEST`** Desde 2022 a QT está entre as 100 melhores pizzarias do mundo no ranking 50 Top Pizza. A massa fermenta no mínimo 48 horas a 4°C e o forno trabalha a 400°C. A mesa fica nos Jardins, e a reserva é por aqui.

> **`OCAS`** Terça também é dia de sair para jantar. Pizza napolitana, um drink bem feito e aquela mesa onde a conversa estica mais um pouquinho. Fica nos Jardins. Chama no WhatsApp que a gente separa a sua.

> **`PROC`** A borda que você vê aqui começou dois dias antes. A massa fermenta no mínimo 48 horas a 4°C, e o forno a 400°C faz o resto. É técnica, mas o que chega na mesa é só uma pizza muito boa.

> **`PROD`** Pizza nova no cardápio: [nome]. [o que vai nela e por quê]. Fica enquanto a estação durar.

As regras de tom da QT valem dobrado em anúncio: nada de "imperdível", "não perca", "venha conferir", e nunca "a melhor pizza do mundo". O ranking diz isso por você, com data e nome do guia.

### 6.5 Texto, título e botão

| Campo | Regra | Exemplo |
|---|---|---|
| Texto principal | o essencial cabe nos primeiros `125` caracteres, antes do "mais" | o que é, onde fica, o que fazer |
| Título | curto, por volta de `40` caracteres | Reserve sua mesa nos Jardins |
| Botão | Enviar mensagem | abre o WhatsApp |
| Mensagem pré-preenchida | o que a pessoa manda com um toque, e que marca a origem | Oi! Vi o anúncio da QT e quero reservar uma mesa. |

**Política de atributos pessoais.** O anúncio não pode afirmar ou insinuar característica pessoal de quem lê: idade, saúde, situação financeira, religião, orientação, origem. "Você que tem mais de 30 anos" ou "Intolerante a lactose?" levam reprovação. "Para quem gosta de pizza de fermentação longa" passa, porque fala do produto e não da pessoa.

### 6.6 Publicação existente: a prova social que já está pronta

Na hora de criar o anúncio dá para escolher **usar publicação existente** e puxar um post do @qtpizzabar. O anúncio herda as curtidas e os comentários, e cada interação nova fica no post original. Para restaurante isso pesa, porque um vídeo com `300` comentários de gente dizendo que foi e voltou convence mais que qualquer texto.

A regra: **o orgânico é o laboratório, o anúncio é a produção em escala**. O Reels que já reteve bem no orgânico é o primeiro candidato a anúncio. Se a opção não aparecer para o destino WhatsApp, suba o mesmo vídeo como anúncio novo.

### 6.7 Melhorias automáticas de criativo

O Meta oferece melhorias Advantage+ de criativo: ajustar brilho, acrescentar música, expandir a imagem, gerar variações de imagem e de texto. Algumas são inofensivas, como adaptar o enquadramento a cada posicionamento. Outras inventam pixels ou reescrevem a frase.

Regra da QT: **revise uma por uma e desligue toda melhoria que gera ou altera imagem e texto**. Comida em anúncio tem que ser a comida que chega na mesa.

### 6.8 Álcool: as regras

- Qualquer anúncio que mostre ou cite drink, vinho ou cerveja exige **idade mínima de `18` anos** como controle no conjunto. É regra do Meta para o Brasil e o anúncio cai na análise sem ela.
- Pelas regras brasileiras, o anúncio não pode associar bebida a direção, esporte, sucesso ou sexo.
- Sempre que o drink aparecer, inclua a advertência no texto, como "Evite o consumo excessivo de álcool."
- O caminho mais seguro: anúncio de reserva com a pizza no centro e o drink de coadjuvante.

### 6.9 Quantos anúncios, e por quanto tempo

Comece com `4` anúncios no conjunto de reserva, misturando ângulo e formato: dois Reels, um carrossel e uma foto, como no plano de largada. O Meta joga a verba no que performa, e o anúncio que recebe pouca verba é o que perdeu, o que está ótimo. A cada duas ou três semanas, troque o mais fraco por um novo. A produção orgânica da QT abastece isso: dois vídeos novos por mês já sustentam a campanha.

---

## Módulo 7 · Verba: a ficha técnica da campanha

### 7.1 A cadeia de rendimento

Campanha tem ficha técnica igual a pizza. Cada etapa tem um rendimento, e cada rendimento é uma perda, como o manjericão que rende `60%` depois de limpo.

```
verba
 └─ ÷ CPM ................................ impressões
     └─ × CTR ............................ cliques
         └─ × % que abre conversa ........ conversas      até aqui o Meta mede
             └─ × % que reserva .......... reservas       daqui para baixo, só a QT mede
                 └─ × comparecimento ..... mesas que vieram
                     └─ × pessoas/mesa ... pessoas atendidas
                         └─ × ticket ..... faturamento
                             └─ × margem . contribuição
```

### 7.2 Quanto a QT pode pagar por um cliente

O raciocínio é o mesmo do preço de venda pelo CMV, só que de trás para frente: em vez de perguntar quanto cobrar, pergunta quanto dá para pagar.

| Linha | Valor | De onde vem |
|---|---|---|
| Ticket médio por pessoa, sem os `13%` | `R$ 150,00` | exemplo, troque pelo do Altec |
| CMV médio, comida e bebida | `28%` | exemplo |
| Impostos sobre a venda | `10%` | exemplo, confirme com o contador |
| Cartão e outros custos variáveis | `3%` | exemplo |
| **Margem de contribuição** | **`59%`** | `1 − 28% − 10% − 3%` |
| **Contribuição por pessoa** | **`R$ 88,50`** | `150 × 59%` |
| Pessoas por reserva | `2,5` | exemplo |
| Contribuição por mesa que veio | `R$ 221,25` | `88,50 × 2,5` |
| Comparecimento | `85%` | exemplo, ou seja, `15%` de não comparecimento |
| Contribuição por reserva feita | `R$ 188,06` | `221,25 × 85%` |
| Conversa que vira reserva | `25%` | exemplo |
| **Contribuição por conversa** | **`R$ 47,02`** | `188,06 × 25%` |

Por que os `13%` saem do ticket: a taxa de serviço é da equipe, não é receita da casa. Somar os `13%` infla a conta e faz a QT aceitar pagar caro demais por cliente.

Como ler a última linha: **se uma conversa custar `R$ 47,02`, com tributo, a QT empata na primeira visita**. Cada real abaixo disso é lucro.

### 7.3 Empate e meta: a margem de segurança

A meta é pagar **no máximo metade do empate**, por três razões:

1. Nem todo cliente do anúncio é novo. Parte viria de qualquer jeito, e o anúncio só adiantou a reserva.
2. A medição é imperfeita. Etiqueta esquecida, reserva fechada por telefone, gente que viu o anúncio e passou na porta.
3. A conta só considera a primeira visita. Quem volta é lucro que não está na conta, e é o colchão que cobre os dois erros acima.

| Por | Empate real | Meta real | Empate no Gerenciador | Meta no Gerenciador |
|---|---|---|---|---|
| Conversa | `R$ 47,02` | `R$ 23,51` | `R$ 41,30` | **`R$ 20,65`** |
| Reserva | `R$ 188,06` | `R$ 94,03` | `R$ 165,21` | `R$ 82,61` |
| Pessoa atendida | `R$ 88,50` | **`R$ 44,25`** | `R$ 77,75` | `R$ 38,87` |

O valor no Gerenciador é o real dividido por `1,1383`, para comparar direto com o que a tela mostra. Os dois números em negrito são os que você vai usar toda semana: o custo por conversa que o Gerenciador mostra se compara com `R$ 20,65`, e o custo real por pessoa da planilha se compara com `R$ 44,25`.

### 7.4 % de mídia, o CMV do marketing

```
% de mídia = gasto real ÷ faturamento que veio do anúncio
ROAS       = faturamento que veio do anúncio ÷ gasto real
```

O CMV mede quanto do preço vai para insumo. O % de mídia mede quanto da receita nova vai para anúncio. O ROAS é o mesmo número de cabeça para baixo, e é o que o mercado usa.

| | Empate | Meta |
|---|---|---|
| ROAS real | `1,69` | `3,39` |
| % de mídia | `59%` | `29,5%` |

O ROAS de empate é `1 ÷ margem de contribuição`. Com margem de `59%`, cada real de anúncio precisa trazer `R$ 1,69` de faturamento só para empatar.

### 7.5 A projeção do mês

Cenário recomendado: `R$ 50` por dia na campanha de reserva, `R$ 15` na vitrine, `30` dias, conversa a `R$ 12` no Gerenciador.

Por que `R$ 12`: fontes de mercado falam em média perto de `R$ 5` por conversa no Brasil em `2026`, somando todos os segmentos. A planilha começa no dobro disso de propósito, para a conta não depender de sorte. Na terceira semana você troca pelo número real da QT.

| Linha | Conta | Resultado |
|---|---|---|
| Verba no Gerenciador | `65 × 30` | `R$ 1.950,00` |
| Desembolso real | `1.950 × 1,1383` | `R$ 2.219,69` |
| Conversas | `50 × 30 ÷ 12` | `125` |
| Reservas | `125 × 25%` | `31` |
| Mesas que vieram | `31,25 × 85%` | `27` |
| Pessoas atendidas | `26,56 × 2,5` | `66` |
| Faturamento | `66,4 × R$ 150` | `R$ 9.960,94` |
| Contribuição | `× 59%` | `R$ 5.876,95` |
| **Resultado do mês** | `5.876,95 − 2.219,69` | **`R$ 3.657,26`** |
| ROAS real | `9.960,94 ÷ 2.219,69` | `4,49` |
| % de mídia | `2.219,69 ÷ 9.960,94` | `22,3%` |
| Custo real por pessoa | `2.219,69 ÷ 66,4` | `R$ 33,43` |
| Leitura | `33,43` contra a meta real de `44,25` | dentro da meta |

Na prática, `R$ 2.219,69` por mês trazem umas `15` pessoas por semana, ou `6` mesas. É um número modesto e honesto, e a planilha tem uma linha para conferir se ele cabe nos lugares que sobram de terça a quinta.

Agora o teste de estresse, com a mesma verba:

| Custo por conversa | Conversa que vira reserva | Pessoas | Resultado do mês |
|---|---|---|---|
| `R$ 12` | `25%` | `66` | `R$ 3.657,26` |
| `R$ 12` | `15%` | `40` | `R$ 1.306,48` |
| `R$ 20` | `25%` | `40` | `R$ 1.306,48` |
| `R$ 20` | `15%` | `24` | **`− R$ 103,99`** |

Repare na segunda e na terceira linha: dar o mesmo resultado não é coincidência. **Subir a conversão de `15%` para `25%` vale exatamente o mesmo que baixar o custo por conversa de `R$ 20` para `R$ 12`.** O custo por conversa depende do Meta e do criativo. A conversão depende de quem responde o WhatsApp. O que quebra a conta quase nunca é o anúncio caro, é a conversa que não vira reserva.

### 7.6 Três níveis de verba

| Nível | Por dia no Gerenciador | Por mês no Gerenciador | Fatura real por mês | Para quando |
|---|---|---|---|---|
| Enxuto | `R$ 35`, só reserva | `R$ 1.050` | `R$ 1.195,22` | testar a mecânica |
| **Recomendado** | `R$ 65`, sendo `50` de reserva e `15` de vitrine | `R$ 1.950` | `R$ 2.219,69` | o plano de largada |
| Acelerado | `R$ 120`, sendo `90` e `30` | `R$ 3.600` | `R$ 4.097,89` | depois de `4` semanas dentro da meta |

### 7.7 Orçamento diário, total, e o dia da semana

**Orçamento diário.** O Meta pode gastar até `75%` a mais num dia bom, compensando nos outros, sem passar de `7` vezes o diário na semana. Não se assuste com um dia de `R$ 80` numa campanha de `R$ 50`.

**Orçamento total.** É o único que libera a **programação de anúncios**, que roda só nos dias e horários escolhidos. Fica para o mês `2`, se os fins de semana estiverem lotados e valer concentrar a verba de domingo a quinta.

**Anuncie para encher mesa vazia.** Se o sábado já lota, o anúncio que gera pedido de sábado gasta dinheiro para produzir um "não temos mesa". Os textos e as respostas do WhatsApp do plano de largada empurram a pessoa para terça, quarta e quinta.

---

## Módulo 8 · Passo a passo no Gerenciador de Anúncios

A interface muda de nome de botão com frequência. A lógica não muda. Se um rótulo estiver diferente, procure pelo conceito.

### 8.1 Campanha A · Reserva pelo WhatsApp

1. Entre no Gerenciador de Anúncios, na conta da QT, e clique em **Criar**.
2. Objetivo **Engajamento**. Se o Gerenciador oferecer configuração Advantage+ ou manual, escolha a **manual** nesta primeira vez. Ela mostra cada controle, que é exatamente o que você quer aprender.
3. Nome da campanha `QT_RES_WPP`. Categoria especial de anúncio: nenhuma.
4. Orçamento de `R$ 50` por dia. Pode ficar na campanha ou no conjunto: com um conjunto só, dá na mesma.
5. Nome do conjunto `R6km_18+_ADV`.
6. **Local da conversão: apps de mensagem, WhatsApp**, e escolha o número da QT.
7. **Meta de desempenho: maximizar o número de conversas.**
8. Estratégia de lance: maior volume, que é o padrão e não tem teto de custo. Limite de custo fica para quando houver histórico.
9. Programação: comece numa **terça de manhã**, com a equipe avisada. Sem data de término.
10. Público. Localização: endereço da QT, alfinete, raio de `6` km. Controles: idade mínima `18`. Público Advantage+ ligado, com sugestão de `25` a `45` anos e interesses de gastronomia, culinária italiana e pizza.
11. Posicionamentos Advantage+. Depois de duas semanas, olhe o detalhamento por posicionamento. Se algum gastar sem trazer conversa, passe para posicionamento manual sem ele.
12. Nome do anúncio pela nomenclatura, por exemplo `DEST_REELS_FORNO_v1`.
13. Identidade: Página da QT e Instagram @qtpizzabar.
14. Formato: imagem ou vídeo único. Suba a versão `9:16` e a `4:5` do mesmo criativo e use a personalização por posicionamento, para cada tela receber a medida certa.
15. Texto principal, título e botão **Enviar mensagem**.
16. Modelo de mensagem: saudação e mensagem pré-preenchida "Oi! Vi o anúncio da QT e quero reservar uma mesa." Se preferir botões, use perguntas frequentes, como "Quero reservar para esta semana" e "Qual o endereço?".
17. Melhorias de criativo: abra a lista e desligue tudo que gera ou altera imagem e texto.
18. Revise e publique. A análise do Meta leva em geral até `24` horas.
19. Repita os passos `12` a `17` para os outros três anúncios, dentro do mesmo conjunto.

### 8.2 Campanha B · Vitrine do bairro

1. Criar, objetivo **Reconhecimento**.
2. Nome da campanha `QT_VIT_ALC`, nome do conjunto `R4km_18+_ADV`.
3. **Meta de desempenho: maximizar o alcance.**
4. **Controle de frequência: no máximo `2` impressões a cada `7` dias por pessoa.** É o que impede a vitrine de virar perseguição.
5. Orçamento de `R$ 15` por dia.
6. Público: raio de `4` km, idade mínima `18`, sugestão de `25` a `45` anos.
7. Posicionamentos Advantage+.
8. Dois Reels de bastidor, sem pedir nada agressivo. No botão, use **Saiba mais** com o link do WhatsApp da QT no formato `wa.me` e uma mensagem diferente, "Oi! Vi o vídeo da QT e quero reservar.", para separar a origem na contagem.

O link `wa.me` se monta assim, com o número completo e o texto codificado:

```
https://wa.me/5511XXXXXXXXX?text=Oi!%20Vi%20o%20v%C3%ADdeo%20da%20QT%20e%20quero%20reservar.
```

A vitrine não é julgada por conversa. Ela tem dois trabalhos: fazer o bairro saber que a QT existe e formar a plateia de quem assistiu aos vídeos, que vira público personalizado no mês `2`.

### 8.3 As primeiras 72 horas

- O status vai de "Em análise" para "Ativo" e depois "Aprendizado".
- **Não mexa em nada por três dias.** Só confira três coisas: está entregando, as conversas estão chegando, a equipe está respondendo.
- Reprovou? Leia o motivo. Em restaurante, os três mais comuns são bebida sem idade mínima de `18`, frase que fala de atributo pessoal e promessa que soa enganosa. Corrija e peça nova análise.
- **Comentário em anúncio é público.** Responda em até algumas horas, no tom da QT. Oculte o ofensivo, não apague a crítica legítima: responda. A caixa de entrada do Meta Business Suite junta tudo num lugar só.

---

## Módulo 9 · Medição: do Gerenciador até a mesa

### 9.1 O que o Meta vê, e o que só a QT vê

| Etapa | Quem mede | Onde |
|---|---|---|
| Impressões, alcance, frequência, CPM | Meta | Gerenciador |
| Cliques e conversas iniciadas | Meta | Gerenciador |
| Reserva feita | QT | etiqueta no WhatsApp |
| Mesa que veio e número de pessoas | QT | livro de reservas |
| Faturamento | QT | estimado por ticket médio, conferido no Altec |

**O Meta para na conversa.** Tudo depois dela é medição da QT, e é justamente a parte que paga a conta.

### 9.2 As três marcas que seguem o cliente

1. **Mensagem pré-preenchida diferente por campanha.** Reserva: "Oi! Vi o anúncio da QT e quero reservar uma mesa." Vitrine: "Oi! Vi o vídeo da QT e quero reservar." Quem atende sabe na hora de onde veio.
2. **Etiquetas no WhatsApp Business.** `Anúncio` quando a conversa chega pela mensagem pré-preenchida, `Reservou` quando fecha, `Veio` quando a mesa aparece. Na segunda, contar as três etiquetas é contar o funil.
3. **Campo "origem" no livro de reservas.** Anúncio, Instagram, indicação, passou na frente, plataforma, outro. E a pergunta na recepção, que custa dez segundos: "Como você conheceu a QT?"

### 9.3 As colunas do Gerenciador

Em Colunas, Personalizar colunas, monte e salve uma predefinição chamada `QT semanal`:

| Coluna | Para quê |
|---|---|
| Valor usado | o gasto, sem tributo |
| Impressões, Alcance, Frequência | o tamanho da exposição |
| CPM | o preço do leilão |
| Cliques no link, CTR (taxa de cliques no link) | o convite funcionou |
| Conversas por mensagem iniciadas | o resultado da campanha A |
| Custo por conversa por mensagem iniciada | o custo do resultado, sem tributo |
| Reproduções de vídeo de 3 segundos, ThruPlays | gancho e retenção |

Em Detalhamento, use Por entrega: **posicionamento**, **idade** e **região**. Período sempre de segunda a domingo, os últimos `7` dias.

### 9.4 O anúncio trouxe gente nova?

Essa é a pergunta mais difícil, e vale ser honesto: uma casa só não mede isso com perfeição. Três leituras somadas dão segurança:

1. **Antes e durante.** Couverts de terça a quinta nas `4` semanas antes do anúncio contra as `4` semanas com anúncio, mesmos dias, tirando feriado.
2. **Participação da origem.** Que parte das reservas da semana tem origem "Anúncio".
3. **Liga e desliga, no mês `3`.** Pausar uma semana e ver se as reservas de origem anúncio somem e se o couvert de dia fraco cai junto.

A margem de segurança de `50%` do Módulo `7.3` existe exatamente porque essa medição é imperfeita.

---

## Módulo 10 · Rotina e regras de decisão

### 10.1 A segunda-feira de 30 minutos

1. Gerenciador, predefinição `QT semanal`, últimos `7` dias. Copiar para a aba **Semanal** da planilha.
2. WhatsApp: contar as etiquetas `Anúncio`, `Reservou` e `Veio`.
3. Livro de reservas: mesas e pessoas com origem anúncio.
4. A planilha calcula o resto. Ler a coluna **Leitura**.
5. Aplicar **uma** regra da tabela abaixo, e anotar o que mudou na coluna **Mudança**.

### 10.2 Regras de decisão

| Sinal | Leitura | O que fazer |
|---|---|---|
| Menos de `1.000` impressões ou menos de `3` dias | cedo demais | não mexer |
| Anúncio gastou `2×` a meta de custo por conversa sem nenhuma conversa | não funciona | pausar o anúncio |
| Taxa de gancho abaixo de `20%` | o começo não segura | refazer os `3` primeiros segundos |
| Gancho bom e CTR abaixo de `0,5%` | prende mas não convida | rever texto, oferta e botão |
| Custo por conversa na meta e conversão em reserva abaixo de `15%` | o problema não é o anúncio | rever tempo de resposta e roteiro do WhatsApp |
| Frequência acima de `3` em `7` dias com CTR caindo | cansaço do criativo | entrar com criativo novo |
| Custo real por pessoa abaixo da meta por `2` semanas seguidas | está dando certo | subir a verba em até `20%`, a cada `3` ou `4` dias |
| Custo real por pessoa acima do empate por `2` semanas seguidas | está perdendo dinheiro | baixar a verba ou pausar, e rever criativo e atendimento |

### 10.3 O que não fazer, a câmara de fermentação

- Mudar a verba mais de `20%` de uma vez.
- Fazer mais de uma mudança a cada `3` ou `4` dias.
- Pausar e reativar toda hora.
- Duplicar conjunto para "reiniciar a sorte".
- Julgar pelo dia, em vez da semana.
- Subir cinco anúncios novos de uma vez no meio do aprendizado. Entre com no máximo dois.

### 10.4 A revisão do mês

Uma vez por mês, na planilha:

- Qual ângulo e qual formato ganharam, na aba Criativos.
- ROAS do mês, % de mídia e custo real por pessoa contra a meta.
- **Escolher um teste só para o mês seguinte.** Os candidatos estão no fim do plano de largada.

---

## Módulo 11 · Os erros mais caros

1. Turbinar post pelo app achando que é campanha.
2. Tráfego para o perfil: clique barato, salão vazio.
3. Ninguém responde o WhatsApp durante o serviço.
4. Raio de `20` km por medo de público pequeno.
5. Cinco conjuntos de `R$ 10`, em vez de um de `R$ 50`.
6. Mexer todo dia.
7. Julgar a campanha pelo primeiro dia.
8. Esquecer os `12,15%` de tributo na conta.
9. Anunciar o sábado que já lota.
10. Drink no anúncio sem idade mínima de `18` e sem advertência.
11. Deixar a melhoria automática mexer na foto da pizza.
12. Somar os `13%` de serviço no ticket médio e achar que dá para pagar mais por cliente do que dá.

---

## Exercícios

**1. Empate de outra casa.** Ticket por pessoa de `R$ 180` sem serviço, margem de contribuição de `55%`, `2` pessoas por reserva, `90%` de comparecimento e `30%` das conversas viram reserva. Qual o custo de empate por conversa no Gerenciador, e qual a meta?

<details>
<summary>Resposta</summary>

Contribuição por pessoa: `180 × 55% = R$ 99,00`. Por mesa: `99 × 2 = R$ 198,00`. Por reserva feita: `198 × 90% = R$ 178,20`. Por conversa: `178,20 × 30% = R$ 53,46` real. No Gerenciador: `53,46 ÷ 1,1383 = R$ 46,96`. Meta, metade do empate: `R$ 23,48`.

</details>

**2. Diagnóstico.** Segunda semana: CPM de `R$ 14`, CTR de `1,1%`, custo por conversa de `R$ 7`, `60` conversas e `6` reservas. Onde está o problema e o que você faz?

<details>
<summary>Resposta</summary>

O anúncio está ótimo: custo por conversa bem abaixo da meta de `R$ 20,65`. A conversão em reserva é de `6 ÷ 60 = 10%`, abaixo dos `15%` da regra. O problema está depois do anúncio. Conferir o tempo de resposta, ler as conversas para ver o que as pessoas perguntam e não fecham, por exemplo preço, cardápio ou um sábado sem mesa, e ajustar o roteiro. **Não mexer no anúncio.**

</details>

**3. Diagnóstico.** Quarta semana: frequência de `3,8` em `7` dias, CTR caiu de `1,2%` para `0,6%`, custo por conversa subiu de `R$ 8` para `R$ 15`. O que aconteceu?

<details>
<summary>Resposta</summary>

Cansaço do criativo: as mesmas pessoas viram o mesmo anúncio vezes demais e pararam de responder. Entrar com um ou dois anúncios novos no mesmo conjunto, com gancho diferente, e tirar o que mais caiu. Não mexer no público nem na verba ao mesmo tempo.

</details>

**4. Pré-pago.** A QT deposita `R$ 2.000` por Pix. Quanto disso vira veiculação?

<details>
<summary>Resposta</summary>

`2.000 × (1 − 0,1215) = R$ 1.757,00`. Os outros `R$ 243,00` são PIS, Cofins e ISS.

</details>

---

## Glossário

| Termo | O que é | Conta |
|---|---|---|
| Alcance | pessoas diferentes que viram o anúncio | |
| Impressões | quantas vezes o anúncio apareceu | |
| Frequência | quantas vezes, em média, cada pessoa viu | impressões ÷ alcance |
| CPM | custo de mil impressões | gasto ÷ impressões × `1.000` |
| CTR do link | parte das impressões que virou clique no botão | cliques no link ÷ impressões |
| Conversa iniciada | alguém mandou a primeira mensagem pelo anúncio | |
| Custo por conversa | quanto custou cada conversa | gasto ÷ conversas |
| Taxa de gancho | parte de quem viu que ficou `3` segundos | reproduções de `3s` ÷ impressões |
| ThruPlay | vídeo assistido até o fim ou por `15` segundos | |
| Retenção | de quem passou dos `3` segundos, quantos foram até o fim | ThruPlays ÷ reproduções de `3s` |
| Aprendizado | fase em que o algoritmo ainda calibra a entrega | cerca de `50` eventos em `7` dias |
| Advantage+ | as automações do Meta: público, posicionamento, orçamento, criativo | |
| Conjunto de dados | o antigo pixel, que conta o que acontece no site | |
| API de Conversões | o envio desses eventos direto do sistema para o Meta | |
| Margem de contribuição | o que sobra de cada real vendido depois dos custos variáveis | `1 − CMV − impostos − taxas` |
| ROAS | faturamento por real de anúncio | faturamento ÷ gasto real |
| % de mídia | parte do faturamento que foi para anúncio | gasto real ÷ faturamento |
| Incrementalidade | o cliente que só veio por causa do anúncio | |
| Cansaço de criativo | queda de resposta quando o mesmo público vê o mesmo anúncio demais | frequência sobe, CTR cai |

---

## Fontes consultadas em 05/10/2026

As regras de plataforma mudam rápido. Estas foram as fontes usadas para conferir o que está nesta apostila.

- Tributos repassados pela Meta a partir de `01/01/2026`: [TI Inside](https://tiinside.com.br/03/09/2025/meta-repassara-impostos-sobre-anuncios-no-brasil-a-partir-de-2026/), [Selia](https://www.selia.com.br/marketing-digital/trafego-pago-2026-repasse-impostos/), [Reforma Tributária, sobre o comunicado da Meta](https://www.reformatributaria.com/brasil/meta-dona-do-instagram-e-facebook-comunica-clientes-sobre-inclusao-da-cbs-e-ibs-na-nota-fiscal/)
- Objetivos e Advantage+ em `2026`: [Black Propeller](https://blackpropeller.com/blog/meta-ads-manager-complete-guide/), [AdAdvisor](https://adadvisor.ai/blog/meta-ads-updates-2026)
- Localização e raio: [Jon Loomer, segmentação em 2026](https://www.jonloomer.com/meta-ads-targeting-2026/), [Adenslab](https://www.adenslab.com/blog/meta-ads-location-targeting-living-in-vs-recently-in-vs-traveling)
- Público Advantage+, controles e sugestões: [Jon Loomer](https://www.jonloomer.com/how-advantage-plus-audience-works/), [Conversios](https://www.conversios.io/blog/meta-advantage-audience-vs-detailed-targeting-2026-guide/)
- Fase de aprendizado: [Jetfuel](https://jetfuel.agency/what-is-the-meta-ads-learning-phase-how-to-exit-it-faster-in-2026/), [Blip](https://withblip.com/blog/meta-ads-learning-phase-bulk-editing/)
- Zona segura do `9:16`: [Billo](https://billo.app/blog/meta-ads-safe-zones/), [AdNabu](https://blog.adnabu.com/meta-ads/meta-safe-zones/)
- Anúncios de clique para WhatsApp: [AdLibrary](https://adlibrary.com/posts/meta-click-to-whatsapp-ads-guide), [Respond.io](https://respond.io/blog/click-to-whatsapp-ads)
- Programação de anúncios só com orçamento total: [Madgicx](https://madgicx.com/blog/meta-campaign-scheduling)
- Política de álcool: [Padrões de Publicidade da Meta, álcool](https://transparency.meta.com/policies/ad-standards/restricted-goods-services/alcohol/)
- Custos de referência no Brasil: [Trafius, CPM 2026](https://trafius.com.br/blog/cpm-medio-facebook-ads-brasil-2026), [SocialHub, WhatsApp 2026](https://www.socialhub.pro/blog/click-to-whatsapp-ads-2026/)
