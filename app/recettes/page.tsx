import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { RecipeIndex } from "@/components/editorial/RecipeIndex";
import { Figure } from "@/components/ui/Figure";
import { scenes } from "@/data/media";
import { recipeCategoryLabels } from "@/data/collections";
import type { RecipeCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "Recettes",
  description: "Lattes, iced lattes, chocolats, mocktails sans alcool, milkshakes, frappés et desserts : les recettes de démonstration Maison Sillage.",
  alternates: { canonical: "/recettes" },
};

export default async function Recettes({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const u = Array.isArray(sp.usage) ? sp.usage[0] : sp.usage;
  const initial = u && u in recipeCategoryLabels ? (u as RecipeCategory) : undefined;
  return (
    <>
      <PageIntro kicker="Recettes & usages" title="Une saveur, mille façons de la boire.">
        Chaque création de la Maison est pensée pour plusieurs boissons. Voici nos propositions : des recettes simples, chaudes ou glacées,
        dont les dosages sont indicatifs.
      </PageIntro>
      <div className="mb-14">
        <Figure scene={scenes.recettesPage} parallax reveal="bottom" sizes="100vw" priority />
      </div>
      <RecipeIndex initial={initial} />
    </>
  );
}
