/* ============================================================================
   DAY LOOP GATE (8/11/26) — the day CLOSES, and it closes in the browser.

   Paolo's demo row: "close the game day loop end to end (hardcode the demo
   quests, scaffolding is legal)". A loop that only closes in Node is not closed;
   MEASURE THE THING HE NAMED clause 1 is that a module in engine/ is a module
   the player never runs. So this gate has two halves and the second one is the
   one that counts: it boots the real city, taps the real buttons, and plays a
   real day from wake to nightfall to the next wake.

   WHAT IT REFUSES TO LET ROT:
     1. the loop's shape -- wake 06:00, sixteen hours, nightfall 22:00, reckon,
        next day carrying everything
     2. NO INVENTED WORDS. Every resolution button in the game must be the
        destination stage's own @LOG line, VERBATIM, byte for byte against
        quests/bq/*.bq. This is the assertion that keeps a demo from quietly
        becoming a place where non-canon prose lives.
     3. NIGHTFALL HAS TEETH AND THEY ARE HIS TEETH -- an unresolved quest takes
        the quest author's own FAIL stage, not a number I made up.
     4. the loop survives a reload (a day loop that resets is a session toy)
     5. NO DAMAGE BEFORE THE DIAL -- the STAKES table is EMPTY. If a later hand
        adds a cost to living a day without Paolo ruling it, this goes red.
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const BQ = require(path.join(ROOT, 'engine/bohemia_bq.js'));
const RT = require(path.join(ROOT, 'engine/bohemia_quest_runtime.js'));
const DL = require(path.join(ROOT, 'engine/bohemia_dayloop.js'));
const DQ = require(path.join(ROOT, 'engine/bohemia_demoquests.js'));
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('DAY LOOP GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

const SRC = {};
for (const f of ['S01_THE_METER_READER', 'S09_THE_BACK_DOOR', 'S02_THE_SAME_CRATE_TWICE'])
  SRC[f] = fs.readFileSync(path.join(ROOT, 'quests/bq', f + '.bq'), 'utf8');

/* ---- 1. THE SHAPE -------------------------------------------------------- */
{
  const L = DL.make();
  ok('a day wakes at 06:00', (L.wake(), L.min === 6 * 60 && L.phase === 'awake'));
  ok('a day is sixteen waking hours', DL.NIGHT_MIN - DL.WAKE_MIN === 16 * 60);
  L.tick(60, 'suburb'); L.step('suburb'); L.step('suburb');
  ok('time and steps are counted where you actually stood',
     L.min === 7 * 60 && L.ledger.steps === 2 && L.ledger.districts.suburb === 60);
  ok('mid-day the summary does NOT claim the day ended', L.summary().reason === null);
  const r = L.tick(20 * 60, 'suburb');
  ok('one huge action cannot step OVER nightfall', r === 'ended' && L.min === DL.NIGHT_MIN);
  ok('the reckoning knows why the day ended', L.summary().reason === 'nightfall');
  const d2 = L.nextDay();
  ok('the next day wakes at 06:00 carrying the history', d2 === 2 && L.min === 6 * 60 && L.history.length === 1);

  const E = DL.make(); E.wake(); E.tick(6 * 60, 'suburb'); E.sleep();
  ok('sleeping early ends the day and records the hours given back',
     E.phase === 'ended' && E.summary().reason === 'slept' && E.summary().hoursGivenBack === 10);
}

/* ---- 2. NO DAMAGE BEFORE THE DIAL --------------------------------------- */
{
  const L = DL.make(); L.wake(); L.sleep();
  ok('the STAKES table is EMPTY -- what a day costs to live is Paolo\'s ruling, not mine',
     Array.isArray(L.STAKES) && L.STAKES.length === 0 && L.summary().stakes.length === 0);
}

/* ---- 3. A REAL DAY, WITH A REAL CANON QUEST ----------------------------- */
{
  const L = DL.make(); L.wake();
  const Q = DQ.make({ BQ, BQRuntime: RT, sources: SRC, loop: L });
  const open = Q.openDay(1);
  ok('day 1 opens a real parsed canon quest', !!open && open.id === 'bq_meter_reader');
  ok('and its brief is the quest\'s own @LOG line',
     open.log === 'The block loses half its light at the same hour every night.');
  ok('the HUD carries the live objective', Q.hudLine() === 'Find why the block browns out');

  ok('walking into a LIT building does not advance it',
     Q.event('enter_building', { district: 'suburb', dark: false }) === null);
  const adv = Q.event('enter_building', { district: 'suburb', dark: true });
  ok('walking into a building on a DARK block does advance it', !!adv && adv.stage === 20);
  ok('and that advance raises the resolution card', !!adv.card && adv.card.options.length === 3);

  const res = Q.resolve(30);
  ok('resolving runs the quest for real', !!res && Q.done() && Q.outcome() === 'COMPLETE');
  ok('and its @DO verbs really fired (bond lineman +15)', Q.rt.state.bonds.lineman === 15);
  ok('the outcome carries the quest\'s own tag, not a label I invented', Q.tags()[0] === 'quiet');

  L.tick(20 * 60, 'suburb');
  const s = L.summary();
  ok('the reckoning lists the stages that actually fired', s.stages.length === 3);
  ok('and quotes the quest, not me',
     s.notes[2] === 'Put the current back myself. The block has light tonight. Nobody was told.');
}

/* ---- 4. NIGHTFALL TAKES THE QUEST'S OWN FAIL BRANCH --------------------- */
{
  const L = DL.make(); L.wake();
  const Q = DQ.make({ BQ, BQRuntime: RT, sources: SRC, loop: L });
  Q.openDay(1);
  L.tick(20 * 60, 'suburb');
  const r = Q.nightfall();
  ok('an unresolved quest FAILS at nightfall', !!r && Q.done() && Q.outcome() === 'FAIL');
  const Sq = BQ.parse(SRC.S01_THE_METER_READER);
  const failLog = Sq.stages.filter(x => x.n === 33)[0].log;
  ok('and it fails in the words its AUTHOR wrote for that branch, not mine', r.log === failLog);
}

/* ---- 5. NO INVENTED WORDS. THE ASSERTION THAT MATTERS MOST. ------------- */
{
  let checked = 0, bad = [];
  for (const spec of DQ.DAYS) {
    const raw = SRC[spec.file];
    const Q = BQ.parse(raw);
    const L = DL.make(); L.wake();
    const R = DQ.make({ BQ, BQRuntime: RT, sources: SRC, loop: L });
    R.openDay(spec.day);
    const card = R.pending || (function () {
      if (spec.advance && spec.advance.on === 'enter_building')
        R.event('enter_building', { district: 'x', dark: true });
      else if (spec.advance && spec.advance.on === 'enter_district')
        R.event('enter_district', { district: 'brand_new_district' });
      return R.pending;
    })();
    if (!card) { bad.push(spec.file + ': no resolution card'); continue; }
    for (const o of card.options) {
      checked++;
      if (!o.text || raw.indexOf(o.text) < 0) bad.push(spec.file + ' stage ' + o.stage);
    }
  }
  ok('every resolution button in the game exists VERBATIM in its .bq file (' + checked
     + ' buttons)' + (bad.length ? ' -- not in source: ' + bad.join(', ') : ''),
     checked >= 8 && bad.length === 0);
}

/* ---- 6. IT SURVIVES A RELOAD -------------------------------------------- */
{
  const L = DL.make(); L.wake();
  const Q = DQ.make({ BQ, BQRuntime: RT, sources: SRC, loop: L });
  Q.openDay(1);
  Q.event('enter_building', { district: 'suburb', dark: true });
  Q.resolve(31);
  L.tick(3 * 60, 'suburb');
  const blob = JSON.parse(JSON.stringify({ loop: L.serialize(), quest: Q.serialize() }));

  const L2 = DL.make(); const Q2 = DQ.make({ BQ, BQRuntime: RT, sources: SRC, loop: L2 });
  ok('the loop restores', L2.restore(blob.loop) && L2.day === 1 && L2.min === 9 * 60);
  ok('and so does the quest, mid-job, with its outcome intact',
     Q2.restore(blob.quest, L2.day) && Q2.done() && Q2.outcome() === 'COMPLETE');
  ok('including what the choice actually did to the world',
     Q2.rt.state.faction.TRADES === 8);
}

/* ---- 7. IT IS IN THE FILE THE PLAYER LOADS ------------------------------ */
{
  const src = fs.readFileSync(CITY, 'utf8');
  ok('the day loop is INLINED in the city, not just in engine/', src.indexOf('__DAY_LOOP__') >= 0);
  ok('the bare timer is gone', src.indexOf('function advance(mins){ T.min+=mins;') < 0);
  ok('the canon quest text ships with it', src.indexOf('DEMO_BQ=') >= 0);
  ok('the save carries the loop AND the quest', /loop:DAY\.serialize\(\),quest:DQ\.serialize\(\)/.test(src));
  ok('the scaffolding says it is scaffolding', /SCAFFOLDING/.test(src));
}

/* ---- 8. THE REAL SURFACE: PLAY A DAY IN A BROWSER ----------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available to play the real day', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + CITY, { waitUntil: 'load' });
  await pg.waitForTimeout(3000);

  const boot = await pg.evaluate(() => ({
    alive: typeof DAY !== 'undefined' && typeof DQ !== 'undefined',
    day: DAY.day, min: DAY.min, phase: DAY.phase,
    card: document.querySelector('#daycard.on') ? document.getElementById('daycardIn').textContent : '',
    qline: document.getElementById('qline').textContent
  }));
  ok('the city loads with ZERO page errors' + (errs.length ? ' -- first: ' + errs[0] : ''),
     errs.length === 0);
  ok('the day loop is alive in the real page', boot.alive === true);
  ok('a WAKE card is up at 06:00 on day 1',
     boot.day === 1 && boot.min === 360 && /DAY 1/.test(boot.card));
  ok('and it names the day\'s quest in the quest\'s own words',
     /THE METER READER/.test(boot.card));
  /* THE DAY STARTS WITH NO JOB SINCE 8/12 (__THE_PHONE_RINGS__): the work ARRIVES
     on the phone and is taken there, so there is deliberately no objective yet.
     That handshake is gates/phone_rings_gate.js's subject; THIS gate is about the
     LOOP, so it takes the job the run-side way and gets on with the day. */
  ok('and there is NO objective yet -- the job has not been taken ("' + boot.qline + '")',
     boot.qline === '');

  // GET UP, take the job, then walk into a dark building the way the game does
  await pg.click('#daycardIn .dcgo');
  await pg.waitForTimeout(120);
  await pg.evaluate(() => offerAccept());
  await pg.waitForTimeout(200);
  ok('once taken, the live objective is on the HUD',
     await pg.evaluate(() => /Find why the block browns out/.test(document.getElementById('qline').textContent)));
  const played = await pg.evaluate(() => {
    dayEnteredBuilding('a house');            // the same call inEnter makes
    const up = !!document.querySelector('#daycard.on');
    const txt = document.getElementById('daycardIn').textContent;
    const btns = [...document.querySelectorAll('#daycardIn .dcbtn')].map(b => b.textContent);
    return { up, txt, btns };
  });
  ok('walking into a building on a dark block raises the RESOLUTION card', played.up === true);
  ok('the card offers all three of the quest\'s real branches', played.btns.length === 3);
  {
    const raw = SRC.S01_THE_METER_READER;
    const clean = played.btns.map(t => t.replace(/^(QUIET|NOTABLE|RECKLESS)/, ''));
    ok('and every button on the real screen is the .bq file\'s own line, verbatim',
       clean.length === 3 && clean.every(t => raw.indexOf(t) >= 0));
  }

  const resolved = await pg.evaluate(() => {
    document.querySelectorAll('#daycardIn .dcbtn')[0].click();
    return { done: DQ.done(), outcome: DQ.outcome(), tag: DQ.tags()[0],
             bond: DQ.rt.state.bonds.lineman, qline: document.getElementById('qline').textContent,
             cardGone: !document.querySelector('#daycard.on') };
  });
  ok('tapping a branch on the real screen resolves the real quest',
     resolved.done === true && resolved.outcome === 'COMPLETE' && resolved.tag === 'quiet');
  ok('and its @DO verbs fired in the browser (bond lineman +15)', resolved.bond === 15);
  ok('the card closes and the HUD reports the outcome',
     resolved.cardGone === true && /DONE/.test(resolved.qline));

  const night = await pg.evaluate(() => {
    advance(20 * 60);                          // walk the day out
    return { phase: DAY.phase, up: !!document.querySelector('#daycard.on'),
             txt: document.getElementById('daycardIn').textContent };
  });
  ok('nightfall ends the day on the real surface', night.phase === 'ended');
  ok('and puts THE RECKONING up', night.up === true && /NIGHTFALL/.test(night.txt));
  ok('which quotes what actually happened today',
     /Put the current back myself/.test(night.txt));

  const next = await pg.evaluate(() => {
    document.querySelector('#daycardIn .dcgo').click();
    return { day: DAY.day, min: DAY.min, phase: DAY.phase,
             txt: document.getElementById('daycardIn').textContent,
             qline: document.getElementById('qline').textContent,
             /* the BRIEF lives on the phone now, so read the offer the run built
                rather than the wake card that no longer carries it */
             offer: (typeof OFFER !== 'undefined' && OFFER) ? OFFER : null };
  });
  ok('SLEEP starts DAY 2 at 06:00, awake', next.day === 2 && next.min === 360 && next.phase === 'awake');
  ok('and DAY 2 offers a DIFFERENT canon quest -- named on the card, briefed on the'
     + ' phone (__THE_PHONE_RINGS__)',
     /THE BACK DOOR/.test(next.txt)
     && !!next.offer && next.offer.title === 'The Back Door'
     && /behind the fence/.test(next.offer.text));

  await b.close();
  ok('no page error at any point in a full played day' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);

  /* ---- 9. MEASURE IT WHERE HE IS STANDING -----------------------------
     Clause 1b of MEASURE THE THING HE NAMED (8/3): everything above played the
     city file DIRECTLY. Paolo does not open that file. He opens the alpha and
     taps RUN, which loads the city in an iframe -- and this lane has already
     shipped a feature that was live in a district he never visits and called it
     done. So the last thing this gate does is tap RUN. */
  const b2 = await chromium.launch();
  const pg2 = await b2.newPage();
  const errs2 = [];
  pg2.on('pageerror', e => errs2.push(e.message));
  await pg2.goto('file://' + path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await pg2.waitForTimeout(2000);
  const tapped = await pg2.evaluate(() => {
    const t = [...document.querySelectorAll('[data-p]')].find(x => x.dataset.p === 'run');
    if (!t) return false;               // NEVER swallow a missing tab: four gates
    t.click(); return true;             // did that and reported green for weeks
  });
  ok('the RUN tab exists in the alpha and was tapped', tapped === true);
  if (tapped) {
    /* POLL, do not guess. Measured 8/11: the city frame's script does not execute
       until ~15s after the RUN tap on a cold local load (1.35MB of inline world
       plus generation). A fixed 6s wait reported the day loop DEAD when it was
       merely not born yet -- a gate lying in the same direction as a bug is
       worse than no gate. Waiting on the CONDITION is the honest instrument.
       (That 15s is itself a real finding, and it belongs to the streaming row.) */
    for (let i = 0; i < 60; i++) {
      const f = pg2.frames().find(x => /CITY_WORLD|CITY_CURRENT/.test(x.url()));
      if (f) { try { if (await f.evaluate(() => typeof DAY !== 'undefined')) break; } catch (e) {} }
      await pg2.waitForTimeout(1000);
    }
    /* the frame is a separate ORIGIN under file://, so reaching in from the page
       throws SecurityError. Playwright's frame handle crosses it, which is the
       whole reason to drive this from the harness rather than from page script. */
    const fr = pg2.frames().find(f => /CITY_WORLD|CITY_CURRENT/.test(f.url()));
    const inFrame = fr ? await fr.evaluate(() => ({
      reached: true,
      alive: typeof DAY !== 'undefined' && typeof DQ !== 'undefined',
      day: (typeof DAY !== 'undefined') ? DAY.day : null,
      min: (typeof DAY !== 'undefined') ? DAY.min : null,
      card: document.querySelector('#daycard.on')
        ? document.getElementById('daycardIn').textContent : '',
      qline: (document.getElementById('qline') || {}).textContent || ''
    })) : { reached: false };
    ok('the RUN tab really loads the city frame', inFrame.reached === true);
    ok('THE DAY LOOP IS ALIVE WHERE HE ACTUALLY PLAYS (alpha -> RUN -> city frame)',
       inFrame.alive === true && inFrame.day === 1 && inFrame.min === 360);
    ok('and the wake card is on his screen, in canon words',
       /THE METER READER/.test(inFrame.card));
  }
  await b2.close();
  ok('the alpha raises no page error with the day loop in it'
     + (errs2.length ? ' -- ' + errs2[0] : ''), errs2.length === 0);
  done();
})();
