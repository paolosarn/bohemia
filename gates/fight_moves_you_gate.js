#!/usr/bin/env node
/* ============================================================================
   THE FIGHT HAS TO MOVE YOU (Paolo 8/15/26, LOCKED, demo-critical)

   > "It's still kind of felt like I just found some cover and I stayed in the
   >  same place just shooting people at the same location like nothing changed.
   >  There's no movement. There's no movement whatsoever and I hate it."

   His law names its own test and asks for exactly this gate:

   > "Can the player win this encounter without leaving the first piece of cover
   >  they reach? If yes, it is not fixed. That is machine-checkable in a
   >  headless run -- hold position, fire, and see whether the encounter can be
   >  completed. A gate that plays a fight from one spot and requires it to FAIL
   >  is the honest check."

   So this PLAYS the real fight in a real browser, twice, with ONE policy and one
   difference between the arms: whether the player is allowed to walk.

     ARM A -- never moves.       Clearing ANY fight is a FAILURE.
     ARM B -- allowed to walk.   Clearing almost none is a FAILURE.

   Arm B is not decoration. A fight that cannot be won standing still AND cannot
   be won moving either is not fixed, it is broken, and a gate that only checked
   arm A would pass an unwinnable game. The control for arm B is the world as it
   was BEFORE ammo existed: the same policy with rounds made effectively
   infinite. If ammo has made fights meaningfully less winnable, arm B falls
   behind that control and this goes red.

   WHY IT DRIVES THE SHIPPED FUNCTIONS: dryNow, canReload, doReload, doSwap,
   spendRound, pickTarget, dropRounds and worldShift are the real ones out of the
   real blob. A gate that re-implemented the ammo maths would be marking its own
   homework, which is the failure mode that has cost this project three sessions.
   ========================================================================== */
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const ALPHA = path.join(__dirname, '..', 'slices', 'BOHEMIA_ALPHA_0_9.html');
const FIGHTS = 12;   /* enough to separate 0% from most, small enough that the suite stays runnable */

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
    if (typeof dryNow !== 'function' || typeof dropRounds !== 'function')
      return { missing: true };

    /* ONE policy. The arms differ only in `mayWalk` (and, for the control,
       whether the magazine is refilled behind the player's back). */
    const play = (mayWalk, infinite) => {
      let cleared = 0, stuck = 0, n = 0, tiles = 0;
      for (let a = 1; a <= FIGHTS; a++) {
        BohemiaArena.set(a); setupCombat();
        n++;
        /* STOP ON NO PROGRESS, not on a big step budget. A flat guard of a few
           thousand made a REGRESSED build take longer than a healthy one, which
           is a defect in the gate: the check a regression trips must be the fast
           path, never the slow one. Progress = a man died or rounds were picked
           up; 60 steps of neither means this fight is going nowhere. */
        let guard = 0, idle = 0;
        let seenDead = G.e.filter(e => e && e.dead).length, seenSpare = spareRounds();
        for (;;) {
          if (++guard > 900) break;
          const nowDead = G.e.filter(e => e && e.dead).length, nowSpare = spareRounds();
          if (nowDead > seenDead || nowSpare > seenSpare) { idle = 0; seenDead = nowDead; seenSpare = nowSpare; }
          else if (++idle > 60) break;
          if (!aliveEnemies().length) break;
          if (infinite) { G.ammo = G.ammo || {}; G.ammo[WEAPON] = 99; }
          if (dryNow()) {
            if (canReload()) { doReload(); continue; }
            const alt = altWeapon();
            if (alt && alt !== WEAPON && roundsIn(alt) > 0) { doSwap(); continue; }
            if (!mayWalk) break;                 /* THE TEST: he refuses to leave */
            const d = (G.drops || []).filter(x => (x.lvl | 0) === myLvl())
              .sort((x, y) => x.edist - y.edist)[0];
            if (!d) break;
            worldShift(Math.cos(d.ea), Math.sin(d.ea)); tiles++;
            continue;
          }
          const i = pickTarget();
          if (i < 0) {
            if (!mayWalk) break;
            const e = aliveEnemies().sort((x, y) => x.edist - y.edist)[0];
            if (!e) break;
            worldShift(Math.cos(e.ea), Math.sin(e.ea)); tiles++;
            continue;
          }
          spendRound();
          if (G.e[i]) {
            applyDamage(G.e[i], KILL_DMG);
            if (G.e[i].hp <= 0) { G.e[i].dead = true; dropRounds(G.e[i]); }
          }
        }
        if (!aliveEnemies().length) cleared++; else stuck++;
      }
      return { n, cleared, stuck, tiles };
    };

    /* and the ammo model itself, driven rather than read */
    BohemiaArena.set(1); setupCombat();
    const startRounds = roundsIn(WEAPON);
    const magFull = magSize(WEAPON);
    const before = roundsIn(WEAPON);
    spendRound();
    const afterShot = roundsIn(WEAPON);
    while (roundsIn(WEAPON) > 0) spendRound();
    const dryAfterSpending = dryNow();
    const reloadRefusedWhenEmptyPockets = (spareRounds() === 0) && !canReload();
    /* a man falls, and his rounds are on the ground where he fell, not on you */
    const dropsBefore = (G.drops || []).length;
    const victim = G.e.find(e => e && !e.dead);
    if (victim) dropRounds(victim);
    const dropsAfter = (G.drops || []).length;
    const spareBeforePickup = spareRounds();
    /* and only walking onto it takes it */
    const d0 = G.drops[G.drops.length - 1];
    d0.edist = 6; d0.lvl = myLvl();
    sweepDrops();
    const stillThereAtRange = (G.drops || []).length === dropsAfter && spareRounds() === spareBeforePickup;
    d0.edist = 0.5;
    sweepDrops();
    const takenWhenReached = (G.drops || []).length === dropsAfter - 1 && spareRounds() > spareBeforePickup;

    return {
      still: play(false, false),
      moving: play(true, false),
      control: play(true, true),
      startRounds, magFull, before, afterShot,
      dryAfterSpending, reloadRefusedWhenEmptyPockets,
      dropped: dropsAfter === dropsBefore + 1,
      stillThereAtRange, takenWhenReached,
    };
  }, FIGHTS);

  if (res.missing) {
    console.log('  FAIL the ammo model is not in the shipped blob at all (dryNow/dropRounds missing)');
    console.log('=== FIGHT MOVES YOU GATE: 0 passed, 1 failed ===');
    await browser.close();
    process.exit(1);
  }

  const s = res.still, m = res.moving, c = res.control;

  console.log('  never moves: cleared ' + s.cleared + '/' + s.n
    + '   |  walking: cleared ' + m.cleared + '/' + m.n + ' (' + m.tiles + ' tiles)'
    + '   |  control (infinite rounds): cleared ' + c.cleared + '/' + c.n);

  /* ---- THE RULING ---- */
  ok('HIS TEST: the fight CANNOT be won without leaving the first cover you reach'
    + ' (cleared ' + s.cleared + ' of ' + s.n + ' standing still)',
    s.cleared === 0);

  /* ---- and it is a fight, not a wall ---- */
  ok('AND IT IS STILL WINNABLE ONCE YOU MOVE (cleared ' + m.cleared + ' of ' + m.n + ')',
    m.cleared >= Math.ceil(m.n * 0.6));

  ok('AND MOVING IS NOT MEASURABLY WORSE OFF THAN THE OLD INFINITE-AMMO WORLD --'
    + ' if scarcity had made fights unwinnable rather than unstandable, this arm would fall behind the control'
    + ' (' + m.cleared + ' vs control ' + c.cleared + ')',
    m.cleared >= c.cleared - Math.ceil(c.n * 0.15));

  ok('and the walking arm actually WALKS -- a pass earned by standing still would be a broken test',
    m.tiles > 0);

  /* ---- the model, driven ---- */
  ok('a shot spends exactly one round (' + res.before + ' -> ' + res.afterShot + ')',
    res.afterShot === res.before - 1);

  ok('you start with LESS than a full magazine, because the law sets this number and not taste:'
    + ' a full gun cleared 65% of fights from one spot (' + res.startRounds + ' of ' + res.magFull + ')',
    res.startRounds > 0 && res.startRounds < res.magFull);

  ok('spending the magazine leaves the gun dry, and with empty pockets there is nothing to reload from',
    res.dryAfterSpending && res.reloadRefusedWhenEmptyPockets);

  ok('THE DEAD ARE THE SUPPLY: a man who falls leaves rounds on the board',
    res.dropped);

  ok('AND THEY LIE WHERE HE FELL, so they are only yours once you have walked to them'
    + ' -- which is the whole mechanism, not a detail',
    res.stillThereAtRange && res.takenWhenReached);

  ok('no page errors while playing ' + (s.n + m.n + c.n) + ' fights', errors.length === 0);
  if (errors.length) console.log('    ' + errors.slice(0, 3).join('\n    '));

  console.log('=== FIGHT MOVES YOU GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  await browser.close();
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL gate threw: ' + e.message);
  console.log('=== FIGHT MOVES YOU GATE: 0 passed, 1 failed ===');
  process.exit(1);
});
