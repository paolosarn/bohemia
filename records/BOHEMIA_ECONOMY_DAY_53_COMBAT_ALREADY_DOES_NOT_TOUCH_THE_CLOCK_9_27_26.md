# ECONOMY -- ROUND 53, Q53 [two clocks], ROUND ONE OF TWO
# 9/27/26. MODE: RESEARCH -- NOTHING IN THIS FILE IS IMPLEMENTED.
# Board row: VAMILY.md, economy-vamily-knxaeh, blind spot 3.
# records/BOHEMIA_THE_BLIND_SPOTS_9_27_26.md item 3: "THE CLOCK ACROSS TWO SCALES.
# On the map time passes as you travel (days); on the street it passes on the beat
# (seconds). A day is one battery; a fight is thirty seconds. Which clock is the
# debt on? ... one ledger."

THE HEADLINE: THE MAP CLOCK AND THE STREET CLOCK ARE ALREADY ONE CLOCK, MEASURED,
NOT ASSUMED. The real second clock the blind spot is reaching for is not the map
versus the street, it is EITHER OF THOSE versus COMBAT -- and combat already
refuses to touch the clock at all, which turns out to be exactly what the named
reference game does too. The debt of one a night is unambiguously on the shared
day clock. What a day of travel costs against a day standing still is also
unambiguous: identical, because nothing in the purse's four verbs reads distance
or activity, only whether the day happened at all.

===========================================================================
1. WHAT THE REPO DOES TODAY -- MEASURED, THE REAL CODE PATHS TRACED, NOT ASSUMED
===========================================================================
### 1a. THERE IS ONE CLOCK, NOT TWO, AND IT IS ALREADY SHARED

engine/bohemia_dayloop.js defines the day as a fixed shape: WAKE_MIN 06:00,
NIGHT_MIN 22:00, DAY_MIN 24*60 -- 960 minutes of waking day, always. The city's
own `advance(mins)` function (slices/BOHEMIA_CITY_WORLD.html:36651) is the ONLY
thing that ever calls `DAY.tick(mins, ...)`, and in the same breath it calls
`partiesAdvance(mins)`, which converts those same minutes into fractional days
for the OVERWORLD company movement:

    function partiesAdvance(mins){
      var waking=(DAY.NIGHT_MIN|0)-(DAY.WAKE_MIN|0);
      ...
      BohemiaParties.advance(ps, partiesCellsPerDay(), (mins||0)/waking);
    }

So the "day" the map counts travel in and the minutes the street counts walking
in are the SAME NUMBER, read through two units: raw minutes on the street
(`advance(10)` fires once per cell walked, MIN_PER_CELL=0.084 minutes per cell
elsewhere in the file), and minutes-over-waking-hours (a fraction of a day) for
how far a company gets on the overworld. There is no second clock here to
reconcile; WORLD already reconciled it, the first time `advance()` was written
to also drive parties (9/13, [parties move]), and neither the map nor the street
half of the blind spot's premise needed anything new this round.

### 1b. COMBAT NEVER TOUCHES EITHER CLOCK -- AND THIS WAS PROVEN, NOT ASSUMED

Searched the whole slice for every line containing `advance(` cross-referenced
against every line containing fight, combat or beat (case-insensitive): ZERO
matches. Every fight entry point -- `roadContactFight`, `streetFightOnStep`,
`fightZoomIn`/`fightZoomOut`, the encounter handoff (`cityHandOver`) -- calls
none of `DAY.tick`, `advance()`, `DAY.wake()` or `DAY.sleep()`. The only two
things that ever move the day loop forward are `advance(mins)` (walking and
other timed actions) and the explicit sleep button (`DAY.sleep()` at nightfall).

A fight is discovered ON a walked step (`roadContactFight` fires from the same
step handler that already paid its own `advance(10)`), and the fight itself --
however many beats it runs, 120 BPM, BEAT=500ms per beat -- is handed off to a
different screen and returns without ever calling the clock. So A FIGHT OF ANY
LENGTH COSTS EXACTLY ZERO ON THE DAY CLOCK, whether it is three beats or three
hundred.

### 1c. THE LOAN'S NIGHT IS ON THAT SAME SHARED CLOCK, UNCONDITIONALLY

`loanNight()` (which calls `BohemiaLend.due/paid/short`, charging DUE_A_NIGHT)
is called from exactly one place: `onNightfall()`, the function the day loop
fires once per `DAY.day` tick, in a fixed sequence alongside `upkeepPost('day:ate')`,
`nightPower()`, `blockRent()` and `mktAdvanceDay()`. All five fire together,
once, whenever the day loop's phase flips from 'awake' to 'ended' -- which is
driven only by minutes accumulated through `advance()`, never by beats.

ANSWER TO PART (a), MEASURED: the debt of one a night is on THE SHARED DAY CLOCK
that the map and the street already agree on. It is never on the beat clock,
because the beat clock is not wired to the day loop at all. A fight that runs
long does not create a second nightfall, does not double-charge the loan, and
does not skip a night either -- it simply does not exist from the clock's point
of view.

### 1d. A DAY OF TRAVEL AND A DAY STANDING STILL COST THE SAME, MEASURED

The four frozen verbs (`day:ate`, `fight:plate`, `night:power`, `ask:leaned`)
each debit exactly 1, always, with no distance, headcount or activity-type
argument in `upkeep(purse, verb, ref, day)`'s signature (round 52 already
measured this shape for company size; it holds here for distance too). `day:ate`
fires once per nightfall regardless of how many cells were walked that day,
because `onNightfall()` is reached purely by minutes crossing NIGHT_MIN, and
nothing about WHICH minutes (walking across the valley vs. standing on one
block) changes what fires. There is no travel-specific charge anywhere in the
purse, the lend module, or the day loop.

ANSWER TO PART (b), MEASURED: a day of travel costs EXACTLY what a day standing
in one place costs, in batteries. Both are one `day:ate` (1 resource), whatever
`night:power` your held circuits demand, whatever rent is owed, and the loan's
one battery if an account is open. Nothing here reads distance.

===========================================================================
2. AISLE TWO -- THE BEST GAME HE HAS NAMED FOR THIS DEPARTMENT (Battle Brothers,
   the campaign layer and the overworld, rule 33)
===========================================================================
RESEARCHED, AND IT CONFIRMS OUR SHAPE RATHER THAN BREAKING IT, WHICH IS WORTH
SAYING PLAINLY BECAUSE IT IS THE LESS COMMON OUTCOME OF THIS EXERCISE:

  DURING COMBAT, THE PASSAGE OF TIME IS HALTED. Battles do not consume a day and
  do not advance the campaign clock at all -- you can take as long as you need in
  a fight without it costing calendar time. A full in-game day takes about 1
  minute 45 seconds of real time on the world map; the clock keeps running while
  you travel (provisions consume, gear repairs, wounds heal) and HALTS during a
  town visit or an event dialogue, exactly the way it halts during a fight.

  Hired characters consume 2 provisions a day, FLAT, and camping burns through
  supplies at the same rate as marching does -- confirmed by the game's own
  community discussion threads rather than assumed: "you still burn through your
  supplies while camping," which is the same shape as travel.

SO BB, THE NAMED REFERENCE FOR THIS EXACT DEPARTMENT, HAS ALREADY MADE BOTH OF
THE SAME CALLS OUR CODE MAKES, INDEPENDENTLY: combat does not touch the campaign
clock, and a day's provisions cost the same whether you marched or camped. This
is not a case of us copying BB or BB copying anybody; it is two systems solving
the same abstraction problem (a tactical combat layer nested inside a calendar
layer) and landing on the same answer, which is a real, if modest, confirmation
that our current shape is not an oversight.

===========================================================================
3. THE REAL WORLD
===========================================================================
### 3a. AND THE REAL WORLD IS THE ONE THAT DISAGREES WITH BOTH OF US

Real armies on the march ate meaningfully MORE than armies standing still. A
non-marching man's ration was roughly three pounds of food a day; an actively
marching soldier -- shouldering a pack, pulling stakes, swinging an axe, setting
up camp -- needed up to 5,000 calories a day to do it, a real and substantial
premium over standing garrison duty. The limiting factor on how far an army could
move was usually not marching endurance at all but how fast the supply train
could keep up, which is its own tell: real logistics treated a marching day and
a standing day as different economic events, worth planning around separately.

THIS IS THE "ONE FINDING THAT PROVES US WRONG" THE ROUND OWES, AND IT IS AGAINST
THE REAL RECORD RATHER THAN AGAINST BB OR OUR OWN CODE, BOTH OF WHICH ALREADY
AGREE WITH EACH OTHER AND DISAGREE WITH IT. A day of travel realistically costs
more than a day standing still; our game and its named reference both charge the
same for either.

===========================================================================
4. THE FINDING
===========================================================================
BLIND SPOT 3, AS WRITTEN, POINTS AT THE WRONG SEAM. "The map passes days, the
street passes beats" reads as if those were two clocks in tension; measured,
they are one clock (minutes), read in two units, and WORLD reconciled them on
9/13 without anybody asking. The real seam -- the one place a second clock could
plausibly exist -- is COMBAT's own beat, and it turns out that seam was never cut
at all: nothing in the fight ever calls the clock, which independently is also
how Battle Brothers, the named reference for this exact layer, handles its own
tactical combat. One ledger, confirmed, not built.

THE GENUINE TENSION IS ELSEWHERE: THE REAL WORLD, NOT OUR OWN DESIGN OR BB'S,
IS THE ONE SAYING A TRAVEL DAY SHOULD COST MORE THAN A STANDING DAY. That is a
content number (MECHANISM-MINE / CONTENTS-PAOLO'S), not ruled here, and not
invented here -- named for round two to give it a defensible shape rather than a
number, the same way round 52 handed WORLD a shape for a rung's weight without
picking one.

===========================================================================
5. WHAT THIS ROUND DID NOT MEASURE, SAID PLAINLY
===========================================================================
- Whether a very long fight (dozens of beats, a boss ladder encounter) SHOULD
  ever cost something on the day clock as a design choice, versus being free by
  the same convention BB uses. Not measured because it is not measurable, it is
  a design intention; named for COMBAT/UI rather than guessed at here.
- The exact real-world ratio of a marching day's food to a standing day's food
  as a clean number (sources gave "up to 5,000 calories" marching against "three
  pounds" standing, which are different units and not cleanly divisible without
  more assumptions than this round is willing to make up).
- Whether roads-vs-dirt travel speed (rule 33's own "roads faster than dirt")
  changes this cost question. Measured separately (partiesCellsPerDay takes the
  cross-country baseline only, self-documented as unbuilt for roads) and it is
  WORLD's own named gap already, not new to this round.

===========================================================================
6. ROUTED
===========================================================================
WORLD        nothing broken. Section 1a confirms the clock unification your own
             9/13 [parties move] row already did; section 1b confirms combat
             correctly never touches it. Nothing to fix.
COMBAT / UI  worth knowing for the "one HUD across map/street/fight" gate (rule
             33): a fight currently costs zero on the day clock no matter its
             length, matching Battle Brothers' own convention. If that is ever
             meant to change (a very long fight burning a nominal amount of
             daylight), that is a design call, not a bug, and it is not made here.
COORDINATOR  blind spot 3, as filed, describes a seam that is already closed
             (map/street). The seam worth watching is combat's, and it is
             already closed the same way BB closes it. Worth a note back into
             records/BOHEMIA_THE_BLIND_SPOTS_9_27_26.md if that file gets folded.

===========================================================================
7. THE [bb ...] SCHOOL LINE (rule 33, every chat, continuously)
===========================================================================
[two clocks] Battle Brothers halts its own campaign clock during a fight and
charges the same daily provisions whether the company marched or camped that
day. Our code, built independently, already does both of those exact things.
The place BB and our game would actually disagree -- whether a travel day
should eat more than a standing one -- is a fight neither of us picked; it is
the real record's argument against both of us at once.

===========================================================================
8. THE ANALOG HORROR LINE (rule 20h, every chat)
===========================================================================
A company can spend a whole day marching across the dead valley, or spend that
same day standing in one dead room, and the ledger writes down the identical
sentence for both: the day ate one. Distance leaves no mark anywhere the game
can read. THE HORROR IS THE ODOMETER THAT NEVER MOVES: you can walk until your
legs give out and the book will tell you, forever, that you went nowhere at all.

===========================================================================
9. NOT IN A TAB YET
===========================================================================
This record and round two are research. The day loop, the loan and the four
verbs are live in the demo's day loop, reachable by playing, but nothing about
whether a travel day should cost more has been built, ruled, or put anywhere
he can see.
