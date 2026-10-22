"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { getImageProps } from "next/image";
import type { Light, SeasonId } from "@/lib/types";
import type { Photo } from "@/data/images";
import { AMBIANCE_KEY, DEFAULT_AMBIANCE, LIGHT_IDS, SEASON_IDS, autoAmbiance, type Ambiance } from "./ambiance-script";

/* ──────────────────────────────────────────────────────────────
   Système d'ambiances — état partagé (saison × lumière).
   Les couleurs vivent dans des variables CSS pilotées par
   data-season / data-light sur <html> ; ce contexte ne sert qu'à
   choisir les photographies et à orchestrer les transitions :
   1. on précharge uniquement les images nécessaires à la prochaine
      ambiance (celles que les composants affichés ont déclarées) ;
   2. puis on bascule, par une View Transition (dévoilement depuis la
      boussole) ou par un fondu doux, en ≈ 1 s.
   ────────────────────────────────────────────────────────────── */

export type { Ambiance };
export type TransitionMode = "cinema" | "doux" | "instant";
type Asset = { photo: Photo; sizes: string; quality?: number };
type AssetSource = (a: Ambiance) => Asset[];

interface AmbianceValue extends Ambiance {
  auto: boolean;
  /** vrai une fois la préférence locale lue (après hydratation) */
  ready: boolean;
  /** une bascule est en préparation (images en cours de chargement) */
  pending: Ambiance | null;
  /** transition en cours : les fondus d'image s'effacent devant la View Transition */
  transitioning: TransitionMode | null;
  setAmbiance: (next: Partial<Ambiance>, opts?: { origin?: { x: number; y: number }; mode?: TransitionMode }) => Promise<void>;
  setAuto: (on: boolean, opts?: { origin?: { x: number; y: number } }) => Promise<void>;
  registerAssets: (source: AssetSource) => () => void;
}

const AmbianceContext = createContext<AmbianceValue | null>(null);

function readDom(): { ambiance: Ambiance; auto: boolean } {
  const d = document.documentElement.dataset;
  const season = SEASON_IDS.includes(d.season as SeasonId) ? (d.season as SeasonId) : DEFAULT_AMBIANCE.season;
  const light = LIGHT_IDS.includes(d.light as Light) ? (d.light as Light) : DEFAULT_AMBIANCE.light;
  return { ambiance: { season, light }, auto: d.auto === "1" };
}

function persist(a: Ambiance, auto: boolean) {
  try {
    window.localStorage.setItem(AMBIANCE_KEY, JSON.stringify({ ...a, auto }));
  } catch {
    /* stockage indisponible : l'ambiance reste valable pour la session */
  }
}

function preload(assets: Asset[], timeout = 1600) {
  const jobs = assets.map(({ photo, sizes, quality = 80 }) => {
    const { props } = getImageProps({ src: photo.src, alt: "", fill: true, sizes, quality });
    const img = new window.Image();
    if (props.sizes) img.sizes = props.sizes;
    if (props.srcSet) img.srcset = props.srcSet;
    img.src = props.src;
    return img.decode().catch(() => undefined);
  });
  return Promise.race([Promise.all(jobs), new Promise((r) => window.setTimeout(r, timeout))]);
}

const THEME_COLOR: Record<Light, string> = { jour: "#fbf8f2", coucher: "#f3e8d4", nuit: "#0d121b" };

export function AmbianceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ ambiance: Ambiance; auto: boolean; ready: boolean }>({ ambiance: DEFAULT_AMBIANCE, auto: false, ready: false });
  const [pending, setPending] = useState<Ambiance | null>(null);
  const [transitioning, setTransitioning] = useState<TransitionMode | null>(null);
  const sources = useRef(new Set<AssetSource>());
  const current = useRef(state);
  current.current = state;
  const ticket = useRef(0);

  useEffect(() => {
    const { ambiance, auto } = readDom();
    setState({ ambiance, auto, ready: true });
    if (auto) persist(ambiance, true);
  }, []);

  const registerAssets = useCallback((source: AssetSource) => {
    sources.current.add(source);
    return () => {
      sources.current.delete(source);
    };
  }, []);

  const commit = useCallback((next: Ambiance, auto: boolean, mode: TransitionMode, origin?: { x: number; y: number }) => {
    const html = document.documentElement;
    const apply = () => {
      html.setAttribute("data-season", next.season);
      html.setAttribute("data-light", next.light);
      html.setAttribute("data-auto", auto ? "1" : "0");
      html.removeAttribute("data-amb-custom");
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[next.light]);
      setState({ ambiance: next, auto, ready: true });
      setPending(null);
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const done = () => {
      html.removeAttribute("data-vt");
      html.classList.remove("amb-doux");
      setTransitioning(null);
    };
    if (reduce || mode === "instant") {
      flushSync(apply);
      return;
    }
    const vt = (document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } }).startViewTransition;
    if (mode === "cinema" && vt) {
      const compact = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
      const x = origin?.x ?? window.innerWidth - 80;
      const y = origin?.y ?? 40;
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      html.style.setProperty("--vt-x", `${x}px`);
      html.style.setProperty("--vt-y", `${y}px`);
      html.style.setProperty("--vt-r", `${Math.ceil(r)}px`);
      html.setAttribute("data-vt", compact ? "fondu" : "revele");
      flushSync(() => setTransitioning("cinema"));
      const t = vt.call(document, () => flushSync(apply));
      t.finished.finally(done);
      return;
    }
    // fondu doux : les couleurs glissent (transitions CSS), les photographies se croisent
    html.classList.add("amb-doux");
    flushSync(() => setTransitioning("doux"));
    flushSync(apply);
    window.setTimeout(done, 1300);
  }, []);

  const go = useCallback(
    async (next: Ambiance, auto: boolean, opts?: { origin?: { x: number; y: number }; mode?: TransitionMode }) => {
      const prev = current.current;
      persist(next, auto);
      if (prev.ambiance.season === next.season && prev.ambiance.light === next.light) {
        if (prev.auto !== auto) setState({ ...prev, auto });
        document.documentElement.setAttribute("data-auto", auto ? "1" : "0");
        return;
      }
      const id = ++ticket.current;
      setPending(next);
      const assets = Array.from(sources.current).flatMap((s) => s(next));
      await preload(assets);
      if (id !== ticket.current) return; // une autre bascule a été demandée entre-temps
      commit(next, auto, opts?.mode ?? "cinema", opts?.origin);
    },
    [commit],
  );

  const setAmbiance = useCallback<AmbianceValue["setAmbiance"]>(
    (partial, opts) => go({ ...current.current.ambiance, ...partial }, false, opts),
    [go],
  );

  const setAuto = useCallback<AmbianceValue["setAuto"]>(
    (on, opts) => (on ? go(autoAmbiance(), true, opts) : go(current.current.ambiance, false, opts)),
    [go],
  );

  const value = useMemo<AmbianceValue>(
    () => ({ ...state.ambiance, auto: state.auto, ready: state.ready, pending, transitioning, setAmbiance, setAuto, registerAssets }),
    [state, pending, transitioning, setAmbiance, setAuto, registerAssets],
  );

  return <AmbianceContext.Provider value={value}>{children}</AmbianceContext.Provider>;
}

export function useAmbiance() {
  const ctx = useContext(AmbianceContext);
  if (!ctx) throw new Error("useAmbiance doit être utilisé dans <AmbianceProvider>");
  return ctx;
}

/** Déclare les photographies qu'un composant affichera pour une ambiance donnée,
 *  afin qu'elles soient préchargées avant la bascule. */
export function useAmbianceAssets(source: AssetSource) {
  const { registerAssets } = useAmbiance();
  const ref = useRef(source);
  ref.current = source;
  useEffect(() => registerAssets((a) => ref.current(a)), [registerAssets]);
}
