"""Chaîne de production des images Maison Sillage.

    python -I scripts/images/build.py            # tout reconstruire
    python -I scripts/images/build.py hero story # seulement certains groupes

Lit les sources haute résolution de `assets/originals/` (jamais modifiées) et
écrit dans `public/images/` des masters WebP prêts pour `next/image`, qui en
dérive les tailles AVIF/WebP responsives. Produit aussi
`data/images.generated.json` : dimensions et mini-aperçu flou (blurDataURL)
de chaque image, lus par `data/images.ts`.

Aucune image n'est agrandie : chaque master garde au plus la définition de sa
source.
"""

from __future__ import annotations

import base64
import io
import json
import sys
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).parent))
from grading import grade  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "assets" / "originals"
OUT = ROOT / "public" / "images"
MANIFEST = ROOT / "data" / "images.generated.json"

SEASONS = ["printemps", "ete", "automne", "hiver"]
LIGHTS = ["jour", "coucher", "nuit"]

# ── Photographies maritimes : repères pour l'étalonnage ─────────────────────
MARITIME = {
    "voilier-terrasse-lanterne": {"horizon": 0.50, "sun": (0.17, 0.42), "sky": [(0.0, 0.93, 0.0, 0.5)]},
    "voilier-plage-rochers": {"horizon": 0.52, "sun": (0.29, 0.46), "sky": [(0.0, 0.66, 0.0, 0.52), (0.6, 0.95, 0.0, 0.27)]},
    "voilier-terrasse-amphores": {"horizon": 0.50, "sun": (0.22, 0.385), "sky": [(0.0, 0.66, 0.0, 0.48), (0.6, 0.84, 0.0, 0.22)]},
    "voilier-cote-rocheuse": {"horizon": 0.47, "sun": (0.32, 0.375), "sky": [(0.0, 0.64, 0.0, 0.47), (0.6, 0.92, 0.0, 0.25)]},
}

# Une photographie par saison pour le hero, une autre pour l'histoire,
# et un détail tiré d'une troisième : jamais deux fois la même vue à l'écran.
HERO = {"printemps": "voilier-terrasse-lanterne", "ete": "voilier-cote-rocheuse", "automne": "voilier-terrasse-amphores", "hiver": "voilier-plage-rochers"}
STORY = {"printemps": "voilier-terrasse-amphores", "ete": "voilier-terrasse-lanterne", "automne": "voilier-cote-rocheuse", "hiver": "voilier-terrasse-lanterne"}
DETAIL = {
    "printemps": ("voilier-plage-rochers", (0.70, 0.48, 1.0, 1.0), "escalier"),
    "ete": ("voilier-terrasse-amphores", (0.44, 0.5, 0.72, 0.9), "bitte-amarrage"),
    "automne": ("voilier-terrasse-lanterne", (0.0, 0.0, 0.25, 0.5), "lanterne"),
    "hiver": ("voilier-terrasse-amphores", (0.44, 0.5, 0.72, 0.9), "bitte-amarrage"),
}

FLAVORS = ["fraise", "peche", "poire", "datte"]

# Flacons et sachets isolés dans les deux photographies de gamme (coucher de soleil)
QUAI_FLACON = {"fraise": (0.165, 0.05, 0.375, 0.93), "peche": (0.325, 0.05, 0.535, 0.93), "poire": (0.485, 0.05, 0.695, 0.93), "datte": (0.645, 0.05, 0.855, 0.93)}
QUAI_SACHET = {"fraise": (0.13, 0.1, 0.35, 0.9), "peche": (0.31, 0.07, 0.51, 0.87), "poire": (0.51, 0.1, 0.71, 0.9), "datte": (0.71, 0.1, 0.93, 0.9)}

manifest: dict[str, dict] = {}


def crop_frac(im: Image.Image, box: tuple[float, float, float, float]) -> Image.Image:
    w, h = im.size
    x0, y0, x1, y1 = box
    return im.crop((round(x0 * w), round(y0 * h), round(x1 * w), round(y1 * h)))


def crop_px(im: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    return im.crop(box)


def fit(im: Image.Image, max_w: int) -> Image.Image:
    w, h = im.size
    if w <= max_w:
        return im
    return im.resize((max_w, round(h * max_w / w)), Image.LANCZOS)


def blur_data(im: Image.Image) -> str:
    w, h = im.size
    tiny = im.convert("RGB").resize((16, max(1, round(16 * h / w))), Image.BILINEAR)
    buf = io.BytesIO()
    tiny.save(buf, "WEBP", quality=40)
    return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()


def save(im: Image.Image, rel: str, quality: int = 86, max_w: int = 2560) -> None:
    im = fit(im.convert("RGB"), max_w)
    path = OUT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "WEBP", quality=quality, method=6)
    manifest["/images/" + rel] = {"w": im.size[0], "h": im.size[1], "blur": blur_data(im)}
    print(f"  {rel:<52} {im.size[0]}×{im.size[1]}  {path.stat().st_size // 1024} Ko")


def open_src(rel: str) -> Image.Image:
    return Image.open(SRC / rel).convert("RGB")


# ─────────────────────────────── groupes ───────────────────────────────

def build_hero() -> None:
    print("hero — voilier par saison, étalonné jour / coucher / nuit")
    for season, photo in HERO.items():
        src = open_src(f"maritime/{photo}.png")
        for light in LIGHTS:
            save(grade(src, MARITIME[photo], season, light), f"hero/{photo}-{season}-{light}.webp", quality=88)


def build_story() -> None:
    print("story — seconde vue maritime et détail, mêmes ambiances")
    for season, photo in STORY.items():
        src = open_src(f"maritime/{photo}.png")
        for light in LIGHTS:
            save(grade(src, MARITIME[photo], season, light), f"story/{photo}-{season}-{light}.webp", quality=86)
    for season, (photo, box, name) in DETAIL.items():
        src = open_src(f"maritime/{photo}.png")
        for light in LIGHTS:
            g = grade(src, MARITIME[photo], season, light)
            save(crop_frac(g, box), f"story/detail-{name}-{season}-{light}.webp", quality=86)


def build_products() -> None:
    print("products — flacons, sachets, natures mortes, gammes")
    for f in FLAVORS:
        save(open_src(f"produits/flacon-{f}.webp"), f"products/flacon-{f}.webp", quality=90)
        save(open_src(f"produits/sachet-{f}.webp"), f"products/sachet-{f}.webp", quality=90)
        save(open_src(f"produits/portrait-{f}.webp"), f"products/nature-morte-{f}.webp", quality=88)
    gs = open_src("produits/gamme-sirops.png")
    gp = open_src("produits/gamme-poudres.png")
    save(gs, "products/gamme-sirops.webp")
    save(gp, "products/gamme-poudres.webp")
    for f in FLAVORS:
        save(crop_frac(gs, QUAI_FLACON[f]), f"products/quai-flacon-{f}.webp", quality=90)
        save(crop_frac(gp, QUAI_SACHET[f]), f"products/quai-sachet-{f}.webp", quality=90)
    # Coffret Découverte : les trois premiers flacons de la gamme (fraise, pêche, poire)
    save(crop_frac(gs, (0.14, 0.04, 0.69, 0.97)), "products/coffret-decouverte.webp", quality=90)


def build_seasons() -> None:
    print("seasons — scènes de collection, paysages, matières")
    for season, f in zip(SEASONS, ["fraise-printemps", "peche-ete", "poire-automne", "datte-hiver"]):
        save(open_src(f"produits/scene-{f}.png"), f"seasons/scene-{season}.webp", quality=88)
    save(open_src("saisons/printemps/hero-printemps-terrasse.jpg"), "seasons/paysage-printemps.webp", quality=84)
    save(open_src("saisons/ete/hero-ete-vue-mer.jpg"), "seasons/paysage-ete.webp", quality=84)
    # automne et hiver : sources agrandies et peu piquées, master limité à 1920 px
    save(open_src("saisons/automne/hero-automne-paysage.jpg"), "seasons/paysage-automne.webp", quality=84, max_w=1920)
    hiver = open_src("saisons/hiver/hero-hiver-fenetre.jpg")
    save(crop_px(hiver, (400, 0, hiver.size[0], hiver.size[1])), "seasons/paysage-hiver.webp", quality=84, max_w=1920)
    # détails de planche : on retire les filets de séparation de la planche d'origine
    details = {
        "printemps-fleurs": ("saisons/printemps/fleurs-blanches.jpg", (0, 186, 1200, 1200)),
        "printemps-fraises": ("saisons/printemps/fraises-des-bois.jpg", (0, 194, 1200, 1200)),
        "ete-peches": ("saisons/ete/peches-soleil.jpg", (0, 188, 1200, 1200)),
        "ete-fleurs-oranger": ("saisons/ete/fleurs-agrumes.jpg", (452, 384, 1200, 1200)),
        "automne-poires": ("saisons/automne/poires-du-verger.jpg", (28, 56, 1172, 1200)),
        "automne-epices": ("saisons/automne/cannelle-epices.jpg", (21, 42, 1179, 1200)),
        "hiver-dattes": ("saisons/hiver/dattes-naturelles.jpg", (30, 62, 1170, 1200)),
        "hiver-chocolat": ("saisons/hiver/chocolat-noir.jpg", (30, 61, 1170, 1200)),
    }
    for name, (rel, box) in details.items():
        save(crop_px(open_src(rel), box), f"seasons/matiere-{name}.webp", quality=86)


def build_recipes() -> None:
    print("recipes — boissons et desserts")
    names = {"poire": "iced-latte-poire", "peche": "mocktail-peche", "datte": "latte-datte", "fraise": "milkshake-fraise"}
    for f in FLAVORS:
        save(open_src(f"produits/boisson-{f}.webp"), f"recipes/{names[f]}.webp", quality=90)
    save(crop_frac(open_src("produits/portrait-datte.webp"), (0.5, 0.555, 0.96, 0.88)), "recipes/creme-brulee-datte.webp", quality=90)
    save(crop_frac(open_src("saisons/ete/hero-ete-vue-mer.jpg"), (0.48, 0.18, 1.0, 1.0)), "recipes/cafe-terrasse.webp", quality=86, max_w=1600)
    save(crop_frac(open_src("saisons/hiver/hero-hiver-fenetre.jpg"), (0.34, 0.12, 0.96, 1.0)), "recipes/chocolat-chaud.webp", quality=86, max_w=1400)
    save(crop_frac(open_src("produits/scene-poire-automne.png"), (0.36, 0.2, 0.74, 1.0)), "recipes/latte-poire-automne.webp", quality=88)


def build_lifestyle() -> None:
    print("lifestyle — scènes de vie")
    save(open_src("produits/scene-poire-coucher-soleil.png"), "lifestyle/latte-poire-coucher.webp", quality=88)
    save(open_src("produits/scene-comptoir-bar.png"), "lifestyle/comptoir-professionnel.webp", quality=88)


def build_og() -> None:
    """Image de partage 1200 × 630 : le voilier d'été au coucher du soleil et le logo officiel."""
    print("og — image de partage")
    photo = "voilier-cote-rocheuse"
    g = grade(open_src(f"maritime/{photo}.png"), MARITIME[photo], "ete", "coucher")
    w, h = g.size
    crop_h = round(w * 630 / 1200)
    g = g.crop((0, (h - crop_h) // 2, w, (h - crop_h) // 2 + crop_h)).resize((1200, 630), Image.LANCZOS)
    # voile sombre côté droit pour le logo
    veil = Image.new("L", (1200, 630))
    for x in range(1200):
        a = max(0.0, min(1.0, (x - 560) / 420))
        veil.paste(int(205 * a), (x, 0, x + 1, 630))
    dark = Image.new("RGB", (1200, 630), (20, 11, 5))
    g = Image.composite(dark, g, veil)
    logo = Image.open(ROOT / "public" / "brand" / "logo-dark.png").convert("RGBA")
    lw = 300
    logo = logo.resize((lw, round(logo.size[1] * lw / logo.size[0])), Image.LANCZOS)
    g = g.convert("RGBA")
    g.alpha_composite(logo, (1200 - lw - 95, (630 - logo.size[1]) // 2))
    out = ROOT / "app" / "opengraph-image.jpg"
    g.convert("RGB").save(out, "JPEG", quality=86, optimize=True, progressive=True)
    print(f"  {out.relative_to(ROOT)} 1200×630  {out.stat().st_size // 1024} Ko")


GROUPS = {
    "hero": build_hero,
    "story": build_story,
    "products": build_products,
    "seasons": build_seasons,
    "recipes": build_recipes,
    "lifestyle": build_lifestyle,
    "og": build_og,
}


def main() -> None:
    wanted = sys.argv[1:] or list(GROUPS)
    if MANIFEST.exists():
        manifest.update(json.loads(MANIFEST.read_text(encoding="utf-8")))
    for g in wanted:
        GROUPS[g]()
    MANIFEST.write_text(json.dumps(dict(sorted(manifest.items())), ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\n{len(manifest)} images dans {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
