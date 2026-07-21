# BOHEMIA DISTRICT REGISTRY (7/18/26)

The complete catalog of every procedural district/landmark type. GENERATED from the engine (tools/bohemia_district_registry.py) — the render status is read live from bohemia_overmap_bridge.js, so this file can never drift from the code. Regenerate the same turn any district is added; gates/district_registry_gate.js fails if a type in the enum is missing here.

## THE COUNT
- **78** district types defined + placed on the 96x96 overmap.
- **10 BAKES**: has a render recipe that bakes to pixels today (street / freeway / desert / mountain families).
- **68 RECIPE**: generates a plot grid procedurally, art pool / bake not built yet. Includes the built-lot archetypes (civic / bigbox / institutional / industrial / utility / landmark / green / water / rail / extraction) that render every landmark type.
- **0 PENDING**: no recipe at all. (Paolo 7/18/26 ruled the landmarks are PROCEDURALLY GENERATED, not hand-authored, so this should be zero.)

PAOLO 7/18/26: "those can be randomly generated throughout the map... this is a procedural generated world game." Every district now generates from a build archetype — see the `recipe` column (`builtlot/<archetype>`). None wait on a per-type ruling.

RENDER STATUS LEGEND: **BAKES** = you can see it in a slice now · **RECIPE** = generates a plot grid, needs art pool to bake · **PENDING** = no recipe (should be none).

## BAKES — rendered to pixels today (10)

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
| `interchange` | BAKES | freeway | The Spaghetti Bowl — the I-15/US-95 stack interchange. |
| `casino` | BAKES | street | An off-Strip casino block (locals casinos). |

## RECIPE — generates a plot grid procedurally, art pending (68)

| type | status | recipe | what it is |
|---|---|---|---|
| `resort` | RECIPE | builtlot/bigbox | A mega-resort block flanking the Strip (rooms + casino floor mass). |
| `mall` | RECIPE | builtlot/bigbox | An enclosed shopping mall (big-box footprint, ring parking). |
| `suburb` | RECIPE | residential | A walled residential tract — the bulk fabric of the valley. |
| `industrial` | RECIPE | builtlot/industrial | Warehouse / light-industry flats (Sunrise, N Las Vegas belts). |
| `dam` | RECIPE | builtlot/landmark | Hoover Dam — the SOUTH landmark, the way to Lake Mead. |
| `solar` | RECIPE | solar | The NORTH solar panel field (Paolo cardinal); real: valley solar. |
| `wash` | RECIPE | wash | Dry flood channel; the entrance to the storm/sewer world below. |
| `water` | RECIPE | builtlot/water | Lake Mead / Lake Las Vegas surface water. |
| `park` | RECIPE | builtlot/green | A public park / greenspace lot. |
| `airport` | RECIPE | airfield | Harry Reid Intl — runways + terminals (SE of the Strip). |
| `airbase` | RECIPE | airfield | Nellis AFB — military airfield, NE valley. |
| `campus` | RECIPE | builtlot/institutional | A university campus (UNLV / CSN). |
| `rail` | RECIPE | builtlot/rail | The rail line, border to border (freight spine). |
| `railyard` | RECIPE | builtlot/industrial | Rail marshalling yard — tracks, container flats. |
| `town` | RECIPE | builtlot/civic | Boulder City — a self-contained town with its own street grid. |
| `medical` | RECIPE | builtlot/institutional | A hospital / medical district (Sunrise, UMC). |
| `golf` | RECIPE | builtlot/green | A golf course (large green plot, ringed by streets). |
| `gated` | RECIPE | residential | A gated master-planned community (walled, few entries). |
| `school` | RECIPE | builtlot/institutional | A K-12 school campus. |
| `stadium` | RECIPE | builtlot/landmark | Allegiant Stadium — the domed football stadium. |
| `speedway` | RECIPE | builtlot/landmark | Las Vegas Motor Speedway — the oval track, far NE. |
| `convention` | RECIPE | builtlot/bigbox | The LVCC convention center complex (halls + the Loop stop). |
| `waterpark` | RECIPE | builtlot/green | A water park (pools, slides, big footprint). |
| `minigp` | RECIPE | builtlot/green | A karting / mini-GP track. |
| `estate` | RECIPE | residential | Foothill estates — large-lot housing on the mountain borders. |
| `reclaim` | RECIPE | builtlot/utility | The water reclamation plant (the 99% reuse loop terminus). |
| `landfill` | RECIPE | builtlot/utility | The regional landfill (Apex). |
| `intake` | RECIPE | builtlot/utility | The Lake Mead intake — "the straw" claiming the shoreline. |
| `substation` | RECIPE | builtlot/utility | An electrical substation (grid node). |
| `cemetery` | RECIPE | builtlot/green | A cemetery / memorial ground. |
| `prison` | RECIPE | builtlot/institutional | A walled correctional facility. |
| `terminal` | RECIPE | builtlot/civic | A bus / freight terminal. |
| `sphere` | RECIPE | builtlot/landmark | The Sphere — the spherical venue, a fixed landmark. |
| `boneyard` | RECIPE | builtlot/landmark | The Neon Boneyard — dead sign graveyard. |
| `chapel` | RECIPE | builtlot/civic | A wedding chapel (the small-lot Vegas fixture). |
| `fort` | RECIPE | builtlot/landmark | Old Mormon Fort — the founding adobe site. |
| `basin` | RECIPE | builtlot/utility | A flood-detention basin (ties into the storm system). |
| `ballpark` | RECIPE | builtlot/landmark | A ballpark (Cashman / Las Vegas Ballpark). |
| `swapmeet` | RECIPE | builtlot/bigbox | A swap meet / open-air market lot. |
| `drivein` | RECIPE | builtlot/green | A drive-in theater lot. |
| `highroller` | RECIPE | builtlot/landmark | The High Roller observation wheel. |
| `trailer` | RECIPE | residential | A trailer / RV park (rough-fabric housing). |
| `storage` | RECIPE | builtlot/industrial | Self-storage sprawl (near arterials). |
| `watertreat` | RECIPE | builtlot/utility | A water treatment plant. |
| `reservoir` | RECIPE | builtlot/utility | A covered water reservoir tank field. |
| `pumpstation` | RECIPE | builtlot/utility | A water pumping station. |
| `farm` | RECIPE | farm | Homestead farming — yard crops on private well/cistern. |
| `sign` | RECIPE | builtlot/landmark | The "Welcome to Fabulous Las Vegas" sign parcel. |
| `strat` | RECIPE | builtlot/landmark | The Stratosphere tower. |
| `datafort` | RECIPE | builtlot/utility | The Data Fortress — the fiber-fed data center (born of Enron fiber). |
| `arsenal` | RECIPE | builtlot/utility | The Arsenal — a fortified munitions/armory site. [Bohemia lore: PENDING Paolo] |
| `firestation` | RECIPE | builtlot/civic | A fire station. |
| `policestation` | RECIPE | builtlot/civic | A police station. |
| `jail` | RECIPE | builtlot/institutional | The city/county jail (holding, distinct from prison). |
| `courthouse` | RECIPE | builtlot/civic | A courthouse / civic justice building. |
| `warehouse` | RECIPE | builtlot/industrial | A distribution warehouse (big shed + docks). |
| `truckstop` | RECIPE | builtlot/civic | A highway truck stop (fuel + lot) on an approach. |
| `battery` | RECIPE | builtlot/utility | A grid-scale battery storage yard. |
| `quarry` | RECIPE | builtlot/extraction | A rock quarry carving the approach hills. |
| `gypsum` | RECIPE | builtlot/extraction | The gypsum mine carving the rim (real: Blue Diamond). |
| `springs` | RECIPE | builtlot/landmark | The Springs Preserve — the valley’s original water source. |
| `luxor` | RECIPE | builtlot/landmark | The Luxor pyramid — a fixed Strip landmark. |
| `fueldepot` | RECIPE | builtlot/utility | A fuel tank-farm depot. |
| `granary` | RECIPE | builtlot/utility | A grain silo / granary. |
| `library` | RECIPE | builtlot/civic | A public library branch. |
| `radio` | RECIPE | builtlot/utility | A radio / broadcast station + antenna. |
| `robofactory` | RECIPE | builtlot/landmark | A robotics factory. [Bohemia lore: PENDING Paolo] |
| `apartment` | RECIPE | builtlot/civic | A garden apartment complex (Sun Belt low-rise multifamily, exterior breezeway stairs). |

## PLOT INTERIORS (engine/bohemia_plotgen.js)

Three plot kinds have interior layouts (all with buildings still EMPTY by design, awaiting building art): **suburb** (walled tract + gates), **commercial** (parking fronting storefronts), **industrial** (drive apron + shed pads + fence). The plotgen bridge routes: industrial/warehouse/railyard/storage → industrial; commercial/casino/mall/downtown/strip → commercial; everything else → suburb.

## WHERE THE DEEPER CANON LIVES
- laws/BOHEMIA_ADDENDUM_VEGAS_GEOGRAPHY_7_4_26.md — the landmark lore + placement rationale (the richest source).
- laws/BOHEMIA_ADDENDUM_CELL_IS_PLOT_WALLED_SUBURBS_7_14_26.md — cell = plot, wall to wall.
- laws/BOHEMIA_ADDENDUM_DISTRICT_MERGE_LAW_7_14_26.md — same-type cells merge up to 2x2.
- engine/bohemia_overmap.js (skeleton + proceduralDistrict) — the live placement rules.

## STILL OWED (the honest gap)
Not per-type rulings anymore — every type generates. What is owed is ART POOLS for the built-lot archetypes (building / roof / signage / yard-prop sprites), the same bake-art step every recipe waits on. When those land, the RECIPE rows flip to BAKES. Genuinely reserved lore (the Amalgamation, purple, faction ownership) is untouched by this and stays Paolo’s call.
