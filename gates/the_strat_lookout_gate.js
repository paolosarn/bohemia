#!/usr/bin/env node
/* THE STRAT LOOKOUT (WORLD 14, 11/20; rule 461: 'the world: more places to arrive at'; rule 441; rule 454(a): no words).
   slices/bohemia_the_strat.js: a trip to the tower he tapped, ended at its foot, climbs it (90 minutes on the map's own clock); from the top
   by day the fog opens 30 blocks round it, by night only the lit towns within 40 show; once a day; a trip that passes climbs nothing.
     T1 the seam: wraps the map's arrival, uses the map's own clock (advance) and fog (fogReveal), writes no word
     On the page (demo and alpha, upright and sideways):
     T2 the tower is on the valley (its own block)
     T3 BY DAY: arriving by it, the clock moves 90 minutes; a block 25 off, unseen before, is seen after; the ring 26 off is all seen,
        the ring 36 off is as it was (the view has an edge)
     T3b what he finds: more towns and real places are on his map after the climb than before
     T4 ONCE A DAY: a second arrival the same day moves no clock and opens nothing more
     T5 NOTHING IS FORCED: a trip to the block beside the tower (the street or the town at its foot) climbs nothing (no clock, no fog)
     T6 BY NIGHT: the next day after dark, the climb shows the towns within 40 and opens no dark ground between them
     T7 MUTATION: the lookout off, arriving by the tower opens nothing
     T8 nothing threw
   Run: node gates/the_strat_lookout_gate.js [node|demo|alpha|demo-up|demo-side|alpha-up|alpha-side] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + String(w).slice(0, 400) + ']' : '')); };
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

function nodeChecks() {
  const code = read('slices/bohemia_the_strat.js').replace(/\/\*[\s\S]*?\*\//g, ''), city = read('slices/BOHEMIA_CITY_WORLD.html');
  const why = [];
  if (!/root\.loopArrived = function \(to, town\)/.test(code)) why.push('does not wrap the arrival');
  if (!/root\.advance\(ST\.CLIMB_MINS\)/.test(code)) why.push('not the map\'s own clock');
  if (!/root\.fogReveal\(/.test(code)) why.push('not the map\'s own fog');
  if (/fillText|strokeText|innerHTML|textContent/.test(code)) why.push('writes words');
  if (!(city.indexOf('src="bohemia_the_strat.js"') > city.indexOf('src="bohemia_billboards.js"'))) why.push('not loaded after the billboards');
  ok('T1 the seam: wraps the arrival, the map\'s own clock and fog, no word', !why.length, why.join(', ') || 'all');
}

async function page(alpha, profile) {
  const W = (alpha ? 'the alpha' : 'the demo') + ', ' + (profile === 'phone_landscape' ? 'sideways' : 'upright');
  console.log('\n-- ' + W + ' --');
  const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
  const d = await open(Object.assign({ profile, fog: true }, alpha ? { alpha: true } : {}));
  const fr = d.fr, pg = d.page, errs = [];
  pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    for (let i = 0; i < 120; i++) { if (await fr.evaluate(() => !!(window.BohemiaStrat && typeof om !== 'undefined' && om.n && typeof MODE !== 'undefined' && MODE === 'city'))) break; await pg.waitForTimeout(500); }
    try { await d.toMap(); } catch (e) {}
    await fr.evaluate(() => { if (typeof MODE !== 'undefined' && MODE !== 'city') { MODE = 'city'; try { updHud(); } catch (e) {} } });
    const r = await fr.evaluate(() => {
      const o = {}, ST = BohemiaStrat;
      try { loopClose(); } catch (e) {} try { if (window.BohemiaRoadEvents) { BohemiaRoadEvents.close(false); BohemiaRoadEvents.ON = false; } } catch (e) {}
      const c = ST.at(); o.c = c; if (!c) return o; o.kind = (om.at(c[0], c[1]) || {}).district;
      const mins = () => DAY.day * 1440 + DAY.min;
      const nightWas = window.isNight;
      /* a trip as he takes one: the map's own travel to the block he tapped, then he stands where it ends and the map's arrival runs */
      const trip = (tx, ty) => { try { travelTo(0, 0, [tx, ty]); } catch (e) { o.err = String(e); } const P = (TRAVEL && TRAVEL.path) || []; const end = P[P.length - 1] || [tx, ty];
        try { TRAVEL.i = P.length; } catch (e) {} city.x = end[0]; city.y = end[1]; const m0 = mins(); try { loopArrived({ x: end[0], y: end[1] }, null); } catch (e) { o.err = String(e); } try { loopClose(); } catch (e) {} return mins() - m0; };
      const arrive = (x, y) => trip(c[0], c[1]);
      /* a probe block 25 off the tower, unseen before (on the side of the valley the tower faces) */
      const pick = () => { for (const [dx, dy] of [[25, 0], [-25, 0], [0, 25], [0, -25], [18, 18], [-18, 18], [18, -18], [-18, -18]]) { const x = c[0] + dx, y = c[1] + dy; if (x >= 0 && y >= 0 && x < om.n && y < om.n && !fogSeen(x, y)) return [x, y]; } return null; };
      /* T7 first (the lookout off): nothing opens */
      window.isNight = () => false; const p7 = pick(); ST.on = false; const m7 = arrive(c[0], c[1] + 1); o.mut = { mins: m7, opened: p7 ? fogSeen(p7[0], p7[1]) : null }; ST.on = true;
      /* T5: three blocks off, nothing */
      const p5 = pick(); const side = [[0, 1], [1, 0], [0, -1], [-1, 0]].map(q => [c[0] + q[0], c[1] + q[1]]).find(q => { const t = om.at(q[0], q[1]); return t && t.district !== 'strat'; }) || [c[0] + 1, c[1]];
      const m5 = trip(side[0], side[1]); o.far = { mins: m5, opened: p5 ? fogSeen(p5[0], p5[1]) : null, tapped: side };
      /* T3: by day */
      const p3 = pick(); o.p3 = p3; let ring0 = 0, ring1 = 0; const ring = []; for (let a = 0; a < 32; a++) { const x = Math.round(c[0] + 26 * Math.cos(a / 32 * 6.283)), y = Math.round(c[1] + 26 * Math.sin(a / 32 * 6.283)); if (x >= 0 && y >= 0 && x < om.n && y < om.n) ring.push([x, y]); }
      const outer = []; for (let a = 0; a < 48; a++) { const x = Math.round(c[0] + 36 * Math.cos(a / 48 * 6.283)), y = Math.round(c[1] + 36 * Math.sin(a / 48 * 6.283)); if (x >= 0 && y >= 0 && x < om.n && y < om.n) outer.push([x, y]); }
      ring.forEach(q => { if (fogSeen(q[0], q[1])) ring0++; }); const out0 = outer.filter(q => fogSeen(q[0], q[1])).length;
      const found = () => { const bs = ctBases(); return { towns: Object.keys(bs).filter(k => bs[k] && fogSeen(bs[k].x | 0, bs[k].y | 0)).length, places: (window.BOH_REAL_PLACES && BOH_REAL_PLACES.cellsNow ? BOH_REAL_PLACES.cellsNow() : []).filter(q => fogSeen(q.x, q.y)).length }; };
      const f0 = found();
      const m3 = arrive(c[0], c[1] + 1); o.found = { before: f0, after: found() }; ring.forEach(q => { if (fogSeen(q[0], q[1])) ring1++; }); const out1 = outer.filter(q => fogSeen(q[0], q[1])).length;
      o.day = { mins: m3, before: false, after: p3 ? fogSeen(p3[0], p3[1]) : null, ring: ring.length, ring0, ring1, outer: outer.length, out0, out1, last: ST.status().last };
      /* T4: again the same day */
      const p4 = (() => { for (let dx = 31; dx < 45; dx++) { const x = c[0] + dx, y = c[1]; if (x < om.n && !fogSeen(x, y)) return [x, y]; } return null; })();
      const m4 = arrive(c[0] - 1, c[1]); o.again = { mins: m4, opened: p4 ? fogSeen(p4[0], p4[1]) : false };
      /* T6: the next day, after dark */
      DAY.day += 1; window.isNight = () => true;
      const bs = ctBases(), T = Object.keys(bs).map(k => bs[k]).filter(Boolean).map(b => [b.x | 0, b.y | 0]).filter(t => Math.max(Math.abs(t[0] - c[0]), Math.abs(t[1] - c[1])) <= 40);
      /* a dark block between, far from every town */
      let dark = null; for (let y = 0; y < om.n && !dark; y++) for (let x = 0; x < om.n && !dark; x++) if (!fogSeen(x, y) && Math.hypot(x - c[0], y - c[1]) > 31 && Math.hypot(x - c[0], y - c[1]) < 40 && T.every(t => Math.hypot(t[0] - x, t[1] - y) > 4)) dark = [x, y];
      const m6 = arrive(c[0], c[1] - 1);
      o.night = { mins: m6, towns: T.length, shown: T.filter(t => fogSeen(t[0], t[1])).length, dark, darkSeen: dark ? fogSeen(dark[0], dark[1]) : null, last: ST.status().last };
      window.isNight = nightWas;
      return o; });
    ok(W + ' T2 the tower is on the valley, its own block', !!r.c && r.kind === 'strat', JSON.stringify({ at: r.c, kind: r.kind }));
    ok(W + ' T3 by day: arriving by it, ' + (r.day && r.day.mins) + ' minutes on the clock; a block 25 off seen after; ' + (r.day && r.day.ring1) + ' of ' + (r.day && r.day.ring) + ' on the ring 26 off seen (' + (r.day && r.day.ring0) + ' before); the ring 36 off as it was (' + (r.day && r.day.out0) + ' then ' + (r.day && r.day.out1) + ')',
       r.day && r.day.mins === 90 && r.day.after === true && r.day.ring1 === r.day.ring && r.day.ring0 < r.day.ring && r.day.out1 === r.day.out0, JSON.stringify(r.day));
    ok(W + ' T3b what he finds from the top: towns ' + (r.found && r.found.before.towns) + ' to ' + (r.found && r.found.after.towns) + ', real places ' + (r.found && r.found.before.places) + ' to ' + (r.found && r.found.after.places) + ' on his map',
       r.found && (r.found.after.towns + r.found.after.places) > (r.found.before.towns + r.found.before.places), JSON.stringify(r.found));
    ok(W + ' T4 once a day: again the same day, ' + (r.again && r.again.mins) + ' minutes, nothing more opens', r.again && r.again.mins === 0 && r.again.opened === false, JSON.stringify(r.again));
    ok(W + ' T5 nothing is forced: a trip to the block beside it, ' + (r.far && r.far.mins) + ' minutes, nothing opens', r.far && r.far.mins === 0 && r.far.opened === false, JSON.stringify(r.far));
    ok(W + ' T6 by night: ' + (r.night && r.night.shown) + ' of ' + (r.night && r.night.towns) + ' towns within 40 show, the dark between stays dark', r.night && r.night.mins === 90 && r.night.towns > 0 && r.night.shown === r.night.towns && r.night.darkSeen === false, JSON.stringify(r.night));
    ok(W + ' T7 MUTATION: the lookout off, nothing opens and no clock moves', r.mut && r.mut.mins === 0 && r.mut.opened === false, JSON.stringify(r.mut));
    ok(W + ' T8 nothing threw', !errs.length && !r.err, (errs.slice(0, 2).join(' | ') || '') + (r.err || ''));
  } finally { await d.close(); }
}

(async () => {
  try { nodeChecks(); } catch (e) { ok('the node checks ran', false, String(e.stack || e.message).slice(0, 300)); }
  const only = process.argv[2];
  if (only !== 'node') for (const [alpha, prof] of [[false, 'phone_portrait'], [false, 'phone_landscape'], [true, 'phone_portrait'], [true, 'phone_landscape']]) {
    if ((only === 'demo' && alpha) || (only === 'alpha' && !alpha)) continue;
    const tag = (alpha ? 'alpha' : 'demo') + '-' + (prof === 'phone_landscape' ? 'side' : 'up');
    if (only && /-(up|side)$/.test(only) && only !== tag) continue;
    try { await page(alpha, prof); } catch (e) { ok((alpha ? 'the alpha ' : 'the demo ') + prof + ' ran', false, String(e.stack || e.message).slice(0, 300)); }
  }
  console.log('\nTHE STRAT LOOKOUT: ' + (fail ? 'RED' : 'GREEN') + '  ' + pass + '/' + fail);
  process.exit(fail ? 1 : 0);
})();
