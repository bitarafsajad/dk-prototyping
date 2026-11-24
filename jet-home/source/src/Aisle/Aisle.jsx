import SectionHeading from "../Carousel/SectionHeading";
import bundles from "./assets/bundles.webp";
import snacks from "./assets/snacks.webp";
import dairy from "./assets/dairy.webp";
import beverages from "./assets/beverages.webp";
import groceries from "./assets/groceries.webp";
import protein from "./assets/protein.webp";
import fruit from "./assets/fruit.webp";
import condiments from "./assets/condiments.webp";
import home from "./assets/home.webp";
import canned from "./assets/canned.webp";
import beauty from "./assets/beauty.webp";
import baby from "./assets/baby.webp";
import sweets from "./assets/sweets.webp";
import cleaning from "./assets/cleaning.webp";
import breakfast from "./assets/breakfast.webp";
import pet from "./assets/pet.webp";
import supplements from "./assets/supplements.webp";
import electrical from "./assets/electrical.webp";
import nuts from "./assets/nuts.webp";
import stationery from "./assets/stationery.webp";
import toys from "./assets/toys.webp";
import tobacco from "./assets/tobacco.webp";
import "./Aisle.css";

/** Aisles in reading order (RTL: right → left, top → bottom), Figma AisleGrid 1540:9091. */
export const AISLES = [
  { id: "bundles", title: "پک‌ به‌صرفه", image: bundles },
  { id: "snacks", title: "تنقلات", image: snacks },
  { id: "dairy", title: "لبنیات و بستنی", image: dairy },
  { id: "beverages", title: "نوشیدنی", image: beverages },
  { id: "groceries", title: "خواروبار و نان", image: groceries },
  { id: "protein", title: "پروتئین و تخم مرغ", image: protein },
  { id: "fruit", title: "میوه و سبزیجات تازه", image: fruit },
  { id: "condiments", title: "چاشنی و افزودنی", image: condiments },
  { id: "home", title: "خانه و آشپزخانه", image: home },
  { id: "canned", title: "کنسرو و غذای آماده", image: canned },
  { id: "beauty", title: "آرایشی و بهداشتی", image: beauty },
  { id: "baby", title: "کودک و نوزاد", image: baby },
  { id: "sweets", title: "شیرینی و دسر", image: sweets },
  { id: "cleaning", title: "شوینده و دستمال", image: cleaning },
  { id: "breakfast", title: "صبحانه", image: breakfast },
  { id: "pet", title: "لوازم حیوانات خانگی", image: pet },
  { id: "supplements", title: "مکمل غذایی و ورزشی", image: supplements },
  { id: "electrical", title: "لوازم الکتریکی و دیجیتال", image: electrical },
  { id: "nuts", title: "آجیل و خشکبار", image: nuts },
  { id: "stationery", title: "نوشت‌افزار و اداری", image: stationery },
  { id: "toys", title: "بازی و سرگرمی", image: toys },
  { id: "tobacco", title: "دخانیات", image: tobacco },
];

/** AisleCard — 114 × 114 (fluid, square), #F5F5F5, 1px #EFEEEB inside, radius 24, art 56, label 11/16 Medium, max 2 lines */
export function AisleCard({ aisle, onSelect }) {
  return (
    <a
      href={aisle.href || "#"}
      className="aisle-card"
      onClick={(e) => { if (!aisle.href) e.preventDefault(); onSelect?.(aisle); }}
      draggable={false}
    >
      <img className="aisle-card__art" src={aisle.image} alt="" width="56" height="56" loading="lazy" decoding="async" draggable={false} />
      <span className="aisle-card__label">{aisle.title}</span>
    </a>
  );
}

/** Aisle — AisleGrid: «دسته‌بندی‌های پرفروش» + responsive 3-column grid of AisleCards. */
export default function Aisle({ title = "دسته‌بندی‌های پرفروش", aisles = AISLES, onSelect, className = "" }) {
  return (
    <section className={`aisle ${className}`.trim()} aria-label={title}>
      <SectionHeading title={title} appearance="light" hasArrowIcon={false} />
      <div className="aisle__grid">
        {aisles.map((a) => <AisleCard key={a.id} aisle={a} onSelect={onSelect} />)}
      </div>
    </section>
  );
}
