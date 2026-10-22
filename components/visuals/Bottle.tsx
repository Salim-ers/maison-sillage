import { useId } from "react";
import type { Product } from "@/lib/types";
import { svgId } from "@/lib/utils";
import { getSeason } from "@/data/collections";

/* Flacon signature Maison Sillage — verre légèrement ambré,
   étiquette ivoire à double filet, emblème gravé, bouchon liège
   coiffé d'une capsule à la couleur de la saison. viewBox 120 × 300 */

export const BOTTLE_RATIO = 120 / 300;

const BODY =
  "M46 58 L46 80 C46 97 15 104 14 128 L14 282 Q14 294 26 294 L94 294 Q106 294 106 282 L106 128 C105 104 74 97 74 80 L74 58 Z";

type BottleProduct = Pick<Product, "labelLines" | "palette" | "season" | "status" | "category">;

export function BottleArt({
  product,
  format = "250 ml",
  x = 0,
  y = 0,
  height = 300,
  nested = false,
  title,
  className,
}: {
  product: BottleProduct;
  format?: string;
  x?: number;
  y?: number;
  height?: number;
  nested?: boolean;
  title?: string;
  className?: string;
}) {
  const id = svgId(useId());
  const { palette, labelLines, season } = product;
  const seasonName = season ? getSeason(season).name : "Édition à venir";
  const seal = palette.accent;
  const content = (
    <>
      <defs>
        <clipPath id={`cb${id}`}>
          <path d={BODY} />
        </clipPath>
        <linearGradient id={`liq${id}`} x1="0" x2="1">
          <stop offset="0" stopColor={palette.deep} />
          <stop offset="0.28" stopColor={palette.liquid} />
          <stop offset="0.55" stopColor={palette.liquid} stopOpacity="0.82" />
          <stop offset="0.8" stopColor={palette.liquid} />
          <stop offset="1" stopColor={palette.deep} />
        </linearGradient>
        <linearGradient id={`gl${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#8a6a3a" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#f6e9cf" stopOpacity="0.12" />
          <stop offset="1" stopColor="#6d522c" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id={`hi${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.25" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.8" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`cork${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#7a5634" />
          <stop offset="0.45" stopColor="#c9a173" />
          <stop offset="1" stopColor="#6b4a2c" />
        </linearGradient>
        <linearGradient id={`cap${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#7b5a2c" />
          <stop offset="0.4" stopColor="#d6b77d" />
          <stop offset="0.62" stopColor="#b48d4f" />
          <stop offset="1" stopColor="#6a4a22" />
        </linearGradient>
        <linearGradient id={`lab${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#e6d6b6" />
          <stop offset="0.35" stopColor="#f8f0de" />
          <stop offset="0.7" stopColor="#f3e8d2" />
          <stop offset="1" stopColor="#d9c6a1" />
        </linearGradient>
      </defs>

      {/* verre + liquide */}
      <path d={BODY} fill="#efe3c8" opacity="0.35" />
      <g clipPath={`url(#cb${id})`}>
        <rect x="0" y="104" width="120" height="200" fill={`url(#liq${id})`} />
        <ellipse cx="60" cy="104" rx="44" ry="3" fill={palette.liquid} opacity="0.9" />
        <ellipse cx="60" cy="104" rx="44" ry="3" fill="#fff" opacity="0.18" />
        <rect x="0" y="0" width="120" height="300" fill={`url(#gl${id})`} />
        <rect x="0" y="284" width="120" height="16" fill={palette.deep} opacity="0.5" />
        {/* reflets */}
        <rect x="20" y="112" width="5" height="170" rx="2.5" fill={`url(#hi${id})`} />
        <rect x="27.5" y="130" width="1.6" height="140" rx="0.8" fill={`url(#hi${id})`} opacity="0.6" />
        <rect x="97" y="126" width="2" height="150" rx="1" fill={`url(#hi${id})`} opacity="0.45" />
        <path d="M49 60 L49 84 C49 92 40 98 30 104" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" fill="none" />
      </g>
      <path d={BODY} fill="none" stroke="#3a2616" strokeOpacity="0.45" strokeWidth="0.9" />

      {/* bague, bouchon et capsule */}
      <rect x="43.5" y="52" width="33" height="8" rx="2" fill="#e8dcc0" stroke="#3a2616" strokeOpacity=".35" strokeWidth=".6" />
      <path d="M44 22 Q44 14 52 14 L68 14 Q76 14 76 22 L76 52 L44 52 Z" fill={`url(#cork${id})`} />
      <path d="M44 34 L76 34 L76 52 L44 52 Z" fill={`url(#cap${id})`} />
      <path d="M44 34 L76 34" stroke="#3a2616" strokeOpacity=".4" strokeWidth=".6" />
      <path d="M48 20 Q60 16 72 20" stroke="#3a2616" strokeOpacity=".25" strokeWidth=".6" fill="none" />
      <circle cx="60" cy="43" r="6.4" fill={seal} stroke="#3a2616" strokeOpacity=".45" strokeWidth=".5" />
      <circle cx="60" cy="43" r="4.2" fill="none" stroke="#f6ead2" strokeOpacity=".7" strokeWidth=".5" />
      <path d="M57.5 44.5 Q60 40 62.5 44.5" stroke="#f6ead2" strokeOpacity=".85" strokeWidth=".6" fill="none" />

      {/* étiquette */}
      <rect x="20.5" y="146" width="79" height="122" rx="1.5" fill={`url(#lab${id})`} />
      <rect x="23.5" y="149" width="73" height="116" fill="none" stroke="#a47b43" strokeWidth=".55" />
      <rect x="25" y="150.5" width="70" height="113" fill="none" stroke="#a47b43" strokeWidth=".3" />
      <image href="/brand/emblem-label.webp" x="47" y="153" width="26" height="31" preserveAspectRatio="xMidYMid meet" />
      <text x="60" y="191" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="4.1" letterSpacing="1.6" fill="#4b3020" fontWeight="600">
        MAISON SILLAGE
      </text>
      <path d="M35 195.5 L85 195.5" stroke="#a47b43" strokeWidth=".35" />
      <text x="60" y="207" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="8.4" fill="#24180f" fontWeight="600">
        {labelLines[0]}
      </text>
      <text x="60" y="216" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="5" fontStyle="italic" fill="#7a5528">
        &amp;
      </text>
      <text x="60" y="226" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="8.4" fill="#24180f" fontWeight="600">
        {labelLines[1].replace(/^&\s*/, "")}
      </text>
      <text x="60" y="236" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="3.6" letterSpacing="1.1" fill="#7a5528">
        SIROP SIGNATURE
      </text>
      <rect x="25" y="244" width="70" height="19.5" fill={seal} opacity="0.88" />
      <text x="60" y="252" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="3.6" letterSpacing="1.4" fill="#fff9ef">
        {seasonName.toUpperCase()}
      </text>
      <text x="60" y="259.5" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="3.6" letterSpacing="0.8" fill="#fff9ef" fontStyle="italic">
        {format}
      </text>
      {/* ombre de courbure sur l'étiquette */}
      <rect x="20.5" y="146" width="10" height="122" fill="#3a2616" opacity=".07" />
      <rect x="90" y="146" width="9.5" height="122" fill="#3a2616" opacity=".1" />
    </>
  );

  if (nested) {
    const w = height * BOTTLE_RATIO;
    return (
      <svg x={x} y={y} width={w} height={height} viewBox="0 0 120 300" overflow="visible" aria-hidden>
        {content}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 300" className={className} role="img" aria-label={title ?? `Flacon ${labelLines.join(" & ")}`}>
      {content}
    </svg>
  );
}
