import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Counter, Thumbnail, Price, DiscountBadge, TextBadge, ProductCard, BottomNavigation, Carousel, SECTIONS, Category } from "../src";
import sunscreen from "../src/assets/product-sunscreen.jpg";
import shampoo from "../src/assets/product-shampoo.jpg";
import cereal from "../src/assets/product-cereal.jpg";
import "./preview.css";

const P = {
  sunscreen: {
    title: "فلوئید ضد آفتاب ویتامین سی", supportingText: "SPF ۵۰", image: sunscreen,
    price: 1399000, previousPrice: 1636830, discountPercent: 17, maxQuantity: 3,
  },
  shampoo: {
    title: "شامپو روزانه مردانه ضد شوره مدل آبرسان", supportingText: "۴۰۰ میلی‌لیتر", image: shampoo,
    price: 289000, previousPrice: 349000, discountPercent: 17, discountVariant: "amazing", maxQuantity: 5,
  },
  cereal: {
    title: "کورن فلکس صبحانه با عسل", supportingText: "۳۷۵ گرم", image: cereal,
    price: 245000, maxQuantity: 4,
  },
};
const noDisc = { ...P.sunscreen, discountPercent: 0 };

function Section({ title, children, note }) {
  return (
    <section className="pv-section">
      <h2>{title}</h2>
      {note && <p className="pv-note">{note}</p>}
      <div className="pv-row">{children}</div>
    </section>
  );
}
function Cell({ label, children }) {
  const white = label.includes("white");
  return (
    <div className={`pv-cell${white ? " pv-cell--tint" : ""}`}>
      <div className="pv-label">{label}</div>
      {children}
    </div>
  );
}

function LiveCounter({ variant, unit }) {
  const [q, setQ] = useState(0);
  const [loading, setLoading] = useState(false);
  const change = (n) => {
    setLoading(true);
    setTimeout(() => { setQ(n); setLoading(false); }, 600);
  };
  return <Counter variant={variant} quantity={q} max={3} loading={loading} unit={unit} onChange={change} />;
}

function Phone({ variant }) {
  const [active, setActive] = useState("home");
  const items = [P.sunscreen, P.shampoo, P.cereal, { ...P.shampoo, textBadge: "پرفروش" }, P.sunscreen, P.cereal, P.shampoo, P.sunscreen, P.cereal, P.shampoo, P.sunscreen, P.cereal];
  return (
    <div className="pv-phone">
      <div className="pv-phone__scroll">
        <div className="pv-grid">{items.map((p, i) => <ProductCard key={i} product={p} width={112} />)}</div>
      </div>
      <BottomNavigation variant={variant} activeId={active} onSelect={setActive} style={{ position: "absolute" }} />
    </div>
  );
}

function App() {
  return (
    <div className="pv">
      <section className="pv-section">
        <h2>Category — V3</h2>
        <div className="pv-home"><Category variant="v3" /></div>
      </section>
      <section className="pv-section">
        <h2>Carousel — home page sections (390px)</h2>
        <p className="pv-note">Swipe the rows · countdown is live · tap + to add.</p>
        <div className="pv-home" id="home">
          {SECTIONS.map(({ id, ...s }) => <Carousel key={id} {...s} />)}
        </div>
      </section>
      <Section title="BottomNavigation" note="Scroll inside the phones: products fade under the white gradient blur. Tap the tabs.">
        <Cell label="simple"><Phone variant="simple" /></Cell>
        <Cell label="with assistant"><Phone variant="assistant" /></Cell>
      </Section>
      <h1>Odds &amp; ends — Counter · Thumbnail · Price · Badge · ProductCard</h1>

      <Section title="Counter — float" note="Over imagery. Background shows the glass/blur effect.">
        <div className="pv-photo">
          {["add", "added", "max", "addedLoading", "addLoading", "collapsed"].map((s) => (
            <Cell key={s} label={s}><Counter variant="float" state={s} quantity={1} /></Cell>
          ))}
        </div>
      </Section>
      <Section title="Counter — fixed">
        {["add", "added", "max", "addedLoading", "addLoading"].map((s) => (
          <Cell key={s} label={s}><Counter variant="fixed" state={s} quantity={1} /></Cell>
        ))}
        <Cell label="added + unit"><Counter variant="fixed" state="added" quantity={1} unit="ورق" /></Cell>
        <Cell label="collapsed + unit"><Counter variant="fixed" state="collapsed" quantity={1} unit="ورق" /></Cell>
      </Section>
      <Section title="Counter — live" note="Tap + / − (fake 600 ms request shows the loader). Max = 3.">
        <div className="pv-photo pv-photo--small"><Cell label="float"><LiveCounter variant="float" /></Cell></div>
        <Cell label="fixed"><LiveCounter variant="fixed" /></Cell>
        <Cell label="fixed + unit"><LiveCounter variant="fixed" unit="ورق" /></Cell>
      </Section>

      <Section title="Thumbnail">
        <Cell label="hasBackground = true"><div style={{ width: 128 }}><Thumbnail src={sunscreen} /></div></Cell>
        <Cell label="hasBackground = false"><div style={{ width: 128 }}><Thumbnail src={sunscreen} hasBackground={false} /></div></Cell>
      </Section>

      <Section title="Price">
        <Cell label="rtl · discount"><Price /></Cell>
        <Cell label="rtl · no discount"><Price hasDiscount={false} /></Cell>
        <Cell label="rtl · out of stock"><Price state="outOfStock" /></Cell>
        <Cell label="rtl · pending"><Price isPricePending /></Cell>
        <Cell label="ltr · discount"><Price direction="ltr" /></Cell>
        <Cell label="ltr · no discount"><Price direction="ltr" hasDiscount={false} /></Cell>
        <Cell label="ltr · out of stock"><Price direction="ltr" state="outOfStock" /></Cell>
        <Cell label="ltr · pending"><Price direction="ltr" isPricePending /></Cell>
      </Section>

      <Section title="Badge">
        <Cell label="general"><DiscountBadge percent={17} /></Cell>
        <Cell label="amazing"><DiscountBadge percent={71} variant="amazing" /></Cell>
        <Cell label="text"><TextBadge>کالا‌برگ</TextBadge></Cell>
        <Cell label="text"><TextBadge>پرفروش</TextBadge></Cell>
        <Cell label="text"><TextBadge>یسنا</TextBadge></Cell>
      </Section>

      <Section title="ProductCard — variants (128px)" note="Tap + on any card to add it to the cart.">
        <Cell label="noBg · discount"><ProductCard product={P.sunscreen} /></Cell>
        <Cell label="white · discount"><ProductCard product={P.sunscreen} appearance="whiteBackground" /></Cell>
        <Cell label="noBg · discount · price only"><ProductCard product={P.sunscreen} isPriceOnly /></Cell>
        <Cell label="white · discount · price only"><ProductCard product={P.sunscreen} appearance="whiteBackground" isPriceOnly /></Cell>
        <Cell label="noBg · no discount"><ProductCard product={noDisc} /></Cell>
        <Cell label="white · no discount"><ProductCard product={noDisc} appearance="whiteBackground" /></Cell>
        <Cell label="noBg · no discount · price only"><ProductCard product={noDisc} isPriceOnly /></Cell>
        <Cell label="white · no discount · price only"><ProductCard product={noDisc} appearance="whiteBackground" isPriceOnly /></Cell>
      </Section>

      <Section title="ProductCard — text badges & supporting text">
        <Cell label="کالابرگ"><ProductCard product={{ ...P.sunscreen, textBadge: "کالا‌برگ" }} /></Cell>
        <Cell label="پرفروش"><ProductCard product={{ ...P.sunscreen, textBadge: "پرفروش" }} /></Cell>
        <Cell label="یسنا"><ProductCard product={{ ...P.sunscreen, textBadge: "یسنا" }} /></Cell>
        <Cell label="no supporting text"><ProductCard product={{ ...P.sunscreen, supportingText: null }} /></Cell>
        <Cell label="max 2 lines"><ProductCard product={{ ...P.sunscreen, title: "فلوئید ضد آفتاب ویتامین سی مناسب پوست چرب و مختلط حجم ۵۰ میلی‌لیتر" }} /></Cell>
      </Section>

      <Section title="ProductCard — responsive sizes">
        {[112, 128, 152, 184].map((w) => (
          <Cell key={w} label={`${w}px`}><ProductCard product={P.sunscreen} width={w} /></Cell>
        ))}
      </Section>

      <Section title="ProductCard — sample products">
        <div className="pv-shelf">
          {[P.sunscreen, P.shampoo, P.cereal, { ...P.shampoo, textBadge: "پرفروش" }, { ...P.cereal, state: "outOfStock" }].map((p, i) => (
            <ProductCard key={i} product={p} />
          ))}
        </div>
      </Section>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
