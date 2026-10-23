import type { Metadata } from "next";
import { RangePage } from "@/components/products/RangePage";
import { pages } from "@/data/images";

export const metadata: Metadata = {
  title: "L'Atelier & les accessoires",
  description:
    "Mug, tasse espresso, verre à latte glacé, cafetière italienne, cuillère doseuse, carafe à sirop, coffret découverte et carnet de recettes : les objets en sélection chez Maison Sillage.",
  alternates: { canonical: "/atelier" },
};

export default function Atelier() {
  return (
    <RangePage
      categories={["accessoire", "coffret"]}
      kicker="L'Atelier & les accessoires"
      title="Les objets du comptoir."
      intro="Une tasse en grès, un verre haut pour les boissons glacées, une cuillère qui dose juste, un carnet pour noter ses recettes : les objets qui accompagnent nos saveurs, et un coffret pour les découvrir."
      photo={pages.atelier}
      caption="Un espresso servi dans sa tasse : l'usage avant l'objet."
      points={[
        { title: "Objets en sélection", text: "Les fabricants, matériaux et dimensions restent à définir : chaque visuel montre l'intention, le logo de la Maison appliqué sur un objet photographié." },
        { title: "Le coffret découverte", text: "Petits flacons des Quatre Saisons, ou flacons et poudres : deux assortiments imaginés pour goûter la gamme." },
        { title: "Pour les établissements", text: "Les quantités et la personnalisation pour les cafés, hôtels et restaurants se discutent sur demande." },
      ]}
      other={{ href: "/boutique", label: "Revenir à toute la boutique" }}
    />
  );
}
