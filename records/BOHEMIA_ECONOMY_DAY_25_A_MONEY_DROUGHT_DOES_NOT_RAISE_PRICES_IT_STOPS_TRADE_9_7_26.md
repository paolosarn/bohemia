# ECONOMY ROUND 25 -- Q25 [batteries scarce]
# A MONEY DROUGHT DOES NOT RAISE PRICES. IT STOPS TRADE.
# And the thing that kills commodity money is never the drought. It is the stash.

MODE: RESEARCH. NOTHING WAS IMPLEMENTED. This file and the bank lines are the
whole deliverable. Every finding here becomes a WORLD or LIFE + CITY job later,
and only the coordinator puts it on the board.

THE ROW, VERBATIM:
  Q25 What happens to a currency when the thing it is made of stops being made:
  real history of commodity money running out (salt, cowries, coin shortages),
  and what people did. Deliver the rule for the day nobody in the valley can
  find a working cell.

---------------------------------------------------------------------------
## 1. WHAT I MEASURED IN OUR OWN CODE FIRST, BEFORE READING ANYTHING
---------------------------------------------------------------------------

Every number below came out of a node run against the real modules on
origin/main. Nothing here is remembered and nothing is estimated.

**OUR MONEY IS NOT MADE OF ANYTHING.**

  engine/bohemia_purse.js   CURRENCIES = ["resources","electricity","clout"]
                            PRICES     = 11 rows, all { currency:'electricity', amount:1 }
                            PAYOUT     = 1 row, COMPLETE -> { electricity:1 }
                            PRODUCTION = 0 rows in the file

`electricity` is a number on a ledger. There is no stock of it anywhere in the
world, no pool, no cap, no supply, and no good called `battery` or `cell` in
the goods table. It cannot run out in the valley. It can only run out in your
pocket.

**THERE IS EXACTLY ONE BATTERY TILE IN THE WHOLE VALLEY, AND IT MINTS NOTHING.**

  engine/bohemia_overmap.js, buildOvermap(seed), tiles counted by district:
    seed 1  9216 tiles  battery 1  robofactory 1  fueldepot 1  (73 kinds)
    seed 2  9216 tiles  battery 1  robofactory 1  fueldepot 1  (77 kinds)
    seed 3  9216 tiles  battery 1  robofactory 1  fueldepot 2  (75 kinds)
    seed 4  9216 tiles  battery 1  robofactory 1  fueldepot 2  (74 kinds)
    seed 5  9216 tiles  battery 1  robofactory 1  fueldepot 2  (76 kinds)

One tile in nine thousand two hundred and sixteen, on every seed. engine/
bohemia_battery.js draws it: "a containerized battery enclosure -- the hero,
cold, indicator lights dead". The art already says the mint is dead. The
economy has never asked it a question.

And no building anywhere mints money. bohemia_production.js install() fills
PURSE.PRODUCTION at runtime from CE.buildableTypes(), 59 types, every one of
them `{ resources:1 }` off DEFAULT_CURRENCY = 'resources'. Zero rows pay
electricity. A placed building makes stuff. Nothing makes money.

**SO THERE IS ONE TAP AND THREE DRAINS, AND THE TAP IS QUESTS.**

  IN   PAYOUT.COMPLETE            +1 electricity per finished quest
  OUT  PRICES (11 goods)          -1 electricity per purchase
  OUT  PRODUCTION.COST_CURRENCY   -1 electricity per building placed
  OUT  VERBS['night:power']       -1 electricity per lit circuit held, per night

  engine/bohemia_demoquests.js  DAYS.length = 5

THE ENTIRE MONEY SUPPLY OF THE DEMO IS FIVE BATTERIES. The night bill is one
per circuit per night, forever. A player who builds one shop and holds one
circuit spends his whole lifetime income in five nights and then holds
nothing, on a tap that has already closed because there are no more quests.

We did not design a battery drought. We shipped one.

**AND THE PART THAT MADE THIS ROUND WORTH RUNNING: THE SCARCITY ENGINE IS
BUILT, IT IS CORRECT, AND IT IS UNREACHABLE FOR EVERY GOOD IN THE GAME.**

engine/bohemia_economy.js has carried a full running-out price ladder since it
was written:

    daysLeft(ledger, good)   = stock / (need * agents)
    scarcityMult(daysLeft)   = 1 at 30 days or more
                               30/daysLeft on a hyperbola in between
                               40 at zero, and the comment calls it "siege price"
    scavDecay(day)           = 0.5 ^ (day/180)   -- the valley's salvage halves
                                                    every 180 days

And engine/bohemia_payday.js price() is the door every shop goes through:

    if (PURSE.PRICES has goodId)  -> return the ruled price          <-- always
    if (PRICE_SOURCE === 'economy') -> return ECON.price(ledger, ...) <-- never

  PRICES keys : antibiotics food fuel iodine lidocaine meds power salvage sterilewater tweezers water
  GOODS  keys : antibiotics food fuel iodine lidocaine meds power salvage sterilewater tweezers water
  GOODS THE SCARCITY ENGINE COULD STILL PRICE: 0 of 11.

Zero. Not "few". The two tables are the same eleven keys, so the ruled branch
returns first for every good that exists and the siege price cannot execute,
ever, for anything.

Here is what that costs, measured on the real ledger the walked surface builds
(makeLedger(seed 1, 40 heads), agents all scav, exactly as mktLedger() does):

    day | food days left | what the engine says | what the shop charges
     0  |     10.7       |   4.22 salvage       |   1 electricity  [ruled]
     3  |      8.1       |   5.54 salvage       |   1 electricity  [ruled]
     6  |      5.6       |   8.08 salvage       |   1 electricity  [ruled]
     9  |      3.0       |  14.98 salvage       |   1 electricity  [ruled]
    11  |      1.3       |  34.78 salvage       |   1 electricity  [ruled]
    12  |      0.4       |  60.00 salvage       |   1 electricity  [ruled]

The engine moves the price of food FOURTEEN TIMES over twelve days as the
valley eats its last shelf. The shop charges one battery on every one of those
days, including the day the shelf hits zero.

And it is not just food. Across five seeds, everything goes:

    seed 1  food d13   meds d33   fuel d44   water d54
    seed 2  food d13   meds d32   fuel d33   water d54
    seed 3  food d13   meds d34   water d54  fuel d59
    seed 4  food d13   meds d33   fuel d39   water d54
    seed 5  food d13   meds d32   fuel d53   water d54

The valley empties completely, on every seed, on a clock nobody set by hand,
and no price in the game ever notices.

**THE SECOND DEAD ARGUMENT.** In an earlier round I measured that
payday.buy(purse, hubOrNull, goodId, day, ledger) is handed a hub and never
reads it. price(purse, ledger, goodId) is the same shape: mktShelf() on the
walked surface passes the live ledger `L` into it on every render, and the
ruled branch returns before `ledger` is ever touched. Two functions now, both
handed the state of the world, both returning a constant. That is a pattern,
not an accident, and it is what happens when a ruling lands on top of an engine
instead of into it.

---------------------------------------------------------------------------
## 2. THE FINDING THAT PROVES US WRONG
---------------------------------------------------------------------------

The instinct behind the row -- mine too, going in -- is that batteries running
out makes them precious, prices climb, and the economy gets tense and
interesting.

**THE REAL RECORD SAYS THE OPPOSITE, AND IT SAYS IT EVERY TIME. WHEN THE
MATERIAL OF THE MONEY STOPS ARRIVING, PRICES DO NOT RISE. THEY FALL, AND
TRADE STOPS.**

R. A. Radford was a prisoner of war and an economist, and he wrote the camp up
in 1945. Cigarettes were the money. They came in Red Cross parcels. In January
1945 the Red Cross cigarettes ran out and prices slumped. In February the food
parcels ran out too and the depression became severe. Food, itself scarce, was
almost given away, because what people wanted was cigarettes and nobody had
any to give. With no money left, other barter arose, but there was no fixed
means, so a man had to find somebody who wanted his exact thing. The economy
did not get tense. It seized.

Late medieval Europe ran the same experiment across a continent for seventy
years. The silver mines that fed the mints -- including the ones at Kutná Hora
in Bohemia, which is a coincidence worth nothing and enjoyable anyway -- began
to fail at the end of the 14th century. By the early 15th, England had roughly
a tenth of the silver it had held a hundred years before. Mint output peaked
around 1390 and fell away everywhere; Durham's mint closed from 1394 to 1412.
Peter Spufford's summary of what a coin shortage does is four words long:
everything shrinks. When there is a shortage of coin, there is a shortage of
credit, and the shortage of credit makes the shortage of coin worse.

And the games say it too, which is the part that makes this a design finding
and not a history lesson. New World launched into a deflation crisis: the
faucets dried up as players levelled, the sinks kept scaling, and players
became afraid to spend at all. Trade drifted toward barter. Basic materials
crashed to near-zero because everybody was trying to sell for scarce coin and
nobody wanted to part with any. That is Radford's camp, in 2021, with a budget.

So: a money drought is not a hard mode. It is an off switch.

---------------------------------------------------------------------------
## 3. THE SECOND FINDING, AND IT IS THE MORE USEFUL ONE
---------------------------------------------------------------------------

**COMMODITY MONEY ALMOST NEVER DIES OF DROUGHT. IT DIES WHEN SOMEBODY FINDS A
CHEAPER PILE OF IT.**

Cowrie shells were money across West Africa for centuries and were stable for
centuries, because the supply came from the Maldives and the journey was long.
In 1845 a Hamburg firm, A. J. Hertz, worked out that the same shell could be
bought cheap on the East African coast and shipped to the West. Sixteen billion
shells went in over the following decades. At Timbuktu the rate was about 3,800
cowries to the mithqal in the 1850s; by the end of the century it was around
12,000. The historians call it the great cowrie inflation and the currency
ended up useless. Nobody stopped finding cowries. Somebody started finding too
many.

The Somali shilling is the same law read backwards. The state collapsed in 1991
and the central bank with it, and the old notes kept circulating and kept their
value for years -- which economists found astonishing, because there was no
sovereign left to make anybody take them. The reason it worked is that nobody
could make more. Then people worked out that they could. Aideed ordered roughly
165 billion shillings from a Canadian banknote printer in 1996, and Mogadishu
businessmen imported another 60 billion in 2001. The money that survived the
death of its government did not survive a printer.

**FOR US: THE DAY NOBODY CAN FIND A WORKING CELL IS A BAD DAY. THE DAY SOMEBODY
FINDS A WAREHOUSE OF THEM IS THE END OF THE MONEY.** Any battery cache the
player can loot has to be small, or batteries stop being money the moment he
opens the door. That is a real constraint on loot design and it comes from
outside the game.

---------------------------------------------------------------------------
## 4. WHAT PEOPLE ACTUALLY DID. THE LADDER, IN ORDER.
---------------------------------------------------------------------------

Every rung below is what real people did, in order, as the coin ran out. The
order matters, because it is a difficulty curve that history already tuned.

**RUNG 1. HOARD THE GOOD ONES, SPEND THE BAD ONES.**
Gresham's old rule. When the metal is scarce, the full-weight coin goes under
the floor and the clipped, worn, sweated one does the shopping. Salt money in
Ethiopia shows the same instinct from the other side: amole bars were packed in
wood shavings to protect them from wear, because the money was soft and every
knock was a loss. In 1903 the Ethiopian treasury took 27 percent of its revenue
in salt bars, so this was not a curiosity, it was the tax base.
FOR US: a worn cell and a fresh cell are not the same battery. The player pays
with the one that is nearly dead and keeps the good one.

**RUNG 2. THE SMALL TRADES DIE FIRST.**
Sargent and Velde spent a book on this and the finding is narrow and exact: a
shortage of small coin disrupts trade in items of low value, while the big
deals carry on, because a big deal can be done on credit and a loaf cannot.
FOR US, AND THIS IS THE SHARPEST MAPPING IN THE ROUND: our law is EVERYTHING
COSTS ONE. Eleven prices, all one battery. So in Bohemia every single trade is
a small-change trade, and there is no large-denomination trade left standing
when the coin goes. A battery drought here is not partial. It is total, and it
is total on the first day.

**RUNG 3. MAKE CHANGE OUT OF SOMETHING ELSE.**
Zimbabwe dollarized in 2009 and stopped the hyperinflation overnight, and then
had no coins, because nobody was going to ship US cents to Harare. Shops gave
change in sweets, chewing gum and ballpoint pens for five years, until the
Reserve Bank issued bond coins in December 2014 against a fifty million dollar
facility. People do not stop trading for want of a coin. They nominate a
substitute, and it is always something small, common and slightly annoying.
FOR US: this rung is already paid for. We have three currencies. When
electricity is gone, resources and clout are still there and already drain on
the walked surface. The substitute does not have to be invented.

**RUNG 4. SOMEBODY MINTS.**
The Royal Mint stopped striking copper in 1775 and did not resume for
twenty-three years, right through the start of the industrial revolution, so
there was no small coin to pay a factory with. In 1787 the Parys Mine Company
started stamping halfpenny tokens out of the copper it dug itself, to pay its
own workers. Everybody copied it. From 1787 to 1797, private tokens were almost
the only coins in circulation in Britain -- millions of them, in a few thousand
designs, each one advertising whoever issued it. Parliament finally outlawed
them in 1817.
FOR US: a drought does not end because it rains. It ends because somebody with
the material starts issuing. And we have the setup already sitting on the map,
untouched: exactly one battery tile in the valley, and fourteen factions with
seats. Whoever holds that tile can pay its own people in cells it makes, with
its own name on them. That is the Parys Mine shape, and every piece of it is
already in the repo.

**RUNG 5. CREDIT REPLACES COIN.**
This is the rung under all the others and it is why Spufford's shrinkage is so
bad: when the coin goes, trade survives only where somebody will take your
word, on a tally, a book debt, a warehouse receipt. Virginia's tobacco notes
were receipts for leaf sitting in a warehouse and they circulated as money while
the tobacco never moved.
FOR US: this is the same wall four rounds of this lane have now walked into
from four directions. bohemia_purse.js KINDS is
["source","drain","convert","transfer"] and there is no OWED. Nobody in this
valley can be owed anything by anybody. A battery drought without credit is
not an economy under strain, it is an economy with nothing left to do.

---------------------------------------------------------------------------
## 5. THE RULE THE ROW ASKED FOR
---------------------------------------------------------------------------

The row wants one rule for the day nobody in the valley can find a working
cell. Here it is, and then the three rungs under it that are cheapest to build.

**THE RULE: WHEN THE BATTERIES GO, THE SHOP DOES NOT RAISE ITS PRICE. IT
REFUSES THE SALE. THE SHELF STAYS FULL AND THE TILL GOES QUIET, AND THE ONLY
WAY ANYTHING MOVES IS IF SOMEBODY TAKES YOUR WORD OR TAKES SOMETHING ELSE.**

Not a multiplier. A refusal. Every source above agrees on this and our own
instinct had it backwards.

Three rungs, cheapest first, each one landing on a mechanism that already
exists:

  RUNG A -- THE TILL GOES QUIET. Today price() returns 1 forever. It should be
  able to return a refusal that means "not for a battery", which is the same
  shape as the NO_RULING refusal the purse already returns everywhere. The
  market card already renders "N days of it left in the valley"; it should be
  able to say the shelf is full and nobody is buying. Nothing new is needed
  except a reason string and a branch.

  RUNG B -- THE OTHER TWO CURRENCIES PICK IT UP. Zimbabwe's sweets. We have
  resources and clout, both already draining on the walked surface at
  nightfall. A trade that cannot be paid in electricity is a trade that can be
  paid in something worse, and the player should feel that he is paying in
  something worse.

  RUNG C -- SOMEBODY ISSUES. One battery tile, fourteen faction seats. Whoever
  holds it makes cells and pays its own people first. That is what ends a
  drought in the real record, it is a reason to want a specific square of the
  map, and it is the first thing in this whole study that would make a player
  care who owns a district.

**AND THE STANDING WARNING, which is not a rung but a constraint on everybody
else's work: a lootable pile of batteries ends the money.** Sixteen billion
cowries. Keep every cache small, or accept that finding the big one is the
scene where batteries stop being money and the game says so out loud.

---------------------------------------------------------------------------
## 6. ROUTED
---------------------------------------------------------------------------

Nothing here is a job until the coordinator makes it one. This section is the
routing suggestion and nothing else.

  -> WORLD           the till goes quiet (RUNG A): price() gains a refusal that
                     means "not for a battery", and the market card can say the
                     shelf is full and the till is empty. Same module as the
                     dead ledger argument below, one job.
  -> WORLD           the dead arguments: buy() takes a hub it never reads and
                     price() takes a ledger it never reads. Two functions handed
                     the world, both returning a constant.
  -> WORLD           the scarcity engine reaches 0 of 11 goods. Either the ruled
                     price learns to move when a shelf empties, or the siege
                     price should come out of the file, because right now the
                     valley empties on a measured clock and no price notices.
  -> LIFE + CITY     the other two currencies pick it up (RUNG B). resources and
                     clout already drain; a refused sale is where they earn.
  -> FACTIONS        somebody issues (RUNG C). One battery tile, fourteen seats,
                     the Parys Mine shape.
  -> RUN             the demo's whole money supply is five batteries against an
                     unlimited nightly bill. That is a deflation the player will
                     hit without the game ever saying the word.
  -> ALL LANES       a lootable pile of batteries ends the money. Caches stay
                     small.
  -> [PENDING Paolo] (23) when a man cannot pay, does the shop turn him away or
                     does it let him owe? Every rung above stops at the same
                     wall, and it is the fourth round in a row to stop there.

---------------------------------------------------------------------------
## 7. WHAT IS NOT HERE, ON PURPOSE
---------------------------------------------------------------------------

No numbers were tuned and no table was filled. No refusal string was written
into an engine file. No cache size was chosen. No faction was assigned the
battery tile. Every one of those is a ruling or a build, and this lane does
neither.

I also left out the Roman "soldiers were paid in salt" story, which is the
first thing that comes up when you search salt as money and is not true --
soldiers were paid in coin, and salarium's link to salt is a guess of Pliny's
that has been repeated for two thousand years. The row named salt and the
honest salt case is Ethiopian amole, which is above.

---------------------------------------------------------------------------
## 8. THE GATE NOTE, WHICH I AM NOW WRITING EVERY ROUND
---------------------------------------------------------------------------

Every gate in this lane's subset went green this round, and the round found
that the game's scarcity engine is unreachable for every good in the game and
that the demo's total money supply is five.

These gates check that a part does what it says. Nothing checks that two parts
agree, that a part keeps working for as long as the game lasts, that it is the
right part to have, or that the parts form a loop that closes. That is the same
sentence I wrote in rounds 16 through 24 and it is still true. It is a
different hole from the "a gate that never runs is not a gate" fix another lane
landed, and that fix does not cover it.

This round is the cleanest example the study has produced. price() has a branch
that has never executed for any good in the game. A gate that asked "does
price() return a number" passes. A gate that asked "can this branch ever run"
does not exist.

---------------------------------------------------------------------------
## 9. SOURCES
---------------------------------------------------------------------------

R. A. Radford, "The Economic Organisation of a P.O.W. Camp", Economica 1945:
  https://timharford.com/2012/05/rules-of-trading-in-a-pow-camp/
  https://www.finance-watch.org/blog/the-perfect-draw-when-cigarettes-became-a-war-camp-currency/
The Great Bullion Famine, and Spufford on coin and credit:
  https://en.wikipedia.org/wiki/Great_Bullion_Famine
  https://www.cambridge.org/core/journals/journal-of-economic-history/article/abs/late-medieval-bullion-famine-reconsidered/B9F45341C53B002E4813BB38BA139D5F
Hogendorn and Johnson on the cowrie currencies of West Africa:
  https://www.cambridge.org/core/services/aop-cambridge-core/content/view/78A8DBDC82DEA8A43087CA3F00B0BE96/S0021853700037427a.pdf/cowrie_currencies_of_west_africa_part_i.pdf
Luther and White, "Positively Valued Fiat Money after the Sovereign Disappears:
The Case of Somalia":
  https://www.mercatus.org/sites/default/files/d7/positively-valued-fiat-money-after-the-sovereign-disappears.pdf
Sargent and Velde, "The Big Problem of Small Change":
  https://www.minneapolisfed.org/article/2003/the-big-problem-of-small-change
  https://press.princeton.edu/books/paperback/9780691116358/the-big-problem-of-small-change
Conder tokens and the Parys Mine Company, 1787-1797:
  https://en.wikipedia.org/wiki/Conder_token
  https://www.money.org/money-museum/virtual-exhibits-moe-case14/
Zimbabwe's change crisis and the 2014 bond coins:
  https://en.wikipedia.org/wiki/Zimbabwean_bond_coins
  https://zimfact.org/factsheet-zimbabwes-currency-through-the-years/
Ethiopian amole salt bars:
  https://en.wikipedia.org/wiki/Ethiopian_birr
  https://www.moneymuseum.com/en/coins?id=1613
Game economies, faucets and sinks, and the New World deflation:
  https://quickref.me/blog/faucets-sinks-and-bonds-how-online-game-economies-stay-balanced/
  https://machinations.io/articles/the-machinations-manifesto-for-building-sustainable-game-economies
  https://lostgarden.com/2021/12/12/value-chains/
A currency that is also the thing you spend in the fight:
  https://gamedesignskills.com/game-design/economy-design/
  https://arxiv.org/pdf/2203.14253
