"use client";

import Link from "next/link";
import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useAmbiance, useAmbianceAssets } from "@/lib/ambiance";
import { useReducedMotion } from "@/lib/useReduced";
import { seasons } from "@/data/collections";
import { photo, seasonImages } from "@/data/images";
import { poudreOfSeason, siropOfSeason, startingPrice } from "@/data/products";
import { Photo } from "@/components/ui/Photo";
import { SeasonIcon } from "@/components/ambiance/icons";
import { SeasonDrift } from "@/components/ambiance/Atmosphere";
import { EASE, HOULE, RevealTitle, Rise } from "@/components/animations";
import { cn, formatPrice } from "@/lib/utils";
import type { SeasonId } from "@/lib/types";

const BG_SIZES = "(min-width:768px) 100vw, 100vw";
/* voile coloré propre à chaque saison, posé côté texte */
const VEIL: Record<SeasonId, string> = {
  printemps: "linear-gradient(90deg, rgb(46 20 28 / .9) 0%, rgb(52 24 32 / .78) 32%, rgb(60 28 36 / .35) 52%, transparent 70%)",
  ete: "linear-gradient(90deg, rgb(40 22 10 / .9) 0%, rgb(46 26 12 / .78) 32%, rgb(52 30 16 / .35) 52%, transparent 70%)",
  automne: "linear-gradient(90deg, rgb(36 18 6 / .92) 0%, rgb(42 22 8 / .8) 32%, rgb(48 26 10 / .38) 54%, transparent 72%)",
  hiver: "linear-gradient(90deg, rgb(12 18 30 / .92) 0%, rgb(16 22 36 / .8) 32%, rgb(20 26 40 / .38) 54%, transparent 72%)",
};
const ACCENT_ON_PHOTO: Record<SeasonId, string> = { printemps: "#f2b8c1", ete: "#f6c091", automne: "#eeb26a", hiver: "#bcd3ea" };

/**
 * Section 4 — les quatre saisons. Le sélecteur pilote l'ambiance du
 * site entier (en fondu doux) : la photographie de fond change, la
 * couleur de l'interface évolue, la création et le récit se
 * transforment. Sur mobile, on passe d'une saison à l'autre d'un geste.
 */
export function Saisons() {
  const amb = useAmbiance();
  const reduce = useReducedMotion();
  const target = (amb.pending ?? amb).season;
  const shown = amb.season;
  const s = seasons.find((x) => x.id === target)!;
  const product = siropOfSeason(s.id);
  const poudre = poudreOfSeason(s.id);
  const price = startingPrice(product);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  useAmbianceAssets((a) => [{ photo: seasonImages[a.season].paysage, sizes: BG_SIZES }]);

  const choose = (id: SeasonId) => {
    if (id !== target) amb.setAmbiance({ season: id }, { mode: "doux" });
  };
  const step = (dir: number) => {
    const i = seasons.findIndex((x) => x.id === target);
    choose(seasons[(i + dir + seasons.length) % seasons.length].id);
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (i + dir + seasons.length) % seasons.length;
    choose(seasons[n].id);
    tabs.current[n]?.focus();
  };

  return (
    <section
      className="relative z-10 isolate overflow-hidden bg-deep text-creme md:min-h-[100svh]"
      aria-labelledby="saisons-titre"
      onPointerDown={(e) => {
        if (e.pointerType === "touch") swipe.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        const st = swipe.current;
        swipe.current = null;
        if (!st) return;
        const dx = e.clientX - st.x;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(e.clientY - st.y) * 1.5) step(dx < 0 ? 1 : -1);
      }}
      style={{ touchAction: "pan-y" }}
    >
      {/* photographie de la saison : dévoilement en volet et léger recul */}
      <div className="relative aspect-[4/3] md:absolute md:inset-0 md:aspect-auto">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={shown}
            className="absolute inset-0"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 0% 100%)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ opacity: 1, transition: { duration: 1.1 } }}
            transition={{ duration: 1.1, ease: HOULE }}
          >
            <motion.div className="h-full w-full" initial={reduce ? false : { scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease: EASE }}>
              <Photo photo={seasonImages[shown].paysage} sizes={BG_SIZES} className="h-full w-full" position="60% 50%" />
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 hidden transition-[background] duration-1000 md:block" style={{ background: VEIL[shown] }} aria-hidden />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-deep to-transparent md:h-1/3 md:from-black/45" aria-hidden />
        {!reduce && <SeasonDrift key={shown} season={shown} count={10} />}
      </div>

      <div className="shell relative z-10 -mt-24 pb-20 md:mt-0 md:flex md:min-h-[100svh] md:flex-col md:justify-center md:py-28">
        <div className="max-w-[40rem]">
          <Rise>
            <p className="mention text-creme/80">Collection Les Quatre Saisons</p>
          </Rise>
          <RevealTitle id="saisons-titre" text="Quatre saisons. Une infinité d'émotions." className="titre mt-4 max-w-[13ch] text-creme" />

          <div role="tablist" aria-label="Choisir une saison" className="no-scrollbar -mx-[var(--gutter)] mt-10 flex overflow-x-auto px-[var(--gutter)] md:mx-0 md:px-0">
            {seasons.map((x, i) => {
              const on = x.id === target;
              return (
                <button
                  key={x.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`saison-onglet-${x.id}`}
                  aria-selected={on}
                  aria-controls="saison-panneau"
                  tabIndex={on ? 0 : -1}
                  onClick={() => choose(x.id)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={cn("group relative shrink-0 px-4 pb-3.5 pt-2 text-left transition-opacity duration-500 first:pl-0 md:px-5 md:first:pl-0", on ? "opacity-100" : "opacity-55 hover:opacity-90")}
                >
                  <span className="flex items-center gap-2.5 font-serif text-[1.65rem] leading-none md:text-[1.9rem]">
                    <SeasonIcon season={x.id} className="h-[18px] w-[18px] shrink-0 opacity-80" />
                    {x.name}
                  </span>
                  {on && (
                    <motion.span
                      layoutId="saison-trait"
                      className="absolute bottom-0 left-4 right-4 h-[2px] group-first:left-0 md:left-5 md:right-5 md:group-first:left-0"
                      style={{ background: ACCENT_ON_PHOTO[x.id] }}
                      transition={{ duration: 0.7, ease: EASE }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <div className="h-px bg-creme/20" aria-hidden />

          <div id="saison-panneau" role="tabpanel" aria-labelledby={`saison-onglet-${target}`} className="min-h-[24rem] pt-9" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={target} initial={reduce ? { opacity: 0 } : "out"} animate="in" exit={reduce ? { opacity: 0 } : "exit"} variants={{ out: {}, in: { transition: { staggerChildren: 0.07 } }, exit: { opacity: 0, y: -10, transition: { duration: 0.3 } } }}>
                {[
                  <p key="ch" className="font-serif text-lg italic text-creme/80">
                    {s.chapter}
                  </p>,
                  <h3 key="t" className="mt-3 font-serif text-[clamp(2rem,3.4vw,3.2rem)] font-light leading-[1.02]" style={{ color: ACCENT_ON_PHOTO[s.id] }}>
                    {product.name}
                  </h3>,
                  <p key="i" className="mt-5 max-w-lg leading-relaxed text-creme/88">
                    {s.intro}
                  </p>,
                  <ul key="m" className="mt-6 flex flex-wrap gap-2" aria-label="Ambiance">
                    {s.mood.map((m) => (
                      <li key={m} className="rounded-full border border-creme/25 bg-black/10 px-3 py-1 text-[0.8rem] backdrop-blur-sm">
                        {m}
                      </li>
                    ))}
                  </ul>,
                  <p key="p" className="mt-7 text-sm text-creme/75">
                    Sirop dès {price.price !== null ? `${formatPrice(price.price)} ${price.tax}` : "—"} · poudre 200 g · prix indicatifs
                  </p>,
                  <div key="c" className="mt-6 flex flex-wrap gap-3">
                    <Link href={`/produits/${product.slug}`} className="btn btn-clair">
                      Le sirop
                    </Link>
                    <Link href={`/produits/${poudre.slug}`} className="btn btn-verre">
                      La poudre
                    </Link>
                  </div>,
                ].map((node, k) => (
                  <motion.div key={k} variants={{ out: { opacity: 0, y: 18 }, in: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}>
                    {node}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* matière de saison, en vignette flottante */}
        <div className="pointer-events-none absolute bottom-[12svh] right-[var(--gutter)] hidden w-[17rem] lg:block xl:w-[19rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={shown}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, rotate: 4 }}
              animate={{ opacity: 1, y: 0, rotate: -2.5 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -24, rotate: -6 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="bg-creme p-2.5 pb-3 shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)]"
            >
              <Photo photo={photo(siropOfSeason(shown).images[0])} sizes="19rem" className="aspect-[4/5]" night={false} />
              <figcaption className="mt-2.5 px-1 font-serif text-[0.95rem] italic leading-snug text-espresso">« {seasons.find((x) => x.id === shown)!.carnet} »</figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <p className="mt-2 text-xs text-creme/60 md:hidden">Glissez pour changer de saison.</p>
      </div>
    </section>
  );
}
