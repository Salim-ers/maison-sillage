import type { Metadata } from "next";
import { PageIntro, DemoBanner } from "@/components/ui/PageIntro";
import { credits } from "@/data/images";

export const metadata: Metadata = {
  title: "Crédits photographiques",
  description: "Origine de chaque image du site Maison Sillage : photographies sous licence Unsplash, compositions de démonstration et scènes générées.",
  alternates: { canonical: "/credits" },
};

/** libellé lisible d'une clé d'image */
const what = (key: string) =>
  key.startsWith("pack-")
    ? "packshot"
    : key.startsWith("acc-")
      ? "objet de L'Atelier"
      : key.startsWith("gamme-")
        ? "gamme"
        : key.startsWith("boisson-") || key.startsWith("dessert-")
          ? "boisson"
          : key.startsWith("univers-") || key.startsWith("matiere-")
            ? "matière"
            : key.startsWith("hero")
              ? "accueil"
              : "décor";

export default function Credits() {
  const list = credits();
  return (
    <>
      <PageIntro kicker="Crédits" title="D'où viennent nos images.">
        Ce site de démonstration réunit trois sortes d&apos;images : des photographies sous licence Unsplash, des compositions réalisées pour la Maison (le
        flacon et le sachet, l&apos;étiquette et le logo d&apos;origine posés sur un fond photographié), et quelques scènes générées dont les emballages ont
        reçu la véritable étiquette de la gamme.
      </PageIntro>
      <section className="shell max-w-4xl pb-28" aria-label="Liste des crédits">
        <ul className="divide-y divide-line border-y border-line">
          {list.map((c) => {
            const kinds = [...new Set(c.keys.map(what))];
            return (
              <li key={`${c.name}-${c.url ?? c.source}-${c.note ?? ""}`} className="grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8">
                <div>
                  <p className="font-serif text-xl leading-tight">
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="lien">
                        {c.name}
                      </a>
                    ) : (
                      c.name
                    )}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {c.source}
                    {c.note ? ` · ${c.note}` : ""}
                  </p>
                </div>
                <p className="text-sm text-ink-2">
                  {c.keys.length} image{c.keys.length > 1 ? "s" : ""} · {kinds.join(", ")}
                </p>
              </li>
            );
          })}
        </ul>
        <DemoBanner className="mt-10">
          Les photographies Unsplash sont utilisées selon la licence Unsplash, qui autorise l&apos;usage commercial et la modification ; leurs auteurs sont
          crédités ici même si la licence ne l&apos;exige pas. Les objets de L&apos;Atelier sont des visuels d&apos;intention : le logo de la Maison a été appliqué
          sur des objets photographiés, qui ne sont pas des produits Maison Sillage. Aucune photographie de produit d&apos;une autre marque n&apos;est utilisée.
        </DemoBanner>
      </section>
    </>
  );
}
