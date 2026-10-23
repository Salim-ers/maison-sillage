/* Filtres de la boutique partagés par la page serveur (lecture de l'URL) et le catalogue client.
   Un module « use client » n'exporte vers le serveur que des références : ces listes vivent donc ici. */

export type PriceRange = "moins-15" | "15-25" | "plus-25";

/** formats grand public, regroupés par contenance */
export const FORMATS = ["250 ml", "700 ml", "200 g", "À l'unité"] as const;

export const PRICES: { id: PriceRange; label: string; test: (n: number) => boolean }[] = [
  { id: "moins-15", label: "Moins de 15 €", test: (n) => n < 15 },
  { id: "15-25", label: "De 15 à 25 €", test: (n) => n >= 15 && n <= 25 },
  { id: "plus-25", label: "Plus de 25 €", test: (n) => n > 25 },
];
