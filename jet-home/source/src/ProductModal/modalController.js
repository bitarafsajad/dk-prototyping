/**
 * productModal — port of the dk-prototyping «modal-pdp» prototype (Figma 2610:49650 /
 * components 1629:20382), driven by real product data instead of a screenshot.
 *
 *  - opens FROM the tapped product image (container transform: the card scales down onto the
 *    image rect and is cropped to its shape, the image ghost fades out) and closes back INTO
 *    the image of the product being shown (in the same section);
 *  - carousel of the section's products (RTL, peeking neighbours, indicator strip);
 *  - drag/scroll up → full screen (expanded); pull down at the top → back to the modal,
 *    keep pulling → close; ✕ closes; Esc / arrows / focus trap.
 *
 * createProductModal(root) -> { open(products, index, sourceEl, sectionEl), close(), destroy() }
 */
const CARD_W = 342, CARD_H = 513, GAP = 16, INDICATOR_H = 85, GROUP_GAP = 40, RADIUS = 24;
const EXPAND_DIST = 260;   // px of upward drag for a full expand
const COLLAPSE_DIST = 300; // px of downward pull (at top) for a full collapse
const mod = (a, n) => ((a % n) + n) % n;

const CLOSE_PATH = "M13.4101 12.0063L17.7001 7.71626C18.0901 7.32626 18.0901 6.69626 17.7001 6.30626C17.3101 5.91626 16.6801 5.91626 16.2901 6.30626L12.0001 10.5963L7.71006 6.29628C7.32006 5.90628 6.68006 5.90628 6.29006 6.29628C5.90006 6.68628 5.90006 7.32628 6.29006 7.71628L10.5801 12.0063L6.29006 16.2963C5.90006 16.6863 5.90006 17.3163 6.29006 17.7063C6.49006 17.9063 6.74006 17.9963 7.00006 17.9963C7.26006 17.9963 7.51006 17.8963 7.71006 17.7063L12.0001 13.4163L16.2901 17.7063C16.4901 17.9063 16.7401 17.9963 17.0001 17.9963C17.2601 17.9963 17.5101 17.8963 17.7101 17.7063C18.1001 17.3163 18.1001 16.6863 17.7101 16.2963L13.4201 12.0063H13.4101Z";
const TOMAN_PATH = "M9.25509 5.42857H4.05749V3.5H9.25509V5.42857ZM13.8826 6.51128C13.782 5.68233 13.6311 4.81955 13.4467 3.90602L11.6359 4.65038C11.8707 5.63158 12.0551 6.59586 12.2228 7.52632C12.3234 8.11842 12.4072 8.64286 12.4743 9.16729C11.8874 9.38722 11.0323 9.59023 9.89221 9.7594C8.43353 9.97932 6.89102 10.0808 5.28144 10.0808C4.37605 10.0808 3.67186 10.0301 3.1521 9.94549C2.63234 9.84398 2.24671 9.65789 1.96168 9.38722C1.67665 9.11654 1.54251 8.69361 1.54251 8.13534C1.54251 7.52632 1.59281 6.79887 1.65988 5.93609L0.335329 5.75C0.301796 5.8515 0.28503 5.98684 0.268263 6.15602C0.201198 6.64662 0.134132 7.1203 0.0838323 7.56015C0.0335329 8.01692 0 8.42293 0 8.79511C0 10.1992 0.435928 11.1635 1.29102 11.7049C2.16287 12.2293 3.38683 12.5 4.97964 12.5C6.27066 12.5 7.51138 12.4154 8.68503 12.2632C9.87545 12.1109 10.915 11.8741 11.7868 11.5695C12.3234 11.3665 12.7425 11.1466 13.0611 10.9267C13.3796 10.7068 13.6144 10.4192 13.7653 10.0639C13.9162 9.70865 14 9.25188 14 8.65977C14 8.03383 13.9497 7.30639 13.8323 6.49436L13.8826 6.51128Z";

const CARD_HTML = `
  <div class="pdp-ghost" aria-hidden="true"></div>
  <div class="pdp-scroll">
    <div class="pdp-body">
      <div class="pdp-imageFrame"><img class="pdp-image" alt="" draggable="false"></div>
      <div class="pdp-content">
        <div class="pdp-badges">
          <div class="pdp-promo"><img class="pdp-promoIcon" alt="" width="14" height="14"><span class="pdp-promoText"></span></div>
        </div>
        <div class="pdp-text">
          <h2 class="pdp-title"></h2>
          <p class="pdp-desc pdp-descShort"><span class="pdp-shortText"></span><button class="pdp-more" type="button">بیشتر</button></p>
          <p class="pdp-desc pdp-descFull"></p>
        </div>
      </div>
    </div>
  </div>
  <button class="pdp-close" type="button" aria-label="بستن"><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path fill="#000" d="${CLOSE_PATH}"/></svg></button>
  <div class="pdp-fab">
    <div class="pdp-priceCol">
      <div class="pdp-price">
        <div class="pdp-final">
          <div class="pdp-finalRow"><b class="pdp-finalPrice"></b><svg class="pdp-toman" width="14" height="9" viewBox="0 3.5 14 9" role="img" aria-label="تومان"><path fill="#000" d="${TOMAN_PATH}"/></svg></div>
          <span class="pdp-highlight" aria-hidden="true"></span>
        </div>
        <div class="pdp-prev"><span class="pdp-prevPrice"></span><i aria-hidden="true"></i></div>
      </div>
    </div>
    <button class="pdp-cart" type="button"><span>افزودن به سبد</span></button>
  </div>`;

export function createProductModal(device) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const modal = document.createElement("div");
  modal.className = "pdp-modal";
  modal.tabIndex = -1;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "جزئیات محصول");
  modal.innerHTML = `<div class="pdp-scrim"></div><div class="pdp-track" aria-roledescription="carousel"></div>
    <div class="pdp-indicator" role="tablist" aria-label="محصولات"></div><div class="pdp-sr" aria-live="polite"></div>`;
  device.appendChild(modal);
  const $ = (s, r = modal) => r.querySelector(s);
  const scrim = $(".pdp-scrim"), track = $(".pdp-track"), indicator = $(".pdp-indicator"), live = $(".pdp-sr");

  /* ---------- state ---------- */
  let P = [], N = 1;
  let W = 390, H = 844, cardW = CARD_W, S = CARD_W + GAP, baseTop = 206, scale = 1;
  let state = "closed";      // closed | card | expanded | closing
  let pos = 0, p = 0, d = 0, m = 1;
  let src = null, sourceEl = null, sectionEl = null, hidden = null;
  const nodes = [];
  const shortCache = {};

  /* ---------- tween helper ---------- */
  const easeOut = (t) => 1 - Math.pow(1 - t, 4);
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
  const tweens = {};
  function tween(key, from, to, dur, ease, set, done) {
    if (tweens[key]) cancelAnimationFrame(tweens[key]);
    if (reduce.matches) dur = Math.min(dur, 120);
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      set(from + (to - from) * ease(t));
      if (t < 1) tweens[key] = requestAnimationFrame(step);
      else { tweens[key] = 0; done && done(); }
    };
    tweens[key] = requestAnimationFrame(step);
  }
  const stopTween = (key) => { if (tweens[key]) { cancelAnimationFrame(tweens[key]); tweens[key] = 0; } };

  /* ---------- build: 5 recycled cards ---------- */
  for (let i = 0; i < 5; i++) {
    const el = document.createElement("article");
    el.className = "pdp-card";
    el.setAttribute("aria-roledescription", "slide");
    el.innerHTML = CARD_HTML;
    el.k = null;
    track.appendChild(el);
    nodes.push(el);
    $(".pdp-close", el).addEventListener("click", () => close());
    $(".pdp-more", el).addEventListener("click", () => { if (el.k === Math.round(pos)) expand(); });
    $(".pdp-cart", el).addEventListener("click", (e) => {
      const b = e.currentTarget, s = b.firstElementChild;
      if (b.classList.contains("is-added")) return;
      b.classList.add("is-added"); s.textContent = "به سبد اضافه شد";
      const prod = P[mod(el.k, N)];
      prod && prod.onAdd && prod.onAdd();
      setTimeout(() => { b.classList.remove("is-added"); s.textContent = "افزودن به سبد"; }, 1600);
    });
  }

  /* ---------- modalIndicator: looping strip of 5 recycled thumbnails ---------- */
  const thumbs = [];
  for (let i = 0; i < 5; i++) {
    const b = document.createElement("button");
    b.className = "pdp-thumb"; b.type = "button"; b.setAttribute("role", "tab"); b.k = null;
    b.innerHTML = '<span class="pdp-thumbIn"><img alt="" decoding="async"></span>';
    b.addEventListener("click", () => { if (state === "card" && b.k !== Math.round(pos)) goTo(b.k); });
    indicator.appendChild(b); thumbs.push(b);
  }
  const RING_OFF = [239, 238, 235], RING_ON = [0, 0, 0];
  const smooth = (x) => x * x * (3 - 2 * x);
  let ipos = null, ivel = 0, iraf = 0, ilast = 0;
  function kickThumbs() {
    if (ipos === null || reduce.matches) { ipos = pos; ivel = 0; renderThumbs(); return; }
    if (!iraf) { ilast = performance.now(); iraf = requestAnimationFrame(stepThumbs); }
  }
  function stepThumbs(now) {
    const dt = Math.min(0.032, Math.max(0.001, (now - ilast) / 1000)); ilast = now;
    const k = 420, c = 2 * Math.sqrt(k);
    for (let i = 0; i < 4; i++) { const h = dt / 4, a = k * (pos - ipos) - c * ivel; ivel += a * h; ipos += ivel * h; }
    if (Math.abs(pos - ipos) < 0.0004 && Math.abs(ivel) < 0.003) { ipos = pos; ivel = 0; iraf = 0; renderThumbs(); return; }
    renderThumbs();
    iraf = requestAnimationFrame(stepThumbs);
  }
  function renderThumbs() {
    const k0 = Math.round(ipos), sel = Math.round(pos);
    for (let s = -2; s <= 2; s++) {
      const k = k0 + s, b = thumbs[mod(k, 5)];
      if (b.k !== k) {
        const prod = P[mod(k, N)];
        b.k = k; b.querySelector("img").src = prod.image; b.setAttribute("aria-label", prod.title);
      }
      const dist = k - ipos, ad = Math.abs(dist);
      const g = 1 - Math.min(1, ad);
      const size = 40 + 8 * g, ring = 1 + g, rad = 10 + 2 * g;
      const off = -Math.sign(dist) * (48 * ad + 4 * (1 - g));     // 52px centre↔neighbour, 48 beyond; RTL
      const fade = ad <= 1 ? 1 : 1 - smooth(Math.min(1, (ad - 1) / 0.8));
      const sc = 0.8 + 0.2 * fade;
      const col = RING_OFF.map((v, j) => (v + (RING_ON[j] - v) * g).toFixed(1));
      const dup = N === 1 && s !== 0;                               // a single product: no loop copies
      b.style.width = b.style.height = size + "px";
      b.style.borderRadius = rad + "px";
      b.style.background = `rgb(${col})`;
      b.style.transform = `translate3d(${off - size / 2}px,${40 - size / 2}px,0) scale(${sc})`;
      b.style.opacity = dup ? 0 : fade;
      b.style.pointerEvents = fade > 0.5 && !dup ? "" : "none";
      b.tabIndex = fade > 0.5 ? 0 : -1;
      const inner = b.firstElementChild;
      inner.style.inset = ring + "px";
      inner.style.borderRadius = rad - ring + "px";
      const img = inner.firstElementChild, is = size * 0.8;
      img.style.width = img.style.height = is + "px";
      b.setAttribute("aria-selected", k === sel);
    }
  }

  function fill(el, k) {
    const prod = P[mod(k, N)];
    el.k = k;
    el.dataset.product = prod.id;
    el.setAttribute("aria-label", prod.title);
    const im = $(".pdp-image", el); im.src = prod.image; im.alt = prod.title;
    const badges = $(".pdp-badges", el);
    badges.querySelectorAll(".pdp-tag").forEach((t) => t.remove());
    const promo = $(".pdp-promo", el);
    promo.style.display = prod.promo ? "" : "none";
    promo.classList.toggle("has-icon", !!prod.promoIcon);
    $(".pdp-promoIcon", el).src = prod.promoIcon || "";
    $(".pdp-promoText", el).textContent = prod.promo || "";
    prod.tags.forEach((t) => { const d = document.createElement("div"); d.className = "pdp-tag"; d.innerHTML = "<span></span>"; d.firstChild.textContent = t; badges.appendChild(d); });
    $(".pdp-title", el).textContent = prod.title;
    $(".pdp-descShort", el).style.display = prod.showShort ? "" : "none";
    $(".pdp-shortText", el).textContent = shortCache[prod.id] || "";
    $(".pdp-descFull", el).textContent = prod.desc;
    $(".pdp-finalPrice", el).textContent = prod.price;
    $(".pdp-prev", el).style.display = prod.prev ? "" : "none";
    $(".pdp-highlight", el).style.display = prod.prev ? "" : "none";
    $(".pdp-prevPrice", el).textContent = prod.prev || "";
    $(".pdp-scroll", el).scrollTop = 0;
  }

  /* Truncate each description to exactly two lines followed by "… بیشتر" (as in Figma) */
  function computeShorts() {
    const probe = document.createElement("p");
    probe.className = "pdp-desc";
    probe.style.cssText = `position:absolute;visibility:hidden;width:${cardW - 32}px;left:-9999px;top:0`;
    modal.appendChild(probe);
    P.forEach((prod) => {
      const words = prod.desc.replace(/\n/g, "، ").split(" ");
      const fits = (n) => {
        probe.innerHTML = ""; probe.textContent = words.slice(0, n).join(" ") + "... ";
        const s = document.createElement("span"); s.className = "pdp-more"; s.textContent = "بیشتر"; probe.appendChild(s);
        return probe.offsetHeight <= 41;
      };
      let lo = 1, hi = words.length;
      if (fits(hi)) { shortCache[prod.id] = prod.desc.replace(/\n/g, "، ") + " "; return; }
      while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (fits(mid)) lo = mid; else hi = mid - 1; }
      shortCache[prod.id] = words.slice(0, lo).join(" ").replace(/[،,.]$/, "") + "... ";
    });
    probe.remove();
    nodes.forEach((n) => { if (n.k !== null) $(".pdp-shortText", n).textContent = shortCache[P[mod(n.k, N)].id]; });
  }

  /* ---------- measure ---------- */
  function measure() {
    scale = 1;
    W = device.clientWidth; H = device.clientHeight;
    cardW = Math.min(CARD_W, W - 48);
    S = cardW + GAP;
    baseTop = Math.max(16, H - INDICATOR_H - GROUP_GAP - CARD_H);
  }

  /* source image rect (relative to the device) for a product id, in the opening section */
  function rectFor(id) {
    const root = sectionEl && sectionEl.isConnected ? sectionEl : device;
    const el = root.querySelector(`[data-pid="${CSS.escape(id)}"] .thumb__img`) || (sourceEl && sourceEl.isConnected ? sourceEl : null);
    if (!el) return null;
    const r = el.getBoundingClientRect(), dv = device.getBoundingClientRect();
    return { x: r.left - dv.left, y: r.top - dv.top, w: r.width, h: r.height, r: 12, el };
  }
  function hideSource(el) {
    if (hidden && hidden !== el) hidden.style.visibility = "";
    hidden = el || null;
    if (hidden) hidden.style.visibility = "hidden";       // the "hole" where the image left
  }

  /* ---------- render ---------- */
  function render() {
    const k0 = Math.round(pos);
    const dismissFrac = Math.min(1, Math.max(0, d) / (H * 0.55));
    for (let s = -2; s <= 2; s++) {
      const k = k0 + s, el = nodes[mod(k, 5)];
      if (el.k !== k) fill(el, k);
      const active = s === 0;
      let x, y, w, h, r, o = 1;
      const cx = (W - cardW) / 2 - (k - pos) * S;            // RTL: next item to the left
      if (active) {
        x = cx * (1 - p); y = baseTop * (1 - p) + d;
        w = cardW + (W - cardW) * p; h = CARD_H + (H - CARD_H) * p; r = RADIUS * (1 - p);
      } else {
        const out = Math.sign(cx - (W - cardW) / 2) * p * 60;
        x = cx + out; y = baseTop; w = cardW; h = CARD_H; r = RADIUS;
        o = (1 - p) * (1 - dismissFrac);
      }
      el.style.transform = `translate3d(${x}px,${y}px,0)`;
      el.style.width = w + "px"; el.style.height = h + "px";
      el.style.borderRadius = r + "px";
      el.style.setProperty("--r", r + "px");
      el.style.clipPath = r > 0 ? `inset(0 round ${r}px)` : "none";
      el.style.opacity = o;
      el.style.zIndex = active ? 2 : 1;
      const dupHide = N === 1 && s !== 0;                           // a single product: no neighbours
      el.style.visibility = (Math.abs(s) > 1 && Math.abs(k - pos) > 1.6) || dupHide ? "hidden" : "";
      const ghost = el.firstElementChild;
      if (active && m < 1 && src) {
        // container transform: scale the card down onto the product image and crop it to its shape
        const s0 = src.w / w, h0 = src.h / s0;
        const top0 = Math.min(Math.max(160 - h0 / 2, 0), Math.max(0, h - h0));  // centred on the image
        const bot0 = Math.max(0, h - top0 - h0);
        const sc = s0 + (1 - s0) * m, top = top0 * (1 - m), bot = bot0 * (1 - m);
        const rr = (src.r / s0) * (1 - m) + r * m;
        const bx = src.x + (x - src.x) * m, by = src.y + (y - src.y) * m;
        el.style.transformOrigin = "0 0";
        el.style.transform = `translate3d(${bx}px,${by - top * sc}px,0) scale(${sc})`;
        el.style.clipPath = `inset(${top}px 0 ${bot}px 0 round ${rr}px)`;
        el.style.borderRadius = "0px";
        // the card's own image, growing with the card and fading out
        ghost.style.visibility = "visible";
        ghost.style.top = top0 + "px"; ghost.style.width = w + "px"; ghost.style.height = h0 + "px";
        ghost.style.backgroundImage = `url("${P[mod(k, N)].image}")`;
        ghost.style.opacity = 1 - Math.min(1, Math.max(0, (m - 0.06) / 0.42));
      } else {
        el.style.transformOrigin = "";
        if (ghost.style.visibility !== "hidden") ghost.style.visibility = "hidden";
      }
      if (!active) el.style.opacity = o * m * m * m;
      el.classList.toggle("is-full", active && p > 0);
      el.classList.toggle("is-expanded", active && state === "expanded" && p === 1);
      if (active) { el.removeAttribute("inert"); el.removeAttribute("aria-hidden"); }
      else el.setAttribute("inert", "");
    }
    const fade = Math.min(1, m * 1.4);
    scrim.style.opacity = (1 - dismissFrac) * fade;
    indicator.style.opacity = (1 - p) * (1 - dismissFrac) * m * m * m;
    indicator.style.pointerEvents = p > 0.5 ? "none" : "";
    kickThumbs();
  }
  const activeEl = () => nodes[mod(Math.round(pos), 5)];
  const activeScroll = () => $(".pdp-scroll", activeEl());

  /* ---------- carousel ---------- */
  function goTo(k, dur = 420) {
    stopTween("pos");
    if (state !== "card") return;
    if (N === 1) k = Math.round(pos);
    tween("pos", pos, k, dur, easeOut, (v) => { pos = v; render(); }, () => { pos = k; render(); announce(); });
  }
  function announce() { live.textContent = P[mod(Math.round(pos), N)].title; }

  /* ---------- expand / collapse ---------- */
  function pullDown(dist) {
    dist = Math.max(0, dist);
    p = 1 - Math.min(dist, COLLAPSE_DIST) / COLLAPSE_DIST;
    d = Math.max(0, dist - COLLAPSE_DIST);
    render();
  }
  function releasePull(vy) {
    if (d > 70 || (p === 0 && vy > 0.35)) { close(); return; }
    if (d > 0) springBack();
    if (p < 0.8 || vy > 0.5) collapse();
    else { state = "expanded"; tween("p", p, 1, 300, easeOut, setP, () => { p = 1; render(); }); }
  }
  function setP(v) { p = Math.max(0, Math.min(1, v)); render(); }
  function expand() {
    if (state === "closed" || state === "closing") return;
    stopTween("pos"); pos = Math.round(pos);
    state = "expanded";
    tween("p", p, 1, 480, easeOut, setP, () => { state = "expanded"; p = 1; render(); });
  }
  function collapse() {
    state = "card";
    activeScroll().scrollTop = 0;
    tween("p", p, 0, 460, easeOut, setP, () => { p = 0; render(); });
  }

  /* ---------- open / close ---------- */
  let lastFocus = null;
  function open(products, index, fromEl, section) {
    if (!products || !products.length) return;
    P = products; N = P.length;
    nodes.forEach((n) => { n.k = null; }); thumbs.forEach((t) => { t.k = null; });
    measure();
    computeShorts();
    sourceEl = fromEl || null; sectionEl = section || null;
    lastFocus = document.activeElement;
    pos = index; p = 0; d = 0; state = "card"; ipos = null;
    src = rectFor(P[index].id);
    m = src ? 0 : 1;
    hideSource(src && src.el);
    modal.classList.add("is-open");
    render(); announce();
    modal.focus({ preventScroll: true });
    if (src) tween("m", 0, 1, 620, easeOutQuart, (v) => { m = v; render(); }, () => { m = 1; render(); });
  }
  function close() {
    if (state === "closed" || state === "closing") return;
    stopTween("pos"); stopTween("p"); stopTween("d"); stopTween("m");
    pos = Math.round(pos);
    // shrink back into the image of the product being shown
    src = rectFor(P[mod(pos, N)].id);
    hideSource(src && src.el);
    const p0 = p, d0 = d, m0 = m;
    state = "closing";
    activeEl().classList.remove("is-expanded");
    const done = () => {
      state = "closed"; modal.classList.remove("is-open");
      d = 0; p = 0; m = 1; activeScroll().scrollTop = 0; render();
      hideSource(null);
      const back = src && src.el && src.el.closest("[data-pid]");
      (back && back.querySelector(".pcard__open")) ? back.querySelector(".pcard__open").focus({ preventScroll: true }) : lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
    };
    if (!src) { // no visible card to return to: fade away
      tween("m", 0, 1, 260, easeOut, (t) => { scrim.style.opacity = 1 - t; activeEl().style.opacity = 1 - t; indicator.style.opacity = 0; }, done);
      return;
    }
    tween("m", 0, 1, reduce.matches ? 120 : 480, easeOutQuart, (t) => {
      p = p0 * (1 - t); d = d0 * (1 - t); m = m0 * (1 - t); render();
    }, done);
  }
  function springBack() { tween("d", d, 0, 380, easeOut, (v) => { d = v; render(); }); }

  /* ---------- gestures: card state (pointer, all input types) ---------- */
  let g = null, suppressClick = false;
  modal.addEventListener("pointerdown", (e) => {
    if (state === "closed" || state === "closing" || m < 1 || e.button !== 0) return;
    if (state === "expanded") {
      if (e.pointerType !== "mouse" || activeScroll().scrollTop > 0) return;
      if (!activeEl().contains(e.target) || e.target.closest("button")) return;
    }
    stopTween("pos"); stopTween("d"); stopTween("p");
    g = { id: e.pointerId, x0: e.clientX, y0: e.clientY, pos0: pos, p0: p, d0: d, axis: null, samples: [{ t: e.timeStamp, x: e.clientX, y: e.clientY }], target: e.target };
  });
  modal.addEventListener("pointermove", (e) => {
    if (!g || e.pointerId !== g.id) return;
    const dx = (e.clientX - g.x0) / scale, dy = (e.clientY - g.y0) / scale;
    g.samples.push({ t: e.timeStamp, x: e.clientX, y: e.clientY }); if (g.samples.length > 6) g.samples.shift();
    if (!g.axis) {
      if (Math.hypot(dx, dy) < 7) return;
      if (state === "expanded") g.axis = dy > 0 ? "collapse" : "none";
      else g.axis = Math.abs(dx) > Math.abs(dy) ? (N > 1 ? "x" : "none") : (dy > 0 ? "down" : "up");
      if (g.axis === "none") { g = null; return; }
      try { modal.setPointerCapture(g.id); } catch (_) { /* noop */ }
      suppressClick = true;
    }
    if (g.axis === "x") { pos = g.pos0 + dx / S; render(); }
    else if (g.axis === "down") { d = Math.max(0, g.d0 + dy); if (dy < 0) d = g.d0 + dy * 0.2; render(); }
    else if (g.axis === "up") setP(g.p0 + -dy / EXPAND_DIST - Math.max(0, dy) / 600);
    else if (g.axis === "collapse") pullDown(dy);
  });
  function velocity(gg) {
    const a = gg.samples[0], b = gg.samples[gg.samples.length - 1], dt = Math.max(1, b.t - a.t);
    return { vx: (b.x - a.x) / scale / dt, vy: (b.y - a.y) / scale / dt };
  }
  function endGesture(e) {
    if (!g || e.pointerId !== g.id) return;
    const gg = g; g = null;
    if (!gg.axis) { if (state === "card" && e.type === "pointerup") tapAt(e, gg); return; }
    const { vx, vy } = velocity(gg);
    if (gg.axis === "x") {
      const projected = pos + (vx * 180) / S;
      const base = Math.round(gg.pos0);
      goTo(Math.max(base - 1, Math.min(base + 1, Math.round(projected))), 420);
    } else if (gg.axis === "down") { if (d > 80 || vy > 0.35) close(); else springBack(); }
    else if (gg.axis === "up") { if (p > 0.25 || vy < -0.5) expand(); else collapse(); }
    else if (gg.axis === "collapse") releasePull(vy);
    setTimeout(() => (suppressClick = false), 0);
  }
  modal.addEventListener("pointerup", endGesture);
  modal.addEventListener("pointercancel", endGesture);
  modal.addEventListener("click", (e) => { if (suppressClick) { e.stopPropagation(); e.preventDefault(); suppressClick = false; } }, true);

  function tapAt(e, gg) {
    // taps on the peeking neighbour cards move the carousel
    const el = activeEl();
    if (el.contains(gg.target) || indicator.contains(gg.target)) return;
    const dv = device.getBoundingClientRect();
    const x = (e.clientX - dv.left) / scale, y = (e.clientY - dv.top) / scale;
    if (y < baseTop || y > baseTop + CARD_H) return;
    const left = (W - cardW) / 2, k0 = Math.round(pos);
    if (N > 1) { if (x < left) goTo(k0 + 1); else if (x > left + cardW) goTo(k0 - 1); }
  }

  /* ---------- gestures: expanded state (touch; keeps native scrolling) ---------- */
  let tg = null;
  modal.addEventListener("touchstart", (e) => {
    if (state !== "expanded" || e.touches.length !== 1) { tg = null; return; }
    const t = e.touches[0];
    if (e.target.closest(".pdp-close")) { tg = null; return; }
    tg = { y0: t.clientY, mode: null, samples: [{ t: e.timeStamp, y: t.clientY }] };
  }, { passive: true });
  modal.addEventListener("touchmove", (e) => {
    if (!tg) return;
    const t = e.touches[0], dy = (t.clientY - tg.y0) / scale;
    tg.samples.push({ t: e.timeStamp, y: t.clientY }); if (tg.samples.length > 6) tg.samples.shift();
    const sc = activeScroll();
    const movingDown = t.clientY > (tg.lastY ?? tg.y0);
    tg.lastY = t.clientY;
    // one continuous gesture: at the top and still moving down → the same drag collapses the sheet
    if (tg.mode !== "collapse" && movingDown && sc.scrollTop <= 0.5) {
      tg.mode = "collapse"; stopTween("p"); tg.y0 = t.clientY;
      tg.samples = [{ t: e.timeStamp, y: t.clientY }];
    } else if (!tg.mode && Math.abs(dy) > 4) tg.mode = "scroll";
    if (tg.mode === "collapse") {
      if (e.cancelable) e.preventDefault();
      pullDown((t.clientY - tg.y0) / scale);
    }
  }, { passive: false });
  modal.addEventListener("touchend", () => {
    if (!tg) return;
    const tt = tg; tg = null;
    if (tt.mode !== "collapse") return;
    const a = tt.samples[0], b = tt.samples[tt.samples.length - 1];
    releasePull((b.y - a.y) / scale / Math.max(1, b.t - a.t));
  });

  /* ---------- wheel / trackpad ---------- */
  let wheelAcc = 0, wheelX = 0, wheelLock = 0, lastScrollMove = 0;
  modal.addEventListener("wheel", (e) => {
    if (state === "closed") return;
    const now = performance.now();
    if (state === "card") {
      e.preventDefault();
      if (now < wheelLock) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        wheelX += e.deltaX;
        if (Math.abs(wheelX) > 50) { goTo(Math.round(pos) + (wheelX < 0 ? 1 : -1)); wheelX = 0; wheelLock = now + 450; }
      } else if (e.deltaY < 0) {
        wheelAcc += e.deltaY;
        if (wheelAcc < -30) { wheelAcc = 0; wheelLock = now + 700; close(); }
      } else if (e.deltaY > 0) {
        wheelAcc += e.deltaY;
        if (wheelAcc > 30) { wheelAcc = 0; wheelLock = now + 700; expand(); }
      }
    } else if (state === "expanded") {
      const sc = activeScroll();
      if (now < wheelLock) return;
      if (sc.scrollTop > 0.5 || e.deltaY >= 0) { wheelAcc = 0; return; }
      wheelAcc += e.deltaY;
      if (wheelAcc < -12) { wheelAcc = 0; wheelLock = now + 600; collapse(); }
    }
    lastScrollMove = now;
  }, { passive: false });
  const wheelReset = setInterval(() => { if (performance.now() - lastScrollMove > 180) { wheelAcc = 0; wheelX = 0; } }, 100);

  /* ---------- keyboard ---------- */
  const onKey = (e) => {
    if (state === "closed") return;
    if (e.key === "Escape") { state === "expanded" ? collapse() : close(); }
    else if (state === "card" && e.key === "ArrowLeft") goTo(Math.round(pos) + 1);
    else if (state === "card" && e.key === "ArrowRight") goTo(Math.round(pos) - 1);
    else if (e.key === "Tab") {
      const f = [...activeEl().querySelectorAll("button"), ...(state === "card" ? indicator.querySelectorAll("button") : [])];
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  };
  document.addEventListener("keydown", onKey);
  const onResize = () => { if (state !== "closed") { measure(); computeShorts(); render(); } };
  addEventListener("resize", onResize);

  return {
    open, close,
    isOpen: () => state !== "closed",
    destroy() {
      document.removeEventListener("keydown", onKey);
      removeEventListener("resize", onResize);
      clearInterval(wheelReset);
      Object.keys(tweens).forEach(stopTween);
      hideSource(null);
      modal.remove();
    },
  };
}
