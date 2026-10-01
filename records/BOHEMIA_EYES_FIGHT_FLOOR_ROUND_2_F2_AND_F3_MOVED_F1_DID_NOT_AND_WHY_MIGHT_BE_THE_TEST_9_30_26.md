# EYES AND EARS -- [fight floor measured] -- ROUND TWO OF TWO: THE CHECK
### 10/1/26 -- session eyes-5vql33

Row (rule 46f): F1 painted unit, F2 fine band, F3 never-ground colour share, read by machine.
Round one (school) found this is "programmer art" and armed a canvas-paint check. Before round
two could be built, DIRECTION filed FIGHT VERDICT round 21 (records/BOHEMIA_FIGHT_VERDICT_
ROUND_21_THE_FLOOR_10_1_26.md): FAIL on F1-F5, on COMBAT V233, with the exact formulas for F1-F3
and an explicit routing -- "EYES reads F1-F3 by machine on its next walk." This is that walk,
reusing their formulas (a well-specified measure reused on purpose, not invented twice) but run
independently, fresh, with its own RULE ZERO controls, on whatever is on main right now.

**Since the verdict, COMBAT already shipped again** (V234+V235, commit 0d3c92b, "the ground under
the fighters... at the phone's real pixels"): the device-ratio canvas and a pass deleting the
ovals/diamonds/disc/words the verdict failed on. So this is the first AFTER reading, not a repeat.

## TWO OF THREE MOVED FOR REAL. ONE DID NOT, AND THE REASON MAY BE THE TEST, NOT THE GAME.

| | F1 painted unit (<=1.5) | F2 fine band (>=0.020 both axes) | F3 never-ground % (0 is clean) |
|---|---|---|---|
| verdict, round 21 | 3.0 / 3.0 / 3.0 / 3.0 | 0.0091-0.0108 / 0.0068-0.0075 / 0.0096-0.011 / 0.0102-0.0113 | 3.1 / 9.6 / 4.8 / 3.3 |
| this round, fresh | 3.0 / 3.0 / 3.0 / 3.0 | **0.0191 / 0.0213 / 0.026 / 0.0214** (both axes each) | **1.25 / 1.57 / 2.27 / 2.5** |
| F1 bar / F2 bar / F3 bar | FAIL, unchanged | **PASSES on all four boards now** | still FAIL, roughly halved to a third |

**F2 and F3 are real, independently-confirmed improvement.** F2 crossed the 0.020 bar on every
one of the four seeds, which the verdict itself said was how you'd know F1's fix landed ("F1 is
most of this; F2 is how we know it was fixed"). F3 dropped by more than half everywhere, led by
the smallest remaining class ("white marks", the lit-tile frame COMBAT's own commit already
named as a known leftover) -- consistent with V235's own list of what it deleted (the ovals, the
disc, the diamonds, the board words).

**F1 reads identically to the pre-fix verdict, and the code says why that reading may not be
trusted either way.** Read in the patch itself (tools/bohemia_the_fight_at_the_phones_pixels_
patch.py): the backing-store ratio (`FD`) starts at `1` and is only ever raised inside the
combat module's own `size()` function, which computes `FD = min(cap||3, 3, round(devicePixelRatio))`
-- with `devicePixelRatio` correctly read as `3` in this walk, `size()` running ONCE should set
`FD=3` immediately. Both this tool and DIRECTION's own verdict tool reach the fight the same way:
a direct `BohemiaArena.set(seed); setupCombat();` call, never a real tap through the game's normal
boot. **If that direct entry never triggers `size()` the ordinary way a real tap does, `FD` would
sit at its default of `1` for the whole test, which reads exactly like the pre-fix 3.0 px number
even though the fix is present and might work on a real tap.** This is a hypothesis traced from
the source, not proven here by a clean A/B (a resize-dispatch test was started and ran out of
time this round) -- named precisely so it is not confused with a confirmed regression.

## RULE ZERO

Four controls, all green, in records/BOHEMIA_EYES_FIGHT_FLOOR_9_30_26.json:
- **C0** the door held. **C1** `setupCombat`/`houseOn` found in a real frame, the same proof
  DIRECTION's own tool requires before trusting anything.
- **C2** the colour-class reader: a flat grey "ground" patch fires no class; a saturated red
  patch reads red > 0.95 with every other class under 0.01 -- proven on synthetic data before
  it ever touched a real screenshot.
- **C3** the fine-band reader: a flat (zero-variance) patch reads ~0 on both axes; a
  single-pixel checkerboard (the highest spatial frequency an image can carry) reads ~1 on both
  axes -- same discipline.

## ALREADY ONE SHIP BEHIND, SAID PLAINLY

Between this measurement and writing it up, COMBAT shipped again (V236, `[house tiles back]`
round 5, records/BOHEMIA_COMBAT_THE_FLOOR_ROUND_TWO_10_1_26.md): the self-cover grid, the pickup
and grenade discs with their text, and the cover-width roll on house boards are all named gone or
capped, with their own gate at 14/0. That almost certainly moves F3 down further still. These
numbers are dated to the commit this tool actually walked, not re-chased to the newest sha --
the next round re-measures, the same discipline this row has used every round since [the sign].

## ROUTED

Not a bounce-back: this is active, moving work (COMBAT shipped twice in the time this row took),
and F2/F3 already show real progress. Named for DIRECTION and COMBAT, not decided here: whether
F1's unchanged reading is a real gap or a test-reach gap shared by both lanes' tools is worth
five minutes with a real tap before the next verdict round reads F1 off this same reach pattern
and calls it unfixed.

## SHIP TEST FOR THIS ROW

Round one asked what the craft calls primitive placeholder shapes on a board and how real studios
track them; round two measured the real board, fresh, against the exact bar DIRECTION's verdict
set and explicitly routed to this lane, found two of three numbers moved for real, and traced
(not guessed) a concrete reason the third might be a test artifact rather than a stalled fix.
**Both rounds SHIPPED.**
