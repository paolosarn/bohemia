/* ============================================================================
   RICE CLOCK GATE (9/12/26, WORLD lane) -- board row [rice clock] /
   THE-BAG-OF-RICE-IS-THE-TUTORIAL.

   THE MANAGER'S OWN CALL (9/5): "everything costs one and a day of work pays one;
   the one thing you must buy every day is the whole economy in miniature. Hunger
   is the clock: a day without the bag shows on the body and the purse, and the
   first purchase of the game is rice, taught by wanting it, not by a text box."

   *** THE BUG UNDERNEATH IT, AND IT WAS THE WHOLE LOOP. *** MEASURED ON THE WALKED
   SURFACE with five batteries in the purse:
       buy food        applied:true, paid:1      electricity 5 -> 4
       resources                                 0 -> 0
       the day eats    day:ate REFUSED, INSUFFICIENT
   You bought food, the food did not exist, and then you starved. buy() debited the
   battery and credited NOTHING, reading shopping as the hard sink. The four-verbs
   law already says where the sink belongs -- each resource is spent by exactly one
   verb, and the verb that spends resources is day:ate. SHOPPING MOVES VALUE, EATING
   DESTROYS IT. convert() had been in the purse since 7/31 with zero callers.

   AND HUNGER IS COUNTED AND SAID, NEVER SUFFERED. NO DAMAGE BEFORE THE DIAL is
   locked and the day loop wrote the same sentence about this same moment: "the
   reckoning REPORTS; it does not starve you."

   node gates/rice_clock_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const P = require(path.join(ROOT, 'engine/bohemia_purse.js'));
const PD = require(path.join(ROOT, 'engine/bohemia_payday.js'));
const H = require(path.join(ROOT, 'engine/bohemia_hunger.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('RICE CLOCK GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (buying is a conversion and eating is the sink, so the day can be'
            + ' fed at all, and hunger is a clock that counts and never bites)');
  process.exit(fail ? 1 : 0);
};

/* ---- 1. *** THE LOOP CLOSES: BUY, HAVE, EAT *** ------------------------- */
{
  const purse = P.create();
  P.credit(purse, 'electricity', 5, 'gate:float', null, 1);
  const before = P.balances(purse);

  const r = PD.buy(purse, null, 'food', 1, null);
  ok('buying food works at all (' + JSON.stringify({ applied: r.applied, paid: r.paid,
      got: r.got }) + ')', r.applied === true);
  const after = P.balances(purse);
  ok('the battery leaves (' + before.electricity + ' -> ' + after.electricity + ')',
     after.electricity === before.electricity - r.paid);
  ok('*** AND THE FOOD ARRIVES, WHICH IT NEVER DID BEFORE *** (resources '
     + before.resources + ' -> ' + after.resources + ')',
     after.resources === before.resources + 1);
  ok('and it lands in the pocket the verbs that eat actually drain',
     r.pocket === P.VERBS['day:ate'].currency);

  /* THE SINK MOVED TO THE RIGHT MOMENT. */
  const kinds = purse.entries.slice(-2).map(e => e.kind).join(',');
  ok('*** SHOPPING MOVES VALUE, IT DOES NOT DESTROY IT *** -- the two legs post as'
     + ' `convert`, not `drain` (' + kinds + ')', kinds === 'convert,convert');

  const ate = P.upkeep(purse, 'day:ate', null, 1);
  ok('*** SO THE DAY CAN BE FED, WHICH IT COULD NOT BE BEFORE ***',
     ate.applied === true);
  ok('and EATING is the hard sink: it posts a drain and the food is gone',
     purse.entries[purse.entries.length - 1].kind === 'drain'
     && P.balances(purse).resources === 0);
  ok('the purse audits clean through the whole loop', P.audit(purse).ok === true);
}

/* ---- 2. it is atomic, and it refuses honestly -------------------------- */
{
  const broke = P.create();
  P.credit(broke, 'electricity', 0.5, 'gate:float', null, 1);
  const n = broke.entries.length;
  const r = PD.buy(broke, null, 'food', 1, null);
  ok('with not enough for the price it refuses and says why (' + r.reason + ')',
     r.applied === false && r.reason === 'CANNOT_AFFORD');
  ok('*** AND NOTHING MOVED: a battery can never leave without the good arriving ***',
     broke.entries.length === n && P.balances(broke).resources === 0);
}

/* ---- 3. the clock is read off the ledger, never stored ----------------- */
{
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_hunger.js'), 'utf8');
  const logic = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
                   .replace(/'(?:\\.|[^'\\])*'/g, "''");
  ok('the hunger module stores no count of its own -- it reads the entries back',
     /purse\.entries/.test(logic) && !/\bstreakCount\s*=|\bsave\.|localStorage/.test(logic));
  ok('*** AND IT TAKES NOTHING OFF HIM. NO DAMAGE BEFORE THE DIAL ***',
     !/debit|drain|damage|hp|health|credit\(/.test(logic));

  const purse = P.create();
  P.credit(purse, 'resources', 2, 'gate:float', null, 1);
  P.upkeep(purse, 'day:ate', null, 1);
  P.upkeep(purse, 'day:ate', null, 2);
  for (const d of [3, 4, 5, 6]) P.upkeep(purse, 'day:ate', null, d);  /* nothing left */

  ok('a day they ate is a day with a real drain on it (' +
     Object.keys(H.fedDays(purse)).join(', ') + ')',
     H.ateOn(purse, 1) === true && H.ateOn(purse, 3) === false);
  const run = [1, 2, 3, 4, 5, 6].map(d => H.streak(purse, d));
  ok('*** AND THE CLOCK RUNS: ' + run.join(' ') + ' ***',
     run[0] === 0 && run[1] === 0 && run[2] === 1 && run[5] === 4);
  ok('it counts back from the day asked about, so it never reads a day ahead of'
     + ' the nightfall that fills it', H.streak(purse, 2) === 0);

  const said = [1, 2, 3, 7].map(n => H.say(n));
  ok('and it says it in words that rise (' + said.map(s => '"' + s + '"').join(' ') + ')',
     said[0] !== said[1] && said[1] !== said[2] && said[2] !== said[3]
     && said.every(s => s.length > 10));
  ok('and says nothing at all on a day they ate', H.say(0) === '' && H.say(null) === '');
  ok('*** AND THE WORDS NAME THE THING TO BUY, because "taught by wanting it, not'
     + ' by a text box" means the game says what is missing ***',
     /food/i.test(said[2]));

  /* A READER THAT CANNOT SEE ITS OWN SUBJECT IS THE BROKEN ONE. */
  ok('it checks the verb it asks about is still one of the frozen four, so a rename'
     + ' cannot make it report a starving valley forever', H.verbLives() === true);
}

/* ---- 4. on the surface he walks, and in the demo ----------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }

  async function drive(ctx) {
    return ctx.evaluate(async () => {
      const R = { module: typeof BohemiaHunger, nights: [] };
      const p = purseGet();
      for (let n = 0; n < 4; n++) {
        advance(20 * 60);
        const card = (document.getElementById('daycardIn') || {}).textContent || '';
        R.nights.push({
          streak: BohemiaHunger.streak(p, DAY.day),
          hungry: /Nobody ate today|days with nothing to eat|Two days now/.test(card)
        });
        for (let k = 0; k < 6; k++) {
          const go = document.querySelector('#daycardIn .dcgo')
                  || document.querySelector('#daycardIn .dcx');
          if (!go) break; go.click();
          await new Promise(s => setTimeout(s, 60));
          if (!document.getElementById('daycard').classList.contains('on')) break;
        }
      }
      /* now buy the bag of rice and watch the clock stop */
      BohemiaPurse.credit(p, 'electricity', 3, 'gate:float', null, DAY.day);
      const e0 = BohemiaPurse.balances(p).electricity;
      R.bought = mktBuy('food');
      R.afterBuy = BohemiaPurse.balances(p);
      R.paidABattery = e0 - R.afterBuy.electricity;
      advance(20 * 60);
      await new Promise(s => setTimeout(s, 200));
      const card2 = (document.getElementById('daycardIn') || {}).textContent || '';
      R.fed = {
        streak: BohemiaHunger.streak(p, DAY.day),
        stillHungryLine: /Nobody ate today|days with nothing to eat/.test(card2),
        resources: BohemiaPurse.balances(p).resources
      };
      return R;
    });
  }

  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 180000 });
  for (let i = 0; i < 200; i++) { if (await pg.$('#daycardIn .dcgo')) break; await SETTLE(pg, 200); }
  await pg.$eval('#daycardIn .dcgo', el => el.click());
  await SETTLE(pg, 300);
  const r = await drive(pg);
  await b.close();

  ok('the hunger module reaches the surface he walks', r.module === 'object');
  const st = r.nights.map(n => n.streak);
  ok('*** THE CLOCK RUNS ON THE REAL SURFACE: ' + st.join(' ') + ' ***',
     st[0] === 1 && st[st.length - 1] === st.length);
  ok('*** AND HE READS IT ON THE CARD HE ALREADY READS, every hungry night *** ('
     + r.nights.filter(n => n.hungry).length + ' of ' + r.nights.length + ')',
     r.nights.every(n => n.hungry));
  ok('*** THEN HE BUYS THE BAG OF RICE: one battery out, one food in ***',
     !!r.bought && r.bought.applied === true && r.paidABattery === 1
     && r.afterBuy.resources === 1);
  ok('*** AND THAT NIGHT THEY EAT AND THE CLOCK STOPS *** (streak ' + r.fed.streak
     + ', food eaten, no hunger line)',
     r.fed.streak === 0 && r.fed.stillHungryLine === false && r.fed.resources === 0);
  ok('no page error across five nights' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);

  /* the demo */
  const demo = path.join(ROOT, 'slices/BOHEMIA_DEMO.html');
  if (!fs.existsSync(demo)) { ok('the demo has been cut', false); return done(); }
  const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
                  '.png': 'image/png', '.css': 'text/css',
                  '.webmanifest': 'application/manifest+json' };
  const srv = require('http').createServer((rq, rs) => {
    const p = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]));
    fs.readFile(p, (e, d) => {
      if (e) { rs.statusCode = 404; return rs.end('no'); }
      rs.setHeader('content-type', TYPES[path.extname(p)] || 'application/octet-stream');
      rs.end(d);
    });
  });
  await new Promise(res => srv.listen(0, res));
  const port = srv.address().port;
  const b2 = await chromium.launch();
  const p2 = await b2.newPage({ viewport: { width: 390, height: 844 } });
  const errs2 = []; p2.on('pageerror', e => errs2.push(e.message));
  await p2.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_DEMO.html',
                { waitUntil: 'load', timeout: 180000 });
  await SETTLE(p2, 1500);
  await p2.click('#front', { force: true }).catch(() => {});
  await SETTLE(p2, 2500);
  let fr = null;
  for (let i = 0; i < 200; i++) {
    fr = p2.frames().find(f => /CITY_WORLD/.test(f.url()));
    if (fr && await fr.$('#daycardIn .dcgo').catch(() => null)) break;
    await SETTLE(p2, 250);
  }
  let d = { module: 'none' };
  if (fr) {
    await fr.$eval('#daycardIn .dcgo', el => el.click());
    await SETTLE(p2, 400);
    d = await fr.evaluate(async () => {
      const D = { module: typeof BohemiaHunger };
      const p = purseGet();
      BohemiaPurse.credit(p, 'electricity', 3, 'gate:float', null, DAY.day);
      const e0 = BohemiaPurse.balances(p).electricity;
      const r = mktBuy('food');
      D.bought = !!(r && r.applied);
      D.paid = e0 - BohemiaPurse.balances(p).electricity;
      D.got = BohemiaPurse.balances(p).resources;
      advance(20 * 60);
      await new Promise(s => setTimeout(s, 200));
      D.ateIt = BohemiaPurse.balances(p).resources === 0;
      D.streak = BohemiaHunger.streak(p, DAY.day);
      return D;
    });
  }
  await b2.close(); srv.close();

  ok('the demo opens the city through its splash', d.module === 'object');
  ok('*** AND THE WHOLE LOOP RUNS IN THE DEMO TOO: a battery buys food, the food'
     + ' arrives, and the day eats it ***',
     d.bought === true && d.paid === 1 && d.got === 1 && d.ateIt === true
     && d.streak === 0);
  ok('no page error in the demo' + (errs2.length ? ' -- ' + errs2[0] : ''),
     errs2.length === 0);
  done();
})();
