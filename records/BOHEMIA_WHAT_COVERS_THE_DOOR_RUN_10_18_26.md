# WHAT COVERS THE DOOR (RUN, 10/18/26, [the long freeze], rule 94: the cord's counting walk)

> **THE QUESTION (the coordinator, sweep AM, 10/17):** "THE WALK DID NOT COUNT: 6 of 21 taps reached a control, 15 were
> covered by something on the glass at the door ... New on your row: what covers the controls at the door now (the region
> map? a new panel?), measured, not guessed." The cord lifts when a counting walk (20 or more landed taps) shows no stall
> over 3 s on two runs.

## THE ANSWER: NOTHING IN THE GAME COVERS THE DOOR. THE WALK COVERED ITSELF.
Measured on the committed demo (main 056edbc), every one of the 21 things the walk listed at the door, one at a time, with
`elementFromPoint` at its middle (scratch probe, the one driver):

| what the walk listed | count | what it really is |
|---|---|---|
| 240, 0, the dash, 06:00 | 4 | the bar's READOUTS (batteries, the day, the clock). Text, not controls; nothing to press |
| SUBURB | 1 | the district label's hidden half (zero size) |
| @thevalley, @marisol_v | 2 | feed posts scrolled BELOW the phone's clipped screen: the canvas is what sits under their middle |
| NOTES, the signal, the feed's people and prices, the five speeds | 14 | real controls, every one on top at the door |

So 14 real controls, all reachable. The walk failed on four things of its own:
1. **It counted readouts and clipped posts as controls** (7 of the 21): its list is every short text on the glass.
2. **It checked a tap by a selector that throws.** A control with no id was tapped by its words but then checked with
   `querySelector('text="..."')`, which is not CSS and throws, so the walk filed it as never tapped. That is the 15.
3. **It asked "did I reach it?" AFTER the tap.** NOTES opens the notes box over the whole wrap (z 60), so the tap that
   worked was filed as covered by the box it had just opened.
4. **It never closed what it opened.** The driver's card-closer looked for `text="CLOSE"` and the first one on the page is
   the phone's hidden close (`span#phoneclose`), so the notes box's own CLOSE was never pressed and every tap after NOTES
   landed on the box.

## THE FIX (instruments only, plus one real error in the game)
- `tools/bohemia_five_minutes.js`: a control is something that says it can be pressed (a pointer, a button, a role), with
  its middle inside every box that clips it, marked with `data-fm` so the tap and the check find the same element; reach is
  asked BEFORE the finger goes down and a covered control is not pressed; a blocked tap now NAMES what covered it; after a
  blocked tap the walk presses the topmost exit word (CLOSE, SAVE AND KEEP PLAYING...), the way he would.
- `tools/bohemia_drive_the_demo.js` `clearCards`: `text="X" >> visible=true`, so a hidden CLOSE is never the one pressed.
  The driver's `controls()` is shared by other gates and is unchanged.
- **The one page error was the game's:** the notes box's COPY ALL called `navigator.clipboard.writeText` and said COPIED
  at once; a refused write rejects its promise a moment later, uncaught ("Write permission denied") and the chip lied. Now
  the refusal is caught, the old copy road runs, and the chip says what happened (slices/BOHEMIA_CITY_WORLD.html).

## THE COUNTING WALKS (five minutes at 4x, tools/bohemia_five_minutes.js --throttle 4)
| walk | tree | door | taps landed / tried | covered (named) | stalls over a beat | WORST STALL | fps | page errors |
|---|---|---|---|---|---|---|---|---|
| 1 | main 056edbc | 17.8 s | 55 / 109 | 32 | 9 | **1,283 ms** | 51.1 | 1 (the clipboard, below) |
| 2 | this round, before the clipboard fix | 19.0 s | 51 / 103 | 25 | 21 | **1,317 ms** | n/a | 1 (the same) |
| 3 | this round, all of it | 21.5 s | 61 / 105 | 26 | 12 | **1,250 ms** | 50.6 | 0 |

Every walk COUNTS (20 or more landed taps; it was 6). Dead taps: 0, 0, 2; the two in walk three are 5x pressed while
already at 5x, which correctly changes nothing. The same quick walk before the fix landed 1 of 21.

What still covers a control during the walk is the game working: the phone app (opened by the feed's signal or a post)
sits over the feed and over the speed pad's right end (5x), and the notes box sits over everything until CLOSE. One
finding for UI: **with the phone open, 5x is under it** (four taps in walk two). Not this row's.

## WHAT THIS MEANS FOR THE CORD
Three counting walks in a row, worst stall 1.25 to 1.32 s, none near 3 s: the cord's own condition (two counting walks,
no stall over 3 s) is met on the committed demo and on this round's tree. Lifting it is the coordinator's call at the next
sweep. The row's own end state (no stall over a beat, 500 ms) is NOT met: 9 to 21 stalls over a beat a walk remain, each
one whole map draw (0.6 to 0.9 s at 4x, records/BOHEMIA_THE_LONG_FREEZE_RUN_10_16_26.md); the map has to draw cheaper.

## PROOF
`node tools/bohemia_five_minutes.js --throttle 4` (five minutes; `--quick` for one); the per-run JSON in
`records/BOHEMIA_FIVE_MINUTES.json` now carries `coveredBy`.
