# ECONOMY -- ROUND 8: THE MONEY SUPPLY IS THE CELLS, NOT THE CHARGE
# (ECONOMY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q8 [battery value], verbatim from VAMILY.md:
#   "Electricity as money in the real world. Microgrids, battery economics,
#    Nevada solar, what a AA is really worth in energy. Denominations for the
#    battery."
# Named DAY 8 for the machine. A round is one VAMILY and is never called a day
# to Paolo (NO CALENDAR TALK, 9/5, LOCKED).

## 0. THE HEADLINE

**A AA BATTERY HOLDS ABOUT 3.75 WATT-HOURS. THE ELECTRICITY INSIDE IT IS WORTH
SIX HUNDREDTHS OF A CENT.** You pay about **889 times** that for the cell. You are
not buying the energy. **You are buying the container.**

Which is exactly why it becomes money when the grid dies, and it settles the
denominations question in a way I did not expect:

**ONE SOLAR PANEL IN LAS VEGAS CAN FILL ABOUT 788 CELLS A DAY.** Energy is not
scarce here. **Cells are.** Nothing in a dead city manufactures a AA.

> **THE MONEY SUPPLY OF BOHEMIA IS THE NUMBER OF WORKING CELLS IN THE VALLEY,
> AND IT ONLY EVER GOES DOWN.**

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

### 1a. THE PRICE TABLE, AGAINST REAL ENERGY
Every good is priced at one battery, which is his 8/15 ruling applied uniformly
and is correct. Put the real energy beside it:
```
good          price          unit      what that unit really is
water         1 electricity  L
food          1 electricity  ration    2,000 kcal = 2.32 kWh = 620 AA of energy
salvage       1 electricity  kg
meds          1 electricity  dose
power         1 electricity  kWh       1 kWh      = 267 AA of energy
fuel          1 electricity  L
...           1 electricity  (and six more)
```
**`power` sells a kilowatt-hour for one battery, and a kilowatt-hour is 267
batteries of energy.** Buy power for one cell, get 267 cells' worth. That is a
money pump sitting in the shop.

**And it is NOT a mistake in his ruling.** EVERYTHING COSTS ONE is fine. The
defect is entirely in the **unit**: somebody chose "kWh" for the power good back
when power was a utility abstraction, and the 9/4 battery ruling arrived later and
made that unit enormous. Which produces the actual answer to Q8, in section 4.

### 1b. AND THE FOOD ROW IS THE SAME SHAPE, POINTING THE OTHER WAY
One ration is 2,000 kcal, which is **620 AA of energy**, sold for one battery.
So the shop sells a day of human fuel for one cell **and** a kilowatt-hour for one
cell, while those two things differ by a factor of 2.3 in energy. His own pairing
is the sane one: *"For one aa battery a bag of rice."* **Rice for a battery is
right. A kilowatt-hour for a battery is not.**

### 1c. WHAT OUR OWN MODULE ALREADY SAYS ABOUT POWER
```js
power: {unit:'kWh', need:0, base:2, note:'a SERVICE at live clusters only (12% law)'}
```
`need: 0` is correct and deliberate (round 1 established the module treats
need-zero goods as event goods). The note is right too. **The unit is the whole
problem, and it is one string.**

## 2. THE REAL AISLE

### 2a. WHAT A AA ACTUALLY HOLDS
```
alkaline AA      2,500 mAh x 1.5 V  =  3.75 Wh     (measured range 2-4 Wh/cell)
rechargeable AA  2,000 mAh x 1.2 V  =  2.4  Wh     (NiMH, 1,200-2,000 mAh typical)
```
And what that does:
```
one phone charge (5.45 Wh) ........... about 1.5 AA
an LED lamp at 3 W ................... about 1.3 hours from one AA
one kWh .............................. 267 AA
a 12V 105Ah deep-cycle battery ....... 336 AA
a day of food, 2,000 kcal ............ 620 AA
a 50 kWh car battery ................. 13,333 AA
```

### 2b. THE ENERGY IN A BATTERY IS WORTH ALMOST NOTHING
At about **$0.15 per kWh**, the 3.75 Wh in an alkaline AA is worth **$0.00056**.
Six hundredths of a cent. A AA retails around fifty cents, so the buyer pays
roughly **889 times the value of the electricity** for the packaging, the shelf
life and the fact that it fits in a torch.

**This is the finding that makes his ruling work.** A battery is a terrible way to
buy energy and a superb way to carry it. In a live city that makes it a
convenience item. **In a dead one it makes it money**, because the only thing
anybody can actually trade is portable, verifiable, immediately useful power, and
that is the container's job, not the electron's.

### 2c. THE MINT: LAS VEGAS IS THE BEST PLACE ON EARTH TO DO THIS
```
Las Vegas peak sun hours ............. 6.3 per day
one 400 W panel ...................... about 2.52 kWh/day
that is .............................. 672 AA-equivalents of energy per day
cells it can actually fill ........... about 788 rechargeable AA per day
                                       (at a conservative 75% round trip)
```
**One panel. Nearly eight hundred cells a day.** Round 6 found a real operator
running 13 resorts on 100 MW of solar at up to 90% of daytime load. The valley is
not energy poor. It is the opposite.

### 2d. AND THE REAL WORLD ALREADY SELLS ELECTRICITY THIS WAY
Pay-as-you-go solar across East and West Africa rents a household a panel, a
battery, a charge controller, LED bulbs and a phone charger, and takes payment
**daily, weekly or monthly by mobile phone**. The pricing rule is the useful part:
the fee is set at roughly **what the household already spent on kerosene and
candles.** Not cost, not energy content. **What the thing it replaces used to
cost.** And prepaid metering is what makes it work at all: a trial in Mali moved
payment rates from **82% to 99%.**

**So electricity as money is not a fiction we are inventing. It is a working
retail model for hundreds of thousands of off-grid households, and it is priced
by replacement, and it is prepaid.**

## 3. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named enters this record, the design, or the vocabulary.)
- The standing rule for a currency that is also a consumable: **the sink must be
  something the player wants to do, not a tax.** Burning a cell for light at night
  is a want. A wallet that leaks is a tax.
- **A deflating money supply is a design, not a bug**, as long as the thing it
  buys is renewable. What breaks a shrinking currency is when the goods shrink
  with it.
- The mechanism worth naming for denominations: **one unit that a person can hold
  in a hand, and one unit that takes two people and a cart.** Not a numeric
  ladder. A ladder of what your body can do with it.

## 4. *** THE FINDING THAT PROVES US WRONG ***

> **WE HAVE BEEN ASKING WHAT A BATTERY IS WORTH. THE REAL QUESTION IS HOW MANY
> BATTERIES EXIST, BECAUSE THE VALLEY CAN MAKE CHARGE ALL DAY AND CANNOT MAKE A
> SINGLE CELL.**

One panel fills 788 cells a day. If everything costs one battery, a single working
panel is infinite money **unless the number of cells is fixed**. And it is: no
dead city manufactures a AA. Every cell in the valley was on a shelf when the
lights went out, and from that moment the count only falls, because they get lost,
corroded, punctured, and left in things.

That gives Bohemia a currency with a shape almost nothing else has:
- **The supply is fixed and shrinking** (the cells).
- **The value inside each one is renewable** (the charge).
- **So the money gets scarcer while staying just as useful**, which is the exact
  opposite of every collapse in round 1, where the money got plentiful and useless.

And it retires a worry from round 2. Gresham's law said everyone will spend flat
cells and hoard full ones. **That is now correct behaviour rather than a defect**,
because a flat cell is still money: it is an empty wallet somebody will refill.
The bad money does not drive out the good. **It queues at the panel.**

### 4b. AND THE ANSWER TO "DENOMINATIONS FOR THE BATTERY"
Q8 asks for denominations. The honest answer is that **EVERYTHING COSTS ONE
already removed the denominations of price, so all of the design work has moved
into the SIZE OF ONE UNIT of each good.** That is where the money pump in 1a came
from, and it is the whole job:
```
a unit should be ONE PERSON, ONE USE, ONE MOMENT.
  a ration        one person, one day        RIGHT (his own pairing)
  a litre         one person, part of a day  RIGHT
  a dose          one person, one time       RIGHT
  a kWh           one household, a whole day WRONG. 267 cells for one.
                  the unit should be A CHARGE: what one cell holds.
```
**The denominations are not in the money. They are in the goods**, and there is
one row in our table where that is wrong today.

If he ever wants physical denominations, the record says make them **body-scale,
not numeric**: a cell in a pocket, a car battery two people carry, a bank on a
cart. Not one, five and twenty five.

## 5. REFUSED
- **Repricing anything.** Prices are his and EVERYTHING COSTS ONE is locked. This
  record proposes changing a UNIT, which is a mechanism, and even that is routed
  rather than done.
- **Inventing a cell count for the valley.** How many batteries exist at the start
  is exactly the kind of number that is his.
- **A battery meter, a charge bar, a percentage.** Round 5 settled it: a number
  above four is unreadable and a bar is a number in a costume.
- **Numeric denominations (a 5-cell note, a 25-cell note).** Section 4b: it would
  reintroduce the comparison day 17 banned, and his one-price ruling already
  solved the change problem round 2 found.
- **Any implementation.** MODE: RESEARCH.

## 6. ROUTED
**WORLD**
- `ECON-A-CHARGE-IS-THE-UNIT-NOT-A-KWH` -- `power` sells 267 cells of energy for
  one cell. One string in `GOODS.power.unit`. The single cheapest correctness fix
  this lane has found in eight rounds, and it is not a price change, so it needs
  no ruling.
- `ECON-THE-CELLS-ARE-THE-MONEY-SUPPLY` -- the count of working cells is fixed and
  falling; charge is renewable. Rides with round 2's charge finding and with
  BB-BATTERIES-ARE-THE-MONEY.
- `ECON-A-FLAT-CELL-IS-STILL-MONEY` -- retires round 2's Gresham worry. A dead
  cell is an empty wallet, so bad money queues at the panel instead of driving out
  good.

**FACTIONS**
- Reinforces round 7's `ECON-WHOEVER-PUMPS-DRINKS` and round 2's "whoever holds
  the light is the mint" with a number: **one panel is about 788 cells a day**, so
  a single working array is a mint, and mints are worth fighting over.

**UI**
- `ECON-A-CELL-IS-A-THING-NOT-A-COUNT` -- feeds round 5's routed rows. Under four
  cells is subitizable, which is most of the time.

**LIFE + CITY / COOK**
- Feeds round 4's `ECON-THE-FIRST-BUILDING-TURNS-A-LIGHT-ON` and round 7's pump
  station: a solar array is the mint, a pump is the thirst, and both are buildings
  that already exist in the enum.

## 7. TEST MATERIAL
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, sections NN onward. All
`draft:true`, none of it in the game.

## 8. SOURCES
Battery energy: Pololu, "Understanding battery capacity: Ah is not A";
batteryequivalents.com, "AA Batteries: Size, Types and Equivalents"; Interstate
Batteries, "Alkaline/Rechargeable AA Battery Specs"; PoweringAutos on mAh and
watt-hours.
Comparisons: calculateme and unit converters for 2,000 kcal to kWh (2.3244 kWh);
Forbes, "How Much Energy Does Your iPhone and Other Devices Use"; NAZ Solar
Electric, "Deep Cycle Battery Types Comparisons"; US DOE on plug-in vehicle
battery capacity.
Nevada solar: Anker SOLIX, "How Many kWh Can a Solar Panel Generate"; peak sun
hour guides giving Las Vegas about 6.3 hours; Nevada solar installation guides.
Electricity sold as money: World Resources Institute, "Pay-As-You-Go Solar Could
Electrify Rural Africa"; energypedia, "Fee-For-Service or Pay-As-You-Go Concepts
for Photovoltaic Systems" (including the Mali prepaid trial, 82% to 99%); South
African prepaid meter guides.
Our own: engine/bohemia_economy.js GOODS.power, engine/bohemia_purse.js PRICES,
laws/BOHEMIA_ADDENDUM_EVERYTHING_COSTS_ONE_8_15_26.md, and rounds 2, 5, 6 and 7
of this lane.
