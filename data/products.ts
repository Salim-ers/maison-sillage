import type { Format, Product } from "@/lib/types";

/* ──────────────────────────────────────────────────────────────
   Catalogue de démonstration — Maison Sillage
   Toutes les créations, formats et tarifs sont fictifs et indicatifs.
   Aucune composition, valeur nutritionnelle ou certification n'est
   avancée tant que les formulations ne sont pas finalisées.
   ────────────────────────────────────────────────────────────── */

const SIROP_FORMATS: Format[] = [
  { id: "250ml", label: "Flacon 250 ml", contenance: "250 ml", public: "particulier", price: 12.9, tax: "TTC" },
  { id: "700ml", label: "Bouteille professionnelle 700 ml", contenance: "700 ml", public: "professionnel", price: 14.9, tax: "HT" },
];

const POUDRE_FORMATS: Format[] = [
  { id: "200g", label: "Sachet 200 g", contenance: "200 g", public: "particulier", price: 13.9, tax: "TTC" },
  { id: "1kg", label: "Sachet professionnel 1 kg", contenance: "1 kg", public: "professionnel", price: 28.9, tax: "HT" },
];

const FAQ_COMMUNE = [
  {
    q: "Puis-je commander cette création aujourd'hui ?",
    a: "Pas encore. Maison Sillage est en phase de conception : cette fiche présente un prototype, et le panier fonctionne uniquement à titre de démonstration. Aucune commande n'est transmise et aucun paiement n'est demandé.",
  },
  {
    q: "Quelle est la composition exacte ?",
    a: "La formulation est en cours de développement. La liste d'ingrédients, les allergènes et les informations nutritionnelles seront publiés lorsque la recette aura été finalisée et validée.",
  },
  {
    q: "Comment conserver le produit ?",
    a: "Les recommandations de conservation seront établies avec la formulation définitive et figureront sur l'étiquette.",
  },
];

export const products: Product[] = [
  /* ─────────────── SIROPS ─────────────── */
  {
    slug: "fraise-des-bois-madeleine-doree",
    name: "Fraise des bois & Madeleine dorée",
    labelLines: ["Fraise des bois", "Madeleine dorée"],
    category: "sirop",
    season: "printemps",
    status: "prototype",
    profiles: ["fruite", "patissier"],
    notes: ["Fraise gourmande", "Biscuit beurré", "Vanille"],
    tagline: "Le goûter d'un jardin au mois de mai.",
    story: [
      "Une fraise des bois trouvée au bord d'un sentier, une madeleine encore tiède posée sur le rebord de la fenêtre. Cette création cherche l'instant précis où l'éclat acidulé du fruit rencontre la rondeur beurrée du biscuit.",
      "La fraise ouvre, vive et parfumée ; la madeleine prend le relais, puis une vanille douce prolonge la gorgée comme un souvenir qui s'attarde.",
    ],
    usages: ["latte", "milkshake", "limonade", "dessert"],
    usageIdeas: [
      { title: "Latte de printemps", text: "Avec un lait entier bien moussé, pour retrouver le goût d'un goûter d'enfance." },
      { title: "Milkshake", text: "Mixé avec une glace vanille et un trait de lait froid." },
      { title: "Limonade rosée", text: "Allongé d'eau pétillante très fraîche et de quelques feuilles de menthe." },
    ],
    formats: SIROP_FORMATS,
    palette: { liquid: "#b2333f", accent: "#b98a88", tint: "#f6e7e2", deep: "#5c2027" },
    botanicals: ["fraise", "madeleine"],
    pack: "bouteille",
    complements: ["latte-madeleine-vanille-patissiere", "peche-blanche-fleur-oranger", "coffret-decouverte"],
    faq: [
      ...FAQ_COMMUNE,
      {
        q: "Convient-il aux boissons lactées ?",
        a: "C'est l'usage pour lequel il est imaginé. La tenue dans le lait chaud et froid sera vérifiée lors des essais de formulation.",
      },
    ],
    seo: "Sirop de démonstration Fraise des bois & Madeleine dorée, création de printemps Maison Sillage pour lattes, milkshakes et limonades.",
  },
  {
    slug: "peche-blanche-fleur-oranger",
    name: "Pêche blanche & Fleur d'oranger",
    labelLines: ["Pêche blanche", "Fleur d'oranger"],
    category: "sirop",
    season: "ete",
    status: "prototype",
    profiles: ["fruite", "floral"],
    notes: ["Pêche juteuse", "Fleur d'oranger", "Douceur miellée"],
    tagline: "Une fin d'après-midi sous la tonnelle.",
    story: [
      "Une pêche blanche si mûre qu'elle se partage au-dessus de l'assiette, et l'ombre fraîche d'un oranger en fleur. L'été, chez Maison Sillage, est une affaire de délicatesse.",
      "La chair juteuse du fruit domine d'abord ; la fleur d'oranger arrive ensuite, lumineuse, sans jamais prendre le dessus.",
    ],
    usages: ["latte-glace", "mocktail", "limonade", "dessert"],
    usageIdeas: [
      { title: "Iced latte", text: "Sur un espresso court et un lait froid, versé lentement sur la glace." },
      { title: "Mocktail pétillant", text: "Avec une eau pétillante, un zeste de citron et une tranche de pêche." },
      { title: "Salade de fruits", text: "Quelques gouttes sur des fruits blancs, pour souligner leur parfum." },
    ],
    formats: SIROP_FORMATS,
    palette: { liquid: "#e3946a", accent: "#d8936a", tint: "#fbeee3", deep: "#7a3f24" },
    botanicals: ["peche", "fleur-oranger"],
    pack: "bouteille",
    complements: ["chai-velours-fleur-oranger", "pistache-douce-vanille", "fraise-des-bois-madeleine-doree"],
    faq: [
      ...FAQ_COMMUNE,
      {
        q: "Peut-on l'utiliser dans une boisson pétillante ?",
        a: "C'est l'un des usages envisagés. La compatibilité avec les boissons gazeuses et acidulées sera validée lors des essais.",
      },
    ],
    seo: "Sirop de démonstration Pêche blanche & Fleur d'oranger, création d'été Maison Sillage pour iced lattes et mocktails sans alcool.",
  },
  {
    slug: "poire-fondante-vanille-bourbon",
    name: "Poire fondante & Vanille Bourbon",
    labelLines: ["Poire fondante", "Vanille Bourbon"],
    category: "sirop",
    season: "automne",
    status: "prototype",
    profiles: ["fruite", "patissier"],
    notes: ["Poire compotée", "Vanille ronde", "Sucre blond"],
    tagline: "Le verger à l'heure des premières brumes.",
    story: [
      "Les poires tombées de l'arbre qu'on laisse fondre doucement dans une casserole, une gousse de vanille fendue au milieu. Notre création d'automne tient de la compote du dimanche et du café de l'après-midi.",
      "La poire est tendre, presque confite ; la vanille l'enveloppe d'une rondeur chaude qui appelle le lait et l'espresso.",
    ],
    usages: ["latte", "cafe", "chocolat", "dessert"],
    usageIdeas: [
      { title: "Latte poire & vanille", text: "Notre recette signature d'automne : espresso, lait moussé et une note de poire." },
      { title: "Café crème", text: "Une cuillère suffit à arrondir un café filtre du matin." },
      { title: "Tarte fine", text: "En nappage sur une pâte feuilletée, à la sortie du four." },
    ],
    formats: SIROP_FORMATS,
    palette: { liquid: "#c58a36", accent: "#a9692f", tint: "#f5e8d2", deep: "#5a3517" },
    botanicals: ["poire", "vanille"],
    pack: "bouteille",
    complements: ["chai-velours-fleur-oranger", "datte-medjool-creme-brulee", "coffret-decouverte"],
    faq: [
      ...FAQ_COMMUNE,
      {
        q: "Que signifie « Vanille Bourbon » dans le nom ?",
        a: "Il désigne le profil aromatique recherché, rond et crémeux. L'origine des matières premières sera précisée seulement lorsque la filière d'approvisionnement aura été établie.",
      },
    ],
    seo: "Sirop de démonstration Poire fondante & Vanille Bourbon, création d'automne Maison Sillage pour lattes et cafés gourmands.",
  },
  {
    slug: "datte-medjool-creme-brulee",
    name: "Datte Medjool & Crème brûlée",
    labelLines: ["Datte Medjool", "Crème brûlée"],
    category: "sirop",
    season: "hiver",
    status: "prototype",
    profiles: ["patissier", "fruits-secs"],
    notes: ["Datte caramélisée", "Croûte de sucre", "Crème vanillée"],
    tagline: "La croûte de sucre qui cède sous la cuillère.",
    story: [
      "Une datte charnue, presque confite, et le bruit sec d'une crème brûlée qu'on entame au coin du feu. Notre création d'hiver est la plus profonde de la collection.",
      "La datte apporte son caramel naturel, la crème brûlée sa note de sucre grillé et sa douceur lactée : une saveur pensée pour les boissons chaudes qui se boivent lentement.",
    ],
    usages: ["chocolat", "latte", "cafe", "dessert"],
    usageIdeas: [
      { title: "Chocolat chaud", text: "Un chocolat épais relevé d'une note de caramel et de datte." },
      { title: "Affogato", text: "Sur une boule de glace vanille, avec un espresso brûlant." },
      { title: "Latte d'hiver", text: "Avec un lait d'avoine pour une texture encore plus ronde." },
    ],
    formats: SIROP_FORMATS,
    palette: { liquid: "#6e3517", accent: "#5e3b2a", tint: "#efe1d3", deep: "#3a2014" },
    botanicals: ["datte", "vanille"],
    pack: "bouteille",
    complements: ["chocolat-intense-biscuit-dore", "poire-fondante-vanille-bourbon", "coffret-decouverte"],
    faq: [
      ...FAQ_COMMUNE,
      {
        q: "Est-il très sucré ?",
        a: "L'équilibre sucre / aromatique fait partie des points travaillés en dégustation. Il sera ajusté avant toute mise en production.",
      },
    ],
    seo: "Sirop de démonstration Datte Medjool & Crème brûlée, création d'hiver Maison Sillage pour chocolats chauds et lattes.",
  },
  {
    slug: "pistache-fleur-de-sel",
    name: "Pistache & Fleur de sel",
    labelLines: ["Pistache", "Fleur de sel"],
    category: "sirop",
    season: null,
    status: "a-venir",
    profiles: ["fruits-secs", "patissier"],
    notes: ["Pistache torréfiée", "Pointe de sel", "Beurre noisette"],
    tagline: "Une création encore dans le carnet de bord.",
    story: [
      "Une pistache juste torréfiée et quelques cristaux de sel qui réveillent la gourmandise. Cette création est à l'étude : elle rejoindra peut-être la collection lors d'une prochaine édition.",
      "Elle est présentée ici pour montrer la direction aromatique explorée, pas comme un produit disponible.",
    ],
    usages: ["latte", "frappe", "dessert"],
    usageIdeas: [
      { title: "Latte salé-sucré", text: "L'idée de départ : un latte où la pistache rencontre une pointe de sel." },
      { title: "Frappé", text: "Une piste de recette avec notre poudre Pistache douce & Vanille." },
    ],
    formats: SIROP_FORMATS,
    palette: { liquid: "#a9a565", accent: "#7f8a55", tint: "#eef0e0", deep: "#3f4426" },
    botanicals: ["pistache", "fleur-de-sel"],
    pack: "bouteille",
    complements: ["pistache-douce-vanille", "poire-fondante-vanille-bourbon"],
    faq: [
      {
        q: "Quand cette édition sera-t-elle disponible ?",
        a: "Aucune date n'est fixée. Il s'agit d'une piste de création, qui pourra évoluer ou ne pas être retenue.",
      },
      ...FAQ_COMMUNE.slice(1),
    ],
    seo: "Pistache & Fleur de sel, future édition à l'étude chez Maison Sillage.",
  },

  /* ─────────────── POUDRES ─────────────── */
  {
    slug: "latte-madeleine-vanille-patissiere",
    name: "Latte Madeleine & Vanille pâtissière",
    labelLines: ["Latte Madeleine", "Vanille pâtissière"],
    category: "poudre",
    season: "printemps",
    status: "prototype",
    profiles: ["patissier"],
    notes: ["Biscuit doré", "Crème pâtissière", "Beurre noisette"],
    tagline: "Une madeleine trempée dans une tasse de lait.",
    story: [
      "La plus célèbre des madeleines se trempe dans une infusion ; la nôtre se fond dans le lait. Cette préparation en poudre veut retrouver le goût du biscuit doré et de la crème pâtissière, dans une boisson onctueuse.",
      "Elle se suffit à elle-même avec un lait chaud, ou accompagne un espresso pour un latte plus corsé.",
    ],
    usages: ["latte", "milkshake", "frappe"],
    usageIdeas: [
      { title: "Latte chaud", text: "Fouettée dans un lait chaud jusqu'à obtenir une mousse fine." },
      { title: "Avec la fraise", text: "Associée au sirop Fraise des bois & Madeleine dorée pour un goûter complet." },
      { title: "Frappé", text: "Mixée avec de la glace pilée et un lait froid." },
    ],
    formats: POUDRE_FORMATS,
    palette: { liquid: "#e2c58f", accent: "#b98a88", tint: "#f8eedf", deep: "#6b4a2a" },
    botanicals: ["madeleine", "vanille"],
    pack: "doypack-ivoire",
    complements: ["fraise-des-bois-madeleine-doree", "pistache-douce-vanille"],
    faq: [
      ...FAQ_COMMUNE,
      {
        q: "Faut-il un équipement particulier ?",
        a: "Un fouet ou un mousseur à lait suffit à la maison. Les professionnels pourront l'utiliser avec la buse vapeur de leur machine.",
      },
    ],
    seo: "Préparation en poudre de démonstration Latte Madeleine & Vanille pâtissière, création de printemps Maison Sillage.",
  },
  {
    slug: "pistache-douce-vanille",
    name: "Pistache douce & Vanille",
    labelLines: ["Pistache douce", "& Vanille"],
    category: "poudre",
    season: "ete",
    status: "prototype",
    profiles: ["fruits-secs", "patissier"],
    notes: ["Pistache lactée", "Vanille", "Amande fraîche"],
    tagline: "La fraîcheur d'un glacier en terrasse.",
    story: [
      "Une pistache tendre et lactée, plus proche du sorbet que du fruit sec grillé, et une vanille qui l'arrondit. Cette poudre est pensée pour l'été : frappés, lattes glacés, milkshakes.",
      "Sa couleur naturelle, d'un vert très pâle, sera un point d'attention de la formulation : aucune promesse n'est faite à ce stade.",
    ],
    usages: ["frappe", "latte-glace", "milkshake"],
    usageIdeas: [
      { title: "Frappé pistache", text: "Mixée avec glace pilée et lait froid, coiffée d'une chantilly légère." },
      { title: "Latte glacé", text: "Délayée dans un peu de lait tiède, puis versée sur glace avec un espresso." },
      { title: "Milkshake", text: "Avec une glace vanille, pour un milkshake doux et dense." },
    ],
    formats: POUDRE_FORMATS,
    palette: { liquid: "#c3c08a", accent: "#8c9561", tint: "#f0f0e2", deep: "#454a2b" },
    botanicals: ["pistache", "vanille"],
    pack: "doypack-ivoire",
    complements: ["peche-blanche-fleur-oranger", "latte-madeleine-vanille-patissiere", "pistache-fleur-de-sel"],
    faq: [
      ...FAQ_COMMUNE,
      {
        q: "Se dissout-elle dans une boisson froide ?",
        a: "La dissolution à froid est l'un des critères de développement. Elle sera testée et précisée avant toute commercialisation.",
      },
    ],
    seo: "Préparation en poudre de démonstration Pistache douce & Vanille, création d'été Maison Sillage pour frappés et lattes glacés.",
  },
  {
    slug: "chai-velours-fleur-oranger",
    name: "Chaï velours & Fleur d'oranger",
    labelLines: ["Chaï velours", "Fleur d'oranger"],
    category: "poudre",
    season: "automne",
    status: "prototype",
    profiles: ["epice", "floral"],
    notes: ["Cannelle", "Cardamome", "Fleur d'oranger"],
    tagline: "Les épices d'un comptoir, adoucies d'une fleur.",
    story: [
      "Un chaï comme un souvenir de comptoir d'épices : cannelle, cardamome, une pointe de gingembre. Nous l'avons voulu velouté plutôt que piquant, et l'avons éclairé d'un trait de fleur d'oranger.",
      "C'est la création qui raconte le plus directement les anciennes routes du commerce, celles qui ont donné son nom à notre maison.",
    ],
    usages: ["latte", "latte-glace", "dessert"],
    usageIdeas: [
      { title: "Chaï latte", text: "Dans un lait chaud, avec une pincée de cannelle sur la mousse." },
      { title: "Chaï glacé", text: "Délayé, puis versé sur glace avec un lait d'avoine froid." },
      { title: "Riz au lait", text: "Une cuillère dans un riz au lait en fin de cuisson." },
    ],
    formats: POUDRE_FORMATS,
    palette: { liquid: "#c0915f", accent: "#a9692f", tint: "#f4e6d4", deep: "#5b3820" },
    botanicals: ["chai", "fleur-oranger"],
    pack: "doypack-brun",
    complements: ["poire-fondante-vanille-bourbon", "peche-blanche-fleur-oranger"],
    faq: [
      ...FAQ_COMMUNE,
      {
        q: "Contient-il du thé ?",
        a: "La base de la préparation n'est pas encore arrêtée. Sa composition complète sera communiquée avec la formulation finale.",
      },
    ],
    seo: "Préparation en poudre de démonstration Chaï velours & Fleur d'oranger, création d'automne Maison Sillage.",
  },
  {
    slug: "chocolat-intense-biscuit-dore",
    name: "Chocolat intense & Biscuit doré",
    labelLines: ["Chocolat intense", "Biscuit doré"],
    category: "poudre",
    season: "hiver",
    status: "prototype",
    profiles: ["cacaote", "patissier"],
    notes: ["Cacao profond", "Biscuit caramélisé", "Pointe de sel"],
    tagline: "Un chocolat épais, à boire à la cuillère.",
    story: [
      "Un chocolat chaud comme on en sert dans les salons de thé d'hiver : épais, sombre, généreux. Nous lui avons ajouté une note de biscuit doré, pour le croquant qui manque toujours à une tasse.",
      "Il se prépare au lait ou à l'eau, et accueille volontiers notre sirop Datte Medjool & Crème brûlée.",
    ],
    usages: ["chocolat", "milkshake", "dessert"],
    usageIdeas: [
      { title: "Chocolat viennois", text: "Épais, surmonté d'une chantilly et de brisures de biscuit." },
      { title: "Avec la datte", text: "Associé au sirop Datte & Crème brûlée pour un chocolat d'hiver." },
      { title: "Mousse express", text: "Délayé dans une crème fouettée pour un dessert minute." },
    ],
    formats: POUDRE_FORMATS,
    palette: { liquid: "#4f2c1e", accent: "#5e3b2a", tint: "#ece0d5", deep: "#2a170f" },
    botanicals: ["cacao", "biscuit"],
    pack: "doypack-brun",
    complements: ["datte-medjool-creme-brulee", "latte-madeleine-vanille-patissiere"],
    faq: [
      ...FAQ_COMMUNE,
      {
        q: "Peut-on le préparer avec une boisson végétale ?",
        a: "C'est l'une des pistes de test. Le comportement avec les boissons végétales sera indiqué une fois les essais menés.",
      },
    ],
    seo: "Préparation en poudre de démonstration Chocolat intense & Biscuit doré, création d'hiver Maison Sillage.",
  },

  /* ─────────────── COFFRET ─────────────── */
  {
    slug: "coffret-decouverte",
    name: "Coffret Découverte",
    labelLines: ["Coffret", "Découverte"],
    category: "coffret",
    season: null,
    status: "prototype",
    profiles: ["fruite", "floral", "patissier"],
    notes: ["Trois saisons", "Trois sillages", "Une table"],
    tagline: "Trois flacons pour faire le tour de la Maison.",
    story: [
      "Le Coffret Découverte réunit trois créations de la collection dans leur format de 250 ml : de quoi comparer, associer et imaginer ses propres recettes.",
      "Il est pensé comme un premier voyage : un printemps gourmand, un été floral, un automne vanillé.",
    ],
    usages: ["latte", "latte-glace", "mocktail", "milkshake"],
    usageIdeas: [
      { title: "Une dégustation à trois", text: "Trois lattes identiques, trois sirops : la meilleure façon de découvrir la collection." },
      { title: "Un cadeau", text: "Accompagné d'un livret de recettes de démonstration." },
    ],
    formats: [
      { id: "coffret", label: "Coffret 3 × 250 ml", contenance: "3 × 250 ml", public: "particulier", price: 36.9, tax: "TTC" },
    ],
    palette: { liquid: "#c58a36", accent: "#a47b43", tint: "#f3e8d4", deep: "#4b3020" },
    botanicals: ["fraise", "peche", "poire"],
    pack: "coffret",
    contents: ["fraise-des-bois-madeleine-doree", "peche-blanche-fleur-oranger", "poire-fondante-vanille-bourbon"],
    complements: ["latte-madeleine-vanille-patissiere", "datte-medjool-creme-brulee"],
    faq: [
      ...FAQ_COMMUNE,
      {
        q: "Peut-on composer son propre coffret ?",
        a: "C'est une idée à l'étude. Pour cette démonstration, le coffret réunit trois créations fixes.",
      },
    ],
    seo: "Coffret Découverte de démonstration Maison Sillage : trois sirops signatures de 250 ml.",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const productsByCategory = (c: Product["category"]) => products.filter((p) => p.category === c);
export const productsBySeason = (s: Product["season"]) => products.filter((p) => p.season === s);
export const purchasable = (p: Product) => p.status !== "a-venir";
export const startingPrice = (p: Product) =>
  p.formats.filter((f) => f.public === "particulier")[0] ?? p.formats[0];
