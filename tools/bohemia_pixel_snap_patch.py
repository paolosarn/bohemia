#!/usr/bin/env python3
"""BOHEMIA PIXEL SNAP PATCH (8/6/26, CHARACTER lane) -- the 7/29 snap sized the
WRONG BOX, so every character canvas is STILL fractional and the gate has been
certifying it green for eight days.

------------------------------------------------------------------------------
WHAT 7/29 DID, AND WHY IT LOOKED FINISHED

Paolo, 7/29: "make those fixes then make those fixes forever please". A session
sized every character canvas to a tidy multiple of its backing store -- #charCv
336, .g8c 112, #portraitCv 128, .cloBig 168, .cloCv 56 -- and wired
canvas_scale_gate.js to assert those ratios forever. The gate has been green
every run since.

THE GATE WAS ASSERTING ON THE BORDER BOX. The audit divides
getBoundingClientRect().width by the backing store, and that rect is the BORDER
box. This alpha sets `*{box-sizing:border-box}` globally and every one of these
canvases carries a 1-2px border, so a declared 336 means the bitmap is scaled
into 334. Measured on a real iPhone-portrait DPR-3 browser, on the CONTENT box:

    #charCv     112 backing -> 334 content   css x2.9821   glass x8.9464
    #portraitCv  64 backing -> 124 content   css x1.9375   glass x5.8125
    .cloBig      56 backing -> 166 content   css x2.9643   glass x8.8929
    .cloCv       56 backing ->  52 content   css x0.9286   glass x2.7857
    .g8c        112 backing -> 110 content   css x0.9821   glass x2.9464
    hair tiles  112 backing ->  64 content   css x0.5714   glass x1.7143
    hair spin   112 backing -> 168 content   css x1.5000   glass x4.5000

NOT ONE IS A WHOLE NUMBER. Every one is *nearly* right, which is worse than
being obviously wrong, because near-integer nearest-neighbour is exactly the
case that produces one anomalous pixel column every N -- a single 10px-wide
column in a sprite of 9px columns. A fully wrong ratio at least looks wrong.

`image-rendering:pixelated` is set on all of them, so nothing is blurred. It is
UNEVEN, and a body absorbs that while hair cannot: hair is one- and two-pixel
strands, and a strand 9px wide here and 10px there is a wobbly line.

AND THE TWO WORST ARE BOTH HAIR SURFACES:

    the hair PICKER tiles at glass x1.7143 -- a source pixel is ONE device pixel
    here and TWO right beside it, on the tiles used to choose a hairstyle
    the hair SPIN bar at glass x4.5000 -- dead half-pixel, so every other source
    column is doubled, on the bar built specifically to judge hair in 8 facings

He said, 8/2, in caps: "THE HEAIRSTYLES EAST AND WEST ARE STILL DOGSHIT LIKE
CMON MAN. LIKE ALL OF THEM FR. AND IN THE UI THEY ARE SO FUCKING TINY I CANT
TELL SHIT". Three rounds of verdicts said a version of that and I answered all
three by redrawing hair pixels. I never measured the box the hair was shown in.

THIS DOES NOT MAKE THE VERDICTS WRONG -- what he saw WAS bad and killing it was
correct. It makes the FIX wrong. And the 7/29 session and I made the same
mistake in two different ways: it fixed the surface without checking the
measurement, I redrew the art without checking the surface. VERIFY ON THE REAL
SURFACE means the surface the pixels actually land in.

------------------------------------------------------------------------------
THE RULE

    CONTENT box = backing store x an INTEGER

Content, not declared. Under border-box every declared width must carry its own
border: a 336 content box with a 1px border is declared 338, not 336. That one
correction is the whole patch for the five 7/29 canvases -- their target sizes
were right, only the box they were applied to was wrong.

    #charCv/#animCv   336 declared -> 338   (content 336, glass x9)
    .g8c              112 declared -> 114   (content 112, glass x3)
    #portraitCv       128 declared -> 132   (content 128, glass x6)
    .cloBig           168 declared -> 170   (content 168, glass x9)
    .cloCv             56 declared ->  60   (content  56, glass x3)

.cloCv HAD A SECOND BUG, found while measuring: `.cloCv{border:1px}` against
`.cloCv.on{border:2px}`. Under border-box that means SELECTING A FACING SHRINKS
ITS SPRITE, 54 content px to 52, and resamples the whole thumbnail at the moment
you tap it. Fixed by giving it 2px in BOTH states and changing only the colour,
which is all the selected state was ever trying to say.

THE TWO HAIR SURFACES are not border-box bugs, they are wrong ratios:

    hair picker tile   66 declared ->  114   (content 112, glass x3)
    hair spin shot    px3 x3 of 56 -> x2 of the BACKING (glass x6)

The spin bar sized itself as `56 * 3` on the assumption the backing is 56. It is
56 in SD and 112 in HD, because drawChar Scale2x's -- so in HD the real ratio was
168/112 = x1.5. Sizing off `out.width` instead of a hardcoded 56 is correct in
BOTH modes and cannot drift again when the HD toggle moves. Both hair surfaces
also get bigger, which is a consequence of rounding to the nearest legal size and
not a redesign -- but it does answer "SO FUCKING TINY" for free.

WHY MULTIPLES OF 112 AND NOT 56 for #charCv and .g8c: drawChar RESIZES its own
canvas, 56 in SD and 112 in HD, so the backing store changes under a fixed CSS
box when the HD toggle flips. A multiple of 112 is automatically a multiple of
56, so both modes land integer. The wardrobe canvases go through renderTo(),
which never Scale2x's, so they are always 56 and only need multiples of 56.

------------------------------------------------------------------------------
NOT TOUCHED, ON PURPOSE

Combat (#cv x0.5, logobig x0.624) and city (modeFace x1.25). Fractional too, and
NOT MINE -- ONE SYSTEM, ONE SESSION. Their numbers stay filed under their lanes.
The city overview is APPROVED as-is with its own gate locking that direction, so
a blanket "fix every canvas" sweep would break a surface Paolo signed off on.

    python3 tools/bohemia_pixel_snap_patch.py
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

# (label, exact old substring, new substring). Exact-match, exactly once: a patch
# that silently matches nothing is how a "fix" ships without being applied, which
# is the neighbouring failure to the one this file exists to correct.
EDITS = [
    ('#charCv/#animCv declared 336 -> 338 (content 336, glass x9)',
     "border:1px solid #241c12;width:336px;max-width:92vw;height:auto}",
     "border:1px solid #241c12;width:338px;max-width:92vw;height:auto}"),

    ('.g8c declared 112 -> 114 (content 112, glass x3) — the ALL-8 gallery',
     ".g8c{display:block;width:112px;height:auto;",
     ".g8c{display:block;width:114px;height:auto;"),

    ('#portraitCv declared 128 -> 132 (content 128, glass x6)',
     "display:block;cursor:pointer;width:128px;height:128px}",
     "display:block;cursor:pointer;width:132px;height:132px;image-rendering:pixelated}"),

    ('.cloBig declared 168 -> 170 (content 168, glass x9)',
     "#p-clothes .cloBig{width:168px;height:168px;",
     "#p-clothes .cloBig{width:170px;height:170px;"),

    ('.cloCv declared 56 -> 60 with a 2px border in BOTH states (content 56, glass x3)',
     "#p-clothes .cloCv{width:56px;height:56px;image-rendering:pixelated;background:"
     "linear-gradient(#383646,#262430);border:1px solid #241c12;",
     "#p-clothes .cloCv{width:60px;height:60px;image-rendering:pixelated;background:"
     "linear-gradient(#383646,#262430);border:2px solid #241c12;"),

    ('.cloCv.on keeps the 2px border and only changes colour, so selecting a '
     'facing no longer resizes and resamples the thumbnail',
     "#p-clothes .cloCv.on{border:2px solid #b39ddb;",
     "#p-clothes .cloCv.on{border-color:#b39ddb;"),

    ('hair picker tile declared 66 -> 114 (content 112, glass x3) — was x1.7143, '
     'one device pixel here and two beside it, on the tiles used to pick a hairstyle',
     "width:66px;height:66px;image-rendering:pixelated;background:#141118;border:1px solid #241c12",
     "width:114px;height:114px;image-rendering:pixelated;background:#141118;border:1px solid #241c12"),

    ('hair spin shot sizes off the REAL backing store instead of a hardcoded 56 — '
     'drawChar Scale2x\'s to 112 in HD, so "56*3" was really x1.5 (glass x4.5)',
     "out.style.cssText = 'width:' + (56*px3) + 'px;height:' + (30*px3) +",
     "out.style.cssText = 'width:' + (out.width*2) + 'px;height:' + (out.height*2) +"),
]

alpha = open(ALPHA, encoding='utf8').read()
before = alpha
applied, missed = [], []

for label, old, new in EDITS:
    if new in alpha and old not in alpha:
        applied.append('(already) ' + label)
        continue
    n = alpha.count(old)
    if n != 1:
        missed.append('%s — expected exactly 1 match, found %d' % (label, n))
        continue
    alpha = alpha.replace(old, new, 1)
    applied.append(label)

for line in applied:
    print('  ok   ' + line)
for line in missed:
    print('  MISS ' + line)

if missed:
    print('PIXEL SNAP: refused to write — %d edit(s) did not match exactly once' % len(missed))
    sys.exit(1)

if alpha != before:
    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('PIXEL SNAP: %d edits applied to %s' % (len(applied), ALPHA))
else:
    print('PIXEL SNAP: already applied, nothing to write')
