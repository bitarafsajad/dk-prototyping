import { createRoot } from "react-dom/client";
import { HomePage } from "../src";
const css = `
html, body { margin: 0; height: 100%; background: #fff; overscroll-behavior: none; }
/* the page covers the WHOLE screen, safe areas included (100dvh stops short of the
   bottom inset in iOS home-screen apps → a gray strip showed under the navigation) */
#root { position: fixed; top: 0; left: 0; right: 0; height: 100%; margin: 0; }
/* wider than the 720px column: neutral surround */
@media (min-width: 721px) { html, body { background: #f2f2f2; } }
`;
/* iOS home-screen app (status bar = black-translucent): the page is drawn from the very
   top of the screen, but the layout viewport is reported shorter by the status-bar
   height, so a strip at the bottom stayed uncovered under the navigation. In that mode
   the app always owns the whole screen, so size the page to the screen itself. */
const root = document.getElementById("root");
function fitScreen() {
  const standalone = window.navigator.standalone === true || window.matchMedia?.("(display-mode: standalone)").matches;
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  let h = window.innerHeight;
  if (standalone && ios) {
    const portrait = window.innerHeight >= window.innerWidth;
    const sh = portrait ? Math.max(screen.height, screen.width) : Math.min(screen.height, screen.width);
    if (sh > h) h = sh;
  }
  root.style.height = h + "px";
}
fitScreen();
window.addEventListener("resize", fitScreen);
window.addEventListener("orientationchange", () => setTimeout(fitScreen, 300));

createRoot(root).render(
  <>
    <style>{css}</style>
    <HomePage />
  </>
);
