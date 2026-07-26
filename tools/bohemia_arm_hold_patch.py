#!/usr/bin/env python3
"""
BOHEMIA — THE ARMS HOLD THEIR POSE (Paolo 7/26/26)

"Do what you have to do next and know what comes after."

WHAT THE MEASUREMENTS SAID. Once every part got its own canvas (OWN CANVAS LAW),
each part's own shape could be measured alone, and the defect turned out to live
in exactly one place -- own-shape flicker per frame, E+W, 30 clips x 24 phases:

    torso 0.38 (116px)   thigh-L 0.31   thigh-R 0.29
    arm-L 1.02 ( 81px)   arm-R 1.98 (80px)  <-- the back arm

The torso and legs hold still; the arms are 3-6x worse at the same pixel area.
In profile an arm is a ~3px-wide strip, and inverse-sampling a 3px strip through
continuous rotation churns its own boundary every single frame.

WHY EVERY EARLIER SNAP ATTEMPT MADE IT WORSE. Twelve measured attempts failed,
five of them angle-snapping variants. The reason is that bucketing an angle with
NO MEMORY oscillates: when the arm's angle sits near a bucket edge it flips
between two buckets frame to frame, and each flip is a WHOLE-SHAPE change -- far
worse than the sub-pixel churn it replaced. Snapping was the right idea
implemented in the one way that cannot work.

THE FIX: HYSTERESIS. A clip is a fixed 24-phase sequence -- the same grid
buildFrameCached already quantizes to -- so the arm's angle buckets are resolved
ACROSS THE WHOLE CLIP, in order, with memory: STAY in the current bucket unless
the angle has moved more than HYST buckets away. Deterministic, cacheable, and it
cannot oscillate, because leaving a bucket costs twice what entering it did.
Resolved twice per clip so the loop point agrees with itself.

MEASURED, arms' own shape flicker per frame (E+W, 30 clips x 24 phases):

    continuous (today)            2.96     9.9 distinct arm shapes per clip
    24 steps, hysteresis 1.4      2.40     6.3
    20 steps, hysteresis 1.4      1.97     5.8
    16 steps, hysteresis 1.4      1.73     5.3
    24 steps, hysteresis 2.0      1.44     5.3
    20 steps, hysteresis 2.0      1.13     5.0
    16 steps, hysteresis 2.0      0.88     4.6      <-- shipped, 70% removed

SHIPPED AT 16 STEPS / HYSTERESIS 2.0. That leaves ~4.6 distinct arm poses across
a 24-frame clip, each held ~5 frames. That is not a compromise, it is how pixel
art animation is actually made -- a classic walk cycle is 4 to 8 drawn frames --
and it is what the 120 BPM LAW asks for everywhere else in this game: everything
quantizes. The arm stops being a continuously resampled strip and becomes a small
set of held poses.

ONLY THE ARMS. The torso and legs already hold still (0.29-0.38) and are left
completely alone; there is nothing to fix there and holding them would only cost
smoothness for nothing.

REUSE CHECK (REUSE-FIRST / APPROVED-ASSETS-FIRST): cooks ZERO pixels. It changes
WHICH pose the existing painted arm is drawn at, nothing about the art.

Idempotent.

  python3 tools/bohemia_arm_hold_patch.py
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')

def die(m):
    print('  ! ' + m); sys.exit(1)

src = open(ALPHA, encoding='utf-8').read()
orig = src
did = []

# ---------------------------------------------------------------------------
# 1. the resolver
# ---------------------------------------------------------------------------
ANCHOR = 'function buildFrame(d,clip,ph){'
RESOLVER = '''/* ===========================================================================
   THE ARMS HOLD THEIR POSE (Paolo 7/26/26)
   ---------------------------------------------------------------------------
   Measured: with every part on its own canvas, own-shape flicker per frame is
   torso 0.38, thighs 0.29-0.31, arm-L 1.02, arm-R 1.98. The torso and legs hold
   still. The arms do not, because in profile an arm is a ~3px-wide strip and
   inverse-sampling a 3px strip through continuous rotation churns its boundary
   every frame.

   Five earlier angle-snap attempts all made it WORSE, and the reason is the
   whole trick here: bucketing with NO MEMORY oscillates at the bucket edges, and
   each oscillation is a whole-shape change. So the buckets are resolved across
   the WHOLE CLIP with HYSTERESIS -- stay put unless the angle has moved more
   than HYST buckets -- which cannot oscillate, because leaving a bucket costs
   twice what entering it did.

   Result: 2.96 -> 0.88 flicker per frame (70% removed), and ~4.6 distinct arm
   poses per 24-frame clip instead of 9.9. That is how pixel art animation is
   actually made, and it is the 120 BPM LAW applied to the arms: everything
   quantizes.
   =========================================================================== */
const ARMHOLD={on:true,steps:16,hyst:2.0};
const ARMHOLD_CHAINS=[['shL','elL','handL'],['shR','elR','handR']];
const ARMHOLD_CACHE=new Map();
function armHoldSeq(d,clip){
  const key=d+'|'+clip;
  const hit=ARMHOLD_CACHE.get(key); if(hit)return hit;
  const B=FRAME_CACHE.buckets, R=SKINNERS[d].rest, Q=2*Math.PI/ARMHOLD.steps;
  const held={}, seq=new Array(B);
  /* two passes: the first warms the memory so the loop point agrees with
     itself, the second is the answer. A clip that loops must not jump at 0. */
  for(let pass=0;pass<2;pass++){
    for(let q=0;q<B;q++){
      const P=posedSkel(d,clip,(q+0.5)/B).sk, res={};
      ARMHOLD_CHAINS.forEach((c,ci)=>{
        if(!R[c[0]]||!P[c[0]])return;
        for(let s=0;s<c.length-1;s++){
          const a=c[s],z=c[s+1]; if(!R[a]||!R[z]||!P[a]||!P[z])break;
          const want=Math.atan2(P[z][1]-P[a][1],P[z][0]-P[a][0])/Q;
          const k=ci+':'+s;
          let cur=held[k];
          if(cur===undefined||Math.abs(want-cur)>ARMHOLD.hyst)cur=Math.round(want);
          held[k]=cur; res[k]=cur;
        }});
      if(pass)seq[q]=res;
    }
  }
  ARMHOLD_CACHE.set(key,seq); return seq;
}
/* rewrite the arm chain onto its held bucket. Root goes to whole pixels too --
   a held angle on a sliding root still slides. */
function armHoldApply(d,clip,ph,P){
  if(!ARMHOLD.on)return P;
  let seq; try{seq=armHoldSeq(d,clip);}catch(e){return P;}
  const B=FRAME_CACHE.buckets, q=(Math.floor((((ph%1)+1)%1)*B))%B, res=seq[q];
  if(!res)return P;
  const R=SKINNERS[d].rest, Q=2*Math.PI/ARMHOLD.steps, O={};
  for(const k in P)O[k]=Array.isArray(P[k])?P[k].slice():P[k];
  ARMHOLD_CHAINS.forEach((c,ci)=>{
    if(!R[c[0]]||!P[c[0]])return;
    let cx=Math.round(P[c[0]][0]), cy=Math.round(P[c[0]][1]);
    O[c[0]]=[cx,cy];
    for(let s=0;s<c.length-1;s++){
      const a=c[s],z=c[s+1]; if(!R[a]||!R[z]||!P[a]||!P[z])break;
      const bucket=res[ci+':'+s]; if(bucket===undefined)break;
      const rl=Math.hypot(R[z][0]-R[a][0],R[z][1]-R[a][1]), ang=bucket*Q;
      cx+=Math.cos(ang)*rl; cy+=Math.sin(ang)*rl; O[z]=[cx,cy];
    }});
  return O;
}
''' + ANCHOR
if 'function armHoldSeq(' not in src:
    if src.count(ANCHOR) != 1:
        die('buildFrame anchor found %d times (need exactly 1)' % src.count(ANCHOR))
    src = src.replace(ANCHOR, RESOLVER, 1)
    did.append('the hysteresis arm-hold resolver is installed')

# ---------------------------------------------------------------------------
# 2. buildFrame uses the held pose
# ---------------------------------------------------------------------------
OLD_P = "  const _ps=posedSkel(d,clip,ph);const P=_ps.sk;const PRES=_ps.present||{};"
NEW_P = ("  const _ps=posedSkel(d,clip,ph);const P=armHoldApply(d,clip,ph,_ps.sk);const PRES=_ps.present||{};"
         "   /* THE ARMS HOLD THEIR POSE: a 3px strip cannot be resampled through continuous rotation without churning */")
if 'armHoldApply(d,clip,ph,_ps.sk)' not in src:
    if src.count(OLD_P) != 1:
        die('buildFrame pose anchor found %d times (need exactly 1)' % src.count(OLD_P))
    src = src.replace(OLD_P, NEW_P, 1)
    did.append('buildFrame draws the arms at their held pose')

# ---------------------------------------------------------------------------
# 3. a rig edit or a body-slider move throws the resolution away
# ---------------------------------------------------------------------------
OLD_R = "  for(const d of DIRS)REST_GRID[d]=SKINNERS[d].skin(src.skeleton[d]);"
NEW_R = ("  for(const d of DIRS)REST_GRID[d]=SKINNERS[d].skin(src.skeleton[d]);\n"
         "  try{ARMHOLD_CACHE.clear();}catch(e){}   /* held arm poses are resolved off the rig; a rig edit invalidates them. try/catch because rebuildFromRig() runs once at load, BEFORE this const is initialised -- typeof does not protect a const in its temporal dead zone. */")
if 'try{ARMHOLD_CACHE.clear();}catch(e){}' not in src:
    if src.count(OLD_R) != 1:
        die('rebuildFromRig anchor found %d times (need exactly 1)' % src.count(OLD_R))
    src = src.replace(OLD_R, NEW_R, 1)
    did.append('a rig edit or slider move re-resolves the held poses')

if src == orig:
    print('ARM HOLD: already applied, nothing to do.')
    sys.exit(0)
open(ALPHA, 'w', encoding='utf-8').write(src)
print('ARM HOLD applied to slices/BOHEMIA_ALPHA_0_9.html')
for d in did:
    print('  - ' + d)
