#!/usr/bin/env bash
set -euo pipefail

SRC="${1:-assets/logo.png}"
OUT="public"

echo "Generating from: $SRC"

magick "$SRC" -resize 16x16 "$OUT/favicon-16x16.png"
magick "$SRC" -resize 32x32 "$OUT/favicon-32x32.png"
magick "$SRC" -resize 180x180 "$OUT/apple-touch-icon.png"
magick "$SRC" -resize 192x192 "$OUT/android-chrome-192x192.png"
magick "$SRC" -resize 512x512 "$OUT/android-chrome-512x512.png"
magick "$SRC" -resize 32x32 "$OUT/favicon.ico"

# ponytail: favicon.ico is 32x32 single-entry. Multi-size ICO via:
#   magick "$SRC" \( +clone -resize 16x16 \) -delete 0 -resize 32x32 "$OUT/favicon.ico"
# if an ancient browser needs 16x16.

echo "Done:"
ls -lh "$OUT/favicon"* "$OUT/apple-touch-icon"* "$OUT/android-chrome"* 2>/dev/null
