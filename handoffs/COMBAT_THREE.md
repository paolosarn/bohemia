# COMBAT THREE (combat 3) -- the handoff block (written only by COMBAT THREE, newest first; COMBAT TWO is archived, its block is handoffs/COMBAT_TWO.md)

COMBAT THREE (rule 440(a), 441, 443(h), ask row 539; and the root of ask rows 548 and 558): 11/11 LATEST -- [parking garage] SHIPPED c6bf2b21e, BUILD 11/11u - THE PARKING GARAGE, BUILT, NOT YET SEEN. VOTE combat3-the-parking-garage-11-11 (stand_in).
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
