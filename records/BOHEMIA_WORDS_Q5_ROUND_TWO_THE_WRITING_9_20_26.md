# WORDS Q5 -- ROUND TWO: THE WRITING
# VAMILY round, 9/20/26, lane WORDS (words-8dqrnq). MODE: SCHOOL THEN WRITE, round TWO.
# Round one: records/BOHEMIA_WORDS_Q5_SCHOOL_THE_SLOT_HAS_NOTHING_TO_WITHHOLD_9_18_26.md
# Lines: banks/BOHEMIA_WORDS_TEST_LINES.md, section "Q5 ROUND TWO", all draft:true,
# none of it in the game.
#
# THE QUESTION (Q5): "Refusal. How the best games let a character NOT answer, change
# the subject, or lie by omission, and how the player still learns something. Against
# our asking module's eighteen blocks."

## WHAT ROUND TWO PRODUCED
17 cards in three sets, measured by the shipped timing policy:

    17 cards | 38 bars | 76 s held | padding 8% | dead zone 0 | clipped 0

    SET A   4 lines, a drop-in replacement for the live table, four different
            published refusal formulas where today there is one, ZERO mechanism change
    SET B  12 lines, the same four in three mouths, which needs a register axis the
            asking factory does not have
    SET C   5 lines, the interesting refusals, WHICH CANNOT SHIP, and that is the
            point of the round

## WHICH FINDINGS FROM SCHOOL CHANGED HOW THE LINES WERE WRITTEN
1. **THE SLOT ONLY FIRES WHEN THERE IS NOTHING TO WITHHOLD.** Measured at the call
   site: the deflection is the ELSE of "this trade has an answer for this subject".
   This is the finding that decided the SHAPE of the round. Without it I would have
   written the four Gricean rule-breaks the 9/5 record asked for, dropped them into
   the live table, and shipped a machine that promises a secret behind a branch that
   opens because there is no secret. Instead, every line in SET A is honest about not
   having it, and the withholding lines are quarantined in SET C with a warning on
   them.
2. **FIVE REAL FORMULAS EXIST AND WE USE ONE.** All four shipped deflections are a
   competence disclaimer. SET A gives the worker a direct non-possession, the scav
   the alternative, the keeper a postponement and the watch a wish. Four formulas,
   four strings, same cost as today.
3. **THE QUIRK FACTORY IS THE MODEL AND IT IS OURS.** It authors every shape in three
   mouths. I went and measured the asking module against that: **32 lines, not one
   word of Spanish**, in a game whose law is THEY SPEAK SPANGLISH. SET B is the answer
   and it exists because school pointed at our own generator instead of at a game.
4. **THE HELD BEAT IS TWO, NOT ONE.** Carried onto the section's closing note rather
   than into a line, because it is a timing fact and not a word.

## WHAT I DID NOT REWRITE, AND WHY IT MATTERS
**The scav line stays exactly as it is.** It is already the ALTERNATIVE formula and it
already lands at 95% of three bars. School's finding is that all four are the same
MOVE, not that any one of them is badly written. Rewriting a line that works so the
set looks uniform would have cost us the one deflection that already hands the player
somewhere to go. Three changed, one kept.

And the two lines I did replace were replaced for a second reason as well: measured
against Q4 round two's boxes, the keeper sits at 80% of three bars and the watch at
80% of two, which is the dead-zone edge. The worker was already at 100%. So the set I
inherited was not uniformly weak on timing either, and saying so is part of the job.

## THE THING SCHOOL COULD NOT TELL ME, WHICH ONLY WRITING FOUND
**A REGISTER CHANGES THE BOX.**

The spanish-dominant mouth drops articles and auxiliaries, so the same content comes
out SHORTER, and Q4 round two established that shorter is the expensive direction: a
card a few characters past a bar pays for the whole next bar, and the gap from 29 to
44 characters is dead space.

My first pass at SET B put **five of the twelve register lines in the dead zone**, at
68 to 71% fill, and every one of them for the same reason: the broken-English version
of a line that fits English cleanly overshoots one box and undershoots the next.

    "Ask somebody who no move. I am never long time in one place."   60ch  3 bars  71%
    "Ojala. I watch this street, y esa no es."                       40ch  2 bars  71%
    "Not across this counter todavia. Ask me when it is older."      57ch  3 bars  68%

**A THREE-MOUTH SET CANNOT BE WRITTEN ONCE AND THEN TRANSLATED. EACH MOUTH HAS TO BE
FITTED TO ITS OWN BOX.** After fitting, all twelve sit between 89% and 100%.

This is new and it is a rule the lane did not have. The Spanglish law and the timing
law were two separate constraints in every record before this one. They are not
separate: the register moves the length, and the length is the cost.

## AND A SMALL ONE, SAID BECAUSE THIS LANE KEEPS MAKING IT
While checking whether the asking module carries any Spanish, my detector returned 4
hits. All four were false: it was matching "se", "lo", "te" and "me" inside English
sentences. **The true count is zero.** That is the third English-ruler failure this
lane has recorded in three rounds, after Q23's direction words and Q5 school's Spanish
negator. The standing rule from school held and I caught it by reading the hits, which
is the only reason the number in this record is right.

## WHAT THIS DOES NOT CLAIM
- **Nothing here is in the game.** SET A is a drop-in that would cost nothing to land,
  and landing it is the asking module's owner's call, not this lane's.
- **SET C cannot ship and must not be made to.** Its five lines all presuppose a
  speaker who has the answer and declines. The branch does not exist. Putting any of
  them in the slot SET A fills would be rule 14(d) in dialogue form.
- **No break is reported.** The call-site reading in school and the counts here are
  reading and executing our own code and data. This lane has not walked the demo.
- **No reference game is cited**, in either round.

## ROUTED
- **WORDS** Q5 now has both rounds and is SHIPPED under the 9/6 mode.
- **WORDS, new standing rule** a register set is fitted per mouth, never translated
  then shipped. Written into the bank section beside the lines it came from.
- **whoever owns the asking module** SET A is four strings for four strings and
  removes the "four trades, one move" defect at zero cost. SET B needs `DEFLECT` to
  hold a register per archetype instead of one string. SET C needs the second branch
  that school measured as missing. Three different sizes of change, named in order.
- **whoever owns the asking module, separately** 32 lines and not one word of Spanish,
  against a law from 8/25. The quirk factory next door does three mouths for every
  shape. This is a gap in a module, not a gap in the writing.
- **UI** unchanged from school: the held beat before a refusal is TWO beats. 500 ms is
  inside the band where a refusal and an acceptance cannot be told apart.

## SOURCES
- `engine/bohemia_stage.js`, executed for every char, bar and fill figure here.
- `records/BOHEMIA_ASKING.json` and `tools/bohemia_asking_factory.py` line 205: the
  four live deflections, the 32-line corpus, the house style (no verb contractions),
  and the absence of any register axis.
- `tools/bohemia_quirk_factory.py`: three mouths per shape, the model SET B follows.
- Round one, for the call-site measurement, the Beebe taxonomy and the Kendrick and
  Torreira timing study:
  records/BOHEMIA_WORDS_Q5_SCHOOL_THE_SLOT_HAS_NOTHING_TO_WITHHOLD_9_18_26.md
- Q4 round two, for the boxes and the dead zone:
  records/BOHEMIA_WORDS_Q4_ROUND_TWO_THE_WRITING_9_16_26.md
