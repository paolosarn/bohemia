#!/usr/bin/env python3
"""
V229 -- A HOUSE IS FOUR BY FOUR CELLS, AND ITS ROOF IS ONE ROOF  (COMBAT, [fight on the grid])

A REGRESSION I CAUSED, FOUND BY PHOTOGRAPH. V227 made the fight's board cells of 3 m. The
lot band beside the street was laid out by lotSubKind(wx,wy) -- "a wall every fourth column,
house on even rows, yard on odd rows" -- and that layout was written when ONE BOARD TILE WAS
ONE HOUSE. His words, quoted in its own comment: "a house with a big backyard is now one by
two tiles big." Switch the unit under it to 3 m and the same sentence paints a ROOF STRIPE
ONE CELL TALL, then a yard stripe, then a roof stripe: and the house art, which is one whole
roof, is stamped once per 32 px cell. The photograph this round showed the lots on both sides
of the road as an ORANGE CHECKERBOARD OF TINY ROOFS -- which is, word for word, the first
thing on the list of what embarrassed him in front of a friend on 9/18: "a checkerboard of
orange roof tiles for a floor" (rule 17).

The same defect class this lane keeps finding in other people's code: a number written in a
unit the game has moved past. This time it was mine. V227 changed the unit and did not
re-derive the one layout function that was written in the old one.

---------------------------------------------------------------- WHAT IT DOES

1. THE LOT IS LAID OUT IN HOUSES ON THE CELL BOARD. Rule 34 s5: "a house about 4x4 cells."
   His own "one by two": a house and its backyard. So a property is four cells of house deep
   and four of yard behind it, four cells wide with the one-cell property wall between
   neighbours (V97's "every fourth column is the wall" kept as the WALL, now one cell of it).
       period across  4 + 1 wall   = 5 cells
       period down    4 house + 4 yard = 8 cells
   Derived from the law's number and his words; not picked.

2. A ROOF IS DRAWN ONCE ACROSS ITS HOUSE. The house art is one roof. So each house cell draws
   ITS SLICE of one roof built at four cells square, instead of the whole roof shrunk into
   itself. Built from the same approved bank the street uses (COOK's, the 2x art when it is
   big enough -- his "draw 88 at 2x, never 44 stretched"), cached once per cell size so a
   frame costs one slice blit per house cell, the same as before.

THE BODY BOARD IS UNTOUCHED: everything is behind houseOn(), which is false there.
THE ROAD, THE MARKINGS AND THE MATERIALS ARE UNTOUCHED: only the lot's house and yard move.
NOTHING ABOUT THE FIGHT MOVES: this is paint. MAP LAW: the layout is parameters derived from
the law, not a drawn street.

WHAT THIS DOES NOT DO, SAID PLAINLY: the fight still draws its OWN street rather than the
cells he is standing on in the walked city. That is the rest of [fight on the grid] and of
[one mode]. And the house art was cooked to be a house seen from a house's distance; whether
a 128 px roof reads under the bible is COOK [cell tiles] and DIRECTION's call.
"""
import base64
import os
import re
import subprocess
import sys
import tempfile

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__A_HOUSE_IS_FOUR_BY_FOUR__'

OLD_KIND = """function lotSubKind(wx,wy){
  if(((wx%4)+4)%4===0) return 'wall';       /* the side wall between properties */
  return (((wy%2)+2)%2===0) ? 'house' : 'yard';
}"""

NEW_KIND = """/* ===== V229 __A_HOUSE_IS_FOUR_BY_FOUR__ (COMBAT, [fight on the grid], rule 34) =========
   A REGRESSION I CAUSED IN V227, FOUND BY PHOTOGRAPH. This function was written when ONE
   BOARD TILE WAS ONE HOUSE ("a house with a big backyard is now one by two tiles big"). V227
   made a tile a 3 m CELL and did not re-derive it, so the same sentence painted a roof stripe
   one cell tall, a yard stripe, a roof stripe -- and the lots on both sides of the road came
   out as AN ORANGE CHECKERBOARD OF TINY ROOFS, which is word for word what embarrassed him in
   front of a friend on 9/18. On the cell board the lot is laid out IN HOUSES: rule 34's
   "a house about 4x4 cells", his own house-and-backyard, and V97's property wall kept as one
   cell of wall between neighbours. The body board is untouched. */
const HOUSE_CELLS=4;                 /* [DIAL] rule 34 s5: a house is about 4 by 4 cells */
const LOT_PERIOD_X=HOUSE_CELLS+1;    /* four cells of house and one of the property wall */
const LOT_PERIOD_Y=HOUSE_CELLS*2;    /* his "one by two": four cells of house, four of yard */
function lotSubKind(wx,wy){
  if(houseOn()){
    const c=((wx%LOT_PERIOD_X)+LOT_PERIOD_X)%LOT_PERIOD_X;
    if(c===0) return 'wall';
    const r=((wy%LOT_PERIOD_Y)+LOT_PERIOD_Y)%LOT_PERIOD_Y;
    return (r<HOUSE_CELLS) ? 'house' : 'yard';
  }
  if(((wx%4)+4)%4===0) return 'wall';       /* the side wall between properties */
  return (((wy%2)+2)%2===0) ? 'house' : 'yard';
}
/* AND A ROOF IS ONE ROOF. The house art is a whole roof, so each house cell draws ITS SLICE of
   one roof built at four cells square, rather than the whole roof shrunk into every cell.
   Built from the same approved bank the street uses (the 2x art once it is big enough, his
   "88 at 2x, never 44 stretched"), and cached per cell size in its OWN cache: streetTile's
   cache drops whenever it is asked for a different size, and asking it for a roof four times
   the cell would empty it on every cell of every frame. */
let _roofC={}, _roofT=-1;
function roofBlock(idx,px){
  if(!STREET_READY)return null;
  if(_roofT!==px){ _roofC={}; _roofT=px; }
  if(_roofC[idx])return _roofC[idx];
  const S=HOUSE_CELLS*px;
  const _bank=(S>44&&(STREET_IMG2X.house||[])[idx])?STREET_IMG2X:STREET_IMG;
  const src=(_bank.house||[])[idx]; if(!src)return null;
  const c=document.createElement('canvas'); c.width=c.height=S;
  const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  g.drawImage(src,0,0,S,S);
  _roofC[idx]=c; return c; }"""

OLD_DRAW = """      if(_sk==='lot') _sk=lotSubKind(wx,wy);
      const _sn=(STREET_B64[_sk]||[1]).length;"""

NEW_DRAW = """      if(_sk==='lot') _sk=lotSubKind(wx,wy);
      const _sn=(STREET_B64[_sk]||[1]).length;
      /* V229: on the cell board a house cell draws its slice of ONE roof, picked once per
         house so every cell of the same house shows the same roof. */
      if(houseOn()&&_sk==='house'){
        const _c=((wx%LOT_PERIOD_X)+LOT_PERIOD_X)%LOT_PERIOD_X, _r=((wy%LOT_PERIOD_Y)+LOT_PERIOD_Y)%LOT_PERIOD_Y;
        const _bx=wx-(_c-1), _by=wy-_r;
        const _bh=(Math.imul(_bx|0,73856093)^Math.imul(_by|0,19349663))>>>0;
        const _cp=Math.ceil(t)+1, _rb=roofBlock(_bh%_sn,_cp);
        if(_rb){ x.drawImage(_rb,(_c-1)*_cp,_r*_cp,_cp,_cp,Math.floor(sx2),Math.floor(sy2),_cp,_cp); continue; } }"""


def parse_check(blob, label):
    """EVERY SCRIPT IN THE BLOB STILL PARSES."""
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


def main():
    alpha = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64='([^']+)'", alpha)
    if not m:
        sys.exit('COMBAT_B64 not found in the alpha')
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in blob:
        print('  a house is already four by four')
        return
    if '__THE_CELL_BOARD__' not in blob:
        sys.exit('GUARD: V227 is not in this blob; this re-derives its layout')
    for old, new, what in ((OLD_KIND, NEW_KIND, 'the lot layout'), (OLD_DRAW, NEW_DRAW, 'the roof slice')):
        n = blob.count(old)
        if n != 1:
            sys.exit('ANCHOR %s: expected 1, found %d' % (what, n))
        blob = blob.replace(old, new, 1)
    code = re.sub(r'/\*.*?\*/', '', blob, flags=re.S)
    if 'const HOUSE_CELLS=4;' not in code or 'LOT_PERIOD_X=HOUSE_CELLS+1' not in code:
        sys.exit('GUARD: the house is not derived from the law\'s four cells')
    parse_check(blob, 'the fight blob')
    enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
    alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                          "const COMBAT_B64='" + enc + "'", 1)
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('V229 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
