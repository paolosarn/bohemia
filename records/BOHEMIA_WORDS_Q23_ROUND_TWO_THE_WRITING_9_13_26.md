# WORDS Q23, ROUND TWO: THE WRITING
# VAMILY writing round, 9/13/26, lane WORDS (words-8dqrnq).
# MODE: SCHOOL THEN WRITE (Paolo 9/6, LOCKED). Round TWO of two.
# Round one: records/BOHEMIA_WORDS_Q23_SCHOOL_THE_LINE_IS_A_CONCLUSION_WITH_NO_EVIDENCE_9_13_26.md
#
# The row: [track words] Q23, the family for how the street says somebody came
# through here, Spanglish, draft:true, speaking only when the answer changes.
# Tab: RUN. Replaces FACTIONS' one shipped attempt (1ced8e51).
#
# The mode requires this record to name WHICH FINDING from school changed the
# lines. That comes first.

## THE SHAPE THE FAMILY TOOK, AND WHY IT IS A GRID AND NOT A SENTENCE
The shipped attempt was one sentence with a faction in it. The family is **a grid
the code can index on the two things it actually knows**, age band and leg, plus two
blocks that live in a mouth rather than in the ground.

**THE GROUND GETS NO FACTION NAME AT ALL.** That is finding 6 made structural: the
ground knows how old and which way and never who, a person knows who and is vague
about the rest, so the name is moved out of the dirt and into somebody's mouth.

## WHICH FINDINGS CHANGED THE LINES, AND HOW
**1. SEPARATE THE SEEING FROM THE MEANING.** Every ground line is an observation and
then a direction, and no line delivers a conclusion in the same breath as the facts.
The shipped attempt's "and they are close" is gone, and nothing replaces it, because
whether they are close is the player's read to make.

**2. AGE IS EVIDENCE, NEVER AN ADVERB.** Not one line says "just now". The three age
bands are written as three things that have or have not happened to the print:
**the edges are still sharp** (standing in them), **the dust has not come back into
these yet** (hot), **something small has walked over these since** and **the wind has
been in these** (cold). That is the Border Patrol method put in a desert: age is read
off what lies on top.

**3. DIRECTION IS IN THE DATA AND WAS BEING THROWN AWAY.** `tracksAt()` already
returns `leg`, out or back. **All nine ground lines carry it**, because out-or-back
is the difference between something moving off and something coming home, and it is
the only element on the list a player can act on.

**4. IDENTITY MUST SOUND LIKE A GUESS.** When the ground does name a faction it
carries the reason and the doubt in the same breath: "Boots, and not the kind anybody
round here wears. Could be {FACTION}. Could be somebody in bought boots." One reason,
one name, one alternative. That is the yellow flag from the research, not an answer.

**5. NO NUMBER, EVER.** The engine has no headcount, so a line saying how many would
be a lie. The neighbour block says this out loud in character: "Don't ask me how
many, I went inside."

**6. THE TWO HALVES, AND THE BEST THING IN THE SECTION CAME OUT OF IT.** Once the
ground and a person know different halves, they can DISAGREE. The family carries a
pair where the ground says the dust has not come back into the prints and the
neighbour says nobody has been up here in days. **Both are honest, one is wrong, and
nothing on screen tells him which.** That is what separating seeing from meaning
buys, and it is not available at all while the ground is allowed to assert a name.

**7. IT SPEAKS ONLY WHEN THE ANSWER CHANGES**, which the shipped code already does.

## THE TECHNICAL CONSEQUENCE, BECAUSE FINDING 3 CHANGES A CACHE KEY
The shipped code re-posts only when `faction|agenda|hot-or-cold` changes. **Adding
direction means `leg` has to join that key.** Otherwise a party that turns round
while the player is standing on the cell keeps the old sentence on screen, which is
the same stale-line bug the shipped code already fixed once for a different reason
and wrote a good comment about. It is named here because the writing causes it, so
it belongs with the writing rather than being discovered later.

## THE CHECK I RAN, AND MY OWN RULER FAILED THE SPANGLISH LAW
Parsed the nine ground lines back out of the bank and tested each against the
findings that are supposed to be in it: no age adverb, no number, direction present,
evidence present, no faction named.

**First pass: 8 of 9 clean, and the one failure was a false alarm.** The flagged line
was "Huellas, y los edges still sharp. Iban saliendo, no volviendo." It carries the
direction perfectly well, in Spanish. **My ruler only knew English direction words.**

**THAT IS A REAL PROBLEM AND IT IS BIGGER THAN THIS ROW.** THEY SPEAK SPANGLISH is a
law (8/25). Any ruler this lane builds that reads only English will systematically
under-credit exactly the lines the law requires, and would push a future writer to
"fix" good Spanglish by adding English words to it. It is the fourth instance this
session of the same family of error: a ruler that measures the wrong thing and is
believed because it produced a number. With the ruler reading both languages,
**0 of 9 ground lines fail a finding**.

Banned-phrase list run over the new section with wrapped lines joined: zero.

## ROUTED
- **WORDS** Q23 is complete under the 9/6 mode: school, then the writing, findings
  named. The row can be marked SHIPPED with both records. Q4 to Q17 are still owed
  their school rounds, one row at a time.
- **FACTIONS** own the track (1ced8e51). Three things, in order of size:
  **(a) `leg` is already computed and the sentence throws it away**, and it is the
  most playable field in the record. **(b) If direction goes into the line, `leg`
  must go into the re-post key**, or the line goes stale when a party turns round on
  the player's cell. **(c) The ground should not name a faction as a fact**; the
  name belongs to the neighbour block or to the guess, which carries its own doubt.
- **PEOPLE** The neighbour block is three lines of somebody who saw a party go past.
  It needs no new system: it is a bark from whoever is standing near a track. The
  third one, the neighbour who did not look, is the commonest case in life and the
  only line in the family that names neither who nor which way.
- **ALL LANES, one line, free, and it is the cheapest thing in this record:** a
  checker that reads only English will mark good Spanglish as broken. If your gate
  counts words, it has to count them in both languages or it is quietly arguing
  against a law.

## SOURCES
- Round one's school record carries the citations in full: SALUTE and the doctrine
  that facts and opinions are distinguished, Border Patrol sign cutting with age
  read from dew, rain and animal tracks over the print, footprint cards, and
  identity inferred from footwear that does not fit.
- The engine, read rather than assumed: `tracksAt` and `trackOf` in
  engine/bohemia_towns.js, `mk` in engine/bohemia_parties.js, and the shipped line
  and its re-post key in slices/BOHEMIA_CITY_WORLD.html.
- This round's own checks: the five-finding test over the nine ground lines, run
  twice because the first ruler could not read Spanish, and the banned-phrase list.
Test material: banks/BOHEMIA_WORDS_TEST_LINES.md, section Q23 ROUND TWO, all
`draft:true`, none in the game.
