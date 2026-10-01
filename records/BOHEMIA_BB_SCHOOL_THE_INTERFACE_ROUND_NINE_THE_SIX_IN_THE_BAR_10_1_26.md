# UI [bb interface] ROUND NINE: THE SIX IN THE BAR (10/1/26, ui-kmqmrf)

Rule 47(a), Paolo 9/29: "the Battle Brothers resource and currency situation fits ours
perfectly: medicine, ammo, repair tools, food, gold". BATTERIES = gold, FOOD = provisions,
MEDS = medicine, ROUNDS = ammo, TAPE = repair tools, plus WATER. The board: "UI [bb interface]
the HUD's six". Rule 39(a) BUILD IT, 40(f) the hold is lifted for the map. So it is BUILT,
and the vote item asks only where they sit.

## THE SCHOOL (library vol 10, the HUD, restated for this one question)
Battle Brothers' world map keeps its stores in ONE ROW at the top centre: crowns, provisions,
tools, medicine, ammo. Always on screen, never a button, a mark and a number each; the day
and the speed buttons sit beside them. The player checks them at a glance while the party
travels, because travel is what spends them. The lesson for a phone: a store you cannot see
while travelling is a store you run out of by surprise.

## WHAT THE GAME COUNTS TODAY (read off the code, and ECONOMY round 55 agrees)
  BATTERIES  purse 'electricity'  real, the money (9/4)
  FOOD       purse 'resources'    real; day:ate (the daily food bill) draws on it
  MEDS       nothing              no player count anywhere (the sim's GOODS.meds is the valley's)
  ROUNDS     nothing              the one true zero; scavenge names 'ammo' with no caller
  TAPE       nothing of its own   fight:plate also draws on 'resources', so tape and food
                                  share one pile today; the bar gives the pile to FOOD
  WATER      nothing              the sim prices it; the player is never charged
Two of six are counted. The other four draw their mark and a DIMMED DASH, never a number.

## WHAT IS BUILT (slices/BOHEMIA_CITY_WORLD.html, __THE_SIX_IN_THE_BAR__)
- The round-eight batteries plate became ONE plate of six, in rule 47a's order, each a
  10x10 pixel mark drawn in the bar's own accent (battery, tin, cross, bullet, roll, drop)
  and a count. Readouts, not buttons (the strip keeps pointer-events:none).
- ONE SOCKET FOR THE COMPANY LEDGER: sixCounts() asks BohemiaLedger.count(kind) FIRST if any
  lane defines it, then the purse. When ECONOMY or whoever builds rule 47a's company ledger
  ships, the bar reads it with no edit here; ECONOMY round 55 asked the coordinator who builds
  it, and this is the one place it has to plug in.
- THE BAR READS THE STEP THAT JUST HAPPENED: a travel step repaints the bar. Found by the
  gate: the half-second repaint showed 06:21 while the clock already said 06:26.
- At 320 wide all six and the hour stay whole; only the place shortens (SUB...).

## MEASURED ON THE DEMO (gates/the_bar_says_three_things_gate.js, 23/0)
  six=0 0 - - - -, hour 06:00, where SUBURB; ends at 274 against NOTES at 338 (390 wide)
  credit 3 batteries through the purse -> the bar reads 3 within a second
  plant BohemiaLedger.count('rounds')=7 -> ROUNDS reads 7, lit; remove it -> the dash again
  320 wide: ends 254 against NOTES at 268, six and hour whole, the place clipped
TWO MUTATIONS, each caught and restored byte-identical:
  invent a zero for meds              -> 1 red (meds=0@1: a number where the game has none)
  stop reading the socket             -> 1 red (rounds stays a dash with a ledger present)

## THE VOTE ITEM (ui-the-six-in-the-bar-10-1, slices/vote/UI_THE_SIX_IN_THE_BAR_10_1.png)
All three shot on the demo's map through the one driver, 14 batteries and 6 food put in the
purse through the purse so the numbers are not all zero:
  A ONE ROW (IN THE GAME NOW): the six in one plate beside the hour and the place
  B TWO ROWS: the six get their own row under the bar, bigger marks; the map starts 36 px lower
  C TAP THE BATTERY: only batteries in the bar; one tap drops all six with their names
FOUND MAKING C: a drop-down under the bar's left end opens UNDER the shell's settings gear
(the gear belongs to the outer page and always draws on top). The picture moves it right;
if he picks C, the drop-down opens right of the gear. Same family as the gear over the full
phone's title, already named for [portrait menu].

## NOT DONE, SAID PLAINLY
- No ledger was built. Four of six read a dash until one exists. That is ECONOMY's research
  and the coordinator's architecture call (round 55 section 5), not this lane's.
- The bar does not warn when a store runs low (Battle Brothers turns the number red). It
  waits on a count to be low; with two of six counted it would warn on food alone.
- Landscape (rule 50b, [landscape]) not measured for the six; that row is OPEN.

[bb interface] stays CLAIMED: the next round is the event on the road (with PORTRAIT [bb faces]).
