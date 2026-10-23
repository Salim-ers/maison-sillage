import type { Metadata } from "next";
import { RangePage } from "@/components/products/RangePage";
import { pages } from "@/data/images";

export const metadata: Metadata = {
  title: "Les sirops signatures",
  description:
    "Huit sirops signatures : les quatre créations des Quatre Saisons et quatre Signatures de la Maison, de la fraise des bois au chocolat noir et orange confite. Flacon 250 ml, bouteille 700 ml, prix indicatifs.",
  alternates: { canonical: "/sirops" },
};

export default function Sirops() {
  return (
    <RangePage
      categories={["sirop"]}
      kicker="Les sirops signatures"
      title="Huit saveurs en flacon."
      intro="Quatre créations de saison et quatre Signatures de la Maison, toute l'année. Chaque sirop associe un fruit, une épice ou un fruit sec à une note pâtissière, pour le café, le latte, les boissons glacées et les mocktails."
      photo={pages.sirops}
      caption="Les quatre sirops des Quatre Saisons, dans leur flacon commun."
      points={[
        { title: "Trois formats", text: "Flacon 250 ml à 12,90 € TTC, bouteille 700 ml à 19,90 € TTC, et une bouteille professionnelle 700 ml à 14,90 € HT. Prix indicatifs." },
        { title: "Une même étiquette", text: "Le même flacon, la même étiquette ivoire gravée du trois-mâts : seuls changent la saveur, la couleur du sirop et le cachet." },
        { title: "Formulation en cours", text: "Ce sont des concepts et des prototypes : les compositions définitives seront publiées une fois les recettes validées." },
      ]}
      other={{ href: "/poudres", label: "Découvrir aussi les poudres signatures" }}
    />
  );
}
