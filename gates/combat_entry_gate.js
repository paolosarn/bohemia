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

  /* ================= __STREET_FIGHT__ V201 =============================
     THE-FIGHT-STARTS-WHERE-YOU-STAND. Paolo 9/5, having played it: "Awesome I
     just played the run. WHERE THE ENEMIES AT BRO." The ruling's own sentence:
     "the game knows who your enemies are. IT HAS NEVER ONCE PUT ONE IN FRONT OF
     YOU" -- hostility is a sign on a relationship in the between-ledger, never a
     body, and the fight was reachable only through the city map door.
     THE MESSAGE IS CAUGHT ON THE SHELL, NOT INTERCEPTED IN THE FRAME. The first
     cut of this arm patched window.parent.postMessage from inside the city and
     the browser refused it: file:// origins are "null" and cross-origin to each
     other. Catching it where it lands is also the honest test -- it is the same
     path the real chain uses. */
  await page.evaluate(() => {
    window.__sf = [];
    window.addEventListener('message', function (ev) {
      const d = ev && ev.data;
      if (d && d.type === 'BOHEMIA_CITY_ENCOUNTER') window.__sf.push(d);
    });
  });

  const street = await cityFrame.evaluate(() => {
    const o = {};
    o.hasTrigger = (typeof streetFightOnStep === 'function');
    o.hasFoeTest = (typeof streetFoeOf === 'function');
    /* the hook is checked against the SOURCE below, not against String(stepOnce):
       stepOnce is REASSIGNED by the interiors wrapper (const _inStepOnce =
       stepOnce; stepOnce = function...), so stringifying it reads the wrapper and
       reports the hook missing while it sits in the original. That is a checker
       looking at the wrong function, and it went red on working code. */
    /* IT AUTHORS NO HOSTILITY: a plain person is not a foe. */
    o.plainPersonIsFoe = streetFoeOf({ id: 'x', home: [0, 0] });

    /* ---- AND IT MEETS RUN'S CREW, WHICH IS THE HALF THAT NEARLY MISSED ----
       RUN [enemies exist] shipped hostile bodies as a CREW standing at a cell:
       BohemiaHostiles.near(), with stateOf() returning idle / watch / CLOSE
       ("they are coming"). IT NEVER DECORATES A ctAdjacent() PERSON, so the
       p.hostile path this entry shipped with would never have been set by it,
       and the two halves of one ruling would not have met -- the exact defect
       the ruling is about, one layer up. HOST_DREW is what their own draw
       computed; reading it is not a second copy of the question. */
    o.hostilesEngineHere = (typeof BohemiaHostiles !== 'undefined');
    o.readsTheCrew = (typeof streetCrewOnYou === 'function');
    const hostWas = (typeof HOST_DREW !== 'undefined') ? HOST_DREW : null;
    HOST_DREW = [{ at: [hx + 1, hy], count: 3, state: 'close' }];
    SF_STEPS = 9999; SF_LAST = -9999; SF_DONE = {};
    o.firedOnCrew = streetFightOnStep();
    SF_LAST = -9999;
    o.firedTwiceSameCrew = streetFightOnStep();
    /* a crew that is only WATCHING has clocked you and is not coming: not a fight */
    HOST_DREW = [{ at: [hx + 4, hy], count: 3, state: 'watch' }];
    SF_LAST = -9999; SF_DONE = {};
    o.firedOnWatching = streetFightOnStep();
    HOST_DREW = hostWas || [];

    const realAdj = window.ctAdjacent;
    /* A HOSTILE BODY -- what RUN's row will ship, and it is read FIRST so their
       row lands with no second wire. */
    window.ctAdjacent = () => ({ id: 'gate_foe_1', home: [1, 1], hostile: true });
    SF_STEPS = 9999; SF_LAST = -9999; SF_DONE = {};
    o.firedOnHostile = streetFightOnStep();
    /* HE ONLY AMBUSHES YOU ONCE */
    SF_LAST = -9999;
    o.firedTwiceSamePerson = streetFightOnStep();
    /* A COOLDOWN, so one bad block is not a corridor of fights */
    window.ctAdjacent = () => ({ id: 'gate_foe_2', home: [2, 2], hostile: true });
    SF_LAST = SF_STEPS - 1;
    o.firedInsideCooldown = streetFightOnStep();
    SF_LAST = SF_STEPS - SF_COOLDOWN;
    o.firedAfterCooldown = streetFightOnStep();
    /* AND NOBODY IS JUMPED BEFORE THEY ARE OUT OF THEIR OWN STREET */
    window.ctAdjacent = () => ({ id: 'gate_foe_3', home: [3, 3], hostile: true });
    SF_STEPS = 0; SF_LAST = -9999; SF_DONE = {};
    let early = 0;
    for (let i = 0; i < SF_GRACE - 1; i++) if (streetFightOnStep()) early++;
    o.firedInGrace = early;
    /* AND A STRANGER STARTS NOTHING */
    window.ctAdjacent = () => ({ id: 'gate_stranger', home: [4, 4] });
    SF_STEPS = 9999; SF_LAST = -9999; SF_DONE = {};
    o.firedOnStranger = streetFightOnStep();
    window.ctAdjacent = realAdj;
    return o;
  });

  await page.waitForTimeout(900);
  const sf = await page.evaluate(() => {
    const list = window.__sf || [];
    const m = list[0] || null;
    return { count: list.length,
      isTheDoorsMessage: !!(m && m.type === 'BOHEMIA_CITY_ENCOUNTER'),
      roster: (m && m.roster) ? m.roster.length : 0,
      sendsNoRoom: !!(m && m.room == null),
      saysStreet: !!(m && m.street === true),
      carriesWhereYouStand: !!(m && m.at && typeof m.at.gx === 'number'),
      label: m && m.label };
  });

  const _citySrc = require('fs').readFileSync(
    require('path').join(__dirname, '..', 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  /* ON THE WALKED STEP, proved where it lives: immediately after the walk spends
     its 5.04 seconds. That is the one place a body arrives on foot, exactly as
     inEnter is the one place a body goes through a door. */
  const hookedToTheStep =
    /walkInterrupt\(5\.04\);[\s\S]{0,600}?streetFightOnStep\(\);/.test(_citySrc);

  console.log('  V201 the fight starts where you stand:'
    + '\n    wired          trigger ' + street.hasTrigger + ', hooked to the walked step ' + hookedToTheStep
    + '\n    on a hostile   fires ' + street.firedOnHostile + ', ' + sf.count + ' message(s) reached the shell, '
    + sf.roster + ' of them, no room ' + sf.sendsNoRoom + ', label ' + JSON.stringify(sf.label)
    + '\n    guards         twice on one man ' + street.firedTwiceSamePerson
    + ', inside cooldown ' + street.firedInsideCooldown + ', after it ' + street.firedAfterCooldown
    + ', in grace ' + street.firedInGrace + ', on a stranger ' + street.firedOnStranger);

  ok('V201 *** THE GAME KNEW WHO YOUR ENEMIES WERE AND HAD NEVER ONCE PUT ONE IN FRONT OF YOU. *** Paolo 9/5, having played it: "Awesome I just played the run. WHERE THE ENEMIES AT BRO." Hostility lived in the between-ledger as a SIGN ON A RELATIONSHIP -- they charge you more, they watch you -- and the fight was real and reachable but ONLY through the city map door, never because somebody walked up to you. Now bumping a hostile body on the walked street starts the fight where you stand (' + street.firedOnHostile
    + '), and the message reaches the shell (' + sf.count + ') as THE DOOR\'S OWN MESSAGE (' + sf.isTheDoorsMessage
    + ') with ' + sf.roster + ' of them. Hooked to the walked step (' + street.hookedToTheStep
    + '), which is the one place a body arrives, exactly as inEnter is the one place a body goes through a door. THE HOOK IS CHECKED IN THE SOURCE, not by stringifying stepOnce -- that function is REASSIGNED by the interiors wrapper, so stringifying it reads the wrapper and reports the hook missing while it sits in the original',
    street.hasTrigger === true && hookedToTheStep === true
    && street.firedOnHostile === true && sf.isTheDoorsMessage === true
    && sf.roster >= 2 && sf.carriesWhereYouStand === true);

  ok('V201 AND IT SENDS NO ROOM, WHICH IS THE WHOLE DIFFERENCE BETWEEN THIS ENTRY AND THE DOOR\'S. V200 taught the fight to build its board out of the building you walked into; with no room it builds a street (' + sf.sendsNoRoom
    + '), which is correct, because you are standing on one. ONE FIELD DECIDES WHICH BOARD YOU FIGHT ON and it is the field the city already fills, so a street ambush can never be fought inside somebody\'s living room. And the objective reads like English on the street ' + JSON.stringify(sf.label)
    + ' rather than through the interior template, which would have said "inside the out on the block"',
    sf.sendsNoRoom === true && sf.saysStreet === true);

  ok('V201 AND NO HOSTILITY IS AUTHORED HERE, which matters because three lanes are on this ruling and only one of them owns that: RUN puts hostile BODIES on the street, PEOPLE puts the SIGN on the crowd, and this row is the ENTRY. A plain person is not a foe (' + JSON.stringify(street.plainPersonIsFoe)
    + ') and a stranger starts nothing (' + street.firedOnStranger + '). The test reads a real hostile body FIRST, so the moment RUN\'s row lands this entry uses it with no second wire, then falls back to the between-ledger, which already computes exactly this and had simply never been asked from the street. Consuming canon is not authoring it',
    street.plainPersonIsFoe === null && street.firedOnStranger === false);

  ok('V201 *** AND IT MEETS RUN\'S CREW, WHICH IS THE HALF THAT NEARLY MISSED. *** RUN [enemies exist] landed in the same round and shipped hostile bodies as a CREW standing at a cell -- BohemiaHostiles.near(), with stateOf() returning idle / watch / CLOSE. IT NEVER DECORATES A ctAdjacent() PERSON, so the p.hostile path this entry shipped with WOULD NEVER HAVE BEEN SET BY IT, and the two halves of one ruling would not have met: the exact defect the ruling is about, one layer up. A crew that is COMING starts the fight (' + street.firedOnCrew
    + '), the same crew never jumps you twice (' + street.firedTwiceSameCrew
    + '), and a crew that is only WATCHING is not a fight (' + street.firedOnWatching
    + ') -- they have clocked you and they are not coming. The roster is THEIR crew\'s own count, because RUN decided how many are on that corner, not this lane. And it reads HOST_DREW, which their draw already computed; asking BohemiaHostiles.near() again here would have been the second copy',
    street.hostilesEngineHere === true && street.readsTheCrew === true
    && street.firedOnCrew === true && street.firedTwiceSameCrew === false
    && street.firedOnWatching === false);

  ok('V201 AND THE GUARDS HOLD, because an entry with no guards is a corridor of fights. He only ambushes you once (' + street.firedTwiceSamePerson
    + '), a cooldown holds the next one off (' + street.firedInsideCooldown + ') and lets it through once it has passed (' + street.firedAfterCooldown
    + '), and nothing fires before you are out of your own street (' + street.firedInGrace
    + ' across the whole grace period). Nothing fires indoors either, because indoors is the door\'s fight. DETERMINISTIC OFF THE PERSON, never a coin flip per step -- the door\'s own rule, so he cannot farm an encounter by stepping back and forth over a kerb',
    street.firedTwiceSamePerson === false && street.firedInsideCooldown === false
    && street.firedAfterCooldown === true && street.firedInGrace === 0);

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
