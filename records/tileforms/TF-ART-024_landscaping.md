# TILE FORM TF-ART-024 — LANDSCAPING (the police station's dead xeriscape)

## A. IDENTITY
- NAME: Landscaping — the decomposed-granite xeriscape beds ringing the
  civic station, its lot and its secure yard
- FAMILY/SET: CIVIC GROUNDS — first wired member; other civic districts
  that name bed strips can join the family later.
- THE JOB, ONE SENTENCE: 1,131 'landscaping' cells fall to the gravel
  fallback, so the one manicured ground in the district reads as the
  same wild dirt as the desert beside it.

## B. WHY
- DEMANDED BY: the inventory ranking (ART lane's standing instrument):
  the largest named surface still lying after the wash's riprap.
- WHAT LOOKS BROKEN TODAY: the bed strips draw the same yard gravel as
  everything else - the whole point of landscaping (SOMEBODY ONCE
  MAINTAINED THIS) is invisible.
- MEASURED 8/25 on the walked world: 1,131 cells in ONE connected web
  (118x116 bounding box - strips, not a field). Neighbour census:
  desert dead-ground 461, secure-yard concrete 356, the station
  building 72, plaza marking 13.
- SHOPPING CHECK:
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (approved dirt)
  and banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json (approved pale
  concrete) exist and are the two pools the beds are built from; no
  approved bank holds a mulch tile or an agave rosette.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode); sub-pixel at MAP.
- DISTRICT FAMILIES: policestation only (the name is its own; other
  districts joining later must name their own cells).
- LAYER: ground.
- SOLID? no - ENTERABLE? no.
- MUST SIT BESIDE: the station building, secure-yard concrete, the lot,
  desert dead-ground - exactly the measured census.
- EDGE CONTRACT: self-seamless - the mulch is even-grained value noise,
  three hashed variants, so bed strips read as one continuous bed.
- NEVER BESIDE: nothing outside the police station; never replacing the
  plaza's own marking cells.

## D. WHEN
- ACT: 1
- BEST TIME: both.
- WEATHER STATES: sunny baseline; the mulch never changes (rock does
  not die); no green ever - the dead agave is straw and grey.
- LIT/UNLIT: unlit (LIGHT=TERRITORY; whether the station's circuit is
  lit is the world's call, not this ground's).
- ANIMATION: static.

## E. HOW
- EXACT SIZE: 44px corpus cell; mulch full-cell, agave and boulder are
  RGBA overlays riding on it.
- VIEW: the world's three-quarter 45 - the agave rosette radiates on an
  ELLIPSE (leaves foreshortened north-south), the boulder is a lit
  north facet over a shadowed south.
- PALETTE: harvested only - granite mulch warmed from the approved
  dirt, agave straw and boulder from the approved kerb pale. No purple,
  no green.
- LIGHT: one sky light; no self-light.
- SHADOWS: each overlay's own small foot shadow only.
- SCALE ANCHORS: a rosette ~18px across in a 44px cell is a real 40 cm
  dead agave; the boulder ~18px is a real half-metre feature rock.
- WEAR LEVEL: thirty years dead - the mulch perfectly in place, every
  plant a dry rosette, the boulder dusty.
- VARIANTS: three mulch tiles, two agaves (off-centre placement varies),
  one boulder; agave about every seventh cell, boulder about every
  nineteenth, both by th() hash.
- CRAFT: mulch grain is one-pixel value noise, never patterned dots.

## F. THE CAPTION
```json
{
  "id": "TF-ART-024",
  "name": "dead xeriscape landscaping - granite mulch beds with dry agave and feature boulders",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["policestation"],
  "best_time": "both",
  "best_location": "the bed strips ringing the station, its lot and the secure yard",
  "place_next_to": ["building (station)", "secure-yard concrete", "drive / lot", "desert dead-ground"],
  "never_next_to": ["any district that is not the police station", "the plaza's marking cells"],
  "weather_ok": ["sunny", "cloudy"],
  "acts": [1],
  "edge_contract": "self-seamless - even-grained mulch in three hashed variants reads as one continuous bed",
  "tags": ["policestation", "xeriscape", "landscaping", "mulch", "agave", "civic"],
  "anim": "static"
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt
  (the approved dirt - the mulch is its pool warmed, so the bed sits in
  the same earth family as every ground beside it).
- NAMED OUTSIDE REFERENCE: SimCity 4's civic lot edging and Cities:
  Skylines' park paths both read maintained ground as ONE EVEN WARM
  BAND against rough surroundings - evenness IS the manicured read,
  which is exactly what separates this mulch from the yard gravel.
- REAL-WORLD GROUNDING: Clark County's own water ordinance pushed every
  civic frontage in the valley to xeriscape decades before the crash -
  decomposed-granite mulch beds with agave, yucca and feature boulders
  ring the Metro area commands, and after thirty dry years the rock
  stays perfectly raked while the plants stand as straw skeletons; on
  satellite those beds read as warm even bands hugging the buildings,
  the exact strips the world named here.
- ALSO OPENED IN CODE:
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json (the pale pool for
  straw and boulder).

## H. DON'T WANT
- NOT green - nothing here has been watered since the crash.
- NOT the yard gravel - the whole read is that this ground is FINER and
  EVENER than the wild dirt beside it.
- NOT dot-stipple mulch (banned 8/21) - grain is value noise.
- NOT a plant on every cell - one rosette in seven; a bed is mostly bed.
- NOT circles - the rosette radiates on the 45 ellipse.

## I. ACCEPTANCE
- [x] Cooked from approved banks only (REUSE CHECK in the cook docstring)
- [x] ON THE REAL SURFACE: verified live at the police station (cell
      56,43) - the bed band ringing the station, rosettes at intervals
- [x] No purple, no green, no self-light, no readable text
- [x] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: COOKED AND WIRED 8/25/26 under EVERYTHING IS A THUMB (8/9):
  bank banks/tileforms/TF-ART-024_CANDIDATES_8_25_26.json (6 pieces),
  cook tools/tfcook/TF-ART-024_landscaping_cook.py, wired in the run
  slice's named-cell pass (mulch full-cell, agave 1-in-7, boulder
  1-in-19). Live frame: records/target/ART_WIRED_TF-ART-024.png, card
  in the ART tab. | REQUESTED BY: ART lane (inventory ranking)
  | DATE: 8/25/26 | PRIORITY: MED
- BOARD ROW #: 92 | VERDICT: —
