#!/usr/bin/env node
/* ============================================================================
   YOU CAN GO BACK FOR HER
   (9/12/26, COMBAT lane, VAMILY [rescue her] = BB-PICKUP)

   The row is small and its three MUST-NOTs are the hard part, so this gate is
   mostly them: it must not become a heal button, must not make her invulnerable,
   and must not add a control surface (the 8/31 no-order-menu law).

   DRIVEN ON THE REAL SURFACE. It opens a real fight, puts her down through the
   shipped incoming fire rather than by setting a flag, walks the player to her
   through the shipped step, and reads what happened off the game.
   ========================================================================== */
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ALPHA = path.join(__dirname, '..', 'slices', 'BOHEMIA_ALPHA_0_9.html');
const sleep = ms => new Promise(r => setTimeout(r, ms));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  PASS ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = async (b) => { if (b) await b.close();
  console.log('=== PICKUP GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0); };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 200)));

  await page.goto('file://' + ALPHA); await sleep(9000);
  await page.mouse.click(215, 450); await sleep(2500);
  await page.mouse.click(215, 450); await sleep(2500);
  await page.evaluate(() => { try { markBeatTaught(); } catch (e) {} });
  await page.evaluate(() => { const t = document.querySelector('[data-p="combat"]'); if (t) t.click(); });
  await sleep(7000);
  await page.mouse.click(215, 450); await sleep(4000);
  const f = page.frames().find(x => { try { return x.name() === 'combatFrame'; } catch (e) { return false; } });
  ok('a real fight is open with a companion in it', !!f);
  if (!f) return done(browser);

  /* ---- 1. SHE GOES DOWN THROUGH THE SHIPPED FIRE, not by a flag ---------- */
  const fell = await f.evaluate(() => {
    BohemiaArena.set(3); setupCombat(); G.pHP = 100; G.over = false;
    const A = G.ally;
    if (!A) return { noAlly: true };
    const before = { up: allyUp(), hp: A.hp, downed: !!A.downed, dead: !!A.dead };
    /* *** THE STAGING IS THE SHIPPED CONDITIONS, AND THE FIRST CUT GOT IT
       BACKWARDS. *** It set acq=0 and left the men where they spawned, and
       measured 400 volleys with nothing landing -- because acquired() wants
       acq >= ACQ_TURNS (I had set the opposite) and inHisRange() said their guns
       could not reach her from seven to sixteen tiles away. Nothing was wrong
       with the game; the probe was shooting at her from out of range with men
       who had not looked up. So they are put where they can actually shoot and
       given the acquisition the shipped test asks for, and allyIncoming still
       decides what lands. */
    for (const e of (G.e || [])) if (e) {
      e.dead = false; e.downed = false; e.broken = false; e.fleeing = false;
      e.stun = 0; e.prone = 0; e.melee = false; e.gcov = 0;
      e.acq = (typeof ACQ_TURNS !== 'undefined') ? ACQ_TURNS + 1 : 9;
      e.ea = A.ea; e.edist = A.edist + 1.0;        /* a tile off her shoulder */
    }
    G._alKey = null;                                /* the split is cached per turn */
    let rounds = 0;
    while (allyUp() && rounds < 400) { try { allyIncoming(); } catch (e) {} rounds++; }
    return { noAlly: false, before: before, rounds: rounds,
      after: { up: allyUp(), hp: A.hp, downed: !!A.downed, dead: !!A.dead,
        fellAt: !!A._fellAt } };
  });
  console.log('  she falls: ' + JSON.stringify(fell));
  ok('SHE GOES DOWN THROUGH THE SHIPPED FIRE and she goes DOWN and not DEAD, which is the state the row is about (' + (fell.rounds)
    + ' volleys to put her off her feet, ' + (fell.before && fell.before.hp) + ' hp to ' + (fell.after && fell.after.hp)
    + ', downed ' + (fell.after && fell.after.downed) + ', dead ' + (fell.after && fell.after.dead)
    + '). Driven through allyIncoming rather than by setting a flag, because a flag would prove the pickup works on a state the game never reaches',
    !fell.noAlly && fell.before.up === true && fell.after.up === false
    && fell.after.downed === true && fell.after.dead === false && fell.after.fellAt === true);

  /* ---- 2. AND NOTHING GETS HER UP ON ITS OWN ---------------------------- */
  const alone = await f.evaluate(() => {
    const A = G.ally; const far = 9;
    A.edist = far;                      /* you are nowhere near her */
    let got = 0;
    for (let t = 0; t < 30; t++) {
      try { allyTurn(); } catch (e) {}
      try { medicTurn(); } catch (e) {}
      try { allyPickup(); } catch (e) {}
      if (allyUp()) { got++; break; } }
    return { up: allyUp(), got: got, turns: 30, edist: A.edist,
      downTurns: (typeof ALLY_DOWN_TURNS !== 'undefined') ? ALLY_DOWN_TURNS : null };
  });
  console.log('  left alone: ' + JSON.stringify(alone));
  ok('AND NOTHING STANDS HER UP ON ITS OWN. Thirty turns of her own ladder, their medic\'s turn and the pickup itself, with you nine tiles away, and she is still down ('
    + alone.up + '). There is no timer and no self-revive: ALLY_DOWN_TURNS is ' + alone.downTurns
    + ' and the only way off the floor is somebody coming. That is what makes it BEING MISSED rather than a wait',
    alone.up === false && alone.got === 0);

  /* ---- 3. WALKING TO HER IS THE WHOLE INPUT ----------------------------- */
  const walked = await f.evaluate(() => {
    const A = G.ally;
    const out = {};
    /* just outside the reach the loot uses: nothing happens */
    A.edist = PICKUP_R + 0.4; A.lvl = myLvl();
    out.outsideReach = { got: !!allyPickup(), up: allyUp() };
    /* through a floor, right on top of her: still nothing */
    A.edist = 0.2; A.lvl = myLvl() + 1;
    out.throughAFloor = { got: !!allyPickup(), up: allyUp() };
    /* *** AND THE LAST STEP IS A REAL WALK, WHICH A MUTATION FORCED. *** The first
       cut of this arm called allyPickup() by hand, and deleting the call from the
       footfall LEFT IT GREEN -- it was proving the function works, not that walking
       reaches it, which is the structurally-unreachable defect this lane has found
       four times (V152's chewCover, V176's threshold, V185's move2, V181's deaths).
       So the player is walked through worldShift, the one function the comment "the
       world moving under him IS him walking" sits in, and nothing here calls the
       pickup at all. */
    A.lvl = myLvl();
    A.ea = 0; A.edist = 1.0 + PICKUP_R;        /* a step away, straight ahead */
    const hpBefore = A.hp;
    const beforeWalk = { up: allyUp(), edist: A.edist };
    let steps = 0;
    while (!allyUp() && steps < 8) {
      try { worldShift(1, 0); } catch (e) {}     /* one step toward her */
      steps++; }
    out.reached = { got: allyUp(), up: allyUp(), hp: A.hp, hpBefore: hpBefore,
      stun: A.stun | 0, upAt: !!A._upAt, steps: steps,
      beforeWalk: beforeWalk, endedAt: Math.round(A.edist * 100) / 100 };
    out.pickupR = PICKUP_R;
    return out;
  });
  console.log('  walking to her: ' + JSON.stringify(walked));
  ok('*** AND WALKING TO HER IS THE WHOLE INPUT, WHICH IS HOW THIS STAYS OFF THE UI. *** Their medic has done exactly this since V173 and your side had a constant with a comment saying it was not built. Just outside the reach the loot already uses ('
    + walked.pickupR + ' tiles) nothing happens (' + walked.outsideReach.got
    + '), on top of her through a FLOOR nothing happens (' + walked.throughAFloor.got
    + '), and WALKING to her through the shipped worldShift gets her up in ' + walked.reached.steps
    + ' steps (' + walked.reached.got + ', she ended ' + walked.reached.endedAt
    + ' tiles away). NOTHING IN THIS ARM CALLS THE PICKUP: the first cut did, and deleting the call from the footfall left it green -- proving the function works instead of proving walking reaches it, which is the structurally-unreachable defect this lane has found four times. It reuses PICKUP_R and hangs off the same call site as the loot sweep, so the fight has ONE idea of having reached something rather than two',
    walked.outsideReach.got === false && walked.outsideReach.up === false
    && walked.throughAFloor.got === false && walked.throughAFloor.up === false
    && walked.reached.got === true && walked.reached.up === true && walked.reached.upAt === true);

  /* ---- 4. THE THREE MUST-NOTS, WHICH ARE THE ROW'S HARD PART ------------ */
  ok('MUST NOT #1, IT IS NOT A HEAL BUTTON: she comes up at ' + walked.reached.hp
    + ' hp from ' + walked.reached.hpBefore + ', which is the floor a downed body is already left on and not a number this row chose -- the medic\'s own sentence is "revived at the hp the game left him, which is 1, so the medic sets no health number at all and a man he stands up dies to anything". And there is no button anywhere: walking is the input',
    walked.reached.hp === 1);

  ok('AND SHE COMES UP WINDED (stun ' + walked.reached.stun
    + '), which is the medic\'s own line for the same moment: a man does not get off the floor shooting. The cost of this is not a number at all, it is the ground you cross under fire to reach her -- the same price V181 made you pay for loot',
    walked.reached.stun >= 1);

  const fragile = await f.evaluate(() => {
    const A = G.ally;
    const out = { hpAfterUp: A.hp };
    for (const e of (G.e || [])) if (e) {
      e.dead = false; e.downed = false; e.broken = false; e.fleeing = false;
      e.stun = 0; e.prone = 0; e.melee = false; e.gcov = 0;
      e.acq = (typeof ACQ_TURNS !== 'undefined') ? ACQ_TURNS + 1 : 9;
      e.ea = A.ea; e.edist = A.edist + 1.0; }
    G._alKey = null;
    let rounds = 0;
    while (allyUp() && rounds < 400) { try { allyIncoming(); } catch (e) {} rounds++; }
    out.downAgain = !!A.downed; out.rounds = rounds; out.dead = !!A.dead;
    return out;
  });
  console.log('  and straight back down: ' + JSON.stringify(fragile));
  ok('MUST NOT #2, SHE IS NOT INVULNERABLE: standing at ' + fragile.hpAfterUp
    + ' hp the shipped fire puts her back on the floor in ' + fragile.rounds
    + ' volleys (' + fragile.downAgain + '), and still down rather than dead (' + !fragile.dead
    + '). Nothing about what lands on her was touched, so going back for her is a decision with a price and not a rescue that ends the problem',
    fragile.downAgain === true && fragile.dead === false);

  const surface = await f.evaluate(() => {
    /* THE CONTROLS THEMSELVES, NOT THE PAGE'S PROSE. The first cut ran a regex
       over the whole innerHTML and matched text that has nothing to do with her,
       which is the "a mention is not a use" mistake this repo has a law about. So
       it reads the actual pressable things. */
    const btns = Array.prototype.slice.call(
      document.querySelectorAll('button,[role="button"],.cbtn,.kitbtn'));
    const rows = btns.map(b => ({ id: b.id || '', t: (b.textContent || '').trim().toUpperCase() }));
    /* AND THE BENCH'S OWN DEBUG PAIR IS NOT A CONTROL SURFACE FOR HER, which the
       first cut of this arm got wrong: it swept for the word HEAL and found
       <button id="hit">TAKE HIT</button><button id="heal">HEAL</button> -- the
       bench's player-health pair, which predates this row by months and moves the
       PLAYER's own hp on a test bench. Naming it here is the honest way to exclude
       it: the claim is that nothing orders HER about. */
    const bench = ['hit', 'heal'];
    const orders = rows.filter(r => bench.indexOf(r.id) < 0)
      .filter(r => /PICK|REVIVE|RESCUE|CARRY|DRAG|GET UP|STAND UP/.test(r.t)
        || (typeof ALLY_NAME === 'string' && ALLY_NAME && r.t.indexOf(ALLY_NAME) >= 0))
      .map(r => r.id + ':' + r.t);
    return { buttons: rows.length, orders: orders,
      benchPair: rows.filter(r => bench.indexOf(r.id) >= 0).map(r => r.id + ':' + r.t),
      pickupIsCode: typeof allyPickup === 'function' };
  });
  console.log('  the controls: ' + JSON.stringify(surface));
  ok('MUST NOT #3, NO CONTROL SURFACE, which is the 8/31 no-order-menu law: of the ' + surface.buttons
    + ' pressable things in the fight, NONE of them orders her about (' + JSON.stringify(surface.orders)
    + ') -- no pick-up, no revive, no rescue, no carry, and nothing with her name on it. The move exists only as something that happens when you walk ('
    + surface.pickupIsCode + '). The bench\'s own ' + JSON.stringify(surface.benchPair)
    + ' pair is named and excluded on purpose: it moves the PLAYER\'s health on a test bench and predates this row by months, and the first cut of this arm swept for the word HEAL and flagged it -- a mention is not a use',
    surface.orders.length === 0 && surface.buttons > 0 && surface.pickupIsCode === true);

  ok('no page errors through the whole round trip', errors.length === 0);
  if (errors.length) console.log('    ' + errors.slice(0, 3).join('\n    '));

  return done(browser);
})().catch(async e => {
  console.log('  FAIL gate threw: ' + (e && e.message));
  console.log('=== PICKUP GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed ===');
  process.exit(1);
});
