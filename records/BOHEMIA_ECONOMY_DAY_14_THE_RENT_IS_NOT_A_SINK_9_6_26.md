# ECONOMY -- ROUND 14: THE RENT IS NOT A SINK, AND OUR LADDER HAS NO FRACTIONS
# (ECONOMY lane, 9/6/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q14 [rent share], verbatim from VAMILY.md:
#   "What share of a family's income goes to the local power boss in a real
#    collapse (Lebanon 44% average, 88% for the poorest, 2023; Iraq by the
#    ampere), how families actually cope (sharing lines, going dark, going
#    solar), and what number in OUR ladder (everything costs one, a day of work
#    pays one battery) makes the block's cut hurt but stay fun. Big swing: is the
#    block's cut the main money sink of the whole game?"
# Named DAY 14 for the machine. A round is one VAMILY and is never called a day
# to Paolo (NO CALENDAR TALK, 9/5, LOCKED).
#
# THE COORDINATOR ALREADY DID THE GENERATOR-MAFIA ROUND (9/5,
# records/BOHEMIA_COORDINATOR_RESEARCH_THE_GENERATOR_MAFIA_9_5_26.md) and routed
# this question out of it. This record does NOT repeat it. It answers the two
# things that round left open: the SHARE, and the NUMBER.

## 0. THE HEADLINE

Two findings, and the second one changes what the job is.

> **1. OUR LADDER CANNOT EXPRESS 44%.** A day of work pays one battery and the
> smallest thing in the game costs one battery. So a bill is 0% of a day's work
> or it is 100% of a day's work. There is no rung between them. Lebanon's 44% and
> Iraq's 14% do not exist on a nightly ladder, and they never will, because the
> fraction is not a price. **The fraction lives in the calendar and in the
> geometry, and both of those are already built.**
>
> **2. THE BLOCK'S CUT CANNOT BE THE MAIN MONEY SINK, BECAUSE A RENT IS NOT A
> SINK.** Our own purse already draws the line the game-economy literature draws:
> a DRAIN destroys money, a TRANSFER only moves it, and only the first one fights
> a glut. Rent paid to a faction is a transfer. It changes who is rich. It does
> not change how much money exists. Proven on the ledger in section 4.

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

### 1a. A WAGE IS 27 BATTERIES, EVER

`PURSE.PAYOUT` has exactly one row: a completed job pays **one battery**. The
demo quest bank holds **27 quests**. There is no other wage in the game.

> **THE ENTIRE LIFETIME WAGE INCOME OF THE SHIPPED GAME IS 27 BATTERIES.**

Round 13 measured that a built-out valley mints **585 a night**. So a wage is
about **one twentieth of one percent** of the money a player will handle. Any
question of the form "what share of INCOME should the boss take" has to say which
income, and the honest answer is: not the wage. The wage is a rounding error.

### 1b. THE SMALLEST POSSIBLE BILL IS 100% OF A DAY'S WORK

```
a completed job pays ................. 1 battery   (PAYOUT, his 8/15 + 9/4)
the smallest price in the game ....... 1 battery   (EVERYTHING COSTS ONE, 8/15)

so a nightly bill can only be:
   0 batteries -> 0%   of a day of work
   1 battery   -> 100% of a day of work
   2 batteries -> 200% of a day of work
```

There is nothing in between and there cannot be. **A nightly bill has no 44%
rung.** This is not a bug in his law; it is what a one-unit ladder means.

### 1c. WHAT THE NIGHT ALREADY TAKES, BY HOW MUCH GROUND YOU HOLD

The shipped [lights bill] charges one per lit circuit you hold, every night.
Measured on the real grid, seed 1234:

```
buildings you hold on lit streets | circuits billed | per night | share of a day's work
                                1 |               1 |         1 |   100%
                                2 |               2 |         2 |   200%
                                5 |               5 |         5 |   500%
                               10 |              10 |        10 |  1000%
                               67 (every lit plot) |  44 |    44 |  4400%
```

**One building on a lit street already costs a full day's wage every night.** A
player cannot be a Lebanese family in this game. He is at 0% or he is ruined.

### 1d. THE FOUR REAL COPING MOVES, AGAINST WHAT IS ALREADY BUILT

Real families do four things when the bill gets impossible. Checked one at a time:

1. **SHARE A LINE -- ALREADY BUILT.** WORLD's feeder dedup (9/5): plots on one
   feeder are one bill. Measured on the real grid: 44 lit circuits carry build-
   legal plots, the busiest carries **5 plots for one bill**, average 1.59. So
   five shops on that street cost what one shop costs. That IS neighbours
   splitting a subscription, and nobody built it as that.
2. **GO DARK -- ALREADY BUILT.** `douse()` (9/5): a circuit you cannot pay for
   goes out, keeps its owner's name, rides the save, and **stops billing you**.
   Verified live: doused circuit 61, plots on it report `live:false`,
   `doused:true`, owner kept. Real families call that going without.
3. **GO SOLAR -- ROUTED, NOT BUILT.** WORLD [own power], still OPEN.
4. **DOWNGRADE -- NOT IN THE GAME AT ALL, AND IT IS THE ONE THEY DO FIRST.**
   In Lebanon the minimum subscription fell **from five amps to three to two**
   because families could not afford more. Ours has no smaller subscription. The
   only downgrade we offer is DEMOLISH, which is all or nothing.

## 2. THE REAL AISLE: THE LADDER OF SHARES

The share only means something against the normal-world baseline, so here is the
whole ladder in one place.

```
what it is                                              share of household income
a normal rich-world household                                        ~3%
US DOE calls this "high energy burden"                                6%
US low-income households, average                                     8.6%
ACEEE "severe energy burden" / UK fuel poverty definition             10%
IRAQ, typical Baghdad family (40-60k dinars against a 350k wage)      11-17%
LEBANON 2023, AVERAGE household                                       44%
LEBANON 2023, POOREST households                                      88%
and past that: you do not pay. You have no subscription at all.
```

**A collapse is not the bill going up. It is the bill going from 3% of your
income to 44% of it, which is fifteen times.** And the top of that ladder is not
a steady state anybody lives in. The Human Rights Watch survey that produced the
44% and 88% figures (1,200+ households, published March 2023) says the rest in
one clause: *"while others went without a subscription at all."*

**IRAQ IS THE STRUCTURE, NOT JUST A SECOND NUMBER.** You pay by the AMPERE, per
month, and a breaker at the generator caps you at what you bought. In 2023 an
ampere was 8,000 dinars, about $5.35; a typical bill was 40,000 to 60,000 dinars
against a 350,000 dinar minimum wage. **The unit of the bill is a unit of
ALLOWANCE, and the customer picks how many.** That is why downgrading exists as a
move at all, and it is exactly the dial our game does not have.

**AND WHEN PEOPLE GET OUT, THE BOSS FALLS OFF A CLIFF.** Lebanon's installed solar
went 89.84 MW at the end of 2020, +100 MW in 2021, +500 MW in 2022, to roughly
870 MW. One generator operator in Baalbek ran **six 600 kVA sets for about 2,000
households; he is now down to one smaller set and his fuel buying has fallen 96%.**
Not a decline. A collapse, in about two years, because his customers bought their
own panels.

## 3. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named enters the design; these are mechanics as mechanics.)

- **Upkeep is the main thing that reduces income in a territory game**, and it is
  the standard brake on runaway expansion. The design tension everybody names is
  the same one: holding the land must not cost more than the land pays, or nobody
  takes land; and it must not cost nothing, or everybody takes all of it. Round 13
  measured us at the second failure exactly.
- **A cost paid TO somebody is not the same as a cost paid to nothing.** In games
  where NPC powers own property and collect from it, they spend what they collect
  on more property and more people. The money you hand over comes back at you.
  That is the difference between a tax and a rival.
- **The interesting version of a recurring payment is one you can refuse**, with a
  visible consequence, rather than an automatic deduction you watch happen.

## 4. *** THE FINDING THAT PROVES US WRONG ***

The big swing asks whether the block's cut should be the main money sink of the
whole game. I went in expecting yes. **The answer is no, and it is provable in our
own code in four lines.**

Our purse already carries the distinction the whole faucet-and-drain literature
rests on, written in its own header:

> *"SOFT sinks (value moves to another holder -- a transfer, which does NOT fight
> inflation) from HARD sinks (value is destroyed, which does)."*

And it enforces it: `debit()` posts `kind:'drain'`, `transferOut()` posts
`kind:'transfer'`, and `flow()` reports them in separate columns. Run on the real
module, the same thirteen batteries paid two ways:

```
as the LIGHTS BILL (a drain):      balance 17   drain 13   transferOut  0
as RENT TO A FACTION (a transfer): balance 17   drain  0   transferOut 13
```

Same balance in the player's pocket. **Different kind, and the ledger knows.**

> **A RENT DOES NOT DESTROY MONEY. IT MOVES IT. The block's cut can be the biggest
> BILL in the game and still not be a sink at all, because the batteries are not
> gone, they are the Mob's now.**

And there is a second half that makes it sharper. **`BohemiaPurse.create()` is
called exactly once in the whole game** (the player, one line on the walked
surface). There is no faction purse. So a rent posted as a transfer today moves
money to a holder that does not exist: labelled not-destroyed, and nowhere.
Either the faction gets a real purse, or the rent is honestly a drain and should
say so.

**WHICH IS RIGHT, AND THE REAL RECORD ANSWERS IT.** Lebanon's generator money did
not vanish. It built the thing the press calls the generator mafia: owners tied
into parties, ministries, tribes and militias, who divided the territory between
them and could cut you off at will. The rent IS the faction's income, and it is
what makes a faction able to hold ground. **So the rent should be a transfer with
a real receiver, and that is FACTIONS [power territory] -- what a faction is worth
is what its land pays it. What the rent is NOT is the answer to round 13's glut.**

Round 13 said the demand side is the bigger half. Round 14 says the same thing
from the other end: **you cannot fix a money glut by handing the money to
somebody else.**

## 5. THE ANSWER TO THE NUMBER QUESTION

The question asks for a number in our ladder. The honest answer is that the
number is not a price, and there are exactly two places a fraction can live in a
game where everything costs one.

### 5a. THE CALENDAR
Change how often the bill lands and the whole real ladder becomes whole ones:

```
what it is                       share   per MONTH of work (30)   per WEEK of work (7)
normal household                    3%                        1                      0
"high energy burden"                6%                        2                      0
"severe" / UK fuel poverty         10%                        3                      1
Iraq, typical family               14%                        4                      1
LEBANON 2023 average               44%                       13                      3
LEBANON 2023 poorest               88%                       26                      6
```

Every entry in the month column is a whole number of ONES. **A monthly cut keeps
his 8/15 law perfectly and gives us the entire real ladder.** A weekly cut works
at the top and collapses the bottom four rungs to zero, so a week is too coarse
for a normal household and fine for a crisis. **A nightly cut has no ladder at
all**, which is what the shipped lights bill is.

### 5b. THE GEOMETRY, AND THIS ONE NEEDS NO TUNING WHATSOEVER
Round 13's fix was a fixed sun pool: the valley mints the same total however many
racks are under it. Under that fix, **mining income is FLAT and the cut GROWS with
ground held**, so the share falls out of how much of the valley you own. At a pool
of thirty a day and a cut of one battery per block per night:

```
blocks you hold      what the cut takes of what your ground makes
        1                     3%     <- a normal household
        5                    17%     <- a typical Baghdad family
       13                    43%     <- LEBANON 2023, THE AVERAGE HOUSEHOLD
       30                   100%     <- you now work entirely for the boss
```

**Nobody typed those percentages. They are what the geometry does.** One block is
a normal household, five is Baghdad, thirteen is Beirut, thirty is ruin. And it
sets its own ceiling: past thirty blocks holding more ground makes you poorer,
which is a cap the player discovers by feeling it rather than a number on a
screen.

### 5c. AND 44% IS NOT THE TARGET
This is the part that would be easy to get wrong. **44% is where the real system
broke.** At 44% families were downgrading to two amps, sharing lines, going dark,
and buying panels; the poorest at 88% had already fallen out and had no
subscription at all. Designing the steady state at 44% designs the moment of
failure, not the game. **The player should CLIMB toward 44% by taking more ground,
and the four exits should be there when he gets close.** Three of the four already
exist or are routed. The missing one is the downgrade.

## 6. REFUSED

- **A PERCENTAGE ANYWHERE IN THE GAME.** No 44% on a screen, no slider, no bill
  breakdown. The anti-spreadsheet ruling kills it and it is not needed: the share
  is an outcome of blocks held, not an input.
- **AN AMPERE ALLOWANCE.** It is the most realistic dial in the whole record and
  his 9/5 law forbids it in terms: *"There is no power meter, no fuel gauge, no
  'out of charge' state anywhere in the game."* A subscription that limits what
  you can DO with power is a power meter. Recorded, not proposed. The downgrade
  has to buy something that is not electricity.
- **A SECOND PRICE FOR THE SAME THING.** Two tiers of bill is two prices, and
  8/15 is one.
- **MAKING RENT A HARD SINK TO FIX THE GLUT.** It would work arithmetically and it
  is a lie about what rent is. Round 13's glut is fixed on the faucet and on the
  demand side, not by mislabelling a transfer.
- **INVENTING WHAT A FACTION CHARGES.** Fortress more than camp is already on
  FACTIONS [block rent]; the numbers are balance and balance is his.

## 7. ROUTED

**TO FACTIONS [block rent] THE-BLOCK-PAYS-ITS-OWNER:**
1. **THE CUT IS MONTHLY, NOT NIGHTLY.** A nightly cut has no fraction below 100%
   of a day's work. A monthly one carries the whole real ladder in whole ones.
2. **IT IS A TRANSFER, NOT A DRAIN**, and it needs a receiver. `transferOut` with
   no faction purse is money labelled not-destroyed and sent nowhere.
3. **THE SHARE COMES OUT OF BLOCKS HELD, NOT OUT OF A PERCENTAGE.** With round
   13's fixed pool, 1 block is 3%, 5 is 17%, 13 is 43%, 30 is everything.
4. **THE DOWNGRADE IS THE MISSING MOVE.** Real families' first response is to buy
   a smaller subscription, not to demolish their house. Ours has no smaller
   subscription. Whatever the tier buys, it cannot be electricity (his 9/5 law).

**TO FACTIONS [power territory] A-FACTION-MINES-ITS-LAND:**
5. **THE RENT IS THE FACTION'S INCOME.** That is what the real generator owners
   became. If the cut has a receiver, this row and [block rent] are one system.

**TO WORLD [own power] YOUR-OWN-POWER-IS-YOUR-WAY-OUT:**
6. **THE REAL NUMBER FOR WHAT HAPPENS TO THE BOSS IS 96%.** One Baalbek operator
   went from six 600 kVA sets for 2,000 households to one small set, fuel buying
   down 96%, in about two years, because his customers went solar. Going solar
   should not shave the faction's income. It should collapse it, and the faction
   should see it coming.

**TO WORLD [rice clock] and the PAYOUT table:**
7. **27 BATTERIES IS THE WHOLE WAGE INCOME OF THE GAME.** Nothing about a rent
   share can be balanced against a wage that small. Q17 [wages fall] is the row
   for it and this is a note for whoever takes it.

**TO THE COORDINATOR, for Paolo:**
8. **[PENDING Paolo]** What does a subscription to a block BUY, if it cannot buy
   electricity? (His 9/5 law rules out a power allowance. Protection, market
   access, being left alone and the right to build are all candidates and all of
   them are canon.)

## 8. TEST MATERIAL
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, sections RRR through VVV. Every
line `draft:true`, in the bank, never in the game.

## 9. SOURCES

REAL AISLE
- Human Rights Watch / Consultation and Research Institute, "Cut Off From Life
  Itself: Lebanon's Failure on the Right to Electricity" (March 2023, 1,200+
  household survey): generator bills 44% of average monthly household income,
  88% for the poorest, others with no subscription at all --
  hrw.org/report/2023/03/09/cut-life-itself/lebanons-failure-right-electricity ;
  hrw.org/news/2023/03/09/lebanon-electricity-crisis-exacerbates-poverty-inequality ;
  today.lorientlejour.com/article/1330918
- Subscription minimums falling 5 amps to 3 to 2; Baalbek operator six 600 kVA
  sets to one, fuel buying down 96%; solar 89.84 MW (end 2020), +100 MW (2021),
  +500 MW (2022), ~870 MW --
  newarab.com/opinion/lebanons-electricity-crisis-generator-cartels-vs-solar-energy ;
  tcf.org/content/report/solar-killed-dirty-energy-in-rural-lebanon-heres-what-other-countries-can-learn/ ;
  nowlebanon.com/lebanons-solar-energy-transformation/
- Iraq, price per ampere 8,000 dinars (~$5.35, 2023), typical bill 40-60k dinars,
  minimum wage 350k dinars; neighbourhood generators and the breaker cap --
  intechopen.com/chapters/74439 ; shafaq.com/en/Economy ;
  femalejournalistsforclimate.com/en/49000-generators-in-iraq-for-electricity-production-pollution-and-noise/
- Energy burden baselines: US non-low-income average ~3%, low-income 8.6%, DOE
  "high" 6%, ACEEE "severe" 10%; UK/NI/Scotland/Wales fuel poverty 10% --
  aceee.org/energy-burden/ ; rmi.org/1-in-7-families-live-in-energy-poverty-states-can-ease-that-burden/ ;
  nea.org.uk/what-is-fuel-poverty/ ; commonslibrary.parliament.uk/research-briefings/cbp-8730/

GAMES AISLE (mechanics only; no game he has not named enters the design)
- gamedeveloper.com/design/the-balance-of-power-progression-and-equilibrium-in-real-time-strategy-games
- waywardstrategy.com/2022/01/23/food-gold-and-beyond/
- Upkeep as the main reducer of territory income, and NPC owners spending what
  they collect: totalwarwarhammer.fandom.com/wiki/Money ;
  crypticis.itch.io/solar-reign/devlog/286667/ownership-ui-friendlies-and-npc-money

OUR OWN REPO (every figure re-measured this round)
- engine/bohemia_purse.js (PAYOUT, PRICES, VERBS, _post/KINDS, debit vs
  transferOut, flow, audit), engine/bohemia_powergrid.js (circuits, douse),
  engine/bohemia_production.js, engine/bohemia_cityedit.js,
  engine/bohemia_overmap.js
- slices/BOHEMIA_CITY_WORLD.html: heldCircuits(), nightPower(), the single
  BohemiaPurse.create(), DEMO_BQ (27 quests)
- records/BOHEMIA_COORDINATOR_RESEARCH_THE_GENERATOR_MAFIA_9_5_26.md (the round
  that routed this question; not repeated here)
- records/BOHEMIA_ECONOMY_DAY_13_THE_VALLEY_FILLS_ITSELF_IN_ELEVEN_DAYS_9_6_26.md
  (the 585-a-night mint and the fixed-pool fix this round builds the share on)
