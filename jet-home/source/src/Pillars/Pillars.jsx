import { useEffect, useRef, useState } from "react";
import "./Pillars.css";

import pharmacyImg from "./assets/pharmacy.png";
import styleImg from "./assets/style.png";
import bazaarImg from "./assets/bazaar.png";
import goldImg from "./assets/gold.png";
import supermarketImg from "./assets/supermarket.png";
import digikalaImg from "./assets/digikala.png";
import allImg from "./assets/all.png";

/**
 * Each icon sits in a 32×32 slot. `w/h/x/y` reproduce the exact
 * size and offset of the image layer inside that slot in Figma
 * (some artwork intentionally overhangs the slot).
 * Order = visual order in RTL (first item is rightmost).
 */
export const DEFAULT_PILLARS = [
  { id: "digikala",    title: "دیجی‌کالا",     wide: true, icon: { src: digikalaImg,    w: 34,     h: 34, x: -1,    y: 0.333 } },
  { id: "supermarket", title: "سوپرمارکت",     wide: true, icon: { src: supermarketImg, w: 31,     h: 32, x: 0.5,   y: 0 } },
  { id: "gold",        title: "طلای دیجیتال",              icon: { src: goldImg,        w: 36,     h: 36, x: -2,    y: 0 } },
  { id: "bazaar",      title: "بازار",                     icon: { src: bazaarImg,      w: 36,     h: 36, x: -2,    y: 0 } },
  { id: "style",       title: "استایل",                    icon: { src: styleImg,       w: 36,     h: 36, x: -2,    y: 0 } },
  { id: "pharmacy",    title: "داروخانه",                  icon: { src: pharmacyImg,    w: 32.937, h: 35, x: 0.032, y: -1 } },
];

/**
 * Pillars — horizontally scrolling venture tabs.
 *
 * Props
 *  items          array of { id, title, icon:{src,w,h,x,y}, wide? }
 *  activeId       controlled active id (optional)
 *  defaultActiveId uncontrolled initial id (default "supermarket")
 *  onChange(id)   called when a venture is tapped
 *  onAllClick()   called when the grid ("all") button is tapped
 *  collapsed      force the compact (text‑only) state
 *  collapseOnScroll  scroll behaviour:
 *                   at top of page   -> default variant (icons + labels)
 *                   scrolling up     -> collapsed variant (text only)
 *                   scrolling down   -> hidden (slides up out of view)
 *  collapseOffset  px from the top still treated as "top" (default 8)
 *  directionThreshold px of movement needed to switch direction (default 6)
 *  scrollContainer element to watch instead of window (optional)
 */
export default function Pillars({
  items = DEFAULT_PILLARS,
  activeId,
  defaultActiveId = "supermarket",
  onChange,
  onAllClick,
  collapsed,
  collapseOnScroll = false,
  collapseOffset = 8,
  directionThreshold = 6,
  scrollContainer,
  className = "",
  ...rest
}) {
  const [innerActive, setInnerActive] = useState(defaultActiveId);
  const current = activeId ?? innerActive;

  // "top" = default variant, "collapsed" = compact (only while scrolling up),
  // "hidden" = slid away while scrolling down
  const [mode, setMode] = useState("top");
  const autoMode = collapsed === undefined && collapseOnScroll ? mode : "top";
  const isCollapsed = collapsed ?? autoMode === "collapsed";
  const isHidden = collapsed === undefined && autoMode === "hidden";

  const itemRefs = useRef({});
  const navRef = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!collapseOnScroll || collapsed !== undefined) return;
    const target = scrollContainer || window;
    const read = () =>
      scrollContainer ? scrollContainer.scrollTop : window.scrollY;
    let lastY = read();
    let raf = 0;
    const update = () => {
      const y = read();
      if (y <= collapseOffset) {
        setMode("top");                     // reached the top -> default variant
      } else if (Math.abs(y - lastY) >= directionThreshold) {
        setMode(y < lastY ? "collapsed" : "hidden"); // up -> compact, down -> hide
      } else {
        return;                              // ignore tiny jitter, keep lastY
      }
      lastY = y;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      target.removeEventListener("scroll", onScroll);
    };
  }, [collapseOnScroll, collapsed, collapseOffset, directionThreshold, scrollContainer]);

  // Keep the active pill in view (horizontal only, never scrolls the page)
  useEffect(() => {
    const nav = navRef.current;
    const el = itemRefs.current[current];
    if (!nav || !el) return;
    const n = nav.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const pad = 16;
    let delta = 0;
    if (r.left < n.left + pad) delta = r.left - n.left - pad;
    else if (r.right > n.right - pad) delta = r.right - n.right + pad;
    if (delta) nav.scrollBy({ left: delta, behavior: mounted.current ? "smooth" : "auto" });
    mounted.current = true;
  }, [current]);

  const select = (id) => {
    if (activeId === undefined) setInnerActive(id);
    onChange?.(id);
  };

  return (
    <nav
      ref={navRef}
      className={`pillars${isCollapsed ? " pillars--collapsed" : ""}${isHidden ? " pillars--hidden" : ""} ${className}`.trim()}
      aria-hidden={isHidden || undefined}
      aria-label="ventures"
      {...rest}
    >
      <div className="pillars__track" role="tablist">
        <button
          type="button"
          className="pillars__item pillars__all"
          aria-label="همه سرویس‌ها"
          onClick={onAllClick}
        >
          <span className="pillars__icon" aria-hidden="true">
            <img src={allImg} alt="" style={{ width: 32, height: 32, left: 0, top: 0 }} />
          </span>
        </button>

        {items.map(({ id, title, icon, wide }) => {
          const active = id === current;
          return (
            <button
              key={id}
              ref={(el) => (itemRefs.current[id] = el)}
              type="button"
              role="tab"
              aria-selected={active}
              className={`pillars__item${wide ? " pillars__item--wide" : ""}${active ? " is-active" : ""}`}
              onClick={() => select(id)}
            >
              <span className="pillars__icon" aria-hidden="true">
                <img
                  src={icon.src}
                  alt=""
                  draggable={false}
                  style={{ width: icon.w, height: icon.h, left: icon.x, top: icon.y }}
                />
              </span>
              <span className="pillars__label">{title}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
