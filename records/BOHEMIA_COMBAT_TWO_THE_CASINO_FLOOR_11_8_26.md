# THE CASINO FLOOR: THE FIRST BIG INTERIOR (COMBAT TWO, 11/8/26)

VAMILY rule 416, ask line 468. Paolo 11/6: "what are some large ass interiors that we could fight... I don't want the interiors to be
like human sized as the characters are for real, I still want like this is a block and turf war, I always want that feeling... some
fights could be inside too and that's just part of this open world kind of vibe." The coordinator's order (11/8, 19:17): a real Strip
casino floor at house-tile size, the same camera with the roof cut away, slot banks as cover, the cage as the strong room, the pit,
the bar, the dead sportsbook wall, dark unless someone pays for power; the golden-piece recipe (408(b)), its art reusing what exists
first (rule 430); a fight at a casino with an inside can use it.
BUILD 11/8f - THE CASINO FLOOR. BUILT, NOT YET SEEN. VOTE combat2-the-casino-floor-11-8 (stand_in).

## MEASURED BEFORE (main 29dc67d33)
- A fight at the casino, the high roller, the Luxor or the resort was dealt the Strip family's checkerboard: blocks of bare casino
  carpet between street blocks, a five-tile street ending at a carpet (429(h)'s named weak spot, 22 such pieces in 600 boards).
- The casino board in the data (fight_ground.json 'casino', the 10/9 and 10/19 work) is bare carpet with slot banks scattered on
  it: no wall, no cage, no bar, no sportsbook; only a bench page ever dealt it (opts.board 'casino'), never a fight from the map.

## WHAT IT IS (slices/bohemia_casino_floor.js; data slices/fight_ground/casino/casino_floor.json; pictures slices/fight_ground/casino/)
- THE TILE STAYS A HOUSE: 20 by 15 house tiles, the fight's own board, a layout of 15 strings of 20 characters a modder edits (the
  freeway's way), mirrored east to west by the dice.
- THE PLAN (a Strip casino's ground floor): the gaming floor's carpet (block_casino_*, his 10/9 YES); slot banks in rows, three rows
  of two back to back on a tile (cover); the pit's tables in a ring between the two lines (low cover, four a tile); columns (no way
  through); THE CAGE on the north wall: the cashier's counter under steel bars (no way through) with its strong room behind it on its
  own concrete floor and ONE door (the chokepoint the floor is fought over); THE SPORTSBOOK beside it: its wall of eight dead screens,
  one frozen on the last odds, and its seats at their desk (low cover); THE BAR, a counter a man takes cover at; THE LOUNGE STAGE, one
  step up (high ground, a level); THE HIGH-LIMIT ROOM behind a cut-away wall with one door; THE FRONT DOORS on the south edge, two
  leaves gone.
- THE SAME CAMERA, THE ROOF CUT AWAY: the walls are cut at 1.6 m, the studs showing in the cut, so the camera sees over them.
- THE DARK: inside it is night (no sun under a roof) and no lamp burns unless the power is paid for (opts.casinoPower true;
  power_default false); with power the slot banks still on a battery glow, 22 tiles lit.
- WHO FIGHTS THERE: the map's casino districts (casino, highroller, luxor, resort; the data's own list until WORLD's 'which places
  have an inside' flag lands, 416(d)); opts.inside 'casino' anywhere; opts.inside false never. The Strip's boulevard stays the Strip.
- THE ART (408(b) golden piece, rule 430 reuse first): the slot bank, the table, the column and the slot glow are the 10/20 rig's own,
  untouched; nine new pieces made in real metres and rendered through the master rig (tools/bohemia_direction_master_rig.py, with
  the 10/20 grime pass) at the fight's own 42.9 px a metre by tools/bohemia_combat_two_the_casino_floor_11_8_26.py: the cage, the
  bar, the sportsbook's screens and seats, the cut walls east-west and north-south, a door, the front doors, the stage and its front.
  Models in reference/models/bohemia/casino_*.glb. All marked stand_in: the golden piece is judged by him in the VOTE tab first.

## GATE
gates/the_casino_floor_gate.js (THE CASINO FLOOR, registered), about 35 s: C1 a fight at a casino with an inside is fought on its
floor (24 of 24), the Strip's boulevard not (0 of 6); C2 the floor joined (planted: a wall across the floor, caught); C3 the strong
room's one way in (planted: a second way, caught); C4 the dark (planted: the power on, caught); C5 the pieces are real, the cover is
cover, the cage and the columns block, the stage is high ground; C6 a fight on AUTO ends inside 30 rounds.
EVERY BUILDING ON THE ROAD 9/0 (the casino floor counted apart: no road on a casino's floor). THE MAP HANDS THE BOARD 5/3, the same
three reds word for word on clean main (its headless fight never loaded the floor).

## WEAK, SAID OUT LOUD
- One layout so far ('the cage and the book'), mirrored; a second and third (the cage on the west wall, a floor with the bar in the
  middle) come after his verdict on the golden piece.
- Nothing hands the power yet (no job or home base pays the casino's bill), so every casino fight is dark.
- A fire people keep in a drum would light a dark floor, but every light needs the power today (the light drawing is the drawing
  lanes'); the dark floor is dark.
- The strong room holds nothing yet (no loot in it); it is a room with one door.
- The bank, the aquarium and the mob museum still deal the Strip family's checkerboard (three pieces of street end at carpet).
- The new pieces are stand-ins until he passes the golden piece (408(c): marked as such in the VOTE tab).

[bb] Battle Brothers fights only outdoors; a fight inside a building is our own swag (rule 416), on the beat as Rogue Fable 4's rooms.
[analog horror] one sportsbook screen still lit in the dark, frozen on the odds of games nobody played, the night the dollar died.
