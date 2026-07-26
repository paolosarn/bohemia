#!/usr/bin/env python3
"""
BOHEMIA CITY PIXEL FIX (7/26/26, CITY lane) - the walked world was resampled at
a fractional scale at EVERY zoom level, so no tile in it was ever drawn sharp.

Found by MEASUREMENT, not by reading code. tools/bohemia_render_audit.js patches
CanvasRenderingContext2D before the app boots and records every draw the game
actually makes. Walking the CITY tab for six steps:

    20,900 draws recorded
    NON-INT  8,560 (41.0%)  upscaled by a fractional factor
    worst offender:  8,560 x  "scale x1.375 (256 -> 352)"

THE BUG. The fine world bakes each 16x16-cell chunk into an offscreen canvas at
TPX pixels per cell, then blits that canvas at the live cell size HC:

    chunk canvas = CHK * TPX  = 16 * 16 = 256 px
    blitted at   = CHK * HC   = 16 * 22 = 352 px      ->  x1.375

TPX was 16 and its own comment said "~1:1 with screen at default zoom". The
default zoom is 22. It was never 1:1 - it was out by 37%, and the error is in
the one blit that draws the entire ground plane. Worse, the whole zoom ladder
is a clean power-of-two family that was measured against the wrong base:

    HLEVELS = [11, 22, 44, 88]
      / 16 (what shipped) -> 0.6875, 1.375, 2.75, 5.5      every level broken
      / 22 (this fix)     -> 0.5,    1.0,   2.0,  4.0      every level clean

So the ladder was right all along and the bake size was wrong. Setting TPX=22
makes the default zoom a true 1:1 blit and every other level an exact halving or
doubling - nearest-neighbour decimation/duplication, which is what pixel art
wants. This is the MOBILE RENDER CONTRACT's "non-integer scale is BANNED"
(laws/BOHEMIA_MOBILE_RENDER_CONTRACT_7_26_26.md) applied to the surface that
draws most of the pixels Paolo looks at.

AND THE MEMORY, because raising the bake size is not free. A chunk canvas goes
256x256 -> 352x352, which is 1.89x the bytes. The cell cache holds up to 520
chunks and, before this patch, a chunk kept its canvas until the CELL cache
evicted it - so the canvas count was bounded only by 520. At the new size that
is ~258 MB of canvas, over the ~224 MB iOS floor section 8 of the contract
names. Cells are cheap data; canvases are expensive pixels, and they had no
business sharing one budget. This patch gives canvases their OWN LRU cap
(CVCAP): the cell cache still holds 520, but at most CVCAP chunks hold a
canvas, and the oldest canvas is recycled through the existing CVPOOL when a new
one is needed. 64 * 352 * 352 * 4 = ~32 MB, bounded and predictable, and it is
now independent of TPX - a future zoom change cannot silently blow the budget.

REUSE CHECK: cooks ZERO pixels and touches no art. It changes the resolution the
existing procedural ground textures are baked at and the size of the blit that
puts them on screen. Every pixel drawn still comes from the same approved
sources (SA_TILES / the house-skin pools / the procedural ground painters that
already shipped). Nothing new is generated, nothing is restyled. No banks/ lookup
applies because no asset is created, selected or altered.

TASTE CHECK: produces no candidates and reaches Paolo's thumbs with nothing -
there is nothing for the pre-judge kill-pass to filter. This is a correctness
fix to how already-approved art is rasterised.

Idempotent (marker PIXEL FIX). Verify with:
  node tools/bohemia_render_audit.js slices/BOHEMIA_ALPHA_0_9.html --frame city --walk

  python3 tools/bohemia_city_pixelfix_patch.py
"""
import base64
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

applied = []

# ---- 1) the bake size matches the zoom ladder --------------------------------
OLD_TPX = ("const TPX=16;                                  "
           "// texture pixels per cell (~1:1 with screen at default zoom; character stays denser)")
NEW_TPX = """/* PIXEL FIX (7/26): TPX was 16 and this comment claimed "~1:1 with screen at
   default zoom". The default zoom is 22, so the chunk canvas (CHK*TPX = 256)
   was blitted at CHK*HC = 352 - a x1.375 resample of the ENTIRE ground plane,
   at every zoom, measured at 8,560 of 20,900 draws by
   tools/bohemia_render_audit.js. HLEVELS [11,22,44,88] is a clean power-of-two
   family; it was just being divided by the wrong base. Against 22 it is
   exactly 0.5x / 1x / 2x / 4x, which is what pixel art wants and what the
   MOBILE RENDER CONTRACT means by "non-integer scale is BANNED". */
const TPX=22;                                  // texture pixels per cell = the default zoom, a true 1:1 blit"""
if 'const TPX=22;' not in decoded and decoded.count(OLD_TPX) == 1:
    decoded = decoded.replace(OLD_TPX, NEW_TPX, 1)
    applied.append('TPX 16 -> 22 (every zoom level now 0.5x/1x/2x/4x)')

# ---- 2) canvases get their own budget, independent of the cell cache ---------
OLD_POOL = "const CVPOOL=[];"
NEW_POOL = """const CVPOOL=[];
/* PIXEL FIX (7/26): canvases used to live and die with the 520-entry CELL
   cache, so the number of live canvas buffers was bounded only by 520. Cells
   are a few bytes of data; a canvas is CHK*TPX squared of RGBA, and at the
   corrected bake size 520 of them is ~258MB - over the ~224MB iOS floor the
   render contract names. They get their own LRU now: the cell cache still
   holds 520, at most CVCAP of them hold a canvas, and the oldest canvas is
   recycled through CVPOOL when a new one is needed. Bounded, predictable, and
   independent of TPX, so changing the zoom can never silently blow the budget
   again. */
const CVCAP=64;
function cvTrim(keep){
  let live=0; for(const [,v] of chunkCache) if(v&&v.cv)live++;
  while(live>CVCAP){
    let ok=null,ot=Infinity;
    for(const [k,v] of chunkCache){ if(v&&v.cv&&k!==keep&&(v.cvT||0)<ot){ot=v.cvT||0;ok=k;} }
    if(ok===null)break;
    recycleCv(chunkCache.get(ok));      /* frees the pixels, KEEPS the cells */
    live--;
  }
}"""
if 'const CVCAP=' not in decoded and decoded.count(OLD_POOL) == 1:
    decoded = decoded.replace(OLD_POOL, NEW_POOL, 1)
    applied.append('canvases capped at 64, independent of the 520-cell cache')

OLD_RET = "  ch2.cv=c2; ch2.cvT=++chunkTick;"
NEW_RET = "  ch2.cv=c2; ch2.cvT=++chunkTick; cvTrim(key);   /* PIXEL FIX: hold the canvas budget */"
if 'cvTrim(key)' not in decoded and decoded.count(OLD_RET) == 1:
    decoded = decoded.replace(OLD_RET, NEW_RET, 1)

# a chunk that is re-used must refresh its recency, or the LRU evicts what is
# on screen right now.
OLD_HIT = "  const key=cx+','+cy; const ch=chunkCache.get(key);\n  if(ch&&ch.cv)return ch;"
NEW_HIT = ("  const key=cx+','+cy; const ch=chunkCache.get(key);\n"
           "  if(ch&&ch.cv){ ch.cvT=++chunkTick; return ch; }   /* PIXEL FIX: touch it, or the LRU drops what is on screen */")
if decoded.count(OLD_HIT) == 1:
    decoded = decoded.replace(OLD_HIT, NEW_HIT, 1)

# ---- 3) the camera origin lands on a whole pixel -----------------------------
# MEASURED: 9,238 of 20,869 draws (44.3%) had a non-integer destination, every
# one of them a Y ending in .50. The canvas is sized to its CSS client box
# (cv.height=st.clientHeight), so an odd height makes cv.height/2 a half pixel,
# and the camera origin carries that half into EVERY blit. A half-pixel offset
# resamples across two pixel rows: every horizontal edge in the world softens,
# which is invisible in code review and obvious on screen. Round the origin.
ORIGINS = [
    ("const ox=cv.width/2-hx*C, oy=cv.height/2-hy*C;",
     "const ox=Math.round(cv.width/2-hx*C), oy=Math.round(cv.height/2-hy*C);   "
     "/* PIXEL FIX: whole-pixel camera - an odd canvas height put every tile on a half pixel */"),
    ("const ox=cv.width/2-(city.x-city.y)*TW/2+panX, oy=cv.height/2-(city.x+city.y)*TH/2+panY;",
     "const ox=Math.round(cv.width/2-(city.x-city.y)*TW/2+panX), "
     "oy=Math.round(cv.height/2-(city.x+city.y)*TH/2+panY);   /* PIXEL FIX: whole-pixel camera */"),
]
for old, new in ORIGINS:
    n = decoded.count(old)
    if n:
        decoded = decoded.replace(old, new)
        applied.append('camera origin rounded to whole pixels (%d site%s)' % (n, '' if n == 1 else 's'))

if not applied:
    print('pixel fix already applied. no-op.')
    sys.exit(0)

assert 'PIXEL FIX' in decoded
reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('PIXEL FIX applied:')
for a in applied:
    print('  - ' + a)
