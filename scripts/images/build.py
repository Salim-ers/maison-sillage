"""Chaîne de production des images Maison Sillage.

    python -I scripts/images/build.py      # ou : npm run images

Avant : `python -I scripts/images/stock.py` (photographies Unsplash), `node scripts/images/labels.mjs`
(étiquettes), `python -I scripts/images/packshots.py`, `mockups.py` et `relabel.py` (visuels composés).

Sources publiées :
  - assets/composed/   packshots (pack-*), gammes (gamme-*), objets de L'Atelier (acc-*),
                       scènes du hero ré-étiquetées (hero-*)
  - assets/stock/      photographies sous licence Unsplash (boissons, ingrédients, comptoir)
  - assets/generated/  scènes sans emballage : paysages, vues maritimes, matières
Aucune image générée montrant un emballage n'est publiée telle quelle : ses étiquettes
(texte et logo inventés) ont été remplacées par relabel.py, ou elle est écartée.

Écrit dans public/images/ chaque image en plusieurs largeurs WebP, prêtes à servir telles quelles
(lib/image-loader.ts choisit la bonne pour chaque écran : aucun calcul à la première visite),
data/images.generated.json (dimensions, aperçu flou, crédit) et l'image de partage.
Aucune image n'est agrandie : la plus grande largeur est celle de la source.
"""

from __future__ import annotations

import base64
import hashlib
import io
import json
import sys
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
GEN = ROOT / "assets" / "generated"
COMPOSED = ROOT / "assets" / "composed"
STOCK = ROOT / "assets" / "stock"
OUT = ROOT / "public" / "images"
MANIFEST = ROOT / "data" / "images.generated.json"
STOCK_META = json.loads((ROOT / "scripts" / "images" / "stock.json").read_text(encoding="utf-8"))

SEASONS = ["printemps", "ete", "automne", "hiver"]
# largeurs publiées : les mêmes que images.deviceSizes + images.imageSizes (next.config.ts) et lib/image-loader.ts
WIDTHS = [64, 96, 160, 256, 384, 480, 640, 960, 1280, 1920, 2560, 3840]
LIGHTS = ["jour", "coucher", "nuit"]

# photographies Unsplash qui ne sont pas publiées telles quelles
STOCK_SKIP = {
    "barista-2",  # inscriptions de la machine visibles
    "boisson-iced-latte-3",  # même photographie que la base du verre de L'Atelier
    "univers-pistache-2",  # journal imprimé dans le cadre
}
# objets de L'Atelier : photographie de base de chaque visuel retouché (crédit)
MOCKUP_BASE = {
    "acc-mug-ceramique": "acc-mug",
    "acc-tasse-espresso-gres": "acc-espresso",
    "acc-verre-latte-glace": "acc-verre",
    "acc-cafetiere-italienne": "acc-moka",
    "acc-cuillere-doseuse": "acc-cuillere",
    "acc-carafe-sirop": "acc-carafe-2",
    "acc-coffret-decouverte": "acc-coffret",
    "acc-carnet-recettes": "acc-carnet",
}
# fonds réels utilisés pour les packshots et les étiquettes
STUDIO = ["fond-mur", "fond-pierre-2", "fond-papier"]


def credit_of(stock_key: str, note: str | None = None) -> dict:
    m = STOCK_META[stock_key]
    c = {"name": m["photographer"], "url": m["page"], "source": "Unsplash"}
    if note:
        c["note"] = note
    return c


def plan() -> list[dict]:
    """clé logique → source, chemin publié, largeur max, qualité, crédit"""
    P: list[dict] = []
    gen_note = {"name": "Maison Sillage", "source": "Image générée (gpt-image-2)"}
    for l in LIGHTS:
        relab = {**gen_note, "note": "étiquettes remplacées par l'étiquette de la gamme"}
        P.append({"key": f"hero-ete-{l}", "src": COMPOSED / f"hero-ete-{l}.png", "rel": f"hero/ete-{l}.webp", "max": 3840, "q": 82, "credit": relab})
        P.append({"key": f"hero-mobile-ete-{l}", "src": COMPOSED / f"hero-mobile-ete-{l}.png", "rel": f"hero/mobile-ete-{l}.webp", "max": 1536, "q": 84, "credit": relab})
    for s in SEASONS:
        P.append({"key": f"story-{s}", "src": GEN / f"story-{s}-coucher.png", "rel": f"story/{s}.webp", "max": 2560, "q": 84, "credit": gen_note})
        P.append({"key": f"detail-{s}", "src": GEN / f"detail-{s}.png", "rel": f"story/detail-{s}.webp", "max": 1024, "q": 86, "credit": gen_note})
        P.append({"key": f"paysage-{s}", "src": GEN / f"paysage-{s}.png", "rel": f"seasons/paysage-{s}.webp", "max": 3072, "q": 84, "credit": gen_note})
    for key, src in {
        "matiere-fraises": "matiere-printemps-fraises",
        "matiere-cerisier": "matiere-printemps-fleurs",
        "matiere-poires": "matiere-automne-poires",
        "matiere-fleurs-oranger": "matiere-ete-fleurs-oranger",
    }.items():
        P.append({"key": key, "src": GEN / f"{src}.png", "rel": f"matieres/{key}.webp", "max": 2048, "q": 84, "credit": gen_note})
    studio = {
        "name": "Maison Sillage",
        "source": "Composition de démonstration",
        "note": "flacon et sachet de référence générés (gpt-image-2), étiquette et logo d'origine posés en haute définition ; fonds de studio et papier : "
        + ", ".join(STOCK_META[k]["photographer"] for k in STUDIO)
        + " (Unsplash)",
    }
    for f in sorted(COMPOSED.glob("pack-*.png")):
        P.append({"key": f.stem, "src": f, "rel": f"products/{f.stem[5:]}.webp", "max": 1400, "q": 88, "credit": studio})
    for f in sorted(COMPOSED.glob("gamme-*.png")):
        P.append({"key": f.stem, "src": f, "rel": f"products/{f.stem}.webp", "max": 3200, "q": 86, "credit": studio})
    for f in sorted(COMPOSED.glob("acc-*.png")):
        P.append({"key": f.stem, "src": f, "rel": f"products/{f.stem}.webp", "max": 1600, "q": 86, "credit": credit_of(MOCKUP_BASE[f.stem], "visuel d'intention, logo appliqué")})
    brand = {"name": "Maison Sillage", "source": "Logo d'origine"}
    for n in ["logo-light", "logo-dark", "emblem-light", "emblem-dark"]:
        P.append({"key": f"brand-{n}", "src": ROOT / "public" / "brand" / f"{n}.png", "rel": f"brand/{n}.webp", "max": 1200, "q": 90, "credit": brand, "alpha": True})
    for k in STOCK_META:
        if k.startswith(("fond-", "acc-")) or k in STOCK_SKIP:
            continue
        folder = "recettes" if k.startswith(("boisson-", "dessert-")) else "lifestyle" if k.startswith("barista") else "univers"
        P.append({"key": k, "src": STOCK / f"{k}.jpg", "rel": f"{folder}/{k}.webp", "max": 2400, "q": 84, "credit": credit_of(k)})
    return P


def encode(im: Image.Image, q: int, method: int) -> bytes:
    buf = io.BytesIO()
    im.save(buf, "WEBP", quality=q, method=method, alpha_quality=95)
    return buf.getvalue()


def publish(im: Image.Image, rel: str, q: int) -> tuple[dict, list[Path]]:
    """Écrit l'image en plusieurs largeurs sous un nom à empreinte (hero/ete-coucher.3fa9c1d2.w1920.webp) :
    une photographie modifiée change d'adresse et n'est jamais servie depuis un cache périmé.
    L'adresse de référence (src) est la plus grande largeur, celle de la source."""
    W, H = im.size
    full = encode(im, q, 6)
    stem = f"{rel[: -len('.webp')]}.{hashlib.sha1(full).hexdigest()[:8]}"
    files = []
    for w in [x for x in WIDTHS if x < W] + [W]:
        data = full if w == W else encode(im.resize((w, max(1, round(H * w / W))), Image.LANCZOS), q, 5)
        path = OUT / f"{stem}.w{w}.webp"
        path.parent.mkdir(parents=True, exist_ok=True)
        if not path.exists() or path.read_bytes() != data:
            path.write_bytes(data)
        files.append(path)
    return {"src": f"/images/{stem}.w{W}.webp", "w": W, "h": H, "blur": blur_data(im.convert("RGB"))}, files


def blur_data(im: Image.Image) -> str:
    w, h = im.size
    tiny = im.resize((16, max(1, round(16 * h / w))), Image.BILINEAR).filter(ImageFilter.GaussianBlur(0.6))
    buf = io.BytesIO()
    tiny.save(buf, "WEBP", quality=40)
    return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()


def build_og() -> None:
    """Image de partage 1200 × 630 : le hero d'été au coucher du soleil (voilier et produits) et le logo."""
    src = COMPOSED / "hero-ete-coucher.png"
    if not src.exists():
        return
    g = Image.open(src).convert("RGB")
    w, h = g.size
    crop_h = round(w * 630 / 1200)
    g = g.crop((0, (h - crop_h) // 2, w, (h - crop_h) // 2 + crop_h)).resize((1200, 630), Image.LANCZOS)
    veil = Image.new("L", (1200, 630))
    for x in range(1200):
        veil.paste(int(170 * max(0.0, min(1.0, (430 - x) / 380))), (x, 0, x + 1, 630))
    g = Image.composite(Image.new("RGB", (1200, 630), (18, 10, 5)), g, veil).convert("RGBA")
    logo = Image.open(ROOT / "public" / "brand" / "logo-dark.png").convert("RGBA")
    lw = 250
    logo = logo.resize((lw, round(logo.size[1] * lw / logo.size[0])), Image.LANCZOS)
    g.alpha_composite(logo, (70, (630 - logo.size[1]) // 2))
    out = ROOT / "app" / "opengraph-image.jpg"
    g.convert("RGB").save(out, "JPEG", quality=86, optimize=True, progressive=True)
    print(f"  {out.relative_to(ROOT)}  1200×630  {out.stat().st_size // 1024} Ko")


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    manifest: dict[str, dict] = {}
    missing = []
    published: set[Path] = set()
    for item in plan():
        if not item["src"].exists():
            missing.append(item["key"])
            continue
        im = Image.open(item["src"])
        im = im.convert("RGBA") if item.get("alpha") else im.convert("RGB")
        if item.get("alpha"):
            im = im.crop(im.getbbox())
        if im.size[0] > item["max"]:
            im = im.resize((item["max"], round(im.size[1] * item["max"] / im.size[0])), Image.LANCZOS)
        entry, files = publish(im, item["rel"], item["q"])
        published.update(files)
        entry["credit"] = item["credit"]
        manifest[item["key"]] = entry
        print(f"  {entry['src'][len('/images/'):]:<62} {im.size[0]}×{im.size[1]} · {len(files)} largeurs")
    # nettoyage : tout fichier publié qui n'appartient plus au manifeste est retiré
    for f in OUT.rglob("*.webp"):
        if f not in published:
            f.unlink()
    for d in sorted(OUT.rglob("*"), reverse=True):
        if d.is_dir() and not any(d.iterdir()):
            d.rmdir()
    build_og()
    MANIFEST.write_text(json.dumps(dict(sorted(manifest.items())), ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\n{len(manifest)} images publiées, manifeste : {MANIFEST.relative_to(ROOT)}")
    if missing:
        print(f"⚠ {len(missing)} source(s) absente(s) : {', '.join(missing)}")


if __name__ == "__main__":
    main()
