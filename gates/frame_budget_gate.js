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
 * AND THE FIX IS NOT IN YET, ON PURPOSE. One was attempted and REVERTED the same hour: a
 * capture-phase coalescer that muted render during the gesture and painted once per frame.
 * Measured, it made things worse (3.08 per move), and instrumenting it showed why -- the
 * listener fired 24 times and muted 24 times, but ITS STUB WAS NEVER CALLED ONCE. The page's
 * internal render() calls do not resolve through window.render, so the interception cannot
 * work from outside. That is written down here so the next attempt starts from the finding
 * instead of rediscovering it: the coalescing has to live INSIDE the page's own render path,
 * not wrapped around it.
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
  humanPinch: 2.2   // measured 2.08. The headroom is noise, not permission.
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
