"use client";

import { useEffect } from "react";

const MIN_FULL = 1700; // première visite : le logo se dévoile, le sillage se trace
const MIN_SHORT = 750; // visites suivantes de la session
const MAX = 3600; // au-delà, le rideau se lève quoi qu'il arrive

const loaded = (img: HTMLImageElement) =>
  img.complete
    ? Promise.resolve()
    : new Promise<void>((r) => {
        img.addEventListener("load", () => r(), { once: true });
        img.addEventListener("error", () => r(), { once: true });
      });

/**
 * Lève le rideau de l'écran d'ouverture (rendu dans le HTML, voir app/layout.tsx) quand la page
 * est prête : polices chargées et photographies prioritaires affichables, après une durée minimale
 * pour que l'animation du logo se lise. Les animations d'entrée du hero démarrent à ce moment.
 */
export function IntroCurtain() {
  useEffect(() => {
    const html = document.documentElement;
    if (html.getAttribute("data-intro") !== "on") return;
    const min = html.hasAttribute("data-intro-court") ? MIN_SHORT : MIN_FULL;
    let done = false;
    const timers: number[] = [];
    const finish = () => {
      if (done) return;
      done = true;
      html.setAttribute("data-intro", "done");
      timers.push(window.setTimeout(() => html.setAttribute("data-intro", "off"), 1150));
    };
    // performance.now() part du début de la navigation : le temps déjà écoulé compte
    const wait = (ms: number) => new Promise<void>((r) => timers.push(window.setTimeout(r, Math.max(0, ms - performance.now()))));
    const priority = Array.from(document.querySelectorAll<HTMLImageElement>('main img[fetchpriority="high"], main img[loading="eager"]'));
    Promise.all([document.fonts?.ready ?? Promise.resolve(), Promise.all(priority.map(loaded)), wait(min)]).then(finish);
    timers.push(window.setTimeout(finish, Math.max(0, MAX - performance.now())));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);
  return null;
}
