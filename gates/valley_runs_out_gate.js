/* ============================================================================
   THE VALLEY RUNS OUT GATE (9/6/26, WORLD lane) — THE-VALLEY-RUNS-OUT.

   RULED by the coordinator 9/5 (correct-after): the valley eating its last shelves
   in ten days is THE PREMISE, NOT A BUG. This is an economic crash simulator and a
   place that is running out is the whole point. Make it visible: the shelves
   emptying is something the player can SEE happen day by day, and the day-10 moment
   is a beat, not a silent zero.

   *** THE BUG UNDERNEATH IT, AND IT IS THE WHOLE PREMISE. *** mktAdvanceDay() read
   `if(!MKT_LEDGER) return null`, with the note "never censused = never traded =
   nothing to age". That is true of a SHOP and false of a VALLEY. MEASURED: the
   ledger does not exist at boot, so a player who had not walked into a market had a
   world that never ate anything -- and the first time he did walk into one, on day
   30, the ledger was born FULL and the countdown started THEN. A place that only
   starts running out when somebody checks is not running out.

   EVERY NUMBER IS READ, NONE IS TYPED. bohemia_economy.js has computed daysLeft
   since it was written and nothing outside a market card ever asked. Measured on the
   real ledger: food goes 8.4 days to 0 across exactly TEN DAYS -- the day-10 moment
   the ruling names, DERIVED from his own stocks and needs, scheduled by nobody.

   node gates/valley_runs_out_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const E = require(path.join(ROOT, 'engine/bohemia_economy.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('VALLEY RUNS OUT GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (it runs out whether or not you look - the count is read, never'
            + ' typed - and the day it empties is a beat)');
  process.exit(fail ? 1 : 0);
};

/* ---- 1. nothing here schedules anything -------------------------------- */
{
  const city = fs.readFileSync(CITY, 'utf8');
  const blk = city.slice(city.indexOf('function valleyRunsOut()'),
                         city.indexOf('function valleyRunsOut()') + 1800);
  ok('the run-out readout exists on the walked surface', blk.length > 100);
  /* A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1), so the
     comments come off before anything is grepped. */
  const logic = blk.replace(/\/\*[\s\S]*?\*\//g, '')
                   .replace(/'(?:\\.|[^'\\])*'/g, "''");
  ok('IT SCHEDULES NOTHING -- no day number, no stock, no rate, no threshold is'
     + ' typed into it', !/\b(10|ten|day\s*===?\s*\d|stocks?\s*=|rate|threshold)\b/i.test(logic));
  ok('and the only numbers in it are 0 and 1 -- a count being empty, and a count'
     + ' being under one day',
     (logic.match(/\b\d+(\.\d+)?\b/g) || []).every(n => n === '0' || n === '1'));
  ok('THE LEDGER IS MADE IF IT IS MISSING, so a valley nobody shopped in still eats',
     /if\(!MKT_LEDGER\)\{\s*try\{\s*mktLedger\(\);/.test(city));
  ok('and the note that said a valley with no shopper has nothing to age is gone',
     !/never censused = never traded = nothing to age/.test(city));
}

/* ---- 2. the model's own arithmetic, headless --------------------------- */
{
  const L = E.makeLedger(12345, 120, 120);
  const first = E.daysLeft(L, 'food');
  ok('the economy knows how many days of a good are left (food: ' + first + ')',
     first > 0 && first < Infinity);
  let zeroOn = null;
  for (let d = 1; d <= 30 && zeroOn === null; d++) {
    E.advanceDay(L, Array.from({ length: L.agents }, () => ({ job: { kind: 'scav' } })));
    if (E.daysLeft(L, 'food') <= 0) zeroOn = d;
  }
  /* THE TEN IS DERIVED. If his stocks or needs move, this number moves with them and
     the gate reports the new one rather than demanding the old. */
  ok('AND IT REALLY EMPTIES -- food runs out on day ' + zeroOn + ', off his own stocks'
     + ' and needs rather than a schedule', zeroOn !== null && zeroOn <= 30);
  ok('conservation holds: nothing appeared and nothing went negative',
     Object.keys(L.stocks).every(g => L.stocks[g] >= 0));
  ok('and the night it could not feed everybody is recorded as a shortfall',
     !!(L.flows && L.flows.shortfall && Object.keys(L.flows.shortfall).length));
}

/* ---- 3. on the surface he walks, twelve nights, never shopping --------- */
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
  await SETTLE(pg, 300);

  const r = await pg.evaluate(async () => {
    const R = { ledgerAtBoot: !!MKT_LEDGER, nights: [], visitedMarket: false };
    /* THE CARD'S textContent RUNS ITS LIST ITEMS TOGETHER -- "...0 stepssuburbfood: 7
       days..." -- so a greedy \w+ before the colon captures the district too and the
       good comes back as "suburbfood". My first cut did exactly that and reported a
       countdown that never happened. Match the good against the ones the economy
       actually has, which is the only list that can be right. */
    const goods = Object.keys(BohemiaEconomy.GOODS).join('|');
    const COUNT = new RegExp('(' + goods
      + '): (less than a day|1 day|\\d+ days) left in the valley');
    for (let n = 0; n < 12; n++) {
      advance(20 * 60);
      /* A NIGHT CAN PUT UP MORE THAN ONE CARD, and the reckoning is not always the
         one on top -- other lanes share this container. Drain the night and keep
         whichever card carried the count, instead of reading the first one and
         calling the night silent.
         *** AND DISMISS WHATEVER CARD IS UP, NOT THE ONE CARD I EXPECTED. *** My
         first cut clicked .dcgo or nothing. In the DEMO another lane's phone card
         came up on night 2, it has no .dcgo, so the loop stopped advancing and
         re-read ONE STALE CARD eleven times -- and reported eleven silent nights
         that were really eleven reads of night one. The valley was fine; the probe
         was blind. Every card has carried a real ✕ (.dcx) since that was fixed in
         the system, so ask for that when .dcgo is not there. */
      let m = null, g = null;
      for (let k = 0; k < 6; k++) {
        const card = (document.getElementById('daycardIn') || {}).textContent || '';
        m = m || card.match(COUNT);
        g = g || card.match(/THE (\w+) IS GONE\./);
        const go = document.querySelector('#daycardIn .dcgo')
                || document.querySelector('#daycardIn .dcx');
        if (!go) break;
        go.click();
        await new Promise(res => setTimeout(res, 60));
        if (!document.querySelector('#daycardIn .dcgo, #daycardIn .dcx')) break;
      }
      R.nights.push({ n: n + 1, good: m ? m[1] : null, left: m ? m[2] : null,
                      gone: g ? g[1] : null });
    }
    R.ledgerAfter = !!MKT_LEDGER;
    return R;
  });
  await b.close();

  /* THE CHECK THIS FILE EXISTS FOR. */
  ok('the ledger really is absent at boot, which is what made this invisible',
     r.ledgerAtBoot === false);
  ok('*** AND THE VALLEY AGED ANYWAY, WITHOUT HIM EVER WALKING INTO A MARKET ***',
     r.ledgerAfter === true);

  const counted = r.nights.filter(n => n.left);
  ok('HE SEES IT EVERY NIGHT, on the card he already reads (' + counted.length
     + ' of 12 nights carried a count)', counted.length >= 10);

  /* *** AND IT IS THE **FIRST** NIGHT THAT PROVES IT, NOT THE TWELFTH. ***
     MEASURED, by deleting the fix and watching this file stay green: with the
     ledger creation gone the valley STILL ended up aged by night 12 -- because
     feedWorld() renders a feed post through mktShelf(), which calls mktLedger(),
     which builds the ledger as a SIDE EFFECT. Night 4, from a panel that was only
     trying to write a sentence. That is this row's own bug wearing a different
     coat: the valley started running out when a piece of UI happened to look at
     it. So "aged by night 12" is not a check, it is a coincidence waiting to
     happen. The first nightfall is the one that cannot be faked. */
  ok('*** THE COUNT IS THERE ON NIGHT ONE, before anything else has looked at the'
     + ' valley *** (' + r.nights[0].good + ': ' + r.nights[0].left + ')',
     !!r.nights[0].left);

  /* DAY BY DAY: the number really goes down while the same good is scarcest. */
  const food = r.nights.filter(n => n.good === 'food' && /days$/.test(n.left || ''))
                       .map(n => parseInt(n.left, 10));
  ok('and the count GOES DOWN night after night (' + food.join(' -> ') + ')',
     food.length >= 4 && food.every((v, i) => i === 0 || v <= food[i - 1])
     && food[food.length - 1] < food[0]);
  ok('and it gets down to the last day rather than jumping to zero',
     r.nights.some(n => n.left === 'less than a day' || n.left === '1 day'));

  /* THE BEAT. */
  const goneNights = r.nights.filter(n => n.gone);
  ok('*** THE DAY IT EMPTIES IS A BEAT, NOT A SILENT ZERO *** -- "THE FOOD IS GONE"'
     + ' on night ' + (goneNights[0] || {}).n,
     goneNights.length === 1 && goneNights[0].gone === 'FOOD');
  ok('AND IT FIRES ONCE, on the night it happens, not every night after',
     goneNights.length === 1);
  ok('and the countdown moves to whatever is scarcest next, so the valley keeps'
     + ' running out', r.nights.slice(-1)[0].good && r.nights.slice(-1)[0].good !== 'food');
  ok('no page error across twelve nights' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);

  /* ---- 4. AND IN THE DEMO, WHICH IS ONE DAY LONG ON PURPOSE ------------- */
  /* A ROW IS NOT SHIPPED UNTIL IT IS IN THE WALKED SURFACE **AND** THE DEMO.
     The demo reaches the city through a same-origin iframe, so it needs a real
     server rather than file://, and it has to be entered through the splash.

     *** AND ITS ONE NIGHT IS THE WHOLE TEST, WHICH COST ME AN HOUR TO LEARN. ***
     I drove twelve nights here first and got ONE count and eleven silences, and
     nearly filed it as the countdown breaking in the demo. It is not: CT_DEMO_DAYS
     is 1 and ctDemoOver() hands day 2 to showEnding(), the last-thirty-seconds
     phone card that says "THAT IS AS FAR AS THIS GOES FOR NOW". The demo ENDS. I
     had measured a designed ending and called it a freeze. Verified against a
     clean origin/main build, which stops in exactly the same place with no
     countdown on its one night at all. So: one night, and the count is on it. */
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
  let d = { frame: false };
  if (fr) {
    await fr.$eval('#daycardIn .dcgo', el => el.click());
    await SETTLE(p2, 400);
    d = await fr.evaluate(async () => {
      const D = { frame: true, ledgerAtBoot: !!MKT_LEDGER, isDemo: CT_IS_DEMO,
                  demoDays: CT_DEMO_DAYS };
      advance(20 * 60);
      const goods = Object.keys(BohemiaEconomy.GOODS).join('|');
      const card = (document.getElementById('daycardIn') || {}).textContent || '';
      const m = card.match(new RegExp('(' + goods
        + '): (less than a day|1 day|\\d+ days) left in the valley'));
      D.good = m ? m[1] : null; D.left = m ? m[2] : null;
      D.ledgerAfter = !!MKT_LEDGER;
      return D;
    });
  }
  await b2.close(); srv.close();

  ok('the demo opens the city through its splash', d.frame === true);
  ok('and it really is running as the demo, one day long (CT_DEMO_DAYS='
     + d.demoDays + ')', d.isDemo === true && d.demoDays === 1);
  ok('the demo boots with no ledger either', d.ledgerAtBoot === false);
  ok('*** AND ON ITS ONE NIGHT THE COUNT IS ON THE CARD -- ' + d.good + ': '
     + d.left + ' left in the valley ***', !!d.good && !!d.left);
  ok('and the demo aged the valley without a market visit', d.ledgerAfter === true);
  ok('no page error in the demo' + (errs2.length ? ' -- ' + errs2[0] : ''),
     errs2.length === 0);
  done();
})();
