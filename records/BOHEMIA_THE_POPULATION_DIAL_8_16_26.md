# THE POPULATION DIAL -- the slider he asked for on 8/1, shipped 8/16 (PEOPLE lane)

## WHAT HE ASKED FOR, FIFTEEN DAYS AGO

> "why don't you do some coding plumbing right now till I make a population
>  slider ... I think this is gonna be extremely important anyway as we go
>  throughout the three acts ... it should be something that's extremely easy to
>  control ... the slider can go all the way from zero to a maximum."
> -- Paolo, 8/1/26

The plumbing was built the same day: `DIAL`, `setDial()`, `dialAt()`,
`applyDial()`, a MIN and a MAX, all in `engine/bohemia_population.js`, all
inlined into the city.

**MEASURED 8/16: NOTHING ANYWHERE CALLED `setDial`.** Not the alpha, not the
city, not the run, not a debug key. There was no control, in any tab, at any
zoom. The number he told us to build him a way to set was reachable only by
editing a file.

That is the exact failure the 8/12 law was written for: *"every system he has to
make decisions about ships with an INSTRUMENT for making them, IN A TAB, THE
SAME TURN."*

## WHERE IT IS

**The RUN tab.** A `👥 PEOPLE` button in the toolbar beside `↻ REROLL`. Tap it
and a card opens saying how many people are on the street he is standing on,
with the handle under it.

## WHAT IT DOES, MEASURED ON THE REAL SURFACE

Standing in a settlement, counting the bodies the frame actually blitted:

    dial   0  ->   0 people    a ghost valley
    dial   1  ->   6 people    what ships today
    dial   4  ->  31 people
    dial  32  ->  88 people    every home the block can fit

Standing on the spawn block (a `spread` neighbourhood) it stays at one person at
every setting above zero, and **that is his own 7/29 ruling working, not a bug** --
"some clusters. some no mans lands. some random spread." A spread neighbourhood
is one household per 128x128 subdivision by design, scattered over ground far
wider than the screen. The panel says so in plain words rather than letting the
handle look broken.

## THE ARITHMETIC THIS CORRECTED, AND IT WAS WRONG BY SEVENTY TIMES

`bohemia_population.js` carried this since 8/1, and it was the headline of the
first draft of the shipping tool:

> "the zone-map path yields 60 at dial 1, so the truthful setting is around 19"

It divided a TOTAL POPULATION (the scale model's ~4,723 survivors) by a
NEIGHBOURHOOD COUNT -- `census()` dedupes to one row per neighbourhood via
`seen[k]`, so its "60" is sixty *neighbourhoods*, not sixty residents. Apples
over oranges.

Swept properly (seed 7, every 3rd plot, counting the agents the world actually
instantiates):

    dial  0  ->        0 people
    dial  1  ->   ~4,194        <- what ships today
    dial  4  ->  ~14,715
    dial 16  ->  ~59,013
    dial 32  ->  ~96,885        <- the ceiling

**So the valley is not underpopulated. At dial 1 it is already at 89% of the
scale model.** The street reads sparse because ~4,200 people spread over a 96x96
valley IS one person every couple of blocks. That is the scale model working.
Whether it is the game he wants is a different question, it is his, and this is
the thing he answers it with.

`people_gate.js` G9 had frozen the bad reasoning into an assertion
(`DIAL_MAX >= 20`, justified by "the answer is around 19x"). The 20 was right by
accident, which is the worst way for a number in a gate to be right: it kept
passing while the reasoning under it was rubble. It now reads the landmarks out
of the module and cannot go stale.

## FIVE REAL BUGS BETWEEN "IT EXISTS" AND "IT WORKS"

Every one of these measured perfectly upstream and did nothing on screen.

1. **The panel landed inside `#topbar`**, whose CSS is
   `#topbar>*{position:static !important;top:auto !important}` -- it would have
   stripped the card's positioning and dropped a 430px panel into the middle of
   the button row. The tool now CUTS and RE-INSERTS rather than swapping in
   place, so a misplaced block relocates itself instead of living there forever.

2. **The dial never reached the surface.** `applyDial` multiplies a RATE, and its
   only caller is `occupiedRateFor` -- the adapter `bohemia_agents.js` goes
   through. The city does not go through it at all:
   `peoplePass -> pplPeople -> peopleIn -> homesIn -> headsAt`, and `headsAt` is
   raw. Bodies drawn at dial 0, 1 and 20 measured **1, 1 and 1**. The headless
   sweep looked perfect the whole time because it walked the other path.
   ONE DIAL, TWO PATHS, APPLIED EXACTLY ONCE ON EACH.

3. **A cache outlived the decision.** `PPL_PEOPLE` keys on `rulesVersion()`,
   whose own comment says "bumped by any mutation", and `setDial` did not bump
   it. Fixed IN THE MODULE, not at the call site: clearing a cache next to the
   button would have fixed this button and left the next caller of `setDial`
   broken in exactly the same way. A COPIED LINE IS A FIX THAT ONLY HALF-SHIPPED.

4. **The bottom of the slider lied.** The module promises dial 0 is "A GHOST
   VALLEY. Not 'fewer people' - NOBODY ... It has to be reachable or the bottom
   of the slider is a lie." The authored spawn neighbour is not a census
   resident, so he sailed through it and stood on an empty street at dial 0.

5. **The top of the slider was dead ground.** The surface capped a neighbourhood
   at 24 bodies -- a draw budget, sensible at the shipped population, and silently
   the ceiling of the entire dial. Dial 4, 12, 20 and 32 drew **the same street**.
   The budget now rides the dial (24 at dial 1, hard ceiling 240).

## WHAT IS STILL HIS

**The number.** MECHANISM-MINE / CONTENTS-PAOLO'S: a dial is a DECISION, not
words, so it waits. It ships at **exactly** where it has always been -- dial 1 --
and nothing in the world moves until he drags it.

`ACT_DIAL` (a setting per act) and `REPAIR_WORTH` (what a repaired district is
worth in people) are still empty and still his.

## AND IT ANSWERS A QUESTION THAT HAS BEEN OPEN SINCE 8/1

`records/BOHEMIA_HOW_MANY_PEOPLE_CONTRADICTION_8_1_26.md` has sat [PENDING
Paolo] with three live answers spanning three orders of magnitude, and it ends:

> "walking one block from home, how many people should be on that street --
>  nobody, a couple, or a dozen?"

That was never put to him in a form he could answer, because answering it meant
arbitrating three constants in three files. It is now a handle he drags until
the street looks right.

## AND A TOOL THAT WAS ARMED TO DELETE ANOTHER LANE'S WORK

`tools/bohemia_city_talk_patch.py` strips the CITY TALK block out of the city and
regenerates it from its own `TALK_JS` constant -- still the 8/3 text. That is safe
exactly as long as it is the only thing that has ever written there, and it has
not been since at least 7/31.

Re-running it this turn **deleted 2,607 lines**, including the FACTIONS lane's
`CT_BASES_BAKED` and every faction canon string from their 8/16 ship, plus
`__CITY_STANDING__`. **Every gate stayed green** -- a gate that does not know the
content existed cannot miss it. It was caught in `git diff --numstat`
(266 added, 2,607 removed), and the city was rebuilt without it, with the two
city-side edits applied surgically instead.

The tool now refuses: before stripping, it diffs the block on disk against its
own `TALK_JS` and stops dead if the file says anything it cannot regenerate (it
currently reports 2,121 such lines). **A REGENERATOR IS ONLY SAFE WHILE IT IS THE
ONLY AUTHOR.**

Two more checkers were fixed at the ruler rather than the target:

- That same tool would not re-apply at all, because its "already applied?" test
  was the bare substring `CITY TALK` -- and three *later* patches now cite CITY
  TALK in their own comments, correctly, because it is the lane they must not
  break. The strip succeeded and the tool called its own success a failure.
  It checks the four structural delimiters now. A CHECKER THAT CANNOT TELL A
  MENTION FROM A USE IS THE BROKEN ONE.
- `gates/bohemia_gates.py` would not run **at all**: the `INSTRUMENTS` entry
  (MUSIC lane, 8/16) was a 3-tuple in a 4-tuple table, so `_run_all` died on
  unpack before a single gate executed. One missing `False`.

## THE MACHINE

`gates/population_dial_gate.js` -- 19 assertions, registered in
`gates/bohemia_gates.py` as POPULATION DIAL. It presses the button he presses,
walks into a settlement, and counts the bodies the frame blitted. Mutation
tested against all four core fixes:

    revert dialHeads (dial never reaches the city)  -> 3 FAIL
    remove the rulesVersion bump (stale cache)      -> 4 FAIL
    freeze the draw budget at 24 (dead top)         -> 2 FAIL
    put the panel back under the toolbar            -> 1 FAIL

Tool: `tools/bohemia_population_dial_patch.py`, idempotent by md5.
