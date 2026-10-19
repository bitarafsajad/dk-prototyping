(() => {
  const $ = s => document.querySelector(s);
  const root = document.documentElement;
  const app = $('#app');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!(window.CSS && CSS.registerProperty)) root.classList.add('no-prop');
  const fa = s => String(s).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  const toLatin = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

  /* ---------------- product cards (data from Figma, images in Figma's order) ---------------- */
  const IMGS = ["assets/images/placeImage.jpg", "assets/images/placeImage-1.jpg", "assets/images/placeImage-2.jpg", "assets/images/placeImage-3.jpg", "assets/images/placeImage-4.jpg", "assets/images/placeImage-5.jpg", "assets/images/placeImage-6.jpg", "assets/images/placeImage-7.jpg", "assets/images/placeImage-8.jpg", "assets/images/placeImage-9.jpg", "assets/images/placeImage-10.jpg", "assets/images/placeImage-11.jpg"];
  const TOMAN = '<svg viewBox="0 0 13 8" aria-hidden="true"><path fill="#000" d="M8.59401 1.71429 L3.76766 1.71429 L3.76766 0 L8.59401 0 L8.59401 1.71429 Z M12.891 2.67669 C12.7976 1.93985 12.6575 1.17293 12.4862 0.360902 L10.8048 1.02256 C11.0228 1.89474 11.194 2.75188 11.3497 3.57895 C11.4431 4.10526 11.521 4.57143 11.5832 5.03759 C11.0383 5.23308 10.2443 5.41353 9.18563 5.56391 C7.83114 5.7594 6.3988 5.84962 4.90419 5.84962 C4.06347 5.84962 3.40958 5.80451 2.92695 5.72932 C2.44431 5.6391 2.08623 5.47368 1.82156 5.23308 C1.55689 4.99248 1.43234 4.61654 1.43234 4.1203 C1.43234 3.57895 1.47904 2.93233 1.54132 2.16541 L0.311377 2 C0.28024 2.09023 0.264671 2.21053 0.249102 2.3609 C0.186826 2.79699 0.124551 3.21805 0.0778443 3.60902 C0.0311377 4.01504 0 4.37594 0 4.70677 C0 5.95489 0.40479 6.81203 1.1988 7.29323 C2.00838 7.7594 3.14491 8 4.62395 8 C5.82275 8 6.97485 7.92481 8.06467 7.78947 C9.17006 7.65414 10.1353 7.44361 10.9449 7.17293 C11.4431 6.99248 11.8323 6.79699 12.1281 6.6015 C12.424 6.40601 12.6419 6.15038 12.782 5.83459 C12.9222 5.5188 13 5.11278 13 4.58647 C13 4.03008 12.9533 3.38346 12.8443 2.66165 L12.891 2.67669 Z"/></svg>';
  const ROW1 = [
    [0,'-۲۰ ٪','۳۲۴٬۰۰۰','۴۱۰٬۰۰۰',-6.02],[1,'-۳۴ ٪','۱۵۷٬۲۲۰','۲۳۹٬۰۰۰',-5.2],[2,'-۷۰ ٪','۱۸٬۹۰۰','۶۳٬۰۰۰',-6.3],
    [3,'-۸۰ ٪','۱۰٬۹۲۰','۵۴٬۰۰۰',-6.3],[4,'-۴۰ ٪','۱۰۳٬۰۰۰','۱۵۸٬۰۰۰',-5.76],[5,'-۲۳ ٪','۲۲۷٬۵۰۰','۲۹۷٬۵۰۰',-5.3]];
  const ROW2 = [
    [6,'-۶۰ ٪','۳۵٬۹۰۰','۹۰٬۰۰۰',-6.96],[7,'-۳۱ ٪','۱۱۶٬۶۰۰','۱۷۰٬۰۰۰',-6.16],[8,'-۴۵ ٪','۹۳٬۵۰۰','۱۷۰٬۰۰۰',-6.16],
    [9,'-۱۵ ٪','۵۰۴٬۰۰۰','۵۹۴٬۰۰۰',-5.41],[10,'-۴۱ ٪','۴۷٬۷۵۰','۱۰۰٬۰۰۰',-6.3],[11,'-۴۱ ٪','۶۷٬۰۰۰','۱۱۵٬۰۰۰',-6.3]];
  const card = ([img, off, price, prev, rot]) => `
    <div class="card" data-name="ProductCard">
      <div class="thumb">
        <div class="tbg"></div><img src="${IMGS[img]}" alt="" loading="eager" decoding="async">
        <div class="badge" dir="ltr">${off}</div>
        <div class="qs" data-pid="${img}" style="--img:url('${new URL(IMGS[img], location.href).href}')">
          <div class="qs__pill">
            <div class="qs__bg"><div class="qs__glass"></div></div>
            <div class="qs__clip"><div class="qs__row">
              <span class="qs__minus"></span>
              <span class="qs__count" aria-live="polite"><span>۱</span></span>
              <span class="qs__plus"><span class="qs__plus-bg"></span><span class="qs__plus-clip"><span class="qs__plus-icon"></span><span class="qs__plus-num">۱</span></span></span>
            </div></div>
            <div class="qs__border"></div>
            <button class="qs__hit qs__hit--minus" type="button" aria-label="کم کردن"></button>
            <button class="qs__hit qs__hit--plus" type="button" aria-label="افزودن به سبد"></button>
          </div>
        </div>
      </div>
      <div class="tf"><div class="price">
        <div class="final"><div class="pws">${TOMAN}<b>${price}</b></div><div class="hl"></div></div>
        <div class="prev"><span>${prev}</span><i style="--rot:${rot}deg"></i></div>
      </div></div>
    </div>`;
  const fill = (el, data) => { const one = data.map(card).join(''); el.innerHTML = one + one + one; };
  fill($('#row1'), ROW1); fill($('#row2'), ROW2);

  /* ---------------- cart + quantity stepper (reference logic; one cart shared by the
     three marquee copies of each product) ---------------- */
  const CART = {};            /* productId → quantity */
  const STEPPERS = {};        /* productId → [stepper, …] */
  const faN = n => n.toLocaleString('fa-IR');
  /* Safari < 17.2 has no linear() easing: an unsupported value would drop the stepper's whole
     transition/animation declarations, so fall back to equivalent cubic-beziers there */
  if (!CSS.supports('transition-timing-function', 'linear(0, 1)')) {
    root.style.setProperty('--qs-ease', 'cubic-bezier(.25,1.1,.4,1)');
    root.style.setProperty('--qs-bounce', 'cubic-bezier(.3,1.45,.45,1)');
  }
  /* rows keep scrolling at all times */
  function syncRow(){}
  function QuantityStepper(root, { idle = 1500 } = {}){
    const count = root.querySelector('.qs__count');
    const num   = root.querySelector('.qs__plus-num');
    const plus  = root.querySelector('.qs__hit--plus');
    const minus = root.querySelector('.qs__hit--minus');
    const pid = root.dataset.pid, row = root.closest('.row');
    let qty = 0, timer;
    function setCount(next, dir){
      const old = count.lastElementChild, el = document.createElement('span');
      el.textContent = faN(next);
      if (dir && old){ old.className = 'out-' + dir; const kill = () => old.remove(); old.addEventListener('animationend', kill, { once:true }); setTimeout(kill, 600); el.className = 'in-' + dir; }
      else if (old) old.remove();
      count.appendChild(el);
    }
    function compact(on){
      root.toggleAttribute('data-compact', on);
      plus.setAttribute('aria-label', on ? `تعداد: ${faN(qty)} — ویرایش` : qty ? 'افزایش تعداد' : 'افزودن به سبد');
      syncRow(row);
    }
    function armIdle(){ clearTimeout(timer); }   /* stays expanded — no auto-collapse */
    function render(next, animate){
      const prev = qty; qty = Math.max(0, next);
      if (qty > 0 && prev === 0){ setCount(qty); root.setAttribute('data-open',''); }
      else if (qty === 0){ root.removeAttribute('data-open'); }
      else setCount(qty, animate ? (qty > prev ? 'up' : 'down') : null);
      num.textContent = faN(qty || 1);
    }
    function update(next){
      render(next, true);
      compact(false); armIdle();
      CART[pid] = qty;
      STEPPERS[pid].forEach(s => s !== api && s.sync(qty));
      root.dispatchEvent(new CustomEvent('qtychange', { detail:{ id:+pid, qty, cart:{ ...CART } }, bubbles:true }));
    }
    const api = {
      /* the other marquee copies of the same product follow along */
      sync(q){ clearTimeout(timer); render(q, false); root.removeAttribute('data-compact'); }
    };
    plus.addEventListener('click', () => {
      if (root.hasAttribute('data-compact')){ compact(false); armIdle(); } else update(qty + 1);
    });
    minus.addEventListener('click', () => update(qty - 1));
    (STEPPERS[pid] = STEPPERS[pid] || []).push(api);
  }
  document.querySelectorAll('.qs').forEach(el => QuantityStepper(el));

  /* ---------------- slides ---------------- */
  const SLIDES = [
    { bg:'#FFEFDB', fog:'#FEF3E6' },
    { bg:'#FFEFDB', fog:'#FEF3E6' },
    { bg:'#FFEFDB', fog:'#FEF3E6' },
  ];
  const slides = [...document.querySelectorAll('.slide')];
  const dots = [...document.querySelectorAll('.indicator button')];
  let cur = 0, slideTimer = null;
  /* light spring (damping 0.72 → ~4% overshoot), sampled into a linear() easing */
  const SPRING = (() => {
    const z = .72, w = 10, wd = w * Math.sqrt(1 - z * z), pts = [];
    for (let k = 0; k <= 48; k++) {
      const t = k / 48;
      const x = 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t));
      pts.push(+x.toFixed(4));
    }
    pts[pts.length - 1] = 1;
    const css = `linear(${pts.join(',')})`;
    return CSS.supports('transition-timing-function', css) ? css : 'cubic-bezier(.3,1.25,.5,1)';
  })();
  const SHIFT = 56;
  function animateSlides(from, to, dir, fromX = 0, fromO = 1){
    if (reduced) {
      from.animate([{ opacity:1 }, { opacity:0 }], { duration:200, easing:'ease' });
      to.animate([{ opacity:0 }, { opacity:1 }], { duration:260, easing:'ease' });
      return;
    }
    /* outgoing: quick, eased slide away */
    from.getAnimations({ subtree:true }).forEach(a => a.cancel());
    from.animate([{ opacity:fromO, transform:`translateX(${fromX}px)` }, { opacity:0, transform:`translateX(${-dir * SHIFT * .6 + fromX}px)` }],
                 { duration:220, easing:'cubic-bezier(.4,0,1,1)' });
    /* incoming: headline then paragraph, each on the spring */
    to.getAnimations({ subtree:true }).forEach(a => a.cancel());
    to.animate([{ opacity:0 }, { opacity:1 }], { duration:300, delay:150, easing:'ease-out', fill:'backwards' });
    [to.querySelector('.head'), to.querySelector('.para')].forEach((el, n) => {
      el.animate([{ transform:`translateX(${dir * SHIFT}px)` }, { transform:'none' }],
                 { duration:820, delay:150 + n * 55, easing:SPRING, fill:'backwards' });
    });
  }
  function show(i, dir = 1, fromX = 0, fromO = 1){
    const prev = cur;
    cur = (i + SLIDES.length) % SLIDES.length;
    if (prev !== cur) animateSlides(slides[prev], slides[cur], dir, fromX, fromO);
    slides.forEach((s, k) => s.classList.toggle('on', k === cur));
    dots.forEach((d, k) => { d.dataset.d = Math.abs(k - cur); d.setAttribute('aria-selected', k === cur); });
    if (current === 'landing') setBg(SLIDES[cur].bg);
    root.style.setProperty('--fog', SLIDES[cur].fog);
  }
  function setBg(c){ app.style.setProperty('--page-bg', c); root.style.setProperty('--page-bg', c); }
  const startSlides = () => { clearInterval(slideTimer); slideTimer = setInterval(() => show(cur + 1, 1), 4000); };
  const stopSlides = () => clearInterval(slideTimer);
  dots.forEach(d => d.addEventListener('click', () => { const k = +d.dataset.go; show(k, k >= cur ? 1 : -1); startSlides(); }));

  /* ---------------- swipe the copy left / right ---------------- */
  const copyEl = document.querySelector('.copy');
  let sx = 0, sy = 0, dx = 0, st = 0, dragging = false, axis = null;
  copyEl.addEventListener('pointerdown', e => {
    if (e.button) return;
    dragging = true; axis = null; dx = 0; sx = e.clientX; sy = e.clientY; st = performance.now();
  });
  copyEl.addEventListener('pointermove', e => {
    if (!dragging) return;
    const mx = e.clientX - sx, my = e.clientY - sy;
    if (axis === null) {
      if (Math.abs(mx) < 6 && Math.abs(my) < 6) return;
      axis = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
      if (axis === 'x') {
        copyEl.setPointerCapture(e.pointerId);
        stopSlides();
        slides.forEach(s => s.getAnimations({ subtree:true }).forEach(a => a.finish()));
      }
    }
    if (axis !== 'x') return;
    dx = mx;
    const s = slides[cur];
    s.style.transform = `translateX(${dx * .55}px)`;
    s.style.opacity = Math.max(.35, 1 - Math.abs(dx) / 320);
  });
  function endSwipe(){
    if (!dragging) return;
    dragging = false;
    if (axis !== 'x') return;
    const s = slides[cur];
    const fromX = dx * .55, fromO = +s.style.opacity || 1;
    const v = dx / Math.max(1, performance.now() - st);           /* px per ms */
    s.style.transform = ''; s.style.opacity = '';
    if (Math.abs(dx) > 48 || Math.abs(v) > .45) {
      const dir = dx < 0 ? 1 : -1;                                  /* finger left → next */
      show(cur + dir, dir, fromX, fromO);
    } else {
      s.animate([{ transform:`translateX(${fromX}px)`, opacity:fromO }, { transform:'none', opacity:1 }], { duration:620, easing:SPRING });
    }
    if (current === 'landing' && document.activeElement !== phone) startSlides();
  }
  copyEl.addEventListener('pointerup', endSwipe);
  copyEl.addEventListener('pointercancel', endSwipe);

  /* ---------------- screens ---------------- */
  let current = 'landing';
  function go(id){
    const from = $('#' + current), to = $('#' + id);
    from.classList.add('leaving'); from.classList.remove('active');
    setTimeout(() => from.classList.remove('leaving', 'kb'), 450);
    to.classList.add('active');
    current = id;
    if (id === 'landing') { setBg(SLIDES[cur].bg); startSlides(); }
    else { stopSlides(); setBg(id === 'discount' ? '#F6F4F1' : '#F6F4F1'); }
  }

  /* ---------------- keyboard: one smooth move, in step with the keyboard (Gemini-style) ----------------
     iOS only reports the new visual viewport once the keyboard has finished sliding in, so waiting
     for it makes the page jump late. Instead the page starts moving the moment the input is focused,
     towards the keyboard height we expect (learned from the last time it opened), on a curve close to
     the system keyboard's; the real viewport then only nudges it if the guess was off. */
  const vv = window.visualViewport;
  const touch = matchMedia('(pointer: coarse)').matches;
  const KB_EASE = 'cubic-bezier(.38,.7,.125,1)', KB_MS = 480;
  let fullH = vv ? vv.height : innerHeight, kbH = 0, appliedH = null;
  try { kbH = +localStorage.getItem('kbH') || 0; } catch (_) {}
  if (!kbH) kbH = Math.round(Math.min(340, Math.max(260, fullH * .36)));
  const typing = () => !!document.querySelector('.screen.kb');
  function setH(h, t = 0){ appliedH = h; root.style.setProperty('--vvh', h + 'px'); root.style.setProperty('--vvt', t + 'px'); }
  /* FLIP per block: measure where each block is now (mid-animation included), change the layout,
     then let every block glide from there — the cards/headline and the input bar each keep their
     own path, so nothing jumps when the spacer between them grows or shrinks */
  function move(change, ms = KB_MS){
    const scr = $('#' + current), col = scr && scr.querySelector('.col');
    if (!col) { change(); placeFog(); return; }
    const kids = [...col.children].filter(el => !el.classList.contains('wash') && !el.classList.contains('spacer'));
    const before = kids.map(el => el.getBoundingClientRect().top);
    kids.forEach(el => el.getAnimations().forEach(a => { if (a.id === 'kb') a.cancel(); }));
    change();
    placeFog();
    if (reduced) return;
    kids.forEach((el, i) => {
      const d = before[i] - el.getBoundingClientRect().top;
      if (Math.abs(d) > 1) el.animate([{ transform:`translateY(${d}px)` }, { transform:'none' }], { duration:ms, easing:KB_EASE, id:'kb' });
    });
  }
  let kbAt = 0;   /* when the keyboard was last opened/closed */
  /* The keyboard can go away while the input keeps focus (iOS swipe-down / keyboard hide), so no
     blur event fires. Follow the keyboard itself: gone → leave typing mode (top blur, button);
     back → enter it again. */
  const focusedScreen = () => {
    const a = document.activeElement;
    return a && (a.id === 'phone' || a.id === 'otpInput') && a.closest('.screen.active');
  };
  function kbGone(scr){
    setKb(scr, false);
    if (scr.id === 'landing') $('#phoneBtnWrap').classList.remove('show');
  }
  function kbBack(scr){
    if (scr.id === 'landing') $('#phoneBtnWrap').classList.add('show');
    setKb(scr, true);
  }
  function syncVV(){
    const h = vv ? vv.height : innerHeight, t = vv ? vv.offsetTop : 0;
    const settling = performance.now() - kbAt < 700;
    if (!typing()) {
      /* keyboard still sliding away: don't mistake the shrinking viewport for the page height */
      if (settling && appliedH !== null && h < appliedH - 1) return;
      /* keyboard came back up on an input that never lost focus */
      const fs = touch && !settling && focusedScreen();
      if (fs && fullH - h > 120) { kbBack(fs); return; }
      fullH = h; setH(h, t); placeFog(); return;
    }
    /* keyboard not up yet: keep the predicted position instead of bouncing back down */
    if (settling && appliedH !== null && h > appliedH + 1) return;
    /* keyboard dismissed but the input is still focused */
    if (touch && !settling && h > fullH - 80) { kbGone($('.screen.kb')); return; }
    const k = fullH - h;
    if (k > 120 && k < fullH * .65) { kbH = Math.round(k); try { localStorage.setItem('kbH', kbH); } catch (_) {} }
    if (appliedH !== null && Math.abs(h - appliedH) <= 1) { root.style.setProperty('--vvt', t + 'px'); return; }
    move(() => setH(h, t), 280);           /* small correction so input + button sit right on the keyboard */
  }
  if (vv) { vv.addEventListener('resize', syncVV); vv.addEventListener('scroll', syncVV); }
  addEventListener('resize', syncVV);
  syncVV();
  /* iOS still tries to scroll the (unscrollable) document when an input focuses */
  addEventListener('scroll', () => { if (scrollY) scrollTo(0, 0); }, { passive:true });

  function placeFog(){
    const s = $('#landing'), copy = s.querySelector('.copy'), col = s.querySelector('.col');
    if (!s.classList.contains('kb')) return;
    /* fade ends just above the headline, wherever the keyboard leaves it */
    s.style.setProperty('--fogH', Math.max(0, col.offsetTop + copy.offsetTop - s.scrollTop - 6) + 'px');
  }
  let settleT = 0;
  function setKb(screen, on){
    kbAt = performance.now();
    move(() => {
      screen.classList.toggle('kb', on);
      if (on) screen.scrollTop = 0;
      if (touch) setH(on ? fullH - kbH : fullH, 0);   /* move with the keyboard, not after it */
    });
    /* iOS sometimes skips the final viewport event (e.g. when the AutoFill bar appears):
       keep checking for a moment so input + button always end up right on the keyboard */
    clearInterval(settleT); let n = 0;
    settleT = setInterval(() => { syncVV(); if (++n > 14) clearInterval(settleT); }, 100);
  }

  /* ---------------- phone ---------------- */
  const phone = $('#phone'), phoneBtn = $('#phoneBtn'), wrap = $('#phoneBtnWrap'), landing = $('#landing');
  const validPhone = () => /^09\d{9}$/.test(phone.value);
  phone.addEventListener('focus', () => {
    stopSlides();
    wrap.classList.add('show');
    setKb(landing, true);
  });
  phone.addEventListener('blur', () => {
    setTimeout(() => {
      if (document.activeElement === phone || current !== 'landing') return;
      wrap.classList.remove('show');   /* the button only lives under the input while typing */
      setKb(landing, false);
      startSlides();
    }, 60);
  });
  phone.addEventListener('input', () => {
    const v = toLatin(phone.value).replace(/\D/g, '').slice(0, 11);
    if (v !== phone.value) phone.value = v;
  });
  /* keep the keyboard up while the button is pressed */
  phoneBtn.addEventListener('pointerdown', e => { if (document.activeElement === phone) e.preventDefault(); });
  phone.addEventListener('keydown', e => { if (e.key === 'Enter') submitPhone(); });
  /* focus ourselves without letting iOS scroll the page to the input (it would fight the glide) */
  $('.field').addEventListener('touchend', e => {
    if (document.activeElement !== phone) { e.preventDefault(); phone.focus({ preventScroll:true }); }
  }, { passive:false });
  phoneBtn.addEventListener('click', submitPhone);
  function submitPhone(){
    if (!validPhone()) { phone.focus(); $('.field').animate([{transform:'translateX(-8px)'},{transform:'translateX(7px)'},{transform:'translateX(-4px)'},{transform:'none'}], {duration:360}); return; }
    $('#otpPhone').textContent = fa(phone.value);
    otp.value = ''; renderOtp();
    go('otp');
    $('#otp').classList.add('kb');
    otp.focus({ preventScroll:true });   /* inside the click → the keyboard stays open */
    startTimer();
  }

  /* ---------------- OTP ---------------- */
  const otp = $('#otpInput'), otpBox = $('#otpBox'), otpBtn = $('#otpBtn'), cells = [...otpBox.querySelectorAll('.cell')];
  function renderOtp(){
    const v = otp.value;
    cells.forEach((c, i) => {
      const ch = v[i] || '';
      if (c.textContent !== ch) { c.textContent = ch; c.classList.remove('filled'); if (ch) { void c.offsetWidth; c.classList.add('filled'); } }
      c.classList.toggle('cur', i === Math.min(v.length, 4) && (v.length < 5 || i === 4));
    });
  }
  otp.addEventListener('input', () => {
    otp.value = toLatin(otp.value).replace(/\D/g, '').slice(0, 5);
    otpBox.classList.remove('err');
    renderOtp();
    if (otp.value.length === 5) setTimeout(submitOtp, 260);
  });
  otp.addEventListener('focus', () => setKb($('#otp'), true));
  otp.addEventListener('blur', () => setTimeout(() => { if (current === 'otp' && document.activeElement !== otp) setKb($('#otp'), false); }, 60));
  otp.addEventListener('keydown', e => { if (e.key === 'Enter') submitOtp(); });
  otpBtn.addEventListener('pointerdown', e => { if (document.activeElement === otp) e.preventDefault(); });
  otpBtn.addEventListener('click', submitOtp);
  otpBox.addEventListener('click', () => otp.focus({ preventScroll:true }));
  otpBox.addEventListener('touchend', e => {
    if (document.activeElement !== otp) { e.preventDefault(); otp.focus({ preventScroll:true }); }
  }, { passive:false });
  function submitOtp(){
    if (current !== 'otp') return;
    if (otp.value.length !== 5) { otpBox.classList.remove('shake'); void otpBox.offsetWidth; otpBox.classList.add('shake', 'err'); otp.focus(); return; }
    otp.blur();
    clearInterval(timerId);
    resetDiscount();
    go('discount');
  }
  $('#editPhone').addEventListener('click', e => {
    e.preventDefault(); clearInterval(timerId);
    go('landing'); phone.focus();
  });
  let timerId, left = 0;
  function startTimer(){
    left = 120; tick(); clearInterval(timerId); timerId = setInterval(tick, 1000);
  }
  function tick(){
    const t = $('#timer');
    if (left <= 0) { clearInterval(timerId); t.innerHTML = '<button class="linkbtn" id="resend">ارسال مجدد کد</button>'; $('#resend').onclick = () => { startTimer(); otp.focus(); }; return; }
    const m = Math.floor(left / 60), s = left % 60;
    t.textContent = `${fa(String(m).padStart(2,'0'))}:${fa(String(s).padStart(2,'0'))} تا ارسال مجدد کد`;
    left--;
  }

  /* ---------------- spoiler + confetti ---------------- */
  const area = $('#spoilerArea'), spoiler = $('#spoiler'), code = $('#code'), sparkEl = $('#spark'), toast = $('#toast');
  let sparkAnim = null, revealed = false;
  function playSpark(){
    if (reduced || !window.lottie) return;
    if (!sparkAnim) {
      sparkAnim = lottie.loadAnimation({ container:sparkEl, renderer:'svg', loop:false, autoplay:false, animationData:CELEBRATION });
      sparkAnim.addEventListener('complete', () => sparkEl.classList.remove('on'));
    }
    sparkEl.classList.add('on');
    sparkAnim.goToAndPlay(0, true);
  }
  function reveal(e){
    if (revealed) return;
    revealed = true;
    const r = spoiler.getBoundingClientRect();
    const x = e && e.clientX ? e.clientX - r.left : r.width / 2;
    const y = e && e.clientY ? e.clientY - r.top : r.height / 2;
    spoiler.style.setProperty('--mx', x + 'px'); spoiler.style.setProperty('--my', y + 'px');
    $('#discount').classList.add('revealing');
    code.removeAttribute('aria-hidden');
    spoiler.setAttribute('aria-hidden', 'true');
    navigator.vibrate && navigator.vibrate(12);
    playSpark();
    setTimeout(() => $('#discount').classList.add('revealed'), 900);
  }
  spoiler.addEventListener('click', reveal);
  spoiler.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); } });
  code.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('FAFES'); flash('کد تخفیف کپی شد'); } catch (_) {}
  });
  function flash(msg){ toast.textContent = msg; toast.classList.add('on'); clearTimeout(flash.t); flash.t = setTimeout(() => toast.classList.remove('on'), 1600); }
  function resetDiscount(){
    revealed = false;
    $('#discount').classList.remove('revealing', 'revealed');
    spoiler.removeAttribute('aria-hidden'); code.setAttribute('aria-hidden', 'true');
  }
  $('#shopBtn').addEventListener('click', () => {
    phone.value = ''; wrap.classList.remove('show');
    landing.classList.remove('kb'); landing.scrollTop = 0;
    go('landing'); show(0);
  });

  show(0); startSlides();
})();
