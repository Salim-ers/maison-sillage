"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "@/lib/useReduced";
import { getProduct, productsByCategory, cartFormats, startingPrice } from "@/data/products";
import { home, photo } from "@/data/images";
import { Photo } from "@/components/ui/Photo";
import { AddToCart } from "@/components/products/AddToCart";
import { MaskReveal, Parallax, RevealTitle, Rise } from "@/components/animations";
import { formatPrice } from "@/lib/utils";

/* une sélection de la carte : les huit Essentiels sont dans leur rayon */
const SELECTION = ["chocolat-noir-intense", "vanille-bourbon", "caramel-beurre-sale", "chai-epice-classique"].map((s) => getProduct(s)!);
const TOTAL = productsByCategory("essentiel").length;

/* Section — Les Essentiels de la Maison : une ardoise de café, le sachet apparaît au survol de chaque ligne */
export function Essentiels() {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<string | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 30 });
  const sy = useSpring(y, { stiffness: 260, damping: 30 });
  const shown = SELECTION.find((p) => p.slug === hover);

  return (
    <section className="relative z-10 overflow-hidden bg-tint py-24 md:py-32" aria-labelledby="essentiels-titre">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Rise>
              <p className="mention text-accent-ink">Les Essentiels de la Maison</p>
            </Rise>
            <RevealTitle id="essentiels-titre" text="Les grands classiques, sans détour." className="titre mt-5 max-w-[14ch]" />
          </div>
          <Rise className="lg:col-span-5 lg:col-start-8" delay={0.1}>
            <p className="text-ink-2">
              À côté des signatures, {TOTAL} poudres classiques pour les boissons de tous les jours, dans un sachet kraft qui les distingue au premier regard.
              Dès {formatPrice(Math.min(...productsByCategory("essentiel").map((p) => startingPrice(p).price ?? Infinity)))} le sachet de 200 g.
            </p>
          </Rise>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <MaskReveal from="left" className="aspect-[16/10]">
              <Parallax amount={40} bleed>
                <Photo photo={home.essentiels} sizes="(min-width:1024px) 56vw, 100vw" className="h-full w-full" night={false} />
              </Parallax>
            </MaskReveal>
          </div>

          {/* l'ardoise */}
          <div
            ref={box}
            className="relative lg:col-span-5"
            onPointerMove={(e) => {
              const r = box.current?.getBoundingClientRect();
              if (!r) return;
              x.set(e.clientX - r.left);
              y.set(e.clientY - r.top);
            }}
            onPointerLeave={() => setHover(null)}
          >
            <p className="mention text-muted">La carte · sachet 200 g · prix indicatifs</p>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {SELECTION.map((p, i) => {
                const f = cartFormats(p)[0];
                return (
                  <Rise as="li" key={p.slug} delay={0.05 * i}>
                    <div className="group flex items-center gap-4 py-5" onPointerEnter={() => setHover(p.slug)} onFocusCapture={() => setHover(p.slug)}>
                      <Photo photo={photo(p.images[0])} sizes="56px" className="h-[70px] w-14 shrink-0 lg:hidden" night={false} />
                      <Link href={`/produits/${p.slug}`} className="min-w-0 flex-1">
                        <span className="flex items-baseline gap-3">
                          <span className="font-serif text-[1.45rem] leading-tight transition-colors group-hover:text-accent-ink">{p.name}</span>
                          <span className="hidden flex-1 border-b border-dotted border-ink/25 sm:block" aria-hidden />
                          <span className="font-serif text-lg tabular-nums">{f ? formatPrice(f.price) : "—"}</span>
                        </span>
                        <span className="mt-1 block text-sm text-muted">{p.notes.join(" · ")}</span>
                      </Link>
                      {f && <AddToCart slug={p.slug} formatId={f.id} label="Ajouter" variant="trait" className="hidden min-h-10 shrink-0 px-4 py-2 text-[0.62rem] sm:inline-flex" />}
                    </div>
                  </Rise>
                );
              })}
            </ul>
            <Link href="/essentiels" className="mt-8 inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.18em]">
              <span className="lien">Les {TOTAL} Essentiels</span>
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.4} />
            </Link>

            {/* le sachet suit le pointeur (bureau) */}
            {!reduce && (
              <motion.div className="pointer-events-none absolute left-0 top-0 z-10 hidden w-44 lg:block" style={{ x: sx, y: sy, translateX: "-115%", translateY: "-50%" }} aria-hidden>
                <AnimatePresence mode="popLayout">
                  {shown && (
                    <motion.div
                      key={shown.slug}
                      initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
                      animate={{ opacity: 1, scale: 1, rotate: -2 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden shadow-[0_30px_60px_-24px_rgba(20,12,6,.55)]"
                    >
                      <Photo photo={photo(shown.images[0])} sizes="176px" className="aspect-[4/5]" night={false} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
