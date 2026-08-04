#!/usr/bin/env python3
"""
THE RUN TAB OPENS IN HUMAN MODE, WHERE YOU LIVE (Paolo 8/2/26).

  "I couldn't find them can you make sure when I press the run tab it just
   starts me off where I should start off exactly where I should and not in
   city mode. I'd rather start off in human mode rather than city mode, please"

WHAT HE WAS ACTUALLY SEEING, measured on the real surface before touching
anything (tap the splash, tap RUN, ask the city frame what it is):

    visible panel : p-city
    MODE          : "city"          HUD read CITY MODE
    player        : hx=0, hy=0      never placed at all

So the RUN tab dropped him into the zoomed-out city builder looking at the
overview, with the walked player sitting at the origin of a 12288x12288 world.
He could not find the neighbour standing outside his front door because he was
never standing outside his front door.

AND THAT IS ALSO WHY THE PEOPLE LANE'S WORK LOOKED MISSING. The RUN tab shows
p-city; #p-run (BOHEMIA_RUN_CURRENT.html, where the identity card, asking a
name, the name over their head and the porch neighbour all live) is
display:none the whole time. The alpha's own source says so in a comment. Every
one of this lane's gates drives that FILE directly, so they were all green about
a surface he cannot reach. That is the 7/18 law - VERIFY ON THE REAL SURFACE -
catching this lane out, and the fix belongs in the city frame because the city
frame is the surface.

WHAT THIS DOES. One drop-in at boot, right after the city frame finishes its
first layout: if it is still in city mode, call the app's OWN swapMode() once.
Nothing here reimplements anything -
  - swapMode already derives the walked player from city.x/city.y, which the
    WORKING_DISTRICT spawn (tools/bohemia_run_spawn.py) has already pointed at
    the district we are building
  - swapMode already prefers to land you ON A ROAD rather than behind a house
    in a walled subdivision (Paolo 8/1, NO DISTRICT IS A PRISON)
  - HC=HZOOM is the same pair applyRestore() sets when it restores a human-mode
    save, so the walk zoom is the one the player last chose
A SAVED POSITION STILL WINS: applyRestore() arrives by message after boot and
sets MODE/hx/hy itself, so this only decides where a FRESH run opens.

The CITY view is not taken away from him - it is one tap on ⤒ CITY, and pinching
out at the widest walk stop still crosses the zoom seam into it (ZOOM SEAM law,
8/2). This only changes which side of that seam the tab OPENS on.

REUSE CHECK: cooks no graphic pixels and opens no bank. Pure plumbing - it moves
a camera, it designs nothing (MAP LAW: Claude never designs map layouts).

Idempotent: the block is marker-fenced and a re-run reports NOOP.
Gate: gates/human_start_gate.js

THE CITY MOVED HOUSE ON 8/4: it used to be a base64 constant inside the alpha
(CITY_B64) and the CITY lane extracted it to slices/BOHEMIA_CITY_WORLD.html so
the alpha opens 29x faster. This tool's edits were already applied when that
extraction happened, so they travelled into the new file intact - but the tool
itself would crash on a re-run looking for CITY_B64. It reads the standalone
file now: a plain text edit, no decode/encode, which is strictly better.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__HUMAN_START__'
ANCHOR = 'updHud(); fit();\n'

BLOCK = """updHud(); fit();
/* """ + MARKER + """ (Paolo 8/2: "I'd rather start off in human mode rather than
   city mode... starts me off where I should start off exactly where I should").
   MEASURED BEFORE THIS EXISTED: tapping RUN gave MODE='city' with the walked
   player at hx=0,hy=0 - the zoomed-out overview, and a person who had never been
   placed anywhere in a 12288x12288 world.
   This calls the app's OWN swapMode() once, so everything it already knows still
   applies: the player comes from city.x/city.y (which WORKING_DISTRICT has
   already aimed at the district we are building) and it prefers to land him ON A
   ROAD rather than behind a house in a walled subdivision (NO DISTRICT IS A
   PRISON, 8/1). HC=HZOOM is the same pair applyRestore uses for a human save.
   A SAVED POSITION STILL WINS: applyRestore arrives by message after boot.
   The city view is one tap away on the mode button, and the zoom seam still
   crosses into it by pinching out. This only picks the side we OPEN on. */
(function(){ try{
  if(typeof MODE!=='undefined' && MODE==='city' && typeof swapMode==='function'){
    swapMode(); HC=HZOOM; render();
  }
}catch(_hs){} })();
"""


# --------------------------------------------------------------------------
# AND THE THING THAT WAS UNDOING IT. Opening in human mode was not enough: the
# frame came up human and then flipped straight back to city. Measured by
# logging every message the frame receives:
#     ["BOHEMIA_CITY_PLAYER","BOHEMIA_CITY_PLAYER","BOHEMIA_GOTO_CELL"]
# BOHEMIA_GOTO_CELL's handler ended with an unconditional MODE='city'.
#
# That line was RIGHT when it was written and is wrong now. It comes from Paolo
# 7/28 - "I want that reflected when I'm in the city menu" - back when RUN and
# CITY were two different tabs: you walked in the run, opened the city, and the
# marker was where you had walked to. The alpha fires cityGoToRunCell() on
# city-tab open, and now that the RUN TAB IS THE CITY FRAME that fires every
# single time he taps RUN, yanking him out of his body to the overview.
#
# His ruling was about the MARKER, never about the mode. So the camera still
# moves and the mode is left alone: in city mode you see the marker move, in
# human mode you stay in your body.
# --------------------------------------------------------------------------
GOTO_OLD = ("    MODE='city'; window.__BOH_LAST_GOTO=[city.x,city.y];\n")
GOTO_NEW = (
    "    /* __HUMAN_START__ (8/2): the marker moves, THE MODE IS THE PLAYER'S.\n"
    "       This line used to be `MODE='city'; ...` and it was correct when RUN and\n"
    "       CITY were separate tabs (Paolo 7/28, \"I want that reflected when I'm in\n"
    "       the city menu\" - about the MARKER). The alpha fires cityGoToRunCell() on\n"
    "       city-tab open, and now that the RUN TAB IS THIS FRAME it fired every time\n"
    "       he tapped RUN and threw him out of his body to the overview. */\n"
    "    window.__BOH_LAST_GOTO=[city.x,city.y];\n")


def main():
    city = open(CITY, encoding='utf8', errors='ignore').read()

    if MARKER in city:
        print('NOOP: the run tab already opens in human mode'); return 0
    n = city.count(ANCHOR)
    if n != 1:
        print('FAIL: the boot anchor resolves %d times, not 1' % n); return 1
    g = city.count(GOTO_OLD)
    if g != 1:
        print('FAIL: the GOTO_CELL mode line resolves %d times, not 1' % g); return 1

    city = city.replace(GOTO_OLD, GOTO_NEW, 1)
    city = city.replace(ANCHOR, BLOCK, 1)
    open(CITY, 'w', encoding='utf8').write(city)
    print('wrote %s' % CITY)
    print('  the RUN tab now opens in HUMAN MODE at the working district')
    return 0


if __name__ == '__main__':
    sys.exit(main())
