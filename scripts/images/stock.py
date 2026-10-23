"""Téléchargement des photographies d'ambiance sous licence Unsplash.

    python -I scripts/images/stock.py        # télécharge ce qui manque dans assets/stock/

La liste (identifiant, photographe, page d'origine) est dans scripts/images/stock.json ;
elle alimente aussi la page « Crédits photographiques » du site. Les photographies
Unsplash peuvent être utilisées et modifiées librement, y compris à des fins
commerciales (https://unsplash.com/license) ; nous créditons tout de même chaque auteur.
Aucune de ces photographies ne montre de produit Maison Sillage : les produits
sont ajoutés par scripts/images/packshots.py et scripts/images/mockups.py.
"""

from __future__ import annotations

import json
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LIST = Path(__file__).with_name("stock.json")
OUT = ROOT / "assets" / "stock"


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    OUT.mkdir(parents=True, exist_ok=True)
    items = json.loads(LIST.read_text(encoding="utf-8"))
    for key, it in items.items():
        dest = OUT / f"{key}.jpg"
        if dest.exists():
            continue
        # 2400 px sur le grand côté au plus : jamais d'agrandissement, la source fait au moins 2000 px
        side = "w" if it["w"] >= it["h"] else "h"
        url = f"{it['raw']}&{side}=2400&q=88&fm=jpg"
        req = urllib.request.Request(url, headers={"User-Agent": "maison-sillage-build"})
        with urllib.request.urlopen(req, timeout=120) as r:
            dest.write_bytes(r.read())
        print(f"  ✓ {key:<28} {it['photographer']}")
    print(f"{len(items)} photographies dans {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
