# COOK FOUR [the place sits in the map], round 19 (10/19): THE MOB'S FORTRESS ON THE STRIP'S OWN GROUND (ground two)

Opened by the coordinator (rule 112), Opus 5.5 at Extra (rule 116). One asset (rule 101d): the picture of ONE place on
ONE ground. A PLACEHOLDER (rule 101): candidate only, nothing in slices/, engine/ or the demo (rule 100).

## The row
PAOLO 10/10: 'the settlements all look like dogshit and not organic with the map' (rule 86). END STATE: 'the
settlement picture's edges meet the map's ground it stands on (the desert wash, the suburb grid, the strip's
spine): the same dirt, the same road running in and out, no slab, no frame; a sheet per ground; RUN draws the join
at the near stop.' Round 14 was ground one (Church, the suburb grid). This is ground two, THE STRIP'S SPINE, on the
place that stands there: the MOB.

## What the map holds there (read, not guessed)
`node tools/bohemia_cook4_the_place_sits_in_the_map_read.js Mob` opens the committed demo the way a player does and
finds the Mob in the map's own list (ctBases): a FORTRESS on the resort block 41,29, two blocks off the Strip's
boulevard; it saves the fine grid of the 25 blocks round it and the near stop as his glass shows it
(reference/art_pipe/cook4/place_in_the_map/COOK4_PLACE_MOB.json, _NEAR.webp).
- The resort block: yards in a grey-tan (plan #8a8478, greyer than the suburb's #8a7a5e), parking in dark asphalt.
- The Strip's boulevard two blocks east (asphalt #33333c, walks #8a8a92); the arterial to the north; the suburb and the
  library to the west. At the near stop the Strip is towers and sign gates.
- On his glass: dirt (142,134,122) drawn on 0.2% of the glass (the resort yards are mostly built over), asphalt
  (46,46,54) on 6.2%, walk (124,124,131) on 1.4%; the forecourt's plan colour under the light reads as the dirt.

## What was wrong, measured
The picture the Mob opens on today is this lane's own round-3 pack fortress (slices/settlement_ground_packs/fortress_0.webp,
a placeholder, never edited): his cracked concrete in its own colour and a palisade, nothing of the Strip. Its ground is
12.0 off the map's dirt in Lab; it has no road and no walk; DIRECTION's floor bar passes it 3 of the 5 it can measure
(saturation 0.30, hue 31.4: too orange, too strong).

## How Battle Brothers does it (rule 41)
A town screen's backdrop is the terrain its world tile has, and a big place reads big by its buildings: a hamlet of huts,
a town of halls, a city behind walls with a keep. OURS: the Strip's ground and road, and the Strip's own buildings that
the Strip's row made this session as the fortress; the tower casino is the keep.

## The picture (5280 x 2880, 92 m across, 72 m of ground; 57 px a metre across, 40 a metre deep)
- THE SAME DIRT: his yard soil (2. Soil and dirt tiles #0, #18 in patches) cut to meet itself and laid to every edge, then
  toned to the map by BRIGHTNESS, not by channel: each pixel is the map's colour times its own brightness over his
  median's (round one's per-channel gain turned his light grains blue this far from his orange: the floor bar then read
  only 122 dirt cells). Every grain and crack of his kept, his contrast at 0.8 (1.0 and 0.9 fail the grit, B4, 16 and
  15.7 against the bar's 15.5). Laid (142,135,122), 0.5 off the map.
- THE SAME ROAD: COOK TWO's cells (his asphalt, his sidewalk slabs, his slab's own south face as the kerb), his worn double
  yellow; balanced to the map's asphalt and walk; the kerb's lit lip is the walk's own lightest pixels (no colour by
  number). It leaves the left edge, the right edge and the bottom.
- THE FORTRESS: a line of his concrete barriers (5. Barricades and defenses #13, #14, #15) along the walk's top, his
  sandbags (3. #0, #19) and razor wire (3. #18) in it, the gate open in front of the keep's doors.
- THE BUILDINGS, left to right, every one this lane's file at 1:1, laid under the scene's one shadow rule (the guide's
  shadow, black at most 42%, nothing black inside), the files untouched: the round-7 motel cut by the left edge; the motel
  sign tower (round 18) at the road end, its arrow pointing away; the wedding chapel (round 17); the pawn shop (round 16)
  and its empty queue; the tower casino (round 15), the keep; the round-8 gas station cut by the right edge. Behind them
  the Strip goes on as the map's resort blocks are built up: the round-12 casino and the round-5 corner shop one row back,
  the round-9 warehouse a row behind that.
- NO SLAB, NO FRAME: the frame cuts the motel and the gas station; the road runs through both sides and the bottom.
- THE TOWN, ITS FIVE TAPS (the screen's fortress schema, in COOK4_FORTRESS_MOB_ON_THE_STRIP.json): BARBER = the tower
  [3096,15,4878,2280]; STALL = the pawn shop [2066,1743,3022,2487]; CLINIC = the chapel [1059,1739,1992,2383];
  POSTS = the barriers either side of the gate [3756,2472,4220,2526]; BOARD = his chalk easel inside the gate
  [4160,2283,4235,2376].
- ONE WRONG THING: each building keeps its own (the tower's top floor whole, the empty queue, the living flowers, the
  arrow pointing away); the place adds none.

## The numbers (records/target/COOK4_THE_PLACE_SITS_IN_THE_MAP_THE_STRIP.json; palette COOK4_THE_MAP_GROUND_THE_STRIP.json)
| what | the map on his glass | before (the Mob today) | after |
|---|---|---|---|
| dirt | (142,134,122) | 12.0 off | laid (142,135,122), reads 0.7 off |
| asphalt | (46,46,54) | none | 0.9 off |
| walk | (124,124,131) | none | 0.8 off |
| forecourt | reads as the dirt | none | 0.7 off |
- NO SLAB: the dirt in the edge bands is 0.7 off the map at the left, right and top, the same as the inside (0.7); the
  road runs through the left, right and bottom.
- HIS YES STREET'S BAR (DIRECTION's B1 to B6): 6 of 6 (19,660 dirt cells, saturation 0.141, hue 38.0, split 4.6, grit
  14.72, the road's self-match 0.214, 0.08% orange).
- The cell check (D2 and D5 on every 96 px cell): the ground 0 red. On the whole picture 1 red: the cell at 1632,1920
  (D5, evenness 0.037 past the packs' 0.039), inside a laid file, not the ground.
- The dirt's laid joints: rows 1.21, columns 1.15 of the inside's step; seams 1.0 and 1.68.

## Weak, said
- 92 m across: 4.5 phone-widths at 1:1; RUN TWO shows it at one picture pixel to one device pixel and pans, when he says so.
- The ground is an even grey-tan: the map's resort yards are one colour, so the picture is too; it reads flatter than
  the suburb's yards (no paths worn from doors yet, no parking bays painted).
- No night picture; no lamps (rule 114: his lamp at 1:1 is 1.7 m); the round-12 casino, the corner shop and the
  warehouse are first-pass files beside the Strip row's second-pass ones.
- The boulevard is two blocks east on the map; the picture puts a Strip road at the Mob's door, as the map's own block
  edge is a street.

## Gates (rule 13, by name)
ART PIPE A2: this tool writes no literal pixel (the sheet's swatches are pasted colour). REFERENCE CHECK, REUSE-FIRST:
the tool carries both blocks. Cell check above. VOTE TAB, N3 and the art fence in the ship line. Full suite unmeasured.

## Lead line for DIRECTION (rule 113a)
COOK FOUR made the Mob's fortress on the Strip's own ground, VOTE tab, COOKING.

## [bb research]
In Battle Brothers a city reads as a city from its screen alone: walls, a keep, more buildings than a town. The Mob's
picture is the first of ours with a keep (the tower) and walls (the barrier line), on the ground its map tile has.

## Next
Round three of this row: the desert wash (a camp out in the region: Goodsprings or Jean).
