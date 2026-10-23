import Image from "next/image";
import type { Product } from "@/lib/types";
import { productCardPhotos } from "@/data/images";
import { cn } from "@/lib/utils";

/** Vignette photographique d'un produit (panier, recherche, confirmations) */
export function ProductThumb({ product, className, sizes = "96px" }: { product: Product; className?: string; sizes?: string }) {
  const { main } = productCardPhotos(product);
  return (
    <span className={cn("relative block overflow-hidden bg-tint", className)}>
      <Image src={main.src} alt="" fill sizes={sizes} quality={70} className="object-cover" style={{ objectPosition: main.position ?? "50% 55%" }} />
    </span>
  );
}
