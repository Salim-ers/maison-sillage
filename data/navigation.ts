export const mainNav = [
  { href: "/boutique", label: "Boutique" },
  { href: "/sirops", label: "Sirops" },
  { href: "/poudres", label: "Poudres" },
  { href: "/collections", label: "Collections" },
  { href: "/maison", label: "Notre histoire" },
  { href: "/recettes", label: "Recettes" },
  { href: "/professionnels", label: "Professionnels" },
] as const;

export const footerNav = {
  boutique: [
    { href: "/boutique", label: "Toute la boutique" },
    { href: "/sirops", label: "Sirops signatures" },
    { href: "/poudres", label: "Préparations en poudre" },
    { href: "/produits/coffret-decouverte", label: "Coffret Découverte" },
    { href: "/favoris", label: "Mes favoris" },
  ],
  maison: [
    { href: "/collections", label: "Les quatre saisons" },
    { href: "/maison", label: "Notre histoire" },
    { href: "/savoir-faire", label: "Savoir-faire" },
    { href: "/recettes", label: "Recettes" },
    { href: "/journal", label: "Le Journal" },
  ],
  aide: [
    { href: "/professionnels", label: "Espace professionnels" },
    { href: "/faq", label: "Questions fréquentes" },
    { href: "/livraison-retours", label: "Livraison & retours" },
    { href: "/contact", label: "Nous écrire" },
  ],
  legal: [
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/cgv", label: "Conditions de vente" },
    { href: "/confidentialite", label: "Confidentialité" },
  ],
};
