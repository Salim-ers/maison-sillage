import Link from "next/link";
import { Figure } from "@/components/ui/Figure";
import { scenes } from "@/data/media";
import { RevealTitle, Rise, DrawRule } from "@/components/animations";

const USAGES = ["un latte", "un café", "un mocktail sans alcool", "une limonade", "un chocolat chaud", "un frappé", "un milkshake", "un dessert"];

/* Chapitre 2 — l'univers Sillage : le mot, sa double trace, la promesse */
export function Univers() {
  return (
    <section className="relative py-24 md:py-36" aria-labelledby="univers-titre">
      <div className="shell grid items-start gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 lg:pr-8">
          <Rise>
            <p className="font-serif text-[1.35rem] italic text-bronze-ink">
              sil·lage <span className="not-italic text-espresso/60">n. m.</span>
            </p>
          </Rise>
          <dl className="mt-6 space-y-6 border-l border-bronze/50 pl-6">
            <Rise delay={0.1}>
              <dt className="sr-only">Premier sens</dt>
              <dd className="font-serif text-2xl leading-snug md:text-[1.75rem]">
                <span className="mr-2 text-bronze-ink">1.</span>Trace qu&apos;un navire laisse derrière lui à la surface de l&apos;eau.
              </dd>
            </Rise>
            <Rise delay={0.2}>
              <dt className="sr-only">Second sens</dt>
              <dd className="font-serif text-2xl leading-snug md:text-[1.75rem]">
                <span className="mr-2 text-bronze-ink">2.</span>Empreinte qu&apos;un parfum laisse dans l&apos;air après le passage de celui qui le porte.
              </dd>
            </Rise>
          </dl>

          <RevealTitle id="univers-titre" text="Nous y ajoutons un troisième sens : le souvenir d'une saveur." className="titre mt-16 max-w-[15ch]" />
          <Rise delay={0.15}>
            <p className="chapo mt-8 text-espresso">
              Maison Sillage imagine des sirops et des préparations en poudre comme on compose un parfum : des accords, une tête, un cœur, une
              finale qui s&apos;attarde. Notre inspiration vient des anciennes routes maritimes, des carnets de voyage et des comptoirs
              d&apos;épices ; nos usages, eux, sont résolument d&apos;aujourd&apos;hui.
            </p>
          </Rise>
          <DrawRule className="mt-12 max-w-md" />
          <Rise>
            <p className="mt-10 max-w-xl font-serif text-[1.65rem] leading-[1.35] text-encre">
              Une seule création peut devenir{" "}
              {USAGES.map((u, i) => (
                <span key={u}>
                  <em className="text-espresso">{u}</em>
                  {i < USAGES.length - 2 ? ", " : i === USAGES.length - 2 ? " ou " : "."}
                </span>
              ))}
            </p>
          </Rise>
          <Rise>
            <Link href="/recettes" className="lien mt-8 inline-block text-sm font-semibold tracking-wide">
              Voir toutes les façons de l&apos;utiliser
            </Link>
          </Rise>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:mt-24">
          <Figure scene={scenes.univers} parallax sizes="(min-width:1024px) 40vw, 100vw" caption="Carnet de bord : les matières qui ont donné naissance à la collection." />
        </div>
      </div>
    </section>
  );
}
