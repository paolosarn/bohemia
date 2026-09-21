# WORDS -- A MOUTH, NOT A NARRATOR
# VAMILY round, 9/22/26, lane WORDS (words-8dqrnq). COOKED under rule 22 (Paolo 9/21).
# Lines: banks/BOHEMIA_WORDS_TEST_LINES.md, section "TWELVE MOMENTS", all draft:true.
# Registered in VOTE (alpha only): words-a-mouth-not-a-narrator-9-22

## WHAT GOT COOKED
**Twelve lines said by the person the speech bubble is drawn over**, replacing twelve
that are narration, plus three of them in three mouths. 18 cards, 0 in the dead zone,
0 clipped.

## RULE 12 FIRST: THE BLOCKER MOVED, SO I WENT AND LOOKED
Q26 was left "waiting on a body and a face". A dependency is a premise, not a gate, so
this round measured it instead of waiting on it. **Both halves landed while this lane
was writing.** PEOPLE shipped the body at the door on 9/20 and the name above it on
9/21. The bubble now draws a face and a heading saying who is talking.

So the blocker is gone, and the next question is the one this lane owns: **what does
that person say?**

## THE FINDING, AND IT IS THIS LANE'S OWN DEBT
**All twelve lines in the walk table are narration.** Read as data, not inferred:

    'they get up when you get close.'
    'somebody steps out. they want something.'
    'you hear it after it is already behind you.'
    'he is talking. not to you.'
    'it holds over you, then moves on.'
    'two of theirs, and they found each other.'

Every one describes the scene to the player in the third person. `walkSpeak()` puts
that string straight into `BARK.text`, and the bubble draws it under a name heading,
beside a face. **The game draws a named person and puts a narrator's sentence in their
mouth.**

## REPRODUCED ON THE GLASS, WITH THE INSTRUMENT THAT ALREADY EXISTS
Rule 14(g) says never report a break you have not reproduced on the glass, and it says
there is one driver. So I did not write a fourth instrument; I ran **PEOPLE's own
`face_at_the_door_gate.js`** and read what it prints. Verbatim:

    ok  *** A MOMENT IS SPOKEN BY A PERSON WHO IS THERE ***, which is rule 19(e)
        somebody steps out. they want something.
    NOTE  the face on the glass   32px at 85,234
    === FACE AT THE DOOR: 31 pass / 0 fail ===

A person, a 32 pixel face, on screen, saying a sentence about somebody stepping out.

## RULE 19 HAS TWO HALVES AND ONLY ONE OF THEM IS CHECKED
"Text comes from a mouth with a portrait" needs two things: a BODY on screen, and the
words to be SPEECH. **The body half is built, gated and green. The mouth half has no
checker at all**, so narration passes straight through a green gate.

**That is not PEOPLE's miss.** Their gate does exactly what it says and it caught real
things this round. The words are this lane's, and this lane wrote narration into a slot
that draws a face. A gate cannot fail a thing nobody asked it to look at.

## WHICH SCHOOL FINDINGS CHANGED THE LINES
1. **Q27: THE INSTITUTION APPEARS AS A RULE SOMEBODY STILL OBEYS.** Q27 school measured
   8 lines in 3,014 naming an institution at all. Three of these twelve carry one now:
   a wanderer still filing by a deadline to an office that is not there; a drone that
   "logs you and moves on", and "somebody still reads those", and nobody does; a taxi
   still running its route with nobody in it for years. Said plainly, in passing, never
   returned to.
2. **Q27: THE ORDINARY FRAME WITH ONE WRONG THING.** Nothing jumps and nothing is
   described as frightening. A neighbour mentions a fact and keeps walking.
3. **Q4: THE BOXES BITE HERE.** `barkHold()` in the city slice is the shipped reading
   policy inlined, 14 cps with the 833 ms floor, the 7,000 ms ceiling and rounding up
   to a beat. So these are whole bars: 2 bars each except one at 3.
4. **Q5: FIVE OF THE TWELVE ARE A WARNING OR A REFUSAL**, and not one is a competence
   disclaimer, which was the defect Q5 found in every refusal the game had.
5. **THE REGISTER RULE HELD A THIRD TIME.** My first cut of the two Spanglish toll
   lines came back at 68% and 70% fill, both from the shorter mouth overshooting one
   box. Fitted per mouth. Q5 round two, Q26 and now this: three for three.

## WHAT CHANGED IS WHO IS SPEAKING, AND IT IS THE ONLY EDIT
Four of the twelve are now the person the moment is ABOUT: the shakedown says its own
demand, the toll crew names its price at **one battery** (EVERYTHING COSTS ONE, so even
the road tax obeys his rule), the wanderer talks past you. The rest are a NEIGHBOUR
telling you what they can see. Nobody narrates, because a person standing in it would
not.

## WHAT THIS DOES NOT CLAIM
- **Nothing is in the game.** Rule 18 holds the play surface; rule 22(b) says the making
  is not held and everything made goes to VOTE. The swap is one table and it is ready
  the round the hold lifts or the owner takes it.
- **No new mechanism.** The table, the ids and `walkSpeak` are untouched. Twelve strings
  for twelve strings.
- **No reference game cited.**

## ROUTED
- **whoever owns the walk table** twelve strings for twelve strings, same ids, same
  lengths in whole bars. The swap costs nothing and does not touch the mechanism.
- **PEOPLE, with thanks and not a bounce** your gate is the thing that let this be
  reproduced instead of asserted. The half it does not check is the words, and the
  words were mine to fix.
- **whoever builds the rule 19 gate** the gate CLAUDE.md lists as OWED needs the mouth
  half as well as the body half: a player-facing sentence outside the phone needs a
  speaker id AND it needs to read as speech. The body half already has a checker.
- **WORDS, standing** the boxes apply wherever the reading policy is inlined, and
  `barkHold` is one of those places. Checked, not assumed.

## SOURCES
- `slices/BOHEMIA_CITY_WORLD.html`: `WALK_LINES` at line 39516, `walkSpeak` at 39560,
  `barkHold`, and the name heading added by PEOPLE 9/21.
- `gates/face_at_the_door_gate.js`, run this round, 31 pass 0 fail, output quoted above.
- `engine/bohemia_stage.js`, executed for every char, bar and fill figure.
- Q27 school for the institution finding, Q4 round two for the boxes, Q5 for refusal
  shapes and the register rule.
