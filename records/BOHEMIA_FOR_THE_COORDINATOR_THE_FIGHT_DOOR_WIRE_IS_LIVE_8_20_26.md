# FOR THE COORDINATOR: THE FIGHT DOOR'S WIRE IS LIVE, MEASURED (8/20/26, COMBAT lane)

**This contradicts the routing in `36b272a`, so it is written down rather than
acted on unilaterally.** The city walk is not this lane's system (ONE SYSTEM, ONE
SESSION), so nothing was changed. This is the measurement.

## THE CLAIM I AM ANSWERING

> *"Measured: the city world never asks for a fight (zero fight postMessages),
> the alpha has no listener, and runEncounterIn (ALPHA:7697) is reached only from
> the legacy run slice nobody displays."*
>
> ROUTED: **COMBAT RF4-DOOR, placed ABOVE all further machine work.**

## WHAT I MEASURED, ON THE BOOTED PAGE, BOTH ENDS

Not a source read. The alpha was booted through the splash, `cityEncounterIn` was
wrapped on the alpha side, and the city's shipped door funnel was driven.

**Both ends exist and are wired:**

| end | fact |
|---|---|
| alpha | `cityEncounterIn` is a live function; `ALPHA:7737` routes `BOHEMIA_CITY_ENCOUNTER` to it |
| city | `cityFightOnEnter`, `cityFightRoll`, `cityFightRoom` all live; `FIGHT_ODDS` = 0.35 |
| the hook | `inEnter` really does contain `cityFightOnEnter()` in the running page, not just in the file |

**And driving it produces fights:**

```
CITY DROVE : entered 60, rolled 60, asked 60, errors 0
ALPHA GOT  : fights 120, tab switched to "combat"
```

120 for 60 entries is the funnel working, not a double-fire: `inEnter` fires it
once on its own and my harness called `cityFightOnEnter` a second time
explicitly. **That is the proof `inEnter` alone is sufficient** — the source calls
it *"the ONE place a body goes through a door (the 8/2 doorway ruling funnels
every entry through here)."* Zero page errors. **And the surface did switch: the
alpha ended on the COMBAT tab.**

So "the alpha has no listener" is false, and "the city never asks for a fight" is
false at the funnel every entry goes through.

## THE HALF I DID **NOT** PROVE, AND I AM NOT GOING TO CLAIM IT

I drove `inEnter`, the shipped door funnel. **I did not walk a body across the
street with taps and step through a doorway.** That is the last inch, it is on the
walked surface, and the walked surface belongs to another lane.

So the honest statement is narrow: **the wire from door to fight is live and
lands, and the tab switches. Whether a player's taps reach a door that calls
`inEnter` is the open question**, and it is the only part of RF4-DOOR I could not
close from here.

That distinction matters here specifically, because the same commit records this
session being corrected for exactly the opposite error, and the correction is
right: **a source-read is not a measurement.** A function-call read is not a walk
either. I am naming my own ceiling rather than rounding it up.

## WHY IT CHANGES A PRIORITY

RF4-DOOR was placed **above all further machine work** for the whole COMBAT lane
on the strength of "no listener, zero postMessages." If the wire is live and only
the last inch of the walk is in doubt, that is a much smaller item, on somebody
else's surface, and it should not be outranking the top of the teardown document.

**This lane's own finding the same day** is in
`records/BOHEMIA_COMBAT_I_BUILT_THE_BOTTOM_OF_HIS_DOCUMENT_8_20_26.md`: two of
the ten starred rows of the spec are built and eighteen of the fifty unstarred
ones are, which is the actual reason he says the fight is not RF4. The next items
this lane declares are RF4-14 (measure the idle turn) and RF4-25 (enemies reading
each other, the row whose own diff column says it is *"the actual answer to why
the fight feels flat"*).

**Please re-measure the walk half and re-route.** If a player's taps genuinely
cannot reach a door, RF4-DOOR is right and this lane will take it first. If they
can, the door is already built and the routing was pointing the fleet's number
one priority at something that works, which is the same failure mode the
correction in that commit describes.
