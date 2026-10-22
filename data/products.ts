import type { Flavor, Format, Product } from "@/lib/types";

/* ──────────────────────────────────────────────────────────────
   Catalogue de démonstration — Maison Sillage
   Quatre créations signatures, chacune déclinée en sirop et en poudre,
   un coffret et une édition à l'étude. Formats et tarifs fictifs et
   indicatifs. Aucune composition, valeur nutritionnelle ou certification
   n'est avancée tant que les formulations ne sont pas finalisées.
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
  /* ─────────────── SIROPS SIGNATURES ─────────────── */
  {
    slug: "fraise-des-bois-madeleine-doree",
    name: "Fraise des bois & Madeleine dorée",
    flavorName: "Fraise des bois & Madeleine dorée",
    flavor: "fraise",
    category: "sirop",
    season: "printemps",
    status: "prototype",
    profiles: ["fruite", "patissier"],
    notes: ["Fraise des bois", "Biscuit beurré", "Vanille douce"],
    tagline: "Le goûter d'un jardin au mois de mai.",
    sensory: "L'éclat acidulé d'une fraise des bois, puis la rondeur beurrée d'une madeleine encore tiède.",
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
    palette: { liquid: "#b2333f", accent: "#c27d86", tint: "#f6e7e2", deep: "#5c2027" },
    complements: ["poudre-fraise-des-bois-madeleine-doree", "peche-blanche-fleur-oranger", "coffret-decouverte"],
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
    flavorName: "Pêche blanche & Fleur d'oranger",
    flavor: "peche",
    category: "sirop",
    season: "ete",
    status: "prototype",
    profiles: ["fruite", "floral"],
    notes: ["Pêche juteuse", "Fleur d'oranger", "Douceur miellée"],
    tagline: "Une fin d'après-midi sous la tonnelle.",
    sensory: "La chair juteuse d'une pêche blanche mûre, éclairée par la fraîcheur lumineuse de la fleur d'oranger.",
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
    palette: { liquid: "#e3946a", accent: "#d08a5c", tint: "#fbeee3", deep: "#7a3f24" },
    complements: ["poudre-peche-blanche-fleur-oranger", "fraise-des-bois-madeleine-doree", "coffret-decouverte"],
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
    flavorName: "Poire fondante & Vanille Bourbon",
    flavor: "poire",
    category: "sirop",
    season: "automne",
    status: "prototype",
    profiles: ["fruite", "patissier"],
    notes: ["Poire compotée", "Vanille ronde", "Sucre blond"],
    tagline: "Le verger à l'heure des premières brumes.",
    sensory: "Une poire tendre, presque confite, enveloppée d'une vanille crémeuse qui appelle le lait et l'espresso.",
    story: [
      "Les poires tombées de l'arbre qu'on laisse fondre doucement dans une casserole, une gousse de vanille fendue au milieu. Notre création d'automne tient de la compote du dimanche et du café de l'après-midi.",
      "La poire est tendre, presque confite ; la vanille l'enveloppe d'une rondeur chaude qui appelle le lait et l'espresso.",
    ],
    usages: ["latte", "latte-glace", "cafe", "dessert"],
    usageIdeas: [
      { title: "Iced latte poire & vanille", text: "Notre recette signature d'automne : espresso, lait froid, glace et une note de poire." },
      { title: "Café crème", text: "Une cuillère suffit à arrondir un café filtre du matin." },
      { title: "Tarte fine", text: "En nappage sur une pâte feuilletée, à la sortie du four." },
    ],
    formats: SIROP_FORMATS,
    palette: { liquid: "#c58a36", accent: "#b0702f", tint: "#f5e8d2", deep: "#5a3517" },
    complements: ["poudre-poire-fondante-vanille-bourbon", "datte-medjool-creme-brulee", "coffret-decouverte"],
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
    flavorName: "Datte Medjool & Crème brûlée",
    flavor: "datte",
    category: "sirop",
    season: "hiver",
    status: "prototype",
    profiles: ["patissier", "fruits-secs"],
    notes: ["Datte caramélisée", "Croûte de sucre", "Crème vanillée"],
    tagline: "La croûte de sucre qui cède sous la cuillère.",
    sensory: "Le caramel naturel d'une datte charnue et le sucre grillé d'une crème brûlée qu'on entame au coin du feu.",
    story: [
      "Une datte charnue, presque confite, et le bruit sec d'une crème brûlée qu'on entame au coin du feu. Notre création d'hiver est la plus profonde de la collection.",
      "La datte apporte son caramel naturel, la crème brûlée sa note de sucre grillé et sa douceur lactée : une saveur pensée pour les boissons chaudes qui se boivent lentement.",
    ],
    usages: ["latte", "chocolat", "cafe", "dessert"],
    usageIdeas: [
      { title: "Latte d'hiver", text: "Avec un lait d'avoine pour une texture encore plus ronde." },
      { title: "Chocolat chaud", text: "Un chocolat épais relevé d'une note de caramel et de datte." },
      { title: "Crème brûlée", text: "Une cuillère dans l'appareil avant cuisson, pour un sucre plus profond." },
    ],
    formats: SIROP_FORMATS,
    palette: { liquid: "#6e3517", accent: "#8a5a3c", tint: "#efe1d3", deep: "#3a2014" },
    complements: ["poudre-datte-medjool-creme-brulee", "poire-fondante-vanille-bourbon", "coffret-decouverte"],
    faq: [
      ...FAQ_COMMUNE,
      {
        q: "Est-il très sucré ?",
        a: "L'équilibre sucre / aromatique fait partie des points travaillés en dégustation. Il sera ajusté avant toute mise en production.",
      },
    ],
    seo: "Sirop de démonstration Datte Medjool & Crème brûlée, création d'hiver Maison Sillage pour lattes et chocolats chauds.",
  },

  /* ─────────────── PRÉPARATIONS EN POUDRE ─────────────── */
  {
    slug: "poudre-fraise-des-bois-madeleine-doree",
    name: "Fraise des bois & Madeleine dorée",
    flavorName: "Fraise des bois & Madeleine dorée",
    flavor: "fraise",
    category: "poudre",
    season: "printemps",
    status: "prototype",
    profiles: ["fruite", "patissier"],
    notes: ["Fraise des bois", "Biscuit doré", "Lait vanillé"],
    tagline: "Une madeleine trempée dans un lait à la fraise.",
    sensory: "Une poudre onctueuse au goût de goûter : fraise des bois, biscuit doré et lait vanillé.",
    story: [
      "La version gourmande de notre création de printemps : une préparation à fouetter dans le lait, pensée pour les lattes, les milkshakes et les frappés.",
      "La fraise reste au premier plan ; le biscuit doré donne du corps à la boisson et une texture plus ronde que le sirop.",
    ],
    usages: ["latte", "milkshake", "frappe"],
    usageIdeas: [
      { title: "Latte rose", text: "Fouettée dans un lait chaud jusqu'à obtenir une mousse fine." },
      { title: "Milkshake", text: "Mixée avec une glace vanille et quelques fraises." },
      { title: "Avec le sirop", text: "Associée au sirop de la même saveur pour un goûter plus intense." },
    ],
    formats: POUDRE_FORMATS,
    palette: { liquid: "#e7b9b2", accent: "#c27d86", tint: "#f6e7e2", deep: "#5c2027" },
    complements: ["fraise-des-bois-madeleine-doree", "poudre-peche-blanche-fleur-oranger"],
    faq: [
      ...FAQ_COMMUNE,
      {
        q: "Faut-il un équipement particulier ?",
        a: "Un fouet ou un mousseur à lait suffit à la maison. Les professionnels pourront l'utiliser avec la buse vapeur de leur machine.",
      },
    ],
    seo: "Préparation en poudre de démonstration Fraise des bois & Madeleine dorée, création de printemps Maison Sillage.",
  },
  {
    slug: "poudre-peche-blanche-fleur-oranger",
    name: "Pêche blanche & Fleur d'oranger",
    flavorName: "Pêche blanche & Fleur d'oranger",
    flavor: "peche",
    category: "poudre",
    season: "ete",
    status: "prototype",
    profiles: ["fruite", "floral"],
    notes: ["Pêche blanche", "Fleur d'oranger", "Lait frais"],
    tagline: "La fraîcheur d'une terrasse en plein été.",
    sensory: "Une poudre légère et florale pour les boissons glacées : pêche blanche, fleur d'oranger, lait frais.",
    story: [
      "Notre création d'été en préparation à fouetter : elle est imaginée pour les frappés, les lattes glacés et les boissons lactées très fraîches.",
      "Sa tenue à froid fait partie des points travaillés en formulation : aucune promesse n'est faite à ce stade.",
    ],
    usages: ["frappe", "latte-glace", "milkshake"],
    usageIdeas: [
      { title: "Frappé", text: "Mixée avec glace pilée et lait froid, coiffée d'une chantilly légère." },
      { title: "Latte glacé", text: "Délayée dans un peu de lait tiède, puis versée sur glace avec un espresso." },
      { title: "Milkshake", text: "Avec une glace vanille, pour un milkshake doux et parfumé." },
    ],
    formats: POUDRE_FORMATS,
    palette: { liquid: "#f1c9a6", accent: "#d08a5c", tint: "#fbeee3", deep: "#7a3f24" },
    complements: ["peche-blanche-fleur-oranger", "poudre-fraise-des-bois-madeleine-doree"],
    faq: [
      ...FAQ_COMMUNE,
      {
        q: "Se dissout-elle dans une boisson froide ?",
        a: "La dissolution à froid est l'un des critères de développement. Elle sera testée et précisée avant toute commercialisation.",
      },
    ],
    seo: "Préparation en poudre de démonstration Pêche blanche & Fleur d'oranger, création d'été Maison Sillage pour frappés et lattes glacés.",
  },
  {
    slug: "poudre-poire-fondante-vanille-bourbon",
    name: "Poire fondante & Vanille Bourbon",
    flavorName: "Poire fondante & Vanille Bourbon",
    flavor: "poire",
    category: "poudre",
    season: "automne",
    status: "prototype",
    profiles: ["fruite", "patissier"],
    notes: ["Poire rôtie", "Vanille", "Lait crémeux"],
    tagline: "Un latte d'automne, à la cuillère.",
    sensory: "Une poudre crémeuse au goût de poire rôtie et de vanille, pour des lattes ronds et réconfortants.",
    story: [
      "La version poudre de notre création d'automne : une préparation pour lattes et chocolats blancs, plus ronde et plus enveloppante que le sirop.",
      "Elle se prépare au lait chaud ou froid, et s'associe volontiers à un espresso.",
    ],
    usages: ["latte", "latte-glace", "chocolat"],
    usageIdeas: [
      { title: "Latte chaud", text: "Fouettée dans un lait chaud, avec une pincée de cannelle sur la mousse." },
      { title: "Iced latte", text: "Délayée, puis versée sur glace avec un espresso et un lait froid." },
      { title: "Chocolat blanc", text: "Associée à un chocolat blanc fondu pour une boisson de fête." },
    ],
    formats: POUDRE_FORMATS,
    palette: { liquid: "#e2c58f", accent: "#b0702f", tint: "#f5e8d2", deep: "#5a3517" },
    complements: ["poire-fondante-vanille-bourbon", "poudre-datte-medjool-creme-brulee"],
    faq: [
      ...FAQ_COMMUNE,
      {
        q: "Peut-on la préparer avec une boisson végétale ?",
        a: "C'est l'une des pistes de test. Le comportement avec les boissons végétales sera indiqué une fois les essais menés.",
      },
    ],
    seo: "Préparation en poudre de démonstration Poire fondante & Vanille Bourbon, création d'automne Maison Sillage.",
  },
  {
    slug: "poudre-datte-medjool-creme-brulee",
    name: "Datte Medjool & Crème brûlée",
    flavorName: "Datte Medjool & Crème brûlée",
    flavor: "datte",
    category: "poudre",
    season: "hiver",
    status: "prototype",
    profiles: ["patissier", "fruits-secs"],
    notes: ["Datte confite", "Sucre grillé", "Crème vanillée"],
    tagline: "Un chocolat épais, à boire à la cuillère.",
    sensory: "Une poudre profonde au goût de datte confite et de sucre grillé, pour les chocolats chauds et lattes d'hiver.",
    story: [
      "Notre création d'hiver en préparation à fouetter : elle donne aux chocolats chauds et aux lattes une texture épaisse et une note de caramel.",
      "Elle se prépare au lait ou à l'eau, et accueille volontiers notre sirop de la même saveur.",
    ],
    usages: ["chocolat", "latte", "dessert"],
    usageIdeas: [
      { title: "Chocolat chaud", text: "Épais, surmonté d'une chantilly et d'éclats de sucre grillé." },
      { title: "Latte d'hiver", text: "Fouettée dans un lait d'avoine bien chaud." },
      { title: "Crème dessert", text: "Délayée dans une crème fouettée pour un dessert minute." },
    ],
    formats: POUDRE_FORMATS,
    palette: { liquid: "#8a5a3c", accent: "#8a5a3c", tint: "#efe1d3", deep: "#3a2014" },
    complements: ["datte-medjool-creme-brulee", "poudre-poire-fondante-vanille-bourbon"],
    faq: [
      ...FAQ_COMMUNE,
      {
        q: "Contient-elle du chocolat ?",
        a: "La base de la préparation n'est pas encore arrêtée. Sa composition complète sera communiquée avec la formulation finale.",
      },
    ],
    seo: "Préparation en poudre de démonstration Datte Medjool & Crème brûlée, création d'hiver Maison Sillage pour chocolats chauds.",
  },

  /* ─────────────── COFFRET ─────────────── */
  {
    slug: "coffret-decouverte",
    name: "Coffret Découverte",
    flavorName: "Coffret Découverte",
    flavor: null,
    category: "coffret",
    season: null,
    status: "prototype",
    profiles: ["fruite", "floral", "patissier"],
    notes: ["Trois saisons", "Trois sillages", "Une table"],
    tagline: "Trois flacons pour faire le tour de la Maison.",
    sensory: "Un printemps gourmand, un été floral, un automne vanillé : trois sirops pour comparer et associer.",
    story: [
      "Le Coffret Découverte réunit trois créations de la collection dans leur format de 250 ml : de quoi comparer, associer et imaginer ses propres recettes.",
      "Il est pensé comme un premier voyage : un printemps gourmand, un été floral, un automne vanillé.",
    ],
    usages: ["latte", "latte-glace", "mocktail", "milkshake"],
    usageIdeas: [
      { title: "Une dégustation à trois", text: "Trois lattes identiques, trois sirops : la meilleure façon de découvrir la collection." },
      { title: "Un cadeau", text: "Accompagné d'un livret de recettes de démonstration." },
    ],
    formats: [{ id: "coffret", label: "Coffret 3 × 250 ml", contenance: "3 × 250 ml", public: "particulier", price: 36.9, tax: "TTC" }],
    palette: { liquid: "#c58a36", accent: "#a47b43", tint: "#f3e8d4", deep: "#4b3020" },
    contents: ["fraise-des-bois-madeleine-doree", "peche-blanche-fleur-oranger", "poire-fondante-vanille-bourbon"],
    complements: ["datte-medjool-creme-brulee", "poudre-poire-fondante-vanille-bourbon"],
    faq: [
      ...FAQ_COMMUNE,
      {
        q: "Peut-on composer son propre coffret ?",
        a: "C'est une idée à l'étude. Pour cette démonstration, le coffret réunit trois créations fixes.",
      },
    ],
    seo: "Coffret Découverte de démonstration Maison Sillage : trois sirops signatures de 250 ml.",
  },

  /* ─────────────── ÉDITION À L'ÉTUDE ─────────────── */
  {
    slug: "pistache-fleur-de-sel",
    name: "Pistache & Fleur de sel",
    flavorName: "Pistache & Fleur de sel",
    flavor: null,
    category: "sirop",
    season: null,
    status: "a-venir",
    profiles: ["fruits-secs", "patissier"],
    notes: ["Pistache torréfiée", "Pointe de sel", "Beurre noisette"],
    tagline: "Une création encore dans le carnet de bord.",
    sensory: "Une pistache juste torréfiée et quelques cristaux de sel : une piste de création, pas un produit disponible.",
    story: [
      "Une pistache juste torréfiée et quelques cristaux de sel qui réveillent la gourmandise. Cette création est à l'étude : elle rejoindra peut-être la collection lors d'une prochaine édition.",
      "Elle est présentée ici pour montrer la direction aromatique explorée, pas comme un produit disponible.",
    ],
    usages: ["latte", "frappe", "dessert"],
    usageIdeas: [{ title: "Latte salé-sucré", text: "L'idée de départ : un latte où la pistache rencontre une pointe de sel." }],
    formats: SIROP_FORMATS,
    palette: { liquid: "#a9a565", accent: "#7f8a55", tint: "#eef0e0", deep: "#3f4426" },
    complements: ["poire-fondante-vanille-bourbon", "datte-medjool-creme-brulee"],
    faq: [
      {
        q: "Quand cette édition sera-t-elle disponible ?",
        a: "Aucune date n'est fixée. Il s'agit d'une piste de création, qui pourra évoluer ou ne pas être retenue.",
      },
      ...FAQ_COMMUNE.slice(1),
    ],
    seo: "Pistache & Fleur de sel, future édition à l'étude chez Maison Sillage.",
  },
];

export const FLAVORS: Flavor[] = ["fraise", "peche", "poire", "datte"];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const productsByCategory = (c: Product["category"]) => products.filter((p) => p.category === c);
export const productsBySeason = (s: Product["season"]) => products.filter((p) => p.season === s);
export const purchasable = (p: Product) => p.status !== "a-venir";
export const startingPrice = (p: Product) => p.formats.filter((f) => f.public === "particulier")[0] ?? p.formats[0];
export const siropOf = (f: Flavor) => products.find((p) => p.flavor === f && p.category === "sirop")!;
export const poudreOf = (f: Flavor) => products.find((p) => p.flavor === f && p.category === "poudre")!;
