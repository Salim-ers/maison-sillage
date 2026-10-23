"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { cartFormats, proFormats } from "@/data/products";
import { formatPrice, cn } from "@/lib/utils";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { AddToCart } from "./AddToCart";
import { FavoriteButton } from "./FavoriteButton";

/** Lien vers le formulaire professionnel, produit et format pré-remplis */
export const quoteHref = (slug: string, formatId?: string) => `/professionnels?produit=${slug}${formatId ? `&format=${formatId}` : ""}#demande`;

/** Choix du format grand public, quantité, ajout au panier de démonstration ; formats professionnels sur devis. */
export function ProductBuyBox({ product }: { product: Product }) {
  const retail = cartFormats(product);
  const pro = proFormats(product);
  const [formatId, setFormatId] = useState(retail[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [showBar, setShowBar] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);
  const format = retail.find((f) => f.id === formatId);

  useEffect(() => {
    const el = anchor.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="mt-10">
      {retail.length > 0 && format && (
        <>
          <fieldset>
            <legend className="mention mb-3 text-accent-ink">Format</legend>
            <div className={cn("grid gap-2.5", retail.length > 1 && "sm:grid-cols-2")}>
              {retail.map((f) => {
                const on = f.id === formatId;
                return (
                  <label
                    key={f.id}
                    className={cn("relative flex cursor-pointer flex-col border px-4 py-3.5 transition duration-300", on ? "border-ink bg-paper" : "border-line hover:border-ink/60")}
                  >
                    <input type="radio" name="format" value={f.id} checked={on} onChange={() => setFormatId(f.id)} className="sr-only" />
                    <span className="font-serif text-lg leading-tight">{f.label}</span>
                    <span className="mt-1 text-sm text-muted">
                      {formatPrice(f.price)} {f.tax}
                    </span>
                    {on && <motion.span layoutId={`format-${product.slug}`} className="absolute inset-y-0 left-0 w-[3px] bg-inverse" />}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-7 flex items-baseline gap-3">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={`${formatId}-${qty}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} className="font-serif text-4xl tabular-nums">
                {formatPrice(format.price * qty)}
              </motion.p>
            </AnimatePresence>
            <p className="text-sm text-muted">
              {format.tax} · prix indicatif{qty > 1 ? ` · ${qty} × ${formatPrice(format.price)}` : ""}
            </p>
          </div>

          <div ref={anchor} className="mt-6 flex flex-wrap gap-3">
            <QtyStepper value={qty} onChange={setQty} label={`Quantité de ${product.name}`} />
            <AddToCart slug={product.slug} formatId={formatId} qty={qty} className="flex-1" />
          </div>
        </>
      )}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <FavoriteButton slug={product.slug} name={product.name} withLabel />
        <p className="text-xs text-muted">Panier de démonstration : aucune commande n&apos;est transmise, aucun paiement n&apos;est possible.</p>
      </div>

      {pro.length > 0 && (
        <div className="mt-9 border-t border-line pt-7">
          <h2 className="mention text-accent-ink">Pour les établissements</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {pro.map((f) => (
              <li key={f.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4">
                <span>
                  <span className="block font-serif text-lg leading-tight">{f.label}</span>
                  <span className="mt-0.5 block text-sm text-muted">{f.price !== null ? `${formatPrice(f.price)} ${f.tax} · tarif indicatif` : "Tarif sur devis"}</span>
                </span>
                <Link href={quoteHref(product.slug, f.id)} className="group inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.16em]">
                  <span className="lien">Demander un devis</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.4} />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">Les conditions professionnelles (volumes, délais, livraison) restent à définir et se précisent sur demande.</p>
        </div>
      )}

      {/* barre d'achat mobile */}
      <AnimatePresence>
        {showBar && format && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-page/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden"
          >
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-lg leading-tight">{product.name}</p>
                <p className="text-xs text-muted">
                  {format.contenance} · {formatPrice(format.price)} {format.tax}
                </p>
              </div>
              <AddToCart slug={product.slug} formatId={formatId} qty={qty} label="Ajouter" className="min-h-12 px-5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
