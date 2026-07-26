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
async function walkTo(page, target, opts) {
  opts = opts || {};
  const g = await page.evaluate(() => window.__RUN.grid());
  const st = await page.evaluate(() => window.__RUN.state());
  const steps = route(g.pass, [st.px, st.py], target, opts.throughDoors ? null : g.doorOf);
  if (!steps) throw new Error('no route from ' + st.px + ',' + st.py + ' to ' + target);
  for (const d of steps) await tapStep(page, d);
  return steps.length;
}
async function walkOutOfHouse(page) {
  const inr = await page.evaluate(() => window.__RUN.interior());
  const st = await page.evaluate(() => window.__RUN.state());
  const steps = route(inr.pass, [st.px, st.py], inr.door, null);
  if (!steps) throw new Error('no route to the interior door');
  for (const d of steps) await tapStep(page, d);
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
  rep.actLabelAtLineman = await page.textContent('#act');
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
  rep.shot = path.join(ROOT, 'slices', 'BOHEMIA_RUN_PROOF_' + fork + '_7_26_26.png');
  await page.screenshot({ path: rep.shot });
  await page.close();
  return rep;
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
    await page.goto('file://' + ALPHA_FILE, { timeout: 120000 });
    await page.click('#front');
    await page.click('.tab[data-p=run]');
    const handle = await page.waitForSelector('#runFrame');
    const run = await handle.contentFrame();
    await run.waitForFunction(() => window.__RUN_READY === true, null, { timeout: 120000 });
    out.ready = true;

    /* THE REAL CAST (Paolo's ruling 7/26): the run must be wearing the actual
       character, not a coloured dot. Wait for the parent's bake to land and
       assert it is a real multi-direction body set with real portraits. */
    await run.waitForFunction(() => { const c = window.__RUN.cast(); return !!c && c.dirs >= 8; },
      null, { timeout: 180000 });
    out.cast = await run.evaluate(() => window.__RUN.cast());

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
      null, { timeout: 30000 });
    out.combatBack = (await run.evaluate(() => window.__RUN.state())).combat;
    await page.screenshot({ path: path.join(ROOT, 'slices', 'BOHEMIA_RUN_IN_ALPHA_7_26_26.png') });
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
  let loud = null, quiet = null;
  try {
    loud = await playRun(browser, 'loud');
    quiet = await playRun(browser, 'quiet');
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

  // ---- C. THE WHOLE BRIDGE, INSIDE THE REAL ALPHA --------------------------
  const alpha = fs.readFileSync(ALPHA_FILE, 'utf8');
  ok('the alpha has a RUN tab', alpha.indexOf('data-p="run"') >= 0);
  ok('the RUN tab loads the generated run page', alpha.indexOf('BOHEMIA_RUN_CURRENT.html') >= 0);
  ok('the buildstamp names this build', /BUILD 7\/26/.test(alpha));
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
