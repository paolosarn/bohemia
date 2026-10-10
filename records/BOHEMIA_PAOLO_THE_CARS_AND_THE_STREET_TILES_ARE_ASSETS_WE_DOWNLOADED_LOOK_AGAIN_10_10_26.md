# PAOLO 10/10: 'THE CARS ARE AN ASSET WE DOWNLOADED. A LOT OF THE ORIGINAL STREET TILES AND SIDEWALKS WE DOWNLOADED. LOOK AGAIN'

His words, verbatim (10/10, to the coordinator, after the coordinator said the repo held no downloaded game art):

> "Okay for example the cars is an asset we downloaded. Alot of the original street tiles and sidewalks we downloaded look again bitch"

## HE WAS RIGHT AND THE COORDINATOR WAS WRONG
The coordinator searched for image folders and found none. The downloaded assets are not loose images: they are THE PURCHASED HD PACKS, taken in on 7/7 by the pack intake factory (laws/BOHEMIA_ADDENDUM_PACK_INTAKE_FACTORY_7_7_26.md) and judged tile by tile in the Great Sweep of July:
- banks/BOHEMIA_HD_TILE_REPO_part1-4.txt: 180 MB of keyed tiles (pack, index), 87 packs, 2,604 judged;
- banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt: his 1,927 UP tiles (the approved corpus);
- banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt (the street blocks), BOHEMIA_MARKING_BANK_7_17_26.txt (84 road markings, 'I like all of them'), BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt (30 of 30 UP), BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt (the 42, CBB), the lamp family, the door bank, the terrain and desert pools;
- slices/BOHEMIA_CITY_TILES_01-09.js and BOHEMIA_CITY_PROPS.js (27 MB): the tiles and props the walked city drew, the cars among them (props: car, barrel, barricade, bench, bin, bollard, cone, dumpster, firebarrel, lamp, lighttower, mailbox, pallet, pole, rubble, tyre);
- records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md: THE SHOPPING LAW: 'any session about to draw, cook or place ANY visual thing checks THIS FILE FIRST; cooking a substitute for an indexed asset is a violation.'

## WHAT WENT WRONG
The fight boards (COMBAT TWO's fight_ground), the freeway kit and the six buildings' props (COOK), the settlement pictures (COMBAT TWO, COOK) and the far end's tiles were COOKED FRESH. Measured 10/10: not one of tools/bohemia_combat2_*.py reads the HD tile repo, the confirmed set, the city tiles or the props file. The shopping law was on the books since 7/27 and nobody read it for the fight. That is why everything he sees looks nothing like what he approved: it is not made of it.

## RULE 82a: THE PACKS ARE THE BAR
Every tile, prop, car, street, sidewalk, kerb, marking, lamp and house skin on a fight board, a settlement picture and the map's near and middle stops comes FROM the approved corpus (placed, flipped, weathered, recoloured within the pack's palette), never a cooked substitute. The reference twin (82) for those families IS the pack tile. COMBAT TWO [the boards from the packs] FIRST; COOK [the pack is the twin] FIRST (extract the corpus to PNG by family into reference/art_bank/ with the intake tool, then re-cut the freeway kit and the settlement pictures from pack tiles); PLUMBER [the pack gate] (a cook tool that writes a street, sidewalk, car or prop without reading the corpus is red; the banks_used gate extended to fight_ground and the settlement pictures). Characters and portraits keep their own twins (the runway houses and real faces): the packs hold no people.
