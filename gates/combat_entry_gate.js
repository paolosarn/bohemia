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
    try{ contactClear(); }catch(_e){}   /* V203: a real step arms the fuse; a simulated one must too */
    o.firedOnCrew = streetFightOnStep();
    SF_LAST = -9999;
    try{ contactClear(); }catch(_e){}   /* V203: a real step arms the fuse; a simulated one must too */
    o.firedTwiceSameCrew = streetFightOnStep();
    /* a crew that is only WATCHING has clocked you and is not coming: not a fight */
    HOST_DREW = [{ at: [hx + 4, hy], count: 3, state: 'watch' }];
    SF_LAST = -9999; SF_DONE = {};
    try{ contactClear(); }catch(_e){}   /* V203: a real step arms the fuse; a simulated one must too */
    o.firedOnWatching = streetFightOnStep();
    HOST_DREW = hostWas || [];

    const realAdj = window.ctAdjacent;
    /* A HOSTILE BODY -- what RUN's row will ship, and it is read FIRST so their
       row lands with no second wire. */
    window.ctAdjacent = () => ({ id: 'gate_foe_1', home: [1, 1], hostile: true });
    SF_STEPS = 9999; SF_LAST = -9999; SF_DONE = {};
    try{ contactClear(); }catch(_e){}   /* V203: a real step arms the fuse; a simulated one must too */
    o.firedOnHostile = streetFightOnStep();
    /* HE ONLY AMBUSHES YOU ONCE */
    SF_LAST = -9999;
    try{ contactClear(); }catch(_e){}   /* V203: a real step arms the fuse; a simulated one must too */
    o.firedTwiceSamePerson = streetFightOnStep();
    /* A COOLDOWN, so one bad block is not a corridor of fights */
    window.ctAdjacent = () => ({ id: 'gate_foe_2', home: [2, 2], hostile: true });
    SF_LAST = SF_STEPS - 1;
    try{ contactClear(); }catch(_e){}   /* V203: a real step arms the fuse; a simulated one must too */
    o.firedInsideCooldown = streetFightOnStep();
    SF_LAST = SF_STEPS - SF_COOLDOWN;
    try{ contactClear(); }catch(_e){}   /* V203: a real step arms the fuse; a simulated one must too */
    o.firedAfterCooldown = streetFightOnStep();
    /* AND NOBODY IS JUMPED BEFORE THEY ARE OUT OF THEIR OWN STREET */
    window.ctAdjacent = () => ({ id: 'gate_foe_3', home: [3, 3], hostile: true });
    SF_STEPS = 0; SF_LAST = -9999; SF_DONE = {};
    let early = 0;
    for (let i = 0; i < SF_GRACE - 1; i++) { try{ contactClear(); }catch(_e){}
      if (streetFightOnStep()) early++; }
    o.firedInGrace = early;
    /* AND A STRANGER STARTS NOTHING */
    window.ctAdjacent = () => ({ id: 'gate_stranger', home: [4, 4] });
    SF_STEPS = 9999; SF_LAST = -9999; SF_DONE = {};
    try{ contactClear(); }catch(_e){}   /* V203: a real step arms the fuse; a simulated one must too */
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
  /* AND IT IS NOT PINNED TO ANOTHER LANE'S NUMBER. The first cut matched the
     literal walkInterrupt(5.04) and went RED ON WORKING CODE the moment WORLD's
     [faster roads] row made a step cost what the ground costs -- the call is now
     walkInterrupt(_mc*60) and the hook never moved. What this arm is checking is
     WHERE the hook sits, so it matches the CALL and not its argument. */
  const hookedToTheStep =
    /walkInterrupt\([^)]*\);[\s\S]{0,600}?streetFightOnStep\(\);/.test(_citySrc);

  console.log('  V201 the fight starts where you stand:'
    + '\n    wired          trigger ' + street.hasTrigger + ', hooked to the walked step ' + hookedToTheStep
    + '\n    on a hostile   fires ' + street.firedOnHostile + ', ' + sf.count + ' message(s) reached the shell, '
    + sf.roster + ' of them, no room ' + sf.sendsNoRoom + ', label ' + JSON.stringify(sf.label)
    + '\n    guards         twice on one man ' + street.firedTwiceSamePerson
    + ', inside cooldown ' + street.firedInsideCooldown + ', after it ' + street.firedAfterCooldown
    + ', in grace ' + street.firedInGrace + ', on a stranger ' + street.firedOnStranger);

  ok('V201 *** THE GAME KNEW WHO YOUR ENEMIES WERE AND HAD NEVER ONCE PUT ONE IN FRONT OF YOU. *** Paolo 9/5, having played it: "Awesome I just played the run. WHERE THE ENEMIES AT BRO." Hostility lived in the between-ledger as a SIGN ON A RELATIONSHIP -- they charge you more, they watch you -- and the fight was real and reachable but ONLY through the city map door, never because somebody walked up to you. Now bumping a hostile body on the walked street starts the fight where you stand (' + street.firedOnHostile
    + '), and the message reaches the shell (' + sf.count + ') as THE DOOR\'S OWN MESSAGE (' + sf.isTheDoorsMessage
    + ') with ' + sf.roster + ' of them. Hooked to the walked step (' + hookedToTheStep
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

  /* ================= V202 THE FIRST FIGHT TEACHES THE BEAT ==============
     "one lesson per encounter, and the obstacle must be impossible to pass
      without the thing being taught" -- the coordinator's research this round.
     A stranger opens the demo with no manual and meets a real fight. Four rules
     have to be learned and NOTHING teaches any of them. So the first one teaches
     THE BEAT ALONE, and every other lesson is kept OUT of it: no group, no
     cover, no range problem, no companion, no words.
     DRIVEN, NEVER READ. The board is read out of the running fight, and the rule
     is proved by pressing the REAL trigger through the REAL aim door, once off
     the beat and once on it, and reading what happened to the man. */
  const cframe = page.frames().find(f => { try { return f.name() === 'combatFrame'; } catch (e) { return false; } });
  /* THE BOSS DICE ARE OFF FOR EVERYTHING BELOW, and that is not tidying: a boss
     REPLACES the archetype and the size, so a rolled boss makes the teaching
     board and the machine's own table unreadable. Caught by running this gate
     twice and getting a machine that was a BAT at 187 hp on one of them. This is
     the same switch fight_moves_you_gate throws at boot, for the same reason. */
  if (cframe) await cframe.evaluate(() => { G.bossOff = true; G.bossPick = null; });
  let ff = null, ffOff = null, ffOn = null, ffTell = null, ffSecond = null, ffShell = null, ffQuest = null;
  if (cframe) {
    ff = await cframe.evaluate(() => ({
      teachBeat: !!G.teachBeat,
      men: (G.e || []).length,
      arenaKind: G.arenaKind,
      pillars: (G.pillars || []).length,
      cars: (G.pillars || []).filter(p => p.car).length,
      deck: (G.deck || []).length,
      allyOn: allyOn(),
      melee: !!(G.e[0] || {}).melee,
      bot: !!(G.e[0] || {}).bot,
      inReach: ((G.e[0] || {}).edist || 1e9) <= maxRange(myRange()),
      /* THE TELL IS DERIVED FROM THE RULE, never a second number: teachAlpha
         reads GOOD_MS on the 120 grid, which is the same window gradeOf uses. */
      windowIsTheGradeWindow: Math.abs((GOOD_MS / (60000 / 120)) - 0.22) < 1e-9
    }));

    /* THE TELL IS READ OFF THE GLASS, NOT OFF THE FUNCTION. The first cut asked
       teachAlpha() what it would return and called that proof, and MEASURED it
       was proving nothing: the ghost was wrapped around drawEnemySprite, which
       on the real surface is called every frame and RETURNS FALSE EVERY TIME --
       enemyLook() has no baked look for this man, so what a stranger sees is the
       fallback DISC one line below. The tell was in the draw path nobody was on.
       So this averages the ink in the box he was actually drawn in, on-beat
       frames against off-beat ones, with a CONTROL BOX of empty ground beside
       him so the answer can never be the street's own lighting. */
    ffTell = await cframe.evaluate(() => new Promise(res => {
      const g = cv.getContext('2d', { willReadFrequently: true });
      const box = (X, Y, R) => { const d = g.getImageData(X - R, Y - R, R * 2, R * 2).data;
        let s = 0; for (let i = 0; i < d.length; i += 4) s += d[i] + d[i + 1] + d[i + 2];
        return s / (d.length / 4) / 3; };
      /* HIS OWN PEEK AND FIRE WINDOWS ARE ALSO BEAT-LOCKED and they repaint the
         disc green or red, which is a far louder signal than an alpha. Sampling
         on-beat frames against off-beat ones therefore measures HIS COLOUR, not
         the ghost. So the ghost is A/B'd directly: the same frames, the same
         states, teachAlpha held at 1 and then at what it really returns. If the
         wrap were around a draw path nobody is on -- which is exactly the bug
         this arm was written after -- forcing it would change nothing at all. */
      const real = window.teachAlpha;   /* put back at the end */
      /* INTERLEAVED FRAME BY FRAME, never sixty of one then sixty of the other:
         the camera is still settling at the top of a fight, so two consecutive
         blocks sample two different pictures and the answer would be the pan. */
      const A = { him: [], ground: [] }, B = { him: [], ground: [] };
      G._teachDraw = null;
      let k = 0;
      const tick = () => {
        const solid = (k % 2) === 0;
        /* HELD AT 1 AND THEN AT 0, because the question this arm exists to answer
           is WHETHER THE GHOST IS WIRED INTO THE PATH THAT DRAWS THIS MAN -- the
           bug it was written after was a wrap around a draw path nobody is on.
           At the shipped 0.34 the size of the change depends on how much the
           ground under him happens to contrast, which is a different run every
           time and not a thing to gate on. At 0 he is simply not painted. */
        window.teachAlpha = solid ? (() => 1) : (() => 0);
        /* TWO FRAMES, NOT ONE. The render loop is on requestAnimationFrame too,
           and a reader that shares the frame can run BEFORE the draw -- so the
           pixels belong to the PREVIOUS setting and the two arms cancel. That is
           exactly what the first interleaved cut measured: a 1.3 difference the
           wrong way round, on a ghost that a screenshot shows working. */
        requestAnimationFrame(() => requestAnimationFrame(() => {
          const T = G._teachDraw;
          if (T) { const R = Math.max(6, T.r | 0);
            const gx = (T.dx | 0) > cv.width / 2 ? (T.dx | 0) - 140 : (T.dx | 0) + 140;
            const out = solid ? A : B;
            out.him.push(box(T.dx | 0, T.dy | 0, R));
            out.ground.push(box(gx, T.dy | 0, R)); }
          if (++k >= 120) {
            window.teachAlpha = real;
            const m = a => a.length ? Math.round(a.reduce((p, q) => p + q, 0) / a.length * 10) / 10 : null;
            return res({ solidN: A.him.length, ghostN: B.him.length,
              him_solid: m(A.him), him_ghost: m(B.him), shipped: real(),
              ground_solid: m(A.ground), ground_ghost: m(B.ground),
              drew: A.him.length > 0 });
          }
          tick();
        }));
      };
      tick();
    }));

    /* THE NEEDLE IS PINNED, WHICH IS THE ONLY WAY THIS ARM MEANS ANYTHING.
       The first cut read the man's health after a press and called it proof --
       and it PASSED WITH THE RULE DELETED, because an off-beat press can miss on
       the dial all by itself and an on-beat one can hit. That is a checker that
       agrees with whatever it is shown. So the dial is held at a value the OTHER
       WAY ROUND from the answer being claimed: DEAD CENTRE for the off-beat
       press (the dial says kill) and a wild miss for the on-beat one (the dial
       says nothing). If the press is what decides, both come out backwards from
       the needle. G.angle is an INPUT held still, never the thing under test. */
    const shot = (wantOn, ang) => cframe.evaluate((a) => new Promise(res => {
      const on = a.on, w = GOOD_MS / (60000 / 120);
      const hp0 = G.e[0].hp;
      const had = Object.getOwnPropertyDescriptor(G, 'angle');
      Object.defineProperty(G, 'angle', { configurable: true, get: () => a.ang, set: () => {} });
      const done = (o) => { try { delete G.angle; if (had) Object.defineProperty(G, 'angle', had); } catch (e) {} res(o); };
      G.phase = 'cover'; G.over = false; G.ks = null; G.inc = null;
      try { enterAim(false); } catch (e) { return done({ err: 'enterAim ' + e.message }); }
      if (G.phase !== 'aim') return done({ err: 'phase ' + G.phase });
      const tick = () => {
        const ph = beatNow() - Math.floor(beatNow());
        if (((ph <= w) || (ph >= 1 - w)) !== on) return requestAnimationFrame(tick);
        /* an off-beat press is HELD and granted on the next beat by design, so
           give the grant a full beat to land before reading the man */
        try { fire(); } catch (e) { return done({ err: 'fire ' + e.message }); }
        setTimeout(() => done({ grade: (G._lastGrade || {}).grade || null, needle: a.ang,
          hp0: hp0, hp1: G.e[0].hp, down: !!(G.e[0].dead || G.e[0].downed || G.e[0].broken) }), 900);
      };
      requestAnimationFrame(tick);
    }), { on: wantOn, ang: ang });

    ffOff = await shot(false, 0);      /* the dial says KILL and the press says no */
    ffOn = await shot(true, 3.0);      /* the dial says NOTHING and the press says yes */

    /* AND AN AUTHORED FIGHT IS NEVER THE LESSON. A quest step or a hold-line
       defence is a fight somebody WROTE, with its own roster and its own way to
       lose; replacing it with one man on an empty street would break the thing
       that asked for it, and it must not consume the lesson either. */
    ffQuest = await page.evaluate(() => {
      startEncounter({ packageId: 1, questId: 'S99', stepId: 'x',
        roster: [{}, {}, {}, {}], reason: 'gate authored' });
      return { stillUnlearned: !beatTaught() };
    });
    await page.waitForTimeout(2500);
    ffQuest.board = await cframe.evaluate(() => ({
      teachBeat: !!G.teachBeat, men: (G.e || []).length, allyOn: allyOn() }));

    /* AND IT ENDS. A lesson that never turns itself off is a game that is all
       tutorial, so mark it learned the way winning marks it and start another
       fight through the same door. */
    ffShell = await page.evaluate(() => {
      const before = beatTaught();
      markBeatTaught();
      startEncounter({ packageId: 1, roster: [{}, {}, {}, {}, {}], reason: 'gate' });
      return { before: before, after: beatTaught() };
    });
    await page.waitForTimeout(2500);
    ffSecond = await cframe.evaluate(() => ({
      teachBeat: !!G.teachBeat, men: (G.e || []).length,
      pillars: (G.pillars || []).length, allyOn: allyOn()
    }));
  }

  console.log('  V202 the first fight teaches the beat:'
    + '\n    the board   ' + JSON.stringify(ff)
    + '\n    off-beat    ' + JSON.stringify(ffOff)
    + '\n    on-beat     ' + JSON.stringify(ffOn)
    + '\n    the tell    ' + JSON.stringify(ffTell)
    + '\n    authored    ' + JSON.stringify(ffQuest)
    + '\n    after       ' + JSON.stringify(ffShell) + ' ' + JSON.stringify(ffSecond));

  ok('V202 *** THE FIRST FIGHT IS THE ONLY TUTORIAL WE GET, AND IT TEACHES ONE THING. *** Four rules have to be learned in a stranger\'s first minute of combat -- the beat, it is a group, a tile is a house, the companion acts -- and NOTHING taught any of them. The research is blunt: one lesson per encounter, and a first fight that teaches four teaches none. So this board is ONE man (' + (ff && ff.men)
    + ') on a street (' + (ff && ff.arenaKind) + ') with nowhere to hide (' + (ff && ff.pillars) + ' cover, ' + (ff && ff.cars)
    + ' cars, ' + (ff && ff.deck) + ' deck), no companion (allyOn ' + (ff && ff.allyOn)
    + '), a plain man with a gun rather than a blade or a machine, and he is already inside your reach (' + (ff && ff.inReach)
    + ') -- because IT IS A GROUP, USE THE BOARD, A TILE IS A HOUSE and THE COMPANION ACTS are lessons two, three and four, one per later encounter',
    !!ff && ff.teachBeat === true && ff.men === 1 && ff.arenaKind === 'street'
    && ff.pillars === 0 && ff.cars === 0 && ff.deck === 0 && ff.allyOn === false
    && ff.melee === false && ff.bot === false && ff.inReach === true);

  ok('V202 AND THE OBSTACLE IS IMPOSSIBLE TO PASS WITHOUT THE THING BEING TAUGHT, which is the whole finding. On the teaching board the DIAL does not decide, the PRESS does: pressed off the beat WITH THE NEEDLE HELD DEAD CENTRE the shot lands on nobody (' + (ffOff && ffOff.grade) + ', needle ' + (ffOff && ffOff.needle) + ', ' + (ffOff && ffOff.hp0) + ' -> ' + (ffOff && ffOff.hp1)
    + '), and pressed on the beat WITH THE NEEDLE HELD AT A WILD MISS he goes down anyway (' + (ffOn && ffOn.grade) + ', needle ' + (ffOn && ffOn.needle) + ', ' + (ffOn && ffOn.hp0) + ' -> ' + (ffOn && ffOn.hp1)
    + '). Both answers come out BACKWARDS FROM THE NEEDLE on purpose: the first cut of this arm just read his health after a press and PASSED WITH THE RULE DELETED, because a press can miss on the dial by itself. The grade is the SAME grade the groove chain already reads, so there is one judge of what on-the-beat means and not two. Driven through the real aim door and the real trigger, never a stub',
    !!ffOff && !!ffOn && !ffOff.err && !ffOn.err
    && ffOff.hp1 === ffOff.hp0 && ffOff.down === false
    && (ffOn.grade === 'PERFECT' || ffOn.grade === 'GOOD') && ffOn.hp1 < ffOn.hp0);

  ok('V202 AND YOU CAN SEE IT WITHOUT BEING TOLD, because a text box breaks the world and the row says no text box, ever. READ OFF THE GLASS, ' + (ffTell && ffTell.ghostN)
    + ' frames a side, interleaved frame by frame: the box he is drawn in reads ' + (ffTell && ffTell.him_solid) + ' when the ghost is held open and ' + (ffTell && ffTell.him_ghost)
    + ' when it is held shut, while a control box of ground beside him reads ' + (ffTell && ffTell.ground_solid) + ' and ' + (ffTell && ffTell.ground_ghost)
    + ' -- HIS pixels move and nothing else\'s does, so the ghost is wired into the path that actually draws this man. THAT IS THE QUESTION THIS ARM EXISTS FOR, and three cuts of it were wrong first: it asked teachAlpha() what it would return, which proved nothing, because the ghost was wrapped around drawEnemySprite and that function is called every frame and RETURNS FALSE EVERY TIME on the real surface -- no look is baked for this man, so a stranger sees the fallback disc, and the tell was in the draw path nobody was on; then it sampled sixty frames of one setting followed by sixty of the other, so the answer was the camera still settling at the top of the fight; then it read the canvas in the SAME frame it set the flag, and the reader shares requestAnimationFrame with the render loop, so the pixels belonged to the previous setting and the two arms cancelled. The window is GOOD_MS on the 120 grid (' + (ff && ff.windowIsTheGradeWindow)
    + '), the same window the shot is graded by, derived and not declared, because a tell that can drift from the rule is a lie with an animation on it',
    !!ffTell && ffTell.drew === true && ffTell.ghostN > 40 && ffTell.ground_solid > 5
    && Math.abs(ffTell.him_solid - ffTell.him_ghost) > 3
    && Math.abs(ffTell.ground_solid - ffTell.ground_ghost) < 1
    && !!ff && ff.windowIsTheGradeWindow === true);

  ok('V202 AND THE LESSON ENDS, which is the guard that keeps the whole game from being a tutorial. It is marked learned only on a WIN, so dying or quitting in the middle leaves it standing and the fight you cannot pass without the beat comes back. Once it is learned (' + (ffShell && ffShell.before) + ' -> ' + (ffShell && ffShell.after)
    + ') the next fight through the same door is an ordinary one: ' + (ffSecond && ffSecond.men) + ' men, ' + (ffSecond && ffSecond.pillars)
    + ' pieces of cover, companion back on (' + (ffSecond && ffSecond.allyOn)
    + '). The flag is a LATCH consumed by setup, so a fight built without a fresh message -- the COMBAT bench\'s own FOES buttons included -- is never a teaching fight',
    !!ffShell && ffShell.before === false && ffShell.after === true
    && !!ffSecond && ffSecond.teachBeat === false && ffSecond.men > 1
    && ffSecond.pillars > 0 && ffSecond.allyOn === true);

  ok('V202 AND AN AUTHORED FIGHT IS NEVER THE LESSON. A quest step or a hold-line defence is a fight somebody WROTE, with its own roster and its own way to lose, so cutting it down to one man on an empty street would break the thing that asked for it -- and it must not spend the lesson either. A fight carrying a questId builds an ordinary board (' + JSON.stringify(ffQuest && ffQuest.board)
    + ') and leaves the lesson standing (' + (ffQuest && ffQuest.stillUnlearned)
    + '). The lesson waits for a fight the world produced on its own, which is the only kind a stranger meets anyway',
    !!ffQuest && ffQuest.stillUnlearned === true && !!ffQuest.board
    && ffQuest.board.teachBeat === false && ffQuest.board.men > 1 && ffQuest.board.allyOn === true);

  /* ================= V203 __CONTACT_FIGHT__ ============================
     TOUCHING A PARTY STARTS THE GROUP FIGHT. The road director has put parties
     in front of the player since 8/27 -- his approved twelve, on the map and on
     the walked street -- and the card printed, in words, "Fighting is not in
     this build yet." That was TRUE when it was written; it stopped being true
     when the fight got a door (V161), a street (V201) and a lesson (V202).
     THE DIRECTOR IS STUBBED AND NOTHING ELSE IS. His pacing module is the INPUT
     to this entry; everything downstream of it is the shipped path, driven. */
  const contact = {};
  /* CHECKED IN THE SOURCE, not by stringifying stepOnce: that function is
     REASSIGNED by the interiors wrapper, so String(stepOnce) reads the wrapper
     and reports the hook missing while it sits in the original. V201 paid for
     this lesson and the first cut of this arm walked into it anyway. */
  const contactFuseArmed =
    /function stepOnce\(di\)\{[\s\S]{0,200}?contactClear\(\);/.test(_citySrc);
  contact.wired = await cityFrame.evaluate(() => ({
    parties: (typeof ROAD_PARTY !== 'undefined') ? Object.keys(ROAD_PARTY).length : 0,
    entry: typeof roadContactFight === 'function',
    fuse: typeof CITY_CONTACT_POSTED !== 'undefined',
    /* THE FUSE IS ARMED BY stepOnce, AND IT IS CHECKED IN THE SOURCE. That
       function is REASSIGNED by the interiors wrapper, so String(stepOnce) reads
       the wrapper and reports it missing while it sits in the original -- V201
       paid for this lesson once and the first cut of this arm paid for it again. */
    arms: ['scavenger_shakedown', 'toll_crew', 'patrols_collide']
      .filter(id => (ROAD_CHOICES[id].opts || []).some(o => o.a === 'fight')).length,
    /* THE ANIMALS ARE NOT IN IT: CREATURES is an open row with nobody on it */
    animalsExcluded: !ROAD_PARTY.feral_dog_pack && !ROAD_PARTY.coyote_shadow
      && !ROAD_PARTY.rattlesnake && !ROAD_PARTY.ghost_robotaxi,
    stillSaysNotInBuild: /Fighting is not in this build yet/.test(String(roadCard)),
    /* every count read off HIS approved words in ROAD_WORDS */
    n: { scavenger: roadPartySize(ROAD_PARTY.scavenger_shakedown, { seq: 0 }),
         toll: roadPartySize(ROAD_PARTY.toll_crew, { seq: 0 }),
         wanderer: roadPartySize(ROAD_PARTY.crazed_wanderer, { seq: 0 }),
         bounty: roadPartySize(ROAD_PARTY.bounty_squad, { seq: 0 }),
         patrols: [0, 1, 2].map(q => roadPartySize(ROAD_PARTY.patrols_collide, { seq: q })) }
  }));

  /* --- A FORCED PARTY DOES NOT ASK ------------------------------------- */
  await page.evaluate(() => { window.__enc203 = [];
    window.addEventListener('message', e => { const d = e && e.data;
      if (d && d.type === 'BOHEMIA_CITY_ENCOUNTER') window.__enc203.push(d); }); });
  contact.forced = await cityFrame.evaluate(() => {
    const was = (typeof ROAD_DIR !== 'undefined') ? ROAD_DIR : null;
    ROAD_DIR = { consider: () => ({ fired: true, id: 'crazed_wanderer', name: 'crazed wanderer',
      kind: 'forced', seq: 3, at: { district: 'arterial', phase: 'day' } }) };
    contactClear();
    const r = roadInterrupt(600);
    const out = { fired: !!(r && r.fired), posted: CITY_CONTACT_POSTED,
      cardOpened: !!document.querySelector('#daycard.roadcard') };
    ROAD_DIR = was;
    return out;
  });
  await SETTLE(page, 7000);
  contact.msg = await page.evaluate(() => {
    const m = (window.__enc203 || [])[0] || null;
    return { count: (window.__enc203 || []).length, label: m && m.label,
      roster: (m && m.roster) ? m.roster.length : 0, street: !!(m && m.street),
      noRoom: !!(m && m.room == null), draft: !!(m && m.draft) };
  });
  const cf203 = page.frames().find(f => { try { return f.name() === 'combatFrame'; } catch (e) { return false; } });
  contact.board = cf203 ? await cf203.evaluate(() => ({ arenaKind: G.arenaKind,
    men: (G.e || []).length, roomIsNull: G.cityRoom == null,
    objective: (G._ctx && G._ctx.objective) || null })) : null;

  /* --- AND THE PARTY THAT ARRIVES IS THE ONE THAT WAS SENT -------------- */
  await cityFrame.evaluate(() => {
    const was = ROAD_DIR;
    ROAD_DIR = { consider: () => ({ fired: true, id: 'toll_crew', name: 'toll crew',
      kind: 'forced', seq: 1, at: { district: 'freeway', phase: 'day' } }) };
    contactClear(); roadInterrupt(600); ROAD_DIR = was;
  });
  await SETTLE(page, 7000);
  const cf203b = page.frames().find(f => { try { return f.name() === 'combatFrame'; } catch (e) { return false; } });
  contact.four = cf203b ? await cf203b.evaluate(() => ({ men: (G.e || []).length,
    teachBeat: !!G.teachBeat })) : null;

  await cityFrame.evaluate(() => {
    const was = ROAD_DIR;
    ROAD_DIR = { consider: () => ({ fired: true, id: 'casino_security_bot',
      name: 'dead casino security bot', kind: 'forced', seq: 2,
      at: { district: 'strip', phase: 'day' } }) };
    contactClear(); roadInterrupt(600); ROAD_DIR = was;
  });
  await SETTLE(page, 7000);
  const cf203c = page.frames().find(f => { try { return f.name() === 'combatFrame'; } catch (e) { return false; } });
  contact.machine = cf203c ? await cf203c.evaluate(() => ({ men: (G.e || []).length,
    arch: (G.e[0] || {}).arch, isMachine: !!((G.e[0] || {}).E || {}).bot,
    hp: (G.e[0] || {}).max })) : null;

  /* --- ONE STEP MAKES AT MOST ONE FIGHT -------------------------------- */
  contact.fuse = await cityFrame.evaluate(() => {
    contactClear();
    const ev = { fired: true, id: 'toll_crew', name: 'toll crew', kind: 'interactive',
      seq: 1, at: { district: 'freeway', phase: 'day' } };
    const first = roadContactFight(ev);
    const second = roadContactFight(ev);
    let street = null;
    const realAdj = window.ctAdjacent;
    try { window.ctAdjacent = () => ({ id: 'fuse_foe', home: [9, 9], hostile: true });
      SF_STEPS = 9999; SF_LAST = -9999; SF_DONE = {};
      street = streetFightOnStep(); } catch (e) { street = 'threw'; }
    window.ctAdjacent = realAdj;
    contactClear();
    return { first, second, streetAfter: street,
      /* WHY, when it says no, because a false with no reason is a guess */
      why: { inside: (typeof INSIDE !== 'undefined' && !!INSIDE),
             party: !!roadPartyOf('toll_crew'),
             framed: !!(window.parent && window.parent !== window) } };
  });

  /* --- AN ANIMAL IS NOT A PARTY IN THIS ROW ---------------------------- */
  contact.animal = await cityFrame.evaluate(() => {
    const was = ROAD_DIR;
    ROAD_DIR = { consider: () => ({ fired: true, id: 'feral_dog_pack', name: 'feral dog pack',
      kind: 'forced', seq: 5, at: { district: 'wash', phase: 'day' } }) };
    contactClear();
    const before = CITY_CONTACT_POSTED;
    const r = roadInterrupt(600);
    const out = { fired: !!(r && r.fired), posted: CITY_CONTACT_POSTED,
      stillShowsTheCard: !!document.querySelector('#daycard.roadcard') };
    try { cardHide(); } catch (e) {}
    ROAD_DIR = was;
    return out;
  });

  console.log('  V203 touching a party starts the group fight:'
    + '\n    wired    ' + JSON.stringify(contact.wired)
    + '\n    forced   ' + JSON.stringify(contact.forced) + ' ' + JSON.stringify(contact.msg)
    + '\n    board    ' + JSON.stringify(contact.board)
    + '\n    the four ' + JSON.stringify(contact.four) + '  machine ' + JSON.stringify(contact.machine)
    + '\n    fuse     ' + JSON.stringify(contact.fuse)
    + '\n    animal   ' + JSON.stringify(contact.animal));

  ok('V203 *** THE ROAD HAS BEEN PUTTING PARTIES IN FRONT OF HIM SINCE 8/27 AND THE CARD SAID, IN WORDS, "FIGHTING IS NOT IN THIS BUILD YET." *** That sentence was TRUE when it was written and its reason is three lines above ROAD_CHOICES: the missing arms are kills and NO DAMAGE BEFORE THE DIAL. It stopped being true when the fight got a door (V161), a street (V201) and a first lesson (V202) -- handing an encounter to the shipped fight authors no damage number at all, because the fight owns every one of them already. The sentence is gone (' + (contact.wired && contact.wired.stillSaysNotInBuild)
    + '), ' + (contact.wired && contact.wired.parties) + ' of his twelve are parties you can fight, and ' + (contact.wired && contact.wired.arms)
    + ' of them carry a real arm on his own card',
    !!contact.wired && contact.wired.stillSaysNotInBuild === false
    && contact.wired.entry === true && contact.wired.parties === 6 && contact.wired.arms === 3);

  ok('V203 AND WHO IS IN THE PARTY IS HIS, read straight off the words he approved in ROAD_WORDS: "Four of them have the ramp" is ' + (contact.wired && contact.wired.n.toll)
    + ', "Three of them, spread wide" is ' + (contact.wired && contact.wired.n.bounty)
    + ', "A guy steps out with a length of pipe" is ' + (contact.wired && contact.wired.n.scavenger)
    + ', "A man comes up the middle of the road" is ' + (contact.wired && contact.wired.n.wanderer)
    + ', and "Six, maybe eight" is read as the range it is (' + JSON.stringify(contact.wired && contact.wired.n.patrols)
    + '), deterministic off the encounter\'s own seq exactly like the cab\'s heading, so it rolls no seeded stream. Nothing here invents a headcount and nothing here invents a hostility. AND THE ANIMALS ARE NOT IN IT (' + (contact.wired && contact.wired.animalsExcluded)
    + '): the dog pack, the coyote and the snake are parties too, and CREATURES is an open row with nobody on it -- what they are and how they fight is canon this lane does not hold',
    !!contact.wired && contact.wired.n.toll === 4 && contact.wired.n.bounty === 3
    && contact.wired.n.scavenger === 1 && contact.wired.n.wanderer === 1
    && JSON.stringify(contact.wired.n.patrols) === '[6,7,8]'
    && contact.wired.animalsExcluded === true);

  ok('V203 A FORCED PARTY DOES NOT ASK, because "forced" is his own class out of the approved verdict and it already means this happens to you -- he does not slow down, they have done this before, it keeps coming. So contact starts the fight (' + (contact.forced && contact.forced.fired)
    + ') with no card to press (' + (contact.forced && contact.forced.cardOpened)
    + '), the door\'s own message reaches the shell (' + (contact.msg && contact.msg.count)
    + ') carrying ' + (contact.msg && contact.msg.roster) + ' of them and NO ROOM (' + (contact.msg && contact.msg.noRoom)
    + '), and the fight builds a ' + (contact.board && contact.board.arenaKind) + ' board -- the ground you met them on -- with the objective naming who it is (' + JSON.stringify(contact.board && contact.board.objective)
    + '). A card with one button on it is a choice pretending it is not',
    !!contact.forced && contact.forced.fired === true && contact.forced.cardOpened === false
    && !!contact.msg && contact.msg.count === 1 && contact.msg.roster === 1
    && contact.msg.street === true && contact.msg.noRoom === true && contact.msg.draft === true
    && !!contact.board && contact.board.arenaKind === 'street' && contact.board.roomIsNull === true
    && contact.board.objective === 'crazed wanderer');

  ok('V203 *** AND THE PARTY THAT ARRIVES IS THE PARTY THAT WAS SENT, WHICH IS THE ROW\'S OWN SENTENCE AND WAS NOT TRUE. *** Two holes in one wire, both measured: enter() set numEnemies from the roster and setupEnemies then OVERWROTE it with rollEncounterSize(), so a four-man toll crew arrived as three to six strangers (recorded as a pre-existing defect on 9/5 and it is this row\'s to close, because a roster nobody honours is not a party); and applyRoster only ever copied name, hp and eid, so the ARCHETYPE rode all the way in from the city and was dropped at the door. The toll crew is ' + (contact.four && contact.four.men)
    + ' men now, and the one machine in the table turns up as a machine (' + (contact.machine && contact.machine.arch) + ', bot ' + (contact.machine && contact.machine.isMachine)
    + ', ' + (contact.machine && contact.machine.hp) + ' hp against a goon\'s 60, with the boss dice off so it is the table talking) instead of a man with a pistol -- which also took a default OUT of startEncounter, where hp:60 was invented at the door for a body whose own table already had one. THE DRAW STILL HAPPENS AND ITS ANSWER IS DISCARDED, never skipped: a feature that costs a seeded stream one draw rewrites the whole board',
    !!contact.four && contact.four.men === 4 && contact.four.teachBeat === false
    && !!contact.machine && contact.machine.arch === 'bot'
    && contact.machine.isMachine === true && contact.machine.hp === 160);

  ok('V203 AND ONE STEP MAKES AT MOST ONE FIGHT. streetFightOnStep and roadInterrupt both run on the walked step, in that order, and neither knows about the other -- which is correct and is exactly why they must not be merged, but two entries that cannot see each other can post two encounters for one footfall. They share one thing and it is not a merge, it is a fuse: the second contact on the same step refuses (' + (contact.fuse && contact.fuse.second)
    + '), the street bump refuses after a road fight (' + (contact.fuse && contact.fuse.streetAfter)
    + '), and the fuse is armed by stepOnce (' + contactFuseArmed
    + '), the one function every step in either mode goes through',
    !!contact.fuse && contact.fuse.first === true && contact.fuse.second === false
    && contact.fuse.streetAfter === false && contactFuseArmed === true);

  ok('V203 AND AN ANIMAL IS STILL AN ANIMAL: the dog pack fires exactly as it does today (' + (contact.animal && contact.animal.fired)
    + '), starts no fight (' + (contact.animal && contact.animal.posted)
    + ') and still shows his card (' + (contact.animal && contact.animal.stillShowsTheCard)
    + '). Six of his twelve are people or a machine and those are the ones that fight; the rest fall through untouched',
    !!contact.animal && contact.animal.fired === true && contact.animal.posted === false
    && contact.animal.stillShowsTheCard === true);

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
