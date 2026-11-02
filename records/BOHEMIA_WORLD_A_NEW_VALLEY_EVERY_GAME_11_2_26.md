# WORLD 11/2 round 6: A NEW VALLEY EVERY GAME (rule 318, ask line 315; BUILD 11/3ze)

His words (Paolo 11/2, through the coordinator): 'I am not getting really generated vibes right now playing on the map. The Remnants
are on the same part of the map... I don't even know if you have a number seed system in place... I'm not getting big procedurally
generated map vibes at all.'

## WHAT IT WAS (measured before anything changed)
- The fourteen home bases were baked at fixed blocks: CT_BASES_BAKED in slices/BOHEMIA_CITY_WORLD.html, read by ctBases(), and the
  live placer (engine/bohemia_towns.js placeHomes, through powerSeats) is deterministic and gives the same fourteen blocks (measured
  on the demo: derive() and the baked table agree on all fourteen). Every new game put every faction in the same place: the Remnants
  at the prison 86,49, the Mob at the resort 41,29, the Caravans at the one truck stop 56,88.
- Four bases crowded the north: the Volunteers 37,23, the Network 37,26, the Reds 42,24 and the Mob 41,29, the Volunteers and the
  Network 3 blocks apart.
- Only his start corner moved (freshStart, a dice roll off the clock), so a shared world could not share a start either.
- There was no campaign seed. A WORLD_SEED name was read in one place (famSeedText, the heir's seed) and never set. The land seed
  'bohemia' (BOH_SEED_TEXT) builds the valley itself and must not move (the Vegas geography law).

## THE SCHOOL [bb]
Battle Brothers' wiki, from the library (reference/library/grok/wiki/PAGES_ALL.tar.gz):
- bb_all/0827_Game Guide.txt: 'Generated map layouts are stored in map seeds. Starting a new campaign with a same map seed will always
  generate the same map including locations and their named items'
- bb_all/1415_News and Dev Blogs.txt: 'Added map seed that can be entered upon starting a new campaign, and seen for ongoing campaigns
  created after this update, for replaying and sharing maps.'
- bb_all/2107_Update 1.2.0.17.txt: 'Changed map seed to use words made up of characters from a to z, and no longer exclusively numbers
  in hexadecimal notation.'
So: one seed per campaign, shown, typed in to share, a word not a number, and a campaign from before the seed keeps its world.

## WHAT SHIPPED (__A_NEW_VALLEY_EVERY_GAME__)
- ONE CAMPAIGN SEED, A SHORT CODE: six characters from an alphabet with no 0, O, 1, I or L (read off one phone, typed into another),
  shown as K7Q-M9X. The map decides it once at its boot, before anything asks where a base is:
  the bench (the dark lifted, the checkers' valley) keeps the old valley; a game saved before the seed keeps the old valley (never
  move a base under a saved game); a saved game keeps its own code (localStorage bohemia.world.v1, beside the save); a new game takes
  the code he typed, else a fresh roll. A new code is a new page, the way NEW GAME already reloads, so no cache ever holds two valleys.
- THE LAND STAYS REAL. Every place a base can stand is one of the valley generator's own town blocks that fronts a road
  (engine/bohemia_towns.js districtsOf, the list the old placer read), of a kind that fits the faction, from the data file
  records/target/bb/world_seed.json: the Remnants at the air base, the prisons and the jail; the Network at the radio mast, the
  tower on the Strip, the substations and the big sign; the Caravans at the truck stop, the terminal, the warehouses and the yards;
  the Church at the chapels, the cemeteries and a school gym; the Mob at the casinos, the resorts, the high-roller rooms and
  downtown; the Cartel on the supply line (the yards, the warehouses, the terminal, the swap meet); and so on for all fourteen.
  Each kind carries a weight (a chapel beats a school gym for the Church).
- THE PLACER (engine/bohemia_world_seed.js, pure: no clock, no Math.random): the faction with the fewest real places picks first; a
  site is weighted by its kind and by how much town is within 8 blocks (a capital with nobody round it has no members); never two
  bases within 9 blocks (a fortress's ground is 4 wide, so a street of somebody else's between any two towns), relaxed to 6 and
  never below when a faction's places are all crowded; never on the valley's last 5 rows unless that is all it has.
- ONE ANSWER EVERYWHERE: ctBases() returns the seeded bases; powerSeats (the turf, the parties, the mines) moves its seats to them,
  tier and power staying the faction's own; the four valley caches (turf seats, parties, turf grid, mines) key on the campaign code
  too. The settlement picture belongs to the town's faction, so it moves with it. Towns are drawn live from ctBases, so a moved base
  is a moved town.
- THE START: his corner comes off the code and his origin (same code, same origin, same corner and same first town).
- THE BOSSES: the boss signs and places (slices/bohemia_his_map.js) roll off the code too.
- THE NEW-GAME SCREEN: a row under the crew's name, THE VALLEY · ITS CODE, in the door's own name box: the code this game will be. He
  types a friend's code in (or taps ANOTHER) and the page comes back to the same door with that valley built. Added after whatever
  the door draws (UI is redoing the door), redrawn when the door redraws.
- MOD-FRIENDLY: every list and number in records/target/bb/world_seed.json; tools/bohemia_world_seed_patch.py inlines it and the
  placer into the map; the gate refuses a drift.

## THE TEN SEEDS (gates/a_new_valley_every_game_gate.js N4, the real map, each base's block)
```
faction    OLD            K7QM9X         VEGAS7         DUST42         NEONHB         BATT3R         MEADXX         CRASH5         REDRK9         SAHARA         HOOVER
Anarchists 24,82          46,86 apartme  34,8 apartme   17,44 commerc  26,78 commerc  44,6 commerc   34,80 apartme  16,82 commerc  71,42 apartme  60,73 apartme  80,82 commerc
Blues      71,48          62,35 park     60,53 park     28,87 park     73,71 park     80,23 park     15,53 park     28,42 waterpa  37,66 park     71,29 park     46,87 park
Caravans   56,88          56,88 truckst  55,64 termina  57,33 warehou  64,78 storage  55,64 termina  57,33 warehou  56,33 warehou  11,53 storage  56,88 truckst  56,88 truckst
Cartel     64,78          64,78 storage  24,10 storage  22,35 storage  11,53 storage  64,78 storage  73,79 storage  73,79 storage  73,79 storage  44,10 swapmee  28,29 storage
Church     47,50          40,17 cemeter  73,19 school   58,67 cemeter  40,17 cemeter  47,50 chapel   47,50 chapel   17,52 school   47,50 chapel   17,52 school   53,37 school
Colorful   35,56          62,47 suburb   89,51 suburb   58,77 suburb   67,30 suburb   88,60 suburb   8,67 apartme   88,58 suburb   35,37 suburb   30,37 suburb   74,67 suburb
Custom     61,73          75,50 suburb   46,86 apartme  71,42 apartme  50,74 suburb   28,11 apartme  43,77 suburb   87,75 suburb   26,86 suburb   7,19 suburb    15,31 suburb
Homeless   24,75          37,8 trailer   73,79 storage  10,26 trailer  8,44 trailer   28,51 storage  22,35 storage  10,26 trailer  8,44 trailer   24,75 pumpsta  24,75 pumpsta
Mob        41,29          45,46 resort   21,69 casino   41,55 resort   41,62 resort   71,67 casino   46,62 resort   45,62 resort   21,69 casino   46,49 resort   45,62 resort
Network    37,26          44,65 sign     44,65 sign     34,39 substat  34,39 substat  44,65 sign     34,39 substat  58,64 substat  58,64 substat  44,65 sign     58,64 substat
Reds       42,24          37,28 courtho  46,37 mall     47,37 mall     42,28 downtow  48,25 downtow  46,37 mall     37,28 courtho  47,37 mall     48,25 downtow  38,28 courtho
Remnants   86,49          86,49 prison   40,23 fort     40,23 fort     86,49 prison   39,26 jail     40,23 fort     87,49 prison   39,26 jail     39,26 jail     86,48 prison
Trades     79,62          57,10 battery  17,29 industr  82,61 industr  57,10 battery  19,31 industr  78,62 industr  22,28 industr  80,61 industr  57,10 battery  80,57 industr
Volunteers 37,23          32,53 campus   73,53 school   73,19 school   35,51 campus   53,37 school   37,67 school   62,52 campus   35,53 campus   62,52 campus   35,17 school
distinct layouts: 10 of 10; distinct real places per faction in ten seeds: Anarchists 10, Blues 10, Caravans 5, Cartel 7, Church 6, Colorful 10, Custom 10, Homeless 7, Mob 7, Network 3, Reds 4, Remnants 3, Trades 7, Volunteers 7
```
spacing relaxed (a faction squeezed below 9 blocks, never below 6): 0 times in ten seeds

OLD is the old valley (every game before this). Each cell is the base's block and the kind of real place it stands on. The Remnants, his own example, stand at the air base (40,23), the jail (39,26) or the east prison (86,49) depending on the code, 3 of their 3 real places in ten seeds (the first cut, before touching blocks counted as one place, put them at the east prison 8 times in 10). Offline over 200 codes (the same placer on the same real blocks, scratch harness): the Remnants 45% the air base, 31% the jail, 25% the prison; the Caravans' truck stop is still their likeliest home at 19%; no two bases ever closer than 9 blocks; 14 ms a valley.

## THE SIDE BY SIDE
records/BOHEMIA_WORLD_A_NEW_VALLEY_EVERY_GAME_11_2_26_SEEDS.jpg: the demo on a computer, the bench walking two codes (K7Q-M9X left,
VEG-AS7 right), zoomed out until the valley fills the glass. The same streets, the same freeways (I-15, US 95), the same mountains; the
towns are elsewhere: the Remnants at the east prison (bottom right) on the left and at the air base up the middle on the right, the
Caravans at the truck stop in the south on the left and at the terminal in the middle on the right, the Church at a cemetery in the north on the left and
at a school in the north-east on the right. Made by the gate (BOHEMIA_SHOT_DIR=dir node gates/a_new_valley_every_game_gate.js).

## THE GATE
gates/a_new_valley_every_game_gate.js, in the suite as A NEW VALLEY EVERY GAME: 34 passed, 0 failed (about 15 min on the demo).
- N1 the page carries the data file and the placer as they are on disk.
- N2 the bench keeps the old valley (no code: CT_BASES_BAKED).
- N3 every faction has 3 blocks or more (the Remnants 5, the Network 5, the Colorful 2,159) and 3 separate real places or more (the
  Remnants 3: the air base, the jail, the prison; the Network 5; the Reds 7).
- N4 ten codes, ten valleys; every faction in 3 real places or more across the ten; the same code twice the same world; all fourteen
  seated every time; no two bases within 6 blocks (and the 9-block rule never had to relax in the ten); every base on its own kind.
- N5 all 5,020 candidate blocks (faction by faction) have a door onto the street and the map walks to every door from the middle.
- N6 two seeded valleys: ctBases() is the seed's, the turf's 14 seats stand on it, all 28 roaming parties leave from their faction's
  seeded base (0 off), every base's door opens that base's town, the map walks to every base.
- N7 a stranger's new game with a typed code (k7q-m9x, typed small with the dash): the code is the game's, saved with it; he starts
  in one of its towns (the Reds' at 33,27); the game opened again on the same phone keeps its code and its bases; a second new game
  with the same code starts in the same corner and the same town.
- N8 nothing threw.
Also run: A FRESH START AND A FOG OF WAR 8/8 (three stranger's new games, now three different valleys: three different corners, each
by a town; the dark, the walk, the save, SHOW THE TOWNS 14 of 14, the first day's jobs near the corner).

## WHAT IS LEFT (honest)
- Who holds the region's twelve outer towns (records/target/bb/region_bases.json holders): the page never hands that file to the
  home-base ledger (setRegion runs under node only), so there is nothing in the page to seed until RUN wires it.
- The region's camps and lairs (hostile_locations) each stand at one named real place; they need candidate lists before a seed can
  move them.
- What is looted or burned at the start, the shops' stock rolls and the crew's roll still roll on their own; each should take
  BohemiaWorldSeed.hash(code + ':shop:' + town) and the like.
- The roaming parties leave from the seeded bases (measured, N6), so they start in new places; their own dice are the parties
  module's.

[bb] Battle Brothers' map seed is the school: one per campaign, shown, typed, shared, older campaigns keep theirs; ours moves who
stands on a real valley instead of drawing a new continent, because the land is Las Vegas.

[analog horror] The code reads like a tape label or a case number scrawled on a VHS spine (K7Q-M9X): a world you can hand
somebody, and the same houses will be dark in the same places when they play it.
