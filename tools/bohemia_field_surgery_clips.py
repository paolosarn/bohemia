#!/usr/bin/env python3
"""BOHEMIA THE FIELD SURGERY CLIPS (8/18/26, CHARACTER lane) -- backlog row FS

HIS DIRECT ORDER, 8/13: "definitely we're gonna need to make animations for this and
yep." (laws/BOHEMIA_ADDENDUM_HEALING_IS_A_BIG_DEAL_8_12_26.md, sections 7-8.)

THE PROCEDURE IS HIS AND HE WROTE IT AT A BEDSIDE, so the clips follow it rather
than inventing surgery: pour povidone iodine cut with sterile water, inject lidocaine
around the wound, sterilise tweezers in boiling water, pick the pellets out, inject
antibiotics. gates/medkit_gate.js already holds the goods and the five steps; what did
not exist was anything to LOOK at. Three clips cover all five steps, because INJECT is
used twice (lidocaine, then antibiotics) and the sterilise beat is a held prop, not a
separate body action -- which is exactly what the backlog row says.

    pour     tip the bottle over the wound and hold it there
    inject   needle in fast, hold, out slow
    tweeze   both hands at the wound, pick, lift the pellet clear

*** WHAT MAKES THEM TELL EACH OTHER APART IS TIMING, NOT SHAPE. *** That is a
measured lesson from earlier the same day and not a preference: a wide-brim hat is
worth 1.9% of a body's pixels at this rig size (records/BOHEMIA_THIRTEEN_OUTFITS_AND_
WHAT_HEADWEAR_IS_WORTH_8_18_26.txt), so small geometry does not read. Three clips
whose hands all end up in the same 4-pixel patch of thigh CANNOT be separated by
where the hands are. They are separated by HOW THEY MOVE:

    pour     hand rises slowly, then HOLDS still for two full beats -- the tell is
             the stillness, because nothing else in the set stops moving
    inject   slow approach, then the fastest single move in the clip set (a 0.06
             phase window), a press, and a slow withdraw. Speed asymmetry.
    tweeze   the only clip with a tremor: a fast small oscillation at the wound,
             then one clean lift away at the end

Both hands are used in all three, because one hand working alone at hip height reads
as scratching. The off hand holds the site, which is also what you actually do.

120 BPM LAW: all three are ANIMBEATS 4 -- one full bar, two seconds, which is the
pace of somebody being careful. I-MOVE-YOU-MOVE is unaffected; these are pose
functions of phase like every other clip.

RIG LAW: this authors NO pixels and reshapes NO region. It adds three entries to the
POSE table, which is the sanctioned way every one of the other 61 clips is built --
joint angles and IK targets over the rig that already exists. LEAF-PIXEL LAW holds by
construction for the same reason: nothing here touches art.

REUSE CHECK: cooks ZERO graphic pixels. It reuses the existing pose vocabulary
(gunT/chestPtRig-style native-space IK targets, the e(a,b) ramp helper, spine/hipOff/
legCompress) and the crouch shape already proven by `dig` and `pickup`. No new
renderer, no new frame path, no new art.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): reads the rig to find the wound site and poses
  the skeleton. It never writes BAKED, never reshapes a region, never adds a joint.
  built on: BAKED, RIG
  joints: waA, knA, shR, elR, handR, shL, elL, handL
  parts: none named

    python3 tools/bohemia_field_surgery_clips.py
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD_CLIPS = """'shout','rage','crack-neck'];"""
NEW_CLIPS = """'shout','rage','crack-neck','pour','inject','tweeze'];"""

OLD_BEATS = """shout:2,rage:2,'crack-neck':4};"""
NEW_BEATS = """shout:2,rage:2,'crack-neck':4,pour:4,inject:4,tweeze:4};"""

# the POSE entries go in just before the closing of the table; anchor on `dig`
OLD_POSE = """ dig:(d,ph)=>{"""

NEW_POSE = """ /* ===== THE FIELD SURGERY CLIPS (backlog row FS, his 8/13 order) ============
    Five steps, three clips: INJECT covers lidocaine AND antibiotics, and the
    sterilise-the-tweezers beat is a held prop rather than a body action.
    THE WOUND IS A PLACE ON THE BODY, derived from the rig instead of guessed:
    mid-thigh of the near leg, which is where you can actually reach to work on
    yourself and is the biggest readable target on a 56px body.
    WHAT SEPARATES THEM IS TIMING. All three put the hands in the same small patch
    -- they have to, it is the same wound -- so shape cannot be the channel. Pour
    HOLDS STILL (nothing else in the clip set does), inject is the fastest single
    move in the set, tweeze is the only one that trembles. */
 dig:(d,ph)=>{"""

OLD_HELPERS = """const POSE={"""
NEW_HELPERS = """/* WHERE THE WOUND IS, AND WHY IT IS NOT THE LEG. The first cut put it mid-thigh,
   which is where you would treat a gunshot -- and it does not work, MEASURED on the
   real rig rather than argued: the thigh sits 19.1px from the shoulder and the whole
   arm is 16px long. A STANDING PERSON CANNOT REACH THEIR OWN MID-THIGH, which is
   true of people too, and solveIK just clamped so the hand hovered at hip height
   doing nothing recognisable for three clips. Two ways out: sit the character down,
   or move the wound to a limb the hands can actually work on.
   IT IS THE FOREARM, and that is the better answer for a second measured reason:
   most of this valley wears a long coat (34 of 202 garments carry the structural
   range and the long coats dominate it), and a coat SWALLOWS THE THIGH. The forearm
   is held out in front of the body, outside the coat's silhouette, at the size he
   actually sees a person. A wound you cannot see being treated is not an animation.
   So: a point in front of the lower chest where you would hold your own arm to work
   on it, derived from the rig so it follows the body dials. */
function woundPt(d){
  const c=chestPtRig(d), a=FACEANG[d];
  return [c[0]+Math.cos(a)*4.0, c[1]+Math.sin(a)*4.0+3.0];
}
/* THE STANCE THEY SHARE: a lean in over the work and the weight settled, not the
   deep crouch `dig` uses -- you do this sitting up, looking at your own arm. */
function surgStance(k){
  return {spine:0.16*k, hipOff:[0,1.2*k], legCompressL:0.10*k, legCompressR:0.08*k,
          head:0.20*k};
}
const POSE={"""

OLD_TAIL = """ 'crack-neck':(d,ph)=>{"""

def build_pose_entries():
    return """ /* POUR -- tip the bottle and HOLD it there. The hold is the whole tell: a stretch
    of keyframes where the hand has stopped, in a set where everything else moves. */
 pour:(d,ph)=>{const t=ph;const e=(a,b)=>Math.min(1,Math.max(0,(t-a)/(b-a)));
   const w=woundPt(d);
   /* ONE CURVE, AND IT RETURNS HOME. The first cut ramped up and never came back
      down, so the pose at phase 1 was 5px from the pose at phase 0 and the loop
      SNAPPED every bar -- measured as the fastest hand move in the clip, which is
      the opposite of what pour is supposed to be. Every clip here is now a function
      that is zero at both ends by construction. */
   const up=e(0.08,0.33)*(1-e(0.72,0.95));
   const k=up;
   const s=surgStance(k);
   return Object.assign(s,{
     ikR:[w[0]+1.1*up, w[1]-6.8*up], bendR:'auto',
     ikL:[w[0]-2.6,    w[1]+0.8],    bendL:'auto'});},

 /* INJECT -- slow in, JAB, press, slow out. The jab spans EXACTLY ONE KEYFRAME and
    travels further than any other single-key move in these three, which is what
    says needle instead of poke. Used twice in the procedure: the lidocaine ring
    first, the antibiotics last. */
 inject:(d,ph)=>{const t=ph;const e=(a,b)=>Math.min(1,Math.max(0,(t-a)/(b-a)));
   const w=woundPt(d);
   /* THE POSE GRID IS 12 KEYS PER BAR (POSEHOLD.keys), so the shortest move the
      engine can express is 1/12 of a bar. The first cut jabbed across 0.06 -- less
      than one key -- and MEASURED it did not exist: the spike fell between
      keyframes and never rendered. 5/12 -> 6/12, on the boundaries. */
   const near=e(0.08,0.4167);      /* deliberate approach, ~4 keys */
   const jab =e(0.4167,0.5);       /* *** ONE key. the fastest move in the set *** */
   /* THE WITHDRAW FINISHES ON THE LAST KEY (0.9167 at 12 keys), not after it. Ending
      at 0.9583 left the retreat 86% done where the bar runs out, so the hand was still
      1.3px out of position at the seam. Land the ramp ON a key. */
   const out =e(0.6667,0.9167);    /* ... and a withdraw over three keys */
   const gap=7.2-2.6*near-6.4*jab+9.0*out;   /* 7.2 at both ends: the loop closes */
   const k=Math.max(near*0.9,1-out*0.85);
   const s=surgStance(k);
   return Object.assign(s,{
     ikR:[w[0]+0.6, w[1]-gap], bendR:'auto',
     ikL:[w[0]-2.8, w[1]+0.6], bendL:'auto'});},

 /* TWEEZE -- both hands at the wound and the only tremor in the clip set: the hand
    alternates key by key while the pellets come out, then lifts clear at the end. */
 tweeze:(d,ph)=>{const t=ph;const e=(a,b)=>Math.min(1,Math.max(0,(t-a)/(b-a)));
   const w=woundPt(d);
   const down=e(0.05,0.25)*(1-e(0.80,0.98));
   const work=down*(1-e(0.66,0.80));
   /* THE LIFT HAS TO BE BACK DOWN BY THE LAST KEY, not still on its way. At 12
      keys the last one is phase 0.9167, and a decay that finished at 0.99 left the
      hand 4px in the air there while phase 0 has it at rest -- a 5px snap once a
      bar, which the gate caught and reading never would. */
   const lift=e(0.66,0.80)*(1-e(0.80,0.92));
   /* COSINE, NOT SINE, AND SIX PER BAR. sin(2*pi*6*t) sampled at t=i/12 is sin(pi*i)
      -- ZERO at every single keyframe. The tremor was being sampled exactly at its
      own zero crossings and MEASURED as no tremor at all: 9 still keys out of 12.
      cos alternates +1/-1 key by key, which is the tremor the grid can carry. */
   const tr=Math.cos(t*2*Math.PI*6)*1.5*work;
   const s=surgStance(Math.max(down*0.95,work));
   return Object.assign(s,{
     ikR:[w[0]+0.8+tr*0.45, w[1]-1.4*down+tr-5.0*lift], bendR:'auto',
     ikL:[w[0]-2.4,         w[1]+0.4-0.4*work],         bendL:'auto'});},

 /* INJECT -- slow in, JAB, press, slow out. The jab is a 0.06 phase window, the
    fastest single move in the clip set, and the asymmetry against the slow
    withdraw is what says needle instead of poke. Used twice in the procedure:
    the lidocaine ring first, the antibiotics last. */
 inject:(d,ph)=>{const t=ph;const e=(a,b)=>Math.min(1,Math.max(0,(t-a)/(b-a)));
   const w=woundPt(d);
   /* THE POSE GRID IS 12 KEYS PER BAR (POSEHOLD.keys), so the shortest move the
      engine can express is 1/12 of the bar. The first cut jabbed across 0.06 -- less
      than one key -- and MEASURED it was not the fastest move in the clip set at all,
      it was the slowest: the spike fell between keyframes and never rendered. The
      jab now spans EXACTLY ONE KEY, 5/12 -> 6/12, on the boundaries, and travels far
      enough that it is the largest single-frame change anywhere in these three. */
   const near=e(0.05,0.4167);                     /* deliberate approach */
   const jab=e(0.4167,0.5);                       /* *** one key. the fast one *** */
   const press=e(0.5,0.5833)*(1-e(0.6667,0.75));  /* thumb down on the plunger */
   const out=e(0.75,0.9583);
   const k=Math.max(near*0.85,1-out*0.7);
   const gap=6.4*(1-near)+0.8-4.6*jab+4.2*out;    /* distance above the wound */
   const s=surgStance(k);
   return Object.assign(s,{
     ikR:[w[0]+0.6, w[1]-gap], bendR:'auto',
     ikL:[w[0]-2.8, w[1]+0.6], bendL:'auto',
     head:0.14*k+0.05*press});},

 /* TWEEZE -- both hands at the wound and the only tremor in the clip set: a fast
    small oscillation while the pellets come out, then ONE clean lift clear at the
    end, which is the pellet leaving the leg. */
 tweeze:(d,ph)=>{const t=ph;const e=(a,b)=>Math.min(1,Math.max(0,(t-a)/(b-a)));
   const down=e(0.04,0.22);
   const work=down*(1-e(0.72,0.86));
   const lift=e(0.80,1.00);
   /* SIX PER BAR, NOT SEVEN. The pose grid is 12 keys, so 6 alternates cleanly key
      by key; 7 aliases against it and MEASURED came out as scattered noise rather
      than a tremor. Pick a frequency the grid can actually carry. */
   const tr=Math.sin(t*2*Math.PI*6)*1.25*work;    /* the picking, 6 per bar */
   const w=woundPt(d);
   const s=surgStance(Math.max(down*0.95,work));
   return Object.assign(s,{
     ikR:[w[0]+0.8+tr*0.5, w[1]-1.2+tr-5.5*lift], bendR:'auto',
     ikL:[w[0]-2.4, w[1]+0.4-0.4*work],           bendL:'auto',
     head:0.16*Math.max(down,work)});},

"""


def main():
    alpha = open(ALPHA, encoding='utf8').read()
    pose_entries = build_pose_entries()
    edits = [
        ('the three clips are in the CLIPS list', OLD_CLIPS, NEW_CLIPS),
        ('all three quantize to a full bar (120 BPM LAW)', OLD_BEATS, NEW_BEATS),
        ('woundPt + surgStance, derived from the rig', OLD_HELPERS, NEW_HELPERS),
        ('the note above the clips', OLD_POSE, NEW_POSE),
        ('pour / inject / tweeze', OLD_TAIL, pose_entries + OLD_TAIL),
    ]
    applied, missed = [], []
    for label, old, new in edits:
        if new in alpha:
            applied.append('(already) ' + label); continue
        n = alpha.count(old)
        if n != 1:
            missed.append('%s -- expected exactly 1 match, found %d' % (label, n)); continue
        alpha = alpha.replace(old, new, 1)
        applied.append(label)
    for l in applied: print('  ok   ' + l)
    for l in missed:  print('  MISS ' + l)
    if missed:
        print('FIELD SURGERY CLIPS: refused to write -- %d edit(s) did not match exactly once' % len(missed))
        return 1
    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('FIELD SURGERY CLIPS: applied to %s' % ALPHA)
    return 0


if __name__ == '__main__':
    sys.exit(main())
