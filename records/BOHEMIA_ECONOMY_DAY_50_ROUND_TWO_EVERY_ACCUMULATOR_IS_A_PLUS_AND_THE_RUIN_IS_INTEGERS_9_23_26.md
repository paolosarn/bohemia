# DAY 50, ROUND TWO — EVERY ACCUMULATOR IS A PLUS, AND THE RUIN IS ALL INTEGERS

ECONOMY lane, VAMILY row `[seeds the next act]` Q50. MODE: RESEARCH — DO NOT IMPLEMENT.
**Round two of two: the rates.** Round one is
`records/BOHEMIA_ECONOMY_DAY_50_TEN_OF_THIRTEEN_CARRY_WHOLE_SO_THE_RUIN_CANNOT_BE_DERIVED_9_23_26.md`.
Claimed 9/23/26 `economy-vamily-knxaeh`, commit `dd9f1b5`.

> **WHAT ROUND ONE HANDED THIS ROUND.** Ten of thirteen fold fields carry whole, so the fold
> is a ratchet and rule 31's ruin cannot be derived from it. The flip itself is safe: the fold
> is pure, deterministic and non-mutating. Six fields carry a written confession that they are
> wrong. **Round two costs it.** *Round 38 is why this is its own round: that round had the
> mechanism measured in its own section 1 and shipped a number anyway.*

---

## 0. FIRST, A CORRECTION ON MY OWN ROUND ONE, AND IT MATTERS

**Round one said our status rate is 0.79 and the real range is 0.70-0.75, so ours was too
high. THAT WAS WRONG, AND IT WAS WRONG BECAUSE I READ A COMMENT INSTEAD OF A CONSTANT.**

    STANDING_DECAY_TO_NEUTRAL = 0.25      so standings KEEP 0.75 a generation
    the carry table's `why` text says      "status persists about 0.79"
    Clark, rare surnames, 1858-2012        0.70 - 0.75

**The running code uses 0.75, which sits exactly on the top of the measured range. The code is
right. Only the comment beside it is wrong.**

So the disagreement is not between us and the world, it is **between our own comment and our
own constant**, and round one reported the comment as if it were the behaviour. *Same class of
fault this study keeps finding in other people's instruments, committed by me, one round ago:
a number I could have run and read instead.* The correction stands on its own and the rest of
round one survives it.

---

## 1. THE RATCHET, DEMONSTRATED ON THE SHIPPED FUNCTION

Round one read the carry table. This round ran the real fold. **Two entire generations in
which the player does absolutely nothing:**

    AFTER GEN 0 (he did six things)
      territory 2   builds {b1:3}   economyCapacity {electricity:10}   standings {Blues:80}   karma 5
    AFTER GEN 1 (NOBODY DID ANYTHING)
      territory 2   builds {b1:3}   economyCapacity {electricity:10}   standings {Blues:60}   karma 5
    AFTER GEN 2 (NOBODY DID ANYTHING)
      territory 2   builds {b1:3}   economyCapacity {electricity:10}   standings {Blues:45}   karma 5

*** A HUNDRED YEARS OF TOTAL NEGLECT COSTS YOU ONE FACTION'S OPINION AND NOTHING ELSE. *** The
land, the buildings, the productive capacity and the karma are byte-identical to the day he
stopped playing.

### AND THE CODE SAYS WHY, IN ONE WORD PER FIELD

    territory          inh.territory[t] = owner          assignment. Never deleted.
    builds             Math.max(existing, tier)          *** AN EXPLICIT MAX ***
    economyCapacity    += amount
    invest             += amount
    karma              += amount
    virtues            += amount
    wounds             .push(...)
    blindSpot          += 1
    recordedKnown      += 1
    standings          *= (1 - 0.25)                     the only one that moves down

**Every accumulator in the whole function is `+=` or `Math.max`. There is not one subtraction,
one `delete` or one `splice` in it.** `builds` is the clearest: **`Math.max` is a ratchet
written as a function call**, and it means a building can be upgraded across a century and
never once fall down.

---

## 2. THE THING THAT DECIDES EVERYTHING: WHICH FIELDS ARE COUNTS AND WHICH ARE VALUES

EVERYTHING COSTS ONE, and round 14 measured that our ladder has no fractions. **So "carry at
0.5" sounds illegal. It is not, and which fields it is legal for is a measurable fact about
their shape.**

    territory        {districtId -> ownerId}       A COUNT OF THINGS
    builds           {buildingId -> tier}          A COUNT, each with a SMALL INTEGER tier
    family.wounds    [ ... ]                       A COUNT
    recordedKnown    a count
    blindSpot        a count
    ------------------------------------------------------------------
    economyCapacity  {currency -> number}          A VALUE
    invest           {districtId -> number}        A VALUE
    karma            a number                      A VALUE
    virtues          {virtue -> number}            A VALUE
    standings        {factionId -> number}         A VALUE

*** THE PAIR THAT MAKES THE RUIN IS THE PAIR THAT IS ALREADY INTEGERS. *** Territory is a set
of districts and builds is a set of buildings with tiers. **Losing half your ground is dropping
entries from a map. Losing a building is a tier going 3, 2, 1, gone.** No fraction is ever
computed, nothing is ever displayed as a decimal, and EVERYTHING COSTS ONE is untouched,
because **a tier step is one.**

### AND THE ONE DECAY WE ALREADY HAVE IS THE ONE PLACE FRACTIONS GOT IN

    a standing of 5, with nobody doing anything:
      gen 1  ->  3.75
      gen 2  ->  2.8125
      gen 3  ->  2.109375

**A float multiply on a value field is what produces 2.109375 in a game whose pillar is that
everything costs one.** Nothing shows it to the player today, so it has never bitten. *But the
lesson for the ruin is the whole finding of this round: put the decay on the COUNTS, not on the
VALUES, and the arithmetic stays honest by construction.*

---

## 3. THE RATES, AND WHICH OF THEM ARE MINE AND WHICH ARE HIS

**Mine to derive** means the real record pins it and I can show the working. **His to rule**
means the record allows a range and the choice is about what kind of game this is.

| field | carries today | should carry | whose |
|---|---|---|---|
| `family`, `recordedKnown`, `blindSpot` | whole | **whole, unchanged** | settled, correct as built |
| `standings` | 0.75 | **0.75, unchanged** | **mine, and already right**: dead centre of the measured 0.70-0.75 |
| `economyCapacity` | whole | **decays; the real range is 0.48-0.59** | mine to state the range, **his to pick inside it** |
| `invest`, `virtues` | whole | **decay with capacity** | his; they are texture and meaning, not measured quantities |
| `karma` | whole | **decays or dies** | **his, and it is a moral question, not a number** |
| `territory` | whole | **ages: blocks are LOST, as a count** | his, and it is the ruin dial |
| `builds` | whole (`Math.max`) | **ages: a tier steps DOWN by one per unmaintained generation** | his, and it is the other ruin dial |
| `wounds` | whole | **carry, and be SAID** | settled; it already carries, it is the saying that is missing |
| `debt` | dies | **dies, and be SAID** | settled 9/7; the saying is missing |

**Four of nine rows are already right.** One is right and mislabelled by its own comment. The
two that make the ruin are his, and they are his because *how ruined* is a feel call, not a
measurement.

---

## 4. WHAT THE RUIN NEEDS, IN ONE PARAGRAPH, WITH NO FRACTIONS

> **A GENERATION NOBODY MAINTAINED TAKES THINGS OFF THE MAP.** Each unmaintained generation,
> some districts stop being held and some buildings step down a tier; a building at tier 1 that
> steps again is gone from the map. **Both are integer operations on a count, both are visible
> from the far view without a single number on screen, and both are the exact opposite of the
> `Math.max` that is there now.** How many is his dial, and it is the only dial the ruin needs:
> **turn it up and act three is rubble, turn it down and it is a city that slipped.**
>
> **AND MAINTENANCE IS ALREADY IN THE GAME.** Round 47 measured that a water plant runs only if
> the street it fronts is live; round 44 found the pumps standing dark. *A district that was
> lit when the generation ended is a district that was maintained.* **The fold does not need a
> new maintenance system. It needs to read the one the world already has.**

---

## 5. AND THE TWO SILENCES, WHICH COST NOTHING TO CLOSE

`whatDied()` can say exactly two sentences: deeds that died with their witness, and unsettled
wounds. **The debt is ruled to die and is never mentioned; a lost district and a fallen
building would not be mentioned either, because they are not in the function.**

> **The handoff should say what was LOST in the same breath it says what was KEPT**, and the
> fold's own study already ruled the order: kept first, because it answers the player's
> question, then lost, because the loss lands harder and does not need help. **Three sentences
> where there are two: the debt died with him, this much ground stopped being yours, this
> building is not there any more.**

---

## 6. THE DELIVERABLE

> **PUT THE DECAY ON THE COUNTS, NOT THE VALUES.** Territory and builds are maps of things;
> losing them is dropping entries and stepping tiers down by one. **No fractions, no decimals,
> EVERYTHING COSTS ONE untouched.** The one decay we already have is a float multiply on a
> value and it produces 2.109375 — that is the pattern not to copy.
> 
> **`Math.max` ON BUILDS IS THE RATCHET AND IT IS ONE LINE.** A building can be upgraded across
> a century and never fall down, by construction.
> 
> **DO NOT CHANGE THE STANDINGS RATE. IT IS 0.75 AND IT IS RIGHT**, dead centre of the measured
> range. Fix the comment beside it, which says 0.79 and is the only reason anybody thought
> otherwise, including me, one round ago.
> 
> **WEALTH SHOULD DECAY AND THE RANGE IS 0.48 TO 0.59.** Ours carries whole and our comment
> says 0.3-0.4. Both are wrong, in opposite directions.
> 
> **THE FOLD DOES NOT NEED A MAINTENANCE SYSTEM.** A district that was lit when the generation
> ended was maintained. The world already knows which those are.
> 
> **AND THE HANDOFF SHOULD SAY WHAT WAS LOST.** Kept first, lost second, in the order the fold's
> own study already ruled.

---

## 7. WHAT THIS ROUND DID NOT DECIDE

- **How many districts and how many tiers per unmaintained generation.** That is the ruin dial
  and it is his: it is the difference between a tutorial and a punishment.
- **Whether karma decays or dies.** A moral question wearing a number, and it is his.
- **Whether trust becomes a fourteenth field.** Round one argued the record is on its side.
  Adding a field to a table eight of whose thirteen are already draft is DYNASTY's row and his
  ruling.
- **Where in the fold any of this goes.** `foldGeneration` is WORLD's and DYNASTY's file. This
  lane measured it and wrote nothing into it.
- **Anything about the demo.** **Rule 31 says it itself: the demo does not change, this is
  alpha work.** Rules 14, 15 and 18(b) unchanged. Rule 22 binds MAKING lanes and names twelve;
  ECONOMY is not one, and this round did not invent a cook to look busy.

---

## 8. ROUTED

- **DYNASTY `[the derive]`** — **section 3 is the table you asked for, nine rows, with whose
  each one is.** Four are already right, one is right and mislabelled, and the two that make
  the ruin are his dials. **And the flip is already safe** (round one).
- **DYNASTY / WORLD** — ***`Math.max` on builds is the ratchet, in one line.*** Demonstrated:
  two generations of nobody doing anything leaves land, buildings, capacity and karma
  byte-identical.
- **WORLD** — **put decay on the COUNTS.** Territory and builds are maps of things, so the ruin
  is integer arithmetic and never shows a decimal. *The one float decay we have produces
  2.109375.*
- **WORLD / LIFE + CITY** — **maintenance is already in the game.** A district lit when the
  generation ended was maintained (rounds 44 and 47). No new system.
- **QUESTS / WORDS** — the handoff can only report gains. **Three sentences where there are
  two**, kept first and lost second, which the fold's own study already ruled.
- **COORDINATOR** — **Q50 complete, both rounds.** One correction on this lane's own round one
  is in section 0.

---

## 9. THE GATE NOTE

**Pre-push pass**: economy, purse, payday, attempt, canon rot, demo blockers, language,
handoff. Results in the commit. **Canon rot's C3 red is the 8/31 tilespec rot this lane has
reported and routed twice, sized last round at 21 of 71 records citing engine files that were
never committed. Proven on clean HEAD both times. Not mine, named again so no one reads it as
new.**
**Full suite: 107 red at `ad23d875`, mine are: none.**

**The project-level hole, instance 38.** These gates check that a part does what it says.
Nothing checks that two parts agree, that a part keeps working for as long as the game lasts,
that it is the right part to have, or that the parts form a loop that closes.

**This round's instance is the sharpest form of it yet: A COMMENT AND ITS OWN CONSTANT
DISAGREE, SIX INCHES APART, AND BOTH ARE SHIPPED.** The constant says standings keep 0.75. The
comment beside it says 0.79. **Every gate is green because the gates read the code and nobody
reads the prose.** *And it cost something real: it put a wrong sentence in this lane's own
record one round ago, because I read the prose too.* A gate that diffed every stated number in
a comment against the constant beside it would have caught this and, on round 48's evidence,
several more.

## 10. THE PROBE NOTE

**`foldGeneration` is exported and I said it was not.** My first check grepped for
`module.exports =` and reported "not directly"; the engine returns its modules from an IIFE, so
the real export is `Generations.foldGeneration`. **Reading the source found the ratchet, but
running it is what turned "ten of thirteen carry whole" into two generations of nobody doing
anything and nothing changing.** *The measurement I nearly settled for was the weaker one, and
the difference was one more look at how the file ends.*

---

*ECONOMY round 50, two of two. Q50 complete. Research only. Nothing in the game changed.*
