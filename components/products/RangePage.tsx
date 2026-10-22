import Link from "next/link";
import type { Category } from "@/lib/types";
import type { Photo as PhotoData } from "@/data/images";
import { PageIntro } from "@/components/ui/PageIntro";
import { Photo } from "@/components/ui/Photo";
import { Rise } from "@/components/animations";
import { RevealNow } from "@/components/ui/RevealNow";
import { ShopCatalog } from "./ShopCatalog";

/** Page de gamme (sirops, poudres) : ouverture éditoriale photographique + catalogue filtré */
export function RangePage({
  category,
  kicker,
  title,
  intro,
  photo,
  caption,
  points,
  other,
}: {
  category: Category;
  kicker: string;
  title: string;
  intro: string;
  photo: PhotoData;
  caption: string;
  points: { title: string; text: string }[];
  other: { href: string; label: string };
}) {
  return (
    <>
      <PageIntro
        kicker={kicker}
        title={title}
        aside={
          <figure>
            <RevealNow from="right" className="aspect-[4/3]">
              <Photo photo={photo} sizes="(min-width:1024px) 40vw, 100vw" preload className="h-full w-full" />
            </RevealNow>
            <figcaption className="mt-3 font-serif text-[0.95rem] italic text-muted">{caption}</figcaption>
          </figure>
        }
      >
        {intro}
      </PageIntro>
      <section className="shell pb-16" aria-label="Repères">
        <div className="grid gap-10 border-t border-line pt-10 md:grid-cols-3">
          {points.map((p, i) => (
            <Rise key={p.title} delay={i * 0.08}>
              <h2 className="font-serif text-2xl">{p.title}</h2>
              <p className="mt-2 text-ink-2">{p.text}</p>
            </Rise>
          ))}
        </div>
      </section>
      <ShopCatalog initial={{}} lockedCategory={category} />
      <div className="shell -mt-12 pb-24">
        <Link href={other.href} className="lien text-sm font-semibold">
          {other.label}
        </Link>
      </div>
    </>
  );
}
