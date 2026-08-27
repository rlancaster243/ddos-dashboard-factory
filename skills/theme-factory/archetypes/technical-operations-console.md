---
slug: technical-operations-console
short: toc
audience: SRE, engineer, on-call operator, data engineer
posture: Monospace, dense grid, severity color carries information.
---

# Technical Operations Console

## Visual posture
Black or near-black backgrounds. Monospace primary (IBM Plex Mono, JetBrains Mono). Grid-based layout. Severity colors do real work: green=healthy, amber=watch, red=fail, blue=info. Terminal-flavored without being kitsch. Status tables and freshness timestamps are first-class.

## When to choose
- Live system health, pipeline status, oncall view
- Reader wants to find what's broken in 5 seconds
- Severity coloring needs to be the primary signal

## When NOT to choose
- Board-facing or external view (use Executive or Editorial)
- Narrative dashboards (use Editorial Intelligence Brief)

## Themes in this archetype
- `toc-terminal-green` — Black terminal with phosphor green.
- `toc-amber-monochrome` — Charcoal with amber phosphor monochrome. CRT throwback.
