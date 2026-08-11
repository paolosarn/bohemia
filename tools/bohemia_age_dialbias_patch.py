#!/usr/bin/env python3
"""BOHEMIA AGE AXIS -- A CHILD IS SLENDER, THROUGH THE DIALS (8/11/26, CHARACTER lane)

PAOLO: "also the tinier people looked weird look into that"

THE DIAGNOSIS, MEASURED. Shoulder span over figure height, on the real canvas:

    FATHER  shoulder 50 / height 106 = 0.472
    SISTER  shoulder 40 / height  84 = 0.476   <-- IDENTICAL TO HER FATHER'S

The age axis scaled the pose in Y and only in Y (`n[j] = [P[j][0], ...]` -- X
passed straight through, every joint). So an 84px child had a grown man's
breadth ratio: a man's shoulder span, a man's stance, arms hanging a man's
distance off the ribs. That is not a child, that is an adult who has been
stepped on, and it is exactly the "weird" he saw.

*** AND THE FIRST FIX WAS WORSE THAN THE BUG. Post-mortem below, because it is
    the more useful half of this file. ***

I scaled every joint's X about the pelvis (a `wide` factor per stage), which is
the obvious fix and is what the anthropometry asks for. Rendered it, zoomed the
child to 5x, and LOOKED: her arms had fused into her torso, her jeans had
collapsed to a blob, and her sneakers had detached into a tan brick wider than
her legs. Worse art than the squashed adult it replaced.

WHY, and this is a rig fact worth keeping: HANDS AND FEET ARE RIGID STAMPS bound
to bones, not skinned geometry. Narrowing the SKELETON drags the limb bones
inboard, but the adult-sized stamps hanging off them do not narrow with the
stance -- so the arms merge into the ribs while the shoes stay put and stick out
past the hips. A pose-space X scale can never be right on this rig for that
reason. THE PATCH WAS DELETED, not softened.

WHAT ACTUALLY WORKS is the machinery that already exists and is already gated.
BODYVAR's `shoulders` / `arms` / `hips` dials narrow a body by remapping REST
PIXELS row by row and letting the skinner rebind -- so the stamps come along and
nothing detaches. That is the supported way to make a body narrower and it has a
gate on it (bodyvar_gate.js). So the AGE stage carries a DIAL BIAS instead of a
pose transform, merged under whatever the character's own dials say.

THE NUMBERS ARE ANTHROPOMETRY, not taste:
    stature       8yo ~128cm / adult ~176cm = 0.73
    biacromial    8yo  ~28cm / adult  ~40cm = 0.70   breadth falls FASTER than
                                                     height -- kids read slender
    head circ.    8yo  ~53cm / adult  ~57cm = 0.93   barely moves, which is why
                                                     the fixed head stamp IS the
                                                     mechanism that says "child"

ADULT REMAINS IDENTITY -- adult's bias is all zeros and BOH_AGE still returns the
package by identity for 'adult', so the player and every existing surface are
untouched.

    python3 tools/bohemia_age_dialbias_patch.py
RIG CHECK (RIG IS LAW, Paolo 7/26/26): the stage bias adds BODYVAR DIAL VALUES and
  nothing else -- it never touches a joint, a bone, a rest pixel or BAKED. The
  narrowing it asks for is performed by BOH_BODYVAR's existing shoulders/arms/hips
  dials, which remap rest pixels and let the skinner rebind, which is exactly why
  the rejected pose-space X scale (which DID move joints, and tore the child's arms
  into her torso) was deleted instead of softened.
  built on: BAKED, BOH_AGE, BOH_BODYVAR, BODY_PKG, rebuildFromRig
  joints: none named
  parts: none
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD_STAGES = """    child:      { h: 0.77, legBias: -0.06, limb: 0.78, label: 'CHILD' },
    teen:       { h: 0.90, legBias: -0.02, limb: 0.91, label: 'TEEN' },
    youngadult: { h: 0.97, legBias:  0.00, limb: 0.98, label: 'YOUNG ADULT' },
    adult:      { h: 1.00, legBias:  0.00, limb: 1.00, label: 'ADULT' },
    elder:      { h: 0.97, legBias:  0.00, limb: 1.00, label: 'ELDER' }"""

NEW_STAGES = """    /* bias = BODYVAR dials the stage adds UNDER the character's own, because
       breadth falls faster than height in real growth (biacromial 0.70 against
       stature 0.73) and a body that only shrank vertically read as a squashed
       adult -- measured shoulder/height 0.476 on the child against 0.472 on her
       father, the same ratio. Dials, never a pose X scale: dials remap REST
       pixels and let the skinner rebind, so the rigid hand and foot stamps come
       along with the body. Scaling the SKELETON in X instead fused her arms into
       her ribs and left her shoes behind as a detached brick.
       The ELDER narrows nothing: old age compresses the spine, it does not
       narrow the shoulders. */
    child:      { h: 0.77, legBias: -0.06, limb: 0.78, label: 'CHILD',
                  bias: { shoulders: -0.32, arms: -0.18, hips: -0.12 } },
    teen:       { h: 0.90, legBias: -0.02, limb: 0.91, label: 'TEEN',
                  bias: { shoulders: -0.14, arms: -0.08, hips: -0.05 } },
    youngadult: { h: 0.97, legBias:  0.00, limb: 0.98, label: 'YOUNG ADULT',
                  bias: { shoulders: -0.05, arms: -0.03, hips:  0.00 } },
    adult:      { h: 1.00, legBias:  0.00, limb: 1.00, label: 'ADULT' },
    elder:      { h: 0.97, legBias:  0.00, limb: 1.00, label: 'ELDER' }"""

OLD_RET = """  return { apply: apply, STAGES: STAGES, NAMES: Object.keys(STAGES) };"""

NEW_RET = """  /* THE STAGE'S DIALS, MERGED UNDER THE CHARACTER'S OWN. Added, not replaced:
     the sister already carries shoulders -0.40 because of who she is, and the
     stage says a child of any build is narrower still. BODYVAR clamps to
     [-1,1] itself, so nothing here can drive a dial out of range. */
  function bias(dials, stage) {
    const S = STAGES[stage], b = S && S.bias;
    if (!b) return dials || null;
    const o = {};
    for (const k in (dials || {})) o[k] = dials[k];
    for (const k in b) o[k] = (+o[k] || 0) + b[k];
    return o;
  }
  return { apply: apply, bias: bias, STAGES: STAGES, NAMES: Object.keys(STAGES) };"""

OLD_WIRE = """  const src=BODY_PKG=BOH_BODYVAR.apply(BOH_AGE.apply(BAKED,G.age||'adult'),G.bodyVar);"""

NEW_WIRE = """  const _stage=G.age||'adult';
  const src=BODY_PKG=BOH_BODYVAR.apply(BOH_AGE.apply(BAKED,_stage),BOH_AGE.bias(G.bodyVar,_stage));"""

alpha = open(ALPHA, encoding='utf8').read()
applied, missed = [], []

for label, old, new in [
    ('the age stages carry a BODYVAR dial bias', OLD_STAGES, NEW_STAGES),
    ('BOH_AGE.bias() merges the stage dials under the character\'s own', OLD_RET, NEW_RET),
    ('rebuildFromRig runs the character dials through the stage bias', OLD_WIRE, NEW_WIRE),
]:
    if new in alpha:
        applied.append('(already) ' + label)
        continue
    n = alpha.count(old)
    if n != 1:
        missed.append('%s -- expected exactly 1 match, found %d' % (label, n))
        continue
    alpha = alpha.replace(old, new, 1)
    applied.append(label)

for line in applied:
    print('  ok   ' + line)
for line in missed:
    print('  MISS ' + line)

if missed:
    print('AGE DIAL BIAS: refused to write -- %d edit(s) did not match exactly once' % len(missed))
    sys.exit(1)

open(ALPHA, 'w', encoding='utf8').write(alpha)
print('AGE DIAL BIAS: applied to %s' % ALPHA)
