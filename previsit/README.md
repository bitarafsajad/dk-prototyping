# پیش‌ویزیت — PWA bundle

Static files. Upload the whole folder, keeping the structure, to any HTTPS host.

    index.html
    manifest.webmanifest
    sw.js
    icons/

## Requirements

- **HTTPS is mandatory.** Service workers and install prompts do not run over
  plain HTTP (localhost is the one exception, for testing).
- Serve the folder at its own path or domain root. `start_url` and `scope` are
  relative (`./`), so a subfolder works fine.

## Installing

- **Android / Chrome** — an "Install app" prompt appears once the service
  worker registers. Also available under the browser menu.
- **iOS / Safari** — Share -> Add to Home Screen. iOS ignores the manifest and
  reads the `apple-*` meta tags in `index.html` instead.
- **Desktop Chrome / Edge** — install icon in the address bar.

## Updating

Replace `index.html`, then bump `CACHE` in `sw.js` (e.g. `previsit-v2`).
Without that bump, installed copies keep serving the cached old version.

## Swapping the icon

Replace the four PNGs in `icons/`, keeping the filenames and pixel sizes.
`icon-maskable-512.png` must keep its artwork inside the middle 80% — Android
crops it to a circle on some launchers.
