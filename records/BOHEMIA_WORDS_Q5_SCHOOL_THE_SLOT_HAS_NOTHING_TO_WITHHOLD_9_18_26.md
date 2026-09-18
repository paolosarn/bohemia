# WORDS Q5 -- SCHOOL: THE SLOT HAS NOTHING TO WITHHOLD
# VAMILY round, 9/18/26, lane WORDS (words-8dqrnq). MODE: SCHOOL THEN WRITE, round ONE.
# NO TEST LINES ARE WRITTEN IN THIS FILE. banks/ is untouched. That is the mode.
#
# THE QUESTION, VERBATIM (Q5): "Refusal. How the best games let a character NOT
# answer, change the subject, or lie by omission, and how the player still learns
# something. Against our asking module's eighteen blocks."
#
# WHY IT OWES A SCHOOL ROUND: Q5 shipped 9/5 under the OLD one-round mode, a round
# before Paolo locked SCHOOL THEN WRITE on 9/6. Q4's debt is paid; Q5 is next.

## THE ANSWER IN ONE LINE
**The four refusals the 9/5 record condemned are the only honest thing that slot
can say, because the slot only ever fires when the person genuinely does not have
the answer. The defect is in the branch, not in the words, and the 9/5 record spent
a whole round fixing the wrong layer.**

And the second thing school found: **the refusal system the 9/5 record said we
needed already exists and has been running for rounds. Our own ruler could not see
it.**

=================================================================================
## 1. THE FINDING THAT PROVES US WRONG, MEASURED AT THE CALL SITE
=================================================================================
The 9/5 record called the four deflections "a routing message wearing a character's
clothes" and prescribed replacing them with four Gricean rule-breaks: one that says
too little, one that answers a different question, one that goes vague, one that
names the cost.

I went and read the branch that fires them. In `slices/BOHEMIA_CITY_WORLD.html`
around line 50228, the whole of it:

    var a = null;
    try { a = BohemiaAsking.answerFor(subject, trade); } catch (_e) {}
    if (a) { ...gives the answer, notes the deeper fact... }
    else   { try { text = BohemiaAsking.deflectFor(trade); } catch (_e) { text = ''; } }

**The deflection is the ELSE of "this trade has an answer for this subject".** It
fires when, and only when, `answerFor` returns null. There is no branch anywhere in
the module for a person who HAS the answer and will not give it.

Three of the 9/5 record's four prescribed moves presuppose exactly that. "Says less
than the question needs and stops" implies there is more. "Answers a different
question" implies the real one was understood and avoided. "Goes vague where they
were clear" implies something to be vague about. **Written into this slot, all
three would be the machine lying: a line promising a secret behind a branch that
fires because there is no secret.** That is rule 14(d) in dialogue form, a card
that promises something and does nothing, which Paolo named as the worst bug in
the game.

**So the competence disclaimer is not a writing failure. It is the correct and
honest thing to say in the only situation this slot describes.** The 9/5 record
read the four lines, judged the words, and never opened the branch.

Rule 12 checked while I was in there, because a dead module would change what any
of this is worth: `deflectFor` IS live. It is called from the walked city's ask
beat and the line goes out through the same voice channel a meeting uses. This is
running code, not a shelf.

=================================================================================
## 2. AND THE SYSTEM THE 9/5 RECORD ASKED FOR ALREADY EXISTS
=================================================================================
Its closing line was: "Our best refusal writing and our refusal MECHANISM have
never met", and it placed the good writing in "the hand-written quest scenes".

That is wrong. The good refusal writing is in a GENERATOR, and it has been for
rounds. `records/BOHEMIA_QUIRKS.json`, built by `tools/bohemia_quirk_factory.py`,
22 shapes across 304 combinations, each authored in three mouths under THEY SPEAK
SPANGLISH, live in `engine/bohemia_quirk.js` and in the walked city, and its own
header says it is "delivered through the ask-their-name beat".

**23 of its 194 lines (12%) are refusals**, and between them they cover almost the
whole published taxonomy of how people actually refuse:

    the move                      the quirk line that is it
    reason / excuse               "Not while I'm carrying {it}."
    postponement                  "Ask me tomorrow and you'll get it."
    postponement, conditional     "Ask me again once I've sold {it}."
    a different channel           "I write it. I not say it."
    a place condition             "Not here. Come to {p} and I'll say it."
    a condition on the asker      "I'm not telling you my name until you've done it."
    an admitted lie               "The one I give first isn't the real one."
    refusing the premise          "Don't need my name. Need you to take {it} and go."

**AND THIS IS WHY THEY ARE GOOD AND THE OTHER FOUR ARE FLAT.** A quirk withholds a
name, and the person certainly has their own name. The asking module withholds
nothing, because the branch only opens when there is nothing there. One system has
something to withhold and the other does not, and every difference in the writing
falls out of that one fact.

"The one I give first isn't the real one" is the quality flout the 9/5 record said
we lacked and called a memory-organ problem for another lane. It shipped. It is in
the game. It tells the player they were lied to and it does it without any
machinery to catch the lie later, because the speaker catches it themselves.

**Two rounds running, this lane has gone out to derive something the repo already
had.** Q4 missed the reading-speed policy in `bohemia_stage.js`. Q5 missed the
refusal system in the quirk factory. REUSE-FIRST is a law about research, and the
first question of any round is what the repo already answers.

=================================================================================
## 3. WHY OUR RULER COULD NOT SEE IT, AND THE HITS READ BY HAND
=================================================================================
The 9/5 record swept for seven refusal moves and reported 91 hits in 1,669 lines.
None of its patterns matches "Not while I'm carrying it", so the best refusals in
the game were invisible to the sweep that concluded we had none.

I re-swept the corpus as it stands, 3,014 spoken lines, and then **read every hit
by hand**, because a count is not a classification.

    pattern            hits   real refusals after reading all of them
    direct no            81   about 6
    postponement         35   about 8
    names a cost         23   5 cost-of-telling, 6 name-withholding quirks
    do not know          23   not all read; mixed
    inability             8
    send elsewhere        6
    not my domain         4
    condition             0   A FALSE ZERO

**"DIRECT NO" IS 93% WRONG, AND THE REASON IS OURS ALONE.** Most of the 81 are
CHOICES, the player's own menu ("No. Ours.", "No. We take it."), which is a player
picking an option and not a character refusing. And the rest is a trap no English
corpus has: **"no" is also the Spanish negator.** "No se me olvida", "No creo que",
"No te conozco", "No hay walking that back" are all ordinary negatives in a
Spanglish corpus and every one of them scored as a refusal. A ruler built for
English cannot be pointed at this game's dialogue. This lane learned that once
already, on Q23's direction words, and built a bilingual ruler that round. The
lesson did not travel to the next ruler.

**"POSTPONEMENT" IS MOSTLY THE WORD "COME BACK" DOING ITS ORDINARY JOB**: "come
back and tell me I am wrong", "then lights come back". About 8 of the 35 are real,
and every one of those 8 is a quirk or a bark, which is section 2 again from
another direction.

**AND MY OWN CONDITION PATTERN RETURNED ZERO, WHICH WAS A LIE.** It required "if
you ... then / I'll". Real conditional refusals in our corpus say "until", "once"
and "before": "I'm not telling you my name until you've done it." **A zero from a
pattern is not evidence of absence, and a zero is the easiest number in the world
to believe.**

One thing I will NOT publish: the 9/5 record counted 11 cost-naming lines in 1,669.
My patterns are not its patterns, so I cannot honestly say whether that number rose
or fell, and I am not going to report a trend I cannot attribute to the corpus
rather than to my own regex. What I can say, from reading: in a corpus 81% larger,
the cost-of-telling move appears about 5 times in quest scenes.

=================================================================================
## 4. THE REAL WORLD: EXPLANATION IS THE UNMARKED MOVE, AND REALISM FIRST
=================================================================================
Beebe, Takahashi and Uliss-Weltz (1990) is the taxonomy the whole field of refusal
research still runs on. It splits refusals into semantic formulas and adjuncts, and
the formulas into direct and indirect. Across the studies built on it, the most
frequent strategies are direct refusal, regret, **excuse and reason**, wish, and
postponement, and "explanation" comes out as the highest-ranked, that is the
UNMARKED, indirect strategy.

**Giving a reason is what refusing normally looks like.** "I am never in one place
long enough" is not a lazy move. It is the most ordinary move there is.

REALISM FIRST (Paolo 8/4, LOCKED) says the realistic option leads and wins by
default, and realism is sacrificed only for fun or genuine interest, and **that
trade is his.** The 9/5 record proposed swapping the realistic formula for a
literary one because the literary one is more interesting to a player. That may
well be the right call. It is a trade against realism, it was never named as one,
and a lane made it quietly.

**AND THE REAL DEFECT SURVIVES ALL OF THIS, RESTATED PROPERLY.** Our four are not
bad because they give reasons. They are thin because all four give the SAME reason,
competence, when the published hierarchy has at least five formulas sitting there
unused. Four trades, one move. Five moves would cost the same four lines.

=================================================================================
## 5. THE HELD BEAT IS TOO SHORT, AND THIS LANE HAS ASKED FOR IT THREE TIMES
=================================================================================
The 9/5 record's third prescription: "MARK IT AS DISPREFERRED. A real refusal is
delayed and prefaced. Ours arrive instantly." Q2 and Q4 asked for the same held
beat. Three records, one recommendation, 500 ms.

Kendrick and Torreira, "The Timing and Construction of Preference: A Quantitative
Study", Discourse Processes 2015, took the claim that dispreferred responses are
delayed and MEASURED it over 195 preferred and dispreferred responding actions in
telephone corpora. **The timing of the most frequent cases of each type did not
differ systematically.** Only at transitions of **700 ms or more** does the
proportion of dispreferreds become clearly greater than preferreds, and a delay on
the order of 700 to 800 ms is where the signal is reliable. Ordinary responses peak
within about 200 ms of the previous turn and transition is typically not withheld
more than 500 ms.

Two things fall out, and the second one is arithmetic:

1. **THE TEXTBOOK CLAIM IS MUCH WEAKER THAN WE WROTE IT.** A refusal is not
   reliably slower. It is slower only in its tail. And this lane already knows
   this pattern: the Q2 school round is titled THE HESITATION IS A MYTH and is
   built on exactly this class of finding, that a widely repeated speech cue does
   not survive measurement. Q2's school landed 9/6, a round AFTER Q5 shipped.
   **Newest date wins, and Q5's section 5 contradicts the lane's own next record.**

2. **ONE BEAT IS THE WRONG NUMBER, AND TWO IS THE RIGHT ONE.** At 120 BPM a beat is
   500 ms, which sits inside the band where preferred and dispreferred are not
   distinguishable. **The first quantised value that clears the 700 to 800 ms
   threshold is TWO BEATS, 1,000 ms.** Q4's school round fixed the beat at 500 ms
   in seven places in the engine, so this is not an assumption. Three records asked
   for a held beat and the number in all three of them is too small to do the job
   they asked it to do.

=================================================================================
## 6. THIS LANE'S OWN VIOLATION, AGAIN
=================================================================================
Q5's section 3 is built on three reference games Paolo never named. The named set
is FF12 for combat gambits, ROGUE FABLE 4 for combat on the beat, BATTLE BROTHERS
for the campaign, FFX for the interface and the sound, FALLOUT 1 for the interface,
POCKET CITY 2 for the city drop-in, and Las Vegas for the city. Q5 was written 9/5,
after the 8/28 law, on the same date as the department split.

Q4's school found the same thing in Q4. **That is two for two in the lane's 9/4 to
9/5 batch**, which is a pattern rather than a slip, and the remaining owed school
rounds should expect to find it. The 8/28 law is explicit about the way out: a
mechanic found in research goes into the brief in plain words with no borrowed name
attached. Round two cites no reference game, and the prior art it leans on is
linguistics, which is not a game.

=================================================================================
## ROUTED
=================================================================================
- **WORDS** Q5 school done. Round two is the writing, and it may not repeat
  sections 1, 3, 5 or 6.
- **WORDS** the held BUILD row FOUR-KINDS-OF-NO is re-aimed by this round. It says
  "four different rule-breaks". Three of its four cannot be written into that slot
  without the machine lying. What the row is really about is FIVE DIFFERENT REAL
  FORMULAS for the branch that exists, and a SECOND BRANCH before the interesting
  ones become possible at all. Stays held while the lane is in research mode.
- **WORDS, standing** a bilingual ruler is not a one-off fix for one round. The
  next sweep this lane writes starts from the Spanglish corpus, not from English.
- **whoever owns the asking module** the interesting refusals need a branch that
  does not exist: a person who HAS the answer and declines. Today the module knows
  only "this trade answers this subject" and "it does not". Named, measured at the
  call site, not touched by this lane.
- **PEOPLE** the quirk factory is the best refusal writing in the game and nobody
  in this lane's records knew it. 22 shapes, 304 combinations, three registers, and
  a quality flout that admits itself. It deserves to be cited as prior art rather
  than rediscovered.
- **UI** the held beat before a refusal is TWO beats, not one. 500 ms is inside the
  band where a refusal and an acceptance are indistinguishable. This supersedes the
  one-beat request in Q2, Q4 and Q5 by measurement, and Q4's school already fixed
  the beat at 500 ms in the engine so the arithmetic is safe.
- **PEOPLE / QUESTS** the 9/5 record routed "a lie the world can catch" to you. The
  quirk system solves it without you, by having the speaker admit the lie
  themselves. Whether a lie the world catches is still wanted is yours; it is no
  longer a blocker on this lane.

=================================================================================
## WHAT SCHOOL LEAVES FOR ROUND TWO
=================================================================================
    the slot only fires when there is nothing to withhold   section 1
    so the four must stay honest about that                 section 1
    five real formulas exist and we use one                 section 4
    the quirk system is the model, and it is ours           section 2
    a refusal that withholds needs a second branch first    section 1
    the held beat is two, not one                           section 5

Round two must name which of these changed how the lines were written. If none of
them did, school was done badly and the round does not count.

=================================================================================
## SOURCES
=================================================================================
- `slices/BOHEMIA_CITY_WORLD.html` around line 50228 and `engine/bohemia_asking.js`
  lines 391 and 413: the deflection branch, read rather than assumed.
- `records/BOHEMIA_ASKING.json` (14 answers, 4 deflections) and
  `tools/bohemia_asking_factory.py` line 205, the four lines themselves.
- `records/BOHEMIA_QUIRKS.json`, `tools/bohemia_quirk_factory.py`,
  `engine/bohemia_quirk.js`: 22 shapes, 304 combinations, 194 lines, three
  registers, delivered through the ask-their-name beat.
- `records/BOHEMIA_WORDS_BOOK.json`: 3,014 spoken lines, swept this round and every
  hit in the four biggest patterns read by hand.
- Beebe, Takahashi and Uliss-Weltz (1990), the refusal taxonomy the field still
  uses: semantic formulas and adjuncts, direct and indirect; across the studies
  built on it the most frequent strategies are direct refusal, regret, excuse and
  reason, wish and postponement, with explanation the highest-ranked indirect one.
  Read through secondary summaries and papers built on the taxonomy.
- Kendrick and Torreira, "The Timing and Construction of Preference: A Quantitative
  Study", Discourse Processes 52:4 (2015), 255-289: 195 preferred and dispreferred
  responding actions; the most frequent cases of each type did not differ
  systematically in timing; only at 700 ms or more is the proportion of
  dispreferreds clearly greater. The White Rose copy of the paper is blocked by
  this session's network egress, so the figures come from corroborating summaries
  rather than the primary, and they agree with each other.
- Grice's cooperative principle, carried over from the 9/5 record and now placed:
  it is a theory of what an utterance IMPLIES, not a measurement of what speakers
  DO. Using it alone is how a round concluded that the most common refusal move in
  real speech is the defective one.
- The lane's own `records/BOHEMIA_WORDS_Q2_SCHOOL_THE_HESITATION_IS_A_MYTH_9_6_26.md`,
  which contradicts Q5 section 5 and is a round newer.
