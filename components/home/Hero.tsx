"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/lib/useReduced";
import { useAmbiance, useAmbianceAssets } from "@/lib/ambiance";
import { heroPhoto } from "@/data/images";
import { lights, seasons } from "@/data/collections";
import { AmbientImage } from "@/components/ambiance/AmbientImage";
import { Atmosphere } from "@/components/ambiance/Atmosphere";

// mobile : l'image occupe 60 % de la hauteur, au format 16:9 → ≈ 107vh de large
const SIZES = "(max-width: 767px) 107vh, (max-aspect-ratio: 16/9) 178vh, 100vw";
const LINES = ["Des saveurs", "qui traversent", "le temps."];

/**
 * Hero cinématographique : un grand voilier, la mer, la lumière de
 * l'ambiance choisie. Entrée en CSS pur (visible dès le premier rendu,
 * sans attendre l'hydratation) ; au défilement, la photographie gagne
 * en profondeur, le texte s'efface et la section suivante vient
 * recouvrir le hero (il reste épinglé derrière elle).
 */
export function Hero() {
  const amb = useAmbiance();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const hero = heroPhoto(amb.season, amb.light);
  const scene = hero.scene;
  useAmbianceAssets((a) => [{ photo: heroPhoto(a.season, a.light), sizes: SIZES, quality: 85 }]);

  const [vh, setVh] = useState(900);
  useEffect(() => {
    const set = () => setVh(window.innerHeight);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);
  const { scrollY } = useScroll();
  const p = useTransform(scrollY, [0, vh], [0, 1], { clamp: true });
  const stageScale = useTransform(p, [0, 1], reduce ? [1, 1] : [1, 1.14]);
  const stageY = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["0%", "7%"]);
  const textY = useTransform(p, [0, 1], reduce ? [0, 0] : [0, -110]);
  const textO = useTransform(p, [0, 0.5], [1, 0]);
  const shade = useTransform(p, [0, 1], [0, 0.6]);
  const [paused, setPaused] = useState(false);
  useMotionValueEvent(p, "change", (v) => setPaused(v > 0.97));

  const season = seasons.find((s) => s.id === amb.season)!;
  const light = lights.find((l) => l.id === amb.light)!;

  return (
    <section ref={ref} className="sticky top-0 isolate h-[100svh] min-h-[560px] overflow-hidden bg-[rgb(var(--a-veil))] text-creme" aria-labelledby="hero-titre">
      {/* photographie + atmosphère, dans un même repère cadré sur le navire.
          Mobile : composition verticale — l'image occupe le haut, le texte se pose dessous */}
      <motion.div className="absolute inset-x-0 top-0 bottom-[40%] origin-top will-change-transform md:bottom-0 md:origin-center" style={{ scale: stageScale, y: stageY }}>
        <div className="cover-frame">
          <div className="cover-stage" style={{ ["--cx" as string]: scene.ship.x, ["--cy" as string]: scene.ship.y }}>
            <AmbientImage photo={hero} sizes={SIZES} preload quality={85} layerClassName="hero-intro-photo" />
            <Atmosphere scene={scene} season={amb.season} paused={paused || reduce} />
          </div>
        </div>
      </motion.div>

      {/* voiles de lisibilité : haut (en-tête), côté du texte, bas */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-x-0 top-0 h-[28%] bg-[linear-gradient(180deg,rgb(var(--a-veil)/.55),transparent)]" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(270deg,rgb(var(--a-veil)/.7)_0%,rgb(var(--a-veil)/.42)_30%,transparent_60%)] md:block" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(var(--a-veil))_0%,rgb(var(--a-veil))_40%,rgb(var(--a-veil)/.7)_47%,rgb(var(--a-veil)/.15)_62%,transparent_72%)] md:inset-x-0 md:top-auto md:h-[45%] md:bg-[linear-gradient(0deg,rgb(var(--a-veil)/.6),transparent)]" />
      </div>
      <motion.div className="pointer-events-none absolute inset-0 bg-[rgb(var(--a-veil))]" style={{ opacity: shade }} aria-hidden />

      <motion.div style={{ y: textY, opacity: textO }} className="relative z-10 flex h-full flex-col justify-end pb-[6.75rem] md:pb-[15svh]">
        <div className="shell">
          <div className="md:ml-auto md:w-[74%] lg:w-[50%] xl:w-[47%]">
            <p className="mention hero-monte flex items-center gap-3 text-creme/90" style={{ ["--delay" as string]: "0.35s" }}>
              <svg viewBox="0 0 40 10" className="h-2.5 w-9 text-or" aria-hidden>
                <path d="M0 5 C6 1 10 9 16 5 S28 1 40 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              Maison Sillage — Sirops &amp; créations gourmandes
            </p>
            <h1 id="hero-titre" className="mt-4 font-serif text-[clamp(2.7rem,7vw,7.6rem)] font-light md:mt-5 leading-[0.92] tracking-[-0.025em] [text-shadow:0_2px_30px_rgb(0_0_0/0.25)]">
              <span className="sr-only">Des saveurs qui traversent le temps.</span>
              {LINES.map((l, i) => (
                <span key={l} aria-hidden className="block overflow-hidden pb-[0.08em]">
                  <span className={`hero-ligne ${i === 2 ? "italic" : ""}`} style={{ ["--delay" as string]: `${0.55 + i * 0.13}s` }}>
                    {l}
                  </span>
                </span>
              ))}
            </h1>
            <p className="hero-monte mt-4 max-w-[34rem] text-[0.98rem] leading-relaxed text-creme/88 md:mt-6 md:text-[1.1rem]" style={{ ["--delay" as string]: "1.05s" }}>
              « Inspirée par les grands voyages, Maison Sillage imagine des créations gourmandes pour sublimer cafés, lattes et boissons d&apos;exception. »
            </p>
            <div className="hero-monte mt-6 flex flex-col gap-2.5 xs:flex-row md:mt-8 md:gap-3" style={{ ["--delay" as string]: "1.25s" }}>
              <Link href="#creations" className="btn btn-clair">
                Explorer nos créations
              </Link>
              <Link href="/maison" className="btn btn-verre">
                Découvrir notre histoire
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* escale en cours et invitation à défiler */}
      <motion.div style={{ opacity: textO }} className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
        <div className="shell flex items-end justify-between pb-4 md:pb-6">
          <p className="hero-monte hidden items-center gap-3 text-creme/80 md:flex" style={{ ["--delay" as string]: "1.6s" }} aria-live="polite">
            <span className="h-px w-8 bg-creme/50" aria-hidden />
            <span className="font-serif text-[1.05rem] italic">
              Escale {season.id === "ete" ? "d'été" : season.id === "automne" ? "d'automne" : season.id === "hiver" ? "d'hiver" : "de printemps"} · {light.name.toLowerCase()}
            </span>
          </p>
          <div className="hero-monte mx-auto flex flex-col items-center gap-3 md:mx-0 md:absolute md:left-1/2 md:-translate-x-1/2" style={{ ["--delay" as string]: "1.7s" }}>
            <span className="mention text-[0.62rem] text-creme/80">Défiler pour explorer</span>
            <span className="relative block h-8 w-px overflow-hidden bg-creme/20 md:h-12" aria-hidden>
              <span className="defile absolute inset-0 bg-creme" />
            </span>
          </div>
          <span className="hidden w-40 md:block" aria-hidden />
        </div>
      </motion.div>
    </section>
  );
}
