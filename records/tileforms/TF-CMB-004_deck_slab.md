# TILE FORM TF-CMB-004 — THE UPPER DECK SLAB (top plate, edge beam, soffit)

## A. IDENTITY
- NAME: The upper deck (the second storey you climb onto in a two-storey fight)
- FAMILY/SET: THE DECK family. ONE coherent drawing job: the three faces of one
  concrete slab (the TOP you stand on, the EDGE BEAM you see when it is above
  you, the SOFFIT you see underneath it). TF-CMB-005 is its staircase,
  TF-CMB-006 is its guard.
- THE JOB, ONE SENTENCE: this tile exists so that the two-storey arena reads as
  a real concrete structure with a real height instead of a lighter grey square
  floating over a darker grey square.

## B. WHY
- DEMANDED BY: Paolo 7/27/26, "Two-story arenas yes", and the follow-up
  "you still need [to] code it better with the players on it, the enemies on
  it". The mechanic shipped in v90/v90b/v91/v92/v93 and it is LIVE: levels,
  cross-level cover, a stair, and the under-deck x-ray. Every bit of it is drawn
  in code today. Board row 1 already names "the garage ramp/deck-edge treatment
  so the already-generated parking decks can finally be seen" and has no form.
- WHAT LOOKS BROKEN TODAY: the deck top is `#665c49`, one flat fill per tile
  with a 1px outline. The side face is `#15120e` with a single 0.22-alpha lit
  band across the top 18%. The lip is a 2.5px cream stroke. That is it. It works
  ONLY because the value contrast is extreme, and the first screenshot of it
  failed exactly as predicted in the code comment: without the near-black face
  it read as "a lighter patch of ground" rather than a thing with a height.
  There is no concrete, no joint, no stain, no edge beam, and nothing at all
  underneath.
- SHOPPING CHECK:
  * STARTER TILESET 42, `roof_deck` = "a flat gravel roof deck". Genuine partial
    hit and the closest approved thing in the game. It does NOT cover this: a
    parking deck is a DRIVING surface, poured concrete with tyre polish, saw-cut
    control joints and oil drip lines down the stall centres, not loose gravel
    ballast. Gravel under a fight also reads as ground, which is the exact
    failure the near-black face is currently compensating for.
  * STARTER TILESET 42, `roof_parapet` = "the parapet wall around a flat roof,
    lit along its coping". Partial hit for the deck EDGE, and the art lane
    should try it. It does not cover the case the code actually needs: when the
    deck is ABOVE you, what you see is the slab's edge beam and its underside,
    looked UP at. A parapet is a top-of-wall coping looked DOWN at. Different
    face, different light.
  * `concrete_0/1` = "a poured concrete path or driveway slab": ground layer, no
    thickness, no edge. It is the right MATERIAL and the wrong OBJECT, and it is
    the correct colour reference for this form.
  * STALL_STRIPE_CANDIDATES (`stall_line_v` x6, `stall_line_h` x6): exists but
    is explicitly "UNJUDGED, pools only on Paolo UP", so it cannot be relied on.
    Flagged for his thumb; if it goes UP the deck gets its stall lines free.
  * MARKING_BANK (84 items, 14 classes, all UP, "I like all of them"): approved
    and has ZERO live surface. Arrows and numerals off it belong on this deck.

## C. WHERE
- SURFACE + TAB: COMBAT (the fight field, the SLICE tab). Also the CITY/RUN
  parking structures the overmap already generates.
- DISTRICT FAMILIES: parking structures, commercial, casino back-of-house,
  strip-mall service decks.
- LAYER: **structure** for the slab as an object, but the TOP FACE behaves as
  GROUND once you are standing on it. This dual read is the whole difficulty and
  the caption declares both.
- SOLID? the edge beam and soffit are solid; the top plate is walkable, not
  solid — ENTERABLE? no. It is not a portal: you reach it by the stair
  (TF-CMB-005), which IS the portal-ish move.
- MUST SIT BESIDE: itself (decks are 2x2 to 4x4 tile slabs), the stair run at
  its near edge, the guard at its open edges, tall cover (a column under a deck
  edge is the most honest placement in the game), asphalt and concrete below.
- NEVER BESIDE: interior floors. Never a deck tile with nothing supporting it
  and nothing under it. Never over the player's spawn (the generator already
  refuses that).
- EDGE CONTRACT: **WANG-16 edge set.** A slab is a rectangle of top tiles whose
  four sides each need an authored edge, and whose four corners need corners.
  Interior tiles are SELF-SEAMLESS against each other.

## D. WHEN
- ACT: 1
- BEST TIME: both. **AT NIGHT THE UNDERSIDE IS THE STORY**: an open deck is
  black underneath and that dark is where nobody patrols. No self-light unless
  somebody owns it (LIGHT=TERRITORY, CLUSTERED POWER at 12% lit).
- WEATHER STATES: sunny baseline; cloudy from the wash; RAIN wets the top plate,
  runs off the edge, and leaves the soffit DRY, which is the single best weather
  detail available in the whole request list and costs one variant.
- LIT/UNLIT variant: not required for Act 1. If it ever gets one it is the
  underside, not the top.
- ANIMATION: static.

## E. HOW
- EXACT SIZE: 44px cell. Slabs are 2x2 to 4x4 tiles (what the generator rolls).
  Deliverables: interior top tile (2 to 3 variants), 4 edge tiles, 4 corner
  tiles, the edge-beam face strip, and the soffit tile.
- **THE HEIGHT NUMBER: one storey. In the demo the slab plane sits `DECK_H =
  ring * 1.15` above the lot, i.e. slightly more than one tile pitch. The edge
  beam art must be authored to that ratio so the picture and the maths agree.**
- VIEW: 45-degree world view. Top plate reads flat and sky-lit. The edge beam is
  the ONE place in this form where a hard vertical is not just allowed but
  REQUIRED: the research this lane already did on stairs (Pixel Parmesan's
  isometric fundamentals, SLYNYRD's Pixelblog 41, the Pixelation top-down-stairs
  thread) is unanimous that height lines must be perfectly vertical, because the
  vertical is the only thing in the frame that says "tall".
- PALETTE: constitution ceiling. Top plate in the GROUND value band (it IS
  ground when you stand on it); edge beam and soffit in the STRUCTURE band, and
  the soffit at the DARK end. **VALUE CONTRAST IS THE HEIGHT CUE** and this lane
  learned it the hard way.
- LIGHT: one global direction. NO keyline. NO dither.
- SHADOWS: none baked. The slab throws a big hard shadow on the lot and the
  separate pass owns it; the demo already draws that footprint.
- SCALE ANCHORS: the rig standing on the deck; a canon car parked on it (a
  parking deck must be able to hold TF-CMB-003 without looking like a toy). Real
  bay geometry: 17 to 27 foot slab spans on roughly 24-foot column bays.
- WEAR LEVEL: a Las Vegas parking structure nobody has swept in years. Tyre
  polish darkening the aisles, oil drips down the middle of each stall, saw-cut
  control joints with weeds in them, salt-white efflorescence bleeding out of
  the edge beam, rust stains running down from the beam where the reinforcement
  has started to bleed, stall paint burned to a ghost.
- VARIANTS: 2 to 3 top-tile variants so a 4x4 slab does not visibly repeat, plus
  the wet colorway. Edge and corner tiles are one each per side.

## F. THE CAPTION
```json
{
  "id": "TF-CMB-004",
  "name": "upper deck slab",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": ["parking structures", "commercial", "casino back-of-house"],
  "best_time": "any",
  "best_location": "a 2x2 to 4x4 slab one storey above a lot, with its near edge reachable by a stair",
  "place_next_to": ["upper deck slab", "deck stair run", "deck guard", "tall cover", "asphalt below", "concrete slab below"],
  "never_next_to": ["interior floors", "unsupported air", "the player spawn"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "wang-16 edge set (interiors self-seamless)",
  "anim": null,
  "tags": ["deck", "level", "storey", "walkable-top", "concrete", "combat", "verticality"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: starter tileset `concrete_0/1` for the poured-concrete colour
  and grain truth, `roof_deck` and `roof_parapet` as the nearest approved
  objects (try them first), and the approved MARKING_BANK for anything painted
  on the deck.
- NAMED OUTSIDE REFERENCE: **Project Zomboid** for how a multi-storey top-down
  game draws a floor plate you can be under or on top of, and specifically for
  the honesty that the underside has to be nearly black or the two floors merge.
  **Jagged Alliance 2** for the two-level ground/roof model this lane is
  already following. **SLYNYRD Pixelblog 41** and **Pixel Parmesan's isometric
  fundamentals** for the vertical-height-line rule the edge beam depends on.
- REAL-WORLD GROUNDING: Las Vegas parking structures are cast-in-place
  post-tensioned concrete or precast double-tees on precast spandrel beams. The
  spandrel is the perimeter beam that carries the deck to the columns and it is
  typically about 76 inches deep with an 8 inch minimum web, so THE EDGE OF A
  PARKING DECK IS A DEEP SOLID BAND, not a thin lip. That single fact is what
  the current 2.5px cream stroke is missing. Column bays run about 24 feet, slab
  spans 17 to 27 feet. Everything weathers the same way in the valley: pale,
  chalky, efflorescent, rust-streaked at the reinforcement.

## H. DON'T WANT
- NOT gravel. `roof_deck` is ballast for a roof nobody drives on; this is a
  driving surface.
- NOT a thin lip. The real edge is a deep beam; a hairline edge is exactly why
  the current render needs an extreme black face to survive.
- NOT a lighter patch of ground. That is the MEASURED failure mode of the first
  attempt, recorded in the code, and it is the kill condition here.
- NOT a side-on scroller face for the edge beam. Vertical height lines yes,
  2D-platformer wall no.
- NOT green, NOT purple.
- NOT clean, NOT swept, NOT freshly striped.

## I. ACCEPTANCE
- [ ] HEIGHT PROOF: the edge beam is authored at the demo's real `DECK_H` ratio,
      measured, so the drawing and the maths agree
- [ ] TWO-FLOOR PROOF: a rig ON the deck and a rig UNDER the deck screenshotted
      in one frame, and they are unmistakably on different floors WITHOUT the
      x-ray ghost turned on (the ghost is a safety net, not the fix)
- [ ] seam measured on the interior tiles: wrap delta within the normal
      neighbour step, NO edge darkening (the desert-pool lesson)
- [ ] Wang-16 completeness: all 4 edges + 4 corners present and tested on a 4x4
- [ ] palette ceiling + value bands (top in GROUND, soffit at the DARK end of
      STRUCTURE) + one light green
- [ ] squint test at 1-tile map zoom: the slab reads as a slab
- [ ] 3x3 tiled proof + a 4x4 boredom check (no visible repeat motif)
- [ ] ON THE REAL SURFACE: screenshot of a real generated two-storey arena
      wearing it, beside the current code-drawn render for contrast
- [ ] caption JSON parses and matches sections C and D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: COMBAT lane | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 53 | VERDICT: — | RELATED: board row 1 (interior stairs + garage
  ramp/deck-edge) covers the INTERIOR half of the same problem; this form is the
  EXTERIOR open-air deck. Cook them together, judge them together, do not cook
  the concrete twice.
