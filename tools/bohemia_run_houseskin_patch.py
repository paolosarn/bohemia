#!/usr/bin/env python3
"""
BOHEMIA THE RUN WEARS HIS HOUSE SKINS (7/28/26) - thirty tiles he thumbed UP on
7/21, decoded into the page on every load, never drawn once.

MEASURED FIRST (tools/bohemia_run_art_source_audit.js, records/BOHEMIA_RUN_ART_
SOURCE_AUDIT_7_28_26.md): out on the block, 273 of 330 draws are the 42-tile CBB
target set - Paolo's own verdict on it was COULD BE BETTER - and ROOF_IMG /
WALL_IMG / YARD_IMG appear exactly ONCE each in the built run: their own
definition. Present and unused, which is precisely how his 13 border walls sat
until earlier the same day. The builder even asserts the banks are PRESENT and
nothing ever checked they were USED.

WHY THIS IS SURGICAL AND NOT A SWAP. The run's houses ride a designed projection
(records/BOHEMIA_RUN_BUILDING_STACK_7_27_26.md): the stack picks a different tile
for the base course, the eave shadow, the left and right corners, the ridge, the
hips and the garage mouth, so a house reads as a solid mass seen from the south
instead of a rectangle of texture. His skins are FLAT 44x44 field textures with
no corner or eave variants. Swapping wholesale would hand back his materials and
take away the massing - and he had just said, for the first time in a day, that
something looked good.

So only the FIELD tiles are skinned - the flat middle of a wall, the flat middle
of a roof, the open yard - and every tile that carries SHAPE keeps the target
set:

  skinned      wall_0 / wall_1 / wall_2   -> WALL_IMG   (his wall skins)
               roof_slope                 -> ROOF_IMG   (his roof skins)
               yard_0 / yard_1 / yard_2   -> YARD_IMG   (his yard skins)
  untouched    wall_base, wall_under_eave, wall_end_l, wall_end_r,
               wall_window, wall_boarded, roof_ridge, roof_eave,
               roof_hipTL/TR/BL/BR, every garage tile, every road, kerb,
               concrete and walk tile
That is the massing kept and the materials returned, in one map.

ONE SKIN PER HOUSE, which is his own wall law applied where it obviously belongs:
"each plot = ONE wall design (seeded per plot); variety BETWEEN plots; per-cell
wall shuffle BANNED" (banks/BOHEMIA_REAL_VEGAS_VERDICTS_R2_7_14_26.txt). A house
gets ONE wall skin and ONE roof skin for its whole body, seeded off the footprint
it belongs to, so a house is one house and the house next door is different. The
yard is seeded per BLOCK, matching what the CITY tab already does with the same
bank ("one DG blend per BLOCK").

REUSE CHECK: cooks ZERO pixels and creates no asset. Every tile it draws is
already in the page - ROOF_IMG / WALL_IMG / YARD_IMG, lifted verbatim by
tools/build_run_slice.js from the approved walk surface, carrying Paolo's 7/21
verdict (records/BOHEMIA_HOUSE_SKIN_VERDICT_7_21_26.txt, all 30 UP). No banks/
lookup produces anything new because nothing is created or selected; this is the
opposite of cooking.

TASTE CHECK: produces no candidates and reaches Paolo's thumbs with nothing. It
is his own approved art finally being drawn on the surface he plays.

Idempotent (marker HOUSE SKINS). Rebuild after: node tools/build_run_slice.js

  python3 tools/bohemia_run_houseskin_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
SRC = 'slices/BOHEMIA_RUN_SLICE_7_26_26.html'

s = open(SRC, encoding='utf8').read()
if 'HOUSE SKINS' in s:
    print('the run already wears his house skins. no-op.')
    sys.exit(0)

ANCHOR = "function isRoad(a,b){ return (a>=0&&b>=0&&a<W&&b<H) && G[b][a]===1; }"
SKINJS = """/* ==== HOUSE SKINS (7/28): PAOLO'S OWN 30, FINALLY DRAWN ====================
   ROOF_IMG / WALL_IMG / YARD_IMG carry his 7/21 verdict (all 30 UP,
   records/BOHEMIA_HOUSE_SKIN_VERDICT_7_21_26.txt). They were decoded into this
   page on every load and NEVER DRAWN - measured at zero draws by
   tools/bohemia_run_art_source_audit.js, exactly like his 13 border walls sat
   unused until earlier today.

   ONLY THE FIELD IS SKINNED. The building stack picks different tiles for the
   base course, eave shadow, corners, ridge, hips and garage mouth so a house
   reads as a MASS; those carry the shape and they keep the target set. The flat
   middle of a wall, the flat middle of a roof and the open yard are texture, and
   texture is what his banks are.

   ONE SKIN PER HOUSE - his own wall law where it obviously belongs: "each plot =
   ONE wall design (seeded per plot); variety BETWEEN plots; per-cell wall
   shuffle BANNED". A house wears one wall skin and one roof skin for its whole
   body; the house next door wears different ones. The yard is seeded per BLOCK,
   matching what the CITY tab already does with this same bank. ============== */
var SKIN_FIELD = { wall_0:'W', wall_1:'W', wall_2:'W', roof_slope:'R',
                   yard_0:'Y', yard_1:'Y', yard_2:'Y' };
var _footAt = null;
function footIndexAt(gx,gy){
  if(!_footAt){ _footAt={};
    (feet||[]).forEach(function(f,i){
      for(var y=f.y;y<f.y+f.h;y++)for(var x=f.x;x<f.x+f.w;x++) _footAt[x+','+y]=i; }); }
  var v=_footAt[gx+','+gy];
  return (v===undefined)?-1:v;
}
function skinImg(kind,gx,gy){
  var bank = kind==='R'?ROOF_IMG : kind==='W'?WALL_IMG : YARD_IMG;
  if(!bank||!bank.length) return null;
  var seed;
  if(kind==='Y'){                                  /* one yard per BLOCK */
    seed=(Math.imul((CELL&&CELL[0])|0,2654435761)^Math.imul((CELL&&CELL[1])|0,40503))>>>0;
  } else {                                         /* one skin per HOUSE */
    var fi=footIndexAt(gx,gy);
    if(fi<0) return null;                          /* not a known home: leave it */
    seed=(Math.imul(fi+1,2654435761)^Math.imul(kind==='R'?7919:104729,40503))>>>0;
  }
  var im=bank[seed%bank.length];
  return (im&&im.complete&&im.naturalWidth)?im:null;
}
function drawSkin(id,gx,gy,X,Y,S){
  var k=SKIN_FIELD[id]; if(!k) return false;
  var im=skinImg(k,gx,gy); if(!im) return false;
  ctx.drawImage(im,X,Y,S,S); return true;
}
""" + ANCHOR
if s.count(ANCHOR) != 1:
    print('HOUSE SKINS: the isRoad anchor did not match. NOT applied.')
    sys.exit(1)
s = s.replace(ANCHOR, SKINJS, 1)

# ---- the draw prefers his skin for the field tiles --------------------------
OLD = """        var laid = isSuburbCell()
          ? (body ? bodyTile(c,gx,gy2) : groundTile(c,gx,gy2))
          : genericTile(gx,gy2);
        if(!tput(laid,X,Y,S) && !body){"""
NEW = """        var laid = isSuburbCell()
          ? (body ? bodyTile(c,gx,gy2) : groundTile(c,gx,gy2))
          : genericTile(gx,gy2);
        /* HOUSE SKINS (7/28): his own approved texture for the FIELD tiles; the
           stack's shape tiles fall through to the target set untouched. */
        if(isSuburbCell() && drawSkin(laid,gx,gy2,X,Y,S)) continue;
        if(!tput(laid,X,Y,S) && !body){"""
if s.count(OLD) != 1:
    print('HOUSE SKINS: the tile draw anchor did not match. NOT applied.')
    sys.exit(1)
s = s.replace(OLD, NEW, 1)

OLD_FADE = """      var laid = isSuburbCell()
        ? (isBody(gx,gy2) ? bodyTile(G[gy2][gx],gx,gy2) : groundTile(G[gy2][gx],gx,gy2))
        : genericTile(gx,gy2);
      tput(laid,X,Y,S);"""
NEW_FADE = """      var laid = isSuburbCell()
        ? (isBody(gx,gy2) ? bodyTile(G[gy2][gx],gx,gy2) : groundTile(G[gy2][gx],gx,gy2))
        : genericTile(gx,gy2);
      /* HOUSE SKINS: the see-through pass draws the same tiles, so it needs his
         skins too or a faded wall reverts to the target set. */
      if(isSuburbCell() && drawSkin(laid,gx,gy2,X,Y,S)) return;
      tput(laid,X,Y,S);"""
if s.count(OLD_FADE) == 1:
    s = s.replace(OLD_FADE, NEW_FADE, 1)

# a new cell means new footprints; the lookup must not survive the load
OLD_RESET = "      buildSim(0);\n      toast('You crossed into the '+(CELLNAME||'valley')+'.');"
NEW_RESET = ("      buildSim(0);\n      _footAt=null;   /* HOUSE SKINS: new cell, new footprints */\n"
             "      toast('You crossed into the '+(CELLNAME||'valley')+'.');")
if s.count(OLD_RESET) == 1:
    s = s.replace(OLD_RESET, NEW_RESET, 1)

open(SRC, 'w', encoding='utf8').write(s)
print('HOUSE SKINS applied:')
print('  - the flat middle of every wall, roof and yard is HIS approved skin')
print('  - every tile that carries shape (base, eave, corners, ridge, hips, garage) is untouched')
print('  - one wall skin and one roof skin per HOUSE; one yard per BLOCK')
print('  NEXT: node tools/build_run_slice.js')
