# A STRAIGHT LINE IS NOT A BODY
# LIFE + CITY, 9/16/26, VAMILY row [sealed block]
# THE-STREET-IS-THERE-AND-YOU-CANNOT-REACH-IT
# Law: STREET-AWARE / DRIVABLE ACCESS. Paolo 9/15: "street shit for no purpose."

---

## 1. THE ROW'S PREMISE IS FALSE. HIS BLOCK IS NOT SEALED.

RUN [spawn home] put the player on his own front step and reported, honestly and in
detail, that the block he wakes on does not connect to the street:

> "45 walkable doorsteps, ZERO straight walkable ways out in 140 tiles, and the
>  arterial sits TWO TILES past the end of the walkable ground in BOTH directions
>  that face it (E clear 52, changes at 54; S clear 2, changes at 4)."

**Every one of those numbers reproduces.** Walked straight from the doorstep, all
eight directions, 140 tiles each:

    [0,-1]  N   clear 123   no road
    [1,-1]  NE  clear   0   no road
    [1,0]   E   clear  52   no road
    [1,1]   SE  clear   2   no road
    [0,1]   S   clear   2   no road
    [-1,1]  SW  clear   2   no road
    [-1,0]  W   clear  73   no road
    [-1,-1] NW  clear  30   no road

Not one straight line from his door meets a road inside 140 tiles. The measurement
is sound and I am not disputing a number of it.

**The conclusion does not follow, because a player turns.**

## 2. TWO INDEPENDENT ORACLES, AND THEY AGREE WITH EACH OTHER AND NOT WITH THE ROW

**One: a flood over the game's own walkability**, `cellAt(x,y).walk`, across 512x512
fine cells (384 m square) centred on where he wakes.

    his walkable region            196,974 cells
    share of all walkable ground        92.9%
    the region's bounding box       512 x 512, the whole window
    road cells in the window            46,232
    road cells he can reach             46,232        <- every one of them
    road cells he cannot reach               0
    nearest road                       22 cells, about 16 metres

**Two: the game's own step.** Not a ruler laid across the map, not a flood: press the
pad, one press at a time, re-planning from wherever the world actually leaves him.

    6218,6268 -> 6216,6270   (21 to go)
    6216,6270 -> 6211,6270   (19 to go)
    6211,6270 -> 6206,6275   (14 to go)
    6206,6275 -> 6201,6280   ( 9 to go)
    6201,6280 -> 6196,6285   ( 4 to go)   ON A ROAD

**FIVE PRESSES OF THE PAD FROM HIS DOORSTEP AND HE IS STANDING ON A ROAD.**

A straight line is not a body. The block is open.

## 3. AND THE SECOND ORACLE CORRECTED ITSELF FIRST, WHICH IS WHY I TRUST IT

My first version of the walk followed a **fixed path**: plan once, then press the
directions in order. It reported REFUSED after one press. It was wrong, and the
reason matters: **the world moves him between calls.** One press took him from
6218,6268 to 6216,6270 — two cells, not one — so the second step of my plan was
aimed at a cell he was no longer beside, and the instrument called a working walk
broken.

A fixed path is a guess about a world that is still running. The gate re-plans every
press for exactly this reason, and says so in its own page.

## 4. WHAT THE PICTURE SHOWS, WHICH IS NOT WHAT THE ROW SAYS

Photographed at the door, phone size. Ground within 40 cells of him, 6,561 samples:

    house yard            3,481   53%
    dead dirt, no pool    1,089   17%
    roadway                 612    9%
    sidewalk                274    4%
    decorative gravel       224    3%
    the rest                 --

**The street is not sealed off. It is off screen.** At walk zoom the visible box is
about 21 cells wide, and the nearest road is 21 cells west and 17 south — just past
the edge. He wakes looking at his own yard, a kerb band, and the side of a building.

That is a real version of his sentence, and it is not the version the row was written
around. It is also not a wall to knock down: it is where the door faces and how far
the camera sees, which is RUN's doorstep rule and the zoom, not a missing street.

## 5. WHAT SHIPPED

`gates/the_street_is_reachable_gate.js`, in the suite as THE STREET IS REACHABLE FROM
THE DOOR. 7 pass / 0 fail. It prints RUN's straight-line table every run, so the two
readings sit beside each other and nobody has to take my word for either.

It holds the property the row actually cares about — **can he get to the street from
where he wakes** — with the instrument that answers it, and it goes red the day a
change really does seal his block. It would not have gone red on the tree that
produced the claim, because the claim was never true.

**AND IT PROVES IT CAN SAY NO.** Legs C run the same walk-out finder against a world
sealed on purpose (a ten-cell box with a road outside it) and require the answer NO
ROAD REACHABLE, then against an open one and require YES at the right distance. An
instrument that cannot return "no" is not an instrument, and this lane has shipped
one before. Mutation (no road anywhere in the world) reds A1, A2 and A3.

## 6. THE TWO GATES THE ROW ASKED ME TO RE-RUN

**NO CELL GOES UNTEXTURED: 769 of 903.** The 134 cells that do not draw approved bank
art are 112 of dead dirt `#8a7a5e` and 22 of decorative gravel `#9b968a`.

The gravel is a **documented exception, not a hole**: the code that introduced it says
so in its own comment — "its palette colour is already in texKindFor's rock family, so
it picks up the ROCK grain with no new art and no new pool: gravel drawn as gravel."
It has a texture; it is not from the bank.

The dead dirt is the suburb's `dead` default, and the comment beside the sidewalk fix
already calls falling through to it the bug it was fixing. 112 cells of it are on the
screen he wakes to. **Which approved pool it should take is a look decision, so it is
named here with the number and not picked by this lane**, for the second round
running. It is one line in the colour table the day somebody rules on it.

**A CROWD TO WALK INTO: 9 of 16.** It was 13 of 16 before the spawn moved. **The floor
is intact — 16 of 16 walks still meet somebody** — and only the "seven at once" leg
moved, because his new block is quieter than the arterial he used to wake on. EYES E26
round 6 measured the population directly and found it fine ("bodies painted on 135 of
135 samples, up to 20 at once... NOTHING NEEDS ADDING TO THE POPULATION"), with the
real cause being that the crowd arrives while the game is frozen. That is routed to
PEOPLE and PLUMBER and it is not a hole in this lane's population work.

## 7. FOR RUN, WITH THE NUMBERS

Your THE FIRST MINUTE gate is red with the note "there is no way out to aim at, the
fallback runs, the gate stays red". **There is a way out: 21 cells, five presses,
photographed and gated.** The gate is aiming with a straight-line instrument at a
world where the way out has two turns in it.

Nothing about your doorstep choice was wrong — "the side nearest a road out to 24
tiles" found the side nearest the road, and the road is 22 away. What is worth
looking at is that 22 cells is just past the edge of what the camera shows at walk
zoom, so the street he is facing toward is not in his first picture.

## 8. THE LESSON, WHICH IS THE THIRD TIME THIS LANE HAS WRITTEN ONE LIKE IT

- 9/13: *a premise handed down is still a premise.*
- 9/15: *two lanes agreeing is not corroboration when they asked the same question.*
- today: **an instrument that only walks straight will report a world that only has
  turns as a world with no way out.** The measurement was right, every number of it,
  and the word on the end of it was wrong.
