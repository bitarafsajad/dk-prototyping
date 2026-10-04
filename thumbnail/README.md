# Squircle product thumbnail

A product image thumbnail with **24px corner radius and 60% corner smoothing**, matching Figma's "iOS" corner smoothing. Pure HTML and CSS — no JavaScript, no dependencies.

![Preview](docs/preview.png)

Figma source: `Components › image/Default` (node `6:2713`).

## Usage

Copy `src/squircle-thumb.css` into your project (it is self-contained), then:

```html
<link rel="stylesheet" href="src/squircle-thumb.css">

<div class="sq-thumb">
  <img class="sq-thumb__img" src="product.jpg" alt="Product name">
</div>
```

Other sizes (minimum 78px):

```html
<div class="sq-thumb" style="--sq-size: 200px">…</div>
```

## How it matches Figma

Layers, bottom to top:

| Layer | Spec |
|---|---|
| Background | 128×128, `#FFFFFF`, clipped to the smoothed shape |
| Image | 104×104 at 12px inset, `object-fit: cover`, not rounded |
| Gray bg | `radial-gradient(57.03% 50% at 50% 50%, rgba(47,43,37,0) 0%, rgba(47,43,37,.06) 100%)` |
| Border | 1px inside stroke `#EFEEEB`, drawn on top |

## How it works

CSS `border-radius` can only draw circular corners, so the smoothed shape is built from small SVG pieces:

- `src/svg/mask-*.svg` — four 39×39 corner tiles used as a CSS mask. The straight middle is filled with `linear-gradient`, so the component can be any size without distorting the corners.
- `src/svg/border-*.svg` — four corner tiles for the curved 1px border, drawn as backgrounds so the mask can't clip them. Straight border edges are CSS gradients.

## Browser support

Uses `mask` with the `-webkit-mask` prefix, so it works in current browsers and older iOS Safari and Android Chrome. Browsers without mask support fall back to a normal 24px `border-radius` with the same layers.

## Notes

- The border color is set inside the embedded border SVGs. To change it, edit `src/svg/border-*.svg` and re-embed them in the CSS.
- The corner SVGs are embedded in the CSS as data URIs, so `squircle-thumb.css` works on its own. `src/svg/` holds editable copies for reference.
- Masks clip `box-shadow`. For a shadow, wrap the thumbnail and use `filter: drop-shadow(...)` on the wrapper.

## Demo

Open `index.html` in a browser, or enable GitHub Pages (Settings → Pages → Deploy from branch → `main` / root) to view it online.
