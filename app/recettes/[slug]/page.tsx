import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { recipes, getRecipe } from "@/data/recipes";
import { getProduct } from "@/data/products";
import { drinkLabels } from "@/data/recipes";
import { photo, recipePhoto } from "@/data/images";
import { Photo } from "@/components/ui/Photo";
import { ProductMini } from "@/components/products/ProductMini";
import { RevealTitle, Rise, DrawRule, MaskReveal, Parallax } from "@/components/animations";
import { DemoBanner } from "@/components/ui/PageIntro";
import { RevealNow } from "@/components/ui/RevealNow";

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = getRecipe(slug);
  if (!r) return {};
  const og = recipePhoto(r);
  return { title: r.title, description: r.intro, alternates: { canonical: `/recettes/${r.slug}` }, openGraph: { images: [{ url: og.src, width: og.width, height: og.height, alt: og.alt }] } };
}

export default async function RecettePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getRecipe(slug);
  if (!r) notFound();
  const linked = r.products.map(getProduct).filter((x): x is NonNullable<typeof x> => !!x);
  const others = recipes.filter((x) => x.slug !== r.slug && (x.drink === r.drink || x.products.some((p) => r.products.includes(p)))).slice(0, 3);
  // la boisson, puis la matière de la création utilisée (son packshot figure déjà dans la vignette produit)
  const matiere = linked[0]?.images.slice(1).find((k) => k !== r.image && !k.startsWith("gamme-"));
  const ph = { main: recipePhoto(r), second: matiere ? photo(matiere) : null };

  return (
    <article>
      <header className="shell grid gap-12 pb-16 pt-[calc(var(--header-h)+2.5rem)] lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className="lg:col-span-6">
          <nav aria-label="Fil d'Ariane" className="text-[0.8rem] text-muted">
            <Link href="/recettes" className="hover:text-ink">
              Recettes
            </Link>{" "}
            /{" "}
            <Link href={`/recettes?boisson=${r.drink}`} className="hover:text-ink">
              {drinkLabels[r.drink]}
            </Link>
          </nav>
          <RevealTitle as="h1" text={r.title} immediate className="display mt-6 text-[clamp(2.6rem,5.4vw,5.4rem)] font-light" />
          <Rise delay={0.3}>
            <p className="chapo mt-6 text-ink-2">{r.intro}</p>
          </Rise>
          <dl className="mt-10 grid grid-cols-3 gap-4 border-y border-line py-5 text-sm">
            <div>
              <dt className="text-muted">Préparation</dt>
              <dd className="mt-1 font-serif text-xl">{r.temps}</dd>
            </div>
            <div>
              <dt className="text-muted">Service</dt>
              <dd className="mt-1 font-serif text-xl">{r.service}</dd>
            </div>
            <div>
              <dt className="text-muted">Type</dt>
              <dd className="mt-1 font-serif text-xl">{drinkLabels[r.drink]}</dd>
            </div>
          </dl>
        </div>
        <div className="lg:col-span-6">
          <RevealNow from="right" className="aspect-[4/5]">
            <Photo photo={ph.main} sizes="(min-width:1024px) 48vw, 100vw" preload className="h-full w-full" quality={85} />
          </RevealNow>
        </div>
      </header>

      <section className="shell grid gap-14 pb-24 lg:grid-cols-12" aria-label="Préparation">
        <div className="lg:col-span-4">
          <h2 className="sous-titre">Ingrédients</h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {r.ingredients.map((i) => (
              <li key={i.item} className="flex gap-4 py-3.5">
                <span className="w-24 shrink-0 font-serif text-lg tabular-nums">{i.qty}</span>
                <span>
                  {i.product ? (
                    <Link href={`/produits/${i.product}`} className="lien">
                      {i.item}
                    </Link>
                  ) : (
                    i.item
                  )}
                </span>
              </li>
            ))}
          </ul>
          <DemoBanner className="mt-6">Dosages de démonstration : ce sont des propositions culinaires, pas des spécifications définitives des produits.</DemoBanner>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <h2 className="sous-titre">Les étapes</h2>
          <ol className="mt-6 space-y-7">
            {r.steps.map((s, n) => (
              <Rise as="li" key={n} delay={n * 0.05} className="grid grid-cols-[3rem_1fr] gap-4">
                <span className="font-serif text-4xl leading-none text-accent-ink">{n + 1}</span>
                <p className="pt-1 text-[1.05rem] leading-relaxed">{s}</p>
              </Rise>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-tint py-20" aria-labelledby="final-titre">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            {ph.second && (
              <MaskReveal from="left" className="aspect-[4/5] max-w-md">
                <Parallax amount={40} bleed>
                  <Photo photo={ph.second} sizes="(min-width:1024px) 34vw, 100vw" className="h-full w-full" />
                </Parallax>
              </MaskReveal>
            )}
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="mention text-accent-ink">La boisson finale</p>
            <h2 id="final-titre" className="mt-4 font-serif text-[2rem] italic leading-snug md:text-[2.4rem]">
              {r.final}
            </h2>
            <p className="mt-6 text-ink-2">
              <strong className="font-semibold">Le conseil de la Maison :</strong> {r.conseil}
            </p>
            <h3 className="mention mt-10 text-accent-ink">{linked.length > 1 ? "Les créations utilisées" : "La création utilisée"}</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {linked.map((p) => (
                <ProductMini key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="shell py-20">
          <DrawRule />
          <h2 className="sous-titre mt-10">À essayer ensuite</h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/recettes/${o.slug}`} className="flex items-baseline justify-between gap-4 py-4 font-serif text-2xl transition-colors hover:text-accent-ink">
                  {o.title}
                  <span className="font-sans text-xs text-muted">
                    {drinkLabels[o.drink]} · {o.temps}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
