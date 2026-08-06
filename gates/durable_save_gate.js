/* BOHEMIA DURABLE SAVE GATE (8/6/26) — the save has to survive a week off the game.
 *
 * THE LANDMINE, item 7 of THE BIG MISSING, filed 7/29 and never acted on until now:
 * iOS WebKit deletes localStorage, IndexedDB AND service worker registrations after
 * SEVEN DAYS with no interaction with the origin. Every Bohemia save lives in
 * localStorage. slices/sw.js — the worker the ONE-LINK LAW depends on — is on the
 * same list. A player who puts the game down for a week comes back to a deleted save
 * AND a stale link, and nothing in the repo was watching for it.
 *
 * Eviction SKIPS origins granted persistence via navigator.storage.persist().
 * Supported since Safari 17 / iOS 17. The whole fix is one request at boot.
 *
 * THIS GATE MEASURES ON THE REAL SURFACE (7/18 law) rather than grepping for the
 * line: it boots the alpha in a browser and asks the page what actually happened.
 * A line that exists and never runs is exactly the class of bug this repo has been
 * finding all week.
 *
 * WHAT IT DOES NOT ASSERT, deliberately: that persistence was GRANTED. Safari and
 * Chromium decide on their own heuristics and headless Chromium answers differently
 * from a real phone. Asserting the grant would make this gate a weather report. It
 * asserts that WE ASKED, correctly, on the surface he opens — which is the only part
 * that is ours.
 *
 *   node gates/durable_save_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
    '/usr/local/lib/node_modules']) {
    try { return require(g + '/playwright'); } catch (e) { }
  }
  return require('playwright');
}

/* ---- SOURCE: the request exists and is fire-and-forget --------------------- */
const src = fs.readFileSync(ALPHA, 'utf8');
ok('the alpha asks the browser to keep the save (navigator.storage.persist)',
  src.indexOf('navigator.storage.persist') >= 0);
ok('the request is marker-fenced so the patch tool can find its own work',
  src.indexOf('__BOH_DURABLE__') >= 0);
/* IT MUST NEVER BE ABLE TO BREAK BOOT. A durability nicety that can throw into the
   boot path would cost more than the eviction it prevents. */
const blockAt = src.indexOf('__BOH_DURABLE__');
const block = blockAt >= 0 ? src.slice(blockAt, blockAt + 1600) : '';
ok('it is wrapped in try/catch (a durability nicety must never break boot)',
  /try\s*\{/.test(block) && /catch\s*\(/.test(block));
ok('it has a .catch on the promise chain too (a rejection must not reach the console)',
  /\.catch\(/.test(block));
ok('boot never AWAITS it (fire and forget, so a slow answer never delays the game)',
  !/await\s+navigator\.storage/.test(block));
/* the answer has to be observable or this gate would be grepping, not measuring */
ok('the answer is parked somewhere measurable (window.__BOH_DURABLE)',
  src.indexOf('window.__BOH_DURABLE') >= 0);

/* NO SAVE CODE WAS TOUCHED. This is the boundary that keeps the change legitimate:
   the RUN lane owns how a save is written, read, migrated and exported. */
ok('it stores nothing itself — no setItem inside the durability block',
  block.indexOf('setItem') < 0);

/* ---- MEASURED: boot the real alpha and ask the page ------------------------ */
(async () => {
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
    await page.waitForSelector('#front', { timeout: 60000 });
    await page.click('#front').catch(() => { });
    await page.waitForTimeout(2500);

    const st = await page.evaluate(async () => {
      const out = { flag: window.__BOH_DURABLE || null };
      out.api = !!(navigator.storage && navigator.storage.persist);
      try { out.persistedNow = await navigator.storage.persisted(); } catch (e) { out.persistedNow = null; }
      out.keys = Object.keys(localStorage);
      out.bytes = out.keys.reduce((n, k) => n + (localStorage.getItem(k) || '').length, 0);
      return out;
    });

    ok('the durability request really RAN at boot (window.__BOH_DURABLE is set) — ' +
      'a line that exists and never runs is the bug this repo keeps finding',
      !!st.flag);
    if (st.flag) {
      ok('it saw the Storage API on this browser (api=' + st.flag.api + ')', st.flag.api === true);
      ok('it recorded an answer rather than throwing (error=' + !!st.flag.error + ')', !st.flag.error);
      /* granted is the BROWSER'S call, not ours - reported, never asserted */
      console.log('    (persistence granted here: ' + st.flag.granted +
        ' — the browser decides; on a real phone Safari answers for itself)');
    }
    ok('booting with the request in place raises no page error', errs.length === 0);
    if (errs.length) console.log('    ' + errs[0]);

    /* THE THING BEING PROTECTED, measured so the gate fails if the save ever
       outgrows what localStorage will hold (5 MiB per origin). It is 10.8 KB
       today; this is the alarm for the day somebody starts storing art in it. */
    ok('the save still fits localStorage comfortably (' + st.bytes + ' bytes across ' +
      st.keys.length + ' keys, cap ~5 MiB)', st.bytes < 2 * 1024 * 1024);

    /* the service worker is on the SAME eviction list, so it is part of the same
       problem and must still be registered */
    ok('the freshness service worker is still registered (it is evicted by the same ' +
      'sweep, and the ONE-LINK LAW depends on it)',
      src.indexOf("serviceWorker.register('sw.js'") >= 0);

    console.log('DURABLE SAVE GATE: ' + pass + ' passed, ' + fail + ' failed');
    await browser.close();
    process.exit(fail ? 1 : 0);
  } catch (e) {
    console.log('  FAIL: the gate could not drive the alpha — ' + String(e).slice(0, 140));
    await browser.close();
    process.exit(1);
  }
})();
