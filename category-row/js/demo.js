// Demo only: resize the frame and show the measured sizes.
  const frame = document.getElementById('frame');
  const range = document.getElementById('w');
  const ctl = document.getElementById('ctl');
  const val = document.getElementById('val');
  const sEl = document.getElementById('s'), lEl = document.getElementById('l'), eEl = document.getElementById('e');
  const eq = document.getElementById('eq');
  const fmt = n => (Math.round(n * 10) / 10).toString();
  function update() {
    const v = +range.value;
    const p = (v - range.min) / (range.max - range.min) * 100;
    ctl.style.setProperty('--p', p + '%');
    frame.style.width = v + 'px';
    val.innerHTML = v + '<small>px</small>';
    requestAnimationFrame(() => {
      const s = frame.querySelector('.cat-item--small').getBoundingClientRect().width;
      const l = frame.querySelector('.cat-item--large').getBoundingClientRect().width;
      sEl.textContent = fmt(s); lEl.textContent = fmt(l); eEl.textContent = fmt(2 * s + 8);
      eq.classList.toggle('chip--ok', Math.abs(l - (2 * s + 8)) < 0.5);
    });
  }
  range.addEventListener('input', update);
  document.querySelector('.tick--figma').addEventListener('click', () => { range.value = 390; update(); range.focus(); });
  update();
