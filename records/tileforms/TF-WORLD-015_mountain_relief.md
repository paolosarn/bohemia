# TILE FORM TF-WORLD-015 — MOUNTAIN & TERRAIN RELIEF (the wall around the valley)

## A. IDENTITY
- NAME: Mountain relief (bedrock face, cliff band, ridge crest, talus, wash)
- FAMILY/SET: RELIEF family — bedrock face + cliff band + ridge crest + talus
  and scree slope + rockfall scar + alluvial fan + ravine floor + dry drainage.
  ONE drawing job: the valley's rim.
- THE JOB, ONE SENTENCE: this tile exists so that the mountains ringing the
  valley read as the EDGE of the world rather than as a differently-coloured
  desert, because the ring of mountains is the one thing that makes this place
  a valley at all.

## B. WHY
- DEMANDED BY: the 7/28 legibility finding — Kevin Lynch's EDGES scored "by
  accident only", and the mountain rim is the largest edge in the game. The
  Vegas geography addendum makes the ring of mountains canon; the overmap
  already places them and they carry no art.
- WHAT LOOKS BROKEN TODAY: the mountain surface declares bedrock face, cliff
  band, ridge crest, talus/scree, rockfall scar, ravine floor, dry drainage,
  alluvial fan and desert shrub — nine distinct materials, all rendering as
  flat colour. The valley currently has no visible rim, so it does not read as
  a valley.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md —
  * DESERT/TERRAIN (13 terrain picks + desert/rock/rubble pools, "bake +
    target factories, NOT run"): the closest thing in the index and the honest
    near-miss. Checked: they are FLAT GROUND textures for the valley floor and
    the pools are the ones measured broken 7/28 (near-black borders, 3-5x wrap
    discontinuity). Relief needs FACES with a light side and a shadow side and
    a ridge line — a fundamentally different problem from a ground plane, and
    the existing picks contain no vertical rock face.
  * TF-RUN-001 (desert ground, board row 4): the valley floor; explicitly the
    flat thing this butts against.
  Nothing in the index claims relief.

## C. WHERE
- SURFACE + TAB: RUN (you can walk up to the rim) + CITY + MAP — and MAP most
  of all: at map zoom the mountains are what give the valley its shape.
- DISTRICT FAMILIES: mountain surface cells; the wash where it cuts through;
  the desert margins where alluvial fans spread out from the range.
- LAYER: structure for faces and cliff bands (they block); ground for talus,
  fan and ravine floor (you can cross them).
- SOLID? faces yes, slopes no — ENTERABLE? no
- MUST SIT BESIDE: desert ground at the foot via the alluvial fan (the fan is
  the transition and it must not be a hard line — that is how real ranges meet
  real basins); the wash where drainage leaves the range.
- NEVER BESIDE: built districts directly (there is always desert or a fan
  between a mountain and a plot); lot asphalt.
- EDGE CONTRACT: WANG-16 for the cliff bands and ridge lines (they are linear
  features needing corners and ends) + SELF-SEAMLESS for talus and fan fields.

## D. WHEN
- ACT: 1
- BEST TIME: both, and this family is where TIME OF DAY matters most in the
  whole game: desert ranges read almost entirely by the shadow side, and at
  low sun the relief is the strongest image available. No self-light.
- WEATHER STATES: sunny baseline; cloudy flattens relief dramatically (worth
  knowing); rain is the one time the dry drainage and ravine floor carry water,
  and Vegas flash floods come off exactly these slopes.
- LIT/UNLIT: none. Nobody owns the mountains.
- ANIMATION: static.

## E. HOW
- EXACT SIZE: tiling fields at starter-set native px; cliff bands as Wang runs.
- VIEW: 45-degree world view. Relief must be built from the ONE global light —
  a lit face and a shadow face with a hard ridge between them. This is the
  family most likely to be accidentally drawn as a top-down texture, which
  would make the mountains look like a carpet.
- PALETTE: constitution ceiling; STRUCTURE band for faces, GROUND for slopes.
  The shadow side is the darkest large area in the game.
- LIGHT: the one global direction — and here it is doing ALL the work. NO
  keyline. NO dither.
- SHADOWS: none baked into the tile beyond the form's own faces; the range's
  cast shadow across the basin is the shadow pass's.
- SCALE ANCHORS: nothing human-scale is available at this size, which is the
  difficulty — scale must come from the size of the talus grain relative to
  the fan, and from the wash cutting through at known width.
- WEAR LEVEL: none. This is the one family in the game that is NOT degraded —
  rock does not care that the economy collapsed. That is worth stating: the
  mountains look exactly as they did, and everything else does not, which is
  the quietest possible statement of what happened.
- VARIANTS: bedrock face, cliff band, ridge crest, talus/scree, rockfall scar,
  alluvial fan, ravine floor, dry drainage.

## F. THE CAPTION
```json
{
  "id": "TF-WORLD-015",
  "name": "mountain relief",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": ["mountain","wash","desert"],
  "best_time": "any -- strongest at low sun",
  "best_location": "the ring of ranges around the valley and the fans spreading from their feet",
  "place_next_to": ["alluvial fan","desert ground","wash","talus"],
  "never_next_to": ["built district with no desert between","lot asphalt"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "wang-16 cliff bands + self-seamless slope fields",
  "anim": null,
  "tags": ["structure","terrain","relief","mountain","lynch-edge","undegraded"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the approved DESERT/TERRAIN picks' values (the range must
  live in the same palette as the floor it rises from), and TF-RUN-001's
  hardpan as the surface at its foot.
- NAMED OUTSIDE REFERENCE: Fallout: New Vegas, whose entire navigational read
  depends on recognisable ranges on the horizon; and Death Stranding for
  relief built from light-side/shadow-side rather than texture.
- REAL-WORLD GROUNDING: the Las Vegas Valley is a basin ringed by the Spring
  Mountains to the west (Red Rock's cliffs are Aztec sandstone — pale cream and
  RED, the one real colour in the landscape), Frenchman and Sunrise to the east
  (grey-brown carbonate), and the McCullough range south. The basin floor meets
  the ranges through ALLUVIAL FANS — the debris aprons that make the transition
  gradual, never a wall rising from flat ground. Vegas's flash floods originate
  on these slopes, which is why the valley has its enormous wash system.

## H. DON'T WANT
- NOT a flat top-down rock texture. Without a lit face and a shadow face there
  is no relief and the mountains read as a carpet.
- NOT a wall rising straight from flat ground — real ranges arrive via fans.
- NOT degraded or ruined. Rock is the one thing in this world that is fine.
- NOT green.
- NOT purple, even where real Red Rock light goes violet at dusk (Amalgamation
  reservation is absolute).

## I. ACCEPTANCE
- [ ] Wang cliff bands assemble a continuous ridge with corners and ends
- [ ] Slope field seams measured, no edge darkening
- [ ] ONE-LIGHT check is the critical one here: every face's shading must agree
      with the single global direction
- [ ] Squint test at map zoom: the valley reads as a valley, ringed
- [ ] 3x3 TILED PROOF + an assembled range foot showing fan-to-floor transition
- [ ] ON THE REAL SURFACE: a mountain cell beside a desert cell
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: WORLD | DATE: 7/28/26 | PRIORITY: MED
- BOARD ROW #: 44 | VERDICT: —
