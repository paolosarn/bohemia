# DAY 48 — NOTHING IN THIS GAME ARRIVES. EVERY COST IS SOMETHING BURNING DOWN.

ECONOMY lane, VAMILY row `[who still bills]` Q48. MODE: RESEARCH — DO NOT IMPLEMENT.
**Round one of two: school. The number is round two, and the row says so.**
Claimed 9/21/26 `economy-vamily-knxaeh`, commit `3b437e5`.

> **THE ROW, VERBATIM:** "the coordinator's swing 9/21 and this lane's analog horror line
> (rule 20h): utilities that kept billing after the state stopped delivering, in the record
> (estimated bills after a grid failure, shutoffs enforced on a bankrupt city, hyperinflated
> bills nobody could read, a collapsing state's utilities that kept the meters and lost the
> plant). Who still sends the bill in a valley where nobody can make a cell; what a household
> does with a bill from a dead institution; what that puts on the phone he opens. Feeds
> WORLD's fold and WORDS Q27's notice. Two rounds, school then the number."

---

## 0. THE FINDING THAT PROVES US WRONG

The row asks **who still sends the bill**, and that is the assumption to break.

**In the real record, by the time it gets interesting, NOBODY SENDS IT.** The billing is the
part that survives. An office that cannot deliver water, cannot generate power and cannot
read a meter still generates paper, because the billing system is cheap, automatic, and the
last part of the machine with nobody's hand on it. Flint kept billing for water it had
poisoned. Detroit kept enforcing against 90,000 households while the city itself was
bankrupt. Lebanon's utility charges a fixed fee against two hours of supply a day. Venezuela
kept printing bills that had stopped meaning anything at all.

**So "who sends it" has no answer, and that IS the answer.** The horror of a bill from a dead
institution is precisely that there is no one on the other end of it: nobody to pay, nobody
to argue with, nobody who will stop.

*** AND OUR GAME HAS THE OPPOSITE PREMISE BUILT ALL THE WAY DOWN, ON PURPOSE, AND NOBODY HAS
EVER SAID IT OUT LOUD. *** Measured this round, every charge in Bohemia is one of two things:
**something of yours burning down, or somebody standing in front of you.** Nothing in this
game arrives from anywhere. There is no third kind of cost, and the code refuses to grow one.

---

## 1. WHAT OUR GAME CHARGES, MEASURED

### THE FOUR UPKEEP VERBS ARE FROZEN, AND ALL FOUR ARE CONSUMPTION

`bohemia_purse.js` ships exactly four, and the machine refuses a fifth in its own words:

    day:ate      resources     "the people who depend on you ate"
    fight:plate  resources     "the plate you wore at the bell is spent"
    night:power  electricity   "every lit circuit you hold burned one"
    ask:leaned   clout         "you leaned on somebody"

    upkeep(purse, <anything else>)
      -> { applied:false, reason:'NO_SUCH_VERB',
           about:'the four verbs are frozen; a fifth is a design change,
                  and design changes are Paolo's' }

**Read the four subjects. They ate. It is spent. It burned. You leaned.** Not one of them is
somebody charging you. Every daily cost in this game is a thing of yours going down, and the
purse itself is built so that a fifth kind cannot be added without a ruling.

### THE ONE CHARGE THAT HAS A SENDER, AND THE SENDER IS ALIVE

`BohemiaTowns.rentOn(used, towns)` is the whole of it: you are billed for blocks of a
faction's ground you used, per night, priced by their tier. Run on seed 7's real valley
(14 towns, the number round 47 shipped, which is the control on this probe):

    Anarchists  town      used 2   billed 2
    Blues       town      used 4   billed 3
    Caravans    fortress  used 6   billed 6
    Cartel      fortress  used 8   billed 8
    total 19          ruling: EVERYTHING COSTS ONE (8/15)

And who comes for it is a person at a door. `COLLECTOR`, verbatim:

> *"SOMEBODY IS AT THE DOOR AND THEY ARE NOT HERE FOR YOU"*
> *"YOUR FATHER WENT A NIGHT WITHOUT PAYING THEM. THEY REMEMBER"*
> *"THE DEBT DIED WITH HIM. THEY DID NOT"*

### AND THE GAME HAS ALREADY RULED THAT A BILL CANNOT OUTLIVE ITS SENDER

`bohemia_fold.js` rules thirteen fields across a generation; five are `ruled:true` and eight
are draft. `debt` is one of the ruled ones, and `bohemia_owing.js` reads that ruling rather
than copying it. `billDies()` returns **true**, and `whyDies()` says:

> *"a child is not personally liable for a parent's unsecured debts; the claim is against the
> estate and an insolvent estate means the creditor loses. **YOU DO NOT INHERIT A BILL, YOU
> INHERIT LESS AND YOU INHERIT THE PEOPLE HE OWED, still standing there.** That is a
> standing-web query, not a purse line."*

**That is a beautiful rule and it is the exact opposite of the thing this row is about.** Our
canon says the paper dies and the person survives. The real record's whole horror is that the
person is gone and the paper does not stop.

### THE PHONE READS SIX THINGS AND A BILL IS NOT ONE OF THEM

Rule 19(a) killed the pop-up card and sent the bookkeeping to the phone he opens. The feed
behind that phone (`bohemia_feedstream.js`, LIFE + CITY, 9/5) reads:

    deedLog    lit    prices    seats    built    min

**Nothing that arrives. No sender, no notice, no paper.** Three posts a drain, a life post
every eight beats, and every source is the world describing itself.

### *** AND THE DEAD SENDER'S BILL IS ALREADY IN THE CODE, IN ONE LINE, UNREACHABLE ***

`rentOn` looks a faction's tier up in the towns list and **falls back to `camp` when it does
not find one.** So a sender with no town still bills:

    Caravans, fortress, in the towns list, 6 blocks   ->  billed 6, tier fortress
    THE SAME faction with its town REMOVED, 6 blocks  ->  billed 2, tier CAMP
    a name that is in NO town list at all, 6 blocks   ->  billed 2, tier CAMP

**A bill from nobody already computes, silently, at the cheapest rate in the game.** Then the
honest half, because a latent line is not a live bug: measured across **ten seeds, 4,610
blocks, zero unheld and zero holders with no town.** Turf is derived from the town list, so
nothing reaches that fallback today. **It is a door that is already cut and has never been
opened**, which is this study's oldest shape (section 0.FIVE of the master) and the cheapest
possible place for round two to land.

*(One live oddity beside it, named not chased: most seeds derive **14 towns and 13 distinct
ground-holders**, so one faction usually has a seat and holds no block. It never bills,
because you can never walk on its ground. A landlord with no land.)*

---

## 2. THE REAL RECORD HAS FIVE SHAPES, NOT ONE

The row names four things. They are four different failures and they do not agree with each
other, which is the useful part.

### ONE. THE BILL KEEPS ITS TEETH AND LOSES ITS SERVICE. (FLINT)

Residents paid **about $864 a year for water, roughly double the national average** and among
the highest rates in the country, **for water they could not drink.** The city mailed
**around 8,000 notices** over **more than $5 million** of two years' arrears, threatening
liens and foreclosure; by one Flint attorney's count the city placed **21,000 liens** against
homes. The ACLU and the NAACP Legal Defense Fund argued the obvious thing out loud: the city
did not deliver its half of the bargain, so residents should not lose their houses over it.

**The service failed completely and the enforcement did not weaken by one percent.**

### TWO. THE ENFORCEMENT OUTLIVES THE INSTITUTION'S OWN SOLVENCY. (DETROIT)

Chasing **about $90 million from an estimated 90,000 delinquent customers**, the water
department ran **26,000 shutoffs**, escalating to **as many as 3,000 a week**, while the city
was in the largest municipal bankruptcy in American history. Two UN special rapporteurs came
in October 2014 and called it a violation of basic human rights.

**A bankrupt institution collected harder than a solvent one.** It had nothing else left.

### THREE. THE CHARGE DETACHES FROM THE SERVICE ENTIRELY. (LEBANON)

Between November 2021 and January 2022 the median household got **two hours of state
electricity a day, about 10% of the day**, and from June 2021 supply averaged under four
hours. The 2022 tariff reform then imposed **a fixed payment regardless of usage.** About
**40% of the utility's losses** are theft, illegal connections and weak collection.

**You are charged a flat fee for a thing that is off 22 hours a day.**

### FOUR. THE BILL KEEPS COMING AND STOPS MEANING ANYTHING. (VENEZUELA)

Rates stayed frozen while hyperinflation ran, so within a few years electricity for the
average household **cost next to nothing**, and the utility's **real billing revenue
collapsed 83% between 1999 and 2015.**

**This is the opposite failure from Flint and it is the same institution's failure.** The
paper still arrives every month. It is now a receipt for nothing, from nobody, and paying it
is not a decision anybody makes.

### FIVE. THE BILL BECOMES THE ONLY CHANNEL, SO EVERYTHING GETS LOADED ONTO IT. (GREECE)

The 2011 property levy was collected **through the electricity bill**, enforced by
**disconnection**, targeting **€1.667 billion in 2011 and €1.75 billion a year after.** By
February 2012, **1.5 million bills were past due and 250,000 were past the 80-day threshold**
at which the power could legally be cut.

**When a state can collect nothing else, it collects through the wire, because the wire is
the one thing it can still take away.** That is round 47's finding arriving from the other
side: whoever holds the last working connection holds the only enforceable claim left.

---

## 3. THE OTHER AISLE, AND IT DISAGREES WITH ALL FIVE

Read through the campaign layer he has named. **Battle Brothers runs on daily upkeep and not
one line of it comes from an office.**

    a man's wage      +2 crowns a level, x1.1^(level-1) to level 11, then x1.03^(level-11)
                      a level-11 Hedge Knight costs 91 crowns a day; at level 21, 122
    food              2 units per brother per day
    medicine          1 per injury per day, or the injury does not heal
    tools             1 per 15 points of durability repaired, or the weapon breaks for good
    not paying        mood falls, and men DESERT

**Every daily drain in it has a face and a reason, and the wage grows because the man grew.**
Miss it and somebody you know walks out of your line. That is what makes upkeep a thing you
push against instead of weather.

**SO THE TWO AISLES DISAGREE AND THE DISAGREEMENT IS THE DESIGN.** The real record says the
bill from a dead office is the most frightening object in a crash. The best campaign layer he
has named says a cost with nobody attached is not a mechanic at all. **Both are right, and
they are right about different things: the dead institution's bill is not an upkeep line. It
is not a cost. It is a PROP.**

---

## 4. THE SHAPE, AND IT IS A SHAPE, NOT A NUMBER

Round one is school. The number is round two. But the school has a conclusion and the row
asked three questions, so here are three answers in plain words.

> **WHO STILL SENDS THE BILL? NOBODY, AND THAT IS THE WHOLE EFFECT.** Do not build a faction
> that bills you. We have one of those and it is good: a living landlord whose collector
> knocks. The dead institution's bill has no sender by definition, and the moment it gets one
> it becomes rent and we already have rent.
>
> **WHAT DOES A HOUSEHOLD DO WITH IT? NOTHING, AND IT KEEPS IT ANYWAY.** Every real household
> in the record did one of three things: paid a charge it knew was wrong because the wire
> was the only thing the office could still take (Greece, Lebanon), ignored it until the
> paper carried a weapon (Flint's lien, Detroit's shutoff), or watched it turn into litter
> (Venezuela). **None of those is a transaction.** So in our game it costs ZERO batteries,
> takes nothing, cannot be paid, and cannot be argued with. **Under EVERYTHING COSTS ONE, a
> thing that costs nothing is the only honest way to put something in a player's hands that
> he cannot buy his way out of.**
>
> **WHAT DOES IT PUT ON THE PHONE? THE ONE VOICE WE DO NOT HAVE.** WORDS Q27 measured that
> **8 of 3,014 spoken lines name an institution at all** (their number, their corpus, cited
> as a premise and not re-run here). Rule 19(c) says no sentence outside the phone without a
> mouth and a portrait — and a dead office has no mouth, which is exactly why the phone is
> where it belongs. **The bill is the institutional register's only legal home**, and it is
> already routed there by two laws that were written for other reasons.

**And the analog horror read, one line, because 20(g) says a vibe and not a thesis:** the
frame is ordinary and one thing in it is wrong. A piece of paper, correctly formatted, too
calm, with a due date that has passed, for a service nobody has received in years, from an
office nobody can find. Nothing on it is scary. **It is scary because it is still working.**

---

## 5. WHAT THIS ROUND DID NOT DECIDE

- **The number.** The row says two rounds, school then the number. Round two costs it: what
  the paper says, how often one turns up, whether it ever carries a weapon, and whether the
  `camp` fallback in `rentOn` is the door or a separate object is built. **Round 38 is why
  this line exists:** that round had the mechanism measured in its own section 1 and shipped
  a number anyway, and it broke his tutorial. Not twice.
- **Whether the bill ever bites.** Flint's lien and Detroit's shutoff are the two places the
  paper grows teeth. Whether anything in this valley can be taken for an unpaid ghost debt is
  a ruling about what kind of game this is, not a number. **It is not asked here and it is
  not assumed.**
- **Who the dead office was.** Naming the institution is canon and canon is his. The record
  says only that it was ordinary and that it is gone.
- **Whether `rentOn`'s camp fallback should be fixed or used.** Measured as unreachable
  today. Which of the two it becomes belongs to WORLD and FACTIONS, who own that file.
- **Anything about the demo.** Rule 14: research rounds never touch it; only THE RUN re-cuts.
  Rule 15: this lane presents nothing for a thumb. Rule 18(b): research lanes continue and
  nothing here goes near the alpha or the four things.

---

## 6. ROUTED

- **WORLD, the fold** — **nothing in this game arrives, and that is a premise nobody wrote
  down.** Four frozen upkeep verbs, all consumption; one charge with a sender and the sender
  is alive; a fold that rules the bill dies and the lender survives. Any "bill from a dead
  office" is a third kind of cost and the purse refuses a fifth verb by design.
- **WORLD / FACTIONS** — **`rentOn` already bills for a sender with no town, at `camp` rate,
  silently.** Measured unreachable across ten seeds and 4,610 blocks, so it is a door, not a
  bug. Cheapest possible landing for round two, and it is your file either way.
- **WORDS Q27 `[analog horror voice]`** — **the phone is the institutional register's only
  legal home**, and two laws already put it there for unrelated reasons. Your round two
  writes the first notice; this round says what shape the thing behind it is and what it
  must not be (a charge).
- **QUESTS / UI** — **the paper is a PROP, not a card and not a cost.** Rule 19 says a quest
  is people, places and things; this is the thing. It costs zero, cannot be paid, and is
  picked up and kept.
- **PEOPLE** — the collector in `COLLECTOR` is the live half and it is already good. The dead
  half needs no person at all, which is the only reason it reads as horror.
- **LIFE + CITY** — the feed reads six things and none of them arrive. A seventh source would
  be the first thing in the game that comes from outside the valley.
- **COORDINATOR** — nothing blocking. Round two of this row is the number.

---

## 7. THE GATE NOTE

**Pre-push pass**: economy, purse, payday, attempt, canon rot, demo blockers, language,
handoff. Results in the commit.
**Full suite: 107 red at `ad23d875`, mine are: none.** The suite line has not moved since
9/14, so this sentence is seven rounds old and says so.

**The project-level hole, instance 33 of naming it** (the arithmetic is `instance = round −
15`; the master's 9/20 fold found that the counter skipped thirty, so this is 33 and not 34).
These gates check that a part does what it says. Nothing checks that two parts agree, that a
part keeps working for as long as the game lasts, that it is the right part to have, or that
the parts form a loop that closes.

**This round's instance is the best-behaved one yet, and it is the purse.** `upkeep()` refuses
an unknown verb and says why, in the ruling's own words. That is a part that knows the edge of
its own authority — and it means the answer to "can this game have a bill from nowhere" is
**no, by construction**, and that fact lived in a return value nobody had read. A gate that
asked *what kinds of cost can exist* would have printed it in one line; instead it took a
research round to find out that the design was already decided and written down.

## 8. THE PROBE THAT WAS WRONG, TWICE, AND THE CONTROL THAT CAUGHT IT

**My ground-holder probe reported ZERO holders on all ten seeds.** That would have been a
spectacular finding and it was two faults in my hand, one after the other:

1. `holderOf(towns, x, y)` takes the **towns array**, not the turf map, and returns
   `{faction, ...}`, not a string. I passed `turf()`.
2. `blocksOf(m, cat)` returns **`{n, id, blocks}`**, not an array, and a block carries
   **`cx, cy`**, not `x, y`. So the second cut read `blocks.length` as `undefined` and
   sampled nothing, and printed the same clean zero.

**Both printed a tidy table of zeros that read exactly like a measurement.** What killed them
was round 47's shipped positive control — *576 of 576 cells held* — because zero is not a
worse number than 576, it is an impossible one. The corrected probe reports **4,610 blocks
across ten seeds, 0 unheld**, and **478 blocks on seed 7**, which is round 46's shipped number
for the same valley. Two independent shipped numbers reproduced before any new one was
believed.

That is the fourth round running where the positive control saved the finding. The running
kept-mistakes list is DAY 36 §9, DAY 38 §1, DAY 40 §7, DAY 44 §7, DAY 47 §7 and this.

---

*ECONOMY round 48, one of two. Research only. Nothing in the game changed.*
