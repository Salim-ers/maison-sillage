import type { Recipe } from "@/lib/types";

/* Dosages : propositions culinaires de démonstration,
   pas des spécifications définitives des produits. */

export const recipes: Recipe[] = [
  {
    slug: "latte-datte-creme-brulee",
    title: "Latte Datte & Crème brûlée",
    category: "latte",
    products: ["datte-medjool-creme-brulee", "poudre-datte-medjool-creme-brulee"],
    intro:
      "Le latte des soirées d'hiver : un espresso, un lait fouetté avec la poudre Datte & Crème brûlée, et des éclats de sucre grillé qui craquent sous la cuillère.",
    temps: "6 min",
    service: "1 verre de 30 cl",
    ingredients: [
      { qty: "2 c. à café", item: "préparation Datte Medjool & Crème brûlée", product: "poudre-datte-medjool-creme-brulee" },
      { qty: "10 ml", item: "sirop Datte Medjool & Crème brûlée", product: "datte-medjool-creme-brulee" },
      { qty: "1", item: "espresso (environ 30 ml)" },
      { qty: "200 ml", item: "lait entier ou boisson d'avoine" },
      { qty: "1 c. à café", item: "de sucre roux, pour les éclats" },
    ],
    steps: [
      "Chauffez le lait sans dépasser 65 °C et fouettez-y la préparation jusqu'à dissolution complète.",
      "Versez le sirop au fond du verre, puis l'espresso.",
      "Ajoutez le lait en filet, en terminant par la mousse.",
      "Caramélisez le sucre roux au chalumeau sur une plaque, brisez-le en éclats et parsemez-en la mousse.",
    ],
    final: "Une boisson ronde et profonde, où la datte apporte son caramel naturel et le sucre grillé un craquant inattendu.",
    conseil: "Préparez les éclats de sucre à l'avance : ils se conservent quelques heures au sec.",
  },
  {
    slug: "iced-latte-poire-vanille",
    title: "Iced latte Poire & Vanille",
    category: "latte-glace",
    products: ["poire-fondante-vanille-bourbon"],
    intro:
      "Un latte glacé en couches, à regarder avant de le mélanger : la poire au fond, le lait froid, l'espresso qui descend lentement, une chantilly légère.",
    temps: "5 min",
    service: "1 verre de 35 cl",
    ingredients: [
      { qty: "20 ml", item: "sirop Poire fondante & Vanille Bourbon", product: "poire-fondante-vanille-bourbon" },
      { qty: "1", item: "espresso double, refroidi" },
      { qty: "150 ml", item: "lait froid" },
      { qty: "6", item: "glaçons" },
      { qty: "1 cuillère", item: "de chantilly, facultative" },
    ],
    steps: [
      "Versez le sirop au fond d'un grand verre.",
      "Ajoutez les glaçons, puis le lait froid en le faisant couler sur le dos d'une cuillère.",
      "Terminez par l'espresso, versé très lentement pour garder des couches nettes.",
      "Coiffez d'une chantilly légère et d'une fine tranche de poire séchée.",
    ],
    final: "Un dégradé ambré et ivoire ; une fois mélangé, une boisson fraîche où la vanille arrondit l'amertume du café.",
    conseil: "Un espresso refroidi évite que la glace ne fonde trop vite et ne dilue les couches.",
  },
  {
    slug: "cafe-du-large-poire",
    title: "Café du large à la Poire",
    category: "cafe",
    products: ["poire-fondante-vanille-bourbon"],
    intro:
      "Le plus simple des gestes : un café allongé, une cuillère de sirop, une terrasse face à la mer. La poire adoucit le café sans le masquer.",
    temps: "3 min",
    service: "1 tasse de 20 cl",
    ingredients: [
      { qty: "10 ml", item: "sirop Poire fondante & Vanille Bourbon", product: "poire-fondante-vanille-bourbon" },
      { qty: "150 ml", item: "café filtre ou allongé, fraîchement préparé" },
      { qty: "1 trait", item: "de lait chaud, facultatif" },
    ],
    steps: ["Préchauffez la tasse à l'eau chaude.", "Versez le sirop, puis le café chaud, et mélangez une fois.", "Ajoutez un trait de lait chaud si vous aimez les cafés plus ronds."],
    final: "Un café du matin plus rond, avec une note de poire mûre qui revient en fin de tasse.",
    conseil: "Commencez par un petit dosage : on doit goûter le café, pas le sirop.",
  },
  {
    slug: "mocktail-petillant-peche-blanche",
    title: "Mocktail pétillant Pêche blanche",
    category: "mocktail",
    products: ["peche-blanche-fleur-oranger"],
    intro:
      "Le verre d'été de la Maison, sans alcool : des tranches de pêche, beaucoup de glace, une eau très pétillante et la fleur d'oranger qui flotte au-dessus.",
    temps: "3 min",
    service: "1 verre de 35 cl",
    ingredients: [
      { qty: "25 ml", item: "sirop Pêche blanche & Fleur d'oranger", product: "peche-blanche-fleur-oranger" },
      { qty: "200 ml", item: "eau pétillante bien froide" },
      { qty: "½", item: "pêche blanche en tranches fines" },
      { qty: "1 trait", item: "de jus de citron" },
      { qty: "Quelques", item: "feuilles de menthe et glaçons" },
    ],
    steps: [
      "Disposez les tranches de pêche contre la paroi du verre, puis remplissez de glace.",
      "Versez le sirop et le jus de citron.",
      "Complétez doucement avec l'eau pétillante pour garder les bulles.",
      "Terminez par la menthe, légèrement froissée entre les doigts.",
    ],
    final: "Un verre lumineux et désaltérant, fruité d'abord, floral en finale.",
    conseil: "Mettez le verre au congélateur quelques minutes avant le service.",
  },
  {
    slug: "chocolat-chaud-datte-creme-brulee",
    title: "Chocolat chaud Datte & Crème brûlée",
    category: "chocolat",
    products: ["poudre-datte-medjool-creme-brulee", "datte-medjool-creme-brulee"],
    intro:
      "Le chocolat de la veillée : épais, sombre, relevé par la datte et une note de sucre brûlé. À boire lentement, près d'une fenêtre où tombe la neige.",
    temps: "8 min",
    service: "1 grande tasse de 30 cl",
    ingredients: [
      { qty: "3 c. à soupe", item: "préparation Datte Medjool & Crème brûlée", product: "poudre-datte-medjool-creme-brulee" },
      { qty: "20 g", item: "de chocolat noir haché" },
      { qty: "10 ml", item: "sirop Datte Medjool & Crème brûlée", product: "datte-medjool-creme-brulee" },
      { qty: "250 ml", item: "lait entier" },
    ],
    steps: [
      "Faites chauffer le lait à feu doux, sans le faire bouillir.",
      "Ajoutez le chocolat haché et la préparation, en fouettant jusqu'à obtenir une texture lisse.",
      "Laissez épaissir deux minutes en remuant.",
      "Versez le sirop dans la tasse, puis le chocolat chaud par-dessus.",
    ],
    final: "Un chocolat dense et velouté, où la datte et le sucre grillé prolongent chaque gorgée.",
    conseil: "Pour une texture encore plus épaisse, prolongez la cuisson une minute en fouettant sans cesse.",
  },
  {
    slug: "milkshake-fraise-madeleine",
    title: "Milkshake Fraise & Madeleine",
    category: "milkshake",
    products: ["fraise-des-bois-madeleine-doree", "poudre-fraise-des-bois-madeleine-doree"],
    intro:
      "Le goûter de printemps en verre : une glace vanille, un lait froid, la fraise et la madeleine. Une chantilly et des éclats de biscuit pour finir.",
    temps: "5 min",
    service: "1 verre de 40 cl",
    ingredients: [
      { qty: "20 ml", item: "sirop Fraise des bois & Madeleine dorée", product: "fraise-des-bois-madeleine-doree" },
      { qty: "1 c. à soupe", item: "préparation Fraise des bois & Madeleine dorée", product: "poudre-fraise-des-bois-madeleine-doree" },
      { qty: "2 boules", item: "de glace vanille" },
      { qty: "150 ml", item: "lait froid" },
      { qty: "1", item: "madeleine émiettée, pour le décor" },
    ],
    steps: [
      "Versez le lait, la glace, le sirop et la préparation dans un blender.",
      "Mixez une trentaine de secondes, jusqu'à obtenir une texture épaisse et mousseuse.",
      "Versez dans un grand verre bien froid.",
      "Coiffez de chantilly, de madeleine émiettée et d'une fraise.",
    ],
    final: "Un milkshake rose pâle, gourmand et frais, qui a le goût d'un goûter au jardin.",
    conseil: "Gardez quelques fraises au congélateur : elles remplacent une partie de la glace.",
  },
  {
    slug: "creme-brulee-datte-medjool",
    title: "Crème brûlée à la Datte Medjool",
    category: "dessert",
    products: ["datte-medjool-creme-brulee"],
    intro:
      "Le dessert qui a inspiré notre création d'hiver, revisité avec elle : une crème onctueuse, une cuillère de sirop dans l'appareil, une croûte de sucre bien craquante.",
    temps: "20 min + cuisson",
    service: "4 ramequins",
    ingredients: [
      { qty: "40 ml", item: "sirop Datte Medjool & Crème brûlée", product: "datte-medjool-creme-brulee" },
      { qty: "400 ml", item: "crème liquide entière" },
      { qty: "4", item: "jaunes d'œufs" },
      { qty: "40 g", item: "de sucre, plus du sucre roux pour caraméliser" },
    ],
    steps: [
      "Chauffez la crème avec le sirop sans la faire bouillir.",
      "Fouettez les jaunes avec le sucre, puis versez la crème chaude en filet.",
      "Répartissez dans les ramequins et faites cuire au bain-marie à 100 °C environ 50 minutes.",
      "Laissez refroidir, puis caramélisez une fine couche de sucre roux au chalumeau juste avant de servir.",
    ],
    final: "Une crème vanillée au parfum de datte confite, sous une croûte de sucre qui cède sous la cuillère.",
    conseil: "Servez les crèmes bien froides et le caramel encore tiède : c'est tout le contraste.",
  },
  {
    slug: "latte-poire-vanille",
    title: "Latte Poire & Vanille",
    category: "latte",
    products: ["poudre-poire-fondante-vanille-bourbon", "poire-fondante-vanille-bourbon"],
    intro:
      "La recette qui a fait naître la collection d'automne : un espresso, un lait soyeux fouetté avec la poudre Poire & Vanille, et une pincée de cannelle.",
    temps: "5 min",
    service: "1 verre de 30 cl",
    ingredients: [
      { qty: "2 c. à café", item: "préparation Poire fondante & Vanille Bourbon", product: "poudre-poire-fondante-vanille-bourbon" },
      { qty: "1", item: "espresso (environ 30 ml)" },
      { qty: "180 ml", item: "lait entier ou boisson d'avoine" },
      { qty: "1 pincée", item: "de cannelle, facultative" },
    ],
    steps: [
      "Chauffez et moussez le lait jusqu'à obtenir une mousse fine et brillante, sans dépasser 65 °C.",
      "Fouettez-y la préparation jusqu'à dissolution complète.",
      "Versez l'espresso dans le verre, puis le lait en filet régulier en terminant par la mousse.",
      "Une pincée de cannelle si vous le souhaitez.",
    ],
    final: "Un latte rond et doux, où la poire compotée se devine sous le café et la vanille s'attarde en fin de gorgée.",
    conseil: "Avec une boisson d'avoine, la note de poire paraît encore plus fondante.",
  },
];

export const getRecipe = (slug: string) => recipes.find((r) => r.slug === slug);
export const recipesForProduct = (slug: string) => recipes.filter((r) => r.products.includes(slug));
