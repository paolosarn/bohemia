#!/usr/bin/env python3
"""
V222 -- ONE TILE STRETCHED OVER A WHOLE HOUSE  (COMBAT lane, [fight looks])

Paolo 9/20: "the combat is still dogshit, it's not at scale, it feels like it's in a
different world than the demo." His friend, on the link: "a checkerboard of orange
roof tiles for a floor."

The row orders a MEASUREMENT before anything is built, on the deployed cut, with the
one driver. I ran it. Here is the whole answer in four numbers, all read off the
glass by wrapping drawImage on both surfaces in the same session:

                            source art        drawn at        ground it covers
    THE WALKED STREET       44 x 44 px        11 x 11 px      0.75 m
    THE FIGHT               44 x 44 px        66 x 66 px      12 m

*** IT IS THE SAME 44-PIXEL TILE. The street shrinks it to eleven pixels. The fight
blows it up to sixty-six. Six times bigger, over sixteen times more ground. ***

So one house lot -- a thing the walked city paints with 256 tiles, and even
pre-composes as a single 704x704 chunk -- the fight paints with ONE tile, smeared
across the whole lot. That is why the asphalt cracks read as continents and the
sidewalk reads as a repeating orange stamp. It is not a missing renderer and it is
not the faction floor: drawFloor was photographed being fully covered.

THE BODIES ARE NOT THE BUG, and the measurement is what says so. The same 112x112
body canvas is drawn at 112 px on the street and 37 px in the fight -- 6.0x smaller,
against a camera that is 5.3x further back (14.7 vs 2.75 screen pixels per metre of
ground). Within fourteen percent, the people are already right for the pull-back the
ship test explicitly allows ("except that the camera pulled back"). The ground is
16x wrong. So this round moves the ground and does not touch a body.

------------------------------------------------------------------ WHAT THIS DOES

A board cell stops drawing one tile and draws THE LOT: a patch of the street's own
cells, each one its own variant and its own quarter-turn, composed at the size the
walked street composes at and then let down by the camera.

    lotSub()     tileMetres() / 0.75      how many walked-city cells fit in a board
                                          cell. 0.75 m is the city's own CELL_M
                                          (slices/BOHEMIA_CITY_WORLD.html:2474,
                                          "metres per fine cell"). House board: 16.
                                          Body board: 2.
    LOT_SUBPX    11                       what the walked street actually draws a
                                          44 px tile at, measured on the cut.
    patch        16 * 11 = 176 px         which is the city's own 704x704 lot chunk
                                          at its own 4x reduction. Not a coincidence
                                          and not a pick: it is their number.

DERIVED, NOT PICKED, and the body board cannot move: the whole patch path is behind
houseOn(). On the body board the old line runs, byte for byte.

MAP LAW HELD. This authors no street. streetKindAt still decides what a cell IS --
median, lane, kerb, gutter, walk, lot -- exactly as before. The patch only decides
how finely that one material is drawn. The variation pattern stays one deterministic
function of the cell, which is V94's and V96's own promise, and the lot keeps its
4x4 region dominance (V97) because the patch seed for a lot is the region.

NO DAMAGE BEFORE THE DIAL: nothing here touches a reach, a chance, a hit or a turn.
It is paint.

MEMORY: the patch is cached per kind and per face, eight faces, built lazily. In a
street fight that is about eight kinds, so ~64 canvases of 176x176 -- under 8 MB,
against the 27 MB of tile bank the walked street already carries. The floor cache
(__FLOOR_CACHE__) is untouched and still collapses the whole board to one blit, so
the per-frame cost does not move.

-------------------------------------------------------------- WHAT IT DOES *NOT*

Routed to DIRECTION with the photographs, not fixed here, because each is its own
ruling and this round is allowed one change:

  - THE FIGHT SHARES ZERO ART WITH THE STREET. Its 47 tiles were hashed against the
    walked city's 9,451. Not one byte-identical pair. The fight carries a second,
    frozen ground bank of its own.
  - A LANE MARKING IS TWELVE METRES WIDE. streetKindAt places median, lane, kerb and
    gutter per BOARD cell, so at house scale one yellow dash line is a whole lot
    across and the road is 96 m wide. Fixing that means declaring the street at fine
    resolution, which is authoring a street, which is MAP LAW's business.
  - A MARKING STILL CANNOT TILE, so the twelve-metre lane above is untouched: only
    the isotropic materials ST_SPIN already names (road, walk, lot, yard, slab) take
    the patch. Photographed the alternative -- tiling the median sixteen times wiped
    the yellow dashes off the road entirely.
  - THE STREET HAS NO GRID AND THE FIGHT DRAWS ONE ON EVERY CELL.
  - THE TWO SURFACES RENDER AT DIFFERENT SHARPNESS: the walked canvas is device
    ratio 1, the fight canvas is 2.
"""
import base64
import os
import re
import subprocess
import sys
import tempfile

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_LOT_IS_SIXTEEN_TILES__'

OLD_SPIN = """const ST_SPIN={road:1,walk:1,lot:1,yard:1};   /* isotropic surfaces only */"""

NEW_SPIN = """const ST_SPIN={road:1,walk:1,lot:1,yard:1};   /* isotropic surfaces only */
/* ===== V222 __THE_LOT_IS_SIXTEEN_TILES__ (COMBAT, [fight looks]) ================
   MEASURED ON THE DEPLOYED CUT, by wrapping drawImage on both surfaces in one
   session, which is the only way this was ever going to be honest:

                       source art     drawn at     ground it covers
     THE WALK          44 x 44        11 x 11      0.75 m
     THE FIGHT         44 x 44        66 x 66      12 m

   THE SAME 44-PIXEL TILE. The street shrinks it to eleven pixels; the fight blows
   it up to sixty-six and asks it to cover sixteen times more ground in each
   direction. One house lot -- which the walked city paints with 256 tiles, and even
   pre-composes as a single 704x704 chunk -- the fight painted with ONE, smeared.
   That is the continent-sized crack, and it is Paolo's "not at scale" and "a
   different world than the demo", in one number.

   So a board cell draws THE LOT now: a patch of the walked city's own cells, each
   with its own variant and its own quarter-turn, composed at the size the street
   composes at, and then let down by the camera -- which the ship test allows.

   NOTHING IS PICKED. lotSub() is tileMetres() over the walked city's own CELL_M of
   0.75 m ("metres per fine cell", BOHEMIA_CITY_WORLD.html), so the house board gets
   16 and the body board gets 2. LOT_SUBPX is what the walked street was measured
   drawing a 44 px tile at. 16 x 11 = 176, which is exactly the city's 704 lot chunk
   at its own 4x reduction: their number, not mine.

   MAP LAW HELD: this authors no street. streetKindAt still decides WHAT a cell is.
   The patch only decides how finely that one material is drawn. */
const STREET_CELL_M=0.75;   /* the walked city's fine cell, in metres. THEIR number. */
const LOT_SUBPX=11;         /* what the WALKED street draws a 44px tile at. Measured. */
const LOT_FACES=8;          /* how many faces a kind can wear, so the cache is bounded */
function lotSub(){ return Math.max(1,Math.round(tileMetres()/STREET_CELL_M)); }
const _LOTP={};
function lotPatch(kind,face){
  if(!STREET_READY)return null;
  /* *** ONLY A MATERIAL TILES. A MARKING DOES NOT. *** Photographed the first cut of
     this: tiling the median sixteen times turned the yellow dashes into a fine stripe
     that downsampled to nothing, and the road lost its markings. median, lane, kerb,
     gutter, wall and house are DIRECTIONAL -- the tile IS the thing, drawn once across
     the cell, which is why V96 kept them out of ST_SPIN ("isotropic surfaces only").
     That existing declaration is exactly the right question asked already, so the
     patch reads it instead of writing a second list. */
  if(!ST_SPIN[kind])return null;
  const arr=STREET_IMG[kind]||[]; if(!arr.length)return null;
  const n=lotSub(); const key=kind+'|'+face+'|'+n;
  if(_LOTP[key]!==undefined)return _LOTP[key];
  const px=n*LOT_SUBPX;
  const c=document.createElement('canvas'); c.width=c.height=px;
  const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  /* the SAME shape of hash the per-cell path used, one level down: the variation is
     still one deterministic function of where you are, there are just 256 of them
     inside a lot instead of one. */
  for(let sy=0;sy<n;sy++)for(let sx=0;sx<n;sx++){
    const h=(Math.imul(face*73856093^(sx+1),19349663)^Math.imul(sy+1,83492791))>>>0;
    const im=arr[h%arr.length]; if(!im)continue;
    const rot=ST_SPIN[kind]?(((h/arr.length)|0)&3):0;
    const ox=sx*LOT_SUBPX, oy=sy*LOT_SUBPX;
    if(rot){ g.save(); g.translate(ox+LOT_SUBPX/2,oy+LOT_SUBPX/2); g.rotate(rot*Math.PI/2);
      g.drawImage(im,-LOT_SUBPX/2,-LOT_SUBPX/2,LOT_SUBPX,LOT_SUBPX); g.restore(); }
    else g.drawImage(im,ox,oy,LOT_SUBPX,LOT_SUBPX);
  }
  _LOTP[key]=c; return c;
}
/* ===== /V222 __THE_LOT_IS_SIXTEEN_TILES__ ===== */"""

OLD_CELL = """      const _st=streetTile(_sk,_si,Math.ceil(t)+1,(h/_sn)|0);
      if(_st){ x.drawImage(_st,Math.floor(sx2),Math.floor(sy2)); }"""

NEW_CELL = """      /* V222 __THE_LOT_IS_SIXTEEN_TILES__: at house scale a cell is a LOT, so it is
         painted with a lot's worth of the street's own cells rather than one tile
         stretched over twelve metres. The lot keeps its 4x4 region dominance (V97)
         because its face is the region's, not the cell's. Body board: untouched. */
      const _lp=houseOn()?lotPatch(_sk,(_sk==='lot')
        ?((Math.imul((wx>>2)|0,73856093)^Math.imul((wy>>2)|0,19349663))>>>0)%LOT_FACES
        :(h%LOT_FACES)):null;
      const _st=_lp||streetTile(_sk,_si,Math.ceil(t)+1,(h/_sn)|0);
      if(_lp){ const _sm=x.imageSmoothingEnabled; x.imageSmoothingEnabled=true;
        x.drawImage(_lp,Math.floor(sx2),Math.floor(sy2),Math.ceil(t)+1,Math.ceil(t)+1);
        x.imageSmoothingEnabled=_sm; }
      else if(_st){ x.drawImage(_st,Math.floor(sx2),Math.floor(sy2)); }"""


def parse_check(blob, label):
    """EVERY SCRIPT IN THE BLOB STILL PARSES. V214 terminated a JS string and the
    fight stopped defining G; V217's first cut left a block comment open and the last
    script went silent. A guard that checks whether the file still runs rather than
    the text it wrote is not a guard."""
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


def main():
    alpha = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64='([^']+)'", alpha)
    if not m:
        sys.exit('COMBAT_B64 not found in the alpha')
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in blob:
        print('  the lot is already sixteen tiles')
        return
    blob = sub(blob, OLD_SPIN, NEW_SPIN, 'blob/the lot patch')
    blob = sub(blob, OLD_CELL, NEW_CELL, 'blob/the board cell')

    code = re.sub(r'/\*.*?\*/', '', blob, flags=re.S)
    # ONE DOOR. A second place that decides how many street cells are in a board cell
    # is the exact bug this row exists to kill.
    if code.count('function lotSub()') != 1:
        sys.exit('GUARD: lotSub is defined %d times, expected 1' % code.count('function lotSub()'))
    if code.count('function lotPatch(') != 1:
        sys.exit('GUARD: lotPatch is defined %d times, expected 1' % code.count('function lotPatch('))
    # THE BODY BOARD CANNOT MOVE: every patch read is behind houseOn().
    for mm in re.finditer(r'lotPatch\(', code):
        if code[max(0, mm.start() - 9):mm.start()] == 'function ':
            continue
        near = code[max(0, mm.start() - 200):mm.start()]
        if 'houseOn()' not in near:
            sys.exit('GUARD: a lotPatch call is not behind houseOn()')
    # AND IT IS DERIVED. A typed 16 would put the ruler back in the old unit, which is
    # the mistake V219 already paid for twice.
    if 'tileMetres()/STREET_CELL_M' not in code:
        sys.exit('GUARD: lotSub is not derived from the metre door')
    parse_check(blob, 'the fight blob')
    enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
    alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                          "const COMBAT_B64='" + enc + "'", 1)
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('V222 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
