# Search suggestions pop-in

A search page empty state where the suggestion chips pop in with a fast,
randomized spring. Built for low-end Android phones (e.g. older Samsung A series).

**Open `index.html`.** It is the whole page in one file: HTML, CSS, the font
and the icons are all inside it. Upload just that file anywhere (GitHub Pages:
Settings → Pages → Deploy from a branch → `main`, `/ (root)`).

A plain white page: the search bar at the top, the chips under it.
**Tap any white area** to replay. Typing hides the chips; clearing the field pops them back.

## Performance

| | Before | Now |
| --- | --- | --- |
| Requests | 6 | **1** |
| Download (gzipped) | 37 KB over 6 files | **21 KB, one file** |
| First paint (Lighthouse, slow 4G + slow CPU) | 1140 ms | **830 ms** |
| Layout shift | 0 | 0 |
| Tap-to-replay handler (6× slower CPU) | ~9 ms, forces layout | **~3 ms, no layout** |
| Janky frames over 60 replays (6× slower CPU) | 26 | **13** (no-animation control: 4) |

What makes it light:

- **One request.** CSS, font and icons are inlined, so there's no request chain before the first paint.
- **Font subset.** Digikala Medium is cut down to the Persian/Arabic script, digits and punctuation (16 KB instead of 22 KB). It shapes text identically to the full font at 13, 15 and 24px.
- **GPU-only animation.** Only `transform` and `opacity` animate, on the compositor, so the layout never changes.
- **Animations are created once and rewound** through the Web Animations API, so a replay does no style or layout work.
- **A lighter spring curve.** 21 points, within 0.5% of the real spring.

## Old browsers

- **Without `linear()` easing** (Chrome < 113, Samsung Internet < 23): a single-overshoot bezier bounce.
- **Without the Web Animations API:** the CSS keyframes run instead.
- **Without JavaScript:** the chips still pop in once.
- **Forced dark modes** (Chrome, Samsung Internet): blocked with `color-scheme: only light`, so the light design isn't recolored.
- **Reduced motion:** the chips only fade.

## Design fidelity (Figma)

- **Component sizes and positions:** the search field (16, 8, 302×44) and back button (330, 44×44) match Figma exactly.
- **Chips:** within 1.5px of Figma (font rendering).
- **Inner shadow:** drawn over the border box and above the content, as Figma does. Each component is within 0.4% of Figma's pixels.

## Editing

- **Chip text and order:** in `index.html` (RTL reading order, row by row).
- **Spring and timing:** the `--pop-*` tokens in the `<style>` block, plus `POP` and `FADE` in the script.
- **Assets:** `assets/` holds the icon SVGs and the subset font file, for reference. The page uses inlined copies of them.

**Font license:** Digikala is a proprietary typeface. Check that your license
allows redistributing it before publishing this repository publicly.
