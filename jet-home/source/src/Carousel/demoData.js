import shegeftangiz10 from "./assets/shegeft-angiz-10.webp";
import shegeftangiz11 from "./assets/shegeft-angiz-11.webp";
import shegeftangiz12 from "./assets/shegeft-angiz-12.webp";
import shegeftangiz25 from "./assets/shegeft-angiz-25.webp";
import shegeftangiz26 from "./assets/shegeft-angiz-26.webp";
import shegeftangiz6 from "./assets/shegeft-angiz-6.webp";
import shegeftangiz7 from "./assets/shegeft-angiz-7.webp";
import shegeftangiz9 from "./assets/shegeft-angiz-9.webp";
import kharbar17 from "./assets/kharbar-17.webp";
import kharbar18 from "./assets/kharbar-18.webp";
import kharbar19 from "./assets/kharbar-19.webp";
import kharbar20 from "./assets/kharbar-20.webp";
import labaniat13 from "./assets/labaniat-13.webp";
import labaniat14 from "./assets/labaniat-14.webp";
import labaniat15 from "./assets/labaniat-15.webp";
import labaniat16 from "./assets/labaniat-16.webp";
import meat21 from "./assets/meat-21.webp";
import meat22 from "./assets/meat-22.webp";
import meat23 from "./assets/meat-23.webp";
import meat24 from "./assets/meat-24.webp";
import nivea6 from "./assets/nivea-6.webp";
import nivea7 from "./assets/nivea-7.webp";
import nivea8 from "./assets/nivea-8.webp";
import nivea9 from "./assets/nivea-9.webp";
import nivea10 from "./assets/nivea-10.webp";
import nivea11 from "./assets/nivea-11.webp";
import nivea12 from "./assets/nivea-12.webp";
import nivea13 from "./assets/nivea-13.webp";
import niveaArtwork from "./assets/nivea-artwork.webp";

const inHours = (h) => Date.now() + h * 3600 * 1000;

/** Demo content for the home page carousels (sample data, Digikala Jet style). */
export const SECTIONS = [
  {
    id: "amazing",
    appearance: "promotion",
    line: "double",
    color: "#ed1944",
    title: "شگفت‌انگیز",
    description: "تخفیف‌های ویژه تا پایان زمان",
    endsAt: inHours(4.28),
    products: [
      { id: "shegeft-angiz-10", title: "پاپ کورن پنیری مزپاف", supportingText: "۹۰ گرم", image: shegeftangiz10, price: 48500, previousPrice: 69000, discountPercent: 30, maxQuantity: 3, discountVariant: "amazing" },
      { id: "shegeft-angiz-11", title: "مایع لباسشویی رنگی تست", supportingText: "۲.۵ لیتر", image: shegeftangiz11, price: 289000, previousPrice: 412000, discountPercent: 30, maxQuantity: 3, discountVariant: "amazing" },
      { id: "shegeft-angiz-12", title: "نوشابه لیمویی فانتا", supportingText: "۱.۵ لیتر", image: shegeftangiz12, price: 42900, previousPrice: 52000, discountPercent: 17, maxQuantity: 3, discountVariant: "amazing" },
      { id: "shegeft-angiz-25", title: "نوار بهداشتی بالدار شبانه تافته", supportingText: "۱۰ عدد", image: shegeftangiz25, price: 96500, previousPrice: 129000, discountPercent: 25, maxQuantity: 3, discountVariant: "amazing" },
      { id: "shegeft-angiz-26", title: "اسنک حلقه‌ای بستنی", supportingText: "۵۰ گرم", image: shegeftangiz26, price: 23800, previousPrice: 29000, discountPercent: 18, maxQuantity: 3, discountVariant: "amazing" },
      { id: "shegeft-angiz-6", title: "شیر کم‌چرب روزانه", supportingText: "۱ لیتر", image: shegeftangiz6, price: 54900, previousPrice: 61000, discountPercent: 10, maxQuantity: 3, discountVariant: "amazing" },
      { id: "shegeft-angiz-7", title: "پنیر سفید فتا پگاه", supportingText: "۴۰۰ گرم", image: shegeftangiz7, price: 128000, previousPrice: 152000, discountPercent: 16, maxQuantity: 3, discountVariant: "amazing" },
      { id: "shegeft-angiz-9", title: "پفک نمکی چی‌توز", supportingText: "۹۰ گرم", image: shegeftangiz9, price: 36500, previousPrice: 44000, discountPercent: 17, maxQuantity: 3, discountVariant: "amazing" }
    ],
  },
  {
    id: "kharbar", appearance: "default", title: "خواربار",
    products: [
      { id: "kharbar-17", title: "اسپاگتی قطر ۱.۲ ماک", supportingText: "۷۰۰ گرم", image: kharbar17, price: 58000, maxQuantity: 5 },
      { id: "kharbar-18", title: "ماکارونی پیچی تک ماکارون", supportingText: "۵۰۰ گرم", image: kharbar18, price: 47500, previousPrice: 56000, discountPercent: 15, maxQuantity: 5 },
      { id: "kharbar-19", title: "روغن مایع سرخ کردنی لادن", supportingText: "۸۱۰ گرم", image: kharbar19, price: 129000, maxQuantity: 5 },
      { id: "kharbar-20", title: "ماکارونی فرمی تک ماکارون", supportingText: "۵۰۰ گرم", image: kharbar20, price: 47500, previousPrice: 56000, discountPercent: 15, maxQuantity: 5 }
    ],
  },
  {
    id: "labaniat", appearance: "default", title: "لبنیات",
    products: [
      { id: "labaniat-13", title: "کره حیوانی آذربایجان", supportingText: "۱۰۰ گرم", image: labaniat13, price: 98000, previousPrice: 115000, discountPercent: 15, maxQuantity: 5 },
      { id: "labaniat-14", title: "شیر کم‌چرب کاله", supportingText: "۹۴۵ میلی‌لیتر", image: labaniat14, price: 62500, maxQuantity: 5 },
      { id: "labaniat-15", title: "ماست یونانی کیبی", supportingText: "۴۰۰ گرم", image: labaniat15, price: 119000, previousPrice: 140000, discountPercent: 15, maxQuantity: 5 },
      { id: "labaniat-16", title: "ماست سون پرچرب کاله", supportingText: "۹۰۰ گرم", image: labaniat16, price: 86900, previousPrice: 99000, discountPercent: 12, maxQuantity: 5 }
    ],
  },
  {
    id: "meat", appearance: "default", title: "گوشت و پروتئین",
    products: [
      { id: "meat-21", title: "گوشت گوساله خورشتی", supportingText: "۵۰۰ گرم", image: meat21, price: 489000, previousPrice: 545000, discountPercent: 10, maxQuantity: 5 },
      { id: "meat-22", title: "ران گوسفندی تازه", supportingText: "۱ کیلوگرم", image: meat22, price: 1290000, maxQuantity: 5 },
      { id: "meat-23", title: "گوشت گوساله مخلوط", supportingText: "۱ کیلوگرم", image: meat23, price: 929000, previousPrice: 1050000, discountPercent: 12, maxQuantity: 5 },
      { id: "meat-24", title: "فیله گوساله ممتاز", supportingText: "۵۰۰ گرم", image: meat24, price: 745000, maxQuantity: 5 }
    ],
  },
  {
    id: "nivea",
    appearance: "promotion",
    color: "#003eff",
    title: "محصولات نیوآ",
    description: "مراقبت روزانه با تخفیف ویژه",
    visual: { src: niveaArtwork, alt: "محصولات نیوآ" },
    products: [
      { id: "nivea-6", title: "رول ضد تعریق مردانه نیوآ دیپ", supportingText: "۵۰ میلی‌لیتر", image: nivea6, price: 215000, previousPrice: 269000, discountPercent: 20, maxQuantity: 5 },
      { id: "nivea-7", title: "اسپری ضد تعریق زنانه نیوآ درای کامفورت", supportingText: "۱۵۰ میلی‌لیتر", image: nivea7, price: 239000, previousPrice: 299000, discountPercent: 20, maxQuantity: 5 },
      { id: "nivea-8", title: "کرم مرطوب‌کننده نیوآ سافت", supportingText: "۱۰۰ میلی‌لیتر", image: nivea8, price: 189000, previousPrice: 236000, discountPercent: 20, maxQuantity: 5 },
      { id: "nivea-9", title: "کرم مرطوب‌کننده نیوآ سافت میکس‌می", supportingText: "۱۰۰ میلی‌لیتر", image: nivea9, price: 199000, previousPrice: 249000, discountPercent: 20, maxQuantity: 5 },
      { id: "nivea-10", title: "لوسیون بدن نیوآ مدل اکسپرس", supportingText: "۴۰۰ میلی‌لیتر", image: nivea10, price: 329000, previousPrice: 412000, discountPercent: 20, maxQuantity: 5 },
      { id: "nivea-11", title: "اسپری ضد تعریق نیوآ بلک‌اند‌وایت", supportingText: "۱۵۰ میلی‌لیتر", image: nivea11, price: 239000, previousPrice: 299000, discountPercent: 20, maxQuantity: 5 },
      { id: "nivea-12", title: "کرم دست و صورت نیوآ سافت", supportingText: "۷۵ میلی‌لیتر", image: nivea12, price: 149000, previousPrice: 186000, discountPercent: 20, maxQuantity: 5 },
      { id: "nivea-13", title: "استیک ضد تعریق نیوآ من دیپ", supportingText: "۵۰ میلی‌لیتر", image: nivea13, price: 259000, previousPrice: 324000, discountPercent: 20, maxQuantity: 5 }
    ],
  },
];
