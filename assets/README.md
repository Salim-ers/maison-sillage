# Photographies — Maison Sillage

## Chaîne de production

1. **`scripts/images/shots.py`** — le plan de prise de vue : chaque image du site, son cadrage, sa taille et sa consigne
   (direction artistique commune : photographie éditoriale, lumière naturelle, aucun rendu « illustration »).
2. **`scripts/images/generate.py`** — génère les prises de vue avec l'API OpenAI Images (`gpt-image-2`), en haute
   définition (jusqu'à 3840 × 2160), dans `assets/generated/` :

   ```bash
   OPENAI_API_KEY=… python -I scripts/images/generate.py            # tout ce qui manque
   OPENAI_API_KEY=… python -I scripts/images/generate.py --force "hero-ete-*"   # refaire une série
   ```

   La clé n'est lue que dans l'environnement ; elle n'est jamais écrite dans le dépôt.
3. **`scripts/images/build.py`** (`npm run images`) — convertit les sources en masters WebP dans `public/images/`,
   écrit `data/images.generated.json` (dimensions, aperçu flou) et l'image de partage `app/opengraph-image.jpg`.
4. **`data/images.ts`** — attribue chaque photographie à sa section. Une même photographie n'apparaît jamais deux fois
   sur une page (contrôlé par `npm run qa:audit`).

`assets/generated/` (≈ 600 Mo de PNG haute définition) est exclu de Git et du déploiement : il se régénère avec
l'étape 2. Seuls les masters WebP de `public/images/` sont versionnés.

## Fidélité des produits

Chaque prise où figurent des produits reçoit en référence les photographies d'emballage d'origine
(`assets/originals/produits/flacon-*`, `sachet-*`, `gamme-sirops`) : même flacon, même sachet, même étiquette gravée,
même nom de saveur. Les étiquettes ne portent volontairement aucun volume ni grammage, pour rester valables pour
tous les formats du catalogue.

## Ambiances (saison × lumière)

Chaque saison a sa propre scène de hero (voilier au large + création de la saison au premier plan) et sa propre vue
maritime pour la section « Histoire ». La version **coucher de soleil** est générée d'abord ; les versions **jour** et
**nuit** sont obtenues en éditant cette image : même cadrage, mêmes produits, même navire, vraie lumière différente
(ciel bleu de midi, ou clair de lune, étoiles, fenêtres et lanternes allumées). Le hero existe aussi en **version
verticale 3:4** pour les téléphones, recomposée à partir de la même scène.

Sur le site, seules des particules de saison (pétales, lueurs dorées, feuilles, neige) sont superposées en animation.

## Inventaire (81 prises)

| Série | Nombre | Usage |
|---|---|---|
| `hero-{saison}-{lumière}` | 12 | Hero bureau 16:9 |
| `hero-mobile-{saison}-{lumière}` | 12 | Hero mobile 3:4 |
| `story-{saison}-{lumière}` | 12 | Section « Histoire », bandeau de « Notre histoire », journal |
| `detail-{saison}` | 4 | Petite image secondaire de la section « Histoire » |
| `packshot-sirop-*`, `packshot-poudre-*` | 8 | Cartes produits (boutique, accueil), première vue des fiches, panier |
| `duo-*` | 4 | Carrousel « Créations signatures », galerie des fiches |
| `gamme-sirops`, `gamme-poudres`, `coffret-decouverte` | 3 | Pages Sirops / Poudres, section Poudres, professionnels, coffret |
| `scene-{saison}` | 4 | Sélecteur des saisons, chapitres de Collections, galerie des sirops |
| `paysage-{saison}` | 4 | Bannières des chapitres de Collections, boutique, notre histoire |
| `matiere-*` | 9 | Matières de saison, gros plan de la poudre |
| `boisson-*` | 8 | Galerie « Usages », recettes |
| `comptoir-professionnel` | 1 | Section et page professionnels, journal |

`assets/originals/` conserve les fichiers transmis au départ (non modifiés) : les photographies d'emballage servent de
références à la génération ; les anciennes vues maritimes et saisonnières ne sont plus utilisées par le site.

## Limites

- Ce sont des **visuels de démonstration générés**, pas des prises de vue réelles : ils ne doivent pas être présentés
  comme des photographies de produits commercialisés ni de lieux existants.
- Les petits textes des étiquettes peuvent comporter de légères imperfections typographiques (accents) visibles en très
  gros plan ; avant toute commercialisation, prévoir un vrai shooting produit.
- **Pistache & Fleur de sel** (édition à l'étude) n'a volontairement pas de visuel : la fiche affiche « Visuel à venir ».
