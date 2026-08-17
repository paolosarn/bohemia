#!/usr/bin/env node
/* FRAME BUDGET GATE (8/15/26, WORLD lane) — THE FIRST PERF GAUGE IN THE REPO.
 *
 * DEMO BOARD ROW 8 SAID IT PLAINLY: "step latency is gated, render latency is measured
 * NOWHERE. A perf claim without a gauge is a guess." It was right. Of roughly 150 gates,
 * ZERO measured how much work a finger movement costs, on the one surface he plays on.
 *
 * WHAT IT MEASURES, AND WHY IT IS A COUNT AND NOT A STOPWATCH: FULL REDRAWS PER TOUCH MOVE.
 * Milliseconds are a property of the machine the gate happens to run on and would make this
 * flaky everywhere; a redraw COUNT is deterministic and travels. It is also the metric that
 * actually caught the sky P0 (2.1 redraws per touch move) and the metric that caught a fix
 * for it that made things WORSE (41 for 12). Wall-clock ms is reported as information, and
 * nothing is asserted on it.
 *
 * WHAT IT FOUND THE FIRST TIME IT RAN, which is the whole argument for building gauges:
 *
 *     pinch-zoom WHILE WALKING : 2.08 full redraws per touch move, ~23 ms each
 *
 * That is roughly 49 ms of painting per finger movement, THREE FRAMES at 60 Hz, during the
 * most common gesture in the game, on the surface he walks. Same shape as the sky P0 he
 * reported on 8/13, and MORE expensive, because the walked view costs more to draw than the
 * sky. Nobody knew, because nothing was counting.
 *
 * WHY TWO: setHZoom() ends in render(), which runs once per POINTER EVENT, and a two-finger
 * pinch dispatches TWO pointermove events per visual step. Nothing is wrong with setHZoom;
 * the arithmetic of two fingers is what makes it expensive.
 *
 * IT IS A RATCHET, DELIBERATELY SET AT TODAY'S MEASURED TRUTH RATHER THAN AT A WISH. The
 * budget below is what the build does NOW. It may only ever come down. A gate that went red
 * on a known number would be switched off by the next session that hit it; a gate pinned at
 * the truth catches the day somebody makes it worse, which has already happened once today.
 *
 * THE FIX TOOK TWO ATTEMPTS AND THE FIRST ONE IS WHY THE SECOND WORKED. Attempt one wrapped
 * the page from OUTSIDE: a capture-phase listener swapping window.render for a queueing stub.
 * Measured, it made things WORSE (3.08 per move), and instrumenting it was flat -- the
 * listener fired 24 times, muted 24 times, and ITS STUB WAS CALLED ZERO TIMES. The page's
 * internal render() calls do not resolve through window.render, so no paint can be
 * intercepted from outside. Attempt two put one helper INSIDE the page's own scope and
 * changed ONE call site: 2.08 -> 1.08 redraws per touch move, nearly halved.
 *
 * A PERF RATCHET INVITES EXACTLY ONE KIND OF CHEATING: winning the number by painting less
 * than the game needs. So the budget is not asserted alone -- the zoom must still land on a
 * pixel-true stop and pinching out must still cross the seam into the city builder, both on
 * the same real gesture.
 *
 * IT CATCHES BOTH DIRECTIONS, and getting there corrected a mistake worth recording.
 *   TOO EXPENSIVE : revert either coalescer and it bites, naming the number (2.08, or 4.00).
 *   NOT PAINTING  : make renderSoon() draw nothing and it bites too -- the per-view "the
 *                   gauge saw real work" floor drops to zero and the frozen-canvas check
 *                   fires. Both mutation-confirmed.
 *
 * AN EARLIER REVISION OF THIS HEADER DECLARED THE SECOND CASE UNDETECTABLE AND GAVE A REASON
 * THAT WAS SIMPLY FALSE: that a canvas fingerprint always passes "because the day loop
 * repaints anyway". MEASURED AFTERWARDS: this page renders ZERO times in two idle seconds.
 * There is no ambient loop. The real story is duller and more useful -- when that claim was
 * written the gate only measured the view the page opens in, so a cheat in the CITY view had
 * nothing looking at it. Extending the gauge to the second view is what gave it the floor
 * that catches the cheat; no clever assertion was needed, only coverage.
 * THE LESSON IS THE ONE THAT KEEPS REPEATING TODAY: I wrote down a limitation I had inferred
 * instead of measured, and it was wrong in the direction that makes a gate look weaker than
 * it is. Inferring a checker's blind spot is the same error as inferring its coverage.
 *
 *   node gates/frame_budget_gate.js
 */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

const PAGE = 'slices/BOHEMIA_CITY_WORLD.html';
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

/* THE RATCHET: measured on this build, 8/15. LOWER IS THE ONLY LEGAL DIRECTION. */
const BUDGET = {
  humanPinch: 1.2,  // measured 1.08 after the coalescer. Was 2.2 (2.08 measured) before it.
  cityPinch:  1.2,  // measured 1.00 after. WAS 4.00 -- the worst number found anywhere.
  cityPan:    1.2   // measured 1.00, and it was ALWAYS 1.00. Pinned so it stays that way.
};

function requirePlaywright() {
  const globals = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules'];
  for (const g of globals) { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

(async () => {
  let browser;
  try {
    const { chromium } = requirePlaywright();
    browser = await chromium.launch();
    /* HIS DEVICE. A perf number taken on a desktop viewport is a number about a machine
       nobody plays on. */
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                           hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    await p.goto('file://' + path.join(ROOT, PAGE));
    await p.waitForTimeout(3000);
    await p.evaluate(() => { try { cardHide(); } catch (e) {} });
    const cdp = await ctx.newCDPSession(p);
    const touch = (t, tp) => cdp.send('Input.dispatchTouchEvent', { type: t, touchPoints: tp });

    await p.evaluate(() => {
      window.__r = 0; window.__ms = 0;
      const o = window.render;
      window.render = function () {
        const t = performance.now(); window.__r++;
        const v = o.apply(this, arguments);
        window.__ms += performance.now() - t; return v;
      };
    });

    /* THE PAGE OPENS IN WALKING MODE, which is worth asserting: the first gauge written for
       this assumed the city view and measured a pan that never happened (0 renders, a
       silent pass). A perf number taken on a surface the gesture does not reach is worse
       than no number, because it looks like coverage. */
    ok('the walked page opens in HUMAN mode, so this is measuring the view he actually ' +
       'starts in', await p.evaluate(() => MODE) === 'human');

    const MOVES = 12;
    await p.evaluate(() => { window.__r0 = window.__r; window.__ms0 = window.__ms; });
    await touch('touchStart', [{ x: 150, y: 400, id: 1 }, { x: 250, y: 400, id: 2 }]);
    for (let i = 1; i <= MOVES; i++) {
      await touch('touchMove', [{ x: 150 - i * 5, y: 400, id: 1 },
                                { x: 250 + i * 5, y: 400, id: 2 }]);
    }
    await touch('touchEnd', []);
    await p.waitForTimeout(250);

    const m = await p.evaluate(([n]) => {
      const r = window.__r - window.__r0;
      return { renders: r, per: +(r / n).toFixed(2),
               msPerRender: r ? +((window.__ms - window.__ms0) / r).toFixed(1) : 0 };
    }, [MOVES]);

    ok('the gauge actually saw the gesture -- a perf assertion over zero work is a silent ' +
       'pass, and that is how the first draft of this file lied to me', m.renders > 0);
    console.log('  MEASURED: pinch-zoom while walking = ' + m.per + ' full redraws per touch ' +
                'move, ~' + m.msPerRender + ' ms each (ms is information, never asserted)');
    ok('PINCH-ZOOM WHILE WALKING STAYS WITHIN ITS MEASURED BUDGET (' + m.per + ' <= ' +
       BUDGET.humanPinch + ' redraws per touch move). THE RATCHET ONLY EVER COMES DOWN -- ' +
       'the day somebody makes this worse, this line is how it is found',
       m.per <= BUDGET.humanPinch);

    /* CORRECTNESS ON THE SAME GESTURE, so the budget above can never be won by painting
       less than the game needs. */
    {
      await p.evaluate(() => { try { cardHide(); } catch (e) {} });
      const start = await p.evaluate(() => ({ mode: MODE, z: HZOOM }));
      await touch('touchStart', [{ x: 170, y: 400, id: 1 }, { x: 230, y: 400, id: 2 }]);
      for (let i = 1; i <= 14; i++) {
        await touch('touchMove', [{ x: 170 - i * 8, y: 400, id: 1 },
                                  { x: 230 + i * 8, y: 400, id: 2 }]);
      }
      await touch('touchEnd', []);
      await p.waitForTimeout(250);
      const zin = await p.evaluate(() => ({ z: HZOOM, onStop: HLEVELS.indexOf(HZOOM) >= 0 }));
      ok('the zoom still LANDS ON A PIXEL-TRUE STOP after coalescing the paint (' + start.z +
         ' -> ' + zin.z + ') -- fewer redraws must never mean a softer zoom', zin.onStop);

      let crossed = false;
      for (let pass = 0; pass < 6 && !crossed; pass++) {
        await touch('touchStart', [{ x: 100, y: 400, id: 1 }, { x: 300, y: 400, id: 2 }]);
        for (let i = 1; i <= 14; i++) {
          await touch('touchMove', [{ x: 100 + i * 7, y: 400, id: 1 },
                                    { x: 300 - i * 7, y: 400, id: 2 }]);
        }
        await touch('touchEnd', []);
        await p.waitForTimeout(150);
        crossed = await p.evaluate(() => MODE === 'city');
      }
      ok('and pinching out still CROSSES THE SEAM into the city builder, which is his 8/2 ' +
         'ruling and the thing a paint-throttle could most easily break', crossed);

      /* AND THE SCREEN MUST ACTUALLY CHANGE. The two assertions above read STATE, and a
         mutation proved that is not enough: throttling every paint away leaves HZOOM
         landing on its stop and the seam crossing perfectly while the canvas sits FROZEN.
         Both checks stayed green on a build that painted nothing. So the last word belongs
         to the pixels -- fingerprint the canvas before and after a real gesture and demand
         it moved. A perf budget with no pixel check is an invitation to win it by drawing
         nothing at all. */
      const shot = () => p.evaluate(() => {
        const c = document.querySelector('canvas');
        const g = c.getContext('2d');
        const d = g.getImageData(0, 0, Math.min(c.width, 160), Math.min(c.height, 160)).data;
        let h = 0;
        for (let i = 0; i < d.length; i += 97) { h = (h * 31 + d[i]) >>> 0; }
        return h;
      });
      await p.evaluate(() => { if (MODE !== 'human' && typeof swapMode === 'function') swapMode(); });
      await p.waitForTimeout(600);
      const before = await shot();
      await touch('touchStart', [{ x: 170, y: 400, id: 1 }, { x: 230, y: 400, id: 2 }]);
      for (let i = 1; i <= 14; i++) {
        await touch('touchMove', [{ x: 170 - i * 8, y: 400, id: 1 },
                                  { x: 230 + i * 8, y: 400, id: 2 }]);
      }
      await touch('touchEnd', []);
      await p.waitForTimeout(400);
      const after = await shot();
      ok('the canvas is not frozen -- it still repaints across a gesture', before !== after);
    }

    /* THE CITY BUILDER IS THE OTHER HALF OF THE GAME AND WAS UNMEASURED UNTIL NOW.
       The first version of this gauge only ever saw the walked view, because the page opens
       in human mode -- so the view he BUILDS in, the "shining jewel", had no number at all.
       When one was finally taken it was the worst in the game: FOUR full redraws per touch
       move, ~86 ms per finger movement, five frames at 60 Hz. Its pinch branch called
       setZoomAt() AND the pan branch and each ended in render(), which is exactly what the
       8/13 P0 diagnosis said about the sky -- the same bug, in a second place, found only
       because somebody finally counted. A GAUGE THAT ONLY LOOKS WHERE THE APP HAPPENS TO
       OPEN IS HALF A GAUGE. */
    await p.evaluate(() => { if (MODE !== 'city' && typeof swapMode === 'function') swapMode(); });
    await p.waitForTimeout(1200);
    ok('the gauge reaches the CITY BUILDER too, not just the view the page opens in',
       await p.evaluate(() => MODE) === 'city');

    const measure = async (label, fingers) => {
      await p.evaluate(() => { window.__r0 = window.__r; window.__ms0 = window.__ms; });
      const pts = (i) => fingers === 2
        ? [{ x: 150 - i * 5, y: 400, id: 1 }, { x: 250 + i * 5, y: 400, id: 2 }]
        : [{ x: 200 + i * 8, y: 400 + i * 4, id: 1 }];
      await touch('touchStart', pts(0));
      for (let i = 1; i <= MOVES; i++) await touch('touchMove', pts(i));
      await touch('touchEnd', []);
      await p.waitForTimeout(250);
      const r = await p.evaluate(([n]) => {
        const c = window.__r - window.__r0;
        return { per: +(c / n).toFixed(2), renders: c,
                 ms: c ? +((window.__ms - window.__ms0) / c).toFixed(1) : 0 };
      }, [MOVES]);
      console.log('  MEASURED: ' + label + ' = ' + r.per + ' redraws per touch move, ~' +
                  r.ms + ' ms each');
      return r;
    };

    const cityPan = await measure('city one-finger pan', 1);
    ok('the city pan gauge saw real work', cityPan.renders > 0);
    ok('CITY PAN stays at one redraw per touch move (' + cityPan.per + ' <= ' +
       BUDGET.cityPan + ') -- it was always correct and this pins it there, because the ' +
       'easiest way to break a thing is to "optimise" past it', cityPan.per <= BUDGET.cityPan);

    const cityPinch = await measure('city pinch-zoom', 2);
    ok('the city pinch gauge saw real work', cityPinch.renders > 0);
    ok('CITY PINCH-ZOOM STAYS WITHIN BUDGET (' + cityPinch.per + ' <= ' + BUDGET.cityPinch +
       '). IT WAS 4.00 -- ~86 ms per finger movement, five frames, in the view he BUILDS ' +
       'in -- and nobody knew because nothing was counting', cityPinch.per <= BUDGET.cityPinch);

    /* *** THE MOST COMMON ACTION IN THE GAME, AND IT NEEDED A DIFFERENT RULER. ***
       Everything above measures REDRAWS PER TOUCH MOVE, which is the right metric for a
       GESTURE: a pinch should not repaint twice for one movement of the fingers.
       A STEP IS NOT A GESTURE, IT IS AN ANIMATION. Measured cold, a single step costs 7.7
       redraws -- and by the gesture ruler that reads like a catastrophic 7x regression in
       the thing the player does every single turn. IT IS NOTHING OF THE KIND. A step
       animates the body between tiles, so it SHOULD repaint many times; the histogram says
       79 frames rendered once and 2 rendered twice, which is a healthy 60fps animation.
       IF I HAD TRUSTED THE GESTURE METRIC HERE I WOULD HAVE "OPTIMISED" THE WALK ANIMATION
       OUT OF THE GAME and the gate would have called it a win.
       SO ANIMATIONS ARE MEASURED PER FRAME, NOT PER INPUT: the only defect available to an
       animation is painting the SAME frame twice, and that is what this asserts. Choosing
       the wrong ruler does not just mis-measure, it points the fix at the wrong thing. */
    await p.evaluate(() => {
      if (MODE !== 'human' && typeof swapMode === 'function') swapMode();
    });
    await p.waitForTimeout(1400);
    await p.evaluate(() => {
      window.__f = 0; window.__inFrame = 0; window.__dupes = 0; window.__paints = 0;
      const raf = window.requestAnimationFrame;
      (function tick() {
        window.__f++;
        if (window.__inFrame > 1) window.__dupes++;
        window.__inFrame = 0;
        raf.call(window, tick);
      })();
      const o = window.render;
      window.render = function () { window.__inFrame++; window.__paints++; return o.apply(this, arguments); };
    });
    for (let i = 0; i < 10; i++) {
      await p.evaluate(() => {
        const el = document.querySelector('#pad .pb');
        if (el) el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      });
      await p.waitForTimeout(140);
    }
    const walk = await p.evaluate(() => ({ frames: window.__f, paints: window.__paints,
                                           dupes: window.__dupes }));
    ok('the walk gauge saw real work (' + walk.paints + ' paints over ' + walk.frames +
       ' frames)', walk.paints > 0 && walk.frames > 0);
    console.log('  MEASURED: walking = ' + walk.paints + ' paints across ' + walk.frames +
                ' frames, ' + walk.dupes + ' frames painted twice');
    ok('WALKING PAINTS ONCE PER FRAME -- an animation is allowed to repaint often, it is ' +
       'not allowed to paint the SAME frame twice (' + walk.dupes + ' doubled of ' +
       walk.frames + ', under 10%)',
       walk.dupes <= Math.max(3, walk.frames * 0.10));

    /* *** THE BIGGEST WIN OF THE WEEK, AND THE PROFILER FOUND IT, NOT READING. ***
       Walking cost ~14 ms per frame. I had written in a commit that this was "renderer
       cost, a much larger job than duplication" -- I INFERRED THAT AND IT WAS WRONG.
       Sampled, the drawing was 0.2% and SIXTY-ONE PERCENT was in two functions: seenFrom
       (42.7%) and fallbackHome (18.6%).
       WHY: vistaCheck() runs on the beat and asks "am I standing on the best overlook
       yet?". Its own comment calls it "a cell test", and comparing two cells IS cheap --
       but FETCHING the cell scans all 9,216 map cells and casts 24 rays x 46 steps from
       every rim cell. A CHEAP-LOOKING CHECK WITH AN ENORMOUSLY EXPENSIVE INPUT, which is
       the worst kind, because nothing at the call site looks wrong.
       The answer is derived from the MAP and the map does not move while he walks, so it
       is memoised on the seed. 14.7 ms -> 0.6 ms per frame, measured.
       ASSERTED AS A COUNT, not a time: the overlook must be computed ONCE across many
       steps. A count is deterministic and travels; the milliseconds are just the reward. */
    await p.evaluate(() => {
      window.__ov = 0;
      const o = BohemiaVista.overlook;
      BohemiaVista.overlook = function () { window.__ov++; return o.apply(this, arguments); };
      if (MODE !== 'human' && typeof swapMode === 'function') swapMode();
    });
    await p.waitForTimeout(1200);
    for (let i = 0; i < 8; i++) {
      await p.evaluate(() => {
        const el = document.querySelector('#pad .pb');
        if (el) el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      });
      await p.waitForTimeout(120);
    }
    /* AND THE COUNT IS TAKEN FROM vistaWhere() DIRECTLY, not from walking, because
       vistaCheck() short-circuits once the vista has been seen -- so counting during steps
       reported ZERO with the memo AND ZERO without it. A SILENT PASS OVER NO WORK, which
       is the same trap the first city-pan assertion fell into earlier in this file. Ask the
       function the question instead of hoping the game asks it for you. */
    /* AND THE MEMO IS RESET BEFORE COUNTING. Without that the cache is already warm from
       page load, so the count is 0 WITH the memo and 0 WITHOUT it -- a silent pass over no
       work, twice over, and the mutation test is what exposed it. A cache test that never
       makes the cache miss is not a test. */
    const ov = await p.evaluate(() => {
      let n = 0;
      const o = BohemiaVista.overlook;
      BohemiaVista.overlook = function () { n++; return o.apply(this, arguments); };
      try { VISTA_MEMO = null; VISTA_MEMO_SEED = null; } catch (e) {}
      for (let i = 0; i < 12; i++) vistaWhere();
      BohemiaVista.overlook = o;
      return n;
    });
    console.log('  MEASURED: full-map overlook scans for 12 vistaWhere() calls = ' + ov);
    ok('THE VISTA OVERLOOK IS COMPUTED ONCE, NOT EVERY TIME IT IS ASKED (' + ov + ' scans ' +
       'for 12 calls). It was 61% of frame time while walking -- a 9,216-cell raycast with ' +
       '24-ray casts per rim cell, behind a line that reads like a cell comparison',
       ov <= 1);
    ok('and the memo still tells the TRUTH: it matches the uncached engine answer, so the ' +
       'cache is not a lie',
       await p.evaluate(() => JSON.stringify(vistaWhere()) ===
                              JSON.stringify(BohemiaVista.overlook(WORLDREF || om))));

    ok('and nothing throws while it is measured',
       errs.length === 0 || (console.log('  (errors: ' + errs.slice(0, 2).join(' | ') + ')'), false));
  } catch (e) {
    fail++;
    console.log('  FAIL: the gauge could not drive the real page -- ' + e.message);
  } finally {
    if (browser) await browser.close();
  }

  console.log('FRAME BUDGET GATE: ' + pass + ' passed, ' + fail + ' failed  (the first perf ' +
              'gauge in the repo: redraws per touch move on his device, ratcheted at the ' +
              'measured truth, counting rather than timing so it travels)');
  process.exit(fail ? 1 : 0);
})();
