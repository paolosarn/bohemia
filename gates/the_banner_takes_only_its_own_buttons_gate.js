/* ==========================================================================
   NOTHING SITS ON TOP OF THE GAME  (RUN, 9/27/26)
   VAMILY [banner eats fingers] + [cold open], rule 32a.

   PAOLO 8/24: "when I press standing and I press close, it doesn't close."
   PAOLO 9/23, on the whole first minute: "why does everything have to happen the
   first second of the game", "don't force this on me".

   *** THIS GATE CHANGED ITS MIND MID-ROUND, AND THE REASON IS ON THE RECORD. ***
   It was built to hold "the banner takes only its own two buttons", because the
   defect I measured was a greedy strip:

       #openInvite    390 x 87 at 0,109    z-index 39    pointer-events AUTO
       elementFromPoint down the middle    y=110 -> openInvite, 140 and 160 -> divs
       three real touches down the strip    0 of 3 reached the walked frame

   All of that was true and proven, and pointer-events:none on the strip with auto on
   its buttons took it to 3 of 3. Then THE REVAMP LIST landed while I was measuring and
   named this element for deletion: "THE COLD OPEN (RUN, PEOPLE): the family cutscene
   ('DAY 1 BEGINS BEFORE THE DAY', WATCH / NOT NOW) AND THE BANNER THAT EATS FINGERS
   WITH IT." NEWEST DATE WINS. A polite banner in the first second is still a banner in
   the first second, so the fix is not a nicer strip, it is no strip.

   SO WHAT IT HOLDS NOW: the cold open never offers itself, the banner never draws, it
   could not take a finger even if something force-showed it, the top of the game
   belongs to the walked world, AND this is a HIDE and not a raid on another lane's
   scene code -- RAY, DENISE, MARCO and NINA stay as people you meet, and archiving the
   markup is a shared job with PEOPLE.

   WHY THE ALPHA AND NOT THE DEMO, out loud: the cut already hid this banner, so
   measuring the demo would report a clean screen about a defect only the alpha -- the
   link he is actually sent -- could ever show him.

   node gates/the_banner_takes_only_its_own_buttons_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const drive = require(path.join(__dirname, '..', 'tools', 'bohemia_drive_the_demo.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const say = (s) => console.log('  ' + s);
const done = () => {
  console.log('NOTHING SITS ON TOP OF THE GAME: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
};

(async () => {
  /* 1. THE SCENE IS STILL IN THE FILE. A cut of a shared feature must not become a
     quiet deletion of the half that belongs to somebody else. */
  const ALPHA = fs.readFileSync(
    path.join(__dirname, '..', 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
  ok('this is a HIDE, not a raid: the banner markup is still in the file for the '
     + 'archive job PEOPLE shares', /id="openInvite"/.test(ALPHA));
  ok('and the scene engine it opened is still there too', /function openPlay|BohemiaStorySurface/.test(ALPHA));

  let d;
  try { d = await drive.open({ alpha: true, keepCards: true }); }
  catch (e) { ok('the alpha boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }

  try {
    const fr = d.fr;
    await d.page.waitForTimeout(1500);

    /* 2. THE COLD OPEN DOES NOT OFFER ITSELF -- asked of the one question every path
       through the opening asks first, so this covers the tab handler and the resume
       as well as the banner. */
    const should = await d.pageEval(() => {
      try { return openShould(); } catch (e) { return 'threw: ' + e.message; }
    });
    say('  openShould() answers ' + JSON.stringify(should));
    ok('*** THE COLD OPEN NEVER OFFERS ITSELF (rule 32a: nothing is forced) ***',
       should === false);

    /* 3. AND NOTHING IS DRAWN, even after the call that used to show it. */
    await d.pageEval(() => { try { openInviteShow(); } catch (_e) {} });
    await d.page.waitForTimeout(700);
    const b = await d.pageEval(() => {
      const el = document.getElementById('openInvite');
      if (!el) return { there: false };
      const s = getComputedStyle(el), r = el.getBoundingClientRect();
      return { there: true, disp: s.display, pe: s.pointerEvents,
               w: Math.round(r.width), h: Math.round(r.height) };
    });
    say('  after calling the thing that used to show it: display ' + b.disp
        + ', ' + b.w + ' x ' + b.h + ', pointer-events ' + b.pe);
    ok('*** THE BANNER DOES NOT DRAW, even when asked to ***',
       b.there === true && b.disp === 'none' && b.w === 0);

    /* 4. AND THE SECOND LOCK HOLDS: force it visible and it still cannot take a
       finger. Belt as well as braces, because a future caller that sets display
       directly would otherwise put the whole defect back. */
    /* *** AND THIS LEG NEARLY PASSED FOR THE WRONG REASON, WHICH IS THE MISTAKE THIS
       ROUND ALREADY MADE ONCE. *** The first cut forced display:block, found the box
       0 x 0 (the panel it lives in is not laid out), asked elementFromPoint at a
       zero-width point, got "nothing", and ticked green. That is a leg passing because
       its subject was not there -- exactly the shape of my finger test that closed a
       control four hundred pixels from the thing it was about.
       SO IT ASSERTS THE LOCK ITSELF, which is the durable fact and needs no layout:
       pointer-events is none on the strip, so any future caller that sets display
       directly still cannot take a finger with it. The box is REPORTED, never asserted
       on, and the leg says out loud when there was nothing to hit-test. */
    const forced = await d.pageEval(() => {
      const el = document.getElementById('openInvite');
      const was = el.style.display;
      el.style.display = 'block';
      void el.offsetHeight;                      /* force layout before measuring */
      const r = el.getBoundingClientRect();
      let who = null;
      if (r.width > 4 && r.height > 4) {
        const mid = document.elementFromPoint(r.x + r.width * 0.75, r.y + r.height / 2);
        who = mid ? (mid.id || mid.tagName) : 'nothing';
      }
      const pe = getComputedStyle(el).pointerEvents;
      el.style.display = was;
      return { w: Math.round(r.width), h: Math.round(r.height), who: who, pe: pe };
    });
    say('  the strip declares pointer-events ' + forced.pe
        + '; forced visible it measured ' + forced.w + ' x ' + forced.h
        + (forced.who === null
            ? ' (no box to hit-test, so that half is not claimed)'
            : ' and the point across it belongs to ' + forced.who));
    ok('and the second lock is on the element itself: it declares pointer-events none, '
       + 'so a future caller that force-shows it still cannot take a finger',
       forced.pe === 'none');
    if (forced.who !== null) {
      ok('  and with a real box, the point across it is not the strip',
         forced.who !== 'openInvite' && forced.who !== 'DIV');
    }

    /* 5. THE TOP OF THE GAME BELONGS TO THE WALKED WORLD. Counted INSIDE the frame,
        which is the whole difference between this and every check that missed it: an
        iframe's stacking never beats its parent's, so nothing measured from in there
        could ever have seen the strip. */
    const frBox = await (await fr.frameElement()).boundingBox();
    ok('the walked world has a box on screen (otherwise the next leg is about nothing)',
       !!frBox && frBox.height > 100);
    await fr.evaluate(() => {
      window.__HITS = [];
      document.addEventListener('pointerdown', e => window.__HITS.push(Math.round(e.clientY)), true);
    });
    /* the band it used to own: 0,109 to 0,196 in page coordinates */
    for (const y of [118, 152, 188]) {
      await d.page.touchscreen.tap(390 * 0.75, y);
      await d.page.waitForTimeout(200);
    }
    const hits = await fr.evaluate(() => window.__HITS);
    say('  three real touches where the strip used to be reached the frame: '
        + hits.length + ' of 3');
    ok('*** THE TOP OF THE GAME IS THE GAME AGAIN *** (it was 0 of 3)', hits.length === 3);

    await d.close();
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
    try { await d.close(); } catch (_e) {}
  }
  done();
})();
