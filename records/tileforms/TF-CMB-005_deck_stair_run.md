# TILE FORM TF-CMB-005 — THE STAIR RUN FROM THE DECK DOWN TO THE LOT

## A. IDENTITY
- NAME: The stairs (the open-air run of steps from the upper deck to the ground)
- FAMILY/SET: THE DECK family. TF-CMB-004 is the slab, TF-CMB-006 is its guard.
  ONE drawing job: one run of steps plus its top landing and its bottom
  threshold.
- THE JOB, ONE SENTENCE: this tile exists so that the way between the two floors
  is a thing you can SEE and point at, because the player already could not find
  it once and the hand-coded replacement is the one piece of art in this lane
  Paolo has named out loud as bad.

## B. WHY
- DEMANDED BY: Paolo, twice, in his own words. 7/27/26: **"I couldn't find the
  stairs bro or whatever you had out what the fuck are you talking about?"**
  Then, after the fix: **"You have stairs right now looking like dog shit so
  yeah I just fix it bro."** This is the only asset in the COMBAT lane with a
  direct verbal rejection attached to it.
- WHAT LOOKS BROKEN TODAY: five hand-drawn bands. `NS=5` rectangles, riser
  `#14110d`, tread `#8c7d61`, lip `rgba(232,214,172,0.95)`, drawn back to front,
  narrowing 30% over the run. It is a correct DIAGRAM of a staircase built from
  the right rules (three shades per step, vertical risers, back-to-front
  occlusion) and it is still fifteen rectangles. It also had to be structurally
  rescued twice: version one was a DECAL painted on the top face of a deck tile
  floating one whole storey up, joined to nothing, so THE STAIRS NEVER TOUCHED
  THE GROUND; and one of the four possible orientations collapsed into a dark
  smear, which was fixed by generating the stair only on the deck's near edge so
  the broken case cannot occur. All of that machinery stays; it needs real
  pixels on top of it.
- SHOPPING CHECK:
  * STARTER TILESET 42: no stairs of any kind. The set has doors, garage bays,
    roofs, walls and ground, and nothing vertical to walk on.
  * DEMO_PROP_POOL (314 props, 12 families: light, container, item_pile, pipe,
    cover, trash_debris, tent, chains, remains, toxic, gore, window_broken):
    **no stair family exists.** Checked every family name.
  * INTERIOR_POOL (465 UP tiles, 12 room buckets): room dressing. No stair.
  * BOARD ROW 1 is the closest live claim: "STAIRS (interior stair tile family:
    up + down, both facings, plus the garage ramp/deck-edge treatment)". It is
    OPEN, HIGH, filed by the coordinator, and has NO FORM. **This form is the
    EXTERIOR half of that row and it is deliberately narrower**: an open-air
    concrete run in daylight with sky above it is a different object from an
    interior stairwell in a dark building. Cook them in one batch, judge them
    together, do not let two lanes cook stairs twice.

## C. WHERE
- SURFACE + TAB: COMBAT (the fight field, the SLICE tab). Also every RUN/CITY
  parking structure once verticality lands there.
- DISTRICT FAMILIES: parking structures, commercial, casino back-of-house.
- LAYER: **portal**. Standing on it moves you between levels, which is the
  definition in the dossier law (go INTO / go UP). It is the only portal-layer
  object the COMBAT lane owns.
- SOLID? no (you walk on it) — ENTERABLE? YES, and what is at the other end is
  the deck top plate one storey up (TF-CMB-004).
- MUST SIT BESIDE: the deck slab at its top (it always meets a slab edge tile),
  the lot surface at its bottom (asphalt or concrete), the guard along its open
  side.
- NEVER BESIDE: itself (one run, never a tiled field of steps). Never a run
  whose top does not touch a slab or whose bottom does not touch the ground:
  **that was the actual shipped bug and it is the kill condition.**
- EDGE CONTRACT: SINGLE PLACEMENT. A run is one authored object, not a tiling
  family.
- ORIENTATION: it always descends toward the viewer (down-screen). The generator
  places it on the deck's near edge specifically so this is the only case that
  can occur. **Do not author the other three; they are deleted at the source.**

## D. WHEN
- ACT: 1
- BEST TIME: both. At night the treads catch whatever light there is and the
  risers go black, which is the same value ladder that makes it read by day.
- WEATHER STATES: sunny baseline; cloudy from the wash; RAIN wets the treads
  and darkens them, and the underside of the run stays dry.
- LIT/UNLIT variant: none required. If a stair is ever lit it is because
  somebody owns it (LIGHT=TERRITORY), and that is a placement, not a tile.
- ANIMATION: static.

## E. HOW
- EXACT SIZE: 44px cell. The run spans **exactly one storey** (`DECK_H`, which
  is `ring * 1.15` in the demo) vertically and about one tile of horizontal run.
  Deliverable: the run as one authored sprite plus a top landing tile and a
  bottom threshold tile so it JOINS both floors instead of floating between
  them.
- **THE STEP COUNT IS A REAL NUMBER, NOT A STYLE CHOICE.** Real code requires a
  7 inch maximum rise and an 11 inch minimum tread, so one storey is roughly 16
  to 18 steps. At 44px per tile a literal 18 steps is unreadable mush. The demo
  currently draws 5. **The art lane picks the count that READS and states it;
  the rule is that every step is the same height, because an uneven run is the
  single most obvious tell that a staircase was drawn rather than built.**
- VIEW: 45-degree world view, and the three rules this lane already researched
  and which the current version obeys must survive into the art:
  1. THREE SHADES PER STEP: bright sky-lit tread, dark vertical riser, and a lit
     lip on the tread's leading edge.
  2. HEIGHT LINES ARE PERFECTLY VERTICAL. The riser is the only thing in the
     frame that says "this is tall".
  3. DRAW BACK TO FRONT so near steps occlude far ones. The occlusion IS the
     depth cue; without it a stack of bands is a barcode.
- PALETTE: constitution ceiling; STRUCTURE value band, with the riser at the
  DARK end and the tread at the LIGHT end. The current code uses `#14110d`
  riser and `#8c7d61` tread and that ladder is the right one; the art should
  keep the RELATIONSHIP and give it material.
- LIGHT: one global direction. NO keyline. NO dither.
- SHADOWS: none baked. The run throws a shadow at its foot on the lot; the
  separate pass owns it (the demo already draws that footprint).
- SCALE ANCHORS: the rig standing at the bottom step, and the rig standing on
  the deck at the top. **A man must fit under the deck edge beside the stair.**
- WEAR LEVEL: an exterior concrete or galvanised-steel parking-deck stair after
  years. Nosings worn pale and rounded where a million feet hit them, the tread
  centres polished and the edges gritty, weeds in the joint at the bottom
  threshold, rust bleeding from the handrail sockets, a stripe of anti-slip
  paint burned to a ghost.
- VARIANTS: 1 silhouette. Optionally a second material (poured concrete vs
  galvanised steel with an open riser), which is a real second silhouette and
  therefore its own form if it goes past a colorway.

## F. THE CAPTION
```json
{
  "id": "TF-CMB-005",
  "name": "deck stair run",
  "layer": "portal",
  "solid": false,
  "enter": true,
  "district_families": ["parking structures", "commercial", "casino back-of-house"],
  "best_time": "any",
  "best_location": "on the near (down-screen) edge of a deck slab, descending toward the viewer to the lot",
  "place_next_to": ["upper deck slab", "asphalt", "concrete slab", "deck guard"],
  "never_next_to": ["deck stair run", "a top that touches no slab", "a bottom that touches no ground"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "single placement",
  "anim": null,
  "tags": ["stairs", "portal", "level-change", "verticality", "combat", "descends-toward-viewer"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: starter tileset `concrete_0/1` for the poured-concrete truth
  and `walk_kerb` for how this world already draws a small step in a walking
  surface. TF-CMB-004's slab edge is what the top of this run must join to
  seamlessly.
- NAMED OUTSIDE REFERENCE: **SLYNYRD, Pixelblog 41** and **Pixel Parmesan's
  isometric fundamentals** for the three-shades / vertical-riser /
  back-to-front rules, which this lane already applied in code and which the art
  must not lose. **Project Zomboid** for stair readability in a real top-down
  multi-storey game, which board row 1 already names as its outside reference,
  so both halves of the stair problem cite the same source on purpose.
- REAL-WORLD GROUNDING: an open-air Las Vegas parking-deck stair is poured
  concrete or galvanised steel pan-filled treads, in a corner tower or hung off
  the spandrel beam, uncovered because it does not rain. Code sets the geometry:
  7 in maximum rise, 11 in minimum tread, so one storey is 16 to 18 steps and
  the run is longer than people expect. The nosings wear pale, the anti-slip
  paint burns off in a couple of summers, and the handrail sockets rust-stain
  the concrete below them.

## H. DON'T WANT
- **NOT the current version.** Paolo has already called it dog shit by name.
  Fifteen flat rectangles is a diagram, not a staircase.
- **NOT a decal.** Stripes painted on the top of a floating tile was version
  one, it joined the two floors to nothing, and it is a named graveyard-class
  failure in this lane. If the run does not TOUCH THE GROUND, it is dead.
- NOT a barcode: without back-to-front occlusion a stack of bands is stripes.
- NOT uneven steps. Same rise every step or it reads as drawn, not built.
- NOT a side-on scroller staircase. NOT green. NOT purple.
- NOT clean or newly painted.

## I. ACCEPTANCE
- [ ] **JOIN PROOF: the top pixel row of the run touches a deck edge tile and
      the bottom pixel row touches the lot surface, measured, in the real
      generated arena.** This is the shipped bug and it is the first check.
- [ ] one-storey proof: the run spans exactly `DECK_H`, measured
- [ ] every step the same rise, measured in px
- [ ] palette ceiling + STRUCTURE value band + one light green; riser at the
      dark end, tread at the light end
- [ ] 45 check green: risers vertical, treads sky-lit, near steps occlude far
- [ ] squint test at 1-tile map zoom: still reads STAIRS and still reads
      DESCENDING, which is the thing the player failed to find
- [ ] FINDABILITY: screenshot of the full arena at the auto-frame zoom with the
      stair in it and NO marker chevron drawn. If it cannot be found without the
      UI arrow, it has not passed.
- [ ] ON THE REAL SURFACE: screenshot in a real generated two-storey arena, with
      the rig at the bottom step, beside the current code-drawn version
- [ ] caption JSON parses and matches sections C and D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: COMBAT lane | DATE: 7/28/26 | PRIORITY: HIGH
  (highest in this lane: it is the only asset Paolo has verbally rejected)
- BOARD ROW #: 54 | VERDICT: — | RELATED: board row 1 is the INTERIOR half.
  One batch, one judging, no cooking stairs twice.
