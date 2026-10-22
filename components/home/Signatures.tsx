import Link from "next/link";
import { productsByCategory } from "@/data/products";
import { ProductCard } from "@/components/products/ProductCard";
import { RevealTitle, Rise, Stagger, StaggerItem } from "@/components/animations";

/* Section 7 — les signatures de la Maison : les quatre sirops, formats et prix du catalogue de démonstration */
export function Signatures() {
  const sirops = productsByCategory("sirop").filter((p) => p.status === "prototype");
  return (
    <section className="relative z-10 bg-paper py-24 md:py-32" aria-labelledby="signatures-titre">
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Rise>
              <p className="mention text-accent-ink">Nos signatures · sirops</p>
            </Rise>
            <RevealTitle id="signatures-titre" text="Les signatures de la Maison." className="titre mt-5" />
          </div>
          <Rise className="max-w-sm" delay={0.1}>
            <p className="text-ink-2">
              Quatre sirops, une même bouteille gravée. Prix indicatifs : le panier fonctionne en démonstration, sans aucune commande réelle.
            </p>
            <Link href="/boutique" className="mt-5 inline-block text-[0.78rem] font-semibold uppercase tracking-[0.18em]">
              <span className="lien">Toute la boutique</span>
            </Link>
          </Rise>
        </div>
        <Stagger className="no-scrollbar -mx-[var(--gutter)] mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-14 md:overflow-visible md:px-0 lg:grid-cols-4">
          {sirops.map((p) => (
            <StaggerItem key={p.slug} className="w-[70vw] shrink-0 snap-start sm:w-[44vw] md:w-auto">
              <ProductCard product={p} sizes="(min-width:1024px) 22vw, (min-width:768px) 45vw, 70vw" />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
