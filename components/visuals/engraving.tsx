import { useId, type ReactNode, type SVGProps } from "react";
import { svgId } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────
   Gravure rehaussée — le langage visuel commun de la Maison
   Un aplat d'aquarelle, une hachure masquée par la lumière,
   un trait d'encre. Toutes les illustrations l'utilisent.
   ────────────────────────────────────────────────────────────── */

export const INK = "#3a2616";

export function useEngraving(spacing = 2.4, light: "tl" | "tr" | "top" = "tl") {
  const raw = svgId(useId());
  const ids = {
    hatch: `h${raw}`,
    cross: `c${raw}`,
    shade: `s${raw}`,
    deep: `d${raw}`,
    gShade: `gs${raw}`,
    gDeep: `gd${raw}`,
  };
  const dir =
    light === "tl" ? { x1: 0, y1: 0, x2: 1, y2: 1 } : light === "tr" ? { x1: 1, y1: 0, x2: 0, y2: 1 } : { x1: 0, y1: 0, x2: 0, y2: 1 };
  const defs = (
    <defs>
      <pattern id={ids.hatch} width={spacing} height={spacing} patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
        <line x1="0" y1="0" x2="0" y2={spacing} stroke={INK} strokeWidth={spacing * 0.3} />
      </pattern>
      <pattern id={ids.cross} width={spacing * 1.1} height={spacing * 1.1} patternUnits="userSpaceOnUse" patternTransform="rotate(-42)">
        <line x1="0" y1="0" x2="0" y2={spacing * 1.1} stroke={INK} strokeWidth={spacing * 0.26} />
      </pattern>
      <linearGradient id={ids.gShade} {...dir}>
        <stop offset="0.3" stopColor="#000" />
        <stop offset="0.55" stopColor="#555" />
        <stop offset="1" stopColor="#fff" />
      </linearGradient>
      <linearGradient id={ids.gDeep} {...dir}>
        <stop offset="0.66" stopColor="#000" />
        <stop offset="1" stopColor="#fff" />
      </linearGradient>
      <mask id={ids.shade} maskContentUnits="objectBoundingBox">
        <rect width="1" height="1" fill={`url(#${ids.gShade})`} />
      </mask>
      <mask id={ids.deep} maskContentUnits="objectBoundingBox">
        <rect width="1" height="1" fill={`url(#${ids.gDeep})`} />
      </mask>
    </defs>
  );
  return { ids, defs };
}

type Ids = ReturnType<typeof useEngraving>["ids"];

/** Une forme gravée : lavis + hachures dans l'ombre + contour */
export function Part({
  d,
  fill,
  ids,
  shade = true,
  deep = false,
  stroke = INK,
  strokeWidth = 1,
  opacity = 0.92,
  ...rest
}: { d: string; fill: string; ids: Ids; shade?: boolean; deep?: boolean; stroke?: string; strokeWidth?: number; opacity?: number } & Omit<
  SVGProps<SVGGElement>,
  "fill" | "stroke" | "strokeWidth" | "opacity"
>) {
  return (
    <g {...rest}>
      <path d={d} fill={fill} opacity={opacity} />
      {shade && <path d={d} fill={`url(#${ids.hatch})`} mask={`url(#${ids.shade})`} opacity={0.8} />}
      {deep && <path d={d} fill={`url(#${ids.cross})`} mask={`url(#${ids.deep})`} opacity={0.6} />}
      <path d={d} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
    </g>
  );
}

export function Strokes({ d, width = 0.6, color = INK, opacity = 0.85 }: { d: string | string[]; width?: number; color?: string; opacity?: number }) {
  const list = Array.isArray(d) ? d : [d];
  return (
    <g fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
      {list.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </g>
  );
}

export function EngravedSvg({
  viewBox = "0 0 100 100",
  children,
  title,
  className,
  spacing,
  light,
  ...rest
}: {
  viewBox?: string;
  children: (ids: Ids) => ReactNode;
  title?: string;
  className?: string;
  spacing?: number;
  light?: "tl" | "tr" | "top";
} & Omit<SVGProps<SVGSVGElement>, "children">) {
  const { ids, defs } = useEngraving(spacing, light);
  return (
    <svg viewBox={viewBox} className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} {...rest}>
      {title && <title>{title}</title>}
      {defs}
      {children(ids)}
    </svg>
  );
}
