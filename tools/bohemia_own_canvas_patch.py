#!/usr/bin/env python3
"""
BOHEMIA — EVERY PART GETS ITS OWN CANVAS (Paolo 7/26/26, LOCKED)

His words: "So build it differently, so the arm and the torso don't share pixels.
Just imagine on the right side of the screen you do the front arm, on the left
side of the screen you do the back arm, and in the middle of the screen you do
the torso, and then you put them back together."

He is describing per-part render targets, and he is right.

WHAT WAS ACTUALLY WRONG (measured, and it is not the shading). skin() sampled
every part into ONE SHARED SCREEN with a running `claim` buffer, nearest part
first:

    if (claim[sc] || mask[sc]) continue;   // screen cell already owned

So a far part could not sample a cell a nearer part had already taken. The
TORSO'S OWN SHAPE therefore depended on where the ARM happened to be that frame.
Move the arm one pixel and the torso is a different shape -- eroded here, restored
there. Split every tone flip by whether the cell's PART also changed:

    a different limb moved over the cell and back : 3,820   58%
    the same limb owned it all three frames       : 2,717   42%

58% was parts trading pixels, not shading. That is why three correct shading
fixes all measured WORSE (recorded in
laws/BOHEMIA_ADDENDUM_PARTS_ARE_PAINTED_7_26_26.md): they were fixing the 42%
while the 58% went untouched underneath them.

WHAT THIS DOES. Exactly what he said:
  1. EVERY PART IS SAMPLED ON ITS OWN PRIVATE CANVAS. No claim buffer, no
     competition. The torso is sampled as a whole torso whether or not an arm is
     in front of it, and its shape is now a function of the torso's own bones and
     nothing else. Same for each arm, each leg.
  2. refineSkin runs per part on that private canvas, so seam repair also stops
     depending on the neighbours.
  3. ONLY THEN are they composited, nearest first, by his authored draw order.
     Occlusion decides what is SEEN. It no longer decides what a part IS.

This is the ownership fix. The shading rules are untouched by this patch.

REUSE CHECK (REUSE-FIRST / APPROVED-ASSETS-FIRST): cooks ZERO pixels. It changes
WHERE each part is sampled, then puts them back together in his order.

Idempotent.

  python3 tools/bohemia_own_canvas_patch.py
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
# 1. the per-part canvases + a dead claim buffer for refineSkin to read
# ---------------------------------------------------------------------------
OLD_HEAD = """    const out = new Uint8Array(CW*CH);     // 0 = empty; else part id
    const claim = new Uint8Array(CW*CH);   // screen ownership"""
NEW_HEAD = """    const out = new Uint8Array(CW*CH);     // 0 = empty; else part id
    /* OWN CANVAS LAW (Paolo 7/26/26): "build it differently so the arm and the
       torso don't share pixels... do the front arm, the back arm, the torso, and
       then put them back together." Each part is sampled ALONE, into its own
       private canvas, and only composited afterwards. `claim` is kept ONLY so
       refineSkin keeps its signature; nothing writes to it during sampling any
       more, which is the whole point -- a part's shape can no longer depend on
       which neighbour got there first. */
    const claim = new Uint8Array(CW*CH);   // (inert during sampling: see OWN CANVAS LAW)
    const partCv = this.partCv || (this.partCv = new Uint8Array(13*CW*CH));
    partCv.fill(0);"""
if 'OWN CANVAS LAW' not in src:
    if src.count(OLD_HEAD) != 1:
        die('skin() head anchor found %d times (need exactly 1)' % src.count(OLD_HEAD))
    src = src.replace(OLD_HEAD, NEW_HEAD, 1)
    did.append('each part gets a private canvas (partCv)')

# ---------------------------------------------------------------------------
# 2. sampling stops yielding cells to whoever got there first
# ---------------------------------------------------------------------------
OLD_S1 = """          const sc=oy*CW+ox;
          if (claim[sc] || mask[sc]) continue;            // screen cell already owned"""
NEW_S1 = """          const sc=oy*CW+ox;
          if (mask[sc]) continue;                         // OWN CANVAS: only I can be in my way"""
if 'OWN CANVAS: only I can be in my way' not in src:
    if src.count(OLD_S1) != 1:
        die('primary sample claim-test found %d times (need exactly 1)' % src.count(OLD_S1))
    src = src.replace(OLD_S1, NEW_S1, 1)
    did.append('the primary inverse sample no longer yields cells to nearer parts')

# the retired forward-splat carries the same test; keep it consistent so that
# flipping RIGFAITH back on cannot resurrect the coupling
OLD_S2 = """            if (claim[sc]||mask[sc]) continue;
            mask[sc]=1; msrc[sc]=ri; used[ri]=1;"""
NEW_S2 = """            if (mask[sc]) continue;                       // OWN CANVAS, same rule
            mask[sc]=1; msrc[sc]=ri; used[ri]=1;"""
if 'OWN CANVAS, same rule' not in src:
    if src.count(OLD_S2) != 1:
        die('secondary claim-test found %d times (need exactly 1)' % src.count(OLD_S2))
    src = src.replace(OLD_S2, NEW_S2, 1)
    did.append('the retired forward-splat cannot reintroduce the coupling either')

# the retired JOINT WELD pass carries it too. It is behind RIGID.on and does not
# run, but a dormant copy of the exact bug is still a copy of the bug.
OLD_S3 = """            const sc=sy*CW+sx;
            if (claim[sc] || mask[sc]) continue;"""
NEW_S3 = """            const sc=sy*CW+sx;
            if (mask[sc]) continue;                       // OWN CANVAS, same rule"""
if OLD_S3 in src:
    if src.count(OLD_S3) != 1:
        die('joint-weld claim-test found %d times (need exactly 1)' % src.count(OLD_S3))
    src = src.replace(OLD_S3, NEW_S3, 1)
    did.append('the retired joint weld cannot reintroduce it either')

# ---------------------------------------------------------------------------
# 3. commit to the part's own canvas, then composite in HIS order
# ---------------------------------------------------------------------------
OLD_C = """        if (moving && p!==1 && p!==2) refineSkin(mask, msrc, L, mX0, mY0, mX1, mY1, claim);   // HEAD RIGID STAMP: a translation has no seams, refine only distorts it
        for (let sc = 0; sc < CW*CH; sc++) if (mask[sc]) { claim[sc]=p; out[sc]=p; }
      }
    }
    return out;
  }"""
NEW_C = """        if (moving && p!==1 && p!==2) refineSkin(mask, msrc, L, mX0, mY0, mX1, mY1, claim);   // HEAD RIGID STAMP: a translation has no seams, refine only distorts it
        /* OWN CANVAS: the part lands on ITS OWN sheet. Nothing is decided about
           who is in front of whom until every part has been drawn whole. */
        const cb = p*CW*CH;
        for (let sc = 0; sc < CW*CH; sc++) if (mask[sc]) partCv[cb+sc]=1;
      }
    }
    /* PUT THEM BACK TOGETHER (his words), nearest first in his authored order.
       This is the ONLY place occlusion happens now, and it is a pure z-test on
       finished parts -- it cannot reach back and change what a part is. */
    for (const p of ord) {
      const cb = p*CW*CH;
      for (let sc = 0; sc < CW*CH; sc++) if (partCv[cb+sc] && !out[sc]) { out[sc]=p; claim[sc]=p; }
    }
    return out;
  }"""
if 'PUT THEM BACK TOGETHER' not in src:
    if src.count(OLD_C) != 1:
        die('skin() commit/return anchor found %d times (need exactly 1)' % src.count(OLD_C))
    src = src.replace(OLD_C, NEW_C, 1)
    did.append('parts are composited only after every one of them is drawn whole')

if src == orig:
    print('OWN CANVAS: already applied, nothing to do.')
    sys.exit(0)
open(ALPHA, 'w', encoding='utf-8').write(src)
print('OWN CANVAS applied to slices/BOHEMIA_ALPHA_0_9.html')
for d in did:
    print('  - ' + d)
