import type { Profile, Season, SeasonId, Usage, RecipeCategory } from "@/lib/types";

export const seasons: Season[] = [
  {
    id: "printemps",
    name: "Printemps",
    numeral: "I",
    chapter: "Le jardin au retour du large",
    accent: "#b98a88",
    bg: "#f4e4de",
    ink: "#4a2a2a",
    paper: "#fbf1ec",
    intro:
      "On rentre au port, les vergers sont en fleurs. Le printemps de Maison Sillage a le goût des goûters retrouvés : fruits rouges, biscuits encore tièdes, vanille douce.",
    carnet: "Premier jour à terre. Des fraises dans un cornet de papier, et l'odeur du beurre qui dore.",
    ambiance: ["Fruits rouges", "Biscuits", "Douceur lactée"],
  },
  {
    id: "ete",
    name: "Été",
    numeral: "II",
    chapter: "Les comptoirs de la Méditerranée",
    accent: "#d8936a",
    bg: "#f8e6d6",
    ink: "#5a301c",
    paper: "#fdf3ea",
    intro:
      "Le soleil de l'après-midi, l'ombre d'un oranger, un verre qui perle. L'été se boit glacé, pétillant, floral, avec des fruits à chair blanche et des fruits secs tendres.",
    carnet: "Escale à midi. Pêches au marché, fleurs d'oranger sur le quai : tout embaume.",
    ambiance: ["Fruits blancs", "Fleurs", "Boissons glacées"],
  },
  {
    id: "automne",
    name: "Automne",
    numeral: "III",
    chapter: "La route des épices",
    accent: "#a9692f",
    bg: "#efdcc0",
    ink: "#4a2c14",
    paper: "#f8ecd8",
    intro:
      "Les jours raccourcissent, on revient aux boissons chaudes. L'automne réunit les poires fondantes, la vanille et les épices d'un comptoir lointain.",
    carnet: "Brume sur l'estuaire. Dans la cale, des sacs de cannelle ; à bord, une poire qui compote doucement.",
    ambiance: ["Fruits compotés", "Vanille", "Épices"],
  },
  {
    id: "hiver",
    name: "Hiver",
    numeral: "IV",
    chapter: "La veillée au coin du feu",
    accent: "#5e3b2a",
    bg: "#e6d6c6",
    ink: "#2e1a10",
    paper: "#f3e8dc",
    intro:
      "Dehors la mer est grise, dedans les tasses fument. L'hiver est la saison des saveurs profondes : dattes caramélisées, cacao, sucre brûlé.",
    carnet: "Port d'hiver. Un chocolat épais, une crème brûlée qu'on partage : la traversée peut attendre.",
    ambiance: ["Caramel", "Cacao", "Pâtisserie"],
  },
];

export const getSeason = (id: SeasonId) => seasons.find((s) => s.id === id)!;

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
  "latte-glace": "Latte glacé",
  mocktail: "Mocktail sans alcool",
  limonade: "Limonade",
  chocolat: "Chocolat chaud",
  frappe: "Frappé",
  milkshake: "Milkshake",
  dessert: "Dessert",
};

export const recipeCategoryLabels: Record<RecipeCategory, string> = {
  "cafe-chaud": "Café chaud",
  "latte-glace": "Latte glacé",
  chocolat: "Chocolat",
  mocktail: "Mocktail sans alcool",
  milkshake: "Milkshake",
  frappe: "Frappé",
  dessert: "Dessert",
};

export const categoryLabels = {
  sirop: "Sirop signature",
  poudre: "Préparation en poudre",
  coffret: "Coffret",
} as const;
