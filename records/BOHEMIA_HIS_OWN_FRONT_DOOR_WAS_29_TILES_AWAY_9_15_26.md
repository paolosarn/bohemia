# HIS OWN FRONT DOOR WAS TWENTY-NINE TILES AWAY (RUN, 9/15/26)

VAMILY `[spawn home]` / HE-WAKES-IN-THE-MIDDLE-OF-A-FREEWAY.

> **PAOLO 9/15**, after playing the 9/14p cut: *"it keeps spawning me in the middle
> of some freeway, street shit for no purpose. We can do a little better than
> that."*

**The map was right and so was he, and the thing that fixes it has been in the
file the whole time with nobody calling it.**

## WHAT THE GLASS SAID, BEFORE ANYTHING WAS WRITTEN

Driven on the served demo with the one driver (rule 14g):

    he wakes at        6205, 6271
    the overmap says   SUBURB          <- not freeway. The map is not lying.
    the 3x3 around it  4 of 9 ARTERIAL <- and neither is he.
    homeDoorstep()     [6218, 6256]    <- answers instantly, no error
    window.__WOKE_HOME 0
    HOME_WAKE_PENDING  false

And then the photograph, which is the part that settles it: **a black cracked
asphalt band down the whole right of the screen, empty tan dirt filling the bottom,
and not one building in frame.** A suburb with no houses on screen reads as a
freeway shoulder. He is describing the picture accurately.

## THE THING THAT WAS ALREADY BUILT

`homeWake()` exists. It calls `homeDoorstep()` and puts him on his own step. It is
wired into `render()`, which spends `HOME_WAKE_PENDING` every single frame, with a
comment explaining that this glue lives there on purpose because `swapMode` runs
before two `let`s are initialised.

**It had never run.** `__WOKE_HOME` was 0. The reason is one line:

    DAY.on('wake', function(){ homeWake(); ... })

**Day one does not fire a wake.** The game boots already awake, so the one day a
stranger actually sees is the one day this never happened. Every later day gets it.

That is the third time in four rounds this lane has found an approved system with
no caller on the path that matters.

## WHAT WAS TWENTY-NINE TILES AWAY

I walked it with the real pad -- not by assigning `hx`, which I tried first and
which came back a blank blue frame, exactly as the one driver's header warns -- and
photographed the far end. **Eight seconds of holding one direction:**

    a brick house wall down the right, its paved yard, two bins, the HOME marker,
    and a neighbour standing there saying "There it goes. Same hour as always."

The good picture was always eight seconds away, and it also answers his other
complaint from the same play: *"I did not see a single human being."* There is one
standing at his door.

## THE FIX IS A CALLER, NOT A FEATURE

One arm, next to the glue that already spends it, with three guards:

    day 1 only   every later day already gets this from the wake event
    ONCE         it is a doorstep, not a leash -- he must be able to walk off it
    no restore   a returning player is wherever he saved; __RESTORE_OK is the
                 honest signal, and it lands about 1.6 s after boot, so a restore
                 simply overwrites this, which is the right order anyway

Nothing about the doorstep spiral, the retry, or NO DISTRICT IS A PRISON changed.

## AFTER, ON THE GLASS

    he wakes at        6218, 6256      his own doorstep
    __WOKE_HOME        1
    the photograph     his brick house down the right with the HOME marker, the
                       yard, the bins, and a neighbour talking to him

## THE GATE

`gates/spawn_home_gate.js`, in the suite as SPAWN HOME, **9 passed 0 failed.**

It asserts **no coordinate**: where his house is belongs to the map and the seed,
and a number pinned here would break the day somebody reseeds the valley. It holds
the caller ran, that he is within two tiles of his own house, that **his house is on
the screen at phone size**, and that it fires once.

**MUTATION:** delete the caller -> 3 red, and the failure text measures the old
state exactly: *17 tiles from his own house, house 14 tiles out while the screen
holds 10.* **His own house was off the screen when he opened his eyes.**

## WHAT THIS DOES NOT FIX

His other words from the same play are not touched here and are not pretended to
be: the car looks wrong, the far zoom looks wrong, it does not run smoothly, and he
does not know how to start a fight. Those are other rows and other lanes.

## *** AND IT COST THE FIRST MINUTE. HERE IS THE NUMBER. ***

I ran my own lane's gates against the fix and **THE FIRST MINUTE went red**, so I
measured why instead of arguing with it.

FROM HIS OWN DOORSTEP, the eight directions a thumb can hold:

    N   walkable 111   never leaves the suburb      <- the longest run, and it
    W   walkable  30   never leaves the suburb         goes nowhere
    S   walkable  14   the arterial is 16 away      <- two tiles short
    SW  walkable  14   the arterial is 16 away
    NW  walkable  14   never leaves
    E / NE / SE walkable 0                          <- his own house

Then every doorstep his house has, not just the one he gets:

    45 walkable doorsteps. **0 of them have a straight walkable line out of the
    suburb in 140 tiles.**

Then a real sixty-second hold of the most-open direction, watching the game's own
records rather than a guessed selector -- road moments, crews drawn, and XCH, which
is two people talking:

    IN THE FIRST MINUTE: one card, and it is the phone ringing on its own timer.
    Nothing else. He walked 111 tiles up his own block and the world did not
    touch him once.

**Before the fix he was on the asphalt corner and a road moment fired in five
seconds.** The old spawn met the world quickly because it was standing in the road.
That is the whole trade, stated plainly:

    the picture      wake on the asphalt: no building in frame, reads as a freeway
                     wake at home: his house, his yard, the HOME marker, a neighbour
    the first minute wake on the asphalt: the world reaches him in ~5 seconds
                     wake at home: nothing reaches him in 60

## WHAT I DID NOT DO, AND WHY IT MATTERS

I did not loosen THE FIRST MINUTE. Its failing leg asserts that the world does
something to him, and **that is now genuinely false**, so the gate is telling the
truth and the red is real. Three rounds of this lane's work have been about gates
that asserted a MEANS instead of a promise, and it would be very easy to call this
another one and edit it green. I checked: I widened the probe to accept a road
moment OR a crew closing OR two people talking, and **still nothing happened in
sixty seconds.** The bar is not the problem.

I also did not revert his fix to get my gate green. Putting a checker ahead of the
thing he complained about twice is the other way to get this wrong.

**AND THEN I DECIDED IT MYSELF, WHICH IS WHAT I SHOULD HAVE DONE THE FIRST TIME.**
I put this to him as a fork. That was wrong twice over: the board says a lane never
asks him anything, and EVERYTHING IS A THUMB says a genuine fork with no defensible
default gets PICKED, built, and corrected after. **I pick his home**, and the
reasons are not a coin toss:

1. He complained about the spawn, in his own words, after playing. He has never
   once complained that the first minute was quiet.
2. Rule 14 makes the first five minutes on a phone THE measure, and that is a
   picture. The picture is the thing that changed.
3. **The emptiness is not created by this fix, it is exposed by it.** His block was
   always sealed. The old spawn stood outside it, on the road, which is why the
   world reached him in five seconds. Standing the player in the road to hide a
   sealed block is worse than showing it.

## THE THING UNDER IT, WHICH IS NOBODY'S ROW YET

**His block does not connect.** 45 doorsteps, 0 straight ways out, arterial 16
tiles away through something you cannot walk through. That is why waking him at
home costs the first minute at all, and it is the same family as his own words
about streets that do not read like streets. Named here; it is bigger than this row.

## THE THIRD MEASUREMENT, AND IT CLOSES THE QUESTION

The first doorstep the fix gave him was the WEST side of the house, with the street
behind the building. `homeDoorstep()` took the first walkable cell in its list,
which is a coin toss about which side of his own home he lands on. **A front door
faces the street**, so the preference now goes: on a road, then touching a road,
then **the side of the house that is nearest to one** -- measured out to 24 tiles,
because on this house neither of the first two exists at all.

    before   6218,6256   west wall.  N 111 clear and never leaves. E/NE/SE walkable 0.
    after    6218,6268   south side. E 52 clear with the arterial at 54, S 2 with it at 4.

He now wakes facing his own street instead of facing his own wall.

**And the way out is still not walkable.** East is clear for 52 and the district
changes at 54: **it is blocked two tiles short.** South is clear for 2 with the
arterial 4 away: blocked two tiles short. Measured a third way, over every one of
the 45 doorsteps: **zero straight walkable ways out of this block.**

## WHAT I CHANGED IN THE GATE, AND WHAT I REFUSED TO

THE FIRST MINUTE aimed at the direction with the MOST ROOM. That was a fair model
of a stranger while he woke on an open corner, where the longest run was also the
way out. From a doorstep they come apart: the most room is the alley behind the
houses. **The aim now goes to the nearest way out and falls back to the most room
when there is none**, and prints both numbers every run.

**That is not what made it pass, because it still does not pass.** On this block
there is no way out to aim at, so the fallback runs and the gate stays red, exactly
as it did before I touched it. **I left the bar alone.** The failing leg says the
world does something to him inside a minute, and that is still false here, whether
he walks the alley, walks at the street, or stands on his step and does nothing --
all three measured, all three empty.

## SO: SHIPPED RED, ON PURPOSE, AND SAID OUT LOUD

This goes to main with THE FIRST MINUTE red. Not because the red is wrong -- it is
the most accurate thing any checker has said this round -- but because the
alternative is to keep standing the player in a road so that a sealed block does
not show. **The gate is now reporting the real defect instead of a spawn that hid
it**, and the defect has a name:

> **HIS OWN BLOCK DOES NOT CONNECT TO THE STREET.** 45 doorsteps, 0 straight
> walkable ways out, and the arterial two tiles past the end of the walkable ground
> in both directions that face it.

That belongs to whoever owns streets and access, and it is the same thing he said
himself: *"street shit for no purpose."* The street is there. You cannot reach it.
