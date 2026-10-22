import Link from "next/link";
import { footerNav } from "@/data/navigation";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "@/components/ui/NewsletterForm";

const COLS = [
  { title: "Boutique", links: footerNav.boutique },
  { title: "La Maison", links: footerNav.maison },
  { title: "Services", links: footerNav.aide },
];

/**
 * Pied de page : la fin du voyage. Son éclairage suit l'ambiance — halo
 * doré au coucher du soleil, lumière franche le jour, ciel étoilé et
 * lanternes la nuit.
 */
export function Footer() {
  return (
    <footer className="pied relative isolate overflow-hidden bg-deep text-on-deep">
      <div className="pied-lumiere pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <div className="pied-etoiles pointer-events-none absolute inset-x-0 top-0 -z-10 h-2/3" aria-hidden />
      <div className="pied-lanterne pointer-events-none absolute -z-10" style={{ left: "8%", top: "18%" }} aria-hidden />
      <div className="pied-lanterne pointer-events-none absolute -z-10" style={{ right: "10%", top: "34%" }} aria-hidden />

      <div className="shell pt-24 lg:pt-32">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link href="/" className="block w-[170px] sm:w-[200px]" aria-label="Maison Sillage, accueil">
              <Logo tone="sombre" sizes="200px" />
            </Link>
            <p className="mt-10 font-serif text-[2.1rem] italic leading-tight text-on-deep">L&apos;empreinte d&apos;une saveur.</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-on-deep-2">
              Sirops signatures et préparations gourmandes, inspirés des grands voyages. Une jeune maison, en phase de conception.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-5">
            {COLS.map((c) => (
              <nav key={c.title} aria-label={c.title}>
                <h2 className="mention text-gold">{c.title}</h2>
                <ul className="mt-5 space-y-3 text-[0.95rem] text-on-deep-2">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="lien-revele transition-colors hover:text-on-deep">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="lg:col-span-3">
            <h2 className="mention text-gold">La lettre de saison</h2>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-on-deep-2">Quatre lettres par an : les créations, une recette, un récit de voyage.</p>
            <div className="mt-6">
              <NewsletterForm id="lettre-pied" tone="sombre" />
            </div>
          </div>
        </div>
      </div>

      {/* signature monumentale : la dernière image du voyage */}
      <div className="shell mt-20 select-none lg:mt-28" aria-hidden>
        <p className="pied-marque text-center font-serif font-light uppercase leading-[0.8] tracking-[0.08em]">Sillage</p>
      </div>

      <div className="shell">
        <div className="border-t border-on-deep/15 py-7 text-[0.8rem] leading-relaxed text-on-deep-2">
          <p className="max-w-3xl">
            <strong className="font-semibold text-on-deep">Site de démonstration précommerciale.</strong> Les produits, prix et disponibilités présentés sont
            fictifs ; aucune vente ni aucun paiement n&apos;est possible. Les photographies sont des visuels de démonstration.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>Maison Sillage · L&apos;empreinte d&apos;une saveur</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {footerNav.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-on-deep">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
