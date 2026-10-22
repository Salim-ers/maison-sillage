import Link from "next/link";
import type { Product } from "@/lib/types";
import { categoryLabels, getSeason } from "@/data/collections";
import { productPhotos } from "@/data/images";
import { startingPrice } from "@/data/products";
import { formatPrice, cn } from "@/lib/utils";
import { Photo } from "@/components/ui/Photo";
import { Emblem } from "@/components/ui/Logo";
import { FavoriteButton } from "./FavoriteButton";
import { AddToCart } from "./AddToCart";

/** Visuel d'un produit sans photographie (édition à l'étude) : typographique, jamais une illustration de substitution */
export function PendingVisual({ product, className }: { product: Product; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-5 bg-tint p-6 text-center", className)}>
      <div className="w-14 opacity-80">
        <span className="sauf-nuit block">
          <Emblem sizes="56px" />
        </span>
        <span className="si-nuit">
          <Emblem tone="sombre" sizes="56px" />
        </span>
      </div>
      <p className="font-serif text-2xl italic leading-tight text-ink-2">{product.name}</p>
      <p className="mention text-muted">Visuel à venir</p>
    </div>
  );
}

export function ProductCard({
  product,
  className,
  headingLevel = "h3",
  tone = "page",
  sizes = "(min-width:1280px) 22vw, (min-width:1024px) 30vw, (min-width:640px) 45vw, 80vw",
}: {
  product: Product;
  className?: string;
  headingLevel?: "h2" | "h3";
  tone?: "page" | "deep";
  sizes?: string;
}) {
  const { card } = productPhotos(product.slug, product.category, product.flavor);
  const price = startingPrice(product);
  const upcoming = product.status === "a-venir";
  const H = headingLevel;
  const deep = tone === "deep";
  const season = product.season ? getSeason(product.season) : null;
  return (
    <article className={cn("group relative flex flex-col", className)}>
      <Link href={`/produits/${product.slug}`} className="relative block aspect-[2/3] overflow-hidden" aria-label={`${product.name}, ${categoryLabels[product.category].toLowerCase()} — voir la fiche`}>
        {card ? (
          <Photo
            photo={card}
            sizes={sizes}
            className="h-full w-full"
            imgClassName="transition-[transform,filter] duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06] group-hover:brightness-[1.04]"
          />
        ) : (
          <PendingVisual product={product} className="h-full" />
        )}
        {/* notes aromatiques au survol */}
        {!upcoming && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-4 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-5 pt-20 text-creme opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <p className="mention text-or">Notes</p>
            <p className="mt-1 font-serif text-lg italic leading-snug">{product.notes.join(" · ")}</p>
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 bg-creme/92 px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-espresso backdrop-blur-sm">
          {season && <span className="h-1.5 w-1.5 rounded-full" style={{ background: season.accent }} aria-hidden />}
          {upcoming ? "Édition à l'étude" : season ? season.name : "Coffret"}
        </span>
      </Link>
      <FavoriteButton slug={product.slug} name={product.name} className="absolute right-3 top-3" />
      <div className="flex flex-1 flex-col pt-5">
        <p className={cn("text-[0.7rem] font-semibold uppercase tracking-[0.18em]", deep ? "text-gold" : "text-accent-ink")}>{categoryLabels[product.category]}</p>
        <H className="mt-2 font-serif text-[1.6rem] leading-[1.06]">
          <Link href={`/produits/${product.slug}`} className="transition-colors duration-300 hover:text-accent-ink">
            {product.name}
          </Link>
        </H>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          {upcoming ? (
            <p className={cn("text-sm italic", deep ? "text-on-deep-2" : "text-muted")}>Création à l&apos;étude, non disponible</p>
          ) : (
            <p className="text-sm leading-tight">
              <span className="font-serif text-[1.35rem]">{formatPrice(price.price)}</span>{" "}
              <span className={deep ? "text-on-deep-2" : "text-muted"}>
                {price.tax} · {price.contenance}
              </span>
              <span className={cn("mt-1 block text-[0.68rem]", deep ? "text-on-deep-2/80" : "text-muted/80")}>Prix indicatif</span>
            </p>
          )}
          {!upcoming && <AddToCart slug={product.slug} formatId={price.id} label="Ajouter" variant={deep ? "clair" : "trait"} className="min-h-10 shrink-0 px-4 py-2 text-[0.64rem]" />}
        </div>
      </div>
    </article>
  );
}
