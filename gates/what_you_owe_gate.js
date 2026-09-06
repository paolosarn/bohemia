/* ============================================================================
   WHAT YOU OWE (9/5/26, RUN lane) -- VAMILY [debts named] / BB-WHAT-YOU-OWE.

   THE BACKLOG CALLS IT "the smallest row in seven days of study and the best
   effort-to-effect one on the whole BB board. IT IS ONE LINE ON A CARD HE IS
   ALREADY READING."

   MEASURED 8/28, re-confirmed today: there is exactly ONE daily cost in the
   walked game, and it is not food, rent or fuel -- it is PEOPLE YOU SAID YOU
   WOULD SHOW UP FOR. ctNeglectFor walks every outfit you made a commitment to
   and takes standing away if you did not turn up. "Nothing said, nothing owed":
   it only bills what you actually promised. THAT IS THE RIGHT MECHANIC AND THE
   PLAYER WAS NEVER TOLD IT HAPPENED.

   THREE SMALL THINGS IN ONE PLACE:
     1. ctNeglectFor hands back {faction, lost, now} for every outfit and ITS
        RETURN VALUE WAS THROWN AWAY. It already computed exactly what to say.
     2. THE TIMING MADE IT UNSAYABLE. The card was built and shown FIRST and the
        charge happened on the tap that DISMISSED it -- the bill rung up at the
        exact moment the only surface that could report it was already gone.
     3. So the card counted steps, districts, buildings entered, the job outcome
        and the pay, and never once said whose day you ruined.

   The game he named makes you leave the house through PAYROLL, and its
   punishment is not death, it is PEOPLE LEAVING. We had built our version of
   that and hidden it.

   ---- WHAT THIS HOLDS -------------------------------------------------------
   That the charge happens BEFORE the card is built, that its answer reaches the
   card, that the forward half exists, and that neither half can invent a debt:
   "nothing said, nothing owed" is asserted directly, because a card that names
   somebody you never promised anything is worse than a silent one.

   ---- AND A JUDGEMENT I GOT WRONG FIRST, WRITTEN DOWN ------------------------
   The first cut FILTERED anybody already billed today out of the forward list,
   on the theory that a name said twice reads as two debts. Measured on the real
   card: that emptied the forward list at exactly the moment the warning is worth
   most -- the night you already missed them. Somebody you let down today still
   expects you tomorrow. Nobody is filtered now, and the two headings carry the
   difference: one is a charge that happened, one is a cost that has not.

   ---- MUTATION PROOF, run 9/5 -------------------------------------------------
     * throw ctNeglectFor's answer away again -> 5 red, including the card no
       longer naming anybody
     * remove the "nothing said, nothing owed" guard so everybody is billed
       whether they were promised anything or not -> 1 red.
       AND THAT ONE PASSED THE FIRST TIME IT WAS TRIED, which is why it is
       written down: the claim was asked on a save where NOBODY had any standing
       at all, and both lists independently drop anybody with nothing left to
       lose, so it agreed for the wrong reason. It seeds real standing with no
       promise behind it now -- the exact case the guard exists for -- and the
       mutation turns it red.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const ROOT = path.join(__dirname, '..');
const SLICES = path.join(ROOT, 'slices');
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const seededGave = q => q.fid + ' gave ' + q.gave + ', state ' + q.state;
const done = () => {
  console.log('WHAT YOU OWE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
};

const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.png': 'image/png', '.json': 'application/json',
               '.webmanifest': 'application/manifest+json' };
function serve() {
  return new Promise(res => {
    const s = http.createServer((rq, rs) => {
      const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
      const f = path.join(SLICES, rel);
      if (!f.startsWith(SLICES) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        rs.statusCode = 404; return rs.end('no');
      }
      rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
      fs.createReadStream(f).pipe(rs);
    });
    s.listen(0, '127.0.0.1', () => res(s));
  });
}

/* ---- 1. THE ORDER, IN THE SOURCE ----------------------------------------- */
{
  const city = fs.readFileSync(path.join(SLICES, 'BOHEMIA_CITY_WORLD.html'), 'utf8');
  const showAt = city.indexOf('function showReckoning(){');
  const chargeAt = city.indexOf('OWED_TODAY = ctNeglectFor(', showAt);
  const firstLine = city.indexOf("h+='<h3>THE DAY</h3><ul>';", showAt);
  ok('the charge happens INSIDE showReckoning', showAt > 0 && chargeAt > showAt);
  ok('*** AND BEFORE A SINGLE LINE OF THE CARD IS BUILT *** -- it used to happen '
    + 'on the tap that dismissed it', chargeAt > 0 && firstLine > 0 && chargeAt < firstLine);
  ok('there is exactly ONE caller of the charge, not two -- one writer for one '
    + 'day\'s number', (city.match(/ctNeglectFor\(/g) || []).length === 2);   /* def + 1 call */
  ok('the sweep still runs after it, which is the order it needs',
     /ctVouchSweep\(ctBelongSave\(\)/.test(city));
  ok('the card has both halves', /WHO YOU LET DOWN/.test(city)
     && /WHO IS EXPECTING YOU TOMORROW/.test(city));
  ok('and the forward half is READ-ONLY -- it never adjusts anything',
     !/function ctOwedTomorrow[\s\S]{0,900}BohemiaBelonging\.adjust/.test(city));
}

/* ---- 2. THE REAL SURFACE ------------------------------------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); return done(); }

  const srv = await serve();
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  try {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                           hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
    await page.goto(base + 'BOHEMIA_DEMO.html', { waitUntil: 'load', timeout: 240000 });
    await SETTLE(page, 2500);
    await page.tap('#front').catch(async () => { await page.click('#front').catch(() => { }); });
    await SETTLE(page, 90000, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try {
        return await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1
          && typeof ctOwedTomorrow === 'function' && typeof showReckoning === 'function');
      } catch (e) { return false; }
    });
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('the walked world is up', !!city);
    if (!city) { await browser.close(); srv.close(); return done(); }

    /* *** NOTHING SAID, NOTHING OWED, AND IT IS ASKED THE ONLY WAY THAT TESTS
       IT. *** The first cut asked this on a fresh save where nobody had any
       standing at all -- and mutation showed it passed with the guard REMOVED,
       because both lists also drop anybody with nothing left to lose. It was
       agreeing for the wrong reason. So this seeds REAL STANDING with NO PROMISE
       behind it, which is the exact case the guard exists for: you have done
       things for them, you never said you were with them, and they cannot bill
       you for it. A card that names somebody you never promised anything is
       worse than a silent one. */
    const quiet = await city.evaluate(() => {
      const sv = ctBelongSave();
      const fid = Object.keys(BohemiaBelonging.RULES)[0];
      BohemiaBelonging.record(sv, fid, 1);
      BohemiaBelonging.record(sv, fid, 1);          /* standing, but no word given */
      return { fid: fid, gave: BohemiaBelonging.gaveOf(sv, fid),
               state: BohemiaCommitment.stateOf(sv, fid),
               tomorrow: ctOwedTomorrow(sv).length,
               today: ctNeglectFor(sv, (T && T.day) || 1).length };
    });
    ok('the harness really did build standing to lose (' + seededGave(quiet)
      + ')', (quiet.gave | 0) >= 1 && quiet.state === 'none');
    ok('*** NOTHING SAID, NOTHING OWED *** -- standing built and no word given, '
      + 'so nobody is billed and nobody is expecting you ('
      + quiet.today + '/' + quiet.tomorrow + ')',
       quiet.today === 0 && quiet.tomorrow === 0);

    /* now make a real promise, through the modules the game uses */
    const seeded = await city.evaluate(() => {
      const sv = ctBelongSave();
      const fid = Object.keys(BohemiaBelonging.RULES)[0];
      BohemiaCommitment.setState(sv, fid, 'sided');    /* NOW he says it out loud */
      return { fid: fid, gave: BohemiaBelonging.gaveOf(sv, fid),
               state: BohemiaCommitment.stateOf(sv, fid),
               cost: BohemiaCommitment.neglectFor(BohemiaCommitment.stateOf(sv, fid)) | 0,
               tomorrow: ctOwedTomorrow(sv) };
    });
    ok('taking a side out loud creates a real daily cost (' + seeded.fid + ', '
      + seeded.state + ', costs ' + seeded.cost + ')', seeded.cost >= 1);
    ok('and the forward half sees them BEFORE the day ends ('
      + JSON.stringify(seeded.tomorrow.map(t => t.faction)) + ')',
       seeded.tomorrow.length >= 1 && seeded.tomorrow[0].faction === seeded.fid);

    /* end the day and read what the card actually says */
    const card = await city.evaluate(() => {
      try { T.day = 2; } catch (e) { }
      try { showReckoning(); } catch (e) { return 'THREW: ' + e.message; }
      const d = document.getElementById('daycard');
      return d ? (d.textContent || '').replace(/\s+/g, ' ') : 'NO CARD';
    });
    ok('*** THE RECKONING CARD NAMES WHO YOU LET DOWN ***',
       /WHO YOU LET DOWN/.test(card) && card.indexOf(seeded.fid) >= 0);
    ok('and says what it cost, in their standing, not in an abstraction',
       /waited on you/.test(card) && /now \d/.test(card));
    ok('*** AND IT SAYS WHO IS EXPECTING YOU TOMORROW ***',
       /WHO IS EXPECTING YOU TOMORROW/.test(card));
    ok('including the one you just let down, because they still expect you -- '
      + 'the filter that hid them emptied this list on the night it mattered '
      + 'most', (card.split(seeded.fid).length - 1) >= 2);
    ok('the card still says everything it said before (the day, the steps)',
       /THE DAY/.test(card) && /steps/.test(card));
    ok('nothing threw building it' + (errs.length ? ' -- first: ' + errs[0] : ''),
       errs.length === 0);
    console.log('  card said: ' + card.slice(0, 190));

    await browser.close();
    srv.close();
    done();
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
    try { await browser.close(); } catch (e2) { }
    try { srv.close(); } catch (e2) { }
    done();
  }
})();
