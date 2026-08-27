"""pwa-build-globe — scaffold helper.

Reads template/, applies {{TOKEN}} substitutions from a config + selected theme,
copies result to projects/<slug>/. Used by /pwa-build-globe Step 5.

Usage:
  python scaffold.py <project_dir> <theme_slug>

The project_dir MUST already contain config.json. The script:
  - Copies template/ → project_dir/ (preserving existing data/ and config.json)
  - Copies theme css from the sibling theme-factory/themes/<theme_slug>.css → project_dir/theme.css
  - Extracts --bg-1 and --accent from the theme for manifest + icon substitution
  - Substitutes {{NAME}}, {{SHORT_NAME}}, {{TAG}}, {{MARK}}, {{CACHE_NAME}}, {{THEME_BG}}, {{THEME_ACCENT}}
"""
import json
import re
import shutil
import sys
from pathlib import Path

TEMPLATE = Path(__file__).resolve().parent / "template"
# theme-factory is a sibling skill under the same skills/ root — resolve relative to
# this file so it works in-repo, in the Claude plugin cache, and in .cursor/skills/.
THEME_DIR = Path(__file__).resolve().parent.parent / "theme-factory" / "themes"

def extract_token(css_path: Path, token: str) -> str:
    text = css_path.read_text(encoding="utf-8")
    m = re.search(rf"--{re.escape(token)}\s*:\s*([^;]+);", text)
    return m.group(1).strip() if m else ""

def slugify(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

def main():
    project_dir = Path(sys.argv[1]).resolve()
    theme_slug = sys.argv[2]
    theme_css = THEME_DIR / f"{theme_slug}.css"

    if not project_dir.exists():
        sys.exit(f"project dir not found: {project_dir}")
    config_path = project_dir / "config.json"
    if not config_path.exists():
        sys.exit(f"config.json not found in {project_dir}")
    if not theme_css.exists():
        sys.exit(f"theme not found: {theme_css}")

    config = json.loads(config_path.read_text(encoding="utf-8"))
    bg = extract_token(theme_css, "bg-1") or "#0a1628"
    accent = extract_token(theme_css, "accent") or "#f5a524"
    cache_name = f"{slugify(config['short_name'])}-v1"

    subs = {
        "{{NAME}}":         config["name"],
        "{{SHORT_NAME}}":   config["short_name"],
        "{{TAG}}":          config["brand"].get("tag", ""),
        "{{MARK}}":         config["brand"].get("mark", "●"),
        "{{CACHE_NAME}}":   cache_name,
        "{{THEME_BG}}":     bg,
        "{{THEME_ACCENT}}": accent,
    }

    # Copy template files (don't touch data/, config.json, or theme.css if present)
    for src in TEMPLATE.rglob("*"):
        if src.is_dir():
            continue
        rel = src.relative_to(TEMPLATE)
        if str(rel) == "config.schema.json":
            continue  # schema stays in skill, not in project
        dst = project_dir / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        if src.suffix in {".html", ".js", ".css", ".json", ".svg"}:
            text = src.read_text(encoding="utf-8")
            for k, v in subs.items():
                text = text.replace(k, v)
            dst.write_text(text, encoding="utf-8")
        else:
            shutil.copy2(src, dst)

    # Copy theme tokens as ./theme.css
    shutil.copy2(theme_css, project_dir / "theme.css")

    # Verify no leftover tokens
    leftover = []
    for f in project_dir.rglob("*"):
        if f.is_file() and f.suffix in {".html", ".js", ".css", ".json", ".svg"}:
            text = f.read_text(encoding="utf-8")
            if "{{" in text and "}}" in text:
                leftover.append(str(f.relative_to(project_dir)))
    if leftover:
        sys.exit(f"FAIL: leftover {{}} tokens in: {leftover}")

    print(f"OK: scaffolded {project_dir.name}")
    print(f"  theme: {theme_slug} (bg={bg}, accent={accent})")
    print(f"  cache: {cache_name}")
    print(f"  files: {sum(1 for _ in project_dir.rglob('*') if _.is_file())}")

if __name__ == "__main__":
    main()
