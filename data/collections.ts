import type { Profile, Season, SeasonId, Usage, RecipeCategory, Light } from "@/lib/types";

export const seasons: Season[] = [
  {
    id: "printemps",
    name: "Printemps",
    numeral: "I",
    chapter: "Le jardin au retour du large",
    flavor: "fraise",
    accent: "#c27d86",
    mood: ["Jardin fleuri", "Lumière douce", "Fleurs roses et blanches", "Terrasse élégante"],
    intro:
      "On rentre au port, les vergers sont en fleurs. Le printemps de Maison Sillage a le goût des goûters retrouvés : fraises des bois, madeleines encore tièdes, vanille douce.",
    carnet: "Premier jour à terre. Des fraises dans un cornet de papier, et l'odeur du beurre qui dore.",
    ambiance: ["Fruits rouges", "Biscuits", "Douceur lactée"],
  },
  {
    id: "ete",
    name: "Été",
    numeral: "II",
    chapter: "Les terrasses de la Méditerranée",
    flavor: "peche",
    accent: "#d08a5c",
    mood: ["Terrasse méditerranéenne", "Mer bleue", "Soleil doré", "Boissons glacées"],
    intro:
      "Le soleil de l'après-midi, l'ombre d'un oranger, un verre qui perle face à la mer. L'été se boit glacé et pétillant, avec des pêches mûres et des fleurs blanches.",
    carnet: "Escale à midi. Pêches au marché, fleurs d'oranger sur le quai : tout embaume.",
    ambiance: ["Fruits blancs", "Fleurs", "Boissons glacées"],
  },
  {
    id: "automne",
    name: "Automne",
    numeral: "III",
    chapter: "Le verger des premières brumes",
    flavor: "poire",
    accent: "#b0702f",
    mood: ["Feuilles dorées", "Bois chaleureux", "Poire mûre", "Café gourmand"],
    intro:
      "Les jours raccourcissent, la lumière se fait ambrée et l'on revient aux boissons chaudes. L'automne réunit les poires fondantes, la vanille et les épices d'un comptoir lointain.",
    carnet: "Brume sur l'estuaire. Dans la cale, des sacs de cannelle ; à bord, une poire qui compote doucement.",
    ambiance: ["Fruits compotés", "Vanille", "Épices"],
  },
  {
    id: "hiver",
    name: "Hiver",
    numeral: "IV",
    chapter: "La veillée au coin du feu",
    flavor: "datte",
    accent: "#6f8aa6",
    mood: ["Intérieur ancien", "Cheminée", "Lumière feutrée", "Boissons chaudes"],
    intro:
      "Dehors la mer est grise et la neige tombe sur le village ; dedans, le feu crépite et les tasses fument. L'hiver est la saison des saveurs profondes : dattes, caramel, sucre brûlé.",
    carnet: "Port d'hiver. Un chocolat épais, une crème brûlée qu'on partage : la traversée peut attendre.",
    ambiance: ["Caramel", "Cacao", "Pâtisserie"],
  },
];

export const getSeason = (id: SeasonId) => seasons.find((s) => s.id === id)!;

export const lights: { id: Light; name: string; text: string }[] = [
  { id: "jour", name: "Jour", text: "Lumière naturelle, ciel bleu, couleurs franches." },
  { id: "coucher", name: "Coucher de soleil", text: "Lumière dorée, reflets chauds sur la mer." },
  { id: "nuit", name: "Nuit", text: "Clair de lune, étoiles et lanternes." },
];

export const profileLabels: Record<Profile, string> = {
  fruite: "Fruité",
  floral: "Floral",
  patissier: "Pâtissier",
  epice: "Épicé",
  cacaote: "Cacaoté",
  "fruits-secs": "Fruits secs",
};

export const usageLabels: Record<Usage, string> = {
  latte: "Latte",
  cafe: "Café",
  "latte-glace": "Iced latte",
  mocktail: "Mocktail sans alcool",
  limonade: "Limonade",
  chocolat: "Chocolat chaud",
  frappe: "Frappé",
  milkshake: "Milkshake",
  dessert: "Dessert",
};

export const recipeCategoryLabels: Record<RecipeCategory, string> = {
  latte: "Latte",
  "latte-glace": "Iced latte",
  cafe: "Café",
  mocktail: "Mocktail sans alcool",
  chocolat: "Chocolat chaud",
  milkshake: "Milkshake",
  dessert: "Dessert",
};

export const categoryLabels = {
  sirop: "Sirop signature",
  poudre: "Préparation en poudre",
  coffret: "Coffret",
} as const;
