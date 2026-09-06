# WORDS Q13 -- RUMOUR: HOW TRUE AND FALSE NEWS MOVES BY SPEECH ALONE
# VAMILY research round, 9/5/26, lane WORDS (words-8dqrnq). MODE: RESEARCH.
# The question, verbatim: "Rumour. How true and false news moves through a small
# world by speech alone, in the real record and in the best games, for the
# man-who-lives-tells-people axis (day 12)."

## THE ANSWER IN ONE LINE
**Our city already gossips properly. It has a hop count, hearsay decay, and a
rule that a quiet deed dies with the witness while a notorious one is what your
child gets judged for. And in 1,669 lines it has passed on news about somebody
other than the player exactly ONCE, and it has never once been wrong. We already
wrote the line where a stranger says "probably the wrong version." There has never
been a wrong version.**

## 1. WHAT WE ACTUALLY BUILT, WHICH IS MORE THAN I EXPECTED
This round started as a hunt for a missing system and found a good one. Measured
in the code, not assumed:

    engine/bohemia_standing.js
      gossip(mindA, mindB, turn)   moves a deed from one mind to another
      HEARSAY_LOSS 0.55            a retold deed keeps 55% of its force
      MAX_HOPS 2                   eyewitness, told, told, then it stops dead
      "nobody gossips to your face" a deed skips the actor's own mind
      inherit()                    carries a deed to the next generation ONLY if
                                   somebody retold it (hops > 0)

    engine/bohemia_deeds.js
      hopsFor(tag)                 #quiet gets 1 hop, #reckless gets 5
      reachOf(tag)                 how far the original act was seen

And the law those two write together, in standing.js's own words:

    "A QUIET GOOD DEED DIES WITH THE WITNESS.
     A NOTORIOUS ONE BECOMES THE THING YOUR CHILD IS JUDGED FOR."

That is a real rumour engine and it is running in the live city. **This lane owes
it words, not a redesign.**

We even wrote the hearsay voice, and it is good:

    heard:notable   "It got to me third-hand and it still had your name on it."
    heard:quiet     "I heard a version of it. Probably the wrong version."
    heard:reckless  "I'd never met you and I already had an opinion."
    heard:risky     "I heard, and I heard who was standing near you when it happened."

## 2. THE FINDING THAT PROVES US WRONG, IN TWO PARTS
I searched all 1,669 NPC lines for a hearsay marker (I heard / they say / word is /
somebody said / dicen / se dice) and read every hit.

    hearsay markers: 17 of 1,669 = 1.0%

    12 of the 17 are the heard: and rung: reaction pools, and EVERY ONE OF THEM IS
       ABOUT THE PLAYER.
     3 are the same denial in three registers: "That's not a rumour, that's my
       cousin."
     1 is a metaphor: "A private sacrifice is a rumor by spring and a grudge by
       summer."
     1 is the only line in this entire game where a person passes on news about
       the world:
           father: "They're saying the water district's hiring again.
                    I'll go down Monday."

**PART ONE: EVERY RUMOUR IN BOHEMIA IS A RUMOUR ABOUT YOU.** A gossip system that
only ever carries the player's reputation back to the player's own face is not a
world, it is a mirror. One line in 1,669 tells you something about anybody else.

**PART TWO: THE HOP COUNT NEVER REACHES THE MOUTH.** The engine records `hops` and
hands `heard` and `hops` back on recall. But the line picker reads
`opts.heard`, and `opts.heard` carries the CLOUT TAG, never the hop count:

    engine/bohemia_people.js:2461   var heard = (opts && opts.heard) || null;
    engine/bohemia_people.js:2484   || (heard && react('heard:' + heard))

So a story that reached somebody first-hand and a story that reached them after
five retellings **pick from the same two or three lines.** The engine models
distortion as a NUMBER GETTING SMALLER. The mouth says the identical sentence.

**A RUMOUR IN BOHEMIA GETS QUIETER. IT NEVER GETS WRONG.**

## 3. THE REAL RECORD, AND THE CLASSIC ANSWER DOES NOT REPLICATE
**ALLPORT AND POSTMAN (1947)** ran serial-transmission chains and named three
processes, which is the textbook answer and the one I expected to hand over:

    LEVELLING     the account gets shorter, more concise, easier to grasp
    SHARPENING    a few details are selected, kept and amplified
    ASSIMILATION  the story bends to fit the teller's own expectations

and the formula **R = i x a**: how much rumour is in circulation varies with the
IMPORTANCE of the subject times the AMBIGUITY of the evidence.

**AND HERE IS WHERE I WOULD HAVE BEEN WRONG.** Studies of naturally occurring
rumours **do not reproduce levelling and sharpening**; some real rumours are
EXTENDED rather than shortened, and some barely change at all. There is even a
published paper on how badly the original study is misquoted across the
literature. **The lab result is a classroom chain with no stakes. A real rumour
lives in a group that wants something from it, and it GROWS.**

So the mechanic to take is not "the story shrinks." It is:

    **AMBIGUITY IS THE FUEL.** R = i x a. Where nothing is confirmed and it
    matters, talk multiplies. Confirm it and the rumour dies. That is a
    switch a game can hold.

**SHIBUTANI (1966)** gives the frame that fits our city exactly: **rumour is
IMPROVISED NEWS.** It is not a distortion or a pathology, it is a group's
collective problem-solving in a situation nobody has defined yet, and it appears
precisely when the official channels **fail, do not exist, or cannot be trusted.**
Participants pool observations, anxieties and interpretations to bring uncertainty
down.

**IN A COLLAPSED CITY, RUMOUR IS NOT A FLAVOUR. IT IS THE PRESS.** Nothing else is
running. And it gives the writing rule directly: **a rumour scene is not one person
telling another a fact, it is two or more people trying to work out what happened.**
Ours are announcements. Real ones are deliberation, and deliberation is a question
and a partial, not a statement.

**FALSE NEWS TRAVELS FURTHER, MEASURED.** Vosoughi, Roy and Aral in Science, about
126,000 rumour cascades spread by roughly 3 million people:

    the top 1% of FALSE cascades reached 1,000 to 100,000 people
    the TRUTH rarely reached more than 1,000
    falsehood was 70% MORE LIKELY to be retweeted than truth

and the proposed mechanism is **NOVELTY** plus the emotion it provokes. A true
thing is usually a thing you half knew. A false thing is new, and new is what
people pass on.

## 4. THE BEST GOSSIP SIMULATION IN THE MEDIUM HAS THE SAME HOLE WE DO
The deepest one ever shipped works almost exactly like ours: rumours originate
with the WITNESSES of an event and spread outward one teller at a time, knowledge
fades over weeks and years while the reputation effect lasts longer, and the
transfer happens where strangers mix, a tavern or an arriving visitor. Kill or
remove every witness and the news never leaves.

**AND IN THAT GAME, NO FALSE RUMOUR EVER SPREADS.** The one documented exception
is a character with a secret identity.

So the most sophisticated model in games carries only true things, and the real
record says the false ones are the ones that travel. **That is open ground, and it
is ours to take.** It also costs nothing to build: a false rumour is the same row
in the same organ with one field changed.

## 5. THE MAN WHO LIVES IS THE ONE WHO TELLS PEOPLE
The day 12 study set the axis this round is for: what you are KNOWN TO DO, kept
separate from who likes you, and **"the survivor is the one who tells people."**

Rumour research sharpens that into a rule, because the survivor is not a neutral
channel. He is a zero-hop eyewitness **with a reason to sharpen.** Assimilation
says the story bends toward the teller's own interests, and a man you let walk has
to explain to his own people why he is alive.

**SO THE SPARED MAN'S VERSION IS ALWAYS THE ONE WHERE YOU WERE MORE FRIGHTENING
THAN YOU WERE, BECAUSE THAT IS THE ONLY VERSION IN WHICH HE IS NOT A COWARD.** The
mercy verb does not just feed the axis. It feeds the axis a story with a bias in
it, and the bias is free characterisation for a man the player will never meet
again.

## 6. THE SPEC: WHAT A RUMOUR SOUNDS LIKE AT EACH HOP
The engine already knows the number. This is what the mouth does with it.

    HOPS  what survives                    the shape of the line
    0     everything: name, place, detail  "I was there. He came up the alley."
    1     the name and ONE detail          "Ruben says the man had a dog with him."
    2     the detail, the name is gone     "Somebody let somebody go. That's what
                                            I've got."
    3+    no facts, only a moral           "Whoever it was, they didn't have to.
                                            That's the part people repeat."

**AND THE FOUR RULES:**
1. **DELIBERATION, NOT ANNOUNCEMENT.** A rumour line ends in a question or an
   admission of a gap. "That's what I've got" is worth more than a fact.
2. **THE HOP COUNT REACHES THE MOUTH.** One field, already computed, already
   returned by recall, and it changes which pool speaks.
3. **SOMETIMES IT IS WRONG, AND THE PLAYER CAN FIND OUT.** A false rumour that
   can never be corrected is noise. One that the player can walk across town and
   disprove is a quest nobody had to write.
4. **AMBIGUITY IS THE FUEL AND CONFIRMATION IS THE OFF SWITCH.** R = i x a. The
   moment a thing is settled, people stop saying it. That is why a rumour should
   thin out when the player resolves the thing it is about.

## ROUTED
- **WORDS**  Q13 answered. Next open is Q14 [one-word answers].
- **WORDS**  NEW ROW `NEWS-ABOUT-SOMEBODY-ELSE`: one line in 1,669 passes on news
  about anyone but the player. Write the third-party news register, and write the
  hop ladder above as four pools instead of one. Held until MODE: BUILD.
- **PEOPLE**  The line picker takes the clout tag and drops the hop count. Pass
  `hops` through alongside `heard` and the four pools above light up for free.
  Nothing new is computed; recall already returns it.
- **WORLD**  A false version of a true deed is the same row with one field
  changed, and the real record says the false ones travel furthest. It also needs
  somewhere strangers mix, because news moves where people who do not already
  share what they know meet.
- **COMBAT**  The spared man is a zero-hop eyewitness with a motive to exaggerate.
  His version should overstate you, and that is correct, not a bug.
- **UI**  The city feed already reads the deed ledger. A feed post that is WRONG,
  and later corrected, teaches the player more about this world than ten true ones.
Test material: banks/BOHEMIA_WORDS_TEST_LINES.md, all `draft:true`, none in the game.

## 7. A RULE I HAD BEEN GETTING WRONG, FIXED THIS ROUND
The 8/28 law says I may research anything and bring back a MECHANIC, but the canon
of what this game is aimed at is Paolo's list, and **a mechanic goes into a brief
in plain words with no borrowed name attached.** Checking my own eleven records, one
ROUTED line carried a borrowed game name into another lane's brief, and three bank
comments attached a rule to a game's name. All four are rewritten in plain words.
Research citations stay in SOURCES, where they are sources and not references.

## SOURCES
- Allport and Postman, The Psychology of Rumor (1947): serial transmission,
  levelling, sharpening and assimilation, and R = i x a. With the caveat, from the
  later literature, that naturally occurring rumours often do not level and some
  are extended instead, and that the original study is widely misquoted.
- Shibutani, Improvised News (1966): rumour as collective problem-solving in an
  inadequately defined situation, arising when official channels fail, do not
  exist, or cannot be trusted; participants pool observations and interpretations.
- Vosoughi, Roy and Aral, The spread of true and false news online, Science 2018:
  about 126,000 cascades and 3 million people; the top 1% of false cascades reached
  1,000 to 100,000 while truth rarely passed 1,000; falsehood 70% more likely to be
  retweeted; novelty and emotional response as the proposed mechanism.
- The deepest gossip simulation shipped in a game: rumours originate with witnesses
  and spread teller by teller, knowledge fades over weeks and years while reputation
  lasts longer, transfer happens where strangers mix, and no false rumour ever
  spreads.
- Our own build: engine/bohemia_standing.js gossip(), HEARSAY_LOSS 0.55, MAX_HOPS 2,
  inherit() gated on hops > 0; engine/bohemia_deeds.js hopsFor() and reachOf();
  engine/bohemia_people.js lines 2461 and 2484, where the clout tag reaches the line
  picker and the hop count does not; 17 hearsay-marked lines in 1,669, every one read
  by hand.
- records/BOHEMIA_BB_STUDY_DAY_12_A_FIGHT_ENDS_WHEN_SOMEBODY_LEAVES_8_28_26.md, for
  the axis this round serves.
