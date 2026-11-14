import { useEffect, useRef } from "react";
import lottie from "lottie-web/build/player/lottie_light";
import { ICONS } from "./icons";
import assistantData from "./assets/assistant.json";
import "./BottomNavigation.css";

function Icon({ name }) {
  return (
    <svg className="bnav__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {ICONS[name].map((p, i) => (
        <path key={i} d={p.d} fillRule={p.fillRule} clipRule={p.clipRule} fill="currentColor" />
      ))}
    </svg>
  );
}

/** Tabs, right → left (RTL). `icon` is the outline name; "-fill" is used when selected. */
export const DEFAULT_TABS = [
  { id: "home", label: "خانه", icon: "home" },
  { id: "orders", label: "سفارش‌ها", icon: "orders" },
  { id: "cart", label: "سبد", icon: "basket" },
  { id: "profile", label: "پروفایل", icon: "profile" },
];

function Tab({ tab, selected, onSelect }) {
  const Tag = tab.href ? "a" : "button";
  return (
    <Tag
      className={`bnav__tab${selected ? " is-selected" : ""}`}
      href={tab.href}
      type={tab.href ? undefined : "button"}
      aria-current={selected ? "page" : undefined}
      onClick={(e) => onSelect?.(tab.id, e)}
    >
      <Icon name={selected ? `${tab.icon}-fill` : tab.icon} />
      <span className="bnav__label">{tab.label}</span>
    </Tag>
  );
}

/**
 * Jet assistant — blinks, looks around and hops in place (Lottie, horizontal
 * travel and the "دستیار خرید" label removed); rings pulse out linearly every 3 s.
 */
function Assistant({ onClick, label = "دستیار خرید" }) {
  const ref = useRef(null);
  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const anim = lottie.loadAnimation({
      container: ref.current,
      renderer: "svg",
      loop: true,
      autoplay: !reduced,
      animationData: assistantData,
      rendererSettings: { preserveAspectRatio: "xMidYMid meet", progressiveLoad: false },
    });
    if (reduced) anim.goToAndStop(0, true);
    // pause when the tab is hidden
    const onVis = () => (document.hidden ? anim.pause() : !reduced && anim.play());
    document.addEventListener("visibilitychange", onVis);
    return () => { document.removeEventListener("visibilitychange", onVis); anim.destroy(); };
  }, []);
  return (
    <button type="button" className="bnav__assistant" onClick={onClick} aria-label={label}>
      <span className="bnav__shadow" aria-hidden="true" />
      <span className="bnav__ring" aria-hidden="true" />
      <span className="bnav__ring" aria-hidden="true" />
      <span className="bnav__ball" ref={ref} aria-hidden="true" />
    </button>
  );
}

/**
 * BottomNavigation
 *  variant      "simple" | "assistant"
 *  tabs         [{ id, label, icon, href? }]  (4 tabs, right → left)
 *  activeId     selected tab id
 *  onSelect(id) tab tap
 *  onAssistantClick()
 *  fixed        pin to the bottom of the viewport (default true)
 */
export default function BottomNavigation({
  variant = "simple",
  tabs = DEFAULT_TABS,
  activeId = "home",
  onSelect,
  onAssistantClick,
  fixed = true,
  className = "",
  style,
}) {
  const tab = (t) => <Tab key={t.id} tab={t} selected={t.id === activeId} onSelect={onSelect} />;
  return (
    <nav
      className={`bnav bnav--${variant}${fixed ? "" : " bnav--static"} ${className}`.trim()}
      style={style}
      aria-label="ناوبری اصلی"
    >
      <div className="bnav__scrim" aria-hidden="true" />
      <div className="bnav__bar">
        {variant === "assistant" ? (
          <div className="bnav__tabs">
            <div className="bnav__group bnav__group--start">{tabs.slice(0, 2).map(tab)}</div>
            <div className="bnav__group bnav__group--end">{tabs.slice(2).map(tab)}</div>
          </div>
        ) : (
          <div className="bnav__tabs">{tabs.map(tab)}</div>
        )}
        <div className="bnav__safe" />
        {variant === "assistant" && <Assistant onClick={onAssistantClick} />}
      </div>
    </nav>
  );
}
