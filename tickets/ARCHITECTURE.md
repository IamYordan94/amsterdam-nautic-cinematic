# VAART — The Harbor
### Architecture · v2 (the "best reseller in NL by design" edition)

## Concept

One journey: **loader → canal glide → 3D harbor → book.**
The site is the Amsterdam evening: you fly through the canal (image-sequence
scroll-scrub), arrive in a golden-hour 3D harbor where every provider is a real
3D boat shaped by its category. Hover a boat → it glows and lifts. Click →
rich card. Filters dim the harbor to one fleet.

## Page map

1. **Loader** — VAART wave glyph draws itself + "Amsterdam · boottickets".
2. **Hero (scroll-scrub)** — canal glide as an image-sequence (crisp frames,
   extracted from canal-hero.mp4). Scroll = glide. Mouse = subtle parallax.
   Headline "Vaar mee." + scroll hint. Ends by dissolving into the harbor.
3. **Harbor (3D/WebGL)** — 25 providers as 3D boats, 5 archetypes by group:
   - klassiek → long glass-roof saloon boat
   - open → low open sloop with benches
   - zelf → small self-drive boat with outboard
   - diner → elegant yacht, warm candle-lit cabin
   - natuur → slim wooden nature boat
   Golden-hour water + fog. Mouse orbits camera (subtle). Hover glow + lift.
   Click → card. Category filter dock dims other fleets + eases camera.
4. **Provider card** — name, category badge, tagline, price, "Boek ticket".
5. **Panel** — full 25-provider list (fallback browsing).
6. **Footer** — Amsterdam Nautic tie-in.

## Tech

- Three.js (ES module via importmap, three@0.160) — harbor scene.
- Canvas + frame sequence — hero scrub (frames/ dir, WebP).
- GSAP + ScrollTrigger — scrub driving, reveals, pinning.
- No build step; static files on GitHub Pages.

## File map

```
tickets/
├── index.html          (page shell, HUD, loader, sections, importmap)
├── css/style.css       (all styling — warm cream/ink/coral/teal)
├── js/
│   ├── providers.js    (CANONICAL data: PROVIDERS + GROUPS + GROUP_ORDER)
│   ├── harbor.js       (subagent 1: createHarbor({container, onSelect}))
│   ├── scrub.js        (subagent 2: createScrub({container, count, basePath}))
│   └── main.js         (integration: loader, scrub wiring, harbor mount,
│                        card, panel, filters, mouse parallax)
└── video/
    ├── canal-hero.mp4  (source)
    └── frames/         (subagent 2: frame-0001.webp ... frame-NNNN.webp)
```

## Contracts

- `providers.js` exports `PROVIDERS` (25 × {name,cat,tag,price,group}),
  `GROUPS` (group → {label,color}), `GROUP_ORDER` (5 groups).
- `harbor.js` exports `createHarbor({container, onSelect})` →
  `{ setFilter(group|null), resize(), dispose() }`.
- `scrub.js` exports `createScrub({container, count, basePath})` →
  `{ ready: Promise, setProgress(0..1), dispose() }`.
- `main.js` wires ScrollTrigger → `setProgress`, harbor `onSelect` → card.

## Design tokens

- cream #f7ead8 · paper #fff8ec · ink #2a2018 · coral #c6533a ·
  teal #6aa79c · gold #d8a13a · wine #8a3b5c · sage #7d9a6a
- Fonts: Bricolage Grotesque (display) + Space Mono (labels)
- NO Playfair/Inter/dark-navy-gold (user banned the AI-template look)
