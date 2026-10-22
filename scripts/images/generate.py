"""Génération des photographies Maison Sillage avec l'API OpenAI Images.

    OPENAI_API_KEY=… python -I scripts/images/generate.py                 # tout ce qui manque
    OPENAI_API_KEY=… python -I scripts/images/generate.py hero-ete-coucher # une ou plusieurs prises
    OPENAI_API_KEY=… python -I scripts/images/generate.py --force hero-*   # régénérer

La clé n'est jamais écrite sur disque par ce script : elle est lue dans
l'environnement. Les fichiers produits vont dans assets/generated/ (sources
haute définition, non publiées) ; scripts/images/build.py en dérive ensuite
les masters WebP de public/images/.

Chaque prise de vue où figurent des produits reçoit en référence les
photographies d'emballage existantes (flacon, sachet, gamme) : étiquettes,
logo et typographie restent identiques d'une image à l'autre. Les variantes
« jour » et « nuit » du hero et de l'histoire sont obtenues en éditant la
version « coucher » : même décor, même cadrage, vraie lumière différente.
"""

from __future__ import annotations

import base64
import fnmatch
import io
import json
import os
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import requests
from PIL import Image

sys.path.insert(0, str(Path(__file__).parent))
from shots import SHOTS  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "assets" / "generated"
LOG = OUT / "generation-log.json"
API = "https://api.openai.com/v1/images"
MODEL = os.environ.get("IMAGE_MODEL", "gpt-image-2")

# ───────────────────────────── appel API ─────────────────────────────

_lock = threading.Lock()


def log(entry: dict) -> None:
    with _lock:
        data = json.loads(LOG.read_text(encoding="utf-8")) if LOG.exists() else {}
        data[entry["name"]] = entry
        LOG.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")


def as_png(path: Path, max_side: int = 1536) -> tuple[str, bytes, str]:
    im = Image.open(path).convert("RGB")
    im.thumbnail((max_side, max_side))
    buf = io.BytesIO()
    im.save(buf, "PNG")
    return (path.stem + ".png", buf.getvalue(), "image/png")


def call(name: str, spec: dict, key: str) -> Path:
    out = OUT / f"{name}.png"
    headers = {"Authorization": f"Bearer {key}"}
    images = list(spec["images"])
    if spec["base"]:
        images = [OUT / f"{spec['base']}.png"] + images
    for attempt in range(5):
        t0 = time.time()
        try:
            if images:
                files = [("image[]", as_png(p)) for p in images]
                data = {"model": MODEL, "prompt": spec["prompt"], "size": spec["size"], "quality": spec["quality"], "n": "1"}
                r = requests.post(f"{API}/edits", headers=headers, data=data, files=files, timeout=600)
            else:
                body = {"model": MODEL, "prompt": spec["prompt"], "size": spec["size"], "quality": spec["quality"], "n": 1}
                r = requests.post(f"{API}/generations", headers={**headers, "Content-Type": "application/json"}, json=body, timeout=600)
        except requests.RequestException as e:
            print(f"  {name}: réseau ({e.__class__.__name__}), nouvel essai")
            time.sleep(10 * (attempt + 1))
            continue
        if r.status_code == 200:
            b64 = r.json()["data"][0]["b64_json"]
            out.write_bytes(base64.b64decode(b64))
            usage = r.json().get("usage", {})
            log({"name": name, "size": spec["size"], "quality": spec["quality"], "model": MODEL, "seconds": round(time.time() - t0), "usage": usage})
            print(f"  ✓ {name} ({round(time.time() - t0)} s)")
            return out
        msg = r.text[:300]
        if r.status_code in (429, 500, 502, 503, 504):
            print(f"  {name}: HTTP {r.status_code}, nouvel essai — {msg[:120]}")
            time.sleep(20 * (attempt + 1))
            continue
        raise RuntimeError(f"{name}: HTTP {r.status_code} — {msg}")
    raise RuntimeError(f"{name}: échec après 5 essais")


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        sys.exit("OPENAI_API_KEY absente de l'environnement")
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    force = "--force" in sys.argv
    workers = int(os.environ.get("WORKERS", "4"))
    OUT.mkdir(parents=True, exist_ok=True)
    wanted = [n for n in SHOTS if not args or any(fnmatch.fnmatch(n, a) for a in args)]
    todo = [n for n in wanted if force or not (OUT / f"{n}.png").exists()]
    print(f"{len(todo)} prise(s) de vue à générer avec {MODEL}")
    failures: list[str] = []
    pending = list(todo)
    # une variante attend son image de base : vagues successives
    while pending:
        ready = [n for n in pending if not SHOTS[n]["base"] or ((OUT / f"{SHOTS[n]['base']}.png").exists() and SHOTS[n]["base"] not in pending)]
        if not ready:
            failures += pending
            print("  ✗ image de base manquante pour : " + ", ".join(pending))
            break
        with ThreadPoolExecutor(max_workers=workers) as pool:
            futs = {n: pool.submit(call, n, SHOTS[n], key) for n in ready}
            for n, f in futs.items():
                try:
                    f.result()
                except Exception as e:  # noqa: BLE001
                    failures.append(n)
                    print(f"  ✗ {e}")
        pending = [n for n in pending if n not in ready and SHOTS[n]["base"] not in failures]
    if failures:
        sys.exit(f"{len(failures)} échec(s) : {', '.join(failures)}")


if __name__ == "__main__":
    main()
