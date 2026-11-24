import goldenWeek from "./assets/golden-week.gif";
import "./NarrowBanner.css";

/**
 * NarrowBanner — Banner / Property 1 = Narrow (Figma 1638:25533)
 * 390 × 71: padding 8 16, an animated GIF 358 × 55 (radius 16, FILL).
 * Width is fluid; the GIF keeps the 358:55 ratio.
 */
export default function NarrowBanner({
  src = goldenWeek,
  alt = "این هفته طلاییه! ۵۰ گرم طلا | تا ۹۹٪ تخفیف کالا | ارسال رایگان",
  href,
  onClick,
  className = "",
  style,
}) {
  const Tag = href || onClick ? "a" : "div";
  return (
    <div className={`nbanner ${className}`.trim()} style={style}>
      <Tag
        className="nbanner__gif"
        href={href || (onClick ? "#" : undefined)}
        onClick={onClick ? (e) => { if (!href) e.preventDefault(); onClick(e); } : undefined}
      >
        <img src={src} alt={alt} width="358" height="55" decoding="async" draggable={false} />
      </Tag>
    </div>
  );
}
