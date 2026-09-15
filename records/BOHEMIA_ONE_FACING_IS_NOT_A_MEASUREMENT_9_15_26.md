# ONE FACING IS NOT A MEASUREMENT
ANIMATION lane, 9/15/26. VAMILY row `[redo killed]`, round seven.
Beat three of his headshot spec, two dead hypotheses, and a correction I owe on my
own last round.

## THE CORRECTION FIRST
Last round I shipped a claim that read **"BEAT FOUR LANDS"**. It came from a gate
that called `hsReset('S')` and nothing else. Swept across all eight facings, beat
four is **16.8px on S and about -0.9 on the other seven**. The claim was true on
one facing out of eight and I had not looked at the rest. It now reads "BEAT FOUR
LANDS ON S" and names how many facings it holds on.

That is the same shape as every ruler bug in this clip: **the ruler measured
something smaller than the thing it named.** Fifth of this session.

## WHAT THE EIGHT FACINGS ACTUALLY SAY
    dir | b1 head/waist | b2 knee peak -> end | b3 body/hand (lag%) | b4 arms in
      N |      10.8/6.4 |           102 -> 10 |          24/3 (88%) |        2
     NE |      10.8/6.4 |           121 -> 22 |       19/-19 (200%) |     -0.3
      E |      11.2/5.4 |          142 -> 144 |          15/9 (40%) |     -0.2
     SE |        10/3.2 |            80 -> 30 |          13/5 (62%) |      0.5
      S |        10/4.1 |             38 -> 5 |         12/10 (17%) |       16
     SW |        10/4.1 |             37 -> 0 |          12/5 (58%) |     -0.9
      W |      20.6/5.8 |          159 -> 130 |          26/8 (69%) |      0.6
     NW |      10.8/5.8 |           101 -> 27 |       21/-17 (181%) |     -0.3

**Beat one holds on 8 of 8** -- last round's work, now verified across facings
instead of assumed. **Beat four holds on 1 of 8.** Beat two's knee peak runs 37 to
159 degrees. Beat three's hand lag runs 17% to 200%. The same clip is a different
animation depending only on which way he was knocked.

## TWO HYPOTHESES FOR BEAT THREE, BOTH KILLED BY MEASUREMENT, NEITHER SHIPPED
**1. A BONE COLLAPSING.** The sim shoulder-to-hand distance on W drops to 0.9px on
a 32px arm, and the RIGID LIMB LAW re-extends to rest length in whatever direction
is left -- which is the one-pixel-vector bug already found once this session.
MEASURED across 8 facings x 240 frames x 14 bones = 26,880 bone-frames: **no bone
goes below 60% of rest, 0 under a quarter, 0 under a tenth.** The 0.9px was the
shoulder-to-HAND distance with a fully folded elbow, which is anatomy, not a bone.
Dead.

**2. THE KNOCK PROJECTION.** The projection is `[R0 + du*K0, R1 + du*K1 + dv]`, so
a backward lag in sim x should turn into screen y through `du*K1`, positive on the
north facings and negative on the south ones -- which would make the same physical
lag read as "the arms hold up" on three facings and "the arms ride down" on three
others. MEASURED: **the sim backward lag is 2.7px at most and its screen term is
0.1px**, and the two-term split misses the real screen motion **by 31.6px**. It
misses because the RIGID LIMB LAW and the TRACKING CAMERA both run after the
projection and both move joints, so `sk` is not the projection's output. Dead.

Both were written up only as dead ends. Neither reached the rig.

## WHAT IS TRUE ABOUT BEAT THREE
**The arm's inertia is real and large in the sim**: across his window the shoulder
drops 19px and the hand drops 7.6px, a 60% lag, and the arm swings 200 to 247
degrees against the spine. The mechanism his beat asks for EXISTS. It is the
delivery to the screen that fails, and its cause is still open.

## TWO KNOBS THAT DO NOT REACH, AND NEITHER SHIPPED
- **Hand and elbow damping inside his window**, swept 0.38 down to 0.05 (a 7x
  change to a value deliberately set as v1's "subtle linger"): worst facing goes
  17% -> 27%, S goes 12/10 -> 11/8. Rendered side by side at 0.38, 0.22, 0.15 and
  0.05, the four rows are nearly indistinguishable.
- **Rotating the whole rendered arm about the shoulder** to resist the shoulder's
  screen-downward travel, the same trick that built beat one: moves the hand
  **3.16px at most**, and the decay profile cancels it exactly when the drop peaks.

A 7x parameter change that is invisible on screen is not a mechanism, it is a knob
that does not reach. Tuning either would have been chasing the gate's number
instead of what he sees, so both were deleted.

## THE GATE
`gates/his_four_beats_gate.js`, FOUR BEATS, now sweeps **all eight facings** and
prints every beat on every one. Two new claims, both mutation-proved:
- the eight are swept at all (collapsing DIRS to one facing goes red, 3 claims);
- **the eight are genuinely eight DIFFERENT runs.** The first cut of the sweep
  reset to each facing and then posed a hardcoded `'S'`; `hsPose` re-resets
  whenever the key differs, so all eight rows came back byte-identical and the
  gate cheerfully called that eight facings. A COUNT OF FACINGS IS NOT A SWEEP.
  The claim compares distinct results, and it catches exactly the bug I made.

It also PRINTS both dead hypotheses every run, so nobody spends another round on
them.
