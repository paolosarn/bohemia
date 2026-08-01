# THREE ANSWERS TO "HOW MANY PEOPLE LIVE HERE", ALL LIVE AT ONCE (8/1/26, PEOPLE lane)

[PENDING Paolo] — a contradiction between two of his own rulings. FLAGGED, NOT
RESOLVED. Nothing in the shipped game changed because of this file.

## THE MEASUREMENT

Same valley (seed 7), same 2,304 cells, three different sources of truth:

    bohemia_agents.js OCCUPIED_RATE = 0.30 (a declared placeholder)
        -> 8,282 residents, 36% of cells hold somebody

    Paolo's ZONE MAP (7/29, laws/BOHEMIA_ADDENDUM_HOW_MANY_PEOPLE_7_29_26.md:
    "the population IS the valley's food carrying capacity ... clusters AND no
    man's lands AND random spread")
        -> 49 residents + 11 workers = 60 PEOPLE IN THE WHOLE VALLEY,
           1% of cells hold anybody

    GDD v5 (~2.3M pre-crash, ~3% remain)
        -> ~69,000 people

Sixty, eight thousand, and sixty-nine thousand. Three orders of magnitude.

On cell 39,22 specifically: the flat rate says 0.30, the zone map says 0.0051.
A sixty-fold disagreement about one block.

## WHY NOBODY HAS NOTICED

The RUN uses the zone map, so it is on the low answer — and it does not feel
empty, because it applies a **6-household FLOOR to the player's own cell only**.
That floor was added 7/29 for a good reason (the run's own invariant is "he is
your neighbour, one door down"), and it has been hiding the size of this ever
since. Verified on the real surface:

    cell 39,23  the player's own block   13 people   (the floor)
    cell 39,22  one block north           0 people
    cell 39,24  one block south           0 people

Walk one street over and the neighbourhood is genuinely dead.

Meanwhile every OTHER consumer — gates, the city tab, this lane's own valley
measurements — calls agentsForPlot without a rate and gets the 0.30 placeholder.
So the run and everything that reasons about the run have been describing two
different cities.

## WHAT I DID NOT DO, AND WHY

I made the zone map the default inside agentsForPlot, measured it, and BACKED IT
OUT. It "works": every consumer then agrees. But they agree on 60 people in a
city, which contradicts his own GDD by three orders of magnitude, and making
everything agree on a suspected-wrong number spreads the bug instead of
containing it. Picking which of two live rulings wins is not a mechanism call.

The disagreement is now documented AT THE CALL SITE in bohemia_agents.js so the
next reader cannot miss it, and the rate stays explicit.

## THE THREE WAYS OUT, all his

1. **The zone map's constants are simply too low.** HEADS/weightOf produce a
   near-empty valley; if the intent was clusters-and-no-mans-lands around a
   ~69,000 population, the numbers need a pass. Most likely answer.
2. **The valley is meant to be nearly empty and the GDD's 3% is stale.** Then the
   run's home-cell floor is the thing that is wrong, and the game should feel that
   empty everywhere.
3. **~69,000 live in the valley but almost nobody is OUTSIDE.** Also grounded —
   Mojave heat, and the run already empties the street at midday. Then the census
   is about households, not bodies on the street, and the two were never the same
   number.

WHAT WOULD SETTLE IT IN ONE SENTENCE FROM HIM: walking one block from home, how
many people should be on that street — nobody, a couple, or a dozen?

## SCALE, for whoever picks this up
A cell is 128x128 fine cells at 0.75 m = **96 m x 96 m** (valley_scale_gate).
The valley is 48x48 cells ≈ 4.6 km across. That also kills the "put travellers on
the roads" idea this lane had queued: a three-cell commute is under 300 m, about
four minutes' walk, so rendering commuters mid-journey would be inventing traffic
rather than showing it. The roads being empty is not the bug. THIS is.
