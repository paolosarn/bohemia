# EYES AND EARS -- [the pairwise judge] -- ROUND ONE: SCHOOL
### 10/11/26 -- session eyes-5vql33

Row (rule 108 ROUND TEN (3) and (4), rule 100): a chat's opinion of its own picture is not in the
loop. Build the judging recipe every art lane calls: two candidates and the pack twin on one
strip, ONE plain question per pass, answered by EYES, never the maker, never a score, capped at
three passes, keep the best; the squint strip (8x8, 16x16) on every card; every NO gets ONE fault
tag from a catalogue, handed to PLUMBER the same sweep. This round is research only, per this
lane's two-round law: what already exists, before building anything new.

## REUSE-FIRST: THE FAULT CATALOGUE ALREADY EXISTS, EIGHT REAL MEASURES, NOT ZERO

The row asks for "ONE fault tag from the catalogue" on every NO. No file in the repo is literally
named a fault catalogue, but the real content already exists, split across two tools that already
complement each other by design:

- tools/bohemia_pixel_craft_audit.py (gates/pixel_craft_gate.py): ORPHAN SHARE (single stray
  pixels), SINGLE-USE COLOURS (the resampling tell), PIXEL BLOCK SIZE, PILLOW SCORE (shading that
  radiates from the centre instead of one light direction), LIGHT ANGLE AGREEMENT, CLUSTERS PER
  1000px (colour noise).
- tools/bohemia_eyes_pixel_tells.py (this lane's own E1, 9/5): BANDING (two colour boundaries
  travelling parallel so the eye reads a stripe nobody drew) and JAGGIES/DOUBLES (an outline step
  that breaks the run of its neighbours), explicitly built to NOT re-measure the six above --
  its own docstring states the gap it closes by name.

EIGHT NAMED, ALREADY-MEASURED FAULT CATEGORIES, not invented for this row: orphan pixels,
single-use colours, block size, pillow shading, light-angle disagreement, colour-cluster noise,
banding, jaggies. A NO on a pairwise card gets ONE of these eight as its tag (the one the
candidate actually fails), never a new ad-hoc word per verdict -- which is what "becomes a
measured check" in the row's own text requires: a tag PLUMBER can wire to an existing function,
not a fresh category every round.

## THE SQUINT: TWO DIFFERENT THINGS SHARE THE WORD, NAMED SO ROUND TWO BUILDS THE RIGHT ONE

tools/bohemia_look_again.py already has a transform it calls "squint" -- a Gaussian blur at
distance, simulating looking from across a room. Rule 108's own squint is a different, real,
standard pixel-art technique: downscale the asset to 8x8 and 16x16 (literal pixel counts, not a
blur) to test whether the silhouette and the big shapes still read at a glance, independent of
detail. These are not interchangeable; round two builds the literal 8x8/16x16 downscale (PIL
resize down, NEAREST back up for display), not reused from bohemia_look_again.py's blur, and says
so rather than quietly borrowing the wrong technique because the name matched.

## THE STRIP LAYOUT AND THE OBJECTIVE ASSIST, REUSED FROM THIS LANE'S OWN LAST TWO ROUNDS

- tools/bohemia_eyes_the_twin_sheets_check_10_10_26.py already has a working `card()` function
  that composites images side by side with labels and stats beneath, and a real boundary-detector
  (`crop_card()`) for reading an existing composited sheet by its own background colour -- the
  same shape the pairwise strip needs (candidate A, candidate B, the twin, at one art pixel to one
  phone pixel), extended from two columns to three.
- tools/bohemia_eyes_before_and_after_check_10_10_26.py already has the real YIQ perceptual
  distance (Kotsarenko and Ramos 2010). THE ROW ASKS FOR A PLAIN QUESTION ANSWERED BY EYE ("which
  is closer... in outline weight / light / palette / silhouette / size"), never a score -- but a
  real number can still sit UNDER the question as this lane's own proof line (rule 89's own
  pattern: "a number is the proof line, never the show"), computing YIQ-distance(A, twin) and
  YIQ-distance(B, twin) as an objective assist to the eye, never a replacement for it.

## WHAT ROUND TWO BUILDS, ARMED BY THIS

1. One tool: given candidate A, candidate B, and the pack twin (three images, same crop size),
   composite a three-up strip at 1:1, plus an 8x8 and 16x16 squint (literal downscale) of each.
2. Run the eight-fault catalogue (imported from the two existing tools, not re-measured) on A and
   B, surfacing which fault(s) each one trips, as the proof line under the picture.
3. Compute YIQ-distance(A, twin) and YIQ-distance(B, twin) as the second proof line.
4. THIS LANE answers the one named question by eye, looking at the strip and the squint, names
   the better candidate and the one fault tag if either fails outright, cap three passes per
   candidate pair, keep the best.
5. Prove it on three real pending-candidate cards once two real candidates of the same asset
   exist to compare (checked: rule 101's "one asset per cook per round" means a true A/B pair may
   not exist yet for every family -- round two's first job is finding which, if any, pending items
   already have two real candidates to judge, rather than assuming one).

## ROUTED

Nothing to route yet -- school round, no building, no judging done.

## SHIP TEST FOR THIS ROUND

Found the real fault catalogue already built and named (eight measures across two existing tools,
one of them this lane's own), rather than inventing a ninth category from nothing; caught and
named a real naming collision before it could cause round two to reuse the wrong "squint"; found
the strip-compositing and boundary-detection code already proven last round, and the real
perceptual-distance formula already sourced the round before that, both extendable rather than
rebuilt. NO JUDGING THIS ROUND, per the lane's own two-round law. Round two next: build the strip
tool, find real pending A/B candidates to prove it on.
