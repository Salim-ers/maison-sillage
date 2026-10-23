"use client";

import { useReducedMotion } from "@/lib/useReduced";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Search, SlidersHorizontal, X } from "lucide-react";
import { products, saveurLabels, startingPrice } from "@/data/products";
import { drinkTypes, seasons, shopTabs } from "@/data/collections";
import { matches, productHaystack, suggest, type Suggestion } from "@/lib/search";
import type { Category, DrinkType, Product, Saveur, SeasonId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { FORMATS, PRICES, type PriceRange } from "@/lib/shop";
import { ProductCard } from "./ProductCard";

type Sort = "selection" | "prix-asc" | "prix-desc" | "nom";
type SeasonFilter = SeasonId | "permanente";
export type ShopInitial = {
  categorie?: Category | "tous";
  saison?: SeasonFilter[];
  saveur?: Saveur[];
  boisson?: DrinkType[];
  format?: string[];
  prix?: PriceRange[];
  q?: string;
};

const SORTS: { id: Sort; label: string }[] = [
  { id: "selection", label: "Sélection de la Maison" },
  { id: "prix-asc", label: "Prix croissant" },
  { id: "prix-desc", label: "Prix décroissant" },
  { id: "nom", label: "Nom, de A à Z" },
];
const PAGE = 12;

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-10 items-center gap-1.5 border px-3.5 py-2 text-sm transition-[background-color,border-color,color,transform] duration-300 active:scale-[0.97]",
        on ? "border-inverse bg-inverse text-on-inverse" : "border-line hover:border-ink/60",
      )}
    >
      <AnimatePresence initial={false}>
        {on && (
          <motion.span key="c" initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>
      {children}
    </button>
  );
}

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
const price = (p: Product) => startingPrice(p).price ?? Infinity;

export function ShopCatalog({ initial, locked }: { initial: ShopInitial; locked?: Category[] }) {
  const [cat, setCat] = useState<Category | "tous">(locked ? "tous" : (initial.categorie ?? "tous"));
  const [saison, setSaison] = useState<SeasonFilter[]>(initial.saison ?? []);
  const [saveur, setSaveur] = useState<Saveur[]>(initial.saveur ?? []);
  const [boisson, setBoisson] = useState<DrinkType[]>(initial.boisson ?? []);
  const [format, setFormat] = useState<string[]>(initial.format ?? []);
  const [prix, setPrix] = useState<PriceRange[]>(initial.prix ?? []);
  const [q, setQ] = useState(initial.q ?? "");
  const [sort, setSort] = useState<Sort>("selection");
  const [panel, setPanel] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const [sugOpen, setSugOpen] = useState(false);
  const [sugIndex, setSugIndex] = useState(-1);
  const reduce = useReducedMotion();
  const listId = useId();
  const sentinel = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);

  // l'URL reflète les filtres (partageable, retour arrière cohérent)
  useEffect(() => {
    const sp = new URLSearchParams();
    if (!locked && cat !== "tous") sp.set("categorie", cat);
    if (saison.length) sp.set("saison", saison.join(","));
    if (saveur.length) sp.set("saveur", saveur.join(","));
    if (boisson.length) sp.set("boisson", boisson.join(","));
    if (format.length) sp.set("format", format.join(","));
    if (prix.length) sp.set("prix", prix.join(","));
    if (q.trim()) sp.set("q", q.trim());
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [cat, saison, saveur, boisson, format, prix, q, locked]);

  // chaque changement de filtre repart de la première page
  useEffect(() => setShown(PAGE), [cat, saison, saveur, boisson, format, prix, q, sort]);

  const scope = useMemo(() => products.filter((p) => (locked ? locked.includes(p.category) : true)), [locked]);
  const list = useMemo(() => {
    let l = scope.filter((p) => (cat === "tous" ? true : p.category === cat));
    if (saison.length) l = l.filter((p) => saison.some((s) => (s === "permanente" ? !p.season : p.season === s)));
    if (saveur.length) l = l.filter((p) => saveur.some((s) => p.saveurs.includes(s)));
    if (boisson.length) l = l.filter((p) => boisson.some((d) => p.servings.some((s) => s.drink === d)));
    if (format.length) l = l.filter((p) => p.formats.some((f) => f.public === "particulier" && format.includes(f.contenance)));
    if (prix.length) l = l.filter((p) => prix.some((r) => PRICES.find((x) => x.id === r)!.test(price(p))));
    if (q.trim()) l = l.filter((p) => matches(productHaystack(p), q));
    if (sort === "prix-asc") l = [...l].sort((a, b) => price(a) - price(b));
    if (sort === "prix-desc") l = [...l].sort((a, b) => price(b) - price(a));
    if (sort === "nom") l = [...l].sort((a, b) => a.name.localeCompare(b.name, "fr"));
    return l;
  }, [scope, cat, saison, saveur, boisson, format, prix, q, sort]);

  // chargement progressif : la page suivante arrive quand le bas de la grille approche
  useEffect(() => {
    const el = sentinel.current;
    if (!el || shown >= list.length) return;
    const io = new IntersectionObserver((e) => e[0].isIntersecting && setShown((n) => n + PAGE), { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [shown, list.length]);

  const suggestions = useMemo(() => (sugOpen ? suggest(q) : []), [q, sugOpen]);
  const count = (fn: (p: Product) => boolean) => scope.filter(fn).length;
  const active = saison.length + saveur.length + boisson.length + format.length + prix.length + (q.trim() ? 1 : 0);
  const reset = () => {
    setSaison([]);
    setSaveur([]);
    setBoisson([]);
    setFormat([]);
    setPrix([]);
    setQ("");
  };
  const pick = (s: Suggestion) => {
    setQ(s.value);
    setSugOpen(false);
    setSugIndex(-1);
  };
  const tabs = locked ? [] : shopTabs;

  const filters = (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      <fieldset>
        <legend className="mention mb-3 text-accent-ink">Saison</legend>
        <div className="flex flex-wrap gap-2">
          {seasons.map((s) => (
            <Chip key={s.id} on={saison.includes(s.id)} onClick={() => setSaison((l) => toggle(l, s.id))}>
              <span className="h-2 w-2 rounded-full" style={{ background: s.accent }} aria-hidden />
              {s.name}
            </Chip>
          ))}
          <Chip on={saison.includes("permanente")} onClick={() => setSaison((l) => toggle(l, "permanente"))}>
            Toute l&apos;année
          </Chip>
        </div>
      </fieldset>
      <fieldset>
        <legend className="mention mb-3 text-accent-ink">Saveur</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(saveurLabels) as [Saveur, string][])
            .filter(([id]) => count((p) => p.saveurs.includes(id)) > 0)
            .map(([id, label]) => (
              <Chip key={id} on={saveur.includes(id)} onClick={() => setSaveur((l) => toggle(l, id))}>
                {label}
              </Chip>
            ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mention mb-3 text-accent-ink">Type de boisson</legend>
        <div className="flex flex-wrap gap-2">
          {drinkTypes
            .filter((d) => count((p) => p.servings.some((s) => s.drink === d.id)) > 0)
            .map((d) => (
              <Chip key={d.id} on={boisson.includes(d.id)} onClick={() => setBoisson((l) => toggle(l, d.id))}>
                {d.label}
              </Chip>
            ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mention mb-3 text-accent-ink">Format</legend>
        <div className="flex flex-wrap gap-2">
          {FORMATS.filter((f) => count((p) => p.formats.some((x) => x.public === "particulier" && x.contenance === f)) > 0).map((f) => (
            <Chip key={f} on={format.includes(f)} onClick={() => setFormat((l) => toggle(l, f))}>
              {f}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mention mb-3 text-accent-ink">Prix indicatif</legend>
        <div className="flex flex-wrap gap-2">
          {PRICES.map((r) => (
            <Chip key={r.id} on={prix.includes(r.id)} onClick={() => setPrix((l) => toggle(l, r.id))}>
              {r.label}
            </Chip>
          ))}
        </div>
      </fieldset>
    </div>
  );

  return (
    <div className="shell pb-28" ref={top}>
      {/* rayons */}
      {tabs.length > 0 && (
        <div role="tablist" aria-label="Rayons de la boutique" className="no-scrollbar -mx-[var(--gutter)] flex gap-1 overflow-x-auto px-[var(--gutter)]">
          {tabs.map((t, idx) => {
            const on = cat === t.id;
            const n = t.id === "tous" ? products.length : products.filter((p) => p.category === t.id).length;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={on}
                onClick={() => setCat(t.id)}
                className={cn("relative shrink-0 px-4 pb-3 pt-2 text-left transition-opacity duration-300 first:pl-0", on ? "opacity-100" : "opacity-60 hover:opacity-100")}
              >
                <span className="font-serif text-[1.25rem] leading-none md:text-[1.4rem]">{t.label}</span>
                <span className="ml-1.5 align-top text-[0.7rem] tabular-nums text-muted">{n}</span>
                {on && <motion.span layoutId="rayon-trait" className={cn("absolute bottom-0 right-4 h-[2px] bg-accent", idx === 0 ? "left-0" : "left-4")} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />}
              </button>
            );
          })}
        </div>
      )}

      {/* barre d'outils */}
      <div className="sticky top-[var(--header-h)] z-30 -mx-[var(--gutter)] border-y border-line bg-[var(--a-header)] px-[var(--gutter)] py-3 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 basis-full sm:max-w-sm sm:flex-1 sm:basis-auto">
            <label className="relative flex items-center">
              <span className="sr-only">Rechercher dans la boutique</span>
              <Search className="pointer-events-none absolute left-0 h-4 w-4 text-muted" strokeWidth={1.5} />
              <input
                type="search"
                role="combobox"
                aria-expanded={suggestions.length > 0}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={sugIndex >= 0 ? `${listId}-${sugIndex}` : undefined}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setSugOpen(true);
                  setSugIndex(-1);
                }}
                onFocus={() => setSugOpen(true)}
                onBlur={() => window.setTimeout(() => setSugOpen(false), 120)}
                onKeyDown={(e) => {
                  if (!suggestions.length) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSugIndex((i) => (i + 1) % suggestions.length);
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSugIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
                  } else if (e.key === "Enter" && sugIndex >= 0) {
                    e.preventDefault();
                    pick(suggestions[sugIndex]);
                  } else if (e.key === "Escape") setSugOpen(false);
                }}
                placeholder="Rechercher une saveur, une boisson…"
                className="champ py-2 pl-7"
              />
            </label>
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.ul
                  id={listId}
                  role="listbox"
                  aria-label="Suggestions"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="papier absolute inset-x-0 top-full z-40 mt-2 py-2"
                >
                  {suggestions.map((s, i) => (
                    <li key={`${s.kind}-${s.label}`} id={`${listId}-${i}`} role="option" aria-selected={i === sugIndex}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => pick(s)}
                        className={cn("flex w-full items-baseline justify-between gap-4 px-4 py-2 text-left text-sm transition-colors", i === sugIndex ? "bg-tint" : "hover:bg-tint")}
                      >
                        <span className="font-serif text-[1.05rem]">{s.label}</span>
                        <span className="text-[0.68rem] uppercase tracking-[0.16em] text-muted">{s.kind}</span>
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          <button
            type="button"
            onClick={() => setPanel((v) => !v)}
            aria-expanded={panel}
            aria-controls="filtres"
            className="inline-flex min-h-10 items-center gap-2 border border-line px-3.5 text-sm transition-colors hover:border-ink/60"
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
            Filtres
            <AnimatePresence initial={false}>
              {active > 0 && (
                <motion.span
                  key={active}
                  initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[0.68rem] font-semibold tabular-nums text-[#1a120b]"
                >
                  {active}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <label className="ml-auto flex min-w-0 items-center gap-2 text-sm">
            <span className="hidden text-muted md:inline">Trier</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="min-h-10 border border-line bg-page px-3 text-sm text-ink">
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <AnimatePresence initial={false}>
          {panel && (
            <motion.div
              id="filtres"
              initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="max-h-[62vh] overflow-y-auto py-6">{filters}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted" aria-live="polite">
          {list.length} référence{list.length > 1 ? "s" : ""}
          {active > 0 && " correspondant à vos critères"}
        </p>
        {active > 0 && (
          <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-sm underline-offset-4 hover:underline">
            <X className="h-3.5 w-3.5" /> Effacer les filtres
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="mt-16 max-w-lg">
          <p className="font-serif text-3xl">Aucune référence ne correspond à ces critères.</p>
          <p className="mt-3 text-ink-2">Essayez une autre saison, une saveur voisine ou un autre type de boisson, ou effacez les filtres.</p>
          <button type="button" onClick={reset} className="btn btn-encre mt-8">
            Effacer les filtres
          </button>
        </div>
      ) : (
        <>
          <motion.ul layout={!reduce} className="mt-8 grid grid-cols-1 gap-x-6 gap-y-14 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {list.slice(0, shown).map((p, i) => (
                <motion.li
                  key={p.slug}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.22 } }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : (i % PAGE) * 0.035 }}
                  className="flex"
                >
                  <ProductCard product={p} className="w-full" preload={i < 4} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
          <div ref={sentinel} aria-hidden />
          {shown < list.length && (
            <div className="mt-16 flex flex-col items-center gap-3">
              <p className="text-sm text-muted">
                {Math.min(shown, list.length)} sur {list.length}
              </p>
              <button type="button" onClick={() => setShown((n) => n + PAGE)} className="btn btn-trait">
                Afficher plus de références
              </button>
            </div>
          )}
        </>
      )}
      {locked?.includes("accessoire") && (
        <p className="mt-16 max-w-xl text-sm text-muted">
          Les objets de L&apos;Atelier sont en sélection : fabricant, matériaux et dimensions restent à définir. Les visuels montrent l&apos;intention, pas un
          produit fabriqué.{" "}
          <Link href="/professionnels#demande" className="lien">
            Demande professionnelle
          </Link>
        </p>
      )}
    </div>
  );
}
