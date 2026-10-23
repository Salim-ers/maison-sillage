import Link from "next/link";
import { footerNav, socials } from "@/data/navigation";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "@/components/ui/NewsletterForm";

const COLS = [
  { title: "Boutique", links: footerNav.boutique },
  { title: "La Maison", links: footerNav.maison },
  { title: "Professionnels & aide", links: footerNav.aide },
];

/** Rose des vents et sillage : la touche maritime du pied de page, en filet doré */
function Sillage() {
  return (
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="h-[54px] w-full text-gold md:h-[90px]" aria-hidden>
      <path d="M-10 60 C 220 20, 420 22, 640 46 S 1020 86, 1240 52 S 1400 26, 1450 34" fill="none" stroke="currentColor" strokeOpacity=".55" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path d="M120 74 C 320 52, 520 56, 700 66 S 980 86, 1140 70" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Rose({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth=".8" opacity=".6" />
      <path d="M32 4 L35 29 L32 32 L29 29 Z M32 60 L29 35 L32 32 L35 35 Z M4 32 L29 29 L32 32 L29 35 Z M60 32 L35 35 L32 32 L35 29 Z" fill="currentColor" opacity=".85" />
      <path d="M32 14 L33.5 30.5 L32 32 L30.5 30.5 Z" fill="currentColor" transform="rotate(45 32 32)" opacity=".5" />
      <path d="M32 14 L33.5 30.5 L32 32 L30.5 30.5 Z" fill="currentColor" transform="rotate(-45 32 32)" opacity=".5" />
    </svg>
  );
}

/**
 * Pied de page : la fin du voyage, sur fond espresso (bleu nuit en plein jour), avec un sillage doré.
 * Aucun lien factice : un réseau social sans adresse s'affiche « bientôt », sans lien.
 */
export function Footer() {
  return (
    <footer className="pied relative isolate overflow-hidden bg-deep text-on-deep">
      <div className="pied-lumiere pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <div className="pied-etoiles pointer-events-none absolute inset-x-0 top-0 -z-10 h-2/3" aria-hidden />
      <Sillage />

      <div className="shell pt-12 lg:pt-16">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <Link href="/" className="block w-[160px] sm:w-[180px]" aria-label="Maison Sillage, accueil">
              <Logo tone="sombre" sizes="180px" />
            </Link>
            <p className="mt-8 max-w-xs text-sm leading-relaxed text-on-deep-2">
              Sirops, poudres et objets gourmands inspirés des grands voyages. Une jeune maison, en phase de conception.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6">
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
            <h2 className="mention mt-10 text-gold">Nous suivre</h2>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.95rem] text-on-deep-2">
              {socials.map((s) =>
                s.href ? (
                  <li key={s.name}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="lien-revele transition-colors hover:text-on-deep">
                      {s.name}
                    </a>
                  </li>
                ) : (
                  <li key={s.name} className="text-on-deep-2/70">
                    {s.name} <span className="text-[0.7rem] uppercase tracking-[0.14em] text-on-deep-2/50">bientôt</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* signature : la dernière image du voyage */}
      <div className="shell relative mt-16 select-none lg:mt-24" aria-hidden>
        <Rose className="absolute left-1/2 top-0 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-gold/70 md:h-12 md:w-12" />
        <p className="pied-marque text-center font-serif font-light uppercase leading-[0.8] tracking-[0.08em]">Sillage</p>
      </div>

      <div className="shell">
        <div className="border-t border-on-deep/15 py-7 text-[0.8rem] leading-relaxed text-on-deep-2">
          <p className="max-w-3xl">
            <strong className="font-semibold text-on-deep">Site de démonstration précommerciale.</strong> Les produits sont des concepts et des prototypes ;
            les prix sont indicatifs ; aucune vente, aucune expédition et aucun paiement ne sont possibles. Les visuels de produits sont des compositions de
            démonstration.{" "}
            <Link href="/credits" className="underline underline-offset-4 hover:text-on-deep">
              Crédits photographiques
            </Link>
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
