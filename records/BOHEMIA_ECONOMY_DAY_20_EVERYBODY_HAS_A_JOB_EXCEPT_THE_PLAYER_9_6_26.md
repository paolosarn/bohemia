# ECONOMY -- ROUND 20: EVERYBODY IN THE VALLEY HAS A JOB EXCEPT THE PLAYER
# (ECONOMY lane, 9/6/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q20 [work feels], verbatim from VAMILY.md:
#   "What makes work in a game feel like work worth doing rather than a chore:
#    real research on task satisfaction and on what people in collapsed economies
#    say about the jobs they took, plus the best games' loops. Deliver what our
#    four verbs are missing."
# Named DAY 20 for the machine. A round is one VAMILY and is never called a day
# to Paolo (NO CALENDAR TALK, 9/5, LOCKED).

## 0. THE HEADLINE

The row asks what our four verbs are missing. I measured them and they are not
missing a feature.

> **THE FOUR VERBS ARE NOT WORK. ALL FOUR ARE THINGS THAT HAPPEN TO YOU: the day
> ate, the plate is spent, the circuits burned, you leaned on somebody. Three of
> them fire automatically at a beat you do not choose. THEY ARE THE BILL, NOT THE
> JOB.**

And the measurement that decided the round:

> **`bohemia_agents.js` GIVES EVERY PERSON IN THE VALLEY A WORKDAY. A worker works
> 448 minutes. A scav sweeps 371. A keeper runs one errand. A watch is out 413.
> FOUR ARCHETYPES, ALL WITH A DAILY DOING. THE PLAYER HAS NO WORK ACT AT ALL.**

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

### 1a. THE FOUR VERBS, READ BACK
```
day:ate       resources     the people who depend on you ate
fight:plate   resources     the plate you wore at the bell is spent
night:power   electricity   every lit circuit you hold burned one
ask:leaned    clout         you leaned on somebody
```
`day:ate` and `night:power` fire at nightfall. `fight:plate` fires at the bell.
**Only `ask:leaned` has a verb in it that a player performs.** The four-verb law is
correct and good and it is a law about what a day COSTS. Nothing in it is a job.

### 1b. THE WHOLE ECONOMIC ACTION VOCABULARY OF THE PLAYER
```
finish a quest    -> +1 battery      (27 quests exist; that is the whole wage, round 17)
place a building  -> -1 battery      (costs no game time at all, round 13)
buy a good        -> -1 battery      (and you get nothing, round 15)
ask somebody      -> -1 clout
```
**Three of the four are spending. One is earning. None of them is work.**

### 1c. AND THE GAME ALREADY KNOWS HOW TO WRITE A WORKDAY
`bohemia_agents.js` has been running four life archetypes since Paolo's 7/19
correction that *"real people run on DIFFERENT clocks and live DIFFERENT lives"*:
```
worker    sleep 468m   home 323m   WORK 448m   free 201m
scav      sleep 706m   home 363m   SCAV 371m
keeper    sleep 692m   home 647m   ERRAND 101m
watch     sleep 654m   home 373m   WATCH 413m
```
The acts an NPC can have are: **errand, free, home, scav, sleep, watch, work.**

The acts the player can have are: walk, talk, fight, build, buy, sleep.

> **THERE IS NO PLAYER ACT CALLED WORK, SCAV, ERRAND OR WATCH.** Every one of the
> valley's thousands of people has a daily doing. The player has errands somebody
> else set.

### 1d. AND THE DAY LOOP LEFT A HOLE FOR THIS ON PURPOSE
`bohemia_dayloop.js` carries a `STAKES` table, empty, with its reason written in:
> *"THE STAKES TABLE. Empty ON PURPOSE and it is not a stub to fill in: what a day
> costs to live is Paolo's ruling, not mine. Until he rules, a day costs nothing
> but the light."*

The day ledger records `steps`, minutes stood in each district, buildings entered,
quest stages fired, and the quest's own log lines. **It records where you were and
what the quest did. It has no place to record what you DID.**

## 2. THE REAL AISLE

### 2a. UNDOING SOMEBODY'S WORK COSTS 36% OF IT, AND IT KILLS THE LOVE OF IT
Dan Ariely's Bionicle experiment, 40 undergraduates paid a declining rate per model
built. Two conditions, identical pay:
- **MEANINGFUL:** the finished models were stored and only taken apart at the end.
  Average built: **11.**
- **SISYPHUS:** each model was taken apart in front of them the moment they handed
  it in. Average built: **7.**

**Thirty-six percent less work, for the same money, purely because the work was
undone.** And the second result is worse than the first:

> **In the Sisyphus condition, how much somebody LOVED building Lego stopped
> predicting anything.** Serious Lego fans built as few as people who did not enjoy
> it at all. Undoing the work did not just reduce output; it severed enthusiasm
> from output entirely.

**MEASURED AGAINST US, WE SHIP THREE SISYPHUS CONDITIONS.**
```
ROUND 15   you pay a battery for food and the food never arrives
ROUND 16   you miss one payment and that block is dark forever, no way back
ROUND 19   the world stops reporting what you did to it on day 67
```

### 2b. WHAT MAKES WORK FEEL LIKE WORK: THE FIVE, AND WE SCORE 2 OF 5
Hackman and Oldham's job characteristics are the standard answer and they are a
checklist, so I used them as one. The five: **skill variety** (the range of tasks),
**task identity** (completing a whole job start to finish), **task significance**
(the impact on others), **autonomy** (discretion over how), **feedback**
(information about results). They produce three states: experienced
meaningfulness, felt responsibility for outcomes, and **knowledge of the actual
results of the work.**

```
SKILL VARIETY       FAIL   one earning action exists: finish a quest
TASK IDENTITY       PASS   a quest is a whole job with an end. This we have.
TASK SIGNIFICANCE   HALF   the deed ledger and the feed exist (round 18) and are
                           free of place, so the impact is reported, not felt
AUTONOMY            PASS   he goes where he likes, and the permit only gates building
FEEDBACK            FAIL   buying reports nothing (15) and the world goes quiet
                           on day 67 (19)
```
**The two we fail are variety and feedback**, and those are exactly the two the
real record fixes.

### 2c. AND THE REAL RECORD HAS A WORD FOR IT: REBUSQUE
What people in a collapsed economy actually say about the work they took is not
"my job". Venezuela's word is **rebusque**, and the definition is the finding:

> **"Selling in the street, repairing, cooking, reselling or RESOLVING is not a
> break between jobs. IT IS THE WORK ITSELF."**

Rebusque became a way of life the moment formal employment stopped guaranteeing
income. It is not one job with one wage; it is **a day made of many small
solvings**, and it spreads outward into home services, informal trades and
whatever the day offers.

And what it gives besides money, in the words of somebody who did it: **"We
survived together. That's the only way survival works."** The literature on it
keeps landing on the same three: community, standing, and the sense of being
somebody who can navigate an impossible situation. Not the wage.

## 3. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named enters the design; these are mechanics as mechanics.)

- **THE NAMED FAILURE IS THE "EMPTY LOOP":** a cycle that is a chore rather than
  play, which means grinding for a meaningless reward, or repeating an action with
  no variation and no escalation. **Both halves of that describe our one earning
  action: every job pays the same battery (round 17) and there is only the one.**
- **THE SHARPEST SENTENCE IN THE LITERATURE:** engagement is a metric and enjoyment
  is an emotion, and a loop can guarantee the first while never producing the
  second.
- **AND THE COMMONEST FAKE FIX:** choices that are cosmetic variations funnelling
  back into the same cycle. Different weapons, same loop. That is not agency.
- The working loop everybody describes is **action, feedback, reward** with the
  feedback arriving immediately and visibly enough that the player knows the world
  noticed.

## 4. *** THE FINDING THAT PROVES US WRONG ***

I came in expecting to add a fifth verb. The measurement says the four are the
wrong category to add to.

> **THE FOUR VERBS ARE THE BILL. WHAT IS MISSING IS NOT ANOTHER LINE ON THE BILL,
> IT IS THE DAY'S SMALL SOLVINGS -- MANY LITTLE JOBS RATHER THAN ONE BIG ONE -- AND
> THE PROOF THAT EACH ONE LANDED.**

Three things line up on it and they were found independently:

1. **The real record.** Rebusque is not a job, it is a day of resolving, and it is
   the work itself rather than the gap between work.
2. **The measurement.** We fail exactly two of the five satisfaction dimensions,
   variety and feedback, which is precisely the shape of "one repeated action whose
   result you cannot see."
3. **The valley.** We already wrote the four-archetype workday for everybody else.
   The player is the only person in Bohemia with no daily doing, in a game whose
   whole subject is how people get by.

**And the Sisyphus number is the warning attached to it.** Adding work to a game
that undoes three things a player does is worse than adding nothing: it produces
more moments where effort is erased, and the experiment says that does not just
cost output, it costs the love of the activity itself. **Fix the three erasures
first.**

## 5. WHAT THE FOUR VERBS ARE MISSING, DELIVERED

Mechanism only; every name, list and number stays his.

**1. THE FOUR VERBS NEED A FIFTH CATEGORY, NOT A FIFTH VERB.** The frozen four are
what a day COSTS and they should stay frozen and stay four. What does not exist is
the other column: what a day EARNED, itemised. The day ledger records where you
stood and what the quest did; it has nowhere to put what you did.

**2. MANY SMALL SOLVINGS, NOT ONE JOB.** Rebusque's shape and the answer to the
variety failure: a day should hold several small doable things, each finishable in
minutes, each paying one of something different (round 17's ruling: every job says
what it pays and no two pay the same thing). **Not a bigger reward. More kinds of
small one.**

**3. EVERY SOLVING LEAVES A MARK YOU CAN GO BACK AND LOOK AT.** The feedback
failure and the Sisyphus warning are the same repair. The Bionicles were stored,
not destroyed. Bohemia already has the perfect surface for this and it is the
century ledger: a per-act record of what each generation built that act 2 cannot
erase. **What a day of small work needs is to land somewhere that persists.**

**4. THE VALLEY'S PEOPLE ALREADY WORK, SO THE PLAYER'S WORK SHOULD MEET THEIRS.**
A worker is at a site for 448 minutes; a scav sweeps 371; a keeper leaves the house
once. Those are not scenery, they are a schedule, live, and they are where a day's
small solvings come from without inventing a single job. **The work is already
standing in the street.**

**5. AND WHAT IT PAYS BESIDES MONEY IS THE POINT.** "We survived together." The
three things the real record says work gives are community, standing and
capability, and Bohemia has organs for all three already: `commitment`, the
standing systems, and the deed ledger. Rounds 9, 18 and 19 all landed on **the
economy being made of people you keep going back to**; a day's work is how you meet
them.

## 6. REFUSED

- **A FIFTH UPKEEP VERB.** The four are frozen by his 9/5 law and section 4 says
  the answer is not on that list at all.
- **A GRIND.** A repeatable action that pays the same thing forever is the named
  empty loop, and round 17 measured that we already have exactly one of those.
- **A WORK METER, A STAMINA BAR OR A JOB SCREEN.** Anti-spreadsheet, and the
  existing STAM_MAX=3 model is his.
- **INVENTING THE JOBS.** What a person in this valley can be paid to do is
  contents, and contents are his. Section 5 is the shape.
- **FILLING THE STAKES TABLE.** `bohemia_dayloop.js` says in its own words that
  what a day costs to live is his ruling. Reported, not filled.
- **BUILDING ANY OF IT.** MODE: RESEARCH.

## 7. ROUTED

**TO LIFE + CITY and RUN, and this is the one with a number on it:**
1. **WE SHIP THREE SISYPHUS CONDITIONS** (buying gives nothing, a missed payment
   is permanent, the world stops reporting on day 67) and the experiment says
   undoing work costs 36% of it and severs enjoyment from output entirely. **Fix
   these before adding work, not after.**

**TO WORLD:**
2. **THE PLAYER HAS NO WORK ACT.** The valley's four archetypes have work, scav,
   errand and watch, with real minute budgets, running live. The player has walk,
   talk, fight, build, buy and sleep.
3. **THE DAY LEDGER HAS NOWHERE TO RECORD WHAT HE DID.** It has steps, districts,
   buildings entered, quest stages and quest log lines. No column for the day's own
   doings.

**TO PEOPLE:**
4. **THE WORK IS ALREADY STANDING IN THE STREET.** A worker is at a site 448
   minutes a day and a scav sweeps 371. A day's small solvings can come off that
   schedule without inventing a job.

**TO THE COORDINATOR, for Paolo:**
5. **[PENDING Paolo]** What can a person in this valley be paid to do? Round 17
   established that every job should say what it pays and no two should pay the
   same thing; this round says a day should hold several small ones rather than one
   big one. **What those small ones ARE is the most characterful list left in the
   economy, and it is his.**
6. **[PENDING Paolo, already open in the code]** What does a day cost to live? The
   day loop's `STAKES` table is empty on purpose and says so.

## 8. TEST MATERIAL
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, sections VVVV through ZZZZ. Every
line `draft:true`, in the bank, never in the game.

## 9. SOURCES

REAL AISLE
- Dan Ariely, Emir Kamenica and Drazen Prelec, "Man's search for meaning: The case
  of Legos" (Journal of Economic Behavior & Organization 67, 2008): 40
  undergraduates, declining pay per model, Meaningful condition averaging 11 and
  Sisyphus 7, and enjoyment of Lego ceasing to predict output in the Sisyphus
  condition -- people.duke.edu/~dandan/webfiles/PapersUpside/Legos%202.pdf ;
  vialogue.wordpress.com/2014/02/26/ted-dan-ariely-what-makes-us-feel-good-about-our-work/
- Hackman and Oldham's job characteristics model: skill variety, task identity,
  task significance, autonomy, feedback, and the three psychological states
  including knowledge of the actual results of the work --
  mindtools.com/axhs5j7/hackman-and-oldhams-job-characteristics/ ;
  sciencedirect.com/science/article/pii/S1877042814028286 ;
  yourcoach.be/en/employee-motivation-theories/hackman-and-oldham-job-characteristics-model/
- Rebusque: "selling in the street, repairing, cooking, reselling or resolving is
  not a break between jobs, but the work itself"; ingenuity as a collective
  strategy; "we survived together, that's the only way survival works" --
  eldiario.com/2026/04/25/rebusque-economia-venezuela/ ;
  lasillavacia.com/red-de-expertos/red-de-venezuela/el-mercado-laboral-informal-como-modo-de-vida/ ;
  pulitzercenter.org/stories/unseen-workers-venezuelan-migrant-experience-limas-informal-economy ;
  anthrosource.onlinelibrary.wiley.com/doi/10.1111/jlca.70054

GAMES AISLE (mechanics only; no game he has not named enters the design)
- The "empty loop" (grinding for a meaningless reward, or repetition with no
  variation or escalation), engagement as a metric against enjoyment as an
  emotion, and cosmetic choice as fake agency --
  wayline.io/blog/beyond-the-grind-escaping-the-core-loop ;
  wayline.io/blog/the-art-of-repetition-how-repetitive-tasks-enhance-player-engagement ;
  gamedevessentials.com/designing-an-engaging-gameplay-loop-the-ultimate-guide/

OUR OWN REPO (every figure measured this round)
- engine/bohemia_purse.js (the four VERBS, PAYOUT), engine/bohemia_agents.js
  (KINDS, scheduleFor, the four archetypes and their minute budgets),
  engine/bohemia_dayloop.js (freshLedger, and STAKES empty on purpose),
  engine/bohemia_century.js
- records/BOHEMIA_ECONOMY_DAY_13 (building costs no time), DAY_15 (buying gives
  nothing), DAY_16 (a missed payment is permanent), DAY_17 (one wage, 27 quests,
  every job pays the same), DAY_19 (the world stops talking on day 67) -- the
  three Sisyphus conditions are measurements from those rounds, re-cited not
  re-derived

## 10. GATE STATE THIS ROUND

Green, run this round: economy 13/0, payday 38/0, purse 28/0, attempt 15/0,
canon rot 13/0, demo blockers 22/0, language 81/0.

`purse_gate` is 28 for 28 over the module that holds the four verbs. Every
assertion is true: it proves the ledger balances, that nothing goes negative, that
every movement declares its kind and carries a reason. **Nothing asks whether any
of the four verbs is something a player does**, because that is a question about
what the game is rather than about whether the arithmetic is sound.

That is the **fifth round running** where a green suite and a real finding are both
correct at once (16 `lights_bill_gate` 30/0, 17 `quest_study_gate` 456/0, 18
`payday_gate` 38/0, 19 `economy_gate` 13/0). The pattern this lane has now named
twice holds: **these gates check that a part does what it says. Nothing checks that
two parts agree, that a part keeps working for as long as the game lasts, or that
the part is the right part to have.**

Not this lane's to fix, and not a criticism of any gate.
