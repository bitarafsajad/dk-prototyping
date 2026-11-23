# Modal PDP

Interactive prototype of the ModalPDP component (product carousel modal) on top of a static home screen.

## Files

- `index.html` – the page (loads images and fonts from `assets/`)
- `assets/fonts/` – Digikala Regular, Medium, Bold (woff2)
- `assets/images/` – home screenshot, product images
- `assets/icons/` – fire (promo badge) and cross (close button) icons
- `preview.html` – the same page as one self-contained file (no `assets/` needed), for quick previews
- `.nojekyll` – tells GitHub Pages to serve the files as they are

## Publish on GitHub Pages

1. Unzip, then upload everything inside this folder to the root of your repository (keep `index.html` and `assets/` side by side).
2. Repository **Settings → Pages → Build and deployment**: Source "Deploy from a branch", branch `main`, folder `/ (root)`.
3. Open `https://<username>.github.io/<repository>/`.

## Interactions

- Tap a product in the home screen: the modal opens out of that product's image.
- Swipe left/right (or arrow keys / trackpad): browse products in an endless loop; tap a thumbnail to jump.
- Swipe up, scroll, or tap "بیشتر": the modal expands to full screen.
- Pull down at the top of the full-screen view: back to the modal; keep pulling to close.
- Swipe or scroll down on the modal, tap ✕, or press Esc: closes back into the product's image.
