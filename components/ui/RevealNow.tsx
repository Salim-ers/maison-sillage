import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Dévoilement par masque des visuels d'ouverture (au-dessus de la ligne de flottaison).
 *  Animation CSS : l'image se dévoile dès le HTML, sans attendre l'hydratation (LCP). */
export function RevealNow({ children, className, from = "right", delay = 0.15 }: { children: ReactNode; className?: string; from?: "right" | "left" | "bottom"; delay?: number }) {
  return (
    <div className={cn("masque-entree relative overflow-hidden", `masque-${from}`, className)} style={{ ["--delay" as string]: `${delay}s` }}>
      {children}
    </div>
  );
}
