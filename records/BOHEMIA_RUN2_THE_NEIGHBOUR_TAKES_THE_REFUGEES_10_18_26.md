# RUN TWO [the neighbour takes the refugees], 10/18/26
# The new age (rules 112 to 117): opened by the coordinator, run to the end, no check-in, no question.

## WHAT IT ANSWERS
ECONOMY day 70 (4a): 'the raided town is not dearer, it is EMPTY... the dear town is the one NEXT to it, where the people
went' (the real record's order: South Africa 2021, Los Angeles 1992). The board's END STATE: while a place stands RAIDED in
the ledger, the nearest held place on the map's own distance reads the wiki's Refugees card on the same days, its elder
saying where they came from; a gate raids one place and reads the neighbour. The card's numbers only; the neighbour from
the map, never typed; FACTIONS' ledger read, never written.

## HOW BATTLE BROTHERS DID IT (rule 41)
The wiki's Refugees (Settlement Situation), page 1660, read from the library (reference/library/grok/wiki/PAGES_ALL.tar.gz):
'With the war raging, a constant stream of refugees is pouring into this settlement. It puts a strain on local economy,
but it also means cheap recruits available for anyone that can offer work.' -25% food available, +25% food prices, -10%
items available, 'Refugees are more likely to be available for hire' (no number).

## WHAT WAS BUILT
- records/target/settlement_traits.json: the 'refugees' card (caused_by 'ledger_neighbour', never rolled): food_buy_mult
  1.25, food_stock_mult 0.75, stock_mult 0.9, the look 'crowd', and nine keeper lines that say whose people they are,
  who burned them out and when ({from} {by} {ago}), draft:true.
- slices/bohemia_bar_news.js: nearestTo(place) (the closest other seat on the map's own cells, the baked places of
  [the bar names the news]) and refugeesAt({here, day, ledger}) (the newest live RAIDED mark whose town's nearest is
  here); the bar's news tells a town's refugees after the raid itself ('The lot over by the Network is full of people
  from the Mob's place').
- slices/BOHEMIA_SETTLEMENT_SCREEN.html: placeTraits() adds the refugees card (then the ledger's own marks for here, said
  first); traitMult() reads a neighbour card's own numbers (the ledger's cards still read arrival_traits.json); the
  stall's food carries the food price; traitLine() fills {from} {by} {ago}; the arrival waits for the map's towns.
- FOUND AND FIXED ON THE WAY: handing traits switched the ledger off (placeTraits skipped it whenever open({traits})
  was an array), and the map ALWAYS hands its dice as traits, so a raid the map handed beside its crowd's roll would
  never have reached the counter. The ledger's cards now stand on top of the dice, never instead of them.

## MEASURED
- The card equals the wiki page, read live from the library by the gate.
- Each of the 14 seats raided in turn sends its people to exactly its nearest, for exactly the raid's days, never to
  itself or a second town (Mob -> Network 5.0 cells, Network <-> Volunteers 3.0, Cartel -> Custom 5.8, ...).
- Live through the map's own message: the Reds raid the Mob; at the Network on day 4 the arrival reads REFUGEES and the
  elder says 'We have half of the Mob's place sleeping in our lot since the Reds hit them two nights back'; the shelves
  20 against 22 calm; the hall's keeper names the Mob's place; on a market day the ration is 2 batteries against 1;
  day 9 calm; the Mob itself handed its market day AND the ledger reads RAIDED, MARKET DAY (before: MARKET DAY only).
- NEW GATE THE NEIGHBOUR TAKES THE REFUGEES 15/0 (registered).

## WHAT THE CARD SAYS THAT WE CANNOT YET SHOW
- -25% food available: the stall sells rations without a count; the number is on the card (food_stock_mult 0.75) for
  the day the stall has a stock (ECONOMY, TUNING).
- 'Refugees are more likely to be available for hire': the card gives no number and our posts have no refugee
  background, so the posts' count and price do not move; the hall's keeper says where the men walked from (TUNING,
  PEOPLE: a refugee background, cheap, is Battle Brothers' way).
- In the demo the map does not hand the ledger yet (RUN, owed since [the raid is a record]); the day it does, both the
  raid and the refugees reach the counter with no code from this lane.

## ROUTED
- RUN: hand ledger + ledgerPlace (the seat's id) in BOHEMIA_SETTLEMENT_OPEN; traits may stay beside it now.
- TUNING: the refugees card's three numbers are the wiki's; the posts' share is yours when you rule one.
- PEOPLE: a refugee background at the posts (Battle Brothers' 'more likely to be available for hire').
- WORDS: the nine refugees lines and the two news lines are draft:true attempts.

[bb school line] Battle Brothers' Refugees situation: a constant stream pours in, food scarcer and dearer, a tenth fewer
items, cheap men at the gate; ours lands in the town next to the one that got raided, for the raid's own days.
[analog horror line] The lot behind the elder's house is full of people who do not look up. One of them is still holding a
house key from the Mob's place.
