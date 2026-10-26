# TAPE AT EVERY STALL (RUN TWO, 10/26/26, rules 265(a) and 276(b))

Paolo 10/26: 'all stalls, no matter the settlement, always sell at least a stack of duct tape... it almost makes the game
unplayable'; then 'I made it to day four and couldn't find anywhere to get repair items, duct tape... this run's over, my
stuff's not repairing.' The coordinator interrupted every other row for it.

## MEASURED BEFORE
The stall sold food and water, a dose of meds and six rounds. No stall in any place sold tape; ECONOMY's price file said
'the stall does not sell tape yet' until ede463a0 put the shelf in the data. CAMP's mending spends a roll for 15 points of
armour, so after the origin's starting tape ran out nothing could be mended anywhere.

## NOW (__TAPE_AT_EVERY_STALL__, slices/BOHEMIA_SETTLEMENT_SCREEN.html; BUILD 10/26zd)
- Every stall reads ECONOMY's shelf (records/target/bb/stall_prices.json tape_shelf through engine/bohemia_stall_prices.js
  tapeShelf and tapePrice, the one arithmetic): a stack of 20 in a camp, 40 in a town, 60 in a fortress, twice where Trades
  make it; a town's card thins or fills it, never under a stack; restocked by the file's restock_days (every map day since ECONOMY's Day 84, rule 271(b); Battle Brothers' 'Shops
  resupply every 3 days' at its own pace).
- Two lines with the tape icon: 'A roll of tape' (the stall's own price, 1 battery) and 'A stack of tape, 20 rolls' (one
  tap, the 20 rolls' own prices summed). Past the shelf the keeper sells from the back at twice the price: never sold out.
- What he buys goes into TAPE on the bar (bohemia.supplies.v1 .tape), the count CAMP's mending spends.
- The shelf's count under the lines ('50 rolls on the shelf. More in the back, dearer.', draft:true).

## GATE
TAPE AT EVERY STALL 8/0 (gates/tape_at_every_stall_gate.js, in the suite), the demo, a new game, real taps: S1 day 1
Church's stall shows a roll and a stack with the icon, priced by ECONOMY, 50 on the shelf; S2 a roll: purse 400 -> 399,
TAPE 40 -> 41, shelf 50 -> 49; S3 a stack: TAPE 41 -> 61, purse -20; S4 days 2 to 5 on the map's own clock (advance(),
the nightly bill and all): tape every day, full again on each restock (the file's restock_days: three when this was first run, one since ECONOMY's Day 84); S5 all 14 home bases: Anarchists 50,
Blues 40, Caravans 75, Cartel 75, Church 25, Colorful 25, Custom 25, Homeless 25, Mob 75, Network 60, Reds 50, Remnants 75,
Trades 50, Volunteers 20; K1 the computer by a click.

## STILL OWED ON RULE 265 (the next rows, not this ship)
(b) every stall BUYS every supply, piece of gear and trade good he carries, a small place paying less: [sell at the stall]
(rule 242) with ECONOMY's sell numbers; (c) a town with shelves and no stall gets one: measured, every picture in both
ground sets has a stall hotspot, so every place already has one.

[bb Battle Brothers sells Tools as a 20-point stack and a big town has more of them; ours sells the roll or the stack and never runs dry.]
[analog horror: the keeper keeps the good rolls in the back, like a pharmacist behind glass.]
