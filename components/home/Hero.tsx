"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/lib/useReduced";
import { useAmbiance, useAmbianceAssets } from "@/lib/ambiance";
import { HERO_FOCUS, HERO_PRODUCTS, heroPhotos } from "@/data/images";
import { lights } from "@/data/collections";
import { getProduct } from "@/data/products";
import { AmbientImage } from "@/components/ambiance/AmbientImage";
import { SeasonDrift } from "@/components/ambiance/Atmosphere";

// bureau : photographie 16:9 plein écran ; mobile : prise verticale 3:4 sur le haut de l'écran
const SIZES = "(max-aspect-ratio: 16/9) 178vh, 100vw";
const MOBILE_SIZES = "100vw";
const LINES = ["Des saveurs", "qui traversent", "le temps."];
/** composition grand écran (photographie 16:9) ; en dessous ou en portrait : photographie verticale */
const WIDE = "(min-width: 1024px) and (orientation: landscape)";

/**
 * Hero cinématographique : un grand voilier au large et, au premier plan,
 * la création de la saison (sirop, poudre, boisson) — on comprend d'un regard
 * ce que fait la Maison. Entrée en CSS pur (visible dès le premier rendu) ;
 * au défilement, la photographie gagne en profondeur, le texte s'efface et la
 * section suivante vient recouvrir le hero, qui reste épinglé derrière elle.
 */
export function Hero() {
  const amb = useAmbiance();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // une seule scène, celle d'été, dans les trois lumières : les particules suivent la saison choisie
  const { desktop, mobile } = heroPhotos(amb.light);
  const focus = HERO_FOCUS;
  useAmbianceAssets((a) => {
    const p = heroPhotos(a.light);
    const small = typeof window !== "undefined" && !window.matchMedia(WIDE).matches;
    return [small && p.mobile ? { photo: p.mobile, sizes: MOBILE_SIZES, quality: 85 } : { photo: p.desktop, sizes: SIZES, quality: 85 }];
  });

  const [vh, setVh] = useState(900);
  useEffect(() => {
    const set = () => setVh(window.innerHeight);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);
  const { scrollY } = useScroll();
  const p = useTransform(scrollY, [0, vh], [0, 1], { clamp: true });
  const stageScale = useTransform(p, [0, 1], reduce ? [1, 1] : [1, 1.12]);
  const stageY = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["0%", "6%"]);
  const textY = useTransform(p, [0, 1], reduce ? [0, 0] : [0, -110]);
  const textO = useTransform(p, [0, 0.5], [1, 0]);
  const shade = useTransform(p, [0, 1], [0, 0.6]);
  const [paused, setPaused] = useState(false);
  useMotionValueEvent(p, "change", (v) => setPaused(v > 0.97));

  const light = lights.find((l) => l.id === amb.light)!;
  // la création nommée est celle qui figure sur la photographie
  const product = getProduct(HERO_PRODUCTS.sirop)!;

  return (
    <section ref={ref} className="sticky top-0 isolate h-[100svh] min-h-[600px] overflow-hidden bg-[rgb(var(--a-veil))] text-creme" aria-labelledby="hero-titre">
      <motion.div
        className="absolute inset-x-0 top-0 h-[47svh] origin-top will-change-transform [--focus:50%_44%] paysage:h-auto paysage:bottom-0 paysage:origin-center paysage:[--focus:var(--focus-d)]"
        style={{ scale: stageScale, y: stageY, ["--focus-d" as string]: `${focus.x * 100}% ${focus.y * 100}%` }}
      >
        <AmbientImage photo={desktop} mobile={mobile} sizes={SIZES} mobileSizes={MOBILE_SIZES} preload quality={85} layerClassName="hero-intro-photo" />
        {!reduce && <SeasonDrift season={amb.season} count={14} paused={paused} />}
      </motion.div>

      {/* voiles de lisibilité : en-tête, côté du texte (bureau), bas de l'image (mobile) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-x-0 top-0 h-[24%] bg-[linear-gradient(180deg,rgb(var(--a-veil)/.62),transparent)]" />
        <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_58%_64%_at_0%_100%,rgb(var(--a-veil)/.86)_0%,rgb(var(--a-veil)/.62)_45%,transparent_80%)] paysage:block" />
        <div className="absolute inset-x-0 bottom-0 hidden h-[34%] bg-[linear-gradient(0deg,rgb(var(--a-veil)/.55),transparent)] paysage:block" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(var(--a-veil))_0%,rgb(var(--a-veil))_53.5%,rgb(var(--a-veil)/.6)_56%,transparent_62%)] paysage:hidden" />
      </div>
      <motion.div className="pointer-events-none absolute inset-0 bg-[rgb(var(--a-veil))]" style={{ opacity: shade }} aria-hidden />

      <motion.div style={{ y: textY, opacity: textO }} className="relative z-10 flex h-full flex-col justify-end pb-[5.5rem] paysage:pb-[8.5svh]">
        <div className="shell">
          <div className="max-w-[40rem] paysage:w-[48%] xl:w-[42%] 2xl:w-[38%]">
            <p className="mention hero-monte flex items-center gap-3 text-creme/90" style={{ ["--delay" as string]: "0.35s" }}>
              <svg viewBox="0 0 40 10" className="h-2.5 w-9 shrink-0 text-or" aria-hidden>
                <path d="M0 5 C6 1 10 9 16 5 S28 1 40 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              Maison Sillage — Sirops, poudres &amp; créations gourmandes
            </p>
            <h1 id="hero-titre" className="mt-3 font-serif text-[clamp(2.55rem,7vw,4.6rem)] font-light paysage:text-[clamp(2.8rem,4.6vw,5.6rem)] leading-[0.92] tracking-[-0.025em] [text-shadow:0_2px_30px_rgb(0_0_0/0.3)] paysage:mt-5">
              {/* le titre n'existe qu'une fois : chaque ligne porte son espace final, rien n'est dupliqué */}
              {LINES.map((l, i) => (
                <span key={l} className="block overflow-hidden pb-[0.08em]">
                  <span className={`hero-ligne ${i === 2 ? "italic" : ""}`} style={{ ["--delay" as string]: `${0.55 + i * 0.13}s` }}>
                    {l}
                    {i < LINES.length - 1 ? " " : ""}
                  </span>
                </span>
              ))}
            </h1>
            <p className="hero-monte mt-3.5 max-w-[31rem] text-[0.95rem] leading-relaxed text-creme/90 paysage:mt-5 paysage:text-[1.04rem]" style={{ ["--delay" as string]: "1.05s" }}>
              « Inspirée par les grands voyages, Maison Sillage imagine des créations gourmandes pour sublimer cafés, lattes et boissons d&apos;exception. »
            </p>
            <div className="hero-monte mt-5 flex flex-col gap-2.5 xs:flex-row xs:flex-wrap paysage:mt-7 paysage:gap-3 [&>a]:whitespace-nowrap" style={{ ["--delay" as string]: "1.25s" }}>
              <Link href="/boutique" className="btn btn-clair">
                Découvrir la boutique
              </Link>
              <Link href="/maison" className="btn btn-verre min-h-11 paysage:min-h-[3.25rem]">
                Découvrir notre histoire
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* la création à l'image, et l'invitation à défiler */}
      <motion.div style={{ opacity: textO }} className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
        <div className="shell flex items-end justify-between pb-4 paysage:pb-6">
          <span className="hidden w-48 paysage:block" aria-hidden />
          <div className="hero-monte mx-auto hidden flex-col items-center gap-3 sm:flex paysage:absolute paysage:left-1/2 paysage:-translate-x-1/2 paysage:hidden 2xl:paysage:flex" style={{ ["--delay" as string]: "1.7s" }}>
            <span className="mention text-[0.62rem] text-creme/80">Défiler pour explorer</span>
            <span className="relative block h-8 w-px overflow-hidden bg-creme/20 paysage:h-12" aria-hidden>
              <span className="defile absolute inset-0 bg-creme" />
            </span>
          </div>
          <Link
            href={`/produits/${product.slug}`}
            className="hero-monte pointer-events-auto hidden text-right text-creme [text-shadow:0_1px_12px_rgb(0_0_0/0.45)] paysage:block"
            style={{ ["--delay" as string]: "1.6s" }}
            aria-live="polite"
          >
            <span className="mention block text-creme/80">
              Escale d&apos;été · {light.name.toLowerCase()}
            </span>
            <span className="lien mt-1 inline-block font-serif text-[1.15rem] italic">{product.name}</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
