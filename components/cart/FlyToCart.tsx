"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getProduct } from "@/data/products";
import { useReducedMotion } from "@/lib/useReduced";
import { FLY_EVENT, type FlyDetail } from "@/components/products/AddToCart";
import { ProductThumb } from "@/components/products/ProductArt";

type Flight = FlyDetail & { id: number; tx: number; ty: number };

/** Animation d'ajout : la vignette du produit décrit une courbe jusqu'à l'icône du panier, qui accuse réception. */
export function FlyToCart() {
  const reduce = useReducedMotion();
  const [flights, setFlights] = useState<Flight[]>([]);
  useEffect(() => {
    if (reduce) return;
    const onFly = (e: Event) => {
      const d = (e as CustomEvent<FlyDetail>).detail;
      const target = Array.from(document.querySelectorAll<HTMLElement>("[data-cart-target]")).find((el) => el.getClientRects().length > 0);
      if (!target) return;
      const r = target.getBoundingClientRect();
      const id = Date.now() + Math.random();
      setFlights((f) => [...f, { ...d, id, tx: r.left + r.width / 2, ty: r.top + r.height / 2 }]);
      window.setTimeout(() => {
        target.animate([{ transform: "scale(1)" }, { transform: "scale(1.28)" }, { transform: "scale(1)" }], { duration: 420, easing: "cubic-bezier(.22,1,.36,1)" });
      }, 760);
      window.setTimeout(() => setFlights((f) => f.filter((x) => x.id !== id)), 900);
    };
    window.addEventListener(FLY_EVENT, onFly);
    return () => window.removeEventListener(FLY_EVENT, onFly);
  }, [reduce]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[90]" aria-hidden>
      <AnimatePresence>
        {flights.map((f) => {
          const p = getProduct(f.slug);
          if (!p) return null;
          const lift = Math.min(160, Math.abs(f.x - f.tx) * 0.25 + 60);
          return (
            <motion.div
              key={f.id}
              className="absolute left-0 top-0 h-14 w-11 overflow-hidden rounded-sm shadow-[0_14px_30px_-10px_rgba(20,12,6,.55)]"
              initial={{ x: f.x - 22, y: f.y - 28, scale: 1, opacity: 0 }}
              animate={{
                x: [f.x - 22, (f.x + f.tx) / 2 - 22, f.tx - 22],
                y: [f.y - 28, Math.min(f.y, f.ty) - lift, f.ty - 28],
                scale: [1, 0.9, 0.32],
                opacity: [0, 1, 0.9],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.45, 0, 0.2, 1], times: [0, 0.45, 1] }}
            >
              <ProductThumb product={p} className="h-full w-full" sizes="44px" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
