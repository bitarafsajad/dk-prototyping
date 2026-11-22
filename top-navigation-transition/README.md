# TopNavigation — homePage ⇄ homePageScroll

A zero-JavaScript implementation of the Digikala-style home **TopNavigation**: the search field collapses into a circle button and the delivery location rises beside it when the page scrolls past a threshold.

Built from Figma `Components`:
- `977:721` — TopNavigation / homePage (expanded)
- `1378:5184` — TopNavigation / homePageScroll (collapsed)
- `41:464` — Button / ghost / medium / circle (collapsed search button)

## Behaviour

| Scroll position | State |
|---|---|
| `< 32px` | Expanded — full search field (mic, rotating hint, search icon) |
| `≥ 32px` | Collapsed — 44×44 circle button in front of the location |

Crossing the threshold always plays the **full 360 ms transition**; stopping the scroll can never freeze the header half-way. The field compacts into the circle and the location rises **at the same time**; the reverse plays when scrolling back above the threshold.

## How it works (no JavaScript)

1. A scroll-driven animation (`animation-timeline: scroll(root)`) writes a registered integer `--c` on the header: `0` below 32px, `1` from 32px (`steps(1, end)` makes it a hard threshold).
2. Children read it with a container style query `@container style(--c: 1)`. When it flips, normal CSS **transitions** run the collapse/expand.
3. Every animated property is `transform` or `opacity`, so motion runs on the compositor thread:
   - The field width is faked with a rig: two half-circles (clip-path painted inside each moving layer) and a flat gradient band scaled between their centres — no `width` animation, no overflow-clipping layers (these caused black corners on Safari / some Chrome GPU paths).
   - The header height change is a translated white backdrop — no `height` animation.
   - Pixel-exact static field / circle cover the rig at rest; the rig is only visible while moving.
4. The rotating search hint is a pure CSS keyframe loop (800 ms hold + 1250 ms move, 36 px steps).

## Design fidelity

- Fill `#f5f5f5`, 1 px inside stroke `#d6d6d6`, and the *Action / Outline* inner shadow (`0 4 8 #FFFFFFB2`) painted **over** the stroke, as Figma renders it (the top of the border is lighter than the bottom):
  ```css
  box-shadow: inset 0 4px 8px rgba(255,255,255,.7), inset 0 0 0 1px #d6d6d6;
  ```
- Status bar removed; 12 px top padding plus `env(safe-area-inset-top)`.
- Header heights: 132 px expanded, 68 px collapsed. Max content width 480 px.
- Collapsed state shows the `hasScrollDivider` divider (Divider / Type=Medium, no paddings): full-width 1 px `#DAD7D3` (Border/Terra – Secondary) as the header's last row; fades in as the header lands, out at once on expand.

## Browser support

| Feature | Needed for |
|---|---|
| Scroll-driven animations | Threshold trigger — Chrome / Edge 115+, Samsung Internet (Chromium 115+), Safari 26+ |
| Container style queries | Reading `--c` — Chrome 111+, Safari 18+ |
| Container query units (`cqw`) | Width-independent rig — Chrome 105+, Safari 16+ |

Browsers without scroll-driven animations get a fixed, fully expanded header; the page still scrolls normally.

## Fonts

The design uses the proprietary **Digikala** typeface. The page uses it when installed locally and otherwise falls back to **Vazirmatn** (Google Fonts). For exact metrics, self-host the licensed Digikala font with `@font-face` and keep it first in the `font-family` stack.

## Run locally

Open `index.html` directly, or serve the folder:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Publish on GitHub Pages

1. Create a new repository and push these files to the `main` branch.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. The included workflow (`.github/workflows/pages.yml`) deploys on every push to `main`.

## Known limits

- One threshold only (CSS can't do hysteresis); hovering exactly at 32 px can flip back and forth. Two thresholds need a few lines of JS.
- The hint ticker's 18 px window (from Figma) can clip tall Persian glyphs mid-roll; consider a 22–24 px window.
