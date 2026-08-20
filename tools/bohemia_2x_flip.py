#!/usr/bin/env python3
"""BOHEMIA 2X -- THE FLIP (Paolo 8/14, LOCKED: "the character models need twice as
many pixels and the black border has to be thinner, like half as thin")

WHAT WAS ACTUALLY HAPPENING. The character was BUILT at 56x56 and then smeared to
112 by Scale2x at the very last step. So the sprite already HAD 112x112 output
pixels; what it did not have was 112x112 of real, authored, posed detail -- Scale2x
invents smoothed corners from 56 pixels of information. And because the 1px black
outline was drawn at 56 and THEN doubled, it arrived on screen TWO pixels thick.
That is the border he wants "half as thin", and it is not a separate feature: it is
the same bug. Build the frame at 112 and the outline is 1/112 instead of 2/112, for
free, by doing nothing to the outline pass at all.

*** THE ARCHITECTURE, AND WHY IT IS SURGICAL INSTEAD OF A REWRITE. ***
The frame builder and the 258-garment CLO catalogue are thousands of lines of dense
56-space pixel geometry. Rewriting that is how you ship garbage. So nothing is
rewritten. Three kinds of thing exist and each is handled where it MEETS the frame:

  HIS RIG (BAKED)          DOUBLED FOR REAL, at load, by the lossless transform
                           proved in tools/bohemia_rig_double.js. This is the half
                           that actually buys resolution: 96 part lists go from
                           5,248 painted cells to 20,992, and every joint doubles
                           with them, so posing and skinning now resolve at twice
                           the precision. That is where the sharpening comes from.
  PD LAYERS (24-grid)      LEFT AT 24 and block-doubled AT THE PLACEMENT SEAM. They
                           are Paolo's painted hair/facial/garment art and the RIG
                           and CLOTHES editors write them at 24. Doubling the data
                           would buy zero detail (a block-double invents nothing)
                           and would break every paint tool he owns.
  CLO GENERATORS (56)      LEFT AT 56 and block-doubled AT THE gen() SEAM. Every
                           garment takes gen(grid,CW,CH) and returns a sparse
                           index->colour map. TWO call sites. So all 258 garments
                           keep working, unmodified, and land SHARPER than today
                           because a block-double is crisper than Scale2x.

*** EVERY EDIT IN THIS FILE IS THE IDENTITY WHEN RIG_RS === 1. ***
That is deliberate and it is the whole test plan. The seam edits go in first with
the rig still at 56, and the render must come back BYTE-IDENTICAL -- if a single
pixel moves, a seam is wrong and it is wrong in isolation, before anything doubles.
Only then does BAKED get wrapped. A half-applied resolution migration does not look
worse, IT LOOKS LIKE GARBAGE (doubled art bound to joints at half their position),
so the two halves are separable on purpose.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): this tool never edits his painted art. The
  rig literal in the alpha is left byte-for-byte as he painted it; --flip only WRAPS
  it in the load-time doubler, and --unflip removes the wrapper again (proved a
  byte-identical round trip). The seams it writes teach the renderer to read the
  rig's size instead of assuming 56 -- they change no geometry at all, which is why
  every one of them is the identity at RIG_RS=1 and was proved so on 96 frames.
  built on: BAKED, SKINNERS
  joints: none named
  parts: none named

  python3 tools/bohemia_2x_flip.py --seams     # phase 1: seams only, RIG_RS stays 1
  python3 tools/bohemia_2x_flip.py --flip      # phase 2: wrap BAKED, RIG_RS becomes 2
  python3 tools/bohemia_2x_flip.py --unflip    # put the rig back to 56, seams intact
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

# ---------------------------------------------------------------------------
# PHASE 1 -- THE SEAMS. Identity at RIG_RS === 1, every one of them.
# ---------------------------------------------------------------------------

# The transform itself, lifted VERBATIM from tools/bohemia_rig_double.js where it is
# proved lossless and exactly invertible on his real rig. One definition of the
# doubling exists in the shipped file; the tool keeps the proof.
RIG2X_SRC = """/* ===== 2X: THE RIG DOUBLER (Paolo 8/14: "twice as many pixels ... border half as
   thin") ====================================================================
   One painted pixel becomes a 2x2 block. INDEX MATH ONLY -- no resampling, no
   interpolation, nothing that can invent or move a pixel of his art. That is what
   makes this safe under RIG LAW ("painted regions are SACROSANCT"): the transform
   is exactly invertible, and tools/bohemia_rig_double.js proves it by halving the
   output back and demanding his original pixels byte for byte, every part, every
   facing. The literal below this function is untouched -- his rig is still in the
   file exactly as he painted it, and the doubling happens at load.
   COORDINATES DOUBLE TOO. Doubled art on un-doubled bones is the classic broken
   migration, so skeleton and pose go through the same multiply. */
function RIG2X_dblList(list, W){
  const out = [];
  for (let k = 0; k < list.length; k++){
    const i = list[k], x = i % W, y = (i / W) | 0;
    const X = x * 2, Y = y * 2, W2 = W * 2;
    out.push(Y * W2 + X, Y * W2 + X + 1, (Y + 1) * W2 + X, (Y + 1) * W2 + X + 1);
  }
  return out;
}
function RIG2X_dblSkel(sk){ const o = {}; for (const j in sk) o[j] = [sk[j][0]*2, sk[j][1]*2]; return o; }
function RIG2X(baked){
  const W = baked.W || 56, layers = {}, skeleton = {}, pose = {};
  for (const d in baked.layers){
    const src = baked.layers[d], dst = {};
    for (const pid in src) dst[pid] = RIG2X_dblList(src[pid], W);
    layers[d] = dst;
  }
  for (const d in (baked.skeleton || {})) skeleton[d] = RIG2X_dblSkel(baked.skeleton[d]);
  for (const d in (baked.pose || {}))     pose[d]     = RIG2X_dblSkel(baked.pose[d]);
  return { W: W * 2, H: (baked.H || 56) * 2, layers: layers, skeleton: skeleton, pose: pose,
           layerOverride: baked.layerOverride, swingAmt: baked.swingAmt };
}
"""

# RIG_RS is THE scalar. Every 56-space constant in the renderer is expressed
# against it, so there is exactly one place that knows the rig's resolution.
RS_DECL = """
/* RIG_RS -- THE RESOLUTION SCALAR. Everything that was authored in 56-space reads
   this instead of knowing a number. At 1 the renderer is byte-for-byte the build
   that shipped before the flip; at 2 the frame is composed natively at 112 and
   Scale2x is off. Derived from BAKED itself so it can never disagree with the rig. */
const RIG_RS = (BAKED.W / 56) | 0;
"""

SEAMS = [
    # ---- the size literals: five declarations, one source of truth ----
    # ENGINE SYNC LAW: this body is ALSO carried by engine/bohemia_bodyvar.js, so the
    # replacement text has to be byte-identical there, and it has to survive being
    # loaded where BAKED does not exist yet. Hence the guard and the 56 fallback --
    # a bare BAKED.W drifted the two carriers and threw the sync gate red.
    ('BODYVAR reads the rig instead of a number',
     "  const CW = 56, CH = 56;\n",
     "  /* THE RIG'S OWN SIZE, not a number this module remembers. Guarded because this\n"
     "     file is a STANDALONE CARRIER as well as an inlined one -- a bare BAKED.W\n"
     "     would throw at load anywhere BAKED is not already defined -- and because\n"
     "     ENGINE SYNC LAW requires this body to be byte-identical in every carrier. */\n"
     "  const CW = (typeof BAKED !== 'undefined' && BAKED.W) || 56,\n"
     "        CH = (typeof BAKED !== 'undefined' && BAKED.H) || 56;\n"),

    # *** THESE FOUR WERE LATER RE-WRITTEN WITH A `typeof BAKED` GUARD (found 8/20).
    # They were applied long ago and then hardened, so the tool's original matchers
    # found ZERO of either form and it refused to flip -- correctly, but for a reason
    # that had nothing to do with the rig. A tool that cannot recognise its own
    # finished work reports a MISS for a job that is DONE. The `new` string is what
    # the file actually says today, so the already-applied branch catches them. ***
    ('the skinner grid reads the rig',
     "const CW = 56, CH = 56, NP = 12;",
     "const CW = (typeof BAKED!=='undefined'&&BAKED.W)||56, CH = (typeof BAKED!=='undefined'&&BAKED.H)||56, NP = 12;"),

    ('CLOTHES_FIT is measured in rig space',
     "  const _CW = 56;",
     "  const _CW = (typeof BAKED!=='undefined'&&BAKED.W)||56;"),

    ('dressBackLimb reads the rig',
     "  const CW=56,CH=56, SK=SKINNERS[d];",
     "  const CW=(typeof BAKED!=='undefined'&&BAKED.W)||56,CH=(typeof BAKED!=='undefined'&&BAKED.H)||56, SK=SKINNERS[d];"),

    ('buildFrame composes at rig resolution',
     "  const CW=56,CH=56;\n",
     "  const CW=(typeof BAKED!=='undefined'&&BAKED.W)||56,CH=(typeof BAKED!=='undefined'&&BAKED.H)||56;\n"),

    # ---- the head bob is a PHYSICAL distance, not a pixel count ----
    ('the head bob is the same physical dip at either resolution',
     "  j.neck[1] += bob; j.headTop[1] += bob;",
     """  /* 2X: the bob is a DISTANCE, not a pixel count. At 56 a 1px dip arrived on
     screen as 2 after Scale2x; composing natively at 112 the same 1 would be half
     the breathing he approved. It scales with the rig. */
  j.neck[1] += bob*RIG_RS; j.headTop[1] += bob*RIG_RS;"""),

    # ---- the hat line is a 56-space row derived from a 24-grid layer ----
    ('the hat line is in rig space',
     "HAT_MAX_Y[gd]=mx+3;}})();  // +G24_OY into 56-space",
     "HAT_MAX_Y[gd]=(mx+3)*RIG_RS;}})();  // +G24_OY into 56-space, then into rig space"),

    # ---- THE CHIN LAW clamp reads a PD row; PD is still 24-grid ----
    ('the chin clamp converts the mouth row into rig space',
     "         const _y=((+_i/(_FL.w||24))|0)+G24_OY; if(_y>_mouthY)_mouthY=_y; }",
     "         const _y=(((+_i/(_FL.w||24))|0)+G24_OY)*RIG_RS; if(_y>_mouthY)_mouthY=_y; }"),

    ('the chin clamp keeps its two rows of head at either resolution',
     "     if(_mouthY>=0&&_throatTop<_mouthY+2)_throatTop=1e9;}",
     "     if(_mouthY>=0&&_throatTop<_mouthY+2*RIG_RS)_throatTop=1e9;}"),

    # ---- the throat keeps the same SHARE of the neck, not the same row count ----
    ('the throat takes the same physical depth, not the same row count',
     """    const _tRows=(NECK_TONE.throatRowsByDir&&NECK_TONE.throatRowsByDir[d]!=null)
      ?NECK_TONE.throatRowsByDir[d]:NECK_TONE.throatRows;""",
     """    /* 2X: throatRows stays in HIS units (one row of a 56 face, his 7/28 -> 8/11
       ruling) and is converted here. Left as a raw 1 it would claim half as much
       throat at 112 and quietly undo the tone he approved. */
    const _tRows=((NECK_TONE.throatRowsByDir&&NECK_TONE.throatRowsByDir[d]!=null)
      ?NECK_TONE.throatRowsByDir[d]:NECK_TONE.throatRows)*RIG_RS;"""),

    # ---- SKIN DETAIL: his brush paints a 56 grid; it stamps into rig space ----
    ('his painted skin detail stamps into rig space',
     """  if(SKIN_DETAIL[d])for(const idx in SKIN_DETAIL[d]){const si=+idx;
    if(grid[si]&&GROUP[grid[si]]!==undefined){let c=sramp[SKIN_DETAIL[d][idx]]||sramp[2];
      if(grid[si]===3)c=[Math.round(c[0]*0.9),Math.round(c[1]*0.9),Math.round(c[2]*0.9)];   // NECK SHADOW LAW holds under detail
      px[si]=c;}}""",
     """  /* 2X: the SKIN DETAIL BRUSH still paints a 56 grid -- that is the surface in
     the CHARACTER tab and his saved skinDetail is keyed to it -- so each of his
     cells stamps as a RIG_RS x RIG_RS block. Doubling the stored data instead
     would break the brush and buy no detail. */
  if(SKIN_DETAIL[d])for(const idx in SKIN_DETAIL[d]){const _s0=+idx;
    const _sx=(_s0%56)*RIG_RS, _sy=((_s0/56)|0)*RIG_RS;
    for(let _dy=0;_dy<RIG_RS;_dy++)for(let _dx=0;_dx<RIG_RS;_dx++){
      const si=(_sy+_dy)*CW+(_sx+_dx); if(si<0||si>=grid.length)continue;
      if(grid[si]&&GROUP[grid[si]]!==undefined){let c=sramp[SKIN_DETAIL[d][idx]]||sramp[2];
        if(grid[si]===3)c=[Math.round(c[0]*0.9),Math.round(c[1]*0.9),Math.round(c[2]*0.9)];   // NECK SHADOW LAW holds under detail
        px[si]=c;}}}"""),

    # ---- THE PD PLACEMENT SEAM ----
    ('PD layers stay 24-grid and stamp as blocks into rig space',
     """    for(const idx in L.px){const li=+idx;let lx=li%GW,ly=(li/GW)|0;
      if(isMir)lx=(GW-1-lx);
      let sx=lx+G24_OX, sy=ly+G24_OY;""",
     """    /* 2X -- THE PD PLACEMENT SEAM. PD layers are his painted art on a 24 grid and
       they STAY on a 24 grid: the RIG and CLOTHES editors write them there, and
       block-doubling the stored pixels would invent nothing while breaking every
       paint tool he has. The 24->rig placement is what scales, and each pixel
       lands as a RIG_RS x RIG_RS block below. */
    for(const idx in L.px){const li=+idx;let lx=li%GW,ly=(li/GW)|0;
      if(isMir)lx=(GW-1-lx);
      let sx=(lx+G24_OX)*RIG_RS, sy=(ly+G24_OY)*RIG_RS;"""),

    ('the face offsets he set are physical nudges, so they scale too',
     """        const off=faceOffset(d,feat); sx+=off[0]; sy+=off[1];""",
     """        const off=faceOffset(d,feat); sx+=off[0]*RIG_RS; sy+=off[1]*RIG_RS;"""),

    ('the PD pixel lands as a block',
     """      const si=sy*CW+sx;
      if(si<0||si>=restCol.length)continue;
      restCol[si]=ramp[L.px[idx]]||ramp[ramp.length-1];}""",
     """      const _pc=ramp[L.px[idx]]||ramp[ramp.length-1];
      for(let _dy=0;_dy<RIG_RS;_dy++)for(let _dx=0;_dx<RIG_RS;_dx++){
        const _px2=sx+_dx,_py2=sy+_dy; if(_px2<0||_px2>=CW||_py2<0||_py2>=CH)continue;
        restCol[_py2*CW+_px2]=_pc;}}"""),

    # ---- THE GARMENT SEAM: the helper, declared once, above the FIRST preview call ----
    # *** THE GARMENT SEAM IS NATIVE AS OF 8/20 AND THIS EDIT IS RETIRED. ***
    # It used to insert a block-doubler here: hand the generators a grid downsampled
    # back to 56 and stamp their output as RIG_RS x RIG_RS squares. That was a
    # deliberate deferral and Paolo named it from outside the code the same morning
    # ("remake all the clothes and hairs with the 4x pixels we now have in mind"):
    # it puts CHUNKY CLOTHES ON A SHARP BODY. All 13 generators draw natively now
    # (gates/clothes_4x_gate.js, 448/448 shapes on 8 facings), so the seam hands them
    # the real grid and stamps 1:1.
    # LEFT IN AS AN ASSERTION, NOT DELETED: if the native seam ever disappears this
    # goes MISS and refuses to flip, rather than silently reinstating the old one.
    ('the garment seam is NATIVE (the generators draw at the rig\'s own size)',
     "  const _gw=(CW/RIG_RS)|0, _gh=(CH/RIG_RS)|0;",
     "  const _gw=CW, _gh=CH, _gsrc=grid;"),

    ('what he is wearing goes through the same seam',
     """      let out=null; try{ out=gg.gen(grid,CW,CH); }catch(e){}
      if(out)for(const gi in out){ const i=+gi; if(i>=0&&i<px.length) px[i]=out[gi]; } }""",
     """      let out=null; try{ out=gg.gen(_gsrc,_gw,_gh); }catch(e){}
      _stampG(out); }"""),

    # ---- Scale2x comes OFF; the frame is already the final size ----
    # SUBSUMED BY tools/bohemia_outline_at_display.py, which rewrote this same block
    # to draw the border after the upscale. The RIG_RS guard it added is still the
    # thing that turns Scale2x off at 112; the anchor just lives in that patch now.
    ('Scale2x is off once the frame is composed at final size',
     """    const _upscale=(G.hd && RIG_RS===1);""",
     """    const _upscale=(G.hd && RIG_RS===1);"""),

    ('the skeleton overlay scales off the rig',
     """  if(G.showSkel){const P=posedSkel(d,clip,ph).sk;const S=W/56;""",
     """  if(G.showSkel){const P=posedSkel(d,clip,ph).sk;const S=W/BAKED.W;"""),

    # ---- the two bake exports keep their contracts ----
    # Both bake exports were rewritten by tools/bohemia_outline_at_display.py so they
    # compose borderless, upscale, then border at 112. They still honour their size
    # contract at either RIG_RS -- the `if(W!==112)` guard is what does it now.
    ('the 112 combat sprite export keeps its contract',
     """  if(W!==112){const idx=px.map(c=>c?((c[0]<<16)|(c[1]<<8)|c[2])+1:0);""",
     """  if(W!==112){const idx=px.map(c=>c?((c[0]<<16)|(c[1]<<8)|c[2])+1:0);"""),

    ('the dial sprite sequence keeps its 112 contract too',
     """           if(_w!==112){const _ix=_p.map(c=>c?((c[0]<<16)|(c[1]<<8)|c[2])+1:0);""",
     """           if(_w!==112){const _ix=_p.map(c=>c?((c[0]<<16)|(c[1]<<8)|c[2])+1:0);"""),
]

FLIP_FROM = 'const BAKED={"W":56,"H":56,"skeleton"'
FLIP_TO   = 'const BAKED=RIG2X({"W":56,"H":56,"skeleton"'
FLIP_END_FROM = ',"swingAmt":0.5};'
FLIP_END_TO   = ',"swingAmt":0.5});'


def apply_seams(alpha):
    applied, missed = [], []

    # the doubler + the scalar go in immediately before the rig literal, so RIG_RS
    # exists before the first line that could read it
    if 'function RIG2X(baked)' not in alpha:
        anchor = 'const BAKED={"W":56'
        if alpha.count(anchor) != 1:
            missed.append('RIG2X insertion point -- found %d anchors' % alpha.count(anchor))
        else:
            alpha = alpha.replace(anchor, RIG2X_SRC + anchor, 1)
            applied.append('the lossless doubler is in the file')
    else:
        applied.append('(already) the lossless doubler is in the file')

    if 'const RIG_RS = ' not in alpha:
        anchor = ',"swingAmt":0.5};'
        if alpha.count(anchor) != 1:
            anchor = ',"swingAmt":0.5});'
        if alpha.count(anchor) != 1:
            missed.append('RIG_RS insertion point -- found %d anchors' % alpha.count(anchor))
        else:
            alpha = alpha.replace(anchor, anchor + '\n' + RS_DECL, 1)
            applied.append('RIG_RS is declared off the rig itself')
    else:
        applied.append('(already) RIG_RS is declared off the rig itself')

    for label, old, new in SEAMS:
        if new in alpha:
            applied.append('(already) ' + label); continue
        n = alpha.count(old)
        if n != 1:
            missed.append('%s -- expected exactly 1 match, found %d' % (label, n)); continue
        alpha = alpha.replace(old, new, 1)
        applied.append(label)

    # THE PREVIEW CALL APPEARS TWICE, on purpose -- the clothing factory paints once
    # before the PD layers and once after them (the 'GARMENT PREVIEW RUNS LAST' note
    # explains why). Both are the same seam and both get the same treatment, so this
    # one is an exactly-TWICE edit rather than an exactly-once edit. The tool refused
    # to write when it was written as a single-match edit, which is the whole point
    # of the count check.
    PREV_OLD = ("  if(window.CLO_PREVIEW){ const gm=window.CLO_PREVIEW(grid,CW,CH); "
                "if(gm)for(const gi in gm){ const i=+gi; if(i>=0&&i<px.length) px[i]=gm[gi]; } }")
    PREV_NEW = "  if(window.CLO_PREVIEW){ _stampG(window.CLO_PREVIEW(_gsrc,_gw,_gh)); }"
    if PREV_NEW in alpha and PREV_OLD not in alpha:
        applied.append('(already) both garment previews go through the seam')
    else:
        n = alpha.count(PREV_OLD)
        if n != 2:
            missed.append('both garment previews -- expected exactly 2 matches, found %d' % n)
        else:
            alpha = alpha.replace(PREV_OLD, PREV_NEW)
            applied.append('both garment previews go through the seam (2 sites)')

    return alpha, applied, missed


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else '--seams'
    alpha = open(ALPHA, encoding='utf8').read()

    if mode == '--unflip':
        if FLIP_TO not in alpha:
            print('  ok   (already) the rig is at 56'); return 0
        alpha = alpha.replace(FLIP_TO, FLIP_FROM, 1).replace(FLIP_END_TO, FLIP_END_FROM, 1)
        open(ALPHA, 'w', encoding='utf8').write(alpha)
        print('  ok   the rig is back at 56 -- the seams are still in and are the identity there')
        return 0

    alpha, applied, missed = apply_seams(alpha)
    for l in applied: print('  ok   ' + l)
    for l in missed:  print('  MISS ' + l)
    if missed:
        print('2X FLIP: refused to write -- %d edit(s) did not match exactly once' % len(missed))
        return 1

    if mode == '--flip':
        if FLIP_TO in alpha:
            print('  ok   (already) the rig is doubled at load')
        elif alpha.count(FLIP_FROM) == 1 and alpha.count(FLIP_END_FROM) == 1:
            alpha = alpha.replace(FLIP_FROM, FLIP_TO, 1).replace(FLIP_END_FROM, FLIP_END_TO, 1)
            print('  ok   *** THE RIG IS DOUBLED AT LOAD -- the frame now composes at 112 '
                  'natively, Scale2x is off, and the border is one true pixel ***')
        else:
            print('  MISS the rig literal did not match exactly once')
            print('2X FLIP: refused to write')
            return 1

    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('2X FLIP (%s): applied to %s' % (mode.lstrip('-'), ALPHA))
    return 0


if __name__ == '__main__':
    sys.exit(main())
