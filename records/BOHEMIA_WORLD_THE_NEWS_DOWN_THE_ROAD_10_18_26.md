# WORLD: THE NEWS DOWN THE ROAD, AS DATA (10/18/26, world lane, the new age, rules 112 to 117)

Row: [the news down the road, as data] WHAT-EACH-TOWN-IS-TALKING-ABOUT (the coordinator, from ECONOMY's 10/18 finding:
"the next town has news 94 percent of the time and the bar names none of it"; RUN TWO carries [the bar names the news]).
END STATE asked for: for each of the region's places, what happened there lately (a raid, a price jump, a crew
passing, a death) as data the bar can read, drawn from the region's own events, never invented text; a check that
every place has at least one item after a week of play. Data only; the words are a mouth's (RUN TWO's).

## 1. WHAT WAS THERE (measured on main before a line was written)

- RUN TWO's bar (80780b4c) tells the 14 valley seats: FACTIONS' raid ledger first, else the map's dice
  (sickness, market day). Its own record: "the region's far towns are not settlements the loop opens yet, so they
  are not named."
- The region's 35 places (engine/BOHEMIA_REGION_LAND.json: 34 past the valley and Henderson) had **no events at all**.
  WORLD's parties, FACTIONS' ledger and the home bases all live on the valley's 14 seats. Out there nothing moved:
  no caravan from Jean to Primm, no crew at Searchlight, no price that changed. The only thing a far town ever
  had was the settlement screen's weekly dice. A keeper had nothing true to say about the road.

## 2. HOW BATTLE BROTHERS DOES IT (rule 41)

- The world map runs on its own: settlements send caravans to each other and patrols along their roads; lairs
  send roaming parties; a party you never see still arrives (reference/library/battle_brothers/01_WORLDMAP.md).
- What happens to a town is a SITUATION with numbers (the wiki's pages, already in the repo):
  Raided, items -50% (records/target/bb/arrival_traits.json); Well Supplied, buy -10%; Ambushed Trade Routes,
  sell +10% (records/target/bb/price_table.json situationMultipliers, GROK_120).
- A rumour never makes the thing it tells; it reads what is already on the map (RUN TWO's record, Dev Blog 138).

## 3. WHAT WAS BUILT

**engine/bohemia_region_news.js**: the region's own business, and what each place is talking about.

- **Who sends**: every place, by its tier, BohemiaTowns.REACH (fortress 3, town 2, camp 1 a week), on a timetable
  (its n parties leave n times a week, evenly, from an hour its own dice set once: the Thursday caravan).
- **What**: a settlement ('base') sends a caravan and a patrol by turns. A fight place is one of the region's
  legendary locations: the six of fortress size (the dam's powerhouse, Creech's hangars, Mercury's gate, the two
  solar fields, the lake intake) are HOLDS that guard their prize and only patrol; the camp-sized ones (the Apex
  landfill, the fossil beds at Tule Springs and Gypsum Cave, Red Rock, Valley of Fire, Gass Peak, Las Vegas Bay)
  are LAIRS that send a crew and a patrol by turns. His three agendas, nothing new.
- **Where**: a neighbour within 106 blocks (the bar's reach: Battle Brothers' 30 of 140 tiles, scaled). A caravan
  trades with a settlement; a crew goes for one it can take (a camp's crew is not enough for a town's walls); a
  patrol holds its border (a settlement's walks toward the nearest hold); a crew whose towns are all picked clean
  hunts the road instead.
- **How**: the cheapest road by the land's own minutes a block (5.376 paved, 10.752 open, 19.354 hills; water and
  peaks cannot be crossed), so a caravan from Primm to Goodsprings runs the real road and passes what it passes,
  and every party's clock is the land's (checked to the thousandth of a minute, all 2,808 parties of a year).
- **What happens, in the clock's order** (checked every five minutes, under one paved block's time, so no two
  parties slip past each other): a crew meets a caravan, an ambush (the caravan never arrives; both its towns get
  Ambushed Trade Routes); a crew meets a patrol, it is stopped; a crew reaches its town, a raid (Raided, a week);
  a caravan reaches its town, it comes in (Well Supplied, a week); every fight strikes one man down and one in five
  of the struck dies (his 9/27 death rule); a price moves when a situation begins or ends; a party within two
  blocks of a town is seen from it.
- **The dice**: on request, the settlement screen's own weekly roll (traitsFor, the same line), so the news of a
  market day is the market day you find.

**What the bar reads** (RUN TWO's wiring, not done here: slices/bohemia_bar_news.js is RUN TWO's file):

    W = BohemiaRegionNews.world(land, compass, seed)        once per game (45 ms)
    BohemiaRegionNews.near(W, {x, y}, day, {traits})        places in reach, nearest first, each with its items
    BohemiaRegionNews.items(W, 'JEAN', day, 7, {traits})    one place, newest first

An item: { kind, place, day, ago, agenda, from, to, side, price, party, cell }. kind is one of left, passing,
arrived, raid, ambush, stopped, death, price, sickness, market_day. No item carries a word: the gate refuses one.

## 4. MEASURED (the game's seed 'bohemia', its compass, 52 weeks)

| | |
|---|---|
| places | 35 |
| parties a week | 52 (2,808 a year) |
| items in the year | 5,761: left 2,756, passing 1,248, price 835, arrived 707, raid 175, death 33, ambush 7 |
| place-days with nothing to say, days 7 to 371 | **0 of 12,775** (0 without the dice too) |
| the most raided | Apex, 23 raids in the year; the five towns never (walls) |
| the world and a year | 902 ms in node |

Jean on day 30: prices back up (the Blue Diamond caravan's goods sold through), a patrol out of Ivanpah Solar going
by toward Sandy Valley a day ago, market day, a Primm caravan going by toward Goodsprings, its own caravan out to
Lake Las Vegas.

## 5. THE CHECK

gates/the_news_down_the_road_gate.js, THE NEWS DOWN THE ROAD (registered), 28/0, about 11 s. It refuses: a number
not its table's (A, nine sources); a place quiet on any day after a week of play, or a year without a raid, a price
jump, a crew passing and a death (B, the row's check); an item no party, fight or situation stands behind, a field of
words, a town not on the land (C, all 5,761); the dice's news not the screen's own roll (C2); a hold sending a crew,
a camp's crew raiding a town, a party's clock off the land's minutes, a crew setting out for a town already raided
(D); twenty seeds and both compasses the same (E); two worlds asked in different orders disagreeing (F). Three
mutations go red inside: a planted raid, every departure dropped, a planted line of words.

## 6. THE FINDING THAT PROVES US WRONG

The first run of this file made the region a war zone: lairs and holds alike sent crews at their tier's rate, and
**every settlement was raided about once a week (1,254 raids a year; Indian Springs, between Creech and Mercury,
stood raided 100 percent of the year)**. News that is always 'raided' is weather, not news. Battle Brothers' own
shape fixed it, not a typed number: legendary locations wait for you (holds patrol, never raid), small lairs prey on
villages and never on cities, and a town picked clean is not worth the walk. 175 raids a year, the most-raided camp
23 times, the towns never. The second thing it proved: patrols almost never meet a crew (15 stops in a year at
best), because two parties a day on a hundred blocks of road rarely share an hour. Battle Brothers' patrols roam for
days; ours walk out and back in hours. That is TUNING's and COMBAT's number to look at, not this file's.

## 7. WEAK, SAID

- The region's business is its own; it does not yet meet the valley's (no region caravan comes into the Mob's
  place, no valley crew goes out to Jean). The seam is the box's edge. FACTIONS [home bases] scaling to the region
  (rule 109d) is where they meet.
- Nothing is saved: the world is pure from the seed and the day, so a raid the player stops on the road is not yet
  told back to it (Battle Brothers: a party you stopped sets nothing). The hook: a stopped list passed in, as
  FACTIONS' arrival ledger takes opts.stopped.
- Every number is draft: who sends how many, the reach, the sight, the death chance. TUNING's.
- NOT IN A TAB (data and a check). The keeper saying it is RUN TWO's.

## 8. ROUTED

- **RUN TWO** ([the bar names the news], your file): load engine/bohemia_region_news.js beside the region land;
  build W once per game on the map's compass and seed; in BohemiaBarNews.list add near(W, here, day, {traits})'s
  items for the far towns (a region place is a 'base' the map opens). The rank is yours; a raid, a death, an
  ambush and a price jump are the news, a 'left' and a 'passing' are the filler that keeps no town quiet.
- **WORDS**: the kinds want lines in the keeper's voice: a caravan in, prices back up, a crew went by headed for X,
  a patrol stopped a crew on the road, one of theirs did not come back. draft:true attempts belong in
  settlement_rumours.json 'news', RUN TWO's file.
- **TUNING**: the table's new rows: sends by tier (REACH), the reach 106, the sight 2 blocks, the death chance 0.2,
  the situation's week; the patrol's out-and-back hours (section 6).
- **LIFE + CITY** (held): the phone's feed can post the same items as the world's news (ECONOMY candidate C).
- **FACTIONS**: the region's lairs and holds are the 13 legendary locations; when home bases scale to the region
  their parties can replace these.

[bb school line] Battle Brothers' world runs whether you look or not: caravans between towns, patrols on the roads,
raiders out of their lairs, and every town wears what happened to it as a situation. The region now does the same,
and a keeper reads it off the map.

[analog horror line] The caravan from Blue Diamond came in on Tuesday with the canvas still wet from somewhere it
had not rained. By Friday the shelves were bare again and the price card in the window had been written over twice,
in two different hands.
