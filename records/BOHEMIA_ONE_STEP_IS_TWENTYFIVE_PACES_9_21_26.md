# ONE STEP IS TWENTY-FIVE PACES, AND THE LEGS DO ONE
ANIMATION lane, rule 18 HOLD round. Nothing pushed to the alpha.
This lane's part of WALKING, measured into the handoff as the MODE line asks.

## WHAT RULE 18 ASKS OF THIS LANE
WALKING: "one walking camera where a house fits, the body one fixed size that never
changes while he walks or pinches, **a stride that lands on the next standable place
toward the press**". The camera and the body size were measured last round. **The
stride had not been.** It is this lane's, and it is the thing he is looking at when
he walks.

## THE STEP IS NOW A WHOLE HOUSE, AND THAT IS CORRECT
`STEP_CELLS` reads **25** on the live surface. (The source still carries
`STEP_CELLS_QUARTER = 5` from the 9/15 part-one; the live value has moved past it, so
reading the source gives the wrong number -- it was read live.) A fine cell is 0.75 m,
so one press moves him:

    25 cells x 0.75 m = **18.75 metres**

That is rule 16 landed, exactly as he asked: one step is one house.

## BUT THE LEGS STILL WALK ONE PACE
Measured on the rig, along the facing axis, relative to the body: the walk clip
depicts a stride of **8 px facing the camera and 31 px in profile** (median 17.7),
on a body 98 px tall.

At HC 11, the one camera where a house fits a phone, the drawn body is 112 px and
the rig is 112 px, so rig pixels are screen pixels. One press moves him:

    dir | the body travels | the feet depict | feet cover | SKATE per step
      N |            275px |             8px |     **3%** |        267 px
     NE |          389px   |          14.8px |     **4%** |        374 px
      E |            275px |            31px |    **11%** |        244 px
     SE |          389px   |          17.7px |     **5%** |        371 px

**The feet cover 3% to 11% of the distance. The body skates 244 to 374 pixels every
single step**, on a phone screen that is 390 pixels wide. He crosses most of the
screen in one press while his legs do one small pace.

## AND IT CANNOT BE TUNED, BECAUSE THE NUMBERS ARE NOT CLOSE
A walking pace is about 0.75 m. So one press is **25 real paces**. At 120 BPM, one
step per beat, that is 18.75 m in 0.5 s:

    **37.5 metres per second. 135 km/h.** A person walks 1.4 m/s.

A stride long enough to depict it would be 2.5x the body's own height. There is no
tuning of a gait that covers 25 paces in one beat. **This is not a bad number in the
clip; it is a walk cycle being asked to depict something that is not a walk.**

So the honest options are:
1. the body plays MANY gait cycles across one press (about 25), so the legs read as
   covering the ground, or
2. the press is not a walk at all and needs its own motion.

Both are this lane's to build, and both are frozen until the cut holds. **Naming which
one is not a measurement, so it is not decided here.**

## AND THERE ARE TWO NUMBERS FOR A LOT, WHICH RULE 16 FORBIDS
While measuring, three lot figures are live at once:

    BOH_LATTICE.LOT_FINE  = 24 fine cells   (the lattice's lot)
    BODY_SCALE.lotFine    = 25 fine cells   ("measured median lot pitch")
    STEP_CELLS            = 25 fine cells   (what a press actually moves)

Rule 16's own words are "ONE NUMBER IN ONE PLACE... a second copy anywhere is the
bug." **There are two.** The step and the body agree at 25; the lattice says 24. It is
one cell, so nothing looks broken -- which is exactly why it will sit there. Named for
whoever owns the lattice; not touched, because it is not this lane's.

## WHAT THIS LANE HANDS THE THREE
- the walk clip's stride is **8 to 31 px** against a step that moves **275 to 389 px**;
- **the feet cover 3% to 11%** of the travel, skating 244 to 374 px per press;
- one press is **18.75 m, 25 real paces, 135 km/h** at one step per beat;
- no gait can depict that, so the press needs many cycles or a different motion;
- and there are **two live numbers for a lot**, 24 and 25.
