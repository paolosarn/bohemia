# WORDS Q22, ROUND TWO: THE WRITING
# VAMILY writing round, 9/13/26, lane WORDS (words-8dqrnq).
# MODE: SCHOOL THEN WRITE (Paolo 9/6, LOCKED). Round TWO of two.
# Round one: records/BOHEMIA_WORDS_Q22_SCHOOL_THE_LENDER_CALLS_IT_HELP_9_13_26.md
#
# The row: [debt words] Q22, the family of lines for the nightfall card that says
# WHO YOU OWE, Spanglish, draft:true, pointing at the catalogue. Tab: LIFE.
#
# The mode requires this record to name WHICH FINDING from school changed the
# lines. That comes first.

## THE ONE DESIGN DECISION THE WHOLE FAMILY HANGS ON
School's finding 6 said a card has to pick a voice: the lender's, the player's own
reckoning, or nobody's. Finding 3 said a lender never says debt, he says help.

**The family resolves both at once: THE HEADERS ARE IN THE LENDER'S WORD AND THE
ROWS ARE IN THE PLAYER'S HONEST COUNT.** He reads PEOPLE WHO HELPED YOU OUT, and
underneath it a line that says somebody gave him something for nothing nine times.
Both are true. The gap between them is on screen at the same moment, and it is the
only thing on the card doing emotional work, because nothing on it is allowed to
tell him how to feel (finding 2).

That replaces the first attempt's headers, which were YOU OWE THEM, THEY LENT YOU
BATTERIES and YOU WENT SHORT ON THEM: second person, accusing, and in nobody's
voice, which is the combination school said says nothing.

## WHICH FINDINGS CHANGED THE LINES, AND HOW
**1. THE NAME IS LOAD-BEARING, AND IT HAS A CONTROL GROUP.** 9,196 people, randomised
reminders, the ones carrying the recipient's name moved payment and the moral appeals
did not. **Every row opens with the lender and no row is ever collapsed into a
category**, and the refusal list bans collapsing one. This was already right in the
first attempt; the job here was to not undo it and to say why it is load-bearing.

**2. THE MORAL APPEAL DOES NOTHING, so nothing on this card tells him what kind of
person it makes him.** No "people are counting on you", no "this is how the block
holds". The refusal list bans the whole category.

**3. THE LENDER'S WORD IS HELP**, which produced the headers above and also lives
inside a row: "He calls it helping you out." The player is writing down the number
AND the word the other man uses for it.

**4. THE CONSEQUENCE STAYS UNSAID.** Not one line says what happens if he does not
pay. **"Nobody has mentioned it yet" is kept word for word from the first attempt**,
because it already IS this finding and it is the best line on the card. Two new lines
are built to do the same job: "Nothing was said either time", and "Just asking."
Reporting what was NOT said is louder than saying it.

**5. ESCALATION IS SPECIFICITY, NOT VOLUME.** School flagged this as its weakest,
least-sourced finding and it is still the one that shaped the structure most:
**every kind now has a FIRST row and a LATER row, and the later one never raises its
voice.** It knows a morning, a fence, a thing somebody asked. "She brought up the
fence this morning. Not the nine times. The fence."

**6. THE VOICE**, above.

## POINTING AT THE CATALOGUE, AS THE ROW ASKS
Three real findings, each applied rather than name-dropped:
- **Q098.P1**, "an inheritance is a DEBT, a REPUTATION, an ACCUSATION, and a corpse
  that won't go in the ground". This card already survives the fold and hands its
  creditors to the heir, so **the family carries a line written for the morning the
  heir first reads it**: the people are still standing there and none of them has
  said anything to him yet.
- **Q087.P3**, the opening quest is a debt with a clock owed to a faction. The card
  is the standing version of that, which is why it names the faction every time.
- **Q073.W5**, THE HARM COMES BACK WEARING YOUR OWN FACE, a man who catches TB from
  somebody he beat for a debt. Applied as a restraint: **nothing on this card
  threatens**, because the collector is not the danger here, the arithmetic is.

## WHAT IS IN THE BANK
banks/BOHEMIA_WORDS_TEST_LINES.md, section `Q22 ROUND TWO`, all `draft:true`:
three headers in the lender's word; three kinds with a FIRST row, a LATER row and a
Spanglish row each; the heir's first nightfall; the empty-card line; and seven
refusals.

**The empty-card line is "Nobody helped you this week."** The card is never
congratulatory. An empty ledger here reads as a man nobody has offered anything to
rather than as a clean record, and the line is built to land either way depending on
the week he has had.

## THE COVERAGE HOLE: WHAT I SAID LAST ROUND AND WHAT I ACTUALLY DID
Last round's handoff said the coverage hole "goes with the writing in round two".
It did not, and here is the straight version.

**THE HOLE IS PROVEN.** The card's words live in slices/BOHEMIA_CITY_WORLD.html and
nowhere else (2 hits there, 0 in the demo, 0 in the alpha), the interface word book
is harvested by walking slices/BOHEMIA_DEMO.html, and 0 of its 54 lines mention
owing, lending, debt or being short. So this card has never been read by the voice
gate, the banned-phrase ratchet or the catalogue gate.

**I TRIED TO SIZE IT CHEAPLY AND THE RULER WAS THE TRAP I DOCUMENTED TWO ROUNDS
AGO.** A grep for uppercase quoted labels in the city slice returned five
candidates, and reading them by hand they are a sound label, a comment heading and a
fragment of a comment about sort order. **Not one is a card the player reads.** That
is exactly the failure I wrote up in the voice gate fix: a grep over source reads
comments as if they were code. **So no number is published here**, because the only
honest way to size this is to walk the city the way the harvester walks the demo,
and that is a browser run plus a change to tools/bohemia_interface_words.py.

**AND I AM NOT DOING THAT THIS ROUND, ON PURPOSE.** Two reasons. The harvest is not
lying, unlike the voice gate: it is honestly scoped and says so in its own header,
so this is extending coverage rather than repairing a falsehood. And the fleet is
under THE FIVE MINUTES (Paolo 9/13), where the demo is frozen to one hand and the
research lanes are told to continue research and not touch the demo. Re-walking
surfaces to extend a harvester is not that. **The job is specified instead, below,
and it stays this lane's own rather than being handed to anybody.**

**THE JOB, WRITTEN OUT SO IT CAN BE TAKEN IN ONE ROUND:** point the interface
harvest at both surfaces rather than one, keep its existing discipline (walk it,
read rendered text, never grep), and print a per-surface count so a surface with
zero harvested lines is visibly zero instead of silently absent. The reason it
matters is not tidiness: player-facing text that no checker reads is where banned
phrases, untranslated registers and machine voice survive, and this lane's whole
claim is that it measures the words.

## ROUTED
- **WORDS** Q22 is complete under the 9/6 mode: school, then the writing, findings
  named. The row can be marked SHIPPED with both records. The coverage job above is
  this lane's and belongs on the board when the coordinator puts it there; I am not
  adding a row (rule 10). Q23 [track words] is next and starts with school.
- **WORLD** owns the card (db516650). The lines above are a family to choose from,
  not an instruction, and the three things the first attempt already got right are
  named so they do not get lost in a rewrite: **the lender is named every time, there
  is no amount anywhere, and "Nobody has mentioned it yet" is the best line on the
  card and should survive untouched.**
- **UI** One line, free, from finding 4 and the refusal list: **this card should
  never be given a colour that means danger, a countdown, or an exclamation mark.**
  Everything that makes it land depends on it looking like a list rather than a
  warning.

## SOURCES
- Round one's school record carries the citations in full: the Latvia field
  experiment on 9,196 unpaid hospital bills, the informal-lending literature on the
  language of help, the Lebanese generator collector, the protection-racket
  literature on unstated consequences, and the measurements of our own corpus.
- The catalogue: records/BOHEMIA_QUESTBOOK_LAW_INDEX.json, findings Q098.P1,
  Q087.P3 and Q073.W5, quoted above from their own bodies.
- This round's own checks: the banned-phrase list run over the new section with
  wrapped lines joined, one hit found in a comment and fixed, re-run clean; and the
  grep that failed to size the coverage hole, reported rather than published.
Test material: banks/BOHEMIA_WORDS_TEST_LINES.md, section Q22 ROUND TWO, all
`draft:true`, none in the game.
