"""Plan de prise de vue Maison Sillage : chaque image du site, son cadrage et sa consigne.

Une prise « base » reçoit en première image une prise déjà générée : c'est ainsi
que les variantes jour / nuit (et le hero vertical mobile) gardent exactement le
même décor, les mêmes produits et le même navire que la version coucher de soleil.
Les prises où figurent des produits reçoivent en références les photographies
d'emballage d'origine (assets/originals/produits) pour reproduire les étiquettes.
"""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "assets" / "originals"

STYLE = (
    "Professional editorial photograph for a luxury French maison of gourmet syrups. "
    "Shot on a medium-format digital camera with a prime lens, natural light, true-to-life colours, restrained elegant grading, "
    "no oversaturation, no HDR look, no glow, no fake bokeh orbs, no lens flare, no illustration or painterly rendering. "
    "Realistic materials, crisp micro-detail, natural imperfections, subtle film grain. "
    "Indistinguishable from a real photograph of a high-end brand campaign."
)

PACKAGING = (
    "Reproduce the Maison Sillage packaging exactly as in the reference images. "
    "Syrup bottle: tall clear glass bottle of amber syrup, gold metal screw cap, ivory paper label with an engraved tall-ship medallion, "
    "MAISON SILLAGE in a classic engraved serif, the italic line « L'empreinte d'une saveur », a small illustration of the flavour, "
    "the flavour name in capitals and SIROP GOURMET. "
    "Powder: matte dark-brown stand-up pouch with a fine engraved botanical pattern and the same ivory label, flavour name and PRÉPARATION GOURMANDE. "
    "Labels perfectly sharp, straight and correctly spelled in French with accents. "
    "Do NOT print any volume, weight or number on the labels. No other text anywhere in the image."
)

FLAVORS = {
    "fraise": {"name": "Fraise des bois & Madeleine dorée", "label": "FRAISE DES BOIS & MADELEINE DORÉE", "season": "printemps"},
    "peche": {"name": "Pêche blanche & Fleur d'oranger", "label": "PÊCHE BLANCHE & FLEUR D'ORANGER", "season": "ete"},
    "poire": {"name": "Poire fondante & Vanille Bourbon", "label": "POIRE FONDANTE & VANILLE BOURBON", "season": "automne"},
    "datte": {"name": "Datte Medjool & Crème brûlée", "label": "DATTE MEDJOOL & CRÈME BRÛLÉE", "season": "hiver"},
}
SEASON_FLAVOR = {v["season"]: k for k, v in FLAVORS.items()}

SHOTS: dict[str, dict] = {}


def refs(flavor: str, *extra: str) -> list[Path]:
    r = [SRC / "produits" / f"flacon-{flavor}.webp", SRC / "produits" / f"sachet-{flavor}.webp"]
    return r + [SRC / "produits" / e for e in extra]


def label(flavor: str) -> str:
    return f"The labels read exactly « {FLAVORS[flavor]['label']} »."


def shot(name: str, prompt: str, size: str, quality: str = "high", images: list[Path] | None = None, base: str | None = None) -> None:
    SHOTS[name] = {"prompt": prompt, "size": size, "quality": quality, "images": images or [], "base": base}


SAME = "Same photograph: same camera position, same framing, same objects{p}, same tall ship at the same place. Only the light changes: "
DAY = (
    "bright clear MIDDAY, high sun, clear blue sky with a few light clouds, deep blue sea with silver sparkles, "
    "neutral white daylight, crisp short shadows{l}. "
)
NIGHT = (
    "NIGHT under a full moon, deep blue night sky with real stars, a silver moon path on the sea, "
    "a few warm lanterns lit on the tall ship's deck, warm lit windows in the village{l}. Natural long-exposure night photography, no fantasy. "
)


def day(products: bool) -> str:
    return SAME.format(p=", same products at the same place" if products else "") + DAY.format(l="; labels unchanged and sharp" if products else "") + STYLE


def night(products: bool) -> str:
    lantern = ", and a small candle lantern on the terrace gently lighting the products so their labels stay readable" if products else ""
    return SAME.format(p=", same products at the same place" if products else "") + NIGHT.format(l=lantern) + STYLE


# ─────────────── Hero : une scène par saison, trois lumières, version bureau + mobile ───────────────

HERO_SCENES = {
    "ete": "golden-hour sunset on a Mediterranean coast in summer: warm low sun, calm sea, a pale limestone terrace balustrade with sprigs of white orange blossom, an ochre cliff-top village in the background on the right",
    "printemps": "soft spring sunset on a Mediterranean bay: gentle peach and pink light, branches of pale pink cherry blossom entering the top right corner, a stone terrace with fresh greenery, a hillside village with cypresses in the background on the right",
    "automne": "warm autumn sunset on a Mediterranean bay: amber light, a few golden and russet leaves on the stone terrace, an old village with a bell tower and olive trees in the background on the right, light evening haze over the water",
    "hiver": "clear winter sunset on a Mediterranean bay: cold pale-gold sky, a light dusting of snow on the stone terrace and on the village rooftops, a quiet old harbour village with warm lit windows in the background on the right",
}
HERO_PRODUCTS = {
    "ete": "the Pêche blanche & Fleur d'oranger syrup bottle and its powder pouch, a tall glass of sparkling white-peach iced drink with ice and a peach slice, two halved white peaches",
    "printemps": "the Fraise des bois & Madeleine dorée syrup bottle and its powder pouch, a glass of strawberry milkshake topped with cream and a fresh strawberry, a small bowl of wild strawberries and a golden madeleine",
    "automne": "the Poire fondante & Vanille Bourbon syrup bottle and its powder pouch, an iced latte in a ribbed glass topped with cream and a thin slice of roasted pear, two ripe pears and vanilla pods",
    "hiver": "the Datte Medjool & Crème brûlée syrup bottle and its powder pouch, a hot latte in a glass cup with caramelised sugar shards on the foam, a small brass dish of Medjool dates",
}

for season, flavor in SEASON_FLAVOR.items():
    shot(
        f"hero-{season}-coucher",
        f"{STYLE} Wide cinematic 16:9 campaign photograph, {HERO_SCENES[season]}. "
        "COMPOSITION, very important (same layout for every season of the campaign): "
        "the horizon line sits HIGH, at about 38 % from the top of the frame; "
        "a classic three-masted tall ship under full sails sits on the horizon between 18 % and 30 % of the frame width, small but clearly identifiable; "
        "BELOW the horizon, the LEFT 45 % of the frame is only calm open sea, empty, clean negative space for a headline; "
        f"the RIGHT half of the frame (from 50 % of the width to the right edge): in the foreground on the stone balustrade, a refined still life with {HERO_PRODUCTS[season]}; "
        "slightly behind them, two other Maison Sillage syrup bottles of the range, strongly out of focus. "
        f"The two main products are sharp, front-facing and fill about 40 % of the frame height. {label(flavor)} " + PACKAGING,
        "3840x2160",
        images=refs(flavor, "gamme-sirops.png"),
    )
    shot(f"hero-{season}-jour", day(True), "3840x2160", base=f"hero-{season}-coucher", images=refs(flavor))
    shot(f"hero-{season}-nuit", night(True), "3840x2160", base=f"hero-{season}-coucher", images=refs(flavor))
    shot(
        f"hero-mobile-{season}-coucher",
        "Recompose this exact scene (same place, same light, same products, same tall ship) as a VERTICAL 3:4 photograph for a phone screen: "
        "the tall ship and the sky in the upper third, the bottle, the pouch and the drink in the lower half, centred and large, labels sharp. "
        f"{label(flavor)} {STYLE} {PACKAGING}",
        "1536x2048",
        base=f"hero-{season}-coucher",
        images=refs(flavor),
    )
    shot(f"hero-mobile-{season}-jour", day(True), "1536x2048", base=f"hero-mobile-{season}-coucher", images=refs(flavor))
    shot(f"hero-mobile-{season}-nuit", night(True), "1536x2048", base=f"hero-mobile-{season}-coucher", images=refs(flavor))

# ─────────────── Histoire : une seconde vue maritime, sans produit, et un détail ───────────────

STORY_SCENES = {
    "printemps": "a stone terrace with a weathered wooden table, an open leather travel journal, a brass compass and a sprig of blossom, overlooking a calm bay where a tall three-masted ship lies at anchor",
    "ete": "an old stone harbour quay with coiled ropes and a mooring bollard in the foreground, a tall three-masted ship moored a little offshore, a Mediterranean village behind",
    "automne": "an open sea-facing window of an old house, on the wooden sill an antique sea chart, a brass telescope and a leather notebook, a tall ship sailing in the bay outside",
    "hiver": "a snowy stone harbour wall with an old iron lantern in the foreground, a tall ship with furled sails moored in a quiet winter harbour, village roofs lightly covered in snow",
}
STORY_DETAILS = {
    "printemps": "an open leather travel journal with handwritten notes and a pressed blossom, a brass compass beside it",
    "ete": "a coiled hemp rope on a sun-warmed stone mooring bollard",
    "automne": "an antique sea chart, a brass telescope and a dip pen on a wooden sill",
    "hiver": "an old iron ship lantern with a lit candle on a snowy stone wall",
}
for season, scene in STORY_SCENES.items():
    shot(
        f"story-{season}-coucher",
        f"{STYLE} Wide 16:9 editorial photograph, no product, no people: {scene}, at golden-hour sunset, poetic sense of voyage and discovery; "
        "the tall ship is clearly identifiable in the middle distance.",
        "2560x1440",
    )
    shot(f"story-{season}-jour", day(False), "2560x1440", base=f"story-{season}-coucher")
    shot(f"story-{season}-nuit", night(False), "2560x1440", base=f"story-{season}-coucher")
    shot(f"detail-{season}", f"{STYLE} Portrait 4:5 close-up still life, shallow depth of field: {STORY_DETAILS[season]}, warm natural light, maritime travel mood.", "1024x1280", quality="medium")

# ─────────────── Produits : packshots, duos, gammes, coffret ───────────────

for flavor, f in FLAVORS.items():
    shot(
        f"packshot-sirop-{flavor}",
        f"{STYLE} Premium e-commerce packshot, portrait 2:3: the Maison Sillage « {f['name']} » syrup bottle alone, standing centred and front-facing "
        "on a warm ivory stone surface against a soft warm ivory seamless backdrop, soft window light from the left, gentle natural shadow, "
        f"a few fresh ingredients of the flavour placed discreetly at its foot. The bottle fills two thirds of the height, label razor sharp. {label(flavor)} {PACKAGING}",
        "1024x1536",
        images=refs(flavor),
    )
    shot(
        f"packshot-poudre-{flavor}",
        f"{STYLE} Premium e-commerce packshot, portrait 2:3: the Maison Sillage « {f['name']} » powder pouch alone, standing centred and front-facing "
        "on a warm ivory stone surface against a soft warm ivory seamless backdrop, soft window light, gentle shadow, "
        f"a small ceramic dish of the powder and a few ingredients of the flavour at its foot. Label razor sharp. {label(flavor)} {PACKAGING}",
        "1024x1536",
        images=refs(flavor),
    )
    shot(
        f"duo-{flavor}",
        f"{STYLE} Portrait 4:5 studio still life in chiaroscuro: the Maison Sillage « {f['name']} » syrup bottle and its powder pouch side by side on dark aged oak, "
        "deep espresso-brown background, a single soft golden side light, the ingredients of the flavour arranged at their foot. "
        f"Both labels sharp and readable. {label(flavor)} {PACKAGING}",
        "1536x1920",
        images=refs(flavor),
    )

ORDER = "FRAISE DES BOIS & MADELEINE DORÉE, PÊCHE BLANCHE & FLEUR D'ORANGER, POIRE FONDANTE & VANILLE BOURBON, DATTE MEDJOOL & CRÈME BRÛLÉE"
shot(
    "gamme-sirops",
    f"{STYLE} Wide 3:2 product family photograph: the four Maison Sillage syrup bottles side by side, front-facing, evenly spaced, from left to right: {ORDER}; "
    f"each with a few of its ingredients at its foot; on an aged oak table, soft late-afternoon window light, plain warm limestone wall behind. {PACKAGING}",
    "3072x2048",
    images=[SRC / "produits" / "gamme-sirops.png", SRC / "produits" / "flacon-datte.webp"],
)
shot(
    "gamme-poudres",
    f"{STYLE} Wide 3:2 product family photograph: the four Maison Sillage powder pouches side by side, front-facing, from left to right: {ORDER}; "
    f"small ceramic bowls of powder and ingredients in front; on an aged oak table, soft window light, plain warm limestone wall behind. {PACKAGING}",
    "3072x2048",
    images=[SRC / "produits" / f"sachet-{f}.webp" for f in FLAVORS],
)
shot(
    "coffret-decouverte",
    f"{STYLE} 3:2 product photograph of the Maison Sillage Coffret Découverte: an elegant open rigid gift box in deep espresso brown, "
    "its lid with a gold-foil engraved tall-ship emblem leaning behind, holding three syrup bottles side by side on ivory paper: "
    "FRAISE DES BOIS & MADELEINE DORÉE, PÊCHE BLANCHE & FLEUR D'ORANGER, POIRE FONDANTE & VANILLE BOURBON. "
    f"Soft daylight, ivory linen surface, a few strawberries, a peach and a pear around. {PACKAGING}",
    "3072x2048",
    images=[SRC / "produits" / "flacon-fraise.webp", SRC / "produits" / "flacon-peche.webp", SRC / "produits" / "flacon-poire.webp"],
)

# ─────────────── Saisons : scènes de collection, paysages, matières ───────────────

SCENES = {
    "printemps": "a spring garden terrace in bloom, pink and white blossoms, fresh greenery, an elegant café table, soft morning light",
    "ete": "a Mediterranean terrace above a blue sea in summer, white orange blossom, ice, bright golden afternoon light",
    "automne": "a warm wooden table by a window in autumn, golden leaves, pears, cinnamon and vanilla, amber late-afternoon light",
    "hiver": "a cosy old interior in winter, a lit fireplace softly out of focus, a wool throw, candlelight, snow visible through a window",
}
SCENE_DRINK = {
    "printemps": "a strawberry milkshake with whipped cream and a fresh strawberry, wild strawberries and golden madeleines",
    "ete": "a sparkling white-peach iced drink with ice and orange blossom, halved white peaches",
    "automne": "an iced latte topped with cream, caramel drizzle and a roasted pear slice, whole pears",
    "hiver": "a hot latte with caramelised sugar shards, a crème brûlée in a ramekin, Medjool dates",
}
PAYSAGES = {
    "printemps": "a terraced Mediterranean village garden in spring, cherry and almond trees in blossom, old stone walls, the sea in the distance, soft morning light",
    "ete": "a vine-covered stone terrace with a rustic table above a Mediterranean bay at golden hour, cypresses, a village on the cliff, a few sailing boats",
    "automne": "a pear orchard and vineyards in autumn on rolling hills above a lake, golden and russet leaves, warm afternoon light, an old stone farmhouse",
    "hiver": "a snowy old coastal village at dusk, warm lit windows, smoke from chimneys, a calm grey-blue sea and a moored tall ship",
}
for season, flavor in SEASON_FLAVOR.items():
    shot(
        f"scene-{season}",
        f"{STYLE} Wide 3:2 lifestyle still life: {SCENES[season]}. On the table, the Maison Sillage « {FLAVORS[flavor]['name']} » syrup bottle and its powder pouch, "
        f"with {SCENE_DRINK[season]}. Products in the right half of the frame, the left half calmer and softer for text. {label(flavor)} {PACKAGING}",
        "3072x2048",
        images=refs(flavor),
    )
    shot(f"paysage-{season}", f"{STYLE} Wide 16:9 landscape photograph, no people, no product: {PAYSAGES[season]}.", "3072x1728")

MATIERES = {
    "printemps-fraises": "wild strawberries and strawberry flowers on a linen cloth",
    "printemps-fleurs": "a branch of pale pink cherry blossom in soft spring light",
    "ete-peches": "ripe white peaches, one halved, in a wooden crate in an orchard",
    "ete-fleurs-oranger": "orange blossom flowers and glossy orange-tree leaves",
    "automne-poires": "ripe pears hanging on a branch in an orchard",
    "automne-epices": "Bourbon vanilla pods, cinnamon sticks and star anise on an old wooden board",
    "hiver-dattes": "glossy Medjool dates in an engraved brass dish",
    "hiver-chocolat": "dark chocolate pieces and cocoa powder in a ceramic bowl",
}
for name, subject in MATIERES.items():
    shot(f"matiere-{name}", f"{STYLE} Square close-up food photograph, shallow depth of field: {subject}. Natural window light, tactile detail.", "2048x2048", quality="medium")

shot(
    "matiere-poudre",
    f"{STYLE} Wide 3:2 macro food photograph: a heaped vintage silver spoon of fine golden-beige gourmet drink powder, the powder's soft texture in sharp detail, "
    "a little powder dusted on dark slate, the Maison Sillage Poire fondante & Vanille Bourbon pouch softly out of focus behind, a whisk and a latte cup, warm side light. "
    f"{label('poire')} {PACKAGING}",
    "3072x2048",
    images=refs("poire"),
)

# ─────────────── Boissons, recettes, scènes de vie ───────────────

DRINKS = {
    "latte-datte": ("datte", "a hot latte in a ribbed glass, cream foam topped with caramelised sugar shards, beside the Datte Medjool & Crème brûlée bottle, on a dark wooden table, warm side light"),
    "iced-latte-poire": ("poire", "a layered iced latte in a tall glass (syrup, cold milk, espresso) with ice and a slice of roasted pear, beside the Poire fondante & Vanille Bourbon bottle, on light stone, soft daylight"),
    "mocktail-peche": ("peche", "a sparkling non-alcoholic white-peach mocktail in a highball glass with ice, peach slices, mint and orange blossom, beside the Pêche blanche & Fleur d'oranger bottle, on a sunny terrace table"),
    "milkshake-fraise": ("fraise", "a strawberry milkshake with whipped cream, strawberry coulis and a fresh strawberry, beside the Fraise des bois & Madeleine dorée bottle and a madeleine, on an ivory marble table, morning light"),
    "chocolat-chaud": ("datte", "a thick hot chocolate in a stoneware cup with gentle steam, next to a window with falling snow outside, the Datte Medjool & Crème brûlée powder pouch beside it, candlelight"),
    "creme-brulee": ("datte", "a crème brûlée in a white ramekin with a perfectly caramelised top being cracked by a gold spoon, a few Medjool dates beside, dark wood, no product packaging"),
    "cafe-terrasse": ("poire", "a cup of black coffee on a weathered wooden café table on a terrace above the sea, an open travel notebook and a brass compass, the Poire fondante & Vanille Bourbon bottle in the background, slightly out of focus"),
    "latte-poire": ("poire", "a hot pear and vanilla latte with latte art in a glass, the Poire fondante & Vanille Bourbon powder pouch behind, autumn leaves and a pear on the table"),
}
for name, (flavor, subject) in DRINKS.items():
    shot(f"boisson-{name}", f"{STYLE} Portrait 2:3 drink photograph: {subject}. The drink is the hero and perfectly sharp. {label(flavor)} {PACKAGING}", "1024x1536", images=refs(flavor))

shot(
    "comptoir-professionnel",
    f"{STYLE} Wide 3:2 photograph inside an elegant coffee shop with large windows on a harbour: a barista's hands (face not visible, dark apron) pour "
    "Maison Sillage syrup from the bottle into an iced latte on a white marble counter; several Maison Sillage syrup bottles and two powder pouches lined up on the counter, "
    f"espresso machine softly out of focus, warm natural light. {PACKAGING}",
    "3072x2048",
    images=[SRC / "produits" / "gamme-sirops.png", SRC / "produits" / "sachet-poire.webp", SRC / "produits" / "flacon-poire.webp"],
)
