---
name: theme-factory
description: DDOS v1.1 archetype + theme selection layer. Presents 9 archetypes and their themes (CSS token files) so dashboard-preview, pwa-build, and pwa-build-globe can resolve a coherent visual identity. Never defaults. Always requires explicit two-layer selection (archetype → theme).
tools: Read
model: sonnet
---

# Theme Factory — DDOS v1.1 Selection Layer

## Purpose

Resolve the visual identity for a dashboard build by walking the user through a **two-layer selection**:

1. **Archetype** (DDOS Layer 2) — one of 9 strategic visual directions
2. **Theme** (DDOS Layer 3) — a concrete CSS token palette within that archetype

This skill is invoked by the **dashboard-preview**, **pwa-build**, and **pwa-build-globe** skills. It is **mandatory** — those skills will not produce output without an explicit theme selection from this skill.

## Hard Rules

- **Never default.** Do not pick an archetype or theme on the user's behalf.
- **Never infer from prompt.** "Make it look executive" is not selection — present the archetype list and require an explicit pick.
- **Two-layer minimum.** Both archetype AND theme must be confirmed.
- **One round-trip.** Use `AskUserQuestion` to present archetype options, then a second `AskUserQuestion` for theme options. Do not ask both at once.

## Workflow

### Step 1 — Present 9 archetypes

Read `archetypes/*.md` (summaries below). Ask via `AskUserQuestion`:

| Archetype | Slug | One-line |
|---|---|---|
| Executive Command Center | `executive-command-center` | Near-black, compact, restrained accents. For C-suite. |
| Editorial Intelligence Brief | `editorial-intelligence-brief` | Warm off-white, serif/sans contrast, narrative pacing. |
| Technical Operations Console | `technical-operations-console` | Monospace, grid-based, severity colors. For SRE/ops. |
| Modern SaaS Analytics | `modern-saas-analytics` | Cool neutrals, refined cards, polished. For PM/analyst. |
| Data Noir | `data-noir` | Ultra-dark, dramatic contrast. Investigative tone. |
| Institutional Enterprise | `institutional-enterprise` | Conservative, accessible, stable. Government/finance. |
| Vibrant Product Studio | `vibrant-product-studio` | Bold saturated colors, rounded cards. For product/growth. |
| Glass & Aurora | `glass-aurora` | Frosted glass, aurora gradients, luminous depth. Premium/modern. |
| Luxe Minimal | `luxe-minimal` | Extreme whitespace, refined neutrals, serif display. High-end calm. |

### Step 2 — Present themes within the selected archetype

Read `INDEX.md` for the archetype's themes (2 per archetype in v0.1). Ask via `AskUserQuestion`. Show each theme's tagline.

### Step 3 — Return the resolved selection

Output (as text in your response):

```
THEME SELECTED
archetype: <archetype-slug>
theme:     <theme-slug>
css_path:  theme-factory/themes/<theme-slug>.css   # relative to the skills root
```

The calling skill consumes these three values.

## Theme Token Contract

Every theme `.css` file MUST declare these **18 required** CSS custom properties at `:root`:

```css
:root {
  /* Background layers */
  --bg-0; --bg-1; --bg-2; --line;
  /* Text */
  --text-0; --text-1; --text-2;
  /* Accent */
  --accent; --accent-soft;
  /* Semantic */
  --good; --warn; --bad; --neutral;
  /* Surfaces */
  --panel-bg; --shadow;
  /* Typography */
  --font-display; --font-body; --font-mono;
}
```

Themes MAY also declare these **6 optional** tokens (added 2026-05-28 for glassmorphism, vibrant, and luxe archetypes):

```css
:root {
  /* Optional tokens (consumers MUST provide fallbacks) */
  --accent-2;        /* Secondary accent / gradient stop */
  --gradient-accent; /* Accent gradient for CTAs, highlights */
  --gradient-bg;     /* Atmospheric background wash */
  --glass-bg;        /* Frosted translucent panel fill */
  --blur;            /* Backdrop-filter blur radius */
  --radius;          /* Corner radius scale */
}
```

**Fallback rule:** Consumers MUST use `var(--token, fallback)` syntax so themes without optional tokens degrade gracefully:
- `var(--accent-2, var(--accent))`
- `var(--gradient-accent, var(--accent))`
- `var(--gradient-bg, none)`
- `var(--glass-bg, var(--panel-bg))`
- `var(--blur, 0)`
- `var(--radius, 8px)`

This ensures all 12 legacy flat themes continue working unchanged. New themes (glassmorphism, vibrant, luxe) declare optional tokens to "light up" enhanced visual treatments.

Consumers (Globe sub-skill, dashboard-preview output) MUST reference only these variables. New themes are added by dropping a new file into `themes/` and adding a row to `INDEX.md`.

## Reference

- DDOS doctrine: `references/ddos-v1.1-dashboard-design-operating-system.md` (bundled at the plugin/repo root)
- Archetype dossiers: `archetypes/*.md`
- Theme catalog: `INDEX.md`

## Definition of Done

- [ ] User saw all 9 archetypes
- [ ] User explicitly picked one archetype
- [ ] User saw all themes within that archetype
- [ ] User explicitly picked one theme
- [ ] Output block printed with archetype slug, theme slug, css_path
