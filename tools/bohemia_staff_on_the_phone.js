#!/usr/bin/env node
// STAFF [the staff fight too] 11/21 -- VAMILY rule 468 ON HIS PHONE (rule 441: the page he plays, upright and sideways, started the way he
// starts it). A NEW CREW, his camp three (the cook, the scout, the surgeon, written to the camp's book before the page's scripts, the one
// shortcut, said), a road crew off the town through the one driver; on the fight's own page:
//   P1 every camp follower stands behind his back row, none in the front column, none beside a man of theirs
//   P2 each in his own body (a fight sheet of his own look) and face (on the fight's face strip), his tent drawn over him
//   P3 the cap: his fighters plus his camp no more than the origin's 12
//   P4 no page scroll sideways (the top page and the fight's own)
//   P5 the fight's first ten seconds, frames a second (PLUMBER's bar: 60, the frame clock of this box's software canvas said with it)
//   P6 the cook struck down in the fight dies, and after the fight the camp's own book has her gone: has('cook') false, her face on the dead list
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
    /* P6: the cook struck down on the board, the fight won the way the jobs' tools end one (their men down), the spoils left by a finger */
    row.fall = await c.evaluate(() => { const u = FIGHT.S.units.filter(v => v.staff && v.staffId === 'cook')[0]; if (!u) return null; FIGHT._t.fall(u, null); return { dead: !!u.dead, down: !!u.down }; });
    await c.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); });
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
    P6: !!(row.fall && row.fall.dead && row.after && row.after.hasCook === false && (row.after.dead || []).some(x => x.id === 'cook')), P7: !row.err && !errs.length };
  console.log('  ' + TAG + ' ' + shape + ': ' + (row.err ? 'ERR ' + row.err + ' ' : '') + 'fighters ' + B.fighters + ' + camp ' + st.length + ' of ' + B.cap + ' | ' +
    st.map(s => s.name + ' @' + s.x + ',' + s.y + (s.sheet ? '' : ' NO SHEET') + (s.face ? '' : ' NO FACE')).join('; ') + ' | cols ' + JSON.stringify(B.cols) +
    ' | fps ' + (row.frames && row.frames.fps) + ' worst ' + (row.frames && row.frames.worstMs) + ' ms | after: ' + JSON.stringify(row.after && { camp: row.after.camp, hasCook: row.after.hasCook, lost: row.after.lost }) +
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
