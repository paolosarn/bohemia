# TILE FORM TF-RUN-001 — DESERT GROUND, SEAMLESS (the worked example — this
# density is the bar for every form)

## A. IDENTITY
- NAME: Open desert ground (the dirt most of the valley stands on)
- FAMILY/SET: DESERT GROUND family — base hardpan + rock-scatter variant +
  the desert-to-pavement blob edge set (one drawing job, one form)
- THE JOB, ONE SENTENCE: this tile exists so that the twenty-plus desert
  districts stop wearing a measured black grid and read as one continuous
  Mojave floor you can walk for minutes without seeing a repeat.

## B. WHY
- DEMANDED BY: RUN backlog 0b1 (measured finding 7/28,
  records/BOHEMIA_DESERT_POOL_SEAM_FINDING_7_28_26.md) + the walkable-land
  law's render-and-look bar; weather ruling 7/28 makes ground the rain-wet
  canvas too.
- WHAT LOOKS BROKEN TODAY: every desert district shows a visible dark grid —
  each existing tile has a near-black border (interior mean 115-174 vs edge
  mean 27-67) so the world looks like graph paper, which is why the pool was
  pulled instead of shipped.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md
  DESERT/TERRAIN pool (8 tiles, flagged "not run") — checked, MEASURED, and
  disqualified: 3-5x wrap discontinuity, borders survive cropping (6px inset
  still 1.73x). The UP HD pack's ground tiles were checked: no open-desert
  hardpan family in it. Nothing else in the index claims ground.

## C. WHERE
- SURFACE + TAB: RUN (the walk) + CITY (human mode ground plane); appears at
  map zoom only as flat color, no icon.
- DISTRICT FAMILIES: bare desert cells, desert margins of every district,
  the landmark access spurs; the between-plots connective ground everywhere.
- LAYER: ground
- SOLID? no — ENTERABLE? n/a (it is the floor)
- MUST SIT BESIDE: itself endlessly; pavement/asphalt (via the blob edge
  set); sidewalk (edge set); dead-lawn tiles (dead foliage set, form
  pending); district aprons.
- NEVER BESIDE: interior floors (desert never leaks through a wall — the
  exterior-tiles-inside bug is a named Paolo complaint); green anything.
- EDGE CONTRACT: SELF-SEAMLESS for the base tile (wraps all 4 edges) +
  BLOB-47 family for the desert-to-pavement transition. Acceptance measures
  wrap delta vs the ~9-value normal neighbor step from the 7/28 finding.

## D. WHEN
- ACT: 1
- BEST TIME: both; at night it just darkens under the ambient pass (no
  self-light — the desert is the dark the lit places sit in).
- WEATHER STATES: sunny baseline; cloudy needs no change (wash handles it);
  RAIN-WET: a darkened, slightly saturated wet variant is wanted (rain is a
  rare event and wet dirt is half of what sells it) — same geometry, value
  shift only, so it is a colorway, not a new shape.
- LIT/UNLIT: none. Nobody owns the open desert's light.
- ANIMATION: static.

## E. HOW
- EXACT SIZE: one tile = the run's tile grid cell (match the frozen starter
  tileset's native px; the CITY blits at 22px — author at starter-set native
  so both consume without resampling).
- VIEW: 45-degree world view — ground plane reads flat with sky-lit top;
  rock scatter gets the ellipse cross-section treatment, never side-on.
- PALETTE: constitution ceiling; GROUND value band (the lightest structural
  band — ground must sit under structure values so building fronts pop).
- LIGHT: the one global direction. NO keyline (the measured failure was
  exactly a keyline-by-accident). NO dither.
- SHADOWS: none baked; rock scatter's shadow comes from the separate shadow
  pass.
- SCALE ANCHORS: rock scatter pieces smaller than a human foot-to-knee
  (props bigger than that are prop-layer asks, not ground texture).
- WEAR LEVEL: Mojave hardpan — cracked crust, caliche pale patches, no
  footprints (nobody has walked most of it in years).
- VARIANTS: base hardpan, 1 rock-scatter density, wet colorway. Anything
  more is a new form.

## F. THE CAPTION
```json
{
  "id": "TF-RUN-001",
  "name": "desert ground",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["desert", "margins", "spurs", "all-exterior-gaps"],
  "best_time": "any",
  "best_location": "any exterior ground not claimed by a district material",
  "place_next_to": ["desert ground", "pavement (blob edge)", "sidewalk (blob edge)", "dead lawn"],
  "never_next_to": ["interior floors", "green grass"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "self-seamless + blob-47 to pavement",
  "anim": null,
  "tags": ["ground", "mojave", "hardpan", "baseline"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the frozen CBB target screen's ground values
  (records/target/ + BOHEMIA_VISUAL_CONSTITUTION.json) — the ground band it
  establishes is the color truth.
- NAMED OUTSIDE REFERENCE: Fallout: New Vegas's Mojave floor for the READ
  (pale, cracked, sparse) — values only, never its 3D texture; Pocket City 2
  for how flat ground stays quiet under busy districts.
- REAL-WORLD GROUNDING: Mojave desert pavement/hardpan around Las Vegas —
  caliche (calcium-carbonate crust) reads PALE, almost bone, not brown;
  creosote flats are sparse dots, not continuous scrub; years of sun bleach
  everything toward gray-tan. The real desert is LIGHTER than game deserts
  usually are.

## H. DON'T WANT
- NOT the measured failure: no edge darkening of any kind — the grid IS the
  kill condition (records/BOHEMIA_DESERT_POOL_SEAM_FINDING_7_28_26.md).
- NOT dune sand (this is not the Sahara; no ripple patterns).
- NOT noisy: at walk zoom the ground must stay QUIET so buildings, props,
  and people pop; a busy floor is a failed floor.
- NOT brown-dark (see grounding: the real Mojave is pale).

## I. ACCEPTANCE
- [ ] Seam measured: interior-vs-edge delta within the ~9 normal step, wrap
      discontinuity ~1x (the finding's own numbers are the ruler)
- [ ] Palette ceiling + ground value band + one-light checks green
- [ ] Squint test: n/a (no map icon) — but must read as ONE surface at
      minimum walk zoom
- [ ] 3x3 tiled proof sheet + a 10x10 boredom check (no visible repeat motif)
- [ ] ON THE REAL SURFACE: screenshot of a desert district wearing it,
      beside the current broken pool render for contrast
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: coordinator (from RUN 0b1's measured finding)
  | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 4 | VERDICT: —
