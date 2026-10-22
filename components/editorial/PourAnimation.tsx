"use client";

import { useReducedMotion } from "@/lib/useReduced";
import { useEffect, useId, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { RotateCcw } from "lucide-react";
import type { DrinkLook, Product } from "@/lib/types";
import { svgId } from "@/lib/utils";
import { BottleArt } from "@/components/visuals/Bottle";
import { PouchArt } from "@/components/visuals/Pouch";
import { DrinkArt } from "@/components/visuals/Drink";

/* Le geste : le sirop (ou la poudre) rejoint le verre, la boisson monte.
   Joué une fois à l'entrée dans l'écran, rejouable, figé si mouvement réduit. */
export function PourAnimation({ product, look, bg }: { product: Product; look: DrinkLook; bg: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotion();
  const [run, setRun] = useState(0);
  const id = svgId(useId());
  const play = (inView || run > 0) && !reduce;
  const syrup = product.pack === "bouteille";
  const k = `${run}-${play}`;
  const tilt = useTilt(play, run, syrup);

  // géométrie (viewBox 600 × 520) : verre posé en bas à droite
  const gx = 300;
  const gy = 190;
  const gh = 310;
  const rimY = gy + (look.vessel === "tasse" ? 168 : look.vessel === "coupe" ? 172 : 72) * (gh / 300);
  const bottomY = gy + 286 * (gh / 300);

  return (
    <div ref={ref} className="relative overflow-hidden" style={{ background: bg }}>
      <svg viewBox="0 0 600 520" className="h-auto w-full" role="img" aria-label={`Illustration animée : ${syrup ? "le sirop est versé" : "la préparation est ajoutée"} dans le verre`}>
        <defs>
          <clipPath id={`rise${id}`}>
            <motion.rect
              key={k}
              x="0"
              width="600"
              initial={{ y: reduce ? rimY - 60 : bottomY, height: 600 }}
              animate={play ? { y: rimY - 60 } : undefined}
              transition={{ duration: 2.2, delay: 1.3, ease: [0.4, 0, 0.2, 1] }}
            />
          </clipPath>
        </defs>
        <ellipse cx={gx + 100} cy={bottomY + 12} rx="120" ry="12" fill="#24180f" opacity=".14" />

        {/* verre vide puis boisson qui monte */}
        <DrinkArt look={{ ...look, layers: [{ color: "transparent", height: 0 }], top: undefined, straw: false, garnish: undefined, steam: false, ice: false, bubbles: false }} nested x={gx} y={gy} height={gh} />
        <g clipPath={`url(#rise${id})`}>
          <DrinkArt look={{ ...look, straw: false, garnish: undefined }} nested x={gx} y={gy} height={gh} animate />
        </g>

        {/* filet de sirop ou pluie de poudre */}
        {syrup ? (
          <motion.path
            key={`s${k}`}
            d={`M296 176 C330 176 ${gx + 92} ${rimY - 60} ${gx + 100} ${rimY + 30}`}
            fill="none"
            stroke={product.palette.liquid}
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 0 : 1 }}
            animate={play ? { pathLength: [0, 1, 1], opacity: [1, 1, 0] } : undefined}
            transition={{ duration: 3, delay: 0.7, times: [0, 0.25, 1] }}
          />
        ) : (
          <g>
            {Array.from({ length: 22 }, (_, i) => (
              <motion.circle
                key={`${k}-${i}`}
                cx={gx + 70 + ((i * 17) % 50)}
                r={1.6 + (i % 3) * 0.6}
                fill={product.palette.liquid}
                initial={{ cy: 150, opacity: 0 }}
                animate={play ? { cy: [150, rimY + 10], opacity: [0, 1, 0] } : undefined}
                transition={{ duration: 0.9, delay: 0.9 + (i % 11) * 0.12 + Math.floor(i / 11) * 0.5, ease: "easeIn" }}
              />
            ))}
          </g>
        )}

        {/* le flacon / sachet qui s'incline (rotation autour du goulot, en coordonnées SVG) */}
        <g transform={`translate(${tilt.x} 0) rotate(${tilt.r} ${syrup ? "260 157" : "212 110"})`} opacity={tilt.o}>
          {syrup ? <BottleArt product={product} nested x={210} y={120} height={250} /> : <PouchArt product={product} nested x={150} y={70} height={170} />}
        </g>
      </svg>
      <button
        type="button"
        onClick={() => setRun((r) => r + 1)}
        className="absolute bottom-3 right-3 inline-flex items-center gap-2 bg-creme/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-espresso hover:bg-creme"
      >
        <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.6} /> Rejouer le geste
      </button>
    </div>
  );
}

/** Chronologie du geste, interpolée image par image (rotation exacte autour du goulot) */
function useTilt(play: boolean, run: number, syrup: boolean) {
  const [v, setV] = useState({ r: 0, x: 0, o: 1 });
  useEffect(() => {
    if (!play) return;
    const peak = syrup ? 112 : 62;
    const keys = [
      { t: 0, r: 0, x: -30, o: 0 },
      { t: 0.12, r: 0, x: 0, o: 1 },
      { t: 0.3, r: peak, x: 0, o: 1 },
      { t: 0.78, r: peak, x: 0, o: 1 },
      { t: 1, r: syrup ? 24 : 10, x: 0, o: 1 },
    ];
    const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
    const D = 4200;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / D);
      const i = Math.max(0, keys.findIndex((k, j) => j < keys.length - 1 && t >= k.t && t <= keys[j + 1].t));
      const a = keys[i];
      const b = keys[i + 1] ?? a;
      const u = b.t === a.t ? 1 : ease((t - a.t) / (b.t - a.t));
      setV({ r: a.r + (b.r - a.r) * u, x: a.x + (b.x - a.x) * u, o: a.o + (b.o - a.o) * u });
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, run, syrup]);
  return v;
}
