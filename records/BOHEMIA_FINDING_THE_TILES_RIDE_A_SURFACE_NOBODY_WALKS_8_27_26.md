# THE TILES RIDE A SURFACE NOBODY WALKS (8/27/26, ART lane — measured, not guessed)

## THE FINDING, ONE SENTENCE
Every exterior tile family the ART lane has wired since 8/8 — thirty-two
families, TF-ART-001 through TF-ART-032 — draws only in
slices/BOHEMIA_RUN_CURRENT.html, and since 8/21 the alpha never even
DOWNLOADS that file, so the player has never met a single one of them on
the surface they actually walk.

## THE EVIDENCE, IN PLACE
1. The backlog banner (coordinator, 8/14): "THE CITY WORLD IS THE WALKED
   SURFACE; slices/BOHEMIA_RUN_CURRENT.html IS LEGACY... NO LANE SHIPS
   NEW PLAYER-FACING WIRING INTO THE RUN SLICE."
2. The alpha's own comment at the run-tab loader (8/21): "17.8 MB fetched
   on EVERY visit for a panel the shell never displays... nothing in the
   product calls this" — the iframe's src is never set; only four gates
   ask for the frame by name.
3. Measured 8/27: slices/BOHEMIA_CITY_WORLD.html contains ZERO of the
   named-cell branches ('waste fill', 'exposed lakebed', 'rolling stock',
   'valve / hatch'...) and zero tileform pieces (wf_0, boxcar_0, bed_0).
   Its human-mode renderer bakes 16x16 chunk canvases from its OWN cell
   model (realizeCell / cellAt at FN=32 per district tile) and its OWN
   street pool (SA_TILES) — a parallel art pipeline.
4. The sound, combat and payday wiring ALREADY MIGRATED (named in the
   8/21 comment). The exterior tile pass never did, and no backlog row
   routes it.

## WHY NOBODY SAW IT
This is the 7/21 colorful-clothes failure class, the one the handoff
itself warns about: "THE MATERIAL EXISTED AND NEVER REACHED THE PLAYER...
WHEN HE ASKS FOR SOMETHING, CHECK LATER THAT IT ACTUALLY GOT WORN."
Every family was verified ON the run slice (honestly — the pixels are
real and the branches work), every record said "TAB: RUN", and the run
tab silently became a window onto the CITY in the 8/14-8/21 window. A
verification that opens the file directly cannot see that the product
stopped opening it. The 8/25 playtest dispatch ("the city is dead",
"the streets look like dog shit") was him walking the CITY surface —
where none of this work exists.

## WHAT IS NOT LOST
- Nothing. The banks are approved and banked, the cooks are REUSE-CHECK
  clean, the forms are full contract, and the run slice remains exactly
  what the coordinator called it: THE HARVEST SOURCE. The named-cell
  pass is a complete, verified specification of what every named cell
  should look like.
- The ICONS are unaffected — the hero wire goes into the CITY page and
  ships on the walked surface today.
- Interior FLOORS are unaffected — the interiors work loads into the
  walked page (see main commit ad42288, which also proves the walked
  page accepts ART-lane data lines and that the chunker now carries
  foreign tags forward).

## THE ROAD, AND WHO OWNS WHAT
The walked page has a managed __TILE_BANK__ region (chunker:
tools/bohemia_city_chunk_tile_bank.py) and a chunk baker (chunkCanvas)
that resolves cells at FN=32. The migration is therefore NOT a copy-
paste: the run slice names cells on a 96-grid per district (NAMEG); the
walked world realizes 32 cells per district tile. Migrating a family
means teaching the walked cell model to carry the name (or a
downsampled name grid) and the chunk baker to consult the tileform
pieces. That touches the CITY/WORLD lane's core machine, so it is a
coordinated project, not a solo evening: the pattern set by sound/
combat/payday is each lane migrates ITS OWN wiring, and the chunker
now protects foreign tags, so the seam exists.

## ROUTED
- BOARD ROW 107 (OPEN, HIGH): THE GREAT TILE MIGRATION — port the
  named-cell exterior pass to the walked city surface, family by
  family, biggest read first (fills, plazas, decks before 1-cell
  accents), payload-budgeted (the walked page is the demo's time-to-
  play surface; the LATE ART gate's chunk budget governs).
- Flagged for the COORDINATOR: the 8/14 banner needs an explicit row
  for this (none exists — searched 8/27), and the seam between the
  ART pass and the CITY cell model is a two-lane design decision.
- Until migrated, no new exterior family gets cooked for the run slice
  alone: MEASURE ON THE WALKED SURFACE FIRST is the new first step of
  the family pipeline (this document is that rule's reason).
