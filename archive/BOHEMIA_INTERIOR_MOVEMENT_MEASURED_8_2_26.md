# "WHY WHEN I ENTER A HOUSE I CANT GO LEFT AND RIGHT" -- MEASURED (8/2/26)

## MOVEMENT IS NOT RESTRICTED. I measured it rather than assuming.

Entered real houses in the suburb the run opens in, through their real doors,
then flood-filled every cell reachable from where the player lands using the
game's OWN movement predicate and its OWN 8-direction table:

| plate | reachable cells | span | rooms | floor / wall / door |
|---|---:|---|---:|---|
| 13x12 | 94 | 11w x 11h | 4 | 90 / 62 / 4 |
| 13x12 | 95 | 11w x 11h | 4 | 90 / 61 / 5 |

Eleven cells of movement left-to-right, four rooms, ninety floor tiles. The
interior mover already handles all EIGHT directions (`DIRS` is the same
8-entry table the outdoors uses) and `inPassable()` admits floor and door.
**There is no missing left/right.**

## SO WHAT IS HE SEEING

Two real things, neither of which is a movement bug:

**1. THE CAMERA DOES NOT MOVE.** `renderInside()` FITS THE WHOLE PLATE to the
phone:
```js
let C=Math.floor(Math.min(cv.width*0.88/fp.W, cv.height*0.64/fp.H));
```
Outdoors the camera follows the body and the world scrolls under you. Indoors the
room is pinned and only a small figure shifts a few pixels. Pressing left does
almost nothing to the screen, which reads exactly as "I can't go left and right"
even though the body is moving. The fit-the-plate choice has a good reason in its
own comment (a 5x12 apartment at walk zoom is a stamp in a sea of black) -- but the
cost is that motion stops being legible, and that cost was never weighed against
this complaint.

**2. IT IS STILL A SEPARATE WORLD.** `INSIDE.fp` is a floorplan grid generated on
entry, with its own mover (`stepOnce` is REPLACED while inside), its own passability
function, and its own camera. That is precisely the mode swap
records/BOHEMIA_ONE_WORLD_INTERIORS_SPEC_7_31_26.md exists to delete, and it is
the same root cause as four of his other complaints:

> "i want it like project zomboid when you enter a house you still are part of the
> same world no loading screens"

## THEREFORE

This item is NOT a standalone bug to patch. It is a symptom of the interior being
a stamped floorplan instead of part of the world, and it closes when steps 2-6 of
the one-world spec land -- along with windows matching outside, interior walls, and
interior floors. Patching the camera alone would make the symptom quieter while
leaving the cause, which is the kind of half-fix this project has already paid for
repeatedly.

**Step 1 is shipped** (engine/bohemia_rooms.js: every cell carries a room and roof
id, gated). Step 2 is stamping the floorplan into the world grid.
