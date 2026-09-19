# پیش‌ویزیت — Pre-visit intake

A Persian pre-visit triage chat, implemented from Figma. Static PWA: no build
step, no dependencies, no external requests. The IRANYekanX font and all icons
are embedded in `index.html`.

## Files

    index.html              the whole app
    manifest.webmanifest    PWA metadata
    sw.js                   service worker (offline + installability)
    icons/                  app icons
    .nojekyll               tells GitHub Pages to serve files as-is

## Publishing with GitHub Pages

Settings -> Pages -> Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
The site appears at `https://<user>.github.io/<repo>/` within a minute or two.

Paths are all relative, so serving from a repo subpath works without changes.

## Updating

After editing `index.html`, bump `CACHE` in `sw.js` (`previsit-v3` -> `previsit-v4`).
Installed copies serve from cache until that name changes.

## Installing to a home screen

- Android / Chrome: an install prompt appears once the service worker registers.
- iOS / Safari: Share -> Add to Home Screen (iOS reads the `apple-*` meta tags,
  not the manifest).
- Desktop Chrome / Edge: install icon in the address bar.

Requires HTTPS, which GitHub Pages provides.
