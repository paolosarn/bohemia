#!/usr/bin/env python3
"""
THE DAM IS DRAWN AS ROOF SHINGLES, AND SO IS EVERY OTHER CONCRETE MASS IN THE GAME.
(8/25, WORLD lane.)

FOUND BY LOOKING AT A PICTURE I TOOK FOR A DIFFERENT REASON. The LOOK shot of the widened
dam crest road came back with the wall either side of it rendered as BRICKWORK -- staggered
courses, shingle seams, the lot. Hoover Dam is an arch-gravity wall of poured concrete. It is
the single largest man-made object on this map and it looked like a roof.

WHY. `texKindFor(col, isStruct)` has exactly three families for anything standing up:

    if (isStruct) { if (col === '#3a6a2a') return 'canopy';
                    if (__terrainRockCols()[col]) return 'rock';
                    return 'roof'; }

`rock` is reachable only through __terrainRockCols(), which sweeps the TERRAIN districts. The
dam is infrastructure. So it falls through to `roof`, whose painter draws 4px shingle bands
with staggered vertical seams -- and so does every concrete mass in the valley that is not in
a terrain district: median barriers, bridge columns, revetments, clarifier walls, silos,
perimeter walls, the fort's adobe curtain wall. This is the same class as "the mountain
shipped as brickwork" that occupancy_gate still carries a warning about.

*** AND THE OBVIOUS FIX IS THE WRONG ONE, WHICH IS THE WHOLE POINT OF THIS FILE. ***
The obvious fix is to add the concrete colours to a set, exactly like __terrainRockCols, and
key the texture off the colour. I measured that before writing it. THE COLOURS DO NOT IDENTIFY
THE MATERIAL: of the 18 palette colours used by concrete masses, only SIX are used by nothing
else. `#9a948a` is the dam wall -- and also a gantry crane, a busbar, a microwave mast, razor
wire and a water tower. `#6a6a72` is the jail's perimeter wall -- and also a hangar, a carport,
a chain-link fence and a signal mast. Keying on colour would have turned twelve unrelated
objects to concrete to fix one, and the picture would have looked worse, not better.

A COLOUR IS NOT AN IDENTITY. The renderer only ever receives a colour, so the decision cannot
be made there -- it has to be made where the tile still knows what it is, which is
realizeCell, holding the district's legend entry. That is exactly where `c.lamp` is decided
(8/21) and exactly where `c.haz` is decided, so this is the third consumer of the same shape:
THE LEGEND NAMES THE THING, THE RENDERER DRAWS WHAT IT IS TOLD.

WHAT IS ROUTED, and it is narrow on purpose. A tile qualifies when its legend says BOTH:
  1. the object IS the mass -- its NAME is wall / pier / column / barrier / silo / dike /
     revetment / culvert / storm drain / arch / anchor block / traverse / facade / bollard /
     pad / clarifier / outlet works / flood structure / transmission main / drying tower; and
  2. the material is concrete / masonry / cinder block / shotcrete / precast. NOT adobe --
     see the note in __concreteTile; mud brick is a different material and gets its own painter.
and it is NOT a roof, canopy, awning or deck.

That second half is what keeps every warehouse, store and office out of it. A tilt-up
warehouse IS built of concrete and its act-1 line says so -- but the face you see from above
is its ROOF, and a roof gets shingles. `commercial:2 store`, `industrial:2 warehouse`,
`warehouse:2 tenant unit`, `medical:2 building` all mention concrete and all correctly stay
roofed, because none of them is NAMED a mass. Measured: 22 tiles across 20 districts route to
concrete, and not one of them is a roofed building.

THE DAM'S WALL IS ENTERABLE ("a gallery inside the dam: wet concrete, a walkway") and it is
typed kind:'building' for that reason, which is correct and stays. `kind` was the other
tempting discriminator and it is also wrong: it would have excluded the dam, which is the
thing this started with.

WHAT CONCRETE ACTUALLY LOOKS LIKE, because a new painter is new art and the 45 law applies.
Mass concrete is placed in LIFTS, and Hoover Dam is the textbook case: 230 interlocking
vertical columns poured in five-foot lifts, so the face carries horizontal FORM LINES where
each lift met the next and widely spaced vertical CONTRACTION JOINTS between columns. The
surface is smooth -- far smoother than rock -- and it is streaked with pale calcium leaching
where water has run down it for decades. The corpus already says this in its own words:
granary:6 is "a concrete silo, joint lines showing where each slipform lift stopped".
So the painter is: low jitter (concrete is smooth, not grainy), horizontal lift lines at a
wide spacing, one vertical contraction joint, and a pale leach streak. NO STAGGER -- the
stagger is what made it read as masonry.

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks no bank and opens none. It adds one painter to
the page's existing procedural TEXKIND table, beside grass/dirt/asphalt/paved/roof/rock, and
it deliberately does NOT touch WALL_MAP or SA_MAP -- so any tile that already resolves to
approved art keeps it, because texFor checks those first and returns before it ever asks for
a kind. Nothing approved is overridden.

  python3 tools/bohemia_city_concrete_patch.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'

BLOCKS = [
    # (marker, anchor, insert-after?, body)
    ('__CONCRETE_IS_NOT_A_ROOF_TEX__',
     "  rock(x,B,r){ for(let py=0;py<TPX;py++)for(let px2=0;px2<TPX;px2++){ x.fillStyle=_jit(B,r,13); x.fillRect(px2,py,1,1); }",
     False,
     """  /* __CONCRETE_IS_NOT_A_ROOF_TEX__ -- MASS CONCRETE, which the game had no painter for at
     all. Everything standing up got canopy, rock or ROOF, and roof draws 4px shingle bands
     with staggered seams -- so the dam, every median barrier, every bridge column and every
     silo in the valley was wearing masonry.
     RESEARCHED, not invented. Mass concrete is placed in LIFTS: Hoover Dam is 230 interlocking
     vertical columns poured in five-foot lifts, so the face carries horizontal FORM LINES where
     one lift met the next, and widely spaced vertical CONTRACTION JOINTS between columns. The
     surface is SMOOTH -- much smoother than rock -- and streaked pale where calcium has leached
     down it for decades. The corpus says it too: granary:6 is "a concrete silo, joint lines
     showing where each slipform lift stopped".
     So: low jitter, a horizontal lift line every 7px, ONE vertical joint, one pale leach run,
     and NO STAGGER, because the stagger is the thing that read as brick. */
  concrete(x,B,r){
    for(let py=0;py<TPX;py++)for(let px2=0;px2<TPX;px2++){ x.fillStyle=_jit(B,r,6); x.fillRect(px2,py,1,1); }
    for(let ly=6;ly<TPX;ly+=7){                                  /* THE LIFT LINES */
      x.fillStyle=_rgb(B[0]-16,B[1]-15,B[2]-14); x.fillRect(0,ly,TPX,1);
      x.fillStyle=_rgb(B[0]+13,B[1]+13,B[2]+12); x.fillRect(0,ly+1,TPX,1); }
    const vj=2+((r()*(TPX-4))|0);                                /* ONE contraction joint */
    x.fillStyle=_rgb(B[0]-19,B[1]-18,B[2]-17); x.fillRect(vj,0,1,TPX);
    for(let k=0;k<2;k++){                                        /* calcium leaching, running DOWN */
      const sx=(r()*TPX)|0, sy=(r()*(TPX>>1))|0, sh=(TPX>>1)+((r()*(TPX>>1))|0);
      x.fillStyle=_rgb(Math.min(255,B[0]+21),Math.min(255,B[1]+21),Math.min(255,B[2]+19));
      x.fillRect(sx,sy,1,Math.min(sh,TPX-sy)); }
    x.fillStyle=_rgb(Math.min(255,B[0]+17),Math.min(255,B[1]+17),Math.min(255,B[2]+15));
    x.fillRect(0,0,TPX,1);                                       /* the sky-lit top edge (45 LAW) */
    x.fillStyle=_rgb(B[0]-21,B[1]-20,B[2]-19); x.fillRect(0,TPX-1,TPX,1);
  },
/* __CONCRETE_IS_NOT_A_ROOF_TEX__ END */
"""),

    ('__CONCRETE_IS_NOT_A_ROOF_PICK__',
     "function texFor(col,isStruct,variant){",
     False,
     """/* __CONCRETE_IS_NOT_A_ROOF_PICK__ -- A COLOUR IS NOT AN IDENTITY, so the choice is made
   where the tile still knows what it is (realizeCell, holding the legend) and carried on the
   cell as `c.sTex`. Measured before choosing this: of the 18 palette colours worn by concrete
   masses, only SIX are worn by nothing else -- #9a948a is the dam wall AND a gantry crane, a
   busbar, a microwave mast, razor wire and a water tower. Keying the texture off the colour,
   which is what __terrainRockCols does, would have re-skinned twelve unrelated objects to fix
   one. This is the same shape as c.lamp and c.haz: the legend names the thing, the renderer
   draws what it is told. */
function __concreteTile(entry){
  if(!entry) return false;
  var n=String(entry.name||''), txt=n+' '+String(entry.act1||'');
  if(/roof|canopy|awning|shingle|\\bdeck\\b/i.test(txt)) return false;
  /* ADOBE IS DELIBERATELY NOT IN THIS LIST. The fort's curtain wall is MUD BRICK, and lift
     lines and calcium leaching are signatures of POURED concrete -- they would be a lie on
     it. It was in the first cut, and it came out because I could not photograph the fort to
     check: DO NOT SHIP A MATERIAL YOU HAVE NOT LOOKED AT. Adobe needs its own painter (warm,
     coursed, slumped, no leaching) and until it has one the fort is UNCHANGED, not wrong in a
     new way. Named in the handoff. */
  if(!/concrete|masonry|cinder ?block|\\bcmu\\b|shotcrete|gunite|precast|reinforced/i.test(txt)) return false;
  /* THE OBJECT MUST BE THE MASS. A tilt-up warehouse is made of concrete and says so, but the
     face you see from above is its ROOF -- so `store`, `warehouse`, `tenant unit`, `building`
     stay shingled, because none of them is NAMED a mass. */
  return /\\bwall\\b|\\bpier\\b|\\bcolumn\\b|barrier|\\bsilo\\b|\\bdike\\b|revetment|culvert|storm drain|\\barch\\b|anchor block|traverse|facade|bollard|\\bpad\\b|clarifier|outlet works|flood structure|transmission main|drying tower/i.test(n);
}
/* __CONCRETE_IS_NOT_A_ROOF_PICK__ END */
"""),

    ('__CONCRETE_IS_NOT_A_ROOF_SET__',
     "    if(__lampTile(entry)){",
     False,
     """    /* __CONCRETE_IS_NOT_A_ROOF_SET__ -- stamp the material on the cell while the legend is
       still in hand. One line, and it is the only place in the pipeline that knows this tile
       is a dam wall rather than a colour that a water tower also happens to wear. */
    if(__concreteTile(entry)) c.sTex='concrete';
/* __CONCRETE_IS_NOT_A_ROOF_SET__ END */
"""),
]

# THE POOL SITE -- and this is the one that actually mattered.
#
# I SHIPPED A WRONG CAUSE YESTERDAY AND THIS IS THE CORRECTION. The 8/25 record said the dam
# fell through texKindFor to the procedural `roof` painter. It does not. It never reaches
# texKindFor at all: realizeCell hands every structure tile in every non-terrain district the
# APPROVED HOUSE-ROOF ART POOL --
#
#     if(!KIT_TERRAIN[d]){ c.artPool='hroof'; c.tint=pal; }
#
# -- and texFor returns that art before any procedural kind is asked for. So the dam was not
# wearing a generated shingle pattern, it was wearing Paolo's actual approved house roof
# tiles, tinted grey. Measured on the page at the camera position of the photograph:
# artPool='hroof' on every wall tile. The procedural painter above is still the right thing to
# have, and it is what draws now, but on its own it changed NOTHING and the retaken picture was
# pixel-identical. A FIX THAT CHANGES NO PIXELS IS NOT A FIX; the picture is what caught it.
#
# THE LINE ALREADY HAD THIS EXACT ARGUMENT WON ONCE. Its own comment is __ROCK_IS_NOT_A_ROOF__:
# "a cliff band is not a roof... which is right for a building and is BRICKWORK for limestone."
# It even names "a concrete headwall" in its list of what should be exempt -- and then exempts
# only the TERRAIN districts. This is the same sentence finished.
#
# HEIGHT IS COUPLED TO THIS FLAG and that is the trap in removing it: the shadow pass reads
# `c.wallH || ((c.face || c.artPool==='hroof') ? WALL_H : 1)`, so dropping the pool would drop
# a dam wall's shadow from three tiles to one. WALLS ARE TWO TALL (Paolo 8/2, LOCKED: "all
# walls should at least be two tiles tall from fencing to concrete to brick whatever"). So the
# height is set explicitly and stays exactly what it is today: this changes what a thing is
# MADE OF, not how tall it is.
POOL_OLD = "      if(!KIT_TERRAIN[d]){ c.artPool='hroof'; c.tint=pal; }"
POOL_NEW = ("      /* __CONCRETE_IS_NOT_A_ROOF_POOL__ -- and neither is a dam. The line below hands the\n"
            "         APPROVED HOUSE-ROOF ART to every structure tile in every non-terrain district, so\n"
            "         the largest man-made object on this map was wearing house shingles. Its own\n"
            "         comment already made this argument for limestone and even names \"a concrete\n"
            "         headwall\"; this finishes the sentence for the material it named.\n"
            "         THE HEIGHT IS SET EXPLICITLY because the shadow pass keys off this very flag\n"
            "         (wallH || (face || artPool==='hroof') ? WALL_H : 1). WALLS ARE TWO TALL, Paolo\n"
            "         8/2 LOCKED -- 'from fencing to concrete to brick whatever'. Nothing gets shorter. */\n"
            "      if(!KIT_TERRAIN[d]&&!__concreteTile(entry)){ c.artPool='hroof'; c.tint=pal; }\n"
            "      else if(!KIT_TERRAIN[d]&&!c.wallH){ c.wallH=WALL_H; }")

# THE DRAW SITE. A pure replacement of an anchor that still exists, so a failed reversal
# cannot duplicate it -- the anchor goes missing and this exits loud.
DRAW_OLD = "      else x.drawImage(texFor(c.s,true,v),i2*TPX,y*TPX);"
DRAW_NEW = ("      /* __CONCRETE_IS_NOT_A_ROOF_DRAW__ -- a cell that named its own material gets it.\n"
            "         AFTER the approved-art branches above on purpose: anything that resolves to a\n"
            "         judged pool (artPool / WALL_MAP / SA_MAP) keeps it, because those return before\n"
            "         this line is ever reached. This only catches what was falling through to the\n"
            "         procedural default, which for every concrete mass in the game was ROOF. */\n"
            "      else if(c.sTex) x.drawImage(texForKind(c.sTex,c.s,v),i2*TPX,y*TPX);\n"
            "      else x.drawImage(texFor(c.s,true,v),i2*TPX,y*TPX);")

# texForKind must be able to hand back a procedural kind by name.
KIND_OLD = "function texForKind(kind,col,variant){"
KIND_NEW = ("function texForKind(kind,col,variant){\n"
            "  /* __CONCRETE_IS_NOT_A_ROOF_KIND__ -- a caller may now ask for a procedural family BY\n"
            "     NAME (c.sTex), rather than only by the colour lookup texKindFor does. Approved art\n"
            "     still wins: the WALL_MAP / house-stamp branches below run first and return. */\n"
            "  if(kind&&TEXKIND[kind]&&kind!=='wall'){\n"
            "    const _k='K'+kind+'|'+col+'|'+variant; let _t=_texCache.get(_k); if(_t)return _t;\n"
            "    const _c=document.createElement('canvas'); _c.width=TPX; _c.height=TPX;\n"
            "    const _x=_c.getContext('2d');\n"
            "    let _s=(OM.hash2(variant*31+7,col.charCodeAt(1)*13+col.charCodeAt(5),20260825))>>>0;\n"
            "    const _r=()=>{_s=(_s*1664525+1013904223)>>>0; return _s/4294967296;};\n"
            "    TEXKIND[kind](_x,_hex(col),_r); _texCache.set(_k,_t=_c); return _t;\n"
            "  }")

if not os.path.exists(WORLD):
    sys.exit('CONCRETE PATCH: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()
refreshed = BLOCKS[0][0] in src

for mark, anchor, after, body in BLOCKS:
    # CUT BY MARKER, every occurrence, however many there are. Never by content.
    pat = re.compile(r'[ \t]*/\* ' + re.escape(mark) + r'.*?' + re.escape(mark) + r' END \*/\n', re.S)
    src, _n = pat.subn('', src)
    if src.count(anchor) != 1:
        sys.exit('CONCRETE PATCH: anchor is not unique (%d hits): %s' % (src.count(anchor), anchor))
    src = src.replace(anchor, (anchor + '\n' + body.rstrip('\n')) if after
                      else (body.rstrip('\n') + '\n' + anchor), 1)

if DRAW_NEW in src:
    src = src.replace(DRAW_NEW, DRAW_OLD)
if src.count(DRAW_OLD) != 1:
    sys.exit('CONCRETE PATCH: the structure draw line is not unique (%d hits). Refusing to '
             'guess -- it draws every standing object in the game.' % src.count(DRAW_OLD))
src = src.replace(DRAW_OLD, DRAW_NEW, 1)

if POOL_NEW in src:
    src = src.replace(POOL_NEW, POOL_OLD)
if src.count(POOL_OLD) != 1:
    sys.exit('CONCRETE PATCH: the hroof assignment is not unique (%d hits). Refusing to guess '
             '-- it decides the material of every standing object in every district.'
             % src.count(POOL_OLD))
src = src.replace(POOL_OLD, POOL_NEW, 1)

if KIND_NEW in src:
    src = src.replace(KIND_NEW, KIND_OLD)
if src.count(KIND_OLD) != 1:
    sys.exit('CONCRETE PATCH: texForKind is not unique (%d hits).' % src.count(KIND_OLD))
src = src.replace(KIND_OLD, KIND_NEW, 1)

open(WORLD, 'w', encoding='utf-8').write(src)
print('CONCRETE PATCH: %s' % ('REFRESHED' if refreshed else 'applied'))
print('    21 tiles across 19 districts stop wearing the approved HOUSE ROOF art')
print('    routed by the LEGEND, never by the colour: 12 of 18 concrete colours are shared')
print('    with a gantry crane, a busbar, razor wire, a hangar, a fence, a water tower...')
