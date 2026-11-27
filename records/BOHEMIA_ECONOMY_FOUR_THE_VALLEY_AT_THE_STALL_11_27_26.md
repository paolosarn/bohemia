# THE VALLEY AT THE STALL (ECONOMY FOUR, 11/27/26; VAMILY rule 485(b), rule 480(b), the handoff's job 1)

ECONOMY THREE's handoff, job 1: 'PRICES WITH WHAT IS SCARCE ACROSS THE VALLEY: the map's trading hub (CITY_WORLD mktAdvanceDay,
valleyRunsOut, the valley's stocks) and the stall's day should be one story: a town short on the hub pays more at its stall and puts
out less; a caravan's arrival restocks.' Rule 485(b), Paolo 11/26: 'prices move with what is scarce'.

## 1. MEASURED FIRST (the demo, a new crew, valley K7QM9X, the map's own clock run 30 days)

- THE VALLEY HAS ONE LEDGER (MKT_LEDGER, engine/bohemia_economy.js; 104 people counted round the nearest hub). Days of supply left:
  food 8.5 at the start, 0 from day 11 and for good (the valley's scavengers bring in 0.15 a head a day against 1 eaten); meds 30.3,
  0 by day 31; water 59.6 falling a day a day (the pumps barely move it); fuel 69.8. The nightfall card says THE FOOD IS GONE and
  the phone counts the last days down (BOHEMIA_FORETOLD).
- AND EVERY STALL IGNORED IT: 30 nights of food at Caravans on day 40 at the price of day 1. Two stories that never met.
- THE CARAVANS (engine/bohemia_parties.js, 10 of the valley's 28 parties) go to 7 of the 13 towns: Mob (2), Trades (2), Colorful
  (2), Network, Reds, Volunteers, Blues. Anarchists, Caravans, Cartel, Church, Homeless and Remnants get none. Caravans' own fortress
  is off every road.
- THEY ARRIVE VERY OFTEN: 3,375 arrivals in 30 days. Mob, Network, Reds and Volunteers are 3 to 5 cells apart at 89 cells a day, so
  their caravans shuttle about ten times a day each (Mob 30 arrivals a day, Blues 4 to 5). ROUTED TO WORLD 13 below.
- TWO SEATS ARE NOT THEIR TOWNS: a caravan to Trades walks to (80,65), the town is at (79,62); to Colorful (61,53), the town is at
  (35,56), 26 cells away. The road is read by the caravan's own word for where it carries (its `toward`), never the cell. ROUTED.
- The valley's ledger builds in 1.9 ms, so reading it when a town opens costs no frame (rule 480(c)).

## 2. RESEARCH (cited; the running city record's research plus Battle Brothers' two cards)

- BATTLE BROTHERS: a convoy that gets in makes a town WELL SUPPLIED, '-10% buying prices, -10% selling prices, +15% items available'
  (bb_all/2199, our records/target/bb/arrival_traits.json well_supplied, 'A convoy made it in'); roads where caravans are plundered
  make it AMBUSHED TRADE ROUTES, '+20% buying prices, +10% selling prices, -25% items available' (0054); 'caravans reaching a
  destination raise both towns' resources, villages out of resources stop sending them' and 'locations restock every 3 days ... based
  on their current resources' (0626_Developer Posts.txt); a raid halves what is for sale (1626); Sickness doubles food (ours, 2.0).
- SARAJEVO 1992-96: the sellers were whoever could cross (Andreas, Wilson Center); two pounds of potatoes $50 (JTA); when movement
  opened in 1994, siege prices collapsed (Christian Science Monitor 1994). Where the trucks come the price comes down; where they
  do not it is the siege.
- THE VALLEY'S OWN LEDGER prices flat at 30 days of supply or more and climbs under it (scarcityMult): one threshold for both.

## 3. BUILT (BUILD 11/27q - THE VALLEY AT THE STALL)

- THE NUMBERS (records/target/bb/stall_prices.json the_valley, each with its source): calm at 30 days; OFF the roads the need rises by
  half of how far the valley has run down (need 1.5 when it has none: between Ambushed Trade Routes' +20% and Sickness' x2) and the
  shelf falls by half of it (Raided's half at the bottom); ON a road the town feels a quarter of that and the convoy's card
  (x0.9 need, x1.15 shelf). Food reads the scarcer of the valley's food and water (rule 209); meds its meds; rounds and tape none.
- THE ENGINE (engine/bohemia_stall_prices.js): valleyCard(file, good, valley) gives {need, shelf, down, days, road}; it multiplies the
  town's own card. restockMin(file, min, agoMin): a caravan that got in while the stall was open puts the shelf back to its dawn count
  and the town buys it down from that hour (theDay's ctx.restockMin; the answer says restocked).
- THE MAP (slices/BOHEMIA_CITY_WORLD.html __THE_VALLEY_AT_THE_STALL__): every caravan arrival the living map steps is remembered by
  the town it carried to (CARAVANS_IN, never saved, as the parties are not); valleyFor(name) reads the ledger (report(), pure; the
  nightfall mark valleyRunsOut writes is never touched), the road and the last caravan; the town is handed it when it opens and every
  hour he rests there.
- THE TOWN (slices/BOHEMIA_SETTLEMENT_SCREEN.html): the stall's need is the card's times the valley's; its day's shelf the card's
  times the valley's; the caravan's restock. HE SEES IT: the price on the BUY, the stall's own SHORT word (THEY NEED IT) or FULL UP,
  'N left today' jumping back up after a caravan, the strip's 'The Network caravan got in at 13:50.', and the keeper (when the town's
  card has nothing to say) naming the caravan, or off the roads with the valley half gone or worse, 'No caravan comes up this road'.
  Words draft:true (banks/BOHEMIA_ECONOMY_THE_STALLS_WORDS_10_26_26.json valley_*; WORDS owns them).
- WALKED (the demo upright, day 12, the valley's food gone): Caravans at first light, 4 for a night (it was 2 x its market day on a
  calm valley), 18 left, SHORT; Reds the same afternoon, 2 for a night, 12 left, 'The Mob caravan got in at 13:30'.
- WHAT IT DOES TO TRADE: food bought at a road town for 2 sells into a town off the roads at 2 to 3 for its first units of need
  (need_units unchanged: a fortress 6 a week), so carrying food from where the trucks come to where they do not is a small, real
  run. BUY VERSUS SELL's squeeze (week one's best trading under one routine contract) stays green, 45/0.

## 4. THE GATE

gates/the_valley_at_the_stall_gate.js (in the suite: data, and the demo upright). Data V1 to V8: calm changes nothing; the empty
valley off the roads: need 1.5, shelf half, a night at a town 2 -> 3; a road never dearer or thinner than off it; monotone (324 looks);
food reads water too; the caravan restock (6 left at 15:00, 13 after a caravan at 14:00); every number sourced; the valley handed in
never written. Page P1 to P4 on the demo and the alpha, upright and sideways, 4/0 each: the town is handed the valley (Caravans off,
Mob on); eleven days on Caravans' need 1.358 -> 1.5, shelf 0.642 -> 0.5, SHORT; Mob's strip names the caravan and the hour, 30 left
against Caravans' 19; no page error.
Neighbours run on this tree: THE STALL'S DAY data 8/0 and demo 4/0, BUY VERSUS SELL 45/0, THE BATTERY IS REAL 5/0, the table 'every
number is the table's', TAPE AT EVERY STALL 8/0, NO RUN ENDS FOR TAPE 20/0, THE PRICE AT A GLANCE 7/0, TRADE GOODS CARRIED 26/0;
THE SMITH MENDS 6/2 (M1, M4: the same on main, ECONOMY THREE's 11/26 measure).

## 5. ROUTED (the calls)

- RUN (and TUNING, a felt number): THE NIGHT'S BILL IS THE CALM PRICE. records/target/bb/nightly_bill.json per_man_per_night 2 says
  'one price for the same night everywhere it is bought: the stall, the bill at nightfall, the wagon's refill'. The stall now moves
  with the valley (2 on a road, 3 to 4 off it once the food is gone); the bill does not. Whether the bill should read the nearest
  town's counter (a crew eating off the roads paying the road's price) is a felt number: this lane did not move it.
- WORLD 13: caravans between neighbours 3 to 5 cells apart shuttle about ten times a map day (Mob gets 30 arrivals a day): a caravan
  that unloads ten times a day is not a caravan. A real one (Battle Brothers' and the research's) leaves, takes days, and gets in.
  And two seats are not their towns (Trades 3 cells off, Colorful 26). The stall reads whatever the map says; when caravans run
  slower, a road town's shelf will go thin between arrivals on its own.
- WORLD 15: a town off every road can SHOW it (the keeper's half shelf, no truck at the gate); a town a caravan just reached can show
  the truck being unloaded. The town is handed S.valley.from and agoMin (minutes since it got in).
- FACTIONS / WORLD 13 (later): Battle Brothers' Ambushed Trade Routes is a road where caravans are plundered. Nothing on the map
  wrecks a caravan yet; when something does, the town it was going to should lose its road (the map's valleyFor reads road from the
  parties: a wrecked caravan is simply not one going there).

[bb Battle Brothers: Well Supplied when a convoy gets in (-10% both ways, +15% items), Ambushed Trade Routes when caravans are
plundered (+20% buying, -25% items); ours, the same two cards read off the map's own caravans, scaled by how far the valley has run
down, and a caravan in today refills the shelf.]
[analog horror: the price chalked over twice on a board with no truck behind it; a shutter half down at noon on a town nobody drives to.]

## 6. AMENDED WITH BUILD 11/27zr (the same round)

THE CARAVAN IS SAID BY THE KEEPER, NOT THE STRIP. MEASURED with FIXES 4's 58 px strip box (11/27zq, NO LINE UNDER ANOTHER): sideways
the stall's strip is 30 px tall and its plain buy line already needs 32 (on main, before and after this build: routed to FIXES 4); the
caravan sentence made it longer still. The sentence is out of the strip; the keeper says it from his mouth with his face ('The Mob
caravan got in at 13:20. Shelf is full again, for now.') whenever his town's own card is quiet. THE VALLEY AT THE STALL P3 now walks the
first road town whose keeper says it and checks the shelf was refilled (10 of 11 at 15:00, restocked), 4/0 on the demo upright and
sideways and the alpha upright.

