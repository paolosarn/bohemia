# BATTLE BROTHERS SCHOOL, LIFE + CITY, ROUND ONE: THE MAP ALREADY HAS FOURTEEN PLACES
# 9/27/26, rule 33(f) ("every chat carries a [bb ...] line, school first, one page per round")
# Department under rule 33(a): THE MAP IS THE CITY VIEW WE HAVE, and the city view is this lane's.

---

## 0. WHY THIS PAGE IS A MEASUREMENT AND NOT A SUMMARY

The coordinator's round zero already says how Battle Brothers travel, contracts and events work
(records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_THE_MAP_ROUND_ZERO_9_24_26.md). Repeating it in this lane's
voice would be a second copy of somebody else's page.

Rule 33(a) hands this lane one specific thing: **the map IS the city view, and the city view is
mine.** So the useful question is not "how does Battle Brothers do a map" but **"how far is OUR
ground from being one, in numbers, right now."** Every number below was measured this round out of
the repo, not remembered.

## 1. THE ONE THING BATTLE BROTHERS' MAP IS, THAT A HEIGHTMAP IS NOT: IT IS A LIST OF DESTINATIONS

A Battle Brothers world is generated fresh per campaign and it comes out with roughly **17
settlements**, in tiers: about 2 cities, 3 towns, 6 villages, plus strongholds, castles and manors,
aligned to three noble houses. Everything else on that map — forest, swamp, hills, roads — exists to
make the distance BETWEEN those 17 cost something.

**That is the whole trick, and it is worth saying plainly: the map is not the ground, it is the
short list.** Seventeen names is a number a person holds in their head. You do not travel across
Battle Brothers' terrain; you travel from one name to another name, and the terrain sets the price.

## 2. SO I COUNTED OUR NAMES. THERE ARE FOURTEEN, AND THEY WERE ALREADY THERE.

Faction seats are derived, never typed: the tier comes from his own faction graph's `act1_power`,
ranked and cut in thirds (engine/bohemia_towns.js, WORLD 9/5, off
laws/BOHEMIA_ADDENDUM_FACTION_TOWNS_9_4_26.md). Measured this round:

    FORTRESS   Remnants 14, Mob 13, Cartel 12, Network 11, Caravans 10
    TOWN       Church 9, Reds 8, Blues 7, Anarchists 6, Trades 5
    CAMP       Custom 4, Volunteers 3, Homeless 2, Colorful 1

    SEATS ON THE MAP                14
    BATTLE BROTHERS' SETTLEMENTS   ~17

**WE ARE THREE PLACES OFF BATTLE BROTHERS, AND NOBODY BUILT THEM FOR THIS.** They fell out of a
faction graph he wrote months before the overworld was a rule. The tier mix is close too: 5 / 5 / 4
against BB's roughly 4 big, 3 middle, 6 small. The short list this lane needed for a map **exists**.

## 3. AND THE MAP AT THREE DATES IS ALREADY IN THE SAME NUMBERS, WHICH IS MY CLAIMED ROW

My open row is [three cities], rule 31: the same ground three times. Run the identical tier
derivation against `act3_power` instead of `act1_power`:

    Reds        TOWN      ->  FORTRESS     climbs
    Caravans    FORTRESS  ->  TOWN         falls
    Custom      CAMP      ->  (no act3_power at all)
    the other eleven seats hold their tier

**TWO OF FOURTEEN DESTINATIONS CHANGE RANK BETWEEN ACT 1 AND ACT 3.** That is the honest number and
it is small. Said as a player would feel it: walk the valley in act 3 and thirteen of your fourteen
stops are the same size they were, one has grown and one has shrunk.

This is the SAME shortfall as the one already flagged as [PENDING Paolo] from the ground side (the
future fits in 6.7% of the valley: 620 desert, 4,074 built, 4,522 skeleton, of 9,216). **Two
independent measurements, ground and places, both say the three acts currently differ by a few
percent.** That is not an argument to fake a difference; it is the strongest evidence yet for the
reading that reclaiming means REPLACING what is already built rather than spreading onto new ground.

## 4. THREE HOLES THE COUNT FOUND, AND ONE OF THEM IS A BUG

1. **FOUR FACTIONS HAVE NO SEAT AT ALL.** Pures, Panthers, La Familia and Triads all carry
   `act1_power: null`, so the tier derivation skips them and they own no place on the map. Eighteen
   factions, fourteen destinations. Under rule 33 a faction with no seat is a faction you can never
   travel to, which is a different thing from a weak one.
2. **CUSTOM HAS NO `act3_power`.** It is a CAMP in act 1 and nothing in act 3. That reads in a diff
   as a seat that changes, and it is not a change, it is missing data. I am NOT filling it in:
   contents are Paolo's, the mechanism is mine, and inventing a power number would put a fake seat
   on his map.
3. **A SEAT IS A TIER, NOT YET A PLACE YOU ARRIVE AT.** The derivation says how big each one is. It
   does not say what standing in it looks like, which is rule 33(b): the street is where you arrive.

## 5. WHAT MOVES, THAT BATTLE BROTHERS' PICTURE DOES NOT (rule 33g, and it closes every [bb ...] line)

Paolo 9/24: *"Battle Brothers is just a bunch of pictures... we can do more and put more life into it
with this analog horror, pixel, Newgrounds bullshit we're doing."* On Battle Brothers' map a
settlement is a static icon that never changes until a raid flips its art.

**Ours already has one thing moving that theirs cannot: the lights.** Measured on the live overmap
and already shipped as the two approved pictures this lane made:

    lamp ground with a LIVE circuit         264
    lamp ground dark                      2,170
    LIT, AND THE CENSUS SAYS NOBODY HOME    168
    lit, and somebody lives there            96

So the valley seen from above is **a field of lights, most of which are burning over nobody**, and
that number is real occupancy crossed with real wiring, not decoration. A Battle Brothers map icon
tells you a village is there. Ours can tell you a village is there, that its power is on, and that
nobody is home, at a glance, with no text. **THAT IS THE MOVING THING: THE MAP IS LIT, AND THE LIGHT
IS LYING.** Travel at night and the short list reads as lamps; the seat that went dark since your
last pass is the event, and nothing had to pop up to say so.

## 6. THE SHAPE FOR US (defaults, his to knock down in VOTE; rule 12, nothing waits on another lane)

- **THE SHORT LIST IS THE MAP.** Fourteen seats are the destinations; the 9,216 blocks are the price
  of the distance between them, never fourteen thousand things to tap.
- **TIER IS THE MARKER'S SIZE, AND IT IS DERIVED PER ACT.** One marker shape at three scales, read
  from the same graph the tier already comes from. Flip the act, the markers resize. No second table.
- **THE LIGHT IS THE STATE.** A seat draws lit or dark off the circuit the lane already measures, so
  the map's information is the world's information and cannot drift from it.
- **WHAT WE DO NOT COPY:** BB's icon that only changes when raided, its menu-town, and its
  same-everywhere terrain. This valley is Las Vegas with faction colour on the ground.

## 7. NEXT ROUND'S [bb ...] LINE FOR THIS LANE

The seats are counted; what is not measured is **where they actually sit on the 96x96 overmap and
how far apart they are** — because in Battle Brothers the distance between names IS the game, and a
short list whose fourteen names are all within a few taps of each other is not a map either. That is
one probe, and it is this lane's next page.

[PENDING coordinator] Rule 33(f) says every chat carries a `[bb ...]` line and only the coordinator
adds job lines (rule 10). This page is the work; the row for it on the board is the coordinator's to
write. Suggested label and name: `[bb places]` THE-MAP-IS-FOURTEEN-NAMES-NOT-NINE-THOUSAND-BLOCKS.
