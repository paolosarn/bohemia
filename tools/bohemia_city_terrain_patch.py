#!/usr/bin/env python3
"""
THE TERRAIN GENERATORS NEVER REACHED THE SURFACE HE WALKS ON. (8/18, WORLD lane.)

MEASURED on the running page, asking tileMeta what a real terrain cell actually is:

    desert    hasKit:false  open:true  rects:10
    wash      hasKit:false  open:true  rects:10
    mountain  hasKit:false  open:true  rects:10
    water     hasKit:false  open:true  rects:0

Every terrain cell in the valley is realized as TEN 2x2 RECTANGLES of flat colour. That is
the whole thing. Meanwhile engine/bohemia_desert.js has been authoring self-spaced creosote
(not confetti scatter), OHV tracks, illegal dumping and the GHOST PLAT -- a graded
subdivision nobody built -- on a 128x128 grid, and engine/bohemia_wash.js has been authoring
the braid, the riprap, the concrete flood structure and the SEWER TUNNEL MOUTH. None of it
has ever been on the surface Paolo walks. gates/terrain_gate.js is green on all of it,
because it tests the GENERATORS and nothing asked whether the game called them.

DESERT AND WASH ARE 620 + 152 CELLS AND HE CAN WALK ON BOTH -- measured 256/256 walkable in
a sample of each. The desert is the ground between everything.

THE MECHANISM ALREADY EXISTS ON THIS PAGE AND IT WAS BUILT LAST WEEK FOR A ROAD. The
comment above it says it plainly: "A ROAD WITH ITS OWN MODULE DRAWS ITSELF (8/18). The
parametric XSEC table below is four numbers, and four numbers cannot say 'palm median' or
'promenade at the back of curb'." Las Vegas Boulevard was routed through __kitGrid so it
gets its tiles from its own module. TEN RECTANGLES CANNOT SAY "GHOST PLAT" EITHER. Terrain
takes the same door.

THE ONE THING THAT MAKES TERRAIN DIFFERENT, and getting it wrong would be worse than not
doing it: terrain is SAMPLED FROM ONE VALLEY-WIDE FIELD IN GLOBAL COORDINATES, which is the
entire reason a ridge crosses a cell boundary instead of stopping dead at it. The generator
reads opts.cellX/cellY and multiplies by 128. __kitBlock generates one 128x128 block per
GRP x GRP cells (FN=32, GRP=4), so THE BLOCK COORDINATE IS THE 128-TILE COORDINATE and
passing gx4/gy4 is exactly right. Pass the cell instead and every seam in the valley breaks
while each cell still looks fine on its own -- the failure terrain_gate exists to catch.

DELIBERATELY NOT INCLUDED, AND THE REASONS ARE DIFFERENT:
  MOUNTAIN  routing it would be an improvement (it is 0/256 walkable today, a solid wall,
            while its own generator and gate insist "THE MOUNTAIN IS A WALL WITH PASSES"
            and the ravines are walkable). But it changes valley traversal for 927 cells,
            which deserves its own pass with its own before/after, not a ride along.
  WATER     its legend declares `open water` non-solid because its KIND is water-dead,
            which the kit layers as ground. Routing it would let him WALK OUT ONTO THE
            LAKE. That is a misdeclaration in the water legend, and the fix belongs there
            -- deep water blocks -- not in a terrain patch that would ship the bug first.
Both are filed in the record with these reasons rather than quietly skipped.

REUSE CHECK: cooks no pixels, opens no bank, adds no tile and no table. It routes two
existing generators through an existing door that an existing road already uses.

  python3 tools/bohemia_city_terrain_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__TERRAIN_DRAWS_ITSELF__'

# 1) the meta branch: open terrain asks its own module first, and keeps the rects as a
#    fallback so a district without a generator is unchanged.
OLD_META = ("""  if(m.open){ // scattered unwalkable clutter (rocks, brush) on open ground
    if(d!=='water')for(let k=0;k<10;k++)m.rects.push({x:4+((r()*118)|0),y:4+((r()*118)|0),w:2,h:2,col:d==='mountain'?'#6a5e50':'#b09468'});
    metaCache.set(key,m); return m;
  }""")
NEW_META = ("""  if(m.open){
    /* __TERRAIN_DRAWS_ITSELF__ -- TEN RECTANGLES CANNOT SAY "GHOST PLAT".
       Every terrain cell in the valley was realized as ten 2x2 rectangles of flat colour,
       while engine/bohemia_desert.js had been authoring self-spaced creosote, OHV tracks,
       illegal dumping and a graded subdivision nobody built, and engine/bohemia_wash.js the
       braid, the riprap and the sewer tunnel mouth. None of it had ever been on the surface
       he walks. terrain_gate.js was green the whole time because it tests the GENERATORS
       and nothing asked whether the game called them.
       This is the SAME DOOR the Strip took last week ("A ROAD WITH ITS OWN MODULE DRAWS
       ITSELF"), and the comment there applies word for word: four numbers cannot say "palm
       median", and ten rectangles cannot say "ghost plat".
       THE BLOCK COORDINATE IS THE 128-TILE COORDINATE. Terrain is sampled from ONE
       valley-wide field in GLOBAL coordinates -- that is the whole reason a ridge crosses a
       cell boundary instead of stopping at it -- and __kitBlock generates one 128x128 block
       per GRP x GRP cells, so gx4/gy4 IS what opts.cellX/cellY must receive. Pass the cell
       instead and every seam in the valley breaks while each cell still looks fine alone.
       MOUNTAIN and WATER are deliberately not here: mountain changes traversal for 927
       cells and deserves its own before/after, and water's legend calls open water
       non-solid, which would let him walk out onto the lake. Reasons in the record. */
    if(TERRAIN_KIT[d] && typeof BohemiaDistrictKit!=='undefined' && BohemiaDistrictKit.get(d)){
      const tg=__kitGrid(tx,ty,d,{terrain:true,key:'T'});
      if(tg){ m.kit=tg.codes; m.kitSpec=tg.spec; m.open=false; metaCache.set(key,m); return m; }
    }
    // scattered unwalkable clutter (rocks, brush) on open ground -- the fallback for
    // terrain with no module of its own, unchanged.
    if(d!=='water')for(let k=0;k<10;k++)m.rects.push({x:4+((r()*118)|0),y:4+((r()*118)|0),w:2,h:2,col:d==='mountain'?'#6a5e50':'#b09468'});
    metaCache.set(key,m); return m;
  }""")

# 2) the registry line, next to the one it mirrors
OLD_REG = "const KIT_ROAD={strip:1};"
NEW_REG = ("/* __TK_S__ */\n"
           "const KIT_ROAD={strip:1};\n"
           "/* __TERRAIN_DRAWS_ITSELF__ -- terrain types whose own generator draws the cell, the\n"
           "   same way KIT_ROAD names the roads that draw themselves. TWO ARE DELIBERATELY OUT:\n"
           "   MOUNTAIN was routed, MEASURED and REVERTED the same hour -- its generator is 80%\n"
           "   bedrock face, ridge crest and cliff band, all STRUCTURE-layer, and this renderer\n"
           "   draws structure with building art, so 927 cells came back looking like BRICKWORK.\n"
           "   The content was right and the picture was wrong; it needs a rock treatment for\n"
           "   structure-layer TERRAIN before it can come back.\n"
           "   WATER's legend calls `open water` non-solid, so routing it would let him walk out\n"
           "   onto the lake -- a legend fix, not a terrain fix. Both in the record. */\n"
           "const TERRAIN_KIT={desert:1, wash:1};\n"
           "/* __TK_E__ */")

# EVERY FORM THIS BLOCK HAS EVER HAD, so a page written by an older revision of this tool
# can still be reversed. Add to this list when the block changes; never hand-edit the page.
LEGACY_REG = [
    ("const KIT_ROAD={strip:1};\n"
     "/* __TERRAIN_DRAWS_ITSELF__ -- terrain types whose own generator draws the cell,\n"
     "   the same way KIT_ROAD names the roads that draw themselves. mountain and water\n"
     "   are deliberately absent; see the note in tileMeta and the record. */\n"
     "const TERRAIN_KIT={desert:1, wash:1};"),
    ("const KIT_ROAD={strip:1};\n"
     "/* __TERRAIN_DRAWS_ITSELF__ -- terrain types whose own generator draws the cell,\n"
     "   the same way KIT_ROAD names the roads that draw themselves. WATER is deliberately\n"
     "   absent: its legend calls `open water` non-solid, so routing it would let him walk\n"
     "   out onto the lake -- a legend fix, not a terrain fix. See the record. */\n"
     "const TERRAIN_KIT={desert:1, wash:1, mountain:1};"),
]

# 3) __kitBlock has to hand the generator the block coordinate, or the field is sampled at
#    (0,0) for every block in the valley and every terrain cell comes out identical.
OLD_OPTS = ("         if(legs&&legs.cluster) o={streets:st.length?st:['S'],bounds:legs.cluster,kind:legs.kind,\n"
            "                                   cellX:legs.cellX,cellY:legs.cellY};")
NEW_OPTS = ("         if(legs&&legs.terrain) o={streets:st.length?st:['S'],cellX:gx4,cellY:gy4};\n"
            "         /* __TERRAIN_DRAWS_ITSELF__ -- THE BLOCK COORDINATE IS THE 128-TILE\n"
            "            COORDINATE (FN=32, GRP=4), and the terrain field is global. Handing\n"
            "            it the CELL instead of the BLOCK would sample the wrong place and\n"
            "            break every seam in the valley while each cell still looked fine on\n"
            "            its own -- exactly the failure terrain_gate.js was written for. */\n"
            "         else if(legs&&legs.cluster) o={streets:st.length?st:['S'],bounds:legs.cluster,kind:legs.kind,\n"
            "                                   cellX:legs.cellX,cellY:legs.cellY};")

if not os.path.exists(WORLD):
    sys.exit('TERRAIN PATCH: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()

# RE-RUNNABLE, NOT ONE-SHOT. The first cut of this bailed out the moment its marker was
# present, so the second it landed in a commit it could never be refreshed -- and a patch
# tool that cannot re-run is a tool whose output silently freezes at whatever it was the day
# it shipped, which is the exact defect bohemia_city_module_resync.py exists to end. Every
# edit below is REVERSED first (new -> old) and the module block is CUT, so a re-run always
# starts from a pristine page and always ends at today's source.
# REVERSING BY EXACT STRING IS HOW THIS TOOL BROKE THE PAGE ONCE. The first re-runnable
# version reversed each edit by matching the NEW text verbatim; then the NEW text was edited
# (one comment line), the file's older form no longer matched, the reversal silently did
# nothing, and the forward pass inserted a SECOND `const TERRAIN_KIT` -- "Identifier
# 'TERRAIN_KIT' has already been declared", whole page dead. That is the payday orphan
# (8/15) wearing a different coat: A REVERSAL THAT MATCHES ON CONTENT BREAKS THE DAY THE
# CONTENT CHANGES. So the registry edit now carries its own delimiters and is cut by MARKER,
# and every historical form it has ever had is listed so an older page can still be
# reversed. Rename the marker and add the old one here, exactly like LEGACY_MARKS.
refreshed = MARK in src
_RS, _RE = '/* __TK_S__ */', '/* __TK_E__ */'
while _RS in src:
    _i = src.find(_RS); _j = src.find(_RE, _i)
    if _j < 0:
        sys.exit('TERRAIN PATCH: the registry block has a start and no end. Refusing to guess.')
    src = src[:_i] + OLD_REG + src[_j + len(_RE):]
for _legacy in LEGACY_REG:
    if _legacy in src:
        src = src.replace(_legacy, OLD_REG, 1)
for _new, _old in ((NEW_META, OLD_META), (NEW_OPTS, OLD_OPTS)):
    if _new in src:
        src = src.replace(_new, _old, 1)
_a = '/* ==== THE DESERT DRAWS ITSELF (inlined verbatim) ==== */'
_b = '/* ==== end THE DESERT DRAWS ITSELF ==== */'
while _a in src:
    _i = src.find(_a); _j = src.find(_b, _i)
    if _j < 0:
        sys.exit('TERRAIN PATCH: the module block has a start and no end. Refusing to guess '
                 'where it stops -- an orphaned half would leave a stale generator LATER in '
                 'the file, where the browser runs it and the fresh one is dead code.')
    src = src[:_i] + src[_j + len(_b):]

for name, old, new in (('the open-terrain branch of tileMeta', OLD_META, NEW_META),
                       ('the KIT_ROAD registry line', OLD_REG, NEW_REG),
                       ('the __kitBlock options', OLD_OPTS, NEW_OPTS)):
    if old not in src:
        sys.exit('TERRAIN PATCH: could not find %s. Refusing to guess -- this decides what '
                 'SEVENTEEN PERCENT of the valley is made of, and a wrong edit either flattens '
                 'the terrain or breaks every seam in it.' % name)
    src = src.replace(old, new, 1)

# 4) AND THE DESERT'S GENERATOR HAS TO BE ON THE PAGE AT ALL. Measured after the first
#    run of this patch: wash took the new door and came back with 13 real tile types
#    (channel bank, channel invert, maintenance road, riprap), and DESERT DID NOT MOVE --
#    because engine/bohemia_desert.js is not inlined in the city page and
#    BohemiaDistrictKit.get('desert') returns null there. 620 cells of the most common
#    ground in the valley, generated for weeks by a module the walked surface has never
#    loaded. The banner is written in the sync scanner's exact one-line shape, so the
#    ENGINE SYNC LAW covers it from the day it lands (a wrapped banner is an opt-out, and
#    that has already happened three times on this page).
DESERT_MOD = 'engine/bohemia_desert.js'
DMARK = '/* ==== THE DESERT DRAWS ITSELF (inlined verbatim) ==== */'
DEND = '/* ==== end THE DESERT DRAWS ITSELF ==== */'
if DMARK not in src:
    if not os.path.exists(DESERT_MOD):
        sys.exit('TERRAIN PATCH: %s is missing.' % DESERT_MOD)
    # THE MOUNTAIN WAS TRIED HERE AND TAKEN BACK OUT, and the attempt is worth keeping.
    # MEASURED before: a mountain cell is 0/16,384 walkable -- 927 cells of TOTAL WALL, while
    # its own generator is 80.4% rock and 19.6% talus, ravine floor, dry drainage and alluvial
    # fan, and terrain_gate.js has asserted since 7/26 that "a mountain cell is never a solid
    # block". Routed, it came back 0.6-20% walkable per cell with real material -- the CONTENT
    # was right. THEN I LOOKED AT IT. Bedrock face, ridge crest and cliff band are all
    # STRUCTURE-layer tiles, and this renderer draws structure with BUILDING art, so the
    # massif rendered as a checkerboard of brickwork. Shipping that would have put 927 cells
    # of brick wall around a valley Paolo already tells me looks like shit when it is wrong.
    # A GATE WOULD HAVE PASSED IT: the tiles were there, the seam held, walkability improved.
    # Only opening the picture caught it. Reverted; it needs a rock treatment for
    # structure-layer TERRAIN first, which is a renderer + ART job, not a routing job.
    DANCHOR = '/* ==== engine/bohemia_wash.js (canon, married 7/22) ==== */'
    di = src.find(DANCHOR)
    if di < 0:
        sys.exit('TERRAIN PATCH: could not find the wash module to inline the desert beside. '
                 'Refusing to guess -- the desert generator must land where the kit can see '
                 'it before tileMeta asks for it.')
    # AND ITS FIELD, FIRST. The desert samples engine/bohemia_terrain_noise.js -- the ONE
    # continuous field the whole valley is drawn from, and the entire reason a ridge crosses
    # a cell boundary instead of stopping at it. That module was not on the page either, so
    # inlining the generator alone left it throwing on load and falling silently back to the
    # ten rectangles: A DEPENDENCY THAT IS NOT THERE FAILS EXACTLY LIKE A FEATURE THAT WAS
    # NEVER WIRED, and the only thing that told them apart was measuring the page again.
    NOISE_MOD = 'engine/bohemia_terrain_noise.js'
    if not os.path.exists(NOISE_MOD):
        sys.exit('TERRAIN PATCH: %s is missing.' % NOISE_MOD)
    dblob = '\n'.join([DMARK,
                       '/* ==== %s ==== */' % NOISE_MOD,
                       '/* inlined verbatim by tools/bohemia_city_terrain_patch.py -- the '
                       'desert samples it, and it must be defined before the generator runs. */',
                       open(NOISE_MOD, encoding='utf-8').read(),
                       '/* ==== %s ==== */' % DESERT_MOD,
                       '/* inlined verbatim by tools/bohemia_city_terrain_patch.py. The banner '
                       'above is one line on purpose: it is the sync sweep\'s only door. */',
                       open(DESERT_MOD, encoding='utf-8').read(),
                       DEND])
    src = src[:di] + dblob + '\n' + src[di:]

open(WORLD, 'w', encoding='utf-8').write(src)
print('TERRAIN PATCH: %s -- desert and wash draw themselves from their own generators'
      % ('REFRESHED' if refreshed else 'applied'))
print('    the block coordinate is passed as cellX/cellY, so the global field still seams')
print('    mountain was routed, LOOKED AT and reverted (structure tiles render as brickwork);')
print('    water is out because its legend calls open water non-solid. Both in the record.')
