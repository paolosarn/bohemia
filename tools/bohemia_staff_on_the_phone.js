#!/usr/bin/env node
// STAFF [the staff fight too] 11/21 -- VAMILY rule 468 ON HIS PHONE (rule 441: the page he plays, upright and sideways, started the way he
// starts it). A NEW CREW, his camp three (the cook, the scout, the surgeon, written to the camp's book before the page's scripts, the one
// shortcut, said), a road crew off the town through the one driver; on the fight's own page:
//   P1 every camp follower stands behind his back row, none in the front column, none beside a man of theirs
//   P2 each in his own body (a fight sheet of his own look) and face (on the fight's face strip), his tent drawn over him
//   P3 the cap: his fighters plus his camp no more than the origin's 12
//   P4 no page scroll sideways (the top page and the fight's own)
//   P5 the fight's first ten seconds, frames a second (PLUMBER's bar: 60, the frame clock of this box's software canvas said with it)
//   P6 after the fight the camp's own book matches the board: every camp person who died there is gone (his face on the dead list), every one
//      who lived is kept (a lost fight's living are taken)
//   P8 THEY FIGHT LIKE STAFF (rule 470(a)): AUTO plays the fight to its end on the glass; every turn a camp person ends is read: one of theirs
//      beside him, two or more (circled), one of theirs round his back, behind his line
//   P7 nothing threw
// Writes <out>/staff_<tag>.json and the pictures.
// node tools/bohemia_staff_on_the_phone.js [--alpha] [--shapes phone_portrait,phone_landscape] [--out dir]
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const ALPHA = process.argv.indexOf('--alpha') > 0, CODE = arg('--code', 'K7QM9X');   /* one valley, so the camp and its control meet the same road and the same board */
const SHAPES = arg('--shapes', 'phone_portrait,phone_landscape').split(','), OUTD = path.resolve(ROOT, arg('--out', 'records/target/staff_11_21')), TAG = (ALPHA ? 'alpha' : 'demo') + (process.argv.indexOf('--control') > 0 ? '_control' : '');
fs.mkdirSync(OUTD, { recursive: true });
const CONTROL = process.argv.indexOf('--control') > 0, CAMP = CONTROL ? [] : ['cook', 'scout', 'surgeon'];   /* --control: the same walk with no camp (the frame clock's control) */

async function walk(shape) {
  const arm = "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', '" + CODE + "');" +
    " var c = JSON.parse(localStorage.getItem('bohemia.camp.v1') || 'null') || { cart: 0, retinue: [] }; if (!c.__staffProof) { c.retinue = " + JSON.stringify(CAMP) + "; c.__staffProof = 1; localStorage.setItem('bohemia.camp.v1', JSON.stringify(c)); } } catch (e) {}";
  const d = await drive.open({ profile: shape, alpha: ALPHA, fog: false, keepCards: true, arm });
  const page = d.page, errs = [], row = { shape, surface: TAG, camp: CAMP.slice() };
  page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  const short = shape === 'phone_portrait' ? 'upright' : 'sideways';
  try {
    await page.waitForTimeout(2500);
    const c = await drive.roadFightOffTheTown(d);
    if (!c) throw new Error('no road fight stood');
    /* the frame clock from the moment the board stands */
    await c.evaluate(() => { window.__SF = { n: 0, t0: performance.now(), gaps: [] }; let last = performance.now();
      const tick = (t) => { const S = window.__SF; S.n++; S.gaps.push(t - last); last = t; if (t - S.t0 < 10000) requestAnimationFrame(tick); else S.t1 = t; }; requestAnimationFrame(tick); });
    await page.waitForTimeout(1500);
    row.bell = await c.evaluate(() => {
      const S = FIGHT.S, mine = S.units.filter(u => u.side === 'you'), st = mine.filter(u => u.staff), back = S.cols[0] - 1;
      const faces = ((DB.rig.faces && DB.rig.faces.order) || []).concat(((DB.rig.faces && DB.rig.faces.more) || []).reduce((a, M) => a.concat(M.order || []), []));   /* every strip: the first, faces_more, the camp's */
      return { cols: S.cols, w: S.w, h: S.h, cap: S.fieldCap, fighters: mine.filter(u => !u.staff).length, reserve: (S.reserve || []).length, raid: S.raid,
        staff: st.map(u => ({ id: u.staffId, name: u.name, look: u.look, x: u.x, y: u.y, morale: u.morale, hp: u.hp, trait: (u.traits || [])[0] || null,
          behind: u.x < back, front: u.x === S.cols[0], beside: S.units.some(t => t.side === 'them' && Math.max(Math.abs(t.x - u.x), Math.abs(t.y - u.y)) === 1),
          sheet: !!(DB.rig.looks && DB.rig.looks[u.look]), face: faces.indexOf(u.look) >= 0 })) };
    });
    row.scroll = { top: await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), fight: await c.evaluate(() => document.documentElement.scrollWidth - innerWidth) };
    await page.waitForTimeout(9000);
    row.frames = await c.evaluate(() => { const S = window.__SF, ms = (S.t1 || performance.now()) - S.t0, g = S.gaps.slice(1).sort((a, b) => a - b);
      return { fps: +(1000 * S.n / ms).toFixed(1), worstMs: Math.round(g[g.length - 1] || 0), p95Ms: Math.round(g[Math.floor(g.length * 0.95)] || 0) }; });
    /* the line-up as he sees it, once the way in has played (the board is up, nothing has moved: he sets his line first) */
    row.tents = await c.evaluate(() => FIGHT.S.units.filter(u => u.staff).map(u => !!u._camp));
    /* where each of them is on the glass (his bars' rim, the fight frame's own points, plus the frame's place on the page), for the card's close-up */
    { const fh = await page.$('#fightFrame'), fb = fh ? await fh.boundingBox() : null, iw = await c.evaluate(() => [innerWidth, innerHeight]);
      row.onGlass = await c.evaluate(() => FIGHT.S.units.filter(u => u.side === 'you').map(u => ({ staff: !!u.staff, name: u.name, bar: u._bar ? { x: u._bar.x, y: u._bar.y } : null })));
      if (fb) row.onGlass.forEach(g => { if (g.bar) { g.px = fb.x + g.bar.x * fb.width / iw[0]; g.py = fb.y + g.bar.y * fb.height / iw[1]; } });
      row.view = await page.evaluate(() => [innerWidth, innerHeight]); }
    row.png_bell = path.relative(ROOT, path.join(OUTD, TAG + '_' + short + '_the_camp_at_the_bell.png')); await page.screenshot({ path: path.join(ROOT, row.png_bell) });
    /* P8 THEY FIGHT LIKE STAFF (rule 470(a)): AUTO plays the fight to its end on the glass (the page's own AUTO, its own beat); at the end
       of every turn a camp person takes, what stands round him: one of theirs beside him, two or more (circled), one of theirs round his back */
    if (!CONTROL) await c.evaluate(() => { const F = FIGHT, aim = F.aiStep, d = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
      window.__STAFF_TURNS = { n: 0, beside: 0, circled: 0, behind: 0, behindLine: 0 };
      F.aiStep = function (u) { if (u && u.staff && F.S.round >= 2 && !window.__STAFF_CAM) window.__STAFF_CAM = { round: F.S.round, id: u.id, name: u.name };   /* the camera goes to the man who acts: one of the camp, for the picture */
        const r = aim.apply(this, arguments);
        try { if (u && u.staff && F.current() !== u && F.onField(u) && u.morale !== 'Fleeing') { const S = F.S, T = window.__STAFF_TURNS;
          const th = S.units.filter(v => v.side === 'them' && F.onField(v) && v.morale !== 'Fleeing'), mine = S.units.filter(v => v.side === 'you' && !v.staff && F.onField(v) && v.morale !== 'Fleeing');
          if (th.length) { T.n++; const b = th.filter(t => d(t, u) === 1).length; if (b) T.beside++; if (b > 1) T.circled++; if (th.some(t => t.x < u.x && d(t, u) <= 3)) T.behind++;
            const xs = mine.map(m => m.x).sort((p, q) => p - q); if (xs.length && u.x < xs[Math.floor((xs.length - 1) / 2)]) T.behindLine++; } } } catch (e) {}
        return r; };
      FIGHT_UI.auto = true; });
    if (!CONTROL) { const t1 = Date.now(); while (Date.now() - t1 < 240000 && !(await c.evaluate(() => FIGHT.S.over).catch(() => true))) { await page.waitForTimeout(1000);
        /* the picture in the middle of it: the first turn of one of his camp from round two, the camera on him, the camp where its own brain put it */
        if (!row.png_auto && await c.evaluate(() => !!window.__STAFF_CAM && !FIGHT.S.over).catch(() => false)) { await page.waitForTimeout(700);
          row.autoCam = await c.evaluate(() => window.__STAFF_CAM);
          const fh = await page.$('#fightFrame'), fb = fh ? await fh.boundingBox() : null, iw = await c.evaluate(() => [innerWidth, innerHeight]);
          row.autoGlass = await c.evaluate(() => FIGHT.S.units.filter(u => FIGHT.onField(u)).map(u => ({ staff: !!u.staff, side: u.side, name: u.name, bar: u._bar ? { x: u._bar.x, y: u._bar.y } : null })));
          if (fb) row.autoGlass.forEach(g => { if (g.bar) { g.px = fb.x + g.bar.x * fb.width / iw[0]; g.py = fb.y + g.bar.y * fb.height / iw[1]; } });
          row.png_auto = path.relative(ROOT, path.join(OUTD, TAG + '_' + short + '_the_camp_on_its_turn.png')); await page.screenshot({ path: path.join(ROOT, row.png_auto) }); } }
      row.auto = await c.evaluate(() => ({ over: FIGHT.S.over, result: FIGHT.S.result, rounds: FIGHT.S.round, turns: window.__STAFF_TURNS,
        staff: FIGHT.S.units.filter(u => u.staff).map(u => ({ id: u.staffId, dead: !!u.dead, fled: !!u.fled, hp: u.hp })) })); }
    else await c.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); });
    let sf = null; const t0 = Date.now();
    while (Date.now() - t0 < 25000 && !sf) { const h = await page.$('#spoilsdoor iframe'); const f = h && await h.contentFrame(); if (f && await f.evaluate(() => !!document.getElementById('leave')).catch(() => false)) sf = f; else await page.waitForTimeout(400); }
    if (sf) { await page.waitForTimeout(900); const h = await page.$('#spoilsdoor iframe'), hb = await h.boundingBox();
      const b = await sf.evaluate(() => { const e = document.getElementById('leave'); const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2, innerWidth, innerHeight]; });
      await page.touchscreen.tap(hb.x + b[0] * hb.width / b[2], hb.y + b[1] * hb.height / b[3]); }
    await page.waitForTimeout(2500);
    row.after = await page.evaluate(() => { let C = null; try { C = document.getElementById('cityFrame').contentWindow.BohemiaCamp; } catch (e) {}
      return { lost: window.__NF_STAFF_LOST || null, handed: window.__NF_STAFF || null, camp: C ? C.retinue() : null, hasCook: C ? C.has('cook') : null, dead: C ? C.dead() : null }; });
    row.png_after = path.relative(ROOT, path.join(OUTD, TAG + '_' + short + '_after.png')); await page.screenshot({ path: path.join(ROOT, row.png_after) });
  } catch (e) { row.err = String(e && e.message || e).slice(0, 300); row.errAt = String(e && e.stack || '').split('\n').slice(0, 3).join(' | ').slice(0, 300); }
  row.errs = errs.slice(0, 6);
  const B = row.bell || { staff: [] }, st = B.staff;
  row.P = CONTROL ? { P5: !!row.frames && row.frames.fps > 0, P7: !row.err && !errs.length } : { P1: st.length === CAMP.length && st.every(s => s.behind && !s.front && !s.beside), P2: st.length > 0 && st.every(s => s.sheet && s.face) && !!row.tents && row.tents.every(Boolean),
    P3: B.fighters + st.length <= (B.cap || 12), P4: !!row.scroll && row.scroll.top <= 0 && row.scroll.fight <= 0, P5: !!row.frames && row.frames.fps > 0,
    P6: !!(row.after && row.auto && row.auto.over && row.auto.staff.every(m => (m.dead ? !(row.after.camp || []).includes(m.id) && (row.after.dead || []).some(x => x.id === m.id) : row.auto.result !== 'won' || (row.after.camp || []).includes(m.id)))),
    P8: !!(row.auto && row.auto.over && row.auto.turns && row.auto.turns.n > 0), P7: !row.err && !errs.length };
  console.log('  ' + TAG + ' ' + shape + ': ' + (row.err ? 'ERR ' + row.err + ' ' : '') + 'fighters ' + B.fighters + ' + camp ' + st.length + ' of ' + B.cap + ' | ' +
    st.map(s => s.name + ' @' + s.x + ',' + s.y + (s.sheet ? '' : ' NO SHEET') + (s.face ? '' : ' NO FACE')).join('; ') + ' | cols ' + JSON.stringify(B.cols) +
    ' | fps ' + (row.frames && row.frames.fps) + ' worst ' + (row.frames && row.frames.worstMs) + ' ms | AUTO: ' + JSON.stringify(row.auto && { result: row.auto.result, rounds: row.auto.rounds, turns: row.auto.turns, dead: row.auto.staff.filter(m => m.dead).map(m => m.id) }) + ' | after: ' + JSON.stringify(row.after && { camp: row.after.camp, lost: row.after.lost }) +
    ' | ' + Object.keys(row.P).map(k => k + (row.P[k] ? ' ok' : ' RED')).join(' ') + (errs.length ? ' | errors ' + errs.join(' / ') : ''));
  await d.close().catch(() => {});
  return row;
}

(async () => {
  const rows = []; for (const s of SHAPES) rows.push(await walk(s));
  fs.writeFileSync(path.join(OUTD, 'staff_' + TAG + '.json'), JSON.stringify(rows, null, 1));
  const red = rows.some(r => Object.values(r.P || {}).some(v => !v));
  console.log(red ? 'THE STAFF ON THE PHONE: RED' : 'THE STAFF ON THE PHONE: green');
  process.exit(red ? 1 : 0);
})();
