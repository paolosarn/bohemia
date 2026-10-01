# V237 — THE STREET HAS KERBS; AND HOW LONG A FIGHT LASTS WHEN YOU USE THE LIT TILES
(COMBAT, `[house tiles back]` round 6, rule 46f, rule 40a)

## WHY

Paolo 10/1: *"the tiles below the people dont look good."* The coordinator's sweep 10/1 B: *"the road,
the sidewalk and kerb, the lot, a dead car and a block wall from the banks are not under the fighters
yet."* His 9/30 UP: *"a street has to be a tile."*

**COOK's block war kit is NOT used.** He voted it DOWN 9/30: *"It looks bad man so ugly."* Checked
before a line was written; the kit's standing roof and burnt house would have replaced this lane's
houses, and he has thrown those pictures out.

## WHAT WAS UNDER THEM

On the house board a road tile was sixteen street cells of plain asphalt and a sidewalk tile sixteen
of plain concrete: V222's lotPatch tiles "only a material". The street bank has carried the median
(the double yellow), both gutters and both kerbs since COOK's 7/28 recook, and **none of them had ever
been under a fighter on this board.** A street read as two flat colours.

## NOW

Each is its real cross-section, column by column, in the bank's own 0.75 m cells (16 across a 12 m
tile), unrotated where the bank says a tile has a direction:

    the road (12 m, two lanes)      gutter | road x7 | the double yellow | road x6 | gutter
    the sidewalk, west              dirt x5 | concrete x10 | kerb facing the road
    the sidewalk, east              kerb facing the road | concrete x10 | dirt x5

**Honest about the picture:** the kerbs and the dirt strip read; **the centre line is faint**, because
at real scale a double yellow is about a fortieth of a twelve-metre tile, three pixels at the game's
camera. It is the true size; whether it should be drawn louder than true is DIRECTION's call.

## MEASURED

`gates/no_atari_gate.js` **17/0**, a new leg: the road is gutter, lanes, ONE median, gutter; the west
sidewalk ends in kerbL and the east one starts with kerbR, each with dirt and concrete; and the floor
really built cross-section tiles in a drawn frame. Same as before: nothing_on_the_ground 14/0,
one_terrain 7/0, camera 7/0, combat_scale 8/0, smoke 1/0, floor_cache 17/0, combat_lab 922/10.

## FIGHT LENGTH (rule 40a), ROUND TWO

`tools/bohemia_fight_length.js` gained a mode: **a bot that follows the game's own lit tiles** (V193's
read, the tiles strictly better than where he stands), holds when standing still is best, and shoots
when a man is in reach. Three fights, real time, capped at five minutes:

    37.2 s (74 beats)   7 of 7 standing   he went down   1 shot, 51 steps
     9.4 s (19 beats)   5 of 5 standing   he went down   2 shots, 3 steps
     4.7 s ( 9 beats)   3 of 3 standing   he went down   1 shot, 1 step

**The finding, said plainly:** following the game's own lit tiles, the bot is downed in 5 to 37
seconds and kills nobody; three men drop him in nine beats. Against the defaults (routine 2 to 4
minutes) that is either a fight far more lethal than the target, or a bot that plays it badly (it
opens the dial the moment a man is in reach, which is exposing himself). **Both are possible and
this lane does not pick one by guessing.** Next: put a recorded human-shaped turn order on it (cover
first, pop only when the man is exposed) and read where the damage comes from beat by beat; the
lethality half goes to TUNING [fight length] as a measured line, not a felt one.

Last round's walk-and-shoot bot, which never hides: 26.1 / 7.8 / 6.4 s, downed each time.

## [bb tiles]

Battle Brothers' battlefield tile is one material with a texture. **What we do differently:** a tile
is a slice of a real street, a house wide, with the parts a street has, so the board is the place.

## ANALOG HORROR LINE

The centre line runs straight through the fight. Nobody has driven on it in years.

---

**Tool:** `tools/bohemia_the_street_has_kerbs_patch.py` (the replay list carries sixteen),
`tools/bohemia_fight_length.js` (cover mode) · **Gate:** `gates/no_atari_gate.js` 17/0 · **VOTE:**
`combat-the-street-has-kerbs-10-1` · **Stamp:** 10/1e · **Tab:** COMBAT, and any fight from CITY.
