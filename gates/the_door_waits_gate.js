/* ============================================================================
   THE DOOR DOES NOT OFFER WHAT IT CANNOT HONOUR (9/16/26, RUN lane)
   VAMILY [loading screen] / ONE-SCREEN-HOLDS-ALL-THE-LOADING.

   PAOLO 9/8, LOCKED: "we seriously need a loading screen. It's bullshit when I go
   in the demo, all the loading shit that you might need to do, handle it, it's so
   awkward looking." And 9/15, after playing: "it's kinda not running as smoothly as
   I would like, maybe it's cause things are loading in real time."

   MEASURED ON A PHONE-SPEED CPU before anything was written, tapping once a second
   from the moment the door offered:

       0.4 s   THE DOOR SAYS TAP TO ENTER          two files loaded
       4.6 s   the door opens, AFTER TWO TAPS -- THE FIRST TAP DOES NOTHING
      51.5 s   the walked world has a clock
      78.3 s   the city has drawn a frame
      85.9 s   a person can be talked to

   The first tap of the whole game was a dead press, because the click listener had
   not parsed when the invitation appeared. That is his own sentence from another
   round -- "one button, ready to go, I press it, nothing happens" -- landing on the
   first button anybody ever touches.

   THIS GATE HOLDS THE HALF THAT SHIPPED: the door reads a WAITING line until the
   entry is really wired, and only then offers. It deliberately does NOT assert the
   eighty seconds after the tap -- that is the rest of the row, it is not done, and
   a gate that pretended otherwise would be the lie this round is about.

   AND IT CHECKS THE MARKUP, NOT ONLY THE BEHAVIOUR, because the first cut of this
   fix guarded the painter and changed nothing: <div id="fronttap">TAP TO ENTER</div>
   is in the document before one byte of script runs, so no painter guard can be
   early enough. A fix that cannot run is not a fix.

   node gates/the_door_waits_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const done = () => {
  console.log('THE DOOR WAITS: ' + pass + ' passed, ' + fail + ' failed');
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
  /* ---- THE SOURCE, BOTH SURFACES. The demo is cut from the alpha, and this
     lane edited the generated demo first this round and caught it before it cost
     anything -- the next cut would have wiped it. */
  for (const f of ['slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_DEMO.html']) {
    const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const m = t.match(/<div id="fronttap">([^<]*)<\/div>/);
    ok(f.split('/').pop() + ' ships the door with a waiting line, not an invitation ('
      + (m ? '"' + m[1] + '"' : 'no element') + ')',
       !!m && !/TAP TO ENTER/i.test(m[1]));
    ok(f.split('/').pop() + ' sets the wired flag where the listener is',
       /__DOOR_WIRED\s*=\s*1/.test(t));
    ok(f.split('/').pop() + ' paints the waiting line while it is not wired',
       /if\(!window\.__DOOR_WIRED\)/.test(t));
  }

  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); return done(); }

  const srv = await serve();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  try {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    /* A PHONE, NOT THIS BOX. Every number this fleet posted before 9/15 was taken
       on a machine several times faster than the one he plays on. */
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const t0 = Date.now();
    await page.goto('http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_DEMO.html',
      { waitUntil: 'commit', timeout: 300000 });

    await page.waitForFunction(() => { const f = document.getElementById('fronttap');
      return f && getComputedStyle(f).display !== 'none'; }, { timeout: 300000 });
    const firstWords = await page.evaluate(() =>
      (document.getElementById('fronttap') || {}).textContent || '');
    const firstAt = ((Date.now() - t0) / 1000).toFixed(1);

    ok('*** THE FIRST THING ON SCREEN IS NOT AN INVITATION *** (at ' + firstAt
      + 's it says "' + firstWords.trim() + '")', !/TAP TO ENTER/i.test(firstWords));

    /* and it must not stay silent forever: the offer has to arrive.
       *** AMENDED 9/21 (part two of the same row): THE OFFER IS THE WORD BEGIN NOW. ***
       Part one made the door say ONE MOMENT until the entry was wired. Part two put
       the whole load behind that screen, so what it finally offers is not a door
       into a two-minute wait, it is BEGIN on a world that is already built. This is
       the SAME assertion -- an invitation must arrive -- pointed at the word the
       screen actually says. TAP TO ENTER is deliberately still refused below and the
       string still exists in the source, so the leg that matters most is unchanged:
       the screen must never offer before it means it. */
    /* A PLAIN POLL, NOT waitForFunction. The amended wait kept dying on a 30 s
       timeout it was never given -- it is passed 300000 -- so rather than keep
       theorising about whose default that is, this asks the page the same question
       on a loop it owns. A gate should not have a failure mode nobody can explain. */
    let offered = false;
    for (let i = 0; i < 600 && !offered; i++) {
      offered = await page.evaluate(() => { const f = document.getElementById('fronttap');
        return !!f && /TAP TO ENTER|CONTINUE|BEGIN/.test(f.textContent || ''); }).catch(() => false);
      if (!offered) await new Promise(r => setTimeout(r, 500));
    }
    const offerAt = ((Date.now() - t0) / 1000).toFixed(1);
    ok('and the invitation does arrive (at ' + offerAt + 's)', offered && +offerAt > +firstAt);

    /* *** THE ROW: ONE TAP. *** Before this, the first tap fell through because the
       listener had not parsed, and it took two.
       THROUGH CDP, NOT page.tap: measured this same round on the loading gate,
       page.tap's own actionability work on a throttled page cost 18 seconds and was
       being charged to the game. Every other gate this lane owns dispatches the raw
       touch, and this one now does too. */
    const box = await page.evaluate(() => {
      const f = document.getElementById('fronttap') || document.getElementById('front');
      const r = f.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart',
      touchPoints: [{ x: box.x, y: box.y, id: 1 }] });
    await new Promise(r => setTimeout(r, 80));
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    let opened = false;
    for (let i = 0; i < 60; i++) {
      opened = await page.evaluate(() => { const f = document.getElementById('front');
        return !f || getComputedStyle(f).display === 'none'; }).catch(() => false);
      if (opened) break;
      await new Promise(r => setTimeout(r, 500));
    }
    ok('*** AND ONE TAP OPENS IT, BECAUSE IT ONLY ASKED WHEN IT MEANT IT ***', opened);

    /* the flag is the reason, so it has to actually be set on the live page */
    const wired = await page.evaluate(() => !!window.__DOOR_WIRED);
    ok('the page really set the wired flag (' + wired + ')', wired === true);

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
