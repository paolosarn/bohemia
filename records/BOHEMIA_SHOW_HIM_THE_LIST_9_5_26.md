# BOHEMIA — SHOW HIM THE LIST (ANIMATION lane, 9/5/26)

Row: `[your verdicts]` SHOW-HIM-THE-LIST. Tab: **ANIMATION**, the JUDGE ALL button.

---

## THE SURFACE ALREADY EXISTED AND HAD NEVER TAKEN A SINGLE VERDICT

JUDGE ALL has been in the ANIMATION tab since 7/19. Opened this round it read:

> **105 clips · 105 unjudged**

Not "some". All of them. So the question was never "build him a judging page" —
one was already there. The question was why it has never once been used.

**Because every row was A WORD AND TWO THUMBS.** Measured on the real surface: the
judge list starts **1,464 px below the canvas**. To judge `beckon` he had to tap the
word, scroll up nearly two full phone screens to watch the character, then scroll
back down to press a thumb. A hundred and five times.

That is the BOTTOM-UP law (7/26) exactly: *anything he has to scroll up for does not
exist*. A judging page made of words is asking him to judge animations from memory.
The empty verdict count is the proof that nobody can.

## WHAT SHIPPED

**Every row plays its own clip, next to its own thumbs.** Look, tap, next.

- A live canvas per row, running that clip in the current facing.
- **On the beat** — phase off `G.t0` and `BEAT_MS`, the one clock (120 BPM LAW), so
  a row animates in time with the big canvas above it.
- **72 css px**, above the size the game draws it (8/28: judging art below its
  shipping size is judging a thumbnail).
- **The audit's finding on each row**, so he judges informed instead of blind:
  "moves 15%", "QUIET", "head-on only 12% of side-on", "STATIC HOLD, not a cycle",
  "ARMS carry it, legs do not; no crouch first".
- **Three filters** — ALL / UNJUDGED / **THE AUDIT FLAGGED (15)** — because 105 rows
  is a long haul and the ones worth his eye are a short list.
- The .txt export is untouched (verdicts land as a repo file, never .json).

The notes are **generated from** `records/BOHEMIA_THE_63_CLIP_AUDIT_RAW_9_5_26.txt`,
never typed by hand, so a number on his screen always came from a measurement.

## REUSE, NOT A NEW RENDERER

The loop is the CLOTHES tab's, which already runs hundreds of live rigs on one
scrolling page: ~12 fps rather than 60, viewport culling, and **releasing the
backing store** of anything well off screen — its 8/20 lesson, that refusing to
render off-screen is not the same as letting go of the pixels (258 garments held
96.8 MB until it did). Drawing is `drawChar`, the same call the CHARACTER tab makes,
already HD_CACHE-backed so a repeated frame is a map hit.

## THE FIRST LAYOUT WAS WRONG, AND LOOKING IS WHAT SAID SO

The first cut let the note wrap onto its own full-width line. Every row became
~200 px and **four clips fitted on a phone screen** — 26 screens for the set. The
numbers all passed; the picture was the thing that showed it. Canvas left,
name/thumbs/note in a tight column beside it: ~80 px a row, **ten to a screen**.

## THREE RULERS BROKE ON THE WAY, ALL THREE IN THE GATE

Worth the words, because each one would have been a green gate lying:

1. **It asked for the `CLIP_NOTE` global and got zero.** The table is `const` inside
   the panel's own closure. The check was measuring **scope**, and would have gone
   red with the notes rendering perfectly on screen. Fixed by reading the notes off
   the rendered rows — the DOM is the surface, the table is an implementation detail.
2. **It grepped the raw file for the literal percentage and found 8 strays.** They
   were not strays: 100.89 rounds to 101, and "101" appears nowhere in a file that
   stores 100.89. **It was testing my rounding, not the data.**
3. **Then it failed two honest notes on a half-cent.** `drunk` measures **82.50%**
   and `flee-scramble` **90.50%**. The notes are generated in Python, whose `%.0f`
   rounds half to **even** (82, 90); the gate re-rounded in JS, whose `Math.round`
   rounds half **up** (83, 91). Nothing was wrong with the data or the screen — two
   rounding modes met on an exact .5 and the gate called his screen a liar. Both
   neighbours of a measured value are accepted now; a fabricated number still fails.

## GATE

`gates/judge_list_moves_gate.js` — 10 claims, **3 mutations proven caught**:
the canvas removed (back to words), a **still frame** per row, and a fabricated
number on a row. The still-frame case is the one that matters: it satisfies "has a
picture" and "has a body" and is still a list he cannot judge from.

Registered in the suite as JUDGE LIST MOVES.

## WHAT IS STILL HIS

The verdicts. The audit judged nothing and this page judges nothing — it only makes
judging possible. `[clips redone]` RECOOK-WHAT-HE-KILLS is the row that waits on
what he presses here.
