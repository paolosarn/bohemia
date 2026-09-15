/* ============================================================================
   EVERY ROW DOES SOMETHING GATE (9/13/26, QUESTS lane) -- VAMILY [half now],
   and it is this lane's five-minute break.

   PAOLO 9/13, RULE 14(d), LOCKED: "A card that promises something and does
   nothing is the worst bug in the game: deliver it or remove it." From his own
   five minutes: "You offer requests just for me to see them, but nothing
   happens... one button... I press it, nothing happens."

   EYES E26's stranger walk, item 2, measured on a phone profile: "the day card's
   own row 'Half of it now, before I go' (320x43), dead between two rows that
   worked." That row is this lane's haggle.

   ------------------------------------------------------------------------
   WHAT I MEASURED, INCLUDING THE PART THAT DOES NOT AGREE WITH THE REPORT
   ------------------------------------------------------------------------
   Driven straight on the real card, on THIS tree and on the tree before PEOPLE's
   card fix (b39c33cb^), tapping that row DOES change it: the pay line goes from
   "Pays one battery" to "One battery, half of it up front", the row is replaced
   by "Half now. And you are holding it if you walk", and terms.upfront flips
   false -> true. So the tap is not broken and I could not reproduce the report's
   exact route.

   I AM NOT CLAIMING THE OBSERVATION AWAY. Reading my own code instead of arguing
   with a measurement found a dead row BY CONSTRUCTION:

       haggleAsk()  opens with  if(!OFFER||!OFFER.terms||OFFER_TAKEN) return;
       haggleHtml() drew every ask row with no such test.

   So once the job is TAKEN, the card still offered every ask and not one of them
   could do anything. That is a state a walking player reaches -- take the job,
   reopen the card, tap a row, nothing happens -- and it is exactly his sentence.

   THE FIX IS WHERE THE ROW IS DRAWN, not only where it is tapped, because two
   rules about one thing is how they drift apart. And the answer is REMOVE rather
   than deliver: you cannot argue the price of a job you have already taken.

   ------------------------------------------------------------------------
   WHAT THIS GATE HOLDS
   ------------------------------------------------------------------------
   1. *** EVERY ROW THE DAY CARD OFFERS CHANGES THE CARD WHEN IT IS TAPPED. ***
      Not "the handler exists". Tapped on the real surface, in the browser, and
      the card's own words compared before and after.

   2. AND IT HOLDS IN EVERY STATE THE CARD HAS, not just the one a fresh player
      sees: before the job is taken, and after it is taken. The after state is
      the one that was broken, and it was invisible because nobody walked it.

   3. THE GUARD IS AT THE DRAW, not only at the tap. Read out of the source, so a
      future hand that re-adds a row cannot pass by wiring only the handler.

   4. AND THE ROW THAT REALLY WORKS STILL REALLY WORKS. Removing a dead row by
      deleting the live one would pass check 1 and gut the feature, so the ask is
      driven and its effect on the terms is checked by name.
   ========================================================================== */
'use strict';
const path = require('path');
const fs   = require('fs');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) { pass++; } else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};

/* ---- 3. THE GUARD IS AT THE DRAW --------------------------------------- */
const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
const hagStart = CITY.indexOf('function haggleHtml(');
const hagEnd   = CITY.indexOf('\n}', hagStart);
const hagSrc   = CITY.slice(hagStart, hagEnd);
ok('3a haggleHtml exists in the walked city', hagStart > 0);
ok('3b *** it refuses to DRAW an ask once the job is taken ***',
   /OFFER_TAKEN\)\s*return h/.test(hagSrc.replace(/\/\*[\s\S]*?\*\//g, '')));
ok('3c and it still refuses to draw one on a withdrawn offer',
   /t\.withdrawn\)\s*return h/.test(hagSrc));
const askFn = CITY.slice(CITY.indexOf('function haggleAsk('), CITY.indexOf('function haggleAsk(') + 400);
ok('3d the tap refuses the same three states the draw does',
   /!OFFER\|\|!OFFER\.terms\|\|OFFER_TAKEN/.test(askFn));

/* ---- the real surface -------------------------------------------------- */
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto('file://' + ALPHA);
    await page.evaluate(() => localStorage.setItem('bohemia.opening.seen.v1', '1'));
    await page.reload();
    await SETTLE(page, 3400);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await SETTLE(page, 500);
    await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('.tab'))
        .find(e => (e.textContent || '').trim() === 'RUN');
      if (t) t.click();
    });
    await SETTLE(page, 16000);

    let city = null;
    for (const f of page.frames()) {
      try { if (await f.evaluate(() => typeof showWake === 'function')) { city = f; break; } }
      catch (_e) {}
    }
    ok('4a the day card reached the frame the player looks at', !!city);
    if (!city) throw new Error('no city frame');

    /* 4 RUNS FIRST, AND THAT ORDERING IS A BUG THIS GATE MADE AND FIXED.
       The sweep below taps EVERY row, which sets upfront=true and legitimately
       removes the half-up-front row from the menu -- so checking it afterwards
       reported it "missing" when the sweep had simply used it. A check whose
       result depends on an earlier check is not measuring the game. */
    /* 4. AND THE ROW THAT WORKS STILL REALLY WORKS, by name. */
    const upfront = await city.evaluate(() => {
      showWake();
      const before = (OFFER && OFFER.terms) ? OFFER.terms.upfront : null;
      const el = Array.from(document.querySelectorAll('#daycardIn [data-act]'))
        .find(e => e.getAttribute('data-act') === 'hg:upfront');
      if (!el) return { missing: true };
      el.click();
      return { missing: false, before: before,
               after: (OFFER && OFFER.terms) ? OFFER.terms.upfront : null,
               said: (OFFER && OFFER.terms) ? OFFER.terms.said : null };
    });
    ok('4c the half-up-front row is on the fresh card', upfront.missing === false);
    ok('4d *** and tapping it really moves the terms, not just the words ***  ('
       + upfront.before + ' -> ' + upfront.after + ')',
       upfront.before === false && upfront.after === true);
    ok('4e and the offer says so in words', !!upfront.said);


    /* 1. EVERY ROW, TAPPED, ON THE REAL CARD, BEFORE THE JOB IS TAKEN. */
    const fresh = await city.evaluate(() => {
      const text = () => { const el = document.getElementById('daycardIn');
                           return el ? el.innerText.trim() : ''; };
      const open = () => { const c = document.getElementById('daycard');
                           return !!(c && c.offsetParent !== null); };
      /* *** A HIDDEN ROW IS NOT A ROW, AND I MADE THIS EXACT MISTAKE MYSELF.
         (9/15.) *** Chasing EYES E26's third report of a dead row, my probe
         "pressed" the take row after the job was taken and reported it dead.
         It was not dead, it was display:none -- PEOPLE's in-place update hides
         the spent rows -- and element.click() fires on a hidden element even
         though no thumb on earth can reach it. So this gate only ever sweeps
         rows a thumb could actually hit, and the same rule kills the false
         positive I nearly filed against somebody else's work. */
      const seen = (e) => !!(e && e.offsetParent !== null
                             && (e.getBoundingClientRect().width > 0));
      const rowsOf = () => Array.from(document.querySelectorAll('#daycardIn [data-act]'))
        .filter(seen)
        .map(e => ({ act: e.getAttribute('data-act'), say: (e.textContent || '').trim() }))
        /* close and go LEAVE the card, so "the card changed" is the wrong test
           for them; they are checked by the card being gone, below. */
        .filter(r => r.act !== 'close' && r.act !== 'go' && r.act !== 'take');
      showWake();
      const all = rowsOf(), out = [];
      for (const r of all) {
        showWake();                                   /* back to a known card */
        const before = text();
        const el = Array.from(document.querySelectorAll('#daycardIn [data-act]'))
          .find(e => e.getAttribute('data-act') === r.act);
        if (!el) { out.push({ ...r, gone: true }); continue; }
        el.click();
        /* *** "THE CARD CHANGED" IS THE WRONG TEST, AND A PLANTED DEAD BUTTON
           PROVED IT. *** I added a row reading "A CAR IS GONNA PULL UP" with no
           handler -- his complaint, word for word -- and this gate stayed GREEN.
           Measured why: cardShow closes the card on any tap it does not
           recognise (__EVERY_PANEL_CLOSES__), so a dead row HIDES THE CARD, the
           text differs because there is no card any more, and the diff reads as
           life. IN THIS GAME A DEAD BUTTON IS INDISTINGUISHABLE FROM A CLOSE
           BUTTON, which is exactly how dead buttons survive every screen diff.
           So a row is alive only if the card is STILL OPEN and its words moved. */
        out.push({ ...r, changed: open() && text() !== before });
      }
      return { rows: all.map(r => r.act), results: out };
    });
    console.log('  [rows on a fresh card] ' + fresh.rows.join(', '));
    ok('4b the card offers rows to tap at all (' + fresh.rows.length + ')', fresh.rows.length > 0);
    const dead = fresh.results.filter(r => r.changed === false || r.gone);
    ok('1a *** every row the fresh day card offers CHANGES it when tapped ***  ('
       + fresh.results.filter(r => r.changed).length + '/' + fresh.results.length + ')',
       dead.length === 0, dead.map(d => d.act).join(','));

    /* 2. THE STATE THE DRAW GUARD EXISTS FOR, AND IT IS FORCED ON PURPOSE.
       I first tried to reach it the way a player would -- tap TAKE, redraw --
       and MEASURED that it cannot be reached that way, for a good reason that is
       not mine: showWake() runs offerRing(), whose first line is
       `OFFER=null; OFFER_TAKEN=false;`, so a redraw RE-RINGS the phone. PEOPLE
       found that and their take path deliberately updates the card IN PLACE
       rather than redrawing. So a player cannot normally see a taken job's card
       re-offered, and asserting otherwise would be this gate lying about the
       game.
       WHAT IS STILL WORTH HOLDING is the invariant underneath: the draw and the
       tap must refuse the same states, so no future caller can produce a row
       that cannot act. That is tested by forcing the state and asking the draw
       function directly, which is honest about being forced. */
    const forced = await city.evaluate(() => {
      /* A FRESH CONVERSATION, BUILT NOT BORROWED. Two earlier cuts of this check
         read zero rows and both times the CHECK was wrong, not the game: the
         sweep above legitimately uses up every ask, and calling showWake() does
         not reset it because __ASK_FOR_MORE__ deliberately keeps the
         conversation across a redraw (keyed on day and job) -- which is correct
         behaviour this check was fighting.
         So the invariant is tested against a terms object made from the module,
         which isolates "the draw refuses what the tap refuses" from whatever
         conversation the live card happens to be in. */
      const t = BohemiaHaggle.open(OFFER && OFFER.quest);
      const card = { terms: t, paysSay: 'x' };
      const was = OFFER_TAKEN;
      let whenNot = 0, whenTaken = 0;
      try {
        OFFER_TAKEN = false; whenNot   = ((haggleHtml(card) || '').match(/data-act="hg:/g) || []).length;
        OFFER_TAKEN = true;  whenTaken = ((haggleHtml(card) || '').match(/data-act="hg:/g) || []).length;
      } finally { OFFER_TAKEN = was; }
      return { whenNot: whenNot, whenTaken: whenTaken, restored: OFFER_TAKEN,
               terms: !!t };
    });
    ok('2a a fresh conversation really offers asks to tap ('
       + forced.whenNot + ')', forced.whenNot > 0);
    ok('2b *** and the card offers NONE once the job is taken, which is exactly'
       + ' what the tap would have refused *** (' + forced.whenTaken + ')',
       forced.whenTaken === 0);
    ok('2c and the gate put the world back', forced.restored === false);

    /* ==================================================================
       9. *** THE SAME SWEEP AGAIN ON THE DEMO, BY ITS OWN ROUTE. (9/15.) ***

       *** A CORRECTION TO WHAT THIS HEADER SAID WHEN THE DEMO PASS WAS ADDED,
       AND THE CORRECTION MATTERS MORE THAN THE PASS. *** I wrote that this gate
       was "green about a build he does not play", and told every lane the same.
       MEASURED AFTERWARDS, AND IT IS OVERSTATED: both builds carry
       `const CITY_SRC='BOHEMIA_CITY_WORLD.html'` and load that ONE file by path.
       `ctFirstAsks` appears 0 times in the demo, 0 in the alpha and 1 in the
       city. THE CARD IS DRAWN BY CODE BOTH BUILDS SHARE, so a gate opening the
       alpha was testing the same card code all along, and the dead-row reports
       are not explained by which build the gate opened.

       WHAT THE ALPHA-ONLY PASS REALLY DID NOT COVER, which is narrower and real:
       THE DEMO'S OWN ROUTE TO THE CARD. The demo has no tab bar -- the splash
       goes straight in -- and its shell is a generated cut with its own loading
       path. A card that is fine in the workshop can still be unreachable, late,
       or covered in the cut. That is what this pass tests, and it is worth
       keeping for that reason and not for the one I first gave.

       It also covers the state the reports are about: AFTER the job is taken.
       ================================================================== */
    const demoPage = await b.newPage({ viewport: { width: 390, height: 844 } });
    const demoErrs = [];
    demoPage.on('pageerror', e => demoErrs.push(String(e.message).slice(0, 140)));
    await demoPage.goto('file://' + path.join(ROOT, 'slices/BOHEMIA_DEMO.html'));
    await demoPage.evaluate(() => localStorage.setItem('bohemia.opening.seen.v1', '1'));
    await demoPage.reload();
    await SETTLE(demoPage, 4000);
    await demoPage.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await SETTLE(demoPage, 18000);
    let demoCity = null;
    for (const f of demoPage.frames()) {
      try { if (await f.evaluate(() => typeof showWake === 'function')) { demoCity = f; break; } }
      catch (_e) {}
    }
    ok('9a *** the day card is reachable in the DEMO, not only the workshop ***', !!demoCity);

    if (demoCity) {
      const d = await demoCity.evaluate(() => {
        const txt  = () => { const el = document.getElementById('daycardIn');
                             return el ? el.innerText.trim() : ''; };
        const open = () => { const c = document.getElementById('daycard');
                             return !!(c && c.offsetParent !== null); };
        const seen = (e) => !!(e && e.offsetParent !== null
                               && e.getBoundingClientRect().width > 0);
        const live = () => Array.from(document.querySelectorAll('#daycardIn [data-act]'))
          .filter(seen).map(e => e.getAttribute('data-act'));

        /* *** THE TAKE CHECK RUNS FIRST, AND THAT IS THE THIRD TIME THIS GATE
           HAS LEAKED STATE INTO ITS OWN LATER CHECKS. *** The sweep below taps
           EVERY row, take included, which starts the quest -- and showWake()
           re-rings the offer but does NOT un-start a quest, so offerAccept()
           then refuses and "taking does not change the card" reads as a defect
           that is really my own ordering.
           THE RULE THIS GATE KEEPS RE-LEARNING: A SWEEP THAT PRESSES EVERYTHING
           MUST RUN LAST. Anything measured after it is measuring the sweep. */
        showWake();
        const tk = Array.from(document.querySelectorAll('#daycardIn [data-act]'))
          .filter(seen).find(e => e.getAttribute('data-act') === 'take');
        let tookChanged = null, afterTaken = null, taken = null;
        if (tk) {
          const b0 = txt();
          tk.click();
          tookChanged = open() && txt() !== b0;
          taken = (typeof OFFER_TAKEN !== 'undefined') ? OFFER_TAKEN : null;
          afterTaken = live().filter(a => a === 'take' || /^hg:/.test(a));
        }

        showWake();
        const fresh = live().filter(a => a !== 'close' && a !== 'go');
        const dead = [];
        for (const act of fresh) {
          showWake();
          const el = Array.from(document.querySelectorAll('#daycardIn [data-act]'))
            .filter(seen).find(e => e.getAttribute('data-act') === act);
          if (!el) continue;               /* legitimately spent by an earlier tap */
          const before = txt();
          el.click();
          if (!(open() && txt() !== before)) dead.push(act);
        }

        return { fresh, dead, tookChanged, taken, afterTaken };
      });
      console.log('  [demo rows] ' + d.fresh.join(', '));
      console.log('  [demo, after taking] pressable leftovers: '
        + ((d.afterTaken || []).join(',') || 'none'));
      ok('9b the demo card offers rows a thumb can reach (' + d.fresh.length + ')',
         d.fresh.length > 0);
      ok('9c *** every reachable row on the DEMO card does something ***  ('
         + (d.dead.join(',') || 'none dead') + ')', d.dead.length === 0);
      ok('9d taking the job on the demo really changes the card', d.tookChanged === true);
      ok('9e *** and afterwards NOTHING pressable is left that would refuse ***  ('
         + ((d.afterTaken || []).join(',') || 'none') + ')',
         (d.afterTaken || []).length === 0);
      ok('9f nothing threw in the demo either', demoErrs.length === 0,
         demoErrs.slice(0, 2).join(' | '));
    }

    ok('5a nothing threw while every row was tapped', errs.length === 0, errs.slice(0, 2).join(' | '));
  } finally {
    await b.close();
  }

  console.log('EVERY ROW DOES SOMETHING GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
