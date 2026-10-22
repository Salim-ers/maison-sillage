import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { Photo } from "@/components/ui/Photo";
import { articles } from "@/data/journal";
import { articlePhotos } from "@/data/images";
import { Rise } from "@/components/animations";

export const metadata: Metadata = {
  title: "Le Journal",
  description: "Histoire du sirop, art du latte, saisons, cartes de boissons, routes maritimes : les articles d'exemple du Journal Maison Sillage.",
  alternates: { canonical: "/journal" },
};

export default function Journal() {
  return (
    <>
      <PageIntro kicker="Le Journal" title="Carnet de bord d'une maison de saveurs.">
        Histoires de saveurs, gestes de barista, idées pour les professionnels. Les articles ci-dessous sont des exemples qui préfigurent la ligne
        éditoriale du futur Journal.
      </PageIntro>
      <section className="shell pb-28" aria-label="Articles">
        <ol className="border-t border-line">
          {articles.map((a, i) => (
            <Rise as="li" key={a.slug} delay={i * 0.04} className="border-b border-line">
              <Link href={`/journal/${a.slug}`} className="group grid items-center gap-6 py-8 md:grid-cols-[13rem_1fr_10rem] md:gap-10">
                <Photo
                  photo={articlePhotos[a.slug]}
                  sizes="(min-width:768px) 13rem, 100vw"
                  className="aspect-[3/2]"
                  imgClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
                />
                <span>
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent-ink">
                    {a.rubrique} · Article d&apos;exemple
                  </span>
                  <span className="mt-2 block font-serif text-[clamp(1.8rem,3vw,2.6rem)] leading-tight transition-colors group-hover:text-accent-ink">{a.title}</span>
                  <span className="mt-2 block max-w-2xl text-ink-2">{a.chapo}</span>
                </span>
                <span className="text-sm text-muted md:text-right">
                  Lecture {a.lecture}
                  <span className="lien-revele ml-3 font-semibold text-ink">Lire</span>
                </span>
              </Link>
            </Rise>
          ))}
        </ol>
      </section>
    </>
  );
}
