# WORDS Q28 -- WHAT THE LOADING SCREEN SAYS
# VAMILY round, 9/23/26, lane WORDS (words-8dqrnq). School and the lines in ONE round,
# which is what the row asked for ("School is one page, then the lines") and what rule
# 22 requires of a making lane.
# Lines: banks/BOHEMIA_WORDS_TEST_LINES.md, section "Q28", all draft:true.
# Registered in VOTE: words-the-loading-screen-9-23. To RUN and UI the same round.

## WHAT GOT COOKED
**Seventeen lines for the first screen of the game**, including the five it shows while
it works, the two that carry the tone, the BEGIN word, the two for a slow load, and
five in Spanish. Every one is 28 characters or fewer and reads in under two seconds.

## SCHOOL, AND THE FINDING THAT PROVES US WRONG
**"ONE MOMENT" IS A PROMISE THE LOAD CANNOT KEEP.**

Measured rather than remembered. The alpha's splash has three states today:

    NOT READY YET          "ONE MOMENT"
    READY, no save         "TAP TO ENTER"
    READY, save exists     "CONTINUE - DAY 1 - 06:00"

And PLUMBER measured the door on a phone-shaped CPU: **it opens at 52.9 seconds**,
against Paolo's 5 second goal. 13.4 s at 1x, 79.4 s at 6x.

The published limits on how long a person waits are not opinions:

    0.1 s          feels instant
    1.0 s          the limit for a thought to stay unbroken
    10  s          THE LIMIT FOR KEEPING SOMEBODY'S ATTENTION AT ALL
    2 to 9 s       a looped indicator is the right tool
    10 s or more   a PERCENT-DONE indicator, and a signposted way to interrupt

**OUR LOAD IS FIVE TIMES THE ATTENTION LIMIT ON THE THING HE ACTUALLY HOLDS.** At that
length a reassurance is the wrong instrument entirely. "One moment" tells him the wait
is short. It is not short, and a screen that says otherwise is the same defect as a card
that promises something and does nothing, which he named as the worst bug in the game.

And what a progress indicator is actually for is three things, none of them comfort:
proof the system has not crashed, roughly how long so a person can decide to look away,
and something to look at. **All three are answered by the system reporting its own
state.** None is answered by an apology.

## THE PART THAT MAKES THIS ROUND CHEAP
**THE HONEST ANSWER AND THE GENRE ANSWER ARE THE SAME THING HERE.**

Q27 school found the dead institution has exactly two legal homes under rule 19: the
phone he opens, and a machine's own words. **The loading screen is a machine's own
words.** And what a real system prints while it works is a state report addressed to
nobody in particular, which is the genre's own grammar.

So the trade this lane normally has to name out loud does not exist on this surface.
The response-time research and the analog horror law want the same sentence.

## THE THIRD RULER DECISION IN THREE ROUNDS
**A LOADING LINE IS NOT HELD ON A READING CLOCK.** It changes when the WORK changes, not
on a timer, so Q4's whole-bar boxes are the wrong test here, the way they were the wrong
test for the phone last time.

The right test is the FLOOR: every line must be readable inside the shortest stage it
can sit on. So every line is one bar or less, 28 characters or fewer, under two seconds
to read. Checked, not assumed.

Three rounds, three surfaces, three different rulers: a card the game holds (whole
bars), a form the player holds (no clock at all), a line the work holds (the floor
only). The lesson that generalises is that **the ruler comes from who controls the
dwell**, and that is now written down.

## WHAT THE LINES DO
**FIVE STATE LINES**, one per real stage: reading the valley, counting what still
stands, checking streets for light, reading last night's meters, finding your block.
**Each one is wired to the stage it names.** A line that says it is counting while
nothing is counting is the bug above, so if a stage does not exist, its line does not
ship. That is RUN's call to make and this record says it plainly rather than leaving it
to be discovered.

**TWO THAT ARE THE TONE, AND BOTH ARE SIMPLY TRUE**: "NO OPERATOR ON DUTY" and "THIS
SCREEN UPDATES ITSELF". Neither is decoration. There is no operator, and the screen does
update itself. Said as status lines, not as warnings, which is the register.

**THE BEGIN WORD IS TWO PARTS ON PURPOSE**: "READY. TAP TO BEGIN." READY is the
machine's state, which is the register. TAP TO BEGIN is the instruction and it stays
plain, because a stranger has to understand the only button in the game. **The register
does not get to cost him the door.**

**THE CONTINUE LINE IS KEPT EXACTLY AS IT IS.** It already reads as a record. Rewriting
a line that works to make a set look uniform is how a round loses the good one, and this
lane has now made that call three times on purpose.

**THE SLOW LOAD** is where the 10 second rule bites: "STILL WORKING. 41 OF 68." is the
percent-done the research demands, in the form a dead institution would print it, a
count of its own units rather than a smooth bar with a friendly number. **The 41 and the
68 are the real file count or the line does not ship.** Past thirty seconds, "THIS IS
SLOWER THAN USUAL", which is an institution calmly admitting something is wrong with
itself, to nobody.

**FIVE IN SPANISH**, because Q27 school found a real notice must in many places be
issued in both, so the institution gets the language law by a different route than a
person does.

## WHAT THIS DOES NOT CLAIM
- **Nothing is in the game.** The lines are in the bank and in VOTE, and RUN and UI own
  the screen.
- **No new mechanism.** The splash already has the three states; these are words for
  them plus the two the bar needs.
- **No break is reported.** The 52.9 seconds is PLUMBER's measurement, cited, not
  re-measured by this lane, and this lane has not walked the demo this round.
- **No reference game cited.**

## AND I FIXED A RED IN MY OWN GATE THAT WAS MEASURING THE CLONE
The voice gate went 115 pass, 1 fail with nothing in my diff touching the quest, the
record or the gate. Last round I learned not to attribute a red from one pair of runs,
so this time I checked the clean tree FIRST: **clean is also 115/1.** Pre-existing, not
caused by this round, and still mine because it is my lane's gate.

The failing check reads the quest at the pre-pass commit stored in the rewrite record.
That commit is from 8/26 and git says "unknown revision".

**THE CAUSE IS THE CLONE, NOT THE WORK, AND GIT CONFIRMS IT:**

    git rev-parse --is-shallow-repository    true
    .git/shallow                             exists
    git rev-list --count HEAD                76
    oldest commit reachable                  9/21

**THIS SESSION'S CLONE IS SHALLOW.** The 8/26 commit is not in it. Re-deriving the ref
from git instead of trusting the stored one fixes nothing either, because `passRef^` is
equally out of reach: there is no history to reach.

**A CHECKER THAT GOES RED BECAUSE OF CLONE DEPTH IS MEASURING THE CLONE AND NOT THE
WORK.** That is the same class as the two rulers this gate has already had fixed, and it
is the fourth ruler failure this lane has recorded.

THE FIX, AND IT IS NARROW ON PURPOSE: the check SKIPS, and only on a condition git
itself reports. On a full clone an unreachable ref is still a FAILURE, because there it
means a real regression. The skip prints its reason so nobody reads it as a pass:

    SKIP: SKIPPED, and the reason is the clone and not the work: this clone is SHALLOW
          (git says so), so the pre-pass commit from 8/26 is not present. On a full
          clone this is still a failure.

**MUTATION-TESTED, because a skip that cannot fail is a blanket pass.** Told the gate
the clone is full and it goes back to 115 pass 1 fail, on the same tree. Restored: 114
pass, 0 fail, two honest skips.

**AND THIS IS NOT ONLY MY GATE'S PROBLEM.** Any checker in the fleet that reaches back
past 9/21 in git history will fail here for the same reason and it will look like a
regression. Routed below.

## ROUTED
- **RUN [loading screen] and UI [analog horror ui]** the words are ready and they are
  short enough to read inside a stage. Two conditions travel with them: each state line
  is wired to the stage it names, and the count in the slow line is the real file count.
  Neither is a style note; both are the promise rule.
- **RUN** the 10 second rule says a load past ten seconds needs a way to interrupt as
  well as a percent. Ours is 52.9. That is a surface decision and it is named here, not
  taken.
- **PLUMBER and every lane with a gate that reads git history** this clone is shallow,
  76 commits, nothing before 9/21. A gate that reaches further back goes red for a
  reason that has nothing to do with the work, and on the suite line it will read as a
  regression. The shape that fixes it is in my gate now: skip only on the condition git
  itself reports, say why out loud, and mutation-test that it still fails on a full
  clone.
- **WORDS, standing** the ruler comes from who controls the dwell. Written into the bank
  beside the lines.

## SOURCES
- `slices/BOHEMIA_ALPHA_0_9.html` around line 1396 and 1465: the three splash states and
  the WARMING constant, read this round.
- PLUMBER's measurement on the VAMILY front page: the door at 52.9 s on a 4x CPU, 13.4 s
  at 1x, 79.4 s at 6x, against a 5 s goal.
- Response-time limits and progress-indicator guidance: 0.1 / 1 / 10 seconds; a looped
  indicator for 2 to 9 seconds; a percent-done indicator and a way to interrupt at 10
  seconds or more; and the three things an indicator provides.
- `engine/bohemia_stage.js`, executed for every read time here.
- Q27 school for the institution's two legal homes and the issued-twice rule; Q4 round
  two for the boxes this round deliberately does not use.
