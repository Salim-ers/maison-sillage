# Maison Sillage — site de démonstration précommerciale

> L'empreinte d'une saveur.

Site e-commerce **fictif** d'une future maison française de sirops signatures et de préparations en poudre. Aucun produit n'est en vente, aucun paiement n'est possible : panier, favoris et commande fonctionnent uniquement en local, à titre de démonstration.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Déploiement : importer le dossier dans Vercel (aucune variable d'environnement requise). Pour des URL canoniques et un sitemap exacts, définir `NEXT_PUBLIC_SITE_URL` (ex. `https://maison-sillage.fr`). `.vercelignore` exclut les sources photographiques (`assets/`) et les scripts.

## Pile technique

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS 4 — jetons de marque et variables d'ambiance dans `app/globals.css`
- Motion pour les animations pilotées par le défilement ; CSS pour les entrées de page (visibles sans JavaScript) ; View Transitions API pour les bascules d'ambiance. Pas de GSAP : aucune séquence ne le justifiait.
- `next/image` (AVIF / WebP, tailles responsives, aperçus flous)
- Polices auto-hébergées (`@fontsource`) : Cormorant Garamond + Manrope

## Arborescence

```
app/                       routes (accueil, boutique, sirops, poudres, produits/[slug], collections, maison,
                           savoir-faire, recettes/[slug], professionnels, journal/[slug], panier, commande,
                           favoris, faq, pages légales, sitemap, robots, image de partage)
components/home/           les sections de l'accueil (Hero, Monde, Créations, Saisons, Histoire, Usages,
                           Signatures, Poudres, ProTeaser)
components/ambiance/       sélecteur « boussole », image à fondu enchaîné, calques d'atmosphère, pictogrammes
components/layout/         en-tête, menu mobile, pied de page, recherche
components/products/       carte produit, catalogue filtrable, galerie, fiche, favoris
components/cart/           tiroir panier, lignes, commande simulée
components/editorial/      chapitres des saisons, bannière maritime, recettes, formulaire pro, pages texte
components/animations/     révélations, masques, parallaxe, sillage
components/ui/             Photo, logo, accordéon, sélecteur de quantité, newsletter
data/images.ts             registre central : chaque photographie attribuée à sa section
data/                      products.ts, collections.ts, recipes.ts, journal.ts, navigation.ts
lib/ambiance*.ts(x)        système d'ambiances (état partagé, préchargement, transitions, script anti-flash)
lib/                       panier & favoris (localStorage), recherche, utilitaires
public/brand/              logo officiel détouré (clair / sombre), emblème
public/images/             hero/ story/ products/ seasons/ recipes/ lifestyle/ — masters WebP générés
assets/originals/          photographies transmises, haute résolution, non modifiées (voir assets/README.md)
scripts/images/            chaîne de production des images (recadrages, étalonnages jour / nuit / saisons)
scripts/qa/                audit des routes et parcours utilisateurs (Playwright)
```

## L'accueil

1. **Hero maritime** plein écran : un grand voilier par saison, entrée cinématographique en CSS (photographie, titre ligne par ligne, sous-titre, boutons, indicateur de défilement), profondeur au défilement, puis la section suivante recouvre le hero sous une houle et un sillage doré. Composition verticale dédiée sur mobile.
2. **Le monde Maison Sillage** : trois univers en mise en page asymétrique, masques et parallaxe.
3. **Créations signatures** : carrousel horizontal (glisser à la souris, tactile, clavier) — flacon et sachet de chaque création.
4. **Quatre saisons** : le sélecteur pilote l'ambiance du site entier (photographie, couleurs, création, récit), geste de balayage sur mobile.
5. **Histoire** · 6. **Usages** (galerie en accordéon) · 7. **Signatures** (boutique) · 8. **Poudres** · 9. **Professionnels** · 10. **Pied de page** éclairé selon l'ambiance.

## Système d'ambiances

Boussole dans l'en-tête : deux réglages indépendants — **lumière** (jour, coucher de soleil, nuit) et **saison** — et un mode **automatique** (date et heure locales, appliqué à chaque visite, jamais pendant la navigation). Par défaut : été au coucher du soleil.

- Les couleurs sont des variables CSS pilotées par `data-light` / `data-season` sur `<html>` ; un script inline dans `<head>` applique la préférence mémorisée avant le premier rendu (aucun flash), sur toutes les pages.
- Les photographies changent réellement : chaque saison a sa propre prise de vue, et chaque lumière une version étalonnée hors ligne (`scripts/images/grading.py`). Avant chaque bascule, seules les images de la prochaine ambiance, déclarées par les composants affichés, sont préchargées.
- Transition ≈ 1,1 s : dévoilement circulaire depuis la boussole (View Transitions API) sur ordinateur, fondu sur mobile, bascule immédiate si `prefers-reduced-motion`. La nuit, étoiles, fenêtres du village, lanternes et feu de poupe s'allument ; pétales au printemps, reflets en été, feuilles en automne, neige en hiver.

## Photographies

Voir `assets/README.md` : inventaire, attribution, ambiances, **visuels manquants**. Pour régénérer les images après un ajout ou un remplacement :

```bash
npm run images     # python -I scripts/images/build.py  (Pillow + NumPy)
```

## Contenus fictifs et garde-fous

- Quatre créations signatures, chacune en sirop et en poudre, un coffret et une édition à l'étude (non achetable).
- Prix indicatifs : sirops 12,90 € TTC / 14,90 € HT, poudres 13,90 € TTC / 28,90 € HT, coffret 36,90 € TTC.
- Ingrédients « formulation en cours » ; aucune valeur nutritionnelle, certification ou origine annoncée.
- Aucune fausse date de fondation, aucun faux avis, aucune évaluation ni volume de vente, aucune référence client inventée.
- Pages légales, livraison et retours : emplacements préparés, mentions « à compléter avant commercialisation ».

## Vérifications

Sur un serveur lancé (`npm run build && npm start`) :

```bash
npm run qa:audit -- http://localhost:3000     # toutes les routes, bureau + mobile : statut, console, images,
                                             # débordement, h1, doublons photographiques
npm run qa:parcours -- http://localhost:3000  # ambiances, filtres, panier, favoris, commande simulée, recherche,
                                             # formulaire pro, menu mobile, mouvement réduit
```

Les scripts utilisent `playwright-core` et le Chromium installé par Playwright (`npx playwright install chromium`) ou celui indiqué par `CHROME_PATH`.

## Pour passer en production réelle

1. Remplacer les visuels de démonstration par de vraies prises de vue (même nommage, puis `npm run images`).
2. Brancher une solution e-commerce (Shopify Hydrogen, Medusa, Stripe…) derrière `lib/store.tsx`.
3. Relier les formulaires (newsletter, demande pro) à un service d'envoi.
4. Compléter mentions légales, CGV, politique de confidentialité, livraison et retours.
