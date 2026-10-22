"use client";

import { useReducedMotion } from "@/lib/useReduced";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { seasons } from "@/data/collections";
import { productsBySeason } from "@/data/products";
import { recipes } from "@/data/recipes";
import { seasonHome } from "@/data/media";
import { Scene } from "@/components/visuals/Scene";
import { RevealTitle, EASE, HOULE } from "@/components/animations";
import type { SeasonId } from "@/lib/types";

/* Chapitre 5 — les quatre saisons : l'ambiance chromatique bascule avec la saison choisie */
export function Saisons({ initial = "automne" }: { initial?: SeasonId }) {
  const [active, setActive] = useState<SeasonId>(initial);
  const reduce = useReducedMotion();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const s = seasons.find((x) => x.id === active)!;
  const items = productsBySeason(active);
  const recipe = recipes.find((r) => r.products.some((slug) => items.some((p) => p.slug === slug)));

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (i + dir + seasons.length) % seasons.length;
    setActive(seasons[n].id);
    tabs.current[n]?.focus();
  };

  return (
    <motion.section
      className="relative overflow-hidden py-24 md:py-32"
      animate={{ backgroundColor: s.bg, color: s.ink }}
      transition={{ duration: reduce ? 0 : 1.1, ease: HOULE }}
      aria-labelledby="saisons-titre"
    >
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mention opacity-80">Les collections saisonnières</p>
            <RevealTitle id="saisons-titre" text="Un voyage en quatre chapitres." className="titre mt-4" />
          </div>
          <div role="tablist" aria-label="Choisir une saison" className="no-scrollbar -mx-[var(--gutter)] flex overflow-x-auto px-[var(--gutter)] md:mx-0 md:px-0">
            {seasons.map((x, i) => {
              const on = x.id === active;
              return (
                <button
                  key={x.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`onglet-${x.id}`}
                  aria-selected={on}
                  aria-controls={`panneau-saison`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(x.id)}
                  onKeyDown={(e) => onKey(e, i)}
                  className="relative shrink-0 px-4 pb-3 pt-2 text-left md:px-5"
                >
                  <span className="block font-serif text-sm italic opacity-70">{x.numeral}</span>
                  <span className={`block font-serif text-2xl transition-opacity ${on ? "opacity-100" : "opacity-55 hover:opacity-85"}`}>{x.name}</span>
                  {on && <motion.span layoutId="saison-trait" className="absolute inset-x-4 bottom-0 h-px bg-current md:inset-x-5" transition={{ duration: 0.6, ease: EASE }} />}
                </button>
              );
            })}
          </div>
        </div>

        <div id="panneau-saison" role="tabpanel" aria-labelledby={`onglet-${active}`} className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-12">
          <div className="relative lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
              <AnimatePresence initial={false} mode="sync">
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 0% 100%)" }}
                  animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 1, ease: HOULE }}
                >
                  <motion.div className="h-full w-full" initial={reduce ? false : { scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: EASE }}>
                    <Scene config={seasonHome[active]} className="h-full w-full" />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-5 lg:pt-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <p className="font-serif text-lg italic opacity-80">
                  Chapitre {s.numeral} · {s.chapter}
                </p>
                <h3 className="sous-titre mt-3">{s.name}</h3>
                <p className="mt-5 max-w-md leading-relaxed opacity-90">{s.intro}</p>
                <blockquote className="mt-8 border-l pl-5 font-serif text-xl italic leading-snug" style={{ borderColor: s.accent }}>
                  « {s.carnet} »
                  <footer className="mt-2 font-sans text-xs not-italic opacity-70">Carnet de bord imaginaire de la Maison</footer>
                </blockquote>

                <ul className="mt-10 space-y-3">
                  {items.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/produits/${p.slug}`} className="group flex items-center justify-between gap-4 border-b border-current/20 pb-3">
                        <span>
                          <span className="block text-[0.7rem] uppercase tracking-[0.16em] opacity-70">{p.category === "sirop" ? "Sirop" : "Poudre"}</span>
                          <span className="font-serif text-[1.45rem] leading-tight">{p.name}</span>
                        </span>
                        <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                          ⟶
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {recipe && (
                  <p className="mt-8 text-sm">
                    Recette de saison :{" "}
                    <Link href={`/recettes/${recipe.slug}`} className="lien font-semibold">
                      {recipe.title}
                    </Link>
                  </p>
                )}
                <Link href={`/collections#${s.id}`} className="btn btn-trait mt-10">
                  Lire le chapitre {s.name.toLowerCase()}
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
