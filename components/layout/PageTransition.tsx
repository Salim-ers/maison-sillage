"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useEffect, useRef, useState } from "react";
import { motion, type Variants } from "motion/react";
import { getProduct } from "@/data/products";
import { getRecipe } from "@/data/recipes";
import { getArticle } from "@/data/journal";
import { photo } from "@/data/images";

/* ──────────────────────────────────────────────────────────────
   Transition de page « Le sillage ».
   1. une houle en trois couches (crête dorée, puis le large) monte et recouvre la page ;
   2. le hublot s'ouvre sur le trois-mâts de l'emblème ; « Cap sur … » ;
   3. pendant ce temps la page suivante se charge ; la vague passe et la découvre.
   Les liens internes sont interceptés avant <Link> (phase de capture) : Link voit
   l'événement déjà annulé et laisse la navigation à ce composant. Rien ne change
   en mouvement réduit, au clic molette, avec une touche de modification ou un lien externe.
   ────────────────────────────────────────────────────────────── */

const COVER_S = 0.62; // la houle couvre l'écran
const REVEAL_S = 0.78; // la houle passe et découvre la page
const MIN_HOLD_MS = 1050; // l'emblème et la destination ont le temps de se lire
const NAV_TIMEOUT_MS = 6000;

const PAGES: Record<string, string> = {
  "/boutique": "La Boutique",
  "/sirops": "Les Sirops",
  "/poudres": "Les Poudres",
  "/essentiels": "Les Essentiels",
  "/atelier": "Les Accessoires",
  "/maison": "Notre Maison",
  "/recettes": "Les Recettes",
  "/professionnels": "Les Professionnels",
  "/collections": "Les Quatre Saisons",
  "/savoir-faire": "Le Savoir-faire",
  "/journal": "Le Journal",
  "/panier": "Votre panier",
  "/commande": "La commande",
  "/favoris": "Vos favoris",
  "/faq": "Questions fréquentes",
  "/contact": "Nous écrire",
  "/credits": "Les crédits",
  "/livraison-retours": "Livraison & retours",
  "/mentions-legales": "Mentions légales",
  "/cgv": "Conditions de vente",
  "/confidentialite": "Confidentialité",
};

function destination(path: string, linkText: string): { kicker: string; title: string } {
  if (path === "/") return { kicker: "Retour au port", title: "Maison Sillage" };
  const [, section, slug] = path.split("/");
  const named =
    (section === "produits" && slug && getProduct(slug)?.name) ||
    (section === "recettes" && slug && getRecipe(slug)?.title) ||
    (section === "journal" && slug && getArticle(slug)?.title) ||
    PAGES[path];
  return { kicker: "Cap sur", title: named || linkText || "Maison Sillage" };
}

/* contour d'une nappe d'eau : bord haut (t) et bord bas (b), quatre points chacun, en % de l'écran */
const sea = (t: number[], b: number[]) => `M0,${t[0]} C30,${t[1]} 70,${t[2]} 100,${t[3]} L100,${b[3]} C70,${b[2]} 30,${b[1]} 0,${b[0]} Z`;
const L = (y: number) => [y, y, y, y];
const HIDDEN = sea(L(100), L(100));
const RISING = sea([68, 44, 88, 60], L(100));
const FULL = sea(L(0), L(100));
const PASSING = sea(L(0), [52, 78, 34, 58]);
const GONE = sea(L(0), L(0));

const EMBLEM = photo("brand-emblem-dark");
const EASE_SEA = [0.7, 0, 0.3, 1] as const;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/* trois nappes : la crête dorée mène la montée, le large ferme la marche ; l'ordre s'inverse au passage */
const LAYERS = [
  { fill: "var(--a-gold)", cover: 0, reveal: 0.16 },
  { fill: "var(--a-deep-2)", cover: 0.06, reveal: 0.08 },
  { fill: "var(--a-deep)", cover: 0.12, reveal: 0 },
];

type Phase = "cover" | "reveal";
type Run = { id: number; href: string; path: string; kicker: string; title: string };

export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [run, setRun] = useState<Run | null>(null);
  const [phase, setPhase] = useState<Phase>("cover");
  const state = useRef({ covered: false, arrived: false, revealing: false, start: 0, busy: false });
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const tryReveal = useRef(() => {});
  tryReveal.current = () => {
    const s = state.current;
    if (!run || phase !== "cover" || !s.covered || !s.arrived || s.revealing) return;
    s.revealing = true;
    const wait = Math.max(0, MIN_HOLD_MS - (performance.now() - s.start));
    later(() => {
      setPhase("reveal");
      later(() => {
        document.documentElement.removeAttribute("data-passage");
        state.current.busy = false;
        setRun(null);
      }, (REVEAL_S + 0.2) * 1000);
    }, wait);
  };

  // la page de destination est rendue
  useEffect(() => {
    if (run && pathname === run.path && !state.current.arrived) {
      state.current.arrived = true;
      // une image pour que la nouvelle page soit peinte sous la houle
      requestAnimationFrame(() => tryReveal.current());
    }
  }, [pathname, run]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href || a.target === "_blank" || a.hasAttribute("download") || a.dataset.instant !== undefined) return;
      if (a.closest("[data-glisse]")) return; // carrousel en cours de glisser : ce n'est pas un clic
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // même page (ancre, filtre) : navigation normale
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (state.current.busy) {
        e.preventDefault();
        return;
      }
      e.preventDefault(); // <Link> voit l'événement annulé : il exécute son onClick et nous laisse naviguer
      const href = url.pathname + url.search + url.hash;
      const { kicker, title } = destination(url.pathname, (a.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 60));
      timers.current.forEach(clearTimeout);
      timers.current = [];
      state.current = { covered: false, arrived: false, revealing: false, start: performance.now(), busy: true };
      document.documentElement.setAttribute("data-passage", "1");
      setPhase("cover");
      setRun({ id: Date.now(), href, path: url.pathname, kicker, title });
      later(() => {
        state.current.covered = true;
        startTransition(() => router.push(href));
        tryReveal.current();
      }, (COVER_S + 0.12) * 1000);
      // filet de sécurité : la houle ne reste jamais en place
      later(() => {
        state.current.arrived = true;
        tryReveal.current();
      }, NAV_TIMEOUT_MS);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  if (!run) return null;

  const seaVariants = (l: (typeof LAYERS)[number]): Variants => ({
    cover: { d: [HIDDEN, RISING, FULL], transition: { duration: COVER_S, ease: EASE_SEA, times: [0, 0.55, 1], delay: l.cover } },
    reveal: { d: [FULL, PASSING, GONE], transition: { duration: REVEAL_S, ease: EASE_SEA, times: [0, 0.5, 1], delay: l.reveal } },
  });
  const stage: Variants = {
    cover: { opacity: 1, y: 0, transition: { duration: 0.01 } },
    reveal: { opacity: 0, y: -46, transition: { duration: 0.42, ease: [0.55, 0, 1, 0.45] } },
  };

  return (
    <div className="pointer-events-auto fixed inset-0 z-[95] cursor-wait" aria-hidden key={run.id} data-houle>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {LAYERS.map((l) => (
          <motion.path key={l.fill} fill={l.fill} initial={{ d: HIDDEN }} animate={phase} variants={seaVariants(l)} />
        ))}
      </svg>

      <motion.div className="absolute inset-0 text-on-deep" initial={{ opacity: 1 }} animate={phase} variants={stage}>
        {/* le cap */}
        <div className="absolute inset-x-0 top-[17%] px-6 text-center md:top-[15%]">
          <motion.p
            className="mention text-gold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.58 }}
          >
            {run.kicker}
          </motion.p>
          <span className="mt-3 block overflow-hidden pb-[0.1em]">
            <motion.span
              className="block font-serif text-[clamp(2.1rem,5vw,4.2rem)] font-light italic leading-[1.02]"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.85, ease: EASE_OUT, delay: 0.64 }}
            >
              {run.title}
            </motion.span>
          </span>
        </div>

        {/* l'emblème seul : il s'ouvre comme un hublot, puis s'efface avec la houle */}
        <div className="absolute left-1/2 top-[57%] w-[min(46vw,210px)] -translate-x-1/2 -translate-y-1/2">
          <motion.div
            initial={{ clipPath: "circle(0% at 50% 56%)", scale: 1.14, opacity: 0 }}
            animate={{ clipPath: "circle(78% at 50% 56%)", scale: 1, opacity: 1 }}
            transition={{ duration: 0.95, ease: EASE_OUT, delay: 0.52 }}
          >
            <Image src={EMBLEM.src} alt="" width={EMBLEM.width} height={EMBLEM.height} sizes="210px" className="h-auto w-full select-none" draggable={false} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
