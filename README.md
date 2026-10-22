# Maison Sillage — site de démonstration précommerciale

> L'empreinte d'une saveur.

Site e-commerce **fictif** d'une future maison française de sirops signatures et de préparations en poudre. Aucun produit n'est en vente, aucun paiement n'est possible : panier, favoris et commande fonctionnent uniquement en local, à titre de démonstration.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Déploiement : importer le dossier dans Vercel (aucune variable d'environnement requise). Pour des URL canoniques et un sitemap exacts, définir `NEXT_PUBLIC_SITE_URL` (ex. `https://maison-sillage.fr`).

## Pile technique

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS 4 (jetons de marque dans `app/globals.css`)
- Motion pour toutes les animations (pas de GSAP : aucune séquence ne le justifiait)
- Lucide pour quelques icônes fonctionnelles
- Polices auto-hébergées (`@fontsource`) : Cormorant Garamond + Manrope — aucune requête vers Google Fonts

## Arborescence

```
app/                       routes (accueil, boutique, sirops, poudres, produits/[slug], collections,
                           maison, savoir-faire, recettes/[slug], professionnels, journal/[slug],
                           panier, commande, favoris, faq, pages légales, sitemap, robots)
components/layout/         en-tête, menu mobile, pied de page, recherche
components/home/           les dix chapitres de l'accueil
components/products/       carte produit, catalogue filtrable, fiche, galerie, favoris
components/cart/           tiroir panier, lignes, commande simulée
components/editorial/      saisons, recettes, geste animé, formulaire pro, pages texte
components/animations/     bibliothèque de mouvements réutilisables (révélations, masques, parallaxe, sillage)
components/visuals/        système d'illustration : flacon, doypack, coffret, boissons, botanique, scènes
components/ui/             logo, figure, accordéon, sélecteur de quantité, newsletter
data/                      products.ts, collections.ts, recipes.ts, journal.ts, media.ts, navigation.ts
lib/                       panier & favoris (localStorage), recherche, utilitaires
public/brand/              logo officiel détouré (clair / sombre), emblème compact, gravure
scripts/                   détourage du logo, audit Playwright, tests d'interaction
```

## Logo

Le logo fourni n'a pas été redessiné : `scripts/process_logo.py` retire seulement le fond papier (démélange alpha) et produit
`logo-light` (fonds clairs, couleurs d'origine), `logo-dark` (fonds sombres, même tracé recoloré ivoire et or),
et `emblem-*`, un recadrage du médaillon existant utilisé comme déclinaison compacte dans l'en-tête défilé.

## Visuels

Aucun outil de génération d'images ni banque de photos n'était accessible pendant la conception. Plutôt que des photos
génériques, le site utilise un **système d'illustration cohérent** dans l'esprit des gravures rehaussées de la marque :
une seule famille de flacons et de doypacks portant l'emblème, des planches botaniques gravées, et un compositeur de scènes.

- `data/media.ts` recense **119 compositions uniques** (vérifiable avec `npx tsx scripts/check-scenes.ts`) : aucune n'est
  réutilisée d'une section à l'autre. Chacune porte un `brief` de prise de vue pour le futur shooting.
- Pour remplacer une scène par une vraie photographie, passer `photo={{ src, alt }}` au composant `<Figure>` : `next/image`
  servira automatiquement des variantes AVIF/WebP aux bonnes tailles.

## Contenus fictifs et garde-fous

- Tous les prix sont indicatifs (sirops 12,90 € TTC / 14,90 € HT, poudres 13,90 € TTC / 28,90 € HT, coffret 36,90 € TTC).
- Ingrédients marqués « formulation en cours » ; aucune valeur nutritionnelle, certification ou origine n'est annoncée.
- Aucune fausse date de fondation, aucun faux avis, aucune référence client inventée.
- « Pistache & Fleur de sel » est présentée comme édition à venir, non achetable.
- Pages légales, livraison et retours : emplacements préparés, mentions « à compléter avant commercialisation ».

## Vérifications

```bash
python3 scripts/audit.py http://localhost:3000 ./captures        # routes, liens, débordements, erreurs console
python3 scripts/interactions.py http://localhost:3000 ./captures # panier, filtres, commande, formulaires, mobile, mouvement réduit
```

## Pour passer en production réelle

1. Remplacer les scènes par les photographies (voir `brief` de chaque entrée de `data/media.ts`).
2. Brancher une solution e-commerce (Shopify Hydrogen, Medusa, Stripe…) derrière `lib/store.tsx`.
3. Relier les formulaires (newsletter, demande pro) à un service d'envoi.
4. Compléter mentions légales, CGV, politique de confidentialité, livraison et retours.
