# BOHEMIA — MISC PILE SPLIT PROPOSAL INTEGRATION (7/10/26)

## What this is
The named outstanding graphics job (START HERE doc): the alpha's 2,845-tile
'misc' category, every tile now has a PROPOSED real category. Method: each misc
tile matched by visual features against prototypes built from the 23 real
categories already in TP_TILES. Zero tiles below 0.5 confidence.

## File
`BOHEMIA_MISC_SPLIT_PROPOSAL_7_10_26.txt` — JSON:
`assignments: {miscIdx: [proposedCategory, confidence]}` + counts.

## HOW THE CODE ACCEPTS IT
1. The alpha's tile block is `TP_TILES` (24 categories incl. misc) + `TP_TYPE`
   inside the CITY module. The proposal maps misc INDEX -> target category.
2. Apply pattern (alpha-owning session): on load, read the proposal file; for
   each accepted assignment, move `TP_TILES.misc[idx]` into
   `TP_TILES[target]` and record the move so saves/judging stay consistent.
3. JUDGING FLOW (Paolo's law: he overrides): surface the proposal in the tile
   judging menu as a pre-filled suggestion per misc tile — accept-all per
   category, or per-tile override. NOTHING moves without his verdict export.
4. Sort judging by ascending confidence so Paolo's eye hits the shakiest
   guesses first.

## Proposed distribution (2,845 total)
sign 260, furniture 250, container 191, industrial 179, light 164, monument 160,
door 156, trash 155, fence 138, roof 128, window 126, weapon 124, rubble 124,
foliage 106, wall 106, gore 97, vehicle 87, concrete 77, street 60, grass 46,
dirt 45, burnt 39, hazard 27.

## LAW COMPLIANCE
- One-alpha law: this chat ships the DATA; the alpha-owning session applies it.
- Paolo's judging is the only authority that finalizes any move.
