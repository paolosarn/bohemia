#!/usr/bin/env node
/* ============================================================================
   OVER THE MOUNTAIN GATE (WORLD 11/2 round 3, ask line 288)

   PAOLO 11/2: 'I should be able to walk over the mountains, right? You have it like an impenetrable wall, I have to walk around
   the whole city just to get across the mountains... that's how Battle Brothers does it, any time there's difficult terrain
   you're just slower to walk across.' (__OVER_THE_MOUNTAIN__, slices/BOHEMIA_CITY_WORLD.html, slices/bohemia_region.js,
   engine/BOHEMIA_REGION_LAND.json's speeds.mountain and pass code 4.)
   On the demo, through the one driver, from the same road block every run (64,78):
     M1 THE GROUND IS THE GOING: a valley mountain block and a region peak can be stood on; a mountain block's minutes are 3 times
        open ground's and 6 times a road's; the lake is still a wall
     M2 THE ROUTE WEIGHS IT: the trip west to Pahrump crosses the mountains and is quicker than the old walls' route; every trip's
        mountain blocks are taken only where they pay (the trip to Mt Charleston Lodge keeps the road round, quicker)
     M3 THE GLASS SHOWS THE PACE: a mountain block takes 3 of the walk's steps, a road one; the glide's time for it is 3 times
     M4 MUTATION: TERRAIN_GOING off, the mountain is a wall again (so M1 bites)
     P1 THE PASSES JOIN (ask line 303, rule 310, __THE_PASSES__): from every real road's portal on the valley's box, the way in to the
        valley's middle crosses no mountain block; with the cuts undone it does, or goes round (so P1 bites)
     P2 PAHRUMP TAKES NV-160: no mountain block, and quicker than with the cuts undone
     M5 nothing threw
   AMENDED with the passes (ask line 303): M2 now reads a trip straight over the rim far from any pass (the mountain taken there because it
   is quicker than the way round by a pass), since Pahrump's own trip now takes its pass road.
   ============================================================================ */
'use strict';
const path = require('path');
const { open } = require(path.join(path.dirname(__dirname), 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
function trips(){
  city.x = 64; city.y = 78; try { CITY_GLIDE.tx = null; } catch (_e) {}
  const R = BOH_REGION, kindAt = (x, y) => { if (x >= 0 && y >= 0 && x < om.n && y < om.n) { const t = om.at(x, y); return t ? t.district : '?'; }
    const a = R.land.at(x, y, R.compass); return a ? (a.peak ? 'peak' : a.code) : '?'; };
  const out = {};
  ['PAHRUMP', 'MT CHARLESTON LODGE'].forEach(nm => { const P = R.places.filter(p => p.name === nm)[0]; const pa = P && cityRoute(city.x, city.y, P.x, P.y);
    if (!pa) { out[nm] = null; return; } let mins = 0, mt = 0; for (let i = 1; i < pa.length; i++) { mins += cityStepMins(pa[i][0], pa[i][1]); const k = kindAt(pa[i][0], pa[i][1]); if (k === 'mountain' || k === 'peak') mt++; }
    out[nm] = { blocks: pa.length - 1, hours: +(mins / 60).toFixed(2), mt }; });
  return out;
}
(async () => {
  const d = await open({ fog: false }); const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.BOH_REGION && BOH_REGION.ready && BOH_REGION.real && BOH_REGION.places && BOH_REGION.places.length))) break; await page.waitForTimeout(500); }
    const g = await fr.evaluate(() => {
      const N = om.n; let mv = null, rd = null, lake = null; for (let y = 0; y < N && !(mv && rd && lake); y++) for (let x = 0; x < N; x++) { const t = om.at(x, y); if (!t) continue;
        if (!mv && t.district === 'mountain') mv = [x, y]; if (!rd && t.district === 'arterial') rd = [x, y]; if (!lake && t.district === 'water') lake = [x, y]; }
      const R = BOH_REGION; let pk = null; for (let y = -R.K; y < R.N + R.K && !pk; y++) for (let x = -R.K; x < R.N + R.K; x++) { if (x >= 0 && y >= 0 && x < N && y < N) continue; const a = R.land.at(x, y, R.compass); if (a && a.peak) { pk = [x, y]; break; } }
      const open = (() => { for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const t = om.at(x, y); if (t && t.district === 'desert') return [x, y]; } return null; })();
      return { mvWalk: cityWalkable(mv[0], mv[1]), pkWalk: !!pk && cityWalkable(pk[0], pk[1]), lakeWall: !lake || !cityWalkable(lake[0], lake[1]),
        mMin: cityStepMins(mv[0], mv[1]), rMin: cityStepMins(rd[0], rd[1]), oMin: open ? cityStepMins(open[0], open[1]) : null,
        pkMin: pk ? cityStepMins(pk[0], pk[1]) : null, beatsM: mapGoingBeats(mv[0], mv[1]), beatsR: mapGoingBeats(rd[0], rd[1]), beatsP: pk ? mapGoingBeats(pk[0], pk[1]) : null };
    });
    const now = await fr.evaluate(trips);
    /* P1, P2 and M2: the passes, with the cuts and with them undone */
    const PS = await fr.evaluate(() => {
      const R = BOH_REGION, N = om.n, C = R.compass, mk = (x, y) => { if (x >= 0 && y >= 0 && x < N && y < N) { const t = om.at(x, y); return !!t && t.district === 'mountain'; } const a = R.land.at(x, y, C); return !!(a && a.peak); };
      const mid = (() => { let b = null, bd = 1e9; for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const t = om.at(x, y); if (!t || !CITY_PAVED[t.district]) continue; const d = Math.abs(x - N / 2) + Math.abs(y - N / 2); if (d < bd) { bd = d; b = [x, y]; } } return b; })();
      const cost = (a, b) => { const pa = cityRoute(a[0], a[1], b[0], b[1]); if (!pa) return null; let m = 0, mt = 0; for (let i = 1; i < pa.length; i++) { m += cityStepMins(pa[i][0], pa[i][1]); if (mk(pa[i][0], pa[i][1])) mt++; } return { h: +(m / 60).toFixed(2), mt, blocks: pa.length - 1 }; };
      const portals = R.land.portals(C).map(p => ({ road: p.road, at: [p.x, p.y] }));
      const cuts = []; for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const t = om.at(x, y); if (t && t.passRoad) cuts.push(t); }
      const run = () => { const pin = portals.map(p => Object.assign({ road: p.road }, cost(p.at, mid) || { h: null, mt: null }));
        const P = R.places.filter(p => p.name === 'PAHRUMP')[0]; return { pin, pah: cost([64, 78], [P.x, P.y]) }; };
      const withCuts = run();
      cuts.forEach(t => { t.__d = t.district; t.district = t.passWas; }); VB_STF.seed = null;
      const undone = run();
      TERRAIN_GOING.on = false; const walls = run(); TERRAIN_GOING.on = true;   /* M2: no pass at NV-160 and the walls back: the way round */
      /* M2: a trip straight over the rim far from any pass: the rim block farthest from every cut and portal, west or east */
      let far = null, fd = -1;
      for (const x of [0, N - 1]) for (let y = 4; y < N - 4; y++) { const t = om.at(x, y); if (!t || t.district !== 'mountain') continue;
        let d = 1e9; portals.forEach(p => { d = Math.min(d, Math.abs(p.at[0] - x) + Math.abs(p.at[1] - y)); }); if (d > fd) { fd = d; far = [x, y]; } }
      cuts.forEach(t => { t.district = t.__d; delete t.__d; }); VB_STF.seed = null;
      let m2 = null;
      if (far) { const out = [far[0] === 0 ? -4 : N + 3, far[1]], dx = far[0] === 0 ? 1 : -1; let inn = null;
        for (let k = 0; k < N && !inn; k++) { const t = om.at(far[0] + dx * k, far[1]); if (t && CITY_PAVED[t.district]) inn = [far[0] + dx * k, far[1]]; }
        if (inn && cityWalkable(out[0], out[1])) { const a = cost(inn, out); TERRAIN_GOING.on = false; const b = cost(inn, out); TERRAIN_GOING.on = true; m2 = { from: inn, to: out, over: a, round: b }; } }
      return { withCuts, undone, walls, cuts: cuts.length, passes: R.passes, m2, mid };
    });
    const old = await fr.evaluate((f) => { TERRAIN_GOING.on = false; const r = eval('(' + f + ')')(); r.wall = !cityWalkable(...(function(){ for (let y = 0; y < om.n; y++) for (let x = 0; x < om.n; x++) { const t = om.at(x, y); if (t && t.district === 'mountain') return [x, y]; } })()); TERRAIN_GOING.on = true; return r; }, trips.toString());
    const P = now['PAHRUMP'], Po = old['PAHRUMP'], C = now['MT CHARLESTON LODGE'];
    ok('M1 THE GROUND IS THE GOING: a mountain and a peak are ground, slow; the lake a wall', g.mvWalk && g.pkWalk && g.lakeWall && Math.abs(g.mMin / g.oMin - 3) < 1e-6 && Math.abs(g.mMin / g.rMin - 6) < 1e-6,
       'mountain ' + g.mMin.toFixed(1) + ' min a block, open ' + (g.oMin && g.oMin.toFixed(1)) + ', road ' + g.rMin.toFixed(1) + ', a peak out there ' + (g.pkMin && g.pkMin.toFixed(1)));
    const Uo = PS.undone.pah, Wl = PS.walls.pah;
    ok('M2 THE ROUTE WEIGHS IT: with no pass at NV-160, Pahrump goes over the mountain because it is quicker than the way round', Uo && Wl && Uo.mt > 0 && Wl.mt === 0 && Uo.h < Wl.h,
       'over ' + (Uo && (Uo.blocks + ' blocks ' + Uo.h + ' h, ' + Uo.mt + ' mountain')) + '; the walls\' way round ' + (Wl && (Wl.blocks + ' blocks ' + Wl.h + ' h')));
    ok('M3 THE GLASS SHOWS THE PACE: a mountain block 3 steps of the walk, a road 1, a peak 3', g.beatsM === 3 && g.beatsR === 1 && g.beatsP === 3, g.beatsM + ' / ' + g.beatsR + ' / ' + g.beatsP);
    ok('M4 MUTATION: the going off, the mountain is a wall again', old.wall, 'wall ' + old.wall);
    const W = PS.withCuts, U = PS.undone, inMt = W.pin.filter(p => p.mt === 0).length, unMt = U.pin.filter((p, i) => p.mt == null || p.mt > 0 || (W.pin[i].h != null && p.h > W.pin[i].h + 1e-6)).length;
    ok('P1 THE PASSES JOIN: from every real road\'s portal, the way in crosses no mountain; undone, they do or go round', W.pin.every(p => p.h != null) && inMt === W.pin.length && unMt >= 4,
       inMt + ' of ' + W.pin.length + ' portals in with no mountain (' + W.pin.map(p => p.road + ' ' + p.mt).join(', ') + '); ' + PS.cuts + ' rim blocks cut; undone ' + unMt + ' cross the mountain or go round');
    ok('P2 PAHRUMP TAKES NV-160: no mountain block, quicker than with the cuts undone', W.pah && U.pah && W.pah.mt === 0 && W.pah.h < U.pah.h,
       'with the passes ' + (W.pah && (W.pah.blocks + ' blocks ' + W.pah.h + ' h, ' + W.pah.mt + ' mountain')) + '; undone ' + (U.pah && (U.pah.blocks + ' blocks ' + U.pah.h + ' h, ' + U.pah.mt + ' mountain')));
    ok('M5 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | ') || 'clean');
  } catch (e) { fail++; console.log('  FAIL threw: ' + String(e && e.stack || e).slice(0, 400)); }
  await d.close();
  console.log('\nOVER THE MOUNTAIN: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
