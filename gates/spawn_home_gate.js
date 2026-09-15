/* ============================================================================
   HE WAKES AT HIS OWN FRONT DOOR (9/15/26, RUN lane)
   VAMILY [spawn home] / HE-WAKES-IN-THE-MIDDLE-OF-A-FREEWAY.

   PAOLO 9/15, after playing the 9/14p cut: "it keeps spawning me in the middle of
   some freeway, street shit for no purpose. We can do a little better than that."

   WHAT THE GLASS SAID, before anything was written. Driven with the one driver on
   the served demo (rule 14g), and the map and his eyes were BOTH right:

     he woke at 6205,6271     the overmap says SUBURB, not freeway
     the 3x3 around that cell  4 of 9 cells ARTERIAL
     the photograph            a black cracked asphalt band down the whole right of
                               the screen, empty tan dirt under it, NOT ONE BUILDING
     homeDoorstep()            answered [6218,6256] immediately, no error
     window.__WOKE_HOME        0
     HOME_WAKE_PENDING         false

   So his own front door was TWENTY-NINE TILES AWAY and the code to put him there
   had worked the whole time. NOTHING EVER CALLED IT: homeWake() hangs off
   DAY.on('wake') and DAY ONE DOES NOT FIRE A WAKE, because the game boots already
   awake. I walked those tiles with the real pad and photographed the far end: a
   brick house wall, its yard, two bins, the HOME marker, and a neighbour saying
   "There it goes. Same hour as always." THE GOOD PICTURE WAS ALWAYS EIGHT SECONDS
   AWAY.

   THE FIX WAS A CALLER, NOT A FEATURE, and this gate guards the caller, because
   that is the thing that can rot. It does NOT assert a coordinate: where his house
   is belongs to the map and the seed, and pinning a number here would break the
   day somebody reseeds the valley.

   node gates/spawn_home_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const ROOT = path.join(__dirname, '..');
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const done = () => {
  console.log('HE WAKES AT HIS OWN DOOR: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
};

const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.png': 'image/png', '.json': 'application/json',
               '.webmanifest': 'application/manifest+json',
               '.txt': 'text/plain', '.bq': 'text/plain' };
function serve() {
  return new Promise(res => {
    const s = http.createServer((rq, rs) => {
      const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
      const f = path.join(ROOT, rel);
      if (f.indexOf(ROOT) !== 0 || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        rs.statusCode = 404; return rs.end('no');
      }
      rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
      fs.createReadStream(f).pipe(rs);
    });
    s.listen(0, '127.0.0.1', () => res(s));
  });
}

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); return done(); }

  const srv = await serve();
  /* SERVED, AND THE DEMO, because that is the only surface rule 14 talks about
     and because the city streams its tile banks with fetch(), which refuses the
     file:// scheme outright (this lane, 9/5). */
  const url = 'http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_DEMO.html';
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  try {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                           hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));

    await page.goto(url, { waitUntil: 'load', timeout: 240000 });
    await SETTLE(page, 3000);
    await page.tap('#front').catch(async () => { await page.click('#front').catch(() => { }); });
    await SETTLE(page, 90000, async () => {
      const f = page.frames().find(x => /BOHEMIA_CITY_WORLD/.test(x.url()));
      if (!f) return false;
      try { return await f.evaluate(() => typeof DAY !== 'undefined'
                                        && typeof homeDoorstep === 'function'); }
      catch (e) { return false; }
    });
    const city = page.frames().find(x => /BOHEMIA_CITY_WORLD/.test(x.url()));
    ok('the walked world is up', !!city);
    if (!city) { await browser.close(); srv.close(); return done(); }
    /* the arm is spent on the first human frame, so give the loop a few of them */
    await page.waitForTimeout(4000);

    const at = await city.evaluate(() => {
      const out = { hx, hy, day: DAY.day, woke: window.__WOKE_HOME || 0,
                    restored: window.__RESTORE_OK || 0 };
      try { const h = homeFind();
        out.home = h ? { cell: h.cell, door: h.door, x: h.x, y: h.y, w: h.w, h: h.h } : null; }
      catch (e) { out.home = null; }
      try { out.doorstep = homeDoorstep(); } catch (e) { out.doorstep = null; }
      /* how far he is from his own house's footprint, in tiles */
      if (out.home) {
        const dx = Math.max(out.home.x - hx, 0, hx - (out.home.x + out.home.w));
        const dy = Math.max(out.home.y - hy, 0, hy - (out.home.y + out.home.h));
        out.tilesFromHouse = dx + dy;
      }
      return out;
    });

    ok('it is day one and nothing was restored (day ' + at.day
      + ', restores ' + at.restored + ')', at.day === 1 && at.restored === 0);
    ok('he has a house at all (' + (at.home ? at.home.cell.x + ',' + at.home.cell.y : 'none') + ')',
       !!at.home);
    ok('and the game can name its doorstep ('
      + (at.doorstep ? at.doorstep.join(',') : 'null') + ')', !!at.doorstep);

    /* *** THE ROW. This is the leg that was red before the fix. *** */
    ok('*** THE DAY-ONE WAKE ACTUALLY RAN *** (__WOKE_HOME ' + at.woke + ')',
       at.woke >= 1);
    ok('*** AND HE IS STANDING ON HIS OWN DOORSTEP, NOT OUT ON THE ROAD *** ('
      + at.tilesFromHouse + ' tiles from his own house)',
       typeof at.tilesFromHouse === 'number' && at.tilesFromHouse <= 2);

    /* HIS OWN HOUSE IS ON SCREEN. The complaint was about what he SEES, so a
       coordinate is not enough: the house has to be in frame at phone size. */
    const inFrame = await city.evaluate(() => {
      try {
        const h = homeFind(); if (!h) return null;
        const half = { w: innerWidth / 2, h: innerHeight / 2 };
        const tw = (typeof TW === 'number') ? TW : 18;
        /* the house's nearest corner, in tiles from him, against what the screen holds */
        const dx = Math.max(h.x - hx, 0, hx - (h.x + h.w));
        const dy = Math.max(h.y - hy, 0, hy - (h.y + h.h));
        return { tilesX: dx, tilesY: dy, tw,
                 screenTilesX: Math.floor(half.w / tw), screenTilesY: Math.floor(half.h / tw) };
      } catch (e) { return null; }
    });
    ok('*** AND HIS HOUSE IS ON THE SCREEN WHEN HE OPENS HIS EYES *** ('
      + (inFrame ? inFrame.tilesX + ',' + inFrame.tilesY + ' tiles away, screen holds '
         + inFrame.screenTilesX + ',' + inFrame.screenTilesY : 'could not measure') + ')',
       !!inFrame && inFrame.tilesX <= inFrame.screenTilesX
                 && inFrame.tilesY <= inFrame.screenTilesY);

    /* AND IT IS A DOORSTEP, NOT A LEASH: one arm, spent once, so he can walk off. */
    await city.evaluate(() => { try { hx += 6; } catch (e) { } });
    await page.waitForTimeout(1500);
    const after = await city.evaluate(() => ({ woke: window.__WOKE_HOME || 0 }));
    ok('it fires ONCE and does not drag him back (' + after.woke + ' wakes)',
       after.woke === at.woke);

    ok('nothing threw' + (errs.length ? ' -- first: ' + errs[0] : ''), errs.length === 0);

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
