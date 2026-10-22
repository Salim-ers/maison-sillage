import Image from "next/image";
import type { Product } from "@/lib/types";
import { productPhotos } from "@/data/images";
import { Emblem } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

/** Vignette photographique d'un produit (panier, recherche, confirmations) */
export function ProductThumb({ product, className, sizes = "96px" }: { product: Product; className?: string; sizes?: string }) {
  const { card } = productPhotos(product.slug, product.category, product.flavor);
  return (
    <span className={cn("relative block overflow-hidden bg-tint", className)}>
      {card ? (
        <Image src={card.src} alt="" fill sizes={sizes} quality={70} className="object-cover" style={{ objectPosition: card.position ?? "50% 40%" }} />
      ) : (
        <span className="grid h-full w-full place-items-center p-3 opacity-80">
          <Emblem sizes="40px" />
        </span>
      )}
    </span>
  );
}
