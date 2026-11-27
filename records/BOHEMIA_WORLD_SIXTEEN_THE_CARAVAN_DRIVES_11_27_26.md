# THE CARAVAN DRIVES (WORLD 16, 11/27/26; VAMILY rule 494(d), the map's side; BUILD 11/27zs THE CARAVAN DRIVES)

Paolo 11/27 (rule 494): 'in Battle Brothers there's so many different quest types... I haven't seen one caravan quest... go from one city
to another... I feel like we're not doing enough in a lot of that universe.' 494(d): 'each kind plays different on the map, never only a
different card: the caravan is a truck that follows his party town to town on the clock and raiders come for it on the road.' Owner of
the kinds and the boards: JOBS 2 (whether he is offered the caravan, 494(a)(b)). This lane: the map's side, the truck and the raiders on
the roads. The coordinator's routine: 'the truck follows his party town to town on the clock along your roads, raiders come for it on
the road, it reads plainly on the map upright and sideways, never choppy.'

## 1. MEASURED BEFORE (the demo, main a7a8d6fb2; the board's own escort offer 'Walk the water carts to the wash' taken at Church)

- The escort job's mechanics were built (slices/bohemia_job_kinds.js, haul-caravan): the cargo walks a block behind him, the clock
  runs 1.6x slower a block while it walks with him, raiders are put 2 to 4 blocks up his road and close a block for every block he
  walks, contact is the raiders' card and the fight, each crate that arrives pays its share. EVERY JOB KIND's escort legs 10/0.
- What the glass showed of it: the cargo was ONE picture of the truck (RUN's 10/19 bake, 54 x 44, south-west only), 26 points wide,
  standing on the block behind him and jumping a whole block at a time; through downtown the towers hid all but a sliver of it (no
  outline). The raiders were two men frozen mid-stride facing the camera, appearing on their block and jumping a block at a time, a
  second or two before their card (a band put three blocks up his road, closing as he walks into it).

## 2. HOW BATTLE BROTHERS DOES IT (the floor) AND THE REAL WORLD

- Battle Brothers' Escort Caravan: the caravan is its own party on the world map, a cart and its guards that move along the road
  between two towns at the caravan's pace; the player's company moves with it; ambushers come out of the countryside at it, and the
  fight is around the carts [reference/library/battle_brothers; the wiki's 0703_Escort Caravan]. You read the caravan as a vehicle
  at a glance, and you see the ambush coming.
- The real collapse: goods crossed contested ground on trucks and carts at walking pace (Sarajevo's convoys and the tunnel's carriers),
  and the danger was the road itself (records/BOHEMIA_ECONOMY_THREE_THE_RUNNING_CITY_11_27_26.md, section 1).

## 3. BUILT (the map's side; nothing in the job's rules moved)

- THE TRUCK: the truck he voted UP (direction-the-truck-turned-up-10-18, after 'a little too much like a play toy'), DIRECTION's master
  rig render in all EIGHT facings over its contact shadow (records/target/direction_the_truck_turned_up/truck), packed for the map by
  tools/bohemia_world_sixteen_the_caravan_truck_bake.py: slices/fight_rig/map_caravan_truck.webp/.json, 512 x 419, 0.86 MB decoded,
  150 KB. Drawn at 0.6 of its true size beside his men (about one and a half men long: a vehicle at a glance that does not cover four
  blocks), one pixel of it to one pixel of a 3x phone at the near zoom.
- IT ROLLS BEHIND HIM ON THE CLOCK: on the job's own block (a block behind him), gliding block to block like every party
  (partyGlidePos), facing the way it rolls (eight facings), a pixel of a bounce on the beat while it rolls; in depth with the city, and
  where a building stands in front it is cut AND outlined as his own men are (it is the thing he guards, so it is always found). The
  plate stays ('2/2 CARTS').
- THE RAIDERS COME ON THE ROAD: the job's band glides in toward him and walks (their stride), facing him, the job's own men; the first
  time a band is drawn it comes out from two blocks further off his road and runs in, so the first thing he sees is them coming. The
  plate stays ('RAIDERS · 4'); the card and the fight are the job's, unchanged.
- slices/BOHEMIA_CITY_WORLD.html __THE_CARAVAN_DRIVES__ (mapCaravanDrive, mapCaravanRaiders, MAP_CARAVAN); slices/bohemia_job_kinds.js
  calls them from cargoDraw and DRAWS['haul-caravan'] (the old picture and the old pair if the sheet is not in). MAP_CARAVAN.on = false
  is the way before.
- COST: the truck is one cut a frame, the raiders the same two men as before; the sheet is fetched the first time a caravan job is
  drawn. Measured on this box's journey: drawn on 230 of 230 frames of the road.

## 4. PROVED

- Gate gates/the_caravan_drives_gate.js (THE CARAVAN DRIVES, in the suite) 6/0: V1 the sheet (fresh from the renders, under 1 MB);
  V2 the truck on 222 to 249 of every frame of the road, trailing its block by 1.7 to 3.2 blocks over four runs (the glide trails
  the clock like every party's: a slow frame on this box swallows beats and the journey pays them back as a burst of blocks; the leg
  holds it under 4, past which the glide cuts), never half a block between two frames, facing its motion on 108 of 116
  moving frames, five facings over the route; V3 the raiders drawn on 40 frames, walking on 36, facing him on
  40, 6.0 blocks off at first and 2.2 at the last, their card stands; V4 planted (the truck off: not drawn); V5 the alpha on its side.
- EVERY JOB KIND (escort legs) 10/0: taken, drawn, slow, raided, the fight, paid per crate, he stands where he brought it.
- The clip: records/target/world16_caravan_drives/the_caravan_drives.mp4 (11 s; the demo upright, the dark lifted, the 1x pace; the
  middle of the glass drawn twice the size): tools/bohemia_world_sixteen_the_caravan_drives_clip.js.

## 5. NOT DONE, NEXT

- Whether he is OFFERED the caravan in his first hours is JOBS 2's (494(a)(b)): the board in the town he starts in carries it on the
  demo (the escort offer 'Walk the water carts to the wash' at Church).
- The truck carries its crates in the bed (a load picture on the truck, as the wagon has); the job's people walking beside it.
- The raiders are put 2 to 4 blocks up his road by the job (JOBS 2's number); at the 2x pace they are on the glass about two seconds
  before their card. Further out would be a gameplay number (TUNING / JOBS 2), so it is left; the run-in from two blocks off is the
  map's part.

[bb Battle Brothers: an escort caravan is a cart party on the road the ambush comes out at; ours is his voted truck rolling behind him on
the clock, and the raiders come out onto the road toward it]
[analog horror: a yellow pickup with its paint gone to chalk, crawling down an arterial at walking pace, and four men stepping out from
between the towers ahead of it]
