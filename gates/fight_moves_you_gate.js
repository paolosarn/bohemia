#!/usr/bin/env node
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
  await page.waitForTimeout(9000);
  await page.mouse.click(215, 450); await page.waitForTimeout(2500);
  await page.mouse.click(215, 450); await page.waitForTimeout(2500);
  await page.click('[data-p="combat"]'); await page.waitForTimeout(7000);
  await page.mouse.click(215, 450); await page.waitForTimeout(5000);

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
