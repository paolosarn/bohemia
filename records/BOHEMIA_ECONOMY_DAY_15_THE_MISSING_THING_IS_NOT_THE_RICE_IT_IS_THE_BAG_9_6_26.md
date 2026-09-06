# ECONOMY -- ROUND 15: THE MISSING THING IS NOT THE RICE, IT IS THE BAG
# (ECONOMY lane, 9/6/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q15 [first hour], verbatim from VAMILY.md:
#   "What a player must own by the end of their first hour for the economy to be
#    felt: how real people in a collapsed economy describe their first week (what
#    they got, what they lost, what they learned to do), and what the best
#    economic games hand a player in hour one. Deliver the list, in order, that
#    RUN and LIFE+CITY should build toward."
# Named DAY 15 for the machine. A round is one VAMILY and is never called a day
# to Paolo (NO CALENDAR TALK, 9/5, LOCKED).

## 0. THE HEADLINE

I drove the whole first hour on the real modules instead of describing it.

> **A PLAYER WHO DOES EVERYTHING RIGHT ENDS HIS FIRST HOUR OWNING NOTHING, AND
> THE PEOPLE WHO DEPEND ON HIM DO NOT EAT, BECAUSE THE FOOD HE BOUGHT NEVER
> ARRIVED.**

His entire economic record for day one is two lines in the ledger:

```
day 1    1 electricity  source   quest:COMPLETE
day 1   -1 electricity  drain    buy:food
```

One in, one out, and no food. And the real record says the reason is deeper than
a missing wire: **in a real first week nobody's problem is buying a thing. It is
having somewhere to put it.** Section 4.

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

Every step below is `node` against the shipped modules, in order, as a new player
would meet them.

```
STEP 1  he wakes up.
        purse: {resources:0, electricity:0, clout:0}   items: THERE IS NO ITEM LIST
STEP 2  he walks to the nearest market. 7.3 cells away (Homeless, a camp).
        the shelf has 2 things on it: water, food
STEP 3  he tries to buy the bag of rice. He has nothing.
        -> {applied:false, reason:"CANNOT_AFFORD"}
STEP 4  he finishes a job. That is the only wage in the game.
        purse: {resources:0, electricity:1, clout:0}
STEP 5  he buys the bag of rice.
        -> applied:true  paid:1  in electricity
        purse: {resources:0, electricity:0, clout:0}
        *** HE PAID FOR FOOD AND resources DID NOT MOVE. 0 BEFORE, 0 AFTER. ***
STEP 6  night falls and the people who depend on him eat.
        -> {applied:false, reason:"INSUFFICIENT", wanted:1, have:0}
        *** THE DAY ATE, HE HAD BOUGHT FOOD, AND THE MEAL WAS REFUSED. ***
```

### 1a. THERE IS NO BAG, AND THAT IS THE WHOLE SHAPE OF IT
`BohemiaPurse` is **three numbers**: `resources`, `electricity`, `clout`. There is
no inventory anywhere in the game. Nothing the player can hold has a name, a
count, or a place. `resources` is a lump, not a bag of things.

So `buy()` has nowhere to put what you bought. It does the only honest thing it
can: it charges you, records `buy:food` in the ledger as a hard drain, and stops.
WORLD's own STATE line says so plainly and calls it a known gap on [rice clock].
**Re-measured this round, still true, and now measured all the way through to the
consequence, which nobody had done: the refusal lands at `day:ate` that same
night.**

### 1b. THE RECEIPT THAT LOOKS LIKE AN INVENTORY AND IS NOT ONE
The walked surface keeps `MKT_BOUGHT`, a tally of how many of each good you
bought. It is written on every purchase, it rides the save, it is restored, and
it is exposed on a status read.

**Nothing ever reads it to decide anything.** It is never spent, never consumed,
never checked. `day:ate` drains `resources`, not this. So the game does remember
that you bought food. It just cannot feed anybody with the memory.

### 1c. WHAT A PLAYER CAN OWN AT ALL
The save carries seed, clock, position, the day loop, the quest, the purse, the
century ledger, the market ledger, the people, and the build delta on its own key.
Everything a player can accumulate is on this list and it is short:

```
electricity   +1 per completed job. 27 jobs exist. That is the whole wage.
resources     +1 per placed building per day
clout         from deeds
buildings     1 per battery, on desert only, 585 plots in the valley
housing       derived from buildings, never owned separately
```

**Nothing on that list is a thing.** Four numbers and a set of coordinates.

### 1d. AND THE FIRST MORNING IS ACTUALLY GOOD
Ran RUN's own first-morning gate this round rather than assuming: **19 passed, 0
failed.** The loudest control on the first morning is the phone (loudness 90
against 33 for the next thing), the loudest thing on the phone is TAKE IT, and
**TAKE IT needs one tap.** The road into the game is clear. The hole is what
happens after he takes the job and gets paid for it.

### 1e. AND THE COLD HAND IS RED RIGHT NOW

RUN's COLD HAND gate exists as of 9/5 and its whole test is the first minute: *"a
cold hand presses the loudest thing on screen and never reads."* I ran it, because
this round is about exactly that hour and because its own header says nobody had
asked what a second run would find.

**THE COLD HAND: 4 passed, 2 failed.**

```
FAIL  THE GAME ADVANCES UNDER A COLD HAND -- clock 1d 360m -> 1d 360m over 40 presses.
      "This is the exact assertion that was false on 8/25: 06:00 at the first tap
       and 06:00 at the twelfth"
FAIL  AND IT IS STILL ADVANCING AT THE END, NOT JUST AT THE START -- over the last
      twelve presses the clock went 1d 360m -> 1d 360m
trail: shell:front > shell:openWatch > city:rungbtn > city:pad > city:dcgo x36
```

A simulated stranger gets four taps into the game, lands on the day card's GO, and
**presses it thirty-six times while the clock never moves.** 06:00 on day one at
the first tap and 06:00 on day one at the fortieth. It is the same failure the
test was written for on 8/25, in a different place.

**THIS IS NOT THIS ROUND'S TREE.** My working copy of `slices/`, `engine/` and
`gates/` is byte-identical to `origin/main`; the only thing I changed is records
and the board. It is red on main.

**AND IT IS NOT THIS LANE'S TO FIX** (MODE: RESEARCH, and it is RUN's gate on
RUN's surface). It is reported here because a round about the first hour that ran
the first-hour instrument and stayed quiet about a red would be worthless.

## 2. THE REAL AISLE: THE FIRST WEEK, IN FOUR COLLAPSES

I looked for what people GOT, what they LOST and what they LEARNED. The four
records agree with each other and disagree with what I expected.

### 2a. WHAT THEY LOST FIRST IS ACCESS, NOT VALUE
**Argentina, 1 December 2001.** The corralito froze the accounts and capped
withdrawals at 250 pesos a week. The money still existed and was still worth
something; you just could not reach it. **By 5 December, four days later, shop
sales had collapsed 50 to 70 percent.**

**Lebanon, October 2019.** The banks simply shut, for over two weeks, longer than
they ever closed during a fifteen-year civil war.

> **THE FIRST WEEK IS NOT PRICES GOING UP. IT IS THE SHOP STOPPING.** In four days
> Argentina's shops lost two thirds of their trade with the currency still
> nominally fine.

### 2b. WHAT THEY BOUGHT WAS SOMEWHERE TO PUT THINGS
This is the part that surprised me, and it is the same in every case.

- **Lebanon:** the safe shops did a roaring trade, business up about 30%, safes
  from $35 to $15,000, as people took their cash home. The jewellery shop next
  door filled up with people **selling** what they already owned.
- **Sarajevo:** the two things people needed were **containers to carry water in**
  and **a stove made out of broken machines and scrap** to burn anything in. Not
  water. Not fuel. The container and the stove.
- **Lebanon again, on the water:** the share of households depending on delivered
  water roughly doubled, to 35% in the south, 28.5% in Keserwan-Jbeil, 19% in
  Mount Lebanon. What you needed was a tank.

> **NOBODY'S FIRST PURCHASE IN A COLLAPSE IS A GOOD. IT IS A CONTAINER, A STOVE, A
> TANK, A SAFE: THE MEANS TO GET AND HOLD WHAT COMES NEXT.**

### 2c. WHAT THEY LEARNED WAS WHO TO STAND NEXT TO
Argentina's answer to having no money was not cleverness with money. It was
**1.5 million people in barter clubs**, nationwide, within months, where "you
could get almost anything." Sarajevo's trade currency was cigarettes, coffee and
alcohol. In both cases the first skill is not a price. **It is knowing who has
what, and being somebody they will deal with.**

## 3. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named enters the design; these are mechanics as mechanics.)

- **THE FIRST REWARD SHOULD LAND IN THE FIRST 30 TO 60 SECONDS.** The design
  literature is blunt about it: if a player has not felt good about something he
  did inside a minute, most of them are already gone.
- **ONE ACTION, ONE REWARD, ONE THING TO SPEND IT ON.** The teaching loop early on
  is deliberately a single chain, with almost no punishment for getting it wrong.
- **HARVEST FIRST.** The standard advice for a survival economy is to build the
  gathering loop before anything else, because everything downstream needs
  something to have been got.
- **FEW CURRENCIES, ON PURPOSE.** More currencies is harder to tune and harder to
  read, and complexity can always come later. His three-currency ruling is
  already this, and it is right.

**AND OUR OWN CANON ALREADY SAYS THE HARDEST PART OF IT** (the Battle Brothers
study, 8/28, campaign layer only): median day-one retention is about 22 to 26%,
most of the decision happens in the first session, strategy is the worst-hit
genre, and **"THE FIRST HOUR DOES NOT TEACH BY KILLING YOU."**

## 4. *** THE FINDING THAT PROVES US WRONG ***

I came into this round certain the answer was the bag of rice. It is the
coordinator's own [rice clock] row, it is beautiful, and I have quoted it
approvingly in three previous records: everything costs one, a day of work pays
one, so the one thing you must buy every day is the whole economy in miniature.

**The real record says the rice is the second thing, and we are missing the
first.**

> **IN A COLLAPSE THE FIRST THING PEOPLE ACQUIRE IS NOT A GOOD. IT IS A PLACE TO
> PUT GOODS. THE SAFE, THE WATER CONTAINER, THE TANK, THE STOVE. AND OUR PLAYER
> CANNOT OWN A GOOD AT ALL, BECAUSE THERE IS NO BAG. THE MISSING THING IN HOUR ONE
> IS NOT THE RICE. IT IS THE BAG.**

The two halves are the same defect seen from two ends:

- **From the code:** `buy()` charges and cannot deliver, because the purse is
  three numbers and has nowhere to put a loaf. The refusal surfaces that night at
  `day:ate`.
- **From the world:** a Sarajevan with no container could not use a well he was
  standing next to. A Lebanese family with cash and no safe was not holding
  savings, it was holding a risk. **A good you cannot hold is not a good.**

And it explains something that looked like a separate bug. Round 13 measured that
the whole game has eleven things worth a battery and mints 585 a night. **Of
course it does. Nothing in this game can be kept.** A currency is the only thing
our player can hold, so a currency is the only thing he accumulates. Give him
somewhere to put a good and the demand side has somewhere to grow.

**THE CHEAPEST HONEST VERSION IS ALREADY HALF-BUILT AND NOBODY CALLED IT THAT.**
`MKT_BOUGHT` is already a per-good count that is already written on every
purchase, already saved and already restored. It is a bag with nothing reading it.
The gap between a receipt and an inventory is one reader.

## 5. THE LIST, IN ORDER (the deliverable)

What a player must own by the end of hour one, ranked, each with why the real
record puts it there and what it costs us.

**1. SOMEWHERE TO PUT THINGS.** The safe, the container, the tank. Without it
nothing else on this list can exist, and today it is the one thing that is
missing outright. Cost to us: one reader over a count we already keep.

**2. ONE GOOD HE ACTUALLY HOLDS -- and make it the rice.** [rice clock] is right,
it just needs item one under it. He must be able to look at what he owns and see
"one bag", not a number that went down.

**3. A THING HE ALREADY OWNED THAT HE CAN SELL.** Lebanon's jewellery shops filled
with sellers in week one. Selling something you started with is how a player
learns that value is not only earned, and it is the fastest way to teach that
everything here is worth something to somebody. We have no sell verb at all.

**4. SOMEWHERE THAT IS HIS.** A plot, a roof, a corner. Round 12 measured that
housing exists and counts only what you built; round 13 measured a building costs
one battery and takes no time. This one is nearly free and it is already good.

**5. ONE PERSON WHO WILL DEAL WITH HIM.** 1.5 million Argentines did not learn
prices, they learned a room and the people in it. The nearest market seat is 7.3
cells away and has two things on the shelf. It needs to be a person before it
needs a third good.

**6. ONE OBLIGATION HE HAS NOT SETTLED.** Round 9's finding was that a debt is a
person who remembers. Owing somebody at the end of hour one is what makes hour two
happen, and it is the cheapest hook in the whole list.

**Deliberately NOT on the list: a battery balance.** He will have one. It is not
what he should be able to point at when somebody asks what he got today.

## 6. REFUSED

- **AN INVENTORY SCREEN WITH SLOTS AND WEIGHTS.** The anti-spreadsheet ruling
  (7/26, "games like that are called spreadsheet simulators and I'm not a fan")
  kills a grid of icons with numbers on them. What section 5 asks for is one line
  a person could say out loud: "a bag of rice and a jerrycan."
- **A FOURTH CURRENCY FOR GOODS.** Three currencies is LOCKED. A bag is not a
  currency; it is a place, and the purse's own header already forbids the other
  reading.
- **CHANGING THE PRICE OF ANYTHING.** Everything costs one (8/15). Nothing in this
  record moves a price.
- **A HUNGER METER ON THE PLAYER.** The four-verb law already says it: `day:ate`
  is "the people who depend on you ate. No meter on the player's body: he is not
  hungry, THEY are." That is better than a hunger bar and it stays.
- **BUILDING THE FIX.** This lane does not implement, and the wire from `buy()` to
  something a player holds is LIFE + CITY's and WORLD's.
- **A TUTORIAL THAT EXPLAINS ANY OF THIS.** Our own canon: the first hour does not
  teach by killing you, and [rice clock] says it is taught by wanting it, not by a
  text box.

## 7. ROUTED

**TO WORLD [rice clock] THE-BAG-OF-RICE-IS-THE-TUTORIAL -- and this is the row
that unblocks the most:**
1. **`buy()` CHARGES AND DELIVERS NOTHING.** Measured end to end this round: pay
   one battery for food, `resources` stays 0, and that night `day:ate` is REFUSED
   for INSUFFICIENT with `wanted:1, have:0`. The tutorial's own loop cannot close.
2. **THE HALF THAT EXISTS IS `MKT_BOUGHT`**, a per-good count already written on
   every purchase and already riding the save. The gap between it and an inventory
   is one reader.

**TO LIFE + CITY:**
3. **THERE IS NO SELL VERB.** Item 3 on the list. In every real first week people
   sold what they already had before they bought anything.
4. **A PLAYER CANNOT POINT AT ANYTHING HE OWNS.** Four numbers and a set of
   coordinates. Whatever the surface is, it is not a slot grid (section 6).

**TO RUN:**
5. **THE COLD HAND IS RED ON MAIN: 4 passed, 2 failed.** A simulated stranger
   gets four taps in, lands on the day card's GO and presses it thirty-six times
   while the clock stays at 06:00 on day one -- the same failure the test was
   written for on 8/25, in a different place. Proven not to be this round's tree:
   slices, engine and gates are byte-identical to origin/main. The first-morning
   gate is 19/0 and TAKE IT needs one tap, so the road IN is clear; it is the hour
   after that is broken, and nothing tests what happens once the job pays.
6. **THE FIRST REWARD SHOULD LAND INSIDE A MINUTE.** Ours lands when a quest
   completes and then evaporates at the shop.

**TO THE COORDINATOR, for Paolo:**
7. **[PENDING Paolo]** What does the player START with? He boots with nothing:
   0 batteries, 0 goods, no possessions. Every real first week begins with
   somebody selling or improvising something they already had. What is in his
   hands at the first frame is canon, and canon is his.

## 8. TEST MATERIAL
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, sections WWW through AAAA. Every
line `draft:true`, in the bank, never in the game.

## 9. SOURCES

REAL AISLE
- Argentina, corralito 1 December 2001, 250 pesos a week; shop sales down 50-70%
  by 5 December; barter clubs (trueque) reaching more than 1.5 million people --
  en.wikipedia.org/wiki/Corralito ;
  batimes.com.ar/news/argentina/argentines-recall-nations-worst-ever-crisis-20-years-on.phtml
- Lebanon, banks shut October 2019 for over two weeks, longer than during the
  civil war; safe shops up ~30%, safes $35-$15,000; jewellery sold for cash --
  cnbc.com/2019/10/23/lebanon-protests-fears-of-a-cash-crisis-as-banks-remain-shut.html ;
  aljazeera.com/economy/2019/11/1/lebanons-banks-reopen-after-two-week-closure ;
  gulfnews.com/world/mena/lebanon-economic-crisis-people-buy-safes-to-store-cash-sell-off-jewelry-1.67982088
- Lebanon water: households on delivered water roughly doubling, to 35% / 28.5% /
  19% -- iwaponline.com/aqua/article/73/5/917/102076
- Sarajevo: carrying water in plastic containers, wells under fire; stoves
  improvised from discarded materials and broken machines; cigarettes, coffee and
  alcohol as the trade currency --
  worksthatwork.com/4/improvised-design-in-the-siege-of-sarajevo ;
  toddbensman.com/the-siege-of-sarajevo/ ;
  primalsurvivor.net/shtf-survival-tips-and-stories-from-bosnian-war-survivors/

GAMES AISLE (mechanics only; no game he has not named enters the design)
- First reward inside 30-60 seconds; one action, one reward, one upgrade; the
  onboarding loop as a curated, low-punishment cycle --
  gameanalytics.com/blog/how-to-perfect-your-games-core-loop ;
  gamedesignskills.com/game-design/core-loops-in-gameplay/
- Build the harvesting loop first in a survival economy; keep currencies few --
  gamedesignskills.com/game-design/survival/ ;
  gamedevessentials.com/a-7-step-framework-for-game-economy-design/
- Our own: laws/BOHEMIA_ADDENDUM_BATTLE_BROTHERS_AND_THE_GAMBIT_8_28_26.md
  (day-one retention ~22-26%, the first session decides, THE FIRST HOUR DOES NOT
  TEACH BY KILLING YOU)

OUR OWN REPO (every figure measured this round)
- engine/bohemia_purse.js (three balances, no inventory; PAYOUT; VERBS; history),
  engine/bohemia_payday.js (nearestHub, shelf, buy), engine/bohemia_overmap.js
- slices/BOHEMIA_CITY_WORLD.html: BohemiaPurse.create() with no starting credit,
  mktBuy(), MKT_BOUGHT, citySnapshot()
- gates/the_first_morning_points_at_the_game_gate.js (run this round, 19/0)
- gates/cold_hand_gate.js (RUN, 9/5; the right instrument for the hour after)
- records/BOHEMIA_ECONOMY_DAY_9, DAY_12, DAY_13, DAY_14 (the debt-is-a-person
  finding, housing, the mint, the rent)
