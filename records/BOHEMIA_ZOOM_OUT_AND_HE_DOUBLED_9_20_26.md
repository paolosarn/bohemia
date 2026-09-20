# ZOOM OUT AND HE DOUBLED (RUN, 9/20/26)

VAMILY `[one camera]` / ONE-WALKING-CAMERA-ONE-BODY-SIZE-ONE-STRIDE-THAT-NEVER-MISSES.
Rule 18a, THE PLAYABLE CUT.

> **PAOLO 9/20, LOCKED:** *"I'm zooming out and my person becomes bigger... walking
> the same distance and crashing into walls because it's forcing me to move like 67
> tiles at a time, so when I'm trying to walk past the wall it's not allowing me to
> because I'm just missing it."*
> And, the same breath: *"we were closer to being able to play before, right now
> we're farther than we've ever been."*

## BOTH HALVES ARE MINE

Not a mystery and not somebody else's lane. The camera half is `b40ecc67` and the
stride half is `a36b4222`, both this lane, both four rounds ago, both shipped green.
He is describing exactly what I built.

## FIRST HALF: THE BODY'S SIZE WAS A FOUR-RUNG STAIRCASE

A body is sized by whether a lot fits on the glass. A lot is 25 cells, a phone is
378 px, so `25 * C <= 340` is TRUE only at the widest stop. Asked at all four stops
of the zoom ladder, the body answered:

    HC 88  ->  224 px        HC 44  ->  112 px
    HC 22  ->   56 px        HC 11  ->  112 px      <-- ZOOM OUT, GET BIGGER

Two notches in a row HALVED him and the last one DOUBLED him back. On a real pinch,
measured on the served demo: **stop 11 to stop 88, body 112 px to 224 px.** That is
his sentence, in numbers, off the live page.

And it was worse than a pinch. `HC` is animated by the mode transition, sweeping
48 down to 11 on the way in, so **the body changed rung three times while he was
dropping into the street** and nobody had ever looked.

**THE FIX IS THAT THE WALK HAS ONE CAMERA.** The four stops were never four play
stops: at 22 and 44 a house does not fit on a phone, which is the whole of rule 16,
and 88 is closer still. So the walk keeps the one stop where a house fits, pinching
out from it crosses to the city exactly as the 8/2 seam already ruled, and pinching
in holds because there is nowhere nearer to stand. The body is then sized off THE
STOP, never off the camera mid-flight, so it cannot change while he walks, pinches,
or drops in.

`HLEVELS` is **not** deleted and must not be: it is the ART ladder his tiles are
baked against (44 is his own tile size, 22 and 11 honest halves). The ladder his
FINGERS move on is a different question, and conflating the two is what shipped the
resize in the first place.

## SECOND HALF: A TWENTY-FIVE CELL STRIDE WITH ITS EYES SHUT

One step is one lot is his ruling and it stays. What shipped with it was a stride
that walked its whole length without looking sideways. **A gap in a fence is two or
three cells. A lot is twenty-five.** So the stride crosses the only way through and
lands past it, every time, and from there the gap is behind him. He presses again
and misses it again.

**PHOTOGRAPHED, off the game's own walk flags, at the cell the first walk of this
round jammed on -- 6270,6268, nineteen dead presses in a row, every one east:**

    . . . . . . . # . . . . . . . .
    . . . . . . @ # . . . . . . . .        @ him   # wall   . standable
    . . . . . . . # . . . . . . . .
    # # # # # # # # . . . . . . . .
    . . . . . . . . . . . . . . . .

A wall **one cell thick**, the whole world open one cell behind it, and no way
round it from inside that pocket. East, north-east and south-east all refuse.

### THE TWO RULES

1. **NEVER PAST A GAP.** While the stride runs, watch the two cells either side of
   him. The moment a side that was closed one cell ago is open, the stride ends
   THERE, standing in the mouth of the opening, and one press turns him into it.
   In open ground both sides are already open, so nothing new opens and the stride
   runs its full length. **It costs nothing where there is nothing to miss.**
2. **A PRESS TOWARD A WALL SLIDES ALONG IT.** A diagonal keeps the component that
   is open. A straight press slips the corner if there is a corner, and otherwise
   **looks along the wall face for its end, out to one lot, both ways, and goes the
   nearer way.** Paired with rule 1 the stride then stops exactly at the end of the
   wall and the next press goes through. One slide per press, never a chain, so he
   can never be carried somewhere he did not aim. A body holding a cell against him
   is a ruling the street made and is never slid around.

**THE LOT IS THE CEILING OF A STRIDE. THE GROUND SETS ITS LENGTH.** Measured on the
walk: 15.2 cells a press against a 25 cell ceiling.

## THE NUMBERS, BEFORE AND AFTER, SAME CIRCUIT OF HIS OWN BLOCK

Served demo, phone profile, real taps on the real eight-wedge pad, position read
off the game's own state. `d71e8dde` against this tree.

                              BEFORE      AFTER
    body across the 4 stops   112/56/     ONE SIZE
                              112/224
    body across the drop-in   3 rungs     ONE SIZE
    a real pinch              stop 11     cannot find a second stop
                              -> 88,
                              body 224
    STUCK PRESSES             12 of 40    *** 0 of 45 ***
    GAPS WALKED PAST          14          *** 0 ***
    cells crossed             410         685
    stride length             14.6        15.2   (ceiling 25)

## THE GATE, AND WHY IT CAN TELL A WALL FROM A BUG

`gates/the_walk_never_misses_gate.js`, in the suite as **WALK NEVER MISSES**,
**19 passed, 0 failed**. Every press is a real touch on the pad's own `<g>` at its
own measured centre; nothing calls `stepOnce` directly.

The first cut of this gate reported 19 stuck presses and it was **wrong**, in the
lane's own favourite way: it was hammering one wall. The cell above is a sealed back
yard, and a game that refuses to walk into a building is a game working. Calling
that a stride bug would have sent me chasing a fix for a wall.

**SO A REFUSED PRESS IS JUDGED BY AN INDEPENDENT ORACLE**: a flood fill, one lot
out, over the game's own walkability, asking *is there any cell I can reach from
here that is further the way I pressed?* If there is not, he is sealed and it is
reported separately and never counted against the stride. The stride's slide scans
wall FACES; the oracle FLOODS. They cannot agree by construction, which is the
point of having one.

**MUTATION: the pre-fix tree IS the mutant**, and it scores **9 passed / 10 failed**
including both starred lines.

## WHAT THIS FOUND AND DID NOT FIX, NAMED

**Five presses on his own block go into ground a body cannot reach** -- 6270,6268
and 6270,6270 among them. That is the same shape as the finding this lane already
carries (his block has 45 doorsteps and 0 straight walkable ways out): the suburb
generator seals yards. It is not the stride and it is not the camera, and the fix
belongs to whoever owns the ground, so it goes in the handoff and not into a number
this round is allowed to claim.

**AND THE COST OF ONE CAMERA, NAMED:** he can no longer zoom in while walking. There
is one street view now, and the way to look closer is to go and stand there. That is
the direct consequence of "the body never changes size while he walks", and it is
the trade the row asked for in those words.
