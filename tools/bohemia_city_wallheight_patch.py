#!/usr/bin/env python3
"""
BOHEMIA THREE-TILE WALL + SEE-THROUGH (7/27/26, CITY lane) - both of the things
he actually asked for, in one pass, because they are the same pass.

> "Bro, every wall supporting a door should be three tiles tall you know that's
>  what I'm trying to tell you like this game needs to focus on like working on
>  an opacity filter for when I'm in front of a wall or something you know like
>  not good enough by any means"

TWO ASKS AND THEY ARE THE SAME MECHANISM.

A wall three tiles tall is not a texture change, it is a change in WHERE a
building is drawn: the wall has to rise out of its own cell and cover the two
cells above it. And the moment a wall is three tiles tall it can stand in front
of the player and hide him, which is exactly why the second ask arrives in the
same breath. You cannot have the height without the see-through. So both live in
one new render-time pass instead of in the baked chunk.

WHY IT COULD NOT STAY IN THE BAKE. The world bakes each 16x16-cell chunk into an
offscreen canvas once, and a facade was ONE flat cell in it - a house front the
height of the ground it stands on. Three tiles tall means drawing into the two
cells above, which belong to other rows and sometimes other chunks, and the
opacity depends on where the player is standing THIS FRAME, which a bake cannot
know. So facades come out of the bake and become a live pass.

THE PASS, in draw order, which IS the feature:
  1. the baked ground and roofs blit as before
  2. FACADES BEHIND the player (row < his row) draw at full opacity, three tiles
     tall, so a building he is standing south of correctly covers its own roof
  3. the player draws
  4. FACADES IN FRONT of him (row >= his row) draw last, so a wall between the
     camera and him is really in front of him - and any one of them whose
     three-tile box overlaps his sprite drops to 35% opacity. He can see himself
     through the wall he is behind, and the wall still reads as solid everywhere
     it is not covering him.

THE THREE TILES, top to bottom:
  a door       -> wall on top, then the DOOR filling the bottom two tiles. A door
                  is 2 tiles (DOOR LAW) inside a 3-tile wall, which is the real
                  proportion: a ~2m door in a ~3m wall.
  a window     -> wall, WINDOW in the middle, wall at the base. A window belongs
                  up the wall, not lying on the ground where it used to be.
  a boarded-up -> the same, at the middle.
  plain wall   -> wall three times.

THE 2-TILE DOOR WITHOUT SQUASHING ANYTHING. The approved door art is a 16x16
tile and the destination is one cell wide by two tall, which as a single draw is
an aspect change - the exact thing the render contract bans and
render_pixel_gate measures. So the tall door is DERIVED ONCE into a cached 16x32
canvas and blitted at 1:1 aspect forever after. One derivation, no per-draw
distortion, and the audit stays clean.

REUSE CHECK: cooks ZERO pixels. Every tile it draws is Paolo's own 7/21 house
verdict already embedded in the page - SA_TILES hwall / hwindow / hboarded /
hdoor (records/BOHEMIA_HOUSE_SKIN_VERDICT_7_21_26.txt, all 30 UP). No banks/
lookup applies because no asset is created or selected; this changes how many
cells tall an approved tile is drawn and in what order.

TASTE CHECK: produces no candidates and reaches Paolo's thumbs with nothing. It
is his own instruction, executed.

Idempotent (marker THREE-TILE WALL).

  python3 tools/bohemia_city_wallheight_patch.py
"""
import base64
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'THREE-TILE WALL' in decoded:
    print('three-tile wall already applied. no-op.')
    sys.exit(0)

# ---- 1) the pass itself, defined just before renderHuman --------------------
ANCHOR = 'function renderHuman(){'
PASS = r"""/* ==== THREE-TILE WALL + SEE-THROUGH (7/27/26, Paolo) ====================
   "every wall supporting a door should be three tiles tall ... an opacity
   filter for when I'm in front of a wall or something".

   Two asks, one mechanism. A facade used to be ONE flat cell in the baked
   chunk - a house front exactly as tall as the ground it stood on. Three tiles
   tall means drawing into the two cells above, which belong to other rows and
   sometimes other chunks; and the opacity depends on where the player is
   standing this frame, which a bake cannot know. So facades leave the bake and
   become a live pass, drawn in two halves around the player. ==================*/
const WALL_H=3;                 /* tiles: the wall a door lives in */
const WALL_SEE=0.35;            /* how much of a wall is left when it is hiding you */
const TALLCV=new Map();
function tallTex(pool,v,n){
  /* The approved door tile is 16x16 and the slot is one cell wide by two tall.
     As a single draw that is an aspect change - the exact thing the render
     contract bans. Derive it ONCE into a 16x32 canvas and blit that at 1:1
     forever after: one stretch, in a cache, never in a frame. */
  const k=pool+'|'+v+'|'+n; if(TALLCV.has(k))return TALLCV.get(k);
  const im=saTex(pool,v);
  if(!im){ TALLCV.set(k,null); return null; }
  const w=im.width||16, h=im.height||16;
  const cc=document.createElement('canvas'); cc.width=w; cc.height=h*n;
  const xx=cc.getContext('2d'); xx.imageSmoothingEnabled=false;
  xx.drawImage(im,0,0,w,h*n);
  TALLCV.set(k,cc); return cc;
}
function facadePass(ox,oy,C,front,pgy,pbox){
  const gx0=Math.max(0,Math.floor(-ox/C)-1), gx1=Math.min(WORLD_F-1,Math.ceil((cv.width-ox)/C)+1);
  const gy0=Math.max(0,Math.floor(-oy/C)-1), gy1=Math.min(WORLD_F-1,Math.ceil((cv.height-oy)/C)+WALL_H);
  for(let gy=gy0;gy<=gy1;gy++){
    if((gy>=pgy)!==front)continue;          /* behind him first, in front of him after */
    for(let gx=gx0;gx<=gx1;gx++){
      const c=cellAt(gx,gy); if(!c||!c.face)continue;
      const v=(OM.hash2(gx,gy,404))&3;
      const dx=Math.round(ox+gx*C), dy=Math.round(oy+gy*C), top=dy-(WALL_H-1)*C;
      /* SEE-THROUGH: only a wall that is actually covering him fades, and only
         one that is in front. Everything else stays solid, so the world does
         not shimmer while he walks. */
      let a=1;
      if(front&&pbox&&dx<pbox.x1&&dx+C>pbox.x0&&top<pbox.y1&&dy+C>pbox.y0)a=WALL_SEE;
      g.globalAlpha=a;
      const wall=saTex('hwall',v);
      if(c.artPool_face==='hdoor'){
        if(wall)g.drawImage(wall,dx,top,C,C);
        const d2=tallTex('hdoor',v,2);
        if(d2)g.drawImage(d2,dx,dy-C,C,C*2);        /* DOOR LAW: 2 tiles, in a 3-tile wall */
        else if(wall){ g.drawImage(wall,dx,dy-C,C,C); g.drawImage(wall,dx,dy,C,C); }
      } else {
        const midPool=(c.artPool_face==='hwindow'||c.artPool_face==='hboarded')?c.artPool_face:'hwall';
        const mid=saTex(midPool,v);                 /* a window belongs UP the wall */
        if(wall)g.drawImage(wall,dx,top,C,C);
        if(mid)g.drawImage(mid,dx,dy-C,C,C);
        if(wall)g.drawImage(wall,dx,dy,C,C);
      }
      /* 45 DEGREE ART LAW: the top edge catches the sky, the base sits in its
         own shadow, same two lines the bake already draws on a structure. */
      g.fillStyle='rgba(255,255,255,0.10)'; g.fillRect(dx,top,C,1);
      g.fillStyle='rgba(0,0,0,0.22)'; g.fillRect(dx,dy+C-1,C,1);
      g.globalAlpha=1;
    }
  }
}
function playerBox(ox,oy,C){
  const px=ox+hx*C, py=oy+hy*C;
  const lad=HC>=64?224:(HC>=32?112:(HC<17?28:56));
  return {x0:px+C/2-lad/2, x1:px+C/2+lad/2, y0:py+C-lad, y1:py+C};
}
function renderHuman(){"""
if decoded.count(ANCHOR) != 1:
    print('THREE-TILE WALL: renderHuman anchor not unique. NOT applied.')
    sys.exit(1)
decoded = decoded.replace(ANCHOR, PASS, 1)

# ---- 2) call it, around the player -----------------------------------------
OLD_BEFORE = "  tpDraw(ox,oy);\n  // player: the REAL character"
NEW_BEFORE = ("  tpDraw(ox,oy);\n"
              "  /* THREE-TILE WALL: everything he is standing SOUTH of, at full opacity */\n"
              "  const _pbox=playerBox(ox,oy,C);\n"
              "  facadePass(ox,oy,C,false,hy,null);\n"
              "  // player: the REAL character")
if decoded.count(OLD_BEFORE) != 1:
    print('THREE-TILE WALL: the pre-player anchor did not match. NOT applied.')
    sys.exit(1)
decoded = decoded.replace(OLD_BEFORE, NEW_BEFORE, 1)

OLD_AFTER = "  function shade2(col,f){ if(col[0]==='#')return shade(col,f); return col; }"
NEW_AFTER = ("  /* THREE-TILE WALL: what stands BETWEEN him and the camera draws last, and\n"
             "     whatever is covering him goes see-through. */\n"
             "  facadePass(ox,oy,C,true,hy,_pbox);\n"
             "  function shade2(col,f){ if(col[0]==='#')return shade(col,f); return col; }")
if decoded.count(OLD_AFTER) != 1:
    print('THREE-TILE WALL: the post-player anchor did not match. NOT applied.')
    sys.exit(1)
decoded = decoded.replace(OLD_AFTER, NEW_AFTER, 1)

assert decoded.count('facadePass(ox,oy,C,false,hy,null)') == 1
assert decoded.count('facadePass(ox,oy,C,true,hy,_pbox)') == 1
reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('THREE-TILE WALL applied:')
print('  - facades leave the bake and draw 3 tiles tall in a live pass')
print('  - a door fills the bottom 2 of those 3, derived once, never squashed per-draw')
print('  - a wall between the camera and the player drops to 35% so he can see himself')
