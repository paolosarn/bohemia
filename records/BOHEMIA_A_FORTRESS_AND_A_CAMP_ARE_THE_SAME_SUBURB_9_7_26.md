# A FORTRESS AND A CAMP ARE THE SAME SUBURB, ONE IS JUST BIGGER
COOK (16, the Production Artist), VAMILY [fortress buildings], 9/7/26. Round 1.

## THE ROW
> the buildings a faction fortress needs that nobody has drawn, in tier order (FACTION-TOWNS)

His law behind it (`laws/BOHEMIA_ADDENDUM_FACTION_TOWNS_9_4_26.md`, LOCKED 9/4):

> **FORTRESS.** The big, prominent factions. **Walls, many supporting buildings**, the most
> goods, the best quests, the most people.
> **CAMP.** The small ones ("like the colorful"): few goods, **few buildings**, thin quests, small.
> …*WHAT A TOWN'S BUILDINGS ARE comes from the tier and the faction's align, using the
> district kit's existing modules. **No new art to start.***

So this row may only draw what the kit cannot already draw. The first job is finding out
what that is, and the answer was not what reading the source suggested.

## WHAT I GOT WRONG BEFORE MEASURING, AND IT WOULD HAVE BEEN THE WHOLE ROUND

Matching the 55 district kinds the world puts a value on against `engine/bohemia_*.js`
filenames said **18 kinds have no module** — among them `fort`, `arsenal`, `granary`,
`prison`, `estate`, `convention`. That looked like the row's answer: six undrawn
fortress-shaped buildings, in worth order, ready to cook.

**It was wrong, because a filename is not a registry.** `DISTGEN` in
`engine/bohemia_world.js` is the registry, and it holds **61 generators** — many kinds
share a module (`gated` and `estate` both build through the suburb generator). Every one
of `fort`, `arsenal`, `granary`, `prison`, `estate`, `convention`, `datafort`,
`pumpstation`, `radio` and `minigp` **is already buildable.**

    kinds the world VALUES but DISTGEN cannot build: 8
    airbase  airport  highroller  luxor  sign  sphere  strat  strip

Five of those eight are Strip landmarks worth 336 each, and three are worth **zero**. Not
one of them is a building a fortress would sit on. **The buildings a fortress needs are
already drawn**, exactly as his law predicted when it said "no new art to start".

## SO WHAT IS ACTUALLY MISSING: MEASURED ON THE REAL SURFACE, ALL FOURTEEN TOWNS

`tools/bohemia_fortress_probe_9_7_26.js` boots the alpha on a phone, finds the city's own
map and category function, derives the seats the shipped way, and reads what is on each
town's ground out to its own REACH.

    FORTRESS (5)
      Caravans   seat truckstop    9 cells   suburb x7,  truckstop x1, commercial x1
      Cartel     seat storage     30 cells   suburb x24, commercial x5, storage x1
      Mob        seat resort      36 cells   suburb x10, strip x8, resort x7, downtown x4, …
      Network    seat radio       35 cells   suburb x21, medical x4, trailer x2, courthouse x2, …
      Remnants   seat prison      25 cells   suburb x21, prison x4
    CAMP (5)
      Colorful   seat suburb       6 cells   suburb x4,  commercial x1, apartment x1
      Custom     seat suburb       6 cells   suburb x4,  apartment x1,  commercial x1
      Homeless   seat pumpstation  4 cells   suburb x3,  pumpstation x1
      Trades     seat industrial   6 cells   industrial x4, suburb x2
      Volunteers seat medical      6 cells   medical x4, suburb x2

    every kind across all fourteen towns: suburb x131, resort x17, downtown x14,
    commercial x13, strip x8, medical x8, apartment x5, prison x4, industrial x4, …

**131 of 218 town cells are suburb. Sixty percent of every faction's home ground in Las
Vegas is a housing tract.** The Cartel's fortress is twenty-four cells of suburb with one
storage shed. The Remnants' fortress is twenty-one cells of suburb with four prison cells.
Colorful, the camp he named by name as the small one, is four cells of suburb.

### THE FINDING, IN ONE LINE
**A fortress and a camp are made of the same thing. The only difference on the ground is
size.** His ruling asks for "walls, many supporting buildings" against "few buildings", and
what the valley delivers is the same suburb at reach 3 and at reach 1.

### AND THE WORDS THAT MEAN STRONGHOLD ARE BARELY THERE
`fort` appears **twice** in fourteen towns and is nobody's seat. `arsenal` appears **zero**
times. `granary` appears **zero** times. All three are buildable today. Nothing is choosing
them for a fortress, because nothing chooses a town's buildings at all — a town is whatever
districts the generator already put on that ground.

### AND THERE IS NO WALL, WHICH IS THE FIRST WORD OF HIS FORTRESS
Nothing in the repo draws a wall around a town. Searched `engine/` and both surfaces: the
only perimeter walls that exist are the **suburb's own CMU tract walls** (7/14 WALLED
SUBURBS LAW, LOCKED — "decent and nice suburbs are SURROUNDED BY WALLS"), and the casino's
explicit ban on them (8/16, LOCKED: *"no perimeter walls until I tell you, bro no fencing no
nothing bro"*).

**Those two do not conflict with a fortress wall, and it matters that they do not.** The
8/16 ban is scoped to a **casino's plot** — its own comment says "the building meeting the
sidewalk is the edge", about one district's frontage on Fremont. The 7/14 law already
establishes that Bohemia draws perimeter walls, and 9/4 is newer than both and names Walls
for a fortress specifically. So a fortress wall is legal, the art for one already exists in
the suburb generator, and nobody has put one anywhere.

## WHAT THIS ROW DOES NEXT
Not "draw six new buildings" — they exist. The gap is that **nothing distinguishes a
stronghold from a camp except how far it spreads**, and the two cheapest honest fixes are
both reuse:

1. **A fortress is walled.** The CMU perimeter wall the suburb already draws, run around a
   fortress town's outer edge. His first named fortress word, and no new pixels.
2. **A fortress's supporting buildings should be the ones that mean supply.** `fort`,
   `arsenal` and `granary` are drawn, buildable, and unused. Which districts a town gets is
   the towns module's business, so that half is routed rather than taken.

## ROUTED, NOT DONE
**[FOR WORLD]** Nothing chooses a town's buildings. `districtsOf` reports what is already on
the ground and `REACH` decides how much of it a town claims; there is no step that says a
fortress should carry supply buildings and a camp a stall. That is why 60% of every town is
suburb. `fort`, `arsenal` and `granary` are all buildable and all unused.

**[FOR THE PLUMBER]** `bohemia_furnish.js` dresses 25 rooms; the floorplan's own comment
says the floor pool maps 36 names. `plant`, `dining` and `corridor` are mapped and dressed
by nothing. **Two names that same comment lists as gaps — `study` and `garage` — ARE dressed
today**, so `records/BOHEMIA_ECONOMY_DAY_6_A_CASINO_IS_A_JOB_NOT_A_PRIZE_9_5_26.md` is stale
on that point and its "two zones are placing rooms nothing can furnish" no longer holds.

## AND THE INSTRUMENT WAS WRONG FIVE TIMES FIRST
Every one caught before anything was written down, and the fifth is the one worth keeping:
the harness taps through `page.__cdp` rather than a local name; a `const cat` in the probe
**shadowed the page's own `cat`** so the expression looking for it threw; the comment
explaining that used backticks, which closed the template literal; guessing at `cityCat` /
`catOf` found nothing and printed **four tiers of clean zeroes that read exactly like a
finding**; and the fix for that is the part that stays — the probe now prints whether it
could see the map and the category function at all, and says in capitals that its zeroes
are the instrument and not the game when it could not. The city's own call,
`BohemiaTowns.turf(om, window.BohemiaCityEdit.cat, seats)`, is where the right names were
the whole time.
