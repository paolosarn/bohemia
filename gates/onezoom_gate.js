/* ============================================================================
   ONE ZOOM GATE (8/12/26) — from his feet to the moon, and back, on one camera.

   Paolo 8/12: "my original intention was that is was this zoom out vibe you could
   keep zooming out and zooming out until it showed the moon you know. that was my
   original philosophy and i want to stick with that thats my flavor."

   IT WAS ALREADY LOCKED AND ALREADY HALF-BUILT. The 7/25 law
   (BOHEMIA_ADDENDUM_CITYBUILDER_TOP_DOWN_ONLY_7_25_26.md) locked the continuum in
   his words and shipped two of its three bands, and its LAST LINE parks the third:
   "STILL TO COME: the third zoom band (keep zooming out to see the rest of the
   world)". Eighteen days. And the moonshot law (7/19) says the camera levels ARE
   "street / city / planetary zoom" and Act 3 ends "looking down at the planet" --
   so this axis is the spine of the story, not a flourish.

   WHAT WAS IN THE WAY WAS ONE LINE: setZoomAt clamped with Math.max(zmin, ...).
   zmax already had a seam that hands you to your character; zmin was a wall.

   THIS GATE DRIVES THE REAL CAMERA IN A REAL BROWSER and refuses to let it rot:
     1. THE CHAIN IS UNBROKEN OUTWARD  -- human -> city -> REGION -> PLANET -> MOON
     2. THE CHAIN IS UNBROKEN INWARD   -- and it comes all the way back to his feet
     3. IT IS ONE CAMERA, NOT A CUT    -- every band actually paints, and the pixels
        CHANGE between bands (a state machine that renders the same frame is a
        state machine, not a zoom)
     4. THE DIAMOND SURVIVES           -- the valley is still drawn by the city's own
        iso projection in the REGION band, so his "keep it all on this diamond
        isometric 45 degree angle view" holds
     5. THE PHONE IS A DOOR            -- GO on the phone's map moves the run's camera
        and NEVER moves his body (moving the player is how CITY TALK went red on
        8/11, and that must not come back through a different door)
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const LAW = path.join(ROOT, 'laws/BOHEMIA_ADDENDUM_CITYBUILDER_TOP_DOWN_ONLY_7_25_26.md');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('ONE ZOOM GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* ---- 1. it is in the surface he plays, and it cites the law it completes -- */
{
  const c = fs.readFileSync(CITY, 'utf8');
  ok('the third zoom band is in the city he walks', c.indexOf('__ONE_ZOOM_TO_THE_MOON__') >= 0);
  ok('the zmin WALL is gone -- pulling out at the valley fit hands off instead of clamping',
     /if\(z<zmin&&Math\.abs\(CZOOM-zmin\)<1e-3\)\{\s*skyEnter\(\);/.test(c));
  ok('the phone can move the run\'s camera', c.indexOf('bohemiaPhoneGo') >= 0);
  ok('the 7/25 law that parked this band still exists to be completed', fs.existsSync(LAW));
  const law = fs.readFileSync(LAW, 'utf8').replace(/\s+/g, ' ');
  ok('and it really is the band that law deferred',
     /STILL TO COME: the third zoom band/.test(law));
}

/* ---- 2. drive the real camera ------------------------------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available to drive the real camera', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 120000 });
  for (let i = 0; i < 90; i++) { if (await pg.$('#daycardIn .dcgo')) break; await SETTLE(pg, 200); }
  const g0 = await pg.$('#daycardIn .dcgo');
  if (g0) { await pg.$eval('#daycardIn .dcgo', el => el.click()); await SETTLE(pg, 300); }

  const trip = await pg.evaluate(() => {
    const tag = () => SKY ? ('SKY:' + skyBand())
                          : (MODE === 'human' ? 'human' : 'city');
    const seen = [], push = () => { const t = tag(); if (seen[seen.length - 1] !== t) seen.push(t); };
    push();
    /* the same calls the pinch makes. setHZoom only hands off once HZOOM is
       already at the lowest stop, so it is driven until the mode actually flips
       rather than once and hoped. */
    for (let i = 0; i < 12 && MODE === 'human'; i++) { setHZoom(HLEVELS[0] * 0.9); push(); }
    for (let i = 0; i < 90 && !SKY && MODE === 'city'; i++) { setZoomAt(CZOOM * 0.877); push(); }
    for (let i = 0; i < 30 && SKY && SKYU < 1; i++) { skyZoom(-1); push(); }
    const out = { outward: seen, u: SKYU, drawn: window.__SKY_DRAWN || 0 };

    const back = [], pb = () => { const t = tag(); if (back[back.length - 1] !== t) back.push(t); };
    pb();
    for (let i = 0; i < 40 && SKY; i++) { skyZoom(1); pb(); }
    for (let i = 0; i < 60 && MODE === 'city'; i++) { setZoomAt(CZOOM * 1.14); pb(); }
    out.back = back; out.endMode = MODE; out.endSky = SKY;
    return out;
  });

  ok('OUTWARD the chain is unbroken: human -> city -> REGION -> PLANET -> MOON ('
     + trip.outward.join(' -> ') + ')',
     JSON.stringify(trip.outward) === JSON.stringify(['human', 'city', 'SKY:REGION', 'SKY:PLANET', 'SKY:MOON']));
  ok('and it really reaches the top of the pull-out', trip.u >= 0.99);
  ok('the sky is actually PAINTED, not just a state (' + trip.drawn + ' draws)', trip.drawn >= 3);
  ok('INWARD it comes all the way back down to his feet (' + trip.back.join(' -> ') + ')',
     trip.endMode === 'human' && trip.endSky === false
     && JSON.stringify(trip.back) === JSON.stringify(['SKY:MOON', 'SKY:PLANET', 'SKY:REGION', 'city', 'human']));

  /* ---- 3. it is a ZOOM, not a cut: the pixels differ band to band -------- */
  const shots = await pg.evaluate(() => {
    const grab = () => {
      const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
      let h = 2166136261;
      for (let i = 0; i < d.length; i += 997) { h ^= d[i]; h = Math.imul(h, 16777619) >>> 0; }
      return h;
    };
    for (let i = 0; i < 12 && MODE === 'human'; i++) setHZoom(HLEVELS[0] * 0.9);
    for (let i = 0; i < 90 && !SKY && MODE === 'city'; i++) setZoomAt(CZOOM * 0.877);
    const out = {};
    render(); out.region = grab();
    while (SKY && skyBand() !== 'PLANET') skyZoom(-1);
    render(); out.planet = grab();
    while (SKY && skyBand() !== 'MOON') skyZoom(-1);
    for (let i = 0; i < 10 && SKYU < 1; i++) skyZoom(-1);
    render(); out.moon = grab();
    return out;
  });
  ok('REGION and PLANET are different pictures', shots.region !== shots.planet);
  ok('PLANET and MOON are different pictures', shots.planet !== shots.moon);
  ok('and REGION is not the MOON', shots.region !== shots.moon);

  /* ---- 4. the diamond survives the REGION band -------------------------- */
  const diamond = await pg.evaluate(() => {
    while (SKY && skyBand() !== 'REGION') skyZoom(1);
    if (!SKY) return { none: true };
    /* the valley in the REGION band is drawn by the city's OWN iso projection --
       iso() -- not by a second flat renderer. Prove it by moving the city marker
       and watching the painted valley move with it. */
    const grab = () => { const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
      let h = 2166136261; for (let i = 0; i < d.length; i += 997) { h ^= d[i]; h = Math.imul(h, 16777619) >>> 0; } return h; };
    render(); const a = grab();
    const c0 = city.x; city.x = Math.max(0, Math.min(om.n - 1, city.x + 12));
    render(); const c = grab();
    city.x = c0; render();
    return { moved: a !== c, usesIso: typeof iso === 'function' };
  });
  ok('the REGION band draws the valley with the CITY\'S OWN iso projection, so the'
     + ' diamond never breaks (his 7/25 law)', diamond.usesIso === true && diamond.moved === true);

  /* ---- 5. the phone is a door, and it never moves his body -------------- */
  const jump = await pg.evaluate(() => {
    for (let i = 0; i < 40 && SKY; i++) skyZoom(1);
    const before = { hx: hx, hy: hy, cx: city.x, cy: city.y };
    const tx = Math.max(0, Math.min(om.n - 1, city.x + 9));
    const ty = Math.max(0, Math.min(om.n - 1, city.y + 7));
    window.postMessage({ bohemiaPhoneGo: { x: tx, y: ty } }, '*');
    return { before: before, want: [tx, ty] };
  });
  await SETTLE(pg, 300);
  const after = await pg.evaluate(() => ({ hx: hx, hy: hy, cx: city.x, cy: city.y,
                                           got: window.__PHONE_GO || 0, sky: SKY }));
  ok('GO on the phone moves the run\'s camera to the cell he tapped',
     after.got >= 1 && after.cx === jump.want[0] && after.cy === jump.want[1]);
  ok('and it NEVER moves his body -- his feet are not the phone\'s business'
     + ' (that is how CITY TALK went red on 8/11)',
     after.hx === jump.before.hx && after.hy === jump.before.hy);

  await b.close();
  ok('no page error anywhere from his feet to the moon and back'
     + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  done();
})();
