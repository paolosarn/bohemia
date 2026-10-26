#!/usr/bin/env node
/* ============================================================================
   THE MAP FRAMES AROUND THE PHONE GATE (RUN 10/26, row [the map frames around the phone], rule 213(c)(d)(e), 238(b)).

   PAOLO 10/26: 'on the map you have to care about the camera angles... not directly in the middle of the screen, slightly off
   center, and as you zoom in, that's the same center... the phone placement permanent... the same size.'

   MEASURED BEFORE: the camera held the crew at the glass's exact middle, under no margin at all; on the phone the 10/24 phone
   (#cityfeed, 156 x 250 in the top right) covered the right 163 px of a 390 px glass and the crew stood at x 195.

   On the demo, through the one driver, the phone and the computer (node gates/the_map_frames_around_the_phone_gate.js [profile]):
     F1  THE MARGIN: the map reads the phone's margin (UI TWO's BohemiaPhone.padding(), or the live phone's rectangle until it
         lands) and the focus sits off the glass's middle, away from the phone
     F2  HELD: the crew is drawn at the focus (within 4 px), not under the phone
     F3  A ZOOM (no fingers: the wheel's, the keys', the double tap's way) in and out: the crew stays at the focus
     F4  A PAN BY HAND, then the camera taken back (GO, Shift): the crew eased back to the focus
     F5  A TRAVEL of eight blocks or more: sampled on the way, the crew never under the phone; arrived, at the focus
     F6  LET GO, A ZOOM KEEPS THE SAME CENTRE: the world under the focus does not move (within a pixel)
     F7  THE FLIP: the phone's corner mirrored (a 'bohemia-phone' event with the other side's margin): the focus mirrors at once
         and the camera eases the crew to it inside 700 ms
     F8  A TURNED DEVICE: the glass turned on its side and back: the focus recomputed and the crew at it each time
     F9  MUTATION: the margin off, the crew goes back to the glass's middle, more than 20 px from F2's focus
     F10 nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };

/* where the crew is drawn and where the focus is, after a fresh frame */
const READ = () => {
  render(); const F = mapFocusRead(true), f = mapFocus(), y = MAP_DREW.you, A = mapOpenArea();
  const R = window.BOH_PHONE_RECT ? BOH_PHONE_RECT() : null, cf = document.getElementById('cityfeed');
  let ph = null; if (R && R.on !== false && R.width > 2) { const c = cv.getBoundingClientRect(); ph = [R.left - c.left, R.top - c.top, R.right - c.left, R.bottom - c.top]; }
  else if (cf && getComputedStyle(cf).display !== 'none') { const a = cf.getBoundingClientRect(), c = cv.getBoundingClientRect(); ph = [a.left - c.left, a.top - c.top, a.right - c.left, a.bottom - c.top]; }
  /* the camera's own point for him: his ground, at (CVW / 2 + panX, CVH / 2 + panY) by the map's projection; the drawn man stands on it
     (a few pixels up on the freeway's berm, mapStandLift) */
  return { cz: CZOOM, W: CVW, H: CVH, fo: F.fo, src: F.src, pad: F.pad, f: [f.x, f.y], you: y ? [y.x, y.y, y.h || 72] : null, gr: [CVW / 2 + panX, CVH / 2 + panY], ph, A: [A.x0, A.y0, A.x1, A.y1], camf: CAMF.on, at: [city.x, city.y] };
};
/* his ground against the focus: within 1.5 px; the man as drawn: within 8 ('a few pixels', the berm's lift) */
const dist = (r) => r.you ? Math.max(Math.hypot(r.gr[0] - r.f[0], r.gr[1] - r.f[1]) > 1.5 ? 1e3 : 0, Math.hypot(r.you[0] - r.f[0], r.you[1] - r.f[1]) > 8 ? 1e3 : 0) || Math.hypot(r.you[0] - r.f[0], r.you[1] - r.f[1]) : 1e9;
const gdist = (r) => Math.hypot(r.gr[0] - r.f[0], r.gr[1] - r.f[1]);
const under = (r) => { if (!r.you || !r.ph) return false; const x = r.you[0], y0 = r.you[1] - r.you[2], y1 = r.you[1];
  return x > r.ph[0] && x < r.ph[2] && y1 > r.ph[1] && y0 < r.ph[3]; };

async function run(profile) {
  console.log('\n-- ' + profile + ' --');
  const d = await open({ profile, fog: false });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.om && om.n && typeof MAP_DREW !== 'undefined' && MAP_DREW.you && window.MAP_FOCUS))) break; await page.waitForTimeout(500); }
  await page.waitForTimeout(2000);
  const R = () => fr.evaluate(READ);
  /* F1, F2 */
  let r = await R();
  const away = (r.pad.right > 0 ? r.f[0] < r.W / 2 - 4 : true) && (r.pad.left > 0 ? r.f[0] > r.W / 2 + 4 : true) && (r.pad.bottom > 0 ? r.f[1] < r.H / 2 - 4 : true) && (r.pad.top > 0 ? r.f[1] > r.H / 2 + 4 : true);
  ok('F1 the map reads the phone\'s margin and the focus sits off the middle, away from it', r.src !== 'none' && (r.fo.x !== 0 || r.fo.y !== 0) && away,
     r.src + ', pad ' + JSON.stringify(r.pad) + ', focus ' + r.f.map(Math.round) + ' on ' + r.W + 'x' + r.H);
  const f2 = r;
  ok('F2 held, the crew is drawn at the focus and not under the phone', dist(r) <= 8 && !under(r), 'crew ' + (r.you || []).slice(0, 2).map(Math.round) + ', drawn ' + dist(r).toFixed(1) + ' px off, his ground ' + gdist(r).toFixed(2));
  /* F3 */
  const zs = [];
  for (const k of [1.6, 1.3, 0.6, 1.0]) { await fr.evaluate((k) => { ZGEST.fresh = true; setZoomAt(Math.max(zoomBounds()[0] * 1.05, Math.min(zoomBounds()[1], k))); }, k); await page.waitForTimeout(250); const q = await R(); zs.push(q.cz.toFixed(2) + ':' + dist(q).toFixed(1)); if (dist(q) > 8) zs.bad = 1; }
  ok('F3 a zoom without fingers, in and out: the crew stays at the focus', !zs.bad, zs.join(' '));
  /* F4 */
  await fr.evaluate(() => { camLetGo(); panX += 140; panY -= 90; clampPan(); render(); });
  await page.waitForTimeout(150);
  const off = await R();
  await fr.evaluate(() => { camHold(); render(); });
  await page.waitForTimeout(700);
  r = await R();
  ok('F4 a pan by hand moves him off; the camera taken back eases him to the focus', dist(off) > 40 && dist(r) <= 8, 'off ' + gdist(off).toFixed(0) + ' px, back ' + dist(r).toFixed(1) + ' px (his ground ' + gdist(r).toFixed(2) + ')');
  /* F5 */
  const goal = await fr.evaluate(() => { const n = om.n; let best = null;
    for (let rr = 10; rr <= 22 && !best; rr += 2) for (const v of DIRS) { const x = city.x + v[0] * rr, y = city.y + v[1] * rr;
      if (x < 1 || y < 1 || x >= n - 1 || y >= n - 1 || !cityWalkable(x, y) || loopTownAt(x, y, 2)) continue;
      const p = cityRoute(city.x, city.y, x, y); if (p && p.length >= 9) { best = [x, y]; break; } }
    if (best) { travelTo(0, 0, best); travelGoes(); } return best; });
  const trail = []; let undr = 0, t0 = Date.now();
  while (Date.now() - t0 < 60000) { await page.waitForTimeout(300); const q = await R(); trail.push(dist(q)); if (under(q)) undr++;
    const moving = await fr.evaluate(() => !!TRAVEL); if (!moving) break;
    if (await fr.evaluate(() => !!(MEET && MEET.up))) { await fr.evaluate(() => { try { MEET_DONE(false); } catch (e) {} }); } }
  await page.waitForTimeout(700);
  r = await R();
  ok('F5 a travel: never under the phone on the way, and at the focus when it ends', !!goal && undr === 0 && dist(r) <= 8,
     (goal ? 'to ' + goal + ', ' : 'no goal, ') + trail.length + ' samples, worst ' + Math.max(0, ...trail).toFixed(1) + ' px, ' + undr + ' under the phone, ends ' + dist(r).toFixed(1) + ' px');
  /* F6 */
  const keep = await fr.evaluate(() => { camLetGo(); const F = mapFocusRead(true).fo, m = (om.n - 1) / 2;
    const w = () => { const ox = CVW / 2 - (city.x - city.y) * TW / 2 + panX, oy = CVH / 2 - (city.x + city.y) * TH / 2 + panY, f = mapFocus();
      /* the world cell (fractional) under the focus, from the iso inverse */
      const a = (f.x - ox) / (TW / 2), b = (f.y - oy) / (TH / 2); return [(a + b) / 2, (b - a) / 2]; };
    const w0 = w(); ZGEST.fresh = true; setZoomAt(CZOOM * 1.4); const w1 = w(); ZGEST.fresh = true; setZoomAt(CZOOM / 1.4); const w2 = w();
    const px = (p, q) => Math.hypot((p[0] - q[0] - (p[1] - q[1])) * TW / 2, (p[0] - q[0] + p[1] - q[1]) * TH / 2);
    const out = { d1: px(w0, w1), d2: px(w0, w2) }; camHold(); return out; });
  ok('F6 let go, a zoom keeps the same centre: the world under the focus does not move', keep.d1 <= 1 && keep.d2 <= 1, keep.d1.toFixed(2) + ' and ' + keep.d2.toFixed(2) + ' px');
  await page.waitForTimeout(600);
  /* F7: the flip, as UI TWO's phone tells every frame */
  const flip = [];
  for (const side of ['right', 'left']) {
    await fr.evaluate((side) => { const W = innerWidth, H = innerHeight, w = Math.round(Math.min(W, H) * 0.3);
      window.__GATE_PAD = side === 'right' ? { top: 0, right: w, bottom: 0, left: 0 } : { top: 0, right: 0, bottom: 0, left: w };
      if (!('__GATE_REAL' in window)) window.__GATE_REAL = window.BohemiaPhone || null;   /* the real one, kept once */
      window.BohemiaPhone = { padding: () => window.__GATE_PAD, rect: () => null };
      window.dispatchEvent(new CustomEvent('bohemia-phone', { detail: { side } })); }, side);
    /* timed in the page, frame by frame, from the event to his ground on the new focus (within 1.5 px) */
    const ms = await fr.evaluate(() => new Promise((res) => { const t1 = performance.now(), tick = () => { render(); const F = mapFocusRead(false).fo, f = mapFocus();
      if (Math.abs(F.x) > 1 && Math.hypot(CVW / 2 + panX - f.x, CVH / 2 + panY - f.y) <= 1.5) return res(Math.round(performance.now() - t1));
      if (performance.now() - t1 > 3000) return res(9999); requestAnimationFrame(tick); }; requestAnimationFrame(tick); }));
    const q = await R();
    flip.push({ side, fo: q.fo.x, ms, d: dist(q) });
  }
  await fr.evaluate(() => { if (window.__GATE_REAL) window.BohemiaPhone = window.__GATE_REAL; else delete window.BohemiaPhone; delete window.__GATE_REAL; window.dispatchEvent(new CustomEvent('bohemia-phone', {})); });
  ok('F7 the flip: the focus mirrors at once and the crew is eased to it inside 700 ms', flip.length === 2 && flip[0].fo < 0 && flip[1].fo > 0 && Math.abs(flip[0].fo + flip[1].fo) < 1 && flip.every(o => o.d <= 8 && o.ms <= 800),
     flip.map(o => o.side + ': focus ' + o.fo.toFixed(1) + ', ' + o.ms + ' ms, ' + o.d.toFixed(1) + ' px').join('; '));
  await page.waitForTimeout(600);
  /* F8: turned */
  const vp = page.viewportSize(), turned = [];
  for (const s of [{ width: vp.height, height: vp.width }, vp]) {
    await page.setViewportSize(s); await page.waitForTimeout(1600);
    const q = await R(); turned.push({ W: q.W, H: q.H, fo: [Math.round(q.fo.x), Math.round(q.fo.y)], d: dist(q) });
  }
  ok('F8 a turned device: the focus recomputed and the crew at it, on its side and back', turned.every(o => o.d <= 8) && turned[0].W !== turned[1].W,
     turned.map(o => o.W + 'x' + o.H + ' focus ' + o.fo + ' ' + o.d.toFixed(1) + ' px').join('; '));
  /* F9 */
  await fr.evaluate(() => { MAP_FOCUS.on = false; mapFocusRead(true); camHold(); });
  await page.waitForTimeout(700);
  const mu = await fr.evaluate(() => { render(); const y = MAP_DREW.you; return y ? [y.x, y.y] : null; });
  await fr.evaluate(() => { MAP_FOCUS.on = true; mapFocusRead(true); render(); });
  const fNow = await R();
  const muD = mu ? Math.hypot(mu[0] - fNow.f[0], mu[1] - fNow.f[1]) : 0;
  ok('F9 MUTATION: the margin off, the crew goes back to the glass\'s middle, off the focus', muD > 20, (mu || []).map(Math.round) + ' against the focus ' + fNow.f.map(Math.round) + ': ' + muD.toFixed(0) + ' px');
  ok('F10 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await d.close();
}

(async () => {
  const want = process.argv[2];
  for (const p of want ? [want] : ['phone_portrait', 'computer']) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e.message).slice(0, 220)); } }
  console.log('\nTHE MAP FRAMES AROUND THE PHONE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
