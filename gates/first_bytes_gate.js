/* ============================================================================
   FIRST BYTES — WHAT A FRIEND DOWNLOADS BEFORE HE CAN MOVE (8/21/26, RUN lane)

   THE DEMO BOARD'S DECISION, item 3: "THE PRELOAD OF THE RUN SLICE IS DEFERRED
   OR DROPPED once the migration lands -- 11 MB off the wire, which is most of
   the time-to-first-play problem, for free." The migration landed (sound, combat
   entry and payday are all in the city now, each with its own green gate), so
   the slice stopped being fetched. THIS IS THE GATE THAT KEEPS IT THAT WAY,
   because a preload is exactly the kind of thing that comes back by accident --
   it came back once already, from a DIFFERENT trigger than the one anybody knew
   about (see below).

   WHAT IT HOLDS, and only what it can prove:
     1. A normal boot -- open the link, tap the splash, wait until he can move --
        does NOT fetch slices/BOHEMIA_RUN_CURRENT.html. 17.8 MB, for a panel the
        shell never displays.
     2. The frame and its data-src still EXIST, and the loader is still exported.
        Deferring must never become deleting: the board's own rule is "the run
        slice stays in the repo as the source of the wiring being migrated", and
        four gates still need it live.
     3. THE TWO MAPPINGS AGREE. The bug that made the timer fix insufficient was
        not the timer. The generic tab loader read `p-` + tab.dataset.p -- the
        panel NAMED AFTER the tab -- while the shell displays
        `(dataset.p==='run') ? 'city' : dataset.p`. Tapping RUN showed p-city and
        LOADED p-run. Two mappings of one tab, disagreeing, which is the same
        family as every other bug this lane found this week. Pinned so they
        cannot drift apart again.
     4. The bill is REPORTED, every run, biggest first. Not asserted -- the other
        numbers are other lanes' and a ceiling here would be this lane setting
        another lane's budget. But nobody should have to go looking for it.

   HOW IT COUNTS, and the first instrument was wrong: playwright's `response` and
   `requestfinished` DO NOT FIRE with a size for a large file:// iframe
   navigation. A probe built on them reported the total as 34.56 MB and the run
   slice as NOT FETCHED AT ALL -- for a file whose iframe src was demonstrably
   set at 2.5s and whose frame was live with 72 child nodes. The raw `request`
   event sees it. A NEGATIVE RESULT IS A CLAIM ABOUT YOUR INSTRUMENT UNTIL YOU
   HAVE SHOWN THE INSTRUMENT COULD HAVE SEEN A POSITIVE ONE, so this gate proves
   its own eyes first: it asserts it saw the two fetches it KNOWS must happen,
   and refuses to report "not fetched" from an instrument that saw nothing.

   node gates/first_bytes_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const ALPHA_FILE = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const RUN_FILE = path.join(ROOT, 'slices', 'BOHEMIA_RUN_CURRENT.html');

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('\n=== FIRST BYTES: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

const src = fs.readFileSync(ALPHA_FILE, 'utf8');
/* A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE, and this
   gate made that mistake against itself within five minutes of being written:
   "the old preload is gone" went red because the patch that removed it QUOTES
   the removed line verbatim in its own comment, which is the right thing for a
   comment to do. Anything asserting a line is ABSENT must read the code with the
   prose taken out. (Everything above this reads live declarations, which cannot
   hide in a comment, so they use `src`.) */
const code = src.replace(/\/\*[\s\S]*?\*\//g, '');

/* ---- the shape, before we boot anything ---------------------------------- */
ok('the run slice is still in the repo (deferring is not deleting)',
  fs.existsSync(RUN_FILE));
ok('its iframe and data-src still exist, so anything that needs it can still '
  + 'have it', /<iframe id="runFrame" data-src="BOHEMIA_RUN_CURRENT\.html"/.test(src));
ok('the loader is EXPORTED by name -- a dependency you can grep beats one that '
  + 'happens on a timer', /window\.__loadRunSlice\s*=\s*runLoad;/.test(src));
ok('and NOTHING in the shell calls it: the product never needs the run slice, '
  + 'only gates do',
  (src.match(/__loadRunSlice\s*\(/g) || []).length === 0);
/* THE TWO MAPPINGS. This is the bug that made the timer fix insufficient. */
ok('THE TAB-TO-PANEL RULE IS THE SHELL\'S, IN BOTH PLACES: the generic tab '
  + 'loader maps run->city exactly as the shell does, so tapping RUN can never '
  + 'again display one panel while loading another',
  /var _pid=\(tab\.dataset\.p==='run'\)\?'city':tab\.dataset\.p;/.test(src)
  && /var PANEL = \(t\.dataset\.p==='run'\) \? 'city' : t\.dataset\.p;/.test(src));
ok('and the old unconditional preload is gone (checked against the CODE, not '
  + 'the comment that quotes it)',
  !/setTimeout\(runLoad,\s*2500\)/.test(code));

(async () => {
  const { chromium } = playwright();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const asked = [];
  const errs = [];
  page.on('request', r => asked.push(r.url().split('/').pop().split('?')[0]));
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
  try {
    await page.goto('file://' + ALPHA_FILE, { waitUntil: 'load', timeout: 180000 });
    await page.waitForTimeout(3000);
    await page.click('#front').catch(() => { });

    /* wait for the real thing: he can move. Not a duration -- the whole point of
       this gate is what happens BEFORE this moment. */
    let playable = false;
    for (let i = 0; i < 80; i++) {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (f) {
        try {
          playable = await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1
            && document.querySelectorAll('#pad .pb').length === 8);
        } catch (e) { playable = false; }
      }
      if (playable) break;
      await page.waitForTimeout(500);
    }
    ok('he can actually move -- otherwise "it downloaded less" is not a fact '
      + 'about a playable game', playable === true);
    /* and give any timer-based preload its chance to fire, so the bill is honest */
    await page.waitForTimeout(7000);

    /* PROVE THE INSTRUMENT FIRST. If it cannot see the two fetches that MUST
       happen, its silence about a third one means nothing. */
    const sawAlpha = asked.some(u => /BOHEMIA_ALPHA_0_9\.html/.test(u));
    const sawCity = asked.some(u => /BOHEMIA_CITY_WORLD\.html/.test(u));
    ok('THE INSTRUMENT CAN SEE: it observed the alpha and the city world being '
      + 'fetched, so a report of "not fetched" is about the build and not about '
      + 'a blind probe (' + asked.length + ' requests seen)', sawAlpha && sawCity);

    if (sawAlpha && sawCity) {
      const ranSlice = asked.filter(u => /BOHEMIA_RUN_CURRENT\.html/.test(u));
      ok('*** A NORMAL BOOT DOES NOT DOWNLOAD THE RUN SLICE *** -- 17.8 MB for a '
        + 'panel the shell never displays, gone from every player\'s first '
        + 'seconds (requested ' + ranSlice.length + ' time(s))', ranSlice.length === 0);
    }

    ok('and no page error came of removing it' + (errs.length ? ' -- ' + errs[0] : ''),
      errs.length === 0);

    /* ---- THE BILL, REPORTED. Not asserted: the rest is other lanes'. ------ */
    const sizes = asked.map(u => {
      const p2 = path.join(ROOT, 'slices', u);
      let n = 0;
      try { n = fs.statSync(p2).size; } catch (e) {
        try { n = fs.statSync(path.join(ROOT, 'engine', u)).size; } catch (e2) { n = 0; }
      }
      return { u, n };
    }).filter(x => x.n > 0).sort((a, b) => b.n - a.n);
    const tot = sizes.reduce((a, x) => a + x.n, 0);
    console.log('\n  WHAT HE DOWNLOADS BEFORE HE CAN MOVE -- '
      + (tot / 1048576).toFixed(1) + ' MB, biggest first:');
    for (const x of sizes) {
      console.log('    ' + x.u.slice(0, 40).padEnd(42)
        + (x.n / 1048576).toFixed(2).padStart(7) + ' MB');
    }
    console.log('  (reported, not asserted -- the rest of this bill belongs to '
      + 'other lanes and a ceiling here would be RUN setting their budget)');
  } finally { await browser.close(); }
  done();
})().catch(e => {
  console.log('  > FAIL the boot ran without throwing -- ' + e.message);
  fail++;
  console.log('\n=== FIRST BYTES: ' + pass + ' passed, ' + fail
    + ' failed (CRASHED after claim ' + (pass + fail - 1) + ') ===');
  process.exit(1);
});
