#!/usr/bin/env python3
"""
BOHEMIA — CLOTHES FOLLOW THE BODY (Paolo 7/28/26)

He has said the fat and arm sliders are wrong three times. Measured, it is one
root cause and it is not in the sliders:

    jacket pixels identical across the WHOLE belly range:  TRUE
    body   pixels change across the whole belly range:     TRUE

`BOH_BODYVAR.apply()` reshapes BAKED.layers -- the BODY. Garment art lives in
PD.layers, which it never touches. Clothing was a fixed shell.

The consequence, at the navel (y28, facing S):

    belly -1   body 15 wide   dressed 19
    belly  0   body 19 wide   dressed 19
    belly +1   body 23 wide   dressed 23

Getting FATTER worked, because the body swelled out past the coat. Getting
SKINNIER did nothing at all -- the body shrank to 15 underneath a coat that
stayed 19. Half of that slider has been dead the whole time.

WHERE THE FIX GOES. The body warp happens in REST space (warpLayers on
BAKED.layers), and the garment is placed into REST space too, at
(lx+G24_OX, ly+G24_OY), before the skinner deforms it. So both live in the same
space at the same moment: fit the cloth there and the skinner carries body and
clothing through the pose together, with no second deform and no new morph.

HOW IT FITS. Per direction, per rest row, the body's own extents are read twice --
once from the canon BAKED body and once from the warped one. A garment pixel on
that row is remapped from the old span onto the new span. The cloth tracks the
flank exactly, in and out, because it is driven BY the body's own measurements
rather than by a second copy of the dial maths that could drift from it.

ROWS THE BODY DID NOT MOVE ARE NOT TOUCHED. If the span is unchanged the mapping
is the identity and the pixel is left exactly where it was painted, so every dial
at 0 is byte-identical to today, and the head, hair, hat and glasses (which sit
above the torso and never warp) are untouched at any setting.

WHY THE SPAN AND NOT A ROW SHIFT. A shift moves a row sideways; it cannot make a
coat narrower. The negative half of the dial is precisely the half that was
broken, so a shift would have fixed the half that already worked and left the
broken half broken.

REUSE CHECK (REUSE-FIRST / APPROVED-ASSETS-FIRST): cooks NO art and invents no
colour. Every garment pixel written is one Paolo painted, carrying its own ramp
index, moved to a new column. Nothing is blended, recoloured or synthesised.

Behind CLOTHES_FOLLOW so it can be A/B'd and switched off in one line.

Idempotent.

  python3 tools/bohemia_clothes_follow_the_body_patch.py

RIG CHECK (RIG IS LAW, Paolo 7/26/26): Fits a garment to the body the dials made, by measuring the flank of the
  warped body and shifting cloth to match. Sources the body from BODY_PKG /
  BOH_BODYVAR (the rig plus dials), never from a garment-side body guess.
  built on: BAKED.layers, SKINNER_API, BODY_PKG, BOH_BODYVAR
  joints: none named
  parts: none
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')

def die(m):
    print('  ! ' + m); sys.exit(1)

src = open(ALPHA, encoding='utf-8').read()

if 'CLOTHES FOLLOW THE BODY' in src:
    print('CLOTHES FOLLOW THE BODY: already applied, nothing to do.')
    sys.exit(0)

# ---- 1. the flag + the per-direction fit map, rebuilt whenever the rig is -----
FLAG_ANCHOR = 'const G24_OX=16, G24_OY=3, GW=24;'
if src.count(FLAG_ANCHOR) != 1:
    die('G24 anchor found %d times (need exactly 1)' % src.count(FLAG_ANCHOR))

FLAG = FLAG_ANCHOR + '''
/* =============================================================================
   CLOTHES FOLLOW THE BODY (Paolo 7/28/26)
   -----------------------------------------------------------------------------
   He said the fat and arm dials were wrong three times. It was never the dials:
   BOH_BODYVAR.apply() warps the BODY (BAKED.layers) and never touched garment art
   (PD.layers), so clothing was a fixed shell. Getting fatter worked because the
   body swelled past the coat; getting SKINNIER did nothing, because the body shrank
   to 15px under a coat that stayed 19px. Half the slider was dead.

   CLOTHES_FIT[d][y] = [l0, r0, l1, r1] -- that rest row's body span before and
   after the warp. A garment pixel on the row is remapped from the old span onto
   the new one, so the cloth tracks the flank in BOTH directions. It is driven by
   the body's own measured extents rather than a second copy of the dial maths,
   which is what keeps cloth and body from ever drifting apart.

   Rows the body did not move are omitted entirely, so every dial at 0 is
   byte-identical to the canon render and anything above the torso never moves.
   ============================================================================= */
/* var, NOT const/let, and it is not a style choice. rebuildFromRig() runs ONCE
   AT LOAD, from a line ABOVE this one, so a const/let here is still in its
   temporal dead zone when it is first read -- and the catch block that was
   supposed to absorb that ALSO assigns to it, so it throws a second time and
   the alpha never boots. Same trap the CHAR_OUTLINE flag fell into. */
var CLOTHES_FOLLOW = { on: true };
var CLOTHES_FIT = {};
function buildClothesFit(){
  CLOTHES_FIT = {};
  if(!CLOTHES_FOLLOW.on) return;
  const pkg = (typeof BODY_PKG!=='undefined') ? BODY_PKG : null;
  if(!pkg || pkg === BAKED || !pkg.layers) return;      /* neutral dials: apply() returns BAKED itself */
  /* 56 as a local, NOT the shared CW. CW lives inside the SKINNER_API closure and
     is NOT in scope here -- referencing it threw, the catch below swallowed it, and
     the map came back silently EMPTY while the code read perfectly correct. Third
     time a closure boundary has cost a round today; the catch made this one worse
     by hiding it, which is why it now records the message. */
  const _CW = 56;
  const span = (list) => { const r = {};
    if(!list) return r;
    for(let i=0;i<list.length;i++){ const idx=list[i], y=(idx/_CW)|0, x=idx%_CW;
      const e=r[y]; if(!e) r[y]=[x,x]; else { if(x<e[0])e[0]=x; if(x>e[1])e[1]=x; } }
    return r; };
  for(const d in pkg.layers){
    const warped = pkg.layers[d], canon = BAKED.layers[d];
    if(!warped || !canon) continue;
    const rows = {};
    /* the TORSO drives the coat, each ARM drives its own sleeve */
    for(const part of [4,5,6]){
      const a = span(canon[part]), b = span(warped[part]);
      for(const ys in a){
        if(!b[ys]) continue;
        const l0=a[ys][0], r0=a[ys][1], l1=b[ys][0], r1=b[ys][1];
        if(l0===l1 && r0===r1) continue;                /* this row did not move */
        if(rows[ys]) continue;                          /* torso wins a shared row */
        rows[ys] = [l0,r0,l1,r1];
      }
    }
    CLOTHES_FIT[d] = rows;
  }
}
/* one garment pixel, rest space -> fitted rest space. Identity when the row did
   not move, so an unwarped body cannot shift a single clothing pixel. */
function fitClothX(d,sx,sy){
  const rows = CLOTHES_FIT[d]; if(!rows) return sx;
  const e = rows[sy]; if(!e) return sx;
  const l0=e[0], r0=e[1], l1=e[2], r1=e[3];
  if(sx<l0 || sx>r0) {                                   /* outside the body span: ride the nearer edge */
    return sx + ((sx<l0) ? (l1-l0) : (r1-r0));
  }
  const w0 = r0-l0;
  if(w0<=0) return l1;
  return Math.round(l1 + (sx-l0)*(r1-l1)/w0);
}'''
src = src.replace(FLAG_ANCHOR, FLAG, 1)

# ---- 2. rebuild the map whenever the body package is rebuilt -----------------
REB = '  const src=BODY_PKG=BOH_BODYVAR.apply(BAKED,G.bodyVar);'
if src.count(REB) != 1:
    die('rebuild anchor found %d times (need exactly 1)' % src.count(REB))
src = src.replace(REB, REB + '\n  try{buildClothesFit();}catch(_e){CLOTHES_FIT={};window._CLOTHFIT_ERR=String(_e&&_e.message||_e);}   /* CLOTHES FOLLOW THE BODY: refit the cloth to the body the dials just made */', 1)

# ---- 3. use it where the garment lands in rest space ------------------------
USE = '      let sx=lx+G24_OX, sy=ly+G24_OY;'
if src.count(USE) != 1:
    die('garment placement anchor found %d times (need exactly 1)' % src.count(USE))
src = src.replace(USE, USE + '''
      /* CLOTHES FOLLOW THE BODY: fit this pixel to the body the dials made. The
         head slots (hair/hat/glasses/facial) sit above the torso, so their rows
         are never in the map and this is a no-op for them. */
      if(CLOTHES_FOLLOW.on) sx = fitClothX(d,sx,sy);''', 1)

open(ALPHA, 'w', encoding='utf-8').write(src)
print('CLOTHES FOLLOW THE BODY applied to slices/BOHEMIA_ALPHA_0_9.html')
print('  - garments are fitted to the warped body IN REST SPACE, before the skinner')
print('  - driven by the body\'s own measured extents, so cloth cannot drift from body')
print('  - rows the body did not move are identity: dials at 0 stay byte-identical')
