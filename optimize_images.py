#!/usr/bin/env python3
"""
Mobi Mobile - Image Optimization Script
Developer: Raj Gautam

Converts every PNG/JPG in the images/ folder to compressed WebP.
- Resizes images wider than 1920px while keeping the aspect ratio.
- Preserves transparency (logo).
- Prints a before/after size summary.

Usage:
    pip install Pillow
    python optimize_images.py

Optional:
    python optimize_images.py --update-html
        Also rewrites .png/.jpg references to .webp in index.html,
        404.html and everything inside pages/.
"""

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is not installed. Run: pip install Pillow")

ROOT = Path(__file__).resolve().parent
IMAGES_DIR = ROOT / "images"
SOURCE_EXTENSIONS = {".png", ".jpg", ".jpeg"}
MAX_WIDTH = 1920
WEBP_QUALITY = 82

HTML_DIRS = [ROOT, ROOT / "pages"]


def human_size(num_bytes: int) -> str:
    if num_bytes < 1024:
        return f"{num_bytes} B"
    if num_bytes < 1024 * 1024:
        return f"{num_bytes / 1024:.1f} KB"
    return f"{num_bytes / (1024 * 1024):.2f} MB"


def prepare_mode(image: Image.Image) -> Image.Image:
    if image.mode in ("RGBA", "LA") or (
        image.mode == "P" and "transparency" in image.info
    ):
        return image.convert("RGBA")
    return image.convert("RGB")


def optimize_image(path: Path) -> tuple[int, int] | None:
    try:
        with Image.open(path) as source:
            original_size = path.stat().st_size
            image = prepare_mode(source)

            if image.width > MAX_WIDTH:
                ratio = MAX_WIDTH / image.width
                new_size = (MAX_WIDTH, round(image.height * ratio))
                image = image.resize(new_size, Image.LANCZOS)

            destination = path.with_suffix(".webp")
            image.save(destination, "WEBP", quality=WEBP_QUALITY, method=6)
            new_size_bytes = destination.stat().st_size
            return original_size, new_size_bytes
    except Exception as exc:  # noqa: BLE001
        print(f"  ! Skipped {path.name}: {exc}")
        return None


def update_html_references() -> int:
    replaced = 0
    targets: list[Path] = []
    for directory in HTML_DIRS:
        if directory.exists():
            targets.extend(directory.glob("*.html"))

    for html_file in targets:
        text = html_file.read_text(encoding="utf-8")
        new_text = (
            text.replace(".png", ".webp")
            .replace(".PNG", ".webp")
            .replace(".jpg", ".webp")
            .replace(".JPG", ".webp")
            .replace(".jpeg", ".webp")
        )
        if new_text != text:
            html_file.write_text(new_text, encoding="utf-8")
            replaced += 1

    return replaced


def main() -> int:
    parser = argparse.ArgumentParser(description="Optimize Mobi Mobile images to WebP.")
    parser.add_argument(
        "--update-html",
        action="store_true",
        help="Rewrite .png/.jpg references to .webp in HTML files.",
    )
    args = parser.parse_args()

    if not IMAGES_DIR.exists():
        sys.exit(f"Images folder not found: {IMAGES_DIR}")

    files = sorted(
        p
        for p in IMAGES_DIR.iterdir()
        if p.is_file() and p.suffix.lower() in SOURCE_EXTENSIONS
    )

    if not files:
        print("No PNG/JPG images found in images/.")
        return 0

    print(f"Optimizing {len(files)} image(s) in {IMAGES_DIR}\n")
    total_before = 0
    total_after = 0

    for path in files:
        result = optimize_image(path)
        if result is None:
            continue
        before, after = result
        total_before += before
        total_after += after
        saved = before - after
        percent = (saved / before * 100) if before else 0
        print(
            f"  {path.name:<20} {human_size(before):>10} -> "
            f"{human_size(after):>10}  ({percent:5.1f}% smaller)"
        )

    if total_before:
        saved = total_before - total_after
        percent = saved / total_before * 100
        print("\n" + "-" * 56)
        print(f"  Total before: {human_size(total_before)}")
        print(f"  Total after:  {human_size(total_after)}")
        print(f"  Saved:        {human_size(saved)} ({percent:.1f}%)")

    if args.update_html:
        changed = update_html_references()
        print(f"\nUpdated image references in {changed} HTML file(s).")
    else:
        print(
            "\nTip: run 'python optimize_images.py --update-html' to point "
            "the HTML files at the new .webp images."
        )

    print("\nDone.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
