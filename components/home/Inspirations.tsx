import Link from "next/link";
import { scenes } from "@/data/media";
import { Figure } from "@/components/ui/Figure";
import { Botanical } from "@/components/visuals/Botanical";
import { RevealTitle, Rise, WakeStroke } from "@/components/animations";
import type { BotanicalId } from "@/lib/types";

const PILLARS: { title: string; text: string; icon: BotanicalId }[] = [
  {
    title: "Les routes maritimes",
    text: "La vanille, le cacao, la cannelle ont traversé des océans avant d'arriver dans nos cuisines. Nous empruntons à ces voyages leur goût du lointain.",
    icon: "vanille",
  },
  {
    title: "Les comptoirs d'épices",
    text: "Des sacs de toile, des pesées, des mélanges : l'idée qu'une saveur se compose, qu'elle naît d'une association.",
    icon: "chai",
  },
  {
    title: "Les étiquettes d'apothicaire",
    text: "Le sirop a longtemps vécu dans les officines. Nos étiquettes gravées en gardent la typographie et le soin du détail.",
    icon: "fleur-oranger",
  },
];

/* Chapitre 8 — l'histoire des grandes inspirations */
export function Inspirations() {
  return (
    <section className="relative overflow-hidden bg-parchemin/60 py-24 md:py-36" aria-labelledby="inspirations-titre">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="mention text-bronze-ink">Nos inspirations</p>
            <RevealTitle id="inspirations-titre" text="Sur la trace des routes anciennes." className="titre mt-4" />
          </div>
          <Rise className="lg:col-span-5 lg:col-start-8">
            <p className="text-espresso">
              Maison Sillage est une jeune maison, en phase de conception. Nous ne revendiquons aucun héritage : nous empruntons simplement à
              l&apos;histoire des voyages un vocabulaire, une curiosité et une manière de raconter les saveurs.
            </p>
          </Rise>
        </div>
        <div className="mt-14">
          <Figure scene={scenes.histoire} parallax reveal="top" sizes="100vw" caption="La route des saveurs, telle que la rêve notre carnet de bord." />
        </div>
        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {PILLARS.map((p, i) => (
            <Rise key={p.title} delay={i * 0.1}>
              <Botanical id={p.icon} className="h-20 w-20" />
              <h3 className="mt-5 font-serif text-[1.7rem] leading-tight">{p.title}</h3>
              <p className="mt-3 text-espresso/85">{p.text}</p>
            </Rise>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link href="/maison" className="btn btn-encre">
            Lire l&apos;histoire de la Maison
          </Link>
          <Link href="/journal/l-inspiration-des-routes-maritimes" className="lien text-sm font-semibold">
            Article : les anciennes routes maritimes
          </Link>
        </div>
      </div>
      <WakeStroke className="pointer-events-none absolute -right-20 top-24 hidden w-[36rem] text-bronze/60 lg:block" />
    </section>
  );
}
