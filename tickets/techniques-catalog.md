# @webloved — Technique Catalog
### Extracted from 11 reference videos (reverse-engineered, not guessed)

---

## The master mechanic (every single video uses it)

**Scroll-scrub** — the scroll position IS the animation timeline.
Scroll down = play forward, scroll up = play backward. Everything else is a
variation on this one idea.

---

## The 3 "engines" (how the scroll-scrub is actually rendered)

1. **Video scrub** — a video file, scroll controls playback.
2. **Image-sequence scrub** — 100–300 pre-rendered still frames, scroll swaps
   them like a flipbook (crisper than video, instant seek). ← the Apple method,
   and what most of these sites use for smooth rotations/builds.
3. **Real-time 3D / WebGL** — a live 3D scene (Three.js), scroll drives the
   camera or rotates/assembles the model.

---

## The effect catalog (organized)

### A. Depth & space
- **Parallax** — background/mid/foreground layers move at different speeds.
- **Mouse-follow camera** — cursor/trackpad subtly moves the 3D view.
- **3D camera path / first-person glide** — scrolling walks you through a space.
- **3D object rotation on scroll** — a product/model spins as you scroll.

### B. Typography
- **Text reveal on scroll** — type fades/slides in at a scroll depth.
- **Staggered text reveal** — list items appear one-by-one.
- **Kinetic typography** — huge text scales/moves over the 3D scene.
- **Text wipe / mask reveal** — type revealed with a clip/wash effect.
- **Text revealed behind a 3D object** — the model rotates to uncover text.

### C. Color & transitions
- **Background color/gradient shift on scroll** — bg fades between colors.
- **Full-screen color flash** — bold color change between sections.
- **Smooth section transitions** — eased, animated shifts between blocks.

### D. Interactive / hover
- **Card glow on cursor proximity** — cards light up as the mouse nears.
- **Menu highlight follows cursor** — the active highlight slides between items.
- **Hover micro-interactions** — small reactive motion on links/buttons.

### E. Storytelling & data
- **Scrollytelling "build"** — a scene assembles itself as you scroll
  (a room furnishes, a blueprint draws, a product assembles, "ink to keys").
- **Scroll-drawn data viz** — bars/charts draw themselves as you scroll.
- **Number counters** — stats count up when they enter view.

### F. Advanced rendering (shaders)
- **Glow / bloom shaders** — luminous highlights.
- **Particle systems** — floating particles / nebula / starfields.
- **Pixelation post-processing** — pixelated transition on a 3D scene.
- **Glassmorphism** — frosted-glass blur on nav/menu overlays.

### G. Structure & UX
- **Sticky / pinned sections** — content pinned while the background scrolls.
- **Smooth scroll interpolation (lerp)** — weighted, fluid scroll feel.
- **Branded loading screen** — intro loader that sets the tone.
- **Split-screen before/after reveal** — wireframe vs render, before vs after.

---

## The "twists" you noticed (same engine, different angle)

Same image-sequence engine applied to different subjects across the videos:
- room assembling (furniture appears) · blueprint drawing itself ·
  3D bust rotating · product spin · particle nebula · a chevron morphing into a house

Same scroll-scrub master mechanic producing: 3D rotation · camera path ·
color shifts · data-viz drawing · text reveals.

---

## Each video's "signature" (the one effect only it had)

1.  Room that builds itself on scroll (empty shell → furnished)
2.  Scroll-drawn 3D bar chart + card-glow-on-cursor hover
3.  Mouse-follow parallax + 3D product rotating on scroll
4.  Blueprint "draws" itself + split-screen wireframe reveal + number counters
5.  3D ornate column + menu-highlight-follows-cursor
6.  Scrollytelling fashion piece + top-down 3D desk camera glide
7.  Pixelation shader + glowing particle ring + glassmorphism menu
8.  Floating 3D crystals + "start from nothin'" kinetic type
9.  3D bust rotating to REVEAL text hidden behind it
10. A chevron that morphs into a house (image-sequence transform)
11. Branded loading screen + 3D mechanical object + particle nebula

---

## What this means for the ticket site

- We already use **engine #1 (video scrub)** + light parallax.
- The obvious upgrades, in priority order:
  1. **Switch to engine #2 (image-sequence scrub)** — extract our 7s canal
     video into ~120 frames → crisper, buttery-smooth, exactly the Apple look.
  2. **Add mouse-follow camera** — the canal scene subtly shifts as you move
     the mouse (cheap, big "alive" feel).
  3. **Staggered text reveal** for the provider cards.
  4. **Scrollytelling "build"** — e.g. the canal skyline or a boat assembles
     as you scroll into it.
  5. **Card-glow hover** on the provider grid.
