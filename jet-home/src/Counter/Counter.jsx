import { useEffect, useRef, useState } from "react";
import "./Counter.css";

const fa = (v) => String(v).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

const PLUS_24 =
  "M18 11H13V6C13 5.45 12.55 5 12 5C11.45 5 11 5.45 11 6V11H6C5.45 11 5 11.45 5 12C5 12.55 5.45 13 6 13H11V18C11 18.55 11.45 19 12 19C12.55 19 13 18.55 13 18V13H18C18.55 13 19 12.55 19 12C19 11.45 18.55 11 18 11Z";
const MINUS_24 =
  "M18 13H6C5.45 13 5 12.55 5 12C5 11.45 5.45 11 6 11H18C18.55 11 19 11.45 19 12C19 12.55 18.55 13 18 13Z";
const PLUS_20 =
  "M15 9.16666H10.8333V4.99999C10.8333 4.54166 10.4583 4.16666 10 4.16666C9.54167 4.16666 9.16667 4.54166 9.16667 4.99999V9.16666H5.00001C4.54167 9.16666 4.16667 9.54166 4.16667 9.99999C4.16667 10.4583 4.54167 10.8333 5.00001 10.8333H9.16667V15C9.16667 15.4583 9.54167 15.8333 10 15.8333C10.4583 15.8333 10.8333 15.4583 10.8333 15V10.8333H15C15.4583 10.8333 15.8333 10.4583 15.8333 9.99999C15.8333 9.54166 15.4583 9.16666 15 9.16666Z";
const MINUS_20 =
  "M15 10.8333H5.00001C4.54167 10.8333 4.16667 10.4583 4.16667 9.99999C4.16667 9.54166 4.54167 9.16666 5.00001 9.16666H15C15.4583 9.16666 15.8333 9.54166 15.8333 9.99999C15.8333 10.4583 15.4583 10.8333 15 10.8333Z";

function Icon({ d, size, color }) {
  return (
    <svg className="counter__icon" width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden="true">
      <path d={d} fill={color} />
    </svg>
  );
}

export function Loader({ color = "currentColor" }) {
  return (
    <span className="counter-loader" style={{ color }} role="status" aria-label="در حال بارگذاری">
      <i /><i />
    </span>
  );
}

/** Number that rolls up / down when it changes (same keyframes as the prototype). */
let rollId = 0;
function useRoll(value, animate) {
  const [items, setItems] = useState(() => [{ k: ++rollId, v: value, cls: "" }]);
  const prev = useRef(value);
  useEffect(() => {
    if (value === prev.current) return;
    const dir = value > prev.current ? "up" : "down";
    prev.current = value;
    setItems((list) => {
      if (!animate) return [{ k: ++rollId, v: value, cls: "" }];
      const outs = list.filter((i) => !i.cls.startsWith("out")).map((i) => ({ ...i, cls: `out-${dir}` }));
      return [...outs, { k: ++rollId, v: value, cls: `in-${dir}` }];
    });
  }, [value, animate]);
  const remove = (k) => setItems((list) => list.filter((i) => i.k !== k));
  return items.map((i) => (
    <span key={i.k} className={i.cls} onAnimationEnd={i.cls.startsWith("out") ? () => remove(i.k) : undefined}>
      {fa(i.v)}
    </span>
  ));
}

/** Works out the Figma state from data. */
export function counterState({ quantity = 0, max = Infinity, loading = false, collapsed = false }) {
  if (quantity <= 0) return loading ? "addLoading" : "add";
  if (collapsed) return "collapsed";
  if (loading) return "addedLoading";
  return quantity >= max ? "max" : "added";
}

function FloatCounter({ state, quantity, idle, fluid, onInc, onDec, className, style }) {
  const forcedCompact = state === "collapsed";
  const open = ["added", "max", "addedLoading", "collapsed"].includes(state);
  const loading = state === "addLoading" || state === "addedLoading";
  const isMax = state === "max";
  const shown = Math.max(quantity, 1);
  const count = useRoll(shown, open);

  // idle → compact (folds into the red amount circle)
  const [compact, setCompact] = useState(false);
  const timer = useRef(0);
  const arm = () => {
    clearTimeout(timer.current);
    if (idle != null && quantity > 0) timer.current = setTimeout(() => setCompact(true), idle);
  };
  useEffect(() => {
    setCompact(false);
    arm();
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity, idle]);
  const isCompact = forcedCompact || (compact && quantity > 0);

  const onPlus = () => {
    if (isCompact) { setCompact(false); arm(); return; }
    onInc();
  };

  const cls = [
    "counter counter--float",
    fluid ? "counter--fluid" : "",
    open ? "is-open" : "",
    isCompact ? "is-compact" : "",
    isMax ? "is-max" : "",
    loading ? "is-loading" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={cls} style={style}>
      <div className="qs__pill">
        <div className="qs__bg"><div className="qs__glass" /></div>
        <div className="qs__clip">
          <div className="qs__row">
            <span className="qs__minus"><Icon d={MINUS_24} size={24} color="currentColor" /></span>
            <span className="qs__count" aria-live="polite">{count}</span>
            <span className="qs__plus">
              <span className="qs__plus-bg" />
              <span className="qs__plus-clip">
                <span className="qs__plus-icon"><Icon d={PLUS_24} size={24} color="currentColor" /></span>
                <span className="qs__plus-num">{fa(shown)}</span>
                <span className="qs__plus-loader"><Loader color={open ? "#fff" : "#ed1944"} /></span>
              </span>
            </span>
          </div>
        </div>
        <div className="qs__border" />
        <button type="button" className="qs__hit qs__hit--minus" onClick={onDec} disabled={loading} aria-label="کم کردن" />
        <button
          type="button"
          className="qs__hit qs__hit--plus"
          onClick={onPlus}
          disabled={loading || (isMax && !isCompact)}
          aria-label={isCompact ? `تعداد: ${fa(shown)} — ویرایش` : quantity ? "افزایش تعداد" : "افزودن به سبد"}
        />
      </div>
    </div>
  );
}

/**
 * Counter (add-to-cart stepper)
 *
 *  variant    "float" (over images) | "fixed" (inline)
 *  quantity   current amount (0 → add button)
 *  max        upper limit → "max" state
 *  loading    shows the two-dot loader
 *  collapsed  compact quantity only
 *  unit       optional unit label (e.g. "ورق") — Figma `hasUnit`
 *  state      force a Figma state (overrides the derived one)
 *  fluid      stretch the expanded stepper to the parent width
 *  collapseAfter  ms of inactivity before the float stepper folds into the
 *                 red amount circle (null = never). Tap it to open again.
 *  onChange(nextQuantity)
 */
export default function Counter({
  variant = "float",
  quantity = 0,
  max = Infinity,
  loading = false,
  collapsed = false,
  unit,
  state: forcedState,
  fluid = false,
  collapseAfter = 1500,
  onChange,
  className = "",
  style,
}) {
  const state = forcedState || counterState({ quantity, max, loading, collapsed });
  const isFloat = variant === "float";
  const q = fa(Math.max(quantity, 1));
  const roll = useRoll(Math.max(quantity, 1), quantity > 0);
  const inc = () => onChange?.(quantity + 1);
  const dec = () => onChange?.(Math.max(quantity - 1, 0));
  const cls = `counter counter--${variant} counter--${state}${fluid ? " counter--fluid" : ""} ${className}`.trim();

  /* ---------------- FLOAT ---------------- */
  if (isFloat) {
    return (
      <FloatCounter
        state={state}
        quantity={quantity}
        idle={collapseAfter}
        fluid={fluid}
        onInc={inc}
        onDec={dec}
        className={className}
        style={style}
      />
    );
  }

  /* ---------------- FIXED ---------------- */
  if (state === "add") {
    return (
      <button type="button" className={cls} style={style} onClick={inc} aria-label="افزودن به سبد">
        <Icon d={PLUS_20} size={20} color="#000" />
      </button>
    );
  }
  if (state === "addLoading") {
    return (
      <div className={cls} style={style}>
        <Loader color="#000" />
      </div>
    );
  }
  if (state === "collapsed") {
    return (
      <div className={cls} style={style}>
        {unit && <span className="counter__unit">{unit}</span>}
        <span className="counter__qty">{q}</span>
      </div>
    );
  }
  const busy = state === "addedLoading";
  return (
    <div className={cls} style={style}>
      <button type="button" className="counter__btn" onClick={dec} disabled={busy} aria-label="کم کردن">
        <Icon d={MINUS_20} size={20} color={busy ? "#bdbdbd" : "#000"} />
      </button>
      {busy ? (
        <span className="counter__qty">{q}</span>
      ) : (
        <span className="counter__quantity" aria-live="polite">
          {unit && <span className="counter__unit">{unit}</span>}
          <span className="counter__qty qs-roll">{roll}</span>
        </span>
      )}
      {busy ? (
        <span className="counter__btn" style={{ width: 20, height: 20 }}><Loader color="#000" /></span>
      ) : (
        <button type="button" className="counter__btn" onClick={inc} disabled={state === "max"} aria-label="افزودن">
          <Icon d={PLUS_20} size={20} color={state === "max" ? "#bdbdbd" : "#000"} />
        </button>
      )}
    </div>
  );
}
