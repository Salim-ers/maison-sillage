import Link from "next/link";
import { footerNav } from "@/data/navigation";
import { Logo } from "@/components/ui/Logo";

const COLS = [
  { title: "La Maison", links: footerNav.maison },
  { title: "Boutique", links: footerNav.boutique },
  { title: "Aide", links: footerNav.aide },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-encre text-creme/85">
      <div className="shell grid gap-14 pb-12 pt-20 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:pt-28">
        <div className="max-w-sm">
          <Link href="/" className="block w-[180px] sm:w-[210px]" aria-label="Maison Sillage, accueil">
            <Logo tone="sombre" sizes="210px" />
          </Link>
          <p className="mt-8 font-serif text-2xl italic leading-snug text-creme">
            Une saveur passe, son sillage demeure.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {COLS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2 className="mention text-or">{c.title}</h2>
              <ul className="mt-5 space-y-3 text-[0.95rem]">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="lien-revele hover:text-creme">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="shell">
        <div className="border-t border-creme/15 py-6 text-[0.8rem] leading-relaxed text-creme/65">
          <p className="max-w-3xl">
            <strong className="font-semibold text-creme/90">Site de démonstration précommerciale.</strong> Maison Sillage est un projet en phase de conception :
            les produits, visuels, prix et disponibilités présentés sont fictifs. Aucune vente ni aucun paiement n&apos;est possible.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>Maison Sillage · L&apos;empreinte d&apos;une saveur</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {footerNav.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-creme">
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
