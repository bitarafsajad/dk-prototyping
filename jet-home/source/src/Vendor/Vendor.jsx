import SectionHeading from "../Carousel/SectionHeading";
import digikala from "./assets/digikala.webp";
import hyperplus from "./assets/hyperplus.webp";
import nuts from "./assets/nuts.webp";
import lidomarket from "./assets/lidomarket.webp";
import "./Vendor.css";

const fa = (v) => String(v).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
const STAR =
  "M10.0115 4.28671L7.96146 3.99171C7.84647 3.97671 7.74646 3.90671 7.69146 3.79671L6.77646 1.96671C6.69146 1.80671 6.56147 1.67671 6.40647 1.59171C5.98146 1.37671 5.45646 1.54171 5.23146 1.96671L4.31646 3.79671C4.26146 3.90171 4.16146 3.97671 4.04146 3.99171L1.99646 4.28671C1.79646 4.31671 1.62646 4.40171 1.49646 4.54171C1.33146 4.70671 1.25146 4.92171 1.25146 5.15171C1.25146 5.38171 1.35146 5.59171 1.51146 5.75171L2.99646 7.18171C3.07646 7.25671 3.11646 7.37671 3.09646 7.49171L2.74646 9.50171C2.71646 9.69171 2.74646 9.88171 2.83646 10.0417C2.94646 10.2467 3.12646 10.3967 3.34646 10.4617C3.43146 10.4867 3.51646 10.5017 3.60146 10.5017C3.74146 10.5017 3.87646 10.4667 4.00146 10.4017L5.83146 9.45671C5.93646 9.40171 6.06646 9.40171 6.17146 9.45671L7.99146 10.3967C8.15646 10.4867 8.34146 10.5217 8.53646 10.4917C9.00646 10.4167 9.32646 9.97171 9.25146 9.49671L8.90146 7.49171C8.88146 7.37171 8.91646 7.25671 9.00646 7.17671L10.4865 5.75671C10.6265 5.62171 10.7165 5.44671 10.7415 5.25171C10.8015 4.78671 10.4715 4.35671 10.0065 4.29171L10.0115 4.28671Z";

/** Sample vendors (logos supplied); rows are filled top first. */
export const VENDORS = [
  { id: "dk-jordan", name: "سوپرمارکت دیجی‌کالا | جردن", logo: digikala, rate: 4.6, fee: "۵۵٬۰۰۰", eta: "۴۰ دقیقه", tags: ["زنجیره‌ای", "۵ کوپن", "تخفیف ویژه"] },
  { id: "hyperplus", name: "هایپر پلاس | ونک", logo: hyperplus, rate: 4.8, fee: "۳۵٬۰۰۰", eta: "۳۰ دقیقه", tags: ["زنجیره‌ای", "تخفیف ویژه"] },
  { id: "lido", name: "لیدو مارکت | سعادت‌آباد", logo: lidomarket, rate: 4.5, fee: "۴۵٬۰۰۰", eta: "۵۰ دقیقه", tags: ["۳ کوپن", "تخفیف ویژه"] },
  { id: "rastgoo", name: "آجیل خشکبار راستگو", logo: nuts, rate: 4.7, fee: "۵۵٬۰۰۰", eta: "۴۰ دقیقه", tags: ["زنجیره‌ای", "۵ کوپن", "تخفیف ویژه"] },
  { id: "dk-vanak", name: "سوپرمارکت دیجی‌کالا | ونک", logo: digikala, rate: 4.6, fee: "رایگان", eta: "۲۵ دقیقه", tags: ["زنجیره‌ای", "تخفیف ویژه"] },
  { id: "hyperplus-2", name: "هایپر پلاس | پاسداران", logo: hyperplus, rate: 4.4, fee: "۴۰٬۰۰۰", eta: "۴۵ دقیقه", tags: ["۲ کوپن", "تخفیف ویژه"] },
];

/** VendorCard — isCompact=False, hasBackground=True (Figma 1483:4073) · 288 × 96 */
export function VendorCard({ vendor, onSelect }) {
  const { name, logo, rate, fee, eta, tags = [] } = vendor;
  return (
    <a
      href={vendor.href || "#"}
      className="vcard"
      onClick={(e) => { if (!vendor.href) e.preventDefault(); onSelect?.(vendor); }}
      draggable={false}
    >
      <span className="vcard__lead">
        <img className="vcard__logo" src={logo} alt="" width="44" height="44" draggable={false} decoding="async" />
        <span className="vcard__rate" aria-label={`امتیاز ${fa(rate)}`}>
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d={STAR} fill="#F4B82D" fillRule="evenodd" /></svg>
          <span>{fa(rate)}</span>
        </span>
      </span>
      <span className="vcard__content">
        <span className="vcard__titleFrame">
          <span className="vcard__title">{name}</span>
          <span className="vcard__desc">
            <span className="vcard__meta">{eta}</span>
            <span className="vcard__dot" aria-hidden="true" />
            <span className="vcard__meta">{fee === "رایگان" ? "ارسال رایگان" : `ارسال ${fee}ت`}</span>
          </span>
        </span>
        <span className="vcard__tags">
          {tags.map((t) => <span key={t} className="vcard__tag">{t}</span>)}
        </span>
      </span>
    </a>
  );
}

/**
 * Vendor section — ShopCarousel line=2 (Figma 1483:4073; home 2469:2446).
 * #EFEEEB band, SectionHeading «فروشگاه‌های محبوب», two rows of VendorCards in
 * ONE horizontal scroller (both rows move together).
 */
export default function Vendor({ title = "فروشگاه‌های محبوب", vendors = VENDORS, onSelect, onTitleClick, className = "" }) {
  const half = Math.ceil(vendors.length / 2);
  const rows = [vendors.slice(0, half), vendors.slice(half)];
  return (
    <section className={`vendors ${className}`.trim()} aria-label={title}>
      <SectionHeading title={title} appearance="light" onClick={onTitleClick} />
      <div className="vendors__scroller">
        <div className="vendors__track">
          {rows.map((row, i) => (
            <div key={i} className={`vendors__row vendors__row--${i + 1}`}>
              {row.map((v) => <VendorCard key={v.id} vendor={v} onSelect={onSelect} />)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
