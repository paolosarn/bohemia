/* TIME TO FIRST PLAY GATE (8/24/26, WORLD lane).
 *
 * NOTHING IN THIS REPO WATCHED THE ONE NUMBER THAT DECIDES WHETHER A FRIEND PLAYS THE DEMO
 * OR CLOSES THE TAB: how many megabytes their phone has to pull down before the world
 * appears. 412 gates and not one of them asked.
 *
 * MEASURED the day this was written, over real HTTP, cold cache, tapping the splash like a
 * person:
 *
 *     before the tap     8.10 MB
 *     AFTER the tap     32.38 MB     <-- 10.4 s of dead wait on LOCALHOST, zero latency
 *       BOHEMIA_CITY_TILES.js  28.04 MB   (8,674 tile sprites in one file)
 *       BOHEMIA_CITY_WORLD.html 2.62 MB
 *       BOHEMIA_CITY_PROPS.js   1.72 MB
 *
 * Not one byte of that starts downloading until the tap CREATES the city iframe, so the
 * whole payload is serialised after the only gesture a player makes. On cellular that is
 * minutes.
 *
 * WHY THIS IS A CEILING AND NOT A FIX. The obvious fix -- warm the cache during the splash
 * -- was built, measured, and REVERTED the same hour, because it makes things worse:
 * Chromium will not put a 28 MB response in its HTTP cache, so the warm-up downloads the
 * file and the iframe downloads it AGAIN. Proved from the server's own log: PROPS (1.7 MB)
 * was warmed and reused, TILES (28 MB) was requested twice, both 200. The fix is to SPLIT
 * the bank into chunks small enough to cache; until somebody does that, this gate exists so
 * the number cannot quietly grow.
 *
 * IT SERVES THE REPO OVER REAL HTTP ON PURPOSE. file:// has no cache semantics and no
 * transfer accounting, so a file:// measurement of this cannot be trusted -- which is the
 * whole VERIFY ON THE REAL SURFACE lesson applied to loading instead of to pixels.
 *
 *   node gates/time_to_play_gate.js
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = path.dirname(__dirname);
const { settle: SETTLE } = require(path.join(ROOT, 'gates/bohemia_settle.js'));

/* THE CEILINGS, IN BYTES, AND THEY ONLY EVER COME DOWN.
   Set from the 8/24 measurement plus a little headroom for a lane adding a sprite sheet --
   NOT enough headroom for a lane adding another art bank, which is the thing this stops.
   If you are here because the gate went red: you did not break it, you grew the download a
   friend waits through. Either shrink what you added or say out loud why it is worth it. */
const CEIL_TOTAL = 46 * 1048576;   // everything a cold visitor pulls to reach the world
const CEIL_AFTER = 36 * 1048576;   // the part AFTER the tap -- the wait he actually stares at

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };

let pass = 0; const fails = [];
const ok = (n, c) => { if (c) pass++; else fails.push(n); };
const MB = b => (b / 1048576).toFixed(2) + ' MB';

(async () => {
  /* a static host that behaves like one: real cache headers on assets, so what the browser
     reuses here is what it would reuse in production. */
  const hits = [];
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); return res.end('no');
    }
    hits.push(path.basename(file));
    const ext = path.extname(file);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream',
                         'Cache-Control': 'public, max-age=600' });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;

  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));

  /* BYTES ARE COUNTED FROM THE SERVER'S SIDE, not the browser's. A `response` event fires
     for cache hits too and still reports a content-length, so counting there would have
     scored a warm cache as a fresh download -- which is exactly the mistake that made the
     reverted warm-up look like it worked. The server only sees what actually crossed. */
  const sizeOf = name => { try { return fs.statSync(path.join(ROOT, 'slices', name)).size; } catch (e) { return 0; } };

  await page.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_ALPHA_0_9.html',
    { waitUntil: 'load', timeout: 240000 });
  await SETTLE(page, 4000);
  await page.waitForTimeout(3000);              // the beat a person spends reading the splash
  const cut = hits.length;

  await page.evaluate(() => { const f = document.querySelector('#front, #fronttap'); if (f) f.click(); });
  await SETTLE(page, 8000);

  const pre = hits.slice(0, cut), post = hits.slice(cut);
  const bytes = list => list.reduce((s, n) => s + sizeOf(n), 0);
  const preB = bytes(pre), postB = bytes(post), totB = preB + postB;

  ok('the alpha boots over HTTP and reaches the world with no page error', errs.length === 0);
  if (errs.length) errs.slice(0, 3).forEach(e => console.log('        ! ' + e));

  ok('A FRIEND DOWNLOADS AT MOST ' + MB(CEIL_TOTAL) + ' TO REACH THE WORLD (measured '
     + MB(totB) + '). This is the number that decides whether the demo gets played on a '
     + 'phone, and it only ever comes down', totB <= CEIL_TOTAL);

  ok('THE WAIT AFTER THE TAP IS AT MOST ' + MB(CEIL_AFTER) + ' (measured ' + MB(postB)
     + '). Everything here is serialised after the only gesture a player makes, so it is '
     + 'the part they stare at', postB <= CEIL_AFTER);

  /* NAME THE HEAVY ONE. A number alone tells a lane it broke something; naming the file
     tells them what. */
  const big = [...new Set(hits)].map(n => ({ n, b: sizeOf(n) })).sort((a, b) => b.b - a.b);
  console.log('  BEFORE THE TAP: ' + MB(preB) + '   AFTER THE TAP: ' + MB(postB)
    + '   TOTAL TO PLAY: ' + MB(totB));
  big.slice(0, 5).forEach(f => console.log('    ' + String(MB(f.b)).padStart(9) + '  ' + f.n));
  console.log('  ORDERED HITS: ' + hits.join(' -> '));

  /* THE SPLIT DEBT, named the way every other debt in this repo is named, because a red
     gate nobody can turn green gets ignored and then everything behind it gets ignored too.
     A file this size is not just heavy, it is UN-CACHEABLE: Chromium will not hold a 28 MB
     response, which is why warming it during the splash downloads it TWICE instead of once.
     The fix is to split the bank into chunks a browser will keep. Until then it is listed
     here with the size it had when it was listed, and IT MAY ONLY SHRINK. */
  const SPLIT_DEBT = {
    'BOHEMIA_CITY_TILES.js':
      { bytes: 29398564, why: '8,674 tile sprites in one file. Too big for the HTTP cache, '
        + 'so it cannot be warmed during the splash and is re-downloaded on every cold visit. '
        + 'SPLIT IT: tools/bohemia_city_split_tile_bank.py is the 8/6 precedent that pulled '
        + 'this bank out of the world page in the first place, one level shallower.' },
  };
  const heavy = big.filter(f => f.b > totB * 0.5);
  const unnamed = heavy.filter(f => !SPLIT_DEBT[f.n]);
  ok('no UNNAMED asset is more than half of everything a friend downloads'
     + (unnamed.length ? '  -- unnamed: ' + unnamed.map(f => f.n + ' ' + MB(f.b)).join(', ') : ''),
     !unnamed.length);

  const grown = Object.entries(SPLIT_DEBT)
    .map(([n, d]) => ({ n, was: d.bytes, now: sizeOf(n) }))
    .filter(r => r.now > r.was);
  ok('nothing on the split debt has GROWN since it was named'
     + (grown.length ? '  -- ' + grown.map(r => r.n + ' ' + MB(r.was) + ' -> ' + MB(r.now)).join(', ') : ''),
     !grown.length);

  /* AND THE LIST STAYS HONEST. A file that got split and stayed listed hides the next one. */
  const fixed = Object.keys(SPLIT_DEBT).filter(n => sizeOf(n) && sizeOf(n) <= totB * 0.5);
  ok('every file still named in the split debt is still oversized (a fixed entry left on the '
     + 'list is how a debt list quietly stops meaning anything)'
     + (fixed.length ? '  -- SPLIT AND STILL LISTED, take it off: ' + fixed.join(', ') : ''),
     !fixed.length);

  Object.entries(SPLIT_DEBT).forEach(([n, d]) =>
    console.log('  SPLIT DEBT: ' + n + ' ' + MB(sizeOf(n)) + ' -- ' + d.why));

  await browser.close();
  server.close();
  fails.forEach(f => console.log('  FAIL: ' + f));
  console.log('TIME TO PLAY GATE: ' + pass + ' passed, ' + fails.length + ' failed');
  process.exit(fails.length ? 1 : 0);
})();
