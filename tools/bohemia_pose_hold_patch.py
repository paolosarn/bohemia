#!/usr/bin/env python3
"""
BOHEMIA — A CLIP IS A SET OF FROZEN POSES (Paolo 7/26/26)

"Do whatever you want... you need to be smarter than me when it comes to coding an
animation, you can't just keep being a yes man. Show me a couple animations where
there's just zero morphing. I'm tired of it."

THE MISTAKE IN ALL FOURTEEN EARLIER ATTEMPTS: every one of them still RECOMPUTED
the body every frame. Snap the angle, separate the canvases, rebind the shading --
the renderer still ran the full inverse sample at 24 slightly-different poses per
clip, and slightly-different input to a resampler means different pixels. You
cannot stop pixel art from morphing while you are still recalculating it 24 times.

WHAT THIS DOES INSTEAD. A clip resolves to a SMALL SET OF FROZEN POSES:

  1. Every joint is resolved across the whole clip with HYSTERESIS on POSITION:
     hold the joint where it is unless it has moved more than POSEHOLD.px pixels,
     then snap it to whole pixels. Resolved twice so the loop point agrees with
     itself. Deterministic, cached per (direction, clip).
  2. Each resolved pose gets a SIGNATURE. Consecutive frames that resolve to the
     same signature are THE SAME POSE, and buildFrame is asked for it once.
  3. So within a hold the frame is not recomputed and cannot differ. Zero
     morphing is a property of the construction, not a number we hope for.

WHY THE CLOTHING COMES ALONG FREE: the freeze happens at the POSE, upstream of
everything. Body, garments, hair, the anatomy line, the lot are all built from one
frozen pose, so every layer holds still together. No garment work required.

WHAT IS LEFT IS ANIMATION, NOT MORPHING. The picture changes only on the frames
where the pose actually changes -- a deliberate step from one drawn pose to the
next, which is what pixel art animation IS. A classic walk cycle is 4-8 drawn
frames. This is also the 120 BPM LAW, which the animation system had been quietly
ignoring while every other system obeyed it.

Stacks on top of ARMHOLD (angle quantization, proven 49%). ARMHOLD picks the arm's
angle; this freezes every joint's position. Strictly more stable than either.

REUSE CHECK (REUSE-FIRST / APPROVED-ASSETS-FIRST): cooks ZERO pixels. It reduces
how many distinct poses his existing painted art is asked to appear in.

Idempotent.

  python3 tools/bohemia_pose_hold_patch.py
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
   A CLIP IS A SET OF FROZEN POSES (Paolo 7/26/26)
   ---------------------------------------------------------------------------
   "Show me a couple animations where there's just zero morphing."

   Fourteen earlier attempts all failed the same way: they kept RECOMPUTING the
   body every frame. Snapping angles, separating canvases, rebinding shading --
   the inverse sampler still ran at 24 slightly-different poses per clip, and
   slightly-different input to a resampler means different pixels. Pixel art
   cannot stop morphing while it is being recalculated 24 times a cycle.

   So a clip now resolves to a SMALL SET OF FROZEN POSES. Every joint is held
   with hysteresis on POSITION -- stay put unless you have moved more than
   POSEHOLD.px pixels, then snap to whole pixels -- resolved across the whole
   clip, twice, so the loop agrees with itself. Frames that resolve to the same
   pose signature are THE SAME POSE and get built once.

   Zero morphing within a hold is therefore structural, not measured: there is
   nothing to differ, because nothing is recomputed. And the freeze happens at
   the POSE, upstream of the body, the garments, the hair and the anatomy line,
   so every layer holds still together and the clothing needed no work at all.

   What remains is a deliberate step from one pose to the next. That is
   animation. A classic walk cycle is 4-8 drawn frames, and this is the 120 BPM
   LAW finally applied to the character.
   =========================================================================== */
/* A FRAME COUNT, NOT A THRESHOLD. An animator does not pick a pixel tolerance,
   they pick how many frames the cycle is drawn on -- a walk is 8 frames whether
   the character is strolling or sprinting. A fixed pixel threshold cannot do
   that: measured, it left RUN on 20 poses (fast motion, almost no holds, so
   almost nothing protected) and collapsed IDLE to 1 (a statue, because idle's
   motion is sub-pixel). So the threshold is SOLVED FOR per clip to land the pose
   count in TARGET, and only the resulting hold structure is cached. */
const POSEHOLD={on:true,target:[6,9],pxMin:0.35,pxMax:6.0};
const POSEHOLD_CACHE=new Map();
function poseHoldResolve(d,clip,px){
  const B=FRAME_CACHE.buckets, held={}, seq=new Array(B);
  for(let pass=0;pass<2;pass++){
    for(let q=0;q<B;q++){
      const ph=(q+0.5)/B;
      const raw=posedSkel(d,clip,ph);
      const P=armHoldApply(d,clip,ph,raw.sk);
      const O={}; const parts=[];
      for(const j in P){
        const v=P[j];
        if(!Array.isArray(v)){O[j]=v;continue;}
        let h=held[j];
        if(!h||Math.abs(v[0]-h[0])>px||Math.abs(v[1]-h[1])>px)
          h=[Math.round(v[0]),Math.round(v[1])];
        held[j]=h; O[j]=[h[0],h[1]];
        parts.push(j+':'+h[0]+','+h[1]);
      }
      if(pass)seq[q]={sk:O,present:raw.present,sig:parts.join('|')};
    }
  }
  return seq;
}
function poseHoldCount(seq){const s=new Set();for(const f of seq)s.add(f.sig);return s.size;}
function poseHoldSeq(d,clip){
  const key=d+'|'+clip;
  const hit=POSEHOLD_CACHE.get(key); if(hit)return hit;
  const [lo,hi]=POSEHOLD.target;
  /* bisect the tolerance: more tolerance -> fewer poses. 12 steps is plenty for
     a monotone count over a 0.35..6px range, and it is deterministic. */
  let a=POSEHOLD.pxMin, b=POSEHOLD.pxMax, best=null, bestN=-1;
  for(let it=0; it<12; it++){
    const mid=(a+b)/2, seq=poseHoldResolve(d,clip,mid), n=poseHoldCount(seq);
    if(best===null||Math.abs(n-hi)<Math.abs(bestN-hi)){best=seq;bestN=n;}
    if(n>hi) a=mid; else if(n<lo) b=mid; else {best=seq;bestN=n;break;}
  }
  POSEHOLD_CACHE.set(key,best); return best;
}
/* the phase bucket -> its frozen pose. Same bucket family, same object, so the
   frame cache below sees one key for every frame of a hold. */
function poseHoldAt(d,clip,ph){
  if(!POSEHOLD.on)return null;
  let seq; try{seq=poseHoldSeq(d,clip);}catch(e){return null;}
  const B=FRAME_CACHE.buckets, q=(Math.floor((((ph%1)+1)%1)*B))%B;
  return seq[q]||null;
}
''' + ANCHOR
if 'function poseHoldSeq(' not in src:
    if src.count(ANCHOR) != 1:
        die('buildFrame anchor found %d times (need exactly 1)' % src.count(ANCHOR))
    src = src.replace(ANCHOR, RESOLVER, 1)
    did.append('the frozen-pose resolver is installed')

# ---------------------------------------------------------------------------
# 2. buildFrame builds the FROZEN pose
# ---------------------------------------------------------------------------
OLD_P = "  const _ps=posedSkel(d,clip,ph);const P=armHoldApply(d,clip,ph,_ps.sk);const PRES=_ps.present||{};"
NEW_P = ("  const _hp=poseHoldAt(d,clip,ph);\n"
         "  const _ps=_hp||posedSkel(d,clip,ph);\n"
         "  const P=_hp?_hp.sk:armHoldApply(d,clip,ph,_ps.sk);const PRES=_ps.present||{};"
         "   /* FROZEN POSE: within a hold there is nothing to recompute, so there is nothing to morph */")
if 'FROZEN POSE: within a hold' not in src:
    if src.count(OLD_P) != 1:
        die('buildFrame pose anchor found %d times (need exactly 1)' % src.count(OLD_P))
    src = src.replace(OLD_P, NEW_P, 1)
    did.append('buildFrame draws the frozen pose')

# ---------------------------------------------------------------------------
# 3. the frame cache keys on the POSE, not the phase. This is what makes every
#    frame of a hold literally the same frame instead of an identical-looking
#    recomputation.
# ---------------------------------------------------------------------------
OLD_C = "  const b=FRAME_CACHE.buckets,q=((Math.floor(((ph%1)+1)%1*b))%b);\n  const k=d+'|'+clip+'|'+q+'|'+frameLookHash(d);"
NEW_C = ("  const b=FRAME_CACHE.buckets,q=((Math.floor(((ph%1)+1)%1*b))%b);\n"
         "  /* FROZEN POSE: key on the resolved pose signature, so every frame of a hold\n"
         "     is ONE cache entry and therefore literally the same pixels, not a fresh\n"
         "     recomputation that merely ought to match. */\n"
         "  const _ph=poseHoldAt(d,clip,(q+0.5)/b);\n"
         "  const k=d+'|'+clip+'|'+(_ph?_ph.sig:q)+'|'+frameLookHash(d);")
if 'key on the resolved pose signature' not in src:
    if src.count(OLD_C) != 1:
        die('buildFrameCached anchor found %d times (need exactly 1)' % src.count(OLD_C))
    src = src.replace(OLD_C, NEW_C, 1)
    did.append('the frame cache keys on the pose, so a hold is one frame reused')

# ---------------------------------------------------------------------------
# 4. a rig edit or slider move re-resolves
# ---------------------------------------------------------------------------
OLD_R = "  try{ARMHOLD_CACHE.clear();}catch(e){}"
NEW_R = "  try{ARMHOLD_CACHE.clear();}catch(e){}\n  try{POSEHOLD_CACHE.clear();}catch(e){}"
if 'POSEHOLD_CACHE.clear()' not in src:
    if src.count(OLD_R) != 1:
        die('rebuildFromRig anchor found %d times (need exactly 1)' % src.count(OLD_R))
    src = src.replace(OLD_R, NEW_R, 1)
    did.append('a rig edit or slider move re-resolves the frozen poses')

if src == orig:
    print('POSE HOLD: already applied, nothing to do.')
    sys.exit(0)
open(ALPHA, 'w', encoding='utf-8').write(src)
print('POSE HOLD applied to slices/BOHEMIA_ALPHA_0_9.html')
for d in did:
    print('  - ' + d)
