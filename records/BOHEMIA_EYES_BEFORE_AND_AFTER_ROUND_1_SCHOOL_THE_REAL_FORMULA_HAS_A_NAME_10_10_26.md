# EYES AND EARS -- [the before and after] -- ROUND ONE: SCHOOL
### 10/10/26 -- session eyes-5vql33

Row (rule 89, Paolo 10/10 on the fight's ground sharpened, voted NO: "can't tell difference").
Every look item from the rule-88 program gets a real before/after picture, one art pixel to one
phone pixel, in ONE image, before VOTE ever sees it; one line says whether a person could actually
see the change. Start with the three he just voted NO. This round is research only, no building,
per this lane's own two-round law.

## THE ROW'S OWN CITATION, CHECKED, NOT ASSUMED TRUE

The row's own [bb] line claims "Battle Brothers' patch notes show a change as two screenshots of
the same scene." Checked before building anything on it: SteamDB's own mirrored patch-note pages,
a GOG "what did just update" thread (official changelog text, relayed), the Battle Brothers fandom
wiki's update pages, and news coverage (GoNintendo, Nintendo Everything, Turn Based Lovers) were all
searched. EVERY ONE IS TEXT-ONLY -- item stat changes, tooltip fixes, DLC notes -- no image, no
before/after screenshot, anywhere found. This does not PROVE the practice never exists (a specific
Steam news post with an embedded image is harder for a text search to surface), so it is reported
honestly as NOT CONFIRMED rather than false -- but it was not found where a real citation should be
checkable, and this round could not stand the row's own premise up as a real precedent. The actual
craft this row needs is sourced below on its own real merits, not borrowed credibility from a
citation that did not check out.

## THE REAL SCIENCE: THIS IS A SOLVED, NAMED PROBLEM, NOT A NEW ONE

"Is a pixel difference visible to a human eye" is a real, well-studied field with a converged,
widely-used industry answer, not something to invent from feel:

- **The real metric, with a name and a paper**: `pixelmatch` (the small, MIT-licensed library behind
  most web and game visual-regression tools -- jest-image-snapshot, Percy-style diffing) computes
  perceptual colour distance in YIQ space (the NTSC colour-transmission model, weighted 0.5053 /
  0.299 / 0.1957 on its three channels), following a real published method (Kotsarenko and Ramos,
  2010) -- not a raw RGB subtraction, which does not track what a human eye actually notices.
- **Anti-aliasing is excluded, on purpose, by a second real method**: a pixel flagged as different
  is checked against a published anti-aliasing detector (Vyšniauskas, 2009, an intensity-slope
  test) before it counts, so a one-pixel-wide smoothing edge from the renderer itself -- present on
  BOTH the before and the after, unrelated to the actual change -- is not mistaken for a real
  difference. This is the real, precise version of exactly what the row asks for: not "did any byte
  change," but "would a person looking at it notice."
- **A real default threshold exists and is citable**: the library's own default sensitivity is 0.01
  (on its 0-1 scale), tuned over years of real visual-regression use across the industry, not a
  number this lane has to invent from nothing.

ROUND TWO DOES NOT NEED THE NPM PACKAGE ITSELF: both real formulas (the YIQ distance, the
anti-aliasing slope test) are small and well-published enough to implement directly in plain JS,
the same self-contained-tool practice every instrument this lane has built this session already
follows (no new dependency, Playwright plus vanilla code).

## A REAL CAUTION, FOUND IN THIS REPO, NOT INVENTED

Before assuming a straight pixel diff would even be safe here, checked this lane's and other
lanes' own prior notes. Three separate files (tools/bohemia_do_they_look_related.js,
tools/bohemia_eyes_probe.js, gates/eyes_gate.js) all independently warn against exactly this: "a
naive pixel diff would cry wolf" because the game shuffles a citizen and a fit on every load, so
two screenshots of nominally "the same scene" can differ for reasons that have nothing to do with
the actual change being judged. THIS MATTERS DIRECTLY FOR ROUND TWO'S METHOD: the before and after
must be the SAME seed, same camera, same lighting state, same random state -- captured as
controlled a pair as this lane's own fight-floor and far-stop tools already know how to reach, not
two independent walks that happen to land near each other.

## THE PREMISE, NARROWED FOR REAL

The three named items (the sideways sides, the three bodies, the fight's ground at its own pixels)
are all already shipped and already live on main -- the "after" is a real, reachable surface today.
The "before" is not: it needs the commit immediately prior to each ship, checked out and rendered
the same controlled way, not guessed from memory or skipped. Round two's first job, before any
diffing, is finding each item's real pre-ship commit.

## WHAT ROUND TWO BUILDS, ARMED BY THIS

1. For each of the three named items: locate its real before-commit (git log on the file that
   shipped it), render both states under the identical seed/camera/lighting this lane's own prior
   tools already control for, at one art pixel to one phone pixel, on his phone's profile.
2. Composite both into ONE image, side by side, exactly as the row asks.
3. Run the real YIQ-distance-plus-anti-aliasing-exclusion check (implemented directly, the same
   self-contained-tool practice this session has used throughout) and report the percentage of
   pixels that clear the real published threshold.
4. One line, in his own words' register: visible or not visible to a person, with the real number
   behind it, not just a feeling.

## ROUTED

Nothing to route yet -- school round. The missing BB patch-note precedent is named, not chased
further; the real craft stands on its own sourcing regardless of whether that citation holds up.

## SHIP TEST FOR THIS ROUND

The row's own cited precedent was checked, not assumed, and did not hold up under a real search --
named honestly rather than built on. The actual question this row asks ("is a pixel change visible
to a person") turned out to be a solved, named, real field: a specific published algorithm
(Kotsarenko and Ramos' YIQ distance, Vyšniauskas' anti-aliasing exclusion) already used industry-
wide for exactly this purpose, not invented here. A real caution already sitting in this repo (three
separate files warning that a naive pixel diff cries wolf on this specific game's own randomness)
was found and will shape round two's method before it could cause a false reading. NO MEASURING
THIS ROUND, per the lane's own two-round law. Round two next: the real before-commits found, the
real diff built, the three named items answered.
