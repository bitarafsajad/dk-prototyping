import { Fragment, useLayoutEffect, useRef } from "react";
import { createLoopCarousel } from "./loopCarousel";
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
 * Banner — infinite, auto-scrolling promo carousel (snaps one banner at a time).
 *
 * Props
 *  items          banners (see DEFAULT_BANNERS)
 *  initialIndex   banner shown first (default 1 = the Figma state, with
 *                 both neighbours peeking)
 *  interval       auto-scroll delay in ms (default 2500); 0 turns it off
 *  onSelect(item) tap on a banner
 *  onChange(i)    index of the banner now in the centre
 *
 * Auto-scroll pauses while the user touches/drags or hovers the carousel,
 * when it is off-screen and when the tab is hidden.
 */
export default function Banner({
  items = DEFAULT_BANNERS,
  initialIndex = 1,
  interval = 2500,
  onSelect,
  onChange,
  className = "",
  ...rest
}) {
  const scrollerRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const loop = items.length > 1;
  // three identical sets: [copy][real][copy] -> endless in both directions
  const slides = loop ? [...items, ...items, ...items] : items;

  useLayoutEffect(() => {
    const sc = scrollerRef.current;
    if (!sc || !loop) return;
    const carousel = createLoopCarousel(sc, {
      count: items.length,
      interval: interval > 0 ? interval : Infinity,
      startIndex: Math.min(Math.max(initialIndex, 0), items.length - 1),
      onChange: (i) => onChangeRef.current?.(i),
    });
    return () => carousel.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, interval, loop]);

  return (
    <section className={`banner ${className}`.trim()} aria-roledescription="carousel" {...rest}>
      <div className="banner__scroller" ref={scrollerRef}>
        <div className="banner__track">
          {slides.map((item, k) => {
            const i = k % items.length;
            const isCopy = loop && (k < items.length || k >= items.length * 2);
            return (
              <a
                key={`${item.id}-${k}`}
                data-loop-slide=""
                href={item.href}
                className="banner__item"
                aria-hidden={isCopy || undefined}
                tabIndex={isCopy ? -1 : undefined}
                aria-label={isCopy ? undefined : `${item.title.join(" ")} — ${item.description}`}
                onClick={(e) => {
                  if (onSelect) { if (!item.href) e.preventDefault(); onSelect(item); }
                }}
                style={{
                  "--banner-bg": item.bg,
                  "--banner-fg": item.fg,
                  "--banner-btn-bg": item.buttonBg,
                  "--banner-btn-fg": item.buttonFg,
                }}
              >
                {item.art && (
                  <span className="banner__art" style={{ width: item.art.width }} aria-hidden="true">
                    <img src={item.art.src} alt="" draggable={false} loading={!isCopy && i === initialIndex ? "eager" : "lazy"} />
                  </span>
                )}
                <span className="banner__content">
                  <span className="banner__text">
                    <span className="banner__title">
                      {item.title.map((line, n) => (
                        <Fragment key={n}>{n > 0 && <br />}{line}</Fragment>
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
          })}
        </div>
      </div>
    </section>
  );
}
