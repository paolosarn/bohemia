# THE GROUND FIGHTS (COMBAT, 10/18, [the ground fights])

THE ROW (rule 59, Paolo 10/1: 'every floor tile from Battle Brothers needs a proper translation for our game... how it
impacts your accuracy or your defence or the positioning, how many action points it costs to move through'; routed by
WORLD 10/9, records/BOHEMIA_WORLD_A_LEGEND_COUNT_IS_NOT_A_BOARD_10_9_26.md): the rebuilt fight reads
records/target/BOHEMIA_GROUND_EFFECTS.json for the board it stands on, never a second list of grounds; the OBSTACLES
row, the DOOR row, and the HEIGHT row WORLD left UNREAD (hand WORLD the number); the old one-effect gate rewritten to
rule 59 or retired with a line; in VOTE one board per ground with what standing there does, from the game's camera.

Also read and followed: rule 117 (10/18, EASIER THAN BATTLE BROTHERS: Battle Brothers is the model for how a system
works, never for how hard; Nintendo-simple, one clear next thing; a good choice gets a visible and audible win), rule
41 (how did Battle Brothers do it first), rule 46f (no words on the ground; the words are in the bar), the attempt law
(every player-facing line ships as draft:true).

## HOW BATTLE BROTHERS DID IT
Every tile has a kind and the kind has a cost and an effect (the coordinator's school page,
records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_EVERY_FLOOR_TILE_AND_ITS_TRANSLATION_10_1_26.md, from the wiki's Combat
Mechanics page): flat 2 AP, forest floor and snow 3, swamp 4 with skill and defence down, +1 AP a level of height, +10
to hit from above and -10 from below, +1 range a level for ranged, obstacles block the path and the shot. The player
learns it from the tile's tooltip when he points at it, and the hit chance's breakdown names 'height advantage'.

## WHAT THE FIGHT HAD, MEASURED BEFORE
The rebuilt fight (rule 63) already played all of Battle Brothers' numbers, through R() from records/target/bb: but it
asked each tile its KIND by name ('water', 'rough', 'debris', 'height', 'blocked', seven places), so the ground's rules
were a second list living in the fight's code, not WORLD's table; nothing told him what a tile did; and nothing said
which of WORLD's thirteen grounds a board stood on.

## WHAT IT DOES NOW
1. ONE TABLE. records/target/bb/ours.json `ground_rows` maps every tile kind COMBAT TWO's 35 blocks draw to ONE row of
   WORLD's table: flat -> flat, rough and debris -> rough, water -> swamp, height -> height, blocked -> obstacles. The
   fight loads WORLD's table and its district list (records/target/BOHEMIA_BOARD_KINDS.json); at the deal every tile is
   turned into its row once (S.row), and every rule asks the row: the step's cost, the man in water, the roof's level,
   the path, the shot. A kind with no row, or a row WORLD's table does not carry, stops the deal. The numbers did not
   move: TUNING holds every ground number at Battle Brothers for both sides (rule 117, its EASIER ROWS bank: 'holds
   (shared: bending it eases them too)').
2. THE GROUND THE BOARD STANDS ON. FIGHT.S.ground: a district handed over names its own ground from WORLD's list (78
   of 78); a board asked for by kind (today's map door) stands on the ground most of that kind's districts stand on
   ('strip' -> the_strip); the bench's own deal names none. No second list.
3. HE SEES WHAT IT DOES, IN PLAY (rule 59's half he feels; rule 117b): a finger on a tile that changes something says
   so first, then the walk: 'Rough ground: slow. Walk there, 5 AP. Tap again.' / 'Rubble: slow.' / 'Water: you fight
   worse.' / 'High ground: easier hits.' A flat tile says only 'Walk there, 2 AP. Tap again.': one clear next thing.
   The lines are attempts (draft:true) in ours.ground_rows' `say`.
4. THE WIN (rule 117c): his man stepping UP onto a roof rings gold at his feet for two beats and the feed reads
   'BOOKIE takes the high ground.' The sound is posted to the parent as 'high_ground' and is silent until SOUNDS gives
   it one (routed); no beep was authored here.

## THE HEIGHT ROW, AND THE OTHERS, HANDED TO WORLD
records/target/BOHEMIA_FIGHT_GROUND_MEASURED.json, written by tools/bohemia_combat_the_ground_fights_10_18_26.js: the
fight dealt every one of the 78 districts six times, its board kind and its district, every tile counted by its row; a
ground is the mean of its districts.

| ground | districts | board kinds | rough | water | roof (height) | obstacles + solid cover | WORLD blocked |
|---|---|---|---|---|---|---|---|
| suburb_block | 15 | culdesac, ruin, suburb | 11.9% | 0.0% | 7.4% | 21.1% | 32.7% |
| the_strip | 10 | strip | 1.5% | 0.0% | 6.6% | 17.3% | 34.5% |
| industrial | 15 | landfill, ruin, strip | 29.9% | 1.3% | 14.0% | 10.5% | 24.6% |
| open_desert | 3 | landfill, scrub, shore | 39.4% | 3.0% | 13.3% | 7.0% | 1.5% |
| wash_and_shore | 7 | ruin, shore, wash | 36.7% | 3.5% | 9.9% | 11.4% | 29.7% |
| hills | 1 | scrub | 49.3% | 2.8% | 6.5% | 6.6% | 95.8% |
| freeway | 4 | freeway, ruin | 11.1% | 0.0% | 7.1% | 16.1% | 16.6% |
| lot_and_bigbox | 5 | strip, suburb, suburb_stem | 1.3% | 0.0% | 6.0% | 19.2% | 20.7% |
| trailer_park | 1 | culdesac | 0.0% | 0.0% | 2.7% | 24.2% | 29.6% |
| golf_and_park | 8 | ruin, scrub, shore, suburb | 28.6% | 1.3% | 8.8% | 13.8% | 10.7% |
| airport | 3 | ruin | 20.2% | 0.0% | 7.0% | 20.4% | 24.5% |
| solar_and_pumps | 5 | ruin, scrub | 27.0% | 0.2% | 7.4% | 17.4% | 21.7% |
| landfill | 1 | landfill | 38.5% | 2.8% | 17.0% | 6.6% | 15.0% |

**THE HEIGHT ROW IS KNOWN NOW: a roof is 2.7% (the trailer park) to 17.0% (the landfill) of the board a fight is
played on, one level up.** It fires on all thirteen grounds.

**ONE FINDING THAT PROVES US WRONG (rule 12): WORLD's table says ROUGH and SWAMP cannot fire on our boards ('no kit
draws a rough standable cell'; 'the valley is dry'). On the boards the fight really deals, rough fires on 12 of 13
grounds (up to 49.3% of the board) and water on 7.** Both are true: WORLD measured the district kits (the old walk's
cells), and the fight never cuts a board from a kit; it deals COMBAT TWO's blocks by board kind (WORLD's own 10/10
finding in BOARD_KINDS). The water is the shore and wash blocks' 3 tiles each, a reservoir's edge, which WORLD's file
allows ('the only wet water is the reservoir...'). So the answer to 'what does this ground do' is the fight's file,
not the kit's legend, until the board is cut from the cell.

**AND THE SECOND, WORSE: the ground does not decide the board yet.** The hills fight (the mountain district, WORLD
95.8% blocked, 'mostly cliff') is dealt on scrub: 6.6% obstacles and half of it rough. The 13 grounds collapse to 9
board kinds and the catch-all 'ruin' takes 24 districts (airport, industrial, solar all read the same board). That is
[the map hands the board]'s whole job, the next row; this row's file is the baseline it moves.

THE DOOR ROW: 0 fight tiles. No fight block draws a door; a fight house is one blocked tile whole (A COMBAT TILE IS A
HOUSE). Named, not built: going inside a house in the fight has no ruling.

## TWO DEFECTS FOUND BY THE SHEET, FIXED (both on main before this round, both in the fight file)
1. **A SUBURB FIGHT WAS DEALT ON THE DESERT'S EDGE ONE TIME IN FOUR.** The map hands 'suburb' for eight districts
   (suburb, apartment, town, school, campus, library, chapel, cemetery). 'suburb' is an alias, and the deal looked for
   the family that lists the kind by that name; none does, so the family fell to the dice (city 3, edge 1). Measured on
   main, 200 seeds: **53 of 200 suburb fights had not one suburb block (sand, scrub and the reservoir's water)**. Now
   the family is the one that carries the kind or any of its aliases' kinds: 0 of 200, the suburb block leads 200 of
   200. Seeded suburb boards deal differently from this commit (one die is no longer thrown for the family).
2. **A SECOND FIGHT FROM AGAIN SHOWED A FLAT DIRT BAND.** The map round the board (the fat map, rule 104a) is baked once
   into a half-size picture. A second fight in the same page (the over screen's AGAIN, or any restart) baked it while
   its blocks were still loading, and kept it, because its key read the board canvas as a string ('[object
   HTMLCanvasElement]', the same every time). Measured: **35.72% of the glass flat ground-under (#2a2219) for the whole
   second fight** against 0.76% on a fresh load; now 0.76%. A ring with a hole is never kept.

## THE GATE
gates/every_floor_tile_is_a_translation_gate.js, EVERY FLOOR TILE IS A TRANSLATION, in the suite in place of ONE
TERRAIN EFFECT (archived to archive/one_terrain_effect_gate.js with a line in gates/bohemia_superseded.txt: it held his
9/24 'ONE terrain effect... nothing else on a tile changes a number' on the frozen fight, which rule 59 amends by
name). 19 legs, 19 green: every drawn kind is one of WORLD's rows; the crosswalk cites his words and is draft; the fight
loads both WORLD files; no rule asks a tile its kind by name; the measured file carries every ground and today's
kinds; ON A CLEAN BOARD where one tile takes one row at a time: rough 3 AP against flat 2, the man in water easier to hit
(50 -> 53) and swinging worse (50 -> 35), a roof +10 down (50 -> 60) and less from below (40), a light crossbow one
tile past its 6 out of reach from the flat and in reach from the roof, an obstacle no path and no shot, AND THE OLD
GATE'S QUESTION KEPT: 285 pairs of flat tiles, one answer (50); every row is on the dealt boards; 78 of 78 districts name
their ground; real taps on his phone: rough ground's line, flat's no-ground line, the roof's line and the gold ring with
the feed line on the step up; a suburb fight on a suburb (0 of 100); AGAIN draws the map (0.76%); no page errors.
THE FIGHT READS ONLY SOURCED NUMBERS gains a leg: the data list reads bb, the ground, the people and WORLD's two files,
nothing else (a stray file planted: red; removed: green).

## THE CARD
VOTE combat-the-ground-fights-10-18: slices/vote/COMBAT_THE_GROUND_FIGHTS_10_18.jpg. All from the game's camera, his
phone upright: the four moments a finger on the ground changes the line (rough, rubble, water, a roof) and the step up
with its gold ring; then one board per ground at the open, the ground's shares under each.

## ROUTED
- WORLD: the height row is measured (records/target/BOHEMIA_FIGHT_GROUND_MEASURED.json, grounds[].share.height); your
  cook may read it into grounds[].height (known:true, from:'the fight'). Your ROUGH and SWAMP rows say canFire:false and
  the fight's boards fire them on 12 and 7 grounds: the kits are not the fight's boards (your own 10/10 finding).
- RUN: the map door (nfOpts in the alpha) hands the fight `kind` only; handing `district: d.district` too lets the fight
  name its ground exactly (today it takes the kind's most common ground). nfKind() is a second district-to-kind list
  beside WORLD's BOARD_KINDS; one of them should read the other.
- SOUNDS: 'high_ground', one short sound for his man taking a roof (rule 117c), from real material; the fight already
  posts it to the parent and it is silent until it exists.
- COMBAT TWO: the door row has no tile: if a fight house ever gets a way in, it is a tile kind with the row 'door'.
- COMBAT (mine, next): [the map hands the board]: the hills fight on a 95.8% board, not scrub.
- TUNING: nothing moved; every ground number is still Battle Brothers' for both sides, as your rule 117 rows hold.

[bb ground] Battle Brothers teaches the ground through a tooltip and a hit-chance breakdown; on a phone there is no
hover, so OUR TWIST is the one line his finger already reads before he walks, and only when the tile changes
something: a flat tile says nothing at all. Same rules, fewer words.

[analog horror] The ground speaks in the flat voice of a survey form, 'Rough ground: slow.', never a cheer. The one
warm thing on the board is the gold ring when he takes a roof, and it is gone in two beats.
