# ECONOMY DAY 65: WHAT A LOT COSTS TO BUILD -- THE BATTERY IS ALREADY LOCKED, THE WELL IS THE ONE THAT TAKES LONGER
# Rule 74 top row [build costs], for LIFE+CITY [build a lot] (rule 40b): the price in
# batteries and days of each thing you can put on a lot (shed, pump, wall, shop, roof) and
# what it pays back; EVERYTHING COSTS ONE scaled honestly; one page with the numbers as a
# table proposal for TUNING.

## 0. THE BB AISLE IS EMPTY -- BATTLE BROTHERS HAS NO BUILD MECHANIC AT ALL
Checked directly against the library (reference/library/battle_brothers/01_WORLDMAP.md,
10_UI_AND_FEEL.md): the player never constructs anything in Battle Brothers. Settlements
come pre-built with a fixed set of buildings (market, tavern, temple); the settlement screen
is a painted view of what is already there, clickable, never buildable. This is the same
shape this lane has hit on every prior "what do you build" question (round 61's farming, same
finding): BB's own answer is nothing, so the question is almost entirely real-world and this
repo's own locked rulings.

## 1. THE PRICE AND THE "NEVER PAYS ITSELF BACK" RULE ARE ALREADY LOCKED AND GATED -- NOT RE-OPENED HERE
LIFE+CITY already shipped the price half of this exact row, twice over, in two engine paths
(engine/bohemia_lotbuild.js for a home base's settlement-screen lots, engine/bohemia_cityedit.js
for the general city-edit build path) and one gate (gates/build_costs_its_price_gate.js):
every buildable thing costs EXACTLY ONE battery, flat, tuned:false, and that gate's own leg A9
proves on purpose that "a building never pays its own price back -- it costs a battery and
makes resources" is a deliberate HARD SINK against inflation, not an oversight. Nothing in
this round argues with that; EVERYTHING COSTS ONE already IS the honest scaling for the price,
exactly as the row's locked law requires, and re-opening it would contradict a gate that exists
specifically to keep the faucet-and-drain math from drifting.

## 2. WHAT IS ACTUALLY STILL FLAT AND UN-SOURCED: THE DAYS, NOT THE BATTERY
engine/bohemia_lotbuild.js's own CATALOG prices every one of its eight entries (wall, water
tank, shed, pump house, garden bed, solar panel, vendor stall, roof) at the same DAYS = 1,
flat, for all of them -- the one dimension the price itself cannot carry (it is locked at one)
is exactly where a real difference in build complexity should show up, and right now it does
not. This is the row's own "scaled honestly" half, still open.

## 3. THE REAL AISLE: MOST OF THE EIGHT GENUINELY ARE ABOUT A DAY'S WORK -- ONE IS NOT
Checked against real small-scale/DIY construction timelines, not felt: a short fence or wall
section, a simple garden bed box, a vendor/market stall, and a small prefab water tank hookup
are all commonly documented as roughly a single day of labor for a small, improvised build --
which means the current flat DAYS = 1 is NOT wrong for four of the eight, it is already the
honest number. A residential roof re-roof and a small solar panel's on-site physical install
are also commonly documented in the 1-to-3-day range for a small structure, closer to the
current default than not. THE ONE CLEAR OUTLIER IS THE PUMP HOUSE: a water well (drilling to a
usable depth, then setting the pump) is a materially bigger real job than a prefab tank hookup
-- commonly documented at several days of real drilling and assembly, not one, because a well
pulls water out of the ground rather than just holding water already delivered. The tank and
the pump are currently priced identically (both DAYS = 1, both makes: {resources:1}, six:
water) even though one is "water already here, in a box" and the other is "dig until you find
water," which the real world treats very differently.

## 4. THE NUMBERS TABLE TO TUNING -- ONE SPECIFIC SIGNAL, NOT EIGHT GUESSED DIGITS
| Lot | Current days | Real-world direction | TUNING's gap | Source |
|---|---|---|---|---|
| wall, shed, garden, stall | 1 (flat) | matches a small/improvised build's real timeline | none; the current default is already honest | small-scale/DIY construction timelines |
| roof, solar | 1 (flat) | real small installs commonly run 1-3 days; close to current, not a clear mismatch | whether to lengthen slightly | residential re-roof and small solar install timelines |
| tank (prefab water tank) | 1 (flat) | a hookup to water already delivered; a day is honest | none | small prefab tank installation timelines |
| pump (a well) | 1 (flat) | a well is dug, not hooked up; real wells run several days, not one | lengthen pump's days specifically; the exact number is TUNING's | water-well drilling and pump-house installation timelines |
The battery cost and the no-payback rule are NOT in this table: both are already locked,
sourced and gated, and this round does not touch them. Only the pump's day count is flagged
as a real mismatch; the other seven stay as they are, unchanged, not re-guessed for the sake
of touching all eight.

## 5. BANK
Eight role-place lines, draft:true, in banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md (round 65,
prefix one S longer than round 64's).

## 6. ROUTED
- LIFE+CITY [build a lot]: the one concrete change this round surfaces is lengthening the
  pump's build days relative to the tank's; everything else in the catalog stays as shipped.
- TUNING: the pump's exact day count, the only real gap this round found.
- No change to the battery price or the no-payback rule anywhere; both stay as already
  locked and gated.
