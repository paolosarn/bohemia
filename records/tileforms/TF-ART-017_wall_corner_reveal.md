# TILE FORM TF-ART-017 — WALL CORNER + OPENING REVEAL (the joinery that makes a
# building a SOLID instead of a cardboard flat)

## A. IDENTITY
- NAME: The corner of a building, and the thickness you see when you look into a
  door or window hole
- FAMILY/SET: WALL JOINERY family — one coherent drawing job, ten pieces:
  outside corner (both hands), inside/reentrant corner (both hands), opening
  jamb reveal (both hands), the head/lintel return above an opening, the sill
  return under one, the parapet-coping corner where a flat roof turns, and the
  rake junction where a pitched roof lands on a corner. Colourways per material
  (stucco / CMU / tilt-up) ride this same geometry — STRUCTURE-NOT-COLOR.
- THE JOB, ONE SENTENCE: this family exists so that a building has THICKNESS —
  so its vertical edges turn a second plane instead of stopping dead, and so a
  door or window is a HOLE PUNCHED THROUGH SOMETHING SOLID instead of a picture
  of a door pasted on a flat wall.

## B. WHY
- DEMANDED BY: the starter tileset's OWN NAMED GAP. banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt
  is 42 tiles and its `struct` map builds every building in the game as
  `[38, 20, 20, 20, 39]` — index 38 is `wall_end_l`, index 39 is `wall_end_r`,
  and everything between is wall field. Those are ENDS, not CORNERS. Also
  demanded by the 45 DEGREE ART LAW (a form seen from 45 shows two planes and a
  sky-lit top, never one face), by PIXEL CRAFT LAW 11b (*"A DOOR IS A HOLE, NOT
  A PICTURE OF A DOOR"* — Paolo, 7/26, twice: *"you have a door that's a picture
  of a door"*), and by the INTERIOR-MATCHES-EXTERIOR LAW, which only means
  anything if the wall has a measurable thickness the player can SEE at the
  opening.
- WHAT LOOKS BROKEN TODAY WITHOUT IT: every building in Bohemia is a cardboard
  box. Walk around one on the RUN tab and its left edge is a lit strip
  (`wall_end_l`) and its right edge is a shaded strip (`wall_end_r`) and NEITHER
  ONE TURNS — there is no second plane anywhere on the silhouette, so a 45-degree
  world is being drawn with side-on scroller boxes. An L-shaped building is
  impossible to draw at all: there is no reentrant corner tile, so every footprint
  in the game is forced to be a rectangle. And the openings are stickers:
  `wall_window` (21), `wall_boarded` (22) and `door_top`/`door_bottom` (23/24) all
  sit FLUSH in the wall plane with zero returned reveal, so an 8-inch-thick wall
  reads as a sheet of paper with a rectangle drawn on it. The roof lands on the
  wall with no junction piece either: `roof_parapet` (41) and `roof_eave` (33)
  butt straight onto `wall_end_l/r` with nothing that turns the corner.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md walked row by
  row, and the two banks it points at opened and their tile ids read, not
  skimmed.
  - STARTER TILESET (42, CBB, md5-locked) —
    banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt and its predecessor
    banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt. Ids enumerated in full.
    `wall_end_l` / `wall_end_r` are THE CLOSEST NEAR-MISS and they fail for a
    geometric reason, not a look reason: they are a wall run TERMINATING, a lit
    edge column and a shaded edge column of the SAME single plane. A corner is
    two DIFFERENT planes meeting at 90 degrees with a value step between them and
    a second, foreshortened return face visible past the arris. No repaint of an
    end tile produces a face that is not there, and neither hand can serve a
    concave corner at all. `wall_window` and `door_top`/`door_bottom` are the
    runner-up near-miss because they occupy the exact slot a reveal would: they
    fail because they are drawn IN the wall plane with no returned jamb, no head
    soffit and no sill return, which is the literal definition of Law 11b's
    picture-of-a-door. `roof_parapet`/`roof_eave` checked for the roof junction:
    both are straight runs with no corner case.
  - PERIMETER WALL POOL (26 entries) — banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt.
    Disqualified BY LAW, not taste: the WALL TAXONOMY forbids perimeter and
    building walls sharing a pool, and the perimeter's own corner joinery is
    already somebody else's contract (records/tileforms/TF-CITY-004_perimeter_wall_corner_pilaster_cap.md).
    A freestanding site wall is a FREE-STANDING SLAB with two finished faces and a
    cap; a building corner has an interior behind it and an opening cut through it.
  - HOUSE SKINS (30/30 UP) — banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt.
    wall_plain / wall_window / wall_boarded / wall_door are all single-band FIELD
    tiles in the one-storey residential vocabulary. Field tiles, by definition,
    are the thing this family JOINS. Nothing in the set turns a corner.
  - INTERIOR POOL (465 UP) — banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt. Interior
    room tiles; the inside face of a wall is not the outside corner of one, and
    the reveal is the piece that connects them.
  - HD PACK judged tiles — banks/BOHEMIA_HD_TILE_REPO_part1.txt (and parts 2-4)
    keyed by (pack, idx). The judged UP list carries facade MATERIAL, not our
    joinery vocabulary at our cell, our value bands or our single upper-left key,
    and a bought corner drawn to somebody else's light direction is worse than no
    corner (PIXEL CRAFT LAW 7).
  - ADJACENT FORMS checked so this is not a fifth copy of somebody's ask:
    records/tileforms/TF-CITY-008_three_course_facade.md makes a wall TALL
    (base/mid/cap courses) and explicitly does not turn it;
    records/tileforms/TF-CITY-004_perimeter_wall_corner_pilaster_cap.md is the
    PERIMETER wall's corner, a different taxonomy;
    records/tileforms/TF-ART-001_cmu_block_wall.md lists a "corner/pilaster"
    variant of CMU specifically — that variant is a MATERIAL SKIN of this form's
    geometry and should be cooked from this contract, not invented twice.
    TWO REAL OVERLAPS ON THIS BOARD, NAMED RATHER THAN GLOSSED (found on review
    7/29, and they are the reason this form's piece list is not yet safe to cook
    whole):
      * records/tileforms/TF-ART-012_commercial_flat_roof.md already owns
        "parapet cap as a WANG-16 boundary set (4 outside corners, 4 straight
        runs, 4 inside corners, 3 ends/stubs)". That IS this form's
        `parapet_corner`, same object, filed a day earlier by the same lane.
        [PENDING, coordinator ruling: one form owns it. Either TF-ART-012 keeps
        the whole parapet ring and `parapet_corner` is struck from this form's
        ten, or this form takes the corner case and TF-ART-012 drops to straight
        runs. DO NOT COOK the parapet corner until that is ruled — this is
        exactly the C1/C2 duplicate class the board already caught twice.]
      * records/tileforms/TF-CITY-003_garage_door_skin.md owns "its left/right
        jamb cases, cooked per approved house-skin material". The delta this
        form still carries is real and stated narrowly: TF-CITY-003 is the
        GARAGE BAY's jamb per house skin; this is the generic returned reveal at
        every door and window on every material, and the head soffit and sill
        return, which TF-CITY-003 does not draw. Same geometry law, different
        openings — the garage jamb should be cooked FROM this contract rather
        than beside it, and if the coordinator disagrees the garage half is
        struck from here.
      * records/tileforms/TF-CITY-001_roof_edge_family.md is the per-material
        pitched-roof edge (4 hips, ridge, eave). It is ROOF geometry; this
        form's `rake_corner` is the WALL-side junction under it. They meet and
        must be judged together, but they are not the same tile.
    Beyond those three, nothing in the index or on the board covers a building
    corner or a generic opening reveal. This is the gap the starter tileset
    names on itself.

## C. WHERE
- SURFACE + TAB: the RUN tab (the walk — the surface Paolo plays) first, and the
  CITY tab (human mode) second, because both draw buildings from the same struct
  map. Also every INTERIOR, since the reveal is what an interior is seen through.
  At MAP zoom this family has no icon; it is the building's silhouette edge.
- DISTRICT FAMILIES: all. Literally every district that contains a building —
  suburb, apartment, downtown, commercial, industrial, warehouse, self-storage,
  school, jail, police, fire station, water treatment, railyard, trailer park,
  gas/truck stop, landfill scale house, farm outbuildings. There is no district
  where a building does not have a corner.
- LAYER: structure (a corner is wall, and wall is structure)
- SOLID? yes — ENTERABLE? no. The reveal pieces FRAME a portal; they are not the
  portal. The door leaf / opening tile stays the portal and keeps its own INSIDE.
- MUST SIT BESIDE: the wall field it interrupts (`wall_0/1/2` and their material
  cousins) on the run side; `wall_base` at the bottom course and
  `wall_under_eave` at the top; the 2-cell-tall door pair `door_top`/`door_bottom`
  and the garage pair inside a jamb; `roof_parapet` above the flat-roof corner
  piece and `roof_eave`/`roof_hipBL`/`roof_hipBR` above the rake piece; ground
  (`concrete_0`, `dirt`, `walk_0`, `yard_0`) at its foot.
- NEVER BESIDE: never two outside corners back to back with no wall run between
  them (that is a 1-cell-thick building and it is a placement bug, not a look);
  never an outside corner directly against another building's wall with no gap;
  never a jamb reveal with no opening in it (a reveal framing solid wall is the
  tell that the mask is wrong); never the perimeter wall pool (WALL TAXONOMY —
  the exact mistake already caught once this week); never a terracotta roof piece
  landing on an industrial parapet corner.
- EDGE CONTRACT: WANG-16 edge set on the wall run. The 16 N/E/S/W wall-neighbour
  cases give the straight run, both hands of the outside corner, the T and the
  cross; the CONCAVE inside corner needs the diagonal bit on top of the 16, which
  is the four extra cases named explicitly here because M12 warns the inner corner
  is the trap and it gets built FIRST as the test, not last as the afterthought.
  Vertically each piece must be SELF-SEAMLESS against itself so a corner runs up a
  three-course wall with no band, and that wrap IS MEASURED (offset test, M10 —
  the re-cook made wall seams 3x worse and only the measurement caught it). The
  opening reveal pieces (jamb, head return, sill return) are SINGLE PLACEMENT
  against a specific opening and never repeat.

## D. WHEN
- ACT: 1
- BEST TIME: both. Unlit at night — nobody owns light on a dead building
  (LIGHT=TERRITORY). Inside the powered 12% the runtime light pass does the work
  and the reveal is the one place it will read hardest, because a lit reveal is a
  slot of light in a dark wall; the ART BAKES NONE OF THAT. What genuinely changes
  at night is contrast, not content: the corner's two planes converge in value, so
  the corner must still read from its SHAPE (M18, value skeleton) and not from a
  daytime-only brightness difference.
- WEATHER STATES: sunny baseline. Cloudy wash flattens the two planes toward each
  other and is the worst case for the corner's read, so the corner is designed
  against the CLOUDY case, not the sunny one. RAIN is the interesting one and it
  is backwards from every other tile in the game: the JAMB REVEAL AND THE HEAD
  SOFFIT STAY DRY because they sit under a return, so in rain the reveal reads
  LIGHTER and drier than the soaked wall field around it — a dry rectangle in a
  wet wall. The sill is where the water leaves: two vertical streaks starting at
  the sill's outer corners and running down, never a wash across the whole wall.
- LIT/UNLIT: no lit variant in the art. Palette-swap territory (M9) once the
  family ships indexed; drawing a second lit set would be drawing the light pass
  twice.
- ANIMATION: static. Nothing on a corner moves. (If wind-blown grit at the inside
  corner is ever wanted it is a palette cycle per M16, not frames.)

## E. HOW
- EXACT SIZE: 44 x 44 px per piece — THE CORPUS CELL, native, no resampling
  anywhere in the path. Footprints: the four corner pieces and the two roof
  junction pieces are 1x1; the jamb reveal is 1 wide x 2 TALL (two stacked pieces)
  to frame the 2-cell door; the head return and sill return are 1x1 each, placed
  above and below a 1-cell-wide opening. THE NUMBER THIS WHOLE FORM TURNS ON:
  CELL_M = 0.75 m over 44 px means 1 px = 1.70 cm. A nominal 8-inch CMU wall is
  7-5/8 in ACTUAL = 19.4 cm = 11.4 px; add 5/8 in of stucco (1.6 cm, 1 px) each
  side and a real Clark County wall is 22.6 cm = 13.3 px thick. A 2x6 stud wall
  with 7/8 in stucco lands within a pixel of the same. So THE RETURNED REVEAL AT
  EVERY JAMB, HEAD AND SILL IS 11 TO 13 PX — just under a quarter of a cell —
  and the outside corner's visible return face is the same depth before the
  neighbouring cell takes over. That is the measurement, and any reveal thinner
  than ~10 px will read as a drawn line instead of a thickness.
- VIEW: 45-degree world view (law). This form IS the 45 law: the outside corner
  shows the front plane AND a foreshortened return plane AND, where it is capped,
  a sliver of sky-lit top. The head return shows the soffit — the DOWNWARD-facing
  underside of the opening head — which is the darkest surface on the building
  and the single strongest proof that the wall has depth.
- PALETTE: constitution ceiling. Value band: **wall** (mean 96.0, lo 37.5, hi
  167.6) for both planes and the reveal; the coping-corner's sky-facing sliver
  belongs to **top** (110.2, 72.8-137.4). Family ramp only — the material's own
  5-7 step ramp from the recook's one_palette_per_family (stucco, concrete, or
  the CMU grey ramp TF-ART-001 asks for), never a new colour. Ships INDEXED (M9)
  so the corner re-skins per material and per act by palette, not by re-cook.
  [NAMED DEBT, inherited not created: the ONE master palette M17 demands does not
  exist yet, so this family takes a family ramp and will re-index when it does.]
- LIGHT: the one global key, UPPER LEFT. NO keyline. NO dither. The corner is a
  VALUE STEP between two planes and nothing else — a dark line on the arris is
  the 7/26 black-grid failure wearing a new hat. The two planes must sit at least
  18 luminance points apart (M14's number, applied within one tile) so the corner
  survives greyscale and survives a phone in Vegas sunlight. Both hands are DRAWN,
  never mirrored: a flipped tile lights from the wrong side, and the gate's own
  pair check (`wall_end_l > wall_end_r`) is exactly this law with a number on it.
- SHADOWS: none baked (separate-layer law). Expected runtime footprint: an outside
  corner throws the building's shadow off its own arris, which is the longest hard
  shadow edge in any frame; the head return's soffit shade is INTERNAL to the tile
  and is material, not a cast shadow, so it is drawn — that distinction is the one
  place this family is allowed dark pixels and it must not be used as an excuse to
  paint a cast shadow into the corner.
- SCALE ANCHORS: the 2-cell door fixes the opening height, so the head return sits
  88 px above the sill line and the jamb is exactly that tall. A 1.75 m human is
  103 px (2.3 cells), which is what proves a reveal depth of 11-13 px is right —
  the wall is about a tenth of a person thick, and it looks it. On CMU material a
  course line lands every 11.9 px and a head joint every 23.8 px (8x8x16 block),
  so the corner's block coursing must break bond correctly at the arris.
- WEAR LEVEL: thirty summers, and every mark answers "what did this?" in one word
  (M1) — this is the family where motivated wear pays the most, because a corner
  is where two different weathering HISTORIES meet:
  - SUN. The south and west faces bleach and chalk first, always. So at an outside
    corner the two planes are not merely two values, they are TWO AGES: the sun
    plane is chalked pale and desaturated, the shade plane keeps more of its
    original colour. This is the single best idea in the form and it is the thing
    that will sell the corner.
  - THE BEAD. A stucco outside corner is formed over a 26-gauge galvanised corner
    bead with a 7/8 in ground — that ground is 2.2 cm, ONE PIXEL. The galvanising
    sacrifices out under extreme UV and monsoon wetting, the steel rusts from
    inside the stucco, and the crack follows the bead DEAD STRAIGHT. That is why a
    thirty-year Vegas corner carries a perfectly vertical hairline exactly on the
    arris and nowhere else, with a rust line in it 1 px wide and a bleed fan
    2-3 px wide and 10-20 px long running down from it. One pixel wide. Not a
    blotch.
  - WIND. ASCE 7 puts building corners in the highest-suction zone, 2-3x the field
    — corners are where cladding, coping and flashing lift FIRST, and where
    wind-driven Mojave grit abrades the arris. So the 90-degree edge is never a
    razor line: it is a 1-2 px ragged step with the render chipped off in
    irregular clumps (M11), heaviest at the windward corner.
  - RUST JACKING. Steel angle lintels corrode to several times their own volume
    and lift the course above the opening. So the head line is NOT straight: a
    1-2 px vertical step, and a hairline crack leaving BOTH top corners of the
    opening at 45 degrees, because the corners of an opening are the stress
    concentration in any wall. Every opening in the game gets those two cracks and
    every one of them is motivated.
  - WATER. The only vertical stains on a Vegas building start at the sill's two
    outer corners and at a failed coping mitre. Nowhere else. Vegas does not
    streak like the east coast; it chalks and it spalls.
  - TRASH. The concave inside corner is a wind eddy: blown silt, a drift of grit,
    a wedged tumbleweed. It is also the last place on the building to see sun, so
    it is the darkest surface outdoors and the only place a stain survives.
- VARIANTS: TEN PIECES, one job — corner_out_l, corner_out_r, corner_in_l,
  corner_in_r, jamb_l (x2 tall), jamb_r (x2 tall), head_return, sill_return,
  parapet_corner (flat roof, mitred coping — HELD, see the overlap flagged in B:
  TF-ART-012 already owns the parapet WANG-16 corner and one of the two forms
  must lose it), rake_corner (pitched roof landing).
  Beyond that: MATERIAL colourways only (stucco / CMU / tilt-up / corrugated),
  which is a palette swap on identical geometry and is therefore never progress on
  its own (STRUCTURE-NOT-COLOR). Any new SILHOUETTE — a chamfered corner, a
  pilaster, a recessed entry — is a different form.

## F. THE CAPTION
```json
{
  "id": "TF-ART-017",
  "name": "wall corner and opening reveal",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": [
    "all",
    "suburb",
    "apartment",
    "downtown",
    "commercial",
    "industrial",
    "warehouse",
    "self-storage",
    "school",
    "jail",
    "police station",
    "fire station",
    "water treatment",
    "railyard",
    "trailer park",
    "gas and truck stop",
    "landfill scale house",
    "farm outbuildings"
  ],
  "best_time": "both",
  "best_location": "every vertical edge of every building, and every door or window opening cut through a wall",
  "place_next_to": [
    "wall field run",
    "wall_base",
    "wall_under_eave",
    "door_top and door_bottom",
    "garage door pair",
    "roof_parapet",
    "roof_eave",
    "roof_hipBL",
    "roof_hipBR",
    "concrete apron",
    "sidewalk",
    "yard",
    "dirt"
  ],
  "never_next_to": [
    "another outside corner with no wall run between",
    "another building's wall with no gap",
    "a jamb reveal framing solid wall",
    "perimeter wall pool tiles",
    "terracotta roof on an industrial parapet corner"
  ],
  "weather_ok": [
    "sunny",
    "cloudy",
    "rain"
  ],
  "acts": [
    1
  ],
  "edge_contract": "wang-16 edge set on the wall run (the 16 N/E/S/W wall-neighbour cases give the straight run, both hands of the outside corner, the T and the cross), plus four diagonal-bit cases for the concave inside corner; vertically self-seamless so a corner runs up a three-course wall; the opening reveal pieces are single placement against one opening",
  "anim": null,
  "tags": [
    "structure",
    "joinery",
    "corner",
    "reveal",
    "jamb",
    "opening",
    "45-degree",
    "thickness",
    "focal"
  ]
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt — the
  42-tile act-1 starter set. Its approval status, stated exactly rather than
  rounded off: the SET is the 7/26 target screen's, judged CBB ("could be
  better" — ships, frozen); the 7/28 re-cook is the same set rebuilt by the
  construction method Paolo approved on road_0 that day
  (records/BOHEMIA_PIXEL_CRAFT_VERDICT_7_28_26.txt, verbatim "I checked it to do
  the other 41 mark it approved"), which unlocked the other 41 by method and did
  NOT re-thumb them one by one. `wall_end_l` (38) and `wall_end_r` (39) are the pieces
  this replaces at the building's vertical edges and their material, ramp and
  published seam behaviour are the truth this extends around the corner;
  `wall_window` (21) and `door_top`/`door_bottom` (23/24) are the openings this
  gives a real reveal to; `roof_parapet` (41) and `roof_eave` (33) are what the
  two roof-junction pieces must meet. The predecessor
  banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt carries the original hand-drawn
  content and is the reference for what Paolo actually drew, which is not mine to
  redraw.
- NAMED OUTSIDE REFERENCE: **Eastward** (Pixpil, 2021) — specifically the way its
  buildings show WALL THICKNESS at every opening: the jamb turns and you see a
  band of the wall's own depth sitting in shade, so a doorway reads as a hole
  punched through a solid mass rather than a dark rectangle painted on a surface,
  and its outside corners separate the two planes with a clean value step and NO
  outline. Take the returned-thickness discipline and the no-outline corner; take
  nothing of its palette or its lighting mood. Secondary, for method rather than
  look: **Slynyrd's Pixelblog 20 (Top Down Tiles)** for the build ORDER on a
  joinery set — edges first, then corners, then the isolated cases, with the inner
  corner treated as the hard one. Third, and this is M15's rule rather than a
  style crib: **Waneella's street pieces**, which are built from photographs of
  real streets and are praised for perspective and light, never for texture — the
  corner is a light-and-structure problem wearing a texture costume.
- REAL-WORLD GROUNDING: the Las Vegas valley's building stock outside the Strip is
  one-to-three storey CMU or 2x6 frame, finished in cement stucco, with a FLAT
  roof behind a PARAPET — the parapet is the most characteristic silhouette in
  Clark County. Real locations to work from, per M15: Commercial Center on East
  Sahara (1962, the valley's oldest surviving strip mall — slump block and stucco,
  square corners, deep punched openings) and the shuttered motel and shop strips
  along Boulder Highway. THE CONSTRUCTION, exactly: an 8-inch nominal CMU wall is
  7-5/8 in actual (19.4 cm), stucco over block is a two-coat system totalling
  5/8 in, and the outside corner is formed over a 26-gauge galvanised corner bead
  with a 7/8 in ground. Openings are punched, not curtain-walled; the head is a
  precast or bond-beam lintel over CMU and a steel angle over frame; joint
  sealants at control joints, sills and coping mitres carry a 10-20 year service
  life and less under direct desert sun. WHAT THIRTY YEARS OF MOJAVE SUN AND NO
  MAINTENANCE DOES, concretely: (1) Las Vegas runs a UV index of 10-12 from May
  through September, so the elastomerics in the finish coat photo-degrade and go
  brittle and CHALKY — the south and west planes of a corner bleach visibly ahead
  of the north and east, which is why a corner is two different ages meeting;
  (2) the corner bead's galvanising sacrifices out, the steel rusts inside the
  stucco, and the crack runs DEAD STRAIGHT down the arris because it is following
  the bead — the one perfectly vertical crack on the whole building, with a rust
  line in it and a short bleed fan below; (3) sealant at the control joint next to
  the corner, at the sill, and at the coping mitre goes brittle, cracks and
  debonds, so water gets in exactly at the corner and at the opening perimeter and
  nowhere else; (4) the steel lintel over the opening rust-jacks — corrosion
  products occupy several times the volume of the steel and pry the course above
  the opening upward, giving a stepped head line and diagonal cracks out of both
  top corners of every opening, since opening corners are the stress concentration
  in any wall; (5) building corners sit in the highest wind-suction zone in
  ASCE 7, 2-3x the field, so coping caps, cap flashing and cladding lift at the
  CORNER first and the failure propagates from there, and blown Mojave grit
  abrades the arris itself into a chipped, irregular edge; (6) a 100-foot metal
  coping cap moves more than an inch and a half between winter and summer, so
  after thirty years of thermal cycling the mitre at the corner has opened, the
  cap has sagged there, and the only vertical water stain on the whole building
  runs down out of it.

## H. DON'T WANT
- NOT a flat side-on scroller corner. A vertical edge that does not turn a second
  plane is exactly what is broken today and it violates the 45 DEGREE ART LAW.
- NOT a black keyline down the arris, and no outline anywhere. The corner is a
  VALUE STEP (PIXEL CRAFT LAW 7 / M18). A dark line at the tile edge is the 7/26
  black-grid failure and M10's *"Heavy borders that outline the edge of the
  tile... guarantees it reads as a grid of tiles instead of a continuous
  surface."*
- NOT anti-aliased on the outer silhouette (LAW 4) — the arris is precisely the
  edge that meets an unknown neighbour, so AA there blends into a colour we do not
  know. AA stays internal.
- NOT a mirrored pair. Flipping the left hand to make the right hand lights it
  from the wrong side and breaks the one-key law; the gate's own pair check exists
  because that shortcut was already available and tempting.
- NOT an isometric 2:1 stepped corner. Bohemia is axis-aligned oblique, not
  isometric (LAW 11) — a 2:1 staircase is another game's projection.
- NOT a picture of a window. If the reveal shows no returned thickness and the
  inside is not darker than any lit face, it is LAW 11b's picture-of-a-door and it
  gets bounced. This is the specific failure Paolo already caught twice on 7/26.
- NOT a reveal thinner than about 10 px. Under that it stops reading as thickness
  and becomes a drawn line, which is the same failure with a smaller budget.
- NOT rounded, bullnosed or chamfered. Clark County commercial corners are SQUARE
  over a metal bead; the soft adobe corner is a Santa Fe cliche and the wrong
  county.
- NOT every block outlined at the corner. Slynyrd's own rule — *"avoid depicting
  every single brick as this would appear noisy"* — and our measured 74%-orphan
  disaster was that exact mistake.
- NOT scattered random damage. Every mark answers "what did this?" (M1): sun,
  bead, wind, rust-jack, sealant, grit. A crack that answers "nothing" is invented
  decoration and gets deleted on sight.
- NOT 22 cm blotches. 1 px = 1.7 cm. The corner bead is one pixel. The rust bleed
  is two to three pixels wide. Wear drawn at the wrong physical size is the tell
  that nobody measured anything.
- NOT eastern weathering. No moss, no algae, no green anywhere, no long water
  streaks down the whole wall. Vegas chalks, spalls and bleaches. And no living
  plants in the inside corner — dead world, act 1.
- NOT clean or new. Not lit. A glowing reveal implies somebody owns this building
  and LIGHT=TERRITORY says that is a ruling, not a decoration.
- NOT dithered (act-1 ban, and stipple crawls under integer blit on a phone).
- NOT a perimeter wall corner. Different taxonomy, different form (TF-CITY-004),
  and confusing the two is the mistake already caught once this week.

## I. ACCEPTANCE
- [ ] REVEAL DEPTH MEASURED: the returned band at every jamb, head and sill is
      11-13 px (the real 8-inch wall at 1.7 cm per pixel). Out of range = fail.
- [ ] CORNER READS IN GREY: the two planes of every outside corner are >= 18
      luminance points apart (M14's number applied inside one tile), and the
      corner is still findable in the greyscale panel of tools/bohemia_look_again.py
- [ ] NO KEYLINE PROVEN, not asserted: no single-pixel column on the arris is
      darker than both planes it separates
- [ ] PAIR CHECK: sunlit hand brighter than shaded hand on every corner pair, the
      same test the frozen set already passes as `wall_end_l > wall_end_r`
- [ ] Seam measured (WANG-16 + vertical self-seam): offset test, wrap delta within
      the normal neighbour step, no edge darkening (the desert-pool lesson, M10)
- [ ] INNER CORNER BUILT FIRST and shown first (M12 names it as the trap)
- [ ] Pixel craft gate green: orphan share, single-use colours, block size 1,
      pillow score, cluster density, set-wide palette, M2 floor-is-quiet, M5
      detail spread (laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md and
      laws/BOHEMIA_PIXEL_MASTERY_LAWS_7_28_26.md)
- [ ] Palette ceiling + **wall** value band + one-light + no-dither checks green
- [ ] Squint test: at walk zoom the building reads as a SOLID WITH A CORNER, and
      the openings read as HOLES, not panels
- [ ] BOX PROOF (this family's version of the 3x3, and the only test that matters):
      a whole assembled building — four vertical edges with corners, an L-shaped
      wing so both concave corners appear, one door and one window with full
      reveals, a parapet turning at the top — rendered as one picture. A corner
      judged alone is meaningless.
- [ ] 3x3 TILED PROOF SHEET of the straight-run cases as well, so the joinery is
      proven not to band the wall it interrupts
- [ ] ON THE REAL SURFACE: screenshot on the RUN tab, standing beside the building,
      SIDE BY SIDE with today's `wall_end_l`/`wall_end_r` cardboard box
- [ ] Native 44 x 44, no resampling anywhere in the path
- [ ] Ships INDEXED against its family ramp (M9) so material colourways and night
      are palette swaps, not re-cooks
- [ ] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: COOKED AND WIRED (first slice, 8/19/26) | REQUESTED BY: ART lane
  (own queue, breaking down board row 7) | DATE: 7/29/26 | PRIORITY: HIGH
- BOARD ROW #: 97 (the ART block's reserved 90-99 range for the ten row-7
  breakdown forms; row 26 was already TF-ART-007's) | VERDICT: shipped under
  EVERYTHING IS A THUMB (8/9)
- WIRED 8/19/26, FIRST SLICE - the pieces are PURE VALUE GEOMETRY (the
  form's own light law: "the corner is a VALUE STEP between two planes and
  nothing else"), cooked as RGBA luminance overlays that ride every
  approved material unchanged, so ONE set serves all fifteen house skins
  and every civic material with no colourway explosion (STRUCTURE-NOT-COLOR
  in its purest form). Live now:
  * cor_out_l / cor_out_r on the suburb house end cells (bodyTile's
    wall_end_l/r slots) and on every civic mass edge column: a 12px return
    plane at the measured wall thickness, the value step at the arris, and
    the BEAD - the dead-straight 1px rust hairline with its 2-3px bleed fan
    (rust harvested from the approved rail steel).
  * rev_window / rev_boarded on the suburb openings: opening rects MEASURED
    off the approved starter tiles (window x10..33 y12..29); shaded left
    jamb, lit right jamb, the SOFFIT as the darkest band, lit sill, and the
    sill-corner weeps - the only streaks a Vegas wall gets.
  Verified on the real surface: reshot the identical jail site before and
  after - the diff is column-localised exactly at the mass edges (159k px,
  concentrated in the edge column bands), and the suburb home shows the
  window soffits and sill weeps. Cook: tools/tfcook/TF-ART-017_cook.py
  (6 pieces). Bank: banks/tileforms/TF-ART-017_CANDIDATES_8_19_26.json.
  Card: records/target/ART_WIRED_TF-ART-017.png (before | after).
- SCOPE RESOLUTIONS RECORDED (the two overlaps section B flagged):
  * parapet_corner STRUCK from this form - TF-ART-012 shipped the full
    WANG-16 coping ring on 8/11; 012 owns it, resolved by the record.
  * rake_corner HELD with TF-CITY-001 (unshipped) - judged together later.
  * cor_in_l / cor_in_r cooked and BANKED, not wired - no live concave
    site measured yet (inert-hook rule: a branch that cannot fire is not a
    feature).
  * the suburb DOORS keep their reveal for a later pass - they are Paolo's
    animated clip-bank art drawn in a LATER overlay pass; a reveal cooked
    here would be painted over. Garage jambs stay TF-CITY-003's.
