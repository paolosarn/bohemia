#!/usr/bin/env python3
"""
THE FLOOR COULD DO SOMETHING TO YOU EVERYWHERE EXCEPT WHERE THE FIGHTS ARE. (8/20, WORLD.)

engine/bohemia_hazard.js reads 31 hazard tiles out of 22 district legends -- drained pools,
talus, leachate, ballast, and four real voids since this morning. All of it OUTDOORS.
Meanwhile __CITY_FIGHT__ starts every fight in this game by walking through a door, and the
room on the other side has never had any ground at all.

MEASURED before this patch: a floorplan cell carries `g, room, door, role, furn` and NOTHING
ELSE. Zero interior cells in the game have ever carried terrain, so cityFightRoom's `ground`
channel is 320 dots for a 20x16 room, in every room, in every fight. The one system built to
answer "a room only feels alive if the floor can do something to you" was switched off in
every room a fight happens in.

WHAT THIS WIRES, and it is deliberately the same shape as the furniture pass beside it:
  1. engine/bohemia_interior_ground.js inlined, so the page can call it at all. That module
     invents no vocabulary -- its three materials are named so that the EXISTING hazard
     rules classify them with no new rule (standing water -> DISABLES, fallen ceiling rubble
     -> AMPLIFIES, lift shaft -> KILLS, and the shaft is a VOID per 8/20).
  2. The pass itself, in inEnter, immediately after the furniture and BEFORE anything reads
     the plate -- because the fight-room payload and the renderer both read these cells.
  3. EVERY LEVEL, not just the ground one. A fight upstairs is still a fight, and levels[0]
     is a VIEW sharing the plate's grid by reference, so grounding the level grounds the
     cells the renderer reads. Same reasoning as the furniture pass, same code shape.

THE ZONE IS PASSED IN AND IT MATTERS: a house has no lift, so the only lethal thing in this
module is refused in residential plans by zone rather than by room name (`service` means
something different in a home).

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks no pixels, opens no bank, adds no tile bank and
no table. It inlines one module and adds one call next to an existing one. The materials are
classified by rules that already existed and ride a channel that already existed.

  python3 tools/bohemia_city_interior_ground_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
MOD = 'engine/bohemia_interior_ground.js'
MARK = '__INTERIOR_GROUND_PASS__'

# THE ANCHOR IS THE FURNITURE PASS, because this must run AFTER it: the ground pass refuses
# to put a hole under a filing cabinet, and it can only refuse what has already been placed.
# Anchoring on the furniture pass rather than on the generate() call is what makes that
# ordering a property of the file instead of a hope.
ANCHOR = ("  try{ if(typeof BohemiaFurnish!=='undefined'){\n"
          "    const lv=(fp.levels&&fp.levels.length)?fp.levels:[fp];\n"
          "    for(let L=0;L<lv.length;L++) BohemiaFurnish.furnish(lv[L],(seed>>>0)+L*7919);\n"
          "  } }catch(_e){}")

CALL = ("""
  /* __INTERIOR_GROUND_PASS__ -- THE FLOOR, INDOORS, WHERE THE FIGHTS ACTUALLY ARE.
     The hazard classes have covered the valley since 8/18 and covered NOTHING inside a
     building: a floorplan cell carried g/room/door/role/furn and no terrain at all, so the
     fight payload's ground channel was 320 dots for every room in every fight. Every fight
     in this game starts by walking through a door.
     AFTER THE FURNITURE, ON PURPOSE. The ground pass refuses to open a shaft under a
     filing cabinet, and it can only refuse what is already there.
     EVERY LEVEL: a fight upstairs is still a fight, and levels[0] is a VIEW sharing this
     plate's grid by reference, so grounding the level grounds the cells the renderer and
     the payload both read. */
  try{ if(typeof BohemiaInteriorGround!=='undefined'){
    const gz=(INSIDE&&INSIDE.zone)||null;
    const gl=(fp.levels&&fp.levels.length)?fp.levels:[fp];
    for(let L=0;L<gl.length;L++) BohemiaInteriorGround.ground(gl[L],gz);
  } }catch(_e){}""")

MOD_S = '/* ==== THE FLOOR INDOORS (inlined verbatim) ==== */'
MOD_E = '/* ==== end THE FLOOR INDOORS ==== */'
# It must be defined before inEnter runs. bohemia_furnish.js is inlined for exactly the same
# reason, so landing beside it puts both on the same side of every ordering question.
MOD_ANCHOR = '/* ==== WHAT IS IN THE ROOM (inlined verbatim) ==== */'

if not os.path.exists(WORLD):
    sys.exit('INTERIOR GROUND PATCH: %s is not here.' % WORLD)
if not os.path.exists(MOD):
    sys.exit('INTERIOR GROUND PATCH: %s is missing.' % MOD)
src = open(WORLD, encoding='utf-8').read()
refreshed = MARK in src

# RE-RUNNABLE FROM THE FIRST DAY. Two of this lane's own patch tools shipped with
# `if MARK in src: already applied; exit(0)` and their output FROZE the moment each landed
# in a commit -- every later edit did nothing to the page while the tool reported success
# (records/BOHEMIA_A_HOLE_IS_NOT_A_WALL_8_20_26.md). Both edits here are reversed first, and
# the inserted module block is cut BY MARKER, never by content: a reversal that matches on
# content breaks the day the content changes.
if CALL in src:
    src = src.replace(CALL, '', 1)
while MOD_S in src:
    i = src.find(MOD_S); j = src.find(MOD_E, i)
    if j < 0:
        sys.exit('INTERIOR GROUND PATCH: the module block has a start and no end. Refusing '
                 'to guess where it stops -- an orphaned half would leave a STALE generator '
                 'later in the file, where the browser runs it and the fresh one is dead.')
    src = src[:i] + src[j + len(MOD_E):]

# AND THE ANCHOR MUST NOT BE ONE THIS TOOL ALSO WRITES. Two patch tools that anchor on the
# same line are ORDER-DEPENDENT -- each correct alone, the pair not -- which cost a run
# earlier today when the void and terrain patches both anchored on texKindFor.
if ANCHOR not in src:
    sys.exit('INTERIOR GROUND PATCH: could not find the furniture pass in inEnter. Refusing '
             'to guess -- this pass MUST run after the furniture (it will not open a shaft '
             'under a wardrobe) and placing it anywhere else silently breaks that.')
src = src.replace(ANCHOR, ANCHOR + CALL, 1)

if MOD_ANCHOR not in src:
    sys.exit('INTERIOR GROUND PATCH: could not find the inlined furniture module to land '
             'beside. The ground module must be defined before inEnter runs.')
blob = '\n'.join([MOD_S,
                  '/* ==== %s ==== */' % MOD,
                  '/* inlined verbatim by tools/bohemia_city_interior_ground_patch.py -- the '
                  'banner above is one line on purpose: it is the ENGINE SYNC sweep\'s only '
                  'door, and a wrapped banner is an opt-out. */',
                  open(MOD, encoding='utf-8').read(),
                  MOD_E])
i = src.find(MOD_ANCHOR)
src = src[:i] + blob + '\n' + src[i:]

open(WORLD, 'w', encoding='utf-8').write(src)
print('INTERIOR GROUND: %s -- the floor indoors can do something to you'
      % ('REFRESHED' if refreshed else 'applied'))
print('    ceiling rubble in every room with an unsupported span (AMPLIFIES)')
print('    a lift shaft in a service room of a building that would have one (KILLS, a VOID)')
print('    standing water DEFINED and placed nowhere: this valley is bone dry, and why is')
print('    written in the module rather than deleted so nobody re-derives puddles')
