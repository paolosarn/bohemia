# ECONOMY -- ROUND 22: THE FIRST ONE IS A CLIFF, NOT A SLOPE
# (ECONOMY lane, 9/6/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q22 [what a lie costs], verbatim from VAMILY.md:
#   "What being caught lying costs a person in a place with no courts: real
#    material on reputation collapse in informal markets and small communities,
#    what happens to a trader nobody believes, and how long it takes to come back
#    from it. Deliver what a caught lie should do to standing and to prices."
# Named DAY 22 for the machine. A round is one VAMILY and is never called a day
# to Paolo (NO CALENDAR TALK, 9/5, LOCKED).
#
# ROUND 9 [trust credit] already covered COURTLESS CREDIT and found the organs
# (whoHears, memory, commitment, belonging, deeds) live and the punishment being
# exclusion rather than seizure. This round is the different question: what a
# CAUGHT LIE does, and what coming back from one looks like.

## 0. THE HEADLINE

The valley can watch you, remember you, talk about you behind your back and rank
you from HOSTILE to family. Every part of that is built and running.

> **AND THERE IS NOT ONE THING YOU CAN DO THAT MOVES ANY OF IT.
> `DEED_WEIGHT` HAS ZERO ROWS.**

The standing module ships its deed table empty by his own mechanism/contents law,
and the header says exactly what the empty half is: *"Positive is a good turn,
NEGATIVE IS A WRONG DONE."* So every opinion is 0 and every standing is NEUTRAL.

**There is also no lie to catch.** Searched the whole engine: no lie, no deceive,
no bluff, no caught. Every hit for the word is a comment about being honest in
code.

And the real record says the thing I was going to design is wrong:

> **A CAUGHT LIE IS NOT A NUMBER GOING DOWN. IT IS A CLIFF YOU FALL OFF ONCE, AND
> WHAT YOU DO AFTERWARDS IS MOSTLY NOT RECOVER. YOU START AGAIN AS A NOBODY.**

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

### 1a. THE WHOLE MECHANISM FOR REPUTATION COLLAPSE IS BUILT
```
SEE_RANGE        9 tiles     you have to be able to SEE it to have seen it
HEARSAY_LOSS     0.55        a retold deed keeps 55% of its force
MAX_HOPS         2           two hops and it is barely a rumour
GOSSIP_WINDOW    45 days     how long a deed stays worth repeating
RUNGS            HOSTILE -3 | COLD -1 | NEUTRAL 1 | WARM 3 | FWU
```
**The negative end of the ladder already exists and has two rungs on it.** And
`standingOf()` averages the opinions of a faction's actual members, so there is no
faction ledger anywhere: a deed the Cartel watched moves the Cartel and nobody
else, because nobody else was standing there. That is good design and it is done.

### 1b. AND NOTHING FEEDS IT
```
DEED_WEIGHT rows: 0
```
By the law, not by accident. The header:
> *"DEED_WEIGHT SHIPS EMPTY. What counts as a deed and what it is worth to whom is
> his ruling and it has not been made. With an empty table every opinion is exactly
> 0 and every standing is NEUTRAL -- the module is inert until he rules, and the
> gate asserts that."*

So the gossip runs, the memory decays, the rungs are ranked, **and the input is
zero.** Round 9 found the same shape from the credit side; this is the same
absence from the reputation side.

### 1c. AND THERE IS NOTHING TO BE CAUGHT AT
No verb anywhere lets a player say a false thing. The quest tags carry HOW you did
it (quiet 81, notable 48, reckless 42 -- round 17) and none of them is a lie.

**The one place lying is canon is a line the game already carries**, from round 9's
record: *"THEY DO NOT ASK YOUR NAME, THEY ASK WHERE YOU SLEEP... Answer it with a
lie and you will never get either."* The consequence is written. The lie is not
sayable.

## 2. THE REAL AISLE

### 2a. THE FIRST ONE IS A CLIFF, AND EVERY ONE AFTER IT IS CHEAP
This is the measured finding of the round, from Cabral and Hortacsu's study of
eBay seller reputation:

> **WHEN A SELLER GETS HIS FIRST NEGATIVE FEEDBACK, HIS WEEKLY SALES GROWTH GOES
> FROM +5% TO -8%.** A thirteen-point swing, on one mark.

And then the part that makes it a shape rather than a penalty:

> **SUBSEQUENT NEGATIVES ARRIVE 25% MORE RAPIDLY THAN THE FIRST ONE, AND HURT
> NOWHERE NEAR AS MUCH.**

Once you are marked, people start looking, and they find more. The reputation has
already done its work; the extra marks are just the world confirming what it
decided. On price, a 1% rise in the share of negative feedback tracks about a 9%
fall in price, though the authors are honest that the price estimate is weakly
significant.

**A reputation is not a dial. It is a threshold you fall through once.**

### 2b. AND MOSTLY YOU DO NOT COME BACK. YOU LEAVE.
The same study: **a seller is more likely to exit the lower his reputation is, and
just before exiting he collects more negatives than his lifetime average.** The
observed end state of a bad reputation is not repair. It is departure.

### 2c. SO WHAT ACTUALLY HAPPENS IS YOU START AGAIN AS A NOBODY
Friedman and Resnick, "The Social Cost of Cheap Pseudonyms": **when an identity can
be cheaply abandoned and replaced, reputation stops working as accountability at
all.** And the equilibrium a society lands on to cope with that is the finding:

> **NEWCOMERS "PAY THEIR DUES" BY ACCEPTING POOR TREATMENT FROM PLAYERS WHO HAVE
> ESTABLISHED REPUTATIONS.** Cooperation survives, but only because everybody new
> is treated badly on arrival.

The authors name the price of it: **there is an inherent social cost in making the
spread of reputations optional**, and it is paid by every honest newcomer as well
as by the one who ran from his own name.

> **THAT IS THE ANSWER TO "HOW LONG DOES IT TAKE TO COME BACK". YOU DO NOT COME
> BACK. YOU ARRIVE AGAIN, AS A STRANGER, AND THE VALLEY MAKES STRANGERS PAY.**

### 2d. THE ONE THAT PROVED ME WRONG ABOUT THE SOURCES
I went in expecting to lead with the Maghribi traders: a medieval coalition where a
cheating agent was collectively shunned by every merchant in the network, and the
standard example of enforcement with no courts.

**The reappraisal says they used the courts.** Edwards and Ogilvie showed the
Maghribis combined reputation sanctions with real legal mechanisms, much as
European merchants did, and Greif has answered at length. The clean story of pure
reputation with no law behind it is contested.

**Recorded because it changes a design instinct**, not just a citation: a world
where reputation is the *only* enforcement is not something the historical record
actually gives us. Even the famous example had a backstop.

## 3. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named enters the design; these are mechanics as mechanics.)

Our own canon has already settled the shape twice and both rulings point the same
way:
- **ROUND 5 AND ROUND 9 BOTH REFUSED A REPUTATION NUMBER.** The standing systems
  express this in stages and words, not a meter, and that is the anti-spreadsheet
  ruling doing its job.
- **ROUND 9's PUNISHMENT IS ACCESS, NOT SEIZURE:** the wall in `commitment` stops
  moving and doors that were opening stop.

And the eBay shape maps onto our ladder with nothing invented: `NEUTRAL(1)` to
`COLD(-1)` **is a cliff already.** It is two rungs apart with nothing between them.

## 4. *** THE FINDING THAT PROVES US WRONG ***

I came into this round intending to deliver a slope: caught lying, standing falls,
behave well, standing climbs.

> **BOTH HALVES OF THAT ARE WRONG. THE FALL IS NOT GRADUAL AND THE CLIMB MOSTLY
> DOES NOT HAPPEN.**

- **The fall is one step.** +5% to -8% on the first mark, and everything after it
  is noise. A caught lie should not subtract; it should move you.
- **The climb is not a climb.** Real traders with bad reputations exit. Where a
  name is cheap they come back as somebody else, and being new is itself the
  punishment, paid to the whole society by everybody who is new.

**And that is the same object this lane has now found four times.** Round 9: a debt
is a person who remembers. Round 18: the market's real product is news. Round 19:
the bazaar's answer is a regular guy. Round 22: **the punishment for a lie is being
a stranger again.** Standing is not a score in Bohemia. It is whether the people
you keep going back to still know you.

## 5. WHAT A CAUGHT LIE SHOULD DO, DELIVERED

Mechanism only. Every deed, weight and word stays his, and `DEED_WEIGHT` is his
table.

**TO STANDING:**

**1. IT IS ONE STEP DOWN THE LADDER WE ALREADY HAVE, NOT A NUMBER FALLING.**
`NEUTRAL` to `COLD` is the cliff, it is built, and it needs no new field. The
second lie should cost much less than the first, because by then the world has
already decided.

**2. IT MOVES ONLY THE PEOPLE WHO COULD HAVE SEEN IT, AND THEN IT TRAVELS.** Nine
tiles of sightline, 55% of its force per retelling, two hops, forty-five days. All
shipped. **A lie told where nobody is standing costs nothing, which is true and is
also the whole geography of round 16's dark blocks.**

**3. THE WAY BACK IS NOT TIME, IT IS BEING KNOWN AGAIN.** Nothing should heal on a
timer. `memory` already decays and decays slower for the familiar (round 9), so
showing up is already the mechanism. Round 19's clientelization is the same
sentence from the shop's side.

**TO PRICES:**

**4. THE PRICE DOES NOT MOVE. WHAT MOVES IS WHETHER HE IS SERVED.** EVERYTHING
COSTS ONE is LOCKED, and round 18 already established the alternative and measured
that we do not have it: our till refuses nothing, to nobody, anywhere. **A caught
liar should meet the refusal round 18 asked for, and he is the best possible reason
for it to exist.**

**5. AND THE COST LANDS ON WHAT ROUND 21 SAID HE NEEDS.** Not his batteries: his
access to somewhere that will hold them, deal with him, or tell him anything.

**AND THE CATCH ITSELF:**

**6. SOMEBODY HAS TO BE STANDING THERE.** A lie nobody witnessed is not a caught
lie, and the module already enforces that. The scene is not the lie, it is the
moment somebody who was there says so.

## 6. REFUSED

- **A REPUTATION NUMBER, SCORE OR METER.** Rounds 5 and 9 both settled it and the
  anti-spreadsheet ruling forbids it. The rungs are words.
- **A SLIDING PENALTY THAT DECAYS BACK.** Section 4. The record says a cliff and a
  departure, not a slope and a recovery.
- **A PRICE PENALTY FOR LIARS.** 8/15 is LOCKED. The cost is refusal, not a markup,
  which is round 18's finding and is better anyway.
- **FILLING `DEED_WEIGHT`.** It is his table by name, the module says so, and its
  gate asserts the emptiness.
- **A WORLD WHERE REPUTATION IS THE ONLY ENFORCEMENT.** Section 2d: even the
  Maghribis used courts. Bohemia has factions who can act, and they should.
- **INVENTING WHAT A LIE IS.** What a player can lie ABOUT is canon and words, and
  belongs to WORDS and QUESTS.
- **ANY IMPLEMENTATION.** MODE: RESEARCH.

## 7. ROUTED

**TO PEOPLE, who own standing and memory:**
1. **`DEED_WEIGHT` HAS ZERO ROWS AND EVERY OTHER PART OF THE ORGAN IS RUNNING.**
   Sightline, hearsay decay, hops, window, rungs and faction aggregation are all
   built and correct. **The whole system is inert for want of its contents.**
2. **THE FIRST MARK SHOULD BE THE EXPENSIVE ONE.** eBay: +5% to -8% on the first,
   and later ones arrive 25% faster and cost far less. Our ladder already has the
   cliff in it (NEUTRAL to COLD).

**TO WORLD and FACTIONS, joining round 18:**
3. **A CAUGHT LIAR IS THE BEST REASON THE REFUSAL SHOULD EXIST.** Round 18 measured
   that our till refuses nothing to nobody. The price never moves; whether he is
   served does.

**TO WORDS and QUESTS:**
4. **THERE IS NO WAY TO SAY A FALSE THING.** The consequence is already canon
   ("answer it with a lie and you will never get either") and the sentence cannot
   be spoken. A lie needs somewhere to be told.

**TO THE COORDINATOR, for Paolo:**
5. **[PENDING Paolo]** What is the first thing a player can be caught at, and what
   does it cost him? `DEED_WEIGHT` is his table and the negative half of it is the
   most characterful thing in this lane's whole study: **it is the list of what this
   valley thinks is wrong.**

## 8. TEST MATERIAL
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, sections FFFFF through JJJJJ. Every
line `draft:true`, in the bank, never in the game.

## 9. SOURCES

REAL AISLE
- Luis Cabral and Ali Hortacsu, "The Dynamics of Seller Reputation: Evidence from
  eBay" (Journal of Industrial Economics, 2010): weekly sales growth moving from
  +5% to -8% on a seller's first negative feedback; subsequent negatives arriving
  25% more rapidly and mattering far less; a 1% rise in the negative share tracking
  roughly a 9% price fall at weak significance; and low-reputation sellers exiting
  after a run of worse-than-lifetime feedback --
  onlinelibrary.wiley.com/doi/10.1111/j.1467-6451.2010.00405.x ;
  nber.org/system/files/working_papers/w10363/w10363.pdf ;
  archive.nyu.edu/jspui/bitstream/2451/26094/2/6-32.pdf
- Eric Friedman and Paul Resnick, "The Social Cost of Cheap Pseudonyms" (2001):
  cheap identity replacement destroying reputation as accountability, and the
  equilibrium where newcomers pay their dues by accepting poor treatment, with an
  inherent social cost to making the spread of reputations optional --
  freehaven.net/anonbib/cache/cheap-pseudonyms.pdf ;
  researchgate.net/publication/2431661_The_Social_Cost_of_Cheap_Pseudonyms
- Avner Greif, "Reputation and Coalitions in Medieval Trade: Evidence on the
  Maghribi Traders" (1989), and the reappraisal that they also used the formal
  legal system -- cambridge.org/core/journals/journal-of-economic-history/article/abs/reputation-and-coalitions-in-medieval-trade-evidence-on-the-maghribi-traders/A83D670DCFC2C11D362D0DD3AF344064 ;
  web.stanford.edu/~avner/Greif_Papers/2012_Greif_long_ssrn_Maghribi.pdf

OUR OWN REPO (every figure measured this round)
- engine/bohemia_standing.js (DEED_WEIGHT empty by law, SEE_RANGE 9, HEARSAY_LOSS
  0.55, MAX_HOPS 2, GOSSIP_WINDOW 45, the RUNGS ladder, and standingOf averaging
  members rather than holding a ledger), engine/bohemia_memory.js,
  engine/bohemia_commitment.js (STAGES and the wall), engine/bohemia_favour.js,
  engine/bohemia_belonging.js, engine/bohemia_ties.js, engine/bohemia_deeds.js
- an engine-wide search for a lie, deceive, bluff or caught verb: none
- records/BOHEMIA_ECONOMY_DAY_9 (courtless credit and the organs, not reopened),
  DAY_18 (the till refuses nothing), DAY_19 (clientelization), DAY_21 (what a
  player actually needs) -- re-cited, not re-derived

## 10. GATE STATE THIS ROUND

Green, run this round: economy 13/0, payday 38/0, purse 28/0, attempt 15/0,
canon rot 13/0, demo blockers 22/0, language 81/0, **standing 35/0.**

`standing_gate` is 35 for 35 over the module whose deed table has zero rows, and
that is the gate working exactly as designed: its own module's header says the
gate ASSERTS the emptiness, because filling it would be inventing canon. **Every
assertion is true and one of them is that nothing can happen.**

This is the **seventh round running** where a green suite and a real finding are
both correct at once (16 lights bill 30/0, 17 quest study 456/0, 18 payday 38/0,
19 economy 13/0, 20 purse 28/0, 21 the whole suite). But this one is different
from the other six and the difference is worth writing down:

> **THE OTHER SIX WERE GAPS BETWEEN PARTS. THIS ONE IS A GATE CORRECTLY GUARDING
> AN EMPTY ROOM.** The mechanism is right, the gate is right, the law is right, and
> the room is still empty. That is not a gap in the checking. It is the
> mechanism/contents split doing precisely what it exists to do, and the answer is
> not a better gate, it is a ruling.

## 11. HOW THIS LANE'S TWENTY-TWO ROUNDS COMPOSE

Written once, here, because Q1 to Q22 are now all shipped and the shape has stopped
changing.

**FOUR ROUNDS, FROM FOUR DIRECTIONS, FOUND THE SAME OBJECT:**
```
ROUND  9   a debt is a person who remembers
ROUND 18   the market's most important product was news, not goods
ROUND 19   the bazaar's answer to not knowing what things are worth is a regular guy
ROUND 22   the punishment for a lie is being a stranger again
```
> **THE ECONOMY OF BOHEMIA IS MADE OF PEOPLE YOU KEEP GOING BACK TO.**

**AND TWO ROUNDS, FROM TWO DIRECTIONS, FOUND THE SAME MISSING OBJECT:**
```
ROUND 15   you cannot own a good, because there is no bag
ROUND 21   what people pay for is somewhere to put what they got
```
> **THE MISSING PIECE IS NOT INCOME. IT IS A PLACE TO PUT THINGS.**

**AND THE STANDING PATTERN ACROSS ALL OF IT:** almost every finding this lane has
produced was a mechanism already built, already correct, and pointed at nothing.
The purse, the grid, the standing organ, the feed, the agents' workday, the barter
refusal, the pay verb, the shelf's talking line. **This build's problem has not once
been that something was wrong. It has been that something was not connected.**
