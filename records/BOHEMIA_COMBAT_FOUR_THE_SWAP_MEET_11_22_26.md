# COMBAT FOUR: THE SWAP MEET (BUILD 11/22 - THE SWAP MEET)

11/22/26. COMBAT FOUR, more boards (rule 461: 'more boards, more ground, every floor tile from Battle Brothers with its cost and
effect'). The swap meet (the map's kind 'swapmeet': 'SWAP MEET (Broadacres, north)', engine/bohemia_overmap.js), whose fights were all
fought on the strip's blocks. Rules 416, 59, 428, 451(a), 441, 465, and rule 20's analog horror at the source (a stall of old
televisions, one still on, snow on its screen, a tape deck under it blinking 12:00). Ask row 651.

## MEASURED BEFORE (main, BUILD 11/22zb)
A fight at the swap meet was fought on the strip's blocks ('swapmeet' is in the strip's board kind, engine/bohemia_boardkinds.js),
never under the sheds. The swap meet keeps one cell in 31 of 40 valleys, on 12 places (engine/bohemia_overmap.js, seeds 1 to 40).

## THE FACTS IT IS BUILT ON
- The map's own words above: Broadacres, the north valley's market.
- The real Broadacres Marketplace has run in North Las Vegas since 1977: an open-air market of some forty acres, hundreds of vendors on
  the weekend, a food court, the vendors' stalls in long rows under covered sheds.
- The dead's own line for the kind (engine/bohemia_dead.js): 'the last market, and the crush at it'.
- A swap meet's covered row is stalls back to back (folding tables loaded with goods), racks of clothes, crates and coolers, tyre
  stacks, the vendors' vans parked behind; its food court is food stands round the edge and picnic tables in the middle.
- Batteries are the money (Paolo 9/4, locked): the change booth is where they changed hands. Nothing of the economy is built here.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/swapmeet/swapmeet.json`, the fortieth in `slices/fight_ground/insides.json` (share 0.6: six fights in
ten at its cell under the sheds; the rest on the lot). No new rule code; the ceiling is the warehouse's roof ('joist', a stand-in, at
10%, for the sheds' corrugated roofs).
- `the_covered_rows`: stalls back to back in long runs (cover), stalls of old sets (cover; one still on, snow on its screen), racks of
  clothes packed tight (they hide a man), the vendors' vans in the corners (they hide a man), the change booth in the middle (cover),
  crates, coolers and tyre stacks (low cover), goods trampled flat in the crush (rough 3 AP, low cover), the monsoon's water in the
  asphalt's dips by the fence (Battle Brothers' swamp: 4 AP, a man in it fights worse); gates on both sides and the bottom, two fires.
- `the_food_court`: food stands round the edge and two in the middle (they hide a man; every price crossed out), picnic tables tipped
  on their sides (cover), the produce stalls in the middle (cover), coolers, crates, tyres and trampled goods, the water; gates on both
  sides and the bottom, two fires.
- 16 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the racks and the food stands its wall, the vans its
  boulders, the trampled goods its brush, the tyres its palisade waist high, the water its swamp); 13 pieces with the walls, all
  stand-ins painting at least 9% of a tile (I13) (the names for COOK in the handoff). NO HIGH GROUND: the sheds' roofs are thin tin on
  poles. No line rewritten (465); the tiles' tap lines are new, draft.

## THE GATE (gates/the_big_insides_gate.js: the first part, with the swap meet, 262 passed, 0 failed in 218 s; the second and third
## parts unchanged since BUILD 11/22zb, 242 and 239, 0 failed; the swap meet 22 of them alone, in 56 s)
25 of 40 fights the gate deals at the swap meet go inside (the share 0.6); I14 THE MAP'S DICE: on its 12 real places it goes inside in
68% of its cells over 40 valleys (meant 0.6), so the share stands as written; 24 of 24 fights to the end on AUTO (6.4 rounds), nobody of 288 stood a
whole fight; 2% of men on the bare floor after round one against 11% with rule 428's leg off; every board's floor joined, both layouts
dealt both ways; I11 the water is swamp; I12 the racks and the food stands hide a man (the vans are the same row, sight blocked); I13: every stand-in piece paints at
least 9% of a tile.
MY FIRST CUT, MEASURED AND CHANGED: 14% bare after round one (the food court 16%): men ended their walk beside the gates and in the
middle of the cross aisles. Crates, coolers and trampled goods went into those spots: 2%, and with the rule off still 11%.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:swapmeet, C3_INSIDE=swapmeet, through the map's own door)
4 fights inside, THE COVERED ROWS every time (the cells 43,10 and 44,10), first try each way: the demo upright 7 of 7 taps (crates,
coolers, the asphalt, a stall of old sets, a stall, the change booth, a fire), the alpha on its side 4 of 4, the demo on its side 6
of 6, the alpha upright 4 of 4. All ended on AUTO, 21 of 21 tile taps, 0 page errors. THE FOOD COURT is seen on the fight page opened
alone (the card's top right) and in the gate (24 boards). Run two at a time.

## SAID PLAINLY
VOTE card combat4-the-swap-meet-11-22 (stand_in): the covered rows and the food court from the fight's camera, and a real fight in the
covered rows. The pictures are stand-ins (a casino's bar for a stall, a casino's screens for a stall of old sets, a rack for racks of
clothes, a container for a van, the cashier's cage for a food stand) until COOK draws them; the ground's rules are real. The set still
on and the tape deck blinking 12:00 are in the words (draft); their picture is COOK's and their hum is SOUNDS'.
