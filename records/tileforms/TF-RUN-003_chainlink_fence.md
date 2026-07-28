# TILE FORM TF-RUN-003 — CHAIN-LINK FENCE + RAZOR WIRE (the see-through wall)

## A. IDENTITY
- NAME (plain words a person would say): Chain-link fence — the wire fence with
  the razor wire on top that every locked-up yard in Vegas is wrapped in
- FAMILY/SET: FENCE LINE family — straight run, corner, gate leaf (shut + open),
  and the torn/peeled-back breach. One coherent drawing job.
- THE JOB, ONE SENTENCE: this tile exists so the game has its FIRST structure
  you can SEE THROUGH — a barrier that blocks you while showing you exactly
  what it is keeping you out of, which is the whole emotional point of a
  fenced yard in a dead city.

## B. WHY (the need — no ruling, no tile)
- DEMANDED BY: RUN backlog 0b (DISTRICT ART). Five approved district dossiers
  specify fencing as a defining feature in their own words: self-storage
  ("fortress fence"), substation ("double-fenced"), salvage yard ("fenced"),
  landfill ("fenced"), jail/police (secure yard separation). Measured on the
  real run surface this turn — survey in
  records/BOHEMIA_RUN_DISTRICT_MATERIAL_SURVEY_7_28_26.md.
- WHAT LOOKS BROKEN TODAY WITHOUT IT: there is no see-through structure in the
  run's vocabulary at all. Every barrier the world model names resolves through
  `genericTile`'s `/fence|wall|barrier/` branch to **`wall_base`** — the same
  opaque stucco course the run lays as the bottom of a HOUSE. So a razor-wired
  substation perimeter and a suburban living-room wall are the identical
  square. This is the exact defect class Paolo already caught once, in his own
  words: *"the suburb border walls are not changed its still the house tiles"*.
  It was fixed for the suburb perimeter with his 13 approved walls; the FENCED
  districts still have it.
- SHOPPING CHECK (records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md):
  - PERIMETER WALL POOL (13 approved, now live in the run) — these are SOLID
    masonry community walls, the opposite of this ask. You cannot see through
    them, and a storage yard wrapped in a suburban stucco wall reads as a
    gated community, not a fortress.
  - SEAM-FIXED SURFACES `Wall tiles (1)` (20) and `3. Broken wall tiles` (18) —
    **rendered and looked at this turn**: they are medieval/fantasy stone
    masonry and ruined battlements, one with a torch sconce. Off-genre, exactly
    as the index's own DEAD/RESERVED note predicts ("mostly off-genre
    sci-fi/fantasy/winter/occult"). Not usable.
  - WALL_CANDIDATES_POOL / WALL_PICKS — the 47 rejected candidates are marked
    "rejected FOR PERIMETER, reserved for ACT 3 by Paolo". Reserved, and solid
    masonry regardless.
  - Nothing approved is transparent. This is a genuine hole, and it is a
    RENDERING CAPABILITY hole as much as an art one.

## C. WHERE (place — the game code reads this)
- SURFACE + TAB: RUN (the walk). CITY human mode uses the same barrier.
- DISTRICT FAMILIES: storage, substation, boneyard/salvage, landfill, jail,
  policestation, battery, railyard, industrial, solar. The "keep out" family.
- LAYER: structure
- SOLID? YES — ENTERABLE? no, EXCEPT the gate leaf, which is a portal when
  open. INSIDE a gate: the yard the fence encloses (no separate interior).
- MUST SIT BESIDE: itself in a run; its own corner piece; gravel ground
  (TF-RUN-002) on the inside; desert ground or sidewalk on the outside;
  concrete pads.
- NEVER BESIDE: a house wall (a chain-link fence never forms part of a
  building's face); interior anything; the approved masonry perimeter walls —
  a lot is fenced OR walled, never both in the same run, which is a real
  reading rule and not just taste.
- EDGE CONTRACT: SINGLE PLACEMENT for the gate leaf and the breach.
  WANG-16 edge set for the fence line itself (a fence is a CONNECTED LINE — it
  needs to know its neighbours to draw corners and ends correctly). This is the
  first Wang set in the run and the run's renderer will need the neighbour
  lookup; that is called out here deliberately so the art lane and the run lane
  agree the contract before pixels exist.

## D. WHEN (time & state — the invisible-caption inputs)
- ACT: 1
- BEST TIME: both. AT NIGHT THIS IS THE IMPORTANT ONE: chain-link is where
  LIGHT=TERRITORY becomes visible — a lit yard seen THROUGH its own fence is
  the single clearest way to say "somebody still owns this". The mesh must read
  as a dark grid against a lit interior without turning into a black block.
- WEATHER STATES: sunny baseline; cloudy no change; rain — wire holds droplets
  but at our scale that is invisible, so no wet variant. The GROUND behind it
  changes, the fence does not.
- LIT/UNLIT variant needed? No self-lit variant, but the mesh must be authored
  so the ambient/night pass can darken it without filling in the holes. The
  transparency is the asset.
- ANIMATION: the gate leaf swings — reuse the approved door-clip contract
  (9 frames over 2 beats at 120 BPM, leaf-pixel law: the POST is frozen, only
  the leaf moves). The fence line itself is static.

## E. HOW (build spec — the art lane's one-shot recipe)
- EXACT SIZE in px: 1 tile wide. **2 tiles tall** — a fence that carries a gate
  obeys the same rule as a wall that carries a door (laws/BOHEMIA_ADDENDUM_
  THREE_TILE_WALL_7_28_26 + the 2-tall DOOR LAW). Real chain-link is 6ft, +1ft
  of razor wire on top; against our ~2-tile door that is very close to 2 tiles.
- VIEW: 45-degree world view. You see the fence FACE and, through it, the
  ground behind. The top wire and razor coil catch the sky light; the mesh is
  in shade.
- PALETTE: constitution ceiling; STRUCTURE value band. Galvanised wire is a
  narrow value range — this asset lives or dies on being READABLE while nearly
  transparent, so it will sit at the light end of structure with real alpha.
- LIGHT: the one global direction. NO keyline. NO dither — and note the mesh is
  a REGULAR PATTERN, which is the one thing most likely to be mistaken for
  dither by a purity sweep; the art lane should expect to defend it.
- SHADOWS: none baked. A real chain-link fence throws a diamond shadow pattern
  on the ground and that is gorgeous, but it belongs to the separate shadow
  pass, not to this tile.
- SCALE ANCHORS: 2-tile door height; the diamond mesh aperture is roughly a
  fist (50mm) — at tile scale that is 3-4 diamonds across a tile, no more. Post
  spacing every 10ft = roughly every 3 tiles.
- WEAR LEVEL: dead world, but chain-link outlives everything — that is its
  character. Sagging between posts, rust bleeding down from the top rail, one
  panel per long run peeled up at the bottom corner where somebody crawled
  under. Razor wire intact but dulled. NOT flattened, NOT gone.
- VARIANTS: straight run, corner, end post, gate leaf (shut/open), breach
  (peeled corner). Razor-wire topper as a switchable top course so an
  ordinary yard fence and a prison fence share the geometry — that is a
  colorway-grade difference, not a new form.

## F. THE CAPTION (ships with the tile — machine-readable)
```json
{
  "id": "TF-RUN-003",
  "name": "chain-link fence + razor wire",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": ["storage", "substation", "boneyard", "landfill", "jail", "policestation", "battery", "railyard", "industrial", "solar"],
  "best_time": "night is when it matters most (a lit yard seen through its own fence)",
  "best_location": "the boundary of any lot the world model calls fenced; gravel inside, public ground outside",
  "place_next_to": ["chain-link fence", "gravel / ballast ground", "desert ground", "sidewalk", "cracked concrete pad"],
  "never_next_to": ["house wall", "masonry perimeter wall", "interior floors"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "wang-16 line + single-placement gate and breach",
  "anim": {"part": "gate leaf only", "frames": 9, "beats": 2, "bpm": 120, "frozen": "posts and mesh"},
  "tags": ["structure", "see-through", "barrier", "keep-out", "light-is-territory", "wang"]
}
```

## G. REFERENCES (all three required)
- APPROVED ANCHOR: the 13 approved suburb perimeter walls
  (banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt, live in the run since 7/28)
  — this is their OPPOSITE NUMBER and must read as deliberately different at a
  glance: they are private and opaque, this is institutional and transparent.
  Same height band, same light, opposite material.
- NAMED OUTSIDE REFERENCE: **Project Zomboid**'s chain-link, for the specific
  problem of drawing a transparent barrier top-down that still reads as solid
  to the player's understanding — its answer is a strong top rail and visible
  posts carrying a very light mesh, and that is the answer to steal.
  **The Last of Us**'s fenced quarantine zones for razor wire as a
  storytelling device rather than decoration.
- REAL-WORLD GROUNDING: Clark County utility and storage lots use 6ft
  galvanised chain-link on 2-3/8" line posts at 10ft centres, with three
  strands of barbed wire or a razor coil on outriggers, and green or tan
  privacy slats woven into the mesh on the storage lots specifically. In Vegas
  sun the galvanising chalks to a flat pale grey within a few years and any
  slats go brittle and snap — a long-abandoned fence has gaps of missing slats
  like missing teeth. Ground-level rust is minimal because there is no
  moisture; the rust that exists bleeds from the TOP rail and the fittings.
  That is the opposite of a rust-belt fence and it is what makes it Vegas.

## H. DON'T WANT (the anti-reference)
- NOT a solid block. If the mesh fills in at night or at distance the entire
  asset has failed — you must always see what is inside.
- NOT the house tile (this is the named regression: *"the suburb border walls
  are not changed its still the house tiles"*). If it can be mistaken for the
  bottom course of a building it is dead.
- NOT rust-belt brown. Vegas galvanising goes chalky pale grey, not orange.
  Rust is a top-rail accent only.
- NOT flattened or collapsed everywhere — chain-link is the thing that SURVIVES
  the apocalypse. One breach per run tells the story; a flattened fence tells
  none.
- NOT a fantasy palisade, and NOT the off-genre masonry in the seam-fixed bank
  (checked and rejected this turn).
- NOT drawn as individual wires at walk zoom — that is a moiré generator.

## I. ACCEPTANCE (what the machine proves BEFORE Paolo ever sees it)
- [ ] TRANSPARENCY PROVEN: rendered over a bright ground and a dark ground, the
      ground is visibly readable through the mesh in both, and the fence is
      still readable as a barrier in both. Both directions or it fails.
- [ ] Wang-16 completeness: every one of the 16 neighbour cases renders, corners
      close, no floating end posts
- [ ] Palette ceiling + STRUCTURE value band + one-light checks green; the
      regular mesh pattern is declared to the dither check up front
- [ ] 2-tile height verified against the approved 2-tall door
- [ ] ON THE REAL SURFACE: screenshot of a substation or storage yard wrapped in
      it, at DAY and at NIGHT with the yard lit, beside the approved masonry
      perimeter wall for contrast
- [ ] Gate leaf animation obeys leaf-pixel law (posts frozen) and the 2-beat
      door timing
- [ ] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: RUN lane (0b district-material survey, 7/28)
  | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 10 | VERDICT: —
