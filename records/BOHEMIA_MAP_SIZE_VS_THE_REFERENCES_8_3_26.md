# HOW BIG IS OUR MAP, REALLY — vs SKYRIM, VALHEIM AND NEW VEGAS (8/3/26)

> "let me ask you how big is skyrims world map compared to valheim or fnv world map
> compared to valheim or valheims map compared to ours"
> — Paolo, 8/3/26

Recorded so nobody re-googles it, and so the comparison has one place to live.

---

## THE NUMBERS

| | TOTAL AREA | GROUND YOU WALK ON |
|---|---|---|
| **Fallout: New Vegas** | ~16.5 km² | ~16.5 km² (no ocean) |
| **Skyrim** | ~37.1 km² | ~37.1 km² |
| **BOHEMIA** (canon seed) | **84.9 km²** | **75.7 km²** |
| **Valheim** | **314 km²** | **unknown — mostly ocean** |

Bohemia's figures are OURS, measured by `gates/mapsize_gate.js` on the canon seed, not
estimated: 96 × 96 districts, **9.22 km a side**, 84.9 km², of which **37.0 km² is
BUILT**, 32.9 km² roads, 5.7 km² desert, 9.3 km² rock/water — and **75.7 km² you can
put a foot on**.

Valheim is a **circle of radius 10 km** (20 km across), so π·10² = **314 km²**.

## THE THREE RATIOS HE ASKED FOR

1. **SKYRIM vs VALHEIM — Valheim is about 8.5x Skyrim** by total area (314 / 37.1).
2. **NEW VEGAS vs VALHEIM — Valheim is about 19x New Vegas** (314 / 16.5).
3. **VALHEIM vs OURS — Valheim is about 3.7x Bohemia** by total area (314 / 84.9).

## AND WHY THOSE THREE NUMBERS ARE MISLEADING

**ALMOST ALL OF VALHEIM'S EXTRA AREA IS WATER.** It is not one landmass, it is
thousands of islands and continents separated by an Ocean biome that exists to be
SAILED, not walked. Community sources describe hours of sailing just to chart one
island's coastline. So "3.7x bigger than us" is measuring a sea.

**I COULD NOT FIND A SOURCED LAND FRACTION FOR VALHEIM, AND I AM NOT INVENTING ONE.**
That is the one number that would make ratio 3 honest, and it is not published. What can
be said without it: our **75.7 km² of walkable ground** is a real measured floor, and
Valheim's walkable ground is a fraction of 314 that nobody has published. On land, the
two are plausibly in the same class. **Bohemia is roughly DOUBLE Skyrim and about
4.6x New Vegas on foot** — those two comparisons are solid, because neither game has an
ocean to discount.

**AREA ACROSS GAMES IS NOT COMPARABLE ANYWAY, BECAUSE OF SCALE COMPRESSION.** Skyrim's
37 km² is a compressed world: a whole province stands in for a country, and cities are
a dozen buildings. Bohemia is **1:1 real city scale** — 128 tiles = 96 m per district,
a street is a street's width, a house is a house's size. Ours is a smaller number
describing a much more literal place.

## THE HONEST RULER IS CROSSING TIME, NOT AREA

| | ON FOOT, END TO END |
|---|---|
| **Skyrim** | ~2 h 30 m walking (~45 m jogging) |
| **BOHEMIA** | **2 h 25 m walking corner to corner** (0 h 51 m running a side) |

Measured for us, community-measured for Skyrim. **Bohemia already takes about as long
to walk across as Skyrim does**, on a diagonal of 13 km, and it does it while being a
literal city rather than a compressed province. That is the comparison worth quoting,
because it is the one a player actually feels.

Also ours, from `laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md` clause 16: crossing
the valley is **12,288 steps** at 3.52 s a step.

## SOURCES AND HONESTY

- **Bohemia:** `gates/mapsize_gate.js`, canon seed. Our own measurement, re-derived
  every suite run, with a FLOOR so the world cannot be quietly emptied.
- **Valheim 314 km²:** derived from the published 10 km world radius. Arithmetic, not a
  claim.
- **Skyrim ~37.1 km² and the ~2 h 30 m crossing:** community measurement, widely
  repeated. Not a developer figure.
- **New Vegas ~16.5 km²:** the figure our own gate already uses. Community estimates
  cluster roughly 14–17 km²; treat it as a band, not a decimal.
- Every primary source page 403'd through this environment, so all four non-Bohemia
  numbers come from search-index summaries. **The only number here I would defend to
  the decimal is ours.**

Beware the garbage figures in circulation: one search result reported New Vegas at
"8,502 square miles," which is a lore-map area, not playable ground. Any comparison
mixing lore maps with playable worldspaces is worthless.

## NOT DECIDED HERE

Nothing. This is an answer to a question, not a proposal. **No map size is changed, no
cut is implied, and `gates/mapsize_gate.js` is the CITY lane's gate — this lane did not
touch it.**

---

## RE-MEASURED 8/7/26 — THE MAP GREW AND NOBODY RE-COUNTED

The breakdown above was measured on 8/3. On 8/7 `tools/bohemia_canon_measure.js` counted it
again off the live overmap at the canon seed, and it had moved:

| | 8/3 measured | 8/7 re-measured | |
|---|---|---|---|
| total valley | 84.9 km² | **84.93 km²** | unchanged (rounding only) |
| BUILT | 37.0 km² | **38.35 km²** | **+1.35, the city grew** |
| roads | 32.9 km² | 31.69 km² | −1.21 |
| bare desert | 5.7 km² | 6.05 km² | +0.35 |
| rock / water | 9.3 km² | 8.85 km² | −0.45 |
| walkable ON FOOT | 75.7 km² | **76.09 km²** | +0.39 |

Nothing broke: a dozen districts landed between those two dates and built area is *supposed*
to move when the city is built. **What was wrong is that nothing re-counted it**, so the
number every other lane read stayed frozen at 8/3 while the world moved underneath it — and
`canon_constants_gate.js`, the machine whose whole job is catching exactly this, stayed green
because its engine sweep matched on variable NAMES and the engine names none of these.

The definitions are unchanged and are now written down in the tool rather than only in this
prose: BUILT is everything that is not road, not bare desert, and not rock or water; ON FOOT
is the total minus rock and water. Those sets live in
`tools/bohemia_canon_measure.js` (`ROAD_TYPES` / `ROCKWATER_TYPES` / `BARE_TYPES`) so the
next re-measurement uses the same definition instead of a fresh guess.

**The comparisons in this document are unaffected.** 76.09 km² on foot against Skyrim's
~37.1 and New Vegas's ~16.5 is the same story 75.7 told. The point of re-measuring was never
the headline, it was that the registry had drifted and the gate could not see it.
