"use client";

import { useReducedMotion } from "@/lib/useReduced";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Scene } from "@/components/visuals/Scene";
import { scenes } from "@/data/media";
import { RevealTitle, EASE } from "@/components/animations";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "14%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.04, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden md:h-[100svh] md:min-h-[620px] md:max-h-[1000px]" aria-labelledby="hero-titre">
      {/* image : intro lente (léger zoom arrière), puis parallaxe */}
      <motion.div
        className="absolute inset-0 -z-10 hidden md:block"
        style={{ y: imgY }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <motion.div className="h-full w-full" style={{ scale: imgScale }}>
          <Scene config={scenes.heroDesktop} priority className="h-full w-full" />
        </motion.div>
      </motion.div>
      {/* mobile : composition verticale dédiée, le texte prend la suite sous l'image */}
      <motion.div
        className="relative -z-10 h-[64svh] min-h-[420px] overflow-hidden md:hidden"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <Scene config={scenes.heroMobile} priority className="absolute inset-x-0 bottom-0 h-[118%] w-full" />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ivoire to-transparent" aria-hidden />
      </motion.div>
      {/* voile de lisibilité (desktop) */}
      <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-ivoire/80 via-ivoire/25 to-transparent md:block" aria-hidden />

      <motion.div style={{ y: textY, opacity: fade }} className="shell -mt-10 flex flex-col pb-16 md:mt-0 md:h-full md:justify-center md:pb-0 md:pt-24">
        <div className="max-w-[40rem]">
          <motion.p
            className="mention text-bronze-ink"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
          >
            Sirops signatures &amp; préparations gourmandes
          </motion.p>
          <RevealTitle id="hero-titre" as="h1" text="Des saveurs qui laissent une empreinte." immediate delay={0.45} stagger={0.07} className="display mt-5 text-encre" />
          <motion.p
            className="chapo mt-7 text-espresso"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.05 }}
          >
            Des créations singulières pour réinventer vos cafés, lattes et boissons gourmandes. Inspirées par les voyages, pensées pour le plaisir.
          </motion.p>
          <motion.div
            className="mt-9 flex flex-col gap-3 xs:flex-row"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.25 }}
          >
            <Link href="/collections" className="btn btn-encre">
              Découvrir les collections
            </Link>
            <Link href="/maison" className="btn btn-trait bg-creme/40">
              Explorer la Maison
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* légende du visuel + invitation à défiler */}
      <motion.div
        className="absolute bottom-6 right-[var(--gutter)] hidden items-center gap-4 md:flex"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        <Link href="/produits/poire-fondante-vanille-bourbon" className="text-right text-creme drop-shadow-[0_1px_6px_rgba(36,24,15,.5)]">
          <span className="mention block text-creme/85">Création d&apos;automne</span>
          <span className="lien font-serif text-lg italic">Poire fondante &amp; Vanille Bourbon</span>
        </Link>
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute bottom-0 left-1/2 hidden h-16 w-px -translate-x-1/2 overflow-hidden md:block"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="defile block h-full w-full bg-espresso/60" />
      </motion.div>
    </section>
  );
}
