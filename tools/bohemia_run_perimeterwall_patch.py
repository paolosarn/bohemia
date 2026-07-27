#!/usr/bin/env python3
"""
BOHEMIA THE RUN'S SUBURB BORDER WALL (7/28/26) - he was looking at a DIFFERENT
RENDERER the whole time, and in that one the border wall really was a house tile.

> "i went on the run and the suburb border walls are not changed its still the
>  house tiles dumbass"

HE IS RIGHT AND I FIXED THE WRONG SURFACE. Everything today went into the CITY
tab's walked world (CITY_B64). THE RUN IS A SEPARATE RENDERER with its own tile
vocabulary, and he plays THE RUN. In the run:

    if(c===4) return 'wall_base';        /* perimeter wall top */

`wall_base` is a tile from the STARTER TILESET, and the run's own bodyTile() uses
that same `wall_base` for the bottom course of a HOUSE:

    if(a.kind==='wall'){ if(a.off===0) return 'wall_base'; ... }

So in the run, the suburb border wall and the house wall were LITERALLY THE SAME
TILE. "ur using some bullshit that u made for a house wall as the subrub wall" is
not an approximation of the bug. It is the bug, exactly, stated correctly, twice,
while I kept measuring a surface he was not looking at.

His thirteen approved border walls have never existed in the run at all - the
builder lifts DOOR_B64 / ROOF_IMG / YARD_IMG / WALL_IMG off the walk surface and
the perimeter pool was never among them.

THE FIX
  builder  tools/build_run_slice.js now inlines the 13 tan tiles from
           banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt as PERIM_B64, the same
           way it already inlines the approved animated doors, and refuses to
           build if the bank is missing or short.
  run      code 4 draws from THAT pool, never from the tileset, and the design is
           seeded PER PLOT (the 4x4 overmap group the cell belongs to) per his
           law in banks/BOHEMIA_REAL_VEGAS_VERDICTS_R2_7_14_26.txt: "each plot =
           ONE wall design (seeded per plot); variety BETWEEN plots; per-cell
           wall shuffle BANNED".

REUSE CHECK: cooks ZERO pixels. It carries the bank's own bytes into the run and
draws them. Nothing is created, resized or restyled.

TASTE CHECK: produces no candidates and reaches Paolo's thumbs with nothing.

Idempotent (marker RUN PERIMETER). Rebuild after:  node tools/build_run_slice.js

  python3 tools/bohemia_run_perimeterwall_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
SRC = 'slices/BOHEMIA_RUN_SLICE_7_26_26.html'
BUILDER = 'tools/build_run_slice.js'

src = open(SRC, encoding='utf8').read()
if 'RUN PERIMETER' in src:
    print('the run already draws his border wall. no-op.')
    sys.exit(0)

# ---- 1) the run stops using a house tile for the community wall -------------
OLD = "  if(c===4) return 'wall_base';                                     /* perimeter wall top */"
NEW = """  /* RUN PERIMETER (7/28): this returned 'wall_base' - the SAME starter-tileset
     tile the run's own bodyTile() lays as the bottom course of a HOUSE. The
     suburb border wall and the house wall were literally one tile. Paolo judged
     61 candidates down to 13 border walls over two sessions
     (banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt) and not one of them had ever
     existed in this renderer. It is drawn from that pool now, in drawPerim(),
     which is why this returns null - the draw handles it. */
  if(c===4) return null;"""
if src.count(OLD) != 1:
    print('RUN PERIMETER: the code-4 tile anchor did not match. NOT applied.')
    sys.exit(1)
src = src.replace(OLD, NEW, 1)

# ---- 2) the pool, decoded, one design per plot ------------------------------
ANCHOR = "function isRoad(a,b){ return (a>=0&&b>=0&&a<W&&b<H) && G[b][a]===1; }"
POOLJS = """/* ==== RUN PERIMETER (7/28): PAOLO'S OWN SUBURB BORDER WALLS ================
   banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt - 13 keys he passed out of 61
   candidates across two judging sessions (7/14 batch 1: 12 of 44; 7/17 batch 2:
   1 of 48). The builder inlines the tan half verbatim; nothing is re-cooked.

   ONE WALL PER COMMUNITY, his law, verbatim from
   banks/BOHEMIA_REAL_VEGAS_VERDICTS_R2_7_14_26.txt `paolo_laws`:
   "each plot = ONE wall design (seeded per plot); variety BETWEEN plots;
    per-cell wall shuffle BANNED"
   The plot is the 4x4 overmap group this cell belongs to - the same grouping the
   suburb layout itself is generated from - so a whole community wears one wall
   and the community next door wears a different one. ========================= */
var PERIM_IMG = (typeof PERIM_B64!=='undefined'?PERIM_B64:[]).map(function(b){
  var im=new Image(); im.src='data:image/png;base64,'+b; return im; });
function perimImg(){
  if(!PERIM_IMG.length) return null;
  var px=(CELL&&CELL[0]||0)>>2, py=(CELL&&CELL[1]||0)>>2;
  var h=(Math.imul(px,2654435761)^Math.imul(py,40503))>>>0;
  var im=PERIM_IMG[h%PERIM_IMG.length];
  return (im&&im.complete&&im.naturalWidth)?im:null;
}
function drawPerim(X,Y,S){
  var im=perimImg(); if(!im) return false;
  ctx.drawImage(im,X,Y,S,S); return true;
}
""" + ANCHOR
if src.count(ANCHOR) != 1:
    print('RUN PERIMETER: the isRoad anchor did not match. NOT applied.')
    sys.exit(1)
src = src.replace(ANCHOR, POOLJS, 1)

# ---- 3) the draw lays his wall for code 4 -----------------------------------
OLD_DRAW = """        var laid = isSuburbCell()
          ? (body ? bodyTile(c,gx,gy2) : groundTile(c,gx,gy2))
          : genericTile(gx,gy2);
        if(!tput(laid,X,Y,S) && !body){"""
NEW_DRAW = """        /* RUN PERIMETER (7/28): the community wall is HIS pool, not the
           tileset. Ground goes down first so the wall never sits on bare
           canvas while the bank is still decoding. */
        if(isSuburbCell() && c===4){
          tput(groundTile(0,gx,gy2),X,Y,S);
          if(drawPerim(X,Y,S)) continue;
        }
        var laid = isSuburbCell()
          ? (body ? bodyTile(c,gx,gy2) : groundTile(c,gx,gy2))
          : genericTile(gx,gy2);
        if(!tput(laid,X,Y,S) && !body){"""
if src.count(OLD_DRAW) != 1:
    print('RUN PERIMETER: the tile draw anchor did not match. NOT applied.')
    sys.exit(1)
src = src.replace(OLD_DRAW, NEW_DRAW, 1)

# the fade pass redraws the same tiles; it must use his wall too
OLD_FADE = """      var laid = isSuburbCell()
        ? (isBody(gx,gy2) ? bodyTile(G[gy2][gx],gx,gy2) : groundTile(G[gy2][gx],gx,gy2))
        : genericTile(gx,gy2);
      tput(laid,X,Y,S);"""
NEW_FADE = """      /* RUN PERIMETER (7/28): the see-through pass draws the same tiles, so it
         needs his wall too or a faded community wall reverts to a house tile. */
      if(isSuburbCell() && G[gy2][gx]===4){ tput(groundTile(0,gx,gy2),X,Y,S); if(drawPerim(X,Y,S)) return; }
      var laid = isSuburbCell()
        ? (isBody(gx,gy2) ? bodyTile(G[gy2][gx],gx,gy2) : groundTile(G[gy2][gx],gx,gy2))
        : genericTile(gx,gy2);
      tput(laid,X,Y,S);"""
if src.count(OLD_FADE) == 1:
    src = src.replace(OLD_FADE, NEW_FADE, 1)

# the placeholder the builder fills
src = src.replace('__ART_BANKS__', '__ART_BANKS__\nvar PERIM_B64 = __PERIM_B64_JSON__;', 1)
open(SRC, 'w', encoding='utf8').write(src)

# ---- 4) the builder carries the bank in ------------------------------------
b = open(BUILDER, encoding='utf8').read()
if '__PERIM_B64_JSON__' not in b:
    HOOK = "if (html.indexOf('__ART_BANKS__') < 0) throw new Error('missing __ART_BANKS__ placeholder');"
    ADD = """/* ---- RUN PERIMETER (7/28, Paolo: "i went on the run and the suburb border
   walls are not changed its still the house tiles"). He was right and it was
   worse than a wiring slip: the run returned 'wall_base' for the suburb
   perimeter, which is the SAME starter-tileset tile its own bodyTile() lays as
   the bottom course of a house. His 13 approved border walls - 61 candidates
   judged down over two sessions - had never existed in this renderer at all.
   The tan half of the pool comes in verbatim, like the door bank. ---- */
var PERIM_POOL = 'banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt';
var perimBank = JSON.parse(fs.readFileSync(PERIM_POOL, 'utf8'));
var perimTan = perimBank.pool.filter(function (p) { return p.variant === 'tan'; }).map(function (p) { return p.b64; });
if (perimTan.length < 12) throw new Error('the approved suburb border walls are missing from ' + PERIM_POOL);
if (html.indexOf('__PERIM_B64_JSON__') < 0) throw new Error('missing __PERIM_B64_JSON__ placeholder');
html = html.replace('__PERIM_B64_JSON__', JSON.stringify(perimTan));

"""
    assert b.count(HOOK) == 1
    b = b.replace(HOOK, ADD + HOOK, 1)
    open(BUILDER, 'w', encoding='utf8').write(b)

print('RUN PERIMETER applied:')
print("  - the run's suburb border wall stops being 'wall_base', the house tile")
print('  - it draws from his 13 approved border walls, one design per community')
print('  NEXT: node tools/build_run_slice.js')
