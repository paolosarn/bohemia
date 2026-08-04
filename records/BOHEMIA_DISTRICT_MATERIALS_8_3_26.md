# WHAT THE REST OF THE VALLEY IS BUILT OUT OF (8/3/26)

The suburb block is finished. This is the map that dresses the other fifty-four
district types, and it is a MATERIAL decision, not a decoration one.

---

## THE PROBLEM IT SOLVES

Earlier today his purchased ground reached all 55 district types (it had been on 3).
Their BUILDINGS were still flat starter tile: the warehouse on the left of
`records/target/VALLEY_INDUSTRIAL.png` was a blank tan slab.

The art already existed and **he already approved it on 8/1** — tilt-up concrete,
corrugated metal, rusted steel, painted brick, civic ashlar, storefront aluminium and
mobile home siding were all inside the ninety texture-match tiles he passed.

**But it could not simply be ungated, and that is the whole design problem.** The house
pool is fifteen stucco and block skins. Turning it loose on the valley puts a bungalow's
butter-yellow stucco on a distribution warehouse and a casino. A material is not
decoration. It says what a building IS, and getting it wrong is a lie about the world
that no amount of texture density fixes.

---

## THE TWO FACTS THIS IS BUILT ON

**TILT-UP CONCRETE IS THE DEFAULT COMMERCIAL AND INDUSTRIAL EXTERIOR HERE.** Panels are
cast flat on the slab beside the building and craned upright. It is the standard skin
for warehouses, strip retail and light industrial, and it has spread to offices,
schools, churches and theatres — over 15% of all US industrial building is tilt-up, and
it is everywhere in this valley. A 576,000 sq ft manufacturing and warehouse complex on
north Las Vegas Boulevard is tilt-up with a flat roof, which is the type specimen.

**STUCCO / EIFS IS THE SOUTHWESTERN COMMERCIAL FINISH.** Cement plaster over frame or
block, and the preferred exterior for commercial buildings across the southwest.

Sources at the bottom.

## AND THE ROOFS ARE FLAT

This is the correctness point that matters most, and the one a lazy ungating would have
got wrong in a way nobody would have noticed for weeks.

A commercial or industrial building in Las Vegas has a **FLAT tar-and-gravel roof**.
Barrel tile and asphalt shingle are HOUSE roofs. A terracotta pitched roof on a
distribution warehouse is not a style choice, it is a lie about the building — and the
texture-match bank contains both kinds side by side, so the mistake was one careless
line away. The civic roof pool is `gravel_roof` and `tar_paper` and nothing else.

---

## THE MAP

Every entry is a list of MATERIALS. A whole building picks one and holds it; the
colourways shuffle per cell underneath so nothing stamps at 44px pitch (the 8/2 bug).

| what it is | districts | materials |
|---|---|---|
| heavy industry, storage, utilities | industrial, warehouse, storage, railyard, granary, arsenal, battery, substation, reclaim, landfill, airbase, fort | tilt-up concrete, corrugated metal, rusted steel |
| farm | farm | corrugated metal, weathered wood, rusted steel |
| retail | commercial, mall, swapmeet | tilt-up shells with aluminium storefront across the front, painted brick, bone stucco |
| civic and institutional | downtown, courthouse, library, policestation, jail, school, campus, medical, chapel | cut-stone ashlar, painted brick, running-bond brick, storefront |
| the show | casino, strip, resort, convention, highroller, sphere, strat, minigp, speedway, ballpark, waterpark, radio | storefront aluminium, civic stone, tilt-up. Big blank masses with glazing, never domestic materials |
| people still live here | apartment | tan / bone / ochre / desert-rose stucco. In Vegas apartments really are stucco, so the house pool is CORRECT here and nowhere else |
| trailer park | trailer | mobile home ribbed siding, corrugated metal |
| anything unlisted | DEFAULT | tilt-up concrete, grey CMU, painted CMU |

**THE DEFAULT IS DELIBERATE.** An unremarkable building in this valley is tilt-up or
block, and it is never a house. A default that fell back to the house pool would quietly
scatter bungalow stucco across every district nobody had got round to mapping yet, and
it would look fine in a screenshot.

---

## MEASURED, BEFORE AND AFTER

Sweeping a grid across a cell of each type and counting real `drawImage` calls.

| district | HIS BOUGHT | CIVIC BUILDINGS | OLD FLAT SET |
|---|---|---|---|
| SUBURB (finished) | 2108 | 552 | 769 |
| DOWNTOWN | 1815 | 1065 | **0** (was 2880) |
| THE STRIP | 2880 | 0 | **0** (was 2880) |
| COMMERCIAL | 2120 | 748 | 6 (was 2936) |
| INDUSTRIAL | 1804 | 1076 | **0** (was 3084) |
| MALL | 1933 | 947 | **0** (was 2912) |
| PARK | 2708 | 172 | **0** (was 2885) |
| TRAILER | 2158 | 722 | 16 (was 2939) |
| APARTMENT | 2247 | 609 | 10 (was 2964) |
| MEDICAL | 1503 | 1375 | **0** (was 2986) |
| CASINO | 2880 | 0 | **0** (was 2880) |
| SCHOOL | 2034 | 846 | **0** (was 2908) |

The Strip and the casino show zero civic buildings because those particular cells are
apron and lot with no building mass in the sampled area, not because the map missed
them. Their ground went to 100% his art.

Shots: `records/target/VALLEY_INDUSTRIAL.png` (the warehouse is corrugated metal now,
not a tan slab), `_DOWNTOWN.png` (brick), `_STRIP.png`.

---

## WHAT THIS FOUND THAT IS SOMEBODY ELSE'S

Downtown has **single asphalt cells stranded in the middle of a concrete plaza** (visible
as two dark squares in `VALLEY_DOWNTOWN.png`). They were always there; they only became
visible now that his real asphalt draws instead of a flat pale starter tile. That is the
same class of thing he complained about on 7/27 — "i dont know why theres so many
sidewalk cement things spread around on the floor when it should be like wtf" — and it
is a WORLD generator matter, not an art one. Filed, not fixed here.

---

## STILL NOT DRESSED

Only the wall FIELD and the roof are mapped. Non-suburb buildings have no openings
(windows, doors, bay shutters), no eave shadow and no corner treatment — the suburb got
all three and the rest of the valley has none. That is the next art job after this one,
and it is a bigger one, because a warehouse door is not a house door.

---

## SOURCES
- CCPIA, commercial building exteriors: concrete tilt-up panels — https://ccpia.org/commercial-building-exteriors-concrete-tilt-up-panels/
- Pacific Premier Construction, tilt-up construction — https://pacificpremierconstruction.com/tilt-up-construction/
- LM Construction Co, concrete tilt-up construction — https://www.lmconstructionco.com/concrete-tilt-up-construction
- Breslin Builders, Las Vegas self-storage / warehouse / industrial projects — https://breslinbuilders.com/projects/project-industrial/
- Las Vegas Stucco, commercial stucco services — https://www.lasvegasstucco.net/commercial-stucco-services/
- Palisade Engineering, tilt-up warehouse — https://www.pe-se.com/portfolio/tilt-up-warehouse
