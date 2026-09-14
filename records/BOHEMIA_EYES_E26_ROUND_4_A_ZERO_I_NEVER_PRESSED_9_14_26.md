# THE STRANGER'S LIST, ROUND 4: A ZERO I NEVER PRESSED

EYES AND EARS, lane 17, E26 [five minutes], STANDING. 9/14/26.
Law: laws/BOHEMIA_ADDENDUM_THE_FIVE_MINUTES_9_13_26.md (Paolo 9/13, LOCKED).
Charter: laws/BOHEMIA_ADDENDUM_EYES_AND_EARS_9_4_26.md. Mode: SCHOOL THEN CHECK.

---

## THE HEADLINE, AND IT IS AGAINST MY OWN WORK

**Round 3 of this job put "two real buttons that do nothing" on his front page. Round 4 walked
a demo file that had not changed by one byte and found ZERO. Nobody fixed anything in between.
I measured why, and there were THREE separate holes in my own instrument, all of them proved
and all of them closed this round.**

The file: `slices/BOHEMIA_DEMO.html`, md5 `f5f706f61a0e905437e7a36d54e7004c`, last touched by
`fe1cca0`. Unchanged across every walk below.

An instrument nobody trusts gets ignored. An instrument that is trusted and wrong sends people
to work on nothing. Two lanes shipped against item 2 of my last list.

---

## HOLE ONE: A ZERO WITH NO DENOMINATOR

Three clean walks, one at a time, nothing else driving a browser, file hashed before and after
(`tools/bohemia_eyes_same_twice.py`, which keeps each walk's own result instead of letting them
overwrite each other, which is what they had been doing all along).

```
run 1   dead 0   inert 11   first tappable 3.02 s   109 holds of the dial   28 taps
run 2   dead 0   inert 10   first tappable 3.01 s   108 holds               29 taps
run 3   dead 0   inert 10   first tappable 3.07 s   109 holds               28 taps

HELD across all three (may be said as facts):
  no fight surface in five minutes, 0 page errors, 3 console errors, 1 failed request
MOVED across all three on an unchanged file (may NOT be said as facts):
  first tappable   3.02 / 3.01 / 3.07      inert count   11 / 10 / 10
```

**In all three walks the route never pressed BUILD at all.** Not once, across 85 taps. So the
zero was never a measurement, it was the absence of one, printed in the same column as a
measurement. The "FIXED TAP SCRIPT" is not fixed: it presses the biggest thing, then cards,
then the map, then whatever is NEW on screen, and what is new depends on what the last tap
opened. The route is emergent, so coverage is emergent, so a count of dead things over it
counts nothing in particular.

**CLOSED:** every item this lane has ever called dead is now pressed on purpose, by id, every
run, before any wandering. And a named item that is not on screen is reported as such, with the
source asked separately so that "my route cannot reach it" and "it was removed from the game"
are different answers -- collapsing those two would be the same false zero one level up.

## HOLE TWO: THE DETECTOR WAS READING THE WORLD AND CALLING IT A FINGER

The verdict was `after.txt !== before.txt || after.pix !== before.pix`. Equality, on a
signature containing the game's own clock and a canvas that keeps drawing. Anything the world
did inside the 1.2 s watch window was credited to the tap. That is why the same row flips: "THE
CUSTOM" is inert in runs 2 and 3 and alive in run 1; "CHURCH" is inert in 1 and 3 and alive in 2.

Three attempts, and the first two FAILED THEIR OWN CONTROLS, which is the only reason I know
the third one works:

**Attempt 1, a margin over one null window.** Hold still for exactly as long as you will watch,
measure what the screen does untouched, require the tap to beat it. **The planted
handlerless button was called ALIVE.** Four words arrived in its watch window that no finger
asked for.

**Attempt 2, the same verdict twice.** A rare burst should not land in both windows. **Now BOTH
controls failed** -- the dead one still read alive, and the live one read UNDECIDED. A separate
60-second probe (`tools/bohemia_eyes_what_moves_alone.js`) named both causes instead of leaving
me to guess at a threshold: the world's own writing is BURSTY and a burst is longer than one
window, so it straddles the null window and the watch window unevenly; and comparing words as a
SET is blind to a repeat, so the live control appending the same word every press was invisible
on press two.

**Attempt 3, the noise ledger, and it passes.** Words are COUNTED, not setted. Eight windows of
holding completely still warm up a ledger of everything the screen has ever been seen doing
untouched -- every word whose count moved, every pixel sample that moved. A tap counts only if
it moves something that has NEVER moved on its own. Evidence accumulated over the whole run,
instead of a threshold guessed once.

```
DEAD READS DEAD    a planted button with no handler      -> "did nothing"    GREEN
ALIVE READS ALIVE  a planted button that writes one word -> "did something"  GREEN
                   both with the world running and the clock ticking, which is the hard case
```

**What the world writes with nobody touching it, by name: 12 words.** The clock (`06:01`,
`06:02`), the music line (`THE WIND LEARNS WORDS`, `MUSIC`), and a control that comes and goes
on its own (`STEP BACK AND SEE THE CITY`). 3 of 30 windows moved untouched. Not often. Often
enough to have been poisoning every verdict.

## HOLE THREE: I HAD THE SHAPE OF THE DEMO WRONG, AND I SAID IT ON HIS FRONT PAGE

Round 3 published: "everything six lanes shipped against his list is one cut away from him."
**Too broad, and now measured wrong.** The demo does not contain the game, it LOADS it. Of the
17 files the page actually fetches, exactly ONE is the demo file, and it is 12% of the 46.5 MB
bundle. The other 88% -- world, tiles, floors, props -- is loaded by path and is therefore
LIVE: the moment a lane pushes it, he is playing it. The world file alone has taken 21 commits
since the cut and he has had every one of them.

So there are two numbers and I published only the first:

- **FROZEN**, 12%: the shell. Splash, cards, build stamp, and the fight blob. Only a re-cut moves it.
- **LIVE**, 88%: everything the shell loads by path. No cut needed at all.

The font fix is genuinely stuck, because it lives inside the frozen shell's fight blob: Space
Grotesk 42 and fonts.googleapis 2 in the demo against 0 and 0 in the alpha. **The dead BUILD
button fix is NOT stuck.** It is in the world file, so it reached him the moment LIFE + CITY
pushed it, and their note says the honest thing: the buttons were never handlerless, the panel
just re-wrote a sentence he had already read, so to a thumb they were dead, and now they go
visibly off when the purse cannot meet the price.

`gates/demo_staleness_meter.js` reports both sides and never fails. Only THE RUN may re-cut,
and E3 measured that a checker whose reader cannot fix it gets muted inside a week. Its
selftest now refuses a one-sided answer, because reporting 100% frozen would reproduce exactly
the claim it exists to correct.

---

## WHAT THE PROVEN INSTRUMENT FOUND

Nine things pressed, each one twice, each against its own fresh null window. Nine verdicts I can
defend beats twenty-nine I cannot.

**TWO DEAD ROWS, BOTH ON THE FIRST CARD A STRANGER SEES.** "Half of it now, before I go" and
"I'LL TAKE IT", each 320x44, each inside the day card. Pressed twice, nothing novel either time.
Rule 14(d) in his own words: a card that promises something and does nothing is the worst bug in
the game. This is the third round the first of those two has been measured dead, and it is now
measured by an instrument that passes both its planted controls.

"GET UP" moved the screen on one press and not the other, which is exactly right for a control
that only fires once. It is reported that way and never counted as dead.

Still no fight surface in five minutes, on every walk. First tappable 3.0 s. 0 page errors, 3
console errors, 1 failed request, and the failed request is the Google Fonts fetch from the
frozen shell.

---

## BLIND SPOTS, STATED

This instrument does not judge pictures, so it cannot see the streets break or the freeway
break. My route never reaches the build panel, so the two named items are unconfirmed on the
glass and I say so rather than scoring them. The route never reaches PRETTY MAP or DROP IN. The
watcher is not a stranger, so the list never claims naivety. The named list only names what an
earlier round happened to press, so coverage is a floor and never a total.

---

## WRONG VERSIONS, KEPT ON PURPOSE

- **The repeat harness v1 ran its three walks IN PARALLEL** to save wall clock, and caused the
  exact contamination it was built to measure: two walks share one output path and one shot
  folder, and one shot folder on disk ended up holding frames from two different browsers. It
  is sequential now and refuses to start if another walk is running.
- **The repeat harness v2 compared whole results with `==`**, so the timestamp and every
  per-item timing always differed, everything always "moved", and it said nothing at all.
- **The change detector, three times, above.** Each failure is a control in the tool now.
- **The controls left themselves in the picture**: the paired press appended the live control's
  span twice, `getElementById` removed one, and the wandering loop then put my own scaffolding
  into his list. Removed by query, not by id.

## PROOF

- `tools/bohemia_eyes_same_twice.py` (new), four controls green
- `tools/bohemia_eyes_what_moves_alone.js` (new), the 60-second untouched probe
- `tools/bohemia_eyes_five_minutes.js`: counted words, the noise ledger, the warm-up, the named
  list, and two planted controls that both now pass on the live surface
- `gates/demo_staleness_meter.js`, registered in the suite as DEMO STALENESS, report-only
- `records/BOHEMIA_EYES_E26_REPEAT_9_14_26.json`, `records/eyes_e26_repeat/run{1,2,3}.json`,
  `records/BOHEMIA_EYES_E26_WHAT_MOVES_ALONE_9_14_26.json`,
  `records/BOHEMIA_EYES_E26_WALK_DEMO_9_14_26.json`
