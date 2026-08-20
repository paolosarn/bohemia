# TILE FORM TF-ART-016 — SOLAR / BATTERY YARD FAMILY (the power-district kit)

## A. IDENTITY
- NAME (plain words a person would say): The solar yard stuff — the ranks of
  tilted dark panels you look down onto, the end of a panel row, the bare steel
  post rank where the panels are gone, the transformer pad, and the two-track
  service lane that runs between the rows
- FAMILY/SET: SOLAR & BATTERY YARD family, ONE drawing job, FIVE members that
  share one steel-glass-caliche vocabulary, one value skeleton and one light:
  (1) PANEL ARRAY FIELD — the repeating surface of a panel table seen from the
      3/4 above, the unit that repeats down a row;
  (2) PANEL ROW END — the head of a table: torque-tube stub, end bearing, the
      one place the array's silhouette actually stops;
  (3) MOUNTING POST RANK — the driven-pile + bare-rack line, panels missing,
      the skeleton of the same object (this is what a stripped array IS);
  (4) INVERTER / TRANSFORMER PAD — the concrete pad with its box on it, the
      thing that anchors every array block and every battery row;
  (5) GRAVEL MAINTENANCE LANE — the O&M two-track dressing between the rows.
      NOT a new ground material: it is a dressing laid on the APPROVED
      `yard_0/1/2` gravel (see the shopping check — that one is a real hit).
- THE JOB, ONE SENTENCE: this family exists so the two registered power
  districts read as power — rank, shadow and steel — instead of as fields of
  pale suburban house stucco standing on generic dirt, which is exactly what
  both of them render as today.

## B. WHY (the need — no ruling, no tile)
- DEMANDED BY: the ART lane's own queue, breaking down board row 7 (ACT-1
  TILESET REMAINDER), against two districts that are REGISTERED AND GATED and
  therefore already promise these pixels to the machine. engine/bohemia_solar.js
  registers codes 7 `solar panel`, 4 `inverter / transformer pad`,
  6 `substation switchgear`, 1 `gravel access road`; engine/bohemia_battery.js
  registers 8 `inverter / transformer rack`, 4 `gravel yard`, 13 `cable trench`,
  1 `access road`. gates/solar_gate.js asserts, in its own words, "every farm has
  panels + switchyard + inverters + control building" AND "every tile named + no
  big blank void (EXPLAIN-EVERY-TILE)" — so the gate is green on a district
  whose named tiles have no art. The DISTRICT DOSSIER LAW half is already ruled
  too: solar's LAYERING note says the arrays "sit on waist-to-head-high racks and
  block movement — you route BETWEEN them on the gravel roads". That is a layer
  ruling I must obey, not re-litigate.
- THE CANON SPLIT I MUST CARRY, NOT RESOLVE: the two districts are deliberately
  in OPPOSITE states and both notes say so out loud. Solar's dossier: "this plant
  is INTACT + generating while the world is dead — panels/switchgear read
  maintained (eerily perfect), NOT decayed", which is the CLUSTERED POWER lore.
  Battery's dossier: "Act-1 DEAD: containers cold, HVAC fans stopped, inverters
  dark and oil-stained". So this family ships in TWO STATES OFF ONE GEOMETRY —
  MAINTAINED and DEAD. Under STRUCTURE-NOT-COLOR that is legal and it is not
  progress: same silhouettes, different wear and different ramp. The five shapes
  are the progress; the two states are the range.
- COLLISIONS, DECLARED UP FRONT (the board already carries C1/C2/C3 of this
  kind, and filing a fourth quietly would be the same failure):
  - **C-SOLAR: records/tileforms/TF-RUN-007_solar_panel_array.md is the same
    object.** That form owns the PANEL as an object and the frozen-tracker story
    hook, and it is the senior form — its district-material survey counted
    `solar panel` x354 per cell. THIS form is not a re-file of it. What this one
    adds and TF-RUN-007 does not have: the four NON-PANEL members (row end, post
    rank, inverter pad, service lane), the battery yard as a second consumer, the
    two-state maintained/dead split the two dossiers demand, and the measured
    pixel budget in section E. It also CORRECTS one factual clause in TF-RUN-007
    ("spiderweb fracture patterns") — see section H; tempered glass laminated to
    EVA does not spiderweb. **MERGE BEFORE COOKING.** Whichever survives keeps
    TF-RUN-007's frozen-tracker hook and this form's E-section budget and H-section
    physics.
  - **C-GRAVEL: records/tileforms/TF-RUN-002_gravel_ballast_ground.md owns the
    gravel ground family**, and it counted `gravel access road` x1150 and
    `gravel yard` x891 in exactly my two districts. Member 5 here is therefore a
    DRESSING (wheel tracks, crown, palliative crust), not a second gravel family.
    If the ART lane judges the dressing too thin to be its own tile, it folds
    into TF-RUN-002 as a variant and this form loses a member. That is the
    correct outcome and I am naming it in advance.
  - NOT IN THIS FORM, deliberately: the battery CONTAINER (a different
    silhouette, therefore a different form by rule 1), the substation switchgear
    rack, the control building, and the perimeter fence (TF-ART-004 /
    TF-RUN-003 already collide over that one; I am not making it a three-way).
- WHAT LOOKS BROKEN TODAY WITHOUT IT: a solar farm is drawn as several hundred
  tiny squares of `wall_0/1/2` — "pale cracked stucco wall" — standing on
  `dirt`, "the graded dirt every lot sits on". So the single most recognisable
  industrial silhouette in the Mojave currently reads as a housing tract that
  someone shrank. The inverter pads and the transformer racks draw as the same
  stucco, which means the objects that make the district a POWER district are
  invisible. And the battery yard, whose whole story is that it is dark while
  the solar farm next door is lit, has no material with which to be dark.
- SHOPPING CHECK (records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md walked in
  full, and the banks OPENED, not name-dropped — REUSE-FIRST):
  - banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt — the frozen CBB 42,
    enumerated by id. THREE relevant findings. (a) `wall_window`, described in
    the bank as "dead dark glass, never a shrunk copy", is the ONLY approved
    dark-glass pixels in the entire corpus and is the CLOSEST NEAR-MISS in the
    whole shop. It fails for a reason the bank states itself: it is a vertical
    pane locked into a stucco wall cell and it is approved for use WHOLE at its
    own size, so it can never be re-cut into a tilted plane on posts. It is
    still useful — as the VALUE TARGET for dead glass, which is how section G
    uses it. (b) `yard_0/1/2` "the dead gravel yard surface" is a REAL HIT for
    member 5, so member 5 becomes a dressing over approved pixels rather than a
    cook — that is the shopping law working, and it is why this form asks for
    less than it walked in intending to ask for. (c) `concrete_0/1` "a poured
    concrete path or driveway slab" is the inverter pad's SLAB; only the box on
    top of it is new.
  - banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt — opened and searched.
    It holds a real entry, `{"district":"solar","variant":"iconic"}`, labelled
    "Solar — matched: a FIELD of tilted PV panel rows + a control building +
    inverter pads + substation switchgear", and its battery twin, "a grid
    BATTERY-STORAGE yard (control building + rows of BATTERY CONTAINERS with
    HVAC + an INVERTER/TRANSFORMER rack + gravel + fence)". Semantically that is
    the closest thing in the repo to this ask. It is DISQUALIFIED on two counts
    and both matter: it is a district HERO CARD (a map-scale icon of a whole
    district), not a walkable tile family — and the index flags this exact bank
    as UNJUDGED under "THE INVERSION", unjudged art already carrying more
    plumbing than approved art. Leaning on it as cover would be the inversion
    itself, so it is named and refused.
  - banks/BOHEMIA_HD_TILE_REPO_part1.txt through
    banks/BOHEMIA_HD_TILE_REPO_part4.txt — all four searched for solar /
    photovoltaic / panel. Every single hit is base64 noise inside the image
    payloads ("BsOlArOTQ", "xSOLAr"), not a tile name. There is no PV pack in
    the 87 judged packs.
  - banks/BOHEMIA_SEAM_FIXED_SURFACES_7_14_26.txt — the flagged zero-consumer
    605: dirt path, cracked concrete, metal floor, water, roof, burned ground,
    cobblestone, stone paths. No tilted plane, no equipment pad.
  - banks/BOHEMIA_DESERT_POOLS_7_18_26.txt — desert / rock / rubble, natural
    ground only, and the ground half is measured broken anyway.
  - banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt and
    banks/BOHEMIA_MARKING_BANK_7_17_26.txt — asphalt roadway, stall lines,
    arrows. Nothing off-road, nothing structural.
  - banks/BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt — seven dark lamp heads. Not
    an array, but genuinely the nearest approved "dark manufactured object
    standing in daylight", so it is kept as a tonal anchor in section G.
  - banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt (subdivision boundary wall),
    banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt (residential stucco, roof,
    window), banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt (12 room buckets) — all
    the wrong language entirely.
  - CONCLUSION: one real hit (`yard_0/1/2`, taken), two useful anchors
    (`wall_window`, `concrete_0/1`, taken as anchors not as pixels), one
    disqualified near-miss (the unjudged solar hero card), and a genuine hole
    for the four structure members.

## C. WHERE (place — the game code reads this)
- SURFACE + TAB: RUN (the walk) and CITY (human mode). It also has a real MAP
  presence — a solar farm is the clearest Lynch landmark available in a flat
  valley, visible as a rank pattern from altitude — so the squint test applies
  to this family and does not apply to most of the board.
- DISTRICT FAMILIES it appears in: solar (all five members), battery (members 4
  and 5, plus member 3 as yard racking), substation (member 4 only — the pad
  language is shared). Single panels may later appear on off-grid roofs; the
  ARRAY belongs to solar.
- LAYER (exactly one: ground / structure / overhead / prop / portal): structure
  — this is the dominant layer and it is what four of the five members are, and
  it matches the ruling already written into solar's own dossier. The fifth
  member, the maintenance lane, is a ground dressing and ships as a variant
  request against the approved gravel rather than as a new family; if the ART
  lane wants it under its own layer it splits into its own form, because I am
  not filing a duplicate ground family over a lane.
- SOLID? (yes/no) — ENTERABLE? (yes/no; if portal, what is INSIDE): yes, solid,
  for members 1-4: the dossier says you route BETWEEN the rows on the roads and
  the field is not a walkable floor. No, not enterable, for any of them. NOTE
  and do not pre-empt: solar's dossier also says "panels could later be a
  walk-under overhead in spots, but for now treat the array as solid". That
  later ruling is not mine to make in a tile form; if it is ever made, member 1
  gains an overhead variant and the underside shading already specified here is
  what makes it possible.
- MUST SIT BESIDE (its seam partners, by name): itself along the row axis; its
  own row end at both ends of a table; the approved `yard_0/1/2` gravel and the
  member-5 lane dressing in the aisles; the post rank where panels are gone;
  the inverter pad at the head of each block; chain-link at the site boundary;
  the cable trench running behind a row; the concrete apron of the control
  building.
- NEVER BESIDE (placements that would read wrong): never beside any residential
  material — stucco house wall, terracotta roof, a residential window or a lawn;
  never beside interior floors; never directly against a street kerb (a real
  array is set back behind fence and setback, and a panel touching a sidewalk
  reads as a billboard fallen over); never beside a living green plant, ever.
- EDGE CONTRACT (exactly one): SELF-SEAMLESS along the row axis for members 1,
  3 and 5, with a DECLARED PHASE so the module frame lines and the pile spacing
  register across the tile boundary instead of stuttering every 44 px. Members 2
  and 4 (row end, inverter pad) are SINGLE PLACEMENT — never repeats. Because a
  seamless contract is claimed, every touching edge will be MEASURED: the offset
  test (M10), interior-vs-edge value delta and wrap discontinuity against the
  normal neighbour step. This family is the one on the board most likely to fail
  that test, because a rank of identical hard-edged dark rectangles is the exact
  shape that turns a wrap error into visible banding every tile.

## D. WHEN (time & state — the invisible-caption inputs)
- ACT: 1 (Act-1-only law; the two-state maintained/dead split below is not an
  act split, it is two districts in act 1 that the existing dossiers already
  put in opposite conditions)
- BEST TIME (day / night — what changes at night): BOTH, and the two districts
  diverge, which is free atmosphere. By day the panel top is near-black against
  pale caliche gravel — the largest legal value gap available in the game. At
  night the DEAD battery yard's array vanishes completely into the dark, while
  the MAINTAINED solar farm is the one place in a 12%-lit valley with owned
  light: the glass still stays dark (it emits nothing), but the inverter pads,
  the control building and the switchyard carry the light. LIGHT=TERRITORY is
  loud here — this district is literally the power supply, so whoever holds it
  is whoever has light, and the caption should carry that so the CITY can use it.
- WEATHER STATES it must survive: sunny baseline. Cloudy — the glass loses its
  sky reflection, so it goes FLATTER and very slightly lighter, not darker.
  Rain — no separate wet family needed (M9: wet is a palette, not a tileset),
  but rain is the only thing that ever washes a Mojave panel, so a wet panel is
  briefly the darkest and cleanest surface in the game, and the gravel lane's
  wheel tracks hold water in two long parallel strips while the crown between
  them stays pale. That is a real observed thing and it is one palette away.
- LIT/UNLIT variant needed? (LIGHT=TERRITORY: who owns the light?): YES for the
  solar district — the inverter pad and the row-end get a LIT variant, owned,
  because the plant is generating. NO for the battery yard, which is dark by
  canon. The GLASS never lights in either state: nothing emissive on a panel,
  ever (see section H).
- ANIMATION (static, or loop: frames + beats at 120 BPM): STATIC, all five
  members. The frozen-tracker story is a PLACEMENT hook, not an animation — the
  controllers died and the rows stopped at different angles and never moved
  again. Named but NOT requested here: under M16 the heat-shimmer / sky-slide
  across a rank of glass is a palette CYCLE candidate rather than a frame set,
  which needs indexing (M9) and is a renderer job, not this form's ask.

## E. HOW (build spec — the art lane's one-shot recipe)
- EXACT SIZE in px (and footprint in tiles): 44 px cell, THE CORPUS CELL, and
  the whole of this section runs off the conversion that follows.
  **CELL_M = 0.75 m at 44 px, so 1 px = 1.70 cm and 1 m = 58.7 px.** Footprints
  come from the engine that already places these things, not from imagination:
  a panel TABLE is `M(6)+1` x `M(3)` = **9 cells long x 4 cells deep** (6.75 m x
  3.0 m); row pitch is ROWH+GAP = **9 cells (6.75 m)**, leaving a **5-cell
  (3.75 m) aisle**; the O&M road is `M(3)` = **4 cells (3 m)** wide; the
  inverter pad is **3 x 4 cells (2.25 m x 3.0 m)**, which is pad-mount
  transformer size and correct.
- **THE MEASURED DETAIL BUDGET — the anti-blotch table.** This is the part of
  the form that exists so nobody paints a 22 cm smear and calls it wear (22 cm
  is 13 px, a dinner plate of rust; on a real array nothing that size exists):
  - module aluminium frame, 35-40 mm -> **2 px**. This is the ONE hard line in
    the whole family and it carries the entire read. Everything else is softer
    than it.
  - gap between two modules on the same table, ~20 mm -> **1 px**. This is the
    orphan-pixel trap named exactly: a lone dark pixel per module boundary,
    repeated across the tile, is LAW 1 noise by definition. Let two or three
    modules share one 1 px break, in irregular clumps (M11), and leave the rest
    of the run unbroken.
  - a PV cell, 156 mm (M2) or 182 mm (M10) -> **9 to 11 px**. Big enough to
    draw, which is precisely why it must not all be drawn: a full 9 px
    checkerboard across a 44 px cell is the measured 74%-orphan / 99.6%-orphan
    disaster, and it is Slynyrd's "avoid depicting every single brick" verbatim.
    Budget: at most THREE implied busbar lines per tile, never a grid.
  - cell interconnect ribbon, 1.5 mm -> **0.09 px**. Sub-pixel. Never drawn.
  - the glass itself, 3.2 mm thick -> **0.19 px**. Sub-pixel. The panel has no
    drawable thickness; its edge is the frame, nothing else.
  - W6x9 driven pile, 6 in flange -> **9 px wide**, standing 36-48 in above
    grade -> **53 to 71 px, i.e. 1.2 to 1.6 cells tall**. The post rank is a
    cell-and-a-half object, not a detail.
  - torque tube, 100-150 mm diameter -> **6 to 9 px**. It is a real drawable
    cylinder and it is what makes the row end read as an end.
  - an M8 flange nut and washer, ~24 mm -> **1.4 px. SUB-PIXEL.** Therefore
    fastener rust is NEVER a dot at the bolt. It is the RUN-STREAK below it:
    100-300 mm -> **6 to 18 px** of one-step-warmer value trailing down the
    galvanised face. That single sentence is the difference between motivated
    wear (M1) and scattered decoration.
  - a PV string cable, 6 mm -> **0.35 px**. Sub-pixel. The failed-cable-tie
    droop (see WEAR) is a **1 px line, one value step off the underside shade**,
    never a rendered cable with a highlight on it.
  - O&M road aggregate, 3/4 in -> **1.1 px**. One stone is one pixel, so a
    stone is never drawn. Gravel is 3-6 px clusters in irregular clumps, which
    is LAW 8 and is exactly what the approved `yard_0/1/2` already does.
- VIEW: 45-degree world view (law), and this family is the sharpest test of it
  on the entire board, because a panel IS a tilted plane and nothing else. You
  see: the sky-lit TOP FACE foreshortened; the near long edge of the frame as a
  2 px lit lip; the UNDERSIDE in the deepest shade in the district; and the post
  rank standing under it with daylight and ground visible between the piles.
  The face/top split is the whole object. A flat dark rectangle lying on the
  ground is not a shortcut, it is a different object (a hole).
- PALETTE: constitution ceiling, and a SUBSET of the one master palette (M17) —
  this family may not invent a colour. STRUCTURE value band, and it legitimately
  sits at the DARK END of it, which is unusual for this game: if the band
  cannot hold it, that is REPORTED as a finding, never fixed by lightening the
  glass into unreality. Ramp: 5-7 steps per material, hue-shifted, three
  materials only — dead glass (warm dark, see WEAR), galvanised steel (cool
  pale grey to chalky white), caliche gravel (warm pale). VALUE SKELETON FIRST,
  IN GREY (M18), and it is easy to state here: lane brightest, post rank mid,
  panel top dark, panel underside darkest. M14's 18-point separation between
  adjacent layers is not a struggle for this family — it is the one place on the
  board where the honest material gives us the biggest gap in the game for free.
- LIGHT: the ONE global light direction, upper LEFT. NO keyline. NO dither.
  The pairwise tell that proves the key landed, in the shape pixel_craft_gate
  already uses: the upper-left long edge of the frame is the lit face and must
  measure lighter than the lower-right edge, and the underside gap between panel
  and ground must be the darkest measured region in the family. The regular
  module rhythm must be declared to the dither check the way the fence and the
  metal siding were, so a legitimate repeating structure is not read as stipple.
- SHADOWS: none baked (separate-layer law). But the art lane must KNOW the
  shadow that is coming, because this is the family where a baked one would do
  the most damage: at 45 a table throws a hard band clean across the 5-cell
  aisle, and the array's ENTIRE read at distance is rank-plus-shadow. Bake it
  and it doubles with the runtime pass and the district dies.
- SCALE ANCHORS (what fixes its size): the 2-cell door law; a human at 1.75 m =
  **103 px = 2.3 cells**; a car at 2x3 tiles for the aisle. The high edge of a
  panel table sits at roughly 2.0 m = **2.7 cells — taller than a person.**
  **[DID-NOT-DECIDE, flagged not guessed]** that contradicts
  records/tileforms/TF-RUN-007_solar_panel_array.md, which says "the player
  should be able to see OVER the rows". The engine's own dossier is on the side
  of not-seeing-over ("you route BETWEEN them"), and a 2 m table is what a real
  tracker measures, but this is a GAMEPLAY READ question and it belongs to
  Paolo or to the merge in C-SOLAR, not to me quietly picking one.
- WEAR LEVEL (this is a dead world): TWO STATES OFF ONE GEOMETRY, and every mark
  answers "what did this?" in one word (M1).
  **MAINTAINED (the solar farm — CLUSTERED POWER canon, "eerily perfect"):** the
  smallest wear budget of anything on the board, and that is the point. Even a
  running Mojave plant loses 1-5% a month to soiling under 4 inches of annual
  rain, so the glass carries a thin, EVEN dust haze — matte, never glossy. But
  the frames are straight, the ties are intact, the streaks are absent. It is
  unsettling because it is clean, and it must be cooked to be clean on purpose.
  **DEAD (the battery yard, and any stripped block):** thirty summers.
  - SUN: the EVA encapsulant browns under UV, so a dead panel is **not black —
    it is a dark, warm, tea-brown black**, and the browning is uneven across a
    module because it follows where the cells are. That is the single most
    useful colour fact in this form and it is what separates our dead array from
    every stock photo of a live one.
  - SUN, second face: the polymer backsheet embrittles and CHALKS, so the
    underside goes chalky and PALER with age. The shaded face is therefore less
    dark than instinct says on a thirty-year panel, and more dark on a
    maintained one. Two states, one shape, different value skeleton.
  - IMPACT/HEAT: the 3.2 mm glass is TEMPERED and laminated to EVA. Cracks start
    at the frame and the mid-clamp, and the sheet then goes to a fine granular
    crumb THAT STAYS IN PLACE, held by the laminate — like a car side window
    that shattered and did not fall out. It reads as a **milky, lighter, flat
    rectangle**, never as a spiderweb and never as a hole.
  - CONTACT: UV-stabilised nylon cable ties last 5-10 years outdoors. At thirty
    years EVERY tie has failed, so the DC harness hangs in slack loops under the
    tables. 1 px lines, one value step off the underside. This is the most
    readable single sign of death in the whole family and it costs almost
    nothing.
  - WATER/SALT: galvanised steel does NOT rot wholesale — zinc protects bare
    steel up to about a quarter inch and heals 1-2 mm laterally, so the piles
    stay straight and go chalky white with zinc-carbonate bloom. Rust appears
    ONLY where the exposed area beat the zinc: **cut pile ends, field-drilled
    holes, and bolt seats — the fastener washers first** — and it appears as the
    6-18 px streak below, never as a patch.
  - PEOPLE: the copper is gone. Trench lids levered off, combiner boxes hanging
    open and gutted, the pad's copper ground ring dug out of the caliche. This
    is the mark that says people came, and it is the only wear in the family
    that is not weather.
  - GROUND: the dust palliative crust has broken into plates; the lane keeps its
    two wheel tracks and its crown because compacted caliche does not heal.
  - NOTHING GREEN. In the real world the shade under an abandoned array is the
    one place anything grows; act 1 forbids it, so what is caught against the
    piles is DEAD brush — which battery's own legend already codes (code 3).
- VARIANTS (how many, what varies): five members x two states (maintained /
  dead) is the spine. Within DEAD, member 1 gets three sub-states off the same
  geometry: intact-but-browned, crumbed (milky), and stripped-to-rack (which is
  member 3 doing its job). Colourways only beyond that — a recolour is never
  progress (STRUCTURE-NOT-COLOR), and with M9 indexing the night and wet states
  are palettes, not new drawings.

## F. THE CAPTION (ships with the tile — machine-readable, the game reads it)
```json
{
  "id": "TF-ART-016",
  "name": "solar / battery yard family",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": [
    "solar",
    "battery",
    "substation"
  ],
  "best_time": "both — near-black glass against pale caliche gravel is the largest value gap in the game by day; the dead battery array vanishes at night while the maintained solar farm is the one owned light in a 12%-lit valley",
  "best_location": "long parallel panel rows with a 5-cell service aisle between them, an inverter pad at the head of each block, set back behind the site fence and never against a street kerb",
  "place_next_to": [
    "solar / battery yard family",
    "panel row end",
    "mounting post rank",
    "inverter / transformer pad",
    "gravel maintenance lane",
    "dead gravel yard",
    "chain-link fence",
    "cable trench",
    "control building apron"
  ],
  "never_next_to": [
    "house stucco",
    "terracotta roof",
    "residential window",
    "dead lawn",
    "interior floors",
    "street kerb",
    "any living green plant"
  ],
  "weather_ok": [
    "sunny",
    "cloudy",
    "rain"
  ],
  "acts": [
    1
  ],
  "edge_contract": "SELF-SEAMLESS along the row axis with a declared frame/pile phase for the array field, the post rank and the lane; SINGLE PLACEMENT for the row end and the inverter pad",
  "anim": null,
  "tags": [
    "structure",
    "glass",
    "steel",
    "dark-value",
    "power",
    "landmark",
    "map-readable",
    "regular-pattern",
    "two-state",
    "maintained-or-dead",
    "light-is-territory",
    "background-subordinate"
  ]
}
```

## G. REFERENCES (all three required)
- APPROVED ANCHOR (nearest approved corpus item + where it lives):
  banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt, the frozen CBB 42, supplies
  four anchors and one of them is actual pixels. `wall_window` — "dead dark
  glass, never a shrunk copy" — is the VALUE TARGET for dead panel glass and the
  only approved dark glass in the corpus. `yard_0/1/2` "the dead gravel yard
  surface" is the LANE's actual base and gets reused, not redrawn. `concrete_0/1`
  "a poured concrete path or driveway slab" is the inverter pad's slab. And the
  `wall_end_l` > `wall_end_r` pair is the one-light ruler this family will be
  measured against. Secondary: banks/BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt, the
  nearest approved "dark manufactured object standing in daylight" and therefore
  the closest tonal precedent for a near-black object that still has to read.
- NAMED OUTSIDE REFERENCE (a real game/artwork, named, and WHAT about it):
  **Jamey Stillings, "The Evolution of Ivanpah Solar" (Steidl, 2015)** — four
  years of aerial photography of a Mojave solar plant, shot from a chartered
  helicopter and, crucially, flown ONLY during the long-shadow hours of first
  and last light, published as monochrome. What to take, specifically: the array
  reads as RANK PLUS SHADOW, and it reads in GREY, at distance — the individual
  panel is never the subject and the texture of the glass is never the subject.
  That is M18's value-first method and M14's greyscale check arriving from the
  outside, aimed at exactly this asset. Honest caveat so nobody cooks the wrong
  thing: Ivanpah is solar-THERMAL, 347,000 flat heliostats around three towers,
  so it is a reference for the READ and never for the construction. Two games,
  for two different lessons: **Factorio**'s solar field (already named by
  TF-RUN-007, kept deliberately so the merge inherits it) for the one sentence
  that governs member 1 — the ARRAY is the object, not the panel; and
  **SimCity 2000**'s Solar Power Plant, which draws an entire panel field as one
  dark 3/4 block with a couple of implied ridges and still reads instantly at a
  fraction of our 44 px cell, which is the restraint argument (M8) made by a
  1993 tile.
- REAL-WORLD GROUNDING (the real Las Vegas thing this is, researched — what it
  is made of, what it looks like after years of sun and no water): Clark County
  is ringed with the real thing. **Nellis Solar Power Plant** sits on 140 acres
  at the west edge of Nellis AFB: 72,416 panels on **5,821 SunPower T20
  single-axis trackers**, rows running north-south, rotating east to west
  through the day. South of town, the **Eldorado Valley** outside Boulder City
  holds a **greater-than-1-gigawatt complex on roughly 4,000 acres** — Copper
  Mountain (802 MW), Nevada Solar One (64 MW), Boulder Solar (150 MW), Techren
  (300 MW, five separate facilities) — and Techren's granted easement is
  specifically for a **dirt maintenance road**, which settles member 5: the O&M
  lane is graded native caliche with a gravel skin, not imported crushed rock.
  CONSTRUCTION: **W6x9 galvanised wide-flange piles driven 6 to 8 feet deep with
  36 to 48 inches standing above grade**, carrying the torque tube. The local
  wrinkle that matters visually is **caliche** — the valley's calcium-carbonate
  hardpan causes driven-pile REFUSAL often enough (30-50% of attempts in hard
  caliche layers) that piles get pre-drilled or relocated two to three feet,
  **so even a brand-new Vegas array has piles that are not perfectly on line.**
  That single fact is what saves the drawing from looking CAD-generated. The
  ground is regulated: **Clark County Department of Air Quality requires a Dust
  Control Operating Permit at 0.25 acres of disturbance**, and after a 30-day
  pause in work it requires long-term soil stabilisation — a dust palliative,
  gravel, or a deliberately-grown soil crust — which is literally the surface
  this array stands on and is why it is crusted plates, not loose sand. WHAT
  THIRTY YEARS DOES, concretely: **soiling** runs 1-5% per month with under 4
  inches of rain a year, so uncleaned output falls 25-40% in a single year and
  the glass is permanently haze-matte, never mirror; **UV browns the EVA
  encapsulant** to a warm tea cast and the acetic acid it releases corrodes the
  solder joints; **the polymer backsheet embrittles, cracks and chalks pale on
  the underside**; **the tempered 3.2 mm glass cracks from the frame and the
  mid-clamps** and, being laminated, goes to a granular crumb that stays in
  place as a milky sheet; **UV-stabilised nylon cable ties survive 5 to 10
  years**, so at thirty every one has failed and the DC harness hangs in loops;
  **galvanised steel does not collapse** — zinc sacrificially protects bare
  steel up to about a quarter inch and heals 1-2 mm laterally, so the racking
  stays geometrically crisp and blooms chalky white zinc carbonate, with real
  rust appearing only at cut ends, field-drilled holes and **bolt seats — the
  fastener washers first**. And the human half, which is current and local, not
  speculative: **copper theft is endemic to Nevada power infrastructure** —
  thieves pulled wire out of the breaker boxes at an NV Energy substation in the
  Las Vegas valley and blacked out customers, three arrested, about $30,000 of
  wire and damage — so a dead yard has its trench lids levered off, its combiner
  boxes gutted and its ground ring dug out, while the panels themselves, worth
  nothing without a grid, still stand.

## H. DON'T WANT (the anti-reference — kills revision rounds)
- **NOT a flat dark rectangle lying on the ground.** This is the primary failure
  mode for this family: a top-down black slab reads as a HOLE, not a panel. A
  panel is a tilted plane with posts under it and daylight between them
  (45 DEGREE ART LAW).
- **NOT a flat side-on scroller face.** Same law, other direction.
- **NOT glossy mirror-blue.** Clean specular panels are the stock-photo cliché
  and they are wrong here twice: Mojave glass is dust-haze matte within weeks,
  and a THIRTY-YEAR panel is warm brown-black from EVA browning, not blue at all.
  Blue glass would make the whole district look alive.
- **NOT the drawn cell checkerboard.** A PV cell is 9-11 px, exactly the size
  that tempts a full grid across a 44 px tile, and a full grid is the measured
  74%-orphan disaster (PIXEL CRAFT LAW 1) and Slynyrd's "avoid depicting every
  single brick... avoid emphasizing the outlines" (LAW 8) word for word. Three
  implied lines, not a grid.
- **NOT spiderwebbed glass.** This is a factual correction to
  records/tileforms/TF-RUN-007_solar_panel_array.md, which asks for "spiderweb
  fracture patterns". Tempered glass laminated to EVA does not spiderweb and
  does not fall out — it dices into a granular crumb held in place and reads as
  a milky flat rectangle. Drawing a spiderweb draws annealed window glass, which
  is a different material in a different building.
- **NOT rust drawn AT the bolt.** An M8 washer is 1.4 px. Any rust mark you can
  actually see at the fastener is at least a 6 px blob, which is a 10 cm scab,
  and a 22 cm smear is 13 px, a dinner plate. Rust is the streak BELOW, 6-18 px,
  and nothing else.
- **NOT a rusted, sagging, collapsed array.** Wrong climate. Galvanised steel in
  dry desert stays straight and blooms chalky white; a rust-eaten drooping rack
  is a coastal or humid-continental object and contradicts the grounding above.
- **NOT sci-fi.** No emissive edges, no energy lines, no glowing seams, no blue
  or violet light anywhere near this — that would breach the glow ceiling and
  run straight at the PURPLE RESERVATION.
- **NOT green.** Nothing living, even though the shade under a real abandoned
  array is the one place in the desert where something would grow. Act 1 is a
  dead world and this is the tile most likely to tempt an exception.
- **NOT louder than the buildings it stands near.** M13: this family is
  BACKGROUND and most of it is deliberately subordinate. A big dark shape invites
  over-detailing; the array earns its read from rank and value, not texture. M2
  binds the lane specifically — the ground member must measure QUIETER than the
  structure members, and the last time a set was cooked without asking that, the
  floor came out 1.7x busier than the buildings on it.
- **NOT randomly scattered wear.** M1/M11: the tracker misalignment is per-ROW
  (one controller died at one angle, so the whole row is out of step), not
  per-panel; the pile wander is per-PILE and caused by caliche refusal. Both are
  motivated. Evenly-spaced random speckle is the worst of both worlds and is what
  got the last set called slop.
- **NOT every table identical and perfectly on line either.** The frozen-tracker
  mis-step is the approved district hook and the caliche pile wander is real; a
  flawless CAD field throws both away.
- **NOT baked shadows.** The whole distant read of this family IS the shadow
  band across the aisle, and a baked one doubles with the runtime pass and
  destroys it (Slynyrd's own caveat, and our separate-shadow law).
- **NOT a new gravel family for the lane.** `yard_0/1/2` is approved and indexed,
  and the shopping law says cooking a substitute for an indexed asset is a
  violation. The lane is a dressing over those pixels or it does not exist.

## I. ACCEPTANCE (what the machine proves BEFORE Paolo ever sees it)
- [ ] Seam measured on the SELF-SEAMLESS members (array field, post rank, lane):
      offset test (M10), wrap delta within the normal neighbour step, frame and
      pile phase register across the boundary, no edge-darkening (the
      desert-pool lesson), verified over a 10-tile run and not just one wrap
- [ ] Pixel craft gate green: orphan share, single-use colours, block size 1,
      pillow score, cluster density, set-wide palette
      (laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md)
- [ ] M2 FLOOR IS QUIET: the lane member measures QUIETER (fewer clusters per
      1000 px) than the panel and post members
      (laws/BOHEMIA_PIXEL_MASTERY_LAWS_7_28_26.md)
- [ ] M14 LAYERS SEPARATE IN VALUE: at least 18 points of mean luminance between
      the lane (ground) and the panel top (structure), proved in GREYSCALE, not
      by hue
- [ ] M18 VALUE SKELETON: the greyscale plan (lane bright, post rank mid, panel
      top dark, underside darkest) exists BEFORE hue and the cooked family
      matches it
- [ ] Palette ceiling + STRUCTURE value band + one-light pair check green: the
      upper-left frame edge measures lighter than the lower-right, and the
      underside is the darkest region in the family. If the dark end of the band
      cannot hold the glass, that is REPORTED, never fixed by lightening it
- [ ] Regular module rhythm declared to the dither check; glow check green (zero
      emissive pixels anywhere in the family)
- [ ] Squint test at map zoom: a solar district is identifiable as a solar
      district from rank and shadow alone, in greyscale
- [ ] 3x3 TILED PROOF SHEET rendered — never judged as a lone tile — PLUS a
      four-row field proof with aisles, one row frozen at a different angle, and
      one block stripped to the post rank
- [ ] BOTH STATES proved side by side: the maintained solar array and the dead
      battery-yard array, same geometry, so the two-state claim is visible rather
      than asserted
- [ ] ON THE REAL SURFACE: screenshot in place in the solar district standing on
      the approved `yard_0/1/2` gravel, beside the approved anchor named in G,
      and beside the current all-stucco render for the before/after
- [ ] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: COOKED AND WIRED (8/19/26) | REQUESTED BY: ART lane (own queue,
  breaking down board row 7) | DATE: 7/29/26 | PRIORITY: MED
- BOARD ROW #: 25 | VERDICT: shipped under EVERYTHING IS A THUMB (8/9)
- WIRED 8/19/26. THE MERGE THE FORM ORDERED HAPPENED FIRST: TF-RUN-007 is
  MERGED INTO this form (its status carries the merge record) - this form
  survives with 007's frozen-tracker placement hook; 007's spiderweb clause
  is corrected (tempered glass laminated to EVA goes to a milky crumb held
  in place); 007's see-over-the-rows clause LOSES to the district dossier's
  locked layering ruling (waist-to-head-high, route BETWEEN the rows).
  MEASURED FIRST on the walked world: solar's panel tables are 27 or 36
  cells long x EXACTLY 4 deep (the 9-cell tables butted in threes and
  fours), pads x156 in 3x4 blobs, and the battery yard HAS NO PANEL CELLS -
  its 480 'inverter / transformer rack' cells are the dead member here. So
  the two-state canon split lands as: MAINTAINED at solar (eerily perfect -
  even dust haze, straight galv, zero streaks, clean ON PURPOSE), DEAD at
  battery (cold cabinets, one in seven hanging open, oil at the foot).
  WIRED: the panel table reads its own geometry - a cell's ROW is the count
  of panel cells above it: row 0 = the high galv back rail, rows 1-2 = the
  dark glass field (module frame on the phase column, two faint CONTINUOUS
  busbars - the first render's dotted busbars read as stipple, the banned
  thing, and were made solid), row 3 = the lit front lip over the darkest
  under-slot in the district, with pile glimpses; table ends wear the
  torque-tube stub with its rusted cut face and 6-18px streak (never a dot
  at a bolt). Pads pour the bought concrete slab and stand the pad-mount
  cabinet at the blob anchor. BANKED, not wired (inert-hook rule): the
  dead-glass sub-states sol_glass_browned + sol_glass_crumb - no stripped
  block exists in this seed; they wait in the bank for one. The gravel
  lane member FOLDED into the approved yard gravel exactly as section B
  predicted - and the dressing itself SHIPPED 8/20: the two-track wheel
  ruts + pale crown ride the bought gravel on every plant service lane
  (tools/tfcook/TF-ART-016_lane_cook.py), values derived from the yard
  gravel itself. The reclaim INLET HEADERS (x171, the 8/20 re-probe's new
  name) shipped the same day. Every member of this form is now live. Glass value target harvested
  from the approved wall_window, steel from the approved galv parapet,
  rust from the approved rail plate. Verified live standing in the solar
  rank aisles and among the battery racks. Cook:
  tools/tfcook/TF-ART-016_cook.py (19 pieces, 17 wired + 2 banked). Bank:
  banks/tileforms/TF-ART-016_CANDIDATES_8_19_26.json. Card:
  records/target/ART_WIRED_TF-ART-016.png (ART tab).
