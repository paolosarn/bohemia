# THE COAT IS TIED TO THE LEGS
ANIMATION lane, 9/12/26. VAMILY row `[coat follows] THE-COAT-IS-TIED-TO-THE-LEGS`.

## THE RULING
Paolo 9/7, thumbing the clip list with the trenchcoat on:

> "the trenchcoat, as will be the nature for any long jackets and coats, has to be
> done a lot better; it's glitching and popping out of place; tie it more to the
> legs, it feels like it's freestyling where to go."

Two complaints in one sentence, and they turned out to be two separate defects in
`genCoat`. "Freestyling where to go" is the skirt not knowing where the legs are.
"Glitching and popping out of place" is the skirt changing width between two
frames for no reason in the body.

## HOW IT WAS MEASURED
On the real rig only: `buildFrame` posed grids, the walk clip, all eight facings,
all 24 buckets. NOT on the gate mannequin. A mannequin has no stride and no
swinging arm, so it cannot show either defect -- and in fact the frozen-pixel
hashes in CLOTHES 4X came back 1744/1744 unchanged after this shipped, which is
the proof that a mannequin is blind to it and that nothing DIRECTION approved on
the reference body moved.

The first ruler wrote down 1036 "orphan rows" -- coat rows with no leg anywhere on
them -- and called them a defect. Looking at the picture killed that number in one
read: the upper skirt covers the HIP, where there is no leg by definition, and 32
of the ~60 coat rows per frame are up there. A coat above the thigh is not a coat
in the wrong place. The number went in the bin, not in the fix.

## DEFECT ONE: THE SKIRT NEVER LOOKED AT A LEG
The skirt was an A-line cone about `cx`, the TORSO's pixel centroid, running from
the torso's bottom row to the hem. It consulted the legs exactly once, for where
to stop (`hemY`), and never for where to be. On a stride the legs open wider than
a hip-width cone, so the coat ran in the GAP BETWEEN TWO THIGHS with a whole thigh
outside it on each side.

    leg pixels sitting OUTSIDE the coat's span, on rows the coat covers
      before   12.21%   worst facing NE/NW 22-23%   worst single row 16 px
      after     3.92%   worst facing SE     6.5%    worst single row  9 px

The fix is a rig rule, not a trenchcoat patch: a new helper `legSpan(g)` hands any
generator the leg extent on every row, and the skirt's row loop reaches out to
whichever leg swung. The reach RELAXES toward the hem (`1 - 0.30*t^2`) so the lower
leg still comes out at the edge instead of the coat swallowing the boot, and it is
CAPPED at `halfW + 6*S` so a wide stride bells the skirt instead of pitching a tent
(widest coat row over widest body row: 1.19 with the cap, 1.56 without).

### WHAT WAS BUILT AND THEN CUT
The first cut also blended the panel's CENTRE toward the leg mass as it fell. It
was measured and removed: with the reach already in, the centre blend took spill
from 4.07% to 3.93%, a seventh of a percent, and it made the head-on coat track the
legs WORSE (correlation -0.93 to -0.95). In a stride the two legs' AVERAGE barely
moves while their EDGES do, so a centre that chases the average is chasing a number
that is not going anywhere. Code that measures the same with and without it does
not ship -- the same call as the dead LOCK clamp on 9/11. The front opening stays
on the sternum, which is where a real coat's opening is.

## DEFECT TWO: THE HIP WAS A SCANLINE, AND THAT WAS THE POPPING
`halfW`, the skirt's base width, came from the torso's extent on exactly ONE row:
its last one. And the torso is not what is visible there. Whichever arm is swinging
covers part of that row and uncovers a sliver of torso past it, so:

    facing you, walking, two CONSECUTIVE frames
      bucket 13   torso visible at the hip row: x 53-56    hip read  4 px
      bucket 14   torso visible at the hip row: x 53-55 and 65-67, hand at 56-64
                                                          hip read 14 px

The body did not move. The measurement did. `halfW` snapped 6 -> 9 and the whole
skirt changed width three pixels a side, twice a beat.

    the coat's worst single-frame change, as a share of its own area, facing you
      before  30.8%   while the BODY changed 9.7%   (2.3x harder than the man in it)
      after   17.9%   same body number

A hip is the torso's TYPICAL width, so measure it that way: area over height. Six
estimators were measured across all eight facings and all 24 buckets first --

    estimator              worst frame-to-frame jump    mean width
    one row (the old one)            10 px                13.1
    widest row of a bottom band       9 px                17.2
    union of the whole torso          6 px                23.2
    union of the lower half           8 px                16.5
    widest unoccluded row            25 px                 9.6
    AREA OVER HEIGHT                  4 px                14.3

-- and area over height is the only one that is both stable AND still the body's
own width: 14.3 px against the old scanline's 13.1 on the real rig, and 8 against
its 7 on the gates' mannequin. No scale factor, no fudge. The garments keep the
width DIRECTION approved and lose only the snapping.

## THE GATE
`gates/coat_tied_to_the_legs_gate.js`, in the suite as COAT ON LEGS. Ten claims:
the helpers exist; the skirt row loop actually ASKS `legSpan` (a helper nothing
calls is not a fix); the width comes from area over height and the old scanline is
gone; every frame builds; spill overall <= 7%; worst facing <= 12%; worst row <= 12
px; the tent ceiling 1.30; the pop ceiling 22% facing you; and a CONTROL that runs
the same spill ruler over a VEST, which has no skirt, and must find 60%+ of leg
pixels outside it -- a ruler that scores the vest like the coat is measuring the
body, not the garment.

Five mutations, all caught:
  M1 the skirt stops asking where the legs are   -> 3 claims red (10.03%, 17.1%, 13 px)
  M2 the hip goes back to one scanline           -> 2 claims red (code claim, 27% pop)
  M3 the reach loses its cap                     -> 1 claim red (tent 1.56)
  M4 the vest grows a skirt                      -> 1 claim red (control falls to 4.1%)
  M5 legSpan is never built (LD = null)          -> 3 claims red (code claim, throws, control)

The hip claim is deliberately a CODE claim. A gate that recomputes the hip itself
and then checks its own arithmetic is testing the gate, not the game -- that mistake
was made three times on the judge-list rulers on 9/5. The DATA claim for that fix
is the pop ceiling, and M2 proves it bites.

## WHAT IT TOUCHES
`genCoat` is the whole long-jacket family: coat, trench, duster, longcoat, jacket,
vest, wrap, asym, cocoon, comma, split-tail. Every one of them gets this. The
runway shapes are untouched and RUNWAY GATE stays 82/82: the cocoon still narrows
to the hem, the asym hem still slants, the comma still hangs lower behind, the
back vent still splits.

`genCape`'s back drape was measured too, since it is the other garment long enough
to cover a striding leg: 0% spill on N and NE, 0.1% on NW. It is already a wide
panel and has nothing to fix. It was left alone rather than touched for symmetry.

## WHERE HE SEES IT
Tab: CHARACTER (put any long coat on and walk it) and ANIMATION. The walked city
still draws no bodies, so no garment reaches that surface yet -- that is RUN and
LIFE+CITY's row, not this one.

## STILL OPEN AFTER THIS
The collar's top row still steps two rows between poses facing you. That is the
body's own walk bob and the collar following it is correct, so it was measured and
left. Nothing pending Paolo.

## WHAT THE GATE RUN SAID, AND THE ONE RED THAT WAS MINE
The full suite could not finish: it hit its 2700s budget with 331 of 603 gates
NEVER RUN, this lane's entire set among them. That is arithmetic, not slowness --
at the 13.5s a gate it measured, 603 gates need ~8100s -- and the suite prints the
shard command itself. So the 52 gates that can see a coat change were run by name
instead: every one that draws a dressed body, a face, a haircut, a crowd or a clip.
44 green, 7 red. All seven were then re-run against a clean checkout of main:

    MOTION VISIBLE   red on clean main too   not mine
    RIG CHECK        red on clean main too   not mine
    FIELD SURGERY    red on clean main too   not mine
    OUTFITS 13       red on clean main too   not mine (and BETTER with this in:
                                             faction outline spread 0.070 -> 0.072)
    CAST SHAPES      red on clean main too   not mine (and BETTER with this in:
                                             cast variety 0.079 -> 0.084, floor 0.085)
    CITY CAST        red on clean main too   not mine
    VALLEY BREATHES  GREEN on clean main     MINE, and it was a FLAKE

VALLEY BREATHES is this lane's own gate from 9/5. It failed, then passed, then
failed again on the SAME TREE with nothing changed between the runs, which is the
definition of a ruler that is not a ruler. The cause: the claim sampled 2.2s of no
input and demanded 3 renders. The heartbeat is one beat per 500ms so 2.2s expects
4 -- but the heartbeat deliberately SKIPS a beat while ANIM is in flight, and a
camera tween landing inside the sample took it to 2.

Fixed by making the window LONGER, not the floor lower: 4.4s expects 8 and the
floor is 4, so the beat can be blocked half the time and the claim still holds,
while a dead valley -- 1 render, which is what it measured before the heartbeat
shipped -- is still four times under it. Four consecutive green runs, and with the
heartbeat disabled it reports 0 renders and goes red, so it still bites.
