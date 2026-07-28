# TILE FORM TF-CITY-002 — ROOFTOP EQUIPMENT (the stuff on top of every Vegas
# house, which is the biggest empty surface in the game)

## A. IDENTITY
- NAME: The machines and pipes on a house roof — the AC box, the vent stacks,
  the dead swamp cooler, the satellite dish
- FAMILY/SET: ROOFTOP EQUIPMENT set. One drawing job, 6 props: rooftop package
  AC unit (the big box), abandoned evaporative cooler, plumbing vent stack,
  turbine/whirlybird vent, satellite dish, dead solar panel pair.
- THE JOB, ONE SENTENCE: this set exists so that a roof stops being a blank
  coloured rectangle, because in a 45-degree top-down game the ROOF is the
  single largest thing on screen in a residential district and ours currently
  has nothing on it at all.

## B. WHY
- DEMANDED BY: the WALKABLE-LAND law's render-and-look bar (a district must
  read FINISHED and USED, not thin features stranded in empty space) applied
  to the biggest surface we have; Paolo 7/28 standing complaint after the
  border walls landed: "it still looks like shit so much of the game."
- WHAT LOOKS BROKEN TODAY: screenshotted on the real run surface 7/28
  (scratchpad x_door.png). Standing at your own front door, the house roof
  fills roughly a third of the 390x844 phone screen as ONE uniform terracotta
  slab with zero incident. Nothing breaks it up, nothing casts a shadow onto
  it, nothing says a person ever lived under it. Measured cause: the run's
  bodyTile() returns only roof_slope/ridge/eave/hip for every roof cell and
  there is no prop layer on roofs at all — not one image is drawn above a roof
  plane anywhere in the renderer.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md, every row
  that could plausibly hold a roof prop. HOUSE SKINS (30) — opened, all field
  materials, zero props. STARTER TILESET (42) — opened and listed, it has
  roof_deck and roof_parapet but no equipment. INTERIOR POOL (465, 12 room
  buckets) — indoor furniture, wrong layer and wrong scale, and by law
  interior tiles never leak outside. HD PACK judged tiles — the industrial
  packs contain rooftop-looking machinery but it is COMMERCIAL scale (chillers,
  ducting runs) and off-band; a residential 3-ton package unit is a different
  object. Nothing in the index puts anything on a house roof.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode). At map zoom: invisible,
  too small.
- DISTRICT FAMILIES: suburb (every house), apartment, trailer (a swamp cooler
  on a trailer is near-universal in real Vegas), commercial one-story, motel.
  NOT on the hero landmarks (those carry their own approved dossiers).
- LAYER: prop
- SOLID? no (props are never collision — the 7/26 interiors law generalises:
  a prop the player cannot reach cannot block them either) — ENTERABLE? no
- MUST SIT BESIDE: roof_slope and roof_deck of any material; itself sparsely.
  The package unit sits on a curb near the RIDGE (weight goes over a bearing
  wall); vent stacks sit in the field; the dish clamps at an EDGE, near a hip.
- NEVER BESIDE: the eave course (nothing is installed on the overhang lip);
  ground tiles of any kind (a swamp cooler on the lawn is a different prop and
  a different form); a portal.
- EDGE CONTRACT: SINGLE PLACEMENT — never repeats. These are objects, not
  surfaces. Density is the acceptance question: one package unit per house, at
  most two other pieces, and MOST roofs carry only the AC box.

## D. WHEN
- ACT: 1
- BEST TIME: both. Dead by default (nothing runs — no power to run it), so
  nothing hums, spins or glows at night. INSIDE a powered 12% cluster the
  engine's light pass may catch the top face; that is the pass's job, not the
  tile's.
- WEATHER STATES: sunny baseline; cloudy no change; RAIN-WET — sheet metal
  goes darker and more saturated wet than the roof tile around it, which is
  the one place these props change, and it is a value shift only.
- LIT/UNLIT: no self-light EVER. A glowing rooftop unit would break the act-1
  dead-world rule and the CLUSTERED POWER law in one stroke. If a house is in
  the lit 12%, its equipment is lit BY the pass and still does not run.
- ANIMATION: static, all six. (Deliberate: a spinning turbine vent is the
  obvious idea and it is WRONG — a turbine vent spins on rising heat, and a
  dead sealed house does not make enough. A frozen turbine vent is the story.)

## E. HOW
- EXACT SIZE: authored on the 44 x 44 px cell. Package AC unit = 1 tile
  footprint but drawn TALLER than its cell (it is a 3-foot-high box seen at 45
  degrees, so it overhangs its cell upward like every other 45-view mass).
  Vents/dish/panels = sub-tile, drawn within one cell.
- VIEW: 45-degree world view, hard requirement, and this set is where it bites
  hardest: a package unit is a BOX and the 45 law means you see its sky-lit TOP
  and two faces, never a flat rectangle. The dish is an ELLIPSE cross-section
  (the blessed lamp bank is the reference for how a round thing reads at 45).
- PALETTE: constitution ceiling. Value band: **top** (mean 110.2, 72.8-137.4) —
  these things sit on the roof plane and must not out-value the ridge.
- LIGHT: upper left, shadows down and to the right. NO keyline. NO dither.
- SHADOWS: none baked. A package unit casts a real shadow onto the roof and
  that is the ENGINE's runtime pass (the starter tileset's shadow_note is
  explicit that a cast shadow cannot live in a tile). NOTE FOR THE ENGINE: this
  set is the first prop that casts onto a ROOF plane rather than the ground,
  so the shadow pass needs a roof-plane case — flagged here, not solved here.
- SCALE ANCHORS: a residential rooftop package unit is roughly 4 ft x 3 ft x
  3 ft — at ~0.75 m per cell that is a little over one cell wide and about
  one cell tall. A satellite dish is ~18-24 inches: well under half a cell.
  Get this wrong and the roof reads as a factory.
- WEAR LEVEL: ten years dead. Sheet metal sun-bleached and chalked, panels
  pulled off for the copper inside (the coil is the single most stealable
  thing on a dead house and Vegas already had a copper-theft economy BEFORE
  the collapse — this is the honest wear story), dish rusted and hanging
  crooked on its arm, solar panels crazed and opaque with dust.
- VARIANTS: one intact-ish and one stripped variant of the package unit
  (stripped is the common case); single variants of the rest.

## F. THE CAPTION
```json
{
  "id": "TF-CITY-002",
  "name": "rooftop equipment",
  "layer": "prop",
  "solid": false,
  "enter": false,
  "district_families": ["suburb", "apartment", "trailer", "commercial", "motel"],
  "best_time": "any",
  "best_location": "on a roof field cell near the ridge; the dish at a hip edge",
  "place_next_to": ["roof_slope", "roof_deck", "roof_ridge"],
  "never_next_to": ["roof_eave", "any ground tile", "portal"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "single placement",
  "anim": null,
  "tags": ["prop", "roof", "hvac", "salvage", "suburb", "dead-world"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the blessed LAMP DARK VARIANTS bank
  (banks/BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt) — it is the repo's reference
  for a dead man-made metal object at 45 degrees with a sky-lit top and no
  keyline, and it is the named reference of the 45 DEGREE ART LAW. The AC box
  is a lamp-bank problem with a different silhouette.
- NAMED OUTSIDE REFERENCE: Streets of Rogue and Prison Architect for how
  rooftop clutter at this exact zoom gives a flat top-down building its scale
  and its read — a box and two pipes is the whole trick. Take the SPARSENESS
  and the placement logic, never their palettes or their outlines.
- REAL-WORLD GROUNDING: this is a Las Vegas-specific truth and it is the
  reason the form exists. In most of America a house's AC condenser sits on the
  GROUND beside the house; in the Las Vegas valley the standard residential
  install is a ROOFTOP PACKAGED UNIT — one cabinet holding cooling, heating and
  the air handler, sitting on a curb on the roof. Drive any Vegas subdivision
  and every roof has a box on it. Older valley homes ran EVAPORATIVE ("swamp")
  coolers, and a huge number of those were later converted to refrigerated
  package units, leaving the original cooler shell dead on the roof — that is
  a real, specific, common Vegas silhouette and it is free storytelling for a
  dead world. Add plumbing vent stacks (code-required through the roof) and
  the satellite dishes that blanketed the valley's rentals. A Vegas roof is
  NOT empty in real life, which is exactly why ours reads as fake.

## H. DON'T WANT
- NOT commercial/industrial scale. A rooftop chiller, a duct run, a cooling
  tower — those belong to industrial districts and would make a tract house
  read as a warehouse. This is the single most likely failure.
- NOT a ground-mounted condenser on the roof. If it looks like the thing that
  normally sits in a side yard, it is wrong for Vegas (see grounding). The
  ground-side condenser is TF-CITY-007's problem, not this one.
- NOT working. Nothing spins, nothing glows, nothing hums, no heat shimmer.
  Act 1 has no power outside the 12%, and even there the machine is dead.
- NOT clean, NOT new, NOT complete. A ten-year roof unit has been opened up
  for its copper.
- NOT a flat side-on rectangle. This is the set where the 45 law is easiest to
  break and most obvious when broken.
- NOT purple, not green.

## I. ACCEPTANCE
- [ ] Seam: n/a (single placement) — but each prop must sit on ANY roof
      material without a halo or a background square
- [ ] Palette ceiling + **top** value band + one-light + no-keyline +
      no-dither + no-glow (max hot frac 0.02) checks green
- [ ] Squint test: at walk zoom the package unit must read as a BOX ON A ROOF,
      not a hole in the roof
- [ ] 3x3 proof is the wrong test here; instead a WHOLE-BLOCK proof: six
      houses dressed at the intended density, to prove the roofs read varied
      without reading busy
- [ ] ON THE REAL SURFACE: the run, standing at the front door (the exact
      scratchpad x_door.png framing), beside today's blank-slab render
- [ ] Caption JSON parses and matches C/D
- [ ] ENGINE PRECONDITION NAMED: the runtime shadow pass has no roof-plane
      case yet. Judged with shadows off is acceptable; shipping without one is
      a separate backlog item, not a reason to hold the art.

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: CITY lane (screenshotted on the real run
  surface 7/28) | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 61 | VERDICT: —
