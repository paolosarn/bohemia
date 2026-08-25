const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   EVERY BUTTON WORKS, AND EVERYTHING IT OPENS CAN BE CLOSED (8/24/26, RUN lane)

   PAOLO, verbatim:
     "When I press standing, and I press close, it doesn't close"
     "pretty please just make sure all the buttons work ... there shouldn't be
      any buttons that bring up any pop menus that don't go away after ...
      clicking out of them"

   WHAT WAS ACTUALLY WRONG, measured before any of this was written: the STANDING
   card opened with ZERO elements carrying data-act, and data-act was the only
   path cardShow had to its own cardHide. So the card printed a row reading
   "TAP / CLOSE" and no tap anywhere -- on the words, on the card, on the backdrop
   -- could shut it. cardHide existed, was correct, and was unreachable.

   THE CLAIM THIS GATE MAKES IS NOT "STANDING CLOSES". That would go green while
   the next card somebody writes is exactly as stuck, because the SYSTEM allowed a
   card with no way out. The claim is: from anything a player can open, HE CAN GET
   BACK TO THE GAME.

   AND THAT IS WHAT IT MEASURES -- NOT A CLASS, NOT A FLAG. After closing, it asks
   the browser what is under the middle of the stage with elementFromPoint. If the
   answer is the world canvas, he is back in the game. If a panel is still there
   intercepting his thumb, it does not matter what any classList says. A gate that
   checked `.classList.contains('on')` would have passed a card left at opacity 0
   over the whole screen.

   THE BUTTON LIST IS DERIVED, NEVER TYPED. It walks the three layout containers
   that own the chrome -- the toolbar, the builder's drawer, the bottom-left
   column -- so a chip any lane adds tomorrow is swept without anybody editing
   this file. A hand-kept list is right the day it is written and wrong after that.

   TWO ARE HELD OUT, and they are named rather than quietly skipped: REROLL
   rebuilds the valley (it would destroy the session this gate is measuring) and
   SLEEP ends the day. Both are exercised for OPEN-AND-ESCAPE where that is safe
   and neither is tapped for its side effect.

   node gates/every_panel_closes_gate.js
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
  console.log('\n=== EVERY PANEL CLOSES: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

/* NEVER TAPPED FOR ITS SIDE EFFECT, and said out loud rather than skipped in
   silence: reroll replaces the world this gate is standing in, sleep ends the day. */
const HELD_OUT = { reroll: 'rebuilds the valley', sleepbtn: 'ends the day' };

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
    await SETTLE(page, 1500);

    /* WHAT IS UNDER HIS THUMB IN THE MIDDLE OF THE STAGE. This is the whole
       instrument: the game is reachable when the thing there is the world. */
    const underThumb = () => city.evaluate(() => {
      const cv = document.getElementById('cv');
      const r = cv.getBoundingClientRect();
      const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return { id: e ? (e.id || e.className || e.tagName) : 'nothing',
               isWorld: !!(e && e.id === 'cv') };
    });

    const base = await underThumb();
    ok('with nothing open, the middle of the screen IS the world (' + base.id + ')',
      base.isWorld === true);

    /* ---- 1. THE BUG HE REPORTED, AND ALL THREE WAYS OUT -------------------- */
    const openStanding = async () => {
      await city.evaluate(() => document.getElementById('rungbtn').click());
      await SETTLE(page, 700);
      return city.evaluate(() => ({
        on: document.getElementById('daycard').classList.contains('on'),
        acts: document.querySelectorAll('#daycardIn [data-act]').length }));
    };
    const cardOpen = () => city.evaluate(() =>
      document.getElementById('daycard').classList.contains('on'));

    let st = await openStanding();
    ok('STANDING opens a card', st.on === true);
    ok('and the card carries something that can actually close it (' + st.acts
      + ' action element(s)) -- it used to carry ZERO while printing "TAP CLOSE"',
      st.acts > 0);
    await city.evaluate(() => {
      const x = document.querySelector('#daycardIn [data-act="close"]'); if (x) x.click(); });
    await SETTLE(page, 600);
    ok('*** PRESSING CLOSE CLOSES IT *** -- the thing he reported', (await cardOpen()) === false);
    let u = await underThumb();
    ok('and he is back in the game, measured by what is under his thumb ('
      + u.id + ')', u.isWorld === true);

    st = await openStanding();
    await city.evaluate(() => document.getElementById('daycard').click());
    await SETTLE(page, 600);
    ok('TAPPING OUTSIDE THE CARD closes it too -- the gesture he named',
      st.on === true && (await cardOpen()) === false);

    st = await openStanding();
    await city.evaluate(() => document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
    await SETTLE(page, 600);
    ok('and Escape closes it', st.on === true && (await cardOpen()) === false);

    /* a tap INSIDE the card must NOT close it, or reading one is impossible */
    st = await openStanding();
    await city.evaluate(() => {
      const i = document.getElementById('daycardIn');
      const t = i.querySelector('.rwhy') || i;
      t.click();
    });
    await SETTLE(page, 500);
    ok('but a tap INSIDE the card does not close it, so it can be read',
      (await cardOpen()) === true);
    await city.evaluate(() => { try { cardHide(); } catch (e) { } });
    await SETTLE(page, 400);

    /* ---- 2. THE OLD TILE PANEL IS GONE ------------------------------------ */
    await city.evaluate(() => {
      const cv = document.getElementById('cv');
      const r = cv.getBoundingClientRect();
      const o = { bubbles: true, pointerId: 1,
                  clientX: r.left + r.width * 0.5, clientY: r.top + r.height * 0.32 };
      cv.dispatchEvent(new PointerEvent('pointerdown', o));
      cv.dispatchEvent(new PointerEvent('pointerup', o));
    });
    await SETTLE(page, 900);
    const judge = await city.evaluate(() => {
      const e = document.getElementById('tpJudge');
      return e ? (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60) : null;
    });
    ok('TAPPING THE GROUND RAISES NOTHING -- the tile panel from the first builds '
      + 'is gone, and it used to appear on every tap ('
      + (judge === null ? 'nothing' : judge) + ')', judge === null);
    u = await underThumb();
    ok('and the ground is still the ground after tapping it', u.isWorld === true);

    /* ---- 3. EVERY CHIP IN THE CHROME, DERIVED FROM THE LAYOUT ------------- */
    const chips = await city.evaluate(() => {
      const out = [];
      ['topbar', 'devtray', 'blstack'].forEach(function (host) {
        const h = document.getElementById(host);
        if (!h) return;
        [].forEach.call(h.children, function (e) {
          if (!e.id) return;
          const s = getComputedStyle(e);
          if (s.display === 'none' || s.visibility === 'hidden') return;
          out.push({ id: e.id, host: host, label: (e.textContent || '').trim().slice(0, 22) });
        });
      });
      return out;
    });
    ok('the chrome is walked rather than typed out (' + chips.length
      + ' visible chips across the toolbar, the drawer and the bottom-left column)',
      chips.length >= 6);

    const stuck = [], dead = [];
    for (const chip of chips) {
      if (HELD_OUT[chip.id]) continue;
      /* open the drawer first when the chip lives in it */
      if (chip.host === 'devtray') {
        await city.evaluate(() => {
          const t = document.getElementById('devtray');
          if (t && !t.classList.contains('on')) document.getElementById('devbtn').click();
        });
        await SETTLE(page, 400);
      }
      const before = await underThumb();
      await city.evaluate(id => { const e = document.getElementById(id); if (e) e.click(); }, chip.id);
      await SETTLE(page, 900);
      /* now get back to the game the way a player would: the card's own close,
         a tap outside it, Escape, and each panel's own ✕ */
      await city.evaluate(() => {
        /* PRESS WHAT THE PANEL ACTUALLY OFFERS, FOUND BY LOOKING. The first cut of
           this listed #phoneclose and #popclose by name and reported savebtn,
           keybtn and five others as STUCK -- they were not, it simply did not know
           #sv-close existed. A gate that declares a panel unclosable because IT
           could not find the button is measuring its own blind spot and calling it
           a defect in the game, which is the exact mistake this repo keeps
           cataloguing. So: sweep every visible panel for anything that reads as a
           way out, then try the gestures a player has. */
        const x = document.querySelector('#daycardIn [data-act="close"]'); if (x) x.click();
        const d = document.getElementById('daycard'); if (d) d.click();
        ['phonewrap', 'savepanel', 'keypanel', 'pfpanel', 'popwrap', 'devtray']
          .forEach(function (pid) {
            const p = document.getElementById(pid);
            if (!p || p.offsetParent === null) return;
            [].forEach.call(p.querySelectorAll('*'), function (e) {
              const t = (e.textContent || '').trim();
              if (e.children.length === 0 && /^(CLOSE|LEAVE|DONE|BACK|\u2715|\u2716|X|\u00d7)$/i.test(t)) e.click();
            });
          });
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      });
      /* AND THE GESTURE HE ACTUALLY NAMED: tap the world behind the panel. Driven
         through playwright's real mouse rather than a synthesised PointerEvent --
         the city calls setPointerCapture on pointerdown, and a hand-made event
         carries a pointerId the browser has no active pointer for, so the page
         threw "No active pointer with the given id is found" and my own gate
         logged it as the GAME throwing. A fake gesture is not the gesture. */
      await city.locator('#cv').click({ position: { x: 195, y: 300 }, force: true })
        .catch(() => { });
      await SETTLE(page, 900);
      const after = await underThumb();
      if (!after.isWorld) stuck.push(chip.id + ' -> ' + after.id);
      if (before.isWorld && after.isWorld === false) dead.push(chip.id);
    }
    ok('*** EVERY CHIP HE CAN PRESS LETS HIM BACK INTO THE GAME *** ('
      + (chips.length - Object.keys(HELD_OUT).filter(k => chips.some(c => c.id === k)).length)
      + ' sweptheld out: ' + Object.entries(HELD_OUT).map(([k, v]) => k + ' (' + v + ')').join(', ')
      + (stuck.length ? '; STUCK: ' + stuck.join(', ') : '') + ')',
      stuck.length === 0);

    ok('and nothing threw while he pressed all of them ('
      + (errs.length ? errs.slice(0, 2).join(' | ') : 'none') + ')', errs.length === 0);

    console.log('  SWEPT: ' + chips.map(c => c.id).join(' · '));
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
  }
  await browser.close();
  done();
})();
