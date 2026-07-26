# BOHEMIA ADDENDUM — A CLIP IS A SET OF FROZEN POSES (Paolo 7/26/26, LOCKED)
# ZERO MORPHING, and it is structural rather than measured

Paolo: "Do whatever you want... you need to be smarter than me when it comes to
coding an animation, you can't just keep being a yes man. Do one more round of big
brain research if you need and then show me an example of a couple animations
where there's just zero morphing. I'm tired of it."

## THE MISTAKE IN ALL FOURTEEN EARLIER ATTEMPTS

Every one of them still RECOMPUTED the body every frame. Retire the invented
passes, snap the arm angles, give each part its own canvas, rebind the shading
four different ways — the inverse sampler still ran at 24 slightly-different poses
per clip, and slightly-different input to a resampler means different pixels.

**Pixel art cannot stop morphing while it is being recalculated 24 times a
cycle.** That sentence is the whole lesson of the day and it took fourteen losses
to earn it.

## THE LAW

A clip is a SMALL SET OF FROZEN POSES, and every frame of a hold is the SAME
FRAME, not a fresh recomputation that ought to match.

1. Every joint is resolved across the whole clip with HYSTERESIS ON POSITION:
   stay where you are unless you have moved more than the tolerance, then snap to
   whole pixels. Resolved twice so the loop point agrees with itself.
2. Each resolved pose gets a SIGNATURE, and `buildFrameCached` keys on that
   signature instead of the phase index. So consecutive frames of a hold are ONE
   cache entry, i.e. literally the same pixels.
3. Therefore zero morphing during a hold is a PROPERTY OF THE CONSTRUCTION. There
   is nothing to differ because nothing is recomputed. It is not a number we got
   lucky on.

### A FRAME COUNT, NOT A THRESHOLD

An animator does not pick a pixel tolerance, they pick how many frames the cycle
is drawn on — a walk is 8 frames whether the character is strolling or sprinting.
A fixed tolerance cannot do that, and measured it failed both ways: 1.6px left RUN
on 20 poses (fast motion, almost no holds, so almost nothing protected) and
collapsed IDLE to 1 pose (a statue, because idle's motion is sub-pixel). So the
tolerance is SOLVED FOR per clip by bisection to land the pose count in
`POSEHOLD.target` = [6,9]. Deterministic, cached per (direction, clip), and
thrown away by `rebuildFromRig` on any rig edit or slider move.

## THE CLOTHING CAME ALONG FOR FREE

He asked for that specifically. The freeze happens at the POSE, upstream of
everything — body, garments, hair, the anatomy line, the far-arm read, all of it is
built from one frozen pose, so every layer holds still together. **Zero garment
work was required, and the measurement is identical dressed and naked.**

## MEASURED, ON THE REAL SURFACE

MORPH is defined the only way that is fair: a pixel that changes on a frame where
the POSE DID NOT CHANGE. A pose change is animation and is excluded.

    clip        morph pixels during holds        drawn poses
                before          ->    after     per clip
    E/walk       1,407 (14 frames)  ->    0          6
    W/walk       1,487 (14 frames)  ->    0          6
    E/run        2,128 (12 frames)  ->    0          9
    E/idle           0 ( 0 frames)  ->    0          2
    E/dance      1,807 (14 frames)  ->    0          6
    W/drunk      1,466 (14 frames)  ->    0          9

Also verified across 30 clips x E/W x 24 phases: **1,064 held frame pairs, zero
pixels changed, dressed and naked.**

Proof sheets he can look at, three rows each (the frames / before / after, red =
morph, green = a deliberate pose step): `records/zeromorph/`.

## THE FIRST VERSION WAS REJECTED ON SIGHT, AND HE WAS RIGHT

Paolo, after playing it: "it didn't really look that different. The difference is
the arms aren't moving for a lot of the animations."

Measured hand travel per cycle, holds off -> on, on the first version:

    walk   29.8 -> 0.0   (-100%)   the hands do not move AT ALL
    run    43.4 -> 6.5   ( -85%)
    drunk  22.6 -> 5.6   ( -75%)
    dance  32.0 -> 9.4   ( -71%)
    greet  41.5 -> 26.2  ( -37%)
    throw  41.5 -> 29.4  ( -29%)

Zero morphing had been bought with dead arms. That is a WORSE build, not a better
one, and no morph metric was ever going to reveal it -- a frozen limb is perfectly
non-morphing. He caught it in seconds by looking.

### THE RULE THAT CAUSED IT, NAMED SO NOBODY WRITES IT AGAIN

Both holds said **"STAY PUT UNLESS YOU HAVE MOVED MORE THAN X"**. That rule LAGS
by construction: the pose only updates after the motion has already gone past, so
the swing reverses before the last step ever fires and the extremes are clipped
off. Solving the tolerance for a pose count made it worse, because a big swing
earns a big tolerance -- which is exactly why WALK, with the widest, cleanest arm
swing in the set, lost all of it.

**Never write a stay-put hold for animation.** It cannot reach an extreme.

### WHAT REPLACED IT: KEY THE EXTREMES, THEN HOLD

How animators actually work, and it costs nothing in morph:

1. every phase where a hand REVERSES DIRECTION is a key, always. Those are the
   ends of the swing, and drawing them verbatim is what preserves amplitude.
2. fill to the target count by EQUAL ARC LENGTH along the pose trajectory, so
   keys land where the motion actually is: detail in fast passages, holds in slow
   ones.
3. every frame snaps to its NEAREST key, never the previous one. **Nearest cannot
   lag; previous always does.** That one word is the whole fix.

    keys   hand travel kept   poses/clip   morph pixels during holds
      8          80%             6.3                0
     10          85%             7.5                0
     12          89%             8.3                0     <-- SHIPPED
     14          91%             9.7                0

Zero morph at EVERY key count, so amplitude and zero-morph were never in tension.
The stay-put rule was simply the wrong way to get the second one. Shipped at 12
keys: 89% of the swing kept, ~8 drawn poses per clip, which is a textbook cycle.

ARMHOLD (the arm-angle bucketing, hysteresis 2.0) is SUPERSEDED and switched off:
it was the same stay-put rule one level down and it clipped the swing too.

## WHAT IS LEFT IS ANIMATION, NOT MORPHING

The picture now changes ONLY on the frames where the pose steps. That is a drawn
pose change, which is what pixel art animation IS — a classic walk cycle is 4 to 8
drawn frames. It is also the 120 BPM LAW finally applied to the character, which
every other system in the game already obeyed.

WHAT HE STILL HAS TO JUDGE, and no number can answer it: whether the stepping
reads as clean animation or as chop. That is his eye, and it is the one open
question this leaves.

## WHAT THIS DOES NOT FIX

THE BODY SLIDERS. He named them in the same breath and they are a SEPARATE defect
with a separate cause: height warps the skeleton and belly/arms RESHAPE his rest
pixels by resampling them. So the art is destroyed once to make a wide body and
the frozen pose then holds that damage perfectly still. Holding a bad shape still
does not make it a good shape. The slider fix is the swap-not-stretch rule from
the 7/26 architecture answer — a dial picks between AUTHORED bodies, or moves
parts by whole pixels; it never scales or warps a bitmap. That needs authored body
variants, which is art, which is [PENDING Paolo].

Tool: `tools/bohemia_pose_hold_patch.py` (idempotent).
Proof: `tools/bohemia_zero_morph_proof.js` -> `records/BOHEMIA_ZERO_MORPH_PROOF_7_26_26.txt`.
Gate: `gates/frozen_poses_gate.js`.
