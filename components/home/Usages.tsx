import Link from "next/link";
import { recipes } from "@/data/recipes";
import { recipeCategoryLabels } from "@/data/collections";
import { scenes } from "@/data/media";
import { Figure } from "@/components/ui/Figure";
import { RevealTitle, Rise } from "@/components/animations";
import type { RecipeCategory } from "@/lib/types";

/* Chapitre 7 — recettes et usages : découvrir par envie */
export function Usages() {
  const cats = Object.entries(recipeCategoryLabels) as [RecipeCategory, string][];
  const featured = ["latte-poire-vanille", "iced-latte-peche-fleur-oranger", "chocolat-chaud-datte-creme-brulee", "mocktail-petillant-peche-blanche", "frappe-pistache-vanille", "milkshake-fraise-madeleine"]
    .map((s) => recipes.find((r) => r.slug === s)!)
    .filter(Boolean);
  return (
    <section className="py-24 md:py-36" aria-labelledby="usages-titre">
      <div className="shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mention text-bronze-ink">Recettes &amp; usages</p>
          <RevealTitle id="usages-titre" text="De quoi avez-vous envie aujourd'hui ?" className="titre mt-4" />
        </div>
        <Rise>
          <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2.5" aria-label="Découvrir par usage">
            {cats.map(([id, label]) => (
              <li key={id}>
                <Link href={`/recettes?usage=${id}`} className="block border border-espresso/25 px-4 py-2.5 text-sm transition duration-300 hover:border-espresso hover:bg-espresso hover:text-creme">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </Rise>

        <div className="mt-16 md:mt-20">
          <Figure scene={scenes.recettesAccueil} parallax sizes="100vw" />
        </div>

        <div className="mt-12 grid gap-x-12 md:grid-cols-2">
          {featured.map((r, i) => (
            <Rise key={r.slug} delay={(i % 2) * 0.08}>
              <Link href={`/recettes/${r.slug}`} className="group flex items-baseline justify-between gap-6 border-b border-espresso/15 py-5">
                <span>
                  <span className="block text-[0.7rem] uppercase tracking-[0.18em] text-bronze-ink">{recipeCategoryLabels[r.category]}</span>
                  <span className="mt-1 block font-serif text-[1.65rem] leading-tight transition-colors group-hover:text-espresso">{r.title}</span>
                </span>
                <span className="shrink-0 text-sm text-espresso/70">{r.temps}</span>
              </Link>
            </Rise>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/recettes" className="btn btn-encre">
            Toutes les recettes
          </Link>
        </div>
      </div>
    </section>
  );
}
