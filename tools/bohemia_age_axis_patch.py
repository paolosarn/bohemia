#!/usr/bin/env python3
"""BOHEMIA AGE AXIS (8/11/26, CHARACTER lane) -- CHILD / TEEN / YOUNG ADULT /
ADULT / ELDER on the ONE rig.

PAOLO, 8/11, correcting the family cast I shipped an hour earlier:
  "we have to assign the different heights in the different body sizing... that's
   why we did all of that shit and you're just gonna create a family without
   fucking with the skeleton like are we even able to make character a kid child
   characters ... like teenagers like young adults"

HE IS RIGHT AND MY FAMILY WAS FOUR OF THE SAME MAN. I built it out of BODYVAR
dials alone, and I should have checked what those dials can actually reach:

    BODYVAR PART_SPEC covers parts 4 (torso), 5/6 (arms), 9/10 (legs).
    IT NEVER TOUCHES THE HEAD.
    AMP.height = 0.05 -- plus or minus 2.3px on a 44px body.

So every dial in the system is a WIDTH dial plus a 2-pixel height nudge. Four
people built from those are four people the same height with the same head. A
CHILD WAS NOT EXPRESSIBLE AT ALL, because the thing that makes a child read as a
child is head-to-body ratio and nothing in the system could move it.

------------------------------------------------------------------------------
THE MECHANISM WAS ALREADY THERE. IT WAS JUST CLAMPED.

warpPose carries this comment, and it is the whole answer:

    "HEAD KEEPS ITS AUTHORED BONE, EXACTLY. A taller adult is not a bigger head;
     scaling the head bone would scale nothing visually (the head is a rigid
     stamp) but WOULD drag the stamp's midpoint anchor off the neck."

For a TALLER ADULT that rule is correct and it is why height is capped. For a
CHILD IT IS EXACTLY THE MECHANISM: shrink the body about the ground, leave the
head stamp at its authored size, and the head-to-body ratio rises on its own. No
repaint, no second anatomy, no reshaping of a single painted region. RIG LAW is
untouched -- this moves JOINTS, which is what warpPose already does.

AND SHRINKING IS FRAME-SAFE. The plus-or-minus 5% cap exists because his painted
body already paints on ROW 0 in nine clips -- growing runs out of frame. Going
DOWN has no such limit and never has. The cap was symmetric because it was
designed as a symmetric dial, not because small was dangerous.

------------------------------------------------------------------------------
THE NUMBERS ARE MEASURED FROM HIS SKELETON, NOT COPIED FROM AN ANATOMY BOOK.

Read off BAKED.pose.S:
    headTop y=7, neck y=16   ->  head bone 9px
    ground  y=51             ->  standing height 44px
    head / height = 0.205    ->  HIS ADULT IS A 4.89-HEAD FIGURE
    waist-to-ground / height = 0.455

Real adults are 7.5-8 heads. HIS RIG IS A STYLISED 4.89 AND THAT IS HIS ART --
so the age axis scales the RATIO OF CHANGE into his scale instead of importing
real head-counts, which would have "corrected" his proportions into somebody
else's game.

Real head-count by age, used only for the RATIO:
    ~8 yr  6.0 heads   /  adult 7.75  =  0.774
    ~14 yr 7.0 heads   /  adult 7.75  =  0.903
Applied to his 4.89:
    CHILD  0.774 x 4.89 = 3.79 heads  ->  9px head, 34px tall  ->  scale 0.77
    TEEN   0.903 x 4.89 = 4.41 heads  ->  9px head, 40px tall  ->  scale 0.90

CROSS-CHECKED AGAINST REAL STATURE, and the two agree, which is the reason to
trust it: an 8-year-old is ~128cm against a ~175cm adult = 0.73, and a 14-year-
old ~163cm = 0.93. Head-count ratio and stature ratio land in the same place
because the head is a fixed stamp. Two independent routes, one answer.

SHORTER LEGS, NOT JUST A SHORTER BODY. Leg fraction is the second thing that
makes a child read young: it rises with age (~0.40 at six, ~0.47-0.50 adult).
His adult measures 0.455, so the child gets its waist pushed DOWN by 6% of span
and the knees by half that. Without this a child is just a small adult, which is
the uncanny thing every game gets wrong.

ELDER is stature loss (~2-4cm real) and nothing else here -- posture and mass
are BODYVAR's job and belong on the dials he already has.

------------------------------------------------------------------------------
WHAT THIS DOES NOT DO

It does not touch BODYVAR, whose gate asserts neutral is byte-identical canon.
`adult` returns the baked package UNCHANGED by identity, so the player and every
existing surface render exactly as before -- the axis can only be entered
deliberately. It composes UNDER the dials: age sets the proportion, dials still
shape the build on top of it.

    python3 tools/bohemia_age_axis_patch.py
RIG CHECK (RIG IS LAW, Paolo 7/26/26): the age axis NEVER makes a second body. Every
  stage is a re-map of the ONE painted rig: BOH_AGE.apply(BAKED, stage) scales the
  POSE about the ground line and hands the SAME layers and the SAME skeleton back,
  and 'adult' returns the package by identity. The HEAD keeps its authored bone --
  headTop is re-derived from neck by the painted offset -- because the head is a
  rigid stamp and a child's skull is nearly adult size, which is the whole reason a
  child reads as a child. No new anatomy, no second rig.
  built on: BAKED, BAKED.pose, BODY_PKG, BOH_BODYVAR
  joints: neck, headTop, footA, footB, waC, waA, waB, kneeA, kneeB
  parts: none
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

AGE_ANCHOR = "const BONES={head:['neck','headTop']"

AGE_NEW = """/* ===== THE AGE AXIS (Paolo 8/11: "are we even able to make kid child characters
   ... like teenagers like young adults") ====================================
   CHILD / TEEN / YOUNG ADULT / ADULT / ELDER on the ONE rig, by PROPORTION.

   It works because warpPose already refuses to scale the head: the head is a
   rigid stamp anchored to the neck. Shrink the body about the ground and leave
   that stamp alone, and head-to-body ratio rises by itself. That is what makes a
   child a child. No repaint, no second anatomy, no painted region reshaped --
   this moves JOINTS, exactly as the height dial already does.

   MEASURED OFF BAKED.pose.S, not guessed: head bone 9px, standing height 44px,
   so his adult is a 4.89-HEAD figure (real humans are 7.5-8). His rig is
   stylised and that is HIS ART, so the ratio of change is scaled into his
   proportions instead of importing real head-counts and "correcting" him.

     ~8yr  is 6.0/7.75 = 0.774 of adult head-count -> 3.79 heads -> scale 0.77
     ~14yr is 7.0/7.75 = 0.903                     -> 4.41 heads -> scale 0.90
   Cross-checked against real stature (128cm/175cm = 0.73, 163cm = 0.93): the two
   routes agree, because the head is fixed.

   GOING DOWN IS FRAME-SAFE. AMP.height is capped at 5% because his body already
   paints row 0 in nine clips -- GROWING runs out of frame. Shrinking never did.

   legBias is the second half: a child's leg fraction is genuinely lower (~0.40
   at six vs ~0.47 adult; his adult measures 0.455), so the waist goes DOWN and
   the knees half as far. Without it a child is just a small adult. */
const BOH_AGE = (function () {
  const STAGES = {
    child:      { h: 0.77, legBias: -0.06, label: 'CHILD' },
    teen:       { h: 0.90, legBias: -0.02, label: 'TEEN' },
    youngadult: { h: 0.97, legBias:  0.00, label: 'YOUNG ADULT' },
    adult:      { h: 1.00, legBias:  0.00, label: 'ADULT' },
    elder:      { h: 0.97, legBias:  0.00, label: 'ELDER' }
  };
  function apply(baked, stage) {
    const S = STAGES[stage];
    /* ADULT RETURNS THE PACKAGE BY IDENTITY. bodyvar_gate asserts neutral is
       byte-identical canon, and the player must render exactly as before: the
       axis can only be entered deliberately. */
    if (!baked || !S || stage === 'adult' || !baked.pose) return baked;
    const pose = {};
    for (const d in baked.pose) {
      const P = baked.pose[d], n = {};
      let ground = -1e9;
      if (P.footA) ground = Math.max(ground, P.footA[1]);
      if (P.footB) ground = Math.max(ground, P.footB[1]);
      if (ground < -1e8) ground = (baked.H || 56) - 1;
      for (const j in P) n[j] = [P[j][0], ground + (P[j][1] - ground) * S.h];
      /* the head keeps its authored bone -- the same rule warpPose follows, and
         here it is the entire point rather than a caveat */
      if (P.neck && P.headTop) n.headTop = [n.neck[0] + (P.headTop[0] - P.neck[0]),
                                            n.neck[1] + (P.headTop[1] - P.neck[1])];
      if (S.legBias && P.waC && n.headTop) {
        const span = ground - n.headTop[1], dy = span * S.legBias;
        ['waC', 'waA', 'waB'].forEach(function (j) { if (n[j]) n[j] = [n[j][0], n[j][1] - dy]; });
        ['kneeA', 'kneeB'].forEach(function (j) { if (n[j]) n[j] = [n[j][0], n[j][1] - dy * 0.5]; });
      }
      pose[d] = n;
    }
    return { W: baked.W, H: baked.H, skeleton: baked.skeleton, layers: baked.layers,
             pose: pose, layerOverride: baked.layerOverride, swingAmt: baked.swingAmt,
             age: stage };
  }
  return { apply: apply, STAGES: STAGES, NAMES: Object.keys(STAGES) };
})();
window.BOH_AGE = BOH_AGE;
const BONES={head:['neck','headTop']"""

WIRE_OLD = "  const src=BODY_PKG=BOH_BODYVAR.apply(BAKED,G.bodyVar);"
WIRE_NEW = ("  /* AGE UNDER, DIALS OVER: age sets the PROPORTION, the dials still shape the\n"
            "     build on top of it. G.age is undefined for the player, and BOH_AGE returns\n"
            "     the package by identity for 'adult', so nothing that existed before moves. */\n"
            "  const src=BODY_PKG=BOH_BODYVAR.apply(BOH_AGE.apply(BAKED,G.age||'adult'),G.bodyVar);")

alpha = open(ALPHA, encoding='utf8').read()
before = alpha
applied, missed = [], []

for label, old, new in [
    ('the AGE axis (child/teen/young adult/adult/elder)', AGE_ANCHOR, AGE_NEW),
    ('age wired UNDER the dials in buildFrame', WIRE_OLD, WIRE_NEW),
]:
    if new in alpha:
        applied.append('(already) ' + label)
        continue
    n = alpha.count(old)
    if n != 1:
        missed.append('%s — expected exactly 1 anchor, found %d' % (label, n))
        continue
    alpha = alpha.replace(old, new, 1)
    applied.append(label)

for line in applied:
    print('  ok   ' + line)
for line in missed:
    print('  MISS ' + line)

if missed:
    print('AGE AXIS: refused to write — %d anchor(s) did not match exactly once' % len(missed))
    sys.exit(1)

if alpha != before:
    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('AGE AXIS: applied to %s' % ALPHA)
else:
    print('AGE AXIS: already applied, nothing to write')
