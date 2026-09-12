#!/usr/bin/env node
/* ============================================================================
   THE FIGHT KNOWS WHAT TIME IT IS
   (9/12/26, COMBAT lane, VAMILY [loot kept], third of three = BB-THE-FIGHT-KNOWS-THE-DAY)

   The backlog's own measurement: enter(G,d,env) receives the player's HP, a
   roster, a package id and a stamina max, and NO hour, NO temperature, NO
   weather -- in a game whose walked city organises its entire day around the heat
   and whose every person carries a heatTol.

   THIS DRIVES THE REAL GAME. It changes the city's clock to a known hour, starts a
   real encounter through the shipped door, and asks the fight what it thinks the
   world is doing. Then it puts the clock somewhere else and does it again, because
   a payload that is CORRECT ONCE can be a constant.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.join(__dirname, '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
  '.css': 'text/css', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((rq, rp) => {
      const u = decodeURIComponent((rq.url || '/').split('?')[0]);
      const f = path.join(REPO, u);
      if (!f.startsWith(REPO) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        rp.writeHead(404); return rp.end('no'); }
      rp.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(rp);
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}

let pass = 0, fail = 0, SRV = null;
const ok = (n, c) => { c ? (pass++, console.log('  PASS ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = async (b) => { if (b) await b.close(); if (SRV) try { SRV.close(); } catch (e) {}
  console.log('=== FIGHT KNOWS DAY GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0); };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 200)));

  SRV = await serve();
  const BASE = 'http://127.0.0.1:' + SRV.address().port;
  await page.goto(BASE + '/slices/BOHEMIA_ALPHA_0_9.html', { waitUntil: 'load', timeout: 120000 });
  await sleep(9000);
  await page.mouse.click(215, 450); await sleep(2500);
  await page.mouse.click(215, 450); await sleep(4000);
  await page.evaluate(() => { try { markBeatTaught(); } catch (e) {} });

  const city = page.frames().find(f => { try { return f.name() === 'cityFrame'; } catch (e) { return false; } });
  ok('the walked street is on screen, which is the only thing that knows what time it is', !!city);
  if (!city) return done(browser);

  /* ---- 1. the city can answer, and every answer is ITS OWN ---------------- */
  const noon = await city.evaluate(() => { T.min = 13 * 60; T.day = 3;
    return { w: cityWorldNow({ gx: 200, gy: 200 }),
      popFrom: (typeof BohemiaPopulation !== 'undefined' && BohemiaPopulation)
        ? [BohemiaPopulation.HEAT_FROM, BohemiaPopulation.HEAT_TO] : null,
      sun: !!sunVec() }; });
  const night = await city.evaluate(() => { T.min = 23 * 60; T.day = 3;
    return { w: cityWorldNow({ gx: 200, gy: 200 }), sun: !!sunVec() }; });
  console.log('  at 13:00 ' + JSON.stringify(noon.w));
  console.log('  at 23:00 ' + JSON.stringify(night.w));
  ok('THE CITY CAN SAY WHAT THE WORLD IS DOING, and it is the city\'s own clock and nobody\'s copy of it: 13:00 reads '
    + noon.w.clock + ' in the heat (' + noon.w.inHeat + ', window ' + JSON.stringify(noon.w.heatWindow)
    + ') and 23:00 reads ' + night.w.clock + ' at night (' + night.w.night + ', in the heat ' + night.w.inHeat
    + '). THE HEAT WINDOW IS READ OFF BohemiaPopulation (' + JSON.stringify(noon.popFrom)
    + ') AND NOT COPIED, because 11:00 to 16:00 is the window every person\'s heatTol is already judged against and a second copy of it is a second truth that drifts the first time either moves',
    !!noon.w && !!night.w && noon.w.clock === '13:00' && night.w.clock === '23:00'
    && noon.w.inHeat === true && night.w.inHeat === false && night.w.night === true
    && Array.isArray(noon.w.heatWindow) && noon.popFrom
    && noon.w.heatWindow[0] === noon.popFrom[0] && noon.w.heatWindow[1] === noon.popFrom[1]);

  ok('AND THERE IS NO TEMPERATURE IN DEGREES IN IT, which is the line this row refused to cross. Nothing in the repo holds one: "summer 40C+ afternoons" is a sentence in a comment and the heat is a WINDOW, so a number here would be this tool authoring the climate of his valley. degrees reads '
    + JSON.stringify(noon.w.degrees) + ' and the payload is tagged draft ' + noon.w.draft,
    noon.w.degrees === null && noon.w.draft === true);

  ok('and SHADE is derived from the same sun and the same cell test that PAINTS the shadows, so being in shade means the same thing as the shadow he can see: with the sun up (' + noon.sun
    + ') the answer is a real true or false (' + JSON.stringify(noon.w.shade)
    + '), and with the sun below the horizon (' + night.sun + ') the whole valley is shade (' + JSON.stringify(night.w.shade) + ')',
    typeof noon.w.shade === 'boolean' && night.sun === false && night.w.shade === true);

  /* ---- 2. IT RIDES IN WITH A REAL FIGHT, THROUGH THE SHIPPED DOOR --------- */
  for (const probe of [{ min: 13 * 60, name: 'the worst of the heat' }, { min: 23 * 60, name: 'the middle of the night' }]) {
    await page.evaluate(() => { window.__W = null;
      window.addEventListener('message', e => { const d = e && e.data;
        if (d && d.type === 'BOHEMIA_CITY_ENCOUNTER') window.__W = d.world || null; }); });
    const fired = await city.evaluate((min) => {
      T.min = min;
      const realAdj = window.ctAdjacent;
      window.ctAdjacent = () => ({ id: 'kd_foe_' + min, home: [3, 3], hostile: true });
      SF_STEPS = 9999; SF_LAST = -9999; SF_DONE = {};
      try { contactClear(); } catch (e) {}
      FZOOMING = false;
      const r = streetFightOnStep();
      window.ctAdjacent = realAdj;
      return r;
    }, probe.min);
    await sleep(4000);
    const seen = await page.evaluate(() => window.__W);
    console.log('  ' + probe.name + ': fired ' + fired + ', world on the wire ' + JSON.stringify(seen));
    ok('AND IT RIDES IN WITH A REAL FIGHT at ' + probe.name + ', stamped in ONE place: all four ways into a fight already come through the same door, so a street bump, a crew, a road party and a door into a room all carry the hour without four copies of anything. The message carries '
      + (seen && seen.clock) + ', in the heat ' + (seen && seen.inHeat) + ', night ' + (seen && seen.night)
      + ', shade ' + JSON.stringify(seen && seen.shade),
      fired === true && !!seen && seen.min === probe.min
      && seen.inHeat === (probe.min === 13 * 60) && seen.night === (probe.min === 23 * 60));
    await sleep(2500);
    const inFight = await (async () => {
      const cfr = page.frames().find(f => { try { return f.name() === 'combatFrame'; } catch (e) { return false; } });
      if (!cfr) return null;
      return cfr.evaluate(() => (G && G.world) ? { min: G.world.min, clock: G.world.clock,
        inHeat: G.world.inHeat, night: G.world.night, shade: G.world.shade } : null);
    })();
    console.log('  the fight holds: ' + JSON.stringify(inFight));
    ok('*** AND THE FIGHT ITSELF KEEPS IT, WHICH IS THE ROW. *** enter() ran cleanSlate first -- "nothing from the last fight survives" -- and this is still there afterwards, the same way the room survives it, because it rides as its OWN message ahead of the encounter rather than as a new field in the shared handoff contract. At '
      + probe.name + ' the fight holds ' + (inFight && inFight.clock) + ' and in the heat ' + (inFight && inFight.inHeat),
      !!inFight && inFight.min === probe.min && inFight.inHeat === (probe.min === 13 * 60));
    /* home again for the next probe */
    await page.click('[data-p="run"]', { timeout: 15000 }).catch(() => {});
    await sleep(2500);
  }

  /* ---- 3. AND IT GOES BACK OUT WITH THE RESULT ---------------------------- */
  const cf = page.frames().find(f => { try { return f.name() === 'combatFrame'; } catch (e) { return false; } });
  const echo = cf ? await cf.evaluate(() => {
    try { G._endSent = false; const p = BohemiaHandoff.end(G, true, 'cleared', function () {});
      return p && p.world ? { min: p.world.min, clock: p.world.clock } : null; } catch (e) { return { err: String(e).slice(0, 80) }; }
  }) : null;
  console.log('  the echo out: ' + JSON.stringify(echo));
  ok('and the world goes back OUT with the result, echoed and never re-derived, so a quest step matching an outcome can see what the fight was standing in ('
    + JSON.stringify(echo) + '). The fight has no clock of its own and must not grow one',
    !!echo && typeof echo.min === 'number' && !echo.err);

  /* ---- 4. NO DAMAGE BEFORE THE DIAL -------------------------------------- */
  const src = cf ? await cf.evaluate(() => ({
    read: typeof worldRead === 'function',
    /* the whole point: it is CARRIED and SHOWN, and nothing reads it to move a number */
    usedInDamage: /G\.world/.test(String(typeof dmgOf === 'function' ? dmgOf : '')) })) : null;
  ok('NO DAMAGE BEFORE THE DIAL: the fight knows the hour and does NOTHING with it. It is carried, said once on the bell, and echoed back out; what heat DOES to a fight is a damage dial this lane is not allowed to touch, so nothing reads it to change a number (the readout exists: '
    + (src && src.read) + ')', !!src && src.read === true && src.usedInDamage === false);

  ok('no page errors through the whole round trip', errors.length === 0);
  if (errors.length) console.log('    ' + errors.slice(0, 3).join('\n    '));

  return done(browser);
})().catch(async e => {
  console.log('  FAIL gate threw: ' + (e && e.message));
  console.log('=== FIGHT KNOWS DAY GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed ===');
  process.exit(1);
});
