/* ============================================================================
   THE DAY PAYS GATE (8/12/26)

   The demo cut, ruled 8/4, row 3: "THEN ONE GOOD DAY: wake -> 2-3 quests -> walk
   finished-looking streets -> one talk, one dial fight -> GET PAID -> spend at a
   trading hub -> camp -> sleep-save holds."

   GET PAID DID NOT HAPPEN, and not because it was unbuilt. MEASURED 8/12:
   engine/bohemia_payday.js exports questEvent, payForQuest, hubs, reachable,
   nearestHub, shelf, price, buy and dayReport, and every one of them was
   referenced EXACTLY ZERO times outside its own module. The whole "get paid,
   spend at a hub" half of the demo cut sat in the build, dormant, since 8/11.

   AND ONE PIECE REALLY WAS MISSING. Paolo ruled 8/11, asked what a day's work
   should pay: "Whatever currency the quest decida to give." The bridge was built
   the same day to honour it -- questReward() reads questState.reward -- and THE
   .bq LANGUAGE HAD NO VERB TO SAY IT. The ruling was made, the bridge was built,
   and the sentence could not be written. Now it can: `@DO pay <currency> <n>`, on
   the stage, so the reward belongs to the OUTCOME.

   WHAT THIS GATE HOLDS:
     1. a quest can DECLARE what it pays, and that declaration reaches the purse
     2. a quest that declares NOTHING gets the honest refusal, never a number
        somebody invented -- amounts are CONTENTS (ALWAYS MAKE AN ATTEMPT, 8/11:
        "numbers, dials, rates, prices" wait for him)
     3. THE RUN ACTUALLY CALLS IT. This is the assertion that would have caught
        the original defect, and it is the whole reason this gate exists.
     4. the run SHOWS the answer, including the refusal, naming the quest
     5. a day's pay rides the save, because pay that dies with the tab is not pay
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const BQ = require(path.join(ROOT, 'engine/bohemia_bq.js'));
const RT = require(path.join(ROOT, 'engine/bohemia_quest_runtime.js'));
const PURSE = require(path.join(ROOT, 'engine/bohemia_purse.js'));
const PAYDAY = require(path.join(ROOT, 'engine/bohemia_payday.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('DAY PAYS GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* A quest written HERE, in the gate, purely to exercise the verb. It is not
   content and it never ships: the amounts in it are test fixtures, and the real
   ones live in the .bq files where Paolo put them. */
const DECLARES = ['@QUEST t_pay  A Job That Says What It Pays', '@ACT 1',
  '@STAGE 10', '  @LOG start',
  '@STAGE 30 COMPLETE #quiet', '  @LOG done',
  '  @DO pay resources 3', '  @DO pay clout 1'].join('\n');

/* ---- 1. the verb, and the declaration reaching the purse ---------------- */
{
  const Q = BQ.parse(DECLARES);
  const rt = new RT.Runtime(Q, null, { bonds: {} });
  rt.start(10); rt.setStage(30);
  ok('a quest can DECLARE what it pays (@DO pay)',
     rt.state.reward && rt.state.reward.resources === 3 && rt.state.reward.clout === 1);

  const purse = PURSE.create();
  const r = PAYDAY.payForQuest(purse, rt.state, 1, 't_pay', Q);
  ok('and the declaration REACHES THE PURSE', r && r.applied === true && r.source === 'quest');
  const bal = PURSE.balances(purse);
  ok('the balance really moved (' + JSON.stringify(bal) + ')',
     bal.resources === 3 && bal.clout === 1);

  /* it survives a save, because the runtime's state is the save */
  const rt2 = RT.Runtime.load(Q, rt.serialize(), { bonds: {} });
  ok('the reward rides the quest\'s own serialized state',
     rt2.state.reward && rt2.state.reward.resources === 3);
}

/* ---- 2. THE REFUSAL, which is the point and not a bug ------------------ */
{
  const Q = BQ.parse(fs.readFileSync(path.join(ROOT, 'quests/bq/S01_THE_METER_READER.bq'), 'utf8'));
  const rt = new RT.Runtime(Q, null, { bonds: {} });
  rt.start(10); rt.setStage(31);
  const purse = PURSE.create();
  const r = PAYDAY.payForQuest(purse, rt.state, 1, 'bq_meter_reader', Q);
  ok('a quest that declares NOTHING is refused, not guessed at',
     r && r.applied === false && r.reason === 'NO_RULING');
  ok('and nothing is credited on a refusal',
     PURSE.balances(purse).resources === 0 && PURSE.balances(purse).clout === 0);
  ok('the refusal says whose ruling it is waiting on',
     typeof r.about === 'string' && /Paolo/.test(r.about));
}

/* ---- 3. THE RUN ACTUALLY CALLS IT -------------------------------------- */
{
  const c = fs.readFileSync(CITY, 'utf8');
  ok('the run has a purse and pays into it', c.indexOf('__THE_DAY_PAYS__') >= 0);
  /* the assertion that would have caught the original defect: the payday bridge
     was exported and called from NOWHERE for a day. */
  ok('BohemiaPayday.payForQuest is CALLED by the run, not merely present',
     /BohemiaPayday\.payForQuest\(/.test(c));
  ok('and the purse rides the save', /purse:\(function\(\)\{ try\{ return BohemiaPurse\.save/.test(c));
}

/* ---- 4. on the real surface -------------------------------------------- */
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
  await pg.$eval('#daycardIn .dcgo', el => el.click());
  await SETTLE(pg, 250);

  const day = await pg.evaluate(() => {
    offerAccept();
    DQ.event('enter_building', { district: 'suburb', dark: true });
    DQ.resolve(31);
    advance(20 * 60);                                   /* nightfall closes the day */
    return { paid: window.__PAID || 0, refused: window.__PAY_REFUSED || 0,
             reason: PAY_REFUSED, bal: purseBalances(),
             card: (document.getElementById('daycardIn') || {}).textContent || '' };
  });
  ok('the run has a live purse', !!day.bal && typeof day.bal.resources === 'number');
  ok('FINISHING A JOB REACHES THE PURSE -- the bridge that was never called is called'
     + ' now (' + (day.paid ? 'paid' : 'refused: ' + day.reason) + ')',
     day.paid >= 1 || day.refused >= 1);
  ok('and with nothing ruled it pays NOTHING rather than inventing a number',
     day.bal.resources === 0 && day.bal.clout === 0 && day.reason === 'NO_RULING');
  ok('THE RECKONING SAYS SO, and names the job it is waiting on',
     /nobody has ruled what this pays/i.test(day.card) && /Meter Reader/.test(day.card));

  /* and the phone carries the balance, so a purse is a thing he can look at */
  await pg.$eval('#daycardIn .dcgo', el => el.click());       /* SLEEP -> DAY 2 */
  await SETTLE(pg, 400);
  const st = await pg.evaluate(() => {
    const s = phoneState();
    return { purse: s.purse, hasPurse: !!s.purse };
  });
  ok('the phone is told the balance', st.hasPurse === true);

  await b.close();
  ok('no page error across a paid day' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);
  done();
})();
