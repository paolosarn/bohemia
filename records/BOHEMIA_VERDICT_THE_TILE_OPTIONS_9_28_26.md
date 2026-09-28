# THE TILE OPTIONS, JUDGED AGAINST HIS VOTE (DIRECTION, 9/28/26)
# [judge tile options], rule 37a (Paolo 9/27: "I NEED TO SEE WHAT A GOOD TILE LOOKS
# LIKE FIRST"; "this isn't Atari"), CORRECTED 9/28 by his own words: A COMBAT TILE IS
# A HOUSE (records/BOHEMIA_PAOLO_A_COMBAT_TILE_IS_A_HOUSE_I_READ_IT_BACKWARDS_9_28_26.md).
# COOK [tile options] r1 (8b97875), slices/vote/COOK_WHAT_A_GOOD_TILE_LOOKS_LIKE.png.

## 0. MY OWN RULING DIED FIRST, AND IS MARKED
THE CELL IS THE STEP (f739e36) was the unit of the close-grid WALK and the
close-grid FIGHT. His 9/28 correction kills both: the city walk is dead and
the fight tile is a house. The ruling record carries a SUPERSEDED header this
commit; the two-scales card gains 0D; round 16's item 1 ("re-derive on 0.75")
is withdrawn on the front page. COOK's measurement also shows its premise was
thin: his approved street is about ONE METRE a tile off his own sprites
(person 1.14, car 1.03, door 1.02), not the 0.75 its method comment says.

## 1. THE DENSITY NUMBER: PASS, AND IT IS THE BETTER ONE
39 to 43 px per metre, measured off three real-size sprites in the art he
approved, never off a comment. His three kills measured against it: the road
party 5 px/m. Every option on the sheet is at or above his density.

## 2. THE THREE CAMERAS
- A, ACROSS THE STREET: PASS. His 7/28 street untouched; the 45-degree
  lean of the walk; reads as the world he approved.
- B, DOWN AT AN ANGLE WITH ROOFS: THE STRONGEST FOR A FIGHT BOARD, AND
  FAILS AS DRAWN. Roofs matter twice over now: high ground IS A ROOF (37g)
  and a fight tile IS A HOUSE, so the roof is the tile you fight across.
  But: BOTH HIP CORNERS ARE HOLES - 70% and 67% pure black where the roof's
  transparency was flattened onto black (option A, same spot: 0%); and the
  ridge line runs near white (253, above the card's 0.92 value ceiling). Two
  mechanical fixes; then B leads.
- C, STRAIGHT DOWN ROOFLESS: ITS PREMISE DIED WITH THE REVERSAL. It was
  drawn as "the fight's ground indoors" on the close grid; a house is one
  fight tile now and high ground is its roof, which C removes. Keep it only
  where an INSIDE is the place (the Strip, special places), not the board.

## 3. THE FINDING THAT MAKES "NO ATARI" AND "A TILE IS A HOUSE" THE SAME RULE
A house is 12 m. The fight board shows about two houses across the phone:
196 CSS px a house (V226's measure) = 588 device px on a 3x phone =
49 DEVICE PX PER METRE - above his 39-43. SO THE HOUSE-TILE FIGHT CAN SHOW
HIS ART PIXEL FOR PIXEL, ON A PHONE, AT HOUSE SCALE - IF THE CANVAS DRAWS AT
DEVICE RESOLUTION. V224 made the fight canvas 1:1 with CSS (to cure a body-size
lie); at 1:1 CSS every painted pixel shows as a 3x3 block, which is exactly
the Atari look he keeps killing. The fix keeps V224's body-size honesty and
draws the backing store at the device ratio, scaling the drawing to match -
the same rule the map floor already states (records/BOHEMIA_BB_DENSITY_THE_MAP_
FLOOR_9_28_26.md): one painted pixel per screen pixel, never a block.
ONE DENSITY RULE FOR THE WHOLE GAME, map and fight: art AUTHORED at >= his
street's 39 px/m, SHOWN with no painted pixel larger than one device pixel.

```json
{"card":"VERDICT_TILE_OPTIONS","date":"9/28/26","seam":"COOK 8b97875",
 "density":{"his_street_px_per_m":[38.6,42.9],"source":"his person/car/door sprites","killed_road_party_px_per_m":5,"verdict":"PASS"},
 "options":{"A":"PASS - his approved street as is","B":"LEAD, FAILS AS DRAWN: hip corners 70%/67% pure black (transparency flattened), ridge at 253 over the 0.92 ceiling","C":"premise dead (fight tile is a house, roof is high ground); interiors/special places only"},
 "finding":{"house_tile_on_phone_device_px_per_m":49,"needs":"fight canvas backing store at device ratio (V224 is 1:1 CSS = 3x3 blocks on a 3x phone)","one_rule":"authored >= 39 px/m, shown <= 1 device px per painted px, map and fight alike"},
 "superseded":"records/BOHEMIA_RULING_THE_CELL_IS_THE_STEP_9_28_26.md (his 9/28 correction)"}
```
