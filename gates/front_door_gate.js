/* BOHEMIA — THE PLAY LINK OPENS THE GAME (8/2/26, FLEET-WIDE).

   THE ONE-LINK LAW (Paolo 7/18, LOCKED) says there is exactly one URL and it
   never changes. Everything the fleet ships arrives through that one door:

       https://paolosarn.github.io/bohemia/slices/BOHEMIA_ALPHA_0_9.html

   Nothing gated the door itself.

   WHAT HAPPENED ON 8/2. One commit's edit to the build-stamp line dropped a
   single `</div>` — the one that CLOSES the front splash. `<div id="app">` then
   parsed as a CHILD of `<div id="front">`. The splash handler does exactly what
   it always did:

       front.style.display = 'none';  app.style.display = 'flex';

   but a child of a display:none parent is not rendered no matter what its own
   display says. So tapping the splash hid the splash AND THE ENTIRE GAME.
   Measured on the real surface: #app at 0x0, zero client rects, no tabs. Paolo
   taps the link, taps the screen, and gets a black rectangle.

   IT WAS CAUGHT — run_gate went red — but only as a 30-second Playwright
   timeout reading "element is not visible", which names a symptom three screens
   deep in a 126-claim browser test and says nothing about a missing tag. This
   gate is the smoke alarm at the front door: it states the structural fact in
   one line, and then proves the door on the real surface in about two seconds.

   READS ONLY. Cooks nothing, owns no lane's content, touches no system.

   Run: node gates/front_door_gate.js
   Registered in gates/bohemia_gates.py as FRONT DOOR. */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
let pass = 0; const fail = [];
const ok = (n, c) => { c ? pass++ : (fail.push(n), console.log('  FAIL: ' + n)); };

function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

/* THE STATIC HALF. Cheap, instant, and it names the exact cause. The splash
   must CLOSE before the app opens — measured as raw text order, because that is
   the thing an editing mistake actually breaks. */
/* Returns null if the splash closes before the app opens, else why not. Pure,
   so the self-test below can run it on a deliberately broken copy without
   touching this gate's own counters. */
function splashClosure(src) {
  /* COMMENTS ARE NOT STRUCTURE. Strip them before counting anything: on 8/2 the
     fix for this very bug added a comment EXPLAINING the missing tag, the words
     inside it got counted as tags, and this checker went red on prose while the
     document was perfectly well formed. That is the same mistake as a gate that
     cannot tell a mention from a use, made by the gate that exists to catch a
     structural break. A checker must read structure, never text that happens to
     look like structure. */
  const clean = src.replace(/<!--[\s\S]*?-->/g, '');
  const f = clean.indexOf('<div id="front">');
  const a = clean.indexOf('<div id="app">');
  if (f < 0 || a < f) return 'the splash and the app are not both in the file';
  const between = clean.slice(f, a);
  const opens = (between.match(/<div\b/g) || []).length;
  const closes = (between.match(/<\/div>/g) || []).length;
  return opens === closes ? null
    : opens + ' <div> open vs ' + closes + ' </div> close between them';
}

function structure(src) {
  ok('S1 the front splash and the app are both in the file',
    src.indexOf('<div id="front">') > 0 &&
    src.indexOf('<div id="app">') > src.indexOf('<div id="front">'));
  const why = splashClosure(src);
  ok('S2 THE SPLASH CLOSES BEFORE THE APP OPENS' + (why ? ' — ' + why : '') +
     '. One missing </div> here nests the whole game inside the splash, and ' +
     'tapping the splash then hides everything', why === null);
}

/* THE REAL-SURFACE HALF. Paolo's law: art and behaviour are verified only on the
   surface he touches. A static tag count is a proxy; this is the thing itself. */
async function realDoor() {
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const errs = [];
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on('pageerror', e => errs.push(e.message.slice(0, 120)));
    await page.goto('file://' + ALPHA);
    await page.waitForSelector('#front', { timeout: 30000 });

    const parent = await page.evaluate(() => {
      const a = document.getElementById('app');
      return a && a.parentElement ? (a.parentElement.id || a.parentElement.tagName) : null;
    });
    ok('R1 the app is NOT inside the splash (parent = ' + parent + ')',
      parent !== 'front');

    await page.click('#front');
    await page.waitForTimeout(1200);
    const after = await page.evaluate(() => {
      const a = document.getElementById('app');
      const r = a ? a.getBoundingClientRect() : null;
      const tabs = [...document.querySelectorAll('.tab')].filter(t => t.getClientRects().length);
      return { w: r ? Math.round(r.width) : 0, h: r ? Math.round(r.height) : 0,
               tabs: tabs.length, labels: tabs.map(t => t.textContent.trim()).slice(0, 12) };
    });
    ok('R2 TAPPING THE SPLASH OPENS THE GAME, not a black screen (' +
      after.w + 'x' + after.h + ')', after.w > 100 && after.h > 100);
    ok('R3 the tabs he navigates by are on screen (' + after.tabs + ': ' +
      after.labels.join(' ') + ')', after.tabs >= 3);
    ok('R4 nothing threw walking through the front door' +
      (errs.length ? ': ' + errs[0] : ''), errs.length === 0);
  } finally { await browser.close(); }
}

(async () => {
  console.log('FRONT DOOR GATE — the one link opens the game');
  const src = fs.readFileSync(ALPHA, 'utf8');
  structure(src);

  /* SELF-TEST: prove the static check SEES the break, rather than proving the
     file happens to be well-formed today. This is the EXACT 8/2 break — delete
     the one closing tag that ends the splash — applied to a copy in memory.
     It has to survive the tag moving onto its own line, which is the change
     that stops the break happening in the first place, so it deletes the LAST
     closer before the app opens rather than matching one hard-coded string. */
  const cut = src.lastIndexOf('</div>', src.indexOf('<div id="app">'));
  const broken = cut < 0 ? src : src.slice(0, cut) + src.slice(cut + 6);
  ok('S3 SELF-TEST: the probe really is the 8/2 break (the copy differs)',
    broken !== src && cut > src.indexOf('<div id="front">'));
  ok('S4 SELF-TEST: and the checker catches it', splashClosure(broken) !== null);

  await realDoor();
  console.log((fail.length ? 'FAILED' : 'OK') + ': ' + pass + ' passed, ' +
    fail.length + ' failed');
  process.exit(fail.length ? 1 : 0);
})();
