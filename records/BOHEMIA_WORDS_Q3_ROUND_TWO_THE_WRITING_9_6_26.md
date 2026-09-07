# WORDS Q3, ROUND TWO: THE WRITING
# VAMILY writing round, 9/6/26, lane WORDS (words-8dqrnq).
# MODE: SCHOOL THEN WRITE (Paolo 9/6, LOCKED). Round TWO of two.
# Round one: records/BOHEMIA_WORDS_Q3_SCHOOL_THE_FIRST_REPEAT_IS_A_FEATURE_9_6_26.md
#
# The mode requires this record to name WHICH FINDING from school changed the
# lines. That comes first.

## WHICH FINDINGS CHANGED THE LINES, AND HOW
Five, and the first one reverses what the row asked for.

**1. THE FIRST REPEAT IS A FEATURE, SO THE POOL HAS AN ANCHOR WRITTEN TO BE HEARD
TWENTY TIMES.** Liking rises with exposure before it falls: 208 studies at r = 0.26,
and the inverted U confirmed across 268 curve estimates. **The row asked how to
avoid repeating. The bank does not try to.** It contains one deliberately plain
line, "Queue starts back there", written so the ear has somewhere to land. Nothing
in the 9/4 round did that.

**2. PLAIN LINES SURVIVE REPETITION AND CLEVER ONES DO NOT, SO THE POOL IS A MIX BY
DURABILITY.** The peak moves with complexity, so the pool is three tiers: an anchor
built to be worn smooth, four body lines, and **exactly one rare line with a hard
cap.** And the rare line is rare precisely BECAUSE it is the best one. **A memorable
line is a liability.** That inversion is the change school made to how a pool is
shaped.

**3. CONTEXT IS WHERE VARIETY COMES FROM, NOT WORD COUNT.** The bank shows one shape
crossed with facts the game already computes: the hour, the weather, what the block
just did, who owns it, what the price did. **Six readings of one line, and none of
them is a new authored line in the sense that costs anything.** The answer to "how
many lines" is that the question is wrong: the count that matters is how many world
states a line can notice.

**4. SPACING BEATS VOLUME, AND THE BANK SHOWS BOTH MECHANISMS SIDE BY SIDE.** The
same words back to back on one street, which is satiation and is unforgivable,
against the same words an hour apart, which is the curve and is what we want.
**Identical text, opposite experience.**

**5. THE FIX IS THE SELECTOR, SO THE BANK SAYS SO OUT LOUD.** Every line is written
assuming a selector that remembers, and the section ends by naming that as its own
honest limit rather than pretending the writing solves it.

## THE CORRECTION THAT MATTERS MOST THIS ROUND
**THE 9/4 ROUND AND THE SCHOOL ROUND WERE LOOKING AT TWO DIFFERENT ORGANS, AND I
DID NOT NOTICE UNTIL I WENT BACK TO THE ROW'S OWN WORDS.**

    THE ROADSIDE DIRECTOR   engine/bohemia_encounters.js
    THE BARK SELECTOR       the line picker behind the speech bubbles

The 9/4 round measured the director and found it burned each of its twelve tokens
forever, so the valley went silent after twelve moments. **That is fixed.** The file
now carries a calendar: `REPEAT_DAYS = 3`, `MIN_GAP_S = 90`, `SPICE_CAP = 1`, a
70/20/10 mix, and a comment recording the measurement that caught it, twenty in-game
days producing five encounters all on day one. **The routing from that round landed
and somebody did the work.**

**SO THE TWO ORGANS ARE NOW AT OPPOSITE ENDS OF THE SAME PROBLEM.**

    the director    has memory, a calendar, a gap, and a rare-is-sacred cap.
                    Its failure was that it could never repeat. Fixed.
    the barks       have no memory of what was said at all, and the per-person
                    term in the index takes TWO VALUES on a street, so everybody
                    visible picks the same index on the same beat.

**AND THE ONE WITH NO CONTROL IS THE ONE THE PLAYER HEARS CONSTANTLY.** Encounters
are ninety seconds apart at best. Barks fire every few beats. **We put the
repetition machinery in the organ that speaks rarely and none of it in the organ
that never stops talking.**

## WHAT IS IN THE BANK
Five sections, all `draft:true`, none in the game.

    THE POOL AS A SHAPE   anchor, four body lines, one capped rare line
    THE SAME POOL IN      six readings of one shape crossed with world facts
      CONTEXT
    THE TWO REPEATS       identical text, one street against one hour
    TWELVE EQUALLY GOOD   the standard advice written out so its failure is
      LINES               visible: no anchor, every line demanding attention
    THE REFUSALS          what this lane will not do about repetition

**AND THE DELIVERABLE IS DELIBERATELY ONE POOL, NOT FORTY LINES SPRINKLED.** We have
40 starved pools of three lines or fewer; adding one line to each would be the
standard advice applied at scale and would fix nothing.

## ROUTED
- **WORDS**  Q3 is complete under the 9/6 mode: school, then writing, findings
  named. The row can be marked SHIPPED with both records.
- **WORDS**  Q4 to Q17 are still owed their school rounds, one at a time. And the
  coordinator has added Q18, Q19 and Q20, each already written as school first.
- **PEOPLE**  The bark selector is the finding of this round and it is theirs. Two
  things, both small. It keeps a record of WHO spoke and none of WHAT was said, so
  a line can come round again immediately. And the per-person term uses the LENGTH
  of a person key rather than the key, which takes two values on one block, so
  everybody visible moves in lockstep and two people in the same pool say the
  identical line on the identical beat. **The director next door already solved
  this problem properly and its answer can be copied rather than invented.**
- **WORLD / RUN**  A line that notices the hour, the weather, the price or what the
  block just did is worth more than six new lines, and every one of those facts is
  already computed. That is the cheapest variety available to this game.
Test material: banks/BOHEMIA_WORDS_TEST_LINES.md, section Q3 ROUND TWO, all
`draft:true`, none in the game.

## SOURCES
- Round one's school record carries the full citations: the 208-study mere exposure
  meta-analysis at r = 0.26, the 268-curve re-examination confirming the inverted U
  and finding it for visual but not auditory stimuli, the absence of a universal
  peak, semantic satiation as a separate rapid-repetition mechanism, and the rule
  database architecture of the best-documented ambient dialogue system.
- Our own build, measured across both rounds: 77 base bark pools holding 310 lines
  with a median of 3; the speaker-rotation record that tracks who spoke and not
  what was said; the index computed from the beat and the length of a person key;
  person-key lengths taking 2 distinct values within a block; and
  engine/bohemia_encounters.js carrying REPEAT_DAYS 3, MIN_GAP_S 90, SPICE_CAP 1
  and a 70/20/10 mix, which is the 9/4 round's finding having been fixed.

## AND A RED MAIN, FOUND WHILE RUNNING MY OWN GATES, WHICH BEATS MY QUEUE
Running the lane's gates on a clean checkout of main, with nothing of mine in it:

    voice_gate                110 passed, 1 failed
    dialogue_catalogue_gate    60 passed, 3 failed

**MAIN IS RED RIGHT NOW AND IT IS NOT MINE.** The catalogue gate says why, in its
own words: the words book was "baked from c95d11ddf447f7ca, sources now hash
90a748ebfe6803f9", the book holds 2,496 lines and disk now counts **2,684**, and
the fix it names is one command, `python3 tools/bohemia_words_book.py`.

**Other lanes added quest content and never baked the book.** The baked book holds
37 sources; the quest folder has moved on without it.

**AND BAKING IT MAKES A SECOND GATE RED, WHICH IS WHY THIS NEEDS TWO HANDS.** I
regenerated locally to check. The banned-phrase count goes from 39, which is exactly
the ceiling, to **40**, and I diffed the two books to find the single new hit:

    quests/bq/M04_WHAT_THE_NEIGHBOUR_ASKS.bq, line 87
    "...There is this block and the people on it and that is the whole list."

That trips the `"that is the whole ___"` rule. **So main is currently green on the
banned-phrase check only because the artifact it reads is stale.** The moment
anybody runs the bake the check the gate exists to enforce goes red.

**THAT IS THE SAME DEFECT CLASS THIS LANE HAS LOGGED BEFORE:** a checker satisfied by
an out-of-date artifact is not measuring the build. It happened to a pinned string
on 8/28 and it has happened again to the whole corpus.

**WHAT I DID ABOUT IT, AND WHY I DID NOT DO MORE.** I did not bake, because baking
ships a red voice gate for a line that is not mine to rewrite, and I did not touch
M04, because editing another lane's quest text is the boundary the parallel-sessions
law exists to protect. **So this round ships markdown only and changes no gate.**

**AND ONE THING I BELIEVED FOR TEN MINUTES AND CHECKED BEFORE WRITING IT DOWN:** I
thought the bank fed the words book, which would have meant every test line this
lane has ever written was entering the measured corpus. **It does not.** The book is
baked from the quest files and the records, 37 sources, and no bank file is among
them. The size growth I saw was other lanes' quests, not my lines.

## ROUTED, ADDED AFTER THE GATE RUN
- **QUESTS**  `M04_WHAT_THE_NEIGHBOUR_ASKS.bq` line 87 carries a banned phrase, and
  the words book has not been baked since your quest files landed. Both halves need
  doing together: fix the line, then bake, or the bake turns the voice gate red.
- **PLUMBER / whoever owns the bake**  Main is red on four claims across two gates
  and the cause is one unrun command. A gate that reads a generated artifact should
  fail on staleness before it reports anything else, and the catalogue gate already
  does exactly that, which is how this was found. **The voice gate does not**, and
  that is why the banned-phrase ceiling has been passing on a stale book.
