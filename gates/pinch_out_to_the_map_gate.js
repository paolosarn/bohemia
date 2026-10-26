/* ==========================================================================
   PINCH OUT TO THE MAP  (RUN TWO, 10/26/26, VAMILY [pinch out to the map], rules 211(c) and 220(d))

   PAOLO 10/26: "one great thing about playing on iPad or your phone... when you're in the settlement and you just wanna get back
   to the map you zoom out with your two thumbs... press escape on keyboard."
   MEASURED BEFORE: two fingers on the town did nothing but a one-finger drag; ESCAPE closed a sheet, then left (UI's keyTown).
   NOW (__PINCH_OUT_TO_THE_MAP__): two fingers zoom the town in toward them as far as its size earns (zoom_max), a finger pans it
   then; bringing them together returns it to the fit and on past it shrinks the town away over the map; let go past three
   quarters and he is on the map at that town, before that it springs back.

   LEGS, on the demo through Church's own door, REAL two-finger touches (CDP touch points):
     P1 *** SPREAD *** two fingers spread: the town zooms in, never past its zoom_max, the point between the fingers stays there
     P2 a finger pans the zoomed town; the town is not left by it
     P3 *** PINCH OUT *** fingers together: back to the fit, then on past it the town shrinks (the map shows through), let go: the
        town is gone, the map is up at that town (the map's own LOOP.open cleared, its frame hidden)
     P4 a small pinch let go early springs back: the town still open, whole again
     P5 a one-finger tap still opens a building
     K1 the computer: ESCAPE closes an open building, the next ESCAPE leaves for the map
     Z  nothing threw
   node gates/pinch_out_to_the_map_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('PINCH OUT TO THE MAP: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

async function town(d) {
  const P = d.page, fr = d.fr;
  const name = await fr.evaluate(() => { const bs = ctBases(), names = Object.keys(bs), t0 = names.find(k => /church/i.test(k)) || names[0], t = { name: t0, x: bs[t0].x, y: bs[t0].y, tier: mapTierOf(t0) }; city.x = t.x; city.y = t.y; loopOpenTown(t); return t0; });
  let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(300);
    for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate((nm) => { try { return BohemiaSettlement.ready() && BohemiaSettlement.state.place.name === nm && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }, name).catch(() => false)) { sf = x; break; } }
  if (sf) { await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {}); await P.waitForTimeout(800); }
  return { sf, name };
}
const mapUp = (fr) => fr.evaluate(() => ({ open: !!LOOP.open, shown: !!(LOOP.frame && LOOP.frame.style.display === 'block') }));

(async () => {
  let d = await drive.open({ profile: 'phone_portrait', keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  try {
    await d.page.waitForTimeout(3000);
    const P = d.page, fr = d.fr, cdp = await P.context().newCDPSession(P);
    let { sf, name } = await town(d); if (!sf) { ok('a town through the map\'s door', false); return done(); }
    const box = async () => (await sf.frameElement()).boundingBox();
    const pic = async () => { const b = await box(); return sf.evaluate((b) => { const F = BohemiaSettlement.fit(), sc = document.getElementById('scene').getBoundingClientRect(); return { x: b.x + sc.left + F.ox, y: b.y + sc.top + F.oy, w: F.pw, h: F.ph, s: F.s, zoom: BohemiaSettlement.pinch().zoom, max: BohemiaSettlement.pinch().max, out: BohemiaSettlement.pinch().out }; }, b); };
    const two = async (a0, b0, a1, b1, steps, lift) => {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: a0[0], y: a0[1], id: 1 }, { x: b0[0], y: b0[1], id: 2 }] });
      for (let i = 1; i <= steps; i++) { const t = i / steps, L = (p, q) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: L(a0, a1)[0], y: L(a0, a1)[1], id: 1 }, { x: L(b0, b1)[0], y: L(b0, b1)[1], id: 2 }] }); await P.waitForTimeout(16); }
      const mid = await pic();
      if (lift !== false) await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await P.waitForTimeout(500); return mid; };
    /* P1 spread around a point of the picture */
    const p0 = await pic(), cxy = [p0.x + p0.w * 0.45, p0.y + p0.h * 0.5];
    const ptAt = (q, X, Y) => [(X - q.x) / q.s, (Y - q.y) / q.s];   /* the picture's point under a screen point */
    const under0 = ptAt(p0, cxy[0], cxy[1]);
    await two([cxy[0] - 30, cxy[1]], [cxy[0] + 30, cxy[1]], [cxy[0] - 150, cxy[1]], [cxy[0] + 150, cxy[1]], 12);
    const p1 = await pic(), under1 = ptAt(p1, cxy[0], cxy[1]);
    const drift = Math.hypot((under1[0] - under0[0]) * p1.s, (under1[1] - under0[1]) * p1.s);
    ok('*** P1 SPREAD *** two fingers spread: the town zooms ' + p0.zoom + ' -> ' + p1.zoom.toFixed(2) + ' (its most ' + p1.max + '), the point between the fingers drifted ' + drift.toFixed(1) + ' points',
      p1.zoom > 1.5 && p1.zoom <= p1.max + 1e-6 && drift < 12);
    /* P2 a finger pans the zoomed town */
    const v0 = await sf.evaluate(() => { const v = BohemiaSettlement._view(); return [v.ox, v.oy]; });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: cxy[0], y: cxy[1], id: 3 }] });
    for (let i = 1; i <= 8; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: cxy[0] + i * 12, y: cxy[1], id: 3 }] }); await P.waitForTimeout(16); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await P.waitForTimeout(400);
    const v1 = await sf.evaluate(() => { const v = BohemiaSettlement._view(); return [v.ox, v.oy]; }), m2 = await mapUp(fr);
    ok('P2 a finger pans the zoomed town (' + v0.join(',') + ' -> ' + v1.join(',') + '), the town still open', v1[0] !== v0[0] && m2.open && m2.shown);
    /* P4 a small pinch let go early springs back (from the fit) */
    await two([cxy[0] - 150, cxy[1]], [cxy[0] + 150, cxy[1]], [cxy[0] - 60, cxy[1]], [cxy[0] + 60, cxy[1]], 10);   /* back to the fit */
    const fit = await pic();
    const mid4 = await two([cxy[0] - 100, cxy[1]], [cxy[0] + 100, cxy[1]], [cxy[0] - 90, cxy[1]], [cxy[0] + 90, cxy[1]], 6);
    const p4 = await pic(), m4 = await mapUp(fr);
    ok('P4 a small pinch let go early springs back (the fit ' + fit.zoom + '; mid-pinch ' + mid4.out.toFixed(2) + ', after ' + p4.out + '), the town still open', fit.zoom === 1 && mid4.out < 1 && mid4.out > 0.75 && p4.out === 1 && m4.open && m4.shown);
    /* P5 a one-finger tap still opens a building */
    const wb = await sf.evaluate(() => BohemiaSettlement.where('board')); const b5 = await box();
    await P.touchscreen.tap(b5.x + wb.x, b5.y + wb.y); await P.waitForTimeout(600);
    const o5 = await sf.evaluate(() => BohemiaSettlement.state.open);
    ok('P5 a one-finger tap still opens a building (' + o5 + ')', o5 === 'board');
    await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(400);
    /* P3 pinch out past the fit */
    const midOut = await two([cxy[0] - 140, cxy[1]], [cxy[0] + 140, cxy[1]], [cxy[0] - 30, cxy[1]], [cxy[0] + 30, cxy[1]], 14, false);
    const see = await sf.evaluate(() => { let fe = null; try { fe = window.frameElement; } catch (e) {} return { app: document.getElementById('app').style.transform, frameBg: fe ? fe.style.background : null }; });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await P.waitForTimeout(900);
    const m3 = await mapUp(fr), near = await fr.evaluate((nm) => { const b = ctBases()[nm]; return b ? Math.max(Math.abs(city.x - b.x), Math.abs(city.y - b.y)) : null; }, name);
    ok('*** P3 PINCH OUT *** fingers together: the town shrinks away (' + see.app + ', the map through: ' + see.frameBg + '), let go: the town gone, the map up at ' + name + ' (' + near + ' cells off)',
      midOut.out < 0.75 && /scale/.test(see.app) && /transparent/.test(see.frameBg || '') && !m3.open && !m3.shown && near != null && near <= 2);
  } catch (e) { ok('the phone legs ran [' + String(e.stack || e.message).slice(0, 300) + ']', false); }
  ok('Z1 nothing threw on the phone', d.errs.length === 0, d.errs.slice(0, 2).join(' | ')); await d.close();
  d = await drive.open({ profile: 'computer', keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  try {
    await d.page.waitForTimeout(3000);
    const { sf } = await town(d); const P = d.page, fr = d.fr;
    const wb = await sf.evaluate(() => BohemiaSettlement.where('board')), b = await (await sf.frameElement()).boundingBox();
    await P.mouse.click(b.x + wb.x, b.y + wb.y); await P.waitForTimeout(600);
    const a = await sf.evaluate(() => BohemiaSettlement.state.open);
    await P.keyboard.press('Escape'); await P.waitForTimeout(500);
    const c = await sf.evaluate(() => BohemiaSettlement.state.open), m1 = await mapUp(fr);
    await P.keyboard.press('Escape'); await P.waitForTimeout(800);
    const m2 = await mapUp(fr);
    ok('K1 the computer: ESCAPE closes the open ' + a + ' (then ' + c + ', the town open ' + m1.open + '), the next ESCAPE leaves for the map (' + JSON.stringify(m2) + ')', a === 'board' && !c && m1.open && !m2.open && !m2.shown);
  } catch (e) { ok('the computer legs ran [' + String(e.message).slice(0, 200) + ']', false); }
  ok('Z2 nothing threw on the computer', d.errs.length === 0, d.errs.slice(0, 2).join(' | ')); await d.close();
  done();
})();
