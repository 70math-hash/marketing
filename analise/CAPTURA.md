# Como capturar os números

Fluxo manual, por print. Substitui a coleta automática, que foi descartada porque a API não entrega fonte, idade nem retenção, que são justamente os dados que mais explicaram os primeiros posts.

## Quando

**Toda segunda**, junto com a programação da semana. Uma sessão só, capturando os posts da semana anterior. Nesse ponto eles já têm `5` a `8` dias e os números estão estáveis.

Não vale capturar antes de `72h`, porque o post continua rodando e o número muda muito.

## O que capturar, por post

São `3` prints para foto ou carrossel, `4` para Reels. Caminho: abre o post, toca em **Ver insights**.

| # | Aba | Rolar até | Por que importa |
|---|---|---|---|
| `1` | Visão geral | mostrar **Principais fontes das visualizações** | é o dado que mais explica resultado |
| `2` | Engajamento | topo, com Ações após a visualização | visitas ao perfil e novos seguidores |
| `3` | Público | topo, com seguidores contra não seguidores | mede se alcançou gente nova |
| `4` | Visão geral, só Reels | **O que afeta suas visualizações** e a curva de retenção | tempo médio e taxa de pulados |

O print `1` costuma precisar de dois disparos, um no topo com Visualizações e Visualizadores, outro rolado até as fontes. Se couber num só, melhor.

## O que não precisa

Idade, país e gênero por post não mudaram nenhuma decisão até agora. Se um dia a leitura pedir, dá para puxar depois.

## O que se perde sem automação

A curva diária. A API devolveria o acumulado a cada dia e montaria a série, que separa post perene de pico. Na captura semanal fica só o retrato final.

Dá para recuperar parte disso de graça: a aba **Visualizações ao longo do tempo**, no print `1`, mostra o formato da curva. Não dá números por dia, mas mostra se ainda subia ou se já tinha achatado.

## Onde os dados moram

Em `dados/manual.json`, um objeto por post. A chave `peca` precisa bater com o nome na coluna Peça da planilha. Depois de editar, rode:

```bash
python3 analise/planilha.py
```

## Coleta automática

`coletar.py` está pronto e testado, mas **dormente**, à espera de `IG_TOKEN` e `IG_USER_ID`. Fica no repositório caso a decisão mude. Se for reativar, o caminho está no fim do `README.md` desta pasta.
