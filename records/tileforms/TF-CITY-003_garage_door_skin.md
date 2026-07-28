# TILE FORM TF-CITY-003 — THE RESIDENTIAL GARAGE DOOR, IN THE HOUSE-SKIN
# LANGUAGE

## A. IDENTITY
- NAME: The garage door on the front of a house — the big roll-up panel
- FAMILY/SET: HOUSE SKIN family, garage half. One drawing job: the 2-tall bay
  (top + bottom) and its left/right jamb cases, cooked per approved house-skin
  wall material so a garage matches the house it is bolted to.
- THE JOB, ONE SENTENCE: this exists so the biggest single feature on the
  front of every Vegas tract house stops being the frozen target set's orange
  panel stuck onto a house wearing one of Paolo's 30 approved skins.

## B. WHY
- DEMANDED BY: the HOUSE SKIN verdict (30/30 UP, 7/21) — the skins are the
  house's material and the garage is part of the house; the suburb dossier's
  own decisions list, which makes "street -> driveway -> front-garage" a PAOLO
  RULING for every home; the same 7/28 finding that produced TF-CITY-001.
- WHAT LOOKS BROKEN TODAY: measured in the run's garageMap() +
  bodyTile() — a garage cell returns `garage_top`, `garage_bottom`,
  `garage_top_l/r`, `garage_bottom_l/r`, all six of which exist ONLY in the
  frozen 42-tile CBB starter set. The 7/28 house-skin patch's SKIN_FIELD maps
  wall/roof/yard and deliberately does not touch garage ids, because there is
  nothing to map them to. On screen (scratchpad x_door.png) the garage bay
  reads as a dark rectangle in a different material from the wall it is set
  into, on every house.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md. HOUSE SKINS
  bank opened and all 30 keys listed: wall_plain_8..11, wall_window_12..14,
  wall_boarded_15..17, wall_door_18..20, 14 roof, 3 yard. **No garage tile
  exists.** DOOR CLIPS row opened
  (banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt, 30 clips): checked key by key —
  29 are SWING doors, and the single roll-up is `11._Indust_00_rollup`, whose
  own verdict note reads "industrial door #0 = rollup". An industrial roll-up
  is a tall narrow service door; a residential double garage door is a WIDE
  low panel with a completely different silhouette and panel rhythm. Using it
  is exactly the mistake Paolo already caught once on walls ("ur using some
  bullshit that u made for a house wall as the suburb wall") and the WALL
  TAXONOMY law generalises: an industrial opening and a residential opening are
  not one pool. STARTER TILESET garage_* is the fallback causing the bug.
  Nothing in the index covers this.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode). At map zoom: not read.
- DISTRICT FAMILIES: suburb (every home, by ruling), plus any district with a
  residential garage mass — estate, gated, some apartment carports.
- LAYER: structure (it is the building's front face) — but the OPEN state is a
  portal, see below.
- SOLID? yes when closed — ENTERABLE? YES: the garage is a declared PORTAL in
  the suburb dossier ("garage interior: 1-2 car bays, junk shelves, a door into
  the house"), and INTERIOR-MATCHES-EXTERIOR means the bay interior is exactly
  the footprint w x h, never resized.
- MUST SIT BESIDE: the house-skin wall material of the SAME house on both
  jambs; wall_under_eave above; a driveway (code 3) or its apron directly
  below — a garage door that does not face pavement is a bug, and the run's
  garageMap() already counts the driveway rather than guessing.
- NEVER BESIDE: yard on the approach side (a garage opening onto dirt);
  another garage bay of a different house; the perimeter wall (a garage never
  opens through the community wall — that is TF-CITY-005's gate).
- EDGE CONTRACT: WANG-16 edge set (the bay plus its two jamb cases, top and
  bottom courses). Interior-facing edges hash to the house-skin wall material
  the same way TF-CITY-001's do; the existing starter-set garage seam rings
  (garage_top/bottom and their _l/_r, all six listed in the visual
  constitution) are the shapes to match.

## D. WHEN
- ACT: 1
- BEST TIME: both. No self-light. A garage bay's mouth is DEAD DARK when open
  — the constitution's glow rule (max hot frac 0.02) applies: never a warm
  glow from inside.
- WEATHER STATES: sunny baseline; cloudy no change; rain wets the apron below
  it, not the door — but the bottom rail of a steel door shows the water line,
  a value shift only.
- LIT/UNLIT: none in the art. A garage inside the powered 12% gets its light
  from the cluster pass.
- ANIMATION: STATIC, deliberately, and this is a ruling-shaped choice so it is
  flagged: the approved door bank animates at 9 frames / 2 beats / 120 BPM, so
  an ANIMATED garage door is technically in-language. It is NOT requested here
  because act-1 garage doors are dead steel with no opener and no power, and a
  hand-lifted door is a different interaction than a swinging front door.
  **If Paolo wants it animated, that is his call and it becomes a variant of
  this form, not a new one.**

## E. HOW
- EXACT SIZE: 44 x 44 px per tile, 2 tiles tall by BAY_W wide (the run already
  caps a bay at BAY_W and lays it as a 2-tall pair — this form matches the
  geometry that exists, it does not change it).
- VIEW: 45-degree world view. The door is the front FACE of the mass, its top
  edge catching the sky, the jambs turning away. The panel seams run
  horizontally and must bow correctly for the view, not sit as a flat ladder.
- PALETTE: constitution ceiling. Value band: **wall** (mean 96.0, lo 37.5, hi
  167.6) — the widest band in the constitution, because faces sit in their own
  eave shadow. The door is METAL against STUCCO, so it should sit lower in the
  band than the wall beside it.
- LIGHT: upper left, shadows down and to the right. NO keyline. NO dither.
- SHADOWS: none baked. The eave above casts onto the door at runtime.
- SCALE ANCHORS: a real double garage door is 16 ft wide x 7 ft tall; a single
  is 8-9 ft. The 2-tile door already in the starter set is the human-height
  anchor and the garage door must read WIDER AND SHORTER than two front doors
  side by side, or the house loses its scale.
- WEAR LEVEL: ten years. Steel sectional doors dent and the bottom panel
  bows; sun destroys the paint on the south face first (and in the run's own
  street-aware law the primary street is preferred SOUTH, so the sun-killed
  face IS the one you look at); springs fail so doors sit half-open or racked
  crooked in the track; some have been forced — pried at the bottom corner,
  which is how you actually get into a dead garage.
- VARIANTS: closed, forced/racked (sitting crooked), and open-to-a-dark-bay.
  Three states, one silhouette, per approved wall material. Colorways ride the
  material; they are not progress (STRUCTURE-NOT-COLOR).

## F. THE CAPTION
```json
{
  "id": "TF-CITY-003",
  "name": "residential garage door",
  "layer": "structure",
  "solid": true,
  "enter": true,
  "district_families": ["suburb", "estate", "gated", "apartment"],
  "best_time": "any",
  "best_location": "the house face that a driveway touches, always toward pavement",
  "place_next_to": ["house-skin wall (same house)", "wall_under_eave", "driveway", "driveway apron"],
  "never_next_to": ["yard on the approach side", "another house's garage", "perimeter wall"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "wang-16",
  "anim": null,
  "tags": ["structure", "portal", "garage", "house-skin", "suburb"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt wall
  materials (the door must belong to the wall it is set into) + the frozen CBB
  target's six garage_* tiles for the SHAPE and the seam rings (their geometry
  and placement logic are correct; only their material is wrong).
- NAMED OUTSIDE REFERENCE: Project Zomboid's suburban garage doors for the
  panel rhythm at this zoom — how few horizontal lines you need before it
  reads as a sectional door. Take the rhythm, never the palette. Secondary:
  the approved door bank's own DOOR FRAME LAW bands, so a garage jamb reads as
  the same world as a front door jamb.
- REAL-WORLD GROUNDING: in the Las Vegas valley the FRONT-LOADED two-car
  garage is the defining feature of tract housing — the suburb dossier already
  measures it as a ~6 x 6 m garage on a ~16 m lot, which means the garage door
  is roughly a THIRD of the house's street frontage. It is the first thing you
  see and the biggest single rectangle on the facade. Vegas-specific wear: the
  valley gets ~300 sunny days and summer surface temperatures that destroy
  paint and embrittle the vinyl weather seal at the bottom rail; a dead
  neighbourhood's garages are the obvious salvage target because that is where
  the tools, the freezer and the second car are, so FORCED doors should be
  common, not rare.

## H. DON'T WANT
- NOT the industrial roll-up (`11._Indust_00_rollup`). Wrong proportion, wrong
  building, wrong world. Naming it here so nobody "reuses" it.
- NOT the target set's orange panel on a brown house. That is the bug.
- NOT a "sideways U" garage mass. Paolo 7/27, verbatim: "u tried to make
  garages like sideways u's and its very bad." The bay is a BAY at the end the
  car comes from, never a wrapped shape. Already fixed in the geometry; do not
  reintroduce it in the art.
- NOT a lit or glowing bay interior. Dead dark.
- NOT clean, NOT suburban-catalogue. No carriage-house decorative hardware.
- NOT windows in the top panel unless they are DEAD DARK GLASS (the
  constitution's act-1 window rule is absolute).

## I. ACCEPTANCE
- [ ] Seam ring hash: jamb edges hash to the house-skin wall material; the
      2-tall pair hashes to itself across the horizontal join
- [ ] Palette ceiling + **wall** value band (96.0 mean, 37.5-167.6) +
      one-light + no-keyline + no-dither + no-glow checks green
- [ ] Squint test: reads as WIDER AND SHORTER than two front doors
- [ ] 3x3 proof plus a FULL FACADE proof: the garage in place on a house
      front, beside the front door, driveway below, eave above
- [ ] ON THE REAL SURFACE: the run, a suburb block, beside today's render
- [ ] Caption JSON parses and matches C/D
- [ ] Interior check: the bay behind an open door is exactly the footprint
      w x h (INTERIOR-MATCHES-EXTERIOR), never clamped

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: CITY lane (measured 7/28 against the skin bank
  and the door bank, both opened) | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 62 | VERDICT: —
