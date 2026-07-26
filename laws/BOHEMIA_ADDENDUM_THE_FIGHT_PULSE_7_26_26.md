# BOHEMIA ADDENDUM — THE FIGHT PULSE (Paolo 7/26/26)

> "Unfortunately, before I would want to confirm these, you know the music I'm not
> really feeling the rhythm in this shit. I don't know. Gotta listen to do research
> but yeah it's I'm not. I'm not getting rhythm vibes for real like it's decent, but
> not enough to put slap more mechanics on the timing unless we can make the music
> and the action button work better together."
> — Paolo, 7/26/26

STATUS: **the mechanics freeze is IN EFFECT.** No new timing mechanics ship until
Paolo rules that the music and the button work together. This addendum is the one
thing allowed through that gate, because it IS the music-and-button job.

---

## 1. THE MEASUREMENT (not a guess)

Four sessions in a row shipped clock work: ONE CLOCK off the audio context (v67),
whole-bar dial cycles with a re-baked 52-entry phase table so the kill moment lands
on a downbeat (v68), a PERFECT/GOOD grader with a tap calibrator (v69), a +6dB hero
bass with the drums ducked out of its way (v70), every scheduled event snapped to
the grid (v71). Every one of those was correct and every one of them was verified.
He still could not feel a beat.

So instead of shipping a sixth clock fix, the encounter music itself got counted.
Straight off his own `OVERWORLD_SONGS` table in the shipped demo:

```
song                       kick/bar  hat/bar  bass/bar  feel   lead
SLOW CREEP                   0.50     0.50      1.00    half   rustlead
SATELLITE PRAYER             0.50     0.50      0.75    half   solarhymn
REPO MAN                     0.50     0.50      1.00    half   coldpiano
GHOST IN THE GRID            0.50     1.00      1.00    half   signalfade
SLOW BLEED                   0.50     0.50      1.00    half   rustlead
THE PIT BOSS IS GONE         0.75     0.50      1.00    half   rouletteghost
------------------------------------------------------------------------
AVERAGE                      0.54     0.58              ALL half-time
FOUR-ON-THE-FLOOR REFERENCE  4.00     8.00
```

**A kick lands about once every other bar. Roughly one eighth of a lockable
track, every song half-time, every lead an ambient voice.**

He was trying to lock onto a pulse that is not in the recording. That is why the
clock work was unfeelable: the clock was right, the grid was right, the grade was
right, and none of it can rescue a bed with a kick every eight beats. The songs are
doing the opposite job on purpose. They are MOOD. They are creepers. They work.

**THE LESSON, and it is the law part:** when a fix is correct and the player still
cannot feel it, MEASURE THE THING THE FIX WAS SUPPOSED TO SERVE. Do not ship the
same fix a fifth time with more polish. (This is the STOP PRODUCING law read
forward instead of backward — the tell there is "writing a fourth version of
anything means you already failed." Here the fourth version would have been clock
fix #6.)

## 2. WHY THE SONGS ARE NOT TOUCHED

Because they are his. V63 is his own ruling that encounters play the overworld
creepers, and the 13 tracks are approved canon. MECHANISM-MINE /
CONTENTS-PAOLO'S: I do not get to re-cook approved songs to make my system feel
better. The creeper plays EXACTLY as approved.

It gets a FLOOR under it instead.

## 3. THE FIGHT PULSE

Combat only. Never the studio, never the overworld map, dead the instant the
fight ends.

- **KICK ON ALL FOUR BEATS** (steps 0/4/8/12 of the 16-step bar). Four-on-the-
  floor is the pulse under house, techno, disco and essentially every rhythm
  game ever shipped, for one reason: it is the pattern a human body locks to
  without being taught.
- **HATS ON THE EIGHTHS** (every even step). The subdivision that tells you where
  the *middle* of the beat is, which is what makes early/late legible.
- **A BACKBEAT ON 2 AND 4** (steps 4 and 12). The thing you nod to.

It is played with **THE SONG'S OWN KIT VOICES** (`f.kit.k` / `f.kit.h` plus the
shipped `drumV`), so it reads as the same record with its floor switched on, not
as a metronome bolted to the side of his music. It is mixed UNDER his song on
purpose (kick 0.085, backbeat 0.055, hat 0.030) — his voices stay on top.

And **it thickens with the GROOVE CHAIN** (+15% gain per chain level, x1 through
x4). Playing in the pocket makes the floor heavier. Rhythm rewards you with more
groove, not just a wider dial window — which is the answer to "make the music and
the action button work together" pointed in both directions: the button gets its
timing FROM the music, and the music gets its weight FROM the button.

## 4. THE BUTTON FINALLY PLAYS INTO THE TRACK

The count was `tone(415,0.035,0.055,'square')`. A UI beep. It lived outside the
music, in a different timbre, on a different bus, so the thing he was timing
against was never part of the record. That is a big share of why five correct
clock fixes felt like nothing.

- `sndBeat()` now plays **the song's own hat**.
- `sndHeroTick()` (beat one) now plays **the song's own kick + hat together**.

Same clock, same grid, same grade. It is now IN the arrangement.

## 5. HE CAN A/B IT IN ONE TAP

A `PULSE: HARD / SOFT / OFF` button in settings.

- **HARD** — full floor. Lock to it.
- **SOFT** — 0.55x. The floor, tucked back.
- **OFF** — the bare creeper, byte-for-byte how it plays today.

OFF being an honest revert is the whole point. He does not have to take my word
that this is better; he taps once and hears both. The verdict is his ear, and
nothing about this is confirmed until he gives it.

## 6. THE GATE

`gates/combat_lab_gate.js` section 14 (286 checks total, 0 fail):

- **re-measures his song table every run** and fails if the encounter beds ever
  drift back into "we thought this was lockable" territory — the measurement that
  justifies the law is itself gated, so a future session cannot quietly delete the
  floor on the theory that the songs are dense enough now.
- **executes the extracted pulse core** and asserts the pattern: `kicks=4 hats=8
  backbeat=2` per bar, gain climbing `1.00 / 1.15 / 1.30 / 1.45` across chain
  levels x1..x4, and `hard -> soft -> off -> hard` cycling.
- asserts the pulse is gated on `!G.over` and `!G._musMuted` (no floor over a
  finished fight, no floor when he muted the music).
- asserts the count is the kit and not the 415Hz square.

## 7. WHAT IS STILL FROZEN

Everything else. The v74 groove chain, on-beat-moves-are-free, the dial patterns
as difficulty, the enemy telegraph countdown — all of it waits on his ruling
about whether combat now *sounds* like a rhythm game. A second rejection of the
rhythm direction ends the direction for the session (STOP PRODUCING law), it does
not earn a sixth attempt.
