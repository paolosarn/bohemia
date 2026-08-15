#!/usr/bin/env python3
"""
ONE PAINT PER FRAME WHILE HE PINCHES (8/15/26, WORLD lane) — THE SECOND ATTEMPT.

MEASURED BY gates/frame_budget_gate.js, the repo's first perf gauge:

    pinch-zoom WHILE WALKING : 2.08 full redraws per touch move, ~23 ms each

~49 ms of painting per finger movement, THREE FRAMES at 60 Hz, during the most common
gesture in the game. setHZoom() ends in render(), render() runs once per POINTER EVENT, and
a two-finger pinch dispatches TWO pointermove events per visual step. setHZoom is not wrong;
two fingers is what makes it expensive.

*** THE FIRST ATTEMPT FAILED AND THIS ONE EXISTS BECAUSE OF WHAT IT MEASURED. ***
That version wrapped the page from OUTSIDE: a capture-phase listener that swapped
window.render for a queueing stub during the gesture. Measured, it was WORSE (3.08 per
move). Instrumented, the reason was flat:

    the listener fired 24 times, muted 24 times, AND ITS STUB WAS CALLED ZERO TIMES.

The page's internal render() calls do not resolve through window.render, so nothing outside
can intercept a paint. THE COALESCING HAS TO LIVE INSIDE THE PAGE'S OWN RENDER PATH. That is
what this does: one helper in the page's own scope, and ONE call site changed.

WHAT CHANGES: setHZoom's `render()` becomes `renderSoon()`. While two fingers are down, the
paint is queued to the next animation frame and repeated requests inside that frame collapse
into one. With fewer than two fingers it calls render() straight through, so every other
path in the app -- taps, drags, the day loop, the mode seam -- is byte-for-byte unchanged.

WHAT DOES NOT CHANGE, and this is the important half: the ZOOM ITSELF. HZOOM and HC are
still assigned on every single event, so the zoom still lands on exactly the same pixel-true
stop, swapMode still owns the seam, and reportState still fires per event. Only the number
of times the valley is PAINTED on the way there changes. It throttles painting, never the
simulation: a dropped paint is a frame the eye never needed, a dropped step would be the
game lying to him.

REUSE CHECK: cooks ZERO pixels, opens no bank, adds no table. Uses the page's own render()
and the same coalescing shape already proven in tools/bohemia_city_sky_touch_patch.py.

RE-RUNNABLE, DELIMITED, LEGACY_MARKS ready. The call-site edit is idempotent: it rewrites
`render()` to `renderSoon()` on that one line only, and re-running finds it already done.

  python3 tools/bohemia_city_frame_budget_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '/* ==== ONE PAINT PER FRAME WHILE HE PINCHES ==== */'
ENDMARK = '/* ==== end ONE PAINT PER FRAME ==== */'
LEGACY_MARKS = []

CALL_OLD = '  HZOOM=best; if(!transing)HC=HZOOM; render(); if(typeof reportState'
CALL_NEW = '  HZOOM=best; if(!transing)HC=HZOOM; renderSoon(); if(typeof reportState'

JS = """%s
/* __FRAME_BUDGET__ -- renderSoon(): one paint per frame while two fingers are down.
   MEASURED, NOT GUESSED (gates/frame_budget_gate.js): pinch-zoom WHILE WALKING cost 2.08
   full redraws per touch move at ~23 ms each -- about 49 ms per finger movement, three
   frames at 60 Hz, in the most common gesture in the game.
   IT LIVES HERE, IN THE PAGE'S OWN SCOPE, BECAUSE THE FIRST ATTEMPT LIVED OUTSIDE AND DID
   NOTHING: a capture-phase listener swapped window.render for a stub, fired 24 times, muted
   24 times, and its stub was called ZERO times. The page's internal render() calls do not
   resolve through window.render. A paint can only be coalesced from inside the paint path.
   IT THROTTLES PAINTING, NEVER THE SIMULATION. HZOOM and HC are still assigned on every
   event by the caller, so the zoom lands on the same pixel-true stop and the mode seam is
   untouched -- only the number of paints on the way there changes. A dropped paint is a
   frame the eye never needed; a dropped step would be the game lying. */
var _fbFingers = 0, _fbQueued = false;
window.addEventListener('pointerdown', function(){ _fbFingers++; }, true);
window.addEventListener('pointerup', function(){ _fbFingers = Math.max(0, _fbFingers - 1); }, true);
window.addEventListener('pointercancel', function(){ _fbFingers = Math.max(0, _fbFingers - 1); }, true);

function renderSoon(){
  /* ONE FINGER IS NOT THE PROBLEM. A drag already paints once per event, which is correct;
     the doubling is purely a two-finger artefact, so single-touch behaviour is left exactly
     as it was rather than quietly changing something that was never measured. */
  if(_fbFingers < 2){ render(); return; }
  if(_fbQueued) return;
  _fbQueued = true;
  requestAnimationFrame(function(){
    _fbQueued = false;
    try{ render(); }catch(_e){}
  });
}
%s""" % (MARK, ENDMARK)

if not os.path.exists(WORLD):
    sys.exit('FRAME BUDGET: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()


def cut(text, a_mark, b_mark, what):
    n = 0
    while a_mark in text:
        a = text.find(a_mark)
        b = text.find(b_mark, a)
        if b < 0:
            sys.exit('FRAME BUDGET: %s has a start and no end. Refusing to guess.' % what)
        text = text[:a] + text[b + len(b_mark):]
        n += 1
    return text, n


src, refreshed = cut(src, MARK, ENDMARK, 'the frame budget block')
for _m, _e in LEGACY_MARKS:
    src, _n = cut(src, _m, _e, 'a legacy block')

# The helper must be DEFINED before setHZoom's body runs. `function renderSoon` hoists, but
# the block is placed just above setHZoom anyway so the two read together.
ANCHOR = 'function setHZoom(z){'
i = src.find(ANCHOR)
if i < 0:
    sys.exit('FRAME BUDGET: could not find setHZoom to attach beside.')
src = src[:i] + JS + '\n' + src[i:]

# THE ONE CALL SITE. Idempotent: already-patched pages simply have CALL_NEW.
if CALL_OLD in src:
    src = src.replace(CALL_OLD, CALL_NEW, 1)
    rewired = True
elif CALL_NEW in src:
    rewired = True
else:
    sys.exit('FRAME BUDGET: setHZoom does not end in the render() call this expects. '
             'Refusing to guess which paint to coalesce.')

open(WORLD, 'w', encoding='utf-8').write(src)
print('FRAME BUDGET: %s renderSoon() and rewired setHZoom in %s'
      % ('REFRESHED' if refreshed else 'added', WORLD))
print('    measured before: 2.08 full redraws per touch move, ~23 ms each, while WALKING')
