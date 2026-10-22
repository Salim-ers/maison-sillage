import type { BotanicalId } from "@/lib/types";
import { EngravedSvg, Part, Strokes, INK } from "./engraving";

/* Planches botaniques gravées — une par matière aromatique.
   viewBox 100 × 100, ancrées en bas au centre. */

type Ids = Parameters<Parameters<typeof EngravedSvg>[0]["children"]>[0];

const LEAF = "#7d8a52";
const LEAF_DARK = "#5f6d3c";

function leaf(x: number, y: number, len: number, angle: number, w = 0.32) {
  // feuille lancéolée orientée selon angle (deg), base en (x,y)
  const r = (angle * Math.PI) / 180;
  const ex = x + Math.cos(r) * len;
  const ey = y + Math.sin(r) * len;
  const nx = -Math.sin(r) * len * w;
  const ny = Math.cos(r) * len * w;
  const mx = (x + ex) / 2;
  const my = (y + ey) / 2;
  const d = `M${x} ${y} Q${(mx + nx).toFixed(1)} ${(my + ny).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)} Q${(mx - nx).toFixed(1)} ${(my - ny).toFixed(1)} ${x} ${y} Z`;
  const vein = `M${x} ${y} Q${(mx + nx * 0.15).toFixed(1)} ${(my + ny * 0.15).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  return { d, vein };
}

function petals(cx: number, cy: number, n: number, len: number, wid: number, rot = 0) {
  return Array.from({ length: n }, (_, i) => {
    const a = ((i * 360) / n + rot) * (Math.PI / 180);
    const tx = cx + Math.cos(a) * len;
    const ty = cy + Math.sin(a) * len;
    const px = -Math.sin(a) * wid;
    const py = Math.cos(a) * wid;
    const m1x = cx + Math.cos(a) * len * 0.55;
    const m1y = cy + Math.sin(a) * len * 0.55;
    return `M${cx} ${cy} C${(m1x + px).toFixed(1)} ${(m1y + py).toFixed(1)} ${(tx + px * 0.6).toFixed(1)} ${(ty + py * 0.6).toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)} C${(tx - px * 0.6).toFixed(1)} ${(ty - py * 0.6).toFixed(1)} ${(m1x - px).toFixed(1)} ${(m1y - py).toFixed(1)} ${cx} ${cy} Z`;
  });
}

const DRAW: Record<BotanicalId, (ids: Ids) => React.ReactNode> = {
  poire: (ids) => {
    const l = leaf(53, 15, 26, -28);
    return (
      <>
        <Part ids={ids} d="M50 24 C45 24 43 30 43 36 C43 45 34 50 30 62 C25 78 34 95 50 95 C66 95 75 78 70 62 C66 50 57 45 57 36 C57 30 55 24 50 24 Z" fill="#d7b85e" deep />
        <path d="M58 70 C62 76 62 84 56 89" fill="none" stroke="#b7863a" strokeWidth="3" opacity=".35" strokeLinecap="round" />
        <Strokes d="M50 25 C50 18 52 12 57 8" width={1.3} />
        <Part ids={ids} d={l.d} fill={LEAF} />
        <Strokes d={l.vein} width={0.5} />
        <Strokes d={["M38 58 l.6 .4", "M41 66 l.6 .4", "M36 72 l.6 .4", "M45 78 l.6 .4", "M40 84 l.6 .4", "M47 52 l.6 .4"]} width={0.9} opacity={0.5} />
      </>
    );
  },
  peche: (ids) => {
    const l1 = leaf(50, 27, 26, -150);
    const l2 = leaf(51, 27, 20, -110, 0.28);
    return (
      <>
        <Part ids={ids} d="M50 28 C71 26 88 42 87 62 C86 82 70 95 50 95 C30 95 14 82 13 62 C12 42 29 26 50 28 Z" fill="#f2b48d" deep />
        <path d="M60 36 C79 42 85 62 75 80 C67 90 57 92 53 90 C59 72 59 50 60 36 Z" fill="#df7a64" opacity=".42" />
        <Strokes d="M50 29 C43 46 43 72 51 94" width={0.9} />
        <Part ids={ids} d={l1.d} fill={LEAF} />
        <Strokes d={l1.vein} width={0.5} />
        <Part ids={ids} d={l2.d} fill={LEAF_DARK} />
      </>
    );
  },
  fraise: (ids) => {
    const seeds: string[] = [];
    for (let row = 0; row < 7; row++) {
      const y = 42 + row * 7;
      const half = 24 - row * 2.6 - (row === 0 ? 3 : 0);
      for (let x = 50 - half + (row % 2) * 3.5; x <= 50 + half; x += 7) seeds.push(`M${x.toFixed(1)} ${y} q.8 1.6 0 3`);
    }
    return (
      <>
        <Part ids={ids} d="M50 95 C37 89 20 69 20 49 C20 37 32 31 50 35 C68 31 80 37 80 49 C80 69 63 89 50 95 Z" fill="#c53a43" deep />
        <Strokes d={seeds} width={1.1} color="#f3d58a" opacity={0.95} />
        <Part ids={ids} d="M50 37 L34 28 L44 33 L38 19 L50 30 L62 19 L56 33 L66 28 Z" fill="#6f8a4a" />
        <Strokes d="M50 30 C50 22 52 15 56 9" width={1.2} />
      </>
    );
  },
  datte: (ids) => (
    <>
      <g transform="rotate(-24 40 60)">
        <Part ids={ids} d="M40 26 C52 26 56 44 56 60 C56 80 50 92 40 92 C30 92 24 80 24 60 C24 44 28 26 40 26 Z" fill="#7b3b1c" deep />
        <Strokes d={["M32 40 C36 46 34 54 37 60", "M44 34 C48 44 45 52 48 62", "M30 66 C34 72 33 80 38 84", "M46 70 C49 76 47 82 50 86"]} width={0.6} color="#2a140a" />
        <path d="M33 34 C35 30 39 29 42 30" stroke="#d7a273" strokeWidth="1.6" fill="none" opacity=".6" strokeLinecap="round" />
      </g>
      <g transform="rotate(30 66 66)">
        <Part ids={ids} d="M66 40 C76 40 80 54 80 66 C80 82 74 92 66 92 C58 92 52 82 52 66 C52 54 56 40 66 40 Z" fill="#8a4521" deep />
        <Strokes d={["M60 52 C64 58 62 66 65 72", "M71 58 C74 66 71 74 74 80"]} width={0.6} color="#2a140a" />
      </g>
    </>
  ),
  vanille: (ids) => {
    const fl = petals(68, 40, 5, 17, 6, -90);
    return (
      <>
        <Part ids={ids} d="M10 92 C28 66 52 40 86 14 C89 12 91 15 89 17 C58 44 34 70 15 94 C13 96 9 95 10 92 Z" fill="#3e2617" />
        <Part ids={ids} d="M18 96 C34 72 58 50 92 30 C94 29 96 32 94 33 C62 54 40 76 23 98 C21 100 17 99 18 96 Z" fill="#4a2e1b" />
        <Strokes d={["M24 78 C40 58 60 38 84 18", "M30 84 C46 66 66 48 90 33"]} width={0.4} color="#b98a5a" opacity={0.6} />
        {fl.map((d, i) => (
          <Part key={i} ids={ids} d={d} fill="#f3e9c9" shade={i % 2 === 0} />
        ))}
        <Part ids={ids} d="M68 40 C62 46 62 54 68 58 C74 54 74 46 68 40 Z" fill="#e8cf86" />
        <circle cx="68" cy="40" r="2" fill="#c99a3a" />
      </>
    );
  },
  "fleur-oranger": (ids) => {
    const fl = petals(50, 42, 5, 22, 8, -54);
    const l1 = leaf(48, 64, 30, 150, 0.36);
    const l2 = leaf(52, 64, 28, 30, 0.34);
    const stamens = Array.from({ length: 9 }, (_, i) => {
      const a = ((i * 40 - 90) * Math.PI) / 180;
      return `M50 42 L${(50 + Math.cos(a) * 9).toFixed(1)} ${(42 + Math.sin(a) * 9).toFixed(1)}`;
    });
    return (
      <>
        <Strokes d="M50 50 C50 62 50 78 50 96" width={1.2} />
        <Part ids={ids} d={l1.d} fill={LEAF} deep />
        <Strokes d={l1.vein} width={0.5} />
        <Part ids={ids} d={l2.d} fill={LEAF_DARK} />
        <Strokes d={l2.vein} width={0.5} />
        {fl.map((d, i) => (
          <Part key={i} ids={ids} d={d} fill="#fbf4e3" />
        ))}
        <Strokes d={stamens} width={0.7} color="#a78a2f" />
        {Array.from({ length: 9 }, (_, i) => {
          const a = ((i * 40 - 90) * Math.PI) / 180;
          return <circle key={i} cx={50 + Math.cos(a) * 9} cy={42 + Math.sin(a) * 9} r="1.3" fill="#e6b93a" stroke={INK} strokeWidth=".3" />;
        })}
        <Part ids={ids} d="M78 70 C74 66 74 60 78 56 C82 60 82 66 78 70 Z" fill="#f6ecd4" />
        <Strokes d="M78 70 C74 78 64 82 54 82" width={0.7} />
      </>
    );
  },
  pistache: (ids) => (
    <>
      <g transform="rotate(-18 38 58)">
        <Part ids={ids} d="M38 30 C54 30 60 46 58 62 C56 80 46 90 36 88 C24 86 18 72 20 56 C22 40 26 30 38 30 Z" fill="#e8d4ab" deep />
        <path d="M40 34 C48 46 48 70 40 84 C34 70 34 46 40 34 Z" fill="#8ea152" stroke={INK} strokeWidth=".6" />
        <path d="M40 40 C44 50 44 64 40 76" fill="none" stroke="#b07a8c" strokeWidth="1.4" opacity=".55" />
      </g>
      <g transform="rotate(26 70 68)">
        <Part ids={ids} d="M70 46 C80 46 84 58 82 70 C80 82 74 88 68 88 C60 88 56 78 57 66 C58 54 62 46 70 46 Z" fill="#a3b05f" deep />
        <path d="M66 52 C72 50 76 58 74 66" fill="none" stroke="#9a5d74" strokeWidth="2" opacity=".45" />
      </g>
    </>
  ),
  madeleine: (ids) => {
    const ridges = Array.from({ length: 9 }, (_, i) => {
      const a = ((200 + i * 17.5) * Math.PI) / 180;
      return `M50 90 L${(50 + Math.cos(a) * 34).toFixed(1)} ${(58 + Math.sin(a) * 38).toFixed(1)}`;
    });
    return (
      <>
        <Part ids={ids} d="M50 18 C72 18 87 38 85 58 C83 78 68 92 50 92 C32 92 17 78 15 58 C13 38 28 18 50 18 Z" fill="#d9a24e" deep />
        <Strokes d={ridges} width={0.9} color="#7a4a1c" />
        <path d="M30 34 C38 24 52 22 60 24" stroke="#f3cf87" strokeWidth="3" fill="none" opacity=".55" strokeLinecap="round" />
      </>
    );
  },
  chai: (ids) => {
    const star = Array.from({ length: 8 }, (_, i) => {
      const a = (i * 45 * Math.PI) / 180;
      const tx = 70 + Math.cos(a) * 17;
      const ty = 70 + Math.sin(a) * 17;
      const px = -Math.sin(a) * 4.6;
      const py = Math.cos(a) * 4.6;
      return `M70 70 C${(70 + Math.cos(a) * 7 + px).toFixed(1)} ${(70 + Math.sin(a) * 7 + py).toFixed(1)} ${(tx + px * 0.5).toFixed(1)} ${(ty + py * 0.5).toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)} C${(tx - px * 0.5).toFixed(1)} ${(ty - py * 0.5).toFixed(1)} ${(70 + Math.cos(a) * 7 - px).toFixed(1)} ${(70 + Math.sin(a) * 7 - py).toFixed(1)} 70 70 Z`;
    });
    return (
      <>
        <Part ids={ids} d="M10 64 L64 22 C67 20 71 24 68 27 L16 72 C13 74 8 70 10 64 Z" fill="#9a5428" deep />
        <Part ids={ids} d="M16 78 L70 36 C73 34 77 38 74 41 L22 86 C19 88 14 84 16 78 Z" fill="#8a4a24" deep />
        <Strokes d={["M14 66 L66 24", "M20 80 L72 38"]} width={0.5} color="#f0c48a" opacity={0.7} />
        <ellipse cx="66.5" cy="24.5" rx="3" ry="2.4" fill="#c27b45" stroke={INK} strokeWidth=".5" />
        {star.map((d, i) => (
          <Part key={i} ids={ids} d={d} fill="#6b3a20" shade={i < 4} />
        ))}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * 45 * Math.PI) / 180;
          return <ellipse key={i} cx={70 + Math.cos(a) * 10} cy={70 + Math.sin(a) * 10} rx="1.6" ry="1.1" fill="#c99a62" transform={`rotate(${i * 45} ${70 + Math.cos(a) * 10} ${70 + Math.sin(a) * 10})`} />;
        })}
        <circle cx="70" cy="70" r="2.4" fill="#4a2614" />
      </>
    );
  },
  cacao: (ids) => (
    <>
      <g transform="rotate(-30 40 52)">
        <Part ids={ids} d="M40 14 C58 18 64 40 62 58 C60 78 50 90 40 90 C30 90 20 78 18 58 C16 40 22 18 40 14 Z" fill="#a4552a" deep />
        <Strokes d={["M40 16 C42 40 42 70 40 89", "M30 20 C26 40 26 70 31 86", "M50 20 C55 40 55 70 49 86"]} width={0.7} color="#3d1a0b" />
      </g>
      <Part ids={ids} d="M56 62 L90 57 L94 88 L60 93 Z" fill="#4a2a1b" deep />
      <Strokes d={["M67 61 L71 92", "M79 59 L83 90", "M58 77 L92 72"]} width={0.7} color="#2a170f" />
      <path d="M58 64 L88 59" stroke="#8a5a3a" strokeWidth="1.4" opacity=".55" />
    </>
  ),
  biscuit: (ids) => {
    const dots: React.ReactNode[] = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) dots.push(<circle key={`${r}${c}`} cx={30 + c * 13} cy={44 + r * 12} r="1.4" fill="#7a4a1c" />);
    return (
      <g transform="rotate(-8 50 56)">
        <Part ids={ids} d="M20 30 Q24 26 28 30 Q32 26 36 30 Q40 26 44 30 Q48 26 52 30 Q56 26 60 30 Q64 26 68 30 Q72 26 76 30 Q80 30 80 34 Q84 38 80 42 Q84 46 80 50 Q84 54 80 58 Q84 62 80 66 Q84 70 80 74 Q80 80 76 80 Q72 84 68 80 Q64 84 60 80 Q56 84 52 80 Q48 84 44 80 Q40 84 36 80 Q32 84 28 80 Q24 84 20 80 Q16 80 16 76 Q20 72 16 68 Q20 64 16 60 Q20 56 16 52 Q20 48 16 44 Q20 40 16 36 Q16 30 20 30 Z" fill="#d9a85a" deep />
        {dots}
      </g>
    );
  },
  cafe: (ids) => {
    const bean = (x: number, y: number, r: number) => (
      <g transform={`rotate(${r} ${x} ${y})`} key={`${x}${y}`}>
        <Part ids={ids} d={`M${x} ${y - 14} C${x + 11} ${y - 14} ${x + 12} ${y + 14} ${x} ${y + 14} C${x - 12} ${y + 14} ${x - 11} ${y - 14} ${x} ${y - 14} Z`} fill="#5a3320" deep />
        <Strokes d={`M${x} ${y - 13} C${x - 4} ${y - 4} ${x + 4} ${y + 4} ${x} ${y + 13}`} width={1} color="#1e0f07" />
      </g>
    );
    return <>{[bean(34, 60, -20), bean(62, 54, 30), bean(54, 80, 80)]}</>;
  },
  "fleur-de-sel": (ids) => (
    <>
      <Part ids={ids} d="M14 88 C24 70 40 58 50 58 C60 58 76 70 86 88 Z" fill="#efe9dc" />
      {[
        "M30 74 l6 -5 l5 4 l-4 6 Z",
        "M46 66 l7 -4 l4 6 l-6 4 Z",
        "M60 72 l6 -3 l3 6 l-6 3 Z",
        "M40 80 l5 -3 l4 4 l-5 3 Z",
        "M54 82 l6 -2 l2 5 l-6 2 Z",
        "M70 82 l4 -3 l3 4 l-4 2 Z",
      ].map((d, i) => (
        <Part key={i} ids={ids} d={d} fill="#fbfaf6" strokeWidth={0.5} />
      ))}
    </>
  ),
};

export const botanicalNames: Record<BotanicalId, string> = {
  fraise: "Fraise des bois",
  madeleine: "Madeleine",
  peche: "Pêche blanche",
  "fleur-oranger": "Fleur d'oranger",
  poire: "Poire",
  vanille: "Gousses et fleur de vanille",
  datte: "Dattes",
  pistache: "Pistaches",
  chai: "Cannelle et badiane",
  cacao: "Cabosse et chocolat",
  biscuit: "Biscuit doré",
  cafe: "Grains de café",
  "fleur-de-sel": "Fleur de sel",
};

export function Botanical({ id, className, title }: { id: BotanicalId; className?: string; title?: string }) {
  return (
    <EngravedSvg className={className} title={title} spacing={2.1}>
      {(ids) => DRAW[id](ids)}
    </EngravedSvg>
  );
}

/** Version imbriquée dans une scène SVG (pas de <svg> racine pour l'accessibilité) */
export function BotanicalInline({ id, x, y, size }: { id: BotanicalId; x: number; y: number; size: number }) {
  return (
    <EngravedSvg x={x} y={y} width={size} height={size} spacing={2.1} overflow="visible">
      {(ids) => DRAW[id](ids)}
    </EngravedSvg>
  );
}
