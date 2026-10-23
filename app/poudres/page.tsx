import type { Metadata } from "next";
import { RangePage } from "@/components/products/RangePage";
import { pages } from "@/data/images";

export const metadata: Metadata = {
  title: "Les poudres signatures",
  description:
    "Huit poudres signatures à fouetter dans le lait : les quatre saveurs de saison, pistache grillée, chocolat noir et orange confite, vanille torréfiée, chaï doux et fleur d'oranger. Sachet 200 g, prix indicatifs.",
  alternates: { canonical: "/poudres" },
};

export default function Poudres() {
  return (
    <RangePage
      categories={["poudre"]}
      kicker="Les poudres signatures"
      title="La gourmandise, à fouetter."
      intro="Les quatre saveurs de saison existent en poudre, et quatre créations s'y ajoutent toute l'année. Des préparations à fouetter dans un lait chaud ou froid, pour des lattes, des chocolats et des frappés plus ronds."
      photo={pages.poudres}
      caption="Quatre poudres signatures dans leur sachet espresso."
      points={[
        { title: "Deux formats", text: "Sachet 200 g à 14,90 € TTC pour la maison ; sachet professionnel 1 kg, tarif sur devis. Prix indicatifs." },
        { title: "Chaud ou froid", text: "Lattes, chocolats, frappés, milkshakes : la tenue à froid comme à chaud fait partie des essais à mener." },
        { title: "Formulation en cours", text: "Aucune composition ni valeur nutritionnelle n'est annoncée avant la finalisation des recettes." },
      ]}
      other={{ href: "/essentiels", label: "Découvrir aussi Les Essentiels de la Maison" }}
    />
  );
}
