# ECONOMY DAY 70: WHAT A RAID COSTS THE RAIDED -- THE SHELF AND THE MEN, NOT THE PRICE, FOR THREE DAYS
# Row [what a raid costs the raided] (the top OPEN row, rule 74), under the hold (rule 88: a page
# without a sheet). The new age (rules 112 to 115): the coordinator opened this chat; the round
# runs to the end with no check-in and no question. Research only; nothing touches the demo, the
# alpha or the VOTE tab. Nothing in this page is a felt number until TUNING's one table carries it
# (rule 38g); this page CITES the data files and the wiki, it never sets a digit.

## 0. THE QUESTION, IN ONE BREATH
FACTIONS built the raid ledger: a crew that reaches a place marks it Raided (engine/bohemia_arrivaltraits.js
reading records/target/bb/arrival_traits.json), a base taken by a house is marked Conquered
(engine/bohemia_war.js calls markTaken), and the raid at your own gate opens and closes in
engine/bohemia_homebases.js. What nobody wrote is THE LOSER'S BOOKS: what the raided town loses
in stock, in prices and in hires, and for how many days. The row asks it from Battle Brothers' own
raided-settlement states first, then the real record, then our swag. This page also measures
whether what the ledger writes ever reaches the counter. It does not (section 3c).

## 1. HOW BATTLE BROTHERS DOES IT, FROM THE WIKI ITSELF
Sources: reference/library/grok/wiki/PAGES_ALL.tar.gz, bb_all/ pages 1626 Raided, 0437 Conquered,
0234 Besieged, 1644 Razed, 1660 Refugees, 0054 Ambushed Trade Routes, 2179 Warehouse Burned Down,
1787 Short on Food, 1650 Rebuilding Effort, 1642 Raze Attached Location, 0553 Defend Settlement
Bandits, 0554 Defend Settlement Greenskins, 0920 Greenskins Town Destroyed, 1146 Late Game Crises,
1762 Settlement Situations.

**1a. RAIDED IS TWO NUMBERS AND NO PRICE.** The Raided page, all of it: 'This place has been
recently raided! It's suffered damage, has lost valuable goods and supplies, and lives were lost.'
Effects: **-50% items available, -50% recruits available.** That is the whole card. Battle
Brothers does NOT raise a raided town's prices. The goods are gone and the men are gone; what is
left sells at what it sold at.

**1b. IT LASTS THREE DAYS, AND THE WIKI SAYS SO THREE TIMES.** Raze Attached Location: 'The
settlement you attacked will get the raided settlement situation for 3 days.' Defend Settlement:
'the settlement will get the raided settlement situation for 3 days if you lose this fight.' The
same page family gives Conquered 'for 3 days'. And the market itself: 'the selection of market
items usually refreshes every 3 days', 'shops resupply every 3 days but situations can force a
restock'. So one Battle Brothers raid is ONE BAD RESTOCK: the town loses one cycle of its shelf.

**1c. WHO CAUSES IT.** In Battle Brothers a town is Raided only by a cause: YOU lose a Defend
Settlement fight, YOU fail to protect its attached location, YOU raze an attached location (the
player as the raider), or greenskins and undead hit it in a late crisis with permanent destruction
off ('the cities will get the specific situations for a while instead of being destroyed'). It is
never a dice roll on a calm town.

**1d. THE PRICE RISES ARE OTHER STATES, AND THEY ARE WHAT A RAID LEADS TO.** The wiki keeps the
price in the follow-on situations, not in the raid:
| state | buy price | sell price | items | food | recruits | what it is |
|---|---|---|---|---|---|---|
| Raided | -- | -- | -50% | -- | -50% | the night itself |
| Conquered | +10% | -10% | -40% | -10% | -- | a house took the town and kept it |
| Besieged | +25% | -- | -25% | price +100% | -50% | the enemy is still outside |
| Ambushed Trade Routes | +20% | +10% | -25% | -- | -- | the roads in are unsafe |
| Warehouse Burned Down | +25% | +5% | -50% | -- | -- | the store itself burned |
| Short on Food | -- | -- | -- | -50%, price +200% | -- | the hunger after |
| Refugees | -- | -- | -10% | -25%, price +25% | refugees for hire | the NEIGHBOUR that takes them in |
| Rebuilding Effort | -- | -- | quality wood -50% | -- | -- | wood price +35% |
| Razed | nothing to offer | | | | | a town with destruction off; 'will eventually return' (the wiki marks it 'verification needed') |
THE LESSON IN THE SHAPE: a raid costs a town its SHELF and its MEN. The PRICE moves only when
something keeps the shelf from refilling: the enemy still at the walls, the roads cut, the store
burned, the food gone. That is good economics, not a game simplification (section 2).

## 2. THE REAL RECORD: WHAT A LOOTED TOWN LOSES, AND IN WHAT ORDER
**2a. SOUTH AFRICA, JULY 2021 (KwaZulu-Natal and Gauteng).** About a week of looting and arson.
The property owners' association put the cost at about R20 billion in KwaZulu-Natal and about R50
billion nationally; the government counted about 30,000 jobs lost in KwaZulu-Natal and 18,000 in
Gauteng (the presidency said 'probably' 150,000 affected; PwC's baseline 50,000 at risk; the counts
disagree and this page keeps all of them). The shelves went in nights; what made it a FOOD scare
was the road: the N2 and N3 closed to freight and Durban's port (about 65% of the country's
container traffic) was hit, so the fear was of shortages until the highways reopened. Most insured
shops reopened; some mall tenants never came back (Sasria, 2024).
**2b. LOS ANGELES, 1992.** About 2,000 to 2,300 Korean-owned businesses were looted or burned in a
few days. Many never reopened; this lane found no trustworthy count of how many, and says so.
The loss that lasted was not the stock (insured, restockable) but the OWNER who did not come back.
**2c. ARGENTINA, DECEMBER 2001.** Close to three hundred stores and supermarkets looted in a week
of food riots before the 19 to 20 December uprising (Auyero, Routine Politics and Violence in
Argentina); police 'conspicuously absent, particularly when small stores were sacked'. The big
chains reopened; the corner shop was the one that had no second shelf.

**2d. THE ORDER, READ ACROSS ALL THREE.** (1) The SHELF goes in a night and comes back on the next
delivery, if a delivery can come. (2) The PRICE moves only when the delivery cannot come: the road,
the port, the warehouse. (3) The PEOPLE are the longest loss: the jobs, the owner who never
reopened, the hire who left. Battle Brothers' card is (1) plus a slice of (3), and it puts (2) in
other states. The real record agrees with that split.

## 3. OURS, MEASURED ON MAIN: THE LEDGER IS RIGHT AND THE COUNTER NEVER READS IT
**3a. THE LEDGER (FACTIONS' arrival_traits.json): THE EFFECTS ARE THE WIKI'S, THE DAYS ARE NOT.**
raided: items_mult 0.5, recruits_mult 0.5, no price, each quoted from page 1626. Exactly the wiki.
conquered: buy 1.1, sell 0.9, food 0.9, items 0.6. Exactly the wiki. BUT duration_days is 7, marked
'ours', with the reason 'not on the wiki; RUN TWO's trait period is 7 days'. **IT IS ON THE WIKI,
AND IT IS THREE** (section 1b, three pages). PROVES US WRONG: the ledger holds a raid more than
twice as long as Battle Brothers does, because the number was borrowed from the screen's dice
period instead of read off the page.

**3b. THE COUNTER (RUN TWO's settlement_traits.json): NONE OF THE WIKI'S THREE NUMBERS.**
The 'raided' trait the settlement screen applies: price_mult 1.25, stock_mult 0.6, recruits -1
(the screen reads any negative as 'nobody signs on', slices/BOHEMIA_SETTLEMENT_SCREEN.html
recruitsHere). Against the wiki: the price +25% is Besieged's or the Warehouse's, not Raided's;
the stock -40% is Conquered's; and ZERO recruits is harsher than Battle Brothers' half. Its keeper
lines are good and already say the wiki's clock: 'A crew came through THREE NIGHTS back.'

**3c. THE COUNTER DOES NOT READ THE LEDGER; IT ROLLS DICE.** The screen rolls traits per place by
its name and the week (chance_any 0.7, one or two of three traits). Measured with the screen's own
rng and seedOf over the twelve region places for 52 weeks (a node script in the round's
scratchpad, the same functions copied verbatim): **190 of 624 place-weeks read RAIDED, 30.4
percent; Pahrump 26 weeks of 52, half its year, with nobody ever raiding it.** And the other way
round: a crew that really reaches a place on the map writes a mark the counter never sees, so a
real raid costs the raided nothing at the counter. Battle Brothers' rule (1c: never a roll, always
a cause) is broken both ways at once.

**3d. WHAT IS ALREADY RIGHT AND STAYS.** Conquered from the war (bohemia_war.js markTaken): a
cause, the wiki's numbers. 'A second arrival refreshes the end day, it never doubles the effect':
the wiki's situations do not stack either. 'Never for a patrol, a party you stopped, your own base,
a party at its own home': the player stopping the crew on the road is Battle Brothers' Defend
Settlement won, so the town is not Raided. All of it is the wiki's shape.

## 4. THE LOSER'S BOOKS: A RAIDED TOWN, DAY BY DAY, IN BATTERIES
Worked from the wiki's numbers at ten to one on Day 69's counter ladder, a town counter. Nothing
here is set; it is what the data files already say once the counter reads the ledger.
| when | the shelf | the price at the counter | the hall | what the record says |
|---|---|---|---|---|
| the night of the raid (day 0) | half the items (a smith's seven blades become three or four; the stall's piles halved) | UNCHANGED: a ration still ONE, the bandage still two | half the men; the ones left are the ones who stayed | the shelf goes in a night (2d.1) |
| days 1 to 3 | still half, the keeper's line says 'three nights back' | unchanged | half | |
| day 3, the restock | the shelf comes back whole (the wiki's three-day market cycle) | unchanged | whole | the delivery came |
| ONLY IF the road is cut (a crew still camped on it; our swag, routed) | a quarter short (Ambushed Trade Routes) | +20% buying: a 10-battery blade is 12, a ration still ONE (the floor holds the small things) | -- | the price moves when the delivery cannot come (2d.2) |
| ONLY IF the town fell (bohemia_war's Conquered) | -40% | +10% buying, -10% selling | -- | a house that keeps the town keeps its cut |
| the neighbour, for the same days (our swag, routed) | -10% | food +25% (the floor makes a ration still one; a stack of six is seven or eight) | refugees for hire, cheap | the people are the longest loss, and they walk to the next town (2d.3) |

**4a. WHAT A PLAYER FEELS.** The raided town is not dearer, it is EMPTY: half the blades, half the
men, the same price on what is left. The dear town is the one NEXT to it, where the people went
and the food got thin, and the one whose road is still held. That is Battle Brothers' split and the
real record's order, and it gives a raid two places on the map instead of one.

**4b. THE ONE-BATTERY FLOOR SURVIVES EVERY STATE.** Every multiplier on the table is under +100%
except Besieged's food and Short on Food's +200%; at the floor, a ration at one becomes one, two or
three. The floor makes a raid hit the BIG purchases (a blade, a plate, a stack) and leave the day's
bread at one, except in a siege or a hunger. That is also what the record shows: the corner shop's
loaf is the last price to move and the first thing missing.

## 5. ROUTED
- FACTIONS [raids make traits]: arrival_traits.json duration_days 7 is the wiki's 3 (pages 1642,
  0553, 0554, and the 3-day market cycle on 1762); the 'not on the wiki' note is wrong. The fix is
  one number and its source line; FACTIONS owns the file.
- RUN TWO [the market] and [a place has traits]: the screen's RAIDED should come from the ledger
  (BohemiaArrivalTraits.active and effects for the place on the map's day) and NEVER from the dice;
  the dice may keep sickness and market day (rule 71's 'random variables', his word); the raided
  row's numbers become the wiki's (stock 0.5, the hall half, no price). Measured cost of not doing
  it: 30.4% of place-weeks raided by nobody, and every real raid invisible.
- TUNING [the 32 situations]: the nine states in 1d as rows of the one table, each with its page,
  and raid.duration_days 3 (the wiki's); 'the road cut' and 'the neighbour takes the refugees' as
  two candidate rows marked ours.
- WORLD [the region]: the neighbour is the nearest held settlement on the map's own distance (Day
  68's road); that is who the Refugees state lands on.
- WORDS: the keeper lines in settlement_traits.json already say 'three nights back'; they become
  true at the wiki's clock. Eight bank lines below are the attempt for the neighbour and the cut road.
- COOK FOUR: the burnt picture is three days, then gone; a town that reads burnt for a week is the
  old clock.

## 6. WHAT THIS ROUND DID NOT DO
No code, no sheet, no VOTE item (rule 88). No data file edited: arrival_traits.json is FACTIONS',
settlement_traits.json and the screen are RUN TWO's. No felt number into the game (rule 38g). Every
figure above is a wiki percentage, a count already in a data file, or the measured 30.4 percent.
The road-cut and neighbour rows are named as candidates, not picked. Eight bank lines, draft:true,
in banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md, section QQQ.

[bb school line] Battle Brothers' Raided card is two numbers, half the goods and half the men, for
three days, and no price: the price lives in the siege, the cut road and the hungry neighbour, so a
raid makes one town empty and the next town dear.
[analog horror line] The shelf is half a shelf and the tag on what is left has not changed; the
keeper still says one, and points at the gap where the rest was, three nights back.

Sources for section 2: BusinessTech on PwC's estimate (businesstech.co.za/news/trending/506522);
Dispatch Live on the presidency's figure (dispatchlive.co.za, 2021-07-20); gga.org on SAPOA's R20bn
and R50bn; SABC on Gauteng's R5bn and the job counts; Nation.Africa on the N2, N3 and the port;
Sasria 2024 (sasria.co.za/2024/08/02/the-real-cost-of-the-riots); City Journal 'Lessons of Sa-I-Gu'
and the Christian Science Monitor 1997 'A Slow Return From the Ashes' on Los Angeles; Javier
Auyero, Routine Politics and Violence in Argentina (Cambridge, 2007) on December 2001.
