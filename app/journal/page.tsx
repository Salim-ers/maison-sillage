import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { Figure } from "@/components/ui/Figure";
import { Botanical } from "@/components/visuals/Botanical";
import { articles } from "@/data/journal";
import { scenes } from "@/data/media";
import { Rise } from "@/components/animations";
import type { BotanicalId } from "@/lib/types";

export const metadata: Metadata = {
  title: "Le Journal",
  description: "Histoire du sirop, art du latte, saisons, cartes de boissons, routes maritimes : les articles d'exemple du Journal Maison Sillage.",
  alternates: { canonical: "/journal" },
};

const ICONS: Record<string, BotanicalId> = { alambic: "fleur-oranger", verre: "cafe", saisons: "poire", comptoir: "madeleine", carte: "vanille" };

export default function Journal() {
  return (
    <>
      <PageIntro kicker="Le Journal" title="Carnet de bord d'une maison de saveurs." aside={<Figure scene={scenes.journalIndex} reveal="right" priority sizes="(min-width:1024px) 40vw, 100vw" />}>
        Histoires de saveurs, gestes de barista, idées pour les professionnels. Les articles ci-dessous sont des exemples qui préfigurent la
        ligne éditoriale du futur Journal.
      </PageIntro>
      <section className="shell pb-28" aria-label="Articles">
        <ol className="border-t border-espresso/20">
          {articles.map((a, i) => (
            <Rise as="li" key={a.slug} delay={i * 0.04} className="border-b border-espresso/20">
              <Link href={`/journal/${a.slug}`} className="group grid items-center gap-6 py-8 md:grid-cols-[6rem_1fr_14rem] md:gap-10">
                <span className="hidden h-20 w-20 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-rotate-6 group-hover:scale-110 md:block">
                  <Botanical id={ICONS[a.visual]} className="h-full w-full" />
                </span>
                <span>
                  <span className="text-[0.7rem] uppercase tracking-[0.18em] text-bronze-ink">
                    {a.rubrique} · Article d&apos;exemple
                  </span>
                  <span className="mt-2 block font-serif text-[clamp(1.8rem,3vw,2.6rem)] leading-tight transition-colors group-hover:text-espresso">{a.title}</span>
                  <span className="mt-2 block max-w-2xl text-espresso/80">{a.chapo}</span>
                </span>
                <span className="text-sm text-espresso/70 md:text-right">
                  Lecture {a.lecture}
                  <span className="lien-revele ml-3 font-semibold text-encre">Lire</span>
                </span>
              </Link>
            </Rise>
          ))}
        </ol>
      </section>
    </>
  );
}
