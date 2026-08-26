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
const zlib = require('zlib');
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
/* 44 -> 30 MB on 8/26, and NOTHING IN THE GAME CHANGED TO EARN IT. The test server sends
   gzip now, like the real host does, so these count what actually crosses the wire instead of
   what sits on disk: 40.76 -> 25.88 MB total, 2.84 -> 1.05 MB after the tap. Every byte
   number this gate ever printed was a host that does not exist. */
const CEIL_TOTAL = 30 * 1048576;   // everything a cold visitor pulls to reach the world
/* THE ONE THAT MOVED. 36 -> 6 MB on 8/24, and this is the whole point of a ratchet:
   the bank was split into 8 cacheable chunks and the splash now warms them, so the wait
   after the tap went 32.38 MB -> 2.65 MB. Measured, both times, from the server's side.
   6 MB is that result with room for the world page to grow, and NOT room for anybody to
   put another art bank back on the far side of the tap. */
const CEIL_AFTER = 2 * 1048576;    // the part AFTER the tap -- the wait he actually stares at

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };

let pass = 0; const fails = [];
const ok = (n, c) => { if (c) pass++; else fails.push(n); };
const MB = b => (b / 1048576).toFixed(2) + ' MB';

(async () => {
  /* a static host that behaves like one: real cache headers on assets, so what the browser
     reuses here is what it would reuse in production. */
  const hits = [];
  const wire = {};        // basename -> bytes that actually crossed, compressed if compressed
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); return res.end('no');
    }
    const base = path.basename(file);
    hits.push(base);
    const ext = path.extname(file);
    /* GZIP, BECAUSE THE REAL HOST DOES (8/26). Every number this gate has ever printed was
       measured off a server that sends the bytes raw, and GitHub Pages compresses text on the
       fly -- it is fronted by a CDN that does gzip (not brotli; that has been asked for since
       2019 and is still not there). So the wait it reported was a phone that does not exist,
       and it was pessimistic by whatever these files happen to compress to:

           BOHEMIA_CITY_WORLD.html   2.68 MB -> 0.99 MB   (37%)
           BOHEMIA_CITY_TILES_01.js  1.75 MB -> 1.26 MB   (72%)
           BOHEMIA_CITY_PROPS.js     1.72 MB -> 1.29 MB   (75%)

       Base64 art barely compresses -- it is already-compressed PNG bytes spelled out in
       letters -- and the page, which is source and comments, compresses hard. Sizing a demo's
       wait off the uncompressed number is the same mistake as sizing it off a headline
       bandwidth figure, which this gate already refuses to do one screen down.
       AND THE ACCOUNTING COUNTS THE COMPRESSED BYTES, because that is what a person's time
       and data plan actually pay for. Reading the file's size off disk after serving it
       gzipped would report a download nobody made. */
    const enc = String(req.headers['accept-encoding'] || '');
    const zippable = ['.html', '.js', '.css', '.json', '.webmanifest'].indexOf(ext) >= 0;
    if (zippable && /\bgzip\b/.test(enc)) {
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream',
                           'Content-Encoding': 'gzip',
                           'Cache-Control': 'public, max-age=600' });
      let n = 0;
      fs.createReadStream(file).pipe(zlib.createGzip({ level: 6 }))
        .on('data', d => { n += d.length; })
        .on('end', () => { wire[base] = n; })
        .pipe(res);
      return;
    }
    wire[base] = fs.statSync(file).size;
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
  const sizeOf = name => {
    if (wire[name] !== undefined) return wire[name];
    try { return fs.statSync(path.join(ROOT, 'slices', name)).size; } catch (e) { return 0; }
  };

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
  /* EMPTY, 8/24, AND IT CAME OFF THE SAME DAY IT WENT ON. BOHEMIA_CITY_TILES.js was here at
     29,398,564 bytes -- 8,674 sprites in one file, too big for any browser to cache, so it
     was re-downloaded on every cold visit and could not be warmed. tools/
     bohemia_city_chunk_tile_bank.py split it into 8 chunks of under 4 MB, proved they
     reassemble byte-identical, and the alpha warms them during the splash. The wait after
     the tap went 32.38 MB -> 2.65 MB. The entry is gone rather than left sitting green,
     which is what the stale-entry check below exists to force. */
  const SPLIT_DEBT = {};
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

  /* AND THE LIST STAYS HONEST. A file that got split and stayed listed hides the next one.
     THE MISSING-FILE HOLE, found 8/24 the moment the debt was actually paid: this read
     `sizeOf(n) && ...`, and sizeOf returns 0 for a file that no longer exists -- so a debt
     entry naming a DELETED file was silently skipped instead of flagged. The one case the
     check exists for was the one case it could not see. A named file that is gone counts as
     fixed, loudly. */
  const fixed = Object.keys(SPLIT_DEBT).filter(n => sizeOf(n) <= totB * 0.5);
  ok('every file still named in the split debt is still oversized (a fixed entry left on the '
     + 'list is how a debt list quietly stops meaning anything)'
     + (fixed.length ? '  -- SPLIT AND STILL LISTED, take it off: ' + fixed.join(', ') : ''),
     !fixed.length);

  Object.entries(SPLIT_DEBT).forEach(([n, d]) =>
    console.log('  SPLIT DEBT: ' + n + ' ' + MB(sizeOf(n)) + ' -- ' + d.why));

  /* THE WARM LIST MUST BE THE CHUNKS THAT EXIST. The splash warms a hardcoded list of
     filenames; the chunker owns that list and regenerates it. If the two ever drift, the
     warm-up 404s on every boot and the wait silently comes back -- and it would come back
     LOOKING like nothing changed, which is the worst kind of regression. So: every chunk on
     disk is warmed, and everything warmed exists. */
  const onDisk = fs.readdirSync(path.join(ROOT, 'slices'))
    .filter(f => /^BOHEMIA_CITY_TILES_\d+\.js$/.test(f)).sort();
  const alpha = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
  const warmed = (alpha.match(/BOHEMIA_CITY_TILES_\d+\.js/g) || []);
  const notWarmed = onDisk.filter(f => !warmed.includes(f));
  const ghosts = warmed.filter(f => !onDisk.includes(f));
  ok('the splash warms every tile chunk that exists (' + onDisk.length + ' chunks)'
     + (notWarmed.length ? '  -- on disk but never warmed: ' + notWarmed.join(', ') : ''),
     onDisk.length > 0 && !notWarmed.length);
  ok('the splash warms nothing that has been deleted (a 404 on every boot, and the wait '
     + 'comes back looking like nothing changed)'
     + (ghosts.length ? '  -- warmed but gone: ' + [...new Set(ghosts)].join(', ') : ''),
     !ghosts.length);

  /* AND THE OLD MONOLITH MUST STAY GONE. Regenerating it beside the chunks would double the
     art in the repo and quietly re-create the un-cacheable file this all exists to kill. */
  ok('the un-cacheable single tile bank is gone and stays gone',
     !fs.existsSync(path.join(ROOT, 'slices/BOHEMIA_CITY_TILES.js')));

  await browser.close();

  /* AND NOW THE ONLY NUMBER THAT IS ACTUALLY ABOUT A PERSON.
     Every byte count above is measured on LOCALHOST -- infinite bandwidth, zero latency --
     which is correct for counting bytes and useless for answering "how long does he stare
     at it". Measured 8/25 on a throttled connection, the honest answer was nothing like the
     localhost one:

         connection   taps at once   reads splash 8s
         good 4G          9.2 s           2.3 s
         weak 4G         24.3 s          16.3 s

     The splash warm-up is real -- it is the whole difference between those two columns --
     but it can only help a player who WAITS, and the friend who taps the moment a button
     appears is the friend a demo has to survive. So the gate holds the impatient case on
     the weak profile: the worst thing a real person meets.

     3 Mbit down / 150 ms is the conservative end of what a weak 4G connection delivers, not
     its headline number. Sizing a wait off the headline is how you ship a demo that only
     works in the office. */
  const NET = { down: 3 * 1024 * 1024 / 8, up: 5e5, lat: 150 };
  /* 30 s -> 16 s on 8/25, and the ratchet is the point. Three things moved it, in this
     order, and only the last one was big:
       the bank split into cacheable chunks          32.4 MB -> 2.7 MB after the tap
       the warm-up ordered, and told to get out of
         the way the moment he taps                  no change on its own
       chunks 2..N stopped being <script defer> tags
         and became a loader that runs after the
         world is drawn                              28.6 s -> 10.8 s
     The middle one is worth naming as a near-miss: a deferred tag delays EXECUTION and not
     the DOWNLOAD, so eight sprite transfers opened during the parse and starved the 1.75 MB
     the world was waiting on. Reordering the warm-up could not fix that, because the warm-up
     was never the thing filling the pipe.
     16 s is 10.8 s with room for a slower CI box, and NOT room for anybody to put the art
     back on the critical path. */
  /* 16 -> 12 s on 8/26. The test server sends gzip now, like the real host does, so this is
     the first number here that is about the phone somebody actually holds: 11.1 s -> 8.4 s,
     and nothing in the game changed to earn it -- the old number was measuring a host that
     does not exist. 12 s is 8.4 with room for a slow box and none for putting the art back
     on the critical path. */
  const CEIL_TAP_TO_WORLD_MS = 12000;

  const b3 = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const c3 = await b3.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p3 = await c3.newPage();
  const cdp = await c3.newCDPSession(p3);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions',
    { offline: false, downloadThroughput: NET.down, uploadThroughput: NET.up, latency: NET.lat });
  const t0 = Date.now();
  await p3.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_ALPHA_0_9.html',
    { waitUntil: 'load', timeout: 300000 });
  const splashMs = Date.now() - t0;
  await p3.evaluate(() => { const f = document.querySelector('#front, #fronttap'); if (f) f.click(); });
  const tapAt = Date.now() - t0;
  let worldMs = -1;
  /* A DRAWN WORLD, NOT A CANVAS TAG. This waited on the EXISTENCE of #cv, and #cv is on
     line 181 of a 2.6 MB page -- the parser reaches it long before a single script has run,
     let alone drawn anything. That made the number track "has the page started arriving"
     instead of "can he see the city", and it flattered every change made to it. So it now
     reads PIXELS: a canvas with real width whose sampled colours are not all one value. A
     blank or single-fill canvas has one colour; a world has dozens. Same lesson as the art
     probes that ate this week -- an instrument pointed at the wrong surface is confidently
     wrong, and confidently wrong is worse than red. */
  try {
    await p3.waitForFunction(() => {
      const fr = [...document.querySelectorAll('iframe')].find(f => /CITY_WORLD/.test(f.src || ''));
      try {
        const c = fr && fr.contentWindow && fr.contentWindow.document.getElementById('cv');
        if (!c || !c.width || !c.height) return false;
        const d = c.getContext('2d').getImageData(0, 0, Math.min(c.width, 120), Math.min(c.height, 120)).data;
        const seen = new Set();
        for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 8) seen.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]);
        return seen.size > 8;
      } catch (e) { return false; }
    }, null, { timeout: 300000 });
    worldMs = Date.now() - t0;
  } catch (e) {}
  await b3.close();
  const waitMs = worldMs > 0 ? worldMs - tapAt : -1;
  console.log('  ON A WEAK 4G PHONE, TAPPING AT ONCE: splash ' + (splashMs / 1000).toFixed(1)
    + 's, world ' + (worldMs > 0 ? (worldMs / 1000).toFixed(1) + 's' : 'NEVER')
    + ', WAIT AFTER THE TAP ' + (waitMs > 0 ? (waitMs / 1000).toFixed(1) + 's' : '-'));

  ok('the world actually appears on a weak 4G phone (3 Mbit / 150 ms) for a player who taps '
     + 'the moment the splash does', worldMs > 0);
  ok('and the wait after that tap is at most ' + (CEIL_TAP_TO_WORLD_MS / 1000) + 's (measured '
     + (waitMs > 0 ? (waitMs / 1000).toFixed(1) : '?') + 's). This is the number a friend '
     + 'experiences, and it only ever comes down',
     waitMs > 0 && waitMs <= CEIL_TAP_TO_WORLD_MS);

  /* THE WORLD SURVIVES WITHOUT ITS ART, and this claim is the whole reason progressive
     loading is reachable at all. Measured 8/25: block the bank and the city used to be a
     BLACK VOID with `ReferenceError: HERO_SRC is not defined` -- the page reads the bank's
     eight names at module scope, so an absent bank killed the script before a pixel landed.
     The chunker now declares all eight in CHUNK 1 (1.75 MB) and every later chunk MUTATES
     rather than re-binds, so with 26 MB of sprites blocked the same build renders a playable
     world -- ground, character, HUD, cold open, quest card, movement pad -- with zero errors.

     Gated because it is invisible. Nothing a player sees depends on it today; it would rot
     silently the first time somebody moved a declaration out of chunk 1, and the next person
     to try progressive loading would find a black screen and no idea why. */
  const b2 = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const c2 = await b2.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p2 = await c2.newPage();
  const errs2 = [];
  p2.on('pageerror', e => errs2.push(String(e).slice(0, 140)));
  await p2.route(/BOHEMIA_CITY_TILES_(?!01)\d\d\.js/, r => r.abort());
  await p2.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_ALPHA_0_9.html',
    { waitUntil: 'load', timeout: 240000 });
  await SETTLE(p2, 4000);
  await p2.evaluate(() => { const f = document.querySelector('#front, #fronttap'); if (f) f.click(); });
  await SETTLE(p2, 9000);
  const fr2 = p2.frames().find(f => /CITY_WORLD/.test(f.url()));
  let bare = null;
  if (fr2) {
    try {
      await fr2.waitForFunction(() => typeof om !== 'undefined' && typeof realizeCell === 'function',
        null, { timeout: 90000 });
      bare = await fr2.evaluate(() => {
        const c = realizeCell(hx | 0, hy | 0);
        return { fams: Object.keys(TP_TILES || {}).length, ground: !!(c && c.g) };
      });
    } catch (e) { bare = { threw: e.message.slice(0, 90) }; }
  }
  ok('THE WORLD BUILDS WITH ITS ART BLOCKED: chunk 1 declares every name the page reads, so '
     + '26 MB of missing sprites costs texture and nothing else. Without this, progressive '
     + 'loading is a black screen'
     + (bare && bare.threw ? '  -- ' + bare.threw : ''),
     !!(bare && bare.ground && bare.fams === 0));
  ok('and it does it with NO page error (the old failure was ReferenceError: HERO_SRC is not '
     + 'defined, thrown before a pixel was drawn)'
     + (errs2.length ? '  -- ' + errs2.slice(0, 2).join(' | ') : ''), errs2.length === 0);
  console.log('  ART BLOCKED: world builds=' + !!(bare && bare.ground)
    + '  families=' + (bare ? bare.fams : '?') + '  errors=' + errs2.length);
  await b2.close();

  server.close();
  fails.forEach(f => console.log('  FAIL: ' + f));
  console.log('TIME TO PLAY GATE: ' + pass + ' passed, ' + fails.length + ' failed');
  process.exit(fails.length ? 1 : 0);
})();
