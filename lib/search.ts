import { products, saveurLabels } from "@/data/products";
import { recipes, drinkLabels } from "@/data/recipes";
import { articles } from "@/data/journal";
import { categoryLabels, collectionLabels, drinkTypes, envies, getSeason } from "@/data/collections";
import type { Product } from "@/lib/types";

export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");

const enviesLabel = Object.fromEntries(envies.map((e) => [e.id, e.label]));

export function productHaystack(p: Product) {
  return normalize(
    [
      p.name,
      p.tagline,
      p.description,
      p.notes.join(" "),
      p.saveurs.map((x) => saveurLabels[x]).join(" "),
      p.envies.map((x) => enviesLabel[x]).join(" "),
      p.servings.map((s) => drinkLabels[s.drink]).join(" "),
      p.usages.join(" "),
      categoryLabels[p.category],
      collectionLabels[p.collection],
      p.season ? getSeason(p.season).name : "",
    ].join(" "),
  );
}

export function matches(haystack: string, query: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return terms.every((t) => haystack.includes(t));
}

export type Suggestion = { kind: "produit" | "saveur" | "boisson"; label: string; value: string; href?: string };

/** Suggestions de saisie : produits dont le nom commence par un mot tapé, saveurs et boissons */
export function suggest(query: string, limit = 7): Suggestion[] {
  const q = normalize(query).trim();
  if (q.length < 2) return [];
  const starts = (s: string) => normalize(s).split(/\s+/).some((w) => w.startsWith(q)) || normalize(s).includes(q);
  const out: Suggestion[] = [];
  for (const label of Object.values(saveurLabels)) if (starts(label)) out.push({ kind: "saveur", label, value: label });
  for (const d of drinkTypes) if (starts(d.label)) out.push({ kind: "boisson", label: d.label, value: d.label });
  for (const p of products) if (starts(p.name)) out.push({ kind: "produit", label: p.name, value: p.name, href: `/produits/${p.slug}` });
  return out.slice(0, limit);
}

export function searchAll(query: string) {
  if (!query.trim()) return { products: [], recipes: [], articles: [] };
  return {
    products: products.filter((p) => matches(productHaystack(p), query)),
    recipes: recipes.filter((r) => matches(normalize(`${r.title} ${r.intro} ${drinkLabels[r.drink]} ${r.ingredients.map((i) => i.item).join(" ")}`), query)),
    articles: articles.filter((a) => matches(normalize(`${a.title} ${a.chapo} ${a.rubrique}`), query)),
  };
}
