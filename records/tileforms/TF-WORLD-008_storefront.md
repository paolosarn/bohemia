# TILE FORM TF-WORLD-008 — STOREFRONT, FALSE FRONT & AWNING

## A. IDENTITY
- NAME: Storefront (the glass, the awning and the false front above it)
- FAMILY/SET: STREET WALL family — storefront glazing bay + boarded bay +
  blown-out bay + awning + false front / parapet sign band + party wall pilaster
  + roll-up security shutter. ONE drawing job.
- THE JOB, ONE SENTENCE: this tile exists so that a commercial street reads as
  SHOPS rather than as a long brown block, because a storefront is the one
  building face a player walks right up against.

## B. WHY
- DEMANDED BY: EVERY DISTRICT IS ITS OWN LANDMARK (Paolo 7/28) and his bulk
  verdict on the commercial family ("city icon needs some loving"), mall
  ("both looking like shit"), downtown ("both need work"), truckstop ("kinda
  looks like shit"). Also the 7/28 apocalypse research thesis:
  THE BUILDING IS STILL TRYING TO SELL YOU SOMETHING AND NOBODY IS BUYING —
  the storefront IS that sentence in a tile.
- WHAT LOOKS BROKEN TODAY: town declares "storefront" and "false front",
  commercial/mall/downtown declare stores and concourses, and every one is a
  flat mass. The town district I shipped 7/28 reads as a town ONLY because of
  block geometry; its shopfronts have no faces.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md —
  * HOUSE SKINS (30/30 UP: roofs/walls/windows/boarded/doors/yards): checked.
    Residential windows and boarded panels — domestic proportions, punched
    openings in stucco. A storefront is a full-height glazed bay in a framed
    opening; wrong proportion and wrong construction. The BOARDED variants are
    the closest near-miss and still domestic-sized.
  * DOOR CLIPS (30, 10 residential, 2 tiles tall): residential doors. A shop
    entrance is a glass double-leaf. Does not cover.
  * STREET BLOCKS: roadway.
  Nothing in the index claims a commercial shopfront.

## C. WHERE
- SURFACE + TAB: RUN primarily (this is a face you stand in front of) + CITY.
- DISTRICT FAMILIES: town, commercial, downtown, mall, swapmeet, truckstop,
  and the ground floor of apartment.
- LAYER: structure
- SOLID? yes — ENTERABLE? yes at the entrance bay (the interior is the
  district's own shop interior, already specified in the town and commercial
  dossiers: one deep narrow room, counter across the back, stockroom behind)
- MUST SIT BESIDE: itself in a continuous run (the STREET WALL is unbroken
  within a block — that continuity is what separates a town from a strip mall,
  and it is written into the town dossier); the boardwalk or sidewalk in front;
  the false front / parapet above; a party-wall pilaster between units.
- NEVER BESIDE: desert ground with no walk between; a pitched residential roof
  directly above (that is a different building type).
- EDGE CONTRACT: WANG-16 (a run needs ends, corners and a door bay).

## D. WHEN
- ACT: 1
- BEST TIME: both. CRITICAL: at night the glass is DEAD DARK, never warmly lit
  — the style bible's dead-world clause. Our night read is "dark where their
  night read is glowing", and that difference is the whole apocalypse.
- WEATHER STATES: sunny baseline; rain changes little on a vertical face.
- LIT/UNLIT: unlit always in act 1. Any lit variant needs a Paolo ruling and
  LIGHT=TERRITORY says who owns it.
- ANIMATION: static. (Awning fabric movement is leaf-pixel legal but NOT
  requested — no invented motion.)

## E. HOW
- EXACT SIZE: one tile wide per bay, starter-set native px; the face is
  ~3 tiles tall to satisfy the THREE-TILE WALL law (a wall carrying a door is
  three tiles tall; the door fills the bottom two).
- VIEW: 45-degree world view — a front face plus the sliver of return that the
  view exposes. NOT a flat side-on scroller face (45-DEGREE ART LAW).
- PALETTE: constitution ceiling; STRUCTURE band for the mass, with the AWNING
  and the SIGN BAND as deliberate hue carriers (per the 7/28 colour
  measurement — awnings are exactly where Pocket City 2 puts its colour, and
  the reference screenshots show striped awnings on nearly every shopfront).
- LIGHT: the one global direction. NO keyline (the named v2 hero failure). NO
  dither.
- SHADOWS: none baked; the awning's cast shadow is the shadow pass's.
- SCALE ANCHORS: a shop bay is ~6 m wide; glazing runs floor to ~3 m; the
  awning projects ~1.5 m. The 2-tile door is the fixed anchor.
- WEAR LEVEL: glass is the first thing to go — variants must include intact
  (dusty, opaque with grime), boarded (plywood over the frame), and blown out
  (empty frame, you see into the dark). Awning fabric is sun-shredded and
  hangs; its frame survives. Sign bands are BLANK — sun-bleached to nothing.
  Roll-up shutters are down and dented on some units.
- VARIANTS: intact glazing, boarded, blown-out, shutter-down, awning (several
  faded colourways), false-front/sign band, pilaster. STRUCTURE-NOT-COLOR:
  awning colourways share this form.

## F. THE CAPTION
```json
{
  "id": "TF-WORLD-008",
  "name": "storefront",
  "layer": "structure",
  "solid": true,
  "enter": true,
  "district_families": ["town","commercial","downtown","mall","swapmeet","truckstop","apartment"],
  "best_time": "any",
  "best_location": "the street-facing ground floor of any commercial building",
  "place_next_to": ["storefront","party wall pilaster","boardwalk","sidewalk","false front above"],
  "never_next_to": ["desert ground with no walk between","pitched residential roof directly above"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "wang-16",
  "anim": null,
  "tags": ["structure","storefront","glass","awning","street-wall","hue-carrier","enterable"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the approved HOUSE SKINS' boarded-window treatment (the
  plywood language is already Paolo-approved and should be reused verbatim in
  the boarded variant) and the approved DOOR CLIPS' 2-tile door proportion.
- NAMED OUTSIDE REFERENCE: Pocket City 2 — the reference screenshots Paolo
  saved (records/refs/pocketcity2/IMG_4006, IMG_4013) show striped awnings and
  lit sign bands on nearly every commercial unit, and that is measurably where
  its colour comes from. We take the STRUCTURE and kill the light.
- REAL-WORLD GROUNDING: Fremont Street's original townsite shopfronts and the
  surviving Nevada main streets (Goodsprings, Searchlight) — attached masonry
  units with tall FALSE FRONTS hiding shallow roofs, a continuous covered
  boardwalk, and hand-painted sign bands that weather off entirely. On the
  1960s-80s Vegas strip-commercial side: aluminium-framed full-height glazing
  with a fascia sign band above, and canvas awnings that shred in the sun
  within a couple of seasons.

## H. DON'T WANT
- NOT a flat side-on scroller face (45-degree art law, gated).
- NOT warmly lit windows at night — that is Pocket City's living world and it
  is the single thing we must invert.
- NOT a black 1px keyline (the named district-hero v2 kill reason).
- NOT readable sign text. Signage is blank/weathered; Paolo authors all names.
- NOT domestic window proportions — that is the house skins doing the wrong job.

## I. ACCEPTANCE
- [ ] Wang set assembles an unbroken street wall with ends, corners and a door bay
- [ ] THREE-TILE WALL law: wall+door proportion verified against the gated rule
- [ ] Palette ceiling + STRUCTURE band + one-light + NO keyline green
- [ ] Squint test: a commercial run reads as shops at map zoom
- [ ] 3x3 TILED PROOF + an assembled block face mixing intact/boarded/blown-out
- [ ] ON THE REAL SURFACE: the town district's main street wearing it
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: WORLD | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 17 | VERDICT: —
