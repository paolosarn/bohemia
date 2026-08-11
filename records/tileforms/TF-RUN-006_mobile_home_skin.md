# TILE FORM TF-RUN-006 — MOBILE HOME SKIN

## A. IDENTITY
- NAME (plain words a person would say): Trailer siding — the ribbed aluminium
  side of a single-wide mobile home, with its skirting and its tie-downs
- FAMILY/SET: MOBILE HOME family — long side face, end face, skirting base
  course, low-pitch roof edge, the awning/carport post, and the burned-out
  variant the district dossier already calls for.
- THE JOB, ONE SENTENCE: this tile exists so a trailer park reads as a trailer
  park — low, thin, repeated, up on blocks — instead of as a row of tiny
  stucco houses.

## B. WHY (the need — no ruling, no tile)
- DEMANDED BY: RUN backlog 0b (DISTRICT ART); the approved trailer-park
  district dossier itself specifies "staggered mobile-home rows, carports,
  sheds, some burned out" and the district gate enforces that layout — so the
  LAYOUT is canon and approved while the MATERIAL does not exist. Measured this
  turn: records/BOHEMIA_RUN_DISTRICT_MATERIAL_SURVEY_7_28_26.md.
- WHAT LOOKS BROKEN TODAY WITHOUT IT: trailer `mobile home` ×395 per cell, all
  rendering through the run's building stack as house stucco with a hip roof.
  A mobile home is the opposite of that in every dimension that matters: it is
  METAL not masonry, it is ONE STOREY AND LOW, it has a SHALLOW or flat roof
  not a hip, and it sits UP ON BLOCKS with a skirt rather than on a slab. The
  current render gets all four wrong, so the most visually distinctive
  residential district in the valley is indistinguishable from the suburb.
- SHOPPING CHECK (records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md):
  - HOUSE SKINS (30 approved, live in the run since 7/28) — the nearest miss.
    They are stick-built suburban: shingle roofs, stucco walls, boarded
    windows, residential doors. Correct for the suburb and for the estate/gated
    families; wrong here for the four structural reasons above. Using them is
    exactly what is happening today and it is the defect.
  - SEAM-FIXED SURFACES metal packs — looked at this turn: sci-fi floor
    plating and diamond-plate grating, off-genre and horizontal.
  - TF-RUN-004 (corrugated metal skin, filed this turn) — CLOSE, and
    deliberately NOT the same form. Warehouse cladding is heavy 26-gauge
    vertical rib at building scale; mobile-home siding is thin HORIZONTAL
    lap-ribbed aluminium at half the height, with a skirt and a different
    weathering story (hail dents, sun-crazed decals, rust at the seam line).
    Different silhouette = different form, per rule 1.
  - Genuine hole.

## C. WHERE (place — the game code reads this)
- SURFACE + TAB: RUN (the walk); CITY human mode.
- DISTRICT FAMILIES: trailer. Also the site trailers that belong in industrial,
  boneyard and quarry lots, and the swap-meet's permanent vendor units.
- LAYER: structure
- SOLID? YES — ENTERABLE? yes via the approved 2-tall door; INSIDE is the
  interior pool's small-residential room recipe (a single-wide interior is
  narrow — the INTERIOR-MATCHES-EXTERIOR law means the floor plate is exactly
  the footprint, which for a trailer is genuinely long and thin, and that is a
  feature).
- MUST SIT BESIDE: itself along the long axis; its own end face; the skirting
  base course beneath it; packed lot dirt or gravel at its base; the carport
  post and awning; the next trailer in the row.
- NEVER BESIDE: house stucco on the same building; a hip roof (the run's
  default roof cap must NOT be used on this family — that is a renderer note as
  much as an art note); dead lawn (trailer pads are dirt or gravel).
- EDGE CONTRACT: SELF-SEAMLESS horizontally along the long side. The end face
  and the skirting are SINGLE PLACEMENT.

## D. WHEN (time & state — the invisible-caption inputs)
- ACT: 1
- BEST TIME: both. Thin aluminium is the most heat-reactive material in the
  game — worth noting for a future heat-shimmer pass, but no tile change.
- WEATHER STATES: sunny baseline; cloudy no change; rain no wet variant needed
  (metal sheds instantly), though the DIRT under it changes and that sells it.
- LIT/UNLIT variant needed? No self-lit variant. Trailer parks are exactly the
  kind of place CLUSTERED POWER says is DARK — 12% lit, and probably not here.
  That is a story point: this family is usually seen unlit.
- ANIMATION: static. (A loose awning panel moving in wind is tempting and is a
  separate ask if anyone wants it — leaf-pixel law would apply.)

## E. HOW (build spec — the art lane's one-shot recipe)
- EXACT SIZE in px: frozen starter tileset native cell, 1x1 tiles.
  IMPORTANT DIFFERENCE FROM EVERY OTHER BUILDING IN THE RUN: this family is
  **shorter**. The run's stack is 4 wall courses; a single-wide is one low
  storey and should read at roughly **2 courses + skirting**, so the art lane
  and the run lane must agree the stack override. Called out here so it is
  settled before pixels exist rather than after.
- VIEW: 45-degree world view, three-quarter face. Ribs run HORIZONTALLY (lap
  siding) — the opposite direction to TF-RUN-004's vertical ribs, and that
  contrast is the fastest way a player tells the two building families apart.
- PALETTE: constitution ceiling; STRUCTURE value band. Real single-wides are
  white, cream, or pale pastel with a contrasting stripe near the top — that
  STRIPE is the signature and is worth spending the palette on.
- LIGHT: the one global direction; horizontal ribs must agree with it. NO
  keyline. NO dither. (Regular rib pattern — declare it to the dither check.)
- SHADOWS: none baked. NOTE the one exception worth designing for: a mobile
  home sits on blocks, so there is a genuine dark gap under the skirt line —
  that reads as part of the tile's own form, not as a cast shadow.
- SCALE ANCHORS: the approved 2-tall door. A single-wide is 14-16ft wide and
  60-80ft long — so in tiles it is NARROW AND VERY LONG, which is the
  silhouette that makes the district read from the air.
- WEAR LEVEL: dead world, and this is the family that decays HARDEST — thin
  metal, no thermal mass, no maintenance. Hail dents, sun-crazed and peeling
  decal stripes, rust bleeding from the seam line and around the window
  frames, skirting panels missing or kicked in (the classic), one unit per row
  burned out per the approved dossier.
- VARIANTS: side face, end face, skirting (intact + missing panels), the
  burned-out colorway. 2-3 body colorways sharing the geometry.

## F. THE CAPTION (ships with the tile — machine-readable)
```json
{
  "id": "TF-RUN-006",
  "name": "mobile home skin",
  "layer": "structure",
  "solid": true,
  "enter": true,
  "district_families": ["trailer", "industrial-site-trailers", "boneyard", "quarry", "swapmeet"],
  "best_time": "usually seen UNLIT (clustered power says this family is dark)",
  "best_location": "staggered rows on packed dirt pads, long axis along the row, carport to one side",
  "place_next_to": ["mobile home skin", "trailer end face", "skirting", "packed lot dirt", "gravel / ballast ground", "carport post"],
  "never_next_to": ["house stucco on the same building", "hip roof cap", "dead lawn"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "self-seamless along the long side; single-placement end face and skirting",
  "anim": null,
  "tags": ["structure", "metal", "residential", "low-mass", "on-blocks", "burned-out-variant", "usually-dark"]
}
```

## G. REFERENCES (all three required)
- APPROVED ANCHOR: the 30 approved HOUSE SKINS (live in the run) — this is the
  DELIBERATE CONTRAST to them. Same residential job, opposite construction. If
  a player cannot instantly tell a trailer row from a suburb street at walk
  zoom, this asset failed. Value-matched to those skins; material and mass
  opposite.
- NAMED OUTSIDE REFERENCE: **Project Zomboid**'s trailers for the low, long,
  on-blocks top-down read. **My Summer Car** / **Kentucky Route Zero** for the
  cultural texture of an American single-wide as a home rather than a joke —
  which matters, because Bohemia's rule is that every design decision carries a
  life lesson without preaching, and a trailer park drawn with contempt would
  break that.
- REAL-WORLD GROUNDING: North Las Vegas and the Boulder Highway corridor are
  full of 1960s-80s single-wides on rented pads — steel chassis, aluminium lap
  siding, low-slope roof with a raised centre seam, set on concrete-block piers
  with vinyl or metal skirting, tied down against wind. In Mojave sun the
  aluminium skins chalk and the decal stripes craze and peel within a decade;
  the skirting is always the first thing to go (kicked in, blown off, stolen),
  which exposes the blocks and the dark under-gap. Swamp coolers on the roof
  are near-universal and are a signature silhouette. Fires are common and a
  burned single-wide collapses to its chassis and leaves the frame — which is
  exactly the "some burned out" the approved dossier already asks for.

## H. DON'T WANT (the anti-reference)
- NOT a small house. If it has a hip roof, masonry walls or a slab it has
  failed — those four wrongs are the entire defect this form kills.
- NOT an Airstream (no polished silver curves; this is a rectangular
  matte-painted box).
- NOT a comedy trailer. No cartoon squalor, no gag props. See the reference
  note above: this is somebody's home.
- NOT rust-belt rotted — Vegas chalks and crazes, it does not rot through.
- NOT tall. Height is the tell; a 4-course trailer is a failed trailer.
- NOT vertical ribs (that is TF-RUN-004; the direction contrast is load-bearing
  for telling the two families apart).

## I. ACCEPTANCE (what the machine proves BEFORE Paolo ever sees it)
- [ ] SILHOUETTE TEST: a trailer row and a suburb street, side by side at walk
      zoom — instantly distinguishable, or the asset failed
- [ ] Height verified: reads as one low storey + skirting, not the 4-course
      stack; the stack override is agreed with the run lane BEFORE cooking
- [ ] Horizontal seam measured along a 10-tile row; no edge darkening
- [ ] Palette ceiling + STRUCTURE value band + one-light checks green; rib
      pattern declared to the dither check
- [ ] Rib direction is HORIZONTAL and visibly opposite to TF-RUN-004
- [ ] 3x3 tiled proof + a full single-wide proof (one whole trailer, end to end)
- [ ] ON THE REAL SURFACE: screenshot of the trailer district wearing it,
      beside the current house-stucco render, and beside an approved suburb
      house for the contrast test
- [ ] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: COVERED BY MERGED COOK 8/9/26: the swarm's dedup merged this form into TF-ART-013's job (this form is a declared consumer). Candidates: banks/tileforms/TF-ART-013_CANDIDATES_8_8_26.json, judge: the ART tab, TILE BOARD. APPROVED 8/11/26 with its covering bank (TILE BOARD verdict). | REQUESTED BY: RUN lane (0b district-material survey, 7/28)
  | DATE: 7/28/26 | PRIORITY: MED
- BOARD ROW #: 13 | VERDICT: —
