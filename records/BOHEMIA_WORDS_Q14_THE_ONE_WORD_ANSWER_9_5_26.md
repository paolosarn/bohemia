# WORDS Q14 -- THE ONE-WORD ANSWER
# VAMILY research round, 9/5/26, lane WORDS (words-8dqrnq). MODE: RESEARCH.
# The question, verbatim: "The one-word answer. When the best games let a character
# answer in one word and why it lands. Test lines: twenty one-word answers, each a
# different person."

## THE ANSWER IN ONE LINE
**More than a third of every answer a real person gives to a question is ONE WORD.
We have five one-word lines in the whole game. Not five percent. Five lines. And
the reason a one-word answer lands is that it says obviously less than the moment
needs, so the listener has to supply the reason themselves, which is the cheapest
and strongest thing a writer can do and we have done it five times in 1,669.**

## 1. THE MEASUREMENT, EVERY HIT READ
Our 1,669 NPC-spoken lines by length:

    1 word         5    0.3%
    2 words       16    1.0%
    3 words       26    1.6%
    4-5          132    7.9%
    6-10         633   37.9%
    11-20        568   34.0%
    21+          277   16.6%

    mean 13.1 words, median 11.

**Only 3.5% of everything anybody says in this game is three words or fewer, and
half of it is eleven words or more.**

Here is every short line in the build, read by hand:

    say       pastor      "Once."
    say       hauler      "Well."
    say       neighbour   "Maybe."
    exchange  worker      "And?"
    exchange  watch       "Three."
    bark      x12         "..."   (the sleep bark, four roles x three registers)

**Five real one-word answers, and twelve of a character asleep.**

And the five that exist are exactly right. "Once." and "Maybe." and "And?" are the
whole technique, sitting in our own build, unrepeated.

**A COUNTING NOTE, BECAUSE THIS LANE HAS BEEN BURNED BY DEFINITIONS.** A first pass
said 17 one-word lines, 1.0%. That regex counted "..." as one word. Counting actual
words gives 5, or 0.3%, plus 12 lines of ellipsis. Both numbers were arithmetically
right and only one answers the question. **The ruler was not broken this time; the
DEFINITION was, and reading all 17 by hand is what separated them.**

## 2. THE THREE-CORPUS RULER, AND THE OBJECTION IT HAD TO SURVIVE
First pass, every turn in each corpus:

    REAL SPEECH  n=199,740   mean  7.3   median  5   one word 29.2%
    FILM         n=304,446   mean 10.6   median  7   one word  7.3%
    GAME         n= 29,213   mean 15.6   median 14   one word  1.1%
    BOHEMIA      n=  1,669   mean 13.1   median 11   one word  0.3%

**AND THAT 29.2% IS NOT WHAT IT LOOKS LIKE.** The real-speech corpus is dialogue-act
tagged, and reading the tags on those one-word turns: **36,107 of 58,391 are tagged
BACKCHANNEL.** They are not answers, they are the noises a listener makes while
somebody else talks: uh-huh, yeah, right. Quoting 29.2% as "how often people answer
in one word" would have been the same class of mistake as every broken ruler this
lane has logged.

So I built the tight one. Find every turn tagged as a QUESTION, take the next turn
by the other speaker, **and throw out backchannels and abandoned turns**:

    REPLIES TO A QUESTION, backchannels excluded    n = 9,087
        mean 5.5 words, median 3
        ONE WORD           35.3%
        two or fewer       46.4%
        three or fewer     53.2%

**The number went UP, not down, when I removed the thing that could have inflated
it.** More than a third of real answers are one word. More than half are three or
fewer.

Same measure on the other corpora, taking the line after any line ending in a
question mark:

    answering a question, one word
    REAL SPEECH  35.3%   (n=9,087)
    FILM          7.5%   (n=77,598)
    GAME          0.8%   (n=4,756)

**Real speech, then film, then game writing: 35, then 7, then under 1.** Game
dialogue is roughly forty times less likely than a real person to answer a question
in one word. Film sits in between, which is what you would expect from writing
that has to be performed but also has to move.

**AND OUR OWN AFTER-A-QUESTION NUMBER IS NOT REPORTABLE.** Our quest format does not
put questions and answers in one addressable sequence, so the same measure found
only n=14 lines in our corpus. **Fourteen is not a rate and I am not quoting it as
one.** The whole-corpus number, 5 of 1,669, is the honest one.

## 3. WHY A ONE-WORD ANSWER LANDS, WHICH IS TWO DIFFERENT REASONS
**REASON ONE: LENGTH IS A SIGNAL, AND EVERY LISTENER ALREADY READS IT.**
Conversation analysis calls it preference organisation, and it is one of the most
replicated findings in the field:

    A PREFERRED response is delivered immediately, plainly, with NO account.
    A DISPREFERRED response is delayed, prefaced (uhm, an inbreath), hedged,
    and comes wrapped in a REASON.

Measured in 329 texting exchanges: a reply delayed more than a minute was far more
likely to be a "no" than a "yes", and preferred responses ran about 63% against 37%
dispreferred.

**SO LENGTH TELLS THE PLAYER THE ANSWER BEFORE THE WORDS DO.** A long answer with a
reason in it is a no dressed as cooperation. A one-word answer is a yes, or it is
something worse.

**REASON TWO, AND IT IS THE GOOD ONE: A SHORT ANSWER MAKES THE LISTENER DO THE
WORK.** Grice's maxim of quantity says give as much as the moment needs. Break it
on purpose, obviously, and the listener does not think you made a mistake, they
look for what you meant. His own example is a reference letter for a philosophy job
that says nothing except that the man attended and his handwriting is good. Nothing
negative is written. Everything negative is understood.

**A ONE-WORD ANSWER IS NOT INFORMATION WITHHELD. IT IS INFORMATION MANUFACTURED IN
THE PLAYER'S HEAD, FOR FREE, AND THEY WILL BELIEVE IT MORE BECAUSE THEY MADE IT.**

## 4. SO THERE ARE EXACTLY TWO KINDS AND BOTH ARE STRONG
    **THE ALIGNED ONE.**  Immediate, plain, no account. "Yeah." "Done." "Mine."
    This person and you want the same thing and the shortness IS the agreement.

    **THE SLAP.**  A dispreferred answer delivered in preferred format. "No."
    with no reason attached is a refusal to give you the courtesy of a reason,
    and every listener alive reads it that way without being told.

The five we already own split cleanly across both. "Once." is a man giving you a
fact and nothing around it. "Maybe." is a door closing politely. "And?" is the slap.

## 5. WHAT THE MEDIUM DOES, AND WHY IT DRIFTED
Game dialogue is long because a line usually has to carry a job: a hint, a
direction, a piece of world, a reason to walk somewhere. A one-word answer carries
none of those, so it looks like a wasted line to anybody counting.

**IT IS NOT WASTED. IT IS WHERE THE PLAYER LEARNS THAT THE PERSON IS A PERSON.**
The measured 0.8% in shipped game writing is not a standard to match, it is the
size of the opening.

**AND HERE IS THE DEPENDENCY THAT DECIDES WHETHER WE CAN CASH THIS IN.** Q11
measured that 94.5% of our lines are delivered by a flat face, because the only
emotional channel is the brow and it reads punctuation we do not write. **A
one-word answer is exactly the line that cannot survive a dead face.** "Fine."
with a face is six different sentences. "Fine." without one is a bug report.

**SO Q14 IS BLOCKED BY Q11, AND THE FIX FOR BOTH IS THE SAME ONE-LINE WIRE: PASS
THE MOOD TAG THAT IS ALREADY IN THE SHIPPED DATA.**

## 6. THE SPEC
1. **THE TARGET IS NOT 35%.** That is telephone speech between strangers with
   nothing at stake. The reachable target is film's 7.5%, which would be about
   125 of our lines instead of 5.
2. **THE SHORT ANSWER GOES WHERE THE QUESTION IS HARDEST.** Backwards from
   instinct, and it is the whole trick: a person answers the easy question at
   length and the hard one in one word.
3. **NEVER TWO IN A ROW FROM THE SAME MOUTH** unless the person is refusing the
   conversation, in which case that IS the scene.
4. **ONE WORD IS ONE BEAT.** At 120 BPM a beat is about two words (Q4), so a
   one-word answer lands inside a single beat and is the only line shape in this
   game that can. Our median line of eleven words is over a bar.
5. **AND IT NEEDS THE PAUSE.** Seven rounds this lane has asked UI for one beat of
   hold before a line. For a one-word answer the pause is not polish, it is half
   the line.

## ROUTED
- **WORDS**  Q14 answered. Next open is Q15 [feed voice].
- **WORDS**  NEW ROW `ANSWER-IN-ONE-WORD`: raise the short-answer share from 5
  lines toward film's 7.5%, putting the shortest answers on the hardest questions.
  Held until MODE: BUILD.
- **CHARACTER**  Same wire as Q11 and it now has two rounds behind it. A one-word
  answer without a face is a bug report; with one it is six sentences.
- **UI**  Seventh round asking for the same thing: one beat of hold before a line.
  On a one-word answer the pause carries half the meaning.
- **QUESTS**  Our format does not put a question and its answer in one addressable
  sequence, which is why the after-a-question measure could only find fourteen
  lines in our whole corpus. That is a data-shape observation, not a request.
Test material: banks/BOHEMIA_WORDS_TEST_LINES.md, all `draft:true`, none in the game.

## SOURCES
- Preference organisation in conversation analysis: preferred responses are
  immediate and unmitigated, dispreferred ones are delayed, prefaced, hedged and
  accounted for. Measured in 329 texting exchanges, a reply delayed beyond a minute
  was far more likely to be a refusal, with preferred running about 63% to 37%.
- Grice's maxim of quantity and flouting: saying obviously less than the situation
  requires does not read as error, it generates an implicature the listener
  supplies. The reference-letter example is the canonical case.
- Real speech corpus, dialogue-act tagged, 199,740 turns: 58,391 one-word turns of
  which 36,107 are tagged backchannel, and among 9,087 genuine replies to a
  question with backchannels excluded, 35.3% are one word and 53.2% are three or
  fewer.
- Film corpus, 617 films, 304,446 lines: 7.5% of replies after a question are one
  word (n=77,598).
- Game dialogue corpus, 29,213 lines: 0.8% (n=4,756).
- Our own build: 1,669 NPC lines, mean 13.1 and median 11 words, five one-word
  lines plus twelve ellipses, all seventeen read by hand.
- This lane's own Q4 (one beat at 120 BPM is about two words) and Q11 (94.5% of our
  lines are delivered by a flat face).
