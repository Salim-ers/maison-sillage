import generated from "./images.generated.json";
import type { Flavor, Light, SeasonId } from "@/lib/types";

/* ──────────────────────────────────────────────────────────────
   Registre central des photographies.
   Chaque image du site est déclarée ici une seule fois et attribuée
   à sa section. Les fichiers sont produits par scripts/images/build.py
   à partir des sources de assets/originals/ (voir assets/README.md).
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

const manifest = generated as Record<string, { w: number; h: number; blur: string }>;

function photo(src: string, alt: string, position?: string): Photo {
  const g = manifest[src];
  if (!g) throw new Error(`Image absente du manifeste : ${src} — lancer scripts/images/build.py`);
  return { src, width: g.w, height: g.h, alt, blurDataURL: g.blur, position };
}

/* ─────────────── Photographies maritimes (hero & histoire) ─────────────── */

type MaritimeId = "voilier-terrasse-lanterne" | "voilier-plage-rochers" | "voilier-terrasse-amphores" | "voilier-cote-rocheuse";

export interface MaritimeScene {
  id: MaritimeId;
  /** description, complétée selon la lumière */
  alt: string;
  /** centre du navire (fractions de l'image) : cadrage mobile et point focal */
  ship: { x: number; y: number };
  /** soleil / lune */
  sun: { x: number; y: number };
  horizon: number;
  /** zone de ciel où peuvent apparaître les étoiles (x0, x1, y0, y1) */
  sky: [number, number, number, number];
  /** lanternes visibles dans le décor */
  lanterns: { x: number; y: number; r: number }[];
  /** fenêtres du village, allumées la nuit */
  windows: [number, number][];
}

export const maritime: Record<MaritimeId, MaritimeScene> = {
  "voilier-terrasse-lanterne": {
    id: "voilier-terrasse-lanterne",
    alt: "Un trois-mâts toutes voiles dehors entre dans une baie méditerranéenne, vu depuis une terrasse de pierre fleurie de jasmin où pend une lanterne",
    ship: { x: 0.37, y: 0.46 },
    sun: { x: 0.17, y: 0.42 },
    horizon: 0.5,
    sky: [0.26, 0.9, 0.03, 0.3],
    lanterns: [{ x: 0.082, y: 0.16, r: 0.05 }],
    windows: [[0.72, 0.43], [0.745, 0.405], [0.79, 0.385], [0.81, 0.36], [0.84, 0.395], [0.86, 0.33], [0.88, 0.355], [0.9, 0.4], [0.83, 0.45], [0.765, 0.46], [0.845, 0.255], [0.91, 0.31]],
  },
  "voilier-plage-rochers": {
    id: "voilier-plage-rochers",
    alt: "Un grand voilier glisse sur une mer scintillante au large d'une crique rocheuse, sous un village perché et une tour ancienne",
    ship: { x: 0.2, y: 0.47 },
    sun: { x: 0.29, y: 0.46 },
    horizon: 0.52,
    sky: [0.02, 0.6, 0.03, 0.34],
    lanterns: [],
    windows: [[0.785, 0.36], [0.8, 0.33], [0.82, 0.38], [0.84, 0.3], [0.86, 0.345], [0.875, 0.4], [0.835, 0.22], [0.81, 0.42]],
  },
  "voilier-terrasse-amphores": {
    id: "voilier-terrasse-amphores",
    alt: "Un trois-mâts au large d'un village médiéval, vu depuis un quai de pierre orné d'amphores, d'oliviers et d'une bitte d'amarrage",
    ship: { x: 0.32, y: 0.44 },
    sun: { x: 0.22, y: 0.385 },
    horizon: 0.5,
    sky: [0.16, 0.62, 0.03, 0.3],
    lanterns: [],
    windows: [[0.68, 0.45], [0.71, 0.42], [0.74, 0.38], [0.77, 0.405], [0.8, 0.35], [0.83, 0.33], [0.86, 0.3], [0.872, 0.2], [0.9, 0.3], [0.93, 0.27], [0.79, 0.47], [0.84, 0.42]],
  },
  "voilier-cote-rocheuse": {
    id: "voilier-cote-rocheuse",
    alt: "Un ancien voilier navigue près d'une côte rocheuse ; la mer turquoise reflète la lumière et un village ancien domine la baie",
    ship: { x: 0.21, y: 0.4 },
    sun: { x: 0.32, y: 0.375 },
    horizon: 0.47,
    sky: [0.02, 0.6, 0.03, 0.3],
    lanterns: [],
    windows: [[0.64, 0.42], [0.665, 0.4], [0.7, 0.38], [0.73, 0.36], [0.76, 0.37], [0.79, 0.34], [0.82, 0.33], [0.85, 0.31], [0.88, 0.36], [0.9, 0.4], [0.8, 0.4], [0.84, 0.27]],
  },
};

const LIGHT_ALT: Record<Light, string> = {
  jour: "en plein jour",
  coucher: "au coucher du soleil",
  nuit: "au clair de lune",
};

/** Une photographie par saison pour le hero, une autre pour l'histoire */
export const HERO_SCENE: Record<SeasonId, MaritimeId> = {
  printemps: "voilier-terrasse-lanterne",
  ete: "voilier-cote-rocheuse",
  automne: "voilier-terrasse-amphores",
  hiver: "voilier-plage-rochers",
};
export const STORY_SCENE: Record<SeasonId, MaritimeId> = {
  printemps: "voilier-terrasse-amphores",
  ete: "voilier-terrasse-lanterne",
  automne: "voilier-cote-rocheuse",
  hiver: "voilier-terrasse-lanterne",
};
const STORY_DETAIL: Record<SeasonId, { file: string; alt: string }> = {
  printemps: { file: "escalier", alt: "Escalier de pierre, amphore et jasmin au bord de la plage" },
  ete: { file: "bitte-amarrage", alt: "Bitte d'amarrage en pierre et cordage lové sur le quai" },
  automne: { file: "lanterne", alt: "Lanterne de fer forgé et branches de jasmin sur un mur de pierre" },
  hiver: { file: "bitte-amarrage", alt: "Bitte d'amarrage en pierre et cordage lové sur le quai" },
};

export function heroPhoto(season: SeasonId, light: Light): Photo & { scene: MaritimeScene } {
  const scene = maritime[HERO_SCENE[season]];
  const p = photo(`/images/hero/${scene.id}-${season}-${light}.webp`, `${scene.alt}, ${LIGHT_ALT[light]}.`);
  return { ...p, scene };
}

export function storyPhoto(season: SeasonId, light: Light): Photo & { scene: MaritimeScene } {
  const scene = maritime[STORY_SCENE[season]];
  const p = photo(`/images/story/${scene.id}-${season}-${light}.webp`, `${scene.alt}, ${LIGHT_ALT[light]}.`, `${Math.round(scene.ship.x * 100)}% 50%`);
  return { ...p, scene };
}

export function storyDetail(season: SeasonId, light: Light): Photo {
  const d = STORY_DETAIL[season];
  return photo(`/images/story/detail-${d.file}-${season}-${light}.webp`, `${d.alt}, ${LIGHT_ALT[light]}.`);
}

/* ─────────────── Saisons ─────────────── */

export const seasonImages: Record<SeasonId, { scene: Photo; paysage: Photo; matieres: [Photo, Photo] }> = {
  printemps: {
    scene: photo("/images/seasons/scene-printemps.webp", "Flacon et sachet Fraise des bois & Madeleine dorée, milkshake à la fraise et madeleines sur une terrasse fleurie de cerisiers face à la mer", "62% 55%"),
    paysage: photo("/images/seasons/paysage-printemps.webp", "Terrasse ensoleillée d'un village perché : table de bois, bol de grains de café, gousses de vanille, lanterne et carnets anciens", "60% 60%"),
    matieres: [
      photo("/images/seasons/matiere-printemps-fraises.webp", "Fraises des bois et fleurs de fraisier"),
      photo("/images/seasons/matiere-printemps-fleurs.webp", "Branche de fleurs roses dans une lumière douce"),
    ],
  },
  ete: {
    scene: photo("/images/seasons/scene-ete.webp", "Flacon et sachet Pêche blanche & Fleur d'oranger, boisson pétillante glacée et pêches ouvertes sur une terrasse face au port", "60% 55%"),
    paysage: photo("/images/seasons/paysage-ete.webp", "Terrasse sous une pergola fleurie dominant une baie méditerranéenne au soleil couchant, carnet ouvert et boussole sur la table", "40% 50%"),
    matieres: [
      photo("/images/seasons/matiere-ete-peches.webp", "Pêches mûres dans des cagettes de bois, au soleil du verger"),
      photo("/images/seasons/matiere-ete-fleurs-oranger.webp", "Fleurs blanches en pleine floraison"),
    ],
  },
  automne: {
    scene: photo("/images/seasons/scene-automne.webp", "Flacon et sachet Poire fondante & Vanille Bourbon, latte glacé, poires rôties et feuilles d'érable face à un port au crépuscule", "62% 55%"),
    paysage: photo("/images/seasons/paysage-automne.webp", "Banc de bois sous un grand arbre aux feuilles dorées, face à une vallée et un lac d'automne", "60% 55%"),
    matieres: [
      photo("/images/seasons/matiere-automne-poires.webp", "Poires mûres sur la branche, dans le verger"),
      photo("/images/seasons/matiere-automne-epices.webp", "Bâtons de cannelle, badiane et noix de muscade sur une planche ancienne"),
    ],
  },
  hiver: {
    scene: photo("/images/seasons/scene-hiver.webp", "Flacon et sachet Datte Medjool & Crème brûlée, latte nappé de caramel et crème brûlée près d'une cheminée, village enneigé à la fenêtre", "60% 55%"),
    paysage: photo("/images/seasons/paysage-hiver.webp", "Tasse fumante sur le rebord d'une fenêtre donnant sur une forêt enneigée, lanterne et bougies allumées", "70% 60%"),
    matieres: [
      photo("/images/seasons/matiere-hiver-dattes.webp", "Dattes Medjool brillantes dans une coupe de laiton ciselé"),
      photo("/images/seasons/matiere-hiver-chocolat.webp", "Carrés de chocolat noir et cacao en poudre"),
    ],
  },
};

/* ─────────────── Produits ─────────────── */

const FLAVOR_LABEL: Record<Flavor, string> = {
  fraise: "Fraise des bois & Madeleine dorée",
  peche: "Pêche blanche & Fleur d'oranger",
  poire: "Poire fondante & Vanille Bourbon",
  datte: "Datte Medjool & Crème brûlée",
};
const FLAVOR_SEASON: Record<Flavor, SeasonId> = { fraise: "printemps", peche: "ete", poire: "automne", datte: "hiver" };

/** Flacon et sachet isolés dans les photographies de gamme (coucher de soleil sur le port) */
export const quai = (f: Flavor) => ({
  flacon: photo(`/images/products/quai-flacon-${f}.webp`, `Flacon de sirop ${FLAVOR_LABEL[f]} sur une table de bois, port au coucher du soleil`),
  sachet: photo(`/images/products/quai-sachet-${f}.webp`, `Sachet de préparation en poudre ${FLAVOR_LABEL[f]}, port au coucher du soleil`),
});

export const flaconPhoto = (f: Flavor) => photo(`/images/products/flacon-${f}.webp`, `Flacon de sirop ${FLAVOR_LABEL[f]}`, "50% 40%");
export const sachetPhoto = (f: Flavor) => photo(`/images/products/sachet-${f}.webp`, `Sachet de préparation en poudre ${FLAVOR_LABEL[f]}`, "55% 40%");
export const natureMorte = (f: Flavor) => photo(`/images/products/nature-morte-${f}.webp`, `Nature morte ${FLAVOR_LABEL[f]} : flacon, sachet et boisson gourmande`);

export const gamme = {
  sirops: photo("/images/products/gamme-sirops.webp", "Les quatre sirops signatures alignés sur une table de bois face au port, chacun entouré de sa matière : fraises, pêche, poire et vanille, dattes"),
  poudres: photo("/images/products/gamme-poudres.webp", "Les quatre préparations en poudre en sachets ivoire, entourées de fraises, madeleine, pêches, poires, vanille et dattes, face à la mer"),
  coffret: photo("/images/products/coffret-decouverte.webp", "Les trois flacons du Coffret Découverte : Fraise des bois, Pêche blanche et Poire fondante"),
};

/** Photographie de carte (boutique, accueil, panier) et galerie de fiche, par produit */
export function productPhotos(slug: string, category: "sirop" | "poudre" | "coffret", flavor: Flavor | null): { card: Photo | null; gallery: { photo: Photo; label: string }[] } {
  if (category === "coffret") {
    return {
      card: gamme.coffret,
      gallery: [
        { photo: gamme.coffret, label: "Le coffret" },
        { photo: lifestyle.lattePoire, label: "En situation" },
        { photo: seasonImages.printemps.matieres[0], label: "Printemps" },
        { photo: seasonImages.ete.matieres[0], label: "Été" },
      ],
    };
  }
  if (!flavor) return { card: null, gallery: [] };
  const season = FLAVOR_SEASON[flavor];
  if (category === "sirop") {
    return {
      card: flaconPhoto(flavor),
      gallery: [
        { photo: flaconPhoto(flavor), label: "Le flacon" },
        { photo: quai(flavor).flacon, label: "Sur le quai" },
        { photo: seasonImages[season].scene, label: "En saison" },
        { photo: seasonImages[season].matieres[0], label: "La matière" },
      ],
    };
  }
  return {
    card: sachetPhoto(flavor),
    gallery: [
      { photo: sachetPhoto(flavor), label: "Le sachet" },
      { photo: natureMorte(flavor), label: "Nature morte" },
      { photo: drinkPhoto(flavor), label: "En situation" },
      { photo: seasonImages[season].matieres[0], label: "La matière" },
    ],
  };
}

/* ─────────────── Boissons & recettes ─────────────── */

const DRINK: Record<Flavor, Photo> = {
  datte: photo("/images/recipes/latte-datte.webp", "Latte en verre ciselé, nappé de caramel et coiffé d'éclats de crème brûlée", "50% 45%"),
  poire: photo("/images/recipes/iced-latte-poire.webp", "Iced latte en couches coiffé de chantilly, filet de caramel et tranche de poire rôtie", "50% 45%"),
  peche: photo("/images/recipes/mocktail-peche.webp", "Mocktail pétillant aux tranches de pêche, menthe et fleur d'oranger sur glace pilée", "50% 50%"),
  fraise: photo("/images/recipes/milkshake-fraise.webp", "Milkshake à la fraise marbré, chantilly, coulis et fraise fraîche", "50% 45%"),
};
export const drinkPhoto = (f: Flavor) => DRINK[f];

export const recipePhotos: Record<string, { main: Photo; second: Photo }> = {
  "latte-datte-creme-brulee": { main: DRINK.datte, second: seasonImages.hiver.scene },
  "iced-latte-poire-vanille": { main: DRINK.poire, second: photo("/images/lifestyle/latte-poire-coucher.webp", "Iced latte à la poire, flacon et sachet sur une table face au port au coucher du soleil") },
  "cafe-du-large-poire": {
    main: photo("/images/recipes/cafe-terrasse.webp", "Tasse de café sur une table de bois en terrasse, carnet ouvert et boussole, la mer en contrebas", "62% 55%"),
    second: natureMorte("poire"),
  },
  "mocktail-petillant-peche-blanche": { main: DRINK.peche, second: seasonImages.ete.scene },
  "chocolat-chaud-datte-creme-brulee": {
    main: photo("/images/recipes/chocolat-chaud.webp", "Tasse de chocolat chaud fumant près d'une fenêtre enneigée, lanterne et bougie allumées", "45% 70%"),
    second: seasonImages.hiver.matieres[1],
  },
  "milkshake-fraise-madeleine": { main: DRINK.fraise, second: seasonImages.printemps.scene },
  "creme-brulee-datte-medjool": {
    main: photo("/images/recipes/creme-brulee-datte.webp", "Crème brûlée caramélisée, éclats de sucre grillé et cuillère dorée"),
    second: seasonImages.hiver.matieres[0],
  },
  "latte-poire-vanille": {
    main: photo("/images/recipes/latte-poire-automne.webp", "Latte à la poire en verre, feuilles d'automne, grains de café et boussole sur une table de bois", "50% 45%"),
    second: seasonImages.automne.matieres[0],
  },
};

/* ─────────────── Scènes de vie ─────────────── */

export const lifestyle = {
  lattePoire: photo("/images/lifestyle/latte-poire-coucher.webp", "Iced latte à la poire, flacon et sachet Maison Sillage sur une table face au port au coucher du soleil", "62% 50%"),
  comptoir: photo("/images/lifestyle/comptoir-professionnel.webp", "Comptoir de bar en marbre face au port : latte glacé, boisson pétillante, flacons, sachet et ustensiles de barman en laiton", "35% 55%"),
};

/* ─────────────── Attribution par section ─────────────── */

/** Accueil : chaque section a ses propres photographies (aucun doublon visible) */
export const home = {
  monde: {
    sirops: { ...lifestyle.lattePoire, position: "66% 50%" },
    poudres: seasonImages.automne.matieres[1],
    recettes: seasonImages.printemps.paysage,
  },
  usages: {
    latte: DRINK.datte,
    "latte-glace": DRINK.poire,
    cafe: recipePhotos["cafe-du-large-poire"].main,
    mocktail: DRINK.peche,
    chocolat: recipePhotos["chocolat-chaud-datte-creme-brulee"].main,
    milkshake: DRINK.fraise,
    dessert: recipePhotos["creme-brulee-datte-medjool"].main,
  },
  poudres: { matiere: seasonImages.hiver.matieres[1] },
  pro: lifestyle.comptoir,
};

/** Pages intérieures */
export const pages = {
  boutique: seasonImages.ete.paysage,
  sirops: gamme.sirops,
  poudres: seasonImages.hiver.matieres[1],
  recettes: lifestyle.lattePoire,
  professionnels: lifestyle.comptoir,
  journal: seasonImages.automne.matieres[1],
  savoirFaire: [
    seasonImages.printemps.paysage,
    seasonImages.printemps.matieres[1],
    natureMorte("poire"),
    DRINK.peche,
    seasonImages.automne.matieres[1],
    gamme.sirops,
  ],
  maison: {
    carnet: seasonImages.ete.paysage,
    matieres: seasonImages.automne.matieres[1],
  },
};

/** Photographie d'ouverture de chaque article du Journal */
export const articlePhotos: Record<string, Photo> = {
  "petite-histoire-du-sirop": gamme.sirops,
  "l-art-du-latte": recipePhotos["latte-poire-vanille"].main,
  "boissons-gourmandes-de-saison": seasonImages.automne.paysage,
  "imaginer-une-carte-de-boissons": lifestyle.comptoir,
  "l-inspiration-des-routes-maritimes": photo("/images/hero/voilier-cote-rocheuse-ete-coucher.webp", `${maritime["voilier-cote-rocheuse"].alt}, au coucher du soleil.`, "30% 50%"),
};
