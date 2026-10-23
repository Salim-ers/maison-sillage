import generated from "./images.generated.json";
import { products } from "./products";
import type { Light, Product, Recipe, SeasonId } from "../lib/types";

/* ──────────────────────────────────────────────────────────────
   Registre central des photographies.
   Les fichiers sont produits par scripts/images/build.py (voir l'en-tête
   du script) : packshots et objets composés avec l'étiquette et le logo
   d'origine, photographies sous licence Unsplash, scènes sans emballage.
   Chaque image est désignée par une clé logique (pack-<slug>, boisson-…),
   celle qu'emploient data/products.ts et data/recipes.ts.
   ────────────────────────────────────────────────────────────── */

export interface Credit {
  name: string;
  source: string;
  url?: string;
  note?: string;
}

export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL: string;
  /** cadrage préférentiel (object-position) */
  position?: string;
  credit?: Credit;
}

type Entry = { src: string; w: number; h: number; blur: string; credit?: Credit };
const manifest = generated as Record<string, Entry>;

export const hasPhoto = (key: string) => key in manifest;

const SEASON_NAME: Record<SeasonId, string> = { printemps: "printemps", ete: "été", automne: "automne", hiver: "hiver" };

/* textes alternatifs : ce que montre réellement chaque photographie */
const ALT: Record<string, string> = {
  // boissons et desserts (photographies Unsplash)
  "boisson-latte-1": "Latte au cœur de mousse dans une tasse blanche posée sur une planche d'olivier",
  "boisson-latte-2": "Cappuccino au dessin de lait dans une tasse ciselée, sur une table de bois",
  "boisson-latte-chai": "Latte au dessin de lait dans un verre à double paroi, sur une table de bois patiné",
  "boisson-iced-latte-1": "Iced latte en couches, glaçons et lait, dans un verre posé sur du bois",
  "boisson-iced-latte-2": "Lait versé sur un café glacé, dans un verre posé sur un dessous de verre en bois",
  "boisson-espresso-1": "Espresso court dans un petit verre, sur une soucoupe et une table de bois",
  "boisson-espresso-2": "Tasse d'espresso sur sa soucoupe, dans la lumière du matin",
  "boisson-chocolat-1": "Chocolat chaud versé dans une tasse de grès, éclats de chocolat sur la table",
  "boisson-chocolat-2": "Chocolat chaud épais dans un mug de grès, bâtons de cannelle",
  "boisson-chocolat-3": "Chocolat chaud aux guimauves dans une tasse ambrée ciselée, lumières tamisées",
  "boisson-chocolat-blanc": "Chocolat chaud mousseux dans une tasse blanche, sur une table sombre",
  "boisson-frappe-1": "Frappé crémeux coiffé de chantilly et d'un bâton de cannelle",
  "boisson-frappe-2": "Frappé au café nappé de chocolat, dans un verre à pied",
  "boisson-mocktail-peche": "Verres d'eau pétillante, menthe et quartiers de pêche sur un plateau, en plein soleil",
  "boisson-mocktail-orange": "Boisson orangée glacée et citron vert, sur une table de bois",
  "boisson-milkshake-fraise": "Milkshake à la fraise sur un coulis, dans un verre ciselé, fraises fraîches autour",
  "boisson-milkshake-choco": "Milkshake au chocolat, chantilly et paille rayée, posé sur un comptoir",
  "dessert-creme-brulee": "Crèmes brûlées caramélisées dans leurs ramequins, deux cuillères",
  barista: "Un barista verse le lait et dessine une feuille dans la mousse d'un café",
  // ingrédients
  "univers-dattes": "Dattes brillantes dans une assiette, sur un linge de lin",
  "univers-pistache": "Pistaches dans une coupe de bois et une pelle doseuse, sur un marbre rose",
  "univers-vanille": "Deux gousses de vanille sur un fond crème",
  "univers-praline": "Éclats de noix et de fruits secs caramélisés",
  "univers-caramel": "Caramel blond qui coule d'une cuillère dans un petit pot de verre",
  "univers-abricot": "Abricots entiers et ouverts autour d'une tasse de café, sur un papier kraft",
  "univers-choco-orange": "Carrés de chocolat, rondelles d'orange et macarons alignés sur fond blanc",
  "univers-choco-orange-2": "Rondelle d'orange, carrés de chocolat et cannelle sur un fond noir",
  "univers-cacao": "Tablette de chocolat entourée de fèves et d'éclats de cacao",
  "univers-choco-lait": "Tablettes de chocolat au lait cassées et fèves de cacao",
  "univers-choco-blanc": "Carrés de chocolat blanc empilés et amandes",
  "univers-noisette": "Noisettes dans une coupe dorée, sur un linge rayé",
  "univers-chai": "Bâtons de cannelle et anis étoilé sur un fond sombre",
  "univers-fleur-oranger": "Fleurs blanches d'oranger parmi les feuilles",
  "univers-cannelle": "Fagot de bâtons de cannelle noué de ficelle, sur un bois noir",
  "univers-chocolat-noir": "Chocolat noir et cacao en poudre dans une coupe de métal",
  // matières et paysages (scènes sans emballage)
  "matiere-fraises": "Fraises des bois et fleurs de fraisier sur un linge",
  "matiere-cerisier": "Branche de cerisier en fleurs dans la lumière du printemps",
  "matiere-poires": "Poires mûres sur la branche, au verger",
  "matiere-fleurs-oranger": "Fleurs et feuilles d'oranger",
  "paysage-printemps": "Jardin en terrasses d'un village méditerranéen au printemps, cerisiers et amandiers en fleurs, la mer au loin",
  "paysage-ete": "Terrasse sous la vigne au-dessus d'une baie méditerranéenne à l'heure dorée, cyprès et village perché",
  "paysage-automne": "Verger de poiriers et vignes d'automne sur des collines dominant un lac, ferme de pierre",
  "paysage-hiver": "Village côtier enneigé à la tombée du jour, fenêtres éclairées et trois-mâts au mouillage",
  "story-printemps": "Un trois-mâts au mouillage dans une baie calme, vu depuis une terrasse où reposent un carnet de voyage et une boussole",
  "story-ete": "Un trois-mâts au large d'un vieux quai de pierre, cordages lovés et bitte d'amarrage au premier plan",
  "story-automne": "Une carte marine, une longue-vue et un carnet sur le rebord d'une fenêtre ouverte sur une baie où navigue un trois-mâts",
  "story-hiver": "Un trois-mâts aux voiles ferlées dans un port d'hiver, une lanterne sur le quai enneigé",
  "detail-printemps": "Carnet de voyage ouvert, fleur séchée et boussole en laiton",
  "detail-ete": "Cordage de chanvre lové sur une bitte d'amarrage en pierre",
  "detail-automne": "Carte marine ancienne, longue-vue en laiton et plume",
  "detail-hiver": "Lanterne de navire allumée sur un muret enneigé",
  // gammes
  "gamme-saisons": "Les quatre sirops des Quatre Saisons alignés : Fraise des bois, Pêche blanche, Poire rôtie et Datte fondante",
  "gamme-signatures": "Les quatre sirops Signatures de la Maison alignés : Pistache grillée, Vanille torréfiée, Caramel blond et Chocolat noir",
  "gamme-poudres": "Quatre sachets de poudres signatures alignés : Pistache grillée, Chocolat noir, Vanille torréfiée et Chaï doux",
  "gamme-essentiels": "Quatre sachets kraft des Essentiels alignés : Chocolat noir intense, Chocolat au lait, Caramel beurre salé et Chaï épicé",
  "gamme-maison": "La famille Maison Sillage : un flacon Poire rôtie, un sachet Fraise des bois, un flacon Chocolat noir et un sachet kraft Vanille Bourbon",
};

const LIGHT_ALT: Record<Light, string> = { jour: "en plein jour", coucher: "au coucher du soleil", nuit: "au clair de lune" };

function productAlt(p: Product): string {
  if (p.category === "sirop") return `Flacon de sirop ${p.name}, étiquette Maison Sillage, sur un plateau de pierre`;
  if (p.category === "poudre") return `Sachet de poudre signature ${p.name}, étiquette Maison Sillage`;
  if (p.category === "essentiel") return `Sachet kraft ${p.name}, Les Essentiels de la Maison`;
  return `${p.name} marqué Maison Sillage — visuel d'intention`;
}

/** Photographie par clé logique. L'alternative est celle du registre, sauf texte fourni. */
export function photo(key: string, alt?: string, position?: string): Photo {
  const g = manifest[key];
  if (!g) throw new Error(`Image absente du manifeste : ${key} — lancer npm run images`);
  let text = alt ?? ALT[key];
  if (!text && (key.startsWith("pack-") || key.startsWith("acc-"))) {
    const slug = key.slice(key.startsWith("pack-") ? 5 : 4);
    const p = products.find((x) => x.slug === slug);
    if (p) text = productAlt(p);
  }
  return { src: g.src, width: g.w, height: g.h, alt: text ?? "", blurDataURL: g.blur, position, credit: g.credit };
}

/* ─────────────── Hero : la scène d'été, trois lumières, bureau + mobile ─────────────── */

/** Point focal du hero bureau (fractions de l'image) : il reste visible quel que soit le format d'écran */
export const HERO_FOCUS = { x: 0.58, y: 0.55 };
export const HERO_PRODUCTS = { sirop: "peche-blanche-fleur-oranger", poudre: "poudre-peche-blanche-fleur-oranger" };

export function heroPhotos(light: Light): { desktop: Photo; mobile: Photo } {
  const alt = `Sur une balustrade de pierre au-dessus de la Méditerranée, ${LIGHT_ALT[light]} : le flacon et le sachet Pêche blanche & Fleur d'oranger, un verre glacé, des pêches blanches, et un trois-mâts au large.`;
  return { desktop: photo(`hero-ete-${light}`, alt, "58% 55%"), mobile: photo(`hero-mobile-ete-${light}`, alt) };
}

/* ─────────────── Histoire et saisons ─────────────── */

export const storyPhoto = (season: SeasonId): Photo => photo(`story-${season}`);
export const storyDetail = (season: SeasonId): Photo => photo(`detail-${season}`);

/** Paysage et matière de chaque saison (photographies sans emballage) */
export const seasonImages: Record<SeasonId, { paysage: Photo; matiere: Photo }> = {
  printemps: { paysage: photo("paysage-printemps"), matiere: photo("matiere-fraises") },
  ete: { paysage: photo("paysage-ete"), matiere: photo("matiere-fleurs-oranger") },
  automne: { paysage: photo("paysage-automne"), matiere: photo("matiere-poires") },
  hiver: { paysage: photo("paysage-hiver"), matiere: photo("univers-dattes") },
};
export const seasonAlt = (s: SeasonId) => `Paysage de ${SEASON_NAME[s]}`;

/* ─────────────── Produits et recettes ─────────────── */

/** Galerie de fiche : la première image est le packshot (ou l'objet), les suivantes la matière et l'usage */
export const productPhotos = (p: Product): Photo[] => p.images.map((k) => photo(k));
/** Carte boutique : packshot, et photographie d'ambiance révélée au survol */
export const productCardPhotos = (p: Product): { main: Photo; hover?: Photo } => ({
  main: photo(p.images[0]),
  hover: p.images[1] ? photo(p.images[1]) : undefined,
});
export const recipePhoto = (r: Recipe): Photo => photo(r.image);

/* ─────────────── Attribution par section ─────────────── */

export const home = {
  univers: {
    sirops: photo("gamme-saisons"),
    poudres: photo("pack-poudre-chocolat-noir-orange-confite"),
    essentiels: photo("pack-chocolat-au-lait-onctueux"),
    atelier: photo("acc-tasse-espresso-gres"),
  },
  essentiels: photo("gamme-essentiels"),
  pro: photo("barista"),
};

export const pages = {
  boutique: photo("gamme-maison"),
  sirops: photo("gamme-saisons"),
  poudres: photo("gamme-poudres"),
  essentiels: photo("gamme-essentiels"),
  atelier: photo("boisson-espresso-2"),
  recettes: photo("boisson-chocolat-3"),
  professionnels: photo("barista"),
  maison: { carnet: photo("detail-printemps"), matieres: photo("univers-vanille") },
  /** une photographie par étape de la démarche */
  savoirFaire: [photo("matiere-cerisier"), photo("univers-choco-orange"), photo("univers-cacao"), photo("boisson-latte-1"), photo("univers-praline"), photo("gamme-maison")],
};

/** Photographie d'ouverture de chaque article du Journal */
export const articlePhotos: Record<string, Photo> = {
  "petite-histoire-du-sirop": photo("gamme-signatures"),
  "l-art-du-latte": photo("boisson-latte-1"),
  "boissons-gourmandes-de-saison": photo("paysage-automne"),
  "imaginer-une-carte-de-boissons": photo("barista"),
  "l-inspiration-des-routes-maritimes": photo("story-automne"),
};

/** Crédits : toutes les sources publiées, regroupées par auteur */
export function credits(): { name: string; source: string; url?: string; note?: string; keys: string[] }[] {
  const by = new Map<string, { name: string; source: string; url?: string; note?: string; keys: string[] }>();
  for (const [key, e] of Object.entries(manifest)) {
    if (!e.credit) continue;
    const id = `${e.credit.name}|${e.credit.url ?? e.credit.source}|${e.credit.note ?? ""}`;
    const cur = by.get(id) ?? { ...e.credit, keys: [] };
    cur.keys.push(key);
    by.set(id, cur);
  }
  return [...by.values()].sort((a, b) => a.source.localeCompare(b.source) || a.name.localeCompare(b.name));
}
