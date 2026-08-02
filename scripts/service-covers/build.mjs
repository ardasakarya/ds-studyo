/**
 * HTML → PNG (headless Chrome) → WebP (cwebp) üretim hattı.
 * Çıktı: ajans-site/public/services/<slug>.webp          (koyu tema, 1200x1500)
 *        ajans-site/public/services/<slug>-aydinlik.webp (aydınlık tema)
 *
 * Sahneler (scenes.mjs) tek palette yazılıyor; aydınlık sürüm o üç kum tonunu
 * mürekkep tonlarıyla değiştirip zemini kâğıda çevirerek üretiliyor.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scenes } from "./scenes.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const work = join(here, ".work");
const out = join(here, "..", "..", "public", "services");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

mkdirSync(work, { recursive: true });
mkdirSync(out, { recursive: true });

/** scenes.mjs'teki kum tonları (S, S2, S3) — aydınlık sürümde eşlenir. */
const SAND = ["#e6ddaa", "#a89f78", "#6f6949"];

const THEMES = {
  dark: {
    suffix: "",
    bg: "#07070a",
    ink: SAND,
    glow: "#e6ddaa",
    gridOpacity: 0.055,
    grainOpacity: 0.07,
    grainBlend: "overlay",
  },
  light: {
    suffix: "-aydinlik",
    /* globals.css aydınlık paleti: kâğıt zemin + mürekkep çizgiler */
    bg: "#f4f1e6",
    ink: ["#16150d", "#4a4634", "#767052"],
    glow: "#ffffff",
    gridOpacity: 0.09,
    grainOpacity: 0.05,
    grainBlend: "multiply",
  },
};

/** Sahne gövdesindeki kum tonlarını temanın mürekkep tonlarına çevirir. */
const paint = (scene, theme) =>
  SAND.reduce(
    (svg, hex, i) => svg.replaceAll(hex, theme.ink[i]),
    scene,
  );

const page = (scene, t) => `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:${t.bg}}
  svg{display:block}
</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
  <defs>
    <radialGradient id="glow" cx="50%" cy="42%" r="62%">
      <stop offset="0" stop-color="${t.glow}" stop-opacity=".17"/>
      <stop offset="50%" stop-color="${t.glow}" stop-opacity=".04"/>
      <stop offset="100%" stop-color="${t.glow}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M60 0H0V60" fill="none" stroke="${t.ink[0]}" stroke-opacity="${t.gridOpacity}" stroke-width="1"/>
    </pattern>
    <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset=".45" stop-color="${t.bg}" stop-opacity="0"/>
      <stop offset="1" stop-color="${t.bg}" stop-opacity=".9"/>
    </linearGradient>
    <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.bg}" stop-opacity=".75"/>
      <stop offset="1" stop-color="${t.bg}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="vignette" cx="50%" cy="45%" r="72%">
      <stop offset=".55" stop-color="${t.bg}" stop-opacity="0"/>
      <stop offset="1" stop-color="${t.bg}" stop-opacity=".8"/>
    </radialGradient>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3"/><feColorMatrix type="saturate" values="0"/></filter>
    <!-- Sahnenin tamamını biraz daha okunur yapar (alfa yükseltme) -->
    <filter id="lift" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
      <feComponentTransfer><feFuncA type="linear" slope="1.5"/></feComponentTransfer>
    </filter>
    <marker id="head" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0 1L11 6L0 11" fill="none" stroke="${t.ink[0]}" stroke-opacity=".8" stroke-width="1.6"/>
    </marker>
  </defs>

  <rect width="1200" height="1500" fill="${t.bg}"/>
  <rect width="1200" height="1500" fill="url(#grid)"/>
  <rect width="1200" height="1500" fill="url(#glow)"/>

  <!-- Kart dar kadrajda (0.62) yandan kırpıldığı için sahne %12 küçültülür -->
  <g transform="translate(600 830) scale(.88) translate(-600 -740)" filter="url(#lift)">
    ${paint(scene, t)}
  </g>

  <rect width="1200" height="1500" fill="url(#vignette)"/>
  <rect width="1200" height="260" fill="url(#topFade)"/>
  <rect y="1080" width="1200" height="420" fill="url(#bottomFade)"/>
  <rect width="1200" height="1500" filter="url(#grain)" opacity="${t.grainOpacity}" style="mix-blend-mode:${t.grainBlend}"/>
</svg>
</body></html>`;

const only = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const themeArg = process.argv.includes("--dark")
  ? ["dark"]
  : process.argv.includes("--light")
    ? ["light"]
    : ["dark", "light"];

const list = Object.keys(scenes).filter((s) => only.length === 0 || only.includes(s));

for (const slug of list) {
  for (const themeName of themeArg) {
    const t = THEMES[themeName];
    const name = `${slug}${t.suffix}`;
    const html = join(work, `${name}.html`);
    const png = join(work, `${name}.png`);
    writeFileSync(html, page(scenes[slug], t));

    execFileSync(
      CHROME,
      [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        "--window-size=1200,1500",
        "--virtual-time-budget=3000",
        "--no-first-run",
        "--no-default-browser-check",
        `--screenshot=${png}`,
        `file://${html}`,
      ],
      { stdio: "ignore" },
    );

    execFileSync("cwebp", ["-q", "86", "-m", "6", png, "-o", join(out, `${name}.webp`)], {
      stdio: "ignore",
    });
    console.log("✓", name);
  }
}

console.log(`\n${list.length * themeArg.length} kapak → ${out}`);
