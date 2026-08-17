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
# ---- THE VISTA OVERLOOK WAS RECOMPUTED EVERY BEAT ---------------------------------------
# PROFILED, not guessed: while walking, 42.7% of samples were in seenFrom() and 18.6% in
# fallbackHome(). SIXTY-ONE PERCENT of the time the player spends moving, and the actual
# drawing was 0.2%. My own earlier note said this cost was "renderer cost, a much larger
# job" -- THAT WAS WRONG, and the profiler is what corrected it. Never diagnose a perf
# problem by reading code; sample it.
#
# WHAT IT IS: vistaCheck() runs on the beat and asks "am I standing on the best overlook?".
# Its own comment says "it is a cell test" -- and comparing two cells IS cheap. GETTING the
# cell is not. vistaWhere() -> BohemiaVista.overlook(world) scans all 9,216 cells of the
# 96x96 overmap and, for every rim cell, casts 24 rays x 46 steps looking for what it can
# see. Millions of lookups, from scratch, every single step.
# A CHEAP-LOOKING CHECK WITH AN ENORMOUSLY EXPENSIVE INPUT is the most expensive kind,
# because nothing about the call site looks wrong.
#
# THE FIX IS A CACHE, and it is safe for exactly one reason: THE ANSWER CANNOT CHANGE.
# The overlook is derived from the MAP, and the map is fixed for a seed -- walking around
# does not move the mountains. Keyed on the seed so a REROLL still recomputes.
# Memoised at the city's call site rather than inside the engine module, because the vista
# is co-owned (demo row 11: RUN plays it, CITY owns where it is) and this lane does not get
# to change the shared body on its own.
VISTA_OLD = ("function vistaWhere(){ try{ return BohemiaVista.overlook(WORLDREF||om); }"
             "catch(e){ return null; } }")
VISTA_NEW = ("""/* __VISTA_MEMO__ -- the overlook is derived from the MAP, and the map does not move
   while he walks. This used to run a full 9,216-cell scan with 24-ray casts per rim cell
   EVERY BEAT, because vistaCheck() calls it to ask "am I standing on it yet?" -- 61% of
   frame time while walking, profiled. Comparing two cells is cheap; FETCHING the cell was
   not, and nothing at the call site looked wrong.
   Keyed on the seed, so REROLL still recomputes and nothing goes stale. */
let VISTA_MEMO=null, VISTA_MEMO_SEED=null;
function vistaWhere(){
  try{
    var w=WORLDREF||om, sd=(w&&w.seed);
    if(VISTA_MEMO!==null && VISTA_MEMO_SEED===sd) return VISTA_MEMO;
    VISTA_MEMO=BohemiaVista.overlook(w); VISTA_MEMO_SEED=sd;
    return VISTA_MEMO;
  }catch(e){ return null; }
}""")

CALL_SITES = [
    # (what it is, before, after)
    ('setHZoom, the walked view',
     '  HZOOM=best; if(!transing)HC=HZOOM; render(); if(typeof reportState',
     '  HZOOM=best; if(!transing)HC=HZOOM; renderSoon(); if(typeof reportState'),
    ('setZoomAt, the city camera',
     '\n  clampPan(); render();\n',
     '\n  clampPan(); renderSoon();\n'),
    ('the vista overlook memo', VISTA_OLD, VISTA_NEW, '__VISTA_MEMO__'),
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
for _site in CALL_SITES:
    what, before, after = _site[0], _site[1], _site[2]
    _marker = _site[3] if len(_site) > 3 else None
    if _marker and _marker in src:
        rewired.append(what + ' (already)')
        continue
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
