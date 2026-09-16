# WORDS Q4 -- ROUND TWO: THE WRITING
# VAMILY round, 9/16/26, lane WORDS (words-8dqrnq). MODE: SCHOOL THEN WRITE, round TWO.
# Round one: records/BOHEMIA_WORDS_Q4_SCHOOL_THE_BEAT_IS_TOO_SHORT_FOR_A_WORD_9_15_26.md
# Test lines: banks/BOHEMIA_WORDS_TEST_LINES.md, section "Q4 ROUND TWO", all draft:true,
# none of it in the game.
#
# THE QUESTION (Q4): "Speech on a beat. At 120 BPM how many words fit one beat, two,
# four; how the best rhythm-aware games pace a line; what a line that lands ON the
# beat does that one that drifts does not."

## WHAT ROUND TWO PRODUCED
28 cards, replacing four speeches that the game truncates today, one Spanglish quirk,
six shipped barks, and four barks left untouched as evidence. Measured by the SHIPPED
timing policy in `engine/bohemia_stage.js` rather than by a rule of thumb:

    28 cards | 46 bars | 92 s held | padding 8.5 s (9%) | dead zone 0 | clipped 0

## WHICH FINDINGS FROM SCHOOL CHANGED HOW THE LINES WERE WRITTEN
The mode says round two must name them. Five did, and all five changed the text.

1. **THE UNIT IS THE BAR, NEVER THE BEAT** (school section 2). No published floor
   lets a line occupy one beat, so nothing here is written to a beat. Every card is a
   whole number of bars. If school had not killed the beat, I would have written
   one-beat stingers, which is what Q4's own instruction implied and what the lane
   would have shipped.

2. **SIX WORDS TO THE BAR, NOT SEVEN** (school section 3). Q4 published seven and had
   it backwards: seven words is 35 characters, which is 2.53 s at the 14 cps we ship,
   26% over the bar. Every one-bar card here is 23 to 28 characters, which is five or
   six words. Written to Q4's number, every short card in this section would have
   overflowed into a second bar.

3. **A LONG SPEECH IS A RUN OF BARS, NOT ONE LONG CARD** (school section 5). The four
   speeches rebuilt here were all past the 98-character ceiling, so the game holds
   them for 7 seconds however much text is in them. The clerk's line in S27 is 276
   characters, needs 19.7 s, and the player sees about a third of it. Without school
   I would have shortened those lines. School says the ceiling is on a SUBTITLE, and
   our cards are the meaning, so the right move is to split rather than to cut. The
   clerk keeps every idea he had, in five cards, 10 bars, 20 seconds.

4. **ANYTHING OVER 98 CHARACTERS IS TRUNCATED TODAY** (school section 5). That number
   is why the four speeches were chosen at all. Nothing written here is over it.

5. **A CHOICE IS NOT TIMED** (school section 8). 913 of 3,014 spoken lines are the
   player's own menu and the player holds those as long as they like. Not one choice
   is rewritten here. Before school this lane would have swept them in with the rest,
   which is exactly what Q4 did, and it moved every number Q4 published.

## THE THING SCHOOL COULD NOT TELL ME, WHICH ONLY WRITING FOUND
**THE SHORT LINE IS THE EXPENSIVE ONE.**

A card that runs a few characters past a bar pays for the whole next bar. I did not
believe this mattered until I measured my own first draft:

    my first draft, written by instinct with school in my head:
        22 cards, 39 bars, 78 s held, padding 24.1 s = 31%, dead zone 16 of 22
    the same content, rewritten to the boxes:
        18 cards, 35 bars, 70 s held, padding  7.7 s = 11%, dead zone  1 of 18

"Dead zone" means a card that fills under 80% of the bars it takes. My instinct put
73% of the first draft in it, and every one of those cards read fine. Nothing about
the prose told me. Only the box did.

Then I pointed the same measure at the corpus as it stands, on all 2,101 lines the
game holds on a clock:

    padding across the whole corpus            2,082 s of 11,604 s = 17.9%
    cards in the dead zone                     830 of 2,101 = 39.5%

    by kind          lines   in the dead zone
      exchange         148        98   (66%)
      reaction         196       127   (65%)
      bark             558       323   (58%)
      quirk            194        89   (46%)
      say              756       168   (22%)
      journal          249        25   (10%)

**The SHORT kinds are the worst and the long ones are the best.** That is the reverse
of everybody's instinct, including mine an hour ago. A say line is long enough that
overshooting by a few characters is a small fraction of what it already costs. A bark
at 30 characters costs exactly twice what a bark at 28 costs, for two characters.

    THE WRITING RULE THAT COMES OUT OF IT, at 14 cps:
        write to 23-28 characters, or to 45-56, or to 68-84.
        29 to 44 characters is dead space: two bars bought, one and a half used.

And the other half of it, which comes from the 833 ms floor rather than the bar:
**everything under 28 characters is held for a full bar anyway.** A three-character
bark and a twenty-eight-character bark occupy the same bar and cost the same time.
Shortening a bark below 28 characters is free and buys nothing.

    "..."                     3 chars   held 0.83 s (the floor)   1 bar, 42% full
    "Enough."                 7 chars   held 0.83 s (the floor)   1 bar, 42% full
    "Enough. Tomorrow."      17 chars   held 1.21 s               1 bar, 61% full
    "Close. Come back six."  21 chars   held 1.50 s               1 bar, 75% full

**This is the opposite of "cut every word you can", which is the single most repeated
piece of writing advice there is.** Below the bar, cutting a word loses meaning
and saves no time at all. Above it, adding two characters costs two seconds. The
advice is not wrong about prose. It has no clock in it, and this surface has one.

## WHERE THE REGISTER AND THE BOX MEET, WHICH WAS THE NICE SURPRISE
THEY SPEAK SPANGLISH (8/25) is not bent by any of this, and neither is voice. Twice
the box actually produced the better line:

- The fitter in S25 says "Line goes soft for an hour" at 27 of 28 characters, where
  "The line goes soft for an hour" is 31 and pays for a bar it does not use. A fitter
  dropping the article is the register doing what the box asked for.
- "Nadie made you come down here" is a shipped bark at 30 characters, two over the
  box, and it pays double. "Nadie made you come here" is 25, keeps the code-switch
  whole, and loses nothing.

The constraint was not a tax on the voice in either case. It pushed toward the more
spoken version of the same sentence, which is what a tight line usually is.

## WHAT THIS DOES NOT CLAIM
- **Nothing here is in the game and nothing here is proposed for the game by this
  lane.** These are attempts, draft:true, in the bank.
- **No break is reported.** Every number about the shipped policy in both rounds comes
  from executing `readMs()` and `readBeats()` on our own corpus. This lane has not
  walked the demo and has not seen a truncated line on the glass, and rule 14(g) says
  a break is not reported until it is. The 478 truncated lines stay a MEASUREMENT
  routed to the surface's owner, exactly as round one left them.
- **No reference game is cited.** Round one found that Q4 leaned on two games Paolo
  never named. The prior art here is subtitle practice and lyric writing, which are
  trades rather than games.

## ROUTED
- **WORDS** Q4 now has both rounds and is SHIPPED under the 9/6 mode.
- **WORDS** the held BUILD row SEVEN-TO-THE-BAR is renamed by this round's evidence.
  It is SIX to the bar, and the real target is the character box, not a word count:
  23-28, 45-56, 68-84. The row stays held while the lane is in research mode.
- **WORDS, new standing check** every line this lane writes from now gets measured
  against the boxes before it is called done. My first draft proves the instinct does
  not do it unaided. This is a candidate for the voice gate when the lane next builds:
  a dead-zone ratchet over the words book, pinned at the measured 39.5% so the debt
  can only shrink, which is the same shape as the banned-phrase ratchet already in it.
- **whoever owns the card surface** the 39.5% dead zone and the 17.9% padding are
  properties of the TIMING POLICY as much as of the writing. A policy that quantised
  to the bar directly, instead of rounding to the beat and letting the bar fall where
  it may, would make the dead zone visible to every lane instead of only this one.
  Not this lane's to change, and named rather than touched.
- **UI** unchanged from round one: three clocks not one, the faster reveal is the
  accessible one, and lead-in exists.

## SOURCES
- `engine/bohemia_stage.js`, executed: CPS 14, MIN_MS 833, MAX_MS 7000, BEAT_MS 500.
  Every duration, bar count and fill percentage in this record and in the bank section
  came out of that module, not out of arithmetic done beside it.
- `records/BOHEMIA_WORDS_BOOK.json`: 3,147 lines over 60 sources, 2,101 of them timed.
- Round one, for the published standards it rests on and the egress caveats on them:
  records/BOHEMIA_WORDS_Q4_SCHOOL_THE_BEAT_IS_TOO_SHORT_FOR_A_WORD_9_15_26.md
- The four speeches rebuilt: S27_THE_FIFTY_YEAR_SIGNATURE#149, S21_THE_ONE_WHO_CAME_BACK#154,
  S25_THE_PRESSURE_GOES_BACKWARD#161, S15_THE_LIGHTS_GO_OUT_AT_NINE#123.
