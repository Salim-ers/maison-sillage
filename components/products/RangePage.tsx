import Link from "next/link";
import type { SceneConfig } from "@/components/visuals/Scene";
import type { Category } from "@/lib/types";
import { PageIntro } from "@/components/ui/PageIntro";
import { Figure } from "@/components/ui/Figure";
import { ShopCatalog } from "./ShopCatalog";
import { Rise } from "@/components/animations";

/** Page de gamme (sirops, poudres) : ouverture éditoriale + catalogue filtré */
export function RangePage({
  category,
  kicker,
  title,
  intro,
  scene,
  points,
  other,
}: {
  category: Category;
  kicker: string;
  title: string;
  intro: string;
  scene: SceneConfig;
  points: { title: string; text: string }[];
  other: { href: string; label: string };
}) {
  return (
    <>
      <PageIntro kicker={kicker} title={title} aside={<Figure scene={scene} reveal="right" priority sizes="(min-width:1024px) 40vw, 100vw" />}>
        {intro}
      </PageIntro>
      <section className="shell pb-16" aria-label="Repères">
        <div className="grid gap-10 border-t border-espresso/15 pt-10 md:grid-cols-3">
          {points.map((p, i) => (
            <Rise key={p.title} delay={i * 0.08}>
              <h2 className="font-serif text-2xl">{p.title}</h2>
              <p className="mt-2 text-espresso/85">{p.text}</p>
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
