"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useAmbiance } from "@/lib/ambiance";
import { useReducedMotion } from "@/lib/useReduced";
import { FLAVORS, poudreOf, siropOf, startingPrice } from "@/data/products";
import { seasons } from "@/data/collections";
import { quai } from "@/data/images";
import { formatPrice, cn } from "@/lib/utils";
import { Photo } from "@/components/ui/Photo";
import { SeasonIcon } from "@/components/ambiance/icons";
import { RevealTitle, Rise } from "@/components/animations";
import type { Flavor, SeasonId } from "@/lib/types";

const SEASON_OF: Record<Flavor, SeasonId> = { fraise: "printemps", peche: "ete", poire: "automne", datte: "hiver" };
const OF_SEASON = (s: SeasonId) => FLAVORS.find((f) => SEASON_OF[f] === s)!;
const DE: Record<SeasonId, string> = { printemps: "de printemps", ete: "d'été", automne: "d'automne", hiver: "d'hiver" };

/* Section 3 — les créations signatures : une traversée horizontale, une création par escale */
export function Creations() {
  const { season, ready } = useAmbiance();
  const reduce = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const placed = useRef(false);

  const slides = () => Array.from(track.current?.querySelectorAll<HTMLElement>("[data-slide]") ?? []);

  const goTo = useCallback(
    (i: number, smooth = true) => {
      const el = track.current;
      const s = slides()[i];
      if (!el || !s) return;
      el.scrollTo({ left: s.offsetLeft - el.offsetLeft - (el.clientWidth - s.clientWidth) / 2, behavior: smooth && !reduce ? "smooth" : "auto" });
    },
    [reduce],
  );

  // première escale : la création de la saison choisie
  useEffect(() => {
    if (!ready || placed.current) return;
    placed.current = true;
    goTo(FLAVORS.indexOf(OF_SEASON(season)), false);
  }, [ready, season, goTo]);

  // index courant et parallaxe interne (variable CSS --off, sans re-rendu React)
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = el.scrollLeft + el.clientWidth / 2 + el.offsetLeft;
      let best = 0;
      let bestD = Infinity;
      slides().forEach((s, i) => {
        const c = s.offsetLeft + s.clientWidth / 2;
        const off = Math.max(-1, Math.min(1, (c - mid) / s.clientWidth));
        s.style.setProperty("--off", off.toFixed(3));
        if (Math.abs(c - mid) < bestD) {
          bestD = Math.abs(c - mid);
          best = i;
        }
      });
      setIndex(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // glisser à la souris (le tactile défile nativement)
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4 && !moved) {
        moved = true;
        el.style.scrollSnapType = "none";
        el.style.cursor = "grabbing";
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      el.style.cursor = "";
      if (moved) {
        el.style.scrollSnapType = "";
        const mid = el.scrollLeft + el.clientWidth / 2 + el.offsetLeft;
        const list = slides();
        const nearest = list.reduce((b, s, i) => (Math.abs(s.offsetLeft + s.clientWidth / 2 - mid) < Math.abs(list[b].offsetLeft + list[b].clientWidth / 2 - mid) ? i : b), 0);
        goTo(nearest);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, [goTo]);

  return (
    <section id="creations" className="relative z-10 scroll-mt-[var(--header-h)] overflow-hidden bg-deep py-24 text-on-deep md:py-32" aria-labelledby="creations-titre">
      <div className="shell flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <Rise>
            <p className="mention text-gold">Nos créations signatures</p>
          </Rise>
          <RevealTitle id="creations-titre" text="Quatre créations, quatre escales." className="titre mt-5" />
          <Rise delay={0.1}>
            <p className="mt-6 max-w-xl text-on-deep-2">
              Chaque saison a sa création, déclinée en sirop et en préparation en poudre. Faites glisser pour passer d&apos;une escale à l&apos;autre.
            </p>
          </Rise>
        </div>
        <div className="flex items-center gap-5">
          <p className="font-serif text-xl tabular-nums" aria-live="polite">
            <span className="text-gold">{String(index + 1).padStart(2, "0")}</span>
            <span className="mx-2 text-on-deep/40">—</span>
            <span className="text-on-deep/60">04</span>
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => goTo(Math.max(0, index - 1))} disabled={index === 0} className="grid h-12 w-12 place-items-center rounded-full border border-on-deep/25 transition hover:border-gold hover:text-gold disabled:opacity-30" aria-label="Création précédente">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.4} />
            </button>
            <button type="button" onClick={() => goTo(Math.min(3, index + 1))} disabled={index === 3} className="grid h-12 w-12 place-items-center rounded-full border border-on-deep/25 transition hover:border-gold hover:text-gold disabled:opacity-30" aria-label="Création suivante">
              <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={track}
        tabIndex={0}
        role="region"
        aria-roledescription="carrousel"
        aria-label="Créations signatures"
        className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-[4vw] overflow-x-auto overscroll-x-contain px-[7vw] pb-4 outline-none focus-visible:ring-1 focus-visible:ring-gold md:mt-16 md:cursor-grab md:px-[13vw]"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            goTo(Math.min(3, index + 1));
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            goTo(Math.max(0, index - 1));
          }
        }}
      >
        {FLAVORS.map((f, i) => {
          const sirop = siropOf(f);
          const poudre = poudreOf(f);
          const s = seasons.find((x) => x.id === SEASON_OF[f])!;
          const ps = startingPrice(sirop);
          const pp = startingPrice(poudre);
          const img = quai(f);
          return (
            <article
              key={f}
              data-slide
              aria-roledescription="diapositive"
              aria-label={`${i + 1} sur 4 : ${sirop.name}`}
              className={cn("group relative grid w-[86vw] shrink-0 snap-center gap-8 md:w-[74vw] md:grid-cols-[1.05fr_1fr] md:items-center md:gap-[4vw] lg:max-w-[1180px]", index !== i && "md:opacity-60")}
              style={{ transition: "opacity .8s cubic-bezier(.22,1,.36,1)" }}
            >
              {/* composition photographique : flacon et sachet, au même coucher de soleil */}
              <div className="relative mx-auto aspect-[1/1.02] w-full max-w-[34rem] select-none">
                <div
                  className="absolute inset-[8%] rounded-full opacity-70 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                  style={{ background: `radial-gradient(circle, ${sirop.palette.accent}66, transparent 65%)` }}
                  aria-hidden
                />
                <div className="absolute left-[4%] top-0 w-[46%] [transform:translateX(calc(var(--off,0)*-38px))] transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)]">
                  <Photo
                    photo={img.flacon}
                    sizes="(min-width:768px) 17vw, 40vw"
                    className="aspect-[351/828] shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)] transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2"
                    imgClassName="transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                    night={false}
                  />
                </div>
                <div className="absolute bottom-0 right-[3%] w-[44%] [transform:translateX(calc(var(--off,0)*-90px))] transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)]">
                  <Photo
                    photo={img.sachet}
                    sizes="(min-width:768px) 16vw, 38vw"
                    className="aspect-[368/753] shadow-[0_40px_80px_-30px_rgba(0,0,0,.75)] ring-1 ring-on-deep/10 transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-1.5"
                    imgClassName="transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                    night={false}
                  />
                </div>
                <span className="absolute -left-1 bottom-[8%] font-serif text-[clamp(4rem,9vw,8rem)] italic leading-none text-on-deep/10" aria-hidden>
                  {s.numeral}
                </span>
              </div>

              <div className="pb-2 [transform:translateX(calc(var(--off,0)*40px))]">
                <p className="mention flex items-center gap-2.5" style={{ color: sirop.palette.accent }}>
                  <SeasonIcon season={s.id} className="h-5 w-5" />
                  Création {DE[s.id]}
                </p>
                <h3 className="mt-4 font-serif text-[clamp(2.2rem,4vw,3.9rem)] font-light leading-[0.98]">
                  {sirop.name.split(" & ")[0]}
                  <span className="block italic">&amp; {sirop.name.split(" & ")[1]}</span>
                </h3>
                <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-on-deep-2">{sirop.sensory}</p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Notes">
                  {sirop.notes.map((n) => (
                    <li key={n} className="rounded-full border border-on-deep/20 px-3 py-1 text-[0.8rem] text-on-deep/85">
                      {n}
                    </li>
                  ))}
                </ul>
                <dl className="mt-8 grid max-w-md grid-cols-2 border-y border-on-deep/15 text-sm">
                  <div className="border-r border-on-deep/15 py-4 pr-4">
                    <dt className="text-on-deep-2">Sirop · {ps.contenance}</dt>
                    <dd className="mt-1 font-serif text-xl">{formatPrice(ps.price)} {ps.tax}</dd>
                  </div>
                  <div className="py-4 pl-5">
                    <dt className="text-on-deep-2">Poudre · {pp.contenance}</dt>
                    <dd className="mt-1 font-serif text-xl">{formatPrice(pp.price)} {pp.tax}</dd>
                  </div>
                </dl>
                <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-[0.78rem] font-semibold uppercase tracking-[0.18em]">
                  <Link href={`/produits/${sirop.slug}`} className="inline-flex items-center gap-2 text-gold">
                    <span className="lien">Découvrir le sirop</span>
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.4} />
                  </Link>
                  <Link href={`/produits/${poudre.slug}`} className="inline-flex items-center gap-2">
                    <span className="lien-revele">La poudre</span>
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.4} />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="shell mt-10">
        <div className="relative h-px bg-on-deep/15" aria-hidden>
          <span className="absolute inset-y-0 left-0 bg-gold transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)]" style={{ width: `${((index + 1) / 4) * 100}%` }} />
        </div>
        <p className="mt-4 text-xs text-on-deep-2">Prix indicatifs de démonstration — aucune vente réelle.</p>
      </div>
    </section>
  );
}
