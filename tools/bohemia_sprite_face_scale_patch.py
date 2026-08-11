#!/usr/bin/env python3
"""BOHEMIA THE OVERWORLD FACE IS SIX PIXELS (8/11/26, CHARACTER lane)

PAOLO: "BRO I MEANT THE TINY PIXEL OVERWORLD FACES. NOT THE DOOM FACES SHIT MAN"

He is right and I built the wrong surface. renderFace() is the 64x64 PORTRAIT.
The face he actually looks at all day is the one on the 56px BODY in the world,
and it is PD.layers['facial/punk-face'] -- painted pixels, ramp-indexed, drawn
through the same rest-grid path as every garment.

MEASURED. That face, in full, per facing:

    S    eyes  6 px  (5x2)    nose 3 px (8x1)    lips 2 px (2x1)
    SE   eyes  6 px  (5x2)    nose 2 px (6x1)    lips 2 px (2x1)
    E    eyes  3 px  (2x2)    nose 1 px (1x1)    lips 2 px (2x1)
    N NE NW W SW                 NOTHING PAINTED AT ALL

*** THE MOUTH IS TWO PIXELS. *** That is the whole mouth. At the size a person
stands in the world there is nothing there to read, which is exactly what "should
be twice the size" means and why it was worth him saying twice.

RIG LAW SAYS NEVER RESHAPE HIS PAINTED REGIONS -- AND HE IS THE ONE ASKING, so
this is a ruling, not a violation. It ships the way every other body change ships:
a SCALE, `window.BOH_SPRITE_FACE`, DEFAULT 1, identity at 1, so nothing he has
already approved moves until he picks a number.

*** AND THE THING I GOT WRONG ON THE PORTRAIT THIS MORNING IS BUILT IN HERE. ***
Scaling the "eyes" as ONE cluster is the obvious way and it is wrong: x 10..14 on
S is BOTH EYES PLUS THE GAP BETWEEN THEM, so scaling that box by 2 makes a 10px
span on a head about 10px wide -- the eyes slide apart onto the ears instead of
getting bigger. So each feature is split into CONNECTED COMPONENTS first and each
component is scaled ABOUT ITS OWN CENTRE. The left eye grows in place, the right
eye grows in place, the gap between them is untouched. Same for a nostril, same
for the mouth.

INVERSE SAMPLE, target -> source, the same rule warpPart and the age stamps use:
at these sizes a forward map would leave holes, and a hole in a 2px mouth is the
whole mouth.

CLAMPED to the 24-wide source grid, so a grown feature can never spill off the
head plate and into a neighbour's pixels.

    python3 tools/bohemia_sprite_face_scale_patch.py
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD = """    const isFacial=(slot==='facial');
    for(const idx in L.px){const li=+idx;let lx=li%GW,ly=(li/GW)|0;"""

NEW = """    const isFacial=(slot==='facial');
    /* THE OVERWORLD FACE, SCALED (Paolo 8/11: "I MEANT THE TINY PIXEL OVERWORLD
       FACES"). His whole face out here is six pixels of eyes, three of nose and a
       TWO PIXEL MOUTH; at the size a person stands in the world there is nothing
       to read. Identity at 1, so every approved look is byte-for-byte itself
       until he picks a number. */
    const FSRC = isFacial ? spriteFaceScaled(L, GW, spriteFaceScale()) : L.px;
    for(const idx in FSRC){const li=+idx;let lx=li%GW,ly=(li/GW)|0;"""

OLD2 = """      if(isFacial){const pi=L.px[idx];const feat=(pi<=1)?'eyes':(pi===2)?'lips':'nose';"""
NEW2 = """      if(isFacial){const pi=FSRC[idx];const feat=(pi<=1)?'eyes':(pi===2)?'lips':'nose';"""

OLD3 = """      restCol[si]=ramp[L.px[idx]]||ramp[ramp.length-1];}"""
NEW3 = """      restCol[si]=ramp[FSRC[idx]]||ramp[ramp.length-1];}"""

HELPER_ANCHOR = """function faceOffset(dir,feat){ return (FACE_OFFSETS[dir]&&FACE_OFFSETS[dir][feat])||[0,0]; }"""

HELPER = """function faceOffset(dir,feat){ return (FACE_OFFSETS[dir]&&FACE_OFFSETS[dir][feat])||[0,0]; }

/* ===== THE OVERWORLD FACE FEATURE SCALE (Paolo 8/11) ========================
   "BRO I MEANT THE TINY PIXEL OVERWORLD FACES." His face on the 56px body is
   PD.layers['facial/punk-face'] -- and measured, in full, it is six pixels of
   eyes, three of nose and a TWO PIXEL MOUTH, painted on S/SE/E only.

   PER COMPONENT, NEVER PER FEATURE, and that distinction is the entire design.
   The "eyes" pixels on S span x 10..14, which is BOTH EYES AND THE GAP BETWEEN
   THEM. Scaling that as one box by 2 gives a 10px span on a head about 10px
   wide: the eyes slide apart onto the ears instead of getting bigger. So each
   feature is split into connected components and each component is scaled about
   ITS OWN centre -- left eye grows in place, right eye grows in place, the gap
   between them never moves. (I made exactly this mistake on the portrait earlier
   today and had to hold the eye gap back to 35% of the scale to survive it. Here
   the components make it structurally impossible.)

   INVERSE SAMPLE, target -> source, like warpPart and the age stamps: a forward
   map leaves holes, and a hole in a two-pixel mouth is the mouth.
   CLAMPED to the source grid so a grown feature cannot spill off the head plate.
   ========================================================================== */
if (typeof window !== 'undefined' && typeof window.BOH_SPRITE_FACE === 'undefined') window.BOH_SPRITE_FACE = 1;
function spriteFaceScale(){ const v = (typeof window!=='undefined') ? +window.BOH_SPRITE_FACE : 1; return (v>0)?v:1; }
const _SFACE_CACHE = new Map();
function spriteFaceScaled(L, GW, s){
  if (!L || !L.px || !s || Math.abs(s-1) < 0.001) return L.px;
  const H = L.h || 50;
  const key = GW+'x'+H+'@'+s+'#'+Object.keys(L.px).length+':'+Object.keys(L.px)[0];
  const hit = _SFACE_CACHE.get(key); if (hit) return hit;
  const featOf = pi => (pi<=1)?'eyes':(pi===2)?'lips':'nose';
  /* group by feature, then split each feature into 8-connected components */
  const byFeat = {};
  for (const idx in L.px){ const f = featOf(L.px[idx]); (byFeat[f]=byFeat[f]||[]).push(+idx); }
  const out = {};
  for (const f in byFeat){
    const set = new Set(byFeat[f]), seen = new Set();
    for (const start of byFeat[f]){
      if (seen.has(start)) continue;
      const comp = [], stack = [start]; seen.add(start);
      while (stack.length){
        const i = stack.pop(); comp.push(i);
        const x = i%GW, y = (i/GW)|0;
        for (let dy=-1; dy<=1; dy++) for (let dx=-1; dx<=1; dx++){
          if (!dx && !dy) continue;
          const nx = x+dx, ny = y+dy; if (nx<0||nx>=GW||ny<0) continue;
          const ni = ny*GW+nx;
          if (set.has(ni) && !seen.has(ni)){ seen.add(ni); stack.push(ni); }
        }
      }
      /* scale this component about its own centre */
      let x0=1e9,x1=-1,y0=1e9,y1=-1;
      for (const i of comp){ const x=i%GW, y=(i/GW)|0;
        if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; }
      const ax=(x0+x1)/2, ay=(y0+y1)/2;
      const tx0=Math.round(ax-(ax-x0)*s), tx1=Math.round(ax+(x1-ax)*s);
      const ty0=Math.round(ay-(ay-y0)*s), ty1=Math.round(ay+(y1-ay)*s);
      for (let ty=ty0; ty<=ty1; ty++) for (let tx=tx0; tx<=tx1; tx++){
        if (tx<0||tx>=GW||ty<0||ty>=H) continue;                    /* stay on the plate */
        const sx=Math.round(ax+(tx-ax)/s), sy=Math.round(ay+(ty-ay)/s);
        const si=sy*GW+sx;
        if (L.px[si]!==undefined && set.has(si)) out[ty*GW+tx]=L.px[si];
      }
    }
  }
  /* anything the scale did not reach keeps its painted pixel */
  for (const idx in L.px) if (out[idx]===undefined) out[idx]=L.px[idx];
  _SFACE_CACHE.set(key, out);
  return out;
}
if (typeof window !== 'undefined') { window.spriteFaceScaled = spriteFaceScaled; window.spriteFaceScale = spriteFaceScale; }"""

alpha = open(ALPHA, encoding='utf8').read()
applied, missed = [], []
for label, old, new in [
    ('spriteFaceScaled() -- per-component scale of his painted overworld face', HELPER_ANCHOR, HELPER),
    ('the facial draw loop reads the scaled set', OLD, NEW),
    ('the feature classifier reads the scaled set', OLD2, NEW2),
    ('the colour write reads the scaled set', OLD3, NEW3),
]:
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
    print('SPRITE FACE SCALE: refused to write -- %d edit(s) did not match exactly once' % len(missed))
    sys.exit(1)
open(ALPHA, 'w', encoding='utf8').write(alpha)
print('SPRITE FACE SCALE: applied to %s' % ALPHA)
