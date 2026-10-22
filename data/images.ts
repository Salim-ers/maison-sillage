import generated from "./images.generated.json";
import type { Flavor, Light, SeasonId } from "@/lib/types";

/* ──────────────────────────────────────────────────────────────
   Registre central des photographies.
   Chaque image du site est déclarée ici et attribuée à sa section.
   Les fichiers sont produits par scripts/images/generate.py (prises de vue,
   voir scripts/images/shots.py) puis scripts/images/build.py (masters WebP).
   Règle : une même photographie n'apparaît jamais deux fois sur une page.
   ────────────────────────────────────────────────────────────── */

export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL: string;
  /** cadrage préférentiel (object-position) */
  position?: string;
}

// clé : chemin logique (/images/hero/ete-coucher.webp) ; src : fichier publié à empreinte
const manifest = generated as Record<string, { src: string; w: number; h: number; blur: string }>;

const has = (src: string) => src in manifest;
/** première source disponible : une variante de lumière pas encore générée retombe sur le coucher de soleil */
const first = (...srcs: string[]) => srcs.find(has) ?? srcs[srcs.length - 1];

function photo(src: string, alt: string, position?: string): Photo {
  const g = manifest[src];
  if (!g) throw new Error(`Image absente du manifeste : ${src} — lancer npm run images`);
  return { src: g.src, width: g.w, height: g.h, alt, blurDataURL: g.blur, position };
}

const FLAVOR_LABEL: Record<Flavor, string> = {
  fraise: "Fraise des bois & Madeleine dorée",
  peche: "Pêche blanche & Fleur d'oranger",
  poire: "Poire fondante & Vanille Bourbon",
  datte: "Datte Medjool & Crème brûlée",
};
const SEASON_FLAVOR: Record<SeasonId, Flavor> = { printemps: "fraise", ete: "peche", automne: "poire", hiver: "datte" };
const FLAVOR_SEASON: Record<Flavor, SeasonId> = { fraise: "printemps", peche: "ete", poire: "automne", datte: "hiver" };

const LIGHT_ALT: Record<Light, string> = {
  jour: "en plein jour",
  coucher: "au coucher du soleil",
  nuit: "au clair de lune",
};

/* ─────────────── Hero : une scène par saison, trois lumières, bureau + mobile ─────────────── */

const HERO_SCENE: Record<SeasonId, string> = {
  printemps: "Sur une terrasse fleurie de cerisiers face à une baie méditerranéenne",
  ete: "Sur une balustrade de pierre au-dessus de la Méditerranée, face à un village perché",
  automne: "Sur une terrasse de pierre semée de feuilles d'automne, face à une baie et un village ancien",
  hiver: "Sur une terrasse de pierre saupoudrée de neige, face à un port d'hiver",
};

/** Point focal du hero bureau (fractions de l'image) : il reste visible quel que soit le format d'écran */
export const HERO_FOCUS: Record<SeasonId, { x: number; y: number }> = {
  printemps: { x: 0.56, y: 0.5 },
  ete: { x: 0.56, y: 0.5 },
  automne: { x: 0.56, y: 0.5 },
  hiver: { x: 0.56, y: 0.5 },
};

export function heroPhotos(season: SeasonId, light: Light): { desktop: Photo; mobile?: Photo; season: SeasonId } {
  // tant que la scène d'une saison n'est pas générée, le hero montre la scène d'été (complète, trois lumières)
  const scene: SeasonId = has(`/images/hero/${season}-coucher.webp`) ? season : "ete";
  const f = SEASON_FLAVOR[scene];
  const desktop = first(`/images/hero/${scene}-${light}.webp`, `/images/hero/${scene}-coucher.webp`);
  const lit = desktop.includes(`-${light}.`) ? light : "coucher";
  const alt = `${HERO_SCENE[scene]}, ${LIGHT_ALT[lit]} : le sirop et la préparation en poudre ${FLAVOR_LABEL[f]}, une boisson gourmande, et un grand voilier au large.`;
  // la version verticale n'est utilisée que si elle existe dans la même lumière que la version large ;
  // sans elle, la version large est cadrée sur les produits sur téléphone
  const mobile = `/images/hero/mobile-${scene}-${lit}.webp`;
  return { desktop: photo(desktop, alt, "62% 50%"), mobile: has(mobile) ? photo(mobile, alt) : undefined, season: scene };
}

/* ─────────────── Histoire : seconde vue maritime, sans produit ─────────────── */

const STORY_ALT: Record<SeasonId, string> = {
  printemps: "Un trois-mâts au mouillage dans une baie calme, vu depuis une terrasse où reposent un carnet de voyage et une boussole",
  ete: "Un trois-mâts au large d'un vieux quai de pierre, cordages lovés et bitte d'amarrage au premier plan",
  automne: "Une carte marine, une longue-vue et un carnet sur le rebord d'une fenêtre ouverte sur une baie où navigue un trois-mâts",
  hiver: "Un trois-mâts aux voiles ferlées dans un port d'hiver, une lanterne sur le quai enneigé",
};
const DETAIL_ALT: Record<SeasonId, string> = {
  printemps: "Carnet de voyage ouvert, fleur séchée et boussole en laiton",
  ete: "Cordage de chanvre lové sur une bitte d'amarrage en pierre",
  automne: "Carte marine ancienne, longue-vue en laiton et plume",
  hiver: "Lanterne de navire allumée sur un muret enneigé",
};

export function storyPhoto(season: SeasonId, light: Light): Photo {
  const src = first(`/images/story/${season}-${light}.webp`, `/images/story/${season}-coucher.webp`);
  return photo(src, `${STORY_ALT[season]}, ${LIGHT_ALT[src.includes(`-${light}.`) ? light : "coucher"]}.`);
}
export const storyDetail = (season: SeasonId): Photo => photo(`/images/story/detail-${season}.webp`, DETAIL_ALT[season]);

/* ─────────────── Saisons : scène de collection, paysage, matières ─────────────── */

export const seasonImages: Record<SeasonId, { scene: Photo; paysage: Photo; matieres: [Photo, Photo] }> = {
  printemps: {
    scene: photo("/images/seasons/scene-printemps.webp", "Le sirop et la poudre Fraise des bois & Madeleine dorée, un milkshake à la fraise, des fraises des bois et des madeleines sur une terrasse fleurie", "65% 50%"),
    paysage: photo("/images/seasons/paysage-printemps.webp", "Jardin en terrasses d'un village méditerranéen au printemps, cerisiers et amandiers en fleurs, la mer au loin"),
    matieres: [
      photo("/images/seasons/matiere-printemps-fraises.webp", "Fraises des bois et fleurs de fraisier sur un linge"),
      photo("/images/seasons/matiere-printemps-fleurs.webp", "Branche de cerisier en fleurs dans la lumière du printemps"),
    ],
  },
  ete: {
    scene: photo("/images/seasons/scene-ete.webp", "Le sirop et la poudre Pêche blanche & Fleur d'oranger, une boisson pétillante glacée et des pêches blanches sur une terrasse face à la mer", "65% 50%"),
    paysage: photo("/images/seasons/paysage-ete.webp", "Terrasse sous la vigne au-dessus d'une baie méditerranéenne à l'heure dorée, cyprès et village perché"),
    matieres: [
      photo("/images/seasons/matiere-ete-peches.webp", "Pêches blanches mûres dans une cagette de bois, au verger"),
      photo("/images/seasons/matiere-ete-fleurs-oranger.webp", "Fleurs d'oranger et feuilles d'oranger"),
    ],
  },
  automne: {
    scene: photo("/images/seasons/scene-automne.webp", "Le sirop et la poudre Poire fondante & Vanille Bourbon, un iced latte à la poire rôtie et des poires sur une table de bois en automne", "65% 50%"),
    paysage: photo("/images/seasons/paysage-automne.webp", "Verger de poiriers et vignes d'automne sur des collines dominant un lac, ferme de pierre"),
    matieres: [
      photo("/images/seasons/matiere-automne-poires.webp", "Poires mûres sur la branche, au verger"),
      photo("/images/seasons/matiere-automne-epices.webp", "Gousses de vanille Bourbon, bâtons de cannelle et badiane sur une planche ancienne"),
    ],
  },
  hiver: {
    scene: photo("/images/seasons/scene-hiver.webp", "Le sirop et la poudre Datte Medjool & Crème brûlée, un latte au sucre caramélisé et une crème brûlée près d'une cheminée", "65% 50%"),
    paysage: photo("/images/seasons/paysage-hiver.webp", "Village côtier enneigé à la tombée du jour, fenêtres éclairées et trois-mâts au mouillage"),
    matieres: [
      photo("/images/seasons/matiere-hiver-dattes.webp", "Dattes Medjool brillantes dans une coupe de laiton ciselé"),
      photo("/images/seasons/matiere-hiver-chocolat.webp", "Carrés de chocolat noir et cacao en poudre"),
    ],
  },
};

/* ─────────────── Produits ─────────────── */

export const siropPhoto = (f: Flavor) => photo(`/images/products/sirop-${f}.webp`, `Flacon de sirop ${FLAVOR_LABEL[f]}`, "50% 45%");
export const poudrePhoto = (f: Flavor) => photo(`/images/products/poudre-${f}.webp`, `Sachet de préparation en poudre ${FLAVOR_LABEL[f]}`, "50% 45%");
export const duoPhoto = (f: Flavor) => photo(`/images/products/duo-${f}.webp`, `Le sirop et la préparation en poudre ${FLAVOR_LABEL[f]}, entourés de leurs ingrédients`);

export const gamme = {
  sirops: photo("/images/products/gamme-sirops.webp", "Les quatre sirops signatures alignés sur une table de chêne, chacun entouré de ses ingrédients"),
  poudres: photo("/images/products/gamme-poudres.webp", "Les quatre préparations en poudre alignées sur une table de chêne, coupelles de poudre et ingrédients au premier plan"),
  coffret: photo("/images/products/coffret-decouverte.webp", "Le Coffret Découverte ouvert : trois flacons, Fraise des bois, Pêche blanche et Poire fondante"),
};

/* ─────────────── Boissons & recettes ─────────────── */

const DRINK = {
  latteDatte: photo("/images/recipes/latte-datte.webp", "Latte chaud dans un verre ciselé, éclats de sucre caramélisé sur la mousse, près du flacon Datte Medjool & Crème brûlée", "50% 45%"),
  icedLattePoire: photo("/images/recipes/iced-latte-poire.webp", "Iced latte en couches, glace et tranche de poire rôtie, près du flacon Poire fondante & Vanille Bourbon", "50% 45%"),
  mocktailPeche: photo("/images/recipes/mocktail-peche.webp", "Mocktail pétillant à la pêche blanche, menthe et fleur d'oranger, près du flacon Pêche blanche & Fleur d'oranger", "50% 50%"),
  milkshakeFraise: photo("/images/recipes/milkshake-fraise.webp", "Milkshake à la fraise, chantilly et coulis, près du flacon Fraise des bois & Madeleine dorée", "50% 45%"),
  chocolatChaud: photo("/images/recipes/chocolat-chaud.webp", "Chocolat chaud fumant près d'une fenêtre enneigée, à côté du sachet Datte Medjool & Crème brûlée", "50% 50%"),
  cremeBrulee: photo("/images/recipes/creme-brulee.webp", "Crème brûlée dont la croûte de sucre cède sous une cuillère dorée, dattes Medjool", "50% 50%"),
  cafeTerrasse: photo("/images/recipes/cafe-terrasse.webp", "Tasse de café sur une table de terrasse au-dessus de la mer, carnet et boussole", "50% 50%"),
  lattePoire: photo("/images/recipes/latte-poire.webp", "Latte poire et vanille au dessin de lait, sachet Poire fondante & Vanille Bourbon et feuilles d'automne", "50% 50%"),
};

const SIROP_DRINK: Record<Flavor, Photo> = { fraise: DRINK.milkshakeFraise, peche: DRINK.mocktailPeche, poire: DRINK.icedLattePoire, datte: DRINK.latteDatte };
const POUDRE_DRINK: Record<Flavor, Photo> = { fraise: DRINK.milkshakeFraise, peche: DRINK.mocktailPeche, poire: DRINK.lattePoire, datte: DRINK.chocolatChaud };

export const lifestyle = {
  comptoir: photo("/images/lifestyle/comptoir-professionnel.webp", "Comptoir de coffee shop en marbre face au port : un barista verse le sirop dans un iced latte, flacons et sachets alignés", "50% 50%"),
};

export const matierePoudre = photo("/images/seasons/matiere-poudre.webp", "Cuillère d'argent de préparation en poudre devant le flacon et le sachet Poire fondante & Vanille Bourbon", "48% 50%");

/** Photographie de carte (boutique, accueil, panier) et galerie de fiche, par produit */
export function productPhotos(slug: string, category: "sirop" | "poudre" | "coffret", flavor: Flavor | null): { card: Photo | null; gallery: { photo: Photo; label: string }[] } {
  if (category === "coffret") {
    return {
      card: gamme.coffret,
      gallery: [
        { photo: gamme.coffret, label: "Le coffret" },
        { photo: gamme.sirops, label: "La collection" },
        { photo: seasonImages.ete.scene, label: "En situation" },
      ],
    };
  }
  if (!flavor) return { card: null, gallery: [] };
  const season = FLAVOR_SEASON[flavor];
  if (category === "sirop") {
    return {
      card: siropPhoto(flavor),
      gallery: [
        { photo: siropPhoto(flavor), label: "Le flacon" },
        { photo: duoPhoto(flavor), label: "Sirop & poudre" },
        { photo: seasonImages[season].scene, label: "En saison" },
        { photo: SIROP_DRINK[flavor], label: "En boisson" },
      ],
    };
  }
  return {
    card: poudrePhoto(flavor),
    gallery: [
      { photo: poudrePhoto(flavor), label: "Le sachet" },
      { photo: duoPhoto(flavor), label: "Sirop & poudre" },
      { photo: POUDRE_DRINK[flavor], label: "En boisson" },
      { photo: seasonImages[season].matieres[0], label: "La matière" },
    ],
  };
}

export const recipePhotos: Record<string, { main: Photo; second: Photo }> = {
  "latte-datte-creme-brulee": { main: DRINK.latteDatte, second: seasonImages.hiver.scene },
  "iced-latte-poire-vanille": { main: DRINK.icedLattePoire, second: seasonImages.automne.scene },
  "cafe-du-large-poire": { main: DRINK.cafeTerrasse, second: seasonImages.automne.matieres[0] },
  "mocktail-petillant-peche-blanche": { main: DRINK.mocktailPeche, second: seasonImages.ete.matieres[0] },
  "chocolat-chaud-datte-creme-brulee": { main: DRINK.chocolatChaud, second: seasonImages.hiver.paysage },
  "milkshake-fraise-madeleine": { main: DRINK.milkshakeFraise, second: seasonImages.printemps.matieres[0] },
  "creme-brulee-datte-medjool": { main: DRINK.cremeBrulee, second: seasonImages.hiver.matieres[0] },
  "latte-poire-vanille": { main: DRINK.lattePoire, second: matierePoudre },
};

/* ─────────────── Attribution par section ─────────────── */

/** Accueil : chaque section a ses propres photographies (aucun doublon visible) */
export const home = {
  monde: {
    sirops: gamme.sirops,
    poudres: matierePoudre,
    recettes: DRINK.lattePoire,
  },
  usages: {
    latte: DRINK.latteDatte,
    "latte-glace": DRINK.icedLattePoire,
    cafe: DRINK.cafeTerrasse,
    mocktail: DRINK.mocktailPeche,
    chocolat: DRINK.chocolatChaud,
    milkshake: DRINK.milkshakeFraise,
    dessert: DRINK.cremeBrulee,
  },
  poudres: gamme.poudres,
  pro: lifestyle.comptoir,
};

/** Pages intérieures */
export const pages = {
  boutique: seasonImages.ete.paysage,
  sirops: gamme.sirops,
  poudres: gamme.poudres,
  recettes: seasonImages.ete.scene,
  professionnels: lifestyle.comptoir,
  savoirFaire: [seasonImages.printemps.paysage, seasonImages.printemps.matieres[1], matierePoudre, DRINK.mocktailPeche, seasonImages.automne.matieres[1], gamme.sirops],
  maison: {
    carnet: seasonImages.ete.paysage,
    matieres: seasonImages.automne.matieres[1],
  },
};

/** Photographie d'ouverture de chaque article du Journal */
export const articlePhotos: Record<string, Photo> = {
  "petite-histoire-du-sirop": gamme.sirops,
  "l-art-du-latte": DRINK.lattePoire,
  "boissons-gourmandes-de-saison": seasonImages.automne.paysage,
  "imaginer-une-carte-de-boissons": lifestyle.comptoir,
  "l-inspiration-des-routes-maritimes": photo("/images/story/automne-coucher.webp", `${STORY_ALT.automne}, au coucher du soleil.`),
};
