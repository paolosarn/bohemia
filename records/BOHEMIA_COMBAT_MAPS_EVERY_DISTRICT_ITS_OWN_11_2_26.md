# COMBAT MAPS [every district its own] 11/2/26 (rule 325, ask line 323; BUILD 11/3zs - EVERY PART OF TOWN FIGHTS)

Paolo 11/2, playing and loving it: "we need way more combat maps, way more... we do need more good looking combat stuff going
on, because the only thing you have is like this desert yellow brown suburbia thing, and it's serving, it's perfect, I
appreciate it, but..."

## MEASURED BEFORE (230 fights the game starts, tools/bohemia_combat_maps_every_district_probe_11_2_26.js)
The probe starts fights headless in the LIVE fight (slices/BOHEMIA_FIGHT.html's own deal) with the options THE GAME hands it
(the alpha's own nfKind and nfOpts, read out of slices/BOHEMIA_ALPHA_0_9.html): every one of WORLD's 78 districts
(records/target/BOHEMIA_BOARD_KINDS.json) by day and night (156), the region's 34 real places past the valley
(engine/BOHEMIA_REGION_LAND.json, each handed the district that stands on its ground) by day and night (68), the act-one
bosses' own boards by day and night (6). It logs the block kinds of every board. SUBURB = the tract blocks (subs, suburb_stem,
corner, cornerw, culdesac, lots). Raw rows: records/target/combat_maps_11_2b/probe_before.json and probe_after.json.

| | before | after |
|---|---|---|
| fights started | 230 | 230 |
| deals that threw | 0 | 0 |
| distinct block kinds ever dealt | 14 | 23 |
| share of all dealt blocks that are the suburb | 35.7% | 12.5% |
| boards mostly suburb (half their blocks or more) | 94 (40.9%) | 28 (12.2%), every one a real suburb (suburb, town, school, chapel, library, estate, gated, Pahrump) |
| the city's 156 fights: suburb share of their blocks | 38.4% | 14.3% |
| the region's 68 fights: suburb share | 32.4% | 8.8% |
| the most dealt block | lots.0 (the vacant suburb lot), 418 of 2,760 | works.0, 327 |

## WHY HE SAW ONLY THE SUBURB (three causes, all measured)
1. THE MAP NEVER HANDED THE FIGHT ITS DISTRICT. The alpha's door (nfOpts) handed only a kind from nfKind (strip, freeway, shore,
   landfill, wash, scrub, culdesac, suburb_stem, suburb, else ruin), never the district or the cell. 24 districts (the airport,
   every civic building, the plants, the stadium...) fell to 'ruin'. So rule 46a's seeded deal, WORLD's district list and
   FACTIONS' who-holds-this-ground were all dead code in the game.
2. A KIND LED ONE SLOT OF TWELVE. The deal put the asked kind in the bottom-left slot only and filled the other eleven from its
   whole family; the city family is eleven kinds and six of them are the tract (subs, suburb_stem, corner, cornerw, lots,
   culdesac). And the board shapes (last round) turn up to four slots of every city board into the vacant suburb lot: lots.0
   was the most dealt block in the valley.
3. THREE BLOCKS WERE NEVER DEALT AT ALL: the casino (the only interior in the game), the overpass and the desert road were in
   no family (the three blocks gate had it measured as the never-at-all list).
And there was no block for the mountain, the canyon, a trailer park, a golf course, the lake or the airport: those places
dealt sand, water and suburb (the mountain: scrub 7, shore 4; the airport: corner 5, lots 3, ruin 3).

## WHAT SHIPPED
1. THE MAP HANDS THE DISTRICT (slices/BOHEMIA_ALPHA_0_9.html nfOpts, __EVERY_PART_OF_TOWN_FIGHTS__): the district and its map
   cell go over with the kind. The fight then seeds the deal by the cell (rule 46a: a place deals its own board every time it
   is fought), fits the cover to the ground's measured envelope (WORLD's GROUND_EFFECTS), and FACTIONS' road weights read
   the ground (their 11/3 code was written for this and never got a district).
2. EVERY PLACE DEALS ITS OWN KINDS (slices/BOHEMIA_FIGHT.html placeKinds/dealPlace; the list is data, records/target/bb/ours.json
   'board_grounds'): a district's own row, else its ground's row; the first kind leads half the slots (lead_share 0.5, TUNING's);
   only a town's grounds (the suburb, the big-box lots) are cut into last round's shapes; the new kinds are dealt mirrored too;
   a boss keeps his own board; the bar names the place's own blocks. The alpha's restart door is still answered.
3. SIX NEW BLOCK KINDS, each with its raided and reclaimed future (18 pictures, slices/fight_ground/block_<kind>_0*.webp),
   rendered through the same rig as every fight block (tools/bohemia_combat_maps_new_blocks_through_the_rig_11_2_26.py: the
   floor tool's ground and render, the not-final tool's junk and grime, the rig's camera, sun and film, 42.92 px a metre):
   | kind | the place | its tiles (rows north to south) | dealt by |
   |---|---|---|---|
   | pass | THE PASS ROAD: two lanes on a shelf, the cut face, scree, a box truck off the shoulder (hazards on in daylight), jerseys | rr.rr ##Hrd ..... r#rHr rrdrr | mountain, desert, the hills (Boulder City, Gass Peak), the dam |
   | canyon | RED ROCK: Aztec sandstone fins, the sandy wash, slickrock to climb, one old handprint | r.rr. ##r#H .r..r H#.## r.r.r | springs, gypsum, the mountain, the open desert |
   | trailer | THE TRAILER PARK: four single-wides on gravel pads, a patched lane, a carport roof to climb, a porch light on at noon | ..... ##r## ..... ##H## ..... | the trailer park and the region's six (Goodsprings, Nelson, Sandy Valley, Blue Diamond, Moapa, Overton) |
   | golf | THE GOLF COURSE GONE TO DUST: a dead fairway, a bunker, a dry pond, dead palms with their brown skirts, a cart path, the comfort station, a raised tee, one green still green | ...r. .d..H ..... r.#.r ..r.. | golf, park, campus, ballpark, waterpark, farm; Lake Las Vegas, Corn Creek, Tule Springs, Mt Charleston |
   | marina | THE DRY MARINA: the launch lot, the store, the docks resting on the cracked bed, a houseboat and a cruiser stranded, the ramp into nothing, one boat still tied | ..... #.HH. ..... d#d#d ..... | water, reservoir, intake, dam; Boulder Beach, Las Vegas Bay, the Intake |
   | apron | THE AIRPORT APRON: the slabs and their lines, a regional jet on its belly (cabin lights on), a tug and carts, the air-stairs truck to climb, a fuel truck | ..... ###.. ..... .#.H# ..... | airport, airbase, terminal; Creech |
   The tiles are written FIRST and the picture is built from them, so the drawing and the tiles agree: every '#' (blocked) and
   'H' (height: a ledge, a dock, a carport roof, the air-stairs) has its mass on it; the ground's colour patches wander off the
   square so no tile reads as a pasted square. Cover is the fight's own pieces (jersey, rocks, rubble, dumpster, trailer,
   fence, shed, dead cars). Floor costs and effects: the terrain key's Battle Brothers rows (flat 2 AP, rough 3, debris 3,
   height +1 level), as every block.
4. THE GATES THAT MEASURED THE OLD ROUTE learn the new one: gates/three_blocks_gate.js counts the district deal's lists as
   reach and its casino check flips to REACHED (engine/bohemia_threeblocks.js's unreachable lists are empty now). The sounds'
   floor table (tools/bohemia_sounds_fight_floors.py) re-derived for the new pictures. A pack manifest
   (slices/fight_ground/combat_maps_11_2.json) names the 18 new pictures and why no pack tile is in them (rule 123: the rig).

## MEASURED AFTER
The table above (the same 230 fights, the same seeds). Per place, by day (before | after):
- the airport: corner 5, lots 3, ruin 3, works 1 | apron 8, scrubroad 4
- the casino: strip 6, lots 4, main 2 | strip 7, casino 5
- the mountain: scrub 7, shore 4, wash 1 | pass 8, scrub 4
- the trailer park: culdesac 5, corner 4, lots 3 | trailer 7, lots 5
- the golf course: scrub 5, shore 4, landfill 3 | golf 7, wash 3, scrub 2
- the lake (water): scrub 6, shore 4, landfill 2 | marina 6, shore 4, wash 2
- downtown: strip 4, lots 3, ruin 3, works 2 | main 8, ruin 4
- Goodsprings: lots 8, culdesac 4 | scrub 6, trailer 6
- Boulder Beach: landfill 8, shore 4 | marina 7, wash 5
- Creech: ruin 7, lots 3, works 2 | apron 10, scrubroad 2
- Gass Peak: shore 4, wash 4, scrub 4 | pass 9, scrub 3
- the bosses: unchanged (their own boards).
- 112 boards on the new ground (the six named boards day and night, ten districts that lead with a new kind, ten cells each):
  every one lets the two lines reach each other; 16 of them played to the end on AUTO, nothing threw, 5.8 rounds a fight
  (last round's boards 5.0 to 6.5).
- No purple: 0 pixels of the six new pictures in the purple band.

## THE GATES THIS TOUCHES
fight steps 34/0; the aftermath 20/0; three blocks 21/1 (the one red, cornerw, is older than this round); every floor tile 18/1
(the roof line's red is main's own: the same red on origin/main's fight file before this round, from the climbing change);
vote tab: no red names this entry (the reds are other lanes' whys and the alpha's landing legs); pack gate and pixel floor:
no red names a new file (the manifest covers the 18 pictures; the sheet's folder has its kind). Re-measured on the rebased
code: the same 14 -> 23 kinds, 35.7% -> 12.5% suburb.

## THE SHEET
records/target/combat_maps_11_2b/COMBAT_MAPS_EVERY_DISTRICT_SHEET_11_2.webp: every new block on his upright phone (390 x 844),
in the live fight, by day and by night, its own board and the district deal that leads with it
(tools/bohemia_combat_maps_the_sheet_11_2_26.js). In the VOTE tab: combat-maps-every-district-11-2.

## WHAT IS LEFT
- One block a kind: the twin rule cannot keep a block from its twin (the mirror helps). A second block of each (pass.1 the
  hairpin, canyon.1 the slot, trailer.1 the laundry and the office, golf.1 the clubhouse, marina.1 the boat yard, apron.1 the
  hangar) is next round's.
- Still no block: Fremont under the canopy, the Strip's pool deck, a lab yard (the beasts came from labs), a solar field, a
  stadium's seats. Downtown deals main street and the ruin until Fremont is made.
- THE LAYERS: the new blocks' tall things (the trailers, the jet, the rock fins) are not yet in fight_stands.json, so a man north
  of a trailer is drawn over it; COMBAT 2 holds that file this round.
- WORLD's region data gives Red Rock, the Valley of Fire and Echo Bay the 'lot_and_bigbox' ground and Creech 'airport': the
  canyon and the marina wait on WORLD giving those places the hills and the shore ground.
- The three blocks gate's one red (a family names 'cornerw' and no cornerw block was ever drawn) is older than this round.

[bb] Battle Brothers cuts every tactical map from the ground the party stands on (a forest, a swamp, steppe, a settlement's
streets), so where you fight IS the fight; here the map hands the district and the district deals its own blocks.
[analog horror] each new place has one thing wrong that nothing remarks on: the truck's hazards blinking in daylight, the
porch light on at noon, the one green still green on a dead course, a boat still tied to a dock with no water, a dead jet with
its cabin lights on, a handprint on the rock older than the valley.
