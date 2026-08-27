# Theme Factory — Catalog Index (v0.2 · for DDOS v1.1)

Machine-readable matrix of archetypes × themes. Consumers parse this table.

**Note (2026-05-28):** Themes MAY declare 6 optional tokens (`--accent-2`, `--gradient-accent`, `--gradient-bg`, `--glass-bg`, `--blur`, `--radius`). Consumers MUST provide fallbacks via `var(--token, fallback)` so legacy flat themes continue working.

| archetype | theme | file | tagline |
|---|---|---|---|
| executive-command-center | ecc-midnight-graphite | themes/ecc-midnight-graphite.css | Near-black graphite with cool steel accent. Restraint over decoration. |
| executive-command-center | ecc-deep-navy-amber | themes/ecc-deep-navy-amber.css | Deep navy with warm amber accent. (Tuned to match an existing globe-explorer palette.) |
| editorial-intelligence-brief | eib-warm-parchment | themes/eib-warm-parchment.css | Warm parchment background, serif display, walnut accent. Magazine pacing. |
| editorial-intelligence-brief | eib-newsprint-ink | themes/eib-newsprint-ink.css | Newsprint cream with ink-black serif. Long-form analytical brief. |
| technical-operations-console | toc-terminal-green | themes/toc-terminal-green.css | Black background, phosphor green, monospace. Terminal/SRE feel. |
| technical-operations-console | toc-amber-monochrome | themes/toc-amber-monochrome.css | Charcoal with amber phosphor monochrome. CRT operations console. |
| modern-saas-analytics | msa-cool-slate | themes/msa-cool-slate.css | Cool slate gray, indigo accent. Polished product UI. |
| modern-saas-analytics | msa-snowfield | themes/msa-snowfield.css | Light snow background, electric blue accent. Bright, modern, clean. |
| data-noir | noir-obsidian-crimson | themes/noir-obsidian-crimson.css | Obsidian black with crimson accent. Investigative, high-contrast. |
| data-noir | noir-blackout-violet | themes/noir-blackout-violet.css | Blackout with electric violet. Cinematic data thriller. |
| institutional-enterprise | ie-corporate-steel | themes/ie-corporate-steel.css | Steel gray, navy accent, accessible AA contrast. Banking/government tone. |
| institutional-enterprise | ie-stable-stone | themes/ie-stable-stone.css | Warm stone background, forest green accent. Established, conservative. |
| vibrant-product-studio | vps-electric-teal | themes/vps-electric-teal.css | Deep teal-emerald with electric cyan gradient. Product studio energy, dark mode. |
| vibrant-product-studio | vps-citrus-daylight | themes/vps-citrus-daylight.css | Warm coral and teal on light base. Energetic daylight mode. |
| glass-aurora | gla-aurora-nebula | themes/gla-aurora-nebula.css | Frosted glass with teal-violet aurora. Glassmorphism dark. |
| glass-aurora | gla-frost-daybreak | themes/gla-frost-daybreak.css | Indigo-pink frosted glass on pale blue. Glassmorphism light. |
| luxe-minimal | lux-espresso-gold | themes/lux-espresso-gold.css | Warm espresso dark with gold jewel accent. Refined editorial luxury. |
| luxe-minimal | lux-pastel-calm | themes/lux-pastel-calm.css | Warm off-white with sage and rose pastels. Soft humanist calm. |

## Mapping rules

- Slug prefix matches archetype short code: `ecc`, `eib`, `toc`, `msa`, `noir`, `ie`, `vps`, `gla`, `lux`.
- File path is always relative to the theme-factory skill root.
- Adding a theme: drop CSS file in `themes/`, append a row here, update the archetype dossier if needed.
