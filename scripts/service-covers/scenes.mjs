/**
 * Monolit — hizmet kartı kapak görselleri.
 * Her sahne 1200x1500 (4:5) SVG; kum çizgiler + siyah zemin, sitenin paleti.
 * Kompozisyon üst-orta bölgede toplanır: kartın altındaki cam panel ve
 * sol üstteki numara rozeti görseli kapatmasın.
 */

const S = "#e6ddaa"; // kum
const S2 = "#a89f78";
const S3 = "#6f6949";

/* ---------- küçük yardımcılar ---------- */

const label = (x, y, text, { size = 15, fill = S2, anchor = "start", ls = 4 } = {}) =>
  `<text x="${x}" y="${y}" fill="${fill}" font-family="Menlo, monospace" font-size="${size}" letter-spacing="${ls}" text-anchor="${anchor}">${text}</text>`;

const panel = (x, y, w, h, { r = 10, op = 0.78, fill = "none", sw = 1.7 } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${S}" stroke-opacity="${op}" stroke-width="${sw}"/>`;

/** İçi hafif dolu yüzey (panel zemini) */
const surface = (x, y, w, h, { r = 10, op = 0.1 } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${S}" fill-opacity="${op}"/>`;

const line = (x1, y1, x2, y2, { op = 0.5, sw = 1.5, dash = "" } = {}) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${S}" stroke-opacity="${op}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;

/** Metin yerine geçen çubuklar */
const bars = (x, y, widths, { gap = 18, h = 8, op = 0.44, r = 4 } = {}) =>
  widths
    .map(
      (w, i) =>
        `<rect x="${x}" y="${y + i * (h + gap)}" width="${w}" height="${h}" rx="${r}" fill="${S}" fill-opacity="${op}"/>`,
    )
    .join("");

const dot = (cx, cy, r, { op = 0.8, fill = S } = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" fill-opacity="${op}"/>`;

const ring = (cx, cy, r, { op = 0.5, sw = 1.5, dash = "" } = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${S}" stroke-opacity="${op}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;

const arrow = (x1, y1, x2, y2, { op = 0.6 } = {}) =>
  `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${S}" stroke-opacity="${op}" stroke-width="1.6" marker-end="url(#head)"/>`;

/** Pencere başlığı: üç nokta + isteğe bağlı adres hapı */
const titlebar = (x, y, w, { pill = "", h = 54 } = {}) =>
  `${line(x, y + h, x + w, y + h, { op: 0.3 })}
   ${dot(x + 26, y + h / 2, 6, { op: 0.5 })}${dot(x + 48, y + h / 2, 6, { op: 0.32 })}${dot(x + 70, y + h / 2, 6, { op: 0.22 })}
   ${pill ? `<rect x="${x + 110}" y="${y + h / 2 - 15}" width="${w - 190}" height="30" rx="15" fill="${S}" fill-opacity=".06" stroke="${S}" stroke-opacity=".22"/>${label(x + 132, y + h / 2 + 6, pill, { size: 14, fill: S2, ls: 3 })}` : ""}`;

/* ---------- 15 sahne ---------- */

export const scenes = {
  /* 01 — Web sitesi: tarayıcı penceresi + hero düzeni */
  "web-sitesi": `
    <g opacity=".28" transform="translate(96 232) rotate(-2 500 340)">
      ${panel(0, 0, 900, 660, { r: 16, op: 0.5 })}
    </g>
    <g transform="translate(150 292)">
      ${surface(0, 0, 900, 660, { r: 16, op: 0.05 })}
      ${panel(0, 0, 900, 660, { r: 16, op: 0.65 })}
      ${titlebar(0, 0, 900, { pill: "monolit.com.tr" })}
      ${surface(40, 96, 820, 250, { r: 10, op: 0.09 })}
      ${panel(40, 96, 820, 250, { op: 0.3 })}
      ${bars(80, 160, [300, 420], { h: 22, gap: 20, op: 0.42 })}
      <rect x="80" y="250" width="170" height="44" rx="22" fill="${S}" fill-opacity=".85"/>
      ${panel(270, 250, 150, 44, { r: 22, op: 0.4 })}
      ${[0, 1, 2]
        .map(
          (i) =>
            `${panel(40 + i * 280, 386, 260, 200, { op: 0.32 })}${bars(70 + i * 280, 500, [150, 200], { h: 7, gap: 14, op: 0.26 })}${surface(70 + i * 280, 416, 60, 60, { r: 8, op: 0.14 })}`,
        )
        .join("")}
      ${line(40, 624, 860, 624, { op: 0.18, dash: "3 7" })}
    </g>
    ${label(150, 260, "01 / LANDING", { size: 15 })}
    ${label(1050, 260, "LCP 0.9s", { size: 15, anchor: "end" })}
    ${line(150, 1010, 1050, 1010, { op: 0.2 })}
    ${label(150, 1052, "İÇERİK MİMARİSİ", { size: 14 })}
    ${label(1050, 1052, "RESPONSIVE", { size: 14, anchor: "end" })}
  `,

  /* 02 — Web uygulaması: panel/dashboard */
  "web-uygulamasi": `
    <g transform="translate(140 270)">
      ${surface(0, 0, 920, 690, { r: 16, op: 0.05 })}
      ${panel(0, 0, 920, 690, { r: 16, op: 0.6 })}
      ${line(210, 0, 210, 690, { op: 0.3 })}
      ${line(0, 74, 920, 74, { op: 0.3 })}
      ${[0, 1, 2, 3, 4, 5]
        .map(
          (i) =>
            `${surface(34, 116 + i * 62, 26, 26, { r: 7, op: i === 1 ? 0.5 : 0.16 })}${bars(76, 122 + i * 62, [i === 1 ? 104 : 88], { h: 12, op: i === 1 ? 0.4 : 0.18 })}`,
        )
        .join("")}
      ${dot(44, 37, 9, { op: 0.55 })}${bars(70, 30, [120], { h: 14, op: 0.3 })}
      ${ring(860, 37, 16, { op: 0.35 })}${dot(806, 37, 8, { op: 0.3 })}
      ${[0, 1, 2]
        .map(
          (i) =>
            `${panel(246 + i * 226, 108, 200, 130, { op: 0.3 })}${label(268 + i * 226, 146, ["AKTİF", "GELİR", "SLA"][i], { size: 13, ls: 3 })}<text x="${268 + i * 226}" y="${204}" fill="${S}" fill-opacity=".85" font-family="Menlo, monospace" font-size="34" letter-spacing="1">${["128", "₺94K", "99.9"][i]}</text>`,
        )
        .join("")}
      ${panel(246, 274, 652, 232, { op: 0.34 })}
      <polyline points="286,470 366,432 446,446 526,376 606,398 686,320 766,344 856,282" fill="none" stroke="${S}" stroke-opacity=".8" stroke-width="2.4"/>
      <polyline points="286,470 366,432 446,446 526,376 606,398 686,320 766,344 856,282 856,490 286,490" fill="${S}" fill-opacity=".07" stroke="none"/>
      ${[0, 1, 2, 3].map((i) => line(286, 340 + i * 44, 856, 340 + i * 44, { op: 0.1, dash: "3 8" })).join("")}
      ${[0, 1, 2].map((i) => `${line(246, 566 + i * 48, 898, 566 + i * 48, { op: 0.14 })}${bars(276, 580 + i * 48, [180], { h: 9, op: 0.22 })}${bars(560, 580 + i * 48, [90], { h: 9, op: 0.16 })}${bars(760, 580 + i * 48, [60], { h: 9, op: 0.3 })}`).join("")}
    </g>
    ${label(140, 238, "02 / PANEL", { size: 15 })}
    ${label(1060, 238, "ROL: ADMIN", { size: 15, anchor: "end" })}
    ${line(140, 1010, 1060, 1010, { op: 0.2 })}
    ${label(140, 1052, "ROL BAZLI YETKİ", { size: 14 })}
    ${label(1060, 1052, "GERÇEK ZAMANLI", { size: 14, anchor: "end" })}
  `,

  /* 03 — Mobil uygulama: iki telefon kadrajı */
  "mobil-uygulama": `
    <g opacity=".4" transform="translate(600 300) rotate(9)">
      ${surface(0, 0, 340, 690, { r: 46, op: 0.05 })}
      ${panel(0, 0, 340, 690, { r: 46, op: 0.45 })}
      ${panel(24, 90, 292, 200, { r: 14, op: 0.28 })}
      <polyline points="48,250 100,208 152,232 204,170 256,196 292,150" fill="none" stroke="${S}" stroke-opacity=".55" stroke-width="2.2"/>
      ${[0, 1, 2].map((i) => `${panel(24, 320 + i * 96, 292, 78, { r: 12, op: 0.24 })}${bars(48, 344 + i * 96, [120, 74], { h: 9, gap: 12, op: 0.2 })}`).join("")}
    </g>
    <g transform="translate(258 262)">
      ${surface(0, 0, 360, 740, { r: 50, op: 0.06 })}
      ${panel(0, 0, 360, 740, { r: 50, op: 0.72, sw: 2 })}
      ${panel(10, 10, 340, 720, { r: 42, op: 0.22 })}
      <rect x="140" y="26" width="80" height="16" rx="8" fill="${S}" fill-opacity=".3"/>
      ${label(38, 40, "9:41", { size: 13, ls: 1 })}
      ${bars(38, 82, [150], { h: 18, op: 0.5 })}
      ${bars(38, 116, [96], { h: 9, op: 0.22 })}
      ${surface(38, 156, 284, 168, { r: 16, op: 0.12 })}
      ${panel(38, 156, 284, 168, { op: 0.3, r: 16 })}
      ${ring(180, 240, 44, { op: 0.5 })}${arrow(164, 240, 200, 240)}
      ${[0, 1, 2]
        .map(
          (i) =>
            `${panel(38, 352 + i * 92, 284, 74, { r: 14, op: 0.26 })}${surface(56, 370 + i * 92, 38, 38, { r: 10, op: 0.16 })}${bars(110, 376 + i * 92, [128, 78], { h: 8, gap: 10, op: 0.22 })}${dot(296, 389 + i * 92, 5, { op: 0.35 })}`,
        )
        .join("")}
      ${line(20, 646, 340, 646, { op: 0.25 })}
      ${[0, 1, 2, 3].map((i) => `${dot(72 + i * 72, 686, i === 0 ? 9 : 7, { op: i === 0 ? 0.85 : 0.28 })}`).join("")}
    </g>
    ${label(150, 232, "03 / MOBİL", { size: 15 })}
    ${label(1050, 232, "iOS · ANDROID", { size: 15, anchor: "end" })}
    ${line(150, 1050, 1050, 1050, { op: 0.2 })}
    ${label(150, 1092, "TEK KOD TABANI", { size: 14 })}
  `,

  /* 04 — E-ticaret: ürün ızgarası + sepet */
  "e-ticaret": `
    <g transform="translate(158 268)">
      ${[0, 1, 2, 3]
        .map((i) => {
          const x = (i % 2) * 218;
          const y = Math.floor(i / 2) * 300;
          return `${surface(x, y, 190, 268, { r: 12, op: 0.05 })}${panel(x, y, 190, 268, { op: 0.34 })}${surface(x + 16, y + 16, 158, 150, { r: 8, op: 0.12 })}${bars(x + 16, y + 190, [110], { h: 9, op: 0.24 })}${bars(x + 16, y + 216, [64], { h: 12, op: 0.45 })}${ring(x + 158, y + 232, 13, { op: 0.4 })}`;
        })
        .join("")}
    </g>
    <g transform="translate(624 300)">
      ${surface(0, 0, 384, 520, { r: 16, op: 0.07 })}
      ${panel(0, 0, 384, 520, { r: 16, op: 0.7 })}
      ${label(28, 52, "SEPET", { size: 16, fill: S2, ls: 5 })}
      ${ring(340, 44, 18, { op: 0.5 })}<text x="340" y="51" fill="${S}" fill-opacity=".9" font-family="Menlo, monospace" font-size="17" text-anchor="middle">3</text>
      ${line(0, 80, 384, 80, { op: 0.28 })}
      ${[0, 1, 2]
        .map(
          (i) =>
            `${surface(28, 106 + i * 96, 62, 62, { r: 8, op: 0.14 })}${bars(108, 116 + i * 96, [150, 84], { h: 8, gap: 12, op: 0.22 })}${label(356, 148 + i * 96, ["₺1.290", "₺680", "₺2.450"][i], { size: 15, fill: S2, anchor: "end", ls: 1 })}`,
        )
        .join("")}
      ${line(28, 404, 356, 404, { op: 0.25, dash: "4 8" })}
      ${label(28, 444, "TOPLAM", { size: 14 })}
      <text x="356" y="448" fill="${S}" fill-opacity=".9" font-family="Menlo, monospace" font-size="26" text-anchor="end">₺4.420</text>
      <rect x="28" y="470" width="328" height="34" rx="17" fill="${S}" fill-opacity=".85"/>
    </g>
    ${label(130, 236, "04 / MAĞAZA", { size: 15 })}
    ${label(1070, 236, "SEPET → ÖDEME", { size: 15, anchor: "end" })}
    ${line(130, 1010, 1070, 1010, { op: 0.2 })}
    ${label(130, 1052, "STOK · KARGO · İADE", { size: 14 })}
  `,

  /* 05 — Kişiye özel yazılım: teknik çizim / modüler şema */
  "ozel-yazilim": `
    <g transform="translate(160 250)">
      ${panel(180, 150, 520, 420, { op: 0.6, r: 14 })}
      ${surface(180, 150, 520, 420, { r: 14, op: 0.04 })}
      ${label(206, 192, "ÇEKİRDEK", { size: 14, fill: S2 })}
      ${[0, 1, 2, 3]
        .map((i) => {
          const x = 212 + (i % 2) * 236;
          const y = 224 + Math.floor(i / 2) * 174;
          return `${panel(x, y, 200, 140, { op: 0.32 })}${label(x + 18, y + 36, `M-0${i + 1}`, { size: 13 })}${bars(x + 18, y + 58, [120, 84, 140], { h: 7, gap: 12, op: 0.2 })}`;
        })
        .join("")}
      ${line(180, 150, 60, 60, { op: 0.3, dash: "6 8" })}${panel(0, 0, 160, 92, { op: 0.4 })}${label(24, 54, "GİRİŞ", { size: 13 })}
      ${line(700, 150, 820, 60, { op: 0.3, dash: "6 8" })}${panel(760, 0, 160, 92, { op: 0.4 })}${label(784, 54, "ÇIKTI", { size: 13 })}
      ${line(180, 570, 60, 660, { op: 0.3, dash: "6 8" })}${panel(0, 620, 190, 92, { op: 0.4 })}${label(24, 674, "ENTEGRE", { size: 13 })}
      ${line(700, 570, 820, 660, { op: 0.3, dash: "6 8" })}${panel(740, 620, 180, 92, { op: 0.4 })}${label(764, 674, "RAPOR", { size: 13 })}
      ${line(120, 150, 120, 570, { op: 0.22 })}${line(108, 150, 132, 150, { op: 0.22 })}${line(108, 570, 132, 570, { op: 0.22 })}
      ${label(96, 366, "420", { size: 12, anchor: "end", ls: 1 })}
      ${ring(440, 360, 66, { op: 0.28, dash: "5 9" })}${ring(440, 360, 26, { op: 0.55 })}${dot(440, 360, 7, { op: 0.9 })}
    </g>
    ${label(150, 220, "05 / ÖZEL", { size: 15 })}
    ${label(1050, 220, "ÖLÇÜYE GÖRE", { size: 15, anchor: "end" })}
    ${line(150, 1030, 1050, 1030, { op: 0.2 })}
    ${label(150, 1072, "KOD TAMAMEN SİZİN", { size: 14 })}
  `,

  /* 06 — Yapay zekâ: nöron ağı (4 katman, sağda tek çıktı) */
  "yapay-zeka": (() => {
    const layers = [
      { x: 200, n: 4, r: 13 },
      { x: 460, n: 5, r: 17 },
      { x: 720, n: 5, r: 17 },
      { x: 960, n: 1, r: 30 },
    ];
    const ys = (n) =>
      Array.from({ length: n }, (_, j) => 560 + (j - (n - 1) / 2) * 118);

    const edges = layers
      .slice(0, -1)
      .map((L, i) => {
        const R = layers[i + 1];
        return ys(L.n)
          .map((y1) =>
            ys(R.n)
              .map((y2) =>
                line(L.x, y1, R.x, y2, {
                  op: i === 2 ? 0.2 : 0.11,
                  sw: 1.1,
                }),
              )
              .join(""),
          )
          .join("");
      })
      .join("");

    const nodes = layers
      .map(({ x, n, r }, i) =>
        ys(n)
          .map((y) =>
            i === 3
              ? `${ring(x, y, r + 26, { op: 0.22, dash: "3 10" })}${ring(x, y, r + 14, { op: 0.45 })}${dot(x, y, r, { op: 0.95 })}`
              : `${ring(x, y, r + 9, { op: 0.2 })}${dot(x, y, r, { op: i === 0 ? 0.45 : 0.6 })}`,
          )
          .join(""),
      )
      .join("");

    return `
    <g transform="translate(720 560)">
      ${ring(0, 0, 330, { op: 0.1, dash: "3 12" })}
      ${ring(0, 0, 245, { op: 0.12 })}
    </g>
    ${edges}
    ${nodes}
    ${label(200, 830, "GİRDİ", { size: 13, anchor: "middle", fill: S3 })}
    ${label(590, 830, "GİZLİ KATMAN", { size: 13, anchor: "middle", fill: S3 })}
    ${label(960, 830, "ÇIKTI", { size: 13, anchor: "middle", fill: S3 })}
    ${label(150, 250, "06 / MODEL", { size: 15 })}
    ${label(1050, 250, "RAG · AGENT", { size: 15, anchor: "end" })}
    ${surface(310, 880, 580, 92, { r: 46, op: 0.06 })}
    ${panel(310, 880, 580, 92, { r: 46, op: 0.4 })}
    ${label(352, 934, "PROMPT →", { size: 16, fill: S2, ls: 3 })}
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${508 + i * 62}" y="915" width="${44 - i * 4}" height="22" rx="11" fill="${S}" fill-opacity="${0.5 - i * 0.08}"/>`).join("")}
    ${line(150, 1046, 1050, 1046, { op: 0.2 })}
    ${label(150, 1088, "KENDİ VERİNİZLE", { size: 14 })}
  `;
  })(),

  /* 07 — SaaS: katmanlı kiracılar + abonelik döngüsü */
  "saas": `
    <g transform="translate(600 470)">
      ${[0, 1, 2]
        .map((i) => {
          const y = i * 150;
          const o = 0.7 - i * 0.18;
          return `<g transform="translate(0 ${y})"><path d="M0 -110L330 60L0 230L-330 60Z" fill="${S}" fill-opacity="${0.05 - i * 0.012}" stroke="${S}" stroke-opacity="${o}" stroke-width="1.8"/>${label(-190, 74 + 0, ["TENANT A", "TENANT B", "TENANT C"][i], { size: 13, fill: S3 })}</g>`;
        })
        .join("")}
    </g>
    ${[0, 1, 2, 3].map((i) => `<rect x="${790 + i * 62}" y="${1060 - i * 46}" width="42" height="${52 + i * 46}" rx="6" fill="${S}" fill-opacity="${0.2 + i * 0.16}"/>`).join("")}
    ${label(790, 1102, "MRR", { size: 14 })}
    <path d="M300 1060a86 86 0 1 0 86-86" fill="none" stroke="${S}" stroke-opacity=".5" stroke-width="1.8" marker-end="url(#head)"/>
    ${label(214, 1102, "AYLIK DÖNGÜ", { size: 13 })}
    ${label(150, 250, "07 / SAAS", { size: 15 })}
    ${label(1050, 250, "ÇOK KİRACILI", { size: 15, anchor: "end" })}
    ${line(150, 1020, 1050, 1020, { op: 0.2 })}
    ${label(150, 1062, "ABONELİK · FATURALAMA", { size: 14 })}
  `,

  /* 08 — Masaüstü uygulaması: üst üste OS pencereleri */
  "masaustu-uygulama": `
    <g opacity=".3" transform="translate(120 250)">
      ${panel(0, 0, 760, 500, { r: 14, op: 0.5 })}${titlebar(0, 0, 760)}
    </g>
    <g opacity=".55" transform="translate(200 330)">
      ${surface(0, 0, 780, 520, { r: 14, op: 0.05 })}${panel(0, 0, 780, 520, { r: 14, op: 0.55 })}${titlebar(0, 0, 780)}
    </g>
    <g transform="translate(276 412)">
      ${surface(0, 0, 800, 540, { r: 14, op: 0.08 })}
      ${panel(0, 0, 800, 540, { r: 14, op: 0.75, sw: 2 })}
      ${titlebar(0, 0, 800, { pill: "monolit-desktop" })}
      ${line(230, 54, 230, 540, { op: 0.28 })}
      ${[0, 1, 2, 3, 4, 5, 6]
        .map(
          (i) =>
            `${line(196, 96 + i * 54, 210, 96 + i * 54, { op: 0.25 })}${bars(30 + (i % 3) * 18, 90 + i * 54, [120 - (i % 3) * 20], { h: 9, op: i === 2 ? 0.45 : 0.2 })}`,
        )
        .join("")}
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `${label(262, 100 + i * 50, String(i + 1).padStart(2, "0"), { size: 12, fill: S3, ls: 1 })}${bars(310, 90 + i * 50, [[380, 300, 460, 220, 400, 340, 480, 260, 360][i]], { h: 9, op: 0.16 + (i % 3) * 0.08 })}`).join("")}
    </g>
    ${label(150, 218, "08 / MASAÜSTÜ", { size: 15 })}
    ${label(1050, 218, "macOS · WINDOWS", { size: 15, anchor: "end" })}
    ${line(150, 1030, 1050, 1030, { op: 0.2 })}
    ${label(150, 1072, "ÇEVRİMDIŞI ÇALIŞIR", { size: 14 })}
  `,

  /* 09 — API & entegrasyon: uç noktalar → servisler */
  "api-entegrasyon": `
    <g transform="translate(120 300)">
      ${["GET", "POST", "PUT", "DEL"]
        .map(
          (m, i) =>
            `${panel(0, i * 116, 300, 84, { op: 0.42 })}${label(24, 52 + i * 116, m, { size: 16, fill: S, ls: 2 })}${bars(110, 40 + i * 116, [150, 100], { h: 7, gap: 10, op: 0.2 })}`,
        )
        .join("")}
      ${[0, 1, 2, 3]
        .map(
          (i) =>
            `<path d="M300 ${42 + i * 116}C440 ${42 + i * 116} 480 ${60 + [0, 120, 240, 360][i]} 620 ${60 + [0, 120, 240, 360][i]}" fill="none" stroke="${S}" stroke-opacity=".3" stroke-width="1.6"/>${dot(300, 42 + i * 116, 5, { op: 0.6 })}`,
        )
        .join("")}
      ${[0, 1, 2, 3]
        .map(
          (i) =>
            `${ring(660, 60 + i * 120, 30, { op: 0.45 })}${dot(660, 60 + i * 120, 10, { op: 0.7 })}${label(710, 66 + i * 120, ["ERP", "CRM", "ÖDEME", "KARGO"][i], { size: 14, fill: S2, ls: 3 })}`,
        )
        .join("")}
    </g>
    ${surface(150, 852, 900, 150, { r: 14, op: 0.05 })}
    ${panel(150, 852, 900, 150, { r: 14, op: 0.35 })}
    ${label(186, 900, "{", { size: 22, fill: S2, ls: 0 })}
    ${label(216, 900, '"status": 200,', { size: 15, fill: S2, ls: 1 })}
    ${label(216, 934, '"sync": "ok",', { size: 15, fill: S3, ls: 1 })}
    ${label(216, 968, '"latency_ms": 84', { size: 15, fill: S3, ls: 1 })}
    ${label(186, 992, "}", { size: 22, fill: S2, ls: 0 })}
    ${label(150, 262, "09 / API", { size: 15 })}
    ${label(1050, 262, "REST · WEBHOOK", { size: 15, anchor: "end" })}
  `,

  /* 10 — İş süreci otomasyonu: akış şeması */
  "otomasyon": `
    <g transform="translate(150 280)">
      ${ring(140, 60, 52, { op: 0.5 })}${dot(140, 60, 12, { op: 0.85 })}${label(140, 152, "TETİK", { size: 13, anchor: "middle" })}
      ${arrow(192, 60, 388, 60)}
      <path d="M480 0L560 60L480 120L400 60Z" fill="${S}" fill-opacity=".06" stroke="${S}" stroke-opacity=".55" stroke-width="1.8"/>
      ${label(480, 66, "?", { size: 24, anchor: "middle", fill: S2, ls: 0 })}
      ${label(480, 152, "KOŞUL", { size: 13, anchor: "middle" })}
      <path d="M560 60H660V240" fill="none" stroke="${S}" stroke-opacity=".4" stroke-width="1.6" marker-end="url(#head)"/>
      <path d="M480 120V300H660" fill="none" stroke="${S}" stroke-opacity=".25" stroke-width="1.6" stroke-dasharray="6 8" marker-end="url(#head)"/>
      ${panel(680, 196, 220, 88, { op: 0.45 })}${label(706, 248, "E-POSTA", { size: 14, fill: S2 })}
      ${panel(680, 396, 220, 88, { op: 0.35 })}${label(706, 448, "KAYIT AÇ", { size: 14, fill: S2 })}
      <path d="M660 300V440H676" fill="none" stroke="${S}" stroke-opacity=".25" stroke-width="1.6" marker-end="url(#head)"/>
      ${[0, 1, 2, 3, 4]
        .map(
          (i) =>
            `${panel(0, 300 + i * 76, 460, 58, { op: 0.22 })}${dot(34, 329 + i * 76, 7, { op: i < 3 ? 0.7 : 0.2 })}${bars(64, 325 + i * 76, [220 - i * 22], { h: 8, op: 0.18 })}${label(430, 335 + i * 76, i < 3 ? "OK" : "…", { size: 13, anchor: "end", fill: i < 3 ? S2 : S3 })}`,
        )
        .join("")}
      ${ring(820, 610, 46, { op: 0.35, dash: "4 8" })}<path d="M820 578v34l24 14" fill="none" stroke="${S}" stroke-opacity=".6" stroke-width="2"/>
    </g>
    ${label(150, 250, "10 / AKIŞ", { size: 15 })}
    ${label(1050, 250, "MANUEL İŞ − %70", { size: 15, anchor: "end" })}
    ${line(150, 1020, 1050, 1020, { op: 0.2 })}
    ${label(150, 1062, "TETİK → KOŞUL → AKSİYON", { size: 14 })}
  `,

  /* 11 — SEO: arama sonuçları + yükselen trafik */
  "seo": `
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${196 + i * 118}" y="${900 - (90 + i * i * 9)}" width="72" height="${90 + i * i * 9}" rx="6" fill="${S}" fill-opacity="${0.08 + i * 0.03}"/>`).join("")}
    <g transform="translate(160 268)">
      ${surface(0, 0, 880, 96, { r: 48, op: 0.06 })}
      ${panel(0, 0, 880, 96, { r: 48, op: 0.55 })}
      ${ring(62, 48, 20, { op: 0.7 })}${line(76, 62, 92, 78, { op: 0.7, sw: 2.4 })}
      ${bars(122, 40, [330], { h: 16, op: 0.3 })}
      ${label(820, 56, "ARA", { size: 14, fill: S2 })}
      ${[0, 1, 2]
        .map((i) => {
          const y = 150 + i * 148;
          const first = i === 0;
          return `${surface(0, y, 880, 122, { r: 12, op: first ? 0.09 : 0.03 })}${panel(0, y, 880, 122, { op: first ? 0.6 : 0.24 })}${label(30, y + 46, first ? "#1" : `#${i + 1}`, { size: 15, fill: first ? S : S3, ls: 1 })}${bars(80, y + 30, [first ? 420 : 320], { h: 16, op: first ? 0.5 : 0.22 })}${bars(80, y + 66, [640, 480], { h: 8, gap: 12, op: 0.16 })}${first ? `${ring(820, y + 60, 26, { op: 0.5 })}<path d="M808 66l10 10 20-24" fill="none" stroke="${S}" stroke-opacity=".9" stroke-width="2.4" transform="translate(0 ${y})"/>` : ""}`;
        })
        .join("")}
    </g>
    ${label(150, 236, "11 / ORGANİK", { size: 15 })}
    ${label(1050, 236, "CTR %8,4", { size: 15, anchor: "end" })}
    ${line(150, 940, 1050, 940, { op: 0.25 })}
    ${label(150, 982, "TEKNİK SEO · İÇERİK", { size: 14 })}
    ${label(1050, 982, "12 AY", { size: 14, anchor: "end" })}
  `,

  /* 12 — Reklam: huni + hedef */
  "reklam": `
    <g transform="translate(600 300)">
      ${[0, 1, 2, 3]
        .map((i) => {
          const w = 420 - i * 90;
          const y = i * 132;
          return `<path d="M${-w / 2} ${y}L${w / 2} ${y}L${(w - 90) / 2} ${y + 108}L${-(w - 90) / 2} ${y + 108}Z" fill="${S}" fill-opacity="${0.05 + i * 0.05}" stroke="${S}" stroke-opacity="${0.3 + i * 0.14}" stroke-width="1.6"/>${label(w / 2 + 40, y + 66, ["GÖSTERİM", "TIKLAMA", "İLGİ", "SATIŞ"][i], { size: 13, fill: S3 })}${label(-w / 2 - 40, y + 66, ["120K", "9.4K", "1.8K", "312"][i], { size: 14, fill: S2, anchor: "end", ls: 1 })}`;
        })
        .join("")}
    </g>
    <g transform="translate(600 930)">
      ${ring(0, 0, 118, { op: 0.2, dash: "4 10" })}${ring(0, 0, 82, { op: 0.32 })}${ring(0, 0, 46, { op: 0.5 })}${dot(0, 0, 14, { op: 0.95 })}
      ${line(-150, 0, -130, 0, { op: 0.5 })}${line(130, 0, 150, 0, { op: 0.5 })}${line(0, -150, 0, -130, { op: 0.5 })}${line(0, 130, 0, 150, { op: 0.5 })}
    </g>
    ${["CTR %3,2", "CPC ₺1,84", "ROAS 4,6x"].map((t, i) => `${panel(150 + i * 0, 0, 0, 0)}${panel(806, 812 + i * 62, 244, 48, { r: 24, op: 0.35 })}${label(828, 843 + i * 62, t, { size: 14, fill: S2, ls: 2 })}`).join("")}
    ${label(150, 250, "12 / REKLAM", { size: 15 })}
    ${label(1050, 250, "GOOGLE · META", { size: 15, anchor: "end" })}
  `,

  /* 13 — Sosyal medya: akış + içerik takvimi */
  "sosyal-medya": `
    <g transform="translate(140 262)">
      ${[0, 1, 2]
        .map((i) => {
          const y = i * 226;
          return `${surface(0, y, 520, 200, { r: 14, op: 0.05 })}${panel(0, y, 520, 200, { r: 14, op: 0.45 })}${ring(46, y + 46, 22, { op: 0.5 })}${bars(84, y + 32, [140, 90], { h: 9, gap: 10, op: 0.24 })}${surface(24, y + 86, 472, 60, { r: 8, op: 0.09 })}${[0, 1, 2].map((k) => `${ring(52 + k * 96, y + 172, 12, { op: 0.4 })}${bars(72 + k * 96, y + 167, [38], { h: 8, op: 0.2 })}`).join("")}`;
        })
        .join("")}
    </g>
    <g transform="translate(716 300)">
      ${label(0, -22, "İÇERİK TAKVİMİ", { size: 13 })}
      ${["P", "S", "Ç", "P", "C", "C", "P"].map((d, i) => label(24 + (i % 4) * 84, 16, d, { size: 12, anchor: "middle", ls: 0 })).join("")}
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        .map((i) => {
          const x = (i % 4) * 84;
          const y = 40 + Math.floor(i / 4) * 92;
          const on = [1, 3, 6, 9, 10, 14].includes(i);
          return `${panel(x, y, 68, 68, { r: 10, op: on ? 0.6 : 0.18 })}${on ? surface(x + 14, y + 14, 40, 40, { r: 6, op: 0.35 }) : ""}`;
        })
        .join("")}
      ${[0, 1, 2].map((i) => `${line(0, 448 + i * 56, 320, 448 + i * 56, { op: 0.14 })}${bars(0, 424 + i * 56, [120 + i * 40], { h: 10, op: 0.26 })}${label(320, 434 + i * 56, ["+%38", "+%12", "+%54"][i], { size: 13, fill: S2, anchor: "end", ls: 1 })}`).join("")}
    </g>
    ${label(150, 232, "13 / SOSYAL", { size: 15 })}
    ${label(1050, 232, "ETKİLEŞİM", { size: 15, anchor: "end" })}
    ${line(150, 1020, 1050, 1020, { op: 0.2 })}
    ${label(150, 1062, "PLAN · ÜRETİM · RAPOR", { size: 14 })}
  `,

  /* 14 — UI/UX: tasarım tuvali */
  "ui-ux": `
    <g transform="translate(150 310)">
      ${label(0, -18, "ARTBOARD 1440×900", { size: 13 })}
      ${surface(0, 0, 620, 460, { r: 12, op: 0.05 })}
      ${panel(0, 0, 620, 460, { r: 12, op: 0.55 })}
      ${[1, 2, 3, 4, 5].map((i) => line(i * 103, 0, i * 103, 460, { op: 0.12 })).join("")}
      ${[1, 2, 3].map((i) => line(0, i * 115, 620, i * 115, { op: 0.12 })).join("")}
      ${surface(40, 40, 540, 150, { r: 8, op: 0.12 })}${panel(40, 40, 540, 150, { op: 0.35 })}
      ${bars(70, 80, [280, 190], { h: 16, gap: 14, op: 0.35 })}
      ${[0, 1, 2].map((i) => `${panel(40 + i * 186, 230, 168, 130, { op: 0.28 })}${surface(58 + i * 186, 248, 60, 60, { r: 8, op: 0.14 })}${bars(58 + i * 186, 322, [110], { h: 7, op: 0.2 })}`).join("")}
      <rect x="40" y="392" width="150" height="36" rx="18" fill="${S}" fill-opacity=".8"/>
      ${panel(206, 392, 130, 36, { r: 18, op: 0.4 })}
      ${line(-24, 40, -24, 190, { op: 0.3 })}${line(-32, 40, -16, 40, { op: 0.3 })}${line(-32, 190, -16, 190, { op: 0.3 })}
      ${label(-40, 122, "150", { size: 12, anchor: "end", ls: 1 })}
      <path d="M470 300l0 64 16-16 12 26 12-6-12-26 22-2z" fill="${S}" fill-opacity=".9"/>
    </g>
    <g transform="translate(830 348)">
      ${label(0, -18, "TİPO ÖLÇEĞİ", { size: 13 })}
      <text x="0" y="72" fill="${S}" fill-opacity=".85" font-family="Menlo, monospace" font-size="72">Aa</text>
      <text x="0" y="132" fill="${S}" fill-opacity=".6" font-family="Menlo, monospace" font-size="44">Aa</text>
      <text x="0" y="176" fill="${S}" fill-opacity=".4" font-family="Menlo, monospace" font-size="28">Aa</text>
      ${label(0, 236, "PALET", { size: 13 })}
      ${[0.95, 0.7, 0.45, 0.25, 0.12].map((o, i) => `<rect x="${i * 42}" y="256" width="34" height="34" rx="8" fill="${S}" fill-opacity="${o}"/>`).join("")}
      ${label(0, 348, "BİLEŞEN", { size: 13 })}
      ${[0, 1, 2, 3].map((i) => `${panel(0, 368 + i * 58, 214, 42, { r: 10, op: 0.3 })}${bars(18, 383 + i * 58, [90 + i * 20], { h: 8, op: 0.2 })}`).join("")}
    </g>
    ${label(150, 232, "14 / TASARIM", { size: 15 })}
    ${label(1050, 232, "8PT GRID", { size: 15, anchor: "end" })}
    ${line(150, 1010, 1050, 1010, { op: 0.2 })}
    ${label(150, 1052, "AKIŞ · PROTOTİP · SİSTEM", { size: 14 })}
  `,

  /* 15 — Bakım, bulut & destek: bulut + uptime */
  "bakim-destek": `
    <g transform="translate(600 400)">
      <path d="M-250 60a110 110 0 0 1 92-108 150 150 0 0 1 290 26 92 92 0 0 1-14 182h-296a90 90 0 0 1-72-100z" fill="${S}" fill-opacity=".05" stroke="${S}" stroke-opacity=".6" stroke-width="2"/>
      ${[0, 1, 2].map((i) => `${panel(-170 + 0, -10 + i * 58, 340, 44, { r: 8, op: 0.3 })}${dot(-140, 12 + i * 58, 7, { op: 0.7 })}${bars(-112, 8 + i * 58, [150 - i * 30], { h: 8, op: 0.2 })}${label(140, 18 + i * 58, "OK", { size: 12, anchor: "end", fill: S2, ls: 1 })}`).join("")}
    </g>
    <g transform="translate(150 700)">
      ${label(0, -20, "ÇALIŞMA SÜRESİ", { size: 13 })}
      ${panel(0, 0, 900, 210, { r: 12, op: 0.35 })}
      ${[0, 1, 2].map((i) => line(0, 52 + i * 52, 900, 52 + i * 52, { op: 0.1, dash: "3 9" })).join("")}
      <polyline points="30,150 130,140 230,146 330,96 430,104 530,64 630,72 730,44 870,38" fill="none" stroke="${S}" stroke-opacity=".8" stroke-width="2.6"/>
      <polyline points="30,150 130,140 230,146 330,96 430,104 530,64 630,72 730,44 870,38 870,186 30,186" fill="${S}" fill-opacity=".07"/>
      <text x="870" y="180" fill="${S}" fill-opacity=".85" font-family="Menlo, monospace" font-size="26" text-anchor="end">%99,9</text>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => `<rect x="${30 + i * 70}" y="230" width="52" height="16" rx="8" fill="${S}" fill-opacity="${i === 7 ? 0.28 : 0.6}"/>`).join("")}
    </g>
    <g transform="translate(940 260)">
      <path d="M0 0l58 22v40c0 34-24 62-58 74-34-12-58-40-58-74V22z" fill="${S}" fill-opacity=".07" stroke="${S}" stroke-opacity=".55" stroke-width="1.8"/>
      <path d="M-22 58l16 18 30-38" fill="none" stroke="${S}" stroke-opacity=".9" stroke-width="3"/>
    </g>
    ${label(150, 240, "15 / DESTEK", { size: 15 })}
    ${label(1050, 1010, "YEDEK · İZLEME", { size: 14, anchor: "end" })}
    ${label(150, 1010, "7/24 NÖBET", { size: 14 })}
  `,
};
