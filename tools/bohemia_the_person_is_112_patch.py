#!/usr/bin/env python3
"""
V223 -- THE PERSON IS 112, THE GROUND IS HIS OWN ART  (COMBAT lane, [fight looks])

Three things the board named this round, all inside this row, all in the picture.

--------------------------------------------- ONE: THE PERSON IS 112 (RULE 21)

Rule 21 (coordinator 9/21): "A person is drawn at ONE pixel size on every surface he
walks or fights on (112 box, about 100 px painted) and the camera moves the ground,
never his size... the fight leg OWED to COMBAT [fight looks]."

The whole defect is one function, and THE BLOCK IT SITS IN ALREADY SAYS IT IS WRONG.
Two lines above it, V198's own headline:

    ===== V198 THE GROUND IS WIDER AND THE PERSON IS NOT =====
    HIS SENTENCE: "the size of the 'ground' changes but the player is the same size
    just what they 'walk' on is a more zoomed out city"
    So this multiplies the FLOOR PITCH and NEVER TOUCHES bodyScale.

and then, underneath it:

    function bodyScale(){ return 1/FIELD_ZOOM; }   /* the people ride the same
                                                      number as the floor */

FIELD_ZOOM is 3, so the fighter is drawn at 37 px against the street's 112. That is
CHARACTER's 3.03x exactly, and it is not a tuning choice, it is a line that
contradicts the paragraph directly above it.

AND IT DRAGS TWO MORE RULED NUMBERS DOWN WITH IT. TILE_WIDE is declared "[DIAL] a
house tile in SPRITE WIDTHS -- his number", 1.75, and tileWideMult builds the tile as
TILE_WIDE * (112*bodyScale()). With the body a third of itself the house lot is a
third of itself too: 65 px where 1.75 sprite widths is 196. So one division was
shrinking the person, the lot and the build radius together, and putting the body
back at 112 puts all three back at once, DERIVED:

    the body     112 px          the box the street has shipped at for months
    a house lot  196 px          1.75 sprite widths, which is what the dial says
    the body     0.57 of a lot   "about half a lot tall", rule 16's own default

Nothing is typed. The body board is untouched: bodyScale is 1/FIELD_ZOOM there, byte
for byte, because houseOn() is false.

---------------------------------- TWO: THE GROUND IS THE ART HE ALREADY APPROVED

COOK db792724 cooked the fight's whole ground bank out of art he approved on 7/28 --
13 kinds, 66 images at 44 px and the same 66 at 88 -- and the board's note says WIRE
IT NOW, because it is his own approved art and needs no vote. COOK 60a52ac9 measured
why it matters: the fight's own bank is the city's street from BEFORE the 9/13
recook, byte for byte, so no cook of the city could ever reach it.

The old four banks (STREET_B64, S, X, W) are emptied and the cooked bank is loaded in
their place, so the fight carries ONE ground bank and it is his.

COOK's drawing rule, in their words: "Draw 44 at 1:1 or 88 at 2x, never 44 at 67
(that 1.523 scale IS the blur)." Taken as the general rule it is: NEVER UPSCALE A
SOURCE TILE BY A FRACTION.

  - A LOT PATCH IS PURE MINIFICATION, so it is free of the rule: the patch is now
    built AT THE SIZE IT IS DRAWN (196 px), each of its 16x16 street cells landing at
    12.25 px from a 44 px source. That is the same shrink the walked street does
    (44 -> 11, measured), and the patch now blits 1:1 instead of V222's 176 -> 196,
    which was itself a 1.11 fractional upscale. It also drops the patch from 124 KB
    to 154 KB per face at a far larger tile, and removes LOT_SUBPX as a typed number.
  - A MARKING OR A ROOF is one tile across the cell and cannot be tiled (V222
    photographed the alternative wiping the road's yellow dashes out), so at a 196 px
    lot it has to come up from the source. It now comes up from COOK's 88 px art
    rather than the 44, which is what that second set was cooked for.

------------------------------------------ THREE: THE FIGHT DREW TWO GRIDS, THE
                                            STREET DRAWS NONE

The sweep's note 3: "two grids drawn over the floor (drawFloor 32.5 px,
fieldFloorPaint per cell), the street draws none", and DIRECTION round 2: "the chrome
grew". MEASURED FIRST, because one of the two is not what it looks like: drawFloor is
painted UNDER the board and photographed being completely covered, so its grid has
never been on his screen at all. It goes anyway, since it costs a stroke per cell of
a canvas nobody sees.

The one he DOES see is fieldFloorPaint's. It goes, behind a dial, because the ship
test is that a stranger cannot tell where the walk ended and the fight began, and a
grid the street does not draw is the single loudest thing saying "this is a different
program". The cell is still readable: a body stands mid-cell, the ground is now real
street art with kerbs and markings, and every other board read (the way out, reach
rings, the aim line) draws its own shape.

NO DAMAGE BEFORE THE DIAL: not a reach, a chance, a hit or a turn. MAP LAW held: this
authors no street. The body board cannot move: every change is behind houseOn() or is
the bank swap, which is the same 13 kinds under the same names.
"""
import base64
import json
import os
import re
import subprocess
import sys
import tempfile

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
BANK = 'banks/BOHEMIA_THE_FIGHT_FLOOR_9_21_26.txt'
MARK = '__THE_PERSON_IS_112__'

# ---------------------------------------------------------------- ONE: the person

OLD_BODY = """function bodyScale(){ return 1/FIELD_ZOOM; }   /* the people ride the same number as the floor */"""

NEW_BODY = """/* ===== V223 __THE_PERSON_IS_112__ (COMBAT, [fight looks], rule 21) ==============
   *** THE LINE BELOW CONTRADICTED THE PARAGRAPH DIRECTLY ABOVE IT. *** V198's own
   headline is "THE GROUND IS WIDER AND THE PERSON IS NOT", quoting him -- "the size
   of the 'ground' changes but the player is the same size" -- and saying in its own
   words that it "NEVER TOUCHES bodyScale". Then bodyScale divided the person by the
   floor's zoom anyway, so at FIELD_ZOOM 3 the fighter was drawn at 37 px against the
   street's 112. That is CHARACTER's measured 3.03x, and rule 21 settles it: one
   pixel size on every surface he walks or fights on, and the camera moves the
   ground, never his size.
   AND THE SAME DIVISION WAS SHRINKING TWO MORE RULED NUMBERS. TILE_WIDE is declared
   "[DIAL] a house tile in SPRITE WIDTHS -- his number", and tileWideMult builds the
   lot as TILE_WIDE * (112*bodyScale()), so a third of a person made a third of a
   house: 65 px where 1.75 sprite widths is 196. Putting the body back puts the lot
   back, and the body lands at 0.57 of a lot -- "about half a lot tall", which is
   rule 16's own default, arrived at rather than typed.
   The body board is untouched (houseOn() is false there, so the old value runs). */
function bodyScale(){ return houseOn()?1:(1/FIELD_ZOOM); }"""

# ------------------------------------------------------- THREE: one grid, not two

OLD_FGRID = """    x.strokeStyle='rgba(18,14,10,0.6)'; x.lineWidth=1;      /* the grid he can read */
    for(let wx=gx0; wx<=gx1; wx++){ const sx2=Math.round(cx+(wx-offx+0.5)*t)+0.5;
      x.beginPath(); x.moveTo(sx2,-H*2); x.lineTo(sx2,H*3); x.stroke(); }
    for(let wy=gy0; wy<=gy1; wy++){ const sy2=Math.round(cy+(wy-offy+0.5)*t)+0.5;
      x.beginPath(); x.moveTo(-W*2,sy2); x.lineTo(W*3,sy2); x.stroke(); }"""

NEW_FGRID = """    /* V223 __THE_PERSON_IS_112__: THE STREET DRAWS NO GRID AND THE FIGHT DREW TWO.
       DIRECTION round 2: "the chrome grew". The ship test is that a stranger cannot
       tell where the walk ended and the fight began, and a grid the walked world
       does not have is the loudest thing on the glass saying this is a different
       program. The cell stays readable without it: a body stands mid-cell, the
       ground is real street art with kerbs and markings now, and the way out, the
       reach rings and the aim line all draw their own shapes.
       ON A DIAL, because it is a read he may want back in one word. */
    if(G.cellGrid){
      x.strokeStyle='rgba(18,14,10,0.6)'; x.lineWidth=1;
      for(let wx=gx0; wx<=gx1; wx++){ const sx2=Math.round(cx+(wx-offx+0.5)*t)+0.5;
        x.beginPath(); x.moveTo(sx2,-H*2); x.lineTo(sx2,H*3); x.stroke(); }
      for(let wy=gy0; wy<=gy1; wy++){ const sy2=Math.round(cy+(wy-offy+0.5)*t)+0.5;
        x.beginPath(); x.moveTo(-W*2,sy2); x.lineTo(W*3,sy2); x.stroke(); } }"""

OLD_DGRID = """  x.lineWidth=1; x.strokeStyle=f.line;
  for(let gx=-T;gx<W+T;gx+=T){ x.beginPath();x.moveTo(gx+ox,0);x.lineTo(gx+ox,H);x.stroke(); }
  for(let gy=-T;gy<H+T;gy+=T){ x.beginPath();x.moveTo(0,gy+oy);x.lineTo(W,gy+oy);x.stroke(); }"""

NEW_DGRID = """  /* V223 __THE_PERSON_IS_112__: the second of the two grids, and MEASURED IT IS NOT
     WHAT IT LOOKS LIKE -- this whole surface is painted UNDER the board and was
     photographed being completely covered, so this grid has never been on his screen.
     It goes anyway: it is a stroke per cell of a canvas nobody sees. */"""

# ----------------------------------------------------- TWO: the lot patch redrawn

OLD_PATCH_HEAD = """const STREET_CELL_M=0.75;   /* the walked city's fine cell, in metres. THEIR number. */
const LOT_SUBPX=11;         /* what the WALKED street draws a 44px tile at. Measured. */
const LOT_FACES=8;          /* how many faces a kind can wear, so the cache is bounded */"""

NEW_PATCH_HEAD = """const STREET_CELL_M=0.75;   /* the walked city's fine cell, in metres. THEIR number. */
const LOT_FACES=8;          /* how many faces a kind can wear, so the cache is bounded */
/* V223 __THE_PERSON_IS_112__: LOT_SUBPX IS GONE, and it was the last typed number in
   this path. V222 composed the lot at 16 x 11 = 176 px and then drew it at the cell
   size, which at the ruled 196 px lot is a 1.11 FRACTIONAL UPSCALE -- exactly the
   class of blur COOK named ("never 44 at 67, that 1.523 scale IS the blur"). The
   patch is now built AT THE SIZE IT IS DRAWN, so it blits 1:1 and every street cell
   inside it is a pure shrink of a 44 px source, which is the same operation the
   walked street performs (44 -> 11, measured). */"""

OLD_PATCH = """function lotPatch(kind,face){
  if(!STREET_READY)return null;"""

NEW_PATCH = """function lotPatch(kind,face,px){
  if(!STREET_READY)return null;"""

OLD_PATCH_BODY = """  const n=lotSub(); const key=kind+'|'+face+'|'+n;
  if(_LOTP[key]!==undefined)return _LOTP[key];
  const px=n*LOT_SUBPX;
  const c=document.createElement('canvas'); c.width=c.height=px;
  const g=c.getContext('2d'); g.imageSmoothingEnabled=false;"""

NEW_PATCH_BODY = """  const n=lotSub(); px=Math.max(n,Math.round(px||0)); const key=kind+'|'+face+'|'+n+'|'+px;
  if(_LOTP[key]!==undefined)return _LOTP[key];
  const sub=px/n;            /* a street cell, at the size the camera actually shows */
  const c=document.createElement('canvas'); c.width=c.height=px;
  const g=c.getContext('2d'); g.imageSmoothingEnabled=(sub<44);   /* shrinking, so filter */"""

OLD_PATCH_LOOP = """    const ox=sx*LOT_SUBPX, oy=sy*LOT_SUBPX;
    if(rot){ g.save(); g.translate(ox+LOT_SUBPX/2,oy+LOT_SUBPX/2); g.rotate(rot*Math.PI/2);
      g.drawImage(im,-LOT_SUBPX/2,-LOT_SUBPX/2,LOT_SUBPX,LOT_SUBPX); g.restore(); }
    else g.drawImage(im,ox,oy,LOT_SUBPX,LOT_SUBPX);"""

NEW_PATCH_LOOP = """    const ox=sx*sub, oy=sy*sub;
    if(rot){ g.save(); g.translate(ox+sub/2,oy+sub/2); g.rotate(rot*Math.PI/2);
      g.drawImage(im,-sub/2,-sub/2,sub,sub); g.restore(); }
    else g.drawImage(im,ox,oy,sub,sub);"""

OLD_CELL = """      const _lp=houseOn()?lotPatch(_sk,(_sk==='lot')
        ?((Math.imul((wx>>2)|0,73856093)^Math.imul((wy>>2)|0,19349663))>>>0)%LOT_FACES
        :(h%LOT_FACES)):null;
      const _st=_lp||streetTile(_sk,_si,Math.ceil(t)+1,(h/_sn)|0);
      if(_lp){ const _sm=x.imageSmoothingEnabled; x.imageSmoothingEnabled=true;
        x.drawImage(_lp,Math.floor(sx2),Math.floor(sy2),Math.ceil(t)+1,Math.ceil(t)+1);
        x.imageSmoothingEnabled=_sm; }"""

NEW_CELL = """      const _px=Math.ceil(t)+1;
      const _lp=houseOn()?lotPatch(_sk,(_sk==='lot')
        ?((Math.imul((wx>>2)|0,73856093)^Math.imul((wy>>2)|0,19349663))>>>0)%LOT_FACES
        :(h%LOT_FACES),_px):null;
      const _st=_lp||streetTile(_sk,_si,_px,(h/_sn)|0);
      /* V223: built at the size it is drawn, so this is a 1:1 blit and not a 1.11
         fractional upscale of a 176 px patch. */
      if(_lp){ x.drawImage(_lp,Math.floor(sx2),Math.floor(sy2)); }"""

# ----------------------------------------------- TWO: markings come up from the 2x

OLD_TILE = """  const src=(STREET_IMG[kind]||[])[idx]; if(!src)return null;
  const c=document.createElement('canvas'); c.width=c.height=px;
  const g=c.getContext('2d'); g.imageSmoothingEnabled=false;"""

NEW_TILE = """  /* V223 __THE_PERSON_IS_112__: A MARKING COMES UP FROM THE 2x ART, WHICH IS WHAT IT
     WAS COOKED FOR. COOK shipped every tile twice, at 44 and at 88, and said in as
     many words: "draw 44 at 1:1 or 88 at 2x, never 44 at 67 -- that 1.523 scale IS
     the blur". A median or a kerb is the tile, drawn once across the cell (V222
     photographed what tiling one does to the road's yellow dashes), so at the ruled
     196 px lot it has no choice but to come up, and it comes up from the larger
     picture rather than doubling the blur of the small one. */
  const _bank=(px>44&&(STREET_IMG2X[kind]||[])[idx])?STREET_IMG2X:STREET_IMG;
  const src=(_bank[kind]||[])[idx]; if(!src)return null;
  const c=document.createElement('canvas'); c.width=c.height=px;
  const g=c.getContext('2d'); g.imageSmoothingEnabled=(px<(_bank===STREET_IMG2X?88:44));"""


def parse_check(blob, label):
    """EVERY SCRIPT IN THE BLOB STILL PARSES. V214 terminated a JS string and the fight
    stopped defining G; V217's first cut left a block comment open and the last script
    went silent. A guard that checks whether the file still runs rather than the text
    it wrote is not a guard."""
    bodies = re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', blob, re.S | re.I)
    if not bodies:
        sys.exit('GUARD %s: no inline scripts found, which cannot be right' % label)
    bad = 0
    for i, b in enumerate(bodies):
        fd, p = tempfile.mkstemp(suffix='.js')
        os.write(fd, b.encode('utf-8'))
        os.close(fd)
        r = subprocess.run(['node', '--check', p], capture_output=True)
        os.unlink(p)
        if r.returncode != 0:
            bad += 1
            print('  SCRIPT %d OF %d DOES NOT PARSE:' % (i + 1, len(bodies)),
                  r.stderr.decode('utf-8', 'replace').strip().splitlines()[-1][:160])
    if bad:
        sys.exit('GUARD %s: %d of %d scripts do not parse' % (label, bad, len(bodies)))
    print('  %s: %d scripts, all parse' % (label, len(bodies)))


def sub(s, old, new, what):
    n = s.count(old)
    if n != 1:
        sys.exit('ANCHOR %s: expected 1, found %d' % (what, n))
    return s.replace(old, new, 1)


def empty_bank(blob, name):
    """The old bank literal is one enormous line. It is replaced by a SHAPE rather
    than by {} because the lines just below it index into it (STREET_B64X.lot.slice)
    and a missing key throws before the cooked bank ever loads."""
    m = re.search(r'^const ' + name + r'=\{.*?\};?$', blob, re.M)
    if not m:
        sys.exit('ANCHOR bank/%s: not found as a single line' % name)
    keys = re.findall(r'"([A-Za-z0-9_]+)"\s*:', m.group(0))
    stub = ('const ' + name + '={' + ','.join('"%s":[]' % k for k in keys)
            + '};   /* V223 __THE_PERSON_IS_112__: emptied; the fight loads COOK\'s '
              'cooked bank below (db792724), so there is ONE ground bank and it is his */')
    return blob[:m.start()] + stub + blob[m.end():]


def main():
    alpha = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64='([^']+)'", alpha)
    if not m:
        sys.exit('COMBAT_B64 not found in the alpha')
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in blob:
        print('  the person is already 112')
        return
    if '__THE_LOT_IS_SIXTEEN_TILES__' not in blob:
        sys.exit('GUARD: V222 is not in this blob; V223 is written on top of it')

    cook = json.load(open(BANK, encoding='utf-8'))
    t44, t88 = cook['tiles']['44'], cook['tiles']['88']
    if sorted(t44) != sorted(t88):
        sys.exit('GUARD: the cooked bank\'s two sizes do not carry the same kinds')

    blob = sub(blob, OLD_BODY, NEW_BODY, 'blob/bodyScale')
    blob = sub(blob, OLD_DGRID, NEW_DGRID, 'blob/the faction floor grid')
    blob = sub(blob, OLD_FGRID, NEW_FGRID, 'blob/the board grid')
    blob = sub(blob, OLD_PATCH_HEAD, NEW_PATCH_HEAD, 'blob/the patch head')
    blob = sub(blob, OLD_PATCH, NEW_PATCH, 'blob/lotPatch signature')
    blob = sub(blob, OLD_PATCH_BODY, NEW_PATCH_BODY, 'blob/lotPatch body')
    blob = sub(blob, OLD_PATCH_LOOP, NEW_PATCH_LOOP, 'blob/lotPatch loop')
    blob = sub(blob, OLD_CELL, NEW_CELL, 'blob/the board cell')
    blob = sub(blob, OLD_TILE, NEW_TILE, 'blob/streetTile')

    for name in ('STREET_B64', 'STREET_B64S', 'STREET_B64X', 'STREET_B64W'):
        blob = empty_bank(blob, name)

    # THE COOKED BANK GOES IN AFTER EVERY OLD LOADER, so nothing it sets can be
    # overwritten by one of them, and it drives the same STREET_READY latch.
    load = ("\n/* ===== V223 __THE_PERSON_IS_112__: THE GROUND HE ALREADY APPROVED ==========\n"
            "   COOK db792724 cooked this out of banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26\n"
            "   (Paolo 7/28: \"I checked it to do the other 41 mark it approved\"): 13 kinds, 66\n"
            "   images at 44 px and the same 66 at 88. The board's note says WIRE IT NOW and that\n"
            "   it needs no vote, because it is his own approved art and not a new thing.\n"
            "   WHY IT MATTERS, measured by COOK 60a52ac9: the bank this replaces was the city's\n"
            "   street from BEFORE the 9/13 recook, byte for byte, inside a document that never\n"
            "   calls the city's floor -- so no cook of the city could ever reach the fight. The\n"
            "   four old banks above are emptied, so there is ONE ground bank now and it is his.\n"
            "   kerbL, kerbR, gutterL and gutterR come with EIGHT, EIGHT, FOUR and FOUR pictures\n"
            "   where they had one each and tiled identically down the whole frame. */\n"
            "const STREET_B64_2X=" + json.dumps(t88, separators=(',', ':')) + ";\n"
            "const STREET_IMG2X={};\n"
            "(function(){ const B=" + json.dumps(t44, separators=(',', ':')) + ";\n"
            "  const one=(bank,img,k,i,b)=>{ _stPend++; const im=new Image();\n"
            "    im.onload=()=>{ img[k][i]=im; if(--_stPend===0)STREET_READY=true; };\n"
            "    im.onerror=()=>{ if(--_stPend===0)STREET_READY=true; };\n"
            "    im.src='data:image/png;base64,'+b; };\n"
            "  for(const k in B){ STREET_B64[k]=B[k]; STREET_IMG[k]=[];\n"
            "    B[k].forEach((b,i)=>one(B,STREET_IMG,k,i,b)); }\n"
            "  for(const k in STREET_B64_2X){ STREET_IMG2X[k]=[];\n"
            "    STREET_B64_2X[k].forEach((b,i)=>one(STREET_B64_2X,STREET_IMG2X,k,i,b)); } })();\n"
            "/* ===== /V223 __THE_PERSON_IS_112__ ===== */\n")
    anchor = "const ST_SPIN={road:1,walk:1,lot:1,yard:1};   /* isotropic surfaces only */"
    blob = sub(blob, anchor, load + anchor, 'blob/the cooked bank goes in')

    code = re.sub(r'/\*.*?\*/', '', blob, flags=re.S)
    # THE RULED SIZE IS READ FROM ONE PLACE AND IS NOT TYPED ANYWHERE ELSE.
    if code.count('function bodyScale(') != 1:
        sys.exit('GUARD: bodyScale is defined %d times' % code.count('function bodyScale('))
    if 'houseOn()?1:(1/FIELD_ZOOM)' not in code:
        sys.exit('GUARD: the ruled body size is not on the house board')
    if 'LOT_SUBPX' in code:
        sys.exit('GUARD: LOT_SUBPX survived; the patch is still a typed size')
    # ONE BANK. A second live bank is the whole defect COOK measured.
    for name in ('STREET_B64', 'STREET_B64S', 'STREET_B64X', 'STREET_B64W'):
        mm = re.search(r'const ' + name + r'=\{([^\n]*)\};', code)
        if mm and 'iVBOR' in mm.group(1):
            sys.exit('GUARD: %s still carries pictures; the old bank is still live' % name)
    if code.count('const STREET_B64_2X=') != 1 or code.count('const STREET_IMG2X=') != 1:
        sys.exit('GUARD: the 2x bank is not defined exactly once')
    # THE GRID IS BEHIND A DIAL, NOT DELETED.
    if code.count('if(G.cellGrid)') != 1:
        sys.exit('GUARD: the board grid is not behind its dial')
    parse_check(blob, 'the fight blob')
    enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
    alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                          "const COMBAT_B64='" + enc + "'", 1)
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('V223 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
