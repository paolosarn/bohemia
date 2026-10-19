# COOK FOUR [the place sits in the map], round 20 (10/19): GOODSPRINGS, A CAMP ON THE DESERT'S OWN GROUND (ground three)

Opened by the coordinator (rule 112), Opus 5.5 at Extra (rule 116). One asset (rule 101d): the picture of ONE place on
ONE ground. A PLACEHOLDER (rule 101): candidate only, nothing in slices/, engine/ or the demo (rule 100).

## The row
PAOLO 10/10: 'the settlements all look like dogshit and not organic with the map' (rule 86). END STATE: 'the
settlement picture's edges meet the map's ground it stands on (the desert wash, the suburb grid, the strip's
spine): the same dirt, the same road running in and out, no slab, no frame; a sheet per ground; RUN draws the join
at the near stop.' Round 14 was the suburb grid (Church), round 19 the Strip's spine (the Mob). This is the third
ground, the open desert past the valley, on a place that stands in it: GOODSPRINGS. With it the row has a sheet per
ground, all three in VOTE.

## What the map holds there (read, not guessed)
`node tools/bohemia_cook4_the_place_sits_in_the_map_read.js Goodsprings`: the reader now finds a place out in the region
too (BOH_REGION.places, WORLD's real land, engine/BOHEMIA_REGION_LAND.json), since the region has no fine grid (cellAt is
the valley's). GOODSPRINGS is a CAMP on a trailer-park block (109,135) in the Goodsprings Valley, 41 km from the Strip:
'the Pioneer Saloon, 1913; a lead and zinc camp that never quite died'.
- The region's own blocks round it (11 x 11, in the numbers): open desert to the south, hills to the north, a state route
  (NV-161, class 2) through the camp east to west and on to the south-west, a dirt track (class 3) north into the hills.
- On his glass at the near stop (reference/art_pipe/cook4/place_in_the_map/COOK4_PLACE_GOODSPRINGS_NEAR.webp), read by
  clusters (the phone, the gear, the place's token and the pad left out): the desert tan (137,119,85) on 89% of the
  ground (the painter's gentle light across it), a pale (167,150,115) on 6% and a dark (92,81,62) on 5% (its flat
  diamonds), the road (52,50,47), a warm dark, and the road's pale casing (162,153,132).

## What was wrong, measured
The picture a camp opens on today is this lane's round-3 pack camp (slices/settlement_ground_packs/camp_0.webp, a
placeholder, never edited): his soil as bought, orange, 15.2 off the map's desert in Lab; tents round a fire on a bare
field; no road. DIRECTION's floor bar passes it 1 of the 5 it can measure (saturation 0.531, hue 26.5: orange and strong).

## How Battle Brothers does it (rule 41)
A town screen's backdrop is the terrain its world tile has (steppe, desert, snow), so the place you enter is the place you
saw; a small place reads small: a few huts and a fire. OURS: the region's desert and its road, the camp a trailer-park
town gone to tents.

## The picture (4224 x 1728, 74 m across, 43 m of ground; 57 px a metre across, 40 a metre deep)
- THE SAME DIRT: his yard soil (#0, #18 in patches) cut to meet itself, laid to every edge and toned to the map's desert by
  brightness (round two's way), his grain whole (contrast 1.0): 0.0 off the map. His sand only where feet and wheels wore
  it (the track, round the fire, the store's front), a shade over the dirt (round one's worn paths), and his darker soil in
  the track's two wheel ruts 1.6 m apart.
- THE MAP'S PALE AND DARK, MEASURED AND LEFT OUT: laid as patches at the map's own shares (6 and 5 percent) they read as a
  camouflage print: DIRECTION's B3 at 23 to 27 against the bar's 9, the first run. The map draws them as its painter's
  flat diamonds; on the ground they were blobs. The dirt is one tone.
- THE SAME ROAD: COOK TWO's asphalt cells balanced to the map's warm asphalt (0.8 off), his worn double yellow, no kerb
  and no walk (a state route in the desert); the shoulder his sand in the map's road casing (0.2 off), its top edge
  wandering and its foot drifted over the asphalt's edge. It runs off the left, the right and the bottom.
- THE TRACK NORTH: 3 m of worn ground in a slow bend from the shoulder out of the top edge, as the map's dirt track runs.
- THE CAMP, its five taps (the screen's camp schema, COOK4_CAMP_GOODSPRINGS_ON_THE_DESERT.json): STALL = the round-5 corner
  shop as the general store [1364,589,2018,1160]; POSTS = his post and rail three long in front of it, the hitching rail
  [1320,1224,1598,1296]; BOARD = his chalk easel by its door [1992,1115,2067,1208]; BARBER = the pass-two porch ranch
  [2764,681,3565,1080]; CLINIC = the pass-two plain ranch [334,621,1250,1025]. The pass-two wing and garage ranches cut by
  the frame at the back. His tents (14. Camp and tents #2, #3) in a ring round one fire ring (#15) where the trailers stood,
  his stool and sack by it.
- THE DESERT: his dry brush (16. Dead trees and plants, not #38, which carries its own square of dark ground) in clumps a
  patch noise places, his stones more toward the hills at the top, two of his dead trees; never on a building, the track,
  the trodden ground or the road.
- ONE WRONG THING: his drying rack (14. #6) by the fire hung with fish, in a camp 60 km from any water.
- One sun from the upper left; every building laid under the guide's shadow (black, at most 42 percent) with nothing black
  inside, the files untouched; every prop on its own silhouette's shadow.

## The numbers (records/target/COOK4_THE_PLACE_SITS_IN_THE_MAP_THE_DESERT.json; palette COOK4_THE_MAP_GROUND_THE_DESERT.json)
| what | the map on his glass | before (a camp today) | after |
|---|---|---|---|
| desert | (137,119,85) | (orange) 15.2 off | 0.0 off |
| asphalt | (52,50,47) | none | 0.8 off |
| shoulder | (162,153,132), the road's casing | none | 0.2 off |
- NO SLAB: the dirt in the edge bands left, right and top is the same as the inside (in the numbers); the road runs through
  the left, the right and the bottom.
- DIRECTION'S FLOOR BAR (his YES street as six numbers): 4 of 6. THE TWO REDS ARE THE MAP'S OWN, MEASURED:
  - B1 THE DIRT IS PALE (at most 0.28): 0.355. The region painter's desert is 0.374 on his glass; the map's own ground on
    the same bar fails B1 the same way. Kept so the picture meets the map.
  - B3 NO CAMOUFLAGE (at most 9): 18.4. The second tone is the shoulder in the map's own road casing (32 brighter than the
    desert); the land alone, the shoulder and the road cut off, reads 5.9 and passes; the map's own ground reads 13.5.
  So the bar and the map disagree out in the region, and it is the map's colours that would move (FOR DIRECTION and
  RUN/WORLD: the region painter's desert at 0.374 saturation sits between his YES street's 0.195 and the fight floor he hates,
  0.40 to 0.61; its casing is a second tone 32 brighter). Not changed here: this lane meets the map; the map is not mine.
- The cell check (D2 and D5 on every 96 px cell): the ground 0 red; the whole picture 0 red.

## Weak, said
- The camp's tents are his 1.5 m tents at 1:1 (small, two-man); the store is the round-5 corner shop with its slate roof,
  beside the pass-two ranches' tan roofs.
- No trailers (the packs hold none at 1:1: his cars are 96 px, 1.7 m, toys at this scale; rule 114).
- No night picture; the desert has no wash in the picture because the map draws none at Goodsprings (the row's 'desert
  wash' read as the region's open desert); a camp by a real wash (the map's '~'/'s' blocks) would take the same tool.
- 74 m across: RUN TWO shows it at one picture pixel to one device pixel and pans, when he says so.

## Gates (rule 13, by name)
ART PIPE A2: this tool writes no literal pixel (the sheet's swatches pasted colour, the masks numpy). REFERENCE CHECK and
REUSE-FIRST: the tool carries both blocks. Cell check above. VOTE TAB, N3 and the art fence in the ship line. Full suite
unmeasured.

## Lead line for DIRECTION (rule 113a)
COOK FOUR made Goodsprings on the desert's own ground, the row's third and last ground, VOTE tab, COOKING. FOR DIRECTION:
the region's desert fails your floor bar's B1 and B3 on the map itself (0.374, 13.5).

## [bb research]
Battle Brothers' smallest places, a few huts round a fire on the world map's own terrain, read as small at a glance; a
camp out here is the same: a store, two houses, tents round one fire, and the desert going on past the frame.

## Next
The row's three grounds are all in VOTE: his word. RUN draws the join at the near stop when he says so.
