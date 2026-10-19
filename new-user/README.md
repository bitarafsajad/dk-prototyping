# Digikala Supermarket — landing prototype

Responsive landing flow built from the Figma file *Sajad → Landing* (max width 720px).

- Two product-card rows that loop slowly (top → left, bottom → right), with the quantity stepper
  from `dk-prototyping/product-cards` — tap **+** to add to the cart.
- Auto-rotating headline slides (all on the orange background) with a light spring; swipe left/right to change them.
- Phone input (numeric keyboard on phones). The submit button slides up when the field is focused.
  The layout always starts at the top; the input/button bar is sticky at the bottom on a blurred
  white fade, so on short screens (or with the keyboard open) the content scrolls behind it.
- OTP screen (5 digits, SMS autofill, resend timer) → discount screen with a Telegram-style spoiler.
  Tapping the spoiler reveals the code **FAFES** with a confetti burst; tapping the code copies it.

## Run locally

It's a static site — any web server works:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

(Opening `index.html` directly from disk also works.)

## Publish on GitHub Pages

1. Create a new repository on GitHub and upload the contents of this folder
   (or `git init && git add . && git commit -m "Landing" && git push`).
2. In the repository go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. After a minute the site is live at `https://<username>.github.io/<repository>/`.

All paths are relative, so it works from a project subpath. `.nojekyll` stops GitHub from
running Jekyll on the files.

## Structure

```
index.html            markup (the spoiler SVG animation is inline)
css/styles.css        all styles, incl. the quantity stepper
js/app.js             cards, slides, swipe, stepper/cart, keyboard handling, OTP, spoiler
js/celebration.js     Lottie confetti animation data
js/lottie.min.js      lottie-web 5.13.0 (MIT)
assets/images/        product photos (placeImage … placeImage-11)
assets/fonts/         Digikala Regular / Medium / Bold (woff2)
```

## Notes

- The OTP screen is a demo: any 5-digit code is accepted.
- The cart lives in memory (`CART` in `js/app.js`); each change dispatches a `qtychange`
  event with `{ id, qty, cart }` if you want to hook up a real cart.
- Keyboard behaviour (field pushed above the keyboard) should be checked on a real iPhone and Android device.
