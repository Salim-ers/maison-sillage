import Link from "next/link";
import type { Product } from "@/lib/types";
import { categoryLabels, getSeason } from "@/data/collections";
import { productCardPhotos } from "@/data/images";
import { cartFormats, startingPrice } from "@/data/products";
import { formatPrice, cn } from "@/lib/utils";
import { Photo } from "@/components/ui/Photo";
import { FavoriteButton } from "./FavoriteButton";
import { AddToCart } from "./AddToCart";
import { OnFirstHover } from "./OnFirstHover";

/** Pastille de la carte : la saison pour Les Quatre Saisons, sinon la gamme */
export function productBadge(p: Product): { label: string; dot?: string } {
  if (p.season) {
    const s = getSeason(p.season);
    return { label: s.name, dot: s.accent };
  }
  return { label: { sirop: "Signature", poudre: "Signature", essentiel: "Essentiel", accessoire: "L'Atelier", coffret: "Coffret" }[p.category] };
}

export function ProductCard({
  product,
  className,
  headingLevel = "h3",
  tone = "page",
  sizes = "(min-width:1280px) 22vw, (min-width:1024px) 30vw, (min-width:640px) 45vw, 80vw",
  preload = false,
}: {
  product: Product;
  className?: string;
  headingLevel?: "h2" | "h3";
  tone?: "page" | "deep";
  sizes?: string;
  preload?: boolean;
}) {
  const { main, hover } = productCardPhotos(product);
  const price = startingPrice(product);
  const buy = cartFormats(product)[0];
  const H = headingLevel;
  const deep = tone === "deep";
  const badge = productBadge(product);
  // packshot (flacon, sachet) : cadré plus serré dans la carte, le contenant occupe la vignette ; les visuels d'objets restent entiers
  const pack = product.images[0].startsWith("pack-");
  return (
    <article className={cn("group relative flex flex-col", className)}>
      <Link href={`/produits/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-tint" aria-label={`${product.name}, ${categoryLabels[product.category].toLowerCase()} — voir la fiche`}>
        <Photo
          photo={main}
          sizes={sizes}
          preload={preload}
          className="absolute inset-0"
          imgClassName={cn(
            "transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)]",
            pack ? "origin-[50%_55%] scale-[1.24] group-hover:scale-[1.29]" : "group-hover:scale-[1.04]",
          )}
          night={false}
        />
        {/* au survol : la matière ou la boisson, en fondu et léger zoom arrière */}
        {hover && (
          <OnFirstHover>
            <Photo
              photo={hover}
              sizes={sizes}
              className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:hidden"
              imgClassName="scale-[1.08] transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-100"
            />
          </OnFirstHover>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-5 pt-16 text-creme opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 [@media(hover:none)]:hidden">
          <p className="mention text-or">Notes</p>
          <p className="mt-1 font-serif text-lg italic leading-snug">{product.notes.join(" · ")}</p>
        </div>
        <span className="absolute left-2 top-2 inline-flex items-center gap-1.5 bg-creme px-2 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-espresso sm:left-3 sm:top-3 sm:px-2.5 sm:text-[0.64rem] sm:tracking-[0.18em]">
          {badge.dot && <span className="h-1.5 w-1.5 rounded-full" style={{ background: badge.dot }} aria-hidden />}
          {badge.label}
        </span>
      </Link>
      <FavoriteButton slug={product.slug} name={product.name} className="absolute right-2 top-2 sm:right-3 sm:top-3" />
      <div className="flex flex-1 flex-col pt-4 sm:pt-5">
        <p className={cn("text-[0.6rem] font-semibold uppercase tracking-[0.16em] sm:text-[0.7rem] sm:tracking-[0.18em]", deep ? "text-gold" : "text-accent-ink")}>{categoryLabels[product.category]}</p>
        <H className="mt-1.5 font-serif text-[1.12rem] leading-[1.1] sm:mt-2 sm:text-[1.3rem] lg:text-[1.5rem] lg:leading-[1.08]">
          <Link href={`/produits/${product.slug}`} className="transition-colors duration-300 hover:text-accent-ink">
            {product.name}
          </Link>
        </H>
        <div className="mt-auto flex flex-col gap-3 pt-4 sm:pt-5 lg:flex-row lg:items-end lg:justify-between">
          <p className="text-sm leading-tight">
            {price.price !== null ? (
              <>
                <span className="font-serif text-[1.15rem] sm:text-[1.3rem]">{formatPrice(price.price)}</span>{" "}
                <span className={deep ? "text-on-deep-2" : "text-muted"}>
                  {price.tax} · {price.contenance}
                </span>
              </>
            ) : (
              <span className="font-serif text-[1.2rem]">Sur devis</span>
            )}
            <span className={cn("mt-1 hidden text-[0.68rem] lg:block", deep ? "text-on-deep-2/80" : "text-muted/80")}>Prix indicatif · démonstration</span>
          </p>
          {buy && <AddToCart slug={product.slug} formatId={buy.id} label="Ajouter" variant={deep ? "clair" : "trait"} className="min-h-10 w-full shrink-0 px-4 py-2 text-[0.62rem] sm:text-[0.64rem] lg:w-auto" />}
        </div>
      </div>
    </article>
  );
}
