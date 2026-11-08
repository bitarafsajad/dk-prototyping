# Jetkon

Landing page for **Jetkon (جت‌کن)**, the offline shopping assistant robot. It is a single-page, keyboard-driven presentation that zooms into each part of the robot.

## Slides
1. Intro: the full robot, with the animated ad playing on its body screen
2. Face monitor (مانیتور صورت)
3. Colors (رنگ‌بندی): the head color cycles automatically
4. Ad display (نمایشگر تبلیغات)
5. Product shelves (قفسه‌های کالا)
6. Cleaning system (سیستم نظافت)

## Navigation
- **← / →**: on the first slide either arrow moves forward and becomes the "forward" key for the tour; the opposite arrow goes back. The slides loop.
- **↓ / ↑**: next / previous
- **Swipe**: on touch screens
- Direct links: `#face`, `#colors`, `#display`, `#shelves`, `#cleaning`

## Structure
```
index.html
assets/
  styles.css
  script.js
  fonts/    Digikala Light & Bold (woff2)
  images/   robot photo, head color layers, ad animation + first frame
```
The site is plain static HTML, CSS and JS, with no build step and no dependencies.

## Publish on GitHub Pages
1. Create a new repository on GitHub and upload the contents of this folder (keep `index.html` at the root).
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

## Run locally
Open `index.html` directly, or serve the folder:
```
python3 -m http.server 8000
```
