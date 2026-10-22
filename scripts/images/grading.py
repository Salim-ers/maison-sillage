"""Étalonnage des photographies maritimes Maison Sillage.

Les photographies sources sont toutes prises au coucher du soleil. Pour les
ambiances « Jour » et « Nuit » et pour les quatre saisons, on produit hors ligne
des variantes étalonnées (pas de filtre CSS au chargement) :

- jour  : balance des blancs neutralisée, ciel recoloré en bleu par masque,
          nuages blanchis, exposition relevée ;
- nuit  : « nuit américaine » (day-for-night) — sous-exposition, dominante
          bleue, désaturation ; le soleil devient une lune et son reflet un
          chemin de lune ;
- saisons : dominantes colorimétriques (printemps frais et rosé, été doré et
          turquoise, automne ambré, hiver froid et voilé).

Ces variantes restent des interprétations d'une même prise de vue : elles ne
remplacent pas de vraies photographies de jour, de nuit ou d'hiver (voir
assets/README.md, « visuels manquants »).
"""

from __future__ import annotations

import numpy as np
from PIL import Image, ImageFilter


def to_lin(a: np.ndarray) -> np.ndarray:
    return np.power(np.clip(a, 0, 1), 2.2)


def to_srgb(a: np.ndarray) -> np.ndarray:
    return np.power(np.clip(a, 0, 1), 1 / 2.2)


def smoothstep(e0: float, e1: float, x: np.ndarray) -> np.ndarray:
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def luma(a: np.ndarray) -> np.ndarray:
    return a[..., 0] * 0.2126 + a[..., 1] * 0.7152 + a[..., 2] * 0.0722


def saturate(a: np.ndarray, k: float | np.ndarray) -> np.ndarray:
    l = luma(a)[..., None]
    k = np.asarray(k)
    if k.ndim == 2:
        k = k[..., None]
    return np.clip(l + (a - l) * k, 0, None)


def hsv_hue(a: np.ndarray) -> np.ndarray:
    """Teinte 0..1 (sRGB)."""
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx = a.max(-1)
    mn = a.min(-1)
    d = mx - mn + 1e-6
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4))
    return (h / 6) % 1


def blur(mask: np.ndarray, radius: float) -> np.ndarray:
    im = Image.fromarray((np.clip(mask, 0, 1) * 255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(radius)), dtype=np.float32) / 255


def sky_mask(a: np.ndarray, horizon: float, boxes: list[tuple[float, float, float, float]] | None) -> np.ndarray:
    """Masque doux du ciel : au-dessus de l'horizon, clair, peu texturé.
    `boxes` (x0, x1, y0, y1 en fractions, réunies) délimitent les zones de ciel
    et excluent façades claires et feuillages."""
    h, w, _ = a.shape
    yy = np.linspace(0, 1, h)[:, None] * np.ones((1, w))
    xx = np.ones((h, 1)) * np.linspace(0, 1, w)[None, :]
    l = luma(a)
    above = 1 - smoothstep(horizon - 0.06, horizon + 0.01, yy)
    bright = smoothstep(0.32, 0.6, l)
    # le feuillage et les façades sont plus sombres / plus texturés que le ciel
    tex = np.abs(l - blur(l, 3))
    smooth = 1 - smoothstep(0.02, 0.07, tex)
    m = above * bright * (0.35 + 0.65 * smooth)
    if boxes:
        inside = np.zeros_like(m)
        for x0, x1, y0, y1 in boxes:
            b = smoothstep(x0 - 0.04, x0 + 0.02, xx) * (1 - smoothstep(x1 - 0.02, x1 + 0.04, xx))
            b *= smoothstep(y0 - 0.04, y0 + 0.02, yy) * (1 - smoothstep(y1 - 0.02, y1 + 0.04, yy))
            inside = np.maximum(inside, b)
        m = m * (0.15 + 0.85 * inside)
    return blur(m, max(2, w / 400))


def sun_mask(a: np.ndarray, sun: tuple[float, float], radius: float) -> np.ndarray:
    h, w, _ = a.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((xx / w - sun[0]) * (w / h)) ** 2 + (yy / h - sun[1]) ** 2)
    return np.exp(-((d / radius) ** 2))


def reflection_mask(a: np.ndarray, sun: tuple[float, float], horizon: float) -> np.ndarray:
    """Colonne de reflet sous le soleil, à la surface de la mer."""
    h, w, _ = a.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    below = smoothstep(horizon - 0.01, horizon + 0.03, yy / h)
    spread = 0.035 + (yy / h - horizon).clip(0) * 0.22
    col = np.exp(-(((xx / w - sun[0]) / spread) ** 2))
    return below * col * smoothstep(0.45, 0.85, luma(a))


# ───────────────────────────── saisons ─────────────────────────────

def grade_season(lin: np.ndarray, season: str) -> np.ndarray:
    a = lin.copy()
    if season == "printemps":
        # lumière tendre : orangés adoucis vers le rose pêche, verts frais, ombres légèrement froides
        a = a * np.array([1.0, 1.0, 1.1])
        s = to_srgb(a)
        hue = hsv_hue(s)
        green = np.exp(-(((hue - 0.25) / 0.09) ** 2))
        orange = np.exp(-(((hue - 0.08) / 0.06) ** 2))
        a = saturate(a, 1.0 + 0.35 * green - 0.22 * orange)
        hl = smoothstep(0.25, 0.9, luma(a))[..., None]
        a = a * (1 - hl * 0.16) + hl * 0.16 * np.array([1.0, 0.8, 0.86]) * luma(a)[..., None] * 1.18
        sh = 1 - smoothstep(0.0, 0.2, luma(a))[..., None]
        a = a + sh * 0.012 * np.array([0.5, 0.7, 0.75])
        a = a * 1.08
        a = a / (1 + a * 0.08)
    elif season == "ete":
        # l'original, plus doré et une mer plus turquoise
        a = a * np.array([1.03, 1.0, 0.96])
        s = to_srgb(a)
        hue = hsv_hue(s)
        sea = np.exp(-(((hue - 0.52) / 0.08) ** 2))
        a = saturate(a, 1.08 + 0.35 * sea)
    elif season == "automne":
        a = a * np.array([1.06, 0.93, 0.76])
        s = to_srgb(a)
        hue = hsv_hue(s)
        green = np.exp(-(((hue - 0.25) / 0.11) ** 2))
        sea = np.exp(-(((hue - 0.52) / 0.1) ** 2))
        # le vert vire à l'olive et à l'ambre, la mer se fait plus sourde
        l = luma(a)[..., None]
        olive = np.array([0.46, 0.32, 0.1]) * l * 2.0
        a = a * (1 - green[..., None] * 0.7) + olive * green[..., None] * 0.7
        a = saturate(a, 1.1 - 0.35 * sea)
        # premières brumes : voile chaud dans les lointains (autour de l'horizon)
        h, w, _ = a.shape
        yy = np.linspace(0, 1, h)[:, None, None] * np.ones((1, w, 1))
        haze = np.exp(-(((yy - 0.45) / 0.12) ** 2)) * 0.05
        a = a * (1 - haze) + haze * np.array([0.75, 0.5, 0.3])
        a = np.power(np.clip(a, 0, 1), 1.08) * 0.96
    elif season == "hiver":
        l = luma(a)[..., None]
        a = l + (a - l) * 0.48
        a = a * np.array([0.9, 0.97, 1.12])
        # voile froid dans les ombres, lumière pâle et rosée dans les hautes lumières
        sh = 1 - smoothstep(0.0, 0.25, luma(a))[..., None]
        a = a + sh * 0.035 * np.array([0.55, 0.65, 0.85])
        hl = smoothstep(0.4, 0.95, luma(a))[..., None]
        a = a * (1 - hl * 0.12) + hl * 0.12 * np.array([1.0, 0.93, 0.95]) * luma(a)[..., None] * 1.12
    return np.clip(a, 0, 1)


# ───────────────────────────── lumières ─────────────────────────────

def grade_day(lin: np.ndarray, meta: dict, season: str) -> np.ndarray:
    a = lin.copy()
    sky = sky_mask(to_srgb(a), meta["horizon"], meta.get("sky"))[..., None]
    # neutralisation de la dominante dorée
    a = a * np.array([0.8, 0.95, 1.28])
    l = luma(a)[..., None]
    a = l + (a - l) * 0.82
    # ciel : dégradé bleu, nuages blanchis
    h, w, _ = a.shape
    yy = (np.linspace(0, 1, h)[:, None, None] / max(meta["horizon"], 0.2)).clip(0, 1)
    top = np.array([0.16, 0.34, 0.66]) if season != "hiver" else np.array([0.3, 0.38, 0.5])
    hor = np.array([0.62, 0.72, 0.82]) if season != "hiver" else np.array([0.62, 0.66, 0.7])
    grad = top * (1 - yy) + hor * yy
    ls = luma(lin)[..., None]
    cloud = smoothstep(0.35, 0.75, ls)
    sky_col = grad * (0.55 + 0.6 * ls) * (1 - cloud * 0.55) + cloud * 0.55 * np.array([0.9, 0.92, 0.95]) * (0.6 + ls)
    a = a * (1 - sky * 0.85) + sky_col * sky * 0.85
    # soleil adouci : plus de disque orange, une source blanche haute
    sun = sun_mask(a, meta["sun"], 0.07)[..., None]
    a = a * (1 - sun * 0.4) + sun * 0.4 * np.array([0.95, 0.95, 0.92])
    # reflet doré → scintillement argenté
    refl = reflection_mask(to_srgb(lin), meta["sun"], meta["horizon"])[..., None]
    a = a * (1 - refl * 0.5) + refl * 0.5 * luma(a)[..., None] * np.array([1.0, 1.02, 1.05])
    # mer plus bleue
    s = to_srgb(a)
    hue = hsv_hue(s)
    sea_zone = smoothstep(meta["horizon"] - 0.01, meta["horizon"] + 0.05, np.linspace(0, 1, h)[:, None] * np.ones((1, w)))
    bluish = np.exp(-(((hue - 0.55) / 0.12) ** 2)) * sea_zone
    a = saturate(a, 1.0 + 0.35 * bluish)
    # exposition et contraste plus doux
    a = a * 1.18
    a = a / (1 + a * 0.18)
    return np.clip(a, 0, 1)


def grade_night(lin: np.ndarray, meta: dict, season: str) -> np.ndarray:
    a = lin.copy()
    srgb0 = to_srgb(lin)
    sky = sky_mask(srgb0, meta["horizon"], meta.get("sky"))[..., None]
    moon = sun_mask(a, meta["sun"], 0.022)[..., None]
    halo = sun_mask(a, meta["sun"], 0.11)[..., None]
    refl = reflection_mask(srgb0, meta["sun"], meta["horizon"])[..., None]
    l = luma(a)[..., None]
    # nuit américaine : désaturation, dominante bleue, sous-exposition
    a = l + (a - l) * 0.38
    a = a * np.array([0.4, 0.6, 1.0])
    a = a * 0.2
    # ciel : dégradé vers un bleu nuit profond en haut
    h, w, _ = a.shape
    yy = (np.linspace(0, 1, h)[:, None, None] / max(meta["horizon"], 0.2)).clip(0, 1)
    sky_col = (np.array([0.006, 0.01, 0.03]) * (1 - yy) + np.array([0.03, 0.045, 0.085]) * yy) * (0.7 + 0.6 * l)
    a = a * (1 - sky * 0.9) + sky_col * sky * 0.9
    # la lune et son halo
    a = a + halo * 0.05 * np.array([0.55, 0.65, 0.85])
    a = a * (1 - moon) + moon * np.array([0.92, 0.94, 0.98]) * smoothstep(0.15, 0.6, l) * 1.0
    # chemin de lune sur la mer
    a = a + refl * 0.22 * np.array([0.62, 0.72, 0.9]) * l
    # léger relèvement des noirs (bleu nuit, pas de noir bouché)
    a = a + 0.004 * np.array([0.5, 0.65, 1.0])
    if season == "hiver":
        lv = luma(a)[..., None]
        a = lv + (a - lv) * 0.8
    return np.clip(a, 0, 1)


def grade(img: Image.Image, meta: dict, season: str, light: str) -> Image.Image:
    a = np.asarray(img.convert("RGB"), dtype=np.float32) / 255
    lin = to_lin(a)
    lin = grade_season(lin, season)
    if light == "jour":
        lin = grade_day(lin, meta, season)
    elif light == "nuit":
        lin = grade_night(lin, meta, season)
    out = to_srgb(lin)
    return Image.fromarray((out * 255 + 0.5).clip(0, 255).astype(np.uint8))
