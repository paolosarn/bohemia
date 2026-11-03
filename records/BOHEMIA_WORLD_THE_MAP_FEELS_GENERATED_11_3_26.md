# WORLD 11/3 round 7: A DIFFERENT VALLEY EVERY GAME (rule 339, ask line 347; BUILD 11/3zzi, NEVER GREEN BUILD 11/3zzl)

His words (Paolo 11/3, through the coordinator, the second time): 'the map is not giving procedurally generated vibes.'

## WHAT IT WAS (measured before anything changed)
- WORLD 6 (11/2) gave every campaign a code that moves the fourteen home bases among real places. Nothing else on the map moved.
- THE LIGHTS: the land seed lights 160 of the valley's 1,559 circuits (420 blocks), the same 160 every game. Nothing put any out at
  the start (the grid's own comment: 'Empty at boot... that is not the seed's business').
- THE BLOCKS: no burned, looted or rebuilt block anywhere. The painter has no state for a block.
- WHAT STANDS OUT THERE: no camp, lair, ruin or legendary place on the valley at all. The region's twelve camps and lairs
  (region_bases.json hostile_locations) are out past the valley at fixed real places, and the page never draws them.
- THE ROADS: every road open, every one of the nine pass roads out (I-15 N and S, US-95, US-93, NV-160, NV-159, NV-147, NV-564,
  NV-604) open, every game.
- THE SKY: the day's weather comes off the LAND seed, so day 1 is the same sky in every campaign.
So two codes side by side read as one valley with the town names shuffled. That is his complaint, measured.

## THE SCHOOL [bb]
Battle Brothers' wiki, from the library (reference/library/grok/wiki/PAGES_ALL.tar.gz):
- bb_all/1626_Raided (Settlement Situation).txt: 'This place has been recently raided! It's suffered damage, has lost valuable goods
  and supplies, and lives were lost.' (a place's STATE is part of the world the seed deals you)
- bb_all/1161_Legendary locations.txt: 'Legendary locations are unique locations scattered over the world... While less remote
  locations are usually safe, the ones further away from civilization are more dangerous'
- bb_all/0827_Game Guide.txt (in world_seed.json): 'the same map seed will always generate the same map including locations and their
  named items'.
So: the seed deals not only who stands where but what state each place is in and what stands out on the land, and the same seed is
the same world. Ours keeps the land real (Las Vegas) and deals everything ON it.

## WHAT SHIPPED (__A_DIFFERENT_VALLEY_EVERY_GAME__)
All from the same campaign code, all on real blocks of the right kind, all in one data file (records/target/bb/world_state.json).
- THE BLOCKS (painted by the map's own painter, in the worker, at every zoom): 3 to 6 BURNED patches (roofs to char, ash, soot on the
  street, an ember or two at night), 4 to 7 LOOTED strips (stripped grey, glass and junk strewn, holes kicked in), 3 to 6 REBUILT
  blocks a few streets from a faction's base (panels on the roofs, the yards raked to dirt with salvaged panels in rows, never green; their own lights at night). Never within 3 blocks of a
  base. Ragged edges, never squares.
- THE DARK (the grid's own): the valley is cut into 22 neighbourhoods; each code puts 35 to 70 percent of them out. Every live
  circuit in a dark one, or in a burned or looted block, is doused with POWER.douse, never within 4 blocks of a base (they keep their
  own lights), never on a rebuilt block. So the painting, the street lamps, the town, the fight and every 'is it black in here' check
  agree. It is re-made from the code at every boot and never written to the bill's dark set (an unpaid bill stays the bill's).
- WHAT STANDS OUT THERE (drawn standing in the world, scaled with the zoom, the map's palette, no badge):
  3 to 5 CAMPS on open ground (their smoke column stands up over the valley by day, leaning off the code's wind; the cook fire glows
  through the night wash), 2 to 4 LAIRS (a wreck the beast dragged off the road, bones, three birds turning over it on the beat),
  2 or 3 RUINS (a burned tower's shell, black, jagged top, nothing lit), 1 or 2 LEGENDARY PLACES from a pool of eight (THE LAST ATM,
  THE DRY FOUNTAIN, THE RADIO THAT STILL PLAYS, THE GLASS GRAVEYARD, THE BONE CHAPEL, THE STOPPED CLOCK, THE CRATER, THE DEAD BILLBOARD:
  a mast seen from anywhere, its red light blinking on the beat, at night through the dark). Every name draft:true. The tall parts
  rise out of the fog (Battle Brothers' smoke on the horizon); the ground part and the name only where he has seen. Names show
  close in (a block 14 px or more).
- THE ROADS: 3 to 5 freeway blocks shut across their whole width (A JACKKNIFED TRUCK, THE OVERPASS CAME DOWN, A BARRICADE), never
  within 5 blocks of a base, and only where the walkable valley stays ONE piece (checked by flood fill for each one). One or two of
  the nine pass roads out are shut (A ROCKSLIDE, A CHECKPOINT): the portal block and the region blocks round it; the land past it is
  still crossable over the rock, slowly. The walk (cityWalkable) refuses every shut block, so every route goes round.
- THE SKY: the start's weather (A DUST DAY, A HEAT HAZE, A COLD CLEAR NIGHT, SMOKE OVER THE VALLEY, each with its season) washes the
  map for the first two days and fades out; dust and smoke carry a slow grain. It goes to the fight as world.start.
- THE FIGHT: a burned BUILT block hands the fight the ruin board on the house ground (the district 'firestation', the one district that
  already fights there): walls standing, roofs gone. Burned open ground keeps its own board. Every fight carries block_state and
  powered.
- THE OLD VALLEY STAYS: no code (the checkers' bench) is untouched; a game saved with a code before this file keeps its valley (a new
  game is stamped st:1 beside its code in bohemia.world.v1; no stamp, no state).

## NEVER GREEN (rule 341, the coordinator's note the same round)
Paolo on the fight maps (records/BOHEMIA_PAOLO_THE_FIGHT_MAPS_ARE_NOT_DONE_TRUE_VARIETY_11_3_26.md): 'you gave a bunch of greenery to
the suburb, bro this is an economic apocalypse... no variety, like true variety'. The coordinator held the overworld to the same bar.
- WHAT I FOUND: the first cut of this round painted a REBUILT block's open ground as 'a garden where the lawn was': green, on a
  suburb with no water. Wrong; fixed the same round. A rebuilt yard is now raked dirt with salvaged panels laid in rows (blue-grey
  panels, tan dirt), and the roofs carry panels. No colour the state paints is green.
- HOW IT WAS CHECKED (measured, not looked at): (1) every colour in the painter's state code (18 of them) is read off the page and
  none has its green over its red and its blue by more than 10 (the gate's V1 NEVER GREEN leg); (2) the painting itself, on the demo,
  seed DUS-T42, every texel counted by the block it stands on: green texels are 0.01 percent of the whole valley, 0.02 percent of the
  home blocks, 0.00 percent of the rebuilt, burned and looted blocks (the gate's V4 NEVER GREEN leg runs it on all four seeds, under 2
  percent or red). So the map's ground has no green suburb; what green a picture shows is people's clothes and the turf's border
  lines, not ground.
- AND THE VARIETY IS REAL, NOT A COLOUR: what each code changes PLAYS: a shut freeway or pass changes every route (the walk refuses
  it), a dark block is dark in the grid (no lamps, no light at night in the town or the fight), a burned built block deals the ruin
  board, and the camps, lairs, ruins and masts stand at different places. The start's sky is the one part that is only a colour.

## THE TEN CODES (the real valley, each code's own seeded bases; node, the same module the page runs)
```
code      burned / looted / rebuilt blocks   scars  circuits out of 160  camps lairs ruins legends  shut roads  start sky
K7Q-M9X   150 / 32 / 57                       14     60                  5 3 3 1                    3           dust
VEG-AS7   205 / 65 / 53                       14     17                  4 3 3 2                    5           heat haze
DUS-T42   127 / 62 / 75                       13     54                  5 2 3 1                    4           dust
NEV-ADA   101 / 95 / 32                       12     51                  5 3 2 1                    3           dust
BAT-T3R   180 / 61 / 50                       13     52                  5 3 2 2                    3           dust
MEA-DXX   170 / 120 / 45                      18     52                  5 2 3 2                    4           heat haze
CRA-SH5   102 / 80 / 24                       11     59                  3 4 3 1                    5           dust
RED-RK9   161 / 108 / 16                      17     79                  3 3 2 2                    5           cold clear night
SAH-ARA   77 / 96 / 59                        15     53                  3 4 2 1                    3           smoke
HEN-DRS   75 / 107 / 50                       14     77                  3 2 2 1                    3           smoke
```
Ten codes, ten different states; the closest pair (K7Q-M9X and SAH-ARA) differ in 491 blocks and circuits. The same code twice is the
same state, byte for byte. Plus one or two of the nine pass roads shut per code (K7Q-M9X: US-95 NW by a rockslide and NV-564 by a
checkpoint; VEG-AS7: I-15 N and NV-147). The state takes 37 ms to work out on the demo, once, at boot.

## THE PROOF ON THE PHONE
records/target/world_7/A_DIFFERENT_VALLEY_EVERY_GAME.jpg (the VOTE tab: world-a-different-valley-11-3): four codes on his phone
upright (390 x 844, the bench walking each code, zoomed out until the valley fills the glass), K7Q-M9X sideways, and K7Q-M9X at night.
What a stranger sees, counted per seed above: the smoke columns stand in different places (3 to 5), the burned scars are black patches
in different neighbourhoods, a mast or two stands somewhere else, the towns are elsewhere (WORLD 6), the sky is a different colour
(dust brown, heat haze pale, cold blue, smoke grey), and at night whole different quarters are dark with a camp's fire glowing out of
them. Measured on the pictures: the least-different pair of the four differs in 7.2 percent of the valley's pixels (over a threshold
of 24 levels). Honest: at the far stop the scars and smoke are small; it reads different, it does not yet SHOUT different. If he votes
B, the next round turns up the scars' size and the sky's strength (all in the data file).

## THE GATE
gates/a_different_valley_every_game_gate.js: 60 passed, 0 failed (about 13 minutes on the demo; with the two NEVER GREEN legs)
- V1 the page carries the data and the module as on disk, the 11 hooks and the map's script.
- V2 the old valley (the bench, no code): no state, the 160 circuits all live, no state in the painting's key.
- V3 ten codes: ten states; every pair differs in at least 150 blocks and circuits; same code twice, same state; every mark on its
  kind; no base burned, looted or shut in; the valley stays one piece.
- V4 four codes on the phone upright (390 x 844) and one sideways: built; every dark circuit dark in the grid; the walk refuses every
  shut block and routes go round; the map walks to every base; the burned board; the painting re-baked; the landmarks drawn; at
  night the fires and masts lit; the four pictures differ (pixels).
- V5 a stranger's new game with a typed code: stamped, same state as node; opened again, same state; stamp taken off, the old valley.
- V6 the fight's burned board is the ruin board.  V7 nothing threw.
Also run: A NEW VALLEY EVERY GAME (WORLD 6's gate, which walks seeded valleys and a stranger's typed code): 34 passed, 0 failed.
THE MAP HANDS THE BOARD (the fight board gate): 5 passed, 3 failed, the same 3 failing on main without this change (cover envelopes
and the district-kind names; COMBAT's, not touched here).

## FILES
- records/target/bb/world_state.json (every list, count and name; mod-friendly, TUNING's and WORDS' to tune)
- engine/bohemia_world_state.js (pure: same valley and code, same state; node and page)
- slices/bohemia_world_state_map.js (the map's half: the douse, the walk, the landmarks, the fires, the sky, the fight's door)
- tools/bohemia_world_state_patch.py (inlines data and module into the map page, adds the 11 marked hooks; refuses a half-hooked page)
- gates/a_different_valley_every_game_gate.js

## WHAT IS LEFT (honest)
- The camps, lairs, ruins and legendary places are SEEN, not yet ENTERED: tapping one does nothing yet. BEASTS (lairs) and CONTENT
  (camps, legendary places) can hang a fight or a meet on BohemiaWorldStateMap.state().marks (each has kind, x, y, name).
- The town's settlement screen does not yet say its neighbourhood burned or went dark (the dark is the grid's, so its night is true).
- The day-by-day weather after the start still comes off the land seed (BohemiaWeather.at); only the start's sky is per code.
- The roaming parties start from the seeded bases (WORLD 6, measured there); their own dice are the parties module's.
- A price to relight a seeded-dark circuit would need the relight recorded (the boot re-douses from the code); nothing relights yet.

[bb] Battle Brothers' seed deals the state of the world, not just its map: a raided town, a legendary location out in the wilds.
Ours deals the state of a real valley: what burned, what went dark, who rebuilt, what stands out on the land.

[analog horror] From the far stop a stranger sees a smoke column leaning off a dead wash, a mast blinking red over a strip nobody
lights, three birds turning over a bus in the desert: a valley you could swear was different the last time you played the tape.
