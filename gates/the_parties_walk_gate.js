#!/usr/bin/env node
/* THE PARTIES WALK (ANIMATION [the marker walks], 10/9; rules 65 and 68, Paolo 10/2 and 10/4: the map's people,
   every party drawn and moving; the third votes: movement GLIDES).

   BEFORE THIS ROUND, MEASURED: the map's cast came from the alpha with an idle and a breath and NO walk, so every
   roaming party crossed the valley standing still and breathing, and jumped a whole block whenever the clock moved
   it; his own party marker was one man whose legs flipped on a 125 ms wall clock whatever the speed.

   NOW: the alpha bakes each cast look's walk after the boot, one look per idle callback (cityBakeWalkLater); the map
   attaches it by the look's NAME (castWalkAttach); a party GLIDES between blocks like he does (partyGlidePos) and
   walks while it glides; his stride comes from his own glide; two of his company walk at his shoulders.

   Driven on the REAL alpha with the map inside it (the one driver), the game's clock stubbed, a trip of eight
   blocks along a road. Asked of what the map DREW (MAP_DREW, said by the render itself) and of where each party
   was drawn frame by frame. */
'use strict';
const path = require('path');
const { open } = require(path.join(__dirname, '..', 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, why) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n + (why ? '  [' + why + ']' : ''))); };
const done = () => { console.log('\nTHE PARTIES WALK GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  const d = await open({ alpha: true });
  const p = d.page;
  /* how long each idle-time bake chunk blocks the page: a long task is a hitch on the screen he stares at */
  await p.evaluate(() => { window.__lt = []; try { new PerformanceObserver(l => l.getEntries().forEach(e => window.__lt.push(e.duration))).observe({ entryTypes: ['longtask'] }); } catch (_e) {} });
  let f = null; for (let i = 0; i < 60 && !(f = p.frames().find(x => /CITY_WORLD/.test(x.url()))); i++) await p.waitForTimeout(500);
  if (!f) { ok('the map runs inside the alpha', false, 'no city frame'); await d.browser.close(); return done(); }
  const want = await p.evaluate(() => (window.CITY_CAST_LOOKS || []).map(l => l.id));
  let got = [];
  for (let i = 0; i < 200; i++) { got = await f.evaluate(() => Object.keys(CAST_WALK || {})).catch(() => []); if (got.length >= want.length) break; await p.waitForTimeout(500); }
  const lt = await p.evaluate(() => window.__lt.slice());
  ok('EVERY CAST LOOK\'S WALK REACHES THE MAP, by name (' + got.length + ' of ' + want.length + ')', want.length > 0 && want.every(w => got.indexOf(w) >= 0), want.filter(w => got.indexOf(w) < 0).join(','));
  ok('  and four pictures a facing, eight facings', await f.evaluate(() => { const w = CAST_WALK[Object.keys(CAST_WALK)[0]] || {}; return Object.keys(w).length === 8 && Object.keys(w).every(k => w[k].length === 4); }));
  const worst = lt.length ? Math.max.apply(null, lt) : 0;
  console.log('  (long tasks while the walk baked: ' + lt.length + ', worst ' + Math.round(worst) + ' ms; a rest-of-cast look already costs ~530 on the same bus)');
  ok('  and no bake chunk blocks the page longer than the bus already allows (worst ' + Math.round(worst) + ' ms, ceiling 600)', worst <= 600);

  const R = await f.evaluate(() => {
    const real = performance.now.bind(performance); let T = real() + 5000; performance.now = () => T;
    if (typeof setMode === 'function') setMode('city'); else MODE = 'city';
    let run = null;
    outer: for (let y = 3; y < om.n - 3; y++) for (let x = 3; x < om.n - 3; x++) for (let dd = 0; dd < 8; dd++) {
      const [dx, dy] = DIRS[dd]; let okr = true;
      for (let k = 0; k <= 12; k++) if (!cityWalkable(x + k * dx, y + k * dy)) { okr = false; break; }
      if (okr) { run = { x, y, d: dd }; break outer; } }
    if (!run) return { err: 'no straight road on the map' };
    city.x = run.x; city.y = run.y; T += 5000; render(); render();
    const log = []; let nextT = T, n = 0; const endT = T + 500 * 8 + 600;
    const last = {}; let worstParty = 0, partiesSeen = 0, partyFramesMoving = 0;
    const youFrames = new Set();
    while (T < endT) {
      if (T >= nextT && n < 8) { stepOnce(run.d); n++; nextT += 500; }
      T += 1000 / 60; MAP_DREW = null; render();
      const md = MAP_DREW || {};
      log.push({ walking: (md.art && md.art.walking) | 0, company: md.company | 0 });
      /* every party, where it was DRAWN this frame, in cells: a glide moves a fraction a frame, a jump a whole block */
      let anyMoving = false;
      for (const k in PARTY_GLIDE) if (cityGlideAt(PARTY_GLIDE[k], T).u < 1) anyMoving = true;
      /* where each party was DRAWN this frame (the render says so), not where its glide thinks it is: a glide
         that draws the cell anyway is the jump, and only the drawn position can catch it (mutation, 10/9) */
      const at = md.partyAt || {};
      for (const k in at) { const q = at[k];
        if (last[k]) worstParty = Math.max(worstParty, Math.hypot(q[0] - last[k][0], q[1] - last[k][1])); last[k] = [q[0], q[1]]; }
      if (anyMoving) partyFramesMoving++;
      partiesSeen = Math.max(partiesSeen, Object.keys(PARTY_GLIDE).length);
      /* his own picture: count the distinct walk frames he showed on this trip */
      try { const set = PLAYER_CV && (PLAYER_CV[mapFaceNow()] || PLAYER_CV.S); const st = strideOf({ u: CITY_GLIDE ? cityGlideAt(CITY_GLIDE, T).u : 1, n: CITY_GLIDE.n });
        if (set && set.walk && st != null) youFrames.add(Math.floor(st * set.walk.length) % set.walk.length); } catch (_e) {}
    }
    T += 3000; MAP_DREW = null; render(); const still = MAP_DREW || {};
    return { frames: log.length, walkFrames: log.filter(l => l.walking > 0).length, company: Math.max.apply(null, log.map(l => l.company)),
      stillWalking: (still.art && still.art.walking) | 0, stillCompany: still.company | 0, worstParty, partiesSeen, partyFramesMoving, youFrames: youFrames.size };
  });
  if (R.err) { ok('a road to travel', false, R.err); await d.browser.close(); return done(); }
  ok('CONTROL: parties are on the map and moved during the trip (' + R.partiesSeen + ' parties, gliding on ' + R.partyFramesMoving + ' frames)', R.partiesSeen > 0 && R.partyFramesMoving > 20);
  ok('THE PARTIES WALK WHILE THE CLOCK RUNS: walking people drawn on ' + R.walkFrames + ' of ' + R.frames + ' frames of the trip', R.walkFrames >= R.frames * 0.6);
  ok('A PARTY GLIDES, NEVER JUMPS: the most any party moved in one drawn frame is ' + R.worstParty.toFixed(3) + ' of a block (a jump is 1)', R.worstParty <= 0.2);
  ok('HIS PARTY IS THREE PEOPLE: two of his company drawn at his shoulders (' + R.company + ')', R.company === 2);
  ok('HIS STRIDE COMES FROM HIS GLIDE: he showed ' + R.youFrames + ' different walk pictures over the trip', R.youFrames >= 3);
  ok('WHEN THE CLOCK STOPS NOBODY WALKS: three seconds after the last step, ' + R.stillWalking + ' walking, his company still there breathing (' + R.stillCompany + ')', R.stillWalking === 0 && R.stillCompany === 2);
  ok('no page errors (' + (d.errs.length ? d.errs[0] : 'none') + ')', d.errs.length === 0);
  await d.browser.close(); done();
})().catch(e => { console.log('  FAIL the gate threw: ' + e.message); fail++; done(); });
