import type { Product } from "@/lib/types";
import { BottleArt } from "@/components/visuals/Bottle";
import { PouchArt } from "@/components/visuals/Pouch";
import { CoffretArt } from "@/components/visuals/Props";

/** Le conditionnement d'un produit, seul (vignettes de panier, recherche) */
export function ProductArt({ product, className, format }: { product: Product; className?: string; format?: string }) {
  if (product.pack === "bouteille") return <BottleArt product={product} className={className} format={format} />;
  if (product.pack === "coffret")
    return (
      <svg viewBox="0 0 400 300" className={className} role="img" aria-label="Coffret Découverte">
        <CoffretArt height={300} />
      </svg>
    );
  return <PouchArt product={product} className={className} format={format} />;
}
