import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { Photo } from "@/components/ui/Photo";
import { RevealNow } from "@/components/ui/RevealNow";
import { pages } from "@/data/images";
import { ShopCatalog, type ShopInitial } from "@/components/products/ShopCatalog";
import { FORMATS, PRICES } from "@/lib/shop";
import { drinkTypes, seasons, shopTabs } from "@/data/collections";
import { saveurLabels } from "@/data/products";
import type { Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Les 32 références Maison Sillage : sirops et poudres signatures, Les Essentiels de la Maison, accessoires et coffret. Boutique de démonstration, prix indicatifs, aucune vente réelle.",
  alternates: { canonical: "/boutique" },
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
/** liste de l'URL, réduite aux valeurs connues */
const list = <T extends string>(v: string | string[] | undefined, allowed: readonly string[]) => (one(v) ?? "").split(",").filter((x): x is T => allowed.includes(x));

export default async function Boutique({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const cat = one(sp.categorie);
  const initial: ShopInitial = {
    categorie: shopTabs.some((t) => t.id === cat) ? (cat as Category | "tous") : "tous",
    saison: list(sp.saison, [...seasons.map((s) => s.id), "permanente"]),
    saveur: list(sp.saveur, Object.keys(saveurLabels)),
    boisson: list(sp.boisson, drinkTypes.map((d) => d.id)),
    format: list(sp.format, FORMATS),
    prix: list(sp.prix, PRICES.map((p) => p.id)),
    q: one(sp.q)?.slice(0, 80) ?? "",
  };
  return (
    <>
      <PageIntro
        kicker="La boutique"
        title="Toutes les références de la Maison."
        aside={
          <RevealNow from="right" className="aspect-[16/9]">
            <Photo photo={pages.boutique} sizes="(min-width:1024px) 40vw, 100vw" preload className="h-full w-full" />
          </RevealNow>
        }
      >
        Sirops et poudres signatures, Les Essentiels, accessoires et coffret : trente-deux références à filtrer par saison, saveur, boisson, format ou
        prix. Boutique de démonstration : prix indicatifs, aucune vente réelle.
      </PageIntro>
      <ShopCatalog initial={initial} />
    </>
  );
}
