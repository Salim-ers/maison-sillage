"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "@/lib/useReduced";
import { home } from "@/data/images";
import type { Photo as PhotoData } from "@/data/images";
import { products, startingPrice } from "@/data/products";
import type { Category } from "@/lib/types";
import { Photo } from "@/components/ui/Photo";
import { MaskReveal, Parallax, RevealTitle, Rise } from "@/components/animations";
import { cn, formatPrice } from "@/lib/utils";

const range = (c: Category[]) => products.filter((p) => c.includes(p.category));
const fromPrice = (c: Category[]) => Math.min(...range(c).map((p) => startingPrice(p).price ?? Infinity));

/* quatre univers, des repères concrets plutôt qu'une numérotation */
const UNIVERS: { key: string; title: string; text: string; facts: string; href: string; cta: string; photo: PhotoData; aspect: string; col: string; depth: number; sizes: string }[] = [
  {
    key: "sirops",
    title: "Les sirops signatures",
    text: "Quatre créations de saison et quatre Signatures de la Maison, dans un même flacon : pour le café, le latte, les boissons glacées et les mocktails.",
    facts: `${range(["sirop"]).length} sirops · dès ${formatPrice(fromPrice(["sirop"]))}`,
    href: "/sirops",
    cta: "Les sirops",
    photo: home.univers.sirops,
    aspect: "aspect-[16/10]",
    col: "md:col-span-7",
    depth: 40,
    sizes: "(min-width:768px) 56vw, 100vw",
  },
  {
    key: "poudres",
    title: "Les poudres signatures",
    text: "Les saveurs de saison et quatre créations à fouetter dans le lait, chaud ou froid, pour des lattes et des chocolats plus ronds.",
    facts: `${range(["poudre"]).length} poudres · sachet 200 g`,
    href: "/poudres",
    cta: "Les poudres",
    photo: home.univers.poudres,
    aspect: "aspect-[4/5]",
    col: "md:col-span-5 md:mt-40",
    depth: 80,
    sizes: "(min-width:768px) 40vw, 100vw",
  },
  {
    key: "essentiels",
    title: "Les Essentiels de la Maison",
    text: "Les grands classiques, sans détour : chocolat noir, au lait ou blanc, vanille, caramel, noisette, pistache et chaï.",
    facts: `${range(["essentiel"]).length} classiques · dès ${formatPrice(fromPrice(["essentiel"]))}`,
    href: "/essentiels",
    cta: "Les Essentiels",
    photo: home.univers.essentiels,
    aspect: "aspect-[4/5]",
    col: "md:col-span-4 md:col-start-2 md:-mt-64 lg:-mt-72",
    depth: 50,
    sizes: "(min-width:768px) 32vw, 100vw",
  },
  {
    key: "atelier",
    title: "L'Atelier & les accessoires",
    text: "Mug, tasse en grès, verre à latte glacé, carafe, carnet de recettes et coffret découverte : les objets du comptoir.",
    facts: `${range(["accessoire", "coffret"]).length} objets & coffret`,
    href: "/atelier",
    cta: "L'Atelier",
    photo: home.univers.atelier,
    aspect: "aspect-[4/5]",
    col: "md:col-span-4 md:col-start-8 md:mt-10",
    depth: 70,
    sizes: "(min-width:768px) 32vw, 100vw",
  },
];

/** Bord supérieur en houle et sillage doré qui se trace pendant que la section recouvre le hero */
function Houle() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.25"] });
  const draw = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.05, 1]);
  return (
    <div ref={ref} className="absolute inset-x-0 bottom-full -mb-px h-[64px] md:h-[110px]" aria-hidden>
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="h-full w-full text-page">
      <path d="M0 120 L0 70 C 180 30, 360 22, 560 52 S 900 112, 1120 70 S 1350 18, 1440 34 L1440 120 Z" fill="currentColor" />
      <motion.path
        d="M-10 86 C 200 40, 380 40, 560 64 S 900 118, 1120 82 S 1360 32, 1450 46"
        fill="none"
        stroke="var(--a-gold)"
        strokeWidth="1.4"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: draw }}
      />
      <motion.path
        d="M120 100 C 300 70, 460 74, 620 88 S 900 120, 1060 98"
        fill="none"
        stroke="var(--a-gold)"
        strokeOpacity=".45"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: draw }}
      />
    </svg>
    </div>
  );
}

/* Section 2 — l'univers de la Maison : quatre rayons, une mise en page éditoriale asymétrique */
export function Monde() {
  return (
    <section className="relative z-10 mt-[64px] bg-page pb-28 pt-12 md:mt-[110px] md:pb-40 md:pt-16" aria-labelledby="monde-titre">
      <Houle />
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Rise>
              <p className="mention text-accent-ink">L&apos;univers de la Maison</p>
            </Rise>
            <RevealTitle id="monde-titre" text="L'art de donner une nouvelle dimension aux saveurs." className="titre mt-5 max-w-[17ch]" />
          </div>
          <Rise className="lg:col-span-4" delay={0.15}>
            <p className="font-serif text-[1.45rem] italic leading-snug text-ink-2 md:text-[1.6rem]">
              « Chaque création est une invitation à découvrir de nouveaux accords, à réinventer une boisson et à prolonger le plaisir d&apos;un instant. »
            </p>
          </Rise>
        </div>

        <div className="mt-20 grid gap-y-20 md:mt-28 md:grid-cols-12 md:gap-x-8 md:gap-y-24 lg:gap-x-10">
          {UNIVERS.map((u, i) => (
            <article key={u.key} className={cn("group", u.col)}>
              <Link href={u.href} className="block" aria-label={`${u.title} — ${u.cta}`}>
                <MaskReveal from={i % 2 ? "top" : "bottom"} delay={i * 0.06} className={u.aspect}>
                  <Parallax amount={u.depth} bleed>
                    <Photo
                      photo={u.photo}
                      sizes={u.sizes}
                      className="h-full w-full"
                      imgClassName="transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]"
                    />
                  </Parallax>
                </MaskReveal>
              </Link>
              <Rise className="mt-7" delay={0.1}>
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent-ink">{u.facts}</p>
                  <h3 className="mt-2 font-serif text-[1.9rem] leading-tight md:text-[2.15rem]">
                    <Link href={u.href} className="transition-colors hover:text-accent-ink">
                      {u.title}
                    </Link>
                  </h3>
                  <p className="mt-3 max-w-sm text-ink-2/90">{u.text}</p>
                  <Link href={u.href} className="mt-5 inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.18em]">
                    <span className="lien-revele">{u.cta}</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.4} />
                  </Link>
                </div>
              </Rise>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
