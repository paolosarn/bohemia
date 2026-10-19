# THE PIXEL FLOOR: NOTHING WE MAKE IS TINIER THAN WHAT HE BOUGHT (PLUMBER 10/19/26, VAMILY row [the pixel floor])

Rule 105 (Paolo 10/10: "every time you decide to make something art wise, you decide you need to use the tiniest
amount of pixels possible... look at the graphics and art that we downloaded and see how many pixels they are. That is
the floor"). The row: a commit that adds or changes a drawn asset smaller than its kind's floor is red with the kind,
the floor and the size; the first run lists every placeholder under the floor into records/BOHEMIA_PLACEHOLDERS.md.
CONSTRAINT: re-measure, do not guess; the camera's zoom is not the asset's size.

READBACK [the pixel floor]: I read this as: every drawn file the game ships has a kind and a size measured against
the packs' floor; done means a new or changed one under it is red and the old ones listed as placeholders.

## RE-MEASURED, AND WHAT CHANGED FROM THE 10/10 TABLE

The coordinator's 10/10 table measured CANVASES (the file's width and height). A pack prop's canvas is up to a third
empty, so the canvas over-states the thing. This measures the PAINTED box (the pixels at least half opaque), on all
1,915 of his pack pieces (pack_*.png; contact sheets out, and the lanes' own pictures that sit in the bank's folders
out: 34 COOK4_* in settlement/ were counted in the first cut and moved the building band's pool from 348 to 382
without moving its number), and uses the canvas only where the ruling named a canvas.

| kind | the ruling (10/10) | the floor now, measured | from |
|---|---|---|---|
| tile | 96 by 96 | 92, painted long side | 10th percentile of 736 road, ground and marking pieces |
| building, door, wall | 96 on its long side | 93 | 10th percentile of 348 settlement and door pieces |
| lamp | 96 tall | 94, painted height | 10th percentile of 47 lamps |
| thing (prop) | the smallest prop, 29 by 36 | 56, painted long side | the smallest of 784 props (29 by 36 was its canvas) |
| beast | (not named) | 56 | held to the smallest thing |
| vehicle, crate | the prop median, about 96 | 94 | the median of 784 props |
| portrait | 96 by 96 at its own pixels | 96, canvas both sides | the median canvas of 736 pack tiles |
| person | the 112 box, about 100 painted | 98 painted height for a rig still; 112 for a cell | records/BOHEMIA_THE_BODY_IN_METERS_10_13_26.md (98 px = 1.72 m) |
| icon | 32 by 32 | 32, painted long side | ruling (the smallest prop canvas, rounded up) |
| thumb | (not named) | 32 | a face's thumb is icon-sized (EVERY CHARACTER FACE COMES WITH A THUMB, 8/28) |
| marker | 40 by 40 | 40 | ruling (the smallest ground canvas) |

The floor file is records/target/BOHEMIA_PIXEL_FLOOR.json; `python3 tools/bohemia_pixel_floor.py --measure` rewrites
it, and the gate refuses a floor file that is not the bank measured today.

## EVERY PICTURE HAS A KIND

gates/pixel_floor_kinds.json gives each of the 10,799 pictures the site publishes (slices/, engine/, records/target/,
plus the pictures inlined as data in their pages) one kind from the first rule that matches its path (`*` stays in a
folder, `**` crosses). A folder holding rig.json is read first: its rig_ stills (and DIRECTION's fin_ finish pass) are
the asset, judged by the folder's BROADEST facing (a car head-on is narrower than its long side; three dogs and a cart
measured head-on were false reds the first cut); its clip keys share the stills' canvas; shadow_, raw_, rigid, id_,
obj_, calibration and riglight are render passes. Sheets with a frame in a JSON beside them (fight_people,
settlement_people, fight_beasts) are judged by their cell. Composites (a fight board, a settlement screen, a kit piece
laid from his tiles at 1:1), VOTE sheets, proofs and screenshots are not judged, each with the line that says where its
things are judged. At birth: 1,637 judged, 0 without a kind.

The map's party marker is the rig truck inlined in the map page: 54 painted, over the marker floor (40). The row's
"icons today at 5 by 5, markers at 8 by 8" are gone from the files: the 18 market icons paint 54 to 94 on their long side, the marker 54. No
pixel-grid sprites are drawn in the alpha's or the demo's code (the only grids in the map page are the district
stamps' layouts, not pictures).

## WHAT IS UNDER THE FLOOR: 67 PLACEHOLDERS (records/BOHEMIA_PLACEHOLDERS.md, UNDER THE PIXEL FLOOR)

| lane | count | what | painted | floor |
|---|---|---|---|---|
| COOK TWO | 5 | the fight's cover props, LIVE ON THE BOARDS: cone, tyre, bin, pallet, barrel | 24, 34, 44, 49, 54 | 56 |
| COOK TWO | 20 | the old interior floors (carpet, slab, wood, lino), 44 by 44 (d5cafc21, 8/26) | 44 | 92 |
| CHARACTER | 40 | the old flat walk and idle frames in 56 cells (the retired ART lane, 73306c94, 7/26) | 56 | 112 |
| COOK FOUR | 2 | a base's lot: the shed and the stall (LIFE+CITY made them, 145f98b2) | 84, 92 | 93 |

The owners come from a table in the kinds file, not git: this clone is shallow (82 commits) and git credited all 67 to
one SOUNDS commit; GitHub's own history named the makers.

## THE GATE (THE PIXEL FLOOR, 13/0, about 8 s)

F1 the floor file is the bank measured today; F2 every published picture has a kind; F3 nothing new under the floor
(red with the kind, the floor and the size); F4 no placeholder re-drawn and left under (its bytes' hash); F5
PLACEHOLDERS lists exactly the baseline, each routed to a lane, and one that reached its floor or left the site is
printed for --write to drop (a fix never turns it red). Self-tests S1 to S7 on a planted tree (a 20 px prop, a folder
with no rule, a rig person 60 and 100 tall, a wreck narrow head-on, a sheet's frame from its JSON, an inlined picture
with no rule, a re-drawn placeholder).

MY OWN SELF-TEST CAUGHT MY OWN HOLE: the first rules used shell-style globs where `*` crosses folders, so the rule for
the screenshots at the root of slices/ also swallowed ANY new subfolder of slices/; S2 failed, the globs now keep `*`
inside a folder, and the stricter rules surfaced 68 pictures that had been mis-kinded (PORTRAIT's 52 bodies of rule
120(d) this round, DIRECTION's 16 finish-pass stills), each given its line.

MUTATED FIVE WAYS ON THE REAL TREE, each leg red alone: a new 24 px prop (F3), the cone re-saved (F4), a folder with no
rule (F2), the tile floor typed down to 40 (F1), a line deleted from the list (F5).

## NOT COVERED, NAMED

A sprite drawn at run time by canvas calls (no file) is not measured here; the files and inlined pictures are. The
ART PIPE fence already refuses a new tool that writes pixels as numbers; a run-time leg would read the drawn size off
the real screen through the one driver.

## [bb pipe]

Battle Brothers ships every world sprite at one scale from one art team, so nothing on its map or its battlefield is
drawn at half the pixels of its neighbour; the floor makes ours hold the same line by measurement, file by file.
