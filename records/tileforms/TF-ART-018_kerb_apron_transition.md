# TILE FORM TF-ART-018 — KERB + DRIVEWAY APRON TRANSITIONS (the corners, drops, flares, inlets and crossings the kerb has never had)

## A. IDENTITY
- NAME: The places where the kerb stops being a straight line — the corner it
  turns, the dip a car drives over, the flare that carries the dip up to the
  sidewalk, the hole the water goes down, and the ramp where the crossing lands
- FAMILY/SET: STREET EDGE TRANSITION KIT — five members, one continuous
  concrete object, one drawing job:
    M1 KERB RETURN — the corner arc where two streets meet
    M2 DROPPED KERB — the depressed kerb across a car entrance
    M3 APRON FLARE — the concrete wing from the dropped kerb back up to walk grade
    M4 GUTTER INLET — the local depression, the kerb throat, the grate
    M5 KERB-MEETS-CROSSING — the ramp, its flares, the detectable-warning pad,
       and the junction where the crossing paint dies into the gutter pan
  SCOPE CAVEAT, so the member list and section B cannot be read as disagreeing:
  M2 and M3 are DRAWN HERE ONLY IF this form keeps them. Section B proposes
  handing M2 and M3 to TF-CITY-006 and B's own words are the standing proposal,
  not a decision. Until that ownership call is made, the guaranteed deliverable
  of this form is M1, M4 and M5; M2 and M3 are specified in full here so that
  whichever form cooks them is cooking to the same arithmetic and the same
  concrete. [PENDING — the coordinator call named in section B.]
- THE JOB, ONE SENTENCE: this family exists so that the kerb — the single most
  repeated object in the valley and the one line separating every plot from
  every road — can actually turn a corner, let a car in, take water, and meet a
  crossing, instead of running dead straight past all four events.

## B. WHY
- DEMANDED BY: BOHEMIA_TILE_REQUESTS row 15 (ACT-1 TILESET REMAINDER, ART lane's
  own queue) — the row names "curb/sidewalk transitions" in its own words, so
  this form is the row, not an extrapolation of it. (The ART block header on the
  board and the sibling TF-ART forms all cite "row 7" for this; row 7 is the
  CHARACTER CONTACT SHADOW and that citation is wrong across the lane. Corrected
  here; the siblings are owed the same one-word fix.) Broken down by the ART
  lane's own surface walk. Three standing laws
  land on this exact object and none of them can be satisfied today.
  SIDEWALK SANCTITY (CLAUDE.md) needs a visible edge and an edge that only ever
  goes straight is not a city edge, it is a wallpaper stripe. The STREET-AWARE /
  DRIVABLE ACCESS LAW (7/19) says "ONE car entrance on the primary street" and
  "a car reaches EVERY stall from the curb" — the kerb is the line the law makes
  a car cross and there is no art anywhere in the game for crossing it. The
  LANDLOCKED DISTRICT LAW (7/21) makes a same-family neighbour relay its road
  "all the way out to a real street", so relayed access produces MORE kerb
  junctions, not fewer.
- WHAT LOOKS BROKEN TODAY: measured, not guessed. I decoded the frozen CBB
  starter set (banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt, md5-locked, 42
  tiles) and looked at the two tiles this whole form is about.
    `walk_kerb` ("the sidewalk tile that has the kerb lip on its road edge") is
    byte-for-byte `walk_0` for rows 0-38 and differs ONLY in its last five rows:
    row means 176 / 179 / 174 / 173 / 59. That is a 4-px lit cap and a ONE-PIXEL
    dark face. Today's kerb is not a kerb, it is a bright line with a single
    dark pixel under it, and its cap is the brightest SUSTAINED ground row in
    the frozen set (row mean 176 against a ground band mean of 103.7). Stated
    exactly, because the difference decides what gets checked later: 176 is a
    ROW MEAN, not a peak. The cap's own brightest pixel is 190, and single
    brighter pixels do exist elsewhere on the walk (walk_2 peaks at 237,
    concrete_1 at 233) — but no other ground tile holds a value that high
    across a whole row, and that unbroken row is what reads as a kerb.
    `road_gutter` is byte-for-byte `road_0` except for its first NINE rows,
    which ramp 43 -> 61 and hand off to the road's own 67.5 at row nine: a
    nine-pixel shadow gradient baked into the tile. So
    the frozen set already breaks the separate-shadow convention on this one
    tile, and anything cooked to sit beside it must mate to that nine-row ramp
    or the shadow will stop dead at the seam.
    `road_crossing` measures 110 mean against `road_0` at 65 — the crossing tile
    is mostly white paint. So at a corner the player would see road 65 -> paint
    110 -> kerb cap 176 in three cells, the brightest junction in the game,
    with no piece of art in between that explains any of it.
  Net: every street edge in the valley is two straight-run tiles and a butt
  joint. Corners do not turn, cars cannot get in, water goes nowhere, and the
  crossing hits the kerb like a wall.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md walked in
  full, and the near-misses opened, not just named.
    banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt — THE CLOSEST NEAR-MISS and
    the reason this form exists. It is the only approved TILE set, it is
    md5-locked CBB, and it genuinely ships the kerb: `walk_kerb`, `road_gutter`,
    `road_crossing`, `walk_0/1/2`, `road_0/1/2`, `concrete_0/1`. Every one of
    them is a STRAIGHT FIELD tile for a single residential street. Decoded and
    measured above: `walk_kerb` carries a 1-px face and no corner, no drop, no
    flare, no throat, no ramp. It cannot be rotated into a corner (the lit cap
    is baked on one edge and the light is fixed upper-left, so a rotation lights
    the kerb from the wrong side). It is the ANCHOR, not the answer.
    banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt — the 7/28 re-cook of
    the same 42 ids. Same ids, same straight runs, better craft numbers. Adds no
    member of this family. Named for completeness, NOT as an index entry: it is
    not listed in the 7/27 approved index because it postdates it by a day, so
    it is a file on disk that was opened and measured, not an approved asset.
    banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt (STREET BLOCKS, 5
    researched lanes, REAL_VEGAS R2, CITY-wired) — carriageway lanes. Stops at
    the kerb line by construction; contains no kerb face, no return, no throat.
    banks/BOHEMIA_MARKING_BANK_7_17_26.txt (ROAD MARKINGS, 84 items, 14 classes,
    "I like all of them") — disqualified for a real reason, not a vibe: it is
    PAINT and every member of this family is GEOMETRY. A painted arc is not a
    kerb return. The bank's zero-consumer status is a separate routing debt.
    banks/BOHEMIA_SEAM_FIXED_SURFACES_7_14_26.txt — a seam audit of surfaces
    that already exist. It fixes edges between field tiles; it does not add a
    piece that changes direction.
    banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt — a freestanding site wall. A
    wall is not a kerb, and where a wall meets a kerb is a THIRD object neither
    form owns.
  Nothing in the index claims a kerb that turns, drops, drains or ramps.
  AND THE COLLISION, DECLARED UP FRONT rather than discovered mid-cook — two
  other lanes filed overlapping forms the same day and the board's own
  COLLISIONS block is the precedent for naming this instead of quietly
  duplicating:
    records/tileforms/TF-WORLD-002_kerb_sidewalk.md (row 31) lists "corner
    return, driveway apron dip, storm-drain inlet" inside its VARIANTS line. It
    is the FIELD form: sidewalk plane, straight kerb-and-gutter run, kerb stub,
    landscape strip. It should keep all four of those and drop the three
    transition variants.
    records/tileforms/TF-CITY-006_driveway_apron_curb_cut.md (row 65) is the
    better and more specific form on M2 and M3, including the rolled-versus-
    vertical ruling from Clark County's own standard. It should keep them.
  So the split that costs the least drawing: TF-WORLD-002 owns the straight
  field, TF-CITY-006 owns the driveway cut and apron, and TF-ART-018 owns the
  corner, the inlet, the crossing junction, and — the thing none of the three
  had — the MEASURED ARITHMETIC and the shared geometry rules all five members
  must obey so they cook as one object. Cook them in one batch or the same kerb
  will exist in three materials.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode). At MAP zoom it is not
  read as its own thing, but the corner is what makes a block read as a block.
- DISTRICT FAMILIES: all — every district that fronts a street, which under the
  street-aware law is every district that is not landlocked. Suburb, commercial,
  industrial, storage, school, fire station, police, park, trailer, farm, town,
  arterial and freeway frontage. The desert cell gets the kerb-stub case (the
  subdivision that was platted, kerbed and never built, which is Las Vegas's own
  true story) via TF-WORLD-002, not this form.
- LAYER: ground
  (the kerb face has real height but it is a floor edge, never a wall; it is
  drawn on the ground plane and the runtime shadow pass does the rest)
- SOLID? no — ENTERABLE? no (the inlet throat is a hole, but at act-1 body scale
  it is a dark slot you walk past, not a way in; the tunnels are their own canon)
- MUST SIT BESIDE: `walk_kerb` and `walk_0/1/2` where the sidewalk carries on;
  `road_gutter` on the street side, mated to its nine-row shadow ramp;
  `road_0/1/2` beyond the pan; `concrete_0/1` on the driveway and ramp landing;
  `road_crossing` on the crossing approach only; the dead lawn, gravel yard and
  desert ground behind the walk.
- NEVER BESIDE: a second kerb facing it with no carriageway between (the tell of
  a fake street, TF-WORLD-002's rule and it holds here); a perimeter wall
  standing on the kerb line with no setback (a car cannot drive through a wall —
  that junction is the GATE, TF-CITY-005); `road_crossing` on the same cell as a
  vehicle apron (a real-world conflict as well as a visual one); a building
  footprint touching the kerb face directly with no walk between it.
- EDGE CONTRACT: WANG-16 edge set. The family is a linear object with corners,
  so a blob-47 is overkill and a single placement is impossible. Two clauses the
  other two forms do not carry: (1) the corner arc is authored as a FIXED
  multi-cell block whose four outer cells still hash to the Wang edge codes, so
  it drops into the same set rather than becoming a second vocabulary; (2) every
  edge that touches `road_gutter` must reproduce that tile's nine-row 43->61
  shadow ramp at the same phase, or the corner will show a shadow that stops
  dead mid-arc. Every touching edge gets MEASURED — interior-vs-edge value delta
  and wrap discontinuity against the normal neighbour step (M10, the offset
  test, and the desert-pool lesson).

## D. WHEN
- ACT: 1
- BEST TIME: both. Unlit at night by default — nobody owns light over a street
  corner in a dead valley (LIGHT=TERRITORY). Where a district IS owned and lit,
  the kerb cap is the brightest sustained ground row in the frozen set
  (measured row mean 176, peak pixel 190) and is
  therefore what makes a lit district read as lit; the transition pieces must
  hold that same cap value or the corner will go dark while the straight run
  glows.
- WEATHER STATES: sunny baseline. Cloudy needs nothing. RAIN-WET matters here
  more than anywhere else in the game, because this family IS the drainage: the
  gutter pan darkens and saturates first, the inlet throat goes near-black, the
  local depression holds a puddle, and the dropped kerb is where the sheet flow
  crosses the walk. Value shift only, no new geometry, and per M9 the wet state
  is a PALETTE, not a second family.
- LIT/UNLIT variant needed? No self-light. No member of this family emits.
- ANIMATION: static. (Named for later, not asked for here: under M16 the wet
  gutter and the inlet are the natural first colour-cycle in the game — water
  moving through a fixed shape. That needs indexing first and it is a renderer
  job, so this form ships static and does not pre-empt it.)

## E. HOW
- EXACT SIZE: 44 px cell (THE CORPUS CELL), matching the frozen set exactly.
  Footprints per member: M1 corner arc = a fixed 3x3 cell block (3 cells per
  leg); M2 dropped kerb = 3 cells along the kerb; M3 apron flare = 1 cell each
  side, mirrored; M4 gutter inlet = 2 cells along the kerb plus 1 cell of pan;
  M5 kerb-meets-crossing = 2 cells wide (the crossing width) plus 1 flare cell
  each side.
  THE ARITHMETIC, done once here so nobody guesses. CELL_M 0.75 m over 44 px
  makes ONE PIXEL 1.705 cm (0.671 in):
    kerb face, 6 in vertical (Clark County Std Dwg 216 "L" type) = 152 mm = 8.9 px
    gutter pan, 24 in = 610 mm = 36 px, so the pan is 0.8 of a cell wide
    kerb top lit edge = 1-2 px, never more
    detectable-warning dome base, 0.9-1.4 in = 23-36 mm = 1.3-2.1 px
    dome centre-to-centre, 1.6-2.4 in = 41-61 mm = 2.4-3.6 px
    dome pad depth, 24 in = 610 mm = 36 px = 0.8 of a cell
    kerb return radius, 25 ft standard = 7.62 m = 10.2 CELLS
    minimum return radius, 15 ft = 4.57 m = 6.1 cells
    kerb inlet throat, 4-10 ft typical = 1.2-3.0 m = 1.6-4.0 cells
    residential drive at the kerb, 16-20 ft = 4.9-6.1 m = 6.5-8.1 cells (metric)
    commercial two-way drive, 32 ft minimum (Std Dwg 222.1) = 9.75 m = 13 cells
  AND THE SCALE RULE THAT FALLS OUT OF IT, because two of those numbers fight
  the house facts and a cook that splits the difference will be wrong twice:
  SUB-TILE DETAIL IS SIZED IN METRES (kerb face, dome pitch, pan width — these
  are all under one cell and the metric read is honest). MULTI-TILE FOOTPRINTS
  ARE SIZED TO THE GAME BODY (a door is 2 cells, a car is 2x3 tiles). So the
  apron mouth is THREE cells — the game car's 2 cells plus half a cell of shy
  each side — not the 6.5 cells the metre says. That is why TF-CITY-006's
  "2-3 tiles wide" is right by the game body and wrong by the metre, and this
  form supplies the reason so the cook does not average them.
  THE CORNER, SAME PROBLEM, STATED NOT DISCOVERED: a true 25-ft return is 10.2
  cells of arc — over a single 44 px tile that curve is almost a straight line,
  and a "quarter circle" drawn inside one cell is a roundabout, not a kerb. So
  the corner ships as a 3-cell-per-leg quarter arc (effective radius 2.25 m /
  7.4 ft) and the arterial version is the SAME edge pieces run to 6 cells per
  leg (4.5 m / 14.8 ft, landing on the real 15-ft minimum). That is a deliberate
  stylisation under LAW 11, UNIFORMITY BEATS REALISM, and it buys two radii for
  one drawing instead of two.
- VIEW: 45-degree world view (45 DEGREE ART LAW). The ground plane reads flat,
  but this family is entirely about height changing across it: the kerb face is
  a real vertical that goes 8.9 px -> 0 across the drop, and that ramp IS the
  object. The corner's outer face turns away from the light through the arc and
  must get darker doing it — that turn is what proves the corner is geometry and
  not a painted curve. Bands bow toward the viewer; the pan is a shallow dish
  read as a value trough, never an outlined channel.
- PALETTE: constitution ceiling, one master palette with a family subset (M17).
  GROUND band (mean 103.7, lo 49.3, hi 152.2) — and read that band correctly,
  because misreading it is how this family breaks target_match_gate. The band is
  measured on TILE MEANS across the 16 ground tiles and the gate allows 26 of
  slack, so what it constrains is each new tile's OWN mean, not any pixel in it.
  The frozen kerb cap is a FOUR-ROW cap of 176/179/174/173 (row means; its
  brightest single pixel is 190) sitting inside a tile
  whose mean is 112.2 — comfortably inside the band. So the cap is NOT an
  exception to the band and there is no exception to claim: hold the 176 cap
  rows, and keep every piece's tile mean inside the ground band anyway. A piece
  that raises its whole mean chasing the cap is out of this world by the gate's
  own arithmetic.
  Concrete sits at the top of the band, the asphalt near the bottom, and THE
  VALUE STEP BETWEEN THEM IS THE WHOLE READ. Measured today: `walk_kerb` 112.2
  against `road_gutter` 63.1 = 49 points apart, comfortably over M14's 18-point
  floor. Every new piece must preserve that step; the family is designed in
  greyscale first and hued afterwards (M18).
- LIGHT: the one global direction, upper LEFT. NO keyline — a kerb drawn as a
  dark outline is the single most likely violation in this whole form and it is
  also the exact thing that makes a tiled world read as a grid (M10). NO dither
  (act-1 ban). The arc runs ONE staircase (LAW 3): a 1-px step inside a run of
  2-px steps is a jaggie, not texture, and on a curve it is the defect the eye
  finds first.
- SHADOWS: none baked, per the separate-layer law — with the one inherited
  exception named in C: `road_gutter` already bakes a nine-row kerb shadow, so
  the road-side edge of every piece here reproduces THAT ramp and nothing more.
  Expected runtime shadow footprint: a thin band on the road side of the kerb
  that shortens to nothing across the drop and swings around the corner arc.
- SCALE ANCHORS: the 2-cell door fixes storey height; the 2x3 car fixes the
  apron mouth at 3 cells; a 1.75 m human is 2.3 cells tall, so the 8.9 px kerb
  face is roughly ankle height on him and that is the sanity check — if the kerb
  reads as knee height the street has become a canal and every character in the
  frame just got small.
- WEAR LEVEL: thirty Mojave summers, no street maintenance, and every mark
  answers "what did this?" in one word (M1) and clusters irregularly (M11):
    CONTACT — spall arcs on the kerb nose at the corner return and on the apron
    wing, where thirty years of tyres clipped the two places tyres clip. Chips
    are 2-6 px, not 22-cm blotches.
    WATER — the cold joint between the concrete pan and the asphalt is where
    every street in the world fails first: the asphalt shrinks off the concrete
    and opens a 1-2 px dark line that runs unbroken the length of the kerb. It
    is the single most valuable mark in this family because it is continuous and
    can be authored straight into the seam. Efflorescence blooms pale below the
    inlet throat where water repeatedly ran.
    SUN — the asphalt binder oxidises, the surface ravels, aggregate comes proud
    and the road VALUE RISES over thirty years. This is a live hazard for M14:
    even fully oxidised, the pan must stay 18+ points above the asphalt or the
    kerb line stops existing. Paint dies fastest of all: a red fire-lane kerb is
    repainted every 12-24 months in sun country, so at thirty years it is a
    chalked pink ghost — and because the paint film shielded the concrete from
    bleaching, the ghost can read very slightly DARKER than the bone-pale
    concrete around it, not brighter. Same for the painted kerb address numbers,
    which in the valley are a real trade (veteran-run curb-painting outfits work
    Las Vegas neighbourhoods to this day): a white rectangle ghost with the
    digits still faintly legible is the only thing left that says who lived
    there.
    WIND — sand and decomposed-granite landscape rock drift against the kerb
    face on the windward side and fill the pan: a wedge thickest at the kerb,
    feathering out, irregular, never an even film.
    FLOOD — the valley's hardpan sheds rain instead of absorbing it, so the
    gutter is a sorting machine: coarse gravel dumped in a fan at the inlet
    mouth, fine silt in the flat of the pan. The grate is HALF BURIED in its own
    gravel fan, and that is the most motivated wear mark in the set.
    WHAT DOES NOT HAPPEN — the steel does not rot away. See G.
- VARIANTS: five members (M1-M5) as specified, of which M1, M4 and M5 are this
  form's guaranteed deliverable and M2/M3 ride on the ownership call flagged in
  A and B, plus rotations and mirrors, which are the edge
  set and not variants. Colourways only beyond that: dry, rain-wet, red-kerb
  ghost, address-number ghost. Per STRUCTURE-NOT-COLOR none of those four is
  progress; the five members are the shapes and they are the deliverable.

## F. THE CAPTION
```json
{
  "id": "TF-ART-018",
  "name": "kerb and driveway apron transitions",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": [
    "all"
  ],
  "best_time": "both",
  "best_location": "any cell where the kerb stops going straight - a street corner, a car entrance, a low point that takes water, or the head of a crossing",
  "place_next_to": [
    "walk_kerb",
    "walk_0",
    "road_gutter",
    "road_0",
    "concrete_0",
    "road_crossing",
    "dead lawn",
    "gravel yard",
    "desert ground"
  ],
  "never_next_to": [
    "another kerb facing it with no carriageway between",
    "perimeter wall standing on the kerb line",
    "road_crossing sharing a cell with a vehicle apron",
    "a building footprint touching the kerb face with no walk between"
  ],
  "weather_ok": [
    "sunny",
    "cloudy",
    "rain"
  ],
  "acts": [
    1
  ],
  "edge_contract": "WANG-16 edge set; the corner arc is a fixed multi-cell block whose outer cells still hash to the Wang edge codes, and every road-side edge reproduces road_gutter's nine-row baked shadow ramp at phase",
  "anim": null,
  "tags": [
    "ground",
    "concrete",
    "kerb",
    "apron",
    "corner",
    "drainage",
    "crossing",
    "street-aware",
    "seam",
    "lynch-edge"
  ]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the frozen CBB starter set's `walk_kerb`, `road_gutter`,
  `road_crossing`, `walk_0/1/2` and `concrete_0/1` in
  banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt — this family exists only to
  join them, so they are its colour, value and phase truth by definition
  (measured above: kerb cap 176, walk 112.2, gutter 63.1, gutter shadow ramp
  43->61 over nine rows). Its seam rings and the frozen md5 are published in
  records/target/BOHEMIA_VISUAL_CONSTITUTION.json, and the 7/28 re-cook of the
  same ids is banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt.
- NAMED OUTSIDE REFERENCE: **Grand Theft Auto 2 (DMA Design, 1999)** — take its
  STREET KIT ANATOMY, never its palette or its flat top-down camera. GTA2's city
  is a tile kit that already solved exactly this problem: it ships authored
  kerb-corner pieces, a dropped kerb at every garage mouth, and painted
  crossings, and it makes the same call this form is making — the corner is a
  CHAMFERED, deliberately-too-tight radius so the pieces stay square and
  repeatable, because a true 25-ft return would not fit the grid. Uniformity
  beat realism there and it reads as a city thirty years later. Secondary, for
  the pixels rather than the anatomy: **waneella**, already canon in our own
  mastery laws (M15) and praised for perspective and light rather than texture —
  her kerbs read from a 1-2 px lit top edge and a value step, with no outline
  anywhere, which is precisely the no-keyline rule this form has to survive.
- REAL-WORLD GROUNDING: this object is PUBLISHED in Las Vegas. Clark County,
  Las Vegas, North Las Vegas and Henderson all build to the same Uniform
  Standard Drawings, administered through the RTC of Southern Nevada, and the
  relevant sheets are specific and usable: Std Dwg 216 is the "L" type (6-inch
  vertical) kerb and gutter used on arterials and commercial frontage; 217.1 is
  the ROLL type and 217.3.S1 the R-type used through residential subdivisions,
  with the R-type restricted to driveway locations unless otherwise approved —
  so in a real valley subdivision the kerb PROFILE ITSELF changes where the
  driveway is, which is the visual event this family is asking for and the
  reason it deserves geometry instead of a decal. Std Dwg 222 is residential
  driveway geometrics (one kerb cut per property except circular drives); 222.1
  is commercial and multi-family, 12 ft minimum one-way and 32 ft minimum
  two-way. Standard kerb return radius is 25 ft, never under 15 ft except
  alleys, never over 35 ft.
  MATERIAL: it is not ordinary concrete. Valley soils are gypsum-rich with very
  high soluble sulfate and a caliche hardpan, so local specifications call for
  Type V sulfate-resisting cement plus a sulfate-resistant pozzolan — unprotected
  concrete in these soils disintegrates from the paste outward. Thirty years
  with no maintenance therefore rots the kerb from the SOIL SIDE (the back,
  where sulfate wicks up) while the sun-facing front merely bleaches: the face
  goes bone/pale-tan, never northern grey, while the back edge crumbles and
  slumps into the dead landscape strip.
  WATER: the Regional Flood Control District runs 722 miles of storm drains,
  channels and washes and 113 detention basins, because the hardpan sheds
  monsoon rain almost instantly and the valley floods in minutes. That is why
  the pans and inlets are oversized and why the inlet — not the pavement — is
  where you see real damage: gravel is sorted and dumped in a fan at the throat
  and fine silt settles in the flat.
  AND THE COUNTER-INTUITIVE ONE THAT DECIDES THE GRATE: the Mojave is an ISO
  9223 C1/C2 atmosphere (very low to low corrosivity, under 1.3 to 25 microns
  per year) because there is no humidity and no salt air. A cast-iron grate here
  loses well under a millimetre in thirty years. It does NOT rust to orange
  flakes and it does NOT collapse — it goes to a dark, dry, plum-brown patina
  and stays perfectly intact, and the only bright corrosion anywhere is the
  streak where salts wick out of the concrete at the frame contact.
  ONE COLOUR GUARD ON THAT WORD, because "plum" is the single pixel in this
  form that can trip a live gate: PURPLE RESERVATION is absolute (section H) and
  gates/bohemia_purity_gate.py flags any pixel where r > g+25 AND b > g+25 AND
  r > 80. So the patina is the RED-BROWN half of plum only — blue must stay at
  or below green on every pixel of the grate, no exceptions. If a swatch reads
  even slightly violet it is a violation, not a patina; darken toward iron-brown
  and drop the blue. The grate is
  the most SOLID-looking thing on the whole street, which is a much better and
  much stranger read than rusted-out ruin.
  RESEARCH HONESTY, stated the way the craft laws state it: this environment's
  network policy 403s direct page fetches (I tried the RTC standard-drawing PDFs
  and got 403 at the proxy), so the standard numbers and dimensions above come
  from search-returned summaries of the primary sources, not from reading the
  sheets end to end. The ADA figures (0.9-1.4 in dome base, 0.2 in height,
  1.6-2.4 in centres, 24 in pad depth) are from the 2010 ADA Standards s705 and
  are quoted verbatim from the summary. Anything I could not confirm is not in
  this form.

## H. DON'T WANT
- NOT a black keyline arc. A kerb drawn as an outline is the fastest way to fail
  this form, and on a curve an outline also guarantees the world reads as a grid
  of tiles instead of a street. The rule is the visual constitution's own —
  records/target/BOHEMIA_VISUAL_CONSTITUTION.json, outline: "NO black keyline.
  Edges are value steps." — plus craft LAW 4 (never treat your own outer edge,
  you do not know the neighbour) and M10.
- NOT a tall kerb. 6 inches is 8.9 px of a 44 px cell — ankle height on a 1.75 m
  body. A chunky kerb turns every residential street into a canal and shrinks
  every character in the frame. Both sibling forms name this failure and it is
  named a third time here because it is the one that keeps happening.
- NOT a smooth vector arc, and NOT a quarter-circle drawn inside a single cell.
  A true return is 10.2 cells; a one-cell curve is a roundabout icon. This is
  the mall-icon mistake in kerb form.
- NOT mixed staircases on the arc (craft LAW 3). One step length the whole way
  round. A 1-px step inside 2-px steps is a defect, not a texture, and a curve
  is where the eye finds it instantly.
- NOT sixty truncated domes drawn as individual 1-px dots. At 1.3-2.1 px per
  dome on a 2.4-3.6 px pitch, drawing every dome is by definition an
  orphan-pixel field — the exact failure that measured 73.6% across the frozen
  set (craft LAW 1) and the exact thing Slynyrd's "avoid depicting every single
  brick" rule bans. The pad is a value shift with a few clustered domes at the
  wear line.
- NOT bright ADA yellow. A fresh cadmium dome pad would be the most saturated
  object in the frame and would eat the whole contrast budget on a piece of
  pavement (M3, M13 — this family is background and must stay subordinate to
  doors, portals and district heroes).
- NOT orange flaking rust on the grate, and NOT a collapsed or missing grate.
  The Mojave is C1/C2; steel barely corrodes here. Dark dry patina, intact.
- NOT green anything in the gutter joint. Act 1 has no living plants, and dead
  weeds belong to the DEAD FOLIAGE prop family (board row 5) at its own layer —
  this family must leave room for them and never bake them in.
- NOT northern grey concrete. Bone, pale-tan, bleached.
- NOT clean, and NOT freshly painted. A crisp red fire kerb or a bright new
  crossing bar is a thirty-year-old lie; both are chalked ghosts.
- NOT a painted stripe standing in for geometry. The markings bank exists and is
  paint; every member of this family is a change in the ground plane.
- NOT dithered (act-1 ban; stipple crawls under the phone's integer blit).
- NOT a baked cast shadow, except the one nine-row gutter ramp explicitly
  inherited from the frozen tile (separate-shadow law).
- NOT busier than the buildings standing behind it. Ground stays quieter than
  structure (M2), and this is the ground the player walks on every step of every
  run — it is the last surface in the game that should be interesting.
- NOT a flat side-on scroller face (45 DEGREE ART LAW).
- NOT purple, anywhere, at any value (PURPLE RESERVATION).
- NOT three separate materials. If the corner, the drop and the inlet do not
  look like one continuous pour of the same concrete, the family has failed
  before anyone judges a single tile.

## I. ACCEPTANCE
- [ ] Seam measured on the full WANG-16 set (M10 offset test): wrap delta within
      the normal neighbour step, no edge-darkening, and every road-side edge
      reproduces `road_gutter`'s nine-row 43->61 ramp at phase
- [ ] Value step preserved and measured: walk-side to gutter-side at least the
      inherited 49 points, and no adjacent pair under M14's 18-point floor,
      checked in GREYSCALE not in colour
- [ ] Kerb cap holds the inherited cap-row MEAN of 176 (a row mean, not a peak
      pixel — the frozen cap's own peak is 190) and the piece's whole-tile mean
      still lands inside the GROUND band; kerb face measures 8-9 px, lit top
      edge 1-2 px
- [ ] Pixel craft gate green: orphan share, single-use colours, block size 1,
      pillow score, cluster density, set-wide palette, M2 floor-is-quiet, M5
      detail spread (laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md and
      laws/BOHEMIA_PIXEL_MASTERY_LAWS_7_28_26.md)
- [ ] Palette ceiling + GROUND band + one-light + no-keyline + no-dither green
- [ ] One staircase measured on the corner arc (no mixed step lengths)
- [ ] Squint test: at walk zoom the car surface reads CONTINUOUS from street to
      garage, and the corner reads as a corner — that is the street-aware law
      being satisfied, not a pretty tile
- [ ] 3x3 TILED PROOF SHEET rendered — never judged as a lone tile
- [ ] ASSEMBLED SCENE PROOF, which is the real test here: one intersection
      corner, one driveway entrance, one inlet and one crossing head in a single
      strip, with the frozen straight run running into all four
- [ ] ON THE REAL SURFACE: screenshot in the run, standing in the street, beside
      today's butt-jointed render and beside the approved anchor named in G
- [ ] Both radii shown together (3-cell residential arc and 6-cell arterial arc
      built from the same pieces)
- [ ] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: ART lane (own queue, breaking down board row 15
  (ACT-1 TILESET REMAINDER), which names "curb/sidewalk transitions" in its own
  words; NOT row 7, which is the CHARACTER CONTACT SHADOW. Corrected to agree
  with section B and with board row 98's own "row 15 breakdown" line.)
  | DATE: 7/29/26 | PRIORITY: HIGH
- BOARD ROW #: 98 | VERDICT: —
  (Row 98, inside the 90-99 band the board reserved for this batch. The form was
  filed claiming row 27, which is already STOREFRONT GLASS / TF-ART-008 — the
  board's own note is right that the stable key is the TF id, not the integer.)
  DUPLICATE ROW, FLAGGED NOT RESOLVED (found 7/29 on review): the board ALSO
  carries row 37 "KERB + DRIVEWAY APRON TRANSITION SET | ... | FORM:
  TF-ART-018", inside the ART block, citing "row 7 breakdown". So one form has
  two rows and two different parent citations. Row 98 is the correct one (row 15
  is the ACT-1 TILESET REMAINDER that names "curb/sidewalk transitions"; row 7
  is the CHARACTER CONTACT SHADOW). Collapsing the two is a board edit that
  touches the whole ART block's row-7 citation, so it is named here rather than
  done quietly. [PENDING — whoever owns the board's ART block.]
