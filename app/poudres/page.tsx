import type { Metadata } from "next";
import { RangePage } from "@/components/products/RangePage";
import { scenes } from "@/data/media";

export const metadata: Metadata = {
  title: "Les préparations en poudre",
  description: "Quatre préparations gourmandes pour lattes, frappés et chocolats : madeleine & vanille, pistache, chaï & fleur d'oranger, chocolat & biscuit.",
  alternates: { canonical: "/poudres" },
};

export default function Poudres() {
  return (
    <RangePage
      category="poudre"
      kicker="Gamme Signature Powders"
      title="Les préparations en poudre."
      intro="Des préparations gourmandes à fouetter dans le lait, chaud ou froid : elles donnent du corps aux lattes, aux frappés et aux chocolats. Deux doypacks, ivoire ou brun selon la profondeur de la saveur."
      scene={scenes.poudresPage}
      points={[
        { title: "Deux formats", text: "Un sachet de 200 g pour la maison, un sachet de 1 kg pour les établissements. Tarifs indicatifs." },
        { title: "Chaud ou froid", text: "Lattes, chocolats, frappés, milkshakes : la tenue à froid comme à chaud fait partie des essais à mener." },
        { title: "Formulation en cours", text: "Aucune composition ni valeur nutritionnelle n'est annoncée avant la finalisation des recettes." },
      ]}
      other={{ href: "/sirops", label: "Découvrir aussi les sirops signatures" }}
    />
  );
}
