# V241 — REACH IS LIT ON THE TILES; [house tiles back] CLOSES
(COMBAT, `[house tiles back]` round 9, the 9/22 ruling)

## HIS WORDS

Paolo 9/22, LOCKED: *"reach lit on the tiles (pistol 1, rifle 2, scope 3)"*. Rule 46f: a place is shown by
lighting its square tile in the ground's own colour.

## WHAT WAS ON THE BOARD, MEASURED FIRST

The fight has known every gun's reach in houses since V218 (a pistol the eight houses round him, sqrt 2; a
rifle two; a scope three; the dark shrinks it, V98) and **nothing on the board ever showed it**. Whether a man
could be shot from where he stood was a guess.

## NOW

In the cover phase, every tile his gun reaches is lit faintly in the ground's own colour, flat at 45 (V240);
a tile with a man on it inside that reach is lit stronger, on the beat. It reads the game's own reach
(`maxRange(myRange())`), so the light and the shot can never disagree, and it changes the moment he swaps
guns or night falls. Tiles under a house are not lit. No ring, no outline, no number.

## MEASURED

`gates/reach_is_lit_gate.js` **8/0**, new, in the suite: for each gun the lit tiles are EXACTLY the tiles the
game says he can shoot (pistol 8 of 8, rifle 10 of 10, scope 22 of 22, minus houses), the reach is the
ruling's (1.414 / 2 / 3), and a man in reach is lit stronger. **3/5 on the build before.**

**A gate of someone else's fixed, because my own V234 broke it:** `gates/fight_floor_cache_gate.js` read 13/4
on main, on V240, and on V239. Its test canvas was a plain canvas while the game's has been hiDPI since V234,
so whenever the phone ratio was above 1 the camera matrices differed and the cache stood down (correctly);
it only passed when the safety valve had dropped the ratio to 1. The test canvas is now built the way the
game builds #cv: **17/0** on V240 and V241.

nothing_on_the_ground 18/0, no_atari 20/0, every_fight_ends 10/0, combat_lab 923/9, one_terrain 7/0.

## FIGHT LENGTH (rule 40a)

Cover bot, three fights, real time, full health each: **60.1 s** (downed), **50.7 s** (walked out the way
out, 4 of 5 down), **64.3 s** (downed). Median 60 s.

## [house tiles back], CLOSED

Every piece of its ship test is on the alpha: the house-tile board (V231), the 112 art, a house never
smaller than a man (V232), house-sized not house-filled (V233), the phone's real pixels (V234), nothing on
the ground (V235-V236), the street's parts (V237), cover is a thing (V238), every fight ends (V239), the
ground at 45 with COMBAT 2's floor (V240), the roof you stand on (V231), and now reach lit (V241).

## [bb reach]

Battle Brothers shows what you can hit when you pick a skill: the tiles in range light up. **What we do
differently:** it is always on in the cover phase, because a turn is a beat and there is no time to ask.

## ANALOG HORROR LINE

The light stops where the gun stops. Past it, the street goes back to being somebody else's.

---

**Tool:** `tools/bohemia_reach_is_lit_patch.py` (the replay list carries twenty) · **Gate:**
`gates/reach_is_lit_gate.js` 8/0 · **VOTE:** `combat-reach-is-lit-10-1` · **Stamp:** 10/1k ·
**Tab:** COMBAT, and any fight from CITY.
