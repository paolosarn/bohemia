# EYES AND EARS -- [the far stop's pixels counted] -- ROUND ONE: SCHOOL
### 10/9/26 -- session eyes-5vql33

Row (rule 65a, from COOK 50b5eb1d's own measurement): count distinct painted pixels at the demo's
far stop, before and after RUN's [the far end at two million pixels], beside a Battle Brothers
far-zoom screenshot counted the same way. Premise checked on claim: RUN's row is still open (no
"after" yet) and reference/battle_brothers/ still does not exist (no real screenshot anywhere in
the repo). This round is research only, no measuring, per this lane's own two-round law.

## THE REAL PROBLEM HAS A NAME: NEAREST-NEIGHBOR UPSCALE DETECTION

What the row asks for -- "count unique colour runs per 2x2, or downsample until the image stops
changing" -- is not a method this lane has to invent. It is a simplified version of a real, named
field: digital image forensics for detecting resampling and upscaling, going back to Popescu and
Farid's foundational method (a residual signal pulled from the image, then checked for the periodic
correlations that an interpolation kernel leaves behind), later sped up by Kirchner's local linear
predictor. Mahdian and Saic's own paper covers resampling detection across interpolation KINDS
specifically, nearest-neighbor included, and the literature draws a real, useful line between them:
smooth kernels (bilinear, bicubic) leave behind faint periodic correlations in an image's second
derivative, which is why the heavy machinery (frequency-domain energy analysis, SVM classifiers)
exists -- that correlation is subtle and needs a real detector to find. NEAREST-NEIGHBOR UPSCALING
IS A DIFFERENT, SIMPLER CASE: it produces EXACT, solid, duplicated pixel blocks, not a faint
correlation, which is exactly why a block-matching or duplicate-detection approach (count unique
values per block, or downsample until nothing changes) is the CORRECT, matched tool for it, not a
cut corner. This matters for us directly: COOK's own measurement (50b5eb1d) already named our far
stop's method as "one flat colour plus ninety random rectangles" per cell, scaled up to fill the
glass -- that is nearest-neighbor-style block duplication, the exact case the row's proposed method
targets correctly. The heavier academic detectors built for bilinear/bicubic resampling would be
solving a problem we do not have; the simple method is not naive here, it is matched to the real
upscale kind in play.
[Robust Resampling Detection in Digital Images](https://dl.ifip.org/hal-01540903v1)
[Theoretical and empirical forensic detection limits in case of slight signal downsampling](https://informationsecurity.uibk.ac.at/theses/slight-downsampling-forensics)

## HOW THE BEST GAMES ACTUALLY DO IT: THE ANSWER IS MIPMAPPING, AND IT IS NOT A FANCY WORD FOR "MORE ART"

The row's other half asks how real games keep a far-out view detailed without one flat image
stretched to fill the screen. The real, converged computer-graphics answer, used everywhere, is
mipmapping: a texture is stored as a stack of pre-made, progressively smaller real copies (each
level typically half the width and height of the one before), and the renderer swaps to the level
that matches the current zoom instead of stretching the full-size source -- the GPU "picks the most
appropriate level based on how far away the object is from the camera," which is why a zoomed-out
view that DOES use mipmapping looks detailed at its own scale instead of blurry or blocky. A real
strategy-game engine bug report (SpringRTS) shows the same idea applied to an RTS ground map: the
engine does not generate the zoomed-out levels on the fly, a map compiler ASSEMBLES them ahead of
time, and the devs discuss letting mappers hand-supply each level rather than leaving it to one
auto-stretched source. This is the real shape of COOK's own proposal for the far stop (16 px tiles
for the families that genuinely tile, three seed-locked composited paintings for the families that
are structures bigger than a cell): precomputed, real detail at the zoom level that will actually be
seen, not a filter run on one small source image. That is mipmapping's own idea, independently
arrived at, which is the confirmation this round is for: COOK's plan is the industry-standard shape,
not an invented fix.
[Unity -- Introduction to texture mipmaps](https://docs.unity.cn/Components/texture-mipmaps-introduction.html)
[SpringRTS -- ground square texture mip levels](https://springrts.com/mantis/view.php?id=5262)

## THE MISSING PHOTO, RESOLVED FOR REAL, NOT JUST NAMED AGAIN

Checked whether a real Battle Brothers screenshot could be sourced any other way than a bare photo
pull. It cannot, and the reason is not a gap in this lane's effort: reference/library/battle_brothers/
01_WORLDMAP.md already carries a 9/28 sourced finding from DIRECTION's own [bb density] work, and its
last line says so plainly -- "icon, banner, road and hex sizes in pixels are NOT yet measured (the
sources were egress-blocked)." That is the exact same network wall that stopped COMBAT TWO's I-15
photo this same day (8db8c97: "network policy blocks photo hosts"). Two separate lanes, two separate
weeks, the same wall -- this is a structural, environment-wide block on fetching outside images, not
a research gap either lane failed to close. Round two does not need to keep hitting it.

WHAT CAN STAND IN, HONESTLY: that same sourced line already gives Battle Brothers' own rendering
method in its own words -- "hand-painted raster... rendered at the screen's native resolution with
separate UI-scale and scene-scale sliders. So: one painted pixel per screen pixel (2,073,600 on a
1080p screen)." By the nature of that method (real painted art at native resolution, never one small
source stretched by the engine), Battle Brothers' own "counted the same way" result is, by
construction, a full native fill minus whatever flat UI chrome sits over it -- there is no upscale
step in its own documented pipeline to produce duplicate blocks in the first place. Round two can
cite this sourced construction as Battle Brothers' side of the comparison (a floor of ~2,073,600 at
1080p, the same number rule 65a already uses) instead of a literal screenshot neither lane can fetch,
and spend the real counting instrument on OUR side, which is the side that actually has an upscale
step and actually needs checking.

## A SECOND, FREE CROSS-CHECK, NOT BUILT YET BUT WORTH LINING UP

Counting unique pixel values per block is the direct measure; a cheap second check comes for free
from something every lossless image format already does: a block of solid duplicated colour
compresses far smaller than a block of real painted detail, because lossless compression is bounded
by the image's own information content (Shannon entropy) -- a flat-filled upscale compresses hard, a
genuinely detailed hand-painted equivalent does not. Comparing PNG byte size per unit area between
our far stop and a same-size crop of real painted art (ours at close zoom, which already has real
art) costs nothing extra to compute and sanity-checks the pixel-count instrument without building a
second one.

## WHAT ROUND TWO BUILDS, ARMED BY THIS

1. The instrument: screenshot the demo's far stop at his phone's profile, count distinct painted
   pixels by the method this round confirmed is the matched one for our upscale kind (unique values
   per 2x2 block, or downsample until the image stops changing) -- not the heavier
   periodicity/frequency detectors, which solve a different (smooth-resampling) problem we do not
   have.
2. Post it as the "before," re-post as the "after" once RUN's [the far end at two million pixels]
   actually ships (checked first, still open).
3. For the Battle Brothers side: cite the already-sourced rendering fact (hand-painted, native
   resolution, no upscale step) as the real-world construction that makes its own floor
   ~2,073,600 at 1080p, naming plainly that a literal screenshot is blocked by the same wall that
   blocked COMBAT TWO's I-15 photo, not a gap in this round's research.
4. A free second check: PNG byte size per unit area, ours versus a same-size crop of our own close-
   zoom art, as a sanity cross-check on the pixel count, not a replacement for it.

## ROUTED

Nothing to route yet -- school round. The missing photo is confirmed structural (environment-wide
egress block), not any lane's unfinished work; nothing to chase there.

## SHIP TEST FOR THIS ROUND

The row's own proposed counting method is checked against a real, named field (resampling/upscale
forensics) and confirmed as the correctly-matched tool for our specific upscale kind (nearest-
neighbor block duplication), not a shortcut version of something fancier we actually need. The
row's "how do the best games do it" half is answered for real: mipmapping, sourced from a real
engine doc and a real strategy-game engine's own bug tracker, and COOK's existing plan already
matches that real shape independently. The missing-photo premise is resolved, not just re-flagged:
the same network wall that blocked the I-15 photo blocked DIRECTION's own Battle Brothers research
weeks earlier, and that same sourced record already gives a real, honest stand-in for Battle
Brothers' side of the comparison. NO MEASURING THIS ROUND, per the lane's own two-round law.
Round two next: the instrument, the before number, the after number once it exists.
