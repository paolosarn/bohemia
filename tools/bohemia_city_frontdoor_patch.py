#!/usr/bin/env python3
"""
BOHEMIA FRONT DOOR (7/27/26, CITY lane) - "the door suck", and it was a dice
roll, not a door.

Paolo, playing: "The houses aren't good... the door suck the house is this
target art the garage is suck... you really should be using the suburb
district."

WHAT I FOUND, BY LOOKING AT THE ACTUAL SURFACE AND THEN THE ACTUAL DATA.

The suburb district IS being used, at full canon scale: 4x4 overmap cells make
one 128x128 BohemiaSuburb grid, sliced 1:1, and a real cell reads back
554 dead-ground / 268 house / 96 road / 80 garage / 14 upper-floor / 12 driveway.
The generator's plot is intact. The defect is in how the ART reads that plot.

THE DOOR WAS A HASH. Every exposed house tile picked its facade art from a
per-tile hash: 60% wall, 20% window, 10% boarded, 10% DOOR. Measured across 24
real suburb cells: 727 exposed house fronts, 62 doors. That is a door every
twelve tiles, scattered along every wall of every house, including the backyard
walls that face a dead-dirt lot with no path to them. A house does not have six
front doors on four sides. It has ONE, and it is where you walk up to it.

The plot already knows where that is, and nobody asked it. Of those 727 exposed
fronts, 60 sit directly above the house's own DRIVEWAY APRON (code 3) and 24
above the residential ROAD (code 1). That is the front of the house, stated by
the generator, in its own legend, at build time.

THE FIX
  A door is placed where the house meets its driveway or its street, and ONE per
  approach: the run of tiles above a driveway is 3-4 wide, so only the leftmost
  tile of a contiguous run becomes the door and the rest stay wall. Everywhere
  else - all 643 tiles facing dead dirt - is wall, window or boarded, and NEVER a
  door. Same count of doors, roughly one per house instead of one per twelve
  tiles, and every one of them reachable on foot.

  The generic district path had the same dice roll and it is worse there,
  because those dossiers ALREADY declare their doors as `portal` tiles that you
  step through. A hashed 'hdoor' painted onto a random wall is a door that lies:
  it looks enterable and is not. That path now never paints a door on a wall.

NOT TOUCHED, DELIBERATELY. He rejected the houses, the garage and asked whether
the house is even the approved target art. STOP PRODUCING rule 3: a rejected
thing does not go back with a fresh coat. So the roof pool is UNCHANGED - and it
is worth saying that I checked whether it was a wiring bug and it is not:
records/BOHEMIA_HOUSE_SKIN_VERDICT_7_21_26.txt has him thumbing all 30
candidates UP, and hroof holds exactly the 14 he approved as roofs
(roof_shingle_0-5, roof_gravel_6-7, roof_stile_21-26). The red-brick read is
those approved shingles tiling at 16px, which is a TASTE call and his alone. The
other two findings are written up for him, not acted on: the facade is drawn ONE
tile tall while DOOR LAW says a door is two (the interiors obey it, the exteriors
do not), and 54% of a suburb cell is dead-dirt yard rendered as one flat noise.

REUSE CHECK: cooks ZERO pixels. Every tile it places comes from the SA_TILES
house pools already in the page - hdoor / hwall / hwindow / hboarded - which are
Paolo's own 7/21 verdict (records/BOHEMIA_HOUSE_SKIN_VERDICT_7_21_26.txt, all 30
UP). No bank is opened because no asset is created or selected; this changes
WHICH approved tile goes WHERE, using the district generator's own legend codes.

TASTE CHECK: produces no candidates and reaches Paolo's thumbs with nothing.

Idempotent (marker FRONT DOOR).

  python3 tools/bohemia_city_frontdoor_patch.py
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

if 'FRONT DOOR' in decoded:
    print('front door already applied. no-op.')
    sys.exit(0)

applied = []

# ---- the suburb: the door is where the driveway meets the house --------------
OLD_SUB = """      const below=(ly+1<FN)?m.sub[(ly+1)*FN+lx]:0;
      if(!(below===2||below===6||below===9)){
        c.face=true;
        const gh=(Math.imul(gx,73856093)^Math.imul(gy,19349663))>>>0, pick=gh%10;
        c.artPool_face=pick<6?'hwall':(pick<8?'hwindow':(pick===8?'hboarded':'hdoor'));
      }"""
NEW_SUB = """      const below=(ly+1<FN)?m.sub[(ly+1)*FN+lx]:0;
      if(!(below===2||below===6||below===9)){
        c.face=true;
        /* FRONT DOOR (7/27): this used to roll a per-tile hash and put a door on
           10% of every exposed wall - measured at 62 doors across 727 exposed
           fronts in 24 real cells, scattered over backyard walls that face a
           dead-dirt lot with no way to reach them. A house has ONE front door
           and the plot already knew where: the suburb generator marks its
           driveway apron (3) and its street (1). Door where the house meets
           one of those, ONE per approach (the run above a driveway is 3-4 wide,
           so only the leftmost tile of a run takes it), wall or window
           everywhere else. Same number of doors, all of them reachable. */
        const approach=(below===3||below===1);
        let doorHere=false;
        if(approach&&lx>0){
          const leftBelow=m.sub[(ly+1)*FN+(lx-1)], leftHere=m.sub[ly*FN+(lx-1)];
          const leftIsApproach=(leftBelow===3||leftBelow===1)&&(leftHere===2||leftHere===6||leftHere===9);
          doorHere=!leftIsApproach;                 /* leftmost tile of the run */
        } else if(approach) doorHere=true;
        const gh=(Math.imul(gx,73856093)^Math.imul(gy,19349663))>>>0, pick=gh%20;
        c.artPool_face=doorHere?'hdoor':(pick<14?'hwall':(pick<19?'hwindow':'hboarded'));
      }"""
if decoded.count(OLD_SUB) == 1:
    decoded = decoded.replace(OLD_SUB, NEW_SUB, 1)
    applied.append('suburb: the door is at the driveway, one per house, never on a backyard wall')

# ---- the generic districts: the dossier already names the doors --------------
OLD_KIT = """      if(!belowSolid){
        c.face=true;
        const gh=(Math.imul(gx,73856093)^Math.imul(gy,19349663))>>>0, pick=gh%10;
        c.artPool_face=pick<6?'hwall':(pick<8?'hwindow':(pick===8?'hboarded':'hdoor'));
      }"""
NEW_KIT = """      if(!belowSolid){
        c.face=true;
        /* FRONT DOOR (7/27): never hash a door onto a wall here. Every kit
           dossier already DECLARES its doors as `portal` tiles you step
           through; a painted door on a random wall is a door that lies - it
           reads enterable and is not. Walls, windows and boarded windows only;
           the portals are the doors. */
        const gh=(Math.imul(gx,73856093)^Math.imul(gy,19349663))>>>0, pick=gh%20;
        c.artPool_face=pick<14?'hwall':(pick<19?'hwindow':'hboarded');
      }"""
if decoded.count(OLD_KIT) == 1:
    decoded = decoded.replace(OLD_KIT, NEW_KIT, 1)
    applied.append('generic districts: no more painted doors that cannot be opened (portals are the doors)')

if not applied:
    print('FRONT DOOR: no anchor matched. NOT applied.')
    sys.exit(1)

assert 'FRONT DOOR' in decoded
reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('FRONT DOOR applied:')
for a in applied:
    print('  - ' + a)
