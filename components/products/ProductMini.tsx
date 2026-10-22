import Link from "next/link";
import type { Product } from "@/lib/types";
import { startingPrice } from "@/data/products";
import { categoryLabels } from "@/data/collections";
import { formatPrice } from "@/lib/utils";
import { ProductArt } from "./ProductArt";

/** Vignette compacte : le conditionnement seul, sans mise en scène (évite tout doublon de visuel) */
export function ProductMini({ product, tone = "clair" }: { product: Product; tone?: "clair" | "sombre" }) {
  const price = startingPrice(product);
  const dark = tone === "sombre";
  return (
    <Link
      href={`/produits/${product.slug}`}
      className={`group flex items-center gap-5 p-4 transition-colors duration-500 ${dark ? "bg-creme/[0.06] hover:bg-creme/[0.12]" : "bg-creme/60 hover:bg-creme"}`}
    >
      <span className="grid h-28 w-20 shrink-0 place-items-center transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-1">
        <ProductArt product={product} className="h-full w-auto" />
      </span>
      <span className="min-w-0">
        <span className={`block text-[0.68rem] uppercase tracking-[0.16em] ${dark ? "text-or" : "text-bronze-ink"}`}>
          {product.status === "a-venir" ? "Édition à venir" : categoryLabels[product.category]}
        </span>
        <span className="mt-1 block font-serif text-[1.35rem] leading-tight">{product.name}</span>
        {product.status !== "a-venir" && (
          <span className={`mt-1 block text-sm ${dark ? "text-creme/65" : "text-espresso/70"}`}>
            {formatPrice(price.price)} {price.tax} · {price.contenance}
          </span>
        )}
      </span>
    </Link>
  );
}
