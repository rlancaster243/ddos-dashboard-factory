#!/usr/bin/env bash
#
# Install the DDOS dashboard skills into Cursor (and optionally Codex).
#
# Cursor auto-loads Agent Skills from these locations (project first, then global):
#     .cursor/skills/   .agents/skills/   ~/.cursor/skills/   ~/.agents/skills/
# Codex reads .agents/skills/ and ~/.agents/skills/.
#
# This script symlinks each skill folder from this repo into a global skills dir,
# so the skills are available in every project and stay in sync with `git pull`.
#
# Usage:
#   bash scripts/install-cursor.sh                    # -> ~/.cursor/skills   (Cursor)
#   bash scripts/install-cursor.sh ~/.agents/skills   # -> Cursor AND Codex
#   TARGET=~/.agents/skills bash scripts/install-cursor.sh
#
# Set COPY=1 to copy instead of symlink (if your setup can't traverse symlinked dirs):
#   COPY=1 bash scripts/install-cursor.sh
#
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS_SRC="$REPO_DIR/skills"
TARGET="${1:-${TARGET:-$HOME/.cursor/skills}}"
SKILLS=(theme-factory dashboard-preview pwa-build pwa-build-globe)

mkdir -p "$TARGET"
echo "Installing DDOS skills into: $TARGET"
echo

for skill in "${SKILLS[@]}"; do
  src="$SKILLS_SRC/$skill"
  dst="$TARGET/$skill"
  if [ ! -d "$src" ]; then
    echo "  SKIP     $skill (missing at $src)"
    continue
  fi
  if [ -e "$dst" ] || [ -L "$dst" ]; then
    rm -rf "$dst"
    action="REPLACE"
  else
    action="INSTALL"
  fi
  if [ "${COPY:-0}" = "1" ]; then
    cp -R "$src" "$dst"
    echo "  $action  $dst (copy)"
  else
    ln -s "$src" "$dst"
    echo "  $action  $dst -> $src (symlink)"
  fi
done

echo
echo "Done. Reload Cursor so it re-scans $TARGET."
echo "Verify: open Agent chat, type '/', and search for 'theme-factory'."
