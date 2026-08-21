#!/usr/bin/env python3
"""
THE SUBURB HAS ALWAYS HAD SIDEWALKS AND THE RENDERER DID NOT KNOW WHAT THEY WERE.
(Paolo 8/20, holding a screenshot of his own spawn: "the sidewalk is still dog shit".)

HE WAS RIGHT AND MY EARLIER FIX WAS IN THE WRONG DISTRICT. On 8/20 I mapped the kerb and
the lane line for the ARTERIAL, measured it, photographed it, and shipped it -- and the
place he actually spawns is a SUBURB, which does not go through the kit path at all. It
goes through `m.sub`. Nothing I did touched it. I checked one room and reported the house
fixed, which is the exact failure I had written a warning about twice that same day.

MEASURED AT HIS SPAWN (6205,6271), the nine cells around it:

    sub code  0  28,177   dead-ground (yard)   #8a7a5e  pool hyard
    sub code  1  13,447   road                 #8a8a86  pool -      (SA_MAP -> street, fine)
    sub code  2  11,312   house
    sub code  6   3,892   garage
    sub code 10   3,347   SIDEWALK             #8a7a5e  pool -      <-- ***
    sub code  4   1,997   wall
    sub code  3   1,660   driveway             #c8c4b8  pool -

THE SUBURB GENERATOR HAS BEEN LAYING SIDEWALKS THE WHOLE TIME. `layWalks(g,{road:{1:1},
walk:10,...})` puts code 10 beside every street, and the suburb's own legend has said what
it is since it was written:

    10: {name:'sidewalk', kind:'walk',
         act1:'cracked concrete sidewalk, one grid wide, hugging the kerb; weeds in the
               joints, no vegetation'}

That act-1 line is a word-for-word description of `pools.side` in his harmonized bank --
pale concrete, scored joints, weeds in the cracks. The tile was authored right, the walk was
laid right, and the LAW required it: BOHEMIA_THE_BUILT_WORLD_LAW clause D1, "the walk is
continuous public ground between the kerb and the private lot".

AND THE RENDERER'S SUBURB BRANCH HAD NO CASE FOR IT. Its own comment lists what it knows:

    /* CANON SUBURB codes: 0 dead 1 road 2 house 3 drive 4 wall 5 gate 6 garage 9 upper */

Ten is not in that list. So all 3,347 sidewalk cells fell through to the default line at the
top of the branch -- `c.g='#8a7a5e'`, dead dirt, no art pool -- and what he was standing
next to in the screenshot was his sidewalk, painted as bare earth.

*** SO NOTHING WAS MISSING AND NOTHING NEEDED DESIGNING. *** No new tile, no new code, no
change to the layout, no pixel cooked. One branch that had never been written. This is the
third time in two days that the fault was a CONSUMER that did not know about something the
world had been producing all along -- 17 stale inlined modules, `m.road` going false and
taking 348 signal sprites with it, and now a code the renderer never learned.

WHAT IT SETS:
  - `side`, his approved pool, on every code-10 cell. Not a new material: the same one the
    arterial sidewalk already wears, so a walk reads the same whether he is downtown or on
    his own street.
  - the variant hashed PER PLOT, never per cell. banks/..._HARMONIZED_7_14_26
    desert_dominance_law, Paolo 7/14: "too much diversity with the desert tiles" -- a
    per-cell shuffle turns a run of pavement into a checkerboard, which is the ruling the
    perimeter wall in this same branch already obeys for the same reason.
  - the palette colour underneath it stays the suburb's own (#57575f), so the model and the
    picture do not start disagreeing about what a tile is.

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks ZERO pixels and opens no bank to cook from. It
reaches `pools.side` (36 tiles, judged REAL_VEGAS R2) which is already loaded on the page
and already used by the arterial walk and the kerb. Nothing here is new art; it is a code
the renderer could not see.

  python3 tools/bohemia_city_suburb_sidewalk_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_SUBURB_HAS_SIDEWALKS__'

OLD = ("    else if(v===3){ c.g='#c8c4b8'; }                 // driveway apron")
NEW = ("""    else if(v===3){ c.g='#c8c4b8'; }                 // driveway apron
    /* __THE_SUBURB_HAS_SIDEWALKS__ -- CODE 10 IS THE SIDEWALK AND THIS BRANCH HAD NEVER
       HEARD OF IT. The comment at the top of this block lists "0 dead 1 road 2 house 3
       drive 4 wall 5 gate 6 garage 9 upper" and ten is not in it, so every walk in every
       suburb fell through to the dead-dirt default at the top -- #8a7a5e, no art pool.
       MEASURED at his spawn: 3,347 sidewalk cells, all of them painted as bare earth.
       Paolo, 8/20, holding a screenshot of it: "the sidewalk is still dog shit".
       NOTHING WAS MISSING. The generator has laid these since it was written
       (layWalks -> walk:10), the suburb legend calls code 10 'sidewalk' and describes it
       as "cracked concrete sidewalk, one grid wide, hugging the kerb; weeds in the joints"
       -- which is a word-for-word description of pools.side in his harmonized bank -- and
       BUILT WORLD LAW D1 requires the walk to exist. Only this branch did not know.
       PER PLOT, NEVER PER CELL: desert_dominance_law, Paolo 7/14 ("too much diversity with
       the desert tiles"). A per-cell shuffle turns a run of pavement into a checkerboard,
       which is why the perimeter wall in this same branch is seeded per plot too. */
    else if(v===10){
      const _sw=(Math.imul(tx>>2,2654435761)^Math.imul(ty>>2,40503))>>>0;
      c.gArtPool='side'; c.gArtVariant=_sw%3;
    }
    /* __THE_SUBURB_HAS_SIDEWALKS__ -- AND A FRONT YARD MADE OF SOMETHING. Every house in
       this district sat in a large flat rectangle of one dead-dirt tone: nine codes in the
       whole suburb and not one of them a prop, which at the player's camera at the spawn is
       most of the screen. Code 11 is DECORATIVE GRAVEL, the most Las Vegas thing about a
       Las Vegas yard and the one that survives a dead world -- this valley has paid people
       to tear their lawns out since the early 2000s, and rock does not die. Its palette
       colour is already in texKindFor's rock family, so it picks up the ROCK grain with no
       new art and no new pool: gravel drawn as gravel.
       Code 13 is what a decade of wind leaves against the kerb. It is named "debris" in the
       legend on purpose, so BohemiaHazard classifies it AMPLIFIES by derivation -- and the
       class is stamped here because this branch is not the kit path and would otherwise
       never carry one. The district he SPAWNS IN finally has ground that does something to
       a body, and it gets the loose-chip mark for free. */
    else if(v===11){ c.g='#9b968a'; }
    else if(v===13){ c.g='#7c7263';
      if(typeof BohemiaHazard!=='undefined'){
        try{ const _h13=BohemiaHazard.classOf(
               (typeof BohemiaSuburb!=='undefined'&&BohemiaSuburb.legend)?BohemiaSuburb.legend[13]:null,
               BohemiaDistrictKit); if(_h13) c.haz=_h13; }catch(_e){}
      }
    }""")

ROCK_OLD = "  if(col==='#8a7a66'||col==='#6a5e50')return 'rock';"
ROCK_NEW = ("  /* __THE_SUBURB_HAS_SIDEWALKS__ -- #9b968a is the suburb's DECORATIVE GRAVEL and it\n"
            "     takes the rock grain, because that is what it is. The first cut picked the gravel\n"
            "     colour to MATCH a colour already in this list, which got the right texture and the\n"
            "     wrong value -- #8a7a66 is eight units off the dead dirt beside it, so a yard of\n"
            "     rock read as a yard of dirt with a slightly different grain. LOOKED AT IT, then\n"
            "     fixed the right end: choose the colour the material should be and teach the\n"
            "     texture where to find it, rather than choosing the colour the texture already\n"
            "     knew. */\n"
            "  if(col==='#8a7a66'||col==='#6a5e50'||col==='#9b968a')return 'rock';")

if not os.path.exists(WORLD):
    sys.exit('SUBURB SIDEWALK: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()
refreshed = MARK in src

# RE-RUNNABLE: a pure replacement of an anchor that still exists, so a failed reversal
# cannot duplicate anything -- the anchor goes missing and this exits loud.
if NEW in src:
    src = src.replace(NEW, OLD, 1)
if ROCK_NEW in src:
    src = src.replace(ROCK_NEW, ROCK_OLD, 1)
if ROCK_OLD not in src:
    sys.exit('SUBURB SIDEWALK: could not find the rock branch of texKindFor. Refusing to '
             'guess -- it decides which generator draws every untextured ground in the game.')
src = src.replace(ROCK_OLD, ROCK_NEW, 1)
if OLD not in src:
    sys.exit('SUBURB SIDEWALK: could not find the driveway-apron line in the m.sub branch. '
             'Refusing to guess -- this branch decides what every tile in the district he '
             'SPAWNS IN is made of.')
src = src.replace(OLD, NEW, 1)

open(WORLD, 'w', encoding='utf-8').write(src)
print('SUBURB SIDEWALK: %s' % ('REFRESHED' if refreshed else 'applied'))
print('    sub code 10 was falling through to dead dirt: 3,347 cells at his spawn alone')
print('    it wears his approved `side` pool now, the same walk the arterial has')
