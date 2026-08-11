#!/usr/bin/env python3
"""BOHEMIA FACE FEATURE SCALE (8/11/26, CHARACTER lane)

PAOLO: "Idk maybe all faces maybe all eyes eyebrows and mouths should be twice
the size idk"

A KNOB, NOT AN EDIT TO HIS FACE. PUNK's numbers are marked "VERBATIM from alpha
vault (PUNK face, do not remake)", so the size cannot be baked into the spec --
it is a scale applied at render time, `window.BOH_FACE_FEAT`, DEFAULT 1, and at
1 renderFace returns the spec object by identity. His authored face is untouched
until he picks a number.

WHAT SCALES AND WHAT DOES NOT, and the difference is the whole design:

  SCALED (the features themselves)   eyes w/h · brow len/thick · mouth w/fullLower
  BARELY MOVED (the spacing)         eye gap · brow gap, at 35% and 20% of the
                                     scale, because the FACE is not getting
                                     bigger, only the things on it
  UNTOUCHED                          skull, jaw, cheeks, nose, hairline, every
                                     Y landmark

WHY THE GAP CANNOT SCALE WITH THE FEATURE: at eyeY the head is about 28px wide,
so 14px from the centre line to the edge of the cheek. An eye is `gap` out from
centre plus `w>>1` more. Scale BOTH by 2 and the outer corner lands at 6*2 +
6 = 18, four pixels off the side of his head. Scale only the feature and hold
the gap near where it was and the eye grows into the face it already sits in.

*** AND A LITERAL 2x IS THE HARD CEILING, WHICH IS WORTH SAYING OUT LOUD. ***
At 2.0 the eyes are 13px wide each on a 28px head: the outer corners sit exactly
on the cheek edge and the inner corners leave a 2px nose bridge. It renders, it
is legible, and it is as far as this face geometry physically goes. That is why
this ships as a dial with a rendered strip at 1.0 / 1.25 / 1.5 / 1.75 / 2.0
rather than as me picking a number -- HE decides how far up that range the face
goes, and every step in between is real.

NOT A DECISION I MADE: the default stays 1. Nothing he has already approved
changes appearance until he says a number.

    python3 tools/bohemia_face_feature_scale_patch.py
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD = """function renderFace(spec,opts){
 opts=opts||{}; const blood=opts.blood,cig=opts.cig,bald=opts.bald; const N=64,buf=new Uint8ClampedArray(N*N*4);"""

NEW = """/* FEATURE SCALE (Paolo 8/11: "maybe all eyes eyebrows and mouths should be twice
   the size idk"). A RENDER-TIME KNOB, never an edit to his authored spec: PUNK is
   marked do-not-remake, so at scale 1 this returns the spec object by identity and
   every approved face is byte-for-byte what it was.
   THE FEATURES GROW; THE SPACING BARELY MOVES. At eyeY the head is ~28px wide, so
   there are 14px from the centre line to the cheek edge and an eye sits at
   `gap + (w>>1)`. Double BOTH and the outer corner lands 4px off the side of his
   head; double only the feature and hold the gap near where it was and the eye
   grows into the face it already lives on. 2.0 is the hard ceiling of this
   geometry -- 13px eyes, corners exactly on the cheek edge, a 2px nose bridge.
   opts.feat wins over the global so a comparison strip can render every step at
   once without stomping what the game is set to. */
function faceFeatScale(spec, s) {
  if (!spec || !s || Math.abs(s - 1) < 0.001) return spec;
  const up = v => Math.max(1, Math.round((+v || 0) * s));
  /* the gap creeps rather than scales -- see the geometry note above */
  const creep = (v, share) => Math.max(1, Math.round((+v || 0) * (1 + (s - 1) * share)));
  const o = {};
  for (const k in spec) o[k] = spec[k];
  if (spec.eyes)  o.eyes  = Object.assign({}, spec.eyes,
    { w: up(spec.eyes.w), h: up(spec.eyes.h), gap: creep(spec.eyes.gap, 0.35) });
  if (spec.brows) o.brows = Object.assign({}, spec.brows,
    { len: up(spec.brows.len), thick: up(spec.brows.thick), gap: creep(spec.brows.gap, 0.20) });
  if (spec.mouth) o.mouth = Object.assign({}, spec.mouth,
    { w: up(spec.mouth.w), fullLower: up(spec.mouth.fullLower) });
  return o;
}
if (typeof window !== 'undefined' && typeof window.BOH_FACE_FEAT === 'undefined') window.BOH_FACE_FEAT = 1;
function renderFace(spec,opts){
 opts=opts||{}; const blood=opts.blood,cig=opts.cig,bald=opts.bald; const N=64,buf=new Uint8ClampedArray(N*N*4);
 spec=faceFeatScale(spec,(typeof opts.feat==='number')?opts.feat:((typeof window!=='undefined'&&window.BOH_FACE_FEAT)||1));"""

alpha = open(ALPHA, encoding='utf8').read()
if 'function faceFeatScale' in alpha:
    print('  ok   (already) the face feature scale knob is in')
    sys.exit(0)
n = alpha.count(OLD)
if n != 1:
    print('FACE FEATURE SCALE: refused to write -- expected exactly 1 match, found %d' % n)
    sys.exit(1)
open(ALPHA, 'w', encoding='utf8').write(alpha.replace(OLD, NEW, 1))
print('  ok   faceFeatScale() + window.BOH_FACE_FEAT (default 1 = canon untouched)')
print('FACE FEATURE SCALE: applied to %s' % ALPHA)
