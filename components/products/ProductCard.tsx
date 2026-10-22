import Link from "next/link";
import type { Product } from "@/lib/types";
import { categoryLabels, getSeason } from "@/data/collections";
import { productScenes } from "@/data/media";
import { startingPrice } from "@/data/products";
import { formatPrice, cn } from "@/lib/utils";
import { Scene } from "@/components/visuals/Scene";
import { FavoriteButton } from "./FavoriteButton";
import { AddToCart } from "./AddToCart";

export function ProductCard({
  product,
  className,
  headingLevel = "h3",
  variant = "carte",
}: {
  product: Product;
  className?: string;
  headingLevel?: "h2" | "h3";
  variant?: "carte" | "gamme";
}) {
  const scene = productScenes(product)[variant];
  const price = startingPrice(product);
  const upcoming = product.status === "a-venir";
  const H = headingLevel;
  return (
    <article className={cn("group relative flex flex-col", className)}>
      <Link href={`/produits/${product.slug}`} className="relative block overflow-hidden bg-lin" aria-label={`${product.name} — voir la fiche`}>
        <div className="aspect-[4/5] transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.045]">
          <Scene config={scene} className="h-full w-full" decorative />
        </div>
        {/* informations au survol */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-encre/70 via-encre/35 to-transparent p-5 pt-16 text-creme opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:opacity-100">
          <p className="mention text-or">Notes</p>
          <p className="mt-1 font-serif text-lg italic leading-snug">{product.notes.join(" · ")}</p>
        </div>
        <span className="absolute left-3 top-3 bg-creme/90 px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-espresso">
          {upcoming ? "Édition à venir" : product.season ? getSeason(product.season).name : "Coffret"}
        </span>
      </Link>
      <FavoriteButton slug={product.slug} name={product.name} className="absolute right-3 top-3" />
      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[0.72rem] uppercase tracking-[0.16em] text-bronze-ink">{categoryLabels[product.category]}</p>
        <H className="mt-1.5 font-serif text-[1.55rem] leading-[1.08]">
          <Link href={`/produits/${product.slug}`} className="hover:text-espresso">
            {product.name}
          </Link>
        </H>
        <p className="mt-1.5 text-sm text-espresso/80">{product.tagline}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          {upcoming ? (
            <p className="text-sm italic text-espresso/75">Création à l&apos;étude, non disponible</p>
          ) : (
            <p className="text-sm">
              <span className="font-serif text-xl">{formatPrice(price.price)}</span> <span className="text-espresso/70">{price.tax} · {price.contenance}</span>
              <span className="block text-[0.7rem] text-espresso/60">Prix indicatif</span>
            </p>
          )}
          {!upcoming && <AddToCart slug={product.slug} formatId={price.id} label="Ajouter" variant="trait" className="min-h-10 px-4 py-2 text-[0.66rem]" />}
        </div>
      </div>
    </article>
  );
}
