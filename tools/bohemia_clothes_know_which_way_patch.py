#!/usr/bin/env python3
"""BOHEMIA -- THE CLOTHES KNOW WHICH WAY YOU ARE FACING (8/1/26). Idempotent.

Paolo 8/1: "I'm very concerned that the back of many outfits look like the front
of all the outfits ... when I'm facing north the back of my outfits are the exact
same when I'm facing south you know it's very disturbing."

He is right, and it is ONE VARIABLE.

THE BUG. Nineteen garment generators decide front-from-back by reading `curDir`:

    var dir=(typeof curDir!=='undefined')?curDir:'S';
    var frontFacing=(dir==='S'||dir==='SE'||dir==='SW');
    var isOpen=function(x,y){ return frontFacing && ... };   // genCoat

`curDir` is assigned in EXACTLY ONE PLACE in the whole file -- inside the
CLOTHES-tab preview renderer, whose own comment states the intent: "genCoat reads
this: the open front only shows when front-facing." The CHARACTER composite, the
crowd, and the run never set it. So it sits at its initial 'S' and every
generator believes the body is facing south, on every facing, forever.

WHAT THAT LOOKED LIKE: a denim jacket's open front, a trench's inner panel and a
satchel's strap all rendered on his BACK. The back-facing code was written and
wired and simply never fed. The only way it ever came out right was by accident,
if he had scrubbed the CLOTHES tab to another facing first and left the global
behind.

A CORRECTION I OWE THE RECORD: I first reported "not one clothing generator is
facing-aware." That was FALSE -- 12 of 13 are. My grep pattern was broken
(`d==='N'` never matches `dir==='N'`). Only genShoes is genuinely facing-blind,
which is the real reason all 18 shoes are byte-identical front to back. That is
left alone here: this patch feeds the direction through, it does not author new
garment geometry. genShoes is a separate, honest piece of work.

THE FIX, two edits:
  1. The generators' closure exposes a setter, because `curDir` is private to it.
  2. The composite sets it to the frame's direction before running gen(), and
     RESTORES the previous value after -- so the CLOTHES preview, which owns
     this variable, never comes back to a value it did not set.

WHY THE COMPOSITE AND NOT drawChar: the composite is where gen() is actually
called, so the direction is set as close to the read as possible. Anything
further out and some other path could call gen() without it.

REUSE CHECK: cooks ZERO graphic pixels, opens no banks, authors no geometry. It
routes a value that already exists into a mechanism that already exists.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): no joints, no parts, no rig access. It
sets a string.
  built on: none
  joints: none named
  parts: none
"""
import sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
ALPHA = ROOT / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
src = ALPHA.read_text()

if 'CLO_SET_DIR' in src:
    print('FACING PATCH: already applied, nothing to do')
    sys.exit(0)

# ---- 1. expose the setter from the generators' own closure -------------------
DECL = "  var cloDir='S', raf=0, live=[], strips=[], lastT=0, graded=false, curDir='S';"
NEW_DECL = DECL + """
  /* THE CLOTHES HAVE TO BE TOLD WHICH WAY HE IS FACING (Paolo 8/1: "the back of
     my outfits are the exact same when I'm facing south ... very disturbing").
     19 generators read curDir to pick front-from-back, and until now the ONLY
     writer was the CLOTHES preview below -- so the CHARACTER view, the crowd and
     the run all rendered every garment as if he were facing south. curDir is
     private to this closure, so the composite cannot reach it without this. */
  window.CLO_SET_DIR = function(d){ var was = curDir; if (d) curDir = d; return was; };"""
if DECL not in src:
    sys.exit('FACING PATCH: curDir declaration not found')
src = src.replace(DECL, NEW_DECL, 1)

# ---- 2. feed it, around BOTH gen() call sites --------------------------------
OLD_PREV = "  if(window.CLO_PREVIEW){ const gm=window.CLO_PREVIEW(grid,CW,CH); if(gm)for(const gi in gm){ const i=+gi; if(i>=0&&i<px.length) px[i]=gm[gi]; } }"
NEW_PREV = "  if(window.CLO_PREVIEW){ const gm=window.CLO_PREVIEW(grid,CW,CH); if(gm)for(const gi in gm){ const i=+gi; if(i>=0&&i<px.length) px[i]=gm[gi]; } }\n"
if OLD_PREV not in src:
    sys.exit('FACING PATCH: CLO_PREVIEW line not found')

OLD_WORN = """  if(!window.CLO_PREVIEW&&window.GARMENTS&&window.G_WORN){"""
NEW_WORN = """  if(!window.CLO_PREVIEW&&window.GARMENTS&&window.G_WORN){
    /* TELL THE CLOTHES WHICH WAY HE IS FACING, and hand the old value back after
       -- the CLOTHES preview owns this variable and must never return to a value
       it did not set. Without this every coat opens down his spine. */
    const _cdWas = window.CLO_SET_DIR ? window.CLO_SET_DIR(d) : null;
    try {"""
if OLD_WORN not in src:
    sys.exit('FACING PATCH: worn-composite opener not found')
src = src.replace(OLD_WORN, NEW_WORN, 1)

# close the try/finally at the end of the worn block
OLD_CLOSE = """      if(out)for(const gi in out){ const i=+gi; if(i>=0&&i<px.length) px[i]=out[gi]; } } }"""
NEW_CLOSE = """      if(out)for(const gi in out){ const i=+gi; if(i>=0&&i<px.length) px[i]=out[gi]; } }
    } finally { if(window.CLO_SET_DIR) window.CLO_SET_DIR(_cdWas); } }"""
if OLD_CLOSE not in src:
    sys.exit('FACING PATCH: worn-composite closer not found')
src = src.replace(OLD_CLOSE, NEW_CLOSE, 1)

# ---- 3. genBag's SATCHEL never checked BACK ----------------------------------
# Feeding the direction through exposed a second, smaller bug the facing gate
# caught immediately: the satchel branch reads `prof` (the E/W profile) but never
# `back`, so a hip bag and its cross-body strap stayed on the SAME side of the
# screen when he turned around. A bag on his right hip has to appear on the other
# side of the sprite from behind -- that is what turning around means. The coats
# were the loud half of his report; this is the quiet half.
OLD_SATCHEL = """      var hy=tb-2, side=prof?((fcx>cx)?tMx+1:tMn-1):tMn-1;"""
NEW_SATCHEL = """      var hy=tb-2, side=prof?((fcx>cx)?tMx+1:tMn-1):(back?tMx+1:tMn-1);   /* BACK VIEW MIRRORS THE HIP (8/1): a bag on his right hip is on the other side of the screen from behind */"""
if OLD_SATCHEL not in src:
    sys.exit('FACING PATCH: satchel hip line not found')
src = src.replace(OLD_SATCHEL, NEW_SATCHEL, 1)

OLD_STRAP = """        var strapX=Math.round(cx+3-(cx+3-(side))*ts*0.9);"""
NEW_STRAP = """        var _s0=back?cx-3:cx+3;                                             /* the strap crosses the OTHER shoulder from behind */
        var strapX=Math.round(_s0-(_s0-(side))*ts*0.9);"""
if OLD_STRAP not in src:
    sys.exit('FACING PATCH: satchel strap line not found')
src = src.replace(OLD_STRAP, NEW_STRAP, 1)

ALPHA.write_text(src)
print('FACING PATCH: applied (setter exposed + composite feeds direction + satchel mirrors)')

