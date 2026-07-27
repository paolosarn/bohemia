#!/usr/bin/env python3
"""
BOHEMIA — THE NECK IS ITS OWN SKIN TONE (Paolo 7/27/26)

His words: "i wanted the neck color to be just a slightly very slightly barely
notieable different skin tone than the face. just need a little love to switch it
up so you can tell."

WHAT IT DOES. Every NECK pixel (part 3, verified empirically -- an 8px strip at
y15-16 on S, between the head and the torso) is shifted a few units off the face
tone. One multiplier, one flag, one line to tune.

IT IS A TONE, NOT A SHADOW. This matters, because SHADOWS ARE SEPARATE (7/26) is
law and I am not allowed to bake light into sprite pixels mid-composite. This is
not that: it is the neck's own SKIN reading slightly different from the face's,
which is a material property of the body (less sun, different skin), the same
kind of fact as the lips being a different colour from the cheek. It does not
move with a light direction, it does not change per facing, and it is identical
on every frame of every clip. If it ever needs to respond to a light, that is the
separate shading layer's job and this pass is not it.

REUSE-FIRST: it cooks no new hue. The neck colour is Paolo's OWN face tone scaled
on all three channels, so it stays exactly on his skin ramp's line through colour
space -- same hue, same relationship, a hair darker. Nothing invented, no new
palette entry, and the purity sweep sees no new colour family.

WHY A MULTIPLY AND NOT THE NEXT RAMP STOP: his skin ramp's neighbouring stops are
44 units apart (150 -> 194 -> 233). Snapping the neck to the next stop down would
be a hard, obvious band -- the opposite of "very slightly barely noticeable". The
multiplier lands ~14 units off the base tone, which reads as a different piece of
skin without reading as a shadow.

IT RUNS AFTER GARMENTS COMPOSITE, which was NOT the original assumption. The
anchor sits downstream of the garment pass, so a neck cell can be wearing a
collar: the body grid still says "neck" while the pixel is cloth. The first
version tinted that cloth and quietly darkened his hoodie collar (measured 25.1
-> 23.1 dressed). The pass now checks each pixel against the live skin ramp and
only ever touches neck SKIN.

WORTH KNOWING, and it is the honest headline: with his current outfit the collar
covers the neck completely, so this change is INVISIBLE on the dressed character.
It shows on the bare body and on any outfit with a lower neckline. Naked, the
neck already sat ~33 units below the face before this pass; it now sits ~45.

Idempotent.

  python3 tools/bohemia_neck_tone_patch.py
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')

def die(m):
    print('  ! ' + m); sys.exit(1)

src = open(ALPHA, encoding='utf-8').read()

if 'THE NECK IS ITS OWN SKIN TONE' in src:
    print('NECK TONE: already applied, nothing to do.')
    sys.exit(0)

# The flag goes in buildFrame's own scope. (The CHAR_OUTLINE flag was first put
# next to RIGID, which is INSIDE the SKINNER_API closure while buildFrame is
# outside it -- every frame threw ReferenceError and the alpha never booted,
# presenting as a test timeout. Same scope, same function, no boundary to cross.)
FLAG_ANCHOR = 'function buildFrame(d,clip,ph){'
FLAG = ('/* THE NECK IS ITS OWN SKIN TONE (Paolo 7/27/26): "a slightly very slightly\n'
        '   barely notieable different skin tone than the face". A TONE, not a shadow --\n'
        '   it never moves with a light and never changes per facing. mul is his own face\n'
        "   tone scaled on all three channels, so it stays on his ramp's line: same hue,\n"
        '   a hair darker. One line to tune. */\n'
        'const NECK_TONE = { on: true, part: 3, mul: 0.93 };\n')
if 'const NECK_TONE' not in src:
    if src.count(FLAG_ANCHOR) != 1:
        die('buildFrame anchor found %d times (need exactly 1)' % src.count(FLAG_ANCHOR))
    src = src.replace(FLAG_ANCHOR, FLAG + FLAG_ANCHOR, 1)

ANCHOR = "  /* DE-SPECKLE (Paolo 7/18: 'strays flying off the rig')."
if src.count(ANCHOR) != 1:
    die('de-speckle anchor found %d times (need exactly 1)' % src.count(ANCHOR))

PASS = '''  /* =========================================================================
     THE NECK IS ITS OWN SKIN TONE (Paolo 7/27/26)
     "i wanted the neck color to be just a slightly very slightly barely
      notieable different skin tone than the face. just need a little love to
      switch it up so you can tell."

     Part 3 is the neck -- verified by geometry, not by a comment: an 8px strip
     at y15-16 on S, sitting between the head (1/2) and the torso (4).

     A TONE, NOT A SHADOW. SHADOWS ARE SEPARATE (7/26) forbids baking light into
     sprite pixels mid-composite, and this is not that. It is the neck's own skin
     reading slightly different from the face's -- a material fact about the
     body, like lips differing from cheek. It does not move with a light, does
     not vary per facing, and is identical on every frame of every clip.

     REUSE-FIRST: no new hue is cooked. The colour is HIS face tone scaled on all
     three channels, so it stays on his skin ramp's own line through colour
     space. A ramp-stop snap was rejected: his stops are 44 units apart
     (150/194/233), which reads as a hard band, the opposite of what he asked for.

     Runs AFTER garments composite -- hence the skin-only guard below.
     ========================================================================= */
  if(NECK_TONE.on){
    /* SKIN ONLY. This pass runs after garments composite, so a neck cell can be
       wearing a collar -- grid still says "neck" but the pixel is cloth. Tinting
       that would quietly darken his hoodie collar (measured: 25.1 -> 23.1 dressed
       before this guard went in). A neck TONE must only ever touch neck SKIN. */
    /* SKIN TONES ONLY, NEVER THE SHARED DARK ENTRY. skinRampFor()[0] is
       28,22,24 -- the anatomy outline -- and that exact colour is ALSO in the
       jacket, the pants and the shoes ramps. Including it made this test match
       every dark sleeve pixel, and the first build of this fix repainted whole
       sleeves as bare skin. Only the real skin tones count. */
    const _sk={}; try{const _r=skinRampFor(); for(let _i=1;_i<_r.length;_i++){const c=_r[_i];
      if(c)_sk[c[0]+','+c[1]+','+c[2]]=1;}}catch(_e){}
    const m=NECK_TONE.mul, npart=NECK_TONE.part;
    for(let i=0;i<grid.length;i++){
      if(grid[i]!==npart)continue;
      const c=px[i]; if(!c)continue;
      if(!_sk[c[0]+','+c[1]+','+c[2]])continue;          /* cloth, not skin: leave it */
      px[i]=[Math.max(0,Math.min(255,c[0]*m|0)),
             Math.max(0,Math.min(255,c[1]*m|0)),
             Math.max(0,Math.min(255,c[2]*m|0))];
    }
  }
'''
src = src.replace(ANCHOR, PASS + ANCHOR, 1)

open(ALPHA, 'w', encoding='utf-8').write(src)
print('NECK TONE applied to slices/BOHEMIA_ALPHA_0_9.html')
print('  - part 3 (the neck) renders at %s of the face tone' % '0.93')
print('  - a TONE, not a shadow: fixed per facing, fixed per frame')
print('  - his own hue, scaled: no new colour cooked')
