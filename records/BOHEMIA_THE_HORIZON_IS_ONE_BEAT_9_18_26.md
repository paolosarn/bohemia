# THE HORIZON IS ONE BEAT (9/18/26, SOUNDS lane)
## [scheduled beat] round one — the 120 BPM law was failing on the only surface that counts

> **PLUMBER measured it first** (f90a810, [sixty fps] round 3, throttle proved real inside
> the run): *"beats LATE once settled 9.9% here → 31.6% on a phone-shaped CPU, and 8.3%
> SWALLOWED WHOLE… THE 120 BPM LAW ON A PHONE: one beat in twelve never happens."*

The 120 BPM law is this lane's law. Another lane found it broken. This round measures where
the beats go and closes half the hole.

---

## THE ROW'S PREMISE WAS HALF WRONG, AND MEASURING IT SAID SO

The row says every beat "is fired on the tap" and should be "scheduled ahead". **It was
already scheduled ahead** — the transport is a lookahead scheduler on a 25 ms
`setInterval`. There was nothing to convert.

**The defect is the size of the horizon.** Rule 12 exists for exactly this: the named fix
was not the fix.

---

## MEASURED BY ASKING THE TRANSPORT, NOT BY READING IT

`MUS.playStep` was wrapped, so the only countable thing is a step really handed to Web
Audio, and `MUS.step` was watched for the re-anchor branch that throws steps away. Twenty
seconds, the same shape of run at both rates:

                              1x            4x, a phone-shaped CPU
    steps booked           128 of 160          42 of 160
                                80%               26.3%
    booked IN THE PAST          10                  17
    re-anchors                   3                   4
    worst gap, nothing booked  2,229 ms          5,782 ms
    largest booked-ahead      0.12 s             0.117 s

> **THREE QUARTERS OF THE BEAT NEVER REACHED THE AUDIO GRAPH ON A PHONE — AND ONE STEP IN
> FIVE DID NOT REACH IT ON THIS FAST BOX EITHER.**

A step **booked in the past** is worse than a missing one: Web Audio plays it the instant
it is handed over, so it is a beat in the wrong place rather than a beat that never came.

### WHOSE NUMBER IS WHOSE, said plainly

PLUMBER counted **beats the game judged** late or swallowed. This counts **steps the
scheduler booked**. Two instruments on the same illness; neither refutes the other, and
this is not a correction of theirs.

### AND MY YARDSTICK WAS WRONG FIRST

The throttle proof ran the busy loop once cold and once warm and reported **0.51x with no
throttle applied** — it was timing the JIT compiling the loop, not the CPU. It warms four
times a side now and reads 0.98 unthrottled, 3.81 at 4x. An unthrottled control that does
not come back near 1.0 means the yardstick is the thing being measured.

---

## THE CAUSE IS ONE NUMBER, AND THE RE-ANCHOR IS NOT THE BUG

The horizon was `currentTime + 0.12`, on a thread that stalls for seconds. A stall over
about 0.37 s also puts the transport more than 0.25 s behind, which trips the re-anchor.

**The re-anchor is right and it stays.** Without it a nine-second stall booked seventy-two
sixteenths at once — *"not a song coming in, a noise"*. But it zeroes the musical position
too, so a stalled phone does not merely drop beats, **it restarts the song's form.**

---

## MY OWN LANE ALREADY WROTE THE LIMIT DOWN, SO IT GOT MEASURED

The pulse's comment, 9/5, this lane's own words:

> *"a setInterval beat is impossible here… a lookahead scheduler with a four-second horizon
> still dies in a nine-second stall. SO IT IS ONE LOOPING BUFFER… the audio thread does not
> care that the main thread is building a city."*

That is an argument, not a measurement of **this** transport at **this** stall length, so
the horizon was patched at runtime and swept at 4x over the same window:

    horizon   booked         worst gap   music COMMITTED (median/max)
    0.12 s    45/160 28.1%    6,121 ms      185 /   230 ms
    0.50 s    82/160 51.3%    6,449 ms      560 /   619 ms
    1.00 s    97/160 60.6%    2,708 ms    1,060 / 1,124 ms
    2.00 s   131/160 81.9%    8,171 ms    2,049 / 2,119 ms

**Two things that table settles.** A wider horizon really does recover beats, roughly in
proportion. And **it cannot fix this**, because the worst gap does not improve with it at
all — 6,121 → 6,449 → 2,708 → 8,171 is noise. A long stall is a long stall, and the 9/5
sentence holds. This is a dial that reduces the damage, not a cure.

---

## WHY ONE BEAT AND NOT THE BIGGER WIN

The cost column is the whole argument. **A booked step cannot be un-booked, so the horizon
is exactly how long the music takes to obey a change.** At 2 s it nearly triples the
surviving beats *and* makes a fight's music arrive two seconds late — and FIGHTMUS takes
the music immediately on purpose, because danger is now, and this lane spent 9/15 giving
the start of a fight a sound he could hear.

> **TRADING HIS NAMED COMPLAINT FOR A NEW ONE IS NOT A FIX.**

So the horizon is **one beat**, and it is not a number I invented: `4 * stepDur()`, the
engine's own unit, the unit this whole game is quantised to. The fight sting is untouched
either way — STING owns its own bus and lands on the next beat, outside the transport.

### PROVED ON THE REAL SURFACE, SAME INSTRUMENT, BOTH RATES

                              BEFORE            AFTER
    1x steps booked         128/160  80%     151/160  94.4%
    4x steps booked          42/160  26.3%    78/160  48.8%
    booked in the past      10 at 1x, 17 at 4x      0 at 1x; 0 then 5 at 4x
    4x worst gap              5,782 ms          6,220 ms   (unchanged, as predicted)

On a phone the beat went from a quarter to a half.

**AND THE ON-TIME ROW IS NOT A CLEAN ZERO, WHICH I WROTE FIRST AND THEN RE-RAN.** One 4x
pass read 0 booked in the past and a second read 5 of 80. Before the fix it was 17 of 42, so
40.5% of the beats that arrived were dumped in late and it is now about 6% — a real
improvement, not a cure, and two samples is not a spread. So the gate holds it as a RATCHET
at half the measured before-value rather than at a tolerance I would have invented off a
single lucky run. That is the fourth round running where a threshold of mine was measuring
my own instrument, and it is written here so the next one starts from it.

The worst gap is untouched, which is the honest shape of a dial rather than a cure.

---

## THE GATE, AND WHY IT HAD TO EXIST

**A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED.** The 120 BPM law had a checker — BEAT
FIRST — and it runs **unthrottled**, so it has always been asking about a machine several
times faster than the one he holds. That is the class of mistake PLUMBER found fleet-wide,
and it is why this sat unseen.

`gates/beat_survives_a_phone_gate.py` throttles, proves the throttle inside the run with a
warmed yardstick, counts at the wrap rather than by grep, and holds the cost ceiling as well
as the coverage (a coverage claim alone is satisfiable by making the game unresponsive).

**AND ITS COVERAGE VERDICT IS PAIRED, BECAUSE MY ABSOLUTE FLOOR WAS THE FIFTH INSTANCE OF
THE SAME BUG.** I set a 40% floor off two runs. Four legitimate 4x runs, throttle proved
between 4.2x and 4.7x, then read **53.1, 50.0, 48.8 and 33.8 percent** — the floor sat
*inside* the real spread and failed a build that was fine.

> **COVERAGE ON A THROTTLED BOX IS PARTLY A MEASUREMENT OF THE BOX, so no absolute number
> belongs in the verdict.**

The gate now runs the same window twice, minutes apart on the same machine — once with the
shipped horizon, once with the old 0.12 s one — and holds the **ratio**. Measured pairs:
48.8/23.1 = 2.1x, 50.0/27.5 = 1.8x, 33.8/7.5 = 4.5x, 32.5/12.5 = 2.6x. The floor is 1.4x:
comfortably under the worst pair, far above 1.0, and no box speed can move it.

**AND THE VERY RUN THAT SHIPPED THIS PROVED THE PAIR WORKS.** On it, coverage came back
**32.5%** — under the 40% floor I had just deleted, so the old instrument would have failed
a build that is fine — while the old horizon booked **12.5%** on that same box minutes later.
The ratio read 2.60x and the verdict held. Every absolute percentage is
still printed and none is asserted. That is the suite's own rule, in its own words: *pair
every before/after inside one window, or you measure the hour.*

It is also load-sensitive by nature and says so rather than lying: a gate that throttles the
CPU is applying its own rate to whatever the box is already doing, so when the measured ratio
overshoots the asked rate the run reports what it is instead of a verdict.

---

## WHAT IS STILL OPEN, AND IT IS THE NEXT ROUND OF THIS ROW

The row stays **CLAIMED**. Half the hole is closed and the other half needs the thing my own
lane already proved on 9/5: **a clock the audio thread owns**, which does not care what the
main thread is doing. The pulse is exactly that and the game switches it off the moment the
music starts, after which the beat goes back on the thread that stalls. That is the fix, it
is a real build, and it is not a number.

Also corrected while I was here: my own last handoff said this lane's `[into the vote tab]`
row was SHIPPED at 438b2c9. **That sha is DIRECTION's line, not mine.** Every lane carries
its own copy of that row and I read a neighbour's as my own; the SOUNDS one is still OPEN.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new sound, no new event, and
**no new number** — the horizon is derived from the engine's own `stepDur`.

    python3 gates/bohemia_gates.py --only "BEAT ON A PHONE"

Build 9/18 - THE HORIZON IS ONE BEAT.
