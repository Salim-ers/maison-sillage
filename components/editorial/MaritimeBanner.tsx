"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useAmbiance, useAmbianceAssets } from "@/lib/ambiance";
import { useReducedMotion } from "@/lib/useReduced";
import { storyPhoto } from "@/data/images";
import { AmbientImage } from "@/components/ambiance/AmbientImage";
import { SeasonDrift } from "@/components/ambiance/Atmosphere";

const SIZES = "100vw";

/** Ouverture photographique des pages éditoriales : le voilier de la saison, dans la lumière choisie */
export function MaritimeBanner({ kicker, title, children }: { kicker: string; title: string; children?: React.ReactNode }) {
  const amb = useAmbiance();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const photo = storyPhoto(amb.season);
  useAmbianceAssets((a) => [{ photo: storyPhoto(a.season), sizes: SIZES }]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "18%"]);
  const o = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative isolate h-[78svh] min-h-[520px] overflow-hidden bg-[rgb(var(--a-veil))] text-creme" aria-labelledby="banniere-titre">
      <motion.div className="absolute inset-0" style={{ y }}>
        <AmbientImage photo={photo} sizes={SIZES} preload layerClassName="hero-intro-photo" />
        {!reduce && <SeasonDrift season={amb.season} count={10} />}
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgb(var(--a-veil)/.85),rgb(var(--a-veil)/.2)_55%,rgb(var(--a-veil)/.45))]" aria-hidden />
      <motion.div style={{ opacity: o }} className="shell relative flex h-full flex-col justify-end pb-16 md:pb-20">
        <p className="mention hero-monte text-creme/85" style={{ ["--delay" as string]: "0.3s" }}>
          {kicker}
        </p>
        <h1 id="banniere-titre" className="mt-5 max-w-[15ch] font-serif text-[clamp(2.8rem,6.6vw,6.6rem)] font-light leading-[0.94]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="hero-ligne" style={{ ["--delay" as string]: "0.45s" }}>
              {title}
            </span>
          </span>
        </h1>
        {children && (
          <div className="hero-monte mt-6 max-w-2xl text-[1.08rem] leading-relaxed text-creme/85" style={{ ["--delay" as string]: "0.9s" }}>
            {children}
          </div>
        )}
      </motion.div>
    </section>
  );
}
