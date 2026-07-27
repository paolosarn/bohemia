#!/usr/bin/env python3
"""
BOHEMIA CITY SCREEN FILTER (7/27/26, CITY lane) - the last blit, the one the
PHONE does, was throwing away every sharp pixel the game had just drawn.

Yesterday's PIXEL FIX made the world blit 1:1 into the canvas backing store
(TPX 16 -> 22, whole-pixel camera). Correct, measured, shipped. And then the
browser undid it on the way to the glass, because nobody had measured THAT step.

MEASURED, on the real alpha at iPhone-portrait DPR 3, by walking every tab and
reading each canvas's CSS box against its backing store:

    tab      canvas   backing      css box        ratio     image-rendering
    city     #cv      378 x 765    378 x 764.61   x0.9995   auto
    rig      #cv      336 x 336    336 x 336      x1        auto

TWO defects in one line of CSS, on the surface that draws most of the pixels in
the game:

1. image-rendering was never set on #cv, so it is `auto` = SMOOTH. The canvas
   backing store is 378 CSS px wide; the phone's screen is 3x that. Every frame
   of the walked world is therefore BILINEAR-UPSCALED x3 on its way to the
   glass. Not one tile in the game has ever reached Paolo's eye at the sharpness
   it was painted at. The chunk blit being 1:1 internally did not matter - the
   softening happens after the game is finished drawing, in the compositor,
   which is exactly why reading the render code could never find it.

2. The stage box is 764.61 CSS px tall but clientHeight rounds to 765, so the
   backing store is a hair taller than the box it is drawn into and the whole
   world is squeezed by x0.9995. A 0.05% squeeze is not a visible squash; it is
   a guaranteed resample of every row, which is worse - it turns an exact x3
   into x2.9985 and denies the compositor any chance of a clean scale even once
   the filter is fixed.

THE FIX
  fit()    sizes the CSS box in explicit px to equal the backing store, so the
           ratio is exactly 1 and the phone's job is a pure integer x3.
  render() sets the filter per MODE, and this is deliberate:

             MODE 'human' (walked world) -> pixelated. Nearest-neighbour x3.
                  Pixel art, drawn at 22px per cell, displayed at 3 device
                  pixels per art pixel. Sharp, honest, and what the MOBILE
                  RENDER CONTRACT means by "non-integer scale is BANNED".
             MODE 'city'  (the builder overview) -> auto, UNCHANGED.
                  That surface is a big minification of ~266px district heroes
                  into ~20px slots; nearest at 13:1 samples 1 pixel in 13 and
                  aliases into noise, and Paolo LIKES that surface as it is.
                  Byte-identical output there is a requirement, not a nicety.

  There is no canvas text to worry about (the city frame has zero fillText
  calls - every label is a DOM element), so nothing legible gets chunkier.

NOT FIXED HERE, ON PURPOSE - the same measurement found fractional CSS scales on
the CHARACTER lane's surfaces (charCv x3.20, portraitCv x1.88, cloBig x2.68, the
anim gallery x0.766, and the rig frame's canvas with no filter at all). Those are
another session's system and ONE SYSTEM ONE SESSION holds. They are recorded in
BOHEMIA_BACKLOG.md under that lane with the measured numbers, and
gates/canvas_scale_gate.js reports them every run without failing on them.

REUSE CHECK: cooks ZERO pixels, selects no asset, alters no art. It changes the
filter the browser uses to put the already-drawn canvas on the screen and makes
the canvas box an integer size. No banks/ lookup applies because nothing is
created or chosen.

TASTE CHECK: produces no candidates and reaches Paolo's thumbs with nothing.
This is a correctness fix to how already-approved art is composited.

Idempotent (marker SCREEN FILTER). Verify with:
  node gates/canvas_scale_gate.js

  python3 tools/bohemia_city_screenfilter_patch.py
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

if 'SCREEN FILTER' in decoded:
    print('screen filter already applied. no-op.')
    sys.exit(0)

applied = []

# ---- 1) the CSS box equals the backing store, exactly ------------------------
OLD_FIT = ("function fit(){ const st=document.getElementById('stage');\n"
           "  cv.width=st.clientWidth; cv.height=st.clientHeight; render(); }")
NEW_FIT = """/* SCREEN FILTER (7/27): the stage box measured 764.61 CSS px tall while
   clientHeight rounded to 765, so the backing store was a hair bigger than the
   box it was painted into and the compositor squeezed the whole world by
   x0.9995 - a full resample of every row for a squash nobody can see. Size the
   CSS box in explicit px to match the backing store and the ratio is exactly 1,
   which leaves the phone a pure integer x3 to do and nothing to interpolate.
   ceil() on the height so the canvas covers the sub-pixel remainder instead of
   leaving a sliver of stage background; #stage is overflow:hidden. */
function fit(){ const st=document.getElementById('stage');
  const r=st.getBoundingClientRect();
  const w=Math.max(1,Math.round(r.width)), h=Math.max(1,Math.ceil(r.height));
  cv.width=w; cv.height=h;
  cv.style.width=w+'px'; cv.style.height=h+'px';
  render(); }"""
if decoded.count(OLD_FIT) == 1:
    decoded = decoded.replace(OLD_FIT, NEW_FIT, 1)
    applied.append('canvas CSS box == backing store (was x0.9995, a resample of every row)')

# ---- 2) the filter follows the MODE -----------------------------------------
OLD_RENDER = "function render(){ if(MODE==='city')renderCity(); else renderHuman(); }"
NEW_RENDER = """/* SCREEN FILTER (7/27): #cv had no image-rendering, so it took the browser
   default of `auto` = SMOOTH, and the 378-wide backing store was BILINEAR
   upscaled x3 to the phone's glass on every single frame. The walked world has
   never once been seen at the sharpness it was painted at, no matter what the
   render code did, because the damage happens after the game stops drawing.
   Nearest-neighbour for the walked world (pixel art at 22px per cell, 3 device
   pixels per art pixel = sharp), and `auto` LEFT ALONE for the city-builder
   overview, where the draws are 13:1 minifications of district heroes and
   smoothing is the correct choice on a surface Paolo already likes. */
let SCRFILT=null;
function screenFilter(mode){
  const want=(mode==='city')?'auto':'pixelated';
  if(SCRFILT===want)return;                 /* style writes are layout-adjacent; only on change */
  SCRFILT=want; cv.style.imageRendering=want;
}
function render(){ if(MODE==='city'){ screenFilter('city'); renderCity(); } else { screenFilter('human'); renderHuman(); } }"""
if decoded.count(OLD_RENDER) == 1:
    decoded = decoded.replace(OLD_RENDER, NEW_RENDER, 1)
    applied.append('walked world composites nearest-neighbour x3 (was bilinear); overview untouched')

if not applied:
    print('SCREEN FILTER: no anchor matched - the city module moved. NOT applied.')
    sys.exit(1)

assert 'SCREEN FILTER' in decoded
assert decoded.count('cv.style.imageRendering') == 1
reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('SCREEN FILTER applied:')
for a in applied:
    print('  - ' + a)
