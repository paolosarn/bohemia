#!/usr/bin/env node
/* ===========================================================================
   RUN PEOPLE GATE — THE SURFACE HE ACTUALLY PLAYS HAS A DAY IN IT.

   WHY THIS GATE AND NOT AN ASSERTION IN AN EXISTING ONE: zone_map_gate proves
   the module, city_people_gate proves the CITY tab, mass_edit_gate proves an
   edit lands. None of them opens slices/BOHEMIA_RUN_CURRENT.html, and THE RUN
   IS THE SURFACE PAOLO PLAYS. This lane already spent three turns fixing the
   CITY tab while he was looking at the run; that is what this file exists to
   make impossible a second time.

   WHAT IT HOLDS:
     1. the module half, over 300 synthetic days: a conditioned schedule still
        tiles the day exactly once, conditions NEVER send anybody out, and the
        morning edge moves only the morning.
     2. the real half, in a real browser on the real run file: the block has
        people, they carry person facts, the ids are namespaced so a run body
        and a city body can never collide, and THE STREET THINS AT MIDDAY --
        stepped there with the game's own SIM.step(), not simulated here.
     3. the DRAW: what the paint list actually received, read out of
        window.__RUN_PPL_DRAWN, because a gate that asks a helper instead of
        reading the render is a gate that cannot fail. This lane shipped one of
        those on 7/31 and only found it by sabotaging its own draw.
     4. a bulk edit reaches bodies that are already walking.

   PROVED ABLE TO FAIL before it was believed: with conditionSchedule stubbed to
   return its input unchanged, assertions in sections 1, 2 and 4 go red.
   =========================================================================== */
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
const RUN_FILE = path.join(ROOT, 'slices/BOHEMIA_RUN_CURRENT.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL ' + n)); };

function requirePlaywright() {
  const globals = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules'];
  for (const g of globals) { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

/* ---------------------------------------------------------------------------
   1. THE MODULE HALF — the invariants, over enough days to mean something
   --------------------------------------------------------------------------- */
const P = require(path.join(ROOT, 'engine/bohemia_population.js'));
const A = require(path.join(ROOT, 'engine/bohemia_agents.js'));
const SEED = 2691674296;                       // hashSeed('bohemia'), the ONE seed

/* WHERE A SCHEDULE PUTS SOMEBODY AT MINUTE M, COMPUTED HERE ON PURPOSE. This
   started life inside bohemia_population.js and zone_map_gate caught it in the
   same turn: agents.js already owns that answer, and a second scan of a block
   list living next to it is the fork the ENGINE SYNC LAW forbids. A gate is the
   one place it belongs, because a gate that reuses the code it is checking is
   not checking anything. */
const whereAtMin = (blocks, m) => {
  for (const b of blocks) if (m >= b.t0 && m < b.t1) return b.where;
  return blocks.length ? blocks[blocks.length - 1].where : null;
};

ok('conditionSchedule is exported', typeof P.conditionSchedule === 'function');
ok('the module does NOT ship its own schedule reader (ENGINE SYNC LAW)',
  typeof P.whereAtMin === 'undefined'
  && !/function\s+whereAtMin/.test(fs.readFileSync(path.join(ROOT, 'engine/bohemia_population.js'), 'utf8')));
ok('shiftEdges is exported separately from the conditions', typeof P.shiftEdges === 'function');
ok('conditionAgents is exported', typeof P.conditionAgents === 'function');
ok('peopleForAgents is exported', typeof P.peopleForAgents === 'function');

{
  let tiling = 0, pushedOut = 0, conditioned = 0, edgeMoved = 0, actLeak = 0;
  let out09 = 0, out13 = 0, out1630 = 0, hot13 = 0, hotPeople = 0, n = 0;
  for (let s = 0; s < 300; s++) {
    const p = P.personFields(3, 4, s, SEED, 'spread', [10, 10], 'run');
    const raw = A.scheduleFor(p.scheduleSeed, p.archetype, p.archetype === 'worker' ? 400 : null);
    const sh = P.shiftEdges(raw, p);
    const c = P.conditionSchedule(sh, p, {});
    // the day still tiles [0,1440) exactly once, no gaps, no overlaps
    if (c[0].t0 !== 0 || c[c.length - 1].t1 !== 1440) tiling++;
    for (let i = 1; i < c.length; i++) if (c[i].t0 !== c[i - 1].t1) tiling++;
    // A CONDITION ONLY EVER SENDS SOMEBODY HOME. Never out. This is the law
    // written into the module's own header and it is checked minute by minute.
    for (let m = 0; m < 1440; m += 5)
      if (whereAtMin(sh, m) === 'home' && whereAtMin(c, m) !== 'home') pushedOut++;
    // 'shade' is the conditioned act and may only ever sit on a home block
    for (let i = 0; i < c.length; i++) if (c[i].act === 'shade' && c[i].where !== 'home') actLeak++;
    // the morning edge moves the morning and nothing else
    if (sh[0].t1 !== raw[0].t1) {
      edgeMoved++;
      if (sh.length !== raw.length) tiling++;
      for (let i = 2; i < raw.length; i++) if (sh[i].t0 !== raw[i].t0 || sh[i].t1 !== raw[i].t1) tiling++;
    }
    for (let m = 0; m < 1440; m += 5) if (whereAtMin(sh, m) !== whereAtMin(c, m)) { conditioned++; break; }
    n++;
    if (whereAtMin(c, 9 * 60) !== 'home') out09++;
    if (whereAtMin(c, 13 * 60) !== 'home') out13++;
    if (whereAtMin(c, 16 * 60 + 30) !== 'home') out1630++;
    if (p.heatTol >= 3) { hotPeople++; if (whereAtMin(c, 13 * 60) !== 'home') hot13++; }
  }
  ok('a conditioned day still tiles [0,1440) exactly once', tiling === 0);
  ok('a CONDITION never sends anybody OUT, at any minute of any day', pushedOut === 0);
  ok("the 'shade' act only ever sits on a home block", actLeak === 0);
  ok('the conditions actually fire on a real population (>25% of days change)', conditioned > n * 0.25);
  ok('the morning edge moves for most people (individual mornings)', edgeMoved > n * 0.5);
  ok('THE STREET EMPTIES AT MIDDAY: fewer out at 13:00 than at 09:00', out13 < out09 * 0.5);
  ok('AND IT REFILLS: more out at 16:30 than at 13:00', out1630 > out13 * 2);
  ok('nobody with heatTol 3 is outdoors at 13:00', hotPeople > 20 && hot13 === 0);
}

/* ONE DERIVATION POINT, still one: the namespace changes the id AND the stream,
   so a run body and a city body at the same numbers are different people. */
{
  const city = P.personFields(3, 4, 7, SEED, 'spread', [10, 10]);
  const run = P.personFields(3, 4, 7, SEED, 'spread', [10, 10], 'run');
  ok('a city person id carries no namespace', city.id === '3:4:7');
  ok('a run person id is namespaced', run.id === 'run:3:4:7');
  const same = ['look', 'face', 'archetype', 'heatTol', 'earlyBy'].every(k => city[k] === run[k]);
  ok('the namespace moves the hash stream, not just the label', !same);
  const again = P.personFields(3, 4, 7, SEED, 'spread', [10, 10], 'run');
  ok('and it is still deterministic', JSON.stringify(again) === JSON.stringify(run));
}

/* ---------------------------------------------------------------------------
   2/3/4. THE REAL SURFACE
   --------------------------------------------------------------------------- */
(async () => {
  ok('the run file exists', fs.existsSync(RUN_FILE));
  const src = fs.readFileSync(RUN_FILE, 'utf8');
  ok('the run inlines the population module', src.indexOf('BohemiaPopulation') >= 0);
  ok('the run conditions its agents', src.indexOf('conditionAgents') >= 0);
  ok('the draw records what it painted', src.indexOf('__RUN_PPL_DRAWN') >= 0);

  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 200)));
  await page.goto('file://' + RUN_FILE);
  await page.waitForFunction(() => window.__RUN_PEOPLE && window.__RUN_PEOPLE.ready(), { timeout: 40000 })
    .catch(() => {});

  ok('the run boots with no page errors', errors.length === 0);
  const ready = await page.evaluate(() => !!(window.__RUN_PEOPLE && window.__RUN_PEOPLE.ready()));
  ok('the person facts are live on the real surface', ready);

  const count = await page.evaluate(() => window.__RUN_PEOPLE.count());
  ok('the block Paolo opens on has people on it', count >= 6);

  const facts = await page.evaluate(() => window.__RUN_PEOPLE.facts());
  ok('one person record per agent', facts && facts.length === count);
  if (facts && facts.length) {
    ok('every run id is namespaced (no collision with a CITY body)',
      facts.every(f => f.ns === 'run' && f.id.indexOf('run:') === 0));
    ok('every body has an archetype from the four', facts.every(f => P.ARCHETYPES.indexOf(f.archetype) >= 0));
    ok('every body has a heat tolerance in range', facts.every(f => f.heatTol >= 0 && f.heatTol <= 3));
    ok('every body has a morning edge in range', facts.every(f => f.earlyBy >= -30 && f.earlyBy <= 30));
    ok('the ids are distinct', new Set(facts.map(f => f.id)).size === facts.length);
    ok('THEY ARE NOT ALL THE SAME PERSON: more than one day-signature on one block',
      new Set(facts.map(f => f.archetype + '|' + f.heatTol + '|' + f.earlyBy)).size >= Math.min(4, facts.length));
  }

  /* WALK OUT OF THE HOUSE FIRST, with the buttons, because the exterior body
     pass only runs when the player is on the street - and the DRAW is the thing
     worth reading. The run opens indoors (RUN.phase 'home_inside'). This is a
     greedy walk to the interior door and then the game's own ONE BUTTON, not a
     teleport: mode only flips because the run's own exit path ran. */
  async function tap(id) { await page.click(id); }
  async function walkOut() {
    for (let guard = 0; guard < 120; guard++) {
      const st = await page.evaluate(() => window.__RUN.state());
      if (st.mode === 'ext') return true;
      const inr = await page.evaluate(() => window.__RUN.interior());
      if (!inr) return false;
      if (st.px === inr.door[0] && st.py === inr.door[1]) {
        const v = await page.evaluate(() => window.__RUN.verb());
        if (v && v.verb === 'enter') { await tap('#act'); continue; }
      }
      const dx = Math.sign(inr.door[0] - st.px), dy = Math.sign(inr.door[1] - st.py);
      // try the bigger axis first, then the other, then the button that is left
      const tries = (Math.abs(inr.door[0] - st.px) >= Math.abs(inr.door[1] - st.py))
        ? [dx ? (dx > 0 ? '#br' : '#bl') : null, dy ? (dy > 0 ? '#bd' : '#bu') : null]
        : [dy ? (dy > 0 ? '#bd' : '#bu') : null, dx ? (dx > 0 ? '#br' : '#bl') : null];
      let moved = false;
      for (const t of tries) {
        if (!t) continue;
        await tap(t);
        const after = await page.evaluate(() => window.__RUN.state());
        if (after.px !== st.px || after.py !== st.py || after.mode !== st.mode) { moved = true; break; }
      }
      if (!moved) { await tap('#bd'); await tap('#br'); }   // unstick, then re-plan
    }
    return false;
  }
  const gotOut = await walkOut();
  ok('the player can walk out of the house with the buttons', gotOut);

  /* THE DAY, STEPPED WITH THE GAME'S OWN CLOCK, FORWARD ONLY. runTo calls
     SIM.step(), the same tick the run advances on - nothing is re-simulated
     here. Forward only because a pathing sim's state depends on its history:
     jumping the clock around gives a different (equally real) afternoon, and a
     gate should read the day the game actually plays. */
  const at = {};
  for (const m of [8 * 60, 10 * 60, 11 * 60, 12 * 60, 13 * 60, 14 * 60, 15 * 60, 17 * 60, 20 * 60]) {
    at[m] = await page.evaluate(mm => window.__RUN_PEOPLE.runTo(mm), m);
  }
  ok('the clock lands where it was sent', Object.keys(at).every(m => at[m] && at[m].minute === +m));
  ok('the street is populated in the late morning', at[11 * 60].outdoors >= 3);
  ok('THE RUN EMPTIES AT MIDDAY TOO: fewer outdoors at 14:00 than at 11:00',
    at[14 * 60].outdoors < at[11 * 60].outdoors);
  ok('and it refills in the late afternoon', at[17 * 60].outdoors > at[14 * 60].outdoors);

  /* 3. THE DRAW, read off the paint list itself.
        WHAT THIS CAN AND CANNOT PROVE, stated rather than papered over: the
        run's viewport is about four tiles either side of you (CELL 44 on a
        ~390px canvas), so standing on a 128-tile block the honest painted count
        is often ZERO and "painted bodies thin at midday" read from one vantage
        would be noise, not evidence. The day-shape above is carried by
        SIM.outAgents(), which is not a helper of mine - it is the exact list
        this draw loop iterates.
        What the render CAN prove from any vantage, and what actually matters:
        THE SURFACE NEVER PAINTS SOMEBODY THE SIM PUT INDOORS. That is the
        disagreement this whole lane exists to prevent, and it is checked at
        every hour sampled. */
  ok('the draw records what it painted, by id',
    Object.keys(at).every(m => typeof at[m].drawn === 'number'));
  ok('the draw never paints more bodies than are outdoors',
    Object.keys(at).every(m => at[m].drawn <= at[m].outdoors));
  const ghosts = await page.evaluate(() => {
    const outNow = {}; window.SIM.outAgents().forEach(a => { outNow[a.id] = 1; });
    return (window.__RUN_PPL_IDS || []).filter(id => !outNow[id]);
  });
  ok('NOBODY THE SIM PUT INDOORS IS STILL PAINTED ON THE STREET', ghosts.length === 0);

  /* 4. A BULK EDIT REACHES BODIES ALREADY WALKING. Paolo's 7/29 condition:
        "make sure you do the coding right so when its time to mass edit the
        people you can". This performs a REAL edit and measures it on the run. */
  const edited = await page.evaluate(() => {
    window.BohemiaPopulation.addRule({
      name: '__gate_everyone_hides',
      where: function () { return true; },
      set: { heatTol: 3, nightOut: false }
    });
    return window.__RUN_PEOPLE.recondition();
  });
  ok('the bulk edit changed days on bodies that are already walking', edited > 0);
  const afterEdit = await page.evaluate(() => window.__RUN_PEOPLE.runTo(11 * 60))
    .then(() => page.evaluate(() => window.__RUN_PEOPLE.runTo(15 * 60)));
  ok('EVERY body is indoors by 15:00 after the edit', afterEdit.outdoors === 0);
  ok('and the draw agrees: no neighbour body is painted', afterEdit.drawn === 0);
  const cleared = await page.evaluate(() => {
    window.BohemiaPopulation.removeRule('__gate_everyone_hides');
    return window.__RUN_PEOPLE.recondition();
  });
  ok('removing the rule is also an edit that lands', cleared > 0);
  const afterClear = await page.evaluate(() => window.__RUN_PEOPLE.runTo(17 * 60));
  ok('and the street comes back', afterClear.outdoors > 0);

  /* THE ROUND TRIP IS THE POINT, and it caught a real defect: conditioning the
     LAST result instead of the original slid every morning edge 30 minutes
     earlier on every edit. A person's wake time has to survive being edited and
     un-edited. */
  const facts2 = await page.evaluate(() => window.__RUN_PEOPLE.facts());
  ok('an edit-then-unedit leaves the people exactly as they were',
    JSON.stringify(facts2) === JSON.stringify(facts));

  await browser.close();

  console.log('\n=== RUN PEOPLE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  if (fail) process.exit(1);
})().catch(e => { console.log('  FAIL harness: ' + e.message); process.exit(1); });
