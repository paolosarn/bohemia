/* ============================================================================
   THE FIRST MINUTE (9/13/26, RUN lane)
   VAMILY [drop in] / THE-FIRST-MINUTE-IS-THE-PROMISE.

   THE ROW: what a stranger who taps the link DOES in their first sixty seconds,
   IN ORDER, so they end that minute wanting the second one. One thing at a time:
   THE PAD, then SOMETHING TO LOOK AT, then SOMEBODY WHO WANTS SOMETHING.

   THIS GATE HOLDS ALL THREE BEATS ON THE SERVED DEMO, AND IT EXISTS BECAUSE THE
   MIDDLE ONE WAS REPORTED MISSING BY ME, WRONGLY, TWICE.

   *** THE CORRECTION THAT MATTERS MOST, AND IT IS MINE. *** On 9/11 this lane
   measured "one step is about a quarter of a tile, the nearest road district is
   128 fine tiles away, so a minute of walking meets nothing", and the coordinator
   turned that into [wake near]: MOVE THE SPAWN. Both numbers were wrong, and both
   were wrong because of my own harness:

     - one step moves a FULL tile, not a quarter. The quarter came from a probe
       doing four round trips and a 500ms sleep per step, timing itself.
     - a held press walks about 1.94 tiles a second.
     - and 128 fine tiles is the distance between CELL CENTRES, not the walk: the
       player wakes near the EDGE of his cell, so the next district is a few tiles
       away, not a hundred.

   MEASURED ON THE SERVED DEMO, holding the direction with the most room, which is
   what a stranger does: the arterial is reached in THREE SECONDS and a road
   moment fires in FIVE. Held toward it deliberately: reached in four, fired in
   ten. THE FIRST MINUTE ALREADY MEETS SOMETHING, and the spawn does not have to
   move to make that true.

   So this gate is the guard on a row that was nearly "fixed" twice by moving
   things that were not broken. It never asserts a number I derived; it holds the
   three beats a player actually gets.
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
const done = () => {
  console.log('THE FIRST MINUTE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

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

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); return done(); }

  const srv = await serve();
  const url = 'http://127.0.0.1:' + srv.address().port + '/BOHEMIA_DEMO.html';
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  try {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                           hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));

    await page.goto(url, { waitUntil: 'load', timeout: 240000 });
    await SETTLE(page, 2500);
    await page.tap('#front').catch(async () => { await page.click('#front').catch(() => { }); });
    await SETTLE(page, 90000, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try { return await f.evaluate(() => typeof DAY !== 'undefined'
                                        && typeof roadWhere === 'function'); }
      catch (e) { return false; }
    });
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('the walked world is up inside the first few seconds', !!city);
    if (!city) { await browser.close(); srv.close(); return done(); }
    await sleep(2500);

    /* ---- BEAT THREE, WHICH ARRIVES FIRST: SOMEBODY WANTS SOMETHING -------
       The wake card carries the day's job. This lane reported it missing once
       and was reading OFFER before showWake had run, so it waits for the ring. */
    let rang = 0;
    for (let i = 0; i < 40; i++) {
      rang = await city.evaluate(() => window.__OFFER_RANG || 0).catch(() => 0);
      if (rang > 0) break;
      await sleep(500);
    }
    const wake = await city.evaluate(() => {
      const inn = document.getElementById('daycardIn');
      return { text: (inn ? inn.textContent : '').replace(/\s+/g, ' ').trim(),
               offer: (typeof OFFER !== 'undefined' && OFFER)
                      ? { title: OFFER.title, how: OFFER.how } : null };
    });
    ok('*** SOMEBODY WANTS SOMETHING FROM HIM, and it is on the first card *** ('
      + (wake.offer ? wake.offer.title : 'nothing') + ')',
       !!wake.offer && !!wake.offer.title);
    ok('and the card says so in words, not just in a variable',
       /phone|came in/i.test(wake.text));

    /* ---- BEAT ONE: THE PAD, AND IT TEACHES THE VERB THAT MOVES YOU ------- */
    for (let i = 0; i < 6; i++) {
      await city.evaluate(() => {
        const c = document.getElementById('daycard');
        if (c && c.classList.contains('on')) { const g = c.querySelector('.dcgo'); if (g) g.click(); }
      }).catch(() => { });
      await sleep(350);
    }
    let lesson = '';
    for (let i = 0; i < 30; i++) {
      lesson = await city.evaluate(() => {
        const w = document.getElementById('teachwrap');
        return w ? (w.textContent || '').trim() : '';
      }).catch(() => '');
      if (lesson) break;
      await sleep(500);
    }
    /* A TAP MOVES ONE TILE. A HOLD MOVES ABOUT TWO A SECOND, and the latch keeps
       him going after he lets go. A lesson that only says "walk with this" leaves
       a stranger tapping, which is the difference between arriving and not. */
    ok('*** THE FIRST LESSON TEACHES THE HOLD, NOT JUST THE PAD *** (' + lesson + ')',
       /HOLD/i.test(lesson));

    /* ---- BEAT TWO: SOMETHING TO LOOK AT, INSIDE THE MINUTE ---------------
       Held the way a stranger holds: whichever direction has the most room, NOT
       aimed at a district he cannot see. */
    await city.evaluate(() => {
      window.__FIRED = [];
      const real = window.roadInterrupt;
      window.roadInterrupt = function () {
        const r = real.apply(this, arguments);
        if (r && r.fired) window.__FIRED.push(r.kind || 1);
        return r;
      };
    });
    const aim = await city.evaluate(() => {
      const D = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
      let bi = 0, bs = -1;
      for (let i = 0; i < 8; i++) {
        let n = 0;
        for (let k = 1; k <= 140; k++) {
          const c = cellAt(hx + D[i][0] * k, hy + D[i][1] * k);
          if (!c || !c.walk) break;
          n++;
        }
        if (n > bs) { bs = n; bi = i; }
      }
      return { dir: bi, room: bs, at: [hx, hy] };
    });
    ok('there is somewhere to walk from where he wakes (' + aim.room + ' clear cells)',
       aim.room >= 10);

    const padEl = await city.evaluate(d => {
      const all = document.querySelectorAll('#pad .pb');
      const el = all[d];
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }, aim.dir);
    ok('the walk pad is there to be held', !!padEl);
    if (!padEl) { await browser.close(); srv.close(); return done(); }

    const fEl = await page.$('iframe#cityFrame');
    const fb = await fEl.boundingBox();
    const t0 = Date.now();
    await page.mouse.move(fb.x + padEl.x, fb.y + padEl.y);
    await page.mouse.down();
    let firedAt = null, reached = null;
    for (let i = 0; i < 26 && !firedAt; i++) {
      await sleep(2500);
      const st = await city.evaluate(() => ({
        fired: (window.__FIRED || []).length,
        d: (function () { try { const w = roadWhere(); const c = om.at(w[0], w[1]);
              return (c && c.district) || '?'; } catch (e) { return '?'; } })()
      })).catch(() => ({ fired: 0, d: '?' }));
      if (!reached && st.d !== 'suburb' && st.d !== '?') reached = ((Date.now() - t0) / 1000).toFixed(0);
      if (st.fired > 0) firedAt = ((Date.now() - t0) / 1000).toFixed(0);
    }
    await page.mouse.up();

    ok('*** HOLDING ONE DIRECTION REACHES A DIFFERENT DISTRICT *** ('
      + (reached ? reached + 's' : 'never') + ')', !!reached && +reached <= 60);
    ok('*** AND SOMETHING HAPPENS TO HIM INSIDE THE FIRST MINUTE *** ('
      + (firedAt ? 'a road moment at ' + firedAt + 's' : 'nothing in 60s') + ')',
       !!firedAt && +firedAt <= 60);

    ok('nothing threw through the whole minute'
      + (errs.length ? ' -- first: ' + errs[0] : ''), errs.length === 0);

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
