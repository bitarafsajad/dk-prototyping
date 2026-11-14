import { useLayoutEffect, useState } from "react";

/**
 * Figma "corner smoothing" (squircle) path — same math Figma uses
 * (port of the figma-squircle algorithm, preserveSmoothing = false).
 * Returns an SVG path string for a w × h box.
 */
const rad = (deg) => (deg * Math.PI) / 180;

function cornerParams(radius, smoothing, budget) {
  let p = (1 + smoothing) * radius;
  const maxSmoothing = budget / radius - 1;
  smoothing = Math.min(smoothing, maxSmoothing);
  p = Math.min(p, budget);
  const arcMeasure = 90 * (1 - smoothing);
  const arc = Math.sin(rad(arcMeasure / 2)) * radius * Math.SQRT2;
  const alpha = (90 - arcMeasure) / 2;
  const p3ToP4 = radius * Math.tan(rad(alpha / 2));
  const beta = 45 * smoothing;
  const c = p3ToP4 * Math.cos(rad(beta));
  const d = c * Math.tan(rad(beta));
  const b = (p - arc - c - d) / 3;
  const a = 2 * b;
  return { a, b, c, d, p, arc, r: radius };
}

const n = (v) => Math.round(v * 1000) / 1000;

export function squirclePath(w, h, radius, smoothing = 0.6) {
  if (!w || !h) return "";
  const budget = Math.min(w, h) / 2;
  const r = Math.min(radius, budget);
  if (r <= 0) return `M0 0H${n(w)}V${n(h)}H0Z`;
  const { a, b, c, d, p, arc } = cornerParams(r, smoothing, budget);
  return [
    `M${n(w - p)} 0`,
    `c${n(a)} 0 ${n(a + b)} 0 ${n(a + b + c)} ${n(d)}`,
    `a${n(r)} ${n(r)} 0 0 1 ${n(arc)} ${n(arc)}`,
    `c${n(d)} ${n(c)} ${n(d)} ${n(b + c)} ${n(d)} ${n(a + b + c)}`,
    `L${n(w)} ${n(h - p)}`,
    `c0 ${n(a)} 0 ${n(a + b)} ${n(-d)} ${n(a + b + c)}`,
    `a${n(r)} ${n(r)} 0 0 1 ${n(-arc)} ${n(arc)}`,
    `c${n(-c)} ${n(d)} ${n(-(b + c))} ${n(d)} ${n(-(a + b + c))} ${n(d)}`,
    `L${n(p)} ${n(h)}`,
    `c${n(-a)} 0 ${n(-(a + b))} 0 ${n(-(a + b + c))} ${n(-d)}`,
    `a${n(r)} ${n(r)} 0 0 1 ${n(-arc)} ${n(-arc)}`,
    `c${n(-d)} ${n(-c)} ${n(-d)} ${n(-(b + c))} ${n(-d)} ${n(-(a + b + c))}`,
    `L0 ${n(p)}`,
    `c0 ${n(-a)} 0 ${n(-(a + b))} ${n(d)} ${n(-(a + b + c))}`,
    `a${n(r)} ${n(r)} 0 0 1 ${n(arc)} ${n(-arc)}`,
    `c${n(c)} ${n(-d)} ${n(b + c)} ${n(-d)} ${n(a + b + c)} ${n(-d)}`,
    "Z",
  ].join(" ");
}

/** Measures an element's border-box size and keeps it up to date. */
export function useSize(ref) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const w = el.offsetWidth, h = el.offsetHeight;
      setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

/**
 * Figma linear gradient → SVG userSpace gradient end points.
 * `t` is Figma's gradientTransform [[a,b,c],[d,e,f]] (node space → gradient space).
 */
export function figmaLinearPoints(t, w, h) {
  const [[a, b, c], [d, e, f]] = t;
  // solve for normalized (u,v) where (gx,gy) = (0,0.5) and the gradient normal
  const det = a * e - b * d;
  const inv = (gx, gy) => [(e * (gx - c) - b * (gy - f)) / det, (a * (gy - f) - d * (gx - c)) / det];
  const [u0, v0] = inv(0, 0.5);
  const p0 = [u0 * w, v0 * h];
  const nx = a / w, ny = b / h; // d(gx)/dx, d(gx)/dy in px
  const k = 1 / (nx * nx + ny * ny);
  return { x1: p0[0], y1: p0[1], x2: p0[0] + nx * k, y2: p0[1] + ny * k };
}

let uid = 0;
export const useId = () => {
  const [id] = useState(() => `sq${(uid += 1)}`);
  return id;
};
