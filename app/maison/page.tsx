import type { Metadata } from "next";
import Link from "next/link";
import { DemoBanner } from "@/components/ui/PageIntro";
import { Photo } from "@/components/ui/Photo";
import { MaritimeBanner } from "@/components/editorial/MaritimeBanner";
import { pages, seasonImages } from "@/data/images";
import { seasons } from "@/data/collections";
import { RevealTitle, Rise, Parallax, WakeStroke, DrawRule, MaskReveal } from "@/components/animations";

export const metadata: Metadata = {
  title: "Notre histoire",
  description: "L'origine du mot sillage, l'empreinte des saveurs, les voyages qui nous inspirent : l'histoire d'une jeune maison de créations gourmandes.",
  alternates: { canonical: "/maison" },
};

export default function Maison() {
  return (
    <>
      <MaritimeBanner kicker="Notre histoire" title="La trace qu'une saveur laisse derrière elle.">
        Maison Sillage est une jeune maison française de créations gourmandes, en phase de conception. Son esthétique emprunte au XIXe siècle ; son
        histoire, elle, commence aujourd&apos;hui.
      </MaritimeBanner>

      {/* 1 — le mot */}
      <section className="shell grid gap-14 py-24 md:py-32 lg:grid-cols-12" aria-labelledby="mot-titre">
        <div className="lg:col-span-5">
          <p className="mention text-accent-ink">L&apos;origine du mot</p>
          <RevealTitle id="mot-titre" text="Un navire, un parfum." className="titre mt-4" />
          <dl className="mt-10 space-y-6 border-l border-gold pl-6">
            <Rise>
              <dt className="font-serif text-[1.25rem] italic text-accent-ink">sil·lage, n. m.</dt>
              <dd className="mt-3 font-serif text-[1.45rem] leading-snug">1. Trace qu&apos;un navire laisse derrière lui à la surface de l&apos;eau.</dd>
            </Rise>
            <Rise delay={0.1}>
              <dd className="font-serif text-[1.45rem] leading-snug">2. Empreinte qu&apos;un parfum laisse dans l&apos;air après le passage de celui qui le porte.</dd>
            </Rise>
          </dl>
        </div>
        <div className="space-y-6 text-[1.08rem] leading-relaxed text-ink-2 lg:col-span-6 lg:col-start-7">
          <Rise>
            <p className="lettrine">
              Le sillage, c&apos;est d&apos;abord la trace qu&apos;un bateau laisse derrière lui sur l&apos;eau : une ligne d&apos;écume qui
              s&apos;élargit puis s&apos;efface lentement, longtemps après le passage du navire.
            </p>
          </Rise>
          <Rise>
            <p>
              Les parfumeurs ont emprunté le mot pour désigner l&apos;empreinte qu&apos;un parfum laisse dans l&apos;air. On ne voit plus la
              personne, mais on sait qu&apos;elle est passée.
            </p>
          </Rise>
          <Rise>
            <p>
              Nous avons voulu transposer cette image dans l&apos;univers du goût. Une boisson réussie ne s&apos;arrête pas à la dernière gorgée :
              elle laisse un souvenir, une note qui revient. C&apos;est cela, pour nous, l&apos;empreinte d&apos;une saveur.
            </p>
          </Rise>
          <figure className="pt-6">
            <MaskReveal from="bottom" className="aspect-[3/2]">
              <Parallax amount={40} bleed>
                <Photo photo={pages.maison.carnet} sizes="(min-width:1024px) 46vw, 100vw" className="h-full w-full" />
              </Parallax>
            </MaskReveal>
            <figcaption className="mt-3 font-serif text-[0.95rem] italic text-muted">Le carnet ouvert, la boussole, la baie : l&apos;imaginaire de la Maison.</figcaption>
          </figure>
        </div>
      </section>

      {/* 2 — l'empreinte */}
      <section className="bg-deep py-24 text-on-deep md:py-32" aria-labelledby="empreinte-titre">
        <div className="shell max-w-5xl text-center">
          <WakeStroke className="mx-auto w-56 text-gold" />
          <RevealTitle id="empreinte-titre" text="Ce qui reste, après la dernière gorgée." className="titre mt-8" />
          <Rise>
            <p className="chapo mx-auto mt-8 text-on-deep-2">
              Comme un parfum, chacune de nos créations est pensée en trois temps : une ouverture franche, souvent fruitée ; un cœur gourmand ou
              floral ; une finale qui s&apos;attarde. C&apos;est cette finale que nous travaillons le plus longtemps.
            </p>
          </Rise>
          <div className="mt-16 grid gap-10 text-left md:grid-cols-3">
            {[
              ["L'ouverture", "La première impression : la fraise, la pêche, la poire. Lisible dès la première gorgée."],
              ["Le cœur", "Ce qui donne du corps : la madeleine, la crème brûlée, la fleur d'oranger."],
              ["Le sillage", "Ce qui reste : une vanille, un caramel, une note douce qui prolonge le souvenir."],
            ].map(([t, d], i) => (
              <Rise key={t} delay={i * 0.1} className="border-t border-on-deep/20 pt-6">
                <h3 className="font-serif text-2xl text-gold">{t}</h3>
                <p className="mt-3 text-on-deep-2">{d}</p>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — voyages & associations */}
      <section className="shell grid gap-16 py-24 md:py-32 lg:grid-cols-12 lg:items-center" aria-labelledby="voyages-titre">
        <div className="lg:col-span-5">
          <MaskReveal from="left" className="aspect-[4/5]">
            <Photo photo={pages.maison.matieres} sizes="(min-width:1024px) 40vw, 100vw" className="h-full w-full" />
          </MaskReveal>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="mention text-accent-ink">Les voyages et la découverte aromatique</p>
          <RevealTitle id="voyages-titre" text="Des saveurs qui ont traversé des océans." className="titre mt-4" />
          <Rise>
            <p className="mt-8 text-[1.05rem] leading-relaxed text-ink-2">
              La vanille, le cacao, la cannelle, la fleur d&apos;oranger : beaucoup des saveurs qui nous semblent familières ont voyagé longtemps avant
              d&apos;arriver dans nos tasses. Les anciennes routes maritimes, les comptoirs et les carnets de bord nous offrent un imaginaire, une
              manière de raconter les associations que nous composons.
            </p>
          </Rise>
          <DrawRule className="my-12" />
          <h3 className="sous-titre">La recherche d&apos;associations gourmandes</h3>
          <Rise>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-ink-2">
              Chaque création naît d&apos;une rencontre : un fruit et une pâtisserie, un fruit et une fleur. Nous cherchons l&apos;accord qui fonctionne
              dans un latte comme dans un mocktail, dans un chocolat comme dans un dessert. C&apos;est notre promesse : une seule création, plusieurs
              expériences.
            </p>
          </Rise>
          <Link href="/savoir-faire" className="btn btn-encre mt-10">
            Découvrir notre démarche
          </Link>
        </div>
      </section>

      {/* 4 — saisons */}
      <section className="bg-tint py-24 md:py-32" aria-labelledby="saisons-titre">
        <div className="shell">
          <p className="mention text-accent-ink">Les collections saisonnières</p>
          <RevealTitle id="saisons-titre" text="Quatre chapitres, une même traversée." className="titre mt-4 max-w-3xl" />
          <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {seasons.map((s, i) => (
              <Rise as="li" key={s.id} delay={i * 0.06}>
                <Link href={`/collections#${s.id}`} className="group block">
                  <Photo photo={seasonImages[s.id].scene} sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 100vw" className="aspect-[4/5]" position="62% 50%" imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105" />
                  <p className="mt-4 font-serif text-4xl italic" style={{ color: s.accent }}>
                    {s.numeral}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl">{s.name}</h3>
                  <p className="mt-1 font-serif italic text-ink-2">{s.chapter}</p>
                  <span className="lien-revele mt-4 inline-block text-sm font-semibold">Lire le chapitre</span>
                </Link>
              </Rise>
            ))}
          </ol>
        </div>
      </section>

      <section className="shell max-w-4xl py-24" aria-labelledby="honnete-titre">
        <h2 id="honnete-titre" className="sous-titre">
          Ce que nous sommes, et ce que nous ne sommes pas
        </h2>
        <DemoBanner className="mt-6">
          Maison Sillage ne revendique aucune date de fondation historique ni aucun héritage familial. L&apos;esthétique du XIXe siècle est un choix de
          style. Le projet est aujourd&apos;hui en phase de conception : les créations présentées sur ce site sont des prototypes et des pistes de travail,
          sans ateliers, partenaires ou circuits de fabrication établis à ce jour. Les photographies sont des visuels de démonstration.
        </DemoBanner>
      </section>
    </>
  );
}
