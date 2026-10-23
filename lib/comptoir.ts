import { products } from "@/data/products";
import { recipes } from "@/data/recipes";
import type { DrinkType, Envie, Product, Recipe, SeasonId, Serving } from "@/lib/types";

/* ──────────────────────────────────────────────────────────────
   Le Comptoir des Saveurs : une boisson, une envie, une saison →
   les créations compatibles et une recette. Toutes les associations
   viennent des fiches produits (servings, envies, season) et des
   recettes (drink, envies, seasons) : aucune règle n'est écrite ici
   pour un produit en particulier.
   ────────────────────────────────────────────────────────────── */

export type Choice = { drink: DrinkType; envie: Envie; season: SeasonId };
export type Match = { product: Product; serving: Serving; score: number; reasons: string[] };

const ORDER = { sirop: 0, poudre: 1, essentiel: 2, accessoire: 3, coffret: 4 } as const;

function score(p: Product, c: Choice): Match | null {
  const serving = p.servings.find((s) => s.drink === c.drink);
  if (!serving) return null; // la boisson doit être prévue par la fiche
  if (p.season && p.season !== c.season) return null; // une création de saison n'apparaît qu'en sa saison
  let s = 0;
  const reasons: string[] = [];
  const rank = p.envies.indexOf(c.envie);
  if (rank === 0) s += 4;
  else if (rank > 0) s += 3 - Math.min(rank, 2);
  if (rank >= 0) reasons.push("envie");
  if (p.season === c.season) {
    s += 3;
    reasons.push("saison");
  } else s += 1; // création permanente : toujours possible, moins prioritaire
  if (serving.recipe) s += 0.5;
  return { product: p, serving, score: s, reasons };
}

/** Créations compatibles, de la plus juste à la moins juste ; l'envie doit correspondre si possible */
export function matches(c: Choice, limit = 4): Match[] {
  const all = products.map((p) => score(p, c)).filter((m): m is Match => !!m);
  const withEnvie = all.filter((m) => m.reasons.includes("envie"));
  const pool = withEnvie.length ? withEnvie : all;
  return pool.sort((a, b) => b.score - a.score || ORDER[a.product.category] - ORDER[b.product.category]).slice(0, limit);
}

/** Recette suggérée : même boisson, au plus près des créations proposées, de l'envie et de la saison */
export function suggestedRecipe(c: Choice, found: Match[]): Recipe | null {
  const top = found.map((m) => m.product.slug);
  const candidates = recipes.filter((r) => r.drink === c.drink);
  let best: Recipe | null = null;
  let bestScore = -1;
  for (const r of candidates) {
    let s = 0;
    if (top[0] && r.products.includes(top[0])) s += 4;
    s += r.products.filter((p) => top.includes(p)).length;
    if (r.envies.includes(c.envie)) s += 2;
    if (r.seasons.includes(c.season)) s += 2;
    if (s > bestScore) {
      best = r;
      bestScore = s;
    }
  }
  if (best && bestScore > 0) return best;
  const fromServing = found.find((m) => m.serving.recipe)?.serving.recipe;
  return (fromServing && recipes.find((r) => r.slug === fromServing)) || best;
}

export function comptoir(c: Choice) {
  const found = matches(c);
  return { matches: found, recipe: suggestedRecipe(c, found) };
}
