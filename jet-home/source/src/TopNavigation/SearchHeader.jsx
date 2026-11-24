import "./SearchHeader.css";

const SEARCH =
  "M21.4887 20.2901L18.7587 17.5701C20.2187 15.8701 21.0487 13.6801 21.0487 11.4201C21.0487 6.22006 16.8187 2.00006 11.6287 2.00006C6.43874 2.00006 2.20874 6.22006 2.20874 11.4201C2.20874 16.6201 6.42874 20.8401 11.6287 20.8401C13.6887 20.8401 15.6687 20.1701 17.2987 18.9401L20.0787 21.7101C20.2787 21.9001 20.5287 22.0001 20.7887 22.0001C21.0487 22.0001 21.2987 21.9001 21.4987 21.7101C21.8887 21.3201 21.8887 20.6901 21.4987 20.3001L21.4887 20.2901ZM16.6787 16.8501C15.2987 18.1301 13.5087 18.8301 11.6387 18.8301C7.54874 18.8301 4.21874 15.5001 4.21874 11.4101C4.21874 7.32006 7.54874 3.99006 11.6387 3.99006C15.7287 3.99006 19.0587 7.32006 19.0587 11.4101C19.0587 13.4601 18.1987 15.4401 16.6887 16.8401L16.6787 16.8501ZM16.5087 10.3501C16.4287 10.3701 16.3587 10.3901 16.2787 10.3901C15.9587 10.3901 15.6687 10.1901 15.5687 9.87006C15.1987 8.71006 14.2787 7.81006 13.1087 7.46006C12.7087 7.34006 12.4887 6.92006 12.6087 6.52006C12.7287 6.12006 13.1487 5.90006 13.5487 6.02006C15.1787 6.52006 16.4687 7.78006 16.9987 9.41006C17.1287 9.80006 16.9087 10.2301 16.5187 10.3501H16.5087Z";
const MIC =
  "M7.47 10.92V6.3C7.47 3.92 9.42 2 11.82 2H12.17C14.16 2 15.85 3.32 16.36 5.13C16.43 5.38 16.24 5.62 15.98 5.62H14.85C14.51 5.62 14.23 5.89 14.23 6.23C14.23 6.57 14.51 6.84 14.85 6.84H15.89C16.24 6.84 16.52 7.12 16.52 7.46C16.52 7.8 16.24 8.08 15.89 8.08H14.85C14.51 8.08 14.23 8.35 14.23 8.69C14.23 9.03 14.51 9.3 14.85 9.3H15.89C16.24 9.3 16.52 9.58 16.52 9.92C16.52 10.26 16.24 10.54 15.89 10.54H14.85C14.51 10.54 14.23 10.81 14.23 11.15C14.23 11.49 14.51 11.76 14.85 11.76H15.93C16.2 11.76 16.39 12.02 16.3 12.26C15.73 13.97 14.09 15.2 12.17 15.2H11.82C9.42 15.2 7.47 13.28 7.47 10.9V10.92ZM19.53 9.83C19 9.83 18.56 10.26 18.56 10.79C18.56 14.36 15.62 17.27 12 17.27C8.38 17.27 5.44 14.36 5.44 10.78C5.44 10.25 5.01 9.82 4.47 9.82C3.93 9.82 3.5 10.25 3.5 10.78C3.5 15.08 6.8 18.64 11.03 19.11V21.04C11.03 21.57 11.46 22 12 22C12.54 22 12.97 21.57 12.97 21.04V19.11C17.2 18.63 20.5 15.08 20.5 10.78C20.5 10.25 20.07 9.82 19.53 9.82V9.83Z";
const CHEVRON =
  "M9.21967 5.46979C9.51256 5.1769 9.98732 5.1769 10.2802 5.46979C10.5731 5.76269 10.5731 6.23745 10.2802 6.53034L7.81049 9.00007L10.2802 11.4698C10.5731 11.7627 10.5731 12.2374 10.2802 12.5303C9.98732 12.8232 9.51256 12.8232 9.21967 12.5303L6.21967 9.53034C5.92678 9.23745 5.92678 8.76269 6.21967 8.46979L9.21967 5.46979Z";

export const SEARCH_SUGGESTIONS = ["شیر کم‌چرب", "پنیر", "تن‌ماهی", "روغن سرخ‌کردنی", "بستنی"];

/**
 * SearchHeader — TopNavigation homePage ⇄ homePageScroll (Figma 2584:5487 / 2584:5488).
 *  expanded:  SearchField (358×52, y8) + Location (label 13/20, address 15/24 bold) → 128px
 *  collapsed: ghost circle button 64×44 (x16, y10) + Location moved up 64px     → 64px + 1px divider
 *  collapsed  boolean (the page decides; HomePage uses scrollTop ≥ 32)
 */
export default function SearchHeader({
  collapsed = false,
  label = "تحویل به",
  address = "محل‌ کار، خدامی",
  suggestions = SEARCH_SUGGESTIONS,
  onSearchClick,
  onVoiceClick,
  onLocationClick,
  className = "",
  style,
}) {
  const list = [...suggestions, suggestions[0]];       // last = first → seamless loop
  return (
    <div className={`sh${collapsed ? " is-collapsed" : ""} ${className}`.trim()} style={style}>
      {/* SearchField → circle (one shape, width/height animate) */}
      <button type="button" className="sh__field" onClick={onSearchClick} aria-label="جستجو" />
      <div className="sh__placeholder" aria-hidden="true">
        <span className="sh__ticker">
          <span className="sh__track" style={{ "--n": suggestions.length }}>
            {list.map((t, i) => <span key={i}>{t}</span>)}
          </span>
        </span>
        <span>جستجوی</span>
      </div>
      <button type="button" className="sh__mic" onClick={onVoiceClick} aria-label="جستجوی صوتی" tabIndex={collapsed ? -1 : undefined}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d={MIC} fill="#999999" /></svg>
      </button>
      <span className="sh__icon" aria-hidden="true">
        <svg className="sh__ic-field" viewBox="0 0 24 24"><path d={SEARCH} fill="currentColor" /></svg>
        <svg className="sh__ic-btn" viewBox="0 0 24 24"><path d={SEARCH} fill="currentColor" /></svg>
      </span>

      {/* Location */}
      <div className="sh__loc">
        <button type="button" className="sh__locBtn" onClick={onLocationClick}>
          <span className="sh__label">{label}</span>
          <span className="sh__address">
            <span className="sh__addressText">{address}</span>
            <span className="sh__chip" aria-hidden="true">
              <svg viewBox="0 0 18 18"><path d={CHEVRON} fill="#000" /></svg>
            </span>
          </span>
        </button>
      </div>
      <span className="sh__divider" aria-hidden="true" />
    </div>
  );
}
