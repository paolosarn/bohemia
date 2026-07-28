# TILE FORM TF-WORLD-013 — TANKS, TOWERS & SILOS (the vertical landmarks)

## A. IDENTITY
- NAME: Tanks and towers (water tower, silo, clarifier, storage tank)
- FAMILY/SET: VERTICAL VESSEL family — elevated water tower on lattice legs +
  grain/feed silo + circular clarifier tank with its sweep arm + ground storage
  tank + the access ladder and catwalk that make any of them read as real. ONE
  drawing job: they are all "a cylinder standing up".
- THE JOB, ONE SENTENCE: this tile exists so that the districts whose landmark
  is a tall round thing actually have one, since a cylinder is the single most
  recognisable silhouette available and we currently draw them as blocks.

## B. WHY
- DEMANDED BY: EVERY DISTRICT IS ITS OWN LANDMARK (Paolo 7/28) plus the Lynch
  landmark finding (we have zero). Paolo also asked directly about one:
  "dont know why theres a water tower i didnt ask for this district" (town,
  7/27) — recorded, and the answer is that a water tower is the reason a desert
  town exists at all, which is exactly why it must LOOK like one instead of a
  grey disc on sticks.
- WHAT LOOKS BROKEN TODAY: water tower (town), silo (farm), clarifier wall/core
  and pipe gallery (watertreat), transformer and switchgear (substation) all
  render as flat blocks. The town's water tower is currently a filled circle.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md —
  * HD PACK UP list: checked, no tank/tower/silo family.
  * HOUSE SKINS / PERIMETER WALLS / STREET BLOCKS / MARKINGS: all ground and
    residential vocabulary. None claims a vertical vessel.
  Nothing in the index covers this.

## C. WHERE
- SURFACE + TAB: RUN + CITY + MAP (this family exists to be seen from far away).
- DISTRICT FAMILIES: town, farm, watertreat, substation, battery, industrial,
  truckstop (fuel), airfield, rail (the water stop the city began as).
- LAYER: structure
- SOLID? yes — ENTERABLE? no (a tank interior would need a Paolo ruling and
  INTERIOR-MATCHES-EXTERIOR would bind it; not requested)
- MUST SIT BESIDE: its own legs/base and ladder; gravel yard or dirt beneath;
  pipe runs into it where relevant.
- NEVER BESIDE: a residential street frontage (a water tower in a front yard is
  the tell of a landmark placed without thought).
- EDGE CONTRACT: SINGLE PLACEMENT — a landmark never tiles.

## D. WHEN
- ACT: 1
- BEST TIME: both. A tank is the last thing catching light at dusk because it
  is the tallest thing; no self-light of its own.
- WEATHER STATES: sunny baseline; nothing changes when wet.
- LIT/UNLIT: none. (Real water towers carry obstruction lights; in act 1 they
  are dead, and that dead red lamp is a good detail but carries no glow.)
- ANIMATION: static. The clarifier's sweep arm is STOPPED — the watertreat
  dossier already says it stopped where the power did, and that stillness is
  the story. No rotation loop.

## E. HOW
- EXACT SIZE: prop/structure scale, not a tiling field. A municipal water tower
  is ~30 m to the tank bottom (~40 tiles of world height) and must out-top
  everything in its district by a clear margin.
- VIEW: 45-degree world view. THIS IS THE FAMILY THE 45-DEGREE ART LAW WAS
  WRITTEN FOR: every cylinder shows an ELLIPSE cross-section, a sky-lit visible
  top, and bands that BOW TOWARD THE VIEWER. A flat circle is an automatic fail
  and art_45_gate exists to catch it.
- PALETTE: constitution ceiling; STRUCTURE band. Tanks are hue carriers — a
  faded municipal blue-white tower or a galvanised silo is exactly the distinct
  colour the 7/28 measurement found missing.
- LIGHT: the one global direction. NO keyline. NO dither.
- SHADOWS: none baked; these throw the longest shadows in the game.
- SCALE ANCHORS: the access ladder's rung spacing and the catwalk handrail are
  human-scale and are what tell you the thing is huge.
- WEAR LEVEL: steel tanks in this climate hold up structurally — paint fails
  first, chalking and peeling in sheets to show primer and bare galvanising.
  Streaked rust runs BELOW every fitting and seam (the classic vertical stain).
  Ladders and catwalks are intact. The town's tank should read as EMPTY, which
  it announces by being intact and silent rather than by being broken.
- VARIANTS: elevated water tower, silo, clarifier tank, ground storage tank;
  paint colourways share this form (STRUCTURE-NOT-COLOR).

## F. THE CAPTION
```json
{
  "id": "TF-WORLD-013",
  "name": "tanks towers and silos",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": ["town","farm","watertreat","substation","battery","industrial","truckstop","airfield","rail"],
  "best_time": "any",
  "best_location": "the high point of a district, visible from neighbouring cells",
  "place_next_to": ["its own legs and ladder","gravel yard","dirt yard","pipe runs"],
  "never_next_to": ["residential street frontage"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "single placement",
  "anim": null,
  "tags": ["structure","tank","tower","silo","landmark","tall","45-degree-critical"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the BLESSED LAMP BANK, which the 45-DEGREE ART LAW names as
  its own reference for ellipse cross-sections and sky-lit tops — this family
  must speak exactly that language at a much larger scale.
- NAMED OUTSIDE REFERENCE: Fallout: New Vegas's water towers and tanks as
  navigation landmarks across the Mojave; Stardew Valley's silo for how a
  cylinder reads charmingly at small tile size without losing its roundness.
- REAL-WORLD GROUNDING: Las Vegas exists because of a railroad WATER STOP —
  the tank is literally the city's origin object, which is the answer to
  Paolo's question about the town district. Surviving Nevada townsites
  (Goodsprings, Searchlight) still carry elevated tanks on riveted or welded
  lattice legs, and in every one of them it is the tallest thing for miles. The
  valley's real clarifier tanks are at the Clark County Water Reclamation
  District plants — big open circular basins with a slowly rotating sweep arm.

## H. DON'T WANT
- NOT a flat circle or a flat side-on cylinder — the named 45-degree failure,
  machine-gated.
- NOT rusted through. Paint fails, steel does not, in this climate.
- NOT short. If it does not out-top its district it is not a landmark.
- NOT rotating. The sweep arm stopped when the power did.
- NOT lettered — no town names, no logos. Paolo authors all names.

## I. ACCEPTANCE
- [ ] art_45_gate green: ellipse cross-sections, sky-lit top, bands bowing to
      the viewer; zero flat side-on circles
- [ ] Squint test at 1-tile map zoom: reads as the district's tall landmark
- [ ] "VISIBLE FROM THE NEXT CELL" proof from an adjacent cell's camera
- [ ] Palette ceiling + STRUCTURE band + one-light green
- [ ] Assembled proof: tower on its legs with ladder, on real ground
- [ ] ON THE REAL SURFACE: the town district and the water-treatment plant
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: WORLD | DATE: 7/28/26 | PRIORITY: MED
- BOARD ROW #: 22 | VERDICT: —
