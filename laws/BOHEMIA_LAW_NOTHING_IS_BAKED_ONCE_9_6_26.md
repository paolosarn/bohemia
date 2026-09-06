# BOHEMIA LAW -- NOTHING IS BAKED ONCE (coordinator 9/6/26, correct-after; Paolo may overrule)

## THE PATTERN, FROM SIX MEASURED INCIDENTS IN ONE DAY
Not a theory. Six lanes independently hit the SAME defect and none of them saw it
as the same defect, because each one looked like a different bug:
1. **The seat bake was one-shot**, so the walked city carried last week's capitals
   while the canon said something else (FACTIONS, [faction homes]).
2. **His colour answer was locked in a browser.** He ruled every faction's colour
   8/26, garment by garment, and it existed ONLY as rendered pixels: a gate could
   read it by launching a browser, the game could not read it at all. Three jobs
   in three other lanes were stopped on that ([who holds] drew borders in two
   colours "for want of a hue", [owner shown] blocked, [border marked] blocked).
3. **The wardrobe bank went five garments stale** while the new shapes were live in
   the game; the card gate went red on arrival, correctly.
4. **A merge silently dropped batch 5 from main** and nobody noticed until the next
   batch was cooked.
5. **cityRoom was written by the city and read by nothing**, so you walked through a
   front door into a firefight on a road, for months.
6. **The demo was re-cut by hand**, so "the demo carries today's game" was a habit
   rather than a fact, until [demo current] made it a hash.
Each was found by a different lane, days apart, and each cost a round or more.

## THE LAW
**ANYTHING DERIVED IS DERIVED ON EVERY RUN, OR A MACHINE PROVES THE COPY MATCHES
ITS SOURCE. NOTHING IS BAKED ONCE.**
- One source of truth per fact. The other copies are DERIVED, and derived files say
  so at the top, with the command that makes them.
- The derivation runs on every build, or a gate regenerates it clean and fails if
  the result differs from what is checked in. This is the standard industry answer
  and it is one line of diff: regenerate, then fail if the tree is dirty.
  Sources: [run your code generator as a test](https://adventures.michaelfbryan.com/posts/run-your-code-generator-as-a-test),
  [swagger-codegen: regenerate at every build](https://github.com/swagger-api/swagger-codegen/issues/5542),
  [a codegen check that fails on drift](https://github.com/anthropics/connect-rust/issues/95),
  [spec as source of truth](https://www.augmentcode.com/guides/spec-as-source-of-truth-rebuildable-codebase).
- **A RULING OF HIS THAT LIVES ONLY AS PIXELS IS NOT RECORDED.** If Paolo decides
  something and the only place it exists is a rendered frame or a browser's
  storage, the lane that took the ruling has not finished: it lands in a file the
  game can read, derived from his answer, re-derived whenever his answer changes.
- A one-shot bake is allowed only where a gate re-derives and compares.

## WHY IT IS A LAW AND NOT A NOTE
A law without a machine gate is not enforced (7/16), and every one of the six above
was invisible until a machine looked. This one gets a gate: derived_freshness_gate.
