# THE FLOOD TUNNELS (COMBAT TWO, 11/9/26; on main 11/11 by COMBAT THREE)

*** 11/11: this board reached main in BUILD 11/11c - THE FLOOD TUNNELS (COMBAT THREE). The VOTE card is combat3-the-flood-tunnels-11-11; the parked card and its two pictures (combat2-the-flood-tunnels-11-10) were never on main and are not carried. The 548 fix named below (teachDraw, manCell) is not carried either: FIXES' row 558 on main does that job. The tile table, the scramble and the page proof of the build that shipped: records/BOHEMIA_COMBAT_THREE_THE_FLOOD_TUNNELS_ON_MAIN_11_11_26.md. ***

VAMILY rule 440(a), rule 416's list (the second big interior), ask line 539. Paolo 11/9: "More everything pls." The coordinator:
"a long chain of house-sized culvert tiles, camps on the walls, the street's light through the grates, dark unless lit, the flash
flood as the event; a fight at a wash or a drain mouth can use it." The facts (records/BOHEMIA_PAOLO_THE_BIG_INTERIORS_11_6_26.md):
600 to 700 miles of flood channels in the valley, about 200 underground, 300 to 1,500 people living in them, 31 flood deaths since 1960.
BUILD 11/11c - THE FLOOD TUNNELS. BUILT, NOT YET SEEN. VOTE combat2-the-flood-tunnels-11-10 (stand_in). Built 11/9, parked while rule
435(d) was proven on the page (branch combat2-tunnels-parked), shipped 11/10 under rule 441 (fully baked: proven on the page he plays,
upright and sideways).

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

## ON THE PAGE HE PLAYS (rule 441(a), rule 435(d)'s way)
The alpha upright (390 x 844) and the demo on its side (844 x 390), opened as a stranger opens them (the title, NEW GAME, a crew,
BEGIN, the barber), each fight started by the map's own handover at a wash block, AUTO and the speed pressed with a finger on the
phone's own buttons, 1x/2x/4x, recorded; the fight's own calls logged (startAnim, the rules' log):
- 8 fights (4 upright on the alpha, 4 sideways on the demo): 8 of 8 dealt THE FLOOD TUNNELS at the wash (the main and its drains, the
  jog and the box; both flips); the roar, the flood and the drop played as notes on the glass in every fight that lasted to them
  (6 whole, 1 to the flood, 1 ended before the roar); 0 page errors on both; 141 of 141 turns of his drawn (rule 435(d)).
- The flood seen on the glass at round 3 (the card's middle panel and its sideways strip: his men fighting in the brown water).
- FOUND AND FIXED HERE (EYES' ask row 548): on the demo the fight's own canvas answers to the SHELL's classes, so the fight's
  drawImage teaching (its packed and night sheets) never ran for it: a fallen man's packed sheet threw 'not of type' every ~2 s and the
  rest of the frame went unpainted. The tunnels are always night, so it would have met them often. teachDraw now puts the same teaching
  on the fight's own page canvases (the board, the faces) when their class is another window's, as an own property (no wrapper left
  on the shell's prototype for every fight); and one man's cell can never stop the frame (manCell: a sheet the canvas refuses draws
  from the day sheet under it, counted in UI.cellMisses). The demo sideways after it: 0 errors, 0 misses in 4 fights.
- MEASURED, NOT THE TUNNELS' (for PLUMBER 8, rule 441(c)): the longest pause between two drawn frames was 721 to 992 ms, two or three
  a fight over half a second, the same on a plain wash fight (943 and 701 ms, round 1 and round 3) as in the tunnels (992 and 875 ms);
  this box draws every canvas in software (PLUMBER 7's note), a phone does not; the moments are the round's first steps and blows.
- Row 555 (THE POT's quiet turns said nothing): not reproduced headless: 37 of 37 quiet turns of his in 16 act-one boss fights carry
  their word; the word's only switch is S.byHand, which the page sets from AUTO before every AUTO step, so a turn ended by his finger
  says nothing by design. EYES: THE POT's 8 turns' own 'auto' flags will say which.

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
