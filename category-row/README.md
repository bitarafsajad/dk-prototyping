# CategoryRow — RTL grid

Right-to-left category grid from the **Components → Category** page in Figma.
Figma can't flow a grid right-to-left, so this layout lives in code.

**Live demo:** open `index.html`, or enable GitHub Pages (Settings → Pages → Deploy from branch → `main` / root).

## The rule

The large item is always **2 × small + gap**, at every width.

```
s = (W − P) ÷ N − g
L = 2s + g
```

| Symbol | Meaning | Value |
|---|---|---|
| W | CategoryRow width | — |
| P | start padding (inline) | 16px |
| g | gap between items (columns and rows) | 8px |
| N | visible columns, including the peek of the next column | 4.35 |

| W | small (s) | large (L) |
|---|---|---|
| 390 (Figma) | 78 | 164 |
| 430 | ≈ 87 | ≈ 182 |
| 600 | ≈ 126 | ≈ 260 |

Item height stays **92px**. Small never goes below **78px**.

## How it works

- `direction: rtl` — the first item starts at the right edge; the row scrolls to the left.
- One CSS grid with **2 rows** and `grid-auto-flow: column dense`, so items fill top → bottom, then the next column.
- Both rows live in **one scroll container**, so they always scroll together.
- Large items come first and use `grid-column: span 2`, so their width is 2 columns + 1 gap automatically.
- The column width comes from the container width with `100cqi` (container query units).

```css
.category-row       { container-type: inline-size; direction: rtl; padding-block: 20px; }
.category-row__grid {
  display: grid;
  grid-template-rows: repeat(2, 92px);
  grid-auto-flow: column dense;
  grid-auto-columns: max(78px, calc((100cqi - 16px) / 4.35 - 8px));
  gap: 8px;
  padding-inline: 16px;
  overflow-x: auto;
}
.cat-item--large    { grid-column: span 2; }
```

## Files

```
index.html               demo page
css/category-row.css     component styles (copy this into your project)
css/demo.css             demo page only
js/demo.js               width slider (demo only)
assets/artwork/          CatArtwork images, @3x PNG
```

## Notes

- **Font:** the design uses **Digikala Medium** (11/16 small, 13/20 large). Load it in your app; the demo falls back to Vazirmatn.
- **Artwork:** small items render artwork at 56×56, large items at 64×64.
- **Browser support:** container query units (`cqi`) — Chrome 105+, Safari 16+, Firefox 110+.
