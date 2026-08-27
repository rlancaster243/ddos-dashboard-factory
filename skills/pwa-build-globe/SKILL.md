---
name: pwa-build-globe
description: Sub-skill of /pwa-build family. Scaffolds a parametric 3D-globe country-explorer PWA (built on globe.gl/Three.js) from a config.json + data JSON files. Invokes /theme-factory for explicit archetype + theme selection. Output is a deployable PWA at projects/<short_name>/.
tools: Read, Write, Bash
model: sonnet
---

# PWA Build Globe — DDOS Geo Intelligence Sub-Skill

## Family

This is a sub-skill of the `/pwa-build` family. It inherits the production PWA checklist from `/pwa-build` and adds globe-specific configuration. Siblings (future): `/pwa-build-kpi-grid`, `/pwa-build-funnel`, `/pwa-build-map`.

## Purpose

Scaffold a country-level 3D-globe choropleth PWA *without* hand-writing the shell. Drives:

- 3D globe (globe.gl + Three.js + world-atlas TopoJSON)
- ISO-2 keyed metric coloring with d3-scale-chromatic ramps
- Metric switcher (numeric, percentage, or categorical)
- Search-by-country with fly-to camera
- Optional hub overlay (lat/lng points with status coloring)
- Configurable detail panel (sections defined in config)
- Standard PWA shell: manifest, service worker, offline cache, mobile responsive
- Theme tokens injected from `/theme-factory` selection

The canonical reference implementation is `projects/country-globe-explorer/`. This sub-skill **does not modify** that project — it remains the regression baseline.

## Hard Rules

- **No defaults.** Always invoke the **theme-factory** skill before scaffolding. Selection is mandatory.
- **Config-first.** Never inline data values or metric definitions in template files.
- **No mutation of canonical globe.** `projects/country-globe-explorer/` is read-only for this skill.

## Workflow

### Step 1 — Strategic Intent

Dashboard type defaults to **Geo Intelligence**. Still collect from user:
- **User Type** (Executive / Analyst / Operator / Strategist)
- **Decision Horizon** (Daily / Weekly / Quarterly / Long-term)
- **Mock vs Live data** marker

### Step 2 — Theme selection

Invoke the **theme-factory** skill. Wait for explicit `{archetype, theme, css_path}` output.

### Step 3 — Collect or accept config

Ask the user one of:
- **(A)** Provide a path to an existing `config.json`, OR
- **(B)** Answer 6 inline prompts: `name`, `short_name`, `brand.tag`, `metrics[]` (at least 1), `data.countries` path, optional `overlays.hubs` enabled flag

Validate against `template/config.schema.json` before scaffolding.

### Step 4 — Collect or scaffold data

Ask the user one of:
- **(A)** Provide paths to existing `country_metrics.json` (and optional `hubs.json`), OR
- **(B)** Write placeholder schema files with 2–3 example countries for the user to fill in.

`country_metrics.json` shape (required):
```json
[
  {
    "country_code": "BR",          // ISO 3166-1 alpha-2 (required)
    "country_code_3": "BRA",       // ISO alpha-3 (optional, recommended)
    "country_name": "Brazil",      // human label
    "<metric_id>": <value>,        // one field per config.metrics[].id
    ...
  }
]
```

`hubs.json` shape (if `overlays.hubs.enabled = true`):
```json
[
  { "hub_name": "Mexico Hub", "lat": 19.4, "lng": -99.1, "status": "Active", "leader": "TBD" }
]
```

### Step 5 — Scaffold the project

Write to `projects/<short_name slug>/`:

```
projects/<slug>/
├── index.html          ← from template; substitutes {{NAME}}, {{TAG}}, {{SHORT_NAME}}
├── app.js              ← copied verbatim (reads config.json + data at runtime)
├── styles.css          ← copied verbatim (structural only; references theme vars)
├── theme.css           ← copied from theme-factory css_path
├── sw.js               ← from template; substitutes {{CACHE_NAME}} and {{PRECACHE_LIST}}
├── manifest.json       ← from template; substitutes brand + colors
├── config.json         ← from Step 3
├── icons/
│   ├── icon-192.svg    ← from template; accent color substituted
│   └── icon-512.svg    ← same
├── data/
│   ├── country_metrics.json   ← from Step 4
│   └── hubs.json              ← if overlay enabled
└── README.md           ← deploy instructions (GH Pages / Netlify / Vercel)
```

Substitution tokens (limited set, all in HTML/manifest/sw only):
- `{{NAME}}` — `config.name`
- `{{SHORT_NAME}}` — `config.short_name`
- `{{TAG}}` — `config.brand.tag`
- `{{MARK}}` — `config.brand.mark` (defaults to `●`)
- `{{CACHE_NAME}}` — derived: `<slug>-v1`
- `{{THEME_BG}}` — `--bg-1` value from selected theme (for manifest theme_color)
- `{{THEME_ACCENT}}` — `--accent` value from selected theme (for icons)
- `{{FOOTER_SOURCES}}` — joined `config.footer_sources[]`

### Step 6 — Update launch.json

Append a new entry to `.claude/launch.json` on the next free port (8081, 8082, …).

### Step 7 — Run definition of done

- [ ] `config.json` validates against `config.schema.json`
- [ ] `data/country_metrics.json` parses; every row has `country_code` (2 chars)
- [ ] Each `config.metrics[].id` exists in at least one data row
- [ ] `theme.css` `:root` block contains all 18 required custom properties
- [ ] No `{{TOKEN}}` placeholders remain anywhere in `projects/<slug>/`
- [ ] `manifest.json` valid (parse + required fields)
- [ ] `sw.js` `PRECACHE` array lists all local files + CDN deps
- [ ] launch.json entry added

### Step 8 — Report

Print:
- Output project path
- Local serve command (`python -m http.server <port> --directory projects/<slug>`)
- Theme summary (`<archetype> · <theme>`)
- Any data validation warnings

## Config Schema Summary

See `template/config.schema.json` for the formal JSON schema. Required top-level fields:

- `name` (string)
- `short_name` (string, slug-safe)
- `brand` (object: `mark`, `tag`)
- `data.countries` (string path)
- `geometry.key` (`"iso2"` for v0.1)
- `geometry.world_atlas` (URL)
- `metrics[]` (array, at least 1)

Optional:
- `data.hubs`, `overlays.hubs`, `footer_sources[]`, `detail_sections[]`, `version`

## Definition of Done (inherits /pwa-build)

- [ ] All `/pwa-build` checklist items pass (manifest, sw, iOS meta, icons, mobile breakpoints)
- [ ] Globe renders all configured metrics in metric switcher
- [ ] Theme tokens visible in DevTools `:root`
- [ ] No globe-explorer-specific strings left in generated project (grep for your brand name = 0 hits unless config sets it)
- [ ] `.claude/launch.json` entry added

## Reference

- Canonical implementation: `projects/country-globe-explorer/` (in the authoring repo)
- Template: `template/` (bundled in this skill)
- Theme selection: the **theme-factory** skill
- Parent skill: **pwa-build**
- DDOS doctrine: `references/ddos-v1.1-dashboard-design-operating-system.md`
