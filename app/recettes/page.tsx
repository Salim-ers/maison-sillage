import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { RecipeIndex } from "@/components/editorial/RecipeIndex";
import { Comptoir } from "@/components/editorial/Comptoir";
import { Photo } from "@/components/ui/Photo";
import { RevealNow } from "@/components/ui/RevealNow";
import { pages } from "@/data/images";
import { drinkLabels } from "@/data/recipes";
import type { Recipe } from "@/lib/types";

export const metadata: Metadata = {
  title: "Recettes & Comptoir des Saveurs",
  description:
    "Espresso, lattes, iced lattes, chocolats chauds, frappés, mocktails sans alcool, milkshakes : les recettes de démonstration Maison Sillage, et le Comptoir des Saveurs pour composer sa boisson.",
  alternates: { canonical: "/recettes" },
};

export default async function Recettes({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const b = Array.isArray(sp.boisson) ? sp.boisson[0] : sp.boisson;
  const initial = b && b in drinkLabels ? (b as Recipe["drink"]) : undefined;
  return (
    <>
      <PageIntro
        kicker="Recettes"
        title="Une saveur, mille façons de la servir."
        aside={
          <RevealNow from="right" className="aspect-[4/5] max-h-[70vh]">
            <Photo photo={pages.recettes} sizes="(min-width:1024px) 40vw, 100vw" preload className="h-full w-full" />
          </RevealNow>
        }
      >
        Chaque création est pensée pour plusieurs boissons. Composez la vôtre au Comptoir des Saveurs, ou parcourez nos recettes, chaudes ou glacées, aux
        dosages indicatifs.
      </PageIntro>
      <Comptoir id="comptoir" tone="tint" recipeThumb={false} />
      <div className="pt-20 md:pt-28">
        <div className="shell mb-10">
          <p className="mention text-accent-ink">Toutes les recettes</p>
          <h2 className="titre mt-4">Par type de boisson.</h2>
        </div>
        <RecipeIndex initial={initial} />
      </div>
    </>
  );
}
