# TILE FORM TF-WORLD-012 — INDUSTRIAL YARD GROUND

## A. IDENTITY
- NAME: Industrial yard ground (gravel, stained concrete, spoil, debris)
- FAMILY/SET: YARD GROUND family — compacted gravel yard + oil/fluid-stained
  concrete + cable trench + material/spoil piles + waste fill and cover soil +
  sorted debris fields (metal, plastic/appliance, wood). ONE drawing job.
- THE JOB, ONE SENTENCE: this tile exists so that the utility and salvage
  districts read as WORKING GROUND rather than as more parking, because a
  gravel yard is not a car park and currently they render identically.

## B. WHY
- DEMANDED BY: Paolo's bulk verdict rejected boneyard, landfill, railyard,
  battery, substation and watertreat with no comment — the whole utility
  family failed at once, and what they share is that their GROUND carries the
  district's meaning. Also the 7/28 theme sheet, whose boneyard hook is
  "SORTED BY KIND — not a junk pile" and whose landfill hook is "THE TERRACES
  — engineered steps, not a heap".
- WHAT LOOKS BROKEN TODAY: gravel yard (substation, battery), material yard
  (rail), dirt yard (boneyard), oil/fluid stain (boneyard), waste fill and
  cover soil and two debris grades (landfill), cable trench (substation,
  battery) — all flat colour. A landfill and a car park currently differ only
  in hue.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md —
  * DESERT/TERRAIN picks + desert pools: natural desert, and measured broken
    (row 4). Compacted graded gravel with tyre ruts is a made surface, not a
    desert floor; checked and does not cover.
  * The coming TF-WORLD-001 lot asphalt: that is the paved surface; these
    yards are deliberately UNPAVED and that difference is the read.
  * HD PACK UP list: no industrial-yard family.
  Nothing in the index claims worked ground.

## C. WHERE
- SURFACE + TAB: RUN + CITY.
- DISTRICT FAMILIES: boneyard, landfill, railyard, substation, battery,
  watertreat, industrial, warehouse, storage, farm (the farmyard), rail
  (material yards at sidings), truckstop (the back lot).
- LAYER: ground
- SOLID? no — ENTERABLE? no
- MUST SIT BESIDE: chain-link fence (TF-WORLD-003) at the boundary — these
  yards are always fenced, that pairing is the whole industrial read; lot
  asphalt at the gate; desert ground beyond the fence.
- NEVER BESIDE: dead lawn (nobody landscaped a salvage yard); plaza; interiors.
- EDGE CONTRACT: SELF-SEAMLESS for the gravel and stained-concrete fields;
  BLOB-47 for the gravel-to-desert transition (they grade into each other and a
  hard line would read wrong); SINGLE PLACEMENT for the debris grades and piles.

## D. WHEN
- ACT: 1
- BEST TIME: both; no self-light. These are the districts most likely to be
  DARK, which under LIGHT=TERRITORY means nobody owns them.
- WEATHER STATES: sunny baseline; rain is meaningful here — oil stains bloom
  and gravel darkens unevenly, and the leachate pond is the one place liquid
  belongs.
- LIT/UNLIT: none.
- ANIMATION: static.

## E. HOW
- EXACT SIZE: one tile, starter-set native px.
- VIEW: 45-degree world view; flat ground planes. Debris piles get real volume
  with an ellipse footprint, never a flat blob.
- PALETTE: constitution ceiling; GROUND band. Gravel sits slightly above
  asphalt in value; the oil staining is the darkest ground note in the game and
  that contrast is the point.
- LIGHT: the one global direction. NO keyline. NO dither.
- SHADOWS: none baked.
- SCALE ANCHORS: a tyre rut is a car track width apart (canon CAR is the
  ruler); a crushed-car stack is 3-4 cars tall; a landfill lift is ~3 m.
- WEAR LEVEL: these surfaces were ALREADY degraded when the world was alive —
  that is what makes them different from everything else in the game. Ruts,
  spilled aggregate, oil-black patches at every wheel position, weeds only at
  the untrafficked margins. The tell of abandonment here is not decay but
  STILLNESS: weeds have taken the middle of the aisle, which never happened
  while trucks ran.
- VARIANTS: compacted gravel, rutted gravel, stained concrete, cable trench,
  spoil pile, cover soil, metal debris grade, plastic/appliance debris grade.

## F. THE CAPTION
```json
{
  "id": "TF-WORLD-012",
  "name": "industrial yard ground",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["boneyard","landfill","railyard","substation","battery","watertreat","industrial","warehouse","storage","farm","rail","truckstop"],
  "best_time": "any",
  "best_location": "inside the fence of any working yard -- salvage, utility, material or waste",
  "place_next_to": ["chain-link fence","lot asphalt at the gate","desert ground (blob edge)","debris pile"],
  "never_next_to": ["dead lawn","plaza","interior floor"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "self-seamless + blob-47 to desert + single-placement piles",
  "anim": null,
  "tags": ["ground","industrial","gravel","yard","salvage","worked-ground"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the frozen CBB ground value band; the approved DESERT
  values for what the gravel must grade into beyond the fence.
- NAMED OUTSIDE REFERENCE: the Packard Plant photography cited in the 7/28
  apocalypse research for post-industrial ground; Project Zomboid's warehouse
  lots for how a working surface reads at tile scale.
- REAL-WORLD GROUNDING: North Las Vegas industrial yards run on compacted
  caliche and crushed aggregate rather than asphalt, because paving a yard is
  expensive and unnecessary in a place with no frost. Wind keeps the fines
  moving, so a Vegas yard has a hard rutted core and drifted margins. Salvage
  yards here really are sorted in aisles by make and year (as the boneyard
  dossier says) because the dry climate makes desert car storage a genuine
  industry — Vegas and Phoenix hold some of the country's biggest auto
  boneyards for exactly that reason.

## H. DON'T WANT
- NOT asphalt. If it reads as a car park the district's identity is gone.
- NOT a random junk scatter. The boneyard hook is SORTING; the landfill hook is
  ENGINEERED TERRACES. Both are about human system, not mess.
- NOT green weeds — dead only.
- NOT noisy: debris grades are single-placement objects, the yard FIELD stays
  quiet.

## I. ACCEPTANCE
- [ ] Field seams measured, no edge darkening; blob-47 to desert reads as a
      grade, not a cut line
- [ ] Palette ceiling + GROUND band + one-light green
- [ ] Squint test: at map zoom a salvage yard and a car park are NOT the same
      surface
- [ ] 3x3 TILED PROOF + an assembled yard with fence, gate and one debris grade
- [ ] ON THE REAL SURFACE: the boneyard and the landfill
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: REOPENED 8/11/26: its covering bank (the landfill, TF-ART-015) was KILLED at the sitting, so this form's industrial-yard surfaces are uncovered again; DEAD candidates stay dead, the slot needs a fresh cook. | REQUESTED BY: WORLD | DATE: 7/28/26 | PRIORITY: MED
- BOARD ROW #: 41 | VERDICT: —
