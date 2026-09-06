#!/usr/bin/env python3
"""
BOHEMIA — THE FIGHT STOPS DRAWING WHEN NOBODY CAN SEE IT
(9/6/26, PLUMBER lane, VAMILY row [fight headroom] THE-FIGHT-HAS-NO-HEADROOM)

The coordinator's routing, after this lane profiled a beat: "PLUMBER [fight
headroom]: get a fighting beat under 400 ms of 500 with the five techniques
above, HIDDEN PANEL FIRST." This is the hidden panel, and it is the free money.

WHAT IS WRONG. The combat frame is created at boot and never stops. It sits on a
panel with display:none, in a box measuring ZERO BY ZERO, and runs its animation
loop at about 60 frames a second with roughly 900 drawImage calls a second into
it, before any fight has ever happened. Measured three times: 3.3%, 2.8% and 3.1%
of one core -- about 15 ms of every 500 ms beat -- drawing something that cannot
be seen, permanently, on every surface, for everybody.

It was found only because a CPU profile of somebody WALKING contained drawField,
which is a fight function.

WHAT THIS CHANGES, AND IT IS ONE LINE OF BEHAVIOUR. draw() returns early when the
frame has no viewport to draw into. That is all.

  - THE SIMULATION IS NOT TOUCHED. Every tick, every beat, every enemy turn runs
    exactly as before. Only the painting is skipped, and only when there is
    provably nothing to paint onto.
  - THE PREDICATE WAS MEASURED, NOT ASSUMED. Inside this frame, innerWidth reads
    0 while the panel is hidden and 390 during a real fight entered through
    cityEncounterIn. Both numbers taken on the real surface before this patch was
    written, because guessing wrong here would freeze every fight in the game
    forever, which is the worst outcome available.
  - THE ORDER OF THE REAL PATH MAKES IT SAFE. cityEncounterIn shows the panel
    FIRST and starts the encounter about 250 ms later, so by the time a fight
    exists the frame has a viewport and draw() runs normally. The guard can never
    be holding when a player is looking.
  - AND IT SELF-HEALS. draw() is called every frame, so the frame that follows
    the panel being shown paints as usual. There is no state to reset and nothing
    to re-arm.

WHY draw() AND NOT THE LOOP. Guarding the loop would also freeze the sim; guarding
one function is the smallest change that takes the whole cost, and it keeps the
clock, the music lock and the beat exactly where they were.

  python3 tools/bohemia_fight_not_on_screen_patch.py
"""
import base64
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

SURFACES = ['slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_DEMO.html']
KEY = "const COMBAT_B64='"

ANCHOR = "function draw(){\n  ctx.setTransform(1,0,0,1,0,0);"

GUARD = """function draw(){
  /* __NOT_ON_SCREEN__ (9/6, PLUMBER, row [fight headroom]). THE FIGHT WAS DRAWING
     WHERE NOBODY COULD SEE IT. This frame is built at boot and never stops: it sits
     on a panel with display:none in a box measuring zero by zero and painted about
     900 images a second into it, before any fight had happened -- measured at 3%
     of a core, 15 ms of every 500 ms beat, permanently, on every surface.
     The SIM is untouched; only the painting stops, and only when there is provably
     nothing to paint onto. innerWidth was MEASURED on the real surface first: 0
     while the panel is hidden, 390 in a fight entered through cityEncounterIn.
     The real path shows the panel BEFORE the encounter starts, so this can never
     be holding while somebody is looking, and draw() runs every frame so the frame
     after the panel appears paints as usual. */
  if(innerWidth<2||innerHeight<2)return;
  ctx.setTransform(1,0,0,1,0,0);"""


def main():
    touched = 0
    for path in SURFACES:
        src = open(path, encoding='utf8').read()
        if KEY not in src:
            print('  %s: no COMBAT_B64, skipped' % path)
            continue
        i0 = src.index(KEY) + len(KEY)
        j0 = src.index("'", i0)
        combat = base64.b64decode(src[i0:j0]).decode('utf8')
        if '__NOT_ON_SCREEN__' in combat:
            print('  %s: already patched' % path)
            continue
        if ANCHOR not in combat:
            print('  %s: ANCHOR NOT FOUND -- refusing to guess' % path)
            sys.exit(1)
        n = combat.count(ANCHOR)
        if n != 1:
            print('  %s: anchor appears %d times, refusing' % (path, n))
            sys.exit(1)
        before = len(combat)
        combat = combat.replace(ANCHOR, GUARD, 1)
        b64 = base64.b64encode(combat.encode('utf8')).decode('ascii')
        open(path, 'w', encoding='utf8').write(src[:i0] + b64 + src[j0:])
        print('  %s: patched (%d -> %d chars in the fight)' % (path, before, len(combat)))
        touched += 1
    print('OK, %d surface(s) patched' % touched)


if __name__ == '__main__':
    main()
