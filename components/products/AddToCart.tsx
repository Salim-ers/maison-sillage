"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Événement capté par <FlyToCart> : une vignette du produit file du bouton vers le panier */
export const FLY_EVENT = "maison-sillage:vers-panier";
export type FlyDetail = { x: number; y: number; slug: string };

/** Bouton d'ajout avec retour visuel : le libellé glisse vers « Ajouté » et le produit rejoint le panier. */
export function AddToCart({
  slug,
  formatId,
  qty = 1,
  className,
  label = "Ajouter au panier",
  variant = "encre",
  disabled = false,
}: {
  slug: string;
  formatId: string;
  qty?: number;
  className?: string;
  label?: string;
  variant?: "encre" | "trait" | "clair";
  disabled?: boolean;
}) {
  const { add } = useStore();
  const [done, setDone] = useState(0);
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add(slug, formatId, qty);
        const r = ref.current?.getBoundingClientRect();
        if (r) window.dispatchEvent(new CustomEvent<FlyDetail>(FLY_EVENT, { detail: { x: r.left + r.width / 2, y: r.top + r.height / 2, slug } }));
        setDone(Date.now());
        window.setTimeout(() => setDone(0), 1800);
      }}
      className={cn("btn", `btn-${variant}`, className)}
    >
      <span className="relative block h-[1.2em] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          {done ? (
            <motion.span key="ok" className="flex items-center gap-2" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <Check className="h-3.5 w-3.5" strokeWidth={2} /> Ajouté
            </motion.span>
          ) : (
            <motion.span key="add" className="block" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}
