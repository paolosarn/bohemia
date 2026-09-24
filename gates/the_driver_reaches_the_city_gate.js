/* ============================================================================
   THE DRIVER REACHES THE CITY  (FACTIONS lane, 9/14/26)

   RULE 14(g) POINTS EVERY LANE AT ONE INSTRUMENT: "LIFE+CITY built
   tools/bohemia_drive_the_demo.js. Every lane that walks the five minutes uses it
   or extends it." Four gates already load it and not one of them checks the
   instrument itself, so a broken driver is silently wrong for everybody at once.

   IT WAS BROKEN. Measured on the demo at 390 px:

       pinchOut (fingers together, toward the city)   mode human, HZOOM 44, NOTHING
       pinchIn  (fingers apart, back to the street)   HZOOM 44 -> 88, worked

   The cause was geometry, not the game. The pinch laid its two fingers left and
   right of centre, 150 px apart, which on a 390 px phone puts the left one at
   x=45 -- and the left edge of this game is a rail of controls. Asked outright:

       elementFromPoint(cx - 150, cy)  ->  DIV#rungbtn "STANDING"

   A pointerdown on a button never reaches the canvas, so the canvas only ever saw
   ONE finger and its two-finger branch never ran. The same squeeze laid up and
   down crossed the seam on the first try: mode city, HZOOM 44 -> 11.

   SO THE GAME WAS RIGHT THE WHOLE TIME. The seam obeys Paolo's 8/2 ruling ("i
   should be able to ZOOM OUT UNTIL I GET INTO THE CITY BUILDER MODE BRO") and
   opens on the first honest squeeze. What was wrong was the thing every lane
   measures with, and a lane using it could have walked away certain that the city
   view, the map, the territory and the feed were all dead.

   THIS IS PEOPLE'S LESSON MADE MECHANICAL: before believing a negative, prove the
   instrument can produce a positive.
   ========================================================================== */
'use strict';
const D = require('../tools/bohemia_drive_the_demo.js');

let pass = 0, fail = 0;
function ok(what, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + what + (note ? '   ' + note : '')); }
  else { fail++; console.log('  FAIL ' + what + (note ? '   ' + note : '')); }
}

(async () => {
  let d = null;
  try {
    d = await D.open();

    const door = await d.state();
    ok('the demo opens on foot, which is where a stranger starts',
      door.mode === 'human', JSON.stringify(door));

    /* THE POSITIVE, FIRST. A gate that only proves a thing is absent proves
       nothing about its own ability to see. */
    await d.pinchOut();
    const city = await d.state();
    ok('*** ONE SQUEEZE CROSSES THE SEAM: fingers together on the walked street '
      + 'puts him in the city view *** -- the only door in, and the instrument '
      + 'every lane measures the five minutes with can open it',
      city.mode === 'city', JSON.stringify(city));
    ok('and it is the zoom that does it, not a variable somebody set: the walked '
      + 'zoom steps down to its widest stop on the way through',
      city.hzoom === 11, 'HZOOM ' + door.hzoom + ' -> ' + city.hzoom);

    /* *** AND THE WAY BACK COSTS MORE THAN ONE SQUEEZE, WHICH THIS LEG COULD NOT SEE
       UNTIL THE DOOR ACTUALLY OPENED. *** (RUN 9/23.) One pinchIn and `back.mode ===
       'human'` PASSED for months for the wrong reason: the squeeze above was landing
       on the loading screen, so he never left the street, so "he is back on the street"
       was trivially true. Fixing the driver's door (TRAP 7) turned this leg red on its
       first honest run.
       MEASURED, going out and coming back on the real cut:
           one squeeze together   human -> CITY, CZOOM 1 -> 0.208
           fingers apart x1       still city, CZOOM 0.208   (the harness loses the
                                  first touch into a fresh gesture)
           fingers apart x2       still city, CZOOM 1.247
           fingers apart x3       CITY -> human, CZOOM 2.6
       THE DOOR DOES SWING BOTH WAYS. It is not symmetric, because the city camera has
       a long way to travel back, and that asymmetry is a real thing to look at -- it
       is on RUN's break list as a number rather than hidden inside a green tick here.
       So this holds the thing that matters, that he can get back at all, and PRINTS
       the cost instead of asserting a one that was never true. */
    let squeezes = 0, back = await d.state();
    for (let i = 1; i <= 6 && back.mode !== 'human'; i++) {
      await d.pinchIn(); back = await d.state(); squeezes = i;
    }
    console.log('  fingers apart brought him back after ' + squeezes + ' spread'
      + (squeezes === 1 ? '' : 's') + '   ' + JSON.stringify(back));
    ok('and fingers apart brings him back down to the street, so the door swings '
      + 'both ways',
      back.mode === 'human', squeezes + ' spreads, ' + JSON.stringify(back));
    /* *** AND IT COSTS THE SAME BOTH WAYS. *** (RUN 9/24, VAMILY [way back].) This
       used to be three spreads against one squeeze, and the cause was one gesture
       spending itself twice: the squeeze crossed the seam on its FIRST move and then
       its remaining thirty-nine moves zoomed the brand-new city camera from 1.000 all
       the way out to 0.208, the whole valley -- so his own gesture put him at the far
       end of a twelve-fold climb back. A gesture that crosses a seam is finished now,
       and the return seam fires on a request that overshoots the edge instead of
       demanding he already be sitting exactly on it, which was costing a whole dead
       press. ONE OUT, ONE BACK, and the asymmetry is the thing being gated, not the
       fact that he can get back at all. */
    ok('*** ONE SQUEEZE OUT, ONE SPREAD BACK: the seam costs the same in both '
      + 'directions *** (' + squeezes + ' spread' + (squeezes === 1 ? '' : 's') + ')',
      squeezes === 1);

    /* AND THE THING THAT ACTUALLY BROKE IT, pinned by name so it cannot come back
       the next time somebody adds a control down the left edge. */
    const fingers = await d.fr.evaluate(() => {
      const c = document.querySelector('canvas'); const b = c.getBoundingClientRect();
      const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
      /* the TAG is the answer; the id rides along only so a failure names the
         control it hit rather than making the reader go and find it */
      const who = (x, y) => { const el = document.elementFromPoint(x, y);
        return el ? el.tagName + (el.id ? '#' + el.id : '') : 'nothing'; };
      const isCanvas = (s) => /^CANVAS\b/.test(s);
      return { acrossLeft: who(cx - 150, cy), acrossRight: who(cx + 150, cy),
               upperFinger: who(cx, cy - 110), lowerFinger: who(cx, cy + 110),
               upperOk: isCanvas(who(cx, cy - 110)), lowerOk: isCanvas(who(cx, cy + 110)),
               acrossLeftOnCanvas: isCanvas(who(cx - 150, cy)) };
    });
    ok('AND THE AXIS IT PINCHES ON IS CLEAR OF THE CONTROLS: both fingers land on '
      + 'the canvas, not on a button, because a pointerdown on a button never '
      + 'reaches the canvas and the squeeze then does nothing at all',
      fingers.upperOk && fingers.lowerOk,
      JSON.stringify(fingers));
    /* *** AND THE RAIL MOVED, EXACTLY THE WAY THIS LEG SAID TO WATCH FOR. ***
       (RUN 9/23, VAMILY [cut now].) The leg below used to assert that the OLD
       across-the-middle axis lands on a control, which was the evidence that
       changing the axis was necessary rather than superstitious. Its own text said:
       "if this ever says CANVAS the rail moved and the old geometry would have been
       fine, which is worth KNOWING rather than silently passing."
       IT NOW SAYS CANVAS, and the reason is a ruling: rule 18g and 18i strip the
       left rail (STANDING, BUILD HERE, SCAVENGE, BIKE, SLEEP, MARKET) from the DEMO,
       so there is no control down that edge to hit any more.
       SO THE LEG BECOMES WHAT IT WAS ALWAYS FOR: it REPORTS which surface it is on
       and keeps the assertion that matters, which is the one above -- the axis the
       driver actually pinches on is clear. A gate that stayed red because a rail was
       deliberately removed would be enforcing a stale screen over his ruling, and a
       gate that just deleted the check would lose the reason the axis was moved. */
    const railGone = fingers.acrossLeftOnCanvas;
    console.log('  across-left is ' + fingers.acrossLeft
      + (railGone ? '   (the old axis is clear on this cut)'
                  : '   (the rail is still there, which is why the axis was moved)'));
    /* AND IT IS A REAL CHECK, NOT A SENTENCE THAT CANNOT FAIL: if the old axis came
       back clear, the rail must be genuinely OFF THE SCREEN, not merely moved
       somewhere else where it will take a different finger. */
    const rail = await d.fr.evaluate(() => {
      const el = document.getElementById('blstack');
      if (!el) return { there: false, seen: false };
      const b = el.getBoundingClientRect(), s = getComputedStyle(el);
      return { there: true,
               seen: s.display !== 'none' && s.visibility !== 'hidden'
                     && b.width > 4 && b.height > 4 };
    });
    ok('the old pinch axis is accounted for: it either still hits the rail, or the '
      + 'rail is really off the screen (rule 18g) rather than moved under another finger',
      railGone ? (rail.seen === false) : (rail.seen === true),
      'across-left ' + fingers.acrossLeft + ', the rail is '
        + (rail.seen ? 'drawn' : (rail.there ? 'in the markup and not drawn' : 'absent')));

    ok('and the page threw nothing while being driven',
      d.errs.length === 0, d.errs.slice(0, 3).join(' | '));
  } catch (e) {
    fail++; console.log('  FAIL the driver could not be run   ' + String(e.message).slice(0, 160));
  } finally { if (d) { try { await d.close(); } catch (_e) {} } }

  console.log('\n' + (fail ? 'THE DRIVER REACHES THE CITY: ' + fail + ' FAILED, ' + pass + ' ok'
    : 'THE DRIVER REACHES THE CITY: ' + pass + ' ok, 0 failed'));
  process.exit(fail ? 1 : 0);
})();
