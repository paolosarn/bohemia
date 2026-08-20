#!/usr/bin/env python3
"""
HIS 348-SPRITE TRAFFIC SIGNAL SET DRAWS ZERO TIMES, AT 274 REAL INTERSECTIONS.
(8/20, WORLD lane.)

gates/traffic_signal_gate.js has been red for weeks with two failures nobody had diagnosed:
"the world model finds intersections" and "A SIGNAL IS ACTUALLY ON SCREEN AT AN INTERSECTION
(0 draws)". MEASURED on the running page, scanning a 40x40 cell window:

    road-district cells (arterial 375, freeway 193)      568
    cells where m.road is TRUE                             0
    intersections found using m.road                       0
    intersections found using the DISTRICT TYPE          274
    signal sprites drawn                                   0

*** ONE FLAG WAS CARRYING TWO MEANINGS, AND WHEN THE SECOND CHANGED THE FIRST WAS LOST. ***
`m.road` meant BOTH of these at once:
    IDENTITY     this cell is a road
    INSTRUCTION  draw it with the parametric XSEC drawer
It is born as `road:!!RD[d]` -- pure identity, straight off the road-district registry.
Then A ROAD WITH ITS OWN MODULE DRAWS ITSELF (8/18-8/19): when a road is routed through
__kitGrid so it gets its tiles from its own generator, that branch correctly turns the
parametric drawer off with `m.road=false` -- and every road in the valley silently stopped
being a road as far as anything downstream was concerned.

sigPass is the victim and its own comment says exactly why it trusted the flag:
    "AN INTERSECTION IS A ROAD TILE THAT TURNS ... tileMeta already computes exactly those
     four booleans for the edge-matching law, so this reuses the city's own notion of the
     road network instead of inventing one."
That was RIGHT. Reusing the world's own notion is the correct instinct and it is what this
repo asks for everywhere. The notion was then quietly repurposed underneath it.

This is the gypsum:7 finding again in a different system -- one code meaning "the crest of a
bench" AND "the shell of the dome", so the tile could be neither. A flag that answers two
questions answers neither the day they diverge.

THE FIX IS ADDITIVE AND CHANGES NO ROAD PIXEL:
  1. `m.isRoad` is set once, at construction, from the same registry `m.road` is born from,
     and NOTHING ever clears it. Identity gets its own flag.
  2. sigPass asks `isRoad` instead of `road`, because it wants to know whether this is a
     road, not who drew it.
`m.road` keeps its instruction meaning exactly as the road lanes use it, so the parametric
drawer and the kit routing are untouched. This does not edit a road generator, a cross
section, or the KIT_ROAD registry -- it stops a consumer asking the wrong question.

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks no pixels and opens no bank. The 348 sprites
are already his, already in banks/BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_7_17_26.txt, already
loaded in the browser (the gate's own "his sprites are LOADED" check has been green the
whole time). Nothing here draws anything new; it lets what he approved reach the screen.

  python3 tools/bohemia_city_signal_road_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__A_ROAD_IS_STILL_A_ROAD__'

# 1) IDENTITY GETS ITS OWN FLAG, at the one place the meta object is built.
BORN_OLD = "  m={t,d,q,road:!!RD[d],open:!!OPEN[d],vx:-1,hz:-1,rects:[],lot:null};"
BORN_NEW = ("  m={t,d,q,road:!!RD[d],open:!!OPEN[d],vx:-1,hz:-1,rects:[],lot:null};\n"
            "  /* __A_ROAD_IS_STILL_A_ROAD__ -- `road` above is doing TWO jobs: it says this cell\n"
            "     IS a road (identity, straight off RD[]) and it says DRAW IT PARAMETRICALLY\n"
            "     (instruction). When a road got its own module the routing correctly turned the\n"
            "     instruction off with `m.road=false`, and every road in the valley stopped being\n"
            "     a road as far as everything downstream could tell. MEASURED: 568 road cells, 0\n"
            "     with m.road true, 274 real intersections, and his 348-sprite signal set drawing\n"
            "     ZERO times. A flag that answers two questions answers neither the day they\n"
            "     diverge -- the same shape as gypsum:7 meaning a bench lip AND a dome shell.\n"
            "     So identity gets its own flag and NOTHING ever clears it. `road` keeps its\n"
            "     instruction meaning exactly as the road lanes use it. */\n"
            "  m.isRoad=!!RD[d];")

# 2) THE CONSUMER ASKS THE RIGHT QUESTION.
SIG_OLD = "    if(!mm.road||!((mm.N||mm.S)&&(mm.E||mm.W)))continue;"
SIG_NEW = ("    /* __A_ROAD_IS_STILL_A_ROAD__ -- `isRoad`, not `road`. This wants to know whether\n"
           "       the cell IS a road, not whether the parametric drawer is the one drawing it,\n"
           "       and asking the second question is why his signals vanished from 274\n"
           "       intersections the day the roads started drawing themselves. */\n"
           "    if(!mm.isRoad||!((mm.N||mm.S)&&(mm.E||mm.W)))continue;")

if not os.path.exists(WORLD):
    sys.exit('SIGNAL ROAD PATCH: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()
refreshed = MARK in src

# RE-RUNNABLE. Both edits are pure replacements of anchors that still exist, so a failed
# reversal cannot duplicate anything -- the anchor simply goes missing and this exits loud.
for _new, _old in ((BORN_NEW, BORN_OLD), (SIG_NEW, SIG_OLD)):
    if _new in src:
        src = src.replace(_new, _old, 1)

for name, old in (('the tileMeta meta-object construction', BORN_OLD),
                  ('the intersection test in sigPass', SIG_OLD)):
    if old not in src:
        sys.exit('SIGNAL ROAD PATCH: could not find %s. Refusing to guess -- a wrong edit '
                 'here either hides every signal in the valley or puts one on every tile.'
                 % name)

src = src.replace(BORN_OLD, BORN_NEW, 1)
src = src.replace(SIG_OLD, SIG_NEW, 1)

open(WORLD, 'w', encoding='utf-8').write(src)
print('SIGNAL ROAD: %s -- a road is still a road after it draws itself'
      % ('REFRESHED' if refreshed else 'applied'))
print('    m.isRoad is identity and nothing clears it; m.road keeps its drawing meaning')
print('    sigPass asks isRoad, so his 348 sprites reach the intersections again')
