import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProduct } from "@/data/products";
import { recipesForProduct } from "@/data/recipes";
import { categoryLabels, getSeason, profileLabels, usageLabels, recipeCategoryLabels } from "@/data/collections";
import { productPhotos, recipePhotos, seasonImages } from "@/data/images";
import { Gallery } from "@/components/products/Gallery";
import { ProductBuyBox } from "@/components/products/ProductBuyBox";
import { ProductMini } from "@/components/products/ProductMini";
import { PendingVisual } from "@/components/products/ProductCard";
import { Photo } from "@/components/ui/Photo";
import { Accordion } from "@/components/ui/Accordion";
import { RevealTitle, Rise, DrawRule, MaskReveal } from "@/components/animations";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const title = p.category === "coffret" ? p.name : `${p.name} — ${categoryLabels[p.category]}`;
  return {
    title,
    description: p.seo,
    alternates: { canonical: `/produits/${p.slug}` },
    openGraph: { title: `${title} · Maison Sillage`, description: p.seo },
  };
}

export default async function ProduitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const photos = productPhotos(p.slug, p.category, p.flavor);
  const season = p.season ? getSeason(p.season) : null;
  const linkedRecipes = p.contents
    ? p.contents.flatMap((s) => recipesForProduct(s)).filter((r, i, a) => a.findIndex((x) => x.slug === r.slug) === i)
    : recipesForProduct(p.slug);
  const complements = p.complements.map(getProduct).filter((x): x is NonNullable<typeof x> => !!x);
  const contents = (p.contents ?? []).map(getProduct).filter((x): x is NonNullable<typeof x> => !!x);
  const upcoming = p.status === "a-venir";
  // les matières illustrent l'histoire gustative ; la première est déjà dans la galerie, on montre l'autre
  const matiere = p.season ? seasonImages[p.season].matieres[1] : null;
  // une photographie déjà présente dans la galerie n'est pas répétée en vignette de recette
  const used = new Set([...photos.gallery.map((g) => g.photo.src), matiere?.src]);
  const recipeThumb = (slug: string) => (used.has(recipePhotos[slug].main.src) ? recipePhotos[slug].second : recipePhotos[slug].main);

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
              <Link href={p.category === "poudre" ? "/poudres" : p.category === "sirop" ? "/sirops" : "/boutique?categorie=coffret"} className="hover:text-ink">
                {p.category === "poudre" ? "Poudres" : p.category === "sirop" ? "Sirops" : "Coffret"}
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
            {photos.gallery.length ? <Gallery name={p.name} views={photos.gallery} /> : <PendingVisual product={p} className="aspect-[4/5]" />}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-inverse px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-on-inverse">
              {upcoming ? "Édition à l'étude" : "Prototype — vente indisponible"}
            </span>
            <span className="border border-line px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-ink-2">{categoryLabels[p.category]}</span>
            {season && (
              <span className="inline-flex items-center gap-1.5 border border-line px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.18em]">
                <span className="h-2 w-2 rounded-full" style={{ background: season.accent }} aria-hidden />
                {season.name}
              </span>
            )}
          </div>
          <p className="mention mt-7 text-accent-ink">{categoryLabels[p.category]}</p>
          <RevealTitle as="h1" text={p.name} immediate className="mt-3 font-serif text-[clamp(2.5rem,4.4vw,4.1rem)] font-light leading-[0.98]" />
          <p className="mt-4 font-serif text-2xl italic text-ink-2">{p.tagline}</p>
          <p className="mt-5 leading-relaxed text-ink-2">{p.sensory}</p>

          <ul className="mt-7 flex flex-wrap gap-2" aria-label="Notes aromatiques">
            {p.notes.map((n) => (
              <li key={n} className="rounded-full border border-line px-3 py-1.5 text-sm">
                {n}
              </li>
            ))}
          </ul>

          <ProductBuyBox product={p} />

          {contents.length > 0 && (
            <div className="mt-10">
              <h2 className="mention text-accent-ink">Dans le coffret</h2>
              <div className="mt-4 space-y-2">
                {contents.map((c) => (
                  <ProductMini key={c.slug} product={c} />
                ))}
              </div>
            </div>
          )}

          <dl className="mt-10 divide-y divide-line border-y border-line text-sm">
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="text-muted">Profil</dt>
              <dd className="col-span-2">{p.profiles.map((x) => profileLabels[x]).join(", ")}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="text-muted">Usages envisagés</dt>
              <dd className="col-span-2">{p.usages.map((u) => usageLabels[u]).join(", ")}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="text-muted">Ingrédients</dt>
              <dd className="col-span-2">
                <strong className="font-semibold">Formulation en cours.</strong> La liste d&apos;ingrédients et les allergènes seront publiés avec la recette définitive.
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="text-muted">Livraison</dt>
              <dd className="col-span-2">
                Conditions non définies à ce stade.{" "}
                <Link href="/livraison-retours" className="lien">
                  En savoir plus
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* histoire gustative & matière */}
      <section className="bg-tint py-20 md:py-28" aria-labelledby="histoire-titre">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <p className="mention text-accent-ink">L&apos;histoire gustative</p>
            <RevealTitle id="histoire-titre" text="Ce que raconte cette saveur." className="titre mt-4" />
            {p.story.map((para, i) => (
              <Rise key={i} delay={i * 0.08}>
                <p className={`mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink-2 ${i === 0 ? "lettrine" : ""}`}>{para}</p>
              </Rise>
            ))}
          </div>
          {matiere && (
            <div className="lg:col-span-5 lg:col-start-8">
              <MaskReveal from="right" className="aspect-[4/5]">
                <Photo photo={matiere} sizes="(min-width:1024px) 38vw, 100vw" className="h-full w-full" />
              </MaskReveal>
              <p className="mt-3 font-serif text-[0.95rem] italic text-muted">Les matières qui l&apos;inspirent — elles ne décrivent pas la composition du produit.</p>
            </div>
          )}
        </div>
      </section>

      {/* usages */}
      <section className="py-20 md:py-28" aria-labelledby="usages-titre">
        <div className="shell">
          <p className="mention text-accent-ink">Suggestions d&apos;utilisation</p>
          <RevealTitle id="usages-titre" text="Une saveur, plusieurs boissons." className="titre mt-4" />
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {p.usageIdeas.map((u, i) => (
              <Rise key={u.title} delay={i * 0.08} className="border-t border-line pt-6">
                <h3 className="font-serif text-2xl">{u.title}</h3>
                <p className="mt-2 text-ink-2">{u.text}</p>
              </Rise>
            ))}
          </div>

          {linkedRecipes.length > 0 && (
            <>
              <DrawRule className="mt-20" />
              <h3 className="sous-titre mt-12">Recettes réalisables</h3>
              <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {linkedRecipes.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/recettes/${r.slug}`} className="group flex items-center gap-5 bg-paper/70 p-3 pr-5 transition-colors duration-500 hover:bg-paper">
                      <Photo photo={recipeThumb(r.slug)} sizes="80px" className="h-24 w-20 shrink-0" imgClassName="transition-transform duration-700 group-hover:scale-110" />
                      <span>
                        <span className="block text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-accent-ink">{recipeCategoryLabels[r.category]}</span>
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
