#!/usr/bin/env python3
"""
V237 -- THE STREET HAS KERBS: THE ROAD AND THE SIDEWALK ARE A CROSS-SECTION, NOT A FILL
(COMBAT, [house tiles back], rule 46f)

REUSE CHECK: nothing is cooked. Every cell is the fight's own STREET_IMG bank -- the walk's approved
street tiles (road, median, gutterL/R, kerbL/R, walk, yard; COOK's 7/28 recook, his "88 at 2x") -- the
same bank lotPatch already tiles. COOK's block war kit is NOT used: he voted it DOWN 9/30 ("It looks bad
man so ugly"). No bank file is opened here.

PAOLO 10/1: "the tiles below the people dont look good." The coordinator's sweep (10/1 B): "the road,
the sidewalk and kerb, the lot, a dead car and a block wall from the banks are not under the fighters
yet." And his 9/30 UP: "a street has to be a tile."

WHAT WAS UNDER THEM: on the house board a road tile was sixteen street cells of plain asphalt and a
sidewalk tile sixteen of plain concrete (V222's lotPatch: "only a material tiles"). The street bank
has had the median, the gutters and both kerbs since 7/28, and none of them was ever under a fighter
on this board: the road had no centre line, the sidewalk no kerb, so a street read as two flat
colours.

NOW EACH IS ITS REAL CROSS-SECTION, column by column, in the bank's own 0.75 m cells (16 across a
12 m house tile), unrotated where the bank says a tile has a direction (ST_SPIN):
    the road (12 m, two lanes)      gutter | road x7 | the double yellow | road x6 | gutter
    the sidewalk, west of the road  dirt x5 | sidewalk x10 | kerb (its face to the road)
    the sidewalk, east of the road  kerb | sidewalk x10 | dirt x5
Line colour law: yellow is the direction split, the median. A freeway's three or four tiles (his
words) wait for the cutter to read the road class. Body board: untouched.

NO DAMAGE BEFORE THE DIAL: nothing about the fight's rules moves. Only what the ground is made of.
"""
import base64
import os
import re
import subprocess
import sys
import tempfile

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_STREET_HAS_KERBS__'

XSEC = """/* ===== /V222 __THE_LOT_IS_SIXTEEN_TILES__ ===== */
/* ===== V237 __THE_STREET_HAS_KERBS__ (COMBAT, rule 46f) ==========================================
   The road and the sidewalk on the house board are their real CROSS-SECTION, column by column, in
   the street bank's own cells: gutter, two lanes split by the double yellow, gutter; and each sidewalk
   dirt, concrete, the kerb facing the road. The bank has had these tiles since 7/28; none of them was
   ever under a fighter on this board. */
function xsecKind(kind,side,col,n){
  if(kind==='road'){ if(col===0)return 'gutterL'; if(col===n-1)return 'gutterR';
    if(col===(n>>1))return 'median'; return 'road'; }
  if(kind==='walk'){ const k=Math.max(1,Math.round(n*5/16));
    if(side==='L'){ if(col===n-1)return 'kerbL'; return col<k?'yard':'walk'; }
    if(col===0)return 'kerbR'; return col>=n-k?'yard':'walk'; }
  return kind; }
function xsecPatch(kind,side,face,px){
  if(!STREET_READY)return null;
  const n=lotSub(); px=Math.max(n,Math.round(px||0)); const key='X|'+kind+'|'+side+'|'+face+'|'+n+'|'+px+'|'+FD;
  if(_LOTP[key]!==undefined)return _LOTP[key];
  const sub=px*FD/n;
  const c=document.createElement('canvas'); c.width=c.height=px*FD;
  const g=c.getContext('2d'); g.imageSmoothingEnabled=(sub<44);
  for(let sy=0;sy<n;sy++)for(let sx=0;sx<n;sx++){
    const k=xsecKind(kind,side,sx,n);
    const arr=(sub>44&&(STREET_IMG2X[k]||[]).length)?STREET_IMG2X[k]:(STREET_IMG[k]||[]); if(!arr.length)continue;
    const h=(Math.imul(face*73856093^(sx+1),19349663)^Math.imul(sy+1,83492791))>>>0;
    const im=arr[h%arr.length]; if(!im)continue;
    const rot=ST_SPIN[k]?(((h/arr.length)|0)&3):0;
    const ox=sx*sub, oy=sy*sub;
    if(rot){ g.save(); g.translate(ox+sub/2,oy+sub/2); g.rotate(rot*Math.PI/2); g.drawImage(im,-sub/2,-sub/2,sub,sub); g.restore(); }
    else g.drawImage(im,ox,oy,sub,sub); }
  _LOTP[key]=c; return c; }"""

EDITS = [
 ("""/* ===== /V222 __THE_LOT_IS_SIXTEEN_TILES__ ===== */""", XSEC),
 ("""      const _lp=houseOn()?lotPatch(_sk,(_sk==='lot')""",
  """      const _lp=(houseOn()&&(_sk==='road'||_sk==='walk'))?xsecPatch(_sk,(wx<ST_H_ROAD0)?'L':'R',h%LOT_FACES,Math.ceil(t)+1)   /* V237: the street's cross-section */
        :houseOn()?lotPatch(_sk,(_sk==='lot')"""),
]


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
        print('  the street already has its kerbs')
        return
    if '__THE_FLOOR_ROUND_TWO__' not in blob:
        sys.exit('GUARD: V236 is not in this blob; V237 is written on top of it')
    for old, new in EDITS:
        n = blob.count(old)
        if n != 1:
            sys.exit('ANCHOR: expected 1, found %d for %r' % (n, old[:80]))
        blob = blob.replace(old, new, 1)
    parse_check(blob, 'the fight blob')
    enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
    alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                          "const COMBAT_B64='" + enc + "'", 1)
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('V237 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
