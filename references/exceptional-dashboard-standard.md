# Exceptional Dashboard Design Standard
*Governing aesthetic standard for all PWA and web artifact builds. Saved 2026-05-12.*

You are not building a generic AI dashboard.

You are building a premium analytical command interface that feels:
- intentional
- dense but readable
- operationally useful
- visually disciplined
- executive-ready
- closer to Linear, Vercel, Stripe internal tools, Bloomberg terminal clarity, and high-end SaaS analytics than generic dashboard templates

## Core Design Goal

Create dashboards that pass this test:

> A senior operator should immediately feel that this interface was designed by someone who understands both data and decision-making.

## Anti-Generic Rules

Never default to:
- generic white cards on gray background
- four identical KPI cards in a row with random icons
- blue/purple gradient accents
- oversized dashboard titles
- meaningless "Overview" layouts
- fake chart decoration
- vague labels like "Performance" without context
- excessive rounded cards everywhere
- generic sidebar + topbar clone layouts
- random Lucide icons beside every metric

If a card, chart, color, icon, border, or animation does not improve comprehension, remove it.

## Visual Design Doctrine

Use a deliberate visual system.

Preferred directions (each is a named theme in theme-factory):

### 1. Executive Command Center
- dark or near-black background
- dense metric panels
- subtle borders
- restrained accent colors
- compact typography
- status indicators
- sharp hierarchy

### 2. Editorial Intelligence Brief
- warm off-white background
- strong serif/sans contrast
- dashboard reads like an analytical report
- narrative callouts
- section hierarchy
- refined spacing

### 3. Technical Operations Console
- monospace accents
- grid-based layout
- compact panels
- terminal-inspired status language
- clear data freshness indicators
- operational severity colors

### 4. Modern SaaS Analytics
- cool neutral palette
- precise spacing
- refined cards
- strong table/chart integration
- minimal but high-quality motion
- polished enterprise UX

Choose one direction intentionally before coding.

## Typography Rules

Use typography as hierarchy, not decoration.

Avoid default fonts unless intentionally justified.

Recommended fonts:
- Geist
- Space Grotesk
- IBM Plex Sans
- IBM Plex Mono
- Source Sans 3
- Plus Jakarta Sans
- DM Sans
- Sora
- Manrope
- Fraunces or Newsreader for editorial dashboards

Rules:
- KPI values should dominate
- labels should be small and precise
- metadata should be visually quieter
- use tabular numbers where possible
- avoid oversized titles unless dashboard is presentation-facing

## Color Rules

Use color semantically.

Color must mean something:
- green = favorable / healthy
- red = risk / decline
- amber = watch / mixed
- blue/cyan = neutral signal / system
- purple = segmentation or special category only if justified

Never use color merely to make the dashboard "pretty."

Use:
- off-white, not pure white
- near-black, not flat black
- subtle borders
- low-saturation accents
- one primary accent family
- semantic status colors

## Layout Rules

Design for decision flow.

Default dashboard flow:

1. Context strip
   - date range
   - data freshness
   - filters active
   - source/system status

2. Executive signal row
   - 3–5 highest-priority KPIs
   - each with trend, comparison, and status

3. Primary analytical view
   - main trend, funnel, cohort, or geo comparison

4. Diagnostic layer
   - breakdowns explaining drivers

5. Exception layer
   - anomalies, risks, outliers, watch items

6. Detail layer
   - tables, drilldowns, definitions

Do not make every section visually equal. Create hierarchy.

## KPI Card Rules

Every KPI card must include:
- metric name
- metric value
- comparison period
- directional change
- status interpretation
- short driver note when useful

Bad:
"Users: 1.2M +5%"

Good:
"New Verified Users
1.2M
+5.1% WoW
Above recent trend. Growth concentrated in LATAM and Sub-Saharan Africa."

## Chart Rules

Charts must be analytical, not decorative.

Each chart needs:
- clear title
- subtitle explaining what question it answers
- labeled axes
- units
- tooltip
- empty state
- loading state
- benchmark/target line where useful
- annotation for material changes

Avoid:
- unlabeled lines
- random donut charts
- decorative area fills
- too many colors
- charts without interpretation

## Table Rules

Tables are not dumping grounds.

Use tables when precision matters.

Required:
- sticky headers for long tables
- aligned numbers
- compact row height
- sortable columns where useful
- status chips
- subtle row grouping
- clear empty states

## Interaction Rules

Dashboards should feel responsive and precise.

Use:
- subtle hover states
- filter chips
- drilldown panels
- collapsible diagnostic sections
- keyboard-accessible controls
- smooth but restrained transitions

Avoid:
- cinematic animations
- bouncing elements
- scroll gimmicks
- motion that slows analysis

## PWA-Specific Requirements

Every dashboard must include:
- app shell layout
- responsive mobile/tablet behavior
- install-ready structure
- offline fallback
- stale data indicator
- loading skeletons
- error states
- retry actions
- data freshness timestamp
- touch-safe filter controls

## Semantic Layer Rules

Never invent metric definitions.

If definitions are unknown:
- display placeholder metadata clearly
- mark as "definition pending"
- do not pretend certainty

Surface:
- metric definition
- source table/API
- last refreshed
- calculation grain
- comparison period
- known caveats

## Dashboard Personality

The dashboard should feel like:

> a disciplined analyst compressed into an interface

Not:
> a generic SaaS template with charts added

## Final Self-Review

Before completing, evaluate:

1. Would this look generic if the data were removed?
2. Does every visual element serve interpretation?
3. Is the primary decision obvious within 5 seconds?
4. Are the metrics semantically clear?
5. Is the design coherent across cards, charts, filters, and tables?
6. Does it feel like a real internal product, not a demo?
7. Is the PWA behavior accounted for?
8. What is the weakest visual or UX decision, and how was it corrected?

If the dashboard resembles a generic AI-generated layout, redesign it before final output.
