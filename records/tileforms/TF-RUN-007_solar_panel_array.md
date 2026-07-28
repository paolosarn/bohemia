# TILE FORM TF-RUN-007 — SOLAR PANEL ARRAY (fixed + frozen tracker)

## A. IDENTITY
- NAME (plain words a person would say): Solar panels — the rows of tilted dark
  glass panels on steel posts that cover a solar farm
- FAMILY/SET: SOLAR ARRAY family — panel row (the repeating unit), row end,
  the torn/collapsed panel, and the frozen tracker at an odd angle.
- THE JOB, ONE SENTENCE: this tile exists so a solar farm reads as a solar farm
  — endless dark ranks facing the wrong way — instead of as rows of stucco
  walls, which is what it is today.

## B. WHY (the need — no ruling, no tile)
- DEMANDED BY: RUN backlog 0b (DISTRICT ART), and the 7/28 EVERY DISTRICT IS
  ITS OWN LANDMARK law — the district theme sheet's own solar hook is
  "frozen solar trackers out of step", which cannot be drawn because no panel
  exists. Measured this turn:
  records/BOHEMIA_RUN_DISTRICT_MATERIAL_SURVEY_7_28_26.md.
- WHAT LOOKS BROKEN TODAY WITHOUT IT: solar `solar panel` ×354 per cell renders
  as `wall_0/1/2` — pale cracked house stucco. So the single most recognisable
  industrial silhouette in the Mojave currently looks like a field of tiny
  suburban walls. The district's ground (`gravel access road` ×1150) is the
  other half of the same failure and is covered by TF-RUN-002.
- SHOPPING CHECK (records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md):
  - Checked the whole index for anything dark-glass, panel, or array: the
    approved corpus has HOUSE SKINS, PERIMETER WALLS, DOOR CLIPS, MARKINGS,
    LAMPS, FIRE/PARTICLE LOOPS, GORE, INTERIOR POOL, DESERT/TERRAIN,
    STREET POOLS, SEAM-FIXED SURFACES, STARTER TILESET, WARDROBE. **Nothing in
    any of them is a solar panel or any equivalent tilted-glass object.**
  - DISTRICT_HERO_CANDIDATES v7 — flagged in the index as UNJUDGED and part of
    "THE INVERSION" (unjudged art carrying more plumbing than approved art).
    Deliberately NOT used as cover: an unjudged bank is not an approved bank,
    and leaning on it is the exact inversion the index flags as a defect.
  - Genuine hole.

## C. WHERE (place — the game code reads this)
- SURFACE + TAB: RUN (the walk); CITY human mode; and this one DOES have a map
  presence — a solar farm is readable from altitude and is a navigation
  landmark, so the squint test applies.
- DISTRICT FAMILIES: solar. Single panels also belong on battery-yard control
  buildings and on the odd off-grid roof, but the ARRAY is solar's.
- LAYER: structure
- SOLID? YES (you walk the aisles between rows, not through them) —
  ENTERABLE? no.
- MUST SIT BESIDE: itself along a row; its own row-end; gravel access road
  (TF-RUN-002) in the aisles between rows; chain-link fence (TF-RUN-003) at the
  site boundary; the inverter/transformer block.
- NEVER BESIDE: any residential material; dead lawn; interior floors.
- EDGE CONTRACT: SELF-SEAMLESS along the row axis (rows are long and repetition
  is the POINT — a solar farm is supposed to look endless). Row ends are
  SINGLE PLACEMENT. The frozen-tracker variant is SINGLE PLACEMENT and
  deliberately breaks the rhythm.

## D. WHEN (time & state — the invisible-caption inputs)
- ACT: 1
- BEST TIME: BOTH, and this is the asset where it matters most in the whole
  survey. Panels are DARK GLASS: by day they are near-black rectangles against
  pale gravel — the strongest value contrast on any exterior surface in the
  game — and at night they vanish into the dark almost entirely. That
  disappearing act is free atmosphere and should be authored, not fought.
- WEATHER STATES: sunny baseline; cloudy — glass loses its sky reflection and
  goes flatter and slightly lighter; RAIN — no wet variant needed (glass is
  already specular), but rain is the only thing that ever cleans a panel, which
  is a nice bit of world logic to leave in the caption.
- LIT/UNLIT variant needed? No self-light. But LIGHT=TERRITORY is loud here: a
  solar farm is a POWER SOURCE, so whoever holds it is exactly who has light in
  a 12%-lit world. The panels themselves stay dark; what they feed does not.
- ANIMATION: static. The "frozen tracker" is static BY DEFINITION — the story
  is that the trackers stopped mid-rotation and never moved again, so the rows
  are out of step with each other. That mis-alignment is the whole hook and it
  is placement, not animation.

## E. HOW (build spec — the art lane's one-shot recipe)
- EXACT SIZE in px: frozen starter tileset native cell. Footprint: the panel
  ROW is the unit; a row runs many tiles long and is roughly 1-2 tiles deep.
- VIEW: 45-degree world view — a panel is a TILTED PLANE, which makes this the
  clearest test of the 45 DEGREE ART LAW on the board: you see the top face
  foreshortened, the support posts beneath, and the dark underside shade. Never
  flat side-on, never a plain top-down rectangle.
- PALETTE: constitution ceiling; STRUCTURE value band — but note this asset
  legitimately sits at the DARK END of it, which is unusual for this game and
  should be checked against the band rather than assumed to break it. If the
  band cannot hold it, that is a finding worth raising, not a reason to
  lighten the glass into unreality.
- LIGHT: the one global direction. The panel's top face catches sky; the
  underside is the darkest value on the exterior. NO keyline. NO dither. The
  cell grid within a panel is a REGULAR PATTERN — declare it to the dither
  check like the fence and the metal siding.
- SHADOWS: none baked. A panel row throws a long hard shadow onto the gravel
  and that belongs to the separate shadow pass — but the art lane should know
  it is coming, because a panel authored with its shadow baked in will double
  up and look wrong.
- SCALE ANCHORS: a utility panel is roughly 3ft x 6ft; a row is chest-to-
  head-height at its high edge. Against the 2-tall door that puts the high edge
  at roughly one tile. The player should be able to see OVER the rows, which is
  what makes an array read as endless rather than as a maze.
- WEAR LEVEL: dead world. Dust film is the big one — in the Mojave, panels
  soil measurably within weeks and nobody has washed these in years, so the
  glass is HAZED, not glossy. Cracked panels (spiderweb fracture patterns,
  which are beautiful and very readable), a few missing entirely leaving bare
  racking, posts still perfectly straight because steel in dry desert does not
  move.
- VARIANTS: panel row, row end, cracked panel, missing panel (bare rack),
  frozen tracker at an off angle. One geometry, several states.

## F. THE CAPTION (ships with the tile — machine-readable)
```json
{
  "id": "TF-RUN-007",
  "name": "solar panel array",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": ["solar", "battery", "offgrid-roofs"],
  "best_time": "day — near-black glass against pale gravel is the strongest exterior contrast in the game; vanishes at night",
  "best_location": "long parallel rows with gravel access aisles between them, fenced at the site boundary",
  "place_next_to": ["solar panel array", "row end", "gravel / ballast ground", "chain-link fence", "transformer block"],
  "never_next_to": ["house stucco", "dead lawn", "interior floors"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "self-seamless along the row axis; single-placement row end and frozen tracker",
  "anim": null,
  "tags": ["structure", "glass", "dark-value", "landmark", "map-readable", "power", "regular-pattern", "frozen-tracker-hook"]
}
```

## G. REFERENCES (all three required)
- APPROVED ANCHOR: the frozen starter tileset's value bands are the ruler —
  this asset deliberately sits at the dark end of STRUCTURE, against
  TF-RUN-002's pale gravel. The approved LAMP DARK VARIANTS bank is the
  nearest thing in the corpus to "a dark manufactured object in daylight" and
  is the closest tonal reference available.
- NAMED OUTSIDE REFERENCE: **Factorio**'s solar panel field for the read of
  endless industrial repetition that stays quiet — its lesson is that the
  ARRAY is the object, not the panel. **Horizon Zero Dawn**'s and
  **Death Stranding**'s abandoned infrastructure for the specific feeling of
  precision machinery still standing perfectly straight in a world that has
  otherwise gone soft — which is exactly the Mojave truth below.
- REAL-WORLD GROUNDING: the valley is ringed by real utility solar — Nellis
  Solar Power Plant on the air force base, Copper Mountain and Techren down at
  Boulder City, plus the Mega Solar arrays. They are single-axis TRACKERS:
  long north-south rows on steel torque tubes that rotate east-to-west through
  the day. When the control system dies they stop wherever they were and stay
  there — which is why "frozen trackers out of step" is not invented flavour,
  it is what actually happens. Mojave soiling is severe (panels lose several
  percent output within weeks unwashed) so abandoned glass goes matte and
  dust-hazed fast. Steel racking in dry desert barely corrodes, so the geometry
  stays crisp for decades while the glass goes dull and cracks.

## H. DON'T WANT (the anti-reference)
- NOT flat top-down rectangles. A panel is a TILTED PLANE with posts under it;
  a flat dark rectangle reads as a hole in the ground. This is the primary
  failure mode.
- NOT flat side-on. 45 DEGREE ART LAW.
- NOT glossy / mirror-blue. Clean panels are a photograph cliché; ours are
  dust-hazed matte, and that is the whole point of a dead world.
- NOT sci-fi. No glowing edges, no energy lines, no blue emissive anything —
  that also risks the PURPLE RESERVATION and the glow ceiling.
- NOT all identical and perfectly aligned. The frozen-tracker mis-alignment is
  the approved district hook; a perfectly regular field throws the story away.
- NOT rusted-collapsed. Steel in dry desert stays straight — a sagging,
  rust-eaten array is the wrong climate and contradicts the grounding.

## I. ACCEPTANCE (what the machine proves BEFORE Paolo ever sees it)
- [ ] SQUINT TEST at map zoom: a solar district must be identifiable as a solar
      district from its silhouette alone (it is a navigation landmark)
- [ ] Value check: sits at the dark end of the STRUCTURE band WITHOUT breaking
      the constitution's ceiling; if the band cannot hold it, that is reported
      as a finding, not silently lightened
- [ ] Row seam measured along a 10-tile run; no edge darkening
- [ ] Tilted-plane read verified against the 45-degree law (posts visible,
      underside shaded, top face foreshortened)
- [ ] Regular cell pattern declared to the dither check; glow check green (no
      emissive)
- [ ] 3x3 tiled proof + a full-field proof (4 rows with aisles) + the frozen
      tracker breaking the rhythm
- [ ] ON THE REAL SURFACE: screenshot of the solar district wearing it on
      TF-RUN-002 gravel, beside the current all-stucco render
- [ ] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: RUN lane (0b district-material survey, 7/28)
  | DATE: 7/28/26 | PRIORITY: MED
- BOARD ROW #: 14 | VERDICT: —
