import { useLayoutEffect, useRef, useState } from "react";
import "./Category.css";

import pharmacy from "./assets/pharmacy.png";
import confectionary from "./assets/confectionary.png";
import flower from "./assets/flower.png";
import icecream from "./assets/icecream.png";
import protein from "./assets/protein.png";
import fruit from "./assets/fruit.png";
import petshop from "./assets/petshop.png";
import vegetable from "./assets/vegetable.png";
import bread from "./assets/bread.png";

/*
 * Artwork geometry copied from Figma, per card:
 *   box   { x, y, size }  frame of the artwork inside the card (px)
 *   inner                 size of the image layer inside that frame (64 default)
 *   rot                   rotation in degrees (V2 tilt)
 *   inset                 % inset of the image inside its layer (Figma image crop)
 *   labelTop / labelX     label position tweaks (px)
 * Items are listed right → left (RTL order).
 */

// tilted-art presets used by V2
const TILT12 = { box: { x: -1.954, y: -21.953, size: 75.908 }, rot: -12 };
const TILT4 = { box: { x: 1.846, y: -18.154, size: 68.309 }, rot: -4 };

export const CATEGORY_V1 = [
  [
    { id: "pharmacy",      title: "داروخانه", src: pharmacy,      box: { x: 18, y: 9,  size: 64 } },
    { id: "confectionary", title: "شیرینی",   src: confectionary, box: { x: 18, y: 10, size: 64 } },
    { id: "flower",        title: "گل‌فروشی", src: flower,        box: { x: 18, y: 11, size: 64 } },
    { id: "juice",         title: "آبمیوه",   src: icecream,      box: { x: 18, y: 11, size: 64 }, inset: 5.7 },
  ],
  [
    { id: "protein",   title: "پروتئینی",      src: protein,   box: { x: 18, y: 9,  size: 64 }, inset: 5.88, labelX: 0.5 },
    { id: "fruit-veg", title: "میوه/ سبزیجات", src: fruit,     box: { x: 18, y: 10, size: 64 } },
    { id: "petshop",   title: "پت شاپ",        src: petshop,   box: { x: 18, y: 11, size: 64 }, inset: 5.41 },
    { id: "vegetable", title: "سبزیجات",       src: vegetable, box: { x: 18, y: 11, size: 64 }, labelX: 0.5 },
  ],
];

export const CATEGORY_V2 = [
  [
    { id: "pharmacy",      title: "داروخانه", src: pharmacy,      ...TILT4 },
    { id: "confectionary", title: "شیرینی",   src: confectionary, ...TILT4 },
    { id: "flower",        title: "گل‌فروشی", src: flower,        ...TILT12 },
    { id: "icecream",      title: "بستنی",    src: icecream,      ...TILT12, inset: 5.7 },
    { id: "protein",       title: "پروتئینی", src: protein,       ...TILT12, inset: 5.88, labelX: 0.5 },
  ],
  [
    { id: "protein-2", title: "پروتئینی", src: protein, ...TILT4, inset: 5.88, labelX: 0.5 },
    { id: "fruit",     title: "میوه",     src: fruit,   box: { x: 4, y: -16, size: 64 }, rot: 0, labelX: 0.5 },
    { id: "petshop",   title: "پت شاپ",   src: petshop, box: { x: -1.954, y: -24.953, size: 75.908 }, rot: -12, inset: 5.41 },
    { id: "bread",     title: "نان",      src: bread,   box: { x: -3.733, y: -24.733, size: 79.466 }, rot: -12, inner: 67, labelTop: 54, labelX: 0.5 },
    { id: "flower-2",  title: "گل",       src: flower,  box: { x: -1.954, y: -17.953, size: 75.908 }, rot: -12 },
  ],
];

function Art({ src, box, inner = 64, rot = 0, inset = 0 }) {
  const imgSize = 100 - inset * 2;
  return (
    <span
      className="category__art"
      style={{ left: box.x, top: box.y, width: box.size, height: box.size }}
      aria-hidden="true"
    >
      <span
        className="category__art-inner"
        style={{ width: inner, height: inner, transform: rot ? `rotate(${rot}deg)` : undefined }}
      >
        <img
          src={src}
          alt=""
          draggable={false}
          loading="lazy"
          style={{
            left: `${inset}%`,
            top: `${inset}%`,
            width: `${imgSize}%`,
            height: `${imgSize}%`,
          }}
        />
      </span>
    </span>
  );
}

/**
 * Category — two-row horizontal carousel. Both rows live in ONE scroller,
 * so they always scroll together.
 *
 * Props
 *  variant   "v1" (96×96 cards) | "v2" (72×80 cards, tilted art)
 *  rows      [[item, …], [item, …]] — defaults to the Figma content
 *  onSelect(item)  called when a category is tapped
 */
export default function Category({ variant = "v1", rows, onSelect, className = "", ...rest }) {
  const data = rows ?? (variant === "v2" ? CATEGORY_V2 : CATEGORY_V1);

  // When the container is wider than the rows, scale everything up so the
  // rows fill it (no empty space on wide screens). Never scales down.
  const scrollerRef = useRef(null);
  const trackRef = useRef(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const sc = scrollerRef.current, tr = trackRef.current;
    if (!sc || !tr) return;
    const measure = () => {
      // natural (unscaled) width of the widest row, from CSS sizes
      let natural = 0;
      for (const row of tr.children) {
        const cs = getComputedStyle(row);
        const items = [...row.children];
        const w = items.reduce((sum, el) => sum + parseFloat(getComputedStyle(el).width), 0)
          + parseFloat(cs.columnGap || cs.gap || 0) * Math.max(items.length - 1, 0)
          + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
        natural = Math.max(natural, w);
      }
      if (!natural) return;
      const next = Math.max(1, sc.clientWidth / natural);
      setScale((s) => (Math.abs(s - next) < 0.001 ? s : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(sc);
    return () => ro.disconnect();
  }, [data]);

  return (
    <section className={`category category--${variant} ${className}`.trim()} aria-label="دسته‌بندی‌ها" {...rest}>
      <div className="category__scroller" ref={scrollerRef}>
        <div className="category__track" ref={trackRef} style={scale > 1 ? { zoom: scale } : undefined}>
          {data.map((row, r) => (
            <div className="category__row" key={r}>
              {row.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="category__item"
                  onClick={() => onSelect?.(item)}
                >
                  <span
                    className="category__label"
                    dir="auto"
                    style={{
                      top: item.labelTop,
                      left: item.labelX ? `calc(50% + ${item.labelX}px)` : undefined,
                    }}
                  >
                    {item.title}
                  </span>
                  <Art {...item} />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
