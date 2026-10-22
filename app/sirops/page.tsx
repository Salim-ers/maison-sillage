import type { Metadata } from "next";
import { RangePage } from "@/components/products/RangePage";
import { scenes } from "@/data/media";

export const metadata: Metadata = {
  title: "Les sirops signatures",
  description: "Quatre sirops saisonniers et une édition à venir : fraise & madeleine, pêche & fleur d'oranger, poire & vanille, datte & crème brûlée.",
  alternates: { canonical: "/sirops" },
};

export default function Sirops() {
  return (
    <RangePage
      category="sirop"
      kicker="Gamme Signature Syrups"
      title="Les sirops signatures."
      intro="Un fruit, une note pâtissière ou florale, une saison. Nos sirops sont imaginés pour le café et le latte, mais aussi pour les boissons glacées, les mocktails sans alcool et les desserts, selon des compatibilités qui restent à valider."
      scene={scenes.siropsPage}
      points={[
        { title: "Deux formats", text: "Un flacon de 250 ml pour la maison, une bouteille de 700 ml pensée pour les professionnels. Tarifs indicatifs." },
        { title: "Une même étiquette", text: "Ivoire, gravée, un double filet et un cachet à la couleur de la saison : la famille se reconnaît sur un comptoir." },
        { title: "Formulation en cours", text: "Les compositions définitives seront publiées une fois les recettes finalisées et validées." },
      ]}
      other={{ href: "/poudres", label: "Découvrir aussi les préparations en poudre" }}
    />
  );
}
