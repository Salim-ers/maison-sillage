export type Category = "sirop" | "poudre" | "coffret";
export type SeasonId = "printemps" | "ete" | "automne" | "hiver";
export type Profile = "fruite" | "floral" | "patissier" | "epice" | "cacaote" | "fruits-secs";
export type Usage =
  | "latte"
  | "cafe"
  | "latte-glace"
  | "mocktail"
  | "limonade"
  | "chocolat"
  | "frappe"
  | "milkshake"
  | "dessert";

export type BotanicalId =
  | "fraise"
  | "madeleine"
  | "peche"
  | "fleur-oranger"
  | "poire"
  | "vanille"
  | "datte"
  | "pistache"
  | "chai"
  | "cacao"
  | "biscuit"
  | "cafe"
  | "fleur-de-sel";

export type PackKind = "bouteille" | "doypack-ivoire" | "doypack-brun" | "coffret";

export interface Format {
  id: string;
  label: string;
  contenance: string;
  public: "particulier" | "professionnel";
  price: number;
  tax: "TTC" | "HT";
}

export interface ProductPalette {
  /** couleur du sirop / de la poudre */
  liquid: string;
  /** couleur d'accent liée à la saveur (bandeau d'étiquette, cachet) */
  accent: string;
  /** fond d'ambiance très clair */
  tint: string;
  /** teinte profonde pour les surfaces sombres */
  deep: string;
}

export interface Product {
  slug: string;
  name: string;
  /** deux lignes d'étiquette, ex. ["Poire fondante", "Vanille Bourbon"] */
  labelLines: [string, string];
  category: Category;
  season: SeasonId | null;
  status: "prototype" | "a-venir";
  profiles: Profile[];
  notes: string[];
  tagline: string;
  story: string[];
  usages: Usage[];
  usageIdeas: { title: string; text: string }[];
  formats: Format[];
  palette: ProductPalette;
  botanicals: BotanicalId[];
  pack: PackKind;
  contents?: string[];
  complements: string[];
  faq: { q: string; a: string }[];
  seo: string;
}

export type RecipeCategory =
  | "cafe-chaud"
  | "latte-glace"
  | "chocolat"
  | "mocktail"
  | "milkshake"
  | "frappe"
  | "dessert";

export type VesselKind = "tasse" | "verre-haut" | "mug-verre" | "tulipe" | "highball" | "coupe";

export interface DrinkLook {
  vessel: VesselKind;
  layers: { color: string; height: number }[];
  top?: "mousse" | "chantilly" | "glace" | "boule" | "aucun";
  topColor?: string;
  ice?: boolean;
  bubbles?: boolean;
  straw?: boolean;
  steam?: boolean;
  garnish?: BotanicalId;
  dust?: string;
}

export interface Recipe {
  slug: string;
  title: string;
  category: RecipeCategory;
  products: string[];
  intro: string;
  temps: string;
  service: string;
  ingredients: { qty: string; item: string; product?: string }[];
  steps: string[];
  final: string;
  conseil: string;
  look: DrinkLook;
  scene: { bg: string; surface: string };
}

export interface Season {
  id: SeasonId;
  name: string;
  numeral: string;
  chapter: string;
  accent: string;
  bg: string;
  ink: string;
  paper: string;
  intro: string;
  carnet: string;
  ambiance: string[];
}

export interface Article {
  slug: string;
  title: string;
  rubrique: string;
  lecture: string;
  chapo: string;
  body: ({ type: "p"; text: string } | { type: "h2"; text: string } | { type: "quote"; text: string })[];
  visual: "carte" | "verre" | "saisons" | "comptoir" | "alambic";
}
