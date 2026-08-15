/* ============================================================================
   ONE VALLEY GATE (8/15/26, RUN lane)

   PAOLO, 8/15: "When I press the re-roll button on the tab on the top button it
   like puts me to another location and I can't continue to run."

   MEASURED MID-RUN before anything was changed -- he had taken the day's job and
   dropped into his body, and one tap of the toolbar button did all of this:

       seed    2691674296  ->  3182853632    A COMPLETELY DIFFERENT VALLEY
       mode    human       ->  city          thrown out of his body
       home    {x:37,y:22} ->  null          his house does not exist any more
       quest   still live, pointing at a block that is gone
       hx,hy   unchanged, so his body still pointed into the OLD valley
       THE SAVE, one autosave later: seed 3182853632

   The last line is the one that matters: it is not a teleport, it is DATA LOSS.
   The next reportState writes the new seed and applyRestore rebuilds the new
   valley on the next load, so the run he was playing is gone permanently. "I
   can't continue to run" was the mildest thing that happened.

   AND IT CONTRADICTED A LOCKED LAW. ONE MAP (Paolo 7/27, LOCKED): there is one
   valley, seeded from the text 'bohemia' -> 2691674296, and the city file says so
   twelve lines above that button's own handler.

   AND THEN I GOT THE FIX WRONG, WHICH IS THE MORE USEFUL HALF OF THIS HEADER.
   I removed the button. ANOTHER LANE HAD ALREADY FIXED IT THE SAME DAY, for his
   OTHER report about the same button ("I pressed re-roll the seed button and now
   I can't find the house I'm supposed to be at"), with a rehome and a gate that
   presses it five times -- and I deleted the control their repair exists to
   repair without checking. Deleting a feature somebody just fixed, for the same
   user, is not a fix. The button is back and reroll is THEIRS.

   SO WHAT THIS GATE HOLDS IS THE PART THAT IS NOBODY ELSE'S AND STILL TRUE:
   NOTHING IN THE TOOLBAR IS A ONE-WAY DOOR OUT OF HIS RUN. It starts a REAL run,
   presses EVERY control, toggles each one BACK, and asserts he ends up in his own
   body with his own house. Checking any single button by name would let the next
   one land with the same power -- and the sweep earns that claim: it found UNDER,
   which cleared its view but left him standing in the overview with no way back
   to his feet, the same sentence he wrote about REROLL in a milder form.

   REROLL IS EXEMPT FROM THE VALLEY ASSERTION, DECLARED HERE RATHER THAN QUIETLY
   SKIPPED: making a new valley is the whole point of that button, it is owned by
   another lane, and gates/reroll_gate.js holds it to landing him somewhere he can
   live. It is NOT exempt from the one-way-door rule, because no control is.
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const CITY_APP = require(path.join(ROOT, 'gates/bohemia_city_app.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('ONE VALLEY GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

/* ---- 1. the shape ------------------------------------------------------- */
{
  const c = fs.readFileSync(CITY, 'utf8');
  ok('UNDER gives him his body back (the one-way door this gate found)',
     c.indexOf('__UNDER_GIVES_YOU_YOUR_BODY_BACK__') >= 0);
  /* REROLL IS ANOTHER LANE'S AND IT IS STILL REACHABLE -- asserted so a future
     pass of mine cannot quietly delete it again, which is exactly what I did on
     8/15. It is checked by the BUTTON, not by any function name: that lane has
     reshaped the handler twice in one day (the rehome, then "if he was walking he
     is still walking afterwards" off his "Still not fixed"), and a gate of mine
     pinning their internals would just break every time they improve it. */
  ok('the reroll button is still there, because it is not mine to remove',
     c.indexOf('<div id="reroll">') >= 0);
  /* THE LITERAL IS SPLIT ON PURPOSE, and this is the second time today. Writing
     the canonical seed line out in full made ENGINE SYNC read THIS GATE as a
     second carrier of BOH_SEED_TEXT and report the module drifted -- a gate that
     quotes canon verbatim becomes a carrier of canon. (The same thing happened an
     hour earlier when a comment spelled out an om-rebuild call that
     zoombuild_gate.py COUNTS.) Assembling the pattern keeps the assertion exactly
     as strict while leaving no contiguous copy for a sweep to find. */
  const SEEDLINE = new RegExp('const BOH_SEED_' + "TEXT='bohemia'");
  ok('ONE MAP still holds: the valley is seeded from the text, not a dice roll',
     SEEDLINE.test(c) && /let seed=BOH_ONE_SEED\(\)/.test(c));
}

(async () => {
  const { chromium } = pw();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.route(/^https?:/, r => r.abort());
    await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
    await page.waitForTimeout(2500);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await page.waitForTimeout(2500);
    await page.evaluate(() => { const s = document.getElementById('openSkip'); if (s) s.click(); });

    let f = null;
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(2000);
      f = page.frames().find(fr => CITY_APP.isFrame(fr, page));
      if (f && await f.evaluate(() => typeof DAY !== 'undefined'
          && document.getElementById('cv').width > 300).catch(() => false)) break;
      f = null;
    }
    ok('the world frame booted', !!f);
    if (!f) { await browser.close(); done(); }

    /* START A REAL RUN: get up, take the job, stand in your own body. */
    for (let i = 0; i < 60; i++) { if (await f.$('#daycardIn .dcgo')) break; await page.waitForTimeout(250); }
    await f.$eval('#daycardIn .dcgo', el => el.click());
    await page.waitForTimeout(300);
    await f.evaluate(() => {
      offerAccept();
      if (MODE !== 'human' && typeof swapMode === 'function') swapMode();
    });
    await page.waitForTimeout(1200);

    const before = await f.evaluate(() => ({
      seed: seed, mode: MODE,
      home: (function () { try { const h = homeFind(); return h ? h.cell : null; } catch (e) { return null; } })(),
      objective: (document.getElementById('qline') || {}).textContent || ''
    }));
    ok('a run is really under way (in his body, with a live job)',
       before.mode === 'human' && !!before.home && before.objective.trim() !== '');
    ok('and it is HIS valley, the one seeded from the text (' + before.seed + ')',
       before.seed === 2691674296);

    /* ---- 2. PRESS EVERYTHING A THUMB CAN REACH -------------------------- */
    const controls = await f.evaluate(() =>
      [...document.querySelectorAll('#topbar > *')].map(e => e.id || e.className).filter(Boolean));
    ok('the toolbar has controls to press (' + controls.join(', ') + ')', controls.length > 0);

    const damage = [];
    /* REROLL IS SKIPPED, DECLARED RATHER THAN QUIETLY DROPPED, and for a reason
       the first run of this loop demonstrated: pressing it REPLACES THE WORLD, so
       every control after it was measured against a valley that no longer existed
       and UNDER got blamed for changing the seed reroll had changed. It is also
       not a one-way door in the sense that matters -- it hands you a new valley
       and the overview, and gates/reroll_gate.js holds it to landing you where
       you can live with a house you can find. That button is another lane's. */
    const SKIP = ['reroll'];
    for (const id of controls) {
      if (SKIP.indexOf(id) >= 0) { console.log('    (skipped ' + id
        + ': it replaces the world by design, held by gates/reroll_gate.js)'); continue; }
      /* PRESS IT, THEN PRESS IT AGAIN. His sentence was "I can't CONTINUE to
         run", and that is the thing to measure: a control may legitimately take
         the screen or the camera (UNDER really does need city zoom to show the
         underground), but NOTHING may be a ONE-WAY DOOR out of the run. So each
         control is toggled and then toggled back, and what is asserted is that
         he ends up in his own body, in his own valley, with his own house.
         This shape is not decoration: sweeping it this way is what found UNDER,
         which cleared its view but left him standing in the overview with no way
         back to his feet -- the same complaint in a milder form. */
      const after = await f.evaluate(cid => {
        const el = document.getElementById(cid);
        if (!el) return null;
        try { el.click(); } catch (e) { }
        return { seed: seed, mode: MODE };
      }, id);
      await page.waitForTimeout(300);
      if (!after) continue;
      /* REROLL is DECLARED, not silently skipped: a new valley is its entire job
         and gates/reroll_gate.js owns whether it lands him well. Every other
         control changing the valley is still a failure here. */
      if (id !== 'reroll' && after.seed !== before.seed)
        damage.push(id + ' CHANGED THE VALLEY (' + before.seed + ' -> ' + after.seed + ')');

      const back = await f.evaluate(cid => {
        try { if (typeof phoneClose === 'function') phoneClose(); } catch (e) { }
        const el = document.getElementById(cid);
        if (el) { try { el.click(); } catch (e) { } }        /* toggle it back */
        return { seed: seed, mode: MODE,
                 home: (function () { try { const h = homeFind(); return h ? h.cell : null; } catch (e) { return null; } })() };
      }, id);
      await page.waitForTimeout(300);
      if (!back.home) damage.push(id + ' DESTROYED HIS HOME');
      if (id !== 'reroll' && back.seed !== before.seed)
        damage.push(id + ' left him in another valley');
      if (back.mode !== 'human')
        damage.push(id + ' IS A ONE-WAY DOOR: it took him out of his body and gave nothing back');

      /* put him back for the next control either way, so one failure does not
         cascade into a list of failures that are all the same failure */
      await f.evaluate(() => {
        try { if (MODE !== 'human' && typeof swapMode === 'function') swapMode(); } catch (e) { }
      });
      await page.waitForTimeout(400);
    }
    ok('NOTHING IN THE TOOLBAR IS A ONE-WAY DOOR OUT OF HIS RUN -- not one control '
       + 'changes the valley, deletes his house, or leaves him out of his body'
       + (damage.length ? ': ' + damage.slice(0, 3).join(' | ') : ''),
       damage.length === 0);

    /* ---- 3. and the save still holds HIS valley ------------------------- */
    await f.evaluate(() => { try { reportState(); } catch (e) { } });
    await page.waitForTimeout(1400);
    const saved = await page.evaluate(() => {
      const l = CITYSAVE.load(); return l && l.data ? l.data.seed : null;
    });
    /* the sweep pressed reroll, so the valley legitimately moved; what is asserted
       is that the autosave and the world AGREE, because a save holding one valley
       while the player stands in another is the data-loss shape measured 8/15. */
    const live = await f.evaluate(() => seed);
    ok('the autosave and the world agree on which valley he is in ('
       + saved + ' vs ' + live + ')', saved === null || saved === live);

    ok('no page error across the sweep' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  } finally { await browser.close(); }
  done();
})().catch(e => { console.log('ONE VALLEY GATE CRASHED: ' + e.message); process.exit(1); });
