# DDOS Dashboard Factory

A portable pack of the **DDOS** (Dashboard Design Operating System) skills, usable in
both **Claude Code** (as a plugin) and **Cursor** (as Agent Skills). One source of truth,
no more hand-copying skills between tools.

## What's inside

| Skill | What it does |
|---|---|
| **theme-factory** | Interactive two-layer visual-identity picker — 9 archetypes × 18 CSS token themes. The asset owner the others depend on. |
| **dashboard-preview** | Generates a single-file HTML dashboard mockup (mock data, simulated filters) following the DDOS layers. The theme laboratory. |
| **pwa-build** | Converts a validated HTML preview into a deployable PWA (manifest, service worker, icons, mobile layout, deploy README). |
| **pwa-build-globe** | Scaffolds a parametric 3D-globe country-explorer PWA from a `config.json` + data files. Includes `scaffold.py` (stdlib-only). |

`references/` bundles the DDOS doctrine docs the skills cite. There are **no third-party
Python dependencies** — `pwa-build-globe/scaffold.py` uses only the standard library.

## Requirements

- **Claude Code** v2.1.233+ (plugin support), or
- **Cursor** with Agent Skills (auto-loads `SKILL.md` from `.cursor/skills` / `.agents/skills`).
- Python 3.8+ only if you use `pwa-build-globe`'s scaffolder (standard library only).

## Install — Claude Code

```bash
/plugin marketplace add rlancaster243/ddos-dashboard-factory
/plugin install ddos-dashboard-factory@rlancaster243
```

Run `/reload-plugins` if prompted. The skills then appear namespaced, e.g.
`/ddos-dashboard-factory:theme-factory`, and Claude auto-invokes them by description.
(If the repo is private, collaborators need read access first.)

## Install — Cursor

Cursor reads the same `SKILL.md` format natively — just place the skill folders where it
looks. Clone the repo and run the installer, which symlinks the four skills into your
global Cursor skills dir:

```bash
git clone https://github.com/rlancaster243/ddos-dashboard-factory.git
cd ddos-dashboard-factory
bash scripts/install-cursor.sh          # -> ~/.cursor/skills
```

Reload Cursor, open Agent chat, type `/`, and search for `theme-factory` to confirm.
Use `COPY=1 bash scripts/install-cursor.sh` to copy instead of symlink.

## Install — Codex (bonus)

Codex and Cursor both read `~/.agents/skills/`, so one location can serve both:

```bash
bash scripts/install-cursor.sh ~/.agents/skills
```

## Using the skills

The workflow is layered — start at the top and hand off downward:

1. **theme-factory** — pick an archetype, then a theme (mandatory; never defaults).
2. **dashboard-preview** — build and validate a single-file HTML mockup.
3. **pwa-build** / **pwa-build-globe** — turn the validated preview into a deployable PWA.

In Claude Code the model invokes them automatically by task context (or type
`/ddos-dashboard-factory:<skill>`). In Cursor, type `/` and pick the skill, or let it
trigger from your request.

## Adapting to your repo

These skills were extracted from an authoring repo and keep a few **output conventions**
you may want to adjust to your own project:

- `dashboard-preview` writes previews under `projects/<name>/previews/…` (or `sandbox/previews/…`).
- `pwa-build-globe` writes generated apps to `projects/<slug>/` and appends a dev-server
  entry to `.claude/launch.json`; it also cites a canonical `projects/country-globe-explorer/`
  baseline that only exists in the authoring repo.
- Both `dashboard-preview` and `pwa-build` mention an optional `dashboard-auditor` agent
  (`.claude/agents/dashboard-auditor.md`) that is **not** bundled here — it's an optional
  governance pass and is simply skipped if absent.

None of these block the core theme/preview/build flow; they're just default paths the
agent will follow unless you tell it otherwise.

## Repo layout

```
.claude-plugin/     plugin.json + marketplace.json (Claude Code)
skills/             the four SKILL.md skills (+ theme-factory assets, globe template & scaffold.py)
references/         bundled DDOS doctrine docs
scripts/            install-cursor.sh
```

## Updating

- **Claude Code:** `/plugin marketplace update rlancaster243` then reinstall/reload.
- **Cursor/Codex:** `git pull` — symlinked skills update automatically (re-run the
  installer if you used `COPY=1`).

## Versioning

Current: **v0.1.0**. Bump `.claude-plugin/plugin.json` `version` on each release so
Claude Code users receive the update.
