# QT Video 1.1 · a casa em 18 segundos

O vídeo do videomaker, com `22` planos em `18,5` s, vira o anúncio de reserva. Os cortes ficam como estão: a edição põe o texto na pegada da camiseta, troca a placa de `2025` pela de `2026` e troca a trilha. Sem cartela no fim.

| | |
|---|---|
| Campanha | reserva, com o botão de WhatsApp |
| Gancho | o `17º` lugar no 50 Top Pizza World `2026` |
| Placa | a de `2025`, aos `8,1` s, dá lugar à foto da de `2026` |
| Trilha | a original não pode ir para anúncio; entra a faixa escolhida, com licença para anúncio |
| Advertência | pequena, no rodapé da área segura, do começo ao fim, porque há drink em `6` dos `22` planos |
| Termo de imagem | o do bartender, que aparece aos `10,7` e aos `15,1` s, está assinado |

Os tempos batem com os cortes do vídeo. Para gerar:

```bash
node anuncios-qt/edicao.mjs anuncios-qt/edicoes/qt-video-1-1.md "QT - VIDEO 1.1V31.mov" --audio trilha.mp3
```

```quadro
plano: gancho
tempo: 0,00 a 3,67 s
texto: 17ª melhor pizzaria / do mundo | 300 | 84 | etiqueta
texto: 50 Top Pizza 2026 | 545 | 42 | fala
```

```quadro
plano: placa
tempo: 8,09 a 8,93 s
cartao: sim
texto: Foto da placa / de 2026 | 640 | 72 | chamada
texto: entra aqui | 860 | 40 | nota
```

```quadro
plano: chamada
tempo: 16,47 a 18,51 s
texto: Reserva no / WhatsApp | 300 | 84 | etiqueta
```

```quadro
plano: advertência
tempo: 0,00 a 18,51 s
texto: Evite o consumo excessivo de álcool. | 1186 | 30 | legenda
```
