# WORDS Q4 -- SPEECH ON A BEAT
# VAMILY research day, 9/4/26, lane WORDS (words-8dqrnq). MODE: RESEARCH.
# The question, verbatim: "Speech on a beat. At 120 BPM how many words fit one
# beat, two, four; how the best rhythm-aware games pace a line; what a line that
# lands ON the beat does that one that drifts does not."

## THE ANSWER IN ONE LINE
**A spoken sentence and a musical bar are already almost the same length, so
quantising our dialogue is nearly free. We have never done it: our lines land on
the bar 23.7% of the time and pure chance is 25%.**

## 1. THE NUMBERS THE QUESTION ASKS FOR
120 BPM means one beat is 0.5 seconds and one bar is 2.0 seconds. Our lines are
READ, not heard, so the governing rate is READING speed, not speech. Brysbaert's
meta-analysis of 190 studies (18,573 participants): silent reading of fiction
**260 wpm**, non-fiction 238, reading **aloud 183**, and most adults fall between
**200 and 320 wpm** on fiction.

    rate                      1 beat   2 beats   4 beats (a bar)   8 beats
    fiction silent 260 wpm      2.2      4.3          8.7            17.3
    fastest reader 320 wpm      2.7      5.3         10.7            21.3
    slowest reader 200 wpm      1.7      3.3          6.7            13.3
    read aloud 183 wpm          1.5      3.0          6.1            12.2

**ONE BAR IS ABOUT NINE WORDS FOR AN AVERAGE READER AND ABOUT SEVEN FOR A SLOW
ONE.** That is the whole conversion table, and it is the first time this lane has
had one.

## 2. THE FINDING THAT PROVES US WRONG
The 120 BPM LAW says everything in this game quantises to the beat. Measured
against it, our words never have.

    kind        n     median LINE          median SENTENCE   lands on a bar
    quest @SAY  527   9.7 beats = 2.4 bars   3.2 beats           23.7%
    street bark 558   3.7 beats = 0.9 bars   1.8 beats           29.2%
    exchange    148   3.2 beats = 0.8 bars   2.8 beats           16.2%

"Lands on a bar" means within half a beat of a bar boundary. For lengths scattered
at random, the expected rate is **exactly 25%**. Quest lines score 23.7%.

**OUR DIALOGUE IS NO MORE BEAT-ALIGNED THAN IF IT HAD BEEN WRITTEN WITH DICE.**
The law is honoured by movement and by combat and has never once reached the
words, and nobody noticed because nothing measured it.

And the median quest line is the worst possible value: **2.4 bars**, far enough
from 2 and from 3 that it can only be padded or cut, never nudged.

## 3. BUT THE BARKS ARE NEARLY RIGHT ALREADY, BY ACCIDENT
Median bark: **0.9 bars**. Median bark sentence: 1.8 beats. Short street speech
lands a hair under one bar without anybody trying, which is the same result the
whole corpus round found from another direction: a natural spoken sentence runs
6 words in film, 8.2 in KOTOR, 6.7 in our barks. **The natural sentence IS a
bar.** Quantising is not a fight against how people talk, it is a rounding.

## 4. WHAT THE BEST RHYTHM-AWARE GAMES DO
The two that matter run opposite policies and both are instructive.
- **Crypt of the NecroDancer** quantises hard: movement, attacks and casts all
  snap to the beat and a miss costs the turn. Strict, legible, unforgiving.
- **Hi-Fi Rush** deliberately loosens it, letting the player act to their own
  reading of the beat, and spends enormous effort on FEEDBACK instead: lights
  pulse, pipes vent, platforms move, the health bar bobs, and an on-beat action
  answers with a visible mark and a sound. **The beat is taught by the world, not
  enforced on the player.**

For a game whose dialogue is READ, Hi-Fi Rush is the model: **the line does not
have to be spoken on the beat, it has to ARRIVE on one.** Reveal, hold and clear
are the beats a reader feels. The words inside are prose.

## 5. WHAT A LINE THAT LANDS ON THE BEAT DOES THAT A DRIFTING ONE DOES NOT
A line whose length is a whole number of bars can be revealed, held and cleared
without the next beat arriving mid-word. A 2.4-bar line has three bad options: cut
the reader off, hold a dead half-bar, or drift the whole scene later and later
against a clock the rest of the game is still keeping. **Drift is cumulative.**
Twenty lines at 2.4 bars puts a scene eight bars behind the music it started with.

## 6. WHAT THIS SAYS TO DO, WHEN THE LANE RETURNS TO BUILD
1. **WRITE TO THE SLOW READER, NOT THE AVERAGE.** A bar is 8.7 words at 260 wpm
   and 6.7 at 200. Timing to the average cuts off roughly the slower third of
   players. **Seven words to the bar is the safe unit.**
2. **A LINE IS A WHOLE NUMBER OF BARS.** One bar for a bark, two for a normal
   line, four for a speech that is meant to land. Our quest median of 2.4 bars is
   the one value to design out.
3. **QUANTISE THE ARRIVAL, NOT THE SYLLABLES.** Reveal on a beat, clear on a beat.
   Nothing about the prose changes; only when it appears.
4. **A HELD BEAT IS THE PUNCTUATION TEXT DOES NOT HAVE.** Q2 found that the
   strongest markers of stress are pause length and rate, and that a page carries
   neither. A beat of silence before a frightened line gives the page back exactly
   the channel it was missing. This is the cheapest thing in either record.

## ROUTED
- **WORDS**  Q4 answered. Next open is Q5 (refusal).
- **UI**  `LINE-ON-THE-BAR`: reveal and clear dialogue on beat boundaries, and hold
  a beat before a line tagged for stress. The timing lives in their surface, not
  in the words. Pairs with Q2's finding.
- **UI / SOUNDS**  A slow-reader setting is an accessibility question, not a taste
  one: the gap between 200 and 320 wpm is 60% and no single hold serves both.
- **WORDS**  NEW ROW `SEVEN-TO-THE-BAR`: rewrite pass targeting whole-bar line
  lengths at the slow-reader rate. Held until MODE: BUILD.
Test lines: banks/BOHEMIA_WORDS_TEST_LINES.md, all `draft:true`, none in the game.

## SOURCES
- Brysbaert, "How many words do we read per minute? A review and meta-analysis of
  reading rate", *Journal of Memory and Language* 109, 2019: 190 studies, 18,573
  participants; 238 wpm non-fiction, 260 fiction, 183 aloud, 200-320 typical range.
- Crypt of the NecroDancer's hard quantisation; Hi-Fi Rush's loose beat with heavy
  world feedback (pulsing lights, venting pipes, on-beat marks and sounds).
- Our own words book: 527 quest lines, 558 barks, 148 exchanges, measured in beats
  at 120 BPM for the first time.
