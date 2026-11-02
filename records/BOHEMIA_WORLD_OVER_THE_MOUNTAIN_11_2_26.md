# WORLD 11/2 round 3: OVER THE MOUNTAIN, SLOWLY (ask line 288; BUILD 11/3t)

His words (Paolo 11/2, through the coordinator's trigger): 'I should be able to walk over the mountains, right? You have it like an
impenetrable wall, I have to walk around the whole city just to get across the mountains... that's how Battle Brothers does it, any
time there's difficult terrain you're just slower to walk across.'

## WHAT IT WAS (measured on the demo, phone, from the same road block, 64,78)
- The party could stand only on a road, a wash, or a wall a fallen boss brought down (__HIS_MAP__). The valley's mountain rim and all
  its open ground were walls; out on the region the peaks were pass code 3, 'cannot be crossed', like the lake.
- Trips west across the Spring Mountains went round by the roads: Pahrump 182 blocks, 20 h on the clock (173 as the crow flies);
  Mt Charleston Lodge 140 blocks, 14 h (94 as the crow flies); Indian Springs 183 blocks, 16.5 h.
- A tap's route inside the valley was a breadth-first search: the fewest blocks, blind to the going.
- Battle Brothers (reference/library/battle_brothers/01_WORLDMAP.md): roads fastest, then plains, then forest and hills slower, swamp
  slowest; its MOUNTAINS ARE IMPASSABLE. His call makes ours what Battle Brothers' hills and swamp are: slow, never a wall. The
  library gives the order, not the numbers; the numbers below keep the order and the 10/9 road ruling.

## NOW (__OVER_THE_MOUNTAIN__)
- ONE TABLE, TERRAIN_GOING (slices/BOHEMIA_CITY_WORLD.html), minutes a block against open ground: a road 0.5 (PAVED_SPEED, 10/9),
  open ground and a wash 1, rubble (a quarry, a landfill, the boneyard, the gypsum pits) 1.8 like the hills past the rim, a MOUNTAIN 3
  (32 min a 384 m block, 0.7 km/h: a steep range on foot). The lake, the dam and the buildings' own blocks stay walls.
- Out on the region the peaks are pass code 4, crossed at engine/BOHEMIA_REGION_LAND.json's new speeds.mountain (factor 3,
  32.256 min a block); no town is ever placed on one (codes 3 and 4 both skipped).
- EVERY ROUTE WEIGHS THE MINUTES: a tap's route inside the valley is now by minutes (cityRouteByMinutes: straight steps first, a hair
  for a diagonal, never a corner cut, so on roads alone it is the old route); the region's route counts the valley's own going
  (a road 1, a mountain 6); PLAY's route already did. A mountain is taken only when it is quicker overall.
- THE GLASS SHOWS IT: a mountain block takes 3 of the walk's steps (mapGoingBeats), a road one, and the glide walks it at a third of
  the pace instead of stopping and starting; the clock charges the block's own 3x minutes. The hills and the rubble pay on the
  clock only, as they did.
- AFTER, the same trips: Pahrump 175 blocks, 17 h, 3 of them over the mountain (3 hours quicker); Mt Charleston Lodge 139 blocks,
  14 h, round by the road still (over the range is slower: about 30 mountain blocks at 32 min against road at 5.4); Indian Springs
  182 blocks, 16.5 h. A tap on a mountain now walks onto it.

## PROOF
- gates/over_the_mountain_gate.js (in the suite as OVER THE MOUNTAIN) 5 of 5: M1 a mountain 32.3 min a block, open 10.8, a road 5.4,
  a peak out there 32.3, the lake a wall; M2 Pahrump 182 blocks 20.0 h -> 175 blocks 17.0 h, 3 over the mountain, the lodge 139
  blocks 14.0 h by the road; M3 3 / 1 / 3 steps; M4 the going off: the wall back, Pahrump round; M5 clean.
- The region's generator (tools/bohemia_world_region.py) writes the mountain itself (pass code 4, speeds.mountain), so REGION LAND
  K1 (the same bytes again) holds, 61 of 61; it recomputed one place's hours the same way (12.1 h -> 11.6 h).
- THE MAP WALK GLIDES STRAIGHT 10 of 10: its C4 mutation (the old search) also takes away the new route's hair for a diagonal.
- THE REGION IS BATTLE BROTHERS' SIZE 9 of 9, R3 AMENDED, said plainly: the three farthest places came from a day or more to 0.9
  days, because the trip may now cross the mountains (this ruling, the newest). R3 now asks 0.85 days for them AND rim to rim at
  least 1.5 days on a road (1.9 measured), the region's own size. Was red against 1.0 after this change; green before it.
- Also green: A FAR TILE WALKS AS FAR AS HE CAN 5 of 5, THE MAP GLIDES 14 of 14.
