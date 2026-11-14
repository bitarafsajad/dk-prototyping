import "./Badge.css";

/** TextBadge — small grey tag shown on the product image (e.g. کالابرگ، پرفروش). */
export default function TextBadge({ children, className = "", style }) {
  return (
    <span className={`tbadge ${className}`.trim()} style={style}>
      <span className="tbadge__label">{children}</span>
    </span>
  );
}
