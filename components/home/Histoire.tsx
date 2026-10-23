"use client";

import Link from "next/link";
import { useAmbiance, useAmbianceAssets } from "@/lib/ambiance";
import { storyDetail, storyPhoto } from "@/data/images";
import { AmbientImage } from "@/components/ambiance/AmbientImage";
import { MaskReveal, Parallax, RevealTitle, Rise, WakeStroke } from "@/components/animations";

const MAIN_SIZES = "(min-width:1024px) 58vw, 100vw";
const DETAIL_SIZES = "(min-width:1024px) 18vw, 40vw";

/* Dernière section — l'histoire de la Maison : retour au large, une autre vue maritime que le hero */
export function Histoire() {
  const amb = useAmbiance();
  const main = storyPhoto(amb.season);
  const detail = storyDetail(amb.season);
  useAmbianceAssets((a) => [
    { photo: storyPhoto(a.season), sizes: MAIN_SIZES },
    { photo: storyDetail(a.season), sizes: DETAIL_SIZES },
  ]);

  return (
    <section className="relative z-10 overflow-hidden bg-page py-24 md:py-36" aria-labelledby="histoire-titre">
      <WakeStroke className="pointer-events-none absolute -left-24 top-16 hidden w-[42rem] text-gold/60 lg:block" />
      <div className="shell grid gap-16 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="relative lg:col-span-7">
          <MaskReveal from="left" className="aspect-[4/5] sm:aspect-[5/4]">
            <Parallax amount={50} bleed>
              <div className="relative h-full w-full bg-tint">
                <AmbientImage photo={main} sizes={MAIN_SIZES} />
              </div>
            </Parallax>
          </MaskReveal>
          <Parallax amount={70} className="absolute -bottom-12 right-4 w-[42%] sm:-right-6 sm:w-[34%] lg:-right-12">
            <Rise delay={0.3}>
              <figure className="rotate-[2deg] bg-paper p-2 shadow-[0_30px_60px_-24px_rgba(20,12,6,.55)]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <AmbientImage photo={detail} sizes={DETAIL_SIZES} />
                </div>
                <figcaption className="px-1 pb-1 pt-2 font-serif text-[0.85rem] italic text-muted">Carnet de bord</figcaption>
              </figure>
            </Rise>
          </Parallax>
        </div>

        <div className="lg:col-span-5 lg:pl-10">
          <Rise>
            <p className="mention text-accent-ink">L&apos;histoire de la Maison</p>
          </Rise>
          <RevealTitle id="histoire-titre" text="Chaque grande histoire commence par un voyage." className="titre mt-5" />
          <Rise delay={0.1}>
            <p className="chapo mt-8 text-ink-2">
              « Un sillage est la trace qu&apos;un navire laisse derrière lui. Maison Sillage s&apos;inspire de cette empreinte pour imaginer des saveurs qui
              prolongent l&apos;expérience et restent en mémoire. »
            </p>
          </Rise>
          <Rise delay={0.2}>
            <blockquote className="mt-10 border-l border-gold pl-6">
              <p className="font-serif text-[1.9rem] italic leading-[1.2] text-ink md:text-[2.2rem]">Une saveur passe, son sillage demeure.</p>
              <footer className="mention mt-3 text-muted">Devise de la Maison</footer>
            </blockquote>
          </Rise>
          <Rise delay={0.3}>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-muted">
              Une jeune maison, sans date de fondation ni héritage revendiqué : l&apos;esthétique du XIXe siècle est un choix de style, l&apos;histoire commence aujourd&apos;hui.
            </p>
            <Link href="/maison" className="btn btn-encre mt-9">
              Notre histoire
            </Link>
          </Rise>
        </div>
      </div>
    </section>
  );
}
