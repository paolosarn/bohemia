#!/usr/bin/env node
/* ============================================================================
   THE CITY GOES TO WORK (WORLD 16 11/27, VAMILY rule 485(b)(c), Paolo 11/26: 'Lets go cyberpunk vibes but their world has a running
   economy vibes!'; records/BOHEMIA_WORLD_SIXTEEN_THE_CITY_GOES_TO_WORK_11_27_26.md).

   MEASURED BEFORE (the demo, main 278d7afe0): the valley's twelve crowds stood three a crowd at every hour, day and night; a caravan
   looked like a patrol (two men, no load); nobody collected from anybody. The money ran in the stall (ECONOMY THREE's day) and the
   rent ledger, and nothing on the map showed it.

     C1 THE PLAN: the routes are found in idle time (more than one slice, no slice a frame's worth: under 50 ms even counting a phone
        slowed four times from this box's full-speed time for the longest piece one slice cannot split, the plan under 60 ms in all), at least half the crowds walk to a town, every
        walk a chain of walkable blocks a step apart that ends at a town's edge, none over 150 minutes, the minutes rising block by block
     C2 THE DAY (the whole valley on the glass): 06:00 everybody home (three a crowd); 07:40 people on the road; noon the walkers in
        town (nobody on the road, the crowd thinned); 17:30 walking home; 23:00 everybody home again. At every hour the crowd's own
        count holds: those at home and those out make three a crowd (THE MAP HAS ITS PEOPLE's three)
     C3 THE WALK: a walker drawn between two hours stands on his walk's blocks, and later in the morning he is further along it
     C4 THE COLLECTOR: at about 20:20 the gangs' collectors are out (at least one at a door), and none at noon
     C5 THE WAGON: a caravan out pulls its wagon loaded, one coming home pulls it empty (the map's own count of what it drew)
     C6 THE SAME HOUR, THE SAME STREET: two draws at the same minute put every walker on the same block
     C7 PLANTED: MAP_WORK.on = false: everybody home at 07:40 (C2 red); MAP_WORK.wagon = false: no wagon (C5 red)
     C8 the alpha on its side: people on the road at 07:40, the counts holding; nothing threw on either page

   Run: node gates/the_city_goes_to_work_gate.js     (about 3 minutes)
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (name, cond, info) => { if (cond) pass++; else fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name + (info ? '  [' + info + ']' : '')); return cond; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function boot(d) {
  const fr = d.fr;
  for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.om && om.n && window.VBC && typeof travelTo === 'function' && window.MAP_WORK)).catch(() => false)) break; await sleep(400); }
  for (let i = 0; i < 20; i++) { const t = await fr.evaluate(() => !!(window.LOOP && LOOP.frame && LOOP.frame.style.display === 'block')).catch(() => false); if (!t && i > 6) break; if (t) await fr.evaluate(() => loopClose()).catch(() => {}); await sleep(500); }
  await fr.evaluate(() => { if (typeof MODE !== 'undefined' && MODE !== 'city') { try { swapMode(); } catch (e) {} } try { travelStop(); } catch (e) {} render(); });
  for (let i = 0; i < 80; i++) { if (await fr.evaluate(() => { render(); return !!MAP_WORK.plan && !rigWaiting(); })) break; await sleep(300); }
}
/* the whole valley at an hour: the counts the draw made */
const at = (fr, hm) => fr.evaluate((m) => { DAY.min = m; T.min = m; const zb = zoomBounds(); setZoomAt(zb[0]); try { camHold(); } catch (e) {} render(); render();
  const a = MAP_DREW.art || {}; return { m, crowds: MAP_DREW.crowds | 0, home: a.crowdPeople | 0, out: a.crowdOut | 0, road: a.commuting | 0, work: a.atWork | 0, coll: a.collectors | 0, door: a.collecting | 0,
    wagons: a.wagons | 0, loads: (a.wagonLoads || []).slice(), workAt: Object.assign({}, MAP_DREW.workAt || {}), err: MAP_DREW.workErr || null }; }, hm[0] * 60 + hm[1]);
const three = (r) => r.crowds > 0 && r.home + r.out === r.crowds * 3;
const say = (r) => String(Math.floor(r.m / 60)).padStart(2, '0') + ':' + String(r.m % 60).padStart(2, '0') + ' ' + r.crowds + ' crowds, ' + r.home + ' home, ' + r.out + ' out (' + r.road + ' on the road, ' + r.work + ' at work), ' + r.coll + ' collectors (' + r.door + ' at a door)';

(async () => {
  /* ---- the demo upright ---- */
  let d; const errs = [];
  try { d = await open({ keepCards: true, profile: 'phone_portrait' }); } catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); console.log('\n' + pass + ' passed, ' + fail + ' failed'); process.exit(1); }
  d.page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  const fr = d.fr;
  try {
    await boot(d);
    /* C1: the plan, built again from nothing with each slice timed */
    const P = await fr.evaluate(() => new Promise((res) => {
      const S = [], og = mapWorkBuildLater; let n = 0;
      MAP_WORK.key = null; MAP_WORK.plan = null; MAP_WORK.build = null;
      const t0 = performance.now(); mapWorkPlan();
      const wait = () => { if (MAP_WORK.plan) { const pl = MAP_WORK.plan, N = om.n | 0;
          const walks = pl.homes.filter((h) => h.work).map((h) => { const w = h.work; let chain = true, rising = true;
            for (let i = 1; i < w.length; i++) { if (Math.max(Math.abs(w[i][0] - w[i - 1][0]), Math.abs(w[i][1] - w[i - 1][1])) !== 1 || !cityWalkable(w[i][0], w[i][1])) chain = false; if (!(w[i][2] > w[i - 1][2])) rising = false; }
            const e = w[w.length - 1], edge = turfSeats().some((s) => Math.max(Math.abs(s.x - e[0]), Math.abs(s.y - e[1])) <= 1);
            return { chain, rising, edge, mins: e[2], start: w[0][0] === h.cx && w[0][1] === h.cy }; });
          res({ ms: MAP_WORK.ms, slices: MAP_WORK.slices, unit: MAP_WORK.unit, homes: pl.homes.length, walks, wall: Math.round(performance.now() - t0) }); }
        else if (++n < 200) setTimeout(wait, 50); else res(null); };
      wait();
    }));
    if (!P) ok('C1 THE PLAN is found', false, 'no plan in 10 s');
    else {
      const bad = P.walks.filter((w) => !(w.chain && w.rising && w.edge && w.start && w.mins <= 150));
      ok('C1 THE PLAN: found in idle time in ' + P.slices + ' slices (' + P.ms + ' ms in all at full speed; the longest piece a slice cannot split ' + P.unit + ' ms, ' + Math.round(P.unit * 4) + ' ms slowed 4x); ' + P.walks.length + ' of ' + P.homes + ' crowds walk to a town, every walk a chain of walkable blocks from their block to a town\'s edge, the minutes rising, none over 150 (the longest ' + Math.round(Math.max(...P.walks.map((w) => w.mins))) + ')',
        P.slices >= 2 && P.ms < 60 && P.unit * 4 < 50 && P.walks.length * 2 >= P.homes && bad.length === 0, bad.length ? JSON.stringify(bad[0]) : '');
    }
    /* C2: the day */
    const r6 = await at(fr, [6, 0]), r7 = await at(fr, [7, 40]), r12 = await at(fr, [12, 0]), r17 = await at(fr, [17, 30]), r23 = await at(fr, [23, 0]);
    [r6, r7, r12, r17, r23].forEach((r) => console.log('       ' + say(r)));
    ok('C2 THE DAY: 06:00 all home; 07:40 people on the road; noon the walkers in town, nobody on the road; 17:30 walking home; 23:00 all home; three a crowd at every hour',
      r6.out === 0 && r6.home === r6.crowds * 3 && r7.road >= 3 && r12.road === 0 && r12.work >= 4 && r12.home < r12.crowds * 3 && r17.road >= 2 && r23.out === 0 && [r6, r7, r12, r17, r23].every(three));
    /* C3: the walk, later further along */
    const w1 = await at(fr, [7, 0]), w2 = await at(fr, [7, 30]);
    const plan = await fr.evaluate(() => { const o = {}; MAP_WORK.plan.homes.forEach((h) => { if (h.work) o[h.px + ',' + h.py] = h.work.map((c) => [c[0], c[1]]); }); return o; });
    let onWalk = 0, all = 0, further = 0, both = 0;
    for (const k in w1.workAt) {
      const m = /^work:(\d+,\d+):\d$/.exec(k); if (!m) continue; const W = plan[m[1]]; if (!W) continue; all++;
      const ix = (p) => W.findIndex((c) => c[0] === p[3] && c[1] === p[4]);   /* the block the clock puts him on */
      const near = (p) => W.some((c) => Math.max(Math.abs(c[0] - p[0]), Math.abs(c[1] - p[1])) <= 1.01);   /* and where the glide draws him: within a block of his walk */
      if (ix(w1.workAt[k]) >= 0 && near(w1.workAt[k])) onWalk++;
      if (w2.workAt[k]) { both++; if (ix(w2.workAt[k]) >= ix(w1.workAt[k])) further++; }
    }
    ok('C3 THE WALK: every walker drawn at 07:00 stands on his walk (' + onWalk + ' of ' + all + '), and at 07:30 none is further back (' + further + ' of ' + both + ' drawn both times)', all >= 2 && onWalk === all && both >= 1 && further === both);
    /* C4: the collector */
    const c20 = await at(fr, [20, 25]), c12 = r12;
    ok('C4 THE COLLECTOR: at 20:25 ' + c20.coll + ' out, ' + c20.door + ' at a door; at noon ' + c12.coll, c20.coll >= 1 && c20.door >= 1 && c12.coll === 0);
    /* C5: the wagon (the parties stepped out on their business, the wagon's sheet in) */
    await fr.evaluate(() => { try { partiesAdvance(300); } catch (e) {} mapWagonSheet(); });
    for (let i = 0; i < 40; i++) { if (await fr.evaluate(() => MAP_WORK.w.state >= 2)) break; await sleep(250); }
    const legs = await fr.evaluate(() => (partiesAll() || []).filter((q) => q.agenda === 'caravan').map((q) => BohemiaParties.legOf(q)));
    const wv = await at(fr, [11, 0]);
    const full = wv.loads.filter((l) => l !== 'empty').length, empty = wv.loads.filter((l) => l === 'empty').length;
    ok('C5 THE WAGON: ' + wv.wagons + ' caravans drawn with their wagon (' + full + ' loaded, ' + empty + ' empty; the caravans\' legs ' + legs.join(' ') + ')',
      wv.wagons >= 2 && full >= 1 && (empty >= 1 || legs.indexOf('back') < 0));
    /* C6: the same hour, the same street */
    const s1 = await at(fr, [7, 40]), s2 = await at(fr, [7, 40]);
    const same = Object.keys(s1.workAt).every((k) => s2.workAt[k] && s2.workAt[k][3] === s1.workAt[k][3] && s2.workAt[k][4] === s1.workAt[k][4] && s2.workAt[k][2] === s1.workAt[k][2]);
    ok('C6 THE SAME HOUR, THE SAME STREET: two draws at 07:40 put all ' + Object.keys(s1.workAt).length + ' walkers on the same blocks', Object.keys(s1.workAt).length >= 3 && same);
    /* C7: planted */
    const p1 = await fr.evaluate(() => { MAP_WORK.on = false; return 1; }).then(() => at(fr, [7, 40]));
    await fr.evaluate(() => { MAP_WORK.on = true; MAP_WORK.wagon = false; });
    const p2 = await at(fr, [11, 0]);
    await fr.evaluate(() => { MAP_WORK.wagon = true; });
    ok('C7 PLANTED: the work off, at 07:40 ' + p1.road + ' on the road and ' + p1.out + ' out (C2 red); the wagon off, ' + p2.wagons + ' wagons (C5 red)', p1.road === 0 && p1.out === 0 && p2.wagons === 0);
    ok('C8a nothing threw on the demo', errs.length === 0 && !r7.err && !wv.err, errs[0] || r7.err || wv.err || '');
  } catch (e) { ok('the demo legs ran [' + String(e.message).slice(0, 160) + ']', false); }
  await d.close();

  /* ---- the alpha on its side ---- */
  let a; const errs2 = [];
  try { a = await open({ keepCards: true, profile: 'phone_landscape', alpha: true }); } catch (e) { ok('the alpha boots [' + String(e.message).slice(0, 120) + ']', false); }
  if (a) {
    a.page.on('pageerror', (e) => errs2.push(String(e).slice(0, 160)));
    try {
      await boot(a);
      const q7 = await at(a.fr, [7, 40]), q23 = await at(a.fr, [23, 0]);
      console.log('       ' + say(q7) + ' | ' + say(q23));
      ok('C8 THE ALPHA ON ITS SIDE: people on the road at 07:40, all home at 23:00, three a crowd both times, nothing threw', q7.road >= 2 && q23.out === 0 && three(q7) && three(q23) && errs2.length === 0, errs2[0] || '');
    } catch (e) { ok('the alpha legs ran [' + String(e.message).slice(0, 160) + ']', false); }
    await a.close();
  }
  console.log('\nTHE CITY GOES TO WORK: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
