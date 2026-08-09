# TILE FORM TF-ART-009 — BRICK MASONRY (RUNNING BOND, SOLDIER COURSE, CORNER, PAINTED-OVER)

## A. IDENTITY
- NAME: Brick masonry wall — the old red-brick building face
- FAMILY/SET: BRICK MASONRY family. ONE drawing job, four structural pieces:
  (1) running-bond field, (2) soldier course / lintel band, (3) corner return,
  (4) painted-over-brick face. Colourways ride along on the same geometry
  (common red-brown, desert buff, painted) per STRUCTURE-NOT-COLOR.
- THE JOB, ONE SENTENCE: this family exists so that the OLD half of the valley —
  the pre-1970 downtown podium, the Fremont-era commercial strip, the WPA school
  and branch library, the surviving 60s motel block — is made of a material the
  new half is not, because "this building is older than the money" is a thing
  the player must be able to read off a wall in one glance and today cannot.

## B. WHY
- DEMANDED BY: BOHEMIA_TILE_REQUESTS row 7 (ACT-1 TILESET REMAINDER, ART lane
  queue), broken down into per-material forms. Reinforced by three live rulings:
  the three-tile wall law (laws/BOHEMIA_ADDENDUM_THREE_TILE_WALL_7_27_26.md,
  WALL_H=3) which means every door-bearing wall now has a base / mid / lintel /
  cap course structure and NO material to express it in; EVERY DISTRICT IS ITS
  OWN LANDMARK (Paolo 7/28) with his bulk verdict on downtown ("both need work")
  and commercial ("city icon needs some loving"); and M13 in
  laws/BOHEMIA_PIXEL_MASTERY_LAWS_7_28_26.md, which says the valley's age
  hierarchy has to be carried by SUBORDINATE background material, not by hero
  props.
- WHAT LOOKS BROKEN TODAY: downtown, commercial, town, library, school, medical
  and swapmeet all render their building faces in the same pale suburban stucco
  as a tract house. The result is that Las Vegas has no history in it — a 1937
  brick storefront, a 1994 strip mall and a 2003 house are one material, so
  nothing in the world is OLD, and "thirty years after the money died" has
  nothing to sit on top of. Paolo has already named this class of miss from the
  other direction ("you really should be using the suburb district"): the game
  reaches for the residential language because it is the only language it has.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md walked in
  full, row by row, plus the banks it points at.
  banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt (42 tiles, CBB, md5-locked) is
  the ONLY approved tile set and it is one residential street — asphalt,
  sidewalk/kerb, gravel yard, concrete slab, dirt, stucco wall, terracotta roof,
  flat deck. There is no masonry unit of any kind in it. Same for the 7/28
  re-cook, banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt, which is the
  same 42 shapes on six ramps.
  banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt (30/30 UP) is the closest
  thing in the corpus to a wall skin and it is explicitly the RESIDENTIAL
  language: stucco field, terracotta roof, residential window, boarded window,
  door, yard. Using a house skin on a downtown podium is the exact mistake this
  form exists to stop.
  banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt (26 entries) is approved for the
  SUBURB BOUNDARY wall specifically (WB4 "PERIMETER") — a freestanding site wall
  with a cap and no openings, not a building face that has to carry a door head,
  a storey line and a parapet.
  banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt (the HD-pack UP list, 1,927 of
  2,604 judged) searched for anything brick: the surviving UP set skews house
  exterior and interior room dressing, and the packs that carried masonry
  facades are in the ~206 never-judged packs, which the 7/26 law makes PRESUMED
  DISMISSED. Building on those would outrank Paolo's own verdicts.
  banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt checked because interior brick exists
  in some room buckets: it is INTERIOR trim at interior scale, and by the
  INTERIOR-MATCHES-EXTERIOR law an interior skin is not a substitute for the
  exterior footprint face.
  NEAREST NEAR-MISS AND WHY IT FAILS, named: the frozen starter set's
  wall_0 / wall_base / wall_under_eave. It is the closest APPROVED thing on
  disk and it is the right GRAMMAR (base course, field, course-under-eave) —
  which is exactly why it is the anchor in G. It fails as a substitute because
  it is a single flat stucco value with no module at all: it has no course, no
  bond, no unit, and no way to phase across a tile, so a wall built from it can
  never say how tall a storey is or how old the building is. It is a colour, and
  brick is a colour plus a module.
  Two FORMS were also checked so this does not duplicate another lane:
  records/tileforms/TF-ART-007_civic_stone.md is MONUMENTAL civic (courthouse
  portico, city hall, the grand columned face) and stays that — brick is the
  civic INFILL beside it (the WPA school wing, the branch library, the annex),
  which is a real distinction in this valley and not a hedge.
  records/tileforms/TF-ART-001_cmu_block_wall.md explicitly says "NOT brick
  (that is a different bond and a different colour entirely)" and hands this off.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode). At MAP zoom it is a
  building block colour only, no icon — it is background material, not a
  landmark (M13).
- DISTRICT FAMILIES: downtown (the low-rise podium under the towers), commercial
  (the older strip), town (the main-street block), library, school, medical
  (the old clinic wing), swapmeet, chapel, mall (the pre-mall infill it grew
  around). NOT industrial, NOT warehouse, NOT storage — those are CMU and
  corrugated metal and stay that way.
- LAYER: structure
- SOLID? yes — ENTERABLE? no — every opening (door, storefront bay, window) is
  its own tile and cuts through this field; the brick never draws an opening.
- MUST SIT BESIDE: itself horizontally and vertically with the bond phase
  carried across the seam; its own soldier/lintel band and corner return; the
  storefront glazing bay and the boarded bay (TF-WORLD-008); the animated door
  bank openings; the base/mid/cap band grammar (TF-CITY-008), which this
  material FILLS rather than replaces; concrete sidewalk and kerb at its foot;
  the flat-roof parapet above it.
- NEVER BESIDE: never beside terracotta roof tile (that is the house language on
  a commercial block); never carrying a residential stucco window; never meeting
  raw desert ground without a sidewalk or apron, because a brick building of
  this era was built to a street and a brick wall coming straight out of gravel
  reads as a ruin, not a building; never beside corrugated metal on the SAME
  face, because that pairing means shed and this material means street.
- EDGE CONTRACT: SELF-SEAMLESS in both directions for the running-bond field,
  with a DECLARED bond phase — a 4-brick horizontal module (11 px each = 44 px
  exactly) and a 2-course vertical repeat, so the bond lines up across every
  seam and never doubles a joint. The soldier/lintel band, the corner return and
  the painted-over sign-ghost are SINGLE PLACEMENT. Every touching edge of the
  field gets the offset test (M10) measured before it ships.

## D. WHEN
- ACT: 1
- BEST TIME: both. Unlit at night as a rule — brick is background material and
  LIGHT=TERRITORY means the light in a downtown block belongs to whoever owns
  the storefront, not to the wall. At night the field drops to the night palette
  and the only brightness on it is spill from a lamp or a lit bay next door.
- WEATHER STATES: sunny baseline; cloudy wash needs nothing. RAIN is the one
  interesting state and it is a real material behaviour, not a filter: soft
  low-fired brick soaks faster and more unevenly than the mortar around it, so a
  wet brick wall goes BLOTCHY BRICK BY BRICK. This is the only condition in the
  game where an individual brick is allowed to read as an individual brick, and
  it must be a palette state (M9), not a second drawn tile.
- LIT/UNLIT: no lit variant for the field, deliberately. Spending a lit state on
  background material is exactly the contrast-budget mistake M3 and M13 name;
  the lit read comes from the runtime light pass and from the storefront glass
  beside it, which is where the player is supposed to look.
- ANIMATION: static. The wet and night states are palette swaps / palette cycles
  (M9, M16), never frame sets. Leaf-pixel law has nothing to move here.

## E. HOW
- EXACT SIZE: 44 px cell (THE CORPUS CELL), footprint 1 tile; a door-bearing
  wall is 3 tiles tall (WALL_H=3) = 132 px. THE MODULE, worked from the real
  brick: CELL_M is 0.75 m over 44 px, so 1 px = 17.05 mm. A US standard modular
  brick is nominally 8 in x 2 2/3 in INCLUDING its 3/8 in mortar joint = 203 mm
  x 68 mm. Course height 68 mm / 17.05 = 3.97 px, so a COURSE IS 4 PX and
  eleven courses are 745 mm against a 750 mm cell — dead on, no fudge. Brick
  length 203 mm would be 11.9 px, but 44 does not divide by 12, so a stretcher
  is 11 PX (187 mm, 8% short) and four of them wrap the cell exactly. Running
  bond is a fixed +5 px offset on alternate courses, a clean 2-course repeat.
  THE NUMBER THAT DECIDES THE WHOLE TILE: the 3/8 in mortar joint is 9.5 mm =
  0.56 PX. THE JOINT IS SUB-PIXEL AND CANNOT BE DRAWN. It is implied by a
  one-step value change at the course line, never by a drawn line of mortar
  colour. A soldier course (brick stood on end) is 12 px tall, which is exactly
  three stretcher courses — true in real brickwork, which is why soldiers course
  out with the field — divided every 5/6 px alternating, 8 soldiers per cell.
- VIEW: 45-degree world view. Front face carries the bond; the corner return
  face is the same bond compressed and dropped to the away value, so its
  perpends read as vertical ticks and its bed joints keep the same 4 px rhythm —
  the corner is where a flat-scroller cheat becomes visible instantly. Sky-lit
  top only on the parapet cap, which is the cap tile's job, not this one's.
- PALETTE: constitution ceiling; STRUCTURE value band (front 0.97 / away 0.56),
  drawn from the ONE master palette (M17), 5–7 steps hue-shifted on perceived
  lightness. Brick takes the DARKEST seat of the three structure materials —
  darker than CMU grey (TF-ART-001) and much darker than civic limestone
  (TF-ART-007). That is a deliberate value decision, not a taste one: it is how
  M14's 18-point separation gets satisfied on a downtown block where a brick
  podium sits under a pale parapet and over a mid-value sidewalk, and it is the
  one material in the valley that reads dark.
- LIGHT: the one global direction, upper LEFT. NO keyline. NO dither. NO
  anti-aliasing on the outer silhouette (LAW 4 — it does not know its neighbour).
- SHADOWS: none baked (separate-layer law). Expected runtime footprint: the
  soldier/lintel band throws a thin hard line onto the two courses under it, and
  the parapet throws onto the top of the field — both are the runtime pass, and
  both are why the band needs no baked contrast of its own.
- SCALE ANCHORS: the 2-cell door opening = 88 px = 22 courses from sill to head,
  with the soldier lintel occupying courses 23–25 directly on the head and eight
  more courses to the parapet in the third tile. A 1.75 m human is 103 px = 26
  courses, so a standing figure's eye lands two courses under the door head. A
  car is 2x3 tiles, so a car parked along the wall covers 8 stretchers. If any
  of those three disagree with the drawing, the drawing is wrong.
- WEAR LEVEL: thirty Mojave summers, no maintenance, and EVERY MARK NAMES ITS
  CAUSE (M1) — nothing scattered, nothing decorative.
  SAND: wind-driven sand saltates in the lowest ~1 m and it eats MORTAR faster
  than it eats brick, so the bottom 59 px is a hard scour band fading out by
  88 px. It reads as the joints going dark and recessed in the base band while
  the joints higher up stay nearly invisible — the wear is a value change on the
  course lines, not a drawn groove.
  SALT: sulfate-bearing caliche soil wicks up and leaves efflorescence. Streaks
  are 1–3 px wide (1.7–5 cm) and 10–30 px long, hanging DOWNWARD from a joint
  that held water, clustered irregularly (M11). Never a blotch — a 13 px blob is
  a 22 cm salt stain and no such thing exists.
  FROST: about 10–24 freezing nights a year, so ~450 freeze cycles in thirty
  years — enough to spall brick only where water actually sits. A spalled face
  is ONE WHOLE BRICK (11 x 4 px) showing its darker unfired core, never a
  nibbled edge, and it appears in exactly two places: the bottom two courses
  where the sidewalk splashes, and directly under a failed parapet coping.
  SUN: the south and west faces bleach and chalk hardest — same brick, lower
  saturation, and on the painted variant that is where the paint dies first.
  PAINT: latex over brick traps vapour and lets go in sheets. A peel patch is a
  hard-edged irregular cluster 6–20 px across (10–34 cm) showing brick beneath,
  never a soft fade, and it goes on the south and west faces only.
- VARIANTS: FOUR structural pieces — running-bond field, soldier/lintel band,
  corner return, painted-over face (which also carries the ghost of a painted
  sign, because that is what a painted brick wall in this valley actually has on
  it). Beyond those four, colourways only: common red-brown (the 1930s–40s
  downtown brick, dusty red pushed brown and desaturated by dust), desert buff
  (the sandy tan-rose southwestern blend of the 60s work), and the painted
  colour itself off the motel palette. Per LAW 12, the field gets 2–3 variations
  so a long run does not repeat visibly; those are variations of the same tile,
  not new shapes, and they do not need their own form.

## F. THE CAPTION
```json
{
  "id": "TF-ART-009",
  "name": "brick masonry wall",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": [
    "downtown",
    "commercial",
    "town",
    "library",
    "school",
    "medical",
    "swapmeet",
    "chapel",
    "mall"
  ],
  "best_time": "both",
  "best_location": "the pre-1970 building faces: downtown low-rise podium, older commercial strip, civic infill wings, the surviving 60s motel block",
  "place_next_to": [
    "brick masonry wall",
    "brick soldier course",
    "brick corner return",
    "storefront glazing bay",
    "boarded bay",
    "animated door opening",
    "concrete sidewalk",
    "kerb",
    "flat roof parapet"
  ],
  "never_next_to": [
    "terracotta roof",
    "residential stucco window",
    "desert ground without sidewalk or apron",
    "corrugated metal on the same face"
  ],
  "weather_ok": [
    "sunny",
    "cloudy",
    "rain"
  ],
  "acts": [
    1
  ],
  "edge_contract": "SELF-SEAMLESS both directions for the running-bond field with a declared 4-brick horizontal module and 2-course vertical bond phase; soldier band, corner return and painted sign-ghost are SINGLE PLACEMENT",
  "anim": null,
  "tags": [
    "structure",
    "masonry",
    "brick",
    "downtown",
    "commercial",
    "historic",
    "background"
  ]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the frozen starter set wall_0 / wall_base / wall_under_eave
  in banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt — same base/field/upper
  construction grammar and the same STRUCTURE value band, different material.
  The grammar is approved; only the module and the colour family are new. The
  CBB target screen is the value reference this must be measured against, and
  the 7/28 re-cook in banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt is
  the detail-level reference so this family does not come out busier than the
  set it joins (M5).
- NAMED OUTSIDE REFERENCE: EASTWARD (Pixpil, 2021) — a 3/4 pixel adventure set
  in a decaying, half-abandoned world, which is our exact problem. The specific
  thing to take is their PIPELINE, not their palette: their artists split every
  building into separate roof and wall layers and rebuild those layers in a 3D
  environment purely to bake correct lighting back into the pixels, which is the
  same discipline as our layer contract plus our single upper-left key, and it
  is why their brick and tile facades hold together across a whole town instead
  of reading as swatches. SECOND, and named because M15 demands a looking job
  rather than a writing job: WANEELLA's pixel cityscapes, praised specifically
  for perspective and light and NOT for texture, worked from photographs of real
  streets. Applied here that means the reference for this family is a photograph
  of the Huntridge and the Fremont East brick storefronts, not a paragraph about
  brick. What we deliberately do NOT take from either: Eastward's warm inhabited
  lighting — Act 1 is dead and unlit.
- REAL-WORLD GROUNDING: brick is the MINORITY material in Clark County and that
  is the point of it. There is no local clay industry and no timber; the valley
  built in adobe, then in brick shipped in for the few buildings that mattered,
  then in concrete block and stucco once Portland cement got cheap, and after
  the 1980s in stucco almost exclusively. So brick in Las Vegas dates a building
  instantly: it means pre-1970. The real anchors are named and standing — the
  HUNTRIDGE THEATER at Charleston and Maryland Parkway, S. Charles Lee, opened
  1944, a one-storey BRICK AND CONCRETE Streamline Moderne box with a 75 ft
  tower, on the National Register since 1993, closed 31 July 2004 and left
  vacant SEVENTEEN YEARS as a de facto homeless encampment with a partial repaint
  in 2013 that a $200,000 crowdfund could not carry past a paint job. That is
  literally our building: a brick landmark, boarded, squatted, half-painted,
  still standing. Alongside it the 1930s–40s Fremont Street commercial blocks
  (the 1906 First State Bank was already brick with hollow-concrete-brick walls,
  the Las Vegas Pharmacy a three-storey brick front) and the mid-century motels
  east to Boulder Highway, which were economical concrete block and stucco
  "enlivened with colour and gesture" and used brick as an accent wainscot and
  spandrel, not as the whole wall.
  WHAT THIRTY YEARS OF MOJAVE SUN AND NO MAINTENANCE ACTUALLY DOES TO IT, in
  order of how visible each one is:
  (1) THE MORTAR GOES FIRST, NOT THE BRICK. Wind concentrates its erosive force
  in the saltation zone, the lowest metre or so above grade, and abrasion testing
  shows fine wind-driven particles preferentially erode MORTAR while coarser ones
  attack aggregate. So a Vegas brick wall wears from the bottom up as a raked,
  recessed joint band about waist high, with the brick faces above it essentially
  intact.
  (2) EFFLORESCENCE FROM THE GROUND UP. Sodium sulfate is a soluble salt
  associated with sulfate-bearing soils and groundwater and is common across the
  southwestern US; Clark County's building code requires foundation design to
  address corrosive soils including sulfates and chlorides, and there is a
  documented Las Vegas case of a new car dealership whose coloured masonry and
  coloured mortar bloomed efflorescence within months of construction. On a
  thirty-year-dead wall that is a permanent white salt band wicking up from grade
  and hanging in streaks below any joint that ever held water.
  (3) THE PAINT DIES ON THE SOUTH AND WEST FACES. UV breaks down paint binders
  causing fading, chalking and brittleness, worst on south- and west-facing
  surfaces; porous brick traps vapour behind a non-breathable film so it blisters
  and peels in sheets rather than fading evenly. A painted brick wall in this
  valley is therefore two-toned by orientation — still holding colour on the
  north and east, chalked to nothing and torn open to bare brick on the south and
  west.
  (4) FROST, BUT ONLY WHERE WATER SITS. Las Vegas averages roughly 10–24 nights a
  year at or below freezing, so brick does spall — but only in the splash zone at
  the sidewalk and under a failed parapet coping, never randomly up the face.
  (5) WHAT DOES NOT HAPPEN, and this is as important: brick does not go grey.
  Vegas dust is warm and pale and it settles into a warm dusty film, so brick
  desaturates and lightens rather than turning cold. Nothing green grows on it.
  No moss, no ivy, no water staining from vegetation — the streaks on this wall
  are salt and dust, and that is all.

## H. DON'T WANT
- NOT a drawn grid of outlined bricks. This is the single failure this form
  exists to prevent, and the craft names it in our own laws: "Avoid depicting
  every single brick as this would appear noisy and detract from the overall
  forms of the structure. Avoid emphasizing the outlines of the bricks, as this
  can look very busy" (Slynyrd, quoted in
  laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md LAW 8). Our own measured 74%-orphan
  disaster and the 7/26 black grid were both exactly this.
- NOT a drawn mortar joint. The real joint is 0.56 px. Drawing a 1 px line of
  mortar colour makes it 17 mm wide in a place where it should be 9 mm, doubles
  every joint against its neighbour, and is how a brick wall turns into graph
  paper. The joint is a value step, or it is nothing.
- NOT uniform bricks. Every brick the same value is a printed texture; the read
  comes from a FEW darker and lighter bricks clustered irregularly (LAW 8, M11),
  with most of the field at one value.
- NOT even, evenly-spaced wear. Random scatter is not the same as natural (M1).
  Every mark answers "what did this" — sand, salt, frost, sun, paint — or it
  gets deleted.
- NOT bright postcard red. American-northeast fire-brick red is the wrong hue for
  this valley and the wrong saturation for a dead world; this is dusty red-brown
  and desert buff, desaturated and lightened by thirty years of pale dust.
- NOT grey and weathered like stone. Brick does not go cold here (see G).
- NOT clean, NOT repointed, NOT restored. Thirty summers, no owner.
- NOT green. No moss, no ivy, no algae streak — dead world, no living plants.
- NOT a flat side-on scroller face (45 DEGREE ART LAW). The corner return is the
  tile that proves this; if the return is drawn as a second flat face at the same
  value, the whole family fails.
- NOT the same job as its neighbours' forms: this is the MATERIAL that fills the
  base/mid/cap bands of TF-CITY-008, not a second version of that grammar; it is
  the wall AROUND the storefront of TF-WORLD-008, not the glazing; and it is the
  civic INFILL beside TF-ART-007's monumental stone, not a competitor to it.
- NOT lit, NOT hero-detailed. This is background (M13). A brick field cooked as
  lovingly as a door means the door has stopped being a door.
- NOT dithered, NOT anti-aliased on its outer edge, NO black keyline.

## I. ACCEPTANCE
- [ ] Seam measured (SELF-SEAMLESS field): offset test (M10) run in BOTH axes,
      wrap delta within the normal neighbour step, bond phase continuous across
      the seam with no doubled joint, and no edge-darkening (the desert-pool
      lesson)
- [ ] Pixel craft gate green: orphan share, single-use colours, block size 1,
      pillow score, cluster density, set-wide palette
      (laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md)
- [ ] M2/M5/M14 green: this structure family quieter than nothing it should not
      be, within the set's detail spread, and >=18 luminance points clear of both
      the ground it stands on and the roof/parapet above it
- [ ] Palette ceiling + STRUCTURE value band + one-light pair checks green
- [ ] Squint test at map zoom: the brick block reads darker than the stucco block
      with no icon and no detail surviving
- [ ] 3x3 TILED PROOF SHEET rendered — never judged as a lone tile — plus one
      long 6-wide run to prove the bond does not band every 44 px
- [ ] ON THE REAL SURFACE: screenshot in place on a downtown podium and on an
      older commercial strip, three tiles tall with a real door in it, beside the
      approved anchor named in G
- [ ] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: CANDIDATES COOKED 8/9/26 (was OPEN; bank: banks/tileforms/TF-ART-009_CANDIDATES_8_8_26.json, proofs: records/tileforms_proofs/TF-ART-009/, judge: the ART tab, TILE BOARD card). UNJUDGED until Paolo thumbs it. | REQUESTED BY: ART lane (own queue, breaking down board row 7)
  | DATE: 7/29/26 | PRIORITY: HIGH
- BOARD ROW #: 18 | VERDICT: —
