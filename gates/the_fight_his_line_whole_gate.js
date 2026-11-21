#!/usr/bin/env node
/* HIS LINE WHOLE (COMBAT FOUR 11/21, FIGHT SCREEN 3's find routed to the camera's lane; rules 104a, 288(b), his NO ATARI vote;
   records/BOHEMIA_COMBAT_FOUR_HIS_LINE_WHOLE_11_21_26.md).
   MEASURED BEFORE (tools/bohemia_fight_screen_the_walk.js, the alpha upright, a pack): while he sets his line the two lines stood
   eleven tiles apart and the glass held twelve at the far stop (the NO ATARI floor: never further out, never a smaller man), so
   the frame centred between them cut both ends: two of his men and one of theirs 6 points past the glass, their bars cut, while
   DESI says 'Drag a man to where you want him'.
   The fight page upright (390 by 844, the phone up in its right corner the way the shell puts it up), a fight by hand in the
   lineup (three of his against a pack of three, as the walk met it); his men stood on his zone's first column and theirs on the far side so the far stop cannot hold both lines.
   LEGS:
   1. THE CASE ARISES: the frame the camera aims at is at its far stop and the two lines do not fit in the open area.
   2. HIS LINE WHOLE: every one of his men's whole figure (his box and what he carries, 0.3 of his height either side: the
      fight's own allFramed measure) inside the open area, once the camera has landed.
   3. ONLY AS FAR AS IT MUST: the frame slid off the centre between the lines by no more than his outermost man needed (a point
      and a half of slack), and theirs take what does not fit.
   4. A FRAME THAT HOLDS EVERYONE IS NEVER TOUCHED: their line brought in so both fit, the frame is the centred one again.
   PLANTED: the slide taken out (the frame centred between the lines as before): leg 2 turns red.
   node gates/the_fight_his_line_whole_gate.js   (about 40 s) */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const PHONE_UP = (side) => {
  const r = BOH_PHONE_RECT(), W = innerWidth, flip = side && side !== r.side, left = flip ? W - r.left - r.width : r.left;
  BohemiaPhone._paint({ on: true, side: side || r.side, screen: 'fight', rect: { left: left, top: r.top, right: left + r.width, bottom: r.bottom, width: r.width, height: r.height, cls: r.cls } });
  return BOH_PHONE_RECT();
};
/* in the page: stand his men on his zone's first column and theirs `gap` columns past it, each on a free floor tile */
const STAND = (gap) => {
  const S = FIGHT.S, T = FIGHT._t, z = T.zoneCols(), x0 = Math.min.apply(null, z), taken = {};
  const put = (v, x) => { for (let d = 0; d < S.h; d++) for (const y of [v.y + d, v.y - d]) { if (y < 0 || y >= S.h || taken[x + ',' + y] || !T.passable(x, y)) continue; taken[x + ',' + y] = 1; v.x = x; v.y = y; return true; } return false; };
  const placed = S.units.filter(v => FIGHT.onField(v)).map(v => put(v, v.side === 'you' ? x0 : Math.min(S.w - 1, x0 + gap)));
  return { x0: x0, w: S.w, h: S.h, placed: placed.every(Boolean) };
};
/* in the page: where the camera stands, and each man's figure against the open area */
const READ = () => {
  const h = manH(), f = h * FIG_HALF, o = OPEN, men = FIGHT.S.units.filter(v => FIGHT.onField(v) && FIGHT.shown(v)).map(v => { const b = manBox(v.x, v.y);
    return { s: v.side, out: Math.max(o.l - (b.x - f), (b.x + f) - o.r, o.t - b.head, b.feet - o.b) }; });
  let x0 = Infinity, x1 = -Infinity; FIGHT.S.units.filter(v => FIGHT.onField(v)).forEach(v => { const c = v.x + .5 + stagger(v.y); x0 = Math.min(x0, c); x1 = Math.max(x1, c); });
  const span = (x1 - x0) * FIGHT_UI.tw + manH(FIGHT_UI.zoom) / FIGHT_UI.zoom * BODY_HALF * 2 + FRAME_TILES * FIGHT_UI.tw;
  return { z: FIGHT_UI.zoom, lo: FIGHT_UI.coverFar || FIGHT_UI.far, glide: !!FIGHT_UI.glide, deploy: !!FIGHT.S.deploy, cx: FIGHT_UI.cx, mid: (x0 + x1) / 2 * FIGHT_UI.tw,
    overflow: span > o.w / FIGHT_UI.zoom * 1.01, his: men.filter(m => m.s === 'you').map(m => +m.out.toFixed(1)), theirs: men.filter(m => m.s !== 'you').map(m => +m.out.toFixed(1)) };
};

async function lineup(plant) {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait',
    arm: 'try{localStorage.setItem("bohemia.phone.v1",JSON.stringify({side:"right"}))}catch(e){};window.FIGHT_OPTS={seed:5,speed:1,kind:"suburb",cap:3,party:{faction:"beasts",count:3,days:1}}' });
  const p = d.page, ev = (f, a) => p.evaluate(f, a), errs = [];
  p.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
  const until = async (fn, ms) => { const t = Date.now(); while (Date.now() - t < ms) { if (await p.evaluate(fn).catch(() => false)) return true; await p.waitForTimeout(60); } return false; };
  await until(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && FIGHT.S.deploy, 40000);
  await ev(PHONE_UP, 'right');
  await until(() => performance.now() > (FIGHT_UI.openUntil || 0) && !FIGHT_UI.glide, 8000);
  if (plant) await ev(() => { window.hisLineWhole = function (f) { return f; }; });
  const s = await ev(STAND, 11);
  await p.waitForTimeout(400); await until(() => !FIGHT_UI.glide, 4000); await p.waitForTimeout(300);
  const a = await ev(READ);
  let b = null;
  if (!plant) { await ev(STAND, 6); await p.waitForTimeout(400); await until(() => !FIGHT_UI.glide, 4000); await p.waitForTimeout(300); b = await ev(READ); }
  await d.close();
  return { s, a, b, errs };
}

(async () => {
  const R = await lineup(false), A = R.a;
  const atFar = A.z <= A.lo * 1.005;
  ok('1. THE CASE ARISES: upright, in the lineup, the lines eleven tiles apart, the frame at its far stop and the two lines wider than the open area',
    R.s.placed && A.deploy && atFar && A.overflow, 'board ' + R.s.w + 'x' + R.s.h + ', zoom ' + A.z.toFixed(3) + ' (far stop ' + A.lo.toFixed(3) + '), overflow ' + A.overflow);
  ok('2. HIS LINE WHOLE: every one of his men\'s whole figure inside the open area', A.his.length > 0 && A.his.every(v => v <= 1), 'his men past the open area by ' + A.his.join(', ') + ' points (0 or less is on the glass); theirs ' + A.theirs.join(', '));
  const slid = (A.mid - A.cx) * A.z, outer = Math.max.apply(null, A.his);
  ok('3. ONLY AS FAR AS IT MUST: slid off the centre between the lines by what his outermost man needed, theirs take the rest', Math.abs(slid) > 0.5 && outer >= -2.5 && A.theirs.some(v => v > 1),
    'slid ' + slid.toFixed(1) + ' points; his outermost man ' + (-outer).toFixed(1) + ' points inside the edge, theirs past it by up to ' + Math.max.apply(null, A.theirs).toFixed(1));
  const B = R.b;
  ok('4. A FRAME THAT HOLDS EVERYONE IS NEVER TOUCHED: their line six tiles off, the frame centred between the lines and every man on the glass',
    B && !B.overflow && Math.abs((B.mid - B.cx) * B.z) <= 2 && B.his.concat(B.theirs).every(v => v <= 1), B ? 'off the centre ' + ((B.mid - B.cx) * B.z).toFixed(1) + ' points, past the open area ' + B.his.concat(B.theirs).join(', ') : 'not read');
  ok('nothing thrown', !R.errs.length, R.errs.slice(0, 2).join(' | ') || 'none');
  const P = await lineup(true);
  ok('PLANTED: the slide taken out (centred between the lines as before): leg 2 turns red', P.a.overflow && P.a.his.some(v => v > 1), 'his men past the open area by ' + P.a.his.join(', '));
  console.log('\n=== THE FIGHT HIS LINE WHOLE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('FATAL', String(e && e.stack || e).slice(0, 400)); process.exit(1); });
