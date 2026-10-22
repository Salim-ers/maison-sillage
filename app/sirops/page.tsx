import type { Metadata } from "next";
import { RangePage } from "@/components/products/RangePage";
import { pages } from "@/data/images";

export const metadata: Metadata = {
  title: "Les sirops signatures",
  description: "Quatre sirops saisonniers et une édition à l'étude : fraise des bois & madeleine, pêche blanche & fleur d'oranger, poire & vanille Bourbon, datte & crème brûlée.",
  alternates: { canonical: "/sirops" },
};

export default function Sirops() {
  return (
    <RangePage
      category="sirop"
      kicker="Les sirops signatures"
      title="Quatre saisons en flacon."
      intro="Un fruit, une note pâtissière ou florale, une saison. Nos sirops sont imaginés pour le café et le latte, mais aussi pour les boissons glacées, les mocktails sans alcool et les desserts, selon des compatibilités qui restent à valider."
      photo={pages.sirops}
      caption="Les quatre sirops de la collection, face au port au coucher du soleil."
      points={[
        { title: "Deux formats", text: "Un flacon de 250 ml pour la maison, une bouteille de 700 ml pensée pour les professionnels. Tarifs indicatifs." },
        { title: "Une même étiquette", text: "Ivoire, gravée d'un trois-mâts, et pour chaque saison sa création : la famille se reconnaît sur un comptoir." },
        { title: "Formulation en cours", text: "Les compositions définitives seront publiées une fois les recettes finalisées et validées." },
      ]}
      other={{ href: "/poudres", label: "Découvrir aussi les préparations en poudre" }}
    />
  );
}
