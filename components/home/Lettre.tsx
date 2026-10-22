import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { Emblem } from "@/components/ui/Logo";
import { RevealTitle, Rise } from "@/components/animations";

/* Chapitre 10 — la lettre de saison (démonstration) */
export function Lettre() {
  return (
    <section className="py-24 md:py-32" aria-labelledby="lettre-titre">
      <div className="shell grid gap-12 md:grid-cols-12 md:items-center">
        <div className="hidden md:col-span-3 md:block">
          <div className="mx-auto w-40 opacity-90">
            <Emblem sizes="160px" />
          </div>
        </div>
        <div className="md:col-span-8 md:col-start-5">
          <RevealTitle id="lettre-titre" text="Recevoir la lettre de saison." className="titre" />
          <Rise>
            <p className="chapo mt-5 text-espresso">Quatre lettres par an, une par chapitre : les nouvelles créations, une recette, une histoire de voyage.</p>
          </Rise>
          <div className="mt-10 max-w-xl">
            <NewsletterForm id="lettre-accueil" />
          </div>
        </div>
      </div>
    </section>
  );
}
