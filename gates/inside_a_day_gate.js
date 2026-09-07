/* ============================================================================
   INSIDE A DAY GATE (9/7/26, QUESTS lane) -- VAMILY [distance shown],
   BB-INSIDE-A-DAY.

   THE ROW: day one's quest requires a TRADES role, the nearest TRADES person is
   five blocks from the block he wakes on, and at the valley's own measured
   walking speed that is about three and a half hours each way. SEVEN HOURS THERE
   AND BACK, forty-four percent of the first day anybody ever plays, walking to
   the person the first job is about. Nobody had multiplied the two numbers
   together, and nothing on the offer said a word about it.

   *** THIS IS DISCLOSURE, NOT RELOCATION. *** Where people are is HIS and MAP LAW
   holds. Nothing in this change moves anybody, shortens any walk, or touches a
   layout, and this gate asserts that rather than trusting it.

   WHAT IT HOLDS:

   1. THE ARITHMETIC IS HIS OWN, AND IT IS RE-DERIVED HERE. The row publishes
      three figures out of the walked surface: five blocks is about 1.9 km, seven
      is about 2.7 km, and a sixteen-hour day walks about 8.6 km across a 9.2 km
      valley. The module's constants must reproduce all three, so its numbers can
      be argued with by pointing at his file instead of at my judgement.

   2. ONE THRESHOLD, AND IT IS THE ROW'S. "A day there and back is the reachable
      set", from the City of London's market isochrone. Anything finer -- "a fair
      walk", "most of a day" -- is a number nobody ruled, so the file states the
      minutes and answers exactly one yes-or-no question.

   3. *** IT IS SHOWN BEFORE HE TAKES THE JOB, AND THIS IS THE CHECK THAT CAUGHT
      MY OWN FIRST CUT. *** I first hung the line on ctAddress(), which reads
      beautifully and is on the WRONG SIDE OF THE DECISION: the address needs the
      day cast, the cast only exists after DQ.openDay, and openDay only runs when
      he ACCEPTS. That version told him the walk was seven hours after he had
      already agreed to it -- the exact failure this row exists to end, rebuilt
      inside the fix for it. So the gate demands the sentence exist while
      OFFER_TAKEN is still false.

   4. IT MOVES NOTHING. The module writes into no other system and the offer's
      measurement is a read: castAddresses is the same call the address line
      already makes, deliberately, so the offer and the address can never quote
      two different distances for one person.

   5. AND THE WORDS ARE ON THE GLASS. Not a variable that exists: the sentence has
      to appear in the text of the card he is looking at.
   ========================================================================== */
'use strict';
const path = require('path');
const fs   = require('fs');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) { pass++; } else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};

global.window = global;
const R = require(path.join(ROOT, 'engine/bohemia_reach.js'));

/* ---- 1. THE ARITHMETIC IS HIS, RE-DERIVED --------------------------------- */
const km = m => m / 1000;
ok('1a five blocks is the 1.9 km the row measured (' + km(R.metresFor(5)) + ' km)',
   Math.abs(km(R.metresFor(5)) - 1.9) < 0.05);
ok('1b seven blocks is its 2.7 km (' + km(R.metresFor(7)) + ' km)',
   Math.abs(km(R.metresFor(7)) - 2.7) < 0.05);
const dayKm = km(R.WAKING_HOURS * 60 * R.METRES_PER_MINUTE);
ok('1c a sixteen-hour day walks the row\'s 8.6 km (' + dayKm.toFixed(2) + ' km)',
   Math.abs(dayKm - 8.6) < 0.1);
const fiveMin = R.minutesFor(5);
ok('1d and five blocks is its ~211 minutes one way (' + Math.round(fiveMin) + ')',
   Math.abs(fiveMin - 211) < 10);
ok('1e which is the seven hours there and back the row is named for ('
   + (R.thereAndBack(5) / 60).toFixed(1) + 'h)',
   Math.abs(R.thereAndBack(5) / 60 - 7) < 0.4);
/* THE SOURCE OF THE SPEED, stated in the walked surface's own words. */
const city = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
ok('1f the surface still says nine metres a minute, which is where these come from',
   /about nine metres a minute/.test(city));

/* ---- 2. ONE THRESHOLD, AND IT IS HIS -------------------------------------- */
const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_reach.js'), 'utf8');
const code = src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
/* every bare number left in the CODE must be one of the measured constants, the
   arithmetic of time, or the formatting of a sentence -- never a judgement. */
/* EVERY NUMBER ALLOWED IN THE CODE IS NAMED HERE, WITH WHAT IT IS FOR. A bare
   allowlist would let a threshold in by looking like arithmetic, which is the
   thing this check exists to stop. If a number is not on this list it is a
   judgement somebody made without a ruling. */
const ALLOWED = {
  '9':    'metres a minute, measured on the walked surface',
  '384':  'metres in a block: NB 4 x FN x the fine cell',
  '16':   'waking hours, which the day loop spends',
  '60':   'minutes in an hour, and the point a duration starts speaking in hours',
  '0':    'zero, and the floor under a negative distance',
  '1':    'one, and the singular of a block',
  '2':    'there and back',
  '0.25': 'sentence rounding: below a quarter past, do not say "and a half"',
  '0.75': 'sentence rounding: at three quarters, round up to the next hour'
};
const stray = (code.match(/\b\d+(\.\d+)?\b/g) || []).filter(n => !ALLOWED[n]);
ok('2a every number in the code is a measured constant or the arithmetic of a '
   + 'sentence, never a threshold (' + stray.length + ' stray: '
   + [...new Set(stray)].slice(0, 6).join(',') + ')', stray.length === 0);
ok('2a2 and the two rounding numbers really are only used to shape a sentence',
   /hoursWord/.test(code) && !/(0\.25|0\.75)[^)]*fits/.test(code));
ok('2b the one judgement it makes is his reachable set, and it says so',
   /a day there and back is the reachable set/i.test(src));
const r5 = R.insideADay(5), r12 = R.insideADay(12);
ok('2c a five-block job fits inside a day', r5.fits === true);
ok('2d a twelve-block job does not, and the line says so',
   r12.fits === false && /not be back inside a day/.test(R.sayIt(12)));
ok('2e right here says nothing at all', R.sayIt(0) === null);

/* ---- 4. IT MOVES NOTHING -------------------------------------------------- */
ok('4a the module writes into no other system',
   !/Bohemia[A-Za-z]+\s*\.[A-Za-z]+\s*=[^=]/.test(code));
ok('4b and it never touches a map, a block layout or a person',
   !/(castAddresses|om\.at|placeHomes|setOwner|\.block\s*=)/.test(code));
ok('4c the seam calls the SAME caster the address line uses, so one person cannot '
   + 'have two distances', /castAddresses/.test(city));

/* ======================================================================== */
/*  3 and 5. THE REAL SURFACE, AND THE SIDE OF THE DECISION IT IS ON         */
/* ======================================================================== */
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto('file://' + ALPHA);
    await page.evaluate(() => localStorage.setItem('bohemia.opening.seen.v1', '1'));
    await page.reload();
    await SETTLE(page, 3400);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await SETTLE(page, 500);
    const tapped = await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('.tab'))
        .find(e => (e.textContent || '').trim() === 'RUN');
      if (!t) return false; t.click(); return true;
    });
    ok('R1 the RUN tab exists and was tapped', tapped === true);
    await SETTLE(page, 16000);

    let cityF = null;
    for (const f of page.frames()) {
      try { if (await f.evaluate(() => typeof ctOfferReach === 'function')) { cityF = f; break; } }
      catch (_e) {}
    }
    ok('R2 the reach seam reached the frame the player looks at', !!cityF);

    if (cityF) {
      const got = await cityF.evaluate(() => ({
        offer: ctOfferReach(),
        rang: window.__OFFER_RANG || 0,
        taken: window.__OFFER_TAKEN || 0,
        text: (document.body.innerText || '')
      }));
      console.log('  [on the offer] ' + JSON.stringify(got.offer));
      ok('R3 a job was actually offered (' + got.rang + ' rang)', got.rang > 0);
      ok('R4 *** and it says how long it is *** ("' + ((got.offer || {}).how || '') + '")',
         !!got.offer && typeof got.offer.how === 'string' && got.offer.how.length > 10);
      /* *** THE CHECK THAT CAUGHT MY FIRST CUT. *** */
      ok('R5 *** IT IS SAID BEFORE HE TAKES IT, not after ***',
         !!got.offer && got.offer.taken === false && got.taken === 0);
      ok('R6 the reach carries the whole answer, not just a sentence',
         !!got.offer && got.offer.reach && typeof got.offer.reach.oneWay === 'number'
         && typeof got.offer.reach.fits === 'boolean');
      /* 5. AND IT IS ON THE GLASS. */
      ok('R7 the sentence is in the text of the card he is looking at',
         !!got.offer && got.text.indexOf(got.offer.how) >= 0);
      ok('R8 and it sits with the offer, above GET UP',
         got.text.indexOf('picked it up') >= 0
         && got.text.indexOf((got.offer || {}).how || 'x') > got.text.indexOf('picked it up'));
      /* AND THE NUMBERS ON THE GLASS ARE THE MODULE'S, not a second opinion. */
      const again = R.sayIt((got.offer.reach || {}).blocks);
      ok('R9 the surface and the module agree exactly', again === got.offer.how,
         again + ' vs ' + got.offer.how);
    }
    ok('R10 nothing threw while the offer was measured', errs.length === 0, errs.slice(0, 3).join(' | '));
  } finally {
    await b.close();
  }

  console.log('INSIDE A DAY GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
