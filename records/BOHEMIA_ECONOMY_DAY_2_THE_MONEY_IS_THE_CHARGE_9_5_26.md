# ECONOMY -- DAY 2: A BATTERY IS NOT A COIN. IT IS A CONTAINER.
# (ECONOMY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q2 [money returns], verbatim from VAMILY.md:
#   "How money comes back. How a good becomes money when the money is gone
#    (POW-camp cigarettes, prison mackerel, detergent, phone credit) and what
#    makes it fail. Test the battery against every failure."
# Day 1: records/BOHEMIA_ECONOMY_DAY_1_THE_PRICE_IS_NOT_THE_STORY_9_5_26.md

## 0. THE HEADLINE

**THE GAME ALREADY KNOWS WHAT A BATTERY IS WORTH. IT SAYS SO OUT LOUD, IN A
QUEST LINE SOMEBODY WROTE MONTHS AGO, AND NO SYSTEM IN THE BUILD CAN HEAR IT.**

```
quests/bq/S02_THE_SAME_CRATE_TWICE.bq:82
@SAY Batteries. Real ones, charged, not that swollen junk. My block's been
     dark since the weekend. #tired
```

Read what is packed into one sentence. A **quality grade** (charged, not
swollen). A **counterfeit class** (swollen junk is the bad money). And the
**reason anybody wants it** (the block is dark). Fourteen lines later the rival
buyer adds the **verification method**: *"Charged cells hum a little, you hear
it? From here."*

That is the entire monetary design, written as dialogue, before this lane
existed. The word `charged` appears five times across the quests and **zero
times anywhere in the money layer.** The writers are ahead of the machine.

And the second half of the headline, which is the reframe the research forces:
**the money is not the battery, it is the CHARGE, and the battery is the
wallet.** His ruling is untouched (one AA, one bag of rice); what the record
adds is that a dead AA and a live AA are the same object, and the difference
between them is the whole system.

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

### 1a. THE BATTERY ECONOMY IS ALREADY WRITTEN, IN WORDS, AND PAYS NOTHING
Three of the 27 canon quests already run on batteries and charged cells. S02 is
*entirely* a battery quest: a crate, two buyers, and an objective that reads
`@OBJ 20 "Decide who gets the batteries"`. S03 turns on finding one charged cell
so a band can play.

The pay in those quests is stated in goods, the way every real collapse pays:
*"Get it to my door by dark and you eat for a month"* and, from the rival,
*"Water and a full tank, tonight, in your hands."*

**What the machine actually does when you deliver it:**
```
@DO faction_posture REDS +1
@DO faction_posture BLUES +1
@DO learn carrying_batteries
```
A relationship point and a remembered fact. **`@DO pay` is still used ZERO times
across all 27 quests**, sixteen days after day 20 of the BB study measured it and
one day after day 1 of this lane measured it again. So: **the one quest in
Bohemia that is entirely about money does not move any money.**

### 1b. HIS OWN CURRENCY HAS NEVER MOVED ONCE
```
'electricity' on the walked surface .................. 8 mentions
   of those, inside one inlined quest-text blob ...... 3
   comments and the CURRENCIES declaration .......... the rest
calls that credit or debit electricity ............... 0
calls that credit or debit resources ................. 1   (the roadside faucet)
```
The 7/26 law quotes him: *"electricity -- batteries, kind of tech stuff"*. The
9/4 law quotes him: *"maybe electronics like batteries are the currency."* Six
weeks apart, the same ruling. **The balance has never been touched.**

### 1c. THERE ARE TWO THREE-CURRENCY VOCABULARIES IN THIS BUILD
```
engine/bohemia_purse.js   CURRENCIES = ['resources', 'electricity', 'clout']
engine/bohemia_engine.js  CURRENCY   = { ELECTRICITY, MEDICINE, CLOUT }
```
Two of three agree and the third does not: **RESOURCES versus MEDICINE.** A
contradiction between two live files is a bug, not an interpretation choice. The
purse is the 7/26 law and it quotes his own words, so the purse wins and the
engine's `MEDICINE` is stale. Nobody has ever reconciled them.

### 1d. AND WE ALREADY BUILT THE MODEL OF WHAT MAKES A MONEY FAIL
This is the part worth reading twice. `engine/bohemia_engine.js` carries a
faucet/sink/tank economy with the two hardest ideas in the whole of section 3
already in it:

```js
// effective output: medicine below a quality bar produces nothing usable
effective() {
  if (this.currency === CURRENCY.MEDICINE && this.quality < 0.5) return 0; // "waste"
  ...
}
const MAX_PRODUCER_SHARE = 0.6;   // 60% ceiling; the rest MUST come from others
isMonopolized(currency) { return this.producerShare(currency) > MAX_PRODUCER_SHARE; }
```

**Bad money is not money** (a quality bar, below which the stuff is waste) and
**no single issuer may hold the supply** (a 60% ceiling, from GDD v2 sec 12).
Those are precisely the two failure modes the historical record spends all its
time on. Somebody built them.

**And then:**
```
addFaucet / addSink calls in the entire repo:  0
   (the name appears 6 times, all of them the METHOD DEFINITION itself,
    in three synced copies of the same file)
```
**Not one faucet has ever been poured, in the whole history of this build.** So
`production()` returns 0, `netFlow()` returns 0, `advanceTo()` multiplies zero by
elapsed beats, `producerShare()` returns 0, and `isMonopolized()` can never be
true **because there is no producer to monopolise anything.** `bohemia_loop.js`
boots one empty tank per district and says so in its own comment: *"faucets/sinks
are content, not poured here."* Nobody ever poured them anywhere else either.

The quality bar is aimed at `MEDICINE`, the one currency of the three that the
law deleted. **The single mechanism in this codebase that models what makes a
commodity money fail is pointed at a currency that does not exist.**

### 1e. INSTRUMENT NOTE, BECAUSE THIS ONE NEARLY BECAME A FALSE FINDING
My first sweep concluded the economy engine was unreachable, which is this
study's favourite shape. **It is wrong.** Both the alpha and the demo carry
`BOHEMIA_RUN_CURRENT.html` in an iframe, and that file holds the model. The
model is not stranded; it is **booted and empty**, which is a different defect
and a much cheaper one to fix. I caught it because the grep that was supposed to
prove "nothing loads it" returned seven files and I read them instead of reading
my own summary line. *A negative result is a claim about your instrument.*
Also worth writing down for whoever builds this: **`bohemia_battery.js` is a
DISTRICT** (a grid-scale storage yard on the district kit), not a currency, and
`battery` is also a word for a row of grain silos in `bohemia_utility.js`. Three
meanings, one word.

## 2. THE REAL AISLE: HOW A GOOD BECOMES MONEY

### 2a. THE PRISON CAMP, 1945, WHICH IS STILL THE BEST DATA ANYBODY HAS
Cigarettes became money in the German POW camps and Radford wrote it down while
it was happening. They were **uniform, durable, portable, and convenient for
small and large trades**. Crucially there was **no shortage of German money in
the camp** and the prisoners used it only to settle gambling debts. They did not
lack a currency. They lacked one anybody wanted.

**THE LESSON: a currency is not chosen for being official. It is chosen for
being WANTED.**

### 2b. THE PRISONS, WHERE THE MONEY CHANGED TWICE AND TOLD YOU WHY
Cigarettes ran US prison economies until the federal tobacco ban (policy from
2004; commissary sales stopped in 2006). Then mackerel. Then, around 2016,
**ramen displaced mackerel**, and a year-long study of one state penitentiary
gave the reason: prisoners were *"so unhappy with the quality and quantity of
prison food"* that a cheap durable food became the unit of account. The
researcher's phrase for the cause is **"punitive frugality"**.

**THE LESSON, AND IT IS THE BEST MECHANIC IN THIS RECORD: WHAT PEOPLE PRICE
THINGS IN IS A READOUT OF WHAT HAS GONE WRONG.** The money moved to food because
the food got worse. A player who notices the valley has started quoting prices in
water instead of batteries has learned something about the valley that no meter
told them.

### 2c. THE STREET, WHERE THE CHOSEN GOOD IS THE UNTRACEABLE ONE
Around 2012 liquid laundry detergent became a street currency, traded for drugs,
with a bottle that retailed at roughly $10-$20 moving at **$5-$10** on the black
market. Police explained the choice in one sentence: **"There's no serial numbers
and it's impossible to track."** Universal demand across every class, no
provenance, no registry.

**TWO LESSONS. (1) Unfakeable and untraceable beats valuable. (2) A commodity
money trades BELOW its retail price**, because what you are buying is liquidity,
not the soap.

### 2d. THE PHONE, WHERE THE ISSUER CAN CHANGE THE RULES
Airtime became a working currency across Côte d'Ivoire, Egypt, Ghana, Nigeria,
Kenya, Uganda and Zimbabwe, moved person to person and cashed out informally. Its
limits are structural: it is **not fungible across networks**, transfer costs bite
at every hop, and there is an **issuer who can change the terms whenever it
likes.**

And the detail that closes the loop with day 1: in Zimbabwe, when a shop cannot
make change, **you are handed credit notes, sweets, or airtime instead of coins.**

**THE LESSON: the small-change problem is where every commodity money actually
breaks**, and people solve it with whatever is on the counter.

### 2e. WHAT THE ECONOMISTS SAY THE PROPERTIES ARE
Fungibility, durability, portability, verifiability, divisibility, scarcity, and
acceptability. The standard counter-example is worth keeping because it is our
problem exactly: **a cow is bad money because cows are not divisible and no two
cows are the same**, and because if cows were money, ranchers would make more.

## 3. WHAT MAKES IT FAIL: SIX MODES FROM THE RECORD

**F1. GRESHAM'S LAW. Bad money drives out good, and it is fast.**
Red Cross pipe tobacco was issued at a standard rate of **25 cigarettes to the
ounce**, but an ounce hand-rolled into about **30**. So prisoners broke down
machine-made cigarettes, re-rolled the tobacco at a 20% gain, spent the
hand-rolled and hoarded the real ones. *"The real cigarette virtually disappeared
from the market."*

**F2. THE MONEY STOPS BEING COUNTABLE.**
The direct consequence of F1: hand-rolled cigarettes were not homogeneous, so
*"prices could no longer be quoted in them with safety: each cigarette was
examined before it was accepted and thin ones were rejected, or extra demanded as
a make-weight."* **The money had to be inspected, one unit at a time.**

**F3. THE MONEY GETS SMOKED, AND HARDEST WHEN THINGS ARE WORST.**
When parcels stopped, the money supply *"literally went up in smoke"* and
deflation set in. And the detail that is a gift to a game: **heavy air raids near
the camp raised the non-monetary demand for cigarettes and deepened the
deflation.** People consumed their money when they were frightened.

**F4. A FIXED PRICE LIST KILLS THE SHOP.**
The camp authorities fixed prices and issued a paper currency, the BMk, through a
restaurant. The fixed list *"could not follow the evolutions of the market"*, the
restaurant was ruined, and there was **a flight from the BMk once it was no
longer convertible** into cigarettes or popular food. Same ending as Zimbabwe's
2007 price freeze from day 1: **the seller stops selling.**

**F5. THE ISSUER CHANGES THE RULES.** Airtime's structural flaw. Anything with an
issuer is only as good as the issuer's next decision.

**F6. THE UNDERLYING NEED MOVES.** Mackerel to ramen. A money survives exactly as
long as the want underneath it.

## 4. *** THE BATTERY, TESTED AGAINST EVERY ONE ***
The job the question actually asks for. Verdicts are about the DESIGN, not about
what is built, since almost none of it is.

```
PROPERTY        BATTERY   WHY
fungible        FAILS     a charged AA and a dead AA are the same object.
durable         PARTLY    it holds, but it self-discharges and it swells.
portable        PASSES    the best of any candidate. dense, pocketable.
verifiable      PARTLY    needs a tester, a tongue, or an ear.
divisible       FAILS     you cannot make change from a AA.
scarce          PASSES    nothing in the valley manufactures one.
acceptable      PASSES    a dark block wants light more than it wants anything.
```

**F1 GRESHAM: THIS IS OUR BIGGEST RISK AND IT IS ARITHMETIC, NOT BAD LUCK.**
The moment a full cell and a half-dead cell both count as "one battery", every
player and every trader spends the weak ones and keeps the strong ones, and
within a week the money in circulation is all nearly flat. The camp's answer was
not a rule. It was **inspection**, and our writers already wrote the inspection:
they hum.

**F2 NOT COUNTABLE: SAME PROBLEM, AND IT IS THE FEATURE.** A money you must test
one unit at a time is a nightmare for an economy and **a gift to a game**:
handling money becomes a VERB with a skill in it, and it is one beat at 120 BPM
(pick it up, listen, decide). "Real ones, charged, not that swollen junk" is a
sentence about grading currency, and it is already in the build.

**F3 CONSUMED, WORST WHEN SCARED: WE ALREADY HAVE THE AIR RAIDS.** LIGHT IS
TERRITORY, and the day-23 line "the night eats power" means holding ground burns
your money. A frightened player leaves the lights on. **The money supply
contracts exactly when the pressure rises**, which is the right direction and
costs no dial.

**F4 FIXED PRICE LIST: THE HONEST TENSION, STATED PLAINLY.** EVERYTHING COSTS ONE
(8/15) is a fixed price list, and every fixed price list in this record ended the
same way. But the resolution is not to unfix the price, which is his ruling. It
is that **the BMk did not die of having a fixed price. It died because the shop
could not say no.** Day 1 measured that our seller always sells; day 2 arrives at
the identical row from the other side. **A fixed price plus a real refusal is a
market. A fixed price without one is the restaurant that closed.** And the fixed
price quietly solves F-divisibility: **if everything costs one, there is no change
to make.** His 8/15 ruling is an answer to the hardest problem in this record and
nobody had noticed.

**F5 THE ISSUER: NOBODY MINTS A BATTERY, BUT SOMEBODY CHARGES IT.** A battery has
no issuer, which is its great strength over airtime. But **charge does**: the
valley's grid is 12% lit and every circuit has an owner. **Whoever holds the lit
ground is the mint.** That is not a new mechanic, it is LIGHT=TERRITORY read as
monetary policy, and it hands the faction layer a job it can actually do.

**F6 THE NEED MOVES: OUR ONE STRUCTURAL SAFETY.** Ramen beat mackerel because the
want moved. In a valley where light is safety and territory, the want under the
battery does not move. **But the money should be allowed to move anyway**, because
the ramen lesson is the best diagnostic in section 2: if the valley ever starts
quoting prices in water instead of batteries, that is the game telling the player
something has gone badly wrong, without a single number on screen.

### 4b. THE REFRAME THIS FORCES
Every failure above is about the difference between a full cell and an empty one.
So: **the unit of account is his (one battery, one bag of rice) and the unit of
value is the CHARGE.** A dead AA is not worthless, it is an **empty wallet**, and
that is why "swollen junk" is an insult and not a description. It also means the
stock of shells is fixed and falling (day 10 of the BB study: loot is a
countdown) while the stock of **charge is renewable**, which is the only thing
that keeps a hundred-hour economy from bleeding to zero. The countdown and the
economy stop fighting each other.

## 5. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named enters this record, the design, or the vocabulary.)
- The mechanism that recurs wherever players pick their own money: **they choose
  a thing with real use that is DESTROYED by that use, and is common enough to be
  liquid.** The consumption is not a flaw, it is what stops the supply piling up.
  A charged cell that gets used up is textbook.
- **Liquidity is a feedback loop**: the more central a trader is, the more they
  concentrate on one currency, which makes that currency more liquid, which pulls
  everyone else in. So a money spreads from the busiest tables outward. For us
  that means the market hubs and the faction seats decide what the valley quotes
  in, not a global setting.
- The standing practitioner warning, and we are on the wrong side of it: **size
  the sources against the sinks before building anything.** Day 1 measured our
  faucet at zero; day 2 measured the engine's faucet count at zero as well. Two
  different economies, both with nothing coming in.

## 6. REFUSED
- **Inventing what a battery buys beyond his own sentence.** One AA, one bag of
  rice, EVERYTHING COSTS ONE. Denominations are Q8's question and the number is
  his either way.
- **A fourth currency, an exchange rate, a chart, a wallet screen.** Three
  currencies are locked (7/26) and day 17 banned the second number.
- **Reconciling MEDICINE into the purse by adding it back.** The law is newer than
  the engine; the fix is to delete the stale vocabulary, and that is WORLD's call
  to make, not this lane's to do.
- **Any implementation.** MODE: RESEARCH.

## 7. ROUTED
Rows for the coordinator. This lane changes status words only.

**WORLD**
- `ECON-CHARGED-OR-SWOLLEN` -- the day's finding. A battery carries a charge
  state, a dead one is an empty wallet, and the trade reads it. The words exist
  (`quests/bq/S02`), the currency exists (`electricity`), and nothing joins them.
- `ECON-POUR-ONE-FAUCET` -- `addFaucet`/`addSink` have never been called once.
  The tank model, the quality bar and the 60% anti-monopoly ceiling are all built
  and all computing zero. This is the cheapest economy work in the repo.
- `ECON-ONE-CURRENCY-VOCABULARY` -- `engine/bohemia_engine.js` still declares
  MEDICINE where the 7/26 law says RESOURCES. Two live files contradict; the law
  wins; delete the stale one. ENGINE SYNC in spirit.
- `ECON-THE-QUALITY-BAR-POINTS-AT-A-GHOST` -- move the `quality < 0.5` waste rule
  off MEDICINE and onto the currency we actually have.
- `ECON-ELECTRICITY-HAS-NEVER-MOVED` -- zero credits, zero debits, ever. Rides
  with BB-THE-NIGHT-EATS-POWER and BB-BATTERIES-ARE-THE-MONEY.

**FACTIONS**
- `ECON-WHOEVER-HOLDS-THE-LIGHT-IS-THE-MINT` -- charging is the only way charge
  enters the valley, the grid is 12% lit, every circuit has an owner. Who holds
  what is his (MAP LAW), but the consequence is mechanical.

**QUESTS** (parked, banked)
- `ECON-S02-PAYS-WHAT-IT-PROMISES` -- the battery quest promises "you eat for a
  month" and pays a posture point. First customer for `@DO pay`.

**UI**
- `ECON-YOU-CAN-HEAR-IT` -- grading a cell as a one-beat action, on the beat, in
  words not numbers. Day 17 holds: one number, and it is not this one.

**SHARED**
- Reinforces day 1's `ECON-THE-SELLER-HAS-A-VIEW-ABOUT-TOMORROW`. Two research
  days, two aisles, one row: **a fixed price with no refusal is the restaurant
  that closed.**

## 8. TEST MATERIAL
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, section I onward. All `draft:true`,
none of it in the game.

## 9. SOURCES
POW camp: R. A. Radford, "The Economic Organisation of a P.O.W. Camp",
*Economica* (1945); Finance Watch, "The perfect draw: when cigarettes became a
war camp currency"; Carleton Newsroom, Frances Woolley, "The POW economy
explained"; Encyclopedia of Money, "POW Cigarette Standard"; naked capitalism /
New Economic Perspectives on cigarette-money as commodity money origination.
Prisons: Marketplace, "Why ramen noodles replaced cigarettes as prison currency";
Washington Post, "Ramen has become the black-market currency in American
prisons"; CBS News on the Gibson-Light study and "punitive frugality"; US Bureau
of Prisons tobacco policy 2004-2006 (US News; Journal of Hospital Management and
Health Policy).
Detergent: Reason Foundation, "Sound Money: Tide as gold standard"; AEI Carpe
Diem; Police1 and CBS News on detergent theft task forces.
Airtime: blog on how East African air-time credit became a currency and led to
mobile money; Reloadly on airtime money transfer; Zimbabwe currency guides on
being given sweets, credit notes or airtime as change.
Properties of money: St Louis Fed, "Functions of Money"; Visual Capitalist, "The
Properties of Money"; standard commodity-money property lists.
Game economies: Asadi, "Understanding Currencies in Video Games: A Review"
(arXiv); "Trade Networks and the Rise of a Dominant Currency" (arXiv);
gamedesignskills.com and Game Developer on faucet/sink balance.
