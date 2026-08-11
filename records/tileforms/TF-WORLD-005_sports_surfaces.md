# TILE FORM TF-WORLD-005 — SPORTS SURFACES (track, court, field, green, bunker)

## A. IDENTITY
- NAME: Sports surfaces (the painted, engineered grounds people played on)
- FAMILY/SET: SPORTS SURFACE family — rubberised running track + hard court
  (tennis/basketball) + dead field turf with mown stripes and yard lines +
  skinned infield dirt + putting green + sand bunker + speedway banking and
  apron. ONE drawing job: they are all "an engineered surface with paint on it".
- THE JOB, ONE SENTENCE: this tile exists so that the seven sporting districts
  each keep the surface that makes them recognisable, because the track, the
  diamond and the fairway ARE those districts' landmarks under the 7/28 law.

## B. WHY
- DEMANDED BY: EVERY DISTRICT IS ITS OWN LANDMARK (Paolo 7/28, LOCKED) — and
  for school, ballpark, stadium, speedway, golf and campus the landmark IS the
  playing surface. Also Paolo's 7/28 ruling "High school", which put a real
  stadium (track + field + bleachers) into the game the same day.
- WHAT LOOKS BROKEN TODAY: the school's rust track, the ballpark's diamond and
  outfield, the stadium's field, golf's fairway/green/bunker, the speedway's
  banking and apron and campus's rec court all render as flat colour blocks.
  The high school I shipped 7/28 reads only because of GEOMETRY; the surfaces
  under it are untextured.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md —
  * ROAD MARKINGS (84 items, 14 classes): road paint — lane lines, arrows,
    crosswalks. Checked: no yard lines, no court lines, no track lanes. Wrong
    vocabulary and wrong proportions.
  * DESERT/TERRAIN + the coming DEAD FOLIAGE set (row 5): dead lawn is
    foliage; a MOWN, STRIPED, LINE-PAINTED sports field is an engineered
    surface, not a lawn — the stripes and lines are the whole read.
  * STARTER TILESET (42): residential street only.
  Nothing in the index claims a sports surface.

## C. WHERE
- SURFACE + TAB: RUN + CITY; and these are among the few ground surfaces that
  MUST survive the squint test at map zoom, because the track oval and the
  diamond wedge are the districts' one-tile silhouettes.
- DISTRICT FAMILIES: school, ballpark, stadium, speedway, golf, campus, park.
- LAYER: ground
- SOLID? no — ENTERABLE? no
- MUST SIT BESIDE: dead turf and dead lawn; lot asphalt; kerb; bleachers and
  outfield wall at the boundary; sand bunker beside fairway.
- NEVER BESIDE: interior floors; living green turf.
- EDGE CONTRACT: SELF-SEAMLESS for the field/turf/track fields; SINGLE
  PLACEMENT for the painted line and marking pieces (a yard line does not
  tile — it is placed once at a known offset).

## D. WHEN
- ACT: 1
- BEST TIME: both. Under the stadium light towers at night is the single
  strongest image the school district has — but LIGHT=TERRITORY decides
  whether anyone owns that light, so the tile itself carries no glow.
- WEATHER STATES: sunny baseline. RAIN: the skinned infield and the track hold
  water and go dark; the crowned field sheds it. Value-shift colorways.
- LIT/UNLIT: no self-light.
- ANIMATION: static.

## E. HOW
- EXACT SIZE: one tile, starter-set native px.
- VIEW: 45-degree world view, flat ground planes.
- PALETTE: constitution ceiling; GROUND band. These carry REAL HUE by design —
  per the 7/28 colour measurement (our icons ran 3 hue families and 13%
  chromatic against Pocket City 2's 12 and 88%), the rust track, the blue-green
  court and the dead green field are exactly where distinct faded hue belongs.
- LIGHT: the one global direction. NO keyline. NO dither.
- SHADOWS: none baked.
- SCALE ANCHORS: a football field is 48.8 m wide (~65 tiles) and yard lines are
  every 4.6 m (~6 tiles); a tennis court is 10.97 m wide; a track lane is
  1.22 m. These proportions are what make it read as a real sport rather than
  a decorative pattern.
- WEAR LEVEL: rubberised track fades from red to dusty rust and splits along
  its seams, weeds in the splits. Hard courts craze and the colour chalks.
  Painted lines ghost — visible but broken, never crisp. Skinned dirt goes
  crusty and weedy. A putting green without water is the FIRST thing to die on
  a golf course: it goes bare and hard before the fairway does.
- VARIANTS: track surface + lane lines; hard court + court lines; field turf +
  mown stripe + yard lines + end zone; skinned dirt; putting green; sand
  bunker; speedway banking + apron stripe.

## F. THE CAPTION
```json
{
  "id": "TF-WORLD-005",
  "name": "sports surfaces",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["school","ballpark","stadium","speedway","golf","campus","park"],
  "best_time": "any",
  "best_location": "inside any stadium, track, court, diamond or fairway",
  "place_next_to": ["dead turf","dead lawn","lot asphalt","kerb","bleachers","outfield wall","sand bunker"],
  "never_next_to": ["interior floor","living green turf"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "self-seamless fields + single placement lines",
  "anim": null,
  "tags": ["ground","sport","painted","landmark-surface","hue-carrier"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the approved MARKING bank's paint VALUES (the white is the
  same white) even though its shapes do not apply; and the cemetery district's
  approved dead-mown-grass read for the striping logic.
- NAMED OUTSIDE REFERENCE: Pocket City 2's stadium and park tiles for how a
  sports surface stays legible at tiny scale by leaning on ONE strong marking
  rather than full detail.
- REAL-WORLD GROUNDING: Las Vegas high-school stadiums (Bishop Gorman, Faith
  Lutheran) run poured rubberised tracks in rust-red around natural or
  synthetic fields; Clark County golf courses are the valley's biggest water
  users and are the first thing cut in a drought, so a dead Vegas fairway is a
  documented real image — hard, bleached, with the greens dying first and the
  sand bunkers staying perfectly intact because sand does not care. The
  fairway-against-live-desert boundary stays razor sharp for years.

## H. DON'T WANT
- NOT crisp bright paint. Every line is ghosted.
- NOT green. The one exception is a faded dead-green tint on turf; a saturated
  living green breaks the dead-world law outright.
- NOT a decorative stripe pattern with wrong spacing — if the yard lines are
  not at real proportions the whole field reads as carpet.
- NOT the same value as lot asphalt; if the field does not separate from the
  parking around it, the landmark is gone.

## I. ACCEPTANCE
- [ ] Field seams measured; painted lines are single-placement, not tiled
- [ ] Palette ceiling + GROUND band + one-light green; hue variety recorded
      (this form is expected to RAISE the district's hue-family count)
- [ ] Squint test: track oval and diamond wedge readable at 1 tile
- [ ] 3x3 TILED PROOF + one assembled field with its markings at true spacing
- [ ] ON THE REAL SURFACE: the high school stadium wearing it
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: COVERED BY MERGED COOK 8/9/26: the swarm's dedup merged this form into TF-ART-005's job (this form is a declared consumer). Candidates: banks/tileforms/TF-ART-005_CANDIDATES_8_8_26.json, judge: the ART tab, TILE BOARD. APPROVED 8/11/26 with its covering bank (TILE BOARD verdict). | REQUESTED BY: WORLD | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 34 | VERDICT: —
