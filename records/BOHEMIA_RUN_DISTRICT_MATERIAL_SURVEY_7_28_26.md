# THE RUN'S DISTRICT MATERIAL SURVEY — what 75 district types actually render (7/28/26)

The evidence behind tile forms TF-RUN-002 … TF-RUN-007. Not opinion: this is a
probe that loads one real cell of every district type in the valley on the real
run surface and records what the renderer would actually lay on every third
tile, alongside the name the WORLD MODEL gives that tile.

Method: `WORLD.at()` sweep for one sample cell per district type → `loadCell()`
→ for every 3rd tile, record `NAMEG` (the world's own name) and the tile id
`bodyTile`/`groundTile`/`genericTile` returns. 75 types.

---

## FINDING 1 — 38 OF 75 DISTRICT TYPES RENDER AS EXACTLY THREE TILES

airbase, airport, arsenal, arterial, ballpark, basin, campus, casino,
convention, dam, datafort, desert, fort, freeway, granary, gypsum, highroller,
intake, interchange, luxor, minigp, mountain, prison, pumpstation, quarry,
radio, rail, reclaim, reservoir, resort, sign, speedway, sphere, springs, strat,
strip, town, water.

Every one of them: `yard_0 ×688, yard_1 ×584, yard_2 ×577`, and ONE tile name
for all 1,849 sampled tiles — **"(reserved landmark ground)"**.

**This is not a tile gap and no form is filed for it.** The world model has no
cell-level generator for these types yet, so there is nothing to draw. It is a
WORLD-lane content gap and it is recorded here so the art lane does not get
asked for a casino tileset for a casino that does not generate. Note that
`arterial`, `freeway`, `desert`, `mountain`, `water` and `rail` are TERRAIN,
not landmarks, and their absence here echoes the ONE MAP finding that nine
generators were once missing from a build's module list — worth the WORLD lane
confirming they are present in the run's inlined set.

## FINDING 2 — THE DISTRICTS THAT DO GENERATE SPEAK A VOCABULARY THE RUN CANNOT DRAW

The world model names materials precisely. The run has ~8 tile ids to answer
with. Sampled counts per single cell:

| the world says | count | the run draws | form |
|---|---|---|---|
| solar `gravel access road` | 1150 | `dirt` | TF-RUN-002 |
| substation `gravel yard` | 924 | `dirt` | TF-RUN-002 |
| battery `gravel yard` | 891 | `dirt` | TF-RUN-002 |
| railyard `ballast / gravel` | 739 | `dirt` | TF-RUN-002 |
| swapmeet `gravel parking / drive` | 398 | `dirt` | TF-RUN-002 |
| downtown `podium / mid-rise` | 882 | `wall_0/1/2` stucco | TF-RUN-005 |
| library `building (library)` | 682 | `wall_0/1/2` stucco | TF-RUN-005 |
| courthouse `building (courthouse)` | 651 | `wall_0/1/2` stucco | TF-RUN-005 |
| jail `building (cell block/admin)` | 424 | `wall_0/1/2` stucco | TF-RUN-005 |
| industrial `warehouse` | 416 | `wall_0/1/2` stucco | TF-RUN-004 |
| trailer `mobile home` | 395 | stucco + hip roof | TF-RUN-006 |
| solar `solar panel` | 354 | `wall_0/1/2` stucco | TF-RUN-007 |
| storage `storage-unit building` | 333 | `wall_0/1/2` stucco | TF-RUN-004 |
| warehouse `tenant unit` | 267 | `wall_0/1/2` stucco | TF-RUN-004 |
| every "fenced"/"double-fenced" dossier | — | `wall_base` | TF-RUN-003 |

The pattern: **the run answers every structure with suburban house stucco and
every loose ground with one `dirt` square.** A courthouse, a cell block, a
self-storage unit and Paolo's own living room are the same wall.

---

## THE SHOPPING CHECK, AND WHAT IT KILLED

Required by APPROVED-ASSETS-FIRST and the form law. Several candidate forms
died here, which is the process working — these are now WIRING jobs for the RUN
lane, not art asks, and they belong in the backlog:

| candidate form | killed by | so it becomes |
|---|---|---|
| parking-lot asphalt + stall lines | STREET_POOLS_HARMONIZED: `stall_line_v` 18, `stall_line_h` 18, pocket lines, two-way-left-turn sets, **and a Paolo-blessed `parking_geometry_law`** (stall every 3rd tile, shared dividers, row depth 4, aisle 4) | WIRING: the run draws no markings at all while an approved bank with his own geometry ruling sits unused |
| concrete hardstand / secure yard | SEAM-FIXED SURFACES `1. Cracked contrete tiles` ×42 — opened and rendered; genuinely usable cracked concrete paving | WIRING |
| packed dirt / lot dirt | SEAM-FIXED SURFACES `2. Dirt path` ×46 + `2. Soil and dirt` ×24 | WIRING |
| road surface | STREET_POOLS `street` 18 / `side` 36 + `1. Cracked street` ×34 | WIRING |
| desert ground | already TF-RUN-001 (board row 4) | — |
| dead lawn / fairway / rough | already board row 5 (DEAD FOLIAGE) | — |

**I looked at the near-misses rather than trusting the pack names.** Rendered
and inspected this turn: `Wall tiles (1)` (20) and `3. Broken wall tiles` (18)
are **medieval stone masonry and ruined battlements, one with a torch sconce**;
`1. Metal floor tiles` (36) and `2. Rusted metal floor tiles` (10) are **sci-fi
riveted deck plating and diamond-plate grating**. All four are off-genre and
horizontal, exactly as the index's own DEAD/RESERVED note predicts. They do not
cover any exterior wall ask.

## WHAT SURVIVED — the six forms filed

TF-RUN-002 gravel/ballast ground · TF-RUN-003 chain-link fence + razor wire ·
TF-RUN-004 corrugated metal building skin · TF-RUN-005 tilt-up concrete skin ·
TF-RUN-006 mobile home skin · TF-RUN-007 solar panel array.

Three of them (003, 004, 006) exist because the run has **one wall material**
and the valley needs at least four. One of them (003) is not only an art gap but
a RENDERING CAPABILITY gap: the run has no see-through structure at all, and
that contract is declared in the form so the art lane and the run lane agree it
before pixels exist.

## STILL IDENTIFIED, NOT YET FORMED (next batch, evidence preserved)

Named by the world model, drawn as stucco today, and not covered by anything
approved. Listed so nothing is lost; each needs its own researched form:
`transformer` (substation ×168), `battery container` (×368),
`rolling stock (boxcar)` (railyard ×275), `headstone` (cemetery ×330),
`parked trailer` (industrial ×227), `screen tower` (drive-in ×93),
`crop rows` + `field soil` (farm ×159/×1100), `waste fill` (landfill ×351),
`drained wave pool` (waterpark ×239), `seating / stands (the bowl)`
(stadium ×282), `channel invert` (wash ×381),
`aeration / filter basin` (watertreat ×208).

## THE LESSON, FOR THE NEXT LANE THAT DOES THIS

Do not read the index's pack NAMES and assume coverage. "Metal floor tiles"
sounds like it could clad a warehouse and is actually sci-fi deck plating;
"Wall tiles" sounds universal and is a dungeon. Four of my candidate forms died
to an approved bank I had to open, and two more survived only because I opened
the near-miss and looked at it. Opening the bank is the shopping check; reading
its filename is not.
