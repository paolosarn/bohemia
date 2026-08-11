#!/usr/bin/env python3
"""BOHEMIA AGE AXIS -- HANDS AND FEET SCALE TOO (8/11/26, CHARACTER lane)

PAOLO: "also the tinier people looked weird look into that"

HE IS RIGHT AND HERE IS THE NUMBER. Measured on the real canvas, foot band width
across the whole cast:

    FATHER   height 106   foot 34
    MOTHER   height  98   foot 34
    BROTHER  height  94   foot 34
    SISTER   height  84   foot 34      <-- IDENTICAL

THE FEET NEVER SHRINK. The father's feet are 32% of his height; the child's are
40% of hers, and the ratio gets worse the smaller the body goes. That is
clown-feet, and it is exactly the "weird" he saw.

WHY: BODYVAR's PART_SPEC covers parts 4, 5/6 and 9/10 only -- torso, arms, legs.
Parts 7/8 (hands) and 11/12 (feet) have NO spec anywhere in the system. Like the
head they are rigid stamps. The age axis scales the POSE, which moves the ankle,
but the stamp drawn at that ankle stays adult-sized forever.

*** AND THE HEAD STAYING FIXED IS RIGHT WHILE THE FEET STAYING FIXED IS WRONG,
    WHICH IS THE WHOLE POINT AND IS NOT AN INCONSISTENCY. ***
Head-to-stature is the one ratio that genuinely changes with age -- that is why a
child reads as a child, and it is why the fixed head stamp IS the mechanism. Foot
length and hand length track stature almost linearly: an 8-year-old's foot is
about 20cm against an adult's 26cm, which is 0.77 -- the same 0.77 the child body
scale already uses. So feet and hands scale WITH the body and the head does not,
and that is anatomy, not a compromise.

HOW: the same inverse sample warpPart uses, applied to the rest-pixel lists for
7/8/11/12. Target -> source, never forward scatter, because a forward map leaves
holes the moment the scale moves and a hole in a foot reads as shot-through art.

ANCHORS ARE NOT THE SAME FOR BOTH, and getting this wrong is visible instantly:
  FEET anchor at the BOTTOM. They stand on the ground, and the ground line is the
       one row in this rig that must never move -- a foot scaled about its centre
       would float or sink into the floor.
  HANDS anchor at the TOP. They hang from the wrist, so the wrist end is the join
       that has to stay welded to the forearm.

NOT TOUCHED: the head (1/2), which must stay fixed, and the torso/arms/legs, which
BODYVAR already owns and whose gate asserts neutral is byte-identical canon.
ADULT REMAINS IDENTITY -- limbScale 1.0 returns the list unchanged, so the player
and every existing surface are untouched.

    python3 tools/bohemia_age_limbs_patch.py
RIG CHECK (RIG IS LAW, Paolo 7/26/26): scales the HAND and FOOT rest-pixel stamps
  (parts 7=hand L, 8=hand R, 11=foot L, 12=foot R) by inverse sample, the same
  target->source remap BOH_BODYVAR's warpPart uses. It moves EXISTING painted pixels
  of the ONE rig and invents none; the skeleton, the pose and every joint are handed
  through untouched, and adult returns the layers by identity.
  built on: BAKED, BAKED.layers, BOH_AGE, BOH_BODYVAR
  joints: none named
  parts: 7=hand L, 8=hand R, 11=foot L, 12=foot R
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD_STAGES = """  const STAGES = {
    child:      { h: 0.77, legBias: -0.06, label: 'CHILD' },
    teen:       { h: 0.90, legBias: -0.02, label: 'TEEN' },
    youngadult: { h: 0.97, legBias:  0.00, label: 'YOUNG ADULT' },
    adult:      { h: 1.00, legBias:  0.00, label: 'ADULT' },
    elder:      { h: 0.97, legBias:  0.00, label: 'ELDER' }
  };"""

NEW_STAGES = """  const STAGES = {
    /* limb = the HAND and FOOT stamp scale. It tracks `h` almost exactly, because
       foot and hand length track STATURE almost linearly in real growth (an 8yo
       foot is ~20cm against an adult ~26cm = 0.77, the same number as the body).
       The HEAD is the one thing that does NOT scale -- that asymmetry is the
       entire reason a child reads as a child rather than as a small adult. */
    child:      { h: 0.77, legBias: -0.06, limb: 0.78, label: 'CHILD' },
    teen:       { h: 0.90, legBias: -0.02, limb: 0.91, label: 'TEEN' },
    youngadult: { h: 0.97, legBias:  0.00, limb: 0.98, label: 'YOUNG ADULT' },
    adult:      { h: 1.00, legBias:  0.00, limb: 1.00, label: 'ADULT' },
    elder:      { h: 0.97, legBias:  0.00, limb: 1.00, label: 'ELDER' }
  };

  /* HANDS 7/8, FEET 11/12. These have no PART_SPEC anywhere in the system, so
     nothing has ever been able to resize them -- measured before this: foot band
     34px wide on a 106px father AND on an 84px child, identical.
     INVERSE SAMPLE, target -> source, exactly as warpPart does: a forward map
     leaves holes the moment the scale moves, and a hole in a foot reads as
     shot-through art. */
  function scaleStamp(list, W, s, anchor) {
    if (!list || !list.length || !s || Math.abs(s - 1) < 0.001) return list;
    let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
    for (let i = 0; i < list.length; i++) {
      const x = list[i] % W, y = (list[i] / W) | 0;
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    const set = new Set(list);
    /* FEET anchor at the BOTTOM -- they stand on the ground line, which is the one
       row that must never move. HANDS anchor at the TOP, the wrist join that stays
       welded to the forearm. Centre-anchoring either one floats it off its joint. */
    const ax = (x0 + x1) / 2, ay = (anchor === 'bottom') ? y1 : y0;
    const out = [];
    const ty0 = Math.floor(ay - (ay - y0) * s), ty1 = Math.ceil(ay + (y1 - ay) * s);
    const tx0 = Math.floor(ax - (ax - x0) * s), tx1 = Math.ceil(ax + (x1 - ax) * s);
    for (let ty = ty0; ty <= ty1; ty++) {
      for (let tx = tx0; tx <= tx1; tx++) {
        if (tx < 0 || ty < 0) continue;
        const sx = Math.round(ax + (tx - ax) / s), sy = Math.round(ay + (ty - ay) / s);
        if (sx < x0 || sx > x1 || sy < y0 || sy > y1) continue;
        if (set.has(sy * W + sx)) out.push(ty * W + tx);
      }
    }
    return out.length ? out : list;
  }
  const HAND_PARTS = { 7: 'top', 8: 'top' }, FOOT_PARTS = { 11: 'bottom', 12: 'bottom' };
  function scaleLimbs(layers, W, s) {
    if (!layers || !s || Math.abs(s - 1) < 0.001) return layers;
    const out = {};
    for (const d in layers) {
      const src = layers[d], dst = {};
      for (const p in src) {
        const anchor = HAND_PARTS[p] || FOOT_PARTS[p];
        dst[p] = anchor ? scaleStamp(src[p], W, s, anchor) : src[p];
      }
      out[d] = dst;
    }
    return out;
  }"""

OLD_RET = """    return { W: baked.W, H: baked.H, skeleton: baked.skeleton, layers: baked.layers,
             pose: pose, layerOverride: baked.layerOverride, swingAmt: baked.swingAmt,
             age: stage };"""

NEW_RET = """    return { W: baked.W, H: baked.H, skeleton: baked.skeleton,
             layers: scaleLimbs(baked.layers, baked.W || 56, S.limb),
             pose: pose, layerOverride: baked.layerOverride, swingAmt: baked.swingAmt,
             age: stage };"""

alpha = open(ALPHA, encoding='utf8').read()
before = alpha
applied, missed = [], []

for label, old, new in [
    ('limb scale added to the age stages + the stamp scaler', OLD_STAGES, NEW_STAGES),
    ('hands and feet actually scaled in the returned package', OLD_RET, NEW_RET),
]:
    if new in alpha:
        applied.append('(already) ' + label)
        continue
    n = alpha.count(old)
    if n != 1:
        missed.append('%s — expected exactly 1 match, found %d' % (label, n))
        continue
    alpha = alpha.replace(old, new, 1)
    applied.append(label)

for line in applied:
    print('  ok   ' + line)
for line in missed:
    print('  MISS ' + line)

if missed:
    print('AGE LIMBS: refused to write — %d edit(s) did not match exactly once' % len(missed))
    sys.exit(1)

open(ALPHA, 'w', encoding='utf8').write(alpha)
print('AGE LIMBS: applied to %s' % ALPHA)
