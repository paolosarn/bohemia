/* HOME BASE 6, 11/27/26: THE GLASS'S OWN FINGER (VAMILY rule 492(a)(c): every moment of YOUR PLACE a gate leg by a real tap).
   One place for what the gates and the VOTE card do to the flow on the map's glass (slices/bohemia_your_place.js): read the step it
   shows, wait for it (the map's voice, a road card or the hint plate can hold it a few beats: one face at a time), and press one of its
   buttons with a real touch at its real place on the screen, the map's frame offset added.
   const G = require('./bohemia_your_place_glass.js'); await G.until(F, 'good'); const b = await G.button(P, F, 'plant'); await G.tap(P, F, 'plant'); */
'use strict';
/* what the glass shows now (window.__YOUR_PLACE in the map's frame) */
async function state(F) { return F.evaluate(() => window.__YOUR_PLACE || null).catch(() => null); }
/* wait until the glass shows one of these steps (an array or one id), on the screen; null on the clock */
async function until(F, steps, ms) {
  const want = [].concat(steps || []);
  const t0 = Date.now();
  for (;;) {
    const s = await state(F);
    if (s && s.shown && (!want.length || want.indexOf(s.step) >= 0)) return s;
    if (Date.now() - t0 > (ms || 30000)) return s ? Object.assign({ timedOut: true }, s) : null;
    await new Promise(r => setTimeout(r, 250));
  }
}
/* a button of the glass on the real screen: where, how big, whether the finger lands on it, whether it is inside the glass */
async function button(P, F, id) {
  const fe = await F.frameElement(), fb = await fe.boundingBox();
  const r = await F.evaluate(i => { const d = document.getElementById('yourplace'); if (!d || !d.classList.contains('on')) return null;
    const e = i ? d.querySelector('button[data-yp="' + i + '"]') : d; if (!e) return null; const q = e.getBoundingClientRect(); if (q.width < 2) return null;
    const h = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
    return { cx: q.left + q.width / 2, cy: q.top + q.height / 2, w: Math.round(q.width), h: Math.round(q.height), hit: !!h && e.contains(h), in: q.left >= 0 && q.top >= 0 && q.right <= innerWidth && q.bottom <= innerHeight,
      label: (e.innerText || '').replace(/\s+/g, ' ').trim(), gold: e.classList.contains('gold') }; }, id || null).catch(() => null);
  if (!r) return null;
  return Object.assign(r, { x: fb.x + r.cx, y: fb.y + r.cy });
}
/* press it like a thumb; returns the box pressed, or null if it was not there */
async function tap(P, F, id, settle) {
  await until(F, [], 20000);   /* another face may hold the glass a few beats (one face at a time): a thumb waits for it to come back */
  const b = await button(P, F, id); if (!b) return null;
  await P.touchscreen.tap(b.x, b.y); await P.waitForTimeout(settle == null ? 900 : settle);
  return b;
}
/* what the glass panel holds: the face drawn, the name, the four marks with their pips */
async function panel(F) {
  return F.evaluate(() => { const d = document.getElementById('yourplace'); if (!d || !d.classList.contains('on')) return null;
    const c = d.querySelector('.face canvas'); let ink = 0;
    if (c) { try { const px = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; for (let i = 3; i < px.length; i += 4) if (px[i] > 0) ink++; } catch (e) { ink = -1; } }
    return { who: (d.querySelector('.who') || {}).textContent || null, face: ink, line: ((d.querySelector('.line') || {}).textContent || '').replace(/\s+/g, ' ').trim(),
      marks: [...d.querySelectorAll('.mk')].map(m => ({ k: m.dataset.mk, n: +m.dataset.n })), buttons: [...d.querySelectorAll('button[data-yp]')].map(b => b.dataset.yp), pill: d.classList.contains('pill'),
      font: parseFloat(getComputedStyle(d.querySelector('.line') || d).fontSize) }; }).catch(() => null);
}
module.exports = { state, until, button, tap, panel };
