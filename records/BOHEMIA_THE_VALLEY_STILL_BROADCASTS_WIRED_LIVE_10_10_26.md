# THE VALLEY STILL BROADCASTS, WIRED LIVE (SOUNDS, 10/10)

Row [one song and the volumes], round three. Rule 99's SKETCH to this lane: "[one
song] is yours to play, he has said everything it needs." Round one of this row (10/4)
named the gap plainly: "theBroadcast... is a built, measured candidate...that was
never wired into a live event, so there is no live instance of it for him to be
hearing." This closes it.

## What it is

`sounds-the-valley-still-broadcasts-9-27` has been APPROVED since 10/2 ("good
progress... QUIETER PLEASE ITS LOUD") and never once played in the real game. Same
precedent as the clinic's door and the roster screen's `equip` sound: an already-judged
candidate with no live caller. Zero new content, no new vote.

## Why this needed real engineering, not a one-line wire

`theBroadcast` (`engine/bohemia_horror_sounds.js`) renders OFFLINE, into a static
buffer, for judge pages and measurement. The live game needs something a real
`AudioContext` can play through the real ambience graph. `ROOM` already solved exactly
this problem for the room tone (9/21-9/24) and already paid for the lesson the hard
way: its own constants matched the module's for rounds while its live filter silently
ran a different, leakier shape (order 2, 14.2% above its declared corner) than the
module's order-8 Butterworth. A comment promising two copies match is not a check.

So `BROADCAST`, a new live object in the alpha, is built the same shape as `ROOM`:

- `render(AC)`: bakes the carrier (mains ripple, the identical three-partial 60 Hz
  family `ROOM`'s own hum already uses) and the sferics (`crackleInto`'s own half-sine
  impulse algorithm, duplicated rather than imported) into one buffer.
- `play(bus, AC)`: builds the SAME live filter chain `ROOM` uses -- a highpass at 100 Hz
  (Q 0.7) into four cascaded Butterworth lowpass sections at 5000 Hz (order 8) -- and
  plays the buffer once through it. Never a loop: a caught transmission ends and the
  valley is dead air again, the same reasoning the map's arrival cue already used
  ("ride the ambience clock instead of getting one of its own").

## Checked by a machine, not a comment, the exact lesson ROOM already taught

`H.BROADCAST_CONST` on the module side carries the same constants (`toneBeats: 16,
airBeats: 4, beat: 0.5, lo: 100, hi: 5000, crackleRate: 220, crackleAmp: 0.34,
humLevel: 0.62, carrierLevel: 0.30, bandOrder: 8`). `gates/cooked_sounds_gate.js` reads
the alpha's own `BROADCAST` object by its source text (the same technique the `ROOM`
claim already uses, scoped to the object's own block so a pattern cannot match the
wrong thing) and asserts every constant AND the filter order match. 236/0 (was 233/0).

## Deliberately smaller than the judge page's own candidate

The attention tone (`ALERT.a`/`ALERT.b`) and the worn drop-outs stay the richer
candidate's own identity for a later round. What ships live is the two real causes the
carrier is actually made of -- the ripple and the sferics -- which is the part that
reads as "the valley catching a signal," not the part that reads as "an institution's
broadcast."

## Wired into the ambience clock, not a bed of its own

`AMB.pick()` now returns `'valley_broadcast'` on a flat 4% roll, checked first and
valley-wide -- never gated by the local block's own power the way `generator` and
`sign_alive` are, because the whole point of the row's own phrase is that somewhere
still works even when here does not. Rarer than the generator (12.5%) on purpose: a
caught transmission is a ten-second event, not a texture. `AMB.tick()` recognises the
kind and calls the real play function directly (not through `placeSound`/`APPROVED`,
since this is not an SFX-bank event) at -6 dB (half the energy), the same trim this row
already named for the sign, the block lights and the generator in round one.

## Proved on the real page, not assumed from the source

A standalone Playwright check (and `gates/one_engine_gate.js`'s new E10 claim) forces
`AMB.pick()` to return `'valley_broadcast'` for one tick and confirms the real play
path fires exactly once, builds the real order-8 filter chain, and renders a real
buffer -- `{"before":0,"after":1,"bandOrder":8,"hasBuf":true}`, zero page errors.

**Found and named, not fixed here**: the live ambience object must be reached through
`window.__AMB`, never the bare `AMB` identifier. A second, unrelated `var
AMB=[67,61,56]` further down the same file shadows the ambience object's own `var
AMB={...}` by the time the page finishes loading, so a test (or any future code)
reading bare `AMB` gets a palette array instead. This is why `onArrive`'s own E9 claim
already uses `__AMB` and not `AMB` -- discovered freshly this round while writing E10's
own test, not touched, since a rename risks another lane's own array.

## Gates

`gates/cooked_sounds_gate.js`: three new claims (the alpha carries a `BROADCAST`
object; its constants match the module; its filter order matches), 236/0 (was 233/0).
`gates/one_engine_gate.js`: one new claim (E10, the real dispatch from `AMB.tick()` to
the real play function), proven standalone since this gate's own boot is the same
pre-existing break named in every round of this row (PLUMBER territory, confirmed
unrelated again this round).
