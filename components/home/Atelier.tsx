import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProduct, startingPrice } from "@/data/products";
import { photo } from "@/data/images";
import { Photo } from "@/components/ui/Photo";
import { FavoriteButton } from "@/components/products/FavoriteButton";
import { MaskReveal, Parallax, RevealTitle, Rise } from "@/components/animations";
import { cn, formatPrice } from "@/lib/utils";

const COFFRET = getProduct("coffret-decouverte")!;
/* trois objets du comptoir, de tailles et de hauteurs différentes */
const OBJETS = [
  { slug: "mug-ceramique", className: "md:col-span-4 md:mt-24", aspect: "aspect-[4/5]" },
  { slug: "verre-latte-glace", className: "md:col-span-3 md:mt-0", aspect: "aspect-[3/4]" },
  { slug: "carnet-recettes", className: "md:col-span-4 md:col-start-9 md:-mt-10", aspect: "aspect-[4/5]" },
].map((o) => ({ ...o, product: getProduct(o.slug)! }));

function Price({ slug }: { slug: string }) {
  const f = startingPrice(getProduct(slug)!);
  return <>{f.price !== null ? `${formatPrice(f.price)} ${f.tax}` : "Sur demande"}</>;
}

/* Section — L'Atelier : le coffret en grand, puis les objets en mosaïque libre (fond sombre) */
export function Atelier() {
  return (
    <section className="relative z-10 overflow-hidden bg-deep-2 py-24 text-on-deep md:py-32" aria-labelledby="atelier-titre">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <Rise>
              <p className="mention text-gold">L&apos;Atelier &amp; les accessoires</p>
            </Rise>
            <RevealTitle id="atelier-titre" text="Les objets du comptoir." className="titre mt-5" />
            <Rise delay={0.1}>
              <p className="mt-7 max-w-md text-[1.05rem] leading-relaxed text-on-deep-2">
                Une tasse en grès pour un café court, un verre haut pour les boissons en couches, un carnet pour noter ses recettes, et un coffret pour goûter
                la gamme. Des objets en sélection : les visuels montrent l&apos;intention, le logo de la Maison appliqué sur l&apos;objet.
              </p>
            </Rise>
            <Rise delay={0.18}>
              <div className="mt-9 border-t border-on-deep/15 pt-6">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold">Coffret découverte</p>
                <p className="mt-2 font-serif text-[1.6rem] leading-tight">{COFFRET.tagline}</p>
                <p className="mt-2 text-sm text-on-deep-2">
                  Deux assortiments · dès <Price slug={COFFRET.slug} /> · prix indicatif
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/produits/${COFFRET.slug}`} className="btn btn-clair">
                    Le coffret
                  </Link>
                  <Link href="/atelier" className="btn btn-verre">
                    Tout l&apos;Atelier
                  </Link>
                </div>
              </div>
            </Rise>
          </div>
          <div className="relative lg:col-span-6 lg:col-start-7">
            <MaskReveal from="right" className="aspect-[4/5]">
              <Parallax amount={50} bleed>
                <Photo photo={photo(COFFRET.images[0])} sizes="(min-width:1024px) 46vw, 100vw" className="h-full w-full" night={false} />
              </Parallax>
            </MaskReveal>
            <FavoriteButton slug={COFFRET.slug} name={COFFRET.name} className="absolute right-4 top-4" />
          </div>
        </div>

        <ul className="mt-24 grid gap-12 md:grid-cols-12 md:gap-x-8">
          {OBJETS.map((o, i) => (
            <li key={o.slug} className={cn("group", o.className)}>
              <Link href={`/produits/${o.slug}`} className="block">
                <MaskReveal from={i === 1 ? "top" : "bottom"} delay={i * 0.06} className={o.aspect}>
                  <Photo
                    photo={photo(o.product.images[0])}
                    sizes="(min-width:768px) 30vw, 100vw"
                    className="h-full w-full"
                    imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]"
                    night={false}
                  />
                </MaskReveal>
                <span className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="font-serif text-[1.35rem] leading-tight transition-colors group-hover:text-gold">{o.product.name}</span>
                  <span className="shrink-0 text-sm text-on-deep-2">
                    <Price slug={o.slug} />
                  </span>
                </span>
                <span className="mt-1 flex items-center gap-1.5 text-xs text-on-deep-2/80">
                  Objet en sélection
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.4} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
