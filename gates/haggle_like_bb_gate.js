/* ============================================================================
   HAGGLE LIKE BB GATE (9/22/26, QUESTS lane) -- row [haggle like bb],
   ARGUING-THE-PRICE-THE-BATTLE-BROTHERS-WAY.

   PAOLO 9/22, voting ARGUING THE PRICE up: "do it the same way Battle Brothers
   does it: push too much hurts reputation and shit. Nothing less than Battle
   Brothers."

   MEASURED BEFORE A LINE WAS WRITTEN, AND IT HURT NOTHING AT ALL:
     the mark's delta                        0
     weight for 'pushed_the_price'           NONE (forceOf: unruled = weightless)
     a row in the reaction table             NONE (remembered and mute)
     deeds ever delivered by ctHaggleMark    ZERO -- `MINDS` IS UNDEFINED in the
                                             city and every call threw inside its
                                             own catch and returned null
   Three of those four are invisible from the outside, which is why this gate
   asserts the CHAIN and not the pieces.

   WHAT IT HOLDS:
   1. THE COST IS HIS, DERIVED, NEVER TYPED. It is the median of HIS OWN negative
      #reckless deltas across the corpus he authored. No corpus, no punishment.
   2. THE WEIGHT RIDES HIS OWN DIVISOR, the one loadCorpus computes off the same
      corpus, so the push is graded against his authored deeds.
   3. IT SURVIVES THE ORDER THIS FILE IS ASSEMBLED IN. Both corpus-load calls run
      BEFORE the haggle module is inlined, so the first cut derived nothing at
      boot and worked perfectly whenever a probe asked for it -- because asking
      created it. That is how this class of bug hides.
   4. A DEED WITH NO OUTFIT REACHES PEOPLE. publish() filters witnesses through
      sameFaction, which is FALSE when either side is null, so a faction-less
      mark reached nobody. It goes through witness() underneath, with the same
      clout grading.
   5. AND IT REALLY MOVES AN OPINION, on the alpha, through the one driver.
   6. AND SOMEBODY HAS WORDS FOR IT, both as a sighting and as hearsay.
   ========================================================================== */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..');
const H = require(path.join(ROOT, 'engine/bohemia_haggle.js'));
const D = require(path.join(ROOT, 'engine/bohemia_deeds.js'));
const BQ = require(path.join(ROOT, 'engine/bohemia_bq.js'));
const DRIVE = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

let pass = 0, fail = 0;
const ok = (n, c, note) => { if (c) pass++; else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); } };
const done = () => { console.log('HAGGLE LIKE BB GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* his corpus, read the same way the city reads it */
let corpus = [];
for (const f of fs.readdirSync(path.join(ROOT, 'quests/bq')).filter(f => f.endsWith('.bq'))) {
  try { corpus = corpus.concat(D.scanQuest(fs.readFileSync(path.join(ROOT, 'quests/bq', f), 'utf8'), f.replace(/\.bq$/, ''))); }
  catch (e) {}
}

/* ---- 1. THE COST IS HIS, DERIVED -------------------------------------- */
{
  const cost = H.pushCost(corpus);
  ok('his corpus is really there to derive from (' + corpus.length + ' deeds)', corpus.length > 50);
  ok('*** pushing has a cost, derived from HIS OWN reckless deeds (' + cost + ') ***',
     typeof cost === 'number' && cost < 0);
  /* IT IS THE MEDIAN OF HIS NEGATIVE RECKLESS DELTAS, recomputed here off the
     same corpus rather than compared against a number typed in this gate. */
  const neg = corpus.filter(d => d.clout === 'reckless' && d.delta < 0).map(d => d.delta).sort((a, b) => a - b);
  ok('and it is exactly the median of those, not a number anybody chose',
     cost === neg[Math.floor(neg.length / 2)], 'n=' + neg.length);
  ok('with NO corpus there is NO punishment -- a table ships empty without a ruling',
     H.pushCost([]) === null && H.pushCost(null) === null);
  /* THE MODULE MUST NOT CARRY THE NUMBER. */
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_haggle.js'), 'utf8');
  const body = src.replace(/\/\*[\s\S]*?\*\//g, '');
  ok('*** and the number is NOT written into the module ***',
     body.indexOf(String(cost)) < 0);
}

/* ---- 2. IT REACHES THE MARK ------------------------------------------- */
{
  const Q = BQ.parse(fs.readFileSync(path.join(ROOT, 'quests/bq/S01_THE_METER_READER.bq'), 'utf8'));
  const cost = H.pushCost(corpus);
  let t = H.open(Q, cost);
  ok('a fresh negotiation carries the stake from the start', t.pushCost === cost);
  for (let i = 0; i < 2; i++) { const r = (H.asks(t) || [])[0]; t = H.ask(t, r ? r.id : 'x'); }
  ok('he is warned before the ask that costs him', !!H.warning(t));
  const before = t;
  t = H.ask(t, (H.asks(t) || [{}])[0].id || 'x');
  ok('the ask after the warning takes the job away', t.withdrawn === true);
  ok('*** and it leaves a mark that really costs ('
     + (t.mark && t.mark.delta) + ') ***', !!t.mark && t.mark.delta === cost);
  ok('the mark is a reckless act, which is what sets how far it travels',
     t.mark.clout === 'reckless');
  /* UNRULED STAYS WEIGHTLESS: a surface that passes no cost cannot invent one. */
  let u = H.open(Q);
  for (let i = 0; i < 3; i++) { const r = (H.asks(u) || [])[0]; u = H.ask(u, r ? r.id : 'x'); }
  ok('a negotiation opened with no cost still marks NOTHING', u.mark.delta === 0);
}

/* ---- 3. THE CITY: ORDER, REACH, OPINION, AND A VOICE ------------------- */
(async () => {
  let d;
  try { d = await DRIVE.open({ alpha: true }); }
  catch (e) { ok('the one driver opens the alpha', false); done(); }
  for (let i = 0; i < 6; i++) {
    try {
      await d.fr.evaluate(async (k) => {
        const p = document.querySelectorAll('#pad .pb')[k % 8];
        if (p) { p.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
          await new Promise(r => setTimeout(r, 60));
          p.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })); }
      }, i);
    } catch (e) {}
    await new Promise(r => setTimeout(r, 250));
  }

  const live = await d.fr.evaluate(() => {
    const o = {};
    o.costAtBoot = (typeof CT_PUSH_COST === 'number') ? CT_PUSH_COST : null;
    o.weight = (typeof BohemiaStanding !== 'undefined') ? BohemiaStanding.DEED_WEIGHT['pushed_the_price'] : undefined;
    o.divisor = (() => { const s = []; for (const k in DEMO_BQ) s.push({ id: k, src: DEMO_BQ[k] });
                         const r = BohemiaDeeds.loadCorpus(s); return r && r.divisor; })();
    o.hasReactRow = (typeof CT_REACT !== 'undefined') && !!CT_REACT['pushed_the_price'];
    o.saw = (typeof ctReactLine === 'function') ? ctReactLine('pushed_the_price', false, 'saw') : null;
    o.heard = (typeof ctReactLine === 'function') ? ctReactLine('pushed_the_price', true, 'saw') : null;
    o.mindsUndefined = (typeof MINDS === 'undefined');
    /* push a real negotiation past the warning, on the real surface */
    const H2 = BohemiaHaggle;
    let t = H2.open(BQ.parse(DEMO_BQ['S01_THE_METER_READER']), ctPushCostReady());
    for (let i = 0; i < 3; i++) { const r = (H2.asks(t) || [])[0]; t = H2.ask(t, r ? r.id : 'x'); }
    o.delta = t.mark && t.mark.delta;
    const opinions = () => ctMindsList().map(m => BohemiaStanding.opinionOf(m, '@', ctMinuteNow()));
    o.before = opinions();
    const pub = ctHaggleMark(t.mark);
    o.witnesses = pub ? pub.witnesses : 0;
    o.after = opinions();
    return o;
  });

  ok('*** the cost is derived AT BOOT, not only when something asks for it ***'
     + ' (' + live.costAtBoot + ')', typeof live.costAtBoot === 'number' && live.costAtBoot < 0);
  ok('and the weight rides his own corpus divisor (' + live.weight + ' = '
     + live.costAtBoot + '/' + live.divisor + ')',
     Math.abs(live.weight - (live.costAtBoot / live.divisor)) < 1e-9);
  ok('the negotiation on the real surface marks his real cost', live.delta === live.costAtBoot);
  ok('*** a faction-less mark REACHES people (' + live.witnesses + ' saw it) ***',
     live.witnesses > 0);
  {
    const moved = live.after.filter((v, i) => v !== live.before[i]);
    ok('*** AND PUSHING TOO FAR REALLY COSTS REPUTATION *** (' + moved.join(', ') + ')',
       moved.length > 0 && moved.every(v => v < 0));
  }
  ok('somebody has words for it when they saw it ("' + live.saw + '")',
     !!live.saw && live.saw.length > 10);
  ok('and different words when they only heard about it', !!live.heard && live.heard !== live.saw);
  /* THE BUG THAT MADE ALL OF THIS INERT, kept as a check so it cannot return. */
  ok('*** and nothing publishes into the undefined `MINDS` any more ***',
     live.mindsUndefined === true
     && fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8')
          .indexOf('BohemiaDeeds.publish(MINDS') < 0);
  ok('no page error in the walk' + (d.errs.length ? ' -- ' + d.errs[0] : ''), d.errs.length === 0);
  console.log('  MEASURED: cost ' + live.costAtBoot + ' · weight ' + live.weight
              + ' · ' + live.witnesses + ' witness(es) · opinions '
              + JSON.stringify(live.before) + ' -> ' + JSON.stringify(live.after));
  await d.close();
  done();
})();
