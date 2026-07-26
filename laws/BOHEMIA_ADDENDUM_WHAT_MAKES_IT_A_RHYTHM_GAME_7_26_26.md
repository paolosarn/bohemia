# BOHEMIA ADDENDUM — WHAT ACTUALLY MAKES IT FEEL LIKE A RHYTHM GAME
# (COMBAT lane, 7/26/26 — answering Paolo's "how can we do better?")

Paolo, after v68 shipped with correct, gated timing: "I couldn't really tell a
difference. It didn't really feel super good. How can we do better to make this
feel like a rhythm game?"

He is right, and the lesson is bigger than the dial:

> **A player cannot feel a fix he cannot perceive. Correct timing is table
> stakes; PERCEIVABLE timing is the game.**

v67 and v68 made the clock true and the perfect shot land on the hero beat, and
both are machine-proven. Neither gave him a single way to SEE, HEAR or BE TOLD
that it was happening. That is why a real fix read as no change.

## THE FOUR PILLARS (what every rhythm game has, and the dial did not)

1. **ANTICIPATION — you see the beat COMING.** Approach circles, falling notes,
   a runway. Reaction is luck; anticipation is skill. The dial had a needle
   sweeping and no indication of when the moment was.
   *Shipped v69: the approach ring collapses onto the dial across each beat and
   snaps at the hit; the hero beat arrives fatter, brighter, from further out.*
2. **JUDGMENT — you are told how wrong you were, by name and by number.**
   PERFECT / GOOD / EARLY 80ms / LATE 158ms. Without an error readout the
   timing cannot be learned, and a correct build cannot be told from a broken
   one.
   *Shipped v69: every press is graded, on its own persistent strip (the flash
   verdict gets overwritten by the hit result within the beat), plus a running
   PERFECT count. We grade the PRESS, never the granted shot — the permission
   gate fires on the beat by design, so grading the shot would read PERFECT
   forever and teach nothing.*
3. **AUTHORSHIP — your input MAKES the music.** In a rhythm game the player
   plays the track. The dial's trigger was a dull crack sitting outside the
   song.
   *Shipped v69: an on-beat press stabs a note in the song's own key —
   root+fifth+octave on a PERFECT, the root alone on a GOOD, nothing when you
   are off the grid.*
4. **CALIBRATION — it is true on YOUR device.** Phone output latency runs
   40-300ms and every real rhythm game ships a calibration screen. Uncalibrated,
   a perfectly correct build can sit a third of a beat off for that specific
   phone and headphones.
   *Shipped v69: a SYNC button in settings runs the standard tap-along (8
   clicks, MEDIAN offset so one fumble cannot poison it, refused outright if the
   taps are noise), stored as a per-device clock offset.*

## WHAT IS STILL MISSING (the honest next moves, in order)

- **RHYTHM AS DIFFICULTY.** The 52 dial patterns are curve shapes, not rhythms.
  A rhythm game gets harder by getting more syncopated (quarters, then eighths,
  then off-beats), not by moving faster. Patterns should be authored as note
  values against the bar.
- **THE WHOLE FIGHT ON THE GRID.** The dial is quantized; the return volley,
  deaths, steps and camera hits are not. When every event in the fight lands on
  the grid, the fight becomes the drum track instead of noise over it.
- **A COUNT-IN.** Opening an engagement should give a bar of count before the
  window matters, so you enter already inside the pulse.
- **THE POP.** [PENDING Paolo] Whether the pop should be permission-gated like
  the shot. It currently is not, because the ON THE ONE streak (his V57/V58
  ruling) pays for popping on beat one, and gating it hands that reward out for
  free.

## THE STANDING RULE THIS LEAVES BEHIND

Any timing or feel work in this lane ships with its PERCEPTION in the same turn:
if a player cannot see it, hear it, or read it, it does not count as shipped, no
matter how green the gate is. A gate proves non-violation. It never proves feel.
