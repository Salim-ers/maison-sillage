# Sources photographiques — Maison Sillage

`assets/originals/` conserve les fichiers transmis, renommés mais **jamais modifiés**.
Le site n'y lit rien directement : `python -I scripts/images/build.py` (ou `npm run images`) produit les
masters WebP de `public/images/` et le manifeste `data/images.generated.json` (dimensions + aperçu flou).
`next/image` dérive ensuite les tailles AVIF/WebP responsives. Aucune image n'est agrandie au-delà de sa source.

Le dossier `assets/` est exclu du déploiement Vercel (`.vercelignore`).

## Inventaire

| Source (`assets/originals/`) | Contenu | Utilisation sur le site |
|---|---|---|
| `maritime/voilier-cote-rocheuse.png` | Trois-mâts, côte rocheuse, village | Hero **été** · histoire **automne** · image de partage · article « routes maritimes » |
| `maritime/voilier-terrasse-lanterne.png` | Trois-mâts vu d'une terrasse à lanterne | Hero **printemps** · histoire **été** et **hiver** · détail « lanterne » |
| `maritime/voilier-terrasse-amphores.png` | Trois-mâts vu d'un quai à amphores | Hero **automne** · histoire **printemps** · détail « bitte d'amarrage » |
| `maritime/voilier-plage-rochers.png` | Trois-mâts, crique, tour ancienne | Hero **hiver** · détail « escalier » |
| `produits/flacon-*.webp` (×4) | Flacon seul, recadré de la nature morte | Cartes sirops (boutique, signatures), galerie fiche |
| `produits/sachet-*.webp` (×4) | Sachet seul | Cartes poudres, galerie fiche |
| `produits/boisson-*.webp` (×4) | Boisson seule | Galerie « Usages », recettes |
| `produits/portrait-*.webp` (×4) | Nature morte flacon + sachet + boisson | Galeries des fiches poudres, recettes, Savoir-faire |
| `produits/gamme-sirops.png` | Les 4 flacons sur le quai | Pages Sirops, Savoir-faire, Professionnels, journal ; recadrages « quai » (section Créations) et Coffret |
| `produits/gamme-poudres.png` | Les 4 sachets sur le quai | Page Professionnels ; recadrages « quai » (section Créations) |
| `produits/scene-{fraise-printemps,peche-ete,poire-automne,datte-hiver}.png` | Scènes de collection | Fond du sélecteur des saisons, chapitres de Collections, galeries sirops |
| `produits/scene-poire-coucher-soleil.png` | Iced latte poire face au port | Le monde Maison Sillage, page Recettes, fiche Coffret, recette Iced latte |
| `produits/scene-comptoir-bar.png` | Comptoir de bar face au port | Section et page Professionnels, journal |
| `saisons/*/hero-*.jpg` (×4) | Paysages de saison (pack « 4 saisons ») | Bannières des chapitres de Collections ; Le monde Maison Sillage, Boutique, Notre histoire, Savoir-faire, journal ; recadrages « café en terrasse » et « chocolat chaud » |
| `saisons/*/*.jpg` (×8) | Détails de matières (planches) | Vignettes de saison, histoire gustative des fiches, Savoir-faire, Poudres |
| `marque/logo-original.png` | Logo transmis | Référence ; le site utilise le détourage existant de `public/brand/` (dessin inchangé) |

L'attribution détaillée, section par section, est centralisée dans `data/images.ts`.
Règle appliquée : une même photographie n'apparaît jamais deux fois sur une page
(contrôlé par `npm run qa:audit`).

## Ambiances (saison × lumière)

Chaque saison a **sa propre photographie maritime** pour le hero et une autre pour la section « Histoire ».
Les trois lumières sont produites hors ligne par `scripts/images/grading.py` à partir de ces prises de vue de coucher de soleil :

- **coucher** : la photographie d'origine, avec la dominante de la saison ;
- **jour** : balance des blancs neutralisée, ciel recoloré en bleu par masque, reflets argentés ;
- **nuit** : « nuit américaine » (day-for-night) — le soleil devient une lune, son reflet un chemin de lune.

Sur le site, ces variantes sont complétées par des calques animés (étoiles, fenêtres et lanternes qui s'allument,
feu de poupe, pétales, reflets, feuilles, neige) posés dans le même repère que la photographie.

## Visuels manquants

À fournir pour atteindre un rendu 100 % photographique « réel » :

1. **Vraies prises de vue de jour et de nuit** des scènes maritimes : les versions jour / nuit actuelles sont des
   étalonnages d'images de coucher de soleil, convaincants à l'écran mais pas de véritables photographies nocturnes.
   Pour les remplacer, déposer les fichiers dans `public/images/hero/` et `public/images/story/` sous les mêmes noms
   (`{scène}-{saison}-{jour|nuit}.webp`) puis relancer `npm run images` pour régénérer le manifeste.
2. **Paysages maritimes d'hiver et de printemps** (neige sur la côte, vergers en fleurs au bord de mer) : l'hiver et le
   printemps du hero sont des étalonnages + particules sur des photographies d'été.
3. **Barista en action / comptoir de coffee shop** : la section professionnelle utilise le comptoir de bar fourni, sans personne.
4. **Gros plan de la matière poudre** (texture d'une préparation) : remplacé par la photographie cacao / chocolat noir.
5. **Pistache & Fleur de sel** (édition à l'étude) : aucun visuel ; la fiche affiche un encart typographique « Visuel à venir ».
6. **Détails de saison en haute définition** : les 8 détails proviennent de planches agrandies (piqué limité) ;
   ils ne sont utilisés qu'en petit et moyen format.
7. Les paysages d'automne et d'hiver du pack saisonnier sont des agrandissements peu piqués : masters limités à 1920 px.

Toutes ces images sont des visuels de démonstration générés pour un prototype : elles ne doivent pas être présentées
comme des photographies de lieux ou de produits réels.
