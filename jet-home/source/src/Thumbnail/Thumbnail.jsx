import { useRef } from "react";
import { squirclePath, useSize, useId } from "../shared/squircle";
import "./Thumbnail.css";

/**
 * Thumbnail
 *  src, alt
 *  hasBackground  true  → white squircle + soft radial gray + 1px #EFEEEB inner stroke
 *                 false → white squircle only (used on white cards)
 */
export default function Thumbnail({ src, alt = "", hasBackground = true, className = "", style, children }) {
  const ref = useRef(null);
  const { w, h } = useSize(ref);
  const id = useId();
  const d = squirclePath(w, h, 24, 0.6);

  return (
    <div ref={ref} className={`thumb ${className}`.trim()} style={style}>
      {/* fill: white */}
      <svg className="thumb__svg" viewBox={`0 0 ${w || 1} ${h || 1}`} aria-hidden="true">
        <path d={d} fill="#ffffff" />
      </svg>

      {src && <img className="thumb__img" src={src} alt={alt} draggable={false} loading="lazy" />}

      {hasBackground && (
        <svg className="thumb__svg" viewBox={`0 0 ${w || 1} ${h || 1}`} aria-hidden="true">
          <defs>
            {/* grayBackground: radial, centre 50/50, rx 57%·w, ry 50%·h */}
            <radialGradient
              id={`${id}g`}
              gradientUnits="objectBoundingBox"
              cx="0.5" cy="0.5" r="0.5"
              gradientTransform="translate(0.5 0.5) scale(1.1403 1) translate(-0.5 -0.5)"
            >
              <stop offset="0" stopColor="rgb(47,43,37)" stopOpacity="0" />
              <stop offset="1" stopColor="rgb(47,43,37)" stopOpacity="0.06" />
            </radialGradient>
            <clipPath id={`${id}c`}>
              <path d={d} />
            </clipPath>
          </defs>
          <path d={d} fill={`url(#${id}g)`} />
          {/* 1px INSIDE stroke = 2px centred stroke clipped to the shape */}
          <path d={d} fill="none" stroke="#efeeeb" strokeWidth="2" clipPath={`url(#${id}c)`} />
        </svg>
      )}
      {children}
    </div>
  );
}
