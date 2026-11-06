/* ============================================================================
   NO SCROLL, MEASURED (UI 8, 11/6/26, rule 402, ask line 444).

   PAOLO 11/4: 'scrolling is fucking illegal in my opinion... from the phone to the wide screen laptop, anything
   that's clickable I don't wanna scroll up and down anywhere ever again.'

   ONE SWEEP, run the same way in every frame of the game (the top page, the map, the town, the crew screen, the
   fight, the spoils), so 'nothing scrolls' is a list and not a feeling. It answers three things about the glass he
   is looking at right now:

     page     the frame's own page can be moved by a finger or a wheel (its document is taller or wider than its
              glass and the viewport is not locked)
     boxes    every box that can be moved by a finger or a wheel (overflow auto or scroll, and more inside it than
              shows), with how many things he can PRESS inside it. A box with something to press inside it is the
              crime; a box of words only is reported, never counted (the phone's own feed strip steps a post's words
              line by line, rule 363, and that is not his scrolling).
     off      every thing he can press that is shown but sits outside the glass, or outside a box that clips it. A
              fix that only locks a scroller (overflow hidden) and leaves the buttons below the edge is not a fix: it
              is the same buttons, now unreachable. The gate counts these too.

   A THING HE CAN PRESS: a button, a link, a form field, anything with a role of button/tab/link, a tabindex, or the
   game's own press marks (data-k, data-act, data-man, data-app, data-pick, data-raise, .slot, .gslot, .cell, .tile,
   .jc), or anything whose own cursor is a pointer where its parent's is not (a click handler the page drew a hand
   for). Shown means checkVisibility (display, visibility, opacity) and a size, and its centre not under
   pointer-events: none all the way up.

     const NS = require('./tools/bohemia_no_scroll.js');
     const rows = await NS.sweepAll(page);     // every frame that is on the glass
     NS.crimes(rows)                           // the boxes with presses, the pages that scroll, the presses off the glass
   ========================================================================== */
'use strict';

const SWEEP_SRC = `(() => {
  const PRESS = 'button,a[href],input:not([type=hidden]),select,textarea,summary,[onclick],[role=button],[role=tab],[role=link],[role=option],'
    + '[tabindex]:not([tabindex="-1"]),[data-k],[data-act],[data-man],[data-app],[data-pick],[data-raise],.slot,.gslot,.cell,.tile,.jc';
  const W = innerWidth, H = innerHeight;
  const shown = el => {
    if (!el || !el.getBoundingClientRect) return false;
    const r = el.getBoundingClientRect(); if (!(r.width >= 2 && r.height >= 2)) return false;
    if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity < 0.05) return false;
      /* a drawer slid away (a closed sheet translated past its own size) is not on his glass */
      if (s.transform && s.transform !== 'none') { const m = s.transform.match(/matrix\\(([^)]+)\\)/); if (m) { const v = m[1].split(',').map(Number);
        if (Math.abs(v[5]) > 0.6 * Math.max(1, e.offsetHeight) || Math.abs(v[4]) > 0.6 * Math.max(1, e.offsetWidth)) return false; } } }
    return true;
  };
  const live = el => getComputedStyle(el).pointerEvents !== 'none' && !el.disabled && !el.closest('[inert]');
  const pressable = el => {
    if (el.matches(PRESS)) return true;
    const c = getComputedStyle(el).cursor; if (c !== 'pointer') return false;
    const p = el.parentElement; return !p || getComputedStyle(p).cursor !== 'pointer';
  };
  const name = el => (el.id ? '#' + el.id : el.tagName.toLowerCase() + (el.classList.length ? '.' + [...el.classList].slice(0, 3).join('.') : ''));
  const path = el => { const out = []; for (let e = el; e && e.nodeType === 1 && out.length < 4; e = e.parentElement) { out.unshift(name(e)); if (e.id) break; } return out.join(' > '); };
  const said = el => ((el.getAttribute('aria-label') || el.textContent || el.title || '') + '').replace(/\\s+/g, ' ').trim().slice(0, 28);
  const scrollsY = (el, cs) => /(auto|scroll|overlay)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1;
  const scrollsX = (el, cs) => /(auto|scroll|overlay)/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 1;
  /* THE PAGE: the viewport takes the root's overflow, or the body's when the root's is visible */
  const de = document.documentElement, bd = document.body;
  const rs = getComputedStyle(de), bs = bd ? getComputedStyle(bd) : null;
  let vy = rs.overflowY, vx = rs.overflowX;
  if (vy === 'visible' && vx === 'visible' && bs) { vy = bs.overflowY; vx = bs.overflowX; }
  const se = document.scrollingElement || de;
  const page = { tall: +(se.scrollHeight / Math.max(1, H)).toFixed(3), wide: +(se.scrollWidth / Math.max(1, W)).toFixed(3),
    scrolls: (!/(hidden|clip)/.test(vy) && se.scrollHeight > H + 1) || (!/(hidden|clip)/.test(vx) && se.scrollWidth > W + 1),
    y: se.scrollTop | 0 };
  const all = [...document.querySelectorAll('body *')].filter(el => !/^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT|OPTION)$/.test(el.tagName));
  const boxes = [];
  for (const el of all) {
    const cs = getComputedStyle(el);
    if (!(scrollsY(el, cs) || scrollsX(el, cs))) continue;
    if (!shown(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.bottom <= 0 || r.right <= 0 || r.top >= H || r.left >= W) continue;
    const presses = [...el.querySelectorAll('*')].filter(c => pressable(c) && shown(c) && live(c));
    boxes.push({ box: path(el), y: scrollsY(el, cs), x: scrollsX(el, cs), shows: [Math.round(el.clientWidth), Math.round(el.clientHeight)],
      holds: [Math.round(el.scrollWidth), Math.round(el.scrollHeight)], presses: presses.length,
      say: presses.slice(0, 4).map(said).filter(Boolean) });
  }
  /* THE PRESSES OFF THE GLASS: shown and live, but the middle of it is outside the frame's glass or outside a box that clips it */
  const off = [];
  const clipOf = el => { let q = { l: 0, t: 0, r: W, b: H };
    for (let e = el.parentElement; e && e !== de && e !== bd; e = e.parentElement) { const s = getComputedStyle(e);
      if (/(hidden|clip|auto|scroll|overlay)/.test(s.overflowX + s.overflowY)) { const p = e.getBoundingClientRect();
        q = { l: Math.max(q.l, p.left), t: Math.max(q.t, p.top), r: Math.min(q.r, p.right), b: Math.min(q.b, p.bottom) }; }
      if (s.position === 'fixed') break; }
    return q; };
  let npress = 0;
  for (const el of all) {
    if (!pressable(el) || !shown(el) || !live(el)) continue;
    npress++;
    const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, q = clipOf(el);
    if (cx < q.l - 1 || cx > q.r + 1 || cy < q.t - 1 || cy > q.b + 1) off.push({ el: path(el), say: said(el), at: [Math.round(cx), Math.round(cy)] });
  }
  return { url: location.pathname.split('/').pop(), glass: [W, H], page, boxes, off, presses: npress };
})()`;

/* is this frame's own iframe on the glass in its parent (a hidden frame's leftovers are not his screen) */
async function frameShown(fr) {
  let f = fr;
  while (f.parentFrame()) {
    const h = await f.frameElement().catch(() => null); if (!h) return false;
    const ok = await h.evaluate(el => { const r = el.getBoundingClientRect(); if (!(r.width > 20 && r.height > 20)) return false;
      if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
      for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity < 0.05) return false; }
      return r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth; }).catch(() => false);
    if (!ok) return false;
    /* AND NOT UNDER ANOTHER LAYER: a frame kept alive behind the map (the town's frame waits there) is not his screen.
       Five points of the frame's box; one that lands on the frame itself is enough. */
    const seen = await f.parentFrame().evaluate(el => { const r = el.getBoundingClientRect();
      const L = Math.max(0, r.left), T = Math.max(0, r.top), R = Math.min(innerWidth, r.right), B = Math.min(innerHeight, r.bottom);
      const pts = [[.5, .5], [.25, .25], [.75, .25], [.25, .75], [.75, .75]];
      return pts.some(p => { const h = document.elementFromPoint(L + (R - L) * p[0], T + (B - T) * p[1]); return h === el; }); }, h).catch(() => true);
    if (!seen) return false;
    f = f.parentFrame();
  }
  return true;
}

/* every frame on the glass, swept; frames that are not shown are left out (named in .hidden) */
async function sweepAll(page) {
  const rows = [], hidden = [];
  for (const f of page.frames()) {
    const u = f.url(); if (!u || u === 'about:blank') continue;
    if (!(await frameShown(f))) { hidden.push(u.split('/').pop().split('?')[0]); continue; }
    const r = await f.evaluate(SWEEP_SRC).catch(e => ({ url: u.split('/').pop(), err: String(e).slice(0, 120) }));
    rows.push(r);
  }
  rows.hidden = hidden;
  return rows;
}

/* the crimes in a sweep: a page that scrolls, a box with a press inside, a press off the glass */
function crimes(rows) {
  const out = [];
  for (const r of rows) {
    if (r.err) continue;
    if (r.page.scrolls) out.push({ url: r.url, what: 'page', tall: r.page.tall, wide: r.page.wide });
    for (const b of r.boxes) if (b.presses > 0) out.push({ url: r.url, what: 'box', box: b.box, presses: b.presses, shows: b.shows, holds: b.holds, say: b.say });
    for (const o of r.off) out.push({ url: r.url, what: 'off', el: o.el, say: o.say, at: o.at });
  }
  return out;
}

const line = c => c.what === 'page' ? c.url + ': THE PAGE SCROLLS (' + c.tall + ' tall, ' + c.wide + ' wide)'
  : c.what === 'box' ? c.url + ': ' + c.box + ' scrolls ' + c.shows.join('x') + ' of ' + c.holds.join('x') + ' with ' + c.presses + ' presses (' + c.say.join(' | ') + ')'
  : c.url + ': ' + c.el + ' "' + c.say + '" off the glass at ' + c.at.join(',');

module.exports = { SWEEP_SRC, sweepAll, crimes, line, frameShown };
