# THE CITY GOES TO WORK (WORLD 16, 11/27/26; VAMILY rule 485(b)(c); BUILD 11/27r)

Paolo 11/26 (rule 485): 'Lets go cyberpunk vibes but their world has a running economy vibes!' (b) the city's money moves whether he
is there or not, and he can see it: people go to work and come home, deliveries and caravans cross the map, gangs collect from their
blocks. (c) research first, then built into what exists: the towns, stalls, map people and parties already in the game, never a new
system beside them; nothing pops up, no icons. WORLD 13's part (the map's people and parties moving it), taken over by WORLD 16 from
WORLD THIRTEEN's handoff (HANDOFF READY 11/27 02:11). ECONOMY THREE's calls for this lane:
records/BOHEMIA_ECONOMY_THREE_THE_RUNNING_CITY_11_27_26.md section 3.

## 1. MEASURED BEFORE (the demo, main 278d7afe0, the phone upright)

- The valley's twelve crowds (where its two hundred live; pplGrid's 'cluster' neighbourhoods) stood three a crowd at every hour, day
  and night. Nobody went anywhere but the parties.
- A caravan (bohemia_parties.js agenda 'caravan', 10 of the 28 parties) was two men walking: the same picture as a patrol. Nothing said
  it carried anything, out or home.
- Nobody collected from anybody on the map; the rent lands in a faction's pocket at nightfall (ECONOMY THREE, BUILD 11/26e) unseen.
- When he stands, the map does not draw (0 draws in 3 s); the clock only moves while he travels (Battle Brothers' way). So anything the
  city does is seen as he travels, and is a function of the clock.

## 2. THE RESEARCH THIS BUILD STANDS ON (cited in ECONOMY THREE's record, section 1; the parts this build uses)

- CYBERPUNK 2077 IS A FEEL, NOT A SIMULATION: crowds placed by meaning, background people pinned to a spot looping a job so a place
  reads as working; turf as people standing around [eip.gg 2020; Aftermath, Cockburn 2025; PC Gamer 2020]. Ours runs on a real clock.
- SARAJEVO 1992-96: the sellers were whoever could cross; people walked hours for water and work; trade hid indoors after the market
  shellings [Andreas, Wilson Center; Il Post 2014]. So the walk is the street, and work is inside the town.
- MOSCOW 1992: the kiosks at Sukharevskaya paid racketeers 'kind of like an insurance policy' [Los Angeles Times 1992]. So the gang's
  man comes to the door at a set hour.
- BATTLE BROTHERS (the floor): a caravan carries a town's goods to the next, and an arrival raises both towns' resources; a village out of
  resources stops sending them [0626_Developer Posts.txt]. Ours shows the load: full going, empty coming home.

## 3. BUILT (slices/BOHEMIA_CITY_WORLD.html __THE_CITY_GOES_TO_WORK__; nothing beside what walks)

- THE CROWD GOES TO WORK: each crowd's three people are two who work and one who keeps the house (the crowd's own spots 0 and 1, the
  same man and the same seat in the people's mix). From 06:15 to 07:30 (each man his own minute, each day its own) the two walk the
  streets to the nearest town's edge and go in; from 16:00 (after at least five hours at work) they walk home; by night all three are
  home. The walk is the quickest by the walked surface's own minutes a block (a paved block at PAVED_SPEED, rough going by
  TERRAIN_GOING; his scout and his job's pace are his, not theirs), the routes' own rules (N E S W first, never a corner cut). A walk
  over 150 minutes each way is no commute: that crowd works at home (4 of the demo valley's 12).
- THE CARAVAN PULLS ITS WAGON: the caravan's lead pulls STAFF 2's wagon (the fight's own pictures, rule 471(c)), loaded on the way out
  (food twice as often as gear, rounds or meds: the trade a collapse runs on), empty on the way home. Drawn in depth with the city, cut
  where a building stands in front, never outlined (the pale outline is how a man behind a wall is found; a wagon is not looked for).
- THE COLLECTOR WALKS HIS BLOCKS: the gang that holds a crowd's ground (turfAt) sends a man from its seat after the stalls shut (he
  reaches their door between 20:00 and 20:45), stands at their door 25 minutes, walks home. Drawn as his gang's own rolled man when that
  sheet is already in for its parties, else the gang's look off the cast every map holds: no sheet is fetched for him. A seat over 150
  minutes away sends nobody (4 crowds on the demo valley have a collector).
- EVERY PLACE IS THE CLOCK'S: where anybody is comes from the map's day and minute and the valley alone; nothing saved, nothing ticks
  between draws, the same hour draws the same street on every phone; when the clock stops they stand. They glide as the parties glide
  (partyGlidePos) and walk behind what stands in front (the parties' depth). Fog of war hides them where he has not been.
- Switches (the way before, a part at a time): MAP_WORK.on, MAP_WORK.wagon, MAP_WORK.collect.

## 4. THE FRAME BUDGET AND THE IPHONE (rules 480, 484)

- No man is added for the commute: a man on the road is one not standing at home (the same picture and seat); a man at work is drawn by
  nobody. Measured at 4x on this box (tools/bohemia_world_sixteen_work_frames.js and a per-function timing, the CPU canvas, 07:40): the
  walkers' pass 9.4 ms a draw at the opening zoom (6 walkers) and 14.6 ms at the whole valley (15), and the crowd's own pass drew that
  many fewer men (each man ~1 ms at 4x on this box, the depth cut). The wagons are the new cost: 7 to 9 ms a draw at 4x for 6 to 10
  caravans on the glass (two cuts each). The collectors are 2 to 4 men at dusk.
- The routes are found once a valley, a crowd at a time in idle time: 11.5 ms in all at full speed in 3 slices, the longest piece a
  slice cannot split 5 ms (20 ms slowed 4x), never inside a frame. Until they are found everybody is home, as before.
- THE WAGON'S PICTURE: the whole wagon sheet is 2048 x 807 (6.61 MB decoded on a phone); the map uses only the loads and the two parts it
  draws, packed pixel for pixel into 1024 x 710 (2.91 MB decoded, 80 KB on the wire): tools/bohemia_world_sixteen_pack_the_caravan_wagon.py
  -> slices/fight_rig/map_caravan_wagon.webp/.json (the same cell format as staff_carts.json). Fetched the first time a caravan is drawn.
- This box draws with a software GPU (a whole draw 190 to 330 ms at 4x whether the work is on or off; the frames a second compare builds,
  they are not his phone's). The share of the draw that is this build's own is the number that travels to his phone.

## 5. PROVED

- Gate gates/the_city_goes_to_work_gate.js (in the suite, THE CITY GOES TO WORK) 9/0: C1 the plan (idle, chains of streets to a town's
  edge, under 150 minutes, 8 of 12 crowds), C2 the day (06:00 36 home; 07:40 15 on the road; noon 16 at work, 0 on the road; 17:30 13
  walking home; 23:00 36 home; three a crowd at every hour), C3 the walk (every walker on his walk, none further back later), C4 the
  collector (4 out at 20:25, 1 at a door; 0 at noon), C5 the wagon (10 drawn: 4 loaded, 6 empty, matching the caravans' legs), C6 the
  same hour the same street, C7 planted (the work off: 0 out; the wagon off: 0 wagons), C8 the alpha on its side.
- THE MAP HAS ITS PEOPLE: its crowd leg now counts a crowd's three as those home plus those out (crowdOut); its five reds are main's
  own, measured on main with this build stashed (him drawn as 'cook', 0 people for 6 crowds and 20 crews: the gate's own rig wait).
- The clip, filmed off the compositor at the speed the glass showed it (tools/bohemia_world_sixteen_the_city_goes_to_work_clip.js):
  records/target/world16_goes_to_work/the_city_goes_to_work.mp4 (32 s; each part cut to a 300 x 440 window of the phone, drawn twice the
  size): MORNING (06:05 to 08:40, two step out and walk the street), EVENING (17:40 to 21:10, home in the dusk, the collector at the
  door), CARAVAN FULL, CARAVAN EMPTY.

## 6. NOT DONE, NEXT

- An arrival raising both towns' stock is ECONOMY THREE's next (its record, section 3); the map already lists every caravan that gets
  through (PARTIES_TODAY, a leg change to 'back'), so the stall can read it with no new hook.
- People going in and out of a town's own gate on the town screen (WORLD 15's places).
- The map's own: the ground's full repaint every 4 s while moving (WORLD THIRTEEN's owed item, mapGroundBegin); the walkers could share
  one depth cut for the two parts of a wagon.

[bb Battle Brothers: a caravan carries a town's goods to the next and its arrival raises both towns' resources; ours you can see full
going and empty coming home]
[analog horror: after dark the street is empty, the workers are in, and one man in his gang's colours walks to a door and stands there
as long as it takes]
