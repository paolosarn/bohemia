/* ============================================================================
   THE THUMB GATE (8/30/26, UI lane) — 44px minimum, on the build a stranger gets.

   THE LAW HAS EXISTED THE WHOLE TIME AND HAS NEVER ONCE BEEN CHECKED. This game
   ships on an iPhone in portrait and nothing in 450-odd gates had ever measured a
   control. Measured the day this was written, on the built demo at 390x844 over a
   real http origin:

       TWELVE OF THIRTEEN tappable controls on the first city screen were under
       44px. The top chips were 30px tall -- 68% of the target. The eight walk
       arrows, which are the game's ONLY movement input, were 42.

   A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and this is what that sentence
   looks like when nobody notices for a month.

   *** THREE THINGS THIS GATE DOES THAT THE OBVIOUS VERSION GETS WRONG, EACH OF
   WHICH PRODUCED A CONFIDENT ZERO WHILE THE SCREEN HAD EIGHT BUTTONS ON IT. ***

   1. IT DOES NOT USE file://. The demo hides the builder's drawer by injecting a
      stylesheet into the city frame, which is same-origin ONLY over http. Under
      file:// that injection throws, the catch swallows it, and the drawer is
      wide open -- so a file:// probe reports a demo-breaking leak that does not
      exist in production, and would equally miss a real one. THE GATE SERVES THE
      SLICES OVER A REAL ORIGIN, because that is the surface a person gets.

   2. IT DOES NOT ASK THE DOCUMENT WHAT IS CLICKABLE. `[onclick]` matches only the
      ATTRIBUTE, and this city wires everything with addEventListener, so that
      selector returned ZERO controls on a screen with eight. Checking the onclick
      PROPERTY missed them too. CDP's getEventListeners can see them but its object
      handles do not cross cleanly into a child frame. WHAT WORKS IS WRAPPING
      addEventListener BEFORE THE PAGE RUNS and letting the page announce every
      handler as it registers it. It cannot miss one, and it needs no debugger.

   3. IT DOES NOT CONFUSE "VISIBLE" WITH "TAPPABLE". A control can be on screen and
      sit under a modal. The only honest test is elementFromPoint at the control's
      own centre: whatever the browser says would receive the tap is what receives
      the tap. That is how the builder button below is judged.

   WHY THE DEMO AND NOT THE WORKSHOP. THE THUMB is about the player's phone, and
   the demo is what a player gets; the workshop is a bench with a seventeen-tab bar
   that no stranger will ever open. That is a scope, not an exemption -- the
   workshop's own chrome is another lane's file and its numbers are filed as a
   backlog row rather than silently passed. An exemption written for yourself and
   stated as a principle is how a 23% sat under a green gate all morning (8/27).

   AND IT CHECKS THE DRAWER, because the two are one bug. The fix that grew the
   controls set display:flex on every child of #topbar, #devbtn IS a child of
   #topbar, and two !important rules at equal specificity are settled by ORDER --
   so the thumb rule beat the hide and the builder button came back, 44x44 and
   tappable for the whole session, which is worse than the 149ms window it was
   meant to close. A rule can be individually correct and wrong because of where
   it sits. Nothing but a check that reads BOTH at once catches that.
   ============================================================================ */
'use strict';
const path = require('path');
const http = require('http');
const fs = require('fs');

const ROOT = path.dirname(__dirname);
const SLICES = path.join(ROOT, 'slices');
const MIN = 44;                 /* iPhone portrait, the one device this ships on */
const PORT = 8791;

let pass = 0, fail = 0;
const ok = (msg, good) => { good ? pass++ : fail++; console.log((good ? '  ok   ' : '  FAIL ') + msg); };
const done = () => {
  console.log('\nTHE THUMB GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
};

const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.png': 'image/png', '.json': 'application/json', '.woff2': 'font/woff2' };

function serve() {
  return new Promise(res => {
    const s = http.createServer((rq, rs) => {
      const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
      const f = path.join(SLICES, rel);
      if (!f.startsWith(SLICES) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end('no'); }
      rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
      fs.createReadStream(f).pipe(rs);
    });
    s.listen(PORT, '127.0.0.1', () => res(s));
  });
}

(async () => {
  const demo = path.join(SLICES, 'BOHEMIA_DEMO.html');
  if (!fs.existsSync(demo)) { ok('the demo build exists to be measured', false); done(); }

  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) {
    try { chromium = require('playwright').chromium; }
    catch (e2) { ok('playwright is available to measure the controls', false); done(); }
  }

  const srv = await serve();
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3,
                                   isMobile: true, hasTouch: true });

  /* (2) above: announce every tap handler as it is registered. */
  await ctx.addInitScript(() => {
    const TAPPY = new Set(['click', 'pointerdown', 'pointerup', 'touchstart', 'touchend', 'mousedown']);
    window.__tapNodes = new Set();
    const orig = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, fn, opt) {
      try { if (TAPPY.has(type) && this instanceof Element) window.__tapNodes.add(this); } catch (e) {}
      return orig.call(this, type, fn, opt);
    };
  });

  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 120)));
  await p.goto('http://127.0.0.1:' + PORT + '/BOHEMIA_DEMO.html', { waitUntil: 'load', timeout: 120000 });
  await p.waitForTimeout(1000);

  /* the splash is one tap and it is the only way in */
  const tap = await p.evaluate(() => {
    const n = [...document.querySelectorAll('*')].filter(x => /TAP TO ENTER/i.test(x.textContent || '') && x.children.length < 4).pop();
    if (!n) return null;
    const r = n.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  ok('the demo opens on a front door that says how to get in', !!tap);
  if (!tap) { await b.close(); srv.close(); done(); }
  await p.mouse.click(tap.x, tap.y);

  /* (3) above: sample whether the builder button can RECEIVE a tap, from the
     first instant the city frame is readable. A poll-based hide leaves a window
     and the window is the bug. */
  let samples = 0, reachable = 0, firstAt = null;
  const t0 = Date.now();
  while (Date.now() - t0 < 7000) {
    const f = p.frames().find(x => /CITY_WORLD/.test(x.url()));
    if (f) {
      try {
        const r = await f.evaluate(() => {
          const n = document.getElementById('devbtn');
          if (!n) return { gone: true };
          const s = getComputedStyle(n), b = n.getBoundingClientRect();
          if (s.display === 'none' || s.visibility === 'hidden' || b.width === 0) return { hidden: true };
          const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
          return { reaches: !!(hit && (hit === n || n.contains(hit))) };
        });
        samples++;
        if (r.reaches) { reachable++; if (firstAt === null) firstAt = Date.now() - t0; }
      } catch (e) {}
    }
    await p.waitForTimeout(50);
  }
  ok('the city frame was actually reachable to measure (' + samples + ' samples)', samples > 3);
  ok('the builder drawer is NEVER tappable in the demo, not once, from the first frame'
     + (reachable ? ' -- REACHABLE at ' + firstAt + 'ms, ' + reachable + '/' + samples + ' samples' : ''),
     reachable === 0);

  const city = p.frames().find(x => /CITY_WORLD/.test(x.url()));
  if (!city) { ok('the city loaded in the demo', false); await b.close(); srv.close(); done(); }

  const ctrls = await city.evaluate(() => {
    const out = [];
    const all = new Set([...(window.__tapNodes || [])]);
    for (const n of document.querySelectorAll('button,[onclick]')) all.add(n);
    for (const n of all) {
      if (!n.isConnected) continue;
      const r = n.getBoundingClientRect(), s = getComputedStyle(n);
      if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) continue;
      if (r.width === 0 || r.height === 0) continue;
      if (r.bottom <= 0 || r.top >= window.innerHeight || r.right <= 0 || r.left >= window.innerWidth) continue;
      /* the world canvas and the page itself are surfaces, not controls */
      if (r.width >= window.innerWidth * 0.9 && r.height >= window.innerHeight * 0.9) continue;
      out.push({ id: n.id || ('.' + String(n.className).slice(0, 18)),
                 t: (n.textContent || '').trim().slice(0, 14),
                 w: Math.round(r.width), h: Math.round(r.height) });
    }
    return out;
  });

  ok('the sweep actually found the controls (it found ' + ctrls.length
     + '; three earlier methods each confidently found zero on this same screen)', ctrls.length >= 8);

  const small = ctrls.filter(c => c.w < MIN || c.h < MIN);
  ok('every tappable control on the demo\'s first screen is at least ' + MIN + 'px'
     + (small.length ? ' -- ' + small.length + ' of ' + ctrls.length + ' are not: '
        + small.map(c => c.id + ' ' + c.w + 'x' + c.h).join(', ') : ''),
     small.length === 0);

  /* THE ARROWS ARE THE GAME'S ONLY MOVEMENT INPUT. Growing them is worthless if
     it moved the hit target off the handler, so prove the world still responds --
     against a still control, because a world that animates on its own would make
     any two frames differ and the check would pass no matter what. */
  const fe = await p.$('iframe#cityFrame');
  const fb = await fe.boundingBox();
  const clip = { x: fb.x + 40, y: fb.y + 230, width: 300, height: 330 };
  for (const t of ['NOT NOW', 'GET UP']) {
    try { await city.evaluate(tt => { for (const n of document.querySelectorAll('button,div,span'))
      if ((n.textContent || '').trim() === tt) { n.click(); return; } }, t); } catch (e) {}
    await p.waitForTimeout(1100);
  }
  const crypto = require('crypto');
  const md5 = bb => crypto.createHash('md5').update(bb).digest('hex');
  const a1 = md5(await p.screenshot({ clip }));
  await p.waitForTimeout(1400);
  const a2 = md5(await p.screenshot({ clip }));
  ok('the world holds still when nothing is pressed, so the next check means something',
     a1 === a2);
  const arrow = await city.evaluate(() => {
    const n = [...document.querySelectorAll('.pb')].find(x => x.dataset.walk === '→');
    if (!n) return null;
    const r = n.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: Math.round(r.width) };
  });
  ok('the eight walk arrows are still there after the resize', !!arrow);
  if (arrow) {
    await p.mouse.move(fb.x + arrow.x, fb.y + arrow.y);
    await p.mouse.down(); await p.waitForTimeout(2600); await p.mouse.up();
    await p.waitForTimeout(700);
    const held = md5(await p.screenshot({ clip }));
    ok('holding an arrow still walks him -- the resize did not move the hit target '
       + 'off the handler', held !== a2);
  }

  /* AND NO CONTROL MAY DRAW TWO ARROWS. The city already carries the drawn-triangle
     fix -- .pb::before is a CSS border triangle whose eight rotations measure exactly
     0/45/90/135/180/225/270/315 -- but the ORIGINAL TEXT GLYPH was left in the
     button's textContent at 15px, so every control rendered a correct triangle with a
     stray arrow stuck to it, in both of the pad's modes.
     THE TEST IS A DIFFERENCE, NOT A LOOK: shoot each button, hide only the text, shoot
     it again. If anything changed, the text was drawing. That cannot be fooled by a
     glyph that happens to sit behind the triangle, and it needs no opinion about what
     the shape should be -- which matters, because two separate attempts to measure
     which way these arrows POINT both came back confidently wrong (a bounding-box
     model inverts on a 45-degree triangle, and it reported all four diagonals exactly
     178 degrees off, which is the tell: a real bug is never that tidy). */
  const shots = {};
  const pbs = await city.evaluate(() => [...document.querySelectorAll('.pb')].map(n => {
    const r = n.getBoundingClientRect();
    return { w: n.dataset.walk, x: r.left, y: r.top, W: r.width, H: r.height };
  }));
  ok('the eight-way pad is on screen to be checked', pbs.length === 8);
  for (const bx of pbs) shots[bx.w] = md5(await p.screenshot({
    clip: { x: fb.x + bx.x, y: fb.y + bx.y, width: bx.W, height: bx.H } }));
  await city.evaluate(() => {
    const st = document.createElement('style');
    st.textContent = '.pb{color:transparent !important;text-shadow:none !important}';
    document.head.appendChild(st);
  });
  await p.waitForTimeout(400);
  let doubled = [];
  for (const bx of pbs) {
    const now = md5(await p.screenshot({
      clip: { x: fb.x + bx.x, y: fb.y + bx.y, width: bx.W, height: bx.H } }));
    if (now !== shots[bx.w]) doubled.push(bx.w);
  }
  ok('no walk button draws a second arrow on top of its triangle'
     + (doubled.length ? ' -- ' + doubled.length + ' of ' + pbs.length + ' do: ' + doubled.join(' ') : ''),
     doubled.length === 0);

  ok('no page error while doing any of it' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);

  await b.close();
  srv.close();
  done();
})();
