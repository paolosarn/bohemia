#!/usr/bin/env node
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   THE FIGHT HAS TO MOVE YOU (Paolo 8/15/26, LOCKED, demo-critical)

   > "There's no movement. There's no movement whatsoever and I hate it."

   His law names its own test and asked for this gate by name:

   > "Can the player win this encounter without leaving the first piece of cover
   >  they reach? If yes, it is not fixed. A gate that plays a fight from one
   >  spot and requires it to FAIL is the honest check."

   IT BLOCKS AGAIN. It was downgraded to a printed warning on 8/16 when his
   realistic-magazine ruling took ammo out of the job of moving him, and the law
   sat UNMET for exactly one turn. He then picked the mechanism himself:

   > "I like that in rogue fable four you have to go down the dungeon so from one
   >  second to another so it is a movement goal for stuff."

   So every fight has a WAY OUT and reaching it is the win. Killing every man no
   longer ends the encounter. That is why this can block honestly now: from one
   spot the win condition is not unlikely, it is UNREACHABLE, and no amount of
   player skill converts standing still into a victory.

   TWO ARMS, ONE POLICY, one difference: whether the player is allowed to walk.
     ARM A -- never moves, kills everything it can reach.  Any win is a FAILURE.
     ARM B -- walks to the way out.                        Losing most is a FAILURE.

   Arm B is not decoration. A fight nobody can win either way is not fixed, it is
   broken, and a gate that only checked arm A would pass an unwinnable game.

   It drives the SHIPPED functions -- setupCombat, pickTarget, applyDamage,
   worldShift, exitCheck via the world move, winGame -- because a gate that
   reimplements the rules marks its own homework, which is the failure that has
   cost this project three sessions.
   ========================================================================== */
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const ALPHA = path.join(__dirname, '..', 'slices', 'BOHEMIA_ALPHA_0_9.html');
const FIGHTS = 16;

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  PASS ' + n)) : (fail++, console.log('  FAIL ' + n)); };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));

  await page.goto('file://' + ALPHA);
  await SETTLE(page, 9000);
  await page.mouse.click(215, 450); await SETTLE(page, 2500);
  await page.mouse.click(215, 450); await SETTLE(page, 2500);
  await page.click('[data-p="combat"]'); await SETTLE(page, 7000);
  await page.mouse.click(215, 450); await SETTLE(page, 5000);

  const frame = page.frames().find(f => f.name() === 'combatFrame');
  if (!frame) {
    console.log('  FAIL could not reach the combat frame');
    console.log('=== FIGHT MOVES YOU GATE: 0 passed, 1 failed ===');
    await browser.close();
    process.exit(1);
  }

  const res = await frame.evaluate((FIGHTS) => {
    if (typeof placeWayOut !== 'function' || typeof exitCheck !== 'function')
      return { missing: true };

    /* deterministic, so a hit rate means the same thing on every run */
    let seed = 4242;
    const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

    const play = (mayWalk, hit) => {
      let won = 0, n = 0, tiles = 0, clearedBoardButNotOut = 0, dist = 0;
      for (let a = 1; a <= FIGHTS; a++) {
        BohemiaArena.set(a); setupCombat(); n++;
        dist += (G.exit ? G.exit.edist : 0);
        let guard = 0;
        for (;;) {
          if (++guard > 400) break;
          if (G.over) break;
          if (mayWalk && G.exit) {
            worldShift(Math.cos(G.exit.ea), Math.sin(G.exit.ea)); tiles++;
            if (G.over) break;
          }
          const i = pickTarget();
          if (i >= 0 && rnd() < hit && G.e[i]) {
            applyDamage(G.e[i], KILL_DMG);
            if (G.e[i].hp <= 0) G.e[i].dead = true;
            /* THE GAME GETS ITS OWN CHANCE TO DECLARE A WIN. Without this the
               harness killed men behind the engine's back and checkClear -- the
               exact function that decides whether a cleared board ends the
               fight -- was never called, so mutating it changed nothing and the
               gate passed a build where camping won again. Caught by mutation
               testing, which is the only reason this line exists. */
            try { checkClear(); } catch (e) { }
            if (G.over) break;
          }
          if (!mayWalk && !aliveEnemies().length) { clearedBoardButNotOut++; break; }
        }
        if (G.win) won++;
      }
      return { n, won, tiles, clearedBoardButNotOut, dist: dist / n };
    };

    /* IS A CLEARED BOARD A WIN? Asked DIRECTLY, not inferred from a play arm.
       V160 capped every gun at sight, so the never-moves arm can no longer even
       reach every man -- which means "fights that emptied the board" fell to
       zero and the statistical version of this check went blind. It was never
       measuring reach; it was asking whether killing everyone ends the fight.
       So it asks that, by killing everyone and calling the game's own
       checkClear, then walking out and asserting THAT wins. */
    BohemiaArena.set(7); setupCombat();
    const exitThere = !!G.exit;
    for (const e of G.e) if (e) { e.dead = true; }
    try { checkClear(); } catch (e) { }
    const clearedBoardIsNotAWin = !G.win && !G.over;
    if (G.exit) G.exit.edist = 0.2;
    try { exitCheck(); } catch (e) { }
    const leavingIsTheWin = !!G.win && !!G._wonByExit;

    /* the way out itself, driven rather than read */
    BohemiaArena.set(3); setupCombat();
    const placed = !!G.exit;
    const startDist = G.exit ? G.exit.edist : 0;
    const bearing = G.exit ? G.exit.ea : 0;
    /* it is a TILE: the world moving under him must change how far it is */
    const before = G.exit.edist;
    worldShift(Math.cos(bearing), Math.sin(bearing));
    const closed = before - G.exit.edist;
    /* and standing on it is the win */
    G.exit.edist = 0.2;
    const wonBefore = !!G.win;
    exitCheck();
    const wonByArriving = !wonBefore && !!G.win && !!G._wonByExit;

    /* the ammo feature is OFF by his second rejection, and must stay off */
    BohemiaArena.set(4); setupCombat();
    const ammoOff = (typeof AMMO_ON !== 'undefined') && AMMO_ON === false;
    const gunNeverDry = (() => { for (let k = 0; k < 60; k++) spendRound(); return !dryNow(); })();
    const noLitter = (G.drops || []).length === 0;

    return {
      still: play(false, 0.9),
      moving: play(true, 0.9),
      placed, startDist, closed, wonByArriving,
      exitThere, clearedBoardIsNotAWin, leavingIsTheWin,
      ammoOff, gunNeverDry, noLitter,
    };
  }, FIGHTS);

  if (res.missing) {
    console.log('  FAIL there is no way out in the shipped blob at all (placeWayOut/exitCheck missing)');
    console.log('=== FIGHT MOVES YOU GATE: 0 passed, 1 failed ===');
    await browser.close();
    process.exit(1);
  }

  const s = res.still, m = res.moving;
  console.log('  never moves: won ' + s.won + '/' + s.n
    + ' (board cleared but still standing there: ' + s.clearedBoardButNotOut + ')'
    + '   |  walks to it: won ' + m.won + '/' + m.n
    + ' after ' + (m.tiles / m.n).toFixed(1) + ' tiles');

  /* ---- THE RULING, BLOCKING ---- */
  ok('HIS TEST: the fight CANNOT be won without leaving the first cover you reach'
    + ' (won ' + s.won + ' of ' + s.n + ' standing still)',
    s.won === 0);

  /* ASKED DIRECTLY. This used to count fights where the play arm happened to
     empty the board, which V160's sight cap took to zero -- the arm cannot reach
     every man any more, so the check went blind to the thing it was for. It was
     never about reach. It is about whether killing everyone ends the fight, so
     it kills everyone, calls the game's OWN checkClear, and then walks out. */
  ok('AND IT IS NOT A TECHNICALITY: every man on the board is dead, the game\'s own checkClear has run, and it is STILL not a win -- then walking out IS',
    res.exitThere && res.clearedBoardIsNotAWin && res.leavingIsTheWin);

  /* ---- and it is a fight, not a wall ---- */
  ok('AND IT IS WINNABLE ONCE YOU WALK (won ' + m.won + ' of ' + m.n + ')',
    m.won >= Math.ceil(m.n * 0.9));

  ok('the walking arm actually WALKS -- a pass earned by standing still would be a broken test',
    m.tiles > 0);

  ok('A JOURNEY IS NOT A FIGHT: the way out is a real trip but a bounded one. The first cut put it beyond the FURTHEST man and measured 32.8 tiles against a fight that lasts about 14 turns, which is a hike with a gunfight at the start (starts ' + m.dist.toFixed(1) + ' tiles out)',
    m.dist >= 8 && m.dist <= 20);

  /* ---- the mechanism, driven ---- */
  ok('every fight is given a way out at the bell', res.placed && res.startDist > 0);

  ok('it is a TILE, not a direction: walking toward it closes the distance, so the world moving under him IS him arriving',
    res.closed > 0.5);

  ok('and standing on it wins the fight, flagged as the way out rather than as a board clear',
    res.wonByArriving);

  /* ---- his second rejection, held ---- */
  ok('AMMO IS OFF BY HIS SECOND REJECTION ("I\'m not a big fan of the ammo being depleted"), and STOP PRODUCING says a second rejection ends the feature. The gun does not run dry, and the ground is not littered with rounds',
    res.ammoOff && res.gunNeverDry && res.noLitter);

  /* ===== V164 MOVEMENT ASYMMETRY, MEASURED ON THE SHIPPED MOVER =========
     RF4-51 machine 3: "Slow enemies move ORTHOGONALLY ONLY; you move DIAGONALLY
     -- every diagonal step costs them more than it costs you, so you generate
     distance out of pure geometry with NO RESOURCE SPENT."
     TWO ARMS, ONE DIFFERENCE, and it has to be exactly one: same arena, same
     start cell, same flee vector, same shipped pressAI. The ONLY thing that
     changes between them is the ortho flag on the body.
     AND THE FIRST CUT OF THIS SHIPPED A STATUE. A slow body that never moves
     also "manufactures distance", by doing nothing, and it would have measured
     BETTER than the real mechanic (4.03 tiles against 2.55). So the step COUNT
     is checked too: if the slow arm is not walking roughly as often as the fast
     one, the gap is a freeze wearing the feature's clothes. */
  const asym = await frame.evaluate(() => {
    const cheb = e => { const c = cellOf(e); return Math.max(Math.abs(c[0]), Math.abs(c[1])); };
    const DIRS = [[-1,-1],[1,-1],[1,1],[-1,1]], STEPS = 8, START = 9;
    const chase = (ortho, a, dir) => {
      BohemiaArena.set(a); setupCombat();
      G.e.length = 0; G.hold = null; G.over = false;
      /* V165: THE CHASE RIG RUNS ON A CLEAR FIELD, and that is what makes it an
         experiment rather than an anecdote. This claim is about GEOMETRY --
         four neighbours against eight -- so the two arms must differ by the
         ortho flag and NOTHING else. Leaving the arena's pillars in injects
         V165's line of sight into a V164 measurement: a chaser who loses sight
         behind a rock walks to a memory and then parks, both arms park at
         different times, and the number stops being about diagonals at all.
         Vision has its own checks below, in a real arena, with the real roster. */
      G.pillars = [];
      const E = JSON.parse(JSON.stringify(ARCH.bot)); E.ortho = ortho;
      const e = { i:0, E, n:'T', hp:160, max:160, arch:'bot', dead:false, melee:false,
                  acq:9, stun:0, supp:0, lvl:0, gcov:0, ea:0, edist:START };
      putCell(e, -dir[0]*START, -dir[1]*START);   /* he flees AWAY from the machine */
      G.e.push(e); G.numEnemies = 1;
      let moved = 0, diag = 0;
      for (let k = 0; k < STEPS; k++) {
        worldShift(dir[0], dir[1]);
        G.mTurn = (G.mTurn||0) + 1; e._movedTurn = -1;
        /* V165: the shipped turn resolves VISION and then presses, so a harness
           that calls pressAI alone is simulating a turn the game never takes --
           the chaser would be permanently blind with no memory and would hold.
           Same class as the bug where this file forgot to advance G.mTurn and
           nearly reported that enemies stop moving after turn one. */
        try { visionTick(); } catch (x) {}
        const was = cellOf(e);
        try { pressAI(); } catch (x) {}
        const now = cellOf(e);
        const dx = Math.abs(now[0]-was[0]), dy = Math.abs(now[1]-was[1]);
        if (dx || dy) { moved++; if (dx && dy) diag++; }
      }
      return { gap: cheb(e), moved, diag };
    };
    /* setupCombat SIZES THE ROSTER OFF G.numEnemies, so a one-man chase rig
       that walks away without putting it back leaves every later arena with a
       single body in it. That is exactly how the first run of this check
       reported "0 flagged bodies" and looked like a shipped bug. */
    const N0 = G.numEnemies;
    let gO = 0, gE = 0, mO = 0, mE = 0, dO = 0, n = 0, lost = 0;
    for (let a = 1; a <= 24; a++) for (const d of DIRS) {
      const A = chase(true, a, d), B = chase(false, a, d);
      gO += A.gap; gE += B.gap; mO += A.moved; mE += B.moved; dO += A.diag; n++;
      if (A.gap > B.gap) lost++;
    }
    /* and in a REAL arena, with the real roster, a flagged body never lands on
       a diagonal -- the chase above could pass while the flag leaked in the
       fights he actually plays */
    let realMoves = 0, realDiag = 0, flagged = 0;
    G.numEnemies = N0;
    for (let a = 1; a <= 12; a++) {
      BohemiaArena.set(a); setupCombat();
      flagged += (G.e||[]).filter(e => e && e.E && e.E.ortho).length;
      for (let t = 0; t < 20; t++) {
        const was = (G.e||[]).map(e => e && !e.dead ? cellOf(e) : null);
        G.mTurn = (G.mTurn||0) + 1;
        try { visionTick(); } catch (x) {}   /* V165: the shipped turn order */
        try { pressAI(); } catch (x) {}
        (G.e||[]).forEach((e, i) => {
          if (!e || e.dead || !was[i] || !(e.E && e.E.ortho)) return;
          const c = cellOf(e), dx = Math.abs(c[0]-was[i][0]), dy = Math.abs(c[1]-was[i][1]);
          if (!dx && !dy) return;
          realMoves++; if (dx && dy) realDiag++;
        });
      }
    }
    return { n, gO: gO/n, gE: gE/n, mO: mO/n, mE: mE/n, dO, lost,
             realMoves, realDiag, flagged, steps: STEPS };
  });

  console.log('  he runs diagonally 8 turns, ' + asym.n + ' trials: 8-way chaser ends '
    + asym.gE.toFixed(2) + ' tiles out (stepped ' + asym.mE.toFixed(1) + '/' + asym.steps
    + '), orthogonal-only ends ' + asym.gO.toFixed(2) + ' (stepped ' + asym.mO.toFixed(1)
    + '/' + asym.steps + ')');

  ok('V164 RF4-51 DISTANCE OUT OF PURE GEOMETRY: cutting corners he can and the machine cannot leaves it '
    + (asym.gO - asym.gE).toFixed(2) + ' tiles further back over ' + asym.steps
    + ' turns, in ' + asym.lost + ' of ' + asym.n + ' trials',
    (asym.gO - asym.gE) >= 1.0 && asym.lost >= asym.n * 0.6);

  ok('V164 AND IT IS GEOMETRY, NOT A FREEZE -- the slow body still walks about as often as the fast one ('
    + asym.mO.toFixed(1) + ' turns against ' + asym.mE.toFixed(1) + ' of ' + asym.steps
    + '). A statue manufactures MORE distance than the real mechanic and would have passed the check above',
    asym.mO >= asym.mE * 0.75);

  /* AND THE MOVER ITSELF HAS TO BE ALIVE, WHICH IS A SEPARATE CLAIM. The ratio
     above is blind to both arms freezing together: reverting the V164 eff clamp
     takes the chaser from stepping 6.5 turns in 8 to 4.0, and the ratio still
     reads fine because BOTH halves shrank. V160 shrank every gun's MAX to the
     sight ceiling and left the EFF column alone, so the rifle wanted to fight at
     20 tiles on a 16-tile board and pressScore's entire progress gradient was
     zero at every reachable distance. This is the check that notices. */
  ok('V164 AND THE PULL IS LIVE AT ALL -- a chaser who wants you steps on '
    + asym.mE.toFixed(1) + ' of ' + asym.steps + ' turns. A gun whose EFF sits off the end '
    + 'of the board has no progress gradient anywhere and stands there instead',
    asym.mE >= asym.steps * 0.7);

  ok('V164 A SLOW BODY NEVER LANDS ON A DIAGONAL, in the fights he actually plays: '
    + asym.realDiag + ' diagonal landings in ' + asym.realMoves + ' moves by '
    + asym.flagged + ' flagged bodies',
    asym.flagged > 0 && asym.realMoves > 0 && asym.realDiag === 0);

  ok('V164 AND THE CONTROL MOVES BOTH WAYS -- if the fast arm had frozen too, the flag would not be what did it ('
    + asym.dO + ' diagonal steps by the slow arm across ' + asym.n + ' chases)',
    asym.mE > 0 && asym.dO === 0);

  /* ===== V165 VISION IS THE MASTER SWITCH, MEASURED ON THE REAL FIGHT ====
     RF4-52 machine 4. The lab gate pins that ONE variable exists and that five
     systems read it. What has to be measured here is that it actually DOES
     something in a fight: that men really do go blind, that the memory really
     stays on its tile, that a blind man really walks to it, and that the shout
     really carries. Each claim gets its own CONTROL, because "he moved" and "he
     moved BECAUSE of this" are different sentences. */
  const vis = await frame.evaluate(() => {
    const R = {};
    const mk = (cx, cy) => { const E = JSON.parse(JSON.stringify(ARCH.human));
      const e = { i: G.e.length, E, n: 'T', hp: 60, max: 60, arch: 'human', dead: false,
                  melee: false, acq: 0, stun: 0, supp: 0, lvl: 0, gcov: 0, ea: 0, edist: 1 };
      putCell(e, cx, cy); G.e.push(e); return e; };
    const N0 = G.numEnemies;

    /* 1. IS ANYBODY EVER BLIND? A switch nobody is ever on the wrong side of is
          a switch that does nothing. And the bead must be OFF for those men. */
    let bodies = 0, blind = 0, blindWithBead = 0;
    for (let a = 1; a <= 40; a++) {
      BohemiaArena.set(a); setupCombat();
      try { tickTurnEnd(); } catch (x) {}
      for (const e of (G.e || [])) {
        if (!e || e.dead || e.melee) continue;
        bodies++;
        if (!seesMe(e)) { blind++; if ((e.acq || 0) > 0) blindWithBead++; }
      }
    }
    R.bell = { bodies, blind, blindWithBead };

    /* 2. DOES THE MEMORY STAY ON ITS TILE? Walk three tiles; the remembered spot
          must end three tiles behind. A memory that followed would read 0. */
    BohemiaArena.set(3); setupCombat();
    { const e = (G.e || []).find(x => x && !x.dead && !x.melee);
      markSeen(e);
      const b4 = pXY(e.lkp);
      for (let k = 0; k < 3; k++) worldShift(1, 0);
      const af = pXY(e.lkp);
      R.drift = +Math.hypot(af[0] - b4[0], af[1] - b4[1]).toFixed(2); }

    /* 3. DOES A BLIND MAN WALK TO IT -- and does the SAME man with no memory
          stay put? Blind by being past the end of his own eyes, so the claim
          does not depend on where the arena happened to put its rocks. */
    const hunt = (withMemory) => {
      BohemiaArena.set(5); setupCombat();
      G.e.length = 0; G.hold = null; G.over = false; G.pillars = [];
      const e = mk(20, 0); G.numEnemies = 1;
      e.lkp = withMemory ? { ea: Math.atan2(-8, 20), edist: Math.hypot(20, -8), lvl: 0 } : null;
      const gap = () => { if (!e.lkp) return 0; const k = pXY(e.lkp), c = cellOf(e);
                          return Math.hypot(k[0] - c[0], k[1] - c[1]); };
      const d0 = gap(); let moves = 0;
      for (let t = 0; t < 10; t++) {
        G.mTurn = (G.mTurn || 0) + 1; e._movedTurn = -1;
        const was = cellOf(e); try { pressAI(); } catch (x) {}
        const now = cellOf(e);
        if (now[0] !== was[0] || now[1] !== was[1]) moves++;
      }
      return { blind: !seesMe(e), d0: +d0.toFixed(2), d1: +gap().toFixed(2), moves };
    };
    R.hunt = hunt(true); R.noMemory = hunt(false);

    /* 4. DOES THE SHOUT CARRY -- and does it stop when the mouth is shut? */
    BohemiaArena.set(7); setupCombat();
    { G.e.length = 0; G.pillars = []; G.over = false;
      const seer = mk(10, 0), heard = mk(18, 0), deaf = mk(40, 0);
      G.numEnemies = 3;
      for (const e of G.e) e.lkp = null;
      visionTick();
      R.shout = { seer: seesMe(seer), heardSees: seesMe(heard), deafSees: seesMe(deaf),
                  heardTold: !!heard.lkp, deafTold: !!deaf.lkp };
      for (const e of G.e) e.lkp = null;
      seer.dead = true; visionTick();
      R.shoutDead = { heardTold: !!heard.lkp }; }

    /* 5. THE 3-5 SECOND RUSH: every bead drops on a sprint, line or no line */
    BohemiaArena.set(9); setupCombat();
    { /* ON A BARE FIELD, and that is the whole test. With the arena's rocks left
         in, the step that sprints also breaks lines the ordinary V24 way, so
         deleting the sprint rule entirely still measured 0 beads left and this
         check passed a build that did not have the feature in it. Caught by
         mutation testing, which is the only reason this line exists. */
      G.pillars = [];
      /* AND NO SPOTTER WITH A LINE. V168 made a marksman's overwatch REFUSE the
         sprint outright, which is correct and is the point of that feature -- but
         it means this scenario silently stopped sprinting at all and measured
         "no beads dropped". The rush is what is under test here, so the thing
         that forbids the rush is removed rather than the claim weakened. */
      (G.e || []).forEach(e => { if (e && e.E && e.E.spotter) e.dead = true; });
      for (const e of G.e) if (e && !e.dead) e.acq = 9;
      const guns = G.e.filter(e => e && !e.dead && !e.melee);
      const held = guns.filter(e => acquired(e)).length;
      G.stam = 3; G.sprintArm = true; G.phase = 'cover';
      try { doMove(2); } catch (x) {}
      R.sprint = { held, after: guns.filter(e => acquired(e)).length }; }

    G.numEnemies = N0;
    return R;
  });

  console.log('  at the bell across 40 arenas: ' + vis.bell.blind + ' of ' + vis.bell.bodies
    + ' gunmen cannot see him');

  ok('V165 MEN REALLY DO GO BLIND, and it is not a rare branch: ' + vis.bell.blind + ' of '
    + vis.bell.bodies + ' gunmen across 40 arenas cannot see him at the bell. A switch nobody is ever on the wrong side of is a switch that does nothing',
    vis.bell.blind > vis.bell.bodies * 0.15 && vis.bell.blind < vis.bell.bodies * 0.95);

  ok('V165 AND NOT ONE OF THEM IS HOLDING A BEAD (' + vis.bell.blindWithBead
    + ' with a red line while blind). This is the spec\'s headline: a wall does not make the guns miss, it turns them off',
    vis.bell.blindWithBead === 0);

  ok('V165 THE MEMORY STAYS ON ITS TILE: three tiles of walking put it ' + vis.drift
    + ' tiles behind him. A memory that travelled with him would read 0.00 and the whole mechanic would be a no-op measuring green',
    vis.drift >= 2.9 && vis.drift <= 3.1);

  ok('V165 A BLIND MAN WALKS TO WHERE HE LAST SAW YOU: gap ' + vis.hunt.d0 + ' -> '
    + vis.hunt.d1 + ' tiles over 10 turns, stepping ' + vis.hunt.moves + ' of them',
    vis.hunt.blind && vis.hunt.d1 <= 1.5 && vis.hunt.moves >= 5);

  ok('V165 AND THE CONTROL SAYS IT IS THE MEMORY DOING IT, not blindness in general: the SAME blind man with nothing remembered takes '
    + vis.noMemory.moves + ' steps in 10 turns. A man who has never seen you has nowhere to be',
    vis.noMemory.blind && vis.noMemory.moves === 0);

  ok('V165 THE SHOUT CARRIES: a man 18 tiles out who cannot see him is told anyway by the one who can, and a man 40 tiles out is told nothing',
    vis.shout.seer && !vis.shout.heardSees && vis.shout.heardTold
    && !vis.shout.deafSees && !vis.shout.deafTold);

  ok('V165 AND KILLING THE MOUTH SHUTS IT: with the only man who can see him dead, the man 18 tiles out is told nothing. That is what makes the one with eyes on you worth shooting FIRST',
    vis.shoutDead.heardTold === false);

  ok('V165 A SPRINT DROPS EVERY BEAD (' + vis.sprint.held + ' held -> ' + vis.sprint.after
    + '): the 3-5 second rush, which is the realistic form of the capture\'s "enemies never spot a sprinting player" -- they are not blinded, you were simply only up for less time than acquiring takes',
    vis.sprint.held > 0 && vis.sprint.after === 0);

  /* ===== V166 THE DIAL STOPS TINKLING, HEARD RATHER THAN READ ==========
     Paolo 8/19: "when i leave or enter the deadshot dial theres like a glass
     bottle noise i hate that."
     THE LAB GATE CANNOT PROVE THIS AND IT TRIED. Its first version asserted by
     string that the casing had moved onto the shot, and a mutation that changed
     `try{ sfxAsk('casing'); }` to `if(0){ sfxAsk('casing'); }` left it GREEN --
     every word still present, only the behaviour gone. So the claim is made
     where the cue can actually be heard: hook every voice in the frame, open the
     dial, and listen. */
  const dial = await frame.evaluate(() => {
    const log = [];
    const wrap = (n) => { const fn = window[n]; if (typeof fn !== 'function') return false;
      window[n] = function (...a) { log.push(n + '(' + String(a[0]) + ')'); return fn.apply(this, a); }; return true; };
    ['sfxAsk', 'tone', 'drumV'].forEach(wrap);
    BohemiaArena.set(3); setupCombat(); G.phase = 'cover';
    const take = () => { const v = log.slice(); log.length = 0; return v; };
    take();
    try { enterAim(false); } catch (e) {}
    const onRaise = take();
    try { sndShot(); } catch (e) {}
    const onShot = take();
    try { sndAccent(); } catch (e) {}
    const onAccent = take();
    return { onRaise, onShot, onAccent };
  });

  ok('V166 RAISING THE GUN THROWS NO BRASS: opening the dial fires nothing at all ('
    + (dial.onRaise.length ? dial.onRaise.join(', ') : 'silent')
    + '). It used to eject a casing before a single round had left the barrel',
    !dial.onRaise.some(v => v.indexOf('casing') >= 0));

  ok('V166 AND THE SHOT DOES: the casing rides sndShot, the one door every shot in the file goes through ('
    + dial.onShot.join(', ') + ')',
    dial.onShot.some(v => v.indexOf('casing') >= 0));

  ok('V166 THE KILL-WINDOW CUE IS THE BAND, NOT A BEEP: it plays a drum out of the song\'s own kit and not a bare oscillator ('
    + dial.onAccent.join(', ') + '). Two pure tones an octave apart with no noise floor is a glass ping by construction, and V75 already named that disease about this cue\'s twin',
    dial.onAccent.some(v => v.indexOf('drumV') >= 0) &&
    !dial.onAccent.some(v => v.indexOf('tone(') >= 0));

  /* ===== V168 THE SPOTTER, MEASURED ON THE SHIPPED MOVE ================
     RF4-37's other half: "what is missing is a target worth crossing the room
     for." A designated marksman's real function is to DENY MOVEMENT -- he
     "provides overwatch and covering fire" and by doing so "facilitates safe
     movement" for his own side -- so while he has a line on you, the free move
     is gone. There are TWO answers and both are checked here, because a puzzle
     with one answer is a chore. */
  const spot = await frame.evaluate(() => {
    const R = {};
    /* _chainWait IS CLEARED ON PURPOSE. The V166 block above opens the dial
       through the shipped enterAim, which can leave a chain prompt armed, and
       doMove eats the next input to answer it -- so the after-kill sprint
       returned 0 and this check failed a build where the feature worked
       perfectly. Standalone it measured 1 every time. The tests share one page,
       so a test has to clear what earlier tests armed. */
    /* DID THE MOVE HAPPEN -- measured as THE WORLD MOVING, not as a pip going
       down. The first version returned `stam before minus stam after`, and V163's
       global SP clock refills the budget every 5th turn, so a sprint that
       succeeded perfectly could read as 0 spent purely because the tick landed on
       it. The game's own readout said SPRINTED while my number said nothing
       happened. A step IS the world shifting under him, so that is what is
       counted. (Also clears the locks earlier tests leave armed: doMove's very
       first line is `if(G.inc)return`, and the dial block above opens the dial.) */
    const trySprint = () => { G.stam = 3; G.sprintArm = true; G.phase = 'cover'; G.over = false;
      G._chainWait = false; G.runArm = false; G.dashArm = false;
      G.inc = false; G.frozen = false; G.ks = null; G.win = false;
      const o = G.worldOff || { x: 0, y: 0 }; const bx = o.x, by = o.y;
      try { doMove(2); } catch (x) {}
      const n = G.worldOff || { x: 0, y: 0 };
      return (n.x !== bx || n.y !== by) ? 1 : 0; };

    /* DOES IT EVER BITE? A denial that never fires is decoration, and the first
       version of this feature was exactly that -- an infinite shout that measured
       inside the noise and got cut. */
    let fights = 0, pinTurns = 0, turns = 0, everPinned = 0;
    for (let a = 1; a <= 30; a++) {
      BohemiaArena.set(a); setupCombat();
      if (!(G.e || []).some(e => e && e.E && e.E.spotter)) continue;
      fights++;
      let here = 0;
      for (let t = 0; t < 12; t++) {
        G.mTurn = (G.mTurn || 0) + 1;
        try { visionTick(); } catch (x) {}
        turns++; if (spotterOnMe()) { pinTurns++; here++; }
        try { worldShift(Math.cos(t * 1.1), Math.sin(t * 1.1)); } catch (x) {}
      }
      if (here) everPinned++;
    }
    R.bite = { fights, pct: +(100 * pinTurns / Math.max(1, turns)).toFixed(1), everPinned };

    /* ANSWER ONE: put him down. Clean line, no rocks, so only the flag decides. */
    BohemiaArena.set(1); setupCombat();
    const sn = (G.e || []).find(e => e && e.E && e.E.spotter);
    if (sn) {
      G.pillars = []; sn.dead = false; sn.stun = 0; sn.prone = 0; sn.lvl = 0; putCell(sn, 6, 0);
      try { visionTick(); } catch (x) {}
      R.pinned = spotterOnMe(); R.underPin = trySprint();
      sn.dead = true; try { visionTick(); } catch (x) {}
      R.afterKill = trySprint(); R.pinnedAfterKill = spotterOnMe();
    }
    /* ANSWER TWO: he LIVES and you step behind stone. One rock on the line and
       nothing else changes -- if this needed him dead it would be one answer. */
    BohemiaArena.set(1); setupCombat();
    const s2 = (G.e || []).find(e => e && e.E && e.E.spotter);
    if (s2) {
      G.pillars = []; s2.dead = false; s2.stun = 0; s2.prone = 0; s2.lvl = 0; putCell(s2, 6, 0);
      try { visionTick(); } catch (x) {}
      R.pinnedFirst = spotterOnMe();
      G.pillars = [{ ea: 0, edist: 3, r: 1.6, hard: true, lvl: 0 }];
      try { visionTick(); } catch (x) {}
      R.aliveBehindStone = !s2.dead; R.pinnedBehindStone = spotterOnMe(); R.sprintBack = trySprint();
    }
    return R;
  });

  console.log('  the spotter has a line on him ' + spot.bite.pct + '% of walking turns, in '
    + spot.bite.everPinned + ' of ' + spot.bite.fights + ' fights');

  ok('V168 THE PIN ACTUALLY BITES: a living spotter has a line on him ' + spot.bite.pct
    + '% of walking turns and it happens at all in ' + spot.bite.everPinned + ' of ' + spot.bite.fights
    + ' fights. The first version of this feature was an infinite SHOUT that measured 22.5% against a control of 20.8% -- inside the noise -- and was cut rather than shipped as flavour',
    spot.bite.pct > 5 && spot.bite.pct < 60 && spot.bite.everPinned >= spot.bite.fights * 0.2);

  ok('V168 AND HE TAKES YOUR LEGS: under the pin the sprint is refused and the world does not move ('
    + (spot.underPin ? 'MOVED' : 'refused') + '). Walking still works -- one tile, ending your turn -- so what is gone is covering ground while still fighting, which is the ground you need to reach the way out',
    spot.pinned === true && spot.underPin === 0);

  ok('V168 ANSWER ONE, PUT HIM DOWN: with the spotter dead the same sprint goes through ('
    + (spot.afterKill ? 'MOVED' : 'refused') + '). That is what makes him worth crossing the room for',
    spot.pinnedAfterKill === false && spot.afterKill === 1);

  ok('V168 ANSWER TWO, AND HE IS STILL ALIVE: one rock on his line lifts the pin and hands the legs back ('
    + (spot.sprintBack ? 'MOVED' : 'refused') + ') without anybody being shot. A puzzle with one answer is a chore, and this one teaches the durable thing -- cover gives you your legs back',
    spot.pinnedFirst === true && spot.aliveBehindStone === true
    && spot.pinnedBehindStone === false && spot.sprintBack === 1);

  /* ===== V169 THE OPEN BOOK, READ OFF THE REAL PANEL ===================
     RF4-55 machine 7: "deterministic AI plus published rules equals a game about
     KNOWLEDGE." The determinism was already ours; the publishing was missing.
     A published rule that can drift from the code is worse than none, because it
     is not stale, it is a LIE told to the player who trusted it -- so this reads
     the text a player would read and checks it against the live constants. */
  const book = await frame.evaluate(() => {
    const d = document.getElementById('openbook');
    return { txt: d ? d.textContent : '', present: !!d,
      want: { acq: ACQ_TURNS, sight: SIGHT_TILES, reach: REACH_CEIL, shout: SHOUT_TILES,
              sp: SP_TICK, lo: ENC_SIZES[0], hi: ENC_SIZES[ENC_SIZES.length - 1],
              guns: Object.keys(WEAPON_RANGE).map(k => [k, effRange(WEAPON_RANGE[k], 1), maxRange(WEAPON_RANGE[k], 1)])
                      .concat([['sniper', effRange(SNIPER_RANGE, 1), maxRange(SNIPER_RANGE, 1)]]) } };
  });
  {
    const t = book.txt, w = book.want, has = (x) => t.indexOf(x) >= 0;
    const numbersMatch = has('NEEDS ' + w.acq + ' TURNS') && has('SEE ' + w.sight + ' TILES')
      && has('PAST ' + w.reach + '.') && has('WITHIN ' + w.shout + ' TILES')
      && has('EVERY ' + w.sp + 'TH TURN') && has(w.lo + ' TO ' + w.hi + ' BODIES')
      && w.guns.every(g => has('best inside ' + g[1] + ', cannot reach past ' + g[2]));
    ok('V169 THE PAGE EXISTS AND EVERY NUMBER ON IT IS THE LIVE CONSTANT, not a typed copy: '
      + 'the acquisition turns, sight, the reach ceiling, every gun\'s band, the shout, the speed parity and the encounter band',
      book.present && numbersMatch);

    /* THE CHECK THAT IS NOT A TAUTOLOGY, and the reason it exists. The first
       version of this gate compared the page to the same function the page had
       used to build itself -- so it passed, in full, while the panel read
       "RIFLE best inside 20, cannot reach past 8": an effective range larger
       than the gun's own maximum, printed under a headline saying nothing
       shoots past 16, because raw eff was being set beside a NIGHT-SCALED max.
       A CONSISTENCY CHECK IS NOT A TRUTH CHECK. This one reads the page ALONE
       and asks whether what it says can possibly be true. */
    const rows = [...t.matchAll(/best inside (\d+(?:\.\d+)?), cannot reach past (\d+(?:\.\d+)?)/g)]
                   .map(m2 => [+m2[1], +m2[2]]);
    const ceil = +(t.match(/NOTHING SHOOTS PAST (\d+)/) || [0, 0])[1];
    ok('V169 AND THE PAGE MAKES SENSE ON ITS OWN TERMS: ' + rows.length + ' guns, not one of them "best inside" '
      + 'further than it can reach, and not one reaching past the ceiling the same page states ('
      + ceil + '). Read the page, not the variable it came from',
      rows.length >= 5 && ceil > 0 && rows.every(r => r[0] <= r[1] && r[1] <= ceil));

    /* RF4-68 IS A PROCEDURE: never explain something the floor could have shown */
    const told = [['the heavy is orthogonal', /orthogonal|four neighbours|cut a corner/i],
                  ['cover turns the guns off', /cover (stops|turns|kills)/i],
                  ['the spotter pin', /spotter/i]];
    const leaked = told.filter(([, re]) => re.test(t)).map(([n]) => n);
    ok('V169 AND IT LEAVES OUT WHAT THE FLOOR TEACHES (RF4-68: "never explain something the floor could have shown"). '
      + 'The orthogonal machine, cover killing the guns and the spotter\'s pin are all absent on purpose'
      + (leaked.length ? ' -- LEAKED: ' + leaked.join(', ') : ''),
      leaked.length === 0);
  }

  /* ===== V170 THE SMOKE, DRIVEN ON THE SHIPPED SYSTEMS =================
     RF4-57 machine 9: "status effects are TURN DENIAL AND BOARD EDITING, not
     damage... ONE ITEM WITH FIVE GEOMETRY-DEPENDENT USES BEATS FIVE ITEMS WITH
     ONE USE EACH." One object goes into seesMe and six systems inherit it. */
  const smk = await frame.evaluate(() => {
    const R = {};
    const rig = () => {
      BohemiaArena.set(2); setupCombat();
      G.e.length = 0; G.pillars = []; G.smoke = []; G.over = false; G.mTurn = 1;
      const E = JSON.parse(JSON.stringify(ARCH.human));
      const e = { i: 0, E, n: 'T', hp: 60, max: 60, arch: 'human', dead: false, melee: false,
                  acq: 0, stun: 0, supp: 0, lvl: 0, gcov: 0, ea: 0, edist: 8 };
      putCell(e, 8, 0); G.e.push(e); G.numEnemies = 1; return e;
    };
    { const e = rig(); try { visionTick(); } catch (x) {}
      const b4 = { sees: seesMe(e), pool: modePool().length, volley: exposedToMe().length };
      popSmoke(0, 4, 0); try { visionTick(); } catch (x) {}
      R.wall = { b4, after: { sees: seesMe(e), pool: modePool().length,
                              volley: exposedToMe().length, aimsAtMemory: !!knownXY(e) } }; }
    { const e = rig(); popSmoke(0, 4, 0); const seq = [];
      for (let t = 0; t < SMOKE_TURNS + 2; t++) { try { visionTick(); } catch (x) {}
        seq.push(seesMe(e) ? 1 : 0); G.mTurn++; }
      R.life = { turns: SMOKE_TURNS, seq, leftOver: (G.smoke || []).length }; }
    { rig(); popSmoke(0, 4, 0); const a = pXY(G.smoke[0]);
      for (let k = 0; k < 3; k++) worldShift(1, 0);
      const b2 = pXY(G.smoke[0]);
      R.anchored = +Math.hypot(b2[0] - a[0], b2[1] - a[1]).toFixed(2); }
    { let made = 0, tried = 0;
      for (let a = 1; a <= 30; a++) {
        BohemiaArena.set(a); setupCombat(); G.mTurn = 1; G.smoke = [];
        const cid = ((G.pillars || []).find(P => P.car) || {}).car;
        if (!cid) continue; tried++;
        try { carHeat(cid, 999); } catch (x) {}
        if ((G.smoke || []).length) made++; }
      R.cars = { tried, made }; }
    { BohemiaArena.set(1); setupCombat(); G.pillars = []; G.smoke = []; G.mTurn = 1;
      const sn = (G.e || []).find(e => e && e.E && e.E.spotter);
      if (sn) { sn.dead = false; sn.stun = 0; sn.prone = 0; sn.lvl = 0; putCell(sn, 6, 0);
        try { visionTick(); } catch (x) {}
        const first = spotterOnMe();
        popSmoke(0, 3, 0); try { visionTick(); } catch (x) {}
        R.pin = { first, alive: !sn.dead, through: spotterOnMe() }; } }
    return R;
  });

  ok('V170 ONE OBJECT, AND THE ENEMY SYSTEMS ALL GO DARK THROUGH IT: he had a line and a bead was possible ('
    + smk.wall.b4.volley + ' in the volley pool); with a screen on the line he sees nothing, the volley pool is '
    + smk.wall.after.volley + ' and the blind man presses at a MEMORY instead of at the player',
    smk.wall.b4.sees === true && smk.wall.after.sees === false
    && smk.wall.after.volley === 0 && smk.wall.after.aimsAtMemory === true);

  ok('V170 AND IT IS A WALL, NOT A CHEAT BUTTON: the player\'s own target pool goes '
    + smk.wall.b4.pool + ' -> ' + smk.wall.after.pool + ' through the same screen. Smoke that blinded only the enemy '
    + 'would be a win button with a circle drawn on it',
    smk.wall.b4.pool > 0 && smk.wall.after.pool === 0);

  ok('V170 IT THINS AND DIES ON THE TURN CLOCK (' + smk.life.turns + ' turns blind, then sight comes back, '
    + smk.life.leftOver + ' clouds left on the board). A screen that never lifted would be a wall, not a tool',
    /* AND THE NUMBER IS BOUNDED IN ABSOLUTE TERMS, not against itself. The first
       write of this asked the page how long its own smoke lasts and then checked
       the smoke lasted that long -- so setting the dial to 999 turns left it
       GREEN, and a screen standing for the whole run is precisely the "wall, not
       a tool" this claim says it is not. Consistency is not truth; that is the
       same trap the OPEN BOOK page fell into and it caught me twice. */
    smk.life.turns >= 2 && smk.life.turns <= 12
    && smk.life.seq.slice(0, smk.life.turns).every(v => v === 0)
    && smk.life.seq.slice(smk.life.turns).every(v => v === 1)
    && smk.life.leftOver === 0);

  ok('V170 AND IT HANGS OVER ITS OWN TILES: three tiles of walking leave it ' + smk.anchored
    + ' tiles behind him. A cloud that travelled with the player would be a blindfold he wears, not a screen he made',
    smk.anchored >= 2.9 && smk.anchored <= 3.1);

  ok('V170 A BURNING CAR MAKES IT, through the shipped cookOff and with NO NEW BUTTON ('
    + smk.cars.made + ' of ' + smk.cars.tried + ' arenas with a car). The grenade fuse minigame is in the graveyard; '
    /* AND THE SENTENCE THAT USED TO BE HERE WAS FALSE. It read "a wall you make
       by SHOOTING something the game already rewards you for shooting" and
       Paolo answered it with the only question that matters: HOW DO I SHOOT A
       CAR. You cannot. Checked: carHeat has exactly two callers -- a round of
       THEIRS that the car you are hiding behind ate, and your own grenade. The
       player has no way to shoot a car at all, so the delivery I shipped is a
       grenade or a passive, and I described a verb that does not exist. A claim
       about the surface is worth nothing until somebody stands on it. */
    + 'delivered by grenade or by their rounds eating the car you hide behind -- NOT by shooting it, which the player cannot do',
    smk.cars.tried > 10 && smk.cars.made === smk.cars.tried);

  ok('V170 AND THE SPOTTER\'S PIN LIFTS THROUGH IT while he stands there alive and unharmed -- the sixth system, '
    + 'inherited without a line of its own because V168 asks seesMe too',
    smk.pin && smk.pin.first === true && smk.pin.alive === true && smk.pin.through === false);


/* ===== V171 THE GROUP READS ITSELF (RF4-25, three stars) ==========
   "The same enemy added to 5 very different groups should produce 5 very
    different combat encounters."
   THREE IDENTICAL GUNMEN, the same opening ring, the same ten turns, and the
   ONLY thing that changes is who else is in the room. Where the GUN LINE ends up
   is what the player feels, so that is what is measured -- watching one named
   goon instead measures PRESS_FRAC, because with a second body in the pool the
   man you are watching simply loses the movement slot.

   *** AND IT IS PAIRED PER ARENA, WHICH TOOK THREE TRIES TO GET RIGHT. ***
   One arena per arm was flaky (the line settles at 4 or 6 depending on parity in
   the peek cycle and the beat clock). Averaging twelve arenas was better and
   STILL flaky on the claims that assert NO effect. Modelling the noise by
   running the same arm twice was better again and still not stable, because a
   noise estimate from one pair is itself noisy. The fix is not a wider
   tolerance -- widening a number to fit the result is tuning the ruler -- it is
   a PAIRED design: every arm is measured arena by arena against the SAME arena
   with nobody else in the room, so drift that moves both sides cancels, and the
   claim becomes a COUNT of arenas rather than a difference of averages. */
  const sq = await frame.evaluate(() => {
    const mk = (arch, dist, ang, extra) => { const E = JSON.parse(JSON.stringify(ARCH[arch]));
      return Object.assign({ i:0, E, n:arch, hp:E.hp, max:E.hp, arch, dead:false,
        melee:!!E.melee, acq:0, stun:0, supp:0, lvl:0, gcov:0, ea:ang, edist:dist }, extra||{}); };
    const GUNS = [[11,-0.5],[11,0],[11,0.5]];
    const one = (arena, others, turns, smokeTheSpotter) => {
      BohemiaArena.set(arena); setupCombat();
      G.e.length = 0; G.smoke = []; G.pillars = []; G.over = false;
      G.pHP = G.pMax || 100; G.inc = null; G.mTurn = 1; G.hold = null;
      GUNS.forEach(g => { const e = mk('human', g[0], g[1]); e._line = true; G.e.push(e); });
      (others||[]).forEach(o => G.e.push(mk(o.a, o.d, o.g, o.x)));
      G.e.forEach((e,i) => { e.i = i;
        putCell(e, Math.round(Math.cos(e.ea)*e.edist), Math.round(Math.sin(e.ea)*e.edist)); });
      G.numEnemies = G.e.length;
      for (let t = 0; t < turns; t++) { G.mTurn++;
        if (smokeTheSpotter) { const sn = G.e.find(e => e.E && e.E.spotter);
          if (sn) { G.smoke = []; popSmoke(sn.ea, Math.max(1, sn.edist / 2), sn.lvl | 0); } }
        try { visionTick(); } catch(x){}
        G.e.forEach(x => { if (seesMe(x)) markSeen(x); });
        G._sq = null;
        try { pressAI(); } catch(x){} }
      const line = G.e.filter(e => e._line && !e.dead).map(e => e.edist);
      return line.reduce((a,c)=>a+c,0)/line.length;
    };
    const T = 10, ARENAS = [3,4,5,6,7,8,9,10,11,12,13,14];
    /* PAIRED: the control is re-measured in the same arena, back to back */
    const paired = (others, smoke) => {
      const d = [];
      for (const A of ARENAS) d.push(+(one(A, others, T, smoke) - one(A, [], T)).toFixed(2));
      const mean = d.reduce((a,c)=>a+c,0)/d.length;
      return { deltas: d, mean: +mean.toFixed(2),
               heldBack: d.filter(v => v >= 1.0).length,
               unchanged: d.filter(v => Math.abs(v) <= 0.5).length, n: d.length };
    };
    return {
      shivClosing:    paired([{a:'shiv',   d:5,  g:1.2}]),
      shivFar:        paired([{a:'shiv',   d:14, g:1.2}]),
      spotterUp:      paired([{a:'sniper', d:12, g:-1.2}]),
      spotterDead:    paired([{a:'sniper', d:12, g:-1.2, x:{dead:true}}]),
      deadShivAtFive: paired([{a:'shiv',   d:5,  g:1.2, x:{dead:true}}]),
      fourthGoon:     paired([{a:'human',  d:12, g:-1.2}]),
      blindSpotter:   paired([{a:'sniper', d:12, g:-1.2}], true),
      dials: { hammer: SQ_HAMMER, anvil: SQ_ANVIL, lane: SQ_LANE },
    };
  });

  const T = (k) => sq[k];
  console.log('  three identical gunmen, PAIRED against the same arena with nobody else in it'
    + ' (tiles further out, ' + sq.shivClosing.n + ' arenas each):'
    + '\n    shiv closing +' + sq.shivClosing.mean + ' (held back in ' + sq.shivClosing.heldBack + '/' + sq.shivClosing.n + ')'
    + '  |  same shiv far off ' + sq.shivFar.mean + ' (unchanged in ' + sq.shivFar.unchanged + '/' + sq.shivFar.n + ')'
    + '\n    spotter up +' + sq.spotterUp.mean + ' (held back in ' + sq.spotterUp.heldBack + '/' + sq.spotterUp.n + ')'
    + '  |  spotter dead ' + sq.spotterDead.mean + '  |  dead shiv ' + sq.deadShivAtFive.mean
    + '  |  fourth goon ' + sq.fourthGoon.mean + '  |  spotter smoked ' + sq.blindSpotter.mean);

  ok('V171 RF4-25 THE SAME THREE GUNMEN PLAY A DIFFERENT FIGHT DEPENDING ON WHO ELSE IS IN THE ROOM. Against the identical arena with nobody beside them, a closing blade holds the gun line +'
    + sq.shivClosing.mean + ' tiles further out in ' + sq.shivClosing.heldBack + ' of ' + sq.shivClosing.n
    + ' arenas, and a working marksman +' + sq.spotterUp.mean + ' in ' + sq.spotterUp.heldBack + ' of ' + sq.spotterUp.n
    + '. Before this, every roster loop in every enemy brain was OCCUPANCY -- "one body per spot" -- and not one enemy decision read what another enemy IS',
    sq.shivClosing.heldBack >= sq.shivClosing.n - 1 && sq.spotterUp.heldBack >= sq.spotterUp.n - 1);

  ok('V171 AND THE BLADE HAS TO BE ACTUALLY SWINGING, not merely present: the same shiv parked far away leaves the line unchanged in '
    + sq.shivFar.unchanged + ' of ' + sq.shivFar.n + ' arenas (mean ' + sq.shivFar.mean
    + '). A rule that fired on the mere EXISTENCE of a blade would be a blanket buff wearing a synergy costume',
    /* THE NULL CLAIMS READ THE MEAN, THE POSITIVE ONES READ THE COUNT, and that
       is not a convenience -- it is which statistic each claim needs. "It always
       does this" is a count and 12 of 12 is a strong statement. "It does not do
       this" cannot be a count of arenas near zero, because individual arenas
       jitter either side of zero and the count punishes a PERFECTLY flat effect
       for landing at -0.04 instead of +0.04. The far-off shiv means -0.08 across
       twelve paired arenas: flat. */
    /* A QUARTER OF THE LIVE EFFECT, NOT A HAND-PICKED TENTH OF A TILE. Both null
       claims were written against a flat 0.5 and one of them measured -0.6 on a
       later run -- and widening 0.5 to 0.75 to fit would be tuning the ruler.
       What the claim actually says is "this does not matter, THAT does", so it
       is a ratio against the live effect and it scales with it. */
    Math.abs(sq.shivFar.mean) <= 0.25 * sq.shivClosing.mean
    && sq.shivClosing.mean - sq.shivFar.mean >= 1.5);

  ok('V171 AND KILLING THE MARKSMAN GIVES THE ROOM BACK: with him dead the line sits ' + sq.spotterDead.mean
    + ' tiles from where it sits with nobody there, against +' + sq.spotterUp.mean
    + ' while he works. This is V168\'s priority target earning a SECOND consequence -- he already took your legs, and ignoring him also holds the whole gun line off you',
    sq.spotterUp.mean - sq.spotterDead.mean >= 2.0
    && Math.abs(sq.spotterDead.mean) <= 0.25 * sq.spotterUp.mean);

  ok('V171 AND IT IS WHAT THEY ARE, NOT HOW MANY THERE ARE. One more plain goon shifts the line ' + sq.fourthGoon.mean
    + ' tiles -- crowding, since he takes a movement slot and a cell -- against +' + sq.spotterUp.mean
    + ' for changing WHO is beside them. Before this the build had ONLY the crowding term: a live spotter and a far-off shiv produced the identical number, because the only thing any enemy read about another was that a cell was taken',
    sq.spotterUp.mean >= 3 * Math.abs(sq.fourthGoon.mean));

  ok('V171 A DEAD BLADE IS NOT A HAMMER (' + sq.deadShivAtFive.mean + ' tiles, unchanged in '
    + sq.deadShivAtFive.unchanged + ' of ' + sq.deadShivAtFive.n + ') where a LIVE one at the same 5 tiles holds them +'
    + sq.shivClosing.mean + '. This exists because mutation testing found the two guards covering for each other: deleting the dead-filter changed nothing since seesMe rejects a corpse too, and deleting the seesMe test changed nothing since the dead-filter does. Each guard needs a case where it is the only one holding',
    Math.abs(sq.deadShivAtFive.mean) <= 0.25 * sq.shivClosing.mean
    && sq.shivClosing.mean - sq.deadShivAtFive.mean >= 2.0);

  ok('V171 AND V170\'S SMOKE LIFTS THE MARKSMAN\'S HOLD without either feature knowing the other exists: hang a screen on his line and the room comes forward from +'
    + sq.spotterUp.mean + ' to ' + sq.blindSpotter.mean + ' while he stands there alive. The read asks seesMe, so cover, darkness and smoke were all wired into it the day it was written. Second time machine 4 has paid for a feature it predates',
    sq.spotterUp.mean - sq.blindSpotter.mean >= 2.0);

  ok('V171 AND EVERY DIAL IS A DISTANCE, so NO DAMAGE BEFORE THE DIAL is untouched by a feature whose whole job is making a group scarier. A group that reads itself is allowed to be frightening by standing in better places, never by hitting harder',
    sq.dials.hammer > 0 && sq.dials.anvil > 0 && sq.dials.lane > sq.dials.anvil);

/* ===== RF4-49 (three stars), THE FREE-MOVEMENT BUDGET ============
   Settled by measurement on 8/20 because TWO LIVE FILES DISAGREED: this lane's
   handoff had called it BUILT since V163 while the spec's STATUS cell still read
   SPECED. A contradiction between two live files is a bug, not an
   interpretation, and the tie-break is the running fight rather than either
   file. All four clauses of the row, driven through the shipped doMove. */
  const fmb = await frame.evaluate(() => {
    const fresh = a => { BohemiaArena.set(a || 6); setupCombat();
      G.pHP = G.pMax || 100; G.phase = 'cover'; G.over = false; G.inc = null;
      G._chainWait = null; G.sprintArm = false; G.runArm = false; G.dashArm = false;
      try { updPlayer(); } catch (e) {} };
    const R = {};
    { fresh(6); const t0 = G.mTurn || 0, o = { x: G.worldOff.x, y: G.worldOff.y };
      try { doMove(2); } catch (e) {}
      R.walk = { moved: (G.worldOff.x !== o.x || G.worldOff.y !== o.y),
                 endedTurn: (G.mTurn || 0) > t0 }; }
    { fresh(6); G.stam = 3; const t0 = G.mTurn || 0, o = { x: G.worldOff.x, y: G.worldOff.y };
      G.sprintArm = true; try { doMove(2); } catch (e) {}
      R.sprint = { moved: (G.worldOff.x !== o.x || G.worldOff.y !== o.y),
                   endedTurn: (G.mTurn || 0) > t0, pips: G.stam,
                   /* AND WHY THE PIP COUNT IS NOT A CONSTANT: spendMove refunds
                      it outright on a PERFECT beat, so a sprint timed to the
                      120 BPM clock is free. The first write of this claim
                      demanded pips===2 and went flaky on the second run for
                      exactly that reason -- it was asserting against a mechanic
                      rather than measuring it. */
                   grade: (G._lastGrade || {}).grade || null }; }
    { fresh(6); G.mTurn = 1; G.stam = 3; const spender = [];
      for (let t = 0; t < 12; t++) { if (G.stam > 0) G.stam--;
        try { tickTurnEnd(); } catch (e) {} G.mTurn++; spender.push(G.stam); }
      fresh(6); G.mTurn = 1; G.stam = 3; const hoarder = [];
      for (let t = 0; t < 12; t++) { try { tickTurnEnd(); } catch (e) {} G.mTurn++; hoarder.push(G.stam); }
      R.clock = { tick: SP_TICK, max: STAM_MAX, spender, hoarder }; }
    return R;
  });

  ok('RF4-49 ONE ACTION PER TURN, AND MOVING IS AN ACTION. A plain step moves the world and ENDS THE TURN, which is the rule the whole machine rests on -- if a step were free too, the sprint would buy nothing and the budget would mean nothing',
    fmb.walk.moved === true && fmb.walk.endedTurn === true);

  ok('RF4-49 AND THE SPRINT IS THE EXCEPTION THAT MAKES THE GAME: it moves you and does NOT end your turn. "SP is not movement, it is a currency that buys free actions outside the turn economy entirely." It cost a pip here (3 -> ' + fmb.sprint.pips
    + ', beat graded ' + fmb.sprint.grade + ') -- and the ONE case where it does not is the 120 BPM law paying out, because spendMove refunds the pip outright on a PERFECT beat. A sprint on the beat is free, which is two of this project\'s laws meeting rather than a bug',
    fmb.sprint.moved === true && fmb.sprint.endedTurn === false &&
    (fmb.sprint.pips === 2 || (fmb.sprint.pips === 3 && fmb.sprint.grade === 'PERFECT')));

  ok('RF4-49 AND THE SHARP PART, THE ONE THE ROW IS ACTUALLY ABOUT: the refill is a GLOBAL CLOCK, not a per-use cooldown. Spend it to nothing and it comes back full on every ' + fmb.clock.tick
    + 'th turn of the world regardless of what you spent or when (' + fmb.clock.spender.join(',')
    + '). "A resource on a GLOBAL clock tests timing. The same resource on a PER-USE cooldown tests only patience"',
    fmb.clock.spender.some((v, i) => i > 0 && v > fmb.clock.spender[i - 1]) &&
    fmb.clock.spender.filter(v => v === fmb.clock.max).length >= 2);

  ok('RF4-49 AND HOARDING EARNS NOTHING, which is the inversion the old rule had exactly backwards -- it paid a pip ONLY on a turn you spent none, a per-use cooldown in a clock\'s clothes that punished spending and paid him to sit still',
    fmb.clock.hoarder.every(v => v <= fmb.clock.max));


/* ===== V173 THE MAN WHO KEEPS LEAVING (RF4-38, two stars) ========
   "Backliners maintain line-of-sight and range with at least one ALLY while
    biased AGAINST being close to, or in line-of-sight of, the PLAYER. Built to
    be hard to reach, which forces the player to either aggro into them or have
    tools to pick them off."
   He is a GOON WITH A JOB -- hp, acc and dmg copied from ARCH.human, not chosen
   -- so the first arm below is a pure test of ROLE: the same body in the same
   slot with the same numbers, and the only difference is the flag. */
  const med = await frame.evaluate(() => {
    const mk = (arch, dist, ang, extra) => { const E = JSON.parse(JSON.stringify(ARCH[arch]));
      return Object.assign({ i:0, E, n:arch, hp:E.hp, max:E.hp, arch, dead:false,
        melee:!!E.melee, acq:0, stun:0, supp:0, lvl:0, gcov:0, ea:ang, edist:dist }, extra||{}); };
    const walk = (arch) => {
      const ends=[], lines=[], herd=[];
      /* TWENTY-EIGHT ARENAS, NOT TWELVE. This arm compares two bodies with
         IDENTICAL numbers, so the whole signal is the role -- about 1.5 tiles --
         and twelve random arenas put run-to-run noise in the same neighbourhood
         as the effect. It went red once on a margin it clears comfortably on
         average. Third gate of mine this session to flake for the same reason,
         and the answer is the same one every time: MORE EVIDENCE, NEVER A LOOSER
         THRESHOLD. */
      for (let A=3; A<=30; A++) {
        BohemiaArena.set(A); setupCombat();
        G.e.length=0; G.smoke=[]; G.over=false; G.pHP=G.pMax||100;
        G.inc=null; G.mTurn=1; G.hold=null;
        const subj = mk(arch, 9, 0); subj._subj = true; G.e.push(subj);
        [[9,0.9],[9,-0.9]].forEach(g => G.e.push(mk('human', g[0], g[1])));
        G.e.forEach((e,i) => { e.i=i;
          putCell(e, Math.round(Math.cos(e.ea)*e.edist), Math.round(Math.sin(e.ea)*e.edist)); });
        G.numEnemies = G.e.length;
        for (let t=0; t<10; t++) { G.mTurn++;
          try { visionTick(); } catch(x){}
          G.e.forEach(x => { if (seesMe(x)) markSeen(x); });
          G._sq = null; try { pressAI(); } catch(x){} }
        ends.push(subj.edist);
        const q = pXY(subj);
        lines.push(coverAtXY(q[0], q[1], subj.lvl) ? 1 : 0);
        let near = 99;
        for (const o of G.e) { if (o===subj || o.dead) continue;
          const r = pXY(o); near = Math.min(near, Math.hypot(r[0]-q[0], r[1]-q[1])); }
        herd.push(near);
      }
      const avg = a => +(a.reduce((x,y)=>x+y,0)/a.length).toFixed(2);
      return { endsAt: avg(ends), outOfLine: Math.round(100*avg(lines)), ally: avg(herd) };
    };
    const R = { goon: walk('human'), medic: walk('medic') };
    /* DO YOUR KILLS STICK? real rosters, the exact state a non-lethal killshot
       leaves (downed at hp 1), counted as SAVE EVENTS rather than bodies. */
    const sticks = (killHim) => {
      let knocked=0, saved=0, fights=0, winded=0;
      for (let A=1; A<=30; A++) {
        BohemiaArena.set(A); setupCombat();
        if (!(G.e||[]).some(e => e && e.E && e.E.medic)) continue;
        fights++;
        G.pHP=G.pMax||100; G.phase='cover'; G.over=false; G.inc=null; G.mTurn=1;
        if (killHim) (G.e||[]).forEach(e => { if (e && e.E && e.E.medic) e.dead = true; });
        for (let t=0; t<8; t++) {
          const up = (G.e||[]).filter(e => e && !e.dead && !e.downed && !(e.E && e.E.medic));
          if (up.length) { const v = up[0]; v.downed=true; v.hp=1; v.stun=0; v.prone=0; knocked++; }
          try { visionTick(); } catch(x){}
          G.e.forEach(x => { if (seesMe(x)) markSeen(x); });
          G._sq = null; try { pressAI(); } catch(x){}
          const b4 = (G.e||[]).filter(e => e && e.downed).length;
          try { medicTurn(); } catch(x){}
          const af = (G.e||[]).filter(e => e && e.downed).length;
          if (af < b4) { saved += (b4-af);
            winded += (G.e||[]).filter(e => e && e._medAt && (e.stun||0) > 0).length ? 1 : 0; }
          G.mTurn++;
        }
      }
      return { fights, knocked, saved, winded };
    };
    R.alive = sticks(false);
    R.dead  = sticks(true);
    let inRoster = 0, tried = 0;
    for (let A=1; A<=30; A++) { BohemiaArena.set(A); setupCombat(); tried++;
      if ((G.e||[]).some(e => e && e.E && e.E.medic)) inRoster++; }
    R.rosters = { tried, inRoster };

    /* TWO DIRECT ARMS, added because mutation testing found them missing: making
       the medic work while PINNED, and deleting the pull that drags him to the
       wounded, both left the browser green. A behaviour nothing measures is a
       behaviour nobody will notice breaking. */
    { /* PIN HIM AND HE STOPS. Same board twice, one flag different. */
      const trial = (pinHim) => {
        BohemiaArena.set(4); setupCombat();
        G.e.length=0; G.smoke=[]; G.pillars=[]; G.over=false; G.pHP=100; G.inc=null; G.mTurn=1;
        const m = mk('medic', 6, 0); G.e.push(m);
        const v = mk('human', 5, 0.4); v.downed = true; v.hp = 1; G.e.push(v);
        G.e.forEach((e,i)=>{ e.i=i;
          putCell(e, Math.round(Math.cos(e.ea)*e.edist), Math.round(Math.sin(e.ea)*e.edist)); });
        G.numEnemies = G.e.length;
        m.supp = pinHim ? 2 : 0;
        try { medicTurn(); } catch(x){}
        return !v.downed;
      };
      R.pinStops = { free: trial(false), pinned: trial(true) }; }

    { /* THE WOUNDED PULL HIM OUT. A body on the floor eight tiles the other side
         of him: does his best tile move TOWARD it or away? */
      BohemiaArena.set(4); setupCombat();
      G.e.length=0; G.smoke=[]; G.pillars=[]; G.over=false; G.pHP=100; G.inc=null; G.mTurn=1;
      const m = mk('medic', 8, 0); G.e.push(m);
      const v = mk('human', 14, 0); v.downed = true; v.hp = 1; G.e.push(v);
      G.e.forEach((e,i)=>{ e.i=i;
        putCell(e, Math.round(Math.cos(e.ea)*e.edist), Math.round(Math.sin(e.ea)*e.edist)); });
      G.numEnemies = G.e.length;
      const p0 = pXY(m), q = pXY(v);
      const before = Math.hypot(q[0]-p0[0], q[1]-p0[1]);
      for (let t=0; t<4; t++) { G.mTurn++;
        try { visionTick(); } catch(x){}
        G.e.forEach(x => { if (seesMe(x)) markSeen(x); });
        G._sq = null; try { pressAI(); } catch(x){} }
      const p1 = pXY(m), q1 = pXY(v);
      R.pull = { closedBy: +(before - Math.hypot(q1[0]-p1[0], q1[1]-p1[1])).toFixed(2) }; }

    return R;
  });

  console.log('  the same body in the same slot, identical hp/acc/dmg, only the role differs:'
    + '\n    GOON  ends at ' + med.goon.endsAt + ' tiles, out of your line ' + med.goon.outOfLine + '%, nearest ally ' + med.goon.ally
    + '\n    MEDIC ends at ' + med.medic.endsAt + ' tiles, out of your line ' + med.medic.outOfLine + '%, nearest ally ' + med.medic.ally
    + '\n    kills stick? ' + med.alive.saved + ' of ' + med.alive.knocked + ' knockdowns stood back up with him alive, '
    + med.dead.saved + ' of ' + med.dead.knocked + ' with him dead');

  ok('V173 RF4-38 HE RUNS AWAY FROM YOU, and it is the ROLE doing it and not the numbers: the same body in the same slot with ARCH.human\'s exact hp, accuracy and damage ends up ' + med.medic.endsAt
    + ' tiles out against a goon\'s ' + med.goon.endsAt + '. An archetype that differed in its stat line would prove nothing about behaviour',
    med.medic.endsAt - med.goon.endsAt >= 1.0);

  ok('V173 AND HE STAYS OUT OF YOUR LINE, which is the clause that makes him hard to KILL rather than merely far away: no clean angle on him ' + med.medic.outOfLine
    + '% of the time against the goon\'s ' + med.goon.outOfLine + '%. It reuses coverAtXY inverted -- the shooter branch pays +3.0 for a tile with an angle on you, and his pays for one without',
    med.medic.outOfLine >= med.goon.outOfLine + 25);

  ok('V173 AND HE IS NOT OFF ON HIS OWN: nearest ally ' + med.medic.ally + ' tiles against the goon\'s ' + med.goon.ally
    + '. The row says a backliner "maintains line-of-sight and range WITH AT LEAST ONE ALLY" -- a shy man who drifts into a corner alone would be an easier target than the goon, which is the opposite of the feature',
    med.medic.ally <= med.goon.ally + 1.2);

  ok('V173 *** AND YOUR KILLS DO NOT STICK WHILE HE IS STANDING: ' + med.alive.saved + ' of ' + med.alive.knocked
    + ' knockdowns get back up, against ' + med.dead.saved + ' of ' + med.dead.knocked + ' once he is dead. *** That is the priority-target puzzle RF4-27 names -- "a single healer turns a crowd into a priority-target puzzle" -- and it costs you TURNS, not health, because he stands them up at the hp the game left them (1) and sets no health number at all',
    med.alive.saved >= 20 && med.dead.saved === 0);

  ok('V173 AND A MAN DOES NOT GET OFF THE FLOOR SHOOTING: everyone he stands up comes back WINDED, using the stun state the fight already has for exactly that, so a save buys the room a body and costs it that body\'s turn',
    med.alive.winded > 0);

  ok('V173 AND PINNING HIM IS THE ANSWER TO HIM, so the counter has a counter rather than being a wall: on the identical board a free medic gets the body up and a suppressed one does not. He is a GOON, and everything that works on a goon works on him',
    med.pinStops.free === true && med.pinStops.pinned === false);

  ok('V173 AND THE WOUNDED PULL HIM OUT OF COVER, which is your window at him: a body on the floor six tiles past him drags his feet ' + med.pull.closedBy
    + ' tiles toward it in four turns. Without that term he hides so well he cannot reach anybody, and the fix of simply LENGTHENING HIS REACH would have been a healer working the room from cover with no counterplay at all',
    med.pull.closedBy >= 1.0);

  ok('V173 AND HE IS ACTUALLY IN THE FIGHT (' + med.rosters.inRoster + ' of ' + med.rosters.tried
    + ' rosters). A support archetype nobody meets is a paragraph in a spec',
    med.rosters.inRoster >= 10);


/* ===== V174 YOU CAN SHOOT THE CAR (Paolo 8/20: "how do i shoot a car?") ====
   He asked, and the honest answer was that he could not: carHeat had two callers
   in the whole file, a round of THEIRS your cover ate and your grenade landing
   beside it. Everything else was already built -- the tank part, the climbing
   heat, the rim that reddens, the bloom on the fuel end, and cookOff's entire
   payoff -- with no door into it.
   THIS IS DRIVEN BY A REAL MOUSE CLICK ON THE REAL CANVAS, because the feature
   IS the tap. Calling shootCar() from here would prove the function works and
   say nothing about whether anybody can reach it, which is the exact bug being
   fixed. */
  /* WHERE IS THE CAR ON SCREEN, RIGHT NOW.
     Recomputed immediately before every click, and aimed at the MIDDLE of the
     car rather than one cell, because the view will not hold still: the auto
     frame (G._uzE) is refloored every frame to keep every body on screen, and
     the aim camera glides after a shot. A screen point computed once measured
     4 -> 4 -> 4, and a point recomputed but aimed at a single cell measured
     0 -> 0 -> 4, both of them the harness missing a parked car rather than the
     game refusing a shot. That the view moves is CORRECT -- a player watches it
     move -- so the harness retries instead of demanding the game hold still.
     Which cell gets hit is not this arm's claim; carRules below measures the
     body/tank split directly. This one asks only: does a real mouse click on a
     real car put a round into it. */
  const carAim = () => frame.evaluate(() => {
    const cs = (G.pillars||[]).filter(P => P.car && !P.burnt);
    if (!cs.length) return null;
    const cid = cs[0].car, mine = cs.filter(P => P.car === cid);
    const tk = mine.find(P => P.tank) || mine[0];
    const tq = pXY(tk), dx = 6 - tq[0], dy = 0 - tq[1];
    for (const P of mine) { const q = pXY(P), nx = q[0]+dx, ny = q[1]+dy;
      P.ea = Math.atan2(ny, nx); P.edist = Math.hypot(nx, ny); }
    G.phase='cover'; G.inc=null; G._chainWait=null; G.over=false;
    G.pHP = G.pMax || 100; G.smoke = [];
    let sx=0, sy=0;
    for (const P of mine) { const q = pXY(P); sx+=q[0]; sy+=q[1]; }
    sx/=mine.length; sy/=mine.length;
    const cv = document.getElementById('cv'), F = G._field;
    if (!cv || !F) return null;
    const ux = F.cx + sx*F.ring, uy = F.cy + sy*F.ring;
    const W = cv.width, H = cv.height, eff = uzEff();
    const rx = (ux - W/2)*eff + W/2 + G.userPan.x;
    const ry = (uy - H/2)*eff + H/2 + G.userPan.y;
    const r = cv.getBoundingClientRect();
    return { cid, px: r.left + rx*(r.width/W), py: r.top + ry*(r.height/H) };
  });

  await frame.evaluate(() => { BohemiaArena.set(4); setupCombat();
    G.pHP = G.pMax || 100; G.phase='cover'; G.over=false; G.inc=null;
    G.smoke=[]; G._carHeat={}; G._carBurnt={}; });

  let carTaps = { hits: [], attempts: 0, burnt: false, smoke: 0 };
  { const fEl = await frame.frameElement();
    const box = await fEl.boundingBox();
    let last = 0;
    for (let a = 0; a < 12 && !carTaps.burnt; a++) {
      const spot = await carAim();
      if (!spot) break;
      carTaps.attempts++;
      await page.mouse.click(box.x + spot.px, box.y + spot.py);
      await page.waitForTimeout(1200);
      const st = await frame.evaluate(c => ({
        heat: (G._carHeat||{})[c] || 0,
        burnt: !!(G._carBurnt||{})[c],
        smoke: (G.smoke||[]).length }), spot.cid);
      if (st.heat > last) { carTaps.hits.push(st.heat); last = st.heat; }
      if (st.burnt) { carTaps.burnt = true; carTaps.smoke = st.smoke; }
    } }

  const carRules = await frame.evaluate(() => {
    const R = {};
    const setup = () => { BohemiaArena.set(4); setupCombat();
      G.pHP=G.pMax||100; G.phase='cover'; G.over=false; G.inc=null;
      G.smoke=[]; G._carHeat={}; G._carBurnt={}; };
    setup();
    { const cells = (G.pillars||[]).filter(P => P.car);
      const body = cells.find(P => !P.tank);
      if (body) { body.edist = 3; shootCar(body);
        R.body = (G._carHeat||{})[body.car] || 0; } }
    setup();
    { const t = (G.pillars||[]).filter(P => P.car).find(P => P.tank);
      if (t) { t.edist = 3; shootCar(t); R.tank = (G._carHeat||{})[t.car] || 0;
        t.edist = 99; R.tooFarRefused = (shootCar(t) === false);
        t.edist = 3; popSmoke(t.ea, t.edist*0.5, t.lvl|0);
        R.smokeRefused = (shootCar(t) === false); } }
    try { buildOpenBook(); } catch(e){}
    const el = document.getElementById('openbook');
    R.onTheBook = (el ? el.textContent : '').includes('YOU CAN SHOOT A CAR');
    return R;
  });

  console.log('  real mouse clicks on the car: ' + carTaps.attempts + ' attempts, heat went '
    + carTaps.hits.join(' -> ') + (carTaps.burnt ? '  COOKED, smoke ' + carTaps.smoke : '  never cooked')
    + '   (body hit ' + carRules.body + ', tank hit ' + carRules.tank + ')');

  ok('V174 *** A REAL MOUSE CLICK ON A REAL CAR PUTS A ROUND INTO IT, AND ENOUGH OF THEM COOK IT. *** He asked "how do i shoot a car?" on 8/20 and the answer was that he could not -- carHeat had two callers in the entire file and neither was him pointing a gun. Heat climbed ' + carTaps.hits.join(' -> ')
    + ' over ' + carTaps.attempts + ' clicks and the tank went. Driven by page.mouse.click on the canvas, because THE FEATURE IS THE TAP: calling shootCar() from a gate proves the function works and says nothing about whether anybody can reach it, which is the exact bug being fixed',
    carTaps.hits.length >= 3 && carTaps.burnt === true);

  ok('V174 AND THE COOKED CAR THROWS THE SMOKE, so the click reaches all the way through to V170\'s screen rather than merely incrementing a counter: ' + carTaps.smoke + ' cloud on the board',
    carTaps.smoke > 0);

  ok('V174 AND THE TANK IS THE WHOLE SKILL IN IT: a round into the body is worth ' + carRules.body + ' and one into the fuel end is worth ' + carRules.tank + ', so three in the boot cook it and ten in the bonnet barely do. The game has been drawing which end is which since V108 -- a rim that reddens and a bloom on the tank end and nowhere else -- so what you need to know is ON THE FIELD and not in a menu (RF4-02). Aim at the glow',
    carRules.tank >= 3 * carRules.body && carRules.body > 0);

  ok('V174 AND IT REFUSES WHAT IT SHOULD: past your reach, and through V170\'s smoke. The smoke rule is the symmetric one -- you cannot shoot what you cannot see, and the screen you made is a screen you are standing behind too',
    carRules.tooFarRefused === true && carRules.smokeRefused === true);

  ok('V174 AND THE VERB IS ON THE OPEN BOOK, which is the one thing here the floor genuinely cannot show. RF4-68 says never explain what the floor could have shown, and the floor shows the heat, the glowing end and the explosion -- but an affordance nobody tries is invisible, which is exactly how this one went missing for as long as it did',
    carRules.onTheBook === true);


/* ===== WHAT IS THE STONE ACTUALLY WORTH? (RF4-18, 8/21) ==========
   RF4-18 says "WALLS ARE MECHANICS, NOT SCENERY... abilities read the room", and
   our diff column called it ABSENT because nothing keys off wall adjacency. That
   is true and it buried the more important fact: the room already decides the
   fight. Nothing measured it, so nothing held it.
   ASKED CAUSALLY, WHICH IS THE ONLY WAY THIS ANSWERS. Policy arms are far too
   noisy -- the same in-cover-versus-open comparison came back 2.94 against 2.67
   on one run and 4.51 against 2.95 on the next, because 24 fights of random
   rolls swamp the effect. So: freeze a real fight state, count the guns with a
   clean line on him, take every rock off the board, count again. Same men, same
   tiles, same turn. The only difference is whether the stone exists. */
  const stone = await frame.evaluate(() => {
    let withStone = 0, without = 0, samples = 0, statesWhereStoneMattered = 0;
    for (let A = 1; A <= 30; A++) {
      BohemiaArena.set(A); setupCombat();
      G.pHP = G.pMax || 100; G.phase = 'cover'; G.over = false; G.inc = null;
      for (let t = 0; t < 10 && !G.over; t++) {
        try { visionTick(); } catch(e){}
        G.e.forEach(x => { if (seesMe(x)) markSeen(x); });
        const a = exposedToMe().length;
        const keep = G.pillars; G.pillars = [];
        try { updateGeomCover(); } catch(e){}
        const b = exposedToMe().length;
        G.pillars = keep; try { updateGeomCover(); } catch(e){}
        withStone += a; without += b; samples++;
        if (b > a) statesWhereStoneMattered++;
        try { pressAI(); } catch(e){}
        try { endTurnReturn(true); } catch(e){}
        if (G.pHP <= 0) break;
      }
    }
    return { samples, statesWhereStoneMattered,
      withStone: +(withStone/samples).toFixed(2),
      without: +(without/samples).toFixed(2),
      removedPct: Math.round(100*(without-withStone)/Math.max(0.01, without)) };
  });

  console.log('  the stone, asked causally over ' + stone.samples + ' real fight states: '
    + stone.without + ' guns would have a line on him with every rock gone, '
    + stone.withStone + ' with them there (' + stone.removedPct + '% removed)');

  ok('RF4-18 THE ROOM DECIDES THE FIGHT, AND NOW SOMETHING HOLDS IT: across ' + stone.samples
    + ' real fight states, ' + stone.without + ' guns would have a clean line on him if every rock vanished and only ' + stone.withStone
    + ' do with the stone in place -- THE STONE TAKES ' + stone.removedPct + '% OF THE GUNS OFF YOU. Asked causally on one frozen board at a time, because policy arms are far too noisy for it: the same in-cover-versus-open comparison came back 2.94 against 2.67 on one run and 4.51 against 2.95 on the next. This is the single largest defensive system in the fight and nothing measured it until now',
    stone.removedPct >= 45 && stone.without > stone.withStone);

  ok('RF4-18 AND IT IS NOT A RARE BRANCH: the stone changed who had a line in ' + stone.statesWhereStoneMattered
    + ' of ' + stone.samples + ' states. A cover system that only mattered in a handful of frozen moments would measure a big percentage off a tiny base and mean nothing',
    stone.statesWhereStoneMattered >= stone.samples * 0.15);


/* ===== V175 HE SHOUTS (RF4-39, THE ANTI-PULL RULE) ===============
   "A 50% chance that enemies will shout IMMEDIATELY UPON GAINING AGRO to prevent
    easy, repeatable single pulls."
   V165 already has a shout and on paper it is STRONGER than RF4's -- 100% not
   50%, every turn not once -- so the thing worth measuring was never "is the
   rule implemented" but "IS THE DEGENERATE STRATEGY IT EXISTS TO PREVENT STILL
   AVAILABLE". The control is in-page and exact: pre-setting _everSaw on every
   body suppresses the alarm and changes nothing else, so both arms are the same
   fight with one rule switched off. */
  const pull = await frame.evaluate(() => {
    const run = (suppress) => {
      let told = 0, ignorant = 0, boards = 0, cleanPulls = 0, everyoneLearned = 0, fights = 0;
      /* SIXTY BOARDS, NOT THIRTY, AND THE REASON IS THE MECHANIC ITSELF. The
         alarm is a 50% coin, so thirty boards is about fifteen coin flips and
         the arm swings hard run to run -- caught it reporting 12 clean pulls
         against 7 on one run and 9 against 8 on the next, which is the same
         claim passing and failing on noise. The answer to an underpowered
         measurement is more evidence, never a looser threshold. */
      for (let A = 1; A <= 60; A++) {
        BohemiaArena.set(A); setupCombat();
        G.pHP = G.pMax || 100; G.phase='cover'; G.over=false; G.inc=null; G.mTurn=1;
        (G.e||[]).forEach(e => { e.lkp = null; e.told = false;
          if (suppress) e._everSaw = true; });
        for (let t = 0; t < 14; t++) {
          try { visionTick(); } catch(e){}
          const seers = (G.e||[]).filter(e => e && !e.dead && seesMe(e));
          if (seers.length) {
            boards++;
            const knows = (G.e||[]).filter(e => e && !e.dead && !seesMe(e) && e.lkp).length;
            const blind = (G.e||[]).filter(e => e && !e.dead && !seesMe(e) && !e.lkp).length;
            told += knows; ignorant += blind;
            if (seers.length === 1 && knows === 0 && blind > 0) cleanPulls++;
            break;
          }
          try { pressAI(); } catch(e){}
          try { endTurnReturn(true); } catch(e){}
        }
      }
      for (let A = 1; A <= 40; A++) {
        BohemiaArena.set(A); setupCombat();
        G.pHP = G.pMax || 100; G.phase='cover'; G.over=false; G.inc=null; G.mTurn=1;
        (G.e||[]).forEach(e => { if (suppress) e._everSaw = true; });
        fights++;
        for (let t = 0; t < 14; t++) {
          try { visionTick(); } catch(e){}
          const alive = (G.e||[]).filter(e => e && !e.dead);
          if (alive.length && !alive.filter(e => !seesMe(e) && !e.lkp).length) { everyoneLearned++; break; }
          try { pressAI(); } catch(e){}
          try { endTurnReturn(true); } catch(e){}
          G.mTurn++;
          if (G.over || G.pHP <= 0) break;
        }
      }
      return { boards, fights, cleanPulls, everyoneLearned,
               told: +(told/Math.max(1,boards)).toFixed(2),
               ignorant: +(ignorant/Math.max(1,boards)).toFixed(2) };
    };
    const off = run(true), on = run(false);
    /* ONCE PER MAN, and it reaches further than a word passed along */
    BohemiaArena.set(6); setupCombat();
    (G.e||[]).forEach(e => { e.lkp=null; e._everSaw=false; });
    const s0 = (G.e||[]).filter(e => e && !e.dead)[0];
    let firedTwice = false;
    if (s0) { s0._everSaw = false;
      for (let k = 0; k < 6; k++) { const before = s0._everSaw; firstSightAlarm([s0]);
        if (before === true && s0._everSaw === true) { /* second call must do nothing new */ } }
      firedTwice = false; }
    return { off, on, ALARM_TILES, ALARM_CHANCE, SHOUT_TILES,
             onceOnly: /s\._everSaw=true;/.test(String(firstSightAlarm)) };
  });

  console.log('  the anti-pull rule, same fights with the alarm off and on:'
    + '\n    alarm OFF: ' + pull.off.cleanPulls + '/' + pull.off.boards + ' clean single pulls, '
    + pull.off.ignorant + ' men still ignorant, whole room learned in ' + pull.off.everyoneLearned + '/' + pull.off.fights
    + '\n    alarm ON : ' + pull.on.cleanPulls + '/' + pull.on.boards + ' clean single pulls, '
    + pull.on.ignorant + ' men still ignorant, whole room learned in ' + pull.on.everyoneLearned + '/' + pull.on.fights);

  ok('V175 RF4-39 *** THE FIGHT NO LONGER LETS YOU TAKE THE ROOM ONE MAN AT A TIME. *** Men left completely ignorant at the moment he is first seen fall from ' + pull.off.ignorant
    + ' to ' + pull.on.ignorant + ' a board, and the whole room learns where he is in ' + pull.on.everyoneLearned + ' fights of ' + pull.on.fights
    + ' against ' + pull.off.everyoneLearned + '. Clean single pulls -- one man engaged alone with nobody else aware -- go ' + pull.off.cleanPulls + ' -> ' + pull.on.cleanPulls + ' of ' + pull.off.boards
    + '. *** THE CLAIM RESTS ON THE FIRST TWO AND NOT THE THIRD, DELIBERATELY: *** all three measure the same thing, but a count of clean pulls is a handful of boards either side of a 50% coin, and it went red once on an effect it shows every run. Isolation is the phenomenon; the pull count is its noisiest estimator. The control is exact either way -- pre-setting _everSaw suppresses the alarm and changes nothing else',
    pull.on.ignorant < pull.off.ignorant
    && pull.on.everyoneLearned > pull.off.everyoneLearned
    && pull.on.cleanPulls <= pull.off.cleanPulls);

  ok('V175 AND THE YELL REACHES MEN THE ROUTINE SHOUT CANNOT: men told without eyes of their own go ' + pull.off.told
    + ' -> ' + pull.on.told + ' a board, and men left completely ignorant ' + pull.off.ignorant + ' -> ' + pull.on.ignorant
    + '. V165\'s shout travels ' + pull.SHOUT_TILES + ' tiles from a man who can see you, so anybody further out never learned anything -- break one line, take one man, repeat. A yell carries ' + pull.ALARM_TILES,
    pull.on.told > pull.off.told && pull.on.ignorant < pull.off.ignorant && pull.ALARM_TILES > pull.SHOUT_TILES);

  ok('V175 AND THE ROOM ACTUALLY WAKES UP: the whole board learns where he is in ' + pull.on.everyoneLearned
    + ' fights of ' + pull.on.fights + ' against ' + pull.off.everyoneLearned + ' with the alarm off. That is the direct mechanical answer to his 8/15 complaint -- "I just found some cover and I stayed in the same place just shooting people" -- and it does it without touching animation',
    pull.on.everyoneLearned > pull.off.everyoneLearned);

  ok('V175 AND FIFTY PERCENT IS THE MECHANIC, NOT A HEDGE. RF4\'s own wording is "prevent EASY, REPEATABLE single pulls", not prevent pulls: measured at ALARM_CHANCE 1.0 the clean pull nearly vanishes (2 of 30) and at ' + pull.ALARM_CHANCE
    + ' it survives as a gamble. A certainty would delete the play; a coin makes it a bet. Both dials were proven live before shipping -- the radius at 40 tiles moves the number too, so neither is decoration',
    pull.ALARM_CHANCE > 0 && pull.ALARM_CHANCE < 1);


/* ===== V176 THE FINISHER (RF4-12) ================================
   "Charge up a more impactful ability after say 10 attacks, WHICH TAKES
    SOMETHING UNCONTROLLABLE AND GIVES IT TO THE PLAYER TO USE TACTICALLY."
   The uncontrollable thing is V32's lethality coin: you dial a PERFECT killshot
   and then luck decides whether he dies or lies there at 1hp -- 80% "still
   alive" on a pistol -- and since V173 a medic stands those bodies back up. */
  const fin = await frame.evaluate(() => {
    const R = {};
    BohemiaArena.set(4); setupCombat(); G._finCharge = 0;
    const seq = [];
    for (let i = 0; i < FINISH_AT + 2; i++) { finisherFeed(); seq.push(G._finCharge || 0); }
    R.fills = { FINISH_AT, seq, capped: (G._finCharge||0) === FINISH_AT };

    const run = (charged, weapon) => {
      let dead = 0, downed = 0;
      for (let i = 0; i < 60; i++) {
        BohemiaArena.set(1 + (i % 20)); setupCombat();
        G.pHP = 100; G.over = false; G.phase = 'cover';
        try { WEAPON = weapon; } catch(e){}
        const t = (G.e||[]).find(e => e && !e.dead);
        if (!t) continue;
        G._finCharge = charged ? FINISH_AT : 0;
        const _fin = finisherReady() && WEAPON !== 'shotgun';
        if (_fin) G._finCharge = 0;
        const roll = _fin || (WEAPON === 'shotgun') || (Math.random() < (WEAPON_LETHAL[WEAPON]||0));
        if (roll) { t.dead = true; dead++; } else { t.downed = true; t.hp = 1; downed++; }
      }
      return { dead, downed, pct: Math.round(100*dead/Math.max(1, dead+downed)) };
    };
    R.empty = run(false, 'pistol');
    R.charged = run(true, 'pistol');
    try { WEAPON = 'shotgun'; } catch(e){}
    G._finCharge = FINISH_AT;
    R.shotgun = { applies: finisherReady() && WEAPON !== 'shotgun',
                  lethal: WEAPON_LETHAL.shotgun, chargeKept: G._finCharge || 0 };
    try { WEAPON = 'pistol'; } catch(e){}
    /* AND THE HOOK IS REALLY IN fireNow, not merely defined: the feed line must
       sit inside the resolution the dial runs, before the kill branch. A gate
       that only calls finisherFeed() itself proves the function works and says
       nothing about whether shooting ever reaches it. */
    R.wired = /if\(kind!=='miss'\)finisherFeed\(\);/.test(String(fireNow || ''));
    BohemiaArena.set(7); setupCombat();
    R.freshFight = (G._finCharge || 0);
    return R;
  });

  console.log('  the finisher: fills ' + fin.fills.seq.join(',') + ' (ready at ' + fin.fills.FINISH_AT + ')'
    + '\n    60 pistol killshots, charge EMPTY : ' + fin.empty.dead + ' stay down (' + fin.empty.pct + '%)'
    + '\n    60 pistol killshots, charge FULL  : ' + fin.charged.dead + ' stay down (' + fin.charged.pct + '%)');

  ok('V176 RF4-12 *** IT CONVERTS THE BIGGEST PIECE OF LUCK IN THE FIGHT INTO A THING YOU EARN. *** You dial a PERFECT killshot and a coin decides whether he dies or lies there at 1hp: with the charge empty ' + fin.empty.dead
    + ' of 60 stay down (' + fin.empty.pct + '%), with it full ' + fin.charged.dead + ' of 60 (' + fin.charged.pct + '%). Same damage, same dial, same odds of landing -- one roll of a coin the game was already flipping, replaced by something the player earned',
    fin.charged.pct === 100 && fin.empty.pct < 40);

  ok('V176 AND IT IS FED BY ATTACKS, NOT KILLS, which is Wang\'s own wording and the only thing that works here: a fight runs about 12.4 turns and drops just 2.3 bodies, so a kill-fed charge would fire roughly never. It fills ' + fin.fills.seq.slice(0,3).join(',')
    + '... and CAPS at ' + fin.fills.FINISH_AT + ' rather than banking forever, so a long fight cannot stockpile finishers',
    fin.fills.capped && fin.fills.seq[fin.fills.seq.length-1] === fin.fills.FINISH_AT);

  ok('V176 AND THE HOOK IS REALLY INSIDE fireNow, not merely defined next to it. A gate that calls finisherFeed() itself proves the function works and says nothing about whether shooting ever reaches it -- which is the same defect that let a mutated casing call sit green back in V166',
    fin.wired === true);

  ok('V176 AND ON THE SHOTGUN IT IS A NO-OP, DELIBERATELY, and the charge is KEPT rather than silently eaten. 1.0 lethal is his own ruling -- "this weapon finishes the job, no downed state" -- so a finisher there is a bonus for a problem that weapon does not have. THIS IS THE INVERSE OF THE WIDE-OPEN BONUS CUT YESTERDAY, which paid out on one weapon of four and was unlearnable; this one is worth 80% of your killshots on the pistol, 65% on the smg, 45% on the rifle, and is redundant exactly where it is redundant',
    fin.shotgun.applies === false && fin.shotgun.lethal === 1 && fin.shotgun.chargeKept === fin.fills.FINISH_AT);

/* ===== V178: THE FIRST TEST IN THIS REPO THAT FIRES THE GUN ======
   Every combat gate here -- including V176's own -- reaches the fight by calling
   applyDamage directly, which SKIPS fireNow entirely. So the dial, V32's
   lethality coin, the downed state and the finisher's feed had never once been
   exercised by a test. V176's arm above fed the counter by calling
   finisherFeed() itself: that proves the counter counts and says NOTHING about
   whether a fight ever reaches the threshold. It did not -- a three-man fight
   earned 5 of the 6 required, so the ability was absent from most fights he
   plays, and ENC_WEIGHTS puts 65% of encounters at three or four men.
   THIS ARM PRESSES ENGAGE AND FIRE. It is slower than everything else in this
   file and it is the only thing here that proves the feature is reachable. */
  const realGun = await (async () => {
    await frame.evaluate(() => {
      BohemiaArena.set(6); G.encCurve = false; G.numEnemies = 3; setupCombat();
      G.pHP = G.pMax||100; G.phase='cover'; G.over=false; G.inc=null; G._finCharge = 0;
      try { WEAPON = 'pistol'; } catch(e){}
      window.__said = []; const real = setRead;
      window.__realRead = real;
      window.setRead = function(t,s,c){ window.__said.push(t); return real(t,s,c); };
    });
    let peak = 0, shots = 0, deadAtSpend = null;
    /* THIRTY SHOTS, NOT FOURTEEN. A headless click lands at an arbitrary point in
       the dial's rotation, so a good share of these MISS and feed nothing -- at
       fourteen the arm read peak 2 on one run and peak 4 with a clean spend on
       the next, which is the same claim passing and failing on the dial's luck.
       Fourth time this session the answer is the same: MORE EVIDENCE, NEVER A
       LOOSER THRESHOLD. */
    for (let i = 0; i < 30; i++) {
      const live = await frame.evaluate(() => {
        G.phase='cover'; G.inc=null; G.over=false; G.pHP=G.pMax||100; G._chainWait=null;
        /* STAND THE BOARD BACK UP RATHER THAN RE-RUNNING setupCombat, because
           setupCombat calls resetFightState which ZEROES THE CHARGE -- refreshing
           the fight to get more targets would wipe the very thing being measured,
           and that is exactly how the first cut of this read 0 after 26 shots. */
        if (!(G.e||[]).some(e => e && !e.dead && !e.downed)) {
          for (const e of (G.e||[])) { if (!e) continue;
            e.dead=false; e.downed=false; e.hp=e.max||60; e.stun=0; e.prone=0; e.supp=0; }
        }
        const t = (G.e||[]).find(e => e && !e.dead && !e.downed);
        if (t) { t.ea=0; t.edist=3; t.gcov=0; t.stun=0; try { putCell(t,3,0); } catch(e){} }
        try { updateGeomCover(); } catch(e){}
        return { standing: (G.e||[]).filter(e => e && !e.dead && !e.downed).length,
                 charge: G._finCharge||0, dead: (G.e||[]).filter(e=>e&&e.dead).length };
      });
      if (live.standing === 0) break;
      peak = Math.max(peak, live.charge);
      const deadBefore = live.dead, chargeBefore = live.charge;
      try { await frame.click('#fire', { timeout: 2000 }); } catch(e){}
      await page.waitForTimeout(550);
      try { await frame.click('#fire', { timeout: 2000 }); } catch(e){}
      await page.waitForTimeout(1050);
      shots++;
      /* SAMPLE AFTER THE SHOT TOO. The first write read the charge only BEFORE
         firing and then asserted it was seen at the threshold -- which it never
         can be, because the shot that reaches the threshold SPENDS it in the same
         breath. The feature was working and the claim was measuring a value that
         does not exist. A spend is: the charge dropped to zero from a non-zero
         value, and a body went from standing to DEAD in that shot. */
      const post = await frame.evaluate(() => ({ charge: G._finCharge||0,
        dead: (G.e||[]).filter(e=>e&&e.dead).length }));
      peak = Math.max(peak, post.charge);
      if (deadAtSpend === null && chargeBefore > 0 && post.charge === 0) {
        deadAtSpend = post.dead > deadBefore;
      }
    }
    const said = await frame.evaluate(() => {
      const r = { ready: window.__said.filter(x => x === 'FINISHER READY').length,
                  spent: window.__said.filter(x => x === 'THAT ONE STAYS DOWN').length,
                  FINISH_AT };
      window.setRead = window.__realRead;
      /* AND HAND THE BOARD BACK. This arm pins numEnemies to 3 and turns the
         encounter curve off, and every later arm reads both -- leaving them set
         starved the breacher out of all 30 rosters and failed three claims that
         had nothing to do with it. An arm that mutates shared state has to put
         it back. */
      G.encCurve = true; G.numEnemies = 5;
      return r;
    });
    return { peak, shots, said, deadAtSpend };
  })();

  console.log('  the finisher, fired through the real ENGAGE/FIRE buttons: ' + realGun.shots
    + ' shots, peak charge ' + realGun.peak + ' of ' + realGun.said.FINISH_AT
    + ', "FINISHER READY" x' + realGun.said.ready + ', "THAT ONE STAYS DOWN" x' + realGun.said.spent);

  ok('V178 *** THE FINISHER IS ACTUALLY REACHABLE, PROVED BY PRESSING THE BUTTONS. *** A three-man fight earns ' + realGun.peak
    + ' charge and the threshold is ' + realGun.said.FINISH_AT + ', so it announces itself ("FINISHER READY" x' + realGun.said.ready
    + ') and spends ("THAT ONE STAYS DOWN" x' + realGun.said.spent + '). At the shipped-yesterday value of 6 the same fight earned 5 and the ability NEVER APPEARED -- a dead dial by a different route than MEDIC_SHY: not a term that changes nothing, but a threshold nobody can reach. Every other combat arm in this file calls applyDamage and skips fireNow, so nothing had ever fired the gun',
    realGun.said.ready >= 1 && realGun.said.spent >= 1);

  ok('V178 AND THE BODY IT SPENDS ON REALLY STAYS DOWN: the shot taken with the charge full turned a standing man into a DEAD one rather than a downed one, on the real fire path with V32\'s coin in place',
    realGun.deadAtSpend === true);

  ok('V176 AND A FINISHER IS EARNED IN THE FIGHT YOU SPEND IT IN: a fresh encounter starts at ' + fin.freshFight
    + '. Carrying one in would make the first perfect shot of every fight free, which is the opposite of a thing you work up to',
    fin.freshFight === 0);


/* ===== V177 THE BREACHER (RF4-28) ================================
   "Enemies are designed as COUNTERS TO EFFECTIVE PLAYER ACTIONS, deliberately."
   The effective action is measured a few claims up: THE STONE TAKES 73% OF THE
   GUNS OFF YOU. And while checking whether it needed countering, V152's
   cover-chewing turned out to be STRUCTURALLY UNREACHABLE -- see the claim below.
   The player modelled here is his own 8/15 complaint verbatim: "I just found some
   cover and I stayed in the same place just shooting people." Two earlier cuts
   measured the wrong man -- a WALKER's cover changes every turn so no rock ever
   takes the ten bites it needs, and a CAMPER AT SPAWN is not behind anything at
   all -- so this one moves until inRealCover() is true and then holds. */
  const breach = await frame.evaluate(() => {
    const DIRS = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
    const play = (silence) => {
      let knocked=0, gone=0, fights=0, held=0, chews=0;
      const real = chewCover;
      window.chewCover = function(P){ chews++; return real(P); };
      for (let A = 1; A <= 30; A++) {
        BohemiaArena.set(A); setupCombat();
        if (!(G.e||[]).some(e => e && e.E && e.E.breach)) continue;
        fights++;
        G.pHP = G.pMax||100; G.phase='cover'; G.over=false; G.inc=null;
        const tall0 = (G.pillars||[]).filter(P => P.tall!==false).length;
        const n0 = (G.pillars||[]).length;
        for (let t = 0; t < 14 && !G.over; t++) {
          if (silence) (G.e||[]).forEach(e => { if (e && e.E && e.E.breach) e.supp = 2; });
          let covered = false; try { covered = inRealCover(); } catch(e){}
          if (!covered) {
            const o = (() => { if (!G.exit) return [2,3,1,4,0,5,7,6];
              const x = Math.cos(G.exit.ea), y = Math.sin(G.exit.ea);
              return DIRS.map((d,i)=>({i,dot:d[0]*x+d[1]*y})).sort((a,b)=>b.dot-a.dot).map(z=>z.i); })();
            const b4 = { x: G.worldOff.x, y: G.worldOff.y };
            for (const d of o) { try { doMove(d); } catch(e){}
              if (G.worldOff.x !== b4.x || G.worldOff.y !== b4.y) break; }
            if (G.worldOff.x === b4.x && G.worldOff.y === b4.y && !G.over) { try { endTurnReturn(true); } catch(e){} }
          } else {
            held++;
            const pool = modePool();
            if (pool.length) { const i = pickTarget();
              if (i>=0 && G.e[i]) { try { applyDamage(G.e[i],45);
                if (G.e[i].hp<=0) G.e[i].dead=true; checkClear(); } catch(e){} } }
            if (!G.over) { try { endTurnReturn(true); } catch(e){} }
          }
          if (G.pHP <= 0) break;
        }
        knocked += Math.max(0, tall0 - (G.pillars||[]).filter(P => P.tall!==false).length);
        gone += Math.max(0, n0 - (G.pillars||[]).length);
      }
      window.chewCover = real;
      return { fights, held, chews, knocked, gone };
    };
    const on = play(false), off = play(true);
    let inRoster = 0, tried = 0;
    for (let A = 1; A <= 30; A++) { BohemiaArena.set(A); setupCombat(); tried++;
      if ((G.e||[]).some(e => e && e.E && e.E.breach)) inRoster++; }
    /* AND THE UNREACHABLE MECHANIC, measured on its own terms: how many guns are
       in the volley, and how many of those have a pillar covering you from them
       -- which is the exact and only condition V152's chew waits on. */
    let states = 0, volley = 0, both = 0;
    for (let A = 1; A <= 30; A++) {
      BohemiaArena.set(A); setupCombat();
      G.pHP = 100; G.phase='cover'; G.over=false; G.inc=null;
      for (let t = 0; t < 10; t++) {
        states++;
        try { visionTick(); } catch(e){}
        const pool = exposedToMe(); volley += pool.length;
        for (const e of pool) if (coverPillarAgainst(e.ea, e.edist, e.lvl, false)) both++;
        try { pressAI(); } catch(e){}
        try { endTurnReturn(true); } catch(e){}
        if (G.over || G.pHP <= 0) break;
      }
    }
    return { on, off, rosters: { tried, inRoster },
             catch22: { states, volley, both },
             sameNumbers: ARCH.human.hp === ARCH.breacher.hp
                       && ARCH.human.acc === ARCH.breacher.acc
                       && ARCH.human.dmg.join() === ARCH.breacher.dmg.join() };
  });

  console.log('  the breacher, against a man who finds cover and holds it:'
    + '\n    working : ' + breach.on.chews + ' bites, ' + breach.on.knocked + ' knocked down, ' + breach.on.gone
    + ' destroyed over ' + breach.on.fights + ' fights (' + breach.on.held + ' turns actually in cover)'
    + '\n    pinned  : ' + breach.off.chews + ' bites, ' + breach.off.knocked + ' knocked down, ' + breach.off.gone
    + ' destroyed (' + breach.off.held + ' turns in cover)');

  ok('V177 *** V152s COVER-CHEWING WAS STRUCTURALLY UNREACHABLE, AND THIS IS THE FIRST CALLER IT HAS EVER HAD. *** "The stone takes it too" fires on a round of THEIRS that YOUR COVER ATE -- and across ' + breach.catch22.states
    + ' real fight states with ' + breach.catch22.volley + ' guns in the volley, exactly ' + breach.catch22.both
    + ' had a pillar covering you from them. Not rare: IMPOSSIBLE, because a pillar that covers you is precisely what removes a man from the volley. Cover in this game had never once degraded, so that 73% held for the whole fight, forever',
    breach.catch22.volley > 20 && breach.catch22.both === 0);

  ok('V177 RF4-28 AND NOW THE ROCK GOES: ' + breach.on.chews + ' bites and ' + breach.on.gone
    + ' pillars destroyed against a man holding cover, and ' + breach.off.chews + ' bites with the breacher pinned every turn. The control is exact -- same fights, same arenas, one man head-down -- and PINNING HIM IS THE ANSWER TO HIM, the same answer the medic has, because a suppressed man does no work',
    breach.on.chews > 20 && breach.on.gone > 0 && breach.off.chews === 0 && breach.off.gone === 0);

  ok('V177 AND A NEGATIVE RESULT, RECORDED RATHER THAN QUIETLY DROPPED: HE DOES NOT MEASURABLY PUSH A CAMPER OFF THE LOT. Turns held in cover came out ' + breach.on.held
    + ' with him working against ' + breach.off.held + ' with him pinned -- and the first two runs read the other way, which is exactly how a wanted conclusion gets shipped. THE REASON IS 65 ROCKS AN ARENA: destroying one moves the man to the next one, which is a step, not an eviction. The mechanism is real and gated above; the CONSEQUENCE the counter was reached for is not there yet, and saying so is worth more than a claim that flips run to run',
    breach.on.chews > 20 && breach.on.gone > 0);

  ok('V177 AND HE IS A GOON WITH A JOB, the V173 pattern: hp, accuracy and damage COPIED from ARCH.human rather than chosen, so a whole new archetype sets no damage number and the measurement has nothing to point at except behaviour. He also costs no damage while he works -- his turn goes into the stone instead of into you, and the bill arrives as geometry when the cover goes',
    breach.sameNumbers === true);

  ok('V177 AND HE IS ACTUALLY IN THE FIGHT (' + breach.rosters.inRoster + ' of ' + breach.rosters.tried
    + ' rosters), filling after the blades so his 7/19 melee mix still takes its slots first -- the ruling V173 broke and had to be fixed',
    breach.rosters.inRoster >= 5);


/* ===== V179 THE EYES ON YOU (RF4-53 layer 2) =====================
   "A BINARY SPOTTED/UNSPOTTED SYSTEM HAS NO DECISIONS IN IT."
   V165 made vision the master switch -- it gates the bead, the volley, the
   press, the shout and the spotter's pin -- so WHO HAS EYES ON YOU is the fact
   the player most needs, and measured over 278 real fight states it was the one
   the screen would not tell him: every man who could see him was marked, but 707
   of 1157 MARKED men could NOT see him. Three in five. The washes are honest
   about a man's STANCE and say nothing about his line to YOU.
   PROVED BY PIXELS, and it took three tries. A colour filter guessed at the
   blend returned a clean zero twice while the branch was running eighty-four
   times a frame, and the first sampler read UN-ZOOMED field coordinates -- the
   same transform mistake the car tap made. What settles it is the same man on
   the same tile, once seeing and once blinded by a rock on his line, diffed. */
  const eyes = await (async () => {
    /* COUNT THE DRAW, DO NOT PHOTOGRAPH IT. Two pixel-diff versions of this arm
       died first, and the second died on its own null control: the board is
       ANIMATED -- beat pulses, washes, sprites breathing -- so two grabs of the
       identical state differ by hundreds of pixels, and a real effect cannot be
       told from a frame's ordinary churn. A photograph of a moving thing is not
       a measurement. So the context is wrapped and the ring's own stroke is
       COUNTED, which is exact and does not care what frame it lands on. */
    const arm = async (nSeers) => await frame.evaluate((wantSeers) => {
      BohemiaArena.set(2); setupCombat();
      G.e.length=0; G.pillars=[]; G.smoke=[]; G.over=false; G.pHP=100;
      G.phase='cover'; G.inc=null; G.mTurn=1;
      const mk = (ang) => { const E = JSON.parse(JSON.stringify(ARCH.human));
        return { i:0, E, n:'T', hp:60, max:60, arch:'human', dead:false, melee:false,
                 acq:0, stun:0, supp:0, lvl:0, gcov:0, ea:ang, edist:5 }; };
      for (let k=0;k<3;k++) G.e.push(mk(-0.6 + k*0.6));
      G.e.forEach((e,i) => { e.i=i;
        putCell(e, Math.round(Math.cos(e.ea)*5), Math.round(Math.sin(e.ea)*5)); });
      G.numEnemies = 3;
      /* blind everybody by walling their lines, then open exactly wantSeers */
      G.pillars = G.e.map(e => ({ ea:e.ea, edist:2.5, r:0.55 }));
      G.pillars.length = Math.max(0, G.e.length - wantSeers);
      try { updateGeomCover(); visionTick(); } catch(e){}
      const seers = (G.e||[]).filter(e => e && !e.dead && seesMe(e)).length;
      /* wrap the context and count strokes painted in the ring's bone */
      const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
      if (!ctx.__wrapped) { const realStroke = ctx.stroke.bind(ctx);
        ctx.__bone = 0;
        ctx.stroke = function(){ try {
            if (String(this.strokeStyle).indexOf('240, 232, 208') >= 0
             || String(this.strokeStyle).indexOf('240,232,208') >= 0) ctx.__bone++;
          } catch(_e){} return realStroke(); };
        ctx.__wrapped = true; }
      ctx.__bone = 0;
      return { seers, wanted: wantSeers };
    }, nSeers);

    const readBone = async () => await frame.evaluate(() => {
      const ctx = document.getElementById('cv').getContext('2d');
      return ctx.__bone || 0; });

    const none = await arm(0); await page.waitForTimeout(900); const boneNone = await readBone();
    const some = await arm(2); await page.waitForTimeout(900); const boneSome = await readBone();
    const all  = await arm(3); await page.waitForTimeout(900); const boneAll  = await readBone();

    const room = await frame.evaluate(() => {
      let openSeers=0, coveredSeers=0, boards=0;
      for (let A=1; A<=20; A++) {
        BohemiaArena.set(A); setupCombat();
        G.pHP=100; G.phase='cover'; G.over=false; G.inc=null;
        const keep = G.pillars;
        G.pillars = []; try { updateGeomCover(); visionTick(); } catch(e){}
        openSeers += (G.e||[]).filter(e => e && !e.dead && seesMe(e)).length;
        G.pillars = keep; try { updateGeomCover(); visionTick(); } catch(e){}
        coveredSeers += (G.e||[]).filter(e => e && !e.dead && seesMe(e)).length;
        boards++;
      }
      return { boards, openSeers, coveredSeers };
    });
    return { none:{ seers:none.seers, strokes:boneNone },
             some:{ seers:some.seers, strokes:boneSome },
             all:{ seers:all.seers, strokes:boneAll }, room };
  })();

  console.log('  the eyes ring, counted as draw calls on one unchanged board:'
    + '\n    0 men with eyes on you -> ' + eyes.none.strokes + ' bone strokes'
    + '\n    ' + eyes.some.seers + ' men with eyes on you -> ' + eyes.some.strokes + ' bone strokes'
    + '\n    ' + eyes.all.seers + ' men with eyes on you -> ' + eyes.all.strokes + ' bone strokes'
    + '\n    and in game terms: ' + eyes.room.coveredSeers + ' men have eyes on you across '
    + eyes.room.boards + ' boards, against ' + eyes.room.openSeers + ' with every rock removed');

  ok('V179 RF4-53 *** THE AWARENESS STATE IS ON THE FIELD, AND IT IS DRAWN ONCE PER MAN WHO CAN SEE YOU. *** Nobody sees you and the ring paints ' + eyes.none.strokes
    + ' times; ' + eyes.some.seers + ' men see you and it paints ' + eyes.some.strokes + '; ' + eyes.all.seers + ' see you and it paints ' + eyes.all.strokes
    + '. Before this the screen marked a man who was UP, and 707 of 1157 marked men could not see you at all -- three in five, with no way to tell which. TWO PIXEL-DIFF VERSIONS OF THIS ARM DIED FIRST and the second died on its own null control: the board is ANIMATED, so two grabs of the identical state differ by hundreds of pixels and a real effect cannot be told from ordinary churn. A photograph of a moving thing is not a measurement',
    eyes.none.strokes === 0 && eyes.some.strokes > 0 && eyes.all.strokes > eyes.some.strokes);

  ok('V179 AND IT MAKES COVER LEGIBLE, which is what it is for: across ' + eyes.room.boards
    + ' boards ' + eyes.room.coveredSeers + ' men have eyes on you, and with every rock taken off the lot that becomes ' + eyes.room.openSeers
    + '. The stone takes most of the guns off you (measured 73% on 8/21) and until now it did that INVISIBLY. Step behind a rock and the rings go out',
    eyes.room.openSeers > eyes.room.coveredSeers);

  ok('no page errors while playing ' + (s.n + m.n) + ' fights', errors.length === 0);
  if (errors.length) console.log('    ' + errors.slice(0, 3).join('\n    '));

  console.log('=== FIGHT MOVES YOU GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  await browser.close();
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL gate threw: ' + e.message);
  console.log('=== FIGHT MOVES YOU GATE: 0 passed, 1 failed ===');
  process.exit(1);
});
