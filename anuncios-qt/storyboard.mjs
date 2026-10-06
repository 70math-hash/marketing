// Quadros de storyboard dos roteiros: desenho esquemático da cena, zona segura do Reels
// e o texto na tela na posição e no tamanho em que entra no vídeo.
// Tudo em pixel do vídeo final, 1080 x 1920, então o quadro é o vídeo em miniatura.

const C = {
  claro: '#EFECEC', medio: '#A0A5A5', escuro: '#1A1E1E',
  massa: '#D9D6D2', molho: '#8E9292', mancha: '#4C5151',
  madeira: '#4A4E4E', pessoa: '#7E8282', roupa: '#5B6060',
};
const FUNDOS = { forno: '#141717', bancada: '#2C3030', mesa: '#3A3E3E', salao: '#262A2A', preto: '#1A1E1E' };

// zona segura do Reels: 14% em cima, 35% embaixo, 6% dos lados
const ZONA = { topo: 269, base: 1248, lado: 65 };

// sorteio com semente, para o desenho sair igual a cada geração
function sorteio(semente) {
  let s = semente;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const n = v => Number(v.toFixed(1));

// ---------- peças ----------
function pizzaCima(cx, cy, r, semente = 1) {
  const rnd = sorteio(semente);
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.massa}"/>`;
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * 2 * Math.PI + rnd() * 0.3;
    const rr = r * (0.86 + rnd() * 0.09);
    s += `<circle cx="${n(cx + rr * Math.cos(a))}" cy="${n(cy + rr * Math.sin(a))}" r="${n(r * (0.025 + rnd() * 0.03))}" fill="${C.mancha}"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${n(r * 0.8)}" fill="${C.molho}"/>`;
  for (const [dx, dy, br] of [[-0.35, -0.3, 0.17], [0.3, -0.35, 0.15], [0.05, 0.05, 0.19], [-0.4, 0.3, 0.14], [0.38, 0.3, 0.16]]) {
    s += `<circle cx="${n(cx + dx * r)}" cy="${n(cy + dy * r)}" r="${n(br * r)}" fill="${C.claro}" opacity=".9"/>`;
  }
  for (const [dx, dy, ang] of [[-0.05, -0.55, -25], [0.5, 0.0, 40], [-0.55, -0.05, 10]]) {
    const x = n(cx + dx * r), y = n(cy + dy * r);
    s += `<ellipse cx="${x}" cy="${y}" rx="${n(0.08 * r)}" ry="${n(0.045 * r)}" fill="${C.mancha}" transform="rotate(${ang} ${x} ${y})"/>`;
  }
  return s;
}

function pizzaPerspectiva(cx, cy, rx, ry) {
  let s = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C.massa}"/>`;
  s += `<ellipse cx="${cx}" cy="${n(cy + ry * 0.06)}" rx="${n(rx * 0.8)}" ry="${n(ry * 0.74)}" fill="${C.molho}"/>`;
  for (const [dx, dy] of [[-0.35, -0.1], [0.28, 0.12], [0.02, -0.32], [0.45, -0.25]]) {
    s += `<ellipse cx="${n(cx + dx * rx)}" cy="${n(cy + dy * ry)}" rx="${n(rx * 0.13)}" ry="${n(ry * 0.2)}" fill="${C.claro}" opacity=".9"/>`;
  }
  return s;
}

// mão vista de cima, entrando pela base do quadro e apontando para (alvoX, alvoY)
function mao(x, y, alvoX, alvoY, e = 1) {
  const ang = n((Math.atan2(alvoX - x, y - alvoY) * 180) / Math.PI);
  const k = v => n(v * e);
  return `<g transform="rotate(${ang} ${x} ${y})">` +
    `<rect x="${x - k(62)}" y="${y + k(30)}" width="${k(124)}" height="${k(520)}" rx="${k(20)}" fill="${C.roupa}"/>` +
    `<ellipse cx="${x}" cy="${y - k(40)}" rx="${k(62)}" ry="${k(88)}" fill="${C.pessoa}"/>` +
    [-39, -13, 13, 39].map((d, j) => `<ellipse cx="${x + k(d)}" cy="${y - k(j === 0 || j === 3 ? 128 : 142)}" rx="${k(14)}" ry="${k(38)}" fill="${C.pessoa}"/>`).join('') +
    `<ellipse cx="${x + k(66)}" cy="${y - k(30)}" rx="${k(16)}" ry="${k(40)}" fill="${C.pessoa}" transform="rotate(35 ${x + k(66)} ${y - k(30)})"/>` +
    `</g>`;
}

function tacaCima(cx, cy, r, drink) {
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.claro}" stroke-width="8" opacity=".85"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r * 0.72}" fill="${drink ? C.medio : '#5A5F5F'}" opacity=".35"/>`;
  if (drink) s += `<circle cx="${cx + r * 0.35}" cy="${cy - r * 0.3}" r="${r * 0.2}" fill="${C.claro}" opacity=".8"/>`;
  return s;
}

function tacaLado(x, y, e = 1) {
  const k = v => n(v * e);
  return `<path d="M ${x - k(55)} ${y} C ${x - k(55)} ${y + k(70)} ${x + k(55)} ${y + k(70)} ${x + k(55)} ${y} Z" fill="${C.medio}" opacity=".45" stroke="${C.claro}" stroke-width="6"/>` +
    `<line x1="${x}" y1="${y + k(52)}" x2="${x}" y2="${y + k(135)}" stroke="${C.claro}" stroke-width="6"/>` +
    `<ellipse cx="${x}" cy="${y + k(137)}" rx="${k(38)}" ry="${k(8)}" fill="none" stroke="${C.claro}" stroke-width="6"/>`;
}

function cabeca(cx, cy, r, opacidade = 1) {
  return `<path d="M ${n(cx - r * 1.9)} ${n(cy + r * 2.6)} Q ${cx} ${n(cy + r * 0.7)} ${n(cx + r * 1.9)} ${n(cy + r * 2.6)} Z" fill="${C.roupa}" opacity="${opacidade}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.pessoa}" opacity="${opacidade}"/>`;
}

const brilho = (id, cor, cx = '50%', cy = '50%', r = '50%') =>
  `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}"><stop offset="0" stop-color="${cor}"/><stop offset="1" stop-color="${cor}" stop-opacity="0"/></radialGradient>`;

const chama = d => `<path d="${d}" fill="${C.claro}" opacity=".6"/>`;

function pendentes(xs, y) {
  return xs.map(x => `<line x1="${x}" y1="0" x2="${x}" y2="${y}" stroke="${C.medio}" stroke-width="4"/>` +
    `<circle cx="${x}" cy="${y}" r="80" fill="${C.claro}" opacity=".12"/><circle cx="${x}" cy="${y}" r="24" fill="${C.claro}"/>`).join('');
}

// ---------- cenas ----------
const DESENHOS = {
  borda(id) {
    const cx = 540, cy = 2050, R = 1150, r = 960;
    let s = `<defs>${brilho(id + 'b', '#565B5B', '50%', '34%', '58%')}</defs><rect width="1080" height="1920" fill="url(#${id}b)"/>`;
    s += ['M 150 800 C 100 640 250 560 190 340 C 330 500 370 640 300 800 Z',
      'M 430 760 C 400 600 530 510 480 300 C 620 470 630 600 570 760 Z',
      'M 760 800 C 720 650 860 560 820 380 C 940 530 970 660 900 800 Z']
      .map(d => `<path d="${d}" fill="${C.medio}" opacity=".3"/>`).join('');
    s += `<path d="M 0 1035 A ${R} ${R} 0 0 1 1080 1035 L 1080 1256 A ${r} ${r} 0 0 0 0 1256 Z" fill="${C.massa}"/>`;
    const rnd = sorteio(7);
    for (let k = 0; k < 16; k++) {
      const x = 40 + k * 66 + rnd() * 30;
      const yo = cy - Math.sqrt(R * R - (x - cx) ** 2);
      const yi = cy - Math.sqrt(r * r - (x - cx) ** 2);
      const y = yo + (yi - yo) * (0.18 + rnd() * 0.45);
      s += `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(12 + rnd() * 16)}" ry="${n(9 + rnd() * 10)}" fill="${C.mancha}"/>`;
    }
    s += `<path d="M 0 1256 A ${r} ${r} 0 0 1 1080 1256 L 1080 1920 L 0 1920 Z" fill="${C.molho}"/>`;
    for (const [x, y, rr] of [[230, 1470, 80], [560, 1390, 95], [840, 1500, 78], [400, 1720, 85], [770, 1770, 62]]) {
      s += `<circle cx="${x}" cy="${y}" r="${rr}" fill="${C.claro}" opacity=".85"/>`;
    }
    return s;
  },

  forno(id) {
    const boca = 'M 140 1250 L 140 880 Q 140 570 540 570 Q 940 570 940 880 L 940 1250 Z';
    let s = `<defs>${brilho(id + 'f', '#6A6F6F', '30%', '62%', '42%')}</defs>`;
    s += `<rect x="60" y="430" width="960" height="900" rx="40" fill="#202424"/>`;
    s += `<path d="${boca}" fill="#0B0D0D" stroke="${C.medio}" stroke-width="14"/><path d="${boca}" fill="url(#${id}f)"/>`;
    s += chama('M 180 1205 C 150 1060 240 1000 205 870 C 300 975 315 1065 290 1205 Z');
    s += chama('M 275 1205 C 265 1095 335 1040 315 950 C 385 1035 395 1110 375 1205 Z');
    s += `<line x1="150" y1="1215" x2="930" y2="1215" stroke="${C.medio}" stroke-width="6" opacity=".7"/>`;
    s += pizzaPerspectiva(620, 1180, 205, 40);
    s += `<ellipse cx="540" cy="1202" rx="85" ry="15" fill="${C.medio}"/>`;
    s += `<line x1="600" y1="1205" x2="1010" y2="1900" stroke="${C.medio}" stroke-width="16" stroke-linecap="round"/>`;
    return s;
  },

  saida(id) {
    let s = `<defs>${brilho(id + 's', '#6A6F6F')}</defs>`;
    s += `<rect x="250" y="430" width="580" height="480" rx="30" fill="#202424"/>`;
    s += `<path d="M 320 860 L 320 720 Q 320 520 540 520 Q 760 520 760 720 L 760 860 Z" fill="#0B0D0D" stroke="${C.medio}" stroke-width="10"/>`;
    s += `<ellipse cx="430" cy="760" rx="160" ry="110" fill="url(#${id}s)"/>`;
    s += `<path d="M 200 990 Q 540 900 880 990 L 910 1190 Q 540 1270 170 1190 Z" fill="${C.medio}"/>`;
    s += pizzaPerspectiva(540, 1070, 300, 100);
    s += `<path d="M 515 1240 L 565 1240 L 610 1920 L 470 1920 Z" fill="${C.medio}"/>`;
    return s;
  },

  corte() {
    let s = `<rect x="0" y="1180" width="1080" height="740" fill="${C.madeira}"/>`;
    s += `<rect x="110" y="1140" width="860" height="40" fill="${C.massa}"/>`;
    s += `<path d="M 110 1180 L 110 1010 C 110 860 200 790 310 790 C 440 790 500 880 505 1010 L 505 1150 L 110 1180 Z" fill="${C.massa}"/>`;
    s += `<path d="M 110 1010 C 110 860 200 790 310 790 C 440 790 500 880 505 1010" fill="none" stroke="#7A7F7F" stroke-width="16"/>`;
    for (const [x, y] of [[150, 905], [235, 815], [350, 795], [450, 860], [495, 960]]) s += `<circle cx="${x}" cy="${y}" r="13" fill="${C.mancha}"/>`;
    for (const [x, y, r] of [[210, 960, 40], [320, 890, 30], [410, 990, 30], [285, 1060, 24], [180, 1070, 18], [380, 1090, 16], [250, 870, 20], [450, 920, 14]]) {
      s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${FUNDOS.bancada}"/>`;
    }
    s += `<path d="M 505 1140 L 970 1140 L 970 1105 C 900 1095 840 1112 760 1100 C 680 1090 600 1108 505 1100 Z" fill="${C.molho}"/>`;
    s += `<ellipse cx="640" cy="1094" rx="48" ry="18" fill="${C.claro}"/><ellipse cx="850" cy="1090" rx="52" ry="18" fill="${C.claro}"/>`;
    s += `<polygon points="528,840 562,840 562,1125 545,1148 528,1125" fill="${C.claro}" opacity=".9"/>`;
    s += `<rect x="514" y="690" width="62" height="160" rx="10" fill="${C.medio}"/>`;
    return s;
  },

  fatia() {
    const cx = 500, cy = 1120, r = 340, rad = g => (g * Math.PI) / 180;
    const a1 = rad(-70), a2 = rad(-25), dx = 175, dy = -55;
    const P = (a, rr, ox = 0, oy = 0) => [n(cx + ox + rr * Math.cos(a)), n(cy + oy + rr * Math.sin(a))];
    const semFatia = rr => { const [x2, y2] = P(a2, rr), [x1, y1] = P(a1, rr); return `M ${cx} ${cy} L ${x2} ${y2} A ${rr} ${rr} 0 1 1 ${x1} ${y1} Z`; };
    const fatia = rr => { const [x1, y1] = P(a1, rr, dx, dy), [x2, y2] = P(a2, rr, dx, dy); return `M ${cx + dx} ${cy + dy} L ${x1} ${y1} A ${rr} ${rr} 0 0 1 ${x2} ${y2} Z`; };
    let s = `<circle cx="${cx}" cy="${cy}" r="390" fill="${C.madeira}"/>`;
    s += `<path d="${semFatia(r)}" fill="${C.massa}"/><path d="${semFatia(r * 0.8)}" fill="${C.molho}"/>`;
    for (const [x, y, rr] of [[380, 1260, 56], [580, 1330, 48], [320, 1060, 50], [460, 1150, 60], [660, 1210, 44]]) {
      s += `<circle cx="${x}" cy="${y}" r="${rr}" fill="${C.claro}" opacity=".9"/>`;
    }
    s += `<path d="${fatia(r)}" fill="${C.massa}"/><path d="${fatia(r * 0.8)}" fill="${C.molho}"/>`;
    const [fx, fy] = P(rad(-48), r * 0.5, dx, dy);
    s += `<circle cx="${fx}" cy="${fy}" r="40" fill="${C.claro}" opacity=".9"/>`;
    for (const t of [0.35, 0.55, 0.75]) {
      const [x1, y1] = P(rad(-48), r * t), [x2, y2] = P(rad(-48), r * t, dx, dy);
      s += `<path d="M ${x1} ${y1} L ${n((x1 + x2) / 2 + 16)} ${n((y1 + y2) / 2)} L ${x2} ${y2}" fill="none" stroke="${C.claro}" stroke-width="7" opacity=".85"/>`;
    }
    return s;
  },

  mesa(id, q, drink = false) {
    let s = '';
    for (let k = 0; k < 9; k++) s += `<line x1="0" y1="${150 + k * 200}" x2="1080" y2="${172 + k * 200}" stroke="${C.claro}" stroke-width="3" opacity=".05"/>`;
    s += pizzaCima(540, 880, 300, 3);
    if (drink) {
      s += [470, 560, 650].map(x => `<path d="M ${x} 560 C ${x - 40} 500 ${x + 30} 450 ${x - 10} 380" fill="none" stroke="${C.claro}" stroke-width="7" opacity=".35" stroke-linecap="round"/>`).join('');
    }
    s += tacaCima(210, 470, drink ? 78 : 70, drink) + tacaCima(880, 1240, drink ? 78 : 70, drink);
    s += `<line x1="110" y1="1120" x2="110" y2="1380" stroke="${C.medio}" stroke-width="9" stroke-linecap="round"/>`;
    s += `<line x1="150" y1="1120" x2="150" y2="1380" stroke="${C.medio}" stroke-width="9" stroke-linecap="round"/>`;
    s += mao(330, 1560, 520, 1060) + mao(790, 1590, 600, 1080);
    return s;
  },

  'mesa-drink'(id, q) {
    return DESENHOS.mesa(id, q, true);
  },

  dividir() {
    let s = [[200, 380, 70], [480, 300, 50], [820, 420, 80], [650, 620, 40], [300, 700, 45]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.claro}" opacity=".1"/>`).join('');
    s += `<rect x="0" y="1180" width="1080" height="740" fill="${C.madeira}"/>`;
    s += `<line x1="0" y1="1180" x2="1080" y2="1180" stroke="${C.medio}" stroke-width="5" opacity=".6"/>`;
    s += pizzaPerspectiva(380, 1240, 250, 52);
    s += `<path d="M 520 860 Q 650 780 790 830" fill="none" stroke="${C.claro}" stroke-width="5" stroke-dasharray="16 12" opacity=".6"/>`;
    s += `<path d="M 600 960 L 800 905 L 760 1010 Z" fill="${C.massa}"/><path d="M 618 962 L 783 918 L 752 998 Z" fill="${C.molho}"/>`;
    s += `<path d="M 612 975 C 585 1060 560 1120 520 1205" fill="none" stroke="${C.claro}" stroke-width="6" opacity=".8"/>`;
    s += `<rect x="880" y="850" width="240" height="120" rx="24" fill="${C.roupa}" transform="rotate(-15 1000 910)"/>`;
    s += `<rect x="770" y="875" width="160" height="92" rx="46" fill="${C.pessoa}" transform="rotate(-15 850 921)"/>`;
    s += tacaLado(880, 1040, 1);
    return s;
  },

  salao(id, q) {
    let s = `<polygon points="0,0 1080,0 700,720 380,720" fill="#1E2222"/>`;
    s += `<polygon points="380,960 700,960 1080,1920 0,1920" fill="#303535"/>`;
    s += `<polygon points="0,0 380,720 380,960 0,1920" fill="#2A2F2F"/><polygon points="1080,0 700,720 700,960 1080,1920" fill="#2A2F2F"/>`;
    s += `<rect x="380" y="720" width="320" height="240" fill="#383D3D"/>`;
    for (let lin = 0; lin < 7; lin++) {
      for (let col = 0; col < 5; col++) {
        const x = 384 + col * 64 + (lin % 2 ? 32 : 0);
        if (x + 58 > 700) continue;
        s += `<rect x="${x}" y="${724 + lin * 34}" width="58" height="28" fill="none" stroke="${C.medio}" stroke-width="2" opacity=".25"/>`;
      }
    }
    s += `<polygon points="60,1060 380,960 380,1010 60,1150" fill="#2C3E50" opacity=".55"/>`;
    s += pendentes([300, 540, 780], 410);
    for (const x of [330, 750]) {
      s += cabeca(x - 90, 1095, 34) + cabeca(x + 90, 1095, 34);
      s += `<ellipse cx="${x}" cy="1190" rx="140" ry="34" fill="${C.madeira}"/>`;
    }
    s += `<ellipse cx="540" cy="1590" rx="380" ry="95" fill="${C.madeira}"/>`;
    s += pizzaPerspectiva(540, 1560, 170, 40);
    s += tacaLado(330, 1405, 0.9) + tacaLado(760, 1405, 0.9);
    return s;
  },

  timelapse() {
    let s = `<rect x="70" y="300" width="300" height="340" fill="#4A4F4F"/>`;
    s += `<line x1="220" y1="300" x2="220" y2="640" stroke="#262A2A" stroke-width="10"/><line x1="70" y1="470" x2="370" y2="470" stroke="#262A2A" stroke-width="10"/>`;
    s += `<polygon points="0,700 1080,560 1080,1920 0,1920" fill="#303535"/>`;
    s += pendentes([520, 820], 330);
    const mesas = [[260, 860, 90], [560, 820, 80], [850, 790, 75], [220, 1150, 115], [590, 1110, 105], [930, 1080, 100], [330, 1520, 150], [800, 1480, 140]];
    for (const [x, y, r] of mesas) {
      for (const [ox, oy] of [[-0.95, -0.25], [0.95, -0.25], [0, -0.8]]) {
        const hx = n(x + ox * r), hy = n(y + oy * r), hr = n(r * 0.26);
        s += `<circle cx="${n(hx + 18)}" cy="${hy}" r="${hr}" fill="${C.pessoa}" opacity=".25"/><circle cx="${hx}" cy="${hy}" r="${hr}" fill="${C.pessoa}" opacity=".6"/>`;
      }
      s += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${n(r * 0.45)}" fill="${C.madeira}"/>`;
    }
    return s;
  },

  'mesa-longa'() {
    let s = `<rect x="300" y="260" width="480" height="1460" rx="12" fill="${C.madeira}"/>`;
    for (const y of [430, 700, 970, 1240, 1510]) s += pizzaCima(540, y, 112, y);
    for (const y of [400, 650, 900, 1150, 1400, 1650]) {
      for (const [x, lado] of [[195, 1], [885, -1]]) {
        s += `<ellipse cx="${x - lado * 30}" cy="${y}" rx="78" ry="44" fill="${C.roupa}"/><circle cx="${x}" cy="${y}" r="48" fill="${C.pessoa}"/>`;
      }
    }
    for (const [x, y] of [[360, 560], [720, 830], [360, 1100], [720, 1380]]) s += tacaCima(x, y, 34, false);
    return s;
  },

  'mesa-cabeceira'() {
    let s = `<polygon points="0,0 1080,0 760,620 320,620" fill="#1E2222"/>`;
    s += `<polygon points="320,620 760,620 1080,1920 0,1920" fill="#303535"/>`;
    s += pendentes([360, 720], 330);
    s += `<polygon points="440,720 640,720 980,1760 100,1760" fill="${C.madeira}"/>`;
    for (const [y, rx, ry] of [[1560, 175, 42], [1240, 125, 30], [1010, 88, 21], [860, 62, 15], [770, 44, 11]]) s += pizzaPerspectiva(540, y, rx, ry);
    for (const [t, r] of [[0.08, 72], [0.3, 56], [0.52, 42], [0.7, 32], [0.85, 24]]) {
      const yl = 1720 - t * 1000;
      const xl = 60 + t * 360, xr = 1020 - t * 360;
      s += cabeca(n(xl), n(yl - r * 2.2), r) + cabeca(n(xr), n(yl - r * 2.2), r);
    }
    return s;
  },

  cartela() {
    return '';
  },

  guia() {
    const rot = (x, y, t, tam = 40, cor = C.claro, peso = 700, ancora = 'start') =>
      `<text x="${x}" y="${y}" font-size="${tam}" font-weight="${peso}" fill="${cor}" text-anchor="${ancora}" font-family="FreeSans, Helvetica, Arial, sans-serif">${t}</text>`;
    let s = `<rect width="1080" height="1920" fill="#2A2F2F"/>`;
    s += `<rect x="0" y="0" width="1080" height="${ZONA.topo}" fill="${C.claro}" opacity=".16"/>`;
    s += `<rect x="0" y="${ZONA.base}" width="1080" height="${1920 - ZONA.base}" fill="${C.claro}" opacity=".16"/>`;
    s += `<rect x="0" y="${ZONA.topo}" width="${ZONA.lado}" height="${ZONA.base - ZONA.topo}" fill="${C.claro}" opacity=".16"/>`;
    s += `<rect x="${1080 - ZONA.lado}" y="${ZONA.topo}" width="${ZONA.lado}" height="${ZONA.base - ZONA.topo}" fill="${C.claro}" opacity=".16"/>`;
    for (const y of [640, 1280]) s += `<line x1="0" y1="${y}" x2="1080" y2="${y}" stroke="${C.claro}" stroke-width="3" opacity=".25"/>`;
    for (const x of [360, 720]) s += `<line x1="${x}" y1="0" x2="${x}" y2="1920" stroke="${C.claro}" stroke-width="3" opacity=".25"/>`;
    for (const y of [285, 1635]) s += `<line x1="0" y1="${y}" x2="1080" y2="${y}" stroke="${C.claro}" stroke-width="6" stroke-dasharray="22 14"/>`;
    s += rot(96, 150, 'INTERFACE · 14%', 44, C.escuro);
    s += rot(96, 470, 'ÁREA ÚTIL', 76);
    s += rot(96, 545, 'ação e texto aqui', 46, C.claro, 400);
    s += rot(96, 1240, 'até aqui: 1250 px', 40, C.claro, 400);
    s += rot(96, 1460, 'LEGENDA, BOTÕES', 44, C.escuro);
    s += rot(96, 1520, 'E CTA · 35%', 44, C.escuro);
    s += rot(984, 330, 'corte 4:5', 38, C.claro, 400, 'end');
    s += rot(984, 1690, 'corte 4:5', 38, C.claro, 400, 'end');
    s += rot(984, 1790, 'grade do celular', 34, C.escuro, 400, 'end');
    return s;
  },
};

const zonas = () =>
  `<rect x="0" y="0" width="1080" height="${ZONA.topo}" fill="${C.claro}" opacity=".09"/>` +
  `<rect x="0" y="${ZONA.base}" width="1080" height="${1920 - ZONA.base}" fill="${C.claro}" opacity=".09"/>` +
  `<rect x="0" y="${ZONA.topo}" width="${ZONA.lado}" height="${ZONA.base - ZONA.topo}" fill="${C.claro}" opacity=".09"/>` +
  `<rect x="${1080 - ZONA.lado}" y="${ZONA.topo}" width="${ZONA.lado}" height="${ZONA.base - ZONA.topo}" fill="${C.claro}" opacity=".09"/>` +
  `<path d="M 0 ${ZONA.topo} H 1080 M 0 ${ZONA.base} H 1080 M ${ZONA.lado} ${ZONA.topo} V ${ZONA.base} M ${1080 - ZONA.lado} ${ZONA.topo} V ${ZONA.base}" stroke="${C.claro}" stroke-width="3" stroke-dasharray="14 10" opacity=".35" fill="none"/>`;

const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------- leitura do bloco ```quadro do markdown ----------
export function lerQuadro(bloco) {
  const q = { textos: [] };
  for (const linha of bloco.split('\n')) {
    const m = linha.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    const [, chave, valor] = m;
    if (chave === 'texto') {
      const [conteudo, y, tamanho, estilo] = valor.split('|').map(s => s.trim());
      q.textos.push({ linhas: conteudo.split(' / '), y: Number(y), tamanho: Number(tamanho), estilo: estilo || 'limpo' });
    } else {
      q[chave] = valor;
    }
  }
  const t = (q.tempo || '').match(/([\d,]+)\s*a\s*([\d,]+)/);
  if (t) [q.inicio, q.fim] = [t[1], t[2]].map(v => Number(v.replace(',', '.')));
  return q;
}

// ---------- as camadas do quadro ----------
// a cena desenhada, as faixas do Reels e o texto na tela, separados porque a animática
// põe as faixas e o texto por cima do material filmado
export function camadas(q, i) {
  const id = `q${i}`;
  const desenho = DESENHOS[q.desenho] ? DESENHOS[q.desenho](id, q) : '';
  const escurecer = q.escurecer ? `<rect width="1080" height="1920" fill="#000" opacity="${Number(q.escurecer) / 100}"/>` : '';
  const textos = q.textos.map(t =>
    `<div class="q-txt q-${t.estilo}" style="top:${n((t.y / 1920) * 100)}%; --t:${t.tamanho}">` +
    t.linhas.map(l => `<span>${esc(l).replace(/°/g, '<i class="q-grau">°</i>')}</span>`).join('<br>') + `</div>`).join('');
  return {
    cena: `<rect width="1080" height="1920" fill="${FUNDOS[q.fundo] || FUNDOS.preto}"/>${desenho}${escurecer}`,
    faixas: zonas(),
    textos,
  };
}

// ---------- quadro em html ----------
export function quadroHtml(q, i, { legenda = true } = {}) {
  const { cena, faixas, textos } = camadas(q, i);
  const guia = q.desenho === 'guia';
  const svg = `<svg viewBox="0 0 1080 1920" preserveAspectRatio="none" aria-hidden="true">${cena}${guia ? '' : faixas}</svg>`;
  const cap = legenda
    ? `<figcaption><b>${esc(q.plano)}</b> · ${esc(q.tempo || '')}<br>${esc(q.imagem || '')}</figcaption>`
    : '';
  return `<figure class="q-bloco${guia ? ' q-guia' : ''}"><div class="q-quadro">${svg}${textos}</div>${cap}</figure>`;
}

// ---------- decupagem e linha do tempo ----------
export function tabelaDecupagem(qs) {
  const texto = q => q.textos.length
    ? q.textos.map(t => esc(t.linhas.join(' '))).join('<br>')
    : '<span class="q-vazio">sem texto</span>';
  const linhas = qs.map(q => `<tr><td>${esc(q.plano)}</td><td class="q-tempo">${esc(q.tempo)}</td><td>${esc(q.imagem)}</td><td>${esc(q.camera)}</td><td>${esc(q.som)}</td><td>${texto(q)}</td></tr>`).join('');
  return `<table class="decupagem"><thead><tr><th>Plano</th><th>Tempo</th><th>Imagem</th><th>Câmera</th><th>Som</th><th>Texto na tela</th></tr></thead><tbody>${linhas}</tbody></table>`;
}

export function linhaDoTempo(qs) {
  const total = Math.max(...qs.map(q => q.fim));
  const seg = (ini, fim, rotulo, classe) =>
    `<div class="lt-seg ${classe}" style="flex-basis:${n(((fim - ini) / total) * 100)}%"><span>${rotulo}</span></div>`;
  const planos = qs.map(q => seg(q.inicio, q.fim, `<b>${esc(q.plano)}</b> ${String(Number((q.fim - q.inicio).toFixed(1))).replace('.', ',')} s`, 'lt-plano')).join('');
  // planos seguidos com o mesmo texto viram um trecho só
  const trechos = [];
  for (const q of qs) {
    const t = q.textos.map(x => x.linhas.join(' ')).join(' · ');
    const ultimo = trechos[trechos.length - 1];
    if (ultimo && ultimo.t === t) ultimo.fim = q.fim;
    else trechos.push({ t, ini: q.inicio, fim: q.fim });
  }
  const textos = trechos.map(x => seg(x.ini, x.fim, x.t ? esc(x.t) : 'sem texto', x.t ? 'lt-texto' : 'lt-texto lt-vazio')).join('');
  const marcas = Array.from({ length: Math.floor(total) + 1 }, (_, s) =>
    s % 2 === 0 || s === total ? `<span class="${s === total ? 'lt-fim' : ''}" style="left:${n((s / total) * 100)}%">${s}</span>` : '').join('');
  return `<div class="linha-tempo">` +
    `<div class="lt-rotulo">Plano</div><div class="lt-trilha">${planos}</div>` +
    `<div class="lt-rotulo">Texto</div><div class="lt-trilha">${textos}</div>` +
    `<div class="lt-rotulo">Segundos</div><div class="lt-regua">${marcas}</div></div>`;
}

export const cssStoryboard = `
.storyboard { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5mm 3.5mm; margin: 4pt 0 6pt; }
.q-bloco { margin: 0; break-inside: avoid; }
.q-quadro { position: relative; aspect-ratio: 9 / 16; container-type: inline-size; overflow: hidden; border: 0.6pt solid #A0A5A5; background: #1A1E1E; }
.q-quadro svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.q-txt { position: absolute; left: 8.889%; right: 8.889%; font-size: calc(var(--t) / 1080 * 100cqw); line-height: 1.16; font-weight: 700; color: #EFECEC; letter-spacing: 0.005em; }
.q-tarja { line-height: 1.36; }
.q-tarja span { background: rgba(26, 30, 30, 0.9); padding: 0 calc(16 / 1080 * 100cqw); -webkit-box-decoration-break: clone; box-decoration-break: clone; }
.q-rotulo { letter-spacing: 0.22em; text-transform: uppercase; color: #A0A5A5; }
.q-apoio { font-weight: 400; }
.q-grau { font-style: normal; margin: 0 -0.09em 0 -0.05em; }
.q-bloco figcaption { font-size: 6.8pt; line-height: 1.35; margin-top: 4pt; }
.q-bloco figcaption b { font-size: 8pt; }
.q-guia { width: 50mm; float: right; margin: 2pt 0 8pt 8mm; }
.corpo h2 { clear: both; }
.legenda-sb { font-size: 7.6pt; color: #5F6464; margin: 2pt 0 10pt; }
table.decupagem { font-size: 7.4pt; }
table.decupagem td:first-child { text-align: center; width: 7%; }
table.decupagem th:first-child { text-align: center; }
.q-tempo { white-space: nowrap; }
.q-vazio { color: #A0A5A5; }
.linha-tempo { display: grid; grid-template-columns: 19mm 1fr; gap: 2.5pt 4pt; align-items: center; margin: 4pt 0 12pt; break-inside: avoid; }
.lt-rotulo { font-size: 6.4pt; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #A0A5A5; }
.lt-trilha { display: flex; height: 17pt; }
.lt-seg { flex-grow: 0; flex-shrink: 0; overflow: hidden; border-right: 1.5pt solid #FFFFFF; display: flex; align-items: center; padding: 0 4pt; }
.lt-seg span { font-size: 6.6pt; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lt-plano { background: #1A1E1E; color: #EFECEC; }
.lt-plano b { font-weight: 700; margin-right: 2pt; }
.lt-texto { background: #D9D6D2; color: #1A1E1E; font-weight: 700; }
.lt-vazio { background: #EFECEC; color: #A0A5A5; font-weight: 400; }
.lt-regua { position: relative; height: 9pt; border-top: 0.6pt solid #A0A5A5; }
.lt-regua span { position: absolute; top: 1pt; font-size: 6pt; color: #5F6464; transform: translateX(-50%); }
.lt-regua span:first-child { transform: none; }
.lt-regua span.lt-fim { transform: translateX(-100%); }
`;
