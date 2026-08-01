#!/usr/bin/env python3
"""
BOHEMIA: A FENCE IS A WALL, NOT A BUILDING (8/2/26).

PAOLO, 8/2, LOCKED: "all walls should at least be two tiles tall from FENCING to
concrete to brick whatever, but the walkable border... should only be one tile."
And, 8/1: "it has to be a BUILDING if walls are two tiles thick" - a building is
the only thing allowed to be taller than a wall.

WHAT WAS WRONG, measured: the district kit layers `kind:'fence'` as
{layer:'structure', solid:true}, which is correct - a fence is solid and stands
up. But the CITY tab's structure branch only ever sets `c.face=true` and never a
height, so a fence fell through to `WALL_H = 3` - THE HOUSE FACADE HEIGHT. Every
chain-link fence, yard fence and compound fence in the valley stood exactly as
tall as a two-storey home.

His law makes the three heights explicit and different:
    WALL / FENCE   2 tiles   (this patch)
    BUILDING       3 tiles   (unchanged - a house is a building)
    COLLISION      1 tile    (unchanged on both - never touched here)

WHY IT IS DONE BY KIND AND NOT BY A LIST OF DISTRICTS: every kit dossier already
declares what each of its tiles IS, and `fence` is one of the declared kinds. A
rule written against the KIND covers every district that exists and every one
built later, without anybody remembering to add it. A list of district names
would rot the first time a lane adds a district with a fence in it.

WHAT THIS DOES NOT DO: it changes no walkability. `c.walk=false` on a fence cell
is set above this and is untouched, and no other cell's walk flag is read or
written. The fence simply stops pretending to be a house.

REUSE CHECK: cooks ZERO pixels and opens no bank. It sets a height on tiles that
already draw. Nothing is created.

TASTE CHECK: produces no candidates and reaches Paolo's thumbs with nothing.

Idempotent.

  python3 tools/bohemia_city_fence_two_tall_patch.py
"""
import base64
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD = """      if(!belowSolid){
        c.face=true;"""
NEW = """      if(!belowSolid){
        c.face=true;
        /* A FENCE IS A WALL, NOT A BUILDING (Paolo 8/2, LOCKED): "all walls
           should at least be two tiles tall from FENCING to concrete to brick
           whatever". The kit layers kind:'fence' as a solid structure, which is
           right, but this branch never set a HEIGHT - so a fence fell through to
           WALL_H=3, the house facade height, and every chain-link fence in the
           valley stood as tall as a two-storey home. Written against the KIND so
           it covers every district built later without anyone remembering.
           Collision is untouched: c.walk=false is set above and stays 1 tile.
           Law: laws/BOHEMIA_LAW_WALLS_ARE_TWO_TALL_ONE_SOLID_8_2_26.md */
        if(entry&&entry.kind==='fence') c.wallH=2;"""

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'A FENCE IS A WALL, NOT A BUILDING' in decoded:
    print('fences already stand two tiles tall. no-op.')
    sys.exit(0)

n = decoded.count(OLD)
if n != 1:
    sys.exit('FENCE TWO TALL: anchor found %d times (expected 1). Fix the anchor '
             'rather than loosening it.' % n)

decoded = decoded.replace(OLD, NEW, 1)
alpha = alpha[:a0] + base64.b64encode(decoded.encode('utf8')).decode('ascii') + alpha[a1:]
open(ALPHA, 'w', encoding='utf8').write(alpha)
print('A FENCE IS A WALL, NOT A BUILDING.')
print('  every kind:\'fence\' tile now stands 2 tiles, not the 3 of a house facade')
print('  no walkability changed')
