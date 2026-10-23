/* Parcours utilisateurs de bout en bout : ambiances, boutique (rayons, filtres, recherche,
   chargement progressif), fiche produit et devis, panier, favoris, commande simulée,
   Comptoir des Saveurs, recherche globale, formulaire pro, menu mobile, mouvement réduit,
   redirections des anciennes adresses.

   node scripts/qa/parcours.cjs http://localhost:3000 */
const { launch, BASE } = require("./browser.cjs");

let failures = 0;
const check = (cond, msg) => {
  if (!cond) failures++;
  console.log(`  ${cond ? "✓" : "✗"} ${msg}`);
};
const ambiance = (p) => p.evaluate(() => `${document.documentElement.dataset.season}/${document.documentElement.dataset.light}`);
const cards = (p) => p.locator("main ul article").count();
/** options du sélecteur d'ambiance (le Comptoir des Saveurs a aussi des boutons de saison) */
const opt = (p, sel) => p.getByLabel("Choisir l'ambiance du site").locator(sel);

async function ambiances(b, vp) {
  console.log(`AMBIANCES — ${vp.n}`);
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.w < 800, hasTouch: vp.w < 800 });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  check((await ambiance(p)) === "ete/coucher", "premier chargement : été au coucher du soleil");
  const h1 = await p.evaluate(() => document.querySelector("h1").innerText.replace(/\s+/g, " ").trim());
  check(h1 === "Des saveurs qui traversent le temps.", `titre du hero rendu une seule fois (« ${h1} »)`);
  await p.getByRole("button", { name: /Changer d'ambiance/ }).click();
  await opt(p, 'label:has(input[value="nuit"])').click();
  await p.waitForTimeout(2200);
  check((await ambiance(p)) === "ete/nuit", "lumière → nuit");
  await opt(p, 'label:has(input[value="hiver"])').click();
  await p.waitForTimeout(2200);
  check((await ambiance(p)) === "hiver/nuit", "saison → hiver (combinaison hiver de nuit)");
  await p.keyboard.press("Escape");
  const stored = await p.evaluate(() => localStorage.getItem("maison-sillage:ambiance:v1"));
  check(/hiver/.test(stored) && /nuit/.test(stored), "préférence mémorisée (localStorage)");
  await p.goto(BASE + "/recettes", { waitUntil: "networkidle" });
  check((await ambiance(p)) === "hiver/nuit", "ambiance conservée sur une autre page, sans flash au chargement");
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.evaluate(() => document.querySelector("section[aria-labelledby=saisons-titre]").scrollIntoView());
  await p.waitForTimeout(800);
  await p.getByRole("tab", { name: /Printemps/ }).click();
  await p.waitForTimeout(2000);
  check((await ambiance(p)) === "printemps/nuit", "le sélecteur des saisons de l'accueil pilote l'ambiance globale");
  const tab = p.getByRole("tab", { name: /Printemps/ });
  await tab.focus();
  await p.keyboard.press("ArrowRight");
  await p.waitForTimeout(2000);
  check((await p.getByRole("tab", { name: /Été/ }).getAttribute("aria-selected")) === "true", "onglets des saisons au clavier");
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(500);
  await p.getByRole("button", { name: /Changer d'ambiance/ }).click();
  await opt(p, 'label:has(input[type="checkbox"])').click();
  await p.waitForTimeout(2200);
  check(/"auto":true/.test(await p.evaluate(() => localStorage.getItem("maison-sillage:ambiance:v1"))), `ambiance automatique activée (${await ambiance(p)})`);
  check(errs.length === 0, `aucune erreur JavaScript ${errs.length ? JSON.stringify(errs) : ""}`);
  await ctx.close();
}

async function boutique(b) {
  console.log("BOUTIQUE, FICHE, PANIER, COMMANDE — bureau");
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));

  // fiche : format grand public, quantité, ajout ; format professionnel → devis
  await p.goto(BASE + "/produits/peche-blanche-fleur-oranger", { waitUntil: "networkidle" });
  await p.getByText("Bouteille 700 ml", { exact: true }).click();
  await p.getByRole("button", { name: "Ajouter un" }).first().click();
  await p.getByRole("button", { name: "Ajouter au panier" }).first().click();
  await p.waitForTimeout(900);
  check(await p.getByRole("status").filter({ hasText: "Ajouté au panier" }).isVisible(), "confirmation d'ajout animée");
  check(await p.getByRole("button", { name: "Panier, 2 articles" }).isVisible(), "compteur du panier = 2");
  await p.getByRole("button", { name: "Voir le panier" }).click();
  const drawer = p.getByRole("dialog", { name: "Panier" });
  await p.waitForTimeout(600);
  check(await drawer.getByText("39,80 € TTC").first().isVisible(), "tiroir panier : 2 × 19,90 € TTC");
  await p.keyboard.press("Escape");
  const devis = p.getByRole("link", { name: "Demander un devis" }).first();
  check((await devis.getAttribute("href")).startsWith("/professionnels?produit=peche-blanche-fleur-oranger"), "format professionnel : lien « Demander un devis »");
  check((await p.getByRole("button", { name: /Bouteille professionnelle/ }).count()) === 0 && (await p.locator('input[value="700ml-pro"]').count()) === 0, "le format professionnel n'entre pas au panier");
  await devis.click();
  await p.waitForURL("**/professionnels**");
  await p.waitForTimeout(600);
  check(/Pêche blanche & Fleur d'oranger — Bouteille professionnelle 700 ml/.test(await p.getByLabel("Produit concerné (facultatif)").inputValue()), "formulaire pro pré-rempli depuis la fiche");

  // rayons, filtres, recherche, chargement progressif
  await p.goto(BASE + "/boutique", { waitUntil: "networkidle" });
  check((await cards(p)) === 12, "boutique : 12 premières références");
  for (let i = 0; i < 6; i++) {
    await p.mouse.wheel(0, 2600);
    await p.waitForTimeout(500);
  }
  check((await cards(p)) === 32, `chargement progressif jusqu'aux 32 références (${await cards(p)})`);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.getByRole("tab", { name: /Les Essentiels/ }).click();
  await p.waitForTimeout(800);
  check((await cards(p)) === 8, "rayon Les Essentiels : 8 références");
  await p.goto(BASE + "/boutique?categorie=poudre", { waitUntil: "networkidle" });
  check((await cards(p)) === 8, "rayon depuis l'URL : 8 poudres signatures");
  await p.getByRole("button", { name: "Filtres" }).click();
  await p.getByRole("button", { name: "Hiver" }).click();
  await p.waitForTimeout(800);
  check((await cards(p)) === 1, "filtre saison : 1 poudre d'hiver");
  await p.locator("main ul article").first().getByRole("button", { name: "Ajouter", exact: true }).click();
  await p.getByRole("button", { name: /Effacer les filtres/ }).first().click();
  await p.waitForTimeout(600);
  await p.getByRole("button", { name: "Chocolat chaud" }).click();
  await p.waitForTimeout(700);
  const choco = await cards(p);
  check(choco > 0 && choco < 8, `filtre boisson « Chocolat chaud » : ${choco} poudres`);
  await p.getByRole("button", { name: /Effacer les filtres/ }).first().click();
  await p.goto(BASE + "/boutique", { waitUntil: "networkidle" });
  await p.locator('input[type="search"]').fill("pist");
  await p.waitForTimeout(500);
  check((await p.getByRole("option").count()) > 0, "suggestions de recherche à la saisie");
  await p.locator('input[type="search"]').fill("fraise");
  await p.waitForTimeout(800);
  check((await cards(p)) === 2, "recherche dans la boutique : « fraise » → 2 références");
  await p.locator('input[type="search"]').fill("");
  await p.waitForTimeout(500);

  // cœur des cartes : centré dans sa pastille
  const off = await p.evaluate(() =>
    [...document.querySelectorAll('main ul article button[aria-pressed]')].slice(0, 12).map((btn) => {
      const a = btn.getBoundingClientRect();
      const s = btn.querySelector("svg").getBoundingClientRect();
      return Math.max(Math.abs(a.left + a.width / 2 - (s.left + s.width / 2)), Math.abs(a.top + a.height / 2 - (s.top + s.height / 2)));
    }),
  );
  check(off.length > 0 && Math.max(...off) <= 0.75, `cœur centré dans les cartes (écart max ${Math.max(...off).toFixed(2)} px)`);
  await p.getByRole("button", { name: "Ajouter Poire rôtie & Sablé noisette aux favoris" }).first().click();
  await p.goto(BASE + "/favoris", { waitUntil: "networkidle" });
  await p.waitForTimeout(500);
  check(await p.getByText("Poire rôtie & Sablé noisette").first().isVisible(), "favori conservé (page Favoris)");

  // panier et commande simulée, sans paiement
  await p.goto(BASE + "/panier", { waitUntil: "networkidle" });
  await p.reload({ waitUntil: "networkidle" });
  await p.waitForTimeout(500);
  check(await p.getByText("Sous-total particuliers").isVisible(), "panier conservé après rechargement");
  await p.getByRole("link", { name: "Simuler la commande" }).click();
  await p.waitForURL("**/commande");
  check((await p.locator('input[autocomplete^="cc-"], input[name*="card" i], input[name*="iban" i]').count()) === 0, "aucun champ de paiement dans le parcours");
  await p.getByRole("button", { name: "Continuer vers la livraison" }).click();
  check(await p.getByText("Indiquez une adresse e-mail complète.").isVisible(), "validation des champs de commande");
  await p.getByLabel("Prénom").fill("Camille");
  await p.getByLabel("Nom", { exact: true }).fill("Test");
  await p.getByLabel("E-mail", { exact: true }).fill("camille@exemple.fr");
  await p.getByLabel("Ville", { exact: true }).fill("Lyon");
  await p.getByRole("button", { name: "Continuer vers la livraison" }).click();
  await p.getByRole("button", { name: "Vérifier la commande" }).click();
  const noPay = await p.getByText(/ne demande ni ne traite aucune donn/).waitFor({ timeout: 4000 }).then(() => true, () => false);
  check(noPay, "étape de vérification : aucun paiement");
  await p.getByRole("button", { name: "Terminer la simulation" }).click();
  await p.waitForTimeout(500);
  check(await p.getByText("Simulation terminée.").isVisible(), "commande simulée jusqu'au bout");
  check(await p.getByRole("button", { name: "Panier, 0 article" }).isVisible(), "panier vidé après la simulation");

  // recherche globale
  await p.getByRole("button", { name: "Rechercher" }).first().click();
  await p.getByLabel("Rechercher une saveur, une recette, un article").fill("datte");
  await p.waitForTimeout(500);
  check(await p.getByRole("dialog", { name: "Recherche" }).getByText("Datte fondante & Crème brûlée").first().isVisible(), "recherche globale");
  await p.keyboard.press("Escape");

  // Comptoir des Saveurs : l'exemple du cahier des charges
  await p.goto(BASE + "/recettes", { waitUntil: "networkidle" });
  const comptoir = p.locator("#comptoir");
  await comptoir.scrollIntoViewIfNeeded();
  await comptoir.locator("label", { hasText: "Iced latte" }).click();
  await comptoir.locator("label", { hasText: "Gourmand" }).click();
  await comptoir.locator("label", { hasText: "Automne" }).click();
  await p.waitForTimeout(1200);
  check(await comptoir.getByRole("heading", { name: "Poire rôtie & Sablé noisette" }).isVisible(), "Comptoir : iced latte + gourmand + automne → Poire rôtie & Sablé noisette");
  check(await comptoir.getByText("Iced latte Poire rôtie & Sablé noisette").isVisible(), "Comptoir : recette suggérée");
  await comptoir.locator("label", { hasText: "Mocktail" }).click();
  await comptoir.locator("label", { hasText: "Fruité" }).click();
  await comptoir.locator("label", { hasText: "Été" }).click();
  await p.waitForTimeout(1200);
  check(await comptoir.getByRole("heading", { name: "Pêche blanche & Fleur d'oranger" }).isVisible(), "Comptoir : mocktail + fruité + été → Pêche blanche & Fleur d'oranger");

  // formulaire professionnel
  await p.goto(BASE + "/professionnels#demande", { waitUntil: "networkidle" });
  await p.getByRole("button", { name: "Envoyer la demande (démonstration)" }).click();
  check(await p.getByText("Indiquez le nom de l'établissement.").isVisible(), "validation du formulaire professionnel");
  await p.getByLabel("Établissement", { exact: true }).fill("Café du Port");
  await p.getByLabel("Type d'établissement").selectOption("Coffee shop");
  await p.getByLabel("Nom et prénom").fill("Alex Martin");
  await p.getByLabel("E-mail professionnel").fill("alex@cafe.fr");
  await p.getByLabel("Ville", { exact: true }).fill("Nantes");
  await p.getByText("Échantillons", { exact: true }).click();
  await p.getByLabel("Votre projet").fill("Des sirops de saison pour notre carte d'automne.");
  await p.getByLabel("J'ai compris").check();
  await p.getByRole("button", { name: "Envoyer la demande (démonstration)" }).click();
  await p.waitForTimeout(400);
  check(await p.getByText("Demande validée — mode démonstration.").isVisible(), "envoi simulé du formulaire pro");
  check(errs.length === 0, `aucune erreur JavaScript ${errs.length ? JSON.stringify(errs) : ""}`);
  await p.close();
}

async function redirections(b) {
  console.log("REDIRECTIONS");
  const p = await b.newPage();
  for (const [from, to] of [
    ["/produits/poire-fondante-vanille-bourbon", "/produits/poire-rotie-sable-noisette"],
    ["/produits/datte-medjool-creme-brulee", "/produits/datte-fondante-creme-brulee"],
    ["/produits/pistache-fleur-de-sel", "/produits/pistache-grillee-biscuit-au-beurre"],
    ["/recettes/iced-latte-poire-vanille", "/recettes/iced-latte-poire-rotie"],
  ]) {
    const r = await p.request.get(BASE + from, { maxRedirects: 0 });
    check(r.status() === 308 && r.headers().location.endsWith(to), `${from} → ${to} (${r.status()})`);
  }
  await p.close();
}

async function passage(b) {
  console.log("TRANSITION DE PAGE");
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto(BASE + "/sirops", { waitUntil: "networkidle" });
  await p.waitForTimeout(4000); // écran d'ouverture levé
  const overlay = p.locator("[data-houle]");
  await p.getByRole("navigation", { name: /première partie/ }).getByRole("link", { name: "Boutique" }).click();
  await p.waitForTimeout(900);
  check(await overlay.getByText("Cap sur", { exact: true }).isVisible(), "la houle couvre la page : « Cap sur »");
  check(await overlay.getByText("La Boutique", { exact: true }).isVisible(), "destination annoncée : La Boutique");
  await p.waitForURL("**/boutique");
  const gone = await overlay.waitFor({ state: "detached", timeout: 5000 }).then(() => true, () => false);
  check(gone, "la vague passe et découvre la page");
  await p.goBack();
  await p.waitForURL("**/sirops");
  check((await overlay.count()) === 0, "retour arrière : pas de houle");
  await p.getByRole("link", { name: /Découvrir aussi les poudres/ }).click();
  await p.waitForTimeout(900);
  check(await overlay.getByText("Les Poudres", { exact: true }).isVisible(), "lien de contenu : « Les Poudres »");
  await p.waitForURL("**/poudres");
  check(errs.length === 0, `aucune erreur JavaScript ${errs.length ? JSON.stringify(errs) : ""}`);
  await ctx.close();
  const rctx = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const r = await rctx.newPage();
  await r.goto(BASE + "/sirops", { waitUntil: "networkidle" });
  await r.getByRole("navigation", { name: /première partie/ }).getByRole("link", { name: "Boutique" }).click();
  await r.waitForTimeout(200);
  check((await r.locator("[data-houle]").count()) === 0, "mouvement réduit : navigation directe, sans houle");
  await rctx.close();
}

async function mobile(b) {
  console.log("MOBILE");
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.getByRole("button", { name: "Ouvrir le menu" }).click();
  const menu = p.getByRole("dialog", { name: "Menu" });
  await p.waitForTimeout(800);
  check(await menu.isVisible(), "menu plein écran");
  check((await menu.getByRole("link", { name: "Les Essentiels" }).count()) === 1, "le menu reprend la navigation principale");
  await menu.getByRole("link", { name: "Recettes" }).click();
  await p.waitForURL("**/recettes");
  const closed = await menu.waitFor({ state: "hidden", timeout: 2500 }).then(() => true, () => false);
  check(closed, "navigation depuis le menu, fermeture automatique");
  await p.goto(BASE + "/produits/datte-fondante-creme-brulee", { waitUntil: "networkidle" });
  for (const y of [600, 1200, 1800]) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await p.waitForTimeout(400);
  }
  const bar = p.locator("div.fixed.bottom-0");
  check(await bar.isVisible(), "barre d'achat collante sur la fiche produit");
  await bar.getByRole("button", { name: "Ajouter" }).click();
  await p.waitForTimeout(500);
  check(await p.getByRole("button", { name: "Panier, 1 article" }).isVisible(), "ajout depuis la barre mobile");
  check(errs.length === 0, `aucune erreur JavaScript ${errs.length ? JSON.stringify(errs) : ""}`);
  await ctx.close();
}

async function reduced(b) {
  console.log("MOUVEMENT RÉDUIT");
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(150);
  const hidden = await p.evaluate(() =>
    [...document.querySelectorAll("[data-reveal], .hero-ligne, .hero-monte")].filter((e) => {
      for (let n = e; n; n = n.parentElement) if (getComputedStyle(n).opacity === "0") return true;
      return false;
    }).length,
  );
  check(hidden === 0, `tous les contenus animés sont visibles d'emblée (${hidden} masqué(s))`);
  await p.getByRole("button", { name: /Changer d'ambiance/ }).click();
  await opt(p, 'label:has(input[value="jour"])').click();
  await p.waitForTimeout(1800);
  check((await ambiance(p)) === "ete/jour" && !(await p.evaluate(() => document.documentElement.hasAttribute("data-vt"))), "bascule d'ambiance sans transition animée");
  await ctx.close();
}

(async () => {
  const b = await launch();
  for (const vp of [{ n: "bureau", w: 1440, h: 900 }, { n: "mobile", w: 390, h: 844 }]) await ambiances(b, vp);
  await boutique(b);
  await redirections(b);
  await passage(b);
  await mobile(b);
  await reduced(b);
  await b.close();
  console.log(failures ? `\n${failures} vérification(s) en échec` : "\nToutes les vérifications passent.");
  process.exit(failures ? 1 : 0);
})();
