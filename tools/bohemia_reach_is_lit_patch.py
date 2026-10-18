#!/usr/bin/env python3
"""
V241 -- REACH IS LIT ON THE TILES (COMBAT, [house tiles back], the 9/22 ruling)

PAOLO 9/22, LOCKED (laws/BOHEMIA_ADDENDUM_THE_FIGHT_IS_BATTLE_BROTHERS_QUICKER_9_22_26.md): "reach lit on the
tiles (pistol 1, rifle 2, scope 3)". [house tiles back]'s own line: "reach lit on tiles as 9/22". Rule 46f:
"a place is shown by lighting its square tile in the ground's own colour".

MEASURED FIRST: the fight has known every gun's reach in houses since V218 (houseRange, myRange, maxRange:
a pistol reaches the eight houses round him, sqrt 2; a rifle two; a scope three; the dark shrinks it, V98)
and NOTHING ON THE BOARD EVER SHOWED IT. The lit tiles on the board were V193's ground read (where to stand)
and the way out. Whether a man could be shot from here was a number he had to guess.

NOW, house board, in the cover phase: every tile his gun reaches from where he stands is lit, faintly, in the
ground's own colour, at 45 like every flat thing (V240); a tile with a man on it inside that reach is lit
stronger, on the beat. It reads the game's own reach (maxRange(myRange())), so the light and the shot can
never disagree, and it changes the moment he swaps guns or night falls. Tiles under a house are not lit (you
cannot stand there and nobody can be shot through it from the street). No ring, no outline, no number: the
light is the tile.

REUSE CHECK: nothing is cooked; litTile (V235/V240) draws it.

NO DAMAGE BEFORE THE DIAL: nothing about reach or a shot moves. Only that it can be seen.
"""
import base64
import os
import re
import subprocess
import sys
import tempfile

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__REACH_IS_LIT__'

EDITS = [
 ("  if(!aimo&&GROUND_READ&&G.phase==='cover'&&!G.over&&!G.inc){",
  """  /* ===== V241 __REACH_IS_LIT__ (COMBAT, the 9/22 ruling: "reach lit on the tiles, pistol 1, rifle 2, scope 3").
     Every tile his gun reaches is lit faintly in the ground's own colour; a man inside it, stronger, on the beat.
     It reads maxRange(myRange()), the same number the shot uses. */
  if(!aimo&&REACH_LIT&&houseOn()&&G.phase==='cover'&&!G.over&&!G.inc){
    let _R=0; try{ _R=maxRange(myRange()); }catch(_x){}
    if(_R>0){ const _n=Math.floor(_R+1e-6), _hs={}, _es={};
      for(const P of (G.pillars||[])){ if(!P.house)continue; const q=pXY(P); _hs[Math.round(q[0])+','+Math.round(q[1])]=1; }
      for(const e of (G.e||[])){ if(!e||e.dead||e.downed)continue; const q=pXY(e); _es[Math.round(q[0])+','+Math.round(q[1])]=1; }
      for(let dy=-_n;dy<=_n;dy++)for(let dx=-_n;dx<=_n;dx++){
        if(!dx&&!dy)continue; if(Math.hypot(dx,dy)>_R+1e-6)continue; const k=dx+','+dy; if(_hs[k])continue;
        const _p=fieldPos({ea:Math.atan2(dy,dx),edist:Math.hypot(dx,dy)},W,H,cx,cy);
        litTile(x,_p,ring,_es[k]?(REACH_MAN_A+0.06*beatLift()):REACH_A); } } }
  if(!aimo&&GROUND_READ&&G.phase==='cover'&&!G.over&&!G.inc){"""),
 ("function litTile(x,p,ring,a,rgb){",
  """const REACH_LIT=true;    /* [DIAL] V241: his gun's reach lit on the tiles */
const REACH_A=0.16;      /* [DIAL] the faint light on a tile he can shoot */
const REACH_MAN_A=0.28;  /* [DIAL] and on a tile with a man he can shoot */
function litTile(x,p,ring,a,rgb){"""),
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
        print('  reach is already lit')
        return
    if '__THE_GROUND_IS_45__' not in blob:
        sys.exit('GUARD: V240 is not in this blob; V241 is written on top of it')
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
    print('V241 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
