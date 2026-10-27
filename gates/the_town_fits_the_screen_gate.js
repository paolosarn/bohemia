/* ==========================================================================
   THE TOWN FITS THE SCREEN, AND FRAMES AROUND THE PHONE  (RUN TWO, 10/26/26, VAMILY [the town fits the screen] rule 218(c),
   [the town frames around the phone] rule 213)

   PAOLO 10/26: "I don't like sliding... you don't have to scroll, it's too much, it should be zoomed out perfectly the way
   it's supposed to be"; "not directly in the middle of the screen, slightly off center... the phone placement permanent".
   MEASURED BEFORE: an upright phone showed about 60 percent of the town and slid for the rest (EYES 10/26q k23: DEUCE off the
   left edge, GRIZ on the right); the building's sheet ran the full width under the phone's corner and LEAVE rode up under
   it (EYES 10/26m q10, q11: a tap on LEAVE opened DROP IT / KEEP IT).
   NOW (__THE_TOWN_FITS_THE_SCREEN__): the whole town fitted to the open area (the glass less the phone's band), nothing slides;
   the sheet above or beside the band; LEAVE in the band out of the phone's corner.

   LEGS, on the demo through Church's own door, phone upright, phone on its side and the computer:
     T1 *** THE TOWN FILLS THE GLASS *** (re-aimed 10/27 by the coordinator, __FOUR_LAYOUTS__, Paolo: 'four of every settlement,
        landscape with the two phone placements and portrait with the two... unplayable... tiny, it hurts my eyes'): the picture
        covers at least four fifths of the glass, never a small box in the open band; every door's middle and every keeper and
        man of his company on the glass and none under the phone (the crowd may pass behind it)
     T2 *** NO SLIDING *** a one-finger drag across the town moves nothing
     T3 every building opens with one real tap where it stands
     T4 *** NOTHING UNDER THE PHONE *** with the board open: the sheet, its X, every row of it and LEAVE are clear of the phone's
        rectangle and on the glass; a tap on LEAVE's middle is LEAVE (the phone's own LEAVE with the phone up, UI TWO 52741663)
     T5 the phone on the left (his setting, UI TWO's BohemiaPhone.setSide): the town lays out of it at once, nothing under it
     T6 the band is UI TWO's own rectangle (BOH_PHONE_RECT), read live, never a guess
     Z  nothing threw
   node gates/the_town_fits_the_screen_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const { leaveAt } = require(path.join(ROOT, 'tools/bohemia_leave_the_town.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('THE TOWN FITS THE SCREEN: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const fmt = r => r ? r.map(v => Math.round(v)).join(',') : 'none';
const apart = (a, b) => !a || !b || a[0] + a[2] <= b[0] + 0.5 || b[0] + b[2] <= a[0] + 0.5 || a[1] + a[3] <= b[1] + 0.5 || b[1] + b[3] <= a[1] + 0.5;

async function town(d) {
  const P = d.page, fr = d.fr;
  await P.waitForTimeout(3000);
  await fr.evaluate(() => { const bs = ctBases(), names = Object.keys(bs), t0 = names.find(k => /church/i.test(k)) || names[0], t = { name: t0, x: bs[t0].x, y: bs[t0].y, tier: mapTierOf(t0) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
  let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(400);
    for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }).catch(() => false)) { sf = x; break; } }
  if (sf) await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {});
  if (sf) await P.waitForTimeout(1500);
  return sf;
}
/* what is on the glass, in the town frame's pixels */
const readFit = (sf) => sf.evaluate(() => {
  const B = BohemiaSettlement, F = B.fit(), sc = document.getElementById('scene').getBoundingClientRect(), v = B._view();
  const ph = F.phone ? [F.phone.left, F.phone.top, F.phone.width, F.phone.height] : null;
  const O = F.open, open = [sc.left + O.x0, sc.top + O.y0, O.x1 - O.x0, O.y1 - O.y0];
  const pic = [sc.left + F.ox, sc.top + F.oy, F.pw, F.ph];
  const pt = (px, py) => [sc.left + F.ox + px * F.s, sc.top + F.oy + py * F.s];
  const doors = B.order().map(k => { const b = B._box ? B._box(k) : null; return b ? { k, at: pt((b[0] + b[2]) / 2, (b[1] + b[3]) / 2) } : null; }).filter(Boolean);
  const folk = B.folk().map(p => ({ who: p.keeper ? 'keeper ' + p.k : p.crewMan ? 'crew ' + (p.name || '') : p.post ? 'post' : 'crowd', at: pt(p.x, p.y - B.scale().person * 0.5) }));
  const l = document.getElementById('leave'), lr = l.getBoundingClientRect();
  return { open, pic, glass: [sc.left, sc.top, sc.width, sc.height], phone: ph, doors, folk, leave: [lr.x, lr.y, lr.width, lr.height], W: innerWidth, H: innerHeight, s: F.s, fit: F.fit, band: O.band, guessed: !!(F.phone && F.phone.guessed) };
});
const inside = (p, r, m) => p[0] >= r[0] - (m || 0) && p[0] <= r[0] + r[2] + (m || 0) && p[1] >= r[1] - (m || 0) && p[1] <= r[1] + r[3] + (m || 0);

async function run(profile) {
  const d = await drive.open({ profile, keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  const P = d.page, mouse = profile === 'computer', tag = profile.toUpperCase();
  try {
    const sf = await town(d); if (!sf) { ok(tag + ': a town through the map\'s door', false); return d; }
    const box = async () => (await sf.frameElement()).boundingBox();
    const tapAt = async (x, y) => { const b = await box(); if (mouse) await P.mouse.click(b.x + x, b.y + y); else await P.touchscreen.tap(b.x + x, b.y + y); await P.waitForTimeout(600); };
    const closeSheet = async () => { await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(400); };
    /* T1 */
    const f = await readFit(sf);
    const G = f.glass, iw = Math.max(0, Math.min(f.pic[0] + f.pic[2], G[0] + G[2]) - Math.max(f.pic[0], G[0])), ih = Math.max(0, Math.min(f.pic[1] + f.pic[3], G[1] + G[3]) - Math.max(f.pic[1], G[1]));
    const fills = iw * ih >= 0.8 * G[2] * G[3];
    const outDoors = f.doors.filter(x => !inside(x.at, G) || (f.phone && inside(x.at, f.phone))), outFolk = f.folk.filter(x => x.who !== 'crowd' && (!inside(x.at, G, 2) || (f.phone && inside(x.at, f.phone))));
    ok('*** T1 ' + tag + ': THE TOWN FILLS THE GLASS *** (the picture ' + fmt(f.pic) + ' on the glass ' + fmt(G) + ', ' + Math.round(100 * iw * ih / (G[2] * G[3])) + ' percent covered, the phone ' + fmt(f.phone) + (f.guessed ? ' where it will stand' : '') + '; ' + f.doors.length + ' doors, ' + f.folk.length + ' people)',
      fills && f.doors.length >= 5 && !outDoors.length && f.folk.length >= 5 && !outFolk.length && !!f.phone, outDoors.map(x => x.k).concat(outFolk.map(x => x.who)).slice(0, 6).join(', ') || 'all in');
    /* T2: a drag */
    const v0 = await sf.evaluate(() => { const v = BohemiaSettlement._view(); return [v.ox, v.oy]; });
    const b = await box(), cx = b.x + f.pic[0] + f.pic[2] / 2, cy = b.y + f.pic[1] + f.pic[3] / 2;
    if (mouse) { await P.mouse.move(cx, cy); await P.mouse.down(); for (let i = 1; i <= 10; i++) await P.mouse.move(cx - i * 18, cy - i * 6); await P.mouse.up(); }
    else { const cdp = await P.context().newCDPSession(P); await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: cx, y: cy }] });
      for (let i = 1; i <= 10; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: cx - i * 18, y: cy - i * 6 }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
    await P.waitForTimeout(400);
    const v1 = await sf.evaluate(() => { const v = BohemiaSettlement._view(); return [v.ox, v.oy]; });
    await closeSheet();
    ok('*** T2 ' + tag + ': NO SLIDING *** (a 180-point drag; the town at ' + v0.join(',') + ', then ' + v1.join(',') + ')', v0[0] === v1[0] && v0[1] === v1[1]);
    /* T3: every building, one real tap where it stands (no pan first) */
    const order = await sf.evaluate(() => BohemiaSettlement.order());
    let landed = 0; const missed = [];
    for (const k of order) {
      await closeSheet();
      const at = (await readFit(sf)).doors.find(x => x.k === k);
      const w = await sf.evaluate(k => BohemiaSettlement.where(k), k);   /* where() pans first; at the fit it must not move */
      if (at && w) await tapAt(w.x, w.y);
      if (await sf.evaluate(() => BohemiaSettlement.state.open) === k) landed++; else missed.push(k);
    }
    await closeSheet();
    ok('T3 ' + tag + ': every building opens with one real tap where it stands (' + landed + ' of ' + order.length + ')', landed === order.length, missed.join(', ') || 'all');
    /* T4: the board open */
    const wb = await sf.evaluate(() => BohemiaSettlement.where('board')); if (wb) await tapAt(wb.x, wb.y);
    await P.waitForTimeout(500);
    const t4 = await sf.evaluate(() => { const r = e => { const q = e.getBoundingClientRect(); return [q.x, q.y, q.width, q.height]; };
      const sh = document.getElementById('sheet'), x = document.getElementById('close'), rows = [...document.querySelectorAll('#sbody .act')].filter(e => { const q = e.getBoundingClientRect(); return q.height > 0 && q.bottom > sh.getBoundingClientRect().top && q.top < sh.getBoundingClientRect().bottom; });
      const l = document.getElementById('leave'), lr = l.getBoundingClientRect(), hit = document.elementFromPoint(lr.x + lr.width / 2, lr.y + lr.height / 2);
      return { open: BohemiaSettlement.state.open, sheet: r(sh), x: r(x), rows: rows.map(r), leave: r(l), leaveHit: !!hit && (hit === l || l.contains(hit)), hitWhat: hit ? (hit.id || hit.className || hit.tagName) : null, W: innerWidth, H: innerHeight }; });
    const f4 = await readFit(sf), PH = f4.phone;
    /* LEAVE: since UI TWO 52741663 (rules 238(a), 286(b)) the phone's own press with the phone up, the town's #leave off the glass;
       then it is checked where it is, the phone's LEAVE the top thing under its own middle; the town's own LEAVE (no phone) as before */
    const LV = await leaveAt(P, sf), lvPhone = !!LV && LV.who === 'phone';
    const lvTop = lvPhone ? await P.evaluate(([x, y]) => { const h = document.elementFromPoint(x, y), l = document.querySelector('#bohphone.on .bpctx.town .lv'); return !!h && !!l && (h === l || l.contains(h)); }, [LV.x, LV.y]) : false;
    /* a row is what shows of it: the sheet scrolls and clips its rows to its own rectangle */
    const clip = (q, r) => { const x0 = Math.max(q[0], r[0]), y0 = Math.max(q[1], r[1]), x1 = Math.min(q[0] + q[2], r[0] + r[2]), y1 = Math.min(q[1] + q[3], r[1] + r[3]); return [x0, y0, Math.max(0, x1 - x0), Math.max(0, y1 - y0)]; };
    t4.rows = t4.rows.map(q => clip(q, t4.sheet)).filter(q => q[2] > 0 && q[3] > 0);
    const away4 = await P.evaluate(() => !!document.querySelector('#bohphone.away'));
    const onGlass = q => q[0] >= -0.5 && q[1] >= -0.5 && q[0] + q[2] <= t4.W + 0.5 && q[1] + q[3] <= t4.H + 0.5;
    const sheetIn = onGlass(t4.sheet) && t4.sheet[0] >= f4.open[0] - 0.5 && t4.sheet[0] + t4.sheet[2] <= f4.open[0] + f4.open[2] + 0.5;   /* the whole sheet on the glass, in the open area (10/26: a wide glass once pushed it half off the left edge) */
    ok('*** T4 ' + tag + ': NOTHING UNDER THE PHONE *** (' + (away4 ? 'the phone stepped aside; ' : '') + 'the board open: the sheet ' + fmt(t4.sheet) + ', its X ' + fmt(t4.x) + ', ' + t4.rows.length + ' rows, LEAVE ' + (lvPhone ? 'on the phone' + (lvTop ? '' : ' (its middle is NOT LEAVE)') : fmt(t4.leave) + (t4.leaveHit ? '' : ' (its middle is NOT LEAVE: ' + t4.hitWhat + ')')) + '; the phone ' + fmt(PH) + '; open ' + t4.open + ')',
      t4.open === 'board' && (away4 ? onGlass(t4.sheet) && onGlass(t4.x) && t4.rows.length >= 1   /* the coordinator 10/27 (Paolo: 'the phone animated to the shop, so it's not there anymore'): the phone has stepped aside, the sheet takes the glass */
        : sheetIn && !!PH && apart(t4.sheet, PH) && apart(t4.x, PH) && t4.rows.every(q => apart(q, PH)) && onGlass(t4.x) && (lvPhone ? lvTop : apart(t4.leave, PH) && onGlass(t4.leave) && t4.leaveHit) && t4.rows.length >= 1));
    await closeSheet();
    /* T5: the phone on the left (his setting, UI TWO's phone: BohemiaPhone.setSide), the band follows at once */
    const flip = async (side) => { await sf.evaluate((side) => { try { if (window.BohemiaPhone && BohemiaPhone.setSide) BohemiaPhone.setSide(side); else { localStorage.setItem('bohemia.phone.v1', JSON.stringify({ side })); window.dispatchEvent(new Event('resize')); } } catch (e) {} }, side); await P.waitForTimeout(900); };
    await flip('left');
    const f5 = await readFit(sf), lv5 = await leaveAt(P, sf);
    const onLeft = !!f5.phone && f5.phone[0] < f.W / 2 && (lv5 && lv5.who === 'phone' || apart(f5.leave, f5.phone)) && f5.folk.every(x => x.who === 'crowd' || !inside(x.at, f5.phone)) && f5.doors.every(x => !inside(x.at, f5.phone));   /* __FOUR_LAYOUTS__: the picture runs under the phone; nobody tappable does */
    ok('T5 ' + tag + ': the phone flipped to the left, the town lays out of it at once (the phone ' + fmt(f5.phone) + ', LEAVE ' + (lv5 && lv5.who === 'phone' ? 'on the phone' : fmt(f5.leave)) + ', the picture ' + fmt(f5.pic) + ')', onLeft);
    await flip('right');
    /* T6: the band is UI TWO's own rectangle, read live (BOH_PHONE_RECT), never a guess, once the phone is in the game */
    const f6 = await readFit(sf), real = await sf.evaluate(() => { try { const r = BOH_PHONE_RECT(); return r && r.width > 0 ? [r.left, r.top, r.width, r.height] : null; } catch (e) { return null; } });
    ok('T6 ' + tag + ': the band is the phone\'s own rectangle (' + fmt(f6.phone) + ' against BOH_PHONE_RECT ' + fmt(real) + ')', !!real && !f6.guessed && f6.phone.every((v, i) => Math.abs(v - real[i]) < 1.5));
    if (process.env.BOHEMIA_SHOT_DIR) await P.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'town_fits_' + profile + '.png') });
  } catch (e) { ok(tag + ' legs ran [' + String(e.stack || e.message).slice(0, 300) + ']', false); }
  return d;
}

(async () => {
  for (const profile of ['phone_portrait', 'phone_landscape', 'computer']) {
    const d = await run(profile);
    ok('Z ' + profile + ': nothing threw', d.errs.length === 0, d.errs.slice(0, 2).join(' | '));
    await d.close();
  }
  done();
})();
