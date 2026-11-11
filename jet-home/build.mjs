// Builds two self-contained pages into /docs (ready for GitHub Pages):
//   docs/index.html       – the Home page
//   docs/components.html  – every component and state
import { build } from "esbuild";
import fs from "fs";

const HEAD = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#ffffff">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="دیجی‌کالا جت">
<link rel="manifest" href='data:application/manifest+json,{"name":"Digikala Jet","short_name":"Jet","display":"standalone","background_color":"%23ffffff","theme_color":"%23ffffff","start_url":"."}'>`;

async function page(entry, out, title) {
  const r = await build({
    entryPoints: [entry], bundle: true, write: false, outdir: "out", minify: true,
    loader: { ".jsx": "jsx", ".png": "dataurl", ".jpg": "dataurl", ".webp": "dataurl", ".woff2": "dataurl", ".woff": "dataurl" },
    jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' }, logLevel: "error",
  });
  const js = r.outputFiles.find((f) => f.path.endsWith(".js")).text;
  const css = (r.outputFiles.find((f) => f.path.endsWith(".css")) || { text: "" }).text;
  const html = `<!doctype html><html lang="fa" dir="rtl"><head>${HEAD}<title>${title}</title><style>${css}</style></head>
<body><div id="root"></div><script>${js.replace(/<\/script/g, "<\\/script")}</script></body></html>`;
  fs.writeFileSync(out, html);
  console.log(`${out}  ${(html.length / 1024).toFixed(0)} KB`);
}

fs.mkdirSync("docs", { recursive: true });
await page("preview/home.jsx", "docs/index.html", "دیجی‌کالا جت — خانه");
await page("preview/main.jsx", "docs/components.html", "Digikala Jet — components");
