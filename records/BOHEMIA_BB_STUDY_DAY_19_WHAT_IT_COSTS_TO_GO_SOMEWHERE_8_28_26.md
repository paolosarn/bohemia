# BB STUDY — DAY 19: WHAT IT COSTS TO GO SOMEWHERE
# (coordinator, on his trigger. Days 1-18: records/BOHEMIA_BB_STUDY_DAY_*.md)
# THE LAST UNTOUCHED CAMPAIGN SYSTEM: TRAVEL.

## 0. THE QUESTION
Eighteen days on systems. **Nobody has looked at the verb the player
actually performs more than any other: WALKING.** What does a step cost,
what does a day buy, and how far away is the first thing the game asks
you to do?

## 1. THE MEASUREMENT, AND THE ARITHMETIC IS CLEAN
All of this is in the walked surface, and I checked the two scales
against each other rather than trusting either:
- A fine tile is **0.75 m** (`CELL_M = 0.75`).
- The walk ticks **0.084 minutes per fine cell**, described in the city's
  own words as *"time per CELL, distance-honest"* — and the day loop's
  comment states the consequence plainly: **"twelve walked cells cost one
  minute."**
- Zoomed out, the pad's own comment says **"a press is not a step — it is
  ninety-six metres and TEN MINUTES."**
- An overmap cell is `TILE_FINE × CELL_M` = 128 × 0.75 = **96 m**. So the
  two scales agree: **about 9 metres a minute, roughly 0.54 km/h.** The
  "distance-honest" claim checks out.
### WHAT THAT BUYS
- The day runs 06:00 to 22:00 — **960 minutes**. So **a full day of
  nothing but walking is about 8.6 km.**
- The valley is 96 overmap cells across at 96 m each: **about 9.2 km.**
**SO CROSSING THE VALLEY ON FOOT IS A LITTLE MORE THAN ONE ENTIRE DAY.**
That is not a bug and it is not too slow. It is a good number, and it is
the fact the whole travel design should be built on.

## 2. AND THE FIRST JOB IS A SEVEN-HOUR ROUND TRIP
Day 8 quoted the measurement the QUESTS lane already made from the block
he wakes up on:
> *within 3 blocks: 23 people, ZERO of them running with anybody.
> nearest TRADES: 5 blocks (~1.9 km). the TRADES BASE: 7 blocks (~2.7
> km).*
And day one's quest demands `faction=TRADES` for its **one REQUIRED
role**.
**AT NINE METRES A MINUTE, 1.9 KM IS ABOUT 211 MINUTES. THREE AND A HALF
HOURS THERE. SEVEN HOURS THERE AND BACK — FORTY-FOUR PERCENT OF THE FIRST
DAY THE PLAYER EVER PLAYS, SPENT WALKING TO THE PERSON THE FIRST JOB IS
ABOUT.**
To be fair to the lane: the casting bridge now FINDS that person and gives
them a real address, which is the hard part and it is done. **This is not
about whether the job can be found. It is about the distance the world
puts between you and it, and nobody has ever multiplied the two numbers
together.**

## 3. THE OTHER AISLE — DISTANCE HAS ALWAYS BEEN THE ORGANISING COST
- **Von Thünen's model**, the foundation of spatial economics: transport
  cost rises with distance from the market, and **that alone determines
  what happens where.** Intensive uses cluster near the market; extensive
  ones spread out far. Distance is not a nuisance in that model. It is
  the thing doing the organising.
- And the real world encoded the isochrone **in law**: the City of London
  controlled the founding of markets within **six and two-thirds miles
  (10.7 km)**, being *"the distance a person could be expected to walk to
  market, sell his produce and return in a day."*
### *** AND THAT NUMBER IS OUR NUMBER. ***
A market town's catchment was about ten kilometres because that is a day
there and back. **Our valley is 9.2 km across and a day buys 8.6 km.**
**THE WHOLE VALLEY IS EXACTLY ONE MARKET TOWN'S CATCHMENT — one day's
world.** That is a gift: it means the map is already the right SIZE for
its clock, and every design question about travel is about the shape
inside it, not the scale of it.

## 4. WHAT THE GAME HE NAMED DOES WITH TRAVEL
- **Terrain costs you.** Forests and swamps slow you and forests cut your
  vision; hills and mountains are slow; open steppe and grassland are
  free.
- ***ROADS ARE FAST.*** Everybody, player included, moves at high speed
  along a road.
- A **scout** in your company speeds you through bad terrain — a person
  who changes the map.
- Chases are real and expensive: running down bandits **can take days**
  across mountains and swamp.
- **AND THERE IS A SPEED CONTROL.** Pause, normal, fast. The game knows
  that travel time must be SPENT but does not have to be WATCHED.

## 5. *** THE FINDING THAT CHALLENGES WHAT WE BELIEVE ***
Day 2 concluded **FRICTION IS PROTECTED** — no fast, safe, universal
route, ever, because the moment goods flow freely the map goes flat. That
is right and I still hold it.
**IT IS ALSO NOT THE WHOLE RULE, AND THIS STUDY HAS BEEN QUOTING HALF OF
IT FOR SEVENTEEN DAYS.** The game we are studying protects friction AND
gives you a fast-forward button AND makes roads fast. Those are not
contradictions. They are the two halves of one rule:
> **THE COST IS REAL. THE WATCHING IS NOT.**
> **DISTANCE SHOULD SPEND THE DAY, NOT THE PLAYER'S ATTENTION.**
Our 3.5-hour walk correctly costs three and a half in-game hours. It also
costs the player however long it takes to press a pad twenty times, and
**that second cost buys nothing.** It is not friction, it is not tension,
and it is not realism. It is just time out of a person's evening.
### AND THE SECOND HALF IS A LEVER WE ARE NOT USING AT ALL
**ROADS ARE THE ONLY THING THAT CHANGES THE SHAPE OF THE MAP WITHOUT
REMOVING THE FRICTION.** A fast road does not flatten the valley — it
makes the valley have a GRAIN. Some places are near in time and far in
metres, some are the reverse, and that is exactly the structure von
Thünen says organises everything.
**AND WE HAVE MORE STREET THAN ALMOST ANYTHING ELSE IN THIS PROJECT:** a
harmonised street bank, SIDEWALK SANCTITY, the street-aware/drivable law,
and his own 8/25 ruling that **streets must connect like Lego** with art
and path as one contract. **And a street currently costs exactly the same
time as broken ground.** Every one of those streets is, mechanically,
scenery.
**A STREET THAT IS NOT FASTER IS A PICTURE OF A STREET.**

## 6. WHAT WE TAKE, AND WHAT WE REFUSE
**TAKE:** roads that are genuinely faster, so the street network becomes
a real structure rather than a texture; terrain that costs differently,
which we already half-have in the district types; the principle that a
person can change your travel (day 8's former trades has a dozen
candidates for that); and a way to spend travel time without watching it.
**REFUSE:** teleporting, fast travel to anywhere, and anything that makes
the map flat — day 2's rule stands. Also refused: making the world
smaller to fix a walk. **The map is his** (MAP LAW: Claude never designs
map layouts), and the distance is not the problem, **the watching is.**

## 7. ROUTED
- **WORLD / RUN — BB-ROADS-ARE-FAST.** A street costs less time per metre
  than broken ground. This is the single lever that gives the valley a
  GRAIN without removing any friction, it turns the entire street bank
  from texture into structure, it makes his LEGO-streets contract
  MECHANICAL instead of cosmetic, and **it needs no new art at all** —
  the streets are already drawn and already know what they are.
- **RUN / UI — BB-THE-TIME-NOT-THE-TAPS.** Distance spends the DAY, not
  the player's attention. A route you set and let run, or a held press
  that keeps going, so the seven-hour trip costs seven game-hours and not
  twenty real taps. This is not fast travel and it does not remove the
  cost; **it removes the watching.** Pairs with day 14: the cold hand
  presses the loudest thing and never reads, and twenty identical presses
  is exactly what it will do.
- **QUESTS — BB-INSIDE-A-DAY.** A job should say how far it is BEFORE you
  take it. Day one's required person is a seven-hour round trip and
  nothing on the offer says so. **This row is DISCLOSURE, not relocation
  — where people are is his and MAP LAW holds.** The real-world rule is
  the standard to measure against: a day there and back is the reachable
  set, and an offer outside it should announce itself.
**RUNNING ORDER:** behind the demo, except that BB-THE-TIME-NOT-THE-TAPS
touches the first day a stranger plays and should be measured with day
14's cold hand before anybody calls the demo ready.

## 8. CONFIDENCE
- `CELL_M = 0.75`, `TILE_FINE = 128`, 0.084 minutes per fine cell,
  "twelve walked cells cost one minute", "ninety-six metres and ten
  minutes", and the 06:00-22:00 day: **MEASURED AND CROSS-CHECKED** — I
  verified the walked scale and the overmap scale agree rather than
  trusting either, and they do.
- The 1.9 km / 5-block figure and day one's TRADES requirement: quoted
  from the QUESTS lane's own measurement, **second-hand within our repo
  and flagged**. The multiplication into 211 minutes is mine and is
  simple arithmetic on their number and the clock's.
- BB's terrain penalties, fast roads, the scout, multi-day chases and the
  speed control: wiki and player discussion; the dev blog is
  proxy-blocked here and was NOT read directly. **MEDIUM-HIGH.**
- Von Thünen, and the City of London's 6⅔-mile market radius as "walk
  there, sell, and return in a day": standard economic geography and
  documented market law. **HIGH**, though the exact radius varied by
  jurisdiction.
- §5's rule, §6 and §7: **MY ARGUMENT AND MY ROUTING.** The claim that
  the watching is the cost, not the distance, is the load-bearing one.

## SOURCES
Battle Brothers wiki (Global Map) and Steam discussion on terrain
movement penalties, roads allowing high-speed movement, the scout
follower, multi-day chases, and the pause/normal/fast speed control.
Johann Heinrich von Thünen's model of agricultural land use and the
transport-cost-with-distance principle; documentation of the City of
London's market rights within six and two-thirds miles, "the distance a
person could be expected to walk to market, sell his produce and return
in a day". IN-REPO: slices/BOHEMIA_CITY_WORLD.html (`CELL_M`,
`TILE_FINE`, the `__THE_DAY_IS_SPENT_BY_WALKING__` comment and its
"twelve walked cells cost one minute", the `__THE_PAD_SAYS_WHAT_IT_WILL_
DO__` comment and its "ninety-six metres and ten minutes", the day loop's
06:00 and 22:00, and the casting note's block distances),
laws/BOHEMIA_ADDENDUM_THE_PLAYTEST_DISPATCH_8_25_26.md (item 4, streets
connect like Lego), laws/BOHEMIA_ADDENDUM_STREETS_ARE_THE_HARMONIZED_
POOL_7_31_26.md, and days 1-18 of this study.
