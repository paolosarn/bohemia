# BOHEMIA ADDENDUM — ONLY *TALLER* BREAKS THE BODY (measured 7/26/26)

Paolo has said twice that the body sliders look bad. Measured, that is TRUE OF
ONE HALF OF ONE DIAL, and the other two dials are clean. Invented pixels (on-screen
minus painted -- a rigid body cannot GAIN pixels, so anything above the canon
baseline is the renderer making art up), across 8 facings x idle+walk x 8 phases:

    dial          invented px    lone px %
    CANON              133         4.47%
    height +1          962         4.04%    <-- 7x the baseline
    height -1            8         4.20%
    belly  +1          161         4.61%
    belly  -1          145         4.83%
    arms   +1          174         4.34%
    arms   -1          154         4.61%

## WHY, AND WHY IT IS ONLY THAT ONE

BELLY and ARMS reshape the REST PIXELS by TRANSLATING them along whole rows
(`shiftPart`, `dx = Math.round(...)`). Integer translation is lossless -- his
pixels land somewhere else, unchanged, and the numbers confirm it: both dials sit
inside the canon baseline.

HEIGHT rides the SKELETON: it changes BONE LENGTH, and `seg()`'s WIDTH LAW scales
ALONG the bone. So a taller body is his art STRETCHED, and stretching pixel art
means the resampler must FILL rows that were never painted. That is the 962.

SHORTER is nearly free (8) because compressing only ever DROPS pixels, and
occlusion dropping pixels is legal. **Only growth invents.**

## THE CONSEQUENCE

This narrows "the sliders are broken" to a single, precise statement: *the body
may be made shorter, wider, thinner and thicker-armed losslessly; it may not be
made TALLER without inventing art.*

And it is the same root cause as the whole animation fight this session: you
cannot resample pixel art without damaging it. Belly and arms avoid it by
translating. Height cannot, because there is no way to make a 40px leg into a
44px leg by moving pixels -- four rows have to come from somewhere.

## WHAT IT WOULD TAKE, and it is Paolo's call

1. **SWAP, DO NOT STRETCH** (the 7/26 architecture answer, still the
   recommendation): a TALL body is a body he DRAWS, and the dial picks between
   authored builds instead of stretching one. Lossless by construction.
2. **ROW REPEAT instead of bone stretch**: lengthen a limb by duplicating one of
   its OWN painted rows at a chosen seam, rather than resampling the whole limb.
   Far less damaging than a stretch and it uses only his pixels, but it is still
   duplication and the seam row is a decision only he should make.
3. **CAP THE DIAL AT ZERO** so the body can only get shorter, never taller, until
   1 or 2 exists. Ugly but honest, and it is one line.

NOT DONE, deliberately: nothing here was changed. Every option costs either his
art or half his dial, and STOP PRODUCING says a frozen decision is his, not mine
to guess at while he is asleep.

Gate: `gates/only_taller_breaks_gate.js` -- ratchets the three clean dials so they
can never quietly start inventing too, and pins the tall-body number so a future
change has to either improve it or admit it made it worse.
