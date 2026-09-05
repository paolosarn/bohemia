# WORDS Q7 -- THE SECOND CONVERSATION
# VAMILY research round, 9/5/26, lane WORDS (words-8dqrnq). MODE: RESEARCH.
# The question, verbatim: "The second conversation. How speech changes when a
# person REMEMBERS you (our memory organ already tracks it). What the best games
# do with a returning player, and what they do wrong."

## THE ANSWER IN ONE LINE
**A second conversation is SHORTER, not warmer, and it is the one thing everybody
writes backwards: we have eleven lines that frame a FIRST meeting and effectively
ONE that knows it has met you before.**

## 1. THE FINDING THAT PROVES US WRONG
Swept all 1,669 spoken lines:

    marker                                lines   share
    frames a FIRST meeting                  11    0.7%   ("you're new", "new face")
    names a shared past deed                 7    0.4%
    refers to a past meeting                 5    0.3%
    RECOGNISES YOU                           2    0.1%
    shortened reference (the second-mention  0    0.0%
      form, said without explaining)

And the two recognition lines are the same line twice, once in each register:

    "You again. That's not a complaint."
    "You again. Is not a complaint."

Four of the five past-meeting lines are likewise two English/Spanglish pairs. So
the honest count is **ONE recognition line and THREE past-meeting lines in the
entire build**, all sitting in the belonging bank, none of them gated on anything.

**We write the first meeting eleven times and the second meeting once.**

## 2. AND THE ORGAN THAT WOULD DRIVE IT IS ALREADY BUILT
`engine/bohemia_memory.js` is a working witness organ: a ring-buffered mind per
person, sightings that refresh instead of duplicating, a familiarity counter per
subject, and clarity decaying as `0.5 ^ (age / halflife)` with the halflife
GROWING with familiarity. A stranger's face is fog in twelve hours; a face seen
often keeps for days.

It already answers "do you know this person, and how well". Nothing in the words
asks it.

**One line in the whole build gates on having met somebody**, and it is casting,
not speech:

    @ROLE fixer OPT faction=NETWORK met_before=false

That picks WHO appears. Not one syllable of WHAT THEY SAY changes because they
know you.

## 3. THE SCIENCE, AND IT IS THE OPPOSITE OF THE INSTINCT
**Clark and Wilkes-Gibbs (1986), referring as a collaborative process.** Two people
who cannot see each other have to agree what to call a set of hard-to-describe
shapes. The first reference is long, negotiated and repaired across several turns.
Once they settle on a label, they REUSE it, and across repeated trials **the
referring expressions get shorter and the number of turns falls**. That settled
label is a conceptual pact and it becomes part of their common ground.

**So the mark of a second conversation is COMPRESSION.** Not warmth, not a greeting,
not "good to see you again". The proof that two people have met is that they stop
explaining things.

The instinct, and what we would obviously have written, is a warmer and LONGER
second meeting. That is exactly backwards, and it is measurable: our "shortened
reference" count is zero, because we have no second conversations to shorten.

## 4. WHAT THE GAMES GET WRONG, WHICH IS THE SAME THING FROM THE OTHER SIDE
The standard failure is an NPC greeting you identically after you have spent hours
on their behalf: you helped their brother out of the city, you come back, and you
get the line a stranger gets. The diagnosis in the craft writing is blunt and it is
about state, not prose: teams build the dialogue TREE and underinvest in the STATE
MACHINE, so nothing has anywhere to remember from.

**We have the opposite problem and it is the better one to have.** Our state
machine exists and is good. Our prose has nothing that reads it. That is a much
cheaper fix than the reverse.

The rule the same writing lands on: **every significant thing a player does should
leave a trace that at least one later conversation can point at.** Our deed ledger
already records the traces.

## 5. WHAT THIS SAYS TO DO, WHEN THE LANE RETURNS TO BUILD
1. **SECOND LINES ARE SHORTER THAN FIRST LINES.** The cheapest possible version and
   the one the science actually supports: every scene that can repeat gets a
   FIRST-MEETING line and a SHORTER SECOND-MEETING line that drops the explaining.
   Not a warmer line. A shorter one.
2. **DROP THE INTRODUCTION, KEEP THE ASK.** First: "There's a feed. There's always a
   feed. Do you want this room on a list?" Second: "Same room. Same question."
3. **THE THIRD MEETING DROPS FURTHER**, to the settled label alone. That is the
   conceptual pact, and it is free characterisation: what two people have agreed to
   call a thing IS their history.
4. **FAMILIARITY IS ALREADY A NUMBER**, so this is a dial and not a table. The organ
   hands over how well somebody knows you; the line length can follow it.
5. **AND THE FIRST-MEETING LINES ARE NOT WASTED.** All eleven stay. They just stop
   being the only thing anybody ever says.

## ROUTED
- **WORDS**  Q7 answered. Next open is Q8 [grief talk].
- **WORDS**  NEW ROW `SHORTER-THE-SECOND-TIME`: a first/second/third variant for
  every repeatable scene, each shorter than the last, driven by the familiarity
  number the memory organ already keeps. Held until MODE: BUILD.
- **PEOPLE / LIFE**  `engine/bohemia_memory.js` exposes familiarity and clarity and
  no dialogue reads either. Wiring that is theirs, and it is the whole unlock.
- **QUESTS**  A scene that can be entered twice needs two versions of its opening
  line, and only its opening line.
Test material: banks/BOHEMIA_WORDS_TEST_LINES.md, all `draft:true`, none in the game.

## SOURCES
- Clark and Wilkes-Gibbs, "Referring as a collaborative process" (1986), and the
  lexical-entrainment literature after it: repeated reference to the same thing
  shortens the expression and cuts the number of turns; the settled label is a
  conceptual pact held in common ground.
- The craft writing on NPC memory failure: the returning player greeted as a
  stranger, diagnosed as an under-built state machine rather than bad prose, with
  the rule that every significant choice should leave a trace one later
  conversation can reference.
- Our own `engine/bohemia_memory.js` (ring-buffered minds, familiarity counters,
  clarity halflife) and 1,669 spoken lines swept for recognition.
