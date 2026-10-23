/* Étiquettes Maison Sillage, rendues en haute définition.

     node --no-warnings scripts/images/labels.mjs            # toutes les étiquettes
     node --no-warnings scripts/images/labels.mjs <slug> ... # quelques-unes

   Une seule maquette pour toute la gamme : le logo d'origine (public/brand/logo-light.png),
   les typographies du site et un papier réel. Seuls changent le nom de la saveur, la ligne
   de collection et la couleur du cachet. Aucun texte n'est produit par génération d'image.
   Sortie : assets/composed/labels/<slug>.png (1080 × 2250 px, fond transparent). */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";
import { products } from "../../data/products.ts";
import { getSeason } from "../../data/collections.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = path.join(ROOT, "assets/composed/labels");
const file = (p) => pathToFileURL(path.join(ROOT, p)).href;

/* Gabarit : 360 × 750 unités, épaule en gradin et arcs en tête et en pied */
const W = 360;
const H = 750;
const OUTLINE =
  "M0 66 L0 46 Q0 38 8 38 L36 38 C78 38 128 10 180 6 C232 10 282 38 324 38 L352 38 Q360 38 360 46 L360 704 Q360 712 352 712 L324 712 C282 712 232 740 180 744 C128 740 78 712 36 712 L8 712 Q0 712 0 704 Z";
const BORDER =
  "M12 70 L12 56 Q12 50 18 50 L40 50 C80 50 128 24 180 20 C232 24 280 50 320 50 L342 50 Q348 50 348 56 L348 694 Q348 700 342 700 L320 700 C280 700 232 726 180 730 C128 726 80 700 40 700 L18 700 Q12 700 12 694 Z";

function linesFor(p) {
  if (p.slug === "coffret-decouverte") {
    return { l1: "Coffret", l2: "découverte", collection: "L'Atelier de la Maison", kind: "Assortiment de dégustation" };
  }
  if (p.category === "essentiel") {
    const split = {
      "chocolat-noir-intense": ["Chocolat noir", "intense"],
      "chocolat-au-lait-onctueux": ["Chocolat au lait", "onctueux"],
      "chocolat-blanc": ["Chocolat", "blanc"],
      "vanille-bourbon": ["Vanille", "Bourbon"],
      "caramel-beurre-sale": ["Caramel", "beurre salé"],
      "noisette-grillee": ["Noisette", "grillée"],
      "pistache-classique": ["Pistache", "classique"],
      "chai-epice-classique": ["Chaï épicé", "classique"],
    }[p.slug];
    return { l1: split[0], l2: split[1], collection: "Les Essentiels de la Maison", kind: "Préparation pour boissons" };
  }
  const collection =
    p.season ? `Les Quatre Saisons · ${getSeason(p.season).name}` : p.category === "sirop" ? "Les Signatures de la Maison" : "Poudre signature de la Maison";
  return { l1: p.label[0], l2: p.label[1], collection, kind: p.category === "sirop" ? "Sirop gourmet" : "Préparation gourmande" };
}

function html(p) {
  const { l1, l2, collection, kind } = linesFor(p);
  const seal = p.palette.accent;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: "Cormorant"; src: url("${file("node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2")}"); font-weight: 500; }
@font-face { font-family: "Cormorant"; src: url("${file("node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2")}"); font-weight: 600; }
@font-face { font-family: "Cormorant"; src: url("${file("node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2")}"); font-weight: 400; font-style: italic; }
@font-face { font-family: "Manrope"; src: url("${file("node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2")}"); font-weight: 200 800; }
html, body { margin: 0; background: transparent; }
#label { position: relative; width: ${W}px; height: ${H}px; clip-path: path("${OUTLINE}"); color: #2a1c12; }
#paper { position: absolute; inset: 0; background: #f3e7d2 url("${file("assets/stock/fond-papier.jpg")}") center / 900px auto; }
#paper::after { content: ""; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% 45%, rgba(255,250,240,.55), rgba(222,204,174,.25) 70%, rgba(196,170,130,.35)); }
svg.frame { position: absolute; inset: 0; }
.logo { position: absolute; left: 50%; top: 44px; width: 250px; transform: translateX(-50%); }
.rule { position: absolute; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 9px; color: #8a6534; }
.rule i { display: block; height: 1px; width: 74px; background: currentColor; opacity: .85; }
.rule b { display: block; width: 7px; height: 7px; border-radius: 50%; background: ${seal}; box-shadow: 0 0 0 1.5px #f3e7d2, 0 0 0 2.4px #8a6534; }
.coll { position: absolute; left: 0; right: 0; text-align: center; font: 600 7.6px/1 "Manrope"; letter-spacing: .26em; text-transform: uppercase; color: #6b4a26; }
.name { position: absolute; left: 30px; right: 30px; text-align: center; text-transform: uppercase; }
.l1 { font: 600 34px/1.02 "Cormorant"; letter-spacing: .035em; white-space: nowrap; display: inline-block; }
.l2 { font: 500 21px/1.1 "Cormorant"; letter-spacing: .06em; white-space: nowrap; display: inline-block; margin-top: 6px; }
.kind { position: absolute; left: 0; right: 0; text-align: center; font: 600 12.5px/1 "Cormorant"; letter-spacing: .24em; text-transform: uppercase; color: #3d2a1a; }
.sprig { position: absolute; left: 50%; transform: translateX(-50%); }
</style></head><body>
<div id="label">
  <div id="paper"></div>
  <svg class="frame" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <path d="${BORDER}" fill="none" stroke="#8a6534" stroke-width="1.1"/>
    <path d="${BORDER}" fill="none" stroke="#8a6534" stroke-width=".5" transform="translate(180 375) scale(.972 .985) translate(-180 -375)"/>
  </svg>
  <img class="logo" src="${file("public/brand/logo-light.png")}">
  <div class="rule" style="top: 336px"><i></i><b></b><i></i></div>
  <div class="coll" style="top: 360px">${collection}</div>
  <div class="name" style="top: 404px"><span class="l1" id="l1">${l1}</span><br><span class="l2" id="l2">${l2}</span></div>
  <svg class="sprig" style="top: 524px" width="120" height="18" viewBox="0 0 120 18"><path d="M4 9 H46 M74 9 H116" stroke="#8a6534" stroke-width=".9"/><path d="M60 3 C55 6 55 12 60 15 C65 12 65 6 60 3 Z" fill="none" stroke="#8a6534" stroke-width=".9"/><path d="M50 9 C53 6 56 6 58 9 C56 12 53 12 50 9 Z M70 9 C67 6 64 6 62 9 C64 12 67 12 70 9 Z" fill="#8a6534" opacity=".8"/></svg>
  <div class="kind" style="top: 566px">${kind}</div>
  <svg class="sprig" style="top: 628px" width="70" height="10" viewBox="0 0 70 10"><path d="M2 5 H28 M42 5 H68" stroke="#8a6534" stroke-width=".8"/><path d="M35 1 L39 5 L35 9 L31 5 Z" fill="#8a6534"/></svg>
</div>
<script>
  // le nom tient toujours dans la largeur utile : la taille s'ajuste, la maquette ne bouge pas
  for (const [id, max] of [["l1", 292], ["l2", 288]]) {
    const el = document.getElementById(id);
    let size = parseFloat(getComputedStyle(el).fontSize);
    while (el.getBoundingClientRect().width > max && size > 12) { size -= 0.5; el.style.fontSize = size + "px"; }
  }
</script>
</body></html>`;
}

const wanted = process.argv.slice(2);
const list = products.filter((p) => (["sirop", "poudre", "essentiel"].includes(p.category) || p.slug === "coffret-decouverte") && (!wanted.length || wanted.includes(p.slug)));
fs.mkdirSync(OUT, { recursive: true });
const exe = [process.env.CHROME_PATH, path.join(process.env.LOCALAPPDATA ?? "", "ms-playwright/chromium-1243/chrome-win64/chrome.exe")].find((p) => p && fs.existsSync(p));
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: W + 40, height: H + 40 }, deviceScaleFactor: 3 });
for (const p of list) {
  // page écrite sur disque : une page file:// peut charger le logo, les polices et le papier locaux
  const tmp = path.join(OUT, `_${p.slug}.html`);
  fs.writeFileSync(tmp, html(p));
  await page.goto(pathToFileURL(tmp).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(80);
  await page.locator("#label").screenshot({ path: path.join(OUT, `${p.slug}.png`), omitBackground: true });
  fs.rmSync(tmp);
  process.stdout.write(`  ✓ ${p.slug}\n`);
}
await browser.close();
console.log(`${list.length} étiquettes dans assets/composed/labels`);
