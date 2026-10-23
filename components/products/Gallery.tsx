"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReduced";
import type { Photo as PhotoData } from "@/data/images";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/utils";
import { HOULE, EASE } from "@/components/animations";

/** Galerie produit : vues photographiques, vignettes accessibles, transition par volet */
export function Gallery({ views, name }: { views: { photo: PhotoData; label: string }[]; name: string }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const v = views[i];
  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-tint" aria-live="polite">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 0% 100%)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.95, ease: HOULE }}
          >
            <motion.div className="h-full w-full" initial={reduce ? false : { scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: EASE }}>
              <Photo photo={v.photo} sizes="(min-width:1024px) 55vw, 100vw" preload={i === 0} className="h-full w-full" quality={85} night={i !== 0} />
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <p className="absolute bottom-3 left-3 bg-creme/90 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-espresso">
          {v.label}
        </p>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3" role="group" aria-label={`Vues de ${name}`}>
        {views.map((view, n) => (
          <button
            key={view.photo.src}
            type="button"
            onClick={() => setI(n)}
            aria-pressed={n === i}
            aria-label={`Voir : ${view.label}`}
            className={cn("relative aspect-square overflow-hidden bg-tint outline-offset-2 transition duration-500", n === i ? "ring-1 ring-ink" : "opacity-60 hover:opacity-100")}
          >
            <Image src={view.photo.src} alt="" fill sizes="(min-width:1024px) 12vw, 22vw" quality={70} className="object-cover" style={{ objectPosition: view.photo.position ?? "50% 50%" }} />
          </button>
        ))}
      </div>
    </div>
  );
}
