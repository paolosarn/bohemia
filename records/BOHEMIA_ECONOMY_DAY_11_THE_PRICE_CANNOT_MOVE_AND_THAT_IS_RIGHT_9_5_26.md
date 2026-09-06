# ECONOMY -- ROUND 11: THE PRICE CANNOT MOVE, AND THAT IS THE RIGHT ANSWER
# (ECONOMY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q11 [inflation feeling], verbatim from VAMILY.md:
#   "Inflation as a feeling. What runaway prices do to behaviour (spend today,
#    hoard, barter) and how a game could make a player feel it in a week of play
#    without a single chart."
# Named DAY 11 for the machine. A round is one VAMILY and is never called a day
# to Paolo (NO CALENDAR TALK, 9/5, LOCKED).

## 0. THE HEADLINE

I ran the shipped market from day 0 to day 365 and asked it for a price every
time:
```
day   food in stock   what the SIM computes   WHAT THE PLAYER PAYS
  0        206              5.24                1 battery
 10        1.38            60.00                1 battery
 30        0               60.00                1 battery
 60        0               60.00                1 battery
200        0               60.00                1 battery
365        0               60.00                1 battery
```
**The scarcity sim runs a genuine hyperinflation, a forty-fold move, and not one
cent of it can ever reach the shop.** EVERYTHING COSTS ONE beats the sim, by
design, correctly.

And the second measurement, which closes the door completely: **there is exactly
one purse in the entire valley.** `BohemiaPurse.create()` is called once, for the
player. **Nobody else in Bohemia holds money or buys anything.**

> **SO INFLATION IS UNOBSERVABLE HERE TWICE OVER: THE PRICE CANNOT MOVE, AND
> THERE IS NOBODY TO WATCH BEHAVING. AND THE REAL RECORD SAYS THAT IS FINE,
> BECAUSE THE PRICE WAS NEVER THE THING PEOPLE FELT.**

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

### 1a. THE PRICE IS FROZEN BY LAW AND THE SIM STILL SCREAMS
Section 0's table. The scarcity sim is intact and still quotes: food climbs from
5.24 to its 40x cap by day 10 and sits there. `PURSE.PRICES` beats it on every
call and returns `1 electricity`, source `ruled`, on every day forever.

**This is not a defect.** It is exactly what the 8/15 ruling instructs and what
the payday module documents. But it means the question as asked has a hard
answer: **a player cannot feel inflation through a price in this game, ever,
under any circumstance.**

### 1b. AND THERE IS ONE WALLET IN THE WORLD
```
BohemiaPurse.create()  ...  called exactly once (the player)
payday.buy()           ...  one call site (the player's market)
```
The behaviours Q11 names -- spend today, hoard, barter -- are **behaviours of a
population**. Ours has a population of one. There is no velocity to observe
because there is only one holder of money, and no hoarding to see because nobody
else has anything to hoard.

### 1c. AND OUR MONEY GOES THE OTHER WAY ANYWAY
Round 8 measured it: nothing in a dead city manufactures a cell, so the money
supply is fixed and only falls. Round 1 measured every real collapse ending with
money **plentiful and worthless**. Ours ends with money **scarce and precious**.

**Bohemia is not an inflation story.** With a price frozen at one and a stock that
only shrinks, what we actually have is stranger and better:
> **EVERY BATTERY YOU SPEND IS ONE YOU WILL NEVER HAVE AGAIN, AND THE PRICE WILL
> NEVER CHANGE TO TELL YOU SO.**
The scarcity is invisible in the price and total in the stock.

## 2. THE REAL AISLE: WHAT PEOPLE ACTUALLY DID

### 2a. THE MEASURABLE SIGNATURE IS SPEED, NOT SIZE
> *"At the peak of these crises, the velocity of money approached infinity; money
> was held for the minimum possible time before being exchanged for goods or
> foreign currency."*

In Weimar, people were **paid twice daily** so they could spend before the
afternoon. Round 1 found the same shortening in Argentina, Zimbabwe and
Venezuela. **The number that moves is not the price. It is how long anybody is
willing to hold the money**, and that is a behaviour you can watch.

### 2b. PEOPLE STOP ACCEPTING MONEY AT ALL
> *"in many cases, people refuse to be paid in money, demanding instead to be
> paid in goods and commodities."*

This is round 1's finding arriving from a third direction. **The seller's refusal
is the whole event.** Round 1: they remember being told no. Round 2: the shop that
cannot say no is the restaurant that closed. Round 11: the refusal escalates from
*"not at that price"* to *"not for money."*

### 2c. HOARDING WALKS DOWN THE SHELF IN A FIXED ORDER
> *"Hoarding can start with durable goods like automobiles and washing machines,
> and if hyperinflation continues, people hoard perishable goods like bread and
> milk, which become scarce and expensive."*

**That is an order, and an order is a mechanic.** Durables first, staples last.
And the consequence is circular and vicious: *"as people panic and hoard everyday
goods, these goods become artificially scarce"* -- **the shortage is manufactured
by the response to the shortage.**

### 2d. AND WHAT SURVIVORS ACTUALLY DESCRIBE IS NEVER A NUMBER
The images that persist are a woman wheeling banknotes to a bakery **and finding
the loaf had doubled since the morning**, shopkeepers buying money-counting
machines, savings of a whole working life gone. Round 1 said it first and this
round confirms it from the personal-account side: **nobody remembers the index.
They remember what they had to do differently.**

## 3. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named enters this record, the design, or the vocabulary.)
- The standing way to show an economy changing without numbers is **to change who
  will deal with you and on what terms**, not to change a figure. A merchant who
  now wants goods instead of coin has communicated more than any price tag.
- **A shrinking shelf reads instantly and needs no legend.** Fewer rows is a
  feeling; a higher number is a reading.
- The failure mode: **an economy the player is told about rather than refused
  by.** If the only evidence is on a screen the player can close, it did not
  happen.

## 4. *** THE FINDING THAT PROVES US WRONG ***

> **WE HAVE BEEN TREATING "NO NUMBERS ON SCREEN" AS A RESTRICTION TO WORK AROUND.
> IT IS THE ONLY REASON THIS ECONOMY CAN BE FELT AT ALL, BECAUSE OUR PRICE IS
> FROZEN AND A FROZEN PRICE IS A DEAD DISPLAY.**

Q11 asks how to make a player feel inflation without a chart. Measured, we cannot
draw the chart even if we wanted to: the price is one, forever, by his ruling. So
the ruling has quietly forced the correct design, for the fourth time in this
lane (round 2: the small-change problem; round 5: the numberless price; round 9:
the whole arithmetic of debt; round 11: this).

**But the real blocker is not the price, it is that nobody else in the valley has
a wallet.** Every single thing the record says people felt is somebody else's
behaviour:
```
velocity          somebody spends the moment they are paid       needs a 2nd purse
refusal in kind   somebody will not take money any more          needs a seller
                                                                  with a position
hoarding          the shelf thins, durables first, staples last  needs stock that
                                                                  moves without you
short pay         you are paid at noon as well as at nightfall   needs the day loop
                                                                  only, WE HAVE THIS
```
**Three of those four need one thing: a second purse.** Not an economy simulation
and not a number. **One trader who has a pocket, a position, and the right to say
"not for money."**

### 4b. AND THE THING THE PLAYER WOULD ACTUALLY FEEL IN A WEEK
Not a rising price. **A falling count in their own hand**, which round 5 proved is
readable at a glance up to four, and a shelf that has fewer rows on it than it did
last market day, which round 10's DEPTH already models per tier.

**Both are already computable from parts that shipped.** Neither is a chart.
Neither is a number on screen.

## 5. HOW A PLAYER FEELS IT, WITHOUT A CHART (mechanism only; every number his)
```
1  YOUR OWN COUNT FALLS      four cells in a pocket is subitizable (round 5).
                             watching it go three, two, one is the whole feeling.
2  THE SHELF GETS SHORTER    DEPTH already scales goods by tier (round 10).
                             fewer rows this market day than last is a sentence
                             nobody has to write.
3  SOMEBODY WON'T TAKE IT    the refusal, escalated: "not for money." rounds 1,
                             2 and 9 all landed here from different directions.
4  THE HOARD ORDER           durables first, staples last. what disappears from
                             the shelf, and in what order, IS the index.
5  PAY GETS SHORTER          paid at noon as well as nightfall. the day loop
                             already exists; this is the cheapest of the five.
```
None of that is a chart. None of it is a second number. All of it is either a
thing you count on one hand or a thing a person says to your face.

## 6. REFUSED
- **Unfreezing the price.** EVERYTHING COSTS ONE is locked and this round argues
  it is doing more good than anybody realised.
- **Any index, chart, trend arrow or price history.** Banned by 7/26 and round 5,
  and section 4 says the frozen price makes them useless anyway.
- **Simulating an NPC economy.** The finding asks for ONE more purse and a
  position, not a market of agents. A valley of simulated traders is the
  spreadsheet he named.
- **Deciding what a trader will and will not take.** That is canon and it is his.
- **Any implementation.** MODE: RESEARCH.

## 7. ROUTED
**WORLD**
- `ECON-A-SECOND-PURSE` -- the day's finding. There is exactly one wallet in the
  valley and three of the four things the record says people felt need a second
  one. Not an agent economy: one trader with a pocket and a position.
- `ECON-THE-SHELF-GETS-SHORTER` -- DEPTH already scales the goods list by tier.
  Letting it fall over time is scarcity the player reads by counting rows.

**PEOPLE / FACTIONS**
- `ECON-NOT-FOR-MONEY` -- the refusal escalated from "not at that price" to "not
  for money, bring me water." Rounds 1, 2, 9 and 11 have now all landed on the
  seller's refusal from four different directions. **This lane has never routed
  the same row four times before, and it should be read as a vote.**

**RUN**
- `ECON-PAID-AT-NOON-TOO` -- the cheapest item here. The day loop exists; a
  second pay beat is the shortening every real hyperinflation produced.

**UI**
- Feeds round 5's rows: a falling count in the hand is the display, and it is
  subitizable up to four, which is where it will spend most of the game.

## 8. TEST MATERIAL
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, sections CCC onward. All
`draft:true`, none of it in the game.

## 9. SOURCES
Behaviour under hyperinflation: Wall Street Prep, "Hyperinflation: Economics
Definition and Examples"; EBSCO Research Starters, "Hyperinflation"; Forbes,
"What Is Hyperinflation? Everything You Need To Know"; FasterCapital on hoarding
and stockpiling; maseconomics, "Hyperinflation Case Studies: From Weimar Germany
to Zimbabwe to Venezuela"; Sky HISTORY and CNBC round-ups of the worst episodes,
for the twice-daily pay and the velocity-to-infinity descriptions.
Our own: engine/bohemia_purse.js PRICES and its one create() call,
engine/bohemia_payday.js price/buy, engine/bohemia_economy.js scarcityMult, and
rounds 1, 2, 5, 8, 9 and 10 of this lane.
