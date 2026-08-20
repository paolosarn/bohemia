/* ============================================================================
   CARD FOLD GATE (8/18/26, FACTIONS lane) — THE PERSON CARD HAS TO FIT ON THE
   PHONE, AND NOTHING IS LOST FOLDING IT.

   Law:  laws/BOHEMIA_ADDENDUM_THE_CARD_HAS_TO_FIT_8_18_26.md
   Tool: tools/bohemia_city_cardfold_patch.py

   WHY. Five systems write rows onto the person card (the name, the bargain, the
   wall, the claim, the favour). Measured at iPhone portrait before the fold:
   22 rows and 808px of an 844px screen — 96%. The card WAS the phone, and the
   sixth system overflowed it.

   Nielsen 2006 (progressive disclosure) and Cowan 2001 (~4 chunks) give the
   rule; the DATA gives the answer to what folds: a fact about the OUTFIT belongs
   to the outfit, not to every person in it.

   THE TWO THINGS A NAME-GREP CANNOT DO:
     1. MEASURE THE REAL CARD IN A REAL BROWSER at the real viewport.
     2. PROVE NOTHING WAS DELETED. Progressive disclosure is DEFER, never DROP,
        and this repo's own authored-but-unread gate exists because information
        nobody can reach is worse than information nobody needs.

   node gates/cardfold_gate.js
   ============================================================================ */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
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

/* A REAL FINGER, ON A REAL TOUCH PAGE, AT PHONE SIZE. Separate context because
   it needs hasTouch/isMobile, which the measuring page deliberately does not set. */
const HIG_MIN = 44;          /* Apple HIG 44x44pt; Material says 48dp. Same reason. */
async function tapTarget() {
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEW, hasTouch: true, isMobile: true });
  try {
    await page.goto('file://' + CITY);
    await SETTLE(page, 6000);
    const found = await page.evaluate(() => {
      const bases = ctBases() || {};
      let who = null, fid = null;
      for (const b of Object.values(bases)) {
        hx = b.x * FN + 2; hy = b.y * FN + 2;
        for (const p of ctEveryone()) { const f = ctFactionOf(p); if (f) { who = p; fid = f; break; } }
        if (who) break;
      }
      if (!who) return false;
      const at = ctAt(who); hx = at[0] + 1; hy = at[1];
      const sv = ctBelongSave();
      sv.meta.gave = {}; sv.meta.owed = {}; sv.meta.claims = {}; sv.meta.commit = {};
      ctSawCell(); ctOpen(); for (let i = 0; i < 3; i++) { ctClose(); ctOpen(); }
      sv.meta.gave[fid] = 6; sv.meta.owed[fid] = 3; sv.meta.commit[fid] = 'sided';
      ctClose(); ctOpen();
      return true;
    });
    if (!found) { ok('A10 a real affiliated person to tap', false); return; }

    const box = await page.locator('#ctterms').boundingBox();
    ok('A10 THE FOLD IS BIG ENOUGH FOR A THUMB. Every claim above passed while '
      + 'this was 14px tall, because .click() lands dead centre and a finger '
      + 'does not — 44x44 is the published minimum and the reason is that a '
      + 'fingertip is about 10mm',
      !!box && box.height >= HIG_MIN,
      box ? Math.round(box.width) + 'x' + Math.round(box.height) + 'px, minimum '
            + HIG_MIN + 'x' + HIG_MIN : 'no box');

    const before = await page.evaluate(() => document.getElementById('ctcard').innerText);
    await page.locator('#ctterms').tap();      /* a real touch, not a synthetic click */
    await SETTLE(page, 400);
    const after = await page.evaluate(() => document.getElementById('ctcard').innerText);
    ok('A11 …and a real TOUCH opens it, not just a synthetic click — "the handler '
      + 'is bound" and "a person can reach it" are different facts',
      /THEY WANT/.test(after) && after.length > before.length,
      after.length + ' chars after vs ' + before.length + ' before');
  } finally { await browser.close(); }
}

(async function main() {
  console.log('CARD FOLD GATE — the card fits, and nothing is lost\n');

  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEW });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  try {
    await page.goto('file://' + CITY);
    await SETTLE(page, 6000);
    const out = await page.evaluate(() => {
      /* NO STUB — a real affiliated person or nothing. */
      const bases = ctBases() || {};
      let who = null, fid = null;
      for (const b of Object.values(bases)) {
        hx = b.x * FN + 2; hy = b.y * FN + 2;
        for (const p of ctEveryone()) { const f = ctFactionOf(p); if (f) { who = p; fid = f; break; } }
        if (who) break;
      }
      if (!who) return { skip: 'nobody in the valley runs with anybody' };
      const at = ctAt(who); hx = at[0] + 1; hy = at[1];
      const sv = ctBelongSave();
      const r = { fid };
      const snap = () => {
        const c = document.getElementById('ctcard');
        return { rows: [...c.querySelectorAll('.r')].length,
                 px: Math.round(c.getBoundingClientRect().height),
                 text: c.innerText };
      };
      /* FIRST MEETING: you have never seen their terms, so they show in full. */
      sv.meta.gave = {}; sv.meta.owed = {}; sv.meta.claims = {}; sv.meta.commit = {};
      ctSawCell(); ctOpen();
      r.first = snap();
      /* THE BUSIEST STATE THE GAME CAN REACH: counted, committed, owing. */
      sv.meta.gave[fid] = 6; sv.meta.owed[fid] = 3; sv.meta.commit[fid] = 'sided';
      ctClose(); ctOpen();
      r.busy = snap();
      r.foldRow = !!document.getElementById('ctterms');
      const tt = document.getElementById('ctterms');
      if (tt) tt.click();
      r.opened = snap();
      /* AND IT RE-FOLDS on the next card, so it never sticks open. */
      ctClose(); ctOpen();
      r.reopened = snap();
      return r;
    });

    if (out.skip) { ok('the walked surface has somebody who runs with somebody', false, out.skip); }
    else {
      /* 1. IT FITS. */
      ok('A1 the busiest card the game can reach FITS on the phone with room to spare',
        out.busy.px < VIEW.height * 0.90,
        out.busy.px + 'px of ' + VIEW.height + ' (' + Math.round(100 * out.busy.px / VIEW.height) + '%)'
        + ' — it was 808px / 96% before the fold');
      ok('A2 …and it is genuinely shorter than the same card unfolded, so the fold '
        + 'is doing the work rather than the numbers moving on their own',
        out.busy.rows < out.opened.rows && out.busy.px < out.opened.px,
        JSON.stringify({ folded: out.busy.rows, unfolded: out.opened.rows }));

      /* 2. NOTHING IS LOST — DEFER, NEVER DROP. */
      ok('A3 the fold announces itself rather than silently vanishing',
        out.foldRow === true && /THEIR TERMS/.test(out.busy.text)
        && /tap to read/i.test(out.busy.text));
      ok('A4 every folded fact comes back on tap — progressive disclosure is DEFER, '
        + 'never DROP, and unreachable information is this repo\'s named disease',
        /THEY HOLD/.test(out.opened.text) && /PAID IN/.test(out.opened.text),
        JSON.stringify(out.opened.text.slice(0, 160)));
      ok('A5 the live question is never folded — what they are asking and where you '
        + 'stand stay on the card at all times',
        /THEY ARE ASKING YOU/.test(out.busy.text) && /YOU ARE/.test(out.busy.text));

      /* 3. THE FIRST MEETING IS NOT FOLDED. */
      ok('A6 an outfit you have never acted on shows its terms IN FULL — you cannot '
        + 'have read what you have never been shown',
        /THEY WANT/.test(out.first.text) && !/tap to read/i.test(out.first.text));

      /* 4. IT DOES NOT STICK OPEN. */
      ok('A7 the next card opens folded again, so one tap does not change the rule',
        /tap to read/i.test(out.reopened.text));

      /* 5. THE DUPLICATE IS GONE. */
      ok('A8 the TRADE row no longer repeats the heading verbatim',
        !(new RegExp('TRADE\\s*\\n?\\s*' + out.first.text.split('\n')[0], 'i')).test(out.first.text),
        JSON.stringify(out.first.text.split('\n').slice(0, 4)));
    }
    ok('A9 the city threw no errors doing any of that', errors.length === 0,
      errors.slice(0, 3).join(' | '));

    /* 6. AND A THUMB CAN ACTUALLY HIT IT. -------------------------------------
       THE CLAIMS ABOVE ALL PASSED WHILE THE TAP TARGET WAS 14px TALL. Every one
       of them opens the fold with .click() or an element tap, which lands dead
       centre every time; a thumb on a real phone does not. Apple's HIG has said
       44x44pt since 2013 and Google's Material says 48dp, for the same reason:
       fingertip contact patches are about 10mm. So this measures the BOX, on a
       real touch page, and opens it with a REAL TAP rather than a synthetic
       click -- because "the handler is bound" and "a person can reach it" are
       different facts, and only one of them is the game. */
    await tapTarget();
  } finally { await browser.close(); }

  console.log('\nCARD FOLD GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('CARD FOLD GATE CRASHED: ' + (e && e.stack || e)); process.exit(1); });
