# [bb map art] SCHOOL, ROUND TWO: THE VALLEY READS AS LAND
COOK lane, 9/27/26, session cook-mce6r5. Rule 33(f): one page a round. Rule 33(g): it ends
with what MOVES here that their picture does not.

Round one of this row did the MARKERS. The row's own words are "BB's map TILES, place icons
and the party marker", so this is the tiles, and it is the bigger half by a long way.

## THE MEASUREMENT IS THE WHOLE ROUND
Below FAR_ZOOM the MAP tab fills each cell with ONE FLAT COLOUR from a per-district table.
The valley is 96 cells across, so on a phone a cell is about four pixels. Rendered and looked
at, that paints **a grid of grey squares with black lines through it**:

    ROADS ARE 38.1% OF EVERY CELL IN THE VALLEY   3,515 of 9,216, ALL ONE NEAR-BLACK TONE
      arterial 2,423 (26.3%)   freeway 995 (10.8%)   plus beltway, strip, interchange
    EVERYTHING BUILT IS ONE GREY                  suburb 2,610 (28.3%), commercial 370 (4.0%),
      apartment, resort, strip: all resolve to the same FABRIC tone
    THE MOUNTAINS ARE 9.7% AND YOU CANNOT SEE THEM   flat fill, spread 0.0 of 255, no light
    THE DESERT IS 5.9% AND IT BARELY SHOWS

So on the surface you are meant to travel across, you cannot tell city from desert from
mountain, and the one thing you CAN see is the street grid. That is the exact inversion of how
a travel map works, and it is what rule 33 walked into.

## THE LIBRARY, READ FIRST (rule 33j)
reference/library/battle_brothers/01_WORLDMAP.md is this department's volume and it lands the
round's real argument better than my own framing did:

  "Speed by terrain: roads fastest, plains, then forest and hills slower, swamp slowest, snow
   slow; MOUNTAINS IMPASSABLE."

**So the land reading first is not taste, it is the mechanic.** What kind of ground a cell is
IS how fast you cross it, which means a map where you cannot tell ground apart is a map you
cannot plan a route on. And it backs the ring: mountains are the one thing you cannot go
through at all, so they have to read as a wall rather than as a dark patch. Our valley failed
both: every cell was one flat colour and the mountains had a value spread of 0.0.

## WHAT BATTLE BROTHERS DOES WELL HERE
**THE HIERARCHY IS LAND, THEN ROUTES, THEN PLACES.** Their map is painted terrain: the land
reads first and tells you where you are, the roads are thin and pale on top of it, and the
settlements are objects above both. Ours was ROUTES, then nothing, then nothing.

**A ROUTE IS TRACED, NOT FALLEN INTO** (BBM-03). The only long thin bright things on that map
are the roads, because a route is what a player follows with their eye. Ours had 38% of the
valley as one black grid, which means every line was a route and therefore none of them was.

**THE RING IS HOW YOU PLACE YOURSELF** (DIST-03). The real Las Vegas valley is a grid of pale
streets on tan ground inside a ring of dark mountains. The mountains are the thing you orient
by, and ours were invisible.

## THE SHAPE FOR US, THREE CHANGES AND NOT A REPAINT
1. **THE LAND GETS ITS OWN VALUE RANGE.** Mountains darkest, city quiet in the middle, open
   ground brightest and warmest. The city stays quiet on purpose: it is the thing you are
   inside, not the thing you navigate by, and round one's markers have to sit on top of it.
       mountain against city:  27 of 255 before, **41 after**
       city against open ground: 41 before, **57 after**
2. **THE ARTERIAL GRID BECOMES THE CITY'S GRAIN.** One step off the fabric. At 26% of the
   valley it cannot be the subject.
       the grid shouted **49 of 255** above the ground it crosses. Now it shouts **14**.
3. **THE MOUNTAINS GET FORM.** A ridge is lit on its north-west face and dark on its
   south-east, taken from its own distance to the nearest thing that is not mountain. Same
   sun as every other pixel in this game.
       spread **0.0 of 255 before, 6.1 after**, and the lit faces measure as the north-west ones.

Every tone is a step of one of six six-step family ramps: **15 colours in the whole valley,
against 27 before**, and the tool refuses any tone off a ramp.

## *** THE GUARD I WROTE MEASURED THE GRID I FIXED AND NOT THE ONE I MADE ***
The first cut dropped the arterial's shout from 49 to 14 and passed every check, and the
picture came back with a **bright white lattice owning it exactly as the black one had**. I
had put the freeway at the top of the whole map's value range. It is 995 cells, 10.8% of the
valley; at maximum brightness that is not a route, it is a glare.

A freeway reads as a line because it is CONTINUOUS and made of a different material, not
because it is the brightest thing in the frame. So it is CONCRETE: grey where the desert is
warm, a little darker than open ground, plainly not the city. Shout **47 before, 34 now**, and
there is a guard on it in both directions, because under 8 it stops being a line at all.

Fifteenth time in this lane that a clean number measured the wrong surface, and the first time
the wrong surface was one I had just created.

## WHAT MOVES (rule 33g)
**THE DUST.** The dune banding runs north-east to south-west, the way the wind runs here, and
one band of it steps one cell a beat. Measured: **226 to 238 cells change a beat out of 582
cells of open ground**, so it is a drift you can see and not a claim. Nothing else on the land
moves, and that is the point: the land is still, the dust crosses it, and the markers on it
are the things that are alive.

THE HORROR LINE: the streets are all still there. From up here the grid is perfect and there
is nothing moving on it but the wind.

## ROUTED
To whoever owns the MAP tab: this replaces that file's `toneOf` and nothing else. Where things
are PLACED is not the art's business. Rule 18: it drops in the round the hold allows.

## WHERE HE SEES IT
The VOTE tab, cook-the-valley-reads-as-land-9-27, the whole valley before and after at the
zoom he travels across it at, plus four beats of the dust.

Library cited (rule 33j): reference/library/battle_brothers/01_WORLDMAP.md
Bank: banks/BOHEMIA_THE_VALLEY_TONES_9_27_26.txt
Tool: tools/bohemia_the_valley_reads_as_land_cook_9_27_26.py
