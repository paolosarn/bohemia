# THE WHEEL THAT STOPPED
COOK lane, [fortress buildings] round 6 / [seven landmarks], 9/24/26. Session cook-mce6r5.

## WHY THIS ONE, THIS ROUND
THE FIGHT VERDICT round 7 is rule 13's honest sentence: the fight picture could not be judged
on the glass, the standing chrome list is unchanged, and all of it is UI [fight hud]. Nothing
on it is COOK's. Rule 22 says a making lane cooks anyway, so this round goes to this lane's
own row, the same one rounds 3, 4 and 5 went to.

[seven landmarks] measured the "~20 undrawn districts" as eight names, seven of them singular
Las Vegas landmarks the overmap places and nothing can build. Round 3 drew the Welcome sign,
round 4 the Stratosphere, round 5 the Sphere. FOUR LEFT. This is the HIGH ROLLER, next in
tier order because the map puts it at 55,46, one cell south of the Sphere at 56,42, on the
same walk.

## THE MEASUREMENT IS THE DESIGN: IT DOES NOT FIT
MAP LAW first, off a generated map, before a line was drawn. `highroller` gets ONE cell,
96 x 96 m, and its ring reads:

    arterial    arterial    arterial
    resort      HIGHROLLER  commercial
    resort      suburb      suburb

Arterial the whole north edge, so the plot fronts north and the drivable-access law is served
off the road it already has.

AND THE RIM IS 143 METRES. One tile is 0.75 m, so the wheel is 191 tiles across a 128 tile
plot: **33% of it is off its own ground, running past both edges.** The Sphere got four cells
because 157 m fits inside 192. This one got one cell and fits inside nothing. So the honest
plan is not a shrunken wheel. It is THE FEET OF SOMETHING TOO BIG FOR ITS OWN PLOT, which is
also what the real site is.

## THE SECOND MEASUREMENT IS THE DRAWING
From straight above, a vertical wheel is not a circle. It is a LINE: every point of the rim
projects onto one east-west line through the hub, so a 143 m ring collapses to a stripe about
five tiles thick.

AND THE RIM NEVER TOUCHES THE GROUND. Top 167.6 m, rim 143 m across, so the hub sits at
96.1 m and the bottom of the rim hangs 24.6 m in the air between the legs. Everything this
object rests on is four legs, one brace and a boarding hall: 12.5% of the plot.

## THE GUARD THAT MEASURED THE WHEEL INSTEAD OF THE PICTURE
Twenty-eight cabins evenly spaced around a rim are NOT evenly spaced once projected: their
spacing is the cosine of the angle, so they crowd at the two ends. Measured across the whole
wheel that is 2.4 tiles apart at the ends against 21.1 across the middle, **8.9x**, and I
wrote a guard that refuses if it drops below 3x. It passed.

*** THEN I LOOKED AT THE RENDER AND THE CABINS ON IT ARE EVENLY SPACED. *** The crowded ones
are exactly the ones that fell off the plot. Only 7 of the 28 land inside the cell, all of
them near the top of the arc, and their spacing is 1.17x, which is flat. The guard was
measuring the object; the card shows the ground. Fourteenth time in this lane that a clean
number measured the wrong surface, and the picture is what caught it.

The fix is not a louder number, it is the honest one, and it is a better fact:
**THE CABINS YOU CAN STAND UNDER ARE THE SPREAD-OUT ONES. The bunched ends are out over the
resort and the commercial block.** Both numbers are now printed, and there is a second guard
that refuses if the ones inside the cell ever start to crowd, because that would mean
something moved the wheel or the plot.

A SECOND VERSION OF THE SAME CLASS OF ERROR, caught by this tool's own refusal rather than by
me: the first banding put the rim's three tones across its real 96 to 167 m range, and codes 6
and 7 were never drawn. The reason is worth keeping. The rim only falls from 167.6 m to about
149 m before it leaves the plot, so EVERY PART OF THIS WHEEL YOU CAN SEE FROM ITS OWN GROUND
IS NEAR THE TOP OF THE ARC. It does not reach the axle's height until it is over the next
block. The bands are set on what is visible and the legend says so.

## THE SHADOW IS THE REST OF THE SHAPE
A ring's shadow is a ring. This one is a vertical ring, so its shadow is a long shallow loop
lying across the ground south-east of the feet with twenty-eight beads on it. The sun is not
invented here: the Sphere's own numbers say a 112 m ball throws its shadow 34 m east and 26 m
south, so a point h metres up lands 0.304h east and 0.232h south. One sun, north-west, the
corner roof_hipTL is lit from, and round 3's words: "THE SHADOW GOES EAST."

## WHAT THE PLOT IS MADE OF (16,384 tiles, one cell)
    apron 46.20   hardpan 14.94   a leg 7.17   the boarding platform 5.20
    arterial shoulder 5.00   the shadow of a cabin 3.96   the shadow of the wheel 3.77
    the rim at the top 2.88   rock lag 2.24   kerb 2.18   bay stripe 1.97   a cabin 1.79
    the rim coming over 1.31   the hub 0.91   the rim leaving the plot 0.35   brace leg 0.15
Open desert 17.18% of the plot, 87% of it one dominant ground (the desert dominance law wants
85; the tool refuses under 80).

## REFERENCE CHECK
BLDG-05 the structural sanity list is the one that changed the drawing: Arup's four inclined
legs 2.8 m in diameter plus ONE transverse brace founded ACROSS THE ROAD, a rim held in
compression by 112 locked-coil cable spokes like a bicycle wheel, and 28 spherical cabins on
the outside of the rim. Four feet and a brace are the entire ground contact, so four feet and
a brace are the entire ground plan, and the brace crossing the boulevard is the strangest true
fact about the object and the reason the plot fronts north.
Also AH-01 (R1 the ordinary frame one wrong thing, R3 the long hold, R4 one sun), DIST-02 and
CB-07 (sign + shed + parking, and the sign is taller: here the sign is 167 m and the shed is a
boarding hall), DIST-03 (the real site, hemmed in on every side), TG-05 (a lot is striped
asphalt), and the desert dominance law.
Sources for the real numbers: the Arup/ENR/AEC engineering write-ups of the Las Vegas High
Roller, 2013-2014.

REUSE CHECK: this draws no pixels of its own. It is a PLAN of legend codes in the game's own
planner, the same socket the sign, the Stratosphere and the Sphere use, and the art is the
palette.

## ONE THING FIXED FOR NEXT TIME
Round 5's Sphere card was assembled by hand outside its tool, so it could not be rebuilt and
could silently disagree with the bank it illustrates. There is now ONE card renderer for every
landmark this lane cooks, driven by the same grid the bank carries, and it measures its own
page off its own text rather than guessing a width (the first render ran the closing sentence
straight off the right edge).

## ANALOG HORROR LINE (rule 20 section 9)
The horror is the scale and the stillness. A wheel the size of a district, stopped, with
twenty-eight glass balls hanging off it and nobody in any of them, and the only way to see
what shape it is is to look at the shadow lying on the yard.
NOT DRAWN, AND NAMED RATHER THAN QUIETLY TAKEN: bible R9 THE MACHINES KEEP TALKING. Whether
the wheel still turns on a schedule to an empty valley is BEHAVIOUR and belongs to WORLD.

## WHERE HE SEES IT
The VOTE tab, cook-the-wheel-that-stopped-9-24.
Picture slices/vote/COOK_THE_WHEEL_THAT_STOPPED.png.
NOTHING WENT TO THE ALPHA OR THE DEMO (rule 18): the landmark engine is the walked world, so
this is a bank and a candidate, and it drops in with one paste when the hold lifts.
UNDRAWN LANDMARKS 4 -> 3. Left: luxor, springs, robofactory.

Bank: banks/BOHEMIA_THE_HIGH_ROLLER_9_24_26.txt
Tools: tools/bohemia_the_wheel_that_stopped_cook_9_24_26.js, tools/bohemia_landmark_card.py
