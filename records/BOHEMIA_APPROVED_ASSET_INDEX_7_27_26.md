# BOHEMIA — THE APPROVED ASSET INDEX (the ONE shopping catalog, 7/27/26)
# Built by the coordinator from a full cross-reference of every verdict file
# against every bank. THE SHOPPING LAW (extends APPROVED-ASSETS-FIRST): any
# session about to draw/cook/place ANY visual thing checks THIS FILE FIRST.
# "I didn't know it existed" is no longer possible. If an entry here covers
# your need, you USE it. Cooking a substitute for an indexed asset is a
# violation. Regeneration of this index is a SHARED backlog item (make it
# machine-generated + gated).

## THE APPROVED CORPUS — what Paolo thumbed UP and where the pixels live
| WHAT | COUNT | PIXELS LIVE IN (banks/) | VERDICT SOURCE | CONSUMED BY |
|---|---|---|---|---|
| SUBURB BORDER/PERIMETER WALLS | 13 keys x2 variants (tan+original) = 26 entries | BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt | WALL_PICKS_7_14 (W26-W37) + WALL_PICKS_BATCH2 7/17 (WB4 "PERIMETER") | CITY yes (perimeterwall_patch, gated). RUN: **NO — gap, now routed** |
| HD PACK ($20) JUDGED TILES | 1,927 UP of 2,604 judged, 87 packs | BOHEMIA_HD_TILE_REPO_part1-4 keyed (pack,idx); UP list = BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt | the Great Sweep masters | via extraction pools below |
| INTERIOR POOL (from the sweep) | 465 UP-only tiles, 12 room buckets | BOHEMIA_INTERIOR_POOL_7_26_26.txt | Great Sweep crossing 7/26 | RUN + interiors: INTEGRATED |
| DESERT/TERRAIN | 13 terrain picks + desert/rock/rubble pools | BOHEMIA_TERRAIN_PICKS_7_14_26 + BOHEMIA_DESERT_POOLS_7_18_26 | terrain picker + certified seams | bake + target factories (not run) |
| HOUSE SKINS | 30/30 UP (roofs/walls/windows/boarded/doors/yards) | BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt | HOUSE_SKIN_VERDICT 7/21 | 9 consumers + **RUN: DRAWING since 7/28** (loaded-and-never-drawn until then) |
| DOOR CLIPS | 30 clips (10 residential, 2 tiles tall) + E/W edges | BOHEMIA_DOOR_ANIM_BANK_7_13_26 + DOOR_EW_BANK | DOOR_V3 + DEMO verdicts | RUN + interiors: INTEGRATED |
| ROAD MARKINGS/ARROWS | 84 items, 14 classes ("I like all of them") | BOHEMIA_MARKING_BANK_7_17_26.txt | MARKING_VERDICTS 7/17 | factories ONLY — no live surface, now routed |
| STREET BLOCKS | 5 researched lanes + street pools | BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt | REAL_VEGAS R2 | CITY: wired (streetart patch) |
| LAMPS (dark variants) | 7 | BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt | blessed lamp family sweep | CITY: wired |
| FIRE/PARTICLE LOOPS | 5 fx + 5 campfire/cookfire clips (34 loops banked) | BOHEMIA_FIRE_FLICKER_BANK_7_13_26 + PARTICLE_LOOP_BANK | PARTICLE + ANIM_COOK verdicts | **ZERO consumers — now routed to the mobile-base camp** |
| GORE OVERLAYS | 20 UP (red legal here) | BOHEMIA_GORE_OVERLAY_BANK_7_10_26.txt | Great Sweep blood packs | none — story-placed by Paolo, hold |
| SEAM-FIXED SURFACES | full act-1 seam audit set | BOHEMIA_SEAM_FIXED_SURFACES_7_14_26 + ALPHA_SURFACE_UPGRADES | seam pipeline validated | **ZERO consumers — flagged** |
| STARTER TILESET (the frozen target) | 42 tiles, CBB | BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt | TARGET_SCREEN_VERDICT | RUN: INTEGRATED, md5-locked |
| SUBURB LAYOUT | THE BLOCK = canonical; cul-de-sacs UP | engine/bohemia_suburb.js | SUBURB_VERDICTs 7/18 | RUN: INTEGRATED |
| WARDROBE | 195 canon items | BOHEMIA_WARDROBE_CANON_7_19_26.txt | wardrobe verdicts | cast bridge: INTEGRATED |

## DEAD / RESERVED / NOT-APPROVED (do not confuse with the corpus)
- ~206 HD packs (~6,070 tiles) never judged = PRESUMED DISMISSED (7/26 law).
  Mostly off-genre (sci-fi/fantasy/winter/occult).
- 47 wall candidates = rejected FOR PERIMETER, reserved for ACT 3 by Paolo.
- Tier-3 self-declared UNJUDGED banks (~30MB) = presumed dismissed; archive-
  repo candidates for the next slim.
- THE INVERSION (flagged loudly): DISTRICT_HERO_CANDIDATES v7 and
  TRAFFIC_SIGNAL_CANDIDATES are UNJUDGED yet carry more plumbing than most
  approved banks (heroes are LIVE on the city map). Both need Paolo's thumb
  or their wiring outranks his approvals — surfaced in JUDGE THIS.

## MACHINE ROUTING (added 7/28 by the NEVER DRIFT law — do not hand-edit loosely)
The table above is for humans. This block is for `gates/banks_used_gate.js`,
which proves every RUN claim below actually draws pixels on the real render
path. A row that claims a consumer it does not have is a lie in the one document
every session is required to trust, so it is now a gate failure rather than a
paragraph. Format: `SURFACE | bank label | claim` where claim is DRAWS (must be
counted drawing) or DEBT (approved, no live consumer, must be named in the
backlog).

```routing
RUN | the CBB target tileset (42) | DRAWS
RUN | the cooked perimeter wall (8/2, 54 tiles) | DRAWS
RUN | suburb border walls (13, approved 7/28) | DEBT
RUN | animated door bank (7/13, 2 tiles tall) | DRAWS
RUN | interior pool (Great Sweep UP) | DRAWS
RUN | house skins (7/21 UP - roof + wall + yard) | DEBT
RUN | walk-file door art (superseded) | DEBT
```

NOTE 8/2: his 13 suburb border walls moved DRAWS -> DEBT, and it is the same
move for the same reason as the house skins below. They are HIS - 61 candidates
judged down to 13 across 7/14 and 7/17 - so this is not approved art quietly
falling out of the build. It is newest-date-wins between two sets, on a MEASURED
difference: his walls sit at edge 5.8 / grain 20.0% against a tolerance floor of
14.27 / 54.8 derived from the tiles he BOUGHT, which is a third of the local
contrast of the ground the wall stands on. The pool STAYS LOADED on purpose: it
is the one-line revert, and one word from him puts it back. It was also FIXED
while it was being displaced - WB4, the one he kept out of 48, is stored as a 3x
tiling preview and the renderer was crushing the whole sheet into a single cell.
PENDING PAOLO. Judge anchor: records/target/PERIMETER_VS_HIS.png.

NOTE 8/1: the 7/21 house skins moved DRAWS -> DEBT because Paolo approved the
TEXTURE-MATCH set twice that day and the wall/roof field draws that instead
(banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt, 114 tiles). Newest-date-wins between two
sets he approved, on a measured difference: the 7/21 skins are 81 colours per tile
at edge 9.4; his own bought ground art is 1443 at 20.9. They stay loaded as the
fallback. The YARD in that bank is superseded too - the yard wears his BOUGHT dirt
since 7/31. Waiver and reasoning: gates/banks_used_gate.js, backlog 0T.

