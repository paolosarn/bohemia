# V232 — A HOUSE IS NEVER SMALLER THAN A MAN (COMBAT, `[house tiles back]`, round 2)

## THE RULINGS, AND WHY THEY COLLIDED

- **Overworld law s14 (Paolo 9/28):** *"for the combat a tile is as big as a house."*
- **Rule 37a (Paolo 9/27):** *"'tiny character' means SMALL RELATIVE TO BUILDINGS."*
- **Rule 21:** the person is one pixel size (112); the camera moves the ground, never him.
- **V23 (the auto frame):** *"Pinch works, but can't LOSE anyone"* — the camera pulls back until
  the farthest living enemy fits.

Measured last round and again this round before changing anything: the auto frame sat at its 0.20
floor in **40 of 40** arenas, because enemies stand up to six houses out. With the man held at 112
that drew **a house 39 px wide beside a 112 px man**: a third of him. Each ruling was being kept
alone; together they broke 37a on every fight.

## THE TRADE, DECIDED (rule 39a: build it, don't ask)

On the house board the camera stops pulling back where a house is **as wide as the man**
(uz = 112/196 = 0.571). The enemies the glass cannot hold are not lost: each gets a **marker on the
edge of the glass**, a chevron where the line from him to that man leaves the screen, and the
distance in houses; bone when he is only standing there, red when he is aiming at you, pulsing on
the beat. Pinching still goes wider; that is his hand, not the camera's choice. The body board
keeps its 0.20. The dial phase already frames at 1 (V56) and is untouched.

| | camera | a house on the glass | the man |
|---|---|---|---|
| before | 0.20 in 40 of 40 | 39 px | 112 px |
| after | 0.571 in 24 of 24 | 112 px | 112 px |

## MEASURED

`gates/a_house_is_never_smaller_than_a_man_gate.js` **7/0**, on the one driver, 24 real fights with
the camera left to itself: a house never under the man (0 of 24), **nobody lost** (every living
enemy is wholly on the glass or marked: 99 on the edge, 23 on the glass), every marker inside the
glass, the body board's floor still 0.20, no page errors.

The top inset clears the three-line banner (measured 6 to 56 px from the top of the canvas); the
first cut put three markers under it, found by photograph.

Same as main: no_atari 13/0, combat_scale 8/0, runs_smoke 1/0, fight_floor_cache 17/0,
one_terrain_effect 7/0, combat_floor 13/0, one_mode 7/4, the_person_is_112 13/8,
fight_moves_you 0/1. `combat_lab_gate` went 10 -> 12 red with this change: two TEXT PINS on the
exact old camera line (`uzT=Math.max(0.20,...)`, SMART CAM and V45 CAMERA FLOOR). Re-pointed to
the new line and to camFloor's own 0.20 for the body board, with the reason beside them; back to
main's 10.

**FIGHT LENGTH (rule 40a asks every test fight's length): NOT MEASURED.** No gate or tool in this
lane plays a fight to its end; the fights above are measured in their cover phase. A driver that
plays one through (him on the dial, the company on its gambits) is what [fight feel]'s ship test
needs anyway; it is named here instead of a guessed number.

## WHAT THIS CHANGES THAT HE WILL FEEL

At the bell he sees about one enemy on the glass and four on the edge (23 against 99 over 24
fights). The fight comes TO him across the edge, which is the RF4 shape (the room you are in, and
what is coming through its doors), where the old frame showed the whole board as a map.

## WHAT IS NEXT

1. **The cover is drawn house-sized.** The blue-topped barrels cover most of the street in the
   photograph (a piece is `ring*1.8*r` wide, sized to the tile, not to a barrel). With COOK and
   `[cover honest]`: cover drawn at the size of the thing, from the walk's banks.
2. **The house the high ground stands on is at the glass's edge** at this zoom (two houses left of
   him, half on screen). It is marked by the stair chevron; nothing else needs to move.
3. 37g: how a tap moves a man on the square grid, and the glide (37h, with ANIMATION).

## [bb camera]

Battle Brothers lets you pull the whole battlefield into one screen, and every man shrinks with it.
**What we do differently:** the man never shrinks and a house never gets smaller than him; what
the glass cannot hold is said at its edge, so the city stays the size of a city around him.

## ANALOG HORROR LINE

The number on the edge counts down as he comes. You do not see him yet.

---

**Tool:** `tools/bohemia_a_house_is_never_smaller_than_a_man_patch.py` (the replay list carries
eleven) · **Gate:** `gates/a_house_is_never_smaller_than_a_man_gate.js` 7/0 · **VOTE:**
`combat-a-house-is-never-smaller-than-a-man-9-29` · **Stamp:** 9/29b · **Tab:** COMBAT, and any fight from CITY.
