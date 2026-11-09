# THE RANCH AND THE LAKE CAMP (WORLD 14, batch three, 11/9; VAMILY rule 440(c), ask line 539; rules 409(c), 429(h), 430)

## THE JOB
Rule 440(c)'s list after batch two (records/BOHEMIA_WORLD_14_SEVEN_MORE_PLACES_TALK_11_9_26.md): the ranch and the greenhouse, the bus
yard, the campground and RV park were not on the map at all.

## WHERE EACH ONE REALLY IS (verified this round)
- THE RANCH: Spring Mountain Ranch State Park, under the Red Rock escarpment: 36.06972 N, 115.45056 W (Wikipedia's infobox; TopoZone
  36.06969, -115.45667). A working ranch from the 1870s, Howard Hughes's in the 1960s, a state park since 1974. OUTSIDE the valley.
- THE CAMPGROUND AND RV PARK: Callville Bay on Lake Mead: the NPS's 52-site campground and the concession's RV park, 36.143263 N,
  114.725594 W (the listings agree). OUTSIDE the valley.
- THE BUS YARD: the RTC's Sunset Maintenance Facility, 5165 W Sunset Road (opened August 2009, 36.6 acres: bus parking, maintenance,
  fuel, wash bays; the Las Vegas Sun, Stantec); the RTC's other yard, the Integrated Bus Maintenance Facility at 3210 Citizens Ave.
  INSIDE the valley. (WORLD TEN could not verify it on 11/6; it is verified now.)
- THE GREENHOUSE: no single verified greenhouse farm yet; the valley's real food growers are inside the valley (the north-west's
  orchards). INSIDE the valley.

## WHAT WAS BUILT: THE TWO OUTSIDE THE VALLEY, ON THE REGION'S REAL LAND
The way WORLD TEN placed the lab and Lenzie: tools/bohemia_world_region.py PLACES (WORLD's own tool, re-run; deterministic, it
reproduced the committed land byte for byte before the change). engine/BOHEMIA_REGION_LAND.json gains exactly two places and their
district memberships (RED ROCK, LAKE MEAD); nothing else moved (measured: every other place, road, district seat unchanged).
SPRING MOUNTAIN RANCH lands at -18,65, 0.9 blocks off its real spot, on a road, 8.2 hours on foot; CALLVILLE BAY at 151,45, 0.4 blocks
off, 15.4 hours, off-road (the region gives it a dirt track to the nearest road, 429(h)). The region draws, names and opens them with
its own machinery; the generator of the valley (WORLD 13's) is untouched.

Each in records/target/bb/real_places.json (where 'region', its finds, its first-arrival post, its region look) with its visit:
| place | who | the choices | its use |
|---|---|---|---|
| SPRING MOUNTAIN RANCH | THE FOREMAN | BUY A SIDE OF BEEF (-6 batteries, +6 food, every 4 days: one a night, the stall's price); STAND GUARD AGAINST THE RUSTLERS TONIGHT (a fight: 4 food, 4 batteries and the ranches up the road hear); WALK IN | the food people fight over |
| CALLVILLE BAY | THE HARBORMASTER | TRADE BATTERIES FOR DRIED BASS (-4, +5 food, every 4 days: fish cheaper than beef); TAKE ON THE MAN FROM SITE 31 (2 food: he joins, a fisherman, eleven years on the site); WALK IN | where the roaming parties winter: food and a man |
The region looks (rule 430, reuse first; the 11/8 wrapper on vbRegionTrade): the ranch borrows the region's 'garden' look (fields and a
farmhouse), the campground its 'trailers' look (an RV park is trailers in rows). Fight rows in WORLD 13's table 'places': the ranch (a
barn and the ranch house, one or two storeys, corral rails a step never a shot, hay half cover), the campground (motorhomes on the
loop road, thin walls half cover, the lake's water a step). Analog horror: the Hughes house's phone that still rings on a cut line;
the camp host's THREE NIGHT LIMIT after eleven years.

A WORD FIXED IN BATCH TWO'S DATA: Lenzie's turbine watcher said 'owns Las Vegas'; the game calls the city Bohemia (IT IS CALLED
BOHEMIA, rule 362), so he says 'owns the whole valley'.

## NOT DONE: THE TWO INSIDE THE VALLEY
The bus yard (verified: 5165 W Sunset Rd) and a greenhouse farm need a seat in the valley's generation. The note to WORLD 13 stands in
handoffs/WORLD_FOURTEEN.md: unless WORLD 13 says otherwise, the next WORLD round seats them the way WORLD TEN did (the DATA block only),
as places of kinds the map already has (a terminal or a yard for the buses, a farm for the greenhouse).

## GATES
THE PLACES GET THEIR USE 30/0 over fourteen places (U4 the region's four at their coordinates; U7 the card at all fourteen; U12c all 20
non-fight choices pay; U13 the lab a compound, the ranch a farm, the RV park trailers), demo and alpha. THE MISSING REAL PLACES 16/0 (R8
the region's four). The region's own gates, all ten that read its land: REGION LAND 61/0, THE DISTRICTS JOIN 29/0, REGION BASES 365/0,
A PLACE IS NAMED ONCE 7/0, THE REGION HAS ITS CITIES 5/0, BATTLE BROTHERS' SIZE 9/0, OVER THE MOUNTAIN 7/0, THE REAL CORNER 16/0; THE
ONE RULER 30/3 and IT IS CALLED BOHEMIA 5/1 red on clean main too (COMBAT TWO's street board TILE_M; ours.json and landmarks.json
saying Vegas), none of them these files.

## SOURCES
en.wikipedia.org/wiki/Spring_Mountain_Ranch_State_Park; topozone.com/?p=1241591; nps.gov/lake/planyourvisit/lake-mead-campgrounds.htm;
recreation.gov/camping/campgrounds/10068459; thedyrt.com/camping/nevada/callville-bay; lasvegassun.com/news/2009/aug/26/rtc-opens-new-bus-maintenance-facility/;
stantec.com (RTC Sunset bus operations and maintenance).
