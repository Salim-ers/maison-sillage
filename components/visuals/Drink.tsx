import { useId } from "react";
import type { DrinkLook, VesselKind } from "@/lib/types";
import { svgId } from "@/lib/utils";
import { BotanicalInline } from "./Botanical";

/* Boissons — six verres et tasses dessinés pour la Maison.
   viewBox 200 × 300, base à y ≈ 290. */

export const DRINK_RATIO = 200 / 300;

type Geo = {
  outline: string;
  inner: string;
  fillBottom: number;
  fillTop: number;
  rimY: number;
  rimRx: number;
  extra?: "soucoupe" | "anse" | "pied-tulipe" | "pied-coupe";
  porcelain?: boolean;
};

const GEO: Record<VesselKind, Geo> = {
  tasse: {
    outline: "M36 168 C36 242 66 274 100 274 C134 274 164 242 164 168 Z",
    inner: "M40 168 L160 168 L160 170 Z",
    fillBottom: 170,
    fillTop: 168,
    rimY: 168,
    rimRx: 64,
    extra: "soucoupe",
    porcelain: true,
  },
  "verre-haut": {
    outline: "M50 72 L150 72 L141 280 Q140 290 130 290 L70 290 Q60 290 59 280 Z",
    inner: "M54 74 L146 74 L137.5 279 Q136.5 286 129 286 L71 286 Q63.5 286 62.5 279 Z",
    fillBottom: 286,
    fillTop: 96,
    rimY: 72,
    rimRx: 50,
  },
  "mug-verre": {
    outline: "M54 112 L146 112 L139 268 Q138 282 124 282 L76 282 Q62 282 61 268 Z",
    inner: "M58 114 L142 114 L135.5 267 Q134.5 278 123 278 L77 278 Q65.5 278 64.5 267 Z",
    fillBottom: 278,
    fillTop: 128,
    rimY: 112,
    rimRx: 46,
    extra: "anse",
  },
  tulipe: {
    outline: "M46 64 C46 148 74 196 92 210 L108 210 C126 196 154 148 154 64 Z",
    inner: "M50 66 C50 146 77 192 93 206 L107 206 C123 192 150 146 150 66 Z",
    fillBottom: 206,
    fillTop: 80,
    rimY: 64,
    rimRx: 54,
    extra: "pied-tulipe",
  },
  highball: {
    outline: "M62 48 L138 48 L133 282 Q132 290 124 290 L76 290 Q68 290 67 282 Z",
    inner: "M66 50 L134 50 L129.5 281 Q128.7 286 123 286 L77 286 Q71.3 286 70.5 281 Z",
    fillBottom: 286,
    fillTop: 66,
    rimY: 48,
    rimRx: 38,
  },
  coupe: {
    outline: "M34 172 C34 230 66 252 100 252 C134 252 166 230 166 172 Z",
    inner: "M38 174 C38 228 68 248 100 248 C132 248 162 228 162 174 Z",
    fillBottom: 248,
    fillTop: 214,
    rimY: 172,
    rimRx: 66,
    extra: "pied-coupe",
  },
};

export function DrinkArt({
  look,
  x = 0,
  y = 0,
  height = 300,
  nested = false,
  title,
  className,
  animate = false,
}: {
  look: DrinkLook;
  x?: number;
  y?: number;
  height?: number;
  nested?: boolean;
  title?: string;
  className?: string;
  animate?: boolean;
}) {
  const id = svgId(useId());
  const g = GEO[look.vessel];
  const span = g.fillBottom - g.fillTop;
  let cursor = g.fillBottom;
  const layerRects = look.layers.map((l, i) => {
    const h = span * l.height;
    cursor -= h;
    return { ...l, y: cursor, h, i };
  });
  const liquidTop = Math.max(cursor, g.fillTop);
  const topLayer = look.layers[look.layers.length - 1]?.color ?? "#c79a62";

  const content = (
    <>
      <defs>
        <clipPath id={`in${id}`}>
          <path d={g.inner} />
        </clipPath>
        <linearGradient id={`gls${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.32" />
          <stop offset="0.18" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="0.75" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id={`sh${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#24180f" stopOpacity="0.22" />
          <stop offset="0.3" stopColor="#24180f" stopOpacity="0" />
          <stop offset="0.7" stopColor="#24180f" stopOpacity="0" />
          <stop offset="1" stopColor="#24180f" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id={`por${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#d9ccb2" />
          <stop offset="0.3" stopColor="#fbf6ec" />
          <stop offset="0.65" stopColor="#f3ead8" />
          <stop offset="1" stopColor="#c7b796" />
        </linearGradient>
        <radialGradient id={`foam${id}`}>
          <stop offset="0" stopColor={look.topColor ?? "#f3e3c8"} />
          <stop offset="0.75" stopColor={look.topColor ?? "#f3e3c8"} />
          <stop offset="1" stopColor={topLayer} />
        </radialGradient>
      </defs>

      {/* pieds, soucoupe, anse (derrière) */}
      {g.extra === "soucoupe" && (
        <>
          <ellipse cx="100" cy="280" rx="92" ry="15" fill={`url(#por${id})`} stroke="#3a2616" strokeOpacity=".3" strokeWidth=".8" />
          <ellipse cx="100" cy="278" rx="62" ry="9" fill="#e6dac2" />
          <ellipse cx="100" cy="280" rx="88" ry="12.5" fill="none" stroke="#a47b43" strokeWidth=".8" opacity=".8" />
          <path d="M160 190 C188 188 192 228 160 236" fill="none" stroke={`url(#por${id})`} strokeWidth="9" strokeLinecap="round" />
          <path d="M160 190 C188 188 192 228 160 236" fill="none" stroke="#3a2616" strokeOpacity=".25" strokeWidth="1" />
        </>
      )}
      {g.extra === "anse" && (
        <path d="M144 142 C180 140 182 222 140 226" fill="none" stroke="#f3eadb" strokeOpacity=".55" strokeWidth="9" strokeLinecap="round" />
      )}
      {g.extra === "pied-tulipe" && (
        <>
          <path d="M93 208 L93 262 L107 262 L107 208 Z" fill="#fff" fillOpacity=".25" stroke="#3a2616" strokeOpacity=".3" strokeWidth=".7" />
          <ellipse cx="100" cy="270" rx="42" ry="9" fill="#fff" fillOpacity=".3" stroke="#3a2616" strokeOpacity=".35" strokeWidth=".8" />
          <path d="M93 260 Q100 266 107 260" stroke="#fff" strokeOpacity=".6" fill="none" />
        </>
      )}
      {g.extra === "pied-coupe" && (
        <>
          <path d="M94 250 L94 278 L106 278 L106 250 Z" fill="#fff" fillOpacity=".25" stroke="#3a2616" strokeOpacity=".3" strokeWidth=".7" />
          <ellipse cx="100" cy="284" rx="40" ry="8" fill="#fff" fillOpacity=".3" stroke="#3a2616" strokeOpacity=".35" strokeWidth=".8" />
        </>
      )}

      {g.porcelain ? (
        <>
          <path d={g.outline} fill={`url(#por${id})`} stroke="#3a2616" strokeOpacity=".3" strokeWidth=".9" />
          <path d="M40 186 C44 230 70 262 100 266" stroke="#a47b43" strokeWidth=".8" fill="none" opacity=".55" />
          <ellipse cx="100" cy={g.rimY} rx={g.rimRx} ry="15" fill="#f8f2e6" stroke="#3a2616" strokeOpacity=".3" strokeWidth=".8" />
          <ellipse cx="100" cy={g.rimY + 1} rx={g.rimRx - 5} ry="12" fill={topLayer} />
          <ellipse cx="100" cy={g.rimY + 1.5} rx={g.rimRx - 13} ry="9" fill={`url(#foam${id})`} />
          {/* rosette au lait */}
          <g fill="none" stroke={topLayer} strokeWidth="1.6" strokeLinecap="round" opacity=".9">
            <path d={`M100 ${g.rimY - 5} C92 ${g.rimY - 4} 92 ${g.rimY + 4} 100 ${g.rimY + 7} C108 ${g.rimY + 4} 108 ${g.rimY - 4} 100 ${g.rimY - 5} Z`} />
            <path d={`M88 ${g.rimY + 1} Q100 ${g.rimY + 6} 112 ${g.rimY + 1}`} />
            <path d={`M84 ${g.rimY - 1} Q100 ${g.rimY + 10} 116 ${g.rimY - 1}`} />
            <path d={`M100 ${g.rimY - 7} L100 ${g.rimY + 8}`} />
          </g>
          {look.dust && <circle cx="94" cy={g.rimY - 2} r="1" fill={look.dust} opacity=".7" />}
        </>
      ) : (
        <>
          {/* contenu */}
          <g clipPath={`url(#in${id})`}>
            {layerRects.map((l) => (
              <rect key={l.i} x="0" y={l.y} width="200" height={l.h + 2} fill={l.color} />
            ))}
            {layerRects.slice(1).map((l) => (
              <rect key={`b${l.i}`} x="0" y={l.y + l.h - 3} width="200" height="6" fill={l.color} opacity=".5" />
            ))}
            {look.bubbles &&
              Array.from({ length: 16 }, (_, i) => (
                <circle
                  key={i}
                  className={animate ? "bulle" : undefined}
                  style={animate ? { animationDelay: `${(i * 0.37) % 3}s` } : undefined}
                  cx={74 + ((i * 37) % 52)}
                  cy={liquidTop + 20 + ((i * 53) % Math.max(20, g.fillBottom - liquidTop - 30))}
                  r={0.9 + (i % 3) * 0.5}
                  fill="#fff"
                  opacity=".7"
                />
              ))}
            {look.ice &&
              [
                [66, liquidTop - 6, 26, -12],
                [96, liquidTop + 6, 28, 16],
                [118, liquidTop - 2, 24, 30],
                [78, liquidTop + 34, 24, 8],
                [110, liquidTop + 40, 22, -20],
              ].map(([cx, cy, s, r], i) => (
                <rect
                  key={i}
                  x={cx}
                  y={cy}
                  width={s}
                  height={s}
                  rx="5"
                  transform={`rotate(${r} ${cx + s / 2} ${cy + s / 2})`}
                  fill="#fff"
                  fillOpacity=".34"
                  stroke="#fff"
                  strokeOpacity=".75"
                  strokeWidth="1"
                />
              ))}
            <rect width="200" height="300" fill={`url(#sh${id})`} />
          </g>
          {/* surface du liquide */}
          {look.top !== "chantilly" && look.top !== "boule" && (
            <ellipse cx="100" cy={liquidTop} rx={g.rimRx - 6} ry="4" fill={topLayer} stroke="#fff" strokeOpacity=".35" strokeWidth=".6" />
          )}
          {/* verre */}
          <path d={g.outline} fill={`url(#gls${id})`} stroke="#3a2616" strokeOpacity=".38" strokeWidth=".9" />
          <ellipse cx="100" cy={g.rimY} rx={g.rimRx} ry="5" fill="none" stroke="#3a2616" strokeOpacity=".35" strokeWidth=".8" />
          <ellipse cx="100" cy={g.rimY} rx={g.rimRx} ry="5" fill="#fff" fillOpacity=".12" />
          <path d={`M${100 - g.rimRx + 8} ${g.rimY + 14} L${100 - g.rimRx + 15} ${g.fillBottom - 20}`} stroke="#fff" strokeOpacity=".55" strokeWidth="4" strokeLinecap="round" />
          <path d={`M${100 + g.rimRx - 12} ${g.rimY + 24} L${100 + g.rimRx - 16} ${g.fillBottom - 40}`} stroke="#fff" strokeOpacity=".3" strokeWidth="2" strokeLinecap="round" />
          {look.vessel === "verre-haut" && (
            <ellipse cx="100" cy="284" rx="40" ry="4" fill="#fff" fillOpacity=".25" />
          )}
        </>
      )}

      {/* chantilly / boule */}
      {look.top === "chantilly" && (
        <g>
          <path
            d={`M${100 - g.rimRx + 4} ${g.rimY + 4} C${100 - g.rimRx} ${g.rimY - 18} ${100 - g.rimRx * 0.5} ${g.rimY - 22} ${100 - g.rimRx * 0.35} ${g.rimY - 24} C${100 - g.rimRx * 0.3} ${g.rimY - 40} ${100 + g.rimRx * 0.25} ${g.rimY - 44} ${100 + g.rimRx * 0.2} ${g.rimY - 26} C${100 + g.rimRx * 0.6} ${g.rimY - 26} ${100 + g.rimRx} ${g.rimY - 16} ${100 + g.rimRx - 4} ${g.rimY + 4} Z`}
            fill={look.topColor ?? "#fbf3e4"}
            stroke="#3a2616"
            strokeOpacity=".28"
            strokeWidth=".8"
          />
          <path d={`M${100 - g.rimRx * 0.5} ${g.rimY - 10} Q100 ${g.rimY - 22} ${100 + g.rimRx * 0.5} ${g.rimY - 10}`} stroke="#d9c7a8" strokeWidth="1" fill="none" />
          <path d={`M${100 - g.rimRx * 0.2} ${g.rimY - 26} Q100 ${g.rimY - 34} ${100 + g.rimRx * 0.15} ${g.rimY - 27}`} stroke="#d9c7a8" strokeWidth=".8" fill="none" />
          {look.dust &&
            Array.from({ length: 12 }, (_, i) => (
              <circle key={i} cx={100 - g.rimRx * 0.5 + ((i * 29) % (g.rimRx * 1.0))} cy={g.rimY - 14 - ((i * 13) % 18)} r={0.9 + (i % 2) * 0.6} fill={look.dust} opacity=".85" />
            ))}
        </g>
      )}
      {look.top === "boule" && (
        <g>
          <circle cx="100" cy={g.rimY - 8} r="36" fill={look.topColor ?? "#f4e6cc"} stroke="#3a2616" strokeOpacity=".28" strokeWidth=".8" />
          <path d="M70 166 C76 154 92 148 104 150" stroke="#fff" strokeOpacity=".6" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d={`M88 ${g.rimY - 38} C84 ${g.rimY - 20} 96 ${g.rimY - 12} 92 ${g.rimY + 6} M112 ${g.rimY - 36} C116 ${g.rimY - 14} 108 ${g.rimY - 6} 114 ${g.rimY + 8}`} stroke={topLayer} strokeWidth="5" strokeLinecap="round" fill="none" opacity=".85" />
          <ellipse cx="100" cy={g.rimY + 28} rx="56" ry="8" fill={topLayer} opacity=".9" />
        </g>
      )}

      {look.straw && (
        <g>
          <rect x="118" y={g.rimY - 70} width="7" height={g.fillBottom - g.rimY + 40} rx="3.5" transform={`rotate(12 121 ${g.rimY})`} fill="#f3e8d4" stroke="#3a2616" strokeOpacity=".35" strokeWidth=".6" />
          <rect x="118" y={g.rimY - 70} width="7" height="18" rx="3.5" transform={`rotate(12 121 ${g.rimY})`} fill="#a47b43" opacity=".55" />
        </g>
      )}
      {look.steam && (
        <g fill="none" stroke="#fff9ef" strokeWidth="2.4" strokeLinecap="round" opacity=".75">
          <path className={animate ? "vapeur" : undefined} d={`M88 ${g.rimY - 14} C78 ${g.rimY - 34} 98 ${g.rimY - 48} 88 ${g.rimY - 70}`} />
          <path className={animate ? "vapeur vapeur-2" : undefined} d={`M108 ${g.rimY - 18} C100 ${g.rimY - 40} 120 ${g.rimY - 56} 110 ${g.rimY - 84}`} />
        </g>
      )}
      {look.garnish && (
        <BotanicalInline
          id={look.garnish}
          x={look.vessel === "tasse" ? 150 : look.vessel === "coupe" ? 140 : 122}
          y={look.vessel === "tasse" ? 236 : look.vessel === "coupe" ? 240 : g.rimY - 34}
          size={look.vessel === "tasse" || look.vessel === "coupe" ? 52 : 46}
        />
      )}
    </>
  );

  if (nested) {
    const w = height * DRINK_RATIO;
    return (
      <svg x={x} y={y} width={w} height={height} viewBox="0 0 200 300" overflow="visible" aria-hidden>
        {content}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 300" className={className} role="img" aria-label={title ?? "Boisson"} overflow="visible">
      {content}
    </svg>
  );
}
