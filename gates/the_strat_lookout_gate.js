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
     T9 NO BILLBOARD (rule 464, Paolo 11/20): no board module or script on the page, the sight by a freeway the map's own; the node leg:
        no billboard file or include in any slice
     T10 to T13 (row 659, 11/21): on a valley whose Network town stands on the tower, the trip that ends at its gate climbs; see below
   Run: node gates/the_strat_lookout_gate.js [node|demo|alpha|demo-up|demo-side|alpha-up|alpha-side|town-demo|town-alpha] */
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
  if (!(city.indexOf('src="bohemia_the_strat.js"') > city.indexOf('src="bohemia_road_more.js"') && city.indexOf('src="bohemia_road_more.js"') > 0)) why.push('not loaded after the road');
  /* RULE 476(a) (Paolo 11/22: 'the footprints around the city are ugly as fuck'): no track drawing on any map, the file and its include gone */
  if (city.indexOf('bohemia_tracks_read.js') >= 0 || require('fs').existsSync(path.join(ROOT, 'slices', 'bohemia_tracks_read.js'))) why.push('the footprints are back');
  /* RULE 464 (Paolo 11/20: 'did u add some dogshit billboards wtf is that'): no board on any map, the file and its include gone */
  const fsx = require('fs'), slicesDir = path.join(ROOT, 'slices');
  const inc = fsx.readdirSync(slicesDir).filter(f => /\.html$/.test(f)).filter(f => /bohemia_billboards\.js/.test(fsx.readFileSync(path.join(slicesDir, f), 'utf8')));
  if (fsx.existsSync(path.join(slicesDir, 'bohemia_billboards.js')) || inc.length) why.push('a billboard is back (' + (inc.join(', ') || 'the file') + ')');
  ok('T1 the seam: wraps the arrival, the map\'s own clock and fog, no word; no billboard (rule 464) and no footprints (rule 476(a)) anywhere', !why.length, why.join(', ') || 'all');
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
    const nb = await fr.evaluate(() => { const o = { module: typeof window.BohemiaBillboards, scripts: [...document.scripts].filter(x => /billboard/i.test(x.src || '')).length };
      /* by a freeway the sight is the map's own (no board widens it) */
      let f = null; for (let y = 0; y < om.n && !f; y++) for (let x = 0; x < om.n && !f; x++) { const c = om.at(x, y); if (c && c.district === 'freeway' && !c.xing) f = [x, y]; }
      const was = window.isNight; window.isNight = () => false; const x0 = city.x, y0 = city.y;
      if (f) { city.x = f[0]; city.y = f[1]; o.atFreeway = fogRadius(); } window.isNight = was; city.x = x0; city.y = y0; return o; });
    ok(W + ' T9 NO BILLBOARD (rule 464): no board module, no board script, the sight by a freeway the map\'s own', nb.module === 'undefined' && nb.scripts === 0 && (nb.atFreeway == null || nb.atFreeway <= 9), JSON.stringify(nb));
    ok(W + ' T8 nothing threw', !errs.length && !r.err, (errs.slice(0, 2).join(' | ') || '') + (r.err || ''));
  } finally { await d.close(); }
}

/* ROW 659 (FOUND BY EYES 11/20, WORLD 15 11/21): on a valley where the Network's town stands on the tower (a new valley every game
   seats the Network on its own places, the tower among them; about 1 game in 13), a trip to the tower ended at the town's gate 2 blocks
   off and the crew never climbed; and MEASURED WITH A REAL FINGER, the map asks a town's plate and building first, so a finger on the
   needle walked to the town and opened it, and the climb never heard the tap. A staged code that seats it there (TOWN_CODE, its seat
   checked first, never assumed). EVERY TAP HERE IS A REAL CLICK ON THE GLASS at the map's near zoom, and the crew walks the map:
     T10 THE TOWN AT ITS FOOT: from the south, a finger on the needle (the block under it the tower's, off the town's name): the crew
         walks to the town's gate (more than 1 block off), climbs (90 minutes more than the walk, the fog 25 off opens), the town opens
     T11 STANDING THERE: the next day, from that gate, the finger on the needle again: the crew climbs at once, 90 minutes
     T12 NOTHING IS FORCED: the next day, from the south, a finger on the town's NAME: the walk, the town opens, nothing climbs
     T13 MUTATION: the lookout off, the finger on the needle climbs nothing
     T14 the map's own travel handed the tower's block (the phone's road, a script): the same gate, the same climb */
const TOWN_CODE = 'B35BT9';
async function atTheTownsFoot(alpha, profile) {
  const W = (alpha ? 'the alpha' : 'the demo') + ', ' + (profile === 'phone_landscape' ? 'sideways' : 'upright') + ', the town on the tower (' + TOWN_CODE + ')';
  console.log('\n-- ' + W + ' --');
  const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
  const arm = "try { if (!sessionStorage.getItem('__strat_staged')) { localStorage.setItem('bohemia.world.next.v1', '" + TOWN_CODE + "'); sessionStorage.setItem('__strat_staged', '1'); } } catch (e) {}";
  const d = await open(Object.assign({ profile, fog: true, arm }, alpha ? { alpha: true } : {}));
  const fr = d.fr, pg = d.page, errs = [];
  pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.BohemiaStrat && typeof om !== 'undefined' && om.n && typeof MODE !== 'undefined' && MODE === 'city'))) break; await pg.waitForTimeout(500); }
    try { await d.toMap(); } catch (e) {}
    await fr.evaluate(() => { if (typeof MODE !== 'undefined' && MODE !== 'city') { MODE = 'city'; try { updHud(); } catch (e) {} } });
    const r0 = await fr.evaluate(() => {
      const o = {}, ST = BohemiaStrat, c = ST.at(); o.c = c; o.code = window.__WORLD_SEED && __WORLD_SEED.code; if (!c) return o;
      try { loopClose(); } catch (e) {} try { if (window.BohemiaRoadEvents) { BohemiaRoadEvents.close(false); BohemiaRoadEvents.ON = false; } } catch (e) {}
      const bs = ctBases() || {}; let T = null; for (const k in bs) { const b = bs[k]; if (b && Math.max(Math.abs((b.x | 0) - c[0]), Math.abs((b.y | 0) - c[1])) <= 1) T = { name: k, x: b.x | 0, y: b.y | 0 }; }
      o.town = T; for (let dy = 6; dy < 14 && !o.south; dy++) if (cityWalkable(c[0], c[1] + dy)) o.south = [c[0], c[1] + dy];
      window.isNight = () => false; return o; });
    const seated = !!(r0.town && r0.c && r0.south);
    ok(W + ' the staged valley seats ' + ((r0.town && r0.town.name) || 'no town') + ' on the tower at ' + JSON.stringify(r0.c) + ' (code ' + r0.code + ')', seated && r0.code === TOWN_CODE, JSON.stringify(r0));
    if (!seated) return;
    const box = await (await fr.frameElement()).boundingBox();
    /* stand him somewhere, the camera on him at the near zoom; then the finger: 'needle' (the tower's block, off the name) or 'name' */
    const tap = async (from, where) => {
      await fr.evaluate((from) => { try { travelStop(); } catch (e) {} try { loopClose(); } catch (e) {} city.x = from[0]; city.y = from[1];
        try { setZoomAt(2, CVW / 2, CVH / 2); } catch (e) {} panX = 0; panY = 0; try { render(); } catch (e) {} }, from);
      await pg.waitForTimeout(900);
      const s = await fr.evaluate((where) => {
        const ST = BohemiaStrat, c = ST.at(), cvr = cv.getBoundingClientRect(); let hit = null;
        if (where === 'name') { const t = MAP_TOWN_HIT.filter(h => h.plate && Math.max(Math.abs(h.x - c[0]), Math.abs(h.y - c[1])) <= 1)[0]; if (t) hit = [t.plate.x + t.plate.w / 2, t.plate.y + t.plate.h / 2]; }
        else { const cand = []; for (let sy = 0; sy < CVH; sy += 3) for (let sx = 0; sx < CVW; sx += 3) { const q = CBcellAt(sx, sy); if (!q || q[0] !== c[0] || q[1] !== c[1]) continue;
            const w = mapTapWhich(sx, sy); if (w && w.what === 'town' && w.t.plate && mapIn(w.t.plate, sx, sy, 8)) continue; cand.push([sx, sy]); }
          if (cand.length) { cand.sort((a, b) => a[1] - b[1]); hit = cand[Math.floor(cand.length / 2)]; } }
        return { hit, client: hit ? [cvr.left + hit[0] * cvr.width / CVW, cvr.top + hit[1] * cvr.height / CVH] : null, what: hit ? ((mapTapWhich(hit[0], hit[1]) || {}).what || 'ground') : null,
          climbs: ST.climbs, mins: DAY.day * 1440 + DAY.min, taps: Object.assign({}, ST.taps) }; }, where);
      if (!s.client) return { from, where, nohit: true };
      await pg.mouse.click(box.x + s.client[0], box.y + s.client[1]);
      let e = null;
      for (let i = 0; i < 80; i++) { await pg.waitForTimeout(400);
        e = await fr.evaluate(() => ({ travel: !!TRAVEL, meet: !!(window.MEET && MEET.up), open: (typeof LOOP !== 'undefined' && LOOP.open && LOOP.open.name) || null }));
        if (e.meet) await fr.evaluate(() => { try { MEET_DONE(false); } catch (x) {} });
        if (!e.travel && e.open) break; if (!e.travel && i > 12) break; }
      const r = await fr.evaluate(() => { const ST = BohemiaStrat, c = ST.at(); return { at: [city.x, city.y], off: Math.max(Math.abs(city.x - c[0]), Math.abs(city.y - c[1])), climbs: ST.climbs,
        mins: DAY.day * 1440 + DAY.min, open: (typeof LOOP !== 'undefined' && LOOP.open && LOOP.open.name) || null, taps: Object.assign({}, ST.taps), last: ST.status().last, err: ST.err }; });
      await fr.evaluate(() => { try { loopClose(); } catch (e) {} });
      return { from, where, what: s.what, end: r.at, off: r.off, climbs: r.climbs - s.climbs, mins: r.mins - s.mins, open: r.open, aimed: r.taps.town - s.taps.town + r.taps.travel - s.taps.travel, err: r.err };
    };
    const nextDay = () => fr.evaluate(() => { DAY.day += 1; });
    /* T13 first: the lookout off */
    await fr.evaluate(() => { BohemiaStrat.on = false; }); const mut = await tap(r0.south, 'needle'); await fr.evaluate(() => { BohemiaStrat.on = true; });
    await nextDay();
    const probe = [r0.c[0] + 25, r0.c[1]], seen0 = await fr.evaluate((p) => fogSeen(p[0], p[1]), probe);
    const t10 = await tap(r0.south, 'needle'); t10.probe = { before: seen0, after: await fr.evaluate((p) => fogSeen(p[0], p[1]), probe) };
    await nextDay(); const t11 = t10.end ? await tap(t10.end, 'needle') : null;
    await nextDay(); const t12 = await tap(r0.south, 'name');
    await nextDay();
    const t14 = await fr.evaluate((from) => { const ST = BohemiaStrat, c = ST.at(); try { travelStop(); } catch (e) {} city.x = from[0]; city.y = from[1];
      const c0 = ST.climbs, m0 = DAY.day * 1440 + DAY.min; travelTo(0, 0, [c[0], c[1]]); const P = (TRAVEL && TRAVEL.path) || [], to = TRAVEL && TRAVEL.to, tn = TRAVEL && TRAVEL.town, end = P[P.length - 1];
      if (TRAVEL) { TRAVEL = null; city.x = end[0]; city.y = end[1]; try { loopArrived(to, tn); } catch (e) {} }
      try { loopClose(); } catch (e) {} return { end, off: end ? Math.max(Math.abs(end[0] - c[0]), Math.abs(end[1] - c[1])) : null, climbs: ST.climbs - c0, mins: DAY.day * 1440 + DAY.min - m0 }; }, r0.south);
    const T = r0.town.name;
    ok(W + ' T10 the finger on the needle from the south: the crew walked to ' + T + '\'s gate ' + t10.off + ' blocks off, climbed (' + t10.mins + ' minutes in all), the fog 25 off opened, ' + T + ' opened',
       t10.off > 1 && t10.climbs === 1 && t10.mins >= 90 && t10.probe.before === false && t10.probe.after === true && t10.open === T, JSON.stringify(t10));
    ok(W + ' T11 standing at the gate, the finger on the needle: the crew climbs at once, ' + (t11 && t11.mins) + ' minutes', t11 && t11.climbs === 1 && t11.mins === 90, JSON.stringify(t11));
    ok(W + ' T12 nothing is forced: the finger on ' + T + '\'s name walks there and opens it, nothing climbs (' + t12.mins + ' minutes, the walk)', t12.climbs === 0 && t12.open === T && t12.mins < 90, JSON.stringify(t12));
    ok(W + ' T13 MUTATION: the lookout off, the finger on the needle climbs nothing', mut.climbs === 0 && !mut.nohit && mut.mins < 90, JSON.stringify(mut));
    ok(W + ' T14 the map\'s own travel to the tower\'s block: ' + t14.off + ' blocks off, the same climb', t14.off > 1 && t14.climbs === 1 && t14.mins === 90, JSON.stringify(t14));
    const st = await fr.evaluate(() => BohemiaStrat.status());
    ok(W + ' nothing threw', !errs.length && !st.err && !t10.err, (errs.slice(0, 2).join(' | ') || '') + (st.err || '') + (t10.err || ''));
  } finally { await d.close(); }
}

(async () => {
  try { nodeChecks(); } catch (e) { ok('the node checks ran', false, String(e.stack || e.message).slice(0, 300)); }
  const only = process.argv[2];
  /* [node | demo | alpha | demo-up | demo-side | alpha-up | alpha-side | town-demo | town-alpha] */
  if (only !== 'node' && !/^town-/.test(only || '')) for (const [alpha, prof] of [[false, 'phone_portrait'], [false, 'phone_landscape'], [true, 'phone_portrait'], [true, 'phone_landscape']]) {
    if ((only === 'demo' && alpha) || (only === 'alpha' && !alpha)) continue;
    const tag = (alpha ? 'alpha' : 'demo') + '-' + (prof === 'phone_landscape' ? 'side' : 'up');
    if (only && /-(up|side)$/.test(only) && only !== tag) continue;
    try { await page(alpha, prof); } catch (e) { ok((alpha ? 'the alpha ' : 'the demo ') + prof + ' ran', false, String(e.stack || e.message).slice(0, 300)); }
  }
  /* row 659: the town on the tower, once on each page (upright; the trip and the arrival are the map's, not the screen's shape) */
  if (only !== 'node' && !/-(up|side)$/.test(only || '')) for (const alpha of [false, true]) {
    const which = alpha ? 'alpha' : 'demo';
    if (only && only !== which && only !== 'town-' + which) continue;
    try { await atTheTownsFoot(alpha, 'phone_portrait'); } catch (e) { ok('the ' + which + ', the town on the tower ran', false, String(e.stack || e.message).slice(0, 300)); }
  }
  console.log('\nTHE STRAT LOOKOUT: ' + (fail ? 'RED' : 'GREEN') + '  ' + pass + '/' + fail);
  process.exit(fail ? 1 : 0);
})();
