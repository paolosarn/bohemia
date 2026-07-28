# TILE FORM TF-WORLD-007 — FLAT COMMERCIAL & CIVIC ROOFS (the most-seen surface in a 45-degree world)

## A. IDENTITY
- NAME: Flat roofs with their parapets and rooftop kit
- FAMILY/SET: FLAT ROOF family — roof membrane field + parapet cap + roof-access
  box/hatch + HVAC unit + vent/duct run + roof drain + a ponding/patched
  variant. ONE drawing job.
- THE JOB, ONE SENTENCE: this tile exists so that the ~70 non-residential
  building types stop being flat coloured rectangles from above, because in a
  45-degree view the ROOF is the largest visible part of every building.

## B. WHY
- DEMANDED BY: the 7/28 COLOUR MEASUREMENT (records/BOHEMIA_POCKET_CITY_STYLE_
  REFERENCE.md) — our district icons carry a median of THREE hue families and
  13.4% chromatic pixels against Pocket City 2's TWELVE and 87.5%. The style
  bible's own rule 4 is "ROOFS CARRY THE COLOR; WALLS ARE PALE", written 7/23
  and never executed. Roofs are where the colour was supposed to live.
  Also EVERY DISTRICT IS ITS OWN LANDMARK (Paolo 7/28) — from above, a district
  IS its roofs.
- WHAT LOOKS BROKEN TODAY: 70 distinct "building" materials across 45
  districts, nearly all rendering as one flat tone with no roof detail at all.
  This is the single biggest reason the bulk verdict came back 32 down: every
  district is the same brown from above.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md —
  * HOUSE SKINS (30/30 UP — roofs/walls/windows/boarded/doors/yards): checked
    and disqualified for this need — they are RESIDENTIAL PITCHED roofs
    (shingle, gravel, tile) for suburb houses. A commercial building has a FLAT
    membrane roof with a parapet, which is a different object with different
    geometry. The house skins stay the anchor for suburb and trailer only.
  * HD PACK UP list: no flat-roof/parapet/HVAC family.
  * STARTER TILESET (42): residential street.
  Nothing in the index claims a commercial flat roof.

## C. WHERE
- SURFACE + TAB: CITY (the builder view, where roofs are most of what you see)
  + RUN (seen from grade at a distance and from any raised position) + MAP.
- DISTRICT FAMILIES: every non-residential type — commercial, mall, downtown,
  industrial, warehouse, medical, school, library, courthouse, cityhall,
  policestation, jail, firestation, terminal, storage, truckstop, campus,
  ballpark, stadium, battery, watertreat, boneyard, landfill, railyard.
- LAYER: structure (it is the top face of a solid mass)
- SOLID? yes — ENTERABLE? no (the building below is; the roof hatch is a
  future portal and is NOT requested here)
- MUST SIT BESIDE: its own parapet at every building edge; the wall faces
  below; sky/ground beyond the parapet.
- NEVER BESIDE: ground tiles with no parapet or wall between (a roof that
  meets the ground is the classic massing failure).
- EDGE CONTRACT: SELF-SEAMLESS for the membrane field + WANG-16 for the
  parapet cap (it must close a rectangle of any size with correct corners).

## D. WHEN
- ACT: 1
- BEST TIME: both. At night roofs are the dark mass that lit windows sit in;
  no self-light. Rooftop kit does not glow.
- WEATHER STATES: sunny baseline; RAIN matters because flat roofs POND — a
  wet variant with standing water in the low spots is true and cheap. Note
  from the 7/28 decay research: buildings die TOP-DOWN, from the roof and the
  water in, which makes this family the most story-carrying surface we have.
- LIT/UNLIT: no self-light.
- ANIMATION: static.

## E. HOW
- EXACT SIZE: one tile, starter-set native px, tiling across any footprint.
- VIEW: 45-degree world view. Parapet has a visible inner and outer face; HVAC
  units are boxes with ellipse-topped fans per the 45-degree art law, never
  flat side-on discs.
- PALETTE: constitution ceiling; STRUCTURE band. THIS FORM IS THE PRIMARY HUE
  CARRIER IN THE GAME — the membrane and parapet cap colourways are how
  districts get told apart at map zoom, per the measurement in B.
- LIGHT: the one global direction. NO keyline. NO dither.
- SHADOWS: none baked; the parapet's shadow onto its own roof is the shadow
  pass's job.
- SCALE ANCHORS: a parapet is 0.9-1.2 m; a rooftop HVAC unit is roughly car-
  sized and is the best human-scale reference on a roof.
- WEAR LEVEL: Mojave sun destroys roof membranes faster than anything else on
  a building. White TPO/PVC chalks and yellows; built-up gravel roofs lose
  their gravel in wind-scoured patches showing black bitumen beneath; seams
  shrink and split (the 7/28 decay research: rubber roofs shrink and split at
  the seams). Patches in mismatched material are universal. HVAC units go
  chalky and their panels get pulled for the copper inside.
- VARIANTS: membrane field (several colourways — this is where district hue
  identity lives), gravel-ballasted field, parapet cap, roof hatch/access box,
  HVAC unit, vent run, roof drain, ponded/patched wet variant. STRUCTURE-NOT-
  COLOR: the colourways share this form; a different roof GEOMETRY is a new one.

## F. THE CAPTION
```json
{
  "id": "TF-WORLD-007",
  "name": "flat commercial roof",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": ["commercial","mall","downtown","industrial","warehouse","medical","school","library","courthouse","cityhall","policestation","jail","firestation","terminal","storage","truckstop","campus","ballpark","stadium","battery","watertreat","boneyard","landfill","railyard"],
  "best_time": "any",
  "best_location": "the top of every non-residential building mass",
  "place_next_to": ["parapet cap","wall face below","HVAC unit","roof hatch","vent run"],
  "never_next_to": ["ground with no parapet or wall between"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "self-seamless field + wang-16 parapet",
  "anim": null,
  "tags": ["structure","roof","parapet","hue-carrier","most-seen-surface"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the approved HOUSE SKINS' roof VALUES as the calibration
  point (a commercial roof must sit in the same world as an approved
  residential one) — values only; the geometry is deliberately different.
- NAMED OUTSIDE REFERENCE: Pocket City 2 — Paolo's named bar, and its rule is
  visible in the screenshots in records/refs/pocketcity2/: "big civic /
  commercial: FLAT roofs, pale gray, dressed with parapets, roof-access boxes,
  AC units, vents", with the COLOUR carried on trim and roof edges. That is
  precisely what our districts are missing.
- REAL-WORLD GROUNDING: Las Vegas commercial construction is overwhelmingly
  flat-roofed tilt-up and CMU with parapets that hide the rooftop plant —
  parapets exist here specifically to hide the enormous HVAC units a desert
  climate demands, so ROOFTOP MECHANICAL IS ITEM ONE on any Vegas roof. White
  reflective membranes are near-universal for heat, and they chalk and yellow
  within a few years of that sun.

## H. DON'T WANT
- NOT pitched shingle roofs — those are the approved house skins and belong to
  suburb only. Reusing them here is the exact "different object wearing a
  recolour" mistake.
- NOT all one brown. This form exists BECAUSE of the measured 3-hue-family
  failure; a monochrome delivery fails on arrival.
- NOT clean white membrane; it is chalked and patched.
- NOT a busy roof. Detail belongs to the KIT (units, hatches), not to the
  membrane field, which stays quiet and lets the parapet edge define the shape.

## I. ACCEPTANCE
- [ ] Membrane seam measured; parapet Wang set closes any rectangle
- [ ] Palette ceiling + STRUCTURE band + one-light green
- [ ] HUE CHECK (this form's whole point): a district wearing it must MEASURE
      a higher hue-family count than the 3-family median recorded 7/28
- [ ] Squint test: two different districts wearing two colourways must be
      distinguishable at 1-tile map zoom
- [ ] 3x3 TILED PROOF + an assembled building top with parapet, hatch and HVAC
- [ ] ON THE REAL SURFACE: a commercial and a civic district in the CITY tab
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: WORLD | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 36 | VERDICT: —
