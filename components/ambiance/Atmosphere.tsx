"use client";

import { memo, useMemo } from "react";
import type { SeasonId } from "@/lib/types";

/* ──────────────────────────────────────────────────────────────
   Particules de saison posées sur une photographie : pétales au
   printemps, lueurs dorées en été, feuilles en automne, neige en hiver.
   La lumière (étoiles, fenêtres éclairées, lanternes) appartient aux
   photographies elles-mêmes : ce calque n'ajoute que le mouvement.
   Tout est en CSS (transform / opacity) : aucun calcul par image.
   ────────────────────────────────────────────────────────────── */

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hash = (s: string) => Array.from(s).reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);
const pct = (n: number) => `${(n * 100).toFixed(2)}%`;

function SeasonDriftBase({ season, count = 12, paused = false }: { season: SeasonId; count?: number; paused?: boolean }) {
  const items = useMemo(() => {
    const r = rng(hash("drift" + season));
    const kind = season === "hiver" ? "particule-neige" : season === "printemps" ? "particule-petale" : season === "automne" ? "particule-feuille" : "particule-lueur";
    const n = season === "hiver" ? count * 2 : count;
    return Array.from({ length: n }, (_, i) => {
      const size = season === "hiver" ? 3 + r() * 5 : season === "ete" ? 4 + r() * 7 : 8 + r() * 8;
      const dur = 14 + r() * 12;
      return {
        key: i,
        className: `particule ${kind}`,
        style: {
          "--x": pct(r()),
          "--s": `${size.toFixed(1)}px`,
          "--d": `${dur.toFixed(1)}s`,
          "--delay": `${(-r() * dur).toFixed(1)}s`,
          "--drift": `${((r() - 0.4) * 30).toFixed(1)}vw`,
          "--rot": `${Math.round((r() - 0.5) * 800)}deg`,
          "--o": (0.45 + r() * 0.4).toFixed(2),
        } as React.CSSProperties,
      };
    });
  }, [season, count]);
  return (
    <div className="atmo overflow-hidden" data-paused={paused ? "" : undefined} aria-hidden>
      {items.map((p) => (
        <span key={p.key} className={p.className} style={p.style} />
      ))}
    </div>
  );
}

export const SeasonDrift = memo(SeasonDriftBase);
