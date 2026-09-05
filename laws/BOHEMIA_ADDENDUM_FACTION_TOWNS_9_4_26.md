# BOHEMIA ADDENDUM -- FACTION TOWNS: EVERY PART OF VEGAS HAS AN OWNER, AND THE
# BIG ONES ARE FORTRESSES (Paolo 9/4/26, LOCKED)
# "the way in battle Brothers when you pull up to different parts of the
# country, maybe that could be two different parts of Las Vegas and each
# part of Vegas is owned by a faction and that's where you can do all your
# trading or whatever they'll have different buildings supporting them...
# there's different sizes of cities so maybe the more bigger or more
# prominent factions kind of feel like strong fortress parts... and then
# for the smaller ones like the colorful maybe they just have... not a lot
# of goods not a lot of buildings not a lot of good quests and it's just
# smaller."

## THE RULING
- **EVERY PART OF THE VALLEY IS OWNED BY A FACTION, AND THE FACTION'S SEAT
  IS WHERE YOU TRADE.** A faction's town is its market, its buildings, its
  quests, and its people, in one place on the map. This is his 6/30
  "city-state system, parts of Vegas as faction holdings" finally given a
  shape, and it is the mechanism day 6 found missing (nobody holds ground).
- **TOWNS HAVE SIZES, AND SIZE IS THE FACTION'S WEIGHT.** Three tiers, the
  way the game he named does it:
  - **FORTRESS.** The big, prominent factions. Walls, many supporting
    buildings, the most goods, the best quests, the most people.
  - **TOWN.** Middle.
  - **CAMP.** The small ones ("like the colorful"): few goods, few
    buildings, thin quests, small.
- **WHAT SUPPORTS A TOWN IS BUILDINGS.** In the game he named a settlement's
  buildings decide what it sells and what it asks for (a smithy, a tavern,
  a temple, a market). Here the DISTRICT KIT and the 49 registered districts
  are those buildings: a fortress has the deep dry stores, the kitchens and
  the plant (day 8's back of house); a camp has a stall.
- **THIS IS WHERE THE MONEY LIVES.** Batteries are the money (9/4) and
  prices need a place (day 2): a faction town is the place. What a town
  sells and wants comes from the buildings it has, so two towns are two
  different markets without a single invented number.
- **AND IT SCALES THE QUESTS.** A fortress offers better work than a camp.
  That is day 1's "renown gates the offer" with a second axis: WHERE you
  are asking.

## MECHANISM MINE, CONTENTS HIS
- **THE TIER IS DERIVED, NOT TYPED.** His own faction graph already carries
  `act1_power` and `act3_power` for every faction (GDD section 9). Tier
  comes from that number: top third fortress, middle town, bottom camp,
  tagged `draft:true` so he moves any faction he likes with one edit. So a
  fortress in act 1 can be a camp by act 3 and the reverse, which is the
  CENTURY RULE with no new field.
- **WHICH FACTION SITS WHERE IS HIS** (MAP LAW: Claude never designs map
  layouts). The 14 selectable factions are already placed on generated
  districts; the town grows around that seat. Moving a seat is his.
- **WHAT A TOWN'S BUILDINGS ARE** comes from the tier and the faction's
  align, using the district kit's existing modules. No new art to start.
- **120 BPM:** a town is a place, not a tick. Arriving is a beat; trading is
  the tap's beat; nothing in a town runs on wall-clock time.
- The demo: the first town a stranger reaches should be reachable inside
  the first day (day 19 measured the first required person at a seven-hour
  round trip).

## ROUTING
- WORLD: FACTION-TOWNS, right behind the drains in VAMILY. Composes with
  BB-TURF (the lights as the owner map), BB-PRICE-PLACE and BB-WANTS (day
  2), BB-BACK-OF-HOUSE (day 8), BB-OFFER-GATE (day 1).
- ART: the buildings a fortress needs that nobody has drawn are the ~20
  map-only districts already on ART's queue; the towns ruling is the reason
  to build them, in tier order.
- FACTIONS: which faction holds which tier stays his; the draft off
  act1_power ships so the map is never empty while he decides.
- Gate: a towns gate asserts every selectable faction has a seat, a tier
  derived from the graph, and a market reachable on the walked surface.
