# Anúncio nos Stories · vídeo 1.1

Passo a passo no Gerenciador de Anúncios para o vídeo da casa rodar só nos Stories do Instagram, com o botão abrindo o site de reservas.

| | |
|---|---|
| Campanha | `QT_RES_SITE_STORIES`, objetivo Tráfego |
| Conjunto | `R6km_18+_STORIES`: raio de `6` km, `18+`, só Stories do Instagram |
| Anúncio | `DEST_STORIES_VIDEO11_v1`, com o botão Reservar agora levando ao site de reservas |
| Arquivo | `QT video 1.1 stories tarantella.mp4`: a placa de `2026` logo depois do forno, sem nenhum texto na imagem e com a tarantella, que explode no corte da placa |
| Orçamento | `R$ 20` por dia, por duas semanas |
| Como se julga | custo por reserva pelo site, comparado com o da reserva pelo WhatsApp |

## Antes de começar

- **Use o computador.** Faça tudo em adsmanager.facebook.com. O app do celular esconde metade das opções.
- **Tenha à mão** o arquivo do vídeo e o link do site de reservas.
- **Pergunte à plataforma de reservas** se dá para instalar nela o pixel do Meta da QT. A resposta muda o passo `6`.
- **A advertência vai no texto principal.** O vídeo sai sem nenhum escrito, e como aparece drink em `6` dos `22` planos, o texto principal fecha com "Evite o consumo excessivo de álcool."

## Campanha

1. No Gerenciador de Anúncios, na conta da QT, clique em **Criar**.
2. Escolha o objetivo **Tráfego**. Se ele oferecer configuração Advantage+ ou manual, escolha a **manual**.
3. Nome da campanha: `QT_RES_SITE_STORIES`. Categoria especial de anúncio: nenhuma.

## Conjunto de anúncios

4. Nome do conjunto: `R6km_18+_STORIES`.
5. Local do tráfego: **Site**.
6. Meta de desempenho:
   - **com o pixel no site de reservas:** maximizar visualizações da página de destino;
   - **sem pixel, ou se não souber:** maximizar cliques no link.
7. Orçamento de `R$ 20` por dia. Com um conjunto só, tanto faz deixar o orçamento na campanha ou no conjunto. Comece numa terça de manhã, sem data de término.
8. Público:
   - **Localização:** endereço da QT, com o alfinete e raio de `6` km.
   - **Idade mínima:** `18`. É obrigatória, porque aparece drink no vídeo.
   - **Público Advantage+:** ligado, com sugestão de `25` a `45` anos e interesses em gastronomia, culinária italiana e pizza.
9. Posicionamentos: **manuais**. Deixe marcado só **Stories do Instagram** e desmarque todo o resto, inclusive os Stories do Facebook. O Gerenciador vai avisar que menos posicionamentos podem encarecer o anúncio. Pode seguir.

## Anúncio

10. Nome do anúncio: `DEST_STORIES_VIDEO11_v1`.
11. Identidade: a Página da QT e o Instagram @qtpizzabar.
12. Formato: **imagem ou vídeo único**. Suba o arquivo `QT video 1.1 stories tarantella.mp4`.
13. Música: **não adicione** no Gerenciador. A música já vem dentro do vídeo, porque lá a opção de música só existe para anúncio de imagem.
14. Texto principal: o da seção Textos para copiar.
15. Título: o da seção Textos para copiar.
16. Destino: **Site**, com o link do site de reservas. Botão: **Reservar agora**. Se ele não aparecer na lista, use **Saiba mais**.
17. Em **Parâmetros de URL**, na parte de rastreamento, cole o texto da seção Textos para copiar.
18. Melhorias de criativo Advantage+: abra a lista e desligue tudo, inclusive a música, para nada mexer na imagem, no texto ou no som do vídeo.
19. Clique em **Visualizar** e escolha a tela dos Stories. Confira o botão **Reservar agora**, o som e o texto principal com a advertência.
20. Clique em **Publicar**. A análise do Meta costuma levar até `24` horas.

## Textos para copiar

**Texto principal**

> A 17ª melhor pizzaria do mundo no 50 Top Pizza 2026 fica logo ali, nos Jardins. Reserva pelo link e vem com fome. Evite o consumo excessivo de álcool.

**Título**

> Reserve sua mesa nos Jardins

**Parâmetros de URL**

```
utm_source=instagram&utm_medium=stories&utm_campaign=qt_res_site&utm_content=video_1_1
```

## Depois de publicar

- **Não mexa em nada por `3` dias.** É o tempo que o Meta leva para aprender.
- **No Gerenciador,** acompanhe o custo por visualização da página de destino, ou o custo por clique se não houver pixel.
- **Na QT,** conte as reservas que chegaram pelo site na semana e mantenha a pergunta "como conheceu a QT?".
- **Em duas semanas,** compare quanto custou cada reserva pelo site com quanto custou cada reserva pelo WhatsApp. O canal mais barato fica com a verba.

Os nomes dos botões do Gerenciador mudam com frequência. Se algum estiver diferente, procure pela função dele.

## Acompanhamento

Os números de cada leitura, contados desde o começo, às `17` h de `19/10`. O CTR é cliques no link ÷ impressões, e o CPM é gasto ÷ impressões × `1.000`.

| Leitura | Impressões | Cliques no link | CTR | Custo por clique | CPM | Gasto | Reservas pelo site |
|---|---|---|---|---|---|---|---|
| `19/10`, `17h41` | `202` | `3` | `1,5%` | `R$ 0,43` | `R$ 6,34` | `R$ 1,28` | `0` |
| `20/10`, `8h36` | `1.621` | `40` | `2,5%` | `R$ 0,31` | `R$ 7,54` | `R$ 12,23` | `0` |

**No site.** O site de reservas fica na Netlify, que registra cada acesso no painel Observability do projeto `magical-liger-2b7ac2`. Cada clique no anúncio chega com uma marca única, o `fbclid`, junto com as marcas `utm` do anúncio. Até `8h43` de `20/10`, `51` cliques diferentes do anúncio abriram a página inteira, com o aplicativo de reserva carregado, e nenhum terminou numa reserva. O anúncio entrega as pessoas na porta, e elas saem sem reservar.

Até `20h51` de `20/10`, foram `96` cliques do anúncio com a página aberta, e nenhum escolheu sequer uma data: a consulta de horários livres só foi chamada por quem chegou de outro jeito. A primeira reserva pelo site desde o começo do anúncio entrou às `20h35`, para `24/10`, mas não veio do anúncio: foi feita num computador, vindo do site da QT, e esse computador nunca clicou no anúncio. Uma visita do Instagram que veio pelo Linktree da bio escolheu datas `8` vezes no mesmo navegador do Instagram, então a página funciona ali. Quem chega pelo anúncio vai embora na primeira tela.

Zero reserva com `40` cliques ainda não diz nada. Se o site transformar `3` em cada `100` cliques em reserva, a chance de nenhuma reserva em `40` cliques é de `30%` (`0,97` elevado a `40`). Em `100` cliques, ela cai para `5%`: chegando aí sem reserva nenhuma, o anúncio fez a parte dele e o problema está entre o clique e a reserva, no site.
