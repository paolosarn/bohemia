# A CROWD IS NOT ONE CROWD (9/12/26, LIFE + CITY lane)

Round 9 of VAMILY `[more people]` POPULATION-DEFAULT. Round 8 put a crowd in the world and
a walk found it 5 times in 16. This round is the other eleven walks.

## THE ROUND OPENED BY FIXING MY OWN BOARD LINE

Front-page **rule 11** landed 9/12 from EYES E16: *a SHIPPED line keeps the ruling it
answered.* Measured there — an OPEN line cites one of Paolo's rulings 34% of the time, a
SHIPPED line only 12%, because the line gets rewritten as a result summary when it lands.

**This lane had done exactly that.** Round 8 replaced the whole `[more people]` line with a
result summary and took two things with it: the row's own brief (*dispatch item 5, "dead is
not the default"; the number is his, the mechanism is ours*) and the coordinator's 9/7
ruling that unblocked six rounds of the row. Both recovered verbatim from `9a44b85` and put
back; the result stays as an addition, which is what the rule allows. The lane's other two
recent lines were checked against the same rule and were clean.

## AND THE ELEVEN MISSING WALKS HAD NOTHING TO DO WITH CROWDS

The near field rebuilt when he crossed a **512-cell neighbourhood boundary** — an arbitrary
line on a grid. A 400-step walk crosses one or two of those however far it goes, so he got
one or two chances at a crowd per walk, and the rest was luck.

## THE FIRST FIX WAS WORSE, AND THE WALK SAID SO

Anchoring the rebuild on **his own position** — rebuild once he has walked further than the
field's own reach — sounded right and measured **4 of 16, down from 5**. Every sixty cells
it threw away the crowd he might have been walking toward and built another somewhere else.
**He was chasing a mirage.**

## WHAT SHIPPED: THE ANCHOR IS THE CROWD

The field rebuilds when he has left **the crowd** behind, not when he has moved. A crowd he
is approaching is never discarded: it stands where it is until he has genuinely gone past
it, and only then does the next one form.

    walks that met a crowd    5 of 16   ->   8 of 16      half of all walks
    biggest group seen        14        ->   14
    walks that met anybody    16 of 16  ->   16 of 16     round 7's floor, unchanged
    empty standings           65 of 120 ->   65 of 120    unchanged

## AND ONE OF MY OWN GATES CAUGHT A SLOPPY EDIT

Hoisting the walking budget to the top of the function turned `WALK_MIN` into a bare `5`,
and `never_empty_gate`'s A2 went red: *the comment calls it a budget instead of pretending*.
The leg was right. A budget that stops looking like a budget is how a dial gets smuggled in.
Restored to its name, 14/0.

## THE GATE

`gates/a_crowd_to_walk_into_gate.js`, 7/0, **ratcheted to the new number** — B1 now demands
6 of 16 where it demanded 3, so round 9's result cannot quietly slip back to round 8's.

MUTATION-TESTED: put the anchor back on his own position, and it reproduces the worse cut
exactly — **4 of 16**, B1 red.

## THE ROW

Still CLAIMED. Half of all walks meeting a crowd is the closest this row has been to its
own ship test, and it is in the walked surface and the demo. Eight walks in sixteen still
find only the floor.

Tab: CITY, or just walk. Build stamp: 9/12b.
