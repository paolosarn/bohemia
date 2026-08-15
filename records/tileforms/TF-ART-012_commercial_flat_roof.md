# TILE FORM TF-ART-012 — COMMERCIAL FLAT ROOF (the built-up gravel roof, its
# parapet cap, and the dead mechanical on top of it)

## A. IDENTITY
- NAME: The flat roof on top of every non-house building — the black gravel
  field, the parapet wall that rings it, and the stripped air conditioner,
  hatch and ducting sitting on it
- FAMILY/SET: COMMERCIAL FLAT ROOF family. ONE drawing job, eleven pieces:
  built-up gravel field (the Wang centre), wind-scoured bald/alligatored field,
  granulated cap-sheet field, ponded/mineral-stained field, parapet cap as a
  WANG-16 boundary set (4 outside corners, 4 straight runs, 4 inside corners,
  3 ends/stubs), overflow scupper piece, curb-mounted roof hatch (closed),
  packaged rooftop AC unit small, packaged rooftop AC unit large, duct run on
  sleepers, roof drain sump.
- THE JOB, ONE SENTENCE: this family exists so that the top of every
  non-residential building in the valley stops being a flat coloured
  rectangle, because in a 45-degree world the roof is the largest single
  surface on every warehouse, storefront, civic block and industrial shed we
  have, and right now the entire commercial half of the city is capped with
  two tiles cut out of a picture of a house.

## B. WHY
- DEMANDED BY: this row is named in the ART lane's own STILL TO FORM list at
  the bottom of the ART block in BOHEMIA_TILE_REQUESTS.md — "commercial flat
  roof + rooftop mechanical (every non-house roof)" — filed 7/28 as found by
  the district-material walk and deliberately named rather than dropped. It is
  the row 7 (ACT-1 TILESET REMAINDER) breakdown continuing past TF-ART-010.
  Upstream of that: the CITY lane's 7/28 measurement that the renderer draws
  NOTHING above a roof plane anywhere, and the WORLD lane's 7/28 colour
  measurement that every district reads as the same tone from above.
- WHAT LOOKS BROKEN TODAY: a warehouse, a courthouse, a storefront strip and a
  self-storage row all cap out with the same two tiles, `roof_deck` ("a flat
  gravel roof deck") and `roof_parapet` ("the parapet wall around a flat roof,
  lit along its coping"), which were cut from ONE painted residential street
  mockup. There is no corner, so a parapet cannot close a rectangle and the
  ring breaks at every turn; there is no kit, so a 200,000 sq ft warehouse roof
  is 4,000 empty identical cells; and `roof_deck` measures a mean luminance of
  99.3 against the corpus ground mean of 103.7 — 4.4 points apart, which fails
  M14's 18-point floor outright. In greyscale our commercial roofs ARE the
  ground. That is not a texture problem, it is the roof not existing as a
  plane.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md walked row by
  row, and the banks OPENED in code (the C3 lesson on this board: the index's
  per-bank rows do not enumerate the pools inside a bank, so open the bank).
  Decoded and measured, not guessed:
  * banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt — THE CLOSEST NEAR-MISS.
    Loaded all 42 ids. It holds exactly two flat-roof tiles: `roof_deck`
    (44x44, 42 colours, mean lum 99.3) and `roof_parapet` (44x44, 45 colours,
    mean lum 110.3). WHY IT FAILS, four ways: (1) two tiles is a field and one
    straight edge — no outside corner, no inside corner, no end, so a parapet
    physically cannot close a footprint; (2) no kit at all, no unit, hatch,
    duct, drain or scupper, so the largest surface in the game has zero
    incident; (3) it is byte-frozen and md5-locked under Paolo's CBB
    TARGET_SCREEN_VERDICT, so it cannot be extended in place — a new family is
    the only legal route; (4) it fails M14 against the ground on arrival at
    4.4 points of separation, and it was cut from a painted house street, so it
    was never seam-measured as a repeating field — the 7/28 offset test
    measured re-cooked wall wraps at mean 3.27 and worst 19.52, which is the
    measured proof that a tile cut out of a painting bands when you repeat it.
  * banks/BOHEMIA_ROOF_KIT_EXPANSION_7_14_26.txt — opened. 36 tiles, all from
    HD pack "5. Roof tiles", baked for HOUSE FACTORY v2 and keyed to Paolo's
    HOUSE PART ROLES. Residential PITCHED roof material. A pitched shingle
    field on a warehouse is the "different object wearing a recolour" mistake
    TF-WORLD-007 already names. Disqualified.
  * banks/BOHEMIA_ROOF_SEAMLESS_SET_7_10_26.txt — opened. 47 quilted roof
    surfaces, and its own note says "UNJUDGED bank". Under the 7/26
    presumed-dismissed law an unjudged bank is not corpus. Disqualified twice
    over: unjudged, and pitched-residential source packs.
  * banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt — 30/30 UP, but its roof
    half is 14 PITCHED field tiles (shingle, gravel, s-tile). Residential
    language, and TF-CITY-001 already owns their edge geometry. Disqualified.
  * banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt (the 1,927 HD UP list) and
    banks/BOHEMIA_HD_TILE_REPO_part2.txt — the roof packs are gable/asphalt
    residential; the industrial packs carry commercial-looking machinery but
    it is loose art in a foreign value band with no parapet, no curb and no
    45-degree contract. Disqualified as a family, useful only as photo-grade
    silhouette reference.
  * banks/BOHEMIA_SEAM_FIXED_SURFACES_7_14_26.txt — seam-fixed GROUND
    surfaces, and the index itself flags it as having zero consumers. Wrong
    layer, wrong value band. Disqualified.
  * banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt — 465 interior tiles, and by law
    interior tiles never leak outside. Disqualified.
  * records/tileforms/TF-WORLD-007_flat_roofs.md and
    records/tileforms/TF-CITY-002_rooftop_equipment.md — these are FORMS, not
    pixels, and nothing has been cooked from either. See the reconciliation
    note under SECTION C. Nothing in the index claims a commercial flat roof.

## C. WHERE
- SURFACE + TAB: RUN (the walk — seen over every parapet from grade, and from
  any raised position) and CITY (human mode, where roofs are most of what is on
  screen). At MAP zoom the parapet coping is the bright line that draws the
  building's outline; the field is flat dark colour.
- DISTRICT FAMILIES: every non-residential type — commercial, strip retail,
  mall, downtown low-rise, industrial, warehouse, self-storage, truckstop,
  terminal, medical, school, library, courthouse, cityhall, police station,
  jail, fire station, water treatment, substation, railyard, landfill scale
  house, ballpark, campus, motel office. NOT suburb houses and NOT trailers.
- LAYER: structure
- SOLID? yes — ENTERABLE? no. The hatch is drawn CLOSED and sealed in act 1;
  it is the natural act-2 portal and is deliberately not one here.
- MUST SIT BESIDE: itself in every direction (it is a field); its own parapet
  ring on every boundary cell; the CMU wall (TF-ART-001), corrugated metal
  (TF-ART-002), tilt-up concrete and civic stone (TF-ART-007) faces directly
  below the parapet; the kit pieces standing on it; sky or the ground plane
  beyond the parapet's outer face.
- NEVER BESIDE: any ground tile with no parapet or wall between it and the
  roof (a roof that touches the ground is the massing failure); any pitched
  roof piece on the same mass (`roof_slope`, `roof_ridge`, `roof_hip*`,
  `roof_eave`) — a flat commercial box and a hipped house roof never share a
  building; residential terracotta of any kind; a residential rooftop swamp
  cooler (that is TF-CITY-002's object and putting it on a warehouse reads as
  a house).
- EDGE CONTRACT: WANG-16 edge set. This is deliberately ONE word where
  TF-WORLD-007 wrote two: a flat roof is a rectangle-with-a-boundary problem,
  so the membrane field IS the all-neighbours-filled centre tile of the Wang
  set and the parapet pieces are its fifteen boundary cases. That buys inside
  corners for free, which a "seamless field plus a parapet strip" contract
  does not, and inside corners are what an L-shaped or notched commercial
  footprint needs. The centre tile is ADDITIONALLY held to the self-repeating
  measurement (M10 offset test) because it tiles against itself across
  hundreds of cells, and that measurement is in the acceptance list below.

## D. WHEN
- ACT: 1
- BEST TIME: both. Nothing on a dead commercial roof self-lights. At night the
  field goes to the bottom of its ramp and the coping keeps the last of the
  ambient because it is the highest sky-facing plane on the mass — which is
  what makes a night skyline read as building outlines rather than black
  holes. Inside a powered 12% cluster the engine's light pass catches the
  coping and the top face of a unit; the tiles never carry that themselves
  (LIGHT=TERRITORY, and nobody owns a dead roof).
- WEATHER STATES: sunny baseline; cloudy needs no new art (the wash handles
  it); RAIN is the one that matters, because a flat roof with thirty years of
  gravel and dust in its drains PONDS — code defines positive drainage as
  clearing within 48 hours and every one of these roofs stopped clearing
  decades ago. Wet state is a VALUE AND SATURATION SHIFT on the same pixels
  (M9: indexed tiles make rain a palette, not a second tileset), plus the
  ponded-field variant reading as standing water instead of stain. No new
  geometry, no blue.
- LIT/UNLIT: no lit variant. Nothing here glows, hums or runs.
- ANIMATION: static, every piece. Deliberate and it is the same reasoning
  TF-CITY-002 used for the turbine vent: a powered exhaust fan spins because
  something powers it, and nothing does. A frozen condenser fan is the story.
  If the renderer ever wants heat shimmer or rain on this surface, M16 says it
  is a palette cycle on indexed pixels, never extra frames.

## E. HOW
- EXACT SIZE: authored on the 44 x 44 px corpus cell (cell_px 44 in
  banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt), CELL_M 0.75, so ONE PIXEL
  IS 17 mm. Field and parapet pieces are 1 cell each (16 tiles for the Wang
  set). Kit footprints: hatch 1 cell, small AC unit 2 x 2 cells, large AC unit
  3 x 2 cells, duct run 1 cell repeating plus one elbow, drain sump 1 cell,
  scupper is a parapet variant. Units are drawn TALLER than their cells and
  overhang upward like every 45-view mass.
- VIEW: 45-degree world view, and this family is where it bites hardest
  because a roof is the one surface a lazy hand draws flat. The parapet has
  THREE visible planes — outer face, coping top, inner face — and the inner
  face is what proves the roof is a plate inside a wall rather than a sticker
  on a box. The AC unit is a box with a sky-lit top and two faces; its
  condenser fan grille is an ELLIPSE cross-section, never a flat disc (the
  blessed lamp bank is the named reference in the 45 DEGREE ART LAW). The
  hatch curb is a low box with a lid on it, seen from above and to the left.
- PALETTE: constitution ceiling (records/target/BOHEMIA_VISUAL_CONSTITUTION.json)
  and a subset of the master palette per M17. VALUE PLAN, designed in grey
  FIRST per M18 and stated as numbers so it can be checked: field mean 78-88
  (a built-up gravel roof is genuinely dark — that is why it reaches 170F),
  parapet inner face 95-105 (it sits in its own shadow), parapet outer face
  115-125, COPING TOP 125-138. That gives roof-field to ground 103.7 a
  separation of ~20 and roof-field to wall 139.2 a separation of ~55, both
  clearing M14's 18-point floor, and it puts a bright 12-24 px lip around
  every commercial mass — which is where the contrast budget belongs (M3), on
  the edge that defines the building, not on the field.
- LIGHT: the one global direction, upper LEFT, shadows falling down and right.
  NO black keyline anywhere; the turn from roof plane to parapet inner face is
  a VALUE STEP. NO dither (act 1).
- SHADOWS: none baked. The parapet casts onto its own roof field and every
  unit casts onto the field, and both are the runtime pass. ENGINE
  PRECONDITION, named not solved (same one TF-CITY-002 flagged): the shadow
  pass has no roof-plane case, and the run draws no image above a roof plane at
  all. Judged with shadows off is acceptable; that is a backlog item, not a
  reason to hold the art.
- SCALE ANCHORS: all converted at 17 mm per pixel, which is the whole point of
  writing them down. A 30 in IBC fire parapet is 45 px, almost exactly ONE
  CELL of rise; the 42 in OSHA guard height is 63 px; a real Vegas screen
  parapet built to hide the mechanical runs 4-6 ft, so 70-106 px, 1.6 to 2.4
  cells. Sheet-metal coping is 8-16 in wide, so the coping top is a 12-24 px
  band. A Bilco Type S ladder hatch is 36 x 30 in = 54 x 45 px, so a hatch is
  almost exactly one cell with a 12 in (18 px) curb under it. A 5-ton packaged
  unit is 5 ft 10 in x 3 ft 9 in x 3 ft 5 in = 104 x 67 x 61 px, so 2.4 x 1.5
  cells on the plate and 1.4 cells tall — a human at 1.75 m is 103 px, meaning
  a person standing beside a small rooftop unit is a head and shoulders above
  it, and that is the sanity check. An overflow scupper is a 4 in minimum
  opening, so a 6 px notch, its invert 3-6 px above the low point. Get these
  wrong and a strip mall reads as a refinery.
- WEAR LEVEL: thirty summers, no maintenance, and every mark answers "what did
  this?" in one word (M1), placed in irregular clumps and never scattered
  evenly (M11). WIND: monsoon and haboob gusts of 30-60+ mph strip the ballast
  off the exposed south and west field and bank it in drifts against the
  downwind parapet and around every curb and penetration, so the field is bald
  where the wind ran and BERMED where it stopped — directional, not random.
  SUN: the bitumen the gravel used to cover oxidises and ALLIGATORS, and a real
  alligator cell is 25-75 mm, so 1.5 to 4 px — the one place a fine pattern is
  honest, and it must still be clusters. HEAT: trapped moisture blisters
  between plies at 100-600 mm across, so 6-35 px, a legitimate soft lens with
  an upper-left light and a lower-right shade, some of them burst into a dark
  torn ring. THERMAL CYCLING: ply laps shrink and split, and BUR laps run about
  3 ft, so splits are STRAIGHT and repeat on a ~54 px (1.2 cell) rhythm, never
  a random crack field. WATER: the drains are packed with three decades of
  gravel and silt, so every low spot ponds and dries to a pale alkali ring —
  Las Vegas water is famously hard, and an evaporated pond leaves a white
  mineral tide line, which is the single most Vegas-specific mark on this
  whole surface. DUST: haboob silt films everything, so nothing is
  black-and-grey, it is all half a step toward the desert tan. THEFT: every AC
  unit has its access panels pulled and the copper coil gone. RUST: the coping
  fasteners back out under thermal cycling and bleed vertical stains down the
  parapet's outer face from each screw head; the coping joints open and lift.
  DEAD MATTER ONLY: tumbleweed piled on the windward side, no moss, no algae,
  nothing green, ever.
- VARIANTS: four field variants (gravel, wind-scoured bald + alligatored,
  granulated cap sheet, ponded/mineral-stained) at 2-5 per the high-traffic
  variant rule; the 16-piece Wang parapet ring; scupper, hatch, drain sump,
  duct straight, duct elbow; AC unit small and large, each in an
  opened-for-copper state which is the DEFAULT, not the exception. COPING
  COLOURWAYS per district family are the hue carrier and share this form under
  STRUCTURE-NOT-COLOR. A sawtooth roof, a monitor roof or a barrel vault is a
  different silhouette and a different form.

## F. THE CAPTION
```json
{
  "id": "TF-ART-012",
  "name": "commercial flat roof",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": [
    "commercial",
    "strip retail",
    "mall",
    "downtown",
    "industrial",
    "warehouse",
    "self-storage",
    "truckstop",
    "terminal",
    "medical",
    "school",
    "library",
    "courthouse",
    "cityhall",
    "police station",
    "jail",
    "fire station",
    "water treatment",
    "substation",
    "railyard",
    "landfill",
    "ballpark",
    "campus",
    "motel"
  ],
  "best_time": "both",
  "best_location": "the top plate of any non-residential building mass, ringed by its own parapet",
  "place_next_to": [
    "commercial flat roof",
    "parapet cap",
    "cmu block wall",
    "corrugated metal wall",
    "tilt-up concrete wall",
    "civic stone wall",
    "rooftop ac unit",
    "roof hatch",
    "duct run",
    "roof drain sump"
  ],
  "never_next_to": [
    "any ground tile with no parapet or wall between",
    "roof_slope",
    "roof_ridge",
    "roof_eave",
    "roof_hipTL",
    "terracotta roof",
    "residential swamp cooler"
  ],
  "weather_ok": [
    "sunny",
    "cloudy",
    "rain"
  ],
  "acts": [
    1
  ],
  "edge_contract": "wang-16",
  "anim": null,
  "tags": [
    "structure",
    "roof",
    "parapet",
    "hvac",
    "commercial",
    "industrial",
    "civic",
    "most-seen-surface",
    "salvage",
    "dead-world"
  ]
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt — its
  `roof_deck` and `roof_parapet` are the corpus truth this family must sit
  beside without contradicting, and its `wall_0` / `wall_base` /
  `wall_under_eave` are the value calibration for the mass underneath. Their
  GEOMETRY is what fails (no corners, no kit) and their VALUES are what gets
  measured against. Secondary anchor for the metal objects:
  banks/BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt, the repo's blessed reference
  for a dead man-made metal thing at 45 degrees with a sky-lit top and no
  keyline — an AC cabinet is a lamp-bank problem with a different silhouette.
  Value bands and the seam contract come from
  records/target/BOHEMIA_VISUAL_CONSTITUTION.json.
- NAMED OUTSIDE REFERENCE: SimCity 2000 (Maxis, 1993). Its commercial and
  industrial lots are read ENTIRELY off their roofs at a tiny oblique zoom,
  and the trick is exactly three things: a quiet dark flat field, two or three
  dark equipment clusters placed off-centre, and a hard lighter band at the
  parapet that draws the building's outline. That last one is the piece our
  roofs are missing — the bright coping lip is what turns a dark rectangle
  into a building. Take the structure and the sparseness; never take its 8-bit
  saturation or its ramped isometric grid, which are not our projection. The
  SECOND reference is not a game: Ed Ruscha's aerial photographs of Los
  Angeles commercial lots and roofs (the "Thirtyfour Parking Lots" series,
  1967). What to take is the STAIN LANGUAGE — a flat plane that is almost
  entirely empty, with a small number of dark motivated marks (the drip, the
  patch, the oil, the drift) that tell you everything that ever happened there.
  That is M1 and M13 in a photograph, and it is the correct composition for a
  roof. Note Paolo's named bar, Pocket City 2, is already carried by
  TF-WORLD-007 for the roof-kit dressing rule; this form does not restate it.
- REAL-WORLD GROUNDING: Las Vegas commercial stock is a low tilt-up or CMU box
  with a FLAT roof and a parapet, and the parapet is tall in this valley for a
  specific reason — it exists to SCREEN the enormous rooftop mechanical the
  desert demands. From the street you never see a Vegas roof. From our
  45-degree camera you see everything the parapet was built to hide, which is
  the whole design opportunity in this form. The roof itself, on older stock,
  is a built-up roof: multiple plies of asphalt alternated with felt or
  fibreglass, flood-coated and finished with either loose gravel ballast or a
  granulated cap sheet, and Clark County code governs the ballast stone by
  ASTM D448 / D7655. Ballast is nominal 3/4 in stone, which at 17 mm per pixel
  is 1.1 PIXELS PER STONE — so a gravel roof physically cannot be drawn stone
  by stone, and that single conversion decides how this family gets made.
  A CORRECTION TO THE RECORD, since TF-WORLD-007 says white membrane is
  near-universal and chalks: TPO is specifically marketed as non-chalking (it
  is EPDM that chalks), and more importantly a building that has been dead for
  thirty years is OLD stock, so its roof is asphalt built-up or modified
  bitumen, dark, not a bright new single-ply. Newest research wins and the ART
  lane cooks the dark roof. What thirty Mojave years with nobody on the roof
  actually does, concretely: an uncoated dark membrane runs 170F in July and
  cycles down to ambient every night, so the plies expand and contract until
  the laps split in straight lines; the sun bakes the volatile oils out of the
  asphalt until the exposed surface oxidises and cracks into alligator hide;
  trapped moisture blisters between plies and the blisters burst; monsoon
  season runs June 15 to September 30 and haboob leading edges gust 30-60+ mph,
  stripping ballast off the open field and sandblasting everything standing;
  the drains clog and the low spots pond past the 48-hour code limit forever,
  drying into white hard-water mineral rings. And the machines are gone: metal
  theft is a documented Las Vegas economy — LVMPD logged 76 incidents worth
  $735,000 in a single quarter of 2011, and in April 2024 copper thieves hit a
  downtown Las Vegas business ROOFTOP specifically. The standard scavenger move
  on a vacant strip mall is to climb to the roof and pull the AC units apart
  for the copper in the coils. So on our roofs every packaged unit is opened,
  panelless and coil-less, and that is not invented decay, it is what the
  Las Vegas Review-Journal and Fox5 Vegas have been reporting for fifteen years.

## H. DON'T WANT
- NOT a pitched residential roof, and NOT terracotta. A commercial box wearing
  a hipped shingle cap is the "different object wearing a recolour" mistake
  TF-WORLD-007 names, and the approved house skins plus TF-CITY-001's edge
  family already own that language for suburb and trailer only.
- NOT the current `roof_deck` stretched across a warehouse. It is a single cut
  from a painted house street, never seam-measured as a repeating field, and
  it fails M14 at 4.4 points from the ground mean. Repeating it 4,000 times is
  the exact failure the offset test was written to catch (M10; measured wall
  wrap 3.27 mean / 19.52 worst on 7/28).
- NOT individual gravel stones. Nominal 3/4 in ballast is 1.1 px, so drawing
  stones produces a per-pixel noise field — which is literally the measured
  disaster already in the record, `concrete_0` at 99.6% orphan pixels (PIXEL
  CRAFT LAW 1, and Slynyrd's "avoid depicting every single brick as this would
  appear noisy"). Gravel is a few clusters in a varied distribution (LAW 8),
  full stop.
- NOT evenly scattered wear. Every mark names its cause in one word — wind,
  sun, water, theft — and sits in irregular clumps (M1 and M11). A crack that
  answers "nothing" is invented decoration and gets deleted on sight.
- NOT a busy roof field. This family is BACKGROUND (M13): almost the entire
  set is deliberately subordinate, the field is the quietest surface we own,
  and all the contrast is spent on the coping lip, the hatch mouth and the
  unit silhouettes (M3). A roof cooked as lovingly as a courthouse portico
  stops the courthouse being a courthouse.
- NOT a black keyline around the parapet, and no outline anywhere. The turn
  from roof plane to parapet inner face is a VALUE STEP; that is the whole
  point of the 45 law and the constitution's outline rule.
- NOT a flat side-on scroller face (45 DEGREE ART LAW). The parapet shows
  outer face, coping top and inner face. The AC unit is a box with a sky-lit
  top and two faces. The condenser fan is an ELLIPSE, never a flat disc.
- NOT a working machine. Nothing spins, hums, glows or shimmers; no heat haze,
  no fan blur, no condensation plume. Act 1 is dead and even inside the lit 12%
  the machine is still dead (CLUSTERED POWER, LIGHT=TERRITORY).
- NOT intact equipment. An unopened AC cabinet on a thirty-year-dead roof is a
  lie about the world; panels off and coil gone is the default state, not a
  variant.
- NOT bright white membrane. It reads NEW, it breaks the value plan by
  out-valuing the walls, and the research says the old stock that survives to
  act 1 is dark asphalt anyway.
- NOT ponding drawn as blue water. A dry pond is a dark stain inside a pale
  mineral ring; the wet state is a value and saturation shift, never a hue
  (M9: it is a palette, not a redraw).
- NOT green, ever. No moss, no algae, no weathering toward green — this is the
  Mojave and a dead roof grows nothing. NOT purple anywhere near it (PURPLE
  RESERVATION).
- NOT the mall-icon mistake. A roof is not a symbol of what the building is:
  no painted logos, no giant letters, no icon plate. The building says what it
  is with its mass, its parapet colourway and its kit density.
- NOT baked cast shadows in the tiles. Long baked shadows fight their
  neighbours in a tiled world, which is why ours are a runtime layer.

## I. ACCEPTANCE
- [ ] WANG-16 proved: the parapet set closes a plain rectangle AND an L-shaped
      footprint with correct inside corners — the inner corner is built FIRST
      as the test, not last as the afterthought (M12)
- [ ] Seam measured on the Wang centre (the field repeats across hundreds of
      cells): offset-test wrap step within the tile's own internal step, no
      edge-darkening (the desert-pool lesson, M10)
- [ ] Pixel craft gate green: orphan share, single-use colours, block size 1,
      pillow score, cluster density, set-wide palette and detail spread
      (laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md)
- [ ] M14 VALUE SEPARATION, hard fail on a bank cooked from a form: roof field
      to ground and roof field to wall both >= 18 points of mean luminance.
      This is the specific measured failure the form exists to fix (4.4 today)
- [ ] M18 value-first: the greyscale plan exists BEFORE the hue, and the
      greyscale panel of `bohemia_look_again` shows the roof as its own plane
- [ ] M2/M5: the roof field is not busier than the wall below it, and no piece
      runs wildly off the set's median detail
- [ ] Palette ceiling + value band + one-light (upper left) + no-keyline +
      no-dither checks green
- [ ] Squint test at map zoom: a commercial mass must read as a dark plate
      with a bright outline, distinguishable from a residential block
- [ ] 3x3 TILED PROOF SHEET of each field variant — never judged as a lone tile
- [ ] WHOLE-BUILDING PROOF: a warehouse roof plate with its full parapet ring,
      one hatch, two AC units, a duct run and a ponded low spot, at the
      intended density, to prove it reads varied without reading busy
- [ ] ON THE REAL SURFACE: a commercial district and an industrial district
      screenshotted in the CITY tab and on the RUN, beside today's two-tile
      render for contrast
- [ ] Caption JSON parses and matches sections C/D
- [ ] ENGINE PRECONDITIONS NAMED, not solved here: no roof-plane case in the
      runtime shadow pass, and no prop layer above roofs in the run

## J. ADMIN
- STATUS: APPROVED 8/11/26 AND WIRED 8/11/26: the parapet ring is live on every 'roof edge' cell (downtown oxide, civic bone, industrial galv - library/chapel/courthouse/downtown read their coping now) and 'rooftop plant' cells wear the duct pieces, in the RUN tab. The RTUs (88x86, not cell-integer) and hatches are the open volume; the roof FIELDS still come from the 8/1 civic pool. VOLUME 8/15/26: the dead mechanical is on - rtu_small/large drawn as multi-cell props at uniform tile scale (no resample, right-bottom anchored so the cell loop never stomps them, one roll per 4-column block so units never collide), hatch, drain sump, pulled panel on interiors; scupper on south runs 1-in-7; galv sand drifts n/e 1-in-11. Verified live on a commercial roof; card reshot. | REQUESTED BY: ART lane (own queue, breaking down board row 7)
  | DATE: 7/29/26 | PRIORITY: HIGH
- BOARD ROW #: 21 | VERDICT: —
