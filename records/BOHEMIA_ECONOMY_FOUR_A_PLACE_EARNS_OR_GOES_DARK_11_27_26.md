# A PLACE EARNS OR GOES DARK (ECONOMY FOUR, 11/27/26; VAMILY rule 485(b), rule 495, the handoff's job 2)

ECONOMY THREE's handoff, job 2: 'A PLACE THAT STOPS EARNING GOES DARK, ONE THAT EARNS GROWS: the faction treasuries (BohemiaPockets,
rent lands there every night since 11/26e) are each place's earning; give WORLD 15 and WORLD 16 a daily take per place (a pure function
over the pockets and the rent) and the thresholds (dark under N nights of upkeep, growing over M), cited.' WORLD 15 (handoffs/
WORLD_FOURTEEN.md): 'a place going dark is POWER's douse, which the day now shows'.

## 1. MEASURED FIRST (the demo, valley K7QM9X, 30 map days)

- EVERY TREASURY ONLY GREW: Network 652 -> 2,092, Cartel 244 -> 1,354, Mob 596 -> 1,556 (rent 30 in it), Caravans 264 -> 894,
  Remnants 484 -> 844, Church 244 -> 544, Anarchists 80 -> 110. Six took in NOTHING: Blues 260, Homeless 180, Colorful 40, Trades 20,
  Reds 0, Volunteers 0. Not one battery left any faction's pocket (drain 0 everywhere).
- NOT ONE LIGHT CHANGED: live wires on day 1 and day 31 identical (Network 48, Cartel 37, Mob 31, Caravans 21, Remnants 12, Church 10,
  Anarchists 1; the rest none). The only thing that ever doused a wire was the player's own unpaid bill or rent.
- NOTHING READS A TREASURY, so giving a place a real spend moves no other lane's number.
- THE CHARGE WAS ONE LEDGER LINE A WIRE A NIGHT (about 160 lines a night across the valley), which is why the pockets never rode the
  save: a reload refilled every treasury from the opening stock while any wire it had lost stayed dark.
- A PLACE'S MEN: its parties grow with the days (party_math.json roaming base 2 + 0.1 a day) and, for what HE meets, with his company's
  strength. Men out per faction measured on the map: day 1 two to eight, day 30 five to nineteen, day 60 eight to twenty-seven.

## 2. RESEARCH (cited)

- BATTLE BROTHERS (reference/library/grok/wiki PAGES_ALL bb_all/0626_Developer Posts.txt, the developers' own words): 'Each location
  has, say 100 resource points... then it spawns a raiding party worth 30 points. Now the location is down to 70 points... You can
  effectively bleed them dry'; 'once a spawnpoint has gathered enough resources it will send out a party that will found a new
  location... Vice versa if you keep them on low supplies they wont be able to start new locations'; 'Villages stop spawning caravans
  when out of resources'; 'the amount of resources could also slowly rise over time (through the villages normal business like
  farming, hunting etc.)'; 'Locations restock every 3 days with quality und quantity based on their current resources'; 'A really
  wealthy town will have top tier equip'; 'watchtowers and castles rely on military supply caravans... If these get intercepted
  regularly the towers and castles also get into trouble'.
- REAL: Lebanon 2019 on, generator owners cut their hours when they could not buy diesel, blackouts up to 22 hours a day (Human Rights
  Watch 2020), and sold power by the amp at 44 percent of a monthly salary (HRW 2023); Moscow 1992, kiosks paying racketeers 'kind of
  like an insurance policy' (Los Angeles Times 1992); unguarded lines are stripped for copper (our own trade good, 'stripped copper
  wire'). In a collapse, power consolidates where the money and the working grid are.
- THE ONE FINDING THAT PROVES US WRONG: the obvious build (a place's upkeep grows with its men, nothing else changes) was projected
  on the measured valley and spiralled: by day 100 the whole valley dark except Network. Battle Brothers survives that because a
  place also earns from its people and a broke place stops sending parties. Both are in.

## 3. BUILT (BUILD 11/27zq - A PLACE EARNS OR GOES DARK)

- engine/bohemia_place_book.js (one module, rule 495(b)): partyMen / menOut (a place's men by the days alone, never his strength),
  spendOf (the night's bill a man, handed in), night (pays its men; short: one wire out, keeps only the men its take can feed; a month
  of keep in the bank and a week that paid: relights one it lost and takes a man back; BROKE, GETTING BY or WELL OFF; the shelves),
  pickDouse (the farthest wire from its seat), pickRelight (the nearest it lost).
- records/target/bb/place_book.json (sourced): keep_per_man and men_by_days point at the bill and the party table (no number typed
  twice); collect_nights 30 (a head pays its holder one AA a month: ruling 9/16's cell, Moscow's kiosks, Lebanon's amp); week_nights 7;
  well_off_nights 30; shelf broke 0.75, well off 1.25 (Ambushed Trade Routes' -25%, the Seasonal Fair's +25%).
- slices/BOHEMIA_CITY_WORLD.html __A_PLACE_EARNS_OR_GOES_DARK__: at nightfall after the wires' charge, the collector's round lands in
  each gang's pocket (WORLD 16's man at the doors at dusk now collects), then every seated place's night; the douse and relight go
  through POWER (they ride the save, the night lamps and WORLD 15's dead-by-day read them, nothing else patched); never a wire he pays
  for; the phone's feed says it ('Anarchists could not feed their men last night. a street of theirs went dark.', draft:true). The
  charge is one line a faction a night (the same sum), a place's pocket folds to its week, and the pockets and the book ride the save
  (17 to 33 KB). A book from an older save is filled in field by field (found: a partial entry threw the whole night).
- slices/BOHEMIA_SETTLEMENT_SCREEN.html: the town is handed its place's verdict; every shelf (the shops' stock and the stall's day)
  is a quarter thinner when the place is broke, a quarter fuller when it is well off.
- WALKED (the demo, 60 map days, no page error): Anarchists' one wire goes dark on day 16 and the feed says it; Network, Mob and Cartel
  stay lit and well off; Blues, Homeless, Colorful, Trades, Reds and Volunteers sit broke with few or no men; a night of the book
  2 to 8 ms. PROJECTED on the measured valley, 120 nights: 8 wires out (at most 8 of 160 at once), Anarchists' wire back by day 120,
  Caravans 3 of 21, Church 2 of 10, Remnants 2 of 12.

## 4. THE GATE

gates/a_place_earns_or_goes_dark_gate.js (in the suite: data, and the demo upright). Data B1 to B8 (men by the days, never his
strength; the bill's price handed in; short: one wire, keeps what its take feeds; no spiral; well off relights and takes men back, a
broke place with money takes men back within a week; farthest out, nearest back; the measured valley 120 nights bounded; every number
sourced) 8/0. Page P1 to P7 on the demo and the alpha, upright and sideways, 8/0 each: the book at nightfall with every place; the
charge one line a faction; Anarchists with an empty pocket loses its wire and the feed says it, given a month and a week gets it back in
4 nights; Network's screen handed its verdict; the pockets and the book survive a snapshot restored; a night 2 to 8 ms; no page error.

## 5. ROUTED (the calls)

- WORLD 16 (the map's parties): a broke place keeps fewer men than its parties show (PLACE_BOOK.st[faction].men against .want; Blues
  keeps 4 of 15 by day 60, Reds and Volunteers none). Battle Brothers: 'villages stop spawning caravans when out of resources'. The map
  can shrink or keep home a broke place's parties; when it does, job 1's roads follow on their own (a caravan not sent is not a road).
- WORLD 15 (the places): a broke town and a well-off one can LOOK it (the verdict is on the town's S.wealth: broke, getting_by,
  well_off, and its nights of keep in hand); the dark street already shows by day and night through POWER.
- FEED and WORDS: the valley's post is a draft line; a post when a place turns well off is theirs to want.
- TUNING (a felt number, research only): how fast the valley consolidates is collect_nights and the party table's per_day.
- PLUMBER (rule 480(c)): the nightfall now walks the grid twice (the charge and the book's wires); 2 to 8 ms measured.
- RED NOT MINE (the same on main's files): EVERY POCKET 'every payment goes through the one handoff' (2 on main, 3 here);
  PEOPLE CHARGE 'the six he killed' (WORLD's VOTE cards).

[bb Battle Brothers: a location spends its resources on the parties it sends, founds a new one when rich, stops sending when broke, and
stocks its shops by what it has; ours, the same loop on the factions' pockets, read out on the grid's lights and the town's shelves.]
[analog horror: the lamps on one street going out a block at a time, and the copper gone from the poles by morning.]
