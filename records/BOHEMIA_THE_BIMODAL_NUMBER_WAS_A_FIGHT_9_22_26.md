# THE THIRTEEN DEAD PRESSES WERE A FIGHT STARTING, AND MY INSTRUMENT CALLED IT A BROKEN PAD

PLUMBER lane, VAMILY row [bimodal dead], 9/22/26. First line of this lane.

## WHAT WAS OPEN

My own ratchet, two rounds ago, measured dead presses seven times on ONE UNCHANGED TREE
and got 0, 1, 1, 1, 13, 14, 0. Bimodal, not noisy. I could not find the cause, so I left
the number measured, printed, and deciding nothing, and said so. That was the right call
at the time and a debt either way: the ratchet was holding the easy numbers only.

## THE HUNT, IN ORDER, AND TWO WRONG GUESSES ALONG THE WAY

**The clue nobody chased:** in a bad run, cells covered was the SAME (53-54) but far
fewer presses moved him. So each move was bigger. That smells like a mode.

**Guess one: a mode. Wrong.** One boot, 56 presses, reading the status line every press.
The mode never changed: "HUMAN MODE SUBURB ON FOOT" from the first press to the last. But
the run showed something the seven-run summary had hidden completely: he moved for the
first eleven presses and then **stopped moving for the remaining forty-five.** Not
bimodal per run. A progressive stop.

**Guess two: something covering the pad. Wrong, but it found the signature.** Asking the
CITY FRAME what was on top of the pad returned "nothing" from press 9 onward, and no
overlay was listed. Then the geometry: at press 9 the pad button's box collapsed to
**0 by 0 at the origin** while its own computed display stayed "inline". That is the
signature of an ancestor that is hidden, so I walked the chain.

**And then a run where the geometry was perfect the whole time and nothing moved from
press 0.** Two different shapes meant I was still looking at the wrong thing.

## *** THE ANSWER, MEASURED IN BOTH DOCUMENTS, FRESH GEOMETRY EVERY PRESS ***

    press 8   moved 8    frame 390x844   btn 333,760 30x20   parentTop: cityFrame
    press 9   moved 0    frame   0x0     btn   0,0    0x0    parentTop: combatFrame

**A FIGHT STARTED.**

The city frame collapses to nothing because the game switched to the combat frame. The
pad has no box because the city is hidden. The player's cell stops changing because HE IS
IN A FIGHT AND NOT WALKING.

So the bimodal number was the walk MEETING AN ENCOUNTER. No fight inside 24 presses reads
0 or 1 dead; a fight around press 10 reads 13 or 14. Cells covered is the same either way
because he walks the same distance before it finds him.

**MY INSTRUMENT WAS COUNTING "THE GAME GAVE HIM A FIGHT" AS "THE PAD IS BROKEN."** A
ratchet built on that would have refused pushes for the game doing the exact thing rule
17(b) asks of it: the walk ends in the fight.

## WHAT THAT FIXED, AND IT CLOSED A SECOND ROW FOR FREE

1. **The walk now stops when the fight starts.** Dead presses count only presses made
   while the city was actually up. Measured after: 24 of 24 presses moved him where he
   aimed, zero dead, zero wall, zero wrong, three of three in every one of the eight
   directions. The number holds still, so IT IS SCORED AGAIN.

2. **THE FIGHT IS IN THE VERDICT NOW.** Last round this drove `cityEncounterIn` and
   reported NOT REACHED, because that function is not exposed to the driver on this cut,
   and I left it out of the score. IT NEVER NEEDED A DOOR. The walk meets a fight on its
   own, around press 9 of 24. Rule 17(b) wanted the ratchet to include that frame, and it
   does now, off the real encounter the world produced. A met fight and a forced fight are
   not the same claim, and this is the honest one. A combat frame that comes up and never
   draws a canvas is still reported as not reached, because saying "reached" off a blank
   frame would be this instrument's oldest mistake in a new place.

## TWO MORE NUMBERS THAT COULD NOT HOLD A BAR, AND WHAT I DID

**Freezes.** Five walks of one tree froze for 517, 633, 1167, 550 and 1800 ms -- a 3.5x
range, and a bar taken from three of them refused the fourth. The same five as a COUNT
read 1, 1, 2, 1, 2: a range of one. The count is what a player notices ("it stuck twice")
and it is the one that holds still, so THE COUNT DECIDES and the milliseconds ride along
on the report where the severity is visible.

**Time to tappable.** Across this session on one unchanged tree: 424, 431, 448, 457, 567,
675, 771, 832 ms. A 1.96x spread, and THE CPU YARDSTICK DOES NOT SEE IT -- it read 1.00x
when the bar was taken and 1.01x when the same tree read 832. Page-load time is dominated
by disk and memory, not CPU, so no ratio this repo measures can correct it.

I did NOT widen the tolerance to cover that. Widening to 2.2x would have let a real
regression to 900 ms through. **A REALISTIC BAR WITH A TIGHT TOLERANCE BEATS AN OPTIMISTIC
BAR WITH A LOOSE ONE**, so accepting now takes FIVE walks instead of three and pins the
worst of them, and the tolerance stays where it was.

And the accept guard was narrowed to match: it refuses to accept a cut whose COUNTS went
the wrong way, and merely notes a wall clock that did, because refusing there would make
the bar impossible to re-take on a slow afternoon, which is its own way of turning the
ratchet off.

## WHAT THIS COSTS TO BELIEVE

Everything above is measured on this container. The fight's timing is the world's choice,
so a walk that meets no fight in 24 presses is not evidence that fights are rare -- it is
one short walk. The tool says that in those words rather than reporting a zero.
