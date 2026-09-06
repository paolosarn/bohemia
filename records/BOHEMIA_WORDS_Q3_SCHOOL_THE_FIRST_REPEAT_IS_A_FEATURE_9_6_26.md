# WORDS Q3, ROUND ONE: SCHOOL -- THE FIRST REPEAT IS A FEATURE AND OUR SELECTOR IS BROKEN
# VAMILY school round, 9/6/26, lane WORDS (words-8dqrnq).
# MODE: SCHOOL THEN WRITE (Paolo 9/6, LOCKED). Round ONE of two.
# *** NO TEST LINES ARE WRITTEN IN THIS FILE. Round two writes them and must name
# which finding below changed them. ***
#
# The question, verbatim: "How a crowd talks without repeating itself. The best
# ambient-bark systems ever built: how many lines, how they are chosen, how they
# avoid the third repeat. Against our roadside director's twelve."

## THE SHORT VERSION
**We do not have a repetition problem that more lines would fix. We have a
SELECTOR that has no memory of what was said and whose per-person term collapses
to two values on a street. And the science says the first repeat is not the enemy:
it is the thing that makes a street feel like a street.**

## 1. WHAT THE SCIENCE ACTUALLY SAYS ABOUT HEARING SOMETHING AGAIN
The mere exposure effect is one of the most replicated results in psychology. The
1989 meta-analysis covered **208 studies** and put the effect at **r = 0.26**:
repetition increases liking.

But it does not keep increasing. **Two forces run at once with different timing:
comfort arrives early, tedium arrives later, and their sum is an inverted U.**
Liking rises, peaks, and then falls.

The 2017 re-examination estimated **268 curve estimates from 81 articles** and
confirmed the shape: a positive slope with a negative quadratic term.

**AND THERE IS NO UNIVERSAL PEAK.** The count where liking turns moves with how
complex the thing is, how far apart the exposures are, and how novel it was to
start with. **So "the third repeat" in the row's own brief is not a constant, and
any design that hard-codes a number is guessing.**

**AND ONE QUALIFICATION THAT COULD HAVE EMBARRASSED THIS LANE.** The 2017 analysis
found the inverted-U curves for **visual but NOT auditory stimuli**. If our barks
were voice-acted, the evidence I just cited would not straightforwardly cover them.
**Our barks are text read in a bubble on screen.** We are in the visual branch,
where the finding holds. That is luck rather than judgement and it belongs in the
record as such.

**THE FAST END OF THE CURVE IS A DIFFERENT MECHANISM.** Semantic satiation: a word
or phrase repeated rapidly loses its meaning, through reactive inhibition as the
same activity fires again and again. That is about back-to-back repeats over
seconds, not about the same bark twice in an hour. **So spacing is not a minor
tuning knob, it is the difference between two mechanisms.** The same line twice on
one street is a different psychological event from the same line twice in a day.

## 2. HOW THE BEST-DOCUMENTED BARK SYSTEM ACTUALLY WORKS
The most thoroughly published ambient-dialogue system in games is a **rule
database**. Hundreds of facts about the current state of the world are collected
and fuzzy-matched against a database of thousands of possible lines. Each line
carries criteria; the system picks the **most specific rule that matches**, and
falls back to less specific ones when nothing better fits.

**THE DESIGN POINT IS NOT THE SIZE OF THE DATABASE. IT IS THAT VARIETY COMES FROM
CONTEXT.** A line tied to a specific situation is not experienced as a repeat, even
on its second outing, because the situation is what the player is attending to. A
generic line is experienced as a repeat on hearing two, because there is nothing
else in it to notice.

**AN HONEST NOTE ON SOURCING.** The primary material for this system, the slides and
the talk, is blocked by this session's network egress. Everything above is from
secondary accounts of it and I am not going to invent line counts I could not
verify. What is solid and repeatedly attested is the architecture: facts, criteria,
most-specific-wins, fallbacks.

## 3. OUR OWN MACHINE, MEASURED, AND IT IS WORSE THAN I EXPECTED
**THE POOLS.**

    base pools (English, before register variants)      77
    total lines in them                                310
    MEDIAN POOL SIZE                                     3
    pools with 3 lines or fewer                    40 of 77   (52%)
    pools with exactly ONE line                          8

**Over half our bark pools cannot survive a third hearing, because they do not
contain a third line.** Eight of them have one line, so the second hearing is
already the repeat.

**WHO SPEAKS IS HANDLED WELL AND DELIBERATELY.** A record of who has spoken recently
is kept and cleared every 24 speakers, so the barking moves around the crowd
instead of sticking to the nearest body. That is a real anti-repetition mechanism
and somebody thought about it.

**WHAT THEY SAY HAS NO MEMORY AT ALL.** The selection is one line:

    idx = hash(beat) XOR String(key).length, modulo pool length

**There is no history, no cooldown, no shuffle bag, and nothing anywhere knows what
was said last.** The record that is kept tracks WHO spoke, never WHAT was spoken.

**AND THE PER-PERSON TERM IS BROKEN.** It uses the LENGTH of the person's key rather
than the key. A person key is built as `P:` plus the block seed plus `:` plus an
agent id like `H3-2`. Measured over a plausible population:

    distinct person-key LENGTHS across the valley        3   (16, 17, 18)
    distinct person-key lengths WITHIN ONE BLOCK         2

Everyone on a street shares a block seed, so the only thing that varies is whether
the agent id is four or five characters. **The per-person term in the selector has
two values on the street in front of you.** The index therefore reduces, for
practical purposes, to a function of the beat alone.

**SO EVERY PERSON YOU CAN SEE PICKS THE SAME INDEX ON THE SAME BEAT.** They have
different pools, so they usually do not say the identical sentence. But **two people
in the same pool standing on the same street say the identical line at the identical
moment**, and the whole crowd's choices move in lockstep. That is not a repetition
problem that a bigger word count fixes.

## 4. WHERE THE STANDARD ADVICE IS WRONG
**THE STANDARD ADVICE IS "WRITE MORE LINES."** It is wrong in three ways and the
measurements above are why.

**FIRST, IT IS THE WRONG LEVER.** Doubling a pool halves the repeat rate at doubled
authoring cost, while the player's exposure grows with how long they play, so the
problem returns. **Spacing and context are free by comparison.** A three-line pool
with a real cooldown and a context match will outperform a twelve-line pool chosen
by a clock hash, and we can prove that without writing a single new line.

**SECOND, IT TREATS ALL REPETITION AS DAMAGE, AND THE CURVE SAYS OTHERWISE.**
Liking RISES before it falls. **The first repeat is where a phrase becomes a place.**
A street where nothing is ever said twice is not a street, it is a shuffled deck.
The goal is not zero repetition, it is **staying on the left side of the curve**,
and the way to do that is spacing, not volume.

**THIRD, IT IGNORES THAT THE PEAK MOVES.** Since the turn depends on complexity,
spacing and novelty, a short plain line survives more repeats than a long clever
one. **A memorable line is a liability.** The lines a player will notice repeating
first are the ones we are proudest of, and this lane has already caught itself
propagating a rhetorical move across five quests without meaning to (Q13, and Q1's
school found the same thing about tics).

## 5. WHAT SCHOOL LEAVES ME HOLDING FOR ROUND TWO
1. **THE FIX IS THE SELECTOR, NOT THE WORD COUNT**, and it is not mine to build.
   What is mine is writing lines that assume a selector with memory.
2. **SPACING BEATS VOLUME**, and the two repetition mechanisms are different: the
   same line twice on one street is satiation, twice in a day is the curve.
3. **THE FIRST REPEAT IS A FEATURE.** Some lines should be written to be heard
   again, and they should be the plain ones.
4. **PLAIN LINES SURVIVE REPETITION AND CLEVER ONES DO NOT**, so a pool needs a
   deliberate mix rather than twelve equally good lines.
5. **CONTEXT IS WHERE VARIETY REALLY COMES FROM.** A line that names the hour, the
   weather, the block or what just happened is not heard as a repeat.
6. **AND OVER HALF OUR POOLS HAVE THREE LINES OR FEWER**, which is the honest
   starting position for anything round two writes.

## ROUTED
- **WORDS**  Q3 round one is done. Round two writes the lines and names which of
  the above changed them.
- **NOTHING IS ROUTED TO ANOTHER LANE.** School produces knowledge, not jobs. The
  selector defect is real and belongs to whoever owns that surface, and round two
  will route it properly once there is something written to route it alongside.

## SOURCES
- The 1989 mere exposure meta-analysis: 208 studies, r = 0.26.
- The 2017 re-examination: 268 curve estimates from 81 articles, a positive slope
  with a negative quadratic consistent with an inverted U, found for visual but not
  auditory stimuli, and for exposure durations under 10 seconds or over a minute.
- The two-factor account of habituation followed by tedium, and the absence of a
  universal optimum because the peak shifts with complexity, spacing and novelty.
- Semantic satiation: rapid repetition draining a word's meaning through reactive
  inhibition, a mechanism distinct from the exposure curve.
- The published architecture of the best-documented ambient dialogue system: a rule
  database of facts fuzzy-matched against a large line database with
  most-specific-rule-wins and less specific fallbacks. Primary slides and talk were
  unreachable from this session's network; the architecture is from secondary
  accounts and no line counts are quoted.
- Our own build, measured this round: 77 base bark pools holding 310 lines with a
  median of 3 and 8 pools of exactly one; the speaker-rotation record cleared every
  24 speakers; the line index computed as a hash of the beat and the LENGTH of the
  person key; and person-key lengths taking 3 distinct values across the valley and
  2 within a single block.
