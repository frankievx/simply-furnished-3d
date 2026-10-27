"""Download the CC0 textures and sky listed in assets.json from Poly Haven.

    python3 art/storefront/fetch_assets.py

Files land in art/storefront/assets/<id>/ (gitignored). Existing files are kept.
"""
import json
import pathlib
import urllib.request

HERE = pathlib.Path(__file__).parent
OUT = HERE / "assets"
MAPS = {"Diffuse": "diff", "nor_gl": "nor", "Rough": "rough", "Displacement": "disp"}


def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "simply-furnished-art"})
    with urllib.request.urlopen(req) as r:
        return json.load(r)


def download(url, path):
    if path.exists():
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": "simply-furnished-art"})
    with urllib.request.urlopen(req) as r, open(path, "wb") as f:
        f.write(r.read())
    print("fetched", path.relative_to(HERE))


def main():
    manifest = json.loads((HERE / "assets.json").read_text())
    for asset, spec in manifest["textures"].items():
        info_path = OUT / asset / "info.json"
        if not info_path.exists():
            info = get_json(f"https://api.polyhaven.com/info/{asset}")
            info_path.parent.mkdir(parents=True, exist_ok=True)
            info_path.write_text(json.dumps({"dimensions_mm": info.get("dimensions"), "authors": info.get("authors")}))
        files = get_json(f"https://api.polyhaven.com/files/{asset}")
        for key, short in MAPS.items():
            if key not in files:
                continue
            fmt = "jpg" if key == "Diffuse" else "png"
            entry = files[key][spec["res"]].get(fmt) or files[key][spec["res"]]["jpg"]
            ext = entry["url"].rsplit(".", 1)[1]
            download(entry["url"], OUT / asset / f"{short}.{ext}")
    for asset, spec in manifest["hdris"].items():
        files = get_json(f"https://api.polyhaven.com/files/{asset}")
        download(files["hdri"][spec["res"]]["hdr"]["url"], OUT / asset / "sky.hdr")


if __name__ == "__main__":
    main()
