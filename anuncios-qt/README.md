# Anúncios da QT · Meta Ads

Esta pasta é da **QT Pizza Bar**, não da marca pessoal. Segue o manual da QT, com preto `#1A1E1E`, cinza `#A0A5A5`, branco `#EFECEC` e Helvetica, e o tom da casa. Nada daqui vai para o @matheus__ramos, e nada da identidade MR entra nos anúncios da QT.

## O que tem aqui

| Arquivo | O que é |
|---|---|
| [`apostila-meta-ads.md`](apostila-meta-ads.md) | a apostila: leilão, estrutura, objetivos, conta, público, criativo, verba, passo a passo no Gerenciador, medição, rotina, erros e exercícios com resposta |
| [`apostila-meta-ads.pdf`](apostila-meta-ads.pdf) | a mesma apostila em PDF, `28` páginas A4 na identidade da QT, com capa, sumário, gabarito separado e marcadores de navegação |
| [`plano-de-largada.md`](plano-de-largada.md) | as duas primeiras campanhas prontas para montar: fichas técnicas, textos, atendimento no WhatsApp, as quatro semanas, o teste do mês `2` e a campanha de confraternização |
| [`roteiros/`](roteiros/README.md) | os vídeos da campanha: o plano de filmagem e um roteiro com storyboard para cada vídeo, em markdown e PDF |
| [`ensaios/`](ensaios/README.md) | o ensaio antes da diária: o caderno com as `16` fichas, fotos de posição e prompts para a previz com IA, em markdown e PDF, e uma animática por vídeo |
| [`meta-ads-qt.xlsx`](meta-ads-qt.xlsx) | a planilha: Calculadora, Campanhas, Semanal, Criativos, Checklist e Como ler |
| [`planilha.py`](planilha.py) | gera a planilha |
| [`apostila-pdf.mjs`](apostila-pdf.mjs) | gera o PDF da apostila a partir do markdown |
| [`roteiros-pdf.mjs`](roteiros-pdf.mjs) | gera os PDFs dos roteiros, com o storyboard de [`storyboard.mjs`](storyboard.mjs) |
| [`animatica.mjs`](animatica.mjs) | monta a animática de cada vídeo a partir do roteiro, com o storyboard ou com o material do ensaio |
| [`ensaios-pdf.mjs`](ensaios-pdf.mjs) | gera o PDF do caderno de ensaio e recalcula as tabelas de custo e de tempo de leitura |
| [`pdf-qt.mjs`](pdf-qt.mjs) | a base comum dos PDFs da QT: fonte, página e impressão |

## Ordem de uso

1. Ler os módulos `0` a `3` da apostila.
2. Trocar os exemplos da aba Calculadora pelos números da QT: ticket sem os `13%`, CMV, impostos e taxas.
3. Ensaiar os vídeos com o [caderno de ensaio](ensaios/caderno-de-ensaio.md): animática, fotos de posição, previz e ensaio com celular.
4. Fazer a semana `0` do plano de largada, com a diária do [plano de filmagem](roteiros/00-plano-de-filmagem.md) e os vídeos montados pelos roteiros.
5. Publicar numa terça de manhã e não mexer por três dias.
6. Toda segunda, `30` minutos na aba Semanal.

## Os números de partida

Todos saem dos exemplos da Calculadora e mudam quando os da QT entrarem.

| | |
|---|---|
| Margem de contribuição | `59%` |
| Empate por pessoa atendida, com tributo | `R$ 88,50` |
| Meta por pessoa atendida, com tributo | `R$ 44,25` |
| Meta de custo por conversa, no Gerenciador | `R$ 20,65` |
| Verba recomendada | `R$ 65` por dia, `R$ 2.219,69` por mês na fatura |
| Projeção com conversa a `R$ 12` | `66` pessoas no mês, resultado de `R$ 3.657,26` |

## A planilha

| Aba | O que faz |
|---|---|
| Calculadora | quanto a QT pode pagar por conversa, reserva e pessoa, a projeção do mês e o teste de estresse |
| Campanhas | a ficha técnica de cada campanha, com a verba diária e a conferência contra a Calculadora |
| Semanal | toda segunda: números do Gerenciador, do WhatsApp e do livro de reservas, com custo real por pessoa, ROAS e a leitura contra a meta |
| Criativos | um anúncio por linha, com taxa de gancho, retenção, CTR, custo por conversa e uma sugestão do que fazer |
| Checklist | semana `0`, antes de publicar e primeira semana, com contador |
| Como ler | glossário, faixas de referência e as regras de decisão |

Amarelo é o que se preenche, branco QT é o que se calcula, número azul é entrada. A Semanal e a Criativos têm uma linha `EXEMPLO` em cinza, só para mostrar o formato.

**Cuidado ao rodar o script de novo.** `python3 anuncios-qt/planilha.py` reconstrói o arquivo do zero e apaga o que foi preenchido. Ele existe para mudar a estrutura, não para atualizar números. Precisa da biblioteca `openpyxl`.

## O PDF

O texto mora no `.md`. Mexeu na apostila, num roteiro ou no caderno de ensaio, gere o PDF de novo:

```bash
npm install
npm run apostila
npm run roteiros
npm run ensaios
npm run animatica
```

A animática precisa do `ffmpeg` instalado.

O sumário se numera sozinho: cada seção é impressa à parte numa passada prévia e as páginas são somadas. Na mesma passada, a seção que deixaria uma sobra pequena na última página é testada numa versão um pouco mais compacta, e fica com ela se a sobra sumir. Tabela curta não quebra entre páginas, tabela longa quebra repetindo o cabeçalho.

A fonte é a Helvetica. No Linux o nome Helvetica cai na Liberation Sans, que é clone da Arial, então o CSS pede antes a FreeSans, que é clone da Helvetica. No Mac entra a Helvetica de verdade.

O símbolo oficial da QT, o `QT_simbolopreto.png`, não está no repositório, e o manual pede o arquivo em vez de reconstrução. Por isso a capa leva só o nome da casa em texto. Com o arquivo na pasta, ele entra na capa.

## Verificação das fórmulas

O LibreOffice não abre arquivos neste ambiente, então as fórmulas foram conferidas como na pasta [`analise/`](../analise/README.md): a planilha foi preenchida com dados de teste e calculada com a biblioteca `formulas`, comparando `65` resultados com as contas da apostila, inclusive todos os caminhos da coluna Sugestão e as três leituras da Semanal. Nenhuma das `1.067` células calculadas deu erro, nem com a planilha vazia. O arquivo vem marcado para o Excel recalcular tudo ao abrir.

Vale repetir essa verificação se alguém mexer nas fórmulas.

## O que só a QT pode preencher

- Como a reserva é feita hoje. Se for por plataforma com link, a campanha principal troca para Tráfego.
- Ticket médio sem os `13%`, CMV, impostos, taxas, comparecimento, pessoas por reserva e lugares que sobram de terça a quinta.
- Nos textos do WhatsApp: horário, endereço, links, tolerância da reserva e a proposta para grupo.
- Nos anúncios: os textos citam "entre as `100` melhores do mundo pelo 50 Top Pizza desde `2022`" e "Pizza Maker of the Year `2024`". Se quiser citar a posição de `2025` ou `2026`, troque no plano antes de subir.

## Validade

As regras da plataforma foram conferidas em `05/10/2026`. O Meta muda interface e política com frequência, então vale reler a apostila a cada seis meses, começando pelas fontes listadas no fim dela.
