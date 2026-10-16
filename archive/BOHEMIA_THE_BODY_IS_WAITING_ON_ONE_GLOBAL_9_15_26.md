# THE BODY IS WAITING ON ONE GLOBAL, AND RAISING THE BAKE ALONE IS A REGRESSION
ANIMATION lane, 9/15/26, rule 16 THE STEP IS A HOUSE. Round two on his ruling.

## WHAT I CAME TO DO, AND WHY I DID NOT DO IT
Last round this lane put the cast size in one constant (CAST_PX) and priced the
move to the rig's native 112, then said the size was RUN's call. My own handoff
said it "waits on RUN's constant". **Rule 12 says a dependency is a PREMISE, not a
gate: measure first.** So I measured, and the premise was wrong in both directions.

## THE NUMBER ALREADY EXISTS, AS A RATIO
LIFE+CITY shipped `[lot lattice]` and CHARACTER shipped the body side. Between them:

    BOH_LATTICE: LOT_FINE = 24 fine cells per lot, LOT_M = 18 m, BODY_LOTS = 0.5
    BODY_SCALE:  lotFine 25 (measured median lot pitch), bodyLots 0.5, stepFine()

His "about half a lot tall" is not a number somebody still has to pick. It is a
RATIO, and it is already named. So this lane was never actually blocked on a size.

## BUT THE WHOLE CHAIN IS ARMED AND SWITCHED OFF, AND THAT IS ONE GLOBAL
`BODY_SCALE.stepFine()` reads `window.BOHEMIA_STEP_FINE` and falls back to 1,
"today's person-scale step", with CHARACTER's own comment: "RUN'S ONE NUMBER, when
it lands... the day RUN sets it the body moves with the street and nobody has to
remember to come back here." That is correct and well built.

**MEASURED: nothing anywhere sets `BOHEMIA_STEP_FINE`.** One read, zero writes,
across every slice, engine module and tool. So `stepFine()` returns 1, and
`bodyLadder` takes its `if (step <= 1)` branch and never reaches the "half a lot"
line at all. The body is drawn on the OLD ladder.

    at the walk zoom HC = 44
    his ruled size    0.5 lots x 25 fine x 44 px  = 550 px, nearest rung 224
    what is drawn     the legacy branch, C >= 32  = 112 px

**His ruling is wired end to end and waiting on one global that nobody publishes.**
That is RUN's to set (the law gives RUN the step), so it is reported here and not
touched. It is not a bug in anybody's code: every piece does the right thing the
moment the number lands.

## AND THE OBVIOUS FIX IS A REGRESSION, MEASURED
The street draws the body into a **112 px** box today. This lane ships **56**, which
is the rig's native 112 halved. So every person on the street right now is a 112px
body made by doubling a 56px image that was itself a halved 112: **real pixels are
thrown away and then guessed back.** Rendered side by side at the size he actually
sees, the difference is plain -- the 56 path is 4px blocks with a mush face, the
112 path has eyes, separated legs and shoes.

Every number said raise it:

    shipping 112 vs 56   payload 2.14x   bake time 0.94x   page errors 0
    phone-side pixels    0.95x, because arriving at 112 removes a whole rung
                         from the EPX ladder the city caches

**And raising it alone would still have been a regression.** Measured on the city's
own `epx2` and its own rung chooser:

    ship |  epx2 -> _hd | what C>=32 uses | drawn into a box of
      56 |          112 |             112 |                 112
     112 |          224 |             224 |                 112

The city builds its ladder by **doubling whatever it is sent**, exactly once at the
walk zoom. Ship 56 and it hands over exactly 112. **Ship 112 and it hands a 224px
picture to a 112px box.** I would have shipped that if I had trusted the arithmetic
instead of running it.

The shipped size is already in the message (`m.w`), so the receiving side can learn
it in one change -- but that file belongs to the lane that owns the draw, and
crossing into it is the one-system-one-session rule. So the coupling is GUARDED,
not crossed.

## WHAT SHIPPED
Nothing about the rig or the constant changed. What shipped is the guard, in
`gates/one_number_for_a_body_gate.js` (ONE NUMBER FOR A BODY, now 12 claims).

**THE FIRST CUT OF THE GUARD WAS WRONG AND A MUTATION CAUGHT IT.** I asserted "CAST_PX
is one of the city's rungs, and every rung is a doubling away from it". CAST_PX=112
passed that -- 112 IS a rung, and 28/56/112/224 are all powers of two from it -- so
the exact regression I was guarding against walked straight through.

The real invariant is narrower: at the walk zoom the city doubles the shipped sprite
**exactly once** into the rung it draws at, so **2 x CAST_PX must equal that rung**.
56 doubles to 112 into a 112 box. 112 doubles to 224 into a 112 box. Now 112, 48 and
28 are all caught.

## FOR WHOEVER OWNS THE STREET DRAW
Two changes make the body sharp, and they have to land together or the gate bites:
1. the city's sprite ladder reads the shipped size off `m.w` instead of assuming 56;
2. this lane raises CAST_PX to 112 in the same round.
It costs 2.14x on the wire and **0.95x on the phone**, because the doubling it
removes is a rung the city was caching anyway.

## FOR RUN
`window.BOHEMIA_STEP_FINE` is read by CHARACTER's BODY_SCALE and written by nobody.
Setting it is what turns his ruling on: the body goes from the legacy 112 rung to
the ruled 224, on the street, without anybody editing a renderer.
