import Link from "next/link";
import type { Product } from "@/lib/types";
import { startingPrice } from "@/data/products";
import { categoryLabels } from "@/data/collections";
import { formatPrice, cn } from "@/lib/utils";
import { ProductThumb } from "./ProductArt";

/** Vignette compacte : photographie du produit, nom, gamme et prix */
export function ProductMini({ product, tone = "clair" }: { product: Product; tone?: "clair" | "sombre" }) {
  const price = startingPrice(product);
  const dark = tone === "sombre";
  return (
    <Link
      href={`/produits/${product.slug}`}
      className={cn("group flex items-center gap-5 p-3 pr-5 transition-colors duration-500", dark ? "bg-on-deep/[0.05] hover:bg-on-deep/[0.1]" : "bg-paper/70 hover:bg-paper")}
    >
      <ProductThumb product={product} className="h-24 w-16 shrink-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-0.5" sizes="64px" />
      <span className="min-w-0">
        <span className={cn("block text-[0.66rem] font-semibold uppercase tracking-[0.16em]", dark ? "text-gold" : "text-accent-ink")}>
          {product.status === "a-venir" ? "Édition à l'étude" : categoryLabels[product.category]}
        </span>
        <span className="mt-1 block font-serif text-[1.35rem] leading-tight">{product.name}</span>
        {product.status !== "a-venir" && (
          <span className={cn("mt-1 block text-sm", dark ? "text-on-deep-2" : "text-muted")}>
            {formatPrice(price.price)} {price.tax} · {price.contenance}
          </span>
        )}
      </span>
    </Link>
  );
}
