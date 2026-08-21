#!/usr/bin/env python3
"""
FORTY-FIVE DISTRICTS AUTHOR A STREETLIGHT. THE VALLEY DRAWS ZERO.
(8/21, WORLD lane.)

MEASURED FIRST, ON THE RUNNING PAGE, and the instrument was proved before the number
was believed (the rule this session earned the hard way: a negative result is a claim
about your INSTRUMENT until you have shown the instrument could have seen a positive).
A synthetic lamp injected into every chunk gave 25 draws; the real sweep, 36 districts,
gave THIS:

    approved lamp sprites loaded : 3
    lamp DRAWS across the sweep  : 0
    lamp CELLS, per district     : suburb 0  arterial 0  commercial 0  downtown 0
                                   strip 0   industrial 0
    (control, same sweep, same cells: 36,100 walkable cells in the suburb alone)

Three approved sprites -- the blessed V11 dark lamp bodies, banks/BOHEMIA_LAMP_DARK_
VARIANTS_7_14_26.txt, passed 7/14 -- decoded, resident in memory, and never once put on
screen. A renderer for them exists and is correct: it picks a variant, stands the body
1.5 cells wide and 3 cells tall rising two cells above its footing, and at night asks
POWER.at(...).live before it adds a head glow, which is CLUSTERED POWER and
LIGHT=TERRITORY done exactly right. It reads `c.lamp`. NOTHING IN THE WORLD SETS
`c.lamp`.

WHY. There was exactly one producer, and it is in the PARAMETRIC ROAD PATH:

    else if(rel<laneZone+xs.side){ c.g='#c8c4b8'; /* LAMP POSTS: staggered law ... */ }

which runs under `if(m.road)`. On 8/18 the roads got their own generator modules, and
`tileMeta` now says `m.road=false` the moment a road routes to its kit. KIT_ROAD today
is {strip, arterial, freeway, rail, interchange} -- WHICH IS EVERY ROAD CLASS IN RD.
So `m.road` is false for every road in the valley, the parametric path is dead code, and
the only thing in the world that ever set `c.lamp` went dark with it. Nobody noticed
because a lamp that is not drawn looks exactly like a lamp that was never authored.

THIS IS THE SAME SHAPE AS THE TRAFFIC SIGNALS, ONE WEEK EARLIER, IN THIS SAME FILE.
`__A_ROAD_IS_STILL_A_ROAD__` (8/18) found his 348-sprite signal set drawing zero times
for the same reason and fixed it by giving identity its own flag. The lamp was standing
in the same room and was not asked. THE LESSON THAT GENERALISES: when a path stops
running, everything that only lived on that path stops with it, and a renderer that
draws nothing is silent -- so the thing to sweep after a routing change is not "does the
new path work" but "WHAT ELSE WAS ONLY ON THE OLD ONE".

WHAT THE FIX IS. Not a new lamp rule: a CONSUMER that reads the ones already authored.
Forty-five district modules declare a light in their legend -- 'streetlight' on the
arterial and the strip, 'pole light' in forty-three others, all of them gated by
tilespec_gate, all of them in dossiers, every one of them rendering today as a flat
square of palette colour. This teaches realizeCell to recognise a light standard BY ITS
LEGEND NAME and set `c.lamp`, so the approved body finally stands on all of them.

    censused across every registered district, one plot each:
      45 districts author a light, 395 light tiles in a single plot of each

TWO THINGS IT DELIBERATELY DOES NOT DRAW.
  1. LIGHT TOWERS AND FLOODLIGHT MASTS. speedway (100 tiles, blobs of 25), ballpark (54),
     school (40), stadium, airport, airbase. A stadium mast is a different object from a
     cobra head and the cobra sprite would be a lie on it -- and a 25-tile blob would
     stand twenty-five overlapping poles. They are excluded by name and stay as they are
     until they get art of their own.
  2. THE SECOND TILE OF A BLOB. A pole is one tile in 43 of the 45; `town` has blobs of
     two. Only the top-left tile of a blob raises a body, so two adjacent light tiles
     never stand two overlapping poles.

AND THE SUBURB, WHICH IS WHERE HE SPAWNS. That district is not on the kit path at all
(m.sub, a hand-written per-code branch) and had ELEVEN codes, every one of them flat on
the ground. bohemia_suburb.js now authors code 12, a street light at the back of walk on
researched residential spacing; this is the branch that draws it.

REUSE CHECK: cooks no pixels and adds no bank. It draws banks/BOHEMIA_LAMP_DARK_
VARIANTS_7_14_26.txt (Paolo's approved V11 dark lamp bodies, already inlined in this page
as LAMP_B64/LAMP_IMG and already rendered by the ch2.posts pass) on tiles that 45
district legends have declared for weeks.

  python3 tools/bohemia_city_lamp_patch.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'

# THREE INSERTS, EVERY ONE DELIMITED AND CUT BY MARKER -- never by content. Two tools in
# this directory froze on 8/20 because they tested `if MARK in src: exit(0)`, and a third
# duplicated its block because it reversed only the FIRST occurrence. An insert that is
# cut by its own delimiters is exact, repeatable, and cannot double no matter how many
# times it runs or what the surrounding lines become.
BLOCKS = [
    # (marker, anchor line, insert-after?, body)
    ('__THE_VALLEY_DRAWS_ITS_LAMPS__',
     "function realizeCell(gx,gy){",
     False,
     """/* __THE_VALLEY_DRAWS_ITS_LAMPS__ -- ONE RULE, WHOLE VALLEY: a tile whose legend NAMES it
   a light standard raises the approved lamp body. Forty-five district modules declare one
   ('streetlight' on the arterial and the strip, 'pole light' in forty-three others) and
   until today every one of them rendered as a flat square, because the only thing in the
   world that ever set `c.lamp` was the parametric road path -- which went dead the day
   roads got their own generators (KIT_ROAD covers every class in RD, so `m.road` is false
   valley-wide). Measured before touching anything: 3 sprites loaded, 0 draws, 0 lamp cells
   in six districts, against 25 draws for an injected control.
   TOWERS AND MASTS ARE NOT COBRA HEADS. speedway/ballpark/school/stadium/airport author
   LIGHT TOWERS in blobs of up to 25 tiles; this sprite is a street light and would be a lie
   on a floodlight mast (and 25 of them would stand 25 overlapping poles). Excluded by name
   until they get art of their own. */
function __lampTile(entry){
  var n=String((entry&&entry.name)||'');
  if(/tower|mast|floodlight/i.test(n)) return false;         /* a different object entirely */
  return /streetlight|street light|pole light|light standard/i.test(n);
}
/* __THE_VALLEY_DRAWS_ITS_LAMPS__ END */
"""),
    ('__THE_VALLEY_DRAWS_ITS_LAMPS_KIT__',
     "    const pal=(spec&&spec.palette&&spec.palette[code])||'#98948a';",
     True,
     """    /* __THE_VALLEY_DRAWS_ITS_LAMPS_KIT__ -- ONE PER BLOB, top-left anchored. A pole is a
       single tile in 43 of the 45 districts that author one; `town` runs blobs of two, and
       without this a two-tile blob stands two poles in the same spot. Reading the kit grid
       directly is exact and free -- it is the array this branch already indexed one line
       above. At the plot edge there is no neighbour to compare against, which is correct:
       a 1-2 tile pole does not straddle two plots. */
    if(__lampTile(entry)){
      var _lw=(lx>0)?(m.kit[ly*FN+lx-1]===code):false;
      var _ln=(ly>0)?(m.kit[(ly-1)*FN+lx]===code):false;
      if(!_lw&&!_ln) c.lamp=1;
    }
    /* __THE_VALLEY_DRAWS_ITS_LAMPS_KIT__ END */
"""),
    ('__THE_VALLEY_DRAWS_ITS_LAMPS_SUB__',
     "    else if(v===3){ c.g='#c8c4b8'; }                 // driveway apron",
     True,
     """    /* __THE_VALLEY_DRAWS_ITS_LAMPS_SUB__ -- THE ONE THING IN HIS SPAWN THAT STANDS UP AND
       IS NOT A BUILDING. Eleven codes in this district and every single one of them lay flat
       on the ground -- road, walk, drive, dirt, gravel, debris, and the house masses -- which
       is why the spawn reads as a floor plan seen from above instead of a street you are
       standing in. bohemia_suburb.js authors code 12 at the BACK OF WALK (Paolo's 7/31 walk
       is attached to the kerb, so there is no amenity strip and the pole goes on the property
       line behind it), on researched local-residential spacing: successive heads 200-300 ft,
       staggered on alternate kerbs. A pole blocks a cell. The head is DARK; only a live POWER
       circuit lights one at night, which is CLUSTERED POWER / LIGHT=TERRITORY, untouched. */
    else if(v===12){ c.s='#4a463f'; c.walk=false; c.lamp=1; }
    /* __THE_VALLEY_DRAWS_ITS_LAMPS_SUB__ END */
"""),
]

if not os.path.exists(WORLD):
    sys.exit('LAMP PATCH: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()
refreshed = BLOCKS[0][0] in src

for mark, anchor, after, body in BLOCKS:
    # CUT BY MARKER, every occurrence, however many there are.
    pat = re.compile(r'[ \t]*/\* ' + re.escape(mark) + r'.*?' + re.escape(mark) + r' END \*/\n',
                     re.S)
    src, _n = pat.subn('', src)
    if src.count(anchor) != 1:
        sys.exit('LAMP PATCH: anchor is not unique (%d hits): %s' % (src.count(anchor), anchor))
    src = src.replace(anchor, (anchor + '\n' + body.rstrip('\n')) if after
                      else (body.rstrip('\n') + '\n' + anchor), 1)

open(WORLD, 'w', encoding='utf-8').write(src)
print('LAMP PATCH: %s -- 45 districts author a light, the valley now draws them'
      % ('REFRESHED' if refreshed else 'applied'))
print('    the kit path reads the legend name; the suburb branch draws its new code 12')
print('    towers/masts excluded by name (a cobra head is not a floodlight mast)')
