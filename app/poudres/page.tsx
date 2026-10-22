import type { Metadata } from "next";
import { RangePage } from "@/components/products/RangePage";
import { pages } from "@/data/images";

export const metadata: Metadata = {
  title: "Les préparations en poudre",
  description: "Les quatre créations de saison en préparation à fouetter : fraise des bois & madeleine, pêche blanche & fleur d'oranger, poire & vanille, datte & crème brûlée.",
  alternates: { canonical: "/poudres" },
};

export default function Poudres() {
  return (
    <RangePage
      category="poudre"
      kicker="Les préparations en poudre"
      title="La gourmandise, à fouetter."
      intro="Nos quatre créations de saison existent aussi en poudre : des préparations à fouetter dans le lait, chaud ou froid, qui donnent du corps aux lattes, aux chocolats, aux frappés et aux boissons créatives."
      photo={pages.poudres}
      caption="Cacao et chocolat noir : la matière d'une préparation gourmande."
      points={[
        { title: "Deux formats", text: "Un sachet de 200 g pour la maison, un sachet de 1 kg pour les établissements. Tarifs indicatifs." },
        { title: "Chaud ou froid", text: "Lattes, chocolats, frappés, milkshakes : la tenue à froid comme à chaud fait partie des essais à mener." },
        { title: "Formulation en cours", text: "Aucune composition ni valeur nutritionnelle n'est annoncée avant la finalisation des recettes." },
      ]}
      other={{ href: "/sirops", label: "Découvrir aussi les sirops signatures" }}
    />
  );
}
