# THE ONE THING THIS LANE GOT BUILT AND GOT WRONG

ECONOMY lane, 9/16/26. Queue still empty (44 of 44 SHIPPED, 0 OPEN, 0 CLAIMED).
MODE: RESEARCH. No engine code touched.

**No job was invented.** The board has no OPEN line for ECONOMY and rule 10 says only the
coordinator adds them. What this round did is the one thing that is unambiguously this
lane's own work: **a shipped record of mine turned out to be wrong in play, and the records
are this lane's only product.** A record that misleads the next reader is a defect in my
output, and fixing it is not a new job, it is finishing an old one.

---

## 1. WHAT HAPPENED

He played the game. WORLD had built round 38's deliverable — **the insider pays one, the
stranger pays the street** — and the coordinator killed it on 9/15
(`records/BOHEMIA_RULING_SIX_DEFAULTS_AFTER_HIS_SECOND_PLAY_9_15_26.md`, ruling 1):

> *"WORLD `[two prices]` built my 9/13 shape (the insider pays one, the stranger pays the
> street), and **it broke the tutorial: the first bag of rice cost two days' work**, which
> is the loop `[rice clock]` exists to close in the first five minutes. So the surcharge is
> DEAD… **Everything costs one, everywhere, for everyone; WHO GETS TO BUY is the game.**"*

**The ruling is right, and the re-aim is better than what I delivered:**

> *"The spread a real crash has lives here in **ACCESS and DISTANCE, not in the number**: a
> stranger sees a shorter shelf (the camp's 4 of 11 goods, already built), can be refused,
> or is asked for goods instead of a battery, and the far market costs the day it takes to
> walk there."*

---

## 2. *** AND ROUND 38 ALREADY SAID THAT. ***

This is the part worth keeping.

`records/BOHEMIA_ECONOMY_DAY_38_ONE_IS_THE_OLD_PRICE_AND_THE_DOOR_IS_A_PERSON_9_13_26.md`
line 59, a section heading I wrote:

> ### **THE DOOR ALREADY EXISTS, AND IT IS THE SHELF, NOT THE PRICE**

With the table under it, measured off `goodsFor(tier, goods)`:

    fortress   11 of 11 goods
    town        8 of 11
    camp        4 of 11   -- the missing seven are ABSENT, not dearer

And then, at line 237, the deliverable I handed WORLD:

> *"…and quote the street multiple to everybody else — **between 2 and 5, never a
> fraction**…"*

**The same document contains the right answer and the wrong one, and the wrong one is the
half that got built.**

---

## 3. THE ROOT CAUSE, AND IT IS MINE

**I had the mechanism and shipped the number anyway.**

The row asked *"what a PLAYER would have to hold or be to buy at the old price"*. I
measured that the door was the shelf — access — and wrote it down as a heading. Then the
deliverable followed the word **price** in the row instead of the table in my own section
1, because a number is a cleaner thing to hand another lane than "the shelf is already
shorter over there."

**A lane that measures the right thing and then delivers the convenient thing has not done
research, it has done decoration.**

The discipline this adds to the seven this lane already carries: **when the measurement and
the row's framing disagree, the measurement wins, and the deliverable says so out loud.**
Round 38 could have opened its section 3 with *"the row says price and the answer is not a
price"* — which is exactly what rounds 39, 41, 42 and 44 each did later, and every one of
those four has held up.

---

## 4. WHAT WAS CHANGED, AND WHAT WAS NOT

**Changed, both in place, both keeping the original text underneath:**

- `records/BOHEMIA_ECONOMY_DAY_38_ONE_IS_THE_OLD_PRICE_AND_THE_DOOR_IS_A_PERSON_9_13_26.md`
  — an amendment banner at the top. **Sections 0, 1 and 2
  stand entirely**: the five real doors, four of them a person; Zimbabwe's coupon becoming
  the money; `goodsFor` as a door already built; ONE as the controlled price. **Withdrawn:
  the street multiple, everywhere it appears in section 3 and section 5.**
- `records/BOHEMIA_ECONOMY_MASTER_WHAT_FORTY_FOUR_ROUNDS_FOUND_9_15_26.md`
  — the same banner, pillar three re-aimed, and the
  surcharge row in the numbers table struck through.

**Not changed:** nothing else, in any record. **One correction out of forty-four rounds,
and the lane's own file contained the right answer the whole time.** That is the honest
scoreboard and it should be read both ways.

---

## 5. WHAT THIS DOES AND DOES NOT ASK FOR

- It asks for **nothing**. Ruling 1 already re-aimed `[two prices]` and WORLD owns it.
- Pending 40 (*"is ONE the price for the person who is in?"*) is **answered and closed by
  ruling 1**: it is not. ONE is the price for everyone, and being known buys you **access**,
  not a discount. The pendings list is updated in the handoff.
- **Ruling 3 of the same file confirms round 44 wholesale** and turns it into a QUESTS row,
  `[light the pump]`: *"the first thing a player does in act one is walk to the dark pump
  and light it, for one battery."* Two rounds tested, one corrected, one adopted.

---

## 6. THE GATE NOTE

**Pre-push pass**: economy, purse, payday, attempt, canon rot, demo blockers, language,
handoff. Results in the commit.
**Full suite: 107 red at `ad23d875`, mine are: none, measured.**

**The project-level hole, round 30 of naming it, and this time it caught me rather than the
code.** The gates check that a part does what it says. **Nothing checks that a record's
deliverable follows from its own measurements** — round 38 was internally contradictory
from the day it shipped, every gate was green, and it took him playing the game to find it.

---

## 7. AND THE GATE CAUGHT ME WRITING THIS ONE

First draft of this record cited its own subjects as `BOHEMIA_ECONOMY_DAY_38_...md` with an
ellipsis, three times. **CANON ROT went red, 12 pass / 1 fail: truly-gone citations 81
against a ceiling of 80.** Proved it was mine rather than assuming it: stashed the work and
re-ran on clean HEAD, which came back **13 pass / 0 fail at 80 gone**.

A shortened filename reads to a person as "you know the one" and reads to the sweep as **a
citation of a file that does not exist** — which is precisely the rot this gate exists to
catch, written into a record whose whole subject is a record that misled its reader. Full
paths now, and the gate is green.

---

*ECONOMY. Research only. Nothing in the game changed by this file.*
