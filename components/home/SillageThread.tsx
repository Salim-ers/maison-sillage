"use client";

import { useReducedMotion } from "@/lib/useReduced";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";

/* Le fil conducteur de l'accueil : un sillage qui se trace dans la marge au fil du défilement */
export function SillageThread({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end 0.9"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 });
  const d = Array.from({ length: 24 }, (_, i) => {
    const y = i * 100;
    const x = i % 2 ? 26 : 10;
    return i === 0 ? `M18 0` : `S${x} ${y - 50} 18 ${y}`;
  }).join(" ");
  return (
    <div ref={ref} className="relative">
      {!reduce && (
        <svg aria-hidden className="pointer-events-none absolute left-[max(0.4rem,calc(var(--gutter)/2-18px))] top-0 z-10 hidden h-full w-9 text-bronze xl:block" viewBox="0 0 36 2300" preserveAspectRatio="none">
          <path d={d} fill="none" stroke="currentColor" strokeOpacity=".18" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <motion.path d={d} fill="none" stroke="currentColor" strokeWidth="1.4" vectorEffect="non-scaling-stroke" style={{ pathLength: progress }} />
        </svg>
      )}
      {children}
    </div>
  );
}
