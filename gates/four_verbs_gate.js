/* ============================================================================
   THE FOUR VERBS GATE (9/5/26, WORLD lane)
   BB-FOUR-VERBS-THREE-CURRENCIES, on Paolo 9/4: "battle brothers has 3-4
   currencies too... how they manage it is superb."

   WHAT IS SUPERB ABOUT IT, IN ONE SENTENCE: YOU NEVER SPEND A RESOURCE, WHAT YOU
   DID SPENDS IT. There is no screen where any of it is managed. So the thing this
   gate has to hold is not "the numbers are right" -- it is that each currency is
   spent by EXACTLY ONE VERB, that all four verbs really fire on the surface he
   walks, and that the card at the end of the day can NAME the verb rather than a
   category.

   MEASURED 9/4, BEFORE ANY OF IT EXISTED: the only debit in the whole game was
   buying at a market. Walking was free, fighting was free, holding ground was
   free, asking was free. That is the hole this closes and the state this gate
   stops us sliding back into.

   *** THE ONE THING THIS GATE REFUSES TO DO IS INVENT OWNERSHIP. *** night:power
   bills a lit circuit you HOLD, and nothing in this game stamps a circuit
   `player` yet -- that is BB-THE-NIGHT-EATS-POWER's ruling and BB-TURF's. So the
   real count is zero, and check 4c proves the mechanism by MUTATION instead: stamp
   one live circuit `player` in memory and the same call must bill it. A NEGATIVE
   RESULT IS A CLAIM ABOUT YOUR INSTRUMENT UNTIL YOU HAVE SHOWN THE INSTRUMENT
   COULD HAVE SEEN A POSITIVE ONE -- this lane has paid for that lesson four times
   and one of them was last round, when it reported "there is no fight hook on the
   walked surface" while the fight hook had been sitting there since 8/21 under a
   name the search did not try.

   node gates/four_verbs_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const PURSE = require(path.join(ROOT, 'engine/bohemia_purse.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('FOUR VERBS GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (one verb per currency · all four fire on the walked surface'
            + ' · the reckoning names the verb, never a category)');
  process.exit(fail ? 1 : 0);
};

/* ---- 1. the table is frozen, the way the currencies are ------------------ */
{
  const V = PURSE.VERBS;
  ok('the four verbs exist', V && Object.keys(V).length === 4);
  ok('and they are exactly the four he was shown',
     V && V['day:ate'] && V['fight:plate'] && V['night:power'] && V['ask:leaned']);
  /* ONE VERB PER RESOURCE IS THE WHOLE DESIGN. If two verbs ever drain the same
     currency you can no longer tell what took it, which is the single sentence
     that makes Battle Brothers' version work. resources carries two on purpose --
     the apple and the duct tape are one bucket by his own 7/26 ruling -- so the
     rule this holds is that ELECTRICITY and CLOUT each have exactly one. */
  const by = {};
  for (const k in V) (by[V[k].currency] = by[V[k].currency] || []).push(k);
  ok('electricity is spent by one verb and one verb only',
     (by.electricity || []).length === 1 && by.electricity[0] === 'night:power');
  ok('clout is spent by one verb and one verb only',
     (by.clout || []).length === 1 && by.clout[0] === 'ask:leaned');
  ok('and every verb says, in words, what took it',
     Object.keys(V).every(k => typeof V[k].about === 'string' && V[k].about.length > 8));

  /* A FIFTH VERB IS A DESIGN CHANGE AND DESIGN CHANGES ARE HIS. Same shape as
     the currency list refusing a fourth currency. */
  const p = PURSE.create();
  const r = PURSE.upkeep(p, 'walk:tired', 'x', 1);
  ok('A FIFTH VERB IS REFUSED, so one cannot appear quietly',
     r && r.applied === false && r.reason === 'NO_SUCH_VERB');

  /* THE AMOUNT CANNOT BE PASSED IN. EVERYTHING COSTS ONE (8/15) held as an API
     constraint rather than as a note: a caller that could pass 2 would be a door
     for a number nobody ruled. */
  ok('upkeep() takes no amount -- EVERYTHING COSTS ONE is in the signature',
     PURSE.upkeep.length <= 4);
  PURSE.credit(p, 'resources', 5, 'test:seed', null, 1);
  const d = PURSE.upkeep(p, 'day:ate', 'the day', 1);
  ok('a paid drain takes exactly one', d.applied && d.entry.amount === -1);
  ok('and it is a DRAIN -- a hard sink, which is the half that fights inflation',
     d.entry.kind === 'drain');
  ok('and the ledger reason IS the verb, so you always know what took it',
     d.entry.reason === 'day:ate');

  /* RUNNING OUT IS NOT AN ERROR, IT IS THE LOUDEST THING THAT CAN HAPPEN. */
  const empty = PURSE.create();
  const s = PURSE.upkeep(empty, 'ask:leaned', 'water', 1);
  ok('and with nothing left it REFUSES and says so, naming the currency',
     s.applied === false && s.reason === 'INSUFFICIENT' && s.currency === 'clout');
}

/* ---- 2. the wiring is where it cannot be wiped --------------------------- */
{
  const city = fs.readFileSync(CITY, 'utf8');
  ok('the walked surface posts day:ate at nightfall', /upkeepPost\('day:ate'/.test(city));
  ok('and fight:plate when the fight comes home',   /upkeepPost\('fight:plate'/.test(city));
  ok('and ask:leaned when he leans on somebody',    /upkeepPost\('ask:leaned'/.test(city));
  ok('and night:power for the circuits he holds',   /upkeepPost\('night:power'/.test(city));

  /* THE ASK BLOCK IS REGENERATED BY ITS OWN PATCHER, so an edit made only in the
     city is an edit the next run of that tool deletes. This is the third time
     this repo has lost work to a generated block, so it is checked rather than
     remembered. */
  const patch = fs.readFileSync(path.join(ROOT, 'tools/bohemia_city_asking_patch.py'), 'utf8');
  ok('AND THE ASK DRAIN LIVES IN THE GENERATOR, not only in the generated copy',
     /upkeepPost\('ask:leaned'/.test(patch));

  /* THE DAY'S SPEND LIST IS EMPTIED WHERE IT IS FILLED, NOT WHERE IT IS READ.
     It used to be cleared at nightfall one line above the first drain, which was
     silently correct while nightfall was the only writer and wrong the moment
     asking and fighting started posting at 11am. */
  ok('the day\'s spend list is cleared at the START of the day',
     /function showWake\(\)\{[\s\S]{0,600}?SPENT_TODAY=\[\];/.test(city));
  ok('and NOT at nightfall, where it would eat the day\'s own drains',
     !/function onNightfall\(\)\{[\s\S]{0,1200}?SPENT_TODAY=\[\];/.test(city));

  /* NOBODY INVENTED OWNERSHIP TO MAKE A DRAIN FIRE. */
  ok('nothing on the walked surface stamps a circuit `player`',
     (city.match(/owner\s*[:=]\s*'player'/g) || []).length === 0);
}

/* ---- 3 & 4. on the real surface, driven the way a person drives it ------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 180000 });
  for (let i = 0; i < 200; i++) { if (await pg.$('#daycardIn .dcgo')) break; await SETTLE(pg, 200); }
  await pg.$eval('#daycardIn .dcgo', el => el.click());
  await SETTLE(pg, 250);

  /* THE HONEST DAY FIRST: take the job, finish it, sleep. This is what he plays,
     and it is the one that must not be a wall of red. */
  await pg.evaluate(() => {
    offerAccept();
    DQ.event('enter_building', { district: 'suburb', dark: true });
    DQ.resolve(31);
  });
  await SETTLE(pg, 200);
  const real = await pg.evaluate(() => {
    advance(20 * 60);
    return { held: window.__HELD_CIRCUITS,
             spent: SPENT_TODAY.map(s => s.verb + (s.paid ? ':PAID' : ':SHORT')),
             bal: purseBalances(),
             card: (document.getElementById('daycardIn') || {}).textContent || '' };
  });
  ok('A DAY OF WORK STILL PAYS ONE BATTERY (the round before this one)',
     real.bal.electricity === 1);
  ok('AND THE DAY TAKES SOMETHING BACK -- the day eats food, every night',
     real.spent.indexOf('day:ate:SHORT') >= 0 || real.spent.indexOf('day:ate:PAID') >= 0);
  ok('THE RECKONING NAMES THE VERB, not a category ("-1 food" would be the failure)',
     /the people who depend on you ate/.test(real.card) && !/-1 food/.test(real.card));
  ok('and an ordinary night is ONE line about what it cost, not a wall',
     real.spent.length === 1);
  ok('he holds no lit circuit, so the night bills him for none of them',
     real.held === 0);

  /* NOW THE OTHER THREE, EACH THROUGH THE HOOK THE GAME ITSELF USES. */
  const all = await pg.evaluate(() => {
    /* a new day, so the list is the day's own */
    document.querySelector('#daycardIn .dcgo').click();
    return new Promise(res => setTimeout(() => {
      const R = {};
      /* ASK -- the card's own function, with a person off the street. */
      askAbout({ key: 'gate:1', archetype: 'worker' }, 'gate:1', 'water');
      R.afterAsk = SPENT_TODAY.map(s => s.verb);
      /* FIGHT -- the shell's own message, byte for byte what combat posts. */
      window.postMessage({ type: 'BOHEMIA_CITY_COMBAT_END',
                           outcome: { victory: true }, at: 'the door' }, '*');
      setTimeout(() => {
        R.afterFight = SPENT_TODAY.map(s => s.verb);
        /* POWER -- the mutation. Nothing is stamped `player`, so the checker has
           to be shown it could have seen a positive. */
        const _at = POWER.at;
        let m = null;
        for (let y = 0; y < om.n && !m; y++) for (let x = 0; x < om.n && !m; x++) {
          const p = _at(x, y); if (p && p.live) m = [x, y];
        }
        R.zeroBefore = heldCircuits().length;
        POWER.at = (x, y) => (m && x === m[0] && y === m[1])
          ? { live: true, owner: 'player' } : _at(x, y);
        R.oneAfter = heldCircuits().length;
        advance(20 * 60);
        POWER.at = _at;
        R.spent = SPENT_TODAY.map(s => s.verb);
        R.card = (document.getElementById('daycardIn') || {}).textContent || '';
        res(R);
      }, 250);
    }, 400));
  });

  ok('ASKING EATS CLOUT -- leaning on somebody posts, on the card he already opens',
     all.afterAsk.indexOf('ask:leaned') >= 0);
  ok('THE FIGHT EATS TAPE -- and the hook is the one combat really sends',
     all.afterFight.indexOf('fight:plate') >= 0);
  ok('THE MUTATION: with nothing stamped `player` the night bills nothing',
     all.zeroBefore === 0);
  ok('AND THE SAME CALL BILLS A CIRCUIT THE MOMENT ONE IS HIS -- the instrument'
     + ' could have seen a positive', all.oneAfter === 1);
  ok('SO ALL FOUR VERBS POST A DRAIN ON THE WALKED SURFACE, which is the row\'s'
     + ' own ship test',
     ['day:ate', 'fight:plate', 'night:power', 'ask:leaned']
       .every(v => all.spent.indexOf(v) >= 0));
  ok('AND THE RECKONING CAN NAME EVERY ONE OF THEM',
     [/the people who depend on you ate/, /the plate you wore at the bell is spent/,
      /every lit circuit you hold burned one/, /you leaned on somebody/]
       .every(re => re.test(all.card)));
  /* A VERB THAT FIRES SIX TIMES IS ONE LINE WITH A COUNT, NOT SIX LINES. */
  ok('and a verb that fired more than once is grouped, never repeated down the card',
     (all.card.match(/you leaned on somebody/g) || []).length === 1);

  await b.close();
  ok('no page error across a day that spent all four' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);
  done();
})();
