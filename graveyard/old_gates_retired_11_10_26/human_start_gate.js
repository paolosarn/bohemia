/* BOHEMIA — THE RUN TAB OPENS IN HUMAN MODE, WHERE YOU LIVE (8/2/26).

   Paolo: "can you just make sure when I press the run tab it just starts me off
   where I should start off exactly where I should and not in city mode. I'd
   rather start off in human mode rather than city mode, please"

   WHAT HE WAS SEEING, measured before anything was touched:
       visible panel : p-city
       MODE          : "city"        the HUD read CITY MODE
       player        : hx=0, hy=0    never placed at all
   Tapping RUN dropped him into the zoomed-out city builder, with the walked
   player sitting at the origin of a 12288x12288 world.

   AND THE THING THAT UNDID THE FIRST FIX. Opening in human mode was not enough:
   the frame came up human and flipped straight back. Logging every message the
   frame receives gave ["BOHEMIA_CITY_PLAYER", "BOHEMIA_CITY_PLAYER",
   "BOHEMIA_GOTO_CELL"], and GOTO_CELL's handler ended in an unconditional
   MODE='city'. That line was right when it was written - Paolo 7/28, "I want
   that reflected when I'm in the city menu", back when RUN and CITY were two
   tabs - and the alpha fires it on city-tab open, so now that THE RUN TAB IS
   THE CITY FRAME it fired every time he tapped RUN. His ruling was about the
   marker, never the mode.

   THIS GATE DRIVES THE ALPHA, not the city file. That distinction is the whole
   reason this bug lived: every gate this lane owns opens
   BOHEMIA_RUN_CURRENT.html directly, and the alpha never shows that file, so
   they were all green about a surface he cannot reach. VERIFY ON THE REAL
   SURFACE (7/18) means the surface he taps.

   Run: node gates/human_start_gate.js
   Registered in gates/bohemia_gates.py as HUMAN START. */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const WORKING = path.join(ROOT, 'records/BOHEMIA_WORKING_DISTRICT.txt');
let pass = 0; const fail = [];
const ok = (n, c) => { c ? pass++ : (fail.push(n), console.log('  FAIL: ' + n)); };

function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

(async () => {
  console.log('HUMAN START GATE — the RUN tab opens in your body, in the suburb');
  const want = fs.readFileSync(WORKING, 'utf8').split('\n')[0].trim();
  ok('S1 the working district is recorded where a session can read it (' + want + ')',
    /^[a-z_]+$/.test(want));

  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const errs = [];
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on('pageerror', e => errs.push(e.message.slice(0, 120)));
    await page.goto('file://' + ALPHA);
    await page.waitForSelector('#front', { timeout: 40000 });
    await page.click('#front');
    await SETTLE(page, 1200);
    await page.click('.tab[data-p="run"]');

    /* WAIT LONG ENOUGH FOR THE MESSAGES THAT USED TO UNDO IT. The alpha posts
       the player sprite and GOTO_CELL after the frame boots; a check that ran
       before those landed would have passed on the broken build too. */
    await SETTLE(page, 20000);

    const fr = await page.$('#cityFrame');
    ok('R1 the RUN tab really shows the city frame (this is the surface he plays)',
      !!fr);
    if (!fr) return;
    const cf = await fr.contentFrame();
    const st = await cf.evaluate(() => {
      if (!window.__proof) return null;
      const p = window.__proof.getPos();
      const FN = window.__proof.FN;
      const t = window.__proof.om.at(Math.floor(p.hx / FN), Math.floor(p.hy / FN));
      return { mode: p.mode, hx: p.hx, hy: p.hy, district: t ? t.district : null,
               hud: (document.getElementById('hmode') || {}).textContent,
               slot: (document.getElementById('hslot') || {}).textContent };
    });
    ok('R2 the city frame booted and answers', !!st);
    if (!st) return;

    ok('R3 IT OPENS IN HUMAN MODE, not the city builder (HUD: ' + st.hud + ')',
      st.mode === 'human' && /HUMAN/.test(String(st.hud)));
    ok('R4 and the player is really placed, not at the origin of the world (' +
      st.hx + ',' + st.hy + ')', st.hx > 0 && st.hy > 0);
    ok('R5 HE IS STANDING IN THE DISTRICT WE ARE WORKING ON (' + st.district + ')',
      st.district === want);
    ok('R6 and the HUD says he is on his feet (' + st.slot + ')',
      /ON FOOT/.test(String(st.slot)));
    ok('R7 nothing threw opening the tab' + (errs.length ? ': ' + errs[0] : ''),
      errs.length === 0);

    /* R8: THE CITY VIEW IS NOT TAKEN AWAY FROM HIM. He asked to START in human
       mode, not to lose the city builder - and the zoom seam still has to reach
       it (ZOOM SEAM law, 8/2). Prove the swap still works from here. */
    /* *** THIS CLAIM WAS PINNED TO WHERE THE OFFER LIVED, NOT TO WHETHER IT IS
       OFFERED (fixed 8/26). *** It read #modeLbl and required the word CITY in it,
       which was true while the big round button in the pad WAS the city toggle.
       Paolo ruled on 8/26 that THE ACTION BUTTON DOES ACTIONS ("I HATE THAT THE
       ACTION BUTTON IS THE CITY BUTTON"), so that button now says the verb in
       front of him and the camera toggle moved to a chip beside WHOLE MAP. The
       LAW this claim exists for -- R8's own words, "THE CITY VIEW IS NOT TAKEN
       AWAY FROM HIM" -- is untouched and still true.
       FIX THE RULER, NEVER THE TARGET (8/1): it asks whether the city view is
       offered ANYWHERE a thumb can reach, which is what it always meant. */
    const swapped = await cf.evaluate(() => {
      const out = [];
      ['modeLbl', 'modechip'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el && el.offsetParent !== null) out.push(el.textContent || '');
      });
      return out.join(' | ');
    });
    ok('R9 the city view is one tap away, still offered (' + swapped + ')',
      /CITY|DROP IN/.test(String(swapped)));
  } finally { await browser.close(); }

  console.log((fail.length ? 'FAILED' : 'OK') + ': ' + pass + ' passed, ' +
    fail.length + ' failed');
  process.exit(fail.length ? 1 : 0);
})();
