// Production build for GitHub Pages → ../ (the jet-home/ folder)
//   docs/index.html          Home page
//   docs/components.html     every component & state
//   docs/assets/*            hashed JS / CSS / images / fonts (long-cacheable)
//   docs/manifest.webmanifest, icons, .nojekyll
// Pass --inline to also emit single-file pages (docs/standalone/*.html).
import { build } from "esbuild";
import fs from "fs";
import path from "path";

const OUT = "..";                       // the site is published from the folder above (jet-home/)
const inline = process.argv.includes("--inline");

fs.rmSync(path.join(OUT, "assets"), { recursive: true, force: true });
for (const f of fs.readdirSync(OUT)) if (/^(index|components)-[A-Z0-9]+\.js$/.test(f)) fs.rmSync(path.join(OUT, f));
fs.mkdirSync(path.join(OUT, "assets"), { recursive: true });

const HEAD = (title, desc) => `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#ffffff">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="دیجی‌کالا جت">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="icons/og-image.png">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">`;

// Preact (≈4 KB) stands in for React (≈130 KB) — same API via preact/compat.
const alias = {
  "react": "preact/compat",
  "react-dom": "preact/compat",
  "react-dom/client": "preact/compat/client",
  "react/jsx-runtime": "preact/jsx-runtime",
};

const common = {
  alias,
  bundle: true, minify: true, target: ["es2020", "safari15"], legalComments: "none",
  jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' }, logLevel: "error",
};

const PAGES = [
  { entry: "preview/home.jsx", html: "index.html", title: "دیجی‌کالا جت — خانه", desc: "Digikala Jet home page — pixel-perfect React implementation from Figma." },
  { entry: "preview/main.jsx", html: "components.html", title: "Digikala Jet — components", desc: "Every component and state of the Digikala Jet home page kit." },
];

for (const p of PAGES) {
  const name = path.basename(p.html, ".html");
  const r = await build({
    ...common,
    entryPoints: { [name]: p.entry },
    format: "esm",
    splitting: true,                  // lazy chunks (Lottie assistant) load after first paint
    chunkNames: "assets/chunk-[hash]",
    // entry JS sits next to the HTML; chunks, images and fonts in assets/.
    // Every URL is then relative to the page → works under /<repo>/<folder>/.
    outdir: OUT,
    entryNames: "[name]-[hash]",
    assetNames: "assets/[name]-[hash]",
    loader: { ".jsx": "jsx", ".png": "file", ".jpg": "file", ".webp": "file", ".woff2": "file", ".json": "json" },
    metafile: true,
    write: true,
  });
  const outs = Object.keys(r.metafile.outputs).map((f) => path.relative(OUT, f).split(path.sep).join("/"));
  const entryOut = Object.entries(r.metafile.outputs).find(([, o]) => o.entryPoint)[0];
  const js = path.relative(OUT, entryOut).split(path.sep).join("/");
  const fonts = outs.filter((f) => /Digikala-(Regular|Medium|Bold)-.*\.woff2$/.test(f));
  const cssFile = outs.find((f) => f.endsWith(".css"));
  // CSS is inlined: its asset URLs ("assets/…") are page-relative, like the JS ones
  const css = cssFile ? fs.readFileSync(path.join(OUT, cssFile), "utf8") : "";
  if (cssFile) fs.rmSync(path.join(OUT, cssFile));
  const html = `<!doctype html>
<html lang="fa" dir="rtl">
<head>
${HEAD(p.title, p.desc)}
${fonts.map((f) => `<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>`).join("\n")}
${css ? `<style>${css}</style>` : ""}
</head>
<body>
<div id="root"></div>
<noscript>This page needs JavaScript.</noscript>
<script type="module" src="${js}"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, p.html), html);
  console.log(`${OUT}/${p.html} → ${js}`);

  if (inline) {
    const ri = await build({ ...common, entryPoints: [p.entry], write: false, outdir: "out",
      loader: { ".jsx": "jsx", ".png": "dataurl", ".jpg": "dataurl", ".webp": "dataurl", ".woff2": "dataurl", ".woff": "dataurl" } });
    const ijs = ri.outputFiles.find((f) => f.path.endsWith(".js")).text;
    const icss = (ri.outputFiles.find((f) => f.path.endsWith(".css")) || { text: "" }).text;
    fs.mkdirSync(path.join(OUT, "standalone"), { recursive: true });
    fs.writeFileSync(path.join(OUT, "standalone", p.html),
      `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>${p.title}</title><style>${icss}</style></head><body><div id="root"></div><script>${ijs.replace(/<\/script/g, "<\\/script")}</script></body></html>`);
    console.log(`${OUT}/standalone/${p.html} (single file)`);
  }
}

// assets summary
const files = fs.readdirSync(path.join(OUT, "assets"));
const total = files.reduce((n, f) => n + fs.statSync(path.join(OUT, "assets", f)).size, 0);
console.log(`${files.length} asset files, ${(total / 1024).toFixed(0)} KB`);
