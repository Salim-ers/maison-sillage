"use client";

import { useReducedMotion } from "@/lib/useReduced";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { recipes, drinkLabels } from "@/data/recipes";
import { getProduct } from "@/data/products";
import { recipePhoto } from "@/data/images";
import { Photo } from "@/components/ui/Photo";
import type { Recipe } from "@/lib/types";
import { cn } from "@/lib/utils";

type Drink = Recipe["drink"];

/** Index des recettes, par type de boisson (dans l'ordre du Comptoir des Saveurs) */
export function RecipeIndex({ initial }: { initial?: Drink }) {
  const [cat, setCat] = useState<Drink | "toutes">(initial ?? "toutes");
  const reduce = useReducedMotion();
  useEffect(() => {
    window.history.replaceState(null, "", cat === "toutes" ? window.location.pathname : `?boisson=${cat}`);
  }, [cat]);
  const list = useMemo(() => (cat === "toutes" ? recipes : recipes.filter((r) => r.drink === cat)), [cat]);
  const cats = (Object.entries(drinkLabels) as [Drink, string][]).filter(([id]) => recipes.some((r) => r.drink === id));

  return (
    <div className="shell pb-28">
      <div role="group" aria-label="Filtrer par type de boisson" className="flex flex-wrap gap-2 border-y border-line py-4">
        {[["toutes", "Toutes"] as const, ...cats].map(([id, label]) => {
          const n = id === "toutes" ? recipes.length : recipes.filter((r) => r.drink === id).length;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={cat === id}
              onClick={() => setCat(id)}
              className={cn("min-h-10 border px-3.5 py-2 text-sm transition duration-300", cat === id ? "border-inverse bg-inverse text-on-inverse" : "border-line hover:border-ink/60")}
            >
              {label} <span className="opacity-60">({n})</span>
            </button>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {list.length} recette{list.length > 1 ? "s" : ""} · dosages proposés à titre de démonstration
      </p>
      <motion.ul layout={!reduce} className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((r) => {
            const p = getProduct(r.products[0]);
            return (
              <motion.li
                key={r.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/recettes/${r.slug}`} className="group block">
                  <Photo
                    photo={recipePhoto(r)}
                    sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw"
                    className="aspect-[4/5]"
                    imgClassName="transition-transform duration-[1.3s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]"
                  />
                  <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent-ink">
                    {drinkLabels[r.drink]} · {r.temps}
                  </p>
                  <h3 className="mt-1 font-serif text-[1.75rem] leading-tight transition-colors group-hover:text-accent-ink">{r.title}</h3>
                  {p && <p className="mt-1 text-sm text-muted">Avec {p.name}</p>}
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
