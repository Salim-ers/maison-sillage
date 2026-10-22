"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "@/lib/useReduced";
import { home } from "@/data/images";
import type { Photo as PhotoData } from "@/data/images";
import { Photo } from "@/components/ui/Photo";
import { MaskReveal, Parallax, RevealTitle, Rise } from "@/components/animations";
import { cn } from "@/lib/utils";

const UNIVERS: { n: string; title: string; text: string; href: string; cta: string; photo: PhotoData; aspect: string; col: string; depth: number; sizes: string }[] = [
  {
    n: "I",
    title: "Les sirops signatures",
    text: "Quatre créations saisonnières dans un même flacon gravé, pour le café, le latte, les boissons glacées et les mocktails.",
    href: "/sirops",
    cta: "Découvrir les sirops",
    photo: home.monde.sirops,
    aspect: "aspect-[4/3]",
    col: "md:col-span-7 lg:col-span-6",
    depth: 50,
    sizes: "(min-width:1024px) 46vw, (min-width:768px) 56vw, 100vw",
  },
  {
    n: "II",
    title: "Les poudres gourmandes",
    text: "Des préparations à fouetter dans le lait chaud ou froid, pour des lattes, des chocolats et des frappés onctueux.",
    href: "/poudres",
    cta: "Découvrir les poudres",
    photo: home.monde.poudres,
    aspect: "aspect-[3/4]",
    col: "md:col-span-5 md:mt-48 lg:col-span-3 lg:mt-56",
    depth: 90,
    sizes: "(min-width:1024px) 23vw, (min-width:768px) 40vw, 100vw",
  },
  {
    n: "III",
    title: "Les recettes & créations",
    text: "Latte, iced latte, mocktail, chocolat chaud, dessert : une saveur, mille façons de la déguster.",
    href: "/recettes",
    cta: "Explorer les recettes",
    photo: home.monde.recettes,
    aspect: "aspect-[4/5] lg:aspect-[3/4.4]",
    col: "md:col-span-8 md:col-start-3 lg:col-span-3 lg:col-start-auto lg:mt-20",
    depth: 30,
    sizes: "(min-width:1024px) 23vw, (min-width:768px) 64vw, 100vw",
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

/* Section 2 — le monde Maison Sillage : trois univers, une mise en page éditoriale asymétrique */
export function Monde() {
  return (
    <section className="relative z-10 mt-[64px] bg-page pb-28 pt-12 md:mt-[110px] md:pb-40 md:pt-16" aria-labelledby="monde-titre">
      <Houle />
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Rise>
              <p className="mention text-accent-ink">Le monde Maison Sillage</p>
            </Rise>
            <RevealTitle id="monde-titre" text="L'art de donner une nouvelle dimension aux saveurs." className="titre mt-5 max-w-[17ch]" />
          </div>
          <Rise className="lg:col-span-4" delay={0.15}>
            <p className="font-serif text-[1.45rem] italic leading-snug text-ink-2 md:text-[1.6rem]">
              « Chaque création est une invitation à découvrir de nouveaux accords, à réinventer une boisson et à prolonger le plaisir d&apos;un instant. »
            </p>
          </Rise>
        </div>

        <div className="mt-20 grid gap-y-20 md:mt-28 md:grid-cols-12 md:gap-x-8 lg:gap-x-10">
          {UNIVERS.map((u, i) => (
            <article key={u.n} className={cn("group", u.col)}>
              <Link href={u.href} className="block" aria-label={`${u.title} — ${u.cta}`}>
                <MaskReveal from={i === 1 ? "top" : "bottom"} delay={i * 0.08} className={u.aspect}>
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
              <Rise className="mt-7 flex gap-5" delay={0.1}>
                <span className="font-serif text-[2.6rem] italic leading-none text-accent">{u.n}.</span>
                <div>
                  <h3 className="font-serif text-[1.9rem] leading-tight md:text-[2.15rem]">
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
