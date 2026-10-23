"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useAmbiance } from "@/lib/ambiance";
import { useReducedMotion } from "@/lib/useReduced";
import { heroPhotos, seasonImages } from "@/data/images";
import { lights, seasons } from "@/data/collections";
import { cn } from "@/lib/utils";
import { CompassIcon, LightIcon, SeasonIcon } from "./icons";
import { EASE } from "@/components/animations";

/**
 * Boussole d'ambiance (en-tête) : deux réglages indépendants — la lumière
 * et la saison — et un mode automatique fondé sur l'heure locale.
 * Chaque choix est mémorisé et s'applique à tout le site.
 */
export function AmbianceControl({ tone }: { tone: "photo" | "page" }) {
  const amb = useAmbiance();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const id = useId();
  const seasonName = seasons.find((s) => s.id === amb.season)!.name;
  const lightName = lights.find((l) => l.id === amb.light)!.name;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !button.current?.contains(t)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLInputElement>("input:checked")?.focus(), 80);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
      window.clearTimeout(t);
    };
  }, [open]);

  const origin = () => {
    const r = button.current?.getBoundingClientRect();
    return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined;
  };

  const target = amb.pending ?? amb;

  return (
    <div className="relative">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`${id}-panneau`}
        aria-label={`Ambiance : ${seasonName}, ${lightName.toLowerCase()}${amb.auto ? " (automatique)" : ""}. Changer d'ambiance`}
        className={cn(
          "group grid h-11 w-11 place-items-center rounded-full transition duration-300",
          tone === "photo" ? "text-creme hover:bg-creme/10" : "text-ink/85 hover:bg-ink/5 hover:text-ink",
        )}
      >
        <CompassIcon className="h-[26px] w-[26px] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:rotate-[18deg]" spinning={!!amb.pending} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            id={`${id}-panneau`}
            role="dialog"
            aria-label="Choisir l'ambiance du site"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10, clipPath: "inset(0% 0% 100% 0% round 2px)" }}
            animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 2px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="papier fixed inset-x-3 bottom-3 z-[70] max-h-[82svh] overflow-y-auto p-5 text-ink sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[25.5rem] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mention text-accent-ink">Ambiance de la Maison</p>
                <p className="mt-1.5 font-serif text-[1.55rem] leading-tight" aria-live="polite">
                  {seasonName} · {lightName}
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="-mr-2 -mt-1 grid h-10 w-10 place-items-center rounded-full hover:bg-ink/5" aria-label="Fermer">
                <X className="h-4 w-4" strokeWidth={1.4} />
              </button>
            </div>

            <fieldset className="mt-5">
              <legend className="mention mb-2.5 text-muted">Lumière</legend>
              <div className="grid grid-cols-3 gap-2">
                {lights.map((l) => {
                  const on = target.light === l.id;
                  const p = heroPhotos(l.id).desktop;
                  return (
                    <label key={l.id} className={cn("group/opt relative block cursor-pointer overflow-hidden rounded-[2px] border transition", on ? "border-ink" : "border-line hover:border-ink/40")}>
                      <input
                        type="radio"
                        name={`${id}-lumiere`}
                        value={l.id}
                        checked={on}
                        onChange={() => amb.setAmbiance({ light: l.id }, { origin: origin() })}
                        className="peer sr-only"
                      />
                      <span className="relative block aspect-[4/3] overflow-hidden">
                        <Image src={p.src} alt="" fill sizes="130px" quality={70} className="object-cover transition duration-700 group-hover/opt:scale-105" style={{ objectPosition: "42% 50%" }} />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                        <LightIcon light={l.id} className="absolute bottom-1.5 left-1.5 h-5 w-5 text-creme" />
                      </span>
                      <span className="block px-2 py-1.5 text-[0.72rem] font-semibold leading-tight">{l.name}</span>
                      <span className="pointer-events-none absolute inset-0 rounded-[2px] ring-accent-ink peer-focus-visible:ring-2" />
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-5">
              <legend className="mention mb-2.5 text-muted">Saison</legend>
              <div className="grid grid-cols-4 gap-2">
                {seasons.map((s) => {
                  const on = target.season === s.id;
                  const p = seasonImages[s.id].paysage;
                  return (
                    <label key={s.id} className={cn("group/opt relative block cursor-pointer overflow-hidden rounded-[2px] border transition", on ? "border-ink" : "border-line hover:border-ink/40")}>
                      <input
                        type="radio"
                        name={`${id}-saison`}
                        value={s.id}
                        checked={on}
                        onChange={() => amb.setAmbiance({ season: s.id }, { origin: origin() })}
                        className="peer sr-only"
                      />
                      <span className="relative block aspect-square overflow-hidden">
                        <Image src={p.src} alt="" fill sizes="96px" quality={70} className="object-cover transition duration-700 group-hover/opt:scale-105" style={{ objectPosition: "42% 50%" }} />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <SeasonIcon season={s.id} className="absolute bottom-1.5 left-1.5 h-[18px] w-[18px] text-creme" />
                      </span>
                      <span className="block px-1.5 py-1.5 text-center text-[0.7rem] font-semibold leading-tight">{s.name}</span>
                      <span className="pointer-events-none absolute inset-0 rounded-[2px] ring-accent-ink peer-focus-visible:ring-2" />
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <label className="mt-5 flex cursor-pointer items-start gap-3 border-t border-line pt-4">
              <input type="checkbox" checked={amb.auto} onChange={(e) => amb.setAuto(e.target.checked, { origin: origin() })} className="peer sr-only" />
              <span
                aria-hidden
                className={cn(
                  "relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-accent-ink",
                  amb.auto ? "border-inverse bg-inverse" : "border-ink/30 bg-transparent",
                )}
              >
                <span className={cn("absolute top-[3px] h-4 w-4 rounded-full transition-all duration-300", amb.auto ? "left-[22px] bg-on-inverse" : "left-[3px] bg-ink/45")} />
              </span>
              <span className="text-sm leading-snug">
                <span className="font-semibold">Ambiance automatique</span>
                <span className="block text-muted">Saison et lumière choisies selon votre date et votre heure locales, à chaque visite.</span>
              </span>
            </label>
            <p className="mt-4 text-[0.72rem] leading-relaxed text-muted">Préférence mémorisée sur cet appareil. Les produits et le panier restent identiques.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
