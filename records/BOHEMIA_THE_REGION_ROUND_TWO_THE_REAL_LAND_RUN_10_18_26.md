# THE REGION, ROUND TWO: HE WALKS ON THE REAL LAND (RUN, 10/18/26, [the map at Battle Brothers' size], rule 109)

## WHAT CHANGED
Round one (records/BOHEMIA_THE_REGION_RUN_10_16_26.md) made the region walkable off the land painter's guess, with twelve
towns at made-up distances. WORLD then wrote the real Las Vegas region on the same 496-block grid
(engine/BOHEMIA_REGION_LAND.json, c6df0bd) and named three things for RUN to take. All three are taken, in
slices/bohemia_region.js:
1. **The land:** `passGrid(compass)` replaces the painter's pass grid, the valley's rolled exits stitched to the real
   highways (`stitch`). The painter keeps painting its own picture until COOK's tiles come; the party walks the real one.
2. **The places:** WORLD's real places (34 out on the region; tier, role, km) replace the twelve TOWNS. Each opens as a settlement on arrival
   (the role, base or fight, rides along on `placeAt` for FACTIONS and COMBAT; today both open the settlement screen).
3. **The cost:** a block out there costs the data's minutes, and the route search weighs blocks the same way.
Until the JSON arrives (one fetch after the region script), or if it never does, round one's land and towns stand.

## THE ONE SCALE NUMBER (the coordinator at AM: settle it with WORLD, one number, in the record)
**A block is 384 m of real ground and it costs the valley's own minutes on the valley's own 1,440-minute clock.** That was
already law (laws/BOHEMIA_ADDENDUM_VALLEY_SCALE_LAW_7_6_26.md: 96 m drawn, a 1:4 compression of the real valley) and WORLD
settled it the same hour (c1aaeb8, records/BOHEMIA_WORLD_ONE_SCALE_ONE_CLOCK_10_18_26.md): 10.752 minutes open, half on a
road, 1.8 times in hills or a wash. Out there is the same clock as in here; nothing is scaled. This round first picked
333 m and a twelve-hour marching day (camp at night); WORLD's ruling is the law's and newer, so the file follows it and
the twelve hours are dropped. A real stop at dusk stays an open question for QUESTS' camp-at-night contracts.

| | before (round one) | now | Battle Brothers |
|---|---|---|---|
| a block | 96 m (implied) | 384 m (the 7/6 law) | |
| across | 48 km | 190 km | |
| the real I-15, rim to rim | | **3.05 days** | 2 to 4 days (players' reports, EYES 10/17) |
| the 95 to the 93, rim to rim | | **3.38 days** | 2 to 4 |
| straight, a road all the way / open ground | 1.9 / 3.7 | 1.9 / **3.7** | 2 to 4 |
| places on the region | 12, made-up distances | **34, real**, every one at its real km (Henderson now sits inside the valley) | about 17 settlements |
| the farthest by route | | Pahrump 1.0 day, Mercury 0.9, Searchlight 0.9 | |

ECONOMY's "four times too close" (its 10/17 page, 3c) was round one's 96 m block; at 384 m the places sit at their real
distances. `bbDaysAcross` is no longer null: [2, 4], with the source; `realCrossings` prints WORLD's two.

## CHECKS
THE REGION IS BATTLE BROTHERS' SIZE 9/0 (R9 new: real land, 389 of 389 sampled blocks passing and 360 of 360 costing the
way WORLD's land says, 34 places at their real km, 384 m, both real crossings and open ground inside 2 to 4). Mutation
(on the first cut of the leg): doubling the clock speed turned R9 red.

## ROUTED
- TUNING: the block's minutes are felt numbers; they live in WORLD's data beside its speeds.
- FACTIONS / COMBAT: 13 of the places are fight places (`role: 'fight'`); today they open the settlement screen like a
  base. What a fight place opens is theirs.
- QUESTS / ECONOMY: a day's price times the new days; the far places are 0.9 to 1.0 days by route.
