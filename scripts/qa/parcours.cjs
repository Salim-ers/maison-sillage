/* Parcours utilisateurs de bout en bout : ambiances, boutique, panier, favoris,
   commande simulée, recherche, formulaire pro, menu mobile, mouvement réduit.

   node scripts/qa/parcours.cjs http://localhost:3000 */
const { launch, BASE } = require("./browser.cjs");

let failures = 0;
const check = (cond, msg) => {
  if (!cond) failures++;
  console.log(`  ${cond ? "✓" : "✗"} ${msg}`);
};
const ambiance = (p) => p.evaluate(() => `${document.documentElement.dataset.season}/${document.documentElement.dataset.light}`);
const cards = (p) => p.locator("main ul article").count();

async function ambiances(b, vp) {
  console.log(`AMBIANCES — ${vp.n}`);
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.w < 800, hasTouch: vp.w < 800 });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  check((await ambiance(p)) === "ete/coucher", "premier chargement : été au coucher du soleil");
  await p.getByRole("button", { name: /Changer d'ambiance/ }).click();
  await p.locator('label:has(input[value="nuit"])').click();
  await p.waitForTimeout(2200);
  check((await ambiance(p)) === "ete/nuit", "lumière → nuit");
  await p.locator('label:has(input[value="hiver"])').click();
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
  await p.locator('label:has(input[type="checkbox"])').click();
  await p.waitForTimeout(2200);
  check(/"auto":true/.test(await p.evaluate(() => localStorage.getItem("maison-sillage:ambiance:v1"))), `ambiance automatique activée (${await ambiance(p)})`);
  check(errs.length === 0, `aucune erreur JavaScript ${errs.length ? JSON.stringify(errs) : ""}`);
  await ctx.close();
}

async function boutique(b) {
  console.log("BOUTIQUE, PANIER, COMMANDE — bureau");
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto(BASE + "/produits/peche-blanche-fleur-oranger", { waitUntil: "networkidle" });
  await p.getByText("Bouteille professionnelle 700 ml").click();
  await p.getByRole("button", { name: "Ajouter un" }).first().click();
  await p.getByRole("button", { name: "Ajouter au panier" }).first().click();
  await p.waitForTimeout(600);
  check(await p.getByRole("status").filter({ hasText: "Ajouté au panier" }).isVisible(), "confirmation d'ajout animée");
  check(await p.getByRole("button", { name: "Panier, 2 articles" }).isVisible(), "compteur du panier = 2");
  await p.getByRole("button", { name: "Voir le panier" }).click();
  const drawer = p.getByRole("dialog", { name: "Panier" });
  await p.waitForTimeout(600);
  check(await drawer.getByText("29,80 € HT").isVisible(), "tiroir panier : total HT 2 × 14,90 €");
  await p.keyboard.press("Escape");
  await p.goto(BASE + "/boutique?categorie=poudre", { waitUntil: "networkidle" });
  check((await cards(p)) === 4, "filtre de catégorie depuis l'URL : 4 poudres");
  await p.getByRole("button", { name: "Filtres (1)" }).click();
  await p.getByRole("button", { name: "Hiver" }).click();
  await p.waitForTimeout(800);
  check((await cards(p)) === 1, "filtre saison : 1 poudre d'hiver");
  await p.locator("main ul article").first().getByRole("button", { name: "Ajouter", exact: true }).click();
  await p.getByRole("button", { name: /Effacer les filtres/ }).click();
  await p.waitForTimeout(600);
  await p.fill('input[type="search"]', "fraise");
  await p.waitForTimeout(800);
  check((await cards(p)) === 2, "recherche dans la boutique : « fraise » → 2 créations");
  await p.fill('input[type="search"]', "");
  await p.getByRole("button", { name: "Ajouter Poire fondante & Vanille Bourbon aux favoris" }).first().click();
  await p.goto(BASE + "/favoris", { waitUntil: "networkidle" });
  await p.waitForTimeout(500);
  check(await p.getByText("Poire fondante & Vanille Bourbon").first().isVisible(), "favori conservé (page Favoris)");
  await p.goto(BASE + "/panier", { waitUntil: "networkidle" });
  await p.reload({ waitUntil: "networkidle" });
  await p.waitForTimeout(500);
  check(await p.getByText("Sous-total formats professionnels").isVisible(), "panier conservé après rechargement, sous-totaux TTC / HT");
  await p.getByRole("link", { name: "Simuler la commande" }).click();
  await p.waitForURL("**/commande");
  await p.getByRole("button", { name: "Continuer vers la livraison" }).click();
  check(await p.getByText("Indiquez une adresse e-mail complète.").isVisible(), "validation des champs de commande");
  await p.getByLabel("Prénom").fill("Camille");
  await p.getByLabel("Nom", { exact: true }).fill("Test");
  await p.getByLabel("E-mail", { exact: true }).fill("camille@exemple.fr");
  await p.getByLabel("Ville", { exact: true }).fill("Lyon");
  await p.getByRole("button", { name: "Continuer vers la livraison" }).click();
  await p.getByRole("button", { name: "Vérifier la commande" }).click();
  await p.getByRole("button", { name: "Terminer la simulation" }).click();
  await p.waitForTimeout(500);
  check(await p.getByText("Simulation terminée.").isVisible(), "commande simulée jusqu'au bout");
  check(await p.getByRole("button", { name: "Panier, 0 article" }).isVisible(), "panier vidé après la simulation");
  await p.getByRole("button", { name: "Rechercher" }).first().click();
  await p.getByLabel("Rechercher une saveur, une recette, un article").fill("datte");
  await p.waitForTimeout(500);
  check(await p.getByRole("dialog", { name: "Recherche" }).getByText("Datte Medjool & Crème brûlée").first().isVisible(), "recherche globale");
  await p.keyboard.press("Escape");
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
  await menu.getByRole("link", { name: "Recettes" }).click();
  await p.waitForURL("**/recettes");
  const closed = await menu.waitFor({ state: "hidden", timeout: 2500 }).then(() => true, () => false);
  check(closed, "navigation depuis le menu, fermeture automatique");
  await p.goto(BASE + "/produits/datte-medjool-creme-brulee", { waitUntil: "networkidle" });
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
  await p.locator('label:has(input[value="jour"])').click();
  await p.waitForTimeout(1800);
  check((await ambiance(p)) === "ete/jour" && !(await p.evaluate(() => document.documentElement.hasAttribute("data-vt"))), "bascule d'ambiance sans transition animée");
  await ctx.close();
}

(async () => {
  const b = await launch();
  for (const vp of [{ n: "bureau", w: 1440, h: 900 }, { n: "mobile", w: 390, h: 844 }]) await ambiances(b, vp);
  await boutique(b);
  await mobile(b);
  await reduced(b);
  await b.close();
  console.log(failures ? `\n${failures} vérification(s) en échec` : "\nToutes les vérifications passent.");
  process.exit(failures ? 1 : 0);
})();
