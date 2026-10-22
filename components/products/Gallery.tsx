"use client";

import { useReducedMotion } from "@/lib/useReduced";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Scene, type SceneConfig } from "@/components/visuals/Scene";
import { aspectClass } from "@/components/visuals/aspect";
import { cn } from "@/lib/utils";

/** Galerie produit : vues distinctes, vignettes accessibles, transition par masque */
export function Gallery({ views, name }: { views: { scene: SceneConfig; label: string }[]; name: string }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const v = views[i];
  return (
    <div>
      <div className={cn("relative overflow-hidden bg-lin", aspectClass["4:5"])} aria-live="polite">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 0% 100%)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          >
            <Scene config={v.scene} className="h-full w-full" priority={i === 0} />
          </motion.div>
        </AnimatePresence>
        <p className="absolute bottom-3 left-3 bg-creme/90 px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.16em] text-espresso">
          {v.label} · visuel de démonstration
        </p>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3" role="group" aria-label={`Vues de ${name}`}>
        {views.map((view, n) => (
          <button
            key={view.scene.key}
            type="button"
            onClick={() => setI(n)}
            aria-pressed={n === i}
            aria-label={`Voir : ${view.label}`}
            className={cn("relative aspect-square overflow-hidden bg-lin outline-offset-2 transition", n === i ? "ring-1 ring-espresso" : "opacity-70 hover:opacity-100")}
          >
            <Scene config={{ ...view.scene, key: `${view.scene.key}-vignette` }} className="h-full w-full" decorative />
          </button>
        ))}
      </div>
    </div>
  );
}
