#!/usr/bin/env python3
"""BOHEMIA -- A SHOE HAS A HEEL (8/1/26). Idempotent.

Paolo 8/1: "the back of many outfits look like the front of all the outfits ...
when I'm facing north the back of my outfits are the exact same when I'm facing
south you know it's very disturbing."

Most of that was ONE VARIABLE (curDir was never fed to the generators; fixed
8/1). But when the facing finally started flowing, one generator still did not
move: genShoes reads no direction at all. It was the honest remainder, recorded
as outstanding rather than quietly bundled into that fix, and this is it.

MEASURED: all 18 canon shoes render BYTE-IDENTICAL front to back. You see a
laced tongue on the back of the heel, from every angle, forever.

WHAT A SHOE ACTUALLY LOOKS LIKE FROM BEHIND, which is the whole point:
  - NO LACES. Laces are a front feature. Nothing about the back of a shoe is laced.
  - A HEEL COUNTER: the stiffened cup around the heel, which reads as a darker
    band across the upper foot where the tongue would be from the front.
  - A HEEL SEAM: the vertical join up the centre back. One pixel wide -- his
    8/1 rule, "the difference is just one pixel not like two or three", now
    clause 4 of laws/BOHEMIA_LAW_HOW_HAIR_AND_SHAPE_WORK_8_1_26.md.

A TALL BOOT keeps its smooth shaft either way (it has no laces to lose), but it
gains the same back seam, because that is how a boot shaft is built.

WHY THIS IS ROUTED, NOT INVENTED: the direction is already flowing to every other
generator after the 8/1 facing fix. This teaches the last one to listen, and adds
the minimum geometry that makes a back read as a back.

REUSE CHECK: cooks no new graphic pixels and adds no garment. It re-colours
existing shoe pixels from the existing ramp (r.dk / midC / r.lt) depending on
which way the body is turned. No bank is opened because nothing new is drawn.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): reads the PART GRID to find the feet and
the shins, never touches BAKED, and paints an overlay only.
  built on: none
  joints: none named
  parts: 9=thigh-L, 10=thigh-R, 11=foot-L, 12=foot-R
"""
import sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
ALPHA = ROOT / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
src = ALPHA.read_text()

if 'A SHOE HAS A HEEL' in src:
    print('SHOE HEEL: already applied, nothing to do')
    sys.exit(0)

OLD = """    var soleC=r.sole||r.dk, midC=r.mid2||mix(r.mid,0.85);"""
NEW = """    var soleC=r.sole||r.dk, midC=r.mid2||mix(r.mid,0.85);
    /* A SHOE HAS A HEEL (Paolo 8/1). This generator read NO direction, so all 18
       shoes rendered byte-identical front to back and he saw a laced tongue on the
       back of his heel from every angle. Laces are a FRONT feature; from behind a
       shoe has a heel counter and a centre seam. */
    var _sd=(typeof curDir!=='undefined')?curDir:'S';
    var shBack=(_sd==='N'||_sd==='NE'||_sd==='NW');"""
if OLD not in src:
    sys.exit('SHOE HEEL: ramp-fallback line not found')
src = src.replace(OLD, NEW, 1)

OLD = """      else if((p===11||p===12)){ var ft=(p===11?fL.mn:fR.mn); if(!tall&&y<=ft+2&&(y%2===0))c=r.lt; else if(!tall&&y<=ft+2)c=midC; } /* laces on tongue (low shoes only; a tall boot is smooth leather) */"""
NEW = """      else if((p===11||p===12)){ var ft=(p===11?fL.mn:fR.mn);
        var fx=(p===11?fL:fR);
        if(shBack){
          /* THE HEEL COUNTER: the stiffened cup round the heel reads as a darker
             band exactly where the tongue sits from the front -- so the same rows
             that carry laces on a front facing carry the counter on a back one. */
          if(y<=ft+2)c=r.dk;
          /* THE HEEL SEAM, ONE PIXEL. His 8/1 rule, said twice: "the difference is
             just one pixel not like two or three". At 56px a 2px seam is a stripe. */
          if(x===Math.floor((fx.mnX+fx.mxX)/2)&&y<=ft+3)c=midC;
        }
        else if(!tall&&y<=ft+2&&(y%2===0))c=r.lt;
        else if(!tall&&y<=ft+2)c=midC; } /* laces on tongue (low shoes only; a tall boot is smooth leather) */"""
if OLD not in src:
    sys.exit('SHOE HEEL: lace line not found')
src = src.replace(OLD, NEW, 1)

# pExt gives {mn,mx} rows; the seam needs COLUMNS too. Derive them locally.
OLD = """    var fL=pExt(g,11),fR=pExt(g,12);"""
NEW = """    var fL=pExt(g,11),fR=pExt(g,12);
    /* pExt reports ROW extents; the centre-back seam needs COLUMN extents, so
       derive them here rather than widen a shared helper other gens depend on. */
    [[11,fL],[12,fR]].forEach(function(pr){ var pid=pr[0],ob=pr[1],a=CW,b=-1;
      for(var q=0;q<g.length;q++) if(g[q]===pid){ var xq=q%CW; if(xq<a)a=xq; if(xq>b)b=xq; }
      ob.mnX=(b<0?0:a); ob.mxX=(b<0?0:b); });"""
if OLD not in src:
    sys.exit('SHOE HEEL: foot-extent line not found')
src = src.replace(OLD, NEW, 1)

ALPHA.write_text(src)
print('SHOE HEEL: applied (no laces from behind, heel counter + 1px centre seam)')
