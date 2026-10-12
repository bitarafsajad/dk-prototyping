# Search suggestions pop-in (HTML + CSS)

A search page empty state where the suggestion chips pop in with a fast,
playful, randomized spring. Plain HTML and CSS: no framework, no build step.

**Open `index.html`** with a double-click, or upload the two files anywhere
(GitHub Pages: Settings → Pages → Deploy from a branch → `main`, `/ (root)`).
Keep the `fonts/` and `icons/` folders next to the two files.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The page, icons inline as SVG |
| `styles.css` | All styles and the animation (the demo-frame styles are at the bottom) |
| `fonts/Digikala-Medium.woff2` | Digikala 2.2 Medium, the only weight the design uses (22 KB) |
| `icons/back.svg`, `icons/search.svg` | The two icons from the design system |

## How it works

- **The pop.** Each chip runs two CSS animations: `chip-pop` (scale 0.1 → 1)
  and `chip-fade` (opacity 0 → 1). Only `transform` and `opacity` change, so
  the layout never shifts.
- **The spring.** `--pop-ease` is a `linear()` curve sampled from a real spring
  (stiffness 560, damping 20, mass 0.7): it overshoots to about 1.14× and
  settles in 460ms. Browsers without `linear()` get a single-overshoot bezier.
- **Random timing.** Each chip's delay is its `--d` value. The HTML ships a
  fixed random-looking order; the small script at the bottom of `index.html`
  reshuffles it on every visit.
- **Empty state only.** CSS hides the chips while the field has text
  (`:placeholder-shown` + `:has()`). Clearing the field shows them again, which
  restarts the pop.
- **Replay.** Tap any white area of the page to replay instantly. Nothing
  reloads: the field is cleared and the chips restart with a new random order.
  Taps on the back button, search field or chips don't replay.
- **Reduced motion.** With `prefers-reduced-motion: reduce`, chips only fade.

## Components (matched to Figma)

All three (back button, search field, chips) share one surface:
`surface/secondary` fill, a 1px `border/secondary` stroke drawn inside the box,
and the "Shadow/Button - outline" inner shadow (white 70%, y 4, blur 8).

Figma composites that inner shadow over the *whole* component, including the
border and the content, so the white glow softens the top border. CSS
`box-shadow: inset` can't do that (it sits inside the border, under the
content), so the shadow is drawn on a `::after` layer that covers the border
box and sits on top. Rendered against Figma's own exported SVG filter, each
component is within 0.4% of Figma's pixels.

## The script

The page shows and animates the chips without JavaScript, using the delays in
the HTML. The small script at the bottom of `index.html` adds: tap-the-white-area
replay, a new random order on each visit and replay, and tapping a chip to put
its text in the field.

## Tuning

In `styles.css`, on `.search-page`:

| Variable | Default | Effect |
| --- | --- | --- |
| `--pop-duration` | `460ms` | Length of the spring |
| `--pop-ease` | `linear(…)` | The spring curve; swap for `cubic-bezier(0.34, 1.56, 0.64, 1)` for a simpler bounce |
| `--fade-duration` | `120ms` | How fast each chip becomes visible |

Delay spread lives in the script: `0.06` (start), `0.22` (window), `0.05` (jitter), in seconds.

## Browser support

Chrome/Edge 113+, Safari 17.2+ and Firefox 121+ get the full spring.
Hiding the chips while typing uses `:has()` (Safari 15.4+, Chrome 105+, Firefox 121+).

## Notes

- **Font license:** Digikala is a proprietary typeface. Check that your license
  allows redistributing it before publishing this repo publicly.

- **Font:** Digikala 2.2 Medium is bundled and loaded from `fonts/`. Chips land
  on their Figma positions; a few are 1px narrower than in Figma because this
  font file spaces some glyphs slightly differently. No external requests.
- **Light only:** the page sets `color-scheme: light`, matching the design, so
  dark-mode browsers don't restyle the controls.
- **Content:** the suggestions come from the Figma design, including its repeated "قرص استامینوفن" chip.
