# COOK [every 2D asset into 3D]: THE INVENTORY, MEASURED (10/20/26)

Rule 121(l) (Paolo 10/19: 'we need all the 2D assets made into 3D assets now'); rule 123 (Paolo 10/20: 'all that
energy has to be spent towards just revamping all the 2-D assets into these 3-D sprites... analog horror Crashbox
vibes, go crazy'). No card. The count lives in `records/target/cook_3d_inventory.json` and goes down only when a
rig-rendered picture has replaced the file the game draws (same file, same size, same anchor).

## HOW IT WAS MEASURED

`tools/bohemia_cook_what_the_screen_draws_flat_10_20_26.js` plays the demo on the one driver
(`tools/bohemia_drive_the_demo.js`) and wraps `drawImage` in every frame before the page loads, so it sees the map's
caches being built too. Every draw is summed by the picture it came from, keyed back to its bank (HERO_SRC, TP_TILES,
SA_TILES, SIG_TILES, PROP_B64) or its file. Then the fight (`BOHEMIA_FIGHT.html`) and the settlement screen
(`BOHEMIA_SETTLEMENT_SCREEN.html`) the same way.

What his screen is made of, measured:

| screen | biggest flat thing | what else is flat | already 3D |
|---|---|---|---|
| the map | HERO_SRC `mountain` (95 M px at boot, the whole valley's edge), then `suburb`, `arterial`, `freeway`, `desert`, `commercial`, `solar`, `resort`, `trailer`, `fort`, `town`, `apartment`, `strip`, `farm`, `rail` | the other 54 district pictures | the people (`BOHEMIA_RIG_PEOPLE.png`, `BOHEMIA_RIG_CAST.png`), the truck |
| the fight | the floor blocks (`block_corner_1`, `block_subs_3` on the first board: 4.8 G and 1.0 G px over the run) | the cover on the board (cars, walls, rocks, rubble), the lamps and the drum | every man and beast (`slices/fight_rig/`) |
| the settlement | the backdrop (`settlement_ground_packs/town_0.webp`, 5.5 G px: the whole screen) | the market's two building icons | the people (`records/target/character/rig/`) |
| the crew | nothing | | the portraits (`records/target/portrait/crew/`) |

## THE FAMILIES, BIGGEST ON HIS SCREEN FIRST

| # | family | where | flat |
|---|---|---|---|
| 1 | the fight floor | `slices/fight_ground/block_*.webp` (present day) | 35 |
| 2 | the fight's cover | `slices/fight_ground/cover_*.webp`: 3 dead cars, 3 block walls, the shed, the trailer, the barrier, the dumpster, the fence, the pump, the steps, the dock, the slot bank, the table, the pillar, the outcrop, 21 rocks, 12 rubble | 51 |
| 3 | the settlement backdrops | `slices/settlement_ground_packs/` (town, camp, fortress, two each) and the home block, day and night | 14 |
| 4 | the map's district pictures | HERO_SRC, 69 pictures in `slices/BOHEMIA_CITY_TILES_01..09.js` | 69 |
| 5 | the fight floor's futures | `block_*_raided.webp`, `block_*_reclaimed.webp` | 70 |
| 6 | the fight's lights | `light_*.webp`: two lamp posts, the oil drum, the slot glow | 4 |
| 7 | the item icons | `slices/market_icons/`: 2 buildings, 4 supplies, 12 weapons | 18 |
| | **total** | | **261** |

Vehicles and beasts are not their own row: the beasts in the fight are rig models already (dire wolf, cave hyena,
feral shepherd), the truck on the map is the rig's, and the three dead cars are in the cover row. Buildings are inside
rows 1, 3 and 4 (every building he sees is part of a floor block, a settlement picture or a district picture).

## WHAT IS NOT DRAWN (measured at 0 px on every screen)

The walk is dead (9/28), and these only fed it or were replaced by a newer folder: TP_TILES 8,674 pack tiles,
SA_TILES 96, SIG_TILES 88, PROP_B64 105, IN_DOOR_B64 10, the old `slices/settlement_ground/` town, camp and fortress
(12, replaced by `settlement_ground_packs/`), `kit_cover` 16 and `kit_street` 22 (baked into the blocks),
`cook4_map_houses` 3, `fight_beasts` 1, `settlement_people` 25. They are not counted: converting a picture nobody
sees is not the job.

## THE ORDER OF WORK

1. The floor, grimier ([the floor, not final] folded in): 24 blocks re-rendered through
   `tools/bohemia_cook_the_floor_not_final_10_20_26.py` and swapped in, then the 11 never done.
2. The cover: the rig's models (most exist from rounds 10/18 and 10/19) rendered at the fight's 42.9 px a metre and
   cut to each old picture's size and foot.
3. The settlement backdrops: each place built in 3D on its hotspots.
4. The map's district pictures, the mountain first.
5. The futures, the lights, the icons.

## THE LOG

The JSON's `log` carries the count after every family that lands.
