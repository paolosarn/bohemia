# THE DELIVERY SERVICE: A DESIGN (ECONOMY, 11/2)
Ask line 296, under rule 303 (the game never makes you want to cheat). DESIGN ONLY: no game code, no live data file.
Paolo, his words: "maybe there's like a delivery system where anything you want you can get, it's just gonna be
batteries... a mini Amazon... everything I tell you is an evolving philosophy."

## THE SHORT VERSION
The Caravans already run the only road into the valley. You text them on your phone, pay half, and the thing you
want shows up at a town you pick in one to three days. It always costs more than walking to a shop that has it.
The odds that raiders hit the load are on the screen before you pay. If they hit it, you lose nothing: the load
lies on the map where it fell, yours for the half you paid if you go take it, and every battery back if you don't.

## 1. HOW THE REAL WORLD DID IT (realism first)
- VENEZUELA, 2014 to 2019. Resellers ("bachaqueros") flipped scarce basics at about 5 to 7 times the shelf price
  (InSight Crime; Fox News, a Petare vendor at 120 against a regulated 17). Families got packages through courier
  middlemen and "viajeros" who carried them as luggage, with no tracking and no insurance. LESSON: in a shortage the
  person with a vehicle and a route becomes the store. The markup is big and the risk lands on the buyer.
- SARAJEVO, the siege, 1993 to 1995. The tunnel under the airport was the one door in. Traders rented it from the
  army and got rich, and city prices still fell once it ran, yet stayed out of reach for anyone without hard money:
  meat up to $12 a pound, a Pepsi $1.50 (Christian Science Monitor, January 1995). LESSON: one controlled route makes
  things possible, not cheap, and whoever holds the route takes a cut.
- ARGENTINA, 2001 to 2002. When the banks froze, barter clubs (the Red Global de Trueque) fed millions. Then fake
  notes flooded in (IPS reported close to 90 percent forged by late 2002) and the clubs shrank fast. LESSON: a trade
  network lives on trust. A courier who cheats once is finished. That is why our refund rule lives in the world, not
  in a menu: the Caravans refund because their name is their armour.
- CONTRAST, fiction only: Mad Max convoys are armies on wheels. Real collapse couriers are small, known by name and
  paid, and they live because everyone needs them alive. That is the Caravans' canon word for word: "everyone but
  Cartel wants them alive."

## 2. HOW BATTLE BROTHERS DOES BUYING
- A town stocks what its buildings make (weaponsmith, armourer, marketplace); a bigger town carries more; shelves
  reshuffle every few days.
- Price moves by standing (about 15 percent off the buy at the top of the bar), by size (95, 102, 110 percent, our
  size_mult), and by situations: "ambushed trade routes" is +20 percent to buy and 25 percent fewer items.
- There is NO mail order. Distance is never a price field; it is paid in days, wages and food (ECONOMY Day 68).
- WHAT IT TEACHES: the map matters because shops differ. So the service must never be cheaper than walking, must
  never carry what the map hides, and its risk is Battle Brothers' own ambushed-roads number turned into odds.
- [bb] line: in Battle Brothers a caravan is a thing you guard or rob, never a thing you order from. We keep both
  of those and put an order book on top.

## 3. THE DESIGN
WHO RUNS IT. The Caravans, who already exist (records/factions/BOHEMIA_FACTION_CARAVANS.md): neutral outside-world
trade, act-one power 10 of 14, base the truck stop, they hold a schedule and not ground, the 15 north is their fuel
road, and the Cartel preys on them and taxes them. No new faction. The name is a WORDS draft: "la encomienda" in the
Caravans' mouths (they speak Spanglish; the player's own lines stay plain English, first votes).
WHERE YOU ORDER. The cracked phone, in the city view, the only place the phone lives (second votes). A message
thread with a Caravans dispatcher who has a face and a voice: text from a mouth with a portrait, nothing pops up.
The number lands on the phone the first time you meet a caravan on the road or reach a truck stop. Never in the
first minute, never forced.
WHAT YOU CAN ORDER. Every item in the game's item tables at its own worth (crowns over ten, the price table):
weapons, armour, helmets, shields, tape, meds, food, water, tools. "Anything you want," minus the list below.
WHAT CAN NEVER BE ORDERED (so towns and loot still matter):
1. Gear from the valley's six legendary places (WORLD's god gear) and any named, one-of-a-kind piece.
2. People. Hires come from the hiring post, never on a truck.
3. Batteries and cells. Money is not cargo (9/4).
4. Max HP, scars, a cure. Rule 304 stands: meds and armour yes, the body no.
5. Quest things and boss verbs. Earned, never shipped.
THE PRICE, in whole batteries, rounded up:
  worth x 1.5 base x (1 + 0.10 per road day) x (1 + the road's danger) x (1 + 0.20 on Cartel ground)
  x (1 - your Caravans standing cut, up to 0.15).
  It is never under worth + 2, never over worth x 2.5, never under any stall's buy price for that item that day,
  and always above every sell price in the valley (nobody profits by ordering and reselling). The price never reads
  your purse: a rich company pays what a poor one pays.
HALF UP FRONT. Pay half to order, the rest when you collect. Cancel free until the load leaves the truck stop.
THE WAIT, on the map's clock: the road days from the nearest truck stop to your town, rounded up to the half day,
  plus half a day to load. Top-tier gear comes down the 15 from outside: one more day. Most orders: 1 to 3 days.
WHERE IT ARRIVES. Any town you have been to, at its Caravans post on the settlement screen. Two open orders at
  most, the same as two jobs at once (rule 228b). Unclaimed after 7 days: the Caravans take it back and return the
  deposit minus 10 percent of the price, and the order screen says so first.
THE RISK, SHOWN FIRST. Before you pay, the screen says it plainly: "1 in 12 loads on these roads gets hit." The
  odds come from the worst road stretch: safe roads 2 percent, ordinary 8, ambushed 20, Cartel ground +5, never
  over 30. A tracking dot moves on the map so you watch it come.
NEVER A SCAM. A raided load is a THING at a PLACE with PEOPLE: it lies on the map where it was hit, with the
  raiders' tracks, for 5 days. Take it back and it is yours for the half you already paid. Let the days run out and
  every battery of the deposit comes back. A raid costs time, never money. The punishment buys a story.
FAIR IN THE FIRST HOURS. The price is a multiple of worth, so cheap gear stays cheap (a knife is 5). Roads near
  home are mostly safe, so the odds start low. The real gate on great gear is its price.
FAIR LATE. Standing with the Caravans cuts up to 15 percent, the cap of 2.5 times worth stops it running away, and
  the money supply is the cells (Day 8), so prices do not climb with your wealth. A company that keeps falling
  (rule 304) can always re-gear: armour and meds are always one text away, at a price.
WORKED EXAMPLE. A warscythe, worth 70. Two road days, ordinary roads, not Cartel, neutral standing:
  70 x 1.5 x 1.2 x 1.1 = 138.6, so 139. Pay 70 now, 69 at the post. Odds 8 percent. Wait 2.5 days. A shop that
  stocks it asks about 70 to 90, so the extra 50 to 70 is the price of never walking there.

## 4. THE NUMBERS (proposed shape for records/target/bb/delivery.json; NOT WRITTEN, draft)
| key | default | why |
|---|---|---|
| markup_base | 1.5 | above Battle Brothers' dearest town price; far under the real 5 to 7x, because fair beats real here |
| per_road_day | 0.10 | distance is paid in days in Battle Brothers; this charges a courier's days instead of yours |
| danger_add | safe 0, ordinary 0.10, ambushed 0.20 | ambushed is BB's own +20 percent ambushed-routes buy number |
| cartel_cut | 0.20 | canon "Cartel: preyed-taxed"; the same 20 so a cut road and a Cartel road read alike |
| standing_cut_max | 0.15 | BB's buy drop at the top of the relation bar (price_table.json buySideDropAtTopOfBar) |
| floor_over_worth | 2 | a carry is never free |
| price_cap_x_worth | 2.5 | rule 303: costly, never out of reach |
| round | up | a sale floors, an order rounds up: the house wins by one battery, never more |
| deposit_share | 0.5 | real couriers want money first; half keeps a raid from ever being a loss |
| load_days | 0.5 | one of our days holds 4 to 6 of Battle Brothers' (the pace math) |
| outside_days | 1 | top tier comes down the 15 from outside the valley |
| max_open_orders | 2 | matches two jobs at once (rule 228b) |
| hold_days | 7 | a week at the post, then it goes back |
| unclaimed_cut | 0.10 | shown first; the only way to lose batteries is to forget |
| raid_odds | safe 0.02, ordinary 0.08, ambushed 0.20 | ambushed reads BB's "many a caravan has been ambushed" |
| raid_cartel_add | 0.05 | the Cartel preys on the Caravans by canon |
| raid_odds_max | 0.30 | never "probably lost" |
| raided_load_days | 5 | long enough to reach it, short enough to matter |
| raided_refund | 1.0 | the whole deposit, always |
| never | god_gear, named, people, cells, max_hp, quest, boss_verb | the map keeps its secrets |
| unlock | first caravan met or first truck stop reached | never in the first minute |
Every felt number above also goes into TUNING's one numbers table, with a gate holding the two equal (the way the
post's 4 percent works). The file is the mod surface: a modder edits one file.

## 5. WHO BUILDS WHAT, SMALLEST FIRST
1. ECONOMY: the data file, then one pure price function (a quote: item and route in, price lines, half, days, odds
   out), then its gate: never under a stall's buy, never at or under any sell, never over the cap, a raid always
   refunds in full, nothing on the never list can be quoted. No screen.
2. WORDS: the dispatcher's lines, all draft:true: hello, the quote read out, "it left", "it's at the post", the raid
   voice note, the name.
3. UI: the phone thread: items by kind, the quote as plain lines (worth, road, danger, cut, total, half now), the
   odds as "1 in N", two open orders, the tracking dot.
4. WORLD: the load as a real thing moving on the map clock from the truck stop, the raid roll per road stretch, a
   raided load as a place on the map with tracks, and collection at the town's Caravans post (RUN wires the tap).

## 6. FORKS FOR PAOLO (the coordinator asks him; the realistic default leads)
F1. THE BEST GEAR. A) Price is the only gate: if you have the batteries, they bring it (real: the tunnel sold to
    whoever paid). B) The top tier needs the Caravans to like you first.
F2. RIDE ALONG. A) You can ride with your own load as its guard: the danger part of the price drops away and a raid
    is a fight you are already in (canon: escort is what the Caravans want from you). B) No riding along.
F3. WHERE IT LANDS. A) Any town you have been to; Cartel ground adds the Cartel's cut. B) Only towns with a truck
    stop or swap meet, so where you pick up matters more.

## ANALOG HORROR LINE
The order is typed on cracked glass. The dispatcher's voice notes come with tape hiss and a diesel idling under
them, sound from real material. The tracking dot pings like a radio every map hour. A raided load is a voice note
that cuts out mid-word and a dot that stops blinking.

## SOURCES
- InSight Crime, black-market basics at 400 to 500 percent: https://insightcrime.org/news/brief/organized-crime-exacerbates-food-shortages-in-venezuela/
- Fox News, Petare prices: https://foxnews.com/world/hit-by-shortages-venezuelans-pay-up-to-7x-regular-prices-in-the-black-market
- Caracas Chronicles, "I'm a bachaquero": https://caracaschronicles.com/2014/11/14/im-a-bachaquero
- Encomiendas and viajeros: https://shippinglabel.co/ship-to/venezuela
- Christian Science Monitor, Sarajevo shops, Jan 1995: https://csmonitor.com/1995/0110/10061.html
- Sarajevo Tunnel: https://en.wikipedia.org/wiki/Sarajevo_Tunnel ; FAMA oral history: https://famacollection.org/sarajevo/mapping-a-besieged-city-e/ktmsa-4-28
- Andreas, Blue Helmets and Black Markets: https://www.wilsoncenter.org/publication/353-blue-helmets-and-black-markets-the-business-survival-the-siege-sarajevo
- Argentina's barter network: https://wiki.p2pfoundation.net/Argentine_Social_Money_Movement ; IPS on the forgeries: https://www.ipsnews.net/?p=1646 ; Truthout: https://truthout.org/articles/barter-networks-lessons-from-argentina-for-greece/
- Battle Brothers (library): bb_all/0827 Game Guide, bb_all/0054 Ambushed Trade Routes, bb_all/2018 Trade, via
  records/target/bb/price_table.json and stall_prices.json; ECONOMY Day 68 (a day's travel is a price).
