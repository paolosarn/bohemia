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

    await d.pinchIn();
    const back = await d.state();
    ok('and fingers apart brings him back down to the street, so the door swings '
      + 'both ways',
      back.mode === 'human', JSON.stringify(back));

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
    ok('and this is not theoretical: the axis it USED TO pinch on really does put '
      + 'a finger on a control at this size, which is the whole bug',
      !fingers.acrossLeftOnCanvas,
      'across-left is ' + fingers.acrossLeft + '  (if this ever says CANVAS the '
      + 'rail moved and the old geometry would have been fine, which is worth '
      + 'knowing rather than silently passing)');

    ok('and the page threw nothing while being driven',
      d.errs.length === 0, d.errs.slice(0, 3).join(' | '));
  } catch (e) {
    fail++; console.log('  FAIL the driver could not be run   ' + String(e.message).slice(0, 160));
  } finally { if (d) { try { await d.close(); } catch (_e) {} } }

  console.log('\n' + (fail ? 'THE DRIVER REACHES THE CITY: ' + fail + ' FAILED, ' + pass + ' ok'
    : 'THE DRIVER REACHES THE CITY: ' + pass + ' ok, 0 failed'));
  process.exit(fail ? 1 : 0);
})();
