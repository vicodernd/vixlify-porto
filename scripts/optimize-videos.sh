#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Vixlify Video Optimizer
# Compress MP4s + generate WebM variants + extract poster images
#
# Requirements: ffmpeg  (brew install ffmpeg)
# Run from project root: bash scripts/optimize-videos.sh
# ─────────────────────────────────────────────────────────────

set -euo pipefail

CLIPS="public/clips"
POSTERS="public/posters"
TMPDIR_OPT=$(mktemp -d)

command -v ffmpeg >/dev/null 2>&1 || {
  echo "❌ ffmpeg not found."
  echo "   Install: brew install ffmpeg  (or https://ffmpeg.org/download.html)"
  exit 1
}

mkdir -p "$POSTERS"

echo "🎬 Starting Vixlify video optimization..."
echo ""

# ── Map: video file → poster filename ──────────────────────
declare -A POSTER_MAP=(
  ["shot-219.mp4"]="nimbus.jpg"
  ["shot-868.mp4"]="doleme.jpg"
  ["shot-52.mp4"]="oreli.jpg"
  ["halo.mp4"]="halo.jpg"
  ["shot-323.mp4"]="kooaz.jpg"
  ["shot-651.mp4"]="solutek.jpg"
)

for INPUT in "$CLIPS"/*.mp4; do
  FILENAME=$(basename "$INPUT")
  STEM="${FILENAME%.mp4}"
  OPT_MP4="$TMPDIR_OPT/${STEM}.mp4"
  OUTPUT_WEBM="$CLIPS/${STEM}.webm"
  POSTER_NAME="${POSTER_MAP[$FILENAME]:-}"

  echo "──────────────────────────────────"
  echo "📦 Processing: $FILENAME"
  BEFORE=$(du -sh "$INPUT" | cut -f1)
  echo "   Before: $BEFORE"

  # Step 1 — Compress MP4 (H.264, CRF 28, max width 1280px, no audio)
  ffmpeg -y -i "$INPUT" \
    -vcodec libx264 \
    -crf 28 \
    -preset slow \
    -vf "scale='min(1280,iw)':-2" \
    -an \
    -movflags +faststart \
    "$OPT_MP4" 2>/dev/null

  # Replace original with optimized
  cp "$OPT_MP4" "$INPUT"
  AFTER=$(du -sh "$INPUT" | cut -f1)
  echo "   After MP4: $AFTER"

  # Step 2 — Generate WebM/VP9 from optimized MP4
  ffmpeg -y -i "$OPT_MP4" \
    -c:v libvpx-vp9 \
    -crf 35 \
    -b:v 0 \
    -vf "scale='min(1280,iw)':-2" \
    -an \
    "$OUTPUT_WEBM" 2>/dev/null
  WEBM_SIZE=$(du -sh "$OUTPUT_WEBM" | cut -f1)
  echo "   WebM:     $WEBM_SIZE"

  # Step 3 — Extract poster from 1s mark (only if not already exists)
  if [[ -n "$POSTER_NAME" && ! -f "$POSTERS/$POSTER_NAME" ]]; then
    ffmpeg -y -i "$OPT_MP4" \
      -ss 00:00:01 \
      -vframes 1 \
      -q:v 3 \
      "$POSTERS/$POSTER_NAME" 2>/dev/null
    echo "   Poster:   $POSTERS/$POSTER_NAME ✅"
  fi
done

rm -rf "$TMPDIR_OPT"

echo ""
echo "──────────────────────────────────"
echo "✅ Done! All videos optimized."
echo "   Posters saved to: $POSTERS/"
echo ""
echo "📊 Final sizes:"
du -sh "$CLIPS"/*.mp4 "$CLIPS"/*.webm 2>/dev/null | sort -h
