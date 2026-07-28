# TILE FORM TF-WORLD-009 — OVERHEAD CANOPIES (the layer you walk UNDER)

## A. IDENTITY
- NAME: Canopies and decks (fuel canopy, boarding canopy, carport, market tent)
- FAMILY/SET: OVERHEAD family — flat canopy deck + its columns + fascia band +
  carport + market stall tent + sign gantry. ONE drawing job (they are one
  construction: a roof on posts you pass beneath).
- THE JOB, ONE SENTENCE: this tile exists so the OVERHEAD render layer has any
  art at all, because thirteen distinct overhead materials are declared across
  the lane and the player is supposed to walk under every one of them.

## B. WHY
- DEMANDED BY: the LAYERING law (Paolo 7/19, "very important") which names
  OVERHEAD as one of the five layers — "pass under: canopy, deck". Thirteen
  materials declare it: fuel canopy (town, truckstop), boarding canopy
  (terminal), carport (trailer, apartment), stall tent x3 (swapmeet), jet
  bridge (airfield), overpass deck (freeway), deck (interchange), sign gantry
  (freeway, interchange), skybridge (downtown), busbar (substation).
- WHAT LOOKS BROKEN TODAY: every one renders as a flat coloured rectangle with
  no sense of being above you. The overhead layer exists in the dossiers, in
  the tilespec and in the renderer's vocabulary, and has zero art.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md —
  * HOUSE SKINS: pitched residential roofs; no canopy/post construction.
  * STARTER TILESET (42): no overhead element.
  * HD PACK UP list: nothing claiming a canopy.
  Nothing in the index claims an overhead structure.

## C. WHERE
- SURFACE + TAB: RUN (walking under it is the point; shade is the mechanic in
  a desert) + CITY.
- DISTRICT FAMILIES: town, truckstop, commercial (gas canopy), terminal,
  trailer, apartment, swapmeet, medical (drop-off canopy), airfield, freeway,
  interchange, downtown, substation.
- LAYER: overhead
- SOLID? NO — and this is the entire point: the deck is not solid, the COLUMNS
  are. A canopy that blocks movement is a bug, and the columns are what a body
  actually collides with.
- ENTERABLE? no
- MUST SIT BESIDE: its own columns at the corners; the surface below stays
  visible around and under it (lot asphalt, concrete pad, dirt).
- NEVER BESIDE: a wall on all four sides (then it is a roof, not a canopy).
- EDGE CONTRACT: WANG-16 for the deck (it must close a rectangle of any size
  with a correct fascia edge on all four sides).

## D. WHEN
- ACT: 1
- BEST TIME: both. A canopy's real job is the SHADOW it throws, which is the
  shadow pass's business — but it means the canopy must be authored knowing a
  hard shadow will sit under it.
- WEATHER STATES: sunny baseline (shade is the whole reason it exists in
  Vegas); rain — the ground UNDER a canopy stays DRY while everything around
  it is wet, which is a free and very convincing wet-state detail.
- LIT/UNLIT: fuel canopies famously carry underside lighting; in act 1 it is
  DEAD. No glow.
- ANIMATION: static. (Torn tent fabric would be leaf-pixel legal; NOT requested.)

## E. HOW
- EXACT SIZE: deck tiles at starter-set native px; columns are separate
  prop-scale pieces. Canopy clear height ~4.5 m for fuel = ~6 tiles of world
  height, so it reads well above head height.
- VIEW: 45-degree world view. You see the TOP of the deck and the underside
  fascia band; the underside is in shadow and is where the light fittings
  (dead) live.
- PALETTE: constitution ceiling; STRUCTURE band. The FASCIA BAND is a hue
  carrier — a fuel canopy's fascia stripe is the brand, and per the 7/28
  colour measurement this is exactly the kind of element our world is missing.
- LIGHT: the one global direction. NO keyline. NO dither.
- SHADOWS: none baked — but see D: this asset is defined by the shadow it will
  receive from the separate pass.
- SCALE ANCHORS: fuel canopy clear height 4.5 m; column spacing ~8 m; a carport
  is one car wide (canon CAR size is the ruler).
- WEAR LEVEL: canopy decks are steel and survive; the FASCIA panels blow out in
  wind and are the missing-tooth detail. Tent fabric is destroyed — frames
  standing with rags on them (the swapmeet dossier already says the frames
  outlived the canvas). Underside light lenses are yellowed and cracked.
- VARIANTS: fuel canopy, boarding canopy, carport, market tent frame (with and
  without surviving fabric), sign gantry, fascia colourways.

## F. THE CAPTION
```json
{
  "id": "TF-WORLD-009",
  "name": "overhead canopy",
  "layer": "overhead",
  "solid": false,
  "enter": false,
  "district_families": ["town","truckstop","commercial","terminal","trailer","apartment","swapmeet","medical","airfield","freeway","interchange","downtown","substation"],
  "best_time": "any",
  "best_location": "over pumps, bays, stalls and drop-offs -- anywhere a body should be able to walk beneath a roof",
  "place_next_to": ["canopy column","lot asphalt below","concrete pad below","dirt below"],
  "never_next_to": ["walls on all four sides"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "wang-16",
  "anim": null,
  "tags": ["overhead","canopy","pass-under","shade","not-solid"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the frozen CBB target's structure value band; and the
  approved LAMP DARK VARIANTS for how a dead light fitting reads (the canopy
  underside lights are the same problem).
- NAMED OUTSIDE REFERENCE: Pocket City 2's gas stations in the saved reference
  set — the canopy reads instantly as a canopy because of the fascia band and
  the visible columns, at very small size.
- REAL-WORLD GROUNDING: the Vegas valley is full of shade structures because
  shade is survival at 45 C — fuel canopies, carports over every apartment
  space (a Southwest signature; northern apartments do not have them), shaded
  bus bays, and swap-meet tent rows. Steel frames with painted aluminium fascia
  panels; in this sun the panels chalk and the fixings fail, so panels are
  missing before the frame ever bends.

## H. DON'T WANT
- NOT solid. A canopy that blocks a body is a failed canopy and a gate should
  catch it.
- NOT a pitched roof; these are flat decks with a fascia.
- NOT lit undersides. Act 1 is dark.
- NOT floating — the columns must be part of the delivery, or it reads as a
  slab hovering in the air.

## I. ACCEPTANCE
- [ ] Wang set closes canopies of several sizes with correct fascia on all edges
- [ ] NOT-SOLID PROOF: a body walks under it on the real surface; only the
      columns collide
- [ ] Palette ceiling + STRUCTURE band + one-light green
- [ ] 3x3 TILED PROOF + an assembled fuel canopy with columns and pumps beneath
- [ ] ON THE REAL SURFACE: the town's gas station and the terminal's bays
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: WORLD | DATE: 7/28/26 | PRIORITY: MED
- BOARD ROW #: 38 | VERDICT: —
