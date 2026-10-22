import Link from "next/link";
import { scenes } from "@/data/media";
import { Figure } from "@/components/ui/Figure";
import { RevealTitle, Rise } from "@/components/animations";

const ARGS = [
  ["Des créations originales", "pour donner une signature à votre carte"],
  ["Des formats professionnels", "700 ml pour les sirops, 1 kg pour les poudres"],
  ["Des recettes signatures", "pensées pour le service, faciles à reproduire"],
  ["Des usages multiples", "une même référence pour plusieurs boissons"],
];

/* Chapitre 9 — l'offre professionnelle */
export function ProTeaser() {
  return (
    <section className="bg-espresso py-24 text-creme md:py-32" aria-labelledby="pro-titre">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:order-2 lg:col-span-7">
          <Figure scene={scenes.professionnels} reveal="left" sizes="(min-width:1024px) 58vw, 100vw" />
        </div>
        <div className="lg:order-1 lg:col-span-5">
          <p className="mention text-or">Espace professionnels</p>
          <RevealTitle id="pro-titre" text="Pour les cartes qui veulent laisser un souvenir." className="titre mt-4" />
          <Rise>
            <p className="mt-6 text-creme/80">Coffee shops, salons de thé, hôtels, restaurants, glaciers : nous préparons une offre dédiée aux établissements.</p>
          </Rise>
          <dl className="mt-10 divide-y divide-creme/15 border-y border-creme/15">
            {ARGS.map(([t, d]) => (
              <Rise key={t} className="py-4">
                <dt className="font-serif text-xl">{t}</dt>
                <dd className="mt-0.5 text-sm text-creme/70">{d}</dd>
              </Rise>
            ))}
          </dl>
          <Link href="/professionnels#demande" className="btn btn-clair mt-10">
            Demander des informations
          </Link>
        </div>
      </div>
    </section>
  );
}
