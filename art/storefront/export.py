"""Compress the rendered backplates for the web.

    python3 art/storefront/export.py [--quality 80]

Reads art/storefront/renders/<theme>/backplate.png and writes
public/storefront/<theme>/backplate.webp, then prints every shipped file's
size. Needs Pillow.
"""
import pathlib
import sys

from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
PUBLIC = HERE.parent.parent / "public" / "storefront"


def main():
    quality = 80
    if "--quality" in sys.argv:
        quality = int(sys.argv[sys.argv.index("--quality") + 1])
    for png in sorted((HERE / "renders").glob("*/backplate.png")):
        theme = png.parent.name
        out = PUBLIC / theme / "backplate.webp"
        out.parent.mkdir(parents=True, exist_ok=True)
        Image.open(png).convert("RGB").save(out, "WEBP", quality=quality, method=6)
    total = 0
    for f in sorted(PUBLIC.glob("*/*")):
        size = f.stat().st_size
        total += size
        print(f"{f.relative_to(PUBLIC)}: {size / 1024:.0f} KB")
    print(f"total: {total / 1024:.0f} KB")


if __name__ == "__main__":
    main()
