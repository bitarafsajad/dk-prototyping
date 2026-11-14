import { createRoot } from "react-dom/client";
import { HomePage } from "../src";
const css = `
html, body, #root { margin: 0; height: 100%; }
body { background: #f2f2f2; overscroll-behavior: none; }
#root { height: 100dvh; }
`;
createRoot(document.getElementById("root")).render(
  <>
    <style>{css}</style>
    <HomePage />
  </>
);
