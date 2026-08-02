#!/usr/bin/env python3
"""
A DOOR IS THE WAY IN (8/2/26) -- you stop walking through walls.

Paolo: "WY IS IT WHEN IM IN THE OUTSIDE OF A BUILDING I CAN ENTER IT FROM JUST
WALKING TO ANY WALL OF THE BUILDING NOW IM MAGICALLY IN THE BUILDING. NOT EVEN
CONCERNED WITH FRONT DOOR BACK DOOR."

THE LINE HE IS DESCRIBING, in stepOnce():
    if(c&&!c.walk&&c.enter&&...){ if(inEnter(nx,ny,hx,hy,false)){...} }
ANY solid cell whose dossier declares an interior admits you, and `c.enter` is
stamped on EVERY structure cell of the mass. So every wall is a door.

WHY THE OBVIOUS FIX WOULD HAVE SEALED THE CITY. Measured first, one plot of each
district type on the running world:
    39,706  solid cells that admit you
         7  hdoor facade cells (the painted doors)
        25  walkable portal cells
Ten of fourteen district types have ZERO of either. Simply deleting the branch
makes almost every building in the valley permanently unenterable -- strictly
worse than the bug. Full table: records/BOHEMIA_BUILDINGS_HAVE_NO_DOORS_8_2_26.md

SO THIS PATCH IS THE HALF THAT IS SAFE TODAY, AND ONLY THAT HALF.

    A BUILDING THAT HAS A DOOR CAN ONLY BE ENTERED THROUGH ITS DOOR.
    A BUILDING THAT HAS NO DOOR IS UNCHANGED.

The suburb ALREADY computes where its front door goes -- the facade pass picks
the leftmost tile of a run whose cell below is a driveway or road and marks it
`artPool_face='hdoor'`. It just paints it and forgets it. Now that painted door
is the actual way through, so in the district he is standing in his complaint is
FIXED, while districts whose dossiers never declared a door keep working exactly
as they do today instead of locking him out.

HOW IT KNOWS: inFootprint() already flood-fills the enterable mass (and already
refuses to flood into a perimeter wall or a roof decal). One scan, only when he
actually bumps a solid enterable cell -- never per frame -- and the answer is
memoised per mass so a wall he walks along is scanned once, not once per step.

WHEN THE REST LANDS: once every enterable building has a real door cell, the
fallback branch is deleted and a wall is simply solid. That is step 2 and it must
not ship before step 1, or the gate locks him out of his own city.

REUSE CHECK: cooks no graphic pixels and opens no bank. Pure movement logic over
cell data the world model already computes (c.enter, c.walk, c.artPool_face,
c.portal).

Idempotent: re-running finds the marker and reports NOOP.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARKER = '__DOOR_IS_THE_WAY_IN__'

OLD = ("      /* STEP-INSIDE: a solid tile whose dossier declares an interior is a way IN */\n"
       "      if(c&&!c.walk&&c.enter&&typeof inEnter==='function'){ if(inEnter(nx,ny,hx,hy,false)){ HFACE=dirOf(dx,dy); return true; } }")

NEW = ("""      /* """ + MARKER + """ (Paolo 8/2: "WY IS IT WHEN IM IN THE OUTSIDE OF A
         BUILDING I CAN ENTER IT FROM JUST WALKING TO ANY WALL OF THE BUILDING NOW
         IM MAGICALLY IN THE BUILDING").
         This admitted him through ANY solid cell, and c.enter is stamped on every
         structure cell of a mass, so every wall was a door.
         MEASURED BEFORE CHANGING IT, one plot per district type: 39,706 solid cells
         admit you, 7 painted doors exist, 25 walkable portals, and TEN OF FOURTEEN
         district types have zero of either. Deleting this branch outright seals
         almost every building in the valley -- worse than the bug. So:
             A BUILDING THAT HAS A DOOR CAN ONLY BE ENTERED THROUGH ITS DOOR.
             A BUILDING THAT HAS NO DOOR IS UNCHANGED.
         The suburb already picks its front door (facade pass: leftmost tile of a run
         whose cell below is driveway or road -> artPool_face 'hdoor'); it painted it
         and forgot it. Now that door is the way through, so where he is standing this
         is fixed, and districts whose dossiers never declared a door keep working
         rather than locking him out. Step 2, once every building has a real door
         cell, deletes the fallback and a wall becomes simply solid. */
      if(c&&!c.walk&&c.enter&&typeof inEnter==='function'){
        if(massHasDoor(nx,ny)){
          if(c.artPool_face==='hdoor'||c.portal){
            if(inEnter(nx,ny,hx,hy,false)){ HFACE=dirOf(dx,dy); return true; }
          }
          /* it has a door and this is not it: a wall, and a wall stops you */
        } else if(inEnter(nx,ny,hx,hy,false)){ HFACE=dirOf(dx,dy); return true; }
      }""")

HELPER_OLD = "function inEnter(tgtX,tgtY,fromX,fromY,portal){"
HELPER_NEW = ("""/* """ + MARKER + """ -- does this mass have a door at all?
   inFootprint() already flood-fills exactly the enterable mass (and already
   refuses to flood into a perimeter wall or a roof decal), so the answer is a
   scan of that mass for any cell the world calls a door. It runs ONLY when he
   actually bumps a solid enterable cell -- never per frame -- and it is memoised
   per mass, so walking the length of a wall scans once, not once per step. */
const MASSDOOR=new Map();
function massHasDoor(gx,gy){
  const f=inFootprint(gx,gy); if(!f)return false;
  const k=f.x+','+f.y+','+f.w+','+f.h;
  const hit=MASSDOOR.get(k); if(hit!==undefined)return hit;
  let has=false;
  for(let y=f.y;y<f.y+f.h&&!has;y++)for(let x=f.x;x<f.x+f.w;x++){
    const c=cellAt(x,y); if(!c)continue;
    if(c.artPool_face==='hdoor'||(c.portal&&c.enter)){ has=true; break; }
  }
  MASSDOOR.set(k,has); return has;
}
function inEnter(tgtX,tgtY,fromX,fromY,portal){""")


def main():
    alpha = open(ALPHA, encoding='utf8', errors='ignore').read()
    m = re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})", alpha)
    if not m:
        print('FAIL: CITY_B64 not found'); return 1
    city = base64.b64decode(m.group(1)).decode('utf8', errors='ignore')
    if MARKER in city:
        print('NOOP: a door is already the way in'); return 0

    for name, old in (('the step-inside branch', OLD), ('inEnter', HELPER_OLD)):
        n = city.count(old)
        if n != 1:
            print('FAIL: %s anchor found %d times, expected 1' % (name, n)); return 1
    if 'massHasDoor' in city:
        print('FAIL: massHasDoor already taken'); return 1
    if 'function inFootprint(' not in city:
        print('FAIL: inFootprint (the mass flood fill this reuses) is missing'); return 1

    city = city.replace(HELPER_OLD, HELPER_NEW, 1).replace(OLD, NEW, 1)
    if city.count('function massHasDoor(') != 1:
        print('FAIL: helper not inserted exactly once'); return 1

    out = base64.b64encode(city.encode('utf8')).decode('ascii')
    open(ALPHA, 'w', encoding='utf8').write(alpha[:m.start(1)] + out + alpha[m.end(1):])
    print('wrote %s' % ALPHA)
    print('  a building WITH a door can only be entered through its door')
    print('  a building with NO door is unchanged -- nothing is sealed')
    return 0


if __name__ == '__main__':
    sys.exit(main())
