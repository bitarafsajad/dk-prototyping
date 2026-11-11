/**
 * rainScene — draws drifting clouds + falling rain on a <canvas>.
 * Framework‑free so it can be reused anywhere.
 *
 * createRainScene(canvas, cloudSources, options) -> { destroy() }
 *
 * Clouds are generated, not laid out by hand: every cloud gets a random
 * image, mirror, size, height, opacity and spacing, and a fresh random cloud
 * is spawned on the right whenever there is room. The sky is filled edge to
 * edge from the very first frame, and no sequence ever repeats.
 */

// Depth layers. Sizes/positions are fractions of the cover width (w, gap)
// and height (y). speed = fraction of the width travelled per second.
const LAYERS = [
  { // far — small, soft, slow
    speed: 0.016, blur: 1.5,
    w: [0.15, 0.24], y: [0.0, 0.16], gap: [0.14, 0.3], alpha: [0.4, 0.55],
  },
  { // mid
    speed: 0.028, blur: 0.6,
    w: [0.26, 0.4], y: [-0.03, 0.12], gap: [0.08, 0.2], alpha: [0.65, 0.82],
  },
  { // near — big, bright, faster
    speed: 0.042, blur: 0,
    w: [0.34, 0.5], y: [0.24, 0.34], gap: [0.12, 0.26], alpha: [0.72, 0.88],
  },
];

const DEFAULTS = {
  rain: 1,          // rain density multiplier (0 = no rain)
  drops: 130,       // streaks on screen at rain = 1
  cloudSpeed: 1,    // cloud speed multiplier
  wind: 0.22,       // horizontal drift of rain per unit of fall (leftwards)
  seed: undefined,  // number = same "random" sky every time (useful for exports)
  maxDpr: 2,
};

// small seeded PRNG (mulberry32)
function makeRandom(seed) {
  if (seed === undefined) return Math.random;
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createRainScene(canvas, cloudSources, options = {}) {
  const opts = { ...DEFAULTS, ...options };
  const ctx = canvas.getContext("2d");
  const rnd = makeRandom(opts.seed);
  const range = ([a, b]) => a + rnd() * (b - a);
  const reduced =
    typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W = 0, H = 0, dpr = 1;
  let images = [];
  let layers = [];      // [{ def, clouds: [...] }]
  let spriteCache = new Map();
  let drops = [];
  let raf = 0, last = 0, running = false, visible = true, destroyed = false;

  // ---------- assets ----------
  const loadImg = (src) =>
    new Promise((res, rej) => {
      const im = new Image();
      im.decoding = "async";
      im.onload = () => res(im);
      im.onerror = rej;
      im.src = src;
    });

  // Pre-render (blur + mirror) each cloud once; cached by look and size.
  function sprite(img, flip, wFrac, blurRef) {
    const im = images[img];
    // blur values are tuned for a 1560px-wide cover; scale with the real width
    const blur = Math.round(blurRef * (W / 1560) * 100) / 100;
    const w = Math.max(1, Math.round(wFrac * W * dpr));
    const key = `${img}|${flip}|${w}|${blurRef}`;
    let sp = spriteCache.get(key);
    if (sp) return sp;
    const h = Math.max(1, Math.round((w * im.naturalHeight) / im.naturalWidth));
    const pad = Math.ceil(blur * 3 * dpr);
    const off = document.createElement("canvas");
    off.width = w + pad * 2;
    off.height = h + pad * 2;
    const o = off.getContext("2d");
    if (blur) o.filter = `blur(${blur * dpr}px)`;
    if (flip) { o.translate(off.width, 0); o.scale(-1, 1); }
    o.drawImage(im, pad, pad, w, h);
    sp = { canvas: off, pad };
    spriteCache.set(key, sp);
    return sp;
  }

  // ---------- clouds ----------
  let lastImg = -1;
  function newCloud(def, x) {
    // random image, never the same one twice in a row
    let img;
    do { img = Math.floor(rnd() * images.length); } while (images.length > 1 && img === lastImg);
    lastImg = img;
    const w = Math.round(range(def.w) * 50) / 50; // snap size so sprites are reused
    return {
      x, w, img,
      y: range(def.y),
      gap: range(def.gap),
      alpha: range(def.alpha),
      flip: rnd() < 0.5,
    };
  }

  function fillLayer(L) {
    // keep adding clouds until the layer reaches past the right edge
    let tail = L.clouds[L.clouds.length - 1];
    while (!tail || tail.x + tail.w + tail.gap < 1.02) {
      const x = tail ? tail.x + tail.w + tail.gap : -range([0.02, 0.12]);
      tail = newCloud(L.def, x);
      L.clouds.push(tail);
    }
  }

  function buildClouds() {
    layers = LAYERS.map((def) => {
      const L = { def, clouds: [] };
      fillLayer(L);
      return L;
    });
  }

  function moveClouds(dt) {
    for (const L of layers) {
      const dx = L.def.speed * opts.cloudSpeed * dt;
      for (const c of L.clouds) c.x -= dx;
      while (L.clouds.length && L.clouds[0].x + L.clouds[0].w < -0.02) L.clouds.shift();
      fillLayer(L);
    }
  }

  // ---------- rain ----------
  function makeDrop(randomY) {
    const s = H / 380; // scale to the reference video height
    return {
      x: Math.random() * (W + H * opts.wind),
      y: randomY ? Math.random() * H : -Math.random() * H * 0.3,
      len: (18 + Math.random() * 24) * s,
      v: (620 + Math.random() * 420) * s,
      a: 0.3 + Math.random() * 0.4,
    };
  }
  function buildDrops() {
    // density is relative to the cover, not to pixels, so a 390px-wide
    // cover looks exactly like the 1560px one (same number of streaks)
    const n = Math.round(opts.drops * opts.rain);
    drops = Array.from({ length: n }, () => makeDrop(true));
  }

  // ---------- frame ----------
  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    for (const L of layers) {
      for (const c of L.clouds) {
        if (c.x > 1) continue;
        const sp = sprite(c.img, c.flip, c.w, L.def.blur);
        ctx.globalAlpha = c.alpha;
        ctx.drawImage(
          sp.canvas,
          c.x * W - sp.pad / dpr,
          c.y * H - sp.pad / dpr,
          sp.canvas.width / dpr,
          sp.canvas.height / dpr
        );
      }
    }

    ctx.globalAlpha = 1;
    ctx.lineCap = "round";
    ctx.lineWidth = Math.max(0.75, (1.4 * H) / 380);
    for (const d of drops) {
      ctx.strokeStyle = `rgba(255,255,255,${d.a})`;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.len * opts.wind, d.y - d.len);
      ctx.stroke();
    }
  }

  function step(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    moveClouds(dt);
    for (const d of drops) {
      d.y += d.v * dt;
      d.x -= d.v * dt * opts.wind;
      if (d.y - d.len > H || d.x < -d.len) Object.assign(d, makeDrop(false));
    }
    draw();
    raf = requestAnimationFrame(step);
  }

  function start() {
    if (running || reduced || !visible || destroyed || !layers.length) return;
    running = true; last = 0;
    raf = requestAnimationFrame(step);
  }
  function stop() { running = false; cancelAnimationFrame(raf); }

  // ---------- sizing ----------
  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    dpr = Math.min(window.devicePixelRatio || 1, opts.maxDpr);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    spriteCache = new Map();
    if (images.length) {
      if (!layers.length) buildClouds();
      buildDrops();
      draw();
    }
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    visible ? start() : stop();
  });
  io.observe(canvas);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVis);

  Promise.all(cloudSources.map(loadImg)).then((imgs) => {
    if (destroyed) return;
    images = imgs;
    resize();
    start();
  });

  return {
    destroy() {
      destroyed = true;
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    },
  };
}
