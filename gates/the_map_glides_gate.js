#!/usr/bin/env node
/* THE MAP GLIDES, AND THE BEAT STAYS INSIDE THE SLIDE.

   PAOLO 9/27 IN THE TAB (up on animation-how-you-cross-the-map-9-27), made rule 37h:
   "I would like the Animation movement to be very very smooth. I don't want to see
   move like a block at a time, boom boom boom boom. I just want it to glide very
   nicely, even if Animation is playing within the thing that's sliding... the
   Animation would still play to the BPM of the music and just slides."

   MEASURED BEFORE, on the real map with the game's own clock driven: one step moved
   the camera 18 px on ONE frame of 36 and held it -- the block, exactly. Two steps
   half a beat apart: two jumps, up to 10 px each.
   NOW: the same 18 px across the beat, never more than 1 px a frame (the camera is
   still whole-pixel, the PIXEL FIX stands), and a second step taken mid-glide
   continues from where the picture IS, so back-to-back steps are one constant slide.
   The pin hops once per beat while it travels: the BPM inside the slide.
   A far jump (landing, a ride, a load) SNAPS: gliding across half the valley would
   lie about how he got there.

   AND THIS LANE'S OWN EARLIER CALL WAS THE OPPOSITE. Round one of [bb marker] picked
   B, "one lot per beat", and MARKER ON BEAT still holds that the page's B stops at
   the beat. He voted the page up and said glide. That gate describes the two options
   honestly and stays as the record; THIS gate holds the game.   ANIMATION 9/28  */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const CITY = path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html');
const VOTE = path.join(ROOT, 'slices', 'vote', 'ANIMATION_THE_MAP_GLIDES.html');
const LAW = path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_THE_THIRD_VOTES_9_28_26.md');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = () => { console.log('\nTHE MAP GLIDES GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0); };

ok('his ruling is in the repo (rule 37h, MOVEMENT GLIDES)',
   fs.existsSync(LAW) && /MOVEMENT GLIDES/.test(fs.readFileSync(LAW, 'utf8')));
ok('the item PLAYS on a real clock and carries no control of its own',
   fs.existsSync(VOTE) && (() => { const v = fs.readFileSync(VOTE, 'utf8');
     return /requestAnimationFrame/.test(v) && /performance\.now\(\)/.test(v)
         && !/<button|<input|<select|<form|onclick=/i.test(v); })());

(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const br = await chromium.launch();
  const pg = await br.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + CITY, { waitUntil: 'load' });
  await pg.waitForTimeout(3200);
  const R = await pg.evaluate(async () => {
    try { document.getElementById('daycard').classList.remove('on'); } catch (e) {}
    if (typeof setMode === 'function') setMode('city'); else MODE = 'city';
    render(); await new Promise(r => setTimeout(r, 700));
    /* somewhere with room to take two steps the same way */
    let di = -1;
    outer: for (let y = 4; y < om.n - 4; y++) for (let x = 4; x < om.n - 4; x++)
      for (let d = 0; d < 8; d++) { const [dx, dy] = DIRS[d];
        if (cityWalkable(x, y) && cityWalkable(x+dx, y+dy) && cityWalkable(x+2*dx, y+2*dy)) { city.x = x; city.y = y; di = d; break outer; } }
    if (di < 0) return { err: 'no open ground on the map' };
    render(); await new Promise(r => setTimeout(r, 700)); render();
    /* THE GAME'S OWN CLOCK, DRIVEN: headless is clamped near 20 fps, and a ruler that
       samples slower than the thing it measures cannot see a glide. */
    const real = performance.now.bind(performance); let T = real() + 5000;
    performance.now = () => T;
    render();
    /* the camera each frame is what renderCity hands to iso first */
    const origIso = iso; const cams = []; let fresh = false;
    iso = function (x, y, ox, oy) { if (fresh) { cams.push([ox, oy]); fresh = false; } return origIso(x, y, ox, oy); };
    const origRC = renderCity; renderCity = function () { fresh = true; return origRC.apply(this, arguments); };
    /* and the pin's hop, which is the one translate the pin does */
    const lifts = []; const origT = g.translate.bind(g);
    g.translate = function (x, y) { if (x === 0 && y <= 0) lifts.push(-y); return origT(x, y); };
    const step = (n) => { const out = []; for (let i = 0; i < n; i++) { T += 1000 / 60; lifts.length = 0; render(); out.push({ c: cams[cams.length - 1], lift: lifts.length ? lifts[lifts.length - 1] : 0 }); } return out; };
    render(); const start = cams[cams.length - 1];
    const bx = city.x, by = city.y;
    stepOnce(di);
    const ruleMovedAtOnce = (city.x !== bx || city.y !== by);
    const one = step(36);
    let moved = 0, maxStep = 0, prev = start, maxLift = 0;
    for (const f of one) { const d = Math.hypot(f.c[0] - prev[0], f.c[1] - prev[1]); if (d > 0.01) moved++; maxStep = Math.max(maxStep, d); prev = f.c; maxLift = Math.max(maxLift, f.lift); }
    const at30 = one[29].c, at36 = one[35].c;
    const total = Math.hypot(at36[0] - start[0], at36[1] - start[1]);
    const arrived = Math.hypot(at36[0] - at30[0], at36[1] - at30[1]);
    const restLift = one[35].lift;
    /* CHAINED: a second step half a beat into the first */
    const s2 = cams[cams.length - 1];
    const back = (di + 4) % 8; stepOnce(back);
    const half = step(15); stepOnce(di);
    const rest = step(40);
    let chainMax = 0, p2 = s2;
    for (const f of half.concat(rest)) { chainMax = Math.max(chainMax, Math.hypot(f.c[0] - p2[0], f.c[1] - p2[1])); p2 = f.c; }
    /* FAR: a landing twelve cells away snaps, it does not slide */
    const b4 = cams[cams.length - 1];
    city.x = Math.max(2, Math.min(om.n - 3, city.x + 12));
    const far = step(3);
    const snap = Math.hypot(far[0].c[0] - b4[0], far[0].c[1] - b4[1]);
    const after = Math.hypot(far[2].c[0] - far[0].c[0], far[2].c[1] - far[0].c[1]);
    return { ruleMovedAtOnce, moved, maxStep, total, arrived, maxLift, restLift, chainMax, snap, after };
  });
  if (R.err) { ok('the map has open ground to walk (' + R.err + ')', false); await br.close(); return done(); }
  ok('the city loads with no page error (' + (errs.length ? errs[0] : 'none') + ')', errs.length === 0);
  ok('CONTROL: where he IS changes on the step itself -- only the picture glides, ' +
     'every rule that asks where he is still gets the whole cell', R.ruleMovedAtOnce);
  ok('CONTROL: the step actually moves the map a real distance (' + R.total.toFixed(1) +
     ' px), so a still map cannot pass the glide claims below by never moving', R.total >= 8);
  ok('THE MAP GLIDES: the camera moves on ' + R.moved + ' of 36 frames after one step ' +
     '(it moved on 1)', R.moved >= 12);
  ok('AND NEVER IN A BLOCK: the biggest single-frame move is ' + R.maxStep.toFixed(1) +
     ' px (it was 18, the whole step at once)', R.maxStep <= 2);
  ok('and it ARRIVES on the beat, not a crawl: no movement between frame 30 and 36 (' +
     R.arrived.toFixed(1) + ' px)', R.arrived < 0.5);
  ok('TWO STEPS HALF A BEAT APART ARE ONE SLIDE: the biggest frame move across both is ' +
     R.chainMax.toFixed(1) + ' px (it was 10.3, two jumps)', R.chainMax <= 2);
  ok('THE BEAT INSIDE THE SLIDE: the pin hops ' + R.maxLift.toFixed(1) + ' px off its foot ' +
     'while it travels, and is back on the ground when it lands (' + R.restLift.toFixed(1) + ')',
     R.maxLift >= 1.5 && R.restLift < 0.01);
  ok('A FAR JUMP SNAPS: a landing twelve cells away moves the camera ' + R.snap.toFixed(0) +
     ' px on the first frame and ' + R.after.toFixed(1) + ' after', R.snap >= 60 && R.after < 0.5);
  await br.close();
  done();
})().catch(e => { console.log('  FAIL ' + e.message); fail++; done(); });
