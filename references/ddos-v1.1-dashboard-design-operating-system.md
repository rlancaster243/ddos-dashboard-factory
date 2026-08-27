# Dashboard Design Operating System / DDOS v1.1

*Governing framework for preview-safe dashboard mockups and production handoff. Companion to `exceptional-dashboard-standard.md`. Saved 2026-05-12.*

## Purpose

DDOS is a reusable strategic framework for creating exceptional preview-safe dashboard templates. It is designed for:
- ChatGPT preview
- single-file HTML dashboard mockups
- rapid theme and skin prototyping
- static mock data
- dropdown filter simulation
- later production build-out in Claude Code

It is **not** designed for first-pass production deployment.

## Prime Principle

Dashboards are not decorative web pages. Dashboards are:
- decision interfaces
- analytical operating systems
- semantic consumption layers
- operational control surfaces
- information compression systems

A dashboard succeeds when it improves: interpretation speed, signal detection, decision quality, semantic clarity, operational confidence.

## Core Workflow Split

```text
ChatGPT Preview = theme laboratory and dashboard mockup engine
Claude Code     = production build and systems implementation engine
```

### ChatGPT Owns
theme ideation · single-file HTML mockups · layout experiments · visual skins · static dashboard previews · filter simulation · executive concept demos

### Claude Code Owns
repo structure · componentization · production PWA behavior · dbt/MCP/BigQuery wiring · real data integration · testing · maintainability

## Architecture Layers

| Layer | Purpose |
|---|---|
| 1. Strategic Intent | Defines dashboard mission |
| 2. Design Archetype | Defines personality |
| 3. Theme System | Defines visual identity |
| 4. Semantic Layout | Defines decision flow |
| 5. Component Doctrine | Defines reusable structures |
| 6. Interaction Layer | Defines behavior |
| 7. Governance Layer | Preserves consistency |

## Layer 1: Strategic Intent

Before generating a dashboard, define:

**Dashboard Type:** Executive Command Center · Operational Monitoring · Analytical Deep Dive · Intelligence Brief · Forecasting Interface · Semantic Explorer · Geo Intelligence · Risk Console

**User Type:** Executive (signal first) · Analyst (diagnostic depth) · Operator (fast scanning) · Engineer (metadata visible) · Strategist (trend/relationship) · Field Team (mobile-first)

**Decision Horizon:** Real-time · Daily · Weekly · Quarterly · Long-term

## Layer 2: Design Archetypes

Choose one dominant archetype.

1. **Executive Command Center** — near-black backgrounds, compact metric panels, restrained accents, premium density. Fonts: Geist, IBM Plex Sans, Space Grotesk, IBM Plex Mono.
2. **Editorial Intelligence Brief** — warm off-white, serif/sans contrast, narrative callouts, refined whitespace. Fonts: Fraunces, Newsreader, Source Sans 3, DM Sans.
3. **Technical Operations Console** — compact grid, monospace accents, severity colors, dense metadata. Fonts: IBM Plex Mono, JetBrains Mono, Geist Mono.
4. **Modern SaaS Intelligence** — cool neutrals, refined cards, strong spacing, polished enterprise UI. Fonts: Plus Jakarta Sans, Manrope, Sora, Geist.
5. **Data Noir** — ultra-dark, dramatic contrast, selective color, investigative mood. Fonts: Cabinet Grotesk, Space Grotesk, IBM Plex Mono.
6. **Institutional Enterprise** — conservative, accessible, stable, predictable, table-friendly. Fonts: Source Sans 3, Noto Sans, IBM Plex Sans.

## Layer 3: Theme System

Centralized CSS custom properties. Themes live in `theme-factory/themes/`. See archetype-to-theme mapping in `theme-factory/archetypes/`.

## Layer 4: Semantic Layout

Default dashboard flow:

```text
1. App shell
2. Navigation / command rail
3. Context strip
4. KPI signal layer
5. Primary analytical view
6. Diagnostic layer
7. Exception layer
8. Detail layer
9. Metric contract layer
10. Loading/offline/error states
```

**Context Strip** — date range, active filters, freshness, source state, grain, caveats, semantic warnings.

**KPI Signal Layer** — each KPI: name, value, comparison period, direction, status, short interpretation.

**Diagnostic Layer** — what changed, why, where movement is concentrated, what is driving variance.

**Exception Layer** — anomalies, underperformance, outliers, contradiction signals, review priorities.

**Metric Contract Layer** — definition, source, grain, comparison logic, caveats, freshness, semantic authority.

## Layer 5: Component Doctrine

**KPI Cards required:** metric name · value · trend · comparison · interpretation · severity. Optional: target · benchmark · confidence · source note.

**Charts required:** question answered · labels · units · semantic meaning · annotation · empty state · loading state.

**Tables required:** aligned numbers · compact row height · status indicators · clear empty state · sortable columns.

**Filters required:** visible labels · clear selected state · Apply behavior · Reset behavior · mobile support.

## Layer 6: Preview-Safe Interaction Doctrine

**Core filter rule:**
```text
Preview filters simulate analytical behavior.
Production filters execute governed semantic queries.
```

**Required filter pattern:**
```text
Filter Panel → Static Mock Data Object → Apply Function → DOM Updates → Visible Dashboard State Change
```

**Default:** Use Apply + Reset (not instant update) for executive-grade dashboards with multiple filters.

**Required filter updates:** At least 1 KPI + 1 trend + 1 context label + 1 table. Better: 2 KPIs + diagnostic note + table + chart/callout.

**Mock data must be:** plausible · internally consistent · clearly marked as mock · small enough for preview · shaped similarly to production.

## Layer 7: Governance

**Semantic governance:** Never invent metric definitions. Never duplicate business logic in frontend. Always show freshness, caveats, definitions. Distinguish mock state from production state.

**Design governance:** Maintain spacing consistency · radius consistency · typography hierarchy · semantic color usage · motion consistency · component reuse.

## Tooling Stack

**Tier 0 (default golden path):** HTML · CSS custom properties · CSS Grid + Flexbox · media queries · inline SVG · CSS shapes · inline JS.

**Tier 1 (safe enhancements):** D3.js CDN · ECharts CDN · GSAP CDN · Lucide CDN.

**Tier 2 (Claude-Code-first):** MapLibre · Three.js · service workers · manifest install · Tailwind build · React/Vite/Next.js · live BigQuery/dbt data.

## Template Generation Flow

1. Pick Dashboard Mission (type · user · horizon · density · semantic depth)
2. Pick Design Archetype (one of 6)
3. Pick Theme (one of 20 in theme-factory)
4. Generate Single-File HTML Preview (app shell · context strip · KPI · primary chart · diagnostic · exception · metric contract · functional filters · mock data)
5. Red-Team for Genericness (see questions below)
6. Claude Code Build-Out (React/Vite · components · dbt/MCP/BigQuery · production PWA · routing · testing)

## Red-Team Check

Before handoff, ask:
- Does this look like a generic SaaS dashboard?
- Are all cards visually equal?
- Are colors merely decorative?
- Is hierarchy obvious in 5 seconds?
- Does the theme have a clear personality?
- Could this become a reusable dashboard family?
- Do filters visibly change the dashboard?
- Is mock state clearly identified?

If generic, redesign before handoff.

## Prototype-to-Production Boundary

| Preview Pattern | Production Pattern |
|---|---|
| Single HTML file | Componentized app |
| CSS variables | Design tokens/theme system |
| Inline mock data | API/semantic query result |
| DOM updates | Component state |
| Static SVG chart | D3/ECharts component |
| Mock freshness | Real freshness metadata |
| Hardcoded definitions | Metric catalog/dbt semantic layer |
| Simulated filters | Governed semantic filters |

## Audit Layer

`dashboard-auditor` (at `~/.claude/agents/dashboard-auditor.md`) is the optional governance/audit pass for any DDOS artifact. Invoke explicitly after `/dashboard-preview` Red-Team Check (Step 4) or before `/pwa-build` production handoff. The auditor never modifies artifacts and never auto-runs — it only evaluates strategic coherence, archetype integrity, theme coherence, semantic governance, interaction integrity, entropy, and production realism, returning the 10-section audit format. Human operator retains final arbitration.

## Final Directive

Build dashboards that feel like *a disciplined analytical organization compressed into an interface*. The goal is preview-safe analytical operating systems with intentional visual identity, reusable theme architecture, functional mock interactions, and clean production handoff.
