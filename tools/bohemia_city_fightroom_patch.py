#!/usr/bin/env python3
"""
THE FIGHT WAS TOLD THE ROOM IS A RECTANGLE. (8/19, WORLD lane.)

__CITY_FIGHT__ landed on the walked surface yesterday -- "THE DOOR IS THE FIGHT" -- and the
handoff it posts to combat describes the room like this:

    room:{ w: fp.W, h: fp.H, zone: INSIDE.zone }

TWO NUMBERS AND A LABEL. Its own comment says why: "Combat does not consume it yet: walls as
cover and doorways as chokepoints are the RF4 half and belong to the teardown spec, WHICH
DOES NOT EXIST." That spec exists now (records/BOHEMIA_RF4_TEARDOWN_SPEC.md, LAB, 8/18), so
the reason is gone and the seam is the last thing holding the work back.

AND THIS IS THE PUREST FORM OF THE PROBLEM THE LIFT NAMES. §6: "if your combat loop requires
retreat, your level generator has a HARD OBLIGATION to guarantee retreat is possible... a
cramped room deletes the entire core verb." This lane spent a day making the floor mean
something -- cover you can get behind, ground that kills or slows you, a measured retreat
guarantee -- and AT THE MOMENT THE FIGHT STARTS, COMBAT IS HANDED A BOX. Every one of those
systems is invisible exactly where it was built to matter.

WHAT RIDES NOW, and every field is the world's own truth rather than a number I invented:

    floor    one char per cell: '.' a body may stand, '#' blocked
    cover    '.' nothing, 'C' chest-to-head (blocks the body AND the look),
             'l' knee-to-waist (blocks the body, NEVER the look -- there is no crouch)
    ground   '.' nothing, 'K' kills, 'A' amplifies (+50% physical), 'D' disables (no sprint)
    doors    the chokepoints, as coordinates -- a body in a doorway is a tool in his corpus
    retreat  {ok, stranded, worst}: can every cell in this room reach somewhere it cannot
             be seen, how many cannot, and how far the furthest retreat is
    legend   what every character means, IN THE PAYLOAD, so combat never has to guess and a
             change here can never silently mean something else over there

THE ENCODING IS ONE CHARACTER PER CELL because this crosses postMessage: a 20x16 room is 320
characters a layer. Three layers of a big plate is tens of kilobytes, which is fine, and it
is a great deal cheaper than combat re-deriving the room from a footprint it cannot see.

WHAT THIS IS NOT: it is not combat code and it does not decide anything about the fight.
COMBAT owns what to do with cover, chokepoints and a retreat number (§6 routes machines 1, 3,
4, 7, 8, 9 there). WORLD owns making the room legible. This is the seam and nothing past it.

REUSE CHECK: cooks no pixels, opens no bank, invents no tile. It reads the floorplan the page
already generated, the furniture engine/bohemia_furnish.js already stamped, and the retreat
measure engine/bohemia_retreat.js already computes, and puts all three in a message that was
already being sent.

  python3 tools/bohemia_city_fightroom_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_FIGHT_GETS_THE_ROOM__'

OLD = """  try{ window.parent.postMessage({type:'BOHEMIA_CITY_ENCOUNTER',
    label:(INSIDE.label||'interior'), faction:fac, draft:true, roster:roster,
    room:{w:(fp&&fp.W)||f.w, h:(fp&&fp.H)||f.h, zone:INSIDE.zone||null},
    at:{gx:(INSIDE.exit&&INSIDE.exit.gx)|0, gy:(INSIDE.exit&&INSIDE.exit.gy)|0}},'*'); }catch(_e){ return false; }"""

NEW = """  try{ window.parent.postMessage({type:'BOHEMIA_CITY_ENCOUNTER',
    label:(INSIDE.label||'interior'), faction:fac, draft:true, roster:roster,
    room:cityFightRoom(fp,f),                      /* __THE_FIGHT_GETS_THE_ROOM__ */
    at:{gx:(INSIDE.exit&&INSIDE.exit.gx)|0, gy:(INSIDE.exit&&INSIDE.exit.gy)|0}},'*'); }catch(_e){ return false; }"""

FN_ANCHOR = "function cityFightOnEnter(){"
FN = """/* ==== __THE_FIGHT_GETS_THE_ROOM__ ====================================================
   THE FIGHT WAS TOLD THE ROOM IS A RECTANGLE. The encounter handoff described the room as
   `{w, h, zone}` -- two numbers and a label -- and its own comment said why: walls as cover
   and doorways as chokepoints "belong to the teardown spec, WHICH DOES NOT EXIST". It exists
   now (records/BOHEMIA_RF4_TEARDOWN_SPEC.md, 8/18), so this is the seam that was left.

   It is also the purest form of the thing the RF4 lift §6 warns about: this lane spent a day
   making the floor mean something -- cover you can get behind, ground that kills or slows,
   a measured retreat guarantee -- and at the moment a fight starts, combat got a BOX. Every
   one of those systems was invisible exactly where it was built to matter.

   ONE CHARACTER PER CELL, row-major, because this crosses postMessage. THE LEGEND RIDES IN
   THE PAYLOAD: combat never has to guess what a character means, and a change here cannot
   silently mean something else on the other side.

   THIS IS NOT COMBAT CODE. It decides nothing about the fight. COMBAT owns what to do with
   cover, chokepoints and a retreat number; WORLD owns making the room legible. Seam only. */
function cityFightRoom(fp,f){
  var out={w:(fp&&fp.W)||f.w, h:(fp&&fp.H)||f.h, zone:INSIDE.zone||null};
  try{
    if(!fp||!fp.grid) return out;
    var floor='',cover='',ground='',doors=[],x,y;
    for(y=0;y<fp.H;y++){
      for(x=0;x<fp.W;x++){
        var c=fp.grid[y][x]||{};
        var isDoor=(c.door===true||c.g==='door');
        /* FLOOR: a body may stand here. Furniture blocks, walls block, doorways do not. */
        var blocked=(c.furn&&(c.furn.cls==='cover'||c.furn.cls==='low')) ||
                    (c.g==='wall'&&!isDoor);
        floor+=blocked?'#':((c.g==='floor'||isDoor||c.kind==='stair')?'.':'#');
        /* COVER: only chest-to-head hides you. A low piece blocks the body and NEVER the
           look, because there is no crouch in this game and a sofa cannot hide you. */
        cover+=(c.furn?(c.furn.cls==='cover'?'C':(c.furn.cls==='low'?'l':'.')):'.');
        /* GROUND: the hazard classes. Interiors carry none today -- the channel ships
           anyway so combat reads ONE shape indoors and out, and the day an outdoor fight
           exists it is already wired rather than needing another seam. */
        var hz='.';
        try{ if(typeof BohemiaHazard!=='undefined'&&c.terrain){
          var KK=(typeof BohemiaDistrictKit!=='undefined')?BohemiaDistrictKit:null;
          var k=BohemiaHazard.classOf(c.terrain,KK);
          hz=(k==='KILLS')?'K':(k==='AMPLIFIES')?'A':(k==='DISABLES')?'D':'.';
          /* 'V' OUTRANKS 'K' AND THE DIFFERENCE IS NOT COSMETIC (8/20). Both kill on forced
             entry, but a K is ground a body can walk onto and choose to stand on, and a V
             is a HOLE -- it cannot be pathed into at all, and it does not stop a body that
             is thrown at it. Told apart, a push into a V is a kill and a push into a wall
             beside it is a bump; conflated, combat would either path somebody into a shaft
             or treat the shaft as a wall, and those are the only two ways to get this
             wrong. So the payload says which it is instead of making combat infer it. */
          if(BohemiaHazard.isVoid && BohemiaHazard.isVoid(KK,c.terrain)) hz='V';
        } }catch(_e){}
        ground+=hz;
        if(isDoor) doors.push([x,y]);
      }
    }
    out.floor=floor; out.cover=cover; out.ground=ground; out.doors=doors;
    /* THE RETREAT OBLIGATION, MEASURED FOR THIS ACTUAL ROOM. The single most useful number
       combat can be handed: can every cell reach somewhere it cannot be seen from. */
    try{ if(typeof BohemiaRetreat!=='undefined'){
      var m=BohemiaRetreat.measure(fp);
      out.retreat={ok:!!m.ok, cells:m.cells, stranded:m.noBreak.length, worst:m.worst,
                   loops:m.loops, pinches:m.pinches};
    } }catch(_e){}
    out.legend={
      floor:{'.':'a body may stand here','#':'blocked'},
      cover:{'.':'nothing','C':'chest-to-head: blocks the body AND the line of sight',
             l:'knee-to-waist: blocks the body, NEVER the line of sight (there is no crouch)'},
      ground:{'.':'nothing','K':'kills outright on FORCED entry only (knocked or charging in)',
              V:'a VOID -- a hole. Kills on forced entry like K, and unlike K it cannot be '
                +'walked into at all and does not block a body thrown into it. Never path '
                +'anything here; a push into it is a kill, not a bump.',
              A:'+50% physical damage taken (unstable footing)',
              D:'no sprinting and no movement abilities (standing liquid)'},
      order:'row-major, w characters per row'
    };
  }catch(_e){}
  return out;
}
"""


if not os.path.exists(WORLD):
    sys.exit('FIGHT ROOM: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()

# RE-RUNNABLE, AND IT WAS NOT UNTIL 8/20. This said `if MARK in src: print("already
# applied"); exit(0)`, which means that from the moment it first landed in a commit it could
# NEVER be refreshed: every later edit to the payload silently did nothing to the page while
# the tool cheerfully reported success. That is how the 'V' void character was added to the
# ground channel, run, reported applied, and was not on the surface at all.
# A PATCH TOOL THAT CANNOT RE-RUN IS A TOOL WHOSE OUTPUT FREEZES AT WHATEVER IT WAS THE DAY
# IT SHIPPED, and the freeze is invisible because the tool keeps saying the right thing. So
# every edit is REVERSED first and the inserted block is CUT BY MARKER (never by content --
# a reversal that matches on content breaks the day the content changes, which is how the
# terrain patch killed this page once on 8/18).
FN_S, FN_E = '/* __FR_S__ */', '/* __FR_E__ */'
refreshed = MARK in src
if NEW in src:
    src = src.replace(NEW, OLD, 1)
while FN_S in src:
    _i = src.find(FN_S); _j = src.find(FN_E, _i)
    if _j < 0:
        sys.exit('FIGHT ROOM: the room-reader block has a start and no end. Refusing to '
                 'guess where it stops -- an orphaned half would leave a STALE reader later '
                 'in the file, where the browser runs it and the fresh one is dead code.')
    src = src[:_i] + src[_j + len(FN_E):]

# THE LEGACY FORM, WHICH IS WHAT MADE THIS URGENT. Every page written before 8/20 carries
# this block with NO delimiters, because the tool that wrote it could never re-run and so had
# no reason to mark where its own work stopped. Cutting only the marked form leaves the old
# copy in place and appends a second `function cityFightRoom` -- MEASURED: two definitions in
# one file, the browser running the LAST one, which is not necessarily the fresh one.
# The legacy block is exactly: the banner, through to the anchor it was inserted in front of.
_LEG = '/* ==== __THE_FIGHT_GETS_THE_ROOM__ ===='
while _LEG in src:
    _i = src.find(_LEG); _j = src.find(FN_ANCHOR, _i)
    if _j < 0:
        sys.exit('FIGHT ROOM: found a legacy room-reader block with no anchor after it. '
                 'Refusing to guess where it ends.')
    src = src[:_i] + src[_j:]

if OLD not in src:
    sys.exit('FIGHT ROOM: could not find the encounter handoff. Refusing to guess -- this is '
             'the ONE message that tells combat what it is fighting in, and a wrong edit '
             'either drops the fight or describes the wrong room.')
i = src.find(FN_ANCHOR)
if i < 0:
    sys.exit('FIGHT ROOM: could not find cityFightOnEnter to define the room reader beside.')

src = src.replace(OLD, NEW, 1)
i = src.find(FN_ANCHOR)
src = src[:i] + FN_S + '\n' + FN + FN_E + '\n' + src[i:]

# AND THE MEASURE HAS TO BE ON THE PAGE. engine/bohemia_retreat.js was never inlined here --
# it was written as a node-side gate measure -- so the first run of this produced a payload
# with every other field correct and `retreat` simply ABSENT. That is the same failure mode
# recorded on 8/18 with the terrain noise field: A DEPENDENCY THAT IS NOT THERE FAILS EXACTLY
# LIKE A FEATURE THAT WAS NEVER WIRED, and the only thing that tells them apart is reading
# the payload off the running page instead of the patch.
RMOD = 'engine/bohemia_retreat.js'
RMARK = '/* ==== THE RETREAT MEASURE (inlined verbatim) ==== */'
REND = '/* ==== end THE RETREAT MEASURE ==== */'
if RMARK not in src:
    if not os.path.exists(RMOD):
        sys.exit('FIGHT ROOM: %s is missing.' % RMOD)
    ranchor = FN_ANCHOR
    ri = src.find(ranchor)
    if ri < 0:
        sys.exit('FIGHT ROOM: could not find cityFightOnEnter to inline the measure beside.')
    rblob = '\n'.join([RMARK,
                       '/* ==== %s ==== */' % RMOD,
                       '/* inlined verbatim by tools/bohemia_city_fightroom_patch.py -- the '
                       'encounter payload carries the retreat obligation for the actual room, '
                       'so it has to be measurable HERE and not only in a gate. */',
                       open(RMOD, encoding='utf-8').read(),
                       REND])
    src = src[:ri] + rblob + '\n' + src[ri:]

open(WORLD, 'w', encoding='utf-8').write(src)
print('FIGHT ROOM: the encounter now carries the room instead of its dimensions')
print('    floor / cover / ground, one char per cell, plus doors and the retreat measurement')
print('    the LEGEND rides in the payload, so combat never guesses what a character means')
