# Digikala Jet — Home page (Figma → React)

A pixel-perfect, production-style implementation of the **Digikala Jet home page** and the
component kit it is built from, translated from the Figma design files into React + plain CSS.

- **Live page:** `index.html` (GitHub Pages → `https://<user>.github.io/<repo>/jet-home/`)
- **All components & states:** `components.html`
- Mobile-first, RTL (Persian), responsive up to **720 px**, iOS safe-area aware, PWA-ready.

---

## Contents

1. [Quick start](#quick-start)
2. [Publishing on GitHub Pages](#publishing-on-github-pages)
3. [Folder structure](#folder-structure)
4. [The home page](#the-home-page)
5. [Components](#components)
6. [How the work was done](#how-the-work-was-done)
7. [Design decisions & deviations](#design-decisions--deviations)
8. [Accessibility & performance](#accessibility--performance)
9. [Known limitations](#known-limitations)
10. [Figma sources](#figma-sources)

---

## Quick start

The folder is **already built** — the site files sit at the top, the code in `source/`.

```bash
cd source
npm install
npm run build              # rebuilds the site into the folder above (../)
npm run serve              # preview at http://localhost:3000 (pages use ES modules → open them over http, not file://)
npm run build:standalone   # optional: single-file pages in ../standalone/
```

Use the components in your own React app:

```jsx
import { HomePage } from "./source/src";

export default function App() {
  return <div style={{ height: "100dvh" }}><HomePage /></div>;
}
```

Requirements: Node ≥ 18 to build. The components are written against the React 18 API; the
published site is built with **Preact** (`preact/compat`, ≈4 KB instead of ≈130 KB) via build
aliases, plus `lottie-web` for the shopping assistant (loaded lazily).
Styling is plain CSS imported next to each component — no Tailwind, no CSS-in-JS.

## Publishing on GitHub Pages

Drop the whole `jet-home/` folder into a repository whose Pages site is served from the branch
(**Settings → Pages → Deploy from a branch → `main` / root**), commit and push. That's it:

- Home page: `https://<user>.github.io/<repo>/jet-home/`
- Components: `https://<user>.github.io/<repo>/jet-home/components.html`

All URLs are relative, so the folder works at any depth and under any repository name.

## Folder structure

```
jet-home/
  index.html               home page (HTML shell, CSS inlined, one deferred script)
  components.html          every component & state
  assets/                  content-hashed JS, images (WebP/PNG) and Digikala fonts
  icons/                   app / Apple touch icons, favicon, social preview image
  manifest.webmanifest     PWA manifest
  .nojekyll                serve files as-is (no Jekyll processing)
  README.md
  source/
    package.json, build.mjs
    preview/               entry points of the two pages
    src/
      index.js             public exports
      shared/  fonts/      squircle maths, Digikala fonts
      HomePage/            page: scroll states, compact header, safe areas
      Pillars/ TopNavigation/ Category/ Banner/ Carousel/
      ProductCard/ Thumbnail/ Counter/ Price/ Badge/ BottomNavigation/
```

**Add to Home Screen (PWA):** open the site in Safari → Share → *Add to Home Screen*. It opens
full-screen with a translucent status bar and switches to the home-screen safe-area rules.

## The home page

`<HomePage />` stacks: **Pillars** (fixed) → **content card** that scrolls inside itself
(TopNavigation with the live rain sky, Category V3, Banner, five product Carousels) → **BottomNavigation**
with the assistant.

### Scroll states (Figma frames 2073:6867 / 7548 / 11899)

| State | Trigger | Pillars | Content card | Header |
|---|---|---|---|---|
| **Top** | scrollTop ≤ 4 px | default (82 px) in a white sheet with 24 px rounded bottom | 8 px below on black, 24 px rounded top + 1 px white 24 % top stroke | — |
| **Scrolling down** | moving down ≥ 6 px | slide up out of the frame | moves up to the safe area, corners square | compact header |
| **Scrolling up** | moving up ≥ 6 px | compact (44 px) | below the compact Pillars | compact header |

- Direction changes under 6 px are ignored, so the state never flickers.
- **Leaving** (to "down") uses a slower 720 ms, gentle-start curve so the Pillars visibly slide out with
  the content pushing them; everything else uses 460 ms `cubic-bezier(0.32, 0.72, 0, 1)` (iOS sheet
  curve). All moving parts share the same timing; only `transform`/`opacity` animate where possible.
- The Pillars keep the shape they had when they start leaving (no resize mid-slide).

### Compact header (scroll-linked, not timed)

The header follows the finger, so it is correct at any scroll speed:

1. `scrollTop 0 → 76` — the search pill rides up with the content (it *is* the page's search
   field, handed over the instant the page moves); the sky and location scroll beneath; the header
   background fades to white over the last 40 px.
2. At **76 px** the pill reaches the header slot (8 px from the top) and parks there.
3. `76 → 136` — the pill shrinks from full width into the 52 px ghost circle (glass → `#F5F5F5`,
   magnifier slides to the centre) while the black "تحویل به محل‌کار" slides in.

**Never stuck half-way:** if scrolling stops inside the transition (scrollTop 1–135) and no
finger is on the screen for 180 ms, the page finishes the move the user started — down to the
circle state (136 px) or back up to the top (0) — with a smooth scroll, so the header always lands
in a real Figma state.

Values are written straight to CSS custom properties from a `requestAnimationFrame` scroll handler
(no React re-render per frame).

### Safe areas

| Context | Top | Bottom |
|---|---|---|
| Safari tab | `env(safe-area-inset-top)` (status bar as reported by iOS) | **0** — the bar sits on Safari's toolbar |
| Home-screen app (PWA) | `env(safe-area-inset-top)` | `env(safe-area-inset-bottom)` under the tabs |

Standalone mode is detected with `@media (display-mode: standalone)` **and**
`navigator.standalone` (older iOS). Override with `safeTop` / `safeBottom` props if needed.

### Responsive

Everything is fluid up to **720 px**; wider screens centre a 720 px column. The Category block
scales up (CSS `zoom`) to fill wide containers and never shrinks below the Figma size; banners stay
within Figma's 328–360 px card limits.

## Components

| Component | Highlights |
|---|---|
| **Pillars** | Default ↔ compact variants with animated height; active pill `#ED1944`; horizontal RTL scroll; keeps the active pill in view. |
| **TopNavigation** | Live code-drawn rain sky (canvas): randomized cloud "conveyor belts" in 3 depth layers + rain streaks; Figma overlay gradient; glass search field (68 % white, 6 px backdrop blur, gradient 1 px inside stroke, inner + drop shadow); swappable `background` prop for other weather. |
| **Category** | V1 (96×96), V2 (72×80, tilted art) and **V3** (64×80 pastel tiles + 136×80 wide "سوپر‌های محل" / "هایپر مارکت" tiles) with per-card image geometry from Figma; both rows in one scroller; scales to fill wide screens. The home page uses **V3**. |
| **Banner** | Transform-based carousel (no native horizontal scrolling, so it behaves the same on iPhone/WebKit, Android and desktop): infinite loop, auto-advance every 2.5 s, swipe with pointer events (`touch-action: pan-y` keeps vertical page scroll native), pauses while dragging / off-screen / hidden tab. |
| **Carousel** | Default (white) and Promotion (colour band with Figma's exact wave edges, reproduced from Figma's own SVG pattern export), single / double line, optional artwork, countdown heading. |
| **SectionHeading** | Title + trailing chevron, description, live `hh:mm:ss` countdown in Persian digits. |
| **ProductCard** | No-background / white-background, price-only, text badge, discount badge, responsive 112–184 px, equal-height mode for promotion rows. |
| **Thumbnail** | Figma corner smoothing (radius 24, 60 %) via a squircle path, radial gray overlay, 1 px inside stroke. |
| **Counter** | Float & fixed; add → stepper expand with a spring (`linear()` easing), number roll, idle → compact amount circle, two-dot loader from Figma motion data, max state. |
| **Price** | RTL / LTR, discount wave highlight (Figma pattern), −5° red strike, out of stock, pending; Persian digits + `٬` separators. |
| **Badge** | Lime squircle discount badge (general / amazing) with Figma's exact gradient geometry; grey text badge. |
| **BottomNavigation** | Simple & assistant variants; Lottie assistant (blink, look around, hop — horizontal travel and label removed from the JSON), linear pulse rings every 3 s, light red under-shadow, white gradient scrim. |

## How the work was done

1. **Reading the design.** Every component was pulled from Figma with the MCP tools:
   `get_design_context` for structure, then a custom **layer dump** (via the Plugin API) of every
   variant: auto-layout direction/padding/gap/alignment, sizing, fills (solid, gradient transforms,
   image crops, patterns), strokes (weight, alignment, per-side), effects (shadows, background /
   progressive blur), corner radius + smoothing, text styles and truncation. Icons, the toman sign,
   wave tiles and loaders were exported as **SVG straight from Figma**; motion came from
   `get_motion_context`.
2. **Translating faithfully.**
   - Figma gradient transforms were inverted to exact SVG/CSS gradient end points.
   - Corner smoothing uses a port of the Figma squircle algorithm (rendered as SVG paths/clip paths).
   - Inside strokes use inset shadows or 2 px strokes clipped to the shape; background blur
     radius maps to CSS `blur(r/2)`.
   - RTL was handled explicitly (Figma auto-layout is LTR: `MAX` = right).
3. **Assets.** Uploaded images were checked, cropped and compressed (WebP, 3× for retina). Fake
   checkerboard "transparency" baked into some cloud JPEGs was removed by measuring the checker
   pattern and un-premultiplying the colour, giving true alpha.
4. **Verification.** Each component was rendered in headless Chromium and **measured against the
   Figma coordinates** (positions, sizes, heights), screenshotted at 2–4× and compared with Figma
   screenshots; animations were paused at set times to inspect intermediate frames.
5. **Iteration.** Visual details were refined from review feedback (blur strength, seams, wave
   edges, timing of the Pillars exit, the search-field hand-off, safe areas, responsiveness).

## Design decisions & deviations

- **Sky** is drawn live in code (not a video) so the weather can change at runtime; the cloud images
  were re-keyed to true transparency. The location area's progressive blur was removed because it
  smeared the live rain.
- **Bottom of the sky** dissolves before the header edge and the search field's shadow is not
  clipped, so there is no seam between the search field and the categories.
- **Promotion carousel "شگفت‌انگیز"** uses the double-line variant **with titles** (on request).
- **Assistant** is ~12.5 % larger than the 72 px Figma frame (on request) and the JSON's horizontal
  travel and label are removed.
- **Pillars scroll rule:** down → hidden, up → compact, top → default.
- **Product data** is sample data (names, sizes, prices) — the production site blocks automated
  access. Replace `source/src/Carousel/demoData.js` with real data.

## Accessibility & performance

Page weight (published site):
- Home page JS ≈ 88 KB (≈29 KB gzipped) — Preact instead of React; the Lottie player and the
  assistant animation are split into a separate chunk loaded after the page is idle.
- Images are WebP sized for 2–3× screens; fonts are WOFF2 only and preloaded; CSS is inlined.
- Everything outside the HTML has a content hash in its name, so repeat visits come from cache.

Load size (home page): **~70 KB of JavaScript (gzipped)** on first load, images and fonts on top —
down from a single 2.5 MB page:
- Images re-encoded to WebP at their display resolution (category/pillar art 3×, banners 2×,
  product photos 3× of 104 px, clouds 560 px): 1.4 MB → 0.58 MB.
- The Lottie player and the assistant animation (~300 KB) are split into a lazy chunk that loads
  when the browser is idle; a CSS ball stands in until then.
- Only WOFF2 fonts (WOFF fallbacks dropped), preloaded; below-the-fold images lazy-load.
- Hashed file names → GitHub Pages / browsers cache everything long-term.

Header transitions (scroll up → top) are compositor-only:
- The default and compact Pillars are two layers that cross-fade (outgoing clears first, incoming
  follows — no overlapping text), instead of animating heights of every pill.
- The white sheet behind them slides (transform) instead of animating its height.
- Idle steppers no longer run their hidden loader animation.
- Result in a scroll test: p95 frame time 16.8 ms, from 33 ms.

The white compact header casts **X 0 · Y 2 · Blur 16 · #000 8 %**, fading in with the header.

Scrolling performance (fix for blinking / lag while scrolling):
- Scroll-linked header values are written to the **header element only**, not the page root, so a
  scroll frame never restyles the whole page.
- The page content is **memoised**: scroll-state changes re-render only the chrome.
- Corner radii no longer animate (a black backdrop layer fades instead), removing clip repaints.
- Redundant backdrop blurs over scrolling content were removed (card steppers on white images,
  bottom-nav scrim).

- Semantic buttons/links with Persian `aria-label`s; focus-visible outlines.
- `prefers-reduced-motion` respected everywhere (instant state changes, static sky / assistant).
- Animations paused when off-screen or when the tab is hidden (sky, banners, assistant).
- Scroll handling is passive + `requestAnimationFrame`; animated properties are `transform` /
  `opacity` where possible.

## Known limitations

- Safe-area behaviour was verified with simulated insets; test on a real iPhone (Safari + home
  screen) before release.
- CSS `zoom` (Category scaling on wide screens) needs Firefox ≥ 126; older Firefox shows the
  unscaled rows.
- Pages use ES modules, so they must be served over http(s) (GitHub Pages, `npm run serve`);
  opening `index.html` straight from disk won't run the scripts.

## Figma sources

| Item | File | Node |
|---|---|---|
| Home (top / down / up) | Home-Page | 2073:6867 · 2073:7548 · 2073:11899 |
| Home — category version (final) | Home-Page | 2117:16941 |
| Category V3 | Home-Page | 2117:16267 |
| TopNavigation | Home-Page | 2059:6485 |
| Category | Home-Page | 2058:6482 |
| Banner | Home-Page | 2064:6651 |
| Bottom navigation / assistant | Home-Page | 2070:6835 · 2070:6797 |
| Pillars | Components | 1034:5764 |
| Carousel | Components | 43:660 |
| ProductCard | Components | 43:3786 |
| Counter · Thumbnail · Price · Badge | Components | 0:1 · 6:2687 · 438:6121 · 43:494 |

Files: `Home-Page` = `msNqpdoPG1kqVBpKNoMVt9`, `Components` = `cS9U9qcCJZGv2RdBE5iNUr`.
