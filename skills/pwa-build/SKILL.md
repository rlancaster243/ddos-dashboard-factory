---
name: pwa-build
description: DDOS production handoff layer. Converts a validated single-file HTML preview (typically from /dashboard-preview) into a deployable PWA — manifest, service worker, mobile layout, icons, and deployment README. Invoked after preview/theme validation, not as a first-pass build.
tools: Read, Write, Bash
model: sonnet
---

# PWA Build Skill — DDOS Production Handoff

## DDOS Context

This skill operates at the **production layer** of DDOS v1.1. It is invoked **after** a single-file HTML preview has been validated for visual direction, theme coherence, and analytical flow (typically via the **dashboard-preview** skill).

Do not use the **pwa-build** skill for first-pass mockup or theme exploration — that belongs to the **dashboard-preview** skill. This skill assumes the preview is approved and the visual system is locked.

## Mandatory Theme Confirmation

Before producing any PWA output, confirm the theme used in the source HTML matches a theme from `theme-factory/themes/`. If no theme is identified or the source is generic, invoke the **theme-factory** skill and require explicit user selection of both archetype and theme. Never default to any theme.

Optional governance pass: `dashboard-auditor` may be invoked on the validated preview before production conversion. Explicit user request only.

## Trigger

Use this skill when:
- Converting a **validated** HTML dashboard preview to a mobile-installable PWA
- Adding offline support to an existing approved web artifact
- Generating deployment-ready static web app structure for production distribution

## Checklist: Definition of Done

A PWA build is complete when ALL of the following are true:

- [ ] `manifest.json` present and valid (name, short_name, icons, display, theme_color, background_color, start_url)
- [ ] `sw.js` present — registers on page load, caches all static assets on install, serves from cache on fetch
- [ ] `index.html` registers service worker in a `<script>` block before closing `</body>`
- [ ] `index.html` has `<link rel="manifest">` in `<head>`
- [ ] iOS meta tags present (`apple-touch-icon`, `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`)
- [ ] All CDN dependencies listed in `PRECACHE` array in `sw.js`
- [ ] `icon-192.svg` and `icon-512.svg` generated with app color palette
- [ ] Mobile breakpoints tested at 375px (iPhone SE), 390px (iPhone 14), 412px (Pixel 7)
- [ ] Bottom navigation (if multi-section) with 48px touch targets
- [ ] `README.md` with deploy instructions for GitHub Pages, Netlify, and Vercel

## Manifest Template

```json
{
  "name": "App Full Name",
  "short_name": "ShortName",
  "description": "One-line description",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#1a1a2e",
  "theme_color": "#1a1a2e",
  "orientation": "any",
  "icons": [
    { "src": "icon-192.svg", "sizes": "192x192", "type": "image/svg+xml", "purpose": "any maskable" },
    { "src": "icon-512.svg", "sizes": "512x512", "type": "image/svg+xml", "purpose": "any maskable" }
  ]
}
```

## Service Worker Template

```javascript
const CACHE_NAME = 'app-v1';
const PRECACHE = [
  './index.html',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg',
  // Add all CDN URLs here
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
```

## Icon Generation (SVG)

Generate app icons as SVG with:
- Background fill = app `theme_color`
- Centered monogram or symbol (2 letters max)
- Font: system-ui or Arial, white fill
- `viewBox="0 0 512 512"` for 512px; scale down for 192px

## Mobile Layout Rules

1. **Grid collapse**: Any `grid-template-columns` with 2+ columns must collapse to 1 column at `max-width: 640px`
2. **Chart height**: Set explicit `height` on chart containers at mobile (300px max recommended)
3. **KPI tiles**: 2-column grid at mobile minimum
4. **Font scaling**: base 14px at mobile, 13px at desktop (dashboards are data-dense)
5. **Bottom nav**: Fixed bottom bar for sections; `height: 56px`; icons + labels; safe area insets for notched phones
6. **Scrolling**: One scroll axis only; no horizontal overflow; use `overflow-x: hidden` on body

## Deployment README Template

```markdown
# [App Name] — Deployment Guide

## Prerequisites
- Any static file host with HTTPS

## GitHub Pages
1. Create repo, push this folder
2. Settings → Pages → Deploy from branch → main / root
3. Access at https://[username].github.io/[repo]/

## Netlify
1. netlify.com → Add new site → Deploy manually
2. Drag and drop this folder
3. Done — HTTPS auto-provisioned

## Vercel
1. Install: npm i -g vercel
2. Run: vercel --prod
3. Follow prompts

## Local Testing
Open index.html directly OR run: python -m http.server 8080
Then visit http://localhost:8080 (service worker requires localhost or HTTPS)
```

## Versioning

When updating the PWA after initial build:
1. Increment `CACHE_NAME` version string in `sw.js` (`app-v1` → `app-v2`)
2. Update `last_updated` frontmatter in this build record
3. Old cache is automatically cleared on next activate event
