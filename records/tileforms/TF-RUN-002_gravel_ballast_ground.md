# TILE FORM TF-RUN-002 — GRAVEL / BALLAST GROUND

## A. IDENTITY
- NAME (plain words a person would say): Gravel yard — the crushed-rock ground
  every fenced utility lot and rail siding in Vegas is floored with
- FAMILY/SET: GRAVEL GROUND family — fine crushed-rock base + coarse rail
  ballast variant + the gravel-to-desert and gravel-to-concrete blob edges
  (one drawing job, one form)
- THE JOB, ONE SENTENCE: this tile exists so that the five district types whose
  floor is crushed rock stop wearing the CBB tileset's single `dirt` square and
  read as the graded, weed-free, deliberately-laid gravel that says *somebody
  built this and maintained it until the day they left*.

## B. WHY (the need — no ruling, no tile)
- DEMANDED BY: RUN backlog 0b (DISTRICT ART, the lane's top gap: "the other
  districts are WALKABLE but wear a generic material pass"), and the 7/28
  district-is-its-own-landmark law. Measured this turn by walking all 75
  district types on the real run surface (survey in
  records/BOHEMIA_RUN_DISTRICT_MATERIAL_SURVEY_7_28_26.md).
- WHAT LOOKS BROKEN TODAY WITHOUT IT: the world model NAMES this ground and the
  run cannot draw it. Per cell, sampled: solar `gravel access road` ×1150,
  substation `gravel yard` ×924, battery `gravel yard` ×891, railyard
  `ballast / gravel` ×739, swapmeet `gravel parking / drive` ×398. Every one of
  those renders as the single starter tile `dirt`. So a solar farm's access
  roads, a substation's yard and a railyard's ballast are all the same square of
  brown, and none of them reads as gravel at all.
- SHOPPING CHECK (records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md):
  - SEAM-FIXED SURFACES (605 tiles, flagged ZERO consumers) — opened and the
    pack list counted: `2. Dirt path` 46, `1. Cracked contrete` 42, `3. Grass
    and ground` 42, `1. Metal floor` 36, `1. Water` 36, `5. Roof` 36, `8. Burned
    Ground` 36, `1. Cobblestone floor` 35, `1. Cracked street` 34, `2. Soil and
    dirt` 24, `3. Stone paths` 19 … **there is no gravel or ballast pack in it.**
    Dirt path and soil are smooth graded earth, not crushed angular rock;
    cobblestone and stone paths are laid pavers, a different thing entirely.
  - DESERT/TERRAIN pools — `desert`, `rock`, `scorch`. `rock` is 1 tile of rock
    LAG (natural desert pavement), not machine-crushed aggregate, and the whole
    ground half of that bank is MEASURED broken anyway
    (records/BOHEMIA_DESERT_POOL_SEAM_FINDING_7_28_26.md).
  - STREET_POOLS_HARMONIZED — `street`/`side`/`lane_div`/`median`/`cross` plus
    stall lines. All asphalt roadway and its markings. No gravel.
  - Nothing in the index claims crushed rock. This is a genuine hole.

## C. WHERE (place — the game code reads this)
- SURFACE + TAB: RUN (the walk) primarily; CITY human-mode ground plane reads
  the same material. Map zoom: flat colour only, no icon.
- DISTRICT FAMILIES: solar, substation, battery, railyard, swapmeet, boneyard
  drive lanes, storage drive aisles, industrial yards — the whole "fenced
  utility lot" family. Also the LANDMARK ACCESS SPURS the overmap carves.
- LAYER: ground
- SOLID? no — ENTERABLE? n/a (it is the floor)
- MUST SIT BESIDE: itself endlessly; desert ground (TF-RUN-001) via the blob
  edge; cracked concrete pads; asphalt drive; chain-link fence line
  (TF-RUN-003) — gravel is what is INSIDE the fence.
- NEVER BESIDE: interior floors (the exterior-tile-indoors bug is a named Paolo
  complaint); dead lawn (gravel replaced the lawn, they do not interleave);
  anything green.
- EDGE CONTRACT: SELF-SEAMLESS for the two base tiles (wrap all 4 edges) +
  BLOB-47 for gravel-to-desert. Every touching edge MEASURED per the acceptance
  block — interior-vs-edge value delta and wrap discontinuity against the ~9
  normal-neighbour step established by the 7/28 seam finding.

## D. WHEN (time & state — the invisible-caption inputs)
- ACT: 1
- BEST TIME: both. At night it only darkens under the ambient pass — gravel has
  no self-light. NOTE: substations and solar farms are exactly where CLUSTERED
  POWER says light lives, so this ground will often sit UNDER someone else's
  lamp; it must not fight that light, it must receive it.
- WEATHER STATES: sunny baseline; cloudy needs no change. RAIN-WET matters more
  here than on desert: crushed rock goes noticeably darker and the fines
  between stones hold water, so a wet colorway is wanted — same geometry, value
  shift only (a colorway, not a new shape, per STRUCTURE-NOT-COLOR).
- LIT/UNLIT variant needed? No self-lit variant. LIGHT=TERRITORY: whoever owns
  the substation owns the lamp above it; the ground is only a receiver.
- ANIMATION: static.

## E. HOW (build spec — the art lane's one-shot recipe)
- EXACT SIZE in px: one tile = the frozen starter tileset's native cell (author
  at that native size so the run and the CITY's 22px blit both consume it with
  no resample — the resample-at-author-time mistake is what manufactured the
  desert pool's grid). Footprint 1x1 tile.
- VIEW: 45-degree world view. Ground plane, sky-lit top. Individual stones get
  the ellipse cross-section treatment where they read at all — never a side-on
  pebble.
- PALETTE: constitution ceiling; GROUND value band (ground sits UNDER structure
  values so building fronts pop).
- LIGHT: the one global direction. NO keyline — the measured desert failure was
  a keyline by accident and it is the kill condition here too. NO dither.
- SHADOWS: none baked. Individual stones may imply micro-shadow within the
  texture but nothing that reads as a cast shadow.
- SCALE ANCHORS: individual stones 20-40mm (railroad ballast is 1.5-2.5 inch
  angular rock; yard gravel is smaller, roughly pea-to-thumbnail). At our tile
  scale that means TEXTURE, not drawn individual rocks — if a person can count
  the stones they are too big.
- WEAR LEVEL: this is the one ground in the game that is NOT eroded to nothing.
  Gravel yards are laid deep specifically to stop plant growth, and they keep
  working for years after abandonment — that is the story point. A few weeds in
  the wheel ruts only; the surface itself is intact, just dusty and sun-bleached.
- VARIANTS: (1) fine yard gravel, (2) coarse rail ballast, (3) wet colorway of
  each. Anything with a different silhouette is a new form.

## F. THE CAPTION (ships with the tile — machine-readable)
```json
{
  "id": "TF-RUN-002",
  "name": "gravel / ballast ground",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["solar", "substation", "battery", "railyard", "swapmeet", "boneyard", "storage", "industrial", "access-spurs"],
  "best_time": "any",
  "best_location": "inside a fenced utility lot, along rail sidings, and on any graded access road the overmap carves",
  "place_next_to": ["gravel / ballast ground", "desert ground", "cracked concrete pad", "asphalt drive", "chain-link fence"],
  "never_next_to": ["interior floors", "dead lawn", "green grass"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "self-seamless + blob-47 to desert",
  "anim": null,
  "tags": ["ground", "gravel", "ballast", "utility", "fenced-lot", "receives-light"]
}
```

## G. REFERENCES (all three required)
- APPROVED ANCHOR: the frozen CBB starter tileset's `dirt` and `concrete_0/1`
  (banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt) — this new ground must sit
  BETWEEN them in value and grain: coarser than dirt, looser than concrete.
  Those two tiles are the neighbours it will most often touch.
- NAMED OUTSIDE REFERENCE: **Factorio**'s stone/gravel path for the read of a
  deliberately-laid industrial floor that stays quiet under busy machinery —
  the specific thing to take is that it is BUSY UP CLOSE AND SILENT AT
  DISTANCE. Also **Project Zomboid**'s gravel car parks for how gravel meets
  asphalt at a soft, irregular boundary rather than a drawn line.
- REAL-WORLD GROUNDING: Southern Nevada utility yards are floored in crushed
  caliche/limestone aggregate from the local pits (Lone Mountain, Sloan) — it
  reads PALE GREY-TAN, not brown, because it is limestone dust, and it is
  laid over compacted subgrade specifically as a weed barrier and a fire break
  (a substation cannot have vegetation in it). Railroad ballast on the UP line
  through Vegas is coarser, more angular, darker grey granite trucked in.
  After years without maintenance: the fines wash into the low spots and leave
  the stones proud, wheel ruts hold the only weeds, and the whole surface goes
  chalky pale from UV. It does NOT go green and it does NOT disappear.

## H. DON'T WANT (the anti-reference)
- NOT the desert-pool failure: no edge darkening of any kind. A visible grid is
  the kill condition (records/BOHEMIA_DESERT_POOL_SEAM_FINDING_7_28_26.md).
- NOT drawn stone-by-stone. Countable pebbles at walk zoom read as a cartoon
  crumb pattern and will strobe when tiled. This is a TEXTURE.
- NOT brown. Local aggregate is limestone — pale grey-tan. Brown gravel reads
  as mud.
- NOT overgrown. Weeds belong in the wheel ruts and nowhere else; a gravel yard
  that has gone to meadow contradicts why gravel is there.
- NOT wet-looking by default (the wet state is its own colorway).
- NOT noisy: this floor sits under transformers, panels and boxcars that must
  pop off it. A busy floor is a failed floor.

## I. ACCEPTANCE (what the machine proves BEFORE Paolo ever sees it)
- [ ] Seam measured: interior-vs-edge delta within the ~9 normal neighbour
      step, wrap discontinuity ~1x. The 7/28 finding's numbers are the ruler.
- [ ] Palette ceiling + GROUND value band + one-light checks green
- [ ] Sits between `dirt` and `concrete_0` in measured mean value (it is the
      middle of that trio or it will not read as a distinct material)
- [ ] 3x3 tiled proof sheet + a 10x10 boredom check (no visible repeat motif)
- [ ] ON THE REAL SURFACE: screenshot of a substation or solar cell wearing it,
      beside the current all-`dirt` render for contrast
- [ ] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: RUN lane (0b district-material survey, 7/28)
  | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 9 | VERDICT: —
