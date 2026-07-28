/* ============================================================================
   RUN GATE (7/26/26, RUN lane) — THE FIRST CONNECTED RUN, proven end to end.

   A law without a machine gate is not enforced. The run is a chain of six
   handoffs and any one of them silently breaking means Paolo picks up his phone
   and the game is dead in his hand. So this gate does not inspect strings: it
   OPENS THE REAL PAGE IN A REAL BROWSER AT IPHONE SIZE AND PLAYS THE WHOLE RUN
   BY TAPPING THE ACTUAL BUTTONS, then asserts every link of the chain:

     1. you start INSIDE your own house (a real generated floorplan)
     2. you walk OUT the real front door onto the real block
     3. the quest NPC is really placed and really talkable (loop.talkablesNear)
     4. S01's real dialogue plays, and the mid-quest re-bind moves the fixer to
        the far end of the block (the "follow the skimmed line" walk)
     5. a LOUD resolution really fires the combat handoff over the real
        postMessage bridge, with a real roster, and the run really resumes when
        BOHEMIA_COMBAT_END comes back
     6. the quest reaches COMPLETE, you walk HOME, and the phone shows a feed
        post BUILT BY THE ENGINE with the real CLOUT weight and followers

   It plays the run TWICE: once down the loud fork (combat handoff) and once down
   the quiet fork (no fight, per the pacifist path — a quiet fix must still be a
   complete run). Zero console errors are required on both.

   THE ONE THING THIS GATE STANDS IN FOR: it plays the parent alpha's half of the
   combat bridge (it receives BOHEMIA_RUN_ENCOUNTER and answers with
   BOHEMIA_RUN_COMBAT_END) rather than playing a whole Dead Eye Dial fight
   headless. That is deliberate and it is NOT the run's half being faked: the run
   really posts, really waits, and really resumes. The alpha's half is asserted
   separately in part C below (the tab, the iframe, the relay, the return path).

   Requires playwright (installed globally in this environment).
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
/* PROOF SCREENSHOTS: a canvas capture is never byte-identical twice, so writing
   them into slices/ on every gate run left the working tree permanently dirty
   and would collide across parallel sessions. They go to a scratch dir by
   default; a session REFRESHES the committed ship artifacts on purpose with
   RUN_GATE_PROOF_DIR=slices node gates/run_gate.js. */
const PROOF_DIR = process.env.RUN_GATE_PROOF_DIR
  ? path.resolve(ROOT, process.env.RUN_GATE_PROOF_DIR)
  : require('os').tmpdir();
const RUN_FILE = path.join(ROOT, 'slices/BOHEMIA_RUN_CURRENT.html');
const SRC_FILE = path.join(ROOT, 'slices/BOHEMIA_RUN_SLICE_7_26_26.html');
const ALPHA_FILE = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const WALK_FILE = path.join(ROOT, 'slices/BOHEMIA_SUBURB_WALK_7_18_26.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

function requirePlaywright() {
  const globals = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules'];
  for (const g of globals) { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');   // last resort: throws with a clear message
}

/* ---- BFS over a boolean passability grid; returns a list of [dx,dy] steps. --- */
function route(pass2d, from, to, doorStops) {
  const H = pass2d.length, W = pass2d[0].length;
  const key = (x, y) => x + ',' + y;
  const prev = {}, seen = { [key(from[0], from[1])]: true };
  let q = [from];
  while (q.length) {
    const cur = q.shift();
    if (cur[0] === to[0] && cur[1] === to[1]) break;
    for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cur[0] + d[0], ny = cur[1] + d[1], k = key(nx, ny);
      if (nx < 0 || ny < 0 || nx >= W || ny >= H || seen[k] || !pass2d[ny][nx]) continue;
      seen[k] = true; prev[k] = cur;
      // a front door is an endpoint you step ONTO, never a corridor you pass through
      if (doorStops && doorStops[k] != null && !(nx === to[0] && ny === to[1])) continue;
      q.push([nx, ny]);
    }
  }
  if (!seen[key(to[0], to[1])]) return null;
  const steps = [];
  let cur = to;
  while (!(cur[0] === from[0] && cur[1] === from[1])) {
    const p = prev[key(cur[0], cur[1])];
    if (!p) return null;
    steps.unshift([cur[0] - p[0], cur[1] - p[1]]);
    cur = p;
  }
  return steps;
}

async function tapStep(page, d) {
  const id = d[0] === 1 ? '#br' : d[0] === -1 ? '#bl' : d[1] === 1 ? '#bd' : '#bu';
  await page.click(id);
}
/* A DOOR IS NOT A FLOOR TILE (Paolo's door law, 7/26): bumping a shut door swings
   it — 9 frames over 2 beats — and you only pass once the leaf really is open.
   So the walkers push against a door until it lets them through, exactly the way
   a thumb does, instead of assuming one tap equals one step. */
async function tapThroughDoor(page, d, wasInside) {
  for (let i = 0; i < 14; i++) {
    await tapStep(page, d);
    const st = await page.evaluate(() => window.__RUN.state());
    if ((st.mode === 'int') !== wasInside) return true;      // we went through
    await page.waitForTimeout(120);
  }
  return false;
}
async function walkTo(page, target, opts) {
  opts = opts || {};
  const g = await page.evaluate(() => window.__RUN.grid());
  const st = await page.evaluate(() => window.__RUN.state());
  const steps = route(g.pass, [st.px, st.py], target, opts.throughDoors ? null : g.doorOf);
  if (!steps) throw new Error('no route from ' + st.px + ',' + st.py + ' to ' + target);
  // the last step lands ON the target; if that target is a front door, it is a
  // door bump, not a step, and has to be pushed open first.
  const isDoor = g.doorOf[target[0] + ',' + target[1]] != null;
  for (let i = 0; i < steps.length; i++) {
    const last = i === steps.length - 1;
    if (last && isDoor) { if (!await tapThroughDoor(page, steps[i], false)) throw new Error('the door never opened'); }
    else await tapStep(page, steps[i]);
  }
  return steps.length;
}
/* A VERIFIED interior walk: re-plan from the LIVE position after every tap and
   never route through the exit door. A blind tap sequence desyncs the moment one
   step is refused, and a desynced sequence walked the player out of their own
   front door before the run had started. */
async function walkInterior(page, target) {
  for (let guard = 0; guard < 80; guard++) {
    const inr = await page.evaluate(() => window.__RUN.interior());
    const st = await page.evaluate(() => window.__RUN.state());
    if (!inr || st.mode !== 'int') throw new Error('walkInterior: left the interior at guard=' + guard + ' pos ' + st.px + ',' + st.py + ' phase ' + st.phase);
    if (st.px === target[0] && st.py === target[1]) return true;
    const stop = {}; stop[inr.door[0] + ',' + inr.door[1]] = 1;
    const steps = route(inr.pass, [st.px, st.py], target, stop);
    if (!steps || !steps.length) return false;
    await tapStep(page, steps[0]);
    const after = await page.evaluate(() => window.__RUN.state());
    if (after.px === st.px && after.py === st.py) return false;   // refused: stop, do not flail
  }
  return false;
}
async function walkOutOfHouse(page) {
  const inr = await page.evaluate(() => window.__RUN.interior());
  const st = await page.evaluate(() => window.__RUN.state());
  if (!inr) throw new Error('walkOutOfHouse: not inside anything (mode ' + st.mode + ')');
  const steps = route(inr.pass, [st.px, st.py], inr.door, null);
  if (!steps) throw new Error('no route to the interior door from ' + st.px + ',' + st.py +
    ' (mode ' + st.mode + ', house ' + st.curHouse + ', door ' + inr.door + ', passHere ' +
    (inr.pass[st.py] && inr.pass[st.py][st.px]) + ')');
  for (let i = 0; i < steps.length; i++) {
    const last = i === steps.length - 1;
    if (last) { if (!await tapThroughDoor(page, steps[i], true)) throw new Error('the front door never opened'); }
    else await tapStep(page, steps[i]);
  }
}

/* --------------------------------------------------------------------------
   ONE FULL RUN. `fork` picks which of S01's real resolutions we play:
     'loud'  -> cut the tap in front of everyone (#reckless) -> combat handoff
     'quiet' -> put the current back, nobody hears it (#quiet) -> no fight
   Returns a report object; every assertion lives in the caller.
   ------------------------------------------------------------------------ */
async function playRun(browser, fork) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));

  // the parent alpha's half of the combat bridge, played by the gate.
  await page.addInitScript(() => {
    window.__GATE_ENCOUNTERS = [];
    window.addEventListener('message', ev => {
      const d = ev && ev.data;
      if (!d || d.type !== 'BOHEMIA_RUN_ENCOUNTER') return;
      window.__GATE_ENCOUNTERS.push(d);
      window.postMessage({ type: 'BOHEMIA_RUN_ENCOUNTER_ACK' }, '*');
      // the fight happens; the real combat frame's own end message shape:
      setTimeout(() => window.postMessage({ type: 'BOHEMIA_RUN_COMBAT_END', victory: true,
        result: 'win', kills: 2, dead: 2, spared: 1, fled: 0, playerHP: 61 }, '*'), 60);
    });
  });

  await page.goto('file://' + RUN_FILE);
  await page.waitForFunction(() => window.__RUN_READY === true, null, { timeout: 60000 });

  const start = await page.evaluate(() => window.__RUN.state());
  const rep = { errors, start, fork };

  // ---- 1/2: out of your own house, onto the block
  await walkOutOfHouse(page);
  rep.afterExit = await page.evaluate(() => window.__RUN.state());

  // ---- 3: walk to the lineman and talk
  const lineman = rep.start.lineman;
  const near = [lineman[0], lineman[1] + 1];
  const g = await page.evaluate(() => window.__RUN.grid());
  const stand = g.pass[near[1]] && g.pass[near[1]][near[0]] ? near : [lineman[0], lineman[1] - 1];
  await walkTo(page, stand);
  rep.talkableAtLineman = await page.evaluate(() => window.__RUN.talkables().length);
  /* 7/27: the one action button became the NAV CLUSTER's centre portrait, so its
     verb moved out of the button's text into #actlbl beside it (the run's verbs
     are whole sentences and an 80px circle ate them). Read the label the player
     actually sees, wherever it lives. */
  rep.actLabelAtLineman = await page.textContent('#actlbl').catch(() => null)
    || await page.textContent('#act').catch(() => null);
  await page.click('#act');
  rep.talkOpened = await page.isVisible('#talk');

  // "I will walk it back." -> the lineman sends you after the split (stage 20),
  // then he has nothing left to say and you walk away from the conversation.
  await page.click('#opts button:nth-child(1)');
  await page.click('#talkcont');
  rep.talkClosed = !(await page.isVisible('#talk'));
  rep.afterAsk = await page.evaluate(() => window.__RUN.state());

  // ---- 4: the re-bind — the fixer is now at the far end of the block
  rep.npcAfterAsk = rep.afterAsk.npc;
  const fixer = rep.start.fixer;
  const nf = [fixer[0], fixer[1] + 1];
  const g2 = await page.evaluate(() => window.__RUN.grid());
  const standF = g2.pass[nf[1]] && g2.pass[nf[1]][nf[0]] ? nf : [fixer[0], fixer[1] - 1];
  rep.walkLength = await walkTo(page, standF);
  rep.talkableAtFixer = await page.evaluate(() => window.__RUN.talkables().length);
  await page.click('#act');

  // the fixer's fork. Option order in S01: 1 put back (#quiet), 2 report,
  // 3 whose current (trap), 4 cut the tap (#reckless).
  if (fork === 'loud') {
    await page.click('#opts button:nth-child(4)');   // (cut the tap, right now)
    await page.click('#opts button:nth-child(1)');   // "Let them know my face."
  } else {
    await page.click('#opts button:nth-child(1)');   // "Put it back. Nobody hears it."
    await page.click('#opts button:nth-child(1)');   // "Just fixed a line."
  }
  await page.waitForTimeout(400);
  rep.afterResolve = await page.evaluate(() => window.__RUN.state());
  rep.encounters = await page.evaluate(() => window.__GATE_ENCOUNTERS);

  // ---- 6: walk home and step through your own door
  await walkTo(page, rep.start.homeDoor, { throughDoors: false });
  rep.afterHome = await page.evaluate(() => window.__RUN.state());
  rep.phoneVisible = await page.isVisible('#phone');
  rep.feed = await page.evaluate(() => window.__RUN.feed());
  rep.profile = await page.evaluate(() => window.__RUN.profile());
  rep.feedHTML = await page.textContent('#feed');
  rep.shot = path.join(PROOF_DIR, 'BOHEMIA_RUN_PROOF_' + fork + '_7_26_26.png');
  await page.screenshot({ path: rep.shot });

  /* ------------------------------------------------------------------------
     THE BUILDING STACK (Paolo 7/27, three defects in one sentence: "u tried to
     make garages like sideways u's and its very bad man also every wall that
     hosts a door should be at the least three wall tiles tall and we gotta fix
     what it looks like when im underneath a wall with an opcacity filter").
     Each of the three is a rule now, so each of the three gets a machine check
     against what the renderer would ACTUALLY lay on the real block.
     ---------------------------------------------------------------------- */
  rep.look = await page.evaluate(() => window.__RUN.look());
  /* the ghosting regression: standing in the yard with the house wall directly
     north of you must leave you OPAQUE - you are in front of that wall */
  rep.occInYard = await page.evaluate(() => {
    const d = window.homeDoor[window.__RUN.state().home];
    window.mode = 'ext'; window.curHouse = -1; window.fp = null;
    window.px = d[0]; window.py = d[1] + 1; window.draw();
    return window.__RUN.occluders();
  });
  rep.occInDoorway = await page.evaluate(() => {
    const d = window.homeDoor[window.__RUN.state().home];
    window.px = d[0]; window.py = d[1]; window.draw();
    return window.__RUN.occluders();
  });
  await page.close();
  return rep;
}

/* --------------------------------------------------------------------------
   SAVE / LOAD — built to two rulings Paolo made on 7/26 and checked against
   their own words:
     SAVES AND CLOUD: both kinds (sleep + free manual + autosave), ONE
       versioned device-agnostic blob, NO device preferences inside it, loaders
       migrate old versions forward and never reject them, and an export/import
       code that travels between devices with no server.
     DEATH IS A RELOAD: losing loads the CLOSEST PREVIOUS SAVE. Never a reset.
   Round-trip is proven the only way that means anything: save, actually change
   the world, load, and diff.
   ------------------------------------------------------------------------ */
async function saveRun(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  // the gate plays the parent's half of the combat bridge, and LOSES the fight.
  await page.addInitScript(() => {
    window.addEventListener('message', ev => {
      const d = ev && ev.data;
      if (!d || d.type !== 'BOHEMIA_RUN_ENCOUNTER') return;
      window.postMessage({ type: 'BOHEMIA_RUN_ENCOUNTER_ACK' }, '*');
      setTimeout(() => window.postMessage({ type: 'BOHEMIA_RUN_COMBAT_END', victory: false,
        result: 'loss', kills: 0, dead: 0, spared: 0, fled: 0, playerHP: 0 }, '*'), 60);
    });
  });
  await page.goto('file://' + RUN_FILE);
  await page.waitForFunction(() => window.__RUN_READY === true, null, { timeout: 60000 });
  await page.evaluate(() => window.__RUN.wipeSaves());

  const out = { errors };
  // a save must exist from the first second, or "death is a reload" has nowhere to land
  await page.reload();
  await page.waitForFunction(() => window.__RUN_READY === true, null, { timeout: 60000 });
  out.bootSaves = await page.evaluate(() => window.__RUN.saves());

  // ---- ROUND TRIP: save, really change the world, load, diff
  await walkOutOfHouse(page);
  const g = await page.evaluate(() => window.__RUN.grid());
  const st0 = await page.evaluate(() => window.__RUN.state());
  const L = st0.lineman;
  await walkTo(page, g.pass[L[1] + 1] && g.pass[L[1] + 1][L[0]] ? [L[0], L[1] + 1] : [L[0], L[1] - 1]);
  await page.click('#act');
  await page.click('#opts button:nth-child(1)');   // "I will walk it back." -> stage 20
  await page.click('#talkcont');
  await page.evaluate(() => window.__RUN.saveNow('manual'));
  out.saved = await page.evaluate(() => window.__RUN.state());
  await tapStep(page, [-1, 0]); await tapStep(page, [-1, 0]); await tapStep(page, [-1, 0]);
  out.drifted = await page.evaluate(() => window.__RUN.state());
  out.loadOk = await page.evaluate(() => window.__RUN.loadLast());
  out.restored = await page.evaluate(() => window.__RUN.state());
  out.slots = await page.evaluate(() => window.__RUN.saves());

  // ---- EXPORT / IMPORT on a FRESH page: the no-server cross-device path
  const code = await page.evaluate(() => window.__RUN.exportCode());
  out.codeBytes = code.length;
  const fresh = await browser.newPage({ viewport: { width: 390, height: 844 } });
  fresh.on('pageerror', e => errors.push('PAGEERROR(import): ' + e.message));
  await fresh.goto('file://' + RUN_FILE);
  await fresh.waitForFunction(() => window.__RUN_READY === true, null, { timeout: 60000 });
  await fresh.evaluate(() => window.__RUN.wipeSaves());
  out.importOk = await fresh.evaluate(c => window.__RUN.importCode(c), code);
  out.imported = await fresh.evaluate(() => window.__RUN.state());
  // an OLDER envelope must migrate forward, never be rejected
  const old = JSON.parse(code); old.env = 0;
  out.oldImportOk = await fresh.evaluate(c => window.__RUN.importCode(c), JSON.stringify(old));
  // junk must not be silently "loaded"
  out.junkRejected = !(await fresh.evaluate(() => window.__RUN.importCode('{"nope":1}')));
  await fresh.close();

  // ---- DEATH IS A RELOAD: lose the fight, land on the closest save
  const F = out.saved.fixer;
  const g2 = await page.evaluate(() => window.__RUN.grid());
  await walkTo(page, g2.pass[F[1] + 1] && g2.pass[F[1] + 1][F[0]] ? [F[0], F[1] + 1] : [F[0], F[1] - 1]);
  await page.evaluate(() => window.__RUN.saveNow('manual'));
  const beforeFight = await page.evaluate(() => window.__RUN.state());
  await page.click('#act');
  await page.click('#opts button:nth-child(4)');   // cut the tap -> it goes loud
  await page.click('#opts button:nth-child(1)');
  await page.waitForTimeout(900);
  out.afterDeath = await page.evaluate(() => window.__RUN.state());
  out.deathLandedOnSave = out.afterDeath.px === beforeFight.px && out.afterDeath.py === beforeFight.py;
  await page.close();
  return out;
}

/* --------------------------------------------------------------------------
   THE SAME RUN, PLAYED INSIDE THE REAL ALPHA. No stand-in for anything: the run
   frame posts to the real alpha, the alpha brings up the real combat frame, and
   the combat frame's OWN window sends the real BOHEMIA_COMBAT_END the dial sends
   when a fight is over. This is the surface Paolo taps.
   ------------------------------------------------------------------------ */
async function alphaRun() {
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const out = { errors: [], ready: false, combatPanelOn: false, combatFrame: false,
                backOnRun: false, combatBack: null };
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on('pageerror', e => out.errors.push('PAGEERROR: ' + e.message));
    /* CLEAN SLATE. Every section of this gate shares one browser, and file://
       shares one localStorage, so the save suite's blobs were still on disk when
       the alpha booted. Each section must start from nothing or it is testing
       the section before it. */
    await page.addInitScript(() => { try { localStorage.clear(); } catch (_e) {} });
    await page.goto('file://' + ALPHA_FILE, { timeout: 120000 });
    await page.click('#front');
    await page.click('.tab[data-p=run]');
    /* THE RUN TAB OPENS THE CITY NOW (Paolo 7/28: "Kill"). The run slice is dead as
       a TAB - no tap reaches it, and that is the ruling. But it is still WIRED into
       the shell: the baked-body cast, the saves and the combat handoff all still
       run through it, and this section is the fleet's only end-to-end proof that
       the character, the valley, the districts and the loop work together. Killing
       the tab is not a licence to quietly delete thirty integration assertions.
       So the harness shows the panel directly. Every click below is a REAL click on
       a REAL rendered panel - the only synthetic step is opening a surface the UI no
       longer exposes, and that is stated here rather than hidden. If the day comes
       that the shell stops wiring runFrame at all, this section should be deleted
       outright, not propped up. */
    await page.evaluate(() => {
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'));
      document.getElementById('p-run').classList.add('on');
    });
    /* ATTACHED, NOT VISIBLE (Paolo 7/28: "Can you put the city in the run tab?").
       The RUN tab now routes to the city panel, so the run slice's iframe is
       loaded and live but no longer on screen. Every assertion below still runs
       against the real run inside the real alpha - the only thing that changed is
       that this gate no longer requires the panel to be the one showing. The
       ruling moved the contract; the gate follows the ruling, it was not loosened
       to let anything through. */
    const handle = await page.waitForSelector('#runFrame');
    const run = await handle.contentFrame();
    /* POLL ON A TIMER, NOT ON ANIMATION FRAMES (7/28). Playwright's
       waitForFunction evaluates once immediately and then polls on rAF - and a
       display:none iframe gets NO rAF ticks. Since the RUN tab started routing to
       the city (Paolo's ruling), the run slice is live but hidden, so any
       predicate that is not already true on the first evaluation could never be
       re-checked and timed out at 180s against a condition that was in fact true.
       Proven by reading the same value with evaluate(): cast came back dirs 8,
       looks 6, immediately. The assertion is unchanged; only the polling mode is,
       because the old one cannot see a hidden frame. */
    await run.waitForFunction(() => window.__RUN_READY === true, null, { polling: 100, timeout: 120000 });
    out.ready = true;

    /* THE REAL CAST (Paolo's ruling 7/26): the run must be wearing the actual
       character, not a coloured dot. Wait for the parent's bake to land and
       assert it is a real multi-direction body set with real portraits. */
    await run.waitForFunction(() => { const c = window.__RUN.cast(); return !!c && c.dirs >= 8; },
      null, { polling: 100, timeout: 180000 });
    out.cast = await run.evaluate(() => window.__RUN.cast());
    out.doors = await run.evaluate(() => window.__RUN.doors());

    /* THE SENTENCE (Paolo, after the lab): walk somewhere, ONE contextual button
       that changes by what you are standing at, act, spend time, the world
       resolves. Every clause of it, on the real surface. */
    /* THE VALLEY IS REAL. The block is a CELL of the generated world, and the
       edge is a way into the next district instead of a wall. */
    out.cell = await run.evaluate(() => window.__RUN.cell());
    out.neighbours = await run.evaluate(() => window.__RUN.neighbours());
    out.moments = await run.evaluate(() => window.__RUN.moments());
    out.reach = await run.evaluate(() => window.__RUN.reach());
    out.verbHome = await run.evaluate(() => window.__RUN.verb());
    await run.click('#act');                       // the verb at home is SLEEP
    await run.waitForTimeout(500);
    out.sleepResolve = await run.evaluate(() => window.__RUN.lastResolve());
    out.savesAfterSleep = await run.evaluate(() => window.__RUN.saves());
    /* the SAME button becomes the doorway when you stand in it */
    {
      const inr = await run.evaluate(() => window.__RUN.interior());
      const st = await run.evaluate(() => window.__RUN.state());
      /* route to the tile IN FRONT of the door, and never THROUGH the door:
         passInt counts a door as walkable, so an unguarded path strolls out of
         the house and the run starts in the street. */
      out.reachedDoorway = await walkInterior(run, [inr.door[0], inr.door[1] - 1]);
      out.verbDoor = await run.evaluate(() => window.__RUN.verb());
    }
    /* HOW WALKING FEELS — all three of the pattern note's options, felt.
       The step is picked to be REVERSIBLE and to avoid the doorway: an early
       cut nudged the player onto the exit door, bumped it open across three
       modes, and left the run standing in the street before the run had begun. */
    out.walkModes = await run.evaluate(() => window.__RUN.walkModes());
    out.feel = {};
    {
      const inr = await run.evaluate(() => window.__RUN.interior());
      const st = await run.evaluate(() => window.__RUN.state());
      const safe = [[0, -1], [0, 1], [-1, 0], [1, 0]].find(d => {
        const nx = st.px + d[0], ny = st.py + d[1];
        if (nx === inr.door[0] && ny === inr.door[1]) return false;
        return inr.pass[ny] && inr.pass[ny][nx];
      });
      if (!safe) throw new Error('nowhere safe to feel a step from ' + st.px + ',' + st.py);
      for (const m of ['GRID', 'SLIDE', 'FREE']) {
        await run.evaluate(mm => window.__RUN.setWalkMode(mm), m);
        await tapStep(run, safe);
        await run.waitForTimeout(m === 'SLIDE' ? 120 : 60);
        const o = await run.evaluate(() => window.__RUN.drawOffset());
        out.feel[m] = Math.abs(o.x) + Math.abs(o.y);
        await tapStep(run, [-safe[0], -safe[1]]);   // step back, exactly
        await run.waitForTimeout(60);
      }
      await run.evaluate(() => window.__RUN.setWalkMode('GRID'));
    }
    out.feelEndedAt = await run.evaluate(() => window.__RUN.state());


    /* THE DOOR LAW, behaviourally (Paolo 7/26): a shut door is not a floor tile.
       Walk into it and you do NOT move; it swings (9 frames, 2 beats) and only
       then does it let you through. Prove both halves on the real surface. */
    {
      const inr = await run.evaluate(() => window.__RUN.interior());
      await walkInterior(run, [inr.door[0], inr.door[1] - 1]);
      const before = await run.evaluate(() => window.__RUN.state());
      await tapStep(run, [0, 1]);                                  // bump the shut door
      const after = await run.evaluate(() => window.__RUN.state());
      out.doorBlocked = (after.mode === 'int' && before.mode === 'int' &&
                         after.px === before.px && after.py === before.py);
      await run.waitForTimeout(300);
      const mid = await run.evaluate(() => window.__RUN.doors());
      out.doorMidFrame = Math.max(0, ...Object.keys(mid.state).map(k => mid.state[k].f));
      await run.waitForTimeout(900);
      const done = await run.evaluate(() => window.__RUN.doors());
      out.doorEndFrame = Math.max(0, ...Object.keys(done.state).map(k => done.state[k].f));
    }

    /* MUSIC: the run asks, the parent's real synth answers. The first committed
       step already kicked it on (that tap is the gesture a browser needs), so
       prove the whole round trip: on after walking, off on tap, on again. */
    out.musicAfterWalk = await run.evaluate(() => window.__RUN.music());
    await run.click('#mus'); await run.waitForTimeout(400);
    out.musicOff = await run.evaluate(() => window.__RUN.music());
    await run.click('#mus'); await run.waitForTimeout(400);
    out.musicOn = await run.evaluate(() => window.__RUN.music());

    /* OFF MEANS SILENT (Paolo 7/27: "i press the music button off and the music
       still plays"). A round trip of the FLAG proved nothing: MUS.stop() only
       cleared the scheduler, so every note already booked into the master kept
       sounding after the button said OFF. What has to be true is that the audio
       graph goes quiet, so the gate drives the real synth and reads the real
       master gain - the only place the sound can actually be. */
    out.audio = await page.evaluate(async () => {
      /* MUS is a top-level `const`, so it is in global LEXICAL scope and is NOT
         a property of window - reading window.MUS reports null forever and the
         check silently passes on nothing. Reference it bare. */
      const g = () => MUS.MAST ? +MUS.MAST.gain.value.toFixed(4) : null;
      try { MUS.build(); } catch (_e) {}
      MUS.start(); await new Promise(r => setTimeout(r, 250));
      const playing = { on: MUS.playing, gain: g(), ac: MUS.AC ? MUS.AC.state : null };
      CITYMUS.stopShuffle(); await new Promise(r => setTimeout(r, 200));
      const stopped = { on: MUS.playing, timer: !!MUS.timer, gain: g() };
      MUS.start(); await new Promise(r => setTimeout(r, 200));
      const again = { on: MUS.playing, gain: g() };
      CITYMUS.stopShuffle();
      return { playing, stopped, again };
    });

    await walkOutOfHouse(run);
    const st0 = await run.evaluate(() => window.__RUN.state());
    const g = await run.evaluate(() => window.__RUN.grid());
    const L = st0.lineman;
    await walkTo(run, g.pass[L[1] + 1] && g.pass[L[1] + 1][L[0]] ? [L[0], L[1] + 1] : [L[0], L[1] - 1]);
    await run.click('#act');
    await run.click('#opts button:nth-child(1)');
    await run.click('#talkcont');
    const F = st0.fixer;
    await walkTo(run, g.pass[F[1] + 1] && g.pass[F[1] + 1][F[0]] ? [F[0], F[1] + 1] : [F[0], F[1] - 1]);
    await run.click('#act');
    await run.click('#opts button:nth-child(4)');   // (cut the tap, right now)
    await run.click('#opts button:nth-child(1)');   // "Let them know my face."

    // the alpha should now have brought the real dial up
    await page.waitForSelector('#combatFrame', { timeout: 30000 });
    out.combatFrame = true;
    await page.waitForFunction(() => {
      const p = document.getElementById('p-combat');
      return !!(p && p.classList.contains('on'));
    }, null, { timeout: 30000 });
    out.combatPanelOn = true;
    await page.waitForFunction(() => window.__RUN_HANDOFF && window.__RUN_HANDOFF.started === true,
      null, { timeout: 30000 });
    out.handoff = await page.evaluate(() => window.__RUN_HANDOFF);

    // the fight ends. This is the combat frame's own window sending the exact
    // message the dial sends (sendCombatEnd) — the real return leg of the bridge.
    const cf = await (await page.waitForSelector('#combatFrame')).contentFrame();
    await cf.evaluate(() => parent.postMessage({ type: 'BOHEMIA_COMBAT_END', victory: true,
      result: 'win', kills: 2, dead: 2, spared: 1, fled: 0, playerHP: 61 }, '*'));

    await page.waitForFunction(() => {
      const p = document.getElementById('p-run');
      return !!(p && p.classList.contains('on'));
    }, null, { timeout: 30000 });
    out.backOnRun = true;
    await run.waitForFunction(() => { const s = window.__RUN.state(); return !!s.combat; },
      null, { polling: 100, timeout: 30000 });
    out.combatBack = (await run.evaluate(() => window.__RUN.state())).combat;
    await page.screenshot({ path: path.join(PROOF_DIR, 'BOHEMIA_RUN_IN_ALPHA_7_26_26.png') });

    /* LAST, so it can never disturb the run: walk to the far edge of the home
       cell and push off it. The valley has to actually be on the other side. */
    {
      const g = await run.evaluate(() => window.__RUN.grid());
      const st = await run.evaluate(() => window.__RUN.state());
      if (st.mode === 'ext') {
        const seen = { [st.px + ',' + st.py]: 1 }; const q = [[st.px, st.py]]; let best = [st.px, st.py];
        while (q.length) {
          const c = q.shift();
          if (c[0] > best[0]) best = c;
          for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nx = c[0] + d[0], ny = c[1] + d[1], k = nx + ',' + ny;
            if (nx < 0 || ny < 0 || nx >= g.W || ny >= g.H || seen[k] || !g.pass[ny][nx] || g.doorOf[k] != null) continue;
            seen[k] = 1; q.push([nx, ny]);
          }
        }
        const steps = route(g.pass, [st.px, st.py], best, g.doorOf);
        if (steps) for (const d of steps) await tapStep(run, d);
        for (let i = 0; i < 8; i++) await tapStep(run, [1, 0]);
        out.crossed = await run.evaluate(() => window.__RUN.cell());
      }
    }
  } finally { await browser.close(); }
  return out;
}

(async () => {
  // ---- A. the generated run page is CURRENT and self-contained -------------
  ok('slices/BOHEMIA_RUN_CURRENT.html exists', fs.existsSync(RUN_FILE));
  const before = fs.readFileSync(RUN_FILE, 'utf8');
  require('child_process').execFileSync('node', ['tools/build_run_slice.js'], { cwd: ROOT });
  const after = fs.readFileSync(RUN_FILE, 'utf8');
  ok('regenerating via tools/build_run_slice.js changes nothing (the committed run is current)', before === after);
  if (before !== after) fs.writeFileSync(RUN_FILE, before);

  ok('no external engine refs (the run works standalone on Pages)', !/\.\.\/engine\//.test(after));
  for (const mod of ['engine/bohemia_loop.js', 'engine/bohemia_quest_runtime.js',
                     'engine/bohemia_bq.js', 'engine/bohemia_suburb.js',
                     'engine/bohemia_floorplan.js', 'engine/bohemia_agents.js']) {
    ok('embedded ' + mod + ' is the canon body (freshness)',
      after.indexOf(fs.readFileSync(path.join(ROOT, mod), 'utf8')) >= 0);
  }
  const s01 = fs.readFileSync(path.join(ROOT, 'quests/bq/S01_THE_METER_READER.bq'), 'utf8');
  ok('S01 rides as the REAL canon bytes (same file the canon-quests gate proves)',
    after.indexOf(JSON.stringify(s01).slice(1, -1)) >= 0);

  // REUSE-FIRST: the look is the APPROVED walk surface's own banks, not a re-cook
  const walk = fs.readFileSync(WALK_FILE, 'utf8');
  const a = walk.indexOf('var DOOR_B64=['), b = walk.indexOf('function lampAt(', a);
  const banks = walk.slice(a, walk.indexOf('\n', b));
  ok('REUSE-FIRST: the run wears the APPROVED block\'s art banks verbatim', after.indexOf(banks) >= 0);

  // ---- B. THE RUN ITSELF, played in a real browser -------------------------
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  let loud = null, quiet = null, sv = null;
  try {
    loud = await playRun(browser, 'loud');
    quiet = await playRun(browser, 'quiet');
    sv = await saveRun(browser);
  } finally { await browser.close(); }

  for (const rep of [loud, quiet]) {
    const T = rep.fork.toUpperCase() + ': ';
    ok(T + 'zero console/page errors across the whole run', rep.errors.length === 0);
    if (rep.errors.length) console.log('    ' + rep.errors.slice(0, 4).join('\n    '));

    ok(T + 'the run starts INSIDE your own house', rep.start.mode === 'int' && rep.start.curHouse === rep.start.home);
    ok(T + 'walking out the front door puts you on the block', rep.afterExit.mode === 'ext');
    ok(T + 'the quest NPC is placed on the block', Array.isArray(rep.start.lineman) && rep.start.npc != null);
    ok(T + 'standing next to him makes him talkable (loop.talkablesNear)', rep.talkableAtLineman > 0);
    ok(T + 'the action button offers the talk', /TALK TO THE/.test(rep.actLabelAtLineman || ''));
    ok(T + 'the real dialogue opened', rep.talkOpened === true);
    ok(T + 'the ask moved the quest to stage 20 (follow the skimmed line)', rep.afterAsk.stage >= 20);
    ok(T + 'the quest re-bound to the fixer at the far end of the block',
      rep.npcAfterAsk && rep.start.fixer && rep.npcAfterAsk[0] === rep.start.fixer[0] && rep.npcAfterAsk[1] === rep.start.fixer[1]);
    ok(T + 'the middle of the run is a real walk, not a menu (>= 20 steps)', rep.walkLength >= 20);
    ok(T + 'the fixer is talkable where the quest placed him', rep.talkableAtFixer > 0);
    ok(T + 'the quest reaches COMPLETE', rep.afterResolve.questDone === true && rep.afterResolve.outcome === 'COMPLETE');
    ok(T + 'the run ends back inside your own house', rep.afterHome.mode === 'int' && rep.afterHome.curHouse === rep.afterHome.home);
    ok(T + 'the phone comes up with the post', rep.phoneVisible === true);
    ok(T + 'the feed holds exactly one post for the completed quest',
      rep.feed.length === 1 && rep.feed[0].questId === 'bq_meter_reader' && rep.feed[0].outcome === 'COMPLETE');
    ok(T + 'the post carries a real CLOUT tag', !!rep.feed[0] && !!rep.feed[0].clout);
    ok(T + 'followers are the engine\'s clout math, not a number typed in the page',
      rep.profile.reach > 0 && rep.profile.questsCompleted === 1 && rep.profile.posts === 1);
    ok(T + 'the phone shows the followers it earned', /followers/.test(rep.feedHTML || ''));
    ok(T + 'a proof screenshot of the real surface was written', fs.existsSync(rep.shot));
  }

  /* ---- B1. THE BUILDING STACK, Paolo's three defects of 7/27 -------------- */
  const L = loud.look;
  ok('LOOK: the run reports what it would actually lay on the real block', !!L && L.doors > 0);
  // 1. THE DOOR WALL (Paolo: "at the least three wall tiles tall")
  ok('DOOR WALL: the street face is four courses of real wall, not a stripe',
    !!L && L.faceH >= 4);
  ok('DOOR WALL: EVERY door in the block stands in at least three wall courses',
    !!L && L.minDoorWallCourses >= 3);
  ok('DOOR WALL: every door is on the SOUTH face - the only wall this view draws',
    !!L && L.doors > 0 && L.doorsOnSouthFace === L.doors);
  // 2. THE GARAGE (Paolo: "sideways u's")
  ok('GARAGE: a bay is a bay - never wider than three tiles',
    !!L && L.widestBay <= 3);
  ok('GARAGE: a bay is never a vertical stripe (the sideways U was 7 tall)',
    !!L && L.tallestBayColumn <= 2);
  ok('GARAGE: the block really has garage bays in it, not just roof',
    !!L && L.bays >= 1);
  // 3. THE YARDS (Paolo 7/27: "so many sidewalk cement things spread around")
  ok('YARDS: not one stray slab of concrete anywhere on the block',
    !!L && L.strayConcrete === 0);
  ok('YARDS: the concrete that IS there is a front path that reached the street',
    !!L && L.pathCells > 0 && L.pathDoors > 0);
  // 4. THE ROOF AND THE CAP (the orange slab, and the wall course capping it)
  ok('ROOF: no roof is ever a field - three courses of cap, never twelve',
    !!L && L.worstRoofRun <= L.roofD + 1);
  ok('ROOF: no mass is capped by a course of wall standing on nothing',
    !!L && L.strayWallCaps === 0);
  // 4. UNDERNEATH (Paolo: "with an opacity filter or something")
  ok('UNDER: standing in the yard with the wall north of you leaves you OPAQUE',
    !!loud.occInYard && loud.occInYard.wallToTheNorth === true && loud.occInYard.faded === false);
  ok('UNDER: standing IN the doorway really draws the leaf see-through over you',
    !!loud.occInDoorway && loud.occInDoorway.inDoorway === true && loud.occInDoorway.faded === true);

  // fork-specific: the whole point of each path
  ok('LOUD: the combat handoff really fired over the bridge', loud.encounters.length === 1);
  ok('LOUD: the encounter carried a real roster and package', loud.encounters.length === 1 &&
    Array.isArray(loud.encounters[0].roster) && loud.encounters[0].roster.length >= 2 &&
    loud.encounters[0].packageId != null && loud.encounters[0].questId === 'bq_meter_reader');
  ok('LOUD: the run resumed when BOHEMIA_COMBAT_END came back',
    !!loud.afterResolve.combat && loud.afterResolve.combat.victory === true);
  ok('LOUD: the loud fork posts as #reckless (the loudest clout in canon)',
    loud.feed[0] && loud.feed[0].clout === 'reckless');
  ok('QUIET: a quiet fix starts NO fight (the pacifist path is a whole run too)',
    quiet.encounters.length === 0 && quiet.afterResolve.combat == null);
  ok('QUIET: the quiet fork posts as #quiet', quiet.feed[0] && quiet.feed[0].clout === 'quiet');
  ok('CLOUT ORDER HOLDS: loud out-earns quiet on the same quest',
    loud.profile.reach > quiet.profile.reach);

  // ---- B2. SAVE / LOAD, against the two rulings' own words -----------------
  ok('SAVE: no page errors across the save/load suite', sv.errors.length === 0);
  if (sv.errors.length) console.log('    ' + sv.errors.slice(0, 4).join('\n    '));
  ok('SAVE: a save exists from the first second (death always has somewhere to land)',
    sv.bootSaves.length >= 1);
  ok('SAVE: the blob is VERSIONED and carries the engine save AND the run state',
    !!sv.slots[0] && sv.slots[0].env >= 1 && sv.slots[0].hasEngine && sv.slots[0].hasRun);
  ok('SAVE: DEVICE PREFERENCES NEVER TRAVEL IN THE SAVE (the law\'s own rule)',
    sv.slots.every(s => s.carriesDevicePrefs === false));
  ok('SAVE: the world really moved between save and load (the test is not a no-op)',
    sv.drifted.px !== sv.saved.px || sv.drifted.py !== sv.saved.py);
  ok('SAVE: load restores the exact state — position, surface and quest stage',
    sv.loadOk === true && sv.restored.px === sv.saved.px && sv.restored.py === sv.saved.py &&
    sv.restored.mode === sv.saved.mode && sv.restored.stage === sv.saved.stage);
  ok('SAVE: all three kinds coexist (sleep + manual + autosave), per "BOTH"',
    sv.slots.some(s => s.label === 'manual') && sv.slots.some(s => /^auto:/.test(s.label)));
  ok('SAVE: an EXPORT CODE carries the whole game (no server, phase 1)', sv.codeBytes > 500);
  ok('SAVE: that code IMPORTS onto a FRESH device and restores the same state',
    sv.importOk === true && sv.imported.px === sv.saved.px && sv.imported.py === sv.saved.py &&
    sv.imported.stage === sv.saved.stage);
  ok('SAVE: an OLDER save version MIGRATES FORWARD, it is never rejected', sv.oldImportOk === true);
  ok('SAVE: a junk code is refused instead of half-loading', sv.junkRejected === true);
  ok('DEATH IS A RELOAD: losing the fight lands you on the closest previous save',
    sv.deathLandedOnSave === true);
  ok('DEATH IS A RELOAD: it is a LOAD, not a reset — the quest keeps its progress',
    sv.afterDeath.stage >= 20);

  // ---- C. THE WHOLE BRIDGE, INSIDE THE REAL ALPHA --------------------------
  const alpha = fs.readFileSync(ALPHA_FILE, 'utf8');
  ok('the alpha has a RUN tab', alpha.indexOf('data-p="run"') >= 0);
  ok('the RUN tab loads the generated run page', alpha.indexOf('BOHEMIA_RUN_CURRENT.html') >= 0);
  // 7/27: this used to be /BUILD 7\/26/ — a hardcoded DATE, so the assertion
  // passed all of 7/26 and then failed every session on 7/27 for no reason
  // except the calendar. The ship law asks for a date-letter stamp
  // ("BUILD 7/20a · SHUFFLE ANIMS"); check that SHAPE, and that it carries a
  // headline, which is the part that actually tells Paolo what build he is on.
  ok('the buildstamp names this build (date-letter + a headline)',
    /BUILD \d{1,2}\/\d{1,2}[a-z]*\s*[·-]\s*\S/.test(alpha));
  ok('one-link law: the run is reached from the alpha, it ships no link of its own',
    alpha.indexOf('BOHEMIA_RUN_CURRENT.html?') < 0);

  const C = await alphaRun();
  ok('ALPHA: the RUN tab really boots the run inside the alpha', C.ready === true);
  // Paolo 7/26: the run has to BE the game we built, not a dot on squares.
  ok('ALPHA: the run wears the REAL character — 8 directions of the real baked body',
    !!C.cast && C.cast.dirs === 8 && C.cast.spriteW > 0 && C.cast.spriteH > 0);
  ok('ALPHA: the real WALK CYCLE came with it (not a static pose)',
    !!C.cast && C.cast.walkFrames >= 4);
  ok('ALPHA: everyone else on the block is a real body too (wardrobe colourways)',
    !!C.cast && C.cast.looks >= 4 && C.cast.lookDirs === 8);
  ok('ALPHA: the real FACE SYSTEM renders the dialogue portraits',
    !!C.cast && C.cast.portrait === true && C.cast.npcPortraits >= 4);
  // THE REAL VALLEY (ledger's own next gap, closed)
  ok('VALLEY: the run stands on a real CELL of the generated valley, not a detached block',
    !!C.cell && C.cell.isHome === true && C.cell.name === 'suburb' && C.cell.tiles === 128);
  ok('VALLEY: that cell really holds the neighbourhood (footprints read off the world)',
    !!C.cell && C.cell.homes >= 8);
  ok('VALLEY: there are REAL districts on the other side of its edges',
    !!C.neighbours && Object.keys(C.neighbours).filter(k => C.neighbours[k]).length >= 2);
  ok('VALLEY: walking off the edge really loads the neighbouring district',
    !!C.crossed && C.crossed.isHome === false && !!C.crossed.name &&
    C.crossed.at.join() !== C.cell.at.join());
  // THE SENTENCE THE GAME SPEAKS (Paolo, after the lab)
  ok('SENTENCE: the moments are HIS sizes — sleep 8, hang out 1, eat unpriced',
    !!C.moments && C.moments.length >= 3 &&
    C.moments.some(m => m.name === 'SLEEP' && m.spends === 8) &&
    C.moments.some(m => m.name === 'HANGOUT' && m.spends === 1) &&
    C.moments.some(m => m.name === 'EAT' && m.spends === null));
  ok('SENTENCE: REACH is one DECLARED number with a facing, not three guesses',
    !!C.reach && C.reach.tiles === 1 && C.reach.faced && typeof C.reach.faced.x === 'number');
  ok('SENTENCE: ONE button, and at home it is SLEEP', !!C.verbHome && C.verbHome.verb === 'sleep');
  ok('SENTENCE: the SAME button becomes the doorway when you stand in it',
    !!C.verbDoor && C.verbDoor.verb === 'enter');
  ok('SENTENCE: spending time RESOLVES THE WORLD through the ported resolver',
    !!C.sleepResolve && C.sleepResolve.moment === 'SLEEP' && C.sleepResolve.spends === 8 &&
    C.sleepResolve.ok === true);
  ok('SENTENCE: the resolver ran its steps in DECLARED phase order, not registration order',
    !!C.sleepResolve && C.sleepResolve.order.join('>') === 'block-clock>doors>neighbours>journal');
  ok('SENTENCE: a spent night really advanced the world (8 hours of it)',
    !!C.sleepResolve && C.sleepResolve.reports['block-clock'] &&
    C.sleepResolve.reports['block-clock'].advanced === 480);
  ok('SENTENCE: sleeping SAVES, per the ruled save spec',
    Array.isArray(C.savesAfterSleep) && C.savesAfterSleep.some(s => s.label === 'slept'));
  // THE WALK QUESTION, as something he can FEEL rather than read
  ok('WALK FEEL: all of the pattern note\'s options are switchable in the run',
    Array.isArray(C.walkModes) && ['GRID', 'SLIDE', 'HYBRID', 'FREE'].every(m => C.walkModes.indexOf(m) >= 0));
  ok('WALK FEEL: GRID really teleports (no drawn offset)', C.feel && C.feel.GRID === 0);
  ok('WALK FEEL: SLIDE really interpolates across the cell', C.feel && C.feel.SLIDE > 0.1);
  ok('WALK FEEL: FREE really moves sub-cell, so the three feels are actually different',
    C.feel && C.feel.FREE > 0 && C.feel.FREE < 1);
  // DOOR LAW (Paolo 7/26): 1 wide, 2 tall, and they are the APPROVED animated bank
  ok('DOORS: the approved animated door bank really shipped in the run',
    !!C.doors && C.doors.clips >= 6 && /DOOR_ANIM_BANK/.test(C.doors.version || ''));
  ok('DOOR LAW: a door is ONE tile wide and TWO tiles tall',
    !!C.doors && C.doors.tileW === 1 && C.doors.tileH === 2);
  ok('DOORS: the full 9-frame open/close clip, not a still',
    !!C.doors && C.doors.frames === 9);
  ok('DOORS: a shut door BLOCKS you — walking into it does not move you',
    C.doorBlocked === true);
  ok('DOORS: bumping it really swings the leaf (the frame advances over 2 beats)',
    C.doorMidFrame > 0 && C.doorEndFrame > C.doorMidFrame && C.doorEndFrame >= 8);
  ok('MUSIC: walking starts the parent\'s real synth (the step is the gesture)',
    C.musicAfterWalk === true);
  ok('MUSIC: the toggle really round-trips through the alpha, both ways',
    C.musicOff === false && C.musicOn === true);
  /* the three that would have caught 7/27's "i press the music button off and
     the music still plays": the graph is live, OFF actually silences it, and
     OFF does not leave the synth permanently muted */
  if(process.env.RUN_GATE_DEBUG) console.log('    audio=',JSON.stringify(C.audio));
  ok('MUSIC: the gate drove the REAL synth (a live audio context at full master)',
    !!C.audio && C.audio.playing.on === true && C.audio.playing.ac === 'running'
    && C.audio.playing.gain > 0.5);
  ok('MUSIC: OFF MEANS SILENT — the master really goes to zero, not just the scheduler',
    !!C.audio && C.audio.stopped.on === false && C.audio.stopped.timer === false
    && C.audio.stopped.gain === 0);
  ok('MUSIC: ON after OFF is not a silent build — the master comes back up',
    !!C.audio && C.audio.again.on === true && C.audio.again.gain > 0.5);
  ok('ALPHA: no page errors while the run plays inside the alpha', C.errors.length === 0);
  if (C.errors.length) console.log('    ' + C.errors.slice(0, 4).join('\n    '));
  ok('ALPHA: a loud resolution really opens the COMBAT tab', C.combatPanelOn === true);
  ok('ALPHA: the real combat frame really exists after the handoff', C.combatFrame === true);
  ok('ALPHA: a REAL encounter was pushed into the dial (not just a tab switch)',
    !!C.handoff && C.handoff.acked === true && C.handoff.started === true);
  ok('ALPHA: the real BOHEMIA_COMBAT_END from the combat frame puts you back on the block',
    C.backOnRun === true);
  ok('ALPHA: the run really receives the fight\'s outcome (dead/spared/fled)',
    !!C.combatBack && C.combatBack.victory === true && C.combatBack.dead === 2 && C.combatBack.spared === 1);

  // the dev source is the thing you edit; the generated file says so
  ok('the generated run page warns it is generated', after.indexOf('never edit this file directly') >= 0);
  ok('the dev source exists to edit', fs.existsSync(SRC_FILE));

  console.log('RUN GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('RUN GATE: crashed — ' + (e && e.stack || e)); process.exit(1); });
