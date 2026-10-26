/* ==========================================================================
   THE FLIP GLIDES  (RUN TWO, 10/26/26, VAMILY [the towns wired tall and wide], rules 220, 279, 286, 289)

   PAOLO 10/26: "all camps and settlements have to look good when you flip them from portrait to landscape... I don't know if
   the buildings and the people flip when it flips, but you gotta find a way to do it cleanly."
   MEASURED BEFORE: every glass drew the town's WIDE picture; upright it fitted at 0.19 and left the glass mostly valley. COOK
   re-laid eleven of fourteen wides out of the phone's corners and the screen still laid the tier's boxes over them (a tap on
   Blues' drawn armourer landed on open ground). A turn re-fitted the same picture.
   NOW (__THE_TOWNS_WIRED_TALL_AND_WIDE__, __THE_FLIP_GLIDES__): upright the town's TALL composition, on its side its WIDE one,
   each with its own boxes and doors; a turn glides every building from its old spot to its new one in one beat, everybody
   riding with the ground.

   LEGS, on the demo through Blues' own door (a re-laid town), REAL taps:
     F1 *** TALL UPRIGHT *** the phone held up draws the town's tall picture, every building opens with one real tap where it stands
     F2 *** THE FLIP GLIDES *** the glass turned (with the bar open, his lead walked to its keeper): the wide picture; the flip ran
        one beat (MOTION's beat), at least eight frames; every building present on every frame, none jumping more than 40 percent
        of its way in one frame; no frame more than mostly dark where the town stands
     F3 the bar still open and he stands by its keeper in the new picture; every keeper, the crowd and the post there before are
        there after (nobody lost)
     F4 every building opens with one real tap where it stands on its side
     F5 turned back up MID-WALK: the tall picture, and he keeps walking to the same door and gets there
     F6 MOTION's LESS: the flip is a dissolve in place (no building travels), under a quarter second
     F7 the computer: a wider window keeps the wide picture, no flip
     Z  nothing threw
   node gates/the_flip_glides_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('THE FLIP GLIDES: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const WANT = /blues/i;

async function town(d) {
  const P = d.page, fr = d.fr;
  const name = await fr.evaluate((re) => { const bs = ctBases(), names = Object.keys(bs), t0 = names.find(k => new RegExp(re, 'i').test(k)) || names[0], t = { name: t0, x: bs[t0].x, y: bs[t0].y, tier: mapTierOf(t0) }; city.x = t.x; city.y = t.y; loopOpenTown(t); return t0; }, WANT.source);
  let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(300);
    for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate((nm) => { try { return BohemiaSettlement.ready() && BohemiaSettlement.state.place.name === nm && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }, name).catch(() => false)) { sf = x; break; } }
  if (sf) { await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {}); await P.waitForTimeout(1200); }
  return { sf, name };
}
const flipNow = (sf) => sf.evaluate(() => BohemiaSettlement.flip());
/* the flip over: a loaded machine draws fewer frames a second, and the beat waits for them rather than jumping */
const flipDone = async (sf, P, n0) => { for (let i = 0; i < 60; i++) { const f = await flipNow(sf); if (f.n > n0 && !f.on) return f; await P.waitForTimeout(200); } return flipNow(sf); };
const closeSheet = async (sf, P) => { await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(400); };
async function everyTap(sf, P, mouse) {
  const order = await sf.evaluate(() => BohemiaSettlement.order()); let landed = 0; const missed = [];
  for (const k of order) {
    await closeSheet(sf, P);
    const w = await sf.evaluate(k => BohemiaSettlement.where(k), k), b = await (await sf.frameElement()).boundingBox();
    if (w) { if (mouse) await P.mouse.click(b.x + w.x, b.y + w.y); else await P.touchscreen.tap(b.x + w.x, b.y + w.y); await P.waitForTimeout(600); }
    if (await sf.evaluate(() => BohemiaSettlement.state.open) === k) landed++; else missed.push(k);
  }
  await closeSheet(sf, P);
  return { landed, n: order.length, missed };
}
/* who stands in the town, by who they are */
const people = (sf) => sf.evaluate(() => BohemiaSettlement.folk().map(p => p.keeper ? 'k:' + p.k : p.post ? 'p:' + p.rid : p.crewMan ? 'm:' + (p.name || p.look) : 'c:' + p.slot).sort());
/* the frames of the flip, read off its trace: every building there each frame, its steps along its way */
function frames(tr) {
  const keys = new Set(); tr.forEach(f => Object.keys(f.b).forEach(k => keys.add(k)));
  let worstStep = 0, missing = 0;
  for (const k of keys) {
    const pts = tr.map(f => f.b[k]).filter(Boolean); if (pts.length < tr.length) missing++;
    if (pts.length < 2) continue;
    const a = pts[0], z = pts[pts.length - 1], D = Math.hypot(z[0] - a[0], z[1] - a[1]) + Math.abs(z[2] - a[2]) + Math.abs(z[3] - a[3]);
    if (D < 8) continue;
    for (let i = 1; i < pts.length; i++) { const p = pts[i - 1], q = pts[i], st = Math.hypot(q[0] - p[0], q[1] - p[1]) + Math.abs(q[2] - p[2]) + Math.abs(q[3] - p[3]); worstStep = Math.max(worstStep, st / D); }
  }
  return { keys: keys.size, missing, worstStep };
}

(async () => {
  let d = await drive.open({ profile: 'phone_portrait', keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  const P = d.page;
  try {
    await P.waitForTimeout(3000);
    const { sf, name } = await town(d); if (!sf) { ok('a town through the map\'s door', false); return done(); }
    /* F1 */
    const f1 = await flipNow(sf), t1 = await everyTap(sf, P, false);
    ok('*** F1 TALL UPRIGHT *** ' + name + ' upright draws ' + f1.src + ' (' + f1.shape + '), every building opens with one real tap (' + t1.landed + ' of ' + t1.n + ')', f1.shape === 'tall' && /_tall/.test(f1.src) && t1.landed === t1.n && t1.n >= 6, t1.missed.join(', ') || 'all');
    /* F2: the bar open, his lead at its keeper, then the glass turned */
    const wb = await sf.evaluate(() => BohemiaSettlement.where('bar')), b0 = await (await sf.frameElement()).boundingBox();
    await P.touchscreen.tap(b0.x + wb.x, b0.y + wb.y); await P.waitForTimeout(6000);
    const before = await people(sf), bar0 = await sf.evaluate(() => BohemiaSettlement.state.open);
    /* a sampler in the page: how much of the town's own rectangle is dark, each frame of the flip */
    await sf.evaluate(() => { window.__FLIPDARK = []; const cv = document.getElementById('cv'), sm = document.createElement('canvas'); sm.width = 48; sm.height = 48; const g = sm.getContext('2d', { willReadFrequently: true });
      const tick = () => { const f = BohemiaSettlement.flip(); if (f.on) { try { const F = BohemiaSettlement.fit(), dpr = cv.width / (cv.clientWidth || 1);
          g.clearRect(0, 0, 48, 48); g.drawImage(cv, Math.max(0, F.ox * dpr), Math.max(0, F.oy * dpr), Math.min(cv.width, F.pw * dpr), Math.min(cv.height, F.ph * dpr), 0, 0, 48, 48);
          const im = g.getImageData(0, 0, 48, 48).data; let dark = 0, n = 0; for (let i = 0; i < im.length; i += 4) { n++; if (im[i] + im[i + 1] + im[i + 2] < 30) dark++; } window.__FLIPDARK.push(dark / n); } catch (e) {} }
        if (window.__FLIPDARK.length < 200) requestAnimationFrame(tick); };
      requestAnimationFrame(tick); });
    const n2 = (await flipNow(sf)).n;
    await P.setViewportSize({ width: 844, height: 390 }); await P.waitForTimeout(600);
    const f2 = await flipDone(sf, P, n2), fr2 = frames(f2.trace), dark = await sf.evaluate(() => window.__FLIPDARK || []), dmax = dark.length ? Math.max(...dark) : 1;
    const ran = f2.log.length ? f2.log[f2.log.length - 1] : null;   /* took: the beat as drawn, from its first frame */
    ok('*** F2 THE FLIP GLIDES *** the glass turned: ' + f2.src + ' (' + f2.shape + '); the flip ' + (ran ? ran.from + ' -> ' + ran.to + ' (' + (ran.pairs ? ran.pairs + ' of COOK\'s pairs' : 'the taps\' boxes') + '), a beat of ' + ran.dur + ' ms drawn in ' + ran.took + ' ms' : 'never ran') + ', ' + f2.trace.length + ' frames, the worst gap ' + f2.worst + ' ms; ' + fr2.keys + ' buildings, ' + fr2.missing + ' missing a frame, the biggest step ' + Math.round(fr2.worstStep * 100) + ' percent of its way; the darkest frame ' + Math.round(dmax * 100) + ' percent dark',
      f2.shape === 'wide' && !/_tall/.test(f2.src) && !!ran && ran.dur >= 300 && ran.dur <= 1000 && ran.took > 0 && f2.trace.length >= 8 && fr2.keys >= 6 && fr2.missing === 0 && fr2.worstStep <= 0.4 && dmax < 0.5);
    /* F3 */
    const after = await people(sf), st3 = await sf.evaluate(() => { const L = BohemiaSettlement.lead(), kp = BohemiaSettlement.folk().find(p => p.keeper && p.k === 'bar'); return { open: BohemiaSettlement.state.open, goal: L.goal, x: L.x, y: L.y, kp: kp ? [kp.x, kp.y] : null, h: BohemiaSettlement.scale().person }; });
    const lost = before.filter(x => after.indexOf(x) < 0), dk = st3.kp ? Math.hypot(st3.x - st3.kp[0], st3.y - st3.kp[1]) : 1e9;
    ok('F3 the bar still open (' + bar0 + ' -> ' + st3.open + '), he stands ' + Math.round(dk) + ' px from its keeper (a man is ' + Math.round(st3.h) + '); ' + before.length + ' people before, ' + after.length + ' after, lost: ' + (lost.join(', ') || 'nobody'),
      bar0 === 'bar' && st3.open === 'bar' && dk <= st3.h * 1.5 && !lost.length);
    /* F4 */
    await closeSheet(sf, P);
    const t4 = await everyTap(sf, P, false);
    ok('F4 on its side every building opens with one real tap where it stands (' + t4.landed + ' of ' + t4.n + ')', t4.landed === t4.n, t4.missed.join(', ') || 'all');
    /* F5: a far building, turned back up mid-walk */
    const far = await sf.evaluate(() => { const L = BohemiaSettlement.lead(), o = BohemiaSettlement.order().filter(k => k !== 'lot' && k !== 'build'); let best = null, bd = -1;
      o.forEach(k => { const kp = BohemiaSettlement.folk().find(p => p.keeper && p.k === k); if (kp) { const dd = Math.hypot(kp.x - L.x, kp.y - L.y); if (dd > bd) { bd = dd; best = k; } } }); return best; });
    const wf = await sf.evaluate(k => BohemiaSettlement.where(k), far), b5 = await (await sf.frameElement()).boundingBox();
    await P.touchscreen.tap(b5.x + wf.x, b5.y + wf.y); await P.waitForTimeout(350);
    const w5 = await sf.evaluate(() => { const L = BohemiaSettlement.lead(); return { walking: L.walking, goal: L.goal && L.goal.key }; });
    const n5 = (await flipNow(sf)).n;
    await P.setViewportSize({ width: 390, height: 844 }); await P.waitForTimeout(300);
    const f5 = await flipDone(sf, P, n5), g5 = await sf.evaluate(() => { const g = BohemiaSettlement.lead().goal; return g && g.key; });
    let there = false; for (let i = 0; i < 80 && !there; i++) { await P.waitForTimeout(250); there = await sf.evaluate((k) => { const L = BohemiaSettlement.lead(), kp = BohemiaSettlement.folk().find(p => p.keeper && p.k === k); return !L.walking && !!kp && Math.hypot(L.x - kp.x, L.y - kp.y) <= BohemiaSettlement.scale().person * 1.5; }, far); }
    const e5 = await sf.evaluate((k) => { const L = BohemiaSettlement.lead(), kp = BohemiaSettlement.folk().find(p => p.keeper && p.k === k); return { at: [Math.round(L.x), Math.round(L.y)], walking: L.walking, goal: L.goal, kp: kp ? [Math.round(kp.x), Math.round(kp.y)] : null, h: Math.round(BohemiaSettlement.scale().person), noWay: L.noWay }; }, far);
    ok('F5 turned back up MID-WALK (walking ' + w5.walking + ' to ' + w5.goal + '): ' + f5.src + ', still going to ' + g5 + ', and he gets there (' + there + ')', w5.walking && /_tall/.test(f5.src) && g5 === w5.goal && there, JSON.stringify(e5));
    /* F6: LESS */
    await closeSheet(sf, P);
    await sf.evaluate(() => { try { const T = window.top; T.BOHEMIA_SETTINGS = T.BOHEMIA_SETTINGS || {}; T.__keepMotion = T.BOHEMIA_SETTINGS.motion; T.BOHEMIA_SETTINGS.motion = () => true; } catch (e) {} });
    const n6 = (await flipNow(sf)).n;
    await P.setViewportSize({ width: 844, height: 390 }); await P.waitForTimeout(300);
    const f6 = await flipDone(sf, P, n6), fr6 = frames(f6.trace), r6 = f6.log[f6.log.length - 1];
    const moved = f6.trace.length >= 2 ? Object.keys(f6.trace[0].b).filter(k => { const a = f6.trace[0].b[k], z = f6.trace[f6.trace.length - 1].b[k]; return a && z && Math.hypot(z[0] - a[0], z[1] - a[1]) > 1; }) : ['no frames'];
    ok('F6 MOTION\'s LESS: a dissolve in place (' + (r6 ? r6.dur + ' ms, reduced ' + r6.reduced : 'never ran') + '; buildings that travelled: ' + (moved.join(', ') || 'none') + ')', !!r6 && r6.reduced && r6.dur <= 250 && !moved.length);
    await sf.evaluate(() => { try { const T = window.top; if (T.__keepMotion) T.BOHEMIA_SETTINGS.motion = T.__keepMotion; else delete T.BOHEMIA_SETTINGS.motion; } catch (e) {} });
  } catch (e) { ok('the phone legs ran [' + String(e.stack || e.message).slice(0, 300) + ']', false); }
  ok('Z1 nothing threw on the phone', d.errs.length === 0, d.errs.slice(0, 2).join(' | ')); await d.close();
  d = await drive.open({ profile: 'computer', keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  try {
    await d.page.waitForTimeout(3000);
    const { sf } = await town(d);
    const a = await flipNow(sf);
    await d.page.setViewportSize({ width: 1180, height: 900 }); await d.page.waitForTimeout(900);
    const b = await flipNow(sf);
    ok('F7 the computer: ' + a.src + ' (' + a.shape + '), a narrower window keeps it (' + b.src + ', flips ' + a.n + ' -> ' + b.n + ')', a.shape === 'wide' && b.src === a.src && b.n === a.n);
  } catch (e) { ok('the computer legs ran [' + String(e.message).slice(0, 200) + ']', false); }
  ok('Z2 nothing threw on the computer', d.errs.length === 0, d.errs.slice(0, 2).join(' | ')); await d.close();
  done();
})();
