# THE FLOOD TUNNELS (COMBAT TWO, 11/9/26)

VAMILY rule 440(a), rule 416's list (the second big interior), ask line 539. Paolo 11/9: "More everything pls." The coordinator:
"a long chain of house-sized culvert tiles, camps on the walls, the street's light through the grates, dark unless lit, the flash
flood as the event; a fight at a wash or a drain mouth can use it." The facts (records/BOHEMIA_PAOLO_THE_BIG_INTERIORS_11_6_26.md):
600 to 700 miles of flood channels in the valley, about 200 underground, 300 to 1,500 people living in them, 31 flood deaths since 1960.
BUILD 11/9j - THE FLOOD TUNNELS. BUILT, NOT YET SEEN. VOTE combat2-the-flood-tunnels-11-9 (stand_in).

## BEFORE (main 8a62befa7)
A fight at the wash was dealt the wash's own place board, the open concrete channel in the sun, every time. Nothing under the city
existed: no culvert, no flood, no camp, no grate.

## AFTER
- WHERE: a fight at the wash or the basin goes under the city about half the time (tunnels.json share 0.5, by the cell's own dice,
  so the same spot is always the same board). opts.inside 'tunnels' asks for it anywhere; opts.inside false never.
- THE BOARD (slices/bohemia_flood_tunnels.js, slices/fight_ground/tunnels/tunnels.json): 20 by 15 house tiles, the tile stays a house.
  Three layouts, each mirrored east to west and north to south by the dice (twelve boards):
  - THE MAIN AND ITS DRAINS: the main channel three tiles wide east to west, drains north and south to a drain along the top and
    the bottom, a chamber where they meet.
  - THE JOG AND THE BOX: the channel runs in at one height, jogs through a junction box, and runs out three tiles lower.
  - THE TWO BARRELS: two channels side by side, the fill between them, joined by two cross passages.
  The channel's floor is the wash's own concrete channel (block_wash_3), the drains its concrete, the fill round the culverts the
  landfill's gravel (block_landfill_0). The channel runs on into the ring off the board's edge (the wash outside).
- THE PIECES (the master rig, tools/bohemia_combat_two_the_flood_tunnels_11_9_26.py, true lengths, his palette roles only):
  a culvert wall cut away at 1.8 m (both ways; the rebar in the cut, a waterline, a tag) on every edge a culvert shares with the
  fill; A CAMP ON THE WALL (a mattress on pallets, a blanket, a shopping cart of bags, a crate, a candle jar; low cover);
  A LEAN-TO (a tarp on a cord, a camp chair, water jugs, a bucket; low cover); THE FLOOD'S JAM (a cart on its side, branches,
  tyres, a folded mattress; cover, in the channel); THE TRASH RACK across the channel's end at both mouths, north to south, trash
  caught on its bars (cover), and on the mouth's own tile THE RACK PRIED OPEN, two bars bent apart (low cover); THE GRATE'S
  LADDER (steel rungs up to the street grate). The cart, the tyres and the oil drum's fire are reused untouched.
- THE DARK: under the ground it is night, by day and by night. By day the street's light falls through the grates (9 m) and the
  wash's light in at the mouths (14 m, no fixture: the day itself); the drums people keep burn day and night (6 m). At night only
  the drums. The most of the tunnels is dark either way.
- THE FLASH FLOOD: on a round the dice pick (3 to 6), the round before: "A roar in the dark, upstream. The water is coming." Then
  "The flash flood comes down the main channel": every channel tile is water (the swamp's row: a man there fights worse and walks
  slow) for two rounds, drawn as brown water with the current's streaks moving on the beat. Then "The water drops as fast as it
  came; the silt stays": the channel is rough ground for the rest of the fight. The drains and chambers stay dry: the way out of
  the water is up a drain.
- Rule 435(c) held: the fight's ground is one walkable piece; 0 of 288 men of his stood a whole fight under the city.

## GATE
gates/the_flood_tunnels_gate.js (THE FLOOD TUNNELS, registered) 9/0, 17 s:
T1 a fight at the wash may go under (10 of 24 at the wash and the basin; 0 at five districts with no drain; asked in 4/4, out 4/4;
the same cell the same answer); T2 joined (24 of 24 boards, both lines on open floor, every man with a walk to the other side, all
three layouts and all four flips dealt) and its plant (the fill across every culvert, caught); T3 the flash flood (24 of 24: water on
the dice's round for two rounds, then silt; the roar the round before; the drains dry) and its plant (a flood that never drops,
caught); T4 the dark (24 of 24) and its plant (the grates live at night, caught); T5 the pieces are real (7 kinds, each with its
picture and model, camps and jam cover, a wall on every culvert edge, the rack across both ends); T6 a fight plays (24 of 24 end on
AUTO, 7.5 rounds a fight; 0 of 288 men of his stood a whole fight).
ALSO RUN, ONE AT A TIME: EVERY MAN ACTS ON AUTO 9/0 (the tunnels now one of its 22 kinds of board), THE BOARD IS THE CITY AT THAT
SPOT 194/0, THE OLD LAYOUT THE NEW HOUSES 25/0, THE CASINO FLOOR 9/0, EVERY PLACE NO SEAMS (re-aimed to ask for the place's own board,
opts.inside false; its rows now equal main's, its two reds, trailer and suburb, are main's own), COMBAT ENTRY (red on main the same
way: a page.click timeout).

## WEAK, SAID OUT LOUD
- The art is stand-in (stage stand_in): the camps and the jam read at the near stop; at the far stop they are small.
- The trash rack is pale bars on pale concrete; it reads up close, faintly far.
- No one lives in the camps yet (no people, no talk): the camps are cover and dressing. A camp's people are a WORLD / PEOPLE job.
- The flood harms no one directly: it is water (slow, fights worse) and then rough ground; nobody is swept away.

[bb] Battle Brothers fights only outdoors; under the city is our own swag (rule 416).
[analog horror] a candle in a jar still burning on a crate in a camp nobody is in, a hundred metres into the dark.
