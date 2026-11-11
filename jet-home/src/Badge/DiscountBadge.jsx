import { useRef } from "react";
import { squirclePath, useSize, useId, figmaLinearPoints } from "../shared/squircle";
import amazingIcon from "../assets/amazing-icon.png";
import "./Badge.css";

// Figma gradientTransform of the badge fill
const GT = [[-0.748, -0.252, 1], [0.252, -0.252, 0.5]];

/** Converts a number to Persian digits (۰–۹). */
export const toFa = (v) => String(v).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

/**
 * DiscountBadge
 *  percent  number (e.g. 17) or ready-made label
 *  variant  "general" | "amazing" (adds the amazing-offer icon)
 */
export default function DiscountBadge({ percent = 17, label, variant = "general", className = "", style }) {
  const ref = useRef(null);
  const { w, h } = useSize(ref);
  const id = useId();
  const d = squirclePath(w, h, 12, 0.6);
  const g = w && h ? figmaLinearPoints(GT, w, h) : { x1: 0, y1: 0, x2: 1, y2: 1 };
  const text = label ?? `-${toFa(percent)} ٪`;

  return (
    <span ref={ref} className={`dbadge dbadge--${variant} ${className}`.trim()} style={style}>
      <svg className="dbadge__bg" viewBox={`0 0 ${w || 1} ${h || 1}`} aria-hidden="true">
        <defs>
          <linearGradient id={`${id}g`} gradientUnits="userSpaceOnUse" x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2}>
            <stop offset="0" stopColor="#caf200" />
            <stop offset="1" stopColor="#ffffb2" />
          </linearGradient>
          <clipPath id={`${id}c`}><path d={d} /></clipPath>
        </defs>
        <path d={d} fill={`url(#${id}g)`} />
        <path d={d} fill="none" stroke="#fff" strokeWidth="2" clipPath={`url(#${id}c)`} />
      </svg>
      {variant === "amazing" && <img className="dbadge__icon" src={amazingIcon} alt="" draggable={false} />}
      <span className="dbadge__label">{text}</span>
    </span>
  );
}
