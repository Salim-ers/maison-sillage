import type { SceneConfig, SceneItem } from "@/components/visuals/Scene";
import type { DrinkLook, Product, Recipe, SeasonId } from "@/lib/types";
import { getProduct, products } from "./products";
import { getRecipe } from "./recipes";

/* ──────────────────────────────────────────────────────────────
   Banque de visuels — une composition par emplacement.
   Chaque entrée porte un « brief » pour la future prise de vue :
   il suffira de remplacer la scène par une photographie.
   ────────────────────────────────────────────────────────────── */

const ICED: DrinkLook = {
  vessel: "verre-haut",
  layers: [
    { color: "#c58a36", height: 0.2 },
    { color: "#efe2cc", height: 0.48 },
    { color: "#6b4126", height: 0.2 },
  ],
  ice: true,
  straw: true,
};

export const scenes = {
  heroDesktop: {
    key: "hero-desktop",
    aspect: "16:9",
    backdrop: "large",
    tint: "#e8cc9c",
    surface: "#94693f",
    table: 0.7,
    light: "gauche",
    ship: 0.58,
    alt: "Flacon Poire fondante & Vanille Bourbon et latte glacé sur une table de bois, face à la mer au soleil couchant",
    brief: "16:9 — Flacon signature au tiers droit, latte glacé, lumière dorée rasante, table ancienne, horizon marin flou.",
    items: [
      { kind: "accessoire", id: "cordage", x: 0.47, base: 0.79, h: 0.09, depth: 0 },
      { kind: "accessoire", id: "carte", x: 0.88, base: 0.8, h: 0.1, depth: 0, shadow: false },
      { kind: "bouteille", slug: "poire-fondante-vanille-bourbon", x: 0.69, base: 0.93, h: 0.66, depth: 1 },
      { kind: "boisson", look: ICED, x: 0.84, base: 0.95, h: 0.42, depth: 1 },
      { kind: "botanique", id: "poire", x: 0.57, base: 0.97, h: 0.2, depth: 2 },
      { kind: "botanique", id: "vanille", x: 0.5, base: 1.01, h: 0.16, depth: 2 },
      { kind: "accessoire", id: "compas", x: 0.95, base: 1.0, h: 0.13, depth: 2 },
    ],
  },
  heroMobile: {
    key: "hero-mobile",
    aspect: "9:16",
    backdrop: "large",
    tint: "#e8cc9c",
    surface: "#94693f",
    table: 0.62,
    light: "droite",
    ship: 0.24,
    alt: "Composition verticale : flacon Poire & Vanille, latte glacé et poire sur une table face à la mer",
    brief: "9:16 — Composition verticale dédiée : flacon et boisson dans la moitié haute, la moitié basse laissée au texte.",
    items: [
      { kind: "bouteille", slug: "poire-fondante-vanille-bourbon", x: 0.6, base: 0.81, h: 0.45, depth: 1 },
      { kind: "boisson", look: ICED, x: 0.24, base: 0.85, h: 0.3, depth: 2 },
      { kind: "botanique", id: "poire", x: 0.88, base: 0.86, h: 0.13, depth: 2 },
    ],
  },
  univers: {
    key: "univers",
    aspect: "3:4",
    backdrop: "carte",
    tint: "#e6d5b8",
    alt: "Carte marine ancienne, compas, carnet de bord, gousses de vanille et épices",
    brief: "3:4 — Vue plongeante : carte ancienne, carnet ouvert, compas en laiton, gousses de vanille, épices.",
    items: [
      { kind: "accessoire", id: "carnet", x: 0.38, base: 0.6, h: 0.24, depth: 0 },
      { kind: "botanique", id: "vanille", x: 0.72, base: 0.42, h: 0.26, depth: 1 },
      { kind: "botanique", id: "chai", x: 0.3, base: 0.88, h: 0.2, depth: 1 },
      { kind: "accessoire", id: "compas", x: 0.7, base: 0.82, h: 0.17, depth: 2 },
      { kind: "botanique", id: "fleur-oranger", x: 0.22, base: 0.3, h: 0.2, depth: 1 },
    ],
  },
  sirops: {
    key: "sirops-famille",
    aspect: "21:9",
    backdrop: "atelier",
    tint: "#ead8b8",
    surface: "#a67c4f",
    table: 0.72,
    light: "gauche",
    alt: "Les quatre flacons de la collection alignés sur une table, chacun accompagné de son fruit",
    brief: "21:9 — Les quatre flacons alignés, étiquettes de face, chacun accompagné de sa matière première, lumière latérale de fenêtre.",
    items: [
      { kind: "bouteille", slug: "fraise-des-bois-madeleine-doree", x: 0.24, base: 0.93, h: 0.66, depth: 1 },
      { kind: "bouteille", slug: "peche-blanche-fleur-oranger", x: 0.41, base: 0.93, h: 0.66, depth: 1 },
      { kind: "bouteille", slug: "poire-fondante-vanille-bourbon", x: 0.58, base: 0.93, h: 0.66, depth: 1 },
      { kind: "bouteille", slug: "datte-medjool-creme-brulee", x: 0.75, base: 0.93, h: 0.66, depth: 1 },
      { kind: "botanique", id: "fraise", x: 0.15, base: 0.96, h: 0.14, depth: 2 },
      { kind: "botanique", id: "peche", x: 0.32, base: 0.97, h: 0.15, depth: 2 },
      { kind: "botanique", id: "poire", x: 0.495, base: 0.97, h: 0.17, depth: 2 },
      { kind: "botanique", id: "datte", x: 0.665, base: 0.97, h: 0.15, depth: 2 },
      { kind: "botanique", id: "vanille", x: 0.86, base: 0.97, h: 0.16, depth: 2 },
    ],
  },
  poudres: {
    key: "poudres-nuit",
    aspect: "4:5",
    backdrop: "nuit",
    tint: "#a9692f",
    table: 0.7,
    light: "gauche",
    alt: "Deux sachets bruns de préparation en poudre et un chocolat chaud nappé de crème",
    brief: "4:5 — Fond sombre, doypacks bruns, tasse de chocolat onctueux, cuillère de poudre, lumière latérale chaude.",
    items: [
      { kind: "sachet", slug: "chai-velours-fleur-oranger", x: 0.3, base: 0.82, h: 0.42, depth: 0 },
      { kind: "sachet", slug: "chocolat-intense-biscuit-dore", x: 0.57, base: 0.86, h: 0.44, depth: 1 },
      {
        kind: "boisson",
        look: { vessel: "mug-verre", layers: [{ color: "#4a2718", height: 1 }], top: "chantilly", topColor: "#f6ecdc", dust: "#7a4a1c", steam: true },
        x: 0.8,
        base: 0.92,
        h: 0.32,
        depth: 2,
      },
      { kind: "accessoire", id: "cuillere", x: 0.36, base: 0.95, h: 0.06, depth: 2 },
      { kind: "botanique", id: "biscuit", x: 0.17, base: 0.98, h: 0.13, depth: 2 },
    ],
  },
  poudresClaires: {
    key: "poudres-claires",
    aspect: "1:1",
    backdrop: "lin",
    tint: "#efe6d2",
    alt: "Sachets ivoire Latte Madeleine et Pistache douce, avec un frappé pistache",
    brief: "1:1 — Fond lin clair, doypacks ivoire, frappé crémeux, matières premières au premier plan.",
    items: [
      { kind: "sachet", slug: "latte-madeleine-vanille-patissiere", x: 0.3, base: 0.8, h: 0.52, depth: 0 },
      { kind: "sachet", slug: "pistache-douce-vanille", x: 0.56, base: 0.86, h: 0.5, depth: 1 },
      { kind: "boisson", look: getRecipe("frappe-pistache-vanille")!.look, x: 0.8, base: 0.92, h: 0.46, depth: 2 },
      { kind: "botanique", id: "madeleine", x: 0.18, base: 0.97, h: 0.14, depth: 2 },
      { kind: "botanique", id: "pistache", x: 0.44, base: 0.98, h: 0.12, depth: 2 },
    ],
  },
  coffret: {
    key: "coffret",
    aspect: "3:2",
    backdrop: "atelier",
    tint: "#e9d7b8",
    surface: "#7d5534",
    table: 0.62,
    light: "droite",
    alt: "Coffret Découverte ouvert : trois flacons de 250 ml dans un écrin brun",
    brief: "3:2 — Coffret ouvert, trois flacons disposés avec élégance, couvercle appuyé, ruban et matières autour.",
    items: [
      { kind: "coffret", x: 0.48, base: 0.9, h: 0.62, depth: 1 },
      { kind: "botanique", id: "fraise", x: 0.13, base: 0.96, h: 0.14, depth: 2 },
      { kind: "botanique", id: "fleur-oranger", x: 0.84, base: 0.97, h: 0.17, depth: 2 },
      { kind: "botanique", id: "poire", x: 0.92, base: 0.84, h: 0.16, depth: 0 },
    ],
  },
  histoire: {
    key: "histoire",
    aspect: "16:9",
    backdrop: "carte",
    tint: "#e2cfac",
    alt: "Carte marine ancienne traversée d'une route en pointillés, compas et carnet d'exploration",
    brief: "16:9 — Carte ancienne en pleine page, route tracée, compas et carnet posés, épices dans une coupelle.",
    items: [
      { kind: "accessoire", id: "carnet", x: 0.2, base: 0.88, h: 0.26, depth: 1 },
      { kind: "accessoire", id: "compas", x: 0.82, base: 0.42, h: 0.2, depth: 1 },
      { kind: "botanique", id: "cacao", x: 0.62, base: 0.95, h: 0.2, depth: 2 },
      { kind: "botanique", id: "cafe", x: 0.46, base: 0.95, h: 0.14, depth: 2 },
    ],
  },
  professionnels: {
    key: "pro-comptoir",
    aspect: "16:9",
    backdrop: "atelier",
    tint: "#e4cfa9",
    surface: "#5e3b26",
    table: 0.68,
    light: "droite",
    alt: "Comptoir de coffee shop : bouteilles professionnelles de 700 ml alignées et boissons signatures prêtes à servir",
    brief: "16:9 — Comptoir premium, barista en arrière-plan flou, bouteilles 700 ml alignées, trois boissons signatures servies.",
    items: [
      { kind: "bouteille", slug: "fraise-des-bois-madeleine-doree", format: "700 ml", x: 0.12, base: 0.76, h: 0.5, depth: 0 },
      { kind: "bouteille", slug: "peche-blanche-fleur-oranger", format: "700 ml", x: 0.22, base: 0.76, h: 0.5, depth: 0 },
      { kind: "bouteille", slug: "poire-fondante-vanille-bourbon", format: "700 ml", x: 0.32, base: 0.76, h: 0.5, depth: 0 },
      { kind: "bouteille", slug: "datte-medjool-creme-brulee", format: "700 ml", x: 0.42, base: 0.76, h: 0.5, depth: 0 },
      { kind: "sachet", slug: "chocolat-intense-biscuit-dore", format: "1 kg", x: 0.54, base: 0.78, h: 0.36, depth: 0 },
      { kind: "boisson", look: getRecipe("latte-poire-vanille")!.look, x: 0.64, base: 0.96, h: 0.3, depth: 2 },
      { kind: "boisson", look: getRecipe("iced-latte-peche-fleur-oranger")!.look, x: 0.78, base: 0.96, h: 0.4, depth: 2 },
      { kind: "boisson", look: getRecipe("mocktail-petillant-peche-blanche")!.look, x: 0.9, base: 0.96, h: 0.44, depth: 2 },
    ],
  },
  maisonMatieres: {
    key: "maison-matieres",
    aspect: "4:5",
    backdrop: "lin",
    tint: "#ece0c9",
    alt: "Planche de matières : vanille, fleur d'oranger, cannelle, badiane et fruits",
    brief: "4:5 — Planche de matières premières disposées comme un herbier, lumière douce zénithale.",
    items: [
      { kind: "botanique", id: "vanille", x: 0.3, base: 0.36, h: 0.26, depth: 1 },
      { kind: "botanique", id: "fleur-oranger", x: 0.72, base: 0.38, h: 0.26, depth: 1 },
      { kind: "botanique", id: "chai", x: 0.3, base: 0.66, h: 0.24, depth: 1 },
      { kind: "botanique", id: "pistache", x: 0.72, base: 0.64, h: 0.2, depth: 1 },
      { kind: "botanique", id: "datte", x: 0.32, base: 0.94, h: 0.22, depth: 1 },
      { kind: "botanique", id: "cacao", x: 0.72, base: 0.94, h: 0.24, depth: 1 },
    ],
  },
  maisonAtelier: {
    key: "maison-table",
    aspect: "3:2",
    backdrop: "atelier",
    tint: "#efdcbf",
    surface: "#b08458",
    table: 0.64,
    light: "gauche",
    alt: "Table de travail : prototypes de flacons, carnet de notes, fruits et tasses de dégustation",
    brief: "3:2 — Table de création : prototypes, carnet annoté, tasses de dégustation, fruits coupés.",
    items: [
      { kind: "accessoire", id: "carnet", x: 0.28, base: 0.86, h: 0.18, depth: 1 },
      { kind: "bouteille", slug: "pistache-fleur-de-sel", x: 0.56, base: 0.86, h: 0.56, depth: 1 },
      { kind: "boisson", look: getRecipe("latte-madeleine-fraise")!.look, x: 0.76, base: 0.94, h: 0.3, depth: 2 },
      { kind: "botanique", id: "pistache", x: 0.44, base: 0.98, h: 0.14, depth: 2 },
      { kind: "botanique", id: "fleur-de-sel", x: 0.13, base: 0.98, h: 0.16, depth: 2 },
    ],
  },
  recettesAccueil: {
    key: "recettes-accueil",
    aspect: "16:9",
    backdrop: "lin",
    tint: "#efe2cc",
    alt: "Trois boissons Maison Sillage : un latte chaud, un iced latte et un chocolat nappé de crème",
    brief: "16:9 — Trois boissons signatures alignées en léger décalage, matières au pied des verres, lumière douce.",
    items: [
      { kind: "boisson", look: getRecipe("chocolat-chaud-datte-creme-brulee")!.look, x: 0.24, base: 0.86, h: 0.5, depth: 0 },
      { kind: "boisson", look: getRecipe("iced-latte-peche-fleur-oranger")!.look, x: 0.5, base: 0.9, h: 0.7, depth: 1 },
      { kind: "boisson", look: getRecipe("latte-poire-vanille")!.look, x: 0.76, base: 0.94, h: 0.44, depth: 2 },
      { kind: "botanique", id: "datte", x: 0.08, base: 0.95, h: 0.14, depth: 2 },
      { kind: "botanique", id: "peche", x: 0.36, base: 0.99, h: 0.15, depth: 2 },
      { kind: "botanique", id: "cafe", x: 0.93, base: 0.99, h: 0.13, depth: 2 },
    ],
  },
  siropsPage: {
    key: "sirops-page",
    aspect: "3:2",
    backdrop: "nuit",
    tint: "#a9692f",
    table: 0.74,
    light: "droite",
    alt: "Un flacon de 250 ml et une bouteille professionnelle de 700 ml côte à côte, en clair-obscur",
    brief: "3:2 — Les deux formats côte à côte en clair-obscur, liseré doré, un verre de dégustation.",
    items: [
      { kind: "bouteille", slug: "peche-blanche-fleur-oranger", format: "700 ml", x: 0.36, base: 0.9, h: 0.76, depth: 1 },
      { kind: "bouteille", slug: "datte-medjool-creme-brulee", x: 0.56, base: 0.93, h: 0.56, depth: 2 },
      { kind: "boisson", look: getRecipe("affogato-datte-creme-brulee")!.look, x: 0.76, base: 0.95, h: 0.4, depth: 2 },
    ],
  },
  poudresPage: {
    key: "poudres-page",
    aspect: "3:2",
    backdrop: "atelier",
    tint: "#ecdcc0",
    surface: "#6e4c32",
    table: 0.66,
    light: "gauche",
    alt: "Les quatre sachets de préparations en poudre alignés sur une table sombre",
    brief: "3:2 — Quatre doypacks alignés, deux ivoire et deux bruns, cuillère de poudre au premier plan.",
    items: [
      { kind: "sachet", slug: "latte-madeleine-vanille-patissiere", x: 0.2, base: 0.88, h: 0.44, depth: 1 },
      { kind: "sachet", slug: "pistache-douce-vanille", x: 0.4, base: 0.88, h: 0.44, depth: 1 },
      { kind: "sachet", slug: "chai-velours-fleur-oranger", x: 0.6, base: 0.88, h: 0.44, depth: 1 },
      { kind: "sachet", slug: "chocolat-intense-biscuit-dore", x: 0.8, base: 0.88, h: 0.44, depth: 1 },
      { kind: "accessoire", id: "cuillere", x: 0.5, base: 0.98, h: 0.06, depth: 2 },
    ],
  },
  maisonCarte: {
    key: "maison-carte",
    aspect: "21:9",
    backdrop: "carte",
    tint: "#e3d0ad",
    alt: "Grande carte marine imaginaire traversée par la route des saveurs",
    brief: "21:9 — Carte ancienne panoramique, route tracée, légendes manuscrites, épices posées sur les escales.",
    items: [
      { kind: "botanique", id: "vanille", x: 0.18, base: 0.62, h: 0.28, depth: 1 },
      { kind: "botanique", id: "chai", x: 0.42, base: 0.92, h: 0.26, depth: 1 },
      { kind: "botanique", id: "fleur-oranger", x: 0.64, base: 0.5, h: 0.26, depth: 1 },
      { kind: "botanique", id: "cafe", x: 0.86, base: 0.86, h: 0.2, depth: 1 },
    ],
  },
  proPage: {
    key: "pro-page",
    aspect: "21:9",
    backdrop: "nuit",
    tint: "#7a5528",
    table: 0.7,
    light: "gauche",
    alt: "Service du soir au comptoir : boissons signatures alignées et bouteilles professionnelles",
    brief: "21:9 — Comptoir en fin de service, lumière basse, cinq boissons signatures en ligne, bouteilles 700 ml en retrait.",
    items: [
      { kind: "bouteille", slug: "poire-fondante-vanille-bourbon", format: "700 ml", x: 0.12, base: 0.8, h: 0.6, depth: 0 },
      { kind: "sachet", slug: "pistache-douce-vanille", format: "1 kg", x: 0.22, base: 0.82, h: 0.44, depth: 0 },
      { kind: "boisson", look: getRecipe("frappe-pistache-vanille")!.look, x: 0.36, base: 0.96, h: 0.5, depth: 1 },
      { kind: "boisson", look: getRecipe("chai-glace-fleur-oranger")!.look, x: 0.48, base: 0.96, h: 0.5, depth: 1 },
      { kind: "boisson", look: getRecipe("milkshake-fraise-madeleine")!.look, x: 0.6, base: 0.96, h: 0.5, depth: 1 },
      { kind: "boisson", look: getRecipe("latte-madeleine-fraise")!.look, x: 0.74, base: 0.97, h: 0.32, depth: 2 },
      { kind: "boisson", look: getRecipe("affogato-datte-creme-brulee")!.look, x: 0.87, base: 0.97, h: 0.36, depth: 2 },
    ],
  },
  journalIndex: {
    key: "journal-index",
    aspect: "16:9",
    backdrop: "lin",
    tint: "#e8dbc2",
    alt: "Carnet de bord ouvert, compas et gousse de vanille sur une table claire",
    brief: "16:9 — Carnet ouvert vu de près, plume, compas, une gousse de vanille, lumière douce.",
    items: [
      { kind: "accessoire", id: "carnet", x: 0.42, base: 0.84, h: 0.3, depth: 1 },
      { kind: "accessoire", id: "compas", x: 0.76, base: 0.9, h: 0.16, depth: 2 },
      { kind: "botanique", id: "vanille", x: 0.16, base: 0.94, h: 0.3, depth: 2 },
    ],
  },
  recettesPage: {
    key: "recettes-page",
    aspect: "21:9",
    backdrop: "large",
    tint: "#efd3aa",
    surface: "#a47b52",
    table: 0.72,
    light: "droite",
    ship: 0.3,
    alt: "Une table de terrasse face à la mer, avec un mocktail, un frappé et un latte",
    brief: "21:9 — Panoramique en terrasse, trois boissons de styles différents, mer au loin.",
    items: [
      { kind: "boisson", look: getRecipe("mocktail-petillant-peche-blanche")!.look, x: 0.56, base: 0.94, h: 0.54, depth: 1 },
      { kind: "boisson", look: getRecipe("frappe-pistache-vanille")!.look, x: 0.68, base: 0.94, h: 0.56, depth: 1 },
      { kind: "boisson", look: getRecipe("latte-poire-vanille")!.look, x: 0.82, base: 0.97, h: 0.34, depth: 2 },
      { kind: "botanique", id: "peche", x: 0.45, base: 0.98, h: 0.16, depth: 2 },
    ],
  },
} satisfies Record<string, SceneConfig>;

/* Saisons — accueil (4:5) et page Collections (16:9) */
type SeasonScenes = Record<SeasonId, SceneConfig>;

export const seasonHome: SeasonScenes = {
  printemps: {
    key: "accueil-printemps",
    aspect: "4:5",
    backdrop: "lin",
    tint: "#f1dcd5",
    alt: "Printemps : flacon Fraise des bois & Madeleine, sachet Latte Madeleine et milkshake rose",
    brief: "4:5 — Fond rose fané, flacon fraise, doypack ivoire, milkshake, fraises et madeleines.",
    items: [
      { kind: "sachet", slug: "latte-madeleine-vanille-patissiere", x: 0.28, base: 0.78, h: 0.38, depth: 0 },
      { kind: "bouteille", slug: "fraise-des-bois-madeleine-doree", x: 0.55, base: 0.86, h: 0.56, depth: 1 },
      { kind: "boisson", look: getRecipe("milkshake-fraise-madeleine")!.look, x: 0.8, base: 0.92, h: 0.38, depth: 2 },
      { kind: "botanique", id: "fraise", x: 0.22, base: 0.97, h: 0.13, depth: 2 },
      { kind: "botanique", id: "madeleine", x: 0.38, base: 0.98, h: 0.12, depth: 2 },
    ],
  },
  ete: {
    key: "accueil-ete",
    aspect: "4:5",
    backdrop: "large",
    tint: "#f3d3b4",
    surface: "#cfa883",
    table: 0.62,
    light: "droite",
    alt: "Été : flacon Pêche blanche & Fleur d'oranger, mocktail pétillant et sachet Pistache douce",
    brief: "4:5 — Lumière d'été, terrasse face à la mer, mocktail pétillant, pêches et fleurs d'oranger.",
    items: [
      { kind: "sachet", slug: "pistache-douce-vanille", x: 0.24, base: 0.8, h: 0.34, depth: 0 },
      { kind: "bouteille", slug: "peche-blanche-fleur-oranger", x: 0.5, base: 0.88, h: 0.54, depth: 1 },
      { kind: "boisson", look: getRecipe("mocktail-petillant-peche-blanche")!.look, x: 0.77, base: 0.93, h: 0.46, depth: 2 },
      { kind: "botanique", id: "peche", x: 0.3, base: 0.98, h: 0.14, depth: 2 },
      { kind: "botanique", id: "fleur-oranger", x: 0.92, base: 0.98, h: 0.15, depth: 2 },
    ],
  },
  automne: {
    key: "accueil-automne",
    aspect: "4:5",
    backdrop: "atelier",
    tint: "#e7cfa8",
    surface: "#8e6440",
    table: 0.66,
    light: "gauche",
    alt: "Automne : flacon Poire fondante & Vanille, sachet Chaï velours et latte fumant",
    brief: "4:5 — Intérieur doré, lumière de fin d'après-midi, latte chaud, poires, cannelle et badiane.",
    items: [
      { kind: "sachet", slug: "chai-velours-fleur-oranger", x: 0.74, base: 0.8, h: 0.36, depth: 0 },
      { kind: "bouteille", slug: "poire-fondante-vanille-bourbon", x: 0.42, base: 0.87, h: 0.56, depth: 1 },
      { kind: "boisson", look: getRecipe("latte-poire-vanille")!.look, x: 0.72, base: 0.96, h: 0.3, depth: 2 },
      { kind: "botanique", id: "chai", x: 0.2, base: 0.97, h: 0.14, depth: 2 },
    ],
  },
  hiver: {
    key: "accueil-hiver",
    aspect: "4:5",
    backdrop: "nuit",
    tint: "#5e3b2a",
    table: 0.68,
    light: "droite",
    alt: "Hiver : flacon Datte Medjool & Crème brûlée, sachet Chocolat intense et chocolat viennois",
    brief: "4:5 — Ambiance de veillée, fond sombre, chocolat chaud fumant, dattes, éclats de biscuit.",
    items: [
      { kind: "sachet", slug: "chocolat-intense-biscuit-dore", x: 0.26, base: 0.82, h: 0.38, depth: 0 },
      { kind: "bouteille", slug: "datte-medjool-creme-brulee", x: 0.55, base: 0.88, h: 0.56, depth: 1 },
      { kind: "boisson", look: getRecipe("chocolat-chaud-datte-creme-brulee")!.look, x: 0.8, base: 0.95, h: 0.32, depth: 2 },
      { kind: "botanique", id: "datte", x: 0.3, base: 0.99, h: 0.13, depth: 2 },
    ],
  },
};

export const seasonChapter: SeasonScenes = {
  printemps: {
    key: "chapitre-printemps",
    aspect: "16:9",
    backdrop: "atelier",
    tint: "#f0dcd4",
    surface: "#c9a092",
    table: 0.68,
    light: "gauche",
    alt: "Chapitre printemps : goûter dressé avec latte madeleine, fraises et flacon",
    brief: "16:9 — Table de goûter printanière, nappe claire, latte madeleine, fraises des bois en coupelle.",
    items: [
      { kind: "botanique", id: "fleur-oranger", x: 0.12, base: 0.76, h: 0.2, depth: 0 },
      { kind: "bouteille", slug: "fraise-des-bois-madeleine-doree", x: 0.62, base: 0.9, h: 0.6, depth: 1 },
      { kind: "boisson", look: getRecipe("latte-madeleine-fraise")!.look, x: 0.8, base: 0.97, h: 0.32, depth: 2 },
      { kind: "botanique", id: "madeleine", x: 0.44, base: 0.98, h: 0.16, depth: 2 },
      { kind: "botanique", id: "fraise", x: 0.52, base: 1.0, h: 0.14, depth: 2 },
    ],
  },
  ete: {
    key: "chapitre-ete",
    aspect: "16:9",
    backdrop: "large",
    tint: "#f2cfa9",
    surface: "#d2a97f",
    table: 0.7,
    light: "droite",
    alt: "Chapitre été : iced latte pêche et frappé pistache sur une terrasse face à la mer",
    brief: "16:9 — Terrasse méditerranéenne, deux boissons glacées, pêches entières, lumière franche.",
    items: [
      { kind: "boisson", look: getRecipe("iced-latte-peche-fleur-oranger")!.look, x: 0.56, base: 0.94, h: 0.46, depth: 1 },
      { kind: "boisson", look: getRecipe("frappe-pistache-vanille")!.look, x: 0.7, base: 0.95, h: 0.48, depth: 1 },
      { kind: "sachet", slug: "pistache-douce-vanille", x: 0.86, base: 0.88, h: 0.38, depth: 0 },
      { kind: "botanique", id: "peche", x: 0.42, base: 1.0, h: 0.17, depth: 2 },
    ],
  },
  automne: {
    key: "chapitre-automne",
    aspect: "16:9",
    backdrop: "carte",
    tint: "#e6cfa7",
    alt: "Chapitre automne : chaï glacé, sachet de chaï et épices posés sur une carte des routes commerciales",
    brief: "16:9 — Vue plongeante sur une carte, chaï glacé, cannelle, badiane, poires.",
    items: [
      { kind: "botanique", id: "chai", x: 0.22, base: 0.6, h: 0.26, depth: 1 },
      { kind: "sachet", slug: "chai-velours-fleur-oranger", x: 0.56, base: 0.9, h: 0.5, depth: 1 },
      { kind: "boisson", look: getRecipe("chai-glace-fleur-oranger")!.look, x: 0.74, base: 0.94, h: 0.44, depth: 2 },
      { kind: "botanique", id: "poire", x: 0.36, base: 0.98, h: 0.2, depth: 2 },
    ],
  },
  hiver: {
    key: "chapitre-hiver",
    aspect: "16:9",
    backdrop: "nuit",
    tint: "#6b4632",
    table: 0.7,
    light: "gauche",
    alt: "Chapitre hiver : affogato, chocolat en tablette et flacon Datte & Crème brûlée dans la pénombre",
    brief: "16:9 — Veillée d'hiver, affogato servi, éclats de chocolat, flacon en contre-jour.",
    items: [
      { kind: "bouteille", slug: "datte-medjool-creme-brulee", x: 0.34, base: 0.9, h: 0.6, depth: 1 },
      { kind: "boisson", look: getRecipe("affogato-datte-creme-brulee")!.look, x: 0.58, base: 0.95, h: 0.42, depth: 2 },
      { kind: "botanique", id: "cacao", x: 0.76, base: 0.98, h: 0.2, depth: 2 },
      { kind: "botanique", id: "vanille", x: 0.16, base: 0.98, h: 0.18, depth: 2 },
    ],
  },
};

/* Produits : cinq cadrages distincts par création */
function packItem(p: Product, x: number, base: number, h: number, depth: 0 | 1 | 2 = 1, format?: string): SceneItem {
  if (p.pack === "coffret") return { kind: "coffret", x, base, h: h * 0.9, depth };
  if (p.pack === "bouteille") return { kind: "bouteille", slug: p.slug, x, base, h, depth, format };
  return { kind: "sachet", slug: p.slug, x, base, h: h * 0.8, depth, format };
}

export function productScenes(p: Product) {
  const [b1, b2 = b1] = p.botanicals;
  const recipe = getRecipe(
    {
      "fraise-des-bois-madeleine-doree": "milkshake-fraise-madeleine",
      "peche-blanche-fleur-oranger": "iced-latte-peche-fleur-oranger",
      "poire-fondante-vanille-bourbon": "latte-poire-vanille",
      "datte-medjool-creme-brulee": "affogato-datte-creme-brulee",
      "pistache-fleur-de-sel": "frappe-pistache-vanille",
      "latte-madeleine-vanille-patissiere": "latte-madeleine-fraise",
      "pistache-douce-vanille": "frappe-pistache-vanille",
      "chai-velours-fleur-oranger": "chai-glace-fleur-oranger",
      "chocolat-intense-biscuit-dore": "chocolat-chaud-datte-creme-brulee",
      "coffret-decouverte": "mocktail-petillant-peche-blanche",
    }[p.slug] ?? "latte-poire-vanille",
  )!;
  const isBox = p.pack === "coffret";

  const carte: SceneConfig = {
    key: `${p.slug}-carte`,
    aspect: "4:5",
    backdrop: "lin",
    tint: p.palette.tint,
    alt: `${p.name}, conditionnement de démonstration`,
    brief: `4:5 — Packshot sur fond ${p.palette.tint}, ombre douce, ${b1} en arrière-plan.`,
    items: [
      { kind: "botanique", id: b1, x: isBox ? 0.82 : 0.7, base: 0.72, h: 0.2, depth: 0 },
      packItem(p, 0.5, 0.86, isBox ? 0.5 : 0.66),
    ],
  };
  const principale: SceneConfig = {
    key: `${p.slug}-fiche`,
    aspect: "4:5",
    backdrop: "atelier",
    tint: p.palette.tint,
    surface: p.palette.accent,
    table: 0.68,
    light: "gauche",
    alt: `${p.name} sur une table, entouré de ses matières aromatiques`,
    brief: `4:5 — Produit héros de trois quarts, ${b1} et ${b2} au premier plan, lumière de fenêtre.`,
    items: [
      packItem(p, 0.5, 0.88, isBox ? 0.48 : 0.64),
      { kind: "botanique", id: b1, x: 0.2, base: 0.97, h: 0.16, depth: 2 },
      { kind: "botanique", id: b2, x: 0.82, base: 0.98, h: 0.15, depth: 2 },
    ],
  };
  const situation: SceneConfig = {
    key: `${p.slug}-situation`,
    aspect: "1:1",
    backdrop: p.season === "hiver" ? "nuit" : "large",
    tint: p.palette.tint,
    surface: "#94693f",
    table: 0.66,
    light: "droite",
    alt: `${p.name} en situation : ${recipe.title}`,
    brief: `1:1 — En situation : ${recipe.title} servi à côté du produit, décor marin discret.`,
    items: [
      packItem(p, isBox ? 0.36 : 0.36, 0.86, isBox ? 0.42 : 0.58, 1),
      { kind: "boisson", look: recipe.look, x: 0.7, base: 0.94, h: 0.44, depth: 2 },
    ],
  };
  const matieres: SceneConfig = {
    key: `${p.slug}-matieres`,
    aspect: "1:1",
    backdrop: "carte",
    tint: p.palette.tint,
    alt: `Les matières qui inspirent ${p.name}`,
    brief: `1:1 — Flat lay des matières : ${p.botanicals.join(", ")} sur une carte ancienne.`,
    items: p.botanicals.slice(0, 3).map((id, i, arr) => ({
      kind: "botanique" as const,
      id,
      x: arr.length === 1 ? 0.5 : 0.3 + (i * 0.4) / Math.max(1, arr.length - 1),
      base: i % 2 ? 0.86 : 0.62,
      h: 0.36,
      depth: 1 as const,
    })),
  };
  const signature: SceneConfig = {
    key: `${p.slug}-signature`,
    aspect: "3:4",
    backdrop: "nuit",
    tint: p.palette.liquid,
    table: 0.74,
    light: "gauche",
    alt: `${p.name} en contre-jour`,
    brief: `3:4 — Produit seul en clair-obscur, liseré de lumière dorée, fond profond.`,
    items: [packItem(p, 0.5, 0.92, isBox ? 0.48 : 0.7)],
  };
  const gamme: SceneConfig = {
    key: `${p.slug}-gamme`,
    aspect: "4:5",
    backdrop: "atelier",
    tint: p.palette.tint,
    surface: "#c9a87e",
    table: 0.62,
    light: "droite",
    alt: `${p.name}, présenté sur une table claire`,
    brief: `4:5 — Produit décentré à gauche, ${b2} en grand au premier plan droit, lumière de fin de journée.`,
    items: [
      packItem(p, 0.4, 0.86, isBox ? 0.46 : 0.6),
      { kind: "botanique", id: b2, x: 0.76, base: 0.95, h: 0.22, depth: 2 },
    ],
  };
  const detail: SceneConfig = {
    key: `${p.slug}-detail`,
    aspect: "4:5",
    backdrop: "lin",
    tint: p.palette.tint,
    light: "gauche",
    alt: `Détail de l'étiquette ${p.name}`,
    brief: "4:5 — Gros plan sur l'étiquette gravée, profondeur de champ courte, texture du papier visible.",
    items: [{ ...packItem(p, 0.5, isBox ? 1.35 : p.pack === "bouteille" ? 1.62 : 1.4, isBox ? 1.5 : p.pack === "bouteille" ? 2.1 : 1.9), shadow: false }],
  };
  return { carte, principale, situation, matieres, signature, gamme, detail };
}

/* Recettes : vignette et page, deux compositions distinctes */
export function recipeScenes(r: Recipe) {
  const product = getProduct(r.products[0]) ?? products[0];
  const card: SceneConfig = {
    key: `${r.slug}-carte`,
    aspect: "4:5",
    backdrop: "lin",
    tint: r.scene.bg,
    alt: r.title,
    brief: `4:5 — La boisson seule, fond ${r.scene.bg}, garniture au pied du verre.`,
    items: [
      { kind: "boisson", look: { ...r.look, garnish: undefined }, x: 0.5, base: 0.88, h: 0.66, depth: 1 },
      ...(r.look.garnish ? [{ kind: "botanique" as const, id: r.look.garnish, x: 0.78, base: 0.94, h: 0.17, depth: 2 as const }] : []),
    ],
  };
  const page: SceneConfig = {
    key: `${r.slug}-page`,
    aspect: "4:5",
    backdrop: "atelier",
    tint: r.scene.bg,
    surface: r.scene.surface,
    table: 0.64,
    light: "droite",
    alt: `${r.title}, servi avec ${product.name}`,
    brief: `4:5 — Boisson finale au premier plan, produit associé en retrait, ingrédients disposés.`,
    items: [
      packItem(product, 0.27, 0.8, 0.46, 0),
      { kind: "boisson", look: r.look, x: 0.6, base: 0.93, h: 0.56, depth: 1 },
      { kind: "botanique", id: product.botanicals[0], x: 0.88, base: 0.97, h: 0.15, depth: 2 },
    ],
  };
  return { card, page };
}

/* Journal */
export const articleScenes: Record<string, SceneConfig> = {
  alambic: {
    key: "journal-officine",
    aspect: "3:2",
    backdrop: "atelier",
    tint: "#e7d6b9",
    surface: "#6e4c32",
    table: 0.7,
    light: "gauche",
    alt: "Étagère d'officine évoquée : flacons alignés et plantes séchées",
    brief: "3:2 — Clin d'œil aux officines : flacons alignés, plantes, lumière tamisée.",
    items: [
      { kind: "botanique", id: "fleur-oranger", x: 0.18, base: 0.92, h: 0.24, depth: 1 },
      { kind: "bouteille", slug: "peche-blanche-fleur-oranger", x: 0.42, base: 0.9, h: 0.6, depth: 1 },
      { kind: "bouteille", slug: "datte-medjool-creme-brulee", x: 0.58, base: 0.94, h: 0.52, depth: 2 },
      { kind: "botanique", id: "vanille", x: 0.8, base: 0.98, h: 0.22, depth: 2 },
    ],
  },
  verre: {
    key: "journal-latte",
    aspect: "3:2",
    backdrop: "lin",
    tint: "#efe1c9",
    alt: "Deux lattes côte à côte, l'un chaud, l'autre glacé",
    brief: "3:2 — Gros plan sur deux lattes, mousse fine, détail de la texture du lait.",
    items: [
      { kind: "boisson", look: getRecipe("latte-poire-vanille")!.look, x: 0.36, base: 0.9, h: 0.5, depth: 1 },
      { kind: "boisson", look: { ...ICED, straw: false }, x: 0.64, base: 0.92, h: 0.66, depth: 1 },
      { kind: "botanique", id: "cafe", x: 0.84, base: 0.98, h: 0.16, depth: 2 },
    ],
  },
  saisons: {
    key: "journal-saisons",
    aspect: "3:2",
    backdrop: "lin",
    tint: "#ecdcc4",
    alt: "Quatre fruits de saison : fraise, pêche, poire et datte",
    brief: "3:2 — Quatre matières alignées comme un calendrier : fraise, pêche, poire, datte.",
    items: [
      { kind: "botanique", id: "fraise", x: 0.2, base: 0.76, h: 0.32, depth: 1 },
      { kind: "botanique", id: "peche", x: 0.4, base: 0.76, h: 0.32, depth: 1 },
      { kind: "botanique", id: "poire", x: 0.6, base: 0.76, h: 0.34, depth: 1 },
      { kind: "botanique", id: "datte", x: 0.8, base: 0.76, h: 0.32, depth: 1 },
    ],
  },
  comptoir: {
    key: "journal-carte",
    aspect: "3:2",
    backdrop: "atelier",
    tint: "#dcc6a2",
    surface: "#4b3020",
    table: 0.7,
    light: "droite",
    alt: "Trois boissons signatures servies sur un comptoir sombre",
    brief: "3:2 — Comptoir sombre, trois boissons signatures alignées, carte des boissons manuscrite.",
    items: [
      { kind: "boisson", look: getRecipe("milkshake-fraise-madeleine")!.look, x: 0.28, base: 0.95, h: 0.56, depth: 1 },
      { kind: "boisson", look: getRecipe("chai-glace-fleur-oranger")!.look, x: 0.5, base: 0.95, h: 0.58, depth: 1 },
      { kind: "boisson", look: getRecipe("chocolat-chaud-datte-creme-brulee")!.look, x: 0.72, base: 0.95, h: 0.46, depth: 1 },
    ],
  },
  carte: {
    key: "journal-routes",
    aspect: "3:2",
    backdrop: "carte",
    tint: "#dfc9a0",
    alt: "Carte des anciennes routes maritimes avec vanille et cacao",
    brief: "3:2 — Carte ancienne, gousses de vanille et cabosse posées sur la route tracée.",
    items: [
      { kind: "botanique", id: "vanille", x: 0.3, base: 0.7, h: 0.4, depth: 1 },
      { kind: "botanique", id: "cacao", x: 0.66, base: 0.9, h: 0.36, depth: 1 },
    ],
  },
};

export const allSceneKeys = () => {
  const keys: string[] = [];
  Object.values(scenes).forEach((s) => keys.push(s.key));
  Object.values(seasonHome).forEach((s) => keys.push(s.key));
  Object.values(seasonChapter).forEach((s) => keys.push(s.key));
  products.forEach((p) => Object.values(productScenes(p)).forEach((s) => keys.push(s.key)));
  Object.values(articleScenes).forEach((s) => keys.push(s.key));
  return keys;
};
