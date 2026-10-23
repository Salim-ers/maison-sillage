"""Ré-étiquetage des photographies d'ambiance : l'étiquette d'origine de chaque contenant visible
est remplacée par l'étiquette haute définition de la gamme (scripts/images/labels.mjs).

    python -I scripts/images/relabel.py            # toutes les scènes
    python -I scripts/images/relabel.py <scène> ... # quelques-unes (ex. hero-ete-coucher)

Les scènes du hero ont été générées avec des étiquettes approximatives (texte et logo inventés) :
seule la scène est conservée, l'emballage reçoit la vraie étiquette, toujours la même maquette.
Pour chaque contenant :
  1. l'étiquette d'origine est détectée dans une zone approximative (papier clair sur contenant sombre) ;
  2. l'étiquette HD est posée dessus, un peu plus grande pour ne laisser aucun reste, enroulée sur
     le cylindre pour un flacon, à plat pour un sachet ;
  3. la lumière de la scène (couleur et dégradé du papier d'origine) est reportée sur la nouvelle étiquette ;
  4. les objets placés devant l'étiquette (fruit, fleur) sont restitués par un masque.
Sortie : assets/composed/<scène>.png, même définition que la source.
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from packshots import LABELS, OUT, ROOT, bilinear, blur, f32, lum, smooth, to_img  # noqa: E402

GEN = ROOT / "assets" / "generated"

# zone approximative de chaque étiquette d'origine (x0, y0, x1, y1) et produit qui la remplace
FRONT_SIROP = "peche-blanche-fleur-oranger"
FRONT_POUDRE = "poudre-peche-blanche-fleur-oranger"
# lanterne posée devant les flacons de la scène de nuit
LANTERN = [("disk", 3585, 1234, 27), ("rect", 3535, 1252, 3643, 1330), ("rect", 3605, 1236, 3652, 1300), ("rect", 3480, 1320, 3690, 1380), ("rect", 3390, 1375, 3780, 2160)]
SCENES: dict[str, list[dict]] = {
    "hero-ete-coucher": [
        {"kind": "bottle", "slug": FRONT_SIROP, "box": (1950, 960, 2320, 1790)},
        {"kind": "flat", "slug": FRONT_POUDRE, "box": (2440, 850, 2930, 1710)},
        {"kind": "bottle", "slug": "vanille-torrefiee-praline-blanc", "bb": (3355, 950, 3535, 1390), "cx": 3447, "R": 93, "fit": "height", "soft": 2.6, "clip_x1": 3536, "keep": [("disk", 3360, 1150, 118), ("rect", 3000, 1100, 3390, 2000)]},
        {"kind": "bottle", "slug": "caramel-blond-abricot-confit", "bb": (3535, 950, 3740, 1400), "cx": 3637, "R": 103, "fit": "height", "soft": 2.6},
    ],
    "hero-ete-jour": [
        {"kind": "bottle", "slug": FRONT_SIROP, "box": (1910, 980, 2270, 1770)},
        {"kind": "flat", "slug": FRONT_POUDRE, "box": (2420, 870, 2890, 1660)},
        {"kind": "bottle", "slug": "vanille-torrefiee-praline-blanc", "bb": (3328, 950, 3515, 1395), "cx": 3421, "R": 93, "fit": "height", "soft": 2.2, "clip_x1": 3510, "keep": [("disk", 3340, 1140, 112), ("rect", 3000, 1110, 3365, 2000)]},
        {"kind": "bottle", "slug": "caramel-blond-abricot-confit", "bb": (3507, 955, 3720, 1410), "cx": 3613, "R": 106, "fit": "height", "soft": 2.2},
    ],
    "hero-ete-nuit": [
        {"kind": "bottle", "slug": FRONT_SIROP, "box": (1940, 1060, 2300, 1770)},
        {"kind": "flat", "slug": FRONT_POUDRE, "box": (2440, 860, 2890, 1680)},
        {"kind": "bottle", "slug": "vanille-torrefiee-praline-blanc", "bb": (3358, 945, 3545, 1390), "cx": 3451, "R": 93, "fit": "height", "soft": 2.2, "clip_x1": 3540, "keep": [("disk", 3375, 1125, 105), ("rect", 3000, 1100, 3390, 2000), *LANTERN]},
        {"kind": "bottle", "slug": "caramel-blond-abricot-confit", "bb": (3533, 950, 3745, 1400), "cx": 3639, "R": 106, "fit": "height", "soft": 2.2, "keep": LANTERN},
    ],
    "hero-mobile-ete-coucher": [
        {"kind": "bottle", "slug": FRONT_SIROP, "box": (315, 780, 590, 1630)},
        {"kind": "flat", "slug": FRONT_POUDRE, "box": (730, 800, 1120, 1520)},
    ],
    "hero-mobile-ete-jour": [
        {"kind": "bottle", "slug": FRONT_SIROP, "box": (315, 870, 595, 1630)},
        {"kind": "flat", "slug": FRONT_POUDRE, "box": (735, 800, 1110, 1520)},
    ],
    "hero-mobile-ete-nuit": [
        {"kind": "bottle", "slug": FRONT_SIROP, "box": (305, 870, 585, 1630)},
        {"kind": "flat", "slug": FRONT_POUDRE, "box": (730, 780, 1115, 1520)},
    ],
}

LABEL_RATIO = 360 / 750  # largeur / hauteur de la maquette d'étiquette
OVER = 1.12  # la nouvelle étiquette déborde de l'ancienne : épaules et arcs ne laissent rien paraître


def otsu(v: np.ndarray) -> float:
    hist, edges = np.histogram(v, bins=128, range=(0, 1))
    p = hist / max(hist.sum(), 1)
    w = np.cumsum(p)
    mu = np.cumsum(p * (edges[:-1] + edges[1:]) / 2)
    between = (mu[-1] * w - mu) ** 2 / np.maximum(w * (1 - w), 1e-9)
    return float(edges[np.argmax(between)])


def longest_run(idx: np.ndarray, gap: int) -> tuple[int, int]:
    """plus longue suite d'indices, trous de moins de gap tolérés (encre du logo, reflets)"""
    best, cur = (int(idx[0]), int(idx[0])), [int(idx[0]), int(idx[0])]
    for i in idx[1:]:
        cur = [cur[0], int(i)] if i <= cur[1] + gap else [int(i), int(i)]
        if cur[1] - cur[0] > best[1] - best[0]:
            best = (cur[0], cur[1])
    return best


def detect(a: np.ndarray, box) -> tuple[int, int, int, int]:
    """Étiquette d'origine : la plus grande plage claire de la zone (papier clair sur contenant plus sombre)."""
    x0, y0, x1, y1 = box
    L = lum(a[y0:y1, x0:x1])
    m = L > otsu(L)
    c0, c1 = longest_run(np.where(m.mean(0) > 0.3)[0], 6)
    r0, r1 = longest_run(np.where(m[:, c0:c1].mean(1) > 0.3)[0], 70)
    return x0 + c0, y0 + r0, x0 + c1, y0 + r1


def paper_light(a: np.ndarray, bb, keep=None) -> tuple:
    """Couleur et lumière du papier d'origine : couleur des pixels les plus clairs du papier,
    profils séparables (85e centile par colonne et par ligne). Les objets placés devant sont exclus."""
    x0, y0, x1, y1 = bb
    mx, my = int((x1 - x0) * 0.08), int((y1 - y0) * 0.06)
    box = (slice(y0 + my, y1 - my), slice(x0 + mx, x1 - mx))
    sub = a[box]
    L = lum(sub)
    valid = np.ones(L.shape, dtype=bool) if not keep else keep_mask(box, keep) < 0.05
    bright = valid & (L >= np.percentile(L[valid], 80))
    ref = np.median(sub[bright], axis=0)
    Ln = np.where(valid, L, np.nan)
    col = np.nan_to_num(np.nanpercentile(Ln, 85, axis=0), nan=float(np.nanmean(Ln)))
    row = np.nan_to_num(np.nanpercentile(Ln, 85, axis=1), nan=float(np.nanmean(Ln)))
    col = blur(col[None, :] / max(col.mean(), 1e-3), 4)[0]
    row = blur(row[:, None] / max(row.mean(), 1e-3), 8)[:, 0]
    return ref, (x0 + mx, y0 + my, col, row)


def light_field(shape, light) -> np.ndarray:
    ref, (lx, ly, col, row) = light
    h, w = shape
    c = np.interp(np.arange(w), lx + np.arange(len(col)), col)
    r = np.interp(np.arange(h), ly + np.arange(len(row)), row)
    return ref[None, None, :] * (r[:, None] * c[None, :])[..., None]


def place(a: np.ndarray, spec: dict, label: np.ndarray, paper: np.ndarray) -> np.ndarray:
    h, w = a.shape[:2]
    bb = spec.get("bb") or detect(a, spec["box"])
    x0, y0, x1, y1 = bb
    old_w, old_h = x1 - x0, y1 - y0
    new_h = old_h * OVER
    cy = (y0 + y1) / 2
    top = cy - new_h / 2
    lh, lw = label.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    cx = spec.get("cx", (x0 + x1) / 2)
    if spec["kind"] == "bottle":
        # le papier d'origine couvre environ ±63° du cylindre (flacon au premier plan) ;
        # au second plan, le rayon du flacon est donné et l'étiquette suit la hauteur de l'ancienne
        R = spec.get("R", (old_w / 2) / 0.89)
        if spec.get("fit") == "height":
            new_h = old_h * 1.04
            flat_w = new_h * LABEL_RATIO
        else:
            flat_w = max(new_h * LABEL_RATIO, 2 * np.arcsin(0.89) * R * 1.04)
            new_h = flat_w / LABEL_RATIO
        top = cy - new_h / 2
        theta = np.arcsin(np.clip((xx - cx) / R, -0.9999, 0.9999))
        u = (theta * R + flat_w / 2) / flat_w
        inside = np.abs(xx - cx) < R
        cyl = (0.86 + 0.18 * np.cos(theta + 0.2))[..., None]
    else:
        flat_w = max(new_h * LABEL_RATIO, old_w * 1.05)
        new_h = flat_w / LABEL_RATIO
        top = cy - new_h / 2
        u = (xx - (cx - flat_w / 2)) / flat_w
        inside = np.ones_like(xx, dtype=bool)
        cyl = 1.0
    v = (yy - top) / new_h
    inside &= (u >= 0) & (u <= 1) & (v >= 0) & (v <= 1)
    if "clip_x1" in spec:  # flacon voisin placé devant
        inside &= xx < spec["clip_x1"]
    # on ne travaille que dans la boîte englobante, pour aller vite sur une image 4K
    ys, xs = np.where(inside)
    by0, by1, bx0, bx1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    sl = (slice(by0, by1), slice(bx0, bx1))
    samp = bilinear(label, u[sl] * (lw - 1), v[sl] * (lh - 1))
    alpha = samp[..., 3:] * inside[sl][..., None]
    rgb = samp[..., :3] / np.maximum(samp[..., 3:], 1e-4)
    light = light_field((h, w), paper_light(a, bb, spec.get("keep")))[sl]
    rgb = rgb * light / paper[None, None, :]
    if spec["kind"] == "bottle":
        rgb = rgb * (cyl[sl] / 1.0)
    soft = spec.get("soft", 0.5)  # même netteté que la photographie (flou de profondeur au second plan)
    rgb = blur(rgb, soft)
    alpha = blur(alpha[..., 0], soft)[..., None]
    if spec.get("keep"):
        alpha = alpha * (1 - keep_mask(sl, spec["keep"]))[..., None]
    out = a.copy()
    out[sl] = a[sl] * (1 - alpha) + np.clip(rgb, 0, 1) * alpha
    print(f"    {spec['slug']:<40} ancienne {old_w}×{old_h} à ({x0},{y0}) → nouvelle {flat_w:.0f}×{new_h:.0f}")
    return out


def keep_mask(sl, shapes: list) -> np.ndarray:
    """Objets placés devant une étiquette (tranche de pêche, bord du verre), relevés sur la photographie :
    disques (cx, cy, r) et rectangles (x0, y0, x1, y1), bords fondus."""
    ys = np.arange(sl[0].start, sl[0].stop, dtype=np.float32)[:, None]
    xs = np.arange(sl[1].start, sl[1].stop, dtype=np.float32)[None, :]
    m = np.zeros((len(ys), xs.shape[1]), dtype=np.float32)
    for kind, *v in shapes:
        if kind == "disk":
            cx, cy, r = v
            m = np.maximum(m, (((xs - cx) ** 2 + (ys - cy) ** 2) < r * r).astype(np.float32))
        else:
            x0, y0, x1, y1 = v
            m = np.maximum(m, ((xs >= x0) & (xs < x1) & (ys >= y0) & (ys < y1)).astype(np.float32))
    return blur(m, 1.5)


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    wanted = sys.argv[1:] or list(SCENES)
    cache: dict[str, np.ndarray] = {}
    for name in wanted:
        a = f32(Image.open(GEN / f"{name}.png"))
        print(f"  {name}")
        for spec in SCENES[name]:
            if spec["slug"] not in cache:
                cache[spec["slug"]] = np.asarray(Image.open(LABELS / f"{spec['slug']}.png").convert("RGBA"), dtype=np.float32) / 255.0
            label = cache[spec["slug"]]
            opaque = label[..., 3] > 0.98
            paper = np.percentile(label[..., :3][opaque], 85, axis=0)
            a = place(a, spec, label, paper)
        to_img(a).save(OUT / f"{name}.png")
        print(f"  ✓ {name}")


if __name__ == "__main__":
    main()
