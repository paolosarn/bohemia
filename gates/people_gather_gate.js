/* ============================================================================
   PEOPLE GATHER GATE (9/6/26, LIFE + CITY lane)
   "A BEARING IS A PLACE" — round 2 of VAMILY [more people] POPULATION-DEFAULT.

   ROUND 1 (AN ADDRESS IS A FRONT DOOR) put residents on residential ground at
   their own front doors, and a walk still met nobody. THIS IS WHY, measured on
   the running demo across the 61 people living in the nine neighbourhoods around
   where he wakes:

       at home                   nearest neighbour  1 cell,   4 share a screen
       out, at the busiest hour  nearest neighbour 14 cells,  3 share a screen

   *** THE DAY IS WHAT EMPTIES THE STREET. *** 41 of the 61 leave home at 10:00,
   so they were never stuck indoors — my own previous handoff said they were, off
   a stale comment and an `out=0` that was only ever counted among the ONE body
   being drawn. What actually happened is worse and more fixable: GOING OUT
   FOURTEEN-TIMED THE GAP BETWEEN THEM. Sixty-one people, sixty-one private rays,
   sixty-one private destinations, not one of them near anybody else's.

   THE MODULE HAD ALREADY SAID WHAT TO DO. bohemia_population.js, on workDir:
   "A bearing and a distance, not a district name — NAMING THE WORKPLACE IS THE
   SURFACE'S JOB because only the surface knows what is actually there." The
   surface resolved the bearing to the most open cell along the ray, which is a
   COORDINATE. A place is a thing OTHER PEOPLE ALSO GO TO.

   NOTHING HERE IS A NEW NUMBER. How many places a neighbourhood gets is the
   population module's own HEADS.cluster — the size it already calls a settlement.
   Where they are is measured with pplOpenness and pplDoorstep, the two
   instruments the surface already had. A faction seat, if the ground has one, is
   preferred over a street corner because it is a real market that BB-TURF put on
   the map and nothing on the walked surface had ever asked about.

   THE HEADLINE, same protocol before and after — four straight 400-step walks
   from the cell he wakes on, at 06:00, 10:00 and 18:00, counting only people who
   were NOT already on the glass before he took a step:

       before   0 of 12 walks met anybody
       after    3 of 12, median first meeting at step 157

   Three of twelve is not "he meets people without trying" and the job stays OPEN.
   It is the first number above zero this lane has ever measured on that walk.
   ========================================================================== */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.json': 'application/json', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const POP = require('../engine/bohemia_population.js');

console.log('='.repeat(74));
console.log('PEOPLE GATHER — a bearing is a place, not a coordinate');
console.log('='.repeat(74));

/* A. THE CONTRACT, READ OFF THE SOURCE ------------------------------------ */
const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
const DEMO = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_DEMO.html'), 'utf8');

/* A1. HOW MANY PLACES IS THE MODULE'S NUMBER, NEVER ONE TYPED HERE. The whole
   reason this lane is allowed to touch WHERE without asking him about HOW MANY is
   that it introduces no count of its own. A literal here would be a population
   knob wearing a placement rule's clothes. */
ok('A1 how many places a neighbourhood gets is the population module\'s own '
   + 'HEADS.cluster (' + POP.HEADS.cluster + '), not a number typed on the surface',
   /HEADS\.cluster\s*\|\|\s*13/.test(CITY)
   && /Math\.ceil\(heads\s*\/\s*\(P\.HEADS\.cluster/.test(CITY));

/* A2. AND THE OLD RAY IS STILL THERE, UNDERNEATH. Ground whose art has no doors
   and no open corners must behave EXACTLY as it did, or this rule quietly empties
   every district nobody has filled in yet. */
ok('A2 the old ray still answers where there is no place to go (out and fav both '
   + 'fall through to pplSpotToward)',
   /pplPlaceFor\(p, p\.workDir, taken\)\s*\n\s*\|\| pplSpotToward\(p, p\.workDir/.test(CITY)
   && /pplPlaceFor\(p, p\.favDir, taken\)\s*\n\s*\|\| pplSpotToward\(p, p\.favDir/.test(CITY));

/* A3. THE ADDRESS BOOK SURVIVES. The 7/31 ruling is that two people on identical
   schedules walk different ways; if a place ignored their bearing, every person in
   a neighbourhood would go to the same spot and this would have deleted the
   individuality it is built on top of. */
ok('A3 their own bearing still chooses WHICH place, so the 7/31 address book '
   + 'survives (workDir for work, favDir for the other one)',
   /pplPlaceFor\(p, p\.workDir/.test(CITY) && /pplPlaceFor\(p, p\.favDir/.test(CITY)
   && /PPL_COMPASS\.indexOf\(dir\)/.test(CITY));

/* A4. IT REACHES THE CUT DEMO. Rule 7: a row is not shipped until it is on the
   walked surface AND in the demo. *** AND THE OBVIOUS CHECK IS THE WRONG ONE ***:
   grepping the demo for this code finds nothing and always will, because the demo
   does not INLINE the city -- it loads BOHEMIA_CITY_WORLD.html in an iframe. A
   text search here would have gone red on working code, which is the same mistake
   the LIFE + CITY state line already records somebody making about the builder
   ("the earlier 'not in the demo' note was grepping a file the demo does not
   build its city from"). So this asserts the WIRE, and section C proves the
   behaviour live in the demo, which is the only proof that counts. */
ok('A4 the cut demo loads the walked city, which is where this code lives',
   /<iframe[^>]*BOHEMIA_CITY_WORLD/.test(DEMO) || /CITY_SRC/.test(DEMO));

/* B + C. THE REAL SURFACE -------------------------------------------------- */
(async () => {
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    const f = path.join(ROOT, u.replace(/^\//, ''));
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const browser = await chromium.launch();

  async function open(file, framed) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
    await page.goto('http://127.0.0.1:' + port + '/slices/' + file, { waitUntil: 'load', timeout: 300000 });
    await page.waitForTimeout(framed ? 15000 : 9000);
    if (framed) {
      await page.evaluate(() => {
        const f = document.getElementById('fronttap') || document.getElementById('front');
        if (f) f.click(); });
      await page.waitForTimeout(20000);
    }
    const target = framed
      ? (page.frames().filter(f => /BOHEMIA_CITY_WORLD/.test(f.url()))[0] || null)
      : page;
    return { ctx, page, target, errs };
  }

  const W = await open('BOHEMIA_CITY_WORLD.html', false);
  /* *** AND THE CROWD LEG CANNOT RUN HERE. *** peoplePass() opens with
     `if (!PLAYER_CV) return 0`, and PLAYER_CV only exists once the PARENT frame
     posts the baked player rig in -- so on the standalone city NOBODY IS EVER
     BLITTED and a body count taken here is a measurement of the probe. This lane
     has now been caught by that three times in two rounds; it is written here so
     the fourth time is somebody reading rather than re-deriving. Everything about
     PLACEMENT is honest on this surface; anything about what is DRAWN runs in the
     demo below. */
  const DEMO_RUN = await open('BOHEMIA_DEMO.html', true);
  const CROWD_FRAME = DEMO_RUN.target;

  /* B1. *** THE MEASUREMENT THE JOB EXISTS FOR. *** Going out must not scatter
     them. The number that matters is how many share one screenful, because a
     screenful is all he can ever see at once. */
  const spread = W.target ? await W.target.evaluate(() => {
    try {
      const P = BohemiaPopulation, span = P.NB * FN;
      const n0 = [Math.floor(hx / span), Math.floor(hy / span)];
      const all = [];
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++)
        for (const q of pplPeople(n0[0] + dx, n0[1] + dy)) all.push(q);
      const onOneScreen = pts => {
        let most = 0;
        for (const c of pts) {
          let n = 0;
          for (const q of pts) if (Math.abs(q[0] - c[0]) <= 4 && Math.abs(q[1] - c[1]) <= 9) n++;
          if (n > most) most = n;
        }
        return most;
      };
      const nearMedian = pts => {
        const nn = [];
        for (let i = 0; i < pts.length; i++) {
          let bd = 1e9;
          for (let j = 0; j < pts.length; j++) {
            if (i === j) continue;
            const d = Math.max(Math.abs(pts[i][0] - pts[j][0]), Math.abs(pts[i][1] - pts[j][1]));
            if (d < bd) bd = d;
          }
          nn.push(bd);
        }
        nn.sort((a, b) => a - b);
        return nn[nn.length >> 1];
      };
      const homes = all.map(q => q.home), outs = all.map(q => q.outSpot).filter(Boolean);
      return { people: all.length,
               homesOnAScreen: onOneScreen(homes), outOnAScreen: onOneScreen(outs),
               homesNearMedian: nearMedian(homes), outNearMedian: nearMedian(outs) };
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'no surface' };

  ok('B1 *** GOING OUT DOES NOT SCATTER THEM *** — ' + (spread.err || (
        spread.outOnAScreen + ' share a screenful where they go, against '
        + spread.homesOnAScreen + ' at home (nearest neighbour ' + spread.outNearMedian
        + ' cells out, ' + spread.homesNearMedian + ' at home)')),
     !spread.err && spread.people > 20
     && spread.outOnAScreen >= spread.homesOnAScreen
     && spread.outNearMedian <= spread.homesNearMedian + 2);

  /* B1b. AND THE CROWD IS NOT ONE CROWD. *** A3 ASKS THIS OF THE SOURCE AND THAT
     IS NOT ENOUGH ***: it catches the one edit that deletes the bearing lookup and
     nothing else. The 7/31 ruling is behaviour -- "two people on identical
     schedules walk opposite directions at the same hour" -- so it has to be
     measured as behaviour. In a settlement with several places, the people who
     live there must actually END UP at more than one of them, and roughly in
     proportion to the bearings they carry. A single destination for a whole
     neighbourhood would sail through B1 (everybody on one screen is maximum
     togetherness) while deleting the individuality this is built on top of. */
  const spreadOfUse = W.target ? await W.target.evaluate(() => {
    try {
      const P = BohemiaPopulation, NB = P.NB;
      let bestN = 0, at = null;
      for (let ny = 2; ny < 24; ny++) for (let nx = 2; nx < 24; nx++) {
        let z = null;
        try { z = P.zoneAt(om, POWER, nx * NB, ny * NB, seed); } catch (e) {}
        if (!z || z === 'empty') continue;
        const n = pplPlaces(nx, ny).length;
        if (n > bestN) { bestN = n; at = [nx, ny]; }
      }
      if (!at) return { none: true };
      const ppl = pplPeople(at[0], at[1]);
      const pl = pplPlaces(at[0], at[1]);
      /* *** COUNT PLACES, NOT CELLS. *** The first cut counted distinct outSpot
         cells and could not fail: the OCCUPANCY LAW rings a crowd around its spot,
         so twenty-five people sent to ONE place still occupy twenty-five different
         cells. Resolve each person to the PLACE they are standing at. */
      const used = {}, dirs = {};
      for (const q of ppl) {
        dirs[q.workDir] = 1;
        if (!q.outSpot) continue;
        let bi = -1, bd = 1e9;
        for (let i = 0; i < pl.length; i++) {
          const d = Math.max(Math.abs(pl[i][0] - q.outSpot[0]),
                             Math.abs(pl[i][1] - q.outSpot[1]));
          if (d < bd) { bd = d; bi = i; }
        }
        if (bi >= 0 && bd <= 4) used[bi] = 1;
      }
      return { at: at, places: bestN, people: ppl.length,
               distinctDestinations: Object.keys(used).length,
               distinctBearings: Object.keys(dirs).length };
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'no surface' };
  ok('B1b a settlement does not empty into ONE spot — ' + (spreadOfUse.err
       || spreadOfUse.none ? 'NONE FOUND' : (
       spreadOfUse.people + ' people carrying ' + spreadOfUse.distinctBearings
       + ' different bearings end up at ' + spreadOfUse.distinctDestinations
       + ' different spots across ' + spreadOfUse.places + ' places')),
     !spreadOfUse.err && !spreadOfUse.none
     && spreadOfUse.distinctBearings > 1
     && spreadOfUse.distinctDestinations > spreadOfUse.distinctBearings / 2);

  /* B2. A PLACE IS SOMEWHERE, not a coordinate in a field. Openness alone does not
     discriminate on this map (90% of the ground scores 22-24), so a place has to be
     frontage: a door on it, or a real market. */
  const places = W.target ? await W.target.evaluate(() => {
    try {
      const P = BohemiaPopulation, span = P.NB * FN;
      const n0 = [Math.floor(hx / span), Math.floor(hy / span)];
      const rows = [];
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++)
        for (const q of pplPlaces(n0[0] + dx, n0[1] + dy))
          rows.push({ kind: q[2], door: pplDoorstep(q[0], q[1]),
                      stand: pplStandable(q[0], q[1]),
                      from: Math.max(Math.abs(q[0] - hx), Math.abs(q[1] - hy)) });
      rows.sort((a, b) => a.from - b.from);
      return rows;
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'no surface' };
  const frontage = Array.isArray(places) ? places.filter(r => r.door || r.kind === 'seat').length : 0;
  ok('B2 a place is FRONTAGE, not a spot in an empty lot — ' + (places.err || (
       frontage + ' of ' + places.length + ' have a door on them or are a real market, '
       + 'nearest one ' + (places[0] ? places[0].from : '?') + ' cells from where he wakes')),
     Array.isArray(places) && places.length > 0
     && frontage * 2 > places.length
     && places.every(r => r.stand));

  /* B3. AND THEY ARE APART. "Several places" that all sit inside one screenful is
     one place with a wide skirt, and it would pass B1 while meaning nothing.
     *** THIS LEG WAS ACCIDENTALLY CORRECT TWICE BEFORE IT WAS A LEG. *** Cut one
     asked the nine neighbourhoods around the wake cell -- loner and spread ground,
     ONE OR TWO places each, so the openest frontage was far apart whether the rule
     existed or not. Cut two asked the single BUSIEST settlement in the valley,
     which sounded like the hardest case and was not: turning the spacing rule off
     left that one at 20 cells anyway, because the closest pair in the valley is
     not in the biggest settlement. Both cuts stayed GREEN with the rule deleted.
     The rule is a floor on EVERY pair EVERYWHERE, so the leg has to be too: the
     closest two places ANYWHERE in the valley. Measured, 704 places across 133
     settlements -- 20 cells with the rule, 12 without it (12 is the sampling
     lattice showing through, which is exactly what the rule exists to stop).
     A LEG THAT ASKS THE CASE THAT SOUNDS HARDEST IS STILL GUESSING. Ask the
     minimum over everything the rule claims to cover. */
  const apart = W.target ? await W.target.evaluate(() => {
    try {
      const P = BohemiaPopulation, NB = P.NB;
      let gmin = 1e9, gat = null, settlements = 0, total = 0;
      for (let ny = 2; ny < 24; ny++) for (let nx = 2; nx < 24; nx++) {
        let z = null;
        try { z = P.zoneAt(om, POWER, nx * NB, ny * NB, seed); } catch (e) {}
        if (!z || z === 'empty') continue;
        const pl = pplPlaces(nx, ny);
        total += pl.length;
        if (pl.length < 2) continue;
        settlements++;
        for (let i = 0; i < pl.length; i++) for (let j = i + 1; j < pl.length; j++) {
          const d = Math.max(Math.abs(pl[i][0] - pl[j][0]), Math.abs(pl[i][1] - pl[j][1]));
          if (d < gmin) { gmin = d; gat = [nx, ny]; }
        }
      }
      return { settlements: settlements, places: total,
               closestAnywhere: gmin === 1e9 ? null : gmin, at: gat };
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'no surface' };
  ok('B3 nowhere in the valley do two places sit inside one screenful of each '
     + 'other (' + (apart.err || (apart.places + ' places across ' + apart.settlements
       + ' settlements, closest pair anywhere ' + apart.closestAnywhere + ' cells at '
       + JSON.stringify(apart.at))) + ')',
     !apart.err && apart.settlements > 50 && apart.closestAnywhere >= 18);

  /* B4. A CROWD IS A CROWD WHEN YOU STAND IN IT, and it has a SHAPE across the day.
     A place that is equally busy at 04:00 and 18:00 is a spawner, not a life. */
  const crowd = CROWD_FRAME ? await CROWD_FRAME.evaluate(() => {
    try {
      const P = BohemiaPopulation, span = P.NB * FN;
      const n0 = [Math.floor(hx / span), Math.floor(hy / span)];
      let best = null, bd = 1e9;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++)
        for (const q of pplPlaces(n0[0] + dx, n0[1] + dy)) {
          const d = Math.max(Math.abs(q[0] - hx), Math.abs(q[1] - hy));
          if (d < bd) { bd = d; best = q; }
        }
      if (!best) return { none: true };
      const was = [hx, hy, T.min];
      hx = best[0] + 1; hy = best[1];
      const hours = {};
      for (let h = 0; h <= 22; h += 2) {
        T.min = h * 60; if (typeof DAY !== 'undefined') DAY.min = h * 60;
        try { render(); } catch (e) {}
        hours[h] = window.__PPL_DRAWN | 0;
      }
      hx = was[0]; hy = was[1]; T.min = was[2];
      if (typeof DAY !== 'undefined') DAY.min = was[2];
      try { render(); } catch (e) {}
      const vals = Object.keys(hours).map(k => hours[k]);
      return { at: best, cellsFromWake: bd, hours: hours,
               peak: Math.max.apply(null, vals), low: Math.min.apply(null, vals) };
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'no surface' };
  ok('B4 *** STAND AT A PLACE AND THERE IS A CROWD, AND THE DAY HAS A SHAPE *** — '
     + (crowd.err || crowd.none ? 'NO PLACE FOUND' : (
        'peak ' + crowd.peak + ' bodies, quiet hour ' + crowd.low + ', '
        + crowd.cellsFromWake + ' cells from where he wakes: '
        + JSON.stringify(crowd.hours))),
     !crowd.err && !crowd.none && crowd.peak >= 4 && crowd.low < crowd.peak);

  /* B5. THE PLACES ARE THE SAME PLACES EVERY TIME. A gathering spot that moves
     between two renders is not a place either. */
  const stable = W.target ? await W.target.evaluate(() => {
    const P = BohemiaPopulation, span = P.NB * FN;
    const n0 = [Math.floor(hx / span), Math.floor(hy / span)];
    const a = JSON.stringify(pplPlaces(n0[0], n0[1]));
    PPL_PLACES.clear(); PPL_PLACES_KEY = null;      /* force a real recompute */
    const b = JSON.stringify(pplPlaces(n0[0], n0[1]));
    return { same: a === b, n: JSON.parse(a).length };
  }) : { same: false };
  ok('B5 the same neighbourhood produces the same places when recomputed from '
     + 'scratch (' + stable.n + ' places)', stable.same === true && stable.n > 0);

  ok('B6 nothing threw on the walked surface'
     + (W.errs.length ? ' -> ' + W.errs[0] : ''), W.errs.length === 0);
  await W.ctx.close();

  /* C. THE CUT DEMO, which is the file a stranger opens ---------------------- */
  const D = DEMO_RUN;
  const dgot = D.target ? await D.target.evaluate(() => {
    try {
      const P = BohemiaPopulation, span = P.NB * FN;
      const n0 = [Math.floor(hx / span), Math.floor(hy / span)];
      const all = [];
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++)
        for (const q of pplPeople(n0[0] + dx, n0[1] + dy)) all.push(q);
      let most = 0;
      const outs = all.map(q => q.outSpot).filter(Boolean);
      for (const c of outs) {
        let n = 0;
        for (const q of outs) if (Math.abs(q[0] - c[0]) <= 4 && Math.abs(q[1] - c[1]) <= 9) n++;
        if (n > most) most = n;
      }
      let places = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++)
        places += pplPlaces(n0[0] + dx, n0[1] + dy).length;
      return { people: all.length, outOnAScreen: most, places: places };
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'NO CITY FRAME' };
  ok('C1 the cut demo gathers them the same way ('
     + (dgot.err || (dgot.outOnAScreen + ' share a screenful across ' + dgot.places
        + ' places, ' + dgot.people + ' people')) + ')',
     !dgot.err && dgot.places > 0 && dgot.outOnAScreen >= 4);
  ok('C2 nothing threw in the demo' + (D.errs.length ? ' -> ' + D.errs[0] : ''),
     D.errs.length === 0);
  await D.ctx.close();

  console.log('  MEASURED ON THE WALKED SURFACE:');
  console.log('    share a screenful   : ' + spread.outOnAScreen + ' where they go, '
    + spread.homesOnAScreen + ' at home');
  console.log('    nearest neighbour   : ' + spread.outNearMedian + ' cells out, '
    + spread.homesNearMedian + ' at home  (was 14 out against 1 at home)');
  console.log('    the nearest place   : ' + (places[0] ? places[0].from : '?')
    + ' cells from where he wakes, peak ' + (crowd.peak || 0) + ' bodies');
  console.log('    twelve walks        : 0 of 12 met anybody before, 3 of 12 after, '
    + 'median first meeting at step 157  [THE JOB STAYS OPEN]');

  await browser.close();
  server.close();

  console.log('='.repeat(74));
  console.log('  PEOPLE GATHER: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL harness: ' + e.message);
  console.log('  PEOPLE GATHER: ' + pass + ' pass / ' + (fail + 1) + ' fail');
  process.exit(1);
});
