"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { home } from "@/data/images";
import type { Photo as PhotoData } from "@/data/images";
import { Photo } from "@/components/ui/Photo";
import { RevealTitle, Rise } from "@/components/animations";
import { cn } from "@/lib/utils";

const USAGES: { id: keyof typeof home.usages; label: string; text: string; recipe: string; recipeTitle: string }[] = [
  { id: "latte", label: "Latte", text: "Un espresso, un lait soyeux et une cuillère de saveur, en finale.", recipe: "latte-datte-creme-brulee", recipeTitle: "Latte Datte & Crème brûlée" },
  { id: "latte-glace", label: "Iced latte", text: "En couches sur la glace, à mélanger au dernier moment.", recipe: "iced-latte-poire-vanille", recipeTitle: "Iced latte Poire & Vanille" },
  { id: "cafe", label: "Café", text: "Un trait dans le café du matin, sur une terrasse face à la mer.", recipe: "cafe-du-large-poire", recipeTitle: "Café du large à la Poire" },
  { id: "mocktail", label: "Mocktail", text: "Eau pétillante, fruits frais, glace pilée : sans une goutte d'alcool.", recipe: "mocktail-petillant-peche-blanche", recipeTitle: "Mocktail pétillant Pêche blanche" },
  { id: "chocolat", label: "Chocolat chaud", text: "Épais et sombre, à boire lentement près d'une fenêtre enneigée.", recipe: "chocolat-chaud-datte-creme-brulee", recipeTitle: "Chocolat chaud Datte & Crème brûlée" },
  { id: "milkshake", label: "Milkshake", text: "Glace vanille, lait froid, fraise des bois et madeleine émiettée.", recipe: "milkshake-fraise-madeleine", recipeTitle: "Milkshake Fraise & Madeleine" },
  { id: "dessert", label: "Dessert", text: "Dans l'appareil d'une crème brûlée, un nappage, une pâtisserie.", recipe: "creme-brulee-datte-medjool", recipeTitle: "Crème brûlée à la Datte Medjool" },
];

function Panel({ u, i, active, onActivate }: { u: (typeof USAGES)[number]; i: number; active: boolean; onActivate: () => void }) {
  const photo: PhotoData = home.usages[u.id];
  return (
    <article
      className={cn(
        "group relative h-full min-w-0 overflow-hidden transition-[flex-grow] duration-[900ms] ease-[cubic-bezier(.65,0,.35,1)]",
        active ? "grow-[5.2]" : "grow",
      )}
      style={{ flexBasis: 0 }}
      onMouseEnter={onActivate}
      onFocusCapture={onActivate}
    >
      <Photo photo={photo} sizes="46vw" className="absolute inset-0" imgClassName={cn("transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)]", active ? "scale-100" : "scale-[1.18]")} />
      <div className={cn("absolute inset-0 transition-colors duration-700", active ? "bg-gradient-to-t from-black/75 via-black/15 to-transparent" : "bg-black/45")} aria-hidden />
      {/* libellé vertical, panneau replié */}
      <div className={cn("absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-between py-7 text-creme transition-opacity duration-500", active ? "opacity-0" : "opacity-100 delay-200")} aria-hidden>
        <span className="font-serif text-sm italic text-creme/75">{String(i + 1).padStart(2, "0")}</span>
        <span className="font-serif text-[1.55rem] leading-none [writing-mode:vertical-rl] rotate-180 whitespace-nowrap">{u.label}</span>
      </div>
      {/* contenu, panneau ouvert */}
      <div className={cn("absolute inset-x-0 bottom-0 p-8 text-creme transition-all duration-700", active ? "translate-y-0 opacity-100 delay-300" : "translate-y-6 opacity-0")}>
        <p className="mention text-creme/80">{String(i + 1).padStart(2, "0")} · Usage</p>
        <h3 className="mt-3 font-serif text-[2.6rem] font-light leading-none xl:text-[3.1rem]">{u.label}</h3>
        <p className="mt-3 max-w-sm text-creme/85">{u.text}</p>
        <Link href={`/recettes/${u.recipe}`} className="mt-6 inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.18em]" tabIndex={active ? 0 : -1}>
          <span className="lien">Recette : {u.recipeTitle}</span>
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.4} />
        </Link>
      </div>
      <button type="button" className={cn("absolute inset-0 opacity-0", active && "pointer-events-none")} onClick={onActivate} aria-label={`${u.label} : ${u.text}`} aria-expanded={active} tabIndex={active ? -1 : 0} />
    </article>
  );
}

/* Section 6 — une saveur, mille façons de la déguster : galerie de panneaux qui s'ouvrent */
export function Usages() {
  const [active, setActive] = useState(0);
  return (
    <section className="relative z-10 bg-tint py-24 md:py-32" aria-labelledby="usages-titre">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Rise>
              <p className="mention text-accent-ink">Recettes &amp; usages</p>
            </Rise>
            <RevealTitle id="usages-titre" text="Une saveur. Mille façons de la déguster." className="titre mt-5 max-w-[14ch]" />
          </div>
          <Rise className="lg:col-span-4 lg:col-start-9" delay={0.1}>
            <p className="text-ink-2">
              Chaque création est pensée pour plusieurs boissons. Survolez un usage pour l&apos;ouvrir, puis découvrez la recette de démonstration qui
              l&apos;accompagne.
            </p>
            <Link href="/recettes" className="btn btn-trait mt-7">
              Toutes les recettes
            </Link>
          </Rise>
        </div>

        {/* bureau : panneaux en accordéon */}
        <Rise className="mt-14 hidden h-[min(74vh,720px)] min-h-[520px] gap-2 lg:flex">
          {USAGES.map((u, i) => (
            <Panel key={u.id} u={u} i={i} active={active === i} onActivate={() => setActive(i)} />
          ))}
        </Rise>
      </div>

      {/* mobile & tablette : défilement tactile */}
      <ul className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 lg:hidden" aria-label="Usages">
        {USAGES.map((u, i) => (
          <li key={u.id} className="w-[74vw] shrink-0 snap-start sm:w-[44vw]">
            <Link href={`/recettes/${u.recipe}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Photo photo={home.usages[u.id]} sizes="(min-width:640px) 44vw, 74vw" className="absolute inset-0" imgClassName="transition-transform duration-1000 group-active:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 p-5 text-creme">
                  <p className="font-serif text-sm italic text-creme/80">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="font-serif text-[2rem] leading-none">{u.label}</h3>
                </div>
              </div>
              <p className="mt-3 text-sm text-ink-2">{u.text}</p>
              <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent-ink">Voir la recette →</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
