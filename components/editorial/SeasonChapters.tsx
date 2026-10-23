"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { seasons } from "@/data/collections";
import { productsBySeason } from "@/data/products";
import { recipes } from "@/data/recipes";
import { seasonImages } from "@/data/images";
import { Photo } from "@/components/ui/Photo";
import { ProductMini } from "@/components/products/ProductMini";
import { SeasonIcon } from "@/components/ambiance/icons";
import { MaskReveal, Parallax, RevealTitle, Rise } from "@/components/animations";
import type { SeasonId } from "@/lib/types";
import { cn } from "@/lib/utils";

/* Les quatre chapitres : chacun son paysage, sa matière, son sirop et sa poudre */
export function SeasonChapters() {
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
    <div className="relative">
      <nav aria-label="Chapitres" className="sticky top-[var(--header-h)] z-20 border-y border-line bg-[var(--a-header)] backdrop-blur-xl">
        <ul className="shell no-scrollbar flex gap-1 overflow-x-auto py-2">
          {seasons.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={current === s.id ? "true" : undefined}
                className={cn("flex items-center gap-2 whitespace-nowrap px-3 py-2 transition-opacity duration-500", current === s.id ? "opacity-100" : "opacity-50 hover:opacity-90")}
              >
                <SeasonIcon season={s.id} className="h-4 w-4" />
                <span className="font-serif text-lg">{s.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {seasons.map((s, idx) => {
        const items = productsBySeason(s.id);
        const recs = recipes.filter((r) => r.products.some((slug) => items.some((p) => p.slug === slug)));
        const img = seasonImages[s.id];
        const flip = idx % 2 === 1;
        return (
          <section key={s.id} id={s.id} className={cn("chapitre scroll-mt-32 py-20 md:py-28", idx % 2 ? "bg-tint" : "bg-page")} aria-labelledby={`titre-${s.id}`}>
            <div className="shell">
              <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:gap-10", flip && "md:flex-row-reverse md:text-right")}>
                <SeasonIcon season={s.id} className="h-14 w-14 shrink-0 md:h-20 md:w-20" />
                <div>
                  <p className="mention text-accent-ink">
                    {s.name}
                  </p>
                  <RevealTitle id={`titre-${s.id}`} text={s.chapter} className="titre mt-3" />
                </div>
              </div>

              <MaskReveal from={flip ? "right" : "left"} className="mt-12 aspect-[4/3] md:aspect-[21/9]">
                <Parallax amount={60} bleed>
                  <Photo photo={img.paysage} sizes="100vw" className="h-full w-full" />
                </Parallax>
              </MaskReveal>

              <div className="mt-14 grid gap-14 lg:grid-cols-12">
                <div className={cn("lg:col-span-5", flip && "lg:order-2 lg:col-start-8")}>
                  <Rise>
                    <p className="text-[1.08rem] leading-relaxed text-ink-2">{s.intro}</p>
                  </Rise>
                  <Rise delay={0.1}>
                    <blockquote className="mt-8 border-l-2 pl-5 font-serif text-2xl italic leading-snug" style={{ borderColor: s.accent }}>
                      « {s.carnet} »
                    </blockquote>
                  </Rise>
                  <ul className="mt-7 flex flex-wrap gap-2" aria-label="Ambiance">
                    {s.mood.map((m) => (
                      <li key={m} className="rounded-full border border-line px-3 py-1 text-sm">
                        {m}
                      </li>
                    ))}
                  </ul>

                </div>
                <div className={cn("lg:col-span-6", flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-7")}>
                  <figure>
                    <MaskReveal from="bottom" className="aspect-[16/10]">
                      <Photo photo={img.matiere} sizes="(min-width:1024px) 48vw, 100vw" className="h-full w-full" />
                    </MaskReveal>
                    <figcaption className="mt-2 text-xs text-muted">{img.matiere.alt}</figcaption>
                  </figure>
                  <h3 className="mention mt-10 text-accent-ink">Les créations du chapitre</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {items.map((p) => (
                      <ProductMini key={p.slug} product={p} />
                    ))}
                  </div>
                  {recs.length > 0 && (
                    <>
                      <h3 className="mention mt-10 text-accent-ink">Recettes du chapitre</h3>
                      <ul className="mt-3 divide-y divide-line border-y border-line">
                        {recs.map((r) => (
                          <li key={r.slug}>
                            <Link href={`/recettes/${r.slug}`} className="group flex items-baseline justify-between gap-4 py-3.5 font-serif text-xl transition-colors hover:text-accent-ink">
                              {r.title}
                              <span className="font-sans text-xs text-muted">{r.temps}</span>
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
    </div>
  );
}
