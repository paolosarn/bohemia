/* ============================================================================
   VISTA BEAT GATE (8/17/26, RUN lane) — demo board row 11.

   The board:
     "ROW 11 -- THE VISTA -- PARTIAL, and it is nearly free to close. Built,
      derived, inlined in the walked city, opened by vistaOpen(), and ARMED IN
      THE WORLD [...] BUT NOTHING LEADS YOU THERE. The seam window.__VISTA
      documents itself as 'RUN plays it from the day loop and the cold open' --
      and a repo-wide grep finds ZERO game-side callers. The demo's money shot is
      currently found by ACCIDENTALLY WALKING ONTO ONE RIM CELL.
      REMAINS: ONE CALL. OWNER: RUN."

   This is the eighth time this lane has closed a row of exactly that shape: a
   finished thing with a published seam and no caller. The pattern is never that
   the work is missing.

   WHAT IT HOLDS:
     1. THE RUN CALLS THE SEAM. The assertion that would have caught the row.
     2. IT IS A PLACE HE CAN FIND -- the phone carries where the overlook is, the
        same channel that carries the market, so it is somewhere to walk to
        rather than somewhere to stumble onto.
     3. THE MONEY SHOT LANDS, ONCE, ON DAY 2 -- driven by actually playing day 1
        through to sleep AND TAPPING GET UP in a real browser, not by calling the
        beat directly.
     3b. AND IT IS NOT BURIED. The first cut opened it ON the wake event, and the
        wake also raises the DAY 2 card, so the shot rendered under a modal
        covering the middle of the screen -- with this gate GREEN, because it
        really was open and really had drawn its card. I only found it by taking
        the screenshot and looking. So the card must be GONE when the valley is
        up, and that is asserted now.
     4. NOT ON DAY 1, which is already the cold open plus his first job.
     5. ONCE EVER, ACROSS RELOADS. A demo that replays its establishing shot
        every morning is worse than one that never plays it.
     6. and where the overlook IS stays derived from the map -- MAP LAW: this
        lane reports it and never places it.
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('VISTA BEAT GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

/* ---- 1. the run actually calls it --------------------------------------- */
{
  const c = fs.readFileSync(CITY, 'utf8');
  ok('the beat is in the build', c.indexOf('__THE_VALLEY_IS_A_PLACE__') >= 0);
  /* THE ASSERTION THAT WOULD HAVE CAUGHT THE ROW: a game-side caller, not the
     seam's own definition and not a gate. */
  const code = c.replace(/\/\*[\s\S]*?\*\//g, '');
  ok('THE RUN CALLS __VISTA.open() -- the thing the seam was published for and '
     + 'nobody ever did', /window\.__VISTA\.open\(\)/.test(code));
  ok('and it is wired to the day loop\'s wake, not to a menu',
     /DAY\.on\('wake'[\s\S]{0,900}?VISTA_ARMED=true/.test(code));
  ok('and it PLAYS after GET UP, so it is never under the wake card',
     /cardShow\(h,function\(\)\{ cardHide\(\); try\{ vistaBeatMaybe/.test(code));
  ok('the phone is told where the overlook is', /vista:\(function\(\)/.test(code));
  ok('it rides the save, so once means once', /vistaSeen:!!VISTA_SEEN/.test(code));
  /* MAP LAW: this lane reports where it is, never decides it. */
  ok('MAP LAW: the run READS the overlook from the seam and never places it',
     /__VISTA&&window\.__VISTA\.where\(\)/.test(code)
     && !/vistaWhere\s*=\s*function/.test(code));
}

/* ---- 2. played, in a real browser --------------------------------------- */
(async () => {
  const { chromium } = pw();
  const b = await chromium.launch();
  try {
    const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/^https?:/, r => r.abort());
    await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 120000 });
    for (let i = 0; i < 120; i++) { if (await pg.$('#daycardIn .dcgo')) break; await pg.waitForTimeout(200); }

    /* the overlook is a real place, derived, before anything is played */
    const where = await pg.evaluate(() => {
      const o = window.__VISTA && window.__VISTA.where();
      return o ? { x: o.x, y: o.y } : null;
    });
    ok('the overlook is a real derived cell (' + JSON.stringify(where) + ')', !!where);

    const d1 = await pg.evaluate(() => ({ day: DAY.day, open: window.__VISTA.isOpen(),
                                          beat: window.__VISTA_BEAT || 0 }));
    ok('DAY 1 does NOT open it -- day one is the cold open plus his first job',
       d1.day === 1 && d1.open === false && d1.beat === 0);

    /* the phone knows where to go, which is the half the row's sentence is about */
    const ph = await pg.evaluate(() => { const s = phoneState(); return s.vista; });
    ok('and the phone can LEAD him there (' + JSON.stringify(ph && ph.cell) + ', '
       + (ph ? ph.dist : '?') + ' cells)', !!ph && !!ph.cell && typeof ph.dist === 'number');

    /* PLAY DAY 1 THROUGH TO SLEEP, by tapping, and wake into day 2 */
    await pg.$eval('#daycardIn .dcgo', el => el.click());
    await pg.waitForTimeout(250);
    await pg.evaluate(() => { document.getElementById('sleepbtn').click(); });
    await pg.waitForTimeout(400);
    await pg.$eval('#daycardIn .dcgo', el => el.click());      /* SLEEP -> DAY 2 */
    await pg.waitForTimeout(600);
    const armedNotYet = await pg.evaluate(() => window.__VISTA.isOpen());
    ok('the DAY 2 card comes up FIRST and the valley waits behind it', armedNotYet === false);
    await pg.$eval('#daycardIn .dcgo', el => el.click());      /* GET UP */
    await pg.waitForTimeout(1400);

    const d2 = await pg.evaluate(() => ({ day: DAY.day, open: window.__VISTA.isOpen(),
                                          beat: window.__VISTA_BEAT || 0, seen: VISTA_SEEN,
                                          card: !!document.getElementById('vistaCard') }));
    ok('WAKING INTO DAY 2, THE VALLEY OPENS BY ITSELF -- the demo\'s money shot no '
       + 'longer depends on wandering onto one rim cell', d2.day === 2 && d2.open === true);
    ok('and it draws its card over the shot', d2.card === true);
    /* NOT BURIED. The whole reason this gate grew: green is not the same as seen. */
    const clear = await pg.evaluate(() => {
      const c = document.getElementById('daycard');
      return !c || getComputedStyle(c).display === 'none';
    });
    ok('AND THE WAKE CARD IS GONE -- the shot is not under a modal', clear === true);

    /* dismissible, and spent */
    await pg.evaluate(() => { window.__VISTA.close(); });
    await pg.waitForTimeout(200);
    const after = await pg.evaluate(() => ({ open: window.__VISTA.isOpen(), seen: VISTA_SEEN }));
    ok('he can leave it', after.open === false);
    ok('and it is spent, so it never ambushes him again', after.seen === true);

    /* ONCE EVER, ACROSS A RELOAD: the flag has to be in the save, not in memory */
    const rode = await pg.evaluate(() => {
      const snap = citySnapshot();
      return { inSave: snap.vistaSeen === true };
    });
    ok('and "once" survives the tab, because it rides the save', rode.inSave === true);

    /* a day 3 wake must not replay it */
    const d3 = await pg.evaluate(() => {
      const before = window.__VISTA_BEAT || 0;
      DAY.day = 2; VISTA_SEEN = true;
      DAY.nextDay();                       /* -> day 3 wake */
      return { day: DAY.day, open: window.__VISTA.isOpen(), beat: (window.__VISTA_BEAT || 0) - before };
    });
    ok('a later morning does NOT replay it (day ' + d3.day + ')', d3.open === false);

    ok('no page error across the beat' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  } finally { await b.close(); }
  done();
})().catch(e => { console.log('VISTA BEAT GATE CRASHED: ' + e.message); process.exit(1); });
