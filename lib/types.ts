export type Category = "sirop" | "poudre" | "coffret";
export type SeasonId = "printemps" | "ete" | "automne" | "hiver";
export type Light = "jour" | "coucher" | "nuit";
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

/** Les quatre saveurs signatures, déclinées en sirop et en poudre */
export type Flavor = "fraise" | "peche" | "poire" | "datte";

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
  /** couleur d'accent liée à la saveur */
  accent: string;
  /** fond d'ambiance très clair */
  tint: string;
  /** teinte profonde pour les surfaces sombres */
  deep: string;
}

export interface Product {
  slug: string;
  name: string;
  /** nom court de la saveur, sans la gamme */
  flavorName: string;
  flavor: Flavor | null;
  category: Category;
  season: SeasonId | null;
  status: "prototype" | "a-venir";
  profiles: Profile[];
  notes: string[];
  tagline: string;
  /** description sensorielle courte (cartes, sélecteurs) */
  sensory: string;
  story: string[];
  usages: Usage[];
  usageIdeas: { title: string; text: string }[];
  formats: Format[];
  palette: ProductPalette;
  contents?: string[];
  complements: string[];
  faq: { q: string; a: string }[];
  seo: string;
}

export type RecipeCategory = "latte" | "latte-glace" | "cafe" | "mocktail" | "chocolat" | "milkshake" | "dessert";

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
}

export interface Season {
  id: SeasonId;
  name: string;
  numeral: string;
  chapter: string;
  /** création signature de la saison */
  flavor: Flavor;
  /** couleur d'accent de la saison (pastilles, filets) */
  accent: string;
  /** ambiance photographique, en quelques mots */
  mood: string[];
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
}
