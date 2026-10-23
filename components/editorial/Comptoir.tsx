"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useAmbiance } from "@/lib/ambiance";
import { useReducedMotion } from "@/lib/useReduced";
import { comptoir, type Choice } from "@/lib/comptoir";
import { drinkTypes, envies, seasons, categoryLabels } from "@/data/collections";
import { drinkLabels } from "@/data/recipes";
import { productCardPhotos, recipePhoto } from "@/data/images";
import { cartFormats, startingPrice } from "@/data/products";
import { Photo } from "@/components/ui/Photo";
import { SeasonIcon } from "@/components/ambiance/icons";
import { AddToCart } from "@/components/products/AddToCart";
import { EASE, HOULE } from "@/components/animations";
import { cn, formatPrice } from "@/lib/utils";
import type { DrinkType, Envie, SeasonId } from "@/lib/types";

function Choices<T extends string>({
  legend,
  options,
  value,
  onChange,
  name,
}: {
  legend: string;
  options: { id: T; label: string; hint?: string; icon?: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  name: string;
}) {
  return (
    <fieldset>
      <legend className="mention mb-3 text-accent-ink">{legend}</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup">
        {options.map((o) => {
          const on = o.id === value;
          return (
            <label
              key={o.id}
              className={cn(
                "relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-[0.92rem] transition-[color,border-color] duration-300 focus-within:outline focus-within:outline-1 focus-within:outline-offset-2",
                on ? "border-transparent text-on-inverse" : "border-line hover:border-ink/50",
              )}
            >
              <input type="radio" name={name} value={o.id} checked={on} onChange={() => onChange(o.id)} className="sr-only" />
              {on && <motion.span layoutId={`comptoir-${name}`} className="absolute inset-0 rounded-full bg-inverse" transition={{ duration: 0.45, ease: EASE }} aria-hidden />}
              <span className="relative inline-flex items-center gap-2">
                {o.icon}
                {o.label}
                {o.hint && <span className={cn("hidden text-[0.72rem] sm:inline", on ? "text-on-inverse/70" : "text-muted")}>{o.hint}</span>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * Le Comptoir des Saveurs : on choisit une boisson, une envie et une saison ; le comptoir propose
 * les créations compatibles et une recette. Les associations viennent des fiches produits.
 */
export function Comptoir({ id = "comptoir", tone = "page", recipeThumb = true }: { id?: string; tone?: "page" | "tint"; recipeThumb?: boolean }) {
  const amb = useAmbiance();
  const reduce = useReducedMotion();
  const [drink, setDrink] = useState<DrinkType>("iced-latte");
  const [envie, setEnvie] = useState<Envie>("gourmand");
  const [season, setSeason] = useState<SeasonId>("automne");
  const touched = useRef(false);
  // la saison de départ est celle de l'ambiance choisie par le visiteur
  useEffect(() => {
    if (amb.ready && !touched.current) setSeason(amb.season);
  }, [amb.ready, amb.season]);

  const choice: Choice = { drink, envie, season };
  const key = `${drink}-${envie}-${season}`;
  const result = useMemo(() => comptoir({ drink, envie, season }), [drink, envie, season]);
  const [main, ...others] = result.matches;
  const recipe = result.recipe;
  const set = <T,>(fn: (v: T) => void) => (v: T) => {
    touched.current = true;
    fn(v);
  };

  return (
    <section id={id} className={cn("relative z-10 scroll-mt-[var(--header-h)] py-24 md:py-32", tone === "tint" ? "bg-tint" : "bg-page")} aria-labelledby={`${id}-titre`}>
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="mention text-accent-ink">Le Comptoir des Saveurs</p>
            <h2 id={`${id}-titre`} className="titre mt-5 max-w-[15ch]">
              Composez votre boisson, la Maison vous sert.
            </h2>
          </div>
          <p className="text-ink-2 lg:col-span-4 lg:col-start-9">
            Une boisson, une envie, une saison : le comptoir choisit parmi nos créations celles qui s&apos;y prêtent, et la recette qui va avec.
          </p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <form className="space-y-8 lg:col-span-5" onSubmit={(e) => e.preventDefault()} aria-label="Composer une boisson">
            <Choices legend="La boisson" name={`${id}-boisson`} value={drink} onChange={set(setDrink)} options={drinkTypes.map((d) => ({ id: d.id, label: d.label }))} />
            <Choices legend="L'envie" name={`${id}-envie`} value={envie} onChange={set(setEnvie)} options={envies.map((e) => ({ id: e.id, label: e.label }))} />
            <Choices
              legend="La saison"
              name={`${id}-saison`}
              value={season}
              onChange={set(setSeason)}
              options={seasons.map((s) => ({ id: s.id, label: s.name, icon: <SeasonIcon season={s.id} className="h-4 w-4" /> }))}
            />
            <p className="text-xs text-muted">Suggestions de démonstration : les recettes et les dosages restent à valider avec les produits finalisés.</p>
          </form>

          {/* résultat interactif : il change avec chaque choix (exclu du contrôle des doublons photographiques) */}
          <div className="lg:col-span-7" aria-live="polite" data-interactif>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={key}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                {main && (
                  <div className="grid gap-6 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] sm:gap-8">
                    <Link href={`/produits/${main.product.slug}`} className="group relative block aspect-[4/5] overflow-hidden bg-tint">
                      <motion.div
                        className="absolute inset-0"
                        initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
                        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                        transition={{ duration: 0.9, ease: HOULE }}
                      >
                        <Photo
                          photo={productCardPhotos(main.product).main}
                          sizes="(min-width:1024px) 26vw, (min-width:640px) 45vw, 100vw"
                          className="h-full w-full"
                          imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                          night={false}
                        />
                      </motion.div>
                    </Link>
                    <div className="flex flex-col">
                      <p className="mention text-accent-ink">La Maison vous propose</p>
                      <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">{categoryLabels[main.product.category]}</p>
                      <h3 className="mt-2 font-serif text-[clamp(1.8rem,2.6vw,2.5rem)] font-light leading-[1.02]">
                        <Link href={`/produits/${main.product.slug}`} className="transition-colors hover:text-accent-ink">
                          {main.product.name}
                        </Link>
                      </h3>
                      <p className="mt-4 leading-relaxed text-ink-2">{main.product.description}</p>
                      <p className="mt-5 border-l-2 border-gold pl-4 font-serif text-lg italic">
                        {main.serving.dose} dans un {drinkLabels[choice.drink].toLowerCase()}
                      </p>
                      <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-6">
                        {cartFormats(main.product)[0] && (
                          <AddToCart slug={main.product.slug} formatId={cartFormats(main.product)[0].id} variant="encre" label={`Ajouter · ${formatPrice(startingPrice(main.product).price ?? 0)}`} className="min-h-11" />
                        )}
                        <Link href={`/produits/${main.product.slug}`} className="text-[0.75rem] font-semibold uppercase tracking-[0.16em]">
                          <span className="lien">La fiche</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-2">
                  {others.length > 0 && (
                    <div>
                      <h4 className="mention text-accent-ink">Également compatibles</h4>
                      <ul className="mt-4 space-y-3">
                        {others.map((m, i) => (
                          <motion.li key={m.product.slug} initial={reduce ? false : { opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.12 + i * 0.06 }}>
                            <Link href={`/produits/${m.product.slug}`} className="group flex items-baseline justify-between gap-4">
                              <span className="font-serif text-[1.2rem] leading-tight transition-colors group-hover:text-accent-ink">{m.product.name}</span>
                              <span className="shrink-0 text-xs text-muted">
                                {categoryLabels[m.product.category]} · {m.serving.dose}
                              </span>
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {recipe && (
                    <Link href={`/recettes/${recipe.slug}`} className="group flex items-center gap-5">
                      {recipeThumb && (
                        <Photo photo={recipePhoto(recipe)} sizes="96px" className="h-28 w-[5.5rem] shrink-0" imgClassName="transition-transform duration-700 group-hover:scale-110" />
                      )}
                      <span>
                        <span className="mention block text-accent-ink">La recette suggérée</span>
                        <span className="mt-1.5 block font-serif text-[1.35rem] leading-tight transition-colors group-hover:text-accent-ink">{recipe.title}</span>
                        <span className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                          {drinkLabels[recipe.drink]} · {recipe.temps}
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.4} />
                        </span>
                      </span>
                    </Link>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
