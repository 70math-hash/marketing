# marketing

Repositório de conteúdo do Instagram [@matheus__ramos](https://instagram.com/matheus__ramos).

Objetivo: aumentar alcance e número de seguidores para depois lançar o curso online e encher as turmas dos cursos presenciais de pizza.

## Estrutura

| Pasta | O que tem |
|---|---|
| `estrategia/` | Diagnóstico, séries, horários e calendário |
| `posts/` | As `16` peças do mês, roteirizadas |
| `template/` | Template de carrossel que gera os PNG |
| `saida/` | Os PNG prontos pra postar |

## Estratégia

- [`diagnostico.md`](estrategia/diagnostico.md) leitura dos números do perfil e onde a retenção vaza
- [`series-e-retencao.md`](estrategia/series-e-retencao.md) as quatro séries de conteúdo e a mecânica de retenção em três camadas
- [`horarios.md`](estrategia/horarios.md) janelas de publicação e a grade semanal
- [`calendario-30dias.md`](estrategia/calendario-30dias.md) pauta fechada das quatro primeiras semanas
- [`revisao-01-09.md`](estrategia/revisao-01-09.md) revisão depois de 12 dias, com a grade reduzida para `2` posts por semana

## Posts

As `16` peças do primeiro mês estão roteirizadas em [`posts/`](posts/), com telas, roteiro de gravação com tempo e fala, legenda e hashtags. O [índice](posts/README.md) lista todas.

Quatro delas dependem de material que só o Matheus tem, que são a criação autoral, o cronograma real de produção, o erro pessoal e os dados do curso. Essas vêm com molde e exemplo trabalhado. As outras `12` estão fechadas.

## Template de carrossel

O layout da série O Porquê do Número é fixo e o conteúdo vem de um JSON, então cada carrossel novo é um arquivo de texto e um comando:

```bash
npm install
npm run render
```

Os `24` PNG das quatro terças do mês já estão em [`saida/`](saida/), em `1080x1350`. Como usar e como criar um novo está em [`template/README.md`](template/README.md).

## Ponto de partida

Base em `19/08/2026`: `4.169` seguidores, `295` posts, `49.900` visualizações em 30 dias.

A identidade visual e a voz seguem o manual da marca pessoal Matheus Ramos, que é independente da QT Pizza Bar e nunca se mistura com ela.

MR · #cadagramatemumporque
