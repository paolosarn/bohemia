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

/* ---- RULE 402 AMENDED (UI 9, 11/7/26, ask line 481): SMALLER, NEVER PAGES ----
   PAOLO 11/7: 'I meant find a way to make things TINIER... not just do a next page bullshit.'
   SMALL_SRC(sel) run in a frame measures one screen (the element sel, or the whole page for 'body'):
     text     every visible word's size in CSS px (font size x CSS zoom x any transform's scale); words a screen reader keeps
              (clipped to one pixel) are not on his glass and are not counted. The floor is FLOOR (11).
     pagers   anything that turns pages or tabs he did not ask for: UI 8's strip (.ns-bar) and tabs (.ns-tabs), the origins'
              old arrows (.cbxnav), any role=tablist, a press named 'next page', 'page before', 'the next origin', a lone arrow
              press, and the words 'PAGE n OF m' or 'n OF m' standing alone.
     taps     every press shown whose short side is under TAP (44).
     area     the share of the glass the element covers.
   (the phone, #bohphone, is its own object with its own small type, rule 363: never counted here) */
const FLOOR = 11, TAP = 44;
const SMALL_SRC = `(sel) => {
  const FLOOR = ${FLOOR}, TAP = ${TAP}, W = innerWidth, H = innerHeight;
  const b = sel === 'body' ? document.body : document.querySelector(sel); if (!b) return null;
  const vis = el => { for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity < 0.05) return false;
    if (s.clip && s.clip !== 'auto' && /rect\\(0/.test(s.clip)) return false; const q = e.getBoundingClientRect(); if ((q.width <= 1 || q.height <= 1) && /hidden|clip/.test(s.overflow)) return false; } return true; };
  const scale = el => { let k = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const t = getComputedStyle(e).transform; if (t && t !== 'none') { const m = t.match(/matrix\\(([^)]+)\\)/); if (m) { const v = m[1].split(',').map(Number); k *= Math.hypot(v[0], v[1]); } } } return k; };
  const nm = e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.classList.length ? '.' + [...e.classList].slice(0, 2).join('.') : '');
  const out = { minText: null, under: [], pagers: [], taps: [], texts: 0 };
  const w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) { const t = w.currentNode; const v = t.nodeValue.trim(); if (!v) continue; const el = t.parentElement; if (!el || el.closest('#bohphone') || !vis(el)) continue;
    const rg = document.createRange(); rg.selectNodeContents(t); const rr = rg.getBoundingClientRect(); if (rr.width < 1 || rr.height < 1 || rr.bottom < 0 || rr.top > H || rr.right < 0 || rr.left > W) continue;
    const px = parseFloat(getComputedStyle(el).fontSize) * (el.currentCSSZoom || 1) * scale(el); out.texts++;
    if (out.minText == null || px < out.minText) out.minText = +px.toFixed(2);
    if (px < FLOOR - 0.01 && out.under.length < 12) out.under.push(nm(el) + ' ' + px.toFixed(1) + 'px "' + v.slice(0, 24) + '"');
    if (/^PAGE\\s+\\d+\\s+OF\\s+\\d+$|^\\d+\\s+OF\\s+\\d+$/i.test(v) && out.pagers.length < 8) out.pagers.push('words "' + v + '" (' + nm(el) + ')'); }
  const all = sel === 'body' ? [...document.body.querySelectorAll('*')] : [b, ...b.querySelectorAll('*')];
  for (const e of all) { if (e.closest('#bohphone') || !vis(e)) continue; const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
    const lab = ((e.getAttribute('aria-label') || '') + ' ' + (e.children.length ? '' : e.textContent || '')).trim();
    if (e.matches('.ns-bar,.ns-tabs,.cbxnav,[role=tablist]:not(:has([data-sort]))') || (e.matches('button,[role=button]') && (/next page|page before|the next origin|the origin before/i.test(lab) || /^[\\u25c0\\u25b6\\u2039\\u203a<>]$/.test(lab)))) { if (out.pagers.length < 8) out.pagers.push(nm(e) + (lab ? ' "' + lab.slice(0, 24) + '"' : '')); }
    /* TWO NAMED EXCEPTIONS, each with its reason: a stat's row (.bst-row) is read, never pressed to act (a tap says what the
       number is, the held finger's tip): it is a line of words, not a thumb target; and the line's nine places across a glass
       under 412 px (nine 44s plus their gaps do not fit) may be narrower, never under 36 wide, while each stays 44 tall: WCAG
       2.2's AA target floor is 24 px, its AAA 44, and the line of nine is the fight's own nine columns */
    const line9 = e.matches('.cell.full') && W < 412 && r.height >= TAP - 0.5 && r.width >= 36;
    if (e.matches('button,[role=button],input:not([type=hidden]),select,.slot,.act,.cell.full,.org,[data-k],[data-raise],.vb,.gslot') && !e.matches('.bst-row') && !line9 && getComputedStyle(e).pointerEvents !== 'none' && !e.disabled) {
      if (Math.min(r.width, r.height) < TAP - 0.5 && out.taps.length < 12) out.taps.push(nm(e) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height) + (lab ? ' "' + lab.slice(0, 18) + '"' : '')); } }
  const r = b.getBoundingClientRect();
  const aw = Math.max(0, Math.min(r.right, W) - Math.max(r.left, 0)), ah = Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0));
  out.area = +(aw * ah / (W * H)).toFixed(3);
  out.box = [Math.round(r.width), Math.round(r.height)];
  return out;
}`;
async function small(frame, sel) { return frame.evaluate('(' + SMALL_SRC + ')(' + JSON.stringify(sel) + ')').catch(e => ({ err: String(e).slice(0, 160) })); }
/* the faults in one screen's measure, as lines: words under the floor, a pager, a press under the thumb */
function faults(m, o) { o = o || {}; const f = []; if (!m || m.err) return ['not measured' + (m && m.err ? ': ' + m.err : '')];
  if (m.under.length) f.push('words under ' + FLOOR + ' px: ' + m.under.slice(0, 3).join(' | '));
  if (m.pagers.length) f.push('a pager or tab he did not ask for: ' + m.pagers.slice(0, 3).join(' | '));
  if (!o.tapsOk && m.taps.length) f.push('presses under ' + TAP + ' px: ' + m.taps.slice(0, 3).join(' | '));
  if (o.half && m.area > 0.5) f.push('a sheet over half the glass (' + Math.round(m.area * 100) + '%) that is not the screen\'s whole job');
  return f; }

module.exports = { SWEEP_SRC, sweepAll, crimes, line, frameShown, FLOOR, TAP, SMALL_SRC, small, faults };
