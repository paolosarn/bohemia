/* LATE ART GATE (8/25/26, WORLD lane).
 *
 * THE 28 MB TILE BANK NO LONGER BLOCKS THE WORLD, and this gate is the thing that stops
 * that from silently un-shipping itself.
 *
 * Chunk 1 (1.75 MB) is a blocking script and declares all eight bank names. The other 26 MB
 * of sprites are NOT in the markup at all: a small deferred loader waits until a world is
 * actually drawn, then pulls them itself, in order, one at a time, and calls __tilesArrived()
 * to re-bake the banks that were declared empty and repaint. Measured on a 3 Mbit phone by a
 * player who taps the moment the splash appears: 28.6 s before, 10.8 s after.
 *
 * EVERY PIECE OF THAT CAN FAIL WITHOUT ANY ERROR ANYWHERE. Add a bank that bakes at parse
 * time and forget to re-bake it, and it is empty forever. Drop the READY call, and every
 * late bank is empty forever. Flush before the world has drawn, and the repaint hits an
 * empty cache and never comes back. Let a chunk run out of order and the banks are wrong
 * rather than late. All of those happened while this was being built. The page throws
 * nothing and the world simply renders without its art.
 *
 * SO IT IS PROVED BY LOOKING, IN CITY MODE, WITH A CONTROL -- AND THAT PART IS THE STORY.
 * Four honest instruments in a row said a world with all 24 sprite families and a world with
 * ZERO were the same picture, and every one of them was RIGHT. None of the late art is on
 * the walked street view: HERO_SRC is read only by renderCity(), TP_TILES only by the tile
 * painter, DOOR_ANIM only when a door swings. The spawn screen is drawn from chunk 1.
 * Days went into rebuilding rulers that were never lying; the fault was pointing them at a
 * surface where the answer could not appear. CITY MODE is where the difference lives, and
 * there it is not subtle -- painted grey blocks versus flat red prisms, obvious at a glance.
 *
 * So: three boots, and the control has to pass before the answer is believed.
 *
 *     normal    chunks 2..N forced back to blocking      the world we shipped before
 *     shipped   the page exactly as it ships             the claim under test
 *     blocked   chunks 2..N never arrive                 the floor
 *
 *   node gates/late_art_gate.js
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = path.dirname(__dirname);
const { settle: SETTLE } = require(path.join(ROOT, 'gates/bohemia_settle.js'));
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };

/* HOW MUCH DETAIL THE PICTURE HAS, and why it is counted this way. A raw pixel checksum is
   not an identity here -- the day loop moves light and people, so the same build hashes
   differently on every repaint (measured: three values in one run, nothing touched but a
   forced redraw). Painted sprites put detail next to detail; the flat fallback fills whole
   faces with one colour. Counting neighbouring pixels that DISAGREE reads texture and
   ignores what hour it is. */
const DETAIL = () => {
  const c = document.getElementById('cv'); if (!c) return -1;
  const w = Math.min(c.width, 512), h = Math.min(c.height, 900);
  const d = c.getContext('2d').getImageData(0, 0, w, h).data;
  let n = 0, e = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w - 1; x++) {
    const i = (y * w + x) * 4, j = i + 4;
    if (d[i + 3] <= 8 || d[j + 3] <= 8) continue;
    n++;
    if (Math.abs(d[i] - d[j]) + Math.abs(d[i + 1] - d[j + 1]) + Math.abs(d[i + 2] - d[j + 2]) > 24) e++;
  }
  return n ? Math.round(e * 1000 / n) : -1;
};

const BANKS = () => ({
  tpTiles: Object.keys(typeof TP_TILES !== 'undefined' ? TP_TILES : {}).length,
  tpImg:   Object.keys(typeof TP_IMG !== 'undefined' ? TP_IMG : {}).length,
  tpCats:  (typeof TP_CATS !== 'undefined' ? TP_CATS.length : -1),
  heroSrc: Object.keys(typeof HERO_SRC !== 'undefined' ? HERO_SRC : {}).length,
  heroImg: Object.keys(typeof HERO_IMG !== 'undefined' ? HERO_IMG : {}).length,
  doorSrc: (typeof DOOR_ANIM !== 'undefined' ? DOOR_ANIM.length : -1),
  doorImg: (typeof DOOR_ANIM_IMG !== 'undefined' ? DOOR_ANIM_IMG.length : -1),
  decoded: (function () {
    if (typeof TP_IMG === 'undefined') return -1;
    let n = 0, ok = 0;
    for (const k in TP_IMG) for (const im of TP_IMG[k]) { n++; if (im && im.complete && im.naturalWidth > 0) ok++; }
    for (const k in (typeof HERO_IMG !== 'undefined' ? HERO_IMG : {})) {
      const im = HERO_IMG[k]; n++; if (im && im.complete && im.naturalWidth > 0) ok++;
    }
    return n ? Math.round(ok * 100 / n) : -1;
  })(),
});

let pass = 0; const fails = [];
const ok = (n, c) => { if (c) pass++; else fails.push(n); };

let PORT = 0;
async function boot(mode) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  /* THE SERVICE WORKER FETCHES NAVIGATIONS ITSELF, so page-level interception never fires
     for the city frame unless workers are blocked. That cost a whole probe generation. */
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
                                         serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));

  if (mode === 'normal') {
    /* REBUILD THE OLD WORLD TO COMPARE AGAINST: every chunk a blocking tag, exactly as the
       page carried them before any of this, so the banks are full before the parse-time
       bakes run and no re-bake is involved at all. That is the picture the shipped page has
       to match. */
    const all = fs.readdirSync(path.join(ROOT, 'slices'))
      .filter(f => /^BOHEMIA_CITY_TILES_\d+\.js$/.test(f)).sort();
    await page.route('**/BOHEMIA_CITY_WORLD.html', async route => {
      const r = await route.fetch(); let body = await r.text();
      const tag = '<script defer src="BOHEMIA_CITY_TILES_LATE.js"></script>';
      if (body.indexOf(tag) < 0) throw new Error('no LATE loader tag -- the page changed shape');
      body = body.replace(tag, all.slice(1).map(f => '<script src="' + f + '"></script>').join('\n'));
      await route.fulfill({ response: r, body });
    });
  } else if (mode === 'blocked') {
    await page.route(/BOHEMIA_CITY_TILES_(?!01)\d\d\.js/, r => r.abort());
  }

  await page.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ALPHA_0_9.html', { waitUntil: 'load', timeout: 240000 });
  await SETTLE(page, 4000);
  await page.evaluate(() => { const f = document.querySelector('#front, #fronttap'); if (f) f.click(); });
  await SETTLE(page, 9000);
  const fr = page.frames().find(f => /CITY_WORLD/.test(f.url()));
  if (!fr) { await browser.close(); return { errs, banks: null, receipt: null, detail: -1 }; }
  await fr.waitForFunction(() => typeof om !== 'undefined', null, { timeout: 90000 });
  /* THE DAY 1 CARD SITS OVER THE CANVAS. Read the pixels through it and every mode looks
     like the card. Dismiss first, then look. */
  await fr.evaluate(() => {
    const w = /^(GET UP|NOT NOW|CLOSE|OK)$/i;
    for (const el of document.querySelectorAll('button,[role=button],a,div')) {
      const t = (el.textContent || '').trim();
      if (t && t.length < 12 && w.test(t) && el.offsetParent !== null) { try { el.click(); } catch (x) {} }
    }
  });
  await SETTLE(page, 7000);
  const banks = await fr.evaluate(BANKS);
  const receipt = await fr.evaluate(() => window.__TILES_LATE || null);
  await fr.evaluate(() => { try { MODE = 'city'; render(); } catch (e) {} });
  await SETTLE(page, 4000);
  const detail = await fr.evaluate(DETAIL);
  await browser.close();
  return { errs, banks, receipt, detail };
}

(async () => {
  /* SOURCE FIRST, and it is not a formality: if a tool rewrites the bank and forgets the
     attribute, every runtime claim below still passes -- on a page that blocks 28 MB. */
  const page = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  const tags = (page.match(/<script (?:defer )?src="BOHEMIA_CITY_TILES_[^"]+"><\/script>/g) || []);
  const chunks = fs.readdirSync(path.join(ROOT, 'slices')).filter(f => /^BOHEMIA_CITY_TILES_\d+\.js$/.test(f)).sort();
  ok('chunk 1 is blocking and it is the ONLY chunk in the markup (it declares the bank names)',
     tags.length === 2 && tags[0] === '<script src="BOHEMIA_CITY_TILES_01.js"></script>');
  /* AND THE OTHER 26 MB ARE NOT TAGS AT ALL. `defer` was the obvious answer and it was the
     wrong one: it delays EXECUTION, not the download, so the browser opened all eight sprite
     transfers during the parse and starved the one chunk the world was waiting on.
     Measured at 3 Mbit, tapping at once: 28.6 s as deferred tags, 10.8 s pulled by the
     loader. If anybody puts them back in the markup, this line is what says so. */
  ok('chunks 2..' + chunks.length + ' are NOT script tags -- a deferred tag still downloads during the parse',
     !/<script[^>]*src="BOHEMIA_CITY_TILES_(?!01)\d\d\.js"/.test(page));
  ok('a small deferred loader is what pulls them', tags[1] === '<script defer src="BOHEMIA_CITY_TILES_LATE.js"></script>');
  const lateSrc = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_TILES_LATE.js'), 'utf8');
  const listed = (lateSrc.match(/BOHEMIA_CITY_TILES_\d+\.js/g) || []);
  ok('the loader lists every chunk after the first, in order (' + listed.length + ' of ' + (chunks.length - 1) + ')',
     listed.length === chunks.length - 1 &&
     listed.join(',') === chunks.slice(1).join(','));
  /* ORDER IS CORRECTNESS, NOT SPEED: every chunk after the first MUTATES what chunk 1
     declared, so a chunk running early is a wrong bank, not a slow one. */
  ok('the loader keeps them in order (async=false, chained on load)',
     /async\s*=\s*false/.test(lateSrc) && /onload\s*=\s*next/.test(lateSrc));
  ok('the loader ends by calling the re-bake', /BOHEMIA_CITY_TILES_READY\.js/.test(lateSrc));
  const readySrc = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_TILES_READY.js'), 'utf8');
  ok('the READY script actually calls __tilesArrived', /__tilesArrived/.test(readySrc));
  /* WHAT BLOCKS IS WHAT HE WAITS FOR. Chunk 1 is the whole blocking payload now; hold it. */
  const c1 = fs.statSync(path.join(ROOT, 'slices/BOHEMIA_CITY_TILES_01.js')).size;
  const CEIL_BLOCKING = 2 * 1048576;
  ok('the blocking chunk stays small: ' + (c1 / 1048576).toFixed(2) + ' MB of ' + (CEIL_BLOCKING / 1048576) + ' MB',
     c1 <= CEIL_BLOCKING);

  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]); const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('no'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  PORT = server.address().port;

  const out = {};
  for (const m of ['normal', 'shipped', 'blocked']) {
    out[m] = await boot(m);
    const o = out[m], b = o.banks || {};
    console.log(m.padEnd(8) + ' families=' + String(b.tpTiles).padStart(3)
      + '  heroes=' + String(b.heroImg).padStart(3)
      + '  door clips=' + String(b.doorImg).padStart(3)
      + '  decoded=' + String(b.decoded).padStart(4) + '%'
      + '  CITY detail=' + String(o.detail).padStart(4) + '/1000'
      + '  errors=' + o.errs.length);
  }
  server.close();

  const D = m => out[m].detail;
  const b = out.shipped.banks || {};
  const n = out.normal.banks || {};

  /* THE CONTROL. Everything below is worthless if this line is false. */
  ok('CONTROL: with the art blocked the city is visibly flatter (' + D('normal') + ' vs ' + D('blocked') + ' per 1000)',
     D('normal') > D('blocked') * 1.3);
  /* THE ANSWER. */
  ok('the shipped build draws the same city as the all-blocking one (' + D('shipped') + ' vs ' + D('normal') + ')',
     D('normal') > 0 && Math.abs(D('shipped') - D('normal')) <= Math.max(12, D('normal') * 0.05));
  ok('and it is nowhere near the no-art floor (' + D('shipped') + ' vs ' + D('blocked') + ')',
     D('shipped') > D('blocked') * 1.3);

  /* THE BANKS THEMSELVES. Named one by one, because "the picture looks right" would still
     pass if a bank nobody can see from the spawn point were empty. */
  ok('late TP_TILES arrive: ' + b.tpTiles + ' families', b.tpTiles > 0 && b.tpTiles === n.tpTiles);
  ok('TP_IMG is re-baked from them, not left empty', b.tpImg === b.tpTiles);
  ok('TP_CATS is refilled in place (it is const, so emptied and re-pushed)', b.tpCats === b.tpTiles);
  ok('late HERO_SRC arrive and HERO_IMG is re-baked: ' + b.heroImg, b.heroSrc > 0 && b.heroImg === b.heroSrc && b.heroImg === n.heroImg);
  ok('late DOOR_ANIM arrive and DOOR_ANIM_IMG is refilled: ' + b.doorImg, b.doorSrc > 0 && b.doorImg === b.doorSrc);
  ok('every re-baked sprite actually DECODED (' + b.decoded + '%) -- an Image with a src has no pixels yet', b.decoded === 100);
  ok('with the art blocked the banks really are empty, so the control is not an accident',
     (out.blocked.banks || {}).tpTiles === 0);

  /* THE RECEIPT. It exists because every failure this feature had looked like success. */
  const r = out.shipped.receipt;
  ok('__tilesArrived ran on the shipped page', !!(r && r.called));
  ok('and it waited for the world before repainting (chunks drawn=' + (r && r.drawn) + ')', !!(r && r.flushed && r.drawn > 0));

  ok('no page errors in any of the three boots',
     out.normal.errs.length === 0 && out.shipped.errs.length === 0 && out.blocked.errs.length === 0);

  console.log('');
  fails.forEach(f => console.log('  FAIL  ' + f));
  console.log('LATE ART GATE: ' + pass + ' passed, ' + fails.length + ' failed');
  process.exit(fails.length ? 1 : 0);
})();
