import { memo, useCallback, useEffect, useRef, useState } from "react";
import Pillars from "../Pillars";
import TopNavigation from "../TopNavigation";
import Category from "../Category";
import Banner from "../Banner";
import Carousel, { SECTIONS } from "../Carousel";
import BottomNavigation from "../BottomNavigation";
import "./HomePage.css";

const CHEVRON =
  "M12.2929 7.29302C12.6834 6.90249 13.3164 6.90249 13.707 7.29302C14.0975 7.68354 14.0975 8.31655 13.707 8.70708L10.414 12L13.707 15.293C14.0975 15.6835 14.0975 16.3166 13.707 16.7071C13.3164 17.0976 12.6834 17.0976 12.2929 16.7071L8.29289 12.7071C7.90237 12.3166 7.90237 11.6835 8.29289 11.293L12.2929 7.29302Z";
const MAGNIFIER =
  "M21.489 20.29L18.759 17.57C20.219 15.87 21.049 13.68 21.049 11.42C21.049 6.22005 16.819 2.00005 11.629 2.00005C6.43898 2.00005 2.20898 6.22005 2.20898 11.42C2.20898 16.62 6.42898 20.84 11.629 20.84C13.689 20.84 15.669 20.17 17.299 18.94L20.079 21.71C20.279 21.9 20.529 22 20.789 22C21.049 22 21.299 21.9 21.499 21.71C21.889 21.32 21.889 20.69 21.499 20.3L21.489 20.29ZM16.679 16.85C15.299 18.13 13.509 18.83 11.639 18.83C7.54898 18.83 4.21898 15.5 4.21898 11.41C4.21898 7.32005 7.54898 3.99005 11.639 3.99005C15.729 3.99005 19.059 7.32005 19.059 11.41C19.059 13.46 18.199 15.44 16.689 16.84L16.679 16.85ZM16.509 10.35C16.429 10.37 16.359 10.39 16.279 10.39C15.959 10.39 15.669 10.19 15.569 9.87005C15.199 8.71005 14.279 7.81005 13.109 7.46005C12.709 7.34005 12.489 6.92005 12.609 6.52005C12.729 6.12005 13.149 5.90005 13.549 6.02005C15.179 6.52005 16.469 7.78005 16.999 9.41005C17.129 9.80005 16.909 10.23 16.519 10.35H16.509Z";

/**
 * Scroll state of the content card, same rules as the Pillars:
 *  "top"  at the top of the page          → Pillars default, rounded sheet + card
 *  "down" while scrolling down            → Pillars hidden, compact location header
 *  "up"   while scrolling up (not at top) → Pillars compact, compact location header
 */
function useScrollMode(ref, headerRef, { topOffset = 4, threshold = 6 } = {}) {
  const [mode, setMode] = useState("top");
  useEffect(() => {
    const el = ref.current;
    const header = headerRef.current;
    if (!el || !header) return;
    const field = el.querySelector(".top-nav__search");
    let prev = {};
    const set = (k, v) => { if (prev[k] !== v) { header.style.setProperty(k, v); prev[k] = v; } };
    let last = el.scrollTop;
    let raf = 0;
    const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
    // Header geometry from Figma: location row 76px, search field at 84 (56 tall),
    // compact header search at 8 → the field reaches it at scrollTop 76.
    const FIELD = 84, PARK = 8, MORPH = 60;
    const paint = (y) => {
      const yy = Math.max(0, y);
      const top = Math.max(PARK, FIELD - yy);           // rides with the content, parks at 8
      const hs = yy > 0.5 ? 1 : 0;                      // pill replaces the field once moving
      const hp = clamp((yy - 36) / 40);                 // white comes in as the sky leaves
      const hm = clamp((yy - (FIELD - PARK)) / MORPH);  // then the pill becomes the circle
      // only the header (and the one search field) are touched per frame
      set("--hy", `${top.toFixed(1)}px`);
      set("--hs", String(hs));
      set("--hp", hp.toFixed(3));
      set("--hm", hm.toFixed(3));
      if (prev.h !== (hm > 0.5)) { prev.h = hm > 0.5; header.toggleAttribute("data-header", prev.h); }
      if (prev.p !== !!hs) { prev.p = !!hs; header.toggleAttribute("data-pill", prev.p); if (field) field.style.opacity = hs ? "0" : ""; }
    };
    const read = () => {
      raf = 0;
      const y = el.scrollTop;
      paint(y);
      if (y <= topOffset) { setMode("top"); last = y; return; }
      const dy = y - last;
      if (Math.abs(dy) < threshold) return;       // ignore jitter, keep the anchor
      setMode(dy > 0 ? "down" : "up");
      last = y;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    paint(el.scrollTop);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [ref, headerRef, topOffset, threshold]);
  return mode;
}

const CompactHeader = memo(function CompactHeader({ headerRef, place, address, onLocationClick, onSearchClick }) {
  return (
    <div className="home__header" ref={headerRef}>
      <button type="button" className="home__loc" onClick={onLocationClick}>
        <span className="home__locRow">
          <span className="home__locLabel">تحویل به</span>
          <span className="home__locPlace">{place}</span>
          <svg className="home__locChevron" viewBox="0 0 24 24" aria-hidden="true"><path d={CHEVRON} fill="currentColor" /></svg>
        </span>
        <span className="home__locAddr">{address}</span>
      </button>
      <button type="button" className="home__search" onClick={onSearchClick} aria-label="جستجو">
        <span className="home__searchGlass" aria-hidden="true">
          <span className="top-nav__search-glass" />
          <span className="top-nav__search-stroke" />
          <span className="top-nav__search-inner" />
        </span>
        <span className="home__searchGhost" aria-hidden="true" />
        <span className="home__searchText" aria-hidden="true">جستجوی کالا</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d={MAGNIFIER} fill="#000" /></svg>
      </button>
    </div>
  );
});

/**
 * HomePage — Pillars on top, a content card that scrolls inside itself,
 * BottomNavigation with the assistant.
 *
 *  sections        Carousel sections (defaults to the demo SECTIONS)
 *  place, address  delivery location
 *  safeTop / safeBottom  override the safe areas in px (default: env() insets —
 *                  Safari: top only; home-screen app: top + bottom)
 */
/** Everything inside the scrolling card — memoised so scroll-state changes never re-render it. */
const PageContent = memo(function PageContent({ sections, place, address, onLocationClick, onSearchClick }) {
  return (
    <div className="home__inner">
      <TopNavigation place={place} address={address} onLocationClick={onLocationClick} onSearchClick={onSearchClick} />
      <Category variant="v3" />
      <Banner />
      {sections.map(({ id, ...s }) => <Carousel key={id} {...s} />)}
    </div>
  );
});

const MemoPillars = memo(Pillars);

/** Home order: the first default section right after the banners, then شگفت‌انگیز. */
const HOME_ORDER = ["kharbar", "amazing", "labaniat", "nivea", "meat"];
const homeSections = (list) =>
  [...list].sort((a, b) => {
    const ia = HOME_ORDER.indexOf(a.id), ib = HOME_ORDER.indexOf(b.id);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });

const DEFAULT_SECTIONS = homeSections(SECTIONS);

export default function HomePage({
  sections = DEFAULT_SECTIONS,
  place = "محل‌کار",
  address = "ونک، هتل هما، ۴۰ دقیقه",
  safeTop,
  safeBottom,
  onLocationClick,
  onSearchClick,
  className = "",
  style,
}) {
  const scrollerRef = useRef(null);
  const headerRef = useRef(null);
  const mode = useScrollMode(scrollerRef, headerRef);
  // Pillars keep the shape they had when they start leaving (default from the
  // top, compact after scrolling up) — no resize while sliding out.
  const prevMode = useRef(mode);
  const leavingCompact = useRef(false);
  if (prevMode.current !== mode) {
    if (mode === "down") leavingCompact.current = prevMode.current === "up";
    prevMode.current = mode;
  }
  const leaving = leavingCompact.current ? "compact" : "default";

  // the two Pillars layers share the active venture and the horizontal scroll
  const [venture, setVenture] = useState("supermarket");
  const pillarsRef = useRef(null);
  useEffect(() => {
    const root = pillarsRef.current;
    if (!root) return;
    const navs = [...root.querySelectorAll(".pillars")];
    let syncing = false;
    const handlers = navs.map((nav) => {
      const h = () => {
        if (syncing) return;
        syncing = true;
        navs.forEach((o) => { if (o !== nav) o.scrollLeft = nav.scrollLeft; });
        requestAnimationFrame(() => { syncing = false; });
      };
      nav.addEventListener("scroll", h, { passive: true });
      return h;
    });
    return () => navs.forEach((nav, i) => nav.removeEventListener("scroll", handlers[i]));
  }, []);
  const [tab, setTab] = useState("home");
  // iOS home-screen apps report navigator.standalone (older iOS lacks display-mode)
  const [standalone, setStandalone] = useState(false);
  useEffect(() => {
    setStandalone(
      window.navigator.standalone === true || window.matchMedia?.("(display-mode: standalone)").matches
    );
  }, []);
  const vars = {};
  if (safeTop != null) vars["--safe-top"] = `${safeTop}px`;
  if (safeBottom != null) vars["--safe-bottom"] = `${safeBottom}px`;

  const scrollToTop = useCallback(() => {
    scrollerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div
      className={`home ${className}`.trim()}
      data-mode={mode}
      data-leaving={leaving}
      data-standalone={standalone ? "" : undefined}
      style={{ ...vars, ...style }}
    >
      <div className="home__backdrop" />
      {/* top: safe area + Pillars */}
      <div className="home__chrome">
        <div className="home__chromeBg" />
        <div ref={pillarsRef}>
          <div className="home__pillars home__pillars--default" aria-hidden={mode !== "top"} inert={mode !== "top" ? "" : undefined}>
            <MemoPillars collapsed={false} activeId={venture} onChange={setVenture} />
          </div>
          <div className="home__pillars home__pillars--compact" aria-hidden={mode !== "up"} inert={mode !== "up" ? "" : undefined}>
            <MemoPillars collapsed activeId={venture} onChange={setVenture} />
          </div>
        </div>
      </div>

      {/* contentFrame */}
      <div className="home__card">
        <CompactHeader headerRef={headerRef} place={place} address={address} onLocationClick={onLocationClick} onSearchClick={onSearchClick} />
        <div className="home__scroller" ref={scrollerRef}>
          <PageContent sections={sections} place={place} address={address} onLocationClick={onLocationClick} onSearchClick={onSearchClick} />
        </div>
      </div>

      <BottomNavigation
        variant="assistant"
        activeId={tab}
        onSelect={(id) => (id === "home" && tab === "home" ? scrollToTop() : setTab(id))}
        style={{ position: "absolute" }}
      />
    </div>
  );
}
