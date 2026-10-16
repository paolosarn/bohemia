# THE SAME THING DOES NOT KEEP HAPPENING TO YOU
FACTIONS lane · VAMILY row `[repeat interval]` ENCOUNTER-REPEAT-INTERVAL · 9/7/26

## HIS RULING IS THE SPEC
> "The same encounter does not repeat for the same player inside THREE in-game
> days, and never twice on the same street in one day. Put it on a dial in DEMO
> SETTINGS with that default." (Paolo 9/5, through the coordinator.)

**Two rules, and both are load-bearing.** The three days sits on a dial and can be
turned all the way down; the street rule is the floor that survives when it is.
That is why he ruled two sentences and not one, and shipping only the first would
have left the second with nothing to do.

## WHAT THE GAME HAD
The director's own header said it out loud: `repeatAfterS` was
*"NOT RULED, so there is no default"*. So the two real surfaces each carried a
number I had invented to stop the world going silent, and both said so in a
comment: **an hour of walking** on foot, **two hours of travel** on the road.

And the second half of the ruling did not exist at all. The fired memory was
**global** with no place in it, and the director reads `world.district` and
nothing finer. It had no idea what a street was.

## THE RULER THAT WAS WRONG
`repeatAfterS` counts SPENT SECONDS. Three in-game days converted through that
ruler is 259,200 of them, which no walk ever spends, so the honest reading of his
ruling through the old mechanism is **"never again"**.

The game already owns the right ruler and prints it on the top bar: `T.day`, the
number in `DAY 3 · 14:30`. **His sentence named days, so the rule counts days.**
Nothing was converted and no conversion factor was invented.

## WHAT A STREET IS, AND WHO GETS TO SAY
The director owns no clock and no map, and must not learn one. So it asks: the
CALLER passes `world.day` and `world.place`, the same way it already passes the
district, the phase and the preconditions. The city answers at the finest grain
each mode actually has:

    on foot        the BLOCK he is standing on -- bounded by roads, so to somebody
                   walking it IS the street, and ctBlockOf already existed
    on the road    the overmap CELL, which is the whole of what the road knows

Measured on the walked surface, the key really moves under him:
`B12,12 -> B13,12 -> B15,12 -> B17,12`.

## THE FAULT THAT WAS THE WHOLE ROW
The first cut left BOTH memories live. **Twenty in-game days of walking produced
FIVE encounters, every one of them on day one, and the dial moved nothing no
matter where it was set** -- because the seconds memory said no first and the
calendar was never consulted.

Two rules answering one question do not add up. The stricter one silently eats
the other, and here that was **a control that does nothing**, which the settings
screen's own rule calls worse than no control at all.

**A calendar wins.** The seconds cooldown is what a caller with no days has, which
is every headless caller and the gate, and they are untouched.

## THE STORE IS NOT A LIVE WIRE
The dial first reached the city through `localStorage`, same origin, read fresh on
every step. It looked right. The gate caught it on the demo:

    shell store  {"encd":0}      <- two taps, the button says AGAIN SAME DAY
    city store   {"encd":7}      <- one tap behind

The shell and the walked city are **separate documents in separate processes**, and
a write on one side crosses to the other LATE. A dial trusted to that is a dial
that lies about the tap you just made. So the store is now only the BOOT value and
the live move arrives on the frame seam the STANDING dial and the town sizes
already use. **The proof line still prints both stores disagreeing while the city
reads the right number.**

## DRIVEN ON THE REAL SURFACE, AND ON THE DEMO
    the dial, in DEMO SETTINGS       AGAIN IN 3 DAYS, 156x44, his number
    taps                             3 DAYS -> 7 DAYS -> SAME DAY -> 1 DAY -> 3 DAYS
    five in-game days, one street    day 1, day 1, day 4, day 4 -- nothing in 2 or 3
    turn it to SAME DAY              the city reads 0 on the tap
      one day, three streets         5 events, one token found him on three streets
      one day, ONE street            2 events, each thing once   <- the floor

## WHAT IT COSTS, MEASURED AND NOT HIDDEN
Crossing the valley used to give **12 road moments a day**. It gives **4**. That is
not a regression, it is his rule's own arithmetic: twelve approved tokens, each
allowed once every three days, is four a day. The gate prints that sentence next
to the number so nobody later reads the bound as too high and nudges it.

## GATES
`encounter_gate` 69/0, up from 46 -- extended, never duplicated. His three is the
module's default; zero regression for every caller with no calendar; one memory
answers and never two (with the before-number in the claim); the dial is read when
the question is asked, not at page load; at zero days the same thing may find him
on another street and never on the same one; tomorrow the street is clean; the
street rule is per token; rare-is-sacred survives a calendar; the street memory
does not grow forever; and both surfaces really pass a day and a street.
`walk_encounter_gate` 25/0, up from 15 -- all of section F on the DEMO itself,
which is the surface his ruling named.
`the_road_interrupts_gate` 19/0, held.

**And two gate faults were mine, not the game's.** The card check reused a director
that had already spent its roster for three days, so it could never raise a second
card; the setup was reset, never the claim. And a probe measured the repeat gap on
a SPICE token, which never repeats by a rule older than this row.

## [PENDING Paolo] -- NOTHING NEW
The row needed no ruling. The dial's four steps (same day / 1 / 3 / 7) are
mechanism; the one that matters is his and it is the default.
