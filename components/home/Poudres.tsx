import Link from "next/link";
import { productsByCategory } from "@/data/products";
import { getSeason } from "@/data/collections";
import { scenes } from "@/data/media";
import { Figure } from "@/components/ui/Figure";
import { RevealTitle, Rise, Parallax } from "@/components/animations";

/* Chapitre 4 — transition vers les poudres : la page s'assombrit comme une tasse de chocolat */
export function Poudres() {
  const poudres = productsByCategory("poudre");

  return (
    <section className="relative overflow-hidden bg-[#2e1c12] pb-24 text-creme md:pb-36" aria-labelledby="poudres-titre">
      {/* crépuscule : la page passe de l'ivoire au brun, comme le jour qui tombe */}
      <div className="relative flex h-[16rem] items-start justify-center bg-[linear-gradient(180deg,#e9d8bb_0%,#c9a77c_32%,#7a5538_64%,#2e1c12_100%)] pt-14 md:h-[22rem] md:pt-20">
        <Rise>
          <p className="max-w-xl px-6 text-center font-serif text-[1.6rem] italic leading-snug text-espresso md:text-[2rem]">
            Quand le jour tombe, on revient aux boissons qui se boivent lentement.
          </p>
        </Rise>
      </div>
      <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="relative lg:col-span-6">
          <Figure scene={scenes.poudres} sizes="(min-width:1024px) 46vw, 100vw" reveal="bottom" />
          <Parallax amount={70} className="absolute -bottom-16 -right-4 hidden w-[44%] shadow-2xl md:block lg:-right-16">
            <Figure scene={scenes.poudresClaires} reveal="right" sizes="22vw" />
          </Parallax>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:pt-10">
          <p className="mention text-or">Les préparations en poudre</p>
          <RevealTitle id="poudres-titre" text="Des textures onctueuses, à fouetter dans le lait." className="titre mt-4 text-creme" />
          <Rise>
            <p className="mt-8 max-w-lg text-creme/80">
              Lattes, frappés, chocolats : nos poudres gourmandes sont pensées pour donner du corps aux boissons lactées. Même système
              graphique que les flacons, en doypacks mats ivoire ou brun selon la profondeur de la saveur.
            </p>
          </Rise>
          <ul className="mt-12 divide-y divide-creme/15 border-y border-creme/15">
            {poudres.map((p, i) => (
              <Rise as="li" key={p.slug} delay={i * 0.06}>
                <Link href={`/produits/${p.slug}`} className="group flex items-baseline justify-between gap-4 py-5">
                  <span>
                    <span className="block font-serif text-[1.6rem] leading-tight transition-colors group-hover:text-or">{p.name}</span>
                    <span className="mt-1 block text-sm text-creme/65">{p.notes.join(" · ")}</span>
                  </span>
                  <span className="shrink-0 text-[0.7rem] uppercase tracking-[0.18em] text-or">{p.season ? getSeason(p.season).name : ""}</span>
                </Link>
              </Rise>
            ))}
          </ul>
          <Link href="/poudres" className="btn btn-clair mt-10">
            Explorer les poudres
          </Link>
        </div>
      </div>
    </section>
  );
}
