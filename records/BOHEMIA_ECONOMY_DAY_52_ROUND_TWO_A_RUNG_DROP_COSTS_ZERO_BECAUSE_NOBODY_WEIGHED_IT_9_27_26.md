# ECONOMY -- ROUND 52 ROUND TWO, [bb money] THE-COMPANY-LEDGER, ROUND TWO OF TWO
# 9/27/26. MODE: RESEARCH -- NOTHING IN THIS FILE IS IMPLEMENTED.
# Board row: VAMILY.md, economy-vamily-knxaeh. Round one:
# records/BOHEMIA_ECONOMY_DAY_52_THE_SAME_COMMIT_WROTE_THE_LOOP_AND_LEFT_THE_DAY_FLAT_9_27_26.md

WHAT ROUND TWO OWED, FROM MY OWN HANDOFF, VERBATIM:

  "(a) WHAT A RUNG DROP COSTS in our own numbers, measured off bohemia_standing / the
   rungs, because that is the punishment this lane argued for instead of desertion, and
   (b) the two ends connected on paper: what somebody lends you a night IS what a night
   of somebody's time costs, so the loan and the wage are one number seen from two sides."

THE HEADLINE: (a) a rung drop costs exactly ZERO right now, and it is not a guess, it is
a number I got by loading the real 42-file quest corpus and running the real function.
(b) needed no new number at all -- the loan and the day's wage are already the same
constant, in the same currency, and have been since two different rounds shipped it.

===========================================================================
0. WHAT I GOT WRONG THIS ROUND, CAUGHT BEFORE IT WAS PUBLISHED
===========================================================================
Fourth round running for the same shape, and worth naming precisely because THIS TIME
I ran real code and still got the wrong table. I wrote a regex to pull DEED_WEIGHT's
rows straight out of engine/bohemia_standing.js's source text:

    var m = src.match(/var DEED_WEIGHT=\{([\s\S]*?)\n  \};/);

DEED_WEIGHT is declared `var DEED_WEIGHT={};` -- empty, on one line, no newline before
its closing brace. My regex requires a newline before `};`, so it silently skipped past
the real declaration and matched the NEXT thing in the file shaped like a multi-line
object literal, which is `var LOUDER={...}` (the rumour-growth table, six rows: favour,
claim:met, spared, claim:refused, loan:short, pushed_the_price). I printed "DEED_WEIGHT
row count 6" and "has loan:short? true" and both were about a completely different
table.

CAUGHT BY RUNNING THE MECHANISM ITSELF RATHER THAN TRUSTING THE PARSE: I called
`S.witness()` then `S.opinionOf()` for a real 'loan:short' deed and got 0 back, which
does not match "loan:short has a weight". That contradiction is what sent me back to
read the source by eye instead of by regex, where `var DEED_WEIGHT={};` is sitting in
plain text with nothing to misread.

THE RULE FROM LAST ROUND HELD FOR HALF THE JOB AND NOT THE OTHER HALF. "A grep is not
a measurement" stopped me from trusting a string search. It did not stop me from
trusting a REGEX CAPTURE, which is the same failure wearing a lab coat. The fix I am
actually shipping this round: when a captured value and a RUN value disagree, the run
wins, always, and the disagreement itself is worth writing down rather than silently
picking the run and deleting the confusion. That is why this section exists.

===========================================================================
1. WHAT THE REPO DOES TODAY -- MEASURED, THE REAL CORPUS LOADED, PASTED VERBATIM
===========================================================================
Probe: scratchpad p4.js, loading all 42 files in quests/bq/*.bq through
engine/bohemia_deeds.js's real loadCorpus(), the only function in the codebase that
writes into bohemia_standing.js's DEED_WEIGHT. Output, unedited:

    quest files scanned      42
    deeds found in corpus    83
    DEED_WEIGHT row count    83
    sample keys              q:bq_a03_the_faction_that_died:30@NONE, q:bq_meter_reader:31@TRADES, ...
    divisor / maxAbs         10 20 rungStep 2
    weight of loan:short     = undefined
    weight of claim:met      = undefined
    weight of claim:refused  = undefined
    weight of commit         = undefined
    weight of favour         = undefined
    opinion after ONE miss, REAL corpus loaded -> 0 NEUTRAL

THIS CONFIRMS WORLD'S OWN FINDING FROM 9/12 (1ffb2d2c, [someone lends]) EXACTLY, TO THE
ROW COUNT: 83 rows, every one shaped q:<quest>:<stage>@<FACTION>, and NONE of the five
city-published deed kinds (loan:short, claim:met, claim:refused, commit, favour) has an
entry. WORLD already named this and already ROUTED it, in bohemia_lend.js's own
placeholders():

    { where: 'bohemia_standing.DEED_WEIGHT[loan:short]', value: null, placeholder: true,
      law: 'MECHANISM-MINE / CONTENTS-PAOLO'S',
      what: 'what a missed night does to how they feel about you ... ROUTED rather
             than patched with a number invented here' }

SO THE ANSWER TO "WHAT DOES A RUNG DROP COST" IS NOT A NEW MEASUREMENT, IT IS A
CONFIRMED ONE, RUN FRESH: ZERO. A player can go short every single night forever and
`opinionOf` returns 0 every time, because `forceOf` reads `if (w==null) return 0` before
it ever looks at the deed's age or how many times it happened. THE DEED IS WITNESSED
(bohemia_standing.witness returns 1, a real person saw it), IT IS REMEMBERED (it sits in
that person's `.deeds` array), AND IT IS RETOLD (gossip() will carry it, same as any
other deed) -- and it changes nothing about how that person feels, forever, because
nothing ever gave it a number to feel with.

### 1b. THE SCALE, IF IT WERE EVER GIVEN ONE (measured, not proposed)

RUNG_STEP is 2, computed from S.RUNGS' own boundaries (-3, -1, 1, 3: each gap is 2), and
it is not typed anywhere, it is derived at load from the same table rungFor() reads.

The corpus's OWN calibration ties directly to that number: `divisor = maxAbs / RUNG_STEP`
= 20 / 2 = 10. That means the single worst thing anybody has ever authored against a
faction in this game -- a -20 delta, `q:bq_dead_pool:32@Network` -- comes out to exactly
-2 once divided, which is EXACTLY ONE FULL RUNG STEP. That is not a coincidence, it is
what the divisor formula is FOR: the worst authored act in the whole corpus is worth
precisely one rung, by construction, so nothing in the quest corpus can move two rungs
in a single witnessed deed no matter how brutal the writing gets.

Read against that ceiling, the smallest real weight anywhere in the corpus is 0.3.
At that size:

    same-night misses at the smallest real weight needed to cross one rung: 4
    misses at the smallest real weight needed to cross one rung with room to spare: 7
    the deed's own half-life at that weight: 28.9 days
    the deed's own half-life at the single worst weight in the corpus: 54.3 days

So the mechanism's own arithmetic, with no number invented, already says what SHAPE an
honest weight for `loan:short` would have to take if Paolo ever rules one: FAR below the
worst-act ceiling of 2, because handing over one battery late is not the worst thing a
person in this valley has ever done to a faction. And because forceOf sums every
witnessed deed of a kind rather than remembering a running total, a small weight means
it takes SEVERAL misses, close together, before decay eats the older ones, to actually
tip a rung -- one bad night reads as noise, a pattern reads as a rung.

THIS IS NOT A RECOMMENDATION OF A NUMBER. WORLD already looked at exactly this gap and
declined to invent one, correctly, under MECHANISM-MINE / CONTENTS-PAOLO'S, and this
round agrees rather than re-opening it. What is new here is the SHAPE, derived entirely
from constants that already exist and are already his: RUNG_STEP from S.RUNGS, the
worst-deed ceiling from the corpus itself. Nothing above required a new number to state.

===========================================================================
2. PART (b) -- THE LOAN AND THE WAGE, CONNECTED, NO NEW NUMBER NEEDED
===========================================================================
Measured, three files, three separate rounds, never joined until now:

    engine/bohemia_purse.js:129   PAYOUT.COMPLETE = { electricity: 1, ... }
                                   "a day's work pays a battery"
    engine/bohemia_lend.js        HANDSHAKE = 1     (what one handshake hands over)
                                   DUE_A_NIGHT = 1   (what the night asks back)
                                   CURRENCY = 'electricity'

SAME NUMBER. SAME CURRENCY. Both are 1 battery of electricity, and they were written by
two different lanes nine days apart (bohemia_purse's payForWork shipped 9/7; bohemia_lend
shipped 9/12) without either citing the other.

READ TOGETHER, THAT IS THE ANSWER TO PART (b): what somebody hands you on a handshake is
exactly what a FULL DAY of anybody's labour is worth in this game, and what the night asks
back is that same day's wage, owed forward. From the LENDER'S side: giving you a battery
costs them what they would have earned working a whole day, so a handshake is not a small
thing, it is somebody's entire day, in advance, on your word. From the BORROWER'S side:
paying it back costs exactly what tomorrow's own labour would earn, so squaring up is
never a fraction of a day's work, it is precisely one -- the loan and the wage are the same
battery, seen from two hands.

THIS IS ALREADY TRUE. It did not need building and it does not need a ruling: EVERYTHING
COSTS ONE (8/15) already forced both numbers to 1 in the same currency, so the symmetry
exists by construction, the same way round 49 found that a day of work, a day of food and
a night's loan payment were already "exactly one short" of each other without anybody
designing it that way on purpose. That round found the gap; this one finds the two
numbers on either side of a different gap are identical.

===========================================================================
3. THE REAL WORLD
===========================================================================
### 3a. THE INTEREST-FREE PEER LOAN IS THE MAJORITY WORLD'S DEFAULT, NOT OURS

Tandas (Latin America), hui (Chinese communities), chamas (East Africa) are all names
for the same real mechanism: a ROSCA, a rotating group that lends interest-free among
people who already trust each other, memory and social pressure standing in for a
contract. Round 49 already measured the number that matters here -- 95.16% repaid,
interest-free, enforced by memory -- and bohemia_lend.js already builds exactly that
shape (HANDSHAKE, no INTEREST field, account clears on payment, short() only counts and
dates, never grows the number). Nothing in this round changes that; it is confirmation
that the module built two rounds ago is still the real-world default, not an outlier.

### 3b. AND GRAMEEN SAYS THE SANCTION IS NOT GRADUAL, IT IS A JUDGEMENT CALL

Grameen's peer groups do not punish a missed payment on sight. A member with a stated
reason -- illness, delayed income -- gets covered by the group; a member who VANISHES
WITHOUT EXPLANATION is the one who gets cut off. The group's own liability only
activates on the second case. Missed payments do drag down the WHOLE group's recovery
rate when they pile up (a 0.10 rise in a group's missed-payment rate costs about 0.007
off everybody's recovery), which is a real, measured drag from REPEATED misses, not a
single one.

THAT IS THE REAL-WORLD VERSION OF SECTION 1b's ARITHMETIC, ARRIVED AT FROM THE OTHER
DIRECTION. The mechanism's own numbers say a single small-weight miss should read as
noise and a pattern should read as a rung; Grameen's actual practice says the sanction
is reserved for the pattern (disappearing) and forgiven for the one-off (a stated
reason). Two different sources, same shape, and neither one required the other to say it.

===========================================================================
4. THE FINDING
===========================================================================
A RUNG DROP COSTS NOTHING TODAY, MEASURED WITH THE REAL CORPUS LOADED, NOT ASSUMED.
`bohemia_standing.DEED_WEIGHT['loan:short']` does not exist; WORLD found this on 9/12 and
routed it correctly; this round reran it against the full 42-file corpus and it is still
true, to the row. Nothing this round found should unroute it or hand it a number.

WHAT THIS ROUND ADDS IS THE SHAPE THE NUMBER WOULD HAVE TO TAKE, MEASURED FROM
CONSTANTS THAT ARE ALREADY HIS: the mechanism's own worst-deed ceiling is exactly one
rung (RUNG_STEP=2, by the corpus's own divisor formula), a missed loan is nowhere near
that bad, and forceOf's summing-with-decay behaviour already means several misses close
together are what should move a rung, never one -- which is exactly the line Grameen's
real groups draw between a covered absence and an abandoned account.

AND THE LOAN AND THE WAGE NEEDED NO NEW WORK AT ALL: PAYOUT.COMPLETE and HANDSHAKE /
DUE_A_NIGHT are already the same constant, 1, in the same currency, electricity, shipped
by two different rounds nine days apart. The row asked for them to be "one number seen
from two sides" and they already are; this round's only job was to point at both files
at once and say so.

[bb money] IS COMPLETE, BOTH ROUNDS. Round one found that BB's per-town price spread is
illegal under EVERYTHING COSTS ONE and that the replacement is access and count, already
his own 9/15 ruling. Round two found that the punishment side of that same law -- what
happens when you cannot pay -- is currently silent rather than broken, and named the
shape a real weight would need without inventing the weight.

===========================================================================
5. WHAT THIS ROUND DID NOT MEASURE, SAID PLAINLY
===========================================================================
- Any actual number for DEED_WEIGHT['loan:short']. That is Paolo's, WORLD already
  routed it correctly, and this round agrees rather than reopening it.
- Whether the OTHER four missing city deeds (claim:met, claim:refused, commit, favour)
  should share one small weight or four different ones. Out of scope for this row.
- Whether `short()`'s own per-account counter (`r.short`, `r.lastShort`) should be the
  thing that feeds a future weight, rather than raw witness count. That is a real design
  question and it is WORLD's module, not this lane's to answer.

===========================================================================
6. ROUTED
===========================================================================
WORLD       nothing new to fix. Section 1 confirms your own 9/12 finding fresh against
            the full corpus and agrees with your decision not to invent the weight.
            Section 1b is offered only as the SHAPE a future weight should take, if you
            ever want it, derived from your own RUNG_STEP and the corpus's own divisor:
            far under 2, and built to need a pattern of misses rather than one.
PEOPLE      bohemia_obligation.js's whoWalks() stake (routed last round) and this
            round's finding are the same design question from two directions: if a
            person does not walk away when unpaid, WHAT DOES HAPPEN is exactly the rung
            question this round measured has no answer yet. Not ruled here.
COORDINATOR the fourth instance this project has of "a captured value and a run value
            disagreed and the run was right" -- see section 0. Worth a machine that
            diffs a regex capture against calling the real function, the same way
            canon_rot_gate.js diffs a citation against a real file.

===========================================================================
7. THE [bb ...] SCHOOL LINE (rule 33, every chat, continuously)
===========================================================================
[bb money] BB never has to answer "what happens if a mercenary lends another one a
battery," because there is no such mechanic in that game; every wage is the company's
to the roster, never person to person. Our loan is the opposite shape on purpose --
person to person, no interest, enforced by memory -- and this round found it is already
priced at exactly one day's wage on both ends, the one place our number and a Battle
Brothers number were never going to have anything to compare against, because BB simply
does not have this transaction.

===========================================================================
8. THE ANALOG HORROR LINE (rule 20h, every chat)
===========================================================================
A neighbour can miss the same night's payment for a year and the block will describe him
exactly the same way on day one and day three hundred, because the machine that is
supposed to notice was never given a number to notice with. He tells the same joke at the
same door every night he cannot pay, and it lands exactly as well every single time. THE
HORROR IS THE UNCHANGING FACE: nothing in this valley is capable of getting tired of him.

===========================================================================
9. NOT IN A TAB YET
===========================================================================
Everything in this record and round one's is research. Nothing here has been built. The
purse and the loan module are live in the demo's day loop, reachable by playing, but the
rung question this round answered has no surface anywhere, because the answer is that the
mechanism to weigh it does not exist yet.
