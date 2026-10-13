# QT Video 1.1 · a casa em 18 segundos

O vídeo do videomaker, com `22` planos em `18,5` s, vira o anúncio de reserva nos Stories do Instagram. Os cortes ficam como estão: a edição põe o texto na pegada da camiseta, troca a placa de `2025` pela de `2026` e troca a trilha. Sem cartela no fim.

| | |
|---|---|
| Campanha | reserva pelo site, só nos Stories do Instagram, com o botão do anúncio levando ao site de reservas |
| Gancho | o `17º` lugar no 50 Top Pizza World `2026` |
| Placa | a de `2025`, aos `8,1` s, dá lugar à foto da de `2026`, endireitada, com a cor do vídeo e um avanço lento de câmera |
| Trilha | a original não pode ir para anúncio; entra a faixa escolhida, com licença para anúncio |
| Chamada | no fim, logo acima do botão, apontando para ele |
| Advertência | pequena, entre a chamada e o botão, do começo ao fim, porque há drink em `6` dos `22` planos |
| Termo de imagem | o do bartender, que aparece aos `10,7` e aos `15,1` s, está assinado |

Os tempos batem com os cortes do vídeo. Nos Stories, a barra de progresso e o nome da conta cobrem uns `250` px no alto, e o botão do anúncio cobre uns `340` px no pé: todo texto fica entre `250` e `1580` px. Para gerar:

```bash
node anuncios-qt/edicao.mjs anuncios-qt/edicoes/qt-video-1-1.md "QT - VIDEO 1.1V31.mov" --audio trilha.mp3
```

A foto `placa-2026.jpg` fica na mesma pasta do vídeo, fora do Git, como todo material filmado.

```quadro
plano: gancho
tempo: 0,00 a 3,67 s
texto: 17ª melhor pizzaria / do mundo | 300 | 84 | etiqueta
texto: 50 Top Pizza 2026 | 545 | 42 | fala
```

```quadro
plano: placa
tempo: 8,09 a 8,92 s
foto: placa-2026.jpg
giro: 1,4
recorte: 540, 960, 465, 741
zoom: 1,04 a 1,12
tom: quente
```

```quadro
plano: chamada
tempo: 16,47 a 18,51 s
texto: Reserva aqui / embaixo ↓ | 1180 | 84 | etiqueta
```

```quadro
plano: advertência
tempo: 0,00 a 18,51 s
texto: Evite o consumo excessivo de álcool. | 1460 | 30 | legenda
```
