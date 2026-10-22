import Link from "next/link";
import { getProduct, productsByCategory, startingPrice } from "@/data/products";
import { getSeason } from "@/data/collections";
import { productScenes, scenes } from "@/data/media";
import { formatPrice } from "@/lib/utils";
import { Figure } from "@/components/ui/Figure";
import { Scene } from "@/components/visuals/Scene";
import { RevealTitle, Rise, Stagger, StaggerItem } from "@/components/animations";
import { AddToCart } from "@/components/products/AddToCart";

/* Chapitre 6 — produits signatures, en clair-obscur */
export function Signatures() {
  const coffret = getProduct("coffret-decouverte")!;
  const sirops = productsByCategory("sirop").filter((p) => p.status === "prototype");
  const cp = startingPrice(coffret);
  return (
    <section className="bg-encre py-24 text-creme md:py-32" aria-labelledby="signatures-titre">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="mention text-or">Pour commencer le voyage</p>
            <RevealTitle id="signatures-titre" text="Le Coffret Découverte." className="titre mt-4" />
            <Rise>
              <p className="mt-6 max-w-md text-creme/80">{coffret.story[0]}</p>
              <p className="mt-6 text-sm text-creme/70">
                <span className="font-serif text-2xl text-creme">{formatPrice(cp.price)}</span> {cp.tax} · {cp.contenance} · prix indicatif
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <AddToCart slug={coffret.slug} formatId={cp.id} variant="clair" />
                <Link href={`/produits/${coffret.slug}`} className="btn btn-trait">
                  Voir le coffret
                </Link>
              </div>
            </Rise>
          </div>
          <div className="lg:col-span-7">
            <Figure scene={scenes.coffret} reveal="right" sizes="(min-width:1024px) 55vw, 100vw" />
          </div>
        </div>

        <div className="mt-24 flex items-end justify-between gap-6 border-t border-creme/15 pt-10">
          <h3 className="sous-titre">Les créations signatures</h3>
          <Link href="/boutique" className="lien shrink-0 text-sm text-creme/85">
            Toute la boutique
          </Link>
        </div>
        <Stagger className="no-scrollbar -mx-[var(--gutter)] mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-4 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
          {sirops.map((p) => {
            const price = startingPrice(p);
            return (
              <StaggerItem key={p.slug} className="w-[72vw] shrink-0 snap-start sm:w-[42vw] lg:w-auto">
                <article className="group">
                  <Link href={`/produits/${p.slug}`} className="block overflow-hidden" aria-label={p.name}>
                    <div className="aspect-[3/4] transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]">
                      <Scene config={productScenes(p).signature} className="h-full w-full" decorative />
                    </div>
                  </Link>
                  <p className="mt-4 text-[0.7rem] uppercase tracking-[0.18em] text-or">{getSeason(p.season!).name}</p>
                  <h4 className="mt-1 font-serif text-[1.45rem] leading-tight">
                    <Link href={`/produits/${p.slug}`} className="hover:text-or">
                      {p.name}
                    </Link>
                  </h4>
                  <p className="mt-1 text-sm text-creme/65">
                    {formatPrice(price.price)} {price.tax} · {price.contenance}
                  </p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
