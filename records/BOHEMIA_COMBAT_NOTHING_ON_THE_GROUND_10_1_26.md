# V234 + V235 — THE GROUND UNDER THE FIGHTERS (COMBAT, `[house tiles back]` round 4, rule 46f; `[device canvas]`)

## HIS WORDS, AND THE RULING

**Paolo 10/1:** *"Also combat is soooo fucked up bro holy shit the tiles below the people dont look
good man its all fucked up."*

**Rule 46f (coordinator, LOCKED, records/BOHEMIA_PAOLO_COMBAT_IS_FUCKED_UP_THE_TILES_BELOW_THE_PEOPLE_10_1_26.md):**
the floor under the fighters is the fight's first measure; nothing on the ground that is not the
ground (no pads, ovals, diamonds, discs, stickers or words); a place is shown by lighting its square
tile in the ground's own colour; names live in the HUD; and [device canvas] is step one of this row.

The coordinator saw, on this lane's own 9/30 card: pale blue OVALS (13.9% of the board), tan
CARDBOARD cover, DIAMONDS, a RED DISC, ROSA and CLEAR drawn on top of each other, every painted pixel
a 3x3 block. Every one was on DIRECTION's STILL WRONG list. **This lane shipped three rounds around
the floor and left it. That is on me.**

## WHAT EACH ONE WAS, FOUND IN THE SOURCE BEFORE IT WAS TOUCHED

| on the floor | what drew it | now |
|---|---|---|
| 3x3 blocks | V224 (mine) put the canvas at one backing pixel per CSS pixel | backing store at the phone's ratio (V234) |
| blue ovals, tan cardboard | the cover sprite: a wall-tile face under an ELLIPSE LID `#7a94a8` / `#94836a`, on an elliptical shadow | a flat top face cut from the same wall, lit from above; a square shadow |
| diamonds + CLEAR | V193's ground read: blue diamonds, the best tile's worth in words | the square tile itself, lit in the ground's colour; no words |
| red disc | V148's "can he reach you" pip, sized off the TILE PITCH: on the house board a 25 px disc 137 px above a man | a 5 px dot just over his head, sized off his body |
| ROSA | her name on the board, a green ellipse under her feet | gone; her name is in the HUD line, her health a small bar on her |
| OUT, HOLD | pulsing blue discs, dashed rings, words | each is its tile, lit (the way out the strongest, on the beat) |
| range ring | a dashed red circle round the man you aim at | gone; the aim cue is the HUD ring |

## V234: THE PHONE'S REAL PIXELS, WITH EVERY RULE IN SCREEN UNITS

The canvas's backing store is the phone's real pixels (an integer ratio up to 3) and **every rule
stays in screen units**: the canvas reports its CSS size to the game and the context multiplies each
transform the game sets by the ratio. The man is still 112 on the glass, a house still 196; every
gate that reads a size reads the same number. Under it the ground is BUILT at the real pixels (the
lot's street cells, the road tile, the standing house, the floor's cached picture) and drawn back at
screen size, 1:1 on the phone.

**THE COST, MEASURED AND NOT HIDDEN.** In this container, which paints in software: the game's own
work per frame is unchanged (`draw()` median **1.5 ms before, 1.6 ms after**), and the frame rate fell
**49 -> 16** at the full ratio, because the painting is nine times the pixels. A phone paints on its
graphics chip, but that is **not proven on his phone from here**. So the fight carries a **safety
valve**: in a settled fight (cover phase, 4 s after setup, never the boot), if two windows of 90
frames run under 40 a second, it steps the ratio down one (3 -> 2 -> 1) and records why in
`G._fdDrop`. Seen working here: it settled at ratio 2, about 40-44 fps. A fast phone keeps every
pixel; a slow one keeps its speed.

## MEASURED

`gates/nothing_on_the_ground_gate.js` **11/0**, new, on the one driver at a 3x phone, by WATCHING THE
DRAW CALLS over 32 frames of 16 arenas: backing 1170x1905 for a 390x641 screen; the game still reads
390 wide and the man is 112; **0 oval lids, 0 diamonds or blue discs, 0 words on the board, the
reach dot 5.0 px on the glass, 0 ovals under Rosa**; the valve present and honest; no page errors.

Same as main: no_atari 16/0, camera 7/0, one_terrain_effect 7/0, combat_scale 8/0, smoke 1/0,
fight_floor_cache 17/0, combat_lab 922/10, one_mode 7/4. `combat_lab` went to 14 with V235 on four
TEXT PINS of the exact old lines (the pip's tile-pitch size twice, the ground blit, the lid colours);
re-pointed with the ruling beside each, back to main's 10. `combat_floor` is 12/1 **on main too** (the
city floor painter's opaque count, B2), not this lane's.

**FIGHT LENGTH (rule 40a): NOT MEASURED**, fourth round saying so.

## WHAT IS STILL WRONG ON THE FLOOR (for DIRECTION's verdict 21, said before it is found)

1. The cover pieces are still the house-sized width the corridor rule gives them (`ring*1.8*r`): they
   read as low stone walls now, not cardboard, but a wall 1.8 houses long is a lot of wall.
2. The lit tiles' one-pixel frame reads faintly as a grid where many tiles are lit at once.
3. The people's art is authored at 112, so on a 3x phone a person is still 3x3 per art pixel: that
   is the art's own density (CHARACTER), not the canvas.
4. Drops (rounds on the ground) and the grenade marker are still discs; they are things on the
   ground, and next.

## [bb floor]

Battle Brothers' battlefield shows the ground and the men; what you can do is in the tile highlight
and the HUD, never written on the grass. **What we do differently:** the highlight is the tile's own
ground lit a value brighter on the beat, and the board is the street you were on, at your phone's
real pixels.

## ANALOG HORROR LINE

The only light on the board is the square you should stand on, and it breathes with the beat.

---

**Tools:** `tools/bohemia_the_fight_at_the_phones_pixels_patch.py` (V234),
`tools/bohemia_nothing_on_the_ground_but_the_ground_patch.py` (V235); the replay list carries
fourteen · **Gate:** `gates/nothing_on_the_ground_gate.js` 11/0 · **VOTE:**
`combat-nothing-on-the-ground-10-1` · **Stamp:** 10/1b · **Tab:** COMBAT, and any fight from CITY.
