/* BOHEMIA NO DEVELOPER TEXT ON THE SURFACE HE PLAYS (8/17/26, CHARACTER lane)
 *
 * Screenshotted the walked city the way a friend meets it -- boot, tap the splash,
 * land in the game -- and across the top, above the day card, sat
 *
 *     rig sync: waiting for a rig edit
 *
 * the CHARACTER lane's rig-rebuild indicator. Useful on the workbench, developer
 * language in the middle of the game.
 *
 * IT WAS NOT A TAB-SWITCHING BUG AND THAT IS THE LESSON. #syncBadge sits BETWEEN
 * THE TAB BAR AND #stage -- outside every panel. Panels swap; it never does. An
 * element in that band renders on all sixteen tabs including the one the game is
 * played on, so no amount of correct tab logic could hide it. Anything parked
 * there is on the play surface by construction.
 *
 * SO THIS GATE CHECKS THE BAND, NOT THE BADGE. Naming #syncBadge would let the
 * next one land in the same place with a different id, which is exactly how the
 * first one survived. It reads what is ACTUALLY VISIBLE after the splash and
 * fails on developer vocabulary, wherever it came from.
 *
 * The badge itself is not deleted and must not be: it still flashes its green
 * confirmation when a rig rebuild lands. It just says nothing at rest, and this
 * asserts that resting state on the real surface.
 *
 *   node gates/play_surface_clean_gate.js
 */
'use strict';
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');

/* Developer vocabulary. Deliberately about WORDS A PLAYER WOULD NEVER SEE in a
   shipped game, not about implementation nouns that could legitimately appear in
   fiction (a "rig" could be a truck; "sync" alone could be a quest word). Each
   entry is a phrase, so a quest line saying "the rig" cannot trip it. */
const DEV_PHRASES = [
  'rig sync', 'waiting for a rig edit', 'rebuilt', 'debug', 'TODO', 'FIXME',
  'undefined', 'NaN', '[object Object]', 'console', 'stack trace', 'localhost'
];

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(9000);

  const R = await page.evaluate(() => {
    const vis = el => {
      if (!el) return false;
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight;
    };
    /* what tab are we actually on */
    const tab = (document.querySelector('.tab.on') || {}).textContent || '';
    const panel = (document.querySelector('.panel.on') || {}).id || '';

    /* THE BAND: everything that is NOT inside #stage, i.e. chrome that survives
       every tab switch. That is where the offender lived. */
    const stage = document.getElementById('stage');
    const outside = [];
    document.querySelectorAll('body *').forEach(el => {
      if (stage && stage.contains(el)) return;
      if (el.children.length) return;                 /* leaves only, no wrappers */
      if (!vis(el)) return;
      const t = (el.textContent || '').trim();
      if (t) outside.push({ id: el.id || '', tag: el.tagName, text: t.slice(0, 120) });
    });

    const badge = document.getElementById('syncBadge');
    return {
      tab: tab.trim(), panel: panel,
      outside: outside,
      badgeExists: !!badge,
      badgeText: badge ? (badge.textContent || '').trim() : null
    };
  });

  if (errs.length) console.log('  PAGE ERRORS: ' + errs.slice(0, 3).join(' | '));

  console.log('  after the splash: tab=' + R.tab + '  panel=' + R.panel);
  console.log('  persistent chrome carrying text: ' +
    (R.outside.length ? R.outside.map(o => (o.id || o.tag) + '="' + o.text + '"').join('  |  ') : '(none)'));

  ok('the splash really lands on the GAME, not the character workbench — if it did ' +
     'not, this gate would be inspecting the wrong screen and passing for free',
     /RUN/i.test(R.tab) || /city|run/i.test(R.panel));

  /* THE RULE, checked on what is visible rather than on a known element id */
  const offenders = [];
  for (const o of R.outside)
    for (const p of DEV_PHRASES)
      if (o.text.toLowerCase().includes(p.toLowerCase()))
        offenders.push((o.id || o.tag) + ': "' + o.text + '" (matched "' + p + '")');

  ok('*** NO DEVELOPER TEXT IS VISIBLE ON THE PLAY SURFACE *** — checked across the ' +
     'persistent chrome OUTSIDE #stage, which is the band that renders on every tab ' +
     'and is therefore on the game by construction' +
     (offenders.length ? '\n         ' + offenders.join('\n         ') : ''),
     offenders.length === 0);

  ok('the rig-rebuild badge still EXISTS (it is not deleted — it still flashes when ' +
     'a rig edit re-bakes the sprites, it just says nothing at rest)', R.badgeExists);

  ok('and it is quiet at rest (badge text is empty, was "rig sync: waiting for a ' +
     'rig edit" on every tab including this one)', R.badgeText === '');

  console.log('PLAY SURFACE CLEAN GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
