#!/usr/bin/env bash
# Publish PokéTrivia Island into the Learn Zone site.
#
#   ~/Claude-Projects/poketrivia          <- canonical. Edit here.
#   ~/Claude-Projects/math-app/poketrivia <- generated. Never edit; it is wiped.
#
# The Learn Zone repo is the GitHub Pages site, so copying the folder in and
# committing is the whole deploy. Usage:
#
#   tools/deploy.sh            copy only
#   tools/deploy.sh --commit   copy, commit the folder and the hub tile
#   tools/deploy.sh --push     copy, commit, push
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST_REPO="$(cd "$SRC/../math-app" && pwd)"
DEST="$DEST_REPO/poketrivia"

echo "source : $SRC"
echo "target : $DEST"

rm -rf "$DEST"
mkdir -p "$DEST"
for item in index.html style.css README.md js data img vendor tools; do
  cp -R "$SRC/$item" "$DEST/"
done
find "$DEST" -name '.DS_Store' -delete
echo "copied $(du -sh "$DEST" | cut -f1)"

[[ "${1:-}" == "--commit" || "${1:-}" == "--push" ]] || { echo "done (no commit)"; exit 0; }

cd "$DEST_REPO"
# Stage ONLY this app and the hub tile. The Learn Zone often has unrelated
# work in progress and it must not get swept into a deploy commit.
git add poketrivia index.html
if git diff --cached --quiet; then
  echo "nothing changed"
  exit 0
fi
git commit -q -m "PokeTrivia Island: publish latest build"
echo "committed"

[[ "${1:-}" == "--push" ]] || { echo "done (not pushed)"; exit 0; }
git push -q origin main
echo "pushed — live shortly at https://tw-origami.github.io/poketrivia/"
