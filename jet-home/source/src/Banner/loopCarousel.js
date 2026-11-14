/**
 * loopCarousel — infinite, auto-advancing scroll-snap carousel.
 *
 * The track holds the slides 3 times: [copy A][real][copy B].
 * We always sit in the middle set; when a scroll ends inside a copy we jump
 * silently by exactly one set width, so the loop never has an end.
 *
 * createLoopCarousel(scroller, { count, interval, startIndex, onChange })
 *   -> { next(), prev(), goTo(i), destroy() }
 */
export function createLoopCarousel(
  scroller,
  { count, interval = 2500, startIndex = 0, onChange } = {}
) {
  const slides = () => scroller.querySelectorAll("[data-loop-slide]");
  const reduced =
    typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  let timer = 0;
  let pending = false; // an auto-advance is scheduled
  let settleTimer = 0;
  let userActive = false;
  let hovering = false;
  let visible = true;
  let destroyed = false;
  let current = count + startIndex;

  const center = (el) => {
    const r = el.getBoundingClientRect();
    return r.left + r.width / 2;
  };
  const scrollerCenter = () => {
    const r = scroller.getBoundingClientRect();
    return r.left + r.width / 2;
  };

  // move so that slide i is centred (positive delta works in RTL too)
  function scrollToSlide(i, smooth) {
    const el = slides()[i];
    if (!el) return;
    scroller.scrollBy({ left: center(el) - scrollerCenter(), behavior: smooth ? "smooth" : "auto" });
  }

  function nearestIndex() {
    const c = scrollerCenter();
    let best = 0, dist = Infinity;
    slides().forEach((el, i) => {
      const d = Math.abs(center(el) - c);
      if (d < dist) { dist = d; best = i; }
    });
    return best;
  }

  // silent jump between identical sets
  function jumpBy(sets) {
    const list = slides();
    const from = list[current], to = list[current + sets * count];
    if (!from || !to) return;
    const snap = scroller.style.scrollSnapType;
    scroller.style.scrollSnapType = "none";
    scroller.scrollBy({ left: center(to) - center(from), behavior: "auto" });
    current += sets * count;
    // restore snapping on the next frame (after the jump has been applied)
    requestAnimationFrame(() => { scroller.style.scrollSnapType = snap; });
  }

  function settle() {
    if (destroyed) return;
    current = nearestIndex();
    if (current < count) jumpBy(1);
    else if (current >= count * 2) jumpBy(-1);
    onChange?.(((current % count) + count) % count);
    if (!pending) schedule(); // keep a steady 2.5s rhythm while auto-playing
  }

  function schedule() {
    clearTimeout(timer);
    pending = false;
    if (destroyed || userActive || hovering || !visible || count < 2) return;
    if (!Number.isFinite(interval) || interval <= 0) return;
    pending = true;
    timer = setTimeout(() => { pending = false; next(); }, interval);
  }
  function pause() { clearTimeout(timer); pending = false; }

  function next() { goToIndex(current + 1); }
  function prev() { goToIndex(current - 1); }
  function goToIndex(i) {
    current = i;
    scrollToSlide(i, !reduced);
    schedule(); // keeps ticking even if no scroll event fires
  }

  // ---- events ----
  const onScroll = () => {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(settle, 140); // fallback for browsers without scrollend
  };
  const onScrollEnd = () => { clearTimeout(settleTimer); settle(); };
  const onDown = () => { userActive = true; pause(); };
  const onUp = () => { userActive = false; schedule(); };
  const onEnter = () => { hovering = true; pause(); };
  const onLeave = () => { hovering = false; schedule(); };
  const onVis = () => { visible = !document.hidden; visible ? schedule() : pause(); };

  scroller.addEventListener("scroll", onScroll, { passive: true });
  scroller.addEventListener("scrollend", onScrollEnd);
  scroller.addEventListener("pointerdown", onDown, { passive: true });
  scroller.addEventListener("touchstart", onDown, { passive: true });
  window.addEventListener("pointerup", onUp, { passive: true });
  window.addEventListener("touchend", onUp, { passive: true });
  window.addEventListener("pointercancel", onUp, { passive: true });
  scroller.addEventListener("mouseenter", onEnter);
  scroller.addEventListener("mouseleave", onLeave);
  document.addEventListener("visibilitychange", onVis);
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting && !document.hidden;
    visible ? schedule() : pause();
  });
  io.observe(scroller);

  // start centred on the requested slide of the middle set (no animation)
  scrollToSlide(current, false);
  schedule();

  return {
    next,
    prev,
    goTo: (i) => goToIndex(count + i),
    destroy() {
      destroyed = true;
      clearTimeout(timer);
      clearTimeout(settleTimer);
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("scrollend", onScrollEnd);
      scroller.removeEventListener("pointerdown", onDown);
      scroller.removeEventListener("touchstart", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("pointercancel", onUp);
      scroller.removeEventListener("mouseenter", onEnter);
      scroller.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
    },
  };
}
