const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   NO TWO PIECES OF CHROME MAY SIT ON TOP OF EACH OTHER (8/24/26, RUN lane)

   THE BUG THIS EXISTS FOR, measured on the real alpha after taking the day-one
   job the way a player takes it, boxes in the city frame's own coordinates:

       qline    47..62   "Find why the block browns out"    z 7
       topbar   49..80    MUSIC / SAVE / PHONE / wrench      z 7

   Thirteen of the objective's fifteen pixels were inside the toolbar, and both
   at z-index 7, so which one won was decided by DOM order. That sentence is the
   only thing in the game telling a player what he is supposed to be doing. Two
   more pairs were piled in the bottom-left corner.

   AND IT WAS A REGRESSION AGAINST A FIX THAT ALREADY SHIPPED. The CITY lane
   found this exact bug in this exact corner on 7/29, wrote "none of them knows
   the others exist", and built a flex column to own it. Six days later the DAY
   LOOP -- this lane -- added three more absolutely positioned chips to the same
   corner with hardcoded offsets. NOTHING IN THE MACHINE CARED, which is the
   whole reason a law needs a gate: the fix was right, was written down, was
   read by nobody, and rotted in under a week.

   SO THE CHECK IS GENERAL, NOT THREE SPECIAL CASES. Every visible piece of HUD
   chrome is measured against every other one, pairwise, on the surface he plays.
   A new chip added tomorrow is covered the day it appears, without anybody
   remembering to add it here -- which is the only kind of check that survives
   the next lane.

   ANCESTRY IS NOT OVERLAP. A button inside the toolbar is inside the toolbar on
   purpose, and a badge sits on its own button by design. Pairs where one node
   CONTAINS the other are skipped, because containment is the layout working.

   EXCEPTIONS ARE WRITTEN DOWN OR THEY DO NOT EXIST. There is no fuzz factor and
   no "close enough" tolerance to hide behind: a deliberate overlap has to be
   named in ALLOWED below with the reason it is deliberate. An exception you have
   to type is an exception somebody has to justify.

   IT IS CHECKED IN MORE THAN ONE STATE, because chrome that fits at 06:00 with
   a short song title can collide at nightfall with a long one. The states are
   reached by tapping, never by forcing an element visible.

   node gates/hud_overlap_gate.js
   ========================================================================== */
const path = require('path');
const ROOT = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('\n=== HUD OVERLAP: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

/* THE CHROME. Everything the city draws over the world that a thumb or an eye is
   meant to land on. Modals and full-stage overlays are NOT here: a card that
   covers the world is covering it on purpose.
   #devtray AND ITS CHILDREN ARE OUT, and the line is worth drawing where it is.
   The drawer is a PANEL THE PLAYER OPENED, not a chip that lives in a corner: it
   is meant to sit over whatever is under it and one tap puts it away. Its BUTTON
   (#devbtn) is chrome and is checked. Nothing inside the tray goes unchecked
   either -- #devtray>* is already a flex column with its own position reset, so
   its chips cannot collide with each other, which is the thing a list like this
   would be testing for. */
const CHROME = [
  'qline', 'topbar', 'musbtn', 'savebtn', 'phonebtn', 'devbtn',
  'note', 'sleepbtn', 'rungbtn', 'mktbtn', 'bikebtn', 'fitbtn',
  'nav', 'hud', 'footing',
];

/* DELIBERATE OVERLAPS, each with the reason it is deliberate. Empty is the
   correct state and every entry is a claim somebody has to defend. */
const ALLOWED = [
  // ['a', 'b', 'why this one is on purpose'],
];
const allowed = (a, b) => ALLOWED.some(r =>
  (r[0] === a && r[1] === b) || (r[0] === b && r[1] === a));

/* CHROME is passed IN, not closed over: this function is serialized into the
   page and a module-scope reference does not travel with it. */
const READ = (ids) => {
  const out = [];
  for (const id of ids) {
    const e = document.getElementById(id);
    if (!e) continue;
    const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) continue;
    const r = e.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    out.push({ id: id, x: r.x, y: r.y, w: r.width, h: r.height,
               txt: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 34) });
  }
  /* ancestry, resolved in the page where the nodes are */
  const anc = [];
  for (let i = 0; i < out.length; i++) for (let j = i + 1; j < out.length; j++) {
    const A = document.getElementById(out[i].id), B = document.getElementById(out[j].id);
    if (A.contains(B) || B.contains(A)) anc.push(out[i].id + '|' + out[j].id);
  }
  return { boxes: out, anc: anc };
};

/* the overlap itself is arithmetic, so it happens here where it can be read */
function collisions(read) {
  const { boxes, anc } = read;
  const hits = [];
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j];
    if (anc.indexOf(a.id + '|' + b.id) >= 0) continue;   /* containment is the layout working */
    if (allowed(a.id, b.id)) continue;
    const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
    const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    if (ox > 0.5 && oy > 0.5) hits.push({ a: a.id, b: b.id, ox: Math.round(ox), oy: Math.round(oy),
      at: [Math.round(a.y), Math.round(a.y + a.h), Math.round(b.y), Math.round(b.y + b.h)] });
  }
  return hits;
}

const report = (state, hits) => hits.map(h =>
  h.a + ' x ' + h.b + ' (' + h.ox + 'x' + h.oy + 'px, y ' + h.at[0] + '..' + h.at[1]
  + ' vs ' + h.at[2] + '..' + h.at[3] + ')').join(' · ');

(async () => {
  const { chromium } = playwright();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
    await SETTLE(page, 4000);
    await page.click('#front').catch(() => { });
    await SETTLE(page, 30000, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try { return await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1); }
      catch (e) { return false; }
    });
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('the walked world is up', !!city);
    if (!city) done();
    await page.evaluate(() => { const n = document.getElementById('openNot'); if (n) n.click(); });
    await SETTLE(page, 1200);
    await city.evaluate(() => {
      const g = document.querySelector('#daycardIn .dcgo') || document.querySelector('#daycardIn .dcbtn');
      if (g) g.click();
    });
    await SETTLE(page, 1800);

    /* ---- 1. PROVE THE INSTRUMENT. It has to be able to SEE an overlap, or a
       clean report means nothing. Shove one chip onto another and check it
       shouts, then put it back and check it stops. --------------------------- */
    /* THE MUTATION PUTS THE BUG BACK RATHER THAN INVENTING ONE, AND IT HAS TO
       OUTRUN THE LAYOUT. Two cuts failed before this one and both failures were
       informative. Shoving #sleepbtn onto another chip with inline position:fixed
       did nothing -- the column kept winning. Taking it OUT of the column with
       its old `bottom:6px` did work, and then blStack's 600ms tick ADOPTED IT
       BACK before the read, so the gate still saw a clean screen. A control that
       cannot fail is not a control, and twice it could not fail for a different
       reason.
       So plant, measure and restore in ONE evaluate: reading a rect forces layout
       synchronously, so no timer can run in the middle. The state it plants is
       exactly what shipped before today -- #sleepbtn out of the column on its own
       hardcoded bottom:6px, which is what had it under #bikebtn by 25 pixels.
       (That the tick heals it at all is the fix working, and it is asserted
       separately below.) */
    const plantedBoxes = await city.evaluate((ids) => {
      const e = document.getElementById('sleepbtn');
      const s = document.getElementById('blstack');
      if (!e || !s || !s.parentNode) return null;
      const wasParent = e.parentNode, wasStyle = e.getAttribute('style') || '';
      s.parentNode.appendChild(e);
      e.style.cssText = 'position:absolute;left:6px;bottom:6px;z-index:7;padding:7px 11px';
      const read = (function () {
        const out = [];
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) continue;
          const r = el.getBoundingClientRect();
          if (r.width < 1 || r.height < 1) continue;
          out.push({ id: id, x: r.x, y: r.y, w: r.width, h: r.height, txt: '' });
        }
        const anc = [];
        for (let i = 0; i < out.length; i++) for (let j = i + 1; j < out.length; j++) {
          const A = document.getElementById(out[i].id), B = document.getElementById(out[j].id);
          if (A.contains(B) || B.contains(A)) anc.push(out[i].id + '|' + out[j].id);
        }
        return { boxes: out, anc: anc };
      })();
      e.setAttribute('style', wasStyle);
      wasParent.appendChild(e);
      return read;
    }, CHROME).catch(() => null);

    if (plantedBoxes) {
      const seen = collisions(plantedBoxes);
      ok('THE INSTRUMENT CAN SEE A COLLISION: put yesterday\'s bug back and it is '
        + 'reported (' + (report('planted', seen) || 'nothing, which would be the bug') + ')',
        seen.length > 0);
    } else {
      ok('THE INSTRUMENT CAN SEE A COLLISION', false);
    }
    await SETTLE(page, 1400);   /* blStack re-asserts on a 600ms tick */
    const back = collisions(await city.evaluate(READ, CHROME));
    ok('AND THE COLUMN HEALS ITSELF: a chip knocked out of it is re-adopted and the '
      + 'screen is clean again' + (back.length ? ': ' + report('restored', back) : ''),
      back.length === 0);

    /* ---- 2. THE REAL STATES, reached by tapping ------------------------- */
    const states = [];

    states.push(['just got up', collisions(await city.evaluate(READ, CHROME))]);

    /* the objective on screen is the state the bug was found in: a player who
       has taken the day's job and is walking with it */
    await city.evaluate(() => { const b = document.getElementById('phonebtn'); if (b) b.click(); });
    await SETTLE(page, 2500);
    const pf = page.frames().find(fr => /CURRENT_SLICE/.test(fr.url()));
    if (pf) {
      try {
        await pf.waitForSelector('.lv-take', { state: 'attached', timeout: 10000 });
        await pf.evaluate(() => { const t = document.querySelector('.lv-take'); if (t) t.click(); });
      } catch (e) { }
    }
    await SETTLE(page, 2200);
    await city.evaluate(() => { try { phoneClose(); } catch (e) { } });
    await SETTLE(page, 900);
    states.push(['carrying the day\'s objective', collisions(await city.evaluate(READ, CHROME))]);

    /* the builder's drawer open: more chrome on screen than at any other time */
    await city.evaluate(() => { const b = document.getElementById('devbtn'); if (b) b.click(); });
    await SETTLE(page, 700);
    states.push(['the builder\'s drawer open', collisions(await city.evaluate(READ, CHROME))]);
    await city.evaluate(() => { const b = document.getElementById('devbtn'); if (b) b.click(); });
    await SETTLE(page, 500);

    /* walking, which is where he actually reads the objective */
    for (let i = 0; i < 3; i++) {
      await city.evaluate(async (h) => {
        const p = document.querySelectorAll('#pad .pb')[4];
        if (!p) return;
        p.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        await new Promise(r => setTimeout(r, h));
        p.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      }, 560);
      await SETTLE(page, 300);
    }
    states.push(['walking with it', collisions(await city.evaluate(READ, CHROME))]);

    for (const [name, hits] of states) {
      ok('NOTHING SITS ON TOP OF ANYTHING ELSE -- ' + name
        + (hits.length ? ': ' + report(name, hits) : ''), hits.length === 0);
    }

    /* ---- 3. THE SENTENCE THAT STARTED THIS ------------------------------ */
    const q = await city.evaluate(() => {
      const e = document.getElementById('qline'), t = document.getElementById('topbar');
      if (!e || !t) return null;
      const a = e.getBoundingClientRect(), b = t.getBoundingClientRect();
      /* .height, not .h -- a DOMRect has no .h, and reading it gave "toolbar ..NaN"
         in this gate's own first run. A comparison against NaN is always false, so
         the claim would have failed forever for a reason that was not the claim. */
      return { text: (e.textContent || '').trim(), qTop: Math.round(a.y), qBot: Math.round(a.y + a.height),
               tTop: Math.round(b.y), tBot: Math.round(b.y + b.height),
               step: (function () { try { return DQ.nextStep(); } catch (x) { return 'ERR'; } })() };
    });
    ok('the objective is on screen at all ("' + (q ? q.text : '') + '")',
      !!(q && q.text));
    ok('AND IT IS BELOW THE TOOLBAR, not behind it (objective ' + (q ? q.qTop : '?')
      + '.., toolbar ..' + (q ? q.tBot : '?') + ')', !!(q && q.qTop >= q.tBot));
    ok('AND IT TELLS HIM WHAT TO DO, not just what to find ("' + (q ? q.step : '') + '")',
      !!(q && q.step && q.step.length > 4));

    /* ---- 4. AND THE THING IT TELLS HIM IS TRUE --------------------------- */
    /* A hint that does not match the rule that will actually fire is worse than
       no hint. This asks the spec what advances the quest and checks the sentence
       is about that, rather than trusting the string. */
    const truth = await city.evaluate(() => {
      const a = DQ.spec && DQ.spec.advance;
      return a ? { on: a.on, require: a.require || null, stage: a.stage,
                   now: DQ.rt.state.stage, step: DQ.nextStep() } : null;
    });
    ok('the hint is derived from the rule that really advances the day ('
      + (truth ? truth.on + (truth.require ? '/' + truth.require : '') : 'no spec') + ')',
      !!(truth && ((truth.on === 'enter_building' && /inside/.test(truth.step))
                || (truth.on === 'enter_district' && /block/.test(truth.step)))));
    ok('and it says DARK when the rule requires dark, and does not when it does not',
      !!(truth && (truth.require === 'dark') === /power is out/.test(truth.step)));

    /* ---- 5. AND IT GOES AWAY WHEN IT IS NO LONGER THE NEXT STEP ---------- */
    const past = await city.evaluate(() => {
      const a = DQ.spec && DQ.spec.advance; if (!a) return null;
      const keep = DQ.rt.state.stage;
      DQ.rt.state.stage = a.stage;              /* stand past the step */
      const s = DQ.nextStep();
      DQ.rt.state.stage = keep;
      return { step: s };
    });
    ok('a step he has already taken stops being advertised', !!(past && past.step === ''));

    ok('and the whole of it threw nothing ('
      + (errs.length ? errs.slice(0, 2).join(' | ') : 'none') + ')', errs.length === 0);

    console.log('  MEASURED: ' + states.map(([n, h]) => n + ' ' + h.length).join(' · ')
      + '  (collisions per state, across ' + CHROME.length + ' pieces of chrome)');
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
  }
  await browser.close();
  done();
})();
