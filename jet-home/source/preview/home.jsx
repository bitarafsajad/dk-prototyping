import { createRoot } from "react-dom/client";
import { HomePage } from "../src";
const css = `
html, body { margin: 0; height: 100%; background: #fff; overscroll-behavior: none; }
/* the page covers the WHOLE screen, safe areas included (100dvh stops short of the
   bottom inset in iOS home-screen apps → a gray strip showed under the navigation) */
#root { position: fixed; inset: 0; margin: 0; }
/* wider than the 720px column: neutral surround */
@media (min-width: 721px) { html, body { background: #f2f2f2; } }
`;
createRoot(document.getElementById("root")).render(
  <>
    <style>{css}</style>
    <HomePage />
  </>
);
