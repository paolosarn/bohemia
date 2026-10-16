# MY GLITCH LIST WAS MOSTLY WRONG (8/15/26, WORLD lane)

Last turn I handed over a confident list of three glitches. I then measured all
three. **Two do not exist and the third is not what I called it.**

## 1. "Thin poles poke out below the ground plate" — NOT REAL

I said this about warehouse, storage, library and courthouse. Two independent
measurements across all 60 heroes:

- **geometry below z=0:** 6 heroes have any, and they are `wash`, `waterpark`,
  `apartment`, `landfill`, `watertreat`, `golf` — **none of the four I named.**
- **geometry hanging off the ground pad's footprint:** exactly **1 of 60**, and
  it is `freeway`.

What I was looking at is almost certainly correct isometric projection: a tall
thin object standing at the pad's NEAR corner draws downward past the visual
bottom of the pad, because that is where the near corner is. I read a projection
as a bug and reported it as fact.

## 2. "Commercial is a hollow open-topped shell" — NOT REAL

Measured: commercial has **10 roof planes**. It is not missing a roof.

What is true is that it is **thin**: 62 faces against warehouse's 130 and
library's 107. It reads as a bare shell because there is half as much building
there, not because geometry is missing. That is a subject worth more detail, not
a defect to repair.

## 3. THE ONE REAL DEFECT: `freeway`, 40 faces hanging off its own pad

The only hero in the set whose geometry leaves its ground pad. It is also the
one thing he has already rejected twice, so under
`laws/BOHEMIA_ADDENDUM_STOP_PRODUCING_7_26_26.md` **this lane does not touch the
freeway art this session.** Recorded for whoever picks it up.

## THE LESSON, WHICH IS THE SAME ONE AS THE BLUE DIAMONDS

Two turns ago I told him blue diamonds were wash cells because they survived a
change I made. Last turn I told him about poles and a hollow shell because I
looked at a screenshot. **Looking at a picture is how you FIND a candidate; it is
not how you confirm one.** Every claim in a glitch report has to be measured
before it is handed over, because he acts on what I tell him.

The honest state of the icon set: no measurable geometry defects except the
freeway, and the real weakness is UNEVEN DENSITY — some subjects carry half the
faces of others, which is what "some look glitchy / some look the same" has
probably been pointing at the whole time.
