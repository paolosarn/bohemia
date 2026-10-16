# WORDS Q3 -- HOW A CROWD TALKS WITHOUT REPEATING ITSELF
# VAMILY research day, 9/4/26, lane WORDS (words-8dqrnq). MODE: RESEARCH.
# The question, verbatim: "How a crowd talks without repeating itself. The best
# ambient-bark systems ever built: how many lines, how they are chosen, how they
# avoid the third repeat. Against our roadside director's twelve."

## THE ANSWER IN ONE LINE
**Our director cannot repeat itself, which sounds like the problem solved and is
actually the problem: a token fires at most ONCE PER SESSION and is then gone
forever, so the valley does not get repetitive, it goes SILENT after twelve
moments.**

## 1. THE FINDING THAT PROVES US WRONG
`eligible()` in the roadside director contains one line:

    if (state.fired[tok.id]) return false;      // no repeat-spam

and `repeatAfterS` defaults to `null`, with the code's own comment saying the
repeat interval is NOT RULED. So the strictest possible reading was chosen, and
it is honest, but it has a consequence nobody wrote down:

**THE THIRD REPEAT IS IMPOSSIBLE. SO IS THE SECOND. THE ROSTER IS SINGLE-USE.**

    12 tokens x 90s minimum gap = 18 MINUTES OF WALKING before the valley has
    permanently run out of things to do, for the rest of that session.

A shuffle bag draws without replacement AND THEN REFILLS. We built the first half
and not the second. What we have is a bag that empties.

## 2. AND THE APPROVED PACING IS UNREACHABLE BY CONSTRUCTION

    kind          tokens in the roster        the MIX asks for
    ambient          3  =  25.0%                   70% of moments
    interactive      5  =  41.7%                   20%
    forced           4  =  33.3%                   10%

The design asks for **70% of its moments out of 25% of its content**, and because
a token is single-use that is not a rate it is a **hard ceiling of three ambient
moments per session, ever**. After the coyote, the dog pack and the rattlesnake
have each happened once, the director will keep choosing "ambient" as the
neediest kind for the rest of the night and find nothing eligible.

Best case a whole session delivers 3 / 5 / 4, which is **25 / 42 / 33** against an
approved **70 / 20 / 10**. The pacing package cannot be hit by any walk.

## 3. THE SPOKEN CROWD IS THE SAME SHAPE, ONE LAYER DOWN
558 bark lines, 534 distinct, across **152 speaker pools**.

    median pool size: 3 lines
    smallest: 1 line (faction:Colorful)
    largest: 12 (worker:work)
    **90 of 152 pools hold three lines or fewer**

## 4. HOW THE BEST SYSTEMS ACTUALLY DO IT
**VALVE (Left 4 Dead, Ruskin's rule database).** Hundreds of facts about the world
are fuzzy-matched against a database of thousands of candidate lines, and the MOST
SPECIFIC matching rule wins. Repetition is not solved by counting, it is solved by
the world supplying enough different facts that the same rule rarely wins twice.
**Specificity is the anti-repeat mechanism.**

**THE SHUFFLE BAG**, the standard technique: draw without replacement until the
bag is empty, then refill and reshuffle. It guarantees every line is heard once
before any is heard twice, and it removes the clustering that makes true random
feel broken.

**THE ARROW TO THE KNEE, and it is the transferable one.** Skyrim's guards were
written expecting the line to be rare. The condition that gated it went live for
essentially every player during an early dungeon run, so a throwaway line became
the most-heard sentence in the game and shipped mods to remove it. **The failure
was not the line and not the line count. It was a CONDITION that fired far more
often than the writer assumed.**

That is the lesson for us and it points the opposite way: their condition was too
common, ours (`already fired`) is too permanent. Both are unmeasured assumptions
about how often a gate opens.

## 5. HOW MANY LINES, ANSWERED WITH ARITHMETIC
In a shuffle bag of N, nothing can be heard a third time before draw **2N + 1**.
At one moment every 90 seconds:

    N =  3   third repeat impossible before draw   7   (10 minutes)
    N =  5                                        11   (16 minutes)
    N = 12                                        25   (38 minutes)
    N = 20                                        41   (62 minutes)
    N = 40                                        81   (122 minutes)

**A two-hour walk is 80 moments. To never hear anything a third time in it you
need forty. Our director has three ambient tokens and our median bark pool is
three lines.**

## 6. WHAT THIS SAYS TO DO, WHEN THE LANE RETURNS TO BUILD
1. **REFILL THE BAG.** Single-use is a silence machine. Draw without replacement,
   and when the bag empties, refill it. That alone turns 12 moments into an
   unbounded night with a guaranteed no-repeat window of 12.
2. **THE REPEAT INTERVAL IS A NUMBER AND THE CODE REFUSED TO INVENT IT.** It stays
   refused here. [PENDING Paolo] in the handoff, with the arithmetic above so the
   number has a meaning attached: a bag of N gives you 2N+1 draws of protection.
3. **THE AMBIENT SHORTFALL IS CONTENT, NOT CODE.** Three ambient tokens cannot
   serve 70% of moments under any selection rule. Either the roster grows or the
   MIX is wrong, and both are his.
4. **BUY VARIETY WITH CONDITIONS, NOT LINES** (the Valve lesson, and it is the
   cheap one). Twelve tokens crossed with district, hour, weather, faction owner
   and what the player is known for is not twelve moments, it is twelve times the
   number of world states. We already compute every one of those facts.
5. **MEASURE HOW OFTEN EACH CONDITION ACTUALLY FIRES** before shipping any of it.
   That is the whole arrow-to-the-knee lesson and it is one simulation.

## ROUTED
- **WORDS**  Q3 answered. Next open is Q4 (speech on a beat).
- **WORLD / RUN**  `REFILL-THE-BAG`: the director's roster is single-use and the
  valley goes quiet after twelve moments. This is their file, not mine.
- **WORLD / RUN**  `COUNT-THE-CONDITIONS`: simulate how often each token's gate
  opens before adding content. Cheapest possible insurance against both failure
  modes.
- **PEOPLE**  90 of 152 bark pools hold three lines or fewer; the median crowd
  voice repeats on its fourth appearance.
- **QUESTS**  The 70/20/10 pacing package cannot be delivered by a 3/5/4 roster.
Test lines: banks/BOHEMIA_WORDS_TEST_LINES.md, all `draft:true`, none in the game.

## SOURCES
- Elan Ruskin, "AI-driven Dynamic Dialog through Fuzzy Pattern Matching", GDC 2012:
  hundreds of world facts matched against a database of thousands of lines, most
  specific rule wins.
- The shuffle bag: draw without replacement, refill when empty; every item once
  before any item twice.
- The Skyrim "arrow to the knee" case: a line written to be rare, gated on a
  condition that went live for nearly every player.
- Our own roadside director (12 tokens, MIX 70/20/10, MIN_GAP_S 90, SPICE_CAP 1,
  `state.fired` single-use) and 558 bark lines across 152 pools.
