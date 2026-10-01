# EVERYTHING YOU CAN BUILD, AND A LOT LIES IN A REAL BLOCK
# LIFE + CITY, 10/1/26, row [build a lot] round 3

---

## 1. A LOT LIES IN A REAL BLOCK (FACTIONS' round four, used the round it landed)

FACTIONS 73aad0e8 shipped `blockHolder(partAt, rec, bx, by)` and `heldBlocks(...)`: who holds any of the
valley's 9,216 blocks, derived from the part it lies in, nothing stored. `engine/bohemia_lotbuild.js` now
takes it:

- a lot may carry its block (`bx, by`) and the hold may carry the geography (`partAt`, the city's turf
  grid, and `n`); a lot whose block lies in ANOTHER part, on this part's screen, is refused
  **WRONG_PART** (and costs nothing); a block outside every part is **NO_BLOCK**;
- `holdings()` returns **`blocks`**: "a base is every block you hold", as a number.

**Measured on the real valley (overmap 12345):** nothing is yours before you take anything (0 blocks);
take the Mob's part and you hold **1,415 of 9,216 blocks** (15%); take the Cartel's as well and it is
**2,723** (30%); ruin the Mob's and you are back to the Cartel's 1,308. So rule 43's "half the city by act
3" is about **four parts** of the fourteen, a real target, not a slogan.

Gate BUILD A LOT **56 -> 62/0**, leg O on the real valley.

## 2. THE COOK: EVERYTHING YOU CAN BUILD, all eight drawn

`slices/vote/LIFECITY_EVERYTHING_YOU_CAN_BUILD_10_1.png`, **VOTE tab**. The 9/29 catalog sheet cut each
piece from its district's map block and read as flat blocks twice (never shipped). This one cuts each from
**the street he approved**, where all eight are now drawn in that street's own planes, light and palette:

| card | drawn as | the card says (read from the module) |
|---|---|---|
| WALL (gold, first) | block wall across the front yards, piers, joints | 1 battery 1 day, makes nothing, no hogs |
| WATER TANK (gold, first) | lidded drum on a stand, downpipe off the roof | +1 water a day, no pigeons |
| SHED | corrugated lean-to behind house one, door open, a board and a barrel | +1 tape a day |
| PUMP HOUSE | block hut in the east margin, vent, rising main | +1 water a day |
| GARDEN BED | timber-framed raised rows (the school kit's own garden olive) | +1 food a day |
| SOLAR PANEL | the approved act-2 array, cabinet and the windows it lights | +1 battery a day |
| VENDOR STALL | the approved swap stand | makes your name |
| ROOF | a new gable on house one, ridge cap and fixings; its windows come on | houses a family |

**New this round in the street's drawing:** shed, pump house, garden bed, roof (`LOT_ITEMS`, drawn only
when a panel names them; all four approved pictures **byte-identical**, md5). **Two catches:** the first
roof was one flat grey sheet and read as a second solar array; it is a gable now, lit north slope, shaded
south, like every roof on the street. And the first cards were whole-street crops where each thing was a
speck in a corner; each card is now a 48x32 window doubled, so the thing fills it.

**The factory refuses** if the module lists a thing the sheet cannot draw or the sheet draws a thing the
module does not list; every word on a card is the module's (name, cost, what it makes as one of THE SIX,
what it guards, whether it houses).

**Honest about the six:** the cards say tape, water, food, battery because that is each one's six-name
(rule 47). Until ECONOMY [six resources] cuts the ledger, the purse still pays tape, water and food as
"materials". The names are the translation; the cut is a lookup.

## 3. COOK'S ROUTE CLOSED

Round 1 routed "draw the shed, pump house, garden bed, roof and wall from the approved street" to COOK.
All five are drawn now (the wall last round), in the street's own factory; COOK is free of it.

## 4. STILL OWED BY OTHERS

RUN [settlement screen] (OPEN, not built): the screen calls `holdings / list / start / tick` with FACTIONS'
ledger and `partAt`; WORLD hands the open kinds; ECONOMY maps the six; COMBAT reads `fightTile()`; the
beasts read `exposed()`.
