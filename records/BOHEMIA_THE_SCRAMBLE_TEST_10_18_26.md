# THE SCRAMBLE TEST: THE RULER FOR STRUCTURE, MEASURED ON THE FREE RUNNER (PLUMBER, 10/18/26, round 64)

Row [the scramble test]. The coordinator's call on [the look leg]'s routed finding (records/BOHEMIA_THE_LOOK_LEG_10_18_26.md:
"no ruler in the twin gate sees what a thing is"; his car cut into 8 px squares and shuffled passed GREEN):

> THE SCRAMBLE TEST: an asset passes the look leg only if it scores closer to its pack twin than a pixel-scrambled
> copy of itself does (same colours, structure destroyed), by a margin you measure on the assets he already said
> YES to; that is the ruler for structure.

Files: tools/bohemia_twin_gate.py (scramble, look_scramble, look_structure, yes_pieces, scramble_lines),
gates/twin_gate.py (S0 to S3, the STRUCTURE lines, T3's voted items). Runs: Actions "look ruler" 39156939522 (round 1,
8c8fbf64) and 39158132507 (round 2, ff0fc6ae).

## WHAT WAS BUILT, EXACTLY AS RULED

- THE SCRAMBLE: every pixel of the piece (its see-through with it) moved to a random place in the same box, none
  changed: the same colours, the same count of each, nothing where it was, the silhouette included. S0 holds it on
  every box: his car scrambled keeps all 4,512 of its pixels and moves 100%; a planted one-colour change is caught;
  the 8 px block version keeps every square whole.
- THE READING: at the twin's size, cell by cell, the piece's LOOK cosine (DINOv2 ViT-S/14) to its pack twin against
  the BEST of three scrambles of itself (the piece must beat whatever its own colours do with the structure thrown
  away); the gap is the difference, the median over the cells.
- THE MARGIN, FROM HIS YES: every art item whose newest verdict in the registry is 'up', whose twin is a pack piece
  the bank holds, sprite by sprite, plus the two maquettes the twin gate has held as his YES since it shipped: 40
  sprites in 9 items. He voted on the card, not on each sprite (round five's card names one car as the twin of a
  robot, a truck and a drum), so an item's gap is the median of its sprites', and the margin is the weakest YES item
  per family of its twin.

## ROUND 1 (run 39156939522): HELD AS RULED, IT FAILED BOTH WAYS

THE MARGINS (the weakest YES item): props +0.029 (DIRECTION's rig round five), settlement +0.112 (COOK FOUR's school),
road -0.013 (COOK TWO's street joins), over all -0.013.

| his YES item | family | sprites | gap |
|---|---|---|---|
| cook2-the-street-joins-for-the-map-10-18 | road | 6 | -0.013 |
| direction-the-rig-round-five-10-18 | prop | 18 | +0.029 |
| direction-the-truck-turned-up-10-18 | prop | 10 | +0.102 |
| cook4-the-school-10-18 | settlement | 1 | +0.112 |
| the maquette truck | prop | 1 | +0.153 |
| cook4-the-gas-station-10-18 | settlement | 1 | +0.159 |
| the maquette robot | prop | 1 | +0.186 |
| cook4-the-church-10-18 | settlement | 1 | +0.223 |
| cook4-the-warehouse-10-18 | settlement | 1 | +0.257 |

TOO LOOSE, the thing it was built to catch: HIS CAR CUT INTO 8 PX SQUARES AND SHUFFLED BEATS ITS OWN SCRAMBLE BY
+0.091 against his car, over the props' margin of +0.029: it PASSES. A road tile named as his car's twin +0.185 and
a door +0.210 pass too; a lamp +0.019 fails.

TOO STRICT, on his own packs: 10 OF 80 PAIRS OF HIS OWN GROUND TILES go RED on it (T2's line is under 5 in 100). A
texture scrambled is still a texture to DINOv2, and often a nearer one: rocks and stones #52 against burned ground
#4 read cos 0.271, its own scramble 0.344 (gap -0.073); wooden and nature props #20 against gardens and crops #2,
0.267 against 0.377 (gap -0.111).

WHY, from the same run: HIS CARS AGAINST HIS CAR beat their scrambles by +0.48 to +0.70 (all 19), a real gap. His
YES rig renders against his car only by +0.03 to +0.35, because a robot is not a car and a truck seen from the side
is not his car seen from above: the margin his YES sets is the margin of pictures that are not their twin's subject.
So the margin sits under the shuffled car. And the street joins (road) set a negative one.

So it holds nothing now (SCRAMBLE_HELD is empty); it prints on every run with its margin, for every planted piece.

## ROUND 2 (run 39158132507, TWIN GATE 31/0): STRUCTURE, EACH PICTURE AGAINST ITSELF

The same idea pointed at the piece instead of the twin: the LOOK cosine between a picture and the most alike of
three scrambles OF ITSELF. High means it has no arrangement to lose (a texture, or squares already shuffled); low
means moving its parts makes it something else (a thing). At 1 (every pixel), 6, 8 and 16 px squares:

| picture | 1 px | 6 px | 8 px | 16 px |
|---|---|---|---|---|
| his car (pack 10, #0) | 0.357 | 0.464 | 0.453 | 0.636 |
| his cars pack, 20 pieces: the highest | 0.357 | 0.529 | 0.530 | 0.693 |
| his cars pack: the median | 0.243 | 0.423 | 0.455 | 0.625 |
| YES: the maquette robot | 0.136 | 0.327 | 0.337 | 0.725 |
| YES: DIRECTION's rig round five (18 sprites, median) | 0.173 | 0.248 | 0.343 | 0.729 |
| YES: the maquette truck | 0.132 | 0.421 | 0.454 | 0.821 |
| YES: DIRECTION's truck turned up (10 sprites) | 0.190 | 0.339 | 0.519 | 0.767 |
| his car cut into 16 px squares, shuffled | 0.339 | 0.657 | **0.739** | 0.888 |
| his car cut into 8 px squares, shuffled | 0.533 | 0.758 | **0.833** | 0.896 |
| his car cut into 6 px squares, shuffled | 0.399 | 0.895 | **0.911** | 0.950 |
| a lamp (named as his car's twin) | 0.446 | 0.525 | 0.642 | 0.863 |
| a door (named as his car's twin) | 0.351 | 0.628 | 0.728 | 0.828 |
| a road tile (named as his car's twin) | 0.284 | 0.659 | 0.745 | 0.934 |
| his ground tiles, 12: the lowest / the median | 0.193 / 0.258 | 0.408 / 0.452 | 0.480 / 0.600 | 0.771 / 0.832 |
| YES: COOK TWO's street joins | 0.627 | 0.717 | 0.751 | 0.876 |
| YES: COOK FOUR's school / gas station / church / warehouse | 0.558 / 0.382 / 0.377 / 0.316 | 0.771 / 0.705 / 0.646 / 0.647 | 0.797 / 0.711 / 0.666 / 0.672 | 0.931 / 0.928 / 0.848 / 0.844 |

AT 8 PX IT SEPARATES THINGS, BOTH WAYS: every car he bought reads 0.530 or under, every YES thing 0.519 or under; his
car shuffled in squares of any of the three sizes reads 0.739 to 0.911, and a door, a road tile and a lamp put up as
his car read 0.642 to 0.745. Nothing he said yes to and nothing he bought among the cars crosses; every attack does.
At 1 px it does not separate (the 8 px shuffle 0.533 against his cars' 0.357 is close to the lamp's 0.446); at 16
px the squares are too big for a 47 x 96 car (two across) and his robot reads 0.725 against the 16 px shuffle 0.739.

IT DOES NOT HOLD SURFACES: his ground tiles read 0.48 to 0.80 at 8 px and the YES buildings (roofs seen from
above) 0.67 to 0.80, as high as the shuffled car. A surface has little arrangement to lose; that is what a surface
is. PATTERN and PAINTER already hold flat squares on the ground (T2's flat ramp, the checker, noise: RED).

THE HELD FORM, round 3: a THING (its twin a prop, a door or a lamp) whose own 8 px scramble reads more like it than
anything in his twin's pack does (packs of eight or more pieces) or than any YES item named against that pack, is
LOOK FAR: squares, not a thing. The line per pack is the packs and his word measuring themselves; nobody picks it.

## TWO MORE THINGS THIS ROUND FOUND IN THE TWIN GATE

- HIS WORD OUTRANKS THE CULL. COOK TWO's street joins, which he voted up ('Way better nice!'), were RED on T3 (PAINTER
  FAR on colours per 1,000 px), so the twin gate was red on a piece he said YES to. The cull is for candidates on
  their way to the tab; an item he has voted on is no longer held, and every run prints the YES items the rulers
  would RED as rulers wrong (round 1: the street joins and the truck turned up; no NO item). TWIN GATE 17/1 -> 21/0
  on the container.
- S2 caught a rounding bug of mine (a median compared unrounded against a rounded margin) on the runner; fixed.

## ROUND 3 (run 39160537953 on 0c4a88d9, carrying 35a63326): HELD, PROVEN BOTH WAYS. TWIN GATE 37 PASSED, 0 FAILED

The calibration measures the line for 23 packs of things (props, doors, lamps with eight or more pieces in the bank):
each pack's highest reading against its own 8 px scramble, raised to any YES item named against it. His cars pack:
0.530 (set by his car #14; his YES things there sit under it, the truck turned up at 0.519).

| S4 (held) | reading | line | verdict |
|---|---|---|---|
| his car cut into 8 px squares and shuffled | 0.833 | 0.530 | RED |
| his car cut into 6 px squares and shuffled | 0.911 | 0.530 | RED |
| his car cut into 16 px squares and shuffled | 0.739 | 0.530 | RED |
| his cars pack against his car | 20 of 20 under | 0.530 | pass |
| his YES things (rig round five, truck turned up, the two maquettes), on the median of their sprites | 4 of 4 under | their pack's | pass |
| a lamp named as his car's twin (printed) | 0.642 | 0.530 | RED (was RED) |
| a road tile named as his car's twin (printed) | 0.745 | 0.530 | RED (was GREEN) |
| a door named as his car's twin (printed) | 0.728 | 0.530 | RED (was GREEN) |

Every other leg held with it: his own ground and road tiles against each other 1 of 80 RED (unchanged), the flat
ramp, the 1.5x upscale and noise RED, the maquettes not RED, a piece scored in 0.34 s, the cull of 5 new items he has
not voted on clean. The YES items printed as 'a ruler wrong' (never held, his word is the verdict): the street joins
(PAINTER, since 10/18) and DIRECTION's truck turned up (it passes on the median of its ten sprites; one sprite reads
over the line on its own).

THE THREE THINGS THE LOOK LEG ROUTED ARE NOW CAUGHT: his car shuffled in squares, a road tile named as his car, a door
named as his car. A cook that names a car and draws squares, or draws a door, is RED before the tab.

## WHAT WAS AMENDED, SAID PLAINLY

The ruling's own words held as written ("closer to its pack twin than a pixel-scrambled copy of itself, by a margin
measured on his YES") were measured wrong both ways on the runner (round 1). What is held keeps every part of the
ruling but one: the scrambled copy of itself, the margin from his YES (and from his own pack), the ruler for
structure; it compares the piece to its scramble instead of the twin to the piece's scramble, at 8 px squares, and
for things only. The literal form prints on every run beside it (SCRAMBLE_HELD in tools/bohemia_twin_gate.py is
one constant away from holding it again if the coordinator rules the literal form anyway).

## ROUTED

- COORDINATOR: the amendment above, with its numbers; and THE TWIN GATE NOW CULLS ONLY WHAT HE HAS NOT VOTED ON.
- DIRECTION: surfaces (ground, roads, roofs from above) read 0.48 to 0.80 against their own scramble; STRUCTURE does
  not hold them, PATTERN and PAINTER do. The style guide's detail budget (rest areas, a focal point) is the ruler a
  surface needs; it is not this one.
- EVERY ART LANE: a new thing named against a pack twin must read under its twin's pack line at 8 px (the card prints
  the reading, the line and which piece set it).
