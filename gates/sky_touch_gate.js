#!/usr/bin/env node
/* SKY TOUCH GATE (8/15/26, WORLD lane) — HIS P0, AND IT ONLY EVER BROKE ON TOUCH.
 *
 *   "the zoom out didn't work, once I started to leave the city it kind of crashed."
 *                                                       -- Paolo, 8/13, on his own phone
 *
 * THE WHEEL PATH WORKED THE WHOLE TIME. That is the entire reason this gate exists and the
 * reason it drives REAL TOUCH EVENTS through CDP rather than clicking or calling functions:
 * a desktop-verified feature shipped broken to his hand, which is exactly what VERIFY ON
 * THE REAL SURFACE (7/18) is about. A gate that called skyZoom() directly would have been
 * green on the broken build.
 *
 * WHAT WAS WRONG, all of it from one root -- in SKY, MODE is still 'city', so every pointer
 * handler on the page believed it was looking at the city:
 *   1. NO touch path advanced the sky at all. Measured: the pinch moved SKYU by zero.
 *   2. THE FREEZE. The pinch branch ran setZoomAt() AND the pan branch, each ending in
 *      render(), and render() in SKY is a full N x N per-tile valley loop. Measured: 21
 *      full redraws for TEN touch moves, 8.2 ms each, against a 16 ms frame.
 *   3. A tap at the moon selected an invisible city plot underneath.
 *
 * AND THE FIX'S OWN FIRST VERSION MADE (2) WORSE, which is why the render budget is
 * asserted and not assumed: skyZoom() ends in render(), one touch move can be several
 * steps, and stepping it naively measured FORTY-ONE redraws for twelve moves. The number
 * caught it. A gate that only checked "does the pinch reach the moon" would have shipped a
 * worse freeze than the one it was written to fix.
 *
 *   node gates/sky_touch_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

const PAGE = 'slices/BOHEMIA_CITY_WORLD.html';
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

function requirePlaywright() {
  const globals = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules'];
  for (const g of globals) { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

const TOOL = fs.readFileSync('tools/bohemia_city_sky_touch_patch.py', 'utf8');
/* A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1), and this file
   tripped over it on its own first run: the tool's docstring explains the bug with the
   words "strands him at SKYU=0", and the assertion below read that sentence as the
   violation. Strip the module docstring and the comments, then look at what the code
   actually DOES. Third time this class of mistake showed up today. Fix the ruler. */
const TOOL_CODE = TOOL.replace(/^\s*(?:"""[\s\S]*?"""|'''[\s\S]*?''')/m, '')
                      .replace(/^\s*#.*$/gm, '');
const src = fs.readFileSync(PAGE, 'utf8');
{
  const mark = (TOOL.match(/^MARK = '(.*)'/m) || [, ''])[1];
  const end = (TOOL.match(/^ENDMARK = '(.*)'/m) || [, ''])[1];
  ok('the fix is a re-runnable tool with one delimited block, so a rebase cannot half-apply ' +
     'it and a rename cannot orphan it',
     !!mark && src.split(mark).length === 2 && src.split(end).length === 2);
}
ok('it steps the page\'s EXISTING skyZoom rather than reaching into SKYU by hand, so the ' +
   'wheel path and the floor check stay byte-identical',
   /skyZoom\(dir\)/.test(TOOL_CODE) && !/SKYU\s*=[^=]/.test(TOOL_CODE));

(async () => {
  let browser;
  try {
    const { chromium } = requirePlaywright();
    browser = await chromium.launch();
    /* HIS DEVICE, NOT A DESKTOP: iPhone-shaped viewport with touch. */
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                           hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    await p.goto('file://' + path.join(ROOT, PAGE));
    await p.waitForTimeout(3000);
    await p.evaluate(() => { try { cardHide(); } catch (e) {} });
    const cdp = await ctx.newCDPSession(p);
    const touch = (type, tp) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: tp });

    await p.evaluate(() => {
      window.__r = 0;
      const o = window.render;
      window.render = function () { window.__r++; return o.apply(this, arguments); };
      window.__panX = panX; window.__panY = panY; window.__cz = CZOOM;
      skyEnter();
      window.__r0 = window.__r;
    });

    /* PINCH TOGETHER = zoom out = up. The same gesture that carried him over the seam. */
    const MOVES = 12;
    await touch('touchStart', [{ x: 100, y: 400, id: 1 }, { x: 300, y: 400, id: 2 }]);
    for (let i = 1; i <= MOVES; i++) {
      await touch('touchMove', [{ x: 100 + i * 7, y: 400, id: 1 },
                                { x: 300 - i * 7, y: 400, id: 2 }]);
    }
    await touch('touchEnd', []);
    await p.waitForTimeout(250);

    const up = await p.evaluate(() => ({
      u: SKYU, band: skyBand(), inSky: SKY, renders: window.__r - window.__r0,
      cameraUntouched: panX === window.__panX && panY === window.__panY && CZOOM === window.__cz
    }));

    ok('A PINCH ON A REAL TOUCH DEVICE MOVES THE SKY AT ALL -- his "the zoom out didn\'t ' +
       'work", and it moved by exactly zero before this', up.u > 0);
    ok('and it carries all the way to the MOON rather than stalling partway (' +
       up.band + ')', up.band === 'MOON' && up.u >= 0.99);
    /* THE BUDGET, and it is the assertion that caught the fix's own first version making
       the freeze WORSE. Under one full redraw per touch move, where it used to be 2.1. */
    ok('AND IT COSTS UNDER ONE FULL REDRAW PER TOUCH MOVE (' + up.renders + ' for ' + MOVES +
       ' moves; it was 21 for 10 before, and 41 for 12 with the naive fix)',
       up.renders < MOVES);
    ok('the city camera is not touched while the sky is up -- no zoom, no pan falling ' +
       'through underneath', up.cameraUntouched);

    /* AND THE SAME GESTURE BRINGS HIM HOME. */
    await touch('touchStart', [{ x: 184, y: 400, id: 1 }, { x: 216, y: 400, id: 2 }]);
    for (let i = 1; i <= 25; i++) {
      await touch('touchMove', [{ x: 184 - i * 7, y: 400, id: 1 },
                                { x: 216 + i * 7, y: 400, id: 2 }]);
    }
    await touch('touchEnd', []);
    await p.waitForTimeout(250);
    ok('and pinching the other way rides back DOWN and lands him in the valley, so one ' +
       'gesture carries him both directions',
       await p.evaluate(() => !SKY && SKYU === 0));

    /* TAP-THROUGH: a tap at the moon must not select a city plot underneath. */
    await p.evaluate(() => { skyEnter(); window.__sel = JSON.stringify((typeof CB !== 'undefined' && CB) ? CB.sel : null); });
    await touch('touchStart', [{ x: 195, y: 300, id: 1 }]);
    await touch('touchEnd', []);
    await p.waitForTimeout(200);
    ok('a tap at the moon does NOT select an invisible city plot underneath it',
       await p.evaluate(() => JSON.stringify((typeof CB !== 'undefined' && CB) ? CB.sel : null) === window.__sel));

    /* *** THE WHOLE JOURNEY, WHICH IS THE ONLY THING HE ACTUALLY ASKED FOR. ***
       He reported this STILL broken after the first fix shipped: "I can't zoom out all the
       way from my location all the way to the moon." He was right, and the reason is the
       shape of this gate. Every assertion above starts by CALLING skyEnter() -- the sky was
       proved in isolation, and the seam was proved in isolation, and NOBODY EVER WALKED THE
       WHOLE ROAD. The bug lived exactly in the join: the gesture that OPENS the sky was
       consumed doing it, and the handler's private finger-model desynchronised, so from a
       standing start he could get into the sky and then no further.
       GATING THE PIECES IS NOT GATING THE JOURNEY. This walks it from the default start, on
       realistic thumb-and-forefinger pinches, with nothing pre-set. */
    {
      await p.goto('file://' + path.join(ROOT, PAGE));
      await p.waitForTimeout(2500);
      await p.evaluate(() => { try { cardHide(); } catch (e) {} });
      const start = await p.evaluate(() => ({ mode: MODE, sky: SKY }));
      ok('the journey starts where the player starts: on foot, no sky, nothing pre-set',
         start.mode === 'human' && start.sky === false);

      /* A real thumb-and-forefinger pinch on a phone: ~150px apart closing to ~60px. That
         is one hand's comfortable travel, not the 270px lab squeeze the rest of this file
         uses -- and the difference between them is the difference between a gate passing
         and his hand failing. */
      const realPinch = async () => {
        const cx = 195, cy = 430;
        await touch('touchStart', [{ x: cx - 75, y: cy, id: 1 }, { x: cx + 75, y: cy, id: 2 }]);
        for (let i = 1; i <= 10; i++) {
          const h = 75 - i * 4.5;
          await touch('touchMove', [{ x: cx - h, y: cy, id: 1 }, { x: cx + h, y: cy, id: 2 }]);
        }
        await touch('touchEnd', []);
        await p.waitForTimeout(220);
      };

      let pinches = 0, reached = false;
      for (; pinches < 8 && !reached; ) {
        await realPinch();
        pinches++;
        reached = await p.evaluate(() => SKY && skyBand() === 'MOON');
      }
      ok('FROM HIS LOCATION ALL THE WAY TO THE MOON, on ordinary pinches, with nothing ' +
         'pre-set -- his exact words, and it took ' + pinches + ' pinches', reached);
      ok('and it gets there in a handful of gestures rather than a marathon (' + pinches +
         ' <= 6), because "it works if you pinch it fifteen times" is what broken feels like',
         reached && pinches <= 6);

      /* *** AND ALL THE WAY BACK, WHICH IS THE SECOND HALF HE HAD TO REPORT SEPARATELY. ***
         Paolo, right after seeing the moon: "I tried to zoom back in and then the game
         started breaking." It did. The city froze at its widest zoom PERMANENTLY -- every
         pinch asked it to zoom to exactly where it already was -- because this handler was
         swallowing pointerup, so the city's map of fingers-currently-down never got cleaned
         and it kept measuring the gap between two fingers that had left the glass.
         THE FIRST VERSION OF THIS GATE PROVED "pinching the other way rides back DOWN" AND
         WAS TRUE: it tested the sky's own descent, from inside the sky, and stopped the
         moment the sky closed. The break was one step further on, in the city underneath.
         I HAD ALREADY LEARNED THIS LESSON TODAY AND ONLY HALF-APPLIED IT: I extended the
         gate to walk the journey OUT, and left the journey BACK as a fragment. A round trip
         is one journey, not two, and it is not gated until it lands where it started. */
      const realSpread = async () => {
        const cx = 195, cy = 430;
        await touch('touchStart', [{ x: cx - 30, y: cy, id: 1 }, { x: cx + 30, y: cy, id: 2 }]);
        for (let i = 1; i <= 10; i++) {
          const h = 30 + i * 4.5;
          await touch('touchMove', [{ x: cx - h, y: cy, id: 1 }, { x: cx + h, y: cy, id: 2 }]);
        }
        await touch('touchEnd', []);
        await p.waitForTimeout(220);
      };

      let back = 0, home = false, zooms = [];
      for (; back < 10 && !home; ) {
        await realSpread();
        back++;
        const w = await p.evaluate(() => ({ m: MODE, sky: SKY, cz: +CZOOM.toFixed(3) }));
        zooms.push(w.cz);
        home = (w.m === 'human' && !w.sky);
      }
      ok('AND ALL THE WAY BACK DOWN TO HIS FEET, on ordinary pinches -- moon to standing on ' +
         'the street in ' + back + ' gestures', home);
      /* THE SPECIFIC CORRUPTION, NAMED: a frozen city reports the SAME zoom every gesture. */
      const froze = zooms.length > 3 &&
        zooms.slice(1, 4).every(z => z === zooms[0]);
      ok('and the city zoom actually MOVES on the way back rather than repeating one frozen ' +
         'number (' + zooms.slice(0, 4).join(' -> ') + ') -- that repetition IS the bug, and ' +
         'it is what a swallowed finger-release looks like from the outside', !froze);
    }

    ok('and nothing throws through the whole round trip',
       errs.length === 0 || (console.log('  (errors: ' + errs.slice(0, 2).join(' | ') + ')'), false));
  } catch (e) {
    fail++;
    console.log('  FAIL: the gate could not drive real touch -- ' + e.message);
  } finally {
    if (browser) await browser.close();
  }

  console.log('SKY TOUCH GATE: ' + pass + ' passed, ' + fail + ' failed  (a real pinch on a ' +
              'real touch device rides to the moon and back, under one redraw per move, ' +
              'with nothing falling through to the city underneath)');
  process.exit(fail ? 1 : 0);
})();
