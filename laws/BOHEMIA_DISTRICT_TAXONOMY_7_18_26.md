# BOHEMIA DISTRICT TAXONOMY (7/18/26)

Paolo: "if I'm gonna let you loose... you have to be able to categorize things nicely."
Every one of the 77 district types files into exactly ONE top-level CATEGORY. Grounded in
real land-use zoning (residential / commercial / industrial / institutional / recreational
/ transportation) plus the two Vegas needs zoning doesn't have: GAMING & RESORT (the
tourism economy) and TERRAIN (raw land). Source of truth is CODE — engine/bohemia_district_kit.js
TAXONOMY — so it can never drift; gates/district_taxonomy_gate.js fails if any type is
uncategorized. Paolo DECIDES final buckets; move any type by editing the kit + regenerating.

## THE 8 CATEGORIES
1. **RESIDENTIAL** — where people live.
2. **COMMERCIAL** — retail, trade, business, lodging-for-trade.
3. **INDUSTRIAL** — production, logistics, salvage, storage of goods. (The distribution
   center / warehouse is here.)
4. **GAMING & RESORT** — the Vegas tourism/gaming economy + the Strip icons. BESPOKE:
   these get individual hand-crafted love (Paolo 7/18), NOT the auto-factory. They stay
   landmark placeholders until built by hand, one at a time.
5. **CIVIC** — government, safety, health, education, worship, death, public assembly.
6. **LEISURE** — parks, sports venues, recreation.
7. **INFRASTRUCTURE** — transport, power, water, comms, extraction, agriculture (the systems).
8. **TERRAIN** — the raw land itself, not built.

## THE FILING (77 types, machine-gated)
- **RESIDENTIAL (5):** suburb, gated, estate, town, trailer
- **COMMERCIAL (5):** commercial, mall, downtown, swapmeet, truckstop
- **INDUSTRIAL (9):** industrial, warehouse, storage, railyard, robofactory, granary, boneyard, arsenal, fueldepot
- **GAMING & RESORT (9):** strip, resort, casino, highroller, sphere, luxor, strat, sign, springs
- **CIVIC (13):** medical, school, campus, library, courthouse, firestation, policestation, jail, prison, chapel, cemetery, convention, fort
- **LEISURE (8):** park, golf, stadium, ballpark, speedway, minigp, waterpark, drivein
- **INFRASTRUCTURE (24):** freeway, arterial, beltway, interchange, rail, terminal, airport, airbase, dam, solar, substation, watertreat, reservoir, pumpstation, intake, basin, battery, datafort, radio, reclaim, landfill, gypsum, quarry, farm
- **TERRAIN (4):** mountain, desert, wash, water

## WHY IT MATTERS (for letting me loose)
The category is the FILE. When I build a district autonomously it inherits its category's
rules: the generator KIT it uses, the palette family, the interior zone, the act-state
behavior, and where it's allowed to sit on the map. world().plot() now returns `.category`
so anything downstream (life, economy, combat cover, the city-builder) can reason by
category instead of memorizing 77 types. Build a district = pick its category, extend the
kit, register it. Nothing floats uncategorized.

## FLAGGED FOR PAOLO (judgment calls I made, easy to move)
- `convention` -> civic (public assembly). Could be commercial.
- `truckstop` -> commercial (retail/fuel/food). Could be infrastructure.
- `fort` -> civic (institutional/military). Could be gaming_resort if it's a themed casino.
- `springs` -> gaming_resort (spa/resort). Could be leisure or terrain if it's raw hot springs.
- `boneyard`/`granary`/`arsenal`/`fueldepot` -> industrial (storage). Some could be infrastructure.
- `farm` -> infrastructure (agriculture, per real zoning's 7th type). Could be its own AGRICULTURAL bucket if you want 9 categories.
Say the word on any and I move it (one edit + the gate re-verifies).
