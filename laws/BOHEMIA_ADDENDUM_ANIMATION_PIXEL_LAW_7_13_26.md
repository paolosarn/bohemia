# BOHEMIA — ANIMATION-PIXEL LAW + FLASH DIRECTION (Paolo, 7/13/26)

## ANIMATION-PIXEL LAW
Every animation must pinpoint exactly which pixels it touches. Moving parts
(the LEAF) animate; structure (jambs, posts, headers, frames, borders) stays
frozen. A gate's bars rise inside untouched posts. Double doors = TWO leaves,
split at the center seam, left leaf travels west, right leaf travels east,
frame untouched. Leaf rects auto-detected per sprite (edge-profile jamb/header
detection), Paolo verdicts correct detections.

## AESTHETIC DIRECTION (Paolo-stated)
One-man-army, early-Flash / Newgrounds energy: cheap programmatic animation
is ON BRAND and low-key liked — "as long as it's done to 120 BPM everything
really is gonna be OK." Charm over polish; the beat is the polish.

## Consequence
Factory v3 implements leaf detection + two styles (gate_rollup, double_swing).
Applies beyond doors: every animated prop (fans, vents, gauges) declares its
touched-pixel region; static structure never wiggles.
