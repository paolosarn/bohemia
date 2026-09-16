# A BUDGET THAT WOULD ACCEPT A SIX-TIMES REGRESSION, AND THE MEASUREMENT THAT FIXES IT

PLUMBER lane, VAMILY row [sixty fps], 9/16/26. Continuing the claim. This is the line
last round named as next and deliberately did not half-do.

## WHAT WAS WRONG

    the fight budget the speed gate held     >= 10 fps
    what the build actually delivered           60 fps

A 5.7x regression in the fight would have passed green, on the pillar mechanic of a
game judged on the beat.

## WHY, AND THE RULE'S OWN ARGUMENT WAS GOOD

The budget is set from "the worst case across the last six refreshes". That replaced a
one-way ratchet, correctly: a ratchet pinned to the luckiest sample fails the next
ordinary run, and a gate that goes red for nothing gets switched off. The written
argument for it is sound and it is about ONE UNCHANGED TREE.

TWO HOLES, both measured this round.

**One. A history entry carries no build identity.** So a sample from a build with a real
bug in it anchors the budget straight across the fix:

    fightLo   17.6 -> 25 -> 15.4 -> 15.6 -> 54.3
                                            ^ once somebody fixed the fight
                                              and somebody else finally re-measured

**Two, and it is the bigger one. The 40% spread that justified the rule was measured on
ONE metric and the rule was applied to all of them.** Four passes of one unchanged tree,
plus two from the refresh before:

    bytes to first play          0.0 %        the fight              0.5 %
    beats missed, demo           0.0 %        boot blocking          4.2 %
    the city walking alone       1.4 %        walking, demo          4.4 %
    main thread walking          8.3 %        walking, alpha        52.0 %  (*)

    (*) an INVALID sample and the instrument says so on the line: a card sits over the
        pad so the driven thumb moves nobody. The largest spread on any VALID metric
        is 8.3%.

Bytes literally do not move. The fight varies by half a percent across four passes.
Giving those the same headroom as a metric that swings 40% is how a budget stops being
one.

## THE FIX

Keep worst-of-history, then CLAMP each line so it can never sit further from what the
build does today than that metric's OWN measured spread plus a stated margin.

THE MARGIN IS 0.25, grounded not picked: three times the largest spread measured on any
valid metric across six passes of one unchanged tree.

A FLOOR ON MY OWN RULE: a spread from fewer than three samples is not a spread. Under
that the clamp is skipped, the old behaviour stands, and the record says so on its face.

What moved:

    fightFps                        10  ->  47.81     history said 10, build does 60
    beatMissedPercentSettled         9  ->   3
    alphaWalkFpsSettled              6  ->   9.91
    alphaBeatMissedPercentSettled   11  ->   4

## *** THEN MY OWN FIX WENT RED, AND THAT IS THE SECOND HALF OF THE ROUND ***

I clamped main-thread-busy too. It went red on an ordinary run: budget 9, live 15.8.

I did NOT widen the margin until it went green. That would have loosened the fight's
clamp as well, and the fight is the one that actually needed fixing. Fixing a symptom by
weakening the fix is how a budget becomes a decoration in the first place.

Instead I compared EVERY held line's record value against the gate's own live value, on
the same tree on the same afternoon:

    metric                        this record      the gate live      apart
    fight fps                          60               60            agree
    bytes to first play        51,190,304       51,190,304            agree
    beats missed, settled               2              2.6            close
    main thread walking               6.4 %           15.8 %           2.5x
    frames walking, settled           8.8 fps         55.8 fps         6.3x

**TWO OF THE LINES THIS GATE HOLDS ARE DERIVED FROM NUMBERS THAT DO NOT DESCRIBE WHAT
THE GATE MEASURES.** No spread computed inside the record can see either gap, because
the two are not taken the same way: the gate walks the demo shell live, the record's
walk sample is its own. A clamp is only as good as the agreement between the measurement
it comes from and the measurement it is held against.

Both keep their history-derived budget. Reconciling the two walk samples is its own job
with its own measurement, and it is the next line of this row.

## THE SECOND LOCK, IN THE GATE

The clamp fixes this where it belongs, in the writer. But a fix in a writer can be
removed, bypassed or quietly widened, and the number would go back to sitting in a JSON
file nobody opens. So the gate now prints how far every budget sits from what the build
does, and FAILS a line with more than 2x of slack.

The factor is deliberately far looser than the clamp (about 1.25x) so it only fires on
something genuinely broken rather than arguing with an ordinary refresh. Lines the record
says were NOT clamped are skipped by name and reason, not silently passed.

Today every held line reads between 1.15x and 1.50x of slack.

## AND ONE RED THAT BLINDED THE WHOLE GATE

The record-completeness block ended in a flat `if (fail) done()`. So the moment any one
line went red the gate STOPPED, and the other thirty-odd checks never ran. Measured
today: a card sat over the movement pad, first play could not be taken, and a gate with
37 working checks reported **18 passed / 1 failed** and told nobody anything else.

A surface bug in one lane was blinding the entire speed report.

Now it gives up only when the record is STRUCTURALLY unusable. The verdict is unchanged,
a red is still a red and the exit code is still 1; what changes is that one blocked
measurement costs one line instead of the whole page. Same run, after: **37 passed, 4
failed**, and all four are named.

## THE FOUR REDS, AND THREE OF THEM ARE ONE BUG THAT IS NOT MINE

    1. timeToFirstPlayMs is missing from the record
    2. the wake card was not cleared off the pad before the sample
    3. the alpha never reached its first step

ALL THREE ARE THE SAME THING: `#daycard` is `inset:0` and sits over all eight direction
buttons on boot, so a driven thumb has nothing to press. It was named for RUN last round.
IT HAS GOT WORSE: last round the demo still got through once at 18,027 ms; this round no
pass on either surface reached a first step at all.

I let that go red rather than carry the last number that happened to get through. A
measurement you cannot take is not a measurement of the old value, and that substitution
is the exact stale-reassurance failure this lane spent last round writing about. The
gate's message now names the cause so the next reader is sent at the surface, not at the
JSON.

    4. main thread walking 15.8% against budget 9% -- MINE, and it is fixed above by
       exclusion rather than by weakening the clamp.

## THE ROW

[sixty fps] stays CLAIMED. Its targets are still 60 walking, 60 in the fight, first play
under 5 s, and first play cannot currently be measured at all. Next line: reconcile the
record's walk sample with the gate's live walk, because two budgets are being held
against numbers that disagree by 2.5x and 6.3x.
