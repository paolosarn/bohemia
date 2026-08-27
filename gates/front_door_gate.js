/* ============================================================================
   FRONT DOOR GATE (8/20/26) — A FRIEND TAPS THE LINK AND LANDS ON THE GAME.

   Law: laws/BOHEMIA_ADDENDUM_THE_FRONT_DOOR_IS_MEASURED_8_20_26.md

   WHY. Demo board ROW 7, "the cheapest big win on the board": a new player used
   to land on the CHARACTER wardrobe workbench and had to find RUN among sixteen
   tabs to reach the game. That was fixed -- the splash tap now taps the real RUN
   tab, which is the only path that also builds the city iframe, sends the player,
   sends the cast, restores the save and pushes prefabs.

   AND NOTHING CHECKED IT. `window.__OPENED_ON_THE_GAME` is set by the alpha and
   read by no gate in the repo. A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and
   this is the single most important interaction in the product: it is what
   happens to every person who is ever handed the link.

   THE BOARD READ THE SOURCE AND GOT THE OPPOSITE ANSWER. Re-audited 8/20, it
   still lists ROW 7 as OPEN and "five days flagged, unmoved", citing the static
   markup `<div class="tab on" data-p="char">` at ALPHA:1012. That markup IS
   still char -- and the runtime overrides it on the splash tap, which is the
   only gesture a player can make. VERIFY ON THE REAL SURFACE (7/18): a
   source-read is not a measurement, and here the two disagree completely.

   So this taps the splash like a friend does, and looks at what is on screen.

   node gates/front_door_gate.js
   ============================================================================ */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const path = require('path');

const ROOT = path.dirname(__dirname);
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const VIEW = { width: 390, height: 844 };

let pass = 0, fail = 0;
function ok(claim, cond, detail) {
  if (cond) { pass++; console.log('  ok  ' + claim); }
  else { fail++; console.log('  FAIL ' + claim + (detail ? '\n       ' + detail : '')); }
}
function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

(async function main() {
  console.log('FRONT DOOR GATE — a friend taps the link and lands on the game\n');

  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEW });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));

  try {
    await page.goto('file://' + ALPHA);
    await SETTLE(page, 6000);

    const front = await page.evaluate(() => {
      const f = document.getElementById('front');
      return { up: !!f && getComputedStyle(f).display !== 'none',
               tabs: [...document.querySelectorAll('.tab')].map(t => t.dataset.p) };
    });

    ok('A1 the splash is the first and only thing there is to tap — a front door '
      + 'with nothing to press is not a door',
      front.up === true);

    ok('A2 the RUN tab exists in the bar. A MISSING TAB IS LOUD: this fleet has '
      + 'written `if(t)t.click()` eight times, and a renamed tab becomes a game '
      + 'that quietly does not open',
      front.tabs.includes('run'), JSON.stringify(front.tabs));

    /* THE ONLY GESTURE A PLAYER CAN MAKE. */
    await page.locator('#front').click();
    await SETTLE(page, 9000);

    const after = await page.evaluate(() => ({
      tab: (document.querySelector('.tab.on') || {}).dataset
             ? document.querySelector('.tab.on').dataset.p : null,
      tabText: (document.querySelector('.tab.on') || {}).textContent || null,
      panel: (document.querySelector('.panel.on') || {}).id || null,
      cityFrame: !!document.getElementById('cityFrame'),
      opened: window.__OPENED_ON_THE_GAME || 0,
      runTabMissing: !!window.__RUN_TAB_MISSING,
      appUp: getComputedStyle(document.getElementById('app')).display !== 'none'
    }));

    ok('A3 ONE TAP AND HE IS ON THE GAME, not on a dev tool. The board still '
      + 'lists this as the open #1 blocker off a source-read of the static '
      + 'markup; the runtime is the answer and this is it',
      after.tab === 'run' && after.opened >= 1 && after.runTabMissing === false,
      JSON.stringify(after));

    ok('A4 …and the panel under it is the CITY — the walked surface. Paolo 7/28, '
      + '"can you put the city in the run tab": the RUN tab routes to p-city, so '
      + 'the tab lighting up is not enough on its own',
      after.panel === 'p-city', 'panel: ' + after.panel);

    ok('A5 …and the city iframe was actually BUILT. It is created lazily inside '
      + 'that click handler, so a markup default would have shown an empty panel '
      + 'and skipped the player, the cast, the save and the prefabs',
      after.cityFrame === true);

    /* AND SOMETHING IS ACTUALLY ON SCREEN. A panel that is `on` and blank is the
       same lie one level down -- the display:none-parent trap the alpha's own
       comments describe, where every DOM check passes and the box is 0x0. */
    const shown = await page.evaluate(() => {
      const f = document.getElementById('cityFrame');
      if (!f) return null;
      const r = f.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    });
    ok('A6 …and it has a real box on the phone, not 0x0 inside a hidden parent. '
      + 'Every DOM check passes on a 0x0 canvas; only the size says otherwise',
      shown && shown.w > 200 && shown.h > 300, JSON.stringify(shown));

    const text = await page.evaluate(() => document.body.innerText.slice(0, 400));
    ok('A7 …and the first day is actually offered — the game says something to '
      + 'him rather than presenting an empty world',
      /DAY 1|GET UP|WATCH/i.test(text), JSON.stringify(text.slice(0, 160)));

    ok('A8 the door threw no errors opening', errors.length === 0,
      errors.slice(0, 3).join(' | '));

    /* A9 *** THE SPLASH SAYS ONLY WHAT IT IS SUPPOSED TO SAY. ***
       Found live on main 8/27: a lane's bad conflict resolution left a
       `>>>>>>>` marker in the alpha AND ate the opening `<!--` of the comment
       right after the build stamp, so the marker plus seven lines of internal
       prose about a 8/2 incident were RENDERING ON THE FRONT SPLASH. First
       thing anybody sees on the one link he pastes to people.
       EVERY OTHER LEG IN THIS GATE WAS GREEN THROUGH IT, because they all ask
       whether the door OPENS and this is about what the door SAYS. alpha_loads
       caught the marker; nothing caught the seven lines of prose behind it.
       So: read the splash the way a human reads it, and hold it to the few
       words it is meant to carry. */
    const splash = await page.evaluate(() => {
      const f = document.getElementById('front');
      return f ? f.innerText.replace(/\s+/g, ' ').trim() : '';
    });
    const LEAK = /<!--|-->|<<<<<<<|>>>>>>>|=======|function |var |px;|style=/;
    ok('A9 the splash carries no merge marker and no leaked source',
      !LEAK.test(splash), JSON.stringify(splash.slice(0, 140)));
    ok('A9b …and it is SHORT, because it is a door and not a document (' +
      splash.length + ' chars)', splash.length > 0 && splash.length < 220,
      JSON.stringify(splash.slice(0, 140)));
  } finally { await browser.close(); }

  console.log('\nFRONT DOOR GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('FRONT DOOR GATE CRASHED: ' + (e && e.stack || e)); process.exit(1); });
