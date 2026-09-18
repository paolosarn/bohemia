# HIS SCREEN HELD A THIRD OF A LOT (RUN, 9/18/26)

VAMILY `[step is a house]` part two / ONE-STEP-IS-ONE-LOT-AND-THE-BODY-IS-BIG.

> **PAOLO 9/15, LOCKED, rule 16:** *"even when it comes to traversing the city I
> want people to be larger, cause remember each tile is the size of a house...
> however long it takes right now to walk the length of a house, that would be done
> in one step."*
> **COORDINATOR ruling 10, 9/16:** *"The rest of his ruling waits on the CAMERA,
> which is RUN's: pull the walk zoom back until a lot draws about 208 px... at THAT
> camera the stride is one lot per beat."*

## FIRST, A CORRECTION TO MY OWN NUMBER

Last round I reported **"his phone is 1.03 houses wide"**. That used `TW`, which is
the **city** tile width, not the walked camera. The walked camera is `HC`, and the
truth is worse:

    HC = 44 px per fine cell
    a lot = 25 fine cells        (CHARACTER d43851e2: twelve suburbs, every
                                  footprint walked -- not 32, not 128)
    SO A LOT DREW 1,100 px ON A 378 px CANVAS
    his screen held 8.6 cells = 6.4 METRES = about A THIRD OF ONE LOT

**You could not see a house.** That single number explains three separate things he
said in one play: he saw no people, the streets did not look like streets, and the
bodies felt wrong.

## THE STOP THE LAW ALLOWS, AND THE ONE IT DOES NOT

The target is a lot at about 208 px, which wants **8.3 px a cell**.

**8 is not available.** The ZOOM LEVEL LAW says `HC` snaps to 11/22/44/88 *because
44 is his art's own tile size* -- a true 1:1 blit -- and 22 and 11 are honest 0.5x
and 0.25x of it. 8 would scale every tile he drew by 0.18, which the law forbids in
those words: *"zero fractional art scaling at any stop."* And 11/2 is 5.5, so
**there is no legal stop below 11.**

So the walked default is **11**:

    a lot draws        275 px   (target 208; this is the price of not scaling his art)
    the screen holds   34.4 cells = 25.8 m = about 1.4 lots
    CHARACTER's body trigger  FALSE -> TRUE, in the same frame

**THE COST, NAMED:** he used to have two stops of pull-back (22, 11) before the
seam. He is now standing on the last one, so a single pinch out crosses into the
map. That is a real change to how the seam feels and it is the direct consequence of
showing him a house.

## THE STRIDE, AND ONE NAME FOR THE NUMBER

    STEP_CELLS = BODY_SCALE.lotFine = 25      one lot per beat
    STEP_CELLS_QUARTER = 5                    part one, kept as the fallback

The stride **reads** CHARACTER's measurement instead of restating it. Both lanes
have already been bitten once by a second name for this number: CHARACTER wired
itself to a `BOHEMIA_STEP_FINE` this lane never published, and wrote that down in
its own comment rather than hiding it.

Nothing about the clock changed. Every cell crossed still pays its own `stepCost()`
into `advance()`, so the day, the distances, the jobs and the rent nights stay
exactly as true as they were. **Only the number of presses moved.**

## AND THE FIRST CUT OF THE STRIDE READ THE NUMBER BEFORE IT EXISTED

I wrote the read as an IIFE at the constant's own line, then checked the file
instead of assuming:

    STEP_CELLS is declared 726,000 characters ABOVE `const BODY_SCALE`

At that moment `BODY_SCALE` is in its temporal dead zone, `typeof` **throws**, the
catch swallows it, and `STEP_CELLS` silently stays 5. **It would have looked shipped
and changed nothing.** Same shape as the inert CSS rule and the guarded painter this
lane was caught by twice already. The value is now set on the line *after*
`BODY_SCALE` is declared, where the number is real.

## WHAT THE GLASS SHOWS

Photographed at the door, before and after:

    BEFORE   one person, a wall of brick down one side, a third of a lot
    AFTER    FIVE PEOPLE on the first screen -- two on the far pavement, a pair at
             his own door, one in the yard -- the road, its kerbs, the sidewalks,
             his house with the HOME marker, and a neighbour saying "Half light's
             worse than none. Makes you think it's coming back."

**He said "I did not see a single human being."** There are five in the first frame,
and they are big enough to read.

## WHAT IS STILL NOT DONE

- **The fight board.** He entered a fight and the scale was not there; that is
  COMBAT's side of rule 16 and it is not touched here.
- **The seam.** `[zoom meets]` asked that the street's farthest-out and the city's
  closest-in meet at the same size. Pulling the walk default to 11 moves one side of
  that seam, so the row now has a different arithmetic to check than it did.
