import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./Banner.css";

import snacks from "./assets/snacks.webp";
import installments from "./assets/installments.webp";
import pril from "./assets/pril.webp";

/*
 * Each banner:
 *  bg / fg            card background / text colour
 *  buttonBg / buttonFg button background / label + arrow colour
 *  title              array of lines
 *  art                { src, width }  artwork on the left, 148px tall
 * Order = visual order right → left (RTL).
 */
export const DEFAULT_BANNERS = [
  {
    id: "football-snacks",
    bg: "#15803d", fg: "#ffffff", buttonBg: "#ffffff", buttonFg: "#15803d",
    title: ["موج تخفیف", "تنقلات فوتبالی"],
    description: "با امکان پرداخت قسطی",
    cta: "مشاهده",
    art: { src: snacks, width: 148 },
  },
  {
    id: "installments",
    bg: "#462dac", fg: "#ffffff", buttonBg: "#ffffff", buttonFg: "#2424c4",
    title: ["چهار قسطه", "پرداخت کن!"],
    description: "خرید اعتباری از سوپرمارکت",
    cta: "مشاهده",
    art: { src: installments, width: 149.5 },
  },
  {
    id: "pril",
    bg: "#b4eac0", fg: "#025633", buttonBg: "#025633", buttonFg: "#b4eac0",
    title: ["تخفیف تا ۱۵٪", "مایع ظرف‌شویی پریل"],
    description: "این تمیزی جریان داره!",
    cta: "مشاهده",
    art: { src: pril, width: 148 },
  },
];

function ArrowLeft(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.22556 4.10744L3.33301 9.99999L9.22556 15.8926L10.4041 14.714L6.52467 10.8333L17.4997 10.8333V9.16666L6.52467 9.1666L10.4041 5.28595L9.22556 4.10744Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Banner — infinite, auto-scrolling promo carousel.
 *
 * Built with transforms (no native horizontal scrolling): every banner is
 * positioned from the current index, swipes are tracked with pointer events.
 * This behaves identically on iPhone (WebKit), Android and desktop — native
 * RTL scroll + scroll-snap + programmatic scrolling is unreliable on iOS.
 *
 * Props
 *  items          banners (see DEFAULT_BANNERS)
 *  initialIndex   banner shown first (default 1 = the Figma state, with
 *                 both neighbours peeking)
 *  interval       auto-scroll delay in ms (default 2500); 0 turns it off
 *  onSelect(item) tap on a banner
 *  onChange(i)    index of the banner now in the centre
 *
 * Auto-scroll pauses while the user drags, when off-screen and when the
 * tab is hidden.
 */
const GAP = 10;
const mod = (n, m) => ((n % m) + m) % m;

export default function Banner({
  items = DEFAULT_BANNERS,
  initialIndex = 1,
  interval = 2500,
  onSelect,
  onChange,
  className = "",
  ...rest
}) {
  const n = items.length;
  const viewportRef = useRef(null);
  const [cw, setCw] = useState(390);                       // viewport width
  const [cur, setCur] = useState(Math.min(Math.max(initialIndex, 0), Math.max(n - 1, 0)));
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const prevCur = useRef(cur);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // card width: 358 on a 390 screen, Figma limits 328–360
  const W = Math.min(360, Math.max(328, cw - 32));
  const step = W + GAP;
  const left0 = (cw - W) / 2;                               // centred card's left edge

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const read = () => setCw(el.clientWidth || 390);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const go = useCallback((d) => setCur((c) => c + d), []);

  useEffect(() => { onChangeRef.current?.(mod(cur, n)); }, [cur, n]);

  // autoplay: steady rhythm, paused while dragging / hidden / off-screen
  const visibleRef = useRef(true);
  useEffect(() => {
    if (n < 2 || !(interval > 0) || dragging) return;
    const id = setInterval(() => { if (visibleRef.current && !document.hidden) go(1); }, interval);
    return () => clearInterval(id);
  }, [n, interval, dragging, go, cur]);
  useEffect(() => {
    const el = viewportRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => { visibleRef.current = e.isIntersecting; });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // swipe (horizontal); vertical page scrolling stays native (touch-action: pan-y)
  const start = useRef(null);
  const moved = useRef(false);
  const onPointerDown = (e) => {
    if (n < 2 || (e.pointerType === "mouse" && e.button !== 0)) return;
    start.current = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId, axis: null };
    moved.current = false;
  };
  const onPointerMove = (e) => {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (!s.axis) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      s.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (s.axis === "x") { e.currentTarget.setPointerCapture?.(e.pointerId); setDragging(true); }
    }
    if (s.axis !== "x") return;
    moved.current = true;
    setDrag(dx);
  };
  const onPointerUp = (e) => {
    const s = start.current;
    start.current = null;
    if (!s || s.axis !== "x") return;
    const dx = e.clientX - s.x;
    const v = dx / Math.max(1, performance.now() - s.t);       // px/ms
    // RTL: dragging right reveals the banner on the left = next
    if (dx > step * 0.25 || v > 0.4) go(1);
    else if (dx < -step * 0.25 || v < -0.4) go(-1);
    setDrag(0);
    setDragging(false);
  };

  // positions: 3 copies so neighbours always exist on both sides
  const copies = n > 1 ? 3 : 1;
  const total = n * copies;
  const half = Math.floor(total / 2);
  const offsetOf = (k, c) => mod(k - c + half, total) - half;  // in [-half, half)
  const prev = prevCur.current;
  useEffect(() => { prevCur.current = cur; }, [cur]);

  const slides = [];
  for (let k = 0; k < total; k += 1) {
    const item = items[mod(k, n)];
    const off = offsetOf(k, cur);
    const wrapped = Math.abs(off - offsetOf(k, prev)) > 1;      // jumped to the other side, off-screen
    const x = left0 - off * step + drag;
    const isCurrent = off === 0;
    slides.push(
      <a
        key={k}
        href={item.href}
        className={`banner__item${isCurrent ? " is-current" : ""}`}
        aria-hidden={isCurrent ? undefined : true}
        tabIndex={isCurrent ? undefined : -1}
        aria-label={isCurrent ? `${item.title.join(" ")} — ${item.description}` : undefined}
        draggable={false}
        onClick={(e) => {
          if (moved.current) { e.preventDefault(); return; }
          if (onSelect) { if (!item.href) e.preventDefault(); onSelect(item); }
        }}
        style={{
          width: W,
          transform: `translate3d(${x}px, 0, 0)`,
          transition: dragging || wrapped ? "none" : undefined,
          visibility: Math.abs(off) > 2 ? "hidden" : undefined,
          "--banner-bg": item.bg,
          "--banner-fg": item.fg,
          "--banner-btn-bg": item.buttonBg,
          "--banner-btn-fg": item.buttonFg,
        }}
      >
        {item.art && (
          <span className="banner__art" style={{ width: item.art.width }} aria-hidden="true">
            <img src={item.art.src} alt="" draggable={false} decoding="async" />
          </span>
        )}
        <span className="banner__content">
          <span className="banner__text">
            <span className="banner__title">
              {item.title.map((line, i) => (
                <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>
              ))}
            </span>
            <span className="banner__desc">{item.description}</span>
          </span>
          <span className="banner__action">
            <span className="banner__button">
              <span className="banner__button-text">{item.cta}</span>
              <ArrowLeft className="banner__button-icon" />
            </span>
          </span>
        </span>
      </a>
    );
  }

  return (
    <section className={`banner ${className}`.trim()} aria-roledescription="carousel" {...rest}>
      <div
        className="banner__viewport"
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {slides}
      </div>
    </section>
  );
}
