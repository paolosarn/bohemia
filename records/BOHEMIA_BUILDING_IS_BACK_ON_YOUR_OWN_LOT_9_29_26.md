# BUILDING IS BACK, ON YOUR OWN LOT
# LIFE + CITY, 9/29/26, row [build a lot] (rule 40b) — and [vote picture] closed

---

## 1. HIS RULING

Rule 40(b), Paolo 9/29: *"a more deep rich interactable buildable world."* Building is back **inside the
settlement screen of a home base you own**: tap a lot, build from the assets we have, it costs batteries
and time, and it shows on the map, on the fight board, and in the derived future. The separate builder
screen stays cut. **This lane owns what can be built and what it does**; RUN owns the screen; WORLD the
block. Rule 39(a): decide the defaults and build them.

## 2. SCHOOL, ONE PAGE: HOW BATTLE BROTHERS DOES IT, AND WHAT WE DO THAT IT DOES NOT

From the library (reference/library/battle_brothers/01_WORLDMAP.md, 07_ECONOMY.md) and WORLD's
[bb places] page (records/BOHEMIA_WORLD_BB_PLACES_THE_HINTERLAND_9_25_26.md):

- **In Battle Brothers you never build anything.** A town changes through **situations** — "well
  supplied", "trade route ambushed", "raided", "famine" — that your actions push around indirectly:
  *"clear the camp, the ambush situation ends and prices fall."*
- A town's **attached locations** (a mine, a goat pen, an arrow-maker's shed) decide its stock, its price
  level (+3% each) and its recruits. The world places them; the player cannot.
- **Crises burn settlements.** Nothing the player owns is at stake, because the player owns nothing.

**What we do differently, so nobody can call it a rip-off (rule 39b):**
1. **You build it yourself, on your own lot**, one battery and one day at a time.
2. **The next generation inherits it.** Every finished build is a deed in the century ledger, so the
   derive counts it in act 2 and act 3 — and **a raid can tear it down** (37c). Battle Brothers' town
   forgets you the moment you leave; ours is your family's.
3. **What moves where theirs is a still (33g):** a panel goes up and the windows it feeds light the next
   night; the stall's slab takes a rack of cells; nothing is a menu tick.

## 3. WHAT CAN BE BUILT, AND WHAT IT DOES — `engine/bohemia_lotbuild.js`

**Measured first:** the cut builder placed **whole districts** (59 kinds off the overmap enum — airbase,
casino, stadium) as plots on the city map. A lot inside a home base is not a district, so the catalog is
**small buildings**, and **every one is a piece the game already draws** (kit and legend code named; the
gate refuses one that does not exist):

| thing | the piece it is | costs | does | on the fight board |
|---|---|---|---|---|
| SHED | trailer park: shed | 1 battery, 1 day | 1 material a day | a building |
| PUMP HOUSE | pump station: pump house | 1 battery, 1 day | 1 material a day | a building |
| GARDEN BED | school: garden bed | 1 battery, 1 day | 1 material a day | open ground |
| SOLAR PANEL | solar field: solar panel | 1 battery, 1 day | **WORLD's ruled** 1 battery a day | a building |
| VENDOR STALL | swap meet: vendor stall | 1 battery, 1 day | 1 name (clout) a day | a building |
| ROOF | suburb: house | 1 battery, 1 day | **houses a family** | **high ground** (37g) |
| WALL | suburb: wall | 1 battery, 1 day | nothing, and says so | a wall |

Every number is a ruling already made: **7/26** buildings house people or make one of the three; **8/15**
everything costs one; **9/4** batteries are the money; the solar yield is **read** from
`bohemia_powerbuild.js` (WORLD's 9/5 ruling), never typed. A panel that pays back in a day is not a money
printer: the game pays one day per day and owns no wall clock (WORLD's own measurement).

**No second ledger.** Money goes through the purse, deeds through the century ledger, output through the
purse's own PRODUCTION table and `produce()`. The module keeps only the one thing none of them know:
which lot is under construction, and when it finishes.

## 4. TWO BUGS CAUGHT BEFORE THEY SHIPPED, BOTH MINE

- **A fixed roof housed nobody.** The century ledger records a household at the moment of the build, from
  a housing table the game fills at boot. In a clean process it was empty, so the roof went down as zero
  people. The module now fills that table itself (idempotent, never over a ruled row) before a build can
  finish: act 3's people go **215 -> 217.2** for one roof, the ruled household size.
- **A reload paid twice.** The first cut remembered "paid today" in a field on the purse; the purse's
  `save()` writes only its entries, so a reload on the same day forgot and paid again — the exact bug
  `bohemia_production.js` was written to prevent, one file over. Now **paid-today is counted from the
  ledger's own produce entries**; two panels standing means two payments that day, however many times
  the day ticks or reloads.

## 5. THE GATE — `gates/build_a_lot_gate.js`, suite BUILD A LOT, 26 ok 0 failed

Every piece real · every number a ruling · each thing houses or makes exactly one currency (the wall
nothing) · a start costs exactly one battery and broke / taken / unknown are refused by name · nothing
finishes early · **a finished build moves the real derive's act 3** (standing 0 -> 2, people 215 ->
217.2) and never the map's lines · pays once per standing building per day **including across a save
and a load** · a roof is high ground, a wall a wall · MUTATIONS: a made-up piece is caught; erase today's
payment from the ledger and it pays again, which proves the ledger is what is read.

## 6. THE COOK, AND THE ONE I DID NOT SHIP

**Not shipped:** a catalog sheet with each piece cut out of its district's map block. Two passes and the
cards still read as flat blocks — the pump house a blank roof, the first "wall" a whole neighbourhood's
perimeter. That is the look he has killed three times, and the finished art is COOK's and DIRECTION's.
Kept under records/lifecity_pictures/, never registered. **Route to COOK:** five of the seven (shed, pump
house, garden bed, roof, wall) need their pieces drawn from the street he approved.

**Shipped:** `slices/vote/LIFECITY_TWO_DAYS_OF_BUILDING_9_29.png`, **VOTE tab** — the module running for
real, on **the street he approved three times**, whose own art already draws two of the seven (the solar
panel with its cabinet; the swap stand, which is a stall):

    day 0   build a solar panel            batteries 1  material 0  name 0
    day 1   it stands; build a stall        batteries 1  material 0  name 0
    day 2   both stand                      batteries 2  material 0  name 1
    act 3 inherits 2 standing (the real derive)

The money under each panel is the module's, on the real purse; the factory refuses if what a panel draws
and what the module says stands ever disagree.

## 7. [vote picture] CLOSED, AND A MERGE THAT UNDID MY WITHDRAWALS

PLUMBER's line: the raid picture was on the published site with nothing naming it. Both pulled pictures
(raid ground, places you can never enter) **moved to records/lifecity_pictures/**, their factories
re-pointed, their two lines off `gates/excavate_baseline.txt`. EXCAVATE 8/0.

**And both had come back into his queue.** PORTRAIT's `604688cc` ([head and gear]) resolved a registry
conflict by taking an older copy, which **restored the two items I had withdrawn** (neither judged). Pulled
again. **Routed:** the same commit also carries rows from ANIMATION and the coordinator; worth each lane
checking that nothing of theirs was restored or dropped. This is the resolver bug WORLD named on its own
helper: taking one side of the registry whole silently undoes the other side's edits.

## 8. WHAT IS LEFT ON [build a lot]

RUN's settlement screen calling `BohemiaLotBuild.list / start / tick` (the module is ready; it is not yet
embedded in a play surface), COOK's markers from `markerOf()`, COMBAT's board reading `fightTile()`. The
catalog is draft:true and in VOTE.
