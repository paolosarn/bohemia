# COOK SEVEN: THE POLICE STATION, FINISHED, ITS SQUAD ROOM, ITS SALLY PORT AND ITS DROPPED CEILING (11/27/26)

COMBAT FOUR's BUILD 11/22e asked 'FOR COOK (SIX)'; VAMILY rule 480(b) (finished art where a stand-in still stands: the third of the 27 insides
COMBAT FOUR added since 11/21 with every piece a stand-in; eight fights in ten at a police station's cell go inside); rule 482; rules 461, 441,
416, 451(a), 479(b). BUILD 11/27zk - THE POLICE STATION.

## WHAT THIS IS
COMBAT FOUR's police station: its squad room or its sally port. Every one of its 16 pieces was a stand-in (the casino's cage, seats, bar, glass
and screens, the tunnels' camp, the street board's bales, heaps, sandbags and patrol car, the garage's walls) on the mall's floor, and its
ceiling was drawn by the page. They are in the folder now under its names, and the station lays them with no code changed:
- THE FLOOR (police_floor_0.webp): rows 0 to 2 THE SQUAD ROOM'S VINYL (floor.floor, floor.ring): 30 cm squares, a ground of its own (pd_vct:
  the hall's calibrated slab with the shader's joints every 0.3 m and each square its own shade), a path worn grey, chair casters' arcs,
  boot scuffs, coffee dried, a square lifted to its glue. Rows 3 and 4 THE SALLY PORT'S CONCRETE (floor.port): the truck stop bay's.
- THE PIECES (police_art.json's kit, COMBAT FOUR's 16 names): HOLDING CELLS (pd_cells: three cells of block 4 m wide, fronts of round bars on
  their bands, a stainless bunk and a steel toilet in each, the slot window, ONE DOOR STANDING OPEN AND THE OTHERS LOCKED WITH NOBODY IN THEM;
  a tile long, the block walls on its edges in halves so a run meets). A STEEL BUNK (pd_bunk: three dragged out of the cells, one on its side,
  a mattress on the floor, blankets, a bucket, the dayroom's table on its plate with its four stools). THE DESKS (pd_desks: six steel desks
  pushed into a block, dead monitors, keyboards, forms, A PHONE OFF ITS HOOK, its handset hanging; a chair on its back). FILING CABINETS
  (pd_files: four standing with drawers out, three tipped on their faces, files fanned). SPILLED CASE BOXES (pd_boxes). THE FRONT COUNTER
  (pd_counter: chest high, panelled, its work top, three screens, the bell, the forms' trays, its gate swung). THE LOBBY GLASS (pd_glass:
  a tile long, a low block wall, the glass in its frames to 2.4 m, the pass-through tray and the grille, starred four times where it held).
  LOBBY CHAIRS (pd_chairs: two beams of four seats back to back, a seat gone, a third beam on its back). LOCKERS (pd_lockers: a tile long,
  24 louvred doors, five hanging open and empty, a name tape left on one, the bench). THE EVIDENCE CAGE (pd_evidence: a tile long, welded mesh
  on posts with its wires every 10 cm, the shelving behind it bare but for a few bags and boxes, the mesh cut and peeled back toward you).
  PROPERTY CAGES (pd_cages: mesh bays along the port's wall, two doors open, a bike wheel and a tag). A PATROL CAR (pd_car: east to west,
  black and white, on flat tyres, the push bar, the light bar dead, a rear door open, its glass on the floor). CONES AND STANDS (pd_cones:
  ten cones, three sawhorses, one flat). A BARRIER (pd_barrier: four water-filled barriers, emptied, two on their sides). THE STATION'S WALL
  (pd_wall_ew, _ns: painted block over a dark teal wainscot, the blue stripe, a notice board's clean ghost, stains).
- THE CEILING (police_ceiling.webp, rule 451(a), over the fight at his 10%; the data names its kind 'grid'): the squad room's dropped ceiling:
  the 2-by-4 grid's tees dark, the tiles stained, out in clusters to the dark and the duct above (a run out at the same place in every bay), a
  dead troffer in its frame, a camera's dome and a smoke head in every bay, a tile hanging by its corner. police.json's ceiling entry: "have":
  true, "tile": [10, 10] (the one agreed edit in COMBAT FOUR's file).

## FOUND ON THE WAY (each fixed before the cut)
1. THE CEILING COULD NOT BE READ AT A TENTH: THE GATE's C3 measured the first grid at 25 steps of tone and 2% lines (60 and 10% needed): pale
   tees on pale tiles. The tees are dark and wider now, more tiles out: 89 steps, 30% lines.
2. THE FLOOR'S JOINS: a two-tone of squares drawn in the plan stepped A3 at the tiles' joins (8.0 against 7.6): each square's shade is the
   ground's own now (panel_var), and A3 reads 5.7 against 7.2.
3. HIS 'COVER YOU COULD NOT SEE': seven pieces painted 2.3 to 7.4% of their house tile (the bunk, chairs, cones, barrier, boxes, files,
   desks); two passes made each a fuller cluster: 7.8% (the cones) to 10.5% now; the cells 62%, the evidence cage 51%, the cages 48%.

## PROOF (rule 441: on the real surface, a phone both ways)
tools/bohemia_a_big_inside_on_the_page_11_17_26.js (now taking 'police', district 'policestation'):
- BEFORE (main a32d636c7): the_squad_room upright: THE POLICE STATION, 198 pieces, 198 of them stand-ins, the ceiling drawn by the page
  ('grid'), 0 page errors; the_sally_port 175, 175 stand-ins.
- NOW: the_squad_room 198 pieces, 0 stand-ins, the ceiling's picture drawn, 0 page errors, upright and on its side; the_sally_port 175, 0
  stand-ins, both ways, 0 page errors. No police file lost.
Gate THE INSIDES WEAR FINISHED ART 133/0 with nineteen kits (A3 floor worst 5.7 against 7.2, port 4.0 against 6.0; A4 the cells, lockers,
evidence cage, glass and cages a tile long; A5 572,348 bytes of 900,000; C3 89 steps, 30% lines).

## FOR COMBAT FIVE (COMBAT FOUR's files; nothing of yours edited but the ceiling entry's two words)
THE SALLY PORT WEARS THE SQUAD ROOM'S VINYL until the_sally_port names a floor area: 'floor_areas': { "the_sally_port": [{ "kind": "port",
"x": [0, 19], "y": [0, 14] }] }, and floor.port (the oil-stained concrete, rows 3 and 4) is laid with no other change.

## REFERENCE CHECK (compared to the world before calling it done)
The valley's area command stations: a public lobby behind bullet-resistant glass with a pass-through tray, a squad room of steel desks on
vinyl tile under a lay-in ceiling, holding cells of block and bars with a stainless bunk and toilet, banks of officers' lockers, an evidence
cage of welded mesh, a sally port with roll-up doors at each end, property cages, black-and-white Interceptors with light bars, orange
water-filled barriers. The twins: this lane's truck stop kit (the same rig and cut, the bay's concrete).

[analog horror: a phone off its hook on a desk in a station nobody answers; one cell's door standing open and the others locked with nobody in
them; a camera's dome over every bay of the ceiling]
[bb Battle Brothers' palisade you see through: the bars and the evidence mesh, a wall for the feet and not for the eyes; its wall: the lockers]

## THE TOOLS
tools/bohemia_cook7_the_police_station_finished_11_27_26.py   render pd_floor | pd_pieces | pd_port | ceil_police; cut; sheet; plan (ON the
truck stop tool).

## NOT DONE, SAID PLAINLY
1. The sally port wears the squad room's vinyl until COMBAT FIVE names its floor area (above).
2. The cones are 7.8% of a tile (a cluster of cones is still small things).
3. No night versions.

VOTE: cook7-the-police-station-11-27 (MADE FROM arena2-the-pit-is-a-pit-11-7).
