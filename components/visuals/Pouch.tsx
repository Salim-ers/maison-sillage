import { useId } from "react";
import type { Product } from "@/lib/types";
import { svgId } from "@/lib/utils";
import { getSeason } from "@/data/collections";
import { BotanicalInline } from "./Botanical";

/* Doypack mat Maison Sillage — ivoire ou brun selon la saveur.
   Même système d'étiquette que les flacons. viewBox 160 × 220 */

export const POUCH_RATIO = 160 / 220;

const SHAPE =
  "M22 12 L138 12 L140 38 C145 92 150 148 150 196 Q150 212 134 212 L26 212 Q10 212 10 196 C10 148 15 92 20 38 Z";

type PouchProduct = Pick<Product, "labelLines" | "palette" | "season" | "pack" | "botanicals">;

export function PouchArt({
  product,
  format = "200 g",
  x = 0,
  y = 0,
  height = 220,
  nested = false,
  title,
  className,
}: {
  product: PouchProduct;
  format?: string;
  x?: number;
  y?: number;
  height?: number;
  nested?: boolean;
  title?: string;
  className?: string;
}) {
  const id = svgId(useId());
  const dark = product.pack === "doypack-brun";
  const base = dark ? "#4b3020" : "#ece1c9";
  const edge = dark ? "#2e1c12" : "#cdbb98";
  const ink = dark ? "#f3e8d4" : "#24180f";
  const sub = dark ? "#c5a36c" : "#7a5528";
  const seasonName = product.season ? getSeason(product.season).name : "";
  const content = (
    <>
      <defs>
        <linearGradient id={`pb${id}`} x1="0" x2="1">
          <stop offset="0" stopColor={edge} />
          <stop offset="0.18" stopColor={base} />
          <stop offset="0.62" stopColor={base} />
          <stop offset="0.86" stopColor={edge} stopOpacity="0.85" />
          <stop offset="1" stopColor={edge} />
        </linearGradient>
        <linearGradient id={`pv${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.12" />
          <stop offset="0.2" stopColor="#000" stopOpacity="0" />
          <stop offset="0.82" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
        <clipPath id={`pc${id}`}>
          <path d={SHAPE} />
        </clipPath>
      </defs>
      <path d={SHAPE} fill={`url(#pb${id})`} />
      <g clipPath={`url(#pc${id})`}>
        <rect width="160" height="220" fill={`url(#pv${id})`} />
        {/* soudure crantée */}
        <rect x="0" y="12" width="160" height="15" fill={edge} opacity={dark ? 0.55 : 0.35} />
        {Array.from({ length: 40 }, (_, i) => (
          <line key={i} x1={20 + i * 3} y1="13" x2={20 + i * 3} y2="26" stroke={dark ? "#1f130b" : "#a8946f"} strokeWidth=".5" opacity=".6" />
        ))}
        <line x1="0" y1="35" x2="160" y2="35" stroke={dark ? "#1f130b" : "#b6a27c"} strokeWidth=".8" />
        <line x1="0" y1="37" x2="160" y2="37" stroke="#fff" strokeOpacity=".15" strokeWidth=".6" />
        {/* plis */}
        <path d="M118 40 C122 100 124 160 122 210" stroke="#000" strokeOpacity=".08" strokeWidth="6" fill="none" />
        <path d="M34 44 C30 110 30 160 32 210" stroke="#fff" strokeOpacity={dark ? 0.06 : 0.35} strokeWidth="5" fill="none" />
        <path d="M10 196 Q80 186 150 196" stroke="#000" strokeOpacity=".12" strokeWidth="1" fill="none" />
      </g>
      <path d={SHAPE} fill="none" stroke="#24180f" strokeOpacity=".4" strokeWidth=".8" />
      <path d="M131 12 l4 6 l-4 0 z" fill={edge} />

      {/* système d'étiquette */}
      <image href={dark ? "/brand/emblem-label-dark.webp" : "/brand/emblem-label.webp"} x="65" y="48" width="30" height="36" preserveAspectRatio="xMidYMid meet" />
      <text x="80" y="94" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="5" letterSpacing="2" fill={ink} fontWeight="600">
        MAISON SILLAGE
      </text>
      <path d="M50 99 L110 99" stroke={sub} strokeWidth=".4" />
      <text x="80" y="113" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="10.5" fill={ink} fontWeight="600">
        {product.labelLines[0]}
      </text>
      <text x="80" y="126" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="8.6" fill={ink} fontStyle="italic">
        {product.labelLines[1]}
      </text>
      <g opacity={dark ? 0.9 : 1}>
        <BotanicalInline id={product.botanicals[0]} x={58} y={132} size={44} />
      </g>
      <text x="80" y="188" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="4.2" letterSpacing="1.4" fill={sub}>
        PRÉPARATION GOURMANDE EN POUDRE
      </text>
      <rect x="54" y="192" width="52" height="11" rx="1" fill="none" stroke={product.palette.accent} strokeWidth=".7" />
      <text x="80" y="199.6" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="4.4" letterSpacing="1" fill={ink}>
        {seasonName ? `${seasonName.toUpperCase()} · ${format}` : format}
      </text>
    </>
  );

  if (nested) {
    const w = height * POUCH_RATIO;
    return (
      <svg x={x} y={y} width={w} height={height} viewBox="0 0 160 220" overflow="visible" aria-hidden>
        {content}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 160 220" className={className} role="img" aria-label={title ?? `Sachet ${product.labelLines.join(" ")}`}>
      {content}
    </svg>
  );
}
