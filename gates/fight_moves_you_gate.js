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
      const E = JSON.parse(JSON.stringify(ARCH.bot)); E.ortho = ortho;
      const e = { i:0, E, n:'T', hp:160, max:160, arch:'bot', dead:false, melee:false,
                  acq:9, stun:0, supp:0, lvl:0, gcov:0, ea:0, edist:START };
      putCell(e, -dir[0]*START, -dir[1]*START);   /* he flees AWAY from the machine */
      G.e.push(e); G.numEnemies = 1;
      let moved = 0, diag = 0;
      for (let k = 0; k < STEPS; k++) {
        worldShift(dir[0], dir[1]);
        G.mTurn = (G.mTurn||0) + 1; e._movedTurn = -1;
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
