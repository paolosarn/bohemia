# DAY 49 — HE CANNOT ASK. FOUR OF SIXTEEN OFFER, AND NOT ONE OF THEM PAYS MONEY.

ECONOMY lane, VAMILY row `[first battery]` Q49. MODE: RESEARCH — DO NOT IMPLEMENT.
**Round one of two: school. The number is round two, and the row says so.**
Claimed 9/22/26 `economy-vamily-knxaeh`, commit `a74d841`.

> **THE ROW, VERBATIM:** "RUN 2490fc8 measured the demo's shelf: he wakes with ZERO batteries
> and food and meds cost one each, so nothing can be bought in the five minutes; day-one
> supply is one per head held by the ground's holder (9/16). So: the real record of first
> money in a new place (a day's labour, a pawn, a favour repaid, a thing found and sold),
> what it costs him in time and standing, who hands it over and with what face, and what that
> puts in the first five minutes. It is the economics of the first person at his door
> (QUESTS [wire the door]). Two rounds, school then the number."

---

## 0. THE FINDING THAT PROVES US WRONG

The row asks **what the first battery costs him in time and standing.** Both of those are the
wrong currency.

**Measured: the only route open to a man with nothing costs him neither.** It is free, it
takes no time, and it costs zero standing. **What it costs is that he owes somebody**, and
that is a third thing the row did not name.

**And the second half is worse and better at once: NOBODY IN THIS VALLEY PAYS MONEY.** All
sixteen factions have a written line for what they give a person who belongs to them, and
**zero of the sixteen give a battery.** They give ammunition, stored food, medicine, water,
repair, news, credit, admission, a crowd. **A man on his first morning cannot get a battery
from any person in this game**, by any route, at any rung.

So the answer to "where does a stranger's first battery come from" is not a market, a job
board or a favour. **It has to be handed to him by the first person who speaks to him, and
handing it over is what makes that a quest instead of a conversation.**

---

## 1. WHAT OUR GAME GIVES A MAN WITH NOTHING, MEASURED

### 1a. RUN'S PREMISE HOLDS, CHECKED FIRST (rule 12)

    a fresh purse            { resources: 0, electricity: 0, clout: 0 }
    water, food, salvage,    1 battery each, ruling
    meds                     "8/15 EVERYTHING COSTS ONE + 9/4 BATTERIES ARE THE MONEY"

**He wakes with nothing and everything costs one.** RUN measured it from the shelf; this is
the same fact from the purse. It holds.

### 1b. FOUR ROUTES IN THE ENGINE PRODUCE A BATTERY. TWO WORK.

    payForWork(purse, kind, day, ref)   WORKS -> balance 0 to 1
    payQuest(purse, ev, day)            WORKS with a real event -> 1 on outcome COMPLETE
    produce(purse, 'battery')           NO_RULING, the PRODUCTION table is {} and empty
    convert(...)                        NO_REASON

**And both of the two that work pay at the END of something.** A day has to finish; a quest
has to complete. Neither can fire in a first minute. *(A thing worth naming in passing:
`payForWork` paid one battery for a `kind` of `{}` — **it does not check what the work was.**
Not a bug to fix from this lane, and a builder should know it before pricing anything.)*

### 1c. BARTER IS REAL, AND IT REFUSES HIM BY NAME

`offer({tier, good, given, purse})`, run on a real camp:

    camp      wants resources, gives 1, have 0, can: FALSE, why: 'NOTHING_TO_TRADE'
    town      null  (not a barter market)
    fortress  null  (not a barter market)

**Barter exists only at a camp, only for a stranger, one good for one good** — and it turns
him away in its own words because he is carrying nothing. *The route the row calls "a thing
found and sold" is built, correct, and closed to him on the first morning by design.*

### 1d. *** HE CANNOT ASK. FOUR OF SIXTEEN OFFER. ***

`bohemia_favour.js` has three first moves and the difference between two of them is the whole
round:

    they-give-first    fromRung null      costs standing NO    YOU OWE       "THEY ARE OFFERING"
    you-give-first     fromRung COUNTED   costs standing YES   you do not    "YOU CAN ASK THEM FOR"
    never              -                  -                    -             -

A stranger starts at rung `stranger`, not `COUNTED`. So **asking is shut and being offered is
open**, and running `askFor` against all sixteen real rules with `given = 0` says exactly how
open:

    THE CARTEL          WHATEVER YOU NEEDED THAT WEEK            owes: true   standing cost 0
    THE CHURCH          STORED FOOD AND A PLACE ON THE LIST      owes: true   standing cost 0
    THE NETWORK         THE FEED, THE REPEATERS, THE LIT GRID    owes: true   standing cost 0
    THE SOCIAL FORCES   ADMISSION, AND NOTHING ELSE              owes: true   standing cost 0

    eleven others   "NOT YET. THEY DO NOT KNOW YOU WELL ENOUGH TO OWE YOU ANYTHING."
    THE AMALGAMATION "THEY GIVE NOTHING TO ANYBODY. THAT IS NOT A DEPTH PROBLEM."

**FOUR OF SIXTEEN DOORS OPEN TO A MAN WITH NOTHING, AND ALL FOUR MAKE HIM OWE.**

**Now read the four.** The criminal, the congregation, the utility and the bureaucracy. **That
cast was not chosen; it fell out of sixteen faction rules written for other reasons** — and it
is exactly the four kinds of body that reach a person with nothing in the real record: the
lender who asks no questions, the church with stored food, the man who can turn the power on,
and the office that can put you on a list. *Round 47 found the same thing about water: the
valley's most dangerous monopoly fell to the scavengers and the congregation by derivation,
without a single decision.*

### 1e. AND THE NUMBER THAT SETTLES THE ROW: ZERO OF SIXTEEN PAY MONEY

    AMMUNITION · WHATEVER YOU NEEDED THAT WEEK · STORED FOOD AND A PLACE ON THE LIST ·
    ENFORCEMENT OF A DEAL · NEWS FROM OUTSIDE THE VALLEY · REPAIR, AND AN APPRENTICESHIP ·
    MEDICINE, AND TEACHING · WATER, AND A VOICE IN WHERE IT GOES · CREDIT · A CROWD, FAST ·
    THE FEED, THE REPEATERS, THE LIT GRID · THE UNDERGROUND, AND WHEN IT IS A GRAVE ·
    A NETWORK INSIDE EVERY OTHER FACTION · FRESH FOOD, AND MEMBERSHIP ITSELF ·
    ADMISSION, AND NOTHING ELSE · (the Amalgamation: nothing)

**Sixteen written answers to "what do they give you", and not one is a battery.** The closest
is THE REDS, whose word is **CREDIT** — which is a promise about money and not money.

**This is the one pocket again** (master section 0.ONE, now eleven rounds deep). Nobody but
the player can hold a battery, so nobody can hand one over, so the favour system pays in
kind — and that is not a flaw in the favour system, it is the pocket wall showing up in the
one place where it changes what the first five minutes can contain.

---

## 2. THE REAL RECORD OF A FIRST MONEY

The row names four routes. Each one behaves differently, and none of them is instant.

### A DAY'S LABOUR: PAID AT THE END, AND NOT GUARANTEED AT ALL

Day labourers **assemble at known corners and are paid in cash at the end of the work day.**
Getting picked is a physical contest: when a vehicle pulls up **men sprint and mob it**, and
in one worker's words, *"You have to be the fastest."* And the other half, which is the part a
game would leave out: **arrivals eager to work can idle on the corner for days without being
picked at all.**

**So a day's labour is: stand where you are visible, be chosen, work, be paid at dusk.** The
waiting is not dead time in the record, it is most of the story.

### A PAWN: A BRIDGE, NOT A SALE

A pawnshop lends **about 25% to 60% of an item's resale value**; the average loan is **$150**,
repaid in about **30 days**, and **about 85% of borrowers redeem the item.**

**Five in six people come back for the thing.** A pawn is not selling what you own, it is
borrowing against it and getting it back. *For us that kills the obvious build: a percentage
of value is a FRACTION and this game has no fractions (round 14).* What survives is the shape
with no fraction in it: **you hand over a thing you care about, you get one, and the thing
waits for you until it does not.**

### A FAVOUR: AND THIS IS THE DOCUMENTED ONE

In the **2011 Tōhoku tsunami and the 2020 Beirut explosion, 80 to 90% of survivors were
rescued by neighbours and bystanders, not professional search teams**, and most live rescues
in the first 72 hours are done by relatives and neighbours with professionals arriving to
matter later.

**When a person has nothing, the thing that reaches them is a person standing nearby.** That
is round 45's finding arriving from the rescue literature instead of the crash literature: in
three cities nobody was told anything by an institution in the first minute, and here nobody
is reached by one in the first three days. **Both times it is a neighbour.**

### WHAT I COULD NOT FIND, SAID PLAINLY RATHER THAN PADDED

I went looking for a clean figure on **what share of new arrivals' first money comes from a
relative or a network rather than from wages**, and the record would not give me one. The
migration literature is rich on remittances *sent home* and on later labour-market outcomes,
and thin on the first week. **Day labour, the pawn and the disaster-rescue numbers carry this
round; the network number is asserted nowhere in it.**

---

## 3. THE OTHER AISLE, AND IT DISAGREES WITH THE ROW'S PREMISE

The campaign layer he has named **never starts you at zero.** Starting funds are a setting,
tiered high, medium and low, chosen when a campaign begins, and a first contract is waiting in
the first village you walk into. *(I could not get the exact crown figures out of the record
and I am not going to invent them; the shape is what matters and the shape is certain.)*

**So the best campaign layer he named makes the same call twice: you begin able to make one
choice, and the pressure comes from upkeep draining you afterwards, not from being unable to
act at all.** Being broke is a state that game puts you *into*. It is not the state it hands
you at the door.

**And that is the argument against solving this with a starting purse.** Handing him a battery
at wake-up is the Battle Brothers answer and it costs the game the best scene it has: **a
stranger with nothing, and the first person who speaks to him.** The disagreement resolves the
same way round 48's did — **give him the thing, but give it through a mouth.**

---

## 4. THE SHAPE, AND IT IS A SHAPE, NOT A NUMBER

Round one is school. The number is round two. The row asked four things and the measurements
answer three of them now.

> **WHERE DOES IT COME FROM? A PERSON HANDS IT TO HIM, BECAUSE NO OTHER ROUTE IS OPEN.** He
> cannot ask (asking needs a rung he does not have). He cannot trade (barter refuses him by
> name: NOTHING_TO_TRADE). He cannot be paid (work and quests both pay at the end of
> something). He cannot be given one by a faction (zero of sixteen pay money). **Everything
> in the engine points at the same door, and QUESTS is already building it.**
>
> **WHAT DOES IT COST HIM? NOT TIME AND NOT STANDING. HE OWES.** All four open doors are
> `owes: true, standing cost 0`. The obligation is the price, it is the only price available
> on the first morning, and this study has been circling it for ten rounds: a debt is not a
> number, it is a person who remembers (round 9).
>
> **WHO HANDS IT OVER? ONE OF FOUR, AND THE CAST IS ALREADY DERIVED.** The criminal, the
> congregation, the utility, the bureaucracy. Nobody cast that. It fell out of rules written
> for other reasons, and it is the correct real-world cast for a person with nothing.
>
> **AND WHAT IT PUTS IN THE FIVE MINUTES IS ONE SCENE, NOT A SYSTEM.** Somebody offers, he
> takes, he owes. No shop, no board, no menu, no timer. *The thing the day labourer waits
> days on a corner for, handed to him in the first minute by somebody with a reason to bother
> — which is exactly what round 45 said the first minute has to contain and what rule 19(d)
> now requires it to contain.*

---

## 5. WHAT THIS ROUND DID NOT DECIDE

- **The number.** Round two: how many batteries, whether the obligation is counted or felt,
  what the second one costs, and whether the pawn shape is built at all. **Round 38 is why
  this line exists:** that round had the mechanism measured in its own section 1 and shipped a
  number anyway, and the number broke his tutorial.
- **Whether a faction should ever pay money.** Zero of sixteen do. Changing that is a design
  ruling about what a faction *is*, not a number, and it is pending 41's question again: can
  a deal exist between two people who are not the player.
- **Who the first person is.** PEOPLE casts people and QUESTS owns `[wire the door]`. The
  record says *somebody with a reason to bother*, and that is a shape, not a name.
- **Whether `payForWork` should check what the work was.** It does not. Named, not touched:
  that file belongs to WORLD.
- **Anything about the demo.** Rule 14: research rounds never touch it; only THE RUN re-cuts.
  Rule 15: this lane presents nothing for a thumb. Rule 18(b): research lanes continue. Rule
  22 binds MAKING lanes and names twelve of them; ECONOMY is not one, and this round did not
  invent a cook to look busy.

---

## 6. ROUTED

- **QUESTS `[wire the door]`** — **the first battery has to come out of the first person's
  hand, because the engine closes every other door on the first morning.** Section 1 is the
  proof: asking needs a rung he lacks, barter refuses him by name, work and quests pay at the
  end, and zero of sixteen factions pay money.
- **WORLD / FACTIONS** — **zero of sixteen faction payouts are money, and four of sixteen open
  to a stranger.** The four are THE CARTEL, THE CHURCH, THE NETWORK and THE SOCIAL FORCES, all
  `owes: true` at zero standing cost, and that cast was derived and not chosen.
- **PEOPLE** — **80 to 90% of disaster survivors are reached by a neighbour or a bystander,
  not a professional.** The first face is not an official one, in two separate literatures now
  (this round's rescue record and round 45's crash record).
- **WORDS** — *"You have to be the fastest"* is the day-labour corner in five words, and the
  bank's section for this round is built around being offered rather than asking.
- **RUN** — your shelf measurement holds, checked from the purse side: a fresh purse is zero
  and every good is one.
- **COORDINATOR** — nothing blocking. Round two of this row is the number.

---

## 7. THE GATE NOTE

**Pre-push pass**: economy, purse, payday, attempt, canon rot, demo blockers, language,
handoff. Results in the commit.
**Full suite: 107 red at `ad23d875`, mine are: none.** The suite line has not moved since
9/14, so this sentence is now eight rounds old.

**The project-level hole, instance 35.** These gates check that a part does what it says.
Nothing checks that two parts agree, that a part keeps working for as long as the game lasts,
that it is the right part to have, or that the parts form a loop that closes.

**This round's instance: the favour system, the barter module and the purse each refuse the
player correctly and separately, and nothing can ask whether ANY door is open.** Every one of
those refusals is right. `NOTHING_TO_TRADE` is right. *"NOT YET. THEY DO NOT KNOW YOU WELL
ENOUGH"* is right. An empty `PRODUCTION` table is right, because what a building makes is his
ruling. **Put them together and a new player cannot obtain the unit of currency the whole game
is denominated in, and no gate in the suite can ask that question** — the same shape as round
36 (what does the first ten minutes hand a stranger) and round 45 (what does a save with no
history see). **Three rounds have now found the same missing gate from three directions: a
check that plays the first morning as a man with nothing.**

## 8. THE PROBES THAT WERE WRONG, AND WHAT CAUGHT THEM

**Three signature faults this round, all mine, all kept because a later round will reach for
the same functions.**

1. **`payQuest(purse, ev, day)` takes an EVENT OBJECT with `.outcome`, not a string.** Passing
   `"COMPLETE"` returned `NO_RULING, key: null` — **which reads exactly like "quests do not
   pay", and I nearly wrote that down.** With `{outcome:'COMPLETE', questId:'q1'}` it credits
   one battery. *The tell was `key: null`: the table has a COMPLETE row, so a null key is the
   caller's fault and not the table's.*
2. **`offer(opts)` takes `{tier, good, given, purse}` and is gated by `wantsGoods(tier,
   given)`.** My first call returned `null`, which looks like "barter is dead" and actually
   means "not a barter market". Measured properly: `wantsGoods('camp')` false,
   `wantsGoods('camp','stranger')` TRUE, `wantsGoods('town')` false.
3. **`askFor(rule, given, save)` takes a RULE, not `{rung}`.** My fake object had no `pays`
   field, so it fell into the `if(!what)` branch and returned *"THEY HAVE NOTHING TO GIVE
   ANYBODY"* — **for all three rungs I tried, which made it look like a rung wall when it was
   a missing field.** Run against the sixteen real rules it gives the 4/11/1 split in section
   1d, and the refusals are three different sentences rather than one.
   *(And a fourth, small: `B.RULES` is an object, not an array, so `.forEach` threw. Better to
   throw than to return a tidy zero.)*

**All three of the first faults produced a clean, quotable, WRONG negative result.** That is
the pattern this study keeps recording: *an instrument that is broken in the obvious way does
not look broken, it looks like a finding.* The rule that caught every one of them is the same
one: **a negative needs a positive control before it is believed.**

---

*ECONOMY round 49, one of two. Research only. Nothing in the game changed.*
