# TILE FORM TF-CMB-006 — THE DECK GUARD (the thing that says you would fall)

## A. IDENTITY
- NAME: The deck guard (the rail or kerb along the open edge of the upper deck)
- FAMILY/SET: THE DECK family. TF-CMB-004 is the slab, TF-CMB-005 is the stair.
- THE JOB, ONE SENTENCE: this tile exists so that the open edge of a second
  storey reads as an EDGE, so a player standing near it knows he is somewhere he
  could fall from and can see who is exposed at it.

## B. WHY
- DEMANDED BY: the two-storey arena Paolo ordered 7/27/26 ("Two-story arenas
  yes"), and the follow-up complaint that the levels are not coded well enough
  with people on them. Every reference this lane researched (Jagged Alliance 2's
  ground/roof model, XCOM's high ground, Project Zomboid's multi-storey) treats
  a roof edge as the position that matters, and Bohemia's deck currently has no
  edge object at all.
- WHAT LOOKS BROKEN TODAY: the deck's edge is a 2.5px cream stroke
  (`rgba(226,208,168,0.85)`) drawn along the tiles that have nothing north of
  them. It is a line, not a thing. A man standing at the deck edge and a man
  standing in the middle of the deck are identical in every way except their
  y-position, so there is no visual price to standing exposed at the lip.
- SHOPPING CHECK:
  * STARTER TILESET 42, `roof_parapet` = "the parapet wall around a flat roof,
    lit along its coping". **The strongest hit in the whole COMBAT request list
    and the art lane must try it before drawing anything.** A solid parapet is a
    legitimate real answer for a deck edge. Where it may fall short: a parapet
    is drawn for a roof looked DOWN at from the outside, and the deck's open
    edge is looked ACROSS at from the same level and UP at from the lot, so it
    may need a second face. If it works as-is, this form is satisfied by reuse
    and NOTHING is cooked, which is the correct outcome.
  * PERIMETER_WALL_POOL (26 approved): these are ground-level boundary walls, 2
    tiles minimum, far too tall and heavy to sit on a deck edge.
  * `walk_kerb` (starter): a kerb lip on a sidewalk, one tile, ground layer. Too
    small to be a guard but it is the right LANGUAGE for the wheel-stop variant.
  * DEMO_PROP_POOL: `chains` x8, none approved. No railing family exists.

## C. WHERE
- SURFACE + TAB: COMBAT (the fight field, the SLICE tab); parking structures in
  RUN/CITY later.
- DISTRICT FAMILIES: parking structures, commercial, casino back-of-house.
- LAYER: structure
- SOLID? **yes for the solid variants (parapet, kerb wall), no for the open
  rail** (which you see through and shoot through). The caption declares it per
  variant, and this is a real gameplay difference, not a style choice.
- ENTERABLE? no
- MUST SIT BESIDE: the deck slab's edge tiles, only. It runs ALONG an edge, so
  it needs straight sections, two ends, and outside corners.
- NEVER BESIDE: the ground. A guard at ground level is a fence and that is a
  different object. Never across the stair opening (the stair needs a gap in the
  run, so the family must include an OPENING piece or the stair is walled off).
- EDGE CONTRACT: **WANG-16 edge set** on the same slab grid as TF-CMB-004, so a
  guard automatically wraps whatever rectangle the generator rolled.

## D. WHEN
- ACT: 1
- BEST TIME: both. A rail at night is a black comb against whatever is behind
  it, which is the most legible it ever is.
- WEATHER STATES: sunny baseline; cloudy from the wash; RAIN darkens it and
  drips off the bottom rail.
- LIT/UNLIT variant: none of its own.
- ANIMATION: static. **Leaf-pixel law note for whoever is tempted:** a rail is
  structure. If it ever gets wind sway, only the leaf may move and the structure
  stays frozen, and the gate enforces it. For Act 1 it is static.

## E. HOW
- EXACT SIZE: 44px cell, 1 tile per section, sitting ON the deck edge tile.
  **Guard height is 42 inches by code**, which on the canon rig is roughly
  waist-to-lower-chest, so a man behind a solid guard is hidden to about the
  waist. That number matters, because it makes the solid variant behave exactly
  like TF-CMB-001 low cover, which is a free and correct gameplay result.
- VIEW: 45-degree world view. An open rail is the hardest object in this list to
  draw at 45 without it turning into a picket fence seen side-on: the top rail
  must be a foreshortened band with visible thickness, and the posts are the
  vertical height lines.
- PALETTE: constitution ceiling; STRUCTURE value band. A galvanised rail is a
  cool pale grey, which is one of the few legitimately cool things in a warm
  world, so it must be checked against the palette ceiling and not allowed to
  read blue.
- LIGHT: one global direction. NO keyline. NO dither.
- SHADOWS: none baked. An open rail throws a striped shadow on the deck and that
  belongs to the separate pass; note the footprint so the pass can do it.
- SCALE ANCHORS: the rig standing at the edge. 42 inch guard height is the ruler.
- WEAR LEVEL: galvanising gone chalky white, rust bleeding from every post
  socket and running down the concrete below it, one section bent outward where
  something hit it, one section missing entirely (which is a genuinely useful
  variant: a gap in the guard is a place you can fall or shoot through).
- VARIANTS: 3 silhouettes, and the solid/open difference is REAL because it
  changes `solid`: (1) solid concrete parapet, (2) open pipe rail, (3) a low
  concrete kerb wall (wheel stop scale). Plus two required pieces regardless of
  variant: an END and an OPENING (for the stair).

## F. THE CAPTION
```json
{
  "id": "TF-CMB-006",
  "name": "deck guard",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": ["parking structures", "commercial", "casino back-of-house"],
  "best_time": "any",
  "best_location": "running along the open edge tiles of an upper deck slab, with an opening at the stair",
  "place_next_to": ["upper deck slab", "deck stair run"],
  "never_next_to": ["ground level", "across the stair opening"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "wang-16 edge set",
  "anim": null,
  "tags": ["deck", "edge", "guard", "rail", "parapet", "combat", "verticality", "42-inch"]
}
```
NOTE FOR THE INGEST: the open-rail variant ships the same caption with
`"solid": false` and `"tags"` gaining `"see-through"`. That is the one field
that differs and it is a gameplay field, so it must not be flattened.

## G. REFERENCES
- APPROVED ANCHOR: starter tileset `roof_parapet` (try it first, it may simply
  be the answer) and `walk_kerb` for the low-kerb variant's language.
- NAMED OUTSIDE REFERENCE: **Jagged Alliance 2**, where the roof edge is the
  whole reason to be on a roof, so the edge has to be a place you can recognise
  and stand at. **Project Zomboid** for how a top-down game draws a low edge
  barrier without it becoming a side-on fence.
- REAL-WORLD GROUNDING: US building code requires a 42 inch guard at any
  walking edge with a drop, and vehicle barriers on parking decks are separately
  rated to stop a car. Real Las Vegas garages use either a solid precast
  spandrel that doubles as the guard, or a galvanised pipe rail, or cable rail,
  on top of a low concrete kerb. Galvanising in the Mojave chalks white within a
  few years and the post sockets rust-stain the concrete beneath them in long
  vertical streaks, which is a free and very readable detail.

## H. DON'T WANT
- NOT a 2.5px line. It has to be an OBJECT, or nothing changes.
- NOT a picket fence seen side-on. This is the highest 45-law risk in the deck
  family.
- NOT a chain-link fence: that is a different object for a different place and
  it is not in this ask.
- NOT reading blue. Galvanised grey is cool and the palette ceiling is warm;
  check it, do not eyeball it.
- NOT continuous across the stair. If the guard walls off the stair, the deck
  has no entrance and the whole two-storey mechanic is dead.
- NOT clean, NOT intact everywhere.

## I. ACCEPTANCE
- [ ] STAIR OPENING PROOF: generated on a real arena, the guard wraps the slab
      AND leaves the stair open, screenshotted
- [ ] height measured: 42 inch equivalent against the canon rig; the solid
      variant hides a standing man to about the waist
- [ ] `solid` per variant is correct in the caption and the open rail is
      genuinely see-through in the render
- [ ] palette ceiling + STRUCTURE band + one light green; the cool-grey check
      passes (does not read blue)
- [ ] 45 check green: top rail foreshortened with thickness, posts vertical
- [ ] Wang-16 completeness: straights, ends, outside corners, opening
- [ ] squint test at 1-tile map zoom: the deck still reads as having an edge
- [ ] ON THE REAL SURFACE: screenshot with the rig standing at the edge and
      another rig on the lot below
- [ ] caption JSON parses and matches sections C and D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: COMBAT lane | DATE: 7/28/26 | PRIORITY: MED
- BOARD ROW #: 55 | VERDICT: —
- HONEST NOTE: roof-edge cover as a MECHANIC is not built and is not ruled. This
  form is a READ, not a mechanic: the deck edge needs to look like an edge
  whatever the rules end up being. If `roof_parapet` covers it, cook nothing.
