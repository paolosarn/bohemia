# THE FIGHT RUNS AT SIXTY ON THIS BOX AND AT SEVEN ON A PHONE-SHAPED CPU

PLUMBER lane, VAMILY row [sixty fps], 9/15/26. Continuing the claim.

PAOLO 9/15: "it's kinda not running as smoothly as I would like." Last round measured
the WALK on a throttled profile and found the first thirteen seconds. This round does
the thing that round said was still missing: THE FIGHT, and the record that holds it.

## *** THE INSTRUMENT HAS MEASURED A PHONE-SHAPED CPU SINCE 9/5 AND THREW IT AWAY ***

gates/bohemia_phone_perf.js defaults to `cpus = [1, 4]`. It has always taken both. But
the documented refresh in its own record is:

    node gates/bohemia_phone_perf.js --repeat 3 --cpu 1 --record

`--cpu 1`. So every number in the record, every number the gate holds, and every number
this fleet has quoted about speed describes a machine several times faster than the
thing in his hand. The 4x pass ran, printed, and was discarded, for nine days.

That is how "the fight runs at 60" and "it's kinda not running as smoothly as I would
like" were both true at the same time, about the same build, on the same afternoon.

FIXED: the refresh command no longer pins the throttle, the record now carries an
`onAPhoneShapedCpu` block, and gates/fps_on_a_phone_gate.js PRINTS it beside the 1x
numbers and FAILS if a future record does not have one.

## THE NUMBERS, ONE REFRESH, TWO REPEATS, ONE WINDOW

The throttle is proved real inside the same run by the CPU yardstick: 31.75 ms at 1x
against 136.7 ms at 4x, which is 4.3x.

                                    on this box (1x)      on a phone-shaped CPU (4x)
    the fight                          57.2 fps                   7.1 fps
    the fight, in the alpha            60.1 fps                   9.4 fps
    boot blocked the main thread      19,530 ms                  71,758 ms
    ...in this many long tasks             26                        35
    the worst single block             7,080 ms                  26,532 ms
    the city was ready at              ~9,000 ms                 33,284 ms
    beats LATE once settled              9.9 %                     31.6 %
    beats SWALLOWED once settled         3.3 %                      8.3 %

    *** THE WALKED CITY ON ITS OWN      58.5 fps                  58.4 fps ***

## THE LAST ROW IS THE FINDING, AND IT POINTS AT WHAT TO FIX

THE WALKED CITY DOES NOT CARE ABOUT THE THROTTLE AT ALL. 58.5 against 58.4 is not a
small difference, it is no difference. Slow the CPU by 4.3x and the city renderer
delivers exactly the same frame rate.

So the thing that collapses on a phone is NOT the world, NOT the tiles, NOT the walking.
It is the FIGHT (57 to 7, an 8x fall) and the SHELL BOOT (19.5 s of blocking becomes
71.8 s, and the worst single block goes from 7 s to 26.5 s).

That is a much narrower target than "the game is slow", and it is only visible because
the control is measured at both rates in the same run.

## AND A RHYTHM GAME MISSING A THIRD OF ITS BEATS

The 120 BPM law is a pillar and the fight is judged on the beat. On a phone-shaped CPU,
once settled, 31.6% of beats are LATE and 8.3% are SWALLOWED WHOLE. One beat in twelve
never happens. On this box it is 9.9% and 3.3%. Nobody had this number before because
nobody kept a throttled pass.

## WHAT THE OLD RECORD SAID, AND THE CORRECTION

The record on file said the fight ran at **16.2 fps** with **7,424 drawImage calls a
frame**. It is now **57.2 fps** at **4 drawImage calls a frame**.

THE FIGHT WAS FIXED BY SOMEBODY AND NOBODY RE-MEASURED. Nine days. The record was 1,800
times off on the draw calls and 3.5x off on the frame rate, in the build's FAVOUR, and
it was the file this whole fleet reads to answer "how fast is the game". A stale
measurement is not a small debt: it is reassurance about a build that no longer exists,
in both directions.

## A DEFECT IN MY OWN GATE, NAMED WITH ITS NUMBER AND NOT HALF-FIXED

Refreshing the record exposed this, and it is on this lane's own row:

    the fight budget the gate holds     >= 10 fps
    what the build actually does           57 fps

**A 5.7x REGRESSION IN THE FIGHT WOULD PASS THIS GATE GREEN.**

The cause is in the budget rule, and the rule's own argument is good: a one-way ratchet
was tried, was wrong for a metric whose spread is 40%, and was replaced with "the worst
case across the last six refreshes". That reasoning is explicitly about ONE UNCHANGED
TREE. But a history entry carries no build identity, so a sample from a build where the
fight really did run at 16 fps anchors the budget at 10 for six refreshes -- across a
real fix. The history proves it:

    seeded-from-m4   fightLo 17.6
    seeded-from-m5   fightLo 25
    seeded-from-m6   fightLo 15.4
    2026-09-06       fightLo 15.6
    2026-09-15       fightLo 54.3      <- the build today

NOT FIXED THIS ROUND, ON PURPOSE. A new budget rule needs its own measurement of how
wide this metric really swings across refreshes of ONE build, and inventing a clamp
factor at the end of a long round is how a gate gets a number nobody can defend. It is
the next line of this row. Front page rule 6: a half-done job marked shipped is worse
than an open one.

## THE GATE'S TWO REDS ARE NOT MINE AND THEY ARE ONE BUG

Before this round: 32 passed, 3 failed. After: 34 passed, 2 failed. The refresh FIXED
one (bytes to first play was held against a stale 34 MB budget while the build fetches
48 MB). The two that remain were red before I touched anything and they share a cause:

    #daycard is inset:0 and it sits over all eight direction buttons on boot
    the alpha never reaches its first step, because the thumb has nothing to press

A CARD COVERS THE WHOLE MOVEMENT PAD ON BOOT. That belongs to RUN, and this lane names
a red in another lane's work rather than fixing it. One line on the front page.

## SHIPPED

  * the refresh command no longer pins `--cpu 1`, so a refresh keeps the phone-shaped
    pass instead of throwing it away
  * `onAPhoneShapedCpu` in the record: the fight, the boot blocking, the long tasks, the
    beat, and the CONTROL at both rates, with the yardstick that proves the throttle
  * the throttled WALK is deliberately NOT carried: the instrument marks it INVALID
    (the driven thumb never moved anybody while the boot was still blocking), and an
    invalid sample must not be laundered into a record by copying its number
  * `repeatsThisRefresh` on the face of the record, because a band from two passes is a
    band from two passes and a reader should not have to guess. THIS REFRESH RAN 2, not
    the documented 3, and that is why the field exists.
  * the gate prints all of it and asserts the block EXISTS, so no future refresh can
    quietly go back to describing the wrong machine

## THE ROW'S SHIP TEST, HONESTLY

[sixty fps] wants 60 walking, 60 in the fight, first play under 5 s, each with a budget
and a gate.

    walking          58.6 fps here, and the city alone is 58.4 even at 4x       CLOSE
    the fight        57.2 fps here, 7.1 on a phone-shaped CPU                   MISSED
    first play       20,272 ms against 5,000                                    MISSED

The row stays CLAIMED.
