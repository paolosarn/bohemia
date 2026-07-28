# TILE FORM TF-WORLD-006 — RAILWAY PERMANENT WAY

## A. IDENTITY
- NAME: Railway track (ballast, sleepers, rails — the line the city grew from)
- FAMILY/SET: PERMANENT WAY family — ballast prism + sleepers + running rails
  + turnout/point blades + level-crossing panels + cess and drainage ditch +
  buffer stop. ONE drawing job.
- THE JOB, ONE SENTENCE: this tile exists so that the 90-cell mainline that is
  the literal reason Las Vegas exists reads as a railway instead of a grey
  stripe, and so that it reads as ONE CONTINUOUS LINE for its whole length.
- FAMILY NOTE: a railway is NOT built from the road vocabulary — no lanes, no
  median, no kerb, no intersections. That was a recorded 7/27 error and this
  form exists partly to stop it recurring.

## B. WHY
- DEMANDED BY: the rail surface shipped 7/27 (engine/bohemia_rail.js, 90 cells,
  gate RAIL) plus railyard and the freeway's rail-under-bridge condition. Las
  Vegas began as a Union Pacific WATER STOP — the railway is the origin of the
  city and it currently has no art at all.
- WHAT LOOKS BROKEN TODAY: ballast, tie, rail, cess, drainage ditch, turnout,
  rail-under-bridge and railyard track all render as flat colour bands. The
  mainline reads as a long grey scar.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md —
  * STREET BLOCKS + ROAD MARKINGS: road vocabulary; explicitly the wrong
    object per the 7/27 finding. Checked and rejected.
  * DESERT/TERRAIN: the ground either side, not the track.
  * HD PACK UP list: no rail family.
  Nothing in the index claims permanent way.

## C. WHERE
- SURFACE + TAB: RUN (you walk the line and cross it) + CITY + MAP (the line
  is a Lynch EDGE across the whole valley and should read at map zoom).
- DISTRICT FAMILIES: rail (the mainline), railyard, freeway (under-bridge),
  industrial and warehouse spurs, town (the water-stop origin).
- LAYER: ground for ballast/sleepers/rails; the rail head is a raised ground
  detail, never a structure (you step over it).
- SOLID? no — ENTERABLE? no
- MUST SIT BESIDE: itself endlessly along the alignment; cess and ditch either
  side; ROW fence (TF-WORLD-003) outside that; level-crossing panels where a
  road crosses; gravel/material yard at sidings.
- NEVER BESIDE: lot asphalt with no crossing panel (a road meeting a rail with
  no crossing treatment is the tell of a fake railway); interiors.
- EDGE CONTRACT: SELF-SEAMLESS along the running direction (a track repeats
  forever) + SINGLE PLACEMENT for the turnout, the crossing and the buffer stop.

## D. WHEN
- ACT: 1
- BEST TIME: both; no self-light. Signals are dark (they are a separate prop).
- WEATHER STATES: sunny baseline; rain darkens ballast and fills the ditch —
  the ditch is the one place on the alignment where water is supposed to be.
- LIT/UNLIT: none.
- ANIMATION: static. Act 1 is dead; nothing runs.
- CONTINUITY REQUIREMENT (unusual, and it is why this form exists): the rail
  gate walks all 12,288 tile rows of the column and requires rail underfoot the
  whole way. The art must not break that read where the freeway crosses over.

## E. HOW
- EXACT SIZE: one tile, starter-set native px. Standard gauge is 1.435 m =
  ~2 tiles at 0.75 m/tile, so the two running rails sit about two tiles apart:
  the gauge is the single most important proportion on this form.
- VIEW: 45-degree world view. The ballast is a raised PRISM with sloped
  shoulders — that slope is what makes it read as a railway rather than a
  painted stripe. Sleepers sit in it; rails sit proud on the sleepers.
- PALETTE: constitution ceiling; GROUND band. Ballast is the coarsest-reading
  ground in the game and that contrast is deliberate.
- LIGHT: the one global direction. NO keyline. NO dither.
- SHADOWS: none baked.
- SCALE ANCHORS: gauge 1.435 m; sleepers every 0.6 m (sub-tile, so SUGGEST the
  rhythm, do not draw every one); rail head is a few centimetres.
- WEAR LEVEL: this line is dead but INTACT — nobody has lifted the mainline.
  Rails go orange-brown with a polished crown only where wheels ran (and in
  act 1 nothing has run in years, so the polish is gone and the whole rail is
  rust). Ballast holds its shape but weeds take the four-foot and the cess.
  Sleepers are timber or concrete, split and sun-greyed. AT LIFTED SPURS the
  sleepers and ballast remain with the rails gone — that is a distinct and very
  readable variant (the alignment of a spur whose steel was scrapped).
- VARIANTS: plain running track, turnout/points, level-crossing panels,
  lifted-rail alignment (rails scrapped, sleepers left), buffer stop, cess+ditch.

## F. THE CAPTION
```json
{
  "id": "TF-WORLD-006",
  "name": "railway permanent way",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["rail","railyard","freeway","industrial","warehouse","town"],
  "best_time": "any",
  "best_location": "along the mainline alignment and every siding and spur",
  "place_next_to": ["permanent way","cess","drainage ditch","ROW fence","level crossing panels","gravel yard"],
  "never_next_to": ["lot asphalt with no crossing panel","interior floor"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "self-seamless along running direction + single placement specials",
  "anim": null,
  "tags": ["ground","rail","permanent-way","ballast","lynch-edge","origin-of-the-city"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the frozen CBB ground value band; and the approved
  DESERT/TERRAIN values for the ground the alignment runs through.
- NAMED OUTSIDE REFERENCE: Fallout: New Vegas's rail alignments for how a dead
  line reads across desert at distance; Project Zomboid's track for the
  sleeper rhythm at small tile scale.
- REAL-WORLD GROUNDING: the Union Pacific mainline through Las Vegas — the
  city was founded in 1905 as a railroad WATER STOP on the San Pedro, Los
  Angeles & Salt Lake line, and the yard was the town's original employer. The
  track is standard gauge on crushed-rock ballast with a maintenance road on
  ONE side and a right-of-way fence. In the Mojave, weathering is UV and sand,
  not frost: ties silver, ballast fills with wind-blown fines, and creosote
  bush colonises the cess long before anything reaches the four-foot.

## H. DON'T WANT
- NOT road vocabulary. No lane lines, no kerbs, no median, no intersection
  treatment — this is the named 7/27 error.
- NOT a flat painted stripe. Without the ballast prism slope it is not a track.
- NOT every sleeper drawn (sub-tile spacing = noise).
- NOT shiny rail heads. Nothing has run in years.
- NOT severed at a crossing — the continuity read is gated.

## I. ACCEPTANCE
- [ ] Seam measured along the running direction; the line reads continuous over
      at least 20 consecutive tiles with no visible repeat
- [ ] Gauge proportion verified against 1.435 m at the shipped tile scale
- [ ] Palette ceiling + GROUND band + one-light green
- [ ] Squint test: the alignment reads as ONE LINE at map zoom
- [ ] 3x3 TILED PROOF + an assembled crossing and an assembled turnout
- [ ] ON THE REAL SURFACE: a rail cell wearing it, and one freeway-crossing
      cell proving the line is not severed
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: WORLD | DATE: 7/28/26 | PRIORITY: MED
- BOARD ROW #: 35 | VERDICT: —
