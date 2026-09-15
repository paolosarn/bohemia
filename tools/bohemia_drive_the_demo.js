/* ============================================================================
   DRIVE THE DEMO LIKE A PLAYER (9/13/26, LIFE + CITY lane)

   Rule 14: THE DEMO'S FIRST FIVE MINUTES ON A PHONE IS THE ONLY MEASURE OF THE GAME.
   You cannot measure that by setting variables. This lane proved it twice, expensively:

     [tiles not slabs]  I set TW by hand, rendered, and reported "zero images at every
                        zoom". The game recomputes TW every frame from its own zoom, so
                        I had measured a camera the game never has. Two screenshots
                        labelled TW=18 and TW=28 came back PIXEL-IDENTICAL and I nearly
                        read them as a before/after. The real number was the opposite.
     [freeway reads]    Same again with city.x and MODE: four attempts at a before/after
                        picture, every one a frame the game repainted before the shutter.

   SO THIS DRIVES REAL POINTER EVENTS AT REAL SCREEN COORDINATES, and it exists because
   four separate traps sit between a script and the glass. Every one cost this lane a
   round:

     1. THE IFRAME OFFSET. The canvas lives in an iframe, so a rect measured inside it
        is iframe-relative. A tap needs the frame's own box added or it lands nowhere.
     2. THE CARD. A card sits over the glass at the door and eats every tap silently --
        the whole screen reads as "nothing happened". ITS BUTTON SAYS "GET UP". I
        guessed NOT NOW / SKIP / CLOSE / OK, none of which exist, and got a clean
        "nothing moved" from all four.
     3. A TEXT SELECTOR IS NOT A FINGER. Clicking by text matched a hidden copy and
        did nothing; a touch at the element's real screen position worked.
     4. ASSIGNMENT IS NOT INPUT. MODE, TW, city.x and CZOOM are all recomputed by the
        loop. The only honest way in is the control a player uses.

   WHAT IT ANSWERS, measured on the shipped demo 9/13:
     - the way into CITY mode is the PINCH, and it works on the first hard squeeze
       (HZOOM 44 -> 11, mode human -> city). The round button is deliberately quiet
       when nothing is in front of you and the CITY chip is built but never appended,
       so the pinch is the only door -- and it opens.
     - on foot the walked surface paints 37.4M pixels of ART against 9.2M of flat fill:
       FOUR FIFTHS OF WHAT HE SEES IS ART. "the streets don't look like streets" is
       therefore not a missing renderer; the pixels are there and they read flat.

   USE IT:  const D = require('./tools/bohemia_drive_the_demo.js');
            const d = await D.open();          // boots the demo, clears the card
            await d.pinchOut();                // crosses the seam into CITY
            await d.shot('/tmp/x.png');        // the canvas only, no chrome
            console.log(await d.state());
            await d.close();
   ========================================================================== */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.json': 'application/json', '.png': 'image/png',
               '.webmanifest': 'application/manifest+json' };

async function open(opts) {
  opts = opts || {};
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    const f = path.join(ROOT, u.replace(/^\//, ''));
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;

  const browser = await chromium.launch();
  /* A PHONE, because that is the only surface rule 14 talks about. */
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 3,
    hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));

  /* EXTENDED 9/15 (PLUMBER, rule 14(g): every lane that walks the five minutes uses
     this or extends it). TWO THINGS PAOLO ASKED FOR BY NAME ON HIS SECOND PLAY:
     "it's kinda not running as smoothly as I would like, MAYBE IT'S CAUSE THINGS ARE
     LOADING IN REAL TIME."

     (1) opts.throttle -- a CPU throttling rate, the same knob DevTools uses. This
         container is not a handset and never was; every fps number this fleet has
         posted was measured on a machine several times faster than the thing in his
         hand, which is why "57 fps" and "not running smoothly" can both be true.
     (2) loads -- every response the page takes, with the millisecond it landed and
         how big it was, so "what loads while he is playing" is a LIST and not a
         feeling. `firstPaint` is stamped the moment the city frame exists, and
         anything after that is loading DURING play.

     Both are off unless a caller asks, so no existing use of this driver changes. */
  const t00 = Date.now();
  const loads = [];
  let firstPaintAt = null;
  page.on('response', (r) => {
    const u = r.url();
    const rel = u.replace(/^https?:\/\/[^/]+/, '').split('?')[0];
    /* SIZE FROM DISK, NOT FROM THE HEADER. This little server streams the file and
       never sets content-length, so every row read 0 KB on the first cut and "28 files
       arrived during play" came with no weight attached. A list of names is an
       accusation; a list of names and megabytes is a measurement. */
    let bytes = 0;
    try { bytes = fs.statSync(path.join(ROOT, rel.replace(/^\//, ''))).size; } catch (e) {}
    loads.push({ at: Date.now() - t00, url: rel, status: r.status(), bytes });
  });
  const cdpEarly = await ctx.newCDPSession(page);
  if (opts.throttle && opts.throttle > 1) {
    await cdpEarly.send('Emulation.setCPUThrottlingRate', { rate: opts.throttle });
  }

  await page.goto('http://127.0.0.1:' + port + '/slices/'
    + (opts.file || 'BOHEMIA_DEMO.html'), { waitUntil: 'load', timeout: 300000 });
  /* WAIT FOR THE DOOR, DO NOT GUESS HOW LONG IT TAKES (COOK 9/14, [streets fixed] r3).
     The two waits here were blind: 15 s for the front splash, 22 s for the city frame.
     That is tuned to the DEMO on one machine. Pointed at the ALPHA -- which is where
     every building lane ships, and which carries whatever landed since the last cut --
     the splash had not appeared inside 15 s, the click hit nothing, and the driver threw
     "no city frame" on a game that boots perfectly. A lane reading that would conclude
     the alpha is broken. So both waits now POLL for the thing they were waiting for and
     keep the old numbers only as the ceiling. Nothing changes for the demo; the alpha
     becomes reachable. */
  const until = async (fn, ms) => {
    const t0 = Date.now();
    for (;;) {
      try { if (await fn()) return true; } catch (_e) {}
      if (Date.now() - t0 > ms) return false;
      await page.waitForTimeout(250);
    }
  };
  /* EXTENDED 9/14 (SOUNDS, rule 14g: every lane that walks the five minutes uses this
     or extends it). A HOOK BEFORE THE TAP, because some instruments have to be in
     place BEFORE the door opens or they measure the wrong five minutes. The ear is
     the case that forced it: the front tap is the first sound in the game and the
     song takes the beat off the pulse a moment later, so a recorder installed after
     the tap misses the only part nobody has ever checked. It is a no-op unless a
     caller passes it, so no existing use of this driver changes.
     KEPT WHERE SOUNDS PUT IT, BEFORE THE TAP -- it now runs after the door is SEEN
     rather than after a blind 15 s, which is the same moment or earlier, never later. */
  await until(() => page.evaluate(() => {
    const f = document.getElementById('fronttap') || document.getElementById('front');
    return !!(f && getComputedStyle(f).display !== 'none');
  }), opts.boot || 15000);
  if (typeof opts.beforeTap === 'function') await opts.beforeTap(page);
  /* TRAP 5, AND IT IS TRAP 3 WEARING A HAT: THERE ARE TWO FRONT DOORS AND ONLY ONE OF
     THEM OPENS. The alpha carries BOTH #fronttap and #front. This picked #fronttap with
     an || and clicked it, and on the alpha that is the wrong element: measured, the
     splash sat there with #fronttap present and display:block for eighty seconds while
     nothing happened, and the driver reported "no city frame" on a game that boots fine.
     Tapping #front opened it on the first try. So TAP BOTH, with a real finger, and keep
     click() as the belt: neither costs anything and between them every surface opens. */
  for (const id of ['fronttap', 'front']) {
    const b = await page.evaluate((i) => {
      const f = document.getElementById(i);
      if (!f || getComputedStyle(f).display === 'none') return null;
      const r = f.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) return null;
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }, id);
    if (b) await page.touchscreen.tap(b.x, b.y);
    await page.evaluate((i) => { const f = document.getElementById(i); if (f) f.click(); }, id);
  }

  let fr = null;
  await until(async () => {
    fr = page.frames().filter(f => /BOHEMIA_CITY_WORLD/.test(f.url()))[0];
    return !!fr;
  }, opts.settle || 22000);
  if (!fr) { await browser.close(); server.close(); throw new Error('no city frame'); }
  /* the city frame exists: from here on, anything that arrives is loading DURING PLAY */
  if (firstPaintAt === null) firstPaintAt = Date.now() - t00;
  /* and the frame existing is not the world being there */
  await until(() => fr.evaluate(() => typeof MODE !== 'undefined' && MODE === 'human'
    && document.querySelectorAll('.pb').length === 8), opts.world || 120000);
  /* TRAP 1: the frame's own box, added to every coordinate below. */
  const fb = await (await fr.frameElement()).boundingBox();

  const tapAt = (x, y) => page.touchscreen.tap(fb.x + x, fb.y + y);
  /* TRAP 3: a real finger at the element's real position, never a text click. */
  const tapEl = async (sel) => {
    const h = await fr.$(sel); if (!h) return false;
    const b = await h.boundingBox(); if (!b) return false;
    await tapAt(b.x + b.width / 2, b.y + b.height / 2);
    return true;
  };

  /* TRAP 2: the card, and its button says GET UP.

     AND IT HAS TO BE PATIENT, NOT PROMPT (9/14, FACTIONS). This used to stop at the
     first pass that found nothing -- `if (!hit) break` -- so a card that appears one
     beat after the sweep is never cleared at all. Measured on the demo: the day card
     was up over the whole canvas with elementFromPoint returning DIV#daycard at every
     point a finger could land, so every pinch, tap and reading after it was taken
     through a card. A driver that boots behind a card it cannot dismiss makes every
     lane's five minutes wrong at once, and quietly.

     IT ALSO PRESSES THE CARD'S OWN WAY OUT. The label list is a guess that has been
     wrong before ("I guessed NOT NOW / SKIP / CLOSE / OK, none of which exist"); the
     card's exit control carries its own mark, and that is not a guess. */
  const clearCards = async () => {
    for (let i = 0; i < 8; i++) {
      let hit = false;
      /* the card's own way out first, because it is the card's and not mine */
      for (const sel of ['.dcgo[data-act="go"]', '[data-act="close"]', '.dcgo']) {
        const h = await fr.$(sel).catch(() => null);
        if (h && await h.isVisible().catch(() => false)) {
          const b = await h.boundingBox();
          if (b) { await tapAt(b.x + b.width / 2, b.y + b.height / 2); hit = true; break; }
        }
      }
      if (!hit) for (const label of ['GET UP', 'NOT NOW', 'SKIP', 'CONTINUE', 'CLOSE', 'OK']) {
        const h = await fr.$(`text="${label}"`).catch(() => null);
        if (h && await h.isVisible().catch(() => false)) {
          const b = await h.boundingBox();
          if (b) { await tapAt(b.x + b.width / 2, b.y + b.height / 2); hit = true; break; }
        }
      }
      await page.waitForTimeout(hit ? 1400 : 900);
      /* KEEP GOING EVEN WHEN A PASS FINDS NOTHING, until the glass is really clear.
         The question is not "did I press something", it is "is the canvas reachable". */
      const clear = await fr.evaluate(() => {
        const c = document.querySelector('canvas'); if (!c) return false;
        const b = c.getBoundingClientRect();
        const el = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
        return !!el && el.tagName === 'CANVAS';
      }).catch(() => true);
      if (clear) break;
    }
  };
  await clearCards();
  await page.waitForTimeout(1200);

  const box = await fr.evaluate(() => {
    const c = document.querySelector('canvas'); const r = c.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  const CX = fb.x + box.x + box.w / 2, CY = fb.y + box.y + box.h / 2;
  const cdp = await ctx.newCDPSession(page);

  /* TRAP 4: the seam is crossed by a PINCH, not by assigning MODE. Fingers together
     is zoom out is toward the city; measured, one hard squeeze does it.

     TRAP 6 (9/14, FACTIONS): AND A FINGER THAT LANDS ON A BUTTON IS NOT ON THE
     CANVAS. This pinch used to lay the two fingers left and right of centre, 150 px
     apart. On a 390 px phone that puts the left one at x=45, and the left edge of
     this game is a rail of controls -- elementFromPoint at that spot returns
     DIV#rungbtn "STANDING", not the canvas. A pointerdown on a button never reaches
     the canvas's own handler, so the canvas saw ONE finger, its two-finger branch
     never ran, and the squeeze did nothing at all. Measured on the demo:

       fingers ACROSS, 150 -> 25   mode human, HZOOM 44, unchanged, every time
       the SAME squeeze UP/DOWN    mode CITY, HZOOM 44 -> 11, on the first try

     Nothing was wrong with the game: the seam obeys Paolo's 8/2 ruling and opens on
     the first honest squeeze. What was wrong was this instrument, and rule 14(g)
     points every lane at it, so a lane using it could walk away certain the city
     view was dead. IT ASKS THE PAGE WHO IS UNDER EACH FINGER NOW, and picks an axis
     where both are really on the canvas, so a rail added tomorrow cannot silently
     break it again. */
  const clearAxis = async (r) => await fr.evaluate((rad) => {
    const c = document.querySelector('canvas'); const b = c.getBoundingClientRect();
    const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
    const onCv = (x, y) => { const el = document.elementFromPoint(x, y);
      return !!el && el.tagName === 'CANVAS'; };
    if (onCv(cx, cy - rad) && onCv(cx, cy + rad)) return 'v';
    if (onCv(cx - rad, cy) && onCv(cx + rad, cy)) return 'h';
    return null;
  }, r);

  const pinch = async (from, to, steps) => {
    steps = steps || 20;
    /* the widest spread this gesture reaches is what has to be clear */
    const wide = Math.max(from, to);
    let axis = await clearAxis(wide);
    if (!axis) axis = await clearAxis(Math.round(wide * 0.7));
    if (!axis) axis = 'v';   /* say so rather than silently doing nothing */
    for (let i = 0; i <= steps; i++) {
      const r = from + (to - from) * i / steps;
      const pts = axis === 'v'
        ? [{ x: CX, y: CY - r, id: 1 }, { x: CX, y: CY + r, id: 2 }]
        : [{ x: CX - r, y: CY, id: 1 }, { x: CX + r, y: CY, id: 2 }];
      await cdp.send('Input.dispatchTouchEvent', {
        type: i === 0 ? 'touchStart' : 'touchMove', touchPoints: pts });
      await page.waitForTimeout(28);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(1500);
  };

  return {
    page, fr, ctx, browser, errs,
    /* what loaded, and where the door was in that list (PLUMBER 9/15) */
    loads, cdp: cdpEarly,
    firstPaintMs: () => firstPaintAt,
    bootAt: () => t00,          /* the driver's zero, so a caller can share one axis */
    throttle: opts.throttle || 1,
    lateLoads: () => loads.filter(l => firstPaintAt !== null && l.at > firstPaintAt),
    state: () => fr.evaluate(() => ({
      mode: typeof MODE !== 'undefined' ? MODE : '?',
      tw: typeof TW !== 'undefined' ? +TW.toFixed(1) : null,
      czoom: typeof CZOOM !== 'undefined' ? +CZOOM.toFixed(3) : null,
      hzoom: typeof HZOOM !== 'undefined' ? +HZOOM.toFixed(3) : null,
      hx: typeof hx !== 'undefined' ? hx : null,
      hy: typeof hy !== 'undefined' ? hy : null })),
    clearCards, tapEl, tapAt,
    pinchOut: () => pinch(150, 25),          /* toward the city */
    pinchIn:  () => pinch(25, 150),          /* back down to the street */
    /* the canvas only: the phone chrome is not the game */
    shot: async (file) => { await page.waitForTimeout(700);
      await page.screenshot({ path: file,
        clip: { x: fb.x + box.x, y: fb.y + box.y, width: box.w, height: box.h } }); },
    /* every visible control by WHAT IT SAYS, because that is all he has */
    controls: () => fr.evaluate(() => {
      const out = [], seen = {};
      for (const el of Array.from(document.querySelectorAll('div,button,span'))) {
        if (el.children.length > 2) continue;
        const t = (el.textContent || '').trim();
        if (!t || t.length > 28 || seen[t]) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 8 || r.height < 8) continue;
        if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
        const st = getComputedStyle(el);
        if (st.display === 'none' || st.visibility === 'hidden' || +st.opacity === 0) continue;
        seen[t] = 1; out.push({ text: t, id: el.id || '' });
      }
      return out; }),
    close: async () => { await ctx.close(); await browser.close(); server.close(); }
  };
}

module.exports = { open };

/* run it directly for a look: node tools/bohemia_drive_the_demo.js /tmp/out */
if (require.main === module) {
  (async () => {
    const out = process.argv[2] || '/tmp/demo';
    const d = await open();
    console.log('at the door : ' + JSON.stringify(await d.state()));
    console.log('controls    : ' + (await d.controls()).map(c => c.text).join(' | '));
    await d.shot(out + '_00_door.png');
    await d.pinchOut();
    console.log('after pinch : ' + JSON.stringify(await d.state()));
    await d.shot(out + '_01_city.png');
    await d.pinchIn();
    console.log('back down   : ' + JSON.stringify(await d.state()));
    await d.shot(out + '_02_street.png');
    console.log('page errors : ' + (d.errs.length ? d.errs[0] : 'none'));
    await d.close();
  })().catch(e => { console.log('FAILED: ' + e.message); process.exit(1); });
}
