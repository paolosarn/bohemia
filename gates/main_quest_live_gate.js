/* ============================================================================
   MAIN QUEST LIVE GATE (9/18/26, QUESTS lane) -- VAMILY row [main quest live],
   THE-MAIN-QUEST-IS-NOT-IN-THE-GAME.

   THE ROW, from FACTIONS via the coordinator (9/15): "quests/ is on the publish
   EXCLUDE list on purpose because a .bq quest reaches a player only by being
   INLINED into the slice at build time, and M01..M05, the main quest line ('THE
   FIRST MAIN-QUEST FILE THIS REPO HAS EVER HAD'), are inlined into NO surface.
   Nobody could ever play them. Inline the five into the walked city the way the
   side quests are, drafts under THERE IS NO STORY YET, and prove M01 opens on
   the demo with the one driver."

   ------------------------------------------------------------------------
   MEASURED BEFORE A LINE OF THIS WAS WRITTEN, by counting each quest id in each
   built surface:
       M01..M05    walked city 0    alpha 1    demo 1
       S01         walked city 2
   The one alpha hit is inside BOHEMIA_QUESTS, the DIRECT tab's editing table.
   SO THE MAIN LINE COULD BE EDITED AND NEVER PLAYED. The city's playable set
   carried 37 quests and ZERO main ones, and its day table had five rows and no
   main one, so two things were missing, not one: the text AND a slot.

   AND THE DEMO IS ONE DAY LONG. CT_DEMO_DAYS = 1 in the walked city, so the demo
   cut ends after day one and no amount of inlining puts a day-six job in front of
   a demo player. WHICH DAY THE STORY STARTS ON IS THE RUN'S CUT (Paolo 9/13 rule
   14a: only the run re-cuts the demo), so this gate proves the half that is this
   lane's: THE SURFACE THE DEMO LOADS CARRIES THE FIVE, AND THE ONE DRIVER OPENS
   THEM THERE. In the alpha, where days roll, day six really is M01 by play.

   WHAT THIS GATE HOLDS:

   1. THE ROW'S OWN CLAIM, AND IT IS THE SPINE: the walked city carries all five
      main quests VERBATIM. This is the check that was red before this round and
      it is proved to bite -- the same predicate is run against a copy of the
      city with M01 cut out, and it must go false.

   2. AND THAT REACHES HIM WITHOUT A RE-CUT. The demo build and the alpha both
      load the walked city BY PATH, so the text in the city is the text the demo
      runs. Proved by reading both files, not assumed.

   3. ONE DRIVER, NOT TWO. Every one of the ten days comes out of the same table
      through the same specForDay, and the module exports no second opener. A
      main quest that needed its own driver would be a second quest system.

   4. NOT ONE INVENTED WORD, exactly as the side quests are held: every
      resolution button on every main quest is that stage's own @LOG line,
      byte for byte against quests/bq/*.bq.

   5. THE FIVE DEMO DAYS ARE UNTOUCHED. Day one is still the meter reader, in
      the same shape, because EYES, PEOPLE and this lane's own haggle work all
      measure against day one right now.

   6. A QUEST WHOSE AUTHOR WROTE NO FAIL BRANCH DOES NOT GET ONE. M01, M03 and
      M05 end three or four ways and none of them is "you ran out of light".
      Nightfall leaves them open rather than inventing a failure.

   7. THE REAL SURFACE, IN A REAL BROWSER: M01 opens, walks its three beats, and
      resolves with its own @DO verbs firing, with zero page errors.
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const BQ = require(path.join(ROOT, 'engine/bohemia_bq.js'));
const RT = require(path.join(ROOT, 'engine/bohemia_quest_runtime.js'));
const DL = require(path.join(ROOT, 'engine/bohemia_dayloop.js'));
const DQ = require(path.join(ROOT, 'engine/bohemia_demoquests.js'));

const CITY  = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const DEMO  = path.join(ROOT, 'slices/BOHEMIA_DEMO.html');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) { pass++; } else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
const done = () => {
  console.log('MAIN QUEST LIVE GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
};

const MAIN = DQ.ACTS.map(a => a.file);
const cityText = fs.readFileSync(CITY, 'utf8');

/* THE ONE THING THIS GATE IS ABOUT, AS A FUNCTION, so it can be run against a
   DELIBERATELY BROKEN COPY of the city and prove it bites. A check that has
   never been seen to fail is a claim, not a gate (7/16). */
function inlinedVerbatim(html) {
  const out = { ok: true, missing: [] };
  let bag;
  try {
    const i = html.indexOf('const DEMO_BQ={');
    const j = html.indexOf('\n', i);
    bag = JSON.parse(html.slice(i + 'const DEMO_BQ='.length, j - 1));
  } catch (e) { return { ok: false, missing: ['DEMO_BQ would not parse'] }; }
  for (const stem of MAIN) {
    const disk = fs.readFileSync(path.join(ROOT, 'quests/bq', stem + '.bq'), 'utf8');
    if (bag[stem] !== disk) { out.ok = false; out.missing.push(stem); }
  }
  return out;
}

/* ---- 1. THE SPINE: THE WALKED CITY CARRIES THE MAIN LINE ---------------- */
{
  const r = inlinedVerbatim(cityText);
  ok('*** THE ROW: all five main quests are inlined in the walked city, VERBATIM ***'
     + (r.missing.length ? ' -- missing: ' + r.missing.join(', ') : ''), r.ok);

  /* PROVE IT BITES. Cut M01 out of a copy and the same predicate must go false.
     This is the exact state the repo was in before this round, reconstructed. */
  const i = cityText.indexOf('"M01_THE_NIGHT_THEY_CAME": ');
  const broken = cityText.slice(0, i) + '"M01_GONE": "x", ' + cityText.slice(i);
  const b = inlinedVerbatim(broken.replace('"M01_THE_NIGHT_THEY_CAME": ', '"M01_WAS_HERE": '));
  ok('and the check is PROVED to bite: cut M01 out and it goes red',
     b.ok === false && b.missing.indexOf('M01_THE_NIGHT_THEY_CAME') >= 0);

  /* a second bite: the same text with one character changed is not verbatim */
  const disk = fs.readFileSync(path.join(ROOT, 'quests/bq/M03_THE_RIDGE.bq'), 'utf8');
  const nudged = cityText.replace(JSON.stringify(disk), JSON.stringify(disk + ' '));
  ok('and a near-miss copy is not a copy: one extra byte in M03 goes red',
     nudged !== cityText && inlinedVerbatim(nudged).ok === false);
}

/* ---- 1b. AND THE CLASS OF BUG, NOT JUST THIS INSTANCE ------------------
   The row was one symptom of a general hole: a .bq can be written, parsed,
   studied, voice-passed and gated, and still reach nobody, because the ONLY
   thing that puts it in front of a player is being inlined into the slice. Five
   files sat outside for weeks with every other gate green. So the check is the
   whole set, not the five: EVERY quest the repo has is in the file the player
   loads, verbatim. The next one written cannot go missing quietly. */
{
  const disk = fs.readdirSync(path.join(ROOT, 'quests/bq'))
                 .filter(f => f.endsWith('.bq')).map(f => f.slice(0, -3)).sort();
  let bag = {};
  try {
    const i = cityText.indexOf('const DEMO_BQ={');
    const j = cityText.indexOf('\n', i);
    bag = JSON.parse(cityText.slice(i + 'const DEMO_BQ='.length, j - 1));
  } catch (e) {}
  const city = Object.keys(bag).sort();
  const missing = disk.filter(k => city.indexOf(k) < 0);
  const stale = disk.filter(k => bag[k] !== undefined &&
    bag[k] !== fs.readFileSync(path.join(ROOT, 'quests/bq', k + '.bq'), 'utf8'));
  ok('*** EVERY quest the repo has is in the file the player loads (' + city.length
     + '/' + disk.length + ') ***' + (missing.length ? ' -- never inlined: ' + missing.join(', ') : ''),
     missing.length === 0 && disk.length > 0);
  /* *** A QUEST MAY BE AHEAD OF THE CITY ONLY WHILE HE HAS NOT VOTED ON IT. ***
     (9/21.) This check caught its own author: round 43 wrote a new line into
     S01's SOURCE and deliberately did NOT re-inline it, because rule 18 holds
     this lane's code off the play surface and rule 15(b) says approved words go
     into the game only after he votes. Both decisions are right and the check
     could not say so, so it said "stale".

     The exception is NOT a name typed here. It is read from the vote registry:
     a quest may differ from the city while THIS LANE has an un-judged vote item
     whose page names it. When he votes, the item leaves the registry, the
     exception evaporates on its own, and the byte check bites again with no
     human remembering to delete anything. A list somebody has to clean up is a
     list that rots; this one cannot. */
  let excused = [], pending = [];
  try {
    const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
    const judged = new Set((reg.verdicts || []).map(v => v.id));
    for (const it of (reg.items || [])) {
      if (it.lane !== 'quests' || judged.has(it.id)) continue;
      const page = path.join(ROOT, 'slices', (it.show && it.show.src) || '');
      let text = '';
      try { text = fs.readFileSync(page, 'utf8'); } catch (e) {}
      pending.push(it.id);
      /* MATCHED ON THE HELD WORDS THEMSELVES, NOT ON THE QUEST'S TITLE. The
         first cut matched the title and failed honestly: the vote page for this
         very case is called THE ONE WRONG DETAIL and never says "The Meter
         Reader". Matching the actual spoken lines that the city is missing is
         both stricter and correct -- it proves the words held back are exactly
         the words he is being asked to vote on. */
      for (const stem of stale) {
        const disk = fs.readFileSync(path.join(ROOT, 'quests/bq', stem + '.bq'), 'utf8');
        const cityCopy = bag[stem] || '';
        const held = disk.split('\n')
          .filter(l => /^\s*@SAY /.test(l))
          .map(l => l.replace(/^\s*@SAY /, '').replace(/#\w+\s*$/, '').trim())
          .filter(l => l && cityCopy.indexOf(l) < 0);
        if (held.length && held.every(l => text.indexOf(l) >= 0)) excused.push(stem);
      }
    }
  } catch (e) {}
  const reallyStale = stale.filter(s => excused.indexOf(s) < 0);
  ok('and every one of them is the file on disk, byte for byte, unless he has an'
     + ' un-judged vote on it (' + excused.length + ' waiting on a vote'
     + (excused.length ? ': ' + excused.join(', ') : '') + ')'
     + (reallyStale.length ? ' -- STALE: ' + reallyStale.join(', ') : ''),
     reallyStale.length === 0);
  ok('and an excuse only exists while a real un-judged vote item does ('
     + pending.length + ' pending from this lane)',
     excused.length === 0 || pending.length > 0);
  ok('and the city invents no quest that is not a file somebody wrote',
     city.filter(k => disk.indexOf(k) < 0).length === 0);
}

/* ---- 2. AND THAT REACHES HIM WITHOUT ANYBODY RE-CUTTING THE DEMO -------- */
{
  const demo  = fs.existsSync(DEMO)  ? fs.readFileSync(DEMO, 'utf8')  : '';
  const alpha = fs.existsSync(ALPHA) ? fs.readFileSync(ALPHA, 'utf8') : '';
  ok('the demo build exists', demo.length > 0);
  ok('the alpha exists', alpha.length > 0);
  ok('the demo loads the walked city BY PATH, so the city IS the demo\'s quest text',
     /CITY_SRC\s*=\s*'BOHEMIA_CITY_WORLD\.html'/.test(demo));
  ok('so does the alpha', /CITY_SRC\s*=\s*'BOHEMIA_CITY_WORLD\.html'/.test(alpha));
  ok('and neither build carries its own second copy of the quest text -- one'
     + ' source, so nothing can go stale',
     demo.indexOf('DEMO_BQ=') < 0 && alpha.indexOf('DEMO_BQ=') < 0);
}

/* ---- 3. ONE DRIVER, NOT TWO -------------------------------------------- */
{
  ok('the day table and the main line are ONE track the driver reads',
     DQ.TRACK.length === DQ.DAYS.length + DQ.ACTS.length && DQ.TRACK.length === 10);
  const SRC = {};
  for (const sp of DQ.TRACK) SRC[sp.file] = fs.readFileSync(path.join(ROOT, 'quests/bq', sp.file + '.bq'), 'utf8');
  const R = DQ.make({ BQ, BQRuntime: RT, sources: SRC, loop: DL.make() });
  ok('every day 1..10 resolves to a spec through the ONE specForDay',
     DQ.TRACK.every((sp, i) => R.specForDay(i + 1) === sp));
  ok('and the main line is days 6..10, numbered with no gaps',
     DQ.ACTS.every((a, i) => a.day === i + 6 && a.main === true));
  ok('no two days anywhere are the same quest',
     new Set(DQ.TRACK.map(d => d.id)).size === 10);
  const mod = fs.readFileSync(path.join(ROOT, 'engine/bohemia_demoquests.js'), 'utf8');
  ok('the module exposes exactly one opener -- there is no second driver',
     (mod.match(/D\.open[A-Za-z]* = function/g) || []).join(',') === 'D.openDay = function');
  /* the city's inlined copy is the SAME BODY, or a fix in one is a fix the other
     silently drops (ENGINE SYNC LAW, and this module's own comment says so) */
  const cut = s => s.slice(s.indexOf('\n  var DAYS = ['), s.indexOf('\n  root.BohemiaDemoQuests = API;'));
  ok('the city\'s inlined driver is byte-identical to the engine module',
     cut(mod) === cut(cityText) && cut(mod).length > 5000);
}

/* ---- 4. NOT ONE INVENTED WORD ------------------------------------------ */
{
  const SRC = {};
  for (const sp of DQ.TRACK) SRC[sp.file] = fs.readFileSync(path.join(ROOT, 'quests/bq', sp.file + '.bq'), 'utf8');
  let buttons = 0; const bad = [];
  for (const sp of DQ.ACTS) {
    const raw = SRC[sp.file];
    const R = DQ.make({ BQ, BQRuntime: RT, sources: SRC, loop: DL.make() });
    const opened = R.openDay(sp.day);
    if (!opened) { bad.push(sp.file + ': would not open'); continue; }
    if (raw.indexOf(opened.brief) < 0) bad.push(sp.file + ': brief is not the quest\'s own line');
    /* walk it the way the world does until the card is up */
    for (let step = 0; step < 6 && !R.pending; step++) {
      R.event('enter_building', { district: 'd' + step, dark: true });
      if (!R.pending) R.event('enter_district', { district: 'new' + step });
    }
    if (!R.pending) { bad.push(sp.file + ': no resolution card'); continue; }
    for (const o of R.pending.options) {
      buttons++;
      if (!o.text || raw.indexOf(o.text) < 0) bad.push(sp.file + ' stage ' + o.stage);
    }
  }
  ok('every button on the main line is its .bq file\'s own line, verbatim ('
     + buttons + ' buttons)' + (bad.length ? ' -- ' + bad.join('; ') : ''),
     buttons >= 15 && bad.length === 0);
}

/* ---- 5. THE FIVE DEMO DAYS ARE UNTOUCHED ------------------------------- */
{
  ok('the demo still offers exactly its five days', DQ.DAYS.length === 5);
  ok('and day one is still the meter reader, in the shape it has always had',
     DQ.DAYS[0].file === 'S01_THE_METER_READER' && DQ.DAYS[0].open === 10
     && DQ.DAYS[0].choiceAt === 20 && DQ.DAYS[0].fail === 33);
  ok('and every one of the five still carries its author\'s own FAIL branch',
     DQ.DAYS.every(d => typeof d.fail === 'number'));

  /* THE COMPATIBILITY RULE, AS A CHECK AND NOT A COMMENT. `advance` became a
     LIST for M01, and every side quest still writes a bare object. If the two
     forms ever stopped meaning the same thing, days 1-5 would drift silently.
     Proved by playing the same day both ways and comparing everything the
     surface reads: the log, the objectives, the HUD, the next-step hint, the
     resolution card and the serialized state. (Measured the same way against
     the pre-change module the round this landed: days 1-5 identical across 25
     played sequences.) */
  const SRC = {};
  for (const sp of DQ.TRACK) SRC[sp.file] = fs.readFileSync(path.join(ROOT, 'quests/bq', sp.file + '.bq'), 'utf8');
  const play = (spec) => {
    const R = DQ.make({ BQ, BQRuntime: RT, sources: SRC, loop: DL.make() });
    R.specForDay = () => spec;
    const o = R.openDay(spec.day);
    const t = [o && o.log, JSON.stringify(o && o.objectives), R.hudLine(), R.nextStep()];
    R.event('enter_building', { district: 'a', dark: true });
    R.event('enter_district', { district: 'zz' });
    t.push(R.hudLine(), R.nextStep(), R.pending ? R.pending.options.map(x => x.stage).join('/') : '-');
    t.push(JSON.stringify(R.nightfall()), R.outcome(), JSON.stringify(R.serialize().state));
    return JSON.stringify(t);
  };
  const bare = DQ.DAYS[0];
  const asList = Object.assign({}, bare, { advance: [bare.advance] });
  ok('a bare `advance` and a one-step list mean exactly the same thing, so no'
     + ' side quest can drift when a main quest needs more beats',
     play(bare) === play(asList));
  ok('and that check is not vacuous -- a DIFFERENT list really does play differently',
     play(bare) !== play(Object.assign({}, bare,
       { advance: [{ stage: 20, on: 'enter_district', require: 'new' }] })));
}

/* ---- 6. NO INVENTED FAILURE ------------------------------------------- */
{
  const SRC = {};
  for (const sp of DQ.TRACK) SRC[sp.file] = fs.readFileSync(path.join(ROOT, 'quests/bq', sp.file + '.bq'), 'utf8');
  const noFail = DQ.ACTS.filter(a => a.fail == null).map(a => a.file);
  ok('three main quests genuinely have no FAIL stage in their source',
     noFail.length === 3 && noFail.every(stem => {
       const Q = BQ.parse(SRC[stem]);
       return (Q.stages || []).every(s => s.outcome !== 'FAIL');
     }));
  for (const sp of DQ.ACTS) {
    const R = DQ.make({ BQ, BQRuntime: RT, sources: SRC, loop: DL.make() });
    R.openDay(sp.day);
    const nf = R.nightfall();
    if (sp.fail == null) {
      ok(sp.file + ': nightfall invents nothing and the job stays open',
         nf === null && R.done() === false);
    } else {
      ok(sp.file + ': nightfall takes the author\'s own FAIL branch',
         !!nf && nf.stage === sp.fail && R.outcome() === 'FAIL');
    }
  }
}

/* ---- 7. THE REAL SURFACE ----------------------------------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available to open the main quest for real', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + CITY, { waitUntil: 'load' });
  await SETTLE(pg, 3000);

  const carried = await pg.evaluate(() => ({
    quests: Object.keys(DEMO_BQ).length,
    main: ['M01_THE_NIGHT_THEY_CAME', 'M02_THE_DINNER_AFTER', 'M03_THE_RIDGE',
           'M04_WHAT_THE_NEIGHBOUR_ASKS', 'M05_SOMETHING_IS_COMING_DOWN_THE_ROAD']
          .filter(k => !!DEMO_BQ[k]).length,
    track: BohemiaDemoQuests.TRACK.length,
    six: (DQ.specForDay(6) || {}).file
  }));
  ok('the city boots with ZERO page errors' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  ok('the loaded page carries all five main quests (' + carried.main + '/5 of '
     + carried.quests + ')', carried.main === 5);
  ok('and the live driver in the page reaches them',
     carried.track === 10 && carried.six === 'M01_THE_NIGHT_THEY_CAME');

  const played = await pg.evaluate(() => {
    DAY.day = 6; try { daySync(); } catch (e) {}
    showWake();
    const wake = document.getElementById('daycardIn').textContent;
    offerRing();
    const offer = OFFER ? { title: OFFER.title, text: OFFER.text } : null;
    offerAccept();
    /* A QUEST THE SURFACE DOES NOT CARRY LEAVES DQ.rt NULL, and a gate that
       THROWS there reports nothing about the rest of the row. Measured: cutting
       M01 out of DEMO_BQ crashed the first cut of this gate on `DQ.rt.state`,
       which is exactly the state the repo was in before this round -- so the
       stage reader answers null and every check below fails BY NAME instead. */
    const at = () => (DQ && DQ.rt && DQ.rt.state) ? DQ.rt.state.stage : null;
    const live = () => (DQ && DQ.rt)
      ? DQ.objectives().filter(o => o.status === 'active').map(o => o.text) : [];
    const first = live();
    dayEnteredBuilding('a house');            /* the same call inEnter makes */
    const s1 = at();
    const second = live();
    dayEnteredBuilding('the back of it');
    const s2 = at();
    return { wake: wake, offer: offer, first: first, s1: s1, second: second, s2: s2,
             /* read off the DRIVER, not the DOM: the card is dead by rule 19(a) */
             opts: (DQ && DQ.pending) ? DQ.pending.options.map(o => o.text) : [] };
  });
  ok('*** M01 OPENS ON THE REAL SURFACE, through the phone the run already built ***',
     !!played.offer && played.offer.title === 'The Night They Came');
  /* *** THE CARD IS GONE BY RULING, AND ASSERTING IT WOULD BE ASSERTING A DEAD
     SURFACE. *** Paolo 9/20, rule 19(a): nothing pops up, the wake card is dead.
     RUN removed it and six checks here went red -- correctly, because they were
     driving the pop-up rather than the quest. The row's claim was never "a card
     appears"; it is that the main line is INLINED and THE ONE DRIVER OPENS IT.
     So the same facts are read off the driver, which is where they actually
     live, and the wake card is no longer required to exist. */
  ok('and the words he is offered are the quest\'s OWN opening line, not a second copy',
     /Fireworks all night/.test(played.offer.text));
  ok('its first objective is live once he takes it',
     played.first.join('') === 'Sit down to dinner');
  ok('*** AND IT HAS THREE BEATS, WHICH NO SIDE QUEST HAS ***: walking in moves it'
     + ' to 20, and walking in again to 30',
     played.s1 === 20 && played.s2 === 30
     && played.second.join('') === 'Get to the back of the house');
  ok('the quest offers all three of its real branches', played.opts.length === 3);
  {
    const raw = fs.readFileSync(path.join(ROOT, 'quests/bq/M01_THE_NIGHT_THEY_CAME.bq'), 'utf8');
    ok('and every branch it offers is the .bq file\'s own line, verbatim',
       played.opts.length === 3 && played.opts.every(t => t && raw.indexOf(t) >= 0));
  }

  const resolved = await pg.evaluate(() => {
    /* RESOLVED THROUGH THE DRIVER, for the same reason: tapping a card that rule
       19(a) deleted would test nothing. DQ.resolve is what any surface calls. */
    const first = (DQ && DQ.pending) ? DQ.pending.options[0].stage : null;
    if (first != null) DQ.resolve(first);
    const st = (DQ && DQ.rt && DQ.rt.state) ? DQ.rt.state : { flags: {}, knows: {} };
    return { done: DQ.done(), outcome: DQ.outcome(), tag: DQ.tags()[0],
             flag: !!st.flags.act1_open_done,
             knows: !!st.knows.the_family_holds,
             cardGone: !document.querySelector('#daycard.on'),
             qline: document.getElementById('qline').textContent };
  });
  ok('tapping a branch resolves the real main quest',
     resolved.done === true && resolved.outcome === 'COMPLETE' && resolved.tag === 'quiet');
  ok('and ACT ONE\'s own verbs fired in the browser, which is what makes it a story'
     + ' and not a card', resolved.flag === true && resolved.knows === true);
  ok('no card is left on screen afterwards, because none may exist (rule 19a)',
     resolved.cardGone === true);

  await b.close();
  ok('no page error at any point in a played main quest' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);
  done();
})();
