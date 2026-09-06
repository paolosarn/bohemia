/* ============================================================================
   THE SHADOW OF WHAT YOU DID (9/6/26, RUN lane)
   VAMILY [drains shown] / BB-THE-SHADOW-OF-WHAT-YOU-DID.

   THE ROW: "the end-of-day card says it in the verb's own words -- the day ate
   one food, the night ate two power, the bell ate one tape -- READ STRAIGHT OFF
   THE LEDGER'S `drain` REASONS, NEVER A SECOND TABLE."

   HALF OF IT WAS ALREADY BUILT, AND FINDING THAT BEFORE BUILDING ANYTHING IS THE
   RULE THIS REPO LEARNED THE EXPENSIVE WAY. WORLD's [living costs] shipped the
   verb lines -- grouped, first-happened-first, in each verb's own words. That
   work is kept, not replaced.

   *** WHAT WAS MISSING IS THE CLAUSE IN CAPITALS. *** SPENT_TODAY is a second
   table, written by upkeepPost alone, and the ledger has THREE drain writers:

       upkeepPost(day:ate | night:power | fight:plate | ask:leaned)   ON THE CARD
       debit(..., 'buy:'   + goodId)  -- everything you BUY at a market   SILENT
       debit(..., 'build:' + type)    -- everything you PUT UP            SILENT

   So the card named the four things that happen TO you and said nothing about
   the two things you DID -- which are the drains a player most obviously caused.
   Reading the entries fixes all of it at once, and a fourth writer tomorrow
   appears for free, which is what this gate's last check is for.

   *** AND ONE THING THE LEDGER STRUCTURALLY CANNOT TELL YOU, MEASURED. ***
   bohemia_purse's _post carries the comment "YOU CANNOT SPEND WHAT YOU DO NOT
   HAVE, and the refusal is part of the record" -- and the code RETURNS BEFORE
   PUSHING AN ENTRY. Proved in Node: a refused debit leaves zero entries. The
   comment and the code disagree, in another lane's module, so it is REPORTED
   here and not touched.
   That is why the fix has the shape it has: paid drains come off the ledger,
   where all three writers are, and the "could not pay it" lines can only come
   from SPENT_TODAY, which is the only thing that ever saw them. They cannot
   double-count, because a refused drain has no ledger twin -- and that is
   asserted below rather than assumed.

   ---- MUTATION PROOF, run 9/6 -------------------------------------------------
     * point the paid lines back at SPENT_TODAY -> 3 red, and the card loses
       everything you bought and everything you put up
     * drop the day filter -> 1 red, tonight's card showing five days of drains

   ---- AND THE ANCHOR THAT WOULD NOT MATCH, TWICE -----------------------------
   The patch tool's render anchor was hand-typed with a literal em dash and
   multiply sign. The file writes them as \u2014 and \u00d7, so it matched ZERO
   times and the assert caught it -- twice, because the first fix escaped the
   backslash one level too deep inside a raw string. The anchor is BUILT from the
   file's own escapes now rather than retyped. An assert that fires is the tool
   working; a tool that had quietly replaced nothing would have shipped a card
   that still read the side table.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const ROOT = path.join(__dirname, '..');
const SLICES = path.join(ROOT, 'slices');
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const P = require(path.join(ROOT, 'engine/bohemia_purse.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const done = () => {
  console.log('SHADOW OF WHAT YOU DID: ' + pass + ' passed, ' + fail + ' failed');
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

/* ---- 1. THE LEDGER REALLY CANNOT SEE A REFUSAL --------------------------- */
{
  const p = P.create({ day: 1 });
  P.credit(p, 'resources', 1, 'test:seed', null, 1);
  const paid = P.debit(p, 'resources', 1, 'buy:rice', 'rice', 1);
  const broke = P.debit(p, 'resources', 5, 'buy:water', 'water', 1);
  ok('a paid drain lands in the ledger', paid.applied === true);
  ok('a refused one does not, whatever the comment beside it says (' + broke.reason
    + ')', broke.applied === false);
  ok('*** SO THE LEDGER HOLDS EXACTLY ONE DRAIN, NOT TWO *** -- which is why the '
    + 'shortfall lines still come from the side table, and why they cannot '
    + 'double-count', p.entries.filter(e => e.kind === 'drain').length === 1);
}

/* ---- 2. THE RENDER READS THE LEDGER ------------------------------------- */
{
  const city = fs.readFileSync(path.join(SLICES, 'BOHEMIA_CITY_WORLD.html'), 'utf8');
  ok('ctDrainsToday exists and reads purse entries',
     /function ctDrainsToday\(p, day\)/.test(city) && /e\.kind !== 'drain'/.test(city));
  ok('*** AND THE PAID LINES ON THE CARD COME FROM IT, NOT FROM THE SIDE TABLE ***',
     /_drains = ctDrainsToday\(purseGet\(\), DAY\.day\)/.test(city));
  ok('the side table is still read for the one thing only it saw -- what you '
    + 'could not pay', /if\(sp\.paid\) continue;/.test(city));
  ok('and it is not read for anything else, so there is one source for what '
    + 'happened', (city.match(/SPENT_TODAY\.length/g) || []).length === 1);
}

/* ---- 3. THE REAL SURFACE ------------------------------------------------- */
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
          && typeof ctDrainsToday === 'function' && typeof showReckoning === 'function');
      } catch (e) { return false; }
    });
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('the walked world is up', !!city);
    if (!city) { await browser.close(); srv.close(); return done(); }

    const r = await city.evaluate(() => {
      const p = purseGet(), day = DAY.day;
      const out = { before: ctDrainsToday(p, day).length };
      BohemiaPurse.credit(p, 'resources', 6, 'test:seed', null, day);
      BohemiaPurse.credit(p, 'electricity', 2, 'test:seed', null, day);
      /* THE TWO WRITERS THAT WERE SILENT */
      BohemiaPurse.debit(p, 'resources', 1, 'buy:rice', 'rice', day);
      BohemiaPurse.debit(p, 'resources', 1, 'buy:rice', 'rice', day);
      BohemiaPurse.debit(p, 'resources', 1, 'build:solar_rack', 'solar_rack', day);
      /* AND ONE OF THE FOUR VERBS, which must keep its own sentence verbatim */
      BohemiaPurse.debit(p, 'electricity', 1, 'night:power', 'circuit 1', day);
      /* A DRAIN ON ANOTHER DAY, which must not appear on tonight's card */
      BohemiaPurse.debit(p, 'resources', 1, 'buy:water', 'water', day + 1);
      /* A REASON NOTHING IN THE GAME WRITES YET: a fourth writer, tomorrow */
      BohemiaPurse.debit(p, 'resources', 1, 'mend:boots', 'boots', day);
      const rows = ctDrainsToday(p, day);
      out.rows = rows.map(d => ({ reason: d.reason, about: d.about, n: d.n, amount: d.amount }));
      out.otherDay = ctDrainsToday(p, day + 1).length;
      return out;
    });

    const by = k => (r.rows || []).find(x => x.reason === k);
    ok('the day starts with nothing drained', r.before === 0);
    ok('*** EVERYTHING YOU BOUGHT IS ON IT NOW *** ('
      + JSON.stringify(by('buy:rice')) + ')',
       !!by('buy:rice') && by('buy:rice').n === 2 && by('buy:rice').amount === 2
       && /bought rice/.test(by('buy:rice').about));
    ok('*** AND EVERYTHING YOU PUT UP *** (' + JSON.stringify(by('build:solar_rack')) + ')',
       !!by('build:solar_rack') && /put up a solar rack/.test(by('build:solar_rack').about));
    ok('the four upkeep verbs still speak in their OWN words, taken from the '
      + 'frozen table rather than reworded here ('
      + (by('night:power') || {}).about + ')',
       !!by('night:power')
       && by('night:power').about === 'every lit circuit you hold burned one');
    ok('a drain on another day is not on tonight\'s card (' + r.otherDay + ' there)',
       r.otherDay === 1);
    ok('*** AND A WRITER NOTHING HAS BUILT YET APPEARS FOR FREE *** -- which is '
      + 'the whole point of reading the ledger instead of a table somebody has to '
      + 'remember to update (' + (by('mend:boots') || {}).about + ')',
       !!by('mend:boots') && by('mend:boots').about.indexOf('boots') >= 0);

    const card = await city.evaluate(() => {
      try { showReckoning(); } catch (e) { return 'THREW: ' + e.message; }
      const d = document.getElementById('daycard');
      return d ? (d.textContent || '').replace(/\s+/g, ' ') : 'NO CARD';
    });
    ok('and the card he reads says all of it', /bought rice/.test(card)
      && /put up a solar rack/.test(card) && /lit circuit/.test(card));
    ok('with the count where a verb happened more than once', /rice ×2/.test(card));
    ok('nothing threw building it' + (errs.length ? ' -- first: ' + errs[0] : ''),
       errs.length === 0);
    console.log('  card said: ' + card.slice(0, 200));

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
