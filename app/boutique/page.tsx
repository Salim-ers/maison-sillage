import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { Photo } from "@/components/ui/Photo";
import { RevealNow } from "@/components/ui/RevealNow";
import { pages } from "@/data/images";
import { ShopCatalog, type ShopInitial } from "@/components/products/ShopCatalog";
import { profileLabels } from "@/data/collections";
import type { Profile } from "@/lib/types";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Toutes les créations Maison Sillage : quatre sirops signatures, leurs préparations en poudre et le Coffret Découverte. Boutique de démonstration, prix indicatifs.",
  alternates: { canonical: "/boutique" },
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function Boutique({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const cat = one(sp.categorie);
  const saison = one(sp.saison);
  const initial: ShopInitial = {
    categorie: cat === "sirop" || cat === "poudre" || cat === "coffret" ? cat : "tous",
    saison: saison === "printemps" || saison === "ete" || saison === "automne" || saison === "hiver" ? saison : "toutes",
    q: one(sp.q)?.slice(0, 80) ?? "",
    profils: (one(sp.profils) ?? "").split(",").filter((p): p is Profile => p in profileLabels),
  };
  return (
    <>
      <PageIntro
        kicker="La boutique"
        title="Toutes les créations de la Maison."
        aside={
          <RevealNow from="right" className="aspect-[4/3]">
            <Photo photo={pages.boutique} sizes="(min-width:1024px) 40vw, 100vw" preload className="h-full w-full" />
          </RevealNow>
        }
      >
        Sirops signatures, préparations en poudre et coffret : filtrez par saison ou par profil gustatif. Boutique de démonstration, prix
        indicatifs, aucune vente réelle.
      </PageIntro>
      <ShopCatalog initial={initial} />
    </>
  );
}
