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
   at 8.2 ms each. Both faults have one root -- in SKY, MODE is still 'city', so every
   pointer handler on this page believes it is looking at the city.
   ADDITIVE ON PURPOSE. This is a capture-phase listener that stops the event before the
   city handlers see it, rather than surgery inside a pointer handler four lanes are
   editing. Nothing below duplicates the page's own logic: it steps the existing skyZoom()
   and lets skyZoom's own floor call skyExit(). */
(function(){
  var pts = {}, lastDist = 0, acc = 0, queued = false;

  /* ONE REDRAW PER FRAME. renderSky -> skyValley is a full N x N per-tile loop; the old
     path ran it twice per touch event, which is ~17 ms of work against a 16 ms frame and
     is why iOS killed the page. Coalescing is the entire performance fix. */
  function paint(){
    if(queued) return;
    queued = true;
    requestAnimationFrame(function(){ queued = false; try{ render(); }catch(_e){} });
  }

  function two(){
    var k = Object.keys(pts);
    return k.length >= 2 ? [pts[k[0]], pts[k[1]]] : null;
  }
  function dist(a){
    var dx = a[0].x - a[1].x, dy = a[0].y - a[1].y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function onDown(e){
    if(!SKY) return;
    pts[e.pointerId] = { x:e.clientX, y:e.clientY };
    lastDist = 0; acc = 0;
    e.stopPropagation();          /* the city never learns a finger went down up here */
  }

  function onMove(e){
    if(!SKY) return;
    e.stopPropagation();
    if(!(e.pointerId in pts)) return;
    pts[e.pointerId] = { x:e.clientX, y:e.clientY };
    var a = two(); if(!a) return;            /* one finger in the sky does nothing at all */
    var d = dist(a);
    if(lastDist > 0 && d > 0){
      /* HIS HAND ALREADY KNOWS THIS GESTURE: fingers apart zooms IN (the city does the
         same), and in the sky "in" means back down toward the valley. Fingers together is
         out, and out is up toward the moon. Accumulated in log space so a slow drag is
         smooth instead of notched, and stepped through skyZoom() so the floor check that
         drops him back into the city keeps working untouched. */
      acc += Math.log(d / lastDist);
      /* AND skyZoom ENDS IN render(). One touch move can be several steps, so calling it
         straight would paint the whole valley once PER STEP -- measured at 41 redraws for
         12 touch moves, which is WORSE than the 21 this patch exists to kill. The first
         version of this fix did exactly that and the measurement caught it.
         So the batch runs with render muted and paints ONCE, on the frame. Muting rather
         than editing skyZoom keeps the wheel path and the floor check byte-identical. */
      var real = window.render, stepped = false;
      window.render = function(){};
      try{
        while(Math.abs(acc) >= 0.06){
          var dir = acc > 0 ? 1 : -1;        /* +1 = down to the valley, matching the wheel */
          acc -= dir * 0.06;
          stepped = true;
          skyZoom(dir);
          if(!SKY) break;                    /* skyZoom's own floor dropped us home */
        }
      } finally { window.render = real; }
      if(!SKY){ pts = {}; lastDist = 0; acc = 0; paint(); return; }
      if(stepped) paint();
    }
    lastDist = d;
  }

  function onUp(e){
    if(!SKY){ delete pts[e.pointerId]; return; }
    e.stopPropagation();          /* and so a tap at the moon never selects a city plot */
    delete pts[e.pointerId];
    if(Object.keys(pts).length < 2) lastDist = 0;
  }

  window.addEventListener('pointerdown', onDown, true);
  window.addEventListener('pointermove', onMove, true);
  window.addEventListener('pointerup', onUp, true);
  window.addEventListener('pointercancel', onUp, true);
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
