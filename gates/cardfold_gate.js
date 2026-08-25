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

/* THE BUSIEST CARD THE GAME CAN REACH IS BUSIER THAN A1 THOUGHT (8/20).
   A1 stands next to whoever is affiliated and nearest, and that person is almost
   never somebody who can be VOUCHED for -- so the WHO PUT YOU ON row the Mob
   wiring added was outside the measurement that is supposed to hold the card to
   the phone. Measured the day it shipped: 833px of 844, 99%, while A1 was green.

   A BAR THAT DOES NOT MEASURE THE WORST CASE IS NOT A BAR. This stands next to a
   Mob member who HAS a same-outfit acquaintance, marks the whole valley met AND
   named (a state a player reaches by walking around), and puts them at the top of
   the ladder, owing, committed. That is every system on the card at once. */
async function busiestReachable() {
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEW });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  try {
    await page.goto('file://' + CITY);
    await SETTLE(page, 6000);
    const out = await page.evaluate(() => {
      const R = ctValleyRoster();
      /* NO STUB: a real Mob member with a real same-outfit tie, or nothing. */
      let target = null;
      for (const m of R.filter(a => String(a.faction || '').toUpperCase() === 'MOB')) {
        const ties = BohemiaTies.tiesOf(ctVKey(m), R, ctCell(), ctVKey);
        if (ties.some(t => {
          const w = R.filter(a => ctVKey(a) === t.key)[0];
          return w && String(w.faction || '').toUpperCase() === 'MOB';
        })) { target = m; break; }
      }
      if (!target) return { skip: 'no Mob member in the valley has a Mob acquaintance' };
      const parts = String(target.__id).split(':'), span = BohemiaPopulation.NB * FN;
      hx = (+parts[0]) * span + 4; hy = (+parts[1]) * span + 4;
      CT_SPAWN = null; ctSpawn();
      const rec = ctEveryone().filter(q => q.id === target.__id)[0];
      if (!rec) return { skip: 'the target is not on their own block' };
      /* PROVE IT IS THEM. ctOpen shows whoever is NEAREST, which has produced a
         false finding in this lane before. */
      const at = ctAt(rec); let placed = false;
      for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        hx = at[0] + d[0]; hy = at[1] + d[1];
        const adj = ctAdjacent();
        if (adj && adj.id === rec.id) { placed = true; break; }
      }
      if (!placed) return { skip: 'could not stand next to the target' };
      R.forEach(a => { CT_MET.meet('P:city:' + a.__id, 1); CT_MET.ask('P:city:' + a.__id, 1); });
      const fid = ctFactionOf(rec), sv = ctBelongSave();
      sv.meta.gave = {}; sv.meta.owed = {}; sv.meta.claims = {}; sv.meta.commit = {};
      /* AND THE WORST CASE IS AT THE **WALL**, WHICH THIS ALSO USED TO MISS.
         gave 6 against the sided ceiling of 9 is mid-climb: no wall row, no pass
         note, no hear row, no position row. Measured four states on one person:
             gave 6, sided, owing                    734px  87%
             at the sided-wall, no other standing    799px  95%   <- already over
             AT THE sided-WALL + other standing      838px  99%   <- the real worst
         The 95% line is the one that matters: the card was through the bar at the
         wall BEFORE tertius existed and nothing had ever stood there. Fixing a bar
         by adding the case that just bit you, instead of asking what the maximum
         is, leaves the neighbour. THE WALL IS WHERE EVERY SYSTEM IS ON AT ONCE. */
      sv.meta.gave[fid] = 9; sv.meta.owed[fid] = 3; sv.meta.commit[fid] = 'sided';
      /* real standing with a SECOND outfit, so the position row is on too */
      const other = R.map(a => String(a.faction || '').toUpperCase())
                     .filter(f => f && f !== String(fid).toUpperCase())[0];
      if (other) for (let i = 0; i < 3; i++) BohemiaBelonging.record(sv, other, 0);
      ctSawCell(); ctClose(); ctOpen();
      const c = document.getElementById('ctcard');
      const snap = () => ({ px: Math.round(c.getBoundingClientRect().height),
                            rows: c.querySelectorAll('.r').length, text: c.innerText });
      const folded = snap();
      const tt = document.getElementById('ctterms');
      if (tt) tt.click();
      const opened = snap();

      /* ---- AND NOW THE WORST PERSON, NOT THIS ONE -----------------------
         Height is driven by CONTENT LENGTH, so the person above is one sample.
         Same state, swept across everybody affiliated, keeping the tallest and
         its geometry — a bar that can be satisfied by a short quirk quote is a
         bar that passes by luck. */
      let worst = null;
      const spread = [];
      for (const row of R.filter(a => a.faction).slice(0, 16)) {
        const q2 = String(row.__id).split(':'), sp2 = BohemiaPopulation.NB * FN;
        hx = (+q2[0]) * sp2 + 4; hy = (+q2[1]) * sp2 + 4; CT_SPAWN = null; ctSpawn();
        const r2 = ctEveryone().filter(x => x.id === row.__id)[0];
        if (!r2) continue;
        const a2 = ctAt(r2); let stood = false;
        for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          hx = a2[0] + d[0]; hy = a2[1] + d[1];
          const g = ctAdjacent(); if (g && g.id === r2.id) { stood = true; break; }
        }
        if (!stood) continue;
        const f2 = ctFactionOf(r2), s2 = ctBelongSave();
        s2.meta.gave = {}; s2.meta.owed = {}; s2.meta.claims = {}; s2.meta.commit = {};
        s2.meta.gave[f2] = 9; s2.meta.owed[f2] = 3; s2.meta.commit[f2] = 'sided';
        const o2 = R.map(a => String(a.faction || '').toUpperCase())
                    .filter(f => f && f !== String(f2).toUpperCase())[0];
        if (o2) for (let i = 0; i < 3; i++) BohemiaBelonging.record(s2, o2, 0);
        ctSawCell(); ctClose(); ctOpen();
        const c2 = document.getElementById('ctcard');
        if (!c2 || c2.style.display === 'none') continue;
        const b2 = c2.getBoundingClientRect();
        const offBtns = [...c2.querySelectorAll('button')]
          .filter(x => { const z = x.getBoundingClientRect();
                         return z.bottom > innerHeight + 1 || z.top < -1; }).length;
        const rec2 = { fid: f2, px: Math.round(b2.height), top: Math.round(b2.top),
                       bottom: Math.round(b2.bottom), offBtns,
                       scrolls: c2.scrollHeight > c2.clientHeight + 2 };
        spread.push(rec2);
        if (!worst || rec2.px > worst.px) worst = rec2;
      }
      return { fid, folded, opened, worst, spread };
    });

    if (out.skip) {
      ok('A12 the busiest card the game can reach — INCLUDING a vouch — still fits',
        false, out.skip);
      return;
    }
    /* A12 IS NOT A PIXEL BUDGET ANY MORE, AND THE THIRD MISS IS WHY.
       A1 stood beside whoever was NEAREST and never saw a vouch. A12 replaced it
       and measured a comfortable STATE. A12 was rebuilt to sit at the wall and
       still measured ONE ARBITRARY PERSON. Measured across fourteen people in the
       IDENTICAL state: 916 916 900 881 881 874 852 832 823 ... 381 px.
       SEVEN OF FOURTEEN WERE TALLER THAN THE PHONE and A12 was pinned to the
       NINTH WORST, because height is driven by CONTENT LENGTH — the quirk quote
       alone runs 105-134 chars — so one person is one sample of a distribution.
       AND THE REAL DEFECT WAS NEVER THE NUMBER. The card is bottom-anchored with
       no cap, so it grew UPWARD off the screen: top at -80px, every button still
       reachable, and what was cut off was the person's NAME. The requirement was
       never "under 90%", it was NOTHING IS OFF THE SCREEN — so that is what this
       asserts now, on the worst card the sweep can find rather than on a number
       that a shorter quirk quote could satisfy by luck. */
    ok('A12 THE FULLEST CARD THE GAME CAN REACH IS FULLY ON THE SCREEN — measured '
      + 'across many people rather than one, because card height is driven by how '
      + 'long a person\'s quirk and name happen to be, and pinning one person pins '
      + 'one sample. It grew upward off the top and hid their NAME',
      out.worst && out.worst.top >= 0 && out.worst.bottom <= VIEW.height,
      out.folded.px + 'px of ' + VIEW.height + ' ('
      + Math.round(100 * out.folded.px / VIEW.height) + '%)'
      + ' — 838px / 99% before the four duplicate rows came off');

    ok('A17 …and that card really is AT THE WALL with a second standing, so A12 is '
      + 'measuring the maximum rather than a comfortable state that happens to '
      + 'pass. A bar that does not measure the worst case is not a bar',
      /THE WALL/.test(out.folded.text) && /YOUR POSITION/.test(out.folded.text),
      JSON.stringify({ wall: /THE WALL/.test(out.folded.text),
                       position: /YOUR POSITION/.test(out.folded.text),
                       vouch: /WHO PUT YOU ON/.test(out.folded.text) }));

    ok('A18 …and nothing on it is printed twice. Four rows repeated something the '
      + 'card already said — the position and the hear row, the owing note, the '
      + 'fold summary and the live claim, and YOU ARE against the wall row — and '
      + 'a duplicate is not disclosure',
      !/YOUR POSITION[\s\S]*NOBODY\. NO OUTFIT/.test(out.folded.text)
      && !(function () {
        const m = out.folded.text.match(/THEY ARE ASKING YOU\n([^\n]*)/);
        return !!(m && out.folded.text.indexOf(m[1] + ' · tap to read') >= 0);
      })(),
      JSON.stringify(out.folded.text.split('\n').slice(0, 30)));
    /* THE HEADLINE IS LIVE, THE EXPLANATION IS THE OUTFIT'S. */
    ok('A13 an explainer folds with the outfit\'s terms while the headline it '
      + 'explains stays on the card — what is asked and what is on offer are '
      + 'never hidden, only the sentence saying how that works',
      /THEY ARE ASKING YOU/.test(out.folded.text)
      && !/Not offering\. Asking\./.test(out.folded.text)
      && /Not offering\. Asking\./.test(out.opened.text),
      JSON.stringify({ headlineFolded: /THEY ARE ASKING YOU/.test(out.folded.text),
                       noteFolded: !/Not offering\. Asking\./.test(out.folded.text),
                       noteBackOnTap: /Not offering\. Asking\./.test(out.opened.text) }));
    ok('A14 the vouch is actually on the card being measured, so A12 is not '
      + 'quietly measuring an ordinary one',
      /WHO PUT YOU ON/.test(out.folded.text),
      JSON.stringify(out.folded.text.split('\n').slice(0, 4)));
    /* A RULE DESERVES ITS OWN CLAIM, NOT A SIDE-EFFECT OF A PIXEL BUDGET.
       I shipped the NAME dedupe expecting A12 to hold it, and the mutation test
       said otherwise: restore the duplicate row and A12 STAYS GREEN, because the
       explainer fold had already bought enough headroom that ~23px no longer
       crosses the bar. The claim I wrote about my own mutation was wrong.
       A HEIGHT CHECK CATCHES A DUPLICATE ONLY BY ACCIDENT, and only until the
       next row lands. This asserts the rule directly, the way A8 already does
       for the TRADE row -- same defect, same card, same test. */
    const head = (out.folded.text.split('\n')[0] || '').trim();
    const esc = head.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    ok('A16 the NAME row no longer repeats the heading verbatim either. The '
      + 'heading BECOMES the name once you know it, so the row under it said the '
      + 'same thing twice on exactly the fullest cards — the identical defect A8 '
      + 'was written for, one row higher up',
      !!head && !(new RegExp('(^|\\n)NAME\\s*\\n\\s*' + esc + '\\s*(\\n|$)', 'i'))
        .test(out.folded.text),
      JSON.stringify({ heading: head, first: out.folded.text.split('\n').slice(0, 4) }));

    ok('A15 nothing threw while measuring the busiest card', errors.length === 0,
      errors.slice(0, 3).join(' | '));
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

  /* 7. AND THE WORST CASE, WHICH A1 CANNOT REACH FROM WHERE IT STANDS. */
  await busiestReachable();

  console.log('\nCARD FOLD GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('CARD FOLD GATE CRASHED: ' + (e && e.stack || e)); process.exit(1); });
