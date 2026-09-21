# WORDS -- Q27 ROUND TWO, AND Q26: THE PHONE'S VOICE AND THE FIRST ASK SPOKEN
# VAMILY round, 9/21/26, lane WORDS (words-8dqrnq). COOKED under rule 22 (Paolo 9/21).
# Lines: banks/BOHEMIA_WORDS_TEST_LINES.md, section "Q27 ROUND TWO + Q26", all draft:true.
# Registered in the VOTE tab (alpha only, rule 15 as corrected 9/20):
#   words-the-phone-notice-9-21        vote/WORDS_THE_PHONE_NOTICE.txt
#   words-the-first-ask-spoken-9-21    vote/WORDS_THE_FIRST_ASK_SPOKEN.txt

## WHAT GOT COOKED
**A NOTICE ON THE PHONE FROM AN OFFICE THAT CLOSED**, printed twice because a real
shutoff notice has to be, and **THE FIRST PERSON AT HIS DOOR, SPEAKING**, with no name
until he asks for one. 33 lines. 18 of them are in a mouth.

Rule 22 landed this round and it is why this is a cook and not a second school round:
school is never two rounds in a row for a making lane, and WORDS makes lines in a mouth.

## WHICH SCHOOL FINDINGS CHANGED THE LINES
1. **THE INSTITUTION HAS TO EXIST BEFORE IT CAN HAVE A VOICE.** Q27 school measured 8
   lines in 3,014 naming an institution at all. The row asked for the voice the world's
   text is written in; the measurement said there was almost no world's text. So this
   round PUT ONE ON THE SCREEN rather than styling one that was not there. The notice is
   an institution. The person at the door carries one in their mouth as a rule they
   still obey.
2. **THE INSTITUTIONAL VOICE IS LEGAL ON THE PHONE AND ON MACHINES, NOWHERE ELSE**
   (rule 19). The notice is a form on the phone he opens. It does not pop up.
3. **THE SKELETON SURVIVES ITS AUTHOR.** The notice carries the parts a real
   disconnection notice must carry: the source, what happened, the amount, the
   reconnection FEE, how to dispute, and the office hours. Every part is correct and
   none of it is reachable. **Nobody wrote a scary sentence.** The office hours line is
   the one that does the work.
4. **ISSUED TWICE.** In many jurisdictions the notice must be served in English and in
   Spanish. So THEY SPEAK SPANGLISH reaches the institution by a route it has never
   used: a person code-switches, a notice is issued twice.
5. **FLATTER IS NOT AVAILABLE** (one exclamation mark in 3,014 lines). Nothing here is
   written flatter. The notice is flat because a form is flat, and the person standing
   next to it is not.
6. **THE INSTITUTION IN A MOUTH**, which is the finding that fixes the 0.3% without a
   narrator: "District property. There is a fine for touching it." followed by "Nobody
   has collected a fine on this street in ten years." A rule somebody still obeys, and
   the body that made it gone, said in passing and never returned to.

## THE RULER CORRECTION, CAUGHT BEFORE IT BECAME A MISTAKE
I box-fitted the notice first, against Q4 round two's character boxes, and **seven of
thirteen lines came back in the dead zone.** The instinct was to rewrite them.

Instead I checked the premise. **Q4 school section 8 already ruled that text the PLAYER
holds has no clock**, which is why a choice is not timed. The phone is a thing he opens
and reads at his own pace. **IT HAS NO CLOCK, SO THE BOXES ARE THE WRONG RULER FOR IT**,
and fitting a form to a card's timing would have been exactly the class of error this
lane has now recorded five times.

The boxes are applied in full to the 18 spoken lines, where the game does hold the card.
All 18 are clean: 0 in the dead zone, 0 clipped.

## THE RULE THAT IS NOW TWO FOR TWO
Q5 round two found that **a register changes the box**: the shorter mouth overshoots one
box and undershoots the next. On brand new material this round, my first pass at the
nine three-mouth lines put **five of them in the dead zone at 55 to 79% fill**, every one
for that reason. It is not a one-round observation any more.

## WHAT I MAY NOT DO, AND DID NOT
- **THE FIRST PERSON IN THE GAME HAS NO NAME.** Paolo 7/31: "Nobody will have a name
  unless you talk to them and ask them for their name." `KNOWN_AT_START` in
  `engine/bohemia_people.js` is empty on purpose and `people_gate` fails if it gains a
  row, because naming a main-quest person is a ruling. So they speak as a stranger, the
  player earns the name by asking, and the dodge is the answer until then. **No pronoun
  is used anywhere in the set**, so nothing here decides who they are either.
- **NO INSTITUTION IS NAMED.** "Meter Services" and "the district office" are ROLES, the
  same discipline the haggle module already uses for "somebody who holds things for
  strangers". Naming the body that ran this valley is his.
- **NO NEW MECHANISM.** The three shapes are the haggle module's own (upfront, held,
  first) with their existing ids and their existing answer to who is exposed. These are
  the words for them, not a second system.
- **NO REFERENCE GAME**, in this round or either Q27 round.
- **NOTHING SHIPPED TO THE DEMO OR THE ALPHA'S PLAY TABS.** Rule 18's hold is on the
  play surface; rule 22(b) says the making is not held and everything made goes to VOTE.

## THE THREE PROOF LINES THE ROW ASKED FOR
School listed twelve narrator-prose lines that die under rule 19. Three are moved here,
which is the proof the row wanted:

    "The Meter Reader: nobody picked it up"          -> "Read request, six streets east.
    (named in Paolo's own law as dying)                  Unclaimed."
    "Nobody holds this ground yet. No faction has    -> "District holder: none on file."
     claimed this district, so there is nobody
     here to ask."
    "The top rung is still out of reach. Nobody      -> "Nobody has ever told me what the
     has said what it takes to stand there."             top of this looks like."

The first two become the phone's own words, because they are bookkeeping and the phone
is where bookkeeping is legal. "Unclaimed" and "on file" are a form's words and there is
no narrator in either. The third is a person's opinion rather than a record, so it goes
into a mouth instead.

## I CALLED A RED MINE ON TWO SAMPLES AND I WAS WRONG
The vote tab gate went 27 ok, 1 failed with my registry entries in. Clean tree: 28/0.
Two samples, one clean and one dirty, and I wrote down that the red was mine.

It is not. I ran it five more times. **My tree failed three times and THE CLEAN TREE
ALSO FAILED on its third run.** The leg is load-dependent, not content-dependent.

And I have the opposite proved on the glass, which is what rule 14(g) actually asks
for. I drove the alpha the way the gate does, on MY tree, with both items registered:

    setvote visible: true after 1539 ms
    <div id="setvote" class="setbtn" role="button" tabindex="0">VOTE ON WHAT IS NEW</div>
    display flex, parent flex, page errors 0

**The button the gate waits for is there in a second and a half with my change in.** The
failing leg gives it a 10 second window at the end of a long multi-browser sweep, after
several pages have already been driven on the same box.

TWO THINGS I OWE FROM THIS, and they are the same mistake in two sizes:
- **A RED IS NOT ATTRIBUTED BY ONE PAIR OF RUNS.** One clean pass and one dirty fail is
  the weakest possible evidence and I treated it as proof. The correct move, which I
  only made after guessing twice at causes, was to run the clean tree again.
- **I INVENTED A CONVENTION THE REGISTRY ALREADY HAD.** My first cut wrote the vote text
  to `records/target/vote/*.txt` and pointed `show.src` at the path. Every other text
  item in that registry carries the text INLINE in `src`, and the image items live under
  `slices/vote/`. REUSE-FIRST, in the same round I wrote a record about reading the repo
  first. The folder is deleted and the text is inline like everybody else's.

ROUTED TO UI, who owns that gate: the leg is flaky under load and the button is fine.
Reproduction above. Not touched by this lane.

## ROUTED
- **WORDS** Q27 has both rounds. Q26 is cooked and its lines are in the bank and in the
  vote tab; it stays claimed until the surface that speaks them exists.
- **QUESTS [a person asks] and PEOPLE [face at the door]** the words for the first ask
  are written and registered. They need a body and a face, not more writing. The person
  is unnamed by law and the dodge line is there for the moment he asks.
- **UI [talk panel]** the opening is three cards of two bars each. The set is written to
  a panel that holds one speaker's line at a time, not to a card of bullets.
- **whoever owns the phone** the notice is a FORM, not a feed post. Its shape is the
  legally required parts of a real disconnection notice and it is printed twice.
- **RUN [no pop ups]** three of your twelve dead lines now have a replacement that is
  legal under rule 19. The other nine are still listed in Q27's school record.
- **WORDS, standing** the phone has no clock and the boxes do not apply to it. Written
  into the bank beside the notice so the next round does not re-learn it.

## SOURCES
- `engine/bohemia_stage.js`, executed for every char, bar and fill figure.
- `engine/bohemia_haggle.js` lines 150 to 194: the three shapes, their ids and who each
  one exposes. `engine/bohemia_people.js` lines 100 to 112: the empty KNOWN_AT_START and
  why it is empty.
- Q27 school, for the measurement and the notice skeleton:
  records/BOHEMIA_WORDS_Q27_SCHOOL_WE_WROTE_THE_SURVIVORS_AND_NEVER_THE_THING_THAT_STOPPED_9_20_26.md
- Q4 round two for the boxes and section 8 for the no-clock rule; Q5 round two for the
  register rule; Q16 for the meter as the weapon of the weak; Q21 and Q24 for hide the
  need, propose a shape, and a thank you that is not warm.
