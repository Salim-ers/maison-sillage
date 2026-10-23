"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Monte son contenu au premier survol (ou focus) de la carte qui le contient : la photographie
 *  d'ambiance d'une carte n'est téléchargée que si l'on s'y intéresse, jamais pendant le défilement. */
export function OnFirstHover({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const card = ref.current?.closest("article");
    if (!card || !window.matchMedia("(hover: hover)").matches) return;
    const go = () => setOn(true);
    card.addEventListener("pointerenter", go, { once: true });
    card.addEventListener("focusin", go, { once: true });
    return () => {
      card.removeEventListener("pointerenter", go);
      card.removeEventListener("focusin", go);
    };
  }, []);
  return (
    <span ref={ref} className="contents">
      {on ? children : null}
    </span>
  );
}
