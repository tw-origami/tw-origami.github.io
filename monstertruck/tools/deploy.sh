#!/usr/bin/env bash
# Publish Monster Truck into the Learn Zone site.
#
#   ~/Claude-Projects/monstertruck          <- canonical. Edit here.
#   ~/Claude-Projects/math-app/monstertruck <- generated. Never edit; it is wiped.
#
# The Learn Zone repo is the GitHub Pages site, so copying the folder in and
# committing is the whole deploy. Usage:
#
#   tools/deploy.sh            copy only
#   tools/deploy.sh --commit   copy, commit the folder and the hub tiles
#   tools/deploy.sh --push     copy, commit, push
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST_REPO="$(cd "$SRC/../math-app" && pwd)"
DEST="$DEST_REPO/monstertruck"

echo "source : $SRC"
echo "target : $DEST"

echo "running checks…"
node "$SRC/tools/check-callouts.mjs"
echo "✓ checks pass"

rm -rf "$DEST"
mkdir -p "$DEST"
for item in index.html style.css README.md js data audio vendor tools; do
  cp -R "$SRC/$item" "$DEST/"
done
find "$DEST" -name '.DS_Store' -delete
echo "copied $(du -sh "$DEST" | cut -f1)"

[[ "${1:-}" == "--commit" || "${1:-}" == "--push" ]] || { echo "done (no commit)"; exit 0; }

cd "$DEST_REPO"
# Stage ONLY this app and its tile page. The Learn Zone often has unrelated
# work in progress and it must not get swept into a deploy commit — the hub
# index.html currently carries some, so it joins this list only when the tile
# is promoted from dev.html to the front page.
git add monstertruck dev.html
if git diff --cached --quiet; then
  echo "nothing changed"
  exit 0
fi
git commit -q -m "Monster Truck: publish latest build"
echo "committed"

[[ "${1:-}" == "--push" ]] || { echo "done (not pushed)"; exit 0; }
git push -q origin main
echo "pushed — live shortly at https://tw-origami.github.io/monstertruck/"
