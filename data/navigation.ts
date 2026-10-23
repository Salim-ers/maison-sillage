export const mainNav = [
  { href: "/boutique", label: "Boutique" },
  { href: "/sirops", label: "Sirops" },
  { href: "/poudres", label: "Poudres" },
  { href: "/essentiels", label: "Les Essentiels" },
  { href: "/maison", label: "Notre Maison" },
  { href: "/recettes", label: "Recettes" },
  { href: "/professionnels", label: "Professionnels" },
] as const;

export const footerNav = {
  boutique: [
    { href: "/boutique", label: "Tous les produits" },
    { href: "/sirops", label: "Sirops signatures" },
    { href: "/poudres", label: "Poudres signatures" },
    { href: "/essentiels", label: "Les Essentiels" },
    { href: "/atelier", label: "L'Atelier & les accessoires" },
    { href: "/produits/coffret-decouverte", label: "Coffret découverte" },
  ],
  maison: [
    { href: "/maison", label: "Notre histoire" },
    { href: "/collections", label: "Les quatre saisons" },
    { href: "/recettes", label: "Recettes & Comptoir des saveurs" },
    { href: "/savoir-faire", label: "Savoir-faire" },
    { href: "/journal", label: "Le Journal" },
  ],
  aide: [
    { href: "/professionnels", label: "Espace professionnels" },
    { href: "/professionnels#demande", label: "Demander un devis" },
    { href: "/faq", label: "Questions fréquentes" },
    { href: "/contact", label: "Nous écrire" },
  ],
  legal: [
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/cgv", label: "Conditions de vente" },
    { href: "/confidentialite", label: "Confidentialité" },
    { href: "/livraison-retours", label: "Livraison & retours" },
    { href: "/credits", label: "Crédits photographiques" },
  ],
};

/** Réseaux sociaux : renseigner l'adresse pour activer le lien. Tant qu'elle est vide,
 *  le réseau s'affiche comme « bientôt », sans lien factice. */
export const socials: { name: string; href: string | null }[] = [
  { name: "Instagram", href: null },
  { name: "Pinterest", href: null },
  { name: "LinkedIn", href: null },
];
