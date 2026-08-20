/* ============================================================================
   CONTINUITY GATE (8/12/26) — yesterday is still true today.

   Paolo: "we are trying tk create the best funnest deepest videogame ever."

   DEPTH IS NOT MORE SURFACE. It is yesterday still being true today. So this was
   measured across a real day boundary in the shipped build BEFORE anything was
   built:

       day 1 ends   TRADES +8      (he handed the tap to the trades, in daylight)
       day 2 opens  {}             gone

   A BOND survived the night. Everything he did to a FACTION was forgotten by
   morning, in a valley whose entire spine is factions. That was not a missing
   feature -- it was half a wiring job somebody stopped in the middle:

       Paolo 8/7, ruling A, quoted in the quest runtime's own source:
       "a bond built in one quest opens a door in another. Continuity is the
        dynasty."

   Bonds went into the shared ledger that day; faction standing and posture did
   not, so they lived only in the quest's own state, and a quest's state dies with
   the quest.

   WHAT THIS GATE HOLDS:
     1. STANDING SURVIVES THE NIGHT -- the exact measurement that was red
     2. SO DOES POSTURE, and bonds still do (no regression on the half that worked)
     3. THE REASON IS KEPT, and it is the quest's OWN @LOG line, verbatim against
        quests/bq/*.bq -- I show his prose, I never write prose about it
     4. IT IS VISIBLE. A ledger nobody can read is bookkeeping, not depth: the
        phone must SHOW day 1's move on day 2
     5. AN EMPTY LEDGER IS NOT AN ERROR, it is day one, and it says so
     6. A RUNTIME WITH NO SHARED LEDGER IS BIT-FOR-BIT UNCHANGED -- the engine's
        own written promise, which this change must not break
     7. THE BUZZ IS HIS SOUND. phone_buzz.2 and .4 are UP in his 8/9 verdict, and
        the city asks the ALPHA to play it through window.playSFX -- the game's own
        call, never a private preview path.
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const BQ = require(path.join(ROOT, 'engine/bohemia_bq.js'));
const RT = require(path.join(ROOT, 'engine/bohemia_quest_runtime.js'));
const DL = require(path.join(ROOT, 'engine/bohemia_dayloop.js'));
const DQ = require(path.join(ROOT, 'engine/bohemia_demoquests.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('CONTINUITY GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

const FILES = ['S01_THE_METER_READER', 'S09_THE_BACK_DOOR', 'S02_THE_SAME_CRATE_TWICE'];
const SRC = {};
for (const f of FILES) SRC[f] = fs.readFileSync(path.join(ROOT, 'quests/bq', f + '.bq'), 'utf8');

/* ---- 1. the measurement that was red ------------------------------------ */
{
  const L = DL.make(); L.wake();
  const Q = DQ.make({ BQ, BQRuntime: RT, sources: SRC, loop: L });
  Q.openDay(1);
  Q.event('enter_building', { district: 'suburb', dark: true });
  Q.resolve(31);                                  /* #notable: @DO faction TRADES +8 */
  const d1 = Q.standing();
  ok('day 1 moves a faction (TRADES ' + ((d1.faction[0] || {}).n) + ')',
     d1.faction.length === 1 && d1.faction[0].who === 'TRADES' && d1.faction[0].n === 8);

  L.nextDay(); Q.openDay(2);
  const d2 = Q.standing();
  ok('STANDING SURVIVES THE NIGHT -- day 2 still knows what he did to the trades',
     d2.faction.length === 1 && d2.faction[0].who === 'TRADES' && d2.faction[0].n === 8);
  ok('and the live runtime can read it back', Q.rt.standingWith('TRADES') === 8);

  /* the reason, in the quest's own words */
  const stage31 = BQ.parse(SRC.S01_THE_METER_READER).stages.filter(s => s.n === 31)[0];
  const why = (d2.log[0] || {}).why;
  ok('THE REASON IS KEPT, and it is the quest\'s OWN line, verbatim out of the .bq',
     why === stage31.log && SRC.S01_THE_METER_READER.indexOf(why) >= 0);
  ok('and the move names the quest it came from',
     (d2.log[0] || {}).quest === 'The Meter Reader');
}

/* ---- 2. posture and bonds ------------------------------------------------ */
{
  const L = DL.make(); L.wake();
  const Q = DQ.make({ BQ, BQRuntime: RT, sources: SRC, loop: L });
  Q.openDay(1);
  Q.event('enter_building', { district: 'suburb', dark: true });
  Q.resolve(32);                                  /* #reckless: faction_posture NETWORK +1 */
  L.nextDay(); Q.openDay(2);
  const s = Q.standing();
  ok('POSTURE SURVIVES TOO -- somebody is watching you the next morning',
     s.posture.length === 1 && s.posture[0].who === 'NETWORK' && s.posture[0].n === 1);

  Q.resolve(20);                                  /* back door #quiet: bond neighbor +20 */
  L.nextDay(); Q.openDay(3);
  const s3 = Q.standing();
  ok('AND BONDS STILL CARRY -- the half that already worked is not regressed',
     s3.bonds.length === 1 && s3.bonds[0].n === 20);
}

/* ---- 3. the engine's own promise: no ledger = unchanged ----------------- */
{
  const Q = BQ.parse(SRC.S01_THE_METER_READER);
  const bare = new RT.Runtime(Q, null, null);     /* no shared ledger at all */
  bare.start(10);
  let threw = null;
  try { bare.setStage(31); } catch (e) { threw = String(e.message); }
  ok('A RUNTIME WITH NO SHARED LEDGER STILL RUNS -- the engine\'s written promise'
     + (threw ? ' -- threw: ' + threw : ''), threw === null);
  ok('and it still writes the quest\'s own state', bare.state.faction.TRADES === 8);
  ok('with nothing to remember it by', bare.standingWith('TRADES') === 8);
}

/* ---- 4. the buzz is HIS sound, played by the game's own call ------------ */
{
  const c = fs.readFileSync(CITY, 'utf8');
  const a = fs.readFileSync(ALPHA, 'utf8');
  ok('the city asks for a buzz when a job comes in', c.indexOf('__THE_PHONE_BUZZES__') >= 0
     && /bohemiaCitySfx/.test(c));
  ok('the ALPHA plays it through window.playSFX -- the game\'s own call, not a'
     + ' private preview path', /if\(window\.playSFX\) window\.playSFX/.test(a));

  /* and it is a sound he actually approved */
  const verdict = fs.readFileSync(path.join(ROOT, 'records/BOHEMIA_SFX_VERDICT_8_9_26.txt'), 'utf8');
  const ups = (verdict.match(/^\s*UP\s+phone_buzz\.\d+/gm) || []).length;
  ok('phone_buzz is a sound HE PUT UP (' + ups + ' approved candidates in his 8/9'
     + ' verdict) -- approved-but-unused is a defect, an unapproved sound is worse',
     ups >= 1);
}

/* ---- 5. IT IS VISIBLE, on the surface he taps --------------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 120000 });
  for (let i = 0; i < 120; i++) { if (await pg.$('#daycardIn .dcgo')) break; await SETTLE(pg, 200); }

  ok('the phone BUZZES when the job comes in',
     (await pg.evaluate(() => window.__BUZZED || 0)) >= 1);

  await pg.$eval('#daycardIn .dcgo', el => el.click());
  await SETTLE(pg, 250);

  /* day one: nobody knows you */
  const day1phone = await (async () => {
    await pg.$eval('#phonebtn', el => el.click());
    let fr = null;
    for (let i = 0; i < 80; i++) {
      fr = pg.frames().find(f => /CURRENT_SLICE/.test(f.url()));
      if (fr) { try { if (await fr.evaluate(() => typeof LIVE !== 'undefined')) break; } catch (e) {} }
      await SETTLE(pg, 500);
    }
    await SETTLE(pg, 1200);
    const t = fr ? await fr.evaluate(() =>
      [...document.querySelectorAll('.live-strip')].map(x => x.textContent).join(' | ')) : '';
    await pg.$eval('#phoneclose', el => el.click());
    await SETTLE(pg, 200);
    return { fr, t };
  })();
  ok('AN EMPTY LEDGER IS NOT AN ERROR, IT IS DAY ONE, and it says so',
     /Nobody here knows you yet/i.test(day1phone.t));

  /* live the day the notable way, then sleep */
  await pg.evaluate(() => {
    offerAccept();
    DQ.event('enter_building', { district: 'suburb', dark: true });
    DQ.resolve(31);
    advance(20 * 60);
  });
  await SETTLE(pg, 400);
  await pg.$eval('#daycardIn .dcgo', el => el.click());        /* SLEEP -> DAY 2 */
  await SETTLE(pg, 500);
  const day = await pg.evaluate(() => DAY.day);
  ok('day 2 begins', day === 2);
  await pg.$eval('#daycardIn .dcgo', el => el.click());        /* GET UP */
  await SETTLE(pg, 250);

  await pg.$eval('#phonebtn', el => el.click());
  await SETTLE(pg, 1500);
  const fr2 = pg.frames().find(f => /CURRENT_SLICE/.test(f.url()));
  const seen = fr2 ? await fr2.evaluate(() => ({
    text: [...document.querySelectorAll('.live-strip')].map(x => x.textContent).join(' | '),
    rows: [...document.querySelectorAll('.st-row')].map(x => x.textContent)
  })) : { text: '', rows: [] };

  ok('THE PHONE REMEMBERS ON DAY 2 -- what he did yesterday is on his phone this'
     + ' morning (' + JSON.stringify(seen.rows) + ')',
     seen.rows.some(r => /TRADES/.test(r) && /\+8/.test(r)));
  ok('and it says WHY, in the quest\'s own words',
     /Handed the tap to the trades/.test(seen.text));
  ok('under a heading that means something', /WHAT THE VALLEY REMEMBERS/i.test(seen.text));

  await b.close();
  ok('no page error across two lived days' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);
  done();
})();
