# THE WRONG COLOUR REACTS
FACTIONS lane · VAMILY row `[crossing costs]` THE-WRONG-COLOUR-REACTS · 9/12/26

## THE ONE LINE
Every block in the valley has an owner and walking onto somebody else's cost
nothing. Now a stranger on your block gets a look, then a tail, then a stop, and
how far it goes is how far that faction reaches.

## THE MANAGER'S CALL, 9/5
> "Colour is territory and nothing happens when you walk into the wrong colour.
> The moment you cross into a faction's block that does not know you: **a look,
> then a tail, then a stop**, on the beat, before any fight; the block's colour is
> the only warning."

## MEASURED BEFORE BUILDING, AND HIS SENTENCE WAS LITERALLY TRUE
On the walked surface the player wakes on the Mob's **fortress** ground with 61
people on screen. **Every single one reads `nothing`.** Church ground begins two
cells away and crossing it changes nothing either. The organ that decides whether
a body is against you reads four facts — their outfit versus yours, their own
opinion of you, whether their outfit joined a coalition, and whether anybody is
still paying them — and **not one of them is "you are standing on their ground."**

## IT GRANTS SIGNS, NEVER A LEVEL, AND THAT IS THE WHOLE CARE IN IT
The obvious build reads "a stop" and reaches for the `block` sign. `block` lives on
`war`. That would mean a stranger who walked three blocks is **at war** with a
faction he has never met — a severity nobody ruled, over a map that is his.

But the module's own header already says the **signs** are the escalation ("they
watch, they follow, they block a door, they refuse") and the levels merely bundle
them. So crossing hands out signs directly and never touches the ladder:

    a look -> watch        a tail -> follow        a stop -> block

`refuse` is deliberately **not** among them. Withholding trade is what an unpaid
landlord does (`[block rent]`, last round), not what a stranger on a street earns.

And when they already had a reason, the ground **adds** to it: the signs are
unioned and the level is untouched. Walking onto a block cannot talk a cold body
into a war.

## HOW FAR IT GOES IS THEIR REACH, NOT A NUMBER I PICKED
The caller passes how many blocks of their ground you have crossed and that
faction's `REACH` — the table that already decides how far a town's arm extends.

    fortress  3   a look, then a tail, then a stop
    town      2   a look, then a tail, and never more
    camp      1   a look, however deep you go

**"A fortress reaches further than a camp" is turf_gate's own headline**, applied
to people instead of ground. A camp cannot stand in your way, and that is the same
sentence the map already lives by.

How many blocks you have crossed is `TURF_USED`, which `[block rent]` already
counts and already dedupes by block. Nothing new is tracked for this row.

## ONLY THE FACTION UNDER YOUR FEET REACTS
A Church body across the valley does not turn round because you walked Church
ground an hour ago. His sentence is *"the moment you cross INTO a block"*, which is
where you are standing. Proved: standing on Cartel ground having walked nine blocks
of Anarchist ground, the Anarchists get nothing.

## THE BEHAVIOUR WAS ALREADY BUILT AND GATED
This row added the **reason**, not the reaction. `ctFollowStep()` already moves
bodies toward you on `follow`, already stands one in a doorway on `block`, and
already turns heads on `watch`. All of it was waiting on somebody having a reason.

## DRIVEN ON THE REAL SURFACE
Through the city's own `ctAgainstMe`, on a real body, on their own ground:

    off their ground                     nothing
    one block in                         watch          "YOU ARE ON THEIR BLOCK AND THEY DO NOT KNOW YOU"
    two blocks in                        watch, follow  "YOU ARE STILL ON THEIR BLOCK, AND SOMEBODY IS WALKING BEHIND YOU"
    nine blocks into a FORTRESS          watch, follow, block
    nine blocks into a TOWN              watch, follow          <- capped
    level, at every depth                null, rank 0

## TWO HONEST FINDINGS, REPORTED RATHER THAN PAPERED OVER
**A block is bigger than a long walk.** 420 real steps through `stepOnce` never
left one block of Cartel ground, so the tail was never owed. The gate says that in
its own output instead of forcing a follower to appear.

**And most of the valley has nobody of the holder standing on it.** A faction holds
hundreds of blocks; its members live within about twelve cells of its seat. At the
spawn, 0 of 61 people run with the Mob who hold that ground — the same fact this
module's own header recorded on 9/5. The mechanic is live and reachable, and where
it fires is where a faction's people actually are.

## GATES
`against_gate` 78/0, up from 66 — extended, not duplicated. Eleven new claims on a
**fresh page**, because the sections above it deliberately make the player an enemy
and this one is about a stranger.

**Four of my own probes were wrong before one was right, and every one of them was
the instrument:** zeroing the block counter while standing on the block (it floors
at one, correctly); teleporting the player and asking about a frame that was never
painted; moving the map cursor in walk mode, which is the fault this very file
records under `__ROAD_INTERRUPTS_ON_FOOT__`; and pre-setting the block count before
a walk that immediately recounted it. The game was right every time.

Green alongside: coalition 40/0, faction towns 81/0, engine sync zero drift, demo
build 25/0, alpha loads 20/0.

## [PENDING Paolo] — NOTHING NEW
The row needed no ruling. The three stages are his three words, the signs are the
module's own, and how far each faction takes it is the reach table the map already
uses.
