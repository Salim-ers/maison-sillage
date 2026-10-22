import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProduct } from "@/data/products";
import { recipesForProduct } from "@/data/recipes";
import { categoryLabels, getSeason, profileLabels, usageLabels, recipeCategoryLabels } from "@/data/collections";
import { productScenes } from "@/data/media";
import { Gallery } from "@/components/products/Gallery";
import { ProductBuyBox } from "@/components/products/ProductBuyBox";
import { ProductMini } from "@/components/products/ProductMini";
import { Botanical, botanicalNames } from "@/components/visuals/Botanical";
import { DrinkArt } from "@/components/visuals/Drink";
import { Accordion } from "@/components/ui/Accordion";
import { RevealTitle, Rise, DrawRule } from "@/components/animations";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.seo,
    alternates: { canonical: `/produits/${p.slug}` },
    openGraph: { title: `${p.name} · Maison Sillage`, description: p.seo },
  };
}

export default async function ProduitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const sc = productScenes(p);
  const season = p.season ? getSeason(p.season) : null;
  const linkedRecipes = p.contents ? p.contents.flatMap((s) => recipesForProduct(s)).filter((r, i, a) => a.findIndex((x) => x.slug === r.slug) === i) : recipesForProduct(p.slug);
  const complements = p.complements.map(getProduct).filter((x): x is NonNullable<typeof x> => !!x);
  const contents = (p.contents ?? []).map(getProduct).filter((x): x is NonNullable<typeof x> => !!x);
  const upcoming = p.status === "a-venir";

  return (
    <article style={{ ["--accent" as string]: p.palette.accent }}>
      <div className="shell pt-[calc(var(--header-h)+1.5rem)]">
        <nav aria-label="Fil d'Ariane" className="text-[0.8rem] text-espresso/70">
          <ol className="flex flex-wrap gap-x-2">
            <li>
              <Link href="/boutique" className="hover:text-encre">
                Boutique
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={p.category === "poudre" ? "/poudres" : p.category === "sirop" ? "/sirops" : "/boutique?categorie=coffret"} className="hover:text-encre">
                {p.category === "poudre" ? "Les Poudres" : p.category === "sirop" ? "Les Sirops" : "Coffret"}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-encre">
              {p.name}
            </li>
          </ol>
        </nav>
      </div>

      <section className="shell grid gap-12 pb-20 pt-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <Gallery
              name={p.name}
              views={[
                { scene: sc.principale, label: "Le produit" },
                { scene: sc.situation, label: "En situation" },
                { scene: sc.matieres, label: "Les matières" },
                { scene: sc.detail, label: "L'étiquette" },
              ]}
            />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-encre px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-creme">
              {upcoming ? "Édition à venir" : "Prototype — vente indisponible"}
            </span>
            <span className="border border-espresso/25 px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-espresso">{categoryLabels[p.category]}</span>
            {season && (
              <span className="inline-flex items-center gap-1.5 border border-espresso/25 px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.18em]">
                <span className="h-2 w-2 rounded-full" style={{ background: season.accent }} aria-hidden />
                {season.name}
              </span>
            )}
          </div>
          <RevealTitle as="h1" text={p.name} immediate className="mt-6 font-serif text-[clamp(2.5rem,4.4vw,4rem)] leading-[0.98]" />
          <p className="mt-4 font-serif text-2xl italic text-espresso">{p.tagline}</p>

          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Notes aromatiques">
            {p.notes.map((n) => (
              <li key={n} className="bg-parchemin/70 px-3 py-1.5 text-sm">
                {n}
              </li>
            ))}
          </ul>

          <ProductBuyBox product={p} />

          {contents.length > 0 && (
            <div className="mt-10">
              <h2 className="mention text-bronze-ink">Dans le coffret</h2>
              <div className="mt-4 space-y-2">
                {contents.map((c) => (
                  <ProductMini key={c.slug} product={c} />
                ))}
              </div>
            </div>
          )}

          <dl className="mt-10 divide-y divide-espresso/15 border-y border-espresso/15 text-sm">
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="text-espresso/70">Profil</dt>
              <dd className="col-span-2">{p.profiles.map((x) => profileLabels[x]).join(", ")}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="text-espresso/70">Usages envisagés</dt>
              <dd className="col-span-2">{p.usages.map((u) => usageLabels[u]).join(", ")}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="text-espresso/70">Ingrédients</dt>
              <dd className="col-span-2">
                <strong className="font-semibold">Formulation en cours.</strong> La liste d&apos;ingrédients et les allergènes seront publiés avec la recette définitive.
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="text-espresso/70">Livraison</dt>
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

      {/* histoire & matières */}
      <section className="bg-parchemin/55 py-20 md:py-28" aria-labelledby="histoire-titre">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="mention text-bronze-ink">L&apos;histoire gustative</p>
            <RevealTitle id="histoire-titre" text="Ce que raconte cette saveur." className="titre mt-4" />
            {p.story.map((para, i) => (
              <Rise key={i} delay={i * 0.08}>
                <p className={`mt-6 max-w-xl text-[1.05rem] leading-relaxed text-espresso ${i === 0 ? "lettrine" : ""}`}>{para}</p>
              </Rise>
            ))}
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <h3 className="mention text-bronze-ink">Les matières qui l&apos;inspirent</h3>
            <ul className="mt-6 grid grid-cols-2 gap-6">
              {p.botanicals.map((b) => (
                <li key={b} className="text-center">
                  <Botanical id={b} className="mx-auto h-28 w-28" title={botanicalNames[b]} />
                  <p className="mt-3 font-serif text-lg italic">{botanicalNames[b]}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-espresso/70">Illustrations d&apos;inspiration : elles ne décrivent pas la composition du produit.</p>
          </div>
        </div>
      </section>

      {/* usages */}
      <section className="py-20 md:py-28" aria-labelledby="usages-titre">
        <div className="shell">
          <p className="mention text-bronze-ink">Suggestions d&apos;utilisation</p>
          <RevealTitle id="usages-titre" text="Une saveur, plusieurs boissons." className="titre mt-4" />
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {p.usageIdeas.map((u, i) => (
              <Rise key={u.title} delay={i * 0.08} className="border-t border-espresso/20 pt-6">
                <h3 className="font-serif text-2xl">{u.title}</h3>
                <p className="mt-2 text-espresso/85">{u.text}</p>
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
                    <Link href={`/recettes/${r.slug}`} className="group flex items-center gap-5 p-4 transition-colors duration-500 hover:bg-creme" style={{ background: `${r.scene.bg}99` }}>
                      <span className="w-16 shrink-0 transition-transform duration-700 group-hover:-translate-y-1">
                        <DrawArt look={r.look} />
                      </span>
                      <span>
                        <span className="block text-[0.68rem] uppercase tracking-[0.16em] text-bronze-ink">{recipeCategoryLabels[r.category]}</span>
                        <span className="mt-1 block font-serif text-xl leading-tight">{r.title}</span>
                        <span className="mt-1 block text-xs text-espresso/70">{r.temps}</span>
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
      <section className="bg-encre py-20 text-creme md:py-28">
        <div className="shell grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="titre">Questions fréquentes</h2>
            <div className="mt-10">
              <Accordion items={p.faq} tone="sombre" />
            </div>
          </div>
          {complements.length > 0 && (
            <div className="lg:col-span-4 lg:col-start-9">
              <h2 className="mention text-or">À associer</h2>
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

function DrawArt({ look }: { look: Parameters<typeof DrinkArt>[0]["look"] }) {
  return <DrinkArt look={{ ...look, garnish: undefined, steam: false }} className="h-auto w-full" title="" />;
}
