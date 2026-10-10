# EYES AND EARS -- [the before and after] -- ROUND TWO: THE CHECK
### 10/10/26 -- session eyes-5vql33

Row (rule 89): EYES checks the picture before VOTE. Round one
(records/BOHEMIA_EYES_BEFORE_AND_AFTER_ROUND_1_SCHOOL_THE_REAL_FORMULA_HAS_A_NAME_10_10_26.md)
sourced the real method (YIQ perceptual distance, Kotsarenko and Ramos 2010, plus an
antialiasing exclusion after Vysniauskas 2009) and found this repo's own naive-pixel-diff
caution. This round builds it and runs it for real.

## THE PREMISE CHANGED SINCE ROUND ONE, AND THAT IS THE FIRST FINDING

Round one planned to dig up the three named items' old commits and build their before/after from
scratch. Since then, PLUMBER's cook gate grew the rule-89 leg (refuses a look item with no
before-and-after picture), and four lanes shipped real ones this same round: RUN TWO's
slices/vote/RUN2_THE_SIDEWAYS_BAND_10_10.png (its own ship line names it "for DIRECTION and EYES
before VOTE" directly) and COOK's slices/vote/COOK_THE_PROPS_BEFORE_AND_AFTER.png,
COOK_HIS_BLOCK_BEFORE_AND_AFTER.png and COOK_THE_FAR_END_FROM_HIS_PICKS.png. REUSE-FIRST means
checking those, not rebuilding what already exists. Of the three items this row originally named:

- **the sideways sides** -- routes straight to [the sideways band] above (the same fault, RUN
  TWO's fix); checked below.
- **the three bodies** -- still waits on COOK THREE's redraw (rules 82, 87); there is no new
  picture yet, only the old one he already voted NO on. Nothing to check.
- **the fight's ground at its own pixels** -- still waits on COMBAT TWO's board-art rework; same
  situation, nothing new to check yet.

Chasing the old git history for the two still-waiting items would answer a question nobody is
shipping. They stay open, watched, and get checked the round a redraw actually lands.

## THE TOOL: tools/bohemia_eyes_before_and_after_check_10_10_26.py

For each of the four shipped pictures, the tool REUSES the exact before/after image pairs the
owning lane's own tool already produced -- importing and calling `the_props()`, `the_block()`
(COOK's own module) and `recut()` (the far-end module) directly, so this lane never re-derives a
crop by guessing. RUN TWO's own picture has no committed generator, so that one is read straight
off the shipped PNG, split at its own label bars (found by full-row brightness, not eyeballed).

On every pair it runs the real YIQ distance (channel weights 0.5053/0.299/0.1957) with the
antialiasing exclusion (a pixel sitting at a local brightness extremum against real contrast is a
smoothing edge, not a real change), default threshold 0.01 on the 0-1 scale, and reports the
percent of pixels a person would actually register as different -- beside COOK's own guard
metric (`abs(before-after) > 6` summed over RGB, a raw-subtraction count, exactly the naive
method round one's own sourcing warned against) for an honest side-by-side.

A SANITY CHECK ON THE TOOL ITSELF, NOT JUST THE PICTURES: with the antialiasing exclusion turned
off, HIS BLOCK's first window reads 29.8% changed instead of 14.3% -- the exclusion is doing real
work, not a no-op, and not zeroing the signal either.

## THE REAL NUMBERS

| item | windows | real visible % (mean) | worst window | COOK/RUN's own naive % |
|---|---|---|---|---|
| the sideways band | 1 | 65.4% | 65.4% | 76.9% |
| the props | 1 | 5.7% | 5.7% | 9.0% |
| his block | 6 | 12.0% | 8.95% | 19.1-29.9% |
| the far end's ground | 48 (every unique tile pair, not just the 192 cells shown) | 76.7% | 71.9% | n/a (COOK's own proof line uses different metrics, not a pixel count) |

THE PATTERN, NAMED HONESTLY: the real perceptual number runs consistently BELOW the naive count
on every item (by roughly a third to a half), because the naive method counts antialiased edges
and sub-threshold colour drift as "changed" when a person would not register them. That gap is
exactly what round one's sourcing predicted. IT DID NOT FLIP ANY VERDICT: every item, and every
one of the 56 total windows checked across all four, clears a wide margin above the level where a
real change registers (the worst of all of them, HIS BLOCK's window 1 at 8.95%, is still nearly
nine times a conservative 1% bar). The naive method over-counted; it did not invent a false
positive out of nothing.

## THE VERDICT, ONE LINE EACH, AS HE WOULD LOOK AT IT

- **The sideways band**: YES, visible. A dead grey band covering roughly a third of the screen is
  simply gone; the after fills edge to edge with real content. Not a close call.
- **The props**: YES, visible. The forecourt went from an empty island to two gas pumps sitting
  on it, at the size and place a body would actually stand next to.
- **His block**: YES, visible, in all six windows, though the lightest window (8.95%) is a third
  the strength of the heaviest (14.3%) -- real but uneven, worth knowing if a crop gets swapped.
- **The far end's ground**: YES, visible, by a wide margin -- the clearest case of the four. A
  flat tan wash became textured, grained ground with real colour range.

## WHAT THIS ROUND DOES NOT ANSWER

Whether a person would call these GOOD, or whether they fit the rest of the city, is DIRECTION's
call, not this lane's (rule 89 only asks "can he see it," rule 88 asks "is it any good"). This
round answers the first question for four pictures and leaves the second where it belongs.

## ROUTED

- COOK: the gap between your own naive guard (>6 raw RGB sum) and the real perceptual number is
  real and consistent (roughly 30-50% of your reported change is below what a person would
  register) -- not a reason to redo the four items shipped this round (all four still clear by a
  wide margin), but worth knowing before trusting the raw-diff number on a closer future call.
- CHARACTER / COMBAT TWO: [three bodies] and [the art at its own pixels] are still waiting on
  their redraws; this lane checks the picture the round one actually lands, not before.

## SHIP TEST FOR THIS ROUND

A real instrument built on the real, sourced method, run against four genuinely shipped pictures
this lane did not build (reused from their own owning lanes' tools, never re-derived by eye), with
an honest side-by-side against the naive metric already in use elsewhere in the repo, and one line
per item answering exactly what rule 89 asks. [the before and after] round two for these four
items IS ANSWERED; the two still-waiting items (three bodies, the fight's ground) stay open for
the round their redraw lands.
