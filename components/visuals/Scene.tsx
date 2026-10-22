"use client";

import { useReducedMotion } from "@/lib/useReduced";
import { useId, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { BotanicalId, DrinkLook } from "@/lib/types";
import { svgId } from "@/lib/utils";
import { getProduct } from "@/data/products";
import { BottleArt, BOTTLE_RATIO } from "./Bottle";
import { PouchArt, POUCH_RATIO } from "./Pouch";
import { DrinkArt, DRINK_RATIO } from "./Drink";
import { BotanicalInline } from "./Botanical";
import { CoffretArt, PropArt, PROP_RATIO, type PropId } from "./Props";
export { aspectClass } from "./aspect";

/* ──────────────────────────────────────────────────────────────
   Compositeur de scènes — les « photographies » de la Maison
   Chaque scène est une composition unique (aucun doublon) :
   un fond, une table, une lumière, des objets placés à la main.
   ────────────────────────────────────────────────────────────── */

export type Aspect = "16:9" | "4:5" | "1:1" | "9:16" | "3:2" | "3:4" | "21:9";
export type Backdrop = "large" | "atelier" | "nuit" | "lin" | "carte";

type Base = { x: number; base: number; h: number; depth?: 0 | 1 | 2; shadow?: boolean; rotate?: number };
export type SceneItem =
  | (Base & { kind: "bouteille"; slug: string; format?: string })
  | (Base & { kind: "sachet"; slug: string; format?: string })
  | (Base & { kind: "coffret" })
  | (Base & { kind: "boisson"; look: DrinkLook })
  | (Base & { kind: "botanique"; id: BotanicalId })
  | (Base & { kind: "accessoire"; id: PropId });

export interface SceneConfig {
  key: string;
  aspect: Aspect;
  backdrop: Backdrop;
  tint?: string;
  surface?: string;
  /** hauteur du bord de table (0-1) */
  table?: number;
  light?: "gauche" | "droite";
  items: SceneItem[];
  alt: string;
  /** position horizontale du trois-mâts (fond « large ») */
  ship?: number;
  /** brief photographique pour la future prise de vue */
  brief: string;
}

const DIMS: Record<Aspect, [number, number]> = {
  "16:9": [1600, 900],
  "21:9": [2100, 900],
  "4:5": [1200, 1500],
  "3:4": [1200, 1600],
  "1:1": [1200, 1200],
  "9:16": [900, 1600],
  "3:2": [1500, 1000],
};



function ratioOf(item: SceneItem) {
  switch (item.kind) {
    case "bouteille":
      return BOTTLE_RATIO;
    case "sachet":
      return POUCH_RATIO;
    case "boisson":
      return DRINK_RATIO;
    case "botanique":
      return 1;
    case "coffret":
      return PROP_RATIO.coffret;
    case "accessoire":
      return PROP_RATIO[item.id];
  }
}

function mix(hex: string, target: string, t: number) {
  const a = hex.replace("#", "");
  const b = target.replace("#", "");
  const c = [0, 2, 4].map((i) => {
    const v = parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t;
    return Math.round(v).toString(16).padStart(2, "0");
  });
  return `#${c.join("")}`;
}

function Backdrop({ cfg, W, H, id, tableY }: { cfg: SceneConfig; W: number; H: number; id: string; tableY: number }) {
  const tint = cfg.tint ?? "#ecd9b8";
  const left = (cfg.light ?? "gauche") === "gauche";
  const sunX = left ? W * 0.18 : W * 0.82;

  if (cfg.backdrop === "nuit") {
    return (
      <>
        <defs>
          <radialGradient id={`nb${id}`} cx={left ? 0.3 : 0.7} cy="0.35" r="0.9">
            <stop offset="0" stopColor={mix(tint, "#4b3020", 0.55)} />
            <stop offset="0.55" stopColor="#2e1c12" />
            <stop offset="1" stopColor="#170e08" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={`url(#nb${id})`} />
        <rect y={tableY} width={W} height={H - tableY} fill="#1d120b" />
        <rect y={tableY} width={W} height="3" fill="#c5a36c" opacity=".35" />
        {Array.from({ length: 6 }, (_, i) => (
          <path key={i} d={`M0 ${tableY + 30 + i * 38} C${W * 0.3} ${tableY + 22 + i * 40} ${W * 0.7} ${tableY + 40 + i * 36} ${W} ${tableY + 28 + i * 40}`} stroke="#3a2616" strokeWidth="2" fill="none" opacity=".6" />
        ))}
      </>
    );
  }

  if (cfg.backdrop === "lin") {
    return (
      <>
        <defs>
          <linearGradient id={`lb${id}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={mix(tint, "#fff9ef", 0.35)} />
            <stop offset="0.62" stopColor={tint} />
            <stop offset="1" stopColor={mix(tint, "#4b3020", 0.12)} />
          </linearGradient>
          <radialGradient id={`lg${id}`} cx={left ? 0.25 : 0.75} cy="0.2" r="0.8">
            <stop offset="0" stopColor="#fffaf0" stopOpacity=".8" />
            <stop offset="1" stopColor="#fffaf0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={`url(#lb${id})`} />
        <rect width={W} height={H} fill={`url(#lg${id})`} />
      </>
    );
  }

  if (cfg.backdrop === "carte") {
    const roses = [
      [W * 0.28, H * 0.3],
      [W * 0.78, H * 0.62],
    ];
    return (
      <>
        <rect width={W} height={H} fill={mix(tint, "#efe2c6", 0.5)} />
        <g stroke="#8a6a3a" strokeWidth="1.2" opacity=".35">
          {roses.flatMap(([cx, cy], r) =>
            Array.from({ length: 16 }, (_, i) => {
              const a = (i * Math.PI) / 8;
              return <line key={`${r}-${i}`} x1={cx} y1={cy} x2={cx + Math.cos(a) * W} y2={cy + Math.sin(a) * W} />;
            }),
          )}
        </g>
        <path d={`M0 ${H * 0.72} C${W * 0.12} ${H * 0.66} ${W * 0.2} ${H * 0.8} ${W * 0.32} ${H * 0.78} C${W * 0.42} ${H * 0.76} ${W * 0.46} ${H * 0.9} ${W * 0.6} ${H} L0 ${H} Z`} fill="#d9c49c" stroke="#7a5528" strokeWidth="1.5" opacity=".7" />
        <path d={`M${W} ${H * 0.08} C${W * 0.9} ${H * 0.14} ${W * 0.86} ${H * 0.04} ${W * 0.74} ${H * 0.1} C${W * 0.66} ${H * 0.14} ${W * 0.64} 0 ${W * 0.6} 0 L${W} 0 Z`} fill="#d9c49c" stroke="#7a5528" strokeWidth="1.5" opacity=".7" />
        <path d={`M${W * 0.1} ${H * 0.55} C${W * 0.3} ${H * 0.4} ${W * 0.5} ${H * 0.5} ${W * 0.7} ${H * 0.3} S${W * 0.9} ${H * 0.2} ${W * 0.96} ${H * 0.16}`} fill="none" stroke="#a9692f" strokeWidth="2.4" strokeDasharray="10 10" opacity=".65" />
        {roses.map(([cx, cy], i) => (
          <g key={i} transform={`translate(${cx} ${cy})`} opacity=".55">
            <circle r="46" fill="none" stroke="#7a5528" strokeWidth="1.4" />
            <circle r="38" fill="none" stroke="#7a5528" strokeWidth=".8" />
            <path d="M0 -60 L9 0 L0 60 L-9 0 Z M-60 0 L0 9 L60 0 L0 -9 Z" fill="#7a5528" />
            <path d="M0 -60 L9 0 L-9 0 Z" fill="#a9692f" />
          </g>
        ))}
        <rect width={W} height={H} fill="#fff8ea" opacity=".18" />
      </>
    );
  }

  // large & atelier
  const marine = cfg.backdrop === "large";
  const horizon = tableY - H * 0.12;
  return (
    <>
      <defs>
        <linearGradient id={`sk${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={marine ? mix(tint, "#7d6a55", 0.25) : mix(tint, "#4b3020", 0.08)} />
          <stop offset="0.6" stopColor={marine ? mix(tint, "#f7d9a3", 0.35) : tint} />
          <stop offset="1" stopColor={marine ? "#f6dcae" : mix(tint, "#fff3dc", 0.3)} />
        </linearGradient>
        <radialGradient id={`sun${id}`} cx={sunX / W} cy={marine ? horizon / H : 0.18} r="0.55">
          <stop offset="0" stopColor="#fff2d2" stopOpacity=".95" />
          <stop offset="0.3" stopColor="#f7d79c" stopOpacity=".5" />
          <stop offset="1" stopColor="#f7d79c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`sea${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#c9b089" />
          <stop offset="1" stopColor="#7d6448" />
        </linearGradient>
        <pattern id={`wv${id}`} width="60" height="7" patternUnits="userSpaceOnUse">
          <path d="M0 4 Q15 1 30 4 T60 4" stroke="#3a2616" strokeWidth="1" fill="none" opacity=".45" />
        </pattern>
      </defs>
      <rect width={W} height={tableY} fill={`url(#sk${id})`} />
      {marine ? (
        <>
          {/* nuages gravés */}
          <g stroke="#5a4532" strokeWidth="1.2" fill="none" opacity=".22">
            {Array.from({ length: 9 }, (_, i) => (
              <path key={i} d={`M${W * (left ? 0.45 : 0.05) + i * 26} ${H * 0.12 + i * 9} q${W * 0.08} -10 ${W * 0.18} 0`} />
            ))}
          </g>
          <rect width={W} height={tableY} fill={`url(#sun${id})`} />
          {/* côte lointaine */}
          <path
            d={`M${left ? W * 0.55 : 0} ${horizon} C${left ? W * 0.62 : W * 0.08} ${horizon - H * 0.07} ${left ? W * 0.7 : W * 0.16} ${horizon - H * 0.03} ${left ? W * 0.78 : W * 0.24} ${horizon - H * 0.09} C${left ? W * 0.86 : W * 0.32} ${horizon - H * 0.12} ${left ? W * 0.94 : W * 0.4} ${horizon - H * 0.05} ${left ? W : W * 0.46} ${horizon - H * 0.06} L${left ? W : W * 0.46} ${horizon} Z`}
            fill="#8f7a5f"
            opacity=".55"
          />
          {/* trois-mâts lointain */}
          <g transform={`translate(${W * (cfg.ship ?? (left ? 0.36 : 0.6))} ${horizon - 4}) scale(${H / 900})`} fill="#5a4532" opacity=".6">
            <path d="M-30 0 L30 0 L24 6 L-24 6 Z" />
            <path d="M-14 -4 L-14 -58 M2 -4 L2 -70 M16 -4 L16 -52" stroke="#5a4532" strokeWidth="1.6" />
            <path d="M-26 -12 Q-14 -30 -2 -12 Z M-24 -34 Q-14 -50 -4 -34 Z M-10 -16 Q2 -36 14 -16 Z M-8 -42 Q2 -60 12 -42 Z M8 -12 Q16 -28 26 -12 Z M8 -32 Q16 -46 24 -32 Z" />
          </g>
          <rect y={horizon} width={W} height={tableY - horizon} fill={`url(#sea${id})`} />
          <rect y={horizon} width={W} height={tableY - horizon} fill={`url(#wv${id})`} />
          <ellipse cx={sunX} cy={horizon + 8} rx={W * 0.16} ry="10" fill="#fff1cf" opacity=".55" />
        </>
      ) : (
        <>
          {/* lumière de fenêtre */}
          <g opacity=".5">
            {[0, 1, 2].map((i) => {
              const x0 = left ? W * (0.02 + i * 0.13) : W * (0.98 - i * 0.13);
              const dx = left ? W * 0.32 : -W * 0.32;
              const w = W * 0.08;
              return (
                <path
                  key={i}
                  d={`M${x0} 0 L${x0 + (left ? w : -w)} 0 L${x0 + dx + (left ? w : -w)} ${tableY} L${x0 + dx} ${tableY} Z`}
                  fill="#fff6e2"
                  opacity={0.55 - i * 0.12}
                />
              );
            })}
          </g>
          <rect width={W} height={tableY} fill={`url(#sun${id})`} opacity=".7" />
          <rect y={tableY - H * 0.16} width={W} height="2" fill="#4b3020" opacity=".12" />
        </>
      )}
    </>
  );
}

function Table({ cfg, W, H, id, tableY }: { cfg: SceneConfig; W: number; H: number; id: string; tableY: number }) {
  if (cfg.backdrop === "lin" || cfg.backdrop === "carte" || cfg.backdrop === "nuit") return null;
  const surface = cfg.surface ?? "#b48a5a";
  return (
    <>
      <defs>
        <linearGradient id={`tb${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={mix(surface, "#fff3dc", 0.22)} />
          <stop offset="1" stopColor={mix(surface, "#24180f", 0.35)} />
        </linearGradient>
      </defs>
      <rect y={tableY} width={W} height={H - tableY} fill={`url(#tb${id})`} />
      <rect y={tableY} width={W} height="3" fill="#fff4dc" opacity=".45" />
      <g stroke={mix(surface, "#24180f", 0.45)} strokeWidth="1.4" fill="none" opacity=".35">
        {Array.from({ length: 7 }, (_, i) => {
          const yy = tableY + 18 + i * ((H - tableY) / 7);
          return <path key={i} d={`M0 ${yy} C${W * 0.25} ${yy - 6} ${W * 0.55} ${yy + 8} ${W} ${yy - 2}`} />;
        })}
      </g>
    </>
  );
}

function ItemShadow({ x, w, base, h, left, soft }: { x: number; w: number; base: number; h: number; left: boolean; soft: boolean }) {
  const dir = left ? 1 : -1;
  return (
    <g>
      {!soft && (
        <path
          d={`M${x - w * 0.42} ${base} L${x + w * 0.42} ${base} L${x + w * 0.42 + dir * h * 0.75} ${base - h * 0.06} L${x - w * 0.2 + dir * h * 0.75} ${base - h * 0.08} Z`}
          fill="#24180f"
          opacity=".12"
        />
      )}
      <ellipse cx={x + dir * w * 0.06} cy={base} rx={w * 0.56} ry={Math.max(6, w * 0.07)} fill="#24180f" opacity=".2" />
      <ellipse cx={x} cy={base} rx={w * 0.4} ry={Math.max(3, w * 0.035)} fill="#24180f" opacity=".25" />
    </g>
  );
}

function renderItem(item: SceneItem, W: number, H: number, i: number) {
  const h = item.h * H;
  const w = h * ratioOf(item);
  const x = item.x * W - w / 2;
  const y = item.base * H - h;
  const wrap = (node: React.ReactNode) =>
    item.rotate ? (
      <g key={i} transform={`rotate(${item.rotate} ${item.x * W} ${item.base * H - h / 2})`}>
        {node}
      </g>
    ) : (
      <g key={i}>{node}</g>
    );
  switch (item.kind) {
    case "bouteille": {
      const p = getProduct(item.slug);
      if (!p) return null;
      return wrap(<BottleArt product={p} nested x={x} y={y} height={h} format={item.format} />);
    }
    case "sachet": {
      const p = getProduct(item.slug);
      if (!p) return null;
      return wrap(<PouchArt product={p} nested x={x} y={y} height={h} format={item.format} />);
    }
    case "coffret":
      return wrap(<CoffretArt x={x} y={y} height={h} />);
    case "boisson":
      return wrap(<DrinkArt look={item.look} nested x={x} y={y} height={h} />);
    case "botanique":
      return wrap(<BotanicalInline id={item.id} x={x} y={y} size={h} />);
    case "accessoire":
      return wrap(<PropArt id={item.id} x={x} y={y} height={h} />);
  }
}

function Layer({ y, children }: { y?: MotionValue<number>; children: React.ReactNode }) {
  if (!y) return <g>{children}</g>;
  return <motion.g style={{ y }}>{children}</motion.g>;
}

type SceneProps = {
  config: SceneConfig;
  className?: string;
  parallax?: boolean;
  priority?: boolean;
  decorative?: boolean;
};

type Depths = { back: MotionValue<number>; mid: MotionValue<number>; front: MotionValue<number> };

/** Scène avec parallaxe : chaque plan (fond, objets, premier plan) se déplace à sa vitesse */
function ParallaxScene(props: SceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const H = DIMS[props.config.aspect][1];
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const back = useTransform(scrollYProgress, [0, 1], [-H * 0.035, H * 0.035]);
  const mid = useTransform(scrollYProgress, [0, 1], [H * 0.01, -H * 0.01]);
  const front = useTransform(scrollYProgress, [0, 1], [H * 0.035, -H * 0.035]);
  return (
    <div ref={ref} className={props.className}>
      <SceneSvg {...props} className="h-full w-full" depths={{ back, mid, front }} />
    </div>
  );
}

export function Scene(props: SceneProps) {
  const reduce = useReducedMotion();
  if (props.parallax && !reduce) return <ParallaxScene {...props} />;
  return <SceneSvg {...props} />;
}

function SceneSvg({ config, className, priority = false, decorative = false, depths }: SceneProps & { depths?: Depths }) {
  const id = svgId(useId());
  const [W, H] = DIMS[config.aspect];
  const tableY = (config.table ?? 0.66) * H;
  const left = (config.light ?? "gauche") === "gauche";
  const usePar = !!depths;
  const yBack = depths?.back;
  const yMid = depths?.mid;
  const yFront = depths?.front;

  const sorted = config.items
    .map((it, i) => ({ it, i }))
    .sort((a, b) => (a.it.depth ?? 1) - (b.it.depth ?? 1) || a.it.base - b.it.base);
  const byDepth = (d: number) => sorted.filter(({ it }) => (it.depth ?? 1) === d);

  const softShadows = config.backdrop === "lin" || config.backdrop === "carte";

  const svg = (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : config.alt}
      data-priority={priority || undefined}
      data-scene={config.key}
      className={className}
    >
      <Layer y={usePar ? yBack : undefined}>
        <g transform={usePar ? `translate(0 ${-H * 0.04}) scale(1 1.08)` : undefined}>
          <Backdrop cfg={config} W={W} H={H} id={id} tableY={tableY} />
        </g>
      </Layer>
      <Table cfg={config} W={W} H={H} id={id} tableY={tableY} />
      {[0, 1, 2].map((d) => (
        <Layer key={d} y={usePar ? (d === 0 ? yBack : d === 1 ? yMid : yFront) : undefined}>
          {byDepth(d).map(({ it, i }) => {
            const h = it.h * H;
            const w = h * ratioOf(it);
            return (
              <g key={i}>
                {it.shadow !== false && it.kind !== "botanique" && (
                  <ItemShadow x={it.x * W} w={w} base={it.base * H} h={h} left={left} soft={softShadows} />
                )}
                {renderItem(it, W, H, i)}
              </g>
            );
          })}
        </Layer>
      ))}
      {/* voile de lumière chaude */}
      <rect width={W} height={H} fill={left ? `url(#vg${id})` : `url(#vd${id})`} pointerEvents="none" />
      <defs>
        <linearGradient id={`vg${id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff2d6" stopOpacity=".16" />
          <stop offset=".6" stopColor="#fff2d6" stopOpacity="0" />
          <stop offset="1" stopColor="#24180f" stopOpacity=".16" />
        </linearGradient>
        <linearGradient id={`vd${id}`} x1="1" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff2d6" stopOpacity=".16" />
          <stop offset=".6" stopColor="#fff2d6" stopOpacity="0" />
          <stop offset="1" stopColor="#24180f" stopOpacity=".16" />
        </linearGradient>
      </defs>
    </svg>
  );
  return svg;
}
