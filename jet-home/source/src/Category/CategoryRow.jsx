import "./CategoryRow.css";
import shop from "./assets/row-shop.webp";
import hypermarket from "./assets/row-hypermarket.webp";
import bread from "./assets/row-bread.webp";
import fruit from "./assets/row-fruit.webp";
import meat from "./assets/row-meat.webp";
import sweet from "./assets/row-sweet.webp";
import icecream from "./assets/row-icecream.webp";
import petshop from "./assets/row-petshop.webp";

/**
 * CategoryRow (Figma 1184:2 / CategoryRow 1189:561)
 * Two-row RTL grid in ONE horizontal scroller (both rows move together).
 * Rule: large = 2 × small + gap at every width; small = max(78, (W − 16) / 4.35 − 8).
 * size: "large" spans two columns (artwork 64, label 13/20 right),
 *       "small" one column (artwork 56, label 11/16 centred), max 2 lines.
 */
export const CATEGORY_ROW = [
  { id: "local-supers", title: "سوپرهای محل", size: "large", bg: "yellow", src: shop },
  { id: "hypermarket", title: "هایپر مارکت", size: "large", bg: "green", src: hypermarket },
  { id: "bread", title: "نان", size: "small", bg: "brown", src: bread },
  { id: "fruit-veg", title: "میوه / سبزیجات", size: "small", bg: "lime", src: fruit },
  { id: "protein", title: "پروتئینی", size: "small", bg: "rose", src: meat },
  { id: "sweets", title: "شیرینی", size: "small", bg: "yellow", src: sweet },
  { id: "juice-icecream", title: "آبمیوه بستنی", size: "small", bg: "rose", src: icecream },
  { id: "petshop", title: "پت‌ شاپ", size: "small", bg: "blue", src: petshop },
];

export default function CategoryRow({ items = CATEGORY_ROW, onSelect, className = "", ...rest }) {
  return (
    <section className={`category-row ${className}`.trim()} aria-label="دسته‌بندی‌ها" {...rest}>
      <div className="category-row__grid">
        {items.map((it) => (
          <a
            key={it.id}
            href={it.href || "#"}
            className={`cat-item cat-item--${it.size} cat-bg-${it.bg}`}
            onClick={(e) => { if (!it.href) e.preventDefault(); onSelect?.(it); }}
            draggable={false}
          >
            <img
              className="cat-item__art"
              src={it.src}
              alt=""
              width={it.size === "large" ? 64 : 56}
              height={it.size === "large" ? 64 : 56}
              draggable={false}
              decoding="async"
            />
            <span className="cat-item__label-wrap"><span className="cat-item__label" dir="auto">{it.title}</span></span>
          </a>
        ))}
      </div>
    </section>
  );
}
