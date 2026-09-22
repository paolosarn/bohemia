#!/usr/bin/env python3
"""
V224 -- THE FIGHT RENDERS LIKE THE STREET  (COMBAT lane, [fight looks])

THE COORDINATOR'S NOTE ON MY ROW, 9/23, from V223: "the last size lie is the glass:
112 CSS px on the street against 56 in the fight at the same body constant, device
pixel ratio. Rule 21's fight leg is exactly this: measure the fighter ON THE PHONE
PROFILE in CSS px, same as body_scale_gate measures the street, and [fight feel] does
not start until it reads 112."

MEASURED ON THE CUT, ON THE PHONE PROFILE, BOTH SURFACES IN ONE SESSION:

    THE WALK    canvas 378 backing / 378 CSS   k=1    the person is 112 CSS
    THE FIGHT   canvas 780 backing / 390 CSS   k=2    the person is  56 CSS

Their number exactly. And the cause is ONE LINE, and it is the same shape as every
other finding in this row: two surfaces, two different rules, and the fight invented
its own.

    THE STREET   function fit(){ ... cv.width=w; cv.height=h; ... }        1:1 with CSS
    THE FIGHT    function size(){ const dpr=Math.min(devicePixelRatio||1,2);
                                  cv.width=r.width*dpr; ... }             2x on a phone

The walked world -- the surface he has been looking at for months, the one whose body
size rule 21 is written from -- draws its canvas at ONE backing pixel per CSS pixel.
The fight doubles it. So the same 112 box is 112 CSS on the street and 56 in the fight,
and no constant inside the fight could ever have fixed it, because the lie is in the
canvas, not in the drawing.

------------------------------------------------------------------- WHAT THIS DOES

The fight sizes its canvas the way the walked street sizes its own, copied from their
`fit()` rather than invented here (round for width, ceil for height, so the canvas
covers the sub-pixel remainder instead of leaving a sliver). Then, with nothing else
touched:

    the fighter    56 CSS  ->  112 CSS     rule 21, and body_scale_gate's own unit
    a house lot    98 CSS  ->  196 CSS     1.75 sprite widths, still his dial
    he stands      0.571 lots              unchanged -- rule 16, because BOTH move
    the two canvases                       same backing-per-CSS, so the same sharpness

THE THIRD ONE IS THE POINT: the lot is derived from the body (V223), so the body and
the ground move together and the proportions of the board do not change at all. What
changes is that a pixel in the fight is now the same size as a pixel on the street.

AND IT IS A QUARTER OF THE PIXELS. 780x1354 becomes 390x677, so the fight paints
528,030 pixels a frame where it painted 1,056,120 -- which is the direction rule 23
wants ("quicker", and PLUMBER's 60-on-a-phone floor), for free, as a side effect of
telling the truth about the size.

--------------------------------------------------------------- WHAT IT COSTS, SAID

A phone shows about TWO HOUSE LOTS during a fight instead of 3.6. That is not a new
cost and it is not mine: it is what his three rulings say when they are all obeyed at
once -- a person is 112 (rule 21), a lot is 1.75 sprite widths (his dial), a phone is
390 CSS px wide. V223 already named the same collision at 3.03 lots and house_board's
"4 to 10" bound is a number I wrote by eye on 9/15, before the body tripled. It is
repointed onto his rulings in this ship, with that said plainly rather than quietly
widened: a bound of mine may not outrank three of his.

What is still open behind it, unchanged from V223 and belonging to [fight feel]: the
way out is placed at 3.5 to 6.4 lots off sightTiles, so it can sit off the glass. That
is a placement derived from the wrong thing, not a reason to shrink the person.

NO DAMAGE BEFORE THE DIAL: not a reach, a chance, a hit or a turn. MAP LAW held: this
authors no street. The body board is untouched -- the canvas is the same canvas for
both boards, and bodyScale is still 1/FIELD_ZOOM when houseOn() is false.
"""
import base64
import os
import re
import subprocess
import sys
import tempfile

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_FIGHT_RENDERS_LIKE_THE_STREET__'

OLD = """function size(){const r=cv.getBoundingClientRect();const dpr=Math.min(devicePixelRatio||1,2);cv.width=r.width*dpr;cv.height=r.height*dpr;}"""


# THE CAMERA'S MARGINS ARE A THUMB, AND A THUMB IS A PHYSICAL SIZE.
OLD_FRAME = """      if(md>0){ const _pad=G.isTouch?96:44, _slack=G.isTouch?70:40, _ceil=G.isTouch?1.30:1.85;   /* V53: laptop reclaims the thumb margin -> much tighter frame */
        const fit=(Math.min(W/2,H/2)-_pad)/Math.max(80,md*ringF+_slack);"""

NEW_FRAME = """      /* V224 __THE_FIGHT_RENDERS_LIKE_THE_STREET__: *** THESE THREE WERE WRITTEN IN
         CANVAS PIXELS ON A CANVAS THAT WAS TWICE THIS ONE, AND HALVING THE CANVAS
         SILENTLY PULLED THE CAMERA BACK. *** Photographed the first cut of this: the
         board went from 3.6 lots across to 5.4 and the people went tiny again, for no
         reason anybody chose. A pad and a slack are a THUMB MARGIN, and a thumb is a
         physical size, so they live in CSS pixels and are converted by the canvas's own
         backing-per-CSS. At the old 2x canvas that reproduces 96, 70 and 80 exactly,
         byte for byte; at the street's 1:1 it keeps the same margin on the glass
         instead of doubling it. The ceiling and the 0.20 floor are ratios and do not
         move. */
      if(md>0){ const _k=Math.max(1,cv.width/Math.max(1,cv.getBoundingClientRect().width||cv.width));
        const _pad=(G.isTouch?48:22)*_k, _slack=(G.isTouch?35:20)*_k, _ceil=G.isTouch?1.30:1.85;
        const fit=(Math.min(W/2,H/2)-_pad)/Math.max(40*_k,md*ringF+_slack);"""

NEW = """/* ===== V224 __THE_FIGHT_RENDERS_LIKE_THE_STREET__ (COMBAT, [fight looks], rule 21)
   *** THE LAST SIZE LIE WAS THE CANVAS, NOT THE DRAWING. *** Measured on the cut, on
   the phone profile, both surfaces in one session:

       THE WALK    378 backing / 378 CSS   k=1    the person is 112 CSS
       THE FIGHT   780 backing / 390 CSS   k=2    the person is  56 CSS

   The walked world -- the surface rule 21's body size is written from -- sizes its
   canvas at ONE backing pixel per CSS pixel (their fit(): cv.width=w, round on the
   width, ceil on the height so the canvas covers the sub-pixel remainder). This one
   doubled it on a phone, so the same 112 box was 112 CSS on the street and 56 here,
   and NO CONSTANT INSIDE THE FIGHT COULD EVER HAVE FIXED THAT, because the lie was in
   the canvas.
   Copied from the street rather than invented here. Nothing else is touched, and
   because V223 derives the lot from the body, the body and the ground move together:
   the fighter becomes 112 CSS, a lot becomes 196 CSS, and he still stands 0.571 of a
   lot tall. What changes is that a pixel in the fight is now the size of a pixel on
   the street -- which is also the sharpness half of the same complaint.
   AND IT IS A QUARTER OF THE PIXELS a frame, which is the direction rule 23 asks for. */
function size(){ const r=cv.getBoundingClientRect();
  const w=Math.round(r.width), h=Math.ceil(r.height);
  /* *** AND A BOARD WITH NO BOX YET MUST NEVER BE LOCKED AT ONE PIXEL. *** MEASURED,
     not guessed: a fight frame came up READY, phase cover, all 13 ground kinds decoded
     -- and its board was 1x1, so it painted nothing and every floor reading was zero,
     while fieldPitch still returned a plausible 196 px tile because the tile is
     TILE_WIDE sprite widths and does not care how big the canvas is. size() is called
     ONCE at 30 ms and then only on resize, and an iframe that never changes size never
     gets a second chance -- so whatever the box was at 30 ms is what the board is for
     ever. The old line had the same hole and wrote 0x0 into it.
     So: no box, no resize -- ask again in a moment instead. And only assign when the
     size actually changed, because assigning canvas.width CLEARS the canvas. */
  if(!(w>0&&h>0)){ setTimeout(size,60); return; }
  if(cv.width!==w||cv.height!==h){ cv.width=w; cv.height=h; } }"""


def parse_check(blob, label):
    """EVERY SCRIPT IN THE BLOB STILL PARSES. V214 terminated a JS string and the fight
    stopped defining G; V217's first cut left a block comment open and the last script
    went silent. A guard that checks whether the file still runs rather than the text
    it wrote is not a guard."""
    bodies = re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', blob, re.S | re.I)
    if not bodies:
        sys.exit('GUARD %s: no inline scripts found, which cannot be right' % label)
    bad = 0
    for i, b in enumerate(bodies):
        fd, p = tempfile.mkstemp(suffix='.js')
        os.write(fd, b.encode('utf-8'))
        os.close(fd)
        r = subprocess.run(['node', '--check', p], capture_output=True)
        os.unlink(p)
        if r.returncode != 0:
            bad += 1
            print('  SCRIPT %d OF %d DOES NOT PARSE:' % (i + 1, len(bodies)),
                  r.stderr.decode('utf-8', 'replace').strip().splitlines()[-1][:160])
    if bad:
        sys.exit('GUARD %s: %d of %d scripts do not parse' % (label, bad, len(bodies)))
    print('  %s: %d scripts, all parse' % (label, len(bodies)))


def sub(s, old, new, what):
    n = s.count(old)
    if n != 1:
        sys.exit('ANCHOR %s: expected 1, found %d' % (what, n))
    return s.replace(old, new, 1)


def main():
    alpha = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64='([^']+)'", alpha)
    if not m:
        sys.exit('COMBAT_B64 not found in the alpha')
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    OLD_V224_BODY = ("""function size(){ const r=cv.getBoundingClientRect();
  const w=Math.max(1,Math.round(r.width)), h=Math.max(1,Math.ceil(r.height));
  cv.width=w; cv.height=h; }""")
    NEW_V224_BODY = NEW.split('*/\n', 1)[1]
    if MARK in blob:
        # UPGRADE IN PLACE. The first cut of V224 clamped a missing layout box to 1x1,
        # which locks the board at one pixel for ever (size() runs once at 30 ms and
        # then only on resize, and an iframe that never resizes never gets a second
        # chance). Measured on a real fight frame: ready true, phase cover, 13 ground
        # kinds decoded, board 1x1, nothing painted.
        if OLD_V224_BODY in blob:
            blob = sub(blob, OLD_V224_BODY, NEW_V224_BODY, 'blob/size() zero-box guard')
            parse_check(blob, 'the fight blob')
            enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
            alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                                  "const COMBAT_B64='" + enc + "'", 1)
            open(ALPHA, 'w', encoding='utf-8').write(alpha)
            print('V224 upgraded in place: size() no longer accepts a zero box')
            return
        print('  the fight already renders like the street')
        return
    if '__THE_PERSON_IS_112__' not in blob:
        sys.exit('GUARD: V223 is not in this blob; V224 is written on top of it')
    blob = sub(blob, OLD, NEW, 'blob/the board canvas size')
    blob = sub(blob, OLD_FRAME, NEW_FRAME, 'blob/the auto frame margins')

    code = re.sub(r'/\*.*?\*/', '', blob, flags=re.S)
    # ONE SIZING RULE, AND IT IS THE STREET'S. A second devicePixelRatio multiply on
    # the board canvas is the whole defect coming back.
    if re.search(r'cv\.width\s*=\s*r\.width\s*\*', code):
        sys.exit('GUARD: the board canvas still multiplies its CSS width')
    # A BOARD WITH NO BOX IS NEVER LOCKED IN. Measured: a 1x1 board paints nothing and
    # still reports a plausible tile, which is the hardest kind of broken to see.
    if 'if(!(w>0&&h>0)){ setTimeout(size,60); return; }' not in code:
        sys.exit('GUARD: size() still accepts a zero box')
    # THE CAMERA'S MARGINS ARE NO LONGER RAW CANVAS PIXELS.
    if re.search(r'_pad\s*=\s*G\.isTouch\?96:44', code):
        sys.exit('GUARD: the auto frame still measures its margin in canvas pixels')
    if '_k=Math.max(1,cv.width/' not in code:
        sys.exit('GUARD: the auto frame does not convert its margin through the canvas')
    if code.count('function size()') != 1:
        sys.exit('GUARD: size() is defined %d times, expected 1' % code.count('function size()'))
    parse_check(blob, 'the fight blob')
    enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
    alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                          "const COMBAT_B64='" + enc + "'", 1)
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('V224 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
