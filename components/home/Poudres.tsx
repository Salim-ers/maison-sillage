import Link from "next/link";
import { productsByCategory } from "@/data/products";
import { home } from "@/data/images";
import { Photo } from "@/components/ui/Photo";
import { ProductCard } from "@/components/products/ProductCard";
import { MaskReveal, Parallax, RevealTitle, Rise, Stagger, StaggerItem } from "@/components/animations";

const GESTES = [
  ["Lattes", "fouettées dans un lait chaud jusqu'à une mousse fine"],
  ["Chocolats", "épais et veloutés, à boire à la cuillère"],
  ["Frappés & milkshakes", "mixées avec la glace et un lait froid"],
  ["Créations", "boissons de saison, desserts minute, nappages"],
];

/* Section 8 — les préparations en poudre : la matière, les gestes, les quatre sachets de saison */
export function Poudres() {
  const poudres = productsByCategory("poudre");
  return (
    <section className="relative z-10 overflow-hidden bg-deep-2 py-24 text-on-deep md:py-36" aria-labelledby="poudres-titre">
      <div className="pointer-events-none absolute -right-40 top-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgb(var(--a-glow)/.16),transparent_65%)]" aria-hidden />
      <div className="shell grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="relative lg:col-span-6">
          <MaskReveal from="bottom" className="aspect-[5/4]">
            <Parallax amount={60} bleed>
              <Photo photo={home.poudres} sizes="(min-width:1024px) 48vw, 100vw" className="h-full w-full" />
            </Parallax>
          </MaskReveal>
          <p className="mt-3 font-serif text-[0.95rem] italic text-on-deep-2">Les quatre préparations de saison, et leurs matières.</p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <Rise>
            <p className="mention text-gold">Les préparations en poudre</p>
          </Rise>
          <RevealTitle id="poudres-titre" text="La gourmandise, dans sa plus belle expression." className="titre mt-5" />
          <Rise delay={0.1}>
            <p className="mt-7 text-[1.05rem] leading-relaxed text-on-deep-2">
              Nos quatre créations de saison existent aussi en poudre : des préparations à fouetter dans le lait, chaud ou froid, qui donnent du
              corps et de la rondeur aux lattes, aux chocolats, aux frappés et aux boissons créatives.
            </p>
          </Rise>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6">
            {GESTES.map(([t, d], i) => (
              <Rise key={t} delay={0.1 + i * 0.06} className="border-t border-on-deep/15 pt-4">
                <dt className="font-serif text-[1.45rem] leading-tight">{t}</dt>
                <dd className="mt-1 text-sm text-on-deep-2">{d}</dd>
              </Rise>
            ))}
          </dl>
          <Rise delay={0.3}>
            <Link href="/poudres" className="btn btn-clair mt-10">
              Explorer les poudres
            </Link>
          </Rise>
        </div>
      </div>

      <div className="shell mt-24">
        <div className="flex items-end justify-between gap-6 border-t border-on-deep/15 pt-8">
          <h3 className="sous-titre">Les quatre sachets de saison</h3>
          <p className="hidden text-sm text-on-deep-2 sm:block">Sachet 200 g · prix indicatifs</p>
        </div>
        <Stagger className="no-scrollbar -mx-[var(--gutter)] mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-14 md:overflow-visible md:px-0 lg:grid-cols-4">
          {poudres.map((p) => (
            <StaggerItem key={p.slug} className="w-[70vw] shrink-0 snap-start sm:w-[44vw] md:w-auto">
              <ProductCard product={p} tone="deep" sizes="(min-width:1024px) 22vw, (min-width:768px) 45vw, 70vw" />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
