# BOHEMIA DISTRICT REGISTRY (7/18/26)

The complete catalog of every procedural district/landmark type. GENERATED from the engine (tools/bohemia_district_registry.py) — the render status is read live from bohemia_overmap_bridge.js, so this file can never drift from the code. Regenerate the same turn any district is added; gates/district_registry_gate.js fails if a type in the enum is missing here.

## THE COUNT
- **77** district types defined + placed on the 96x96 overmap.
- **9 BAKES**: has a render recipe that bakes to pixels today (street / freeway / desert / mountain families).
- **8 RECIPE**: engine grid recipe exists, art pool / bake not built yet (wash, solar, farm, airfield).
- **60 PENDING**: placed on the map, but the fine-layer template is [PENDING Paolo] (MECHANISM-MINE / CONTENTS-PAOLO’S). These render as their desert lot until a ruling + art land.

RENDER STATUS LEGEND: **BAKES** = you can see it in a slice now · **RECIPE** = generates a grid, needs art to bake · **PENDING** = reserved for Paolo’s ruling, no recipe yet.

## BAKES — rendered to pixels today (9)

| type | status | recipe | what it is |
|---|---|---|---|
| `mountain` | BAKES | mountain | The valley rim ranges (E+W borders, Paolo cardinal). Impassable rock. |
| `desert` | BAKES | desert | Raw Mojave ground: the default lot before anything is built on it. |
| `strip` | BAKES | street | Las Vegas Blvd — the N-S resort corridor, mega-casinos strung along it. |
| `downtown` | BAKES | street | Fremont / arts-district core at the Strip’s north end; dense urban grid. |
| `commercial` | BAKES | street | Strip-mall commercial: parking apron fronting a storefront band. |
| `freeway` | BAKES | freeway | The "X": I-15 + US-95/515, grade-separated, breaks the grid. |
| `arterial` | BAKES | street | The mile-grid surface streets — the connective tissue of the city. |
| `beltway` | BAKES | freeway | The "C": the 215 ring road hugging the valley rim. |
| `casino` | BAKES | street | An off-Strip casino block (locals casinos). |

## RECIPE — grid exists, art pending (8)

| type | status | recipe | what it is |
|---|---|---|---|
| `suburb` | RECIPE | residential | A walled residential tract — the bulk fabric of the valley. |
| `solar` | RECIPE | solar | The NORTH solar panel field (Paolo cardinal); real: valley solar. |
| `wash` | RECIPE | wash | Dry flood channel; the entrance to the storm/sewer world below. |
| `airport` | RECIPE | airfield | Harry Reid Intl — runways + terminals (SE of the Strip). |
| `airbase` | RECIPE | airfield | Nellis AFB — military airfield, NE valley. |
| `gated` | RECIPE | residential | A gated master-planned community (walled, few entries). |
| `trailer` | RECIPE | residential | A trailer / RV park (rough-fabric housing). |
| `farm` | RECIPE | farm | Homestead farming — yard crops on private well/cistern. |

## PENDING PAOLO — placed, fine-layer reserved (60)

| type | status | recipe | what it is |
|---|---|---|---|
| `resort` | PENDING | — | A mega-resort block flanking the Strip (rooms + casino floor mass). |
| `mall` | PENDING | — | An enclosed shopping mall (big-box footprint, ring parking). |
| `industrial` | PENDING | — | Warehouse / light-industry flats (Sunrise, N Las Vegas belts). |
| `dam` | PENDING | — | Hoover Dam — the SOUTH landmark, the way to Lake Mead. |
| `water` | PENDING | — | Lake Mead / Lake Las Vegas surface water. |
| `park` | PENDING | — | A public park / greenspace lot. |
| `campus` | PENDING | — | A university campus (UNLV / CSN). |
| `rail` | PENDING | — | The rail line, border to border (freight spine). |
| `railyard` | PENDING | — | Rail marshalling yard — tracks, container flats. |
| `town` | PENDING | — | Boulder City — a self-contained town with its own street grid. |
| `medical` | PENDING | — | A hospital / medical district (Sunrise, UMC). |
| `interchange` | PENDING | — | The Spaghetti Bowl — the I-15/US-95 stack interchange. |
| `golf` | PENDING | — | A golf course (large green plot, ringed by streets). |
| `school` | PENDING | — | A K-12 school campus. |
| `stadium` | PENDING | — | Allegiant Stadium — the domed football stadium. |
| `speedway` | PENDING | — | Las Vegas Motor Speedway — the oval track, far NE. |
| `convention` | PENDING | — | The LVCC convention center complex (halls + the Loop stop). |
| `waterpark` | PENDING | — | A water park (pools, slides, big footprint). |
| `minigp` | PENDING | — | A karting / mini-GP track. |
| `estate` | PENDING | — | Foothill estates — large-lot housing on the mountain borders. |
| `reclaim` | PENDING | — | The water reclamation plant (the 99% reuse loop terminus). |
| `landfill` | PENDING | — | The regional landfill (Apex). |
| `intake` | PENDING | — | The Lake Mead intake — "the straw" claiming the shoreline. |
| `substation` | PENDING | — | An electrical substation (grid node). |
| `cemetery` | PENDING | — | A cemetery / memorial ground. |
| `prison` | PENDING | — | A walled correctional facility. |
| `terminal` | PENDING | — | A bus / freight terminal. |
| `sphere` | PENDING | — | The Sphere — the spherical venue, a fixed landmark. |
| `boneyard` | PENDING | — | The Neon Boneyard — dead sign graveyard. |
| `chapel` | PENDING | — | A wedding chapel (the small-lot Vegas fixture). |
| `fort` | PENDING | — | Old Mormon Fort — the founding adobe site. |
| `basin` | PENDING | — | A flood-detention basin (ties into the storm system). |
| `ballpark` | PENDING | — | A ballpark (Cashman / Las Vegas Ballpark). |
| `swapmeet` | PENDING | — | A swap meet / open-air market lot. |
| `drivein` | PENDING | — | A drive-in theater lot. |
| `highroller` | PENDING | — | The High Roller observation wheel. |
| `storage` | PENDING | — | Self-storage sprawl (near arterials). |
| `watertreat` | PENDING | — | A water treatment plant. |
| `reservoir` | PENDING | — | A covered water reservoir tank field. |
| `pumpstation` | PENDING | — | A water pumping station. |
| `sign` | PENDING | — | The "Welcome to Fabulous Las Vegas" sign parcel. |
| `strat` | PENDING | — | The Stratosphere tower. |
| `datafort` | PENDING | — | The Data Fortress — the fiber-fed data center (born of Enron fiber). |
| `arsenal` | PENDING | — | The Arsenal — a fortified munitions/armory site. [Bohemia lore: PENDING Paolo] |
| `firestation` | PENDING | — | A fire station. |
| `policestation` | PENDING | — | A police station. |
| `jail` | PENDING | — | The city/county jail (holding, distinct from prison). |
| `courthouse` | PENDING | — | A courthouse / civic justice building. |
| `warehouse` | PENDING | — | A distribution warehouse (big shed + docks). |
| `truckstop` | PENDING | — | A highway truck stop (fuel + lot) on an approach. |
| `battery` | PENDING | — | A grid-scale battery storage yard. |
| `quarry` | PENDING | — | A rock quarry carving the approach hills. |
| `gypsum` | PENDING | — | The gypsum mine carving the rim (real: Blue Diamond). |
| `springs` | PENDING | — | The Springs Preserve — the valley’s original water source. |
| `luxor` | PENDING | — | The Luxor pyramid — a fixed Strip landmark. |
| `fueldepot` | PENDING | — | A fuel tank-farm depot. |
| `granary` | PENDING | — | A grain silo / granary. |
| `library` | PENDING | — | A public library branch. |
| `radio` | PENDING | — | A radio / broadcast station + antenna. |
| `robofactory` | PENDING | — | A robotics factory. [Bohemia lore: PENDING Paolo] |

## PLOT INTERIORS (engine/bohemia_plotgen.js)

Three plot kinds have interior layouts (all with buildings still EMPTY by design, awaiting building art): **suburb** (walled tract + gates), **commercial** (parking fronting storefronts), **industrial** (drive apron + shed pads + fence). The plotgen bridge routes: industrial/warehouse/railyard/storage → industrial; commercial/casino/mall/downtown/strip → commercial; everything else → suburb.

## WHERE THE DEEPER CANON LIVES
- laws/BOHEMIA_ADDENDUM_VEGAS_GEOGRAPHY_7_4_26.md — the landmark lore + placement rationale (the richest source).
- laws/BOHEMIA_ADDENDUM_CELL_IS_PLOT_WALLED_SUBURBS_7_14_26.md — cell = plot, wall to wall.
- laws/BOHEMIA_ADDENDUM_DISTRICT_MERGE_LAW_7_14_26.md — same-type cells merge up to 2x2.
- engine/bohemia_overmap.js (skeleton + proceduralDistrict) — the live placement rules.

## STILL OWED PAOLO (the honest gap)
The 60 PENDING types need, per type, your ruling on what they ARE in Bohemia (who owns them, what spawns there) and then art. `arsenal` and `robofactory` carry game-specific lore that is entirely your call. Everything above the PENDING line already generates.
