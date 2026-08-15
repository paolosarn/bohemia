#!/usr/bin/env python3
"""
ONE PAINT PER FRAME WHILE HE PINCHES (8/15/26, WORLD lane) — BOTH VIEWS.

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

# THE CALL SITES, ONE PER PAINT THAT A TWO-FINGER GESTURE MULTIPLIES.
#
# MEASURED, both views, real touch, iPhone viewport:
#   walking, pinch  : 2.08 redraws per touch move   (setHZoom paints once per pointer event,
#                                                    and a pinch is two events per step)
#   city, one-finger pan : 1.00 per move            <- already correct, left alone
#   city, PINCH     : 4.00 redraws per touch move   <- ~86 ms per finger movement, FIVE
#                                                      frames at 60 Hz, and the worst number
#                                                      measured anywhere in the game
# THE CITY PINCH IS FOUR because its branch calls setZoomAt() AND the pan branch, and EACH
# ends in render() -- exactly what the 8/13 P0 diagnosis said about the sky, in the view he
# BUILDS in. Two paints per pointer event, two pointer events per visual step.
# The single-finger drag is deliberately untouched at 1.00: it was never the problem, and
# quietly changing something that was never measured is how a perf pass breaks a feel.
CALL_SITES = [
    # (what it is, before, after)
    ('setHZoom, the walked view',
     '  HZOOM=best; if(!transing)HC=HZOOM; render(); if(typeof reportState',
     '  HZOOM=best; if(!transing)HC=HZOOM; renderSoon(); if(typeof reportState'),
    ('setZoomAt, the city camera',
     '\n  clampPan(); render();\n',
     '\n  clampPan(); renderSoon();\n'),
    ('the city pinch pan branch',
     '      if(lastMid){ panX+=m.x-lastMid.x; panY+=m.y-lastMid.y; clampPan(); render(); }',
     '      if(lastMid){ panX+=m.x-lastMid.x; panY+=m.y-lastMid.y; clampPan(); renderSoon(); }'),
]

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

# EVERY CALL SITE, IDEMPOTENTLY. An already-patched page simply has the NEW form. A site
# that matches NEITHER is a refusal, never a shrug: it means the paint this exists to
# coalesce has moved, and guessing which render() to rewrite is how a perf pass breaks
# something nobody measured.
rewired = []
for what, before, after in CALL_SITES:
    if before in src:
        src = src.replace(before, after, 1)
        rewired.append(what)
    elif after in src:
        rewired.append(what + ' (already)')
    else:
        sys.exit('FRAME BUDGET: could not find the paint for %r. Refusing to guess which '
                 'render() to coalesce.' % what)

open(WORLD, 'w', encoding='utf-8').write(src)
print('FRAME BUDGET: %s renderSoon() in %s' % ('REFRESHED' if refreshed else 'added', WORLD))
for w in rewired:
    print('    coalesced:', w)
print('    measured before: walking pinch 2.08, CITY pinch 4.00 redraws per touch move')
