# THE THIRD PITCH ROW SHOULD STAY OFF, AND NOW THERE ARE NUMBERS (8/22/26, SOUND lane)

## WHAT THIS RETIRES

`00_START_HERE_NEXT_SESSION.md` has carried this as **the top engineering defect
in the sound lane** for several sessions running:

> THE THIRD PITCH ROW at semi -6. The INST_VOICE grid is a TWO-POINT model
> (-24, +12) and it has MISPREDICTED 3 of 44 voices. This is the top engineering
> defect.

It was never measured against the thing that matters — **whether any sound Paolo
has actually approved is wrong because of it.** Now it has been. The answer is
no, and the row should stay off.

## THE MEASUREMENT

Every voice that feeds an APPROVED moment (50 of the 73 calibrated voices),
rendered through the real `synthV` at three pitches, five steps each. The
two-point model's prediction at semi -6 compared against the truth:

| voice | worst error | predicted -> truth |
|---|---|---|
| holdbreath | 87% | 0.108 -> 0.058 |
| dawnpad | 80% | 0.375 -> 0.208 |
| pickscrape | 44% | 0.081 -> 0.057 |
| springrev | 43% | 0.063 -> 0.044 |
| sodahiss | 41% | 0.284 -> 0.202 |
| thunderdrum | 40% | 0.034 -> 0.057 |

**2 of 50 mispredict by more than 50%. The rest are 44% and under.**

And the case the calibration tool's own comment is written around — `breathpad`,
which mispredicts by 400% — **is not used by a single approved moment.** The
worst offender in the rack is not in the shipped set at all. That is the whole
reason the headline number ("3 voices mispredict") felt more alarming than the
situation warrants: it was counting the rack, not the game.

## DOES IT HURT ANYTHING HE APPROVED

Those two voices feed six approved candidates. Every one renders inside the
judgeable band (0.15 to 0.85 peak):

    holdbreath   lungs_burn.4  0.192     will_goes.2  0.343
    dawnpad      come_up.0     0.175     come_up.1    0.226
                 come_up.2     0.185     come_up.4    0.222

Nothing is out of band. `sfx_render_gate` is 6756 passed / 0 failed. There is no
audible defect to fix.

## THE DECISION, AND WHY IT IS THIS WAY

**The third row stays OFF.** It is built, it is one constant away
(`SEMI = [-24, -6, 12]` in `tools/bohemia_sfx_instrument_measure.py`), and the
migration carries the outer rows byte-for-byte so nothing moves accidentally.
What it cannot avoid is that a denser ruler changes the INTERPOLATION for every
voice, which re-tunes **460 candidates Paolo has already ruled on** — measured
previously at up to 46% RMS movement on `come_up.1` off nothing but a better
ruler.

Trading a 46% change in sounds he approved for a correction to two voices that
are already in band is a bad trade. **He judged what he heard.** The strongest
protection in this lane is that a sound he judged cannot drift under him, and
turning this on for no audible gain would spend that protection for nothing.

It rides WITH a deliberate re-record — a turn whose whole purpose is re-recording
the fingerprint ledger and re-auditioning what moved — and never under one.

## WHAT WOULD CHANGE THIS

Any of these makes it worth doing, and none is true today:

1. An approved sound renders OUTSIDE the judgeable band and the mispredict is
   why. (`sfx_render_gate` would be red. It is green.)
2. A new moment wants `breathpad` or another badly-nonlinear voice that is not
   yet in the approved set.
3. A re-record is happening anyway for another reason, in which case the row
   costs nothing extra and should ride along.

## THE PROCESS NOTE

I could not find `INST_VOICE` in the repo at the start of this turn and briefly
believed the whole system had been removed. It had not: my working tree had been
reset onto a stale branch and was 946 commits behind main. CHECK WHICH TREE YOU
ARE STANDING IN before concluding that something is gone — same family as the
probe that reported "could not find the baked bank" about a correct build, and
as the gate that graded against a bank two sweeps old.
