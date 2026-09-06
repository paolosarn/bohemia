# ECONOMY -- ROUND 17: THE WAGE LINE SURVIVES AND STOPS BEING THE PAY
# (ECONOMY lane, 9/6/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q17 [wages fall], verbatim from VAMILY.md:
#   "What a day of work is worth when money dies: real wage data from currency
#    collapses (Weimar, Zimbabwe, Venezuela, Lebanon), how fast pay stops
#    tracking prices, what people switch to being paid IN, and what that means
#    for our one-battery day. Deliver the ladder our PAYOUT table should hold."
# Named DAY 17 for the machine. A round is one VAMILY and is never called a day
# to Paolo (NO CALENDAR TALK, 9/5, LOCKED).

## 0. THE HEADLINE

The row asks for a ladder for the PAYOUT table. **He already ruled that the ladder
does not go there, on 8/11, and the real record agrees with him.**

> **PAOLO, 8/11, ASKED WHAT A DAY'S WORK SHOULD PAY: "Whatever currency the quest
> decida to give." The reward belongs to the JOB, not to a global table. The verb
> to say it shipped on 8/12. MEASURED THIS ROUND: ZERO OF TWENTY-SEVEN QUESTS USE
> IT.**

So every finished job in Bohemia falls through to the one-row global table and
pays exactly one battery. A quiet fix and a public spectacle pay the same. And the
real record says the same thing his ruling does, from the other end:

> **WHEN MONEY DIES THE WAGE LINE DOES NOT GET RICHER. IT GETS EMPTIER, AND THE
> PAY MOVES OUT OF IT.** A Venezuelan teacher's official wage is worth **under two
> dollars** and she takes home **$160**. Over 98% of what she is paid is not the
> wage.

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

### 1a. THE TABLE, AND THE VERB THAT NOBODY USES
```
PURSE.PAYOUT           1 row:  COMPLETE -> { electricity: 1, tuned:false }
the .bq pay verb       shipped 8/12:  @DO pay resources 3
quests in the bank     27
quests that declare a reward                            0
total pay directives across every .bq file in the repo  0
```
The ruling was made 8/11. The bridge was built the same day. The language to say
it shipped 8/12. **Nothing has ever said it.**

### 1b. SO A QUIET FIX AND A PUBLIC SPECTACLE PAY THE SAME
Run on the real modules:
```
a quiet job      {applied:true,  paid:{electricity:1}}
a reckless job   {applied:true,  paid:{electricity:1}}
a failed job     {applied:false, reason:"NO_RULING", key:"FAIL"}
```
The bank's own tags are rich and were authored with care: **quiet 81, dread 66,
wary 66, notable 48, reckless 42, flat 41, tired 40, risky 32, cold 10, hope 6.**
Not one of them can change what a job pays.

### 1c. AND THE DOOR THEY WOULD COME THROUGH IS DEAD CODE
`payQuest` picks its key like this:
```js
var key = ev.outcome || (ev.tags && ev.tags[0]) || null;
```
`questEvent()` returns null unless the quest is done, and a done quest **always**
has `outcome` set to `'COMPLETE'` or `'FAIL'`. So the left side is always truthy
and **`ev.tags[0]` can never be reached.** The PAYOUT table can only ever be keyed
on two words. The eighty-one quiet jobs cannot arrive.

That is not a bug in anybody's plan; it is the correct fallback for a design where
the reward lives in the quest. It only matters because the quest half is empty, so
the fallback is doing all the work it was built not to do.

### 1d. AND A FAILED JOB IS HONEST ABOUT NOT KNOWING
`FAIL` returns `NO_RULING` rather than zero, and the distinction is right: *"paid
nothing because it is worth nothing"* and *"paid nothing because nobody has ruled
what it is worth"* are different sentences. Nobody has ruled it.

## 2. THE REAL AISLE: THE LADDER OF HOW PAY DIES

Five rungs, in the order they actually happen.

### RUNG 1 -- THE WAGE STOPS TRACKING, AND RAISES DO NOT FIX IT
**Lebanon.** The minimum wage was LL675,000, about **$450** at the pre-crisis rate
of LL1,507.5. The lira then lost **more than 98%** of its value, reaching about
LL97,000 to the dollar on the parallel market by 2023.

At that rate the old wage is worth about **seven dollars a month.**

The government then raised the minimum wage from LL675,000 to **LL9,000,000** --
a thirteenfold nominal raise. In dollars that is about **$93.**

> **$450, then $7, then a 13x raise to $93. The raise was real, it was enormous,
> and it recovered a fifth of what was lost.** 95% of public sector workers are
> paid exclusively in lira.

### RUNG 2 -- THE INTERVAL SHORTENS BEFORE THE AMOUNT CHANGES
**Weimar, 1923.** Workers were paid **twice a day**, once at midday and once at
the end of the shift, and spent each instalment within hours. Wives met their
husbands at the factory gate at noon, took the morning's wages away in suitcases
and wheelbarrows, and ran to the shops before the afternoon's prices. By autumn
prices doubled roughly **every 3.7 days** and restaurants stopped printing menus.

> **THE FIRST THING THAT CHANGES ABOUT PAY IS NOT HOW MUCH. IT IS HOW OFTEN.** The
> gap between earning and spending is where the money dies, so the gap is what gets
> cut. Nobody's hourly rate was renegotiated at noon; the clock was.

### RUNG 3 -- THE PAY MOVES OUT OF THE WAGE AND THE WAGE LINE SURVIVES
**Venezuela.** A teacher earns **$15 a month** while a basket of food essentials
for a family of four costs about **$500** -- **thirty-three times** the salary.

And the sharper version, from a teacher who is doing better than that: she takes
home **$160 a month, of which her official wage is worth less than $2.** The rest
is a monthly "economic war bonus" and a food subsidy.

> **THE WAGE DID NOT DISAPPEAR. IT BECAME A ROUNDING ERROR INSIDE THE PAY.** The
> line on the payslip is still there, still called the wage, and 98% of the money
> is somewhere else.

### RUNG 4 -- YOU GET PAID IN THE THING
Venezuelan drivers buy petrol with **food, snacks and cigarettes** because the
bolivar is not accepted. Zimbabwean take-home pay is commonly cash plus **food and
housing** in kind, whatever the labour law says.

### RUNG 5 -- AND THE THING IS PRICED BY WHOEVER PAYS YOU
Venezuela's CLAP food boxes: the goods inside are worth about **$12** and the
facilitators charged the government **$35**, with the US Treasury estimating **at
least 70% of the programme gutted by corruption.**

> **THIS IS ROUND 16'S COMPANY STORE SEEN FROM THE PAY SIDE.** When you are paid
> in a thing, whoever hands you the thing decides what it was worth, and there is
> no rate to argue with.

## 3. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named enters the design; these are mechanics as mechanics.)

- **A FIXED REWARD AT A PREDICTABLE INTERVAL GOES FLAT.** The design literature is
  consistent: rewards that are the same every time become expected and then
  invisible. That is our exact state -- every job, one battery.
- **THE USUAL FIX IS A VARIABLE AMOUNT, AND WE CANNOT HAVE IT.** Unpredictable
  payout sizes are the standard answer and they are a slot machine, which is the
  wrong genre for a crash simulator and forbidden anyway: EVERYTHING COSTS ONE.
- **SO THE VARIATION HAS TO BE IN THE KIND, NOT THE NUMBER.** A water run pays
  water. A courier job pays clout. A salvage job pays salvage. Every job pays ONE
  of something and no two jobs pay the same something.

That is not a compromise. **It is his 8/11 ruling word for word, and it is what
the real record does too:** the pay stops being one number and becomes a list of
different things, none of which is the wage.

## 4. *** THE FINDING THAT PROVES US WRONG ***

The row asks me to deliver the ladder the PAYOUT table should hold. I spent the
first half of this round building one. It is the wrong deliverable.

> **PAYOUT SHOULD STAY AT ONE ROW. A RICHER FALLBACK TABLE IS EXACTLY HOW THE
> QUESTS NEVER GET THEIR OWN REWARDS.**

Three independent lines arrive at it:

1. **HIS RULING, 8/11.** Offered a global table keyed on outcome tier, he refused
   it and put the reward back in the job. The payday module records that he was
   right and that it was a better answer than the one offered.
2. **THE REAL RECORD.** In every collapse the wage line does not grow more rows.
   It stays one line, keeps its name, and stops being where the money is. A
   Venezuelan teacher's payslip still says her wage; it is worth under $2 of $160.
3. **THE MEASUREMENT.** The one row we have is already doing all the work. Add a
   FAIL row, a #quiet row and a #reckless row and every quest in the game is
   correctly paid forever without a single author ever writing `@DO pay`. **A
   generous default is how a good design dies quietly.**

And there is a fourth, which is the uncomfortable one. **The reason nothing uses
the verb is not that authors forgot.** It shipped 8/12; the 27 quests predate it
and nobody went back. The verb is one line in a stage. Twenty-seven quests times
one line each is the whole job, and it has sat for most of a month because it is
nobody's row.

## 5. THE LADDER, DELIVERED (and it is not a table)

What our one-battery day should become, in order, each rung mapped to the real one
it comes from. Mechanism only; every amount and every name stays his.

**RUNG 1 -- EVERY JOB SAYS WHAT IT PAYS, AND NO TWO PAY THE SAME THING.**
His 8/11 ruling, the verb that already exists, and the games aisle all say it.
Twenty-seven quests, one line each. Still one of something: EVERYTHING COSTS ONE
is untouched, because the variety is in the KIND.

**RUNG 2 -- PAY LANDS MORE OFTEN THAN ONCE, AND THAT IS WHAT "WAGES FALL" LOOKS
LIKE.** Weimar changed the clock before it changed the number. Our day loop
already has a clock, a nightfall and a reckoning card; paying at more than one
moment costs no arithmetic and no new currency, and it is 120 BPM friendly by
construction. **A day that pays twice and buys less is the feeling, and neither
half of it is a bigger number.**

**RUNG 3 -- SOME OF THE PAY IS NOT THE WAGE.** The food subsidy, the bonus, the
thing you take home. In our terms: a job that hands you a good rather than a
battery. This is blocked on round 15's finding (there is no bag), which is the
same hole seen from the pay side rather than the shop side.

**RUNG 4 -- AND WHOEVER PAYS YOU IN A THING DECIDES WHAT IT WAS WORTH.** Round
16's company store, and the reason rung 3 needs a second person who will deal with
you before it is safe to build.

**WHAT PAYOUT ITSELF SHOULD HOLD: one row, exactly as now.** It is the honest
refusal a quest falls through to when nobody has said what the job is worth, and
its value is that it is thin enough to be embarrassing.

## 6. REFUSED

- **A RICHER PAYOUT TABLE.** Section 4. The whole finding.
- **VARYING THE AMOUNT.** EVERYTHING COSTS ONE (8/15) is LOCKED. Every rung above
  keeps every payment at one.
- **A WAGE THAT DECAYS ON A CURVE.** Modelling Lebanon's 98% honestly means an
  arithmetic of exchange rates, which is the spreadsheet he banned, and round 11
  already settled that the price cannot move and that is right.
- **RULING WHAT A FAILED JOB PAYS.** `NO_RULING` on FAIL is correct and canon is
  his. Noted, not decided.
- **INVENTING WHAT ANY QUEST PAYS.** Amounts are contents. This lane delivers the
  shape; the 27 lines belong to whoever owns the quests.
- **ANY IMPLEMENTATION.** MODE: RESEARCH.

## 7. ROUTED

**TO QUESTS (PARKED) or whoever the coordinator gives it to -- and this is the one
that unblocks the most for the least work:**
1. **ZERO OF 27 QUESTS DECLARE A REWARD.** The ruling is 8/11, the verb is 8/12,
   and the sentence has never been written. One line per quest. Until then every
   job in the game pays one battery and the reward system he designed does not
   exist.

**TO WORLD, on the purse:**
2. **`ev.tags[0]` IN `payQuest` IS UNREACHABLE.** `outcome` is always set on a done
   quest, so the tag fallback can never fire. It is harmless today and it is a
   branch that has never executed, which this repo has already been bitten by twice
   in this same pipe. Either delete it or make the key composable.
3. **PAYOUT SHOULD NOT GROW.** If a future round is tempted to fill it, section 4
   is the argument against, and it is his own ruling.

**TO RUN and LIFE + CITY:**
4. **PAY MORE THAN ONCE A DAY.** The real first symptom of wages falling is the
   interval, not the amount. The clock, the nightfall and the reckoning card all
   exist. No new currency, no new number, no arithmetic.

**TO WORLD [rice clock], joining round 15:**
5. **A JOB THAT PAYS YOU IN A THING NEEDS SOMEWHERE TO PUT THE THING.** Rung 3 is
   blocked on the same missing bag round 15 found from the shop side. One fix
   unblocks both.

**TO THE COORDINATOR, for Paolo:**
6. **[PENDING Paolo]** What does a FAILED job pay? Today it is an honest
   `NO_RULING`. The real record says people who failed still ate that day, and
   round 16 says a punishment you cannot recover from is an ending nobody chose.

## 8. TEST MATERIAL
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, sections GGGG through KKKK. Every
line `draft:true`, in the bank, never in the game.

## 9. SOURCES

REAL AISLE
- Lebanon: minimum wage LL675,000 (~$450 at LL1,507.5), the lira losing more than
  98% to about LL97,000/$ by 2023, the raise to LL9,000,000, and 95% of public
  sector workers paid exclusively in lira --
  today.lorientlejour.com/article/1335054/cabinet-raises-minimum-wage-in-the-private-sector-to-ll9-million.html ;
  thenationalnews.com/mena/lebanon/2023/04/19/lebanons-caretaker-government-increases-public-sector-salaries/ ;
  wageindicator.org/salary/minimum-wage/minimum-wages-news/2023/minimum-wage-updated-in-lebanon-from-01-may-2023-may-01-2023
- Weimar 1923: pay twice daily at midday and end of shift, wives at the factory
  gate with suitcases, prices doubling about every 3.7 days, menus abandoned --
  alphahistory.com/weimarrepublic/1923-hyperinflation/ ;
  en.wikipedia.org/wiki/Hyperinflation_in_the_Weimar_Republic ;
  smithsonianmag.com/history/how-hyperinflation-heralded-the-fall-of-german-democracy-180982204/
- Venezuela: teachers on $15 a month against a ~$500 family food basket (33x); a
  teacher taking home $160 of which the official wage is worth under $2, the rest
  a "war bonus" and a food subsidy; drivers buying petrol with food, snacks and
  cigarettes; CLAP boxes holding ~$12 of goods billed at $35 with at least 70%
  gutted by corruption --
  france24.com/en/live-news/20250222-on-15-a-month-venezuela-s-teachers-live-hand-to-mouth ;
  thenewhumanitarian.org/feature/2025/07/22/anatomy-fall-venezuela-collapsing-education-system ;
  foxnews.com/world/venezuelans-bartering-food-cigarettes-to-pay-for-gas-amid-inflation ;
  csis.org/analysis/maduro-diet-food-v-freedom-venezuela ;
  ve.usembassy.gov/treasury-disrupts-corruption-network-stealing-from-venezuelas-food-distribution-program-clap/
- Zimbabwe: take-home commonly cash plus food and housing in kind --
  lca.logcluster.org/33-zimbabwe-manual-labour ;
  wageindicator.org/en-zw/work-in-zimbabwe/labour-law/work-and-wages/

GAMES AISLE (mechanics only; no game he has not named enters the design)
- Fixed rewards at predictable intervals going flat, and why the standard fix is a
  variable amount -- gamedeveloper.com/business/reward-schedules-and-when-to-use-them ;
  futurelearn.com/info/courses/game-psychology/0/steps/428456 ;
  learning-theories.com/game-reward-systems.html

OUR OWN REPO (every figure measured this round)
- engine/bohemia_purse.js (PAYOUT, payQuest and its unreachable tag branch),
  engine/bohemia_payday.js (questReward, payForQuest, and the 8/11 ruling recorded
  verbatim in its own header), engine/bohemia_quest_runtime.js (the `pay` verb,
  8/12, and why it exists)
- quests/bq/*.bq, all 27, and the inlined DEMO_BQ on the walked surface: zero
  `@DO pay` directives, and the tag census (quiet 81, dread 66, wary 66, notable
  48, reckless 42, flat 41, tired 40, risky 32, cold 10, hope 6)
- records/BOHEMIA_ECONOMY_DAY_15 (the missing bag, which blocks rung 3) and
  DAY_16 (the company store, which is rung 5 from the other side)

## 10. GATE STATE THIS ROUND

Green, run this round: economy 13/0, payday 38/0, purse 28/0, attempt 15/0,
canon rot 13/0, demo blockers 22/0, language 81/0, **quest study 456/0 across all
27 quests.**

Worth naming, in the same spirit as round 16's note on `lights_bill_gate`: the
quest suite is 456 for 456 over the exact 27 files that declare **zero** rewards.
Every assertion in it is true. It checks that each quest cites its study corpus
correctly, which is what it was written for. **Nothing asks whether a quest says
what it pays**, because until 8/12 no quest could, and nobody has been back since.

Not this lane's to fix, and not a criticism of the gate. Noted because "456 green
on 27 quests" and "0 of 27 quests pay anything" are both true right now.
