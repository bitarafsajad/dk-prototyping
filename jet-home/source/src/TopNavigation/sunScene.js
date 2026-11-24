/**
 * sunScene — clear morning sky: a soft sun with slowly turning light rays,
 * a breathing glow, a faint lens flare and a few drifting light motes.
 * Same interface as rainScene: createSunScene(canvas, _sources, options) -> { destroy() }
 *
 * The sun sits on the LEFT (the RTL texts are on the right) and every light
 * layer fades out before it reaches the text area, so white text keeps its
 * contrast (see the sky + overlay colours in WEATHER_BACKGROUNDS.sunny).
 */
const DEFAULTS = {
  sunX: 0.14,        // sun centre, fraction of width
  sunY: 0.2,         // sun centre, fraction of height
  rays: 11,
  raySpeed: 0.018,   // rad / s — slow, calm
  maxDpr: 2,
};

export function createSunScene(canvas, _sources, options = {}) {
  const o = { ...DEFAULTS, ...options };
  const ctx = canvas.getContext("2d");
  const reduced =
    typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W = 0, H = 0, dpr = 1, raf = 0, last = 0, t = 0;
  let running = false, visible = true, destroyed = false;
  let motes = [];

  const rnd = (a, b) => a + Math.random() * (b - a);
  function buildMotes() {
    motes = Array.from({ length: 14 }, () => ({
      x: rnd(0, 0.55), y: rnd(0.05, 0.6), r: rnd(1, 2.6), a: rnd(0.15, 0.45),
      vx: rnd(-0.004, 0.006), vy: rnd(-0.006, -0.002), ph: rnd(0, Math.PI * 2),
    }));
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const sx = o.sunX * W, sy = o.sunY * H;
    const R = Math.max(W, H);
    const breathe = 1 + 0.05 * Math.sin(t * 0.9);

    ctx.globalCompositeOperation = "lighter";

    // light rays: soft wedges turning very slowly, fading with distance
    const len = R * 0.85;
    for (let i = 0; i < o.rays; i += 1) {
      const a = (i / o.rays) * Math.PI * 2 + t * o.raySpeed;
      const spread = 0.07 + 0.025 * Math.sin(t * 0.5 + i * 1.7);
      const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, len);
      const alpha = 0.075 + 0.035 * Math.sin(t * 0.7 + i);
      g.addColorStop(0, `rgba(255, 246, 214, ${alpha})`);
      g.addColorStop(0.45, `rgba(255, 246, 214, ${alpha * 0.35})`);
      g.addColorStop(1, "rgba(255, 246, 214, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.arc(sx, sy, len, a - spread, a + spread);
      ctx.closePath();
      ctx.fill();
    }

    // wide warm glow
    let g = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * 0.42 * breathe);
    g.addColorStop(0, "rgba(255, 244, 200, 0.55)");
    g.addColorStop(0.25, "rgba(255, 232, 170, 0.22)");
    g.addColorStop(1, "rgba(255, 232, 170, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // sun disc: bright core with a soft edge
    const core = Math.min(W, H) * 0.11;
    g = ctx.createRadialGradient(sx, sy, 0, sx, sy, core * 1.6 * breathe);
    g.addColorStop(0, "rgba(255, 255, 250, 1)");
    g.addColorStop(0.45, "rgba(255, 250, 225, 0.95)");
    g.addColorStop(0.62, "rgba(255, 238, 180, 0.35)");
    g.addColorStop(1, "rgba(255, 238, 180, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(sx, sy, core * 1.6 * breathe, 0, Math.PI * 2);
    ctx.fill();

    // faint lens flare along the sun → lower-centre line (kept low and left of the text)
    const fx = W * 0.42, fy = H * 0.62;
    [[0.35, 10, 0.07], [0.6, 5, 0.09], [0.85, 16, 0.045]].forEach(([k, r, a], i) => {
      const x = sx + (fx - sx) * k, y = sy + (fy - sy) * k;
      const rr = r * (1 + 0.15 * Math.sin(t * 0.8 + i));
      const gg = ctx.createRadialGradient(x, y, 0, x, y, rr);
      gg.addColorStop(0, `rgba(255, 255, 255, ${a})`);
      gg.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gg;
      ctx.beginPath();
      ctx.arc(x, y, rr, 0, Math.PI * 2);
      ctx.fill();
    });

    // drifting light motes near the sun
    for (const m of motes) {
      const tw = 0.6 + 0.4 * Math.sin(t * 1.3 + m.ph);
      ctx.fillStyle = `rgba(255, 252, 235, ${m.a * tw})`;
      ctx.beginPath();
      ctx.arc(m.x * W, m.y * H, m.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  function step(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    t += dt;
    for (const m of motes) {
      m.x += m.vx * dt; m.y += m.vy * dt;
      if (m.y < -0.05 || m.x < -0.05 || m.x > 0.6) Object.assign(m, { x: rnd(0.02, 0.5), y: rnd(0.4, 0.65) });
    }
    draw();
    raf = requestAnimationFrame(step);
  }
  function start() {
    if (running || reduced || !visible || destroyed || !W) return;
    running = true; last = 0;
    raf = requestAnimationFrame(step);
  }
  function stop() { running = false; cancelAnimationFrame(raf); }

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    dpr = Math.min(window.devicePixelRatio || 1, o.maxDpr);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    if (!motes.length) buildMotes();
    draw();
    start();
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); });
  io.observe(canvas);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVis);
  resize();

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
