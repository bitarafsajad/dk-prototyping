import "./Price.css";

const WAVE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='5' viewBox='0 0 14 5'%3E%3Cpath d='M0 0C1.79986 0 2.7808 0.32172 3.6748 0.577148C4.40766 0.786528 5.22074 1 7 1C8.77926 1 9.59234 0.786528 10.3252 0.577148C11.2192 0.32172 12.2001 0 14 0V4C12.8 4 12.2806 4.17834 11.4248 4.42285C10.4078 4.71344 9.22043 5 7 5C4.77957 5 3.59224 4.71344 2.5752 4.42285C1.71943 4.17834 1.19996 4 0 4V0Z'/%3E%3C/svg%3E\")";

function Toman(props) {
  return (
    <svg viewBox="0 0 13 8" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8.59401 1.71429H3.76766V0H8.59401V1.71429ZM12.891 2.67669C12.7976 1.93985 12.6575 1.17293 12.4862 0.360902L10.8048 1.02256C11.0228 1.89474 11.194 2.75188 11.3497 3.57895C11.4431 4.10526 11.521 4.57143 11.5832 5.03759C11.0383 5.23308 10.2443 5.41353 9.18563 5.56391C7.83114 5.7594 6.3988 5.84962 4.90419 5.84962C4.06347 5.84962 3.40958 5.80451 2.92695 5.72932C2.44431 5.6391 2.08623 5.47368 1.82156 5.23308C1.55689 4.99248 1.43234 4.61654 1.43234 4.1203C1.43234 3.57895 1.47904 2.93233 1.54132 2.16541L0.311377 2C0.28024 2.09023 0.264671 2.21053 0.249102 2.3609C0.186826 2.79699 0.124551 3.21805 0.0778443 3.60902C0.0311377 4.01504 0 4.37594 0 4.70677C0 5.95489 0.40479 6.81203 1.1988 7.29323C2.00838 7.7594 3.14491 8 4.62395 8C5.82275 8 6.97485 7.92481 8.06467 7.78947C9.17006 7.65414 10.1353 7.44361 10.9449 7.17293C11.4431 6.99248 11.8323 6.79699 12.1281 6.6015C12.424 6.40601 12.6419 6.15038 12.782 5.83459C12.9222 5.5188 13 5.11278 13 4.58647C13 4.03008 12.9533 3.38346 12.8443 2.66165L12.891 2.67669Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Formats 1399000 → "۱٬۳۹۹٬۰۰۰" (Persian digits, Arabic thousands separator). */
export function formatPrice(v) {
  if (typeof v === "string") return v;
  return Math.round(v)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "٬")
    .replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

/**
 * Price
 *  finalPrice       number | string
 *  previousPrice    number | string (shown with the red strike when hasDiscount)
 *  hasDiscount      lime wave highlight + previous price
 *  state            "available" | "outOfStock"
 *  isPricePending   shows `pendingText` instead of a price
 *  direction        "rtl" | "ltr"  (alignment)
 */
export default function Price({
  finalPrice = 1399000,
  previousPrice = 1636830,
  hasDiscount = true,
  state = "available",
  isPricePending = false,
  pendingText = "قیمت با داروخانه",
  direction = "rtl",
  className = "",
  style,
}) {
  const out = state === "outOfStock";
  const cls = `price price--${direction}${out ? " price--out" : ""} ${className}`.trim();

  if (isPricePending) {
    return (
      <div className={cls} style={style}>
        <span className="price__pending">{pendingText}</span>
      </div>
    );
  }

  const discounted = hasDiscount && !out;
  return (
    <div className={cls} style={{ "--price-wave": WAVE, ...style }}>
      <div className="price__final">
        <div className="price__row">
          <Toman className="price__toman" style={{ color: out ? "#bdbdbd" : "#000" }} />
          <span className="price__value">{formatPrice(finalPrice)}</span>
        </div>
        {discounted && <span className="price__highlight" aria-hidden="true" />}
      </div>
      {discounted && previousPrice != null && (
        <div className="price__prev">
          <s className="price__prev-value" style={{ textDecoration: "none" }}>{formatPrice(previousPrice)}</s>
          <span className="price__strike" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
