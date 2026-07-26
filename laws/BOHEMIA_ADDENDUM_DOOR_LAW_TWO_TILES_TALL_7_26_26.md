# BOHEMIA — ADDENDUM: THE DOOR LAW (Paolo 7/26/26, LOCKED)

> "Doors are two tiles big... doors are always two tiles tall, two by one, you
> know. We actually already made a lot of doors with even animations where it
> opens. You can't find that anywhere in the fucking files."

## THE LAW
**A DOOR IS ONE TILE WIDE AND TWO TILES TALL. ALWAYS.** Never a one-tile stamp,
never squished to fit a cell, never scaled off its own aspect. A door face stands
ON its tile and rises into the tile above it. (A double/industrial opening is two
of those side by side, i.e. 2 wide x 2 tall — the unit is still 1x2.)

**AND DOORS OPEN.** The animation is not a nice-to-have; it exists and it is
approved:

  `banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt`
  30 clips, 9 frames each, open/close over 2 beats at 120 BPM,
  queue CLOSED 30/30, style verdict recorded 7/13.
  The residential pack ("4. Doors and entrances", 10 clips) is what a house
  wears, and every frame in it is already 88x176 = 1 tile wide, 2 tiles tall.
  The consumption contract is `laws/BOHEMIA_DOOR_ANIM_INTEGRATION_7_13_26.md`:
  passable at frame >= 5, blocks light below it, sfx on frames 1 and 8.

## WHY THIS IS AN ADDENDUM AND NOT A BUG FIX
The bank has existed since 7/13. Nothing consumed it. The walkable surfaces drew
a flat 1x1 gold tile with a still image on it, so for two weeks every door in the
game was the wrong size AND frozen, while an approved animated set sat in `banks/`
untouched. That is the exact failure the REUSE-FIRST law was written for and it
still happened, because REUSE-FIRST only sweeps tools that COOK pixels — it never
asked whether a surface that RENDERS pixels went looking for a bank first.

## THE GATE (a law without a machine gate is not enforced)
- `tools/build_run_slice.js` refuses to ship a door frame that is not 88x176 and
  refuses to build if the approved residential clips are missing from the bank.
- `gates/run_gate.js` asserts, on the real surface: the bank really shipped, the
  door is 1 wide and 2 tall, it carries the full 9-frame clip, a shut door really
  BLOCKS you, and bumping it really advances the leaf across 2 beats.

## THE STANDING ORDER THIS IMPLIES
Before any surface draws a THING the game already has (a door, a car, a sign, a
lamp, a body), it opens `banks/` and uses what is approved. A surface that draws
its own placeholder for something already banked is the same failure as cooking a
duplicate asset. Placeholders that survive a turn get declared in the reply.

---
*BOHEMIA — The Door Law — 7.26.26*
*Two tiles tall, and it opens. It always could.*
