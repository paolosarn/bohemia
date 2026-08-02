#!/usr/bin/env python3
"""
CITY DOORFILL PATCH (8/2/26) -- the outdoor door stops being a picture of a door.

Paolo 7/31 + 8/1: "WHY IS THE DOOR NOT TAKING UP ALL THE SPACE OF THE 2 TILES ITS
IN. ITS LIKE A PICTURE OF THE DOOR BRO. WTF."

HE WAS DESCRIBING A MEASUREMENT. Read off the real canvas at HC=44 before this:
the SLOT is a correct 44x88, and the door pixels inside it were a 16 x 64 sliver
-- 29.2% of the slot, with 24px of plain tan stucco above it and 14px down each
side. Literally a small picture of a door printed on a wall tile.

WHY. SA_TILES.hdoor is a 16x16 STUCCO WALL with a 6x12 door painted in the middle
(measured: door mask is 6px of 16 wide, inset TOP 4). saTex() resamples every pool
tile into a TPX x TPX SQUARE; tallTex() then stretched that whole square --
padding and all -- to TPX x 2*TPX, which ALSO doubled the leaf's aspect from 1:2
to 1:4. The stretch was hidden inside a cache, so wallheight_gate's
"destination aspect === source aspect" check saw 22x44 -> 44x88 and passed.
A CACHED STRETCH IS STILL A STRETCH. It is only invisible to a drawImage probe.

THE FIX IS THE DOOR LAW'S OWN SENTENCE, BY FILENAME.
banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt, the residential swing pack, is 88x176 =
ONE WIDE, TWO TALL, native 1:2, 95.5-99.9% opaque. It is ALREADY embedded in the
blob as IN_DOOR_B64 and the INTERIOR already draws it. The OUTSIDE never did.
So this is not new art, it is the same approved door, drawn on both sides of the
same wall. Simulated on the real slot: 94.0-96.8% coverage, versus 29.2% today.

Never routed through saTex: squaring the plate is exactly what broke it.

REUSE CHECK: cooks no graphic pixels and opens no bank file. It points the facade
pass at IN_DOOR_B64, already embedded, already approved, already consumed by the
interior renderer.

Idempotent: re-running finds the marker and reports NOOP.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARKER = 'DOOR FILLS ITS TWO TILES'

E1_OLD = "function facadePass(ox,oy,C,front,pgy,pbox){"
E1_NEW = """/* THE APPROVED DOOR BANK, REACHABLE FROM THE FACADE PASS (8/2).
   IN_DOOR_B64/IN_DOOR_IMG is the residential swing pack out of
   banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt: 88x176 = ONE WIDE, TWO TALL, the size
   the DOOR LAW names. It is declared further down this same script, so it is
   reached through a var holder filled the moment it exists -- a direct const
   reference would be a TDZ throw if any frame ever rendered early.
   PER-ZOOM CACHE: the plate is derived ONCE per (variant, cell size) into a
   C x 2C canvas and blitted forever after, the same discipline TALLCV and
   PPL_CACHE already use. 88:176 into C:2C is 1:2 into 1:2 -- not a stretch at any
   zoom stop, and an exact 1/2, 1/4, 1/8 downscale at HLEVELS 44, 22, 11. */
var FACADE_DOOR_BANK=null;
const FDOOR_CV=new Map();
function facadeDoor(v,C){
  if(!FACADE_DOOR_BANK||!FACADE_DOOR_BANK.length)return null;
  const i=(v>>>0)%FACADE_DOOR_BANK.length, im=FACADE_DOOR_BANK[i];
  if(!im||!im.complete||!im.naturalWidth)return null;
  const k=i+'|'+C; let c=FDOOR_CV.get(k); if(c)return c;
  c=document.createElement('canvas'); c.width=C; c.height=C*2;
  const xx=c.getContext('2d'); xx.imageSmoothingEnabled=false;
  xx.drawImage(im,0,0,C,C*2);
  FDOOR_CV.set(k,c); return c;
}
function facadePass(ox,oy,C,front,pgy,pbox){"""

E2_OLD = """      const wall=saTex('hwall',v);
      if(c.artPool_face==='hdoor'){
        if(wall)g.drawImage(wall,dx,top,C,C);
        const d2=tallTex('hdoor',v,2);
        if(d2)g.drawImage(d2,dx,dy-C,C,C*2);        /* DOOR LAW: 2 tiles, in a 3-tile wall */
        else if(wall){ g.drawImage(wall,dx,dy-C,C,C); g.drawImage(wall,dx,dy,C,C); }
      } else {"""
E2_NEW = """      const wall=saTex('hwall',v);
      if(c.artPool_face==='hdoor'){
        if(wall)g.drawImage(wall,dx,top,C,C);
        /* """ + MARKER + """ (Paolo: "WHY IS THE DOOR NOT TAKING UP ALL THE
           SPACE OF THE 2 TILES ITS IN. ITS LIKE A PICTURE OF THE DOOR BRO").
           Measured before this: the SLOT was a correct 44x88 and the door pixels
           in it were a 16x64 sliver, 29.2% of the slot, 24px of plain stucco
           above it. SA_TILES.hdoor is a 16x16 WALL with a 6x12 door painted on
           it; saTex squares every pool tile and tallTex stretched that square,
           padding and all, which also doubled the leaf from 1:2 to 1:4. The
           stretch sat inside a cache, so an aspect check saw 22x44 -> 44x88 and
           passed. A cached stretch is still a stretch.
           Now the outside draws the SAME approved 88x176 plate the interior
           already draws, so a door is one door in one game. 94-96.8% of the
           slot. Never through saTex -- squaring the plate is what broke it. */
        const dr=facadeDoor(v,C);
        if(dr)g.drawImage(dr,dx,dy-C,C,C*2);
        else { const d2=tallTex('hdoor',v,2);
          if(d2)g.drawImage(d2,dx,dy-C,C,C*2);
          else if(wall){ g.drawImage(wall,dx,dy-C,C,C); g.drawImage(wall,dx,dy,C,C); } }
      } else {"""

E3_OLD = "const IN_DOOR_IMG=IN_DOOR_B64.map(function(b){ const im=new Image(); im.src='data:image/png;base64,'+b; return im; });"
E3_NEW = E3_OLD + "\nFACADE_DOOR_BANK=IN_DOOR_IMG;   /* ONE DOOR, INSIDE AND OUT: the facade pass and the interior now blit the same approved 88x176 plate. */"


def main():
    alpha = open(ALPHA, encoding='utf8', errors='ignore').read()
    m = re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})", alpha)
    if not m:
        print('FAIL: CITY_B64 not found'); return 1
    city = base64.b64decode(m.group(1)).decode('utf8', errors='ignore')
    if MARKER in city:
        print('NOOP: the outdoor door already fills its two tiles'); return 0

    for name, old in (('facadePass', E1_OLD), ('the hdoor branch', E2_OLD), ('IN_DOOR_IMG', E3_OLD)):
        n = city.count(old)
        if n != 1:
            print('FAIL: %s anchor found %d times, expected 1' % (name, n)); return 1

    city = city.replace(E1_OLD, E1_NEW, 1).replace(E2_OLD, E2_NEW, 1).replace(E3_OLD, E3_NEW, 1)
    out = base64.b64encode(city.encode('utf8')).decode('ascii')
    open(ALPHA, 'w', encoding='utf8').write(alpha[:m.start(1)] + out + alpha[m.end(1):])
    print('wrote %s' % ALPHA)
    print('  the outdoor door now blits the approved 88x176 plate, 1:2 into 1:2')
    print('  same door the interior already draws -- one door, inside and out')
    return 0


if __name__ == '__main__':
    sys.exit(main())
