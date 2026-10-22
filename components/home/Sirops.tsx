import Link from "next/link";
import { productsByCategory } from "@/data/products";
import { getSeason } from "@/data/collections";
import { scenes } from "@/data/media";
import { Figure } from "@/components/ui/Figure";
import { RevealTitle, Rise, Stagger, StaggerItem } from "@/components/animations";
import { BottleArt } from "@/components/visuals/Bottle";

/* Chapitre 3 — entrée dans les sirops : la famille au complet, puis l'index des saveurs */
export function Sirops() {
  const sirops = productsByCategory("sirop").filter((p) => p.status === "prototype");
  const future = productsByCategory("sirop").find((p) => p.status === "a-venir");
  return (
    <section className="relative bg-parchemin/55 pb-24 pt-20 md:pb-32 md:pt-28" aria-labelledby="sirops-titre">
      <div className="shell">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="mention text-bronze-ink">Les sirops signatures</p>
            <RevealTitle id="sirops-titre" text="Quatre saisons, quatre flacons." className="titre mt-4" />
          </div>
          <Rise className="md:col-span-5">
            <p className="text-espresso">
              Une même bouteille, une même étiquette gravée, et pour chaque saison une couleur de cachet. Chaque sirop associe un fruit et
              une note pâtissière ou florale, pour accompagner le café comme les boissons froides.
            </p>
          </Rise>
        </div>
      </div>

      <div className="mt-14 md:mt-20">
        <Figure scene={scenes.sirops} parallax reveal="left" sizes="100vw" />
      </div>

      <div className="shell mt-6">
        <Stagger className="grid border-t border-espresso/20 sm:grid-cols-2 lg:grid-cols-4">
          {sirops.map((p) => {
            const s = getSeason(p.season!);
            return (
              <StaggerItem key={p.slug} className="border-b border-espresso/20 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0">
                <Link href={`/produits/${p.slug}`} className="group flex h-full gap-5 p-5 transition-colors duration-500 hover:bg-creme/70 lg:p-7">
                  <div className="w-12 shrink-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-1.5 group-hover:-rotate-3">
                    <BottleArt product={p} className="h-auto w-full" />
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em]" style={{ color: s.ink }}>
                      <span className="h-2 w-2 rounded-full" style={{ background: s.accent }} aria-hidden />
                      {s.name}
                    </p>
                    <h3 className="mt-2 font-serif text-[1.45rem] leading-[1.08]">{p.name}</h3>
                    <p className="mt-2 text-sm text-espresso/80">{p.notes.join(", ")}</p>
                    <span className="lien-revele mt-4 inline-block text-[0.8rem] font-semibold">Découvrir la création</span>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
        {future && (
          <Rise>
            <p className="mt-8 text-sm text-espresso/80">
              <span className="font-serif text-base italic text-espresso">Dans le carnet de bord :</span> {future.name}, une création à l&apos;étude.{" "}
              <Link href={`/produits/${future.slug}`} className="lien">
                Voir la piste
              </Link>
            </p>
          </Rise>
        )}
      </div>
    </section>
  );
}
