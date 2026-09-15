# WORDS Q4 -- SCHOOL: THE BEAT IS TOO SHORT FOR A WORD
# VAMILY round, 9/15/26, lane WORDS (words-8dqrnq). MODE: SCHOOL THEN WRITE, round ONE.
# NO TEST LINES ARE WRITTEN IN THIS FILE. That is the mode, and it is the point.
#
# THE QUESTION, VERBATIM (Q4): "Speech on a beat. At 120 BPM how many words fit
# one beat, two, four; how the best rhythm-aware games pace a line; what a line
# that lands ON the beat does that one that drifts does not."
#
# WHY IT OWES A SCHOOL ROUND: Q4 shipped 9/4 under the OLD one-round mode, two
# rounds before Paolo locked SCHOOL THEN WRITE on 9/6. That mode says a question
# marked SHIPPED without both rounds is not shipped. This lane is paying the debt
# oldest first, and Q4 is the oldest.

## THE ANSWER IN ONE LINE
**The question's own first clause has no answer. No published legibility floor
lets a line occupy one beat: the lowest floor anybody publishes is five sixths of
a second, which is 1.7 beats, and the floor most game accessibility work uses is
1.5 seconds, which is 3 beats. The smallest unit a word can live in at 120 BPM is
the BAR, not the beat.**

And the second thing school found is worse for this lane's pride: **the number Q4
went out to derive was already sitting in the engine, three weeks before Q4 was
written, with the sources in the comment.**

=================================================================================
## 1. THE FINDING THAT PROVES US WRONG, AND IT IS A REUSE FAILURE
=================================================================================
`engine/bohemia_stage.js` has carried a real reading-speed policy since 8/12,
built from Paolo's own note that round ("understanding how long voices should play
compared to how long their text shit is"). Run on the box, the shipped module
reports:

    BEAT_MS 500    CPS 14    MIN_MS 833    MAX_MS 7000

and its own header names Netflix (20 cps adult, 17 children, 5/6 s floor, 7 s
ceiling, 42 chars a line), the BBC (17 cps, held 2 to 5 seconds) and general
practice (12 to 14 cps). It takes the comfortable end, keeps Netflix's floor and
ceiling, and rounds UP to a whole beat.

**Q4, written 9/4, derived a words-per-bar table from reading-rate literature at
260 wpm and never opened that file.** Measured against our own corpus, which runs
5.05 characters per word including the space, 260 wpm is **21.9 characters per
second**. The shipped policy runs **14**. Q4's ruler was **56% faster than the
code that ships**, and every conclusion downstream of it inherited the error.

REUSE-FIRST is a law about tools. School says it is a law about research too: the
first question of any round is whether the repo already answered it.

=================================================================================
## 2. WHAT THE PUBLISHED STANDARDS ACTUALLY SAY, AND WHERE THEY DISAGREE
=================================================================================
They disagree about the floor, and the disagreement does not matter, because
**every one of them is longer than a beat**.

    source                      floor for one short line      in beats at 120 BPM
    Netflix Timed Text          5/6 second (833 ms)                  1.7
    Ian Hamilton, game a11y     1 second for a single word           2.0
    common game practice        1.5 seconds even for one word        3.0

    source                      reading speed            chars in a 2.0 s bar
    Netflix, adult              20 cps                        40
    Netflix, children           17 cps                        34
    BBC                         17 cps                        34
    general practice            12 to 14 cps                  24 to 28
    bohemia_stage.js (shipped)  14 cps                        28

The reason the floor exists at all is processing, not reading: a line has to be
noticed, fixated and understood, and that cost does not shrink to zero as the line
gets shorter. Hamilton's longer-line guidance is 2 to 2.5 seconds per line of up
to 38 characters, with two lines maximum, three in exceptional cases.

**SO: "how many words fit one beat" is a question with the answer ZERO.** At 14
cps a beat holds 7 characters, and a 7-character line would still be held for the
833 ms floor. The beat is the atom of movement in this game. It is not an atom
words can use.

=================================================================================
## 3. Q4'S SAFE UNIT IS BACKWARDS, MEASURED
=================================================================================
Q4 concluded: "A bar is 8.7 words at 260 wpm and 6.7 at 200. Timing to the average
cuts off roughly the slower third of players. SEVEN WORDS TO THE BAR IS THE SAFE
UNIT."

Checked at the published speeds, on our own 5.05 chars per word:

    seven words = 35 characters
      at 20 cps (Netflix adult, the FAST end)   1.77 s = 0.88 bars   fits
      at 15 cps (the slow end)                  2.36 s = 1.18 bars   overflows 18%
      at 14 cps (what we actually ship)         2.53 s = 1.26 bars   overflows 26%

**Seven words is the FAST reader's unit, and Q4 published it as the SLOW reader's
unit.** The slow-reader unit is SIX: six words is 30.3 characters, 2.02 seconds at
15 cps, one bar to within a fiftieth of a second. Q4 was off by one word in the
wrong direction, and the direction is the part that matters, because the whole
argument for the number was protecting the slower third.

=================================================================================
## 4. THE VALUE Q4 TOLD US TO DESIGN OUT DOES NOT EXIST
=================================================================================
Q4: "the median quest line is the worst possible value: 2.4 bars, far enough from
2 and from 3 that it can only be padded or cut, never nudged."

2.4 bars came out of the 21.9 cps ruler. Re-measured at the legibility standard,
on the same words book (3,147 lines, 60 sources):

    median quest @SAY line     94 characters
      at 21.9 cps (Q4's ruler)      4.29 s = 2.15 bars
      at 15 cps                     6.27 s = 3.13 bars
      at 14 cps (shipped)           6.71 s = 3.36 bars

At the speed we actually ship, the median say line sits near **three bars**, not
at an awkward 2.4. The awkward value was the ruler, not the lines. **A number
produced by the wrong instrument got a design instruction written about it.**

That is the same class of error this lane has now hit four times: a ruler that
measures the wrong thing gets believed because it produced a number.

=================================================================================
## 5. THE SHIPPED POLICY CUTS NEARLY A QUARTER OF OUR LINES SHORT
=================================================================================
Netflix's 7-second ceiling makes sense on television, where a subtitle is replaced
by the next one and the audio carries the meaning. Our lines are the meaning.

I ran the SHIPPED `readMs()` from `engine/bohemia_stage.js` over every line in our
own words book that the game holds on a clock (2,101 lines: all spoken material
with player menus and interface strings dropped, because those have no clock,
see section 8).

    lines held for LESS time than the module's own reading speed asks for:
        478 of 2,101 = 22.8%
    the worst one: 276 characters, needs 19.7 s at 14 cps, gets 7.0 s
        (quests/bq/S27_THE_FIFTY_YEAR_SIGNATURE.bq#149, 64% of it unread)
    median clipped line: 129 characters, needs 9.2 s, gets 7.0 s
    what they are: 345 say, 130 journal, 3 quirk

And the pile-up is visible in the histogram of held beats: **27.0% of all timed
lines land on exactly 14 beats**, which is the ceiling, not a property of the
writing. Every clipped line collapses onto the same value.

MEASUREMENT HONESTY, because this lane wrote the rule about it: **this is the
shipped function executed on our real corpus, not a break reproduced on the
glass.** I did not verify which of those 478 lines currently reach a stage-driven
scene, and the rule is that a break is not reported until it is seen. So this
goes out as a measurement to the lane that owns the surface, with the command to
reproduce it, and this lane claims nothing about the demo.

The honest reading of the ceiling is that 7 seconds is a ceiling on a SUBTITLE
because a subtitle is a shadow of speech. A long line in a card is a different
object, and the fix is probably to split it rather than to raise the ceiling.
That is a decision for the lane that owns the card, not for this record.

=================================================================================
## 6. THERE ARE THREE CLOCKS, AND Q4 BUDGETED ONE
=================================================================================
Q4 said "quantise the arrival, not the syllables" and then costed a line as a
single duration. A line on screen has three timed events:

    1. REVEAL   how fast the characters appear. Shipped dialogue tooling runs
                20 cps as a common default, up to 45 in the fast implementations,
                and player preference ranges are published as low as 5.
    2. HOLD     how long the finished line stays up. The reading budget, 14 to
                20 cps, with the floor and the ceiling.
    3. CLEAR    when it goes.

These fight. Our median timed line is 62 characters:

    typed at 20 cps   3.10 s to reveal; read budget 4.43 s at 14 cps;
                      hold after the last character lands: 1.33 s
    typed at 45 cps   1.38 s to reveal; hold after: 3.05 s

**A typewriter at 20 cps eats three quarters of the reading budget**, so a slower
reader is cut off by a machine that is only there for flavour. The faster reveal
is the accessible one, which is the opposite of the intuition.

And karaoke, which is the oldest craft of putting words on a beat, adds a fourth
thing Q4 missed entirely: **lead-in.** A karaoke line appears about one second
before it is sung, roughly 2 beats early. The reveal and the landing are different
moments. Q4 wrote "reveal on a beat, clear on a beat" as though the reveal WAS the
landing. For a line to land on a beat the reader has to already have it.

=================================================================================
## 7. THE PART Q4 GOT RIGHT, NOW PROVEN A SECOND WAY
=================================================================================
Q4's section 3 claimed the natural spoken sentence is about one bar. School
confirms it from a completely different direction, which is the strongest kind of
confirmation available.

People have been fitting English into 2-second bars for a very long time, and the
published density is:

    pop lyric          4 to 10 syllables per bar
    hip-hop, sparse    6 to 8 with pauses
    hip-hop, dense     10 to 13
    (those figures are quoted for a bar at slower tempos; a bar at 120 BPM is
     2.0 s against 2.67 s at 90 BPM, so our bar holds about three quarters of it)

And the READ bar, arrived at with no reference to music at all:

    one bar at 15 cps = 30 chars = 5.9 words = 7.5 syllables
    one bar at 20 cps = 40 chars = 7.9 words = 10.0 syllables

And our own corpus, measured: 43,936 syllables over 34,747 words, **1.26 syllables
per word**; 5,367 sentences; **median 6 syllables per sentence**, p25 4, p75 11.

Three independent measures land in the same 6 to 10 band. The sung bar, the read
bar and our own sentence are the same size. **51.0% of our sentences already fall
inside the sung-bar band**, and 16.4% are over 13 syllables, which is past the
ceiling even for dense rap with no pause.

So the bar is a real unit for English, and it was a real unit for English long
before anybody wrote this game. That is why quantising to it is cheap. The beat
is not that.

=================================================================================
## 8. A THIRD OF THE CORPUS HAS NO CLOCK AT ALL
=================================================================================
Q4 measured over material it never separated. Of 3,014 spoken lines in the book:

    choice      867   the player's menu
    asking       46   the player's menu
    say         756   the game holds it
    bark        558   the game holds it
    journal     249   the game holds it
    reaction    196   the game holds it
    quirk       194   the game holds it
    exchange    148   the game holds it

**913 of 3,014 (30.3%) are text the PLAYER holds, for as long as they like.** A
choice has no beat. Nothing about reading speed, floors, ceilings or bars applies
to it. Including it in a timing measurement moves every number, because choices
are short: their median is 23 characters against 62 for the timed lines.

On the 2,101 lines the game actually holds, quantised at 15 cps with the 1.5 s
floor:

    1 bar    13.3%
    2 bars   35.6%
    3+ bars  51.0%
    rounding every line up to a whole bar adds 19.3% to total hold time

And the thing Q4 was really asking about, re-measured under the shipped policy:
**our lines land exactly on a bar boundary 18.6% of the time.** Chance is 25%. Q4
measured 23.7% and said we were no better than dice. The truth under the code that
ships is that we are WORSE than dice, and for a reason: rounding up to the nearest
BEAT is what pushes a line off the BAR.

=================================================================================
## 9. WHERE THE CRAFT ADVICE IS WRONG
=================================================================================
The standard writing advice on rhythm is: vary your sentence length, read it
aloud, end on a strong beat, cut every word you can. All of it is good and none
of it has a TIME BUDGET in it. It tells you to make a line feel fast and never
tells you how many seconds the line will be on screen, so a writer following it
can write a beautiful line that the ceiling truncates at 64%.

The subtitle standards have the opposite problem. They have nothing but budget.
They will tell you 42 characters and 20 cps and they have no opinion about whether
the line is any good, and they are written for text that is a SHADOW of audio that
is carrying the meaning anyway. Our cards are the meaning. Borrowing the numbers is
right. Borrowing the assumption behind them is how you get a 7-second ceiling on a
line nobody is speaking aloud.

**Neither half knows about the other. School's job here was to put a stopwatch in
the writing advice and a writer in the stopwatch.**

=================================================================================
## 10. TWO THINGS THIS LANE HAS TO OWN
=================================================================================
1. **Q4 CITED TWO REFERENCE GAMES PAOLO NEVER NAMED.** Its section 4 is built on
   Crypt of the NecroDancer and Hi-Fi Rush. The named set is FF12 for combat
   gambits, ROGUE FABLE 4 for combat on the beat, BATTLE BROTHERS for the campaign,
   FFX for the interface and the sound, FALLOUT 1 for the interface, POCKET CITY 2
   for the city drop-in, and Las Vegas for the city. Neither of Q4's two is on it,
   and Q4 was written on 9/4, after the 8/28 law and after the department split.
   That is this lane's violation, in this lane's own record. Round two cites no
   reference game at all, and the craft prior art it leans on is subtitle practice
   and lyric writing, which are trades and not games.
2. **Q4 never opened the engine.** Section 1. The rule school takes from it: read
   the repo before reading the literature.

=================================================================================
## 11. RULE 16 CHECKED: THE ARITHMETIC SURVIVES
=================================================================================
All of the above hangs on the beat being 500 ms. THE STEP IS A HOUSE (9/15) fixes
120 BPM and one step per beat, so the beat cannot move under this. Confirmed in
the code, not assumed: `BEAT=500` or `BEAT_MS=500` appears in seven places across
the engine and the city slice, every one of them commented with the 120 BPM law.

If the tempo ever did move, the one number that breaks first is the floor: at
anything above 120 BPM the 1.5 s floor swallows more than three beats and the bar
stops being a usable unit for a short line.

=================================================================================
## ROUTED
=================================================================================
- **WORDS** Q4 school done. Round two is the writing, and it may not repeat the
  errors in sections 3, 4, 6 and 10.
- **WORDS** the existing held row SEVEN-TO-THE-BAR is misnamed by this research.
  It is SIX to the bar at the speed we ship. The row stays held while the lane is
  in research mode; the name is corrected when it is built, not before.
- **the lane that owns bohemia_stage.js** 478 of our 2,101 timed lines come back
  from the shipped `readMs()` held for less time than that same module's reading
  speed asks for, all of it at the 7,000 ms ceiling, 345 of them say lines. Command
  to reproduce is in section 5. NOT reported as a break: not seen on the glass by
  this lane.
- **UI** three clocks, not one, and a reveal at 20 cps eats three quarters of a
  slow reader's budget. If a typewriter effect ever ships, faster is the
  accessible setting.
- **UI** lead-in. A line that is meant to land on a beat has to be on screen
  before that beat, the way a karaoke line is up about a second early.
- **UI / SOUNDS** the slow-reader hold remains an accessibility setting, not a
  taste one. Q4 was right about that and nothing here moves it.

=================================================================================
## WHAT SCHOOL LEAVES FOR ROUND TWO
=================================================================================
Round two writes the lines, and these are the constraints it inherits, all of them
measured rather than assumed:

    the unit is the BAR, never the beat          section 2
    six words to the bar at the speed we ship    section 3
    a sentence is 4 to 10 syllables              section 7
    the median timed line is near three bars     section 4
    anything over 98 characters is clipped today section 5
    a choice is not timed at all                 section 8

Round two must name which of these changed how the lines were written. If none of
them did, school was done badly and the round does not count.

=================================================================================
## SOURCES
=================================================================================
- `engine/bohemia_stage.js`, shipped 8/12 from Paolo's note that round: CPS 14,
  MIN_MS 833, MAX_MS 7000, BEAT_MS 500, rounding up to a whole beat. Executed on
  the box, not read.
- Netflix Timed Text Style Guide: 42 characters per line, 20 cps adult and 17 for
  children, minimum 5/6 second, maximum 7 seconds per event. Read via search
  result summaries; the partner help page itself is blocked by this session's
  network egress, so the figures are corroborated across three independent
  summaries rather than fetched from the primary.
- Ian Hamilton, "How to do subtitles well": 2 lines maximum and 3 in exceptional
  cases, no more than 38 characters a line, a single word on screen for one
  second, longer subtitles around 2 to 2.5 seconds per line. Same egress caveat:
  ian-hamilton.com is blocked from this session and the figures come from
  secondary summaries that agree with each other.
- Common game practice on the 1.5 second floor for a single word, stated as
  giving the brain time to process it, and adult subtitle reading quoted at 150
  to 180 wpm.
- Typewriter reveal rates in shipped dialogue tooling: 20 cps as a common default,
  45 cps in fast implementations, user preference ranges published from 5 to 20.
- Karaoke practice: lines appear about one second of lead-in before they are sung;
  LRC line-by-line against word-level and syllable-level sync.
- Lyric density: pop commonly 4 to 10 syllables per bar, hip-hop 6 to 8 sparse and
  10 to 13 dense, quoted against a 4/4 bar at 90 BPM which runs 2.67 seconds.
- Our own words book, `records/BOHEMIA_WORDS_BOOK.json`: 3,147 lines over 60
  sources, 3,014 spoken, 2,101 timed, 34,747 words, 43,936 syllables, 5,367
  sentences. Every number in this record that is about us was measured on it this
  round.
- Brysbaert 2019 reading-rate meta-analysis, carried over from Q4 and now placed:
  it measures silent reading of continuous prose, which is why it reads 46% faster
  than a subtitle standard. It was the wrong instrument for a line on a card, and
  Q4 used it as the only instrument.
