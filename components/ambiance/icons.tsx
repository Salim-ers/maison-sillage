import type { Light, SeasonId } from "@/lib/types";

/* Pictogrammes d'ambiance, dessinés au trait comme les gravures de l'étiquette */

const r2 = (n: number) => Math.round(n * 100) / 100;

const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function LightIcon({ light, className }: { light: Light; className?: string }) {
  if (light === "jour")
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden {...common}>
        <circle cx="16" cy="16" r="5.5" />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          return <line key={i} x1={r2(16 + Math.cos(a) * 9)} y1={r2(16 + Math.sin(a) * 9)} x2={r2(16 + Math.cos(a) * 12.5)} y2={r2(16 + Math.sin(a) * 12.5)} />;
        })}
      </svg>
    );
  if (light === "coucher")
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden {...common}>
        <path d="M9 21a7 7 0 0 1 14 0" />
        <line x1="4" y1="21" x2="28" y2="21" />
        <line x1="8" y1="25" x2="24" y2="25" opacity=".6" />
        <line x1="16" y1="7" x2="16" y2="10.5" />
        <line x1="7.2" y1="11.6" x2="9.6" y2="13.8" />
        <line x1="24.8" y1="11.6" x2="22.4" y2="13.8" />
      </svg>
    );
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden {...common}>
      <path d="M20.5 6.5a9.5 9.5 0 1 0 5 15.5 8 8 0 0 1-5-15.5Z" />
      <path d="M8 7.5l.7 1.6 1.6.7-1.6.7L8 12.1l-.7-1.6-1.6-.7 1.6-.7Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SeasonIcon({ season, className }: { season: SeasonId; className?: string }) {
  if (season === "printemps")
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden {...common}>
        {Array.from({ length: 5 }, (_, i) => (
          <ellipse key={i} cx="16" cy="9.6" rx="3.6" ry="5.6" transform={`rotate(${i * 72} 16 16)`} />
        ))}
        <circle cx="16" cy="16" r="1.8" fill="currentColor" stroke="none" />
      </svg>
    );
  if (season === "ete")
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden {...common}>
        <path d="M3 13c3.2-3 6.4-3 9.6 0s6.4 3 9.6 0 4.8-3 6.8-1.2" />
        <path d="M3 19c3.2-3 6.4-3 9.6 0s6.4 3 9.6 0 4.8-3 6.8-1.2" />
        <path d="M3 25c3.2-3 6.4-3 9.6 0s6.4 3 9.6 0 4.8-3 6.8-1.2" opacity=".6" />
      </svg>
    );
  if (season === "automne")
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden {...common}>
        <path d="M16 28V12" />
        <path d="M16 4c-6 4-8 9-6.5 14.5L16 22l6.5-3.5C24 13 22 8 16 4Z" />
        <path d="M16 13l-3.5-2.5M16 17l-4-2.2M16 13l3.5-2.5M16 17l4-2.2" />
      </svg>
    );
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden {...common}>
      {Array.from({ length: 3 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 60} 16 16)`}>
          <line x1="16" y1="4" x2="16" y2="28" />
          <path d="M13 7l3 3 3-3M13 25l3-3 3 3" />
        </g>
      ))}
    </svg>
  );
}

/** Boussole de l'en-tête : l'aiguille indique la saison, le cœur la lumière (piloté en CSS) */
export function CompassIcon({ className, spinning = false }: { className?: string; spinning?: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="17.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="20" cy="20" r="14.2" fill="none" stroke="currentColor" strokeWidth="0.6" opacity=".55" />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i * Math.PI) / 8;
        const long = i % 4 === 0;
        return <line key={i} x1={r2(20 + Math.cos(a) * (long ? 12.4 : 13.3))} y1={r2(20 + Math.sin(a) * (long ? 12.4 : 13.3))} x2={r2(20 + Math.cos(a) * 14.2)} y2={r2(20 + Math.sin(a) * 14.2)} stroke="currentColor" strokeWidth={long ? 1 : 0.6} />;
      })}
      <g className={`boussole-aiguille ${spinning ? "boussole-cherche" : ""}`}>
        <path d="M20 6.5 22.6 20 20 21.6 17.4 20Z" fill="currentColor" />
        <path d="M20 33.5 22.6 20 20 18.4 17.4 20Z" fill="none" stroke="currentColor" strokeWidth="0.9" />
      </g>
      <circle cx="20" cy="20" r="2.1" className="boussole-coeur" />
    </svg>
  );
}
