import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, DemoBanner } from "@/components/ui/PageIntro";
import { Photo } from "@/components/ui/Photo";
import { pages } from "@/data/images";
import { MaskReveal, RevealTitle, Rise } from "@/components/animations";

export const metadata: Metadata = {
  title: "Savoir-faire",
  description: "De l'inspiration à la future fabrication : la démarche de création de Maison Sillage, projet en phase de conception.",
  alternates: { canonical: "/savoir-faire" },
};

const STEPS = [
  { title: "Inspiration", text: "Un souvenir, une saison, une matière croisée en voyage : chaque création commence par une image notée dans le carnet de bord." },
  { title: "Association gustative", text: "Nous cherchons l'accord : un fruit et une pâtisserie, un fruit et une fleur. L'association doit fonctionner dans plusieurs boissons." },
  { title: "Prototype", text: "Les premières versions sont préparées en petites quantités, pour vérifier que l'idée tient ses promesses." },
  { title: "Dégustation", text: "Chaque prototype est goûté dans un latte, une boisson glacée, un chocolat : c'est l'usage qui juge la saveur." },
  { title: "Amélioration", text: "Équilibre du sucre, intensité, longueur en bouche : on ajuste, on recommence, jusqu'à ce que la finale s'attarde juste assez." },
  { title: "Future fabrication", text: "L'étape à venir : choisir les filières, les partenaires et le mode de production. Rien n'est encore arrêté." },
];

export default function SavoirFaire() {
  return (
    <>
      <PageIntro kicker="Savoir-faire" title="De l'idée à la tasse, pas à pas.">
        Voici la démarche que nous suivons pour imaginer nos créations. Le projet est en phase de conception : les dernières étapes restent devant
        nous.
      </PageIntro>

      <section className="shell pb-24" aria-labelledby="etapes-titre">
        <h2 id="etapes-titre" className="sr-only">
          Les étapes de création
        </h2>
        <ol className="relative">
          <span className="absolute bottom-6 left-[2.2rem] top-6 hidden w-px bg-line md:block" aria-hidden />
          {STEPS.map((s, i) => {
            const done = i < 4;
            return (
              <Rise as="li" key={s.title} className="relative grid gap-6 border-b border-line py-10 md:grid-cols-[4.5rem_1fr_15rem] md:items-center md:gap-10">
                <span
                  className={`relative z-10 grid h-[4.4rem] w-[4.4rem] place-items-center rounded-full border font-serif text-2xl ${done ? "border-inverse bg-inverse text-on-inverse" : "border-line bg-page text-ink-2"}`}
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-serif text-[2rem] leading-tight">{s.title}</h3>
                  <p className="mt-2 max-w-2xl text-ink-2">{s.text}</p>
                  <p className="mt-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent-ink">{done ? "Étape en cours de travail" : "Étape à venir"}</p>
                </div>
                <MaskReveal from="right" className="aspect-[3/2] w-full md:w-60">
                  <Photo photo={pages.savoirFaire[i]} sizes="(min-width:768px) 15rem, 100vw" className="h-full w-full" />
                </MaskReveal>
              </Rise>
            );
          })}
        </ol>
        <DemoBanner className="mt-12 max-w-3xl">
          Nous ne présentons ni atelier, ni usine, ni partenaire industriel : ils n&apos;existent pas encore. Les informations de fabrication seront
          publiées lorsqu&apos;elles seront établies.
        </DemoBanner>
      </section>

      <section className="bg-deep py-24 text-on-deep">
        <div className="shell grid gap-10 md:grid-cols-2 md:items-end">
          <RevealTitle text="Vous êtes un établissement et souhaitez suivre le projet ?" className="titre" />
          <Rise>
            <p className="text-on-deep-2">Nous préparons une offre pour les professionnels : formats adaptés, recettes signatures, échantillons envisagés.</p>
            <Link href="/professionnels" className="btn btn-clair mt-8">
              Espace professionnels
            </Link>
          </Rise>
        </div>
      </section>
    </>
  );
}
