"use client";

import { useReducedMotion } from "@/lib/useReduced";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { seasons } from "@/data/collections";
import { productsBySeason } from "@/data/products";
import { recipes } from "@/data/recipes";
import { seasonChapter } from "@/data/media";
import { Figure } from "@/components/ui/Figure";
import { ProductMini } from "@/components/products/ProductMini";
import { RevealTitle, Rise } from "@/components/animations";
import type { SeasonId } from "@/lib/types";

/* Les quatre chapitres : le fond de page glisse d'une saison à l'autre au fil du défilement */
export function SeasonChapters() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.5", "end 0.5"] });
  const stops = seasons.map((_, i) => i / (seasons.length - 1));
  const bg = useTransform(scrollYProgress, stops, seasons.map((s) => s.bg));
  const ink = useTransform(scrollYProgress, stops, seasons.map((s) => s.ink));
  const [current, setCurrent] = useState<SeasonId>("printemps");

  useEffect(() => {
    const els = seasons.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(e.target.id as SeasonId);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <motion.div ref={ref} style={reduce ? undefined : { backgroundColor: bg, color: ink }} className="relative">
      {/* sommaire collant */}
      <motion.nav aria-label="Chapitres" style={reduce ? { backgroundColor: "#f3e8d4" } : { backgroundColor: bg }} className="sticky top-[var(--header-h)] z-20 border-b border-current/15">
        <ul className="shell no-scrollbar flex gap-1 overflow-x-auto py-2">
          {seasons.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={current === s.id ? "true" : undefined}
                className={`flex items-baseline gap-2 whitespace-nowrap px-3 py-2 transition-opacity ${current === s.id ? "opacity-100" : "opacity-55 hover:opacity-90"}`}
              >
                <span className="font-serif text-sm italic">{s.numeral}</span>
                <span className="font-serif text-lg">{s.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </motion.nav>

      {seasons.map((s, idx) => {
        const items = productsBySeason(s.id);
        const recs = recipes.filter((r) => r.products.some((slug) => items.some((p) => p.slug === slug)));
        const flip = idx % 2 === 1;
        return (
          <section key={s.id} id={s.id} className="scroll-mt-32 py-20 md:py-28" aria-labelledby={`titre-${s.id}`} style={reduce ? { backgroundColor: s.bg, color: s.ink } : undefined}>
            <div className="shell">
              <div className={`grid gap-10 lg:grid-cols-12 lg:items-end ${flip ? "lg:text-right" : ""}`}>
                <div className={`lg:col-span-8 ${flip ? "lg:col-start-5" : ""}`}>
                  <p className="font-serif text-[clamp(4rem,10vw,9rem)] italic leading-none opacity-25" aria-hidden>
                    {s.numeral}
                  </p>
                  <p className="mention mt-2 opacity-80">Chapitre {s.numeral} · {s.name}</p>
                  <RevealTitle id={`titre-${s.id}`} text={s.chapter} className="titre mt-3" />
                </div>
              </div>

              <div className="mt-12">
                <Figure scene={seasonChapter[s.id]} parallax reveal={flip ? "right" : "left"} sizes="100vw" />
              </div>

              <div className="mt-12 grid gap-12 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <Rise>
                    <p className="text-[1.08rem] leading-relaxed">{s.intro}</p>
                  </Rise>
                  <Rise delay={0.1}>
                    <blockquote className="mt-8 border-l-2 pl-5 font-serif text-2xl italic leading-snug" style={{ borderColor: s.accent }}>
                      « {s.carnet} »
                    </blockquote>
                  </Rise>
                  <p className="mt-6 text-sm opacity-75">Ambiance : {s.ambiance.join(", ")}.</p>
                </div>
                <div className="lg:col-span-6 lg:col-start-7">
                  <h3 className="mention opacity-80">Les créations du chapitre</h3>
                  <div className="mt-4 grid gap-3">
                    {items.map((p) => (
                      <ProductMini key={p.slug} product={p} />
                    ))}
                  </div>
                  {recs.length > 0 && (
                    <>
                      <h3 className="mention mt-10 opacity-80">Recettes recommandées</h3>
                      <ul className="mt-3 divide-y divide-current/15 border-y border-current/15">
                        {recs.map((r) => (
                          <li key={r.slug}>
                            <Link href={`/recettes/${r.slug}`} className="flex items-baseline justify-between gap-4 py-3.5 font-serif text-xl hover:opacity-75">
                              {r.title}
                              <span className="font-sans text-xs opacity-70">{r.temps}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </motion.div>
  );
}
