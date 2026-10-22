import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { RecipeIndex } from "@/components/editorial/RecipeIndex";
import { Photo } from "@/components/ui/Photo";
import { RevealNow } from "@/components/ui/RevealNow";
import { pages } from "@/data/images";
import { recipeCategoryLabels } from "@/data/collections";
import type { RecipeCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "Recettes",
  description: "Lattes, iced lattes, cafés, mocktails sans alcool, chocolats chauds, milkshakes et desserts : les recettes de démonstration Maison Sillage.",
  alternates: { canonical: "/recettes" },
};

export default async function Recettes({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const u = Array.isArray(sp.usage) ? sp.usage[0] : sp.usage;
  const initial = u && u in recipeCategoryLabels ? (u as RecipeCategory) : undefined;
  return (
    <>
      <PageIntro kicker="Recettes & usages" title="Une saveur, mille façons de la déguster.">
        Chaque création de la Maison est pensée pour plusieurs boissons. Voici nos propositions : des recettes simples, chaudes ou glacées, dont les
        dosages sont indicatifs.
      </PageIntro>
      <div className="shell mb-14">
        <RevealNow from="bottom" className="aspect-[16/9] md:aspect-[21/9]" delay={0.3}>
          <Photo photo={pages.recettes} sizes="100vw" preload className="h-full w-full" />
        </RevealNow>
      </div>
      <RecipeIndex initial={initial} />
    </>
  );
}
