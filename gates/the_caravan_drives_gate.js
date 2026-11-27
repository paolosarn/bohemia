#!/usr/bin/env node
/* ============================================================================
   THE CARAVAN DRIVES (WORLD 16 11/27, VAMILY rule 494(d), Paolo 11/27: 'I haven't seen one caravan quest... go from one city to
   another'; the rule: 'the caravan is a truck that follows his party town to town on the clock and raiders come for it on the road';
   records/BOHEMIA_WORLD_SIXTEEN_THE_CARAVAN_DRIVES_11_27_26.md).

   MEASURED BEFORE (the demo, main a7a8d6fb2): the escort job's cargo was one 54 x 44 picture of the truck facing south-west, 26
   points wide, jumping a whole block at a time a block behind him; the raiders two men frozen mid-stride facing the camera, jumping a
   block at a time; through downtown the towers hid all but a sliver of the truck.

     V1 THE SHEET: the voted truck's eight facings packed from DIRECTION's renders (each source file's bytes as the bake read them, so a
        re-render reads stale), every cell inside the atlas, its ground point inside its cell, under 1 MB decoded
     V2 THE TRUCK ROLLS BEHIND HIM (the board's own escort offer taken in the town he starts in, the travel order to where it goes, the
        1x pace): drawn on most frames of the journey as the truck (not the old picture), never more than four blocks behind the block
        the job puts it on (the glide trails the clock like every party's; measured 1.7 to 3.2 blocks over four runs on this box: a
        slow frame swallows beats and the journey pays them back as a burst of blocks, and the glide's step is capped at 120 ms a frame;
        past four would be the glide's cut), never more than half a block between two frames (it glides; the old way jumped a whole block), facing the way it rolls
        (the facing agrees with its own motion on the frames it moves), at least two facings over the route
     V3 THE RAIDERS COME ON THE ROAD: the job's band appears, is drawn walking on some frame, facing him, and its drawn place closes on
        him; the raiders' card stands (the fight's door, as before)
     V4 PLANTED: MAP_CARAVAN.on = false: the truck is not drawn (the old picture is: the cargo still counted)
     V5 THE ALPHA ON ITS SIDE: the truck drawn behind him on the road, nothing threw on either page

   Run: node gates/the_caravan_drives_gate.js     (about 3 minutes)
   ============================================================================ */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (name, cond, info) => { if (cond) pass++; else fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name + (info ? '  [' + info + ']' : '')); return cond; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function boot(d) {
  const fr = d.fr;
  for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.om && om.n && window.MAP_CARAVAN && window.BohemiaJobKinds && BohemiaJobKinds.ready && BohemiaJobKinds.ready() && window.BohemiaBoardShelf)).catch(() => false)) break; await sleep(400); }
  for (let i = 0; i < 20; i++) { const t = await fr.evaluate(() => !!(window.LOOP && LOOP.frame && LOOP.frame.style.display === 'block')).catch(() => false); if (!t && i > 6) break; if (t) await fr.evaluate(() => loopClose()).catch(() => {}); await sleep(500); }
  await fr.evaluate(() => { mapCaravanSheet(); render(); });
  for (let i = 0; i < 60; i++) { if (await fr.evaluate(() => MAP_CARAVAN.state >= 2 && !rigWaiting())) break; await sleep(300); }
}
/* the board's own escort offer, taken as 'Take it' hands it to the map; the travel order to where it goes at 1x; every animation frame
   the map drew sampled (the truck and the raiders as drawn) until the raiders' card stands or 40 s */
const ride = (fr) => fr.evaluate(() => new Promise((res) => {
  const o = BohemiaBoardShelf.shelf().offers.filter((x) => BohemiaJobKinds.kindOf(x) === 'haul-caravan')[0];
  if (!o) return res({ none: true });
  loopTakeContract(Object.assign({}, o, { says: String(o.says).replace(/\{pay\}/g, o.pay) }));
  const j = LOOP.held.filter((h) => h.id === o.id)[0]; if (!j) return res({ none: true, took: false });
  try { loopClose(); } catch (e) {}
  try { travelSpeedSet(1); } catch (e) {}
  travelTo(0, 0, [j.target.x, j.target.y]);
  const F = [], t0 = performance.now(); let seen = -1, DR = null;
  const step = () => {
    /* only a frame the map drew (its own journey draws every frame; a second draw asked in a frame is moved on), read as it drew it */
    if ((ONE_RENDER.drawn | 0) === seen || MAP_DREW === DR) { if (performance.now() - t0 < 40000) { requestAnimationFrame(step); return; } }
    seen = ONE_RENDER.drawn | 0; DR = MAP_DREW;
    const jj = LOOP.held.filter((h) => h.id === o.id)[0];
    F.push({ t: Math.round(performance.now() - t0), truck: MAP_DREW.truck ? Object.assign({}, MAP_DREW.truck) : null, cargo: MAP_DREW.cargo | 0, raiders: MAP_DREW.raiders ? Object.assign({}, MAP_DREW.raiders) : null,
      block: jj && jj.trail && jj.trail.length >= 2 ? jj.trail[jj.trail.length - 2].slice() : null, raid: jj && jj.raid ? [jj.raid.x, jj.raid.y] : null, me: [city.x, city.y], card: !!(window.MEET && MEET.up), travel: !!TRAVEL });
    const last = F[F.length - 1];
    if ((last.card && F.filter((x) => x.card).length > 20) || performance.now() - t0 > 40000 || (!last.travel && !last.card && F.length > 60 && !last.raid)) return res({ id: o.id, title: o.title, dest: j.dest.name, F });
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}));

(async () => {
  /* V1: the sheet */
  try {
    const J = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_rig/map_caravan_truck.json'), 'utf8'));
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'], [AW, AH] = J.size;
    const inside = dirs.every((d) => { const c = J.cells[d]; return c && c[0] >= 0 && c[1] >= 0 && c[0] + c[2] <= AW && c[1] + c[3] <= AH && c[4] >= 0 && c[4] <= c[2] && c[5] >= 0 && c[5] <= c[3]; });
    const fresh = dirs.every((d) => { try { return fs.statSync(path.join(ROOT, J.source.dir, 'rig_' + d + '.png')).size === J.source.bytes[d]; } catch (e) { return false; } });
    ok('V1 THE SHEET: the voted truck\'s eight facings, every cell and its ground point inside, the sources as baked, ' + J.decoded_mb + ' MB decoded', inside && fresh && J.decoded_mb < 1 && fs.existsSync(path.join(ROOT, 'slices/fight_rig/' + 'map_caravan_truck.webp')));
  } catch (e) { ok('V1 THE SHEET reads [' + String(e.message).slice(0, 100) + ']', false); }

  /* ---- the demo upright ---- */
  let d; const errs = [];
  try { d = await open({ keepCards: true, profile: 'phone_portrait' }); } catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); }
  if (d) {
    d.page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
    const fr = d.fr;
    try {
      await boot(d);
      const R = await ride(fr);
      if (R.none) ok('an escort offer on the board of the town he starts in', false, JSON.stringify(R));
      else {
        const F = R.F, rolling = F.filter((f) => f.block && !f.card), drawn = rolling.filter((f) => f.truck);
        let far = 0, farMost = 0, jump = 0, faceOk = 0, faceN = 0; const faces = new Set();
        for (let i = 0; i < F.length; i++) {
          const f = F[i]; if (!f.truck || !f.block) continue;
          faces.add(f.truck.face);
          const off = Math.max(Math.abs(f.truck.at[0] - f.block[0]), Math.abs(f.truck.at[1] - f.block[1])); farMost = Math.max(farMost, off); if (off > 4.01) far++;
          const p = F[i - 1]; if (!p || !p.truck) continue;
          const dx = f.truck.at[0] - p.truck.at[0], dy = f.truck.at[1] - p.truck.at[1];
          if (Math.max(Math.abs(dx), Math.abs(dy)) > 0.5) jump++;
          if (Math.abs(dx) + Math.abs(dy) > 0.02) { faceN++; const want = { '1,0': 'SE', '0,1': 'SW', '1,1': 'S', '1,-1': 'E', '-1,0': 'NW', '0,-1': 'NE', '-1,-1': 'N', '-1,1': 'W' }[Math.sign(Math.round(dx * 50)) + ',' + Math.sign(Math.round(dy * 50))];
            if (want === f.truck.face) faceOk++; }
        }
        const old = rolling.filter((f) => f.cargo && !f.truck).length, dts = F.slice(1).map((f, i) => f.t - F[i].t).sort((x, y) => x - y), midDt = dts.length ? dts[dts.length >> 1] : 0;
        ok('V2 THE TRUCK ROLLS BEHIND HIM ("' + R.title + '" to ' + R.dest + '): drawn as the truck on ' + drawn.length + ' of ' + rolling.length + ' frames (the old picture ' + old + '), the most it trails its block ' + farMost.toFixed(2) + ' blocks (over four: ' + far + '; this box\'s frames ' + midDt + ' ms the middle), a jump over half a block between frames ' + jump + ', facing its motion ' + faceOk + ' of ' + faceN + ', facings ' + [...faces].join(' '),
          rolling.length >= 30 && drawn.length >= rolling.length * 0.8 && far === 0 && jump === 0 && faceN >= 5 && faceOk >= faceN * 0.8 && faces.size >= 2);
        const rf = F.filter((f) => f.raiders), walking = rf.filter((f) => f.raiders.walking), facing = rf.filter((f) => { const want = { '1,0': 'SE', '0,1': 'SW', '1,1': 'S', '1,-1': 'E', '-1,0': 'NW', '0,-1': 'NE', '-1,-1': 'N', '-1,1': 'W' }[Math.sign(Math.round(f.me[0] - f.raiders.at[0])) + ',' + Math.sign(Math.round(f.me[1] - f.raiders.at[1]))]; return !want || want === f.raiders.face; });
        const dist = (f) => Math.max(Math.abs(f.raiders.at[0] - f.me[0]), Math.abs(f.raiders.at[1] - f.me[1]));
        const closes = rf.length >= 2 && dist(rf[rf.length - 1]) < dist(rf[0]);
        const card = F.some((f) => f.card);
        ok('V3 THE RAIDERS COME ON THE ROAD: drawn on ' + rf.length + ' frames, walking on ' + walking.length + ', facing him on ' + facing.length + ', ' + (rf.length ? dist(rf[0]).toFixed(1) + ' blocks off at first, ' + dist(rf[rf.length - 1]).toFixed(1) + ' at the last' : 'never') + '; the raiders\' card ' + (card ? 'stands' : 'never came'),
          rf.length >= 3 && walking.length >= 1 && facing.length >= rf.length * 0.8 && closes && card);
      }
      /* V4 planted */
      const P = await fr.evaluate(() => { MAP_CARAVAN.on = false; MAP_DREW.truck = null; MAP_DREW.cargo = 0; render(); const r = { truck: !!MAP_DREW.truck, cargo: MAP_DREW.cargo | 0, held: LOOP.held.length }; MAP_CARAVAN.on = true; return r; });
      ok('V4 PLANTED: the truck off, it is not drawn (the old picture ' + P.cargo + ', the job held ' + P.held + ')', !P.truck);
    } catch (e) { ok('the demo legs ran [' + String(e.message).slice(0, 160) + ']', false); }
    ok('V5a nothing threw on the demo', errs.length === 0, errs[0] || '');
    await d.close();
  }

  /* ---- the alpha on its side ---- */
  let a; const errs2 = [];
  try { a = await open({ keepCards: true, profile: 'phone_landscape', alpha: true }); } catch (e) { ok('the alpha boots [' + String(e.message).slice(0, 120) + ']', false); }
  if (a) {
    a.page.on('pageerror', (e) => errs2.push(String(e).slice(0, 160)));
    try {
      await boot(a);
      const R = await ride(a.fr);
      const n = R.F ? R.F.filter((f) => f.truck && !f.card).length : 0;
      ok('V5 THE ALPHA ON ITS SIDE: the truck drawn behind him on ' + n + ' frames of the road, nothing threw', !R.none && n >= 20 && errs2.length === 0, errs2[0] || (R.none ? 'no escort offer' : ''));
    } catch (e) { ok('the alpha legs ran [' + String(e.message).slice(0, 160) + ']', false); }
    await a.close();
  }
  console.log('\nTHE CARAVAN DRIVES: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
