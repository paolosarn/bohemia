# COMBAT THREE (combat 3) -- the handoff block (written only by COMBAT THREE, newest first; COMBAT TWO is archived, its block is handoffs/COMBAT_TWO.md)

COMBAT THREE (rules 453, 416, 59, 428, 451(a); ask rows 468, 627): 11/17 LATEST -- [the mall] SHIPPED SHIPSHA, BUILD 11/17x - THE MALL, BUILT, NOT YET SEEN. VOTE combat3-the-mall-11-17 (stand_in).
Record: records/BOHEMIA_COMBAT_THREE_THE_MALL_11_17_26.md. The full sweep, job 1 again: the fifth big inside of row 468's list.
WHAT: a fight at the mall (0.7 of what the garage leaves there, by the cell's dice; opts.inside 'mall' anywhere) is fought on its concourse: eight stores as rooms (a shutter stuck
half down in each doorway: 3 AP, one at a time), carts, stock, counters, bedding, planters, kiosks, the food court's tables (3 AP, low cover), a column, the lift, the day through
the skylight and the doors, drum fires, and THE BRIDGE of the upper level in the middle (high ground, dead escalators the walk, the rail a climb) that NOBODY holds at the bell.
ONE DATA FILE: slices/fight_ground/mall/mall.json (two layouts, 23 tile kinds, 27 pieces all stand-ins), in slices/fight_ground/insides.json. No new rule code; the fight page
gained the ceiling kind 'sky' (ceilingSheet). GATE THE BIG INSIDES 29/0 (15 legs an inside); I8 now reads the inside's own 'start' ('gallery' = held at the bell; else nobody's).
ON THE PAGE (this stamp): the demo and the alpha, upright and on its side: 4 fights inside the mall, 4 ended on AUTO, 6 of 6 tile taps, 0 page errors; the ceiling moves a pixel
4 of 255 on average.
THE DRIVER: C3_INSIDE=<id> counts only fights inside that inside; C3_FAR=<notches> takes a far still.
*** FOR COOK FIVE (the mall's names, agreed here as the coordinator asked; every picture of the mall is a STAND-IN today): yours replace them with no code. Put
slices/fight_ground/mall/mall_art.json in the folder, THE GARAGE'S FORMAT ({ "floor": { "floor": [...], "store": [...], "high": [...], "ring": [...] }, "kit": { name: { "src",
"w", "h_px", "foot": [x, y], ... } } }), with any of these names; a name you leave out stays its stand-in:
  the floors     floor.floor (the concourse: pale terrazzo, cracked, a dead plant's leaves), floor.store (a store's carpet or tile), floor.high (the bridge's floor),
                 floor.ring (the mall going on past the fight)
  mall_front_ew        a STORE FRONT, a tile wide, seen from the concourse: glass boarded or gone, a dead sign over it (today the casino's glass doors). THE RUNWAY LIVES HERE:
                       a window with what is left of a display
  mall_storewall_ns    the wall between two stores, seen end on (a tile deep)
  mall_door            a store's doorway with its shutter stuck half down (a man ducks under it; the tile is walked)
  mall_carts, mall_cart_a, mall_cart_b    a corral of carts, about a tile wide; one loose cart (drawn, never counted)
  mall_stock, mall_boxes    stock on pallets, half a tile (boxes: the drawn-only second stack)
  mall_counter         a store's counter with shelves behind; mall_kiosk   a kiosk on the concourse; mall_planter   a concrete planter, what grew in it dead
  mall_camp_a, mall_camp_b, mall_bedding_a, mall_bedding_b    somebody living in a store: bedding and bags, half a tile (bedding: drawn-only)
  mall_tables, mall_seats   the food court's bolted tables and chairs, a tile wide (seats: the drawn-only second row)
  mall_rubble          a piece of the ceiling come down; mall_column   a column; mall_lift   the lift's shaft, doors shut (a tile's blocker)
  mall_bridge          one tile of the upper level's deck; mall_escalator_e, mall_escalator_w   a dead escalator rising east / west (a tile)
  mall_rail_ew, mall_rail_ns    the bridge's glass rail; mall_wall_ew, mall_wall_ns   the mall's outer wall
  mall/mall_ceiling.webp    THE CEILING: the painted sky (the Forum Shops'), faded, paint let go, a rib every bay, the skylight's grid along the middle; it tiles every 5 by 5
                       tiles; set "have": true in mall.json's ceiling the day it is in (the same contract as the garage's)
  ASKED, NOT IN THE DATA YET (no stand-in exists, so I left them out; say when they are in and I add the legend line): mall_mannequins (a store's mannequins, drawn-only, what is
  left of the runway), mall_fountain (the atrium's dead fountain, a blocker in place of the lift)
*** SAID PLAINLY: the food court layout was never on the glass by the map's own hand (every valley dealt the_atrium at its mall cell): gate and a look on the fight page alone.
The men crowd the bridge (114 of 250 on it after round one).
NEXT: the distribution warehouse, then the data fort (a data file each).
[bb Battle Brothers never fights indoors; what it teaches here is the hill: high ground in the middle of the map that neither side starts on is the fight]
[analog horror: a mall's security tape, timestamp burned in, the painted sky still lit by one working fixture, somebody's bedding in a shoe store]

COMBAT THREE (rules 453, 429(a)(g), 428, 441; ask rows 504, 507, 627): 11/17 -- [the zone is the board] SHIPPED e3855e22f, BUILD 11/17p - THE ZONE IS THE BOARD, BUILT, NOT YET SEEN. VOTE combat3-the-zone-is-the-board-11-17 (stand_in).
Record: records/BOHEMIA_COMBAT_THREE_THE_ZONE_IS_THE_BOARD_11_17_26.md. The full sweep's job 2 (the open-map boards look like their zone, never two alike) and job 3's leg on it.
WHAT: a map cell no place stands on, in a district that has a place, deals THAT PLACE'S OWN BLOCKS with its plan kept (pinned columns and rows: the boulevard, the canopy, the dry
wash, the shore line), no landmark, a share of the free slots from the zone's other kinds in WORLD's table (ours.plain_cells.mix), each by the cell's dice; blocks whose street
runs the way the cell's street runs are three times as likely (FIGHT_OPTS.ground.street); the lines start as a line or wide. A district with no place deals as 11/14f.
FIGHT.html __THE_ZONE_IS_THE_BOARD__: plainCell (opts.ground makes a cell plain), blockStreet, dealZone, the fork in dealOnce; the board def carries zone: <place id>.
GATE A PLAIN CELL IS NOT THE PLACE 11/0 (P7 looks like its zone 63% own blocks, P8 557 of 560 different over eleven zones, P9 the street is the cell's, P10 AUTO to the end
23 of 23 with rule 428's numbers), registered words updated. The sourced-numbers gate counts 67 typed on this tree, the same as main before it (it was red before me, not mine).
ON THE PAGE (this stamp): the demo and the alpha, upright and on its side, 24 fights on plain cells of 14 districts through the map's own door, 24 ended on AUTO, 0 page errors.
THE DRIVER (tools/bohemia_combat_three_on_the_page.js): C3_PLAIN=1 now goes through cityHandOver (__met) so the ground and the street ride along, and picks zone by zone in turn.
*** FOR WORLD THIRTEEN (your seam, read; nothing of yours edited): I read FIGHT_OPTS.ground.district (the cell is plain) and ground.street.way ('ew', 'ns', null = none; ground.street
undefined = unknown, no lean). ground.zone, kind, families, ends and mouths are not read yet: the kinds still come from BohemiaFightKinds by district. If a street's ENDS should
close a board's edge (a dead end), that is the next read; say so in your block and I will take it.
*** FOR COOK FIVE: nothing new asked here. The zone boards are the finished blocks. The hall's names (below) still stand; the mall's names come with its build.
*** SAID PLAINLY: the '_cut' stills of a plain run catch the fight's opening camera mid-turn (dark, tilted); '_start' is the settled board. No plain cell of golf, the springs or the
landfill on this valley: gate only. The map's tiles one for one (opts.street 'map') still not shipped.
NEXT: the mall as the next big inside (a data file through slices/bohemia_big_inside.js), then the distribution warehouse.
[bb Battle Brothers cuts its tactical map from the world tile's terrain: a swamp tile fights as swamp, a forest as forest, never one field for the whole world]
[analog horror: the same valley from six tapes, each labelled with a place name in marker, none of them the suburb you grew up in]

COMBAT THREE (rules 453, 416, 451(a), 428; ask row 468): 11/17 -- [the convention hall] SHIPPED dc02fb462, BUILD 11/17c - THE CONVENTION HALL, BUILT, NOT YET SEEN. VOTE combat3-the-convention-hall-11-17 (stand_in).
Record: records/BOHEMIA_COMBAT_THREE_THE_CONVENTION_HALL_11_17_26.md. The full sweep's job 1 (the next big inside from the researched list: the fourth).
WHAT: a fight at the convention center (0.7 of what the garage leaves there, by the cell's dice; opts.inside 'hall' anywhere) is fought in one corner of a hall turned shelter:
bare aisles (open floor), fields of cots (low cover), relief pallets and sandbags (cover), chairs (rough, low cover), containers and columns (blockers), a mezzanine along the
north wall they hold (high ground; stairs the walk, the rail a climb), a folding wall with a gap (one of two layouts), the dock doors' day, drum fires, its trusses overhead at 10%.
AN INSIDE IS DATA NOW: slices/bohemia_big_inside.js (kit, deal, check) lays any inside from slices/fight_ground/<id>/<id>.json; slices/fight_ground/insides.json lists them.
FIGHT.html __A_BIG_INSIDE_FROM_ITS_DATA__: the loader (DB.insides), insidePiece in pieceDef/pieceSrc, bigInside(opts) in the chain after casinoFloor, ceiling kind 'truss'.
The mall, the warehouse, the data fort next are a data file each. GATE THE BIG INSIDES 15/0 (I0 to I9 per inside, six plants), registered.
ON THE PAGE (this stamp): the alpha and the demo, upright and on its side: 13 fights at the convention center, 6 of them in the hall; all ended; 14 of 14 tile taps; 0 page errors.
*** FOR COOK FIVE (the names, agreed here as the coordinator asked; every picture of the hall is a STAND-IN today, drawn as another kit's finished piece): yours replace
them with no code. Put slices/fight_ground/hall/hall_art.json in the folder, THE GARAGE'S FORMAT ({ "floor": { "floor": [...], "high": [...], "ring": [...] }, "kit": { name:
{ "src", "w", "h_px", "foot": [x, y], ... } } }), with any of these names; a name you leave out stays its stand-in:
  the floor      floor.floor (the show floor's sealed slab: aisle tape, booth numbers), floor.high (the mezzanine's carpet), floor.ring (the hall going on past the fight)
  hall_cots_a, hall_cots_b      a block of cots, about HALF a tile wide: four are laid on a tile (at .27/.73 across, .5/.95 down); hall_beds_a, hall_beds_b are the same
                                pictures drawn and never counted (the rest of the field)
  hall_pallets, hall_stack      shrink-wrapped relief pallets (stack: the drawn-only second one); hall_container   a shipping container, a tile's blocker
  hall_chairs, hall_seats       a row of folding chairs, a tile wide (seats: the drawn-only second row); hall_desk   the registration desk
  hall_sandbags, hall_barrier   a sandbag checkpoint; crowd barriers
  hall_column; hall_wall_ew, hall_wall_ns (the outer wall, on a wall tile's edge); hall_airwall_ew, hall_airwall_ns (the folding partition)
  hall_mezz (a whole tile of the raised deck, foot at the tile's south edge middle, the garage_level's way); hall_stair_e, hall_stair_w (the deck east / west of it);
  hall_rail_ew, hall_rail_ns
  and the ceiling: slices/fight_ground/hall/hall_ceiling.webp, then "have": true in hall.json's ceiling (tile [5, 5]; roof trusses, catwalks, dead banners).
Sizes are yours: the module reads w, h_px and foot from your file. Say in your handoff if a name or a way of laying should change and I take yours. ***
NOT DONE: no people on the cots (CHARACTER / PEOPLE); only six convention cells on a valley.
MY MISTAKE, FIXED THE SAME ROUND (a fix commit on top of 11/17c): the hall's ship turned two gates red on main for about an hour. (1) WORLD THIRTEEN's EVERY MAP KIND HAS ITS
FIGHT ANSWER P4, 'OFF THE TABLE convention: casino.0': an inside's board carried a fixed placeholder block. FOR WORLD THIRTEEN: an inside's 'blocks' are now the block your
table names for the district (its place's field block, else the first of its lead kind): insideBlocks in FIGHT.html, all four insides; 22/0 again. If you want the table
to name a kind's insides, they are slices/fight_ground/insides.json and each data file's 'districts'. (2) EVERY PLACE ITS OWN BOARD crashed (the new loader named window
in a harness that has none): guarded; PASS again. I had run the insides' gates and not these two before the push; both are in my ship check from here.
[bb Battle Brothers' camp fights: palisades and tents as cover, a gate as the chokepoint; the hall's folding wall is that gate]
[analog horror: four hundred cots in rows under a banner for a trade show that was never taken down]

COMBAT THREE (rule 451(a)(b), his vote sheet of 11/14; ask rows 623 and 624): 11/14 LATEST -- [the ceiling, the tunnels] SHIPPED c15ab305a, BUILD 11/14p - THE CEILING OVER YOUR HEAD, BUILT, NOT YET SEEN. VOTE combat3-the-ceiling-over-your-head-11-14 (stand_in).
Record: records/BOHEMIA_COMBAT_THREE_THE_CEILING_OVER_YOUR_HEAD_11_14_26.md.
(a) AN INSIDE SHOWS ITS CEILING (FIGHT.html __AN_INSIDE_SHOWS_ITS_CEILING__: ceilingOf, ceilingSheet, drawCeiling after drawLash): the garage, the casino floor and the
tunnels carry S.boardDef.ceiling from their data file's 'ceiling' { kind, alpha 0.10, src, have, tile }; one sheet over the whole board and the men at that alpha, capped at
0.14. On the page 99 pixels in 100 move 13 of 255 or less. Gate AN INSIDE SHOWS ITS CEILING 6/0, registered.
*** FOR COOK FIVE (the file names, agreed here as the coordinator asked): the three ceilings on the glass today are STAND-INS the fight draws itself. Yours replace them
with no code: put ONE picture per inside in its folder and set 'have': true in that data file's 'ceiling' (the one line of mine you may edit):
  slices/fight_ground/garage/garage_ceiling.webp    garage.json ceiling.tile [5, 5]   (one bay of the deck over his head, from below)
  slices/fight_ground/casino/casino_ceiling.webp    casino_floor.json ceiling.tile [4, 4]
  slices/fight_ground/tunnels/tunnel_ceiling.webp   tunnels.json ceiling.tile [4, 3]
Each is the ceiling seen from below at the fight's camera, repeating edge to edge, covering 'tile' fight tiles (change 'tile' to what you paint). It is drawn at 10%, so
strong shapes and a rhythm that is NOT the tile grid read best, fine texture is lost; keep it small (the site's cap). Your gate A1 will want the file named in garage_art's
way: say in your handoff if you need another name and I will take yours. ***
(b) THE TUNNELS CROSS LESS OFTEN: tunnels.json has two single runs (the_long_run, the_double_box) and names the three old layouts as crossings { share 0.25 };
slices/bohemia_flood_tunnels.js deals by it. Gate THE FLOOD TUNNELS 16/0 (T9: 152 of 600 a crossing; planted).
ON THE PAGE: the alpha and the demo, upright and on its side: the garage 4 fights, the casino floor 1, the tunnels 9 (3 single runs on this build's stamp); every ceiling
on the glass; all ended; 36 of 36 tile taps; 0 page errors. PARKING GARAGE 16/0, CASINO FLOOR 9/0, THE INSIDES WEAR FINISHED ART 14/0.
NOT DONE: the_long_run not seen by eye on the page (dealt by the gate); the ceilings are stand-ins.
MY MISTAKE, FIXED IN THE NEXT COMMIT: c15ab305a went to main with the ask ledger (rows 623 to 625) carrying an unresolved merge: my rebase helper does not know that file and I added it unread; the HANDOFF gate said so and the push had already run. Rows 623 and 624 mine, 625 HOME BASE's, resolved by hand; the helper now refuses to go on while any file carries a marker.
[bb Battle Brothers has no insides: every fight is under the sky. Ours has three, and now you can tell]
[analog horror: the tube lights over the deck, most of them dead, so faint you only notice when one is over your man]

COMBAT THREE (rules 447, 442(d), 429(a)(c)(g); ask rows 547, 577, 504, 507, 610): 11/14 -- [not the same suburb twice] SHIPPED 1d197f42d, BUILD 11/14f - NOT THE SAME SUBURB TWICE, BUILT, NOT YET SEEN. VOTE combat3-not-the-same-suburb-twice-11-14 (stand_in).
Record: records/BOHEMIA_COMBAT_THREE_NOT_THE_SAME_SUBURB_TWICE_11_14_26.md. The coordinator's round, one tight batch, three jobs:
(1) THE SEAM CHECK IS GREEN, 15 of 15 (gate NO BOARD BREAKS ITS OWN PICTURE; it was red on the suburbs, 19.7%). Measured: 97 of the 98 lines it saw were the new streets'
own kerbs against a yard (ground against ground 0 of 279; street against street 1 of 89, a roof). The reader (tools/bohemia_combat_maps_seams_read_11_3_26.py) now takes
the fight's street map: a street's edge is its kerb, never a seam, but it must BE a kerb (a seen border with the street's side still its asphalt is counted: 0 of 409 over
six places); street against street is read as any border. Planted every run. No picture and no board changed.
(2) A PLAIN CELL IS NOT THE PLACE (FIGHT.html plainCell, __A_PLAIN_CELL_IS_NOT_THE_PLACE__): a place's own board is dealt only where the place stands (opts.template); a
cell the map hands with no place under it deals from its own ground and zone (placeKinds: the district's kinds in WORLD's table, the cell's dice). 30 plain suburb cells:
30 boards (they were 1). The fight knows a plain cell by the map window (cityFrame.vbTemplateAt exists and no template came); opts.place false / true force it.
Gate A PLAIN CELL IS NOT THE PLACE 7/0, registered. ON THE PAGE: 20 fights, the alpha and the demo, upright and on its side, all ended, 0 page errors.
*** NOT SHIPPED, FOR THE COORDINATOR AND COOK: the map's own block cut tile for tile (opts.street 'map') is the truest 429(a) and I looked at it on the demo for plain
cells: a dark bare tarmac field with pale pads in a checkerboard (the industrial park), the look he refused on 11/7. One line turns it on (streetPlanFor). It needs one
continuous finished ground per zone under the lots before it is his to see. ***
(3) ROW 610: not in the fight board's hand-over. It is the JOB board (JOBS fixed it, 11/11s). The fight's board is seeded by the cell and its ground: the same cell, the
same board (gate leg P6, 35 of 35).
THE SITE'S WEIGHT: this build is about 0.7 MB lighter (my eight card pictures re-encoded, 1,539 KB to 684 KB). The cap is PLUMBER's.
FOR WORLD THIRTEEN: nothing of yours edited. The fight reads your vbTemplateAt's presence on the map window to know the map stands places; P2 holds every plain board to
your table's families, so the_map_kinds_have_fight_answers stays true. FOR EYES: plain cells now deal by the cell (tools/bohemia_combat_three_on_the_page.js demo upright OUT district:suburb 3, C3_PLAIN=1).
RED, NOT MINE, as before: PAGES PUBLISH's cap, the VOTE tab's old legs, the gate registry's orphans.
[bb Battle Brothers deals its fight map from the world tile's terrain and what stands on it; ours now does away from the places, and keeps a place's own board where the place is]
[analog horror: the same cul-de-sac never twice; you know the street is wrong because you have never stood on it before]

COMBAT THREE (rule 429(a) ONE MAP; ask rows 504, 506, 507; WORLD THIRTEEN's seam): 11/11 -- [crew on its cell] SHIPPED 9b75c364e, BUILD 11/11z - THE CREW STARTS ON ITS CELL, BUILT, NOT YET SEEN. VOTE combat3-the-crew-starts-on-its-cell-11-11 (stand_in).
Record: records/BOHEMIA_COMBAT_THREE_THE_CREW_STARTS_ON_ITS_CELL_11_11_26.md.
WHAT: a fight the map hands from a cell of one of the 15 places (opts.template, WORLD THIRTEEN's __THE_CUT__) stands his company ON THAT CELL of the place's own board
(setup, __THE_CREW_STARTS_ON_ITS_CELL__): S.rowMid = the cell's middle row (ty + 1; deployCrew, place and formationNow all count from it); his front = the cell's east
column (tx + 2) wherever both lines have joined ground (roomAt: the meet map), the usual column west of it (rule 415(b)), the farthest east that leaves their line its
gap, stepped west where a wall or a pen leaves a line no ground (the Strip, the lab). S.cutStart = { id, cell, tx, ty, wanted, front, mid, onCell, usual, max, stood:
'cell' | 'usual' | 'east' | 'room' }. THE FIGHT STILL RUNS WEST TO EAST (rule 67).
ALSO: (a) the kept line (rule 110b) is counted from the row it was stood on, so it comes back on the same tiles on any cell; (b) A PLACE'S CELL WINS OVER AN INSIDE:
floodTunnels, parkingGarage and casinoFloor yield when opts.template names a place board and no inside was asked (found on the alpha: the wash's own place was dealt the
tunnels); the insides keep their share on every cell no place stands on, and opts.inside still asks for one by name.
GATE THE CREW STARTS ON ITS CELL 9/0 (K1 to K8, one plant; 525 hand-overs, 15 places x 35 cells), registered. EVERY MAN ACTS ON AUTO 22/0.
ON THE PAGE: 20 fights, the alpha and the demo, upright and on its side, a different place each: 20 of 20 on the place's own board with the cell, his rows the cell's
(0 or 1 row off), his front as cutStart says, every man of both sides on the glass at the bell, all ended, 0 page errors.
*** FOR WORLD THIRTEEN (your seam, answered; nothing of yours edited): I read FIGHT_OPTS.template { id, board, tx, ty, cell } as you send it; your block in dealOwn stands.
The crew is on the cell's rows; its front is clamp(tx + 2, 5, 12) stepped west for ground (S.cutStart.stood says which). A cell in the east third of a place cannot be his
front: their line needs the board east of him. If the map ever knows which way he walked in, send template.from ('w' | 'e' | 'n' | 's') and the fight can face it. flip is
not read. A place's cell now wins over the tunnels / the garage / the casino floor, so what your painter shows on a place's cells is what is fought. ***
every_place_no_seams (handed to me by WORLD THIRTEEN, red on main: suburb 19.7% / 14.0% against 4%): NOT STARTED, said plainly. The place boards' ground pictures; next on my list.
RED, NOT MINE, as before: PAGES PUBLISH's cap, five VOTE tab legs, the gate registry's orphans.
[bb Battle Brothers deals a fresh tactical map from the world tile the party stands on; ours is the same place's own board, and the company on the very cell it stood on]
[analog horror: the lab's pens are where the map said they were, and you are standing by the one that is open]

COMBAT THREE (rules 435(d), 441(a); ask rows 555 and 605): 11/11 -- [every turn reads] SHIPPED fbf93f5c1, BUILD 11/11x - EVERY TURN READS, BUILT, NOT YET SEEN. VOTE combat3-every-turn-reads-11-11 (stand_in).
Record: records/BOHEMIA_COMBAT_THREE_EVERY_TURN_READS_11_11_26.md.
WHAT: row 555 measured before a line changed: ON AUTO the quiet word already fired (THE POT at 4x on the alpha 7 of 7; headless 5 of 5); the silent turns were the
ones CLOSED BY HAND (the word's one switch was S.byHand). endTurn (__EVERY_TURN_READS__) now says the word whoever closed the turn: on AUTO the brain's reason as
before; by hand what he did (handWhy: reload, swap_reload, swap, else holds), the event marked hand: the page holds the turn a sixteenth of a bar (play by hand is
not slowed), the word stands over the man a beat and a half as every quiet word does.
ROW 605 (EYES: a stale u.turnLog), FOR FIXES 2 AND EYES: NOT REPRODUCED (1,234 turn ends of his over 80 AUTO fights, eight districts: each had its own 'turn' before
it; 18 quiet, 18 said). beginTurn is the one place that sets the marker; endTurn, advance and wait all let the next turn begin. A marker read the same in two
rounds from outside can be a man's OLD object: keptRead's thaw makes new men (S.units replaced), so a probe holding the old DESI reads her old numbers. The word is
closed against it all the same (__THE_TURN_IS_ITS_OWN__, turnStart: a turn is never read from before his own last 'end'; gate leg R6). If EYES sees it again, read
FIGHT.S.units fresh at the 'end' and send the log from his last 'turn'.
GATE EVERY TURN READS 7/0 (R1 to R6, one plant), registered. EVERY MAN ACTS ON AUTO 22/0; its mute plant now takes the word out of the log (the rule says it for
every hand).
ON THE PAGE (this build): THE POT's fight, AUTO two rounds then a finger on RELOAD and END TURN: the demo upright 8 of 8 turns showed their word, the demo on its
side 8 of 8, the alpha upright 7 of 7 (one press did not land), the alpha on its side 7 of 7 (one press did not land); on AUTO at 4x on the alpha on its side 6 of 6 quiet turns
said, the demo upright at 2x 1 of 1; 0 page errors in six runs. Driver: C3_BYHAND=8 C3_BYHAND_AFTER=2 node tools/bohemia_combat_three_on_the_page.js demo upright OUT "boss:THE POT" 1.
KNOWN, SMALL: right after AUTO is switched off the first hand-closed turn can still carry AUTO's reason (S.byHand is set by the page's own tick); it says a word either way.
[bb Battle Brothers writes every turn into its combat log, the skipped ones too; ours puts the word over the man]
[analog horror: the word sits a beat and a half over a man who did nothing, then is gone, like a caption on a tape nobody is watching]

COMBAT THREE (rule 440(a), 441, 443(h), ask row 539; and the root of ask rows 548 and 558): 11/11 -- [parking garage] SHIPPED c6bf2b21e, BUILD 11/11u - THE PARKING GARAGE, BUILT, NOT YET SEEN. VOTE combat3-the-parking-garage-11-11 (stand_in).
Record: records/BOHEMIA_COMBAT_THREE_THE_PARKING_GARAGE_11_11_26.md.
WHAT: the third big interior. slices/bohemia_parking_garage.js (deal, check), slices/fight_ground/garage/garage.json (two layouts of 15 x 20 characters, the legend,
'tiles': 15 kinds each with its ground row, AP, open floor, cover, the line he reads; the districts and shares; the gallery start; 'rules' and the cars' 'sizes').
THE PICTURES ARE COOK FIVE'S FINISHED KIT (garage_art.json, BUILD 11/11p: floor, raised bay, ramps east and west, rails, outer wall, columns, core, booths), laid the way
its how_it_lays says; my own stand-ins for those pieces were dropped unshipped. COMBAT'S OWN: three groups of parked cars (tools/bohemia_combat_three_the_parking_garage_
11_11_26.py: all [piece ...]; BOHEMIA_BPY=<venv python with bpy 4.2>). A third of the fights at the four casino districts (the rest still the casino floor), four in ten
at mall, convention, stadium, sphere, strat, medical, terminal, by the cell's own dice; opts.inside 'garage' / false.
THE HIGH BAY is a raised bay (level 1, THE FIGHT'S ROOF: laid.roofs true): a RAMP in its aisle (high ground, never a roof) is the WALK up; over the rail from low floor
is the fight's CLIMB (rule 328: no attack that turn, no beasts). THEY HOLD THE GALLERY (new start 'gallery', FIGHT.html galleryStart): a third to a half of the band
starts up on the bay; AUTO's shooters go up for it (86 men on the bay after round one in 12 fights; nobody before).
NEW IN THE FIGHT: a tile's say_before (said before the fight's own high-ground line); kind DRESS pieces (drawn, never cover: the extra parked cars); opts.inside now
names which interior (a garage ask never deals the tunnels or the casino); DB.garage = { data, art, sizes, kit } (the kit is the art's pieces with the data's rules).
GATE THE PARKING GARAGE 16/0 (G1 to G9, seven plants), registered; EVERY MAN ACTS ON AUTO plays the garage as a board kind.
ON THE PAGE (the build that shipped): 14 fights, the alpha and the demo, upright and sideways, 1x/2x/4x: 14 ended, 0 page errors, 227 of 251 turns of his acted, 23 of 24 quiet turns said (one man struck down), 46 of 46 tile taps said their line.
*** FOR FIXES, PLUMBER 8, EYES, CHARACTER (rows 548, 558): THE ROOT OF 'drawImage ... not of type' EVERY 2 s IS FOUND AND FIXED. Stack, caught on the demo on its side:
put <- BohemiaWear.on (engine/bohemia_wear.js:204) <- wearOver <- blitMan / meleeDraw / holdDraw. At night the armour's piece is a NIGHT sheet (wearOver's tint) and the
module drew it with the glass's own drawImage; when the glass answers to the demo shell's classes the browser throws and the rest of the frame is skipped. Fixed in
wearOver (FIGHT.html, __THE_ARMOUR_DRAWS_THROUGH_THE_FIGHT__): the module is handed { drawImage: cxDraw }. CHARACTER: nothing of engine/bohemia_wear.js was touched; if
the module ever draws on another page's glass at night, hand it that page's own draw the same way. The test's probe (page.json wearProbe): on a shell-owned glass the
raw draw THREW, the fight's draw drew. ***
FOR COOK FIVE (your step 5, 'when your board deals, tell me'): IT DEALS. slices/bohemia_parking_garage.js lays your kit by your how_it_lays (level / level_aisle on every
bay tile at fx 0.5 fy 1.0, ramp_e / ramp_w in the bay's aisle row, rail_ew / rail_ns on the bay's open edges, the wall on the deck's edges, a column a tile, the core on
the north wall, the booth on two tiles at the way out). Walk it (node tools/bohemia_combat_three_on_the_page.js alpha upright OUT garage 2). North and south ramps are NOT
needed. STILL STAND-INS, yours next: the three parked-car pictures (garage_cars_a/b/c.webp, wreck.glb; their size and foot in garage.json 'sizes'). WANTED: one floor
tile of glass ground into the oil (the board's slow ground was cut for want of it). Things on the bay are drawn 61 px up the glass. FOR TUNING: garage.json gallery.share / least.
FOR WORLD / JOBS: opts.inside 'garage' asks for it anywhere (a job in a garage); districts and shares are the data's.
RED, NOT MINE: PAGES PUBLISH is over its cap on main (about 911 MB of 900) before this build; this build adds about 0.5 MB (three car pictures and the card).
NEXT: row 555 (a turn he ends by hand says what it was), then the crew starting on the map cell's tiles (WORLD THIRTEEN's seam, rows 504, 506, 507).
[bb] Battle Brothers' hills give +10% to hit down and a tile of range; the high bay is that row of its table, indoors, with the ramps as the only passes.
[analog horror] one car in the whole dark deck with towels in its windows and a chair set beside it, the stall next to it swept clean.

COMBAT THREE (rule 440(a), 441, 443(h), ask row 539): 11/11 LATEST -- [flood tunnels] SHIPPED 753a6b628, BUILD 11/11c - THE FLOOD TUNNELS, BUILT, NOT YET SEEN. VOTE combat3-the-flood-tunnels-11-11 (stand_in).
Record: records/BOHEMIA_COMBAT_THREE_THE_FLOOD_TUNNELS_ON_MAIN_11_11_26.md (COMBAT TWO's board record stands: records/BOHEMIA_COMBAT_TWO_THE_FLOOD_TUNNELS_11_9_26.md).
WHAT: COMBAT TWO's parked tunnels (origin combat2-tunnels-parked-2) landed on main, its own 548 fix dropped (FIXES' row 558 is on main and kept whole). ADDED: (1) EVERY TILE
ITS COST AND ITS EFFECT: tunnels.json 'tiles' (one row a tile kind: its ground row in the ONE ground table, its AP, open floor or not, cover, the line he reads); the fight
reads it as the board's tileKey (FIGHT.tileKeyAt, groundSay; streetMap reads 'open', goodGround reads 'good'). ANY big interior can carry a tileKey the same way.
(2) AUTO SCRAMBLES OFF THE OPEN FLOOR: the main channel is open floor (ours.open_street untouched, TUNING's); flood debris as cover in the channel (the street board's
own sb_rolled_S, sb_wreck_S, sb_cart_S, sb_tyres_S, reused). After round one 30% on the bare channel against 55%. GATE THE FLOOD TUNNELS 14/0 (T7, T8 new, three plants).
ON THE PAGE (tools/bohemia_combat_three_on_the_page.js, new, any lane may use it: <alpha|demo> <upright|sideways> <outdir> <tunnels|garage|district:NAME> [fights]):
19 fights, the alpha and the demo, upright and sideways, 1x/2x/4x: 19 ended, 278 turns of his, 270 acted, 8 of 8 quiet turns said, 21 of 21 tile taps said their line.
FOR FIXES (row 558's error, NOT fixed for good): one demo-upright fight of the 19 threw 'drawImage ... not of type' 27 times, every 2 s from its first second (a night
board; the box's CPU was shared with a render); two more runs of ten fights clean. The driver logs the stack of the first three errors of a run now.
FOR COOK FIVE: the tunnels' pieces are stand-ins (tunnels.json kit 'stage'); the debris pieces are the street board's.
FOR TUNING: nothing of yours moved; the scramble's numbers are ours.open_street's.
NEXT: THE PARKING GARAGE (in flight: slices/bohemia_parking_garage.js, slices/fight_ground/garage/, tools/bohemia_combat_three_the_parking_garage_11_11_26.py), then row 555, then the cut from the map cell with WORLD 13 (rows 504, 506, 507).
[bb] Battle Brothers prices every tile and says so on it; ours does the same under the city, and the ground changes mid-fight.
[analog horror] the one lit square under the street grate is the worst place to stand in a hundred metres of dark.
