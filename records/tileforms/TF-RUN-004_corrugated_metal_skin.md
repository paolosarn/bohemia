# TILE FORM TF-RUN-004 — CORRUGATED METAL BUILDING SKIN

## A. IDENTITY
- NAME (plain words a person would say): Metal building siding — the ribbed
  steel wall every warehouse, storage unit and shop building in the valley is
  made of
- FAMILY/SET: METAL BUILDING SKIN family — wall face, base course, under-eave
  course, corner, and the roll-up door surround. Matches the run's existing
  4-course building stack exactly.
- THE JOB, ONE SENTENCE: this tile exists so that the industrial half of Las
  Vegas stops being built out of suburban house stucco.

## B. WHY (the need — no ruling, no tile)
- DEMANDED BY: RUN backlog 0b (DISTRICT ART, the lane's top gap). Measured on
  the real run surface this turn —
  records/BOHEMIA_RUN_DISTRICT_MATERIAL_SURVEY_7_28_26.md.
- WHAT LOOKS BROKEN TODAY WITHOUT IT: the world model names these buildings and
  the run has exactly one wall material. Sampled per cell: industrial
  `warehouse` ×416, storage `storage-unit building` ×333, warehouse
  `tenant unit` ×267, firestation `building (station quarters)` ×355, plus
  granary and truckstop shop buildings. Every single one renders through
  `wall_0/1/2` — the CBB starter set's **pale cracked stucco**, which is a
  1970s Clark County tract-house material. So the self-storage rows, the
  flex-industrial units and Paolo's own house are the same wall. His standing
  complaint about the suburb border wall being "still the house tiles" is the
  identical defect, one district family over.
- SHOPPING CHECK (records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md):
  - SEAM-FIXED SURFACES `1. Metal floor tiles` (36) and `2. Rusted metal floor
    tiles` (10) — **rendered and looked at this turn**: they are sci-fi deck
    plating with rivets and diamond-plate grating. They are FLOORS, seen from
    above, and off-genre. Corrugated siding is a VERTICAL FACE with directional
    ribs and reads nothing like them.
  - `Wall tiles (1)` (20) / `3. Broken wall tiles` (18) — looked at: medieval
    stone masonry and ruined battlements with a torch sconce. Off-genre.
  - HOUSE SKINS (30 approved, now drawing in the run) — residential stucco,
    shingle and boarded windows. Correct for houses, wrong for a warehouse, and
    using them here would be the same category error in reverse.
  - STARTER TILESET — the 42 frozen tiles carry exactly one wall family
    (stucco) and it is FROZEN; growing it is board row 7 in the abstract, and
    this form is the specific.
  - Nothing approved is a metal exterior. Genuine hole.

## C. WHERE (place — the game code reads this)
- SURFACE + TAB: RUN (the walk); CITY human mode.
- DISTRICT FAMILIES: industrial, warehouse, storage, firestation, granary,
  truckstop, boneyard office, railyard engine shed, swapmeet market hall.
- LAYER: structure
- SOLID? YES — ENTERABLE? yes via a door/roll-up (portal handled by the door
  bank + the existing garage-bay tiles); INSIDE is the interior pool's
  warehouse/garage room recipes.
- MUST SIT BESIDE: itself across a long run; its own corner; the approved
  2-tall door and the starter set's `garage_top`/`garage_bottom` roll-up bay;
  concrete pad or gravel at its base; roof/parapet above.
- NEVER BESIDE: house stucco on the SAME building (a building is one material —
  mixing them is the tell of a broken material pass); dead lawn directly
  against the base course (industrial buildings meet concrete or gravel).
- EDGE CONTRACT: SELF-SEAMLESS horizontally (a warehouse wall is a long
  unbroken run and MUST tile left-right invisibly — the ribs make any seam
  glaringly obvious, so this is the highest seam-risk asset on the board).
  Vertically it is COURSED, not seamless: base / field / under-eave are
  distinct courses in the run's existing 4-course stack.

## D. WHEN (time & state — the invisible-caption inputs)
- ACT: 1
- BEST TIME: both. Metal is the one material in the game with a real SPECULAR
  behaviour — in Vegas daylight the ribs make hard alternating light/shade
  stripes, and at night it goes almost flat. That day/night difference is
  free character and should be authored deliberately.
- WEATHER STATES: sunny baseline (maximum rib contrast); cloudy flattens the
  rib shading noticeably — worth a note to the ambient pass, not a new tile;
  rain: no wet variant needed (vertical metal sheds water instantly).
- LIT/UNLIT variant needed? No self-lit variant. But per LIGHT=TERRITORY, a lit
  loading dock throwing light across ribbed metal is one of the best-looking
  things this game could have, so the tile must take a light well.
- ANIMATION: static. (The roll-up door is the approved door bank's job.)

## E. HOW (build spec — the art lane's one-shot recipe)
- EXACT SIZE in px: the frozen starter tileset's native cell, 1x1 tile, to slot
  directly into the run's existing 4-course building stack (base / field /
  field / under-eave — records/BOHEMIA_RUN_BUILDING_STACK_7_27_26.md).
- VIEW: 45-degree world view — this is a FRONT FACE, seen three-quarter, never
  flat side-on. Ribs run VERTICALLY on wall panels (that is how metal buildings
  are actually clad) which gives the face a strong vertical grain that must not
  fight the horizontal course structure.
- PALETTE: constitution ceiling; STRUCTURE value band. Metal buildings in Vegas
  are overwhelmingly off-white, sand, or pale grey-blue — chosen to reject heat.
- LIGHT: the one global direction, and the rib shading must AGREE with it (this
  is the asset most likely to accidentally imply a second light source). NO
  keyline. NO dither — and like the fence, the rib pattern is a REGULAR PATTERN
  that a dither sweep may flag; declare it.
- SHADOWS: none baked; the eave shadow is the existing `wall_under_eave`
  course's job.
- SCALE ANCHORS: the approved 2-tall door and the existing garage bay. Real
  wall panel ribs are 6-12 inches apart, so at tile scale expect 4-8 ribs per
  tile — enough to read as ribbed, few enough not to moiré.
- WEAR LEVEL: dead world. Sun-chalked paint, streaking below every fastener
  line, dents at vehicle height along the loading side, one or two panels
  sprung at a corner. Rust ONLY at fasteners and cut edges — Vegas is dry, so
  sheet metal chalks and fades far more than it rusts, which is the specific
  local truth most artists get wrong.
- VARIANTS: 2-3 colorways (off-white, sand, pale blue-grey) sharing one
  geometry — colorways, not new forms. Plus the boarded/damaged panel variant.

## F. THE CAPTION (ships with the tile — machine-readable)
```json
{
  "id": "TF-RUN-004",
  "name": "corrugated metal building skin",
  "layer": "structure",
  "solid": true,
  "enter": true,
  "district_families": ["industrial", "warehouse", "storage", "firestation", "granary", "truckstop", "boneyard", "railyard", "swapmeet"],
  "best_time": "day for maximum rib contrast; flattens at night",
  "best_location": "the street-facing face of any non-residential shed, unit row or shop building",
  "place_next_to": ["corrugated metal building skin", "roll-up garage bay", "2-tall door", "cracked concrete pad", "gravel / ballast ground", "roof eave"],
  "never_next_to": ["house stucco on the same building", "dead lawn at the base course"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "self-seamless horizontally; coursed vertically (base / field / under-eave)",
  "anim": null,
  "tags": ["structure", "metal", "industrial", "wall-face", "regular-pattern", "takes-light-well"]
}
```

## G. REFERENCES (all three required)
- APPROVED ANCHOR: the frozen starter tileset's building stack —
  `wall_base` / `wall_0-2` / `wall_under_eave` / `wall_end_l` / `wall_end_r`
  and the `garage_top`/`garage_bottom` bay. This family must drop into those
  exact slots so the run's existing 4-course stack draws it with no new code.
  Value-matched to those tiles, material completely different.
- NAMED OUTSIDE REFERENCE: **Project Zomboid**'s warehouse district for
  top-down ribbed metal that stays readable at small scale (its trick is that
  the ribs are implied by value banding, not drawn as lines).
  **Fallout: New Vegas**'s Sloan and the quarry outbuildings for sun-chalked
  desert industrial metal specifically — the palette is right even though the
  projection is not.
- REAL-WORLD GROUNDING: the Las Vegas valley's light-industrial and
  self-storage stock is almost entirely pre-engineered metal buildings —
  Butler/Varco-Pruden style steel frames clad in 26-gauge ribbed panel, in
  off-white or sand because a dark building in Mojave sun is unusable. After
  20-30 years without maintenance the paint CHALKS (a matte powder you can rub
  off) and the colour fades toward bone; fastener lines streak dark; the sun
  side fades measurably more than the north side. Rust is confined to cut
  edges, screw penetrations and the bottom 6 inches where sprinklers used to
  hit. Nevada does not give you a rusted-through wall — it gives you a bleached
  one.

## H. DON'T WANT (the anti-reference)
- NOT house stucco. That is the whole defect this form exists to kill, and it
  is the same failure Paolo named out loud about the border walls.
- NOT a rust-bucket. Rust-belt corrugated (orange, holed, peeling) is the wrong
  climate — Vegas bleaches, it does not rot.
- NOT drawn as individual lines. Ribs implied by value banding; drawn lines
  moiré at walk zoom and will strobe when the camera moves.
- NOT flat side-on. 45 DEGREE ART LAW.
- NOT the off-genre sci-fi deck plating in the seam-fixed bank (checked and
  rejected this turn) — no rivets, no hex panels, no greebles.
- NOT dark. A dark metal building in the Mojave is a physical impossibility and
  will also break the structure value band.

## I. ACCEPTANCE (what the machine proves BEFORE Paolo ever sees it)
- [ ] HORIZONTAL SEAM MEASURED across a 10-tile run — the ribs make this the
      highest seam-risk asset on the board; wrap delta within the normal
      neighbour step, no edge darkening
- [ ] Drops into the existing 4-course stack with NO renderer change (proved by
      rendering a warehouse with it in the run's own bodyTile path)
- [ ] Palette ceiling + STRUCTURE value band + one-light checks green; rib
      pattern declared to the dither check
- [ ] Rib shading agrees with the one global light (no implied second source)
- [ ] 3x3 tiled proof + a long-run proof (a 10-tile warehouse face)
- [ ] ON THE REAL SURFACE: screenshot of a storage or warehouse district
      wearing it, beside the current stucco render for contrast, and beside an
      approved house so the two materials are visibly different buildings
- [ ] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: RUN lane (0b district-material survey, 7/28)
  | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 11 | VERDICT: —
