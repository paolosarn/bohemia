# BOHEMIA ADDENDUM: NEIGHBORHOOD CELL SIZE, COMPARATIVE RESEARCH (7/6/26)

Paolo challenged the 512-fine neighborhood cell locked earlier today ("i just
dont know if you have it correct"). Researched how comparable games solved
overmap-to-walkable-local scale. The 512 was an engineering-clean pick, not a
researched one. Research says it is TOO BIG for on-foot-first.

## THE COMPARABLES
- PROJECT ZOMBOID (closest architecture to Bohemia: continuous streamed world,
  top-down survival): 1 cell = 300x300 tiles at 1m/tile (B41); Build 42 moved
  to 256x256 tiles per cell in 32x32 chunks. Cells are HAND-AUTHORED dense.
  At this near-1:1 scale the game needed vehicles; on-foot cross-map travel
  is a known slog.
- CDDA: 24m overmap tiles (the law we revoked). Buildings span many tiles;
  "neighborhood" is not a unit there. Also has vehicles.
- GTA V: real Hollywood ~1.5x the size of the ENTIRE Los Santos; Sunset Blvd
  is longer than the whole map. ~1:3 to 1:4 linear compression of LA into a
  ~6 mile map, and it still READS as all of Los Angeles. Distance compression
  is the standard open-world technique and players do not notice in play.
- STARDEW VALLEY: Pelican Town, an entire living town (all shops, ~12
  households, square, river), is 13,200 tiles total, ~120 tiles across.
  Pixel-density king: zero dead space, every screen has content.

## THE LESSON
Every large-but-fun game compresses reality 1:2 to 1:8. The near-1:1 games
(PZ, CDDA) all have vehicles. Procedural content makes true scale WORSE than
hand-authored (repetition shows). A "housing neighborhood" cell should hold
8-12 houses that READ as a neighborhood at Stardew density, not 60 houses at
boring true scale.

## THE THREE HONEST SIZES (CHUNK=16 stays, CELL_M=0.75 stays)
| fine/cell | meters | chunks    | valley span | walk 1 cell | cross valley (walk/run) |
| 512       | 384m   | 32x32     | 22.9 mi     | 4.3 min     | 6.8h / 3.4h  |
| 256       | 192m   | 16x16     | 11.5 mi     | 2.1 min     | 3.4h / 1.7h  |
| 128       | 96m    | 8x8       | 5.7 mi      | ~64 sec     | 1.7h / 51min |

- 512 = true scale. PZ-plus. Only viable with player vehicles.
- 256 = PZ B42's exact cell tile count, ~1:2 compression. Viable with OR
  without vehicles, leans long on foot.
- 128 = one neighborhood is one Pelican-Town-width of content; whole valley =
  Los Santos scale (GTA's proven "reads as a whole city" number). The
  large-but-fun sweet spot for ON-FOOT-FIRST.

All three keep: whole-valley overmap, cell = neighborhood abstraction law,
continuous walk law, mile grid (arterial spacing just changes: ~4 cells at
512, ~8 at 256, ~17 at 128 per mile... note at 128 the "mile grid" is better
expressed as ARTERIALS EVERY N CELLS chosen for readability, since compressed
worlds keep the GRID READ, not the literal mile).

## RECOMMENDATION
- If on-foot is the only player movement: 128.
- If player vehicles are coming (cars/bikes/transit): 256.
- 512 only if Paolo wants true-scale pilgrimage as a core fantasy AND vehicles.

## STATUS
[PENDING, Paolo's call: 128 vs 256 vs keep 512. Depends on the open vehicle
fork. TILE_FINE=512 in bohemia_overmap.js stands until relocked.]
