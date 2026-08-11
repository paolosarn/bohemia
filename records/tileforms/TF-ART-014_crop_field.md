# TILE FORM TF-ART-014 — CROP FIELD (THE DEAD FURROWED FIELD AND ITS IRRIGATION)

## A. IDENTITY
- NAME: Crop field — the dead furrowed field, its irrigation berms and ditches, and the hard edge where it stops against raw desert
- FAMILY/SET: CROP FIELD family — (1) furrowed dead field, phase-locked; (2) irrigation berm (border-check levee) crossing the furrows; (3) dry irrigation ditch, earthen and concrete-lined; (4) field edge against desert (the hard line); (5) bare graded plot, disked flat and never planted again; (6) pivot track arc, the gravel-filled wheel rut. ONE coherent drawing job — one ground material seen in five states.
- THE JOB, ONE SENTENCE: this family exists so that the ~5,200 grid cells the farm district's own gate demands be crop field stop being an undifferentiated brown nothing, because on this district the FIELD is not the background — it IS the content, and WALKABLE-LAND is measured on it.

## B. WHY
- DEMANDED BY: gates/farm_gate.js asserts the anatomy numerically — `t[4]>4000` (field soil) and `t[7]>1200` (crop rows) and `t[8]>200` (irrigation) on every one of its six street configs, and then asserts `ls.contentPct >= ls.drivePct` under the WALKABLE-LAND LAW. That is over five thousand cells of one material carrying the district's entire content claim. engine/bohemia_farm.js NOTES calls the fields "the hero — they dominate the land". Also Paolo's bulk farm verdict, verbatim: **"this is nevada nevada is in a dessert so"** — the correction that produced TF-WORLD-014. That form buys the MACHINE (the pivot span, its towers, the dead alfalfa circle). Nothing has ever bought the DIRT.
- WHAT LOOKS BROKEN TODAY: the biggest single surface in the farm district renders as one flat legend colour (`#57503a` for field soil, `#6a6238` for crop rows) — two mud browns eleven points of luminance apart. At any zoom the fields read as an empty brown rectangle with a red barn parked on it, which is exactly the failure WALKABLE-LAND was written to kill (the fire-station v1, 8% building and 52% empty apron) arriving from the other direction: the plot is 90% "content" that looks like void. M14 says any two adjacent layers separate by 18 points of luminance; field-soil against crop-row is 11 and neither separates from the desert at the margin.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md walked in full, every row.
  - DESERT/TERRAIN — 13 terrain picks in banks/BOHEMIA_TERRAIN_PICKS_7_14_26.txt plus the pools in banks/BOHEMIA_DESERT_POOLS_7_18_26.txt. **This is the closest near-miss and it is the one that must be refused loudest.** It is ground that was NEVER cultivated. Undisturbed Mojave surface carries a cyanobacterial soil crust that binds the fines and a desert pavement of interlocking clasts; a thirty-year-abandoned irrigated field is the precise inverse of both — the crust was destroyed by the plough and cyanobacterial crust recovery in this desert runs decades to a century or more, and soil physical recovery in an abandoned Mojave site was still incomplete after 51 years. So the field is PALER, LOOSER, FLATTER and DEADER than the desert twenty feet away, permanently. Drawing the field with desert tiles does not just look wrong, it deletes the district: 5,200 cells of "content" that read identical to the setback margin outside the fence.
  - STARTER TILESET (42, CBB, md5-locked, banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt) — one residential street. Its `yard_0/1/2` is a dead gravel residential yard: small, enclosed, walked-on, no relief and no direction. A field is a made agricultural surface with a grain, and grain is the entire read.
  - records/tileforms/TF-ART-005_dead_sports_turf.md (my own lane, already filed) — dead sports turf is a MAT: pale thatch lying over sand, killed uniformly by one irrigation system. A dead field is BARE SOIL WITH RELIEF. Opposite surface, opposite death, and the difference is exactly the thing that makes a farm read as a farm rather than as a park.
  - records/tileforms/TF-RUN-002_gravel_ballast_ground.md — a graded engineered aggregate bed. A field is not a gravel bed; the caliche chips a plough turns up are a scatter of a handful per cell, not a surface.
  - records/tileforms/TF-WORLD-014_centre_pivot.md — the same district, the adjacent job, deliberately NOT overlapping. That form buys the pivot span, the towers, the pivot point and the circular dead alfalfa. **This form buys the ground it stands in**, including the wheel-track arc it grinds into that ground. Boundary stated so neither lane cooks the other's pixels.
  - HD PACK UP list (BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt, 1,927 UP) — no agricultural family anywhere in it. INTERIOR POOL is interiors. SEAM-FIXED SURFACES is the seam audit set, not a material.
  Nothing in the index claims cultivated ground.

## C. WHERE
- SURFACE + TAB: RUN (you walk the furrows) + CITY (human mode) + MAP — at map zoom a rectilinear grain and a hard-edged block against desert is one of the few instantly legible non-building silhouettes in the valley, and the pivot arc is a circle in a city of right angles
- DISTRICT FAMILIES: farm (all of it), the granary landmark cell, any agricultural margin, and the desert fringe where a field was cleared and abandoned before it was ever planted
- LAYER: ground
- SOLID? no — ENTERABLE? no (the berm is knee-high, you step over it; the ditch is a dip, not a hole)
- MUST SIT BESIDE: itself in every direction with the furrow phase carried across the seam; the irrigation berm and the dry ditch that split one field block from the next; desert ground at the hard outer edge; the packed-dirt farmyard where the field stops and the farmstead begins; the dirt farm road; the fence line and its downwind tumbleweed pack; the pivot arc crossing everything
- NEVER BESIDE: never a paved surface without a headland or an apron between (a field never runs straight into asphalt — there is always a turn strip where the equipment came about); never a sidewalk or kerb (there are no sidewalks on a farm); never a residential lawn or dead sports turf (three different deaths, and mixing them makes all three meaningless); never green anything
- EDGE CONTRACT: SELF-SEAMLESS for the field surface, with a DECLARED FURROW PHASE so the ridge lines run unbroken across tiles for the whole length of a field block; the field-against-desert boundary is a WANG-16 edge set so the hard line turns corners honestly; the berm crossing, the ditch bottom and the pivot track arc are SINGLE PLACEMENT. Every seamless edge gets the offset test (M10) — measured wrap delta against the tile's own internal step, no edge darkening, and specifically no furrow doubling or dropping at the wrap, because a repeating grain is the most unforgiving thing in the game to tile.

## D. WHEN
- ACT: 1
- BEST TIME: both. Nothing here self-lights and nothing ever will — LIGHT=TERRITORY, and nobody owns a field. At night this is the darkest large surface anywhere in the valley, and that is a feature: the farm is where the light stops.
- WEATHER STATES: sunny baseline; cloudy wash flattens the furrow relief and is the state where the field is most at risk of reading as mud, so the cook must check it. RAIN IS THE IMPORTANT ONE AND IT INVERTS THE TILE: the only places water can go are the furrow troughs, the ditch bottom and the wheel ruts, so rain darkens the LOW ground first while the ridges stay pale — the exact opposite of the dry state, where the low ground is the PALEST part of the field because that is where the salt sits. Under M9 that inversion is a palette swap, not a second tileset.
- LIT/UNLIT: no variant. Nobody lights a field.
- ANIMATION: static. If drifting dust across the field is ever wanted it is a palette cycle (M16), never a frame set, and it is a renderer job, not this form's.

## E. HOW
- EXACT SIZE: the 44 px corpus cell, CELL_M 0.75 m, so **1 px = 1.70 cm** and every number below is derived from that. Field, berm, ditch bottom, edge and track are all one cell each; a field block is hundreds of them.
- VIEW: 45-degree world view (law). The field is a ground plane so it has no face — but the BERM, the DITCH BANK and the RUT are cross-sections and they are drawn as such: a berm is a bowed band whose top is sky-lit and whose lower-right flank is shaded, a ditch is a bowed trough, never a pair of flat parallel lines. That is where this family can fail the 45-degree law and it is the only place it can.
- PALETTE: constitution ceiling; GROUND value band, and by M14 it must sit at least 18 luminance points off the structure band (the barn, the silos, the farmhouse) that stands in it. Family ramp of 5–7 hue-shifted steps of dead straw / drab ochre / grey-brown, cooler in the troughs, warmer on the sunlit ridge crowns — deliberately a DIFFERENT ramp from the desert (greyer, darker, pebblier) and from dead lawn and dead sports turf. Plus a separate 2–3 step PALE CALCIUM accent for salt crust and turned caliche, which is the only high-value note this family is allowed to spend (M3: contrast is a budget, and the barn is the district's hero, not the dirt).
- LIGHT: the one global direction, upper LEFT. NO keyline. NO dither. **The direction the furrows run is an art-direction decision, not a detail:** furrows running roughly NE–SW catch the key on their upper-left flanks and read strongly; furrows running parallel to the light axis nearly vanish. Pick the grain that reads and hold it for the whole district.
- SHADOWS: none baked (separate-layer law). Expected runtime footprint: the berm throws a low shadow a few px long into the field on its lower-right; the fence throws a thin one; the pivot span's long shadow across the field belongs to TF-WORLD-014.
- SCALE ANCHORS, all measured, this is how the detail gets sized:
  - **A standard row-crop furrow is spaced 30 inches = 76 cm. One 44 px cell is 75 cm. So the furrow pitch IS the cell: one ridge and one trough exactly fill one tile.** That single fact fixes the whole family and it is why this material can be self-seamless at all.
  - A row-crop furrow is 8–10 cm deep and ~25 cm wide at the top, so the ridge-to-trough relief is a **5–6 px value step across a ~15 px trough** — a shading step, never a drawn line. Deep-cut furrows reach 20–25 cm, which is 12–15 px, and that is the maximum this family is ever allowed.
  - A border-check irrigation levee (the berm) stands 6–20 inches, so **9 to 30 px of vertical relief**, confining borders 10–200 ft (4 to 80 cells) wide. Knee-high on a 1.75 m human (2.3 cells tall); a car (2x3 tiles = 1.5 x 2.25 m) drives over it.
  - Aluminium gated pipe is 6–12 inch bore = **9–18 px diameter**; ditch turnouts sit every 20–80 ft = every 8 to 32 cells.
  - A caliche cobble the plough turned up is 5–15 cm = **3 to 9 px**. That is the size of a light speck on this surface. Anything bigger is a rock, not wear.
  - Field slope is 0.1–0.2%, i.e. visually dead flat. The relief in this tile is furrow relief and nothing else.
- WEAR LEVEL — thirty Mojave summers, no water, no maintenance, and every mark answers "what did this?" (M1):
  - **THE FURROWS ARE STILL THERE, AND THAT IS THE WHOLE HORROR.** Radar work on abandoned circular alfalfa fields in the Mojave's Manix Basin tracks planting rows fading only slowly as surface processes obliterate them; native vegetation may not return to a desert field for 200–300 years and soil physical recovery runs on the order of a century. At year thirty the grain is a GHOST: relief flattened to roughly a third of its cut depth, unmistakable at distance, nearly lost underfoot. Draw it soft, not erased.
  - **WIND STRIPS THE FINES AND THE FIELD ARMOURS ITSELF.** Undisturbed Mojave soil sheds almost no sediment, but disturbed soil sheds a lot. Thirty years of that leaves the coarse fraction lying on top — a proto-desert-pavement of pale caliche chips, concentrated in the troughs where the wind cannot get at them and the runoff drops them. Motivated, clustered, irregular (M11), never scattered evenly.
  - **CALICHE IS THE LAS VEGAS SOIL FACT.** The valley's aridisols carry calcium-carbonate hardpan — white to grey to reddish-brown, hit at around 18 inches in places, sometimes cemented feet thick and hard enough to need ripping or hammering like rock. The plough layer is 20–25 cm, so a Vegas field was cut right down onto the caliche and turned white rock up into its own topsoil. **A dead field in this valley is speckled with white.** Nowhere else in the game gets this.
  - **SALT PUTS THE PALE IN THE LOW GROUND.** This was flood-irrigated land; when the water stops, evaporation and capillary rise leave a visible white crust at the surface, worst in the low spots — the tail ends of the borders, the ditch bottom, the wheel ruts. Counter-intuitive and it must survive the cook: the troughs go LIGHTER than the ridges when dry.
  - **RUSSIAN THISTLE OWNS IT.** Salsola tragus is the specialist coloniser of loose disturbed soil with no competition, so the field grows dead thistle skeletons and nothing else, and the wind packs them against the fence line and the windbreak row — Nevada and Utah saw drifts to three metres in 2024. The downwind fence is a packed grey wall of it; the upwind fence is bare. Directional, not decorative.
  - **THE HARDWARE GOES DIFFERENT WAYS.** Galvanised steel survives the desert almost indefinitely (TF-WORLD-014's point). Aluminium gated pipe survives but goes chalky grey-white oxide, flattened and dragged out of line. PVC yellows, then browns, then chalks and turns brittle and flakes — bare porous pipe went brittle in six months of Arizona sun. Concrete ditch lining cracks at the joints first, the cracks widen, panel edges lift, and the ditch silts full from the ends inward.
  - **THE FENCE LINE IS WHERE THE FIELD DIES LAST**: the fence caught the blowing fines for thirty years, so there is a raised drift on the windward side and scour on the lee — the field is not flat at its own boundary.
- VARIANTS: field-furrowed x3 (LAW 12: high-traffic tiles get 2–5 — plain, wind-scoured bald patch, stubble-clump/last-windrow), bare graded plot (disked flat, no grain, the fallow block), berm crossing, ditch bottom earthen + silted, ditch bottom concrete-lined + cracked, field/desert hard edge as a WANG-16 set, pivot track arc. Colourways beyond that only (STRUCTURE-NOT-COLOR).
- ENGINE NOTE THE COOK MUST RESOLVE IN ONE SHOT: engine/bohemia_farm.js lays code-7 "crop rows" every 3 cells (`for(y=y0+1;y<y1;y+=3)`), i.e. a 2.25 m pitch — too wide for a 30-inch furrow and far too narrow for a border check. Resolution: the FURROW GRAIN is universal and lives in the code-4 field tile itself, one furrow per cell, phase-locked; code-7 becomes the STUBBLE ROW variant riding on top of that grain every third cell. No engine change needed and the two legend codes finally mean two different things.

## F. THE CAPTION
```json
{
  "id": "TF-ART-014",
  "name": "crop field",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": [
    "farm",
    "granary",
    "agricultural margin",
    "cleared desert fringe"
  ],
  "best_time": "both",
  "best_location": "the large field blocks of the farm district, split by irrigation berms and dry ditches, ending in a hard edge against raw desert",
  "place_next_to": [
    "crop field",
    "irrigation berm",
    "dry irrigation ditch",
    "desert ground (hard edge)",
    "farmyard",
    "farm road",
    "farm fence",
    "pivot track arc",
    "windbreak tree line"
  ],
  "never_next_to": [
    "asphalt without a headland",
    "sidewalk or kerb",
    "residential lawn",
    "dead sports turf",
    "living green crop"
  ],
  "weather_ok": [
    "sunny",
    "cloudy",
    "rain"
  ],
  "acts": [
    1
  ],
  "edge_contract": "SELF-SEAMLESS field surface with a declared furrow phase; the field-against-desert boundary is a WANG-16 edge set; berm, ditch bottom and pivot track arc are SINGLE PLACEMENT",
  "anim": null,
  "tags": [
    "ground",
    "agriculture",
    "nevada",
    "dead",
    "quiet",
    "directional-grain",
    "caliche",
    "salt"
  ]
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/BOHEMIA_TERRAIN_PICKS_7_14_26.txt and banks/BOHEMIA_DESERT_POOLS_7_18_26.txt — not as the material but as the thing the field must sit AGAINST, because the contrast across that boundary is literally the asset; and banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt (the CBB frozen 42) for where the ground value band lives and how quiet a large surface is allowed to be in this world.
- NAMED OUTSIDE REFERENCE: **Andrew Wyeth, "Christina's World", 1948, egg tempera on panel, MoMA.** Specifically: roughly two thirds of that panel is a dead tawny field and it carries the entire painting on about four values of ochre, grey and brown — the DIRECTION of the combed dead grass does all the work and there is no local detail anywhere in it. That is exactly M2 (the floor is quiet), M18 (value skeleton first, hue last) and M13 (the majority of a scene is deliberately subordinate) in one image, and it is the single best proof that an enormous dead field can be the most memorable thing in a frame while being the least detailed. Secondary, for the mechanic rather than the mood: **Stardew Valley's tilled-soil autotile** — one ridge/trough pair per cell and a two-value step and nothing else, and the tilled plot reads as a plot entirely because its EDGE is crisp against untilled ground, not because its interior is busy. That is our WANG-16 field edge, already solved by somebody else.
- REAL-WORLD GROUNDING: Clark County agriculture is alfalfa hay, and it is flood- and border-check-irrigated, not row-cropped — the real farm belt is Moapa Valley (Logandale and Overton) on the Muddy River, where settlers cut over 18 miles of canals from 1865 to grow alfalfa, grain, cotton and orchards, and where alfalfa is still the crop. In the Las Vegas Valley itself the honest named location is **Tule Springs Ranch in the north valley — a working cattle ranch and alfalfa farm from 1941 to 1959, closed in the late fifties, public land by 1964, on the National Register since 1981, and today Floyd Lamb Park at Tule Springs.** A Las Vegas alfalfa farm that actually died and whose fields actually reverted is not a hypothetical here; it is a place you can stand in. What thirty years does to it, concretely: the plough cut down onto the valley's calcium-carbonate caliche hardpan and turned white rock up into the topsoil, so the surface is speckled pale; the wind stripped the fines off the disturbed plough layer and left that coarse caliche fraction lying on top as a proto-pavement in the troughs; evaporation pulled irrigation salts up into a visible white crust in the low ground; the cyanobacterial soil crust that binds undisturbed Mojave ground never came back, because that recovery takes decades to a century, so the field stays paler, looser and flatter than the desert on the other side of the fence; the furrow grain itself is still legible at distance because planting rows in abandoned Mojave fields fade only slowly and native vegetation may not return for 200 to 300 years; Russian thistle took the bare disturbed soil and the wind packed it against the downwind fence; the aluminium gated pipe went chalky and got dragged out of line; the concrete ditch lining cracked at its joints, lifted at the panel edges and silted full.

## H. DON'T WANT
- **NOT GREEN.** Act 1 has no living plants. This is the single most likely error on an agricultural tile and it is a lore error, not a taste one.
- **NOT midwest corduroy.** The furrow is a 5–6 px VALUE STEP, never an outlined stripe. Drawing every furrow as a dark line is Slynyrd's exact warning ("avoid depicting every single brick... avoid emphasizing the outlines") and it is our own measured 74%-orphan disaster wearing a farmer's hat.
- **NOT perfectly even.** A metronome stripe every 44 px moirés under the phone's 2x/3x integer blit and hard-banners the tile grid — that is the M10 heavy-border failure and the 7/26 black-grid incident arriving by a new road. Phase-lock the direction, then vary the break, the kink and the stubble clumping (M11: irregular clustering, never even spacing).
- **NOT dark low ground when dry.** Instinct shades the trough darker. The real field puts the SALT and the caliche chips in the trough, so it goes lighter. Getting this backwards is the tell that the tile was invented rather than researched.
- **NOT desert.** If the field tile and the terrain tile read the same, the farm district has no content and the WALKABLE-LAND claim its gate makes on 5,200 cells becomes a lie.
- **NOT a gravel bed.** Caliche chips are 3–9 px and a handful per cell, clustered in troughs. A carpet of them is TF-RUN-002 and a different material.
- **NOT a flat side-on scroller face** (45 DEGREE ART LAW) — the berm, the ditch bank and the rut are bowed cross-sections with sky-lit tops, never two parallel lines.
- **NOT busier than the barn** (M2 the floor is quiet, M13 the majority is subordinate, M3 contrast is a budget). Ground must measure quieter than structure. If the dirt out-details the faded red barn, the district loses its landmark and the hero becomes mud.
- **NOT dithered** (act-1 ban, and stipple crawls under integer scaling on a phone). **NO keyline.**
- **NOT the pivot machine.** The span, the towers and the pivot point are records/tileforms/TF-WORLD-014_centre_pivot.md. This form draws only the ground and the wheel rut. Two lanes must not cook the same pixels.
- **NOT a tidy field.** No crisp headlands, no swept edges, no plough pattern that looks like it was finished last season. It was abandoned mid-cycle and then left alone for thirty years.

## I. ACCEPTANCE
- [ ] Seam measured (edge contract in C): offset test on the self-seamless field —
      wrap delta within the tile's own internal step, no edge darkening (the
      desert-pool lesson), and the furrow phase continuous across the wrap with
      no doubled or dropped ridge
- [ ] WANG-16 field/desert edge set complete and the inner corners built FIRST,
      not last (M12)
- [ ] Pixel craft gate green: orphan share, single-use colours, block size 1,
      pillow score, cluster density, set-wide palette
      (laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md)
- [ ] M2 measured: this ground family is QUIETER (clusters/1000px) than the farm's
      structure families; M14 measured: >=18 luminance points off the barn/silo band
- [ ] Palette ceiling + ground value band + one-light (upper-left) checks green
- [ ] Squint test at map zoom: the field block reads as a field, and the pivot arc
      reads as a circle
- [ ] 3x3 TILED PROOF SHEET rendered — and a LONG RUN proof besides, because a
      directional grain only fails at length; never judged as a lone tile
- [ ] ON THE REAL SURFACE: screenshot in the farm district, beside the current
      flat-brown render for contrast and beside the desert anchor named in G
- [ ] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: APPROVED 8/11/26 AND WIRED 8/11/26: the farm's named ground draws the family (field soil -> fallow plots, crop rows -> furrow fields one style per plot, irrigation -> silted earth ditches), live in the RUN tab. The edge WANG set, berms, concrete ditch runs and the dirt track are the named volume. | REQUESTED BY: ART lane (own queue, breaking down board row 7)
  | DATE: 7/29/26 | PRIORITY: HIGH
- BOARD ROW #: 23 | VERDICT: —
