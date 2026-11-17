# UI FOUR: EVERY COUNT A PICTURE (11/17/26)

VAMILY rules 453 (a full sweep), 441 (fully baked), 223 and 224 (his stats and counts as pictures), 454(a) (no line from a mouth is
touched). Ask rows 145 and 146, round five. The coordinator's routine "UI FOUR" job 1: "the icons and bars on every screen that still
shows bare numbers or words (the shop, the camp, the job board, the build sheet at his place), one look, upright and sideways".
Session UI FOUR (heir of UI THREE, whose handoff block and records it read first).

## His words
10/26 (rule 224): "I'm tired of it just being numbers numbers numbers... more icons, more green up arrow, down red arrow, and the only
number that matters is by how much."

## Measured before (the demo, main b94bd492, a 390 x 844 phone upright and 844 x 390 sideways, every sheet opened by a real tap)
| screen | what it said in words |
|---|---|
| the build sheet at his place | '1 BATTERY 2 TAPE' and '+1 FOOD/DAY' on eight rows, 'A NIGHT -2 batteries', 'LIVING HERE 0 yet' |
| the job board | '23 BATTERIES . 5 H 10' a job, 'Held: 0 of 2 contracts. They show on your map.' |
| the stall | 'YOU HAVE 40' on every row, '75 rolls on the shelf. More in the back, dearer.' |
| the barber, the bar, the lot, the cart | '1 battery', '3 batteries', '4 hours' in the button |
| the camp's lines (when its sheet is up) | 'THE NIGHT COSTS 3 BATTERIES', '0 OF 1 PLACES' |
Already pictures, left alone: the hall (UI THREE's bars, his vote 11/14), the shelf's prices and the stall's BUY and SELL prices (the
kit's battery), the item card (bars and arrows), the crew screen.

## Now: one piece, one look
slices/bohemia_ui_three_items.js, the block __EVERY_COUNT_A_PICTURE__ (counts()), run by the lane's own watcher on the town screen:
a count said in words becomes the thing's own picture and the number.
- N batteries, tape, food, meds, rounds, water: the supply's own picture off the top bar (slices/supply_icons/small), then the number.
- a gain or a cost over time ('+1 FOOD/DAY', '-2 batteries' a night): the stats' own green arrow up or red arrow down first.
- a time ('4 hours', the board's '. 5 H 10'): the kit's own clock face (the WAIT mark of bohemia_ui_materials.js), then the time.
- 'YOU HAVE N': a sack, then the number.
- 'Held: N of M contracts', 'N OF M PLACES', 'Lots: N of M': a slab for each, N lit.
- 'LIVING HERE N': a head for each (one dim head while nobody lives there).
The marks printed by this piece (clock, sack, slab, head) are masks: they take the ink of the line they stand in, bone on the dark
board and brown on the paper buttons. No new picture file: the supplies are the bar's, the arrows the stats', the clock the kit's.

THE WORDS STAY IN THE PAGE at no size, so each line's text is letter for letter what the page wrote (a reader hears it; every other
lane's gate that reads a line still reads it). The chips are built from i and b only, so a sheet's own rule for a span (the build
row's two stacked lines) never lays a chip out. No line from a mouth is read or changed (rule 454(a)).

NOTHING GROWS (rule 250): a picture in the build row is 12 px and takes the row's 10; every sheet is the same height or shorter with
the piece on, upright and sideways.

## Proven
- Gate EVERY COUNT A PICTURE (gates/every_count_a_picture_gate.js, new): the town screen as the game lays it, the phone upright and
  sideways, each sheet opened by a real tap, with the piece on and with a checker's switch that keeps it off: B the build sheet at his
  place against records/target/bb/home_base.json (8 builds, every cost and gain), J the board (each pay, the slabs against the jobs
  held), S the stall (each row's own count, the shelf), P a price and a time in a button, N no count left in words (23 with it off,
  0 on), T every line's text unchanged, H nothing taller, 63 pictures each 11 px or more (an arrow, a slab 8), E nothing thrown.
  --plant: the piece off judged as if on turns B, J, S, P and N red. 16 passed, 0 failed.
- ON THE DEMO ITSELF (the real page, real taps, a town and his own place planted on the map, upright and sideways): the board
  ('* [battery] 23  [clock] 3 H 30'), the stall ('[sack] 40', '[tape] 50 on the shelf', the trade good's '[sack] 0'), the build
  sheet at his place (eight rows, the night's bill), the barber and the lot; 0 page errors both ways.
- Beside it, read on this tree: THE SETTLEMENT SCREEN 75/0, THE TRIP BEFORE THE YES 9/0; the rest in the handoff block.

## Named, not this lane's (each reads a file this build does not touch)
- BUILD ON THE SCREEN leg E: a text match in the map's file (slices/BOHEMIA_CITY_WORLD.html); HOME BASE's.
- A JOB'S TIME COUNTS THE WAY BACK leg B5: 'no job to walk' on the map's own walk; WORLD's.
- THE STALL SIDEWAYS ON THE DEMO runs 36 to 57 px past its box once a trade good's row is under the five goods (the hint line is off
  the glass); the same with this piece off. UI FOUR's next build (the layout room) takes it with the hall.
- THE CAMP: on the demo the camp is the fight's own board and the phone (rule 406); its old sheets on the town screen are not
  reachable by a tap there. Their lines are covered by this piece if they ever stand (the same selectors), not seen on the demo.

Picture: records/target/ui4_every_count_a_picture_11_17/before_and_now.webp (the demo on a 390 x 844 phone: the job board and the
build sheet at his place, before on top, now below).

[bb Battle Brothers' town screens put a crown beside every price and a small picture beside every good; a number never stands alone.]
[analog horror: a pawn ticket where the clerk stamped a little battery beside each figure because the ink for words ran out.]
