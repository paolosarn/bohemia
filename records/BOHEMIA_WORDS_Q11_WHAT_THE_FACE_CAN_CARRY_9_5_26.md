# WORDS Q11 -- WHAT THE FACE CAN CARRY SO THE WORDS DO NOT HAVE TO
# VAMILY research round, 9/5/26, lane WORDS (words-8dqrnq). MODE: RESEARCH.
# The question, verbatim: "What the face can carry so the words do not have to.
# At 64 px with mouth, blink and brow, which emotions read without a word, and how
# games with a talking portrait split the load between face and text."

## THE ANSWER IN ONE LINE
**At 64 px the pixels were never the problem. All six universal expressions read
at a third of that size. Our face has ONE emotional channel, the brow, and it is
driven off punctuation we do not write, so 94.5% of every line in this game is
delivered by a flat face. Meanwhile 229 lines already carry the mood the face was
built to read, they ride into the shipped demo on the player's phone, and nothing
ever tells the face.**

## 1. THE FINDING THAT PROVES US WRONG
I went in expecting a resolution problem and a request for more art. Both wrong.

**64 px IS THREE TIMES THE FLOOR.** Du and Martinez measured expression
recognition down the resolution scale and found performance holds until the image
drops **below about 20 by 30 pixels**. Our portrait canvas is 64 by 64. There is
nothing to cook and nothing to ask COOK for. Every emotion we could want already
fits.

So I measured what our face is actually being told. `facePerform(id, t, line,
opts)` has exactly three outputs and here is what drives each:

    channel   what drives it today
    mouth     the LETTERS of the line (visemes). Carries no emotion at all.
    blink     whether a line is playing. One axis: talking or listening.
    brow      opts.mood if a caller passes a number, ELSE punctuation:
              a "?" lifts to +0.6, a "!" drops to -0.5, otherwise 0.

**The brow is the only emotional channel in the whole face.** Then I counted the
punctuation in all 1,669 NPC lines:

    carries "?"  brow lifts        90 lines     5.4%
    carries "!"  brow drops         1 line      0.1%
    carries both                    0
    NO CUE, brow pinned at 0    1,578 lines    94.5%

**There is exactly ONE line in this entire game that can make a face frown:**

    neighbor: "Hey. HEY. I told you the back was mine, I told you plain!
               Get away from that door!"

And the cause is our own good writing. This lane spent rounds killing shouty,
exclamation-heavy, on-the-nose dialogue, and it worked. **The better the words got,
the deader the faces got, because the face was reading emotion off the exact
punctuation the voice work was removing.** Nobody did anything wrong and the
result is a city of flat stares.

## 2. AND THE MOOD IS ALREADY WRITTEN. NOBODY TELLS THE FACE.
Every `@SAY` line in a quest file can carry a trailing tag. They do:

    504 SAY lines carry a mood field, 229 with a real value
        dread 66    wary 66    flat 41    tired 40    cold 10    hope 6

    example, quests/bq/S01_THE_METER_READER.bq:
        @SAY Because everybody on this block knows my face, man. I've got a kid. #dread
        @SAY Easy. Easy, easy. Don't touch that, it's live. #wary

**Those 229 tags are inside the shipped demo right now.** I counted them in
`DEMO_BQ` in the city file: 504 SAY lines, 229 mood tags, on the player's device.

And `facePerform` takes `opts.mood` as a number from -1 to 1, documented in its own
comment as the override. **Its only call sites pass `{}`.** An empty object.

**This is the third time this lane has found a built organ with no nerve running to
it** (Q7: the memory organ tracks familiarity and no dialogue reads it; Q10: the
voice engine has a `moodOf(text)` the face does not use). The pattern is now the
lane's most repeated finding and it is not a coincidence: **we keep building the
hard half and skipping the wire.**

## 3. WHICH EMOTIONS READ AT THIS SIZE, AND WHERE THEY LIVE ON THE FACE
Smith and Schyns used the Bubbles technique to find which part of the face and
which spatial frequencies each expression actually transmits:

    **HAPPINESS and SURPRISE live in the MOUTH, at LOW spatial frequency.**
    They survive blur, distance, and small size. They are the "distal" signals,
    built to be read across a street.
    **FEAR lives in the WIDE-OPEN EYE, at MID-TO-HIGH spatial frequency.**
    It is a close-range signal and it is the first thing lost when the face
    gets small.

That is a design instruction, not trivia. **At 64 px on a phone held at arm's
length, our strongest available reads are a mouth shape and a brow, and our weakest
is anything that depends on the whites of an eye.**

And the brow is not a minor channel. Sadr, Jarudi and Sinha removed features from
familiar faces and found recognition suffered **MORE from removing the eyebrows
than from removing the eyes**. We picked the strongest channel on the face by
accident. Then we fed it punctuation.

## 4. THE SECOND CHANNEL IS ALREADY BUILT AND IT IS FREE
One brow axis cannot carry our mood list. Look at it again:

    dread   wary   flat   tired   cold   hope

**Five of those six are the same quadrant: low-energy and negative.** A single
valence dial from -1 to 1 puts dread, wary, tired and cold on nearly the same
number, so the player would see one expression for 96% of our tagged lines.

The fix is not a new system. **It is the blink, which is already implemented,
already varies, and is already on a timer.**

Real numbers: an adult blinks about **every 3 to 5 seconds, roughly 20 a minute**.
The rate **rises with anxiety** and with non-visual cognitive load, and **falls
when visual attention demand goes up**. Ours runs on `BLINK_MIN_MS 2000,
BLINK_MAX_MS 9000`, with the talking face on the 9 s span (about 7 a minute) and
the listening face on 5.5 s (about 11 a minute). Both are slower than a real
resting face, and neither knows how the person feels.

**SO: BROW CARRIES VALENCE, BLINK CARRIES AROUSAL. Two channels, both built, and
that is enough to separate every mood we write.**

    mood     brow                blink                   what a player reads
    dread    down, drawn in      fast, short             something is coming
    wary     slightly down       fast, tracking          watching you, not the words
    flat     level               resting, about 4 s      nothing to give you
    tired    slack, inner up     slow, long closures     no fuel left
    cold     down, still         slow and few            already decided about you
    hope     slightly up         normal, a touch quick   a small opening

**The exact pixel values are DIRECTION's and CHARACTER's, by eye. The mapping from
our six words to two channels is the part that is mine.**

## 5. WHAT THE BEST GAMES DO WITH A TALKING PORTRAIT
- **ACE ATTORNEY** is the reference architecture and it is exactly our shape.
  Every character has a small set of sprites, and each has two loops: a TALKING
  loop and an IDLE loop. **The script tags the emotion, the sprite carries it, and
  the text carries only content.** The writer never types "he said angrily."
- **DISCO ELYSIUM** goes the other way on purpose: the portraits do not animate at
  all, so 100% of the emotional load is on the prose. It is the best-written game
  of its generation and it proves the split is a CHOICE, not a limitation. If the
  face does nothing, the words must do everything, and ours were written to be
  flat.
- **HADES** swaps whole portrait variants per emotional beat rather than animating
  one. Cheap, readable at a glance, and it costs art instead of code.

**The rule all three land on: the face carries HOW, the text carries WHAT. A line
that carries both says the same thing twice, and the second time is worse.**

## 6. AND HERE IS THE PART THAT IS OURS: OUR FACE'S FIRST JOB IS TO CONTRADICT
I looked for the lines where we tell the player how somebody feels, expecting to
find redundancy to cut. There are **6 in 1,669, and reading all six, four of them
are DENIALS:**

    when:hungry  "I'm fine. I ate yesterday."
    met:lied     "I'm not angry. I'm just done taking your word."
    hauler       "I'm not angry. I'm trying to understand it."
    neighbor     "There it is. That's the face I was afraid of."

**Those lines are broken without a face.** "I'm fine" is not information, it is a
person covering, and it only lands if the portrait disagrees with the sentence.
We have already written four lines that require the face to argue with the words,
and the face cannot, because nobody tells it anything.

**SO THE FACE'S FIRST JOB IN BOHEMIA IS NOT TO ILLUSTRATE THE LINE. IT IS TO
CONTRADICT IT.** That is worth more than any expression set: the moment a player
sees a face that does not match the mouth, they have learned something nobody told
them, and that is the whole promise of a talking portrait.

## 7. WHAT THIS ASKS OF THE WORDS, WHICH IS MINE
1. **THE MOOD PALETTE IS TOO NARROW AND THAT IS A WRITING PROBLEM, NOT AN ART ONE.**
   Six moods, five in one quadrant, and hope is 6 lines out of 229 (2.6%). Nowhere
   in this city is anybody amused, relieved, warm, or angry. Q8 found that over half
   of real bereaved people laugh while telling the story. **We need at least warm
   and at least sharp, or the face has nothing to do but sag.**
2. **TAG EVERY SPOKEN LINE, NOT 14% OF THEM.** 229 of 1,669 carry a mood. The
   other 1,440 give the face nothing, and a face with nothing is a face at zero.
3. **AND ONE NEW USE OF THE TAG THAT COSTS NOTHING: LET IT DISAGREE.** A `#dread`
   on a line that says "I'm fine" is not an error, it is the best tool on this
   list, and our format already allows it.

## ROUTED
- **WORDS**  Q11 answered. Next open is Q12 [naming people].
- **WORDS**  NEW ROW `MOOD-ON-EVERY-LINE`: widen the mood palette past one quadrant
  and tag all 1,669 spoken lines, including the ones where the tag contradicts the
  sentence. Held until MODE: BUILD.
- **CHARACTER**  This is the one that matters. `facePerform` is called with `{}` and
  229 moods are already sitting in the shipped data. Pass the tag. Brow carries
  valence, blink carries arousal, and the six-mood table above is the mapping. This
  is a wire, not a feature.
- **UI**  A portrait that never changes is furniture. If the mood reaches the face,
  the portrait needs to be on screen long enough to be read, which is the same
  one-beat hold this lane has now asked for six rounds running.
- **DIRECTION**  The exact brow and lid pixel values per mood, by eye. Happy and
  surprise are carried by the MOUTH at low spatial frequency, fear by the eye at
  high, so at 64 px the mouth and brow are the reliable channels and the eye is not.
Test material: banks/BOHEMIA_WORDS_TEST_LINES.md, all `draft:true`, none in the game.

## SOURCES
- Du and Martinez, The resolution of facial expressions of emotion, Journal of
  Vision 2011: recognition holds down to roughly 20 by 30 pixels and is only
  impaired below that; 64 by 48 and under showed little deterioration.
- Smith and Schyns, and the Bubbles work on expression transmission: happiness and
  surprise are carried by the mouth at low spatial frequency and survive distance
  and blur; fear is carried by the wide-open eye at mid-to-high frequency and is a
  close-range signal.
- Sadr, Jarudi and Sinha, The role of eyebrows in face recognition, Perception
  2003: removing the eyebrows costs recognition more than removing the eyes.
- Spontaneous blink research: baseline about one blink every 3 to 5 seconds, around
  20 a minute, rising with anxiety and non-visual cognitive load and falling as
  visual attention demand rises.
- Ace Attorney's sprite architecture (a talking loop and an idle loop per emotion,
  switched by a tag in the script); Disco Elysium's deliberately static portraits;
  Hades' swapped portrait variants.
- Our own build: 1,669 NPC lines with every punctuation hit counted and the single
  exclamation read; 504 SAY lines carrying a mood field, 229 with a value, all 229
  present in the shipped DEMO_BQ; facePerform's three channels and its two call
  sites, both passing an empty options object.
