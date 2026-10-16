# WORDS Q2 -- LYING, SCARED, EXHAUSTED, IN TEXT, WITH NO VOICE ACTOR
# VAMILY research day, 9/4/26, lane WORDS (words-8dqrnq). MODE: RESEARCH.
# The question, verbatim: "How a person talks when they are lying, scared, or
# exhausted, in TEXT with no voice actor. The real science of speech under stress
# (hesitation, repair, shortened sentences) and which games get it onto the page."

## THE ANSWER IN ONE LINE
**The strongest signals of stress in real speech are the ones a page cannot
print, and our own emotion tags are labels with no language behind them: a
machine cannot tell #dread from #tired at better than chance.**

## 1. WE ALREADY TAG THE EMOTION. IT DOES NOT REACH THE WORDS.
229 quest lines carry a state tag written by hand: #dread 66, #wary 66, #flat 41,
#tired 40, #cold 10, #hope 6. So the intent exists in the files. I asked whether
it exists in the prose: shown five lines of one state and five of another, can a
machine place a sixth? Chance is 50%.

    #dread vs #tired    49.2%        #wary vs #flat    45.2%
    #dread vs #wary     50.1%        #tired vs #flat   47.0%

**All four at or below chance.** The tags are decoration. Somebody wrote "#dread"
next to a line and the line did not change.

This is the shape of half the findings in this repo: the material exists and never
reaches the player. Here it never even reached the sentence.

## 2. EXCEPT ONE CHANNEL, WHICH IS ACTUALLY WORKING, AND I WILL SAY SO
Sentence LENGTH tracks state, correctly, without being asked to:

    state      words/line   words/sentence   one-word sentences   fragments
    #dread        15.3           7.5              18.2%             37.0%
    #cold         15.8           7.5              30.0%             33.3%
    #tired        18.8           9.2              20.0%             25.6%
    #flat         20.6           9.7               7.3%             23.0%

Frightened people get short and flat people run long, which is the right
direction and matches the science below. **Somebody's ear was working even though
their vocabulary was not.**

## 3. AND EVERY OTHER CHANNEL TEXT HAS IS AT ZERO

    marker                    #dread   #wary   #cold   #tired   #flat
    trails off (...)            1.5%    0.0%    0.0%     0.0%    0.0%
    self-repair (a dash)        0.0%    6.1%   10.0%     0.0%    0.0%
    restarts a word             0.0%    1.5%    0.0%     2.5%    0.0%
    filled pause (uh, hm)       0.0%    0.0%    0.0%     0.0%    0.0%
    hunting for a word          0.0%    0.0%    0.0%     0.0%    0.0%
    sentence left unfinished    0.0%    0.0%    0.0%     0.0%    0.0%

**Of 229 lines written to be frightened, exhausted or cold, SIX carry any
disfluency at all. 2.6%.** Nobody in this game has ever hunted for a word while
afraid.

## 4. THE SCIENCE, AND IT CHALLENGES THE QUESTION
**STRESS.** Acute stress produces decreased linguistic complexity, more
tip-of-the-tongue states, increased pausing and decreased speech rate. Pause time
is the most robust indicator. A measured dose-response in non-stutterers:

    calm                                   0% of words disfluent
    time pressure                          2%
    time pressure + cognitive load         4%

**THE CHALLENGE: the best signals in that list are unprintable.** Pitch,
intensity, speech rate and pause DURATION are the strongest measured markers of
stress and a page carries none of them. The robust indicator, pause time, is
exactly the channel text does not have. So a written frightened man cannot be
frightened the way a real one is; he can only be frightened in the four channels
that survive to print: **sentence length, complexity, repair, and word-finding
failure.** Everything else is a stage direction.

**LYING.** Newman and Pennebaker's linguistic profile of deception, replicated
since: liars use **fewer first-person singular pronouns** (I, me, my), **fewer
exclusive words** (but, except, without), **fewer references to other people**,
**more negative emotion words**, **more motion verbs**, and show **lower cognitive
complexity**. The mechanism they propose is distance: a liar invests less of
himself in the sentence.

AND THE SECOND CHALLENGE: **the effect sizes are small.** These are statistical
tendencies over many samples, not tells you can read off one line. Which lands in
the same place Q1 did yesterday: **real difference is invisible at the length a
player reads, so a written liar has to be MADE detectable or the scene teaches
nothing.** The craft is not imitation, it is amplification of a real signal.

AND THE POPULAR TELL IS BACKWARDS. The instinct is to write a liar who stammers
and over-explains. The science says a liar's account is **simpler, flatter and
less self-involved** than the truth. Fewer "I"s, not more words.

## 5. WHAT THIS SAYS TO DO, WHEN THE LANE RETURNS TO BUILD
A three-rung ladder per state, in the four channels a page owns. Rungs, not a
switch, because the dose-response is real.

    RUNG 0  calm        full sentences, no repair, "I" wherever it belongs
    RUNG 1  pressed     sentences ~30% shorter, one clause dropped, one repair
                        in the exchange, still finishes every thought
    RUNG 2  frightened  fragments, one word-search or one abandoned sentence per
                        exchange, complexity collapses, and the thing they most
                        need to say arrives LAST or not at all

    LYING, and it is the opposite of the instinct: not more words. FEWER "I", no
    "but/except", no naming the other person, one negative-emotion word that does
    not belong, and a story with less detail than the truth would have had.

    EXHAUSTED, which the science treats as the same machinery at low fuel: short,
    repetitive, and REPEATS THE OTHER PERSON'S WORDS instead of finding its own.

**AND THE HARD FLOOR:** written dialogue keeps about 3% of real disfluency (film
0.12 per 100 words against real speech's 3.80, measured in an earlier round). So a
frightened character does NOT go to the real 4%. He goes up **relative to his own
baseline**, and the reader feels the jump, not the rate. Absolute realism here is
unreadable; contrast is the whole instrument.

## ROUTED
- **WORDS**  Q2 answered. Next open is Q3 (how a crowd talks without repeating).
- **WORDS**  NEW ROW `THE-STRESS-LADDER`: three rungs per state in the four
  printable channels, and the tags stop being decoration. Held until MODE: BUILD.
- **QUESTS** The state tags already exist on 229 lines and cost nothing to keep.
  They are a good idea that was never cashed; do not remove them.
- **PEOPLE** #hope has six lines and every one of them contains a negation. A hope
  line that always says "no" is worth one look.
- **UI / SOUNDS** The unprintable channels (pause length, rate, pitch) are exactly
  what a beat and a sound cue could carry. If a frightened line held a longer beat
  before it, the page would get the channel back.
Test lines: banks/BOHEMIA_WORDS_TEST_LINES.md, all `draft:true`, none in the game.

## SOURCES
- Newman, Pennebaker, Berry and Richards, "Lying Words: Predicting Deception from
  Linguistic Styles", *PSPB* 29(5), 2003, plus later meta-analytic replications:
  fewer self- and other-references, fewer exclusive words, more negative emotion
  words and motion verbs, lower cognitive complexity, all at small effect sizes.
- "Acute stress reduces speech fluency" (2014) and the stress-disfluency
  dose-response literature: 0% / 2% / 4% under increasing load; reduced complexity,
  increased pausing, decreased rate; pause time the most robust marker.
- Our own quest files: 229 hand-tagged emotion lines, measured here for the first
  time.
