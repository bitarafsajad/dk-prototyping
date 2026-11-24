import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createProductModal } from "./modalController";
import { formatPrice } from "../Price";
import { toFa } from "../Badge";
import amazingIcon from "../assets/amazing-icon.png";
import { describe, categoryOf } from "./descriptions";
import "./ProductModal.css";

/** Card product → modal product: the exact information of the product card + a description. */
export function toModalProduct(p) {
  const tags = [categoryOf(p.title).tag];
  if (p.textBadge) tags.push(p.textBadge);
  return {
    id: String(p.id),
    image: p.image,
    title: [p.title, p.supportingText].filter(Boolean).join(" - "),
    tags,
    promo: p.discountPercent > 0 ? `-${toFa(p.discountPercent)} ٪` : "",
    promoIcon: p.discountPercent > 0 && p.discountVariant === "amazing" ? amazingIcon : "",
    price: formatPrice(p.price),
    prev: p.discountPercent > 0 && p.previousPrice ? formatPrice(p.previousPrice) : "",
    showShort: true,
    desc: p.description || describe(p),
  };
}

const Ctx = createContext(null);
/** open(products, index, imageEl, sectionEl) — or null outside a host */
export const useProductModal = () => useContext(Ctx);

/**
 * ProductModalHost — mounts the modal inside `container` (the page frame) and exposes open()
 * through context to every ProductCard below it.
 */
export function ProductModalHost({ containerRef, children }) {
  const ctl = useRef(null);
  const [api] = useState(() => ({
    open: (products, index, el, section) => ctl.current?.open(products.map(toModalProduct), index, el, section),
    close: () => ctl.current?.close(),
  }));
  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;
    ctl.current = createProductModal(host);
    return () => { ctl.current?.destroy(); ctl.current = null; };
  }, [containerRef]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
