/* ==========================================================================
   EVERY DOOR HAS A SIGN  (UI 9, 11/8/26, VAMILY rule 434, ask line 519)

   PAOLO 11/8: 'how do I scavenge'... 'I couldn't find where to scavenge'.

   MEASURED BEFORE (the coordinator on the demo, phone upright, the town Network; UI 9 again on six towns): the town's
   buildings carried NO names at rest (a building named itself only under the finger, the post and the bar showed a picture
   with no word) and the word SCAVENGE was nowhere on the glass, though the lot was on the glass in every town measured.

   THE RULE (434): (a) every door of a town carries a small sign at rest, an icon and a short name in the game's letters,
   inside 402/403 (the word 11 px at least, the press 44 px), on the phone upright and on its side; (b) the scavenge lot is
   in view on every phone without panning, or its sign points to it; (c) this gate, on the demo, both phone shapes, every
   settlement tier: every door's sign on the glass and tappable, SCAVENGE among them; planted: the lot's sign removed, red.

   THE LEGS, per phone shape, for EVERY place on the demo's map (camps, towns and fortresses):
     D1  the town at rest shows a sign for every door of the place (the place's own doors, BUILD only on his own ground),
         and the lot's says SCAVENGE
     D2  every sign is whole on the glass: inside the top page's glass and the town's own scene, the top page's finger at its
         middle and corners lands on the town (never the phone, the bar, a card), the town's finger lands on the sign itself
     D3  its word is 11 px or more as drawn, its press 44 px or more each way, no two signs' plates overlap
     D4  the lot's door is in view without panning (at least half of it on the glass, off the phone), or its sign points to it
     D5  a tap on the lot's sign opens the lot (its sheet, 'Search the lot'); in the first place of each tier, a tap on EVERY
         sign opens that sign's own door
   AND ONCE:
     L   at the LARGEST UI size every sign is still whole on the glass and its word grew
     M   planted: the lot's sign removed is caught by D1; a sign moved under the phone is caught by D2; a 9 px word by D3

   Run: node gates/every_door_has_a_sign_gate.js [--only phone_portrait] [--places Network,Church]
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined && !g ? '  [' + x + ']' : '')); };
const done = () => { console.log('EVERY DOOR HAS A SIGN: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const ONLY = arg('--only'), PLACES = (arg('--places') || '').split(',').filter(Boolean);
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !ONLY || p === ONLY);
const FLOOR = 11, TAP = 44;
async function press(P, x, y) { await P.touchscreen.tap(x, y); }

/* what the town frame says about its signs, measured in the frame (no word from the sign code is trusted: the doors come from
   the place's own order, the boxes from the page) */
const IN_FRAME = () => {
  const S = BohemiaSettlement, sc = document.getElementById('scene').getBoundingClientRect(), v = S.camp2().view;
  const own = (S.doorSigns && S.doorSigns().doors) || [];
  const doors = S.order().filter(k => k !== 'build' || own.indexOf('build') >= 0);   /* BUILD carries a sign only on his own ground */
  const signs = doors.map(k => {
    const el = document.querySelector('#doorsigns .doorsign[data-door="' + k + '"]');
    if (!el) return { k, missing: true };
    const cs = getComputedStyle(el), r = el.getBoundingClientRect(), p = (el.querySelector('.dsp') || el).getBoundingClientRect(), b = el.querySelector('b');
    const z = (b && b.currentCSSZoom) || 1, fs = b ? parseFloat(getComputedStyle(b).fontSize) * z : 0;
    const shown = cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > .5 && getComputedStyle(el.parentNode).display !== 'none' && p.width > 1;
    const pts = [[(p.left + p.right) / 2, (p.top + p.bottom) / 2], [p.left + 3, p.top + 3], [p.right - 3, p.top + 3], [p.left + 3, p.bottom - 3], [p.right - 3, p.bottom - 3]];
    const mine = pts.map(q => { const h = document.elementFromPoint(q[0], q[1]); return !!h && el.contains(h); });
    const run = (x, y, dx, dy) => { let n = 0; for (let i = 1; i < 60; i++) { const h = document.elementFromPoint(x + dx * i, y + dy * i); if (!h || !el.contains(h)) break; n++; } return n; };
    const mx = (p.left + p.right) / 2, my = (p.top + p.bottom) / 2;
    const reach = [run(mx, my, -1, 0) + run(mx, my, 1, 0) + 1, run(mx, my, 0, -1) + run(mx, my, 0, 1) + 1];   /* what the finger really gets, a neighbour's paper taken out */
    return { k, word: (b && b.textContent) || '', off: el.classList.contains('off'), shown, fs: Math.round(fs * 10) / 10, press: [Math.round(r.width), Math.round(r.height)], reach,
      plate: [p.left, p.top, p.right, p.bottom].map(Math.round), inScene: p.left >= sc.left - .5 && p.top >= sc.top - .5 && p.right <= sc.right + .5 && p.bottom <= sc.bottom + .5, mine: mine.every(Boolean), pts };
  });
  const mids = S.order().map(k => { const t = S._box(k); return t ? { k, x: v.ox + (t[0] + t[2]) / 2 * v.s, y: v.oy + (t[1] + t[3]) / 2 * v.s } : null; }).filter(Boolean)
    .map(m => { const h = document.elementFromPoint(m.x, m.y), d = h && h.closest && h.closest('.doorsign'); return { k: m.k, on: d ? d.getAttribute('data-door') : null }; });
  const lb = S._box('lot'), pad = S.padPic ? S.padPic() : null;
  let lot = null;
  if (lb) { const r = [v.ox + lb[0]*v.s, v.oy + lb[1]*v.s, v.ox + lb[2]*v.s, v.oy + lb[3]*v.s], W = sc.width, H = sc.height;
    const ix = Math.max(0, Math.min(r[2], W) - Math.max(r[0], 0)), iy = Math.max(0, Math.min(r[3], H) - Math.max(r[1], 0));
    let under = 0; if (pad) { const q = [v.ox + pad[0]*v.s, v.oy + pad[1]*v.s, v.ox + pad[2]*v.s, v.oy + pad[3]*v.s];
      under = Math.max(0, Math.min(r[2], q[2], W) - Math.max(r[0], q[0], 0)) * Math.max(0, Math.min(r[3], q[3], H) - Math.max(r[1], q[1], 0)); }
    lot = { seen: Math.round(100 * (ix * iy - under) / Math.max(1, (r[2] - r[0]) * (r[3] - r[1]))) }; }
  return { place: S.state.place && S.state.place.name, tier: S.state.place && S.state.place.tier, doors, signs, lot, mids, open: S.state.open };
};

/* the checks D1 to D4 on one reading; returns the faults, so a planted reading can be asked whether it was caught */
async function faultsOf(P, fr, m) {
  const fb = await (await fr.frameElement()).boundingBox(), W = await P.evaluate(() => [innerWidth, innerHeight]);
  const F = { d1: [], d2: [], d3: [], d4: [] };
  if (m.doors.indexOf('lot') < 0) F.d1.push('the place has no lot');
  for (const s of m.signs) {
    if (s.missing || !s.shown) { F.d1.push(s.k + (s.missing ? ' has no sign' : ' sign hidden')); continue; }
    if (s.k === 'lot' && !/SCAVENGE/.test(s.word)) F.d1.push('the lot reads "' + s.word + '", not SCAVENGE');
    const g = [fb.x + s.plate[0], fb.y + s.plate[1], fb.x + s.plate[2], fb.y + s.plate[3]];
    if (!s.inScene || g[0] < -.5 || g[1] < -.5 || g[2] > W[0] + .5 || g[3] > W[1] + .5 || g[0] < fb.x - .5 || g[2] > fb.x + fb.width + .5 || g[1] < fb.y - .5 || g[3] > fb.y + fb.height + .5) F.d2.push(s.k + ' past the glass ' + s.plate.join(','));
    else {
      const cover = (await coverAt(fr, s.pts.map(q => [fb.x + q[0], fb.y + q[1]]))).filter(Boolean);
      if (cover.length) F.d2.push(s.k + ' under ' + cover[0]);
      else if (!s.mine) F.d2.push(s.k + ' covered inside the town');
    }
    if (s.fs < FLOOR) F.d3.push(s.k + ' word ' + s.fs + ' px');
    if (s.press[0] < TAP || s.press[1] < TAP) F.d3.push(s.k + ' press ' + s.press.join('x'));
    else if (s.reach[0] < TAP || s.reach[1] < TAP) F.d3.push(s.k + ' the finger gets ' + s.reach.join('x') + ' of it');
  }
  const shown = m.signs.filter(s => !s.missing && s.shown);
  for (let i = 0; i < shown.length; i++) for (let j = i + 1; j < shown.length; j++) { const a = shown[i].plate, b = shown[j].plate;
    if (a[0] < b[2] - 1 && b[0] < a[2] - 1 && a[1] < b[3] - 1 && b[1] < a[3] - 1) F.d3.push(shown[i].k + ' lies on ' + shown[j].k); }
  (m.mids || []).forEach(q => { if (q.on && q.on !== q.k) F.d3.push(q.on + "'s sign lies on the " + q.k + "'s middle (a finger on the " + q.k + ' opens the ' + q.on + ')'); });
  const ls = m.signs.find(s => s.k === 'lot');
  if (!m.lot || !(m.lot.seen >= 50 || (ls && ls.off && ls.shown))) F.d4.push('the lot ' + (m.lot ? m.lot.seen + '% in view' : 'has no box') + (ls && ls.off ? '' : ', its sign points nowhere'));
  return F;
}

/* the finger at each point, from the top page down: at every frame on the way, the point lands on the next frame in (the city's,
   then the town's), never on the phone, the bar or a card laid over it. null where it reaches the town, else what covers it */
async function coverAt(fr, pts) {
  const chain = []; for (let c = fr; c.parentFrame(); c = c.parentFrame()) chain.unshift({ child: c, parent: c.parentFrame() });
  const boxes = []; for (const l of chain) boxes.push(l.parent.parentFrame() ? await (await l.parent.frameElement()).boundingBox() : { x: 0, y: 0 });
  const out = [];
  for (const q of pts) { let bad = null;
    for (let i = 0; i < chain.length && !bad; i++) {
      const u = chain[i].child.url().split('?')[0].split('/').pop();
      const hit = await chain[i].parent.evaluate(([x, y, u]) => { const h = document.elementFromPoint(x, y); if (!h) return 'nothing';
        if (h.tagName === 'IFRAME' && (h.src || '').split('?')[0].split('/').pop() === u) return null; return h.id || String(h.className || '') || h.tagName; }, [q[0] - boxes[i].x, q[1] - boxes[i].y, u]);
      if (hit) bad = hit; }
    out.push(bad); }
  return out;
}
async function townFrame(P, d, name) {
  await d.fr.evaluate(n => { const bs = ctBases(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); }, name).catch(() => {});
  for (let i = 0; i < 70; i++) { await P.waitForTimeout(400);
    for (const x of P.frames().filter(f => /SETTLEMENT_SCREEN/.test(f.url())))
      if (await x.evaluate(n => { try { const S = BohemiaSettlement; return S.ready() && S.state.place && S.state.place.name === n && !document.getElementById('arrive') && S.picIn() && S.doorSigns && S.doorSigns().show; } catch (e) { return false; } }, name).catch(() => false)) return x;
    if (i === 15) await d.fr.evaluate(() => { try { btwFrameRest(); } catch (e) {} }).catch(() => {}); }
  return null;
}
async function leave(P, d) {
  await d.fr.evaluate(() => { try { const f = [...document.querySelectorAll('iframe')].find(x => /SETTLEMENT/.test(x.src) && x.offsetWidth); f && f.contentWindow.document.getElementById('leave').click(); } catch (e) {} }).catch(() => {});
  await P.waitForTimeout(2200);
}
async function closeSheet(fr, P) { await fr.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }).catch(() => {}); await P.waitForTimeout(700); }
async function tapSign(P, fr, k) {   /* the finger on the sign's plate, then which door opened */
  const fb = await (await fr.frameElement()).boundingBox();
  const r = await fr.evaluate(k => { const e = document.querySelector('#doorsigns .doorsign[data-door="' + k + '"] .dsp'); if (!e) return null; const b = e.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; }, k);
  if (!r) return null;
  await press(P, fb.x + r[0], fb.y + r[1]);
  let open = null; for (let i = 0; i < 12 && !open; i++) { await P.waitForTimeout(250); open = await fr.evaluate(() => BohemiaSettlement.state.open).catch(() => null); }
  const said = await fr.evaluate(() => (document.getElementById('sbody') || {}).textContent || '').catch(() => '');
  await closeSheet(fr, P);
  return { open, said };
}
const say = F => Object.keys(F).map(k => F[k].length ? k.toUpperCase() + ' ' + F[k].slice(0, 3).join('; ') : '').filter(Boolean).join(' | ') || 'none';

async function shape(prof) {
  console.log('-- ' + prof);
  const d = await drive.open({ profile: prof, keepCards: true, beforeTap: async (pg) => {
    for (let i = 0; i < 120; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
    await pg.waitForTimeout(1500); await throughTheTitle(pg); await pg.waitForTimeout(1800);
  } });
  const P = d.page;
  try {
    await P.waitForTimeout(3000); await d.clearCards().catch(() => {}); await P.waitForTimeout(1500);
    const bases = await d.fr.evaluate(() => { const bs = ctBases(); return Object.keys(bs).map(n => ({ n, t: mapTierOf(n) })); });
    const pick = PLACES.length ? bases.filter(b => PLACES.indexOf(b.n) >= 0) : bases;
    const tiers = {}; pick.forEach(b => { tiers[b.t] = (tiers[b.t] || 0) + 1; });
    ok(prof + ' the demo\'s map has places of every tier to walk into (' + JSON.stringify(tiers) + ')', PLACES.length ? pick.length > 0 : ['camp', 'town', 'fortress'].every(t => tiers[t] > 0), JSON.stringify(tiers));
    const firstOf = {}, rows = [];
    let planted = false;
    for (const b of pick) {
      const fr = await townFrame(P, d, b.n);
      if (!fr) { ok(prof + ' ' + b.n + ' (' + b.t + '): the town came up with its signs', false, 'no town'); await leave(P, d); continue; }
      let waited = 0;   /* the signs are laid on the frame after the town is drawn: up to six seconds for them, said in the line */
      for (; waited < 6000; waited += 250) { if (await fr.evaluate(() => { const S = BohemiaSettlement.doorSigns(); return S.show && S.list.length >= S.doors.length && S.doors.length > 0; }).catch(() => false)) break; await P.waitForTimeout(250); }
      await P.waitForTimeout(500);
      const m = await fr.evaluate(IN_FRAME), F = await faultsOf(P, fr, m);
      const all = !F.d1.length && !F.d2.length && !F.d3.length && !F.d4.length;
      const lotSign = m.signs.find(s => s.k === 'lot');
      ok(prof + ' ' + b.n + ' (' + b.t + '): D1-D4 ' + m.signs.length + ' doors, ' + m.signs.filter(s => s.shown && !s.missing).length + ' signs on the glass (' + m.doors.join(' ') + '), smallest word '
        + Math.min.apply(null, m.signs.map(s => s.fs || 99)) + ' px (drawn in ' + waited + ' ms), the lot ' + (m.lot ? m.lot.seen : '?') + '% in view, SCAVENGE at ' + (lotSign && lotSign.plate ? lotSign.plate.join(',') : 'nowhere'), all, say(F));
      rows.push(all);
      /* D5 the lot's sign opens the lot; the first place of each tier: every sign opens its own door */
      const keys = firstOf[b.t] ? ['lot'] : m.doors; firstOf[b.t] = true;
      const wrong = [];
      for (const k of keys) { const t = await tapSign(P, fr, k); if (!t || t.open !== k) wrong.push(k + '->' + (t ? t.open : 'no sign')); else if (k === 'lot' && !/Search the lot|Nothing left|picked/i.test(t.said)) wrong.push('lot opened without its search'); }
      ok(prof + ' ' + b.n + ': D5 a tap on ' + (keys.length > 1 ? 'every sign (' + keys.length + ') opens its own door' : 'SCAVENGE opens the lot'), !wrong.length, wrong.join(', '));
      /* M: three plants, once per shape, each must be caught */
      if (!planted) { planted = true;
        await fr.evaluate(() => { window.__DS_PLANT = { drop: 'lot' }; }); await P.waitForTimeout(500);
        const F1 = await faultsOf(P, fr, await fr.evaluate(IN_FRAME));
        await fr.evaluate(() => { delete window.__DS_PLANT; }); await P.waitForTimeout(500);
        const back = await faultsOf(P, fr, await fr.evaluate(IN_FRAME));
        ok(prof + ' M1 planted: the lot\'s sign removed is caught (' + say(F1) + '), and it comes back when the plant is gone', F1.d1.some(x => /lot has no sign/.test(x)) && !back.d1.length, say(back));
        /* a sign moved under the phone (the phone's own middle in the town's frame) */
        const fb = await (await fr.frameElement()).boundingBox();
        const ph = await P.evaluate(() => { const e = document.getElementById('bohphone') || document.querySelector('[id*="phone"]'); if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? [r.left + r.width / 2, r.top + r.height / 2] : null; });
        let caught2 = null;
        if (ph) { await fr.evaluate(([x, y]) => { const e = document.querySelector('#doorsigns .doorsign[data-door="hall"]') || document.querySelector('#doorsigns .doorsign'); e.style.left = Math.round(x - 30) + 'px'; e.style.top = Math.round(y - 22) + 'px'; }, [ph[0] - fb.x, ph[1] - fb.y]);
          caught2 = await faultsOf(P, fr, await fr.evaluate(IN_FRAME)); }
        ok(prof + ' M2 planted: a sign moved under the phone is caught (' + (caught2 ? say(caught2) : 'no phone on this glass') + ')', !ph || caught2.d2.length > 0, caught2 && say(caught2));
        await fr.evaluate(() => { const e = document.querySelector('#doorsigns .doorsign b'); if (e) e.style.fontSize = '9px'; });
        const F3 = await faultsOf(P, fr, await fr.evaluate(IN_FRAME));
        await fr.evaluate(() => { const e = document.querySelector('#doorsigns .doorsign b'); if (e) e.style.fontSize = ''; window.__DS_PLANT = { at: Date.now() }; }); await P.waitForTimeout(400);
        await fr.evaluate(() => { delete window.__DS_PLANT; }); await P.waitForTimeout(500);   /* a fresh plant key makes the signs lay themselves out again */
        ok(prof + ' M3 planted: a 9 px word on a sign is caught (' + say(F3) + ')', F3.d3.some(x => /word 9/.test(x)), say(F3));
        /* L: the LARGEST UI size, then back */
        await fr.evaluate(() => { localStorage.setItem('bohemia.uisize.v1', '3'); window.__DS_PLANT = { size: 3 }; }); await P.waitForTimeout(900);
        const mL = await fr.evaluate(IN_FRAME), FL = await faultsOf(P, fr, mL);
        await fr.evaluate(() => { localStorage.setItem('bohemia.uisize.v1', '1'); delete window.__DS_PLANT; }); await P.waitForTimeout(700);
        ok(prof + ' L at the LARGEST UI size every sign is still whole on the glass, its word ' + Math.min.apply(null, mL.signs.map(s => s.fs || 99)) + ' px', !FL.d1.length && !FL.d2.length && !FL.d3.length && Math.min.apply(null, mL.signs.map(s => s.fs || 99)) >= 14, say(FL));
      }
      await leave(P, d);
    }
    ok(prof + ' every place walked into shows every door\'s sign (' + rows.filter(Boolean).length + ' of ' + pick.length + ')', rows.length === pick.length && rows.every(Boolean));
    const errs = (d.errs || []).filter(e => !/favicon|net::ERR|404/.test(String(e)));
    ok(prof + ' nothing threw', !errs.length, errs.slice(0, 2).join(' | '));
  } finally { await d.browser.close().catch(() => {}); try { d.server.close(); } catch (e) {} }
}
(async () => { for (const p of PROFS) await shape(p); done(); })().catch(e => { console.log('  FAIL the gate itself threw: ' + e.message); fail++; done(); });
