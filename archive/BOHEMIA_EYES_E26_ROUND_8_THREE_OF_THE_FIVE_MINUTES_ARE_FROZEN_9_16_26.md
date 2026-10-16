# THE STRANGER'S LIST, ROUND 8: THREE OF THE FIVE MINUTES ARE FROZEN

EYES AND EARS, lane 17, E26 [five minutes], STANDING. 9/16/26.
Law: laws/BOHEMIA_ADDENDUM_THE_FIVE_MINUTES_9_13_26.md (Paolo 9/13, LOCKED), rule 14.
Charter: laws/BOHEMIA_ADDENDUM_EYES_AND_EARS_9_4_26.md. Mode: SCHOOL THEN CHECK.

---

## THE CORRECTION FIRST, BECAUSE IT IS MY NUMBER

Round 6 put this timeline on his front page: the first human being lands on screen at **17.2 s**,
the game freezes for **11.1 s**, **28.9 s** of the first 300 are frozen.

**Every one of those was measured on this box, unthrottled.** PLUMBER then found (f90a810) that
`gates/bohemia_phone_perf.js` has taken a phone-shaped CPU since 9/5 and thrown it away, because
the refresh command written into its own record pinned `--cpu 1`. Their boot number went 19,530 ms
at 1x to **71,758 ms** on a phone. The class of mistake is theirs to have found; the number on his
page was mine, and rule 14 says the measure is A PHONE, so the CPU had to be a phone's too.

Re-measured with the same mechanism PLUMBER uses, not a second one of my own:

```
                                        on this box (1x)    on a phone-shaped CPU (4x)
  the city draws its first thing              5.6 s                 31.7 s
  the first human body is painted            13.8 s                 83.2 s
  THE FIRST HUMAN BEING ON SCREEN            17.2 s                 88.5 s
  worst single freeze                        11.1 s                 43.0 s
  frozen, out of the first 300 s             28.9 s                174.1 s
```

**On the thing in his hand you wait a minute and a half for one human being to appear, and the
game is frozen for more than half of the first five minutes.** His bar, from the routing note, is
ten seconds. It is missed by seventy-nine.

That is his own sentence, measured: *"it's kinda not running as smoothly as I was I would like
maybe it's cause things are loading in real time."* And it is the real reason behind the other
one, *"I didn't see a single human being"* -- the population was never the problem, and now the
size of the wait is on the board instead of a five-times-optimistic version of it.

---

## THE TWO CONTROLS THAT MAKE THOSE NUMBERS SAFE TO PRINT

**THE THROTTLE IS PROVED REAL INSIDE EACH RUN.** PLUMBER's rule, and it is a good one: a fixed
busy loop is timed with the throttle off and then on, in the same run, and the ratio is printed.
18.1 ms against 58 ms is **3.2x**; the second run measured 3.65x. A throttle that silently failed
to apply would publish the fast numbers under a slow label, which is worse than no throttle.

**AND MY OWN WATCHING IS NOT THE FREEZE.** A 43-second freeze is a big claim and my observer runs
on the same single thread: every sample is work the game has to wait for, and under a throttle
that cost multiplies. So the whole walk was run again with the sampling loop switched off
(`--noobserve`), reading the heartbeat once at the end.

```
                          worst freeze     frozen of 300 s     first body on screen
  me watching               44.3 s             188.7 s               88.5 s
  me not watching           43.0 s             174.1 s               89.3 s
```

My watching costs 1.3 s of the worst freeze and 8% of the total. **The freeze is the game's.**
The published numbers are the not-watching ones, because those are the honest ones.

---

## WHAT DID NOT CHANGE ON A SLOWER MACHINE

**55 fight words exist in the demo and a player can read zero of them.** Same as round 6, 56 this
time. In five minutes nothing visible ever mentions a fight, an enemy, an attack or a hostile.

**And the population is still there.** Once the build is done, bodies are painted on every sample,
all of them inside the screen rectangle. Fewer at once (9 against 20) for the plain reason that a
throttled machine paints fewer frames, so fewer samples catch the peak. Nothing needs adding.

---

## BLIND SPOTS, STATED

4x is PLUMBER's phone-shaped setting and my yardstick measured 3.2 to 3.65x of it actually
landing, so these numbers describe a machine in that band and not a named handset. This does not
judge pictures. "A body painted inside the screen rectangle" is still not "a body a person
notices" -- at the far zoom it is a few pixels, and that is the next thing to measure. And the
throttled run samples far less often (72 windows against 135), so every count of bodies-at-once
is a floor, not a peak.

## PROOF

- `tools/bohemia_eyes_a_human_being.js`: `--cpu N` with an in-run yardstick, `--noobserve` for
  the observer control, four wrong versions in its own docstring
- `records/BOHEMIA_EYES_E26_A_HUMAN_BEING_9_15_26.json` (watching) and
  `..._NOOBSERVE_9_16_26.json` (not watching), the pair that proves whose freeze it is
- PLUMBER f90a810, whose find is what made this round necessary
