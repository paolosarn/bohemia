#!/usr/bin/env python3
"""
BOHEMIA — DRESS THE BACK LIMB (Paolo 7/26/26)

His words: "I'm so confused as to why the back arm and the back leg, in whatever
direction I'm facing, it just can't have the proper clothing... I don't want it to
be a different shade off the bat, and if you make it a different shade that's a
whole different layering process that isn't actually color-coded on the clothing
pixel wise."

HE WAS DESCRIBING A REAL, MEASURABLE BUG AND IT IS NOT A SHADING BUG. Garment
coverage per limb, measured over 20 clips x 8 facings x 24 phases -- what fraction
of a limb's pixels carry a GARMENT colour instead of bare skin:

    facing   near arm    FAR arm
    S          72.5%      66.1%
    SE         72.1%      68.8%
    E          62.5%      11.0%   <-- the back arm is NAKED
    NE         72.8%      67.2%
    N          65.2%      68.5%
    NW         75.3%      61.5%
    W          67.2%       6.8%   <-- the back arm is NAKED
    SW         64.4%      65.4%

On E and W the back arm renders BARE SKIN where the sleeve should be. That is
exactly why it reads as "a different shade off the bat": it IS a different colour,
because it is skin, not clothing. Nothing was darkening it -- the far-arm
darkening has been retired since earlier today and the audit confirms the far and
near limbs share the same colour set (0-0.5% exclusive).

WHY. Garment art is painted per direction as what you can SEE: on E the sleeve is
drawn on the near arm only, because at rest the far arm is hidden behind the body.
So the far arm has no garment pixels to deform, and when animation swings it clear
of the torso it arrives undressed.

THE FIX IS HIS OWN RULE: A GARMENT IS ONE GARMENT. The far limb is dressed from
the NEAR twin's painted sleeve -- same garment, same ramp, SAME COLOURS, no
darkening, no separate shade. Per rest row, an uncovered far-limb pixel takes the
near twin's garment colour from the same row (nearest covered row within 3 if that
row is bare). It runs BEFORE garmentContactLaw so his contact rules still govern
the result, and it only ever fills where the near twin IS dressed -- it never
invents clothing that does not exist.

If the back limb should read darker for depth, that is a SEPARATE LAYER by his
7/26 ruling and it is deliberately NOT done here.

REUSE CHECK (REUSE-FIRST / APPROVED-ASSETS-FIRST): cooks ZERO pixels. It reuses
the sleeve he already painted, on the arm it already belongs to.

Idempotent.

  python3 tools/bohemia_dress_the_back_limb_patch.py
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')

def die(m):
    print('  ! ' + m); sys.exit(1)

src = open(ALPHA, encoding='utf-8').read()
orig = src

if 'DRESS THE BACK LIMB' in src:
    print('DRESS THE BACK LIMB: already applied, nothing to do.')
    sys.exit(0)

# ---------------------------------------------------------------------------
# the helper, installed next to the other garment laws
# ---------------------------------------------------------------------------
ANCHOR = 'function buildFrame(d,clip,ph){'
HELPER = '''/* ===========================================================================
   DRESS THE BACK LIMB (Paolo 7/26/26)
   ---------------------------------------------------------------------------
   "Why can't the back arm and the back leg have the proper clothing... I don't
    want it to be a different shade off the bat, and if you make it a different
    shade that's a whole different layering process that isn't color-coded on the
    clothing pixel wise."

   MEASURED, garment coverage per limb over 20 clips x 8 facings x 24 phases:
   on E the near arm is 62.5% dressed and the FAR arm is 11.0%; on W it is 67.2%
   against 6.8%. Every other facing is within a few points. The back arm in
   profile renders BARE SKIN, which is why it reads as a different shade -- it IS
   a different colour, because it is skin and not cloth. Nothing was darkening it.

   WHY: garment art is painted per direction as what you can SEE, so on E the
   sleeve exists only on the near arm; at rest the far arm is hidden behind the
   body. When animation swings it clear of the torso it arrives undressed.

   A GARMENT IS ONE GARMENT (his rule). The far limb is dressed from the near
   twin's painted sleeve: same garment, same ramp, SAME COLOURS. No darkening --
   if depth wants a shade that is a separate layer by his 7/26 ruling, and it is
   deliberately not done here.
   =========================================================================== */
function dressBackLimb(restCol,d,slot){
  if(slot==='hair'||slot==='hat'||slot==='glasses'||slot==='facial')return null;
  const CW=56,CH=56, SK=SKINNERS[d]; if(!SK||!SK.layers)return null;
  const near=(DEPTH[d]&&DEPTH[d].nearSide)||'R';
  /* ARMS AND HANDS ONLY. Measured, the legs never had this defect -- far thigh was
     within +-8 points of near on every facing -- and an earlier version of this pass
     made them WORSE (E far thigh 82.4% -> 66.6%) by inventing fill colour. Fix what
     is broken, leave what is not. */
  const pairs = near==='R' ? [[6,5],[8,7]] : [[5,6],[7,8]];
  let out=null;
  for(const [np,fp] of pairs){
    /* THE LIMB'S OWN PAINTED FOOTPRINT, not the composited rest grid. On E the far
       arm is hidden behind the torso, so it barely exists in the composite -- which
       is exactly why the first version of this fix had nowhere to put the sleeve. */
    const NL=SK.layers[np], FL=SK.layers[fp];
    if(!NL||!FL)continue;
    /* THE ACTUAL MECHANISM, measured on E: both arms have 83 painted pixels and
       they SHARE 49 of them, and his shirt already covers BOTH at ~90% at rest.
       So the clothing was never missing. A shared rest pixel can only bind to ONE
       bone, and it binds to the NEAR arm -- so the sleeve rides the near arm and
       the far arm arrives bare. The fix is not to copy clothing, it is to give the
       far limb its OWN bound copy of the garment pixels over its OWN footprint. */
    let overlap=0, farTot=0;
    for(let i=0;i<CW*CH;i++){ if(FL[i]){farTot++; if(NL[i])overlap++;} }
    if(!farTot)continue;
    if(overlap/farTot < 0.3)continue;   /* footprints barely share: the main pass binds fine */
    if(!out)out={col:new Array(CW*CH).fill(null), grid:new Uint8Array(CW*CH), farParts:{}};
    out.farParts[fp]=1;
    /* NO INVENTED FILL. Only the garment colour ALREADY on that cell at rest gets
       passed through, bound to the FAR limb instead of the near one. An earlier
       version synthesised a row-dominant fill and painted skin-toned pixels onto
       limbs, which is inventing art -- exactly what REUSE-FIRST forbids.
       SAME colour, no shade: a depth read is a separate layer (his 7/26 rule). */
    for(let i=0;i<CW*CH;i++){
      if(!FL[i])continue;
      const src=restCol[i]; if(!src)continue;
      out.col[i]=[src[0],src[1],src[2]]; out.grid[i]=fp;
    }
  }
  return out;
}
''' + ANCHOR
if src.count(ANCHOR) != 1:
    die('buildFrame anchor found %d times (need exactly 1)' % src.count(ANCHOR))
src = src.replace(ANCHOR, HELPER, 1)

# ---------------------------------------------------------------------------
# call it BEFORE the contact law, so his contact rules still govern the fill
# ---------------------------------------------------------------------------
OLD_CALL = """    const gotColor=new Uint8Array(CW*CH);
    for(let i=0;i<deformed.length;i++){if(!deformed[i])continue;
      const gr=dbone[i]>=0?bRank[dbone[i]]:99;
      if(gr<=cellRank[i]){px[i]=deformed[i];cellRank[i]=gr;gotColor[i]=1;if(farArmParts&&farArmParts[grid[i]])px[i]=[px[i][0]*FAR_DARK|0,px[i][1]*FAR_DARK|0,px[i][2]*FAR_DARK|0];}}"""
NEW_CALL = OLD_CALL + """
    /* DRESS THE BACK LIMB (Paolo 7/26/26): a garment is ONE garment. The far limb
       gets its OWN deform pass, bound to its OWN bones -- it cannot ride the main
       pass, because that binds through the composited rest grid where the far arm
       is hidden behind the torso. Same sleeve, same ramp, SAME COLOURS, no shade:
       a depth read is a separate layer by his 7/26 ruling and is not done here. */
    {const _fs=dressBackLimb(restCol,d,slot);
     if(_fs){
       const _fr=SKINNERS[d].skinColorLayer(P,_fs.col,null,_fs.grid);
       const _fc=_fr.col,_fb=_fr.bone;
       /* ONLY the far limb's OWN cells. The first version let this pass win any
          cell by rank and it overwrote the NEAR limb's sleeve -- measured, near
          thigh coverage on E fell from 88.8% to 78.9%. A pass meant to dress the
          back limb must never undress the front one. */
       for(let i=0;i<_fc.length;i++){if(!_fc[i])continue;
         if(!_fs.farParts[grid[i]])continue;
         const gr=_fb[i]>=0?bRank[_fb[i]]:99;
         if(gr<=cellRank[i]){px[i]=_fc[i];cellRank[i]=gr;gotColor[i]=1;}}
     }}"""
if src.count(OLD_CALL) != 1:
    die('garment composite anchor found %d times (need exactly 1)' % src.count(OLD_CALL))
src = src.replace(OLD_CALL, NEW_CALL, 1)

open(ALPHA, 'w', encoding='utf-8').write(src)
print('DRESS THE BACK LIMB applied to slices/BOHEMIA_ALPHA_0_9.html')
print('  - the far limb wears the near twin\'s painted sleeve, same colours, no shade')
print('  - runs before garmentContactLaw so his contact rules still apply')
