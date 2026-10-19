# QT Video 1.1 · Stories com tarantella

A versão do vídeo 1.1 que roda no anúncio de reserva nos Stories do Instagram. A placa de `2026` entra logo depois do forno, como segunda cena, e a trilha é uma tarantella em remix, com a virada da música caindo no corte da placa. Nenhum texto na imagem: a advertência de álcool vai no texto principal do anúncio.

| | |
|---|---|
| Campanha | reserva pelo site, só nos Stories do Instagram, com o botão do anúncio levando ao site de reservas |
| Gancho | o forno aceso e, logo em seguida, a placa do `17º` lugar no 50 Top Pizza World `2026` |
| Placa | a foto da de `2026`, endireitada, com a cor do vídeo e um avanço lento de câmera, por `1,5` s; a de `2025` sai |
| Duração | `19,19` s, com `22` planos |
| Trilha | Italian Tarantella Remix, a `134` batidas por minuto, escolhida pelo Matheus |
| Texto | nenhum na imagem; a advertência de álcool fica no texto principal do anúncio |

Para gerar, com a foto `placa-2026.jpg` e a música na mesma pasta do vídeo, fora do Git:

```bash
node anuncios-qt/edicao.mjs anuncios-qt/edicoes/qt-video-1-1-stories.md "QT - VIDEO 1.1V31.mov" "QT video 1.1 stories tarantella.mp4"
```

A montagem tira a placa de `2025`, que ia de `8,09` a `8,92` s no original, e põe a de `2026` logo depois do primeiro plano.

```montagem
0,00 a 0,83
foto placa por 1,50 s
0,83 a 8,09
8,92 a 18,52
```

```quadro
plano: placa
foto: placa-2026.jpg
giro: 1,4
recorte: 540, 960, 465, 741
zoom: 1,04 a 1,12
tom: quente
```

## A música

Aos `28,8` s, a tarantella para por um instante, e aos `29,001` s entra a parte forte. A música começa em `28,167` s para essa virada cair no corte da placa, aos `0,834` s do vídeo: no forno, a música vem baixa e para, e na placa ela explode. O trecho usado vai até `47,35` s da música e fica todo na parte forte, que só acaba aos `57` s.

O compasso é de `6/8`: cada batida, de `447,8` ms, se divide em três colcheias de `149` ms, e as duas primeiras são marcadas. Dos `21` cortes do vídeo, `14` caem a menos de `45` ms de uma colcheia. No fim, a música some em `1,2` s, sobre a marca no forno.

```trilha
Italian_Tarantella_Remix.mp4 a partir de 28,167 s
```
