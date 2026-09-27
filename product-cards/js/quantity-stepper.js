/* Quantity stepper — vanilla JS, no dependencies */
/* Quantity stepper — one instance per .qs */
function QuantityStepper(root, { idle = 1500 } = {}){
  const count = root.querySelector('.qs__count');
  const num   = root.querySelector('.qs__plus-num');
  const plus  = root.querySelector('.qs__hit--plus');
  const minus = root.querySelector('.qs__hit--minus');
  const fa = n => n.toLocaleString('fa-IR');
  const ctx = document.createElement('canvas').getContext('2d');
  let qty = 0, timer;

  function centerNum(){
    const cs = getComputedStyle(num);
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m = ctx.measureText(num.textContent), lh = parseFloat(cs.lineHeight);
    const probe = document.createElement('span'), dot = document.createElement('i');
    probe.style.cssText = `position:absolute;visibility:hidden;top:0;left:0;white-space:nowrap;font:${ctx.font};line-height:${lh}px`;
    dot.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    probe.append(num.textContent, dot); document.body.appendChild(probe);
    const baseline = dot.getBoundingClientRect().top - probe.getBoundingClientRect().top; probe.remove();
    const inkMidY = baseline - (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent)/2;
    const inkMidX = (m.actualBoundingBoxRight - m.actualBoundingBoxLeft)/2;
    num.style.setProperty('--num-dy', (lh/2 - inkMidY).toFixed(2) + 'px');
    num.style.setProperty('--num-dx', (m.width/2 - inkMidX).toFixed(2) + 'px');
  }
  document.fonts.ready.then(centerNum);

  function setCount(next, dir){
    const old = count.lastElementChild, el = document.createElement('span');
    el.textContent = fa(next);
    if (dir && old){ old.className = 'out-' + dir; old.addEventListener('animationend', () => old.remove(), { once:true }); el.className = 'in-' + dir; }
    else if (old) old.remove();
    count.appendChild(el);
  }
  function compact(on){
    root.toggleAttribute('data-compact', on);
    plus.setAttribute('aria-label', on ? `تعداد: ${fa(qty)} — ویرایش` : qty ? 'افزایش تعداد' : 'افزودن به سبد');
  }
  function armIdle(){ clearTimeout(timer); if (qty > 0) timer = setTimeout(() => compact(true), idle); }
  function update(next){
    const prev = qty; qty = Math.max(0, next);
    if (qty > 0 && prev === 0){ setCount(qty); root.setAttribute('data-open',''); }
    else if (qty === 0){ root.removeAttribute('data-open'); }
    else setCount(qty, qty > prev ? 'up' : 'down');
    num.textContent = fa(qty || 1); centerNum();
    compact(false); armIdle();
    root.dispatchEvent(new CustomEvent('qtychange', { detail: qty, bubbles: true }));
  }
  plus.addEventListener('click', () => {
    if (root.hasAttribute('data-compact')){ compact(false); armIdle(); } else update(qty + 1);
  });
  minus.addEventListener('click', () => update(qty - 1));
}
// Auto-init every stepper on the page
document.querySelectorAll('.qs').forEach(el => QuantityStepper(el));
