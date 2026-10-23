import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProduct, saveurLabels } from "@/data/products";
import { getRecipe, recipesForProduct, drinkLabels } from "@/data/recipes";
import { categoryLabels, collectionLabels, getSeason, statusLabels } from "@/data/collections";
import { photo, productPhotos, recipePhoto, seasonImages } from "@/data/images";
import { Gallery } from "@/components/products/Gallery";
import { ProductBuyBox } from "@/components/products/ProductBuyBox";
import { ProductMini } from "@/components/products/ProductMini";
import { Photo } from "@/components/ui/Photo";
import { Accordion } from "@/components/ui/Accordion";
import { RevealTitle, Rise, DrawRule, MaskReveal } from "@/components/animations";
import type { Category, Product, Recipe } from "@/lib/types";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const title = `${p.name} — ${categoryLabels[p.category]}`;
  const og = photo(p.images[0]);
  return {
    title,
    description: p.seo,
    alternates: { canonical: `/produits/${p.slug}` },
    openGraph: { title: `${title} · Maison Sillage`, description: p.seo, images: [{ url: og.src, width: og.width, height: og.height, alt: og.alt }] },
  };
}

const RAYON: Record<Category, { href: string; label: string }> = {
  sirop: { href: "/sirops", label: "Sirops" },
  poudre: { href: "/poudres", label: "Poudres" },
  essentiel: { href: "/essentiels", label: "Les Essentiels" },
  accessoire: { href: "/atelier", label: "L'Atelier" },
  coffret: { href: "/atelier", label: "L'Atelier" },
};

/** légende de chaque vue de la galerie, selon ce qu'elle montre */
function viewLabel(key: string, p: Product): string {
  if (key.startsWith("pack-")) return p.category === "sirop" ? "Le flacon" : "Le sachet";
  if (key.startsWith("acc-")) return "Visuel d'intention";
  if (key.startsWith("gamme-")) return "La gamme";
  if (key.startsWith("boisson-")) return "En boisson";
  if (key.startsWith("dessert-")) return "En dessert";
  return "La matière";
}

export default async function ProduitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const views = productPhotos(p).map((ph, i) => ({ photo: ph, label: viewLabel(p.images[i], p) }));
  const season = p.season ? getSeason(p.season) : null;
  const linked = [...p.recipes.map(getRecipe), ...recipesForProduct(p.slug)].filter((r, i, a): r is Recipe => !!r && a.findIndex((x) => x?.slug === r.slug) === i);
  const complements = p.complements.map(getProduct).filter((x): x is NonNullable<typeof x> => !!x);
  const object = p.category === "accessoire" || p.category === "coffret";
  const storyPhoto = season ? seasonImages[season.id].paysage : null;

  return (
    <article>
      <div className="shell pt-[calc(var(--header-h)+1.5rem)]">
        <nav aria-label="Fil d'Ariane" className="text-[0.8rem] text-muted">
          <ol className="flex flex-wrap gap-x-2">
            <li>
              <Link href="/boutique" className="hover:text-ink">
                Boutique
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={RAYON[p.category].href} className="hover:text-ink">
                {RAYON[p.category].label}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">
              {p.name}
            </li>
          </ol>
        </nav>
      </div>

      <section className="shell grid gap-12 pb-20 pt-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <Gallery name={p.name} views={views} />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-inverse px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-on-inverse">{statusLabels[p.status]}</span>
            {season && (
              <span className="inline-flex items-center gap-1.5 border border-line px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.18em]">
                <span className="h-2 w-2 rounded-full" style={{ background: season.accent }} aria-hidden />
                {season.name}
              </span>
            )}
          </div>
          <p className="mention mt-7 text-accent-ink">{collectionLabels[p.collection]}</p>
          <RevealTitle as="h1" text={p.name} immediate className="mt-3 font-serif text-[clamp(2.4rem,4.2vw,3.9rem)] font-light leading-[0.98]" />
          <p className="mt-4 font-serif text-2xl italic text-ink-2">{p.tagline}</p>
          <p className="mt-5 leading-relaxed text-ink-2">{p.description}</p>

          {p.notes.length > 0 && (
            <ul className="mt-7 flex flex-wrap gap-2" aria-label={object ? "Caractère" : "Notes aromatiques"}>
              {p.notes.map((n) => (
                <li key={n} className="rounded-full border border-line px-3 py-1.5 text-sm">
                  {n}
                </li>
              ))}
            </ul>
          )}

          <ProductBuyBox product={p} />

          <dl className="mt-10 divide-y divide-line border-y border-line text-sm">
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="text-muted">Référence</dt>
              <dd className="col-span-2 tabular-nums">{p.id} · référence de démonstration</dd>
            </div>
            {p.saveurs.length > 0 && (
              <div className="grid grid-cols-3 gap-4 py-4">
                <dt className="text-muted">Famille</dt>
                <dd className="col-span-2">{p.saveurs.map((x) => saveurLabels[x]).join(", ")}</dd>
              </div>
            )}
            {p.usages.length > 0 && (
              <div className="grid grid-cols-3 gap-4 py-4">
                <dt className="text-muted">Usages</dt>
                <dd className="col-span-2">{p.usages.join(", ")}</dd>
              </div>
            )}
            {p.details?.map((d) => (
              <div key={d.label} className="grid grid-cols-3 gap-4 py-4">
                <dt className="text-muted">{d.label}</dt>
                <dd className="col-span-2">{d.value}</dd>
              </div>
            ))}
            {!object && (
              <div className="grid grid-cols-3 gap-4 py-4">
                <dt className="text-muted">Ingrédients</dt>
                <dd className="col-span-2">
                  <strong className="font-semibold">Formulation en cours.</strong> La liste d&apos;ingrédients et les allergènes seront publiés avec la recette définitive.
                </dd>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="text-muted">Livraison</dt>
              <dd className="col-span-2">
                Aucune expédition à ce stade.{" "}
                <Link href="/livraison-retours" className="lien">
                  En savoir plus
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* histoire gustative */}
      <section className="bg-tint py-20 md:py-28" aria-labelledby="histoire-titre">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <p className="mention text-accent-ink">{object ? "L'objet" : "L'histoire gustative"}</p>
            <RevealTitle id="histoire-titre" text={object ? "Pourquoi cet objet." : "Ce que raconte cette saveur."} className="titre mt-4" />
            {p.story.map((para, i) => (
              <Rise key={i} delay={i * 0.08}>
                <p className={`mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink-2 ${i === 0 ? "lettrine" : ""}`}>{para}</p>
              </Rise>
            ))}
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            {storyPhoto ? (
              <>
                <MaskReveal from="right" className="aspect-[4/5]">
                  <Photo photo={storyPhoto} sizes="(min-width:1024px) 38vw, 100vw" className="h-full w-full" />
                </MaskReveal>
                <p className="mt-3 font-serif text-[0.95rem] italic text-muted">{season!.chapter}</p>
              </>
            ) : (
              p.notes.length > 0 && (
                <Rise>
                  <ol className="border-l border-gold pl-8">
                    {p.notes.map((n, i) => (
                      <li key={n} className="py-3 font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-light italic leading-tight text-ink" style={{ opacity: 1 - i * 0.18 }}>
                        {n}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-4 pl-8 text-sm text-muted">{object ? "Le caractère recherché pour cet objet." : "Les notes recherchées, de l'attaque à la finale."}</p>
                </Rise>
              )
            )}
          </div>
        </div>
      </section>

      {/* usages et recettes */}
      {(p.usageIdeas.length > 0 || p.servings.length > 0 || linked.length > 0) && (
        <section className="py-20 md:py-28" aria-labelledby="usages-titre">
          <div className="shell">
            <p className="mention text-accent-ink">Suggestions d&apos;utilisation</p>
            <RevealTitle id="usages-titre" text={object ? "Au quotidien." : "Une saveur, plusieurs boissons."} className="titre mt-4" />
            {p.usageIdeas.length > 0 && (
              <div className="mt-12 grid gap-10 md:grid-cols-3">
                {p.usageIdeas.map((u, i) => (
                  <Rise key={u.title} delay={i * 0.08} className="border-t border-line pt-6">
                    <h3 className="font-serif text-2xl">{u.title}</h3>
                    <p className="mt-2 text-ink-2">{u.text}</p>
                  </Rise>
                ))}
              </div>
            )}
            {p.servings.length > 0 && (
              <Rise className="mt-14">
                <h3 className="mention text-accent-ink">Dosages de départ</h3>
                <ul className="mt-4 flex flex-wrap gap-x-10 gap-y-3">
                  {p.servings.map((s) => (
                    <li key={s.drink} className="flex items-baseline gap-3">
                      <span className="font-serif text-xl">{drinkLabels[s.drink]}</span>
                      <span className="text-sm text-muted">{s.dose}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted">Repères de démonstration, à ajuster selon la tasse et le goût : la formulation n&apos;est pas finalisée.</p>
              </Rise>
            )}

            {linked.length > 0 && (
              <>
                <DrawRule className="mt-20" />
                <h3 className="sous-titre mt-12">Recettes associées</h3>
                <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {linked.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/recettes/${r.slug}`} className="group flex items-center gap-5 bg-paper/70 p-3 pr-5 transition-colors duration-500 hover:bg-paper">
                        <Photo photo={recipePhoto(r)} sizes="80px" className="h-24 w-20 shrink-0" imgClassName="transition-transform duration-700 group-hover:scale-110" />
                        <span>
                          <span className="block text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-accent-ink">{drinkLabels[r.drink]}</span>
                          <span className="mt-1 block font-serif text-xl leading-tight">{r.title}</span>
                          <span className="mt-1 block text-xs text-muted">{r.temps}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>
      )}

      {/* FAQ & compléments */}
      <section className="bg-deep py-20 text-on-deep md:py-28">
        <div className="shell grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="titre">Questions fréquentes</h2>
            <div className="mt-10">
              <Accordion items={p.faq} tone="sombre" />
            </div>
          </div>
          {complements.length > 0 && (
            <div className="lg:col-span-4 lg:col-start-9">
              <h2 className="mention text-gold">À associer</h2>
              <div className="mt-6 space-y-3">
                {complements.map((c) => (
                  <ProductMini key={c.slug} product={c} tone="sombre" />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
