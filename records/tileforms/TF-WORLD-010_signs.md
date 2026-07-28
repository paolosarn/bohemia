# TILE FORM TF-WORLD-010 — SIGNS & PYLONS (the tallest thing in every district)

## A. IDENTITY
- NAME: Signs (the pylon, the marquee, the screen, the scoreboard)
- FAMILY/SET: SIGN family — tall pylon/price sign + roadside marquee letter
  board + drive-in screen tower + scoreboard/jumbotron + schedule board +
  rooftop antenna/dish + a fallen/collapsed sign. ONE drawing job.
- THE JOB, ONE SENTENCE: this tile exists so that every district has ONE TALL
  THING you can see from the next cell, which is the exact thing the 7/28
  legibility research found the whole valley is missing.

## B. WHY
- DEMANDED BY: EVERY DISTRICT IS ITS OWN LANDMARK (Paolo 7/28, LOCKED). And
  the measured finding behind it: against Kevin Lynch's five elements we
  scored PATHS yes, DISTRICTS partly, EDGES by accident, and NODES and
  LANDMARKS **ZERO**. Obsidian's own rule (cited in the 7/28 craft research)
  is that three real landmarks must be visible from any grid square. Our
  skyline is flat. Signs are the cheapest possible fix — Vegas's landmarks
  ARE its signs.
- WHAT LOOKS BROKEN TODAY: truckstop declares a "pylon / price sign", swapmeet
  a "market pylon sign", drivein a "screen tower", school and drivein a
  "marquee sign", stadium a "scoreboard / jumbotron", terminal a "schedule
  board / clock", policestation a "roof antenna / dish" — all flat blocks. You
  cannot navigate this valley by sight because nothing stands up.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md —
  * The reserved SIGN district: Paolo's hand by law, never auto-generated —
    that is the ONE famous Welcome sign, not the generic pylons every
    commercial plot needs. Explicitly out of scope and not a substitute.
  * LAMPS (7 dark variants, approved, CITY-wired): dark pole lights. A lamp is
    not a sign; checked and does not cover.
  * HD PACK UP list: no sign family.
  Nothing in the index claims a generic sign.

## C. WHERE
- SURFACE + TAB: RUN + CITY + MAP — and MAP is the point: this family exists
  to be seen at distance and at map zoom.
- DISTRICT FAMILIES: truckstop, commercial, swapmeet, drivein, school,
  stadium, terminal, policestation, mall, motel/apartment, town (the marquee),
  and any district needing its one tall thing.
- LAYER: structure
- SOLID? yes at its base/pole; the sign FACE is above head height and blocks
  nothing — ENTERABLE? no
- MUST SIT BESIDE: its own pole and base; lot asphalt or kerb at its foot; the
  street it faces.
- NEVER BESIDE: mid-block with nothing to advertise (a pylon belongs at the
  frontage, facing the road — a sign in a back lot reads as a mistake).
- EDGE CONTRACT: SINGLE PLACEMENT — a sign never repeats. This is deliberate
  and it is what makes it a landmark.

## D. WHEN
- ACT: 1
- BEST TIME: both, and this is the family where night matters most: in a living
  Vegas these are the brightest objects for miles. In act 1 they are DEAD —
  dark faces, dead neon, unlit boxes. That inversion is the apocalypse stated
  in one object, and it is the 7/28 research thesis exactly: the building is
  still trying to sell you something and nobody is buying.
- WEATHER STATES: sunny baseline; nothing changes when wet.
- LIT/UNLIT: UNLIT in act 1, always. A lit variant needs a Paolo ruling and
  LIGHT=TERRITORY decides who owns it.
- ANIMATION: static. Dead neon does not flicker unless Paolo rules it.

## E. HOW
- EXACT SIZE: variable by type; the truckstop pylon is the tall one at ~18 m
  (~24 tiles of world height) and is deliberately the tallest object in its
  district. Prop-scale pieces, not a tiling field.
- VIEW: 45-degree world view. A sign has a FACE and an EDGE and reads as a
  plane standing in space; the pole has an ellipse cross-section per the
  45-degree art law, never a flat bar.
- PALETTE: constitution ceiling; STRUCTURE band. Sign faces are hue carriers —
  faded brand colour on the cabinet, bleached-white face.
- LIGHT: the one global direction. NO keyline. NO dither.
- SHADOWS: none baked; a tall sign throws a long shadow and that is the pass's.
- SCALE ANCHORS: pylon 15-20 m; marquee letter board at car-window height;
  drive-in screen ~15 m tall and ~25 m wide.
- WEAR LEVEL: plastic sign faces are the fastest-failing objects in the desert
  — they yellow, craze and BLOW OUT, leaving empty cabinets with the internal
  fluorescent tubes visible. Letter boards keep some letters and lose others.
  Steel poles survive intact. At least one variant is a sign DOWN — collapsed
  across the ground, which the town district already calls for.
- VARIANTS: pylon (cabinet intact / face blown out), marquee letter board,
  screen tower, scoreboard, schedule board, antenna/dish, fallen sign.
  NO READABLE TEXT ON ANY VARIANT.

## F. THE CAPTION
```json
{
  "id": "TF-WORLD-010",
  "name": "sign and pylon",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": ["truckstop","commercial","swapmeet","drivein","school","stadium","terminal","policestation","mall","apartment","town"],
  "best_time": "any",
  "best_location": "at the street frontage of a district, facing the road, tall enough to be seen from the next cell",
  "place_next_to": ["sign pole","lot asphalt","kerb","district frontage"],
  "never_next_to": ["mid-block with no frontage","behind a building where it cannot be seen"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "single placement",
  "anim": null,
  "tags": ["structure","sign","landmark","tall","lynch-landmark","hue-carrier","no-text"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the approved LAMP DARK VARIANTS — the same "this was lit and
  now is not" language, already Paolo-approved, and the sign family should
  speak it.
- NAMED OUTSIDE REFERENCE: Fallout: New Vegas, whose dead roadside signage does
  the navigation work for the whole Mojave map; and the Neon Museum "Boneyard"
  in Las Vegas, where dead signs stand in rows — the definitive image of a
  Vegas sign with the power off.
- REAL-WORLD GROUNDING: Las Vegas is the world capital of the roadside sign;
  the tall internally-lit pylon exists because the city was built to be read at
  40 mph from a road. Clark County's sign ordinances made them enormous. In this
  climate the acrylic faces are the first casualty — UV yellows and embrittles
  them in a few years, then wind takes them out of the cabinet, which is why a
  genuinely abandoned Vegas sign is an EMPTY STEEL BOX on an intact pole rather
  than a rusted collapse.

## H. DON'T WANT
- NOT readable words or brand names. MECHANISM-MINE / CONTENTS-PAOLO'S: every
  name in this world is his. Faces are blank, bleached or blown out.
- NOT the reserved Welcome sign or any Strip landmark (his hand, by law).
- NOT lit, not glowing, no neon hum.
- NOT short. If it does not out-top its district it has failed the one job.
- NOT purple (Amalgamation reservation).

## I. ACCEPTANCE
- [ ] Squint test at 1-tile map zoom: the sign is visible as the district's
      tall thing, and two districts' signs are distinguishable
- [ ] "VISIBLE FROM THE NEXT CELL" proof: rendered from an adjacent cell's
      camera and still readable as a landmark
- [ ] Palette ceiling + STRUCTURE band + one-light green; purity (no purple)
- [ ] NO-TEXT check: no legible glyphs anywhere on any face
- [ ] Assembled proof: pylon on its base at a real district frontage
- [ ] ON THE REAL SURFACE: the truckstop and the drive-in
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: WORLD | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 39 | VERDICT: —
