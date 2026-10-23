import Link from "next/link";
import { home } from "@/data/images";
import { formatPrice } from "@/lib/utils";
import { Photo } from "@/components/ui/Photo";
import { Parallax, RevealTitle, Rise } from "@/components/animations";

const LIEUX = ["Coffee shops", "Restaurants", "Hôtels", "Salons de thé", "Bars à mocktails", "Établissements gourmands"];
/* formats professionnels du catalogue de démonstration */
const FORMATS = [
  { label: "Sirop · bouteille 700 ml", price: `${formatPrice(14.9)} HT`, note: "tarif indicatif" },
  { label: "Poudre · sachet 1 kg", price: "Sur devis", note: "signatures et Essentiels" },
  { label: "Accessoires & coffrets", price: "Sur demande", note: "quantités, personnalisation" },
];

/* Section — les professionnels : un barista au comptoir, des formats indicatifs, une demande de devis */
export function ProTeaser() {
  return (
    <section className="relative z-10 isolate overflow-hidden bg-deep text-creme" aria-labelledby="pro-titre">
      <div className="relative h-[52svh] min-h-[340px] md:absolute md:inset-0 md:h-auto">
        <Parallax amount={70} bleed className="h-full">
          <Photo photo={home.pro} sizes="100vw" className="h-full w-full" position="38% 55%" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-transparent to-transparent md:bg-[linear-gradient(90deg,transparent_25%,rgb(var(--a-veil)/.82)_58%,rgb(var(--a-veil)/.94)_100%)]" aria-hidden />
      </div>
      <div className="shell relative py-16 md:flex md:min-h-[92svh] md:items-center md:justify-end md:py-28">
        <div className="md:w-[46%] lg:w-[40%]">
          <Rise>
            <p className="mention text-or">Espace professionnels</p>
          </Rise>
          <RevealTitle id="pro-titre" text="Des créations pensées pour vos établissements." className="titre mt-5" />
          <Rise delay={0.1}>
            <p className="mt-7 text-[1.05rem] leading-relaxed text-creme/85">
              « Enrichissez votre carte avec des associations gourmandes originales et des préparations imaginées pour inspirer de nouvelles boissons. »
            </p>
          </Rise>
          <Rise delay={0.18}>
            <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2 font-serif text-[1.2rem] italic text-creme/90" aria-label="Pour qui">
              {LIEUX.map((l, i) => (
                <li key={l} className="flex items-center gap-4">
                  {l}
                  {i < LIEUX.length - 1 && <span className="h-1 w-1 rounded-full bg-or/70" aria-hidden />}
                </li>
              ))}
            </ul>
          </Rise>
          <Rise delay={0.22}>
            <dl className="mt-9 divide-y divide-creme/15 border-y border-creme/15 text-sm">
              {FORMATS.map((f) => (
                <div key={f.label} className="flex items-baseline justify-between gap-4 py-3.5">
                  <dt>
                    {f.label}
                    <span className="block text-xs text-creme/60">{f.note}</span>
                  </dt>
                  <dd className="shrink-0 font-serif text-lg">{f.price}</dd>
                </div>
              ))}
            </dl>
          </Rise>
          <Rise delay={0.28}>
            <p className="mt-6 text-sm text-creme/65">Offre en préparation : conditions, volumes et délais restent à définir.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/professionnels#demande" className="btn btn-clair">
                Demander un devis
              </Link>
              <Link href="/professionnels" className="btn btn-verre">
                L&apos;espace professionnel
              </Link>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}
