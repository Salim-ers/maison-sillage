"""Chaîne de production des images Maison Sillage.

    python -I scripts/images/build.py      # ou : npm run images

Lit les photographies haute définition de `assets/generated/` (produites par
`scripts/images/generate.py`, voir `scripts/images/shots.py`) et écrit dans
`public/images/` des masters WebP prêts pour `next/image`, qui en dérive les
tailles AVIF/WebP responsives. Produit aussi `data/images.generated.json`
(dimensions + mini-aperçu flou de chaque image) et l'image de partage.

Aucune image n'est agrandie : chaque master garde au plus la définition de sa source.
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
OUT = ROOT / "public" / "images"
MANIFEST = ROOT / "data" / "images.generated.json"

SEASONS = ["printemps", "ete", "automne", "hiver"]
LIGHTS = ["jour", "coucher", "nuit"]
FLAVORS = ["fraise", "peche", "poire", "datte"]

# source (assets/generated/<nom>.png) → (chemin publié, largeur max, qualité)
PLAN: list[tuple[str, str, int, int]] = []
for s in SEASONS:
    for l in LIGHTS:
        PLAN.append((f"hero-{s}-{l}", f"hero/{s}-{l}.webp", 3840, 84))
        PLAN.append((f"hero-mobile-{s}-{l}", f"hero/mobile-{s}-{l}.webp", 1536, 84))
        PLAN.append((f"story-{s}-{l}", f"story/{s}-{l}.webp", 2560, 84))
    PLAN.append((f"detail-{s}", f"story/detail-{s}.webp", 1024, 86))
    PLAN.append((f"scene-{s}", f"seasons/scene-{s}.webp", 3072, 84))
    PLAN.append((f"paysage-{s}", f"seasons/paysage-{s}.webp", 3072, 84))
for f in FLAVORS:
    PLAN.append((f"packshot-sirop-{f}", f"products/sirop-{f}.webp", 1024, 88))
    PLAN.append((f"packshot-poudre-{f}", f"products/poudre-{f}.webp", 1024, 88))
    PLAN.append((f"duo-{f}", f"products/duo-{f}.webp", 1536, 86))
for name in ["gamme-sirops", "gamme-poudres", "coffret-decouverte"]:
    PLAN.append((name, f"products/{name}.webp", 3072, 86))
for name in ["printemps-fraises", "printemps-fleurs", "ete-peches", "ete-fleurs-oranger", "automne-poires", "automne-epices", "hiver-dattes", "hiver-chocolat", "poudre"]:
    PLAN.append((f"matiere-{name}", f"seasons/matiere-{name}.webp", 2048, 84))
for name in ["latte-datte", "iced-latte-poire", "mocktail-peche", "milkshake-fraise", "chocolat-chaud", "creme-brulee", "cafe-terrasse", "latte-poire"]:
    PLAN.append((f"boisson-{name}", f"recipes/{name}.webp", 1024, 88))
PLAN.append(("comptoir-professionnel", "lifestyle/comptoir-professionnel.webp", 3072, 86))


def publish(im: Image.Image, rel: str, q: int) -> dict:
    """Écrit le master WebP sous un nom à empreinte (hero/ete-coucher.3fa9c1d2.webp) :
    une photographie modifiée change d'adresse et n'est jamais servie depuis un cache périmé."""
    buf = io.BytesIO()
    im.save(buf, "WEBP", quality=q, method=6)
    data = buf.getvalue()
    stem = rel[: -len(".webp")]
    hashed = f"{stem}.{hashlib.sha1(data).hexdigest()[:8]}.webp"
    path = OUT / hashed
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    return {"src": "/images/" + hashed, "w": im.size[0], "h": im.size[1], "blur": blur_data(im)}


def blur_data(im: Image.Image) -> str:
    w, h = im.size
    tiny = im.resize((16, max(1, round(16 * h / w))), Image.BILINEAR).filter(ImageFilter.GaussianBlur(0.6))
    buf = io.BytesIO()
    tiny.save(buf, "WEBP", quality=40)
    return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()


def build_og() -> None:
    """Image de partage 1200 × 630 : le hero d'été au coucher du soleil (voilier et produits) et le logo."""
    src = GEN / "hero-ete-coucher.png"
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


# anciennes images publiées, conservées tant que leur nouvelle prise de vue n'existe pas
LEGACY = {"recipes/creme-brulee.webp": "recipes/creme-brulee-datte.webp"}


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    previous = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {}
    manifest: dict[str, dict] = {}
    missing, kept = [], []
    for src_name, rel, max_w, q in PLAN:
        src = GEN / f"{src_name}.png"
        key = "/images/" + rel
        if not src.exists() and rel.startswith(("hero/", "story/")):
            missing.append(src_name)  # data/images.ts retombe sur une autre lumière ou une autre scène
            continue
        if not src.exists():
            # repli : l'image publiée précédemment reste en place jusqu'à la nouvelle prise de vue
            prev = previous.get(key) or {}
            candidates = [prev["src"][len("/images/"):]] if "src" in prev else []
            candidates += [rel, LEGACY.get(rel, rel)]
            old = next((OUT / c for c in candidates if (OUT / c).exists()), None)
            if old:
                manifest[key] = publish(Image.open(old).convert("RGB"), rel, q)
                kept.append(rel)
            else:
                missing.append(src_name)
            continue
        im = Image.open(src).convert("RGB")
        if im.size[0] > max_w:
            im = im.resize((max_w, round(im.size[1] * max_w / im.size[0])), Image.LANCZOS)
        manifest[key] = publish(im, rel, q)
        print(f"  {manifest[key]['src'][len('/images/'):]:<52} {im.size[0]}×{im.size[1]}")
    # nettoyage : tout fichier publié qui n'appartient plus au manifeste est retiré
    published = {OUT / m["src"][len("/images/"):] for m in manifest.values()}
    for f in OUT.rglob("*.webp"):
        if f not in published:
            f.unlink()
    for d in sorted(OUT.rglob("*"), reverse=True):
        if d.is_dir() and not any(d.iterdir()):
            d.rmdir()
    build_og()
    MANIFEST.write_text(json.dumps(dict(sorted(manifest.items())), ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\n{len(manifest)} images publiées, manifeste : {MANIFEST.relative_to(ROOT)}")
    if kept:
        print(f"↺ {len(kept)} ancienne(s) image(s) conservée(s) en attendant leur prise de vue : {', '.join(kept)}")
    if missing:
        print(f"⚠ {len(missing)} prise(s) de vue absente(s), remplacée(s) sur le site par une autre lumière ou la scène d'été : {', '.join(missing)}")


if __name__ == "__main__":
    main()
