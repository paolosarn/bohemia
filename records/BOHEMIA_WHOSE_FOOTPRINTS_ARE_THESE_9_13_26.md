# WHOSE FOOTPRINTS ARE THESE
FACTIONS lane · VAMILY row `[tracks read]` WHOSE-FOOTPRINTS-ARE-THESE · 9/13/26

## THE ONE LINE
The valley has had twenty-eight parties walking it since `[parties move]` landed,
and they left nothing behind. Now they leave tracks, in their own faction's colour,
and the bright end tells you which way they went.

## THE NAMED BLOCKER WAS NOT THE BLOCKER. SIXTH ROW RUNNING.
The row says *"with RUN [travel map]"*, and `[travel map]` is still OPEN. Measured
before building: it does not block this.

    parties out right now      28
    factions with one moving   14 of 14
    speed                      89 cells a day, and they really advance
    ground they walk           the overmap, which the player already looks at

A track needs somebody to have walked, not a new map.

## DERIVED, NEVER STORED
A party's route is a straight sign-step walk between two points it already carries
(`from`, `to`, `at`, and whether it has turned round). So the cells it has covered
**are** those fields put through the same step rule the mover uses. Nothing is
written to a party, nothing is saved, and there is no rule for when to forget —
the trap the coalition and the roving rule both avoided in this lane already.

**A party that has turned round leaves a different trail.** Its leg begins at the
border it reached, not back at its seat, so the trail always points the way it is
walking *now*.

## NO MEMORY LENGTH IS INVENTED
How long a track is, is how far that party has walked on this leg, and how far it
walks is the distance between two of his seats. There is no fade constant, no
"tracks last N days", no decay. The one cap in the renderer is named a **rendering
bound** in its own comment: what fits on a screen without becoming a scribble.

## IT RIDES HIS OWN COLOURS, AND IT IS A TRAIL NOT A DOT
Tracks use `__holderInk`, the same function the territory borders use, so a Mob
track and Mob ground read as the same people with no second colour decision.
COLOUR IS TERRITORY, and a track is territory moving.

**A marker would say "somebody is there". Footprints say which way they went** —
which is the half the row is named for, follow or avoid. So the trail fades along
its length: faintest where they set out, brightest where they are standing now.

## TWO SURFACES, BECAUSE THEY ANSWER DIFFERENT QUESTIONS
**The map is for deciding.** Zoomed out, you see trails and plan around them.

**The street is for noticing.** Down there you cannot see a trail, you see that
somebody came past. It says who and how fresh, once, when the ground under you
first carries prints:

> *Anarchists came through here just now. a patrol, and they are close.*

It speaks only when the answer changes — one string compare per block crossed,
nothing per frame, the same shape as the address countdown beside it.

## THE FAULT I CAUGHT BY WALKING OFF THE TRACK
Stepping onto empty ground left the old sentence on screen. A line that was true one
cell ago and is a lie now is worse than silence.

**And it only clears its own words.** The street line is shared with the pack and
the road, so wiping it unconditionally would delete somebody else's sentence. It is
cleared only while it still says exactly what this put there.

## DRIVEN ON THE WALKED SURFACE AND THE DEMO
    parties 28, with a trail 20, longest drawn 13 cells
    TRACKS PAINTED ON A REAL CANVAS   8 factions, in their own ink
      Blues #0052db   Mob #db1800   Network #4a8ddb   Caravans #db9324
      Church #db9400  Cartel #c8a558
    turf borders painted alongside   14
    stood on an Anarchist patrol's prints -> the street said so
    stepped off -> the line cleared
    two more steps on the same prints -> it did not repeat itself
Identical on the demo. No page errors on either.

The Cartel comes out in the default gold because its measured wardrobe colour is
**drab** and there is no hue to lift — existing, deliberate behaviour, and the same
fact behind the standing question about whether the Cartel is drab on purpose.

## GATES
`faction_towns_gate` 111/0, up from 95 — extended, not duplicated. Sixteen new
claims: a track ends where they stand and starts where the leg did, a turned-round
party trails the other way, a party that has not moved has one cell rather than an
empty answer, nothing is stored and no field is written, the cap keeps the newest,
a bad party is null and not a throw, it names who and how long ago and which leg,
nothing where nobody walked, **the freshest set of prints wins**, the map uses the
border ink, it fades toward the start, the render publishes what it painted, the
street speaks only on change, **stepping off clears only its own words**, and no
memory length is invented.

Green alongside: turf 43/0, engine sync zero drift, demo build 25/0, alpha loads 20/0.

## [PENDING Paolo] — NOTHING NEW
The row needed no ruling. The colours are his answers, already measured off the
wardrobe; the trail length is his map; and the only number here is how much of a
line fits on a screen.
