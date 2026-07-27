#!/usr/bin/env python3
"""
BOHEMIA — THE SKIN ABOVE THE HAND, AND A NECK YOU CAN ACTUALLY SEE (Paolo 7/27/26)

He said it three times. "on east and west the clothing is a little fucked up
towards the actual hands", then "you didt fix that skin near the hands bro", then
"the neck is not a different color and the skin above the hand isnt fixed bro".
Both are fixed here, and both were found by dumping pixels, not by reasoning.

===========================================================================
FIX 1 — THE SKIN ABOVE THE HAND IS THE JACKET PAINTING A SECOND HAND
===========================================================================
Rendering the same frame twice, once bare and once dressed, and differencing:

  y32 x28  part 6 (arm)   body: 191,175,166   dressed: 224,211,203   <- garment
  y33 x28  part 6 (arm)   body: 191,175,166   dressed: 224,211,203   <- garment
  y34 x28  part 6 (arm)   body: 191,175,166   dressed: 191,175,166       body
  y35 x28  part 8 (hand)  body: 191,175,166   dressed: 191,175,166       body

The real hand starts at y35. At y32-33 the JACKET is painting 224,211,203 onto
cells whose body part is the ARM. Every garment ramp carries the SK_DEF skin
stops (this jacket has 194,164,142 and 233,210,192), which are remapped to the
live skin tone at composite -- they exist so the garment art can show the wrist
and hand opening. When the arm bone deforms, those stops land ABOVE the real
hand and paint a bright, hand-coloured block on the sleeve. That block is what he
circled in yellow, twice.

THE RULE: a garment may not paint a SKIN tone onto a cell whose body part is an
ARM. The garment's skin stops describe the hand; on an arm they are always a
duplicate of a hand that is already being drawn by the body, two rows below.
Those cells get the body's own arm colour back, which is what makes the forearm
read continuous with the hand it belongs to instead of a bright lump stuck on it.

This is not a new law, it is the mirror of one already in the engine:
    const HAND_PARTS = {7:1, 8:1};
    if (HAND_PARTS[bodyGrid[i]] && ARM_BONE_IDX.indexOf(garmentBone[i]) >= 0)
      garmentCol[i] = null;
which already refuses to let an arm-bone garment pixel paint a HAND. This refuses
to let a garment's HAND-coloured pixel paint an ARM. Same principle, other side.

REUSE-FIRST: nothing is cooked. The restored colour is the body colour the
renderer had already computed for that exact cell one pass earlier.

===========================================================================
FIX 2 — THE NECK TONE WAS INVISIBLE BECAUSE THE COWL COVERS THE WHOLE NECK
===========================================================================
Neck cells showing SKIN with his outfit (cowl-hoodie + jacket):

  S 8 cells / 0 skin | SE 10 / 0 | E 9 / 0 | W 9 / 0 | N 12 / 6

Zero. On every facing he looks at, part 3 is 100% cloth, so a tone applied to it
cannot appear no matter how big the shift. He was right that nothing changed, and
it was never the colour's fault.

Mapping skin against cloth by part shows what he actually means by "the neck":

  y13  ##1222##     <- part 2 (face)
  y14  #11222       <- part 2 (face)
  y15  ####2        <- part 2, the last skin row before the collar
  y16  4#####       <- cloth

The skin from the jaw down to the collar is the bottom of the FACE part. So the
tone goes there: the lowest rows of visible face skin, per facing, per frame,
computed from the art rather than hardcoded to a row number -- so it follows the
head when it bobs, and it follows any garment with a different neckline.

Part 3 keeps its tone too, for the facings and outfits where it does show (N, and
anything with a lower collar). Nothing is taken away.

Idempotent.

  python3 tools/bohemia_skin_above_hand_and_throat_patch.py
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')

def die(m):
    print('  ! ' + m); sys.exit(1)

src = open(ALPHA, encoding='utf-8').read()

if 'THE SKIN ABOVE THE HAND' in src:
    print('SKIN-ABOVE-HAND + THROAT: already applied, nothing to do.')
    sys.exit(0)

# ---------------------------------------------------------------- FIX 1 ----
# Snapshot the body's own colour for ARM cells, taken right after the body pass
# and before any garment composites. Anchored on the nipple block, which is the
# last thing the body pass does.
SNAP_ANCHOR = "  /* NIPPLES: consistent to the body, placed off the rig skeleton. Front views two,"
if src.count(SNAP_ANCHOR) != 1:
    die('body-pass anchor found %d times (need exactly 1)' % src.count(SNAP_ANCHOR))
SNAP = '''  /* THE SKIN ABOVE THE HAND (Paolo 7/27/26) -- part 1 of 2: remember what the BODY
     made of every arm cell, before a single garment pixel lands. Restored below,
     after garments composite. Cheap: two parts, a few dozen cells. */
  const _armBody = new Array(CW*CH).fill(null);
  for(let i=0;i<grid.length;i++){ const q=grid[i];
    if((q===5||q===6)&&px[i]) _armBody[i]=[px[i][0],px[i][1],px[i][2]]; }
'''
src = src.replace(SNAP_ANCHOR, SNAP + SNAP_ANCHOR, 1)

# ORDER MATTERS AND I GOT IT WRONG ONCE: the restore must run AFTER the garment
# composite. Anchored on the de-speckle first, it sat at line 4769 while garments
# composite at 4877, so the garment repainted those cells one pass later and the
# fix measured as a complete no-op while the code read correctly. The FINAL
# FLOATER CULL is after garments and after dressBackLimb, so that is the anchor.
FIX_ANCHOR = "  /* FINAL FLOATER CULL"
if src.count(FIX_ANCHOR) != 1:
    die('de-speckle anchor found %d times (need exactly 1)' % src.count(FIX_ANCHOR))

FIX1 = '''  /* =========================================================================
     THE SKIN ABOVE THE HAND (Paolo 7/27/26, circled in yellow twice)
     "you didt fix that skin near the hands bro" / "the skin above the hand isnt
      fixed bro"

     MEASURED, by rendering the frame bare and dressed and differencing it:

       y32 x28  part 6 (arm)   body 191,175,166   dressed 224,211,203  <- GARMENT
       y33 x28  part 6 (arm)   body 191,175,166   dressed 224,211,203  <- GARMENT
       y34 x28  part 6 (arm)   body 191,175,166   dressed 191,175,166     body
       y35 x28  part 8 (hand)  body 191,175,166   dressed 191,175,166     body

     The real hand starts at y35. At y32-33 the JACKET is painting a bright
     hand-coloured block onto the ARM. Every garment ramp carries the SK_DEF skin
     stops (this jacket: 194,164,142 and 233,210,192) so the art can show a wrist
     and a hand opening; when the arm bone deforms, those stops land above the
     real hand and read as a second hand stuck on the sleeve.

     THE RULE: a garment may not paint a SKIN tone onto an ARM cell. The garment's
     skin stops describe the HAND, and the hand is already being drawn by the body
     two rows down, so on an arm they are always a duplicate.

     It is the mirror of a rule the engine already has -- HAND_PARTS refuses to let
     an arm-bone garment pixel paint a hand. This refuses the other direction.

     REUSE-FIRST: nothing is cooked. The colour put back is the one the renderer
     itself computed for that exact cell one pass earlier.

     ORDER: this MUST run after the garment composite. The first version was
     anchored before it (line 4769 vs the composite at 4877) and the garment
     simply repainted the cells a pass later -- the fix measured as a complete
     no-op while the code read correctly. It now sits with the other
     after-everything passes.
     ========================================================================= */
  {/* SKIN TONES ONLY, NEVER THE SHARED DARK ENTRY. skinRampFor()[0] is
       28,22,24 -- the anatomy outline -- and that exact colour is ALSO in the
       jacket, the pants and the shoes ramps. Including it made this test match
       every dark sleeve pixel, and the first build of this fix repainted whole
       sleeves as bare skin. Only the real skin tones count. */
    const _sk={}; try{const _r=skinRampFor(); for(let _i=1;_i<_r.length;_i++){const c=_r[_i];
      if(c)_sk[c[0]+','+c[1]+','+c[2]]=1;}}catch(_e){}
   for(let i=0;i<grid.length;i++){
     const q=grid[i]; if(q!==5&&q!==6)continue;          /* arms only */
     const c=px[i], b=_armBody[i]; if(!c||!b)continue;
     if(!_sk[c[0]+','+c[1]+','+c[2]])continue;           /* cloth: leave it alone */
     if(c[0]===b[0]&&c[1]===b[1]&&c[2]===b[2])continue;  /* already the body's own */
     px[i]=[b[0],b[1],b[2]];                             /* a garment's HAND tone on an ARM */
   }}
'''
src = src.replace(FIX_ANCHOR, FIX1 + FIX_ANCHOR, 1)

# ---------------------------------------------------------------- FIX 2 ----
OLD_NECK = "    for(let i=0;i<grid.length;i++){\n      if(grid[i]!==npart)continue;"
if src.count(OLD_NECK) != 1:
    die('neck loop found %d times (need exactly 1)' % src.count(OLD_NECK))
NEW_NECK = '''    /* THE THROAT, because part 3 is invisible on him (Paolo 7/27: "the neck is
       not a different color"). Measured with his cowl-hoodie: neck cells showing
       SKIN are S 0/8, SE 0/10, E 0/9, W 0/9, N 6/12. On every facing he looks at
       the neck is 100% cloth, so a tone on it cannot appear at any strength. The
       skin he means -- jaw down to the collar -- is the bottom of the FACE part.
       So the tone also takes the lowest rows of visible face skin, found from the
       art each frame rather than hardcoded to a row, so it follows the head bob
       and follows any garment with a different neckline. Part 3 keeps its tone
       for the facings and outfits where it does show; nothing is taken away. */
    let _throatY = -1;
    if(NECK_TONE.throatRows>0){
      for(let i=0;i<grid.length;i++){
        if(grid[i]!==2)continue; const c=px[i]; if(!c)continue;
        if(!_sk[c[0]+','+c[1]+','+c[2]])continue;
        const y=(i/CW)|0; if(y>_throatY)_throatY=y;
      }
    }
    const _throatTop=_throatY<0?1e9:(_throatY-(NECK_TONE.throatRows-1));
    for(let i=0;i<grid.length;i++){
      const _q=grid[i];
      const _isThroat=(_q===2)&&(((i/CW)|0)>=_throatTop);
      if(_q!==npart&&!_isThroat)continue;'''
src = src.replace(OLD_NECK, NEW_NECK, 1)

OLD_FLAG = 'const NECK_TONE = { on: true, part: 3, mul: 0.93 };'
if src.count(OLD_FLAG) != 1:
    die('NECK_TONE flag found %d times (need exactly 1)' % src.count(OLD_FLAG))
src = src.replace(OLD_FLAG,
    'const NECK_TONE = { on: true, part: 3, mul: 0.93, throatRows: 2 };', 1)

open(ALPHA, 'w', encoding='utf-8').write(src)
print('APPLIED to slices/BOHEMIA_ALPHA_0_9.html')
print('  1. a garment can no longer paint a SKIN tone onto an ARM (the block above the hand)')
print('  2. the neck tone also takes the visible THROAT, because the cowl covers 100% of part 3')
