import { useRef, useState } from "react";
import Thumbnail from "../Thumbnail";
import Counter from "../Counter";
import Price from "../Price";
import { DiscountBadge, TextBadge } from "../Badge";
import { squirclePath, useSize, useId } from "../shared/squircle";
import "./ProductCard.css";

/**
 * ProductCard — built from Thumbnail, Counter, Badge and Price.
 *
 *  product = {
 *    title, supportingText, image, href,
 *    price, previousPrice, discountPercent,      // discountPercent > 0 → hasDiscount
 *    discountVariant: "general" | "amazing",
 *    textBadge,                                  // e.g. "کالابرگ" → hasTextBadge
 *    maxQuantity, state: "available" | "outOfStock", isPricePending
 *  }
 *  appearance   "noBackground" | "whiteBackground"
 *  isPriceOnly  hide title / supporting text
 *  quantity / onQuantityChange   controlled stepper (optional — uncontrolled by default)
 *  loading      stepper loader
 *  width        card width (default 128, responsive)
 *  fill         stretch to the row height (equal-height cards), price pinned to the bottom
 */
export default function ProductCard({
  product,
  appearance = "noBackground",
  isPriceOnly = false,
  quantity: controlledQty,
  onQuantityChange,
  loading = false,
  width = 128,
  fill = false,
  className = "",
  style,
}) {
  const [innerQty, setInnerQty] = useState(0);
  const quantity = controlledQty ?? innerQty;
  const setQty = (q) => {
    if (controlledQty === undefined) setInnerQty(q);
    onQuantityChange?.(q, product);
  };

  const {
    title, supportingText, image, href,
    price, previousPrice, discountPercent = 0, discountVariant = "general",
    textBadge, maxQuantity = Infinity, state = "available", isPricePending = false,
  } = product;

  const hasDiscount = discountPercent > 0;
  const white = appearance === "whiteBackground";

  // card background (white appearance): squircle + white → 90% white below the image
  const ref = useRef(null);
  const { w, h } = useSize(ref);
  const id = useId();
  const d = white ? squirclePath(w, h, 24, 0.6) : "";
  const fadeStart = Math.max((w || 128) - 4, 0); // px — starts right under the image (124 on a 128 card)

  const cls = [
    "pcard",
    white ? "pcard--white" : "pcard--noBg",
    white && hasDiscount && !isPriceOnly ? "pcard--pad8" : "",
    !white && hasDiscount && !isPriceOnly ? "pcard--pad4b" : "",
    fill ? "pcard--fill" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <article ref={ref} className={cls} style={{ width, ...style }}>
      {white && (
        <svg className="pcard__bg" viewBox={`0 0 ${w || 1} ${h || 1}`} aria-hidden="true">
          <defs>
            <linearGradient id={`${id}g`} gradientUnits="userSpaceOnUse" x1="0" y1={fadeStart} x2="0" y2={h || 1}>
              <stop offset="0" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path d={d} fill={`url(#${id}g)`} />
        </svg>
      )}

      {href && <a className="pcard__link" href={href} aria-label={title} />}

      <div className="pcard__media">
        <Thumbnail src={image} alt={title} hasBackground={!white} />
        {state !== "outOfStock" && (
          <div className="pcard__stepper">
            <Counter
              variant="float"
              quantity={quantity}
              max={maxQuantity}
              loading={loading}
              fluid
              onChange={setQty}
            />
          </div>
        )}
        {hasDiscount && (
          <DiscountBadge className="pcard__discount" percent={discountPercent} variant={discountVariant} />
        )}
        {textBadge && <TextBadge className="pcard__tag">{textBadge}</TextBadge>}
      </div>

      <div className="pcard__text">
        {!isPriceOnly && (
          <div className="pcard__textFrame">
            <p className="pcard__title">{title}</p>
            {supportingText && <p className="pcard__support">{supportingText}</p>}
          </div>
        )}
        <Price
          direction="rtl"
          finalPrice={price}
          previousPrice={previousPrice}
          hasDiscount={hasDiscount}
          state={state}
          isPricePending={isPricePending}
        />
      </div>
    </article>
  );
}
