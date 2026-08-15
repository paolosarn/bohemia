#!/usr/bin/env python3
"""
THE MOON ZOOM ON HIS PHONE (8/15/26, WORLD lane) -- P0, HIS OWN BUG REPORT.

    "the zoom out didn't work, once I started to leave the city it kind of crashed."
                                                            -- Paolo, 8/13, his own phone

Routed to this lane on 8/13 as TOP OF QUEUE and still open on the demo board. MEASURED
FIRST, on a real touch device (Playwright + CDP Input.dispatchTouchEvent, iPhone viewport),
because the 7/18 law says verify on the real surface and the wheel path WORKED -- which is
exactly how a desktop-verified feature ships broken to his hand:

    DID_THE_PINCH_MOVE_THE_SKY : false        <- "the zoom out didn't work"
    renders during one pinch   : 21           <- for TEN touch moves. 2.1 per move.
    cost of one sky render     : 8.2 ms       <- on a fast desktop. His phone is worse.

So a single pinch asks for ~17 ms of full-valley redraw PER TOUCH EVENT, on a 16 ms frame
budget, and iOS Safari kills the page. "It kind of crashed."

THREE FAULTS, ONE ROOT: IN SKY, `MODE` IS STILL 'city'. Every pointer handler therefore
believes it is looking at the city.
  1. NOTHING ON TOUCH ADVANCES THE SKY. skyZoom() is called from the wheel handler and
     nowhere else. On a phone the gesture is a pinch, and the pinch path never checks SKY,
     so crossing the seam strands him at SKYU=0 forever.
  2. THE FREEZE. The pinch branch runs setZoomAt() AND the pan branch, each calling
     render(), and render() in SKY is renderSky() -> skyValley(), a full N x N per-tile
     loop. Two of those per touch event.
  3. TAP-THROUGH. up() fires cityTapPlot() whenever MODE==='city', so a tap at the moon
     selects an invisible city plot underneath and renders again.

THE FIX, and it is deliberately ADDITIVE rather than surgery on a pointer handler four
lanes are editing: one capture-phase listener on window. When SKY is true it stops the
event before the city handlers ever see it, and does the sky thing instead.
  PINCH DRIVES THE SKY, and in the direction his hand already learned: fingers together is
    zoom out is UP toward the moon; fingers apart is zoom in is back DOWN. Accumulated as a
    log-ratio so it is continuous rather than notched, stepping the EXISTING tested
    skyZoom() rather than reaching into SKYU by hand.
  ONE REDRAW PER FRAME, requestAnimationFrame-coalesced. Ten touch moves in a frame collapse
    to one sky render, which is the difference between 17 ms per event and 8 ms per frame.
  NOTHING FALLS THROUGH: no city zoom, no city pan, no plot tap, while the sky is up.
  AND THE WAY DOWN STILL WORKS: pinching in past the valley calls skyExit() through
    skyZoom's own existing floor check, so the same gesture carries him both ways.

REUSE CHECK: cooks ZERO pixels, opens no bank, adds no table. Uses the page's own skyZoom,
skyExit and renderSky, and does not duplicate one line of their logic.

RE-RUNNABLE, DELIMITED, WITH LEGACY_MARKS ready -- renaming the payday block orphaned it on
8/15 and left a stale copy winning at runtime, so every block this lane writes is swept.

  python3 tools/bohemia_city_sky_touch_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '/* ==== THE MOON ZOOM ON HIS PHONE (sky touch) ==== */'
ENDMARK = '/* ==== end THE MOON ZOOM ON HIS PHONE ==== */'
LEGACY_MARKS = []          # add ('old start','old end') here if this block is ever renamed

JS = """%s
/* __SKY_ON_TOUCH__ -- P0, Paolo 8/13 on his own phone: "the zoom out didn't work, once I
   started to leave the city it kind of crashed." Measured before touching anything: the
   pinch never moved SKYU at all, and ten touch moves fired TWENTY-ONE full-valley redraws
   at 8.2 ms each. Both faults had one root -- in SKY, MODE is still 'city', so every
   pointer handler on this page believes it is looking at the city.

   *** REWRITTEN 8/15 AFTER HE REPORTED IT STILL BROKEN: "I can't zoom out all the way from
   my location all the way to the moon." He was right, and the first version was the cause.
   IT KEPT ITS OWN MODEL OF HIS FINGERS -- a `pts` map and a `down` counter maintained from
   pointerdown/pointerup. That model DRIFTS. A pointerdown that lands while SKY is still
   false (which is exactly what happens: the sky opens PART-WAY THROUGH the gesture that
   opens it) never registers, an up can be missed, and once the model disagrees with reality
   the sky stops responding entirely. Measured: identical input, one probe reached the MOON
   and another sat at zero across three consecutive runs. Flaky, not dead -- which is why it
   passed its own gate and still failed in his hand.
   THE FIX IS TO STOP KEEPING A MODEL. TouchEvent.touches IS the authoritative live list of
   fingers on the glass, supplied fresh with every event. Read it, do not mirror it. Nothing
   to desynchronise, and the case that broke it -- fingers already down when the sky opens --
   now just works, because the next touchmove already carries both of them.
   (Same lesson as the rest of this build: derive it, never hand-maintain it.) */
(function(){
  var lastDist = 0, acc = 0, queued = false;

  /* ONE REDRAW PER FRAME. renderSky -> skyValley is a full N x N per-tile loop; the old
     path ran it twice per touch event, ~17 ms against a 16 ms frame, which is why iOS
     killed the page. */
  function paint(){
    if(queued) return;
    queued = true;
    requestAnimationFrame(function(){ queued = false; try{ render(); }catch(_e){} });
  }

  function spread(t){
    if(!t || t.length < 2) return 0;
    var dx = t[0].clientX - t[1].clientX, dy = t[0].clientY - t[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /* THE POINTER SIDE EXISTS ONLY TO KEEP THE CITY OUT. While the sky is up the city must
     not zoom, pan, or select a plot underneath it -- MODE is still 'city' up there, so every
     one of its handlers would happily act. It does no arithmetic and holds no state. */
  function block(e){ if(SKY) e.stopPropagation(); }
  window.addEventListener('pointerdown', block, true);
  window.addEventListener('pointermove', block, true);
  window.addEventListener('pointerup', block, true);
  window.addEventListener('pointercancel', block, true);

  /* THE SKY SIDE READS THE EVENT AND NOTHING ELSE. */
  window.addEventListener('touchmove', function(e){
    if(!SKY){ lastDist = 0; acc = 0; return; }
    var d = spread(e.touches);
    if(!d){ lastDist = 0; return; }          /* fewer than two fingers: nothing to zoom with */
    if(lastDist > 0){
      /* HIS HAND ALREADY KNOWS THIS GESTURE: fingers together is out and up toward the moon,
         apart is in and back down. Accumulated in log space so a slow drag is smooth rather
         than notched, and stepped through the EXISTING skyZoom so its own floor -- the one
         that drops him back into the valley -- keeps working untouched. */
      acc += Math.log(d / lastDist);
      var real = window.render, stepped = false;
      window.render = function(){};          /* skyZoom ends in render(); batch, paint once */
      try{
        while(Math.abs(acc) >= 0.06){
          var dir = acc > 0 ? 1 : -1;        /* +1 = down to the valley, matching the wheel */
          acc -= dir * 0.06;
          stepped = true;
          skyZoom(dir);
          if(!SKY) break;
        }
      } finally { window.render = real; }
      if(stepped) paint();
      if(!SKY){ lastDist = 0; acc = 0; return; }
    }
    lastDist = d;
  }, true);

  window.addEventListener('touchend', function(e){
    if(!e.touches || e.touches.length < 2){ lastDist = 0; acc = 0; }
  }, true);
})();
%s""" % (MARK, ENDMARK)

if not os.path.exists(WORLD):
    sys.exit('SKY TOUCH: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()


def cut(text, a_mark, b_mark, what):
    n = 0
    while a_mark in text:
        a = text.find(a_mark)
        b = text.find(b_mark, a)
        if b < 0:
            sys.exit('SKY TOUCH: %s has a start and no end. Refusing to guess.' % what)
        text = text[:a] + text[b + len(b_mark):]
        n += 1
    return text, n


src, refreshed = cut(src, MARK, ENDMARK, 'the sky touch block')
for _m, _e in LEGACY_MARKS:
    src, _n = cut(src, _m, _e, 'a legacy block')

# AFTER skyZoom/skyExit exist, anchored on skyExit's own definition rather than a line
# number. The listener only ever runs on a real gesture, so the anchor just has to be
# somewhere both functions are already defined.
ANCHOR = 'function skyExit(){'
i = src.find(ANCHOR)
if i < 0:
    sys.exit('SKY TOUCH: could not find skyExit to attach after.')
j = src.find('\n', i) + 1
src = src[:j] + JS + '\n' + src[j:]

open(WORLD, 'w', encoding='utf-8').write(src)
print('SKY TOUCH: %s the pinch-drives-the-sky path in %s'
      % ('REFRESHED' if refreshed else 'added', WORLD))
print('    measured before: pinch moved the sky NOT AT ALL, and 10 touch moves fired 21')
print('    full-valley redraws at 8.2 ms each. That was the freeze he felt.')
