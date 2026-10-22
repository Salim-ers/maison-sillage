"use client";

import { memo, useMemo } from "react";
import type { MaritimeScene } from "@/data/images";
import type { SeasonId } from "@/lib/types";

/* ──────────────────────────────────────────────────────────────
   Calques d'atmosphère posés sur la photographie du hero, dans le
   même repère qu'elle (pourcentages de l'image) :
   - astre : halo du soleil (jour, coucher) ou de la lune (nuit) ;
   - nuit : étoiles qui apparaissent, fenêtres du village et lanternes
     qui s'allument une à une, feu de poupe du navire ;
   - saison : pétales, reflets sur la mer, feuilles, neige.
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

function Particles({ season, scene }: { season: SeasonId; scene: MaritimeScene }) {
  const items = useMemo(() => {
    const r = rng(hash(season + scene.id));
    if (season === "ete") {
      // reflets de lumière dans le sillage de l'astre
      return Array.from({ length: 16 }, (_, i) => {
        const y = scene.horizon + 0.03 + r() * (0.92 - scene.horizon);
        const spread = 0.03 + (y - scene.horizon) * 0.35;
        return {
          key: i,
          className: "reflet",
          style: {
            left: pct(scene.sun.x + (r() - 0.5) * 2 * spread),
            top: pct(y),
            "--s": `${(0.6 + r() * 1.6).toFixed(2)}vw`,
            "--d": `${(2.4 + r() * 3).toFixed(2)}s`,
            "--delay": `${(-r() * 4).toFixed(2)}s`,
          },
        };
      });
    }
    const n = season === "hiver" ? 46 : 18;
    const kind = season === "hiver" ? "particule-neige" : season === "printemps" ? "particule-petale" : "particule-feuille";
    return Array.from({ length: n }, (_, i) => {
      const size = season === "hiver" ? 3 + r() * 6 : 9 + r() * 9;
      const dur = season === "hiver" ? 11 + r() * 12 : 13 + r() * 10;
      return {
        key: i,
        className: `particule ${kind}`,
        style: {
          "--x": pct(r() * 1.05 - 0.02),
          "--s": `${size.toFixed(1)}px`,
          "--d": `${dur.toFixed(1)}s`,
          "--delay": `${(-r() * dur).toFixed(1)}s`,
          "--drift": `${((r() - 0.3) * (season === "hiver" ? 14 : 34)).toFixed(1)}vw`,
          "--rot": `${Math.round((r() - 0.5) * 900)}deg`,
          "--o": (season === "hiver" ? 0.55 + r() * 0.4 : 0.75 + r() * 0.25).toFixed(2),
        },
      };
    });
  }, [season, scene]);
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((p) => (
        <span key={p.key} className={p.className} style={p.style as React.CSSProperties} />
      ))}
    </div>
  );
}

function AtmosphereBase({ scene, season, paused = false }: { scene: MaritimeScene; season: SeasonId; paused?: boolean }) {
  const stars = useMemo(() => {
    const r = rng(hash(scene.id));
    const [x0, x1, y0, y1] = scene.sky;
    return Array.from({ length: 70 }, (_, i) => {
      const v = r();
      return {
      key: i,
      left: pct(x0 + r() * (x1 - x0)),
      // plus d'étoiles en haut du ciel (v^1,5, calcul exact d'un moteur à l'autre)
      top: pct(y0 + v * Math.sqrt(v) * (y1 - y0)),
      s: `${(1 + r() * 1.8).toFixed(1)}px`,
      d: `${(2.6 + r() * 4.4).toFixed(1)}s`,
      delay: `${(-r() * 6).toFixed(1)}s`,
      };
    });
  }, [scene]);

  return (
    <div className="atmo" data-paused={paused ? "" : undefined} aria-hidden>
      <div className="atmo-astre" style={{ left: pct(scene.sun.x), top: pct(scene.sun.y) }} />
      <div className="atmo-etoiles inset-0">
        {stars.map((s) => (
          <span key={s.key} className="etoile" style={{ left: s.left, top: s.top, ["--s" as string]: s.s, ["--d" as string]: s.d, ["--delay" as string]: s.delay }} />
        ))}
      </div>
      {scene.windows.map(([x, y], i) => (
        <span key={i} className="atmo-fenetre" style={{ left: pct(x), top: pct(y), ["--wd" as string]: `${(0.7 + ((i * 7) % 11) * 0.11).toFixed(2)}s` }} />
      ))}
      {scene.lanterns.map((l, i) => (
        <span key={i} className="atmo-feu" style={{ left: pct(l.x), top: pct(l.y), width: pct(l.r * 2), aspectRatio: "1", ["--wd" as string]: "0.5s" }} />
      ))}
      {/* feu de poupe du navire */}
      <span className="atmo-feu" style={{ left: pct(scene.ship.x + 0.012), top: pct(scene.ship.y + 0.045), width: "1.6%", aspectRatio: "1", ["--wd" as string]: "1.1s" }} />
      <Particles season={season} scene={scene} />
    </div>
  );
}

export const Atmosphere = memo(AtmosphereBase);

/** Particules seules, pour une section (pétales, poussière dorée, feuilles, neige) */
export function SeasonDrift({ season, count = 12 }: { season: SeasonId; count?: number }) {
  const items = useMemo(() => {
    const r = rng(hash("drift" + season));
    const kind = season === "hiver" ? "particule-neige" : season === "printemps" ? "particule-petale" : season === "automne" ? "particule-feuille" : "particule-lueur";
    const n = season === "hiver" ? count * 2 : count;
    return Array.from({ length: n }, (_, i) => {
      const size = season === "hiver" ? 3 + r() * 5 : season === "ete" ? 4 + r() * 8 : 8 + r() * 8;
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
          "--o": (0.5 + r() * 0.4).toFixed(2),
        } as React.CSSProperties,
      };
    });
  }, [season, count]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((p) => (
        <span key={p.key} className={p.className} style={p.style} />
      ))}
    </div>
  );
}
