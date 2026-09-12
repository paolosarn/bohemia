# ECONOMY ROUND 34 -- Q34 [who profits]
# THERE IS A LANDLORD IN THIS VALLEY AND IT IS NEVER THE PLAYER.
# Two of the three roads are built and both are aimed at him as a bill.
# And the biggest real road is a fourth one the row did not name.

MODE: RESEARCH. NOTHING WAS IMPLEMENTED. This file and the bank lines are the
whole deliverable. Every finding becomes a WORLD, FACTIONS or LIFE + CITY job
later, and only the coordinator puts it on the board.

THE ROW, VERBATIM:
  Q34 Who gets rich when everyone else gets poor: real material on who comes out
  ahead in a collapse (the ones holding the scarce thing, the ones who lend, the
  ones who guard), and how the best games let a player be one of them without a
  menu telling them so. Deliver the three roads to being the one with batteries
  when nobody else has any.

---------------------------------------------------------------------------
## 1. WHAT I MEASURED IN OUR OWN CODE FIRST
---------------------------------------------------------------------------

The row names three roads. I went looking for each one, and found that TWO ARE
ALREADY BUILT AND BOTH ARE POINTED AT THE PLAYER AS A COST.

**ROAD ONE, HOLD THE SCARCE THING: BUILT, AND THE SCARCITY IS BEAUTIFUL.**

engine/bohemia_towns.js carries MAKES = ["solar","dam","battery"] -- the three
district kinds that produce power -- plus minesOf(), minesFor(), PER_SITE_PER_DAY
and MINE_RULING ("7/26 BUILDINGS PRODUCE ONE OF THE THREE + 8/15 EVERYTHING COSTS
ONE"). Counted on the real overmap:

    seed 1   solar 303 | dam 4 | battery 1   ->  308 of 9,216 tiles
    seed 2   solar 303 | dam 4 | battery 1   ->  308
    seed 3   solar 305 | dam 4 | battery 1   ->  310
    seed 4   solar 303 | dam 4 | battery 1   ->  308
    seed 5   solar 303 | dam 4 | battery 1   ->  308

**3.3% OF THE VALLEY MAKES POWER.** And minesOf() groups those tiles into SITES,
which is the number that matters:

    minesOf on seed 1:  FOUR SITES.  The first is solar, 38 cells.
    PER_SITE_PER_DAY = 1

Four places in the valley make power. One battery plant. Four dams. The rest is
spread solar. A site comes back as
`{kind, cells, x, y, faction:null, held:0, split:false, holders:{}}` and the
faction fields are null in my probe because I passed no towns -- the module takes
them as an argument, so that is my instrument and not the game.

**ROAD TWO, LEND: NOT BUILT, AND THE ONE LEDGER THAT COUNTS DEBT IS POINTED AT
THE PLAYER.**

Round 33 measured that there is exactly ONE PURSE in the whole game, so there is
nobody to lend to. And the only owed-ledger in the towns module counts the wrong
direction:

    owedTo(book) -> [{faction, nights, lastDay}], worst first

It counts NIGHTS THE PLAYER OWES A FACTION. Not batteries -- nights. A debt
measured in how many times he did not pay.

**ROAD THREE, GUARD: BUILT, AND IT IS A BILL.**

    rentOn(used, towns)   ruling: 'EVERYTHING COSTS ONE (8/15)'
    DEPTH = { fortress: 1, town: 0.667, camp: 0.333 }
    PER_SITE_PER_DAY = 1
    COLLECTOR = { came: "SOMEBODY IS AT THE DOOR AND THEY ARE NOT HERE FOR YOU",
                  one:  "YOUR FATHER WENT A NIGHT WITHOUT PAYING THEM. THEY REMEMBER",
                  many: "YOUR FATHER WENT SHORT WITH THEM MORE THAN ONCE..." }
    WORTH = 55 rows of ground value: resort 12043, casino 11477, downtown 9624,
            library 8632, convention 8496 ... down to park 164, and solar,
            airbase, airport and strip at ZERO

rentOn bills the player for the sites he uses on somebody's ground, scaled by how
big their town is. A collector comes to his door. And the collector REMEMBERS HIS
FATHER, which means the rent road already crosses the generations.

**SO THE PATTERN, AND IT IS THE ROUND'S FINDING ABOUT OUR OWN BUILD: TWO OF THE
THREE ROADS EXIST AND BOTH RUN IN ONE DIRECTION. THE FACTIONS HOLD, THE FACTIONS
COLLECT, THE FACTIONS REMEMBER. THERE IS A LANDLORD IN THIS VALLEY AND IT IS
NEVER THE PLAYER.**

**AND ONE CORRECTION TO MYSELF BEFORE IT MISLEADS ANYBODY.** My first probe of
the power grid reported ZERO HOLDERS on all five seeds and `payTo()` returning
null on every lit cell. That is wrong, and it is the same mistake WORLD wrote down
once already: I called powerMap(m, seed) with no opts, and the holder's NAME
arrives through `opts.holderAt` and `opts.gridFaction`, which the walked surface
passes (buildPower wires them to the town seats). MY PROBE WAS THE BROKEN
INSTRUMENT, NOT THE GRID. What does survive the correction is the owner
CATEGORIES, which come out of the module itself: of 73 cells with a real circuit
owner on seed 1, settlement 43, solar_lone 15, network 10, faction 5.

---------------------------------------------------------------------------
## 2. THE FINDING THAT PROVES US WRONG
---------------------------------------------------------------------------

The row's three roads are hold, lend, guard. That is the folk answer and it is
what I would have written.

**THE BIGGEST ROAD IN THE REAL RECORD IS A FOURTH ONE: BE THE PERSON WHO CAN GET
IT AT THE OLD PRICE.**

Venezuela is the measured case. Between 2003 and 2012, an estimated THREE HUNDRED
BILLION DOLLARS was lost to currency arbitrage alone. The mechanism was not
hoarding and not violence. It was ACCESS AT A PRIVILEGED RATE: the government kept
assigning dollars at subsidised exchange rates to allies, and "an entire industry
of non-productive ghost companies cropped up to lobby the government for
subsidised dollars to resell them on the black market for an immediate profit."
Insider trading became the only way to operate the swap system at all.

And the retail version is the same shape. The man they called the Tsar of Mercal
made his fortune SELLING CORNFLOUR TO THE GOVERNMENT'S SUBSIDISED FOOD MARKETS --
not by holding cornflour, by being the supplier of record. A former treasurer, who
had been the president's bodyguard, took more than a billion.

**THE WINNER IS NOT THE ONE WITH THE MOST. IT IS THE ONE WHO CAN BUY AT ONE PRICE
AND SELL AT ANOTHER.** Holding is what you do after you win; it is not how.

**AND THAT ROAD IS ARITHMETICALLY IMPOSSIBLE IN OUR GAME TODAY. I MEASURED IT:**

    hubs in the valley:                     16
    DISTINCT PRICES IN THE WHOLE VALLEY:     1     {"1": 11 goods}
    price(purse, ledger, goodId)             does not take a hub at all
    buy(purse, hubOrNull, ...)               takes one and never reads it (round 25)

Sixteen markets and one price. Every good is one battery at every seat in the
valley. There is no second price anywhere, so there is nothing to arbitrage, and
the road that moved three hundred billion real dollars cannot be walked here by
construction.

---------------------------------------------------------------------------
## 3. WHAT THE OTHER THREE ROADS ACTUALLY LOOK LIKE
---------------------------------------------------------------------------

**THE GUARD ROAD IS FAR BIGGER THAN "A THUG TAKES A CUT", AND THAT IS THE MOST
USEFUL THING IN THIS ROUND.**

Volkov's study of Russia in the 1990s: Russian law enforcement estimated that UP
TO THREE QUARTERS OF RUSSIAN BUSINESSES PAID PROTECTION MONEY in the early 1990s.
The word was krysha, a roof. And the roof did not only threaten people. It did
CONTRACT ENFORCEMENT, DEBT COLLECTION, VETTING OF BUSINESS PARTNERS, AND
ARBITRATION OF BUSINESS DISPUTES. It later legalised into the private protection
company.

**THE PROTECTOR WAS THE COURTS.** In a place with no courts, the one who guards is
the one who makes a deal stick, and that is why everybody pays. This lane has been
circling that hole from the other side for twelve rounds: round 22 found a valley
with no courts, round 26 found that nothing prices settling a wrong, round 33
found one pocket and no way to enforce anything between two people. THE GUARD ROAD
IS THE ANSWER TO ALL THREE, AND IT IS A ROLE RATHER THAN A STAT.

**THE LEND ROAD IS NOT GOUGING, AND THE RESEARCH IS UNUSUALLY CLEAR ABOUT IT.**
Informal interest runs roughly double formal interest (28% against 15% in one
measured region, 18% against 13% in another). But the estimates of what it costs a
moneylender to operate -- screening, chasing delinquents, overhead, capital --
come out to LENDERS' CHARGES EQUALLING THEIR AVERAGE COST OF LENDING while
exceeding their marginal cost. The price is what it costs to chase everybody who
does not pay. And the lenders are the same people round 29 found: moneylenders,
TRADERS, LANDLORDS AND SHOPKEEPERS.

**THE HOLD ROAD IS THE WEAKEST OF THE THREE AND WE HAVE BUILT THE MOST OF IT.**
Nothing in the collapse record suggests that sitting on stock makes anybody rich.
Stock can be taken, and round 25 already found the other half of this: the way a
commodity money dies is somebody finding a cheaper pile of it. Holding only pays
if you also control who may buy, which is roads three and four wearing a warehouse.

---------------------------------------------------------------------------
## 4. THE THREE ROADS, DELIVERED
---------------------------------------------------------------------------

The row asks for three roads to being the one with batteries when nobody else has
any. Here they are in the order the real record ranks them, which is NOT the order
the row lists them in, and each one lands on something already built.

**ROAD A -- BE THE ONE WHO MAKES THEM. (built, needs a holder)**
Four sites in the valley, one of them the only battery plant there is. MAKES,
minesOf, PER_SITE_PER_DAY 1 are all written; what is missing is that a site's
holder is never the player. This is the slowest road and the most defensible,
because what you hold is a PLACE rather than a pile, and a place can be taken
from you, which is drama rather than bookkeeping.

**ROAD B -- BE THE ONE WHO MAKES A DEAL STICK. (the biggest, and nothing is built)**
Three quarters of businesses paid for this in a real collapse, and what they were
buying was enforcement, collection, vetting and arbitration. In our valley nobody
can be made to pay anybody, so the first person who can is rich by definition.
THIS IS THE ROAD THAT ANSWERS TWELVE ROUNDS OF THIS LANE'S FINDINGS AT ONCE, and
it needs the second pocket round 33 asked for and nothing else.

**ROAD C -- BE THE ONE WHO CAN GET IT AT THE OLD PRICE. (the real biggest, and it
is arithmetically impossible today)**
Sixteen markets, one price. If two seats ever quote a good differently, the player
who knows both is rich and no menu has to tell him so -- which is exactly the
"without a menu" the row asks for. And it pays off rounds 30 and 31 directly:
knowing two prices IS the perception perk earning its keep. One price everywhere
is not a simplification we are carrying, it is the reason this road does not exist.

**AND THE ROAD I AM NOT DELIVERING, SAID OUT LOUD: LEND.** It is a real road and
it is fourth, not first. Informal lending is a thin-margin business that covers
the cost of chasing people, and in our game it needs a second pocket AND an owed
that points the player's way, which is two missing things rather than one. Round
33's pending already covers the first.

**AND THE WARNING THAT GOES WITH ALL THREE, WHICH IS HIS OWN REALISM STANDARD
RATHER THAN MY TASTE: IN EVERY REAL CASE THE WINNER WAS CONNECTED, NOT CLEVER.**
The ghost companies lobbied. The treasurer was the president's bodyguard. The
cornflour man had the contract. If a player can walk any of these roads purely by
being smart, we have built a fantasy; if he walks them by being somebody people
owe, we have built the thing the identity line promises.

---------------------------------------------------------------------------
## 5. ROUTED
---------------------------------------------------------------------------

Nothing here is a job until the coordinator makes it one.

  -> FACTIONS / WORLD   ROAD A: four power sites in the valley, one of them the only
                        battery plant, and a site's holder can never be the player.
                        MAKES, minesOf and PER_SITE_PER_DAY are all built.
  -> WORLD              ROAD B, the big one: nobody in this valley can be made to
                        pay anybody, so the first person who can is rich. Needs the
                        second pocket round 33 asked for and nothing else.
  -> WORLD              ROAD C: sixteen hubs, ONE price. There is nothing to
                        arbitrage anywhere in the game, and it is the road that
                        moved three hundred billion real dollars.
  -> WORLD              rentOn, owedTo and COLLECTOR all run one way: the factions
                        bill and the player pays. There is a landlord and it is
                        never him.
  -> COMBAT / PEOPLE    ROAD B is what a perception perk and a standing web are
                        FOR: rounds 30 and 31 priced seeing, and knowing two prices
                        is seeing paying for itself.
  -> [PENDING Paolo] (35) CAN THE PLAYER EVER BE THE ONE COLLECTING? Every rent
                        mechanism in the game points at him. Whether he can stand on
                        the other side of it is a shape question about what this game
                        is, not a number, which is why it is his.

---------------------------------------------------------------------------
## 6. WHAT IS NOT HERE, ON PURPOSE
---------------------------------------------------------------------------

I did not set a second price, did not assign a power site to anybody, did not
write a protection mechanic and did not pick an interest rate. The first three are
other lanes' and the fourth is a ruling.

I did not rank the roads by what would be most fun. The order in section 4 is the
order the real record ranks them by how much money actually moved, and where that
disagrees with the row's own order I said so rather than quietly reordering.

And I am carrying my own broken probe in section 1 rather than deleting it,
because a future round will reach for powerMap again and the opts are not obvious.

---------------------------------------------------------------------------
## 7. THE GATE NOTE
---------------------------------------------------------------------------

Every gate in this lane's subset went green, and the round found that every rent
and debt mechanism in the game points at the player and that there is exactly one
price in sixteen markets.

These gates check that a part does what it says. Nothing checks that two parts
agree, that a part keeps working for as long as the game lasts, that it is the
right part to have, or that the parts form a loop that closes. Rounds 16 through
34, same sentence. rentOn passes. owedTo passes. minesOf passes. A gate asking
"can money ever flow toward the player from anybody" does not exist, and on
today's build it would be red.

---------------------------------------------------------------------------
## 8. SOURCES
---------------------------------------------------------------------------

Venezuela's arbitrage, the three hundred billion, and who actually got rich:
  https://www.economicsobservatory.com/why-did-venezuelas-economy-collapse
  https://en.wikipedia.org/wiki/Bolibourgeoisie
  https://www.icij.org/investigations/fincen-files/how-banks-helped-venezuelas-boligarchs-extract-billions/
  https://www.tandfonline.com/doi/full/10.1080/01436597.2026.2633287
Volkov on violent entrepreneurs, the krysha, and what protection actually sold:
  https://books.google.com/books/about/Violent_Entrepreneurs.html?id=lq2aaG29EzYC
  https://foreignpolicy.com/2020/06/14/krysha-putin-russia-how-muscle-works-in-moscow/
  https://muse.jhu.edu/book/68248
Informal lending rates, and what the margin actually covers:
  https://documents1.worldbank.org/curated/en/702961468762947858/txt/multi-page.txt
  https://link.springer.com/chapter/10.1007/978-3-031-71653-9_2
  https://hummedia.manchester.ac.uk/institutes/gdi/publications/workingpapers/bwpi/bwpi-wp-12610.pdf
