# A BLOCK OF CELLS AT 60

PLUMBER, row `[grid budget]`, rule 34. Paolo made the character tiny on an honest grid: one cell,
one cell per step, a house many cells. The row asks for the budget before WORLD's block ships: a
block of about 30x30 cells, its people, and a fight on it, at 60 fps on the throttled phone
profile. It folds `[bb budget]` in.

Rule 34 section 5 gives the numbers to hold: a cell about **32 CSS px**, the phone showing about
**11 across and 25 tall** (275 cells on screen), a person **one cell** (~28 px), a house 4x4, a
car 2x1, a street 3 wide with 1-cell sidewalks. A 30x30 block is 900 cells, of which only those
275 are ever drawn.

## THE ANSWER IN TWO LINES

**The block is cheap and WORLD can build it.** 275 cells as real sprite blits, plus 80 people at
one cell each, plus a fight with reach lit, costs **0.9 to 3.9 ms of work per paint on a
phone-shaped CPU**. A 60 fps frame is 16.7 ms and a 120 BPM beat is 500 ms.

**What cannot currently carry it is the surface underneath.** On the walked street at 4x throttle,
a 500 ms beat lands **three seconds late**.

## THE GRID'S COST, MEASURED DIRECTLY AROUND THE DRAW

```
                                      1x            4x (phone-shaped)
275 cells as flat fills             0.1 ms          0.9 ms
275 cells as 32px sprite blits      0.3 ms          2.0 ms
  + 1 person                        0.4            2.4
  + 8 people                        0.4            3.9
  + 30 people                       0.3            2.3
  + 80 people                       0.4            3.1
  + a fight (8 fighters, reach
    lit on 12 cells)                0.3            2.5
```

Against a 16.7 ms frame, the worst rung at 4x is **24% of a frame**. Against a 500 ms beat it is
**0.8%**. Eighty people is already far more than a block holds, and the fight costs nothing extra
because the reach highlight is twelve rectangles.

**Sprites cost about 2x flat fills at 4x (2.0 vs 0.9 ms) and that is the honest number to plan
with**, because a real grid blits tiles, it does not fill rectangles.

## WHY THE FRAME-RATE COLUMN IS NOT THE BUDGET, AND I AM NOT QUOTING IT AS ONE

The fps column disagreed with my own paint timer, so I did not use it. At 1x, flat fills read
**11.6 fps while costing 0.1 ms a paint**, and sprite blits read **43.9 fps while costing 0.3 ms**
— the cheaper draw read four times worse. At 4x the fps column sat at **0.8 to 2.6 across every
rung** while the paint cost moved 4x with the load.

A number that does not move when the load moves 10x is measuring something else: the host page's
own work, not my grid. The paint cost is timed with `performance.now()` around the draw itself and
it is the number that scales. This is the third round running where the fps of a continuously
animating overlay on this page at 4x could not clear 30 no matter what it drew.

## THE FINDING THAT MATTERS MORE THAN THE BUDGET

One boot, both surfaces, the same timer, the same drawing, 8-second windows:

```
THE WALKED STREET    10/18 beats landed   one paint 0.5 ms
                     beat late by: MEDIAN 3,152 ms, WORST 5,254 ms
THE MAP              16/16 beats landed   one paint 0.1 ms
                     beat late by: median 7 ms, worst 18 ms
```

**It is the surface, not the harness.** The map keeps perfect time. The walked street, at 4x, takes
a beat that should arrive every 500 ms and delivers it every ~3,600 ms, while the work it is being
asked to do costs half a millisecond.

This is not new, it is the magnitude of something already measured. Round 3 of `[sixty fps]` found
beats LATE once settled going 9.9% -> 31.6% at 4x with 8.3% swallowed whole. That said a third of
beats were late. This says the late ones are late by **six to ten beats**.

**120 BPM is the pillar, and on a phone the walked surface is not keeping it.**

## WHAT THIS MEANS FOR RULE 34, PLAINLY

1. **Build the block.** 275 drawn cells, its people and a fight fit with room to spare. The
   drawing is not the risk and the numbers say so at both throttles.
2. **Paint it on the beat, not every frame.** Same conclusion as the far map last round (which
   measured 1.7 ms of a 500 ms beat, 99.7% headroom), reached again here from a different surface.
3. **But the walked street's timer has to be fixed before any of it can be judged on a phone.**
   Anything added there now inherits a beat that is three seconds late, and no measurement taken
   on it will mean anything. That is not this row's to fix and it is not WORLD's either; it is the
   walked surface itself, and it is named here rather than left for somebody to trip over.

## WHAT IS NOT MEASURED

**The real block.** WORLD has not shipped it, so this prices a faithful stand-in at the law's own
numbers: a 30x30 cell state array stepped every paint, 275 of those cells blitted from a five-tile
atlas at 32 px, people at one cell, a reach highlight. When the real block lands, this lane
re-measures it rather than assuming the stand-in was right.

**Travel**, still. Same reason as last round: there is nothing to travel on yet.
