#!/usr/bin/env python3
"""
BOHEMIA — KEY THE EXTREMES, THEN HOLD (Paolo 7/26/26)

His verdict on the frozen-pose build: "it didn't really look that different. The
difference is the arms aren't moving for a lot of the animations."

HE WAS RIGHT AND IT WAS BAD. Measured hand travel per cycle, holds off -> on:

    walk   29.8 -> 0.0   (-100%)   the hands do not move AT ALL
    run    43.4 -> 6.5   ( -85%)
    drunk  22.6 -> 5.6   ( -75%)
    dance  32.0 -> 9.4   ( -71%)
    greet  41.5 -> 26.2  ( -37%)
    throw  41.5 -> 29.4  ( -29%)

I traded morphing for dead arms. A still arm reads as broken, so that is a worse
build, not a better one.

WHY IT HAPPENED. Both holds were "STAY PUT UNLESS YOU HAVE MOVED MORE THAN X".
That rule LAGS by construction: the pose only updates after the motion has already
gone past, so the swing reverses before the last step ever fires and the extremes
get clipped off. Solve the tolerance for a pose count and it gets worse, because a
big swing gets a big tolerance -- which is precisely why WALK, whose arms have the
cleanest wide swing, lost everything.

THE FIX IS HOW ANIMATORS ACTUALLY WORK: you do not threshold motion, you KEY THE
EXTREMES and hold between them.

  1. The EXTREMES are found and are always keys -- every phase where the hand
     reverses direction. Those are the two ends of the swing, and rendering them
     verbatim is what preserves the full amplitude.
  2. More keys are added by EQUAL ARC LENGTH along the pose trajectory until the
     clip has its target count. Arc length puts keys where the motion actually
     is, so fast passages get detail and slow ones get held -- which is also what
     an animator does.
  3. Every frame snaps to its NEAREST key. Never to the previous one. That is the
     whole difference: nearest cannot lag, previous always does.

Zero morphing is untouched, because it never depended on the lag: frames that
share a key share one pose signature, so they are one cache entry and literally
the same pixels. Amplitude and zero-morph are not in tension; the old rule was
just the wrong way to get the second one.

ARMHOLD IS SUPERSEDED and switched off here. Its angle bucketing was the same
"stay put" rule one level down, so it clipped the swing too. Key poses do its job
correctly. The code stays for the record; the flag goes to false.

REUSE CHECK (REUSE-FIRST / APPROVED-ASSETS-FIRST): cooks ZERO pixels. It changes
WHICH of his poses get drawn, and now draws the extremes he authored instead of
lagging behind them.

Idempotent.

  python3 tools/bohemia_key_poses_patch.py
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')

def die(m):
    print('  ! ' + m); sys.exit(1)

src = open(ALPHA, encoding='utf-8').read()
orig = src

if 'KEY THE EXTREMES' in src:
    print('KEY POSES: already applied, nothing to do.')
    sys.exit(0)

# ---------------------------------------------------------------------------
# 1. ARMHOLD off -- it was the same lagging rule one level down
# ---------------------------------------------------------------------------
OLD_AH = 'const ARMHOLD={on:true,steps:16,hyst:2.0};'
NEW_AH = ('/* SUPERSEDED 7/26/26 by KEY THE EXTREMES (see poseKeys below). This bucketed the\n'
          '   arm ANGLE with hysteresis, which is the same "stay put unless you moved enough"\n'
          '   rule as the position hold, and it clipped the swing the same way: measured, walk\n'
          '   lost 100% of its hand travel. Kept for the record, switched OFF. */\n'
          'const ARMHOLD={on:false,steps:16,hyst:2.0};')
if src.count(OLD_AH) != 1:
    die('ARMHOLD anchor found %d times (need exactly 1)' % src.count(OLD_AH))
src = src.replace(OLD_AH, NEW_AH, 1)

# ---------------------------------------------------------------------------
# 2. replace the lagging resolver with key selection
# ---------------------------------------------------------------------------
m = re.search(r"/\* A FRAME COUNT, NOT A THRESHOLD\..*?\n\}\nfunction poseHoldCount", src, re.S)
if not m:
    die('could not locate the resolver block to replace')
start = m.start()
m2 = re.search(r"function poseHoldSeq\(d,clip\)\{.*?\n\}\n", src[start:], re.S)
if not m2:
    die('could not locate poseHoldSeq to replace')
end = start + m2.end()

NEW_BLOCK = '''/* KEY THE EXTREMES, THEN HOLD (Paolo 7/26/26)
   ---------------------------------------------------------------------------
   His verdict on the previous build: "the arms aren't moving for a lot of the
   animations." He was right. Measured hand travel per cycle: walk 29.8 -> 0.0,
   run 43.4 -> 6.5, dance 32.0 -> 9.4. The arms were dead.

   THE CAUSE was the rule, not the tuning. Both holds said "STAY PUT UNLESS YOU
   HAVE MOVED MORE THAN X", which LAGS by construction: the pose only updates
   after the motion has gone past, so the swing reverses before the last step
   fires and the extremes get clipped. Solving the tolerance for a pose count
   made it worse, because a big swing earns a big tolerance -- which is exactly
   why WALK, with the widest cleanest arm swing, lost all of it.

   HOW ANIMATORS ACTUALLY DO IT: key the extremes, hold between them.
     1. every phase where the hand REVERSES DIRECTION is a key, always. Those are
        the ends of the swing and drawing them verbatim is what keeps amplitude.
     2. fill to the target count by EQUAL ARC LENGTH along the pose trajectory,
        so keys land where the motion actually is.
     3. each frame snaps to its NEAREST key, never to the previous one. Nearest
        cannot lag; previous always does.

   Zero morphing is unaffected: frames sharing a key share a pose signature, so
   they are one cache entry and literally the same pixels. Amplitude and
   zero-morph were never in tension. */
const POSEHOLD={on:true,keys:12};
const POSEHOLD_CACHE=new Map();
function poseHoldResolve(d,clip){
  const B=FRAME_CACHE.buckets, raw=[];
  for(let q=0;q<B;q++){
    const ph=(q+0.5)/B, r=posedSkel(d,clip,ph);
    raw.push({sk:r.sk,present:r.present});
  }
  const JK=Object.keys(raw[0].sk).filter(j=>Array.isArray(raw[0].sk[j]));
  /* pose-to-pose distance, around the loop */
  const step=[];
  for(let q=0;q<B;q++){
    const A=raw[q].sk, C=raw[(q+1)%B].sk; let s=0;
    for(const j of JK){const a=A[j],c=C[j]; if(a&&c)s+=Math.hypot(c[0]-a[0],c[1]-a[1]);}
    step.push(s);
  }
  const total=step.reduce((x,y)=>x+y,0);
  const isKey=new Uint8Array(B); isKey[0]=1;
  /* 1. THE EXTREMES. Any phase where a hand reverses direction is an end of the
     swing and must be drawn, or the amplitude is lost. */
  for(const hj of ['handL','handR']){
    for(let q=0;q<B;q++){
      const a=raw[(q+B-1)%B].sk[hj], b=raw[q].sk[hj], c=raw[(q+1)%B].sk[hj];
      if(!a||!b||!c)continue;
      const v1=[b[0]-a[0],b[1]-a[1]], v2=[c[0]-b[0],c[1]-b[1]];
      const m1=Math.hypot(v1[0],v1[1]), m2=Math.hypot(v2[0],v2[1]);
      if(m1<0.2||m2<0.2)continue;
      if(v1[0]*v2[0]+v1[1]*v2[1] < 0) isKey[q]=1;      /* direction reversed here */
    }
  }
  /* 2. fill to the target by EQUAL ARC LENGTH */
  if(total>1e-6){
    const want=Math.max(2,POSEHOLD.keys), gap=total/want;
    let acc=0;
    for(let q=0;q<B;q++){
      acc+=step[q];
      if(acc>=gap){ isKey[(q+1)%B]=1; acc=0; }
    }
  }
  const keys=[]; for(let q=0;q<B;q++) if(isKey[q]) keys.push(q);
  if(!keys.length) keys.push(0);
  /* 3. every phase snaps to its NEAREST key, cyclically. Nearest cannot lag. */
  const seq=new Array(B);
  for(let q=0;q<B;q++){
    let best=keys[0], bd=1e9;
    for(const k of keys){
      const dd=Math.min((q-k+B)%B,(k-q+B)%B);
      if(dd<bd){bd=dd;best=k;}
    }
    const P=raw[best].sk, O={}, parts=[];
    for(const j in P){
      const v=P[j];
      if(!Array.isArray(v)){O[j]=v;continue;}
      const x=Math.round(v[0]), y=Math.round(v[1]);
      O[j]=[x,y]; parts.push(j+':'+x+','+y);
    }
    seq[q]={sk:O,present:raw[best].present,sig:parts.join('|')};
  }
  return seq;
}
function poseHoldCount(seq){const s=new Set();for(const f of seq)s.add(f.sig);return s.size;}
function poseHoldSeq(d,clip){
  const key=d+'|'+clip;
  const hit=POSEHOLD_CACHE.get(key); if(hit)return hit;
  const seq=poseHoldResolve(d,clip);
  POSEHOLD_CACHE.set(key,seq); return seq;
}
'''
src = src[:start] + NEW_BLOCK + src[end - len('function poseHoldCount'):]
# the slice above kept the trailing marker; rebuild cleanly instead
src = orig
src = src.replace(OLD_AH, NEW_AH, 1)
m = re.search(r"/\* A FRAME COUNT, NOT A THRESHOLD\..*?\nfunction poseHoldSeq\(d,clip\)\{.*?\n\}\n", src, re.S)
if not m:
    die('could not bracket the resolver block')
src = src[:m.start()] + NEW_BLOCK + src[m.end():]

open(ALPHA, 'w', encoding='utf-8').write(src)
print('KEY POSES applied to slices/BOHEMIA_ALPHA_0_9.html')
print('  - ARMHOLD switched OFF (same lagging rule, it clipped the swing too)')
print('  - extremes are always keys, so the full swing is drawn')
print('  - fills by equal arc length, frames snap to the NEAREST key')
