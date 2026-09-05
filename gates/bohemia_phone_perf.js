#!/usr/bin/env node
/* ============================================================================
   BOHEMIA PHONE PERF — THE INSTRUMENT (9/5/26, PLUMBER lane, [sixty fps])

   Paolo 9/5: "we can have a permanent pipe fixer always working ... helping make
   the game as slimmest it can be, fastest it can be, 60 fps."

   THE JOB SAID: "Write the numbers before touching anything." This file is how
   the numbers get taken. It changes nothing about the game; it opens the game on
   a phone-shaped browser, walks it, fights in it, and writes down what it cost.

   WHY IT EXISTS AT ALL. Of ~485 gates in this repo, exactly one measured
   anything about speed (frame_budget_gate, 8/15, redraws per touch move) and
   NOTHING had ever measured the three numbers a player actually feels:

       how long from tapping the link to being able to walk
       how many frames a second the walk gets
       how many frames a second the fight gets

   VAMILY 9/4 wrote it down plainly: "Frame rate, load time and size on a real
   phone have NEVER been measured (dispatch item 7, unowned since 8/25)."

   HOW IT MEASURES, AND EVERY CHOICE IS ARGUABLE SO EVERY CHOICE IS WRITTEN DOWN:

   1. OVER HTTP, GZIPPED, NOT file://. The page he taps arrives from GitHub Pages
      over a network, compressed. A file:// number is a number about a disk and
      would flatter the load time by the entire transfer. So this serves the repo
      from a local server that gzips exactly the extensions Pages does, and the
      run can be throttled to a phone network.

   2. A PHONE-SHAPED BROWSER: 390x844 at devicePixelRatio 3 with touch, which is
      the iPhone profile the rest of this repo's gates already use, and EVERY
      input is a real touch event through CDP. A click() on a pad button proves
      nothing about a thumb.

   3. CPU THROTTLING, AND WHAT IT IS AND IS NOT. Chromium can slow its main
      thread by a fixed factor (Emulation.setCPUThrottlingRate). 4x is the
      industry stand-in for a mid-tier phone against a desktop-class core, and it
      is what Lighthouse's mobile preset uses. IT IS A STAND-IN. It slows script
      and layout; it does not reproduce a phone's GPU, its memory bandwidth, its
      thermal throttle or its browser. A number here is a floor on the trouble,
      never a substitute for the real device.
      SO THIS FILE NEVER SAYS "ON A PHONE" ABOUT A NUMBER IT DID NOT TAKE ON ONE.
      It records the host, the throttle and the shape of the emulation with every
      figure, and the record it writes says out loud which line still owes a real
      handset.

   4. FRAMES ARE COUNTED AT THE PLACE THAT PAINTS, NOT AT A STOPWATCH OUTSIDE.
      The walked city drives its own animation: a 500ms metronome (BEAT, the
      120 BPM law) arms animate(), which is a requestAnimationFrame chain calling
      render() until the beat is out. So the honest measure of "frame rate
      walking" is render() calls per second WHILE A DIRECTION IS HELD, taken
      inside the page, with the timestamp of every call.

   5. AND AGAINST A CEILING, WHICH IS THE PART THAT MAKES IT TRAVEL. An absolute
      fps is a fact about the machine that took it: headless Chromium in a
      container does not necessarily hand out 60 rAF callbacks a second even to
      an empty page. So every run also measures the EMPTY rAF RATE on the same
      page in the same second, and reports the ratio. "The walk holds 96% of the
      frames this browser was willing to give" is a claim that survives moving to
      another machine; "43 fps" is not.

   6. BATTERY IS NOT GUESSED. Ten minutes of battery on a real handset cannot be
      taken from a container and this file does not pretend otherwise. What it
      CAN take is the thing that drains the battery: main-thread CPU time, read
      from Chromium's own Performance.getMetrics (TaskDuration), over a fixed
      window of standing still and a fixed window of walking. That is reported as
      CPU seconds per wall second, and projected over ten minutes as CPU-minutes.
      The mAh number stays owed, and the record says so.

   USAGE
     node gates/bohemia_phone_perf.js                    # both pages, 1x and 4x
     node gates/bohemia_phone_perf.js --page alpha       # one page
     node gates/bohemia_phone_perf.js --cpu 4            # one throttle
     node gates/bohemia_phone_perf.js --net slow4g       # throttle the network too
     node gates/bohemia_phone_perf.js --battery          # add the 30s CPU windows
     node gates/bohemia_phone_perf.js --json out.json    # write the numbers

   It is ALSO a library: gates/fps_on_a_phone_gate.js imports bootToPlay() and
   walkSample() so the gate and the instrument can never measure two different
   things by drifting apart.
   ========================================================================== */
'use strict';

const path = require('path');
const fs = require('fs');
const http = require('http');
const zlib = require('zlib');

const ROOT = path.dirname(__dirname);

/* the phone. same profile the rest of the gates use, so numbers compare. */
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3,
                hasTouch: true, isMobile: true, serviceWorkers: 'block' };

/* Lighthouse's mobile network preset, which is the one everybody quotes when
   they say "slow 4G": 1.6 Mbit down, 750 kbit up, 150ms round trip. */
const NETS = {
  none:   null,
  slow4g: { offline: false, downloadThroughput: 1.6 * 1024 * 1024 / 8,
            uploadThroughput: 750 * 1024 / 8, latency: 150 },
  fast4g: { offline: false, downloadThroughput: 9 * 1024 * 1024 / 8,
            uploadThroughput: 1.5 * 1024 * 1024 / 8, latency: 60 }
};

const PAGES = {
  alpha: 'slices/BOHEMIA_ALPHA_0_9.html',
  demo:  'slices/BOHEMIA_DEMO.html'
};

function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---- THE SERVER --------------------------------------------------------- */
/* Pages compresses text and does not compress images. So does this. Anything
   else and the transfer number is fiction. */
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
               '.png': 'image/png', '.jpg': 'image/jpeg', '.css': 'text/css',
               '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml',
               '.txt': 'text/plain', '.wav': 'audio/wav', '.mp3': 'audio/mpeg' };
const TEXTY = /\.(html|js|json|css|webmanifest|txt|svg)$/;

/* THE SERVER MUST NOT BE THE SLOW THING. The first draft gzipped 4.6 MB and
   3.7 MB from scratch on every single request, on the same box as the browser,
   and it showed: two runs of the same page measured 2.4s and 13.9s to reach the
   walked world. That spread was the compressor, not the game. Bodies are built
   once and held, so what is being timed is the download and the page. */
const CACHE = new Map();
function bodyFor(f, gz) {
  const k = f + '|' + (gz ? 'z' : 'r');
  if (!CACHE.has(k)) {
    const raw = fs.readFileSync(f);
    CACHE.set(k, gz ? zlib.gzipSync(raw, { level: 6 }) : raw);
  }
  return CACHE.get(k);
}

function startServer() {
  return new Promise(resolve => {
    const srv = http.createServer((rq, rs) => {
      let u;
      try { u = decodeURIComponent(rq.url.split('?')[0]); } catch (_e) { u = rq.url; }
      const f = path.normalize(path.join(ROOT, u));
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        rs.statusCode = 404; rs.end('not here'); return;
      }
      const ext = path.extname(f);
      const gz = TEXTY.test(ext) && /gzip/.test(rq.headers['accept-encoding'] || '');
      const body = bodyFor(f, gz);
      rs.setHeader('content-type', MIME[ext] || 'application/octet-stream');
      if (gz) rs.setHeader('content-encoding', 'gzip');
      rs.setHeader('content-length', body.length);
      rs.end(body);
    });
    srv.listen(0, '127.0.0.1', () => resolve({ srv, port: srv.address().port }));
  });
}

/* ---- THE WITNESS INSIDE THE PAGE ---------------------------------------- *
   THE PROBE CANNOT TIME THE JAM FROM OUTSIDE IT. Measured, and this is the third
   and last version of this timing: after the walked world reported itself ready
   at 2.78s, the very next evaluate -- one getImageData on a 96x96 corner -- took
   NINE POINT SIX EIGHT SECONDS to come back, and when it did the canvas had
   9,216 lit pixels. The city had been painted the whole time. One continuous
   main-thread task, roughly ten seconds long, had the renderer to itself and
   nothing else could run: not the game's own metronome, not a thumb, not a
   question from node. THAT BLOCK IS THE REAL FINDING, and every version of this
   timing that asks the page a question while it is happening measures the block
   and calls it the game.

   So the milestones are recorded BY A WITNESS INSIDE EACH FRAME, on that frame's
   own clock, and only read out afterwards when the thread is free again:
     - when a canvas first has real pixels in it
     - when a held direction first moves the person
     - every long task the browser reports, with its start and its length
   performance.timeOrigin turns each frame's clock into wall time, so numbers
   from the shell and from the city frame land on one timeline. Probe latency
   stops mattering entirely, which is the only way any of these numbers can be
   trusted while the thread is jammed.                                          */
const WITNESS = `(() => {
  if (window.__BOH_W) return;
  const W = { origin: performance.timeOrigin, painted: null, firstStep: null,
              watchStep: false, hx0: null, hy0: null, longtasks: [] };
  window.__BOH_W = W;
  try {
    new PerformanceObserver(l => {
      for (const e of l.getEntries()) W.longtasks.push([Math.round(e.startTime), Math.round(e.duration)]);
    }).observe({ entryTypes: ['longtask'] });
  } catch (e) {}
  const tick = () => {
    try {
      if (W.painted === null) {
        const c = document.querySelector('#stage canvas') || document.querySelector('canvas');
        if (c && c.width) {
          const d = c.getContext('2d').getImageData(0, 0, Math.min(c.width, 64), Math.min(c.height, 64)).data;
          let lit = 0;
          for (let i = 3; i < d.length; i += 4) if (d[i] > 0) lit++;
          if (lit > 500) W.painted = performance.now();
        }
      }
      if (W.watchStep && W.firstStep === null && typeof hx !== 'undefined') {
        if (hx !== W.hx0 || hy !== W.hy0) W.firstStep = performance.now();
      }
    } catch (e) {}
  };
  setInterval(tick, 60);
})()`;

/* HOW THE MILESTONES ARE TIMED, AND IT TOOK THREE GOES TO GET AN HONEST NUMBER.
   This is the part of the file most likely to lie, so the whole story stays.

   waitForFunction POLLS INSIDE THE PAGE, AND THE PAGE IS THE THING THAT IS JAMMED.
   Playwright's default is requestAnimationFrame polling; the entire subject of
   this file is that the walked city's rAF is starved while 19.4 MB of sprite
   banks download and bake on the same main thread. So the milestone did not fire
   when its condition became true, it fired when the starvation let up. Measured:
   PAINTED at 14.4s, first step at 18.5s.
   SWITCHING TO TIMER POLLING ({polling:120}) BARELY HELPED -- 11.7s -- because a
   setTimeout chain inside the page is queued behind the same long tasks.
   A SCREENSHOT SETTLED IT. At 2.0 seconds the demo shows the city, the character,
   the eight-way pad and the day card, all drawn. The game was never that slow;
   the instrument was watching through the jam it was trying to measure, and would
   have published a first-play number SIX TIMES too big.
   SO THE POLL LIVES OUT HERE, in node, one evaluate at a time across CDP: it is
   scheduled as a fresh task rather than waiting its turn in the page's own timer
   queue, and measured against the screenshot it agrees -- MODE human, eight pad
   buttons and a painted canvas, all at 2.8s.
   THE LESSON, which is this repo's oldest one: a measurement taken through the
   thing being measured is not a measurement. */
async function pollUntil(target, fn, timeoutMs, stepMs) {
  const t0 = Date.now();
  const step = stepMs || 100;
  while (Date.now() - t0 < timeoutMs) {
    let v = null;
    try { v = await target.evaluate(fn); } catch (_e) { v = null; }
    if (v) return Date.now() - t0;
    await sleep(step);
  }
  throw new Error('timed out after ' + timeoutMs + 'ms waiting for a boot milestone');
}

/* ---- BOOT TO THE FIRST STEP --------------------------------------------- *
   TIME TO FIRST PLAY is not "the page loaded" and it is not "a canvas appeared".
   It is the moment a thumb pressing a direction MOVES THE PERSON. Everything
   before that is a stranger looking at a screen wondering whether it is broken.
   Milestones are kept separately because the gap between them is the diagnosis:
   a slow door is a download problem, a slow world is a parse problem, a slow
   first step is a card in the way.                                           */
async function bootToPlay(page, base, pageFile, log, opts) {
  const say = log || (() => {});
  const M = {};
  const t0 = Date.now();
  const at = () => Date.now() - t0;

  await page.goto(base + '/' + pageFile, { waitUntil: 'domcontentloaded' });
  M.dom = at();

  /* the front door: his logo, and the first thing tappable */
  await pollUntil(page, () => {
    const f = document.getElementById('front');
    return !!(f && getComputedStyle(f).display !== 'none');
  }, 120000);
  M.door = at();

  const box = await page.evaluate(() => {
    const r = document.getElementById('front').getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  await page.touchscreen.tap(box.x, box.y);
  M.tapped = at();

  /* the walked city is an IFRAME (BOHEMIA_CITY_WORLD.html), which is the whole
     reason the shell's own byte count is only half the load story. */
  let fr = null;
  for (let i = 0; i < 400 && !fr; i++) {
    await sleep(100);
    fr = page.frames().find(f => /CITY_WORLD/.test(f.url()));
  }
  if (!fr) throw new Error('the walked city frame never appeared');

  /* MODE and the pad are declared with let/const at the top of that document, so
     they are NOT properties of contentWindow -- they can only be read from
     inside the frame by bare name. Reading them through the parent returns
     undefined forever, which is a 90-second timeout that looks like a hang. */
  await pollUntil(fr, () =>
    typeof MODE !== 'undefined' && MODE === 'human' &&
    document.querySelectorAll('.pb').length === 8, 120000);
  M.world = at();
  /* WHAT HAD TO ARRIVE BEFORE ANYTHING WAS ON SCREEN. This is the stable load
     number; "bytes before you can MOVE" is much larger and much noisier, because
     it counts whatever the late loader managed to pull during the jam. */
  if (opts && typeof opts.bytesNow === 'function') M.bytesAtWorldReady = opts.bytesNow();

  /* ---- THE THUMB GOES DOWN THE MOMENT THERE IS A PAD TO PRESS ------------ *
     AND THE ORDER HERE IS THE WHOLE MEASUREMENT. An earlier version tidied up
     first -- cleared the card, read the pad's coordinates, checked the state --
     and only then pressed. Every one of those steps is a question for the page,
     every question queues behind the jam, and so the touch was not dispatched
     until the jam was over. That measures the jam and calls it the game.
     A person does not wait politely. They see arrows and they press them. So the
     pad's coordinates are read the instant the pad exists (the thread is free at
     that moment, which is how the world-ready poll just answered), and from then
     on this only presses and waits -- the witness inside the page records when
     the person actually moved, on the page's own clock, and it is read out
     whenever the thread is free again. */
  /* A PICTURE, TAKEN THE INSTANT THE WORLD SAYS IT IS READY, and taken through
     the compositor rather than through the page: page.screenshot() keeps
     answering while the main thread is blocked solid, which is how this round
     found out the city is fully drawn long before anything inside the page can
     say so. The witness's paint mark below is therefore "when the witness could
     first CONFIRM paint", not "when it painted" -- the picture is the honest
     answer to the second question and it is saved beside the record. */
  if (opts && opts.shotPath) {
    try { await page.screenshot({ path: opts.shotPath }); M.screenshotAt = at(); }
    catch (_e) {}
  }

  const pad = await padPoints(page, fr);
  const cdp = page.__cdp;
  await fr.evaluate(() => { const W = window.__BOH_W;
    W.hx0 = (typeof hx !== 'undefined') ? hx : null;
    W.hy0 = (typeof hy !== 'undefined') ? hy : null;
    W.firstStep = null; W.watchStep = true; });
  M.padReady = at();

  /* THE FIRST PRESS IS SPENT ON THE CARD, and that is not a guess. On boot
     #daycard is inset:0 over the whole walked surface: the browser's own hit
     test returns the CARD for all eight direction buttons, so the first thumb
     press lands on the card's backdrop and dismisses it instead of walking.
     This presses like a person: a press, then a held press, then more, until
     somebody moves. */
  await touchDown(cdp, pad.up); await sleep(120); await touchUp(cdp);
  await touchDown(cdp, pad.up);
  let stepped = false;
  for (let i = 0; i < 200 && !stepped; i++) {
    await sleep(150);
    stepped = await fr.evaluate(() => !!(window.__BOH_W && window.__BOH_W.firstStep !== null))
      .catch(() => false);
    if (!stepped && i % 8 === 7) {          /* re-press: a thumb that gets nothing tries again */
      await touchUp(cdp); await sleep(80); await touchDown(cdp, pad.up);
    }
  }
  await touchUp(cdp);
  M.firstStepSeenAt = at();

  /* ---- put every witness mark on one wall clock ------------------------- */
  const W = await fr.evaluate(() => ({ origin: window.__BOH_W.origin,
    painted: window.__BOH_W.painted, firstStep: window.__BOH_W.firstStep,
    longtasks: window.__BOH_W.longtasks.slice(0, 400) }));
  const wall = ms => (ms == null ? null : Math.round(W.origin + ms - t0));
  M.paintConfirmedMs = wall(W.painted);   /* NOT when it painted: when the witness could say so */
  M.painted = M.paintConfirmedMs;
  M.firstStep = wall(W.firstStep);
  M.movedAtAll = W.firstStep !== null;
  const lt = W.longtasks || [];
  M.blockedMsTotal = lt.reduce((a, b) => a + b[1], 0);
  M.longestBlockMs = lt.reduce((a, b) => Math.max(a, b[1]), 0);
  M.longTaskCount = lt.length;
  M.longestBlockStartedAtMs = (lt.find(x => x[1] === M.longestBlockMs) || [null])[0];
  M.cardWasInTheWay = await fr.evaluate(() => {
    const c = document.getElementById('daycard');
    return !!(c && c.classList.contains('on'));
  }).then(still => !still);   /* it was there and the presses cleared it */
  M.wayCleared = (await clearTheWay(fr)).clear;

  say('  boot: dom ' + M.dom + 'ms, door ' + M.door + 'ms, world ' + M.world +
      'ms, painted ' + M.painted + 'ms, FIRST STEP ' + M.firstStep + 'ms' +
      '   (main thread blocked ' + M.blockedMsTotal + 'ms in ' + M.longTaskCount +
      ' long tasks, worst ' + M.longestBlockMs + 'ms)');
  return { frame: fr, marks: M, pad };
}



/* ---- WAIT FOR THE PAGE TO STOP BEING BUSY -------------------------------- *
   Every unstable number in this file came from measuring a page that had not
   finished booting. The walked city's idle rAF ceiling read 21.1 fps and 61.2
   fps on two runs of the same tree, minutes apart, and the low one was taken
   while the page was still finishing deferred work after the first paint.

   So nothing is sampled until the main thread has actually gone quiet, measured
   rather than slept through: Chromium's own TaskDuration over a rolling window,
   under a threshold, or the budget runs out and the run says it never settled.
   This is the same argument as bohemia_settle.js -- wait for the condition, not
   for the clock -- applied to CPU instead of to DOM mutations.                 */
async function awaitQuiet(cdp, maxMs, thresholdPercent) {
  const t0 = Date.now();
  const th = thresholdPercent || 12;
  let last = await cpu(cdp);
  let quiet = false, seen = [];
  while (Date.now() - t0 < (maxMs || 12000)) {
    await sleep(700);
    const now = await cpu(cdp);
    const d = cpuDelta(last, now);
    last = now;
    seen.push(d.busyPercent);
    if (d.busyPercent < th) { quiet = true; break; }
  }
  return { quiet, waitedMs: Date.now() - t0, sawPercent: seen };
}

/* ---- CLEAR THE WAY ------------------------------------------------------ *
   THE WAKE CARD SITS OVER THE PAD, and it is not a one-off: #daycard is inset:0
   and it comes back (the day's news, the road card, the market). Every sample in
   this file taps a direction button, so every sample has to know the card is
   gone -- and "gone" means the browser's own hit test returns the BUTTON, not
   that a flag was cleared a second ago.

   THIS COST A WHOLE MEASUREMENT BEFORE IT WAS WRITTEN. The control run called
   cardHide() once at 2.5s, the card appeared at 3s, and the walk that followed
   reported 0 frames, 0 cells moved and a 1.2% idle main thread -- a page that
   looks perfectly healthy and a sample that measured a thumb pressing a card.
   A perf number taken through an overlay is not a slow number, it is no number.  */
async function clearTheWay(target, tries) {
  for (let i = 0; i < (tries || 12); i++) {
    const state = await target.evaluate(() => {
      const b = document.querySelector('.pb');
      if (!b) return 'no pad';
      const r = b.getBoundingClientRect();
      const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      if (top && top.classList && top.classList.contains('pb')) return 'clear';
      try { if (typeof cardHide === 'function') cardHide(); } catch (_e) {}
      try { const c = document.getElementById('daycard'); if (c) c.classList.remove('on'); } catch (_e) {}
      return top ? ((top.id || top.className || top.tagName) + '') : 'nothing';
    });
    if (state === 'clear') return { clear: true, tries: i };
    await sleep(250);
  }
  return { clear: false, tries: tries || 12 };
}

/* the eight pad buttons, in PAGE coordinates (the frame is offset by the tab
   strip, and a touch is dispatched to the page, not to the frame) */
async function padPoints(page, fr) {
  const off = await page.evaluate(() => {
    const f = document.getElementById('cityFrame');
    const r = f.getBoundingClientRect(); return { x: r.x, y: r.y };
  });
  const b = await fr.evaluate(() => [...document.querySelectorAll('.pb')].map(e => {
    const r = e.getBoundingClientRect();
    return { ch: e.textContent, x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }));
  const P = i => ({ x: off.x + b[i].x, y: off.y + b[i].y });
  return { up: P(0), right: P(2), down: P(4), left: P(6), all: b.map((_, i) => P(i)) };
}

const touchDown = (cdp, p) => cdp.send('Input.dispatchTouchEvent',
  { type: 'touchStart', touchPoints: [{ x: p.x, y: p.y, id: 1 }] });
const touchMove = (cdp, p) => cdp.send('Input.dispatchTouchEvent',
  { type: 'touchMove', touchPoints: [{ x: p.x, y: p.y, id: 1 }] });
const touchUp = cdp => cdp.send('Input.dispatchTouchEvent',
  { type: 'touchEnd', touchPoints: [] });

/* ---- THE FRAME PROBE ---------------------------------------------------- *
   Wraps render() where it is declared and records the timestamp and cost of
   every call. It is a counter around the real function: nothing is skipped,
   nothing is queued, the page draws exactly what it would have drawn.        */
const PROBE = `(() => {
  if (window.__PP) { window.__PP.t = []; window.__PP.ms = []; return 'again'; }
  const P = { t: [], ms: [] };
  const o = window.render;
  if (typeof o !== 'function') return 'no render';
  window.render = function () {
    const a = performance.now();
    const v = o.apply(this, arguments);
    P.t.push(a); P.ms.push(performance.now() - a);
    return v;
  };
  window.__PP = P;
  return 'installed';
})()`;

/* THE CEILING, AND IT HAS TO PAINT. This is what makes an fps number portable:
   the game's rate is only meaningful as a fraction of the rate this browser was
   handing out at all.

   AN EMPTY rAF CHAIN IS NOT THAT RATE, and measuring one is the second mistake
   this file made. Chromium drives requestAnimationFrame off the compositor's
   BeginFrame, and a callback chain that paints NOTHING produces no damage, so
   headless hands it frames lazily: measured 14.9 fps for an empty chain on the
   same document, in the same second, in which the walk was drawing 59.2. The
   walk then scored 397% OF THE CEILING -- an impossible number that is really
   just a broken denominator, reported twice before it was chased down.
   So the ceiling loop DRAWS: one pixel into a real on-screen canvas per frame,
   which is the cheapest thing that still counts as damage. Cheap enough that
   the number is the browser's cadence and not the drawing's cost, real enough
   that the browser has a reason to keep giving frames. */
async function rafCeiling(fr, ms) {
  return fr.evaluate(w => new Promise(res => {
    const c = document.querySelector('#stage canvas') || document.querySelector('canvas');
    const g = c ? c.getContext('2d') : null;
    let n = 0; const t0 = performance.now();
    const step = () => {
      n++;
      if (g) { g.fillStyle = (n & 1) ? 'rgba(0,0,0,0.004)' : 'rgba(255,255,255,0.004)'; g.fillRect(0, 0, 1, 1); }
      if (performance.now() - t0 >= w) res({ frames: n, ms: +(performance.now() - t0).toFixed(1), painted: !!g });
      else requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), ms);
}

function stats(list) {
  if (!list.length) return { n: 0 };
  const s = [...list].sort((a, b) => a - b);
  const q = p => s[Math.min(s.length - 1, Math.floor(p * s.length))];
  return { n: s.length, min: +s[0].toFixed(2), med: +q(0.5).toFixed(2),
           p95: +q(0.95).toFixed(2), max: +s[s.length - 1].toFixed(2),
           mean: +(s.reduce((a, b) => a + b, 0) / s.length).toFixed(2) };
}

/* ---- WALK ---------------------------------------------------------------- *
   Hold one direction for holdMs. Count the paints. The metronome is 500ms, so a
   6s hold is twelve beats, twelve step animations, and every frame of them.    */
async function walkSample(page, fr, pad, holdMs) {
  const cdp = page.__cdp;
  const way = await clearTheWay(fr);
  await fr.evaluate(PROBE);
  await fr.evaluate(() => { window.__PP.t = []; window.__PP.ms = []; });
  const before = await fr.evaluate(() => [hx, hy]);
  const t0 = Date.now();
  await touchDown(cdp, pad.up);
  /* a held thumb is not perfectly still; a move every beat keeps the hold alive
     the way a real one does and never leaves the button */
  while (Date.now() - t0 < holdMs) {
    await sleep(250);
    await touchMove(cdp, { x: pad.up.x + (Math.random() * 2 - 1), y: pad.up.y + (Math.random() * 2 - 1) });
  }
  await touchUp(cdp);
  const wall = Date.now() - t0;
  const r = await fr.evaluate(() => {
    const P = window.__PP;
    const gaps = [];
    for (let i = 1; i < P.t.length; i++) gaps.push(P.t[i] - P.t[i - 1]);
    return { renders: P.t.length, cost: P.ms.slice(), gaps,
             costTotal: +P.ms.reduce((a, b) => a + b, 0).toFixed(1),
             span: P.t.length > 1 ? P.t[P.t.length - 1] - P.t[0] : 0 };
  });
  const after = await fr.evaluate(() => [hx, hy]);
  const moved = after[0] !== before[0] || after[1] !== before[1];
  const cells = Math.abs(after[0] - before[0]) + Math.abs(after[1] - before[1]);
  /* frames that belong to an animation, not the gap between two beats: an
     interval longer than a third of a beat is the page resting, not a slow
     frame, and folding rests into an fps number is how a still page scores 2 fps */
  const inAnim = r.gaps.filter(g => g <= 166);
  const fps = r.span > 0 ? +(r.renders / (r.span / 1000)).toFixed(1) : 0;
  const animFps = inAnim.length ? +(1000 / stats(inAnim).med).toFixed(1) : 0;
  return {
    heldMs: wall, moved, cells, wayCleared: way.clear,
    /* A SAMPLE THAT DID NOT MOVE IS NOT A SLOW SAMPLE, IT IS A BROKEN ONE, and it
       says so in its own body rather than quietly reporting 0 fps. */
    valid: moved && r.renders > 0,
    renders: r.renders,
    rendersPerSecond: +(r.renders / (wall / 1000)).toFixed(1),
    fpsOverTheWholeHold: fps,
    fpsWhileAnimating: animFps,
    frameGapMs: stats(inAnim),
    renderCostMs: stats(r.cost),
    /* WHERE THE MAIN THREAD ACTUALLY WENT. Painting and "everything else" are
       different problems with different owners, and one number cannot tell them
       apart. Measured 9/5: the walk pinned the thread at 98% while the painting
       inside it was 180ms of 6,460 -- under 3%. The frame rate problem in this
       game is not the drawing. */
    paintingMsTotal: r.costTotal,
    framesOver16_7ms: inAnim.length ? +(100 * inAnim.filter(g => g > 16.7).length / inAnim.length).toFixed(1) : null
  };
}

/* ---- STAND STILL -------------------------------------------------------- *
   What the game costs when nobody is touching it. On a phone this is the number
   that decides whether the battery drains in a pocket.                         */
async function idleSample(fr, ms) {
  await fr.evaluate(PROBE);
  await fr.evaluate(() => { window.__PP.t = []; window.__PP.ms = []; });
  await sleep(ms);
  return fr.evaluate(w => {
    const P = window.__PP;
    return { renders: P.t.length, perSecond: +(P.t.length / (w / 1000)).toFixed(2),
             msTotal: +P.ms.reduce((a, b) => a + b, 0).toFixed(1) };
  }, ms);
}

/* ---- CPU, WHICH IS THE BATTERY ------------------------------------------ */
async function cpu(cdp) {
  const { metrics } = await cdp.send('Performance.getMetrics');
  const g = k => (metrics.find(m => m.name === k) || {}).value || 0;
  return { task: g('TaskDuration'), script: g('ScriptDuration'),
           layout: g('LayoutDuration'), recalc: g('RecalcStyleDuration'), ts: g('Timestamp') };
}
const cpuDelta = (a, b) => ({
  taskS: +(b.task - a.task).toFixed(2), scriptS: +(b.script - a.script).toFixed(2),
  layoutS: +(b.layout - a.layout).toFixed(2), wallS: +(b.ts - a.ts).toFixed(2),
  busyPercent: +(100 * (b.task - a.task) / Math.max(0.001, b.ts - a.ts)).toFixed(1)
});

/* ---- THE CONTROL, AND IT IS THE MOST IMPORTANT MEASUREMENT IN THE FILE ---- *
   The walked city is a PAGE (slices/BOHEMIA_CITY_WORLD.html) that the alpha and
   the demo both show inside an iframe. So the same city can be measured twice:
   on its own, and inside the shell he actually taps. The difference between the
   two is what the shell costs, and nothing in this repo had ever separated them.

   A SAME-ORIGIN IFRAME SHARES ITS PARENT'S MAIN THREAD. There is one renderer
   thread for the document and every same-origin frame in it, so anything the
   shell is doing is time the city cannot use to draw. That is not a theory to
   argue about, it is a number this function takes.                            */
async function measureControl(opts) {
  const { chromium } = requirePlaywright();
  const { srv, port } = await startServer();
  const base = 'http://127.0.0.1:' + port;
  const browser = await chromium.launch();
  const out = { page: 'city-world-alone', file: 'slices/BOHEMIA_CITY_WORLD.html',
                cpuThrottle: opts.cpu, host: hostFacts() };
  try {
    const ctx = await browser.newContext(PHONE);
    await ctx.addInitScript(WITNESS);
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    page.__cdp = cdp;
    await cdp.send('Performance.enable');
    if (opts.cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: opts.cpu });

    const t0 = Date.now();
    await page.goto(base + '/slices/BOHEMIA_CITY_WORLD.html', { waitUntil: 'domcontentloaded' });
    await pollUntil(page, () =>
      typeof MODE !== 'undefined' && MODE === 'human' &&
      document.querySelectorAll('.pb').length === 8, 120000);
    out.readyMs = Date.now() - t0;
    out.settled = await awaitQuiet(cdp, 15000);
    out.wayCleared = await clearTheWay(page.mainFrame());

    /* AND A BLANK PAGE IN THE SAME BROWSER IN THE SAME RUN, so "the machine can
       do 60" is a measurement rather than an assumption. Without this line an
       fps number has no scale at all: 20 fps could be a slow game or a slow box
       and there would be no way to tell them apart. */
    const blank = await ctx.newPage();
    await blank.setContent('<canvas id=c width=390 height=800 style="width:390px;height:800px"></canvas>');
    const bc = await rafCeiling(blank.mainFrame(), 1500);
    out.emptyPageCeilingFps = +(bc.frames / (bc.ms / 1000)).toFixed(1);
    await blank.close();
    await page.bringToFront();
    await sleep(400);

    const c = await rafCeiling(page.mainFrame(), 1500);
    out.idleCeilingFps = +(c.frames / (c.ms / 1000)).toFixed(1);

    const i0 = await cpu(cdp); await sleep(3000); const i1 = await cpu(cdp);
    out.idleCpu = cpuDelta(i0, i1);

    const pad = await padPointsTop(page);
    const w0 = await cpu(cdp);
    out.walk = await walkSample(page, page.mainFrame(), pad, opts.holdMs);
    const w1 = await cpu(cdp);
    out.walk.cpu = cpuDelta(w0, w1);
    out.walk.cpu.paintingPercentOfBusy = out.walk.cpu.taskS > 0
      ? +(100 * (out.walk.paintingMsTotal / 1000) / out.walk.cpu.taskS).toFixed(1) : null;
    out.walk.fractionOfTheCeiling = out.emptyPageCeilingFps
      ? +(out.walk.rendersPerSecond / out.emptyPageCeilingFps).toFixed(3) : null;
  } finally {
    await browser.close();
    srv.close();
  }
  return out;
}

/* the same pad, when the city IS the page and there is no iframe offset */
async function padPointsTop(page) {
  const b = await page.evaluate(() => [...document.querySelectorAll('.pb')].map(e => {
    const r = e.getBoundingClientRect();
    return { ch: e.textContent, x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }));
  const P = i => ({ x: b[i].x, y: b[i].y });
  return { up: P(0), right: P(2), down: P(4), left: P(6), all: b.map((_, i) => P(i)) };
}

/* ---- ONE RUN ------------------------------------------------------------ */
async function measure(opts) {
  const { chromium } = requirePlaywright();
  const { srv, port } = await startServer();
  const base = 'http://127.0.0.1:' + port;
  const out = { page: opts.page, file: PAGES[opts.page], cpuThrottle: opts.cpu,
                net: opts.net, host: hostFacts() };
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext(PHONE);
    await ctx.addInitScript(WITNESS);
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
    let bytes = 0, requests = 0;
    const wire = [];
    page.on('response', async r => {
      requests++;
      try {
        const h = await r.allHeaders();
        const n = parseInt(h['content-length'] || '0', 10) || 0;
        bytes += n;
        wire.push({ url: r.url().replace(/^https?:\/\/[^/]+/, ''), bytes: n });
      } catch (_e) {}
    });
    const cdp = await ctx.newCDPSession(page);
    page.__cdp = cdp;
    await cdp.send('Performance.enable');
    if (opts.cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: opts.cpu });
    if (NETS[opts.net]) {
      await cdp.send('Network.enable');
      await cdp.send('Network.emulateNetworkConditions', NETS[opts.net]);
    }

    const boot = await bootToPlay(page, base, PAGES[opts.page], opts.log,
                                  Object.assign({ bytesNow: () => bytes }, opts));
    out.firstPlay = boot.marks;
    out.transfer = { bytesToFirstPlay: bytes, requestsToFirstPlay: requests };

    /* THE CEILING IS TAKEN TWICE, AND THE FIRST DRAFT OF THIS FILE GOT IT WRONG.
       Measured once immediately after boot it read 20.9 fps -- while the page was
       still finishing its opening work -- and the walk then scored 287% OF THE
       CEILING, which is not a fast walk, it is a broken denominator. A ceiling is
       only a ceiling when the page is idle, so it is sampled after the world has
       settled AND again at the end of the run, and the higher of the two is what
       this browser was really willing to give. */
    /* ---- THE STRANGER'S FIRST WALK, TAKEN BEFORE ANYTHING IS ALLOWED TO SETTLE.
       This is the walk a person actually gets, and it is not the same walk as the
       one thirty seconds later, because the world is still arriving underneath it:
       BOHEMIA_CITY_TILES_LATE.js waits for the first painted frame and then pulls
       eight more sprite banks -- 19.4 MB gzipped, 23.9 MB of script -- one at a
       time, downloading, parsing and baking on THE SAME MAIN THREAD the walk draws
       on. The late loader is deliberate and it is the right call (its own comment
       records the measurement: shipping them as deferred tags turned a five second
       wait into twenty-nine). But it means there are two true frame rates in this
       game and only one of them is the one he lands on. Both get measured. */
    const c0e = await cpu(cdp);
    out.walkFirstMinute = await walkSample(page, boot.frame, boot.pad, opts.holdMs);
    const c1e = await cpu(cdp);
    out.walkFirstMinute.cpu = cpuDelta(c0e, c1e);
    out.walkFirstMinute.cpu.paintingPercentOfBusy = out.walkFirstMinute.cpu.taskS > 0
      ? +(100 * (out.walkFirstMinute.paintingMsTotal / 1000) / out.walkFirstMinute.cpu.taskS).toFixed(1) : null;

    out.settledBeforeSampling = await awaitQuiet(cdp, 25000);
    out.standingStill = await idleSample(boot.frame, 2000);
    out.rafCeiling = await rafCeiling(boot.frame, 1500);
    out.rafCeiling.fps = +(out.rafCeiling.frames / (out.rafCeiling.ms / 1000)).toFixed(1);

    /* the same blank-page yardstick the control takes, in this browser, this run */
    {
      const blank = await ctx.newPage();
      await blank.setContent('<canvas id=c width=390 height=800 style="width:390px;height:800px"></canvas>');
      const bc = await rafCeiling(blank.mainFrame(), 1500);
      out.emptyPageCeilingFps = +(bc.frames / (bc.ms / 1000)).toFixed(1);
      await blank.close();
      await page.bringToFront();
      await sleep(400);
    }

    out.settled = await awaitQuiet(cdp, 15000);
    { const i0 = await cpu(cdp); await sleep(3000); const i1 = await cpu(cdp);
      out.idleCpu = cpuDelta(i0, i1); }

    out.transfer.bytesByTheSettledWalk = bytes;
    const c0 = await cpu(cdp);
    /* and the same walk once the world has stopped arriving: the steady state */
    out.walk = await walkSample(page, boot.frame, boot.pad, opts.holdMs);
    const c1 = await cpu(cdp);
    out.walk.cpu = cpuDelta(c0, c1);
    out.walk.cpu.paintingPercentOfBusy = out.walk.cpu.taskS > 0
      ? +(100 * (out.walk.paintingMsTotal / 1000) / out.walk.cpu.taskS).toFixed(1) : null;
    const ceil2 = await rafCeiling(boot.frame, 1200);
    ceil2.fps = +(ceil2.frames / (ceil2.ms / 1000)).toFixed(1);
    out.rafCeilingAfter = ceil2;
    out.rafCeiling.best = Math.max(out.rafCeiling.fps, ceil2.fps);
    /* AGAINST RENDERS PER SECOND, NOT AGAINST A MEDIAN GAP. The median gap said
       59.9 fps on a walk that drew 129 frames in 6.2 seconds, which is 20.7 a
       second: the distribution is bimodal -- a short burst of 16.7ms frames and
       then a long stall -- and the median lands inside the burst and reports the
       best moment of the walk as if it were the walk. Frames delivered over wall
       time is the number a thumb feels. The median is kept below as information
       because the gap between the two IS the judder. */
    /* AND THE YARDSTICK IS THE EMPTY PAGE, NOT THE GAME PAGE'S OWN IDLE CEILING.
       That in-page ceiling is itself a measurement of the game (it is throttled
       by whatever the page is still doing) and it moved 21.1 -> 61.2 between two
       runs of one tree, so dividing by it turns a stable number into an unstable
       one. An empty canvas in the same browser in the same run reads 60.x every
       single time, which is what a denominator is for. */
    out.walk.fractionOfTheCeiling = out.emptyPageCeilingFps
      ? +(out.walk.rendersPerSecond / out.emptyPageCeilingFps).toFixed(3) : null;

    if (opts.fight) out.fight = await fightSample(page, boot.frame, opts).catch(
      e => ({ reached: false, why: String(e.message).slice(0, 160) }));

    if (opts.battery) {
      const b0 = await cpu(cdp);
      await sleep(opts.batteryMs);
      const b1 = await cpu(cdp);
      out.battery = { standingStill: cpuDelta(b0, b1), windowMs: opts.batteryMs };
      const b2 = await cpu(cdp);
      await walkSample(page, boot.frame, boot.pad, opts.batteryMs);
      const b3 = await cpu(cdp);
      out.battery.walking = cpuDelta(b2, b3);
      out.battery.cpuMinutesPerTenMinutesWalking =
        +(out.battery.walking.busyPercent / 100 * 10).toFixed(2);
      out.battery.note = 'CPU time is what drains a battery, and it is all a container can ' +
        'honestly report. MILLIAMP-HOURS ON A REAL HANDSET ARE STILL OWED.';
    }
    out.transfer.bytesOverTheWire = bytes;
    out.transfer.requests = requests;
    out.transfer.biggest = wire.slice().sort((a, b) => b.bytes - a.bytes).slice(0, 10);
    out.pageErrors = errs.slice(0, 6);
  } finally {
    await browser.close();
    srv.close();
  }
  return out;
}

/* ---- THE FIGHT ---------------------------------------------------------- *
   The fight lives in its own frame (COMBAT_B64, decoded into #combatFrame) and
   the walked city reaches it through cityEncounterIn, which is the same bus the
   dial speaks. This drives that door rather than opening the COMBAT tab by hand,
   because the tab is not the surface a player arrives through.                */
async function fightSample(page, cityFrame, opts) {
  const started = await page.evaluate(() => {
    try {
      if (typeof cityEncounterIn !== 'function') return 'no cityEncounterIn';
      cityEncounterIn({ packageId: 1, label: 'a perf sample' });
      return 'called';
    } catch (e) { return 'threw: ' + String(e).slice(0, 90); }
  });
  if (started !== 'called') return { reached: false, why: started };

  /* THE FIGHT IS AN about:srcdoc FRAME (COMBAT_B64 written into #combatFrame), so
     it cannot be found by URL and has no name. The first draft of this hunted
     page.frames() with a url filter, found nothing, fell through to a probe that
     wrapped a function the frame does not have, and reported 0 fps ON A FIGHT
     THAT WAS RUNNING FINE. A perf number that reads zero because the probe missed
     is the most expensive kind of wrong: it looks like a catastrophe and it sends
     somebody optimising a page that was never slow. Take the frame off the
     ELEMENT, which is the only handle that is actually stable. */
  let cf = null;
  for (let i = 0; i < 300 && !cf; i++) {
    await sleep(100);
    const h = await page.$('#combatFrame');
    if (h) { const c = await h.contentFrame(); if (c && (await c.evaluate(() => document.querySelectorAll('canvas').length).catch(() => 0)) > 0) cf = c; }
  }
  if (!cf) return { reached: false, why: 'the combat frame never showed a canvas' };

  const alive = await cf.evaluate(() => ({
    canvases: document.querySelectorAll('canvas').length,
    drawFn: typeof window.draw, renderFn: typeof window.render,
    fns: Object.getOwnPropertyNames(window).filter(k => /^(render|draw|paint|frame|tick|beat)/i.test(k)).slice(0, 12)
  })).catch(e => ({ err: String(e).slice(0, 90) }));

  /* count PAINTS, not a named function: the fight's draw entry point is not
     guaranteed to be called render(), and a perf number that depends on
     guessing a function name is a number that silently becomes zero. So the
     probe wraps the 2D context itself, which is what the pixels go through. */
  await cf.evaluate(() => {
    if (window.__FP) return;
    const P = { t: [], n: 0 };
    const proto = (self.CanvasRenderingContext2D || {}).prototype;
    if (proto && !proto.__ppWrapped) {
      const o = proto.drawImage;
      proto.drawImage = function () { P.n++; return o.apply(this, arguments); };
      proto.__ppWrapped = true;
    }
    const raf = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = function (cb) {
      return raf(function (t) { P.t.push(performance.now()); return cb(t); });
    };
    window.__FP = P;
  });
  await sleep(200);
  await cf.evaluate(() => { window.__FP.t = []; window.__FP.n = 0; });
  await sleep(opts.fightMs);
  const r = await cf.evaluate(w => {
    const P = window.__FP;
    const gaps = [];
    for (let i = 1; i < P.t.length; i++) gaps.push(P.t[i] - P.t[i - 1]);
    return { rafFrames: P.t.length, drawCalls: P.n, gaps, windowMs: w };
  }, opts.fightMs);
  const inAnim = r.gaps.filter(g => g <= 400);
  const ceil = await rafCeiling(cf, 1200);
  ceil.fps = +(ceil.frames / (ceil.ms / 1000)).toFixed(1);
  return {
    reached: true, alive,
    rafFramesPerSecond: +(r.rafFrames / (opts.fightMs / 1000)).toFixed(1),
    drawCallsPerSecond: +(r.drawCalls / (opts.fightMs / 1000)).toFixed(1),
    /* THE NUMBER THAT EXPLAINS THE OTHER TWO: how much painting one frame of the
       fight asks for. A frame rate is an outcome; this is the cause. */
    drawCallsPerFrame: r.rafFrames ? Math.round(r.drawCalls / r.rafFrames) : null,
    fpsWhileAnimating: inAnim.length ? +(1000 / stats(inAnim).med).toFixed(1) : 0,
    frameGapMs: stats(inAnim),
    rafCeiling: ceil,
    fractionOfTheCeiling: ceil.fps ? +((inAnim.length ? 1000 / stats(inAnim).med : 0) / ceil.fps).toFixed(3) : null
  };
}

function hostFacts() {
  const os = require('os');
  return { platform: os.platform(), cpus: os.cpus().length,
           model: (os.cpus()[0] || {}).model || '?',
           totalMemGB: +(os.totalmem() / 1073741824).toFixed(1),
           node: process.version };
}

/* ---- REPEATS, BECAUSE ONE RUN OF THIS IS NOT A NUMBER -------------------- *
   Measured 9/5, same tree, same box, four consecutive runs of the alpha: the
   walked world was ready at 2.4s, 10.1s, 12.3s and 13.9s, and the frames the
   shell offered read 19.2, 19.5, 52.4 and 60.4. A single sample of any of those
   would have been quoted as fact and half of them would have been wrong by 3x.
   So every headline number here is a MEDIAN OF REPEATS, and the spread is kept
   beside it, because a wide spread is itself a finding about the build.        */
function median(xs) {
  const v = xs.filter(x => typeof x === 'number' && isFinite(x)).sort((a, b) => a - b);
  if (!v.length) return null;
  return +(v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2).toFixed(2);
}
function summarise(runs) {
  const pick = f => runs.map(f);
  const band = xs => { const v = xs.filter(x => typeof x === 'number' && isFinite(x));
    return v.length ? { med: median(v), lo: +Math.min(...v).toFixed(2), hi: +Math.max(...v).toFixed(2), n: v.length } : null; };
  const S = {
    page: runs[0].page, cpuThrottle: runs[0].cpuThrottle, net: runs[0].net, repeats: runs.length,
    emptyPageCeilingFps: band(pick(r => r.emptyPageCeilingFps)),
    walkFpsDelivered: band(pick(r => r.walk && r.walk.valid ? r.walk.rendersPerSecond : null)),
    walkFrameMs: band(pick(r => r.walk && r.walk.renderCostMs ? r.walk.renderCostMs.med : null)),
    walkMainThreadBusyPercent: band(pick(r => r.walk && r.walk.cpu ? r.walk.cpu.busyPercent : null)),
    walkPaintingPercentOfBusy: band(pick(r => r.walk && r.walk.cpu ? r.walk.cpu.paintingPercentOfBusy : null)),
    walkFractionOfEmptyPage: band(pick(r => r.walk ? r.walk.fractionOfTheCeiling : null)),
    invalidWalkSamples: runs.filter(r => r.walk && !r.walk.valid).length,
    runsThatNeverWentQuiet: runs.filter(r => (r.settled || r.settledBeforeSampling || {}).quiet === false).length
  };
  if (runs[0].firstPlay) {
    S.firstPlayMs = band(pick(r => r.firstPlay.firstStep));
    S.doorMs = band(pick(r => r.firstPlay.door));
    S.worldReadyMs = band(pick(r => r.firstPlay.world));
    S.paintedMs = band(pick(r => r.firstPlay.painted));
    S.mainThreadBlockedMsDuringBoot = band(pick(r => r.firstPlay.blockedMsTotal));
    S.longTaskCount = band(pick(r => r.firstPlay.longTaskCount));
    S.longestSingleBlockMs = band(pick(r => r.firstPlay.longestBlockMs));
    S.bytesAtWorldReady = band(pick(r => r.firstPlay.bytesAtWorldReady));
    S.bytesToFirstPlay = band(pick(r => r.transfer.bytesToFirstPlay));
    S.bytesOverTheWire = band(pick(r => r.transfer.bytesOverTheWire));
    S.walkFpsFirstMinute = band(pick(r => r.walkFirstMinute && r.walkFirstMinute.valid ? r.walkFirstMinute.rendersPerSecond : null));
    S.walkBusyFirstMinutePercent = band(pick(r => r.walkFirstMinute && r.walkFirstMinute.cpu ? r.walkFirstMinute.cpu.busyPercent : null));
    S.requests = band(pick(r => r.transfer.requests));
    S.framesOfferedInsideTheShellFps = band(pick(r => r.rafCeiling.best));
    S.idleMainThreadBusyPercent = band(pick(r => r.idleCpu ? r.idleCpu.busyPercent : null));
    S.fightFpsDelivered = band(pick(r => r.fight && r.fight.reached ? r.fight.rafFramesPerSecond : null));
    S.fightDrawCallsPerFrame = band(pick(r => r.fight && r.fight.reached ? r.fight.drawCallsPerFrame : null));
    S.fightNotReached = runs.filter(r => r.fight && !r.fight.reached).length;
  } else {
    S.framesOfferedToThePageFps = band(pick(r => r.idleCeilingFps));
    S.idleMainThreadBusyPercent = band(pick(r => r.idleCpu ? r.idleCpu.busyPercent : null));
    S.readyMs = band(pick(r => r.readyMs));
  }
  return S;
}


/* ---- THE RECORD --------------------------------------------------------- *
   The instrument writes its own record, both halves of it: the JSON the gate
   reads and the page a person reads. Nothing is typed in by hand, so the two can
   never drift apart and nobody has to trust that a number in prose matches the
   number in the budget -- they are the same number, written once.

   THE BUDGET IS DERIVED FROM THE MEASUREMENT, WITH HEADROOM FOR THE SPREAD that
   was measured alongside it. A ratchet set at the median of a noisy sample is a
   gate that goes red on an ordinary Tuesday for no reason and gets switched off;
   a ratchet set at the worst run plus a margin catches a real regression and
   nothing else.                                                               */
function buildRecord(summaries, runs) {
  const find = (p, c) => summaries.find(S => S.page === p && S.cpuThrottle === c);
  const demo = find('demo', 1) || find('alpha', 1);
  const alpha = find('alpha', 1);
  const ctrl = find('city-world-alone', 1);
  const v = (b, k) => (b && b[k] != null ? b[k] : null);
  const M = {
    surface: 'Chromium ' + PHONE.viewport.width + 'x' + PHONE.viewport.height +
             ' at dpr ' + PHONE.deviceScaleFactor + ', touch, mobile, over http with gzip',
    timeToFirstPlayMs: v(demo.firstPlayMs, 'med'),
    timeToFirstPlayWorstMs: v(demo.firstPlayMs, 'hi'),
    doorMs: v(demo.doorMs, 'med'),
    worldReadyMs: v(demo.worldReadyMs, 'med'),
    mainThreadBlockedMsDuringBoot: v(demo.mainThreadBlockedMsDuringBoot, 'med'),
    longestSingleBlockMs: v(demo.longestSingleBlockMs, 'med'),
    longTaskCount: v(demo.longTaskCount, 'med'),
    bytesBeforeAnythingIsOnScreen: v(demo.bytesAtWorldReady, 'med'),
    bytesToFirstPlay: v(demo.bytesToFirstPlay, 'med'),
    bytesByTheEndOfTheRun: v(demo.bytesOverTheWire, 'med'),
    walkFpsFirstMinute: v(demo.walkFpsFirstMinute, 'med'),
    walkFpsFirstMinuteWorst: v(demo.walkFpsFirstMinute, 'lo'),
    walkFpsSettled: v(demo.walkFpsDelivered, 'med'),
    walkFpsSettledWorst: v(demo.walkFpsDelivered, 'lo'),
    walkFrameMs: v(demo.walkFrameMs, 'med'),
    mainThreadBusyWalkingPercent: v(demo.walkMainThreadBusyPercent, 'med'),
    idleMainThreadBusyPercent: v(demo.idleMainThreadBusyPercent, 'med'),
    mainThreadBusyWalkingWorstPercent: v(demo.walkMainThreadBusyPercent, 'hi'),
    paintingPercentOfThatBusy: v(demo.walkPaintingPercentOfBusy, 'med'),
    fightFps: v(demo.fightFpsDelivered, 'med'),
    fightFpsWorst: v(demo.fightFpsDelivered, 'lo'),
    fightDrawCallsPerFrame: v(demo.fightDrawCallsPerFrame, 'med'),
    /* filled by a separate --battery run and merged in; null until then */
    cpuBusyStandingStillPercent: null,
    cpuBusyWalkingPercent: null,
    cpuMinutesPerTenMinutesWalking: null,
    batteryWindowMs: null,
    emptyPageCeilingFps: v(demo.emptyPageCeilingFps, 'med'),
    controlWalkFpsSettled: ctrl ? v(ctrl.walkFpsDelivered, 'med') : null,
    controlMainThreadBusyWalkingPercent: ctrl ? v(ctrl.walkMainThreadBusyPercent, 'med') : null,
    controlIdleBusyPercent: ctrl ? v(ctrl.idleMainThreadBusyPercent, 'med') : null,
    alphaTimeToFirstPlayMs: alpha ? v(alpha.firstPlayMs, 'med') : null,
    alphaWalkFpsSettled: alpha ? v(alpha.walkFpsDelivered, 'med') : null,
    alphaWalkFpsFirstMinute: alpha ? v(alpha.walkFpsFirstMinute, 'med') : null,
    alphaFightFps: alpha ? v(alpha.fightFpsDelivered, 'med') : null
  };
  const worst = (b, k, d) => (b && b[k] != null ? b[k] : d);
  const budget = {
    /* every ceiling is the WORST run of the sample plus a margin; every floor is
       the worst run minus one. Headroom is not generosity, it is the measured
       spread: the same tree gave 12.8s and 15.9s to the first step. */
    timeToFirstPlayMs: Math.ceil(worst(demo.firstPlayMs, 'hi', 20000) * 1.35 / 500) * 500,
    walkFpsSettled: Math.max(5, Math.floor(worst(demo.walkFpsDelivered, 'lo', 30) * 0.75)),
    /* THE CPU LINE GETS A MUCH WIDER MARGIN THAN THE REST, AND IT EARNED IT. Set
       at 1.3x the worst of three runs (41%) it went red on the very next run at
       41.9% -- a gate red on arrival for noise, which is precisely how a budget
       gets switched off by the next session that meets it. Main-thread busy is
       the noisiest thing measured here because it also counts whatever else the
       box is doing. 1.8x still catches the thing worth catching (a doubling) and
       does not fire on the spread. */
    mainThreadBusyWalkingPercent: Math.min(85, Math.ceil(worst(demo.walkMainThreadBusyPercent, 'hi', 60) * 1.8)),
    fightFps: Math.max(3, Math.floor(worst(demo.fightFpsDelivered, 'lo', 15) * 0.7)),
    bytesToFirstPlay: Math.ceil(worst(demo.bytesToFirstPlay, 'hi', 20971520) * 1.15),
    minimumHostCeilingFps: 45
  };
  return {
    what: 'BOHEMIA -- how fast the game is on a phone-shaped browser. Taken by ' +
          'gates/bohemia_phone_perf.js, held by gates/fps_on_a_phone_gate.js.',
    takenOn: new Date().toISOString(),
    staleAfterDays: 30,
    refreshCommand: 'node gates/bohemia_phone_perf.js --repeat 3 --cpu 1 --record',
    host: hostFacts(),
    measured: M,
    goal: { timeToFirstPlayMs: 5000, walkFps: 60, fightFps: 60,
            source: 'VAMILY.md, PLUMBER row [sixty fps] FPS-ON-A-PHONE, Paolo 9/5' },
    budget: budget,
    owed: [
      'BATTERY IN TEN MINUTES ON A REAL HANDSET. No container can report milliamp-hours. ' +
      'What is here instead is main-thread CPU time, which is what a battery pays for.',
      'A REAL PHONE, FULL STOP. Chromium at 390x844 with a CPU throttle is a stand-in: it ' +
      'does not reproduce a phone GPU, its memory bandwidth, its thermal throttle or Safari.',
      'THE REAL LINK OVER A REAL NETWORK. These numbers come off a local server; the load ' +
      'time a stranger gets also carries GitHub Pages, TLS and whatever their signal is.'
    ],
    summaries: summaries,
    runCount: runs.length,
    repeatsPerConfiguration: (summaries[0] || {}).repeats || 1
  };
}

function recordProse(R) {
  const MB = n => (n / 1048576).toFixed(2) + ' MB';
  const s = n => (n / 1000).toFixed(1) + ' s';
  const M = R.measured, G = R.goal, B = R.budget;
  return `# BOHEMIA -- HOW FAST IT IS ON A PHONE (first measurement, ${R.takenOn.slice(0, 10)})

PLUMBER lane, VAMILY row [sixty fps] FPS-ON-A-PHONE. The row said "Write the numbers
before touching anything." These are the numbers. Nothing in the game was changed to
get them, and nothing in the game was changed after taking them.

## THE SHORT VERSION

| what a person meets | what it does | what he asked for | verdict |
|---|---|---|---|
| tap the link, see the city | ${s(M.worldReadyMs)} | -- | fine |
| tap the link, then MOVE | ${s(M.timeToFirstPlayMs)} | under ${s(G.timeToFirstPlayMs)} | MISSED by ${(M.timeToFirstPlayMs / G.timeToFirstPlayMs).toFixed(1)}x |
| main thread blocked while you wait | ${(M.mainThreadBlockedMsDuringBoot / 1000).toFixed(1)} s | -- | -- |
| the first minute of walking | ${M.walkFpsFirstMinute} fps | 60 fps | MISSED by ${(G.walkFps / Math.max(1, M.walkFpsFirstMinute)).toFixed(1)}x |
| walking, once it settles | ${M.walkFpsSettled} fps | 60 fps | ${M.walkFpsSettled >= 54 ? 'MET' : 'MISSED by ' + (G.walkFps / Math.max(1, M.walkFpsSettled)).toFixed(1) + 'x'} |
| a fight | ${M.fightFps} fps | 60 fps | MISSED by ${(G.fightFps / Math.max(1, M.fightFps)).toFixed(1)}x |
| downloaded before anything is on screen | ${M.bytesBeforeAnythingIsOnScreen != null ? MB(M.bytesBeforeAnythingIsOnScreen) : 'not measured this round'} | -- | -- |
| downloaded before you can move | ${MB(M.bytesToFirstPlay)} | -- | -- |
| downloaded by the end of one session | ${MB(M.bytesByTheEndOfTheRun)} | -- | -- |

## THE THREE THINGS THAT ARE ACTUALLY WRONG

**1. THE FIRST MINUTE IS THE WORST MINUTE, AND IT IS THE ONLY ONE A STRANGER SEES.**
The walked city pulls its sprite banks AFTER the first frame paints -- eight more
script files, 19.4 MB gzipped, one at a time, downloading and parsing and baking on
the same main thread the game draws on. So the walk measures ${M.walkFpsFirstMinute} fps
while that is happening and ${M.walkFpsSettled} fps once it is done. Both are true. Only
the first one is the one somebody who just tapped the link gets, and it is the one that
decides whether they keep tapping.
The late loader is not a mistake -- its own comment carries the measurement that put it
there (shipping those banks as deferred tags turned a five second wait into twenty-nine).
The problem is that nothing covers the gap it creates.

**2. THE WORLD IS DRAWN IN ${s(M.worldReadyMs)} AND YOU STILL CANNOT MOVE FOR ${s(M.timeToFirstPlayMs)}.**
Door at ${s(M.doorMs)}. The walked world says it is ready at ${s(M.worldReadyMs)}, and a
screenshot taken at that moment (saved beside this file) shows the city, the character, the
eight-way pad and the day card, all drawn. Then the main thread is BLOCKED FOR
${(M.mainThreadBlockedMsDuringBoot / 1000).toFixed(1)} SECONDS across ${M.longTaskCount} long
tasks, the worst single one ${(M.longestSingleBlockMs / 1000).toFixed(1)} seconds long, while
the sprite banks download and bake. Nothing can run in that window: not the game's metronome,
not a thumb, not a question asked from outside. A thumb held on the pad from the moment the
pad exists does not move anybody until ${s(M.timeToFirstPlayMs)}.
This is on a desktop-class box, over localhost, with no network delay at all. On a phone on
a real network, the transfer goes on top.

**3. A FIGHT RUNS AT ${M.fightFps} FPS AND ASKS FOR ${M.fightDrawCallsPerFrame} drawImage CALLS A FRAME.**
The 120 BPM law lives in the fight. A beat the frames cannot keep up with is a beat
nobody can play to.

## THE BATTERY, AS HONESTLY AS A CONTAINER CAN PUT IT

${M.cpuMinutesPerTenMinutesWalking == null ? 'Not measured this round.' :
`Milliamp-hours need a real handset and nothing here can invent them. What a battery actually
pays for is main-thread CPU time, and that can be measured, over a fixed window with a thumb
held down and again with nobody touching anything:

  standing still, doing nothing     ${M.cpuBusyStandingStillPercent}% of one core
  walking                           ${M.cpuBusyWalkingPercent}% of one core
  ten minutes of walking            ${M.cpuMinutesPerTenMinutesWalking} CPU-minutes

Read that last line as: ten minutes of play asks a phone for about
${M.cpuMinutesPerTenMinutesWalking} minutes of solid single-core work, before its screen, its
radio or its thermal throttle are counted. Windows of ${(M.batteryWindowMs / 1000).toFixed(0)}s
each.

These read lower than the ${M.mainThreadBusyWalkingPercent}% in the table above, and both are
right: that one is a five second hold taken moments after the world settles, this one is a
${(M.batteryWindowMs / 1000).toFixed(0)} second hold with the beat running steadily. The short
window catches the peak, the long one catches the average, and a battery is drained by the
average. THE REAL NUMBER IS STILL OWED and it is the first thing to take on a handset.`}

## AND ONE FINDING THAT IS NOT A NUMBER

**THE WAKE CARD SITS ON TOP OF THE PAD.** On boot, #daycard is inset:0 over the whole
walked surface, and the browser's own hit test returns the CARD for all eight direction
buttons. A stranger's first presses do nothing. This was found because the instrument's
first walk sample moved nobody and reported a perfectly healthy-looking 0 fps.

## THE SHELL TAX

The walked city is one page, and it can be measured twice: on its own, and inside the demo
that wraps it in an iframe. The steady thing is the COST, not the frame rate.

  standing still, the city alone      ${M.controlIdleBusyPercent != null ? M.controlIdleBusyPercent : '~1'}% of the main thread
  standing still, inside the demo     ${M.idleMainThreadBusyPercent}% of the main thread
  walking, the city alone             ${M.controlMainThreadBusyWalkingPercent}% of the main thread
  walking, inside the demo            ${M.mainThreadBusyWalkingPercent}% of the main thread

A same-origin iframe SHARES its parent's main thread, so every millisecond the shell spends
is a millisecond the city cannot draw in. The frames-per-second difference between the two is
real but noisy (the demo's settled walk ranged ${M.walkFpsSettledWorst} to ${M.walkFpsSettled}
fps across runs, and a later gate run of the same tree read even higher), so the CPU numbers
above are the ones to trust and the ones to watch.

And of the thread the walk does use, only ${M.paintingPercentOfThatBusy}% is painting: the
frame-rate problem in this game is not the drawing.

## HOW THESE WERE TAKEN, AND WHAT THEY ARE NOT

${M.surface}. Every input is a real touch event. Every headline number is the MEDIAN OF
${R.repeatsPerConfiguration} RUNS of that configuration (${R.runCount} runs in all) with its
spread kept beside it in the JSON, because single runs of this disagreed by 3x. Frame rates are frames DELIVERED over wall time, not the median gap
between frames -- the gap distribution is bimodal and its median reports the best moment
of a walk as if it were the whole walk.

STILL OWED:
${R.owed.map(o => '  - ' + o).join('\n')}

## THE BUDGET THE GATE NOW HOLDS

The goal (60 / 60 / five seconds) is REPORTED on every gate run and never asserted: the
build misses all three today, and a gate that is red on arrival gets switched off by the
next session that hits it. What is asserted is a RATCHET at today's truth plus the measured
spread, so the day somebody makes this WORSE is a red line instead of a drift nobody sees.

  time to first play          <= ${B.timeToFirstPlayMs} ms
  frames walking, settled     >= ${B.walkFpsSettled} fps
  main thread while walking   <= ${B.mainThreadBusyWalkingPercent} %
  frames in a fight           >= ${B.fightFps} fps
  bytes before you can move   <= ${B.bytesToFirstPlay}
  and the host must hand an empty canvas >= ${B.minimumHostCeilingFps} fps, or it cannot judge

Refresh with: \`${R.refreshCommand}\`
Held by: gates/fps_on_a_phone_gate.js   Taken by: gates/bohemia_phone_perf.js
`;
}

/* ---- CLI ---------------------------------------------------------------- */
async function main() {
  const a = process.argv.slice(2);
  const arg = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
  const has = k => a.includes(k);
  const pages = arg('--page') ? [arg('--page')] : ['alpha', 'demo'];
  const cpus = arg('--cpu') ? [Number(arg('--cpu'))] : [1, 4];
  const net = arg('--net', 'none');
  const opts = {
    net, holdMs: Number(arg('--hold', 6000)), fightMs: Number(arg('--fightms', 4000)),
    battery: has('--battery'), batteryMs: Number(arg('--batteryms', 30000)),
    fight: !has('--nofight'), log: s => console.log(s)
  };
  const reps = Number(arg('--repeat', 1));
  if (has('--record')) opts.shotPath = path.join(ROOT, 'records/BOHEMIA_PHONE_PERF_FIRST_SCREEN_9_5_26.png');
  const runs = [];
  const summaries = [];
  if (!has('--nocontrol')) {
    for (const c of cpus) {
      const group = [];
      for (let k = 0; k < reps; k++) {
        console.log('\n=== THE WALKED CITY ON ITS OWN (the control) at CPU x' + c +
                    (reps > 1 ? '  [run ' + (k + 1) + ' of ' + reps + ']' : '') + ' ===');
        const r = await measureControl(Object.assign({}, opts, { cpu: c }));
        console.log('  frames offered  : ' + r.idleCeilingFps + ' fps to the city page, vs ' +
                    r.emptyPageCeilingFps + ' fps to an empty page');
        console.log('  idle main thread: ' + r.idleCpu.busyPercent + '% busy');
        console.log('  WALKING         : ' + r.walk.rendersPerSecond + ' fps delivered, ' +
                    r.walk.renderCostMs.med + ' ms a frame, main thread ' + r.walk.cpu.busyPercent +
                    '% busy' + (r.walk.valid ? '' : '   <-- INVALID SAMPLE, the thumb never moved anybody'));
        runs.push(r); group.push(r);
      }
      summaries.push(summarise(group));
    }
  }
  for (const p of pages) {
    for (const c of cpus) {
     const group = [];
     for (let k = 0; k < reps; k++) {
      console.log('\n=== ' + p.toUpperCase() + ' at CPU x' + c +
                  (net !== 'none' ? ' on ' + net : '') +
                  (reps > 1 ? '  [run ' + (k + 1) + ' of ' + reps + ']' : '') + ' ===');
      const r = await measure(Object.assign({}, opts, { page: p, cpu: c }));
      console.log('  first play      : ' + r.firstPlay.firstStep + ' ms' +
                  (r.firstPlay.cardWasInTheWay ? '  (a card was over the pad)' : ''));
      console.log('  to first play   : ' + (r.transfer.bytesToFirstPlay / 1048576).toFixed(2) +
                  ' MB;  by the end of the run ' + (r.transfer.bytesOverTheWire / 1048576).toFixed(2) +
                  ' MB in ' + r.transfer.requests + ' requests');
      console.log('  FIRST-MINUTE WALK: ' + (r.walkFirstMinute ? r.walkFirstMinute.rendersPerSecond : '?') +
                  ' fps while the art is still landing');
      console.log('  frames offered  : ' + r.rafCeiling.best + ' fps inside the shell, vs ' +
                  r.emptyPageCeilingFps + ' fps to an empty page in the same browser');
      console.log('  WALKING         : ' + r.walk.rendersPerSecond + ' fps delivered (' +
                  r.walk.fpsWhileAnimating + ' fps in the good bursts), ' +
                  r.walk.renderCostMs.med + ' ms a frame, main thread ' +
                  r.walk.cpu.busyPercent + '% busy' +
                  (r.walk.valid ? '' : '   <-- INVALID SAMPLE, the thumb never moved anybody'));
      if (r.fight) console.log('  FIGHTING        : ' + (r.fight.reached
        ? r.fight.fpsWhileAnimating + ' fps' : 'NOT REACHED -- ' + r.fight.why));
      if (r.battery) console.log('  CPU walking     : ' + r.battery.walking.busyPercent +
                  '% busy -> ' + r.battery.cpuMinutesPerTenMinutesWalking + ' CPU-min per 10 min');
      runs.push(r); group.push(r);
     }
     summaries.push(summarise(group));
    }
  }
  console.log('\n================ MEDIANS ================');
  for (const S of summaries) {
    console.log(S.page + ' x' + S.cpuThrottle + ' (' + S.repeats + ' run(s))');
    for (const k of Object.keys(S)) {
      const v = S[k];
      if (v && typeof v === 'object' && v.med != null)
        console.log('   ' + k.padEnd(32) + v.med + '   [' + v.lo + ' .. ' + v.hi + ']');
    }
  }
  const outf = arg('--json');
  if (outf) {
    fs.writeFileSync(outf, JSON.stringify({ summaries, runs }, null, 2));
    console.log('\nwrote ' + outf);
  }
  if (has('--record')) {
    const R = buildRecord(summaries, runs);
    const j = path.join(ROOT, 'records/BOHEMIA_PHONE_PERF_9_5_26.json');
    const m = path.join(ROOT, 'records/BOHEMIA_PHONE_PERF_9_5_26.md');
    fs.writeFileSync(j, JSON.stringify(R, null, 2));
    fs.writeFileSync(m, recordProse(R));
    console.log('wrote ' + j + '\nwrote ' + m);
  }
  return { summaries, runs };
}

module.exports = { measure, measureControl, pollUntil, WITNESS, summarise, median, awaitQuiet, buildRecord, recordProse, padPointsTop, clearTheWay, bootToPlay, walkSample, idleSample, rafCeiling, padPoints,
                   startServer, requirePlaywright, PHONE, PAGES, NETS, stats,
                   touchDown, touchMove, touchUp, cpu, cpuDelta, PROBE };

if (require.main === module) {
  main().then(() => process.exit(0)).catch(e => { console.error('ERR ' + e.message); process.exit(1); });
}
