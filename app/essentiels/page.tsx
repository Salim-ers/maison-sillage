import type { Metadata } from "next";
import { RangePage } from "@/components/products/RangePage";
import { pages } from "@/data/images";

export const metadata: Metadata = {
  title: "Les Essentiels de la Maison",
  description:
    "Huit poudres classiques pour les boissons de tous les jours : chocolat noir intense, chocolat au lait, chocolat blanc, vanille Bourbon, caramel beurre salé, noisette, pistache et chaï épicé. Sachet kraft 200 g, dès 9,90 €.",
  alternates: { canonical: "/essentiels" },
};

export default function Essentiels() {
  return (
    <RangePage
      categories={["essentiel"]}
      kicker="Les Essentiels de la Maison"
      title="Les grands classiques, sans détour."
      intro="À côté des créations signatures, huit saveurs franches et familières : le chocolat sous trois formes, la vanille, le caramel, la noisette, la pistache et le chaï. Le sachet kraft les distingue au premier regard."
      photo={pages.essentiels}
      caption="Quatre Essentiels dans leur sachet kraft."
      points={[
        { title: "Dès 9,90 €", text: "Sachet kraft de 200 g, de 9,90 € à 12,90 € TTC selon la saveur ; sachet professionnel 1 kg sur devis. Prix indicatifs." },
        { title: "Pour tous les jours", text: "Un chocolat chaud, un latte vanille, un frappé caramel : des bases simples, à doser selon la tasse." },
        { title: "Formulation en cours", text: "Comme toute la gamme, les recettes restent à finaliser ; aucune composition n'est annoncée d'ici là." },
      ]}
      other={{ href: "/atelier", label: "Voir les accessoires et coffrets de L'Atelier" }}
    />
  );
}
