"""Visuels de L'Atelier : objets photographiés (Unsplash), marqués Maison Sillage.

    python -I scripts/images/mockups.py            # les huit visuels
    python -I scripts/images/mockups.py <slug> ... # quelques-uns

Le logo n'est jamais redessiné : c'est le fichier d'origine (public/brand/logo-light.png)
qui est imprimé sur le mug, sérigraphié en blanc sur le verre, marqué à froid sur le carnet ;
le coffret reçoit l'étiquette haute définition de la gamme (scripts/images/labels.mjs).
Les marques visibles d'autres maisons (cachet de cire, pastille du carnet) sont effacées.
Ces visuels sont des visuels d'intention : les objets eux-mêmes restent à sourcer.
Sortie : assets/composed/acc-<slug>.png, au format 4:5, sans agrandissement.
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from packshots import ROOT, STOCK, LABELS, OUT, bilinear, blur, f32, hex_rgb, lum, smooth, to_img  # noqa: E402

BRAND = ROOT / "public" / "brand"


# ───────────────────────────── outils ─────────────────────────────

def logo(path: str = "logo-light.png") -> np.ndarray:
    """Logo d'origine en RGBA flottant, recadré sur son contenu."""
    im = Image.open(BRAND / path).convert("RGBA")
    im = im.crop(im.getbbox())
    return np.asarray(im, dtype=np.float32) / 255.0


def ink(art: np.ndarray) -> np.ndarray:
    """Couverture d'encre d'un tracé (pour une impression en une couleur) : alpha × densité du trait."""
    L = lum(art[..., :3])
    return art[..., 3] * np.clip((0.92 - L) / 0.55, 0, 1) ** 0.8


def homography(src: np.ndarray, dst: np.ndarray) -> np.ndarray:
    """Matrice 3×3 envoyant les 4 points src sur les 4 points dst."""
    A = []
    for (x, y), (u, v) in zip(src, dst):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y, -u])
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y, -v])
    _, _, vt = np.linalg.svd(np.array(A, dtype=np.float64))
    return (vt[-1] / vt[-1, -1]).reshape(3, 3)


def warp_quad(tex: np.ndarray, quad, shape) -> np.ndarray:
    """Projette tex (h, w, C) dans le quadrilatère quad (haut-gauche, haut-droit, bas-droit, bas-gauche)."""
    th, tw = tex.shape[:2]
    H = homography(np.array(quad, dtype=np.float64), np.array([(0, 0), (tw - 1, 0), (tw - 1, th - 1), (0, th - 1)], dtype=np.float64))
    h, w = shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float64)
    den = H[2, 0] * xx + H[2, 1] * yy + H[2, 2]
    us = (H[0, 0] * xx + H[0, 1] * yy + H[0, 2]) / den
    vs = (H[1, 0] * xx + H[1, 1] * yy + H[1, 2]) / den
    inside = (us >= 0) & (us <= tw - 1) & (vs >= 0) & (vs <= th - 1)
    t = tex if tex.ndim == 3 else tex[..., None]
    out = bilinear(t, us.astype(np.float32), vs.astype(np.float32)) * inside[..., None]
    return out if tex.ndim == 3 else out[..., 0]


def warp_cylinder(tex: np.ndarray, shape, cx: float, R: float, top: float, flat_w: float, tilt: float) -> np.ndarray:
    """Motif enroulé sur un cylindre vu légèrement d'en haut : x = cx + R·sin(s/R),
    et les côtés remontent de tilt·R·(1 − cos θ)."""
    th, tw = tex.shape[:2]
    flat_h = flat_w * th / tw
    h, w = shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    sin_t = np.clip((xx - cx) / R, -0.9999, 0.9999)
    theta = np.arcsin(sin_t)
    u = (theta * R + flat_w / 2) / flat_w
    v = (yy + tilt * R * (1 - np.cos(theta)) - top) / flat_h
    inside = (u >= 0) & (u <= 1) & (v >= 0) & (v <= 1) & (np.abs(xx - cx) < R)
    t = tex if tex.ndim == 3 else tex[..., None]
    out = bilinear(t, u * (tw - 1), v * (th - 1)) * inside[..., None]
    # le motif s'efface en tournant avec la paroi
    out = out * np.clip(np.cos(theta) * 1.6, 0, 1)[..., None]
    return out if tex.ndim == 3 else out[..., 0]


def fit(a: np.ndarray, box, max_w: int = 1600) -> Image.Image:
    """Recadrage 4:5, réduit si besoin (jamais agrandi)."""
    x0, y0, x1, y1 = box
    im = to_img(a[y0:y1, x0:x1])
    if im.size[0] > max_w:
        im = im.resize((max_w, round(im.size[1] * max_w / im.size[0])), Image.LANCZOS)
    return im


def patch(a: np.ndarray, box, dx: int, dy: int, feather: float = 10) -> np.ndarray:
    """Recouvre box par la même surface prise à (dx, dy), raccord fondu."""
    x0, y0, x1, y1 = box
    h, w = a.shape[:2]
    m = np.zeros((h, w), dtype=np.float32)
    m[y0:y1, x0:x1] = 1
    m = blur(m, feather)[..., None]
    shifted = np.roll(np.roll(a, -dy, axis=0), -dx, axis=1)
    return a * (1 - m) + shifted * m


# ───────────────────────────── les objets ─────────────────────────────

def mug() -> Image.Image:
    a = f32(Image.open(STOCK / "acc-mug.jpg"))
    art = logo()
    cov = warp_cylinder(art[..., 3], a.shape[:2], cx=816, R=362, top=1175, flat_w=400, tilt=0.12)
    rgb = warp_cylinder(art[..., :3] * art[..., 3:], a.shape[:2], cx=816, R=362, top=1175, flat_w=400, tilt=0.12)
    rgb = rgb / np.maximum(cov[..., None], 1e-4)
    # impression sous émail : les couleurs du logo se multiplient avec la céramique, les reflets restent
    printed = a * (1 - cov[..., None] + cov[..., None] * np.clip(rgb * 1.04, 0, 1))
    return fit(printed, (0, 125, 1768, 2335))


def verre() -> Image.Image:
    a = f32(Image.open(STOCK / "acc-verre.jpg"))
    cov = warp_cylinder(ink(logo()), a.shape[:2], cx=837, R=276, top=1062, flat_w=290, tilt=0.05)
    cov = blur(cov, 0.6) * 0.88  # sérigraphie blanche, légèrement translucide
    white = np.array([0.97, 0.95, 0.92], dtype=np.float32)
    out = a * (1 - cov[..., None]) + white * cov[..., None]
    return fit(out, (0, 279, 1697, 2400))


def coffret() -> Image.Image:
    a = f32(Image.open(STOCK / "acc-coffret.jpg"))
    h, w = a.shape[:2]
    # cachet de cire : le relief d'une autre marque est lissé, la cire passe au bordeaux de la maison
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    seal = ((xx - 853) / 92) ** 2 + ((yy - 1117) / 88) ** 2 < 1
    red = seal & ((a[..., 0] - a[..., 1]) > 0.22)
    rm = blur(red.astype(np.float32), 1.2)[..., None]
    L = lum(a)
    smoothL = blur(L * red, 7) / np.maximum(blur(red.astype(np.float32), 7), 1e-3)
    inner = blur((((xx - 853) / 62) ** 2 + ((yy - 1117) / 58) ** 2 < 1).astype(np.float32), 4)
    Lw = L * (1 - inner) + smoothL * inner
    wine = hex_rgb("#7a2633")
    wax = wine[None, None, :] * np.clip(Lw / max(float(np.median(L[red])), 1e-3), 0.3, 1.6)[..., None]
    # le navire de la maison marqué dans la cire
    em = logo("emblem-light.png")
    e = ink(em)
    size = 84
    eh = int(size * e.shape[0] / e.shape[1])
    quad = [(853 - size / 2, 1117 - eh / 2), (853 + size / 2, 1117 - eh / 2), (853 + size / 2, 1117 + eh / 2), (853 - size / 2, 1117 + eh / 2)]
    ec = blur(warp_quad(e, quad, (h, w)), 0.8)
    gx = np.gradient(blur(ec, 1.2), axis=1)
    gy = np.gradient(blur(ec, 1.2), axis=0)
    wax = wax * (1 - 0.22 * ec[..., None]) * (1 + 3.0 * (gx + gy)[..., None])
    out = a * (1 - rm) + np.clip(wax, 0, 1) * rm
    # étiquette de la gamme collée sur le couvercle, dans le coin libre sous la ficelle
    face = np.array([(246, 684), (1035, 525), (1404, 1725), (540, 1995)], dtype=np.float64)

    def at(u: float, v: float):
        top = face[0] + (face[1] - face[0]) * u
        bot = face[3] + (face[2] - face[3]) * u
        return tuple(top + (bot - top) * v)

    quad = [at(0.085, 0.585), at(0.375, 0.585), at(0.375, 0.955), at(0.085, 0.955)]
    lab = np.asarray(Image.open(LABELS / "coffret-decouverte.png").convert("RGBA"), dtype=np.float32) / 255.0
    rgba = warp_quad(lab, quad, (h, w))
    alpha = rgba[..., 3:]
    rgb = rgba[..., :3] / np.maximum(alpha, 1e-4)
    # lumière du couvercle reportée sur le papier, ombre fine de l'épaisseur de l'étiquette
    light = blur(L, 40) / max(float(np.median(blur(L, 40)[alpha[..., 0] > 0.5])), 1e-3)
    rgb = rgb * np.clip(light, 0.7, 1.15)[..., None] * 0.97
    shadow = np.roll(np.roll(blur(alpha[..., 0], 3), 4, axis=0), 3, axis=1)[..., None]
    out = out * (1 - 0.25 * shadow * (1 - alpha))
    out = out * (1 - alpha) + rgb * alpha
    return fit(out, (0, 306, 1675, 2400))


def carnet() -> Image.Image:
    a = f32(Image.open(STOCK / "acc-carnet.jpg"))
    h, w = a.shape[:2]
    # pastille d'une autre marque (coin haut droit) : recouverte par le cuir voisin
    a = patch(a, (1085, 335, 1185, 425), dx=-150, dy=40, feather=8)
    cover = np.array([(255, 384), (1245, 204), (1536, 1800), (525, 1965)], dtype=np.float64)

    def at(u: float, v: float):
        top = cover[0] + (cover[1] - cover[0]) * u
        bot = cover[3] + (cover[2] - cover[3]) * u
        return tuple(top + (bot - top) * v)

    art = logo()
    c = ink(art)
    vh = 0.5 * 990 * art.shape[0] / art.shape[1] / 1620  # hauteur relative à la couverture
    quad = [at(0.25, 0.2), at(0.75, 0.2), at(0.75, 0.2 + vh), at(0.25, 0.2 + vh)]
    cov = blur(warp_quad(c, quad, (h, w)), 0.7)
    # marquage à froid : le cuir est foulé (plus sombre), les flancs du creux prennent la lumière de gauche
    g = blur(cov, 1.6)
    gx = np.gradient(g, axis=1)
    gy = np.gradient(g, axis=0)
    relief = 1 - 0.30 * cov + 2.4 * (gx + gy)
    out = a * np.clip(relief, 0.4, 1.4)[..., None]
    return fit(out, (0, 75, 1800, 2325))


def moka() -> Image.Image:
    a = f32(Image.open(STOCK / "acc-moka.jpg"))
    # grain argentique très présent : légèrement atténué, sans lisser les arêtes
    soft = blur(a, 1.1)
    edges = np.clip(np.abs(lum(a) - lum(blur(a, 3))) * 8, 0, 1)[..., None]
    out = soft * (1 - edges) + a * edges
    return fit(out, (0, 0, 1920, 2400))


def simple(name: str, box) -> callable:
    return lambda: fit(f32(Image.open(STOCK / f"{name}.jpg")), box)


MOCKUPS = {
    "mug-ceramique": mug,
    "tasse-espresso-gres": simple("acc-espresso", (0, 0, 1920, 2400)),
    "verre-latte-glace": verre,
    "cafetiere-italienne": moka,
    "cuillere-doseuse": simple("acc-cuillere", (0, 200, 1600, 2200)),
    "carafe-sirop": simple("acc-carafe-2", (56, 0, 1976, 2400)),
    "coffret-decouverte": coffret,
    "carnet-recettes": carnet,
}


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    wanted = sys.argv[1:] or list(MOCKUPS)
    OUT.mkdir(parents=True, exist_ok=True)
    for slug in wanted:
        im = MOCKUPS[slug]()
        im.save(OUT / f"acc-{slug}.png")
        print(f"  ✓ acc-{slug} {im.size[0]}×{im.size[1]}")


if __name__ == "__main__":
    main()
