# DYNASTY STUDY -- ROUND 6 (Q6): THE TIME SKIP
# (DYNASTY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# VAMILY row: DYNASTY Q6 [time skip], "The time skip. How to jump ten years and
# make the player feel it; what the best games do at a cut like ours (the match
# cut at the table)."
# Rounds 1-5: records/BOHEMIA_DYNASTY_DAY_1..5_*.md
# Game titles appear in SOURCES only, never in the design, and never attached to
# a department they do not own (the 8/28 law as amended 9/5).

## 1. THE REAL AISLE -- A DECADE IS A CAST CHANGE, NOT A SET CHANGE
The thing a ten-year gap actually does to a place is not architectural.
> **IF ABOUT HALF OF A NEIGHBOURHOOD'S RENTERS MOVE EVERY TWO YEARS, THE CHANCE
> THAT ANY GIVEN ONE OF THEM IS STILL THERE IN TEN YEARS IS ABOUT THREE
> PERCENT.**
The buildings are almost all still standing. Ninety-seven percent of the people
you knew are gone. And when researchers ask long-term residents what changed,
the themes that come back are **institutional decline, safety, and who lives
here now** -- not the look of the street. Income can move enormously inside a
decade (one documented neighbourhood went from about $40,750 to about $103,339
in ten years) without the frontages changing much at all.
So the honest content of a time skip is: **same rooms, different people, and the
things that held the place together have quietly stopped working.**

## 2. *** THE ONE SENTENCE ***
> **A TIME SKIP IN GAMES IS AN ART JOB. IN LIFE IT IS A CAST CHANGE. THE ROOM
> STAYS AND THE PEOPLE GO.**
Which means the cheapest true version of our fold is not a repaint. It is
walking back into somewhere you know and finding that **nobody in it knows you.**

## 3. THE GAMES AISLE -- AND IT DOES THE OPPOSITE, ON PURPOSE
The technique the craft converges on at a jump is environmental: apply decay,
collapse and overgrowth to familiar rooms, swap clean textures for dirty ones,
close routes, remove objects, change the world map. It works, it is legible in
one frame, and it is why players remember those moments.
**But it is the half that is cheap to fake and the wrong half in our setting.**
Our valley is already ten years cold. A repaint of a ruin is a repaint of a
ruin. And the craft's own second note is the one nobody budgets for: NPCs should
have changed too, should be independent actors with their own schedules rather
than signposts waiting for you.
**The place is the part games do. The people are the part games promise.**

## 4. OUR OWN LAW ALREADY RULES HALF OF THIS, AND IT WAS NOT WRITTEN FOR THE FOLD
TEN YEARS COLD (7/31, LOCKED) is about the crash, not the fold, but its first
clause generalises exactly:
> *"The crash is not a thing the player watches, survives, or manages... no
> surface, ever, simulates the crash HAPPENING. No devaluation curve ticking
> down... That is a documentary about ten years ago, and the player was not
> there."*
Applied to the generational cut, unchanged: **DO NOT PLAY THE TEN YEARS.** No
montage of the decade, no summary reel, no numbers ticking forward. His own
ruling about the backstory is the ruling about the gap, and it means the whole
weight of the cut lands on the first ten minutes AFTER it, which is Q12's row.

## 5. THE MEASUREMENT -- BOTH HALVES ARE MISSING, AND WE HAVE TWO MEMORIES
- **NOTHING REPLACES OR AGES OUT THE POPULATION AT A GENERATION BOUNDARY.** No
  cohort turnover, no repopulation, no per-act population anywhere in the
  engine. *(Positive control: the word "cohort" appears in exactly one place in
  the engine, and it is the comment REFUSING to build a birth-year cohort
  generator.)* So at our fold, one hundred percent of the cast survives, against
  a measured real figure near three.
- **AND THE CITY CAN ONLY GET NICER.** Round 4 measured `districtTexture`
  reading an `invest` number that only ever accumulates: apocalypse to
  recovering to modern, one way, never back. So our time skip cannot even do the
  environmental half that the craft says is the easy half.
- *** WE HAVE TWO SEPARATE MEMORY SYSTEMS AND THEY HAVE NEVER MET. ***
```
  THE FOLD          engine/bohemia_engine.js
                    standings: factionId -> a number
                    decays 25% per generation
  THE WITNESS WEB   engine/bohemia_standing.js + bohemia_memory.js
                    a deed is WITNESSED, told person to person, distorts as it
                    travels; clarity = 0.5^(age/halflife)
```
  **`bohemia_engine.js` references `bohemia_standing` ZERO times.** So at the
  generational cut, the fold ages an abstract faction number by a quarter, and
  the organ that actually models people remembering and forgetting **is not
  advanced at all.**
- **NOTHING DRIVES THE WITNESS WEB FORWARD ACROSS A GAP.** There is no
  `advanceYears`, no `generationPass`, no call that moves it ten or thirty years.
  Its own comment already knows what should happen -- *"Thirty years pass. EVERY
  PERSON WHO WATCHED YOU DO ANYTHING IS DEAD... A QUIET GOOD DEED DIES WITH THE
  WITNESS. A NOTORIOUS ONE BECOMES THE THING YOUR CHILD IS JUDGED FOR"* -- and
  **nothing calls it.**

## 6. *** THE FINDING THAT PROVES US WRONG ***
### WE HAVE THE TIME SKIP ALREADY WRITTEN DOWN AND IT IS IN THE WRONG FILE
The thing that makes a decade land is that the people are gone and the ones left
have a distorted second-hand version of you. **We built that organ, it is good,
its own comments describe exactly the scene our fold needs, and the machine that
performs the generational cut has never heard of it.**
This is the fourth round running on the same shape and it is now the lane's
finding rather than a coincidence:
```
round 1  the material exists and never reaches the player
round 2  both halves of the coyote's life shipped as unrelated tiers
round 5  the ageing curve, running on memories instead of on bodies
round 6  the memory of a person, and the fold that cannot see it
```
> **WE DO NOT HAVE A CONTENT PROBLEM. WE HAVE A WIRING PROBLEM, AND IT IS ALWAYS
> THE SAME WIRE: THE ORGAN AND THE MOMENT THAT NEEDS IT ARE IN DIFFERENT FILES.**
### AND THE SECOND HALF, WHICH IS ABOUT TASTE
Our instinct for a time skip would be the craft's instinct: change how the city
looks. Round 4 already proved we cannot, and section 1 says we should not want
to. **The valley has been a ruin for ten years and will be a ruin for a hundred.
Nothing about our setting makes a repaint meaningful.** What is meaningful here
is walking into a place you own, that looks identical, where three people in a
hundred still know your face.

## 7. WHAT WE TAKE AND WHAT WE REFUSE
**TAKE**
- **The cast change as the content of the cut.** Same rooms, different people.
  Cheap in art, expensive in nothing, and it is the true one.
- **Advance the witness web across the gap.** That is the one wire. Its own
  comment already specifies the behaviour and the decay maths already exists.
- **Institutions, safety, and who lives here** as what changed, because those
  are what real residents actually name.
- **DO NOT PLAY THE TEN YEARS.** His own TEN YEARS COLD clause 1, applied to
  the fold. The cut is a cut.
- **Three in a hundred** as the shape of what survives socially, not as a
  number to ship. The point is that it is nearly nobody, and how near is his.
**REFUSE**
- **A decade montage or a summary reel.** Banned by the law above, and it is
  also the documentary about ten years ago that he already rejected once.
- **Re-texturing the ruin.** Round 4 says we mechanically cannot and section 1
  says it would not mean anything if we could.
- **Keeping the whole cast.** Which is what the fold does today, at 100%.
- **A second memory system to make this work.** There are already two and that
  is the problem. ENGINE SYNC: the fold should read the organ we have.
- **Numbers about the gap on screen.** No years elapsed counter, no ages.
  Round 5 and the PEOPLE lane both landed on beats rather than dates.

## 8. ROUTED (proposals for the coordinator -- only the coordinator adds jobs)
- **WORLD or RUN -- THE-FOLD-READS-THE-WITNESS-WEB.** One wire: the generational
  cut advances the deed and memory organ instead of only decaying a faction
  number. Nothing new is authored; the behaviour is already written in that
  module's own comments. This is the biggest single item this lane has produced.
- **QUESTS (PARKED) -- THE-FOLD-IN-THE-RUNTIME** already exists as an OPEN row
  and section 4 is now its rule: do not play the ten years.
- **WORLD -- THE-FOLD-CARRIES-THE-WRONG-THINGS** (rounds 3, 4, 5) is unchanged.
  This round adds a separate wiring row rather than growing that one further.
- **DYNASTY (this lane).** Q12 [heir's hour] now carries the whole weight of the
  cut, because section 4 forbids spending any of it on the gap itself.

## 9. CONFIDENCE
- Section 5, every count, the zero references between the two modules, the
  absence of any cohort turnover, and the cohort control: **MEASURED** today.
- The quoted comments from bohemia_standing.js and TEN YEARS COLD:
  **QUOTED VERBATIM** from the repo.
- The three-percent-after-ten-years figure: it is an ARITHMETIC CONSEQUENCE the
  source draws from a stated turnover rate, not a direct measurement of a
  cohort. The underlying claim (neighbourhood populations turn over far faster
  than people assume) is well supported; the exact 3% is a worked illustration.
  **MEDIUM-HIGH on the direction, MEDIUM on the number**, and section 7 uses it
  as a shape rather than a value.
- Resident perceptions clustering on institutions, safety and who lives here:
  from qualitative work on a declining city. **MEDIUM-HIGH**, and it is one
  city's residents.
- The income figure: a single illustrative neighbourhood, quoted as an example.
  **LOW as a generalisation**, and used only to say that a decade can move a
  lot without changing frontages.
- The craft's environmental technique at a jump: developer and press writing,
  consistent across sources. **HIGH** that this is what games do; it is a
  description of practice, not a claim about what is best.
- Sections 2, 6, 7 and 8: **MY ARGUMENT AND MY ROUTING.**

## SOURCES
NAMED AS RULERS, NOT AS REFERENCES, AND NONE OF THEM IS A REFERENCE GAME FOR ANY
DEPARTMENT. REAL AISLE: urban-research writing on neighbourhood population
turnover and the probability of a renter remaining after ten years; qualitative
work on long-term residents' perceptions of neighbourhood change in a declining
US city; documented neighbourhood income change over a decade. GAMES AISLE:
developer and press accounts of environmental technique at a time skip (decay,
collapse, overgrowth, dirtier textures, closed routes) and design writing on NPC
schedules and NPCs as independent actors, read for the shape of the practice
only. IN-REPO: engine/bohemia_engine.js (`foldGeneration`, `standings`,
`STANDING_DECAY_TO_NEUTRAL`, and its zero references to the standing module);
engine/bohemia_standing.js (the four rules, deed decay, the thirty-years
comment); engine/bohemia_memory.js (`clarity`, `halflife`);
engine/bohemia_people.js (the cohort refusal);
laws/BOHEMIA_ADDENDUM_TEN_YEARS_COLD_7_31_26.md clause 1; and rounds 1-5 of
this study.
