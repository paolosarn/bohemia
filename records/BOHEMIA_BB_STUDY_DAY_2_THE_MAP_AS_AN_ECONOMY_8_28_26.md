# BB STUDY, DAY 2 — THE MAP AS AN ECONOMY
# (8/28/26, coordinator. Question: what makes a world map feel like an
# economy instead of a menu of destinations? This is the day that answers
# his "it was missing a little bit of this, like, CITY SOUL.")

## 1. CHECK THE SHELF FIRST — AND THE SHELF IS FULLER THAN I EXPECTED
`engine/bohemia_economy.js` (7/19) is already serious work and it already
did half of today's real-world research:
- It names the collapse sequence outright: **fiat dies with the state,
  exchange reverts to BARTER, then re-converges on COMMODITY MONEY** — a
  divisible, durable, universally needed good. And it cites the real
  cases: **cigarettes in WWII camps**, 1990s Russian towns, ammunition and
  fuel in Balkan sieges, ration cans in Sarajevo, bottled water after
  hurricanes.
- **PRICE UNDER SCARCITY IS HYPERBOLIC, NOT LINEAR** — the last week of
  water costs more per litre than the last month did — anchored on real
  siege data (Sarajevo 92-95: staples moved 10-100x, not 2x).
- The numeraire is `salvage` and it is **[PENDING Paolo]** by design, with
  a single swap point when he names the money.
- Mojave numbers are real: 4L a day average, ~2000 kcal is one ration,
  Vegas held roughly a week of grocery inventory on just-in-time trucking,
  and the deep casino dry stores are **the reason downtown matters.**
**SO TODAY IS NOT ABOUT WHETHER PRICES ARE GROUNDED. THEY ARE.**

## 2. THE MEASUREMENT — WHAT IS MISSING IS THE MAP, NOT THE MONEY
Checked with positive controls before claiming anything absent.
- **NOTHING PRICES BY PLACE.** There is no priceAt, no localPrice, no
  per-district price. (Positive control: the grep finds `price` in a dozen
  modules, so it works. The place-aware version genuinely is not there.)
- **NOTHING MOVES GOODS.** "Caravan" in this repo is a FACTION NAME —
  `faction:Caravans` in the graph and in the people module's line pools,
  including its Spanish and Spanglish registers. **THERE IS A CARAVANS
  FACTION AND THERE ARE NO CARAVANS.** They are named after a thing the
  game does not simulate.
- **THE HUB IS SINGULAR AND NEAREST.** The walked surface reaches trade
  through `nearestHub` and a `buy(`. Nearest, not best. So there is no
  reason to prefer one place over another and no reason to carry anything.
**PUT TOGETHER: WE HAVE PRICES WITHOUT GEOGRAPHY.** A grounded scarcity
model where every point on a 33-square-mile map quotes the same number.
That is the missing city soul, stated mechanically.

## 3. THE OTHER AISLE — AND IT SAYS THE OPPOSITE OF WHAT I EXPECTED
The canonical study of an economy with no state, no money and no law is
R.A. Radford's "The Economic Organisation of a P.O.W. Camp" (1945), which
our own economy module already cites for the cigarette part. The part it
does NOT cite is the part that matters today.
Radford describes trade starting because **people had equal means and
UNEQUAL PREFERENCES** — the Sikhs sold their beef ration, the French were
desperate for coffee. Difference in WANTS, not in wealth, is what creates
a market. And then:
> Prices tended to be **stable and well known, PRECISELY BECAUSE there
> were middlemen around, seeking out bargains and arbitrage
> opportunities.**
He describes one trader with capital of about **fifty cigarettes** who
bought rations on issue day and held them until prices rose, and who
"picked up profit by arbitrage by **visiting every notice board** and
taking advantage of every discrepancy between prices offered and wanted."
And the men who could **speak Urdu, or bribe a guard to reach the French
quarters**, made small fortunes — because they could cross a boundary
other people could not.
### *** THE FINDING THAT CHALLENGES WHAT WE BELIEVE ***
**THE INSTINCT IS TO ADD TRADERS AND CARAVANS TO MAKE THE MAP FEEL
ALIVE. THE EVIDENCE SAYS EFFICIENT MIDDLEMEN FLATTEN THE MAP.** They are
the mechanism that makes prices the SAME everywhere. Radford's camp
converged on stable, well-known prices exactly because arbitrage worked.
**SO THE THING THAT MAKES A MAP AN ECONOMY IS NOT TRADE. IT IS
FRICTION.** Prices differ by place only when something stops goods from
flowing: distance, danger, a boundary you cannot cross, a language you do
not speak, a gate somebody holds.
**AND WE ARE ALREADY RICH IN FRICTION AND HAVE NEVER SPENT ANY OF IT:**
- **DISTANCE IS TIME.** The day advances 0.084 per cell. Crossing the
  valley costs real hours of a real clock.
- **HEAT IS THE DAILY CONDITION.** Carrying weight through the Mojave at
  noon is a cost the game already models.
- **FACTIONS HOLD GROUND.** 14 of them, on real districts, with canon
  standing constraints. A boundary you cannot cross is already there.
- **LANGUAGE IS A BOUNDARY, AND IT IS NOW LAW.** His 8/25 Spanglish
  ruling put three registers in the valley. Radford's small fortunes went
  to the men who could speak to the other quarter. **THAT IS THE SAME
  MECHANIC AND WE ALREADY OWN IT.**
- **AND THE CARAVANS FACTION IS THE ANSWER TO ITS OWN NAME.** If moving
  goods is dangerous and slow, then the people who do it for a living are
  a faction worth having, and they are the ones who profit from the
  friction rather than erasing it.

## 4. AND WHAT BATTLE BROTHERS DOES WITH IT
BB's map is alive because settlements **produce and want different
things**, prices differ, factions hold territory and fight each other
without the player, and the roads between are dangerous. Every one of
those is a friction or a difference — and BB's contracts, from Day 1, are
generated out of that state rather than sprinkled on top of it.
**THE ONE SENTENCE THAT JOINS DAY 1 AND DAY 2:** if the world has real
differences and real friction, then the WORK generates itself, because a
job is just somebody's problem with the map.

## 5. WHAT I WOULD ROUTE ON DAY 5 (not routed today, per his order)
- **PRICE GETS A PLACE.** The scarcity model already exists; it needs a
  district argument. No new economics, one new dimension.
- **DISTRICTS PRODUCE AND WANT DIFFERENT THINGS.** Unequal preferences,
  which is what Radford says starts a market. The dry stores downtown are
  already canon.
- **FRICTION IS PROTECTED, NOT REMOVED.** No fast, safe, universal trade
  route, ever. The moment goods flow freely the map goes flat.
- **THE CARAVANS FACTION GETS TO BE CARAVANS.**
- **AND THE OFFER GATE FROM DAY 1 READS THIS STATE**, so a job on the
  phone is a real consequence of a real shortage somewhere.

## 6. CONFIDENCE
- Nothing prices by place, nothing moves goods, the hub is nearest-only:
  greps with positive controls. **HIGH.**
- "Caravan" being a faction name rather than a system: read in the graph
  and the people module. **HIGH.**
- Radford on unequal preferences, middlemen stabilising prices, the
  fifty-cigarette trader and the Urdu speakers: the paper is public and
  widely summarised. **HIGH.** I read summaries and quotations rather than
  the PDF end to end, and say so.
- BB's map behaviour: wiki and player discussion; the developer blog is
  proxy-blocked from this environment. **MEDIUM-HIGH.**
- "Friction, not trade, is what makes a map an economy": my argument
  built on Radford. Flagged as argument.

## SOURCES
R.A. Radford, "The Economic Organisation of a P.O.W. Camp," Economica
(1945); Tim Harford's summary of its trading rules; Finance Watch and
related write-ups on cigarette currency. Battle Brothers wiki on
settlements, trade goods and faction relations. In-repo:
engine/bohemia_economy.js, engine/BOHEMIA_faction_graph.json,
engine/bohemia_people.js (the Caravans line pools),
slices/BOHEMIA_CITY_WORLD.html (nearestHub), and
laws/BOHEMIA_ADDENDUM_THEY_SPEAK_SPANGLISH_8_25_26.md.
