#!/usr/bin/env python3
"""
BOHEMIA: DROP IN LANDS YOU ON THE STREET (8/2/26).

THE LAW THIS FINALLY REACHES HIM WITH:
laws/BOHEMIA_ADDENDUM_NO_DISTRICT_IS_A_PRISON_8_1_26.md - Paolo, 8/1, from
inside one: "I'm like locked in this fucking suburb... the streets have to touch
the streets bro... Make sure I can't be locked in any certain district ever
again it's so fucking creepy."

WHY IT NEEDS DOING TWICE, AND THIS IS THE WHOLE POINT OF THE PATCH.
That law was built on 8/1 into slices/BOHEMIA_RUN_CURRENT.html's findHomeCell,
proved by walking that file in a real browser, and shipped green. Then on 8/2
the ONE WORLD TAB measurement found that #p-run is display:none for the entire
life of the app - THE RUN TAB HAS NEVER SHOWN THAT FILE. What Paolo sees when he
taps RUN is the CITY FRAME's walk mode. So the fix for the complaint he actually
made never reached the screen he actually made it about.

  THIS LANE'S MOST REPEATED FAILURE, now three for three: fix the surface he
  cannot see, prove it on that surface, ship it green.

WHAT WAS WRONG HERE, measured on the city frame: DROP IN put him at the CENTRE
of whatever cell the camera was over, then spiralled to the first WALKABLE cell
it found. Walkable includes dead-dirt back yards, so the spiral happily lands
him behind a house, inside a walled subdivision, facing a wall. Measured from
four such drop-ins: every one CAN reach a road, but only after a 7,400-9,400
tile flood-fill. Not a prison - which is exactly why it FELT like one.

WHAT IT DOES NOW: the spiral prefers, in order,
  1. a cell that IS a road, or
  2. a walkable cell TOUCHING a road,
  3. and only if neither exists within the search, any walkable cell (unchanged
     behaviour, so a cell with no road at all still drops you in rather than
     refusing).
You land on the street. The streets touch the streets.

WHAT IT DOES NOT DO: it changes no walkability, moves no wall, and creates no
opening. A cell that was walkable still is. It only changes WHICH walkable cell
the camera hands you, which is why it cannot regress NO PRISON - it can only
improve the starting position.

REUSE CHECK: cooks ZERO pixels and opens no bank. It reorders an existing
spiral's preference using the cell data the frame already computes. Nothing is
created.

TASTE CHECK: produces no candidates and reaches Paolo's thumbs with nothing.

Idempotent.

  python3 tools/bohemia_city_dropin_on_the_street_patch.py
"""
import base64
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD = """    hx=city.x*FN+(FN>>1); hy=city.y*FN+(FN>>1);
    let k=0; const c0=cellAt(hx,hy);
    if(!c0||!c0.walk){ // spiral out to the nearest walkable cell
      spiral: for(let ring=1;ring<FN;ring++){
        for(let a=-ring;a<=ring;a++){ const cands=[[hx+a,hy-ring],[hx+a,hy+ring],[hx-ring,hy+a],[hx+ring,hy+a]];
          for(const [qx,qy] of cands){ const cc=cellAt(qx,qy); if(cc&&cc.walk){ hx=qx; hy=qy; break spiral; } } }
        if(++k>200)break;
      }
    }"""

NEW = """    hx=city.x*FN+(FN>>1); hy=city.y*FN+(FN>>1);
    /* YOU LAND ON THE STREET (Paolo 8/1, NO DISTRICT IS A PRISON: "the streets
       have to touch the streets bro... make sure I can't be locked in any
       certain district ever again").
       THIS SPIRAL USED TO TAKE THE FIRST WALKABLE CELL, and walkable includes
       dead-dirt back yards - so it would happily drop him behind a house inside
       a walled subdivision, facing a wall. Measured from four such drop-ins:
       every one COULD reach a road, but only after a 7,400-9,400 tile
       flood-fill. Not a prison, which is exactly why it FELT like one.
       THE SAME LAW WAS ALREADY BUILT ON 8/1 - into the RUN SLICE, which the
       ONE WORLD TAB measurement then proved he has never once seen. This is
       that fix arriving on the surface he actually plays.
       PREFERENCE, not a filter: road, then touching-a-road, then any walkable
       cell exactly as before. A place with no road at all still drops you in
       rather than refusing, so nothing can become unreachable. */
    const _isRoad=(q)=>{ const t=om.at(Math.floor(q[0]/FN),Math.floor(q[1]/FN));
      return !!(t && /arterial|freeway|beltway|strip|interchange|road/.test(String(t.district))); };
    const _touchesRoad=(qx,qy)=>{ for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nc=cellAt(qx+dx,qy+dy); if(nc&&nc.walk&&_isRoad([qx+dx,qy+dy])) return true; } return false; };
    let k=0; const c0=cellAt(hx,hy);
    let _best=null, _ok=(c0&&c0.walk);
    if(_ok && (_isRoad([hx,hy])||_touchesRoad(hx,hy))) _best=[hx,hy];
    if(!_best){
      let _any=_ok?[hx,hy]:null;
      spiral: for(let ring=1;ring<FN;ring++){
        for(let a=-ring;a<=ring;a++){ const cands=[[hx+a,hy-ring],[hx+a,hy+ring],[hx-ring,hy+a],[hx+ring,hy+a]];
          for(const [qx,qy] of cands){ const cc=cellAt(qx,qy); if(!cc||!cc.walk) continue;
            if(!_any) _any=[qx,qy];
            if(_isRoad([qx,qy])||_touchesRoad(qx,qy)){ _best=[qx,qy]; break spiral; } } }
        if(++k>200)break;
      }
      if(!_best) _best=_any;
    }
    if(_best){ hx=_best[0]; hy=_best[1]; }"""

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'YOU LAND ON THE STREET' in decoded:
    print('drop-in already lands you on the street. no-op.')
    sys.exit(0)
if decoded.count(OLD) != 1:
    sys.exit('DROP IN: anchor found %d times (expected 1).' % decoded.count(OLD))

decoded = decoded.replace(OLD, NEW, 1)
alpha = alpha[:a0] + base64.b64encode(decoded.encode('utf8')).decode('ascii') + alpha[a1:]
open(ALPHA, 'w', encoding='utf8').write(alpha)
print('DROP IN LANDS YOU ON THE STREET.')
print('  road first, then touching a road, then any walkable cell as before')
print('  no walkability changed - only which walkable cell you are handed')
