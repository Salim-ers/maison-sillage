// Contrôle de cohérence du catalogue (node scripts/qa/catalogue.mjs) :
// 32 références, liens produit ↔ recette ↔ préparation, compléments existants, formats.
import { products } from "../../data/products.ts";
import { recipes } from "../../data/recipes.ts";

const errors = [];
const bySlug = new Map(products.map((p) => [p.slug, p]));
const recipeSlugs = new Set(recipes.map((r) => r.slug));
const count = (c) => products.filter((p) => p.category === c).length;
const expect = (cond, msg) => cond || errors.push(msg);

expect(products.length === 32, `32 références attendues, ${products.length} trouvées`);
expect(count("sirop") === 8, "8 sirops attendus");
expect(count("poudre") === 8, "8 poudres signatures attendues");
expect(count("essentiel") === 8, "8 Essentiels attendus");
expect(count("accessoire") + count("coffret") === 8, "8 références Atelier attendues");
expect(new Set(products.map((p) => p.slug)).size === 32, "slugs en double");
expect(new Set(products.map((p) => p.id)).size === 32, "identifiants en double");
for (const p of products) {
  for (const c of p.complements) expect(bySlug.has(c), `${p.slug} : complément inconnu ${c}`);
  for (const r of p.recipes) {
    expect(recipeSlugs.has(r), `${p.slug} : recette inconnue ${r}`);
    expect(recipes.find((x) => x.slug === r)?.products.includes(p.slug), `${p.slug} : la recette ${r} ne cite pas le produit`);
  }
  for (const s of p.servings) if (s.recipe) expect(p.recipes.includes(s.recipe), `${p.slug} : préparation ${s.drink} liée à ${s.recipe} absent de recipes`);
  expect(p.formats.length > 0, `${p.slug} : aucun format`);
  expect(p.images.length >= 2, `${p.slug} : moins de deux photographies`);
  expect(new Set(p.images).size === p.images.length, `${p.slug} : photographie répétée dans la galerie`);
  if (p.category !== "accessoire" && p.category !== "coffret") expect(p.servings.length > 0, `${p.slug} : aucune préparation`);
}
for (const r of recipes) {
  for (const s of r.products) {
    expect(bySlug.has(s), `recette ${r.slug} : produit inconnu ${s}`);
    expect(bySlug.get(s)?.recipes.includes(r.slug), `recette ${r.slug} : absente de la fiche ${s}`);
  }
}
const drinks = ["espresso", "latte", "iced-latte", "chocolat", "frappe", "mocktail", "milkshake"];
for (const d of drinks) expect(recipes.some((r) => r.drink === d), `aucune recette pour ${d}`);
console.log(errors.length ? errors.join("\n") : `Catalogue cohérent : ${products.length} références, ${recipes.length} recettes.`);
process.exit(errors.length ? 1 : 0);
