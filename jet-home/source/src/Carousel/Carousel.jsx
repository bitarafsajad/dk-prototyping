import ProductCard from "../ProductCard";
import SectionHeading from "./SectionHeading";
import "./Carousel.css";

/**
 * Carousel — a section heading + a horizontally scrolling row of ProductCards.
 *
 *  appearance   "default" (white, borderless cards) | "promotion" (coloured band
 *               with wavy edges, white cards)
 *  color        promotion background (any palette colour)
 *  title, description, href, onTitleClick   → SectionHeading
 *  endsAt       Date/timestamp → countdown heading (e.g. شگفت‌انگیز)
 *  visual       { src, alt } artwork shown top-left (promotion "isVisualized")
 *  products     ProductCard `product` objects
 *  hasTopPattern / hasBottomPattern   wavy edges (promotion)
 *  line         "single" | "double" (two rows that scroll together)
 *  isPriceOnly  hide titles (Figma's double variant shows price-only cards)
 *  onQuantityChange(q, product)
 */
const TOP = "M26 3.00031V2.00012C20 2.00012 19 0 13 0C7 0 6 2.00012 0 2.00012V3.00031H26Z";
const BOTTOM = "M26 0V1.00019C20 1.00019 19 3.00031 13 3.00031C7 3.00031 6 1.00019 0 1.00019V0H26Z";
let waveId = 0;

/** Wavy 3px edge, reproduced from Figma's own SVG export of the pattern fill. */
function Wave({ edge }) {
  const id = `cw${edge}${(waveId += 1)}`;
  const top = edge === "top";
  return (
    <span className={`carousel__wave carousel__wave--${edge}`} aria-hidden="true">
      <svg width="100%" height="3">
        <defs>
          <pattern
            id={id}
            patternUnits="userSpaceOnUse"
            patternTransform={top ? "matrix(39.52 0 0 4.56047 0 0)" : "matrix(39.52 0 0 4.56047 174.74 -1.56047)"}
            viewBox="0 0 26 3.00031"
            preserveAspectRatio="none"
            width="1"
            height="1"
          >
            <path d={top ? TOP : BOTTOM} fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="3" fill={`url(#${id})`} />
      </svg>
    </span>
  );
}

export default function Carousel({
  appearance = "default",
  color,
  title,
  description,
  href,
  onTitleClick,
  endsAt,
  visual,
  products = [],
  hasTopPattern = true,
  hasBottomPattern = true,
  line = "single",
  isPriceOnly = false,
  onQuantityChange,
  className = "",
  style,
}) {
  const promo = appearance === "promotion";
  const heading = (
    <SectionHeading
      title={title}
      description={description}
      appearance={promo ? "dark" : "light"}
      endsAt={endsAt}
      href={href}
      onClick={onTitleClick}
      visual={promo && !!visual}
    />
  );
  const card = (p, i, priceOnly) => (
    <ProductCard
      key={p.id ?? i}
      product={p}
      appearance={promo ? "whiteBackground" : "noBackground"}
      width={promo ? 136 : 128}
      isPriceOnly={priceOnly}
      fill={promo}
      onQuantityChange={onQuantityChange}
    />
  );
  const half = Math.ceil(products.length / 2);
  const cards = (
    <div className="carousel__scroller">
      {line === "double" ? (
        <div className="carousel__track carousel__track--double">
          <div className="carousel__row">{products.slice(0, half).map((p, i) => card(p, i, isPriceOnly))}</div>
          <div className="carousel__row">{products.slice(half).map((p, i) => card(p, i + half, isPriceOnly))}</div>
        </div>
      ) : (
        <div className="carousel__track">{products.map((p, i) => card(p, i, isPriceOnly))}</div>
      )}
    </div>
  );

  return (
    <section
      className={`carousel carousel--${appearance} ${className}`.trim()}
      style={{ ...(color ? { "--carousel-bg": color } : null), ...style }}
      aria-label={title}
    >
      {promo ? (
        <>
          {hasTopPattern && <Wave edge="top" />}
          <div className="carousel__content">
            {visual && <img className="carousel__visual" src={visual.src} alt={visual.alt || ""} loading="lazy" decoding="async" />}
            {heading}
            {cards}
          </div>
          {hasBottomPattern && <Wave edge="bottom" />}
        </>
      ) : (
        <>
          {heading}
          {cards}
        </>
      )}
    </section>
  );
}
