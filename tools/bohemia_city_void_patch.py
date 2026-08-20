#!/usr/bin/env python3
"""
A HOLE IS NOT A WALL. (8/20, WORLD lane.)

Until today the walked surface had exactly two answers for a tile: you stand on it, or you
bump into it. `quarry:7 bench lip / crest`, `gypsum:7 bench lip / crest`, `intake:13 intake
shaft / main` and `reclaim:6 crusted pond centre` are the four most genuinely lethal pieces
of ground in this valley -- a quarry edge, a shaft down to the tunnel, and a crust that will
not hold you -- and all four were `kind:'structure'`, which defaults SOLID. So the deepest
holes in the world were modelled, and DRAWN, as walls you bounce off.

That is not a small miss. His own clause is "an enemy KNOCKED or CHARGING in dies outright",
which is the payoff the whole hazard system was built for, and it could not fire anywhere,
because a wall is the one thing you cannot be knocked into.

THE THIRD STATE, defined in engine/bohemia_district_kit.js and declared per tile as
`void:true`:
    solid    NO   a hole cannot block anything
    walkable NO   pathing refuses it; nothing walks into a shaft by choice

WHAT THIS TOOL DOES TO THE PAGE, and it is one branch inserted ahead of the structure
branch, because a void would otherwise be swallowed by it:

  1. IT DRAWS AS A FLOOR AT A DIFFERENT VALUE, NOT AS A MASS. The structure branch draws a
     three-quarter front face -- the tile RISES. A hole that rises is worse than no hole at
     all, because it reads as the exact opposite of what it is. So a void takes the GROUND
     channel and a darkened shade of its own palette colour. That is not a placeholder
     choice: records/BOHEMIA_THE_FLOOR_CAN_KILL_YOU_8_18_26.md's own ART ask says a drop
     reads as "a rim, a shadow line, A FLOOR AT A DIFFERENT VALUE". This is that, until ART
     supplies the rim.
  2. IT IS NOT WALKABLE. c.walk stays false, so pathing and the occupancy model refuse it
     exactly as they refused the wall. Nothing walks into a shaft by accident.
  3. IT IS NOT SOLID, AND IT SAYS SO OUT LOUD. c.void=true rides on the cell so combat can
     tell a bump from a kill. WORLD makes the room legible; what a knockback DOES with a
     void is COMBAT's call and is not decided here.

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks no pixels, opens no bank, adds no tile and no
table. It routes four tiles that already exist, and that four district generators have been
authoring for weeks, onto a channel this renderer already draws. The rim is ART's ask and is
named in the record rather than invented here.

  python3 tools/bohemia_city_void_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__A_HOLE_IS_NOT_A_WALL__'

OLD = ("    if(tl.layer==='structure'){\n"
       "      c.s=pal; c.walk=false;")
NEW = ("""    /* __A_HOLE_IS_NOT_A_WALL__ -- THIS BRANCH RUNS BEFORE THE STRUCTURE BRANCH ON PURPOSE.
       Every void in the valley is declared kind:'structure' (a quarry bench crest, a shaft,
       a crusted pond centre), so the structure branch below would swallow all four and draw
       the deepest holes in the world as masses you bump into -- which is what it did until
       today, and which is the exact opposite of what they are.
       A void draws on the GROUND channel at a DARKER value than its own palette colour, so
       it reads as floor that dropped away rather than something that rose. That is the ART
       ask from records/BOHEMIA_THE_FLOOR_CAN_KILL_YOU_8_18_26.md ("a rim, a shadow line, a
       floor at a different value") answered as far as a renderer can answer it; the rim
       itself is pixels and is still ART's.
       walk stays FALSE -- nothing walks into a shaft by choice -- and `void` rides on the
       cell so COMBAT can tell a bump from a kill. What a knockback DOES here is combat's
       ruling, not this file's. */
    if(tl['void']){
      c.g=__voidShade(pal); c.walk=false; c['void']=true; c.gArtPool=null; return c;
    }
    if(tl.layer==='structure'){
      c.s=pal; c.walk=false;""")

# THE ANCHOR IS realizeCell, NOT texKindFor, AND THE DIFFERENCE COST A RUN (8/20).
# This first anchored the shade helper on `function texKindFor(col,isStruct){` -- a stable
# line, sitting right where a colour helper belongs. But tools/bohemia_city_terrain_patch.py
# REPLACES a block that ENDS in that exact line, so applying this tool inserted the shade
# block INSIDE terrain's block, and terrain's next reversal -- an exact string match on what
# it wrote -- silently found nothing and the tool refused to run at all.
# TWO PATCH TOOLS THAT ANCHOR ON THE SAME LINE ARE ORDER-DEPENDENT, and order-dependence
# between re-runnable tools is a trap: each is correct alone and the pair is not. So this
# one anchors on the declaration of the function it is used INSIDE, which no other tool
# touches. If you add a tool here, pick an anchor no other tool writes.
SHADE_ANCHOR = 'function realizeCell(gx,gy){'
SHADE = """/* __A_HOLE_IS_NOT_A_WALL__ -- the shade a void draws at. Not a new colour and not a
   palette entry: the tile's OWN colour taken down in value, so a hole in white gypsum still
   reads as gypsum and a hole in limestone still reads as limestone. One material, two
   values, which is how a drop reads from above without any new art. */
function __voidShade(col){
  var m=/^#([0-9a-f]{6})$/i.exec(String(col||'')); if(!m) return '#241f19';
  var n=parseInt(m[1],16), r=(n>>16)&255, g=(n>>8)&255, b=n&255, k=0.34;
  var h=function(v){ v=Math.max(0,Math.round(v*k)); return (v<16?'0':'')+v.toString(16); };
  return '#'+h(r)+h(g)+h(b);
}
"""

if not os.path.exists(WORLD):
    sys.exit('VOID PATCH: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()
refreshed = MARK in src

# RE-RUNNABLE: reverse first, then apply, so a re-run always starts from a pristine page.
# The shade helper is an INSERT, not a replacement, so it is cut by MARKER rather than by
# content -- a reversal that matches on content breaks the day the content changes, which
# is how the terrain patch killed this page once (8/18).
if NEW in src:
    src = src.replace(NEW, OLD, 1)
_s, _e = '/* __VOID_SHADE_S__ */', '/* __VOID_SHADE_E__ */'
while _s in src:
    i = src.find(_s); j = src.find(_e, i)
    if j < 0:
        sys.exit('VOID PATCH: the shade block has a start and no end. Refusing to guess.')
    src = src[:i] + src[j + len(_e):]

if OLD not in src:
    sys.exit('VOID PATCH: could not find the structure branch of realizeCell. Refusing to '
             'guess -- this decides how every solid tile in the game is drawn, and a void '
             'inserted in the wrong place would draw a hole as a building.')
src = src.replace(OLD, NEW, 1)

if SHADE_ANCHOR not in src:
    sys.exit('VOID PATCH: could not find texKindFor to place the shade helper beside.')
src = src.replace(SHADE_ANCHOR, _s + '\n' + SHADE + _e + '\n' + SHADE_ANCHOR, 1)

open(WORLD, 'w', encoding='utf-8').write(src)
print('VOID PATCH: %s -- a hole draws as a hole and is not a wall'
      % ('REFRESHED' if refreshed else 'applied'))
print('    4 voids: quarry:7, gypsum:7, intake:13, reclaim:6')
print('    ground channel at a darker value, walk=false, void=true for combat')
