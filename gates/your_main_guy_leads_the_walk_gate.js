#!/usr/bin/env node
/* ============================================================================
   YOUR MAIN GUY LEADS THE WALK GATE (RUN 10/26, row [your main guy leads the walk], rule 263(a), the map leg of 263(c)).

   PAOLO 10/26: 'the character that's walking through Bohemia is not ... the main character of the origin.'

   MEASURED BEFORE: the map's lead was CHARACTER's generic 'body' (BOHEMIA_RIG_PEOPLE), dark skin and dark hair; the crew screen and
   the fight draw the main man as the combat rig's YOU (slices/fight_rig/you.webp), pale with white hair: two different men.

   On the demo, through the one driver, the phone and the computer (node gates/your_main_guy_leads_the_walk_gate.js [profile]):
     Y1 his sheet is the fight's own YOU, cut and not redrawn: every frame of BOHEMIA_RIG_YOU equals the fight sheet's pixels at the
        same clip and turn (read in the page, both pictures decoded)
     Y2 the man drawn at the front of his party is drawn from that sheet (the map's own record of the look it drew)
     Y3 ON THE GLASS: the lead's head, read off the map's canvas, is his (closer to YOU's head than to the old body's), at the
        opening zoom and at 2.4
     Y4 the crew screen's main man is the same man (the roster's own look for the man flagged main)
     Y5 a main man with a look of his own (what RUN THREE's maker writes on the saved company): that look's model leads
     Y6 MUTATION: his sheet failed, the old body leads, and Y3 reads it as the other man
     Y7 nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };

/* in the page: the head colour of a frame (the top fifth of the man's own pixels), off a sheet or the glass */
const HEADS = () => {
  const avg = (d, w, h) => { let ys = [], r = 0, g2 = 0, b = 0, n = 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 200) ys.push(y);
    if (!ys.length) return null; const top = Math.min(...ys), bot = Math.max(...ys), lim = top + (bot - top) * 0.16;
    for (let y = top; y <= lim; y++) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; if (d[i + 3] > 200) { r += d[i]; g2 += d[i + 1]; b += d[i + 2]; n++; } }
    return n ? [r / n, g2 / n, b / n] : null; };
  const frame = (img, x, y, w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const q = c.getContext('2d'); q.drawImage(img, x, y, w, h, 0, 0, w, h); return q.getImageData(0, 0, w, h).data; };
  window.__HEAD = { avg, frame };
};

async function run(profile) {
  console.log('\n-- ' + profile + ' --');
  const d = await open({ profile, fog: false });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.RIG_YOU && RIG_YOU.state >= 2 && typeof MAP_DREW !== 'undefined' && MAP_DREW.you && RIG_PEOPLE.state === 2))) break; await page.waitForTimeout(500); }
  await fr.evaluate(() => { try { if (LOOP.frame && LOOP.frame.style.display === 'block') loopClose(); } catch (e) {} });   /* the game may open in a town (rule 236): the map is what this reads */
  await page.waitForTimeout(1500);
  await fr.evaluate('(' + HEADS.toString() + ')()');
  /* Y1: the cut against the fight's own sheet */
  const y1 = await fr.evaluate(async () => {
    const F = await (await fetch('fight_rig/fight_rig.json')).json(), L = F.looks.you, im = new Image(); im.src = 'fight_rig/' + L.file; await im.decode();
    const M = RIG_YOU.meta, want = [F.cols.indexOf('stand')].concat([0, 1, 2, 3, 4, 5].map(k => F.cols.indexOf('walk@' + k)));
    const dx = M.w / 2 - L.foot[0], dy = (M.foot - 2) - (L.foot[1] + 8);
    let frames = 0, bad = 0, worst = 0;
    for (let di = 0; di < 8; di++) for (let ci = 0; ci < want.length; ci++) {
      const a = __HEAD.frame(RIG_YOU.img, ci * M.w, di * M.h, M.w, M.h);
      const c = document.createElement('canvas'); c.width = M.w; c.height = M.h; const q = c.getContext('2d');
      q.drawImage(im, want[ci] * L.w, di * L.h, L.w, L.h, dx, dy, L.w, L.h);
      const b = q.getImageData(0, 0, M.w, M.h).data; let diff = 0;
      for (let k = 0; k < a.length; k += 4) if (b[k + 3] > 200) diff = Math.max(diff, Math.abs(a[k] - b[k]), Math.abs(a[k + 1] - b[k + 1]), Math.abs(a[k + 2] - b[k + 2]));
      frames++; worst = Math.max(worst, diff); if (diff > 2) bad++; }
    return { frames, bad, worst };
  });
  ok('Y1 his map sheet is the fight\'s own YOU, cut and not redrawn', y1.frames === 56 && y1.bad === 0, y1.frames + ' frames, ' + y1.bad + ' off, the worst ' + y1.worst + ' levels');
  /* the two heads, off the sheets */
  const ref = await fr.evaluate(() => ({ you: __HEAD.avg(__HEAD.frame(RIG_YOU.img, 0, 0, RIG_YOU.meta.w, RIG_YOU.meta.h), RIG_YOU.meta.w, RIG_YOU.meta.h),
    body: (() => { const m = RIG_PEOPLE.meta, gi = m.gangs.indexOf('body'); return __HEAD.avg(__HEAD.frame(RIG_PEOPLE.img, 0, gi * 8 * m.h, m.w, m.h), m.w, m.h); })() }));
  const onGlass = async (z) => fr.evaluate((z) => {
    ZGEST.fresh = true; setZoomAt(z); camHold(); CAMF.from = null; render();
    const Y = MAP_DREW.you; if (!Y) return null; const k = CV_DPR || 1, h = (Y.h || 60);
    const x0 = Math.max(0, Math.round((Y.x - h * 0.7) * k)), y0 = Math.max(0, Math.round((Y.y - h * 1.4) * k)), W = Math.round(h * 1.4 * k), H = Math.round(h * 1.5 * k);
    const look = MAP_DREW.youLook || null;
    const A = g.getImageData(x0, y0, W, H).data;
    /* the same frame with him left out (the map's own call for his body answers nobody once): what changed is HIM */
    const keep = window.mapPeopleOf; window.mapPeopleOf = function (p, i) { return p === 'you' ? null : keep(p, i); };
    try { render(); } finally { window.mapPeopleOf = keep; }
    const B = g.getImageData(x0, y0, W, H).data; render();
    const mine = new Uint8ClampedArray(A.length); let n = 0;
    for (let q = 0; q < A.length; q += 4) if (Math.abs(A[q] - B[q]) + Math.abs(A[q + 1] - B[q + 1]) + Math.abs(A[q + 2] - B[q + 2]) > 24) { mine[q] = A[q]; mine[q + 1] = A[q + 1]; mine[q + 2] = A[q + 2]; mine[q + 3] = 255; n++; }
    return { look, head: __HEAD.avg(mine, W, H), z: CZOOM, his: n };
  }, z);
  const dist = (a, b) => a && b ? Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) : 1e9;
  const g1 = await onGlass(1), g2 = await onGlass(2.4);
  ok('Y2 the man at the front of his party is drawn from his own sheet', g1 && g1.look === 'you' && g2 && g2.look === 'you', JSON.stringify([g1 && g1.look, g2 && g2.look]));
  const nearer = (gl) => gl && gl.head && dist(gl.head, ref.you) < dist(gl.head, ref.body);
  ok('Y3 on the glass the lead\'s head is his, not the old body\'s, at the opening zoom and at 2.4', nearer(g1) && nearer(g2),
     'YOU ' + (ref.you || []).map(Math.round) + ', the old body ' + (ref.body || []).map(Math.round) + '; drawn ' + [g1, g2].map(o => o && o.head ? o.head.map(Math.round) + ' (' + Math.round(dist(o.head, ref.you)) + ' / ' + Math.round(dist(o.head, ref.body)) + ')' : 'none').join(', '));
  /* Y4: the crew screen's main man */
  /* the roster lives in the town's and the crew screen's frames: a town opened, its roster asked for the man flagged main */
  await fr.evaluate(() => { const bs = ctBases() || {}; let best = null; for (const n in bs) { const b = bs[n]; if (!b) continue; const dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (!best || dd < best.d) best = { name: n, x: b.x | 0, y: b.y | 0, d: dd, tier: mapTierOf(n) }; } if (best) loopOpenTown(best); });
  let sf = null; for (let i = 0; i < 60 && !sf; i++) { const fh = await fr.$('#settleFrame'); sf = fh ? await fh.contentFrame() : null; if (!sf) await page.waitForTimeout(300); }
  const y4 = sf ? await sf.evaluate(async () => { for (let i = 0; i < 60 && !(window.BohemiaRoster && BohemiaRoster.data && BohemiaRoster.data.backgrounds); i++) await new Promise(r => setTimeout(r, 250));
    try { return BohemiaRoster.manOf({ name: 'HIM', main: true, background: 'farmhand' }, 0).look; } catch (e) { return 'err ' + e.message; } }) : 'no town';
  await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await page.waitForTimeout(500);
  ok('Y4 the crew screen\'s main man wears the same look (the roster\'s own man flagged main)', y4 === 'you', 'the roster says ' + y4);
  /* Y5: a main man with his own look */
  const y5 = await fr.evaluate(async () => {
    const keep = localStorage.getItem('bohemia.company.v1');
    const idx = RIG_MIX && RIG_MIX.index && RIG_MIX.index.sheets ? RIG_MIX.index.sheets : null; let look = null;
    if (idx) for (const n in idx) { if (idx[n] && idx[n].length) { look = idx[n][0]; break; } }
    if (!look) return { look: null };
    localStorage.setItem('bohemia.company.v1', JSON.stringify([{ name: 'HIM', main: true, look }]));
    let got = null; for (let i = 0; i < 40 && !got; i++) { MAP_CREW_LOOKS.at = 0; render(); if (MAP_DREW.youLook === look) got = look; else await new Promise(r => setTimeout(r, 250)); }
    if (keep == null) localStorage.removeItem('bohemia.company.v1'); else localStorage.setItem('bohemia.company.v1', keep);
    MAP_CREW_LOOKS.at = 0; render();
    return { look, got, now: MAP_DREW.youLook };
  });
  ok('Y5 a main man with a look of his own (the maker\'s): that look leads', !!y5.look && y5.got === y5.look && y5.now === 'you', JSON.stringify(y5));
  /* Y6 MUTATION */
  await fr.evaluate(() => { window.__KEEP_YOU = { state: RIG_YOU.state, sets: RIG_YOU.sets }; RIG_YOU.state = 3; RIG_YOU.sets = {}; });
  const m1 = await onGlass(2.4);
  await fr.evaluate(() => { RIG_YOU.state = __KEEP_YOU.state; RIG_YOU.sets = __KEEP_YOU.sets; render(); });
  ok('Y6 MUTATION: his sheet failed, the old body leads and Y3 reads the other man', !!m1 && m1.look === 'body' && !nearer(m1), m1 ? m1.look + ' ' + (m1.head || []).map(Math.round) : 'none');
  ok('Y7 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await d.close();
}

(async () => {
  const want = process.argv[2];
  for (const p of want ? [want] : ['phone_portrait', 'computer']) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e.message).slice(0, 220)); } }
  console.log('\nYOUR MAIN GUY LEADS THE WALK: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
