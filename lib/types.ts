export type SeasonId = "printemps" | "ete" | "automne" | "hiver";
export type Light = "jour" | "coucher" | "nuit";

/** Les cinq rayons de la boutique */
export type Category = "sirop" | "poudre" | "essentiel" | "accessoire" | "coffret";

/** Collections éditoriales, à l'intérieur des rayons */
export type Collection =
  | "quatre-saisons"
  | "signatures-maison"
  | "poudres-saisonnieres"
  | "poudres-permanentes"
  | "essentiels"
  | "atelier";

/** Boissons proposées par le Comptoir des Saveurs et les filtres de la boutique */
export type DrinkType = "espresso" | "latte" | "iced-latte" | "chocolat" | "frappe" | "mocktail" | "milkshake";

/** Envies du Comptoir des Saveurs */
export type Envie = "gourmand" | "fruite" | "chocolate" | "doux" | "epice" | "intense";

/** Familles de saveurs (filtre « Saveur ») */
export type Saveur = "fruits" | "chocolat" | "vanille-caramel" | "fruits-secs" | "epices" | "floral" | "patissier";

/** Statut de développement : rien n'est formulé ni fabriqué à ce jour */
export type Status = "concept" | "prototype" | "selection";

export interface Format {
  id: string;
  label: string;
  /** contenance affichée ; sert aussi au filtre « Format » */
  contenance: string;
  public: "particulier" | "professionnel";
  /** prix de démonstration ; null = sur devis ou sur demande */
  price: number | null;
  tax: "TTC" | "HT";
}

/** Préparation proposée pour une boisson : définie produit par produit, utilisée par le Comptoir des Saveurs */
export interface Serving {
  drink: DrinkType;
  /** dosage de démonstration, ex. « 20 ml » */
  dose: string;
  /** recette complète associée, si elle existe */
  recipe?: string;
}

export interface Product {
  /** référence interne de démonstration, ex. « MS-SIR-03 » */
  id: string;
  slug: string;
  name: string;
  category: Category;
  collection: Collection;
  season: SeasonId | null;
  status: Status;
  tagline: string;
  /** description sensorielle courte (cartes, Comptoir) */
  description: string;
  story: string[];
  notes: string[];
  saveurs: Saveur[];
  envies: Envie[];
  servings: Serving[];
  /** usages recommandés, en clair */
  usages: string[];
  usageIdeas: { title: string; text: string }[];
  formats: Format[];
  /** clés du registre photographique (data/images.ts) : première = photographie principale */
  images: string[];
  /** recettes associées (slugs) */
  recipes: string[];
  complements: string[];
  palette: { accent: string; tint: string; deep: string };
  /** étiquette (sirops et poudres) : deux lignes de saveur */
  label?: [string, string];
  /** couleur du sirop pour le packshot (sirops) */
  liquid?: string;
  /** accessoires : caractéristiques, contenu du coffret */
  details?: { label: string; value: string }[];
  faq: { q: string; a: string }[];
  seo: string;
}

export interface Recipe {
  slug: string;
  title: string;
  drink: DrinkType | "dessert";
  products: string[];
  envies: Envie[];
  seasons: SeasonId[];
  intro: string;
  temps: string;
  service: string;
  ingredients: { qty: string; item: string; product?: string }[];
  steps: string[];
  final: string;
  conseil: string;
  /** clé du registre photographique */
  image: string;
}

export interface Season {
  id: SeasonId;
  name: string;
  chapter: string;
  /** sirop signature de la saison */
  sirop: string;
  /** couleur d'accent de la saison (pastilles, filets) */
  accent: string;
  /** ambiance photographique, en quelques mots */
  mood: string[];
  intro: string;
  carnet: string;
}

export interface Article {
  slug: string;
  title: string;
  rubrique: string;
  lecture: string;
  chapo: string;
  body: ({ type: "p"; text: string } | { type: "h2"; text: string } | { type: "quote"; text: string })[];
}
