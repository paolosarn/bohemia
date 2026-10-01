# V236 — A STREET IS ONE TILE; THE FLOOR, ROUND TWO: NO GRID, NO DISCS, COVER NO WIDER THAN A HOUSE; AND THE FIRST FIGHT-LENGTH NUMBER
(COMBAT, `[house tiles back]` round 5, rule 46f, rule 40a)

## WHY

Paolo 10/1: *"the tiles below the people dont look good."* Rule 46f: nothing on the ground that is not
the ground. V235 named what it left before anybody else could (the cover's length, the lit-tile frame,
the drops and the grenade). Reading the source for those found the one he could actually SEE as a grid.

## HIS VOTE, BUILT THE SAME ROUND

`combat-a-street-of-houses-9-30` **UP**: *"Yeah, like a street has to be a tile bro if it's a freeway it
might be three or four you know like come on"* (rule 46g). V231 made the street two tiles of road; it is
ONE now, a sidewalk each side, then the lots (the right lot starts a tile nearer; parked cars on the one
road tile, same die). At the game's camera the houses now stand at both edges of the glass. The
freeway's three or four waits for the cutter to read the road class ([board generator]).

## WHAT EACH ONE WAS, AND NOW

| on the floor | the source | now |
|---|---|---|
| **the grid round him** | "my 3x3 self-cover ring" (V7): eight dark squares with a drawn outline round him, every frame; its `up` branch is hard-wired false, so all it ever drew was the outline | gone; the HUD ring (V226) says where he can step |
| the lit tile's frame | V235's own `litTile` drew a one-pixel border, a grid where several were lit | fill only |
| the grenade | a pulsing red disc, a dashed ring, the fuse in 0.85-tile digits | its tile lit red, pulsing faster as the fuse runs; no digits on the floor |
| the pickups | a pulsing green disc, a dashed ring, AMMO / PLATE / TAKE / KEY | its tile lit, the thing on it (a small case: brass top a key, steel a plate, cloth the rest) |
| the cover's width | r rolled 0.45-1.15 TILES on every board (written for a 1.5 m tile): on the house board a wall up to two houses (24 m) | on the house board r <= 0.56, no piece wider than one house; same dice |
| the motif under the board | `drawFloor`'s faction motif, ~85 strokes a frame, always covered by the floor (V223 photographed it) | not drawn on the house board (paint for nothing at the phone's pixels) |

## MEASURED

`gates/nothing_on_the_ground_gate.js` **14/0** (three new legs, plus a pickup and a live grenade put on
the board while the draw calls are watched): **0 grid strokes, 0 outlined squares, 0 discs, no AMMO /
PLATE / TAKE / KEY, widest cover r 0.560**; and the eleven legs of last round still green.

Same as main: no_atari 16/0, camera 7/0, one_terrain 7/0, combat_scale 8/0, smoke 1/0, floor_cache
17/0, combat_lab 922/10 (one text pin, COVER HAS A SIZE, re-pointed: still 0.45-1.15 on the body board,
capped on the house board), one_mode 7/4.

## THE FIRST FIGHT-LENGTH NUMBER (rule 40a, owed four rounds)

`tools/bohemia_fight_length.js`, through the one driver, real time, on the real board: a bot that uses
only his buttons (the ring, FIRE to open the dial, FIRE in the kill zone), walks toward the nearest man
and shoots when he is in reach, and NEVER takes cover. Three fights:

    26.1 s (52 beats)   6 of 7 standing   he went down
     7.8 s (16 beats)   3 of 5 standing   he went down
     6.4 s (13 beats)   2 of 3 standing   he went down

**What it says:** a fight played by somebody who never hides is lost in 6 to 26 seconds. **What it does
NOT say:** how long a fight lasts when played well; the defaults (routine 2 to 4 minutes, tough 8 to
15) are untested by a player who uses cover. Next is a bot that does (cover first, then shoot), so the
number is a fight and not a walk into fire. One earlier run of the same seed wandered onto the way out
at 78 s: also recorded, also not a fight played well.

## [bb floor]

Battle Brothers puts nothing on the grass but the men and what is lying there. **What we do
differently:** what is lying there is the thing itself on its lit tile, and a grenade's danger is the
tile breathing faster, never a number.

## ANALOG HORROR LINE

The square under the grenade breathes faster. Nothing on the screen counts down out loud.

---

**Tool:** `tools/bohemia_the_floor_round_two_patch.py` (the replay list carries fifteen) and
`tools/bohemia_fight_length.js` · **Gate:** `gates/nothing_on_the_ground_gate.js` 14/0 · **VOTE:**
`combat-the-floor-round-two-10-1` · **Stamp:** 10/1d · **Tab:** COMBAT, and any fight from CITY.
