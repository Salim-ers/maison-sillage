import { useId } from "react";
import { svgId } from "@/lib/utils";
import { products } from "@/data/products";
import { BottleArt } from "./Bottle";

/* Accessoires de mise en scène : coffret, compas, cordage, carte pliée.
   Chacun dans son propre viewBox, ancré en bas au centre. */

export type PropId = "compas" | "cordage" | "carte" | "cuillere" | "carnet";

export const PROP_RATIO: Record<PropId | "coffret", number> = {
  compas: 1 / 0.42,
  cordage: 1 / 0.34,
  carte: 1 / 0.36,
  cuillere: 1 / 0.16,
  carnet: 1 / 0.32,
  coffret: 400 / 300,
};

export function CoffretArt({ x = 0, y = 0, height = 300 }: { x?: number; y?: number; height?: number }) {
  const id = svgId(useId());
  const content = products.find((p) => p.slug === "coffret-decouverte")?.contents ?? [];
  const bottles = content.map((slug) => products.find((p) => p.slug === slug)!).filter(Boolean);
  return (
    <svg x={x} y={y} width={height * PROP_RATIO.coffret} height={height} viewBox="0 0 400 300" overflow="visible" aria-hidden>
      <defs>
        <linearGradient id={`box${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4b3020" />
          <stop offset="1" stopColor="#2e1c12" />
        </linearGradient>
        <linearGradient id={`lid${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#3a2416" />
          <stop offset="0.5" stopColor="#5a3a26" />
          <stop offset="1" stopColor="#36210f" />
        </linearGradient>
      </defs>
      {/* couvercle posé en arrière */}
      <g transform="rotate(-5 300 120)">
        <rect x="198" y="14" width="196" height="196" rx="3" fill={`url(#lid${id})`} />
        <rect x="208" y="24" width="176" height="176" fill="none" stroke="#c5a36c" strokeWidth="1" opacity=".7" />
        <image href="/brand/emblem-label-dark.webp" x="306" y="40" width="44" height="52" />
        <text x="328" y="112" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="9" letterSpacing="3" fill="#f3e8d4">
          MAISON SILLAGE
        </text>
        <text x="328" y="130" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="11" fontStyle="italic" fill="#c5a36c">
          Coffret Découverte
        </text>
      </g>
      {/* intérieur */}
      <rect x="20" y="150" width="300" height="20" fill="#24180f" />
      {bottles.map((b, i) => (
        <BottleArt key={b.slug} product={b} nested x={44 + i * 92} y={22} height={180} />
      ))}
      {/* façade */}
      <rect x="14" y="168" width="312" height="122" rx="2" fill={`url(#box${id})`} />
      <rect x="26" y="180" width="288" height="98" fill="none" stroke="#c5a36c" strokeWidth="1" opacity=".75" />
      <rect x="30" y="184" width="280" height="90" fill="none" stroke="#c5a36c" strokeWidth=".5" opacity=".55" />
      <text x="170" y="222" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="12" letterSpacing="5" fill="#f3e8d4">
        TROIS SAISONS
      </text>
      <text x="170" y="246" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="14" fontStyle="italic" fill="#c5a36c">
        L&apos;empreinte d&apos;une saveur
      </text>
      <rect x="14" y="168" width="312" height="6" fill="#000" opacity=".25" />
    </svg>
  );
}

export function PropArt({ id, x = 0, y = 0, height = 100, rotate = 0 }: { id: PropId; x?: number; y?: number; height?: number; rotate?: number }) {
  const uid = svgId(useId());
  const w = height * PROP_RATIO[id];
  const vbW = 100 * PROP_RATIO[id];
  return (
    <svg x={x} y={y} width={w} height={height} viewBox={`0 0 ${vbW} 100`} overflow="visible" aria-hidden>
      <g transform={rotate ? `rotate(${rotate} ${vbW / 2} 50)` : undefined}>
        {id === "compas" && (
          <>
            <defs>
              <radialGradient id={`br${uid}`} cx=".4" cy=".35">
                <stop offset="0" stopColor="#e6c98f" />
                <stop offset=".7" stopColor="#a47b43" />
                <stop offset="1" stopColor="#5e4220" />
              </radialGradient>
            </defs>
            <ellipse cx={vbW / 2} cy="62" rx={vbW / 2 - 2} ry="36" fill={`url(#br${uid})`} />
            <ellipse cx={vbW / 2} cy="56" rx={vbW / 2 - 10} ry="30" fill="#f3e8d4" stroke="#5e4220" strokeWidth="1.2" />
            <ellipse cx={vbW / 2} cy="56" rx={vbW / 2 - 18} ry="24" fill="none" stroke="#a47b43" strokeWidth=".6" />
            {Array.from({ length: 16 }, (_, i) => {
              const a = (i * Math.PI) / 8;
              const r1 = i % 4 === 0 ? 0 : i % 2 === 0 ? 0.55 : 0.75;
              return (
                <line
                  key={i}
                  x1={vbW / 2 + Math.cos(a) * (vbW / 2 - 18) * r1}
                  y1={56 + Math.sin(a) * 24 * r1}
                  x2={vbW / 2 + Math.cos(a) * (vbW / 2 - 18)}
                  y2={56 + Math.sin(a) * 24}
                  stroke="#4b3020"
                  strokeWidth=".6"
                />
              );
            })}
            <path d={`M${vbW / 2} 34 L${vbW / 2 + 5} 56 L${vbW / 2} 78 L${vbW / 2 - 5} 56 Z`} fill="#4b3020" />
            <path d={`M${vbW / 2} 34 L${vbW / 2 + 5} 56 L${vbW / 2 - 5} 56 Z`} fill="#a9692f" />
            <circle cx={vbW / 2} cy="56" r="2.4" fill="#c5a36c" stroke="#4b3020" strokeWidth=".6" />
            <ellipse cx={vbW / 2 - 18} cy="44" rx="16" ry="5" fill="#fff" opacity=".35" />
          </>
        )}
        {id === "cordage" && (
          <g fill="none" strokeLinecap="round">
            {[44, 36, 28, 20, 12].map((r, i) => (
              <ellipse key={r} cx={vbW / 2} cy={62 - i * 2} rx={r * 3} ry={r * 0.95} stroke="#b08a57" strokeWidth="9" />
            ))}
            {[44, 36, 28, 20, 12].map((r, i) => (
              <ellipse key={`t${r}`} cx={vbW / 2} cy={62 - i * 2} rx={r * 3} ry={r * 0.95} stroke="#6e5230" strokeWidth="9" strokeDasharray="2.2 4.2" opacity=".55" />
            ))}
            <path d={`M${vbW / 2 + 130} 64 C${vbW / 2 + 170} 70 ${vbW / 2 + 190} 88 ${vbW / 2 + 230} 92`} stroke="#b08a57" strokeWidth="9" />
          </g>
        )}
        {id === "carte" && (
          <>
            <path d={`M6 70 L${vbW * 0.34} 52 L${vbW * 0.66} 66 L${vbW - 6} 48 L${vbW - 18} 96 L${vbW * 0.64} 98 L${vbW * 0.34} 92 L12 98 Z`} fill="#eadbbd" stroke="#8a6a3a" strokeWidth=".8" />
            <path d={`M${vbW * 0.34} 52 L${vbW * 0.34} 92 M${vbW * 0.66} 66 L${vbW * 0.64} 98`} stroke="#8a6a3a" strokeWidth=".6" opacity=".7" />
            <path d={`M20 84 C60 70 100 90 150 76 S230 66 ${vbW - 30} 72`} fill="none" stroke="#a9692f" strokeWidth="1" strokeDasharray="3 3" />
            <path d={`M30 92 C50 80 70 84 90 74`} fill="none" stroke="#7a5528" strokeWidth=".7" />
            <path d={`M${vbW * 0.34} 52 L${vbW * 0.66} 66 L${vbW * 0.64} 98 L${vbW * 0.34} 92 Z`} fill="#000" opacity=".06" />
          </>
        )}
        {id === "cuillere" && (
          <>
            <ellipse cx="18" cy="74" rx="14" ry="9" fill="#d9bf8f" stroke="#7a5528" strokeWidth=".8" />
            <ellipse cx="18" cy="73" rx="9" ry="5" fill="#c58a36" opacity=".55" />
            <path d={`M30 74 L${vbW - 6} 70`} stroke="#c9a173" strokeWidth="5" strokeLinecap="round" />
            <path d={`M30 74 L${vbW - 6} 70`} stroke="#7a5528" strokeWidth=".6" strokeLinecap="round" opacity=".6" />
          </>
        )}
        {id === "carnet" && (
          <>
            <path d={`M10 64 L${vbW - 30} 50 L${vbW - 8} 82 L32 98 Z`} fill="#4b3020" stroke="#24180f" strokeWidth=".8" />
            <path d={`M14 62 L${vbW - 32} 48 L${vbW - 12} 78 L34 93 Z`} fill="#f3e8d4" />
            <path d={`M20 66 L${vbW - 36} 53 M24 72 L${vbW - 32} 59 M28 78 L${vbW - 50} 66`} stroke="#7a5528" strokeWidth=".5" opacity=".7" />
            <path d={`M${vbW * 0.55} 56 L${vbW * 0.6} 88`} stroke="#a9692f" strokeWidth="1.5" />
          </>
        )}
      </g>
    </svg>
  );
}
