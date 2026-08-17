#!/usr/bin/env node
/* ============================================================================
   THE DOOR IS THE FIGHT (RF4-C first deliverable, 8/17/26, COMBAT lane)

   Demo row 1: on the walked surface there is NO COMBAT ENTRY POINT. The 8/16 law
   names this as the first thing the RF4 effort ships -- "walk through a door,
   fight in the room" -- because it pays the demo immediately.

   VERIFY ON THE REAL SURFACE (7/18). The failure this gate exists to stop is the
   one this repo has paid for over and over: a wire that is PRESENT and DEAD.
   inMyRange was defined and never called. The damage faces were decoded and
   thrown away one line later. The city's autosave posted into a guard that
   dropped it. Every one of those passed a string check.

   So this does not read source. It BOOTS THE ALPHA, OPENS THE CITY THE WAY HIS
   THUMB DOES, WALKS A BODY THROUGH A REAL DOOR, and asserts:
     1. the city actually posts the encounter (the frame is not mute)
     2. the shell hears it and a REAL fight assembles in the combat frame
     3. it is the same V66 bridge, not a second handoff path
     4. when the fight settles he is put back on the block he was standing on
     5. the trigger is DETERMINISTIC -- the same building answers the same way,
        so the world is a place and not a slot machine he can farm

   It drives the SHIPPED functions. A gate that reimplements the handoff would be
   marking its own homework.
   ========================================================================== */
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const ALPHA = path.join(__dirname, '..', 'slices', 'BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  PASS ' + n)) : (fail++, console.log('  FAIL ' + n)); };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e && e.stack || e)));

  await page.goto('file://' + ALPHA);
  await page.waitForTimeout(9000);
  await page.mouse.click(215, 450); await page.waitForTimeout(2500);
  await page.mouse.click(215, 450); await page.waitForTimeout(2500);

  /* the city, opened the way his thumb opens it. THE WALKED SURFACE IS BEHIND
     THE RUN TAB -- there is no data-p="city" tab; the shell maps run -> p-city. */
  await page.click('[data-p="run"]');
  await page.waitForTimeout(12000);

  const cityFrame = page.frames().find(f => {
    try { return /BOHEMIA_CITY_WORLD/.test(f.url()) || f.name() === 'cityFrame'; } catch (e) { return false; }
  });
  ok('the CITY tab opens a live walked surface', !!cityFrame);
  if (!cityFrame) {
    console.log('=== COMBAT ENTRY GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed ===');
    await browser.close(); process.exit(1);
  }

  /* THE SHELL IS LISTENING? Ask the parent, not the source. */
  const shellReady = await page.evaluate(() => ({
    handler: typeof cityEncounterIn === 'function',
    home: typeof cityFightHome === 'function',
    bridge: typeof startEncounter === 'function',
  }));
  ok('the shell has a city-encounter handler, a way home, and the V66 bridge under it',
    shellReady.handler && shellReady.home && shellReady.bridge);

  /* THE CITY IS NOT MUTE. Observed ON THE PARENT, not by patching the child:
     the city frame is a separate file:// document, so it is cross-origin and
     window.parent.postMessage cannot be wrapped from inside it. Listening where
     the message actually lands is the better test anyway -- it proves the whole
     path (child posts -> parent receives) instead of just the call. */
  await page.evaluate(() => {
    window.__ENTRY_SEEN = null;
    window.addEventListener('message', ev => {
      const m = ev && ev.data;
      if (m && m.type === 'BOHEMIA_CITY_ENCOUNTER') window.__ENTRY_SEEN = m;
    });
  });

  const posted = await cityFrame.evaluate(() => {
    if (typeof cityFightOnEnter !== 'function') return { missing: true };
    /* INSIDE IS LIVE STATE THE RENDERER READS EVERY FRAME. Stubbing it with a
       fake floorplan to drive the roll left the city drawing an interior whose
       grid does not exist -- "Cannot read properties of undefined" out of
       renderInside, MY harness corrupting the surface rather than a shipped bug.
       Saved and put back. */
    const __was = (typeof INSIDE !== 'undefined') ? INSIDE : null;
    /* find a footprint that actually rolls a fight, then stand in it */
    let found = null;
    for (let i = 0; i < 4000 && !found; i++) {
      const f = { x: (i * 7) % 900, y: ((i * 13) % 900), w: 4 + (i % 5), h: 4 + ((i * 3) % 5) };
      INSIDE = { foot: f, fp: { W: f.w, H: f.h }, label: 'test room', zone: 'default', exit: { gx: f.x, gy: f.y - 1 } };
      if (cityFightRoll()) found = f;
    }
    if (!found) { INSIDE = __was; return { noFightEver: true }; }
    const fired = cityFightOnEnter();
    INSIDE = __was;
    return { fired, foot: found };
  });
  await page.waitForTimeout(600);
  posted.seen = await page.evaluate(() => window.__ENTRY_SEEN);

  ok('the city has the shipped trigger on it at all', !posted.missing);
  ok('some buildings hold a fight (the draft odds are not zero)', !posted.noFightEver);
  ok('WALKING IN POSTS A REAL ENCOUNTER UP THE BUS -- the frame is not mute, which is the exact failure mode this gate exists for',
    !!posted.fired && !!posted.seen && posted.seen.type === 'BOHEMIA_CITY_ENCOUNTER');
  ok('and the ROOM rides with it, at its real dimensions (INTERIOR-MATCHES-EXTERIOR), so the spec\'d indoor half has them waiting instead of needing another wire',
    !!(posted.seen && posted.seen.room && posted.seen.room.w > 0 && posted.seen.room.h > 0));
  ok('it is marked draft, because WHO IS IN THE ROOM is canon and canon is Paolo\'s',
    !!(posted.seen && posted.seen.draft === true));

  /* DETERMINISTIC: the same building answers the same way, every time. */
  /* AND THE DOOR ITSELF IS HOOKED UP. Everything above drives cityFightOnEnter
     directly, which proves the function works and NOT that walking through a
     door calls it -- exactly the "present and dead" blind spot this gate was
     written to catch, found by mutation-testing the gate against itself:
     deleting the call site from inEnter left all thirteen checks green.
     So this walks a body through a REAL door, via the shipped inEnter, and
     requires the encounter to land on the parent. */
  await page.evaluate(() => { window.__ENTRY_SEEN = null; });
  const throughDoor = await cityFrame.evaluate(() => {
    if (typeof inEnter !== 'function' || typeof inFootprint !== 'function') return { noDoor: true };
    const __was = (typeof INSIDE !== 'undefined') ? INSIDE : null;
    let tried = 0, entered = 0, last = null;
    for (let y = 0; y < 400 && entered < 40; y += 3) {
      for (let x = 0; x < 400 && entered < 40; x += 3) {
        let f = null; try { f = inFootprint(x, y); } catch (e) { }
        if (!f) continue;
        tried++;
        let got = false;
        try { got = inEnter(x, y, x, y - 1, false); } catch (e) { }
        if (got) { entered++; last = { x: x, y: y, foot: f }; }
      }
    }
    INSIDE = __was;
    return { tried, entered, last };
  });
  await page.waitForTimeout(600);
  const doorSeen = await page.evaluate(() => window.__ENTRY_SEEN);
  ok('WALKING THROUGH A REAL DOOR, via the shipped inEnter, starts the fight -- not just calling the trigger by hand'
    + ' (' + throughDoor.entered + ' real entries out of ' + throughDoor.tried + ' footprints)',
    throughDoor.entered > 0 && !!doorSeen && doorSeen.type === 'BOHEMIA_CITY_ENCOUNTER');

  const stable = await cityFrame.evaluate((foot) => {
    const __was = (typeof INSIDE !== 'undefined') ? INSIDE : null;
    const runs = [];
    for (let k = 0; k < 5; k++) {
      INSIDE = { foot: foot, fp: { W: foot.w, H: foot.h }, label: 'test room', zone: 'default', exit: { gx: 0, gy: 0 } };
      runs.push(cityFightRoll());
    }
    /* and a DIFFERENT building must be able to answer differently, or the roll
       is a constant wearing a hash costume */
    let differs = false;
    for (let i = 0; i < 4000 && !differs; i++) {
      const f = { x: (i * 11) % 900, y: ((i * 17) % 900), w: 3 + (i % 6), h: 3 + ((i * 5) % 6) };
      INSIDE = { foot: f, fp: { W: f.w, H: f.h }, label: 'x', zone: 'default', exit: { gx: 0, gy: 0 } };
      if (cityFightRoll() !== runs[0]) differs = true;
    }
    INSIDE = __was;
    return { allSame: runs.every(v => v === runs[0]), differs };
  }, posted.foot);
  ok('THE SAME BUILDING ANSWERS THE SAME WAY EVERY TIME -- a per-entry coin flip would read as broken and would let him farm a door by walking in and out',
    stable.allSame);
  ok('and different buildings answer differently, so the roll is a real hash and not a constant in a costume',
    stable.differs);

  /* END TO END: the shell takes the message and a REAL fight assembles. */
  const fight = await page.evaluate(async () => {
    cityEncounterIn({ label: 'test room', faction: null, draft: true, room: { w: 6, h: 5 },
      roster: [{arch:'human'},{arch:'human'},{arch:'bot'}], at: { gx: 12, gy: 34 } });
    await new Promise(r => setTimeout(r, 6000));
    return {
      cityfight: (typeof CITYFIGHT !== 'undefined') && CITYFIGHT === true,
      enc: !!(G.encounter && !G.encounter.settled),
      fromCity: !!(G.encounter && G.encounter.fromCity),
      roster: (G.encounter && G.encounter.roster) ? G.encounter.roster.length : 0,
      onCombatTab: !!document.querySelector('.panel.on#p-combat'),
    };
  });
  ok('THE SHELL HEARS IT AND A REAL FIGHT ASSEMBLES: an encounter is live, it knows it came from the city, and it has actual men in it',
    fight.cityfight && fight.enc && fight.fromCity && fight.roster > 0);
  ok('and it puts him on the COMBAT surface, rather than starting a fight he cannot see',
    fight.onCombatTab);

  /* AND HOME AGAIN. Observed in the CITY FRAME, for the same cross-origin
     reason: listen where the message lands rather than wrapping a foreign
     window's postMessage. */
  await cityFrame.evaluate(() => {
    window.__HOME_SEEN = null;
    window.addEventListener('message', ev => {
      const m = ev && ev.data;
      if (m && m.type === 'BOHEMIA_CITY_COMBAT_END') window.__HOME_SEEN = m;
    });
  });
  const home = await page.evaluate(async () => {
    let sentDown = true;   /* observed on the city side below */
    const ret = cityFightHome({ result: 'win', victory: true });
    await new Promise(r => setTimeout(r, 1200));
    return { ret, sentDown, onCityTab: !!document.querySelector('.panel.on#p-city'),
      cleared: (typeof CITYFIGHT !== 'undefined') && CITYFIGHT === false };
  });
  const homeSeen = await cityFrame.evaluate(() => window.__HOME_SEEN);
  ok('WHEN IT SETTLES HE IS PUT BACK ON THE BLOCK HE WAS STANDING ON: the city tab comes back, the city is TOLD the outcome (observed arriving in the city frame, not merely sent), and the flag is cleared so the next door is a fresh fight',
    home.ret && !!homeSeen && home.onCityTab && home.cleared);

  ok('no page errors through the whole round trip', errors.length === 0);
  if (errors.length) console.log('    ' + errors.slice(0, 3).join('\n    '));

  console.log('=== COMBAT ENTRY GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  await browser.close();
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL gate threw: ' + e.message);
  console.log('=== COMBAT ENTRY GATE: 0 passed, 1 failed ===');
  process.exit(1);
});
