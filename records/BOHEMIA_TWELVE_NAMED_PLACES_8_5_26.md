# TWELVE NAMED PLACES THAT WEREN'T THERE
**8/5/26. WORLD lane. FLAT DEBT 12 types / 29 cells → 0. One factory, twelve districts,
twelve icons. Machines: `valley_census_gate.js`, `walkable_gate.js`, `icon_gate.js`,
`tilespec_gate.js`.**

> "Think outside the box. WE HAVE 11 months of forward motion work we need to complete.
> Do what you have to do next and know what comes after, do big brain online research if
> you need to then execute." — Paolo, 8/5/26

---

## THE CENSUS SAID WHAT WAS NEXT, SO I BUILT IT

The 8/5 valley census found twelve places the overmap **sites on purpose** — with real Vegas
geography behind every one — that generated **bare ground**: a quarry, a gypsum works, a
tank farm, a reservoir, a pump station, the Lake Mead intake, a granary, an arsenal, a data
fort, the flood detention basins, the reclamation ponds, a radio mast. Twenty-nine cells of
the valley that had a name and nothing standing on them.

**All twelve are built. The flat-debt ratchet is empty.**

## OUTSIDE THE BOX WAS: DON'T WRITE TWELVE FILES

Twelve hand-written district modules is exactly what the **FACTORY LAW** forbids — *"every
system is a mass-production factory: typed spec, generator, batch output, kill/approve
pipeline, and its OWN regression gate."*

So `engine/bohemia_utility.js` is **NINE LAYOUT PRIMITIVES, TWELVE TYPED SPECS, one
generator, one legend machine.** Every landmark uses the same fourteen codes and its spec
says what each one *means* on that ground:

> `6` is THE HERO MASS — a rock bench at the quarry, a storage tank at the depot, a
> concrete silo at the granary, an earth-covered magazine at the arsenal, the data hall at
> the fort, the side slope at the basin.

**The thirteenth utility landmark is a spec, not a file.** That is the whole point.

## THE TWELVE, AND WHAT EACH IS RECOGNISED BY

| | its signature | grounded in |
|---|---|---|
| **quarry** | the only landmark in the valley that goes **DOWN** — nested benches stepping to a floor with water in the bottom, and the plant standing beside the hole | Sloan limestone quarry: the quarry sits on top of Sloan Mountain with the processing plant below it. Modern quarries work a BENCH system. |
| **gypsum** | **THE DOME.** A real hemisphere, and there is no other hemisphere anywhere in this valley | PABCO Blue Diamond: 4,000 acres of mine + processing + board plant, a mobile conveyor straight from quarry into the mill, and a monolithic storage dome |
| **fueldepot** | circles **inside squares** — six tanks each in its own concrete containment dike | Calnev pipeline terminus. Reinforced concrete dikes are the default for a permanent bulk plant; ~4 million gallons of local storage |
| **reservoir** | two tanks **narrow and tall** on a bench cut into the hill, the opposite proportion to the tank farm | LVVWD: 84 reservoirs holding nearly a billion gallons, sited UPGRADIENT of customers so gravity builds the pressure |
| **pumpstation** | pipe drawn at the diameter it actually is, under a surge tank standing above the hydraulic grade line | LVVWD: 55 stations moving a million gallons a minute; the mains are 66-inch steel lined with concrete mortar |
| **intake** | a tower standing in water with **the bathtub ring** on the rock above it | the one object in this valley that states how far the lake has dropped without any text on it |
| **granary** | a comb of cylinders with the headhouse **sitting ON them**, not beside | the bucket elevator has to lift to the very top and everything below is gravity — nothing else stacks that way |
| **arsenal** | humped earth-covered magazines with a concrete headwall on **one end only**, set far apart | quantity-distance separation and earth traverses, so one going up doesn't take the next with it. The spacing is the design. |
| **datafort** | one enormous box with **no window anywhere in it** | Switch SUPERNAP: 400,000 sq ft per hall, SwitchSHIELD's two roof decks nine feet apart rated to 200 mph with no roof penetrations, cooling units lining the exterior face |
| **basin** | a squared hole with **a notch bitten through one wall** | Clark County RFCD: 10–50 acres, up to 50 feet deep, holding to 51.5 ft before the emergency spillway. 100 basins, 650 miles of channel, $1.9 billion since 1991. |
| **reclaim** | **rectangles in a grid** — deliberately the opposite of watertreat, which is all circles | the valley has one outlet, the Las Vegas Wash, so the outfall channel leaves east toward Lake Mead |
| **radio** | mostly air: guyed masts with their anchors set far out, and the emptiness IS the recognition | the Black Mountain antenna farm above Henderson carries ten towers on the ridge |

## THE HOUSE BUG, TWICE MORE, AND BOTH AT THE ROOT

**A VALUE PASSED BY HAND WHERE A VALUE COULD BE DERIVED** — sightings seven and eight,
both found by shipping into them:

- **`tools/bohemia_tilespec.js` kept its own copy of the district list.** Twelve landmarks
  shipped with no dossier because nobody remembered to add twelve lines. It sweeps the kit
  registry now — the registry is what every other consumer already reads.
- **`tools/bohemia_district_grid_dump.js` kept a THIRD copy, keyed on `bohemia_<name>.js`.**
  That one is worse than stale: it *structurally cannot* see a type whose file is not named
  after it, and all twelve live in one factory file. **The file name was standing in for the
  type.** It sweeps the registry too.

Both are fixed at the root, so the thirteenth landmark needs no edit to either.

## FIVE MORE BUGS, EACH CAUGHT BY A MACHINE AND NOT BY ME

- **Draw order, again.** The reservoir's buried basins painted over its valve house, and a
  site with no code 2 has no building, no footprint, no interior and no door. (Same shape as
  the solar masts the service aisles erased.) Basins first, house on top.
- **The basin's maintenance ramp did not arrive.** It went down the slope and stopped;
  `driveReachFromStreet` read 0.59. A ramp into a bowl that never reaches the gate is a ramp
  no machine ever used.
- **Reservoir and granary were thin** — 22% content, which is the fire-station failure the
  WALKABLE-LAND law was written for. Both got what their real sites actually have (buried
  reservoir basins with roof slabs and hatches; the flat storage shed, annex battery and rail
  loop) and came up to 40% and 36%.
- **The gypsum calciner stack was standing inside the dome.** A 0.9-wide mass rising through
  a 5.2 m hemisphere is a modelling error, and the slab check named it.
- **The intake's trash-rack bands were drawn proud of the tower**, so the tower read as
  passing through three slabs. A trash rack sits in the opening, not hooped round the outside.

## AND ONE I CAUSED IN A GATE BY EXISTING

`art_45_gate` samples `heroes[0]` as the bank's representative form. Registering the twelve
at the front of `HEROES` made **the quarry — a hole — stand in for the whole corpus**, and it
has no diamond top and no lit right face because it is negative space. The twelve are
appended **last** now; that slot belongs to the 85%-approved cityhall.

## THE ONE GATE STILL RED, AND WHY I STOPPED AT ONE PASS

**`squint_gate`.** Twelve new icons took the below-bar count from 5 pairs to **19**, and four
of the twelve were outright twins — `fueldepot/wash` at **0.8% different**.

One pass, every fix making the icon **truer to its subject**:

| | what changed | why it is the real drawing |
|---|---|---|
| fueldepot | tanks 2.6 → 4.4 tall, wind girders, spiral stair | a bulk tank is 40–50 feet; it TOWERS over its dike. I had drawn the dike dominating. |
| arsenal | mound and headwall raised by two thirds | an igloo magazine is ~12–15 ft of earth over a 26 ft arch — a hump you read instantly, not the pad I drew |
| quarry | pit pushed off-centre, plant and screen tower up to 13 m beside it | Sloan IS quarry-above/plant-below. Asymmetric, not concentric — which is what stopped it reading as a clarifier drum. |
| pumpstation | surge tank 5.6 → 10.4 | a surge vessel must stand above the hydraulic grade line of the main it protects |

**19 → 11 pairs. Worst pair 0.8% → 3.1%. `quarry/watertreat` and `pumpstation/wash` gone.**

**Then I stopped, and the reason is STOP PRODUCING (7/26):** *"writing a fourth version of
anything means you already failed."* This was pass one on new art. Pass two starts being
about the neighbours instead of the subject, which is the trade I put to him on 8/4 and which
is still unanswered: **59 silhouettes, 128 cells, a 7-cell minimum distance is close to what
the medium holds.** Going further means making the arsenal not look like an arsenal so it
stops looking like the rail corridor. That is his call.

## AND THEN THE MACHINES FOUND SIX MORE, WHICH IS WHY THEY EXIST

Everything above was found before the suite ran. The suite then found six more, and every
one was a real defect rather than a gate being fussy:

- **`drive_network`: nine of the twelve laid road a car could not reach.** A haul ramp
  spiralling into a pit, a plant road, a maintenance ramp — each correct in itself and each
  landing a tile short of the lane that reaches the curb. Two root causes, and both were the
  house bug: the connect pass ran **six** passes (a number I picked, where *loop until
  nothing is stranded* was the answer), and the haul ramp was drawn **one tile wide**, which
  for a spiral of rounded points is only *diagonally* connected — not connected at all to a
  car. A haul road is two tiles wide because a rock truck is four metres across.
- **PAINT IS ON THE GROUND YOU DRIVE ON.** The kit counts `marking` as drive surface, on
  purpose, so a stall stripe never strands a car behind its own paint. I then used code 11
  for things **stencilled on vertical structures** — a magazine number on a headwall,
  elevation marks on an outlet box, trash racks on an intake tower. They belong to the
  structure they are painted on. The gate was right; the tiles were mislabelled.
- **`answered_for`: ten of the twelve let one ground code own 30%+ of the plot.** The
  WALKABLE-LAND spirit clause wearing a number. Fixed with what these sites actually have —
  windrows of their own material, the tracked lane the plant drove for years, what has blown
  against the fence in a decade — and again the count is **derived**: lay material until the
  biggest single code is under the bar, then stop.
- **`answered_for`: fifty-one legend lines were stubs.** Its bar is *"a sentence that could
  only be about this thing"*, and every failure was a code from the **shared vocabulary**
  where I wrote one generic line and let the factory stamp it twelve times. **That is the
  cost of a shared vocabulary and it is paid per site** — a fence at an arsenal and a fence
  at a pond field are not the same fence. All fifty-one rewritten.
- **`hue`: five of the twelve read MONOCHROME.** Not a style, mud. Three of my "water"
  colours sat *just under* the saturation floor, so the gate was right that a grey puddle is
  not a colour. Each replacement is what the real thing actually is: sulfate-saturated pit
  water goes genuinely turquoise, industrial glycol is **dyed** so a leak is visible, and
  dry-weather flow in a Vegas channel is algae. Two of them were also drawn **where they
  cannot be seen** — under the cooling units, down inside the bowl — which is not drawn.
- **THE ONE I DID TO ANOTHER LANE.** I regenerated `BOHEMIA_RUN_CURRENT.html`, a shared
  built artefact other lanes patch directly, and **thirty gates went red at once** — rooms,
  people, city cast, light, nav, art tab. Reverting it to main's bytes turned every one of
  them green. The built slice is not mine to rebuild; the **template** is, so the module tag
  is added there and whoever rebuilds it next gets a page that loads.

**Both `answered_for` ratchets SHRANK on the way through: monoblock debt 36 → 31, stub
write-ups 75 → 60.** The twelve came in cleaner than the baseline they joined.

**Final state: the same ten reds the tree opened the day with** — nine inherited from other
lanes and re-proven on a detached checkout, plus `squint` left red on purpose.

---

*Filed under the TRUTH HIERARCHY: on any conflict the newest date wins.*
