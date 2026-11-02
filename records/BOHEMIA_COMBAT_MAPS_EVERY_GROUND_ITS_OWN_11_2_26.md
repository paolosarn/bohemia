# COMBAT MAPS 2 [every ground its own] 11/2/26 (rule 336, ask line 337; BUILD 11/3zx - EVERY GROUND ITS OWN)

Paolo 11/2, voting last round's six new fight maps NO: "They all collectively need more love. It's still this yellow brown sand
dirt as the main ground, not enough unique shit going on. Definitely a work in progress for all of them."

## WHAT WAS WRONG (measured)
Every fight block in the game (41 pictures, three futures each) was drawn on the same few grounds of the floor tool
(caliche, desert, rough, track, playa: all one palette step of clay_bone), so the Strip, the suburb, the wash, the pass and
the airport all stood on the same yellow-brown sand. Measured with one colour family (the old sand as he sees it lit: hue
22..52, saturation 0.09..0.36, value 120..225): 68.9% of the average block's picture was that sand; on his phone, the 15
places' fights were 49.6% that sand on average (the HUD included).

## WHAT SHIPPED
1. THIRTY GROUNDS THROUGH THE RIG (tools/bohemia_combat_maps_every_ground_its_own_11_2_26.py --plates). Twenty-seven new ground
   materials written in the floor tool's own material language (tools/bohemia_cook_the_floor_through_the_rig_10_19_26.py MATS:
   a palette role and step, grit, speck, joints, cracks, mud cracks, oil, worn paint) with their own scatter (its STONES), each
   BUILT as a field by the floor tool's build() (grid, heights, stones), passed through the master rig (source pass, dents, one
   sun, film) and shot by the block camera (orthographic, tilted 45, 42.92 px a metre), crossfaded seamless (a 30 m plate, each
   block its own cut), then brought to its target colour (the rig's dust pulls every ground toward the same pale tan; a gain
   holds each one on its own). The grounds: dead lawn (two, for the mower's stripes), marble, pool deck tile, oil-stained
   slab, ballast, ties, rail, gravel, cobble, silt, cracked mud, the bathtub ring's crust, desert pavement, caliche crust,
   limestone scree, red sand, slickrock, landfill cover soil, bunker sand, dead fairway (two), apron slab, tie-down steel, brick
   rubble, sealed epoxy, hazard yellow; and the floor's own asphalt, paint and concrete. 30 plates, 32 to 97 s each at 12
   samples (records/target/combat_maps_11_2c/plates.json).
2. EVERY BLOCK ITS PLACE'S PLAN (--lay). Per block, a ground per pixel written from the block's own tiles, houses, roads and water:
   | place (blocks) | its ground now |
   |---|---|
   | the Strip (strip.0/1) | the lots taken up: cracked marble at the doors, the pool deck's tile to the south, a teal inlay band; the drive stays asphalt |
   | downtown (main.0/1) | asphalt lots with painted stalls, walks at the shopfronts, the canopy's lattice shadow over the street |
   | downtown's ruin (ruin.0/1) | broken asphalt and stalls, brick rubble exactly on the 'debris' tiles |
   | the works (works.0) | the slab black with oil, 4.5 m joints, gravel along the fence, a rail spur on ties and ballast |
   | the lab yard (lab.0, NEW) | sealed epoxy, hazard hatching at both docks, a decon pad with its drains, a beast's prints walking out |
   | the suburbs (subs, corner, culdesac, suburb_stem, lots) | dead lawn yard by yard, gravel lot lines, a patio slab behind each house, driveways where a garage reaches the street, the yard's dirt only where a lawn gave out; the vacant lot's slabs |
   | the wash (wash.0/1) | the bed end to end: cobbles on the rough tiles, smooth silt on the flat ones |
   | the shore (shore.0/1) | cracked mud from the water to the white bathtub ring, silt, the pavement past it |
   | the desert (scrub, scrubroad, freeway, freewayo) | varnished desert pavement, caliche showing through in flecks, the sand kept only in each creosote's coppice mound (soft, 0.55 m), gravel shoulders on the roads |
   | the pass (pass.0) | limestone scree (the cut face's rocks now grey limestone), gravel shoulders |
   | Red Rock (canyon.0) | red sand and cross-bedded red slickrock sheets on the rough and ledge tiles |
   | the trailer park (trailer.0) | grey gravel lots and pads |
   | the golf course (golf.0) | the dead fairway in 4 m mowing stripes, a white bunker on its debris tile, the green still green |
   | the marina (marina.0) | the lake bed cracked mud, the bathtub ring, silt bars |
   | the airport (apron.0) | the apron's 6 m slabs, a tie-down ring in each, oil where aircraft stood |
   | the landfill (landfill.0/1) | grey cover soil with trash working up through it, a gravel haul road |
   | the casino (casino.0-2) | unchanged: its carpet is its own (the pictures are not re-encoded) |
3. LAID UNDER THE OLD PICTURE'S OWN LIGHT. The plate replaces the old sand only on the ground (the houses, shops and masses masked
   by the rig's own ledgers: records/target/cook_floor_rig/blocks.json houses, slices/fight_ground/fight_stands.json outlines, the
   ruin's and the apron's '#'/'H' tiles, the pass's truck and the golf course's two buildings); there the old pixel's light stays
   (its shadows, grime, soot: the old pixel over the old ground's local light, smoothed past the sand's own one-pixel grain, each
   family its own), so the houses still throw their shadow on the new lawn and the grime still crosses every edge. Everything
   not sand is the old pixel: houses, roads, cars, junk, rocks, shrubs, water, the futures' solar racks and scorch. Raided and
   reclaimed take the same plan.
4. NO CAMOUFLAGE (his 10/19 NO, COOK TWO): the first lay put desert pavement and caliche, and cobble and silt, down as noise
   blobs; that is the two-soil field he killed. Rewritten: one main ground a place, the second ground only as a real shape
   (a band, a slab, a lot line, a tile's silt, a fleck of crust).
5. THE LAB YARD (rule 325 named it; no block existed): lab.0 is its own ground on the works' sheds (the same tiles, cover, lamps,
   roofs and layers as works.0; its own buildings are next round's). Named board 'lab', its futures, its layers
   (fight_stands.json), its roof storeys (ours.roof_storeys). The medical district deals it first (ours.board_grounds:
   medical -> lab, ruin, main).
6. THE PLACES DEAL THEIR OWN: the wash district deals the wash first (wash, scrub, shore) and the basin too; the reservoir deals
   the shore first (shore, marina, wash); before, all three dealt the marina first.
7. THE TILE DATA STAYS TRUE: every new ground is floor (no new mass anywhere), and each second ground sits where the tiles
   already said so: the wash's silt on its flat tiles and cobbles on its rough ones, the ruin's rubble on its debris tiles, the
   golf course's bunker on its debris tile, Red Rock's slickrock on its rough and ledge tiles, the rail spur on a flat row.
   No terrain code changed. The sounds' floor table re-derived from the new pictures (downtown's lots ring asphalt now):
   tools/bohemia_sounds_fight_floors.py --check passes, 42 blocks.

## MEASURED (the same colour family, before and after)
- The 39 laid blocks: 68.9% -> 23.2% of the picture old sand (present); raided 63.6% -> 21.7%; reclaimed 63.1% -> 17.8%. What is
  left is mostly the tract houses' and shops' tan roofs and walls (not ground), the coppice mounds and the yards' dirt.
- His phone (390 x 844, the live fight, by day, each place started from the map with its district and cell; the HUD included):
  | place | before | after |
  |---|---|---|
  | the Strip | 23.0% | 12.8% |
  | downtown | 49.6% | 28.0% |
  | the works | 52.5% | 25.8% |
  | the suburbs | 51.5% | 21.6% |
  | the wash | 65.3% | 19.9% |
  | the shore | 49.6% | 8.4% |
  | the desert pass | 50.5% | 7.9% |
  | the desert | 58.2% | 15.3% |
  | Red Rock | 54.5% | 8.9% |
  | the trailer park | 46.6% | 11.7% |
  | the golf course | 62.1% | 19.2% |
  | the marina | 45.2% | 5.9% |
  | the lab yard | 53.0% | 28.9% |
  | the airport | 22.4% | 12.1% |
  | the landfill | 60.5% | 9.6% |
  | MEAN | 49.6% | 15.7% |
- Purple: 0 pixels on all 15 after shots (gates/ui_pixel_purple.py).

## THE SHEET AND THE CARDS (the VOTE tab)
records/target/combat_maps_11_2c/COMBAT_MAPS_EVERY_GROUND_SHEET_11_2.webp: the 15 places on his phone, after, each with its
before -> after share. One card a place (before | after side by side): records/target/combat_maps_11_2c/ground_<district>.webp.
Shots by tools/bohemia_combat_maps_every_ground_sheet_11_2_26.js (before shot on the old floors, after on the new); the sheet
and the measure by --sheet (records/target/combat_maps_11_2c/sheet.json). In the VOTE tab: combat-maps-every-ground-11-2 (the
redo of combat-maps-every-district-11-2, the six he voted NO) and combat-ground-<district>-11-2, fifteen cards.

## THE GATES THIS TOUCHES
fight steps 34/0; every floor region connects 11/0; the sounds' floor table CHECK PASS (42 blocks); three blocks 21/1 (cornerw,
older than this round, as last round); every floor tile 18/1 (the roof line's red: the same red stands with this round's
uncommitted work stashed, as last round recorded it on main); pack gate: no red names a file of this round (the manifest
slices/fight_ground/combat_maps_2_11_2.json covers every laid picture; the reds are settlement grounds and older tools);
pixel floor: F2/F3 reds are other folders (this round's folder has its kind, gates/pixel_floor_kinds.json).

## WHAT IS LEFT
- The lab yard stands on the works' sheds: its own buildings (pens, a loading dock, a cold store) are next round's.
- One block a kind still (last round's list): a second block of each new place.
- The tan roofs and walls of the tract houses and shops are the sand family too: that is the buildings' colour, not the ground's;
  the TAN WALL law (85/15) owns it.
- Fremont under the canopy proper (the canopy itself, its lights) is still not a block; downtown carries its shadow.

[bb] Battle Brothers' tactical maps take their ground from the tile the party stands on (steppe, forest, swamp, snow, a
settlement's streets), so the floor alone says where you are; here every block's floor is its place's ground, and the tiles
under it stay Battle Brothers' costs (flat 2 AP, rough 3).
[analog horror] one wrong thing a ground, nothing remarks on it: the one lawn on each suburb block still mown in fresh stripes;
the canopy's lattice shadow on downtown with no canopy over it; the works' rails polished bright; bare footprints walking into
the wash's silt, none walking out; a second bathtub ring far above the first, higher than the lake ever stood; one perfect bare
circle of caliche on the desert; a beast's prints walking out of the lab yard through the gate.
