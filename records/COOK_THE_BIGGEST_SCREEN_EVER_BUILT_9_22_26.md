# COOK — THE BIGGEST SCREEN EVER BUILT, SHOWING NOTHING
## Round VI, 9/22/26. [fortress buildings] round 5 / [seven landmarks].
## COOKED AND REGISTERED IN VOTE: `cook-the-biggest-screen-ever-built-9-22`. Nothing went to the alpha or the demo.

---

## WHY THIS ROUND WENT HERE

THE FIGHT VERDICT round 5: **the two biggest lies are paid.** The fighter is himself again
(198 px on the fight glass against 181–187 on the street, against round 2's 37-vs-112) and
**the light carries** — the cold blue is gone and the fight floor is the warm approved bank
at the walk's own hour, which is this lane's round-1 floor landing on the glass. Everything
still lying is chrome, and the verdict says so: *"ALL OF IT IS UI [fight hud]; COMBAT and
COOK owe the picture nothing this round."*

So the round went to this lane's own row again, the same one round 4 went to.

---

## THE ONE THING MADE

**The Sphere**, four cells of the map, 192 × 192 m, 65,536 valley tiles, sixteen legend
codes, rendered through the game's own planner.

    bank:     banks/BOHEMIA_THE_SPHERE_9_22_26.txt
    picture:  slices/vote/COOK_THE_BIGGEST_SCREEN_EVER_BUILT.png
    tool:     tools/bohemia_the_biggest_screen_ever_built_cook_9_22_26.js

    THE BALL 53.1% of the plot   the shadow 10.1%   apron 8.7%   service ring 7.0%
    hardpan 10.8%   arterial 4.7%   loading yard 3.4%   open desert 95% one dominant ground
    the dead grid: 4.0% of the ball

**Landmarks the map names and nothing could build: six → five.** Left: highroller, luxor,
springs, robofactory, and the sign and the Stratosphere are done.

---

## WHY THE SPHERE AND NOT ONE OF THE OTHER FIVE

It is **the only one the map gives four cells**. Measured before choosing:

    sphere      4 cells   192 x 192 m
    luxor       1 cell     96 x 96 m
    highroller  1 cell     96 x 96 m
    springs     1 cell     96 x 96 m
    robofactory 1 cell     96 x 96 m

The real Sphere is **157 m wide and 112 m tall**. In a 192 m plot that is **82% of the
width** — the one landmark whose real size actually fits what the map reserved for it. That
fit is the reason it earned four cells, and the reason it is drawn at four rather than
squeezed into one.

## MAP LAW: THE PLOT WAS READ, NOT CHOSEN

    arterial    arterial    arterial    arterial
    apartment   SPHERE      SPHERE      suburb
    apartment   SPHERE      SPHERE      suburb
    commercial  park        suburb      desert

Arterial the whole north edge, apartments west, suburb east, commercial and park south. The
plot fronts north and the drivable-access law is served off the arterial it already has. The
tool refuses to run if that arterial ever moves, and refuses if the map stops giving the
plot four cells.

---

## THE DRAWING PROBLEM: A BALL AND A DISC ARE THE SAME CIRCLE

From directly above, a sphere has the same silhouette as a disc, a tank or a roundabout.
**The only thing that says BALL is how the light falls off it.** So it is drawn as
concentric value bands off an **off-centre cap**, not as a flat circle with an outline.

**Which way the sun is was measured, not chosen.** The approved roof set names `roof_hipTL`
as the corner where *"the slope cuts in"* and `roof_hipTR` as *"the shaded side"*, so the sun
is in the **north-west** — and round 3's sign cook says the same thing from the other end:
*"THE SHADOW GOES EAST, because every other tile in this game is lit from the same corner."*
So the cap sits north-west of centre, the surface darkens through the family's values to a
dark rim, and the ground shadow falls south-east.

## THE GRID WAS A CAGE, AND THE PICTURE CAUGHT IT

The Exosphere is about 1.2 million LED pucks roughly half a metre apart, which at 0.75 m per
tile is about one per tile. The first cut drew that as **continuous lines every six tiles in
a near-black tone**. It took 16% of the plot and read as chicken wire thrown over a ball:
**the grid shouted and the ball whispered**, which is backwards.

A puck is a **point**, not a line, and from 192 m away a million of them read as **texture**.
So: dots on a five-tile lattice, offset every other row the way a real panel lattice is laid,
in a tone one step off the surface they sit on. **4.0% of the ball** instead of 16%, and the
tool now refuses above 12% so the cage cannot come back.

## AND THE FIRST LAYOUT PUT THINGS WHERE THE BALL ALREADY WAS

The tool's own guard refused the first run with *"legend entries nothing draws: 13"* — the
plant room. A 157 m ball with a 9 m service ring round it in a 192 m plot leaves **almost
nothing but the four corners**: the ring's outer edge reaches within eleven tiles of the
north arterial. A rank of bays across the middle of the apron was simply painted over, and
the plant room vanished entirely. The bays moved to the corners and the yard and plant room
to the two south corners. That is not a compromise — **it is what a plot this full actually
is.**

---

## THE ANALOG HORROR BIBLE (rule 20, reference AH-01)

- **R1 THE ORDINARY FRAME, ONE WRONG THING.** A car park, a service road, a loading yard,
  apartments next door — and the largest screen ever built, dark. The wrong thing in one
  sentence: *a million lamps and not one of them lit.*
- **R4 THE LIGHT WAS IN THE ROOM.** The fixture is the sun, the cap is where it lands, the
  rim is where the surface turns away from it, and the shadow agrees with every other tile
  in the game. Nothing here glows.
- **R9 THE MACHINES KEEP TALKING is the hook this object exists for, and it is NOT drawn
  here.** A surface that still plays something on a schedule to an empty valley is
  *behaviour*, and this is a tile plan. Named in the bank's notes for whoever owns the
  world's scheduled emissions rather than quietly taken.

## THE REFERENCE CHECK (standing duty, 9/4 law)

- **DIST-02 / CB-07 (Learning From Las Vegas, both halves)** — a Strip plot is SIGN + SHED +
  PARKING IN FRONT and the sign is taller than the building. The Sphere **collapses all
  three into one object**: it is the sign, the shed and the screen at once, which is that
  reference's own end point. Taken: the plan reads as one object with everything else
  subordinate, and that is why the apron is tight and the furniture is in the corners.
- **BLDG-04 (the Strip's three races — pool, sign, porte-cochere)** — this plot has neither
  pool nor porte-cochere in the cells the map gave it, and it does have the service ring
  every venue of this size needs. So that is what is drawn, and the absent two are named
  rather than invented.
- **DIST-03 (Las Vegas aerial)** — the real site's shape: the ball, a tight apron, a service
  ring, a loading yard on the far side from the boulevard.
- **TG-05 (the commercial lot tile)** — a lot is striped asphalt, so the bays are marked.
- **The desert dominance law (Paolo 7/14)** — 95% one dominant ground, and the tool refuses
  under 80%.
- **The real subject:** the Sphere, Las Vegas, 2023. 112 m tall, 157 m wide, the largest
  spherical structure in the world, about 54,000 m² of exterior LED.

## WHAT THIS DOES NOT DO

- **It does not touch the game.** `engine/bohemia_landmarks.js` is the walked world and rule
  18 keeps code off the play surface, so this is a bank and a VOTE candidate. It drops into
  the engine in one paste when the hold lifts.
- It does not draw R9's scheduled emission. Named, not taken.

## THE GUARDS IN THE TOOL

It refuses if the map stops giving the plot four cells, if the north arterial moves, if any
code has no legend entry, if any legend entry is drawn by nothing, if the open desert falls
under 80% one dominant ground, or if the dead grid climbs back over 12% of the ball.

## HOW TO RE-RUN IT

    node tools/bohemia_the_biggest_screen_ever_built_cook_9_22_26.js
