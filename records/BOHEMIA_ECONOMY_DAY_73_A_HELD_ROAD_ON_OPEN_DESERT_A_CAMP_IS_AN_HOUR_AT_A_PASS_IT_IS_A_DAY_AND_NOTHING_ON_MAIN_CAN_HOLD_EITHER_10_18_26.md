# ECONOMY DAY 73: A HELD ROAD -- ON OPEN DESERT A CAMP IS AN HOUR, AT A PASS IT IS A DAY, AND NOTHING ON MAIN CAN HOLD EITHER
# Row [a held road] (the top OPEN row, rule 74), under the hold (rule 88: a page without a sheet).
# The new age (rules 112 to 117): the coordinator opened this chat; the round runs to the end with
# no check-in and no question. Research only; nothing touches the demo, the alpha or the VOTE tab.
# Nothing in this page is a felt number until TUNING's one table carries it (rule 38g); this page
# CITES the data files and the wiki, it never sets a digit. Every day figure in section 4 is a
# shortest path over WORLD's real land at the land file's own minutes (method in section 8).

## 0. THE QUESTION, IN ONE BREATH
Day 70 found that a raid empties the raided town and that the PRICE moves only when the road stays
cut (Battle Brothers keeps that price in Ambushed Trade Routes, not in Raided). Day 68 found that a
day's travel is a price. This page joins them: WHAT DOES A ROAD THE ENEMY SITS ON COST THE TOWNS AT
BOTH ENDS, and what does it cost a crew of three to go round it, in days and batteries, on the
region WORLD put on main at real kilometres (engine/BOHEMIA_REGION_LAND.json, 384 m a block). Battle
Brothers first, then the real record, then our own data files, measured.

## 1. HOW BATTLE BROTHERS DOES IT, FROM THE WIKI ITSELF
Sources (reference/library/grok/wiki/PAGES_ALL.tar.gz, bb_all/): 0054 Ambushed Trade Routes, 1727
Safe Roads, 0666 Drive Away Bandits, 0667 Drive Away Barbarians, 0670 Drive Off Nomads, 1048
Hunting Lindwurms, 1529 Patrol, 0834 Getting Started, 2018 Trade, 1244 Market prices for various
items, 1764 Settlement situations, 0626 Developer Posts, 1623 Raid Caravan; and
reference/library/battle_brothers/01_WORLDMAP.md.

**1a. THE TWO CARDS, WHOLE.**
| card | buying | selling | items | the card's own words |
|---|---|---|---|---|
| Ambushed Trade Routes (0054) | +20% | +10% | -25% | 'The roads leading here are unsafe of late, and many a caravan has been ambushed and plundered. With little successful trade, the selection of goods is lower and the prices higher.' |
| Safe Roads (1727) | +10% | +10% | +10% | 'The roads leading here have been reasonably safe of late, which allowed for many a profitable trade to be made and the settlement to prosper somewhat.' |
Read both cards from the player's side: a cut-off town is DEARER to buy in, BETTER to sell into, and
EMPTIER. A safe town is also dearer to buy in and better to sell into, but FULLER. Neither card
makes anything cheaper. Selling percentages multiply onto the relation price (1764: a 19.6% sell
modifier becomes 21.6%; 1244: 19.69% to 21.66% at a City Hall at 100 relation).
THE WIKI DISAGREES WITH ITSELF ONCE: the Market prices page (1244) lists 'Safe Roads (9%)' for
selling where the Safe Roads card prints +10%. This page keeps both and picks neither.

**1b. WHAT SETS AMBUSHED TRADE ROUTES: A CAMP, AND IT ENDS WHEN THE CAMP DOES.** No page says a
dice roll. Four contract pages say what CLEARS it, and each one is killing the thing on the road:
- Drive Away Bandits (0666) and Drive Away Barbarians (0667): 'If you destroy their camp, the
  settlement will no longer have ambushed trade routes.'
- Drive Off Nomads (0670): 'there is a 50% chance that settlement will no longer have ambushed trade
  routes.'
- Hunting Lindwurms (1048): 'If you kill the lindwurms, the settlement will no longer have ambushed
  trade routes.' (A beast on the road counts the same as a camp.)
- The study page (01_WORLDMAP.md): 'clear the camp, the ambush situation ends and prices fall.'
- The developers (0626, Developer Posts): 'Killing of a spawnpoint of enemies close to trade routes
  will definitely help the villages as it reduced the frequency of caravans getting raided'; 'the
  AI prefers to lay in ambush in the forest tiles near roads'; 'the guard towers and castles send
  out patrols to secure roads... the bandits will have a really hard time messing with the caravans'.

**1c. WHAT SETS SAFE ROADS: YOUR PATROL.** Patrol (1529): '33% chance: The settlement you patrol gets
the safe roads settlement situation.' Getting Started (0834): 'settlements that you patrol get the
Safe Roads situation, which gives some solid buffs including more shop item availability.' So the
good card is a thing the PLAYER causes, and the bad card is a thing the player can END.

**1d. HOW LONG: THE WIKI DOES NOT SAY, FOR EITHER.** No page in the library gives a day count for
Ambushed Trade Routes or Safe Roads (Day 71's 44-row table carries no day count for either, for the
same reason). The contract pages tie Ambushed to its CAUSE: it stands while the camp stands. This page
does not guess a number. (The game's forum is not reachable from this container; nothing from it is
cited.)

**1e. THE CARD SITS ON ONE END. THE OTHER END LOSES THROUGH ITS WEALTH, NEVER ON A CARD.** The card
is 'the roads leading HERE': the cut-off town. The town at the other end of the same road gets no
card. What it loses, the developers say plainly (0626):
- 'Caravans reaching a trade destination indeed increases resources for BOTH trade partners.'
- 'No enemy raiders spawning = no caravans getting raided = more income/wealth for the villages =
  more supplies for you and more militia for the village.'
- 'Villages stop spawning caravans when out of resources.'
- 'An Orc camp sends out raiders that successfully raid a couple of caravans and bring home a lot
  of supplies. Now the camp buys even more raiders so it can raid more caravans and so on.'
So a held road in Battle Brothers is a slow loop: the camp eats the caravans, BOTH towns get poorer
(fewer resources means thinner shops and fewer militia), the poorer towns send fewer caravans, and
the camp grows. Only the town the road leads into shows it as a price.

**1f. THE MERCENARY'S READ, IN THE WIKI'S OWN WORDS.** Getting Started (0834): 'If you find a city
that has this effect, you might want to hold off on completing their contracts to drive off bandits
or beasts so you can take advantage of their dire situation. You're a mercenary after all, and where
there's strife, there's extra coin.' Trade (2018): 'Ambushed trade routes however can be used to
your advantage as it raises the prices at which you sell wares too... A poorly supplied city will
make you richer... but you won't find as much equipment there and it will be expensive.' The card is
a choice: sell into the hurt town, or clear its road. And the player can BE the camp: the noble
contract Raid Caravan (1623) pays to 'raid the caravan going from settlement A to settlement B', full
pay only if nobody escapes.

**1g. WHAT THE CARD IGNORES: THE GROUND.** Battle Brothers' card is a flag on a town. It does not ask
whether the road runs through a pass or across a plain; the cost of going round is paid separately,
in days, by the map's own speeds (01_WORLDMAP.md: 'roads fastest, plains, then forest and hills
slower'). Section 4 measures that second half on our land, because it is the half Battle Brothers
leaves to the map, and our map is now real.

## 2. THE REAL RECORD: WHAT A HELD ROAD DID AT BOTH ENDS
A caution first, stated once: the outside pages could not be opened from this container (the
fetch is refused), so every figure in this section is as quoted in search-engine extracts of the
named source, not read off the page. Each carries its source so TUNING can spot-check before a row
cites it. Where two sources disagree, both are kept. 'Not found' means the round looked and did not
find it; nothing is filled in.

**2a. SOUTH AFRICA, JULY 2021: THE N3 (Durban to Johannesburg).** Twenty-three trucks burned at the
Mooi River toll plaza on the night of 9 July; the N3 between Cedara and Harrismith closed from 11
July; the whole Cedara to Heidelberg stretch reopened 16 July, about seven days (N3 Toll Concession,
via arrivealive.co.za news 54652). The refinery that makes 35% of the country's fuel (Sapref) shut on
13 July (BusinessTech).
- THE CUT-OFF END (Durban): bread at R20 to R40 a loaf from resellers while the bakery said its own
  price had not changed (The Herald, 19 July); tomatoes R200 a pocket, toilet paper R180 for six,
  baby formula R180 a tin (TimesLIVE, 20 July); price-gouging complaints to the Competition
  Commission passed 1,000 (TimesLIVE, 10 September). The price rose at the EDGE, in the reseller's
  hand, not at the maker. Normal prices before the unrest: not found.
- THE SUPPLY END (KwaZulu-Natal's farms): about 2 million litres of milk a day could not be moved
  (Milk Producers' Organisation, 15 July: production stuck, not measured dumping); one Mooi River
  farm destroyed about 500,000 litres in 48 hours (DairyGlobal); every KwaZulu-Natal sugar mill
  closed and 353,000 tonnes of cane were burned, more than R211 million at R600 a tonne (SA
  Canegrowers, 14 July); day-old chicks were put down as cold stores filled (SAPA, 15 July).
- Detour cost: not found. Recovery dates for prices: not found.

**2b. BRITISH COLUMBIA, NOVEMBER 2021: THE FLOODS.** Highways 1, 3 and 5 and both rail lines to the
port were cut from 15 November (AMTA); the Coquihalla reopened to trucks on 20 December, 35 days
after the storm, and to everyone on 19 January 2022.
- THE CUT-OFF END: fuel capped at 30 litres a visit from 19 November to 14 December (Globe and
  Mail); 41% of British Columbians surveyed saw empty shelves against 20 to 22% nationally
  (Charlebois survey, Global News); Statistics Canada says the November price index barely moved
  because most prices were collected before the floods (The Daily, 15 December). The shelf moved
  first and the measured price barely at all.
- THE SUPPLY END: dairy farms in Abbotsford, Chilliwack and the Interior were told to dump milk,
  70 to 80% of a day's 2.2 million litres (BC Milk Marketing Board, CBC); 42 ships at anchor
  including 16 grain ships (Grainews); warehouses across Canada filled with goods that could not
  reach the port (Reuters, 23 November).
- THE DETOUR: going round through Washington State added about two days a trip for a carrier with
  350 drivers (Reuters); flying seafood to Calgary cost three to four times trucking it (CBC); an
  idle truck cost about C$1,200 a day (Manitoba Trucking Association).

**2c. SARAJEVO, 1992 TO 1996: A SIEGE'S SUPPLY LINE, AND WHAT OPENING IT DID.** Inside the line, July
1993: flour 10 Deutschmarks a kilo, cooking oil 30 (FAMA chronology); sugar 70 a kilo (Vreme,
mid-1993); fuel about 30 a litre (Peter Andreas, Blue Helmets and Black Markets, Cornell 2008). The
detour was a hole: the tunnel under the airport, about 800 m, dug March to June 1993, about 30 tonnes
of goods a day (Andreas for the tunnel; the tonnage from a weak source). Andreas: fuel bought cheap
outside sold for 'many times' more inside, and the tunnel made prices inside FALL. When routes opened
under the 23 March 1994 accord, coffee went from 120 Deutschmarks a kilo on 7 March to 40 on 21 March
(FAMA) and onions fell to a tenth (Christian Science Monitor, 20 June 1994). THE REOPENING IS THE
FASTEST PRICE MOVE IN THE WHOLE RECORD: two weeks, two thirds off.

**2d. THE CLEANEST BOTH-ENDS CASE: COLOMBIA'S VIA AL LLANO, 2019.** The highway from Bogota to
Villavicencio closed by landslides from 14 May 2019, partly reopened 17 September (El Espectador).
- THE SUPPLY END (the plains, about 80% of Bogota's cattle, Fedegan): live cattle FELL about COP 300
  to 400 a kilo from the glut (El Espectador, 17 June; El Pais); in a 2023 repeat, Meta's cattle
  prices fell 25% in two weeks (CONtexto Ganadero; weaker demand also played a part).
- THE CUT-OFF END (Bogota's wholesale market): yuca up about 10%, plantain about 6.5% (Agronegocios;
  the year is not confirmed). A study of the closures from 2014 to 2024 put Bogota's wholesale food
  prices about 2% higher during a closure and found the effect small elsewhere BECAUSE OTHER ROUTES
  EXISTED (Banco de la Republica regional working paper 343, as quoted; to be checked).
- THE DETOUR: 6 to 12 hours against 2.5 to 3 normally; 262 or about 320 km against 137 (two sources
  disagree); trucking costs up 40% (Noticias RCN, May 2019); the state paid the extra fuel and cut the
  detour's tolls by up to half.
- And the same shape at sea: Ukraine's farm-gate wheat fell from $273 a tonne (2021) to $188 (2022)
  to $140 (2023) when the ports closed (USDA AMS), the land detour to Constanta costing 160 to 180
  euros a tonne against 40 to 45 dollars before (DW).

**2e. THE ORDER, READ ACROSS ALL FOUR.** (1) A held road raises the price at the CUT-OFF end and
LOWERS it at the SUPPLY end, at once; the economists' name for it is the law of one price: the gap
between two markets cannot stay wider than the cost of carrying goods between them, so when the
carrying gets dearer the two prices drift apart (Fackler and Goodwin 2001, Handbook of Agricultural
Economics vol. 1 ch. 17; the reverse case, railways closing the gaps, is Donaldson 2018, American
Economic Review 108(4-5)). (2) The supply end's loss is real money and often bigger than the cut-off
end's: milk poured out by the million litres, cattle cheaper by the kilo, a farmer's wheat down a
third and then a half. (3) The detour is paid in days and freight (two days a trip, +40%), and where
there is another route the price barely moves (Bogota's 2% and 'small elsewhere'). (4) When the road
opens the price falls FAST (Sarajevo: two weeks, two thirds off). (5) The rise at the cut-off end shows
up first at the EDGE (the reseller's bread, the empty shelf) and late or never in the measured price.
Battle Brothers' card is (1) at ONE end; (3) it leaves to the map; (4) it has (the card ends the day
the camp dies and 'prices fall'); (2), the supply end's glut, is the one thing it leaves out, and it
is the half the record shows most loudly.

## 3. OURS, MEASURED ON MAIN: NOTHING CAN HOLD A ROAD

**3a. THE CUT ROAD IS A THIRD OF ONE CARD IN A FILE NOBODY CALLS. PROVES US WRONG (this lane's own
line).** records/target/bb/price_table.json is this lane's file (ECONOMY [the price table at ten to
one]). Its situationMultipliers block carries:
| entry | what the file holds | what the card prints | missing |
|---|---|---|---|
| ambushedTradeRoutes | sellBonus 0.10 | buy +20%, sell +10%, items -25% | the buy half and the items half |
| safeRoads | sellBonus 0.09 | buy +10%, sell +10%, items +10% | the buy half, the items half; the 0.09 is the Market prices page's, not the card's |
And engine/bohemia_pricetable.js situationMultiplier(name) is exported and has ZERO CALLERS on main
(git grep: the only other hits are two TUNING seed banks quoting the file in a comment and the
MODS schema page listing it). Day 68 of this lane wrote 'Our price table already carries this
(situationMultipliers.ambushedTradeRoutes)'. It carries one number of three, and nothing reads it.
TUNING's research table (records/BOHEMIA_TUNING_SELL_RATIO_TABLE_10_10_26.json) carries buy and sell
right for both (20/10, 10/10) and no items line.

**3b. THE SETTLEMENT SCREEN HAS NO ROAD STATE.** records/target/settlement_traits.json (RUN TWO) holds
five traits: raided, sickness, market_day, conquered, well_supplied. Three are ledger-caused (Day 70's
fix landed: raided reads the ledger at the wiki's numbers), two are dice. None is a road.

**3c. THE LEDGER WRITES TWO ARRIVALS AND NO INTERCEPTION.** records/target/bb/arrival_traits.json
(FACTIONS): a crew that reaches a place sets Raided; a caravan that reaches a place sets Well
Supplied, on the DESTINATION only; 'a party you stopped on the road sets nothing'. Battle Brothers'
'BOTH trade partners' (1e) is half kept: the arriving end gains, the sending end does not.

**3d. TWO PARTIES CAN MEET IN ONE MODULE, AND THAT MODULE IS IN NO PAGE.** engine/bohemia_parties.js
advance() walks every party one cell a step toward its own target and back; near() compares a party
with the player only. A crew is sent at a hostile TOWN (sendFrom: 'a place with a feud sends a CREW
at the worst of them first'), never to a road. The one place two parties meet is FACTIONS'
engine/bohemia_war.js meetings() ([houses at war]): two hostile parties within one cell make a
'war' event (the stronger breaks the weaker) or, when the graph says hostile but not at war, a
'tax' event (the stronger taxes, nobody is broken; gates/war_gate.js line 49: a Cartel crew taxes a
caravan). That is Battle Brothers' interception, the first step of its loop (1e), already written.
Measured: no slice loads bohemia_war.js, and meetings() has no caller outside its own gate; a 'tax'
event, if it were raised, changes nothing on the caravan, which still arrives and still sets Well
Supplied. So on main no caravan is ever lost or lightened by anybody but the player, no road is ever
held, and the loop has its first step on paper only.

**3e. FACTIONS' TWO ROAD CREWS ARE THE RIGHT IDEA, IN NO LIVE FILE, AND OFF THEIR ROADS.**
records/target/bb/region_bases.json already names Battle Brothers' camp-beside-a-road twice: ROAD
CREW AT RAILROAD PASS ('a crew hides in the hills where the one road to the dam squeezes through')
and ROAD CREW AT SLOAN QUARRY ('the second hideout sits on I-15 between the city and Jean'). Two
things, measured this round:
- Nothing live loads region_bases.json: git grep finds it read by two gates
  (gates/region_bases_gate.js, gates/wants_send_parties_gate.js) and named in a comment in
  engine/bohemia_wants.js. No slice or engine file places a region camp.
- Its bearings were written in round one's frame (RUN's twelve TOWNS). Placed on WORLD's real land
  with the same rule RUN uses for a place ('on its road when one runs within twelve blocks, else the
  nearest open ground'), the Sloan crew lands on open desert at (42, 143), 19 blocks (7.3 km) from the
  nearest road; the Railroad Pass crew lands on a state route in the hills at (131, 142), 47 blocks
  (18 km) south of WORLD's Railroad Pass (105, 95), nearer Nelson (28 blocks) than the pass. Neither
  crew sits on the road it is named for.

**3f. ONE NOTE FOR WORLD.** On WORLD's land the clock's route from the Strip to Boulder City does not
run through Railroad Pass (105, 95), and a camp seated on the pass with a three-block berth costs that
trip 0.03 of a day. The real US-93 squeezes through that gap; the land's pass grid does not squeeze
it yet. Not this lane's to fix.

## 4. WHAT IT COSTS A CREW OF THREE TO GO ROUND, ON THE REGION'S OWN DISTANCES
Every row is a shortest path over WORLD's 496 by 496 land at the land file's own minutes (a road
block 5.376, open ground 10.752, hills and washes 19.354; 1,440 a day; section 8). A CAMP is a square
of blocks nobody walks into, seated ON the road, on every fourth road block of the trip outside the
valley and never covering either end; the 'cheapest seat to dearest' range is over all those seats.
The BERTH is how wide a crew keeps from it: 3 blocks (1.2 km of real ground), 8 (3.1 km), 15 (5.8 km).
EVERY ROAD HELD bans every road block outside the valley: the crew walks the whole way off the tarmac.
Batteries use Day 72's quiet day for a crew of three: 6 a day on plains at the ration counter, 7.6 to
9.1 in the desert (42, 53 and 64 a week); by the stack about 4.4 to 5.

| trip | on the road | one camp, 3-block berth (1.2 km): cheapest seat to dearest | 8-block berth (3.1 km) | 15-block berth (5.8 km) | every road held, the whole way off the tarmac | batteries for three, dearest 3-block seat (6 to 9.1 a day) |
|---|---|---|---|---|---|---|
| The Strip to Boulder City | 0.48 d, 49 km | +0.01 to +0.07 | +0.03 to +0.12 | +0.12 to +0.12 | 0.61 (+0.13) | 0.4 to 0.7 |
| The Strip to Hoover Dam | 0.60 d, 62 km | +0.01 to +0.06 | +0.03 to +0.87 | +0.09 to +0.87 | 0.84 (+0.24) | 0.3 to 0.5 |
| The Strip to Primm | 0.76 d, 78 km | +0.03 to +0.16 | +0.06 to +0.28 | +0.10 to +0.35 | 1.31 (+0.55) | 1.0 to 1.5 |
| The Strip to Pahrump | 1.04 d, 106 km | +0.05 to +0.61 | +0.09 to +0.64 | +0.24 to +0.95 | CUT OFF: no way in but the road | 3.6 to 5.6 |
| The Strip to Indian Springs | 0.91 d, 93 km | +0.02 to +0.06 | +0.09 to +0.18 | +0.18 to +0.29 | 1.50 (+0.60) | 0.4 to 0.5 |
| The Strip to Moapa | 1.09 d, 112 km | +0.01 to +0.10 | +0.07 to +0.16 | +0.17 to +0.28 | 2.34 (+1.26) | 0.6 to 0.9 |
| The Strip to Searchlight | 0.99 d, 101 km | +0.01 to +0.12 | +0.03 to +0.23 | +0.07 to +0.36 | 1.59 (+0.60) | 0.7 to 1.1 |
| The Strip to Mt Charleston Lodge | 0.63 d, 64 km | +0.03 to +0.28 | +0.06 to +0.34 | +0.09 to +0.41 | CUT OFF: no way in but the road | 1.7 to 2.5 |
| Boulder City to Hoover Dam | 0.12 d, 13 km | +0.05 to +0.06 | +0.18 | (no seat clears both ends) | 0.25 (+0.12) | 0.4 to 0.5 |
| Primm to Searchlight | 1.07 d, 63 km | +0.00 to +0.02 | +0.01 to +0.02 | +0.01 to +0.02 | 1.10 (+0.03) | 0.1 to 0.2 |
| The Strip to Echo Bay | 0.85 d, 87 km | +0.01 to +0.17 | +0.06 to +0.22 | +0.12 to +0.77 | 2.01 (+1.17) | 1.0 to 1.5 |
| The Strip to Goodsprings | 0.66 d, 68 km | +0.01 | +0.01 | +0.01 | 0.95 (+0.29) | 0.1 |

**4a. ON OPEN DESERT A CAMP IS AN HOUR.** Ten of the twelve trips cost at most 0.17 of a day (about
four hours) to go round one camp at a 1.2 km berth, about one and a half batteries for three or less. The
Mojave around the valley is flat and open; the road is fast, the sand beside it is half as fast, and
a crew steps off, walks round, and steps back on. Primm to Searchlight and the Strip to Goodsprings
barely notice (the first trip is mostly open ground already: 124 of its 163 blocks).

**4b. AT A PASS IT IS MOST OF A DAY, OR THE PLACE IS GONE.** The dear seats are all in the hills:
- PAHRUMP: a camp on NV-160's climb over the Spring Mountains (block -26, 79) costs +0.61 of a day
  at a 1.2 km berth and +0.95 at 5.8 km, nearly doubling a 1.04-day trip; with every road held,
  Pahrump CANNOT BE REACHED (the range has no way through but the road).
- MT CHARLESTON LODGE: a camp in Kyle Canyon (block -54, 9) costs +0.28 at 1.2 km; at a 12-block
  berth the lodge is cut off; with every road held it cannot be reached.
- HOOVER DAM: a camp on the descent past Boulder City (block 129, 89) costs +0.87 of a day at a
  3.1 km berth, more than doubling a 0.60-day trip.
- ECHO BAY: a camp in the Northshore hills (block 146, 28) costs +0.16 at 1.2 km; at a 5.8 km berth
  the seat on the open stretch costs +0.77.
In batteries for a crew of three: 1.7 to 5.6 at a tight berth (the lodge and Pahrump), up to 5.7 to
8.7 at a wide one. For a
company of twelve (Day 68: 17 to 22 a day) the Pahrump pass is 10 to 21 batteries each way.

**4c. EVERY ROAD HELD: A TRIP COSTS 1.03 TO 2.4 TIMES ITSELF.** Off the tarmac the whole way, the
ten trips that still arrive gain +0.03 to +1.26 of a day (Moapa, Echo Bay and Boulder City to the dam
double or more), and two places fall off the map.

**4d. WHAT THIS MEANS NEXT TO THE CARD.** Battle Brothers' card puts the cut-off town's buying up
20%. At ten to one with the one-battery floor (Day 70, 4b), that leaves a ration at ONE and puts a
10-battery blade at 12, a 50-battery plate at 60. So the price of going round one camp on open desert
(about 1.5 batteries or less) is less than the card's premium on a single blade, and the price at a pass
(1.7 to 5.6) is about the premium on one plate. And the other side of the card, the +10% to sell into
the cut-off town: Day 68's sack of salt at a city that does not dig it is 490 crowns, 49 batteries;
+10% is 539 crowns, 54 batteries. Five sacks walked round the Pahrump camp sell for 25 more than in a
safe town, against 3.6 to 5.6 batteries of detour for three (and 170 laid out for the salt first, Day
68). THE TRADER WHO WALKS ROUND THE CAMP WINS, on every trip in the table at every berth. That is Battle Brothers' 'where there's strife, there's extra coin',
measured on our ground, and it is a visible win (rule 117(c)).

## 5. THE PAGE'S ANSWER: WHAT A HELD ROAD COSTS EACH END, WORKED ON ONE PASS
The example is the dearest road on the map (section 4b): a crew camped on NV-160's climb, between the
Strip and Pahrump. Every number is the wiki's card at ten to one with the floor (Day 70, 4b), Day 68's
salt, or section 4's measure. Nothing is set.
| who | what the card does (Battle Brothers) | what the record adds (section 2) | in batteries |
|---|---|---|---|
| THE CUT-OFF END (Pahrump) | buying +20%, selling +10%, items -25%, while the camp stands | the shelf goes before the tag; the rise shows at the edge first | a ration stays ONE (the floor); a grain stack 5 to 6, a bread stack (6 or 7) to about 8; a 10-battery blade 12; a smith's eight blades six; a salt sack sold in 49 to 54 |
| THE SUPPLY END (the town the goods come from) | no card; its 'resources' fall as its caravans die (1e) | its own goods cannot leave: they pile up and sell CHEAPER at home, and what spoils is poured out | no number on main; the record's farm-gate falls: Meta's cattle a quarter in two weeks (2023), Ukraine's wheat a third in one year and nearly half in two; what spoils, all of it |
| THE CREW IN BETWEEN | the map's speeds (1g) | two days a trip round, +40% freight (2b, 2d) | +0.61 of a day round the camp at a 1.2 km berth, 3.6 to 5.6 for three; or through it, a fight |
| THE DAY THE CAMP DIES | the card ends, 'prices fall' (01_WORLDMAP.md); Safe Roads possible after a patrol | the fastest price move in the record (coffee two thirds off in two weeks) | the stacks and the blade back where they were, the rack back to eight; with Safe Roads the rack is nine (items +10%) |

THE SHAPE, IN ONE LINE: a held road makes the far town EMPTY AND DEAR, the near town FULL AND CHEAP,
and the road between them a day long at a pass and an hour long on the flat. Battle Brothers draws the
first; the record draws the second; our land, measured, draws the third.

## 6. CANDIDATES FOR TUNING'S ONE TABLE (none picked; rule 38g)
- **A. BATTLE BROTHERS' CARD, WHOLE, AND ITS CAUSE.** The cut-off town carries Ambushed Trade Routes
  (+20 buy, +10 sell, -25 items) while a hostile camp or party holds a road into it, and loses it the
  day that camp is destroyed (the four contract pages). No clock: the cause is the clock (1d). The
  supply end carries nothing. The cheapest to build: it is a ledger trait like Raided (Day 70).
- **B. BOTH ENDS (the record's).** A, plus the SUPPLY end: while its road is held, the goods it makes
  buy cheaper there (the record: Meta's cattle a quarter off in two weeks, Ukraine's wheat a third off
  in a year; 2d), and anything that spoils is lost. It is the half the record shows most loudly (2e). Under rule
  117 it is also a gift: a cheap town the player can find, then carry from, round the camp.
- **C. THE GROUND DECIDES (ours, measured).** The card lands only where going round is dear: where a
  camp's detour is a large share of the trip (on WORLD's land that is the four passes in 4b: Pahrump,
  the lodge, the dam, Echo Bay at a wide berth). On open desert a camp on the road is a party to meet
  or walk round, not a town state, because ten of twelve trips go round it in about four hours or less. The
  Bogota study's 'small elsewhere because other routes existed' (2d) is the record saying the same.
- **THE WIN, ANY OF THE THREE (rule 117(c)).** The day the camp dies is the player's: the card ends
  at once (BB), the rack goes from six to eight and, with Safe Roads after a patrol, to nine (items
  0.75 to 1.1, about half again on the shelf). The keeper says it out loud (bank line X8). Under rule
  117(a) the cut-off premium starts at or under Battle Brothers' +20% and the sell bonus at or over
  its +10%, never the other way.
- **THE DAYS.** If TUNING wants a clock as well as a cause: Day 70's three days (the wiki's raid and
  its market restock) is the only day count the wiki gives for any situation; the record's held roads
  lasted 7 days (the N3), 35 (the Coquihalla to trucks), about four months (the Via al Llano) and four
  years (Sarajevo). Nothing picked.

## 7. ROUTED
- TUNING [the 32 situations] and the one table: Ambushed Trade Routes and Safe Roads as whole rows
  (buy, sell, items; the 9 against 10 disagreement kept with both pages); duration 'while the cause
  stands' with the four contract pages; the section 4 table as the measured cost of going round;
  candidates A, B, C; the rule 117(a) direction for both numbers.
- FACTIONS [houses at war] and [the region's bases]: (1) bohemia_war.meetings() is BB's interception
  already written and has no live caller; a 'tax' on a caravan changes nothing on it (3d). (2) The
  two road crews in region_bases.json sit 7.3 and 18 km off their roads on WORLD's real land (3e);
  re-seated on WORLD's cells (Railroad Pass at 105, 95; I-15 between Sloan at 38, 103 and Jean at 10,
  150) they become exactly Battle Brothers' camp beside a road. (3) Nothing sends a crew TO a road.
- WORLD [the region]: 3f (the clock's route to Boulder City misses Railroad Pass; holding the pass
  costs 0.03 of a day); the two places with no way in but the road (Pahrump, the lodge) are the map's
  natural chokepoints; Day 68's 'made here' flag decides which end of a road is the supply end.
- RUN TWO [a place has traits]: a road trait, ledger-caused like Raided, never dice; its keeper lines
  are the bank lines below.
- ECONOMY (this lane, after the hold): price_table.json's two road entries carry one number of three
  each (3a); the fix is the card's own numbers with their pages, in this lane's file, when rule 88
  lifts; and Day 68's 'already carries this' line is wrong and stands corrected by this page.
- WORDS and UI: eight bank lines, draft:true, for the cut-off keeper, the supply end, the hauler, the
  guide on the flat and the morning the camp is gone.
- RUN [the region]: section 8's route function is RUN's own regionRoute with a blocked set added; a
  'two days out, about nine batteries' readout (Day 68) gets its detour line from the same call.

## 8. METHOD (so anyone can run it again)
A node script in the round's scratchpad, reading main as it is and writing nothing: it loads
engine/bohemia_region_land.js with engine/BOHEMIA_REGION_LAND.json (east is x1, the unmirrored
compass), builds every block's minutes with L.at(x, y).minutes (none where the pass is 3: water, a
peak), and runs Dijkstra over four neighbours where a step costs the entered block's minutes, which
is slices/bohemia_region.js regionRoute's own rule (stepCost) in minutes rather than road units.
Days are minutes over the land file's 1,440. The Strip is block (47, 47); every other place is the
land file's own x, y. A camp is a (2r+1)-square of blocks removed, seated on every fourth block of
the unblocked route that is outside the valley, is a road block (pass 1), and is more than r+1 blocks
from both ends. 'Every road held' removes every pass-1 block outside the valley except those within
one block of either end. 338, 313 and 288 camp seats at the three berths over the twelve trips, one
shortest path each; about 45 seconds. A second script holding the named pass seats (4b) by hand gave
the same figures (Pahrump +0.608 at 3 blocks, the dam +0.868 at 8). The FACTIONS camp placement (3e)
used RUN's placer rule from placeTowns verbatim.

## 9. WHAT THIS ROUND DID NOT DO
No code, no sheet, no VOTE item (rule 88). No data file edited: price_table.json waits for the hold;
region_bases.json and arrival_traits.json are FACTIONS', settlement_traits.json RUN TWO's,
BOHEMIA_REGION_LAND.json WORLD's. No felt number into the game (rule 38g). Every battery figure is a
wiki crown figure at ten to one, a Day 68 or Day 72 figure, or a measured detour times Day 72's rate.
The berths (1.2, 3.1, 5.8 km) are measuring sticks, not candidates. Section 2's figures are search
extracts of named sources, flagged for checking. Eight bank lines, draft:true, in
banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md, section WWWWWWWWWWWWWWWWWWWWWWWWW.

[bb school line] Battle Brothers puts a held road on ONE card, on the town the road leads into
(dearer to buy, better to sell into, a quarter emptier), ties it to the camp instead of a clock, and
leaves the cost of going round to the map; the far end loses only through its caravans, slowly.
[analog horror line] The tag on the rack went up two and nobody changed it by hand; three hills over,
a man is pouring milk into a ditch because the truck that would have bought it is parked behind a
campfire on the climb.

Sources for section 2 (search extracts of the named sources; spot-check before a row cites them):
N3 Toll Concession via arrivealive.co.za/news.aspx?i=54652; The Herald 19 July 2021; TimesLIVE 20 July
and 10 September 2021, 14 July 2021 (SA Canegrowers); BusinessTech (Sapref); Milk Producers'
Organisation press release 15 July 2021; DairyGlobal; SAPA via Sowetan 15 July 2021; AMTA; Globe and
Mail (fuel cap); Global News (Charlebois survey); Statistics Canada, The Daily 15 December 2021; BC Milk
Marketing Board via CBC; Grainews; Reuters via Claims Journal 23 November 2021; CBC Calgary; Manitoba
Trucking Association; FAMA chronology (07-1993, 03-1994); Vreme via the Rutgers Serbian Digest; Peter
Andreas, Blue Helmets and Black Markets (Cornell, 2008); Christian Science Monitor 20 June 1994; El
Espectador 17 June 2019; El Pais (Cali); Fedegan; Agronegocios; CONtexto Ganadero; Noticias RCN May
2019; Banco de la Republica regional working paper 343; USDA AMS Ukraine Grain Transportation; DW
2022; Fackler and Goodwin, 'Spatial price analysis', Handbook of Agricultural Economics vol. 1 (2001)
ch. 17; Donaldson, 'Railroads of the Raj', American Economic Review 108(4-5) (2018).
