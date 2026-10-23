"""Packshots Maison Sillage : un flacon et un sachet, une étiquette, une lumière.

    python -I scripts/images/packshots.py              # tous les packshots et les gammes
    python -I scripts/images/packshots.py <slug> ...   # quelques produits

Principe
--------
Deux photographies de studio servent de base (assets/bases) : un flacon et un sachet.
Pour chaque produit :
  1. le contenant est détouré ; pour le verre, on calcule sa « transmission »
     (image / fond estimé derrière lui), ce qui permet de le poser sur un autre fond
     en conservant reflets, épaisseur du verre et réfraction ;
  2. la couleur du sirop est réglée par densité optique (le sirop chocolat est plus dense
     que le sirop vanille, les bords du flacon restent plus clairs que le centre) ;
  3. l'étiquette haute définition (scripts/images/labels.mjs) est enroulée sur le cylindre
     ou posée sur le sachet, puis éclairée avec la lumière de la photographie d'origine ;
  4. le tout est posé sur un fond de studio réel (mur de plâtre et pierre calcaire,
     photographies Unsplash), avec ombre de contact et ombre portée.
Les Essentiels reçoivent un sachet kraft, les poudres signatures le sachet espresso.
Les pixels du contenant ne sont jamais agrandis : le cadre est construit autour.
Sortie : assets/composed/pack-<slug>.png et assets/composed/gamme-*.png
"""

from __future__ import annotations

import json
import math
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
BASES = ROOT / "assets" / "bases"
STOCK = ROOT / "assets" / "stock"
LABELS = ROOT / "assets" / "composed" / "labels"
OUT = ROOT / "assets" / "composed"

FW, FH = 1400, 1750  # cadre 4:5
BASELINE = 0.875  # position du pied des produits (fraction de la hauteur)
HORIZON = 0.80


# ───────────────────────────── utilitaires ─────────────────────────────

def f32(im: Image.Image) -> np.ndarray:
    return np.asarray(im.convert("RGB"), dtype=np.float32) / 255.0


def to_img(a: np.ndarray) -> Image.Image:
    return Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8))


def _box(a: np.ndarray, k: int, axis: int) -> np.ndarray:
    """moyenne glissante de largeur 2k+1 le long d'un axe, bords répliqués"""
    if k <= 0:
        return a
    pad = [(0, 0)] * a.ndim
    pad[axis] = (k + 1, k)
    c = np.cumsum(np.pad(a, pad, mode="edge"), axis=axis, dtype=np.float64)
    n = a.shape[axis]
    hi = np.take(c, np.arange(2 * k + 1, 2 * k + 1 + n), axis=axis)
    lo = np.take(c, np.arange(0, n), axis=axis)
    return ((hi - lo) / (2 * k + 1)).astype(np.float32)


def blur(a: np.ndarray, r: float) -> np.ndarray:
    """flou gaussien approché par trois flous en boîte (rayon r ≈ écart type)"""
    if r <= 0:
        return a.astype(np.float32)
    # largeurs de boîtes pour approcher un écart type r en trois passes
    w = math.sqrt(12 * r * r / 3 + 1)
    k = max(0, int(round((w - 1) / 2)))
    out = a.astype(np.float32)
    for _ in range(3):
        out = _box(out, k, 0)
        out = _box(out, k, 1)
    return out


def lum(a: np.ndarray) -> np.ndarray:
    return a[..., 0] * 0.2126 + a[..., 1] * 0.7152 + a[..., 2] * 0.0722


def hex_rgb(h: str) -> np.ndarray:
    h = h.lstrip("#")
    return np.array([int(h[i : i + 2], 16) for i in (0, 2, 4)], dtype=np.float32) / 255.0


def smooth(x: np.ndarray, e0: float, e1: float) -> np.ndarray:
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def bilinear(src: np.ndarray, xs: np.ndarray, ys: np.ndarray) -> np.ndarray:
    """échantillonnage bilinéaire de src (H,W,C) aux coordonnées flottantes xs, ys"""
    h, w = src.shape[:2]
    x0 = np.clip(np.floor(xs).astype(int), 0, w - 2)
    y0 = np.clip(np.floor(ys).astype(int), 0, h - 2)
    fx = np.clip(xs - x0, 0, 1)[..., None]
    fy = np.clip(ys - y0, 0, 1)[..., None]
    a = src[y0, x0] * (1 - fx) + src[y0, x0 + 1] * fx
    b = src[y0 + 1, x0] * (1 - fx) + src[y0 + 1, x0 + 1] * fx
    return a * (1 - fy) + b * fy


def load_labels(slugs: list[str]) -> dict[str, np.ndarray]:
    return {s: np.asarray(Image.open(LABELS / f"{s}.png").convert("RGBA"), dtype=np.float32) / 255.0 for s in slugs}


# ───────────────────────────── fond de studio ─────────────────────────────

def toned(base: np.ndarray, accent: str | None, amount: float) -> np.ndarray:
    """Teinte de base légèrement colorée par l'accent de la saveur, à luminosité égale."""
    if not accent:
        return base
    mix = base * (1 - amount) + np.array(hex_rgb(accent), dtype=np.float32) * amount
    return (mix * float(lum(base[None, None])[0, 0]) / float(lum(mix[None, None])[0, 0])).astype(np.float32)


def backdrop(w: int = FW, h: int = FH, horizon: float = HORIZON, accent: str | None = None) -> np.ndarray:
    """Mur de plâtre beige (lumière de fenêtre filtrée) et plateau de pierre calcaire, éclairés depuis la gauche.
    Le mur prend une nuance discrète de la saveur : la gamme reste une famille, chaque visuel garde son identité."""
    wall = Image.open(STOCK / "fond-mur.jpg").convert("RGB")
    ww, wh = wall.size
    s = max(w / ww, h / wh) * 1.05
    wall = wall.resize((int(ww * s), int(wh * s)), Image.LANCZOS)
    wall = wall.crop(((wall.size[0] - w) // 2, 0, (wall.size[0] - w) // 2 + w, h))
    wall = f32(wall.filter(ImageFilter.GaussianBlur(1.6)))  # le mur est hors de la zone de netteté
    # on ne garde que le grain du plâtre : les taches de soleil de la photographie seraient trop dures
    L = lum(wall)
    grain_wall = (L - blur(L, 10)) / max(float(L.mean()), 1e-3)
    soft = blur(L, 90) / max(float(L.mean()), 1e-3)
    target = toned(np.array([0.925, 0.855, 0.765], dtype=np.float32), accent, 0.16)
    wall = target[None, None, :] * (1 + 0.55 * grain_wall[..., None]) * (0.94 + 0.06 * soft[..., None])
    hy = int(h * horizon)
    stone = Image.open(STOCK / "fond-pierre-2.jpg").convert("RGB")
    sw, sh = stone.size
    depth = h - hy
    # plateau vu en perspective : la texture est tassée verticalement, plus floue au loin
    st = stone.resize((w, int(sw and w * sh / sw)), Image.LANCZOS)
    st = st.resize((w, int(depth * 1.0)), Image.LANCZOS)
    st = f32(st)
    far = blur(st, 2.5)
    yy = np.linspace(0, 1, depth)[:, None, None]
    st = far * (1 - yy) + st * yy
    st = st / st.reshape(-1, 3).mean(0) * toned(np.array([0.90, 0.83, 0.73], dtype=np.float32), accent, 0.06)
    out = wall.copy()
    out[hy:] = st
    # arête du plateau : un liseré clair, à peine marqué
    edge = np.exp(-((np.arange(h) - hy) / 2.2) ** 2)[:, None, None]
    out = out * (1 + 0.06 * edge)
    # lumière : plus claire en haut à gauche, retombée vers la droite et le premier plan
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    light = 1.06 - 0.16 * (xx / w) - 0.05 * (yy / h) + 0.05 * np.exp(-(((xx / w - 0.2) / 0.45) ** 2 + ((yy / h - 0.3) / 0.5) ** 2))
    out = out * light[..., None]
    # ombre du mur au pied (le plateau assombrit la base du mur)
    occl = smooth(yy, hy - 160, hy) * (yy < hy) * 0.06
    out = out * (1 - occl[..., None])
    return np.clip(out, 0, 1)


def add_shadow(bg: np.ndarray, cx: float, base_y: float, half_w: float, height: float, tint: np.ndarray | None = None) -> np.ndarray:
    """Ombre de contact sous le pied + ombre portée vers la droite (lumière venant de la gauche)."""
    h, w = bg.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    contact = np.exp(-(((xx - cx) / (half_w * 1.02)) ** 8) - ((yy - base_y) / 7.0) ** 2)
    contact = blur(contact, 3)
    # ombre portée : ellipse étirée vers la droite et légèrement vers le fond, très douce
    dx = (xx - (cx + half_w * 0.9)) / (half_w * 2.6)
    dy = (yy - (base_y - 6)) / (height * 0.045)
    cast = np.exp(-(dx ** 2) - dy ** 2) * (yy < base_y + 10)
    cast = blur(cast, 18)
    wallsh = np.exp(-(((xx - (cx + half_w * 0.55)) / (half_w * 1.4)) ** 2)) * smooth(yy, base_y - height * 0.95, base_y - height * 0.2) * (yy < base_y)
    wallsh = blur(wallsh, 40)
    shade = 1 - (0.55 * contact + 0.22 * cast + 0.05 * wallsh)
    out = bg * shade[..., None]
    if tint is not None:
        # lumière colorée traversant le sirop, posée dans l'ombre portée
        glow = blur(np.exp(-(((xx - (cx + half_w * 1.1)) / (half_w * 1.1)) ** 2) - ((yy - (base_y - 4)) / 10) ** 2), 10)
        out = out + glow[..., None] * 0.10 * (tint - 0.5)
    return np.clip(out, 0, 1)


# ───────────────────────────── flacon ─────────────────────────────

BOTTLE = {
    "src": "flacon.png",  # copie de assets/generated/packshot-sirop-fraise.png
    "cx": 517.5,
    # demi-largeur du flacon (px) : bouchon, col, épaule, corps, pied
    "profile": [
        (179, 0), (181, 50), (184, 66), (188, 70), (298, 70.5), (302, 66), (306, 62), (330, 63), (400, 68.5), (440, 71.5),
        (480, 75), (495, 79), (505, 92), (515, 112), (525, 132), (535, 146), (545, 154), (555, 159.5), (565, 163), (580, 166),
        (600, 168), (1390, 168), (1404, 166), (1414, 161), (1421, 152), (1427, 132), (1431, 100), (1433, 40), (1434, 0),
    ],
    "cap": (176, 303),  # bouchon opaque
    "meniscus": 437,
    "table": 1288,  # arête du plateau derrière le flacon, dans la photographie d'origine
    # étiquette d'origine : x 371–664 (projetée), y 634–1338
    "label": {"top": 624, "bottom": 1374, "flat_w": 362},
    # zone gauche masquée par les fraises et les feuilles : reconstruite par symétrie
    "mirror": {"y0": 1150, "y1": 1440, "x1": 392},
    "base": 1426,
}


def bottle_assets():
    """Masque, transmission (verre et sirop) et calques opaques du flacon, une fois pour toutes."""
    src = f32(Image.open(BASES / BOTTLE["src"]))
    H, W, _ = src.shape
    cx = BOTTLE["cx"]
    ys = np.arange(H, dtype=np.float32)
    py, ph = zip(*BOTTLE["profile"])
    half = np.interp(ys, py, ph, left=0, right=0)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    dist = half[:, None] - np.abs(xx - cx)  # > 0 à l'intérieur
    mask = np.clip(dist / 1.6 + 0.5, 0, 1)
    # 1. reconstruction de la zone masquée par les ingrédients : symétrie gauche ← droite
    m = BOTTLE["mirror"]
    zone = (yy >= m["y0"]) & (yy < m["y1"]) & (xx < m["x1"]) & (dist > -3)
    mx = np.clip((2 * cx - xx).astype(int), 0, W - 1)
    mirrored = src[yy.astype(int), mx]
    # la droite est le côté ombré : on retrouve la luminosité de la gauche mesurée juste au-dessus
    ref_y = m["y0"] - 12
    cols = np.arange(W)
    lratio = (blur(src, 3)[ref_y, cols] + 1e-3) / (blur(src, 3)[ref_y, np.clip((2 * cx - cols).astype(int), 0, W - 1)] + 1e-3)
    lratio = np.clip(lratio, 0.6, 1.8)
    fixed = mirrored * lratio[None, :, :]
    feather = smooth(m["x1"] - xx, 0, 18) * smooth(yy - m["y0"], 0, 30)
    src = np.where(zone[..., None], src * (1 - feather[..., None]) + fixed * feather[..., None], src)
    # 2. fond d'origine estimé derrière le verre : interpolation horizontale entre les deux bords, lissée
    pad = 10
    left_x = np.clip((cx - half - pad).astype(int), 0, W - 1)
    right_x = np.clip((cx + half + pad).astype(int), 0, W - 1)
    sb = blur(src, 4)
    Lc = sb[np.arange(H), left_x]
    Rc = sb[np.arange(H), right_x]
    # sous l'ombre des ingrédients, le bord gauche n'est pas fiable : on reprend le droit éclairci
    bad = (np.arange(H) >= m["y0"] - 20)
    Lc[bad] = Rc[bad] * np.array([1.05, 1.05, 1.05])
    Lc = blur(Lc[:, None, :], 6)[:, 0]
    Rc = blur(Rc[:, None, :], 6)[:, 0]
    t = np.clip((xx - (cx - half[:, None] - pad)) / (2 * half[:, None] + 2 * pad + 1e-3), 0, 1)[..., None]
    bg_est = Lc[:, None, :] * (1 - t) + Rc[:, None, :] * t
    stone = np.median(src[1445:1500, 420:620].reshape(-1, 3), axis=0)
    tb = smooth(yy, BOTTLE["table"] - 10, BOTTLE["table"] + 10)[..., None]
    bg_est = bg_est * (1 - tb) + stone[None, None, :] * tb
    trans = np.clip(src / np.maximum(bg_est, 0.05), 0, 1.6)
    # 3. calques opaques : le bouchon
    c0, c1 = BOTTLE["cap"]
    opaque = ((yy >= c0) & (yy < c1)).astype(np.float32) * np.clip((dist - 1.5) / 1.5, 0, 1)
    opaque = blur(opaque, 0.8)
    # 4. sirop : sous le ménisque, à l'intérieur du flacon, hors reflets
    syrup = (yy > BOTTLE["meniscus"]) * smooth(dist, 4, 14)
    return {"src": src, "mask": mask, "trans": trans, "opaque": opaque, "syrup": syrup, "half": half, "H": H, "W": W, "label_shade": label_shading(src, BOTTLE)}


def label_shading(src: np.ndarray, spec: dict) -> np.ndarray:
    """Éclairage de l'étiquette d'origine : profil horizontal × profil vertical du papier (le 85e centile
    de chaque colonne et de chaque ligne), ce qui ignore textes et illustrations imprimés."""
    L = lum(src)
    lab = spec["label"]
    t, b = int(lab["top"]) + 30, int(lab["bottom"]) - 40
    if "left" in lab:
        l, r = int(lab["left"]) + 20, int(lab["right"]) - 20
    else:
        l, r = int(spec["cx"] - 140), int(spec["cx"] + 140)
    box = L[t:b, l:r]
    colp = np.percentile(box, 85, axis=0)
    rowp = np.percentile(box, 85, axis=1)
    colp = blur(colp[None, :], 6)[0]
    rowp = blur(rowp[:, None], 20)[:, 0]
    ref = float(np.percentile(box, 85))
    H, W = L.shape
    col = np.interp(np.arange(W), np.arange(l, r), colp)
    row = np.interp(np.arange(H), np.arange(t, b), rowp)
    shade = (row[:, None] / ref) * (col[None, :] / ref)
    return shade.astype(np.float32)


def tint_syrup(trans: np.ndarray, syrup: np.ndarray, liquid: str) -> np.ndarray:
    """Change la couleur du sirop par densité optique : D' = D × (D_cible / D_référence)."""
    T = np.clip(trans, 0.015, 1.0)
    D = -np.log(T)
    H = trans.shape[0]
    rows = np.zeros((H, 1), dtype=bool)
    rows[455:600] = True  # épaule, au-dessus de l'étiquette
    sel = (syrup > 0.9) & rows & (lum(trans) < 0.8)
    Dref = np.median(D[sel], axis=0)
    target = np.clip(hex_rgb(liquid), 0.02, 0.98)
    Dt = -np.log(target)
    # la densité de référence correspond à l'épaisseur du centre ; on vise la couleur cible au centre
    scale = Dt / np.maximum(Dref, 0.03)
    Dn = D * scale[None, None, :]
    Tn = np.exp(-Dn)
    # les reflets (plus clairs que le fond) restent intacts
    hl = smooth(lum(trans), 0.85, 1.05)[..., None]
    Tn = Tn * (1 - hl) + trans * hl
    return trans * (1 - syrup[..., None]) + Tn * syrup[..., None]


def wrap_label_on_bottle(label: np.ndarray, A: dict, out_shape) -> tuple[np.ndarray, np.ndarray]:
    """Étiquette enroulée sur le cylindre : x = cx + R·sin(s/R)."""
    H, W = out_shape
    cx = BOTTLE["cx"]
    R = 168.0
    spec = BOTTLE["label"]
    top, bottom, flat_w = spec["top"], spec["bottom"], spec["flat_w"]
    lh, lw = label.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    sin_t = np.clip((xx - cx) / R, -0.9999, 0.9999)
    theta = np.arcsin(sin_t)
    s = theta * R  # abscisse curviligne
    u = (s + flat_w / 2) / flat_w  # 0..1 sur l'étiquette
    v = (yy - top) / (bottom - top)
    inside = (u >= 0) & (u <= 1) & (v >= 0) & (v <= 1) & (np.abs(xx - cx) < R)
    samp = bilinear(label, u * (lw - 1), v * (lh - 1))
    alpha = samp[..., 3] * inside
    rgb = samp[..., :3]
    # éclairage : ombrage du cylindre et lumière de la photographie d'origine
    shade = A["label_shade"]
    cyl = 0.80 + 0.28 * np.cos(theta + 0.42)  # lumière venant de la gauche
    rgb = rgb * np.clip(shade, 0.55, 1.08)[..., None] * cyl[..., None] / 1.04
    # tranche du papier : un liseré plus sombre sur le pourtour
    edge = alpha - blur(alpha, 1.4)
    rgb = rgb * (1 - np.clip(edge, 0, 1)[..., None] * 0.35)
    return rgb, alpha


def compose_bottle(A: dict, liquid: str, label: np.ndarray | None, bg: np.ndarray, x0: int, y0: int) -> np.ndarray:
    """Pose le flacon (coin haut-gauche de sa photographie en x0, y0) sur le fond bg."""
    H, W = A["H"], A["W"]
    trans = tint_syrup(A["trans"], A["syrup"], liquid)
    # fond vu à travers le verre (même cadre que la photographie du flacon), légèrement flou par réfraction
    region = np.zeros((H, W, 3), dtype=np.float32)
    region = paste(region, bg, np.ones(bg.shape[:2] + (1,), dtype=np.float32), -x0, -y0)
    seen = blur(region, 3.5)
    out = seen * trans
    op = A["opaque"][..., None]
    out = out * (1 - op) + A["src"] * op
    if label is not None:
        rgb, a = wrap_label_on_bottle(label, A, (H, W))
        out = out * (1 - a[..., None]) + rgb * a[..., None]
    return paste(bg, out, A["mask"][..., None], x0, y0)


# ───────────────────────────── sachet ─────────────────────────────

POUCH = {
    "src": "sachet.png",  # copie de assets/generated/packshot-poudre-poire.png
    "rect": (197, 230, 837, 1268),  # x0, y0, x1, y1
    "radius": 14,
    "notch": 305,
    "cx": 511.0,
    "label": {"left": 330, "right": 692, "top": 428, "bottom": 1186},
    "band": (1138, 1268),  # bas du sachet masqué par les ingrédients, reconstruit
    "side": (228, 322),  # colonnes propres (hors bord et hors étiquette) qui fournissent la texture
}


def pouch_assets():
    src = f32(Image.open(BASES / POUCH["src"]))
    H, W, _ = src.shape
    x0, y0, x1, y1 = POUCH["rect"]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    # silhouette : rectangle à coins arrondis en tête, encoches de déchirure
    r = POUCH["radius"]
    inside = (xx >= x0) & (xx <= x1) & (yy >= y0) & (yy <= y1)
    for cxr, cyr in ((x0 + r, y0 + r), (x1 - r, y0 + r)):
        corner = ((xx < x0 + r) if cxr < W / 2 else (xx > x1 - r)) & (yy < y0 + r)
        inside &= ~(corner & (((xx - cxr) ** 2 + (yy - cyr) ** 2) > r * r))
    for nx in (x0, x1):
        inside &= ((xx - nx) ** 2 + (yy - POUCH["notch"]) ** 2) > 5.5 ** 2
    mask = blur(inside.astype(np.float32), 0.9)
    # bas du sachet (masqué dans la photographie par les ingrédients) : le soufflet est dans l'ombre,
    # le motif s'y efface ; on prolonge la teinte de chaque colonne mesurée juste au-dessus, avec le grain
    b0, b1 = POUCH["band"]
    ref = np.median(src[b0 - 46 : b0 - 6], axis=0)  # couleur de chaque colonne, motif compris
    lab = POUCH["label"]
    cols = np.arange(W)
    li, ri = lab["left"] - 14, lab["right"] + 14
    inner = (cols > li) & (cols < ri)  # sous l'étiquette, la référence est prise sur les deux bords
    tt = np.clip((cols - li) / (ri - li), 0, 1)[:, None]
    ref[inner] = (ref[li] * (1 - tt) + ref[ri] * tt)[inner]
    # flou horizontal limité au sachet : la couleur du mur ne déborde pas sur les bords
    m = ((cols >= x0 + 2) & (cols <= x1 - 2)).astype(np.float32)[:, None]
    tone = blur(np.repeat((ref * m)[None], 9, axis=0), 34)[4] / np.maximum(blur(np.repeat(m[None], 9, axis=0), 34)[4], 1e-3)
    hb = b1 - b0
    vv = np.arange(hb, dtype=np.float32)[:, None, None]
    rng = np.random.default_rng(3)
    fine = blur(rng.normal(0, 1, (hb, W)).astype(np.float32), 0.7)[..., None] * 0.010
    base = tone[None] * (1 - 0.16 * smooth(vv, hb * 0.25, hb)) + fine
    # le motif s'arrête net sur la soudure du soufflet : un léger reflet, puis l'ombre du pli
    seam = 40
    base = base * (1 + 0.08 * np.exp(-(((vv - seam - 2) / 3) ** 2)) - 0.10 * np.exp(-(((vv - seam - 9) / 5) ** 2)))
    fade = smooth(vv, seam - 3, seam + 1)
    src[b0:b1] = src[b0:b1] * (1 - fade) + base * fade
    # liseré du pied du sachet : légèrement plus sombre
    foot = smooth(yy, y1 - 14, y1)[..., None]
    src = src * (1 - foot * 0.25)
    return {"src": src, "mask": mask, "H": H, "W": W, "label_shade": label_shading(src, {"label": POUCH["label"], "cx": POUCH["cx"]})}


def fill_low(L: np.ndarray, w: np.ndarray, radii=(22, 70, 200)) -> np.ndarray:
    """Basse fréquence de L calculée sur les seuls pixels valides (w), trous comblés à rayon croissant."""
    out = None
    for r in radii:
        num, den = blur(L * w, r), blur(w, r)
        est = num / np.maximum(den, 1e-4)
        if out is None:
            out, conf = est, np.clip(den / 0.35, 0, 1)
        else:
            out = out * conf + est * (1 - conf)
            conf = np.maximum(conf, np.clip(den / 0.35, 0, 1))
    return out


def kraft(A: dict) -> np.ndarray:
    """Sachet kraft pour Les Essentiels : même relief, même motif gravé, papier brun clair et mat."""
    src = A["src"]
    L = lum(src)
    H, W = L.shape
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    lab = POUCH["label"]
    # ancienne étiquette (papier crème) : exclue du calcul, elle est de toute façon recouverte
    box = (xx > lab["left"] - 20) & (xx < lab["right"] + 20) & (yy > lab["top"] - 20) & (yy < lab["bottom"] + 20)
    old = blur((box & (L > 0.5)).astype(np.float32), 5) > 0.02
    w = ((A["mask"] > 0.95) & ~old).astype(np.float32)
    low = fill_low(L, w)
    detail = (L - low) * (A["mask"] > 0.5) * (1 - blur(old.astype(np.float32), 2))
    med = float(np.median(low[w > 0]))
    shade = np.clip(low / med, 0.78, 1.14)
    shade = 1 + (shade - 1) * 0.6  # papier mat : reflets atténués
    paper = np.array([0.70, 0.58, 0.45], dtype=np.float32)
    # le motif gravé devient un tracé brun, plus foncé que le papier
    ink = np.clip(-detail * 2.2, -0.22, 0.2)
    out = paper[None, None, :] * shade[..., None] * (1 + ink[..., None])
    return np.clip(out, 0, 1)


def place_label_flat(label: np.ndarray, A: dict) -> tuple[np.ndarray, np.ndarray]:
    H, W = A["H"], A["W"]
    s = POUCH["label"]
    lh, lw = label.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    # le sachet est légèrement bombé : compression douce vers les bords
    cx = (s["left"] + s["right"]) / 2
    half = (s["right"] - s["left"]) / 2
    xn = (xx - cx) / half
    u = (np.sin(np.clip(xn, -1.2, 1.2) * 1.15) / math.sin(1.15) + 1) / 2
    v = (yy - s["top"]) / (s["bottom"] - s["top"])
    inside = (xn >= -1) & (xn <= 1) & (v >= 0) & (v <= 1)
    samp = bilinear(label, u * (lw - 1), v * (lh - 1))
    a = samp[..., 3] * inside
    rgb = samp[..., :3] * np.clip(A["label_shade"], 0.6, 1.08)[..., None]
    edge = a - blur(a, 1.2)
    rgb = rgb * (1 - np.clip(edge, 0, 1)[..., None] * 0.3)
    return rgb, a


def compose_pouch(A: dict, body: np.ndarray, label: np.ndarray | None, bg: np.ndarray, x0: int, y0: int) -> np.ndarray:
    H, W = A["H"], A["W"]
    m = A["mask"][..., None]
    layer = body
    alpha = m
    if label is not None:
        rgb, a = place_label_flat(label, A)
        layer = layer * (1 - a[..., None]) + rgb * a[..., None]
    return paste(bg, layer, alpha, x0, y0)


def paste(bg: np.ndarray, layer: np.ndarray, alpha: np.ndarray, x0: int, y0: int) -> np.ndarray:
    """colle un calque (H,W,3) avec son alpha (H,W,1) sur bg en (x0, y0), en rognant ce qui dépasse"""
    res = bg.copy()
    h, w = layer.shape[:2]
    bh, bw = bg.shape[:2]
    sx0, sy0 = max(0, -x0), max(0, -y0)
    dx0, dy0 = max(0, x0), max(0, y0)
    dx1, dy1 = min(bw, x0 + w), min(bh, y0 + h)
    if dx1 <= dx0 or dy1 <= dy0:
        return res
    sl = (slice(sy0, sy0 + dy1 - dy0), slice(sx0, sx0 + dx1 - dx0))
    a = alpha[sl]
    res[dy0:dy1, dx0:dx1] = res[dy0:dy1, dx0:dx1] * (1 - a) + layer[sl] * a
    return res


# ───────────────────────────── compositions ─────────────────────────────

def grain(a: np.ndarray, amount: float = 0.012, seed: int = 7) -> np.ndarray:
    rng = np.random.default_rng(seed)
    n = rng.normal(0, 1, a.shape[:2]).astype(np.float32)
    n = blur(n, 0.6)
    return np.clip(a + n[..., None] * amount, 0, 1)


def packshot_bottle(A: dict, product: dict, label: np.ndarray) -> Image.Image:
    bg = backdrop(accent=product["palette"]["accent"])
    base = int(FH * BASELINE)
    x0 = int(FW / 2 - BOTTLE["cx"])
    y0 = base - BOTTLE["base"]
    half = 168
    bg = add_shadow(bg, FW / 2, base, half, BOTTLE["base"] - 179, tint=hex_rgb(product["liquid"]))
    out = compose_bottle(A, product["liquid"], label, bg, x0, y0)
    return to_img(grain(out))


def packshot_pouch(A: dict, body: np.ndarray, label: np.ndarray, accent: str | None = None) -> Image.Image:
    bg = backdrop(accent=accent)
    base = int(FH * BASELINE)
    x0r, y0r, x1r, y1r = POUCH["rect"]
    cx = (x0r + x1r) / 2
    x0 = int(FW / 2 - cx)
    y0 = base - y1r
    bg = add_shadow(bg, FW / 2, base, (x1r - x0r) / 2, y1r - y0r)
    out = compose_pouch(A, body, label, bg, x0, y0)
    return to_img(grain(out))


# Gammes : plusieurs contenants alignés sur le même plateau (bannières 16:9, résolution native)
GW, GH = 3200, 1800
GAMMES = {
    "gamme-saisons": ["fraise-des-bois-creme-de-madeleine", "peche-blanche-fleur-oranger", "poire-rotie-sable-noisette", "datte-fondante-creme-brulee"],
    "gamme-signatures": ["pistache-grillee-biscuit-au-beurre", "vanille-torrefiee-praline-blanc", "caramel-blond-abricot-confit", "chocolat-noir-orange-confite"],
    "gamme-poudres": ["poudre-pistache-grillee-biscuit-au-beurre", "poudre-chocolat-noir-orange-confite", "poudre-vanille-torrefiee-praline-blanc", "poudre-chai-doux-fleur-oranger"],
    "gamme-essentiels": ["chocolat-noir-intense", "chocolat-au-lait-onctueux", "caramel-beurre-sale", "chai-epice-classique"],
    "gamme-maison": ["poire-rotie-sable-noisette", "poudre-fraise-des-bois-creme-de-madeleine", "chocolat-noir-orange-confite", "vanille-bourbon"],
}


def gamme(items: list[dict], labels: dict, B: dict, P: dict, kraft_body: np.ndarray) -> Image.Image:
    bg = backdrop(GW, GH, horizon=0.78)
    base = int(GH * 0.86)
    widths = [336 if p["category"] == "sirop" else POUCH["rect"][2] - POUCH["rect"][0] for p in items]
    gap = (GW * 0.86 - sum(widths)) / (len(items) - 1)
    x = GW * 0.07
    centers = []
    for wdt in widths:
        centers.append(x + wdt / 2)
        x += wdt + gap
    # toutes les ombres d'abord : aucune ne doit assombrir un contenant déjà posé
    for p, cx in zip(items, centers):
        if p["category"] == "sirop":
            bg = add_shadow(bg, cx, base, 168, BOTTLE["base"] - 179, tint=hex_rgb(p["liquid"]))
        else:
            x0r, y0r, x1r, y1r = POUCH["rect"]
            bg = add_shadow(bg, cx, base, (x1r - x0r) / 2, y1r - y0r)
    for p, cx in zip(items, centers):
        if p["category"] == "sirop":
            bg = compose_bottle(B, p["liquid"], labels[p["slug"]], bg, int(cx - BOTTLE["cx"]), base - BOTTLE["base"])
        else:
            x0r, y0r, x1r, y1r = POUCH["rect"]
            body = kraft_body if p["category"] == "essentiel" else P["src"]
            bg = compose_pouch(P, body, labels[p["slug"]], bg, int(cx - (x0r + x1r) / 2), base - y1r)
    return to_img(grain(bg))


def catalogue() -> list[dict]:
    """Le catalogue est lu dans data/products.ts (source unique), via Node."""
    code = "import('./data/products.ts').then(m=>process.stdout.write(JSON.stringify(m.products)))"
    res = subprocess.run(["node", "--no-warnings", "-e", code], cwd=ROOT, capture_output=True, text=True, encoding="utf-8", check=True)
    return json.loads(res.stdout)


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    wanted = sys.argv[1:]
    cat = catalogue()
    by_slug = {p["slug"]: p for p in cat}
    items = [p for p in cat if p["category"] in ("sirop", "poudre", "essentiel") and (not wanted or p["slug"] in wanted)]
    OUT.mkdir(parents=True, exist_ok=True)
    labels = load_labels([p["slug"] for p in cat if p["category"] in ("sirop", "poudre", "essentiel")])
    B = P = None
    for p in items:
        if p["category"] == "sirop":
            B = B or bottle_assets()
            im = packshot_bottle(B, p, labels[p["slug"]])
        else:
            P = P or pouch_assets()
            body = kraft(P) if p["category"] == "essentiel" else P["src"]
            im = packshot_pouch(P, body, labels[p["slug"]], p["palette"]["accent"])
        im.save(OUT / f"pack-{p['slug']}.png", optimize=False)
        print(f"  ✓ pack-{p['slug']}")
    if not wanted or "gammes" in wanted:
        B = B or bottle_assets()
        P = P or pouch_assets()
        K = kraft(P)
        for name, slugs in GAMMES.items():
            gamme([by_slug[k] for k in slugs], labels, B, P, K).save(OUT / f"{name}.png", optimize=False)
            print(f"  ✓ {name}")


if __name__ == "__main__":
    main()
