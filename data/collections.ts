import type { Category, Collection, DrinkType, Envie, Light, Season, SeasonId, Status } from "../lib/types";

export const seasons: Season[] = [
  {
    id: "printemps",
    name: "Printemps",
    chapter: "Le jardin au retour du large",
    sirop: "fraise-des-bois-creme-de-madeleine",
    accent: "#c27d86",
    mood: ["Jardin fleuri", "Lumière douce", "Fleurs roses et blanches", "Terrasse élégante"],
    intro:
      "On rentre au port, les vergers sont en fleurs. Le printemps de Maison Sillage a le goût des goûters retrouvés : fraises des bois, gâteau moelleux, vanille pâtissière.",
    carnet: "Premier jour à terre. Des fraises dans un cornet de papier, et l'odeur du beurre qui dore.",
  },
  {
    id: "ete",
    name: "Été",
    chapter: "Les terrasses de la Méditerranée",
    sirop: "peche-blanche-fleur-oranger",
    accent: "#d08a5c",
    mood: ["Terrasse méditerranéenne", "Mer bleue", "Soleil doré", "Boissons glacées"],
    intro:
      "Le soleil de l'après-midi, l'ombre d'un oranger, un verre qui perle face à la mer. L'été se boit glacé et pétillant, avec des pêches mûres et des fleurs blanches.",
    carnet: "Escale à midi. Pêches au marché, fleurs d'oranger sur le quai : tout embaume.",
  },
  {
    id: "automne",
    name: "Automne",
    chapter: "Le verger des premières brumes",
    sirop: "poire-rotie-sable-noisette",
    accent: "#b0702f",
    mood: ["Feuilles dorées", "Bois chaleureux", "Poire rôtie", "Café gourmand"],
    intro:
      "Les jours raccourcissent, la lumière se fait ambrée et l'on revient aux boissons chaudes. L'automne réunit la poire rôtie, le biscuit sablé et la noisette torréfiée.",
    carnet: "Brume sur l'estuaire. À bord, des poires qui rôtissent doucement et l'odeur du café.",
  },
  {
    id: "hiver",
    name: "Hiver",
    chapter: "La veillée au coin du feu",
    sirop: "datte-fondante-creme-brulee",
    accent: "#6f8aa6",
    mood: ["Intérieur ancien", "Cheminée", "Lumière feutrée", "Boissons chaudes"],
    intro:
      "Dehors la mer est grise et la neige tombe sur le village ; dedans, le feu crépite et les tasses fument. L'hiver est la saison des saveurs profondes : datte, crème vanillée, sucre grillé.",
    carnet: "Port d'hiver. Un chocolat épais, une crème brûlée qu'on partage : la traversée peut attendre.",
  },
];

export const getSeason = (id: SeasonId) => seasons.find((s) => s.id === id)!;

export const lights: { id: Light; name: string; text: string }[] = [
  { id: "jour", name: "Jour", text: "Lumière naturelle, ciel bleu, couleurs franches." },
  { id: "coucher", name: "Coucher de soleil", text: "Lumière dorée, reflets chauds sur la mer." },
  { id: "nuit", name: "Nuit", text: "Clair de lune, étoiles et lanternes." },
];

export const categoryLabels: Record<Category, string> = {
  sirop: "Sirop signature",
  poudre: "Poudre signature",
  essentiel: "Les Essentiels",
  accessoire: "L'Atelier",
  coffret: "Coffret",
};

/** rayons de la boutique, dans l'ordre de la navigation */
export const shopTabs: { id: Category | "tous"; label: string; href: string }[] = [
  { id: "tous", label: "Tous les produits", href: "/boutique" },
  { id: "sirop", label: "Sirops", href: "/boutique?categorie=sirop" },
  { id: "poudre", label: "Poudres signatures", href: "/boutique?categorie=poudre" },
  { id: "essentiel", label: "Les Essentiels", href: "/boutique?categorie=essentiel" },
  { id: "accessoire", label: "Accessoires", href: "/boutique?categorie=accessoire" },
  { id: "coffret", label: "Coffrets", href: "/boutique?categorie=coffret" },
];

export const collectionLabels: Record<Collection, string> = {
  "quatre-saisons": "Collection Les Quatre Saisons",
  "signatures-maison": "Les Signatures de la Maison",
  "poudres-saisonnieres": "Poudres saisonnières",
  "poudres-permanentes": "Poudres permanentes",
  essentiels: "Les Essentiels de la Maison",
  atelier: "L'Atelier & les Accessoires",
};

export const statusLabels: Record<Status, string> = {
  concept: "Concept — saveur à développer",
  prototype: "Prototype — formulation en cours",
  selection: "Objet en sélection — fabricant à définir",
};

export const drinkTypes: { id: DrinkType; label: string; hint: string }[] = [
  { id: "espresso", label: "Espresso", hint: "court et intense" },
  { id: "latte", label: "Latte", hint: "chaud et soyeux" },
  { id: "iced-latte", label: "Iced latte", hint: "glacé, en couches" },
  { id: "chocolat", label: "Chocolat chaud", hint: "épais, réconfortant" },
  { id: "frappe", label: "Frappé", hint: "mixé sur glace" },
  { id: "mocktail", label: "Mocktail", hint: "pétillant, sans alcool" },
  { id: "milkshake", label: "Milkshake", hint: "glace et lait froid" },
];

export const envies: { id: Envie; label: string }[] = [
  { id: "gourmand", label: "Gourmand" },
  { id: "fruite", label: "Fruité" },
  { id: "chocolate", label: "Chocolaté" },
  { id: "doux", label: "Doux" },
  { id: "epice", label: "Épicé" },
  { id: "intense", label: "Intense" },
];
