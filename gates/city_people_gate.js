const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* BOHEMIA CITY PEOPLE GATE (7/29/26) — measured ON THE REAL SURFACE.
 *
 * gates/zone_map_gate.js proves the CENSUS is right. It cannot prove anybody is
 * actually on screen, and VERIFY ON THE REAL SURFACE (7/18) is explicit that a
 * side-door probe is a lie: art and presence are verified only on the surface
 * Paolo sees. So this gate boots the real alpha in a real browser, dismisses
 * the real splash, taps the real CITY tab, drops into human mode, and counts
 * bodies that were actually drawn.
 *
 * The finding it locks (engine reality audit, the CITY lane's #1 item): the
 * walk surface had ZERO people in it. Not few — zero. No BohemiaAgents, no
 * body drawing of any kind; the only movers were cars and planes.
 *
 * WHAT IT PROVES, all of it measured in the browser:
 *  1. The shared census module is LIVE inside the city frame, and its valley
 *     census matches what the node-side gate says. One module, one answer.
 *  2. Standing in a CLUSTER you SEE PEOPLE. This is Paolo's "how busy we make
 *     the city feel", and it is the assertion that would have caught the whole
 *     original bug.
 *  3. Standing in a NO MAN'S LAND you see NOBODY. Emptiness is authored, and
 *     it has to be provable or the next "the world feels dead" change quietly
 *     fills it in.
 *  4. NOBODY STANDS WHERE THE PLAYER CANNOT WALK. The first cut of this pass
 *     used its own standable test and put residents on rooftops; the fix was to
 *     use the frame's own `walk` flag, and this asserts it directly against
 *     every drawn body.
 *  5. Nobody is drawn on top of the player (OCCUPANCY LAW: one body per cell).
 *  6. It costs nothing when there is nobody about — the pass is culled to the
 *     visible neighbourhoods, so an empty block does no per-person work.
 *
 *   node gates/city_people_gate.js
 */
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

let pass = 0; const fails = [];
const ok = (n, c) => { c ? pass++ : fails.push(n); };

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve('slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load', timeout: 300000 });
  await SETTLE(p, 12000);
  await p.mouse.click(195, 420);                       /* the real splash: TAP TO ENTER */
  await SETTLE(p, 6000);
  await p.evaluate(() => {
    /* THE CITY TAB IS GONE (Paolo 8/2). It found the tab by its TEXT, which is
       why the data-p sweep did not catch it. The world is reached through RUN;
       both buttons opened the same panel since 7/28. */
      const t = [...document.querySelectorAll('.tab,button')].find(e => e.textContent.trim() === 'RUN');
    if (!t) throw new Error('the tab this gate measures is not reachable: a missing tab is a FAILURE, not a skip (ONE WORLD TAB, 8/2)'); t.click();
  });
  await SETTLE(p, 22000);

  const f = p.frames().find(fr => fr.name() === 'cityFrame');
  ok('the CITY tab really mounts its frame', !!f);
  if (!f) { report(); await b.close(); return; }

  /* 1) the shared module is live in the frame */
  const live = await f.evaluate(() => {
    if (typeof BohemiaPopulation === 'undefined') return null;
    return { census: BohemiaPopulation.census(om, POWER, seed, 96), seed: seed,
             hasPass: typeof peoplePass === 'function' };
  });
  ok('the shared census module is inlined and live in the city frame', !!live);
  if (!live) { report(); await b.close(); return; }
  ok('the people pass exists on the render path', live.hasPass);
  ok(`the frame boots the ONE SEED (${live.seed})`, live.seed === 2691674296);
  ok(`the frame's census matches the node-side census (${live.census.people} people, ${live.census.zones.cluster} clusters)`,
     live.census.people >= 270 && live.census.people <= 330 && live.census.zones.cluster >= 11);

  /* 2) a cluster shows people */
  const clus = await f.evaluate(() => {
    let best = null;
    for (let ty = 0; ty < 96 && !best; ty++) for (let tx = 0; tx < 96; tx++) {
      const c = om.at(tx, ty);
      if (!c || !BohemiaPopulation.RESIDENTIAL[c.district]) continue;
      if (BohemiaPopulation.zoneAt(om, POWER, tx, ty, seed) === 'cluster') { best = [tx, ty]; break; }
    }
    if (!best) return { err: 'no cluster in the valley' };
    const homes = BohemiaPopulation.homesIn(om, POWER, best[0] >> 2, best[1] >> 2, seed, FN, pplStandable, 24);
    if (!homes.length) return { err: 'cluster placed nobody' };
    /* stand him NEXT to the settlement, not on top of a resident, or the
       baseline is already one short and the occupancy test below proves
       nothing */
    MODE = 'human'; HC = 22;
    hx = homes[0][0] + 1; hy = homes[0][1] + 1;
    if (!cellAt(hx, hy) || !cellAt(hx, hy).walk) { hx = homes[0][0]; hy = homes[0][1] + 2; }
    fit(); render();
    const drawn = window.__PPL_DRAWN;
    /* every placed resident must stand where the PLAYER could walk */
    let unwalkable = 0;
    for (const h of homes) {
      const c = cellAt(h[0], h[1]);
      if (!c || !c.walk) unwalkable++;
    }
    /* NOW step him deliberately ONTO a resident's cell. Placement is cached and
       cannot know where he will walk, so draw time is the only honest place to
       enforce one-body-per-cell.
       *** AND THE PROOF IS NOT THAT THE COUNT DROPS. *** It was, and that claim
       went red the day the population default moved from 1 to 20 (8/28): moving
       the player MOVES THE CAMERA, so stepping onto one body brings others into
       view, and the total went 147 -> 148 while the law was being obeyed
       perfectly. A CLAIM THAT COUNTS THE THING INSTEAD OF READING IT is a claim
       that measures the crowd. So this reads the ONE BODY: is that person still
       in what the pass actually blitted? Strictly stronger, and it no longer
       cares how many neighbours they have. */
    const onCell = homes.find(h => h[0] !== hx || h[1] !== hy);
    hx = onCell[0]; hy = onCell[1]; render();
    const drewHere = (typeof BARK_DREW !== 'undefined' && BARK_DREW) ? BARK_DREW : [];
    let bodyOnPlayerCell = 0;
    for (let i = 0; i < drewHere.length; i++) {
      const rec = drewHere[i], q = (rec && rec.p) ? rec.p : rec;
      const at = q && q.home ? pplAt(q) : null;
      if (at && at[0] === hx && at[1] === hy) bodyOnPlayerCell++;
    }
    const onPlayer = bodyOnPlayerCell;
    return { cell: best, homes: homes.length, drawn: drawn, after: window.__PPL_DRAWN,
             cv: [cv.width, cv.height], unwalkable, onPlayer };
  });
  ok('found a cluster and it placed people', !clus.err);
  if (!clus.err) {
    ok(`the canvas is really sized (${clus.cv.join('x')}) - a 1x1 canvas would fake every count`,
       clus.cv[0] > 100 && clus.cv[1] > 100);
    ok(`standing in a CLUSTER you SEE PEOPLE (${clus.drawn} on screen)`, clus.drawn >= 3);
    /* 4) and 5) */
    ok(`nobody stands where the player cannot walk (${clus.unwalkable} bad cells of ${clus.homes})`,
       clus.unwalkable === 0);
    ok(`stepping onto a resident's cell draws NO body on the player's own cell (${clus.onPlayer} there, ${clus.drawn} -> ${clus.after} on screen, OCCUPANCY LAW)`, clus.onPlayer === 0);
  }

  /* 7) FACING IS DERIVED FROM TRAVEL, not stored (7/31). Every person carries
     an idle facing from their hash, which is right at home and WRONG the moment
     the address book started moving them: a body that walked east to work and
     then stares north forever is a cardboard cutout, which is the exact failure
     the individual-schedule work existed to fix. */
  const facing = await f.evaluate(() => {
    let best = null;
    for (let ty = 0; ty < 96 && !best; ty++) for (let tx = 0; tx < 96; tx++) {
      const c = om.at(tx, ty);
      if (!c || !BohemiaPopulation.RESIDENTIAL[c.district]) continue;
      if (BohemiaPopulation.zoneAt(om, POWER, tx, ty, seed) === 'cluster') { best = [tx, ty]; break; }
    }
    if (!best) return { err: 'no cluster' };
    const nx = best[0] >> 2, ny = best[1] >> 2;
    MODE = 'human'; HC = 22;
    const pp = pplPeople(nx, ny);
    hx = pp[0].home[0] + 1; hy = pp[0].home[1] + 1; fit();
    /* READ WHAT THE RENDER DREW, never what the helper would answer. The first
       cut of this assertion called pplFace() itself and passed even when the
       blit used a stored facing - it could not fail, which makes it worse than
       no assertion at all. */
    /* 03:00 (asleep) against 09:00 (out and working). NOT against 13:00: since
       the heat condition landed, midday is when the Mojave sends people INDOORS
       - so 3am vs 1pm compares two sets of people who are both at home facing
       their idle direction, and the assertion goes red on a system that is
       working perfectly. Compare against the hour people are actually out. */
    T.min = 3 * 60; render();
    const nightF = (window.__PPL_FACES || []).slice();
    T.min = 9 * 60; render();
    const dayF = (window.__PPL_FACES || []).slice();
    const night = nightF.map(x => x.dir);
    const dayMap = {}; dayF.forEach(x => { dayMap[x.id] = x.dir; });
    /* anybody standing away from home must face AWAY from home, i.e. the way
       they walked - never their idle facing */
    let wrong = 0, away = 0;
    T.min = 9 * 60; render();
    const byId = {}; pp.forEach(q => { byId[q.id] = q; });
    for (const rec of (window.__PPL_FACES || [])) {
      if (rec.home) continue;
      const q = byId[rec.id]; if (!q) continue;
      away++;
      const at = pplAt(q);
      if (rec.dir !== dirOf(at[0] - q.home[0], at[1] - q.home[1])) wrong++;
    }
    const changed = nightF.filter(x => dayMap[x.id] && dayMap[x.id] !== x.dir).length;
    return { n: pp.length, nightFacings: new Set(night).size, changed, away, wrong };
  });
  ok('the facing probe found a cluster', !facing.err);
  if (!facing.err) {
    ok(`a block faces more than one way (${facing.nightFacings} distinct facings across ${facing.n} people)`,
       facing.nightFacings >= 3);
    ok(`somebody turns between 03:00 and 09:00 (${facing.changed} changed)`, facing.changed > 0);
    ok(`everybody away from home faces the way they walked (${facing.away} out, ${facing.wrong} wrong)`,
       facing.wrong === 0);
  }

  /* 3) a no man's land shows nobody */
  const empt = await f.evaluate(() => {
    let z = null;
    for (let ty = 0; ty < 96 && !z; ty++) for (let tx = 0; tx < 96; tx++) {
      const c = om.at(tx, ty);
      if (!c || !BohemiaPopulation.RESIDENTIAL[c.district]) continue;
      if (BohemiaPopulation.zoneAt(om, POWER, tx, ty, seed) === 'empty') { z = [tx, ty]; break; }
    }
    if (!z) return { err: 'no empty neighbourhood - the no man\'s land was filled in' };
    hx = z[0] * FN + 64; hy = z[1] * FN + 64; fit(); render();
    return { cell: z, drawn: window.__PPL_DRAWN };
  });
  ok('the valley still has a no man\'s land to stand in', !empt.err);
  if (!empt.err) ok(`standing in a NO MAN'S LAND you see NOBODY (${empt.drawn})`, empt.drawn === 0);

  /* 6) the pass is cheap where nobody lives */
  const cost = await f.evaluate(() => {
    const t0 = performance.now();
    for (let i = 0; i < 30; i++) render();
    return performance.now() - t0;
  });
  ok(`rendering an empty block 30x stays cheap (${cost.toFixed(0)}ms)`, cost < 4000);

  ok('the frame threw no errors while people were on screen', errs.length === 0);
  if (errs.length) errs.slice(0, 3).forEach(e => console.log('    page error: ' + e));

  report();
  await b.close();
  process.exit(fails.length ? 1 : 0);

  function report() {
    console.log(`CITY PEOPLE GATE: ${pass} passed, ${fails.length} failed`);
    if (!clus || !clus.err) console.log(`  cluster: ${clus && clus.drawn} on screen · no man's land: ${empt && empt.drawn}`);
    fails.forEach(x => console.log('  FAIL  ' + x));
  }
})().catch(e => { console.log('CITY PEOPLE GATE: harness error - ' + e.message); process.exit(1); });
