#!/usr/bin/env node
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
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
  await SETTLE(page, 9000);
  await page.mouse.click(215, 450); await SETTLE(page, 2500);
  await page.mouse.click(215, 450); await SETTLE(page, 2500);

  /* the city, opened the way his thumb opens it. THE WALKED SURFACE IS BEHIND
     THE RUN TAB -- there is no data-p="city" tab; the shell maps run -> p-city. */
  await page.click('[data-p="run"]');
  await SETTLE(page, 12000);

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
  await SETTLE(page, 600);
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
  await SETTLE(page, 600);
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
  ok('WHEN IT SETTLES HE IS PUT BACK ON THE BLOCK HE WAS STANDING ON: the city tab comes back, the outcome is DELIVERED to the city frame, and the flag is cleared so the next door is a fresh fight',
    home.ret && !!homeSeen && home.onCityTab && home.cleared);

  /* *** AND THE CITY ACTUALLY HEARD IT, WHICH IS A DIFFERENT CLAIM (8/21). ***
     The assertion above used to say "the city is TOLD the outcome" and proved it
     with the listener THIS GATE INSTALLS three lines up. That proves DELIVERY.
     It cannot prove CONSUMPTION -- the listener it observed with is its own -- and
     "the city is TOLD" reads as "the city knows". A GATE THAT SUPPLIES THE
     LISTENER IT IS TESTING FOR IS MEASURING THE POSTMAN.
     Measured 8/21: the city had FIVE message listeners and not one of them was
     BOHEMIA_CITY_COMBAT_END, so he walked through a door, fought, and the world
     he walked back into never found out. WINNING AND LOSING WERE THE SAME EVENT.
     These claims are about the city's OWN handler. */
  /* WATCH WHAT THE CITY ASKS THE SHELL FOR. Installed in the SHELL, because that
     is where those messages land -- listening anywhere else would be measuring
     the postman again, which is the bug the claims above were written for. */
  await page.evaluate(() => {
    window.__ASKED = [];
    window.addEventListener('message', ev => {
      const d = ev && ev.data; if (!d) return;
      if (d.bohemiaCityNeedRestore !== undefined) window.__ASKED.push('needRestore');
      if (d.bohemiaCitySfx) window.__ASKED.push('sfx:' + d.bohemiaCitySfx.ev);
    });
  });
  await SETTLE(page, 400);
  const consumed = await cityFrame.evaluate(() => ({
    home: window.__FIGHT_CAME_HOME || null,
    notes: (typeof DAY !== 'undefined' && DAY.summary) ? DAY.summary().notes.slice() : [],
    qline: (document.getElementById('qline') || {}).textContent || '',
  }));
  ok('THE CITY ITSELF HEARS THE FIGHT COME HOME -- its own handler ran, not the '
    + 'one this gate installed to watch the postman', !!consumed.home);
  ok('...and it lands in the day ledger, which the reckoning card already renders '
    + 'under WHAT HAPPENED, so the fight is a line on the card he meets that night'
    + ' (' + consumed.notes.length + ' note(s))', consumed.notes.length >= 1);
  ok('...and he can see it WITHOUT waiting for nightfall: it is on the objective '
    + 'line ("' + consumed.qline.trim().slice(0, 44) + '")', consumed.qline.trim() !== '');

  /* WINNING AND LOSING MUST NOT BE THE SAME EVENT. That was literally true
     before the consumer existed, and it is the cheapest possible regression to
     re-introduce: a handler that ignores `outcome` looks identical from outside. */
  const wonAsked = await page.evaluate(() => { const a = window.__ASKED.slice(); window.__ASKED = []; return a; });
  /* WATCH THE CALL, NOT THE LEFTOVER. The ledger line is rolled back a moment
     later by design, so the only honest place to see it is the call itself. */
  await cityFrame.evaluate(() => {
    window.__HAPPENED = [];
    if (typeof DAY !== 'undefined' && DAY.happened && !DAY.__wrapped) {
      const orig = DAY.happened.bind(DAY);
      DAY.happened = function (line, tag) { window.__HAPPENED.push(tag || ''); return orig(line, tag); };
      DAY.__wrapped = true;
    }
  });
  const lost = await (async () => {
    await page.evaluate(() => {
      try { CITYFIGHT = true; CITYFIGHT_AT = { gx: 6, gy: 6 };
        cityFightHome({ result: 'loss', victory: false }); } catch (e) { }
    });
    await SETTLE(page, 1500);
    return cityFrame.evaluate(() => ({
      home: window.__FIGHT_CAME_HOME || null,
      qline: (document.getElementById('qline') || {}).textContent || '',
      notes: (typeof DAY !== 'undefined' && DAY.summary) ? DAY.summary().notes.length : 0,
    }));
  })();
  const asked = await page.evaluate(() => window.__ASKED.slice());
  const lostRecorded = await cityFrame.evaluate(
    () => (window.__HAPPENED || []).indexOf('fight') >= 0);
  ok('LOSING IS NOT THE SAME EVENT AS WINNING -- the world says something '
    + 'different about it ("' + lost.qline.trim().slice(0, 44) + '")',
    !!lost.home && lost.home.won === false && lost.qline.trim() !== consumed.qline.trim());
  /* THIS CLAIM CHANGED MEANING THE DAY DEATH BECAME A RELOAD (8/22), and the
     honest thing is to say what is now true rather than keep a green.
     It used to be `lost.notes > consumed.notes.length` -- the loss adds a
     ledger line. It still WRITES one: DAY.happened fires, watched below. But the
     line does not SURVIVE, because the very next thing that happens is
     applyRestore putting him back in the day BEFORE the fight, and a note
     written in a timeline you have just left is supposed to go with it. Asserting
     the note is still there after a rollback would be asserting the rollback
     failed. So: the loss is RECORDED (proved by watching the call), and the day
     it was recorded in is GONE (which is the ruling working). */
  ok('...and a lost fight is RECORDED as it happens -- DAY.happened fires for it, '
    + 'not only for the wins', lostRecorded === true);

  /* *** DEATH IS A RELOAD, NOT A RESET (Paolo 7/26) -- ON THE SURFACE HE PLAYS.
     Measured 8/22 against the REAL outcome object combat builds: a loss fires
     with playerHP 0 and three of them still standing, and the world said "you
     walked out anyway". Carried here from the run slice, which has had the
     ruling since July on a surface nobody sees. */
  const wentDown = await cityFrame.evaluate(() => window.__WENT_DOWN || null);
  ok('GOING DOWN IS A THING THAT HAPPENS TO HIM: the city marks it, rather than '
    + 'telling a man on the floor that he strolled out', !!wentDown);
  ok('...and it asks for THE CLOSEST SAVE on the same channel the BOOT already '
    + 'uses (bohemiaCityNeedRestore -> CITYSAVE.load -> applyRestore), so going '
    + 'down did not grow a second save system',
    asked.indexOf('needRestore') >= 0);
  ok('...and HIS approved sound plays -- went_down, the one of thirty-five he '
    + 'kept on 8/16', asked.indexOf('sfx:went_down') >= 0);
  ok('...and the SOUND COMES BEFORE THE ROLLBACK, because it belongs to going '
    + 'down and not to the save that answers it',
    asked.indexOf('sfx:went_down') >= 0
    && asked.indexOf('sfx:went_down') < asked.indexOf('needRestore'));
  ok('AND A WIN NEVER ROLLS HIM BACK -- winning a fight must not cost him the '
    + 'day he just spent', wonAsked.indexOf('needRestore') < 0);
  /* NO DAMAGE BEFORE THE DIAL, still: this reads the outcome combat ALREADY
     reports and answers it. It must never grow a health number of its own. */
  ok('and going down still invents no health, wound or threshold of its own',
    !/__DEATH_IS_A_RELOAD__[\s\S]{0,1800}?(hp|health|wound)\s*[-+=]\s*\d/i
      .test(require('fs').readFileSync(
        require('path').join(__dirname, '..', 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8')));
  /* NO DAMAGE BEFORE THE DIAL: the consumer REPORTS and must never start
     punishing him on my initiative. If a health or wound number ever appears in
     that handler it is a ruling somebody made, and it should be his. */
  ok('and it still REPORTS rather than punishes -- NO DAMAGE BEFORE THE DIAL',
    !/__THE_FIGHT_COMES_HOME__[\s\S]{0,2000}?(hp|health|wound|damage)\s*[-+=]/i
      .test(require('fs').readFileSync(
        require('path').join(__dirname, '..', 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8')));

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
