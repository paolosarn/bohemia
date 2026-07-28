# TILE FORM TF-WORLD-003 — CHAIN-LINK & SECURITY FENCE FAMILY

## A. IDENTITY
- NAME: Chain-link fence (the fence around everything that was worth stealing)
- FAMILY/SET: SECURITY FENCE family — chain-link run + posts + gate leaf +
  privacy slats + barbed-wire top + razor-wire top + a leaning/collapsed
  section. ONE drawing job.
- THE JOB, ONE SENTENCE: this tile exists so that the fifteen-plus districts
  that declare a perimeter fence stop drawing it as a coloured line, because a
  fence is the thing that tells you a place had something worth keeping.

## B. WHY
- DEMANDED BY: the district dossiers themselves — SEVEN districts declare
  "perimeter fence" (storage, watertreat, boneyard, landfill, railyard, solar,
  airfield), plus catch fence (speedway), ROW fence (rail), chain-link (wash),
  fence (farm, trailer, apartment, warehouse, waterpark, industrial), razor
  wire (jail), fence/wall (policestation). It is the single most-declared
  structure in my lane after "building".
- WHAT LOOKS BROKEN TODAY: all of them render as a 1-tile coloured band. A
  fence you cannot see through is a wall, and the whole point of chain-link is
  that you SEE THROUGH IT to the thing being kept from you.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md —
  * SUBURB BORDER/PERIMETER WALLS (13 keys x2 = 26, approved, CITY-wired and
    now RUN-wired): these are SOLID TAN STUCCO subdivision walls. Checked and
    disqualified — opaque masonry is the opposite object; you cannot see
    through it, it has no posts, and it belongs to residential only.
  * The 47 rejected wall candidates: rejected for perimeter and RESERVED FOR
    ACT 3 by Paolo — not usable, and act-1-only is in force (7/28).
  * HD PACK judged tiles: no chain-link family in the UP list.
  Nothing in the index claims a see-through fence.

## C. WHERE
- SURFACE + TAB: RUN (you walk up to it and along it) + CITY (it draws the
  boundary of industrial/utility plots).
- DISTRICT FAMILIES: storage, watertreat, boneyard, landfill, railyard, solar,
  battery, substation, airfield, industrial, warehouse, waterpark, farm,
  trailer, apartment, speedway, rail, wash, jail, policestation.
- LAYER: structure
- SOLID? yes — ENTERABLE? no (its GATE is the portal, and that is part of this
  family: a fence with no gate is a fence nobody ever used)
- MUST SIT BESIDE: itself in runs; its own posts at intervals; gravel yard,
  lot asphalt, desert ground, dirt yard at its foot.
- NEVER BESIDE: house facades (a chain-link fence bolted to a home front is
  the tell of a generic fence being reused where a wall belongs); interiors.
- EDGE CONTRACT: WANG-16 edge set (a linear object needing runs, corners, ends
  and a gate opening).

## D. WHEN
- ACT: 1
- BEST TIME: both. At night a lit yard seen THROUGH a fence is one of the
  strongest images available to us, and LIGHT=TERRITORY makes it meaningful:
  the fence is where owned light stops.
- WEATHER STATES: sunny baseline; cloudy fine; rain changes nothing (wire does
  not pool water).
- LIT/UNLIT: no self-light, but it must read correctly SILHOUETTED against a
  lit surface behind it — that is its best moment.
- ANIMATION: static. (A loose section moving in wind would be leaf-pixel legal
  but is NOT requested — do not add motion nobody ruled.)

## E. HOW
- EXACT SIZE: one tile per run segment, starter-set native px. Fence height
  ~2 m = a touch under 3 tiles of world height.
- VIEW: 45-degree world view. The mesh must be drawn as an actual open weave
  with the background showing through, not as a hatched solid.
- PALETTE: constitution ceiling; STRUCTURE band, but the mesh reads mostly as
  the colour BEHIND it — the wire is a thin light-grey lattice.
- LIGHT: the one global direction. NO keyline. NO dither (a dithered mesh at
  this scale becomes noise, which is the exact failure the pixel rules warn of).
- SHADOWS: none baked. Note: chain-link casts a diamond shadow in real life —
  that belongs to the shadow pass and must NOT be painted into the tile.
- SCALE ANCHORS: 2 m fence against human height; posts every 3 m; the diamond
  mesh aperture is 5 cm, which at 0.75 m/tile is SUB-PIXEL — so the mesh must
  be SUGGESTED at a legible pitch, not literally rendered. Getting this wrong
  is the main way this tile fails.
- WEAR LEVEL: galvanising survives Vegas well, so the wire itself is intact
  and pale — but the fabric sags between posts, sections lean, and at least
  one variant is cut open and peeled back, because everything worth taking was
  taken. Privacy slats go brittle and snap; missing slats read as gaps.
- VARIANTS: plain run, slatted run, barbed top, razor top (jail only), gate
  leaf, leaning section, cut-and-peeled section.

## F. THE CAPTION
```json
{
  "id": "TF-WORLD-003",
  "name": "chain-link fence",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": ["storage","watertreat","boneyard","landfill","railyard","solar","battery","substation","airfield","industrial","warehouse","waterpark","farm","trailer","apartment","speedway","rail","wash","jail","policestation"],
  "best_time": "any",
  "best_location": "the boundary of any industrial, utility or storage plot",
  "place_next_to": ["chain-link fence","fence post","gravel yard","lot asphalt","desert ground","dirt yard"],
  "never_next_to": ["house facade","interior floor"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "wang-16",
  "anim": null,
  "tags": ["structure","fence","see-through","security","boundary"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the approved SUBURB PERIMETER WALL family — this is its
  deliberate opposite number, and the two must be visually unmistakable from
  each other at a glance (stucco = residential, wire = industrial).
- NAMED OUTSIDE REFERENCE: Project Zomboid's chain-link, for how a
  see-through fence stays readable at small scale by suggesting the weave
  rather than drawing it. Also the fence-lines in The Last of Us for how a cut
  and peeled-back section tells a whole story with no text.
- REAL-WORLD GROUNDING: Clark County industrial yards run 6-8 ft galvanised
  chain-link with three-strand barbed outriggers; storage and utility sites
  add PVC privacy slats. In Mojave sun the galvanising holds up far better
  than the slats, which chalk and go brittle within a few years and snap out
  in pieces — so a real dead Vegas fence is intact wire with a gap-toothed
  slat line, not a rusted-out ruin. Rust appears only at the ground line and
  at cut ends.

## H. DON'T WANT
- NOT an opaque hatched band — if you cannot see the yard through it, it has
  failed its only job.
- NOT a literal 5 cm mesh (sub-pixel = noise).
- NOT heavily rusted overall (see grounding: galvanising survives; rust is
  local).
- NOT the suburb stucco wall in a different colour — that is the mall-icon
  mistake (a different object wearing a recolour).
- NOT a baked diamond shadow.

## I. ACCEPTANCE
- [ ] Wang set mates on every legal edge; run/corner/end/gate assemble cleanly
- [ ] Palette ceiling + STRUCTURE band + one-light green; NO dither
- [ ] SEE-THROUGH PROOF: rendered over two different backgrounds, both must
      read through the mesh
- [ ] Squint test at map zoom: reads as a boundary line, not a wall
- [ ] 3x3 TILED PROOF SHEET + a corner + gate assembly
- [ ] ON THE REAL SURFACE: a storage or boneyard plot wearing it, beside the
      approved suburb stucco wall for contrast (they must not be confusable)
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: WORLD | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 12 | VERDICT: —
