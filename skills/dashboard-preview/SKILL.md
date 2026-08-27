---
name: dashboard-preview
description: DDOS v1.1 preview pipeline. Generates a single-file HTML dashboard mockup with static mock data, simulated filters, theme-driven visual identity, and full semantic layout. Use for theme experimentation, executive concept demos, and pre-production visual validation — never for live data wiring.
tools: Read, Write
model: sonnet
---

# Dashboard Preview Skill — DDOS v1.1 Preview Pipeline

Generates a **single-file HTML dashboard preview** following the Dashboard Design Operating System (DDOS v1.1). The output is preview-safe: static mock data, inline JavaScript filter simulation, no build step, no backend dependency.

This is the **theme laboratory** layer. Once the preview is validated, hand off to the **pwa-build** skill for production deployment.

## Mandatory Workflow

### Step 0 — Strategic Intent (DDOS Layer 1)

Before generating, ask the user to define:

1. **Dashboard Type** — Executive Command Center · Operational Monitoring · Analytical Deep Dive · Intelligence Brief · Forecasting · Semantic Explorer · Geo Intelligence · Risk Console
2. **User Type** — Executive · Analyst · Operator · Engineer · Strategist · Field Team
3. **Decision Horizon** — Real-time · Daily · Weekly · Quarterly · Long-term
4. **Mock Data Subject** — what data domain the preview should illustrate

Do not proceed without all four.

### Step 1 — Archetype + Theme Selection (DDOS Layers 2–3)

Invoke the **theme-factory** skill:
- Present all 9 archetypes — wait for explicit selection
- Present themes within selected archetype — wait for explicit selection
- Never default. Never infer.

### Step 2 — Generate Single-File HTML Preview

Produce ONE complete `.html` file containing:

**Required sections (DDOS Layer 4 — Semantic Layout):**
1. App shell with theme-driven CSS custom properties at `:root`
2. Navigation / command rail (theme-appropriate)
3. **Context strip** — date range · active filters · freshness timestamp · source · grain · "MOCK DATA" indicator
4. **KPI signal layer** — 3–5 KPIs with: name · value · comparison · direction · status · short interpretation
5. **Primary analytical view** — main trend, funnel, cohort, or geo chart (inline SVG or ECharts CDN)
6. **Diagnostic layer** — breakdown explaining drivers of primary KPI
7. **Exception layer** — anomalies, outliers, watch items (table or callout list)
8. **Metric contract layer** — definitions · source · grain · caveats · freshness for each KPI
9. **Loading/offline/error state stubs** (visual treatment only, since this is preview)

**Required components (DDOS Layer 5):**
- KPI cards with all six required fields
- Charts with title · subtitle (question answered) · labels · units · annotation
- Tables with aligned numbers · status indicators · compact rows · empty state
- Filters with visible labels · selected state · Apply + Reset

**Required interaction (DDOS Layer 6 — Preview-Safe):**
- Static mock data object in inline JavaScript
- Apply function that updates: at least 1 KPI + 1 trend + 1 context label + 1 table
- Reset function returning to default state
- Filter pattern: `Filter Panel → mockStates object → applyFilters() → DOM updates → visible state change`

**Required governance markers (DDOS Layer 7):**
- "MOCK DATA — Preview Only" badge always visible
- Each metric shows definition (placeholder OK, but explicit)
- Freshness timestamp visible (mock value clearly marked as such)

### Step 3 — Tooling Constraints

**Tier 0 (default):** HTML · CSS custom properties · CSS Grid + Flexbox · media queries · inline SVG · inline JS.

**Tier 1 (allowed via CDN if needed):** D3.js · ECharts · GSAP · Lucide.

**Forbidden in preview:** React/Vite/Next.js · service workers · manifest install · Tailwind build · live data · BigQuery · dbt · MCP · auth flows · local file reads.

### Step 4 — Red-Team Check Before Handoff

Before showing the preview, evaluate honestly:

- [ ] Does this look generic if the data were removed?
- [ ] Are all cards visually equal? (Should not be — hierarchy required)
- [ ] Are colors merely decorative? (Should not be — semantic only)
- [ ] Is the primary decision obvious in 5 seconds?
- [ ] Does the chosen theme have a clear personality?
- [ ] Do filters visibly change the dashboard?
- [ ] Is mock state clearly identified?

If any answer fails, redesign before output.

### Step 5 — Production Handoff

After user validates the preview, hand off to the **pwa-build** skill for production deployment. State explicitly: "Preview validated. Ready for pwa-build handoff."

Optional: invoke `dashboard-auditor` agent (`.claude/agents/dashboard-auditor.md`) for full DDOS governance audit before handoff. Use `Agent(subagent_type: "dashboard-auditor")`. Explicit user request only — never auto-run.

## File Output

- Single `.html` file
- File path convention: `projects/<project-name>/previews/YYYY-MM-DD-<dashboard-name>-preview.html`
- Or `sandbox/previews/<dashboard-name>.html` for experimental work

## Mock Data Pattern

```javascript
const mockStates = {
  all: {
    label: 'All Hubs',
    kpis: { nvu: '1.28M', nvuTrend: '+6.4% WoW', nvuClass: 'trend-good' },
    rows: [
      ['Mexico Hub', 'healthy', '+9.3%', 'good'],
      ['Germany Hub', 'watch', '-1.8%', 'warn']
    ],
    diagnostic: 'Growth concentrated in LATAM.'
  },
  latam: { /* filtered state */ },
  emea:  { /* filtered state */ }
};

function applyFilters() {
  const region = document.getElementById('regionFilter').value;
  const state = mockStates[region];
  document.getElementById('nvuMetric').textContent = state.kpis.nvu;
  document.getElementById('nvuTrend').textContent = state.kpis.nvuTrend;
  // ... update other DOM nodes
}
```

## Prototype-to-Production Boundary

| Preview (this skill) | Production (`/pwa-build`) |
|---|---|
| Single HTML file | Componentized app |
| CSS variables | Design tokens / theme system |
| Inline mock data | API / semantic query result |
| DOM updates | Component state |
| Inline SVG charts | D3 / ECharts components |
| Mock freshness | Real freshness metadata |
| Placeholder definitions | dbt semantic layer / metric catalog |
| Simulated filters | Governed semantic filters |

## Reference

- DDOS doctrine: `references/ddos-v1.1-dashboard-design-operating-system.md`
- Exceptional dashboard standard: `references/exceptional-dashboard-standard.md`
- Theme + archetype selection: the **theme-factory** skill
- Production handoff: the **pwa-build** skill

## Definition of Done

- [ ] All 4 Strategic Intent inputs collected
- [ ] Archetype + theme explicitly selected via the theme-factory skill
- [ ] Single-file HTML with all 9 DDOS Layer 4 sections
- [ ] Mock data clearly marked, filters functional, state changes visible
- [ ] Red-team check passed
- [ ] File saved to correct project/preview path
- [ ] Production handoff statement included in summary
