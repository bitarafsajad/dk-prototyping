import { useEffect, useRef } from "react";
import "./SettingsSheet.css";

const WEATHER = [
  { id: "rain", label: "بارانی", hint: "ابر و باران" },
  { id: "sunny", label: "آفتابی", hint: "صبح، آسمان صاف" },
];
const LAYOUT = [
  { id: "search", label: "جستجو در بالا", hint: "نسخهٔ جدید" },
  { id: "weather", label: "آب‌وهوا", hint: "نسخهٔ قبلی" },
];
const CATEGORY = [
  { id: "row", label: "ردیفی", hint: "نسخهٔ جدید" },
  { id: "v1", label: "نسخه ۱", hint: "کارت‌های بزرگ" },
  { id: "v2", label: "نسخه ۲", hint: "تصاویر کج" },
  { id: "v3", label: "نسخه ۳", hint: "رنگی، دو کارت پهن" },
];

function Check() {
  return (
    <span className="set__check" aria-hidden="true">
      <svg viewBox="0 0 16 16"><path d="M6.6 11.4 3.4 8.2l1.1-1.1 2.1 2.1 4.9-4.9 1.1 1.1z" fill="#fff" /></svg>
    </span>
  );
}

function Option({ selected, onSelect, label, hint, children }) {
  return (
    <button type="button" role="radio" aria-checked={selected} className={`set__opt${selected ? " is-on" : ""}`} onClick={onSelect}>
      <span className="set__preview">{children}{selected && <Check />}</span>
      <span className="set__label">{label}</span>
      <span className="set__hint">{hint}</span>
    </button>
  );
}

/** Small schematic previews (pure CSS) */
const WeatherPreview = ({ id }) => <span className={`set__sky set__sky--${id}`}><i /><i /><i /></span>;
const LayoutPreview = ({ id }) => <span className={`set__lay set__lay--${id}`}><i /><i /><i /></span>;
const CategoryPreview = ({ id }) => (
  <span className={`set__cat set__cat--${id}`}>
    {Array.from({ length: id === "row" ? 5 : id === "v3" ? 4 : id === "v2" ? 6 : 4 }, (_, i) => <i key={i} />)}
  </span>
);

/**
 * SettingsSheet — bottom sheet opened from the Pillars grid button.
 *  weather / onWeather     "rain" | "sunny"
 *  category / onCategory   "v1" | "v2" | "v3"
 */
export default function SettingsSheet({ open, onClose, weather, onWeather, category, onCategory, layout = "search", onLayout }) {
  const sheetRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => sheetRef.current?.focus({ preventScroll: true }), 50);
    return () => { window.removeEventListener("keydown", onKey); clearTimeout(t); };
  }, [open, onClose]);

  return (
    <div className={`set${open ? " is-open" : ""}`} aria-hidden={!open || undefined} inert={open ? undefined : ""}>
      <div className="set__scrim" onClick={onClose} />
      <div className="set__sheet" role="dialog" aria-modal="true" aria-labelledby="set-title" tabIndex={-1} ref={sheetRef}>
        <span className="set__handle" aria-hidden="true" />
        <div className="set__head">
          <h2 id="set-title" className="set__title">تنظیمات</h2>
          <button type="button" className="set__close" onClick={onClose} aria-label="بستن">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.7 5.3 12 10.6l5.3-5.3 1.4 1.4-5.3 5.3 5.3 5.3-1.4 1.4-5.3-5.3-5.3 5.3-1.4-1.4 5.3-5.3-5.3-5.3z" fill="currentColor" /></svg>
          </button>
        </div>

        <section className="set__group">
          <h3 className="set__gtitle">سربرگ</h3>
          <div className="set__opts set__opts--2" role="radiogroup" aria-label="سربرگ">
            {LAYOUT.map((l) => (
              <Option key={l.id} selected={layout === l.id} onSelect={() => onLayout?.(l.id)} label={l.label} hint={l.hint}>
                <LayoutPreview id={l.id} />
              </Option>
            ))}
          </div>
        </section>

        <section className={`set__group${layout === "weather" ? "" : " is-muted"}`}>
          <h3 className="set__gtitle">پس‌زمینهٔ آب‌وهوا <span className="set__note">{layout === "weather" ? "" : "(برای سربرگ آب‌وهوا)"}</span></h3>
          <div className="set__opts set__opts--2" role="radiogroup" aria-label="پس‌زمینهٔ سربرگ">
            {WEATHER.map((w) => (
              <Option key={w.id} selected={weather === w.id} onSelect={() => onWeather(w.id)} label={w.label} hint={w.hint}>
                <WeatherPreview id={w.id} />
              </Option>
            ))}
          </div>
        </section>

        <section className="set__group">
          <h3 className="set__gtitle">نوع دسته‌بندی</h3>
          <div className="set__opts set__opts--4" role="radiogroup" aria-label="نوع دسته‌بندی">
            {CATEGORY.map((c) => (
              <Option key={c.id} selected={category === c.id} onSelect={() => onCategory(c.id)} label={c.label} hint={c.hint}>
                <CategoryPreview id={c.id} />
              </Option>
            ))}
          </div>
        </section>

        <button type="button" className="set__done" onClick={onClose}>تأیید</button>
      </div>
    </div>
  );
}
