# COOK FIVE (one file per lane, written only by COOK FIVE; newest block on top)

COOK FIVE (cook-five-01gkdyus): 11/11 LATEST -- BUILD 11/10zb - THE DECOY HAS ITS PICTURE, BUILT (31a2a9dcf), NOT YET SEEN (ask row 584, PLUMBER 8's red debt; rules 252(c), 367).
The 51st perk had no picture: the Decoy is now a cardboard man on his strut with a drawn-on smile, shot twice, made the fifty's way through
the master rig (COOK's tool, one model added; blue rim, row 3). Gate EVERY PERK A PICTURE 5/0 (51 of 51), its line struck from the
quarantine: THE RED DEBT 382 NAMED, 350 LEFT (the ratchet and the front page with it). VOTE cook5-the-decoy-has-its-picture-11-11 (MADE FROM
the rig icons). Record records/BOHEMIA_COOK_FIVE_THE_DECOY_HAS_ITS_PICTURE_11_11_26.md. Row 557 marked SHIPPED (11/10q).
NEXT, in the coordinator's order: the art for THE FLOOD TUNNELS and THE PARKING GARAGE (so they do not ship as stand-ins), then rows 576 and
585 (30 fight boards under half their colour; a lit tile on the Strip at night 2.77 to 1). The whole block: handoffs/COOK_FIVE.md.
[bb Battle Brothers never ships a perk with a blank frame]
[analog horror: a cardboard man who keeps smiling at whoever is shooting him]

COOK FIVE (cook-five-01gkdyus): 11/10 LATEST -- [freeway finished] SHIPPED and [casino finished] SHIPPED (rule 443(g), ask row 557).
BUILD 11/10q - THE FREEWAY AND THE CASINO FLOOR, FINISHED, BUILT, NOT YET SEEN (sha 9f0b36b27). Records: records/BOHEMIA_COOK_FIVE_THE_FREEWAY_FINISHED_11_10_26.md and
records/BOHEMIA_COOK_FIVE_THE_CASINO_FLOOR_FINISHED_11_10_26.md. VOTE cook5-the-freeway-finished-11-10 (GOLDEN, a landmark) and
cook5-the-casino-floor-finished-11-10 (MADE FROM the pit's passed ground).
WHAT: every picture of the four freeway boards FREEWAY marked STAND-IN is remade through the master rig (the floor tool's ground and
materials, the structure as meshes in metres, the rig's wear, grime, sun and camera): the deck 8.48 m up, which is one whole tile of
drop under every south edge; bents 36 m apart; broken ends with rebar; the city below from the fight's own suburb blocks seen from the
deck, a few windows lit; the ground under the deck in its shadow; a day-cab tractor, the freeway's own lamp mast, a hammerhead bent.
THE GOLDEN PIECE (408(b)): the south edge of the deck. Then the casino floor: HIS carpet (the same burgundy field and gold lattice,
matched by measure) built as a worn surface, and the lounge stage in black boards (it was a bare beige slab).
TOOLS: tools/bohemia_cook5_the_freeway_finished_11_10_26.py (render deck|ns|face|props about 11 min each on 4 cores with bpy 4.2,
then cut, then sheet <page shots dir>); tools/bohemia_cook5_the_casino_floor_finished_11_10_26.py (render, render stage, cut, cut
stage). The full renders are not in git (.gitignore, about 30 MB): re-render to re-cut.
GATE: NEW THE FREEWAY IS FINISHED (gates/the_freeway_is_finished_gate.js, registered, under 5 s): 11 passed, 0 failed (F1 to F7, four
planted fails). THE FREEWAY FIGHT and THE CASINO FLOOR (their owners' gates) as before: see the proof lines in the records.
ON THE PAGE (rule 441(a)): the fight's own page, a fresh page a board, his phone upright and sideways: all four freeway boards deal, 0 pictures missing, 0 page
errors, plus the deck at night; the casino floor dark and with power, 0 errors. THE LOAD IS LIGHTER ON EVERY ONE (ground bytes the
fight waits on): the deck 2.54 -> 2.27 MB, the overpass 2.98 -> 2.87, the underpass 2.50 -> 2.29, the interchange 2.77 -> 2.43, the
casino floor 3.80 -> 2.69. THE SPEED IS THE SAME AS THE STAND-IN'S AND IS NOT 60 ON A SLOWED PHONE (for PLUMBER's row, said plainly):
a headless phone-shaped browser slowed 4 times, a blank page 60.2, the settled freeway fight 38.6 and 38.8 with the old kit, 37.0
and 37.7 with the new (run to run moves 3); the worst frame 133 ms.

## FOR FREEWAY and COMBAT TWO: WHAT I TOUCHED IN slices/bohemia_freeway_boards.js (picture choice only; every line marked or commented)
No rule, layout, terrain, cover or dressing changed; THE FREEWAY FIGHT's A and M legs read the same 264 boards green. Inside deal():
city() reads the city below off five-tile sheets (kit.city), or the street-level blocks for a template whose skin says 'near';
facePic() (new) picks the face under a south edge (a bent every third tile, the street going under, a ramp's low wall, the hanging
end under a break); picOf() takes the tile's place in the whole picture for its hash (so the ring no longer repeats one edge tile ten
times), picks a broken end by side AND by north/south edge row, walls no lane toward a break, stands a bent on the verge beside it,
and lays the deck's own shadow on the ground north of a deck (kit tiles drop_n); the once-marks (kit.once) go on one board tile
each; the one fire is a sprite; the median's lamp is the kit's mast. freeway_boards.json: one key added (templates.overpass.skin).
If you add a template: give it a skin only if it stands on the street; everything else follows from the legend as before.
A NEW PICTURE KIND? Add it in the tool's cut() and the kit's tiles; the gate's F1 refuses a picture in the folder the kit never names.

## FOR COMBAT TWO: THE CASINO FLOOR (you own its rules and layout; I touched pictures only, and one line of your data file)
1. slices/fight_ground/casino/casino_floor.json: "floor.carpet" now names ONE sheet, casino/casino_carpet_0.webp (it named
   block_casino_0..2). Your carpet() picks any column and row of it, as before; the lattice is his own square diamond at eleven to a tile, so
   any tile meets any tile line for line (and every worn place fades out before a tile's edge: see the record). block_casino_* are untouched (the Strip's old boards still use them). The floor's own pictures went from
   three blocks (1.5 MB) to one sheet (462,658 bytes).
2. casino_stage.webp and casino_stage_steps.webp are re-rendered on the same canvas and foot (516 x 407 and 516 x 154; sizes.json
   untouched): black stage boards, a taped cable run, the front a black skirt under the brass nosing. Your models
   (reference/models/bohemia/casino_stage*.glb) are untouched: if you re-run your tool's 'all', it will write your beige stage over
   mine; skip 'stage' and 'stage_steps' there, or tell me and I move the build into your tool.
3. WHY THE STAGE WAS BEIGE (and your walls a little pale): the rig's source pass dusts every face that points up; on a floor or a
   riser every face does. The road's own mechanism fixes it: RIG.G['wear_by_material'] with a share for the material's name (I used
   carpet 0.12, the stage boards 0.18). Worth one line in your tool for any new floor piece.
4. NOT TOUCHED, my view for your call: the cage, the bar, the screens, the seats, the walls, the door and the front doors are rig
   pieces in metres with the grime pass: they are at the bar as they are. Their "stage": "stand_in" marks in casino_floor.json are
   yours to turn; I did not edit them.
5. WHAT WOULD LIFT THE FLOOR MORE THAN ANY PICTURE (a layout fact, yours): the wear cannot follow the aisles because every tile is a
   random pick; if the layout told the carpet which tiles are aisle ('.' between two rows of banks), the kit could carry an aisle
   sheet worn down the middle. Say the word and I cook it.

NEXT (if the coordinator opens it): the freeway's flyovers casting their shadow on the deck under them (needs a level-aware picture
kind); the tunnels' and the parking garage's stand-ins when COMBAT TWO lands them; an aisle sheet for the casino.
[bb] Battle Brothers never draws the same field twice and never leaves a grey box where a tree should be; a board ships whole or
not at all.
[analog horror] two tyre lines into a wall that is not broken; a city far below with a few windows lit and nothing moving; a carpet
worn in the shape of the crowd that stood on it.

COOK FIVE (cook-five-01gkdyus): 11/10 -- [freeway finished] CLAIMED 11/10 (rule 443(g), ask row 557; then [casino finished]).
